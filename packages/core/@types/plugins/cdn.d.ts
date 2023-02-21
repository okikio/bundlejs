import type { BuildConfig, LocalState } from "../build.ts";
import type { StateArray } from "../configs/state.ts";
import type { EVENTS } from "../configs/events.ts";
import type { ESBUILD } from "../types.ts";
/** CDN Plugin Namespace */
export declare const CDN_NAMESPACE = "cdn-url";
/**
 * Resolution algorithm for the esbuild CDN plugin
 *
 * @param cdn The default CDN to use
 * @param logger Console log
 */
export declare const CDN_RESOLVE: (cdn: string, events: typeof EVENTS) => (args: ESBUILD.OnResolveArgs) => Promise<ESBUILD.OnResolveResult>;
/**
 * Esbuild CDN plugin
 *
 * @param cdn The default CDN to use
 * @param logger Console log
 */
export declare function CDN(events: typeof EVENTS, state: StateArray<LocalState>, config: BuildConfig): ESBUILD.Plugin;