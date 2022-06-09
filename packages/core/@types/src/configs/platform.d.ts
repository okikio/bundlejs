/**
 * `@bundlejs/core`'s supported platforms
 */
export declare type PLATFORM = "node" | "deno" | "browser";
/**
 * Automatically chooses the esbuild version to run based off platform heuristics,
 * e.g.
 * - The environment is deno if it supports `globalThis.Deno`
 * - The environment is node if it supports `globalThis.process`
 * - Otherwise the environment is the browser
 *
 */
export declare const PLATFORM_AUTO: PLATFORM;
