// https://deno.land/x/denoflate@1.2.1/mod.ts
// export {
//   deflate,
//   inflate,
//   gzip,
//   gunzip,
//   zlib,
//   unzlib
// } from "./pkg/denoflate.js";

import type { InitOutput } from "./pkg/denoflate";
// import init from "./pkg/denoflate.js"; 

// @ts-ignore
// import { wasm as WASM } from "./pkg/denoflate_bg.wasm.js";
// import { source } from "./pkg/wasm.ts";

let wasm: InitOutput;
let initWASM: typeof import("./pkg/denoflate.js");
export const getWASM = async (src?: Uint8Array) => {
  if (initWASM) return initWASM;

  const _exports = await import("./pkg/denoflate.js");
  const { default: init } = _exports;

  const { wasm: WASM } = (await import("./pkg/denoflate_bg.wasm.js")) as unknown as { wasm: () => Promise<Uint8Array> };
  (wasm = await init(src ?? await WASM()));

  return (initWASM = _exports);
}

export async function deflate(input: Uint8Array, compression?: number) {
  return (await getWASM()).deflate(input, compression);
}

export async function inflate(input: Uint8Array) {
  return (await getWASM()).inflate(input);
}

export async function gzip(input: Uint8Array, compression?: number) {
  return (await getWASM()).gzip(input, compression);
}

export async function gunzip(input: Uint8Array) {
  return (await getWASM()).gunzip(input);
}

export async function zlib(input: Uint8Array, compression?: number) {
  return (await getWASM()).zlib(input, compression);
}

export async function unzlib(input: Uint8Array) {
  return (await getWASM()).unzlib(input);
}

export default wasm;
