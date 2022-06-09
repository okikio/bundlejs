export declare const CACHE: Map<any, any>;
export declare const CACHE_NAME = "EXTERNAL_FETCHES";
export declare const newRequest: (cache: Cache, request: Request, fetchOpts?: RequestInit) => Promise<Response>;
export declare const getRequest: (url: RequestInfo | URL, permanent?: boolean, fetchOpts?: RequestInit) => Promise<Response>;
