import type { CompressConfig, CompressionOptions } from "./types";
import { deepMerge } from "@bundle/utils/utils/deep-object.ts";

/**
 * Default compress config
 */
export const COMPRESS_CONFIG: CompressionOptions = {
  type: "gzip"
};

/**
 * Creates the config needed for the transform, build, and compress functions
 * @param type The type of config needed
 * @param opts The option(s) to use to create the config
 * @returns An object representing the configuration for that type of function
 */
export function createCompressConfig<O extends CompressConfig>(opts?: O): CompressionOptions {
  return deepMerge<CompressionOptions>(structuredClone(COMPRESS_CONFIG), typeof opts === "string" ? { type: opts } : opts);
}