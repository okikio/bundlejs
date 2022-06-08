export declare type SizeGetter = (code: Uint8Array) => Promise<number>;
export declare const emptySizeGetter: SizeGetter;
export declare const gzipSizeGetter: SizeGetter;
export declare const brotliSizeGetter: SizeGetter;
