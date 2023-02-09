// Based on https://github.com/okikio/bundle/blob/main/src/ts/plugins/virtual-fs.ts
import type { Plugin } from 'esbuild-wasm';
import type { BundleConfigOptions } from '../configs/options';
import type { EVENTS } from "../configs/events";
import type { STATE } from '../configs/state';

import { inferLoader } from "../utils/loader";
export const VIRTUAL_FILESYSTEM_NAMESPACE = 'virtual-filesystem';
export const VIRTUAL_FS = (events: typeof EVENTS, state: typeof STATE, config: BundleConfigOptions): Plugin => {
  const FileSystem = config.filesystem;

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
        let resolvedPath = await FileSystem.resolve(args.path, args?.pluginData?.importer);
        let content = await FileSystem.get(args.path, "buffer", args?.pluginData?.importer);
        console.log({ resolvedPath, content })

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