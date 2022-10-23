/// <reference lib="webworker" />
import { configModelResetValue } from "../../utils/get-initial";

import { transform } from "@bundlejs/core/src/index";
import { initOpts, ready } from "./utils/esbuild-init";

const configs = new Map<string, string>();

export async function parseConfig(input = configModelResetValue) {
  input = input.split("\n").map(x => x.trim()).join("\n").trim();

  try {
    if (configs.has(input)) { return configs.get(input); }

    await ready;

    const { code } = await transform(input, {
      init: initOpts,
      esbuild: {
        loader: "ts",
        format: "iife",
        globalName: "std_global",
        treeShaking: true
      }
    });
    
    const result = await Function("\"use strict\";return (async function () { \"use strict\";" + code + "return await (std_global?.default ?? std_global); })()")();
    configs.set(input, result);
    return result;
  } catch (e) {
    console.warn(e);
  }

  return {};
}

export default parseConfig;