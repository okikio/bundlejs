/// <reference lib="webworker" />
import { initialize, build, formatMessages } from "esbuild-wasm";
import { EventEmitter } from "@okikio/emitter";

import prettyBytes from "pretty-bytes";

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

import type { BundleConfigOptions, CompressionOptions } from "../configs/bundle-options";
import type { BuildResult, OutputFile, BuildIncremental, PartialMessage } from "esbuild-wasm";

import { ALIAS } from "../plugins/alias";
import { getCDNUrl } from "../util/util-cdn";

export let _initialized = false;
export const initEvent = new EventEmitter();

(async () => {
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
     */
    const logger = (messages: string[] | any, type?: "error" | "warning" | (string & {})) => {
        let msgs = Array.isArray(messages) ? messages : [messages];
        if (type == "init") {
            postMessage({
                event: "init",
                details: { type: `init`, message: msgs }
            });
        }

        if (type == "error" || type == "warning") {
            postMessage({
                event: "log",
                details: { 
                    type,
                    messages: [`${msgs.length} ${type}(s) ${type == "error" ? "(if you are having trouble solving this issue, please create a new issue in the repo, https://github.com/okikio/bundle)" : ""}`] 
                }
            });
        }

        postMessage({
            event: "log",
            details: { type, messages: msgs }
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
            logger([`Error initializing, you may need to close and reopen all currently open pages pages`, ...(Array.isArray(err) ? err : [err])], "error");
        }
    });

    // If another page loads while SharedWorker is still active, tell that page that esbuild is initialized
    if (_initialized)
        initEvent.emit("init");

    BuildEvents.on("build", async (details) => {
        let { config: _config, value: input } = details;
        let config = deepAssign({}, DefaultConfig, JSON.parse(_config ? _config : "{}")) as BundleConfigOptions;

        // Exclude certain esbuild config properties
        let { define = {}, loader = {}, ...esbuildOpts } = (config.esbuild ?? {}) as BundleConfigOptions['esbuild'];
        logger("Bundling 🚀");

        // If esbuild has not initialized cancel the build
        if (!_initialized) {
            logger([`esbuild worker not initialized\nYou need to wait for a little bit before trying to bundle files`], "warning");
            return;
        }

        const assets: OutputFile[] = [];
        let output = "";

        // Stores content from all external outputed files, this is for checking the gzip size when dealing with CSS and other external files
        let content: Uint8Array[] = [];
        let result: BuildResult & {
            outputFiles: OutputFile[];
        } | BuildIncremental;

        // Catch other unexpected errors
        try {
            // Catch esbuild errors 
            try {
                // Convert CDN values to URL origins
                let { origin } = !/:/.test(config?.cdn) ? getCDNUrl(config?.cdn + ":") : getCDNUrl(config?.cdn);
                result = await build({
                    "stdin": {
                        // Ensure input is a string
                        contents: `${input}`,
                        loader: 'tsx',
                        sourcefile: "/bundle.tsx"
                    },
                    
                    ...esbuildOpts,

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
                    // Post errors to the real console
                    postMessage({
                        event: "error",
                        details: {
                            type: `error`,
                            error: [...await createNotice(e.errors, "error", false)]
                        }
                    });

                    // Log errors with added color info. to the virtual console
                    return logger([...await createNotice(e.errors, "error")], "error");
                } else throw e;
            }

            // Create an array of assets and actual output files, this will later be used to calculate total file size
            content = [...assets].concat(result?.outputFiles)?.map(({ path, text, contents }) => {
                let ignoreFile = /\.(wasm|png|jpeg|webp)$/.test(path);
                if (path == "/stdin.js") 
                    output = text;

                // For debugging reasons, if the user chooses verbose, print all the content to the Shared Worker console
                if (esbuildOpts?.logLevel == "verbose") {
                    if (ignoreFile) {
                        console.log(path);
                    } else {
                        console.groupCollapsed(path); 
                        console.log(text);
                        console.groupEnd();
                    }
                }

                return contents;
            });

            // Print warning
            if (result?.warnings.length > 0) {
                // Post warning to the real console
                postMessage({
                    event: "warning",
                    details: {
                        type: `warning`,
                        message: [...await createNotice(result.warnings, "warning", false)]
                    }
                });

                // Log warning with added color info. to the virtual console
                logger([...await createNotice(result.warnings, "warning")], "warning");
            }
            
            logger("Done ✨", "info");

            // Use multiple compression algorithims & pretty-bytes for the total gzip, brotli & lz4 compressed size
            let { compression = {} } = config;
            let { type = "gzip", quality: level = 9 } = 
                (typeof compression == "string" ? { type: compression } : (compression ?? {})) as CompressionOptions;

            // @ts-ignore
            let totalByteLength = prettyBytes(
                content.reduce((acc, { byteLength }) => acc + byteLength, 0)
            );
            let totalCompressedSize = prettyBytes(
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
        } catch (err) {
            // Errors can take multiple forms, so it trys to support the many forms errors can take
            let error = [].concat(err instanceof Error ? err?.message : err);
            postMessage({
                event: "error",
                details: { type: `error`, error }
            });

            logger(error, "error");
        }
    });

    port.onmessage = ({ data }: MessageEvent<BufferSource>) => {
        let { event, details } = JSON.parse(decode(data));
        BuildEvents.emit(event, details);
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