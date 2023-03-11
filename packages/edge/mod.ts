#!/usr/bin/env -S deno run --unstable -A --config deno.jsonc
import type { BuildConfig, CompressConfig } from "@bundlejs/core";
import type { BundleResult } from "./bundle.ts";

import { Redis } from "https://deno.land/x/upstash_redis/mod.ts";
import { serve } from "https://deno.land/std/http/server.ts";

// @ts-ignore Workers are undefined
const worker = globalThis?.Worker;
// @ts-ignore Workers are undefined
globalThis.Worker = worker ?? class {
  constructor() {}
};

import { deepAssign, createConfig, lzstring, dispatchEvent, LOGGER_INFO, BUILD_CONFIG } from "@bundlejs/core/src/index.ts";
import ESBUILD_WASM from "@bundlejs/core/src/wasm.ts";

import { parseShareURLQuery, parseConfig } from "./parse-query.ts";
import { generateHTMLMessages, generateResult } from "./generate-result.ts";

import { bundle, inputModelResetValue } from "./bundle.ts";
import { clearFiles as clearGists, deleteFile as deleteGist } from "./gist.ts";
const { compressToBase64 } = lzstring;

export const headers = Object.entries({
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET"
})

export type Config = BuildConfig & { 
  compression?: CompressConfig,
  analysis?: boolean | string
};

let WASM_MODULE: Uint8Array = await ESBUILD_WASM();
let wasmModule: WebAssembly.Module = new WebAssembly.Module(WASM_MODULE);

serve(async (req: Request) => {
  try {
    const url = new URL(req.url);
    console.log(url.href)

    if (url.pathname === "/favicon.ico")
      return Response.redirect("https://bundlejs.com/favicon/favicon.ico");
      
    const redis = new Redis({
      url: Deno.env.get('UPSTASH_URL') ?? "",
      token: Deno.env.get('UPSTASH_TOKEN') ?? "",
    })

    if (url.pathname === "/clear-all-cache-123") {
      await redis.flushall()
      await clearGists();

      return new Response("Cleared entire cache...careful now.")
    }

    const initialValue = parseShareURLQuery(url) || inputModelResetValue;
    const { init: _, entryPoints: _2, ascii: _3, ...initialConfig } = (parseConfig(url) || {}) as Config;

    const metafileQuery = url.searchParams.has("metafile");
    const analysisQuery = url.searchParams.has("analysis");

    const badgeQuery = url.searchParams.has("badge");
    const polyfill = url.searchParams.has("polyfill");

    const enableMetafile = analysisQuery ||
      metafileQuery ||
      Boolean(initialConfig?.analysis);

    if (!WASM_MODULE) WASM_MODULE = await ESBUILD_WASM();
    if (!wasmModule) wasmModule = new WebAssembly.Module(WASM_MODULE);

    const configObj: Config = deepAssign(
      {},
      BUILD_CONFIG,
      {
        polyfill,
        compression: createConfig("compress", initialConfig.compression),
      } as Config,
      initialConfig, 
      {
        entryPoints: ["/index.tsx"],
        esbuild: enableMetafile ? {
          metafile: enableMetafile
        } : {},
        init: {
          platform: "deno-wasm",
          worker: false,
          wasmModule
        },
      } as Config
    );
    console.log(configObj)

    const jsonKey = `json-${
      compressToBase64(
        JSON.stringify({
          ...configObj,
          initialValue: initialValue.trim(),
        }).trim()
      ) // .slice(0, 512 - 1)
    }`;

    const badgeResult = url.searchParams.get("badge");
    const badgeStyle = url.searchParams.get("badge-style");
    const badgeKey = `badge-${
      compressToBase64(
        JSON.stringify({
          jsonKey,
          badge: badgeQuery,
          badgeResult,
          badgeStyle
        }).trim()
      ) // .slice(0, 512 - 1)
    }`;

    if (url.pathname === "/delete-cache") {
      try {
        const JSONResult = await redis.get<BundleResult>(jsonKey);
        await redis.del(jsonKey, badgeKey);
        if (JSONResult && JSONResult.fileId) { 
          await deleteGist(JSONResult.fileId); 
        }
        return new Response("Deleted from cache!");
      } catch (e) {
        console.warn(e);
        return new Response("Error, deleting from cache");
      }
    }

    if (url.pathname !== "/no-cache") {
      const BADGEResult = await redis.get<string>(badgeKey);
      if (badgeQuery && BADGEResult) {
        dispatchEvent(LOGGER_INFO, { badgeResult, badgeQuery, badgeStyle, BADGEResult })
        return new Response(BADGEResult, {
          status: 200,
          headers: [
            ...headers,
            ['Cache-Control', 'max-age=3600, s-maxage=30, public'],
            ['Content-Type', 'image/svg+xml']
          ],
        })
      }

      const start = Date.now();
      const JSONResult = await redis.get<BundleResult>(jsonKey);
      if (JSONResult) {
        return await generateResult(badgeKey, JSONResult, url, redis, true, Date.now() - start);
      }
    }

    const start = Date.now();
    const response = await bundle(url, initialValue, configObj);

    if (!response.ok) {
      const headers = response.headers;
      const status = response.status;
      return new Response(await response.arrayBuffer(), {
        headers,
        status
      });
    }

    const value: BundleResult = await response.json();

    const prevValue = await redis.get<BundleResult>(jsonKey);
    await redis.set(jsonKey, JSON.stringify(value), { ex: 86400 });
    if (!badgeQuery) await redis.del(badgeKey);

    if (prevValue) {
      const jsonPrevValue: BundleResult = typeof prevValue == "object" ? prevValue : JSON.parse(prevValue);
      if (typeof jsonPrevValue == "object" && jsonPrevValue.fileId) {
        await deleteGist(jsonPrevValue.fileId)
      }
    }

    return await generateResult(badgeKey, value, url, redis, false, Date.now() - start);
  } catch (e) {
    if ("msgs" in e && e.msgs) {
      try {
        return new Response(
          generateHTMLMessages(e.msgs as string[]),
          { 
            status: 404, 
            headers: [
              ['Content-Type', 'text/html']
            ]
          }
        )
      } catch (e) {
        console.warn({ msgsError: e })
      }
    }

    console.error(e)

    return new Response(
      JSON.stringify({ error: e.toString() }),
      { status: 400, }
    )
  }
});