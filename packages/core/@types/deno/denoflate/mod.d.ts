export { deflate, inflate, gzip, gunzip, zlib, unzlib } from "./pkg/denoflate.js";
import type { InitOutput } from "./pkg/denoflate";
export declare let wasm: InitOutput;
export declare const getWASM: (src?: Uint8Array) => Promise<InitOutput>;
export default wasm;
