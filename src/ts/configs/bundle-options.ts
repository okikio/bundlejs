import type { BuildOptions } from "esbuild-wasm";

export type BundleConfigOptions = BuildOptions & { 
    other: {
        compression: {
            type: "gzip" | "brotli",
            quality: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11
        }
    }
};

export const DefaultConfig: BundleConfigOptions = {
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
    
    "other": {
        "compression": {
            "type": "gzip",
            "quality": 9
        }
    }
}

export const DefaultConfigStr = JSON.stringify(DefaultConfig);