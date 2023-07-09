import type { BuildConfig } from "../build.ts";
import type { TransformConfig } from "../transform.ts";
import type { CompressConfig, CompressionOptions } from "../compress.ts";

import { BUILD_CONFIG } from "../build.ts";
import { TRANSFORM_CONFIG } from "../transform.ts";
import { COMPRESS_CONFIG } from "../compress.ts";

import { deepAssign } from "../utils/deep-equal.ts";

/**
 * Creates the config needed for the transform, build, and compress functions
 * @param type The type of config needed
 * @param opts The option(s) to use to create the config
 * @returns An object representing the configuration for that type of function
 */
export function createConfig<T extends "build", O extends BuildConfig>(type: T, opts?: O): BuildConfig;
export function createConfig<T extends "compress", O extends CompressConfig>(type: T, opts?: O): CompressionOptions;
export function createConfig<T extends "transform", O extends TransformConfig>(type: T, opts?: O): TransformConfig;
export function createConfig<T extends "context", O extends TransformConfig>(type: T, opts?: O): TransformConfig;
export function createConfig<T extends "transform" | "build" | "compress" | "context", O extends TransformConfig | BuildConfig | CompressConfig>(type: T, opts?: O) {
  if (type === "transform") {
    return deepAssign({}, TRANSFORM_CONFIG, opts) as TransformConfig;
  } else if (type === "compress") {
    return deepAssign({}, COMPRESS_CONFIG, typeof opts === "string" ? { type: opts } : opts) as CompressionOptions;
  } else {
    return deepAssign({}, BUILD_CONFIG, opts) as BuildConfig;
  }
}