import type { Plugin } from 'esbuild-wasm';

import { encode } from "../utils/encode-decode";
import { getCDNUrl } from '../utils/util-cdn';

/** External Plugin Namespace */
export const EXTERNALS_NAMESPACE = 'external-globals';

/** An empty export as a Uint8Array */
export const EMPTY_EXPORT = encode(`export default {}`);

/** List of polyfillable native node modules, you should now use aliases to polyfill features */
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
  'v8': "v8",
  "node-inspect": "node-inspect",
  "_linklist": "_linklist",
  "_stream_wrap": "_stream_wrap"
};

/** Array of native node packages (that are polyfillable) */
export const PolyfillKeys = Object.keys(PolyfillMap);
/** API's & Packages that were later removed from nodejs */
export const DeprecatedAPIs = ["v8/tools/codemap", "v8/tools/consarray", "v8/tools/csvparser", "v8/tools/logreader", "v8/tools/profile_view", "v8/tools/profile", "v8/tools/SourceMap", "v8/tools/splaytree", "v8/tools/tickprocessor-driver", "v8/tools/tickprocessor", "node-inspect/lib/_inspect", "node-inspect/lib/internal/inspect_client ", "node-inspect/lib/internal/inspect_repl", "_linklist", "_stream_wrap"];
/** Packages `bundle` should ignore, including deprecated apis, and polyfillable API's */
export const ExternalPackages = ['chokidar', 'yargs', 'fsevents', `worker_threads`, "async_hooks", "diagnostics_channel", "http2", "inspector", "perf_hooks", "trace_events", "wasi", ...DeprecatedAPIs, ...PolyfillKeys];

/** Based on https://github.com/egoist/play-esbuild/blob/7e34470f9e6ddcd9376704cd8b988577ddcd46c9/src/lib/esbuild.ts#L51 */
export const isExternal = (id: string, external: string[] = []) => {
  return [...ExternalPackages, ...external].find((it: string): boolean => {
    if (it === id) return true; // import 'foo' & external: ['foo']
    if (id.startsWith(`${it}/`)) return true; // import 'foo/bar.js' & external: ['foo']
    return false;
  });
};

/**
 * Esbuild EXTERNAL plugin 
 * 
 * @param external List of packages to marks as external
 */
export const EXTERNAL = (external: string[] = []): Plugin => {
  return {
    name: EXTERNALS_NAMESPACE,
    setup(build) {
      // Intercept import paths starting with "http:" and "https:" so
      // esbuild doesn't attempt to map them to a file system location.
      // Tag them with the "http-url" namespace to associate them with
      // this plugin.
      build.onResolve({ filter: /.*/ }, (args) => {
        let path = args.path.replace(/^node\:/, "");
        let { path: argPath } = getCDNUrl(path);

        if (isExternal(argPath, external)) {
          return {
            path: argPath,
            namespace: EXTERNALS_NAMESPACE,
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
      build.onLoad({ filter: /.*/, namespace: EXTERNALS_NAMESPACE }, (args) => {
        return {
          pluginName: EXTERNALS_NAMESPACE,
          contents: EMPTY_EXPORT,
          warnings: [{
            text: `${args.path} is marked as an external module and will be ignored.`,
            details: `"${args.path}" is a built-in node module thus can't be bundled by https://bundlejs.com, sorry about that.`
          }]
        };
      });
    },
  };
};