/// <reference lib="webworker" />
import type { ConfigOptions } from "../../configs/options";

import type { ESBUILD } from "@bundlejs/core/src/index";
import type { BuildConfig } from "@bundlejs/core/src/build";

import { build, compress, deepAssign, init, setFile } from "@bundlejs/core/src/index";
import { ESBUILD_SOURCE_WASM, PLATFORM_AUTO } from "@bundlejs/core/src/index";

import { parseConfig } from "./parse-config";
import { DefaultConfig } from "../../configs/options";

let initOpts: ESBUILD.InitializeOptions = null;

const ready = (async () => {
  initOpts = {
    // wasmURL: ESBUILD_SOURCE_WASM_URL,
    wasmModule: new WebAssembly.Module(await ESBUILD_SOURCE_WASM()),
    worker: false
  };

  return await init(PLATFORM_AUTO, initOpts);
})();

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