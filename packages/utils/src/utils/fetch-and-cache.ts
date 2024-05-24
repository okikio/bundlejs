import { LRU } from "./lru.ts";

/**
 * An LRU cache to store network responses with a capacity of 300 entries.
 */
export const CACHE = new LRU<Response>(300);

/**
 * The name of the cache used for storing external fetches.
 */
export const CACHE_NAME = "EXTERNAL_FETCHES";

/**
 * Boolean flag indicating if the Cache API is supported in the current environment.
 */
export const SUPPORTS_CACHE_API = "caches" in globalThis;

/**
 * Boolean flag indicating if the Request API is supported in the current environment.
 */
export const SUPPORTS_REQUEST_API = "Request" in globalThis;

/**
 * Generates a unique key for a given request URL.
 * 
 * @param request - The request info (URL or Request object).
 * @returns A unique string key for the request.
 */
export function requestKey(request: RequestInfo) {
  return SUPPORTS_REQUEST_API && request instanceof Request ? request.url.toString() : request.toString()
}

/**
 * Performs a network request and handles retries, caching, and response cloning.
 * 
 * @param request - The request info (URL or Request object).
 * @param options - Options for the request including cache, fetch options, cloning, and retry count.
 * @param options.retry - Number of retry attempts for the request (default is 3).
 * @param options.cache - The Cache object to store the response.
 * @param options.fetchOpts - Fetch options such as method, headers, etc.
 * @param options.clone - Whether to clone the response before returning (default is true).
 * @returns The network response, possibly cloned, or an error response if all retries fail.
 * 
 * Example usage:
 * ```ts
 * const response = await newRequest('https://example.com/api/data', { retry: 5 });
 * if (response.ok) {
 *   const data = await response.json();
 *   console.log(data);
 * } else {
 *   console.error('Failed to fetch data:', response.statusText);
 * }
 * ```
 */
export async function newRequest(
  request: RequestInfo,
  { cache, fetchOpts, clone = true, retry = 3 }:
    { retry?: number, cache?: Cache, fetchOpts?: RequestInit, clone?: boolean }
): Promise<Response | null> {
  const url = requestKey(request);  // Generate a unique key for the request URL
  let networkResponse: Response;

  for (let attempt = 0; attempt < retry; attempt++) {
    try {
      // Attempt to fetch the resource from the network
      networkResponse = await fetch(url, fetchOpts);

      // Check if the response status indicates success (2xx status codes)
      if (!networkResponse.ok) {
        throw new Error(`Failed to fetch ${request.toString()}: ${networkResponse.statusText}`);
      }

      // If the request is successful, break out of the retry loop
      break;
    } catch (error) {
      const err = error as Error;
      console.error(`Attempt ${attempt + 1} to fetch ${url} failed: ${err?.message}`);

      // If the last attempt also fails, return a Response object with an error state
      if (attempt === retry - 1) 
        return networkResponse!;
    }
  }

  // Only cache GET requests to avoid storing potentially sensitive data or modifying the cache unintentionally
  if (!fetchOpts?.method || (fetchOpts?.method && fetchOpts.method.toUpperCase() === "GET")) {
    try {
      // Check if the environment supports the Cache API and a cache object is provided
      if (SUPPORTS_CACHE_API && cache) {
        // Store the response in the provided cache object
        await cache.put(request, networkResponse!.clone());
      } else {
        // Fallback to a simple in-memory cache if Cache API is not supported
        CACHE.set(url, networkResponse!.clone());
      }
    } catch (err) {
      const cacheError = err as Error;
      console.error(`Failed to cache response for ${url}: ${cacheError?.message}`);
    }
  }

  // Clone the response if the clone option is set to true
  if (clone) {
    try {
      return networkResponse!.clone();
    } catch (err) {
      const cloneError = err as Error;
      console.error(`Failed to clone response for ${url}: ${cloneError?.message}`);
    }
  }

  // Return the original network response if cloning is not required or cloning fails
  return networkResponse!;
};

/**
 * A reference to an opened Cache object.
 */
export let OPEN_CACHE: Cache;

/**
 * Opens the named cache and returns the Cache object.
 * 
 * @returns The opened Cache object.
 */
export async function openCache(): Promise<Cache> {
  if (OPEN_CACHE) return OPEN_CACHE;
  return (OPEN_CACHE = await caches.open(CACHE_NAME));
}

/**
 * Retrieves a response from the cache or network, with optional permanent caching.
 * 
 * @param url - The URL or Request object for the resource.
 * @param permanent - Whether to use the cache permanently (default is false).
 * @param fetchOpts - Fetch options such as method, headers, etc.
 * @returns The network or cached response.
 * 
 * Example usage:
 * ```ts
 * const response = await getRequest('https://example.com/api/data', true);
 * if (response.ok) {
 *   const data = await response.json();
 *   console.log(data);
 * } else {
 *   console.error('Failed to fetch data:', response.statusText);
 * }
 * ```
 */
export async function getRequest(url: RequestInfo | URL, permanent = false, fetchOpts?: RequestInit): Promise<Response> {
  const request = SUPPORTS_REQUEST_API ? new Request(url.toString(), fetchOpts) : url.toString();
  let response: Response;

  let cache: Cache | undefined;
  let cacheResponse: Response | undefined;

  // In specific situations the browser will sometimes disable access to cache storage, 
  // so, we create our own in-memory cache as a fallback
  if (SUPPORTS_CACHE_API) {
    cache = await openCache();
    cacheResponse = await cache.match(request);
  } else {
    const reqKey = requestKey(request);
    cacheResponse = CACHE.get(reqKey);
  }

  // If a cached response is found, use it
  if (cacheResponse) {
    response = cacheResponse;
  } else {
    // If no cached response is found, perform a network request
    response = (await newRequest(request, { cache, fetchOpts }))!;
  }

  // If permanent is false, queue up a network request in the background to update the cache
  if (!permanent && cacheResponse) {
    newRequest(request, { cache, fetchOpts, clone: false });
  }

  return response;
}