import { initialize, build } from "esbuild-wasm/esm/browser";
import path from "path";
import { fs, vol } from "memfs";
import { EXTERNAL } from "../plugins/external";
import { ENTRY } from "../plugins/entry";
import { NODE } from "../plugins/node-polyfill";
import { BARE } from "../plugins/bare";
import { HTTP } from "../plugins/http";
import { CDN } from "../plugins/cdn";
import { VIRTUAL_FS } from "../plugins/virtual-fs";
import prettyBytes from "pretty-bytes";
import { gzip } from "pako";

export let _initialized = false;
export const _DEBUG = false;
export default (async (pkg: string) => {
    try {
        if (!_initialized) {
            await initialize({
                worker: true,
                wasmURL: "https://unpkg.com/esbuild-wasm/esbuild.wasm"
            });

            _initialized = true;
        }
    } catch (e) {
        console.warn("esbuild initialize error", e);

    }

    let content: string;
    try {
        vol.fromJSON({
            "input.ts": `export * as pkg from "https://cdn.skypack.dev/${pkg}";`
        }, '/');

        let result = await build({
            entryPoints: ['<stdin>'],
            bundle: true,
            minify: true,
            color: true,
            target: ["es2020"],
            logLevel: 'error',
            write: false,
            outfile: "/bundle.js",
            external: ['esbuild', 'fsevents', 'chokidar', 'yargs'],
            platform: "browser",
            format: "esm",
            banner: { js: 'const global = globalThis;' },
            plugins: [
                // NODE(),
                EXTERNAL(),
                ENTRY(`/input.ts`),
                BARE(),
                HTTP(),
                CDN(),
                VIRTUAL_FS()
            ],
            globalName: 'bundler',
        });

        result?.outputFiles?.forEach((x) => {
            if (!fs.existsSync(path.dirname(x.path))) {
                fs.mkdirSync(path.dirname(x.path));
            }
            fs.writeFileSync(x.path, x.text);
        });

        content = await fs.promises.readFile("/bundle.js", "utf-8");
        if (_DEBUG) console.log(content);
    } catch (e) {
        console.warn(`esbuild build error`, e);
    }

    try {
        if (!content) throw `the content of the build is not valid, "${content}"`;
        let { length } = gzip(content, { level: 9 });
        let size = prettyBytes(length);
        if (_DEBUG) console.log(`\'${pkg}\' is ${size}`);
        return size;
    } catch (e) {
        console.warn("Error zipping file ", e);
    }
});