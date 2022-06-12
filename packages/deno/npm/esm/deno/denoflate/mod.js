// https://deno.land/x/denoflate@1.2.1/mod.ts
export { deflate, inflate, gzip, gunzip, zlib, unzlib } from "./pkg/denoflate.js";
import init from "./pkg/denoflate.js";
import { wasm as WASM } from "./pkg/denoflate_bg.wasm.js";
export let wasm;
export const getWASM = async () => {
    if (wasm)
        return wasm;
    // @ts-ignore: Not sure why this errors out
    return (wasm = await init(WASM));
};
export default wasm;
