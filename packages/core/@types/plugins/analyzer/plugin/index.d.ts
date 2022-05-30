import type { TemplateType } from "../types/template-types";
import type { Metadata } from "../types/metafile";
import type { OutputFile } from "esbuild-wasm";
/**
 * Analyzer options
 */
export interface AnalyzerOptions {
    title?: string;
    template?: TemplateType | boolean;
    gzipSize?: boolean;
    brotliSize?: boolean;
}
export declare const visualizer: (metadata: Metadata, outputFiles: OutputFile[], opts?: AnalyzerOptions) => Promise<string>;
