import { ESBUILD_SOURCE_WASM, setFile, build as bundle, compress, init } from "@bundlejs/core/src/index";

// let initializedWASM = init("browser", {
//   wasmModule: new WebAssembly.Module(await ESBUILD_SOURCE_WASM()),
// });

export async function build(fileName: string, content: string, config = "{}") {
  setFile("/index.tsx", content);
  config = JSON.parse(config ? config : "{}") ?? {};
  // let changedConfig = deepAssign({}, DefaultConfig, config);

  let result = await bundle({
    init: {
      wasmModule: new WebAssembly.Module(await ESBUILD_SOURCE_WASM()),
      worker: false
    }
  });

  let sizeInfo = await compress(result.contents.map(x => x.contents));
  return { ...result, ...sizeInfo };
}

export default build;