/// <reference lib="webworker" />
import type { ConfigOptions } from "../../configs/options.ts";
import type { BuildConfig, ESBUILD, IFileSystem } from "@bundle/core/src/index.ts";

import { build, setFile, deleteFile, useFileSystem, getFile } from "@bundle/core/src/index.ts";
import { deepMerge } from "@bundle/utils/src/index.ts";
import { compress } from "@bundle/compress/src/index.ts";

import { parseConfig } from "./parse-config.ts";
import { DefaultConfig } from "../../configs/options.ts";

import { initOpts, ready } from "./utils/init.ts";
import type { FileSystemFileHandleWithPath } from "@bundle/core/src/utils/types.js";

const FileSystem = useFileSystem("OPFS");
export async function bundle(fileName: string, content: string, _config = "export default {}") {
  const fs = await FileSystem;
  const start = performance.now();

  try {
  // await deleteFile(fs, "/");
  } catch (e) {
    console.log({ e })
  }
  await setFile(fs, "/index.tsx", content);
  console.log({
    content: await getFile(fs, "/index.tsx", "string")
  })


  const newConfig = await parseConfig(_config);
  const config = deepMerge(structuredClone(DefaultConfig), newConfig) as ConfigOptions;

  await ready;

  const buildConfig = config as BuildConfig;
  const result = await build({
    entryPoints: ["/index.tsx"],
    
    ...buildConfig,
    init: initOpts,
  }, Promise.resolve(fs));

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