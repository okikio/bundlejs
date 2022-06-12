import type { OutputFile } from "esbuild-wasm";
import type * as ESBUILD from "esbuild-wasm";

export const STATE = {
  initialized: false,

  /**
   * Assets are files during the build process that esbuild can't handle natively, 
   * e.g. fetching web workers using the `new URL("...", import.meta.url)`
   */
  assets: [] as OutputFile[],

  /**
   * Instance of esbuild being used
   */
  esbuild: null as unknown as typeof ESBUILD
};

export default STATE;