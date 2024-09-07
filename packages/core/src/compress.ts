import { bytes } from "./utils/pretty-bytes.ts";
import { encode } from "./utils/encode-decode.ts";
import { createConfig } from "./configs/config.ts";

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
declare class CompressionStream {
  /**
   * Creates a new `CompressionStream` object which compresses a stream of
   * data.
   *
   * Throws a `TypeError` if the format passed to the constructor is not
   * supported.
   */
  constructor(format: string);

  readonly readable: ReadableStream<Uint8Array>;
  readonly writable: WritableStream<Uint8Array>;
}

/** The compression algorithim to use, there are currently 4 options "gzip", "brotli", "zstd", and "lz4" */
export type CompressionType = "gzip" | "brotli" | "zstd" | "lz4";
export type CompressionOptions = {
  /** The compression algorithim to use, there are currently 3 options "gzip", "brotli", and "lz4" */
  type?: CompressionType,

  /** Compression quality ranging from 1 to 11 */
  quality?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11
};

export type CompressConfig = CompressionOptions | CompressionType;

/**
 * Default compress config
 */
export const COMPRESS_CONFIG: CompressionOptions = {
  type: "gzip",
  quality: 9
};

import { compress as brotli, getWASM as brotliWASM } from "./deno/brotli/mod.ts";
import { compress as zstd, getWASM as zstdWASM } from "./deno/zstd/mod.ts";
import { compress as lz4, getWASM as lz4WASM } from "./deno/lz4/mod.ts";
import { compress as gzip } from "./deno/gzip/mod.ts";

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
export async function compress(inputs: Uint8Array[] | string[] = [], opts: CompressConfig = {} as CompressionOptions) {
  const { type, quality } = createConfig("compress", opts);

  // Convert inputs to binary in Uint8Array form
  const contents = inputs.map((input: Uint8Array | string) => {
    return input instanceof Uint8Array ? input : encode(input);
  });

  const rawUncompressedSize = contents.reduce((acc, content) => acc + content.byteLength, 0);
  const uncompressedSize = bytes(rawUncompressedSize) as string;

  // Choose a different compression function based on the compression type
  const compressionMap = await (async (type?: CompressionType) => {
    switch (type) {
      case "brotli": {
        await brotliWASM();
        return async (code: Uint8Array) => await brotli(code, code.length, quality);
      }
      case "zstd": {
        await zstdWASM();
        return async (code: Uint8Array) => await zstd(code, quality);
      }
      case "lz4": {
        await lz4WASM();
        return async (code: Uint8Array) => await lz4(code);
      }
      case "gzip":
      default: {
        return async (code: Uint8Array) => await gzip(code);
      }
    }
  })(type);

  // Compress all binary contents according to the compression map
  const compressedContent = await Promise.all(
    contents.map((content) => compressionMap(content))
  );

  // Convert sizes to human readable formats, e.g. 10000 bytes to 10MB
  const rawCompressedSize = compressedContent.reduce((acc, { length }) => acc + length, 0);
  const compressedSize = bytes(rawCompressedSize);

  console.log({
    type,
    quality,
    uncompressedSize,
    rawUncompressedSize,
    rawCompressedSize,
    compressedSize,
  })
  
  return {
    type,
    content: compressedContent,

    rawUncompressedSize,
    uncompressedSize,

    rawCompressedSize,
    compressedSize,

    size: `${compressedSize} (${type})`
  };
}
