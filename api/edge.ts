import type { BuildConfig } from "../bundlejs/src/index";
import { parseSearchQuery, parseConfig } from "../src/ts/util/parse-query";

import ESBUILD_WASM from "../bundlejs/src/wasm";
import { build, compress, setFile, deepAssign, TheFileSystem, createConfig } from "../bundlejs/src/index";
import { getWASM } from "../bundlejs/src/deno/denoflate/mod";

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
getWASM();

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
    const configObj = deepAssign({}, initialConfig, {
      entryPoints: ["/index.tsx"],
      esbuild: {
        treeShaking: true
      },
      init: {
        platform: "browser",
        worker: false,
        wasmModule
      },
    } as BuildConfig);

    const result = await build(configObj);
    const size = await compress(result.contents.map(x => x.contents), configObj);

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
