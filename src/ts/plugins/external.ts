import type { Plugin } from 'esbuild';

export const PolyfillMap = {
    "console": 'console-browserify',
    "constants": 'constants-browserify',
    "crypto": 'crypto-browserify',
    "http": 'http-browserify',
    "buffer": 'buffer',
    "Dirent": "dirent",
    "vm": 'vm-browserify',
    "zlib": 'zlib-browserify',
    "assert": 'assert',
    "child_process": 'child_process',
    "cluster": 'child_process',
    "dgram": 'dgram',
    "dns": 'dns',
    "domain": 'domain-browser',
    "events": 'events',
    "https": 'https',
    "module": 'module',
    "net": 'net',
    "path": 'path-browserify',
    "punycode": 'punycode',
    "querystring": 'querystring',
    "readline": 'readline',
    "repl": 'repl',
    "stream": 'stream',
    "string_decoder": 'string_decoder',
    "sys": 'sys',
    "timers": 'timers',
    "tls": 'tls',
    "tty": 'tty-browserify',
    "url": 'url',
    "util": 'util',
    "_shims": '_shims',
    "_stream_duplex": '_stream_duplex',
    "_stream_readable": '_stream_readable',
    "_stream_writable": '_stream_writable',
    "_stream_transform": '_stream_transform',
    "_stream_passthrough": '_stream_passthrough',
    process: 'process/browser',
    fs: 'memfs',
    os: 'os-browserify/browser',
};

export const PolyfillKeys = Object.keys(PolyfillMap);

export const DeprecatedAPIs = ["v8/tools/codemap", "v8/tools/consarray", "v8/tools/csvparser", "v8/tools/logreader", "v8/tools/profile_view", "v8/tools/profile", "v8/tools/SourceMap", "v8/tools/splaytree", "v8/tools/tickprocessor-driver", "v8/tools/tickprocessor", "node-inspect/lib/_inspect", "node-inspect/lib/internal/inspect_client ", "node-inspect/lib/internal/inspect_repl", "_linklist", "_stream_wrap"];
export const ExternalPackages = ['chokidar', 'yargs', 'fsevents', `worker_threads`, "assert/strict", "async_hooks", "diagnostics_channel", "http2", "fs/promises", "inspector", "perf_hooks", "timers/promises", "trace_events", "v8", "wasi", ...DeprecatedAPIs, ...PolyfillKeys];

export const EXTERNALS_NAMESPACE = 'external-globals';
export const EXTERNAL = (): Plugin => {
    return {
        name: EXTERNALS_NAMESPACE,
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
                return {
                    contents: `export default {}`,
                    warnings: [
                        {
                            pluginName: EXTERNALS_NAMESPACE,
                            text: `${args.path} is marked as an external module and will be ignored.`
                        }
                    ]
                };
            });
        },
    };
};