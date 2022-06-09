/**
 * `@bundlejs/core`'s supported platforms
 */
export declare type PLATFORM = "node" | "deno" | "browser";
/**
 * Automatically chooses the esbuild version to run based off platform heuristics,
 * e.g.
 * - A deno environment supports `globalThis.Deno`
 * - A node environment supports ``
 *
 */
export declare const PLATFORM_HEURISTICS: PLATFORM;
export default PLATFORM_HEURISTICS;
