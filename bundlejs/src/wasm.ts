  // @ts-nocheck
  export const source = async () => {
    const mode: "lz4" | "gzip" = "gzip";
    if ('DecompressionStream' in globalThis && mode == "gzip") {
      const ds = new DecompressionStream('gzip');
      const decompressedStream = new Blob([uint8arr.buffer]).stream().pipeThrough(ds);
      return new Uint8Array(await new Response(decompressedStream).arrayBuffer());
    }

    const { gunzip, getWASM } = await import("./deno/denoflate/mod");
    await getWASM();
    return await gunzip(uint8arr);
  };
  export default source;