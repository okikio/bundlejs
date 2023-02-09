// https://deno.land/std@0.142.0/path/mod.ts
// Copyright 2018-2022 the Deno authors. All rights reserved. MIT license.
// Copyright the Browserify authors. MIT License.

/**
 * Ported mostly from https://github.com/browserify/path-browserify/
 * This module is browser compatible.
 * @module
 */

import * as _posix from "./posix";

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

export { SEP, SEP_PATTERN } from "./_constants";
export * from "./_interface";
export * from "./glob";