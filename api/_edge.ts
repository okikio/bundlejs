import type { BuildConfig, CompressConfig, ESBUILD } from "../bundlejs/src/index";
import { parseSearchQuery, parseConfig } from "../src/ts/util/parse-query";

import { analyze } from "../src/ts/plugins/analyzer/index";

import ESBUILD_WASM from "../bundlejs/src/wasm";
import { build, compress, setFile, deepAssign, TheFileSystem, createConfig } from "../bundlejs/src/index";

import { TextEncoder as Encoder, TextDecoder as Decoder } from 'text-encoding-shim';

type EncoderType = typeof globalThis.TextEncoder;
type DecoderType = typeof globalThis.TextDecoder;

globalThis.performance = globalThis.performance ?? { now: Date.now } as Performance;
globalThis.TextEncoder = globalThis.TextEncoder ?? Encoder as unknown as EncoderType;
globalThis.TextDecoder = globalThis.TextDecoder ?? Decoder as unknown as DecoderType;
globalThis.location = globalThis.location ?? new URL("http://localhost:3000/") as unknown as Location;

const timeFormatter = new Intl.RelativeTimeFormat("en", {
  style: "narrow",
  numeric: "auto",
});

const inputModelResetValue = [
  'export * from "@okikio/animate";'
].join("\n");

export const config = {
  runtime: 'edge', // this is a pre-requisite
};

let WASM_MODULE: Uint8Array;
export default async function handler(req: Request) {
  try {
    const fs = await TheFileSystem;
    const start = performance.now();

    const url = new URL(req.url);
    const initialValue = parseSearchQuery(url) || inputModelResetValue;
    const { init: _, entryPoints: _2, ascii: _3, ...initialConfig } = parseConfig(url) || {};

    setFile(fs, "/index.tsx", initialValue);

    if (!WASM_MODULE) WASM_MODULE = await ESBUILD_WASM();
    const wasmModule = new WebAssembly.Module(WASM_MODULE);
    const configObj: BuildConfig & CompressConfig = deepAssign({}, initialConfig, {
      entryPoints: ["/index.tsx"],
      esbuild: {
        treeShaking: true,
        metafile: url.searchParams.has("analysis") ||
          url.searchParams.has("metafile") ||
          // @ts-ignore
          Boolean(configObj?.analysis)
      },
      init: {
        platform: "browser",
        worker: false,
        wasmModule
      },
    } as BuildConfig);
    const result = await build(configObj);

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

    const size = await compress(result.contents.map(x => x.contents), configObj);
    if (url.searchParams.has("badge")) {
      const urlQuery = encodeURIComponent(`https://bundlejs.com/${url.search}`);
      const imgShield = await fetch(`https://img.shields.io/badge/bundlejs-${encodeURIComponent(size.size)}-blue?link=${urlQuery}&link=${urlQuery}`).then(res => res.text());
      return new Response(imgShield, {
        status: 200,
        headers: [
          ['Cache-Control', 'max-age=8640, s-maxage=86400, public'],
          ['Content-Type', 'image/svg+xml']
        ],
      })
    }

    // @ts-ignore
    if (url.searchParams.has("analysis") || configObj?.analysis) {
      // A list of compressed input files and chunks, 
      // by default output files are already compressed but input files aren't so we need to manually transform them in order to ensure accuracy
      let inputFiles: ESBUILD.OutputFile[] = [];
      const encoder = new TextEncoder();
      const decoder = new TextDecoder();

      const fileMap = await fs.files() as Map<string, Uint8Array>;
      for (let [path, contents] of fileMap.entries()) {
        if (!contents) continue;

        // For debugging reasons, if the user chooses verbose, print all the content to the devtools console
        let ignoreFile = /\.(wasm|png|jpeg|webp)$/.test(path);
        console.log(`Analyze ${path}${configObj?.esbuild?.logLevel == "verbose" && !ignoreFile ? "\n" + decoder.decode(contents) : ""}`);

        inputFiles.push({
          path,
          contents: contents,
          get text() {

          // This minifies & compresses input files for a accurate view of what is eating up the most size
          // It uses the esbuild options to determine how it should minify input code
            return decoder.decode(contents)
          }
        });
      }

      // List of all files in use
      let files = ([] as ESBUILD.OutputFile[])
        .concat(result.contents)
        .concat(inputFiles);
      
      const { type } = createConfig("compress", configObj);

      // Generate Iframe Chart
      if (result?.metafile) {
        console.log("Generating Bundle Analysis 📊");

        const analysis = await analyze(
          result?.metafile, files,
          {
            // @ts-ignore
            template: typeof configObj?.analysis == "string" ? configObj?.analysis : "treemap",
            gzipSize: type == "gzip",
            brotliSize: type == "brotli"
          },
          console.log
        );

        console.log("Finished Bundle Analysis ✨", "info");
        return new Response(analysis, {
          status: 200,
          headers: [
            ['Cache-Control', 'max-age=8640, s-maxage=86400, public'],
            ['Content-Type', 'text/html']
          ],
        })
      }
    }

    if (url.searchParams.has("metafile") && result?.metafile) {
        return new Response(JSON.stringify(result.metafile), {
        status: 200,
        headers: [
          ['Cache-Control', 'max-age=8640, s-maxage=86400, public'],
          ['Content-Type', 'application/json']
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
        type: size.type,

        totalInitialSize: size.initialSize,
        totalCompressedSize: size.totalCompressedSize,

        initialSize: size.initialSize,
        size: size.size
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
}
