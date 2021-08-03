// Based on [uniroll](https://github.com/mizchi/uniroll) by [mizchi](https://github.com/mizchi)
import { Plugin, rollup } from "rollup";
import { virtualFs } from "rollup-plugin-virtual-fs";
import { httpResolve } from "rollup-plugin-http-resolve";

// import json from "@rollup/plugin-json";
// import commonjs from "@rollup/plugin-commonjs";

import { terser } from "../plugins/terser";

import prettyBytes from "pretty-bytes";
import { gzip } from "pako";

// import { Volume } from "memfs";
// import createFs from "memfs/lib/promises";
// import { memfsPlugin } from "rollup-plugin-memfs";

// const vol = Volume.fromJSON({ "/index.js": "export {};" })
// const memfs = createFs(vol);

// vol.fromJSON({}, "/");

const cache = new Map();
self.onmessage = ({ data }) => {
    let input: string = `${data}`; // Ensure input is a string
    (async () => {
        let content: string;

        // await memfs.writeFile("input.js", `${input}`);

        try {
            // Clear Cache
            const build = await rollup({
                input: "/input.js",
                plugins: [
                    // json() as Plugin,
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
                    // commonjs() as Plugin,
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
