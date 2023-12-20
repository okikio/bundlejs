import type * as ESBUILD from "esbuild-wasm";
import type { Platform } from "../configs/platform.ts";
import { resolveVersion } from "@bundle/utils/utils/npm-search.ts";

import { PLATFORM_AUTO } from "../configs/platform.ts";
import pkg from "../../node_modules/esbuild-wasm/package.json" with { type: "json" };
export const { version: defaultVersion } = pkg;

/**
 * Determines which esbuild skew to use depending on the platform option supplied, 
 * by default it will choose the most performant esbuild skew, 
 * so on deno and node it will choose the native while on browsers it will choose WASM.
 * 
 * You can specifiy which platform skew you would like, 
 * for example you can choose "deno-wasm" as a skew, where you can run the esbuild but in WASM
 * 
 * @param platform Which platform skew of esbuild should be used
 * @param version Which esbuild version to load
 * @returns esbuild module
 */
export async function getEsbuild(platform: Platform = PLATFORM_AUTO, version = defaultVersion): Promise<typeof ESBUILD> {
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
      case "browser":
      case "edge":
      default:
        return await import("esbuild-wasm");
    }
  } catch (e) {
    throw e;
  }
}

export async function getEsbuildVersion(_version = defaultVersion) {
  return _version !== defaultVersion ?
    // Resolve semver version, e.g. `~0.19`, `latest`, etc...
    await resolveVersion(`esbuild@${_version.replace(/^(v|@)/, "")}`) :
    _version;
}