/**
 * `@bundlejs/core`'s supported platforms
 */
import * as dntShim from "../_dnt.shims.js";

export type PLATFORM = "node" | "deno" | "browser";

/**
 * Automatically chooses the esbuild version to run based off platform heuristics, 
 * e.g. 
 * - The environment is deno if it supports `globalThis.Deno`
 * - The environment is node if it supports `globalThis.process`
 * - Otherwise the environment is the browser
 * 
 */
export const PLATFORM_AUTO: PLATFORM = ("Deno" in dntShim.dntGlobalThis) ? "deno" : ("process" in dntShim.dntGlobalThis) ? "node" : "browser";