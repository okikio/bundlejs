// // Copyright 2018-2022 the Deno authors. All rights reserved. MIT license.
// // Copyright the Browserify authors. MIT License.
// // Ported mostly from https://github.com/browserify/path-browserify/
// // This module is browser compatible.

// import * as _posix from "./posix";

// const path = _posix;
// export const posix = _posix;
// export const {
//   basename,
//   delimiter,
//   dirname,
//   extname,
//   format,
//   fromFileUrl,
//   isAbsolute,
//   join,
//   normalize,
//   parse,
//   relative,
//   resolve,
//   sep,
//   toFileUrl,
//   toNamespacedPath,
// } = path;

// export { SEP, SEP_PATTERN } from "./_constants";
// export * from "./_interface";
// export * from "./glob";
import * as _posix from "@std/path/posix";

const path = _posix;
export const posix = _posix;
export const {
  basename,
  delimiter,
  dirname,
  extname,
  format,
  fromFileUrl,
  isAbsolute,
  join,
  normalize,
  parse,
  relative,
  resolve,
  sep,
  toFileUrl,
  toNamespacedPath,
} = path;

export { SEPARATOR as SEP, SEPARATOR_PATTERN as SEP_PATTERN } from "@std/path/constants";
export * from "@std/path/glob-to-regexp";

// export * from "./_interface";
// export * from "@std/path";
// export * from "@std/path/posix";
// export * from "@std/path/posix/extname";
// export * from "@std/path/posix/join";