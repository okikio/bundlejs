"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTP = exports.HTTP_RESOLVE = exports.fetchAssets = exports.fetchPkg = exports.HTTP_NAMESPACE = void 0;
const fetch_and_cache_js_1 = require("../utils/fetch-and-cache.js");
const encode_decode_js_1 = require("../utils/encode-decode.js");
const util_cdn_js_1 = require("../utils/util-cdn.js");
const loader_js_1 = require("../utils/loader.js");
const path_js_1 = require("../utils/path.js");
const cdn_js_1 = require("./cdn.js");
/** HTTP Plugin Namespace */
exports.HTTP_NAMESPACE = 'http-url';
/**
 * Fetches packages
 *
 * @param url package url to fetch
 * @param logger Console log
 */
const fetchPkg = async (url, events) => {
    try {
        const response = await (0, fetch_and_cache_js_1.getRequest)(url);
        if (!response.ok)
            throw new Error(`Couldn't load ${response.url} (${response.status} code)`);
        events.emit("logger.info", `Fetch ${url}`);
        return {
            url: response.url,
            content: new Uint8Array(await response.arrayBuffer()),
        };
    }
    catch (err) {
        throw new Error(`[getRequest] Failed at request (${url})\n${err.toString()}`);
    }
};
exports.fetchPkg = fetchPkg;
/**
 * Fetches assets from a js file, e.g. assets like WASM, Workers, etc...
 * External assets are referenced using this syntax, e.g. new URL("...", import.meta.url)
 * Any external assets found inside said original js file, are fetched and stored
 *
 * @param path Path for original js files
 * @param content Content of original js files
 * @param namespace esbuild plugin namespace
 * @param logger Console log
 */
const fetchAssets = async (path, content, namespace, events, config) => {
    const rgx = /new URL\(['"`](.*)['"`],(?:\s+)?import\.meta\.url(?:\s+)?\)/g;
    const parentURL = new URL("./", path).toString();
    const FileSystem = config.filesystem;
    const code = (0, encode_decode_js_1.decode)(content);
    const matches = Array.from(code.matchAll(rgx));
    const promises = matches.map(async ([, assetURL]) => {
        const { content: asset, url } = await (0, exports.fetchPkg)((0, path_js_1.urlJoin)(parentURL, assetURL), events);
        // Create a virtual file system for storing assets
        // This is for building a package bundle analyzer 
        FileSystem?.set?.(namespace + ":" + url, content);
        return {
            path: assetURL, contents: asset,
            get text() { return (0, encode_decode_js_1.decode)(asset); }
        };
    });
    return await Promise.allSettled(promises);
};
exports.fetchAssets = fetchAssets;
/**
 * Resolution algorithm for the esbuild HTTP plugin
 *
 * @param host The default host origin to use if an import doesn't already have one
 * @param logger Console log
 */
const HTTP_RESOLVE = (host = util_cdn_js_1.DEFAULT_CDN_HOST, events) => {
    return async (args) => {
        // Some packages use "../../" with the assumption that "/" is equal to "/index.js", this is supposed to fix that bug
        const argPath = args.path.replace(/\/$/, "/index");
        // If the import path isn't relative do this...
        if (!argPath.startsWith(".")) {
            // If the import is an http import load the content via the http plugins loader
            if (/^https?:\/\//.test(argPath)) {
                return {
                    path: argPath,
                    namespace: exports.HTTP_NAMESPACE,
                    pluginData: { pkg: args.pluginData?.pkg },
                };
            }
            const pathOrigin = new URL(
            // Use the parent files URL as a host
            (0, path_js_1.urlJoin)(args.pluginData?.url ? args.pluginData?.url : host, "../", argPath)).origin;
            // npm standard CDNs, e.g. unpkg, skypack, esm.sh, etc...
            const NPM_CDN = (0, util_cdn_js_1.getCDNStyle)(pathOrigin) == "npm";
            const origin = NPM_CDN ? pathOrigin : host;
            // If the import is a bare import, use the CDN plugins resolution algorithm
            if ((0, path_js_1.isBareImport)(argPath)) {
                return await (0, cdn_js_1.CDN_RESOLVE)(origin, events)(args);
            }
            else {
                /**
                 * If the import is neither an http import or a bare import (module import), then it is an absolute import.
                 * Therefore, load the content via the http plugins loader, but make sure that the absolute URL doesn't go past the root URL
                 *
                 * e.g.
                 * To load `jquery` from jsdelivr, the CDN root needs to `https://cdn.jsdelivr.net/npm`,
                 * thus the final URL is https://cdn.jsdelivr.net/npm/jquery
                 *
                 * The problem is that if a user using absolute URL's aims for the root domain,
                 * the result should be `https://cdn.jsdelivr.net`, but what we really want is for our use case is
                 * a root of `https://cdn.jsdelivr.net/npm`
                 *
                 * So, we treat the path as a CDN and force all URLs to use CDN origins as the root domain
                */
                return {
                    path: (0, util_cdn_js_1.getCDNUrl)(argPath, origin).url.toString(),
                    namespace: exports.HTTP_NAMESPACE,
                    pluginData: { pkg: args.pluginData?.pkg },
                };
            }
        }
        // For relative imports
        const path = (0, path_js_1.urlJoin)(args.pluginData?.url, "../", argPath);
        return {
            path,
            namespace: exports.HTTP_NAMESPACE,
            pluginData: { pkg: args.pluginData?.pkg },
        };
    };
};
exports.HTTP_RESOLVE = HTTP_RESOLVE;
/**
 * Esbuild HTTP plugin
 *
 * @param assets Array to store fetched assets
 * @param host The default host origin to use if an import doesn't already have one
 * @param logger Console log
 */
const HTTP = (events, state, config) => {
    // Convert CDN values to URL origins
    const { origin: host } = !/:/.test(config?.cdn) ? (0, util_cdn_js_1.getCDNUrl)(config?.cdn + ":") : (0, util_cdn_js_1.getCDNUrl)(config?.cdn);
    const FileSystem = config.filesystem;
    const assets = state.assets ?? [];
    return {
        name: exports.HTTP_NAMESPACE,
        setup(build) {
            // Intercept import paths starting with "http:" and "https:" so
            // esbuild doesn't attempt to map them to a file system location.
            // Tag them with the "http-url" namespace to associate them with
            // this plugin.
            build.onResolve({ filter: /^https?:\/\// }, args => {
                return {
                    path: args.path,
                    namespace: exports.HTTP_NAMESPACE,
                };
            });
            // We also want to intercept all import paths inside downloaded
            // files and resolve them against the original URL. All of these
            // files will be in the "http-url" namespace. Make sure to keep
            // the newly resolved URL in the "http-url" namespace so imports
            // inside it will also be resolved as URLs recursively.
            build.onResolve({ filter: /.*/, namespace: exports.HTTP_NAMESPACE }, (0, exports.HTTP_RESOLVE)(host, events));
            // When a URL is loaded, we want to actually download the content
            // from the internet. This has just enough logic to be able to
            // handle the example import from https://cdn.esm.sh/ but in reality this
            // would probably need to be more complex.
            build.onLoad({ filter: /.*/, namespace: exports.HTTP_NAMESPACE }, async (args) => {
                // Some typescript files don't have file extensions but you can't fetch a file without their file extension
                // so bundle tries to solve for that
                const ext = (0, path_js_1.extname)(args.path);
                const argPath = (suffix = "") => ext.length > 0 ? args.path : args.path + suffix;
                let content, url;
                try {
                    // Fetch the path without the `.ts` extension
                    ({ content, url } = await (0, exports.fetchPkg)(argPath(), events));
                }
                catch (err) {
                    // If the ^ above fetch doesn't work, try again with a `.ts` extension
                    // Some typescript files don't have file extensions but you can't fetch a file without their file extension
                    try {
                        ({ content, url } = await (0, exports.fetchPkg)(argPath(".ts"), events));
                    }
                    catch (_e) {
                        // If the ^ above fetch doesn't work, try again with a `.tsx` extension
                        // Some typescript files use `.tsx`
                        try {
                            ({ content, url } = await (0, exports.fetchPkg)(argPath(".tsx"), events));
                        }
                        catch (e) {
                            events.emit("logger.error", e.toString());
                            throw err;
                        }
                    }
                }
                // Create a virtual file system for storing node modules
                // This is for building a package bundle analyzer 
                await FileSystem?.set?.(args.namespace + ":" + args.path, content);
                const _assetResults = (await (0, exports.fetchAssets)(url, content, args.namespace, events, config))
                    .filter((result) => {
                    if (result.status == "rejected") {
                        events.emit("logger:warn", "Asset fetch failed.\n" + result?.reason?.toString());
                        return false;
                    }
                    else
                        return true;
                })
                    .map((result) => {
                    if (result.status == "fulfilled")
                        return result.value;
                });
                state.assets = assets.concat(_assetResults);
                return {
                    contents: content,
                    loader: (0, loader_js_1.inferLoader)(url),
                    pluginData: { url, pkg: args.pluginData?.pkg },
                };
            });
        },
    };
};
exports.HTTP = HTTP;
