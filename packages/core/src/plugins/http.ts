/** Based on https://github.com/hardfist/neo-tools/blob/main/packages/bundler/src/plugins/http.ts */
import type { OnResolveArgs, OnResolveResult, Plugin } from 'esbuild-wasm';
import type { BundleConfigOptions } from '../configs/options';
import type { EVENTS } from '../configs/events';
import type { STATE } from '../configs/state';

import { getRequest } from '../../utils/fetch-and-cache';
import { decode } from '../../utils/encode-decode';

import { getCDNUrl, DEFAULT_CDN_HOST, getCDNStyle } from '../../utils/util-cdn';
import { inferLoader } from '../../utils/loader';

import { urlJoin, extname, isBareImport } from "../../utils/path";
import { CDN_RESOLVE } from './cdn';

/** HTTP Plugin Namespace */
export const HTTP_NAMESPACE = 'http-url';

/**
 * Fetches packages
 * 
 * @param url package url to fetch
 * @param logger Console log
 */
export const fetchPkg = async (url: string, events: typeof EVENTS) => {
  try {
    let response = await getRequest(url);
    if (!response.ok)
      throw new Error(`Couldn't load ${response.url} (${response.status} code)`);

    events.emit("logger.info", `Fetch ${url}`);

    return {
      url: response.url,
      content: new Uint8Array(await response.arrayBuffer()),
    };
  } catch (err) {
    throw new Error(`[getRequest] Failed at request (${url})\n${err.toString()}`);
  }
};

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
export const fetchAssets = async (path: string, content: Uint8Array, namespace: string, events: typeof EVENTS, config: BundleConfigOptions) => {
  const rgx = /new URL\(['"`](.*)['"`],(?:\s+)?import\.meta\.url(?:\s+)?\)/g;
  const parentURL = new URL("./", path).toString();
  const FileSystem = config.filesystem; 

  const code = decode(content);
  const matches = Array.from(code.matchAll(rgx)) as RegExpMatchArray[];

  const promises = matches.map(async ([, assetURL]) => {
    let { content: asset, url } = await fetchPkg(urlJoin(parentURL, assetURL), events);

    // Create a virtual file system for storing assets
    // This is for building a package bundle analyzer 
    FileSystem.set(namespace + ":" + url, content);

    return {
      path: assetURL, contents: asset,
      get text() { return decode(asset); }
    };
  });

  return await Promise.allSettled(promises);
};

/**
 * Resolution algorithm for the esbuild HTTP plugin
 * 
 * @param host The default host origin to use if an import doesn't already have one
 * @param logger Console log
 */
export const HTTP_RESOLVE = (host = DEFAULT_CDN_HOST, events: typeof EVENTS) => {
  return async (args: OnResolveArgs): Promise<OnResolveResult> => {
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
        urlJoin(args.pluginData?.url ? args.pluginData?.url : host, "../", argPath)
      ).origin;

      // npm standard CDNs, e.g. unpkg, skypack, esm.sh, etc...
      let NPM_CDN = getCDNStyle(pathOrigin) == "npm";
      let origin = NPM_CDN ? pathOrigin : host;

      // If the import is a bare import, use the CDN plugins resolution algorithm
      if (isBareImport(argPath)) {
        return CDN_RESOLVE(origin, events)(args);
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
 * @param host The default host origin to use if an import doesn't already have one
 * @param logger Console log
 */
export const HTTP = (events: typeof EVENTS, state: typeof STATE, config: BundleConfigOptions): Plugin => {
  // Convert CDN values to URL origins
  let { origin: host } = !/:/.test(config?.cdn) ? getCDNUrl(config?.cdn + ":") : getCDNUrl(config?.cdn);
  const FileSystem = config.filesystem;
  const assets = state.assets ?? [];
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
      build.onResolve({ filter: /.*/, namespace: HTTP_NAMESPACE }, HTTP_RESOLVE(host, events));

      // When a URL is loaded, we want to actually download the content
      // from the internet. This has just enough logic to be able to
      // handle the example import from https://cdn.esm.sh/ but in reality this
      // would probably need to be more complex.
      build.onLoad({ filter: /.*/, namespace: HTTP_NAMESPACE }, async (args) => {
        // Some typescript files don't have file extensions but you can't fetch a file without their file extension
        // so bundle tries to solve for that
        let ext = extname(args.path);
        let argPath = (suffix = "") => ext.length > 0 ? args.path : args.path + suffix;
        let content: Uint8Array, url: string;

        try {
          // Fetch the path without the `.ts` extension
          ({ content, url } = await fetchPkg(argPath(), events));
        } catch (err) {
          // If the ^ above fetch doesn't work, try again with a `.ts` extension
          // Some typescript files don't have file extensions but you can't fetch a file without their file extension
          try {
            ({ content, url } = await fetchPkg(argPath(".ts"), events));
          } catch (e) {
            // If the ^ above fetch doesn't work, try again with a `.tsx` extension
            // Some typescript files use `.tsx`
            try {
              ({ content, url } = await fetchPkg(argPath(".tsx"), events));
            } catch (e) {
              events.emit("logger.error", e.toString());
              throw err;
            }
          }
        }

        // Create a virtual file system for storing node modules
        // This is for building a package bundle analyzer 
        await FileSystem.set(args.namespace + ":" + args.path, content);

        let _assetResults =
          (await fetchAssets(url, content, args.namespace, events, config))
            .filter((result) => {
              if (result.status == "rejected") {
                events.emit("logger:warn", "Asset fetch failed.\n" + result?.reason?.toString());
                return false;
              } else return true;
            })
            .map((result) => {
              if (result.status == "fulfilled")
                return result.value;
            });

        state.assets = assets.concat(_assetResults);
        return {
          contents: content,
          loader: inferLoader(url),
          pluginData: { url, pkg: args.pluginData?.pkg },
        };
      });
    },
  };
};