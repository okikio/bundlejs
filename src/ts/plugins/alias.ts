import type { OnResolveArgs, OnResolveResult, Plugin } from 'esbuild';

import { parse as parsePackageName } from "parse-package-name";
import { getCDNHost, isBareImport } from '../util/loader';
import { EXTERNALS_NAMESPACE } from './external';
import { HTTP_RESOLVE } from './http';

export const isAlias = (id: string, aliases = {}) => {
    if (!isBareImport(id)) return false;
    
    let aliasKeys = Object.keys(aliases);
    let path = id.replace(/^node\:/, "");
    let pkgDetails = parsePackageName(path);

    return aliasKeys.find((it: string): boolean => {
        return pkgDetails.name === it; // import 'foo' & alias: { 'foo': 'bar@5.0' }
    });
}

export const ALIAS_RESOLVE = (logger = console.log, _aliases = {}): (args: OnResolveArgs) => OnResolveResult | Promise<OnResolveResult> => {
    return (args) => {
        let path = args.path.replace(/^node\:/, "");
        let { argPath } = getCDNHost(path);
        if (isAlias(argPath, _aliases)) {
            let pkgDetails = parsePackageName(argPath);
            let aliasPath = _aliases[pkgDetails.name];
            return HTTP_RESOLVE(logger)({
                ...args,
                path: aliasPath
            });
        }
    };
};

export const ALIAS_NAMESPACE = 'alias-globals';
export const ALIAS = (logger = console.log, aliases = {}): Plugin => {
    return {
        name: ALIAS_NAMESPACE,
        setup(build) {
            build.onResolve({ filter: /^node\:.*/ }, (args) => {
                if (isAlias(args.path, aliases)) 
                    return ALIAS_RESOLVE(logger, aliases)(args);

                return {
                    path: args.path,
                    namespace: EXTERNALS_NAMESPACE,
                    external: true
                };
            });

            build.onResolve({ filter: /.*/ }, ALIAS_RESOLVE(logger, aliases));
            build.onResolve({ filter: /.*/, namespace: ALIAS_NAMESPACE }, ALIAS_RESOLVE(logger, aliases));
        },
    };
};