// Based on https://github.com/okikio/bundle/blob/main/src/ts/plugins/virtual-fs.ts
import type { LocalState, ESBUILD } from "../types.ts";
import type { IFileSystem } from "../utils/filesystem.ts";
import type { Context } from "../context/context.ts";

import { getResolvedPath, getFile, hasFile } from "../utils/filesystem.ts";
import { fromContext } from "../context/context.ts";
import { inferLoader } from "../utils/loader.ts";

export const VIRTUAL_FILESYSTEM_NAMESPACE = "virtual-filesystem";
export function VirtualFileSystemPlugin<T = Uint8Array>(StateContext: Context<LocalState<T>>): ESBUILD.Plugin {
  const FileSystem = fromContext("filesystem", StateContext)!;

  return {
    name: VIRTUAL_FILESYSTEM_NAMESPACE,
    setup(build) {
      build.onResolve({ filter: /.*/ }, async (args) => {
        const exists = await hasFile<T, IFileSystem<T>>(FileSystem, args.path, args?.pluginData?.importer);

        if (exists) {
          return {
            path: args.path,
            pluginData: args.pluginData ?? {},
            namespace: VIRTUAL_FILESYSTEM_NAMESPACE
          };
        }
      });

      build.onLoad({ filter: /.*/, namespace: VIRTUAL_FILESYSTEM_NAMESPACE }, async (args) => {
        const resolvedPath = getResolvedPath(args.path, args?.pluginData?.importer);
        const content = await getFile(FileSystem, resolvedPath, "buffer");

        if (content && content?.length > 0) {
          return {
            contents: content,
            pluginData: {
              importer: resolvedPath,
            },
            loader: inferLoader(resolvedPath)
          };
        }
      });
    },
  };
};