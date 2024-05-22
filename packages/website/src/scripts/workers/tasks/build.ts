/// <reference lib="webworker" />
import type { ConfigOptions } from "../../configs/options";
import type { BuildConfig, ESBUILD } from "@bundle/core";

import { build, setFile, deleteFile, useFileSystem } from "@bundle/core/src/index.ts";
import { deepMerge } from "@bundle/utils/src/index.ts";
import { compress } from "@bundle/compress/src/index.ts";

import { parseConfig } from "./parse-config";
import { DefaultConfig } from "../../configs/options";

import { initOpts, ready } from "./utils/init";

const FileSystem = useFileSystem("OPFS");
export async function bundle(fileName: string, content: string, _config = "export default {}") {
  const fs = await FileSystem;
  const start = performance.now();

  try {
  // await deleteFile(fs, "/index.tsx");
  } catch (e) {
    console.log({ e })
  }
  console.log({
    content
  })
  await setFile(fs, "/index.tsx", content);

  const newConfig = await parseConfig(_config);
  const config = deepMerge(structuredClone(DefaultConfig), newConfig) as ConfigOptions;

  await ready;

  const buildConfig = config as BuildConfig;
  const result = await build({
    entryPoints: ["/index.tsx"],
    ...buildConfig,
    init: initOpts,
  }, FileSystem);

  console.log({ result })

  const sizeInfo = await compress(
    result.contents.map(x => x.contents),
    config.compression
  );

  const end = performance.now();
  
  return { 
    ...result, 
    ...sizeInfo,

    // time: timeFormatter.format((end - start) / 1000, "seconds"),
    // rawTime: (end - start) / 1000, 
  };
}

export default bundle;