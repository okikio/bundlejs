import type * as ESBUILD from "esbuild-wasm";

import type { Platform } from "./configs/platform.ts";
import { PLATFORM_AUTO } from "./configs/platform.ts";

import { defaultVersion, getEsbuild, getEsbuildVersion } from "./utils/get-esbuild.ts";
import { INIT_COMPLETE, INIT_ERROR, INIT_START, dispatchEvent } from "./configs/events.ts";
import { getState, setState } from "./configs/state.ts";

/**
 * Configures how esbuild running in wasm is initialized 
 */
export type InitOptions = ESBUILD.InitializeOptions & { platform?: Platform };

export async function init([platform = PLATFORM_AUTO, _version = defaultVersion]: Partial<[Platform, string]>, opts?: Partial<ESBUILD.InitializeOptions> | null) {
  opts ??= {};
  try {
    if (!getState("initialized")) {
      setState("initialized", true);
      dispatchEvent(INIT_START);

      const version = await getEsbuildVersion(_version);
      const esbuild = await getEsbuild(platform, version);
      setState("esbuild", esbuild);
      
      if (
        platform !== "node" &&
        platform !== "deno"
      ) {
        if ("wasmModule" in opts) {
          await esbuild.initialize(opts);
        } else if ("wasmURL" in opts) { 
          await esbuild.initialize(opts);
        } else if (version === defaultVersion) {
          const { default: ESBUILD_WASM } = await import("./wasm.ts");
          await esbuild.initialize({
            wasmModule: new WebAssembly.Module(await ESBUILD_WASM()),
            ...opts
          });
        } else {
          await esbuild.initialize(opts);
        }
      }

      dispatchEvent(INIT_COMPLETE);
    }

    return getState("esbuild");
  } catch (e) {
    const error = e as Error | unknown;
    dispatchEvent(INIT_ERROR, error as Error);
    console.error(error);
  }
}