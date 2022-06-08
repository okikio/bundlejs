import type { Metadata } from "./types/metafile";
import type { OutputFile } from "esbuild-wasm";
import { AnalyzerOptions } from "./plugin/index";
export declare const analyze: (metadata: Metadata, outputFiles: OutputFile[], opts?: AnalyzerOptions, logger?: {
    (...data: any[]): void;
    (...data: any[]): void;
}) => Promise<string>;
