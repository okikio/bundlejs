const t = async () => {
  if ("DecompressionStream" in globalThis && e == "gzip") {
    const v = new DecompressionStream("gzip"), a = new Blob([h.buffer]).stream().pipeThrough(v);
    return new Uint8Array(await new Response(a).arrayBuffer());
  }
  const { gunzip: q, getWASM: l } = await import("./index.mjs").then((v) => v.denoflate);
  return await l(), await q(h);
};
export {
  t as default,
  t as source
};
//# sourceMappingURL=esbuild-wasm-38155f31.mjs.map