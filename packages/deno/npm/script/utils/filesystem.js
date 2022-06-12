"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setFile = exports.getFile = exports.getResolvedPath = exports.FileSystem = void 0;
const path_js_1 = require("./path.js");
const encode_decode_js_1 = require("./encode-decode.js");
/** Virtual Filesystem Storage */
exports.FileSystem = new Map();
/**
 * Resolves path to a file in the virtual file system storage
 *
 * @param path the relative or absolute path to resolve to
 * @param importer an absolute path to use to determine relative file paths
 * @returns resolved final path
 */
const getResolvedPath = (path, importer) => {
    let resolvedPath = path;
    if (importer && path.startsWith('.'))
        resolvedPath = (0, path_js_1.resolve)((0, path_js_1.dirname)(importer), path);
    if (exports.FileSystem.has(resolvedPath))
        return resolvedPath;
    throw `File "${resolvedPath}" does not exist`;
};
exports.getResolvedPath = getResolvedPath;
/**
 * Retrevies file from virtual file system storage in either string or uint8array buffer format
 *
 * @param path path of file in virtual file system storage
 * @param type format to retrieve file in, buffer and string are the 2 option available
 * @param importer an absolute path to use to determine a relative file path
 * @returns file from file system storage in either string format or as a Uint8Array buffer
 */
const getFile = (path, type = "buffer", importer) => {
    const resolvedPath = (0, exports.getResolvedPath)(path, importer);
    if (exports.FileSystem.has(resolvedPath)) {
        const file = exports.FileSystem.get(resolvedPath);
        return type == "string" ? (0, encode_decode_js_1.decode)(file) : file;
    }
};
exports.getFile = getFile;
/**
 * Writes file to filesystem in either string or uint8array buffer format
 *
 * @param path path of file in virtual file system storage
 * @param content contents of file to store, you can store buffers and/or strings
 * @param importer an absolute path to use to determine a relative file path
 */
const setFile = (path, content, importer) => {
    let resolvedPath = path;
    if (importer && path.startsWith('.'))
        resolvedPath = (0, path_js_1.resolve)((0, path_js_1.dirname)(importer), path);
    try {
        exports.FileSystem.set(resolvedPath, content instanceof Uint8Array ? content : (0, encode_decode_js_1.encode)(content));
    }
    catch (_e) {
        throw `Error occurred while writing to "${resolvedPath}"`;
    }
};
exports.setFile = setFile;
