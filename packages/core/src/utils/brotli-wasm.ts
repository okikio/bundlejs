// Based on wasm-brotli (https://github.com/dfrankland/wasm-brotli)
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

export let wasmExports;
let promises = [];
let promise;

let importObject = wasmImportObjects[wasmPath]();
let req = fetch("/wasm_brotli_browser_bg.wasm");
if (importObject instanceof Promise && typeof WebAssembly.compileStreaming === 'function') {
  promise = Promise.all([WebAssembly.compileStreaming(req), importObject]).then(function (items) {
    return WebAssembly.instantiate(items[0], items[1]);
  });
} else if (typeof WebAssembly.instantiateStreaming === 'function') {
  promise = WebAssembly.instantiateStreaming(req, importObject);
} else {
  let bytesPromise = req.then(function (x) { return x.arrayBuffer(); });
  promise = bytesPromise.then(function (bytes) {
    return WebAssembly.instantiate(bytes as BufferSource, importObject);
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

let cachegetUint8Memory = null;
async function getUint8Memory() {
  await getWASM();
  if (cachegetUint8Memory === null || cachegetUint8Memory.buffer !== wasmExports["memory"].buffer) {
    cachegetUint8Memory = new Uint8Array(wasmExports["memory"].buffer);
  }
  return cachegetUint8Memory;
}

let WASM_VECTOR_LEN = 0;
async function passArray8ToWasm(arg) {
  await getWASM();
  const ptr = wasmExports["__wbindgen_malloc"](arg.length * 1);
  (await getUint8Memory()).set(arg, ptr / 1);
  WASM_VECTOR_LEN = arg.length;
  return ptr;
}

let cachegetInt32Memory = null;
async function getInt32Memory() {
  await getWASM();
  if (cachegetInt32Memory === null || cachegetInt32Memory.buffer !== wasmExports["memory"].buffer) {
    cachegetInt32Memory = new Int32Array(wasmExports["memory"].buffer);
  }
  return cachegetInt32Memory;
}

async function getArrayU8FromWasm(ptr, len) {
  await getWASM();
  return (await getUint8Memory()).subarray(ptr / 1, ptr / 1 + len);
}
/**
* @param {Uint8Array} buffer
* @returns {Uint8Array}
*/
export async function compress(buffer) {
  await getWASM();
  const retptr = 8;
  const ret = wasmExports["compress"](retptr, await passArray8ToWasm(buffer), WASM_VECTOR_LEN);
  const memi32 = await getInt32Memory();
  const v0 = (await getArrayU8FromWasm(memi32[retptr / 4 + 0], memi32[retptr / 4 + 1])).slice();
  wasmExports["__wbindgen_free"](memi32[retptr / 4 + 0], memi32[retptr / 4 + 1] * 1);
  return v0;
}

/**
* @param {Uint8Array} buffer
* @returns {Uint8Array}
*/
export async function decompress(buffer) {
  await getWASM();
  const retptr = 8;
  const ret = wasmExports["decompress"](retptr, await passArray8ToWasm(buffer), WASM_VECTOR_LEN);
  const memi32 = (await getInt32Memory());
  const v0 = (await getArrayU8FromWasm(memi32[retptr / 4 + 0], memi32[retptr / 4 + 1])).slice();
  wasmExports["__wbindgen_free"](memi32[retptr / 4 + 0], memi32[retptr / 4 + 1] * 1);
  return v0;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
cachedTextDecoder.decode();
async function getStringFromWasm(ptr, len) {
  await getWASM();
  return cachedTextDecoder.decode((await getUint8Memory()).subarray(ptr, ptr + len));
}
