import type * as ESBUILD from "esbuild-wasm";

import type { Platform } from "./configs/platform";
import { PLATFORM_AUTO } from "./configs/platform";

import { EVENTS } from "./configs/events";
import { getState, setState } from "./configs/state";
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
      case "node":
        return await import("esbuild");
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
      default:
        return await import("esbuild-wasm");
    }
  } catch (e) {
    throw e;
  }
}

/**
 * Configures how esbuild running in wasm is initialized 
 */
export type InitOptions = ESBUILD.InitializeOptions & { platform?: Platform };

export async function init(platform = PLATFORM_AUTO, opts: ESBUILD.InitializeOptions = {}) {
  try {
    if (!getState("initialized")) {
      setState("initialized", true);
      EVENTS.emit("init.start");

      const esbuild = await getEsbuild(platform);
      setState("esbuild", esbuild);
      if (
        platform !== "node" &&
        platform !== "deno"
      ) {
        if ("wasmModule" in opts) {
          await esbuild.initialize(opts);
        } else {
          const { default: ESBUILD_WASM } = await import("./wasm");
          await esbuild.initialize({
            wasmModule: new WebAssembly.Module(await ESBUILD_WASM()),
            ...opts
          });
        }
      }

      EVENTS.emit("init.complete");
    }

    return getState("esbuild");
  } catch (error) {
    EVENTS.emit("init.error", error);
    console.error(error);
  }
}