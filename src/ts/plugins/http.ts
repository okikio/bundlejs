// Based on https://github.com/hardfist/neo-tools/blob/main/packages/bundler/src/plugins/http.ts
import type { Plugin } from 'esbuild';

import { extname } from "path";
import { getRequest } from '../util/cache';
import { inferLoader } from '../util/loader';
export async function fetchPkg(url: string) {
    let response = await getRequest(url);
    return {
        url: response.url,
        content: new Uint8Array(await response.arrayBuffer()),
    };
}

export const HTTP_NAMESPACE = 'http-url';
export const HTTP = (): Plugin => {
    return {
        name: 'http',
        setup(build) {
            // Intercept import paths starting with "http:" and "https:" so
            // esbuild doesn't attempt to map them to a file system location.
            // Tag them with the "http-url" namespace to associate them with
            // this plugin.
            build.onResolve({ filter: /^https?:\/\// }, args => {
                return {
                    path: new URL(args.path, args.resolveDir.replace(/^\//, '')).toString(),
                    namespace: HTTP_NAMESPACE,
                };
            });

            // We also want to intercept all import paths inside downloaded
            // files and resolve them against the original URL. All of these
            // files will be in the "http-url" namespace. Make sure to keep
            // the newly resolved URL in the "http-url" namespace so imports
            // inside it will also be resolved as URLs recursively.
            build.onResolve({ filter: /.*/, namespace: HTTP_NAMESPACE }, args => {
                let importer = args.importer;
                let pathUrl = args.path.replace(/\/$/, "/index"); // Some packages use "../../" which this is supposed to fix
                return {
                    path: new URL(pathUrl, importer).toString(),
                    namespace: HTTP_NAMESPACE,
                };
            });

            // When a URL is loaded, we want to actually download the content
            // from the internet. This has just enough logic to be able to
            // handle the example import from https://cdn.esm.sh/ but in reality this
            // would probably need to be more complex.
            build.onLoad({ filter: /.*/, namespace: HTTP_NAMESPACE }, async (args) => {
                const { content, url } = await fetchPkg(args.path);
                return {
                    contents: content,
                    loader: inferLoader(url),
                    resolveDir: `/${url}`, // a hack fix resolveDir problem
                };
            });
        },
    };
};