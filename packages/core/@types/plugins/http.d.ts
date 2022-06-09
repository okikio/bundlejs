/** Based on https://github.com/hardfist/neo-tools/blob/main/packages/bundler/src/plugins/http.ts */
import type { OnResolveArgs, OnResolveResult, Plugin } from 'esbuild-wasm';
import type { BundleConfigOptions } from '../configs/options';
import type { EVENTS } from '../configs/events';
import type { STATE } from '../configs/state';
/** HTTP Plugin Namespace */
export declare const HTTP_NAMESPACE = "http-url";
/**
 * Fetches packages
 *
 * @param url package url to fetch
 * @param logger Console log
 */
export declare const fetchPkg: (url: string, events: typeof EVENTS) => Promise<{
    url: string;
    content: Uint8Array;
}>;
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
export declare const fetchAssets: (path: string, content: Uint8Array, namespace: string, events: typeof EVENTS, config: BundleConfigOptions) => Promise<PromiseSettledResult<{
    path: string;
    contents: Uint8Array;
    readonly text: string;
}>[]>;
/**
 * Resolution algorithm for the esbuild HTTP plugin
 *
 * @param host The default host origin to use if an import doesn't already have one
 * @param logger Console log
 */
export declare const HTTP_RESOLVE: (host: string, events: typeof EVENTS) => (args: OnResolveArgs) => Promise<OnResolveResult>;
/**
 * Esbuild HTTP plugin
 *
 * @param assets Array to store fetched assets
 * @param host The default host origin to use if an import doesn't already have one
 * @param logger Console log
 */
export declare const HTTP: (events: typeof EVENTS, state: typeof STATE, config: BundleConfigOptions) => Plugin;