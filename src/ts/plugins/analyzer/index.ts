// Based off of https://github.com/btd/esbuild-visualizer
import type { TemplateType } from "./types/template-types";
import type { ModuleMeta, ModulePart, ModuleTree, ModuleUID, VisualizerData } from "./types/types";
import type { Metadata } from "./types/metafile";
import type { OutputFile } from "esbuild-wasm";
import { AnalyzerOptions, visualizer } from "./plugin/index";

export const analyze = async (metadata: Metadata, outputFiles: OutputFile[], opts: AnalyzerOptions = {}, logger = console.log) => {
  try {
    return await visualizer(metadata, outputFiles, {
      title: "Bundle Analysis",
      ...opts
    });
  } catch (err) {
    let { stack } = (err as Error);
    logger([`[Analyzer] ${err}`, stack], "warn");
    console.warn(err, stack);
  }
};
