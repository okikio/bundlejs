// Based off of https://github.com/btd/esbuild-visualizer
import type { TemplateType } from "./types/template-types";
import type { Metadata } from "./types/metafile";
import { visualizer } from "./plugin/index";

export const analyze = async (metadata: Metadata, template: TemplateType = "treemap", logger = console.log) => {
  try {
    return await visualizer(metadata, {
      title: "Bundle Analysis",
      template,
    });
  } catch (err) {
    let { stack } = (err as Error);
    logger([`[Analyzer] ${err}`, stack], "warn");
    console.warn(err, stack);
  }
};
