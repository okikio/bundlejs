let e, i;
const a = async (t) => {
  if (i)
    return i;
  const n = await import("./denoflate-85ff96b7.mjs"), { default: r } = n, { wasm: u } = await import("./denoflate_bg.wasm-09fd9a90.mjs");
  return e = await r(t ?? await u()), i = n;
};
async function c(t, n) {
  return (await a()).deflate(t, n);
}
async function s(t) {
  return (await a()).inflate(t);
}
async function o(t, n) {
  return (await a()).gzip(t, n);
}
async function f(t) {
  return (await a()).gunzip(t);
}
async function w(t, n) {
  return (await a()).zlib(t, n);
}
async function l(t) {
  return (await a()).unzlib(t);
}
const p = e;
export {
  p as default,
  c as deflate,
  a as getWASM,
  f as gunzip,
  o as gzip,
  s as inflate,
  l as unzlib,
  w as zlib
};
//# sourceMappingURL=mod-88b45d97.mjs.map