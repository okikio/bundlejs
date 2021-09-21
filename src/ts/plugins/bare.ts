import { CDN_NAMESPACE } from './cdn';
import path from 'path';

import type { Plugin } from 'esbuild';

export const HOST = 'https://cdn.skypack.dev/';
export const BARE = (): Plugin => {
    return {
        name: 'bare',
        setup(build) {
            build.onResolve({ filter: /.*/ }, (args) => {
                if (/^(?!\.).*/.test(args.path) && !path.isAbsolute(args.path)) {
                    let argPath = args.path.replace(/^(skypack|esm|esm\.sh|unpkg|jsdelivr|esm\.run)\:/, "");
                    let host = HOST;
                    if (/^skypack\:/.test(args.path)) {
                        host = `https://cdn.skypack.dev/`;
                    } else if (/^(esm\.sh|esm)\:/.test(args.path)) {
                        host = `https://cdn.esm.sh/`;
                    } else if (/^unpkg\:/.test(args.path)) {
                        host = `https://unpkg.com/`;
                    } else if (/^(jsdelivr|esm\.run)\:/.test(args.path)) {
                        host = `https://cdn.jsdelivr.net/npm/`;
                    }
                    
                    // typescript will only work on esm.sh
                    else if (/^typescript/.test(args.path)) {
                        host = `https://unpkg.com/`;
                    }

                    return {
                        path: argPath,
                        namespace: CDN_NAMESPACE,
                        pluginData: {
                            parentUrl: host,
                        },
                    };
                }
            });
        },
    };
};