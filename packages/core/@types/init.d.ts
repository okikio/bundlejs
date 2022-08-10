import type * as ESBUILD from "esbuild-wasm";
export type { ESBUILD };
import { Platform } from "./configs/platform";
/**
 * Determines which esbuild skew to use depending on the platform option supplied,
 * by default it will choose the most perfomnant esbuild skew,
 * so on deno and node it will choose the native while on browsers it will choose WASM.
 *
 * You can specifiy which platform skew you would like,
 * for example you can choose "deno-wasm" as a skew, where you can run the esbuild but in WASM
 *
 * @param platform Which platform skew of esbuild should be used
 * @returns Esbuild module
 */
export declare function getEsbuild(platform?: Platform): Promise<typeof ESBUILD>;
/**
 * Configures how esbuild running in wasm is initialized
 */
export declare type InitOptions = ESBUILD.InitializeOptions & {
    platform?: Platform;
};
export declare function init(platform?: Platform, opts?: ESBUILD.InitializeOptions): Promise<typeof ESBUILD>;
