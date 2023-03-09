import type { BuildConfig, LocalState } from "../build.ts";
import type { StateArray } from "../configs/state.ts";
import type { ESBUILD } from "../types.ts";

import { dispatchEvent, LOGGER_WARN } from "../configs/events.ts";

import { determineExtension, HTTP_NAMESPACE } from "./http.ts";
import { resolve, legacy } from "resolve.exports";
import { parsePackageName as parsePackageName } from "../utils/parse-package-name.ts";

import { extname, isBareImport } from "../utils/path.ts";
import { getRequest } from "../utils/fetch-and-cache.ts";

import { getCDNUrl, getCDNStyle, DEFAULT_CDN_HOST } from "../utils/util-cdn.ts";

/** CDN Plugin Namespace */
export const CDN_NAMESPACE = "cdn-url";

const FAILED_PKGJSON_URLS = new Set<string>();

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

      let finalSubpath = subpath;

      // If the CDN supports package.json and some other npm stuff, it counts as an npm CDN
      if (NPM_CDN) {
        try {
          const ext = extname(subpath);
          const isDir = ext.length === 0;
          const dir = isDir ? subpath : "";

          const pkgVariants = [
            isDir ? { 
              path: `${parsed.name}@${parsed.version}${subpath}/package.json`, 
              isDir: true
            } : null,
            { path: `${parsed.name}@${parsed.version}/package.json` }
          ].filter(x => x !== null);

          let isDirPkgJSON = false;
          const pkgVariantsLen = pkgVariants.length;
          for (let i = 0; i < pkgVariantsLen; i ++) {
            const pkgMetadata = pkgVariants[i]
            const { url } = getCDNUrl(pkgMetadata.path, origin);
            const { href } = url;

            try {
              if (FAILED_PKGJSON_URLS.has(href) && i < pkgVariantsLen - 1) { 
                continue;
              }

              // Strongly cache package.json files
              const res = await getRequest(url, true);
              if (!res.ok) throw new Error(await res.text());

              pkg = await res.json();
              isDirPkgJSON = pkgMetadata.isDir ?? false;
              break;
            } catch (e) {
              FAILED_PKGJSON_URLS.add(href);

              // If after checking all the different file extensions none of them are valid
              // Throw the first fetch error encountered, as that is generally the most accurate error
              if (i >= pkgVariantsLen - 1) 
                throw e;
            }
          }

          let relativePath = subpath ? "." + subpath.replace(/^(\.\/|\/)/, "/") : ".";
          let modernResolve: ReturnType<typeof resolve> | void;
          let legacyResolve: ReturnType<typeof legacy> | void;

          let resolvedPath: string | void;

          try {
            // Resolving imports & exports from the package.json
            // If an import starts with "#" then it's a subpath-import, and should be treated as so
            modernResolve = resolve(pkg, relativePath, {
              browser: true,
              conditions: ["deno", "worker", "production", "module", "import", "browser"]
            });

            if (modernResolve) {
              resolvedPath = Array.isArray(modernResolve) ? modernResolve[0] : modernResolve;
            }
          } catch (e) { }

          if (!modernResolve) {
            // If the subpath has a package.json, and the modern resolve didn't work for it
            // we can safely use legacy resolve, 
            // else, if the subpath doesn't have a package.json, then the subpath is literal, 
            // and we should just use the subpath as it is
            if (isDirPkgJSON) {
              try {
                // Resolving using main, module, etc... from package.json
                legacyResolve = legacy(pkg, {
                  browser: true
                });

                if (legacyResolve) {
                  resolvedPath = Array.isArray(legacyResolve) ? legacyResolve[0] : legacyResolve as string;
                }
              } catch (e) { }
            } else resolvedPath = relativePath;
          }

          if (resolvedPath) {
            finalSubpath = resolvedPath.replace(/^(\.\/|\/)/, "/");
          }

          if (dir && isDirPkgJSON) {
            finalSubpath = `${dir}${finalSubpath}`;
          }
        } catch (e) {
          dispatchEvent(LOGGER_WARN, `You may want to change CDNs. The current CDN ${!/unpkg\.com/.test(origin) ? `"${origin}" doesn't` : `path "${origin}${argPath}" may not`} support package.json files.\nThere is a chance the CDN you're using doesn't support looking through the package.json of packages. bundlejs will switch to inaccurate guesses for package versions. For package.json support you may wish to use https://unpkg.com or other CDN's that support package.json.`);
          dispatchEvent(LOGGER_WARN, e);
        }
      }

      // If the CDN is npm based then it should add the parsed version to the URL
      // e.g. https://unpkg.com/spring-easing@v1.0.0/
      const version = NPM_CDN ? "@" + (pkg.version || parsed.version) : "";
      const { url } = getCDNUrl(`${parsed.name}${version}${finalSubpath}`, origin);

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
        path: await determineExtension(url.toString()),
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
  const [get] = state;

  return {
    name: CDN_NAMESPACE,
    setup(build) {
      // Resolve bare imports to the CDN required using different URL schemes
      build.onResolve({ filter: /.*/ }, CDN_RESOLVE(cdn));
      build.onResolve({ filter: /.*/, namespace: CDN_NAMESPACE }, CDN_RESOLVE(cdn));
    },
  };
}
