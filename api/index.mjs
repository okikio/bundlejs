import 'cross-fetch/dist/node-polyfill.js';

import { withCache } from "ultrafetch";
const tempFetch = globalThis.fetch;
globalThis.fetch = withCache(tempFetch);
const fetch = globalThis.fetch;

import { init, build, getSize, PLATFORM_AUTO, setFile, parseConfig, DefaultConfig, deepAssign, parseShareQuery } from "../bundlejs/lib/index.cjs";

// import type { BundleConfigOptions } from "../bundlejs/src/index"
// import type { VercelRequest, VercelResponse } from '@vercel/node';

export const inputModelResetValue = [
  'export * from "@okikio/animate";'
].join("\n");

const timeFormatter = new Intl.RelativeTimeFormat("en", {
  style: "narrow",
  numeric: "auto",
});

export default async function handler(request, response) {
  try {
    const start = performance.now();

    const url = new URL(request.url, `http://${request.headers.host}`);
    const initialValue = parseShareQuery(url) || inputModelResetValue;
    const initialConfig = parseConfig(url) || {};

    setFile("/index.tsx", initialValue);

    const config = deepAssign({
      entryPoints: ["/index.tsx"],
      esbuild: {
        treeShaking: true
      },
      init: {
        platform: PLATFORM_AUTO
      }
    }, DefaultConfig, initialConfig);
    console.log(initialValue)

    const result = await build(config);
    const size = await getSize(result.contents);

    const end = performance.now();

    response.setHeader('Cache-Control', 'max-age=10, s-maxage=8640, stale-while-revalidate');
    return response.status(200).json({
      query: request.query,
      config,
      input: initialValue,
      size: {
        type: size.type,

        totalByteLength: size.totalByteLength,
        totalCompressedSize: size.totalCompressedSize,

        initialSize: size.initialSize,
        size: size.size
      },
      time: timeFormatter.format((end - start) / 1000, "seconds")
    });
  } catch (e) {
    console.error(e)
    return response.status(400).json({ error: e.toString() });
  }
}
