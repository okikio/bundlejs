import type { Plugin } from 'esbuild-wasm';
import type { BundleConfigOptions } from '../configs/options';
import type { EVENTS } from "../configs/events";
import type { STATE } from '../configs/state';
export declare const VIRTUAL_FILESYSTEM_NAMESPACE = "virtual-filesystem";
export declare const VIRTUAL_FS: (events: typeof EVENTS, state: typeof STATE, config: BundleConfigOptions) => Plugin;
