let n;
const c = async () => {
  if (n)
    return n;
  const t = await import("./wasm-f995d37c.mjs"), { default: s, source: e } = t;
  return await s(await e()), n = t;
};
async function a(t, s = 4096, e = 6, r = 22) {
  const { compress: o } = await c();
  return o(t, s, e, r);
}
async function i(t, s = 4096) {
  const { decompress: e } = await c();
  return e(t, s);
}
export {
  a as compress,
  i as decompress,
  c as getWASM
};
//# sourceMappingURL=mod-27a4a102.mjs.map
