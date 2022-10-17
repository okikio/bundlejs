/// <reference lib="webworker" />
import type { ConfigOptions } from "../../configs/options";

import type { ESBUILD } from "@bundlejs/core/src/index";

// import ESBUILD_SOURCE_WASM_URL from "esbuild-wasm/esbuild.wasm?url";
import { ESBUILD_SOURCE_WASM, setFile, build, compress, init, PLATFORM_AUTO, deepAssign } from "@bundlejs/core/src/index";
import { DefaultConfig } from "../../configs/options";
import { parseConfig } from "./parse-config";

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

  const result = await build({
    init: initOpts,
    ...config
  });

  const sizeInfo = await compress(
    result.contents.map(x => x.contents),
    config.compression
  );
  return { ...result, ...sizeInfo };
}

export default bundle;