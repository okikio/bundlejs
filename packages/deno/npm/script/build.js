"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.build = exports.init = exports.getESBUILD = exports.INPUT_EVENTS = void 0;
const wasm_js_1 = __importDefault(require("./wasm.js"));
const esbuild_wasm_1 = require("esbuild-wasm");
const bytes_1 = __importDefault(require("bytes"));
const mod_js_1 = require("./deno/denoflate/mod.js");
const mod_js_2 = require("./deno/brotli/mod.js");
const mod_js_3 = require("./deno/lz4/mod.js");
const external_js_1 = require("./plugins/external.js");
const http_js_1 = require("./plugins/http.js");
const cdn_js_1 = require("./plugins/cdn.js");
const alias_js_1 = require("./plugins/alias.js");
const virtual_fs_js_1 = require("./plugins/virtual-fs.js");
const options_js_1 = require("./configs/options.js");
const events_js_1 = require("./configs/events.js");
const state_js_1 = require("./configs/state.js");
const encode_decode_js_1 = require("./utils/encode-decode.js");
const deep_equal_js_1 = require("./utils/deep-equal.js");
const create_notice_js_1 = require("./utils/create-notice.js");
exports.INPUT_EVENTS = {
    "build": build,
    "init": init
};
async function getESBUILD(platform = "node") {
    try {
        switch (platform) {
            case "node":
                // @ts-ignore: On nodejs it should use the nodejs version of esbuild
                return await Promise.resolve().then(() => __importStar(require(`https://cdn.esm.sh/esbuild@${esbuild_wasm_1.version}`)));
            case "deno":
                return await Promise.resolve().then(() => __importStar(require(`https://deno.land/x/esbuild@v${esbuild_wasm_1.version}/mod.js`)));
            default:
                return await Promise.resolve().then(() => __importStar(require("esbuild-wasm")));
        }
    }
    catch (e) {
        throw e;
    }
}
exports.getESBUILD = getESBUILD;
async function init({ platform, ...opts } = {}) {
    try {
        if (!state_js_1.STATE.initialized) {
            events_js_1.EVENTS.emit("init.start");
            state_js_1.STATE.esbuild = await getESBUILD(platform);
            if (platform !== "node" && platform !== "deno") {
                await state_js_1.STATE.esbuild.initialize({
                    wasmModule: new WebAssembly.Module(await wasm_js_1.default),
                    ...opts
                });
            }
            await (0, mod_js_1.getWASM)();
            state_js_1.STATE.initialized = true;
            events_js_1.EVENTS.emit("init.complete");
        }
        return state_js_1.STATE.esbuild;
    }
    catch (error) {
        events_js_1.EVENTS.emit("init.error", error);
        console.error(error);
    }
}
exports.init = init;
async function build(opts = {}) {
    if (!state_js_1.STATE.initialized)
        events_js_1.EVENTS.emit("init.loading");
    const CONFIG = (0, deep_equal_js_1.deepAssign)({}, options_js_1.DefaultConfig, opts);
    const { build: bundle } = (await init(CONFIG.init));
    const { define = {}, ...esbuildOpts } = CONFIG.esbuild ?? {};
    // Stores content from all external outputed files, this is for checking the gzip size when dealing with CSS and other external files
    let outputs = [];
    let content = [];
    let result;
    try {
        try {
            const keys = "p.env.NODE_ENV".replace("p.", "process.");
            result = await bundle({
                entryPoints: CONFIG?.entryPoints ?? [],
                metafile: Boolean(CONFIG.analysis),
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
                    // vite crashes for some reason when it sees "process.env.NODE_ENV"
                    [keys]: `"production"`,
                    ...define
                },
                write: false,
                outdir: "/",
                plugins: [
                    (0, alias_js_1.ALIAS)(events_js_1.EVENTS, state_js_1.STATE, CONFIG),
                    (0, external_js_1.EXTERNAL)(events_js_1.EVENTS, state_js_1.STATE, CONFIG),
                    (0, http_js_1.HTTP)(events_js_1.EVENTS, state_js_1.STATE, CONFIG),
                    (0, cdn_js_1.CDN)(events_js_1.EVENTS, state_js_1.STATE, CONFIG),
                    (0, virtual_fs_js_1.VIRTUAL_FS)(events_js_1.EVENTS, state_js_1.STATE, CONFIG),
                ],
                ...esbuildOpts,
            });
        }
        catch (e) {
            if (e.errors) {
                // Log errors with added color info. to the virtual console
                const asciMsgs = [...await (0, create_notice_js_1.createNotice)(e.errors, "error", false)];
                const htmlMsgs = [...await (0, create_notice_js_1.createNotice)(e.errors, "error")];
                events_js_1.EVENTS.emit("logger.error", asciMsgs, htmlMsgs);
                const message = (htmlMsgs.length > 1 ? `${htmlMsgs.length} error(s) ` : "") + "(if you are having trouble solving this issue, please create a new issue in the repo, https://github.com/okikio/bundle)";
                return events_js_1.EVENTS.emit("logger.error", message);
            }
            else
                throw e;
        }
        // Create an array of assets and actual output files, this will later be used to calculate total file size
        outputs = await Promise.all([...state_js_1.STATE.assets]
            .concat(result?.outputFiles));
        content = await Promise.all(outputs
            ?.map(({ path, text, contents }) => {
            if (/\.map$/.test(path))
                return (0, encode_decode_js_1.encode)("");
            // For debugging reasons, if the user chooses verbose, print all the content to the Shared Worker console
            if (esbuildOpts?.logLevel == "verbose") {
                const ignoreFile = /\.(wasm|png|jpeg|webp)$/.test(path);
                if (ignoreFile) {
                    events_js_1.EVENTS.emit("logger.log", "Output File: " + path);
                }
                else {
                    events_js_1.EVENTS.emit("logger.log", "Output File: " + path + "\n" + text);
                }
            }
            return contents;
        }));
        // Use multiple compression algorithims & pretty-bytes for the total gzip, brotli & lz4 compressed size
        const { compression = {} } = CONFIG;
        const { type = "gzip", quality: level = 9 } = (typeof compression == "string" ? { type: compression } : (compression ?? {}));
        const totalByteLength = (0, bytes_1.default)(content.reduce((acc, { byteLength }) => acc + byteLength, 0));
        const totalCompressedSize = (0, bytes_1.default)((await Promise.all(content.map((code) => {
            switch (type) {
                case "lz4":
                    return (0, mod_js_3.compress)(code);
                case "brotli":
                    return (0, mod_js_2.compress)(code, code.length, level);
                default:
                    return (0, mod_js_1.gzip)(code, level);
            }
        }))).reduce((acc, { length }) => acc + length, 0));
        // // Ensure a fresh filesystem on every run
        // FileSystem.clear();
        // // Reset assets
        // STATE.assets = [];
        return {
            result,
            outputFiles: result.outputFiles,
            initialSize: `${totalByteLength}`,
            size: `${totalCompressedSize} (${type})`
        };
        // deno-lint-ignore no-empty
    }
    catch (_e) { }
}
exports.build = build;
