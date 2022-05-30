import type { OnResolveArgs, OnResolveResult, Plugin } from 'esbuild-wasm';
/** CDN Plugin Namespace */
export declare const CDN_NAMESPACE = "cdn-url";
/**
 * Resolution algorithm for the esbuild CDN plugin
 *
 * @param cdn The default CDN to use
 * @param logger Console log
 */
export declare const CDN_RESOLVE: (cdn?: string, logger?: {
    (...data: any[]): void;
    (...data: any[]): void;
}) => (args: OnResolveArgs) => Promise<OnResolveResult>;
/**
 * Esbuild CDN plugin
 *
 * @param cdn The default CDN to use
 * @param logger Console log
 */
export declare const CDN: (cdn: string, logger?: {
    (...data: any[]): void;
    (...data: any[]): void;
}) => Plugin;
