import { initialize, build, BuildResult, OutputFile, BuildIncremental } from "esbuild-wasm/esm/browser";
import path from "path";
import { fs, vol } from "memfs";

import { EXTERNAL } from "../plugins/external";
import { ENTRY } from "../plugins/entry";
import { JSON_PLUGIN } from "../plugins/json";
import { BARE } from "../plugins/bare";
import { HTTP } from "../plugins/http";
import { CDN } from "../plugins/cdn";
import { VIRTUAL_FS } from "../plugins/virtual-fs";
import { WASM } from "../plugins/wasm";

import prettyBytes from "pretty-bytes";
import { gzip } from "pako";

let _initialized = false;
export let result: BuildResult & {
    outputFiles: OutputFile[];
} | BuildIncremental;

vol.fromJSON({}, "/");
const cache = new Map();

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

self.onmessage = ({ data }) => {
    let input: string = `${data}`; // Ensure input is a string

    (async () => {
        let content: string;
        if (!_initialized) {
            self.postMessage({
                type: `esbuild has not initialized. \nYou need to wait for the promise returned from "initialize" to be resolved before calling this`,
                warn: ' '
            });

            return;
        }

        try {
            await fs.promises.writeFile("input.ts", `${input}`);

            // Stop builiding if another input is coming down the pipeline
            // if (currentlyBuilding) result?.stop?.();
            // currentlyBuilding = true;

            result = await build({
                entryPoints: ['<stdin>'],
                // stdin: {
                //     contents: input,

                //     // These are all optional:
                //     // resolveDir: require('path').join(__dirname, 'src'),
                //     sourcefile: '/input.ts',
                //     loader: 'ts',
                // },
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
                    CDN(cache),
                    VIRTUAL_FS(),
                    WASM(),
                ],
                globalName: 'bundler',
            });

            // currentlyBuilding = false;
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
        } finally {
            cache.clear();
        }

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