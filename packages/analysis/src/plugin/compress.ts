// import { gzip, getWASM } from "../../../deno/denoflate/mod";
// import { compress } from "@bundlejs/core/src/deno/denoflate/mod";

export type SizeGetter = (code: Uint8Array) => Promise<number>;

export const emptySizeGetter: SizeGetter = () => Promise.resolve(0);
export const gzipSizeGetter: SizeGetter = async (code: Uint8Array) => {
    // @bundlejs/core/src/deno/denoflate/mod.ts
    // ../../../core/src/deno/denoflate/mod
    const { gzip, getWASM } = await import("@bundlejs/core/src/deno/denoflate/mod");
    await getWASM();

    const data = await gzip(code, 9);
    // const data = [];
    return data.length;
};

export const brotliSizeGetter: SizeGetter = async (code: Uint8Array) => {
    // @bundlejs/core/deno/brotli/mod.ts
    // ../../../core/src/deno/brotli/mod
    const { compress } = await import("@bundlejs/core/src/deno/brotli/mod");
    const data = await compress(code, code.length, 11);
    return data.length;
};