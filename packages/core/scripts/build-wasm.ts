import { encode } from "@bundle/compress/deno/base64/mod.ts";
import { compress, decompress } from "@bundle/compress/deno/lz4/mod.ts";
import { compress as gzip, decompress as gunzip } from "@bundle/compress/deno/gzip/mod.ts";

import { bytes } from "@bundle/utils/utils/pretty-bytes.ts";

import { compress as brotli, decompress as unbrotli } from "@bundle/compress/deno/brotli/mod.ts";
import { init, compress as zstdCompress, decompress as zstdDecompress } from "@bundle/compress/deno/zstd/mod.ts";

import { dirname, relative } from 'node:path';
import * as fs from "node:fs/promises";
const encoder = new TextEncoder();

await init();

export async function build(mode: "zstd" | "brotli" | "gzip" | "lz4" | "base64" = "zstd", src: string | Uint8Array | Promise<string | Uint8Array> = "./node_modules/esbuild-wasm/esbuild.wasm", target = "src/wasm.ts") {
  const value = await src;

  if (typeof value == "string") console.log(`\n- Source file: ${value}`);
  const res = typeof value == "string" ? await fs.readFile(value) : value;
  const wasm = new Uint8Array(res);
  console.log(`- Read WASM (size: ${bytes(wasm.length)} bytes)`);

  console.time("Compression time")
  let compressed: Uint8Array = wasm;
  if (mode == "zstd") {
    compressed = await zstdCompress(wasm, 22);
  } else if (mode == "brotli") {
    compressed = await brotli(wasm);
  } else if (mode == "gzip") {
    compressed = await gzip(wasm);
  } else if (mode == "lz4") {
    compressed = await compress(wasm);
  }
  console.timeEnd("Compression time")

  console.time("Decompression time")
  if (mode == "zstd") {
    await zstdDecompress(compressed);
  } else if (mode == "brotli") {
    await unbrotli(compressed);
  } else if (mode == "gzip") {
    await gunzip(compressed);
  } else if (mode == "lz4") {
    await decompress(wasm);
  }
  console.timeEnd("Decompression time")

  console.log(
    `- Compressed WASM using ${mode} (reduction: ${bytes(wasm.length - compressed.length)} bytes, size: ${bytes(compressed.length)})`,
  );

  const encoded = encode(compressed);
  console.log(
    `- Encoded WASM using base64, (increase: ${bytes(encoded.length -
      compressed.length)}, size: ${bytes(encoded.length)})`,
  );

  const targetDir = dirname(target);
  console.log({
    target,
    targetDir,
    to: "@bundle/compress/deno/zstd/mod.ts",
    path: relative(targetDir, "@bundle/compress/deno/zstd/mod.ts")
  })

  console.log("- Inlining wasm code in js");
  const compressionModuleImportPath = ({
    "gzip": "@bundle/compress/deno/gzip/mod.ts",
    "brotli": "@bundle/compress/deno/brotli/mod.ts",
    "zstd": "@bundle/compress/deno/zstd/mod.ts",
    "lz4": "@bundle/compress/deno/lz4/mod.ts"
  })[mode];
  const source = `\
  // @ts-nocheck
  export const source = async () => {
    const uint8arr = Uint8Array.from(atob("${encoded}"), c => c.charCodeAt(0));
    ${mode == "base64" ? `return uint8arr;` : `
    const { decompress } = await import(\"${compressionModuleImportPath}\");
    return await decompress(uint8arr);`}
  };
  export default source;`;

  console.log(`- Writing output to file (${target})`);
  await Promise.all([
    fs.writeFile("src/esbuild.wasm", res),
    fs.writeFile(target, encoder.encode(source)),
  ]);

  const outputFile = await fs.stat(target);
  console.log(
    `- Output file (${target}), final size is: ${bytes(outputFile.size)}\n`
  );
}

await build("zstd");

// import { source as brotliWASM } from "@bundle/compress/deno/brotli/wasm";
// import { source as lz4WASM } from "@bundle/compress/deno/lz4/wasm";

// await build("zstd", new Uint8Array(await lz4WASM()), "src/deno/lz4/wasm-2.ts");
// await build("zstd", await brotliWASM(), "src/deno/brotli/wasm-3.ts");