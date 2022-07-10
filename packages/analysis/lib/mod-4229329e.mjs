let initWASM;
const getWASM = async () => {
  if (initWASM)
    return initWASM;
  const wasm = await import("./wasm-39a4b81c.mjs");
  const { default: init, source } = wasm;
  await init(await source());
  return initWASM = wasm;
};
async function compress(input) {
  const { lz4_compress } = await getWASM();
  return lz4_compress(input);
}
async function decompress(input) {
  const { lz4_decompress } = await getWASM();
  return lz4_decompress(input);
}
export { compress, decompress, getWASM };
//# sourceMappingURL=mod-4229329e.mjs.map
