let s;
const a = async () => {
  if (s)
    return s;
  const t = await import("./wasm-231aea7b.mjs"), { default: n, source: c } = t;
  return await n(await c()), s = t;
};
async function e(t) {
  const { lz4_compress: n } = await a();
  return n(t);
}
async function r(t) {
  const { lz4_decompress: n } = await a();
  return n(t);
}
export {
  e as compress,
  r as decompress,
  a as getWASM
};
//# sourceMappingURL=mod-b70e2c33.mjs.map
