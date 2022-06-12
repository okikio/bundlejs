"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VIRTUAL_FS = exports.VIRTUAL_FILESYSTEM_NAMESPACE = void 0;
const loader_js_1 = require("../utils/loader.js");
exports.VIRTUAL_FILESYSTEM_NAMESPACE = 'virtual-filesystem';
const VIRTUAL_FS = (_events, _state, config) => {
    const FileSystem = config.filesystem;
    return {
        name: exports.VIRTUAL_FILESYSTEM_NAMESPACE,
        setup(build) {
            build.onResolve({ filter: /.*/ }, (args) => {
                return {
                    path: args.path,
                    pluginData: args.pluginData ?? {},
                    namespace: exports.VIRTUAL_FILESYSTEM_NAMESPACE
                };
            });
            build.onLoad({ filter: /.*/, namespace: exports.VIRTUAL_FILESYSTEM_NAMESPACE }, async (args) => {
                const resolvedPath = await FileSystem?.resolve?.(args.path, args?.pluginData?.importer);
                const content = await FileSystem?.get?.(args.path, "buffer", args?.pluginData?.importer);
                return {
                    contents: content,
                    pluginData: {
                        importer: resolvedPath,
                    },
                    loader: (0, loader_js_1.inferLoader)(resolvedPath)
                };
            });
        },
    };
};
exports.VIRTUAL_FS = VIRTUAL_FS;
