const o = async () => await (await import("./index.mjs").then((B) => B.lz4)).decompress(
  Uint8Array.from(
    atob(
    ),
    (B) => B.charCodeAt(0)
  )
);
let E, G = null;
function Y() {
  return G !== null && G.buffer === E.memory.buffer || (G = new Uint8Array(E.memory.buffer)), G;
}
let H = 0;
function k(A, B) {
  const Q = B(1 * A.length);
  return Y().set(A, Q / 1), H = A.length, Q;
}
let F = null;
function D() {
  return F !== null && F.buffer === E.memory.buffer || (F = new Int32Array(E.memory.buffer)), F;
}
function M(A, B) {
  return Y().subarray(A / 1, A / 1 + B);
}
function J(A, B, Q, C) {
  var g = k(A, E.__wbindgen_malloc), w = H;
  E.compress(8, g, w, B, Q, C);
  var I = D()[2], U = D()[3], c = M(I, U).slice();
  return E.__wbindgen_free(I, 1 * U), c;
}
function K(A, B) {
  var Q = k(A, E.__wbindgen_malloc), C = H;
  E.decompress(8, Q, C, B);
  var g = D()[2], w = D()[3], I = M(g, w).slice();
  return E.__wbindgen_free(g, 1 * w), I;
}
async function R(A, B) {
  if (typeof Response == "function" && A instanceof Response) {
    if (typeof WebAssembly.instantiateStreaming == "function")
      try {
        return await WebAssembly.instantiateStreaming(A, B);
      } catch (C) {
        if (A.headers.get("Content-Type") == "application/wasm")
          throw C;
        console.warn(
          "`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n",
          C
        );
      }
    const Q = await A.arrayBuffer();
    return await WebAssembly.instantiate(Q, B);
  }
  {
    const Q = await WebAssembly.instantiate(A, B);
    return Q instanceof WebAssembly.Instance ? { instance: Q, module: A } : Q;
  }
}
async function h(A) {
  A === void 0 && (A = import.meta.url.replace(/\.js$/, "_bg.wasm")), (typeof A == "string" || typeof Request == "function" && A instanceof Request || typeof URL == "function" && A instanceof URL) && (A = fetch(A));
  const { instance: B, module: Q } = await R(await A, {});
  return E = B.exports, h.__wbindgen_wasm_module = Q, E;
}
export {
  J as compress,
  K as decompress,
  h as default,
  o as source
};
//# sourceMappingURL=brotli-f636bd85.mjs.map