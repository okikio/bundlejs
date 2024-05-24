/// <reference lib="webworker" />
import type { ConfigOptions } from "../../configs/options.ts";
import type { BuildConfig } from "@bundle/core/src/index.ts";

import { build, setFile, deleteFile, useFileSystem, TheFileSystem } from "@bundle/core/src/index.ts";
import { deepMerge } from "@bundle/utils/src/index.ts";
import { compress } from "@bundle/compress/src/index.ts";

import { parseConfig } from "./parse-config.ts";
import { DefaultConfig } from "../../configs/options.ts";

import { initOpts, ready } from "./utils/init.ts";

const FileSystem = await (useFileSystem("OPFS") ?? TheFileSystem);
const fs = FileSystem;

export async function bundle(fileName: string, content: string, _config = "export default {}") {
  const start = performance.now();

  try {
    await deleteFile(fs, "/");
  } catch (e) {
    console.log({ e })
  }
  await setFile(fs, "/index.tsx", content);
  console.log({
    entries: Array.from(
      (await fs.files()).entries()
    ),
    content,
  })

  const newConfig = await parseConfig(_config);
  const config = deepMerge<ConfigOptions>(structuredClone(DefaultConfig), newConfig);

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