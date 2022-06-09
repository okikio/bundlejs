/**
 * Ported mostly from https://github.com/browserify/path-browserify/
 * This module is browser compatible.
 * @module
 */
import * as _posix from "./posix";
export declare const posix: typeof _posix;
export declare const basename: typeof _posix.basename, delimiter: string, dirname: typeof _posix.dirname, extname: typeof _posix.extname, format: typeof _posix.format, fromFileUrl: typeof _posix.fromFileUrl, isAbsolute: typeof _posix.isAbsolute, join: typeof _posix.join, normalize: typeof _posix.normalize, parse: typeof _posix.parse, relative: typeof _posix.relative, resolve: typeof _posix.resolve, sep: string, toFileUrl: typeof _posix.toFileUrl, toNamespacedPath: typeof _posix.toNamespacedPath;
export { SEP, SEP_PATTERN } from "./_constants";
export * from "./_interface";
export * from "./glob";
