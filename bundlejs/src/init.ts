import type * as ESBUILD from "esbuild-wasm";

import type { Platform } from "./configs/platform";
import { PLATFORM_AUTO } from "./configs/platform";

import { EVENTS } from "./configs/events";
import { getState, setState } from "./configs/state";
import { getEsbuild } from "./utils/get-esbuild";

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
        } else if ("wasmURL" in opts) { 
          await esbuild.initialize(opts);
        } else {
          const { default: ESBUILD_WASM } = await import("./wasm");
          const wasmModule = new WebAssembly.Module(await ESBUILD_WASM());
          await esbuild.initialize({
            wasmModule: wasmModule,
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