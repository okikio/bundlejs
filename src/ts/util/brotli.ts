// Based on brotli-wasm (https://github.com/httptoolkit/brotli-wasm)
import * as wasm from "./brotli_wasm_bg.js";

const heap = new Array(32).fill(undefined);
heap.push(undefined, null, true, false);

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
cachedTextDecoder.decode();

console.log(wasm)

// let heap_next = heap.length;
// function addHeapObject(obj) {
//     if (heap_next === heap.length) heap.push(heap.length + 1);
//     const idx = heap_next;
//     heap_next = heap[idx];

//     heap[idx] = obj;
//     return idx;
// }

// let WASM_VECTOR_LEN = 0;
// let cachedTextEncoder = new TextEncoder();
// const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
//     ? function (arg, view) {
//         return cachedTextEncoder.encodeInto(arg, view);
//     }
//     : function (arg, view) {
//         const buf = cachedTextEncoder.encode(arg);
//         view.set(buf);
//         return {
//             read: arg.length,
//             written: buf.length
//         };
//     });

// function dropObject(idx) {
//     if (idx < 36) return;
//     heap[idx] = heap_next;
//     heap_next = idx;
// }

// function getObject(idx) { return heap[idx]; }
// function takeObject(idx) {
//     const ret = getObject(idx);
//     dropObject(idx);
//     return ret;
// }

// let stack_pointer = 32;
// function addBorrowedObject(obj) {
//     if (stack_pointer == 1) throw new Error('out of js stack');
//     heap[--stack_pointer] = obj;
//     return stack_pointer;
// }

// let cachegetUint8Memory0: Uint8Array | null = null;
// async function getUint8Memory0() {
//     if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== await wasm.memory.buffer) {
//         cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
//     }
//     return cachegetUint8Memory0;
// }

// async function getStringFromWasm0(ptr, len) {
//     return cachedTextDecoder.decode((await getUint8Memory0()).subarray(ptr, ptr + len));
// }

// async function passStringToWasm0(arg, malloc, realloc) {

//     if (realloc === undefined) {
//         const buf = cachedTextEncoder.encode(arg);
//         const ptr = malloc(buf.length);
//         (await getUint8Memory0()).subarray(ptr, ptr + buf.length).set(buf);
//         WASM_VECTOR_LEN = buf.length;
//         return ptr;
//     }

//     let len = arg.length;
//     let ptr = malloc(len);

//     const mem = (await getUint8Memory0());

//     let offset = 0;

//     for (; offset < len; offset++) {
//         const code = arg.charCodeAt(offset);
//         if (code > 0x7F) break;
//         mem[ptr + offset] = code;
//     }

//     if (offset !== len) {
//         if (offset !== 0) {
//             arg = arg.slice(offset);
//         }
//         ptr = realloc(ptr, len, len = offset + arg.length * 3);
//         const view = (await getUint8Memory0()).subarray(ptr + offset, ptr + len);
//         const ret = encodeString(arg, view);

//         offset += ret.written;
//     }

//     WASM_VECTOR_LEN = offset;
//     return ptr;
// }

// let cachegetInt32Memory0: Int32Array | null = null;
// async function getInt32Memory0() {
//     if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== await wasm.memory.buffer) {
//         cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
//     }
//     return cachegetInt32Memory0;
// }

// async function passArray8ToWasm0(arg, malloc) {
//     const ptr = malloc(arg.length * 1);
//     (await getUint8Memory0()).set(arg, ptr / 1);
//     WASM_VECTOR_LEN = arg.length;
//     return ptr;
// }

// async function getArrayU8FromWasm0(ptr, len) {
//     return (await getUint8Memory0()).subarray(ptr / 1, ptr / 1 + len);
// }

// /**
// * @param {Uint8Array} buf
// * @param {any} raw_options
// * @returns {Uint8Array}
// */
// export async function compress(buf, raw_options) {
//     try {
//         const retptr = await wasm.__wbindgen_add_to_stack_pointer(-16);
//         var ptr0 = await passArray8ToWasm0(buf, await wasm.__wbindgen_malloc);
//         var len0 = WASM_VECTOR_LEN;
//         await wasm.compress(retptr, ptr0, len0, addBorrowedObject(raw_options));
//         var r0 = (await getInt32Memory0())[retptr / 4 + 0];
//         var r1 = (await getInt32Memory0())[retptr / 4 + 1];
//         var v1 = (await getArrayU8FromWasm0(r0, r1)).slice();
//         await wasm.__wbindgen_free(r0, r1 * 1);
//         return v1;
//     } finally {
//         await wasm.__wbindgen_add_to_stack_pointer(16);
//         heap[stack_pointer++] = undefined;
//     }
// };

// /**
// * @param {Uint8Array} buf
// * @returns {Uint8Array}
// */
// export async function decompress(buf) {
//     try {
//         const retptr = await wasm.__wbindgen_add_to_stack_pointer(-16);
//         var ptr0 = passArray8ToWasm0(buf, await wasm.__wbindgen_malloc);
//         var len0 = WASM_VECTOR_LEN;
//         await wasm.decompress(retptr, ptr0, len0);
//         var r0 = (await getInt32Memory0())[retptr / 4 + 0];
//         var r1 = (await getInt32Memory0())[retptr / 4 + 1];
//         var v1 = (await getArrayU8FromWasm0(r0, r1)).slice();
//         await wasm.__wbindgen_free(r0, r1 * 1);
//         return v1;
//     } finally {
//         await wasm.__wbindgen_add_to_stack_pointer(16);
//     }
// };

// export async function __wbindgen_is_undefined(arg0) {
//     var ret = getObject(arg0) === undefined;
//     return ret;
// };

// export async function __wbindgen_is_object(arg0) {
//     const val = getObject(arg0);
//     var ret = typeof (val) === 'object' && val !== null;
//     return ret;
// };

// export async function __wbindgen_string_new(arg0, arg1) {
//     var ret = await getStringFromWasm0(arg0, arg1);
//     return addHeapObject(ret);
// };

// export async function __wbindgen_json_serialize(arg0, arg1) {
//     const obj = getObject(arg1);
//     var ret = JSON.stringify(obj === undefined ? null : obj);
//     var ptr0 = await passStringToWasm0(ret, await wasm.__wbindgen_malloc, await wasm.__wbindgen_realloc);
//     var len0 = WASM_VECTOR_LEN;
//     (await getInt32Memory0())[arg0 / 4 + 1] = len0;
//     (await getInt32Memory0())[arg0 / 4 + 0] = ptr0;
// };

// export async function __wbg_new_59cb74e423758ede() {
//     var ret = new Error();
//     return addHeapObject(ret);
// };

// export async function __wbg_stack_558ba5917b466edd(arg0, arg1) {
//     var ret = getObject(arg1).stack;
//     var ptr0 = await passStringToWasm0(ret, await wasm.__wbindgen_malloc, await wasm.__wbindgen_realloc);
//     var len0 = WASM_VECTOR_LEN;
//     (await getInt32Memory0())[arg0 / 4 + 1] = len0;
//     (await getInt32Memory0())[arg0 / 4 + 0] = ptr0;
// };

// export async function __wbg_error_4bb6c2a97407129a(arg0, arg1) {
//     try {
//         console.error(getStringFromWasm0(arg0, arg1));
//     } finally {
//         await wasm.__wbindgen_free(arg0, arg1);
//     }
// };

// export async function __wbindgen_object_drop_ref(arg0) {
//     takeObject(arg0);
// };

// export function __wbindgen_rethrow(arg0) {
//     throw takeObject(arg0);
// };
