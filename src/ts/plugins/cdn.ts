
import type { OnResolveArgs, OnResolveResult, Plugin } from 'esbuild';

import { HTTP_NAMESPACE } from './http';
import { isBareImport, getCDNHost } from '../util/loader';
import { resolveImports } from '../util/resolve-imports';

import { resolve, legacy } from "resolve.exports";
import { parse as parsePackageName } from "parse-package-name";
import { getRequest } from '../util/cache';

export const CDN_RESOLVE = (host?: string): (args: OnResolveArgs) => OnResolveResult | Promise<OnResolveResult> => {
    return async (args) => {
        if (isBareImport(args.path)) {
            // Heavily based off of https://github.com/egoist/play-esbuild/blob/main/src/lib/esbuild.ts
            let parsed = parsePackageName(args.path);
            let subpath = parsed.path;
            let pkg = args.pluginData?.pkg ?? {};
            let path;

            // Resolving imports from package.json, if a package starts with "#" 
            if (args.path[0] == "#") {
                let path = resolveImports({ ...pkg, exports: pkg.imports }, args.path, {
                    require: args.kind === "require-call" || args.kind === "require-resolve"
                });

                if (typeof path === "string") {
                    subpath = path.replace(/^\.?\/?/, "/");

                    if (subpath && subpath[0] !== "/")
                        subpath = `/${subpath}`;

                    let { url } = getCDNHost(`${pkg.name}@${pkg.version}${subpath}`);
                    return {
                        namespace: HTTP_NAMESPACE,
                        path: url,
                        pluginData: { pkg }
                    };
                }
            } else if (("dependencies" in pkg || "devDependencies" in pkg) && !/\S+@\S+/.test(args.path)) { 
                let { devDependencies = {}, dependencies = {} } = pkg;
                let deps = Object.assign({}, devDependencies, dependencies);
                let keys = Object.keys(deps);

                if (keys.includes(args.path)) {
                    parsed = parsePackageName(args.path + "@" + deps[args.path]);
                    subpath = parsed.path;
                }
            }

            if (!subpath) {
                let { url } = getCDNHost(`${parsed.name}@${parsed.version}/package.json`, host);

                // Strongly cache package.json files
                pkg = await getRequest(url, true).then((res) => res.json());
                path = resolve(pkg, ".", {
                    require: args.kind === "require-call" || args.kind === "require-resolve",
                }) || legacy(pkg);

                if (typeof path === "string")
                    subpath = path.replace(/^\.?\/?/, "/");
            }

            if (subpath && subpath[0] !== "/")
                subpath = `/${subpath}`;

            let { url } = getCDNHost(`${parsed.name}@${parsed.version}${subpath}`, host);
            return {
                namespace: HTTP_NAMESPACE,
                path: url,
                pluginData: { pkg }
            };
        }
    };
}

export const CDN_NAMESPACE = 'cdn-url';
export const CDN = (): Plugin => {
    return {
        name: CDN_NAMESPACE,
        setup(build) {
            // Resolve bare imports to the CDN required using different URL schemes
            build.onResolve({ filter: /.*/ }, CDN_RESOLVE());
        },
    };
};
