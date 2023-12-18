/** The compression algorithim to use, there are currently 4 options "gzip", "brotli", "zstd", and "lz4" */
export type CompressionType = "gzip" | "brotli" | "zstd" | "lz4";
export type CompressionOptions = {
  /** The compression algorithim to use, there are currently 2 options "zstd", and "brotli" where you can manually set the quality */
  type?: Exclude<CompressionType, "gzip" | "lz4">,

  /** Compression quality ranging from 1 to 11 */
  quality?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11
} | {
  /** The compression algorithim to use, there are currently 2 options "gzip", and "lz4", where there are no quality settings */
  type?: "gzip" | "lz4",
  quality?: null
};

export type CompressConfig = CompressionOptions | CompressionType;

/**
 * An API for compressing a stream of data.
 *
 * @example
 * ```ts
 * await Deno.stdin.readable
 *   .pipeThrough(new CompressionStream("gzip"))
 *   .pipeTo(Deno.stdout.writable);
 * ```
 *
 * @category Compression Streams API
 */
export declare class CompressionStream {
  /**
   * Creates a new `CompressionStream` object which compresses a stream of
   * data.
   *
   * Throws a `TypeError` if the format passed to the constructor is not
   * supported.
   * 
   * Represents the different compression formats that can be used for data compression.
   * This enumeration provides a standardized set of values for specifying the type of
   * compression algorithm to be applied.
   * 
   * @param format {"gzip" | "deflate" | "deflate-raw"}
   * 
   * The 'deflate' compression format.
   * It's a commonly used compression algorithm that combines the LZ77 algorithm and Huffman coding.
   * DEFLATE is widely used in formats such as PNG, ZIP, and for HTTP data compression (Content-Encoding: deflate).
   * 
   * The 'deflate-raw' compression format.
   * This format represents the raw DEFLATE compression algorithm without any headers or wrappers,
   * allowing for more control over the compression process. It's typically used in contexts where
   * custom or proprietary data formats are involved.
   * 
   * The 'gzip' compression format.
   * GZIP is an extension of the DEFLATE algorithm with additional headers for maintaining file integrity and metadata.
   * It's commonly used for file compression and as a content encoding method in web protocols.
   */
  constructor(format: "deflate" | "deflate-raw" | "gzip");

  readonly readable: ReadableStream<Uint8Array>;
  readonly writable: WritableStream<Uint8Array>;
}

/**
 * An API for decompressing a stream of data.
 *
 * @example
 * ```ts
 * await Deno.stdin.readable
 *   .pipeThrough(new DecompressionStream("gzip"))
 *   .pipeTo(Deno.stdout.writable);
 * ```
 *
 * @category Compression Streams API
 */
export declare class DecompressionStream {
  /**
   * Creates a new `DecompressionStream` object which compresses a stream of
   * data.
   *
   * Throws a `TypeError` if the format passed to the constructor is not
   * supported.
   * 
   * Represents the different compression formats that can be used for data decompression.
   * This enumeration provides a standardized set of values for specifying the type of
   * compression algorithm to be applied.
   * 
   * @param format {"gzip" | "deflate" | "deflate-raw"}
   * 
   * The 'deflate' compression format.
   * It's a commonly used compression algorithm that combines the LZ77 algorithm and Huffman coding.
   * DEFLATE is widely used in formats such as PNG, ZIP, and for HTTP data compression (Content-Encoding: deflate).
   * 
   * The 'deflate-raw' compression format.
   * This format represents the raw DEFLATE compression algorithm without any headers or wrappers,
   * allowing for more control over the compression process. It's typically used in contexts where
   * custom or proprietary data formats are involved.
   * 
   * The 'gzip' compression format.
   * GZIP is an extension of the DEFLATE algorithm with additional headers for maintaining file integrity and metadata.
   * It's commonly used for file compression and as a content encoding method in web protocols.
   */
  constructor(format: "deflate" | "deflate-raw" | "gzip");

  readonly readable: ReadableStream<Uint8Array>;
  readonly writable: WritableStream<Uint8Array>;
}
