/** The compression algorithim to use, there are currently 3 options "gzip", "brotli", and "lz4" */
export type CompressionType = "gzip" | "brotli" | "lz4";
export type CompressionOptions = {
    /** The compression algorithim to use, there are currently 3 options "gzip", "brotli", and "lz4" */
    type: CompressionType;
    /** Compression quality ranging from 1 to 11 */
    quality: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
};
export type CompressConfig = CompressionOptions | CompressionType;
/**
 * Default compress config
 */
export declare const COMPRESS_CONFIG: CompressionOptions;
/**
 * Use multiple compression algorithims & pretty-bytes for the total gzip, brotli and/or lz4 compressed size
 *
 * @param inputs An array of input files to compress
 * @param opts
 * The compression algorithim to use, there are currently 3 options "gzip", "brotli", and "lz4".
 * You can also configure the quality of the compression using an object,
 *
 * e.g.
 * ```ts
 * {
 *   ...
 *   "compression": {
 *     "type": "brotli",
 *     "quality": 5
 *   }
 * }
 * ```
 *
 * @returns The compressed size, the initial size, and the compression format used
 */
export declare function compress(inputs?: Uint8Array[] | string[], opts?: CompressConfig): Promise<{
    type: CompressionType;
    content: Uint8Array[];
    totalByteLength: string;
    totalCompressedSize: string;
    initialSize: string;
    size: string;
}>;
export {};
