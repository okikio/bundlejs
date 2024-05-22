import type { BuildConfig, LocalState, ESBUILD, PackageJson } from "../types.ts";
import type { StateArray } from "../configs/state.ts";

import { dispatchEvent, LOGGER_WARN } from "../configs/events.ts";

import { resolve, legacy } from "@bundle/utils/utils/resolve-exports-imports.ts";
import { parsePackageName } from "@bundle/utils/utils/parse-package-name.ts";
import { determineExtension, HTTP_NAMESPACE } from "./http.ts";

import { extname, isBareImport, join } from "@bundle/utils/utils/path.ts";
import { getRequest } from "@bundle/utils/utils/fetch-and-cache.ts";

import { getCDNUrl, getCDNStyle, DEFAULT_CDN_HOST } from "../utils/cdn-format.ts";
import { deepMerge } from "@bundle/utils/utils/deep-equal.ts";

/** CDN Plugin Namespace */
export const CDN_NAMESPACE = "cdn-url";

const FAILED_MANIFEST_URLS = new Set<string>();

/**
 * Resolution algorithm for the esbuild CDN plugin 
 * 
 * @param cdn The default CDN to use
 * @param logger Console log
 */
export const CDN_RESOLVE = (cdn = DEFAULT_CDN_HOST, rootPkg: Partial<PackageJson> = {}) => {
  return async (args: ESBUILD.OnResolveArgs): Promise<ESBUILD.OnResolveResult | undefined> => {
    let argPath = args.path;

    // Conceptually package.json = manifest, but for naming reasons we'll just call it manifest
    let { sideEffects: _sideEffects, ..._inheritedManifest } = args.pluginData?.manifest ?? {};

    // Object.assign & deepMerge essentially do the same thing for flat objects, 
    // except there are some instances where Object.assign is faster
    let initialManifest: PackageJson = deepMerge(
      structuredClone(rootPkg),

      // If we've manually set the version of the dependency in the config, 
      // then force all occurances of that dependency to use the version specified in the config
      Object.assign(
        structuredClone(_inheritedManifest),
        rootPkg.devDependencies ? { devDependencies: rootPkg.devDependencies } : null,
        rootPkg.peerDependencies ? { peerDependencies: rootPkg.peerDependencies } : null,
        rootPkg.dependencies ? { dependencies: rootPkg.dependencies } : null,
      )
    );

    const initialDeps = Object.assign(
      {},
      initialManifest.devDependencies,
      initialManifest.peerDependencies,
      initialManifest.dependencies,
    );
    
    // Resolving subpath imports from the package.json, subpath imports are import that starts with "#" 
    // https://nodejs.org/api/packages.html#subpath-imports
    if (/^#/.test(argPath)) {
      try {
        // Resolving imports & exports from the package.json
        // If an import starts with "#" then it's a subpath-import, and should be treated as so
        const modernResolve = resolve(initialManifest, argPath, { browser: true, conditions: ["module"] }) ||
          resolve(initialManifest, argPath, { unsafe: true, conditions: ["deno", "worker", "production"] }) ||
          resolve(initialManifest, argPath, { require: true });

        if (modernResolve) {
          const resolvedPath = Array.isArray(modernResolve) ? modernResolve[0] : modernResolve;
          argPath = join(initialManifest.name + "@" + initialManifest.version, resolvedPath);
        }
        // deno-lint-ignore no-empty
      } catch (e) { }
    }

    if (isBareImport(args.path)) {
      // Support a different default CDN + allow for custom CDN url schemes
      const { path: _argPath, origin } = getCDNUrl(argPath, cdn);

      // npm standard CDNs, e.g. unpkg, skypack, esm.sh, etc...
      const NPM_CDN = getCDNStyle(origin) === "npm";

      // Heavily based off of https://github.com/egoist/play-esbuild/blob/main/src/lib/esbuild.ts
      const parsed = parsePackageName(_argPath, { defaultVersion: null });
      const parsedSubpath = parsed.path;

      // If the version of package isn't determinable from the path argument,
      // check the inherited manifest for a potential version
      let assumedVersion = parsed.version || "latest";
      if (!parsed.version) {
        if (parsed.name in initialDeps)
          assumedVersion = initialDeps[parsed.name];
      }

      let manifest = structuredClone(initialManifest);
      let resultSubpath = parsedSubpath;

      // If the CDN supports package.json and some other npm stuff, it counts as an npm CDN
      if (NPM_CDN) {
        try {
          const ext = extname(parsedSubpath);
          const isDirectory = ext.length === 0;
          const subpath = isDirectory ? parsedSubpath : "";
          let isSubpathDirectoryPackage = false;

          // If the subpath is a directory check to see if that subpath has a `package.json`,
          // after which check if the parent directory has a `package.json`
          const manifestVariants = [
            isDirectory ? {
              path: `${parsed.name}@${assumedVersion}${parsedSubpath}/package.json`,
              isDir: true
            } : null,
            { path: `${parsed.name}@${assumedVersion}/package.json` }
          ].filter(x => x !== null);

          const manifestVariantsLen = manifestVariants.length;
          for (let i = 0; i < manifestVariantsLen; i++) {
            const { path, isDir } = manifestVariants[i]!;
            const { url } = getCDNUrl(path, origin);

            // If the url was fetched before and failed, skip it 
            if (FAILED_MANIFEST_URLS.has(url.href) && i < manifestVariantsLen - 1) 
              continue;

            try {
              // Strongly cache package.json files
              const res = await getRequest(url, true);
              if (!res.ok) throw new Error(await res.text());

              manifest = await res.json();
              isSubpathDirectoryPackage = isDir ?? false;
              break;
            } catch (e) {
              FAILED_MANIFEST_URLS.add(url.href);

              // If after checking all the different file extensions none of them are valid
              // Throw the last fetch error encountered, as that is generally the most accurate error
              if (i >= manifestVariantsLen - 1)
                throw e;
            }
          }

          const relativePath = parsedSubpath.replace(/^\//, "./");
          
          let modernResolve: ReturnType<typeof resolve> | void;
          let legacyResolve: ReturnType<typeof legacy> | void;
          let resolvedPath: string | void = parsedSubpath;

          try {
            // Resolving imports & exports from the package.json
            // If an import starts with "#" then it's a subpath-import, and should be treated as so
            modernResolve = resolve(manifest, relativePath, { browser: true, conditions: ["module"] }) ||
              resolve(manifest, relativePath, { unsafe: true, conditions: ["deno", "worker", "production"] }) ||
              resolve(manifest, relativePath, { require: true });

            if (modernResolve) {
              resolvedPath = Array.isArray(modernResolve) ? modernResolve[0] : modernResolve;
            }
            // deno-lint-ignore no-empty
          } catch (e) { }

          if (!modernResolve) {
            // If the subpath has a package.json, and the modern resolve didn't work for it
            // we can safely use legacy resolve, 
            // else, if the subpath doesn't have a package.json, then the subpath is literal, 
            // and we should just use the subpath as it is
            if (isSubpathDirectoryPackage) {
              try {
                // Resolving using main, module, etc... from package.json
                legacyResolve = legacy(manifest, { browser: true }) ||
                  legacy(manifest, { fields: ["unpkg", "bin"] });

                if (legacyResolve) {
                  // Some packages have `browser` fields in their package.json which have some values set to false
                  // e.g. typescript - > https://unpkg.com/browse/typescript@4.9.5/package.json
                  if (typeof legacyResolve === "object") {
                    const values = Object.values(legacyResolve);
                    const validValues = values.filter(x => x);
                    if (validValues.length <= 0) {
                      legacyResolve = legacy(manifest);
                    }
                  }

                  if (Array.isArray(legacyResolve)) {
                    resolvedPath = legacyResolve[0];
                  } else if (typeof legacyResolve === "object") {
                    const legacyResults = legacyResolve;
                    const allKeys = Object.keys(legacyResolve);
                    const nonCJSKeys = allKeys.filter(key => {
                      return !/\.cjs$/.exec(key) && !/src\//.exec(key) && legacyResults[key];
                    });
                    const keysToUse = nonCJSKeys.length > 0 ? nonCJSKeys : allKeys;
                    resolvedPath = legacyResolve[keysToUse[0]] as string;
                  } else {
                    resolvedPath = legacyResolve;
                  }
                }
              } catch (e) { }
            } else resolvedPath = relativePath;
          }

          if (resolvedPath && typeof resolvedPath === "string") {
            resultSubpath = resolvedPath.replace(/^(\.\/)/, "/");
          }

          if (subpath && isSubpathDirectoryPackage) {
            resultSubpath = `${subpath}${resultSubpath}`;
          }
        } catch (e) {
          dispatchEvent(LOGGER_WARN, `You may want to change CDNs. The current CDN ${!/unpkg\.com/.test(origin) ? `"${origin}" doesn't` : `path "${origin}${_argPath}" may not`} support package.json files.\nThere is a chance the CDN you're using doesn't support looking through the package.json of packages. bundlejs will switch to inaccurate guesses for package versions. For package.json support you may wish to use https://unpkg.com or other CDN's that support package.json.`);
          dispatchEvent(LOGGER_WARN, e);
        }
      }

      // If the CDN is npm based then it should add the parsed version to the URL
      // e.g. https://unpkg.com/spring-easing@v1.0.0/
      const knownVersion = manifest.version || assumedVersion;
      const cdnVersionFormat = NPM_CDN ? "@" + knownVersion : "";
      const { url } = getCDNUrl(`${parsed.name}${cdnVersionFormat}${resultSubpath}`, origin);

      const peerDeps = manifest.peerDependencies ?? {};
      const inheritedPeerDependencies = structuredClone(peerDeps);

      // Force inherit peerDependencies, makes it easier to keep versions stable 
      // and to avoid duplicates
      for (const [name, version] of Object.entries(peerDeps)) {
        inheritedPeerDependencies[name] = initialDeps[name] ?? version;
      }

      return {
        namespace: HTTP_NAMESPACE,
        path: (await determineExtension(url.toString())).url,
        sideEffects: typeof manifest.sideEffects === "boolean" ? manifest.sideEffects : undefined,
        pluginData: {
          manifest: deepMerge(
            structuredClone(manifest), 
            { peerDependencies: inheritedPeerDependencies }
          )
        }
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
  const { origin: cdn } = config?.cdn && !/:/.test(config?.cdn) ? getCDNUrl(config?.cdn + ":") : getCDNUrl(config?.cdn ?? DEFAULT_CDN_HOST);
  const [get] = state;
  const pkgJSON = config["package.json"]

  return {
    name: CDN_NAMESPACE,
    setup(build) {
      // Resolve bare imports to the CDN required using different URL schemes
      build.onResolve({ filter: /.*/ }, CDN_RESOLVE(cdn, pkgJSON));
      build.onResolve({ filter: /.*/, namespace: CDN_NAMESPACE }, CDN_RESOLVE(cdn, pkgJSON));
    },
  };
};