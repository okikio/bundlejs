/// <reference lib="webworker" />
import type { PartialMessage, InitializeOptions } from "esbuild-wasm";
import { EventEmitter } from "@okikio/emitter";
export declare let _initialized: boolean;
export declare const initEvent: EventEmitter;
export declare const init: (opts?: InitializeOptions) => Promise<void>;
/**
 * Inspired by https://github.com/egoist/play-esbuild/blob/main/src/lib/esbuild.ts
 * I didn't even know this was exported by esbuild, great job @egoist
*/
export declare const createNotice: (errors: PartialMessage[], kind?: "error" | "warning", color?: boolean) => Promise<string[]>;
/**
 * Contains the entire esbuild worker script
 *
 * @param port The Shared Worker port to post messages on
 */
export declare const start: (port: MessagePort) => Promise<void>;
export {};
