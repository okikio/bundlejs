// Based on https://github.com/okikio/bundle/blob/main/src/ts/plugins/virtual-fs.ts
import type { BuildConfig, LocalState } from "../build";
import type { StateArray } from "../configs/state";
import type { EVENTS } from "../configs/events";
import type { ESBUILD } from "../types";

import { inferLoader } from "../utils/loader";
import { getResolvedPath, getFile } from "../util";
export const VIRTUAL_FILESYSTEM_NAMESPACE = "virtual-filesystem";
export const VIRTUAL_FS = (events: typeof EVENTS, state: StateArray<LocalState>, config: BuildConfig): ESBUILD.Plugin => {
  const [getState] = state;
  const FileSystem = getState().filesystem; 

  return {
    name: VIRTUAL_FILESYSTEM_NAMESPACE,
    setup(build) {
      build.onResolve({ filter: /.*/ }, (args) => {
        return {
          path: args.path,
          pluginData: args.pluginData ?? {},
          namespace: VIRTUAL_FILESYSTEM_NAMESPACE
        };
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