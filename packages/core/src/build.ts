/// <reference lib="webworker" />
import type { BundleConfigOptions, CompressionOptions } from "./configs/options";
import type { BuildResult, OutputFile, BuildIncremental, PartialMessage, TransformOptions, InitializeOptions } from "esbuild-wasm";
import type * as ESBUILD from "esbuild";

import ESBUILD_WASM from "esbuild-wasm/esbuild.wasm?to-js";

import { version } from "esbuild-wasm";
import * as pkg from "../package.json";

import * as _bytes from "bytes";
// @ts-ignore
const bytes = _bytes.default;

import { treeshake } from "../utils/treeshake";
import { gzip, getWASM } from "../deno/denoflate/mod";
import { compress } from "../deno/brotli/mod";
import { compress as lz4_compress } from "../deno/lz4/mod";

import { EXTERNAL } from "./plugins/external";
import { HTTP } from "./plugins/http";
import { CDN } from "./plugins/cdn";
import { ALIAS } from "./plugins/alias";
import { analyze } from "./plugins/analyzer";
import { VIRTUAL_FS } from "./plugins/virtual-fs";

import { DefaultConfig } from "./configs/options";
import { EVENTS } from "./configs/events";
import { STATE } from "./configs/state";

import { encode, decode } from "../utils/encode-decode";
import { render as ansi } from "../utils/ansi";
import { deepAssign } from "../utils/deep-equal";
import { getCDNUrl } from "../utils/util-cdn";

import { createNotice } from "../utils/create-notice";

export const INPUT_EVENTS = {
  "build": build,
  "init": init
};

export async function getESBUILD(platform: BundleConfigOptions["init"]["platform"] = "node"): Promise<typeof ESBUILD> {
  try {
    switch (platform) {
      case "node":
        return await import("esbuild");
      case "deno":
        return await import(`https://deno.land/x/esbuild@v${version}/mod.js`);
      default:
        return await import("esbuild-wasm");
    }
  } catch (e) {
    throw e;
  }
}

export async function init({ platform, ...opts }: BundleConfigOptions["init"] = {}) {
  try {
    if (!STATE.initialized) {
      EVENTS.emit("init.start");

      STATE.esbuild = await getESBUILD(platform);
      await getWASM();

      if (platform !== "node") {
        await STATE.esbuild.initialize({
          worker: false,
          wasmModule: new WebAssembly.Module(await ESBUILD_WASM),
          ...opts
        });
      }

      STATE.initialized = true;
      EVENTS.emit("init.complete");
    }

    return STATE.esbuild;
  } catch (error) {
    EVENTS.emit("init.error", error);
    console.error(error);
  }
}

export async function build(opts: BundleConfigOptions = {}) {
  if (!STATE.initialized)
    EVENTS.emit("init.loading");

  const { build: bundle, transform, transformSync, formatMessages } = await init(opts.init);
  const CONFIG = deepAssign({}, DefaultConfig, opts) as BundleConfigOptions;
  const FileSystem = CONFIG.filesystem;

  const { define = {}, loader = {}, ...esbuildOpts } = CONFIG.esbuild ?? {};

  // Stores content from all external outputed files, this is for checking the gzip size when dealing with CSS and other external files
  let outputs: Uint8Array[] = [];
  let content: Uint8Array[] = [];
  let result: BuildResult | BuildIncremental;

  try {
    try {
      const keys = "p.env.NODE_ENV".replace("p.", "process.");
      result = await bundle({
        entryPoints: CONFIG?.entryPoints ?? [],
        metafile: Boolean(CONFIG.analysis),
        loader: {
          '.png': 'file',
          '.jpeg': 'file',
          '.ttf': 'file',
          '.svg': 'text',
          '.html': 'text',
          '.scss': 'css'
        },
        define: {
          "__NODE__": `false`,
          // vite crashes for some reason when it sees "process.env.NODE_ENV"
          [keys]: `"production"`,
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
        let asciMsgs = [...await createNotice(e.errors, "error", false)];
        let htmlMsgs = [...await createNotice(e.errors, "error")];

        EVENTS.emit("logger.error", asciMsgs, htmlMsgs);

        let message = (htmlMsgs.length > 1 ? `${htmlMsgs.length} error(s) ` : "") + "(if you are having trouble solving this issue, please create a new issue in the repo, https://github.com/okikio/bundle)";
        return EVENTS.emit("logger.error", message);
      } else throw e;
      console.error(e);
    }

    // Create an array of assets and actual output files, this will later be used to calculate total file size
    content = await Promise.all(
      [...STATE.assets]
        .concat(result?.outputFiles)
        ?.map(async ({ path, text, contents }) => {
          let ignoreFile = /\.(wasm|png|jpeg|webp)$/.test(path);
          // if (path == "/stdin.js") {
          //   output = text;
          //   // config?.rollup && esbuildOpts?.treeShaking ? 
          //   // await treeshake(text, esbuildOpts, config?.rollup) :
          // }

          if (/\.map$/.test(path))
            return encode("");

          // For debugging reasons, if the user chooses verbose, print all the content to the Shared Worker console
          if (esbuildOpts?.logLevel == "verbose") {
            if (ignoreFile) {
              EVENTS.emit("logger.log", "Output File: " + path);
            } else {
              EVENTS.emit("logger.log", "Output File: " + path + "\n" + text);
            }
          }

          return contents;
        })
    );

    // Use multiple compression algorithims & pretty-bytes for the total gzip, brotli & lz4 compressed size
    let { compression = {} } = CONFIG;
    let { type = "gzip", quality: level = 9 } =
      (typeof compression == "string" ? { type: compression } : (compression ?? {})) as CompressionOptions;

    // @ts-ignore
    let totalByteLength = bytes(
      content.reduce((acc, { byteLength }) => acc + byteLength, 0)
    );
    let totalCompressedSize = bytes(
      (await Promise.all(
        content.map((code: Uint8Array) => {
          switch (type) {
            case "lz4":
              return lz4_compress(code);
            case "brotli":
              return compress(code, code.length, level);
            default:
              return gzip(code, level);
          }
        })
      )).reduce((acc, { length }) => acc + length, 0)
    );

    // // Ensure a fresh filesystem on every run
    // FileSystem.clear();

    // // Reset assets
    // STATE.assets = [];

    return {
      // content: output,
      result,
      outputFiles: result.outputFiles,
      initialSize: `${totalByteLength}`,
      size: `${totalCompressedSize} (${type})`
    };
  } catch (e) { }
}

export { };