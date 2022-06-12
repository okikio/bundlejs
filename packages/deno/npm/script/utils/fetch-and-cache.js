"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRequest = exports.newRequest = exports.CACHE_NAME = exports.CACHE = void 0;
const dntShim = __importStar(require("../_dnt.shims.js"));
exports.CACHE = new Map();
exports.CACHE_NAME = 'EXTERNAL_FETCHES';
// @ts-ignore: ...
const newRequest = async (cache, request, fetchOpts) => {
    const networkResponse = await dntShim.fetch(request, fetchOpts);
    const clonedResponse = networkResponse.clone();
    if ("caches" in dntShim.dntGlobalThis)
        cache.put(request, clonedResponse);
    else
        exports.CACHE.set(request, clonedResponse);
    return networkResponse;
};
exports.newRequest = newRequest;
// deno-lint-ignore no-inferrable-types
const getRequest = async (url, permanent = false, fetchOpts) => {
    const request = new dntShim.Request(url.toString());
    let response;
    // @ts-ignore: ...
    let cache;
    let cacheResponse;
    // In specific situations the browser will sometimes disable access to cache storage, 
    // so, I create my own in memory cache
    if ("caches" in dntShim.dntGlobalThis) {
        // @ts-ignore: ...
        cache = await caches.open(exports.CACHE_NAME);
        cacheResponse = await cache.match(request);
    }
    else {
        cacheResponse = exports.CACHE.get(request);
    }
    response = cacheResponse;
    // If permanent is true, use the cache first and only go to the network if there is nothing in the cache, 
    // otherwise, still use cache first, but in the background queue up a network request
    if (!cacheResponse)
        response = await (0, exports.newRequest)(cache, request, fetchOpts);
    else if (!permanent)
        (0, exports.newRequest)(cache, request, fetchOpts);
    return response.clone();
};
exports.getRequest = getRequest;
