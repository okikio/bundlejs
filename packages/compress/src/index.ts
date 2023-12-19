export * as brotli from "./deno/brotli/mod.ts";
export * as gzip from "./deno/gzip/mod.ts";
export * as lz4 from "./deno/lz4/mod.ts";
export * as zstd from "./deno/zstd/mod.ts";

export * from "./config.ts";
export * from "./types.ts";

export { compress } from "./compress.ts";
export { decompress } from "./decompress.ts";