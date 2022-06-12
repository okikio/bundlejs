"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultConfig = exports.EasyDefaultConfig = void 0;
const platform_js_1 = require("./platform.js");
const filesystem_js_1 = require("../utils/filesystem.js");
const util_cdn_js_1 = require("../utils/util-cdn.js");
const deep_equal_js_1 = require("../utils/deep-equal.js");
exports.EasyDefaultConfig = {
    entryPoints: ["/index.tsx"],
    "cdn": util_cdn_js_1.DEFAULT_CDN_HOST,
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
exports.DefaultConfig = (0, deep_equal_js_1.deepAssign)({}, exports.EasyDefaultConfig, {
    "esbuild": {
        "color": true,
        "globalName": "BundledCode",
        "logLevel": "info",
        "sourcemap": false,
        "incremental": false,
    },
    "ascii": "ascii",
    filesystem: {
        files: filesystem_js_1.FileSystem,
        get: filesystem_js_1.getFile,
        set: filesystem_js_1.setFile,
        resolve: filesystem_js_1.getResolvedPath,
        clear: () => filesystem_js_1.FileSystem.clear(),
    },
    init: {
        platform: platform_js_1.PLATFORM_AUTO
    }
});
