export {
  deflate,
  inflate,
  gzip,
  gunzip,
  zlib,
  unzlib,
} from "./pkg/denoflate";

import init from "./pkg/denoflate";
import { wasm as WASM } from "./pkg/denoflate_bg.wasm.js";

export let wasm;
export const getWASM = async () => {
  if (wasm) return wasm;
  return (wasm = await init(WASM));
}

export default wasm;
