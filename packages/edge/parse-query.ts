import { deepAssign, lzstring } from "@bundlejs/core";

const { decompressFromURL } = lzstring;

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
export const parseTreeshakeExports = (str: string) =>
  (str ?? "").split(/\],/).map((str) => str.replace(/\[|\]/g, ""));

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
export const parseShareURLQuery = (shareURL: URL) => {
  try {
    const searchParams = shareURL.searchParams;
    let result = "";
    let query = searchParams.get("query") || searchParams.get("q");
    let treeshake = searchParams.get("treeshake");
    if (query) {
      let queryArr = query.trim().split(",");
      let treeshakeArr = parseTreeshakeExports((treeshake ?? "").trim());
      result += (
        "// Click Build for the Bundled, Minified & Compressed package size\n" +
        queryArr
          .map((q, i) => {
            let treeshakeExports =
              treeshakeArr[i] && treeshakeArr[i].trim() !== "*"
                ? treeshakeArr[i].trim().split(",").join(", ")
                : "*";
            let [, ,
              declaration = "export",
              module
            ] = /^(\((.*)\))?(.*)/.exec(q)!;
            return `${declaration} ${treeshakeExports} from ${JSON.stringify(
              module
            )};`;
          })
          .join("\n")
      );
    }

    let share = searchParams.get("share");
    if (share) result += "\n" + decompressFromURL(share.trim());

    let plaintext = searchParams.get("text");
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
        /^["']/.test(plaintext) && /["']$/.test(plaintext) ? plaintext : JSON.stringify("" + plaintext).replace(/\\\\/g, "\\")
      );
    }

    return result.trim();
  } catch (e) { }
};


/**
* Converts URL's into config. 
* - `config` represents the JSON config
*/
export const parseConfig = (shareURL: URL) => {
  try {
    const searchParams = shareURL.searchParams;
    const config = searchParams.get("config") ?? "{}";
    return deepAssign({}, JSON.parse(config ? config : "{}"));
  } catch (e) { }
};