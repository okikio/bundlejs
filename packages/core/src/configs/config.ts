import type { BuildConfig } from "../types.ts";
import type { TransformConfig } from "../transform.ts";

import { BUILD_CONFIG } from "../build.ts";
import { TRANSFORM_CONFIG } from "../transform.ts";

import { deepMerge } from "@bundle/utils/utils/deep-object.ts";

/**
 * Creates the config needed for the transform, build, and context functions
 * @param type The type of config needed
 * @param opts The option(s) to use to create the config
 * @returns An object representing the configuration for that type of function
 */
export function createConfig<T extends "build", O extends BuildConfig>(type: T, opts?: O): BuildConfig;
export function createConfig<T extends "transform", O extends TransformConfig>(type: T, opts?: O): TransformConfig;
export function createConfig<T extends "context", O extends BuildConfig>(type: T, opts?: O): BuildConfig;
export function createConfig<T extends "transform" | "build" | "context", O extends TransformConfig | BuildConfig>(type: T, opts?: O) {
  if (type === "transform") {
    return deepMerge<TransformConfig>(structuredClone(TRANSFORM_CONFIG), opts as TransformConfig);
  } else {
    return deepMerge<BuildConfig>(structuredClone(BUILD_CONFIG), opts as BuildConfig);
  }
}