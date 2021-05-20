import { initialize, build, BuildResult, OutputFile, BuildIncremental } from "esbuild-wasm/esm/browser";
import path from "path";
import { fs, vol } from "memfs";

import { EXTERNAL, ExternalPackages } from "../plugins/external";
import { ENTRY } from "../plugins/entry";
import { NODE } from "../plugins/node-polyfill";
import { BARE } from "../plugins/bare";
import { HTTP } from "../plugins/http";
import { CDN } from "../plugins/cdn";
import { VIRTUAL_FS } from "../plugins/virtual-fs";
import { WASM } from "../plugins/wasm";

import prettyBytes from "pretty-bytes";
import { gzip } from "pako";

export let _initialized = false;
export const _DEBUG = false;

let currentlyBuilding = false;
let count = 0;

export let result: BuildResult & {
    outputFiles: OutputFile[];
} | BuildIncremental;
export default (async (input: string) => {
    try {
        if (!_initialized) {
            await initialize({
                worker: true,
                wasmURL: `./js/esbuild.wasm`
            });

            _initialized = true;
        }
    } catch (e) {
        console.warn("esbuild initialize error", e);
        return "Error";
    }

    let content: string;
    try {
        // Stop builiding if another input is coming down the pipeline
        if (currentlyBuilding) result?.stop?.();
        currentlyBuilding = true;

        vol.fromJSON({
            "input.ts": `${input}`
        }, '/');

        if (result) {
            result = await result.rebuild();
        } else {
            result = await build({
                entryPoints: ['<stdin>'],
                bundle: true,
                minify: true,
                color: true,
                incremental: true,
                target: ["es2020"],
                logLevel: 'error',
                write: false,
                outfile: "/bundle.js",
                external: ExternalPackages,
                platform: "browser",
                format: "esm",
                define: {
                    "__NODE__": `false`,
                    "process.env.NODE_ENV": `"production"`
                },
                plugins: [
                    // NODE(),
                    EXTERNAL(),
                    ENTRY(`/input.ts`),
                    BARE(),
                    HTTP(),
                    CDN(),
                    VIRTUAL_FS(),
                    WASM()
                ],
                globalName: 'bundler',
            });
        }
        currentlyBuilding = false;

        result?.outputFiles?.forEach((x) => {
            if (!fs.existsSync(path.dirname(x.path))) {
                fs.mkdirSync(path.dirname(x.path));
            }

            fs.writeFileSync(x.path, x.text);
        });

        content = await fs.promises.readFile("/bundle.js", "utf-8") as string;
        if (_DEBUG) console.log(content);
    } catch (e) {
        console.warn(`esbuild build error`, e);
        return "Error";
    }

    try {
        if (!content) throw `the content of the build is not valid, "${content}"`;
        let { length } = gzip(content, { level: 9 });
        let size = prettyBytes(length);

        if (count > 10) console.clear();
        console.log({
            input,
            size,
            result: content,
        });

        count++;

        if (_DEBUG) console.log(`\'${input}\' is ${size}`);
        return size;
    } catch (e) {
        console.warn("Error zipping file ", e);
        return "Error";
    }
});