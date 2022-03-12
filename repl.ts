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
// console.log(deepAssign({}, a, deepDiff(a, b)))

import { encode, decode } from "./src/ts/util/encode-decode";
import { compress } from "./src/ts/deno/lz4/mod";
(async () => {
console.log(decode(await compress(encode("https://bundle.js.org/?q=unpkg:@okikio/animate&config={%22compression%22:%22brotli%22,%22esbuild%22:{%22minify%22:false}}"))));
})();