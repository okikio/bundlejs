import type { CompressConfig, CompressionOptions, CompressionType } from "./types.ts";
import { bytes } from "@bundle/utils/utils/pretty-bytes.ts";
import { encode } from "@bundle/utils/utils/encode-decode.ts";
import { createCompressConfig } from "./config.ts";

/**
 * Use multiple compression algorithims & pretty-bytes for the total gzip, brotli and/or lz4 compressed size
 * 
 * @param inputs An array of input files to compress
 * @param opts 
 * The compression algorithim to use, there are currently 4 options "gzip", "zstd", "brotli", and "lz4". 
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
  const { type, quality } = createCompressConfig(opts);

  // Convert inputs to binary in Uint8Array form
  const contents = inputs.map((input: Uint8Array | string) => {
    return input instanceof Uint8Array ? input : encode(input);
  });

  // Total uncompressed size
  const rawUncompressedSize = contents.reduce((acc, content) => acc + content.byteLength, 0);
  const uncompressedSize = bytes(rawUncompressedSize) as string;

  // Choose a different compression function based on the compression type
  const compressionMap = await (async (type?: CompressionType) => {
    switch (type) {
      case "brotli": {
        const { compress, getWASM } = await import("./deno/brotli/mod.ts");
        await getWASM();

        return async (code: Uint8Array) => await compress(code, code.length, quality);
      }
      case "zstd": {
        const { compress, getWASM } = await import("./deno/zstd/mod.ts");
        await getWASM();

        return async (code: Uint8Array) => await compress(code, quality);
      }
      case "lz4": {
        const { compress, getWASM } = await import("./deno/lz4/mod.ts");
        await getWASM();

        return async (code: Uint8Array) => await compress(code);
      }
      case "gzip":
      default: {
        const { compress } = await import("./deno/gzip/mod.ts");

        return async (code: Uint8Array) => {
          if (!('CompressionStream' in globalThis)) {
            return await Promise.resolve(code)
          }

          return await compress(code);
        };
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