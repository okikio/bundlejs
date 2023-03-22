// @ts-ignore Workers are undefined
const worker = globalThis?.Worker;
// @ts-ignore Workers are undefined
globalThis.Worker = worker ?? class {
  constructor() { }
};

import type { createDefaultFileSystem, ESBUILD } from "@bundlejs/core";
import type { Config } from "./mod.ts";
import { headers } from "./mod.ts";
import { setFile as setGist } from "./gist.ts";

import { build, setFile, useFileSystem, createConfig, compress, resolveVersion } from "@bundlejs/core/src/index.ts";

import { createNotice } from "@bundlejs/core/src/utils/create-notice.ts";

const FileSystem = useFileSystem();
export const timeFormatter = new Intl.RelativeTimeFormat("en", {
  style: "narrow",
  numeric: "auto",
});

export type BundleResult = {
  query: string,
  rawQuery: string,
  config: Config
  input: string,
  version?: string,
  versions?: string[],
  size: Omit<Awaited<ReturnType<typeof compress>>, "content">,
  time: string,
  rawTime: number,
  fileId?: string,
  fileUrl?: string,
  fileHTMLUrl?: string,
  warnings?: string[],
  metafile?: ESBUILD.Metafile
}

export const inputModelResetValue = [
  'export * from "spring-easing";'
].join("\n");

export async function bundle(url: URL, initialValue: string, configObj: Config, versions: string[], query: string) {
  const fs = await FileSystem;
  const start = performance.now();

  setFile(fs, "/index.tsx", initialValue);

  const metafileQuery = url.searchParams.has("metafile");
  const analysisQuery = url.searchParams.has("analysis") ||
    url.searchParams.has("analyze");

  const enableMetafile = analysisQuery ||
    metafileQuery ||
    Boolean(configObj?.esbuild?.metafile);
  
  const result = await build(configObj, FileSystem);
  const end = performance.now();

  let resultValue: string = result.contents[0].text;
  const { content: _content, ...size } = await compress(
    result.contents.map((x: { contents: Uint8Array; path: string; text: string }) => { 
      if (x.path === "/index.js") resultValue = x.text;
      return x.contents
    }),
    configObj.compression
  );

  const { init: _init, ...printableConfig } = createConfig("build", configObj);
  const duration = (end - start);

  const { fileId, fileUrl, fileHTMLUrl } = await setGist(url.href, result.outputs) ?? {};
  const searchQueries = url.search || `?q=${query}`;
  const finalResult: BundleResult = {
    query: decodeURIComponent(searchQueries),
    rawQuery: encodeURIComponent(searchQueries),
    ...(versions.length === 1 ? { version: versions[0] } : { versions }),
    config: printableConfig,
    input: initialValue,
    size,
    time: timeFormatter.format(duration / 1000, "seconds"),
    rawTime: duration,
    ...(fileId ? { fileId } : {}),
    ...(fileUrl ? { fileUrl } : {}), 
    ...(fileHTMLUrl ? { fileHTMLUrl } : {}),
    ...(result?.warnings?.length > 0 ? { warnings: await createNotice(result.warnings, "warning", false) } : {}),
    ...(enableMetafile && result?.metafile ? { metafile: result?.metafile } : {})
  };

  (await (fs as ReturnType<typeof createDefaultFileSystem>).files()).reset();

  return [
    new Response(JSON.stringify(finalResult), {
      status: 200,
      headers: [
        ...headers,
        ['Cache-Control', 'max-age=30, s-maxage=30, public'],
        ['Content-Type', 'application/json']
      ],
    }),
    resultValue
  ] as const
}