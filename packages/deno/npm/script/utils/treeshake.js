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
Object.defineProperty(exports, "__esModule", { value: true });
exports.treeshake = exports.virtualfs = exports.searchFile = exports.SEARCH_EXTENSIONS = exports.stripSchema = exports.isRelativePath = exports.isFileSchema = void 0;
const rollup_1 = require("rollup");
const path = __importStar(require("./path.js"));
const isFileSchema = (id) => id.startsWith("file://") || id.startsWith("/");
exports.isFileSchema = isFileSchema;
const isRelativePath = (id) => (0, exports.stripSchema)(id).startsWith(".");
exports.isRelativePath = isRelativePath;
const stripSchema = (id) => id.replace(/^file\:(\/\/)?/, "");
exports.stripSchema = stripSchema;
exports.SEARCH_EXTENSIONS = [
    "/index.tsx",
    "/index.ts",
    "/index.js",
    ".tsx",
    ".ts",
    ".json",
    ".js",
];
function searchFile(vfs, filepath, extensions) {
    for (const ext of ["", ...extensions]) {
        // console.log("Searching...", filepath + ext);
        if (vfs.has(filepath + ext)) {
            return filepath + ext;
        }
    }
}
exports.searchFile = searchFile;
const virtualfs = (vfs) => {
    return {
        name: "virtual-fs",
        resolveId(id, importer) {
            // const exts = extensions ?;
            const normalized = (0, exports.stripSchema)(id);
            // entry point
            if ((0, exports.isFileSchema)(id) && importer == null) {
                return searchFile(vfs, normalized, exports.SEARCH_EXTENSIONS);
            }
            // relative filepath
            if (importer && (0, exports.isFileSchema)(importer) && (0, exports.isRelativePath)(id)) {
                const rawImporter = importer.replace(/^file\:/, "");
                const fullpath = rawImporter
                    ? path.resolve(path.dirname(rawImporter), normalized)
                    : id;
                const reslovedWithExt = searchFile(vfs, fullpath, exports.SEARCH_EXTENSIONS);
                if (reslovedWithExt)
                    return reslovedWithExt;
                this.warn(`[rollup-plugin-virtual-fs] can not resolve id: ${fullpath}`);
            }
        },
        load(id) {
            const real = (0, exports.stripSchema)(id);
            const ret = vfs.get(real);
            if (ret)
                return ret;
            throw new Error(`[virtualFs] ${id} is not found on files`);
        },
    };
};
exports.virtualfs = virtualfs;
// Use rollup to treeshake
const treeshake = async (code, options = {}, rollupOpts = {}) => {
    const inputFile = "/input.js";
    const vfs = new Map(Object.entries({
        [inputFile]: code
    }));
    const build = await (0, rollup_1.rollup)({
        input: inputFile,
        treeshake: true,
        plugins: [(0, exports.virtualfs)(vfs)]
    });
    const { output } = await build.generate({
        format: options?.format ?? "esm",
        compact: options?.minify,
        name: options?.globalName,
        ...Object.assign({}, rollupOpts)
    });
    const content = output[0].code;
    return content?.trim?.(); // Remove unesscary space
};
exports.treeshake = treeshake;
exports.default = exports.treeshake;
