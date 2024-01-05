// Copyright 2020-present the denosaurs team. All rights reserved. MIT license.

/**
 * Compress a byte array using gzip.
 *
 * ```typescript
 * import { compress } from "https://deno.land/x/gzip/mod.ts.ts";
 * const text = new TextEncoder().encode("X".repeat(64));
 * console.log(text.length);                   // 64 Bytes
 * console.log(compress(text).length);         // 6  Bytes
 * ```
 *
 * @param input Input data.
 */
export async function compress(input: Uint8Array): Promise<Uint8Array> {
  const cs = new CompressionStream('gzip');
  const compressedStream = new Blob([input]).stream().pipeThrough(cs);
  return new Uint8Array(await new Response(compressedStream).arrayBuffer());
}

/**
 * Decompress a byte array using gzip.
 *
 * ```typescript
 * import { decompress } from "https://deno.land/x/gzip/mod.ts.ts";
 * const compressed = Uint8Array.from([ 31, 88, 1, 0, 44, 0 ]);
 * console.log(compressed.length);             // 6 Bytes
 * console.log(decompress(compressed).length); // 64 Bytes
 * ```
 *
 * @param input Input data.
 */
export async function decompress(input: Uint8Array): Promise<Uint8Array> {
  const cs = new DecompressionStream('gzip');
  const decompressedStream = new Blob([input]).stream().pipeThrough(cs);
  return new Uint8Array(await new Response(decompressedStream).arrayBuffer());
}