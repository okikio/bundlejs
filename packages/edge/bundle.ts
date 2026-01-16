// @ts-ignore Workers are undefined
const worker = globalThis?.Worker;
// @ts-ignore Workers are undefined
globalThis.Worker = worker ?? class {
  constructor() { }
};

import type { createDefaultFileSystem, ESBUILD } from "@bundle/core/src/index.ts";
import type { Config } from "./mod.ts";
import { headers } from "./mod.ts";
import { setFile as setGist } from "./gist.ts";

import { build, setFile, useFileSystem, createConfig, compress, resolveVersion } from "@bundle/core/src/index.ts";

import { createNotice } from "@bundle/core/src/utils/create-notice.ts";

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
  modules?: [string, "import" | "export" | (string & {})][],
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
  'export * from "spring-easing";',
  'export { default } from "spring-easing";'
].join("\n");

export async function bundle(url: URL, initialValue: string, configObj: Config, versions: string[], modules: [string, "import" | "export" | (string & {})][], query: string) {
  const fs = await FileSystem;
  const start = performance.now();
  const versionsArr = Array.from(new Set(versions))
  const modulesArr = Array.from(new Set(modules))

  const { entryPoints = ["/index.ts"] } = configObj;
  if (Array.isArray(entryPoints)) {
    setFile(fs, (entryPoints as string[])[0], initialValue);
  } else if (typeof entryPoints === "string") {
    setFile(fs, entryPoints as string, initialValue);
  } else {
    setFile(fs, entryPoints.in, initialValue);
  }

  const metafileQuery = url.searchParams.has("metafile");
  const analysisQuery = url.searchParams.has("analysis") ||
    url.searchParams.has("analyze");

  const enableMetafile = analysisQuery ||
    metafileQuery ||
    Boolean(configObj?.esbuild?.metafile);
  
  const result = await build(configObj, FileSystem);
  const end = performance.now();

  (await (fs as ReturnType<typeof createDefaultFileSystem>).files()).reset();

  let resultValue: string = result.contents[0].text;
  const entryPointInputFile = Array.isArray(entryPoints) ? entryPoints[0] 
    :  "in" in entryPoints ? entryPoints.in 
    : entryPoints
  const { content: _content, ...size } = await compress(
    result.contents.map((x: { contents: Uint8Array; path: string; text: string }) => { 
      if (x.path === entryPointInputFile) resultValue = x.text;
      return x.contents
    }),
    configObj.compression
  );

  const { init: _init, ...printableConfig } = createConfig("build", configObj);
  const duration = (end - start);

  const [
    gistDetails, 
    warnings
  ] = (await Promise.allSettled([
    null, // setGist(url.href, result.outputs),
    createNotice(result.warnings, "warning", false),
  ])).map(res => {
    if (res?.status === "fulfilled") {
      return res?.value;
    }

    return null;
  });

  // const { fileId, fileUrl, fileHTMLUrl } = gistDetails ?? {};

  const searchQueries = url.search || `?q=${query}`;
  const finalResult: BundleResult = Object.assign({
      query: decodeURIComponent(searchQueries),
      rawQuery: encodeURIComponent(searchQueries),
    },
    (versionsArr.length === 1 ? { version: versionsArr[0] } : { versions: versionsArr }),
    {
      modules: modulesArr,
      config: printableConfig,
      input: initialValue,
      size,
      installSize: {
        total: result?.totalInstallSize,
        packages: result?.packageSizeArr,
      },
      time: timeFormatter.format(duration / 1000, "seconds"),
      rawTime: duration
    },
    // (gistDetails && fileId ? { fileId } : null),
    // (gistDetails && fileUrl ? { fileUrl } : null), 
    // (gistDetails && fileHTMLUrl ? { fileHTMLUrl } : null),
    (result?.warnings?.length > 0 ? { warnings } : null),
    (enableMetafile && result?.metafile ? { metafile: result?.metafile } : null)
  );

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