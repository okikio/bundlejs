import type { Plugin } from 'esbuild-wasm';
import type { BundleConfigOptions } from '../configs/options';
import type { EVENTS } from "../configs/events";
export declare const VIRTUAL_FILESYSTEM_NAMESPACE = "virtual-filesystem";
export declare const VIRTUAL_FS: (events: typeof EVENTS, config: BundleConfigOptions) => Plugin;
