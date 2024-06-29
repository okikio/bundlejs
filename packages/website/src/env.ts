import * as env from 'astro:env/client';

export const ENABLE_SW = env.PROD;
export const USE_SHAREDWORKER = env.PROD;
export const PRODUCTION_MODE = env.PROD;