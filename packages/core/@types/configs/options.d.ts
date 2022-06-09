import type { BuildOptions, InitializeOptions } from "esbuild-wasm";
import type { OutputOptions } from "rollup";
import type { TemplateType } from "../plugins/analyzer/types/template-types";
import type { PLATFORM } from "./platform";
import { FileSystem, getFile, setFile, getResolvedPath } from "../utils/filesystem";
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
    /**
     * Enables converting ascii logs to HTML so virtual consoles can handle the logs and print with color
     */
    ascii?: "html" | "html-and-ascii" | "ascii";
    /**
     * A virtual file system where you can input files, get, set and read files
     */
    filesystem?: {
        /** Virtual Filesystem Storage */
        files?: typeof FileSystem;
        /**
         * Retrevies file from virtual file system storage in either string or uint8array buffer format
         *
         * @param path path of file in virtual file system storage
         * @param type format to retrieve file in, buffer and string are the 2 option available
         * @param importer an absolute path to use to determine a relative file path
         * @returns file from file system storage in either string format or as a Uint8Array buffer
         */
        get?: typeof getFile;
        /**
         * Writes file to filesystem in either string or uint8array buffer format
         *
         * @param path path of file in virtual file system storage
         * @param content contents of file to store, you can store buffers and/or strings
         * @param importer an absolute path to use to determine a relative file path
         */
        set?: typeof setFile;
        /**
         * Resolves path to a file in the virtual file system storage
         *
         * @param path the relative or absolute path to resolve to
         * @param importer an absolute path to use to determine relative file paths
         * @returns resolved final path
         */
        resolve?: typeof getResolvedPath;
        /**
         * Clear all files from the virtual filesystem storage
         */
        clear?: typeof FileSystem.clear;
    };
    /**
     * Configures how esbuild-wasm is initialized
     */
    init?: InitializeOptions & {
        platform?: PLATFORM;
    };
    /**
     * Documentation: https://esbuild.github.io/api/#entry-points
     */
    entryPoints?: BuildOptions["entryPoints"];
};
export declare const EasyDefaultConfig: BundleConfigOptions;
export declare const DefaultConfig: BundleConfigOptions;
