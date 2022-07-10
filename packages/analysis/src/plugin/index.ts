import type { TemplateType } from "../types/template-types";
import type { ModuleLengths, ModuleTree, ModuleTreeLeaf, VisualizerData } from "../types/types";
import type { Metadata, MetadataOutput } from "../types/metafile";
import type { ModuleInfo } from "../types/rollup";
import type { OutputFile } from "esbuild-wasm";

import { ModuleMapper } from "./module-mapper";
import { addLinks, buildTree, mergeTrees } from "./data";
import { buildHtml } from "./build-stats";

import { gzipSizeGetter, brotliSizeGetter, emptySizeGetter } from "./compress";

/**
 * Analyzer options
 */
export interface AnalyzerOptions {
  title?: string;
  template?: TemplateType | boolean;
  gzipSize?: boolean;
  brotliSize?: boolean;
}

export const visualizer = async (metadata: Metadata, outputFiles: OutputFile[], opts: AnalyzerOptions = {}): Promise<string> => {
  const title = opts.title ?? "Esbuild Visualizer";
  const template = (opts.template == true ? "treemap" : opts.template as TemplateType) ?? "treemap";
  const projectRoot = "";

  let outputFilesMap = new Map<string, Uint8Array>();
  outputFiles.forEach(({ path, contents }) => {
    outputFilesMap.set(path, contents);
  });
  // console.log(metadata, outputFiles, Array.from(outputFilesMap.entries()));

  const gzipSize = !!opts.gzipSize;
  const brotliSize = !!opts.brotliSize;
  const gzip = gzipSize ? gzipSizeGetter : emptySizeGetter;
  const brotli = brotliSize ? brotliSizeGetter : emptySizeGetter;

  const ModuleLengths = async ({
    id,
    mod
  }: {
    id: string;
    mod: { bytesInOutput: number };
  }): Promise<ModuleLengths & { id: string }> => {
    const code = outputFilesMap.get(id);
    let faultyCode = code == null || code == undefined || code?.length == 0;
    let [gzipLength, brotliLength, renderedLength] = await Promise.all(faultyCode ? [0, 0, mod.bytesInOutput] : [gzip(code), brotli(code), code?.length])
    const result = {
      id,
      gzipLength,
      brotliLength,
      renderedLength
    };
    return result;
  };

  const roots: Array<ModuleTree | ModuleTreeLeaf> = [];
  const mapper = new ModuleMapper(projectRoot);

  // collect trees
  for (const [bundleId, bundle] of Object.entries(metadata.outputs)) {
    const modules = await Promise.all(
      Object
        .entries(bundle.inputs)
        .map(([id, mod]) => ModuleLengths({ id, mod }))
    );
    const tree = buildTree(bundleId, modules, mapper);

    const code = outputFilesMap.get(bundleId);
    if (tree.children.length === 0 && code) {
      const bundleSizes = await ModuleLengths({
        id: bundleId,
        mod: { bytesInOutput: code?.length }
      });

      const facadeModuleId = `${bundleId}-unknown`;
      const bundleUid = mapper.setNodePart(bundleId, facadeModuleId, bundleSizes);
      mapper.setNodeMeta(facadeModuleId, { isEntry: true });
      const leaf: ModuleTreeLeaf = { name: bundleId, uid: bundleUid };
      roots.push(leaf);
    } else {
      roots.push(tree);
    }
  }

  const getModuleInfo = (bundle: MetadataOutput) => (moduleId: string): ModuleInfo => {
    const input = metadata.inputs?.[moduleId];

    const imports = input?.imports.map((i) => i.path);

    const code = outputFilesMap.get(moduleId);

    return {
      renderedLength: code?.length ?? bundle.inputs?.[moduleId]?.bytesInOutput ?? 0,
      importedIds: imports ?? [],
      dynamicallyImportedIds: [],
      isEntry: bundle.entryPoint === moduleId,
      isExternal: false,
    };
  };

  for (const [bundleId, bundle] of Object.entries(metadata.outputs)) {
    if (bundle.entryPoint == null) continue;

    addLinks(bundleId, getModuleInfo(bundle), mapper);
  }

  const tree = mergeTrees(roots);

  const data: VisualizerData = {
    version: 3.0,
    tree,
    nodeParts: mapper.getNodeParts(),
    nodeMetas: mapper.getNodeMetas(),
    env: {},
    options: {
      gzip: gzipSize,
      brotli: brotliSize
    },
  };

  const fileContent: string = await buildHtml({
    title,
    data,
    template,
  });

  return fileContent;
};
