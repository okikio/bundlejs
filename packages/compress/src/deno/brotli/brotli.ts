// @ts-nocheck
let o, E = new Uint8Array();
function r() {
  return 0 === E.byteLength && (E = new Uint8Array(o.memory.buffer)), E;
}
let s = 0;
function n($, p) {
  const o = p(1 * $.length);
  return r().set($, o / 1), s = $.length, o;
}
let t = new Int32Array();
function q() {
  return 0 === t.byteLength && (t = new Int32Array(o.memory.buffer)), t;
}
function m($, p) {
  return r().subarray($ / 1, $ / 1 + p);
}
export function compress($, p, E, r) {
  try {
    const K = o.__wbindgen_add_to_stack_pointer(-16),
      l = n($, o.__wbindgen_malloc),
      W = s;
    o.compress(K, l, W, p, E, r);
    var t = q()[K / 4 + 0], u = q()[K / 4 + 1], C = m(t, u).slice();
    return o.__wbindgen_free(t, 1 * u), C;
  }
  finally {
    o.__wbindgen_add_to_stack_pointer(16);
  }
}
export function decompress($, p) {
  try {
    const u = o.__wbindgen_add_to_stack_pointer(-16),
      C = n($, o.__wbindgen_malloc),
      K = s;
    o.decompress(u, C, K, p);
    var E = q()[u / 4 + 0], r = q()[u / 4 + 1], t = m(E, r).slice();
    return o.__wbindgen_free(E, 1 * r), t;
  }
  finally {
    o.__wbindgen_add_to_stack_pointer(16);
  }
}
async function u($, p) {
  if ("function" == typeof Response && $ instanceof Response) {
    if ("function" == typeof WebAssembly.instantiateStreaming) {
      try {
        return await WebAssembly.instantiateStreaming($, p);
      }
      catch (p) {
        if ("application/wasm" == $.headers.get("Content-Type")) throw p;
        console.warn(
          "`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n",
          p,
        );
      }
    }
    const o = await $.arrayBuffer();
    return await WebAssembly.instantiate(o, p);
  }
  {
    const o = await WebAssembly.instantiate($, p);
    return o instanceof WebAssembly.Instance ? { instance: o, module: $ } : o;
  }
}
function C() {
  const $ = { wbg: {} };
  return $;
}
function K($, p) { }
function l($, p) {
  return o = $.exports,
    T.__wbindgen_wasm_module = p,
    t = new Int32Array(),
    E = new Uint8Array(),
    o;
}
function W($) {
  const p = C();
  K(p), $ instanceof WebAssembly.Module || ($ = new WebAssembly.Module($));
  return l(new WebAssembly.Instance($, p), $);
}
async function T($) {
  void 0 === $ && ($ = new URL("deno_brotli_bg.wasm", import.meta.url));
  const p = C();
  ("string" == typeof $ || "function" == typeof Request && $ instanceof Request
    || "function" == typeof URL && $ instanceof URL) && ($ = fetch($)), K(p);
  const { instance: o, module: E } = await u(await $, p);
  return l(o, E);
}
export { W as initSync };
export default T;
