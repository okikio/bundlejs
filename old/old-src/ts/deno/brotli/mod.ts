// Copyright 2020-present the denosaurs team. All rights reserved. MIT license.
import init, {
    source,
    compress as wasm_compress,
    decompress as wasm_decompress,
} from "./wasm.js.js.js";

let initialized = false;
export const getWASM = async () => {
    if (!initialized) await init(source);
    return (initialized = true);
}

/**
 * Compress a byte array.
 *
 * ```typescript
 * import { compress } from "https://deno.land/x/brotli/mod.ts";
 * const text = new TextEncoder().encode("X".repeat(64));
 * console.log(text.length);                   // 64 Bytes
 * console.log(compress(text).length);         // 10 Bytes
 * ```
 *
 * @param input Input data.
 * @param bufferSize Read buffer size
 * @param quality Controls the compression-speed vs compression-
 * density tradeoff. The higher the quality, the slower the compression.
 * @param lgwin Base 2 logarithm of the sliding window size.
 */
export async function compress(
    input: Uint8Array,
    bufferSize: number = 4096,
    quality: number = 6,
    lgwin: number = 22,
): Promise<Uint8Array> {
    await getWASM();
    return wasm_compress(input, bufferSize, quality, lgwin);
}

/**
 * Decompress a byte array.
 *
 * ```typescript
 * import { decompress } from "https://deno.land/x/brotli/mod.ts";
 * const compressed = Uint8Array.from([ 27, 63, 0, 0, 36, 176, 226, 153, 64, 18 ]);
 * console.log(compressed.length);             // 10 Bytes
 * console.log(decompress(compressed).length); // 64 Bytes
 * ```
 *
 * @param input Input data.
 * @param bufferSize Read buffer size
 */
export async function decompress(
    input: Uint8Array,
    bufferSize: number = 4096,
): Promise<Uint8Array> {
    await getWASM();
    return wasm_decompress(input, bufferSize);
}