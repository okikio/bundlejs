import type { Loader } from "esbuild-wasm";
import { extname } from "./path.ts";
import { extension } from "./media-types.ts";

/** Based on https://github.com/egoist/play-esbuild/blob/main/src/lib/esbuild.ts */
export const RESOLVE_EXTENSIONS = [".tsx", ".ts", ".jsx", ".js", ".css", ".json"];
export const _knownExtensions = [
  // Remove period `.tsx` -> `tsx`
  ...RESOLVE_EXTENSIONS.map(x => x.slice(1)),
  "mjs", "cjs", "mts", "cts", "scss",
  "png", "jpeg", "ttf", "svg",
  "html", "txt", "wasm"
];

/**
 * Based on the file extention determine the esbuild loader to use
 */
export const inferLoader = (urlStr: string, contentType?: string | null): Loader => {
  const ext = extname(urlStr);
  if (RESOLVE_EXTENSIONS.includes(ext))
    // Resolve all .js and .jsx files to .ts and .tsx files
    return (/\.js(x)?$/.test(ext) ? ext.replace(/^\.js/, ".ts") : ext).slice(1) as Loader;

  if (ext === ".mjs" || ext === ".cjs") return "ts"; // "js"
  if (ext === ".mts" || ext === ".cts") return "ts";

  if (ext === ".scss") return "css";

  if (ext === ".png" || ext === ".jpeg" || ext === ".ttf") return "dataurl";
  if (ext === ".svg" || ext === ".html" || ext === ".txt") return "text";
  if (ext === ".wasm") return "file";

  if (contentType) {
    const _ext = extension(contentType);
    if (_ext && _knownExtensions.includes(_ext))
      return inferLoader(urlStr + `.${_ext}`);
  }

  return ext.length ? "text" : "ts";
};