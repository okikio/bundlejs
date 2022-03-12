import fs from 'fs';
/**
 * Gets metadata for a WASM binary.
 * @param path The path to the WASM binary.
 * @returns Metadata for the WASM binary.
 */
export async function getWasmMetadata(path) {
    const module = await WebAssembly.compile(await fs.promises.readFile(path));
    // console.log(WebAssembly.Module.imports(module))
    return {
        imports: WebAssembly.Module.imports(module),
        exports: WebAssembly.Module.exports(module)
    };
}