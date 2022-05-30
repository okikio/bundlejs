import { gzip, getWASM } from "../../../../deno/denoflate/mod";
import { compress } from "../../../../deno/brotli/mod";

import { encode } from "../../../utils/encode-decode";

export type SizeGetter = (code: Uint8Array) => Promise<number>;

export const emptySizeGetter: SizeGetter = () => Promise.resolve(0);
export const gzipSizeGetter: SizeGetter = async (code: Uint8Array) => {
    await getWASM();
    const data = await gzip(code, 9);
    return data.length;
};

export const brotliSizeGetter: SizeGetter = async (code: Uint8Array) => {
    const data = await compress(code, code.length, 11);
    return data.length;
};