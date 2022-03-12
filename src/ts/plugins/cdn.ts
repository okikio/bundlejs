
import type { OnResolveArgs, OnResolveResult, Plugin } from 'esbuild';

import { HTTP_NAMESPACE } from './http';
import { isBareImport, getCDNHost } from '../util/loader';
import { resolveImports } from '../util/resolve-imports';

import { resolve, legacy } from "resolve.exports";
import { parse as parsePackageName } from "parse-package-name";
import { getRequest } from '../util/cache';

export const CDN_RESOLVE = (_host?: string): (args: OnResolveArgs) => OnResolveResult | Promise<OnResolveResult> => {
    return async (args) => {
        if (isBareImport(args.path)) {
            let { argPath, host } = getCDNHost(args.path, _host);

            // Heavily based off of https://github.com/egoist/play-esbuild/blob/main/src/lib/esbuild.ts
            let parsed = parsePackageName(argPath);
            let subpath = parsed.path;
            let pkg = args.pluginData?.pkg ?? {};
            let path;

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

                    let { url } = getCDNHost(`${pkg.name}@${pkg.version}${subpath}`);
                    return {
                        namespace: HTTP_NAMESPACE,
                        path: url,
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

            let { url: pkgJSON_URL } = getCDNHost(`${parsed.name}@${parsed.version}/package.json`, host);

            // Strongly cache package.json files
            pkg = await getRequest(pkgJSON_URL, true).then((res) => res.json());
            path = resolve(pkg, subpath ? "." + subpath.replace(/^\.?\/?/, "/") : ".", {
                require: args.kind === "require-call" || args.kind === "require-resolve",
            }) || legacy(pkg);

            if (typeof path === "string")
                subpath = path.replace(/^\.?\/?/, "/");

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
