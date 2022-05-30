import type { BuildOptions } from "esbuild-wasm/esm/browser";
import type { OutputOptions } from "rollup/dist/es/rollup.browser";
import type { TemplateType } from "../plugins/analyzer/types/template-types";
/** The compression algorithim to use, there are currently 3 options "gzip", "brotli", and "lz4" */
export declare type CompressionType = "gzip" | "brotli" | "lz4";
/**
* You can configure the quality of the compression using an object,
* e.g.
* ```ts
* {
*  ...
*  "compression": {
*    "type": "brotli",
*    "quality": 5
*  }
* }
* ```
*/
export declare type CompressionOptions = {
    /** The compression algorithim to use, there are currently 3 options "gzip", "brotli", and "lz4" */
    type: CompressionType;
    /** Compression quality ranging from 1 to 11 */
    quality: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
};
export declare type BundleConfigOptions = {
    /** Enable using rollup for treeshaking. Only works while the `esbuild.treeShaking` option is true */
    rollup?: OutputOptions | boolean;
    /** esbuild config options https://esbuild.github.io/api/#build-api */
    esbuild?: BuildOptions;
    /** The default CDN to import packages from */
    cdn?: "https://unpkg.com" | "https://esm.run" | "https://cdn.esm.sh" | "https://cdn.esm.sh" | "https://cdn.skypack.dev" | "https://cdn.jsdelivr.net/npm" | "https://cdn.jsdelivr.net/gh" | "https://deno.land/x" | "https://raw.githubusercontent.com" | "unpkg" | "esm.run" | "esm.sh" | "esm" | "skypack" | "jsdelivr" | "jsdelivr.gh" | "github" | "deno" | (string & {});
    /** Aliases for replacing packages with different ones, e.g. replace "fs" with "memfs", so, it can work on the web, etc... */
    alias?: Record<string, string>;
    /**
     * The compression algorithim to use, there are currently 3 options "gzip", "brotli", and "lz4".
     * You can also configure the quality of the compression using an object,
     * e.g.
     * ```ts
     * {
     *  ...
     *  "compression": {
     *    "type": "brotli",
     *    "quality": 5
     *  }
     * }
     * ```
    */
    compression?: CompressionOptions | CompressionType;
    /**
     * Generates interactive zoomable charts displaing the size of output files.
     * It's a great way to determine what causes the bundle size to be so large.
     */
    analysis?: TemplateType | boolean;
};
export declare const EasyDefaultConfig: BundleConfigOptions;
export declare const DefaultConfig: BundleConfigOptions;
