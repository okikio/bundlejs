import type { BundleConfigOptions } from "./configs/options";
import type { PLATFORM } from "./configs/platform";
import type * as ESBUILD from "esbuild-wasm";
export declare const INPUT_EVENTS: {
    build: typeof build;
    init: typeof init;
};
export declare function getESBUILD(platform?: PLATFORM): Promise<typeof ESBUILD>;
export declare function init({ platform, ...opts }?: BundleConfigOptions["init"]): Promise<typeof import("esbuild")>;
export declare function build(opts?: BundleConfigOptions): Promise<any>;
export {};
