const p = async () => {
  if ("DecompressionStream" in globalThis && r == "gzip") {
    const W = new DecompressionStream("gzip"), V = new Blob([l.buffer]).stream().pipeThrough(W);
    return new Uint8Array(await new Response(V).arrayBuffer());
  }
  const { gunzip: e, getWASM: a } = await import("./index.mjs").then((W) => W.denoflate);
  return await a(), await e(l);
};
export {
  p as default,
  p as source
};
//# sourceMappingURL=esbuild-wasm-52ab7d86.mjs.map