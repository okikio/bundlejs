"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inferLoader = exports.RESOLVE_EXTENSIONS = void 0;
const path_js_1 = require("./path.js");
/** Based on https://github.com/egoist/play-esbuild/blob/main/src/lib/esbuild.ts */
exports.RESOLVE_EXTENSIONS = [".tsx", ".ts", ".jsx", ".js", ".css", ".json"];
/**
 * Based on the file extention determine the esbuild loader to use
 */
const inferLoader = (urlStr) => {
    const ext = (0, path_js_1.extname)(urlStr);
    if (exports.RESOLVE_EXTENSIONS.includes(ext))
        // Resolve all .js and .jsx files to .ts and .tsx files
        return (/\.js(x)?$/.test(ext) ? ext.replace(/^\.js/, ".ts") : ext).slice(1);
    if (ext === ".mjs" || ext === ".cjs")
        return "ts"; // "js"
    if (ext === ".mts" || ext === ".cts")
        return "ts";
    if (ext == ".scss")
        return "css";
    if (ext == ".png" || ext == ".jpeg" || ext == ".ttf")
        return "dataurl";
    if (ext == ".svg" || ext == ".html" || ext == ".txt")
        return "text";
    if (ext == ".wasm")
        return "file";
    return ext.length ? "text" : "ts";
};
exports.inferLoader = inferLoader;
