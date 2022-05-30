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

export let wasm: InitOutput;
export const getWASM = async () => {
  if (wasm) return wasm;
  return (wasm = await init(WASM));
}

export default wasm;
