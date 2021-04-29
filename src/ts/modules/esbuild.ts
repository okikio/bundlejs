import { initialize, build, BuildResult, OutputFile, BuildIncremental } from "esbuild-wasm/esm/browser";
import path from "path";
import { fs, vol } from "memfs";

import { EXTERNAL } from "../plugins/external";
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

// `esbuildVer` is defined in the gulpfile, it's the version of esbuild-wasm set in the package.json
// @ts-ignore
export const _VERSION = esbuildVer;
export const CACHE = new Map<string, string>();
export let result: BuildResult & {
    outputFiles: OutputFile[];
} | BuildIncremental;
export default (async (pkg: string) => {
    if (CACHE.has(pkg)) {
        console.log(pkg);
        return CACHE.get(pkg);
    }

    try {
        if (!_initialized) {
            await initialize({
                worker: true,
                wasmURL: `https://unpkg.com/esbuild-wasm@${_VERSION}/esbuild.wasm`
            });

            _initialized = true;
        }
    } catch (e) {
        console.warn("esbuild initialize error", e);
    }

    let content: string;
    try {
        vol.fromJSON({
            "input.ts": `export * as pkg from "${pkg}";`
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
                external: ['fsevents', `worker_threads`],
                platform: "browser",
                format: "esm",
                plugins: [
                    NODE(),
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
    }

    try {
        if (!content) throw `the content of the build is not valid, "${content}"`;
        let { length } = gzip(content, { level: 9 });
        let size = prettyBytes(length);
        if (_DEBUG) console.log(`\'${pkg}\' is ${size}`);
        CACHE.set(pkg, size);
        return size;
    } catch (e) {
        console.warn("Error zipping file ", e);
    }
});