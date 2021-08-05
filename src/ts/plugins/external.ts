import type { Plugin } from 'esbuild';
import { CDN_NAMESPACE } from './cdn';
import { HTTP_NAMESPACE } from './http';
import { PolyfillMap } from './node-polyfill';

// Must not start with "/" or "./" or "../"
const NON_NODE_MODULE_RE = /^[^.\/]|^\.[^.\/]|^\.\.[^\/]/;

export const PolyfillKeys = Object.keys(PolyfillMap);
export const DeprecatedAPIs = ["v8/tools/codemap", "v8/tools/consarray", "v8/tools/csvparser", "v8/tools/logreader", "v8/tools/profile_view", "v8/tools/profile", "v8/tools/SourceMap", "v8/tools/splaytree", "v8/tools/tickprocessor-driver", "v8/tools/tickprocessor", "node-inspect/lib/_inspect", "node-inspect/lib/internal/inspect_client ", "node-inspect/lib/internal/inspect_repl", "_linklist", "_stream_wrap"];
export const ExternalPackages = ['chokidar', 'yargs', 'node-fetch', 'fsevents', `worker_threads`, "assert/strict", "async_hooks", "diagnostics_channel", "http2", "fs/promises", "inspector", "perf_hooks", "timers/promises", "trace_events", "v8", "wasi", ...DeprecatedAPIs, ...PolyfillKeys];
export const EXTERNAL = (): Plugin => {
    return {
        name: 'external-globals',
        setup(build) {
            build.onResolve({ filter: /^node\:.*/ }, (args) => {
                return {
                    path: args.path,
                    namespace: 'external',
                    external: true
                };
            });
            
            build.onResolve({ filter: /.*/ }, (args) => {
                let path = args.path.replace(/^node\:/, "");
                if (ExternalPackages.includes(path)) {
                    return {
                        path,
                        namespace: 'external',
                        external: true
                    };
                }
            });

            build.onLoad({ filter: /.*/, namespace: 'external' }, (args) => {
                if (args.path === 'node-fetch')
                    return { contents: 'export default fetch' };

                return {
                    contents: `export default {}`,
                };
            });
        },
    };
};