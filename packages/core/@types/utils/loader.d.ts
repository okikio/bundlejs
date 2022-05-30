import type { Loader } from 'esbuild-wasm';
/** Based on https://github.com/egoist/play-esbuild/blob/main/src/lib/esbuild.ts */
export declare const RESOLVE_EXTENSIONS: string[];
/**
 * Based on the file extention determine the esbuild loader to use
 */
export declare const inferLoader: (urlStr: string) => Loader;
