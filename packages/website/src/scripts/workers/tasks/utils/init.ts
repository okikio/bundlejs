/// <reference lib="webworker" />
import { init } from "@bundle/core/src/index.ts";
import { PLATFORM_AUTO } from "@bundle/core/src/index.ts";

import type { ESBUILD } from "@bundle/core/src/index.ts";

export let initOpts: ESBUILD.InitializeOptions | null = null;
export const ready = (async () => {
  initOpts = { worker: false };

  return await init([PLATFORM_AUTO], initOpts);
})();
