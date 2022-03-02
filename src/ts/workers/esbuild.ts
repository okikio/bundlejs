import { initialize, build, formatMessages } from "esbuild-wasm";
import { EventEmitter } from "@okikio/emitter";

import prettyBytes from "pretty-bytes";
import { gzip } from "pako";
// import { compress } from "../util/brotli-wasm.js";
import { compress } from "../deno/brotli/mod";

import { EXTERNAL } from "../plugins/external";
import { HTTP } from "../plugins/http";
import { CDN } from "../plugins/cdn";

import { encode, decode } from "../util/encode-decode";
import { render as ansi } from "../util/ansi";

import type { BuildResult, OutputFile, BuildIncremental, PartialMessage } from "esbuild-wasm";

let _initialized = false;
export const initEvent = new EventEmitter();

(async () => {
    try {
        if (!_initialized) {
            console.log(compress(encode("Cool")))
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

    BuildEvents.on("build", (input: string) => {
        logger("Bundling 🚀");

        if (!_initialized) {
            logger([`esbuild worker not initialized\nYou need to wait for a little bit before trying to bundle files`], "warning");
            return;
        }

        (async () => {
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
                        stdin: {
                            // Ensure input is a string
                            contents: `${input}`,
                            loader: 'ts',
                        },
                        bundle: true,
                        minify: true,
                        color: true,
                        sourcemap: false,
                        treeShaking: true,
                        incremental: false,
                        target: ["esnext"],
                        logLevel: 'info',
                        write: false,
                        outfile: "/bundle.js",
                        platform: "browser",
                        format: "esm",
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
                            "process.env.NODE_ENV": `"production"`
                        },
                        plugins: [
                            EXTERNAL(),
                            HTTP(logger),
                            CDN(),
                        ],
                        globalName: 'bundler',
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

                content = result?.outputFiles?.map(({ path, text, contents }) => {
                    if (path == "/bundle.js")
                        output = text;
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
                // @ts-ignore
                let totalByteLength = prettyBytes(
                    content.reduce((acc, { byteLength }) => acc + byteLength, 0)
                );
                let totalBrotliCompressedSize = prettyBytes(
                    (await Promise.all(
                        content.map((v: Uint8Array) => compress(v, v.length, 8))
                    )).reduce((acc, { length }) => acc + length, 0)
                );
                let totalGZIPCompressedSize = prettyBytes(
                    (await Promise.all(
                        content.map((v: Uint8Array) => gzip(v, { level: 9 }))
                    )).reduce((acc, { length }) => acc + length, 0)
                );

                postMessage({
                    event: "result",
                    details: { 
                        content: output, 
                        intialSize: `${totalByteLength}`,
                        size: `${totalGZIPCompressedSize} (gzip), ${totalBrotliCompressedSize} (brotli)` 
                    }
                });

                content = null;
                totalByteLength = null;
                totalGZIPCompressedSize = null;
                totalBrotliCompressedSize = null;
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