import type { Plugin } from 'esbuild';
export const resolve = (id: string) => {
    return `https://cdn.skypack.dev/${id}`
};

export const NODE = (): Plugin => {
    return {
        name: 'node-polyfill',
        setup(build) {
            build.onResolve({ filter: /.*/ }, async (args) => {
                // Remap builtins
                const polyfillMap = {
                    url: resolve('url/'),
                    assert: resolve('assert/'),
                    buffer: resolve('buffer/'),
                    fs: resolve('memfs'),
                    path: resolve('path-browserify'),
                    stream: resolve('stream-browserify'),
                    os: resolve('os-browserify/browser'),
                    crypto: resolve('crypto-browserify'),
                    vm: resolve('vm-browserify'),
                    tty: resolve('tty-browserify'),
                };

                if (Object.keys(polyfillMap).includes(args.path)) {
                    return {
                        path: polyfillMap[args.path as 'os'],
                    };
                }
            });
        },
    };
};