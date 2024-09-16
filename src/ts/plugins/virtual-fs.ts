// Based on https://github.com/okikio/bundle/blob/main/src/ts/plugins/virtual-fs.ts
import type { Plugin, OnResolveArgs } from 'esbuild';
import { getResolvedPath, getFile } from '../util/filesystem';
import { inferLoader } from '../util/loader';

export async function VIRTUAL_FS_RESOLVE(args: OnResolveArgs) {
  const resolvedPath = getResolvedPath(args.path, args?.pluginData?.importer);
  const content = getFile(args.path, "string", args?.pluginData?.importer);
  console.log({
    // resolvedPath,
    importer: args?.pluginData?.importer,
    path: args.path,
    content
  })

  if (content && content.length > 0) {
    return {
      path: args.path,
      pluginData: args.pluginData ?? {},
      namespace: VIRTUAL_FILESYSTEM_NAMESPACE
    };
  }
}

export const VIRTUAL_FILESYSTEM_NAMESPACE = "virtual-filesystem";
export const VIRTUAL_FS = (): Plugin => {
  return {
    name: VIRTUAL_FILESYSTEM_NAMESPACE,
    setup(build) {
      build.onResolve({ filter: /.*/ }, VIRTUAL_FS_RESOLVE);

      build.onLoad({ filter: /.*/, namespace: VIRTUAL_FILESYSTEM_NAMESPACE }, async (args) => {
        const resolvedPath = getResolvedPath(args.path, args?.pluginData?.importer);
        const content = getFile(args.path, "string", args?.pluginData?.importer);

        return {
          contents: content,
          pluginData: Object.assign({}, args.pluginData, {
            importer: resolvedPath,
          }),
          loader: inferLoader(resolvedPath)
        };
      });
    },
  };
};