const source = async () => {
  const mode = "gzip";
  if ("DecompressionStream" in globalThis && mode == "gzip") {
    const ds = new DecompressionStream("gzip");
    const decompressedStream = new Blob([uint8arr.buffer]).stream().pipeThrough(ds);
    return new Uint8Array(await new Response(decompressedStream).arrayBuffer());
  }
  const { gunzip, getWASM } = await import("./index.mjs").then(function(n) {
    return n.denoflate;
  });
  await getWASM();
  return await gunzip(uint8arr);
};
export { source as default, source };
//# sourceMappingURL=esbuild-wasm-2aae627e.mjs.map