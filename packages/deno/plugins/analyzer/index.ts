// Based off of https://github.com/btd/esbuild-visualizer
import type { TemplateType } from "./types/template-types.ts";
import type { ModuleMeta, ModulePart, ModuleTree, ModuleUID, VisualizerData } from "./types/types.d.ts";
import type { Metadata } from "./types/metafile.d.ts";
import type { OutputFile } from "esbuild-wasm";
import { AnalyzerOptions, visualizer } from "./plugin/index.ts";

export const analyze = async (metadata: Metadata, outputFiles: OutputFile[], opts: AnalyzerOptions = {}, logger = console.log) => {
  try {
    return await visualizer(metadata, outputFiles, {
      title: "Bundle Analysis",
      ...opts
    });
  } catch (err) {
    let { stack } = (err as Error);
    logger([`[Analyzer] ${err}`, stack], "warning");
    console.warn(err, stack);
  }
};
