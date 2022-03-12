/// <reference lib="webworker" />
import { initialize, build, formatMessages } from "esbuild-wasm";
import { EventEmitter } from "@okikio/emitter";

import prettyBytes from "pretty-bytes";
import { gzip } from "pako";
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

let _initialized = false;
export const initEvent = new EventEmitter();

(async () => {
    try {
        if (!_initialized) {
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

// Inspired by https://github.com/egoist/play-esbuild/blob/main/src/lib/esbuild.ts
// I didn't even know this was exported by esbuild, great job @egoist
export const createNotice = async (errors: PartialMessage[], kind: "error" | "warning" = "error", color = true) => {
    let notices = await formatMessages(errors, { color, kind });
    return notices.map((msg) => !color ? msg : ansi(msg.replace(/(\s+)(\d+)(\s+)\│/g, "\n$1$2$3│")));
}

export const start = async (port) => {
    const BuildEvents = new EventEmitter();
    const postMessage = (obj: { event: string, details: any }) => {
        let messageStr = JSON.stringify(obj);
        let encodedMessage = encode(messageStr);
        port.postMessage(encodedMessage, [encodedMessage.buffer]);
    };

    const logger = (messages: string[] | any, type?: "error" | "warning" | any) => {
        let msgs = Array.isArray(messages) ? messages : [messages];
        if (type == "init") {
            postMessage({
                event: "init",
                details: {
                    type: `init`,
                    message: msgs,
                }
            });
        }

        if (type == "error" || type == "warning") {
            postMessage({
                event: "log",
                details: { messages: [`${msgs.length} ${type}(s) ${type == "error" ? "(if you are having trouble solving this issue, please create a new issue in the repo, https://github.com/okikio/bundle)" : ""}`] }
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
        error(error) {
            let err = Array.isArray(error) ? error : error?.message;
            logger([`Error initializing, you may need to close and reopen all currently open pages pages`, ...(Array.isArray(err) ? err : [err])], "error")
        }
    });

    // If another page loads while SharedWorker is still active, tell that page that esbuild is initialized
    if (_initialized)
        initEvent.emit("init");

    BuildEvents.on("build", (details) => {
        let { config: _config, value: input } = details;
        let config = deepAssign({}, DefaultConfig, JSON.parse(_config ? _config : "{}")) as BundleConfigOptions;

        // Exclude certain properties
        let { define = {}, loader = {}, ...esbuildOpts } = (config.esbuild ?? {}) as BundleConfigOptions['esbuild'];
        logger("Bundling 🚀");

        if (!_initialized) {
            logger([`esbuild worker not initialized\nYou need to wait for a little bit before trying to bundle files`], "warning");
            return;
        }

        (async () => {
            const assets: OutputFile[] = [];
            let output = "";

            // Stores content from all external outputed files, this is for checking the gzip size when dealing with CSS and other external files
            let content: Uint8Array[] = [];
            let result: BuildResult & {
                outputFiles: OutputFile[];
            } | BuildIncremental;

            // Use esbuild to bundle files
            try {
                try {
                    result = await build({
                        "stdin": {
                            // Ensure input is a string
                            contents: `${input}`,
                            loader: 'ts',
                            sourcefile: "/bundle.ts"
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
                            ALIAS(config?.alias),
                            EXTERNAL(esbuildOpts?.external),
                            HTTP(assets, logger),
                            CDN(config?.cdn),
                        ],
                        outdir: "/"
                    });
                } catch (e) {
                    if (e.errors) {
                        postMessage({
                            event: "error",
                            details: {
                                type: `error`,
                                error: [...await createNotice(e.errors, "error", false)]
                            }
                        });
                        return logger([...await createNotice(e.errors, "error")], "error");
                    } else throw e;
                }

                content = [...assets].concat(result?.outputFiles)?.map(({ path, text, contents }) => {
                    let ignoreFile = /\.(wasm|png|jpeg|webp)$/.test(path);
                    if (path == "/stdin.js") {
                        output = text;
                    } 

                    // For debugging reasons
                    if (esbuildOpts?.logLevel == "verbose") {
                        if (ignoreFile) {
                            console.log(path)
                        } else {
                            console.groupCollapsed(path); 
                            console.log(text);
                            console.groupEnd();
                        }
                    }

                    return contents;
                });

                if (result?.warnings.length > 0) {
                    postMessage({
                        event: "warn",
                        details: {
                            type: `warning`,
                            message: [...await createNotice(result.warnings, "warning", false)]
                        }
                    });

                    logger([...await createNotice(result.warnings, "warning")], "warning");
                }

                if (result?.errors.length > 0) {
                    postMessage({
                        event: "error",
                        details: {
                            type: `error`,
                            error: [...await createNotice(result.errors, "error", false)]
                        }
                    });
                    return logger([...await createNotice(result.errors, "error")], "error");
                }
                
                logger("Done ✨", "info");
            } catch (error) {
                let err = Array.isArray(error) ? error : error?.message;
                postMessage({
                    event: "error",
                    details: {
                        type: `error`,
                        error: "notColor" in error ? error?.notColor : Array.isArray(err) ? err : [err]
                    }
                });
                logger(Array.isArray(err) ? err : [err], "error");

                return;
            }

            // Use pako & pretty-bytes for gzipping
            try {
                let { compression = {} } = config;
                let { type = "gzip", quality: level = 9 } = 
                    (typeof compression == "string" ? 
                        { type: compression } : 
                        (compression ?? {})) as CompressionOptions;

                // @ts-ignore
                let totalByteLength = prettyBytes(
                    content.reduce((acc, { byteLength }) => acc + byteLength, 0)
                );
                let totalCompressedSize = prettyBytes(
                    (await Promise.all(
                        content.map((v: Uint8Array) => { 
                            switch (type) {
                                case "lz4":
                                    return lz4_compress(v);
                                case "brotli": 
                                    return compress(v, v.length, level);
                                default:  
                                    return gzip(v, { level });
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
            } catch (error) {
                postMessage({
                    event: "error",
                    details: {
                        type: `error`,
                        error
                    }
                });
                logger([error], "error");
            }
        })();
    });

    port.onmessage = ({ data }: MessageEvent<BufferSource>) => {
        let { event, details } = JSON.parse(decode(data));
        BuildEvents.emit(event, details);
    };
}

// @ts-ignore
self.onconnect = (e) => {
    let [port] = e.ports;
    start(port);
}

if (!("SharedWorkerGlobalScope" in self)) {
    start(self);
}

export { };