import type { CommonConfigOptions, ESBUILD } from "./types.ts";

import { getState } from "./configs/state.ts";
import { PLATFORM_AUTO } from "./configs/platform.ts";
import { createConfig } from "./configs/config.ts";

import { createNotice } from "./utils/create-notice.ts";
import { init } from "./init.ts";
import { INIT_LOADING, LOGGER_ERROR, dispatchEvent } from "./configs/events.ts";

export type TransformConfig = CommonConfigOptions & {
  /* https://esbuild.github.io/api/#transform-api */
  esbuild?: ESBUILD.TransformOptions,
};

/**
 * Default transform config
 */
export const TRANSFORM_CONFIG: TransformConfig = {
  "esbuild": {
    "target": ["esnext"],
    "format": "esm",
    "minify": true,

    "treeShaking": true,
    "platform": "browser"
  },
  init: {
    platform: PLATFORM_AUTO
  }
};

export async function transform(input: string | Uint8Array, opts: TransformConfig = {}) {
  if (!getState("initialized"))
    dispatchEvent(INIT_LOADING);

  const CONFIG = createConfig("transform", opts);

  const { platform, ...initOpts } = CONFIG.init;
  const { transform } = await init(platform, initOpts);
  const { define = {}, ...esbuildOpts } = CONFIG.esbuild ?? {};

  // Stores content from all external outputed files, this is for checking the gzip size when dealing with CSS and other external files
  let result: ESBUILD.TransformResult;

  try {
    try {
      const key = "p.env.NODE_ENV".replace("p.", "process.");
      result = await transform(input, {
        define: {
          "__NODE__": "false",
          [key]: "\"production\"",
          ...define
        },
        ...esbuildOpts,
      });
    } catch (e) {
      if (e.errors) {
        // Log errors with added color info. to the virtual console
        const asciMsgs = [...await createNotice(e.errors, "error", false)];
        const htmlMsgs = [...await createNotice(e.errors, "error")];

        dispatchEvent(LOGGER_ERROR, new Error(JSON.stringify({ asciMsgs, htmlMsgs })));

        const message = (htmlMsgs.length > 1 ? `${htmlMsgs.length} error(s) ` : "") + "(if you are having trouble solving this issue, please create a new issue in the repo, https://github.com/okikio/bundlejs)";
        dispatchEvent(LOGGER_ERROR, new Error(message));
        return;
      } else throw e;
    }

    return result;
  } catch (e) { }
}