import { source as pr } from "./esbuild-wasm-7f403282.mjs";
const de = "Deno" in globalThis ? "deno" : "process" in globalThis ? "node" : "browser";
var ut = class {
  constructor(e) {
    this.map = new Map(e);
  }
  getMap() {
    return this.map;
  }
  get(e) {
    return this.map.get(e);
  }
  keys() {
    return Array.from(this.map.keys());
  }
  values() {
    return Array.from(this.map.values());
  }
  set(e, t) {
    return this.map.set(e, t), this;
  }
  add(e) {
    let t = this.size;
    return this.set(t, e), this;
  }
  get size() {
    return this.map.size;
  }
  get length() {
    return this.map.size;
  }
  last(e = 1) {
    let t = this.keys()[this.size - e];
    return this.get(t);
  }
  delete(e) {
    return this.map.delete(e);
  }
  remove(e) {
    return this.map.delete(e), this;
  }
  clear() {
    return this.map.clear(), this;
  }
  has(e) {
    return this.map.has(e);
  }
  entries() {
    return this.map.entries();
  }
  forEach(e, t) {
    return this.map.forEach(e, t), this;
  }
  [Symbol.iterator]() {
    return this.entries();
  }
}, tn = (e, t, ...n) => {
  e.forEach((s) => {
    s[t](...n);
  });
}, et = ({ callback: e = () => {
}, scope: t = null, name: n = "event" }) => ({ callback: e, scope: t, name: n }), se = class extends ut {
  constructor(e = "event") {
    super(), this.name = e;
  }
}, nn = class extends ut {
  constructor() {
    super();
  }
  getEvent(e) {
    let t = this.get(e);
    return t instanceof se ? t : (this.set(e, new se(e)), this.get(e));
  }
  newListener(e, t, n) {
    let s = this.getEvent(e);
    return s.add(et({ name: e, callback: t, scope: n })), s;
  }
  on(e, t, n) {
    if (typeof e > "u" || e == null)
      return this;
    typeof e == "string" && (e = e.trim().split(/\s/g));
    let s, r, i = typeof e == "object" && !Array.isArray(e), o = i ? t : n;
    return i || (r = t), Object.keys(e).forEach((c) => {
      s = i ? c : e[c], i && (r = e[c]), this.newListener(s, r, o);
    }, this), this;
  }
  removeListener(e, t, n) {
    let s = this.get(e);
    if (s instanceof se && t) {
      let r = et({ name: e, callback: t, scope: n });
      s.forEach((i, o) => {
        if (i.callback === r.callback && i.scope === r.scope)
          return s.remove(o);
      });
    }
    return s;
  }
  off(e, t, n) {
    if (typeof e > "u" || e == null)
      return this;
    typeof e == "string" && (e = e.trim().split(/\s/g));
    let s, r, i = typeof e == "object" && !Array.isArray(e), o = i ? t : n;
    return i || (r = t), Object.keys(e).forEach((c) => {
      s = i ? c : e[c], i && (r = e[c]), typeof r == "function" ? this.removeListener(s, r, o) : this.remove(s);
    }, this), this;
  }
  once(e, t, n) {
    if (typeof e > "u" || e == null)
      return this;
    typeof e == "string" && (e = e.trim().split(/\s/g));
    let s = typeof e == "object" && !Array.isArray(e);
    return Object.keys(e).forEach((r) => {
      let i = s ? r : e[r], o = s ? e[r] : t, c = s ? t : n, l = (...a) => {
        o.apply(c, a), this.removeListener(i, l, c);
      };
      this.newListener(i, l, c);
    }, this), this;
  }
  emit(e, ...t) {
    return typeof e > "u" || e == null ? this : (typeof e == "string" && (e = e.trim().split(/\s/g)), e.forEach((n) => {
      let s = this.get(n);
      s instanceof se && s.forEach((r) => {
        let { callback: i, scope: o } = r;
        i.apply(o, t);
      });
    }, this), this);
  }
  clear() {
    return tn(this, "clear"), super.clear(), this;
  }
};
const sn = {
  "init.start": console.log,
  "init.complete": console.info,
  "init.error": console.error,
  "init.loading": console.warn,
  "logger.log": console.log,
  "logger.error": console.error,
  "logger.warn": console.warn,
  "logger.info": console.info,
  "build.error": console.error
}, A = new nn();
A.on(sn);
const ft = {
  /**
   * Registers if esbuild has been initialized
   */
  initialized: !1,
  /**
   * Assets are files during the build process that esbuild can't handle natively, 
   * e.g. fetching web workers using the `new URL("...", import.meta.url)`
   */
  assets: [],
  /**
   * Instance of esbuild being used
   */
  esbuild: null
};
function V(e) {
  return ft[e];
}
function Pe(e, t) {
  return ft[e] = t;
}
function rn(e) {
  let t = e;
  return [
    () => t,
    (n) => (typeof n == "object" && !Array.isArray(n) && n !== null ? Object.assign(t, n) : t = n ?? e, t)
  ];
}
const tt = "0.17.8";
async function on(e = de) {
  try {
    switch (e) {
      case "deno":
        return await import(
          /* @vite-ignore */
          `https://deno.land/x/esbuild@v${tt}/mod.js`
        );
      case "deno-wasm":
        return await import(
          /* @vite-ignore */
          `https://deno.land/x/esbuild@v${tt}/wasm.js`
        );
      case "node":
        return await import("esbuild");
      default:
        return await import("./browser-44e1bd2b.mjs");
    }
  } catch (t) {
    throw t;
  }
}
async function ht(e = de, t = {}) {
  try {
    if (!V("initialized")) {
      Pe("initialized", !0), A.emit("init.start");
      const n = await on(e);
      if (Pe("esbuild", n), e !== "node" && e !== "deno")
        if ("wasmModule" in t)
          await n.initialize(t);
        else if ("wasmURL" in t)
          await n.initialize(t);
        else {
          const { default: s } = await import("./esbuild-wasm-7f403282.mjs");
          await n.initialize({
            wasmModule: new WebAssembly.Module(await s()),
            ...t
          });
        }
      A.emit("init.complete");
    }
    return V("esbuild");
  } catch (n) {
    A.emit("init.error", n), console.error(n);
  }
}
const Y = 46, E = 47, pt = "/", dt = /\/+/;
function N(e) {
  if (typeof e != "string")
    throw new TypeError(
      `Path must be a string. Received ${JSON.stringify(e)}`
    );
}
function gt(e) {
  return e === E;
}
function mt(e, t, n, s) {
  let r = "", i = 0, o = -1, c = 0, l;
  for (let a = 0, f = e.length; a <= f; ++a) {
    if (a < f)
      l = e.charCodeAt(a);
    else {
      if (s(l))
        break;
      l = E;
    }
    if (s(l)) {
      if (!(o === a - 1 || c === 1))
        if (o !== a - 1 && c === 2) {
          if (r.length < 2 || i !== 2 || r.charCodeAt(r.length - 1) !== Y || r.charCodeAt(r.length - 2) !== Y) {
            if (r.length > 2) {
              const u = r.lastIndexOf(n);
              u === -1 ? (r = "", i = 0) : (r = r.slice(0, u), i = r.length - 1 - r.lastIndexOf(n)), o = a, c = 0;
              continue;
            } else if (r.length === 2 || r.length === 1) {
              r = "", i = 0, o = a, c = 0;
              continue;
            }
          }
          t && (r.length > 0 ? r += `${n}..` : r = "..", i = 2);
        } else
          r.length > 0 ? r += n + e.slice(o + 1, a) : r = e.slice(o + 1, a), i = a - o - 1;
      o = a, c = 0;
    } else
      l === Y && c !== -1 ? ++c : c = -1;
  }
  return r;
}
function an(e, t) {
  const n = t.dir || t.root, s = t.base || (t.name || "") + (t.ext || "");
  return n ? n === t.root ? n + s : n + e + s : s;
}
const ln = {
  "	": "%09",
  "\n": "%0A",
  "\v": "%0B",
  "\f": "%0C",
  "\r": "%0D",
  " ": "%20"
};
function wt(e) {
  return e.replaceAll(/[\s]/g, (t) => ln[t] ?? t);
}
const cn = "/", un = ":";
function Ce(...e) {
  let t = "", n = !1;
  for (let s = e.length - 1; s >= -1 && !n; s--) {
    let r;
    s >= 0 ? r = e[s] : r = "/", N(r), r.length !== 0 && (t = `${r}/${t}`, n = r.charCodeAt(0) === E);
  }
  return t = mt(
    t,
    !n,
    "/",
    gt
  ), n ? t.length > 0 ? `/${t}` : "/" : t.length > 0 ? t : ".";
}
function yt(e) {
  if (N(e), e.length === 0)
    return ".";
  const t = e.charCodeAt(0) === E, n = e.charCodeAt(e.length - 1) === E;
  return e = mt(e, !t, "/", gt), e.length === 0 && !t && (e = "."), e.length > 0 && n && (e += "/"), t ? `/${e}` : e;
}
function $t(e) {
  return N(e), e.length > 0 && e.charCodeAt(0) === E;
}
function fn(...e) {
  if (e.length === 0)
    return ".";
  let t;
  for (let n = 0, s = e.length; n < s; ++n) {
    const r = e[n];
    N(r), r.length > 0 && (t ? t += `/${r}` : t = r);
  }
  return t ? yt(t) : ".";
}
function hn(e, t) {
  if (N(e), N(t), e === t || (e = Ce(e), t = Ce(t), e === t))
    return "";
  let n = 1;
  const s = e.length;
  for (; n < s && e.charCodeAt(n) === E; ++n)
    ;
  const r = s - n;
  let i = 1;
  const o = t.length;
  for (; i < o && t.charCodeAt(i) === E; ++i)
    ;
  const c = o - i, l = r < c ? r : c;
  let a = -1, f = 0;
  for (; f <= l; ++f) {
    if (f === l) {
      if (c > l) {
        if (t.charCodeAt(i + f) === E)
          return t.slice(i + f + 1);
        if (f === 0)
          return t.slice(i + f);
      } else
        r > l && (e.charCodeAt(n + f) === E ? a = f : f === 0 && (a = 0));
      break;
    }
    const g = e.charCodeAt(n + f), m = t.charCodeAt(i + f);
    if (g !== m)
      break;
    g === E && (a = f);
  }
  let u = "";
  for (f = n + a + 1; f <= s; ++f)
    (f === s || e.charCodeAt(f) === E) && (u.length === 0 ? u += ".." : u += "/..");
  return u.length > 0 ? u + t.slice(i + a) : (i += a, t.charCodeAt(i) === E && ++i, t.slice(i));
}
function pn(e) {
  return e;
}
function dn(e) {
  if (N(e), e.length === 0)
    return ".";
  const t = e.charCodeAt(0) === E;
  let n = -1, s = !0;
  for (let r = e.length - 1; r >= 1; --r)
    if (e.charCodeAt(r) === E) {
      if (!s) {
        n = r;
        break;
      }
    } else
      s = !1;
  return n === -1 ? t ? "/" : "." : t && n === 1 ? "//" : e.slice(0, n);
}
function gn(e, t = "") {
  if (t !== void 0 && typeof t != "string")
    throw new TypeError('"ext" argument must be a string');
  N(e);
  let n = 0, s = -1, r = !0, i;
  if (t !== void 0 && t.length > 0 && t.length <= e.length) {
    if (t.length === e.length && t === e)
      return "";
    let o = t.length - 1, c = -1;
    for (i = e.length - 1; i >= 0; --i) {
      const l = e.charCodeAt(i);
      if (l === E) {
        if (!r) {
          n = i + 1;
          break;
        }
      } else
        c === -1 && (r = !1, c = i + 1), o >= 0 && (l === t.charCodeAt(o) ? --o === -1 && (s = i) : (o = -1, s = c));
    }
    return n === s ? s = c : s === -1 && (s = e.length), e.slice(n, s);
  } else {
    for (i = e.length - 1; i >= 0; --i)
      if (e.charCodeAt(i) === E) {
        if (!r) {
          n = i + 1;
          break;
        }
      } else
        s === -1 && (r = !1, s = i + 1);
    return s === -1 ? "" : e.slice(n, s);
  }
}
function mn(e) {
  N(e);
  let t = -1, n = 0, s = -1, r = !0, i = 0;
  for (let o = e.length - 1; o >= 0; --o) {
    const c = e.charCodeAt(o);
    if (c === E) {
      if (!r) {
        n = o + 1;
        break;
      }
      continue;
    }
    s === -1 && (r = !1, s = o + 1), c === Y ? t === -1 ? t = o : i !== 1 && (i = 1) : t !== -1 && (i = -1);
  }
  return t === -1 || s === -1 || // We saw a non-dot character immediately before the dot
  i === 0 || // The (right-most) trimmed path component is exactly '..'
  i === 1 && t === s - 1 && t === n + 1 ? "" : e.slice(t, s);
}
function wn(e) {
  if (e === null || typeof e != "object")
    throw new TypeError(
      `The "pathObject" argument must be of type Object. Received type ${typeof e}`
    );
  return an("/", e);
}
function yn(e) {
  N(e);
  const t = { root: "", dir: "", base: "", ext: "", name: "" };
  if (e.length === 0)
    return t;
  const n = e.charCodeAt(0) === E;
  let s;
  n ? (t.root = "/", s = 1) : s = 0;
  let r = -1, i = 0, o = -1, c = !0, l = e.length - 1, a = 0;
  for (; l >= s; --l) {
    const f = e.charCodeAt(l);
    if (f === E) {
      if (!c) {
        i = l + 1;
        break;
      }
      continue;
    }
    o === -1 && (c = !1, o = l + 1), f === Y ? r === -1 ? r = l : a !== 1 && (a = 1) : r !== -1 && (a = -1);
  }
  return r === -1 || o === -1 || // We saw a non-dot character immediately before the dot
  a === 0 || // The (right-most) trimmed path component is exactly '..'
  a === 1 && r === o - 1 && r === i + 1 ? o !== -1 && (i === 0 && n ? t.base = t.name = e.slice(1, o) : t.base = t.name = e.slice(i, o)) : (i === 0 && n ? (t.name = e.slice(1, r), t.base = e.slice(1, o)) : (t.name = e.slice(i, r), t.base = e.slice(i, o)), t.ext = e.slice(r, o)), i > 0 ? t.dir = e.slice(0, i - 1) : n && (t.dir = "/"), t;
}
function $n(e) {
  if (e = e instanceof URL ? e : new URL(e), e.protocol != "file:")
    throw new TypeError("Must be a file URL.");
  return decodeURIComponent(
    e.pathname.replace(/%(?![0-9A-Fa-f]{2})/g, "%25")
  );
}
function En(e) {
  if (!$t(e))
    throw new TypeError("Must be an absolute path.");
  const t = new URL("file:///");
  return t.pathname = wt(
    e.replace(/%/g, "%25").replace(/\\/g, "%5C")
  ), t;
}
const Be = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  basename: gn,
  delimiter: un,
  dirname: dn,
  extname: mn,
  format: wn,
  fromFileUrl: $n,
  isAbsolute: $t,
  join: fn,
  normalize: yt,
  parse: yn,
  relative: hn,
  resolve: Ce,
  sep: cn,
  toFileUrl: En,
  toNamespacedPath: pn
}, Symbol.toStringTag, { value: "Module" })), An = Be, { join: Sn, normalize: nt } = An, Ae = [
  "!",
  "$",
  "(",
  ")",
  "*",
  "+",
  ".",
  "=",
  "?",
  "[",
  "\\",
  "^",
  "{",
  "|"
], bn = ["-", "\\", "]"];
function Rn(e, {
  extended: t = !0,
  globstar: n = !0,
  os: s = "linux",
  caseInsensitive: r = !1
} = {}) {
  if (e == "")
    return /(?!)/;
  const i = s == "windows" ? "(?:\\\\|/)+" : "/+", o = s == "windows" ? "(?:\\\\|/)*" : "/*", c = s == "windows" ? ["\\", "/"] : ["/"], l = s == "windows" ? "(?:[^\\\\/]*(?:\\\\|/|$)+)*" : "(?:[^/]*(?:/|$)+)*", a = s == "windows" ? "[^\\\\/]*" : "[^/]*", f = s == "windows" ? "`" : "\\";
  let u = e.length;
  for (; u > 1 && c.includes(e[u - 1]); u--)
    ;
  e = e.slice(0, u);
  let g = "";
  for (let m = 0; m < e.length; ) {
    let h = "";
    const p = [];
    let d = !1, j = !1, b = !1, w = m;
    for (; w < e.length && !c.includes(e[w]); w++) {
      if (j) {
        j = !1, h += (d ? bn : Ae).includes(e[w]) ? `\\${e[w]}` : e[w];
        continue;
      }
      if (e[w] == f) {
        j = !0;
        continue;
      }
      if (e[w] == "[")
        if (d) {
          if (e[w + 1] == ":") {
            let $ = w + 1, R = "";
            for (; e[$ + 1] != null && e[$ + 1] != ":"; )
              R += e[$ + 1], $++;
            if (e[$ + 1] == ":" && e[$ + 2] == "]") {
              w = $ + 2, R == "alnum" ? h += "\\dA-Za-z" : R == "alpha" ? h += "A-Za-z" : R == "ascii" ? h += "\0-" : R == "blank" ? h += "	 " : R == "cntrl" ? h += "\0-" : R == "digit" ? h += "\\d" : R == "graph" ? h += "!-~" : R == "lower" ? h += "a-z" : R == "print" ? h += " -~" : R == "punct" ? h += `!"#$%&'()*+,\\-./:;<=>?@[\\\\\\]^_‘{|}~` : R == "space" ? h += "\\s\v" : R == "upper" ? h += "A-Z" : R == "word" ? h += "\\w" : R == "xdigit" && (h += "\\dA-Fa-f");
              continue;
            }
          }
        } else {
          d = !0, h += "[", e[w + 1] == "!" ? (w++, h += "^") : e[w + 1] == "^" && (w++, h += "\\^");
          continue;
        }
      if (e[w] == "]" && d) {
        d = !1, h += "]";
        continue;
      }
      if (d) {
        e[w] == "\\" ? h += "\\\\" : h += e[w];
        continue;
      }
      if (e[w] == ")" && p.length > 0 && p[p.length - 1] != "BRACE") {
        h += ")";
        const $ = p.pop();
        $ == "!" ? h += a : $ != "@" && (h += $);
        continue;
      }
      if (e[w] == "|" && p.length > 0 && p[p.length - 1] != "BRACE") {
        h += "|";
        continue;
      }
      if (e[w] == "+" && t && e[w + 1] == "(") {
        w++, p.push("+"), h += "(?:";
        continue;
      }
      if (e[w] == "@" && t && e[w + 1] == "(") {
        w++, p.push("@"), h += "(?:";
        continue;
      }
      if (e[w] == "?") {
        t && e[w + 1] == "(" ? (w++, p.push("?"), h += "(?:") : h += ".";
        continue;
      }
      if (e[w] == "!" && t && e[w + 1] == "(") {
        w++, p.push("!"), h += "(?!";
        continue;
      }
      if (e[w] == "{") {
        p.push("BRACE"), h += "(?:";
        continue;
      }
      if (e[w] == "}" && p[p.length - 1] == "BRACE") {
        p.pop(), h += ")";
        continue;
      }
      if (e[w] == "," && p[p.length - 1] == "BRACE") {
        h += "|";
        continue;
      }
      if (e[w] == "*") {
        if (t && e[w + 1] == "(")
          w++, p.push("*"), h += "(?:";
        else {
          const $ = e[w - 1];
          let R = 1;
          for (; e[w + 1] == "*"; )
            w++, R++;
          const en = e[w + 1];
          n && R == 2 && [...c, void 0].includes($) && [...c, void 0].includes(en) ? (h += l, b = !0) : h += a;
        }
        continue;
      }
      h += Ae.includes(e[w]) ? `\\${e[w]}` : e[w];
    }
    if (p.length > 0 || d || j) {
      h = "";
      for (const $ of e.slice(m, w))
        h += Ae.includes($) ? `\\${$}` : $, b = !1;
    }
    for (g += h, b || (g += w < e.length ? i : o, b = !0); c.includes(e[w]); )
      w++;
    if (!(w > m))
      throw new Error("Assertion failure: i > j (potential infinite loop)");
    m = w;
  }
  return g = `^${g}$`, new RegExp(g, r ? "i" : "");
}
function vn(e) {
  const t = { "{": "}", "(": ")", "[": "]" }, n = /\\(.)|(^!|\*|\?|[\].+)]\?|\[[^\\\]]+\]|\{[^\\}]+\}|\(\?[:!=][^\\)]+\)|\([^|]+\|[^\\)]+\))/;
  if (e === "")
    return !1;
  let s;
  for (; s = n.exec(e); ) {
    if (s[2])
      return !0;
    let r = s.index + s[0].length;
    const i = s[1], o = i ? t[i] : null;
    if (i && o) {
      const c = e.indexOf(o, r);
      c !== -1 && (r = c + 1);
    }
    e = e.slice(r);
  }
  return !1;
}
function Et(e, { globstar: t = !1 } = {}) {
  if (e.match(/\0/g))
    throw new Error(`Glob contains invalid characters: "${e}"`);
  if (!t)
    return nt(e);
  const n = dt.source, s = new RegExp(
    `(?<=(${n}|^)\\*\\*${n})\\.\\.(?=${n}|$)`,
    "g"
  );
  return nt(e.replace(s, "\0")).replace(/\0/g, "..");
}
function _n(e, { extended: t = !0, globstar: n = !1 } = {}) {
  if (!n || e.length == 0)
    return Sn(...e);
  if (e.length === 0)
    return ".";
  let s;
  for (const r of e) {
    const i = r;
    i.length > 0 && (s ? s += `${pt}${i}` : s = i);
  }
  return s ? Et(s, { extended: t, globstar: n }) : ".";
}
const Tn = Be, On = Be, {
  basename: At,
  delimiter: kn,
  dirname: Z,
  extname: Ge,
  format: Nn,
  fromFileUrl: Pn,
  isAbsolute: St,
  join: bt,
  normalize: Cn,
  parse: Ln,
  relative: In,
  resolve: I,
  sep: L,
  toFileUrl: xn,
  toNamespacedPath: Dn
} = Tn, fe = (e, ...t) => {
  const n = new URL(e);
  return n.pathname = wt(
    bt(n.pathname, ...t).replace(/%/g, "%25").replace(/\\/g, "%5C")
  ), n.toString();
}, ge = (e) => /^(?!\.).*/.test(e) && !St(e), er = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SEP: pt,
  SEP_PATTERN: dt,
  basename: At,
  delimiter: kn,
  dirname: Z,
  extname: Ge,
  format: Nn,
  fromFileUrl: Pn,
  globToRegExp: Rn,
  isAbsolute: St,
  isBareImport: ge,
  isGlob: vn,
  join: bt,
  joinGlobs: _n,
  normalize: Cn,
  normalizeGlob: Et,
  parse: Ln,
  posix: On,
  relative: In,
  resolve: I,
  sep: L,
  toFileUrl: xn,
  toNamespacedPath: Dn,
  urlJoin: fe
}, Symbol.toStringTag, { value: "Module" })), jn = [".tsx", ".ts", ".jsx", ".js", ".css", ".json"], Rt = (e) => {
  const t = Ge(e);
  return jn.includes(t) ? (/\.js(x)?$/.test(t) ? t.replace(/^\.js/, ".ts") : t).slice(1) : t === ".mjs" || t === ".cjs" || t === ".mts" || t === ".cts" ? "ts" : t == ".scss" ? "css" : t == ".png" || t == ".jpeg" || t == ".ttf" ? "dataurl" : t == ".svg" || t == ".html" || t == ".txt" ? "text" : t == ".wasm" ? "file" : t.length ? "text" : "ts";
}, st = {
  37: "dim",
  31: "red",
  32: "green",
  34: "blue",
  36: "cyan",
  35: "magenta",
  33: "yellow",
  "41;31": "red-bg-red",
  "41;97": "red-bg-white",
  "42;32": "green-bg-green",
  "42;97": "green-bg-white",
  "44;34": "blue-bg-blue",
  "44;97": "blue-bg-white",
  "46;36": "cyan-bg-cyan",
  "46;30": "cyan-bg-black",
  "45;35": "magenta-bg-magenta",
  "45;30": "magenta-bg-black",
  "43;33": "yellow-bg-yellow",
  "43;30": "yellow-bg-black"
};
function Fn(e) {
  return e.replace(/\<br\>/g, `
`).replace(/\&/g, "&amp;").replace(/\"/g, "&quot;").replace(/\'/g, "&#39;").replace(/\</g, "&lt;").replace(/\>/g, "&gt;");
}
class Mn {
  result = "";
  _stack = [];
  _bold = !1;
  _underline = !1;
  _link = !1;
  text(t) {
    this.result += Fn(t);
  }
  reset() {
    let t;
    for (; t = this._stack.pop(); )
      this.result += t;
  }
  bold() {
    this._bold || (this._bold = !0, this.result += "<strong>", this._stack.push("</strong>"));
  }
  underline() {
    this._underline || (this._underline = !0, this.result += "<ins>", this._stack.push("</ins>"));
  }
  last() {
    return this._stack[this._stack.length - 1];
  }
  color(t) {
    let n;
    for (; (n = this.last()) === "</span>"; )
      this._stack.pop(), this.result += n;
    this.result += `<span class="color-${t}">`, this._stack.push("</span>");
  }
  done() {
    return this.reset(), this.result;
  }
}
function Un(e) {
  e = e.trimEnd();
  let t = 0;
  const n = new Mn();
  for (const s of e.matchAll(/\x1B\[([\d;]+)m/g)) {
    const r = s[1];
    n.text(e.slice(t, s.index)), t = s.index + s[0].length, r === "0" ? n.reset() : r === "1" ? n.bold() : r === "4" ? n.underline() : st[r] && n.color(st[r]);
  }
  return t < e.length && n.text(e.slice(t)), n.done();
}
const he = async (e, t = "error", n = !0) => {
  const { formatMessages: s } = await import("./esbuild-9b0f0333.mjs").then((i) => i.b);
  return (await s(e, { color: n, kind: t })).map((i) => n ? Un(i.replace(/(\s+)(\d+)(\s+)\│/g, `
$1$2$3│`)) : i);
}, tr = (e, t = 300, n) => {
  let s;
  return function(...r) {
    const i = this, o = () => {
      s = null, n || e.apply(i, r);
    }, c = n && !s;
    clearTimeout(s), s = setTimeout(o, t), c && e.apply(i, r);
  };
}, x = (e) => typeof e == "object" && e != null, zn = (e) => typeof e == "object" ? e === null : typeof e != "function", Bn = (e) => e !== "__proto__" && e !== "constructor" && e !== "prototype", vt = (e, t) => {
  if (e === t)
    return !0;
  if (x(e) && x(t)) {
    if (Object.keys(e).length !== Object.keys(t).length)
      return !1;
    for (const n in e)
      if (!vt(e[n], t[n]))
        return !1;
    return !0;
  }
}, Gn = (e, t) => {
  const n = Object.keys(t), s = {};
  let r = 0;
  for (; r < n.length; r++) {
    const i = n[r], o = t[i];
    if (i in e) {
      const c = Array.isArray(e[i]) && Array.isArray(o);
      if (e[i] == o)
        continue;
      if (c)
        if (!vt(e[i], o))
          s[i] = o;
        else
          continue;
      else if (x(e[i]) && x(o)) {
        const l = Gn(e[i], o);
        Object.keys(l).length && (s[i] = l);
      } else
        s[i] = o;
    } else
      s[i] = o;
  }
  return s;
};
/*!
 * Based on assign-deep <https://github.com/jonschlinkert/assign-deep>
 *
 * Copyright (c) 2017-present, Jon Schlinkert.
 * Released under the MIT License.
 */
function oe(e, ...t) {
  let n = 0;
  for (zn(e) && (e = t[n++]), e || (e = {}); n < t.length; n++)
    if (x(t[n]))
      for (const s of Object.keys(t[n]))
        Bn(s) && (x(e[s]) && x(t[n][s]) ? e[s] = oe(Array.isArray(e[s]) ? [] : {}, e[s], t[n][s]) : e[s] = t[n][s]);
  return e;
}
const me = (e) => new TextEncoder().encode(e), Le = (e) => new TextDecoder().decode(e), _t = /* @__PURE__ */ new Map(), Hn = "EXTERNAL_FETCHES", rt = async (e, t, n) => {
  const s = await fetch(t, n), r = s.clone();
  return "caches" in globalThis ? e.put(t, r) : _t.set(t, r), s;
};
let Se;
const Wn = async () => Se || (Se = await caches.open(Hn)), J = async (e, t = !1, n) => {
  const s = "Request" in globalThis ? new Request(e.toString()) : e.toString();
  let r, i, o;
  return "caches" in globalThis ? (i = await Wn(), o = await i.match(s)) : o = _t.get(s), r = o, o ? t || rt(i, s, n) : r = await rt(i, s, n), r.clone();
};
function Tt(e) {
  return e != null && !Number.isNaN(e);
}
function we(e, t) {
  let n = e;
  return t && e.startsWith(".") && (n = I(Z(t), e)), n;
}
async function Xn(e, t, n = "buffer", s) {
  const r = we(t, s);
  try {
    const i = await e.get(r);
    return i === void 0 ? void 0 : Tt(i) ? n === "string" ? Le(i) : i : null;
  } catch (i) {
    throw new Error(`Error occurred while getting "${r}": ${i}`, { cause: i });
  }
}
async function Ot(e, t, n, s) {
  const r = we(t, s);
  try {
    Tt(n) || await e.set(r, null, "folder"), await e.set(r, n instanceof Uint8Array ? n : me(n), "file");
  } catch (i) {
    throw new Error(`Error occurred while writing to "${r}": ${i}`, { cause: i });
  }
}
async function nr(e, t, n) {
  const s = we(t, n);
  try {
    return await e.get(s) === void 0 ? !1 : await e.delete(s);
  } catch (r) {
    throw new Error(`Error occurred while deleting "${s}": ${r}`, { cause: r });
  }
}
function ae(e = /* @__PURE__ */ new Map()) {
  return {
    files: async () => e,
    get: async (n) => e.get(I(n)),
    async set(n, s) {
      const r = I(n), o = Z(r).split(L).filter((a) => a.length > 0), c = o.length;
      let l = o[0] !== L ? "/" : "";
      for (let a = 0; a < c; a++)
        l += o[a], e.has(l) || e.set(l, null), l += "/";
      e.set(r, s);
    },
    async delete(n) {
      return e.delete(I(n));
    }
  };
}
async function qn(e, t) {
  if ("createSyncAccessHandle" in e) {
    const s = await e.createSyncAccessHandle(), r = t instanceof Uint8Array ? t : me(t);
    s.write(r, { at: 0 }), s.flush(), s.close();
    return;
  }
  const n = await e.createWritable();
  await n.write(t), await n.close();
}
async function Yn(e) {
  if ("createSyncAccessHandle" in e) {
    const n = await e.createSyncAccessHandle(), s = n.getSize(), r = new Uint8Array(new ArrayBuffer(s));
    return n.read(r, { at: 0 }), r;
  }
  const t = await e.getFile();
  return new Uint8Array(await t.arrayBuffer());
}
async function Vn() {
  try {
    if (!("navigator" in globalThis) || !globalThis?.navigator?.storage)
      throw new Error("OPFS not supported by the current browser");
    const e = ae(), t = await e.files(), n = await navigator.storage.getDirectory();
    return t.set(L, n), {
      async files() {
        return e;
      },
      async get(r) {
        const i = r.replace(/[:,]/g, "_");
        console.log({
          resPath: i,
          files: t
        });
        const o = await e.get(i);
        return o.kind === "file" ? await Yn(o) : null;
      },
      async set(r, i, o) {
        const c = r.replace(/[:,]/g, "_"), l = I(c), f = Z(l).split(L).filter((p) => p.length > 0), u = f.length;
        let g = f[0] !== L ? "/" : "", m = n;
        for (let p = 0; p < u; p++) {
          const d = f[p];
          g += d, t.has(g) || (m = await m.getDirectoryHandle(d, { create: !0 }), t.set(g, m)), g += L;
        }
        const h = await m.getFileHandle(At(l), { create: !0 });
        await qn(h, i), t.set(l, h);
      },
      async delete(r) {
        const i = I(r), o = Z(i), c = await e.get(i);
        return await (await e.get(o)).removeEntry(c.name), await e.delete(i);
      }
    };
  } catch (e) {
    throw new Error(`Cannot create OPFS Virtual File System: ${e}`, { cause: e });
  }
}
async function Zn(e, t = "OPFS") {
  try {
    switch (t) {
      case "DEFAULT":
        return ae();
      case "OPFS":
        return await Vn();
    }
    return ae();
  } catch (n) {
    e.emit("logger.warn", n);
  }
  return ae();
}
const He = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", We = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$", H = {};
function Xe(e, t) {
  if (!H[e]) {
    H[e] = {};
    for (let n = 0; n < e.length; n++)
      H[e][e.charAt(n)] = n;
  }
  return H[e][t];
}
function Kn(e) {
  if (e == null)
    return "";
  const t = Q(e, 6, (n) => He.charAt(n));
  switch (t.length % 4) {
    default:
    case 0:
      return t;
    case 1:
      return t + "===";
    case 2:
      return t + "==";
    case 3:
      return t + "=";
  }
}
function Jn(e) {
  return e == null ? "" : e == "" ? null : ee(e.length, 32, (t) => Xe(He, e.charAt(t)));
}
function Qn(e) {
  return e == null ? "" : Q(e, 6, (t) => We.charAt(t));
}
function es(e) {
  return e == null ? "" : e == "" ? null : (e = e.replaceAll(" ", "+"), ee(e.length, 32, (t) => Xe(We, e.charAt(t))));
}
function ts(e) {
  return e == null ? "" : Q(e, 15, function(t) {
    return String.fromCharCode(t + 32);
  }) + " ";
}
function ns(e) {
  return e == null ? "" : e == "" ? null : ee(e.length, 16384, function(t) {
    return e.charCodeAt(t) - 32;
  });
}
function ss(e) {
  return Q(e, 16, String.fromCharCode);
}
function rs(e) {
  return e == null ? "" : e == "" ? null : ee(e.length, 32768, (t) => e.charCodeAt(t));
}
function Q(e, t, n) {
  if (e == null)
    return "";
  const s = [], r = {}, i = {};
  let o, c, l, a = "", f = "", u = "", g = 2, m = 3, h = 2, p = 0, d = 0;
  for (c = 0; c < e.length; c += 1)
    if (a = e.charAt(c), Object.prototype.hasOwnProperty.call(r, a) || (r[a] = m++, i[a] = !0), u = f + a, Object.prototype.hasOwnProperty.call(r, u))
      f = u;
    else {
      if (Object.prototype.hasOwnProperty.call(i, f)) {
        if (f.charCodeAt(0) < 256) {
          for (o = 0; o < h; o++)
            p = p << 1, d == t - 1 ? (d = 0, s.push(n(p)), p = 0) : d++;
          for (l = f.charCodeAt(0), o = 0; o < 8; o++)
            p = p << 1 | l & 1, d == t - 1 ? (d = 0, s.push(n(p)), p = 0) : d++, l = l >> 1;
        } else {
          for (l = 1, o = 0; o < h; o++)
            p = p << 1 | l, d == t - 1 ? (d = 0, s.push(n(p)), p = 0) : d++, l = 0;
          for (l = f.charCodeAt(0), o = 0; o < 16; o++)
            p = p << 1 | l & 1, d == t - 1 ? (d = 0, s.push(n(p)), p = 0) : d++, l = l >> 1;
        }
        g--, g == 0 && (g = Math.pow(2, h), h++), delete i[f];
      } else
        for (l = r[f], o = 0; o < h; o++)
          p = p << 1 | l & 1, d == t - 1 ? (d = 0, s.push(n(p)), p = 0) : d++, l = l >> 1;
      g--, g == 0 && (g = Math.pow(2, h), h++), r[u] = m++, f = String(a);
    }
  if (f !== "") {
    if (Object.prototype.hasOwnProperty.call(i, f)) {
      if (f.charCodeAt(0) < 256) {
        for (o = 0; o < h; o++)
          p = p << 1, d == t - 1 ? (d = 0, s.push(n(p)), p = 0) : d++;
        for (l = f.charCodeAt(0), o = 0; o < 8; o++)
          p = p << 1 | l & 1, d == t - 1 ? (d = 0, s.push(n(p)), p = 0) : d++, l = l >> 1;
      } else {
        for (l = 1, o = 0; o < h; o++)
          p = p << 1 | l, d == t - 1 ? (d = 0, s.push(n(p)), p = 0) : d++, l = 0;
        for (l = f.charCodeAt(0), o = 0; o < 16; o++)
          p = p << 1 | l & 1, d == t - 1 ? (d = 0, s.push(n(p)), p = 0) : d++, l = l >> 1;
      }
      g--, g == 0 && (g = Math.pow(2, h), h++), delete i[f];
    } else
      for (l = r[f], o = 0; o < h; o++)
        p = p << 1 | l & 1, d == t - 1 ? (d = 0, s.push(n(p)), p = 0) : d++, l = l >> 1;
    g--, g == 0 && (g = Math.pow(2, h), h++);
  }
  for (l = 2, o = 0; o < h; o++)
    p = p << 1 | l & 1, d == t - 1 ? (d = 0, s.push(n(p)), p = 0) : d++, l = l >> 1;
  for (; ; )
    if (p = p << 1, d == t - 1) {
      s.push(n(p));
      break;
    } else
      d++;
  return s.join("");
}
function ee(e, t, n) {
  const s = [];
  let r = 4, i = 4, o = 3, c = "";
  const l = [];
  let a, f, u, g, m, h, p;
  const d = { val: n(0), position: t, index: 1 };
  for (a = 0; a < 3; a += 1)
    s[a] = a;
  for (u = 0, m = Math.pow(2, 2), h = 1; h != m; )
    g = d.val & d.position, d.position >>= 1, d.position == 0 && (d.position = t, d.val = n(d.index++)), u |= (g > 0 ? 1 : 0) * h, h <<= 1;
  switch (u) {
    case 0:
      for (u = 0, m = Math.pow(2, 8), h = 1; h != m; )
        g = d.val & d.position, d.position >>= 1, d.position == 0 && (d.position = t, d.val = n(d.index++)), u |= (g > 0 ? 1 : 0) * h, h <<= 1;
      p = String.fromCharCode(u);
      break;
    case 1:
      for (u = 0, m = Math.pow(2, 16), h = 1; h != m; )
        g = d.val & d.position, d.position >>= 1, d.position == 0 && (d.position = t, d.val = n(d.index++)), u |= (g > 0 ? 1 : 0) * h, h <<= 1;
      p = String.fromCharCode(u);
      break;
    case 2:
      return "";
  }
  for (s[3] = p, f = p, l.push(p); ; ) {
    if (d.index > e)
      return "";
    for (u = 0, m = Math.pow(2, o), h = 1; h != m; )
      g = d.val & d.position, d.position >>= 1, d.position == 0 && (d.position = t, d.val = n(d.index++)), u |= (g > 0 ? 1 : 0) * h, h <<= 1;
    switch (p = u) {
      case 0:
        for (u = 0, m = Math.pow(2, 8), h = 1; h != m; )
          g = d.val & d.position, d.position >>= 1, d.position == 0 && (d.position = t, d.val = n(d.index++)), u |= (g > 0 ? 1 : 0) * h, h <<= 1;
        s[i++] = String.fromCharCode(u), p = i - 1, r--;
        break;
      case 1:
        for (u = 0, m = Math.pow(2, 16), h = 1; h != m; )
          g = d.val & d.position, d.position >>= 1, d.position == 0 && (d.position = t, d.val = n(d.index++)), u |= (g > 0 ? 1 : 0) * h, h <<= 1;
        s[i++] = String.fromCharCode(u), p = i - 1, r--;
        break;
      case 2:
        return l.join("");
    }
    if (r == 0 && (r = Math.pow(2, o), o++), s[p])
      c = s[p];
    else if (p === i && typeof f == "string")
      c = f + f.charAt(0);
    else
      return null;
    l.push(c), s[i++] = f + c.charAt(0), r--, f = c, r == 0 && (r = Math.pow(2, o), o++);
  }
}
const sr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  _compress: Q,
  _decompress: ee,
  baseReverseDic: H,
  compress: ss,
  compressToBase64: Kn,
  compressToURL: Qn,
  compressToUTF16: ts,
  decompress: rs,
  decompressFromBase64: Jn,
  decompressFromURL: es,
  decompressFromUTF16: ns,
  getBaseValue: Xe,
  keyStrBase64: He,
  keyStrUriSafe: We
}, Symbol.toStringTag, { value: "Module" })), is = /^(@[^\/]+\/[^@\/]+)(?:@([^\/]+))?(\/.*)?$/, os = /^([^@\/]+)(?:@([^\/]+))?(\/.*)?$/;
function ye(e) {
  const t = is.exec(e) || os.exec(e);
  if (!t)
    throw new Error(`[parse-package-name] invalid package name: ${e}`);
  return {
    name: t[1] || "",
    version: t[2] || "latest",
    path: t[3] || ""
  };
}
const as = [
  "B",
  "kB",
  "MB",
  "GB",
  "TB",
  "PB",
  "EB",
  "ZB",
  "YB"
], ls = [
  "B",
  "kiB",
  "MiB",
  "GiB",
  "TiB",
  "PiB",
  "EiB",
  "ZiB",
  "YiB"
], cs = [
  "b",
  "kbit",
  "Mbit",
  "Gbit",
  "Tbit",
  "Pbit",
  "Ebit",
  "Zbit",
  "Ybit"
], us = [
  "b",
  "kibit",
  "Mibit",
  "Gibit",
  "Tibit",
  "Pibit",
  "Eibit",
  "Zibit",
  "Yibit"
], it = (e, t, n) => {
  let s = e;
  return typeof t == "string" || Array.isArray(t) ? s = e.toLocaleString(t, n) : (t === !0 || n !== void 0) && (s = e.toLocaleString(void 0, n)), s;
};
function ot(e, t) {
  if (!Number.isFinite(e))
    throw new TypeError(`Expected a finite number, got ${typeof e}: ${e}`);
  t = {
    bits: !1,
    binary: !1,
    ...t
  };
  const n = t.bits ? t.binary ? us : cs : t.binary ? ls : as;
  if (t.signed && e === 0)
    return ` 0 ${n[0]}`;
  const s = e < 0, r = s ? "-" : t.signed ? "+" : "";
  s && (e = -e);
  let i;
  if (t.minimumFractionDigits !== void 0 && (i = { minimumFractionDigits: t.minimumFractionDigits }), t.maximumFractionDigits !== void 0 && (i = { maximumFractionDigits: t.maximumFractionDigits, ...i }), e < 1) {
    const a = it(e, t.locale, i);
    return r + a + " " + n[0];
  }
  const o = Math.min(Math.floor(t.binary ? Math.log(e) / Math.log(1024) : Math.log10(e) / 3), n.length - 1);
  e /= (t.binary ? 1024 : 1e3) ** o, i || (e = e.toPrecision(3));
  const c = it(Number(e), t.locale, i), l = n[o];
  return r + c + " " + l;
}
function k(e, t) {
  if (typeof e == "string")
    return e;
  if (e) {
    let n, s;
    if (Array.isArray(e)) {
      for (n = 0; n < e.length; n++)
        if (s = k(e[n], t))
          return s;
    } else
      for (n in e)
        if (t.has(n))
          return k(e[n], t);
  }
}
function _(e, t, n) {
  throw new Error(
    n ? `No known conditions for "${t}" entry in "${e}" package` : `Missing "${t}" export in "${e}" package`
  );
}
function qe(e, t) {
  return t === e ? "." : t[0] === "." ? t : t.replace(new RegExp("^" + e + "/"), "./");
}
function fs(e, t = ".", n = {}) {
  const { name: s, exports: r } = e;
  if (r) {
    const { browser: i, require: o, unsafe: c, conditions: l = [] } = n;
    let a = qe(s, t);
    if (a[0] !== "." && (a = "./" + a), typeof r == "string")
      return a === "." ? r : _(s, a);
    const f = /* @__PURE__ */ new Set(["default", ...l]);
    c || f.add(o ? "require" : "import"), c || f.add(i ? "browser" : "node");
    let u, g, m = !1;
    for (u in r) {
      m = u[0] !== ".";
      break;
    }
    if (m)
      return a === "." ? k(r, f) || _(s, a, 1) : _(s, a);
    if (g = r[a])
      return k(g, f) || _(s, a, 1);
    for (u in r) {
      if (g = u[u.length - 1], g === "/" && a.startsWith(u))
        return (g = k(r[u], f)) ? g + a.substring(u.length) : _(s, a, 1);
      if (g === "*" && a.startsWith(u.slice(0, -1)) && a.substring(u.length - 1).length > 0)
        return (g = k(r[u], f)) ? g.replace("*", a.substring(u.length - 1)) : _(s, a, 1);
    }
    return _(s, a);
  }
}
function hs(e, t = {}) {
  let n = 0, s, r = t.browser, i = t.fields || ["module", "main"];
  for (r && !i.includes("browser") && i.unshift("browser"); n < i.length; n++)
    if (s = e[i[n]]) {
      if (typeof s != "string")
        if (typeof s == "object" && i[n] == "browser") {
          if (typeof r == "string" && (s = s[r = qe(e.name, r)], s == null))
            return r;
        } else
          continue;
      return typeof s == "string" ? "./" + s.replace(/^\.?\//, "") : s;
    }
}
function ps(e, t = ".", n = {}) {
  const { name: s, imports: r } = e;
  if (r) {
    const { browser: i, require: o, unsafe: c, conditions: l = [] } = n, a = qe(s, t);
    if (typeof r == "string")
      return a === "#" ? r : _(s, a);
    const f = /* @__PURE__ */ new Set(["default", ...l]);
    c || f.add(o ? "require" : "import"), c || f.add(i ? "browser" : "node");
    let u, g, m = !1;
    for (u in r) {
      m = u[0] !== "#";
      break;
    }
    if (m)
      return a === "#" ? k(r, f) || _(s, a, 1) : _(s, a);
    if (g = r[a])
      return k(g, f) || _(s, a, 1);
    for (u in r) {
      if (g = u[u.length - 1], g === "/" && a.startsWith(u))
        return (g = k(r[u], f)) ? g + a.substring(u.length) : _(s, a, 1);
      if (g === "*" && a.startsWith(u.slice(0, -1)) && a.substring(u.length - 1).length > 0)
        return (g = k(r[u], f)) ? g.replace("*", a.substring(u.length - 1)) : _(s, a, 1);
    }
    return _(s, a);
  }
}
const ds = "2.0.0", Ie = 256, W = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
9007199254740991, le = 16;
let kt = 0;
const y = (e, t) => ({ index: kt++, pattern: e, regex: new RegExp(e, t ? "g" : void 0) }), U = "0|[1-9]\\d*", z = "[0-9]+", Ye = "\\d*[a-zA-Z-][a-zA-Z0-9-]*", xe = `(?:${U}|${Ye})`, De = `(?:${z}|${Ye})`, je = "[0-9A-Za-z-]+", Nt = `(${U})\\.(${U})\\.(${U})`, Pt = `(${z})\\.(${z})\\.(${z})`, te = `(?:\\+(${je}(?:\\.${je})*))`, Ve = `(?:-(${xe}(?:\\.${xe})*))`, Ze = `(?:-?(${De}(?:\\.${De})*))`, be = `v?${Nt}${Ve}?${te}?`, re = `[v=\\s]*${Pt}${Ze}?${te}?`, ce = `${U}|x|X|\\*`, ue = `${z}|x|X|\\*`, F = "((?:<|>)?=?)", C = `[v=\\s]*(${ce})(?:\\.(${ce})(?:\\.(${ce})(?:${Ve})?${te}?)?)?`, M = `[v=\\s]*(${ue})(?:\\.(${ue})(?:\\.(${ue})(?:${Ze})?${te}?)?)?`, at = `(^|[^\\d])(\\d{1,${le}})(?:\\.(\\d{1,${le}}))?(?:\\.(\\d{1,${le}}))?(?:$|[^\\d])`, Re = "(?:~>?)", ve = "(?:\\^)", S = {
  // The following Regular Expressions can be used for tokenizing,
  // validating, and parsing SemVer version strings.
  // ## Numeric Identifier
  // A single `0`, or a non-zero digit followed by zero or more digits.
  NUMERICIDENTIFIER: y(U),
  NUMERICIDENTIFIERLOOSE: y(z),
  // ## Non-numeric Identifier
  // Zero or more digits, followed by a letter or hyphen, and then zero or
  // more letters, digits, or hyphens.
  NONNUMERICIDENTIFIER: y(Ye),
  // ## Main Version
  // Three dot-separated numeric identifiers.
  MAINVERSION: y(Nt),
  MAINVERSIONLOOSE: y(Pt),
  // ## Pre-release Version Identifier
  // A numeric identifier, or a non-numeric identifier.
  PRERELEASEIDENTIFIER: y(xe),
  PRERELEASEIDENTIFIERLOOSE: y(De),
  // ## Pre-release Version
  // Hyphen, followed by one or more dot-separated pre-release version
  // identifiers.
  PRERELEASE: y(Ve),
  PRERELEASELOOSE: y(Ze),
  // ## Build Metadata Identifier
  // Any combination of digits, letters, or hyphens.
  BUILDIDENTIFIER: y(je),
  // ## Build Metadata
  // Plus sign, followed by one or more period-separated build metadata
  // identifiers.
  BUILD: y(te),
  // ## Full Version String
  // A main version, followed optionally by a pre-release version and
  // build metadata.
  // Note that the only major, minor, patch, and pre-release sections of
  // the version string are capturing groups.  The build metadata is not a
  // capturing group, because it should not ever be used in version
  // comparison.
  FULLPLAIN: y(be),
  FULL: y(`^${be}$`),
  // like full, but allows v1.2.3 and =1.2.3, which people do sometimes.
  // also, 1.0.0alpha1 (prerelease without the hyphen) which is pretty
  // common in the npm registry.
  LOOSEPLAIN: y(re),
  LOOSE: y(`^${re}$`),
  GTLT: y(F),
  // Something like "2.*" or "1.2.x".
  // Note that "x.x" is a valid xRange identifer, meaning "any version"
  // Only the first item is strictly required.
  XRANGEIDENTIFIERLOOSE: y(ue),
  XRANGEIDENTIFIER: y(ce),
  XRANGEPLAIN: y(C),
  XRANGEPLAINLOOSE: y(M),
  XRANGE: y(`^${F}\\s*${C}$`),
  XRANGELOOSE: y(`^${F}\\s*${M}$`),
  // Coercion.
  // Extract anything that could conceivably be a part of a valid semver
  COERCE: y(at),
  COERCERTL: y(at, !0),
  // Tilde ranges.
  // Meaning is "reasonably at or greater than"
  LONETILDE: y("(?:~>?)"),
  TILDETRIM: y(`(\\s*)${Re}\\s+`, !0),
  TILDE: y(`^${Re}${C}$`),
  TILDELOOSE: y(`^${Re}${M}$`),
  // Caret ranges.
  // Meaning is "at least and backwards compatible with"
  LONECARET: y("(?:\\^)"),
  CARETTRIM: y(`(\\s*)${ve}\\s+`, !0),
  CARET: y(`^${ve}${C}$`),
  CARETLOOSE: y(`^${ve}${M}$`),
  // A simple gt/lt/eq thing, or just "" to indicate "any version"
  COMPARATORLOOSE: y(`^${F}\\s*(${re})$|^$`),
  COMPARATOR: y(`^${F}\\s*(${be})$|^$`),
  // An expression to strip any whitespace between the gtlt and the thing
  // it modifies, so that `> 1.2.3` ==> `>1.2.3`
  COMPARATORTRIM: y(`(\\s*)${F}\\s*(${re}|${C})`, !0),
  // Something like `1.2.3 - 1.2.4`
  // Note that these all use the loose form, because they'll be
  // checked against either the strict or loose comparator form
  // later.
  HYPHENRANGE: y(`^\\s*(${C})\\s+-\\s+(${C})\\s*$`),
  HYPHENRANGELOOSE: y(`^\\s*(${M})\\s+-\\s+(${M})\\s*$`),
  // Star ranges basically just allow anything at all.
  STAR: y("(<|>)?=?\\s*\\*"),
  // >=0.0.0 is like a star
  GTE0: y("^\\s*>=\\s*0\\.0\\.0\\s*$"),
  GTE0PRE: y("^\\s*>=\\s*0\\.0\\.0-0\\s*$")
}, gs = ["includePrerelease", "loose", "rtl"], $e = (e) => e ? typeof e != "object" ? { loose: !0 } : gs.filter((t) => e[t]).reduce((t, n) => (t[n] = !0, t), {}) : {}, Fe = /^[0-9]+$/, X = (e, t) => {
  const n = Fe.test(e), s = Fe.test(t);
  let r = e, i = t;
  return n && s && (r = +e, i = +t), r === i ? 0 : n && !s ? -1 : s && !n ? 1 : r < i ? -1 : 1;
};
class O {
  raw;
  loose;
  options;
  major;
  minor;
  patch;
  version;
  build;
  prerelease;
  includePrerelease;
  constructor(t, n) {
    if (n = $e(n), t instanceof O) {
      if (t.loose === !!n.loose && t.includePrerelease === !!n.includePrerelease)
        return t;
      t = t.version;
    } else if (typeof t != "string")
      throw new TypeError(`Invalid Version: ${t}`);
    if (t.length > Ie)
      throw new TypeError(
        `version is longer than ${Ie} characters`
      );
    this.options = n, this.loose = !!n.loose, this.includePrerelease = !!n.includePrerelease;
    const s = t.trim().match(n.loose ? S.LOOSE.regex : S.FULL.regex);
    if (!s)
      throw new TypeError(`Invalid Version: ${t}`);
    if (this.raw = t, this.major = +s[1], this.minor = +s[2], this.patch = +s[3], this.major > W || this.major < 0)
      throw new TypeError("Invalid major version");
    if (this.minor > W || this.minor < 0)
      throw new TypeError("Invalid minor version");
    if (this.patch > W || this.patch < 0)
      throw new TypeError("Invalid patch version");
    s[4] ? this.prerelease = s[4].split(".").map((r) => {
      if (/^[0-9]+$/.test(r)) {
        const i = +r;
        if (i >= 0 && i < W)
          return i;
      }
      return r;
    }) : this.prerelease = [], this.build = s[5] ? s[5].split(".") : [], this.format();
  }
  format() {
    return this.version = `${this.major}.${this.minor}.${this.patch}`, this.prerelease.length && (this.version += `-${this.prerelease.join(".")}`), this.version;
  }
  toString() {
    return this.version;
  }
  /**
   * Compares two versions excluding build identifiers (the bit after `+` in the semantic version string).
   *
   * @return
   * - `0` if `this` == `other`
   * - `1` if `this` is greater
   * - `-1` if `other` is greater.
   */
  compare(t) {
    if (!(t instanceof O)) {
      if (typeof t == "string" && t === this.version)
        return 0;
      t = new O(t, this.options);
    }
    return t.version === this.version ? 0 : this.compareMain(t) || this.comparePre(t);
  }
  /**
   * Compares the release portion of two versions.
   *
   * @return
   * - `0` if `this` == `other`
   * - `1` if `this` is greater
   * - `-1` if `other` is greater.
   */
  compareMain(t) {
    return t instanceof O || (t = new O(t, this.options)), X(this.major, t.major) || X(this.minor, t.minor) || X(this.patch, t.patch);
  }
  /**
   * Compares the prerelease portion of two versions.
   *
   * @return
   * - `0` if `this` == `other`
   * - `1` if `this` is greater
   * - `-1` if `other` is greater.
   */
  comparePre(t) {
    if (t instanceof O || (t = new O(t, this.options)), this.prerelease.length && !t.prerelease.length)
      return -1;
    if (!this.prerelease.length && t.prerelease.length)
      return 1;
    if (!this.prerelease.length && !t.prerelease.length)
      return 0;
    let n = 0;
    do {
      const s = this.prerelease[n], r = t.prerelease[n];
      if (s === void 0 && r === void 0)
        return 0;
      if (r === void 0)
        return 1;
      if (s === void 0)
        return -1;
      if (s === r)
        continue;
      return X(s, r);
    } while (++n);
  }
}
const pe = Symbol("SemVer ANY");
class Ee {
  semver;
  operator;
  value;
  loose;
  options;
  constructor(t, n) {
    if (n = $e(n), t instanceof Ee) {
      if (t.loose === !!n.loose)
        return t;
      t = t.value;
    }
    this.options = n, this.loose = !!n.loose, this.parse(t), this.semver === pe ? this.value = "" : this.value = this.operator + this.semver.version;
  }
  parse(t) {
    const n = this.options.loose ? S.COMPARATORLOOSE.regex : S.COMPARATOR.regex, s = t.match(n);
    if (!s)
      throw new TypeError(`Invalid comparator: ${t}`);
    this.operator = s[1] !== void 0 ? s[1] : "", this.operator === "=" && (this.operator = ""), s[2] ? this.semver = new O(s[2], this.options.loose) : this.semver = pe;
  }
  toString() {
    return this.value;
  }
}
const G = /* @__PURE__ */ new Map(), ie = /* @__PURE__ */ new Map(), ms = 1e3, Ct = "$1^", Lt = "$1~", It = "$1$2$3", Me = (e) => e.value === "<0.0.0-0", xt = (e) => e.value === "", Dt = (e, t) => (e = Mt(e, t), e = jt(e, t), e = zt(e, t), e = Gt(e), e), v = (e) => !e || e.toLowerCase() === "x" || e === "*", jt = (e, t) => e.trim().split(/\s+/).map((n) => Ft(n, t)).join(" "), Ft = (e, t) => {
  const n = t.loose ? S.TILDELOOSE.regex : S.TILDE.regex;
  return e.replace(n, (s, r, i, o, c) => {
    let l;
    return v(r) ? l = "" : v(i) ? l = `>=${r}.0.0 <${+r + 1}.0.0-0` : v(o) ? l = `>=${r}.${i}.0 <${r}.${+i + 1}.0-0` : c ? l = `>=${r}.${i}.${o}-${c} <${r}.${+i + 1}.0-0` : l = `>=${r}.${i}.${o} <${r}.${+i + 1}.0-0`, l;
  });
}, Mt = (e, t) => e.trim().split(/\s+/).map((n) => Ut(n, t)).join(" "), Ut = (e, t) => {
  const n = t.loose ? S.CARETLOOSE.regex : S.CARET.regex, s = t.includePrerelease ? "-0" : "";
  return e.replace(n, (r, i, o, c, l) => {
    let a;
    return v(i) ? a = "" : v(o) ? a = `>=${i}.0.0${s} <${+i + 1}.0.0-0` : v(c) ? i === "0" ? a = `>=${i}.${o}.0${s} <${i}.${+o + 1}.0-0` : a = `>=${i}.${o}.0${s} <${+i + 1}.0.0-0` : l ? i === "0" ? o === "0" ? a = `>=${i}.${o}.${c}-${l} <${i}.${o}.${+c + 1}-0` : a = `>=${i}.${o}.${c}-${l} <${i}.${+o + 1}.0-0` : a = `>=${i}.${o}.${c}-${l} <${+i + 1}.0.0-0` : i === "0" ? o === "0" ? a = `>=${i}.${o}.${c}${s} <${i}.${o}.${+c + 1}-0` : a = `>=${i}.${o}.${c}${s} <${i}.${+o + 1}.0-0` : a = `>=${i}.${o}.${c} <${+i + 1}.0.0-0`, a;
  });
}, zt = (e, t) => e.split(/\s+/).map((n) => Bt(n, t)).join(" "), Bt = (e, t) => {
  e = e.trim();
  const n = t.loose ? S.XRANGELOOSE.regex : S.XRANGE.regex;
  return e.replace(n, (s, r, i, o, c, l) => {
    const a = v(i), f = a || v(o), u = f || v(c), g = u;
    return r === "=" && g && (r = ""), l = t.includePrerelease ? "-0" : "", a ? r === ">" || r === "<" ? s = "<0.0.0-0" : s = "*" : r && g ? (f && (o = 0), c = 0, r === ">" ? (r = ">=", f ? (i = +i + 1, o = 0, c = 0) : (o = +o + 1, c = 0)) : r === "<=" && (r = "<", f ? i = +i + 1 : o = +o + 1), r === "<" && (l = "-0"), s = `${r + i}.${o}.${c}${l}`) : f ? s = `>=${i}.0.0${l} <${+i + 1}.0.0-0` : u && (s = `>=${i}.${o}.0${l} <${i}.${+o + 1}.0-0`), s;
  });
}, Gt = (e, t) => e.trim().replace(S.STAR.regex, ""), Ht = (e, t) => e.trim().replace(S[t.includePrerelease ? "GTE0PRE" : "GTE0"].regex, ""), Wt = (e) => (t, n, s, r, i, o, c, l, a, f, u, g, m) => (v(s) ? n = "" : v(r) ? n = `>=${s}.0.0${e ? "-0" : ""}` : v(i) ? n = `>=${s}.${r}.0${e ? "-0" : ""}` : o ? n = `>=${n}` : n = `>=${n}${e ? "-0" : ""}`, v(a) ? l = "" : v(f) ? l = `<${+a + 1}.0.0-0` : v(u) ? l = `<${a}.${+f + 1}.0-0` : g ? l = `<=${a}.${f}.${u}-${g}` : e ? l = `<${a}.${f}.${+u + 1}-0` : l = `<=${l}`, `${n} ${l}`.trim()), Xt = (e, t, n) => {
  for (let s = 0; s < e.length; s++)
    if (!e[s].test(t))
      return !1;
  if (t.prerelease.length && !n.includePrerelease) {
    for (let s = 0; s < e.length; s++)
      if (e[s].semver !== pe && e[s].semver.prerelease.length > 0) {
        const r = e[s].semver;
        if (r.major === t.major && r.minor === t.minor && r.patch === t.patch)
          return !0;
      }
    return !1;
  }
  return !0;
};
class K {
  range;
  raw;
  loose;
  options;
  includePrerelease;
  set;
  constructor(t, n) {
    if (n = $e(n), t instanceof K)
      return t.loose === !!n.loose && t.includePrerelease === !!n.includePrerelease ? t : new K(t.raw, n);
    if (this.options = n, this.loose = !!n.loose, this.includePrerelease = !!n.includePrerelease, this.raw = t, this.set = t.split("||").map((s) => this.parseRange(s.trim())).filter((s) => s.length), !this.set.length)
      throw new TypeError(`Invalid SemVer Range: ${t}`);
    if (this.set.length > 1) {
      const s = this.set[0];
      if (this.set = this.set.filter((r) => !Me(r[0])), this.set.length === 0)
        this.set = [s];
      else if (this.set.length > 1) {
        for (const r of this.set)
          if (r.length === 1 && xt(r[0])) {
            this.set = [r];
            break;
          }
      }
    }
    this.format();
  }
  format() {
    return this.range = this.set.map((t) => t.join(" ").trim()).join("||").trim(), this.range;
  }
  toString() {
    return this.range;
  }
  parseRange(t) {
    t = t.trim();
    const s = `parseRange:${Object.keys(this.options).join(",")}:${t}`;
    if (G.has(s))
      return ie.set(s, Date.now()), G.get(s);
    const r = this.options.loose, i = r ? S.HYPHENRANGELOOSE.regex : S.HYPHENRANGE.regex;
    t = t.replace(i, Wt(this.options.includePrerelease)), t = t.replace(S.COMPARATORTRIM.regex, It), t = t.replace(S.TILDETRIM.regex, Lt), t = t.replace(S.CARETTRIM.regex, Ct), t = t.split(/\s+/).join(" ");
    let o = t.split(" ").map((u) => Dt(u, this.options)).join(" ").split(/\s+/).map((u) => Ht(u, this.options));
    r && (o = o.filter((u) => !!u.match(S.COMPARATORLOOSE.regex)));
    const c = /* @__PURE__ */ new Map(), l = o.map((u) => new Ee(u, this.options));
    for (const u of l) {
      if (Me(u))
        return [u];
      c.set(u.value, u);
    }
    c.size > 1 && c.has("") && c.delete("");
    const a = [...c.values()], f = a;
    if (G.set(s, f), ie.set(s, Date.now()), G.size >= ms) {
      const g = [...ie.entries()].sort((m, h) => m[1] - h[1])[0][0];
      G.delete(g), ie.delete(g);
    }
    return a;
  }
  // if ANY of the sets match ALL of its comparators, then pass
  test(t) {
    if (!t)
      return !1;
    if (typeof t == "string")
      try {
        t = new O(t, this.options);
      } catch {
        return !1;
      }
    for (let n = 0; n < this.set.length; n++)
      if (Xt(this.set[n], t, this.options))
        return !0;
    return !1;
  }
}
function Ue(e, t, n) {
  let s = null, r = null, i = null;
  try {
    i = new K(t, n);
  } catch {
    return null;
  }
  return e.forEach((o) => {
    i.test(o) && (!s || r.compare(o) === -1) && (s = o, r = new O(s, n));
  }), s;
}
const rr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ANY: pe,
  Comparator: Ee,
  MAX_LENGTH: Ie,
  MAX_SAFE_COMPONENT_LENGTH: le,
  MAX_SAFE_INTEGER: W,
  get R() {
    return kt;
  },
  Range: K,
  SEMVER_SPEC_VERSION: ds,
  SemVer: O,
  caretTrimReplace: Ct,
  comparatorTrimReplace: It,
  compareIdentifiers: X,
  createToken: y,
  default: Ue,
  hyphenReplace: Wt,
  isAny: xt,
  isNullSet: Me,
  isX: v,
  maxSatisfying: Ue,
  numeric: Fe,
  parseComparator: Dt,
  parseOptions: $e,
  replaceCaret: Ut,
  replaceCarets: Mt,
  replaceGTE0: Ht,
  replaceStars: Gt,
  replaceTilde: Ft,
  replaceTildes: jt,
  replaceXRange: Bt,
  replaceXRanges: zt,
  testSet: Xt,
  tildeTrimReplace: Lt,
  tokens: S
}, Symbol.toStringTag, { value: "Module" })), ne = (e) => {
  const t = "https://registry.npmjs.com", { name: n, version: s, path: r } = ye(e), i = `${t}/-/v1/search?text=${encodeURIComponent(n)}&popularity=0.5&size=30`, o = `${t}/${n}/${s}`, c = `${t}/${n}`;
  return { searchURL: i, packageURL: c, packageVersionURL: o, version: s, name: n, path: r };
}, ir = async (e) => {
  const { searchURL: t } = ne(e);
  let n;
  try {
    n = await (await J(t, !1)).json();
  } catch (r) {
    throw console.warn(r), r;
  }
  return { packages: n?.objects, info: n };
}, ws = async (e) => {
  const { packageURL: t } = ne(e);
  try {
    return await (await J(t, !1)).json();
  } catch (n) {
    throw console.warn(n), n;
  }
}, ys = async (e) => {
  const { packageVersionURL: t } = ne(e);
  try {
    return await (await J(t, !1)).json();
  } catch (n) {
    throw console.warn(n), n;
  }
}, $s = async (e) => {
  try {
    const t = await ws(e), n = Object.keys(t.versions), s = t["dist-tags"];
    return { versions: n, tags: s };
  } catch (t) {
    throw console.warn(t), t;
  }
}, Es = async (e) => {
  try {
    let { version: t } = ne(e);
    const n = await $s(e);
    if (n) {
      const { versions: s, tags: r } = n;
      return t in r && (t = r[t]), s.includes(t) ? t : Ue(s, t);
    }
  } catch (t) {
    throw console.warn(t), t;
  }
}, or = async (e) => {
  try {
    const { name: t } = ne(e), n = await Es(e);
    return await ys(`${t}@${n}`);
  } catch (t) {
    throw console.warn(t), t;
  }
}, B = "https://unpkg.com", qt = (e) => /^(skypack|esm|esm\.sh|unpkg|jsdelivr|esm\.run)\:?/.test(e) || /^https?:\/\/(cdn\.skypack\.dev|cdn\.esm\.sh|cdn\.jsdelivr\.net\/npm|unpkg\.com)/.test(e) ? "npm" : /^(jsdelivr\.gh|github)\:?/.test(e) || /^https?:\/\/(cdn\.jsdelivr\.net\/gh|raw\.githubusercontent\.com)/.test(e) ? "github" : /^(deno)\:?/.test(e) || /^https?:\/\/(deno\.land\/x)/.test(e) ? "deno" : "other", As = (e, t = B) => (/^skypack\:/.test(e) ? t = "https://cdn.skypack.dev" : /^(esm\.sh|esm)\:/.test(e) ? t = "https://cdn.esm.sh" : /^unpkg\:/.test(e) ? t = "https://unpkg.com" : /^(jsdelivr|esm\.run)\:/.test(e) ? t = "https://cdn.jsdelivr.net/npm" : /^(jsdelivr\.gh)\:/.test(e) ? t = "https://cdn.jsdelivr.net/gh" : /^(deno)\:/.test(e) ? t = "https://deno.land/x" : /^(github)\:/.test(e) && (t = "https://raw.githubusercontent.com"), /\/$/.test(t) ? t : `${t}/`), Ss = (e) => e.replace(/^(skypack|esm|esm\.sh|unpkg|jsdelivr|jsdelivr\.gh|esm\.run|deno|github)\:/, "").replace(/^https?:\/\/(cdn\.skypack\.dev|cdn\.esm\.sh|cdn\.jsdelivr\.net\/npm|unpkg\.com|cdn\.jsdelivr\.net\/gh|raw\.githubusercontent\.com|deno\.land\/x)/, "").replace(/^\//, ""), T = (e, t = B) => {
  const n = As(e, t), s = Ss(e), r = new URL(s, n);
  return { import: e, path: s, origin: n, cdn: t, url: r };
}, _e = "virtual-filesystem", bs = (e, t, n) => {
  const [s] = t, r = s().filesystem;
  return {
    name: _e,
    setup(i) {
      i.onResolve({ filter: /.*/ }, (o) => ({
        path: o.path,
        pluginData: o.pluginData ?? {},
        namespace: _e
      })), i.onLoad({ filter: /.*/, namespace: _e }, async (o) => {
        const c = we(o.path, o?.pluginData?.importer);
        return {
          contents: await Xn(r, o.path, "buffer", o?.pluginData?.importer),
          pluginData: {
            importer: c
          },
          loader: Rt(c)
        };
      });
    }
  };
}, q = "external-globals", Rs = me("export default {}"), vs = {
  console: "console-browserify",
  constants: "constants-browserify",
  crypto: "crypto-browserify",
  http: "http-browserify",
  buffer: "buffer",
  Dirent: "dirent",
  vm: "vm-browserify",
  zlib: "zlib-browserify",
  assert: "assert",
  child_process: "child_process",
  cluster: "child_process",
  dgram: "dgram",
  dns: "dns",
  domain: "domain-browser",
  events: "events",
  https: "https",
  module: "module",
  net: "net",
  path: "path-browserify",
  punycode: "punycode",
  querystring: "querystring",
  readline: "readline",
  repl: "repl",
  stream: "stream",
  string_decoder: "string_decoder",
  sys: "sys",
  timers: "timers",
  tls: "tls",
  tty: "tty-browserify",
  url: "url",
  util: "util",
  _shims: "_shims",
  _stream_duplex: "_stream_duplex",
  _stream_readable: "_stream_readable",
  _stream_writable: "_stream_writable",
  _stream_transform: "_stream_transform",
  _stream_passthrough: "_stream_passthrough",
  process: "process/browser",
  fs: "memfs",
  os: "os-browserify/browser",
  v8: "v8",
  "node-inspect": "node-inspect",
  _linklist: "_linklist",
  _stream_wrap: "_stream_wrap"
}, _s = Object.keys(vs), Ts = ["v8/tools/codemap", "v8/tools/consarray", "v8/tools/csvparser", "v8/tools/logreader", "v8/tools/profile_view", "v8/tools/profile", "v8/tools/SourceMap", "v8/tools/splaytree", "v8/tools/tickprocessor-driver", "v8/tools/tickprocessor", "node-inspect/lib/_inspect", "node-inspect/lib/internal/inspect_client ", "node-inspect/lib/internal/inspect_repl", "_linklist", "_stream_wrap"], Os = ["chokidar", "yargs", "fsevents", "worker_threads", "async_hooks", "diagnostics_channel", "http2", "inspector", "perf_hooks", "trace_events", "wasi", ...Ts, ..._s], ks = (e, t = []) => [...Os, ...t].find((n) => !!(n === e || e.startsWith(`${n}/`)));
function Ns(e, t, n) {
  const { external: s = [] } = n?.esbuild ?? {};
  return {
    name: q,
    setup(r) {
      r.onResolve({ filter: /.*/ }, (i) => {
        const o = i.path.replace(/^node\:/, ""), { path: c } = T(o);
        if (ks(c, s))
          return {
            path: c,
            namespace: q,
            external: !0
          };
      }), r.onLoad({ filter: /.*/, namespace: q }, (i) => ({
        pluginName: q,
        contents: Rs,
        warnings: [{
          text: `${i.path} is marked as an external module and will be ignored.`,
          details: `"${i.path}" is a built-in node module thus can't be bundled by https://bundlejs.com, sorry about that.`
        }]
      }));
    }
  };
}
const lt = "cdn-url", ze = (e = B, t) => async (n) => {
  if (ge(n.path)) {
    const { path: s, origin: r } = T(n.path, e), i = qt(r) == "npm", o = ye(s);
    let c = o.path, l = n.pluginData?.pkg ?? {};
    if (s[0] == "#") {
      const g = ps({ ...l, exports: l.imports }, s, {
        require: n.kind === "require-call" || n.kind === "require-resolve"
      });
      if (typeof g == "string") {
        c = g.replace(/^\.?\/?/, "/"), c && c[0] !== "/" && (c = `/${c}`);
        const m = i ? "@" + l.version : "", { url: { href: h } } = T(`${l.name}${m}${c}`);
        return {
          namespace: P,
          path: h,
          pluginData: { pkg: l }
        };
      }
    }
    if (("dependencies" in l || "devDependencies" in l || "peerDependencies" in l) && !/\S+@\S+/.test(s)) {
      const {
        devDependencies: g = {},
        dependencies: m = {},
        peerDependencies: h = {}
      } = l, p = Object.assign({}, g, h, m);
      Object.keys(p).includes(s) && (o.version = p[s]);
    }
    if (i)
      try {
        const { url: g } = T(`${o.name}@${o.version}/package.json`, r);
        l = await J(g, !0).then((h) => h.json());
        const m = fs(l, c ? "." + c.replace(/^\.?\/?/, "/") : ".", {
          require: n.kind === "require-call" || n.kind === "require-resolve"
        }) || hs(l);
        typeof m == "string" && (c = m.replace(/^\.?\/?/, "/").replace(/\.js\.js$/, ".js")), c && c[0] !== "/" && (c = `/${c}`);
      } catch (g) {
        t.emit(
          "logger.warn",
          `You may want to change CDNs. The current CDN ${/unpkg\.com/.test(r) ? `path "${r}${s}" may not` : `"${r}" doesn't`} support package.json files.
There is a chance the CDN you're using doesn't support looking through the package.json of packages. bundlejs will switch to inaccurate guesses for package versions. For package.json support you may wish to use https://unpkg.com or other CDN's that support package.json.`
        ).emit("logger.warn", g);
      }
    const f = i ? "@" + o.version : "", { url: u } = T(`${o.name}${f}${c}`, r);
    return {
      namespace: P,
      path: u.toString(),
      pluginData: { pkg: l }
    };
  }
};
function Ps(e, t, n) {
  const { origin: s } = /:/.test(n?.cdn) ? T(n?.cdn) : T(n?.cdn + ":");
  return {
    name: lt,
    setup(r) {
      r.onResolve({ filter: /.*/ }, ze(s, e)), r.onResolve({ filter: /.*/, namespace: lt }, ze(s, e));
    }
  };
}
const P = "http-url", Yt = async (e, t) => {
  try {
    const n = await J(e);
    if (!n.ok)
      throw new Error(`Couldn't load ${n.url} (${n.status} code)`);
    return t.emit("logger.info", `Fetch ${e}`), {
      // Deno doesn't have a `response.url` which is odd but whatever
      url: n.url || e,
      content: new Uint8Array(await n.arrayBuffer())
    };
  } catch (n) {
    throw new Error(`[getRequest] Failed at request (${e})
${n.toString()}`);
  }
}, Cs = async (e, t, n, s, r) => {
  const i = /new URL\(['"`](.*)['"`],(?:\s+)?import\.meta\.url(?:\s+)?\)/g, o = new URL("./", e).toString(), [c] = r, l = c().filesystem, a = Le(t), u = Array.from(a.matchAll(i)).map(async ([, g]) => {
    const { content: m, url: h } = await Yt(fe(o, g), s);
    return await Ot(l, n + ":" + h, t), {
      path: g,
      contents: m,
      get text() {
        return Le(m);
      }
    };
  });
  return await Promise.allSettled(u);
}, Vt = (e = B, t) => async (n) => {
  const s = n.path.replace(/\/$/, "/index");
  if (!s.startsWith(".")) {
    if (/^https?:\/\//.test(s))
      return {
        path: s,
        namespace: P,
        pluginData: { pkg: n.pluginData?.pkg }
      };
    const i = new URL(
      // Use the parent files URL as a host
      fe(n.pluginData?.url ? n.pluginData?.url : e, "../", s)
    ).origin, c = qt(i) == "npm" ? i : e;
    return ge(s) ? ze(c, t)(n) : {
      path: T(s, c).url.toString(),
      namespace: P,
      pluginData: { pkg: n.pluginData?.pkg }
    };
  }
  return {
    path: fe(n.pluginData?.url, "../", s),
    namespace: P,
    pluginData: { pkg: n.pluginData?.pkg }
  };
};
function Ls(e, t, n) {
  const { origin: s } = /:/.test(n?.cdn) ? T(n?.cdn) : T(n?.cdn + ":"), [r, i] = t, o = r().assets ?? [], c = r().filesystem;
  return {
    name: P,
    setup(l) {
      l.onResolve({ filter: /^https?:\/\// }, (a) => ({
        path: a.path,
        namespace: P
      })), l.onResolve({ filter: /.*/, namespace: P }, Vt(s, e)), l.onLoad({ filter: /.*/, namespace: P }, async (a) => {
        const f = Ge(a.path), u = (b = "") => f.length > 0 ? a.path : a.path + b;
        let g, m;
        const h = f.length > 0 ? [""] : ["", ".ts", ".tsx", ".js", ".mjs", ".cjs"], p = h.length;
        let d;
        for (let b = 0; b < p; b++) {
          const w = h[b];
          try {
            ({ content: g, url: m } = await Yt(u(w), e));
            break;
          } catch ($) {
            if (b == 0 && (d = $), b >= p - 1)
              throw e.emit("logger.error", $.toString()), d;
          }
        }
        await Ot(c, a.namespace + ":" + a.path, g);
        const j = (await Cs(m, g, a.namespace, e, t)).filter((b) => b.status == "rejected" ? (e.emit("logger:warn", `Asset fetch failed.
` + b?.reason?.toString()), !1) : !0).map((b) => {
          if (b.status == "fulfilled")
            return b.value;
        });
        return i({ assets: o.concat(j) }), {
          contents: g,
          loader: Rt(m),
          pluginData: { url: m, pkg: a.pluginData?.pkg }
        };
      });
    }
  };
}
const ct = "alias-globals", Zt = (e, t = {}) => {
  if (!ge(e))
    return !1;
  const n = Object.keys(t), s = e.replace(/^node\:/, ""), r = ye(s);
  return n.find((i) => r.name === i);
}, Te = (e = {}, t = B, n) => async (s) => {
  const r = s.path.replace(/^node\:/, ""), { path: i } = T(r);
  if (Zt(i, e)) {
    const o = ye(i), c = e[o.name];
    return Vt(t, n)({
      ...s,
      path: c
    });
  }
}, Is = (e, t, n) => {
  const { origin: s } = /:/.test(n?.cdn) ? T(n?.cdn) : T(n?.cdn + ":"), r = n.alias ?? {};
  return {
    name: ct,
    setup(i) {
      i.onResolve({ filter: /^node\:.*/ }, (o) => Zt(o.path, r) ? Te(r, s, e)(o) : {
        path: o.path,
        namespace: q,
        external: !0
      }), i.onResolve({ filter: /.*/ }, Te(r, s, e)), i.onResolve({ filter: /.*/, namespace: ct }, Te(r, s, e));
    }
  };
}, xs = {
  entryPoints: ["/index.tsx"],
  cdn: B,
  esbuild: {
    color: !0,
    globalName: "BundledCode",
    logLevel: "info",
    sourcemap: !1,
    target: ["esnext"],
    format: "esm",
    bundle: !0,
    minify: !0,
    treeShaking: !0,
    platform: "browser"
  },
  ascii: "ascii",
  init: {
    platform: de
  }
}, Ds = Zn(A);
async function ar(e = {}, t = Ds) {
  V("initialized") || A.emit("init.loading");
  const n = Ke("build", e), s = rn({
    filesystem: await t,
    assets: [],
    GLOBAL: [V, Pe]
  }), [r] = s, { platform: i, ...o } = n.init ?? {}, { build: c } = await ht(i, o), { define: l = {}, ...a } = n.esbuild ?? {};
  let f = [], u = [], g = null;
  try {
    try {
      const m = "p.env.NODE_ENV".replace("p.", "process.");
      g = await c({
        entryPoints: n?.entryPoints ?? [],
        loader: {
          ".png": "file",
          ".jpeg": "file",
          ".ttf": "file",
          ".svg": "text",
          ".html": "text",
          ".scss": "css"
        },
        define: {
          __NODE__: "false",
          [m]: '"production"',
          ...l
        },
        write: !1,
        outdir: "/",
        plugins: [
          Is(A, s, n),
          Ns(A, s, n),
          Ls(A, s, n),
          Ps(A, s, n),
          bs(A, s, n)
        ],
        ...a
      });
    } catch (m) {
      if (m.errors) {
        const h = [...await he(m.errors, "error", !1)], p = [...await he(m.errors, "error")];
        A.emit("logger.error", h, p);
        const d = (p.length > 1 ? `${p.length} error(s) ` : "") + "(if you are having trouble solving this issue, please create a new issue in the repo, https://github.com/okikio/bundle)";
        A.emit("logger.error", d);
        return;
      } else
        throw m;
    }
    return f = await Promise.all(
      [...r().assets].concat(g?.outputFiles)
    ), u = await Promise.all(
      f?.map(({ path: m, text: h, contents: p }) => /\.map$/.test(m) ? null : (a?.logLevel == "verbose" && (/\.(wasm|png|jpeg|webp)$/.test(m) ? A.emit("logger.log", "Output File: " + m) : A.emit("logger.log", "Output File: " + m + `
` + h)), { path: m, text: h, contents: p }))?.filter((m) => ![void 0, null].includes(m))
    ), {
      /** 
       * The output and asset files without unnecessary croft, e.g. `.map` sourcemap files 
       */
      contents: u,
      /**
       * The output and asset files with `.map` sourcemap files 
       */
      outputs: f,
      ...g
    };
  } catch (m) {
    A.emit("build.error", m);
  }
}
const Kt = {
  type: "gzip",
  quality: 9
};
async function lr(e = [], t = {}) {
  const { type: n, quality: s } = Ke("compress", t), r = e.map((a) => a instanceof Uint8Array ? a : me(a)), i = ot(
    r.reduce((a, f) => a + f.byteLength, 0)
  ), o = await (async () => {
    switch (n) {
      case "lz4": {
        const { compress: a, getWASM: f } = await Promise.resolve().then(() => Ks);
        return await f(), async (u) => await a(u);
      }
      case "brotli": {
        const { compress: a, getWASM: f } = await Promise.resolve().then(() => Us);
        return await f(), async (u) => await a(u, u.length, s);
      }
      default: {
        if (s === Kt.quality && "CompressionStream" in globalThis)
          return async (u) => {
            const g = new CompressionStream("gzip"), m = new Blob([u]).stream().pipeThrough(g);
            return new Uint8Array(await new Response(m).arrayBuffer());
          };
        const { gzip: a, getWASM: f } = await Promise.resolve().then(() => Ys);
        return await f(), async (u) => await a(u, s);
      }
    }
  })(), c = await Promise.all(
    r.map((a) => o(a))
  ), l = ot(
    c.reduce((a, { length: f }) => a + f, 0)
  );
  return {
    type: n,
    content: c,
    totalByteLength: i,
    totalCompressedSize: l,
    initialSize: `${i}`,
    size: `${l} (${n})`
  };
}
function Ke(e, t) {
  return e == "transform" ? oe({}, js, t) : e == "compress" ? oe({}, Kt, typeof t == "string" ? { type: t } : t) : oe({}, xs, t);
}
const js = {
  esbuild: {
    target: ["esnext"],
    format: "esm",
    minify: !0,
    treeShaking: !0,
    platform: "browser"
  },
  init: {
    platform: de
  }
};
async function cr(e, t = {}) {
  V("initialized") || A.emit("init.loading");
  const n = Ke("transform", t), { platform: s, ...r } = n.init, { transform: i } = await ht(s, r), { define: o = {}, ...c } = n.esbuild ?? {};
  let l;
  try {
    try {
      const a = "p.env.NODE_ENV".replace("p.", "process.");
      l = await i(e, {
        define: {
          __NODE__: "false",
          [a]: '"production"',
          ...o
        },
        ...c
      });
    } catch (a) {
      if (a.errors) {
        const f = [...await he(a.errors, "error", !1)], u = [...await he(a.errors, "error")];
        A.emit("logger.error", f, u);
        const g = (u.length > 1 ? `${u.length} error(s) ` : "") + "(if you are having trouble solving this issue, please create a new issue in the repo, https://github.com/okikio/bundle)";
        A.emit("logger.error", g);
        return;
      } else
        throw a;
    }
    return l;
  } catch {
  }
}
let Oe;
const Je = async () => {
  if (Oe)
    return Oe;
  const e = await import("./brotli-37c37be2.mjs"), { default: t, source: n } = e;
  return await t(await n()), Oe = e;
};
async function Fs(e, t = 4096, n = 6, s = 22) {
  const { compress: r } = await Je();
  return r(e, t, n, s);
}
async function Ms(e, t = 4096) {
  const { decompress: n } = await Je();
  return n(e, t);
}
const Us = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  compress: Fs,
  decompress: Ms,
  getWASM: Je
}, Symbol.toStringTag, { value: "Module" }));
let Jt, ke;
const D = async (e) => {
  if (ke)
    return ke;
  const t = await import("./denoflate-4370bf01.mjs"), { default: n } = t, { wasm: s } = await import("./gzip-53ef8b8e.mjs");
  return Jt = await n(e ?? await s()), ke = t;
};
async function zs(e, t) {
  return (await D()).deflate(e, t);
}
async function Bs(e) {
  return (await D()).inflate(e);
}
async function Gs(e, t) {
  return (await D()).gzip(e, t);
}
async function Hs(e) {
  return (await D()).gunzip(e);
}
async function Ws(e, t) {
  return (await D()).zlib(e, t);
}
async function Xs(e) {
  return (await D()).unzlib(e);
}
const qs = Jt, Ys = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: qs,
  deflate: zs,
  getWASM: D,
  gunzip: Hs,
  gzip: Gs,
  inflate: Bs,
  unzlib: Xs,
  zlib: Ws
}, Symbol.toStringTag, { value: "Module" }));
let Ne;
const Qe = async () => {
  if (Ne)
    return Ne;
  const e = await import("./lz4-bf5a09dd.mjs"), { default: t, source: n } = e;
  return await t(await n()), Ne = e;
};
async function Vs(e) {
  const { lz4_compress: t } = await Qe();
  return t(e);
}
async function Zs(e) {
  const { lz4_decompress: t } = await Qe();
  return t(e);
}
const Ks = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  compress: Vs,
  decompress: Zs,
  getWASM: Qe
}, Symbol.toStringTag, { value: "Module" }));
function Js(e) {
  if (typeof e == "string")
    return btoa(e);
  {
    const t = new Uint8Array(e);
    let n = "";
    for (let s = 0; s < t.length; ++s)
      n += String.fromCharCode(t[s]);
    return btoa(n);
  }
}
function Qs(e) {
  const t = Qt(e), n = new Uint8Array(t.length);
  for (let s = 0; s < n.length; ++s)
    n[s] = t.charCodeAt(s);
  return n.buffer;
}
function Qt(e) {
  return atob(e);
}
const ur = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  decode: Qs,
  decodeString: Qt,
  encode: Js
}, Symbol.toStringTag, { value: "Module" }));
export {
  Is as ALIAS,
  ct as ALIAS_NAMESPACE,
  Te as ALIAS_RESOLVE,
  Mn as AnsiBuffer,
  us as BIBIT_UNITS,
  ls as BIBYTE_UNITS,
  cs as BIT_UNITS,
  xs as BUILD_CONFIG,
  as as BYTE_UNITS,
  _t as CACHE,
  Hn as CACHE_NAME,
  Ps as CDN,
  lt as CDN_NAMESPACE,
  ze as CDN_RESOLVE,
  Kt as COMPRESS_CONFIG,
  B as DEFAULT_CDN_HOST,
  Ts as DeprecatedAPIs,
  Rs as EMPTY_EXPORT,
  pr as ESBUILD_SOURCE_WASM,
  st as ESCAPE_TO_COLOR,
  A as EVENTS,
  sn as EVENTS_OPTS,
  Ns as EXTERNAL,
  q as EXTERNALS_NAMESPACE,
  Os as ExternalPackages,
  Ls as HTTP,
  P as HTTP_NAMESPACE,
  Vt as HTTP_RESOLVE,
  Se as OPEN_CACHE,
  de as PLATFORM_AUTO,
  _s as PolyfillKeys,
  vs as PolyfillMap,
  jn as RESOLVE_EXTENSIONS,
  os as RE_NON_SCOPED,
  is as RE_SCOPED,
  js as TRANSFORM_CONFIG,
  Ds as TheFileSystem,
  _e as VIRTUAL_FILESYSTEM_NAMESPACE,
  bs as VIRTUAL_FS,
  Un as ansi,
  _ as bail,
  ur as base64,
  Us as brotli,
  ar as build,
  ot as bytes,
  lr as compress,
  Ke as createConfig,
  ae as createDefaultFileSystem,
  he as createNotice,
  Vn as createOPFSFileSystem,
  rn as createState,
  tr as debounce,
  Le as decode,
  oe as deepAssign,
  Gn as deepDiff,
  vt as deepEqual,
  nr as deleteFile,
  Ys as denoflate,
  me as encode,
  Cs as fetchAssets,
  Yt as fetchPkg,
  ot as formatBytes,
  As as getCDNOrigin,
  qt as getCDNStyle,
  T as getCDNUrl,
  on as getEsbuild,
  Xn as getFile,
  ws as getPackage,
  ys as getPackageOfVersion,
  $s as getPackageVersions,
  ir as getPackages,
  Ss as getPureImportPath,
  ne as getRegistryURL,
  J as getRequest,
  or as getResolvedPackage,
  we as getResolvedPath,
  V as getState,
  Fn as htmlEscape,
  Rt as inferLoader,
  ht as init,
  Zt as isAlias,
  ks as isExternal,
  x as isObject,
  zn as isPrimitive,
  Tt as isValid,
  Bn as isValidKey,
  hs as legacy,
  k as loop,
  Ks as lz4,
  sr as lzstring,
  rt as newRequest,
  Wn as openCache,
  ye as parsePackageName,
  er as path,
  ot as prettyBytes,
  Un as render,
  fs as resolveExports,
  ps as resolveImports,
  Es as resolveVersion,
  rr as semver,
  Ot as setFile,
  Pe as setState,
  it as toLocaleString,
  qe as toName,
  cr as transform,
  Zn as useFileSystem
};
//# sourceMappingURL=index.mjs.map
