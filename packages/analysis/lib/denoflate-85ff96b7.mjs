let t, p = new TextDecoder("utf-8", { ignoreBOM: !0, fatal: !0 });
p.decode();
let w = null;
function v() {
  return (w === null || w.buffer !== t.memory.buffer) && (w = new Uint8Array(t.memory.buffer)), w;
}
function m(e, n) {
  return p.decode(v().subarray(e, e + n));
}
const f = new Array(32).fill(void 0);
f.push(void 0, null, !0, !1);
let g = f.length;
function h(e) {
  g === f.length && f.push(f.length + 1);
  const n = g;
  return g = f[n], f[n] = e, n;
}
function k(e) {
  return f[e];
}
function A(e) {
  e < 36 || (f[e] = g, g = e);
}
function W(e) {
  const n = k(e);
  return A(e), n;
}
let l = 0;
function u(e, n) {
  const r = n(e.length * 1);
  return v().set(e, r / 1), l = e.length, r;
}
function d(e) {
  return e == null;
}
let y = null;
function c() {
  return (y === null || y.buffer !== t.memory.buffer) && (y = new Int32Array(t.memory.buffer)), y;
}
function b(e, n) {
  return v().subarray(e / 1, e / 1 + n);
}
function R(e, n) {
  try {
    const s = t.__wbindgen_add_to_stack_pointer(-16);
    var r = u(e, t.__wbindgen_malloc), i = l;
    t.deflate(s, r, i, !d(n), d(n) ? 0 : n);
    var a = c()[s / 4 + 0], o = c()[s / 4 + 1], _ = b(a, o).slice();
    return t.__wbindgen_free(a, o * 1), _;
  } finally {
    t.__wbindgen_add_to_stack_pointer(16);
  }
}
function O(e) {
  try {
    const _ = t.__wbindgen_add_to_stack_pointer(-16);
    var n = u(e, t.__wbindgen_malloc), r = l;
    t.inflate(_, n, r);
    var i = c()[_ / 4 + 0], a = c()[_ / 4 + 1], o = b(i, a).slice();
    return t.__wbindgen_free(i, a * 1), o;
  } finally {
    t.__wbindgen_add_to_stack_pointer(16);
  }
}
function U(e, n) {
  try {
    const s = t.__wbindgen_add_to_stack_pointer(-16);
    var r = u(e, t.__wbindgen_malloc), i = l;
    t.gzip(s, r, i, !d(n), d(n) ? 0 : n);
    var a = c()[s / 4 + 0], o = c()[s / 4 + 1], _ = b(a, o).slice();
    return t.__wbindgen_free(a, o * 1), _;
  } finally {
    t.__wbindgen_add_to_stack_pointer(16);
  }
}
function I(e) {
  try {
    const _ = t.__wbindgen_add_to_stack_pointer(-16);
    var n = u(e, t.__wbindgen_malloc), r = l;
    t.gunzip(_, n, r);
    var i = c()[_ / 4 + 0], a = c()[_ / 4 + 1], o = b(i, a).slice();
    return t.__wbindgen_free(i, a * 1), o;
  } finally {
    t.__wbindgen_add_to_stack_pointer(16);
  }
}
function L(e, n) {
  try {
    const s = t.__wbindgen_add_to_stack_pointer(-16);
    var r = u(e, t.__wbindgen_malloc), i = l;
    t.zlib(s, r, i, !d(n), d(n) ? 0 : n);
    var a = c()[s / 4 + 0], o = c()[s / 4 + 1], _ = b(a, o).slice();
    return t.__wbindgen_free(a, o * 1), _;
  } finally {
    t.__wbindgen_add_to_stack_pointer(16);
  }
}
function S(e) {
  try {
    const _ = t.__wbindgen_add_to_stack_pointer(-16);
    var n = u(e, t.__wbindgen_malloc), r = l;
    t.unzlib(_, n, r);
    var i = c()[_ / 4 + 0], a = c()[_ / 4 + 1], o = b(i, a).slice();
    return t.__wbindgen_free(i, a * 1), o;
  } finally {
    t.__wbindgen_add_to_stack_pointer(16);
  }
}
async function z(e, n) {
  if (typeof Response == "function" && e instanceof Response) {
    if (typeof WebAssembly.instantiateStreaming == "function")
      try {
        return await WebAssembly.instantiateStreaming(e, n);
      } catch (i) {
        if (e.headers.get("Content-Type") != "application/wasm")
          console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", i);
        else
          throw i;
      }
    const r = await e.arrayBuffer();
    return await WebAssembly.instantiate(r, n);
  } else {
    const r = await WebAssembly.instantiate(e, n);
    return r instanceof WebAssembly.Instance ? { instance: r, module: e } : r;
  }
}
async function M(e) {
  typeof e > "u" && (e = new URL("denoflate_bg.wasm"));
  const n = {};
  n.wbg = {}, n.wbg.__wbindgen_string_new = function(a, o) {
    var _ = m(a, o);
    return h(_);
  }, n.wbg.__wbindgen_rethrow = function(a) {
    throw W(a);
  }, (typeof e == "string" || typeof Request == "function" && e instanceof Request || typeof URL == "function" && e instanceof URL) && (e = fetch(e));
  const { instance: r, module: i } = await z(await e, n);
  return t = r.exports, M.__wbindgen_wasm_module = i, t;
}
export {
  M as default,
  R as deflate,
  I as gunzip,
  U as gzip,
  O as inflate,
  S as unzlib,
  L as zlib
};
//# sourceMappingURL=denoflate-85ff96b7.mjs.map
