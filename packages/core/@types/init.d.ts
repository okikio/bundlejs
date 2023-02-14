import type * as ESBUILD from "esbuild-wasm";
import type { Platform } from "./configs/platform.ts";
/**
 * Configures how esbuild running in wasm is initialized
 */
export type InitOptions = ESBUILD.InitializeOptions & {
    platform?: Platform;
};
export declare function init(platform?: Platform, opts?: ESBUILD.InitializeOptions): Promise<typeof import("esbuild-wasm/esm/browser")>;
