// Based on [uniroll](https://github.com/mizchi/uniroll) by [mizchi](https://github.com/mizchi)
import { Plugin, rollup } from "rollup";
import { virtualFs } from "rollup-plugin-virtual-fs";
import { httpResolve } from "rollup-plugin-http-resolve";

import json from "@rollup/plugin-json";
import commonjs from "@rollup/plugin-commonjs";

import { terser } from "../plugins/terser";

import prettyBytes from "pretty-bytes";
import { gzip } from "pako";

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

let _initialized = false;
let currentlyBuilding = false;

export let result: BuildResult & {
    outputFiles: OutputFile[];
} | BuildIncremental;

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


const cache = new Map();
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

            // Clear Cache
            const build = await rollup({
                input: "/input.js",
                plugins: [
                    json() as Plugin,
                    httpResolve({
                        cache,
                        resolveIdFallback: (id, importer) => {
                            if (importer == null) return;
                            console.log(importer)
                            if (id.startsWith(".")) return;
                            if (id.startsWith("https://")) return id;

                            // Use cdn.skypack.dev instead of esm.sh
                            return `https://cdn.skypack.dev/${id}`;

                        }
                    }),
                    commonjs() as Plugin,
                    // memfsPlugin(memfs),
                    virtualFs({
                        files: {
                            '/input.js': input,
                        }
                    }),
                    terser()
                ]
            });

            const { output } = await build.generate({ format: "esm" });
            content = output[0].code;
            content = content?.trim?.(); // Remove unesscary space
        } catch (error) {
            self.postMessage({
                type: `rollup build error`,
                error
            });

            return;
        }

        try {
            cache.clear();

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
