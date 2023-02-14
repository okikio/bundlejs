import type { BuildConfig } from "../build.ts";
import type { TransformConfig } from "../transform.ts";
import type { CompressConfig, CompressionOptions } from "../compress.ts";
/**
 * Creates the config needed for the transform, build, and compress functions
 * @param type The type of config needed
 * @param opts The option(s) to use to create the config
 * @returns An object representing the configuration for that type of function
 */
export declare function createConfig<T extends "build", O extends BuildConfig>(type: T, opts?: O): BuildConfig;
export declare function createConfig<T extends "compress", O extends CompressConfig>(type: T, opts?: O): CompressionOptions;
export declare function createConfig<T extends "transform", O extends TransformConfig>(type: T, opts?: O): TransformConfig;
