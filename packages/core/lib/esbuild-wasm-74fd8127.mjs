const W = async () => {
  if ("DecompressionStream" in globalThis && l == "gzip") {
    const v = new DecompressionStream("gzip"), V = new Blob([e.buffer]).stream().pipeThrough(v);
    return new Uint8Array(await new Response(V).arrayBuffer());
  }
  const { gunzip: K, getWASM: f } = await import("./index.mjs").then((v) => v.denoflate);
  return await f(), await K(e);
};
export {
  W as default,
  W as source
};
//# sourceMappingURL=esbuild-wasm-74fd8127.mjs.map