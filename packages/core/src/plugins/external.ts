import type { BuildConfig, LocalState } from "../build.ts";
import type { StateArray } from "../configs/state.ts";
import type { ESBUILD } from "../types.ts";
import { parsePackageName } from "../util.ts";

import { encode } from "../utils/encode-decode.ts";
import { DEFAULT_CDN_HOST, getCDNUrl } from "../utils/util-cdn.ts";
import { isAlias } from "./alias.ts";
import { CDN_RESOLVE } from "./cdn.ts";

/** External Plugin Namespace */
export const EXTERNALS_NAMESPACE = "external-globals";

/** An empty export as a Uint8Array */
export const EMPTY_EXPORT = encode("export default {}");

/** List of polyfillable native node modules, you should now use aliases to polyfill features */
export const PolyfillMap = {
  "console": "console-browserify",
  "constants": "constants-browserify",
  "crypto": "crypto-browserify",
  "buffer": "buffer",
  "Dirent": "dirent",
  "vm": "vm-browserify",
  "zlib": "browserify-zlib",
  "assert": "assert",
  // "child_process": "child_process",
  // "cluster": "child_process",
  "dgram": "browser-node-dgram",
  // "dns": "dns",
  "domain": "domain-browser",
  "events": "events",
  "http": "http-browserify",
  "https": "https-browserify",
  "module": "module",
  "net": "net-browserify",
  "path": "path-browserify",
  "punycode": "punycode",
  "querystring": "querystring",
  "readline": "readline-browser",
  // "repl": "repl",
  "stream": "stream-browserify",
  "string_decoder": "string_decoder",
  // "sys": "sys",
  "timers": "timers-browserify",
  "tls": "browserify-tls",
  "tty": "tty-browserify",
  "url": "browserify-url",
  "util": "util/util.js",
  "_shims": "_shims",
  "readable-stream/": "readable-stream/lib",
  "readable-stream/duplex": "readable-stream/lib/duplex.js",
  "readable-stream/readable": "readable-stream/lib/readable.js",
  "readable-stream/writable": "readable-stream/lib/writable.js",
  "readable-stream/transform": "readable-stream/lib/transform.js",
  "readable-stream/passthrough": "readable-stream/lib/passthrough.js",
  "_stream_duplex": "readable-stream/lib/duplex.js",
  "_stream_readable": "readable-stream/lib/readable.js",
  "_stream_writable": "readable-stream/lib/writable.js",
  "_stream_transform": "readable-stream/lib/transform.js",
  "_stream_passthrough": "readable-stream/lib/passthrough.js",
  process: "process/browser",
  fs: "memfs",
  os: "os-browserify/browser",
  // "v8": "v8",
  // "node-inspect": "node-inspect",
  "_linklist": "_linklist",
  "_stream_wrap": "_stream_wrap",
};

/** Array of native node packages (that are polyfillable) */
export const PolyfillKeys = Object.keys(PolyfillMap);
/** API's & Packages that were later removed from nodejs */
export const DeprecatedAPIs = ["v8/tools/codemap", "v8/tools/consarray", "v8/tools/csvparser", "v8/tools/logreader", "v8/tools/profile_view", "v8/tools/profile", "v8/tools/SourceMap", "v8/tools/splaytree", "v8/tools/tickprocessor-driver", "v8/tools/tickprocessor", "node-inspect/lib/_inspect", "node-inspect/lib/internal/inspect_client ", "node-inspect/lib/internal/inspect_repl", "_linklist", "_stream_wrap"];
/** Packages `bundle` should ignore, including deprecated apis, and polyfillable API's */
export const ExternalPackages = ["pnpapi", "v8", "node-inspect", "sys", "repl", "dns", "child_process", "cluster", "chokidar", "yargs", "fsevents", "worker_threads", "async_hooks", "diagnostics_channel", "http2", "inspector", "perf_hooks", "trace_events", "wasi", ...DeprecatedAPIs, ...PolyfillKeys];

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
export function EXTERNAL(state: StateArray<LocalState>, config: BuildConfig): ESBUILD.Plugin {
  // Convert CDN values to URL origins
  const { origin: host } = config?.cdn && !/:/.test(config?.cdn) ? getCDNUrl(config?.cdn + ":") : getCDNUrl(config?.cdn ?? DEFAULT_CDN_HOST);
  const { external = [] } = config?.esbuild ?? {};
  const pkgJSON = config["package.json"];
  const [get] = state;

  const packageSizeMap = get()?.packageSizeMap ?? new Map<string, number>();

  return {
    name: EXTERNALS_NAMESPACE,
    setup(build) {
      // Intercept import paths starting with "http:" and "https:" so
      // esbuild doesn't attempt to map them to a file system location.
      // Tag them with the "http-url" namespace to associate them with
      // this plugin.
      build.onResolve({ filter: /.*/ }, (args) => {
        const path = args.path.replace(/^node\:/, "");
        const { path: argPath } = getCDNUrl(path, host);

        if (isExternal(argPath, external)) {
          if (config.polyfill && isAlias(argPath, PolyfillMap) && !external.includes(argPath)) {
            const pkgDetails = parsePackageName(argPath);
            const aliasPath = PolyfillMap[pkgDetails.name as keyof typeof PolyfillMap];
            return CDN_RESOLVE(host, pkgJSON, packageSizeMap)({
              ...args,
              path: aliasPath
            });
          }

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
            details: `"${args.path}" is a built-in node module thus can't be bundled by https://bundlejs.com (technically it can be supported but...it's currently disabled. If you'd like this functionallity, please reach out at https://github.com/okikio/bundlejs), sorry about that.`
          }]
        };
      });
    },
  };
}