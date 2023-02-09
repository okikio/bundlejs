import type * as ESBUILD from "esbuild-wasm";

import type { Platform } from "./configs/platform.ts";
import { PLATFORM_AUTO } from "./configs/platform.ts";

import { EVENTS } from "./configs/events.ts";
import { getState, setState } from "./configs/state.ts";
import { getEsbuild } from "./utils/get-esbuild.ts";

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
          const { default: ESBUILD_WASM } = await import("./wasm.ts");
          const wasmModule = new WebAssembly.Module(await ESBUILD_WASM());
          console.log({
            wasmModule
          })
          await esbuild.initialize({
            // wasmModule: wasmModule,
            wasmURL: "./esbuild.wasm",
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