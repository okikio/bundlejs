import type { BuildConfig, CompressConfig } from "@bundlejs/core";
import type { BundleResult } from "./bundle.ts";

import { Redis } from "upstash_redis";
import { serve } from "http";
import { dirname, fromFileUrl, join, extname, basename } from "path";

import { toUint8Array } from "base64";

// @ts-ignore Workers are undefined
const worker = globalThis?.Worker;
// @ts-ignore Workers are undefined
globalThis.Worker = worker ?? class {
  constructor() { }
};

import { deepAssign, createConfig, resolveVersion, lzstring, parsePackageName, dispatchEvent, LOGGER_INFO, BUILD_CONFIG } from "@bundlejs/core/src/index.ts";
import ESBUILD_WASM from "@bundlejs/core/src/wasm.ts";

import { parseShareURLQuery, parseConfig, parseTreeshakeExports } from "./parse-query.ts";
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

let WASM_MODULE: Uint8Array;
let wasmModule: WebAssembly.Module;

const encoder = new TextEncoder();

function convertQueryValue(str?: string | null) {
  if (str === "false") return false;
  if (str === "true") return true;
  return str;
}

const __dirname = dirname(fromFileUrl(import.meta.url))

// Define the directory where the .well-known files are stored
const wellKnownDir = "./.well-known/";
const PACKAGE_PREFIX = `json-package`;

function getPackageResultKey(str: string) {
  return `${str}-${PACKAGE_PREFIX}`
}

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
          ['Cache-Control', 'max-age=180, public'],
          ['Content-Type', ext === ".png" ? "image/png" : (ext === ".yaml" ? "text/yaml" : "application/json")]
        ],
      })
    }

    trackView(url.href, referer ?? "");

    const docsQuery = url.searchParams.has("docs");
    if (docsQuery) {
      trackEvent("redirect_to_docs", { type: "docs" }, url.href)
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
      trackEvent("clear-cache", { type: "clear-cache" }, url.href);
      const clearGists = url.searchParams.has("gist") || url.searchParams.has("gists");

      if (clearGists) {
        let breakIteration = false;
        const body = new ReadableStream({
          async start(controller) {
            controller.enqueue("Started clearing cache including gists!\n")
            await redis?.flushall()

            for await (const gists of listFiles()) {
              const files = gists.data;
              if (!files || files.length <= 0 || breakIteration) break;

              let log = '';
              await Promise.all(
                files.map(async (file: { id: string; }) => {
                  const id = file.id;
                  await deleteFile(id);
                  log += `Deleted ${id}\n`;
                })
              )

              console.log(log)
              controller.enqueue(log);
            }

            controller.enqueue("\nCleared entire cache + gists...careful now.")
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
      } else {
        if (redis) await redis.flushdb({ async: true })

        return new Response(`Started clearing cache!\n${!redis ? "Redis is unavailable, try again at a later date!" : "Cleared entire cache"}`, {
          headers: {
            "Content-Type": "text/plain",
            "x-content-type-options": "nosniff"
          },
        });
      }
    }

    const initialValue = parseShareURLQuery(url) || inputModelResetValue;
    const { init: _, entryPoints: _2, ansi: _3, ...initialConfig } = (parseConfig(url) || {}) as Config;

    const treeshakeQuery = url.searchParams.has("treehake");
    const treeshake = url.searchParams.get("treehake");
    const treeshakeArr = parseTreeshakeExports(
      decodeURIComponent(treeshake ?? "")
      .trim()
      // Replace multiple 2 or more spaces with just a single space
      .replace(/\s{2,}/, " ")
    ).map(x => x.trim())
    const uniqueTreeshakeArr = Array.from(new Set(treeshakeArr))
    // This treeshake pattern is what's required export all modules
    const exportAll = !treeshakeQuery || uniqueTreeshakeArr.every(x => /\*|{\s?default\s?}/.test(x))

    const metafileQuery = url.searchParams.has("metafile") || url.pathname === "/metafile";
    const analysisQuery = url.searchParams.has("analysis") ||
      url.searchParams.has("analyze") ||
      ["/analysis", "/analyze"].includes(url.pathname);

    const badgeQuery = url.searchParams.has("badge") || ["/badge", "/badge/raster", "/badge-raster"].includes(url.pathname);
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
          wasmModule
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
          .map(x => [
            x.replace(/^\((\w+)\)/, ""),
            /^\((\w+)\)/.exec(x)?.[1] ?? "export"
          ] as const)
          .filter(x => !/^https?\:\/\//.exec(x[0]))
          .map(async (x) => {
            const [pkgName, imported] = x;
            const { name = pkgName, version, path } = parsePackageName(pkgName, true)
            return [name, await resolveVersion(pkgName) ?? version, path, imported]
          })
    );

    const versions: string[] = [];
    const modules: [string, "import" | "export" | (string & {})][] = [];
    for (const version of versionsList) {
      if (version.status === "fulfilled" && version.value) {
        const [name, ver, path, imported] = version.value;
        versions.push(`${name}@${ver}`);
        modules.push([`${name}@${ver}${path}`, imported])
      }
    }

    console.log({
      query,
      modules,
      exportAll,
      shareQuery,
      textQuery
    })

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

    const badgeRasterQuery =
      url.searchParams.has("badge-raster") ||
      url.searchParams.has("png") ||
      ["/badge/raster", "/badge-raster"].includes(url.pathname);

    const badgeKey = `badge-${jsonKey}`;
    const badgeIDObj = {     
      jsonKey,

      badgeRasterQuery,
      badgeResult,
      badgeStyle
    };
    const badgeID = `${
      compressToBase64(
        JSON.stringify(badgeIDObj).trim()
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
          console.log(`Deleting ${badgeKey}\n`)
          const JSONResult = await redis.get<BundleResult>(jsonKey);

          const [moduleName] = modules[0];
          const PackageResult = await redis.get<BundleResult>(getPackageResultKey(moduleName));

          await redis.del(jsonKey, badgeKey, getPackageResultKey(moduleName));
          console.log(`Deleting "${getPackageResultKey(moduleName)}" and ${jsonKey}\n`)

          if (JSONResult && JSONResult.fileId) {
            await deleteGist(JSONResult.fileId);
            console.log("Deleting `jsonKey` gist")
          }

          if (
            JSONResult && PackageResult && 
            PackageResult.fileId && JSONResult.fileId && 
            JSONResult?.fileId !== PackageResult?.fileId
          ) {
            await deleteGist(PackageResult.fileId);
            console.log("Deleting `packageResult` gist")
          }

          console.log(`Deleted ${badgeKey}`)
          return new Response("Deleted from cache!");
        } catch (e) {
          console.warn(e);
          trackEvent("error-deleting-cache", {
            type: "error-deleting-cache",
            jsonKeyObj,
            badgeIDObj,
            badgeID,
            badge: badgeQuery,
            badgeKey,
            jsonKey
          }, url.href)
          return new Response("Error, deleting from cache");
        }
      }

      if (url.pathname !== "/no-cache") {
        const BADGEResult = await redis.hget<string>(badgeKey, badgeID);
        const JSONResult = await redis.get<BundleResult>(jsonKey);

        if (badgeQuery && BADGEResult && JSONResult) {
          dispatchEvent(LOGGER_INFO, { badgeResult, badgeQuery, badgeStyle, badgeRasterQuery })
          trackEvent("use-cached-badge", {
            type: "use-cached-badge",
            jsonKeyObj,
            badgeIDObj,
            badgeID,
            badge: badgeQuery,
          }, url.href)

          return new Response(badgeRasterQuery ? toUint8Array(BADGEResult) : BADGEResult, {
            status: 200,
            headers: [
              ...headers,
              ['Cache-Control', 'max-age=36, public'],
              ['Content-Type', badgeRasterQuery ? "image/png" : 'image/svg+xml']
            ],
          })
        } else if (badgeQuery && !JSONResult) {
          // Pre-emptively delete badges to avoid them becoming stale
          await redis.del(badgeKey);
        }

        const start = Date.now();
        const fileCheck = url.searchParams.has("file") || url.pathname === "/file";
        const fileQuery = fileCheck ? JSONResult?.fileId : true;
        if (JSONResult && fileQuery) {
          trackEvent("generate-from-cache-json", {
            type: "generate-from-cache-json",
            jsonKeyObj
          }, url.href)
          return await generateResult([badgeKey, badgeID], [JSONResult, undefined], url, true, Date.now() - start, redis);
        } else if (modules.length === 1 && exportAll && !(shareQuery || textQuery)) {
          const [moduleName, mode] = modules[0];
          if (mode === "export") {
            const PackageResult = await redis.get<BundleResult>(getPackageResultKey(moduleName));
            const fileQuery = fileCheck ? PackageResult?.fileId : true;
            if (PackageResult && fileQuery) {
              trackEvent("generate-from-package-cache-json", {
                type: "generate-from-package-cache-json",
                packageResultKey: getPackageResultKey(moduleName),
                jsonKeyObj
              }, url.href)
              console.log({
                type: "generate-from-package-cache-json",
                packageResultKey: getPackageResultKey(moduleName),
                jsonKeyObj
              })
              return await generateResult([badgeKey, badgeID], [PackageResult, undefined], url, true, Date.now() - start, redis);
            }
          }
        }
      }
    } catch (e) {
      trackEvent("error-using-cache", {
        type: "error-using-cache",
        jsonKey,
        jsonKeyObj,
        badgeKey,
        badgeIDObj,
        badgeID,
        badge: badgeQuery,
      }, url.href)
      console.warn('error-using-cache: ', e)
    }

    const start = Date.now();
    if (!WASM_MODULE) {
      WASM_MODULE = await ESBUILD_WASM();
      trackEvent("flushed-wasm", { type: "flushed-wasm-source", }, url.href)
    }
    if (!wasmModule) {
      wasmModule = new WebAssembly.Module(WASM_MODULE);
      trackEvent("flushed-wasm", { type: "flushed-wasm-module", }, url.href)
    }

    const [response, resultText] = await bundle(url, initialValue, configObj, versions, modules, query);

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

      if (modules.length === 1 && exportAll && !(shareQuery || textQuery)) {
        const [moduleName, mode] = modules[0];
        if (mode === "export") {
          await redis.set(getPackageResultKey(moduleName), JSON.stringify(value));
        }
      }

      await redis.del(badgeKey);
      if (prevValue) {
        const jsonPrevValue: BundleResult = typeof prevValue === "object" ? prevValue : JSON.parse(prevValue);
        if (typeof jsonPrevValue === "object" && jsonPrevValue.fileId) {
          await deleteGist(jsonPrevValue.fileId)
        }
      }
    } catch (e) {
      console.warn(e)
    }

    return await generateResult([badgeKey, badgeID], [value, resultText], url, false, Date.now() - start, redis);
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