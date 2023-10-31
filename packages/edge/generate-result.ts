import type { Redis } from "@upstash/redis";
import type { CompressionType } from "@bundlejs/core/src/compress.ts";
import type { BundleResult } from "./bundle.ts";

import { fromUint8Array } from "base64";

import { LOGGER_INFO, dispatchEvent, getEsbuild, ansi } from "@bundlejs/core/src/index.ts";
import { getFile } from "./gist.ts";
import { headers } from "./mod.ts";
import styleText from "./style.ts";

import { trackEvent } from "./measure.ts";

export const timeFormatter = new Intl.RelativeTimeFormat("en", {
  style: "narrow",
  numeric: "auto",
})

export const docs = {
  docs: `/?docs - Takes you to some docs for the API`,
  examples: [
    "(new) /?tsx or /?jsx",
    "(new) /?badge or /?badge=detailed or /?badge=minified",
    "(new) /?badge-style=for-the-badge",
    "(new) /?badge-raster",
    "(new) /?file",
    "(new) /?polyfill",
    `(new) /?analysis or /?analyze=verbose`,
    "(new) /?metafile",
    `(new) /?minify=false`,
    `(new) /?sourcemap=inline`,
    `(new) /?format=iife`,
    `(new) /?warnings`,
    `(new) /?raw`,
    "~~~",
    `/?q=spring-easing,(import)@okikio/emitter,(import)@okikio/animate,(import)@okikio/animate,(import)@okikio/animate,(import)@okikio/animate,@okikio/animate,typescript@beta,vue,react`,
    `/?treeshake=[SpringEasing],[T],[{ animate }],[{ animate as B }],[* as TR],[{ type animate }],[*],[*],[*],[*]`,
    `/?text="export * as PR18 from \"@okikio/animate\";\nexport { animate as animate2 } from \"@okikio/animate\";"`,
    `/?share=MYewdgziA2CmB00QHMAUAiAwiG6CUQA`,
    `/?config={"cdn":"skypack","compression":"brotli","esbuild":{"format":"cjs","minify":false,"treeShaking":false}}`,
  ],
  basics: [
    "(new) /?tsx or /?jsx - Support JSX and TSX. Used to be built-in but decided to make it optional, as it caused errors in non TSX packages",
    `(new) /?badge - Generates a badge (if you want more details, set \`?badge=detailed\` (to list the modules being bundled in the badge) or \`?badge=minified\` for the minified bundle size)`,
    `(new) /?badge-style - Various badge styles supported by http://shields.io (https://shields.io/#:~:text=PREFIX%3E%26suffix%3D%3CSUFFIX%3E-,Styles,-The%20following%20styles)`,
    `(new) /?badge-raster - The badge but as a png image`,
    `(new) /?file - Resulting bundled code(you can actually import this into your javascript file and start using it https://stackblitz.com/edit/vitejs-vite-iquaht?file=src%2Fmain.ts&terminal=dev)`,
    `(new) /?polyfill - Polyfill Node built-ins`,
    `(new) /?analysis or /?analyze - Esbuild generate visual analysis https://esbuild.github.io/api/#analyze`,
    `(new) /?metafile - Esbuild bundle metafile which can be used w / https://esbuild.github.io/analyze/ (hoping to have this built-in in the future)`,
    `(new) /?minify - Esbuild minify https://esbuild.github.io/api/#minify`,
    `(new) /?sourcemap - Esbuild sourcemap https://esbuild.github.io/api/#source-maps`,
    `(new) /?format - Esbuild format https://esbuild.github.io/api/#format`,
    `(new) /?warnings - Lists warning for a particular bundle`,
    `(new) /?raw - The raw result of the bundle (meant for experiments and/or testing)`,
    "~~~",
    `/?q or /?query - Represents the module, e.g. react, vue, etc... You can add (import) in-front of a specific module to make it an import instead of an export`,
    `/?treeshake - Represents the export/imports to treeshake. The treeshake syntax allows for specifying multiple exports per package (check the example above). The square brackets represent seperate packages, and everything inside the square brackets, are the exported methods, types, etc...`,
    `/?text - Represents the input code as a string (it's meant for short strings, we recommend using \`/?share\` for longer strings)`,
    `/?share - Represents \`compressed\` string version of the input code (it's used for large input code)`,
    `/?config - Represents the configurations to use when building the bundle (the docs cover the config in detail https://blog.okikio.dev/documenting-an-online-bundler-bundlejs#heading-configuration)`,
  ],
}

function sanitizeShieldsIO(str: string) {
  return str
    .replace(/\-/g, "--")
    .replace(/\_/g, "__")
    .replace(/\s/g, "_")
}

export async function generateResult([badgeKey, badgeID]: string[], [value, resultText]: [BundleResult, string | undefined], url: URL, cached: boolean, duration: number, redis?: Redis | null) {
  const noCache = ["/no-cache", "/clear-cache", "/delete-cache"].includes(url.pathname);
  const event_key = cached ? "cached-json-" : "json-";

  const analysisQuery = url.searchParams.has("analysis") ||
    url.searchParams.has("analyze") ||
    ["/analysis", "/analyze"].includes(url.pathname);

  const analysisResult = url.searchParams.get("analysis") || 
    url.searchParams.get("analyze");

  const metafileQuery = url.searchParams.has("metafile") ||
    url.pathname === "/metafile";
  const fileQuery = url.searchParams.has("file") || url.pathname === "/file";

  const badgeQuery = url.searchParams.has("badge") || ["/badge", "/badge/raster", "/badge-raster"].includes(url.pathname);
  const warningsQuery = url.searchParams.has("warnings") || 
    url.searchParams.has("warning") || ["/warnings"].includes(url.pathname);

  const rawQuery = url.searchParams.has("raw") || url.pathname === "/raw";

  const badgeResult = url.searchParams.get("badge");
  const badgeStyle = url.searchParams.get("badge-style");

  const badgeRasterQuery = url.searchParams.has("badge-raster") || url.searchParams.has("png") || ["/badge/raster", "/badge-raster"].includes(url.pathname);
  const query = (
    url.searchParams.get("q") || 
    url.searchParams.get("query")
  ) || "spring-easing";

  const queries = {
    query,
    analysisQuery,
    analysisResult,
    metafileQuery,
    fileQuery,
    badgeQuery,
    warningsQuery,
    rawQuery,
    badgeResult,
    badgeStyle,
    badgeRasterQuery,
  }

  if (badgeQuery) {    
    const { size } = value;
    const uncompressedBadge = /uncompress/.exec(badgeResult ?? "");
    const minifiedBadge = /minify|minified/.exec(badgeResult ?? "");
    const detailedBadge = /detail/.exec(badgeResult ?? "");

    trackEvent(event_key + "badge", {
      type: "badge-query",
      badgeKey,
      badgeID,
      queries,
      uncompressedBadge,
      minifiedBadge,
      detailedBadge,
      size,
      noCache
    }, url.href)

    const urlQuery = encodeURIComponent(`https://bundlejs.com/${url.search}`);
    const detailBadgeText = sanitizeShieldsIO(
      detailedBadge ? `${size.uncompressedSize} -> ` : ""
    );
    const detailBadgeName = sanitizeShieldsIO(
      `bundlejs${detailedBadge ? ` (${value.version ? value.version : value.versions?.join(", ") ?? query})` : ""}`
    );
    
    let badgeType: CompressionType | "minified" | "uncompressed" | undefined = size.type;
    let badgeBundleSize: string = size.compressedSize;

    if (minifiedBadge) {
      badgeType = "minified";
      badgeBundleSize = size.uncompressedSize;
    } else if (uncompressedBadge) {
      badgeType = "uncompressed";
      badgeBundleSize = size.uncompressedSize;
    }

    const imgUrl = new URL(
      `https://${badgeRasterQuery ? "raster.shields.io" : "img.shields.io"}/badge/${detailBadgeText}${sanitizeShieldsIO(`${badgeBundleSize} (${badgeType})`)}-${detailBadgeName}-blue?link=${urlQuery}`
    );

    if (badgeStyle) { imgUrl.searchParams.append("style", badgeStyle); }
    dispatchEvent(LOGGER_INFO, imgUrl.href)

    const imgFetch = await fetch(imgUrl);
    if (!imgFetch.ok) return imgFetch;

    const imgShield = badgeRasterQuery ? new Uint8Array(await imgFetch.arrayBuffer()) : await imgFetch.text();

    try {
      if (!redis) throw new Error("Redis not available");
      await redis.hset<string>(badgeKey, { 
        [badgeID]: typeof imgShield === "string" ? imgShield : fromUint8Array(imgShield) 
      })
    } catch (e) {
      console.warn(e);
    }

    return new Response(imgShield, {
      status: 200,
      headers: [
        ...headers,
        ['Cache-Control', `max-age=${30}, public`],
        ['Content-Type', badgeRasterQuery ? "image/png" : 'image/svg+xml']
      ],
    })
  }

  if (fileQuery) {
    const { fileId } = value;
    const fileResult = fileId ? await getFile(fileId) : resultText ?? " ";
    if (!fileId && !resultText) {
      throw new Error("The fileId was empty 🤔, hmm...maybe try again later, if this error persists please create an issue on https://github.com/okikio/bundlejs.")
    }

    if (fileResult === undefined) {
      throw new Error("Whoops we can't quite find the file you're looking for, please create an issue on https://github.com/okikio/bundlejs.")
    }

    trackEvent(event_key + "file", {
      type: "file-query",
      queries,
      usingGists: false,
      noCache
    }, url.href)
    return new Response(fileResult, {
      status: 200,
      headers: [
        ...headers,
        ['Cache-Control', `max-age=${noCache ? 30 : 720}, public`],
        ['Content-Type', 'text/javascript']
      ],
    })
  }

  if (analysisQuery && value.metafile) {
    const { analyzeMetafile } = await getEsbuild();
    const verboseAnlysis = analysisResult === "verbose";

    trackEvent(event_key + "analysis", {
      type: "analysis-query",
      queries,
      verboseAnlysis
    }, url.href)
    return new Response(
      generateHTMLMessages([
        ansi(
          (
            await analyzeMetafile(value.metafile, {
              color: true,
              verbose: verboseAnlysis
            })
          ) 
        )
      ]), 
      {
        status: 200,
        headers: [
          ...headers,
          ['Cache-Control', `max-age=${noCache ? 30 : 180}, public`],
          ['Content-Type', 'text/html']
        ],
      }
    )
  }

  if (metafileQuery && value.metafile) {
    trackEvent(event_key + "metafile", {
      type: "metafile-query",
      queries,
      noCache
    }, url.href)

    return new Response(JSON.stringify(value.metafile), {
      status: 200,
      headers: [
        ...headers,
        ['Cache-Control', `max-age=${noCache ? 30 : 180}, public`],
        ['Content-Type', 'application/json']
      ],
    })
  }

  if (warningsQuery) {
    trackEvent(event_key + "warnings", {
      type: "warnings-query",
      queries,
      noCache,
      numOfWarnings: value.warnings?.length ?? 0
    }, url.href)

    return new Response(generateHTMLMessages(value.warnings ?? ["No warnings for this bundle"]),
      {
        status: 200,
        headers: [
          ...headers,
          ['Cache-Control', `max-age=30, public`],
          ['Content-Type', 'text/html']
        ]
      }
    )
  }

  if (rawQuery) {
    trackEvent(event_key + "raw", {
      type: "raw-query",
      queries,
      noCache,
    }, url.href)

    return new Response(JSON.stringify(value), {
      status: 200,
      headers: [
        ...headers,
        ['Cache-Control', `max-age=30, public`],
        ['Content-Type', 'application/json']
      ],
    });
  }

  const { metafile: _metafile, warnings: _warnings, ...usefulInfo } = value;
  const addDocs = (url.search === "" ? docs : "");
  const finalResult = Object.assign({}, usefulInfo, addDocs, 
    cached ? {
      time: timeFormatter.format(duration / 1000, "seconds"),
      rawTime: duration
    } : null
  );

  trackEvent(event_key + "only-json", {
    type: "json-only-query",
    queries,
    noCache,
    addDocs,
    time: finalResult.time,
    rawTime: finalResult.rawTime
  }, url.href)
  
  return new Response(JSON.stringify(finalResult), {
    status: 200,
    headers: [
      ...headers,
      ['Cache-Control', 'max-age=720, public'],
      ['Content-Type', 'application/json']
    ],
  })
}

export function generateHTMLMessages(msgs: string[]) {
  return [
    `<style>${styleText}</style>`,
    `<pre>${msgs.join("\n")}</pre>`
  ].join("");
}