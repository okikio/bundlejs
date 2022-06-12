import * as dntShim from "../_dnt.shims.js";
export const CACHE = new Map();
export const CACHE_NAME = 'EXTERNAL_FETCHES';
// @ts-ignore: ...
export const newRequest = async (cache, request, fetchOpts) => {
    const networkResponse = await dntShim.fetch(request, fetchOpts);
    const clonedResponse = networkResponse.clone();
    if ("caches" in dntShim.dntGlobalThis)
        cache.put(request, clonedResponse);
    else
        CACHE.set(request, clonedResponse);
    return networkResponse;
};
// deno-lint-ignore no-inferrable-types
export const getRequest = async (url, permanent = false, fetchOpts) => {
    const request = new dntShim.Request(url.toString());
    let response;
    // @ts-ignore: ...
    let cache;
    let cacheResponse;
    // In specific situations the browser will sometimes disable access to cache storage, 
    // so, I create my own in memory cache
    if ("caches" in dntShim.dntGlobalThis) {
        // @ts-ignore: ...
        cache = await caches.open(CACHE_NAME);
        cacheResponse = await cache.match(request);
    }
    else {
        cacheResponse = CACHE.get(request);
    }
    response = cacheResponse;
    // If permanent is true, use the cache first and only go to the network if there is nothing in the cache, 
    // otherwise, still use cache first, but in the background queue up a network request
    if (!cacheResponse)
        response = await newRequest(cache, request, fetchOpts);
    else if (!permanent)
        newRequest(cache, request, fetchOpts);
    return response.clone();
};
