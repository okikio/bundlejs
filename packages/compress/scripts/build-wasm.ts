import { base64, ascii85 } from "@bundle/utils/utils/encoding.ts";
import { outdent } from "@bundle/utils/utils/outdent.ts";

import { compress as lz4, decompress as unlz4 } from "@bundle/compress/deno/lz4/mod.ts";
import { compress as gzip, decompress as gunzip } from "@bundle/compress/deno/gzip/mod.ts";

import { bytes } from "@bundle/utils/utils/pretty-bytes.ts";

import { compress as brotli, decompress as unbrotli } from "@bundle/compress/deno/brotli/mod.ts";
import { compress as zstd, decompress as unzstd } from "@bundle/compress/deno/zstd/mod.ts";

import { dirname, relative } from 'node:path';
import * as fs from "node:fs/promises";
const encoder = new TextEncoder();

export async function build([mode = "zstd", encoding = "base64"]: Partial<["zstd" | "brotli" | "gzip" | "lz4" | "none", "base64" | "ascii85"]> = [], src: string | Uint8Array | Promise<string | Uint8Array> = "./node_modules/esbuild-wasm/esbuild.wasm", target = "src/wasm.ts", importsPaths?: Partial<Record<"gzip" | "zstd" | "lz4" | "brotli", string>>) {
  const value = await src;

  if (typeof value === "string") console.log(`\n- Source file: ${value}`);
  const res = typeof value === "string" ? await fs.readFile(value) : value;
  const wasm = new Uint8Array(res);
  console.log(`- Read WASM (size: ${bytes(wasm.length)} bytes)`);

  console.time("Compression time")
  let compressed: Uint8Array = wasm;
  if (mode === "zstd") {
    compressed = await zstd(wasm, 22);
  } else if (mode === "brotli") {
    compressed = await brotli(wasm);
  } else if (mode === "gzip") {
    compressed = await gzip(wasm);
  } else if (mode === "lz4") {
    compressed = await lz4(wasm);
  }
  console.timeEnd("Compression time")

  console.time("Decompression time")
  if (mode === "zstd") {
    await unzstd(compressed);
  } else if (mode === "brotli") {
    await unbrotli(compressed);
  } else if (mode === "gzip") {
    await gunzip(compressed);
  } else if (mode === "lz4") {
    await unlz4(wasm);
  }
  console.timeEnd("Decompression time")

  console.log(
    `- Compressed WASM using ${mode} (reduction: ${bytes(wasm.length - compressed.length)} bytes, size: ${bytes(compressed.length)})`,
  );

  const encoded = JSON.stringify(encoding === "ascii85" ? ascii85.encodeAscii85(compressed) : base64.encodeBase64(compressed));
  console.log(
    `- Encoded WASM using ${encoding}, (increase: ${bytes(encoded.length -
      compressed.length)}, size: ${bytes(encoded.length)})`,
  );

  const targetDir = dirname(target);
  console.log({
    target,
    targetDir,
  })

  console.log("- Inlining wasm code in js");
  const compressionModuleImportPath = ({
    "gzip": "@bundle/compress/deno/gzip/mod.ts",
    "brotli": "@bundle/compress/deno/brotli/mod.ts",
    "zstd": "@bundle/compress/deno/zstd/mod.ts",
    "lz4": "@bundle/compress/deno/lz4/mod.ts",
    ...importsPaths
  })[mode];

  const commonReturn = outdent`
    const { decompress } = await import(\"${compressionModuleImportPath}\");
    return await decompress(uint8arr);
  `;

  const modeReturns = ({
    "gzip": outdent`
        const cs = new DecompressionStream('gzip');
        const decompressedStream = new Blob([uint8arr]).stream().pipeThrough(cs);
        return new Uint8Array(await new Response(decompressedStream).arrayBuffer());
    `,
    "brotli": commonReturn,
    "lz4": commonReturn,
    "zstd": commonReturn,
  })[mode] ?? `return uint8arr;`;

  const source = outdent`
    ${encoding === "ascii85" ? `import { ascii85 } from "@bundle/utils/utils/encoding.ts";` : ""}
    export const source = async () => {
      const uint8arr = (${encoding === "ascii85" ? 
        `ascii85.decodeAscii85(\n\t${encoded}\n)`  : 
        `Uint8Array.from(atob(${encoded}), c => c.charCodeAt(0))`
      });
      ${modeReturns}
    };
    export default source;
  `;

  console.log(`- Writing output to file (${target})`);
  await Promise.all([
    fs.writeFile(target, encoder.encode(source)),
  ]);

  const outputFile = await fs.stat(target);
  console.log(
    `- Output file (${target}), final size is: ${bytes(outputFile.size)}\n`
  );
}

await build(["gzip"], "./src/deno/zstd/zstd.wasm", "src/deno/zstd/zstd.encoded.wasm.ts");
await build(["none"], "./src/deno/lz4/deno_lz4_bg.wasm", "src/deno/lz4/wasm.ts");
await build(["zstd", "ascii85"], "./src/deno/brotli/deno_brotli_bg.wasm", "src/deno/brotli/wasm.ts", {
  "zstd": "../zstd/mod.ts"
});
