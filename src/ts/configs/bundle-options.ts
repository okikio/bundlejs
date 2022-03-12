import type { BuildOptions } from "esbuild-wasm";
import { deepAssign } from "../util/deep-equal";
import { HOST } from "../util/loader";

/** The compression algorithim to use, there are currently 3 options "gzip", "brotli", and "lz4" */
export type CompressionType = "gzip" | "brotli" | "lz4";

/** 
* You can configure the quality of the compression using an object, 
* e.g.
* ```ts
* {
*  ...
*  "compression": {
*    "type": "brotli",
*    "quality": 5
*  }
* }
* ```
*/
export type CompressionOptions = {
    /** The compression algorithim to use, there are currently 3 options "gzip", "brotli", and "lz4" */
    type: CompressionType,

    /** Compression quality ranging from 1 to 11 */
    quality: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11
};
export type BundleConfigOptions = { 
    /** esbuild config options https://esbuild.github.io/api/#build-api */
    esbuild?: BuildOptions,

    /** The default CDN to import packages from */
    cdn?: "https://unpkg.com" | "https://esm.run" | "https://cdn.esm.sh" | "https://cdn.esm.sh" | "https://cdn.skypack.dev" | "https://unpkg.com" | "https://cdn.jsdelivr.net/npm" | (string & {}),

    /** Aliases for replacing packages with different ones, e.g. replace "fs" with "memfs", so, it can work on the web, etc... */
    alias?: Record<string, string>,
    
    /** 
     * The compression algorithim to use, there are currently 3 options "gzip", "brotli", and "lz4".
     * You can also configure the quality of the compression using an object, 
     * e.g.
     * ```ts
     * {
     *  ...
     *  "compression": {
     *    "type": "brotli",
     *    "quality": 5
     *  }
     * }
     * ```
    */
    compression?: CompressionOptions | CompressionType
};

export const EasyDefaultConfig: BundleConfigOptions = {
    "cdn": HOST,
    "compression": "gzip",
    "esbuild": {
        "target": ["esnext"],
        "format": "esm",
        "bundle": true,
        "minify": true,

        "treeShaking": true,
        "platform": "browser"
    }
};

export const DefaultConfig: BundleConfigOptions = deepAssign({}, EasyDefaultConfig, {
    "esbuild": {
        "color": true,
        "globalName": "BundledCode",

        "logLevel": "info",
        "sourcemap": false,
        "incremental": false,
    }
});