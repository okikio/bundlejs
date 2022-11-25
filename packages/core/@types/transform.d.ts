import type { CommonConfigOptions, ESBUILD } from "./types";
export type TransformConfig = CommonConfigOptions & {
    esbuild?: ESBUILD.TransformOptions;
};
/**
 * Default transform config
 */
export declare const TRANSFORM_CONFIG: TransformConfig;
export declare function transform(input: string | Uint8Array, opts?: TransformConfig): Promise<ESBUILD.TransformResult>;
