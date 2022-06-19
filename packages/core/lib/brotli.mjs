const source = async () => {
  const lz4 = await import("./index.mjs").then(function(n) {
    return n.lz4;
  });
};
let B, Q = null;
function E() {
  return Q !== null && Q.buffer === B.memory.buffer || (Q = new Uint8Array(B.memory.buffer)), Q;
}
let C = 0;
function g(A, B2) {
  const Q2 = B2(1 * A.length);
  return E().set(A, Q2 / 1), C = A.length, Q2;
}
let w = null;
function I() {
  return w !== null && w.buffer === B.memory.buffer || (w = new Int32Array(B.memory.buffer)), w;
}
function G(A, B2) {
  return E().subarray(A / 1, A / 1 + B2);
}
function compress(A, Q2, E2, w2) {
  var F2 = g(A, B.__wbindgen_malloc), D2 = C;
  B.compress(8, F2, D2, Q2, E2, w2);
  var H = I()[2], U = I()[3], Y = G(H, U).slice();
  return B.__wbindgen_free(H, 1 * U), Y;
}
function decompress(A, Q2) {
  var E2 = g(A, B.__wbindgen_malloc), w2 = C;
  B.decompress(8, E2, w2, Q2);
  var F2 = I()[2], D2 = I()[3], H = G(F2, D2).slice();
  return B.__wbindgen_free(F2, 1 * D2), H;
}
async function F(A, B2) {
  if (typeof Response == "function" && A instanceof Response) {
    if (typeof WebAssembly.instantiateStreaming == "function")
      try {
        return await WebAssembly.instantiateStreaming(A, B2);
      } catch (B3) {
        if (A.headers.get("Content-Type") == "application/wasm")
          throw B3;
        console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", B3);
      }
    const Q2 = await A.arrayBuffer();
    return await WebAssembly.instantiate(Q2, B2);
  }
  {
    const Q2 = await WebAssembly.instantiate(A, B2);
    return Q2 instanceof WebAssembly.Instance ? { instance: Q2, module: A } : Q2;
  }
}
async function D(A) {
  A === void 0 && (A = import.meta.url.replace(/\.js$/, "_bg.wasm"));
  (typeof A == "string" || typeof Request == "function" && A instanceof Request || typeof URL == "function" && A instanceof URL) && (A = fetch(A));
  const { instance: Q2, module: E2 } = await F(await A, {});
  return B = Q2.exports, D.__wbindgen_wasm_module = E2, B;
}
export { compress, decompress, D as default, source };
//# sourceMappingURL=brotli.mjs.map