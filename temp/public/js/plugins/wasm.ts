import { Plugin } from 'esbuild';
import path from 'path';
import { fs } from "memfs";

export const WASM_STUB_NAMESPACE = 'wasm-stub';
export const WASM_BINARY_NAMESPACE = 'wasm-binary';
export const WASM = (): Plugin => {
    return {
        name: 'wasm',
        setup(build) {
            // Resolve ".wasm" files to a path with a namespace
            build.onResolve({ filter: /\.wasm$/ }, args => {
                // If this is the import inside the stub module, import the
                // binary itself. Put the path in the "wasm-binary" namespace
                // to tell our binary load callback to load the binary file.
                if (args.namespace === WASM_STUB_NAMESPACE) {
                    return {
                        path: args.path,
                        namespace: WASM_BINARY_NAMESPACE,
                    }
                }

                // Otherwise, generate the JavaScript stub module for this
                // ".wasm" file. Put it in the "wasm-stub" namespace to tell
                // our stub load callback to fill it with JavaScript.
                //
                // Resolve relative paths to absolute paths here since this
                // resolve callback is given "resolveDir", the directory to
                // resolve imports against.
                if (args.resolveDir === '') {
                    return; // Ignore unresolvable paths
                }
                
                return {
                    path: path.isAbsolute(args.path) ? args.path : path.join(args.resolveDir, args.path),
                    namespace: WASM_STUB_NAMESPACE,
                    sideEffects: false,
                }
            })

            // Virtual modules in the "wasm-stub" namespace are filled with
            // the JavaScript code for compiling the WebAssembly binary. The
            // binary itself is imported from a second virtual module.
            build.onLoad({ filter: /.*/, namespace: WASM_STUB_NAMESPACE }, async (args) => ({
                contents: `
                import wasm from ${JSON.stringify(args.path)}
                export default (imports) =>
                WebAssembly.instantiate(wasm, imports).then(
                    result => result.instance.exports)`,
            }))

            // Virtual modules in the "wasm-binary" namespace contain the
            // actual bytes of the WebAssembly file. This uses esbuild's
            // built-in "binary" loader instead of manually embedding the
            // binary data inside JavaScript code ourselves.
            build.onLoad({ filter: /.*/, namespace: WASM_BINARY_NAMESPACE }, async (args) => ({
                contents: await fs.promises.readFile(args.path),
                loader: 'binary',
            }))
        },
    };
};