import type { BuildConfig, LocalState } from "../build.ts";
import type { StateArray } from "../configs/state.ts";
import type { EVENTS } from "../configs/events.ts";
import type { ESBUILD } from "../types.ts";
/** Alias Plugin Namespace */
export declare const ALIAS_NAMESPACE = "alias-globals";
/**
 * Checks if a package has an alias
 *
 * @param id The package to find an alias for
 * @param aliases An object with package as the key and the package alias as the value, e.g. { "fs": "memfs" }
 */
export declare const isAlias: (id: string, aliases?: {}) => string | false;
/**
 * Resolution algorithm for the esbuild ALIAS plugin
 *
 * @param aliases An object with package as the key and the package alias as the value, e.g. { "fs": "memfs" }
 * @param host The default host origin to use if an import doesn't already have one
 * @param logger Console log
 */
export declare const ALIAS_RESOLVE: (aliases: {}, host: string, events: typeof EVENTS) => (args: ESBUILD.OnResolveArgs) => Promise<ESBUILD.OnResolveResult>;
/**
 * Esbuild ALIAS plugin
 *
 * @param aliases An object with package as the key and the package alias as the value, e.g. { "fs": "memfs" }
 * @param host The default host origin to use if an import doesn't already have one
 * @param logger Console log
 */
export declare const ALIAS: (events: typeof EVENTS, state: StateArray<LocalState>, config: BuildConfig) => ESBUILD.Plugin;
