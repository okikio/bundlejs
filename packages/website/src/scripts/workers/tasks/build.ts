/// <reference lib="webworker" />
import type { ConfigOptions } from "../../configs/options";
import type { BuildConfig } from "@bundlejs/core/src/build";

import { build, compress, deepAssign, setFile } from "@bundlejs/core/src/index";

import { parseConfig } from "./parse-config";
import { DefaultConfig } from "../../configs/options";

import { initOpts, ready } from "./utils/esbuild-init";

export async function bundle(fileName: string, content: string, _config = "export default {}") {
  setFile("/index.tsx", content);

  const newConfig = await parseConfig(_config);
  const config = deepAssign({}, DefaultConfig, newConfig) as ConfigOptions;

  await ready;

  const buildConfig = config as BuildConfig;
  const result = await build({
    ...buildConfig,
    init: initOpts,
  });

  const sizeInfo = await compress(
    result.contents.map(x => x.contents),
    config.compression
  );
  return { ...result, ...sizeInfo };
}

export default bundle;