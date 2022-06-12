/**
 * `@bundlejs/core`'s supported platforms
 */
export type PLATFORM = "node" | "deno" | "browser";

/**
 * Automatically chooses the esbuild version to run based off platform heuristics, 
 * e.g. 
 * - The environment is deno if it supports `globalThis.Deno`
 * - The environment is node if it supports `globalThis.process`
 * - Otherwise the environment is the browser
 * 
 */
export const PLATFORM_AUTO: PLATFORM = ("Deno" in globalThis) ? "deno" : ("process" in globalThis) ? "node" : "browser";