"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseConfig = exports.parseShareQuery = exports.parseTreeshakeExports = void 0;
const lz_string_1 = require("@amoutonbrady/lz-string");
const options_js_1 = require("../configs/options.js");
const deep_equal_js_1 = require("./deep-equal.js");
/**
 * Treeshake exports/imports. It allows for specifing multiple exports per package, through this syntax
 * ```ts
 * "[{ x,y,z }],[*],[* as X],[{ type xyz }]"
 * // to
 * export { x, y, z } from "...";
 * export * from "...";
 * export * as X from "...";
 * export { type xyz } from "...";
 * ```
 * where the square brackets represent seperate packages, and everything inside the squarebrackets,
 * are the exported methods, types, etc...
 */
const parseTreeshakeExports = (str) => (str ?? "").split(/\],/).map((str) => str.replace(/\[|\]/g, ""));
exports.parseTreeshakeExports = parseTreeshakeExports;
// Inspired by https://github.com/solidjs/solid-playground
/**
* Converts URL's into code. It allows for specifing multiple exports per package, through this syntax
* ```ts
* "/?q=(import)@okikio/emitter,(import)@okikio/animate,(import)@okikio/animate,(import)@okikio/animate,(import)@okikio/animate,@okikio/animate,@okikio/animate,@okikio/animate,@okikio/animate&treeshake=[T],[{+animate+}],[{+animate+as+B+}],[*+as+TR],[{+type+animate+}],[*],[{+animate+as+A+}],[*+as+PR],[{+animate+}]&share=MYewdgziA2CmB00QHMAUAiAwiG6CUQA"
* // to
* // Click Build for the Bundled, Minified & Gzipped package size
* import T from "@okikio/emitter";
* import { animate } from "@okikio/animate";
* import { animate as B } from "@okikio/animate";
* import * as TR from "@okikio/animate";
* import { type animate } from "@okikio/animate";
* export * from "@okikio/animate";
* export { animate as A } from "@okikio/animate";
* export * as PR from "@okikio/animate";
* export { animate } from "@okikio/animate";
* console.log("Cool")
* ```
* - `q` represents the module, e.g. react, vue, etc... You can add `(import)` in-front of a specific module to make it an import instead of an export
* - `treeshake` represents the exports to treeshake. Read more about this here, {@link parseTreeshakeExports}
* - `share` represents all other code that isn't export/import
*/
const parseShareQuery = (shareURL) => {
    try {
        const searchParams = shareURL.searchParams;
        const query = searchParams.get("query") || searchParams.get("q");
        const treeshake = searchParams.get("treeshake");
        let result = "";
        if (query) {
            const queryArr = query.trim().split(",");
            const treeshakeArr = (0, exports.parseTreeshakeExports)((treeshake ?? "").trim());
            result += ("// Click Build for the Bundled, Minified & Compressed package size\n" +
                queryArr
                    .map((q, i) => {
                    const treeshakeExports = treeshakeArr[i] && treeshakeArr[i].trim() !== "*"
                        ? treeshakeArr[i].trim().split(",").join(", ")
                        : "*";
                    const [, , declaration = "export", module] = /^(\((.*)\))?(.*)/.exec(q);
                    return `${declaration} ${treeshakeExports} from ${JSON.stringify(module)};`;
                })
                    .join("\n"));
        }
        const share = searchParams.get("share");
        if (share)
            result += "\n" + (0, lz_string_1.decompressFromURL)(share.trim());
        const plaintext = searchParams.get("text");
        if (plaintext) {
            result += "\n" + JSON.parse(
            /**
             * Support users wrapping/not-wrapping plaintext in a string,
             * e.g.
             * ```md
             *
             *
             * /?text="console.log(document)\nconsole.log(window)"
             * and
             * /?text=console.log(document)\nconsole.log(window)
             *
             *
             * are the same, they result in
             * ```ts
             * console.log(document)
             * console.log(window)
             * ```
            */
            /^["']/.test(plaintext) && /["']$/.test(plaintext) ? plaintext : JSON.stringify("" + plaintext).replace(/\\\\/g, "\\"));
        }
        return result.trim();
        // deno-lint-ignore no-empty
    }
    catch (_e) { }
};
exports.parseShareQuery = parseShareQuery;
/**
* Converts URL's into config.
* - `config` represents the JSON config
*/
const parseConfig = (shareURL) => {
    try {
        const searchParams = shareURL.searchParams;
        const config = searchParams.get("config") ?? "{}";
        return (0, deep_equal_js_1.deepAssign)({}, options_js_1.EasyDefaultConfig, JSON.parse(config ? config : "{}"));
        // deno-lint-ignore no-empty
    }
    catch (_e) { }
};
exports.parseConfig = parseConfig;
