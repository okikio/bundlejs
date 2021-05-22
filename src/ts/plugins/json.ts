// Based on https://github.com/hardfist/neo-tools/blob/main/packages/bundler/src/plugins/http.ts
import { Plugin } from 'esbuild';
import { CDN_NAMESPACE } from './cdn';
import { fetchPkg } from './http';

export const JSON_NAMESPACE = 'json-file';
export const JSON_PLUGIN = (): Plugin => {
    const cache = new Map();
    return {
        name: 'json',
        setup(build) {
            build.onLoad({ namespace: CDN_NAMESPACE, filter: /\.json$/ }, async (args) => {
                const pathUrl = new URL(args.path, args.pluginData.parentUrl).toString();
                let value = cache.get(pathUrl);
                if (!value) value = await fetchPkg(pathUrl);
                cache.set(pathUrl, value);

                let size = cache.size;
                let keys = [...cache.keys()];
                if (size > 10)
                    cache.delete(keys[size - 1]);

                return {
                    contents: `
                    export const value = ${value.content};
                    export default value;`,
                    pluginData: {
                        parentUrl: value.url,
                    },
                };
            });
        }
    };
};