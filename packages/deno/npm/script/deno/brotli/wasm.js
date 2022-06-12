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
exports.decompress = exports.compress = exports.source = void 0;
// deno-lint-ignore-file
// deno-fmt-ignore-file
const dntShim = __importStar(require("../../_dnt.shims.js"));
// @ts-nocheck
const A = __importStar(require("../lz4/mod.js"));
let B, Q = null;
function E() {
    return ((null !== Q && Q.buffer === B.memory.buffer) ||
        (Q = new Uint8Array(B.memory.buffer)),
        Q);
}
let C = 0;
function g(A, B) {
    const Q = B(1 * A.length);
    return E().set(A, Q / 1), (C = A.length), Q;
}
let w = null;
function I() {
    return ((null !== w && w.buffer === B.memory.buffer) ||
        (w = new Int32Array(B.memory.buffer)),
        w);
}
function G(A, B) {
    return E().subarray(A / 1, A / 1 + B);
}
function compress(A, Q, E, w) {
    var F = g(A, B.__wbindgen_malloc), D = C;
    B.compress(8, F, D, Q, E, w);
    var H = I()[2], U = I()[3], Y = G(H, U).slice();
    return B.__wbindgen_free(H, 1 * U), Y;
}
exports.compress = compress;
function decompress(A, Q) {
    var E = g(A, B.__wbindgen_malloc), w = C;
    B.decompress(8, E, w, Q);
    var F = I()[2], D = I()[3], H = G(F, D).slice();
    return B.__wbindgen_free(F, 1 * D), H;
}
exports.decompress = decompress;
async function F(A, B) {
    if ("function" == typeof dntShim.Response && A instanceof dntShim.Response) {
        if ("function" == typeof WebAssembly.instantiateStreaming)
            try {
                return await WebAssembly.instantiateStreaming(A, B);
            }
            catch (B) {
                if ("application/wasm" == A.headers.get("Content-Type"))
                    throw B;
                console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", B);
            }
        const Q = await A.arrayBuffer();
        return await WebAssembly.instantiate(Q, B);
    }
    {
        const Q = await WebAssembly.instantiate(A, B);
        return Q instanceof WebAssembly.Instance
            ? { instance: Q, module: A }
            : Q;
    }
}
async function D(A) {
    void 0 === A && (A = require("url").pathToFileURL(__filename).href.replace(/\.js$/, "_bg.wasm"));
    ("string" == typeof A ||
        ("function" == typeof dntShim.Request && A instanceof dntShim.Request) ||
        ("function" == typeof URL && A instanceof URL)) &&
        (A = dntShim.fetch(A));
    const { instance: Q, module: E } = await F(await A, {});
    // @ts-ignore: ...
    return (B = Q.exports), (D.__wbindgen_wasm_module = E), B;
}
exports.default = D;