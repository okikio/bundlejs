import { encode } from "../src/deno/base64/mod";
import { compress } from "../src/deno/lz4/mod";
import { gzip, getWASM } from "../src/deno/denoflate/mod";

import { bytes } from "../src/utils/pretty-bytes";

// @ts-ignore
import { wasm as WASM } from "../src/deno/denoflate/pkg/denoflate_bg.wasm.js";

import * as fs from "node:fs/promises";
const encoder = new TextEncoder();

export async function build(src: string | Uint8Array | Promise<string | Uint8Array> = "./node_modules/esbuild-wasm/esbuild.wasm", target = "src/wasm.ts", mode: "gzip" | "lz4" | "base64" = "gzip") {
  const value = await src;

  if (typeof value == "string") console.log(`\n- Source file: ${value}`);
  const res = typeof value == "string" ? await fs.readFile(value) : value;
  const wasm = new Uint8Array(res);
  console.log(`- Read WASM (size: ${bytes(wasm.length)} bytes)`);

  let compressed: Uint8Array = wasm;
  if (mode == "gzip") {
    await getWASM(await WASM());
    compressed = await gzip(wasm, 11);
  } else if (mode == "lz4") {
    compressed = await compress(wasm);
  }

  console.log(
    `- Compressed WASM using ${mode} (reduction: ${bytes(wasm.length - compressed.length)} bytes, size: ${bytes(compressed.length)})`,
  );

  const encoded = encode(compressed);
  console.log(
    `- Encoded WASM using base64, (increase: ${bytes(encoded.length -
      compressed.length)}, size: ${bytes(encoded.length)})`,
  );

  console.log("- Inlining wasm code in js");
  const source = `\
  // @ts-nocheck
  export const source = async () => {
    const uint8arr = Uint8Array.from(atob("${encoded}"), c => c.charCodeAt(0));
    ${mode == "base64" ? `return uint8arr;` : `
    const mode: "lz4" | "gzip" | "base64" = "${mode}";
    if ('DecompressionStream' in globalThis && mode == "gzip") {
      const ds = new DecompressionStream('gzip');
      const decompressedStream = new Blob([uint8arr.buffer]).stream().pipeThrough(ds);
      return new Uint8Array(await new Response(decompressedStream).arrayBuffer());
    }

    const { ${mode == "gzip" ? "gunzip, getWASM" : "decompress"} } = await import(\"${mode == "gzip" ? "./deno/denoflate/mod" : "../../lz4/mod"}\");
    ${mode == "gzip" ? "await getWASM();" : ""}
    return await ${mode == "gzip" ? "gunzip" : "decompress"}(uint8arr);
  `}
  };
  export default source;`;

  console.log(`- Writing output to file (${target})`);
  await Promise.all([
    fs.writeFile(target, encoder.encode(source)),
    fs.writeFile("src/esbuild.wasm", res)
  ]);

  const outputFile = await fs.stat(target);
  console.log(
    `- Output file (${target}), final size is: ${bytes(outputFile.size)}\n`
  );
}

await build();

// import { source as gzipWASM } from "../src/deno/denoflate/pkg/wasm";
// import { source as brotliWASM } from "../src/deno/brotli/wasm";
// import { source as lz4WASM } from "../src/deno/lz4/wasm";

// await build(await gzipWASM(), "src/deno/denoflate/wasm-2.ts", "lz4");
// await build(await lz4WASM(), "src/deno/lz4/wasm-2.ts", "base64");
// await build(await brotliWASM(), "src/deno/brotli/wasm-3.ts", "gzip");