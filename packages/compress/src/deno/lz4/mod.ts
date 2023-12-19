// Based on https://deno.land/x/lz4@v0.1.3/mod.ts
// Copyright 2020-present the denosaurs team. All rights reserved. MIT license.
import _init, { lz4_compress, lz4_decompress } from "./lz4.ts";

let initWASM: Uint8Array;
export const getWASM = async () => {
  if (initWASM) return initWASM;

  const { source } = await import("./wasm.ts");
  return (initWASM = new Uint8Array(await source())); 
};

let initialized: typeof import("./lz4.ts");
export const init = async () => {
  if (initialized) return initialized;

  const bytes = await getWASM();
  return (initialized = await _init(bytes));
};

/**
 * Compress a byte array using lz4.
 *
 * ```typescript
 * import { compress } from "https://deno.land/x/lz4/mod.ts.ts";
 * const text = new TextEncoder().encode("X".repeat(64));
 * console.log(text.length);                   // 64 Bytes
 * console.log(compress(text).length);         // 6  Bytes
 * ```
 *
 * @param input Input data.
 */
export async function compress(input: Uint8Array): Promise<Uint8Array> {
  await init();
  return lz4_compress(input);
}

/**
 * Decompress a byte array using lz4.
 *
 * ```typescript
 * import { decompress } from "https://deno.land/x/lz4/mod.ts.ts";
 * const compressed = Uint8Array.from([ 31, 88, 1, 0, 44, 0 ]);
 * console.log(compressed.length);             // 6 Bytes
 * console.log(decompress(compressed).length); // 64 Bytes
 * ```
 *
 * @param input Input data.
 */
export async function decompress(input: Uint8Array): Promise<Uint8Array> {
  await init();
  return lz4_decompress(input);
}