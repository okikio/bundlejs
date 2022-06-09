/// <reference lib="webworker" />
import type { BundleConfigOptions } from "../src/configs/options";
import type { Plugin } from "rollup";
export declare const isFileSchema: (id: string) => boolean;
export declare const isRelativePath: (id: string) => boolean;
export declare const stripSchema: (id: string) => string;
export declare const SEARCH_EXTENSIONS: string[];
export declare function searchFile(vfs: Map<string, string>, filepath: string, extensions: string[]): string;
export declare const virtualfs: (vfs: Map<string, string>) => Plugin;
export declare const treeshake: (code: string, options?: BundleConfigOptions["esbuild"], rollupOpts?: BundleConfigOptions["rollup"]) => Promise<string>;
export default treeshake;
