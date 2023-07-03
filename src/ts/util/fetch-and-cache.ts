export const CACHE = new Map();
export const CACHE_NAME = "EXTERNAL_FETCHES";
export const SUPPORTS_CACHE_API = "caches" in globalThis;
export const SUPPORTS_REQUEST_API = "Request" in globalThis;

export function requestKey(request: RequestInfo) {
    return SUPPORTS_REQUEST_API && request instanceof Request ? request.url.toString() : request.toString()
}

export async function newRequest(request: RequestInfo, cache?: Cache, fetchOpts?: RequestInit, clone = true) {
    const networkResponse: Response = await fetch(request, fetchOpts);

    if (!fetchOpts?.method || (fetchOpts?.method && fetchOpts.method.toUpperCase() !== "GET"))
        return networkResponse;

    if (clone) {
        const clonedResponse = networkResponse.clone();
        if (SUPPORTS_CACHE_API && cache) {
            cache.put(request, networkResponse);
        } else {
            const reqKey = requestKey(request);
            CACHE.set(reqKey, networkResponse);
        }

        return clonedResponse;
    }
    
    if (SUPPORTS_CACHE_API && cache) {
        cache.put(request, networkResponse);
    } else {
        const reqKey = requestKey(request);
        CACHE.set(reqKey, networkResponse);
    }
}

export let OPEN_CACHE: Cache;
export async function openCache() {
    if (OPEN_CACHE) return OPEN_CACHE;
    return (OPEN_CACHE = await caches.open(CACHE_NAME));
}

export async function getRequest(url: RequestInfo | URL, permanent = false, fetchOpts?: RequestInit) {
    const request = SUPPORTS_REQUEST_API ? new Request(url.toString(), fetchOpts) : url.toString();
    let response: Response;

    let cache: Cache | undefined;
    let cacheResponse: Response | undefined;

    // In specific situations the browser will sometimes disable access to cache storage, 
    // so, I create my own in memory cache
    if (SUPPORTS_CACHE_API) {
        cache = await openCache();
        cacheResponse = await cache.match(request);
    } else {
        const reqKey = requestKey(request);
        cacheResponse = CACHE.get(reqKey);
    }

    if (cacheResponse)
        response = cacheResponse;

    // If permanent is true, use the cache first and only go to the network if there is nothing in the cache, 
    // otherwise, still use cache first, but in the background queue up a network request
    if (!cacheResponse)
        response = await newRequest(request, cache, fetchOpts);
    else if (!permanent) {
        newRequest(request, cache, fetchOpts, false);
    }

    return response!;
}
