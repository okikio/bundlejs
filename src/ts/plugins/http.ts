/** Based on https://github.com/hardfist/neo-tools/blob/main/packages/bundler/src/plugins/http.ts */
import type { OnLoadArgs, OnResolveArgs, OnResolveResult, OutputFile, Plugin } from 'esbuild';

import { getRequest } from '../util/cache';
import { decode } from '../util/encode-decode';

import { getCDNUrl, DEFAULT_CDN_HOST, getCDNStyle } from '../util/util-cdn';
import { inferLoader } from '../util/loader';

import { urlJoin, extname, isBareImport } from "../util/path";
import { CDN_RESOLVE } from './cdn';

/** HTTP Plugin Namespace */
export const HTTP_NAMESPACE = 'http-url';

/**
 * Fetches packages
 * 
 * @param url package url to fetch
 * @param logger Console log
 */
export const fetchPkg = async (url: string, logger = console.log) => {
    try {
        let response = await getRequest(url);
        if (!response.ok)
            throw new Error(`[getRequest] Failed to load ${response.url} (${response.status} code)`);
            
        logger(`Fetch ${url}`, "info");
        
        return {
            url: response.url,
            content: new Uint8Array(await response.arrayBuffer()),
        };
    } catch (err) { 
        throw new Error(`[getRequest] Failed at request (${url}) \n${err}`);
    }
};

/**
 * Fetches assets from a js file, e.g. assets like WASM, Workers, etc... 
 * External assets are referenced using this syntax, e.g. new URL("...", import.meta.url)
 * Any external assets found inside said original js file, are fetched and stored
 * 
 * @param path Path for original js files 
 * @param content Content of original js files
 * @param logger Console log
 */
export const fetchAssets = async (path: string, content: Uint8Array, logger = console.log) => {
    const rgx = /new URL\(['"`](.*)['"`],(?:\s+)?import\.meta\.url(?:\s+)?\)/g;
    const parentURL = new URL("./", path).toString();

    const code = decode(content);
    const matches = Array.from(code.matchAll(rgx)) as RegExpMatchArray[]; 

    const promises = matches.map(async ([, assetURL]) => {
        let { content: asset } = await fetchPkg(urlJoin(parentURL, assetURL), logger);
        return {
            path: assetURL, contents: asset,
            get text() { return decode(asset); }
        };
    });

    return await Promise.all(promises); 
};

/**
 * Resolution algorithm for the esbuild HTTP plugin
 * 
 * @param cdn The default CDN to use
 * @param logger Console log
 */
export const HTTP_RESOLVE = (cdn = DEFAULT_CDN_HOST, logger = console.log) => {
    return async (args: OnResolveArgs):  Promise<OnResolveResult> => {
        // Some packages use "../../" with the assumption that "/" is equal to "/index.js", this is supposed to fix that bug
        let argPath = args.path.replace(/\/$/, "/index");
        
        // If the import path isn't relative do this...
        if (!argPath.startsWith(".")) {  
            // If the import is an http import load the content via the http plugins loader
            if (/^https?:\/\//.test(argPath)) { 
                return {
                    path: argPath,
                    namespace: HTTP_NAMESPACE,
                    pluginData: { pkg: args.pluginData?.pkg },
                };
            }

            let pathOrigin = new URL(
                // Use the parent files URL as a host
                urlJoin(args.pluginData?.url ? args.pluginData?.url : cdn, "../", argPath)
            ).origin;
            
            // npm standard CDNs, e.g. unpkg, skypack, esm.sh, etc...
            let NPM_CDN = getCDNStyle(pathOrigin) == "npm";
            let origin = NPM_CDN ? pathOrigin : cdn;
            
            // If the import is a bare import, use the CDN plugins resolution algorithm
            if (isBareImport(argPath)) {
                return CDN_RESOLVE(origin, logger)(args);
            } else {
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
                    path: getCDNUrl(argPath, origin).url.toString(),
                    namespace: HTTP_NAMESPACE,
                    pluginData: { pkg: args.pluginData?.pkg },
                };
            }
        }

        // For relative imports
        let path = urlJoin(args.pluginData?.url, "../", argPath);
        return {
            path,
            namespace: HTTP_NAMESPACE,
            pluginData: { pkg: args.pluginData?.pkg },
        };
    };
};

/**
 * Esbuild HTTP plugin 
 * 
 * @param assets Array to store fetched assets
 * @param cdn The default CDN to use
 * @param logger Console log
 */
export const HTTP = (assets: OutputFile[] = [], cdn = DEFAULT_CDN_HOST, logger = console.log): Plugin => {
    return {
        name: HTTP_NAMESPACE,
        setup(build) {
            // Intercept import paths starting with "http:" and "https:" so
            // esbuild doesn't attempt to map them to a file system location.
            // Tag them with the "http-url" namespace to associate them with
            // this plugin.
            build.onResolve({ filter: /^https?:\/\// }, args => {
                return {
                    path: args.path,
                    namespace: HTTP_NAMESPACE,
                };
            });

            // We also want to intercept all import paths inside downloaded
            // files and resolve them against the original URL. All of these
            // files will be in the "http-url" namespace. Make sure to keep
            // the newly resolved URL in the "http-url" namespace so imports
            // inside it will also be resolved as URLs recursively.
            build.onResolve({ filter: /.*/, namespace: HTTP_NAMESPACE }, HTTP_RESOLVE(cdn, logger));

            // When a URL is loaded, we want to actually download the content
            // from the internet. This has just enough logic to be able to
            // handle the example import from https://cdn.esm.sh/ but in reality this
            // would probably need to be more complex.
            build.onLoad({ filter: /.*/, namespace: HTTP_NAMESPACE }, async (args) => {
                // Some typescript files don't have file extensions but you can't fetch a file without their file extension
                // so bundle assumes that the file extention for missing files is always typescript
                let ext = extname(args.path);
                let argPath = ext.length > 0 ? args.path : args.path + ".ts";

                const { content, url } = await fetchPkg(argPath, logger);
                assets = assets.concat(await fetchAssets(args.path, content, logger));  

                return {
                    contents: content,
                    loader: inferLoader(url),
                    pluginData: { url, pkg: args.pluginData?.pkg },
                };
            });
        },
    };
};