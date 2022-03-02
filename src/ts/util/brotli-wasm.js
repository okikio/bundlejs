

const heap = new Array(32);
heap.fill(undefined);
heap.push(undefined, null, true, false);

let heap_next = heap.length;
function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

function getObject(idx) { return heap[idx]; }
function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

export const __wbindgen_string_new = function (arg0, arg1) {
    const ret = getStringFromWasm(arg0, arg1);
    return addHeapObject(ret);
};

export const __wbindgen_rethrow = function (arg0) {
    throw takeObject(arg0);
};

const wasmPath = "./node_modules/wasm-brotli/wasm_brotli_browser_bg.wasm";
const wasmImportObjects = {
    [wasmPath]: function () {
        return {
            "./wasm_brotli_browser.js": {
                "__wbindgen_string_new": function (p0i32, p1i32) {
                    return __wbindgen_string_new(p0i32, p1i32);
                },
                "__wbindgen_rethrow": function (p0i32) {
                    return __wbindgen_rethrow(p0i32);
                }
            }
        };
    },
};
let promises = [];
export let wasmExports;
let importObject = wasmImportObjects[wasmPath]();
let req = fetch("/wasm_brotli_browser_bg.wasm");
let promise;
if (importObject instanceof Promise && typeof WebAssembly.compileStreaming === 'function') {
    promise = Promise.all([WebAssembly.compileStreaming(req), importObject]).then(function (items) {
        return WebAssembly.instantiate(items[0], items[1]);
    });
} else if (typeof WebAssembly.instantiateStreaming === 'function') {
    promise = WebAssembly.instantiateStreaming(req, importObject);
} else {
    let bytesPromise = req.then(function (x) { return x.arrayBuffer(); });
    promise = bytesPromise.then(function (bytes) {
        return WebAssembly.instantiate(bytes, importObject);
    });
}
promises.push(promise.then(function (res) {
    return (wasmExports = (res.instance || res).exports);
}));
let wasmPromise = Promise.all(promises);
async function getWASM() {
    if (!wasmExports) await wasmPromise;
    return wasmPromise;
};
export const memory = (async () => { 
    await getWASM();
    return wasmExports.memory; 
})();


















// let _wasm_brotli_browser_bg_wasm__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./wasm_brotli_browser_bg.wasm */ "./node_modules/wasm-brotli/wasm_brotli_browser_bg.wasm");

// let cachegetUint8Memory = null;
// function getUint8Memory() {
//     if (cachegetUint8Memory === null || cachegetUint8Memory.buffer !== _wasm_brotli_browser_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["memory"].buffer) {
//         cachegetUint8Memory = new Uint8Array(_wasm_brotli_browser_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["memory"].buffer);
//     }
//     return cachegetUint8Memory;
// }

// let WASM_VECTOR_LEN = 0;

// function passArray8ToWasm(arg) {
//     const ptr = _wasm_brotli_browser_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["__wbindgen_malloc"](arg.length * 1);
//     getUint8Memory().set(arg, ptr / 1);
//     WASM_VECTOR_LEN = arg.length;
//     return ptr;
// }

// let cachegetInt32Memory = null;
// function getInt32Memory() {
//     if (cachegetInt32Memory === null || cachegetInt32Memory.buffer !== _wasm_brotli_browser_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["memory"].buffer) {
//         cachegetInt32Memory = new Int32Array(_wasm_brotli_browser_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["memory"].buffer);
//     }
//     return cachegetInt32Memory;
// }

// function getArrayU8FromWasm(ptr, len) {
//     return getUint8Memory().subarray(ptr / 1, ptr / 1 + len);
// }
// /**
// * @param {Uint8Array} buffer
// * @returns {Uint8Array}
// */
// export function compress(buffer) {
//     const retptr = 8;
//     const ret = _wasm_brotli_browser_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["compress"](retptr, passArray8ToWasm(buffer), WASM_VECTOR_LEN);
//     const memi32 = getInt32Memory();
//     const v0 = getArrayU8FromWasm(memi32[retptr / 4 + 0], memi32[retptr / 4 + 1]).slice();
//     _wasm_brotli_browser_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["__wbindgen_free"](memi32[retptr / 4 + 0], memi32[retptr / 4 + 1] * 1);
//     return v0;
// }

// /**
// * @param {Uint8Array} buffer
// * @returns {Uint8Array}
// */
// export function decompress(buffer) {
//     const retptr = 8;
//     const ret = _wasm_brotli_browser_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["decompress"](retptr, passArray8ToWasm(buffer), WASM_VECTOR_LEN);
//     const memi32 = getInt32Memory();
//     const v0 = getArrayU8FromWasm(memi32[retptr / 4 + 0], memi32[retptr / 4 + 1]).slice();
//     _wasm_brotli_browser_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["__wbindgen_free"](memi32[retptr / 4 + 0], memi32[retptr / 4 + 1] * 1);
//     return v0;
// }

// let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

// cachedTextDecoder.decode();

// function getStringFromWasm(ptr, len) {
//     return cachedTextDecoder.decode(getUint8Memory().subarray(ptr, ptr + len));
// }
