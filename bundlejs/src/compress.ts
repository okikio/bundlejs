import { bytes } from "./utils/pretty-bytes";
import { encode } from "./utils/encode-decode";
import { createConfig } from "./configs/config";

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

/** The compression algorithim to use, there are currently 3 options "gzip", "brotli", and "lz4" */
export type CompressionType = "gzip" | "brotli" | "lz4";
export type CompressionOptions = {
  /** The compression algorithim to use, there are currently 3 options "gzip", "brotli", and "lz4" */
  type: CompressionType,

  /** Compression quality ranging from 1 to 11 */
  quality: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11
};

export type CompressConfig = CompressionOptions | CompressionType;

/**
 * Default compress config
 */
export const COMPRESS_CONFIG: CompressionOptions = {
  type: "gzip",
  quality: 9
};

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

  // Total uncompressed size
  const totalByteLength = bytes(
    contents.reduce((acc, content) => acc + content.byteLength, 0)
  ) as string;

  // Choose a different compression function based on the compression type
  const compressionMap = await (async () => {
    switch (type) {
      case "lz4": {
        const { compress: lz4_compress, getWASM } = await import("./deno/lz4/mod");
        await getWASM();

        return async (code: Uint8Array) => await lz4_compress(code);
      }
      case "brotli": {
        const { compress, getWASM } = await import("./deno/brotli/mod");
        await getWASM();

        return async (code: Uint8Array) => await compress(code, code.length, quality);
      }
      default: {
        if (quality === COMPRESS_CONFIG.quality && 'CompressionStream' in globalThis) {
          return async (code: Uint8Array) => {
            const cs = new CompressionStream('gzip');
            const compressedStream = new Blob([code]).stream().pipeThrough(cs);
            return new Uint8Array(await new Response(compressedStream).arrayBuffer());
          };
        }

        const { gzip, getWASM } = await import("./deno/denoflate/mod");
        await getWASM();

        return async (code: Uint8Array) => await gzip(code, quality);
      }
    }
  })();

  // Compress all binary contents according to the compression map
  const compressedContent = await Promise.all(
    contents.map((content) => compressionMap(content))
  );

  // Convert sizes to human readable formats, e.g. 10000 bytes to 10MB
  const totalCompressedSize = bytes(
    compressedContent.reduce((acc, { length }) => acc + length, 0)
  );

  return {
    type,
    content: compressedContent,

    totalByteLength,
    totalCompressedSize,

    initialSize: `${totalByteLength}`,
    size: `${totalCompressedSize} (${type})`
  };
}

export { };