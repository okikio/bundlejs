import { initialize, build, BuildResult, OutputFile, BuildIncremental } from "esbuild-wasm/esm/browser";
import path from "path";
import { fs, vol } from "memfs";

import { EXTERNAL, ExternalPackages } from "../plugins/external";
import { ENTRY } from "../plugins/entry";
import { JSON_PLUGIN } from "../plugins/json";
import { NODE } from "../plugins/node-polyfill";
import { BARE } from "../plugins/bare";
import { HTTP } from "../plugins/http";
import { CDN } from "../plugins/cdn";
import { VIRTUAL_FS } from "../plugins/virtual-fs";
import { WASM } from "../plugins/wasm";

import prettyBytes from "pretty-bytes";
import { gzip } from "pako";

export let _initialized = false;
let currentlyBuilding = false;
let count = 0;

const tsconfig = {
    "compilerOptions": {
        "moduleResolution": "node",
        "target": "ES2020",
        "module": "ES2020",
        "lib": [
            "ES2020",
            "DOM",
            "DOM.Iterable"
        ],
        "sourceMap": true,
        "outDir": "lib",
        "resolveJsonModule": true,
        "isolatedModules": true,
        "esModuleInterop": true
    },
    "exclude": [
        "node_modules"
    ]
};

vol.fromJSON({
    "tsconfig.json": JSON.stringify(tsconfig),
    "input.ts": ``
}, '/');

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
                    JSON_PLUGIN(),
                    
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

        result?.stop?.();
        content = await fs.promises.readFile("/bundle.js", "utf-8") as string;
        content = content?.trim?.(); // Remove unesscary space
        await fs.promises.unlink("./bundle.js"); // Delete bundle file
    } catch (e) {
        console.warn(`esbuild build error`, e);
        return "Error";
    }

    try {
        let { length } = gzip(content, { level: 9 });
        let size = prettyBytes(length);

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
        return size;
    } catch (e) {
        console.warn("Error zipping file ", e);
        return "Error";
    }
};