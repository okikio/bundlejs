import { encode } from "https://deno.land/std@0.76.0/encoding/base64.ts";
import { compress } from "https://deno.land/x/lz4@v0.1.2/mod.ts";

import { version } from "esbuild-wasm";

const target = "wasm.ts";
const encoder = new TextEncoder();

export async function build() {
  console.log(version);
  
  const res = await fetch(`https://unpkg.com/esbuild-wasm@${version}/esbuild.wasm`);
  const wasm = new Uint8Array(await res.arrayBuffer());
  console.log(`read wasm (size: ${wasm.length} bytes)`);

  const compressed = compress(wasm);
  console.log(
    `compressed wasm using lz4 (reduction: ${wasm.length -
    compressed.length} bytes, size: ${compressed.length})`,
  );

  const encoded = encode(compressed);
  console.log(
    `encoded wasm using base64, (increase: ${encoded.length -
    compressed.length} bytes, size: ${encoded.length})`,
  );

  console.log("inlining wasm code in js");
  const source = `import * as lz4 from "deno/lz4"; 
  export const source = lz4.decompress(Uint8Array.from(atob("${encoded}"), c => c.charCodeAt(0))); 
  export default source`;

  console.log(`writing output to file (${target})`);
  await Deno.writeFile(target, encoder.encode(source));

  const outputFile = await Deno.stat(target);
  console.log(
    `output file (${target}), final size is: ${outputFile.size} bytes`,
  );
}

if (import.meta.main) {
  await build();
}