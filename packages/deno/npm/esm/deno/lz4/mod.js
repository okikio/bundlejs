// https://deno.land/x/lz4@v0.1.2/mod.ts
// Copyright 2020-present the denosaurs team. All rights reserved. MIT license.
import init, { source, lz4_compress, lz4_decompress, } from "./wasm.js";
let initialized = false;
const getWASM = async () => {
    if (!initialized)
        await init(source);
    return (initialized = true);
};
/**
 * Compress a byte array using lz4.
 *
 * ```typescript
 * import { compress } from "https://deno.land/x/lz4/mod.ts";
 * const text = new TextEncoder().encode("X".repeat(64));
 * console.log(text.length);                   // 64 Bytes
 * console.log(compress(text).length);         // 6  Bytes
 * ```
 *
 * @param input Input data.
 */
export async function compress(input) {
    await getWASM();
    return lz4_compress(input);
}
/**
 * Decompress a byte array using lz4.
 *
 * ```typescript
 * import { decompress } from "https://deno.land/x/lz4/mod.ts";
 * const compressed = Uint8Array.from([ 31, 88, 1, 0, 44, 0 ]);
 * console.log(compressed.length);             // 6 Bytes
 * console.log(decompress(compressed).length); // 64 Bytes
 * ```
 *
 * @param input Input data.
 */
export async function decompress(input) {
    await getWASM();
    return lz4_decompress(input);
}
