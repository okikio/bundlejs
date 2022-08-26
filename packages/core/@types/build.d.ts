import type { CommonConfigOptions, ESBUILD, ROLLUP } from "./types";
import { getState, setState } from "./configs/state";
import { FileSystem, getFile, setFile, getResolvedPath } from "./utils/filesystem";
/**
 * Local state available to all plugins
 */
export declare type LocalState = {
    /**
     * Assets are files during the build process that esbuild can't handle natively,
     * e.g. fetching web workers using the `new URL("...", import.meta.url)`
     */
    assets?: ESBUILD.OutputFile[];
    /**
     * Array storing the [getter, setter] of the global state
     */
    GLOBAL?: [typeof getState, typeof setState];
    [key: string]: any;
};
export declare type BuildConfig = CommonConfigOptions & {
    /** Enable using rollup for treeshaking. Only works while the `esbuild.treeShaking` option is true */
    rollup?: ROLLUP.OutputOptions | boolean;
    /** esbuild config options https://esbuild.github.io/api/#build-api */
    esbuild?: ESBUILD.BuildOptions;
    /** The default CDN to import packages from */
    cdn?: "https://unpkg.com" | "https://esm.run" | "https://cdn.esm.sh" | "https://cdn.esm.sh" | "https://cdn.skypack.dev" | "https://cdn.jsdelivr.net/npm" | "https://cdn.jsdelivr.net/gh" | "https://deno.land/x" | "https://raw.githubusercontent.com" | "unpkg" | "esm.run" | "esm.sh" | "esm" | "skypack" | "jsdelivr" | "jsdelivr.gh" | "github" | "deno" | (string & {});
    /** Aliases for replacing packages with different ones, e.g. replace "fs" with "memfs", so, it can work on the web, etc... */
    alias?: Record<string, string>;
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
     * Documentation: https://esbuild.github.io/api/#entry-points
     */
    entryPoints?: ESBUILD.BuildOptions["entryPoints"];
};
/**
 * Default build config
 */
export declare const BUILD_CONFIG: BuildConfig;
export declare type BuildResult = (ESBUILD.BuildResult | ESBUILD.BuildIncremental) & {
    outputs: ESBUILD.OutputFile[];
    contents: ESBUILD.OutputFile[];
};
export declare function build(opts?: BuildConfig): Promise<BuildResult>;
