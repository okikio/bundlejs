import type { CommonConfigOptions, ESBUILD } from "./types.ts";

import { fromContext } from "./context/context.ts";
import { PLATFORM_AUTO } from "./configs/platform.ts";
import { createConfig } from "./configs/config.ts";

import { createNotice } from "./utils/create-notice.ts";
import { INIT_LOADING, LOGGER_ERROR, dispatchEvent } from "./configs/events.ts";
import { init } from "./init.ts";

export interface TransformConfig extends CommonConfigOptions {
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
  if (!fromContext("initialized"))
    dispatchEvent(INIT_LOADING);

  const LocalConfig = createConfig("transform", opts);

  const { platform, version, ...initOpts } = LocalConfig.init ?? {};
  const { transform } = await init(initOpts, [platform, version]) ?? {};
  const { define = {}, ...esbuildOpts } = LocalConfig.esbuild ?? {};

  // Stores content from all external outputed files, this is for checking the gzip size when dealing with CSS and other external files
  let transform_result: ESBUILD.TransformResult;

  try {
    if (!transform)
      throw new Error("Initialization failed, couldn't access esbuild transform function");

    try {
      // vite would automatically replace this, so I have to do it this way
      const key = "process.env.NODE_ENV";
      transform_result = await transform(input, {
        define: {
          "__NODE__": "false",
          [key]: "\"production\"",
          ...define
        },
        ...esbuildOpts,
      });
    } catch (e) {
      const fail = e as ESBUILD.TransformFailure;
      if (fail.errors) {
        // Log errors with added color info. to the virtual console
        const asciMsgs = [...await createNotice(fail.errors, "error", false)];
        const htmlMsgs = [...await createNotice(fail.errors, "error")];

        dispatchEvent(LOGGER_ERROR, new Error(JSON.stringify({ asciMsgs, htmlMsgs })));

        const message = (htmlMsgs.length > 1 ? `${htmlMsgs.length} error(s) ` : "") + "(if you are having trouble solving this issue, please create a new issue in the repo, https://github.com/okikio/bundlejs)";
        dispatchEvent(LOGGER_ERROR, new Error(message));
        return;
      } else throw e;
    }

    return transform_result;
  } catch (e) { }
}