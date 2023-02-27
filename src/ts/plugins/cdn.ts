import type { OnResolveArgs, OnResolveResult, Plugin } from 'esbuild';

import { HTTP_NAMESPACE } from './http';
import { isBareImport } from '../util/path';
import { getRequest } from '../util/fetch-and-cache';

import { getCDNUrl, getCDNStyle } from '../util/util-cdn';

import { resolve, legacy, imports } from "resolve.exports";
import { parse as parsePackageName } from "parse-package-name";

import { DEFAULT_CDN_HOST } from '../util/util-cdn';

/** CDN Plugin Namespace */
export const CDN_NAMESPACE = 'cdn-url';

/**
 * Resolution algorithm for the esbuild CDN plugin 
 * 
 * @param cdn The default CDN to use
 * @param logger Console log
 */
export const CDN_RESOLVE = (cdn = DEFAULT_CDN_HOST, logger = console.log) => {
    return async (args: OnResolveArgs):  Promise<OnResolveResult> => {
        if (isBareImport(args.path)) {
            // Support a different default CDN + allow for custom CDN url schemes
            let { path: argPath, origin } = getCDNUrl(args.path, cdn);

            // npm standard CDNs, e.g. unpkg, skypack, esm.sh, etc...
            let NPM_CDN = getCDNStyle(origin) == "npm";

            // Heavily based off of https://github.com/egoist/play-esbuild/blob/main/src/lib/esbuild.ts
            let parsed = parsePackageName(argPath);
            let subpath = parsed.path;
            let pkg = args.pluginData?.pkg ?? {};
            let oldPkg = pkg;

            // Resolving imports from the package.json, if said import starts with "#" 
            // If an import starts with "#" then it's a subpath-import
            // https://nodejs.org/api/packages.html#subpath-imports
            if (argPath[0] == "#") {
                let path = imports({ ...pkg, exports: pkg.imports }, argPath, {
                    require: args.kind === "require-call" || args.kind === "require-resolve"
                });

                if (Array.isArray(path) || typeof path === "string") {
                    subpath = (Array.isArray(path) ? path.join("") : path).replace(/^\.?\/?/, "/");

                    if (subpath && subpath[0] !== "/")
                        subpath = `/${subpath}`;

                    let version = NPM_CDN ? "@" + pkg.version : "";
                    let { url: { href } } = getCDNUrl(`${pkg.name}${version}${subpath}`);
                    return {
                        namespace: HTTP_NAMESPACE,
                        path: href,
                        pluginData: { pkg }
                    };
                }
            }

            // Are there an dependecies???? Well Goood.
            let depsExists = "dependencies" in pkg || "devDependencies" in pkg || "peerDependencies" in pkg;
            if (depsExists && !/\S+@\S+/.test(argPath)) {
                let { 
                    devDependencies = {}, 
                    dependencies = {}, 
                    peerDependencies = {} 
                } = pkg;
                
                let deps = Object.assign({}, peerDependencies, devDependencies, dependencies);
                let keys = Object.keys(deps);

                if (keys.includes(argPath)) 
                    parsed.version = deps[argPath];
            }

            // If the CDN supports package.json and some other npm stuff, it counts as an npm CDN
            if (NPM_CDN) {
                try {
                    let { url: PACKAGE_JSON_URL } = getCDNUrl(`${parsed.name}@${parsed.version}/package.json`, origin);

                    // Strongly cache package.json files
                    pkg = await getRequest(PACKAGE_JSON_URL, true).then((res) => res.json());
                    let path = resolve(pkg, subpath ? "." + subpath.replace(/^\.?\/?/, "/") : ".", {
                        require: args.kind === "require-call" || args.kind === "require-resolve",
                    }) || legacy(pkg);

                    if (typeof path === "string")
                        subpath = path.replace(/^\.?\/?/, "/").replace(/\.js\.js$/, ".js");

                    if (subpath && subpath[0] !== "/")
                        subpath = `/${subpath}`;
                } catch (e) {
                    logger([`You may want to change CDNs. The current CDN ${!/unpkg\.com/.test(origin) ? `"${origin}" doesn't` : `path "${origin}${argPath}" may not`} support package.json files.\nThere is a chance the CDN you're using doesn't support looking through the package.json of packages. bundlejs will switch to inaccurate guesses for package versions. For package.json support you may wish to use https://unpkg.com or other CDN's that support package.json.`], "warning");
                    console.warn(e);
                }
            }

            // If the CDN is npm based then it should add the parsed version to the URL
            // e.g. https://unpkg.com/spring-easing@v1.0.0/
            let version = NPM_CDN ? "@" + parsed.version : "";
            let { url } = getCDNUrl(`${parsed.name}${version}${subpath}`, origin);

            let deps = Object.assign({}, oldPkg.peerDependencies, oldPkg.devDependencies, oldPkg.dependencies);
            let peerDeps = pkg.peerDependencies ?? {};
            let peerDepsKeys = Object.keys(peerDeps);
            for (let depKey of peerDepsKeys) {
                peerDeps[depKey] = deps[depKey] ?? peerDeps[depKey];
            }
            let newPkg = {
                ...pkg,
                peerDependencies: peerDeps
            }

            // logger(`Verbose log pkg.json (${pkg.name}@${pkg.version}):\n` + JSON.stringify({ pkg, newPkg }, null, 2), "warning");
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
export const CDN = (cdn: string, logger = console.log): Plugin => {
    return {
        name: CDN_NAMESPACE,
        setup(build) {
            // Resolve bare imports to the CDN required using different URL schemes
            build.onResolve({ filter: /.*/ }, CDN_RESOLVE(cdn, logger));
            build.onResolve({ filter: /.*/, namespace: CDN_NAMESPACE }, CDN_RESOLVE(cdn, logger));
        },
    };
};
