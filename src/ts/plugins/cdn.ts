import { extname } from "path";
import { fetchPkg } from './http';

import type { Plugin } from 'esbuild';
import type { OnLoadArgs, OnLoadResult } from "esbuild-wasm";

export const CDN_NAMESPACE = 'cdn';
export const CDN = (cache: Map<any, any>): Plugin => {
    return {
        name: CDN_NAMESPACE,
        setup(build) {
            build.onResolve({ namespace: CDN_NAMESPACE, filter: /.*/ }, async (args: OnLoadArgs) => {
                return {
                    namespace: CDN_NAMESPACE,
                    path: args.path,
                    pluginData: args.pluginData
                };
            });

            build.onLoad({ namespace: CDN_NAMESPACE, filter: /.*/ }, async (args: OnLoadArgs) => {
                let pathUrl = new URL(args.path, args.pluginData.parentUrl).toString();
                pathUrl = pathUrl.replace(/\/$/, "/index"); // Some packages use "../../" which this is supposed to fix
        
                let parentFileExtention = extname(args.pluginData.parentUrl);
                let fileExtention = extname(pathUrl);
        
                let parentPathIsTS = (fileExtention == "" && /(js|ts)x?/.test(parentFileExtention));
                let pathIsTS = /(js|ts)x?/.test(fileExtention);
                if (parentPathIsTS) {
                    pathUrl += parentFileExtention;
                }
        
                let value;
                if (!cache.has(pathUrl)) {
                    value = await fetchPkg(pathUrl);
                    cache.set(pathUrl, value);
                } else value = cache.get(pathUrl);
        
                return Object.assign({
                    contents: value.content,
                    pluginData: {
                        parentUrl: value.url,
                    },
                }, pathIsTS || parentPathIsTS ? { loader: "ts" } : null) as OnLoadResult;
            });
        },
    };
};