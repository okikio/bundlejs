import type { BuildConfig, ESBUILD, LocalState } from "./types.ts";
import type { StateArray } from "./configs/state.ts";
import type { BuildResult } from "./build.ts";

import { VIRTUAL_FS } from "./plugins/virtual-fs.ts";
import { EXTERNAL } from "./plugins/external.ts";
import { ALIAS } from "./plugins/alias.ts";
import { HTTP } from "./plugins/http.ts";
import { CDN } from "./plugins/cdn.ts";

import { createConfig } from "./configs/config.ts";
import { createState, getState, setState } from "./configs/state.ts";

import { createNotice } from "./utils/create-notice.ts";
import { init } from "./init.ts";

import { BUILD_ERROR, INIT_LOADING, LOGGER_ERROR, dispatchEvent } from "./configs/events.ts";
import { TheFileSystem, formatBuildResult } from "./build.ts";

export type BuildContext = (ESBUILD.BuildContext) & {
  config: BuildConfig,
  state: StateArray<LocalState>
};

export async function context(opts: BuildConfig = {}, filesystem = TheFileSystem): Promise<BuildContext> {
  if (!getState("initialized"))
    dispatchEvent(INIT_LOADING);

  const CONFIG = createConfig("build", opts);
  const STATE = createState<LocalState>({
    filesystem: await filesystem,
    assets: [],
    GLOBAL: [getState, setState],
  });

  const { platform, ...initOpts } = CONFIG.init ?? {};
  const { context } = await init(platform, initOpts);
  const { define = {}, ...esbuildOpts } = CONFIG.esbuild ?? {};

  // Stores content from all external outputed files, this is for checking the gzip size when dealing with CSS and other external files
  let ctx: ESBUILD.BuildContext;

  try {
    try {
      ctx = await context({
        entryPoints: CONFIG?.entryPoints ?? [],
        loader: {
          ".png": "file",
          ".jpeg": "file",
          ".ttf": "file",
          ".svg": "text",
          ".html": "text",
          ".scss": "css"
        },
        define: {
          "__NODE__": "false",
          "process.env.NODE_ENV": "\"production\"",
          ...define
        },
        write: false,
        outdir: "/",
        plugins: [
          ALIAS(STATE, CONFIG),
          EXTERNAL(STATE, CONFIG),
          VIRTUAL_FS(STATE, CONFIG),
          HTTP(STATE, CONFIG),
          CDN(STATE, CONFIG),
        ],
        ...esbuildOpts,
      });
    } catch (e) {
      if (e.errors) {
        // Log errors with added color info. to the virtual console
        const ansiMsgs = await createNotice(e.errors, "error", false) ?? [];
        dispatchEvent(LOGGER_ERROR, new Error(ansiMsgs.join("\n")));

        const message = (ansiMsgs.length > 1 ? `${ansiMsgs.length} error(s) ` : "") + "(if you are having trouble solving this issue, please create a new issue in the repo, https://github.com/okikio/bundlejs)";
        dispatchEvent(LOGGER_ERROR, new Error(message));

        const htmlMsgs = await createNotice(e.errors, "error") ?? [];
        throw { msgs: htmlMsgs };
      } else throw e;
    }

    return {
      state: STATE,
      config: CONFIG,
      ...ctx
    }
  } catch (e) {
    if (!("msgs" in e)) {
      dispatchEvent(BUILD_ERROR, e);
    }

    throw e;
  }
}

export async function rebuild(ctx: BuildContext): Promise<BuildResult> {
  const { config: CONFIG, state: STATE } = ctx;
  let result: ESBUILD.BuildResult;

  try {
    try {
      result = await ctx.rebuild();
    } catch (e) {
      if (e.errors) {
        // Log errors with added color info. to the virtual console
        const ansiMsgs = await createNotice(e.errors, "error", false) ?? [];
        dispatchEvent(LOGGER_ERROR, new Error(ansiMsgs.join("\n")));

        const message = (ansiMsgs.length > 1 ? `${ansiMsgs.length} error(s) ` : "") + "(if you are having trouble solving this issue, please create a new issue in the repo, https://github.com/okikio/bundlejs)";
        dispatchEvent(LOGGER_ERROR, new Error(message));

        const htmlMsgs = await createNotice(e.errors, "error") ?? [];
        throw { msgs: htmlMsgs };
      } else throw e;
    }

    return await formatBuildResult({
      config: CONFIG,
      state: STATE,
      ...result
    });
  } catch (e) {
    if (!("msgs" in e)) {
      dispatchEvent(BUILD_ERROR, e);
    }

    throw e;
  }
}

export async function cancel(ctx: BuildContext): Promise<void> {
  try {
    try {
      await ctx.cancel();
    } catch (e) {
      if (e.errors) {
        // Log errors with added color info. to the virtual console
        const ansiMsgs = await createNotice(e.errors, "error", false) ?? [];
        dispatchEvent(LOGGER_ERROR, new Error(ansiMsgs.join("\n")));

        const message = (ansiMsgs.length > 1 ? `${ansiMsgs.length} error(s) ` : "") + "(if you are having trouble solving this issue, please create a new issue in the repo, https://github.com/okikio/bundlejs)";
        dispatchEvent(LOGGER_ERROR, new Error(message));

        const htmlMsgs = await createNotice(e.errors, "error") ?? [];
        throw { msgs: htmlMsgs };
      } else throw e;
    }
  } catch (e) {
    if (!("msgs" in e)) {
      dispatchEvent(BUILD_ERROR, e);
    }

    throw e;
  }
}

export async function dispose(ctx: BuildContext): Promise<void> {
  try {
    try {
      await ctx.dispose();
    } catch (e) {
      if (e.errors) {
        // Log errors with added color info. to the virtual console
        const ansiMsgs = await createNotice(e.errors, "error", false) ?? [];
        dispatchEvent(LOGGER_ERROR, new Error(ansiMsgs.join("\n")));

        const message = (ansiMsgs.length > 1 ? `${ansiMsgs.length} error(s) ` : "") + "(if you are having trouble solving this issue, please create a new issue in the repo, https://github.com/okikio/bundlejs)";
        dispatchEvent(LOGGER_ERROR, new Error(message));

        const htmlMsgs = await createNotice(e.errors, "error") ?? [];
        throw { msgs: htmlMsgs };
      } else throw e;
    }
  } catch (e) {
    if (!("msgs" in e)) {
      dispatchEvent(BUILD_ERROR, e);
    }

    throw e;
  }
}
