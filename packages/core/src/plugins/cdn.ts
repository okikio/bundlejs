import type { BuildConfig, LocalState } from "../build.ts";
import type { StateArray } from "../configs/state.ts";
import type { ESBUILD } from "../types.ts";

import { dispatchEvent, LOGGER_WARN } from "../configs/events.ts";

import { determineExtension, HTTP_NAMESPACE } from "./http.ts";
import { parsePackageName } from "../utils/parse-package-name.ts";
import { resolve, legacy } from "resolve.exports";

import { extname, isBareImport, join } from "../utils/path.ts";
import { getRequest } from "../utils/fetch-and-cache.ts";

import { getCDNUrl, getCDNStyle, DEFAULT_CDN_HOST } from "../utils/util-cdn.ts";
import { deepAssign, getPackageOfVersion, getRegistryURL } from "../util.ts";

/** CDN Plugin Namespace */
export const CDN_NAMESPACE = "cdn-url";

const FAILED_PKGJSON_URLS = new Set<string>();

export type PackageJson = {
  // The name of the package.
  name: string;
  // The version of the package.
  version: string;
  // A short description of the package.
  description?: string;

  /** The main entry point for the package. Optional. */
  main?: string;

  /** 
   * A field to define entry points for a package when it is loaded by a loader like Node.js or a bundler like Webpack. Optional.
   * It can be a string, an object or an array of strings/objects.
   * An example: `exports: { ".": "./main.js", "./feature": "./feature/index.js" }`
   * */
  exports?: string | string[] | { [key: string]: string };

  /** 
   * A property indicating whether the package includes assets that might have side effects when imported. 
   * This can be either a boolean or an array of file paths. 
   * This information is used by bundlers like webpack for tree shaking. Optional. 
   */
  sideEffects?: boolean | string[];

  /** 
   * An object containing script commands that are run by npm. 
   * The keys are script names and the values are the scripts themselves. Optional. 
   */
  scripts?: { [key: string]: string };

  // An array of keywords that describe the package.
  keywords?: string[];
  // The URL to the homepage of the package.
  homepage?: string;
  // The URL to the issue tracker and/or the email address to which issues should be reported.
  bugs?: { url: string; email?: string } | { url?: string; email: string };
  // The license identifier or a path/url to a license file for the package.
  license?: string;
  // The person or persons who authored the package. Can be a name, an email address, or an object with name, email and url properties.
  author?: string | { name: string; email?: string; url?: string };
  // An array of people who contributed to the package. Each element can be a name, an email address, or an object with name, email and url properties.
  contributors?: Array<string | {
    name: string; email?: string; url?:
    string
  }>;
  // An array of files included in the package. Each element can be a file path or an object with include and exclude arrays of file paths. If this field is omitted, all files in the package root are included (except those listed in .npmignore or .gitignore).
  files?: Array<string | { include: Array<string>; exclude: Array<string> }>;

  // An object that maps package names to version ranges that the package depends on at runtime.
  dependencies?: { [packageName: string]: string };
  // An object that maps package names to version ranges that the package depends on for development purposes only.
  devDependencies?: { [packageName: string]: string };
  // An object that maps package names to version ranges that the package depends on optionally. If a dependency cannot be installed, npm will skip it and continue with the installation process.
  optionalDependencies?: { [packageName: string]: string };
  // An object that maps package names to version ranges that the package depends on if they are available in the same environment as the package. If a peer dependency is not met, npm will warn but not fail.
  peerDependencies?: { [packageName: string]: string };
}


/**
 * Resolution algorithm for the esbuild CDN plugin 
 * 
 * @param cdn The default CDN to use
 * @param logger Console log
 */
export const CDN_RESOLVE = (cdn = DEFAULT_CDN_HOST, rootPkg: Partial<PackageJson> = {}, packageSizeMap = new Map<string, number>()) => {
  return async (args: ESBUILD.OnResolveArgs): Promise<ESBUILD.OnResolveResult | undefined> => {
    const { sideEffects: _sideEffects, ...excludeSideEffects } = args.pluginData?.pkg ?? {};
    const oldPkg: PackageJson = deepAssign({ ...rootPkg },
      excludeSideEffects,
      rootPkg.devDependencies ? { devDependencies: rootPkg.devDependencies } : null,
      rootPkg.peerDependencies ? { peerDependencies: rootPkg.peerDependencies } : null,
      rootPkg.dependencies ? { dependencies: rootPkg.dependencies } : null,
    );
    let pkg = structuredClone(oldPkg);

    // Are there any dependecies???? Well Goood.
    const _deps = Object.assign(
      {},
      pkg.devDependencies,
      pkg.peerDependencies,
      pkg.dependencies
    );
    const keys = Object.keys(_deps);

    let argPath = args.path;
    if (/^#/.test(argPath)) {
      try {
        // Resolving imports & exports from the package.json
        // If an import starts with "#" then it's a subpath-import, and should be treated as so
        const modernResolve = (
          resolve(pkg, argPath, { browser: true, conditions: ["module"] }) ||
          resolve(pkg, argPath, { unsafe: true, conditions: ["deno", "worker", "production"] }) ||
          resolve(pkg, argPath, { require: true })
        );

        if (modernResolve) {
          const resolvedPath = Array.isArray(modernResolve) ? modernResolve[0] : modernResolve;
          argPath = join(pkg.name + "@" + pkg.version, resolvedPath);
        }
        // deno-lint-ignore no-empty
      } catch (_) { }
    }

    if (isBareImport(args.path)) {
      // Support a different default CDN + allow for custom CDN url schemes
      const { path: _argPath, origin } = getCDNUrl(argPath, cdn);

      // npm standard CDNs, e.g. unpkg, skypack, esm.sh, etc...
      const NPM_CDN = getCDNStyle(origin) === "npm";

      // Heavily based off of https://github.com/egoist/play-esbuild/blob/main/src/lib/esbuild.ts
      const parsed = parsePackageName(_argPath);
      const subpath = parsed.path;

      if (keys.includes(parsed.name)) {
        parsed.version = _deps[parsed.name];
      }

      let finalSubpath = subpath;

      // If the CDN supports package.json and some other npm stuff, it counts as an npm CDN
      if (NPM_CDN) {
        try {
          const ext = extname(subpath);
          const isDir = ext.length === 0;
          const dir = isDir ? subpath : "";

          const pkgVariants = [
            { path: getRegistryURL(`${parsed.name}@${parsed.version}`).packageVersionURL },
            { path: `${parsed.name}@${parsed.version}/package.json` },
            isDir ? {
              path: `${parsed.name}@${parsed.version}${subpath}/package.json`,
              isDir: true
            } : null,
          ].filter(x => x !== null);

          let isDirPkgJSON = false;
          const pkgVariantsLen = pkgVariants.length;
          for (let i = 0; i < pkgVariantsLen; i++) {
            const pkgMetadata = pkgVariants[i]!;
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

          const relativePath = subpath.replace(/^\//, "./");

          let modernResolve: ReturnType<typeof resolve> | undefined;
          let legacyResolve: ReturnType<typeof legacy> | undefined;

          let resolvedPath: string | void = subpath;

          try {
            // Resolving imports & exports from the package.json
            // If an import starts with "#" then it's a subpath-import, and should be treated as so
            modernResolve = (
              resolve(pkg, relativePath, { browser: true, conditions: ["module"] }) ||
              resolve(pkg, relativePath, { unsafe: true, conditions: ["deno", "worker", "production"] }) ||
              resolve(pkg, relativePath, { require: true })
            );

            if (modernResolve) {
              resolvedPath = Array.isArray(modernResolve) ? modernResolve[0] : modernResolve;
            }

            // deno-lint-ignore no-empty
          } catch (_) { }

          if (!modernResolve) {
            // If the subpath has a package.json, and the modern resolve didn't work for it
            // we can safely use legacy resolve, 
            // else, if the subpath doesn't have a package.json, then the subpath is literal, 
            // and we should just use the subpath as it is
            if (isDirPkgJSON || relativePath.trim().length === 0) {
              try {
                // Resolving using main, module, etc... from package.json
                legacyResolve = (
                  legacy(pkg, { browser: true }) ||
                  legacy(pkg, { fields: ["module", "main"] }) ||
                  legacy(pkg, { fields: ["unpkg", "bin"] })
                );

                if (legacyResolve) {
                  // Some packages have `browser` fields in their package.json which have some values set to false
                  // e.g. typescript - > https://unpkg.com/browse/typescript@4.9.5/package.json
                  if (typeof legacyResolve === "object") {
                    const values = Object.values(legacyResolve);
                    const validValues = values.filter(x => x);
                    if (validValues.length <= 0) {
                      legacyResolve = legacy(pkg);
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
                // deno-lint-ignore no-empty
              } catch (_) { }
            } else resolvedPath = relativePath;
          }

          if (resolvedPath && typeof resolvedPath === "string") {
            finalSubpath = resolvedPath.replace(/^(\.\/)/, "/");
          }

          if (dir && isDirPkgJSON) {
            finalSubpath = `${dir}${finalSubpath}`;
          }
        } catch (e) {
          dispatchEvent(LOGGER_WARN, `You may want to change CDNs. The current CDN ${!/unpkg\.com/.test(origin) ? `"${origin}" doesn't` : `path "${origin}${_argPath}" may not`} support package.json files.\nThere is a chance the CDN you're using doesn't support looking through the package.json of packages. bundlejs will switch to inaccurate guesses for package versions. For package.json support you may wish to use https://unpkg.com or other CDN's that support package.json.`);
          dispatchEvent(LOGGER_WARN, e);
        }
      }

      // If the CDN is npm based then it should add the parsed version to the URL
      // e.g. https://unpkg.com/spring-easing@v1.0.0/
      const version = NPM_CDN ? "@" + (pkg.version || parsed.version) : "";
      const { url } = getCDNUrl(`${parsed.name}${version}${finalSubpath}`, origin);

      const deps = Object.assign({}, oldPkg.devDependencies, oldPkg.dependencies, oldPkg.peerDependencies);
      const peerDeps = pkg.peerDependencies ?? {};
      const peerDepsKeys = Object.keys(peerDeps);

      // Some packages rely on cyclic dependencies, e.g. https://x.com/jsbundle/status/1792325771354149261
      // so we create a new field in peerDependencies and place the current package and it's version,
      // the algorithm should then be able to use the correct version if a dependency is cyclic
      peerDeps[parsed.name] = version.length > 0 ? version.slice(1) : (deps?.[parsed.name] ?? "latest");

      // Just in case the peerDependency is legitimately set from the package.json ignore the 
      // cyclic deps. rules, as they just make things more complicated
      for (const depKey of peerDepsKeys) {
        peerDeps[depKey] = deps[depKey] ?? peerDeps[depKey];
      }

      if (!packageSizeMap.get(`${parsed.name}${version}`)) {
        try {
          const packageJson = await getPackageOfVersion(`${parsed.name}${version}`);
          const unpackedSize: number = packageJson?.dist?.unpackedSize;
          if (typeof unpackedSize === "number") {
            packageSizeMap.set(`${parsed.name}${version}`, unpackedSize);
          }
        } catch (e) {
          console.warn(e);
        }
      }

      return {
        namespace: HTTP_NAMESPACE,
        path: (await determineExtension(url.toString())).url,
        sideEffects: typeof pkg.sideEffects === "boolean" ? pkg.sideEffects : undefined,
        pluginData: {
          pkg: {
            ...pkg,
            peerDependencies: peerDeps
          }
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

  const pkgJSON = config["package.json"];
  const packageSizeMap = get()?.packageSizeMap ?? new Map<string, number>();

  return {
    name: CDN_NAMESPACE,
    setup(build) {
      // Resolve bare imports to the CDN required using different URL schemes
      build.onResolve({ filter: /.*/ }, CDN_RESOLVE(cdn, pkgJSON, packageSizeMap));
      build.onResolve({ filter: /.*/, namespace: CDN_NAMESPACE }, CDN_RESOLVE(cdn, pkgJSON, packageSizeMap));
    },
  };
}
