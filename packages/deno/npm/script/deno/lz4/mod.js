"use strict";
// https://deno.land/x/lz4@v0.1.2/mod.ts
// Copyright 2020-present the denosaurs team. All rights reserved. MIT license.
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
exports.decompress = exports.compress = void 0;
const wasm_js_1 = __importStar(require("./wasm.js"));
let initialized = false;
const getWASM = async () => {
    if (!initialized)
        await (0, wasm_js_1.default)(wasm_js_1.source);
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
async function compress(input) {
    await getWASM();
    return (0, wasm_js_1.lz4_compress)(input);
}
exports.compress = compress;
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
async function decompress(input) {
    await getWASM();
    return (0, wasm_js_1.lz4_decompress)(input);
}
exports.decompress = decompress;
