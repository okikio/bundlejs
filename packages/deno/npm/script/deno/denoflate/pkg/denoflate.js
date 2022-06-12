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
exports.unzlib = exports.zlib = exports.gunzip = exports.gzip = exports.inflate = exports.deflate = void 0;
// deno-lint-ignore-file
const dntShim = __importStar(require("../../../_dnt.shims.js"));
let wasm;
let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
cachedTextDecoder.decode();
let cachegetUint8Memory0 = null;
function getUint8Memory0() {
    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory0;
}
function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}
const heap = new Array(32).fill(undefined);
heap.push(undefined, null, true, false);
let heap_next = heap.length;
function addHeapObject(obj) {
    if (heap_next === heap.length)
        heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];
    heap[idx] = obj;
    return idx;
}
function getObject(idx) { return heap[idx]; }
function dropObject(idx) {
    if (idx < 36)
        return;
    heap[idx] = heap_next;
    heap_next = idx;
}
function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}
let WASM_VECTOR_LEN = 0;
function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1);
    getUint8Memory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}
function isLikeNone(x) {
    return x === undefined || x === null;
}
let cachegetInt32Memory0 = null;
function getInt32Memory0() {
    if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== wasm.memory.buffer) {
        cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachegetInt32Memory0;
}
function getArrayU8FromWasm0(ptr, len) {
    return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);
}
/**
* @param {Uint8Array} input
* @param {number | undefined} compression
* @returns {Uint8Array}
*/
function deflate(input, compression) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        var ptr0 = passArray8ToWasm0(input, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.deflate(retptr, ptr0, len0, !isLikeNone(compression), isLikeNone(compression) ? 0 : compression);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v1 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v1;
    }
    finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}
exports.deflate = deflate;
/**
* @param {Uint8Array} input
* @returns {Uint8Array}
*/
function inflate(input) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        var ptr0 = passArray8ToWasm0(input, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.inflate(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v1 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v1;
    }
    finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}
exports.inflate = inflate;
/**
* @param {Uint8Array} input
* @param {number | undefined} compression
* @returns {Uint8Array}
*/
function gzip(input, compression) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        var ptr0 = passArray8ToWasm0(input, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.gzip(retptr, ptr0, len0, !isLikeNone(compression), isLikeNone(compression) ? 0 : compression);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v1 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v1;
    }
    finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}
exports.gzip = gzip;
/**
* @param {Uint8Array} input
* @returns {Uint8Array}
*/
function gunzip(input) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        var ptr0 = passArray8ToWasm0(input, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.gunzip(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v1 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v1;
    }
    finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}
exports.gunzip = gunzip;
/**
* @param {Uint8Array} input
* @param {number | undefined} compression
* @returns {Uint8Array}
*/
function zlib(input, compression) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        var ptr0 = passArray8ToWasm0(input, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.zlib(retptr, ptr0, len0, !isLikeNone(compression), isLikeNone(compression) ? 0 : compression);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v1 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v1;
    }
    finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}
exports.zlib = zlib;
/**
* @param {Uint8Array} input
* @returns {Uint8Array}
*/
function unzlib(input) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        var ptr0 = passArray8ToWasm0(input, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.unzlib(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v1 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v1;
    }
    finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}
exports.unzlib = unzlib;
async function load(module, imports) {
    if (typeof dntShim.Response === 'function' && module instanceof dntShim.Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);
            }
            catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);
                }
                else {
                    throw e;
                }
            }
        }
        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);
    }
    else {
        const instance = await WebAssembly.instantiate(module, imports);
        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };
        }
        else {
            return instance;
        }
    }
}
async function init(input) {
    if (typeof input === 'undefined') {
        input = new URL('denoflate_bg.wasm', require("url").pathToFileURL(__filename).href);
    }
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbindgen_string_new = function (arg0, arg1) {
        var ret = getStringFromWasm0(arg0, arg1);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_rethrow = function (arg0) {
        throw takeObject(arg0);
    };
    if (typeof input === 'string' || (typeof dntShim.Request === 'function' && input instanceof dntShim.Request) || (typeof URL === 'function' && input instanceof URL)) {
        input = dntShim.fetch(input);
    }
    const { instance, module } = await load(await input, imports);
    wasm = instance.exports;
    init.__wbindgen_wasm_module = module;
    return wasm;
}
exports.default = init;
