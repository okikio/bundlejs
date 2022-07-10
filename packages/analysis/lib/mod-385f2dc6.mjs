let initWASM;
const getWASM = async () => {
  if (initWASM)
    return initWASM;
  const wasm = await import("./wasm-d32f5487.mjs");
  const { default: init, source } = wasm;
  await init(await source());
  return initWASM = wasm;
};
async function compress(input, bufferSize = 4096, quality = 6, lgwin = 22) {
  const { compress: compress2 } = await getWASM();
  return compress2(input, bufferSize, quality, lgwin);
}
async function decompress(input, bufferSize = 4096) {
  const { decompress: decompress2 } = await getWASM();
  return decompress2(input, bufferSize);
}
export { compress, decompress, getWASM };
//# sourceMappingURL=mod-385f2dc6.mjs.map
