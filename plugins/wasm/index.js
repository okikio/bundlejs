import fs from 'fs';
import path from 'path';
import { generateWasmModule } from './module.js';
const WASM_MODULE_NAMESPACE = 'wasm-module';
const WASM_DEFERRED_NAMESPACE = 'wasm-deferred';
const WASM_EMBEDDED_NAMESPACE = 'wasm-embedded';
/**
 * Loads `.wasm` files as a js module.
 */
function wasmLoader(options) {
    var _a;
    const embed = ((_a = options === null || options === void 0 ? void 0 : options.mode) === null || _a === void 0 ? void 0 : _a.toLowerCase()) == 'embedded';
    return {
        name: 'wasm',
        setup(build) {
            // Catch "*.wasm" files in the resolve phase and redirect them to our custom namespaces
            build.onResolve({ filter: /\.(?:wasm)$/ }, (args) => {
                // If it's already in the virtual module namespace, redirect to the file loader
                if (args.namespace === WASM_MODULE_NAMESPACE) {
                    return { path: args.path, namespace: embed ? WASM_EMBEDDED_NAMESPACE : WASM_DEFERRED_NAMESPACE };
                }
                // Ignore unresolvable paths
                if (args.resolveDir === '')
                    return;
                // Redirect to the virtual module namespace
                return {
                    path: path.isAbsolute(args.path) ? args.path : path.join(args.resolveDir, args.path),
                    namespace: WASM_MODULE_NAMESPACE,
                };
            });
            // For virtual module loading, build a virtual module for the wasm file
            build.onLoad({ filter: /.*/, namespace: WASM_MODULE_NAMESPACE }, async (args) => {
                return {
                    contents: await generateWasmModule(args.path),
                    resolveDir: path.dirname(args.path)
                };
            });
            // For deffered file loading, get the wasm binary data and pass it to esbuild's built-in `file` loader
            build.onLoad({ filter: /.*/, namespace: WASM_DEFERRED_NAMESPACE }, async (args) => ({
                contents: await fs.promises.readFile(args.path),
                loader: 'file'
            }));
            // For embedded file loading, get the wasm binary data and pass it to esbuild's built-in `binary` loader
            build.onLoad({ filter: /.*/, namespace: WASM_EMBEDDED_NAMESPACE }, async (args) => ({
                contents: await fs.promises.readFile(args.path),
                loader: 'binary'
            }));
        }
    };
}
export { wasmLoader, wasmLoader as WASM, wasmLoader as default };