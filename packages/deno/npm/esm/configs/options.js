import { PLATFORM_AUTO } from "./platform.js";
import { FileSystem, getFile, setFile, getResolvedPath } from "../utils/filesystem.js";
import { DEFAULT_CDN_HOST } from "../utils/util-cdn.js";
import { deepAssign } from "../utils/deep-equal.js";
export const EasyDefaultConfig = {
    entryPoints: ["/index.tsx"],
    "cdn": DEFAULT_CDN_HOST,
    "compression": "gzip",
    "analysis": false,
    "esbuild": {
        "target": ["esnext"],
        "format": "esm",
        "bundle": true,
        "minify": true,
        "treeShaking": true,
        "platform": "browser"
    }
};
export const DefaultConfig = deepAssign({}, EasyDefaultConfig, {
    "esbuild": {
        "color": true,
        "globalName": "BundledCode",
        "logLevel": "info",
        "sourcemap": false,
        "incremental": false,
    },
    "ascii": "ascii",
    filesystem: {
        files: FileSystem,
        get: getFile,
        set: setFile,
        resolve: getResolvedPath,
        clear: () => FileSystem.clear(),
    },
    init: {
        platform: PLATFORM_AUTO
    }
});
