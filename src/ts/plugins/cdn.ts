import type { OnResolveArgs, OnResolveResult, Plugin } from 'esbuild';

import { determineExtension, fetchPkg, HTTP_NAMESPACE, HTTP_RESOLVE, TARBALL_RESOLVE } from './http';
import { extname, isBareImport, join } from '../util/path';
import { getRequest } from '../util/fetch-and-cache';

import { getCDNUrl, getCDNStyle } from '../util/util-cdn';

import { resolve, exports, legacy, imports } from "resolve.exports";
import { parse as parsePackageName } from "parse-package-name";

import { DEFAULT_CDN_HOST } from '../util/util-cdn';
import { deepAssign } from '../util/deep-equal';
import { getPackageOfVersion, getRegistryURL } from '../util/npm-search';
import { getFile, getResolvedPath } from '../util/filesystem';
import { VIRTUAL_FS_RESOLVE } from './virtual-fs';

/** CDN Plugin Namespace */
export const CDN_NAMESPACE = 'cdn-url';

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
export const CDN_RESOLVE = (packageSizeMap = new Map<string, number>(), cdn = DEFAULT_CDN_HOST, logger = console.log, rootPkg: Partial<PackageJson> = {}) => {
    return async (args: OnResolveArgs): Promise<OnResolveResult | undefined> => {
        let argPath = args.path;
        if (/^#/.test(argPath)) {
            const { sideEffects: _sideEffects, ...excludeSideEffects } = args.pluginData?.pkg ?? {};
            const pkg: PackageJson = excludeSideEffects ?? { ...rootPkg };

            try {
                // Resolving imports & exports from the package.json
                // If an import starts with "#" then it's a subpath-import, and should be treated as so
                const modernResolve = resolve(pkg, argPath, { browser: true, conditions: ["module"] }) ||
                    resolve(pkg, argPath, { unsafe: true, conditions: ["deno", "worker", "production"] }) ||
                    resolve(pkg, argPath, { require: true });

                if (modernResolve) {
                    const resolvedPath = Array.isArray(modernResolve) ? modernResolve[0] : modernResolve;
                    argPath = join(`${pkg.name}@${pkg.version}`, resolvedPath);
                }
                // deno-lint-ignore no-empty
            } catch (e) { }
        }

        if (isBareImport(args.path)) {
            // Support a different default CDN + allow for custom CDN url schemes
            const { path: _argPath, origin } = getCDNUrl(argPath, cdn);

            // npm standard CDNs, e.g. unpkg, skypack, esm.sh, etc...
            const NPM_CDN = getCDNStyle(origin) === "npm";

            const { sideEffects: _sideEffects, ...excludeSideEffects } = args.pluginData?.pkg ?? {};
            const oldPkg: PackageJson = excludeSideEffects ?? { ...rootPkg };
            let pkg = structuredClone(oldPkg);

            // Are there any dependecies???? Well Goood.
            const _deps = Object.assign(
                {},
                pkg.devDependencies,
                pkg.peerDependencies, 
                pkg.dependencies
            );
            const keys = Object.keys(_deps);

            // Heavily based off of https://github.com/egoist/play-esbuild/blob/main/src/lib/esbuild.ts
            const parsed = parsePackageName(_argPath);
            const subpath = parsed.path;

            if (keys.includes(parsed.name)) {
                const depVersion = _deps[parsed.name]
                parsed.version = depVersion;

                if (/^http(s)?\:/.test(parsed.version)) {

                    const modifiedArgs = Object.assign({}, args, {
                        path: parsed.version,
                        pluginData: Object.assign({}, args?.pluginData, {
                            importer: parsed.version
                        })
                    });

                    console.log({
                        depVersion,
                        args,
                        modifiedArgs
                    })
                    try {
                        const argsPath = join(modifiedArgs.path)
                        getResolvedPath(argsPath);
                        return TARBALL_RESOLVE(undefined, null, packageSizeMap, logger, rootPkg)(modifiedArgs);
                    } catch (e) {
                        console.warn("https dep is kinda wack", e)
                        let content: Uint8Array | undefined;
                        let url: string;
                        let contentType: string | null = null;
                        ({ content, contentType, url } = await determineExtension(modifiedArgs.path, false, logger));

                        console.log({
                            "cdn-to-vfs": true,
                            content,
                            contentType,
                            tar: contentType === "application/tar+gzip",
                            url
                        })

                        if (content && contentType === "application/tar+gzip") {
                            return TARBALL_RESOLVE(content, contentType, packageSizeMap, logger, rootPkg)(modifiedArgs);
                        }
                    }
                }
            }

            let finalSubpath = subpath;

            // If the CDN supports package.json and some other npm stuff, it counts as an npm CDN
            if (NPM_CDN) {
                try {
                    const ext = extname(subpath);
                    const isDir = ext.length === 0;

                    const pkgVariants = [
                        { path: getRegistryURL(`${parsed.name}@${parsed.version}`).packageVersionURL },
                        { path: `${parsed.name}@${parsed.version}/package.json` },
                        isDir ? {
                            path: `${parsed.name}@${parsed.version}${subpath}/package.json`,
                            isDir: true
                        } : null
                    ].filter(x => x !== null);

                    let isDirPkgJSON = false;
                    const pkgVariantsLen = pkgVariants.length;
                    for (let i = 0; i < pkgVariantsLen; i++) {
                        // biome-ignore lint/style/noNonNullAssertion: <explanation>
                        const pkgMetadata = pkgVariants[i]!;
                        const { url } = getCDNUrl(pkgMetadata.path, origin);
                        const { href } = url;

                        console.log({
                            href
                        })

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

                    finalSubpath = await resolveImport(pkg, subpath, isDirPkgJSON, logger);
                } catch (e) {
                    logger([`You may want to change CDNs. The current CDN ${!/unpkg\.com/.test(origin) ? `"${origin}" doesn't` : `path "${origin}${_argPath}" may not`} support package.json files.\nThere is a chance the CDN you're using doesn't support looking through the package.json of packages. bundlejs will switch to inaccurate guesses for package versions. For package.json support you may wish to use https://unpkg.com or other CDN's that support package.json.`], "warning");
                    console.warn(e);
                }
            }

            // If the CDN is npm based then it should add the parsed version to the URL
            // e.g. https://unpkg.com/spring-easing@v1.0.0/
            const version = NPM_CDN ? `@${pkg.version || parsed.version}` : "";
            const { url } = getCDNUrl(`${parsed.name}${version}${finalSubpath}`, origin);

            const deps = Object.assign({}, oldPkg.devDependencies, oldPkg.dependencies, oldPkg.peerDependencies);
            const peerDeps = pkg.peerDependencies ?? {};
            const peerDepsKeys = Object.keys(peerDeps);

            // Some packages rely on cyclic dependencies, e.g. https://x.com/jsbundle/status/1792325771354149261
            // so we create a new field in peerDependencies and place the current package and it's version,
            // the algorithm should then be able to use the correct version if a dependency is cyclic
            peerDeps[parsed.name] = version.length > 0 ? version.slice(1) : (deps?.[parsed.name] ?? "latest");

            if (!packageSizeMap.get(`${parsed.name}${version}`)) {
                try {
                    const packageJson = await getPackageOfVersion(`${parsed.name}${version}`);
                    const unpackedSize = ( packageJson)?.dist?.unpackedSize as number;
                    if (typeof unpackedSize === "number") 
                        packageSizeMap.set(`${parsed.name}${version}`, unpackedSize);
                    console.log({
                        packageJson,
                        unpackedSize
                    })
                } catch (e) {
                    console.warn(e);
                }
            }

            // Just in case the peerDependency is legitimately set from the package.json ignore the 
            // cyclic deps. rules, as they just make things more complicated
            for (const depKey of peerDepsKeys) {
                peerDeps[depKey] = deps[depKey] ?? peerDeps[depKey];
            }

            return {
                namespace: HTTP_NAMESPACE,
                path: (await determineExtension(url.toString())).url,
                sideEffects: typeof pkg.sideEffects === "boolean" ? pkg.sideEffects : undefined,
                pluginData: {
                    pkg: {
                        ...pkg,
                        peerDependencies: peerDeps,
                        // inheritedDeps:
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
// biome-ignore lint/style/useDefaultParameterLast: <explanation>
export  const CDN = (packageSizeMap = new Map<string, number>(), cdn: string, pkgJSON: Partial<PackageJson> = {}, logger = console.log): Plugin => {
    return {
        name: CDN_NAMESPACE,
        setup(build) {
            // Resolve bare imports to the CDN required using different URL schemes
            build.onResolve({ filter: /.*/ }, CDN_RESOLVE(packageSizeMap, cdn, logger, pkgJSON));
            build.onResolve({ filter: /.*/, namespace: CDN_NAMESPACE }, CDN_RESOLVE(packageSizeMap, cdn, logger, pkgJSON));
        },
    };
};


/**
 * Resolves the subpath for a package using the provided package.json and a path.
 * This version assumes the package.json is already available and passed as an argument.
 * 
 * @param pkg The parsed package.json object of the package.
 * @param _argPath The path that might refer to a subpath of the package.
 * @param origin The origin URL to be used for the CDN.
 * @param NPM_CDN Boolean indicating whether the current CDN supports npm package.json lookups.
 * @param FAILED_PKGJSON_URLS A Set to keep track of failed URLs for package.json fetching.
 * @returns The resolved subpath, or the original subpath if no resolution was found.
 */
export async function resolveImport(
    srcPkg: PackageJson,
    subpath: string,
    isDirPkgJSON: boolean,
    logger = console.log
): Promise<string> {
    let finalSubpath = subpath;
    const pkg = srcPkg;

    // If CDN supports package.json lookups, perform resolution
    try {
        const ext = extname(subpath);
        const isDir = ext.length === 0;
        const dir = isDir ? subpath : "";

        const relativePath = subpath.replace(/^\//, "./");

        let modernResolve: ReturnType<typeof resolve>;
        let legacyResolve: ReturnType<typeof legacy>;
        let resolvedPath: string = subpath;

        try {
            // Try resolving imports & exports using modern resolve methods
            modernResolve = resolve(pkg, relativePath, { browser: true, conditions: ["module"] }) ||
                resolve(pkg, relativePath, { unsafe: true, conditions: ["deno", "worker", "production"] }) ||
                resolve(pkg, relativePath, { require: true });

            console.log({
                modernResolve,
                pkg
            })

            if (modernResolve) {
                resolvedPath = Array.isArray(modernResolve) ? modernResolve[0] : modernResolve;
            }
        } catch (e) {
            // Ignored; proceed with legacy resolve if necessary
        }

        if (!modernResolve) {
            // Fall back to legacy resolve if modern resolution failed
            // if (!isDirPkgJSON) {
            //     resolvedPath = relativePath;
            //     console.log({
            //         useRelativePath: resolvedPath
            //     })
            // }

            try {
                legacyResolve = legacy(pkg, { browser: true }) ||
                    legacy(pkg, { fields: ["module", "main"] }) ||
                    legacy(pkg, { fields: ["unpkg", "bin"] });

                console.log({
                    legacyResolve,
                    pkg
                })

                if (legacyResolve) {
                    if (Array.isArray(legacyResolve)) {
                        resolvedPath = legacyResolve[0];
                    } else if (typeof legacyResolve === "object") {
                        const legacyResults = legacyResolve;
                        const allKeys = Object.keys(legacyResolve);
                        const nonCJSKeys = allKeys.filter(key => !/\.cjs$/.exec(key) && !/src\//.exec(key) && legacyResults[key]);
                        const keysToUse = nonCJSKeys.length > 0 ? nonCJSKeys : allKeys;
                        resolvedPath = legacyResolve[keysToUse[0]] as string;
                    } else {
                        resolvedPath = legacyResolve;
                    }
                }
            } catch (e) {
                // Ignored
            }
        }

        if (resolvedPath && typeof resolvedPath === "string") {
            finalSubpath = resolvedPath.replace(/^(\.\/)/, "/");
        }

        if (dir && isDirPkgJSON) {
            finalSubpath = `${dir}${finalSubpath}`;
        }
    } catch (e) {
        logger(["The current CDN may not support package.json files. Consider using https://unpkg.com for better support."], "warning");
        console.warn(e);
    }

    return finalSubpath;
}
