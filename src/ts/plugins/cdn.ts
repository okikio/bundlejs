import { extname } from "path";
import { fetchPkg } from './http';

import type { Plugin } from 'esbuild';
import type { OnLoadArgs, OnLoadResult } from "esbuild-wasm";

export const CDN_NAMESPACE = 'cdn';
export const CDN = (): Plugin => {
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

                let parentFileExtention = extname(args.pluginData.parentUrl).replace(/^./, "");
                let fileExtention = extname(pathUrl).replace(/^./, "");

                let loader = undefined;
                switch (fileExtention) {
                    case "js":
                    case "ts":
                        loader = "ts";
                        break;
                    
                    case "jsx":
                    case "tsx":
                        loader = "tsx";
                        break;
                    
                    case "css":
                    case "scss":
                        loader = "css";
                        break;
                    
                    case "png":
                    case "jpeg":
                    case "ttf":
                        loader = "file";
                        break;
                    
                    case "svg":
                    case "html":
                    case "txt":
                        loader = "text";
                        break;
                }

                let parentPathIsTS = (fileExtention == "" && /(js|ts)x?/.test(parentFileExtention));
                let pathIsTS = /(js|ts)x?/.test(fileExtention);
                if (parentPathIsTS) {
                    pathUrl += `.` + parentFileExtention;
                }

                const { content, url } = await fetchPkg(pathUrl);
                return Object.assign({
                    contents: content,
                    pluginData: {
                        parentUrl: url,
                    },
                    loader: pathIsTS || parentPathIsTS ? "ts" : loader
                }) as OnLoadResult;
            });
        },
    };
};
