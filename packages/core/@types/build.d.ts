import type { CommonConfigOptions, ESBUILD } from "./types.ts";
import { getState, setState } from "./configs/state.ts";
import { useFileSystem, IFileSystem } from "./utils/filesystem.ts";
/**
 * Local state available to all plugins
 */
export type LocalState = {
    filesystem?: Awaited<ReturnType<typeof useFileSystem>>;
    /**
     * Assets are files during the build process that esbuild can't handle natively,
     * e.g. fetching web workers using the `new URL("...", import.meta.url)`
     */
    assets?: ESBUILD.OutputFile[];
    /**
     * Array storing the [getter, setter] of the global state
     */
    GLOBAL?: [typeof getState, typeof setState];
    [key: string]: unknown;
};
export type BuildConfig = CommonConfigOptions & {
    /** esbuild config options https://esbuild.github.io/api/#build-api */
    esbuild?: ESBUILD.BuildOptions;
    /** The default CDN to import packages from */
    cdn?: "https://unpkg.com" | "https://esm.run" | "https://cdn.esm.sh" | "https://cdn.esm.sh" | "https://cdn.skypack.dev" | "https://cdn.jsdelivr.net/npm" | "https://cdn.jsdelivr.net/gh" | "https://deno.land/x" | "https://raw.githubusercontent.com" | "unpkg" | "esm.run" | "esm.sh" | "esm" | "skypack" | "jsdelivr" | "jsdelivr.gh" | "github" | "deno" | (string & object);
    /** Aliases for replacing packages with different ones, e.g. replace "fs" with "memfs", so, it can work on the web, etc... */
    alias?: Record<string, string>;
    /**
     * Enables converting ascii logs to HTML so virtual consoles can handle the logs and print with color
     */
    ascii?: "html" | "html-and-ascii" | "ascii";
    /**
     * Documentation: https://esbuild.github.io/api/#entry-points
     */
    entryPoints?: ESBUILD.BuildOptions["entryPoints"];
};
/**
 * Default build config
 */
export declare const BUILD_CONFIG: BuildConfig;
export type BuildResult = (ESBUILD.BuildResult) & {
    outputs: ESBUILD.OutputFile[];
    contents: ESBUILD.OutputFile[];
};
export declare const TheFileSystem: Promise<IFileSystem<IFileSystem<Map<string, FileSystemDirectoryHandle | FileSystemHandle | import("./utils/filesystem.ts").FileSystemFileHandle>, FileSystemDirectoryHandle | FileSystemHandle | import("./utils/filesystem.ts").FileSystemFileHandle>, Uint8Array> | IFileSystem<Map<string, Uint8Array>, Uint8Array>>;
export declare function build(opts?: BuildConfig, filesystem?: Promise<IFileSystem<IFileSystem<Map<string, FileSystemDirectoryHandle | FileSystemHandle | import("./utils/filesystem.ts").FileSystemFileHandle>, FileSystemDirectoryHandle | FileSystemHandle | import("./utils/filesystem.ts").FileSystemFileHandle>, Uint8Array> | IFileSystem<Map<string, Uint8Array>, Uint8Array>>): Promise<BuildResult>;
