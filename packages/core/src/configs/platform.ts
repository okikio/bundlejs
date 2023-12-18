/**
 * `@bundle/core`'s supported platforms
 */
export type Platform = "node" | "deno" | "browser" | "edge" | "cloudflare" | "wasm" | "deno-wasm";

/**
 * Automatically chooses the esbuild version to run based off platform heuristics, 
 * e.g. 
 * - The environment is deno if it supports `globalThis.Deno`
 * - The environment is node if it supports `globalThis.process`
 * - Otherwise the environment is the browser
 * 
 */
export const PLATFORM_AUTO: Platform = ("Deno" in globalThis) ? "deno" : ("process" in globalThis) ? "node" : "browser";