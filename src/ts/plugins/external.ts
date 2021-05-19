import type { Plugin } from 'esbuild';
import { PolyfillMap } from './node-polyfill';

export const PolyfillKeys = Object.keys(PolyfillMap);
export const ExternalPackages = ['chokidar', 'yargs', 'node-fetch', 'fsevents', `worker_threads`, ...PolyfillKeys];
export const EXTERNAL = (): Plugin => {
    return {
        name: 'external-globals',
        setup(build) {
            build.onResolve({ filter: /.*/ }, (args) => {
                if (ExternalPackages.includes(args.path)) {
                    return {
                        path: args.path,
                        namespace: 'external',
                    };
                }
            });

            build.onLoad({ filter: /.*/, namespace: 'external' }, (args) => {
                if (args.path === 'node-fetch')
                    return { contents: 'export default fetch' };

                return {
                    contents: `module.exports = ${args.path}`,
                };
            });
        },
    };
};