#!/usr/bin/env -S deno run --unstable -A --config deno.jsonc
import { serve } from "https://deno.land/std/http/server.ts";

const worker = globalThis?.Worker;
globalThis.Worker = worker ?? class {
  constructor() {}
};

import type { BuildConfig, CompressConfig } from "@bundlejs/core";
import { build, setFile, deepAssign, useFileSystem, createConfig, bytes } from "@bundlejs/core/src/index.ts";
import ESBUILD_WASM from "@bundlejs/core/src/wasm.ts";

import { parseShareURLQuery, parseConfig } from "./src/_parse-query.ts";

const FileSystem = useFileSystem();
const timeFormatter = new Intl.RelativeTimeFormat("en", {
  style: "narrow",
  numeric: "auto",
});

const inputModelResetValue = [
  'export * from "@okikio/animate";'
].join("\n");

let WASM_MODULE: Uint8Array = await ESBUILD_WASM();
let wasmModule = new WebAssembly.Module(WASM_MODULE);
import styleText from "./style.ts";
serve(async (req: Request) => {
  try {
    const fs = await FileSystem;
    const start = performance.now();

    const url = new URL(req.url);
    console.log(url.href)

    if (url.pathname === "/favicon.ico")
      return Response.redirect("https://bundlejs.com/favicon/favicon.ico");

    const initialValue = parseShareURLQuery(url) || inputModelResetValue;
    const { init: _, entryPoints: _2, ascii: _3, ...initialConfig } = parseConfig(url) || {};

    setFile(fs, "/index.tsx", initialValue);

    const metafileQuery = url.searchParams.has("metafile");
    const analysisQuery = url.searchParams.has("analysis");

    const fileQuery = url.searchParams.has("file");
    const badgeQuery = url.searchParams.has("badge");

    const enableMetafile = analysisQuery ||
      metafileQuery ||
      Boolean(initialConfig?.analysis);

    const polyfillQuery = url.searchParams.has("polyfill");

    const configObj: BuildConfig & CompressConfig = deepAssign({ polyfill: polyfillQuery }, initialConfig, {
      entryPoints: ["/index.tsx"],
      esbuild: enableMetafile ? {
        metafile: enableMetafile
      } : {},
      init: {
        platform: "deno-wasm",
        worker: false,
        wasmModule
      },
    } as BuildConfig);
    console.log({ configObj })

    if (!WASM_MODULE) WASM_MODULE = await ESBUILD_WASM();
    if (!wasmModule) wasmModule = new WebAssembly.Module(WASM_MODULE);
    const result = await build(configObj, FileSystem);
    const end = performance.now();

    const headers = Object.entries({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET"
    })

    if (metafileQuery && result?.metafile) {
      return new Response(JSON.stringify(result.metafile), {
        status: 200,
        headers: [
          ...headers,
          ['Cache-Control', 'max-age=30, s-maxage=30, public'],
          ['Content-Type', 'application/json']
        ],
      })
    }

    if (fileQuery) {
      const fileBundle = result.contents[0];
      return new Response(fileBundle.contents, {
        status: 200,
        headers: [
          ['Cache-Control', 'max-age=30, s-maxage=30, public'],
          ['Content-Type', 'text/javascript']
        ],
      })
    }

    // @ts-ignore
    const rawUncompressedSize = result.contents.reduce((acc, content) => acc + content.contents.byteLength, 0);
    const uncompressedSize = bytes(rawUncompressedSize) as string;

    const cs = new CompressionStream('gzip');
    // @ts-ignore
    const compressedStream = new Blob(result.contents.map(x => x.contents.buffer)).stream().pipeThrough(cs);
    const rawCompressedSize = new Uint8Array(await new Response(compressedStream).arrayBuffer()).byteLength;
    const compressedSize = bytes(rawCompressedSize);

    if (badgeQuery) {
      const detailedBadge = url.searchParams.get("badge")?.includes("detail");
      const urlQuery = encodeURIComponent(`https://bundlejs.com/${url.search}`);
      const query = url.searchParams.get("q") ?? "@okikio/animate";
      console.log({
        q: query
      })
      const detailBadgeText = detailedBadge ?
        encodeURIComponent(`${uncompressedSize} `) + "-->" + encodeURIComponent(` `) :
        "";
      const detailBadgeName = `bundlejs${
        detailedBadge ?encodeURIComponent(` (${query})`) : ""
      }`;
      const imgUrl = new URL(
        `https://img.shields.io/badge/${detailBadgeName}-${detailBadgeText}${
            encodeURIComponent(`${compressedSize} (gzip)`)
          }-blue?link=${urlQuery}`
      );
      const badgeStyle = url.searchParams.get("badge-style");
      if (badgeStyle) {
        imgUrl.searchParams.append("style", badgeStyle);
      }
      const imgShield = await fetch(imgUrl).then(res => res.text());
      return new Response(imgShield, {
        status: 200,
        headers: [
          ...headers,
          ['Cache-Control', 'max-age=30, s-maxage=30, public'],
          ['Content-Type', 'image/svg+xml']
        ],
      })
    }

    const duration = (end - start) / 1000;
    const { init: _init, ...printableConfig } = createConfig("build", configObj);
    return new Response(JSON.stringify({
      query: url.search,
      config: printableConfig,
      input: initialValue,
      size: {
        type: "gzip",

        rawUncompressedSize,
        uncompressedSize,
        
        rawCompressedSize,
        compressedSize,
      },
      time: timeFormatter.format(duration, "seconds"),
      rawTime: duration * 1000,
    }), {
      status: 200,
      headers: [
        ...headers,
        ['Cache-Control', 'max-age=30, s-maxage=30, public'],
        ['Content-Type', 'application/json']
      ],
    })
  } catch (e) {
    console.error(e)

    if ("msgs" in e) {
      try {
        // console.log("Reached error", styleText)
        return new Response([
          `<style>${styleText}</style>`,
          `<pre>${e.msgs.join("\n")}</pre>`
        ].join(""),
          { 
            status: 404, 
            headers: [
              ['Content-Type', 'text/html']
            ]
          }
        )
      } catch (e) {
        console.log({ msgsError: e })
      }
    }

    return new Response(
      JSON.stringify({ error: e.toString() }),
      { status: 400, }
    )
  }
});