#!/usr/bin/env -S deno run --unstable -A --config deno.jsonc
import { serve } from "https://deno.land/std/http/server.ts";

import type { BuildConfig, CompressConfig } from "@bundlejs/core";
import { build, setFile, deepAssign, useFileSystem, createConfig, bytes } from "@bundlejs/core/src/index.ts";

import { parseShareURLQuery, parseConfig } from "./src/_parse-query.ts";

const FileSystem = useFileSystem();
const timeFormatter = new Intl.RelativeTimeFormat("en", {
  style: "narrow",
  numeric: "auto",
});

const inputModelResetValue = [
  'export * from "@okikio/animate";'
].join("\n");

serve(async (req: Request) => {
  try {
    const fs = await FileSystem;
    const start = performance.now();

    const url = new URL(req.url);
    const initialValue = parseShareURLQuery(url) || inputModelResetValue;
    const { init: _, entryPoints: _2, ascii: _3, ...initialConfig } = parseConfig(url) || {};

    setFile(fs, "/index.tsx", initialValue);

    const configObj: BuildConfig & CompressConfig = deepAssign({}, initialConfig, {
      entryPoints: ["/index.tsx"],
      esbuild: {
        treeShaking: true,
        metafile: url.searchParams.has("analysis") ||
          url.searchParams.has("metafile") ||
          Boolean(initialConfig?.analysis)
      },
      init: {
        platform: "deno"
      },
    } as BuildConfig);
    console.log({ configObj })
    const result = await build(configObj, FileSystem);

    if (url.searchParams.has("file")) {
      const fileBundle = result.contents[0];
      return new Response(fileBundle.contents, {
        status: 200,
        headers: [
          ['Cache-Control', 'max-age=8640, s-maxage=86400, public'],
          ['Content-Type', 'text/javascript']
        ],
      })
    }

    // const size = await compress(result.contents.map(x => x.contents), configObj);
    const uncompressedSize = bytes(
      // @ts-ignore
      result.contents.reduce((acc, content) => acc + content.contents.byteLength, 0)
    ) as string;

    const cs = new CompressionStream('gzip');
    // @ts-ignore
    const compressedStream = new Blob(result.contents.map(x => x.contents.buffer)).stream().pipeThrough(cs);
    const compressedSize = bytes(new Uint8Array(await new Response(compressedStream).arrayBuffer()).byteLength);

    if (url.searchParams.has("badge")) {
      const urlQuery = encodeURIComponent(`https://bundlejs.com/${url.search}`);
      const imgShield = await fetch(`https://img.shields.io/badge/bundlejs-${encodeURIComponent(compressedSize)}-blue?link=${urlQuery}&link=${urlQuery}`).then(res => res.text());
      return new Response(imgShield, {
        status: 200,
        headers: [
          ['Cache-Control', 'max-age=8640, s-maxage=86400, public'],
          ['Content-Type', 'image/svg+xml']
        ],
      })
    }

    const end = performance.now();
    const { init: _init, ...printableConfig } = createConfig("build", configObj);
    return new Response(JSON.stringify({
      query: url.search,
      config: printableConfig,
      input: initialValue,
      size: {
        type: "gzip",

        uncompressedSize,
        compressedSize,
      },
      time: timeFormatter.format((end - start) / 1000, "seconds"),
      rawTime: (end - start) / 1000,
    }), {
      status: 200,
      headers: [
        ['Cache-Control', 'max-age=8640, s-maxage=86400, public'],
        ['Content-Type', 'application/json']
      ],
    })
  } catch (e) {
    console.error(e)

    return new Response(
      JSON.stringify({ error: e.toString() }),
      { status: 400, }
    )
  }
});