/// <reference lib="webworker" />
import type { ESBUILD } from "@bundlejs/core/src/index";
import { init } from "@bundlejs/core/src/index";

import ESBUILD_WASM_URL from "@bundlejs/core/src/esbuild.wasm?url";
import { PLATFORM_AUTO } from "@bundlejs/core/src/index";

export let initOpts: ESBUILD.InitializeOptions = null;

export const ready = (async () => {
  initOpts = {
    wasmURL: ESBUILD_WASM_URL,
    worker: false
  };
  return await init(PLATFORM_AUTO, initOpts);
})();
