/// <reference lib="webworker" />
import type { ESBUILD } from "@bundlejs/core/src/index";

import { init } from "@bundlejs/core/src/index";
import { PLATFORM_AUTO } from "@bundlejs/core/src/index";

export let initOpts: ESBUILD.InitializeOptions = null;
export const ready = (async () => {
  initOpts = { worker: false };
  return await init(PLATFORM_AUTO, initOpts);
})();
