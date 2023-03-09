// Based on https://github.com/okikio/bundle/blob/main/src/ts/plugins/virtual-fs.ts
import type { BuildConfig, LocalState } from "../build.ts";
import type { StateArray } from "../configs/state.ts";
import type { ESBUILD } from "../types.ts";

import { inferLoader } from "../utils/loader.ts";
import { getResolvedPath, getFile } from "../util.ts";
export const VIRTUAL_FILESYSTEM_NAMESPACE = "virtual-filesystem";
export const VIRTUAL_FS = (state: StateArray<LocalState>, config: BuildConfig): ESBUILD.Plugin => {
  const [getState] = state;
  const FileSystem = getState().filesystem; 

  return {
    name: VIRTUAL_FILESYSTEM_NAMESPACE,
    setup(build) {
      build.onResolve({ filter: /.*/ }, async (args) => {
        const content = await getFile(FileSystem, args.path, "buffer", args?.pluginData?.importer);
        if (content && content.length > 0) {
          return {
            path: args.path,
            pluginData: args.pluginData ?? {},
            namespace: VIRTUAL_FILESYSTEM_NAMESPACE
          };
        }
      });

      build.onLoad({ filter: /.*/, namespace: VIRTUAL_FILESYSTEM_NAMESPACE }, async (args) => {
        const resolvedPath = getResolvedPath(args.path, args?.pluginData?.importer);
        const content = await getFile(FileSystem, args.path, "buffer", args?.pluginData?.importer);

        return {
          contents: content,
          pluginData: {
            importer: resolvedPath,
          },
          loader: inferLoader(resolvedPath)
        };
      });
    },
  };
};