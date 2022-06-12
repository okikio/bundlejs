"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CDN = exports.CDN_RESOLVE = exports.CDN_NAMESPACE = void 0;
const path_js_1 = require("../utils/path.js");
const fetch_and_cache_js_1 = require("../utils/fetch-and-cache.js");
const util_cdn_js_1 = require("../utils/util-cdn.js");
const resolve_imports_js_1 = require("../utils/resolve-imports.js");
const util_cdn_js_2 = require("../utils/util-cdn.js");
const resolve_exports_1 = require("resolve-exports");
const parse_package_name_1 = require("parse-package-name");
const http_js_1 = require("./http.js");
/** CDN Plugin Namespace */
exports.CDN_NAMESPACE = 'cdn-url';
/**
 * Resolution algorithm for the esbuild CDN plugin
 *
 * @param cdn The default CDN to use
 * @param logger Console log
 */
const CDN_RESOLVE = (cdn = util_cdn_js_2.DEFAULT_CDN_HOST, events) => {
    return async (args) => {
        if ((0, path_js_1.isBareImport)(args.path)) {
            // Support a different default CDN + allow for custom CDN url schemes
            const { path: argPath, origin } = (0, util_cdn_js_1.getCDNUrl)(args.path, cdn);
            // npm standard CDNs, e.g. unpkg, skypack, esm.sh, etc...
            const NPM_CDN = (0, util_cdn_js_1.getCDNStyle)(origin) == "npm";
            // Heavily based off of https://github.com/egoist/play-esbuild/blob/main/src/lib/esbuild.ts
            const parsed = (0, parse_package_name_1.parse)(argPath);
            let subpath = parsed.path;
            let pkg = args.pluginData?.pkg ?? {};
            // Resolving imports from the package.json, if said import starts with "#" 
            // If an import starts with "#" then it's a subpath-import
            // https://nodejs.org/api/packages.html#subpath-imports
            if (argPath[0] == "#") {
                const path = (0, resolve_imports_js_1.resolveImports)({ ...pkg, exports: pkg.imports }, argPath, {
                    require: args.kind === "require-call" || args.kind === "require-resolve"
                });
                if (typeof path === "string") {
                    subpath = path.replace(/^\.?\/?/, "/");
                    if (subpath && subpath[0] !== "/")
                        subpath = `/${subpath}`;
                    const version = NPM_CDN ? "@" + pkg.version : "";
                    const { url: { href } } = (0, util_cdn_js_1.getCDNUrl)(`${pkg.name}${version}${subpath}`);
                    return {
                        namespace: http_js_1.HTTP_NAMESPACE,
                        path: href,
                        pluginData: { pkg }
                    };
                }
            }
            // Are there an dependecies???? Well Goood.
            const depsExists = "dependencies" in pkg || "devDependencies" in pkg || "peerDependencies" in pkg;
            if (depsExists && !/\S+@\S+/.test(argPath)) {
                const { devDependencies = {}, dependencies = {}, peerDependencies = {} } = pkg;
                const deps = Object.assign({}, devDependencies, peerDependencies, dependencies);
                const keys = Object.keys(deps);
                if (keys.includes(argPath))
                    parsed.version = deps[argPath];
            }
            // If the CDN supports package.json and some other npm stuff, it counts as an npm CDN
            if (NPM_CDN) {
                try {
                    const { url: PACKAGE_JSON_URL } = (0, util_cdn_js_1.getCDNUrl)(`${parsed.name}@${parsed.version}/package.json`, origin);
                    // Strongly cache package.json files
                    pkg = await (0, fetch_and_cache_js_1.getRequest)(PACKAGE_JSON_URL, true).then((res) => res.json());
                    const path = (0, resolve_exports_1.resolve)(pkg, subpath ? "." + subpath.replace(/^\.?\/?/, "/") : ".", {
                        require: args.kind === "require-call" || args.kind === "require-resolve",
                    }) || (0, resolve_exports_1.legacy)(pkg);
                    if (typeof path === "string")
                        subpath = path.replace(/^\.?\/?/, "/").replace(/\.js\.js$/, ".js");
                    if (subpath && subpath[0] !== "/")
                        subpath = `/${subpath}`;
                }
                catch (e) {
                    events
                        .emit("logger.warn", `You may want to change CDNs. The current CDN ${!/unpkg\.com/.test(origin) ? `"${origin}" doesn't` : `path "${origin}${argPath}" may not`} support package.json files.\nThere is a chance the CDN you're using doesn't support looking through the package.json of packages. bundlejs will switch to inaccurate guesses for package versions. For package.json support you may wish to use https://unpkg.com or other CDN's that support package.json.`)
                        .emit("logger.warn", e);
                }
            }
            // If the CDN is npm based then it should add the parsed version to the URL
            // e.g. https://unpkg.com/spring-easing@v1.0.0/
            const version = NPM_CDN ? "@" + parsed.version : "";
            const { url } = (0, util_cdn_js_1.getCDNUrl)(`${parsed.name}${version}${subpath}`, origin);
            return {
                namespace: http_js_1.HTTP_NAMESPACE,
                path: url.toString(),
                pluginData: { pkg }
            };
        }
    };
};
exports.CDN_RESOLVE = CDN_RESOLVE;
/**
 * Esbuild CDN plugin
 *
 * @param cdn The default CDN to use
 * @param logger Console log
 */
const CDN = (events, _state, config) => {
    // Convert CDN values to URL origins
    // @ts-ignore: ...
    const { origin: cdn } = !/:/.test(config?.cdn) ? (0, util_cdn_js_1.getCDNUrl)(config?.cdn + ":") : (0, util_cdn_js_1.getCDNUrl)(config?.cdn);
    return {
        name: exports.CDN_NAMESPACE,
        setup(build) {
            // Resolve bare imports to the CDN required using different URL schemes
            build.onResolve({ filter: /.*/ }, (0, exports.CDN_RESOLVE)(cdn, events));
            build.onResolve({ filter: /.*/, namespace: exports.CDN_NAMESPACE }, (0, exports.CDN_RESOLVE)(cdn, events));
        },
    };
};
exports.CDN = CDN;
