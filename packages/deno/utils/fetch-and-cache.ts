export const CACHE = new Map();
export const CACHE_NAME = 'EXTERNAL_FETCHES';

// @ts-ignore: ...
export const newRequest = async (cache: Cache, request: Request, fetchOpts?: RequestInit) => {
  const networkResponse: Response = await fetch(request, fetchOpts);
  const clonedResponse = networkResponse.clone();

  if ("caches" in globalThis)
    cache.put(request, clonedResponse);
  else
    CACHE.set(request, clonedResponse);

  return networkResponse;
};

// deno-lint-ignore no-inferrable-types
export const getRequest = async (url: RequestInfo | URL, permanent: boolean = false, fetchOpts?: RequestInit) => {
  const request = new Request(url.toString());
  let response: Response;

  // @ts-ignore: ...
  let cache: Cache;
  let cacheResponse: Response;

  // In specific situations the browser will sometimes disable access to cache storage, 
  // so, I create my own in memory cache
  if ("caches" in globalThis) {
    // @ts-ignore: ...
    cache = await caches.open(CACHE_NAME);
    cacheResponse = await cache.match(request);
  } else {
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
}
