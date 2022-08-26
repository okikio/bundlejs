export const env = import.meta?.env ?? globalThis?.process?.env ?? {};

export const ENABLE_ALL = "ENABLE_ALL" in env ? Boolean(env?.ENABLE_ALL) : true;
export const ENABLE_SW = "ENABLE_SW" in env ? Boolean(env?.ENABLE_SW) : (ENABLE_ALL ?? true);
export const USE_SHAREDWORKER = "USE_SHAREDWORKER" in env ? Boolean(env?.USE_SHAREDWORKER) : (ENABLE_ALL ?? true);
export const PRODUCTION_MODE = "PRODUCTION_MODE" in env ? Boolean(env?.PRODUCTION_MODE) : (ENABLE_ALL ?? true);
