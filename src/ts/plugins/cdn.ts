import { Plugin } from 'esbuild';
import { fetchPkg } from './http';
export const CDN_NAMESPACE = 'cdn';
export const CDN = (): Plugin => {
    const cache: Record<string, { url: string; content: string }> = {};
    return {
        name: CDN_NAMESPACE,
        setup(build) {
            build.onLoad({ namespace: CDN_NAMESPACE, filter: /.*/ }, async (args) => {
                const pathUrl = new URL(args.path, args.pluginData.parentUrl).toString();
                let value = cache[pathUrl];
                if (!value) value = await fetchPkg(pathUrl);
                cache[pathUrl] = value;
                return {
                    contents: value.content,
                    pluginData: {
                        parentUrl: value.url,
                    },
                };
            });

            build.onResolve({ namespace: CDN_NAMESPACE, filter: /.*/ }, async (args) => {
                return {
                    namespace: CDN_NAMESPACE,
                    path: args.path,
                    pluginData: args.pluginData,
                };
            });
        },
    };
};