let wasm;
let initWASM;
const getWASM = async (src) => {
  if (initWASM)
    return initWASM;
  const _exports = await import("./denoflate-85ff96b7.mjs");
  const { default: init } = _exports;
  const { wasm: WASM } = await import("./denoflate_bg.wasm-09fd9a90.mjs");
  wasm = await init(src ?? await WASM());
  return initWASM = _exports;
};
async function deflate(input, compression) {
  return (await getWASM()).deflate(input, compression);
}
async function inflate(input) {
  return (await getWASM()).inflate(input);
}
async function gzip(input, compression) {
  return (await getWASM()).gzip(input, compression);
}
async function gunzip(input) {
  return (await getWASM()).gunzip(input);
}
async function zlib(input, compression) {
  return (await getWASM()).zlib(input, compression);
}
async function unzlib(input) {
  return (await getWASM()).unzlib(input);
}
var wasm$1 = wasm;
export { wasm$1 as default, deflate, getWASM, gunzip, gzip, inflate, unzlib, zlib };
//# sourceMappingURL=mod-e46b934e.mjs.map
