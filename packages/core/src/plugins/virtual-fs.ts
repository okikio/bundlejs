// Based on https://github.com/okikio/bundle/blob/main/src/ts/plugins/virtual-fs.ts
import type { BuildConfig, LocalState, ESBUILD } from "../types.ts";
import type { StateArray } from "../configs/state.ts";

import { inferLoader } from "../utils/loader.ts";
import { getResolvedPath, getFile, type IFileSystem, hasFile } from "../utils/index.ts";
import { TheFileSystem } from "../build.ts";

export const VIRTUAL_FILESYSTEM_NAMESPACE = "virtual-filesystem";
export function VIRTUAL_FS<T = Uint8Array>(state: StateArray<LocalState<T>>, config: BuildConfig): ESBUILD.Plugin {
  const [getState] = state;
  const FileSystem = getState().filesystem!;
  const fs = FileSystem;
  FileSystem?.files().then(x => console.log({ files: x }))

  return {
    name: VIRTUAL_FILESYSTEM_NAMESPACE,
    setup(build) {
      build.onResolve({ filter: /.*/ }, async (args) => {
        const exists = await hasFile<T, IFileSystem<T>>(fs, args.path, args?.pluginData?.importer);

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
        const content = await getFile(fs, resolvedPath, "buffer");

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