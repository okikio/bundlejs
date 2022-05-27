export const ENABLE_ALL = Boolean(import.meta.env.ENABLE_ALL) ?? true;
export const ENABLE_SW = ENABLE_ALL ?? Boolean(import.meta.env.ENABLE_SW) ?? true;
export const USE_SHAREDWORKER = ENABLE_ALL ?? Boolean(import.meta.env.USE_SHAREDWORKER) ?? true;
export const PRODUCTION_MODE = ENABLE_ALL ?? Boolean(import.meta.env.PRODUCTION_MODE) ?? true;
