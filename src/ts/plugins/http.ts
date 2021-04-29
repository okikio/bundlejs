// Based on https://github.com/hardfist/neo-tools/blob/main/packages/bundler/src/plugins/http.ts
import { Plugin } from 'esbuild';
import { HOST } from './bare';

export async function fetchPkg(url: string) {
    const res = await fetch(url);
    return {
        url: res.url,
        content: await res.text(),
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
                return {
                    path: new URL(args.path, args.importer).toString(),
                    namespace: HTTP_NAMESPACE,
                };
            });

            // When a URL is loaded, we want to actually download the content
            // from the internet. This has just enough logic to be able to
            // handle the example import from unpkg.com but in reality this
            // would probably need to be more complex.
            build.onLoad({ filter: /.*/, namespace: HTTP_NAMESPACE }, async (args) => {
                const { content, url } = await fetchPkg(args.path);
                console.log(url);

                return {
                    contents: content,
                    loader: 'ts',
                    resolveDir: `/${url}`, // a hack fix resolveDir problem
                };
            });
        },
    };
};