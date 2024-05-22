import type { BuildConfig } from "@bundle/core/src/index.ts";
import type { CompressConfig } from "@bundle/compress/src/index.ts";
import { deepMerge } from "@bundle/utils/utils/deep-equal.ts";

export type ConfigOptions = Omit<BuildConfig, "ascii" | "filesystem" | "entryPoints" | "init"> & {
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
  compression?: CompressConfig,

  /**
   * Generates interactive zoomable charts displaing the size of output files. 
   * It's a great way to determine what causes the bundle size to be so large. 
   */
  // analysis?: TemplateType | boolean
}

export const EasyDefaultConfig: ConfigOptions = {
  "cdn": "https://unpkg.com", // DEFAULT_CDN_HOST,
  "compression": "gzip",
  // "analysis": false,
  "esbuild": {
    "target": ["esnext"],
    "format": "esm",
    "bundle": true,
    "minify": true,

    "treeShaking": true,
    "platform": "browser"
  }
};

export const DefaultConfig: ConfigOptions = deepMerge(structuredClone(EasyDefaultConfig), {
  "esbuild": {
    "color": true,
    "globalName": "BundledCode",

    "logLevel": "info",
    "sourcemap": false,
  }
});

