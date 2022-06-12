// Based on https://github.com/okikio/bundle/blob/main/src/ts/plugins/virtual-fs.ts
import type { Plugin } from 'esbuild-wasm';
import type { BundleConfigOptions } from '../configs/options.js';
import type { EVENTS } from "../configs/events.js";
import type { STATE } from '../configs/state.js';

import { inferLoader } from "../utils/loader.js";
export const VIRTUAL_FILESYSTEM_NAMESPACE = 'virtual-filesystem';
export const VIRTUAL_FS = (_events: typeof EVENTS, _state: typeof STATE, config: BundleConfigOptions): Plugin => {
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
        const resolvedPath = await FileSystem?.resolve?.(args.path, args?.pluginData?.importer);
        const content = await FileSystem?.get?.(args.path, "buffer", args?.pluginData?.importer);

        return {
          contents: content,
          pluginData: {
            importer: resolvedPath,
          },
          loader: inferLoader(resolvedPath as string)
        };
      });
    },
  };
};