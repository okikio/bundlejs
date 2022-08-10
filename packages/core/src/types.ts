import type { Platform } from "./configs/platform";
import type * as ESBUILD from "esbuild-wasm";
import type * as ROLLUP from "rollup";

export type CommonConfigOptions = {
  /**
   * Configures how esbuild-wasm is initialized 
   */
  init?: ESBUILD.InitializeOptions & { platform?: Platform }
};

export type { ESBUILD, ROLLUP };
