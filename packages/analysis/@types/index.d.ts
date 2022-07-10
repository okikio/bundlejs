import type { Metadata } from "./types/metafile";
import type { OutputFile } from "esbuild-wasm";
import { AnalyzerOptions } from "./plugin/index";
/**
 * Generates interactive zoomable charts displaing the size of output files.
 * It's a great way to determine what causes the bundle size to be so large.
 */
export declare const analyze: (metadata: Metadata, outputFiles: OutputFile[], opts?: AnalyzerOptions, logger?: {
    (...data: any[]): void;
    (message?: any, ...optionalParams: any[]): void;
}) => Promise<string>;
