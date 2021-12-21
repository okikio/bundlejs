import { initialize, build, formatMessages } from "esbuild-wasm";
import { EventEmitter } from "@okikio/emitter";

import prettyBytes from "pretty-bytes";
import { gzip } from "pako";

import { EXTERNAL } from "../plugins/external";
import { HTTP } from "../plugins/http";
import { CDN } from "../plugins/cdn";

import { encode, decode } from "../util/encode-decode";

import type { BuildResult, OutputFile, BuildIncremental, PartialMessage } from "esbuild-wasm";

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
export const createNotice = async (errors: PartialMessage[], kind: "error" | "warning" = "error") => {
    let res = await formatMessages(errors, { kind });
    return res.join("\n\n");
}

export const start = async (port) => {
    const BuildEvents = new EventEmitter();

    const postMessage = (obj: { event: string, details: any }) => {
        let messageStr = JSON.stringify(obj);
        let encodedMessage = encode(messageStr);
        port.postMessage(encodedMessage, [encodedMessage.buffer]);
    };

    initEvent.on({
        // When the SharedWorker first loads, tell the page that esbuild has initialized  
        init() {
            postMessage({
                event: "init",
                details: {}
            });
        },
        error(error) {
            let err = Array.isArray(error) ? error : error?.message;
            postMessage({
                event: "error",
                details: {
                    type: `Error initializing, you may need to close and reopen all currently open pages pages`,
                    error: Array.isArray(err) ? err : [err],
                }
            });
        }
    });

    // If another page loads while SharedWorker is still active, tell that page that esbuild is initialized
    if (_initialized)
        initEvent.emit("init");

    let result: BuildResult & {
        outputFiles: OutputFile[];
    } | BuildIncremental;

    BuildEvents.on("build", (details) => {
        if (!_initialized) {
            postMessage({
                event: "warn",
                details: {
                    type: `esbuild worker not initialized`,
                    message: [`You need to wait for a little bit before trying to bundle files`]
                }
            });

            return;
        }

        let input: string = `${details}`; // Ensure input is a string
        let output = "";

        (async () => {
            // Stores content from all external outputed files, this is for checking the gzip size when dealing with CSS and other external files
            let content: Uint8Array[] = [];

            // Use esbuild to bundle files
            try {
                try {
                    result = await build({
                        stdin: {
                            contents: input,
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
                            HTTP(),
                            CDN(),
                        ],
                        globalName: 'bundler',
                    });
                } catch (e) {
                    if (e.errors) {
                        throw [await createNotice(e.errors, "error")];
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
                            type: `esbuild build warning`,
                            message: [await createNotice(result.warnings, "warning")]
                        }
                    });
                }

                if (result?.errors.length > 0)
                    throw [await createNotice(result.errors, "error")];
            } catch (error) {
                let err = Array.isArray(error) ? error : error?.message;
                postMessage({
                    event: "error",
                    details: {
                        type: `esbuild build error`,
                        error: Array.isArray(err) ? err : [err]
                    }
                });

                return;
            }

            // Use pako & pretty-bytes for gzipping
            try {
                // @ts-ignore
                let totalByteLength = content.reduce((acc, { byteLength }) => acc + byteLength, 0);
                let totalCompressedSize = (await Promise.all(
                    content.map((v: Uint8Array) => gzip(v, { level: 9 }))
                )).reduce((acc, { length }) => acc + length, 0) as number;

                postMessage({
                    event: "result",
                    details: { content: output, size: prettyBytes(totalByteLength) + " -> " + prettyBytes(totalCompressedSize) }
                });

                content = null;
                totalByteLength = null;
                totalCompressedSize = null;
                output = null;
                input = null;
            } catch (error) {
                postMessage({
                    event: "error",
                    details: {
                        type: `gzip error`,
                        error
                    }
                });
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