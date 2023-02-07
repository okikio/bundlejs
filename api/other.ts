export const config = {
  runtime: 'edge', // this is a pre-requisite
  // regions: ['iad1'], // only execute this function on iad1
};

// import { withCache } from "ultrafetch";
// const tempFetch = globalThis.fetch;
// globalThis.fetch = withCache(tempFetch);
// const fetch = globalThis.fetch;

import { init, build, getSize, PLATFORM_AUTO, setFile, parseConfig, DefaultConfig, deepAssign, parseShareQuery } from "../bundlejs/src/index";

// @ts-expect-error
import ESBUILD_WASM from "esbuild-wasm/esbuild.wasm?module";

// import type { BundleConfigOptions } from "../bundlejs/src/index"
// import type { VercelRequest, VercelResponse } from '@vercel/node';

export const inputModelResetValue = [
  'export * from "@okikio/animate";'
].join("\n");

const timeFormatter = new Intl.RelativeTimeFormat("en", {
  style: "narrow",
  numeric: "auto",
});

export default async function handler(req: Request) {
  try {
    const start = Date.now();

    const url = new URL(req.url);
    const initialValue = parseShareQuery(url) || inputModelResetValue;
    const initialConfig = parseConfig(url) || {};

    setFile("/index.tsx", initialValue);

    const config = deepAssign({
      entryPoints: ["/index.tsx"],
      esbuild: {
        treeShaking: true
      },
      init: {
        platform: PLATFORM_AUTO,
        wasmModule: ESBUILD_WASM,
      }
    }, DefaultConfig, initialConfig);
    console.log(initialValue)

    const result = await build(config);
    console.log({ result })
    // const size = await getSize(result.contents);

    const end = Date.now();

    return new Response(JSON.stringify({
      query: url.search,
      config,
      input: initialValue,
      size: {
        // type: size.type,

        // totalInitialSize: size.initialSize,
        // totalCompressedSize: size.totalCompressedSize,

        // initialSize: size.initialSize,
        // size: size.size
      },
      time: timeFormatter.format((end - start) / 1000, "seconds"),
      rawTime: (end - start) / 1000
    }), {
      status: 200,
      headers: [
        ['Cache-Control', 'max-age=10, s-maxage=8640, stale-while-revalidate'],
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
