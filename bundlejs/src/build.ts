import type { CommonConfigOptions, ESBUILD } from "./types.ts";

import { VIRTUAL_FS } from "./plugins/virtual-fs.ts";
import { EXTERNAL } from "./plugins/external.ts";
import { ALIAS } from "./plugins/alias.ts";
import { HTTP } from "./plugins/http.ts";
import { CDN } from "./plugins/cdn.ts";

import { EVENTS } from "./configs/events.ts";
import { createConfig } from "./configs/config.ts";
import { PLATFORM_AUTO } from "./configs/platform.ts";
import { createState, getState, setState } from "./configs/state.ts";

import { getFile, setFile, getResolvedPath, useFileSystem } from "./utils/filesystem.ts";
import { createNotice } from "./utils/create-notice.ts";
import { DEFAULT_CDN_HOST } from "./utils/util-cdn.ts";
import { init } from "./init.ts";

/**
 * Local state available to all plugins
 */
export type LocalState = {
  filesystem?: Awaited<ReturnType<typeof useFileSystem>>,

  /**
   * Assets are files during the build process that esbuild can't handle natively, 
   * e.g. fetching web workers using the `new URL("...", import.meta.url)`
   */
  assets?: ESBUILD.OutputFile[],

  /**
   * Array storing the [getter, setter] of the global state
   */
  GLOBAL?: [typeof getState, typeof setState],

  [key: string]: unknown
}

export type BuildConfig = CommonConfigOptions & {
  /** esbuild config options https://esbuild.github.io/api/#build-api */
  esbuild?: ESBUILD.BuildOptions,

  /** The default CDN to import packages from */
  cdn?: "https://unpkg.com" | "https://esm.run" | "https://cdn.esm.sh" | "https://cdn.esm.sh" | "https://cdn.skypack.dev" | "https://cdn.jsdelivr.net/npm" | "https://cdn.jsdelivr.net/gh" | "https://deno.land/x" | "https://raw.githubusercontent.com" | "unpkg" | "esm.run" | "esm.sh" | "esm" | "skypack" | "jsdelivr" | "jsdelivr.gh" | "github" | "deno" | (string & object),

  /** Aliases for replacing packages with different ones, e.g. replace "fs" with "memfs", so, it can work on the web, etc... */
  alias?: Record<string, string>,

  /**
   * Enables converting ascii logs to HTML so virtual consoles can handle the logs and print with color
   */
  ascii?: "html" | "html-and-ascii" | "ascii",

  /**
   * Documentation: https://esbuild.github.io/api/#entry-points
   */
  entryPoints?: ESBUILD.BuildOptions["entryPoints"]
};

/**
 * Default build config
 */
export const BUILD_CONFIG: BuildConfig = {
  "entryPoints": ["/index.tsx"],
  "cdn": DEFAULT_CDN_HOST,

  "esbuild": {
    "color": true,
    "globalName": "BundledCode",

    "logLevel": "info",
    "sourcemap": false,

    "target": ["esnext"],
    "format": "esm",
    "bundle": true,
    "minify": true,

    "treeShaking": true,
    "platform": "browser"
  },

  "ascii": "ascii",
  init: {
    platform: PLATFORM_AUTO
  }
};

export type BuildResult = (ESBUILD.BuildResult) & {
  outputs: ESBUILD.OutputFile[];
  contents: ESBUILD.OutputFile[];
};

export const TheFileSystem = useFileSystem(EVENTS);

export async function build(opts: BuildConfig = {}, filesystem = TheFileSystem): Promise<BuildResult> {
  if (!getState("initialized"))
    EVENTS.emit("init.loading");

  const CONFIG = createConfig("build", opts);
  const STATE = createState<LocalState>({ 
    filesystem: await filesystem, 
    assets: [], 
    GLOBAL: [getState, setState] 
  });
  const [get] = STATE;

  const { platform, ...initOpts } = CONFIG.init ?? {};
  const e = await init(platform, initOpts);
 
  const { build: bundle } = e;
  const { define = {}, ...esbuildOpts } = CONFIG.esbuild ?? {};

  // Stores content from all external outputed files, this is for checking the gzip size when dealing with CSS and other external files
  let outputs: ESBUILD.OutputFile[] = [];
  let contents: ESBUILD.OutputFile[] = [];
  let result: ESBUILD.BuildResult = null;

  try {
    try {
      const key = "p.env.NODE_ENV".replace("p.", "process.");
      result = await bundle({
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
          [key]: "\"production\"",
          ...define
        },
        write: false,
        outdir: "/",
        plugins: [
          ALIAS(EVENTS, STATE, CONFIG),
          EXTERNAL(EVENTS, STATE, CONFIG),
          HTTP(EVENTS, STATE, CONFIG),
          CDN(EVENTS, STATE, CONFIG),
          VIRTUAL_FS(EVENTS, STATE, CONFIG),
        ],
        ...esbuildOpts,
      });
    } catch (e) {
      if (e.errors) {
        // Log errors with added color info. to the virtual console
        const asciMsgs = [...await createNotice(e.errors, "error", false)];
        const htmlMsgs = [...await createNotice(e.errors, "error")];

        EVENTS.emit("logger.error", asciMsgs, htmlMsgs);

        const message = (htmlMsgs.length > 1 ? `${htmlMsgs.length} error(s) ` : "") + "(if you are having trouble solving this issue, please create a new issue in the repo, https://github.com/okikio/bundle)";
        EVENTS.emit("logger.error", message);
        return;
      } else throw e;
    }

    // Create an array of assets and actual output files, this will later be used to calculate total file size
    outputs = await Promise.all(
      [...get()["assets"]]
        .concat(result?.outputFiles as ESBUILD.OutputFile[])
    );

    contents = await Promise.all(
      outputs
        ?.map(({ path, text, contents }): ESBUILD.OutputFile => {
          if (/\.map$/.test(path))
            return null;

          // For debugging reasons, if the user chooses verbose, print all the content to the Shared Worker console
          if (esbuildOpts?.logLevel == "verbose") {
            const ignoreFile = /\.(wasm|png|jpeg|webp)$/.test(path);
            if (ignoreFile) {
              EVENTS.emit("logger.log", "Output File: " + path);
            } else {
              EVENTS.emit("logger.log", "Output File: " + path + "\n" + text);
            }
          }

          return { path, text, contents };
        })

        // Remove null output files
        ?.filter(x => ![undefined, null].includes(x))
    );

    // Ensure a fresh filesystem on every run
    // FileSystem.clear();
    // dele

    return {
      /** 
       * The output and asset files without unnecessary croft, e.g. `.map` sourcemap files 
       */
      contents,

      /**
       * The output and asset files with `.map` sourcemap files 
       */
      outputs,

      ...result
    };
  } catch (e) { 
    EVENTS.emit("build.error", e);
  }
}