import type { CommonConfigOptions, ESBUILD } from "./types.ts";
import type { PackageJson } from "./plugins/cdn.ts";

import { VIRTUAL_FS } from "./plugins/virtual-fs.ts";
import { EXTERNAL } from "./plugins/external.ts";
import { ALIAS } from "./plugins/alias.ts";
import { HTTP } from "./plugins/http.ts";
import { CDN } from "./plugins/cdn.ts";

import { createConfig } from "./configs/config.ts";
import { PLATFORM_AUTO } from "./configs/platform.ts";
import { createState, getState, setState } from "./configs/state.ts";

import { useFileSystem } from "./utils/filesystem.ts";
import { createNotice } from "./utils/create-notice.ts";
import { DEFAULT_CDN_HOST } from "./utils/util-cdn.ts";
import { init } from "./init.ts";

import { bytes } from "./utils/pretty-bytes.ts";

import { BUILD_ERROR, INIT_LOADING, LOGGER_ERROR, LOGGER_LOG, LOGGER_WARN, dispatchEvent } from "./configs/events.ts";

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

  packageSizeMap?: Map<string, number>,

  /**
   * Versions
   */
  versions?: Map<string, string>,

  /**
   * Array storing the [getter, setter] of the global state
   */
  GLOBAL?: [typeof getState, typeof setState],

  [key: string]: unknown
}

export type BuildConfig = CommonConfigOptions & {
  /** esbuild config options https://esbuild.github.io/api/#build-api */
  esbuild?: ESBUILD.BuildOptions,

  /**
   * The package.json to use when trying to bundle files
   */
  "package.json"?: PackageJson;

  /**
   * Enables or disables polyfill
   */
  polyfill?: boolean;

  /** The default CDN to import packages from */
  cdn?: "https://unpkg.com" | "https://esm.run" | "https://esm.sh" | "https://esm.sh/jsr" | "https://cdn.skypack.dev" | "https://cdn.jsdelivr.net/npm" | "https://cdn.jsdelivr.net/gh" | "https://deno.land/x" | "https://raw.githubusercontent.com" | "unpkg" | "esm.run" | "esm.sh" | "esm" | "jsr" | "skypack" | "jsdelivr" | "jsdelivr.gh" | "github" | "deno" | (string & {}),

  /** Aliases for replacing packages with different ones, e.g. replace "fs" with "memfs", so, it can work on the web, etc... */
  alias?: Record<string, string>,

  /**
   * Enables converting ansi logs to HTML so virtual consoles can handle the logs and print with color
   */
  ansi?: "html" | "html-and-ansi" | "ansi",

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
  "polyfill": false,

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
    "platform": "browser",

    "jsx": "transform"
  },

  "ansi": "ansi",
  init: {
    platform: PLATFORM_AUTO
  }
};

export type BuildResult = (ESBUILD.BuildResult) & {
  outputs: ESBUILD.OutputFile[];
  contents: ESBUILD.OutputFile[];

  packageSizeArr: string[][];
  totalInstallSize: string;
};

export const TheFileSystem = useFileSystem();

export async function build(opts: BuildConfig = {}, filesystem = TheFileSystem): Promise<BuildResult> {
  if (!getState("initialized"))
    dispatchEvent(INIT_LOADING);

  const CONFIG = createConfig("build", opts);
  const STATE = createState<LocalState>({ 
    filesystem: await filesystem, 
    assets: [], 
    GLOBAL: [getState, setState],
    packageSizeMap: new Map(),
  });
  const [get] = STATE;

  const { platform, ...initOpts } = CONFIG.init ?? {};
  const { build: bundle } = await init(platform, initOpts);
  const { define = {}, ...esbuildOpts } = CONFIG.esbuild ?? {};

  // Stores content from all external outputed files, this is for checking the gzip size when dealing with CSS and other external files
  let outputs: ESBUILD.OutputFile[] = [];
  let contents: ESBUILD.OutputFile[] = [];
  let result: ESBUILD.BuildResult;

  try {
    try {
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
          CDN(STATE, CONFIG, ),
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

    if (result.warnings) {
      // Log errors with added color info. to the virtual console
      const ansiMsgs = await createNotice(result.warnings, "warning", false) ?? [];
      dispatchEvent(LOGGER_WARN, ansiMsgs.join("\n"));

      const message =  `${ansiMsgs.length} warning(s) `;
      dispatchEvent(LOGGER_WARN, message);
    }
    
    // Create an array of assets and actual output files, this will later be used to calculate total file size
    outputs = await Promise.all(
      [...(get()["assets"] ?? [])]
        .concat(result?.outputFiles as ESBUILD.OutputFile[])
    );

    contents = await Promise.all(
      outputs
        .map(({ path, text, contents, hash }): ESBUILD.OutputFile | null => {
          if (/\.map$/.test(path))
            return null;

          // For debugging reasons, if the user chooses verbose, print all the content to the Shared Worker console
          if (esbuildOpts?.logLevel === "verbose") {
            const ignoreFile = /\.(wasm|png|jpeg|webp)$/.test(path);
            if (ignoreFile) {
              dispatchEvent(LOGGER_LOG, "Output File: " + path);
            } else {
              dispatchEvent(LOGGER_LOG, "Output File: " + path + "\n" + text);
            }
          }

          return { path, text, contents, hash };
        })

        // Remove null output files
        .filter(x => x !== null && x !== undefined) as ESBUILD.OutputFile[]
    );

    // Ensure a fresh filesystem on every run
    // FileSystem.clear();
    // delete
    // console.log({ contentsLen: contents.length })
    const packageSizeMap = get()?.packageSizeMap ?? new Map<string, number>();

    return {
      /** 
       * The output and asset files without unnecessary croft, e.g. `.map` sourcemap files 
       */
      contents,

      /**
       * The output and asset files with `.map` sourcemap files 
       */
      outputs,

      packageSizeArr: Array.from(packageSizeMap, ([key, value]) => [key, bytes(value)]),
      totalInstallSize: bytes(Array.from(packageSizeMap).reduce((acc, [_, value]) => acc + value, 0)),

      ...result
    };
  } catch (e) { 
    if (!("msgs" in e)) {
      dispatchEvent(BUILD_ERROR, e as Error);
    }
    
    throw e;
  }
}