export { deflate, inflate, gzip, gunzip, zlib, unzlib } from "./pkg/denoflate.js";
import type { InitOutput } from "./pkg/denoflate";
export declare let wasm: InitOutput;
export declare const getWASM: () => Promise<InitOutput>;
export default wasm;
