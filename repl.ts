import { deepAssign, deepDiff } from "./src/ts/util/deep-equal";
let a = {
    "compression": "gzip",
    "esbuild": {
        "target": [
            "esnext"
        ],
        "format": "esm",
        "bundle": true,
        "minify": true,
        "color": true,
    }
};
let b = {
    "compression": "brotli",
    "esbuild": {
        "target": [
            "esnext",
            "es2020"
        ],
        "format": "esm",
        "bundle": true,
        "minify": false,
        "color": true,
    }
};
console.log(deepAssign({}, a, deepDiff(a, b)))