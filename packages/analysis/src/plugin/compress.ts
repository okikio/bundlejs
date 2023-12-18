export type SizeGetter = (code: Uint8Array) => Promise<number>;

export const emptySizeGetter: SizeGetter = () => Promise.resolve(0);
export const gzipSizeGetter: SizeGetter = async (code: Uint8Array) => {
    const { compress } = await import("@bundle/compress/deno/gzip/mod.ts");
    const data = await compress(code);
    return data.length;
};

export const brotliSizeGetter: SizeGetter = async (code: Uint8Array) => {
    const { compress } = await import("@bundle/compress/deno/brotli/mod.ts");
    const data = await compress(code, code.length, 11);
    return data.length;
};