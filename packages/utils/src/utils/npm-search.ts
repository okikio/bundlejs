import type { FullPackage, FullPackageVersion, PackageInfo, PackageSearchResult, RegistryURLs, SearchInfo } from "./types.ts";

import { getRequest } from "./fetch-and-cache.ts";
import { parsePackageName } from "./parse-package-name.ts";
import { maxSatisfying, parse, parseRange, format } from "./semver.ts";

/**
 * Generates registry URLs for npm packages based on the input string.
 * 
 * @param input - Package name, optionally including version (e.g., "@okikio/animate@1.0").
 * @returns An object containing URLs for searching, package details, and specific version.
 * 
 * @example
 * const urls = getRegistryURL("@okikio/animate@1.0");
 * console.log(urls);
 * // Output:
 * // {
 * //   searchURL: "https://registry.npmjs.com/-/v1/search?text=@okikio/animate&popularity=0.5&size=30",
 * //   packageURL: "https://registry.npmjs.com/@okikio/animate",
 * //   packageVersionURL: "https://registry.npmjs.com/@okikio/animate/1.0",
 * //   version: "1.0",
 * //   name: "@okikio/animate",
 * //   path: ""
 * // }
 */
export function getRegistryURL(input: string): RegistryURLs {
  const host = "https://registry.npmjs.com";

  const { name, version, path } = parsePackageName(input);
  const searchURL = `${host}/-/v1/search?text=${encodeURIComponent(name)}&popularity=0.5&size=30`;
  const packageVersionURL = `${host}/${name}/${version}`;
  const packageURL = `${host}/${name}`;

  return { searchURL, packageURL, packageVersionURL, version, name, path };
};

/**
 * Searches the npm registry for packages with matching names.
 * 
 * @param input - Package name, optionally including version (ignored) (e.g., "@okikio/animate@1.0").
 * @returns An object containing the search results.
 * 
 * @example
 * const result = await getPackages("@okikio/animate");
 * console.log(result.packages);
 * // Output:
 * // [
 * //   {
 * //     name: "@okikio/animate",
 * //     scope: "okikio",
 * //     version: "2.3.1",
 * //     description: "An animation library for the modern web...",
 * //     keywords: ["animation", "web", "API"],
 * //     date: "2021-06-30T07:01:08.871Z",
 * //     links: {
 * //       npm: "https://www.npmjs.com/package/@okikio/animate",
 * //       homepage: "https://animate.okikio.dev",
 * //       repository: "https://github.com/okikio/animate",
 * //       bugs: "https://github.com/okikio/animate/issues"
 * //     },
 * //     author: { name: "Okiki Imoesi" },
 * //     publisher: { username: "okikio", email: "okiki@example.com" },
 * //     maintainers: [{ username: "okikio", email: "okiki@example.com" }]
 * //   },
 * //   // ...more packages
 * // ]
 */
export async function getPackages(input: string): Promise<PackageSearchResult> {
  const { searchURL } = getRegistryURL(input);
  let result: SearchInfo;

  try {
    const response = await getRequest(searchURL, false);
    result = await response.json();
  } catch (e) {
    console.warn(e);
    throw e;
  }

  const packages = result?.objects;
  return { packages, info: result };
};

/**
 * Fetches the metadata of a specific package from the npm registry.
 * 
 * @param input - Package name, optionally including version (ignored) (e.g., "@okikio/animate@1.0").
 * @returns The package metadata.
 * 
 * @example
 * const packageInfo = await getPackage("@okikio/animate");
 * console.log(packageInfo);
 * // Output:
 * // {
 * //   name: "@okikio/animate",
 * //   scope: "okikio",
 * //   version: "2.3.1",
 * //   description: "An animation library for the modern web...",
 * //   keywords: ["animation", "web", "API"],
 * //   date: "2021-06-30T07:01:08.871Z",
 * //   links: {
 * //     npm: "https://www.npmjs.com/package/@okikio/animate",
 * //     homepage: "https://animate.okikio.dev",
 * //     repository: "https://github.com/okikio/animate",
 * //     bugs: "https://github.com/okikio/animate/issues"
 * //   },
 * //   author: { name: "Okiki Imoesi" },
 * //   publisher: { username: "okikio", email: "okiki@example.com" },
 * //   maintainers: [{ username: "okikio", email: "okiki@example.com" }]
 * // }
 */
export async function getPackage(input: string): Promise<FullPackage> {
  const { packageURL } = getRegistryURL(input);

  try {
    const response = await getRequest(packageURL, false);
    return await response.json() as FullPackage;
  } catch (e) {
    console.warn(e);
    throw e;
  }
};


/**
 * Fetches the metadata of a specific package version from the npm registry.
 * 
 * @param input - Package name, including version (e.g., "@okikio/animate@1.0").
 * @returns The package version metadata.
 * 
 * @example
 * const packageVersionInfo = await getPackageOfVersion("@okikio/animate@1.0");
 * console.log(packageVersionInfo);
 * // Output:
 * // {
 * //   name: "@okikio/animate",
 * //   version: "1.0.0",
 * //   type: "module",
 * //   sideEffects: false,
 * //   description: "An animation library for the modern web...",
 * //   publishConfig: {
 * //     access: "public",
 * //     main: "lib/api.cjs.js",
 * //     types: "@types/api.d.ts",
 * //     browser: "lib/api.es.js",
 * //     module: "lib/api.es.js",
 * //     exports: {
 * //       ".": {
 * //         require: "./lib/api.cjs.js",
 * //         import: "./lib/api.es.js",
 * //         default: "./lib/api.es.js"
 * //       },
 * //       "./lib/*": "./lib/*.js"
 * //     }
 * //   },
 * //   main: "lib/api.cjs.js",
 * //   directories: { lib: "./lib" },
 * //   repository: { type: "git", url: "git+https://github.com/okikio/native.git" },
 * //   keywords: ["ts", "modern", "animation", "library", "web", "css", "smooth"],
 * //   author: { name: "Okiki Ojo", email: "hey@okikio.dev", url: "https://okikio.dev" },
 * //   license: "MIT",
 * //   bugs: { url: "https://github.com/okikio/native/issues" },
 * //   homepage: "https://github.com/okikio/native/tree/master/packages/animate#readme",
 * //   dependencies: { "@okikio/emitter": "2.1.7", "@okikio/manager": "2.1.7" },
 * //   devDependencies: {
 * //     "del-cli": "^4.0.0",
 * //     esbuild: "^0.12.12",
 * //     "gzip-size": "^6.0.0",
 * //     pnpm: "^6.9.1",
 * //     "pretty-bytes": "^5.6.0",
 * //     typescript: "~4.3.4"
 * //   },
 * //   gitHead: "ad422076...90f",
 * //   scripts: {
 * //     build: "del-cli lib/ && node ./build",
 * //     watch: "del-cli lib/ && node ./build --watch",
 * //     dts: "del-cli @types/ && tsc --project dts.tsconfig.json",
 * //     "pre-release": "pnpm build && pnpm dts"
 * //   },
 * //   types: "@types/api.d.ts",
 * //   browser: "lib/api.es.js",
 * //   module: "lib/api.es.js",
 * //   exports: {
 * //     ".": {
 * //       require: "./lib/api.cjs.js",
 * //       import: "./lib/api.es.js",
 * //       default: "./lib/api.es.js"
 * //     },
 * //     "./lib/*": "./lib/*.js"
 * //   },
 * //   _id: "@okikio/animate@1.0.0",
 * //   _nodeVersion: "14.16.1",
 * //   _npmVersion: "6.14.12",
 * //   dist: {
 * //     integrity: "sha512-+asddaRga...IsiNRA==",
 * //     shasum: "b2c08e0...c8",
 * //     tarball: "https://registry.npmjs.org/@okikio/animate/-/animate-1.0.0.tgz",
 * //     fileCount: 29,
 * //     unpackedSize: 414434,
 * //     "npm-signature": "-----BEGIN PGP SIGNATURE-----\r\n" +
 * //       "Version: OpenPGP.js v3.0.13\r\n" +
 * //       "Comment: https://openpgpjs.org\r\n" +
 * //       "\r\n" +
 * //       "wsFcBA"... 768 more characters,
 * //     signatures: [
 * //       {
 * //         keyid: "SHA256:jl3bwswu...kzA",
 * //         sig: "MEUCI...VFfo="
 * //       }
 * //     ]
 * //   },
 * //   _npmUser: { name: "okikio", email: "okikio.dev@gmail.com" },
 * //   maintainers: [{ name: "okikio", email: "okikio.dev@gmail.com" }],
 * //   _npmOperationalInternal: {
 * //     host: "s3://npm-registry-packages",
 * //     tmp: "tmp/animate_1.0.0_1625036468730_0.7262493743034963"
 * //   },
 * //   _hasShrinkwrap: false
 * // }
 */
export async function getPackageOfVersion(input: string): Promise<FullPackageVersion> {
  const { packageVersionURL } = getRegistryURL(input);

  try {
    const response = await getRequest(packageVersionURL, false);
    return await response.json() as FullPackageVersion;
  } catch (e) {
    console.warn(e);
    throw e;
  }
};

/**
 * Fetches all versions and tags of a specific package from the npm registry.
 * 
 * @param input - Package name, optionally including version (ignored) (e.g., "@okikio/animate@1.0").
 * @returns An object containing arrays of versions and tags.
 * 
 * @example
 * const versionsAndTags = await getPackageVersions("@okikio/animate");
 * console.log(versionsAndTags);
 * // Output:
 * // {
 * //   versions: ["0.0.3", "0.0.4", "0.0.5", "1.0.0", "1.1.0", "2.0.0", "2.3.1"],
 * //   tags: { latest: "2.3.1", beta: "2.4.0" }
 * // }
 */
export async function getPackageVersions(input: string): Promise<PackageInfo> {
  try {
    const pkg = await getPackage(input);
    const versions = Object.keys(pkg.versions);
    const tags = pkg["dist-tags"];
    return { versions, tags };
  } catch (e) {
    console.warn(e);
    throw e;
  }
};

/**
 * Resolves the appropriate version of a package based on a version range.
 * 
 * @param input - Package name, including version range (e.g., "@okikio/animate@^1.0.0").
 * @returns The resolved version string.
 * 
 * @example
 * const version = await resolveVersion("@okikio/animate@^1.0.0");
 * console.log(version);
 * // Output:
 * // "2.3.1"
 */
export async function resolveVersion(input: string): Promise<string | null> {
  try {
    let { version: range } = getRegistryURL(input);
    if (!range) return null;

    const versionsAndTags = await getPackageVersions(input);
    if (versionsAndTags) {
      const { versions, tags } = versionsAndTags;
      if (range in tags) 
        range = tags[range];

      if (versions.includes(range)) 
        return range;

      const versionArr = versions.map(v => parse(v));
      const semVerRange = parseRange(range);
      const maxVersion = maxSatisfying(versionArr, semVerRange);

      if (!maxVersion) return null;
      return format(maxVersion);
    }
  } catch (e) {
    console.warn(e);
    throw e;
  }

  return null;
};

/**
 * Fetches the metadata of a package with the resolved version from the npm registry.
 * 
 * @param input - Package name, including version (e.g., "@okikio/animate@1.0").
 * @returns The resolved package metadata.
 * 
 * @example
 * const resolvedPackage = await getResolvedPackage("@okikio/animate@^1.0.0");
 * console.log(resolvedPackage);
 * // Output:
 * // {
 * //   name: "@okikio/animate",
 * //   scope: "okikio",
 * //   version: "2.3.1",
 * //   description: "An animation library for the modern web...",
 * //   keywords: ["animation", "web", "API"],
 * //   date: "2021-06-30T07:01:08.871Z",
 * //   links: {
 * //     npm: "https://www.npmjs.com/package/@okikio/animate",
 * //     homepage: "https://animate.okikio.dev",
 * //     repository: "https://github.com/okikio/animate",
 * //     bugs: "https://github.com/okikio/animate/issues"
 * //   },
 * //   author: { name: "Okiki Imoesi" },
 * //   publisher: { username: "okikio", email: "okiki@example.com" },
 * //   maintainers: [{ username: "okikio", email: "okiki@example.com" }]
 * // }
 */
export async function getResolvedPackage(input: string) {
  try {
    const { name } = getRegistryURL(input);
    const version = await resolveVersion(input);

    return await getPackageOfVersion(`${name}@${version}`);
  } catch (e) {
    console.warn(e);
    throw e;
  }
};