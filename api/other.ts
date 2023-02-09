export const config = {
  runtime: 'edge', // this is a pre-requisite
};

import { TextEncoder as Encoder, TextDecoder } from 'text-encoding-shim';
globalThis.TextEncoder = Encoder as unknown as TextEncoder;

import { build, compress, setFile, deepAssign, TheFileSystem, lzstring } from "../bundlejs/src/index";
import type { BuildConfig } from "../bundlejs/src/index";

// globalThis.TextEncoder = globalThis.TextEncoder ?? class TextEncoder {
//   encode = (string: string) => {
//     let code: number, ui8a: number[] = [], i = 0
//     while (code = string.charCodeAt(i++), code >= 0) {
//       code < 128
//         ? ui8a.push(code)
//         : code > 127 && code < 2048
//           ? ui8a.push(code >> 6 | 192, 63 & code | 128)
//           : ui8a.push(code >> 12 | 224, code >> 6 & 63 | 128, 63 & code | 128)
//     }
//     return ui8a
//   }
// }
globalThis.performance = globalThis.performance ?? { now: Date.now }

export const inputModelResetValue = [
  'export * from "@okikio/animate";'
].join("\n");

const timeFormatter = new Intl.RelativeTimeFormat("en", {
  style: "narrow",
  numeric: "auto",
});

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
const parseShareQuery = (shareURL: URL) => {
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
            const match = /^(\((.*)\))?(.*)/.exec(q);
            let [, ,
              declaration = "export",
              module
            ] = match ?? [];
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
const parseConfig = (shareURL: URL) => {
  try {
    const searchParams = shareURL.searchParams;
    const config = searchParams.get("config") ?? "{}";
    return deepAssign({}, JSON.parse(config ? config : "{}"));
  } catch (e) { }
};

export default async function handler(req: Request) {
  try {
    const fs = await TheFileSystem;

    const start = Date.now();

    const url = new URL(req.url);
    const initialValue = parseShareQuery(url) || inputModelResetValue;
    const initialConfig = parseConfig(url) || {};

    setFile(fs, "/index.tsx", initialValue);

    const configObj = deepAssign({}, {
      entryPoints: ["/index.tsx"],
      esbuild: {
        treeShaking: true
      },
      init: {
        platform: "browser",
        worker: false
      }
    } as BuildConfig, initialConfig);
    const result = await build(configObj);

    console.log({ result })
    // const size = await getSize(result.contents);

    const end = Date.now();

    return new Response(JSON.stringify({
      query: url.search,
      config: configObj,
      input: initialValue,
      size: {
        // type: size.type,

        // totalInitialSize: size.initialSize,
        // totalCompressedSize: size.totalCompressedSize,

        // initialSize: size.initialSize,
        // size: size.size
      },
      time: timeFormatter.format((end - start) / 1000, "seconds"),
      rawTime: (end - start) / 1000
    }), {
      status: 200,
      headers: [
        ['Cache-Control', 'max-age=10, s-maxage=8640, stale-while-revalidate'],
        ['Content-Type', 'application/json']
      ],
    })
  } catch (e) {
    console.error(e)

    return new Response(
      JSON.stringify({ error: e.toString() }),
      { status: 400, }
    )
  }
}
