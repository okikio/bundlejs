import type * as ESBUILD from "esbuild-wasm";

import type { BundleConfigOptions, CompressionOptions } from "./configs/options.js";
import type { PLATFORM } from "./configs/platform.js";

import ESBUILD_WASM from "./wasm.js";
import { version } from "esbuild-wasm";

import bytes from "bytes";

import { gzip, getWASM } from "./deno/denoflate/mod.js";
import { compress } from "./deno/brotli/mod.js";
import { compress as lz4_compress } from "./deno/lz4/mod.js";

import { EXTERNAL } from "./plugins/external.js";
import { HTTP } from "./plugins/http.js";
import { CDN } from "./plugins/cdn.js";
import { ALIAS } from "./plugins/alias.js";
import { VIRTUAL_FS } from "./plugins/virtual-fs.js";

import { DefaultConfig } from "./configs/options.js";
import { EVENTS } from "./configs/events.js";
import { STATE } from "./configs/state.js";

import { encode } from "./utils/encode-decode.js";
import { deepAssign } from "./utils/deep-equal.js";

import { createNotice } from "./utils/create-notice.js";

export const INPUT_EVENTS = {
  "build": build,
  "init": init
};

export async function getESBUILD(platform: PLATFORM = "node"): Promise<typeof ESBUILD> {
  try {
    switch (platform) {
      case "node":
        // @ts-ignore: On nodejs it should use the nodejs version of esbuild
        return await import(`https://cdn.esm.sh/esbuild@${version}`);
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
      if (platform !== "node" && platform !== "deno") {
        await STATE.esbuild.initialize({
          wasmModule: new WebAssembly.Module(await ESBUILD_WASM),
          ...opts
        });
      }
      await getWASM();


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
  
  const CONFIG = deepAssign({}, DefaultConfig, opts) as BundleConfigOptions;
  const { build: bundle } = (await init(CONFIG.init)) as typeof ESBUILD;
  const { define = {}, ...esbuildOpts } = CONFIG.esbuild ?? {};

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
    const { compression = {} } = CONFIG;
    const { type = "gzip", quality: level = 9 } =
      (typeof compression == "string" ? { type: compression } : (compression ?? {})) as CompressionOptions;

    const totalByteLength = bytes(
      content.reduce((acc, { byteLength }) => acc + byteLength, 0)
    );
    const totalCompressedSize = bytes(
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
      result,
      outputFiles: result.outputFiles,
      initialSize: `${totalByteLength}`,
      size: `${totalCompressedSize} (${type})`
    };
  // deno-lint-ignore no-empty
  } catch (_e) {}
}

export { };