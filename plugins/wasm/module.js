import { getWasmMetadata } from './wasm.js';
const json = JSON.stringify;
const importList = (module, identifiers) => `import { ${identifiers.join(', ')} } from ${json(module)};`;
const mapFn = (items, callbackfn, thisArg) => Array.from(items).map(x => callbackfn.apply(thisArg, x));
/**
 * Generates JS module imports for a list of WASM exports.
 * @param identifier The variable to store the imports in.
 * @param exports A list of WASM imports.
 * @returns A string containing the generated import code.
 */
function generateWasmImports(identifier, wasmImports) {
    // Group all the wasm imports by module
    const jsImports = new Map();
    for (const wasmImport of wasmImports) {
        const jsImport = jsImports.get(wasmImport.module);
        if (jsImport)
            jsImport.push(wasmImport.name);
        else
            jsImports.set(wasmImport.module, [wasmImport.name]);
    }
    // Build the template
    return `
        // Import from JS modules
        ${mapFn(jsImports, importList).join('\n')}

        // Build the WASM import object
        const ${identifier} = {
            ${mapFn(jsImports, (module, imports) => `[${json(module)}]: {
                ${imports.join(',\n')}
            }`).join(',\n')}
        };`;
}
/**
 * Generates JS module exports for a list of WASM exports.
 * @param identifier The identifier of the WASM exports object.
 * @param wasmExports A list of WASM exports.
 * @returns A string containing the generated export code.
 */
function generateWasmExports(identifier, wasmExports) {
    return wasmExports.map(e => `['${e.name}']: ${identifier}.${e.name},`).join('\n');
}
/**
 * Generates a JS module wrapper around a WASM file.
 * @param path The path to the WASM file.
 * @returns A string containing the generated module.
 */
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
  ];
const exports = [
    { name: 'memory', kind: 'memory' },
    { name: 'compress', kind: 'function' },
    { name: 'decompress', kind: 'function' },
    { name: 'BrotliDecoderCreateInstance', kind: 'function' },
    { name: 'BrotliDecoderSetParameter', kind: 'function' },
    { name: 'BrotliDecoderDecompress', kind: 'function' },
    { name: 'BrotliDecoderDecompressStream', kind: 'function' },
    { name: 'BrotliDecoderDecompressStreaming', kind: 'function' },
    { name: 'BrotliDecoderDecompressWithReturnInfo', kind: 'function' },
    { name: 'BrotliDecoderDecompressPrealloc', kind: 'function' },
    { name: 'BrotliDecoderMallocU8', kind: 'function' },
    { name: 'BrotliDecoderFreeU8', kind: 'function' },
    { name: 'BrotliDecoderMallocUsize', kind: 'function' },
    { name: 'BrotliDecoderFreeUsize', kind: 'function' },
    { name: 'BrotliDecoderDestroyInstance', kind: 'function' },
    { name: 'BrotliDecoderVersion', kind: 'function' },
    { name: 'CBrotliDecoderErrorString', kind: 'function' },
    { name: 'BrotliDecoderErrorString', kind: 'function' },
    { name: 'CBrotliDecoderHasMoreOutput', kind: 'function' },
    { name: 'BrotliDecoderHasMoreOutput', kind: 'function' },
    { name: 'CBrotliDecoderTakeOutput', kind: 'function' },
    { name: 'BrotliDecoderTakeOutput', kind: 'function' },
    { name: 'CBrotliDecoderIsUsed', kind: 'function' },
    { name: 'BrotliDecoderIsUsed', kind: 'function' },
    { name: 'CBrotliDecoderIsFinished', kind: 'function' },
    { name: 'BrotliDecoderIsFinished', kind: 'function' },
    { name: 'CBrotliDecoderGetErrorCode', kind: 'function' },
    { name: 'BrotliDecoderGetErrorCode', kind: 'function' },
    { name: 'CBrotliDecoderGetErrorString', kind: 'function' },
    { name: 'BrotliDecoderGetErrorString', kind: 'function' },
    { name: 'BrotliEncoderCompressMulti', kind: 'function' },
    { name: 'BroccoliCreateInstance', kind: 'function' },
    { name: 'BroccoliCreateInstanceWithWindowSize', kind: 'function' },
    { name: 'BroccoliDestroyInstance', kind: 'function' },
    { name: 'BroccoliNewBrotliFile', kind: 'function' },
    { name: 'BroccoliConcatStream', kind: 'function' },
    { name: 'BroccoliConcatStreaming', kind: 'function' },
    { name: 'BroccoliConcatFinish', kind: 'function' },
    { name: 'BroccoliConcatFinished', kind: 'function' },
    { name: 'BrotliEncoderMaxCompressedSizeMulti', kind: 'function' },
    { name: 'BrotliEncoderCreateWorkPool', kind: 'function' },
    { name: 'BrotliEncoderDestroyWorkPool', kind: 'function' },
    { name: 'BrotliEncoderCompressWorkPool', kind: 'function' },
    { name: 'BrotliEncoderCreateInstance', kind: 'function' },
    { name: 'BrotliEncoderSetParameter', kind: 'function' },
    { name: 'BrotliEncoderDestroyInstance', kind: 'function' },
    { name: 'BrotliEncoderIsFinished', kind: 'function' },
    { name: 'BrotliEncoderHasMoreOutput', kind: 'function' },
    { name: 'BrotliEncoderSetCustomDictionary', kind: 'function' },
    { name: 'BrotliEncoderTakeOutput', kind: 'function' },
    { name: 'BrotliEncoderVersion', kind: 'function' },
    { name: 'BrotliEncoderMaxCompressedSize', kind: 'function' },
    { name: 'BrotliEncoderCompress', kind: 'function' },
    { name: 'BrotliEncoderCompressStreaming', kind: 'function' },
    { name: 'BrotliEncoderCompressStream', kind: 'function' },
    { name: 'BrotliEncoderMallocU8', kind: 'function' },
    { name: 'BrotliEncoderFreeU8', kind: 'function' },
    { name: 'BrotliEncoderMallocUsize', kind: 'function' },
    { name: 'BrotliEncoderFreeUsize', kind: 'function' },
    { name: '__wbindgen_malloc', kind: 'function' },
    { name: '__wbindgen_realloc', kind: 'function' },
    { name: '__wbindgen_add_to_stack_pointer', kind: 'function' },
    { name: '__wbindgen_free', kind: 'function' }
];
export async function generateWasmModule(path) {
    // Get the WASM metadata
    let { imports, exports } = await getWasmMetadata(path);
    imports = imports.map(({ module, ...rest }) => ({ module: module.replace("brotli_wasm_bg.js", "brotli"), ...rest}))
    // Build the template
    return `
        import wasmModule from ${JSON.stringify(path)};

        ${generateWasmImports('imports', imports)}

        async function loadWasm(module, imports) {
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

        export default (async () => {
            let { instance, module } = await loadWasm(wasmModule, imports);
            return { instance, module, ${generateWasmExports('instance.exports', exports)} };
        })();
    `;
}