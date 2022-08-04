/// <reference lib="webworker" />
import type { BundleConfigOptions, CompressionOptions } from "../configs/bundle-options";
import type { BuildResult, OutputFile, BuildIncremental, PartialMessage, TransformOptions } from "esbuild-wasm";

import { FileSystem, setFile } from "../util/filesystem";
import { initialize, build, transform, transformSync, formatMessages } from "esbuild-wasm";
import { EventEmitter } from "@okikio/emitter";

import bytes from "bytes";

import { treeshake } from "../util/rollup";
import { gzip, getWASM } from "../deno/denoflate/mod";
import { compress } from "../deno/brotli/mod";
import { compress as lz4_compress } from "../deno/lz4/mod";

import { EXTERNAL } from "../plugins/external";
import { HTTP } from "../plugins/http";
import { CDN } from "../plugins/cdn";

import { encode, decode } from "../util/encode-decode";
import { render as ansi } from "../util/ansi";
import { deepAssign } from "../util/deep-equal";

import { DefaultConfig } from "../configs/bundle-options";

import { ALIAS } from "../plugins/alias";
import { getCDNUrl } from "../util/util-cdn";
import { analyze } from "../plugins/analyzer";

export let _initialized = false;
export const initEvent = new EventEmitter();
export const configChannel = new MessageChannel();

const initPromise = (async () => {
  try {
    if (!_initialized) {
      await getWASM();
      await initialize({
        worker: false,
        wasmURL: `./esbuild.wasm`
      });

      _initialized = true;
      initEvent.emit("init");
    }
  } catch (error) {
    initEvent.emit("error", error);
  }
})();

/** 
 * Inspired by https://github.com/egoist/play-esbuild/blob/main/src/lib/esbuild.ts
 * I didn't even know this was exported by esbuild, great job @egoist
*/
export const createNotice = async (errors: PartialMessage[], kind: "error" | "warning" = "error", color = true) => {
  let notices = await formatMessages(errors, { color, kind });
  return notices.map((msg) => !color ? msg : ansi(msg.replace(/(\s+)(\d+)(\s+)\│/g, "\n$1$2$3│")));
}

/**
 * Contains the entire esbuild worker script
 * 
 * @param port The Shared Worker port to post messages on
 */
export const start = async (port: MessagePort) => {
  const BuildEvents = new EventEmitter();
  let $port: MessagePort;

  /**
   * Post message in a small and easy package
   * @param obj 
   */
  const postMessage = (obj: { event: string, details: any }) => {
    let messageStr = JSON.stringify(obj);
    let encodedMessage = encode(messageStr);
    port.postMessage(encodedMessage, [encodedMessage.buffer]);
  };

  /**
   * Creates post messages that represent virtual logs
   * 
   * @param messages Message(s) to log
   * @param type Log type
   * @param devtools Whether to log messages to the devtools as well as the virtual console?
   */
  const logger = (messages: string[] | any, type?: "error" | "warning" | (string & {}), devtools = true) => {
    let msgs = Array.isArray(messages) ? messages : [messages];
    if (type == "init") {
      postMessage({
        event: "init",
        details: { type: `init`, message: msgs }
      });
    }

    if (devtools) {
      postMessage({
        event: type,
        details: {
          type,
          message: msgs
        }
      });
    }

    postMessage({
      event: "log",
      details: { type, message: msgs }
    });
  };

  initEvent.on({
    // When the SharedWorker first loads, tell the page that esbuild has initialized  
    init() {
      logger("Initialized 🚀✨", "init");
    },

    // Errors when initializing
    error(error) {
      let err = Array.isArray(error) ? error : error?.message;
      logger([`Error initializing, you may need to close and reopen all currently open pages and/or reload all currently open pages `, ...(Array.isArray(err) ? err : [err])], "error");
    }
  });

  // If another page loads while SharedWorker is still active, tell that page that esbuild is initialized
  if (_initialized)
    initEvent.emit("init");

  const getConfig = async (config: string) => {
    return new Promise(resolve => {
      $port.postMessage(config);
      $port.onmessage = async function ({ data }: MessageEvent<string>) {
        resolve(
          typeof data === "object" &&
            !Array.isArray(data) &&
            !Number.isNaN(data) ? (data ?? {}) : {}
        );
      };
    });
  }

  BuildEvents.on("build", async (details) => {
    let { config: _config, value: input } = details;
    let newConfig = await getConfig(_config ? _config : "export default {}");
    let config = deepAssign({}, DefaultConfig, newConfig) as BundleConfigOptions;

    // Exclude certain esbuild config properties
    let { define = {}, loader = {}, ...esbuildOpts } = (config.esbuild ?? {}) as BundleConfigOptions['esbuild'];
    logger("Bundling 🚀");

    // If esbuild has not initialized cancel the build
    if (!_initialized) {
      logger([`esbuild worker not initialized\nYou need to wait for a little bit before trying to bundle files`], "warning");
      return;
    }

    await initPromise;

    const assets: OutputFile[] = [];
    let output = "";

    // Stores content from all external outputed files, this is for checking the gzip size when dealing with CSS and other external files
    let content: Uint8Array[] = [];
    let result: BuildResult & {
      outputFiles: OutputFile[];
    } | BuildIncremental;

    // Ensure a fresh filesystem on every run
    FileSystem.clear();

    try {
      // Catch esbuild errors 
      setFile("/input.tsx", `${input}`);

      try {
        // Convert CDN values to URL origins
        let { origin } = !/:/.test(config?.cdn) ? getCDNUrl(config?.cdn + ":") : getCDNUrl(config?.cdn);
        result = await build({
          "stdin": {
            // Ensure input is a string
            contents: `${input}`,
            loader: 'tsx',
            sourcefile: "/input.tsx"
          },

          ...esbuildOpts,

          metafile: true,
          write: false,
          loader: {
            '.png': 'file',
            '.jpeg': 'file',
            '.ttf': 'file',
            '.svg': 'text',
            '.html': 'text',
            '.scss': 'css',
            ...loader
          },
          define: {
            "__NODE__": `false`,
            "process.env.NODE_ENV": `"production"`,
            ...define
          },
          plugins: [
            ALIAS(config?.alias, origin, logger),
            EXTERNAL(esbuildOpts?.external),
            HTTP(assets, origin, logger),
            CDN(origin, logger),
          ],
          outdir: "/"
        });
      } catch (e) {
        if (e.errors) {
          let msgs = [...await createNotice(e.errors, "error", false)];

          // Post errors to the real console
          postMessage({
            event: "error",
            details: {
              type: `error`,
              message: msgs
            }
          });

          // Log errors with added color info. to the virtual console
          logger([...await createNotice(e.errors, "error")], "error", false);

          let message = (msgs.length > 1 ? `${msgs.length} error(s) ` : "") + "(if you are having trouble solving this issue, please create a new issue in the repo, https://github.com/okikio/bundle)";
          return logger(message, "error");
        } else throw e;
      }

      // Create an array of assets and actual output files, this will later be used to calculate total file size
      content = await Promise.all(
        [...assets]
          .concat(result?.outputFiles)
          ?.map(async ({ path, text, contents }) => {
            let ignoreFile = /\.(wasm|png|jpeg|webp)$/.test(path);
            if (path == "/stdin.js") {
              output = text;
              // config?.rollup && esbuildOpts?.treeShaking ? 
              // await treeshake(text, esbuildOpts, config?.rollup) :
            }

            if (/\.map$/.test(path))
              return encode("");

            // For debugging reasons, if the user chooses verbose, print all the content to the Shared Worker console
            if (esbuildOpts?.logLevel == "verbose") {
              if (ignoreFile) {
                logger("Output File: " + path);
              } else {
                logger("Output File: " + path + "\n" + text);
              }
            }

            return contents;
          })
      );

      // Print warning
      if (result?.warnings.length > 0) {
        let msgs = [...await createNotice(result.warnings, "warning", false)];

        // Post warning to the real console
        postMessage({
          event: "warning",
          details: {
            type: `warning`,
            message: msgs
          }
        });

        // Log warning with added color info. to the virtual console
        logger([...await createNotice(result.warnings, "warning")], "warning", false);

        let message = (msgs.length > 1 ? `${msgs.length} warning(s) ` : "");
        if (message.length > 0)
          logger(message, "warning");
      }

      logger("Done ✨", "info");

      // Use multiple compression algorithims & pretty-bytes for the total gzip, brotli & lz4 compressed size
      let { compression = {} } = config;
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

      postMessage({
        event: "result",
        details: {
          content: output,
          initialSize: `${totalByteLength}`,
          size: `${totalCompressedSize} (${type})`
        }
      });

      content = null;
      totalByteLength = null;
      totalCompressedSize = null;
      output = null;

      // Generate Bundle Analysis Charts
      try {
        if (config?.analysis) {
          logger("Generating Bundle Analysis 📊");

          // A list of compressed input files and chunks, 
          // by default output files are already compressed but input files aren't so we need to manually transform them in order to ensure accuracy
          let inputFiles = [];
          for (let [path, contents] of FileSystem.entries()) {
            // This minifies & compresses input files for a accurate view of what is eating up the most size
            // It uses the esbuild options to determine how it should minify input code
            let text = decode(contents);
            let code = text;

            /*  WIP  */
            // console.log(await Promise.resolve(path))
            // ({ code } = transformSync(text, {
            //     minify: esbuildOpts?.minify,
            //     format: esbuildOpts?.format,
            //     target: esbuildOpts?.target,
            //     treeShaking: esbuildOpts?.treeShaking,
            //     tsconfigRaw: (esbuildOpts as unknown as TransformOptions)?.tsconfigRaw,
            //     sourcefile: path,
            //     define: (esbuildOpts as unknown as TransformOptions)?.define,
            //     jsx: esbuildOpts?.jsx,
            //     jsxFactory: esbuildOpts?.jsxFactory,
            //     jsxFragment: esbuildOpts?.jsxFragment,
            //     pure: esbuildOpts?.pure,
            //     keepNames: esbuildOpts?.keepNames,
            // }));

            // For debugging reasons, if the user chooses verbose, print all the content to the devtools console
            let ignoreFile = /\.(wasm|png|jpeg|webp)$/.test(path);
            logger(`Analyze ${path}${esbuildOpts?.logLevel == "verbose" && !ignoreFile ? "\n" + text : ""}`);

            inputFiles.push({ path, contents: encode(code), text: code });
          }

          // console.log(inputFiles)

          // List of all files in use
          let files = [...assets]
            .concat(result?.outputFiles)
            .concat(inputFiles);

          // Generate Iframe Chart
          postMessage({
            event: "chart",
            details: {
              content: await analyze(
                result?.metafile, files,
                {
                  template: config?.analysis,
                  gzipSize: type == "gzip",
                  brotliSize: type == "brotli"
                },
                logger
              )
            }
          });

          logger("Finished Bundle Analysis ✨", "info");
        }
      } catch (e) { }
    } catch (err) {
      // Catch unexpected errors
      // Errors can take multiple forms, so it trys to support the many forms errors can take
      let error = [].concat(err instanceof Error ? err?.message : err);
      postMessage({
        event: "error",
        details: { type: `error`, message: error }
      });

      logger(error, "error", false);

      let message = "(if you are having trouble solving this issue, please create a new issue in the repo, https://github.com/okikio/bundle)";
      logger(message, "error");
    }
  });

  port.onmessage = ({ data }: MessageEvent<BufferSource | { port?: MessagePort }>) => {
    if ((data as { port?: MessagePort })?.port) {
      const { port: _port } = data as { port?: MessagePort };
      $port = _port;
      $port.start();
      // $port.onmessage = async function ({ data }: MessageEvent<string>) {
      //   $port.postMessage(data);
      // };
    } else {
      let { event, details } = JSON.parse(decode(data as BufferSource));
      BuildEvents.emit(event, details);
    }
  };
}

// @ts-ignore
(self as SharedWorkerGlobalScope).onconnect = (e) => {
  let [port] = e.ports;
  start(port);
}

// If the script is running in a normal webworker then don't worry about the Shared Worker message ports 
if (!("SharedWorkerGlobalScope" in self))
  start(self as typeof self & MessagePort);

export { };
