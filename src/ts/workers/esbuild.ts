import { initialize, build } from "esbuild-wasm/esm/browser";
import { EventEmitter } from "@okikio/emitter";

// import { install, BFSRequire, FileSystem } from "browserfs";
import path from "path";
import { fs, vol } from "memfs";

import { rollup } from "rollup";
import virtual from "@rollup/plugin-virtual";

import prettyBytes from "pretty-bytes";
import { gzip } from "pako";

import { EXTERNAL } from "../plugins/external";
import { ENTRY } from "../plugins/entry";
import { JSON_PLUGIN } from "../plugins/json";
import { BARE } from "../plugins/bare";
import { HTTP } from "../plugins/http";
import { CDN } from "../plugins/cdn";
import { VIRTUAL_FS } from "../plugins/virtual-fs";
import { WASM } from "../plugins/wasm";

import { encode, decode } from "../util/encode-decode";
// import initSwc, { transformSync } from "@swc/wasm-web";

import type { BuildResult, OutputFile, BuildIncremental, Message} from "esbuild-wasm/esm/browser";

let _initialized = false;
const initEvent = new EventEmitter();

(async () => {
    try {
        if (!_initialized) {
            await initialize({
                worker: false,
                wasmURL: `./esbuild.wasm`
            });

            // await initSwc(new URL("wasm_bg.wasm", globalThis.location.toString()));
            _initialized = true;
            initEvent.emit("init");  
        }
    } catch (error) {
        initEvent.emit("error", error);   
    }
})();

let formatMessages = (messages: any[]) => {
    return messages.map((err) => {
        let { location, text } = err as Message;
        let startIndx = Math.max(location.column - 10, 0);
        let len = Math.min(location.length + 10, location.lineText.length - startIndx);
        return "> " + location.file + ` line ${location.line}, column ${location.column}` + "\n" + 
                `Warning: ${text}` + "\n" + "\n" +
                `    ${location.line} │ ${location.lineText}` + "\n" +
                "         " + `^`.padStart(location.column, " ").padEnd(location.column + location.length - 1, "^") + "\n";
    });
}

const start = async (port) => {
    const BuildEvents = new EventEmitter();
    vol.fromJSON({}, "/");

    const postMessage = (obj: { event: string, details: any }) => {
        let messageStr = JSON.stringify(obj);
        let encodedMessage = encode(messageStr);
        port.postMessage(encodedMessage , [encodedMessage.buffer]); 
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
                input = null; // Try to 
                // await new Promise<void>((resolve, reject) => {
                //     fs.writeFile("input.ts", `${input}`, (err) => {
                //         if (err) return reject(err);
                //         resolve();
                //     });
                // });

                try {
                    // if (result?.rebuild) {
                    //     result = await result?.rebuild();
                    // } else {
                        result = await build({
                            entryPoints: ['<stdin>'],
                            bundle: true,
                            minify: true,
                            color: true,
                            treeShaking: true,
                            incremental: false,
                            // incremental: true,
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
                                JSON_PLUGIN(),

                                BARE(),
                                HTTP(),
                                CDN(),
                                VIRTUAL_FS(fs),
                                WASM(fs),
                            ],
                            globalName: 'bundler',
                        });
                    // }
                } catch (error) {
                    let err = error?.message;
                    throw Array.isArray(err) ? formatMessages(err) : [err];
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
                            message: formatMessages(result.warnings)
                        }
                    });
                }

                if (result?.errors.length > 0) 
                    throw formatMessages(result.errors);

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

            // esbuild doesn't treeshake files very well, so, I choose to use rollup for treeshaking files.
            try { 
                const bundle = await rollup({
                    input: "entry",
                    treeshake: true,
                    plugins: [
                        virtual({
                            entry: content
                        })
                    ]
                });

                const { output } = await bundle.generate({
                    format: "esm",
                    sourcemap: false,
                    minifyInternalExports: false,
                });

                content = output[0].code?.trim?.() ?? content; // Remove unesscary space

                // Closes the bundle
                await bundle.close();

                // esbuild doesn't treeshake files very well, so, I choose to use swc for treeshaking & minifying files. 
                // let transformOptions = {
                //     "jsc": {
                //         "parser": {
                //             "syntax": "typescript",
                //             "tsx": false
                //         },
                //         "target": "es2021",
                //         "loose": false,
                //         "minify": {
                //           "compress": true,
                //           "mangle": true
                //         }
                //     },
                //     "module": {
                //         "type": "es6"
                //     },
                //     "minify": true,
                //     "isModule": true
                // };
                // let { code } = transformSync(content, transformOptions);
                // content = code.trim();
            } catch (error) {
                postMessage({
                    event: "error",
                    details: {
                        type: `rollup treeshaking error`,
                        error
                    }
                });

                return;
            }

            // use pako & pretty-bytes for gzipping
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