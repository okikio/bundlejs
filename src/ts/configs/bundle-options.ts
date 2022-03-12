import type { BuildOptions } from "esbuild-wasm";

/** The compression algorithim to use, there are currently 3 options "gzip", "brotli", and "lz4" */
export type CompressionType = "gzip" | "brotli" | "lz4";
export type BundleConfigOptions = { 
    /** esbuild config options https://esbuild.github.io/api/#build-api */
    esbuild?: BuildOptions,
    
    /** The compression algorithim to use, there are currently 3 options "gzip", "brotli", and "lz4" */
    compression?: {
        /** The compression algorithim to use, there are currently 3 options "gzip", "brotli", and "lz4" */
        type: CompressionType,

        /** Compression quality ranging from 1 to 11 */
        quality: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11
    } | CompressionType
};

export const DefaultConfig: BundleConfigOptions = {
    "compression": "gzip",
    "esbuild": {
        "target": ["esnext"],
        "format": "esm",
        "bundle": true,
        "minify": true,
        "color": true,

        "treeShaking": true,
        "platform": "browser",
        "globalName": "bundledCode",

        "logLevel": "info",
        "sourcemap": false,
        "incremental": false,
    }
}

export const DefaultConfigStr = JSON.stringify(DefaultConfig);