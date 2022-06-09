import type { PartialMessage } from "esbuild-wasm";
/**
 * Inspired by https://github.com/egoist/play-esbuild/blob/main/src/lib/esbuild.ts
 * I didn't even know this was exported by esbuild, great job @egoist
*/
export declare const createNotice: (errors: PartialMessage[], kind?: "error" | "warning", color?: boolean) => Promise<string[]>;
export default createNotice;
