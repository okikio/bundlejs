import type { OnResolveArgs, OnResolveResult, Plugin } from 'esbuild-wasm';
import type { BundleConfigOptions } from '../configs/options';
import type { EVENTS } from '../configs/events';
import type { STATE } from '../configs/state';
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
export declare const ALIAS_RESOLVE: (aliases: {}, host: string, events: typeof EVENTS) => (args: OnResolveArgs) => Promise<OnResolveResult>;
/**
 * Esbuild ALIAS plugin
 *
 * @param aliases An object with package as the key and the package alias as the value, e.g. { "fs": "memfs" }
 * @param host The default host origin to use if an import doesn't already have one
 * @param logger Console log
 */
export declare const ALIAS: (events: typeof EVENTS, state: typeof STATE, config: BundleConfigOptions) => Plugin;
