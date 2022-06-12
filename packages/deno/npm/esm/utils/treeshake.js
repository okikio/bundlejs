import { rollup } from "rollup";
import * as path from "./path.js";
export const isFileSchema = (id) => id.startsWith("file://") || id.startsWith("/");
export const isRelativePath = (id) => stripSchema(id).startsWith(".");
export const stripSchema = (id) => id.replace(/^file\:(\/\/)?/, "");
export const SEARCH_EXTENSIONS = [
    "/index.tsx",
    "/index.ts",
    "/index.js",
    ".tsx",
    ".ts",
    ".json",
    ".js",
];
export function searchFile(vfs, filepath, extensions) {
    for (const ext of ["", ...extensions]) {
        // console.log("Searching...", filepath + ext);
        if (vfs.has(filepath + ext)) {
            return filepath + ext;
        }
    }
}
export const virtualfs = (vfs) => {
    return {
        name: "virtual-fs",
        resolveId(id, importer) {
            // const exts = extensions ?;
            const normalized = stripSchema(id);
            // entry point
            if (isFileSchema(id) && importer == null) {
                return searchFile(vfs, normalized, SEARCH_EXTENSIONS);
            }
            // relative filepath
            if (importer && isFileSchema(importer) && isRelativePath(id)) {
                const rawImporter = importer.replace(/^file\:/, "");
                const fullpath = rawImporter
                    ? path.resolve(path.dirname(rawImporter), normalized)
                    : id;
                const reslovedWithExt = searchFile(vfs, fullpath, SEARCH_EXTENSIONS);
                if (reslovedWithExt)
                    return reslovedWithExt;
                this.warn(`[rollup-plugin-virtual-fs] can not resolve id: ${fullpath}`);
            }
        },
        load(id) {
            const real = stripSchema(id);
            const ret = vfs.get(real);
            if (ret)
                return ret;
            throw new Error(`[virtualFs] ${id} is not found on files`);
        },
    };
};
// Use rollup to treeshake
export const treeshake = async (code, options = {}, rollupOpts = {}) => {
    const inputFile = "/input.js";
    const vfs = new Map(Object.entries({
        [inputFile]: code
    }));
    const build = await rollup({
        input: inputFile,
        treeshake: true,
        plugins: [virtualfs(vfs)]
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
export default treeshake;
