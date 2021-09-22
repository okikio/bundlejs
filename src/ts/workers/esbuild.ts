import { initialize, build, BuildResult, OutputFile, BuildIncremental } from "esbuild-wasm/esm/browser";
import { EventEmitter } from "@okikio/emitter";

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

const InitEvent = new EventEmitter();
let _initialized = false;
vol.fromJSON({}, "/");

(async () => {
    try {
        if (!_initialized) {
            await initialize({
                worker: false,
                wasmURL: `./esbuild.wasm`
            });

            InitEvent.emit("init", {
                event: "init",
                details: {},
            });
            _initialized = true;
        }
    } catch (error) {
        InitEvent.emit("init", {
            event: "error",
            details: {
                type: `initialize esbuild error`,
                error,
            }
        })
    }
})();

const encoder = new TextEncoder();
const start = (port) => {
    InitEvent.on("init", (data) => {
        port.postMessage(data);
    });

    if (_initialized) {
        port.postMessage({
            event: "init",
            details: {}
        });
    }

    let result: BuildResult & {
        outputFiles: OutputFile[];
    } | BuildIncremental;

    port.onmessage = ({ data }) => {
        let input: string = `${data}`; // Ensure input is a string

        (async () => {
            let content: string;
            if (!_initialized) {
                port.postMessage({
                    event: "warn",
                    details: {
                        type: `esbuild not initialized`,
                        message: `You need to wait for the promise returned from "initialize" to be resolved before trying to bundle`
                    }
                });

                return;
            }

            // use esbuild to bundle files
            try {
                await fs.promises.writeFile("input.ts", `${input}`);
                
                if (result?.rebuild) {
                    result = await result?.rebuild();
                } else {
                    result = await build({
                        entryPoints: ['<stdin>'],
                        bundle: true,
                        minify: true,
                        color: true,
                        incremental: true,
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
                            VIRTUAL_FS(),
                            WASM(),
                        ],
                        globalName: 'bundler',
                    });
                }

                result?.outputFiles?.forEach((x) => {
                    if (!fs.existsSync(path.dirname(x.path))) {
                        fs.mkdirSync(path.dirname(x.path));
                    }

                    fs.writeFileSync(x.path, x.text);
                });

                content = await fs.promises.readFile("/bundle.js", "utf-8") as string;
                content = content?.trim?.(); // Remove unesscary space

                // Reset memfs
                vol.reset();
            } catch (error) {
                port.postMessage({
                    event: "error",
                    details: {
                        type: `esbuild build error`,
                        error
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

                // // Closes the bundle
                // await bundle.close();
            } catch (error) {
                port.postMessage({
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
                let { byteLength } = encoder.encode(content);
                let { length } = await gzip(content, { level: 9 });

                port.postMessage({
                    event: "result",
                    details: { content, size: prettyBytes(byteLength) + " -> " + prettyBytes(length) }
                });
            } catch (error) {
                port.postMessage({
                    event: "error",
                    details: {
                        type: `gzip error`,
                        error
                    }
                });
            }
        })();
    };
}

// @ts-ignore
self.onconnect = (e) => {
    let [port] = e.ports;
    start(port)
}

if (!("SharedWorkerGlobalScope" in self)) {
    start(self);
}

