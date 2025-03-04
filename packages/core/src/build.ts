import type { BuildConfig, ESBUILD, LocalState } from "./types.ts";
import type { FullPackageVersion, PackageJson } from "@bundle/utils/utils/types.ts";

import { VirtualFileSystemPlugin } from "./plugins/virtual-fs.ts";
import { ExternalPlugin } from "./plugins/external.ts";
import { AliasPlugin } from "./plugins/alias.ts";
import { HttpPlugin } from "./plugins/http.ts";
import { CdnPlugin } from "./plugins/cdn.ts";

import { Context, fromContext, toContext } from "./context/context.ts";

import { BUILD_ERROR, INIT_LOADING, LOGGER_ERROR, LOGGER_LOG, LOGGER_WARN, dispatchEvent } from "./configs/events.ts";
import { createConfig } from "./configs/config.ts";
import { PLATFORM_AUTO } from "./configs/platform.ts";

import { DEFAULT_CDN_HOST, getCDNUrl } from "./utils/cdn-format.ts";
import { useFileSystem, type IFileSystem } from "./utils/filesystem.ts";
import { createNotice } from "./utils/create-notice.ts";

import { init } from "./init.ts";

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

export interface BuildResult extends ESBUILD.BuildResult {
  outputs: ESBUILD.OutputFile[];
  contents: ESBUILD.OutputFile[];
};

export interface BuildResultContext extends ESBUILD.BuildResult {
  state: Context<LocalState>
};

export const TheFileSystem = useFileSystem();
export async function build(opts: BuildConfig = {}, filesystem: Promise<IFileSystem<unknown>> = TheFileSystem): Promise<BuildResult> {
  if (!fromContext("initialized"))
    dispatchEvent(INIT_LOADING);

  const StateContext = new Context<LocalState>({
    filesystem: await filesystem,
    assets: [],
    config: createConfig("build", opts),
    failedExtensionChecks: new Set<string>(),
    failedManifestUrls: new Set<string>(),
    host: DEFAULT_CDN_HOST,
    versions: new Map<string, string>(),
    packageManifests: new Map<string, PackageJson | FullPackageVersion>(),
  });

  const LocalConfig = fromContext("config", StateContext)!;
  const { origin: host } = LocalConfig?.cdn && !/:/.test(LocalConfig?.cdn) ?
    getCDNUrl(LocalConfig?.cdn + ":") :
    getCDNUrl(LocalConfig?.cdn ?? DEFAULT_CDN_HOST);

  toContext("host", host ?? DEFAULT_CDN_HOST, StateContext);

  const { platform, version, ...initOpts } = LocalConfig.init ?? {};
  const { build: bundle } = await init(initOpts, [platform, version]) ?? {};
  const { define = {}, ...esbuild_opts } = LocalConfig.esbuild ?? {};

  // Stores content from all external outputed files, this is for checking the gzip size when dealing with CSS and other external files
  let build_result: ESBUILD.BuildResult;

  try {
    if (!bundle) 
      throw new Error("Initialization failed, couldn't access esbuild build function");

    try {
      build_result = await bundle({
        entryPoints: LocalConfig?.entryPoints ?? [],
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
          AliasPlugin(StateContext),
          ExternalPlugin(StateContext),
          VirtualFileSystemPlugin(StateContext),
          HttpPlugin(StateContext),
          CdnPlugin(StateContext.with({ origin: host }) as Context<LocalState & { origin: string }>),
        ],
        ...esbuild_opts,
      });
    } catch (e) {
      const fail = e as ESBUILD.BuildFailure;
      if (fail.errors) {
        // Log errors with added color info. to the virtual console
        const ansiMsgs = await createNotice(fail.errors, "error", false) ?? [];
        dispatchEvent(LOGGER_ERROR, new Error(ansiMsgs.join("\n")));

        const message = (ansiMsgs.length > 1 ? `${ansiMsgs.length} error(s) ` : "") + "(if you are having trouble solving this issue, please create a new issue in the repo, https://github.com/okikio/bundlejs)";
        dispatchEvent(LOGGER_ERROR, new Error(message));

        const htmlMsgs = await createNotice(fail.errors, "error") ?? [];
        throw { msgs: htmlMsgs };
      } else throw e;
    }

    return await formatBuildResult({
      state: StateContext,
      ...build_result
    });
  } catch (e) {
    const err = e as Error;
    if (!("msgs" in err)) {
      dispatchEvent(BUILD_ERROR, err);
    }

    throw e;
  }
}

export async function formatBuildResult(_ctx: BuildResultContext) {
  const { state: StateContext, ...build_result } = _ctx;
  const LocalConfig = StateContext.target.config!;

  try {
    const { define = {}, ...esbuild_opts } = LocalConfig.esbuild ?? {};
    let outputs: ESBUILD.OutputFile[] = [];
    let contents: ESBUILD.OutputFile[] = [];

    if (build_result.warnings?.length > 0) {
      // Log errors with added color info. to the virtual console
      const ansiMsgs = await createNotice(build_result.warnings, "warning", false) ?? [];
      dispatchEvent(LOGGER_WARN, ansiMsgs.join("\n"));

      const message = `${ansiMsgs.length} warning(s) `;
      dispatchEvent(LOGGER_WARN, message);
    }

    // Create an array of assets and actual output files, this will later be used to calculate total file size
    outputs = await Promise.all(
      Array.from(StateContext.target.assets ?? [])
        .concat(build_result?.outputFiles as ESBUILD.OutputFile[])
    );

    contents = await Promise.all(
      outputs
        .map(({ path, text, contents, hash }): ESBUILD.OutputFile | null => {
          if (/\.map$/.test(path))
            return null;

          // For debugging reasons, if the user chooses verbose, print all the content to the Shared Worker console
          if (esbuild_opts?.logLevel === "verbose") {
            const ignoreFile = /\.(wasm|png|jpeg|webp)$/.test(path);
            if (ignoreFile) {
              dispatchEvent(LOGGER_LOG, "Output File: " + path);
            } else {
              dispatchEvent(LOGGER_LOG, "Output File: " + path + "\n" + text);
            }
          }

          return {
            path,
            get text() { return text },
            contents,
            hash
          };
        })

        // Remove null output files
        .filter(x => x !== null && x !== undefined) as ESBUILD.OutputFile[]
    );

    // Ensure a fresh filesystem on every run
    // FileSystem.clear();
    // delete
    // console.log({ contentsLen: contents.length })

    return {
      state: StateContext.target,
      config: LocalConfig,

      /** 
       * The output and asset files without unnecessary croft, e.g. `.map` sourcemap files 
       */
      contents,

      /**
       * The output and asset files with `.map` sourcemap files 
       */
      outputs,

      files: (await StateContext.target.filesystem?.files()) || null,
      ...build_result,
    };
  } catch (e) {
    const err = e as Error;
    if (!("msgs" in err)) {
      dispatchEvent(BUILD_ERROR, err);
    }

    throw e;
  }
}