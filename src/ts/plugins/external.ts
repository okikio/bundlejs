import type { Plugin } from 'esbuild';
import { PolyfillMap } from './node-polyfill';

export const PolyfillKeys = Object.keys(PolyfillMap);
export const DeprecatedAPIs = ["v8/tools/codemap", "v8/tools/consarray", "v8/tools/csvparser", "v8/tools/logreader", "v8/tools/profile_view", "v8/tools/profile", "v8/tools/SourceMap", "v8/tools/splaytree", "v8/tools/tickprocessor-driver", "v8/tools/tickprocessor", "node-inspect/lib/_inspect", "node-inspect/lib/internal/inspect_client ", "node-inspect/lib/internal/inspect_repl", "_linklist", "_stream_wrap"];
export const ExternalPackages = ['chokidar', 'yargs', 'node-fetch', 'fsevents', `worker_threads`, "assert/strict", "async_hooks", "diagnostics_channel", "http2", "fs/promises", "inspector", "perf_hooks", "timers/promises", "trace_events", "v8", "wasi", ...DeprecatedAPIs, ...PolyfillKeys];
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