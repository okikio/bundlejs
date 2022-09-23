export const env = import.meta.env;

export const ENABLE_SW = env.PROD;
export const USE_SHAREDWORKER = env.PROD;
export const PRODUCTION_MODE = env.PROD;