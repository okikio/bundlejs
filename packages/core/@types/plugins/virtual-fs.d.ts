import type { BuildConfig, LocalState } from "../build.ts";
import type { StateArray } from "../configs/state.ts";
import type { EVENTS } from "../configs/events.ts";
import type { ESBUILD } from "../types.ts";
export declare const VIRTUAL_FILESYSTEM_NAMESPACE = "virtual-filesystem";
export declare const VIRTUAL_FS: (events: typeof EVENTS, state: StateArray<LocalState>, config: BuildConfig) => ESBUILD.Plugin;
