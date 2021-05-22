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

import { createBrowserPlugin } from "../plugins/velcro";
import { FsStrategy } from "@velcro/strategy-fs";

export const GZIP = new Worker("./js/gzip.min.js", {
    type: "module"
})

// import { codeFrameColumns } from "@babel/code-frame"
// export let Terser = new Worker("./js/terser.min.js");

export let _initialized = false;
let currentlyBuilding = false;
let count = 0;

export let result: BuildResult & {
    outputFiles: OutputFile[];
} | BuildIncremental;

export const init = async () => {
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
}

vol.fromJSON({
    "./package.json": JSON.stringify({
        "dependencies": {
            "@babel/core": "*",
            "@okikio/animate": "*",
            "typescript": "*",
        }
    })
}, "/")

export const size = async (input: string) => {
    let content: string;
    input = `${input}`; // Ensure input is string
    if (!_initialized) return "Error";

    try {
        await fs.promises.writeFile("input.ts", `${input}`);

        // Stop builiding if another input is coming down the pipeline
        if (currentlyBuilding) result?.stop?.();
        currentlyBuilding = true;

        if (result) {
            result = await result.rebuild();
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

                    createBrowserPlugin({
                        cwd: "/",
                        fs: fs as FsStrategy.FsInterface
                    }),
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
        content = content?.trim?.(); // Remove unesscary space

        // Reset memfs
        vol.reset();
    } catch (e) {
        console.warn(`esbuild build error`, e);
        return "Error";
    }

    // try {
    //     Terser.postMessage(content);
    //     let data = await new Promise<string>((resolve, reject) => {
    //         Terser.onmessage = ({ data }) => {
    //             if (typeof data == "string") resolve(data);
    //             else reject(data.error);
    //         };
    //     });

    //     content = data;
    // } catch (err) {
    //     const { message, line, col: column } = err;
    //     console.warn("Terser minify error",
    //         codeFrameColumns(content, { start: { line, column } }, { message })
    //     );
    // }

    let size = "Error zipping file";

    try {
        GZIP.postMessage(content);
        let data = await new Promise<string>((resolve, reject) => {
            GZIP.onmessage = ({ data }) => {
                if (typeof data == "string") resolve(data);
                else reject(data.error);
            };
        });

        size = data;
        return size;
    } catch (e) {
        console.warn("Error zipping file ", e);
        return "Error";
    } finally {
        if (count > 10) console.clear();
        let splitInput = input.split("\n");
        console.groupCollapsed(`${size} =>`, `${splitInput[0]}${splitInput.length > 1 ? "\n..." : ""}`);
        console.groupCollapsed("Input Code: ");
        console.log(input);
        console.groupEnd();
        console.groupCollapsed("Bundled Code: ");
        console.log(content);
        console.groupEnd();
        console.groupEnd();

        content = null;
        count++;

    }
};