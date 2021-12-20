import { initialize, build, formatMessages } from "esbuild-wasm";
import { EventEmitter } from "@okikio/emitter";

import path from "path";
import { fs, vol } from "memfs";

import prettyBytes from "pretty-bytes";
import { gzip } from "pako";

import { EXTERNAL } from "../plugins/external";
import { ENTRY } from "../plugins/entry";
import { HTTP } from "../plugins/http";
import { CDN } from "../plugins/cdn";
import { VIRTUAL_FS } from "../plugins/virtual-fs";

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
    vol.fromJSON({}, "/");

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

        (async () => {
            // Stores content from all external outputed files, this is for checking the gzip size when dealing with CSS and other external files
            let externalContent = [];
            let content: string = "";

            // Use esbuild to bundle files
            try {
                await fs.promises.writeFile("input.ts", `${input}`);
                input = null;

                try {
                    result = await build({
                        entryPoints: ['<stdin>'],
                        bundle: true,
                        minify: true,
                        color: true,
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
                            ENTRY(`/input.ts`),

                            HTTP(),
                            CDN(),
                            VIRTUAL_FS(fs),
                        ],
                        globalName: 'bundler',
                    });
                } catch (e) {
                    if (e.errors) {
                        throw [await createNotice(e.errors, "error")];
                    } else throw e;
                }

                result?.outputFiles?.forEach((x) => {
                    if (!fs.existsSync(path.dirname(x.path))) {
                        fs.mkdirSync(path.dirname(x.path));
                    }

                    fs.writeFileSync(x.path, x.text);
                    if (x.path != "/bundle.js" && typeof x.text == "string") {
                        externalContent.push(x.text?.trim?.());
                    }
                });

                if (result?.warnings.length > 0) {
                    postMessage({
                        event: "warn",
                        details: {
                            type: `esbuild build warning`,
                            message: await createNotice(result.warnings, "warning")
                        }
                    });
                }

                if (result?.errors.length > 0)
                    throw [await createNotice(result.errors, "error")];

                content = await fs.promises.readFile("/bundle.js", "utf-8") as string;
                content = content?.trim?.(); // Remove unesscary space

                // Reset memfs
                vol.reset();
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
                let totalByteLength = 0;
                let totalCompressedSize = 0;
                for (let value of [content, ...externalContent]) {
                    let { byteLength } = encode(value);
                    let { length } = await gzip(value, { level: 9 });

                    totalByteLength += byteLength;
                    totalCompressedSize += length;
                };

                postMessage({
                    event: "result",
                    details: { content, size: prettyBytes(totalByteLength) + " -> " + prettyBytes(totalCompressedSize) }
                });

                content = "";
                totalByteLength = 0;
                totalCompressedSize = 0;
                externalContent = [];
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