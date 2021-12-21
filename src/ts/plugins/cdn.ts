
import type { Plugin } from 'esbuild';

import { fetchPkg } from './http';
import { inferLoader, isBareImport, getCDNHost } from '../util/loader';

export const CDN_NAMESPACE = 'cdn-url';
export const CDN = (): Plugin => {
    return {
        name: CDN_NAMESPACE,
        setup(build) {
            // Resolve bare imports to the CDN required using different URL schemes
            build.onResolve({ filter: /.*/ }, (args) => {
                if (isBareImport(args.path)) {
                    let { host, argPath } = getCDNHost(args.path);
                    return {
                        namespace: CDN_NAMESPACE,
                        path: argPath,
                        pluginData: {
                            parentUrl: host,
                        },
                    };
                }
            });

            // Pass on the info from the bare import
            build.onResolve({ namespace: CDN_NAMESPACE, filter: /.*/ }, async (args) => {
                return {
                    path: args.path,
                    namespace: CDN_NAMESPACE,
                    pluginData: args.pluginData,
                };
            });

            // On load 
            build.onLoad({ namespace: CDN_NAMESPACE, filter: /.*/ }, async (args) => {
                let pathUrl = new URL(args.path, args.pluginData.parentUrl).toString();
                pathUrl = pathUrl.replace(/\/$/, "/index"); // Some packages use "../../" which this is supposed to fix

                const { content, url } = await fetchPkg(pathUrl);
                return Object.assign({
                    contents: content,
                    pluginData: {
                        parentUrl: url,
                    },
                    loader: inferLoader(pathUrl)
                });
            });
        },
    };
};
