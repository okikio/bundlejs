import type { BuildConfig, CompressConfig } from "@bundlejs/core";
import type { BundleResult } from "./bundle.ts";

import { Redis } from "https://deno.land/x/upstash_redis@v1.20.2/mod.ts";
import { serve } from "https://deno.land/std@0.183.0/http/server.ts";
import { dirname, fromFileUrl, join, extname, basename } from "https://deno.land/std@0.182.0/path/mod.ts";

// @deno-type=npm:byte-base64
import { base64ToBytes } from "byte-base64";

// @ts-ignore Workers are undefined
const worker = globalThis?.Worker;
// @ts-ignore Workers are undefined
globalThis.Worker = worker ?? class {
  constructor() {}
};

import { deepAssign, createConfig, resolveVersion, lzstring, parsePackageName, dispatchEvent, LOGGER_INFO, BUILD_CONFIG } from "@bundlejs/core/src/index.ts";
import ESBUILD_WASM from "@bundlejs/core/src/wasm.ts";

import { parseShareURLQuery, parseConfig } from "./parse-query.ts";
import { generateHTMLMessages, generateResult } from "./generate-result.ts";

import { bundle, inputModelResetValue } from "./bundle.ts";
import { deleteFile, deleteFile as deleteGist, listFiles } from "./gist.ts";
import { trackEvent, trackView } from "./measure.ts";
const { compressToBase64 } = lzstring;

export const headers = Object.entries({
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET"
})

export type Config = BuildConfig & { 
  compression?: CompressConfig,
  analysis?: boolean | string,
  tsx?: boolean,
};

// let WASM_MODULE: Uint8Array;
// let wasmModule: WebAssembly.Module;

const encoder = new TextEncoder();

function convertQueryValue(str?: string | null) {
  if (str === "false") return false;
  if (str === "true") return true;
  return str;
} 

const __dirname = dirname(fromFileUrl(import.meta.url))

// Define the directory where the .well-known files are stored
const wellKnownDir = "./.well-known/";
serve(async (req: Request) => {
  try {
    const referer = req.headers.get("Referer") || req.headers.get("Referrer");
    const url = new URL(req.url);
    console.log(url.href)

    if (url.pathname === "/favicon.ico")
      return Response.redirect("https://bundlejs.com/favicon/favicon-api.ico");

    if (url.pathname.startsWith("/.well-known/")) {
      const ext = extname(url.pathname);
      const fileName = basename(url.pathname);
      return new Response(await Deno.readFile(join(__dirname, wellKnownDir, fileName)), {
        status: 200,
        headers: [
          ...headers,
          ['Cache-Control', 'max-age=3600, s-maxage=30, public'],
          ['Content-Type', ext === ".png" ? "image/png" : (ext === ".yaml" ? "text/yaml" : "application/json")]
        ],
      })
    }

    trackView(url.href, referer ?? "");

    const docsQuery = url.searchParams.has("docs");
    if (docsQuery) {
      trackEvent("redirect_to_docs",  { type: "docs" }, url.href)
      return Response.redirect("https://blog.okikio.dev/documenting-an-online-bundler-bundlejs#heading-configuration");
    }

    let redis: Redis | undefined | null;
    try {
      redis = new Redis({
        url: Deno.env.get('UPSTASH_URL') ?? "",
        token: Deno.env.get('UPSTASH_TOKEN') ?? "",
      })
    } catch (e) {
      console.warn(e)
    }

    if (redis === null || redis === undefined) {
      trackEvent("redis-unavailable", {
        type: "redis-unavailable"
      }, url.href)
    }

    if (url.pathname === "/clear-all-cache-123") {
      trackEvent("clear-cache", { type: "clear-cache" }, url.href)

      let breakIteration = false;
      const body = new ReadableStream({
        async start(controller) {
          controller.enqueue("Started clearing cache!\n")
          await redis?.flushall()

          for await (const gists of listFiles()) {
            const files = gists.data;
            if (!files || files.length <= 0 || breakIteration) break;

            let log = '';
            await Promise.all(
              files.map(async file => {
                const id = file.id;
                await deleteFile(id);
                log += `Deleted ${id}\n`;
              })
            )

            console.log(log)
            controller.enqueue(log);
          }

          controller.enqueue("\nCleared entire cache...careful now.")
          controller.close();
        },
        cancel() {
          breakIteration = true;
        },
      });
      
      return new Response(body
        .pipeThrough(new TextEncoderStream()), {
        headers: {
          "Content-Type": "text/plain",
          "x-content-type-options": "nosniff"
        },
      });
    }

    const initialValue = parseShareURLQuery(url) || inputModelResetValue;
    const { init: _, entryPoints: _2, ansi: _3, ...initialConfig } = (parseConfig(url) || {}) as Config;

    const metafileQuery = url.searchParams.has("metafile");
    const analysisQuery = url.searchParams.has("analysis") || 
      url.searchParams.has("analyze");

    const badgeQuery = url.searchParams.has("badge");
    const polyfill = url.searchParams.has("polyfill");

    const minifyQuery = url.searchParams.has("minify");
    const sourcemapQuery = url.searchParams.has("sourcemap");

    const tsxQuery = 
      url.searchParams.has("tsx") || 
      url.searchParams.has("jsx");

    const enableMetafile = analysisQuery ||
      metafileQuery ||
      Boolean(initialConfig?.analysis);

    const minifyResult = url.searchParams.get("minify");
    const minify = initialConfig?.esbuild?.minify ?? (
      minifyQuery ? 
        (minifyResult?.length === 0 ? true : convertQueryValue(minifyResult)) 
        : initialConfig?.esbuild?.minify
    );

    const sourcemapResult = url.searchParams.get("sourcemap");
    const sourcemap = initialConfig?.esbuild?.sourcemap ?? (
      sourcemapQuery ? 
        (convertQueryValue(sourcemapResult)) 
        : initialConfig?.esbuild?.sourcemap
    );
    
    const formatQuery = url.searchParams.has("format");
    const format = initialConfig?.esbuild?.format || url.searchParams.get("format");

    const configObj: Config = deepAssign(
      {},
      BUILD_CONFIG,
      {
        polyfill,
        compression: createConfig("compress", initialConfig.compression),
      } as Config,
      initialConfig, 
      {
        entryPoints: [`/index${tsxQuery || initialConfig.tsx ? ".tsx" : ".ts"}`],
        esbuild: deepAssign(
          {}, 
          enableMetafile ? { metafile: enableMetafile } : {},
          minifyQuery ? { minify } : {},
          sourcemapQuery ? { sourcemap } : {},
          formatQuery ? { format } : {},
        ),
        init: {
          platform: "deno-wasm",
          worker: false,
          // wasmModule
        },
      } as Config
    );
    console.log(configObj)

    const hasQuery = (
      url.searchParams.has("q") ||
      url.searchParams.has("query")
    );
    const shareQuery = url.searchParams.get("share");
    const textQuery = url.searchParams.get("text");
    const query = (
      (
        url.searchParams.get("q") ||
        url.searchParams.get("query")
      ) ?? "spring-easing"
    );
    const versionsList = await Promise.allSettled(
      !hasQuery && (shareQuery || textQuery) ? [] :
        query
          .split(",")
          .filter(x => !/^https?\:\/\//.exec(x))
          .map(async x => {
            const { name = x, version } = parsePackageName(x, true)
            return [name, await resolveVersion(x) ?? version]
          }) 
    );

    const versions: string[] = [];
    for (const version of versionsList) {
      if (version.status === "fulfilled" && version.value) {
        const [name, ver] = version.value;
        versions.push(`${name}@${ver}`);
      }
    }

    const { init, ..._configObj } = configObj;
    const { wasmModule: _wasmModule, ..._init } = init || {};
    const jsonKeyObj = {
      init: _init,
      ..._configObj,
      versions,
      initialValue: initialValue.trim(),
    };
    const jsonKey = `json-${
      compressToBase64(
        JSON.stringify(jsonKeyObj).trim()
      ) // .slice(0, 512 - 1)
    }`;

    const badgeResult = url.searchParams.get("badge");
    const badgeStyle = url.searchParams.get("badge-style");

    const badgeRasterQuery = url.searchParams.has("badge-raster");
    const badgeKeyObj = {
      jsonKey,
      badge: badgeQuery,

      badgeRasterQuery,
      badgeResult,
      badgeStyle
    };
    const badgeKey = `badge-${
      compressToBase64(
        JSON.stringify(badgeKeyObj).trim()
      ) // .slice(0, 512 - 1)
    }`;

    try {
      if (!redis) throw new Error("Redis not available");

      if (url.pathname === "/delete-cache") {
        trackEvent("delete-cache", {
          type: "delete-cache",
          badgeKey,
          jsonKey
        }, url.href)

        try {
          console.log(`Deleting ${badgeKey}`)
          const JSONResult = await redis.get<BundleResult>(jsonKey);
          await redis.del(jsonKey, badgeKey);
          if (JSONResult && JSONResult.fileId) { 
            await deleteGist(JSONResult.fileId); 
          }

          console.log(`Deleted ${badgeKey}`)
          return new Response("Deleted from cache!");
        } catch (e) {
          console.warn(e);
          trackEvent("error-deleting-cache", {
            type: "error-deleting-cache",
            jsonKeyObj,
            badgeKeyObj,
            badgeKey,
            jsonKey
          }, url.href)
          return new Response("Error, deleting from cache");
        }
      }

      if (url.pathname !== "/no-cache") {
        const BADGEResult = await redis.get<string>(badgeKey);
        if (badgeQuery && BADGEResult) {
          dispatchEvent(LOGGER_INFO, { badgeResult, badgeQuery, badgeStyle, badgeRasterQuery })
          trackEvent("use-cached-badge", {
            type: "use-cached-badge",
            jsonKeyObj,
            badgeKeyObj,
          }, url.href)

          return new Response(badgeRasterQuery ? base64ToBytes(BADGEResult) : BADGEResult, {
            status: 200,
            headers: [
              ...headers,
              ['Cache-Control', 'max-age=3600, s-maxage=30, public'],
              ['Content-Type', badgeRasterQuery ? "image/png" : 'image/svg+xml']
            ],
          })
        }

        const start = Date.now();
        const JSONResult = await redis.get<BundleResult>(jsonKey);
        const fileQuery = url.searchParams.has("file") ? JSONResult?.fileId : true;
        if (JSONResult && fileQuery) {
          trackEvent("generate-from-cache-json", {
            type: "generate-from-cache-json",
            jsonKeyObj
          }, url.href)
          return await generateResult(badgeKey, [JSONResult, undefined], url, true, Date.now() - start, redis);
        }
      }
    } catch (e) {
      trackEvent("error-using-cache", {
        type: "error-using-cache",
        jsonKey,
        jsonKeyObj,
        badgeKey,
        badgeKeyObj,
      }, url.href)
      console.warn('error-using-cache: ', e)
    }

    const start = Date.now();
    // if (!WASM_MODULE) { 
    //   WASM_MODULE = await ESBUILD_WASM();
    //   trackEvent("flushed-wasm", { type: "flushed-wasm-source", }, url.href)
    // }
    // if (!wasmModule) { 
    //   wasmModule = new WebAssembly.Module(WASM_MODULE);
    //   trackEvent("flushed-wasm", { type: "flushed-wasm-module", }, url.href)
    // }

    const [response, resultText] = await bundle(url, initialValue, configObj, versions, query);

    if (!response.ok) {
      const headers = response.headers;
      const status = response.status;
      return new Response(await response.arrayBuffer(), {
        headers,
        status
      });
    }

    const value: BundleResult = await response.json();

    try {
      if (!redis) throw new Error("Redis not available");
      
      const prevValue = await redis.get<BundleResult>(jsonKey);
      await redis.set(jsonKey, JSON.stringify(value), { ex: 86400 });
      if (!badgeQuery) await redis.del(badgeKey);

      if (prevValue) {
        const jsonPrevValue: BundleResult = typeof prevValue == "object" ? prevValue : JSON.parse(prevValue);
        if (typeof jsonPrevValue == "object" && jsonPrevValue.fileId) {
          await deleteGist(jsonPrevValue.fileId)
        }
      }
    } catch (e) {
      console.warn(e)
    }

    return await generateResult(badgeKey, [value, resultText], url, false, Date.now() - start, redis);
  } catch (e) {
    trackEvent("full-error", {
      type: "full-error",
      message: e.toString()
    })

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