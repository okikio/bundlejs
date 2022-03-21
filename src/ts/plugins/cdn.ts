import type { OnResolveArgs, OnResolveResult, Plugin } from 'esbuild';

import { HTTP_NAMESPACE } from './http';
import { isBareImport, getCDNHost } from '../util/loader';
import { resolveImports } from '../util/resolve-imports';

import { resolve, legacy } from "resolve.exports";
import { parse as parsePackageName } from "parse-package-name";
import { getRequest } from '../util/cache';

export const CDN_RESOLVE = (logger = console.log, _host?: string): (args: OnResolveArgs) => OnResolveResult | Promise<OnResolveResult> => {
    return async (args) => {
        if (isBareImport(args.path)) {
            // Support a different default CDN + allow for custom CDN url schemes
            let { argPath, host, query } = getCDNHost(args.path, !/:/.test(_host) ? getCDNHost(_host + ":").host : _host);

            // Heavily based off of https://github.com/egoist/play-esbuild/blob/main/src/lib/esbuild.ts
            let parsed = parsePackageName(argPath);
            let subpath = parsed.path;
            let pkg = args.pluginData?.pkg ?? {};

            // Resolving imports from package.json, if a package starts with "#" 
            if (argPath[0] == "#") {
                let path = resolveImports({ ...pkg, exports: pkg.imports }, argPath, {
                    require: args.kind === "require-call" || args.kind === "require-resolve"
                });

                if (typeof path === "string") {
                    subpath = path.replace(/^\.?\/?/, "/");
                    // console.log("[CDN - Internal Import]", path, pkg);

                    if (subpath && subpath[0] !== "/")
                        subpath = `/${subpath}`;

                    let { url } = getCDNHost(`${pkg.name}@${/^https?\:\/\/deno.land/.test(host) ? "" : "@" + pkg.version}${subpath}`);
                    return {
                        namespace: HTTP_NAMESPACE,
                        path: url + query,
                        pluginData: { pkg }
                    };
                }
            }

            if (("dependencies" in pkg || "devDependencies" in pkg || "peerDependencies" in pkg) && !/\S+@\S+/.test(argPath)) {
                let { devDependencies = {}, dependencies = {}, peerDependencies = {} } = pkg;
                let deps = Object.assign({}, devDependencies, peerDependencies, dependencies);
                let keys = Object.keys(deps);

                if (keys.includes(argPath)) {
                    parsed.version = deps[argPath];
                }
            }

            try {
                if (!/^https?\:\/\/deno.land/.test(host)) {
                    let { url: pkgJSON_URL } = getCDNHost(`${parsed.name}@${parsed.version}/package.json`, host);

                    // Strongly cache package.json files
                    pkg = await getRequest(pkgJSON_URL, true).then((res) => res.json());
                    let path = resolve(pkg, subpath ? "." + subpath.replace(/^\.?\/?/, "/") : ".", {
                        require: args.kind === "require-call" || args.kind === "require-resolve",
                    }) || legacy(pkg);

                    if (typeof path === "string")
                        subpath = path.replace(/^\.?\/?/, "/").replace(/\.js\.js$/, ".js");

                    if (subpath && subpath[0] !== "/")
                        subpath = `/${subpath}`;
                }
            } catch (e) {
                logger([`You may want to change CDNs. The current CDN "${host}" doesn't support package.json.\nThere is a chance the CDN you're using doesn't support looking through the package.json of packages, bundle will switch to inaccurate traversal basically guestimate the package version. For package.json support you may wish to use https://unpkg.com or other CDN's that support package.json.`], "warn");
                console.warn(e)
            }

            let { url } = getCDNHost(`${parsed.name}${/^https?\:\/\/deno.land/.test(host) ? "" : "@" + parsed.version}${subpath}`, host);
            return {
                namespace: HTTP_NAMESPACE,
                path: url + query,
                pluginData: { pkg }
            };
        }
    };
}

export const CDN_NAMESPACE = 'cdn-url';
export const CDN = (logger = console.log, host: string): Plugin => {
    return {
        name: CDN_NAMESPACE,
        setup(build) {
            // Resolve bare imports to the CDN required using different URL schemes
            build.onResolve({ filter: /.*/ }, CDN_RESOLVE(logger, host));
            build.onResolve({ filter: /.*/, namespace: CDN_NAMESPACE }, CDN_RESOLVE(logger, host));
        },
    };
};
