import type { BuildConfig, LocalState } from "../build.ts";
import type { StateArray } from "../configs/state.ts";
import type { ESBUILD } from "../types.ts";

import { dispatchEvent, LOGGER_WARN } from "../configs/events.ts";

import { HTTP_NAMESPACE } from "./http.ts";
import { resolve as resolveExports, legacy } from "resolve.exports";
import { parsePackageName as parsePackageName } from "../utils/parse-package-name.ts";

import { isBareImport } from "../utils/path.ts";
import { getRequest } from "../utils/fetch-and-cache.ts";

import { getCDNUrl, getCDNStyle, DEFAULT_CDN_HOST } from "../utils/util-cdn.ts";
import { resolveImports } from "../utils/resolve-imports.ts";

/** CDN Plugin Namespace */
export const CDN_NAMESPACE = "cdn-url";

/**
 * Resolution algorithm for the esbuild CDN plugin 
 * 
 * @param cdn The default CDN to use
 * @param logger Console log
 */
export const CDN_RESOLVE = (cdn = DEFAULT_CDN_HOST) => {
  return async (args: ESBUILD.OnResolveArgs): Promise<ESBUILD.OnResolveResult> => {
    if (isBareImport(args.path)) {
      // Support a different default CDN + allow for custom CDN url schemes
      const { path: argPath, origin } = getCDNUrl(args.path, cdn);

      // npm standard CDNs, e.g. unpkg, skypack, esm.sh, etc...
      const NPM_CDN = getCDNStyle(origin) == "npm";

      // Heavily based off of https://github.com/egoist/play-esbuild/blob/main/src/lib/esbuild.ts
      const parsed = parsePackageName(argPath);
      let subpath = parsed.path;
      let pkg = args.pluginData?.pkg ?? {};
      let oldPkg = pkg;

      // Resolving imports from the package.json, if said import starts with "#" 
      // If an import starts with "#" then it's a subpath-import
      // https://nodejs.org/api/packages.html#subpath-imports
      if (argPath[0] == "#") {
        const path = resolveImports({ ...pkg, exports: pkg.imports }, argPath, {
          require: args.kind === "require-call" || args.kind === "require-resolve",
          browser: true
        });

        if (typeof path === "string") {
          subpath = path.replace(/^\.?\/?/, "/");

          if (subpath && subpath[0] !== "/")
            subpath = `/${subpath}`;

          const version = NPM_CDN ? "@" + pkg.version : "";
          const { url } = getCDNUrl(`${pkg.name}${version}`);
          if (subpath) url.pathname = subpath;
          return {
            namespace: HTTP_NAMESPACE,
            path: url.toString(),
            pluginData: { pkg }
          };
        }
      }

      // Are there an dependecies???? Well Goood.
      const depsExists = "dependencies" in pkg || "devDependencies" in pkg || "peerDependencies" in pkg;
      if (depsExists && !/\S+@\S+/.test(argPath)) {
        const {
          devDependencies = {},
          dependencies = {},
          peerDependencies = {}
        } = pkg;

        const deps = Object.assign({}, devDependencies, dependencies, peerDependencies);
        const keys = Object.keys(deps);

        if (keys.includes(argPath))
          parsed.version = deps[argPath];
      }

      // If the CDN supports package.json and some other npm stuff, it counts as an npm CDN
      if (NPM_CDN) {
        try {
          const { url: PACKAGE_JSON_URL } = getCDNUrl(`${parsed.name}@${parsed.version}/package.json`, origin);

          // Strongly cache package.json files
          pkg = await getRequest(PACKAGE_JSON_URL, true).then((res) => res.json());
          let path = resolveExports(pkg, subpath ? "." + subpath.replace(/^\.?\/?/, "/") : ".", {
            // require: args.kind === "require-call" || args.kind === "require-resolve",
            browser: true,
            conditions: ["production", "module"]
          }) || legacy(pkg);

          if (Array.isArray(path)) path = path[0];
          if (typeof path === "string")
            subpath = path.replace(/^\.?\/?/, "/").replace(/\.js\.js$/, ".js");

          if (subpath && subpath[0] !== "/")
            subpath = `/${subpath}`;
        } catch (e) {
          dispatchEvent(LOGGER_WARN, `You may want to change CDNs. The current CDN ${!/unpkg\.com/.test(origin) ? `"${origin}" doesn't` : `path "${origin}${argPath}" may not`} support package.json files.\nThere is a chance the CDN you're using doesn't support looking through the package.json of packages. bundlejs will switch to inaccurate guesses for package versions. For package.json support you may wish to use https://unpkg.com or other CDN's that support package.json.`);
          dispatchEvent(LOGGER_WARN, e);
        }
      }

      // If the CDN is npm based then it should add the parsed version to the URL
      // e.g. https://unpkg.com/spring-easing@v1.0.0/
      const version = NPM_CDN ? "@" + pkg.version : "";
      const { url } = getCDNUrl(`${parsed.name}${version}${subpath}`, origin);

      let deps = Object.assign({}, oldPkg.devDependencies, oldPkg.dependencies, oldPkg.peerDependencies);
      let peerDeps = pkg.peerDependencies ?? {};
      let peerDepsKeys = Object.keys(peerDeps);
      for (let depKey of peerDepsKeys) {
        peerDeps[depKey] = deps[depKey] ?? peerDeps[depKey];
      }
      let newPkg = {
        ...pkg,
        peerDependencies: peerDeps
      }
      return {
        namespace: HTTP_NAMESPACE,
        path: url.toString(),
        pluginData: { pkg: newPkg }
      };
    }
  };
};

/**
 * Esbuild CDN plugin 
 * 
 * @param cdn The default CDN to use
 * @param logger Console log
 */
export function CDN(state: StateArray<LocalState>, config: BuildConfig): ESBUILD.Plugin {
  // Convert CDN values to URL origins
  const { origin: cdn } = !/:/.test(config?.cdn) ? getCDNUrl(config?.cdn + ":") : getCDNUrl(config?.cdn);
  return {
    name: CDN_NAMESPACE,
    setup(build) {
      // Resolve bare imports to the CDN required using different URL schemes
      build.onResolve({ filter: /.*/ }, CDN_RESOLVE(cdn));
      build.onResolve({ filter: /.*/, namespace: CDN_NAMESPACE }, CDN_RESOLVE(cdn));
    },
  };
}
