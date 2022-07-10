let customAlphabet = (alphabet, defaultSize = 21) => {
  return (size = defaultSize) => {
    let id = "";
    let i = size;
    while (i--) {
      id += alphabet[Math.random() * alphabet.length | 0];
    }
    return id;
  };
};
const nanoid = customAlphabet("1234567890abcdef", 4);
const UNIQUE_PREFIX = nanoid();
let COUNTER = 0;
const uniqueId = () => `${UNIQUE_PREFIX}-${COUNTER++}`;
class ModuleMapper {
  constructor(projectRoot) {
    this.projectRoot = projectRoot;
    this.nodeParts = {};
    this.nodeMetas = {};
  }
  trimProjectRootId(moduleId) {
    return moduleId.replace(this.projectRoot, "");
  }
  getModuleUid(moduleId) {
    if (!(moduleId in this.nodeMetas)) {
      this.nodeMetas[moduleId] = {
        uid: uniqueId(),
        meta: { id: this.trimProjectRootId(moduleId), moduleParts: {}, imported: /* @__PURE__ */ new Set(), importedBy: /* @__PURE__ */ new Set() }
      };
    }
    return this.nodeMetas[moduleId].uid;
  }
  getBundleModuleUid(bundleId, moduleId) {
    if (!(moduleId in this.nodeMetas)) {
      this.nodeMetas[moduleId] = {
        uid: uniqueId(),
        meta: { id: this.trimProjectRootId(moduleId), moduleParts: {}, imported: /* @__PURE__ */ new Set(), importedBy: /* @__PURE__ */ new Set() }
      };
    }
    if (!(bundleId in this.nodeMetas[moduleId].meta.moduleParts)) {
      this.nodeMetas[moduleId].meta.moduleParts[bundleId] = uniqueId();
    }
    return this.nodeMetas[moduleId].meta.moduleParts[bundleId];
  }
  setNodePart(bundleId, moduleId, value) {
    const uid = this.getBundleModuleUid(bundleId, moduleId);
    if (uid in this.nodeParts) {
      throw new Error(`Override module: bundle id ${bundleId}, module id ${moduleId}, value ${JSON.stringify(value)}, existing value: ${JSON.stringify(this.nodeParts[uid])}`);
    }
    this.nodeParts[uid] = { ...value, mainUid: this.getModuleUid(moduleId) };
    return uid;
  }
  setNodeMeta(moduleId, value) {
    this.getModuleUid(moduleId);
    this.nodeMetas[moduleId].meta.isEntry = value.isEntry;
    this.nodeMetas[moduleId].meta.isExternal = value.isExternal;
  }
  hasNodePart(bundleId, moduleId) {
    if (!(moduleId in this.nodeMetas)) {
      return false;
    }
    if (!(bundleId in this.nodeMetas[moduleId].meta.moduleParts)) {
      return false;
    }
    if (!(this.nodeMetas[moduleId].meta.moduleParts[bundleId] in this.nodeParts)) {
      return false;
    }
    return true;
  }
  getNodeParts() {
    return this.nodeParts;
  }
  getNodeMetas() {
    const nodeMetas = {};
    for (const { uid, meta } of Object.values(this.nodeMetas)) {
      nodeMetas[uid] = {
        ...meta,
        imported: [...meta.imported].map((rawImport) => {
          const [uid2, dynamic] = rawImport.split(",");
          const importData = { uid: uid2 };
          if (dynamic === "true") {
            importData.dynamic = true;
          }
          return importData;
        }),
        importedBy: [...meta.importedBy].map((rawImport) => {
          const [uid2, dynamic] = rawImport.split(",");
          const importData = { uid: uid2 };
          if (dynamic === "true") {
            importData.dynamic = true;
          }
          return importData;
        })
      };
    }
    return nodeMetas;
  }
  addImportedByLink(targetId, sourceId) {
    const sourceUid = this.getModuleUid(sourceId);
    this.getModuleUid(targetId);
    this.nodeMetas[targetId].meta.importedBy.add(sourceUid);
  }
  addImportedLink(sourceId, targetId, dynamic = false) {
    const targetUid = this.getModuleUid(targetId);
    this.getModuleUid(sourceId);
    this.nodeMetas[sourceId].meta.imported.add(String([targetUid, dynamic]));
  }
}
const isModuleTree = (mod) => "children" in mod;
const addToPath = (moduleId, tree, modulePath, node) => {
  if (modulePath.length === 0) {
    throw new Error(`Error adding node to path ${moduleId}`);
  }
  const [head, ...rest] = modulePath;
  if (rest.length === 0) {
    tree.children.push({ ...node, name: head });
    return;
  } else {
    let newTree = tree.children.find((folder) => folder.name === head && isModuleTree(folder));
    if (!newTree) {
      newTree = { name: head, children: [] };
      tree.children.push(newTree);
    }
    addToPath(moduleId, newTree, rest, node);
    return;
  }
};
const mergeSingleChildTrees = (tree) => {
  if (tree.children.length === 1) {
    const child = tree.children[0];
    const name = `${tree.name}/${child.name}`;
    if (isModuleTree(child)) {
      tree.name = name;
      tree.children = child.children;
      return mergeSingleChildTrees(tree);
    } else {
      return {
        name,
        uid: child.uid
      };
    }
  } else {
    tree.children = tree.children.map((node) => {
      if (isModuleTree(node)) {
        return mergeSingleChildTrees(node);
      } else {
        return node;
      }
    });
    return tree;
  }
};
const buildTree = (bundleId, modules, mapper) => {
  const tree = {
    name: bundleId,
    children: []
  };
  for (const { id, renderedLength, gzipLength, brotliLength } of modules) {
    const bundleModuleUid = mapper.setNodePart(bundleId, id, { renderedLength, gzipLength, brotliLength });
    const trimmedModuleId = mapper.trimProjectRootId(id);
    const pathParts = trimmedModuleId.split(/\\|\//).filter((p) => p !== "");
    addToPath(trimmedModuleId, tree, pathParts, { uid: bundleModuleUid });
  }
  tree.children = tree.children.map((node) => {
    if (isModuleTree(node)) {
      return mergeSingleChildTrees(node);
    } else {
      return node;
    }
  });
  return tree;
};
const mergeTrees = (trees) => {
  const newTree = {
    name: "root",
    children: trees,
    isRoot: true
  };
  return newTree;
};
const addLinks = (startModuleId, getModuleInfo, mapper) => {
  const processedNodes = {};
  const moduleIds = [startModuleId];
  while (moduleIds.length > 0) {
    const moduleId = moduleIds.shift();
    if (processedNodes[moduleId]) {
      continue;
    } else {
      processedNodes[moduleId] = true;
    }
    const moduleInfo = getModuleInfo(moduleId);
    if (!moduleInfo) {
      return;
    }
    if (moduleInfo.isEntry) {
      mapper.setNodeMeta(moduleId, { isEntry: true });
    }
    if (moduleInfo.isExternal) {
      mapper.setNodeMeta(moduleId, { isExternal: true });
    }
    for (const importedId of moduleInfo.importedIds) {
      mapper.addImportedByLink(importedId, moduleId);
      mapper.addImportedLink(moduleId, importedId);
      moduleIds.push(importedId);
    }
    for (const importedId of moduleInfo.dynamicallyImportedIds) {
      mapper.addImportedByLink(importedId, moduleId);
      mapper.addImportedLink(moduleId, importedId, true);
      moduleIds.push(importedId);
    }
  }
};
const htmlEscape = (str) => str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
async function buildHtml({ title, data, template }) {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <title>${htmlEscape(title)}</title>
        <link rel='stylesheet' href='/js/${template}.min.css' />
      </head>
      <body>
        <main></main>
        <script type="module" defer>
          import * as drawChart from "/js/${template}.min.js";
          const data = ${JSON.stringify(data)};
          
          const run = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            const chartNode = document.querySelector("main");
            drawChart.default(chartNode, data, width, height);
          };
      
          window.addEventListener('resize', run);
      
          document.addEventListener('DOMContentLoaded', run);
        <\/script>
      </body>
    </html>
  `;
}
const emptySizeGetter = () => Promise.resolve(0);
const gzipSizeGetter = async (code) => {
  const { gzip, getWASM } = await import("./mod-e46b934e.mjs");
  await getWASM();
  const data = await gzip(code, 9);
  return data.length;
};
const brotliSizeGetter = async (code) => {
  const { compress } = await import("./mod-bd7250c2.mjs");
  const data = await compress(code, code.length, 11);
  return data.length;
};
const visualizer = async (metadata, outputFiles, opts = {}) => {
  const title = opts.title ?? "Esbuild Visualizer";
  const template = (opts.template == true ? "treemap" : opts.template) ?? "treemap";
  const projectRoot = "";
  let outputFilesMap = /* @__PURE__ */ new Map();
  outputFiles.forEach(({ path, contents }) => {
    outputFilesMap.set(path, contents);
  });
  const gzipSize = !!opts.gzipSize;
  const brotliSize = !!opts.brotliSize;
  const gzip = gzipSize ? gzipSizeGetter : emptySizeGetter;
  const brotli = brotliSize ? brotliSizeGetter : emptySizeGetter;
  const ModuleLengths = async ({
    id,
    mod
  }) => {
    const code = outputFilesMap.get(id);
    let faultyCode = code == null || code == void 0 || code?.length == 0;
    let [gzipLength, brotliLength, renderedLength] = await Promise.all(faultyCode ? [0, 0, mod.bytesInOutput] : [gzip(code), brotli(code), code?.length]);
    const result = {
      id,
      gzipLength,
      brotliLength,
      renderedLength
    };
    return result;
  };
  const roots = [];
  const mapper = new ModuleMapper(projectRoot);
  for (const [bundleId, bundle] of Object.entries(metadata.outputs)) {
    const modules = await Promise.all(Object.entries(bundle.inputs).map(([id, mod]) => ModuleLengths({ id, mod })));
    const tree2 = buildTree(bundleId, modules, mapper);
    const code = outputFilesMap.get(bundleId);
    if (tree2.children.length === 0 && code) {
      const bundleSizes = await ModuleLengths({
        id: bundleId,
        mod: { bytesInOutput: code?.length }
      });
      const facadeModuleId = `${bundleId}-unknown`;
      const bundleUid = mapper.setNodePart(bundleId, facadeModuleId, bundleSizes);
      mapper.setNodeMeta(facadeModuleId, { isEntry: true });
      const leaf = { name: bundleId, uid: bundleUid };
      roots.push(leaf);
    } else {
      roots.push(tree2);
    }
  }
  const getModuleInfo = (bundle) => (moduleId) => {
    const input = metadata.inputs?.[moduleId];
    const imports = input?.imports.map((i) => i.path);
    const code = outputFilesMap.get(moduleId);
    return {
      renderedLength: code?.length ?? bundle.inputs?.[moduleId]?.bytesInOutput ?? 0,
      importedIds: imports ?? [],
      dynamicallyImportedIds: [],
      isEntry: bundle.entryPoint === moduleId,
      isExternal: false
    };
  };
  for (const [bundleId, bundle] of Object.entries(metadata.outputs)) {
    if (bundle.entryPoint == null)
      continue;
    addLinks(bundleId, getModuleInfo(bundle), mapper);
  }
  const tree = mergeTrees(roots);
  const data = {
    version: 3,
    tree,
    nodeParts: mapper.getNodeParts(),
    nodeMetas: mapper.getNodeMetas(),
    env: {},
    options: {
      gzip: gzipSize,
      brotli: brotliSize
    }
  };
  const fileContent = await buildHtml({
    title,
    data,
    template
  });
  return fileContent;
};
const analyze = async (metadata, outputFiles, opts = {}, logger = console.log) => {
  try {
    return await visualizer(metadata, outputFiles, {
      title: "Bundle Analysis",
      ...opts
    });
  } catch (err) {
    let { stack } = err;
    logger([`[Analyzer] ${err}`, stack], "warning");
    console.warn(err, stack);
  }
};
export { analyze };
//# sourceMappingURL=index.mjs.map
