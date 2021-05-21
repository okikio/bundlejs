import { Plugin } from 'esbuild';
import { fetchPkg } from './http';
export const CDN_NAMESPACE = 'cdn';
export const CDN = (): Plugin => {
    const cache = new Map();
    return {
        name: CDN_NAMESPACE,
        setup(build) {
            build.onLoad({ namespace: CDN_NAMESPACE, filter: /.*/ }, async (args) => {
                let pathUrl = new URL(args.path, args.pluginData.parentUrl).toString();
                pathUrl = pathUrl.replace(/\/$/, "/index"); // Some packages use "../../" which this is supposed to fix

                let value = cache.get(pathUrl);
                if (!value) value = await fetchPkg(pathUrl);
                cache.set(pathUrl, value);

                let size = cache.size;
                let keys = [...cache.keys()];
                if (size > 10)
                    cache.delete(keys[size - 1]);

                return {
                    contents: value.content,
                    pluginData: {
                        parentUrl: value.url,
                    },
                };
            });

            build.onResolve({ namespace: CDN_NAMESPACE, filter: /.*/ }, async (args) => {
                // console.log(args.path);
                return {
                    namespace: CDN_NAMESPACE,
                    path: args.path,
                    pluginData: args.pluginData,
                };
            });
        },
    };
};