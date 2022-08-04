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

init({
  platform: PLATFORM_AUTO
});

export default async function handler(request, response) {
  try {
    const url = new URL(request.url, `http://${request.headers.host}`);
    const initialValue = parseShareQuery(url) || inputModelResetValue;
    const initialConfig = parseConfig(url) || {};
    const urlQuery = encodeURIComponent(`https://bundlejs.com/${url.search}`);

    setFile("/index.tsx", initialValue);

    const config = deepAssign({
      entryPoints: ["/index.tsx"],
      esbuild: {
        treeShaking: true
      },
      init: {
        platform: "browser" // PLATFORM_AUTO
      }
    }, DefaultConfig, initialConfig);

    const result = await build(config);
    const size = await getSize(result.contents);

    const imgShield = await fetch(`https://img.shields.io/badge/bundlejs-${encodeURIComponent(size.size)}-blue?link=${urlQuery}&link=${urlQuery}`).then(res => res.text());
    response.setHeader('Cache-Control', 'max-age=120, s-maxage=86400, stale-while-revalidate');
    response.setHeader('Content-Type', 'image/svg+xml;charset=utf-8');
    return response.send(imgShield);
  } catch (e) {
    console.error(e);
    return response.status(400).json({ error: e.toString() });
  }
}
