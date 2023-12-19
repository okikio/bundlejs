// @ts-nocheck
let A,
  I = null;
function g() {
  return (
    (null !== I && 0 !== I.byteLength) || (I = new Uint8Array(A.memory.buffer)),
    I
  );
}
let Q = 0;
function C(A, I) {
  const C = I(1 * A.length, 1) >>> 0;
  return g().set(A, C / 1), (Q = A.length), C;
}
let B = null;
function E() {
  return (
    (null !== B && 0 !== B.byteLength) || (B = new Int32Array(A.memory.buffer)),
    B
  );
}
function D(A, I) {
  return (A >>>= 0), g().subarray(A / 1, A / 1 + I);
}
export function lz4_compress(I) {
  try {
    const N = A.__wbindgen_add_to_stack_pointer(-16),
      o = C(I, A.__wbindgen_malloc),
      Y = Q;
    A.lz4_compress(N, o, Y);
    var g = E()[N / 4 + 0],
      B = E()[N / 4 + 1],
      i = D(g, B).slice();
    return A.__wbindgen_free(g, 1 * B, 1), i;
  } finally {
    A.__wbindgen_add_to_stack_pointer(16);
  }
}
export function lz4_decompress(I) {
  try {
    const N = A.__wbindgen_add_to_stack_pointer(-16),
      o = C(I, A.__wbindgen_malloc),
      Y = Q;
    A.lz4_decompress(N, o, Y);
    var g = E()[N / 4 + 0],
      B = E()[N / 4 + 1],
      i = D(g, B).slice();
    return A.__wbindgen_free(g, 1 * B, 1), i;
  } finally {
    A.__wbindgen_add_to_stack_pointer(16);
  }
}
async function i(A, I) {
  if ("function" == typeof Response && A instanceof Response) {
    if ("function" == typeof WebAssembly.instantiateStreaming)
      try {
        return await WebAssembly.instantiateStreaming(A, I);
      } catch (I) {
        if ("application/wasm" == A.headers.get("Content-Type")) throw I;
        console.warn(
          "`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n",
          I
        );
      }
    const g = await A.arrayBuffer();
    return await WebAssembly.instantiate(g, I);
  }
  {
    const g = await WebAssembly.instantiate(A, I);
    return g instanceof WebAssembly.Instance ? { instance: g, module: A } : g;
  }
}
function N() {
  const A = { wbg: {} };
  return A;
}
function o(A, I) {}
function Y(g, Q) {
  return (
    (A = g.exports), (G.__wbindgen_wasm_module = Q), (B = null), (I = null), A
  );
}
function F(I) {
  if (void 0 !== A) return A;
  const g = N();
  o(g), I instanceof WebAssembly.Module || (I = new WebAssembly.Module(I));
  return Y(new WebAssembly.Instance(I, g), I);
}
async function G(I) {
  if (void 0 !== A) return A;
  void 0 === I && (I = new URL("deno_lz4_bg.wasm", import.meta.url));
  const g = N();
  ("string" == typeof I ||
    ("function" == typeof Request && I instanceof Request) ||
    ("function" == typeof URL && I instanceof URL)) &&
    (I = fetch(I)),
    o(g);
  const { instance: Q, module: C } = await i(await I, g);
  return Y(Q, C);
}
export { F as initSync };
export default G;
