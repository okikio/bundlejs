import { initialize, build, BuildResult, OutputFile, BuildIncremental } from "esbuild-wasm/esm/browser";

import path from "path";
import { fs, vol } from "memfs";

import { rollup } from "rollup";
import { virtualFs } from "rollup-plugin-virtual-fs";

// import { minify } from "terser";
// import { codeFrameColumns } from "@babel/code-frame";

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

let _initialized = false;

vol.fromJSON({}, "/");

(async () => {
    try {
        if (!_initialized) {
            await initialize({
                worker: false,
                wasmURL: `./esbuild.wasm`
            });

            _initialized = true;
        }
    } catch (error) {
        self.postMessage({
            type: `initialize esbuild error`,
            error
        });
    }
})();

export let result: BuildResult & {
    outputFiles: OutputFile[];
} | BuildIncremental;

self.onmessage = ({ data }) => {
    let input: string = `${data}`; // Ensure input is a string

    (async () => {
        let content: string;
        if (!_initialized) {
            self.postMessage({
                type: `esbuild has not initialized. \nYou need to wait for the promise returned from "initialize" to be resolved before trying to bundle`,
                warn: ' '
            });

            return;
        }

        // use esbuild to bundle files
        try {
            await fs.promises.writeFile("input.ts", `${input}`);

            result = await build({
                entryPoints: ['<stdin>'],
                bundle: true,
                minify: true,
                color: true,
                incremental: false,
                target: ["esnext"],
                logLevel: 'info',
                write: false,
                outfile: "/bundle.js",
                platform: "browser",
                format: "esm",
                loader: {
                    '.ts': 'ts',
                    '.png': 'dataurl',
                    '.svg': 'text',
                    '.ttf': 'file',
                    '.css': 'css'
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
            self.postMessage({
                type: `esbuild build error`,
                error
            });

            return;
        }

        // esbuild doesn't treeshake files very well, so, I choose to use rollup for treeshaking files. 
        try {
            const { generate } = await rollup({
                input: "/input.js",
                treeshake: true,
                experimentalCacheExpiry: 1,
                perf: false,
                plugins: [
                    virtualFs({
                        files: {
                            '/input.js': content,
                        }
                    })
                ]
            });

            const { output } = await generate({
                format: "esm",
                sourcemap: false,
                minifyInternalExports: false,
            });

            content = output[0].code;
            content = content?.trim?.(); // Remove unesscary space
        } catch (error) {
            self.postMessage({
                type: `rollup treeshaking error`,
                error
            });

            return;
        }

        // use pako & pretty-bytes for gzipping
        try {
            // @ts-ignore
            let { length } = await gzip(content, { level: 9 });

            self.postMessage({
                value: { content, size: prettyBytes(length) }
            });
        } catch (error) {
            self.postMessage({
                type: `gzip error`,
                error
            });
        }
    })();
};
