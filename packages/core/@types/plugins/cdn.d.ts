import type { OnResolveArgs, OnResolveResult, Plugin } from 'esbuild-wasm';
import type { BundleConfigOptions } from '../configs/options';
import type { EVENTS } from '../configs/events';
import type { STATE } from '../configs/state';
/** CDN Plugin Namespace */
export declare const CDN_NAMESPACE = "cdn-url";
/**
 * Resolution algorithm for the esbuild CDN plugin
 *
 * @param cdn The default CDN to use
 * @param logger Console log
 */
export declare const CDN_RESOLVE: (cdn: string, events: typeof EVENTS) => (args: OnResolveArgs) => Promise<OnResolveResult>;
/**
 * Esbuild CDN plugin
 *
 * @param cdn The default CDN to use
 * @param logger Console log
 */
export declare const CDN: (events: typeof EVENTS, state: typeof STATE, config: BundleConfigOptions) => Plugin;
