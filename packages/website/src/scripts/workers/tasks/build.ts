/// <reference lib="webworker" />
import type { ConfigOptions } from "../../configs/options";
import type { BuildConfig, ESBUILD } from "@bundlejs/core";

import { build, compress, setFile, deepAssign, TheFileSystem } from "@bundlejs/core/src/index";

import { parseConfig } from "./parse-config";
import { DefaultConfig } from "../../configs/options";

import { initOpts, ready } from "./utils/init";

export async function bundle(fileName: string, content: string, _config = "export default {}") {
  const fs = await TheFileSystem;
  const start = performance.now();

  setFile(fs, "/index.tsx", content);

  const newConfig = await parseConfig(_config);
  const config = deepAssign({}, DefaultConfig, newConfig) as ConfigOptions;

  await ready;

  const buildConfig = config as BuildConfig;
  const result = await build({
    entryPoints: ["/index.tsx"],
    ...buildConfig,
    init: initOpts,
  });

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