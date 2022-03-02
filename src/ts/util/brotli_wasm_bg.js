// Based on brotli-wasm (https://github.com/httptoolkit/brotli-wasm)
// import loadWASM from './brotli_wasm_bg.wasm';
async function loadWasm(module) {
    const imports = [
        {
          module: './brotli_wasm_bg.js',
          name: '__wbindgen_is_undefined',
          kind: 'function'
        },
        {
          module: './brotli_wasm_bg.js',
          name: '__wbindgen_is_object',
          kind: 'function'
        },
        {
          module: './brotli_wasm_bg.js',
          name: '__wbindgen_string_new',
          kind: 'function'
        },
        {
          module: './brotli_wasm_bg.js',
          name: '__wbindgen_json_serialize',
          kind: 'function'
        },
        {
          module: './brotli_wasm_bg.js',
          name: '__wbg_new_59cb74e423758ede',
          kind: 'function'
        },
        {
          module: './brotli_wasm_bg.js',
          name: '__wbg_stack_558ba5917b466edd',
          kind: 'function'
        },
        {
          module: './brotli_wasm_bg.js',
          name: '__wbg_error_4bb6c2a97407129a',
          kind: 'function'
        },
        {
          module: './brotli_wasm_bg.js',
          name: '__wbindgen_object_drop_ref',
          kind: 'function'
        },
        {
          module: './brotli_wasm_bg.js',
          name: '__wbindgen_rethrow',
          kind: 'function'
        }
    ].map(({ module, ...rest }) => ({ 
        module: new URL("./js/brotli_wasm_bg.js", globalThis.location.origin.toString()).toString().replace(globalThis.location.origin.toString, "."), 
        ...rest
    }));
    if (typeof module === 'string') {
        const moduleRequest = await fetch(module);
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(moduleRequest, imports);
            } catch (e) {
                if (moduleRequest.headers.get('Content-Type') != 'application/wasm') {
                    console.warn(e);
                } else {
                    throw e;
                }
            }
        }
        module = await moduleRequest.arrayBuffer();
    }
    return await WebAssembly.instantiate(module, imports);
}

let wasm;
async function getWASM() {
    if (!wasm) { 
        let wasmModule = "/brotli_wasm_bg.wasm";
        wasm = await loadWasm(wasmModule); 
    }
    return wasm;
};

export const instance = (async () => {
    await getWASM();
    return wasm.instance;
})();
// export const module = (async () => {
//     await getWASM();
//     return wasm.module;
// })();
(()=> {
    return instance.then(({ exports}) => {
        console.log("exports", exports)
        return exports;
    });
})()
// export const memory = (async () => { 
//     return (await instance).exports.memory; 
// })();
// export const compress = (async () => { 
//     return (await instance).exports.compress; 
// })();
// export const decompress = (async () => { 
//     return (await instance).exports.decompress; 
// })();
// export const BrotliDecoderCreateInstance = (async () => { 
//     return (await instance).exports.BrotliDecoderCreateInstance; 
// })();
// export const BrotliDecoderSetParameter = (async () => { 
//     return (await instance).exports.BrotliDecoderSetParameter; 
// })();
// export const BrotliDecoderDecompress = (async () => { 
//     return (await instance).exports.BrotliDecoderDecompress; 
// })();
// export const BrotliDecoderDecompressStream = (async () => { 
//     return (await instance).exports.BrotliDecoderDecompressStream; 
// })();
// export const BrotliDecoderDecompressStreaming = (async () => { 
//     return (await instance).exports.BrotliDecoderDecompressStreaming; 
// })();
// export const BrotliDecoderDecompressWithReturnInfo = (async () => { 
//     return (await instance).exports.BrotliDecoderDecompressWithReturnInfo; 
// })();
// export const BrotliDecoderDecompressPrealloc = (async () => { 
//     return (await instance).exports.BrotliDecoderDecompressPrealloc; 
// })();
// export const BrotliDecoderMallocU8 = (async () => { 
//     return (await instance).exports.BrotliDecoderMallocU8; 
// })();
// export const BrotliDecoderFreeU8 = (async () => { 
//     return (await instance).exports.BrotliDecoderFreeU8; 
// })();
// export const BrotliDecoderMallocUsize = (async () => { 
//     return (await instance).exports.BrotliDecoderMallocUsize; 
// })();
// export const BrotliDecoderFreeUsize = (async () => { 
//     return (await instance).exports.BrotliDecoderFreeUsize; 
// })();
// export const BrotliDecoderDestroyInstance = (async () => { 
//     return (await instance).exports.BrotliDecoderDestroyInstance; 
// })();
// export const BrotliDecoderVersion = (async () => { 
//     return (await instance).exports.BrotliDecoderVersion; 
// })();
// export const CBrotliDecoderErrorString = (async () => { 
//     return (await instance).exports.CBrotliDecoderErrorString; 
// })();
// export const BrotliDecoderErrorString = (async () => { 
//     return (await instance).exports.BrotliDecoderErrorString; 
// })();
// export const CBrotliDecoderHasMoreOutput = (async () => { 
//     return (await instance).exports.CBrotliDecoderHasMoreOutput; 
// })();
// export const BrotliDecoderHasMoreOutput = (async () => { 
//     return (await instance).exports.BrotliDecoderHasMoreOutput; 
// })();
// export const CBrotliDecoderTakeOutput = (async () => { 
//     return (await instance).exports.CBrotliDecoderTakeOutput; 
// })();
// export const BrotliDecoderTakeOutput = (async () => { 
//     return (await instance).exports.BrotliDecoderTakeOutput; 
// })();
// export const CBrotliDecoderIsUsed = (async () => { 
//     return (await instance).exports.CBrotliDecoderIsUsed; 
// })();
// export const BrotliDecoderIsUsed = (async () => { 
//     return (await instance).exports.BrotliDecoderIsUsed; 
// })();
// export const CBrotliDecoderIsFinished = (async () => { 
//     return (await instance).exports.CBrotliDecoderIsFinished; 
// })();
// export const BrotliDecoderIsFinished = (async () => { 
//     return (await instance).exports.BrotliDecoderIsFinished; 
// })();
// export const CBrotliDecoderGetErrorCode = (async () => { 
//     return (await instance).exports.CBrotliDecoderGetErrorCode; 
// })();
// export const BrotliDecoderGetErrorCode = (async () => { 
//     return (await instance).exports.BrotliDecoderGetErrorCode; 
// })();
// export const CBrotliDecoderGetErrorString = (async () => { 
//     return (await instance).exports.CBrotliDecoderGetErrorString; 
// })();
// export const BrotliDecoderGetErrorString = (async () => { 
//     return (await instance).exports.BrotliDecoderGetErrorString; 
// })();
// export const BrotliEncoderCompressMulti = (async () => { 
//     return (await instance).exports.BrotliEncoderCompressMulti; 
// })();
// export const BroccoliCreateInstance = (async () => { 
//     return (await instance).exports.BroccoliCreateInstance; 
// })();
// export const BroccoliCreateInstanceWithWindowSize = (async () => { 
//     return (await instance).exports.BroccoliCreateInstanceWithWindowSize; 
// })();
// export const BroccoliDestroyInstance = (async () => { 
//     return (await instance).exports.BroccoliDestroyInstance; 
// })();
// export const BroccoliNewBrotliFile = (async () => { 
//     return (await instance).exports.BroccoliNewBrotliFile; 
// })();
// export const BroccoliConcatStream = (async () => { 
//     return (await instance).exports.BroccoliConcatStream; 
// })();
// export const BroccoliConcatStreaming = (async () => { 
//     return (await instance).exports.BroccoliConcatStreaming; 
// })();
// export const BroccoliConcatFinish = (async () => { 
//     return (await instance).exports.BroccoliConcatFinish; 
// })();
// export const BroccoliConcatFinished = (async () => { 
//     return (await instance).exports.BroccoliConcatFinished; 
// })();
// export const BrotliEncoderMaxCompressedSizeMulti = (async () => { 
//     return (await instance).exports.BrotliEncoderMaxCompressedSizeMulti; 
// })();
// export const BrotliEncoderCreateWorkPool = (async () => { 
//     return (await instance).exports.BrotliEncoderCreateWorkPool; 
// })();
// export const BrotliEncoderDestroyWorkPool = (async () => { 
//     return (await instance).exports.BrotliEncoderDestroyWorkPool; 
// })();
// export const BrotliEncoderCompressWorkPool = (async () => { 
//     return (await instance).exports.BrotliEncoderCompressWorkPool; 
// })();
// export const BrotliEncoderCreateInstance = (async () => { 
//     return (await instance).exports.BrotliEncoderCreateInstance; 
// })();
// export const BrotliEncoderSetParameter = (async () => { 
//     return (await instance).exports.BrotliEncoderSetParameter; 
// })();
// export const BrotliEncoderDestroyInstance = (async () => { 
//     return (await instance).exports.BrotliEncoderDestroyInstance; 
// })();
// export const BrotliEncoderIsFinished = (async () => { 
//     return (await instance).exports.BrotliEncoderIsFinished; 
// })();
// export const BrotliEncoderHasMoreOutput = (async () => { 
//     return (await instance).exports.BrotliEncoderHasMoreOutput; 
// })();
// export const BrotliEncoderSetCustomDictionary = (async () => { 
//     return (await instance).exports.BrotliEncoderSetCustomDictionary; 
// })();
// export const BrotliEncoderTakeOutput = (async () => { 
//     return (await instance).exports.BrotliEncoderTakeOutput; 
// })();
// export const BrotliEncoderVersion = (async () => { 
//     return (await instance).exports.BrotliEncoderVersion; 
// })();
// export const BrotliEncoderMaxCompressedSize = (async () => { 
//     return (await instance).exports.BrotliEncoderMaxCompressedSize; 
// })();
// export const BrotliEncoderCompress = (async () => { 
//     return (await instance).exports.BrotliEncoderCompress; 
// })();
// export const BrotliEncoderCompressStreaming = (async () => { 
//     return (await instance).exports.BrotliEncoderCompressStreaming; 
// })();
// export const BrotliEncoderCompressStream = (async () => { 
//     return (await instance).exports.BrotliEncoderCompressStream; 
// })();
// export const BrotliEncoderMallocU8 = (async () => { 
//     return (await instance).exports.BrotliEncoderMallocU8; 
// })();
// export const BrotliEncoderFreeU8 = (async () => { 
//     return (await instance).exports.BrotliEncoderFreeU8; 
// })();
// export const BrotliEncoderMallocUsize = (async () => { 
//     return (await instance).exports.BrotliEncoderMallocUsize; 
// })();
// export const BrotliEncoderFreeUsize = (async () => { 
//     return (await instance).exports.BrotliEncoderFreeUsize; 
// })();
// export const __wbindgen_malloc = (async () => { 
//     return (await instance).exports.__wbindgen_malloc; 
// })();
// export const __wbindgen_realloc = (async () => { 
//     return (await instance).exports.__wbindgen_realloc; 
// })();
// export const __wbindgen_add_to_stack_pointer = (async () => { 
//     return (await instance).exports.__wbindgen_add_to_stack_pointer; 
// })();
// export const __wbindgen_free = (async () => { 
//     return (await instance).exports.__wbindgen_free; 
// })();