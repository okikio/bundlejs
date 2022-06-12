"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decompress = exports.compress = exports.getWASM = void 0;
// https://deno.land/x/brotli@v0.1.4/mod.ts
// Copyright 2020-present the denosaurs team. All rights reserved. MIT license.
const wasm_js_1 = __importStar(require("./wasm.js"));
let initialized = false;
const getWASM = async () => {
    if (!initialized)
        await (0, wasm_js_1.default)(wasm_js_1.source);
    return (initialized = true);
};
exports.getWASM = getWASM;
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
async function compress(input, bufferSize = 4096, quality = 6, lgwin = 22) {
    await (0, exports.getWASM)();
    return (0, wasm_js_1.compress)(input, bufferSize, quality, lgwin);
}
exports.compress = compress;
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
async function decompress(input, bufferSize = 4096) {
    await (0, exports.getWASM)();
    return (0, wasm_js_1.decompress)(input, bufferSize);
}
exports.decompress = decompress;
