"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EXTERNAL = exports.isExternal = exports.ExternalPackages = exports.DeprecatedAPIs = exports.PolyfillKeys = exports.PolyfillMap = exports.EMPTY_EXPORT = exports.EXTERNALS_NAMESPACE = void 0;
const encode_decode_js_1 = require("../utils/encode-decode.js");
const util_cdn_js_1 = require("../utils/util-cdn.js");
/** External Plugin Namespace */
exports.EXTERNALS_NAMESPACE = 'external-globals';
/** An empty export as a Uint8Array */
exports.EMPTY_EXPORT = (0, encode_decode_js_1.encode)(`export default {}`);
/** List of polyfillable native node modules, you should now use aliases to polyfill features */
exports.PolyfillMap = {
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
    'v8': "v8",
    "node-inspect": "node-inspect",
    "_linklist": "_linklist",
    "_stream_wrap": "_stream_wrap"
};
/** Array of native node packages (that are polyfillable) */
exports.PolyfillKeys = Object.keys(exports.PolyfillMap);
/** API's & Packages that were later removed from nodejs */
exports.DeprecatedAPIs = ["v8/tools/codemap", "v8/tools/consarray", "v8/tools/csvparser", "v8/tools/logreader", "v8/tools/profile_view", "v8/tools/profile", "v8/tools/SourceMap", "v8/tools/splaytree", "v8/tools/tickprocessor-driver", "v8/tools/tickprocessor", "node-inspect/lib/_inspect", "node-inspect/lib/internal/inspect_client ", "node-inspect/lib/internal/inspect_repl", "_linklist", "_stream_wrap"];
/** Packages `bundle` should ignore, including deprecated apis, and polyfillable API's */
exports.ExternalPackages = ['chokidar', 'yargs', 'fsevents', `worker_threads`, "async_hooks", "diagnostics_channel", "http2", "inspector", "perf_hooks", "trace_events", "wasi", ...exports.DeprecatedAPIs, ...exports.PolyfillKeys];
/** Based on https://github.com/egoist/play-esbuild/blob/7e34470f9e6ddcd9376704cd8b988577ddcd46c9/src/lib/esbuild.ts#L51 */
const isExternal = (id, external = []) => {
    return [...exports.ExternalPackages, ...external].find((it) => {
        if (it === id)
            return true; // import 'foo' & external: ['foo']
        if (id.startsWith(`${it}/`))
            return true; // import 'foo/bar.js' & external: ['foo']
        return false;
    });
};
exports.isExternal = isExternal;
/**
 * Esbuild EXTERNAL plugin
 *
 * @param external List of packages to marks as external
 */
const EXTERNAL = (_events, _state, config) => {
    const { external = [] } = config?.esbuild ?? {};
    return {
        name: exports.EXTERNALS_NAMESPACE,
        setup(build) {
            // Intercept import paths starting with "http:" and "https:" so
            // esbuild doesn't attempt to map them to a file system location.
            // Tag them with the "http-url" namespace to associate them with
            // this plugin.
            build.onResolve({ filter: /.*/ }, (args) => {
                const path = args.path.replace(/^node\:/, "");
                const { path: argPath } = (0, util_cdn_js_1.getCDNUrl)(path);
                if ((0, exports.isExternal)(argPath, external)) {
                    return {
                        path: argPath,
                        namespace: exports.EXTERNALS_NAMESPACE,
                        external: true
                    };
                }
            });
            // When a URL is loaded, we want to actually download the content
            // from the internet. This has just enough logic to be able to
            // handle the example import from https://cdn.esm.sh/ but in reality this
            // would probably need to be more complex.
            // 
            // We also want to intercept all import paths inside downloaded
            // files and resolve them against the original URL. All of these
            // files will be in the "http-url" namespace. Make sure to keep
            // the newly resolved URL in the "http-url" namespace so imports
            // inside it will also be resolved as URLs recursively.
            build.onLoad({ filter: /.*/, namespace: exports.EXTERNALS_NAMESPACE }, (args) => {
                return {
                    pluginName: exports.EXTERNALS_NAMESPACE,
                    contents: exports.EMPTY_EXPORT,
                    warnings: [{
                            text: `${args.path} is marked as an external module and will be ignored.`,
                            details: `"${args.path}" is a built-in node module thus can't be bundled by https://bundlejs.com, sorry about that.`
                        }]
                };
            });
        },
    };
};
exports.EXTERNAL = EXTERNAL;
