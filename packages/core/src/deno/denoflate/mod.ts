// https://deno.land/x/denoflate@1.2.1/mod.ts
export {
  deflate,
  inflate,
  gzip,
  gunzip,
  zlib,
  unzlib
} from "./pkg/denoflate.js";

import type { InitOutput } from "./pkg/denoflate";
import init from "./pkg/denoflate.js"; 

// @ts-ignore
import { wasm as WASM } from "./pkg/denoflate_bg.wasm.js";
// import { source } from "./pkg/wasm.ts";

export let wasm: InitOutput;
export const getWASM = async (src?: Uint8Array) => {
  if (wasm) return wasm;
  return (wasm = await init(src ?? WASM));
}

export default wasm;
