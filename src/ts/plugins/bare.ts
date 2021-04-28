import { Plugin } from 'esbuild';
import { CDN_NAMESPACE } from './cdn';
import path from 'path';

export const HOST = 'https://cdn.skypack.dev/';
export const BARE = (): Plugin => {
    return {
        name: 'bare',
        setup(build) {
            build.onResolve({ filter: /.*/ }, (args) => {
                if (/^(?!\.).*/.test(args.path) && !path.isAbsolute(args.path)) {
                    return {
                        path: args.path,
                        namespace: CDN_NAMESPACE,
                        pluginData: {
                            parentUrl: HOST,
                        },
                    };
                }
            });
        },
    };
};