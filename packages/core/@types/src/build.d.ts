/// <reference lib="webworker" />
import type { BundleConfigOptions } from "./configs/options";
import type { InitializeOptions } from "esbuild-wasm";
export declare let STATE: {
    initialized: boolean;
};
export declare const INPUT_EVENTS: {
    build: typeof build;
    init: typeof init;
};
export declare function init(opts?: InitializeOptions): Promise<void>;
export declare function build(opts?: BundleConfigOptions): Promise<void>;
export {};
