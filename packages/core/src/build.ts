import type { BundleConfigOptions, CompressionOptions } from "./configs/options";
import type { PLATFORM } from "./configs/platform";
import type * as ESBUILD from "esbuild-wasm";

// import ESBUILD_WASM from "./wasm";
import { version } from "esbuild-wasm";

import * as _bytes from "bytes";
// @ts-ignore
const bytes = _bytes.default;

import { EXTERNAL } from "./plugins/external";
import { HTTP } from "./plugins/http";
import { CDN } from "./plugins/cdn";
import { ALIAS } from "./plugins/alias";
import { VIRTUAL_FS } from "./plugins/virtual-fs";

import { DefaultConfig } from "./configs/options";
import { EVENTS } from "./configs/events";
import { STATE } from "./configs/state";

import { encode } from "./utils/encode-decode";
import { deepAssign } from "./utils/deep-equal";

import { createNotice } from "./utils/create-notice";

export const INPUT_EVENTS = {
  "build": build,
  "init": init
};

export async function getESBUILD(platform: PLATFORM = "node"): Promise<typeof ESBUILD> {
  try {
    switch (platform) {
      case "node":
        return await import("esbuild");
      case "deno":
        return await import(
          /* @vite-ignore */
          `https://deno.land/x/esbuild@v${version}/mod.js`
        );
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
      if (platform !== "node" && platform !== "deno") {
        const { default: ESBUILD_WASM } = await import("./wasm");
        await STATE.esbuild.initialize({
          wasmModule: new WebAssembly.Module(await ESBUILD_WASM()),
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

export async function build(opts: BundleConfigOptions = {}): Promise<any> {
  if (!STATE.initialized)
    EVENTS.emit("init.loading");
  
  const CONFIG = deepAssign({}, DefaultConfig, opts) as BundleConfigOptions;
  const { build: bundle } = await init(CONFIG.init);
  const { define = {}, loader = {}, ...esbuildOpts } = CONFIG.esbuild ?? {};

  // Stores content from all external outputed files, this is for checking the gzip size when dealing with CSS and other external files
  let outputs: ESBUILD.OutputFile[] = [];
  let content: Uint8Array[] = [];
  let result: ESBUILD.BuildResult | ESBUILD.BuildIncremental;

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
        const asciMsgs = [...await createNotice(e.errors, "error", false)];
        const htmlMsgs = [...await createNotice(e.errors, "error")];

        EVENTS.emit("logger.error", asciMsgs, htmlMsgs);

        const message = (htmlMsgs.length > 1 ? `${htmlMsgs.length} error(s) ` : "") + "(if you are having trouble solving this issue, please create a new issue in the repo, https://github.com/okikio/bundle)";
        return EVENTS.emit("logger.error", message);
      } else throw e;
    }

    // Create an array of assets and actual output files, this will later be used to calculate total file size
    outputs = await Promise.all(
      [...STATE.assets]
        .concat(result?.outputFiles as ESBUILD.OutputFile[])
    );
    content = await Promise.all(
      outputs
        ?.map(({ path, text, contents }) => {
          if (/\.map$/.test(path))
            return encode("");

          // For debugging reasons, if the user chooses verbose, print all the content to the Shared Worker console
          if (esbuildOpts?.logLevel == "verbose") {
            const ignoreFile = /\.(wasm|png|jpeg|webp)$/.test(path);
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

    // Choose a different compression function based on the compression type
    let compressionMap = await (async () => {
      switch (type) {
        case "lz4":
          const { compress: lz4_compress } = await import("./deno/lz4/mod");
          return async (code: Uint8Array) => {
            return await lz4_compress(code);
          };
        case "brotli":
          const { compress } = await import("./deno/brotli/mod");
          return async (code: Uint8Array) => {
            return await compress(code, code.length, level);
          }
        default:
          const { gzip, getWASM } = await import("./deno/denoflate/mod");
          await getWASM();
          return async (code: Uint8Array) => {
            return await gzip(code, level);
          };
      }
    })();
    let totalCompressedSize = bytes(
      (await Promise.all(content.map(compressionMap)))
        .reduce((acc, { length }) => acc + length, 0)
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
      // size: `${totalCompressedSize} (${type})`
    };
  } catch (e) { }
}

export { };