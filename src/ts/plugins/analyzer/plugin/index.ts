import type { TemplateType } from "../types/template-types";
import type { ModuleLink, ModuleRenderInfo, ModuleTree, ModuleTreeLeaf, VisualizerData } from "../types/types";
import type { Metadata, MetadataOutput } from "../types/metafile";
import type { ModuleInfo } from "../types/rollup";

import { ModuleMapper } from "./module-mapper";
import { addLinks, buildTree, mergeTrees } from "./data";
import { buildHtml } from "./build-stats";

export interface PluginVisualizerOptions {
  title?: string;
  template?: TemplateType;
}

export const visualizer = async (metadata: Metadata, opts: PluginVisualizerOptions = {}): Promise<string> => {
  const title = opts.title ?? "Esbuild Visualizer";

  const template = opts.template ?? "treemap";
  const projectRoot = "";

  const renderedModuleToInfo = (id: string, mod: { bytesInOutput: number }): ModuleRenderInfo => {
    const result = {
      id,
      renderedLength: mod.bytesInOutput,
    };
    return result;
  };

  const roots: Array<ModuleTree | ModuleTreeLeaf> = [];
  const mapper = new ModuleMapper(projectRoot);
  const links: ModuleLink[] = [];

  // collect trees
  for (const [bundleId, bundle] of Object.entries(metadata.outputs)) {
    const modules = Object.entries(bundle.inputs).map(([id, mod]) => renderedModuleToInfo(id, mod));

    const tree = buildTree(bundleId, modules, mapper);

    roots.push(tree);
  }

  const getModuleInfo = (bundle: MetadataOutput) => (moduleId: string): ModuleInfo => {
    const input = metadata.inputs?.[moduleId];

    const imports = input?.imports.map((i) => i.path);

    return {
      renderedLength: bundle.inputs?.[moduleId]?.bytesInOutput ?? 0,
      importedIds: imports ?? [],
      dynamicallyImportedIds: [],
      isEntry: bundle.entryPoint === moduleId,
      isExternal: false,
    };
  };

  for (const [bundleId, bundle] of Object.entries(metadata.outputs)) {
    if (bundle.entryPoint == null) continue;

    addLinks(bundleId, bundle.entryPoint, getModuleInfo(bundle), links, mapper);
  }

  const tree = mergeTrees(roots);

  const data: VisualizerData = {
    version: 2.0,
    tree,
    nodes: mapper.getNodes(),
    nodeParts: mapper.getNodeParts(),
    links,
    env: {},
    options: {
      gzip: false,
      brotli: false,
      sourcemap: false,
    },
  };

  const fileContent: string = await buildHtml({
    title,
    data,
    template,
  });

  return fileContent;
};
