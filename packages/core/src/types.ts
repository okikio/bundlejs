import type { Platform } from "./configs/platform.ts";
import type * as ESBUILD from "esbuild-wasm/esm/browser.d.ts";

export type CommonConfigOptions = {
  /**
   * Configures how esbuild-wasm is initialized 
   */
  init?: ESBUILD.InitializeOptions & { platform?: Platform }
};

export type { ESBUILD };
