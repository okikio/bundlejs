/// <reference lib="webworker" />
import { ESBUILD_SOURCE_WASM, transform, init, PLATFORM_AUTO } from "@bundlejs/core/src/index";
import { configModelResetValue } from "../../utils/get-initial";

const configs = new Map<string, string>();

let initOpts: {
  wasmModule: WebAssembly.Module,
  worker: boolean
} = null;

const ready = (async () => {
  initOpts = {
    wasmModule: new WebAssembly.Module(await ESBUILD_SOURCE_WASM()),
    worker: false
  };
  return await init(PLATFORM_AUTO, initOpts);
})();

export async function parseConfig(input = configModelResetValue) {
  input = input.trim();

  try {
    await ready;

    const config = configs.has(input) ? configs.get(input) : (
      await transform(input, {
        init: initOpts,
        esbuild: {
          loader: 'ts',
          format: 'iife',
          globalName: 'std_global',
          treeShaking: true
        }
      })
    ).code;

    if (config)
      configs.set(input, config);

    return await Function('"use strict";return (async function () { "use strict";' + config + 'return await (std_global?.default ?? std_global); })()')();
  } catch (e) {
    console.warn(e);
  }

  return {};
}

export default parseConfig;