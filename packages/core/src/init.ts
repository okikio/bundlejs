import type * as ESBUILD from "esbuild";

import type { Platform } from "./configs/platform.ts";
import { PLATFORM_AUTO } from "./configs/platform.ts";

import { getState, setState } from "./configs/state.ts";
import { getEsbuild } from "./utils/get-esbuild.ts";
import { INIT_COMPLETE, INIT_ERROR, INIT_START, dispatchEvent } from "./configs/events.ts";

/**
 * Configures how esbuild running in wasm is initialized 
 */
export type InitOptions = ESBUILD.InitializeOptions & { platform?: Platform };

export async function init(platform = PLATFORM_AUTO, opts: ESBUILD.InitializeOptions = {}) {
  try {
    if (!getState("initialized")) {
      setState("initialized", true);
      dispatchEvent(INIT_START);

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
          await esbuild.initialize({
            wasmModule: new WebAssembly.Module(await ESBUILD_WASM() as BufferSource),
            ...opts
          });
        }
      }

      dispatchEvent(INIT_COMPLETE);
    }

    return getState("esbuild");
  } catch (error) {
    dispatchEvent(INIT_ERROR, error as Error);
    console.error(error);
  }
}