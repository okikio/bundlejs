import type { BuildConfig } from "../build";
import type { TransformConfig } from "../transform";
import type { CompressConfig, CompressionOptions } from "../compress";

import { BUILD_CONFIG } from "../build";
import { TRANSFORM_CONFIG } from "../transform";
import { COMPRESS_CONFIG } from "../compress";

import { deepAssign } from "../utils/deep-equal";

/**
 * Creates the config needed for the transform, build, and compress functions
 * @param type The type of config needed
 * @param opts The option(s) to use to create the config
 * @returns An object representing the configuration for that type of function
 */
export function createConfig<T extends "build", O extends BuildConfig>(type: T, opts?: O): BuildConfig;
export function createConfig<T extends "compress", O extends CompressConfig>(type: T, opts?: O): BuildConfig;
export function createConfig<T extends "transform", O extends TransformConfig>(type: T, opts?: O): TransformConfig;
export function createConfig<T extends "transform" | "build" | "compress", O extends TransformConfig | BuildConfig | CompressConfig>(type: T, opts?: O) {
  if (type == "transform") {
    return deepAssign({}, TRANSFORM_CONFIG, opts) as TransformConfig;
  } else if (type == "compress") {
    return deepAssign({}, BUILD_CONFIG, opts) as BuildConfig;
  } else {
    return deepAssign({}, COMPRESS_CONFIG, typeof opts == "string" ? { type: opts } : opts) as CompressionOptions;
  }
}