import type { Loader } from 'esbuild';
import { extname } from './path';

/** Based on https://github.com/egoist/play-esbuild/blob/main/src/lib/esbuild.ts */ 
export const RESOLVE_EXTENSIONS = [".tsx", ".ts", ".jsx", ".js", ".css", ".json"];

/**
 * Based on the file extention determine the esbuild loader to use
 */
export const inferLoader = (urlStr: string): Loader => {
    const ext = extname(urlStr);
    if (RESOLVE_EXTENSIONS.includes(ext))
        return ext.slice(1) as Loader;

    if (ext === ".mjs" || ext === ".cjs") return "js";
    if (ext === ".mts" || ext === ".cts") return "ts";
    
    if (ext === ".tsx") return "tsx";
    if (ext === ".jsx") return "jsx";
    if (ext == ".scss") return "css";

    if (ext == ".png" || ext == ".jpeg" || ext == ".ttf") return "dataurl";
    if (ext == ".svg" || ext == ".html" || ext == ".txt") return "text";
    if (ext == ".wasm") return "file";

    return ext.length ? "text" : "ts";
}