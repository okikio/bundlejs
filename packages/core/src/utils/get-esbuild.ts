import type * as ESBUILD from "esbuild-wasm";

import type { Platform } from "../configs/platform.ts";
import { PLATFORM_AUTO } from "../configs/platform.ts";
import { version } from "esbuild-wasm/package.json";

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
export async function getEsbuild(platform: Platform = PLATFORM_AUTO): Promise<typeof ESBUILD> {
  try {
    switch (platform) {
      case "deno":
        return await import(
          /* @vite-ignore */
          `https://deno.land/x/esbuild@v${version}/mod.js`
        );
      case "deno-wasm":
        return await import(
          /* @vite-ignore */
          `https://deno.land/x/esbuild@v${version}/wasm.js`
        );
      case "node":
        return await import("esbuild");
      default:
        return await import("esbuild-wasm/esm/browser.js");
    }
  } catch (e) {
    throw e;
  }
}