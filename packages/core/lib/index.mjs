import { source as ur } from "./esbuild-wasm-1ca7078c.mjs";
const ue = "Deno" in globalThis ? "deno" : "process" in globalThis ? "node" : "browser";
var ft = class {
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
}, scope: t = null, name: n = "event" }) => ({ callback: e, scope: t, name: n }), te = class extends ft {
  constructor(e = "event") {
    super(), this.name = e;
  }
}, nn = class extends ft {
  constructor() {
    super();
  }
  getEvent(e) {
    let t = this.get(e);
    return t instanceof te ? t : (this.set(e, new te(e)), this.get(e));
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
    return i || (r = t), Object.keys(e).forEach((l) => {
      s = i ? l : e[l], i && (r = e[l]), this.newListener(s, r, o);
    }, this), this;
  }
  removeListener(e, t, n) {
    let s = this.get(e);
    if (s instanceof te && t) {
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
    return i || (r = t), Object.keys(e).forEach((l) => {
      s = i ? l : e[l], i && (r = e[l]), typeof r == "function" ? this.removeListener(s, r, o) : this.remove(s);
    }, this), this;
  }
  once(e, t, n) {
    if (typeof e > "u" || e == null)
      return this;
    typeof e == "string" && (e = e.trim().split(/\s/g));
    let s = typeof e == "object" && !Array.isArray(e);
    return Object.keys(e).forEach((r) => {
      let i = s ? r : e[r], o = s ? e[r] : t, l = s ? t : n, c = (...a) => {
        o.apply(l, a), this.removeListener(i, c, l);
      };
      this.newListener(i, c, l);
    }, this), this;
  }
  emit(e, ...t) {
    return typeof e > "u" || e == null ? this : (typeof e == "string" && (e = e.trim().split(/\s/g)), e.forEach((n) => {
      let s = this.get(n);
      s instanceof te && s.forEach((r) => {
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
const ut = {
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
  return ut[e];
}
function Ne(e, t) {
  return ut[e] = t;
}
function rn(e) {
  let t = e;
  return [
    () => t,
    (n) => (typeof n == "object" && !Array.isArray(n) && n !== null ? Object.assign(t, n) : t = n ?? e, t)
  ];
}
const tt = "0.17.6";
async function on(e = ue) {
  try {
    switch (e) {
      case "node":
        return await import("esbuild");
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
      default:
        return await import("./esbuild-52355a24.mjs").then((t) => t.b);
    }
  } catch (t) {
    throw t;
  }
}
async function ht(e = ue, t = {}) {
  try {
    if (!V("initialized")) {
      Ne("initialized", !0), A.emit("init.start");
      const n = await on(e);
      if (Ne("esbuild", n), e !== "node" && e !== "deno")
        if ("wasmModule" in t)
          await n.initialize(t);
        else if ("wasmURL" in t)
          await n.initialize(t);
        else {
          const { default: s } = await import("./esbuild-wasm-1ca7078c.mjs");
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
  let r = "", i = 0, o = -1, l = 0, c;
  for (let a = 0, h = e.length; a <= h; ++a) {
    if (a < h)
      c = e.charCodeAt(a);
    else {
      if (s(c))
        break;
      c = E;
    }
    if (s(c)) {
      if (!(o === a - 1 || l === 1))
        if (o !== a - 1 && l === 2) {
          if (r.length < 2 || i !== 2 || r.charCodeAt(r.length - 1) !== Y || r.charCodeAt(r.length - 2) !== Y) {
            if (r.length > 2) {
              const f = r.lastIndexOf(n);
              f === -1 ? (r = "", i = 0) : (r = r.slice(0, f), i = r.length - 1 - r.lastIndexOf(n)), o = a, l = 0;
              continue;
            } else if (r.length === 2 || r.length === 1) {
              r = "", i = 0, o = a, l = 0;
              continue;
            }
          }
          t && (r.length > 0 ? r += `${n}..` : r = "..", i = 2);
        } else
          r.length > 0 ? r += n + e.slice(o + 1, a) : r = e.slice(o + 1, a), i = a - o - 1;
      o = a, l = 0;
    } else
      c === Y && l !== -1 ? ++l : l = -1;
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
const cn = "/", fn = ":";
function Pe(...e) {
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
function un(...e) {
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
  if (N(e), N(t), e === t || (e = Pe(e), t = Pe(t), e === t))
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
  const l = o - i, c = r < l ? r : l;
  let a = -1, h = 0;
  for (; h <= c; ++h) {
    if (h === c) {
      if (l > c) {
        if (t.charCodeAt(i + h) === E)
          return t.slice(i + h + 1);
        if (h === 0)
          return t.slice(i + h);
      } else
        r > c && (e.charCodeAt(n + h) === E ? a = h : h === 0 && (a = 0));
      break;
    }
    const g = e.charCodeAt(n + h), m = t.charCodeAt(i + h);
    if (g !== m)
      break;
    g === E && (a = h);
  }
  let f = "";
  for (h = n + a + 1; h <= s; ++h)
    (h === s || e.charCodeAt(h) === E) && (f.length === 0 ? f += ".." : f += "/..");
  return f.length > 0 ? f + t.slice(i + a) : (i += a, t.charCodeAt(i) === E && ++i, t.slice(i));
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
    let o = t.length - 1, l = -1;
    for (i = e.length - 1; i >= 0; --i) {
      const c = e.charCodeAt(i);
      if (c === E) {
        if (!r) {
          n = i + 1;
          break;
        }
      } else
        l === -1 && (r = !1, l = i + 1), o >= 0 && (c === t.charCodeAt(o) ? --o === -1 && (s = i) : (o = -1, s = l));
    }
    return n === s ? s = l : s === -1 && (s = e.length), e.slice(n, s);
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
    const l = e.charCodeAt(o);
    if (l === E) {
      if (!r) {
        n = o + 1;
        break;
      }
      continue;
    }
    s === -1 && (r = !1, s = o + 1), l === Y ? t === -1 ? t = o : i !== 1 && (i = 1) : t !== -1 && (i = -1);
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
  let r = -1, i = 0, o = -1, l = !0, c = e.length - 1, a = 0;
  for (; c >= s; --c) {
    const h = e.charCodeAt(c);
    if (h === E) {
      if (!l) {
        i = c + 1;
        break;
      }
      continue;
    }
    o === -1 && (l = !1, o = c + 1), h === Y ? r === -1 ? r = c : a !== 1 && (a = 1) : r !== -1 && (a = -1);
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
  delimiter: fn,
  dirname: dn,
  extname: mn,
  format: wn,
  fromFileUrl: $n,
  isAbsolute: $t,
  join: un,
  normalize: yt,
  parse: yn,
  relative: hn,
  resolve: Pe,
  sep: cn,
  toFileUrl: En,
  toNamespacedPath: pn
}, Symbol.toStringTag, { value: "Module" })), An = Be, { join: Sn, normalize: nt } = An, Ee = [
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
  const i = s == "windows" ? "(?:\\\\|/)+" : "/+", o = s == "windows" ? "(?:\\\\|/)*" : "/*", l = s == "windows" ? ["\\", "/"] : ["/"], c = s == "windows" ? "(?:[^\\\\/]*(?:\\\\|/|$)+)*" : "(?:[^/]*(?:/|$)+)*", a = s == "windows" ? "[^\\\\/]*" : "[^/]*", h = s == "windows" ? "`" : "\\";
  let f = e.length;
  for (; f > 1 && l.includes(e[f - 1]); f--)
    ;
  e = e.slice(0, f);
  let g = "";
  for (let m = 0; m < e.length; ) {
    let u = "";
    const p = [];
    let d = !1, D = !1, b = !1, w = m;
    for (; w < e.length && !l.includes(e[w]); w++) {
      if (D) {
        D = !1, u += (d ? bn : Ee).includes(e[w]) ? `\\${e[w]}` : e[w];
        continue;
      }
      if (e[w] == h) {
        D = !0;
        continue;
      }
      if (e[w] == "[")
        if (d) {
          if (e[w + 1] == ":") {
            let $ = w + 1, R = "";
            for (; e[$ + 1] != null && e[$ + 1] != ":"; )
              R += e[$ + 1], $++;
            if (e[$ + 1] == ":" && e[$ + 2] == "]") {
              w = $ + 2, R == "alnum" ? u += "\\dA-Za-z" : R == "alpha" ? u += "A-Za-z" : R == "ascii" ? u += "\0-" : R == "blank" ? u += "	 " : R == "cntrl" ? u += "\0-" : R == "digit" ? u += "\\d" : R == "graph" ? u += "!-~" : R == "lower" ? u += "a-z" : R == "print" ? u += " -~" : R == "punct" ? u += `!"#$%&'()*+,\\-./:;<=>?@[\\\\\\]^_‘{|}~` : R == "space" ? u += "\\s\v" : R == "upper" ? u += "A-Z" : R == "word" ? u += "\\w" : R == "xdigit" && (u += "\\dA-Fa-f");
              continue;
            }
          }
        } else {
          d = !0, u += "[", e[w + 1] == "!" ? (w++, u += "^") : e[w + 1] == "^" && (w++, u += "\\^");
          continue;
        }
      if (e[w] == "]" && d) {
        d = !1, u += "]";
        continue;
      }
      if (d) {
        e[w] == "\\" ? u += "\\\\" : u += e[w];
        continue;
      }
      if (e[w] == ")" && p.length > 0 && p[p.length - 1] != "BRACE") {
        u += ")";
        const $ = p.pop();
        $ == "!" ? u += a : $ != "@" && (u += $);
        continue;
      }
      if (e[w] == "|" && p.length > 0 && p[p.length - 1] != "BRACE") {
        u += "|";
        continue;
      }
      if (e[w] == "+" && t && e[w + 1] == "(") {
        w++, p.push("+"), u += "(?:";
        continue;
      }
      if (e[w] == "@" && t && e[w + 1] == "(") {
        w++, p.push("@"), u += "(?:";
        continue;
      }
      if (e[w] == "?") {
        t && e[w + 1] == "(" ? (w++, p.push("?"), u += "(?:") : u += ".";
        continue;
      }
      if (e[w] == "!" && t && e[w + 1] == "(") {
        w++, p.push("!"), u += "(?!";
        continue;
      }
      if (e[w] == "{") {
        p.push("BRACE"), u += "(?:";
        continue;
      }
      if (e[w] == "}" && p[p.length - 1] == "BRACE") {
        p.pop(), u += ")";
        continue;
      }
      if (e[w] == "," && p[p.length - 1] == "BRACE") {
        u += "|";
        continue;
      }
      if (e[w] == "*") {
        if (t && e[w + 1] == "(")
          w++, p.push("*"), u += "(?:";
        else {
          const $ = e[w - 1];
          let R = 1;
          for (; e[w + 1] == "*"; )
            w++, R++;
          const en = e[w + 1];
          n && R == 2 && [...l, void 0].includes($) && [...l, void 0].includes(en) ? (u += c, b = !0) : u += a;
        }
        continue;
      }
      u += Ee.includes(e[w]) ? `\\${e[w]}` : e[w];
    }
    if (p.length > 0 || d || D) {
      u = "";
      for (const $ of e.slice(m, w))
        u += Ee.includes($) ? `\\${$}` : $, b = !1;
    }
    for (g += u, b || (g += w < e.length ? i : o, b = !0); l.includes(e[w]); )
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
      const l = e.indexOf(o, r);
      l !== -1 && (r = l + 1);
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
function On(e, { extended: t = !0, globstar: n = !1 } = {}) {
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
const _n = Be, Tn = Be, {
  basename: At,
  delimiter: kn,
  dirname: Z,
  extname: Ge,
  format: Nn,
  fromFileUrl: Pn,
  isAbsolute: St,
  join: bt,
  normalize: Ln,
  parse: In,
  relative: Cn,
  resolve: I,
  sep: F,
  toFileUrl: xn,
  toNamespacedPath: Dn
} = _n, le = (e, ...t) => {
  const n = new URL(e);
  return n.pathname = wt(
    bt(n.pathname, ...t).replace(/%/g, "%25").replace(/\\/g, "%5C")
  ), n.toString();
}, he = (e) => /^(?!\.).*/.test(e) && !St(e), Js = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
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
  isBareImport: he,
  isGlob: vn,
  join: bt,
  joinGlobs: On,
  normalize: Ln,
  normalizeGlob: Et,
  parse: In,
  posix: Tn,
  relative: Cn,
  resolve: I,
  sep: F,
  toFileUrl: xn,
  toNamespacedPath: Dn,
  urlJoin: le
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
function Mn(e) {
  return e.replace(/\<br\>/g, `
`).replace(/\&/g, "&amp;").replace(/\"/g, "&quot;").replace(/\'/g, "&#39;").replace(/\</g, "&lt;").replace(/\>/g, "&gt;");
}
class Fn {
  result = "";
  _stack = [];
  _bold = !1;
  _underline = !1;
  _link = !1;
  text(t) {
    this.result += Mn(t);
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
  const n = new Fn();
  for (const s of e.matchAll(/\x1B\[([\d;]+)m/g)) {
    const r = s[1];
    n.text(e.slice(t, s.index)), t = s.index + s[0].length, r === "0" ? n.reset() : r === "1" ? n.bold() : r === "4" ? n.underline() : st[r] && n.color(st[r]);
  }
  return t < e.length && n.text(e.slice(t)), n.done();
}
const ce = async (e, t = "error", n = !0) => {
  const { formatMessages: s } = await import("./esbuild-52355a24.mjs").then((i) => i.b);
  return (await s(e, { color: n, kind: t })).map((i) => n ? Un(i.replace(/(\s+)(\d+)(\s+)\│/g, `
$1$2$3│`)) : i);
}, Qs = (e, t = 300, n) => {
  let s;
  return function(...r) {
    const i = this, o = () => {
      s = null, n || e.apply(i, r);
    }, l = n && !s;
    clearTimeout(s), s = setTimeout(o, t), l && e.apply(i, r);
  };
}, C = (e) => typeof e == "object" && e != null, zn = (e) => typeof e == "object" ? e === null : typeof e != "function", Bn = (e) => e !== "__proto__" && e !== "constructor" && e !== "prototype", vt = (e, t) => {
  if (e === t)
    return !0;
  if (C(e) && C(t)) {
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
      const l = Array.isArray(e[i]) && Array.isArray(o);
      if (e[i] == o)
        continue;
      if (l)
        if (!vt(e[i], o))
          s[i] = o;
        else
          continue;
      else if (C(e[i]) && C(o)) {
        const c = Gn(e[i], o);
        Object.keys(c).length && (s[i] = c);
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
function re(e, ...t) {
  let n = 0;
  for (zn(e) && (e = t[n++]), e || (e = {}); n < t.length; n++)
    if (C(t[n]))
      for (const s of Object.keys(t[n]))
        Bn(s) && (C(e[s]) && C(t[n][s]) ? e[s] = re(Array.isArray(e[s]) ? [] : {}, e[s], t[n][s]) : e[s] = t[n][s]);
  return e;
}
const pe = (e) => new TextEncoder().encode(e), Le = (e) => new TextDecoder().decode(e), Ot = /* @__PURE__ */ new Map(), Hn = "EXTERNAL_FETCHES", rt = async (e, t, n) => {
  const s = await fetch(t, n), r = s.clone();
  return "caches" in globalThis ? e.put(t, r) : Ot.set(t, r), s;
};
let Ae;
const Wn = async () => Ae || (Ae = await caches.open(Hn)), J = async (e, t = !1, n) => {
  const s = "Request" in globalThis ? new Request(e.toString()) : e.toString();
  let r, i, o;
  return "caches" in globalThis ? (i = await Wn(), o = await i.match(s)) : o = Ot.get(s), r = o, o ? t || rt(i, s, n) : r = await rt(i, s, n), r.clone();
};
function _t(e) {
  return e != null && !Number.isNaN(e);
}
function de(e, t) {
  let n = e;
  return t && e.startsWith(".") && (n = I(Z(t), e)), n;
}
async function Xn(e, t, n = "buffer", s) {
  const r = de(t, s);
  try {
    const i = await e.get(r);
    return i === void 0 ? void 0 : _t(i) ? n === "string" ? Le(i) : i : null;
  } catch (i) {
    throw new Error(`Error occurred while getting "${r}"`, { cause: i });
  }
}
async function Tt(e, t, n, s) {
  const r = de(t, s);
  try {
    _t(n) || await e.set(r, null, "folder"), await e.set(r, n instanceof Uint8Array ? n : pe(n), "file");
  } catch (i) {
    throw new Error(`Error occurred while writing to "${r}"`, { cause: i });
  }
}
async function er(e, t, n) {
  const s = de(t, n);
  try {
    return await e.get(s) === void 0 ? !1 : await e.delete(s);
  } catch (r) {
    throw new Error(`Error occurred while deleting "${s}"`, { cause: r });
  }
}
function Ie(e = /* @__PURE__ */ new Map()) {
  return {
    files: async () => e,
    get: async (n) => e.get(I(n)),
    async set(n, s) {
      const r = I(n), o = Z(r).split(F), l = o.length;
      let c = "/";
      for (let a = 0; a < l; a++)
        c += o[a], e.has(c) || e.set(c, null), c += "/";
      e.set(r, s);
    },
    async delete(n) {
      return e.delete(I(n));
    }
  };
}
async function qn(e, t) {
  if ("createSyncAccessHandle" in e) {
    const s = await e.createSyncAccessHandle(), r = t instanceof Uint8Array ? t : pe(t);
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
    const e = Ie(), t = await e.files(), n = await navigator.storage.getDirectory();
    return e.set(F, n), {
      async files() {
        return e;
      },
      async get(r) {
        const i = await e.get(r);
        return i.kind === "file" ? await Yn(i) : null;
      },
      async set(r, i, o) {
        const l = I(r), a = Z(l).split(F), h = a.length;
        let f = F, g = n;
        for (let u = 0; u < h; u++) {
          const p = a[u];
          f += p, t.has(f) || (g = await g.getDirectoryHandle(p, { create: !0 }), t.set(f, g)), f += F;
        }
        const m = await g.getFileHandle(At(l), { create: !0 });
        await qn(m, i), await e.set(l, m);
      },
      async delete(r) {
        const i = I(r), o = Z(i), l = await e.get(i);
        return await (await e.get(o)).removeEntry(l.name), await e.delete(i);
      }
    };
  } catch (e) {
    throw new Error("Cannot create OPFS Virtual File System.", { cause: e });
  }
}
async function Zn(e, t = "OPFS") {
  try {
    switch (t) {
      case "DEFAULT":
        return Ie();
      case "OPFS":
        return await Vn();
    }
  } catch (n) {
    e.emit("logger.warn", n);
  }
  return Ie();
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
  const t = ge(e, 6, (n) => He.charAt(n));
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
  return e == null ? "" : e == "" ? null : me(e.length, 32, (t) => Xe(He, e.charAt(t)));
}
function Qn(e) {
  return e == null ? "" : ge(e, 6, (t) => We.charAt(t));
}
function es(e) {
  return e == null ? "" : e == "" ? null : (e = e.replaceAll(" ", "+"), me(e.length, 32, (t) => Xe(We, e.charAt(t))));
}
function ts(e) {
  return ge(e, 16, String.fromCharCode);
}
function ns(e) {
  return e == null ? "" : e == "" ? null : me(e.length, 32768, (t) => e.charCodeAt(t));
}
function ge(e, t, n) {
  if (e == null)
    return "";
  const s = [], r = {}, i = {};
  let o, l, c, a = "", h = "", f = "", g = 2, m = 3, u = 2, p = 0, d = 0;
  for (l = 0; l < e.length; l += 1)
    if (a = e.charAt(l), Object.prototype.hasOwnProperty.call(r, a) || (r[a] = m++, i[a] = !0), f = h + a, Object.prototype.hasOwnProperty.call(r, f))
      h = f;
    else {
      if (Object.prototype.hasOwnProperty.call(i, h)) {
        if (h.charCodeAt(0) < 256) {
          for (o = 0; o < u; o++)
            p = p << 1, d == t - 1 ? (d = 0, s.push(n(p)), p = 0) : d++;
          for (c = h.charCodeAt(0), o = 0; o < 8; o++)
            p = p << 1 | c & 1, d == t - 1 ? (d = 0, s.push(n(p)), p = 0) : d++, c = c >> 1;
        } else {
          for (c = 1, o = 0; o < u; o++)
            p = p << 1 | c, d == t - 1 ? (d = 0, s.push(n(p)), p = 0) : d++, c = 0;
          for (c = h.charCodeAt(0), o = 0; o < 16; o++)
            p = p << 1 | c & 1, d == t - 1 ? (d = 0, s.push(n(p)), p = 0) : d++, c = c >> 1;
        }
        g--, g == 0 && (g = Math.pow(2, u), u++), delete i[h];
      } else
        for (c = r[h], o = 0; o < u; o++)
          p = p << 1 | c & 1, d == t - 1 ? (d = 0, s.push(n(p)), p = 0) : d++, c = c >> 1;
      g--, g == 0 && (g = Math.pow(2, u), u++), r[f] = m++, h = String(a);
    }
  if (h !== "") {
    if (Object.prototype.hasOwnProperty.call(i, h)) {
      if (h.charCodeAt(0) < 256) {
        for (o = 0; o < u; o++)
          p = p << 1, d == t - 1 ? (d = 0, s.push(n(p)), p = 0) : d++;
        for (c = h.charCodeAt(0), o = 0; o < 8; o++)
          p = p << 1 | c & 1, d == t - 1 ? (d = 0, s.push(n(p)), p = 0) : d++, c = c >> 1;
      } else {
        for (c = 1, o = 0; o < u; o++)
          p = p << 1 | c, d == t - 1 ? (d = 0, s.push(n(p)), p = 0) : d++, c = 0;
        for (c = h.charCodeAt(0), o = 0; o < 16; o++)
          p = p << 1 | c & 1, d == t - 1 ? (d = 0, s.push(n(p)), p = 0) : d++, c = c >> 1;
      }
      g--, g == 0 && (g = Math.pow(2, u), u++), delete i[h];
    } else
      for (c = r[h], o = 0; o < u; o++)
        p = p << 1 | c & 1, d == t - 1 ? (d = 0, s.push(n(p)), p = 0) : d++, c = c >> 1;
    g--, g == 0 && (g = Math.pow(2, u), u++);
  }
  for (c = 2, o = 0; o < u; o++)
    p = p << 1 | c & 1, d == t - 1 ? (d = 0, s.push(n(p)), p = 0) : d++, c = c >> 1;
  for (; ; )
    if (p = p << 1, d == t - 1) {
      s.push(n(p));
      break;
    } else
      d++;
  return s.join("");
}
function me(e, t, n) {
  const s = [];
  let r = 4, i = 4, o = 3, l = "";
  const c = [];
  let a, h, f, g, m, u, p;
  const d = { val: n(0), position: t, index: 1 };
  for (a = 0; a < 3; a += 1)
    s[a] = a;
  for (f = 0, m = Math.pow(2, 2), u = 1; u != m; )
    g = d.val & d.position, d.position >>= 1, d.position == 0 && (d.position = t, d.val = n(d.index++)), f |= (g > 0 ? 1 : 0) * u, u <<= 1;
  switch (f) {
    case 0:
      for (f = 0, m = Math.pow(2, 8), u = 1; u != m; )
        g = d.val & d.position, d.position >>= 1, d.position == 0 && (d.position = t, d.val = n(d.index++)), f |= (g > 0 ? 1 : 0) * u, u <<= 1;
      p = String.fromCharCode(f);
      break;
    case 1:
      for (f = 0, m = Math.pow(2, 16), u = 1; u != m; )
        g = d.val & d.position, d.position >>= 1, d.position == 0 && (d.position = t, d.val = n(d.index++)), f |= (g > 0 ? 1 : 0) * u, u <<= 1;
      p = String.fromCharCode(f);
      break;
    case 2:
      return "";
  }
  for (s[3] = p, h = p, c.push(p); ; ) {
    if (d.index > e)
      return "";
    for (f = 0, m = Math.pow(2, o), u = 1; u != m; )
      g = d.val & d.position, d.position >>= 1, d.position == 0 && (d.position = t, d.val = n(d.index++)), f |= (g > 0 ? 1 : 0) * u, u <<= 1;
    switch (p = f) {
      case 0:
        for (f = 0, m = Math.pow(2, 8), u = 1; u != m; )
          g = d.val & d.position, d.position >>= 1, d.position == 0 && (d.position = t, d.val = n(d.index++)), f |= (g > 0 ? 1 : 0) * u, u <<= 1;
        s[i++] = String.fromCharCode(f), p = i - 1, r--;
        break;
      case 1:
        for (f = 0, m = Math.pow(2, 16), u = 1; u != m; )
          g = d.val & d.position, d.position >>= 1, d.position == 0 && (d.position = t, d.val = n(d.index++)), f |= (g > 0 ? 1 : 0) * u, u <<= 1;
        s[i++] = String.fromCharCode(f), p = i - 1, r--;
        break;
      case 2:
        return c.join("");
    }
    if (r == 0 && (r = Math.pow(2, o), o++), s[p])
      l = s[p];
    else if (p === i && typeof h == "string")
      l = h + h.charAt(0);
    else
      return null;
    c.push(l), s[i++] = h + l.charAt(0), r--, h = l, r == 0 && (r = Math.pow(2, o), o++);
  }
}
const tr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  _compress: ge,
  _decompress: me,
  baseReverseDic: H,
  compress: ts,
  compressToBase64: Kn,
  compressToURL: Qn,
  decompress: ns,
  decompressFromBase64: Jn,
  decompressFromURL: es,
  getBaseValue: Xe,
  keyStrBase64: He,
  keyStrUriSafe: We
}, Symbol.toStringTag, { value: "Module" })), ss = /^(@[^\/]+\/[^@\/]+)(?:@([^\/]+))?(\/.*)?$/, rs = /^([^@\/]+)(?:@([^\/]+))?(\/.*)?$/;
function we(e) {
  const t = ss.exec(e) || rs.exec(e);
  if (!t)
    throw new Error(`[parse-package-name] invalid package name: ${e}`);
  return {
    name: t[1] || "",
    version: t[2] || "latest",
    path: t[3] || ""
  };
}
const is = [
  "B",
  "kB",
  "MB",
  "GB",
  "TB",
  "PB",
  "EB",
  "ZB",
  "YB"
], os = [
  "B",
  "kiB",
  "MiB",
  "GiB",
  "TiB",
  "PiB",
  "EiB",
  "ZiB",
  "YiB"
], as = [
  "b",
  "kbit",
  "Mbit",
  "Gbit",
  "Tbit",
  "Pbit",
  "Ebit",
  "Zbit",
  "Ybit"
], ls = [
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
  const n = t.bits ? t.binary ? ls : as : t.binary ? os : is;
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
  const l = it(Number(e), t.locale, i), c = n[o];
  return r + l + " " + c;
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
function O(e, t, n) {
  throw new Error(
    n ? `No known conditions for "${t}" entry in "${e}" package` : `Missing "${t}" export in "${e}" package`
  );
}
function qe(e, t) {
  return t === e ? "." : t[0] === "." ? t : t.replace(new RegExp("^" + e + "/"), "./");
}
function cs(e, t = ".", n = {}) {
  const { name: s, exports: r } = e;
  if (r) {
    const { browser: i, require: o, unsafe: l, conditions: c = [] } = n;
    let a = qe(s, t);
    if (a[0] !== "." && (a = "./" + a), typeof r == "string")
      return a === "." ? r : O(s, a);
    const h = /* @__PURE__ */ new Set(["default", ...c]);
    l || h.add(o ? "require" : "import"), l || h.add(i ? "browser" : "node");
    let f, g, m = !1;
    for (f in r) {
      m = f[0] !== ".";
      break;
    }
    if (m)
      return a === "." ? k(r, h) || O(s, a, 1) : O(s, a);
    if (g = r[a])
      return k(g, h) || O(s, a, 1);
    for (f in r) {
      if (g = f[f.length - 1], g === "/" && a.startsWith(f))
        return (g = k(r[f], h)) ? g + a.substring(f.length) : O(s, a, 1);
      if (g === "*" && a.startsWith(f.slice(0, -1)) && a.substring(f.length - 1).length > 0)
        return (g = k(r[f], h)) ? g.replace("*", a.substring(f.length - 1)) : O(s, a, 1);
    }
    return O(s, a);
  }
}
function fs(e, t = {}) {
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
function us(e, t = ".", n = {}) {
  const { name: s, imports: r } = e;
  if (r) {
    const { browser: i, require: o, unsafe: l, conditions: c = [] } = n, a = qe(s, t);
    if (typeof r == "string")
      return a === "#" ? r : O(s, a);
    const h = /* @__PURE__ */ new Set(["default", ...c]);
    l || h.add(o ? "require" : "import"), l || h.add(i ? "browser" : "node");
    let f, g, m = !1;
    for (f in r) {
      m = f[0] !== "#";
      break;
    }
    if (m)
      return a === "#" ? k(r, h) || O(s, a, 1) : O(s, a);
    if (g = r[a])
      return k(g, h) || O(s, a, 1);
    for (f in r) {
      if (g = f[f.length - 1], g === "/" && a.startsWith(f))
        return (g = k(r[f], h)) ? g + a.substring(f.length) : O(s, a, 1);
      if (g === "*" && a.startsWith(f.slice(0, -1)) && a.substring(f.length - 1).length > 0)
        return (g = k(r[f], h)) ? g.replace("*", a.substring(f.length - 1)) : O(s, a, 1);
    }
    return O(s, a);
  }
}
const hs = "2.0.0", Ce = 256, W = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
9007199254740991, ie = 16;
let kt = 0;
const y = (e, t) => ({ index: kt++, pattern: e, regex: new RegExp(e, t ? "g" : void 0) }), U = "0|[1-9]\\d*", z = "[0-9]+", Ye = "\\d*[a-zA-Z-][a-zA-Z0-9-]*", xe = `(?:${U}|${Ye})`, De = `(?:${z}|${Ye})`, je = "[0-9A-Za-z-]+", Nt = `(${U})\\.(${U})\\.(${U})`, Pt = `(${z})\\.(${z})\\.(${z})`, Q = `(?:\\+(${je}(?:\\.${je})*))`, Ve = `(?:-(${xe}(?:\\.${xe})*))`, Ze = `(?:-?(${De}(?:\\.${De})*))`, Se = `v?${Nt}${Ve}?${Q}?`, ne = `[v=\\s]*${Pt}${Ze}?${Q}?`, oe = `${U}|x|X|\\*`, ae = `${z}|x|X|\\*`, j = "((?:<|>)?=?)", L = `[v=\\s]*(${oe})(?:\\.(${oe})(?:\\.(${oe})(?:${Ve})?${Q}?)?)?`, M = `[v=\\s]*(${ae})(?:\\.(${ae})(?:\\.(${ae})(?:${Ze})?${Q}?)?)?`, at = `(^|[^\\d])(\\d{1,${ie}})(?:\\.(\\d{1,${ie}}))?(?:\\.(\\d{1,${ie}}))?(?:$|[^\\d])`, be = "(?:~>?)", Re = "(?:\\^)", S = {
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
  BUILD: y(Q),
  // ## Full Version String
  // A main version, followed optionally by a pre-release version and
  // build metadata.
  // Note that the only major, minor, patch, and pre-release sections of
  // the version string are capturing groups.  The build metadata is not a
  // capturing group, because it should not ever be used in version
  // comparison.
  FULLPLAIN: y(Se),
  FULL: y(`^${Se}$`),
  // like full, but allows v1.2.3 and =1.2.3, which people do sometimes.
  // also, 1.0.0alpha1 (prerelease without the hyphen) which is pretty
  // common in the npm registry.
  LOOSEPLAIN: y(ne),
  LOOSE: y(`^${ne}$`),
  GTLT: y(j),
  // Something like "2.*" or "1.2.x".
  // Note that "x.x" is a valid xRange identifer, meaning "any version"
  // Only the first item is strictly required.
  XRANGEIDENTIFIERLOOSE: y(ae),
  XRANGEIDENTIFIER: y(oe),
  XRANGEPLAIN: y(L),
  XRANGEPLAINLOOSE: y(M),
  XRANGE: y(`^${j}\\s*${L}$`),
  XRANGELOOSE: y(`^${j}\\s*${M}$`),
  // Coercion.
  // Extract anything that could conceivably be a part of a valid semver
  COERCE: y(at),
  COERCERTL: y(at, !0),
  // Tilde ranges.
  // Meaning is "reasonably at or greater than"
  LONETILDE: y("(?:~>?)"),
  TILDETRIM: y(`(\\s*)${be}\\s+`, !0),
  TILDE: y(`^${be}${L}$`),
  TILDELOOSE: y(`^${be}${M}$`),
  // Caret ranges.
  // Meaning is "at least and backwards compatible with"
  LONECARET: y("(?:\\^)"),
  CARETTRIM: y(`(\\s*)${Re}\\s+`, !0),
  CARET: y(`^${Re}${L}$`),
  CARETLOOSE: y(`^${Re}${M}$`),
  // A simple gt/lt/eq thing, or just "" to indicate "any version"
  COMPARATORLOOSE: y(`^${j}\\s*(${ne})$|^$`),
  COMPARATOR: y(`^${j}\\s*(${Se})$|^$`),
  // An expression to strip any whitespace between the gtlt and the thing
  // it modifies, so that `> 1.2.3` ==> `>1.2.3`
  COMPARATORTRIM: y(`(\\s*)${j}\\s*(${ne}|${L})`, !0),
  // Something like `1.2.3 - 1.2.4`
  // Note that these all use the loose form, because they'll be
  // checked against either the strict or loose comparator form
  // later.
  HYPHENRANGE: y(`^\\s*(${L})\\s+-\\s+(${L})\\s*$`),
  HYPHENRANGELOOSE: y(`^\\s*(${M})\\s+-\\s+(${M})\\s*$`),
  // Star ranges basically just allow anything at all.
  STAR: y("(<|>)?=?\\s*\\*"),
  // >=0.0.0 is like a star
  GTE0: y("^\\s*>=\\s*0\\.0\\.0\\s*$"),
  GTE0PRE: y("^\\s*>=\\s*0\\.0\\.0-0\\s*$")
}, ps = ["includePrerelease", "loose", "rtl"], ye = (e) => e ? typeof e != "object" ? { loose: !0 } : ps.filter((t) => e[t]).reduce((t, n) => (t[n] = !0, t), {}) : {}, Me = /^[0-9]+$/, X = (e, t) => {
  const n = Me.test(e), s = Me.test(t);
  let r = e, i = t;
  return n && s && (r = +e, i = +t), r === i ? 0 : n && !s ? -1 : s && !n ? 1 : r < i ? -1 : 1;
};
class T {
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
    if (n = ye(n), t instanceof T) {
      if (t.loose === !!n.loose && t.includePrerelease === !!n.includePrerelease)
        return t;
      t = t.version;
    } else if (typeof t != "string")
      throw new TypeError(`Invalid Version: ${t}`);
    if (t.length > Ce)
      throw new TypeError(
        `version is longer than ${Ce} characters`
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
    if (!(t instanceof T)) {
      if (typeof t == "string" && t === this.version)
        return 0;
      t = new T(t, this.options);
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
    return t instanceof T || (t = new T(t, this.options)), X(this.major, t.major) || X(this.minor, t.minor) || X(this.patch, t.patch);
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
    if (t instanceof T || (t = new T(t, this.options)), this.prerelease.length && !t.prerelease.length)
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
const fe = Symbol("SemVer ANY");
class $e {
  semver;
  operator;
  value;
  loose;
  options;
  constructor(t, n) {
    if (n = ye(n), t instanceof $e) {
      if (t.loose === !!n.loose)
        return t;
      t = t.value;
    }
    this.options = n, this.loose = !!n.loose, this.parse(t), this.semver === fe ? this.value = "" : this.value = this.operator + this.semver.version;
  }
  parse(t) {
    const n = this.options.loose ? S.COMPARATORLOOSE.regex : S.COMPARATOR.regex, s = t.match(n);
    if (!s)
      throw new TypeError(`Invalid comparator: ${t}`);
    this.operator = s[1] !== void 0 ? s[1] : "", this.operator === "=" && (this.operator = ""), s[2] ? this.semver = new T(s[2], this.options.loose) : this.semver = fe;
  }
  toString() {
    return this.value;
  }
}
const G = /* @__PURE__ */ new Map(), se = /* @__PURE__ */ new Map(), ds = 1e3, Lt = "$1^", It = "$1~", Ct = "$1$2$3", Fe = (e) => e.value === "<0.0.0-0", xt = (e) => e.value === "", Dt = (e, t) => (e = Ft(e, t), e = jt(e, t), e = zt(e, t), e = Gt(e), e), v = (e) => !e || e.toLowerCase() === "x" || e === "*", jt = (e, t) => e.trim().split(/\s+/).map((n) => Mt(n, t)).join(" "), Mt = (e, t) => {
  const n = t.loose ? S.TILDELOOSE.regex : S.TILDE.regex;
  return e.replace(n, (s, r, i, o, l) => {
    let c;
    return v(r) ? c = "" : v(i) ? c = `>=${r}.0.0 <${+r + 1}.0.0-0` : v(o) ? c = `>=${r}.${i}.0 <${r}.${+i + 1}.0-0` : l ? c = `>=${r}.${i}.${o}-${l} <${r}.${+i + 1}.0-0` : c = `>=${r}.${i}.${o} <${r}.${+i + 1}.0-0`, c;
  });
}, Ft = (e, t) => e.trim().split(/\s+/).map((n) => Ut(n, t)).join(" "), Ut = (e, t) => {
  const n = t.loose ? S.CARETLOOSE.regex : S.CARET.regex, s = t.includePrerelease ? "-0" : "";
  return e.replace(n, (r, i, o, l, c) => {
    let a;
    return v(i) ? a = "" : v(o) ? a = `>=${i}.0.0${s} <${+i + 1}.0.0-0` : v(l) ? i === "0" ? a = `>=${i}.${o}.0${s} <${i}.${+o + 1}.0-0` : a = `>=${i}.${o}.0${s} <${+i + 1}.0.0-0` : c ? i === "0" ? o === "0" ? a = `>=${i}.${o}.${l}-${c} <${i}.${o}.${+l + 1}-0` : a = `>=${i}.${o}.${l}-${c} <${i}.${+o + 1}.0-0` : a = `>=${i}.${o}.${l}-${c} <${+i + 1}.0.0-0` : i === "0" ? o === "0" ? a = `>=${i}.${o}.${l}${s} <${i}.${o}.${+l + 1}-0` : a = `>=${i}.${o}.${l}${s} <${i}.${+o + 1}.0-0` : a = `>=${i}.${o}.${l} <${+i + 1}.0.0-0`, a;
  });
}, zt = (e, t) => e.split(/\s+/).map((n) => Bt(n, t)).join(" "), Bt = (e, t) => {
  e = e.trim();
  const n = t.loose ? S.XRANGELOOSE.regex : S.XRANGE.regex;
  return e.replace(n, (s, r, i, o, l, c) => {
    const a = v(i), h = a || v(o), f = h || v(l), g = f;
    return r === "=" && g && (r = ""), c = t.includePrerelease ? "-0" : "", a ? r === ">" || r === "<" ? s = "<0.0.0-0" : s = "*" : r && g ? (h && (o = 0), l = 0, r === ">" ? (r = ">=", h ? (i = +i + 1, o = 0, l = 0) : (o = +o + 1, l = 0)) : r === "<=" && (r = "<", h ? i = +i + 1 : o = +o + 1), r === "<" && (c = "-0"), s = `${r + i}.${o}.${l}${c}`) : h ? s = `>=${i}.0.0${c} <${+i + 1}.0.0-0` : f && (s = `>=${i}.${o}.0${c} <${i}.${+o + 1}.0-0`), s;
  });
}, Gt = (e, t) => e.trim().replace(S.STAR.regex, ""), Ht = (e, t) => e.trim().replace(S[t.includePrerelease ? "GTE0PRE" : "GTE0"].regex, ""), Wt = (e) => (t, n, s, r, i, o, l, c, a, h, f, g, m) => (v(s) ? n = "" : v(r) ? n = `>=${s}.0.0${e ? "-0" : ""}` : v(i) ? n = `>=${s}.${r}.0${e ? "-0" : ""}` : o ? n = `>=${n}` : n = `>=${n}${e ? "-0" : ""}`, v(a) ? c = "" : v(h) ? c = `<${+a + 1}.0.0-0` : v(f) ? c = `<${a}.${+h + 1}.0-0` : g ? c = `<=${a}.${h}.${f}-${g}` : e ? c = `<${a}.${h}.${+f + 1}-0` : c = `<=${c}`, `${n} ${c}`.trim()), Xt = (e, t, n) => {
  for (let s = 0; s < e.length; s++)
    if (!e[s].test(t))
      return !1;
  if (t.prerelease.length && !n.includePrerelease) {
    for (let s = 0; s < e.length; s++)
      if (e[s].semver !== fe && e[s].semver.prerelease.length > 0) {
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
    if (n = ye(n), t instanceof K)
      return t.loose === !!n.loose && t.includePrerelease === !!n.includePrerelease ? t : new K(t.raw, n);
    if (this.options = n, this.loose = !!n.loose, this.includePrerelease = !!n.includePrerelease, this.raw = t, this.set = t.split("||").map((s) => this.parseRange(s.trim())).filter((s) => s.length), !this.set.length)
      throw new TypeError(`Invalid SemVer Range: ${t}`);
    if (this.set.length > 1) {
      const s = this.set[0];
      if (this.set = this.set.filter((r) => !Fe(r[0])), this.set.length === 0)
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
      return se.set(s, Date.now()), G.get(s);
    const r = this.options.loose, i = r ? S.HYPHENRANGELOOSE.regex : S.HYPHENRANGE.regex;
    t = t.replace(i, Wt(this.options.includePrerelease)), t = t.replace(S.COMPARATORTRIM.regex, Ct), t = t.replace(S.TILDETRIM.regex, It), t = t.replace(S.CARETTRIM.regex, Lt), t = t.split(/\s+/).join(" ");
    let o = t.split(" ").map((f) => Dt(f, this.options)).join(" ").split(/\s+/).map((f) => Ht(f, this.options));
    r && (o = o.filter((f) => !!f.match(S.COMPARATORLOOSE.regex)));
    const l = /* @__PURE__ */ new Map(), c = o.map((f) => new $e(f, this.options));
    for (const f of c) {
      if (Fe(f))
        return [f];
      l.set(f.value, f);
    }
    l.size > 1 && l.has("") && l.delete("");
    const a = [...l.values()], h = a;
    if (G.set(s, h), se.set(s, Date.now()), G.size >= ds) {
      const g = [...se.entries()].sort((m, u) => m[1] - u[1])[0][0];
      G.delete(g), se.delete(g);
    }
    return a;
  }
  // if ANY of the sets match ALL of its comparators, then pass
  test(t) {
    if (!t)
      return !1;
    if (typeof t == "string")
      try {
        t = new T(t, this.options);
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
    i.test(o) && (!s || r.compare(o) === -1) && (s = o, r = new T(s, n));
  }), s;
}
const nr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ANY: fe,
  Comparator: $e,
  MAX_LENGTH: Ce,
  MAX_SAFE_COMPONENT_LENGTH: ie,
  MAX_SAFE_INTEGER: W,
  get R() {
    return kt;
  },
  Range: K,
  SEMVER_SPEC_VERSION: hs,
  SemVer: T,
  caretTrimReplace: Lt,
  comparatorTrimReplace: Ct,
  compareIdentifiers: X,
  createToken: y,
  default: Ue,
  hyphenReplace: Wt,
  isAny: xt,
  isNullSet: Fe,
  isX: v,
  maxSatisfying: Ue,
  numeric: Me,
  parseComparator: Dt,
  parseOptions: ye,
  replaceCaret: Ut,
  replaceCarets: Ft,
  replaceGTE0: Ht,
  replaceStars: Gt,
  replaceTilde: Mt,
  replaceTildes: jt,
  replaceXRange: Bt,
  replaceXRanges: zt,
  testSet: Xt,
  tildeTrimReplace: It,
  tokens: S
}, Symbol.toStringTag, { value: "Module" })), ee = (e) => {
  const t = "https://registry.npmjs.com", { name: n, version: s, path: r } = we(e), i = `${t}/-/v1/search?text=${encodeURIComponent(n)}&popularity=0.5&size=30`, o = `${t}/${n}/${s}`, l = `${t}/${n}`;
  return { searchURL: i, packageURL: l, packageVersionURL: o, version: s, name: n, path: r };
}, sr = async (e) => {
  const { searchURL: t } = ee(e);
  let n;
  try {
    n = await (await J(t, !1)).json();
  } catch (r) {
    throw console.warn(r), r;
  }
  return { packages: n?.objects, info: n };
}, gs = async (e) => {
  const { packageURL: t } = ee(e);
  try {
    return await (await J(t, !1)).json();
  } catch (n) {
    throw console.warn(n), n;
  }
}, ms = async (e) => {
  const { packageVersionURL: t } = ee(e);
  try {
    return await (await J(t, !1)).json();
  } catch (n) {
    throw console.warn(n), n;
  }
}, ws = async (e) => {
  try {
    const t = await gs(e), n = Object.keys(t.versions), s = t["dist-tags"];
    return { versions: n, tags: s };
  } catch (t) {
    throw console.warn(t), t;
  }
}, ys = async (e) => {
  try {
    let { version: t } = ee(e);
    const n = await ws(e);
    if (n) {
      const { versions: s, tags: r } = n;
      return t in r && (t = r[t]), s.includes(t) ? t : Ue(s, t);
    }
  } catch (t) {
    throw console.warn(t), t;
  }
}, rr = async (e) => {
  try {
    const { name: t } = ee(e), n = await ys(e);
    return await ms(`${t}@${n}`);
  } catch (t) {
    throw console.warn(t), t;
  }
}, B = "https://unpkg.com", qt = (e) => /^(skypack|esm|esm\.sh|unpkg|jsdelivr|esm\.run)\:?/.test(e) || /^https?:\/\/(cdn\.skypack\.dev|cdn\.esm\.sh|cdn\.jsdelivr\.net\/npm|unpkg\.com)/.test(e) ? "npm" : /^(jsdelivr\.gh|github)\:?/.test(e) || /^https?:\/\/(cdn\.jsdelivr\.net\/gh|raw\.githubusercontent\.com)/.test(e) ? "github" : /^(deno)\:?/.test(e) || /^https?:\/\/(deno\.land\/x)/.test(e) ? "deno" : "other", $s = (e, t = B) => (/^skypack\:/.test(e) ? t = "https://cdn.skypack.dev" : /^(esm\.sh|esm)\:/.test(e) ? t = "https://cdn.esm.sh" : /^unpkg\:/.test(e) ? t = "https://unpkg.com" : /^(jsdelivr|esm\.run)\:/.test(e) ? t = "https://cdn.jsdelivr.net/npm" : /^(jsdelivr\.gh)\:/.test(e) ? t = "https://cdn.jsdelivr.net/gh" : /^(deno)\:/.test(e) ? t = "https://deno.land/x" : /^(github)\:/.test(e) && (t = "https://raw.githubusercontent.com"), /\/$/.test(t) ? t : `${t}/`), Es = (e) => e.replace(/^(skypack|esm|esm\.sh|unpkg|jsdelivr|jsdelivr\.gh|esm\.run|deno|github)\:/, "").replace(/^https?:\/\/(cdn\.skypack\.dev|cdn\.esm\.sh|cdn\.jsdelivr\.net\/npm|unpkg\.com|cdn\.jsdelivr\.net\/gh|raw\.githubusercontent\.com|deno\.land\/x)/, "").replace(/^\//, ""), _ = (e, t = B) => {
  const n = $s(e, t), s = Es(e), r = new URL(s, n);
  return { import: e, path: s, origin: n, cdn: t, url: r };
}, ve = "virtual-filesystem", As = (e, t, n) => {
  const [s] = t, r = s().filesystem;
  return {
    name: ve,
    setup(i) {
      i.onResolve({ filter: /.*/ }, (o) => ({
        path: o.path,
        pluginData: o.pluginData ?? {},
        namespace: ve
      })), i.onLoad({ filter: /.*/, namespace: ve }, async (o) => {
        const l = de(o.path, o?.pluginData?.importer);
        return {
          contents: await Xn(r, o.path, "buffer", o?.pluginData?.importer),
          pluginData: {
            importer: l
          },
          loader: Rt(l)
        };
      });
    }
  };
}, q = "external-globals", Ss = pe("export default {}"), bs = {
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
}, Rs = Object.keys(bs), vs = ["v8/tools/codemap", "v8/tools/consarray", "v8/tools/csvparser", "v8/tools/logreader", "v8/tools/profile_view", "v8/tools/profile", "v8/tools/SourceMap", "v8/tools/splaytree", "v8/tools/tickprocessor-driver", "v8/tools/tickprocessor", "node-inspect/lib/_inspect", "node-inspect/lib/internal/inspect_client ", "node-inspect/lib/internal/inspect_repl", "_linklist", "_stream_wrap"], Os = ["chokidar", "yargs", "fsevents", "worker_threads", "async_hooks", "diagnostics_channel", "http2", "inspector", "perf_hooks", "trace_events", "wasi", ...vs, ...Rs], _s = (e, t = []) => [...Os, ...t].find((n) => !!(n === e || e.startsWith(`${n}/`)));
function Ts(e, t, n) {
  const { external: s = [] } = n?.esbuild ?? {};
  return {
    name: q,
    setup(r) {
      r.onResolve({ filter: /.*/ }, (i) => {
        const o = i.path.replace(/^node\:/, ""), { path: l } = _(o);
        if (_s(l, s))
          return {
            path: l,
            namespace: q,
            external: !0
          };
      }), r.onLoad({ filter: /.*/, namespace: q }, (i) => ({
        pluginName: q,
        contents: Ss,
        warnings: [{
          text: `${i.path} is marked as an external module and will be ignored.`,
          details: `"${i.path}" is a built-in node module thus can't be bundled by https://bundlejs.com, sorry about that.`
        }]
      }));
    }
  };
}
const lt = "cdn-url", ze = (e = B, t) => async (n) => {
  if (he(n.path)) {
    const { path: s, origin: r } = _(n.path, e), i = qt(r) == "npm", o = we(s);
    let l = o.path, c = n.pluginData?.pkg ?? {};
    if (s[0] == "#") {
      const g = us({ ...c, exports: c.imports }, s, {
        require: n.kind === "require-call" || n.kind === "require-resolve"
      });
      if (typeof g == "string") {
        l = g.replace(/^\.?\/?/, "/"), l && l[0] !== "/" && (l = `/${l}`);
        const m = i ? "@" + c.version : "", { url: { href: u } } = _(`${c.name}${m}${l}`);
        return {
          namespace: P,
          path: u,
          pluginData: { pkg: c }
        };
      }
    }
    if (("dependencies" in c || "devDependencies" in c || "peerDependencies" in c) && !/\S+@\S+/.test(s)) {
      const {
        devDependencies: g = {},
        dependencies: m = {},
        peerDependencies: u = {}
      } = c, p = Object.assign({}, g, u, m);
      Object.keys(p).includes(s) && (o.version = p[s]);
    }
    if (i)
      try {
        const { url: g } = _(`${o.name}@${o.version}/package.json`, r);
        c = await J(g, !0).then((u) => u.json());
        const m = cs(c, l ? "." + l.replace(/^\.?\/?/, "/") : ".", {
          require: n.kind === "require-call" || n.kind === "require-resolve"
        }) || fs(c);
        typeof m == "string" && (l = m.replace(/^\.?\/?/, "/").replace(/\.js\.js$/, ".js")), l && l[0] !== "/" && (l = `/${l}`);
      } catch (g) {
        t.emit(
          "logger.warn",
          `You may want to change CDNs. The current CDN ${/unpkg\.com/.test(r) ? `path "${r}${s}" may not` : `"${r}" doesn't`} support package.json files.
There is a chance the CDN you're using doesn't support looking through the package.json of packages. bundlejs will switch to inaccurate guesses for package versions. For package.json support you may wish to use https://unpkg.com or other CDN's that support package.json.`
        ).emit("logger.warn", g);
      }
    const h = i ? "@" + o.version : "", { url: f } = _(`${o.name}${h}${l}`, r);
    return {
      namespace: P,
      path: f.toString(),
      pluginData: { pkg: c }
    };
  }
};
function ks(e, t, n) {
  const { origin: s } = /:/.test(n?.cdn) ? _(n?.cdn) : _(n?.cdn + ":");
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
      url: n.url || e,
      content: new Uint8Array(await n.arrayBuffer())
    };
  } catch (n) {
    throw new Error(`[getRequest] Failed at request (${e})
${n.toString()}`);
  }
}, Ns = async (e, t, n, s, r) => {
  const i = /new URL\(['"`](.*)['"`],(?:\s+)?import\.meta\.url(?:\s+)?\)/g, o = new URL("./", e).toString(), [l] = r, c = l().filesystem, a = Le(t), f = Array.from(a.matchAll(i)).map(async ([, g]) => {
    const { content: m, url: u } = await Yt(le(o, g), s);
    return await Tt(c, n + ":" + u, t), {
      path: g,
      contents: m,
      get text() {
        return Le(m);
      }
    };
  });
  return await Promise.allSettled(f);
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
      le(n.pluginData?.url ? n.pluginData?.url : e, "../", s)
    ).origin, l = qt(i) == "npm" ? i : e;
    return he(s) ? ze(l, t)(n) : {
      path: _(s, l).url.toString(),
      namespace: P,
      pluginData: { pkg: n.pluginData?.pkg }
    };
  }
  return {
    path: le(n.pluginData?.url, "../", s),
    namespace: P,
    pluginData: { pkg: n.pluginData?.pkg }
  };
};
function Ps(e, t, n) {
  const { origin: s } = /:/.test(n?.cdn) ? _(n?.cdn) : _(n?.cdn + ":"), [r, i] = t, o = r().assets ?? [], l = r().filesystem;
  return {
    name: P,
    setup(c) {
      c.onResolve({ filter: /^https?:\/\// }, (a) => ({
        path: a.path,
        namespace: P
      })), c.onResolve({ filter: /.*/, namespace: P }, Vt(s, e)), c.onLoad({ filter: /.*/, namespace: P }, async (a) => {
        const h = Ge(a.path), f = (b = "") => h.length > 0 ? a.path : a.path + b;
        let g, m;
        const u = h.length > 0 ? [""] : ["", ".ts", ".tsx", ".js", ".mjs", ".cjs"], p = u.length;
        let d;
        for (let b = 0; b < p; b++) {
          const w = u[b];
          try {
            ({ content: g, url: m } = await Yt(f(w), e));
            break;
          } catch ($) {
            if (b == 0 && (d = $), b >= p - 1)
              throw e.emit("logger.error", $.toString()), d;
          }
        }
        await Tt(l, a.namespace + ":" + a.path, g), console.log({
          url: m
        });
        const D = (await Ns(m, g, a.namespace, e, t)).filter((b) => b.status == "rejected" ? (e.emit("logger:warn", `Asset fetch failed.
` + b?.reason?.toString()), !1) : !0).map((b) => {
          if (b.status == "fulfilled")
            return b.value;
        });
        return i({ assets: o.concat(D) }), {
          contents: g,
          loader: Rt(m),
          pluginData: { url: m, pkg: a.pluginData?.pkg }
        };
      });
    }
  };
}
const ct = "alias-globals", Zt = (e, t = {}) => {
  if (!he(e))
    return !1;
  const n = Object.keys(t), s = e.replace(/^node\:/, ""), r = we(s);
  return n.find((i) => r.name === i);
}, Oe = (e = {}, t = B, n) => async (s) => {
  const r = s.path.replace(/^node\:/, ""), { path: i } = _(r);
  if (Zt(i, e)) {
    const o = we(i), l = e[o.name];
    return Vt(t, n)({
      ...s,
      path: l
    });
  }
}, Ls = (e, t, n) => {
  const { origin: s } = /:/.test(n?.cdn) ? _(n?.cdn) : _(n?.cdn + ":"), r = n.alias ?? {};
  return {
    name: ct,
    setup(i) {
      i.onResolve({ filter: /^node\:.*/ }, (o) => Zt(o.path, r) ? Oe(r, s, e)(o) : {
        path: o.path,
        namespace: q,
        external: !0
      }), i.onResolve({ filter: /.*/ }, Oe(r, s, e)), i.onResolve({ filter: /.*/, namespace: ct }, Oe(r, s, e));
    }
  };
}, Is = {
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
    platform: ue
  }
}, Cs = Zn(A);
async function ir(e = {}, t = Cs) {
  V("initialized") || A.emit("init.loading");
  const n = Ke("build", e), s = rn({
    filesystem: await t,
    assets: [],
    GLOBAL: [V, Ne]
  }), [r] = s, { platform: i, ...o } = n.init ?? {}, { build: l } = await ht(i, o), { define: c = {}, ...a } = n.esbuild ?? {};
  let h = [], f = [], g = null;
  try {
    try {
      const m = "p.env.NODE_ENV".replace("p.", "process.");
      g = await l({
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
          ...c
        },
        write: !1,
        outdir: "/",
        plugins: [
          Ls(A, s, n),
          Ts(A, s, n),
          Ps(A, s, n),
          ks(A, s, n),
          As(A, s, n)
        ],
        ...a
      });
    } catch (m) {
      if (m.errors) {
        const u = [...await ce(m.errors, "error", !1)], p = [...await ce(m.errors, "error")];
        A.emit("logger.error", u, p);
        const d = (p.length > 1 ? `${p.length} error(s) ` : "") + "(if you are having trouble solving this issue, please create a new issue in the repo, https://github.com/okikio/bundle)";
        A.emit("logger.error", d);
        return;
      } else
        throw m;
    }
    return h = await Promise.all(
      [...r().assets].concat(g?.outputFiles)
    ), f = await Promise.all(
      h?.map(({ path: m, text: u, contents: p }) => /\.map$/.test(m) ? null : (a?.logLevel == "verbose" && (/\.(wasm|png|jpeg|webp)$/.test(m) ? A.emit("logger.log", "Output File: " + m) : A.emit("logger.log", "Output File: " + m + `
` + u)), { path: m, text: u, contents: p }))?.filter((m) => ![void 0, null].includes(m))
    ), {
      /** 
       * The output and asset files without unnecessary croft, e.g. `.map` sourcemap files 
       */
      contents: f,
      /**
       * The output and asset files with `.map` sourcemap files 
       */
      outputs: h,
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
async function or(e = [], t = {}) {
  const { type: n, quality: s } = Ke("compress", t), r = e.map((a) => a instanceof Uint8Array ? a : pe(a)), i = ot(
    r.reduce((a, h) => a + h.byteLength, 0)
  ), o = await (async () => {
    switch (n) {
      case "lz4": {
        const { compress: a, getWASM: h } = await Promise.resolve().then(() => Vs);
        return await h(), async (f) => await a(f);
      }
      case "brotli": {
        const { compress: a, getWASM: h } = await Promise.resolve().then(() => Ms);
        return await h(), async (f) => await a(f, f.length, s);
      }
      default: {
        if (s === Kt.quality && "CompressionStream" in globalThis)
          return async (f) => {
            const g = new CompressionStream("gzip"), m = new Blob([f]).stream().pipeThrough(g);
            return new Uint8Array(await new Response(m).arrayBuffer());
          };
        const { gzip: a, getWASM: h } = await Promise.resolve().then(() => Xs);
        return await h(), async (f) => await a(f, s);
      }
    }
  })(), l = await Promise.all(
    r.map((a) => o(a))
  ), c = ot(
    l.reduce((a, { length: h }) => a + h, 0)
  );
  return {
    type: n,
    content: l,
    totalByteLength: i,
    totalCompressedSize: c,
    initialSize: `${i}`,
    size: `${c} (${n})`
  };
}
function Ke(e, t) {
  return e == "transform" ? re({}, xs, t) : e == "compress" ? re({}, Kt, typeof t == "string" ? { type: t } : t) : re({}, Is, t);
}
const xs = {
  esbuild: {
    target: ["esnext"],
    format: "esm",
    minify: !0,
    treeShaking: !0,
    platform: "browser"
  },
  init: {
    platform: ue
  }
};
async function ar(e, t = {}) {
  V("initialized") || A.emit("init.loading");
  const n = Ke("transform", t), { platform: s, ...r } = n.init, { transform: i } = await ht(s, r), { define: o = {}, ...l } = n.esbuild ?? {};
  let c;
  try {
    try {
      const a = "p.env.NODE_ENV".replace("p.", "process.");
      c = await i(e, {
        define: {
          __NODE__: "false",
          [a]: '"production"',
          ...o
        },
        ...l
      });
    } catch (a) {
      if (a.errors) {
        const h = [...await ce(a.errors, "error", !1)], f = [...await ce(a.errors, "error")];
        A.emit("logger.error", h, f);
        const g = (f.length > 1 ? `${f.length} error(s) ` : "") + "(if you are having trouble solving this issue, please create a new issue in the repo, https://github.com/okikio/bundle)";
        A.emit("logger.error", g);
        return;
      } else
        throw a;
    }
    return c;
  } catch {
  }
}
let _e;
const Je = async () => {
  if (_e)
    return _e;
  const e = await import("./brotli-bd306a1d.mjs"), { default: t, source: n } = e;
  return await t(await n()), _e = e;
};
async function Ds(e, t = 4096, n = 6, s = 22) {
  const { compress: r } = await Je();
  return r(e, t, n, s);
}
async function js(e, t = 4096) {
  const { decompress: n } = await Je();
  return n(e, t);
}
const Ms = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  compress: Ds,
  decompress: js,
  getWASM: Je
}, Symbol.toStringTag, { value: "Module" }));
let Jt, Te;
const x = async (e) => {
  if (Te)
    return Te;
  const t = await import("./denoflate-4370bf01.mjs"), { default: n } = t, { wasm: s } = await import("./gzip-53ef8b8e.mjs");
  return Jt = await n(e ?? await s()), Te = t;
};
async function Fs(e, t) {
  return (await x()).deflate(e, t);
}
async function Us(e) {
  return (await x()).inflate(e);
}
async function zs(e, t) {
  return (await x()).gzip(e, t);
}
async function Bs(e) {
  return (await x()).gunzip(e);
}
async function Gs(e, t) {
  return (await x()).zlib(e, t);
}
async function Hs(e) {
  return (await x()).unzlib(e);
}
const Ws = Jt, Xs = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Ws,
  deflate: Fs,
  getWASM: x,
  gunzip: Bs,
  gzip: zs,
  inflate: Us,
  unzlib: Hs,
  zlib: Gs
}, Symbol.toStringTag, { value: "Module" }));
let ke;
const Qe = async () => {
  if (ke)
    return ke;
  const e = await import("./lz4-bf5a09dd.mjs"), { default: t, source: n } = e;
  return await t(await n()), ke = e;
};
async function qs(e) {
  const { lz4_compress: t } = await Qe();
  return t(e);
}
async function Ys(e) {
  const { lz4_decompress: t } = await Qe();
  return t(e);
}
const Vs = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  compress: qs,
  decompress: Ys,
  getWASM: Qe
}, Symbol.toStringTag, { value: "Module" }));
function Zs(e) {
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
function Ks(e) {
  const t = Qt(e), n = new Uint8Array(t.length);
  for (let s = 0; s < n.length; ++s)
    n[s] = t.charCodeAt(s);
  return n.buffer;
}
function Qt(e) {
  return atob(e);
}
const lr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  decode: Ks,
  decodeString: Qt,
  encode: Zs
}, Symbol.toStringTag, { value: "Module" }));
export {
  Ls as ALIAS,
  ct as ALIAS_NAMESPACE,
  Oe as ALIAS_RESOLVE,
  Fn as AnsiBuffer,
  ls as BIBIT_UNITS,
  os as BIBYTE_UNITS,
  as as BIT_UNITS,
  Is as BUILD_CONFIG,
  is as BYTE_UNITS,
  Ot as CACHE,
  Hn as CACHE_NAME,
  ks as CDN,
  lt as CDN_NAMESPACE,
  ze as CDN_RESOLVE,
  Kt as COMPRESS_CONFIG,
  B as DEFAULT_CDN_HOST,
  vs as DeprecatedAPIs,
  Ss as EMPTY_EXPORT,
  ur as ESBUILD_SOURCE_WASM,
  st as ESCAPE_TO_COLOR,
  A as EVENTS,
  sn as EVENTS_OPTS,
  Ts as EXTERNAL,
  q as EXTERNALS_NAMESPACE,
  Os as ExternalPackages,
  Ps as HTTP,
  P as HTTP_NAMESPACE,
  Vt as HTTP_RESOLVE,
  Ae as OPEN_CACHE,
  ue as PLATFORM_AUTO,
  Rs as PolyfillKeys,
  bs as PolyfillMap,
  jn as RESOLVE_EXTENSIONS,
  rs as RE_NON_SCOPED,
  ss as RE_SCOPED,
  xs as TRANSFORM_CONFIG,
  Cs as TheFileSystem,
  ve as VIRTUAL_FILESYSTEM_NAMESPACE,
  As as VIRTUAL_FS,
  Un as ansi,
  O as bail,
  lr as base64,
  Ms as brotli,
  ir as build,
  ot as bytes,
  or as compress,
  Ke as createConfig,
  Ie as createDefaultFileSystem,
  ce as createNotice,
  Vn as createOPFSFileSystem,
  rn as createState,
  Qs as debounce,
  Le as decode,
  re as deepAssign,
  Gn as deepDiff,
  vt as deepEqual,
  er as deleteFile,
  Xs as denoflate,
  pe as encode,
  Ns as fetchAssets,
  Yt as fetchPkg,
  ot as formatBytes,
  $s as getCDNOrigin,
  qt as getCDNStyle,
  _ as getCDNUrl,
  on as getEsbuild,
  Xn as getFile,
  gs as getPackage,
  ms as getPackageOfVersion,
  ws as getPackageVersions,
  sr as getPackages,
  Es as getPureImportPath,
  ee as getRegistryURL,
  J as getRequest,
  rr as getResolvedPackage,
  de as getResolvedPath,
  V as getState,
  Mn as htmlEscape,
  Rt as inferLoader,
  ht as init,
  Zt as isAlias,
  _s as isExternal,
  C as isObject,
  zn as isPrimitive,
  _t as isValid,
  Bn as isValidKey,
  fs as legacy,
  k as loop,
  Vs as lz4,
  tr as lzstring,
  rt as newRequest,
  Wn as openCache,
  we as parsePackageName,
  Js as path,
  ot as prettyBytes,
  Un as render,
  cs as resolveExports,
  us as resolveImports,
  ys as resolveVersion,
  nr as semver,
  Tt as setFile,
  Ne as setState,
  it as toLocaleString,
  qe as toName,
  ar as transform,
  Zn as useFileSystem
};
//# sourceMappingURL=index.mjs.map
