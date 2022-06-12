"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALIAS = exports.ALIAS_RESOLVE = exports.isAlias = exports.ALIAS_NAMESPACE = void 0;
const parse_package_name_1 = require("parse-package-name");
const external_js_1 = require("./external.js");
const http_js_1 = require("./http.js");
const util_cdn_js_1 = require("../utils/util-cdn.js");
const path_js_1 = require("../utils/path.js");
/** Alias Plugin Namespace */
exports.ALIAS_NAMESPACE = 'alias-globals';
/**
 * Checks if a package has an alias
 *
 * @param id The package to find an alias for
 * @param aliases An object with package as the key and the package alias as the value, e.g. { "fs": "memfs" }
 */
const isAlias = (id, aliases = {}) => {
    if (!(0, path_js_1.isBareImport)(id))
        return false;
    const aliasKeys = Object.keys(aliases);
    const path = id.replace(/^node\:/, "");
    const pkgDetails = (0, parse_package_name_1.parse)(path);
    return aliasKeys.find((it) => {
        return pkgDetails.name === it; // import 'foo' & alias: { 'foo': 'bar@5.0' }
    });
};
exports.isAlias = isAlias;
/**
 * Resolution algorithm for the esbuild ALIAS plugin
 *
 * @param aliases An object with package as the key and the package alias as the value, e.g. { "fs": "memfs" }
 * @param host The default host origin to use if an import doesn't already have one
 * @param logger Console log
 */
const ALIAS_RESOLVE = (aliases = {}, host = util_cdn_js_1.DEFAULT_CDN_HOST, events) => {
    return async (args) => {
        const path = args.path.replace(/^node\:/, "");
        const { path: argPath } = (0, util_cdn_js_1.getCDNUrl)(path);
        if ((0, exports.isAlias)(argPath, aliases)) {
            const pkgDetails = (0, parse_package_name_1.parse)(argPath);
            const aliasPath = aliases[pkgDetails.name];
            return await (0, http_js_1.HTTP_RESOLVE)(host, events)({
                ...args,
                path: aliasPath
            });
        }
    };
};
exports.ALIAS_RESOLVE = ALIAS_RESOLVE;
/**
 * Esbuild ALIAS plugin
 *
 * @param aliases An object with package as the key and the package alias as the value, e.g. { "fs": "memfs" }
 * @param host The default host origin to use if an import doesn't already have one
 * @param logger Console log
 */
const ALIAS = (events, _state, config) => {
    // Convert CDN values to URL origins
    const { origin: host } = !/:/.test(config?.cdn) ? (0, util_cdn_js_1.getCDNUrl)(config?.cdn + ":") : (0, util_cdn_js_1.getCDNUrl)(config?.cdn);
    const aliases = config.alias ?? {};
    return {
        name: exports.ALIAS_NAMESPACE,
        setup(build) {
            // Intercept import paths starting with "http:" and "https:" so
            // esbuild doesn't attempt to map them to a file system location.
            // Tag them with the "http-url" namespace to associate them with
            // this plugin.
            build.onResolve({ filter: /^node\:.*/ }, async (args) => {
                if ((0, exports.isAlias)(args.path, aliases))
                    return await (0, exports.ALIAS_RESOLVE)(aliases, host, events)(args);
                return {
                    path: args.path,
                    namespace: external_js_1.EXTERNALS_NAMESPACE,
                    external: true
                };
            });
            // We also want to intercept all import paths inside downloaded
            // files and resolve them against the original URL. All of these
            // files will be in the "http-url" namespace. Make sure to keep
            // the newly resolved URL in the "http-url" namespace so imports
            // inside it will also be resolved as URLs recursively.
            build.onResolve({ filter: /.*/ }, (0, exports.ALIAS_RESOLVE)(aliases, host, events));
            build.onResolve({ filter: /.*/, namespace: exports.ALIAS_NAMESPACE }, (0, exports.ALIAS_RESOLVE)(aliases, host, events));
        },
    };
};
exports.ALIAS = ALIAS;
