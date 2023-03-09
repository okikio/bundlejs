#!/usr/bin/env -S deno run --unstable -A --config deno.jsonc
import { serve } from "https://deno.land/std/http/server.ts";

// @ts-ignore Workers are undefined
const worker = globalThis?.Worker;
// @ts-ignore Workers are undefined
globalThis.Worker = worker ?? class {
  constructor() {}
};

import type { BuildConfig, CompressConfig } from "@bundlejs/core";
import { build, setFile, deepAssign, useFileSystem, createConfig, compress, lzstring } from "@bundlejs/core/src/index.ts";
import ESBUILD_WASM from "@bundlejs/core/src/wasm.ts";

import { createNotice } from "@bundlejs/core/src/utils/create-notice.ts";
import { parseShareURLQuery, parseConfig } from "./src/_parse-query.ts";
import styleText from "./style.ts";

const FileSystem = useFileSystem();
const timeFormatter = new Intl.RelativeTimeFormat("en", {
  style: "narrow",
  numeric: "auto",
});

const inputModelResetValue = [
  'export * from "@okikio/animate";'
].join("\n");

let WASM_MODULE: Uint8Array = await ESBUILD_WASM();
let wasmModule: WebAssembly.Module = new WebAssembly.Module(WASM_MODULE);
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

    const enableMetafile = analysisQuery ||
      metafileQuery ||
      Boolean(initialConfig?.analysis);

    const polyfillQuery = url.searchParams.has("polyfill");

    const configObj: BuildConfig & { compression?: CompressConfig } = deepAssign({ 
      polyfill: polyfillQuery,
      compression: createConfig("compress", initialConfig.compression),
    }, initialConfig, {
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

    let resultText = "";
    const { content: _content, ...size } = await compress(
      result.contents.map((x: { contents: Uint8Array; path: string; text: string }) => {
        if (x.path === "/index.js") { 
          resultText = x.text;
        }

        return x.contents;
      }),
      configObj.compression
    );

    const { init: _init, ...printableConfig } = createConfig("build", configObj);
    const duration = (end - start);

    const compressedResult = lzstring.compressToBase64(resultText || result.contents[0].text);
    return new Response(JSON.stringify({
      query: decodeURIComponent(url.search),
      rawQuery: encodeURIComponent(url.search),
      config: printableConfig,
      input: initialValue,
      size,
      time: timeFormatter.format(duration  / 1000, "seconds"),
      rawTime: duration,
      file: compressedResult,
      ...(result?.warnings?.length > 0 ? { warnings: [...await createNotice(result.warnings, "warning", false)] } : {}),
      ...(metafileQuery && result?.metafile ? { metafile: result?.metafile } : {})
    }), {
      status: 200,
      headers: [
        ...headers,
        ['Cache-Control', 'max-age=30, s-maxage=30, public'],
        ['Content-Type', 'application/json']
      ],
    })
  } catch (e) {
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