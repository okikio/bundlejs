import type { BuildConfig, LocalState } from "../build";
import type { StateArray } from "../configs/state";
import type { EVENTS } from "../configs/events";
import type { ESBUILD } from "../types";
export declare const VIRTUAL_FILESYSTEM_NAMESPACE = "virtual-filesystem";
export declare const VIRTUAL_FS: (events: typeof EVENTS, state: StateArray<LocalState>, config: BuildConfig) => ESBUILD.Plugin;
