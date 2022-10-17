import { source as rr } from "./esbuild-wasm-51520686.mjs";
const Je = "0.15.11", ce = "Deno" in globalThis ? "deno" : "process" in globalThis ? "node" : "browser";
var at = class {
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
}, Zt = (e, t, ...s) => {
  e.forEach((n) => {
    n[t](...s);
  });
}, Qe = ({ callback: e = () => {
}, scope: t = null, name: s = "event" }) => ({ callback: e, scope: t, name: s }), Q = class extends at {
  constructor(e = "event") {
    super(), this.name = e;
  }
}, Kt = class extends at {
  constructor() {
    super();
  }
  getEvent(e) {
    let t = this.get(e);
    return t instanceof Q ? t : (this.set(e, new Q(e)), this.get(e));
  }
  newListener(e, t, s) {
    let n = this.getEvent(e);
    return n.add(Qe({ name: e, callback: t, scope: s })), n;
  }
  on(e, t, s) {
    if (typeof e > "u" || e == null)
      return this;
    typeof e == "string" && (e = e.trim().split(/\s/g));
    let n, r, i = typeof e == "object" && !Array.isArray(e), o = i ? t : s;
    return i || (r = t), Object.keys(e).forEach((a) => {
      n = i ? a : e[a], i && (r = e[a]), this.newListener(n, r, o);
    }, this), this;
  }
  removeListener(e, t, s) {
    let n = this.get(e);
    if (n instanceof Q && t) {
      let r = Qe({ name: e, callback: t, scope: s });
      n.forEach((i, o) => {
        if (i.callback === r.callback && i.scope === r.scope)
          return n.remove(o);
      });
    }
    return n;
  }
  off(e, t, s) {
    if (typeof e > "u" || e == null)
      return this;
    typeof e == "string" && (e = e.trim().split(/\s/g));
    let n, r, i = typeof e == "object" && !Array.isArray(e), o = i ? t : s;
    return i || (r = t), Object.keys(e).forEach((a) => {
      n = i ? a : e[a], i && (r = e[a]), typeof r == "function" ? this.removeListener(n, r, o) : this.remove(n);
    }, this), this;
  }
  once(e, t, s) {
    if (typeof e > "u" || e == null)
      return this;
    typeof e == "string" && (e = e.trim().split(/\s/g));
    let n = typeof e == "object" && !Array.isArray(e);
    return Object.keys(e).forEach((r) => {
      let i = n ? r : e[r], o = n ? e[r] : t, a = n ? t : s, c = (...l) => {
        o.apply(a, l), this.removeListener(i, c, a);
      };
      this.newListener(i, c, a);
    }, this), this;
  }
  emit(e, ...t) {
    return typeof e > "u" || e == null ? this : (typeof e == "string" && (e = e.trim().split(/\s/g)), e.forEach((s) => {
      let n = this.get(s);
      n instanceof Q && n.forEach((r) => {
        let { callback: i, scope: o } = r;
        i.apply(o, t);
      });
    }, this), this);
  }
  clear() {
    return Zt(this, "clear"), super.clear(), this;
  }
};
const Jt = {
  "init.start": console.log,
  "init.complete": console.info,
  "init.error": console.error,
  "init.loading": console.warn,
  "logger.log": console.log,
  "logger.error": console.error,
  "logger.warn": console.warn,
  "logger.info": console.info
}, S = new Kt();
S.on(Jt);
const ct = {
  initialized: !1,
  assets: [],
  esbuild: null
};
function Y(e) {
  return ct[e];
}
function _e(e, t) {
  return ct[e] = t;
}
function Qt(e) {
  let t = e;
  return [
    () => t,
    (s) => (typeof s == "object" && !Array.isArray(s) && s !== null ? Object.assign(t, s) : t = s ?? e, t)
  ];
}
async function es(e = ce) {
  try {
    switch (e) {
      case "node":
        return await import("esbuild");
      case "deno":
        return await import(
          /* @vite-ignore */
          `https://deno.land/x/esbuild@v${Je}/mod.js`
        );
      case "deno-wasm":
        return await import(
          /* @vite-ignore */
          `https://deno.land/x/esbuild@v${Je}/wasm.js`
        );
      default:
        return await import("./esbuild-8a68ea5e.mjs").then((t) => t.b);
    }
  } catch (t) {
    throw t;
  }
}
async function ft(e = ce, t = {}) {
  try {
    if (!Y("initialized")) {
      _e("initialized", !0), S.emit("init.start");
      const s = await es(e);
      if (_e("esbuild", s), e !== "node" && e !== "deno")
        if ("wasmModule" in t)
          await s.initialize(t);
        else {
          const { default: n } = await import("./esbuild-wasm-51520686.mjs");
          await s.initialize({
            wasmModule: new WebAssembly.Module(await n()),
            ...t
          });
        }
      S.emit("init.complete");
    }
    return Y("esbuild");
  } catch (s) {
    S.emit("init.error", s), console.error(s);
  }
}
const q = 46, y = 47, ut = "/", ht = /\/+/;
function N(e) {
  if (typeof e != "string")
    throw new TypeError(
      `Path must be a string. Received ${JSON.stringify(e)}`
    );
}
function pt(e) {
  return e === y;
}
function dt(e, t, s, n) {
  let r = "", i = 0, o = -1, a = 0, c;
  for (let l = 0, u = e.length; l <= u; ++l) {
    if (l < u)
      c = e.charCodeAt(l);
    else {
      if (n(c))
        break;
      c = y;
    }
    if (n(c)) {
      if (!(o === l - 1 || a === 1))
        if (o !== l - 1 && a === 2) {
          if (r.length < 2 || i !== 2 || r.charCodeAt(r.length - 1) !== q || r.charCodeAt(r.length - 2) !== q) {
            if (r.length > 2) {
              const f = r.lastIndexOf(s);
              f === -1 ? (r = "", i = 0) : (r = r.slice(0, f), i = r.length - 1 - r.lastIndexOf(s)), o = l, a = 0;
              continue;
            } else if (r.length === 2 || r.length === 1) {
              r = "", i = 0, o = l, a = 0;
              continue;
            }
          }
          t && (r.length > 0 ? r += `${s}..` : r = "..", i = 2);
        } else
          r.length > 0 ? r += s + e.slice(o + 1, l) : r = e.slice(o + 1, l), i = l - o - 1;
      o = l, a = 0;
    } else
      c === q && a !== -1 ? ++a : a = -1;
  }
  return r;
}
function ts(e, t) {
  const s = t.dir || t.root, n = t.base || (t.name || "") + (t.ext || "");
  return s ? s === t.root ? s + n : s + e + n : n;
}
const ss = {
  "	": "%09",
  "\n": "%0A",
  "\v": "%0B",
  "\f": "%0C",
  "\r": "%0D",
  " ": "%20"
};
function gt(e) {
  return e.replaceAll(/[\s]/g, (t) => ss[t] ?? t);
}
const ns = "/", rs = ":";
function Oe(...e) {
  let t = "", s = !1;
  for (let n = e.length - 1; n >= -1 && !s; n--) {
    let r;
    if (n >= 0)
      r = e[n];
    else {
      const { Deno: i } = globalThis;
      if (typeof i?.cwd != "function")
        throw new TypeError("Resolved a relative path without a CWD.");
      r = i?.cwd?.() ?? "/";
    }
    N(r), r.length !== 0 && (t = `${r}/${t}`, s = r.charCodeAt(0) === y);
  }
  return t = dt(
    t,
    !s,
    "/",
    pt
  ), s ? t.length > 0 ? `/${t}` : "/" : t.length > 0 ? t : ".";
}
function mt(e) {
  if (N(e), e.length === 0)
    return ".";
  const t = e.charCodeAt(0) === y, s = e.charCodeAt(e.length - 1) === y;
  return e = dt(e, !t, "/", pt), e.length === 0 && !t && (e = "."), e.length > 0 && s && (e += "/"), t ? `/${e}` : e;
}
function wt(e) {
  return N(e), e.length > 0 && e.charCodeAt(0) === y;
}
function is(...e) {
  if (e.length === 0)
    return ".";
  let t;
  for (let s = 0, n = e.length; s < n; ++s) {
    const r = e[s];
    N(r), r.length > 0 && (t ? t += `/${r}` : t = r);
  }
  return t ? mt(t) : ".";
}
function os(e, t) {
  if (N(e), N(t), e === t || (e = Oe(e), t = Oe(t), e === t))
    return "";
  let s = 1;
  const n = e.length;
  for (; s < n && e.charCodeAt(s) === y; ++s)
    ;
  const r = n - s;
  let i = 1;
  const o = t.length;
  for (; i < o && t.charCodeAt(i) === y; ++i)
    ;
  const a = o - i, c = r < a ? r : a;
  let l = -1, u = 0;
  for (; u <= c; ++u) {
    if (u === c) {
      if (a > c) {
        if (t.charCodeAt(i + u) === y)
          return t.slice(i + u + 1);
        if (u === 0)
          return t.slice(i + u);
      } else
        r > c && (e.charCodeAt(s + u) === y ? l = u : u === 0 && (l = 0));
      break;
    }
    const g = e.charCodeAt(s + u), m = t.charCodeAt(i + u);
    if (g !== m)
      break;
    g === y && (l = u);
  }
  let f = "";
  for (u = s + l + 1; u <= n; ++u)
    (u === n || e.charCodeAt(u) === y) && (f.length === 0 ? f += ".." : f += "/..");
  return f.length > 0 ? f + t.slice(i + l) : (i += l, t.charCodeAt(i) === y && ++i, t.slice(i));
}
function ls(e) {
  return e;
}
function as(e) {
  if (N(e), e.length === 0)
    return ".";
  const t = e.charCodeAt(0) === y;
  let s = -1, n = !0;
  for (let r = e.length - 1; r >= 1; --r)
    if (e.charCodeAt(r) === y) {
      if (!n) {
        s = r;
        break;
      }
    } else
      n = !1;
  return s === -1 ? t ? "/" : "." : t && s === 1 ? "//" : e.slice(0, s);
}
function cs(e, t = "") {
  if (t !== void 0 && typeof t != "string")
    throw new TypeError('"ext" argument must be a string');
  N(e);
  let s = 0, n = -1, r = !0, i;
  if (t !== void 0 && t.length > 0 && t.length <= e.length) {
    if (t.length === e.length && t === e)
      return "";
    let o = t.length - 1, a = -1;
    for (i = e.length - 1; i >= 0; --i) {
      const c = e.charCodeAt(i);
      if (c === y) {
        if (!r) {
          s = i + 1;
          break;
        }
      } else
        a === -1 && (r = !1, a = i + 1), o >= 0 && (c === t.charCodeAt(o) ? --o === -1 && (n = i) : (o = -1, n = a));
    }
    return s === n ? n = a : n === -1 && (n = e.length), e.slice(s, n);
  } else {
    for (i = e.length - 1; i >= 0; --i)
      if (e.charCodeAt(i) === y) {
        if (!r) {
          s = i + 1;
          break;
        }
      } else
        n === -1 && (r = !1, n = i + 1);
    return n === -1 ? "" : e.slice(s, n);
  }
}
function fs(e) {
  N(e);
  let t = -1, s = 0, n = -1, r = !0, i = 0;
  for (let o = e.length - 1; o >= 0; --o) {
    const a = e.charCodeAt(o);
    if (a === y) {
      if (!r) {
        s = o + 1;
        break;
      }
      continue;
    }
    n === -1 && (r = !1, n = o + 1), a === q ? t === -1 ? t = o : i !== 1 && (i = 1) : t !== -1 && (i = -1);
  }
  return t === -1 || n === -1 || i === 0 || i === 1 && t === n - 1 && t === s + 1 ? "" : e.slice(t, n);
}
function us(e) {
  if (e === null || typeof e != "object")
    throw new TypeError(
      `The "pathObject" argument must be of type Object. Received type ${typeof e}`
    );
  return ts("/", e);
}
function hs(e) {
  N(e);
  const t = { root: "", dir: "", base: "", ext: "", name: "" };
  if (e.length === 0)
    return t;
  const s = e.charCodeAt(0) === y;
  let n;
  s ? (t.root = "/", n = 1) : n = 0;
  let r = -1, i = 0, o = -1, a = !0, c = e.length - 1, l = 0;
  for (; c >= n; --c) {
    const u = e.charCodeAt(c);
    if (u === y) {
      if (!a) {
        i = c + 1;
        break;
      }
      continue;
    }
    o === -1 && (a = !1, o = c + 1), u === q ? r === -1 ? r = c : l !== 1 && (l = 1) : r !== -1 && (l = -1);
  }
  return r === -1 || o === -1 || l === 0 || l === 1 && r === o - 1 && r === i + 1 ? o !== -1 && (i === 0 && s ? t.base = t.name = e.slice(1, o) : t.base = t.name = e.slice(i, o)) : (i === 0 && s ? (t.name = e.slice(1, r), t.base = e.slice(1, o)) : (t.name = e.slice(i, r), t.base = e.slice(i, o)), t.ext = e.slice(r, o)), i > 0 ? t.dir = e.slice(0, i - 1) : s && (t.dir = "/"), t;
}
function ps(e) {
  if (e = e instanceof URL ? e : new URL(e), e.protocol != "file:")
    throw new TypeError("Must be a file URL.");
  return decodeURIComponent(
    e.pathname.replace(/%(?![0-9A-Fa-f]{2})/g, "%25")
  );
}
function ds(e) {
  if (!wt(e))
    throw new TypeError("Must be an absolute path.");
  const t = new URL("file:///");
  return t.pathname = gt(
    e.replace(/%/g, "%25").replace(/\\/g, "%5C")
  ), t;
}
const je = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  sep: ns,
  delimiter: rs,
  resolve: Oe,
  normalize: mt,
  isAbsolute: wt,
  join: is,
  relative: os,
  toNamespacedPath: ls,
  dirname: as,
  basename: cs,
  extname: fs,
  format: us,
  parse: hs,
  fromFileUrl: ps,
  toFileUrl: ds
}, Symbol.toStringTag, { value: "Module" })), gs = je, { join: ms, normalize: et } = gs, me = [
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
], ws = ["-", "\\", "]"];
function $s(e, {
  extended: t = !0,
  globstar: s = !0,
  os: n = "linux",
  caseInsensitive: r = !1
} = {}) {
  if (e == "")
    return /(?!)/;
  const i = n == "windows" ? "(?:\\\\|/)+" : "/+", o = n == "windows" ? "(?:\\\\|/)*" : "/*", a = n == "windows" ? ["\\", "/"] : ["/"], c = n == "windows" ? "(?:[^\\\\/]*(?:\\\\|/|$)+)*" : "(?:[^/]*(?:/|$)+)*", l = n == "windows" ? "[^\\\\/]*" : "[^/]*", u = n == "windows" ? "`" : "\\";
  let f = e.length;
  for (; f > 1 && a.includes(e[f - 1]); f--)
    ;
  e = e.slice(0, f);
  let g = "";
  for (let m = 0; m < e.length; ) {
    let h = "";
    const d = [];
    let p = !1, x = !1, R = !1, w = m;
    for (; w < e.length && !a.includes(e[w]); w++) {
      if (x) {
        x = !1, h += (p ? ws : me).includes(e[w]) ? `\\${e[w]}` : e[w];
        continue;
      }
      if (e[w] == u) {
        x = !0;
        continue;
      }
      if (e[w] == "[")
        if (p) {
          if (e[w + 1] == ":") {
            let E = w + 1, b = "";
            for (; e[E + 1] != null && e[E + 1] != ":"; )
              b += e[E + 1], E++;
            if (e[E + 1] == ":" && e[E + 2] == "]") {
              w = E + 2, b == "alnum" ? h += "\\dA-Za-z" : b == "alpha" ? h += "A-Za-z" : b == "ascii" ? h += "\0-\x7F" : b == "blank" ? h += "	 " : b == "cntrl" ? h += "\0-\x7F" : b == "digit" ? h += "\\d" : b == "graph" ? h += "!-~" : b == "lower" ? h += "a-z" : b == "print" ? h += " -~" : b == "punct" ? h += `!"#$%&'()*+,\\-./:;<=>?@[\\\\\\]^_\u2018{|}~` : b == "space" ? h += "\\s\v" : b == "upper" ? h += "A-Z" : b == "word" ? h += "\\w" : b == "xdigit" && (h += "\\dA-Fa-f");
              continue;
            }
          }
        } else {
          p = !0, h += "[", e[w + 1] == "!" ? (w++, h += "^") : e[w + 1] == "^" && (w++, h += "\\^");
          continue;
        }
      if (e[w] == "]" && p) {
        p = !1, h += "]";
        continue;
      }
      if (p) {
        e[w] == "\\" ? h += "\\\\" : h += e[w];
        continue;
      }
      if (e[w] == ")" && d.length > 0 && d[d.length - 1] != "BRACE") {
        h += ")";
        const E = d.pop();
        E == "!" ? h += l : E != "@" && (h += E);
        continue;
      }
      if (e[w] == "|" && d.length > 0 && d[d.length - 1] != "BRACE") {
        h += "|";
        continue;
      }
      if (e[w] == "+" && t && e[w + 1] == "(") {
        w++, d.push("+"), h += "(?:";
        continue;
      }
      if (e[w] == "@" && t && e[w + 1] == "(") {
        w++, d.push("@"), h += "(?:";
        continue;
      }
      if (e[w] == "?") {
        t && e[w + 1] == "(" ? (w++, d.push("?"), h += "(?:") : h += ".";
        continue;
      }
      if (e[w] == "!" && t && e[w + 1] == "(") {
        w++, d.push("!"), h += "(?!";
        continue;
      }
      if (e[w] == "{") {
        d.push("BRACE"), h += "(?:";
        continue;
      }
      if (e[w] == "}" && d[d.length - 1] == "BRACE") {
        d.pop(), h += ")";
        continue;
      }
      if (e[w] == "," && d[d.length - 1] == "BRACE") {
        h += "|";
        continue;
      }
      if (e[w] == "*") {
        if (t && e[w + 1] == "(")
          w++, d.push("*"), h += "(?:";
        else {
          const E = e[w - 1];
          let b = 1;
          for (; e[w + 1] == "*"; )
            w++, b++;
          const Vt = e[w + 1];
          s && b == 2 && [...a, void 0].includes(E) && [...a, void 0].includes(Vt) ? (h += c, R = !0) : h += l;
        }
        continue;
      }
      h += me.includes(e[w]) ? `\\${e[w]}` : e[w];
    }
    if (d.length > 0 || p || x) {
      h = "";
      for (const E of e.slice(m, w))
        h += me.includes(E) ? `\\${E}` : E, R = !1;
    }
    for (g += h, R || (g += w < e.length ? i : o, R = !0); a.includes(e[w]); )
      w++;
    if (!(w > m))
      throw new Error("Assertion failure: i > j (potential infinite loop)");
    m = w;
  }
  return g = `^${g}$`, new RegExp(g, r ? "i" : "");
}
function Es(e) {
  const t = { "{": "}", "(": ")", "[": "]" }, s = /\\(.)|(^!|\*|\?|[\].+)]\?|\[[^\\\]]+\]|\{[^\\}]+\}|\(\?[:!=][^\\)]+\)|\([^|]+\|[^\\)]+\))/;
  if (e === "")
    return !1;
  let n;
  for (; n = s.exec(e); ) {
    if (n[2])
      return !0;
    let r = n.index + n[0].length;
    const i = n[1], o = i ? t[i] : null;
    if (i && o) {
      const a = e.indexOf(o, r);
      a !== -1 && (r = a + 1);
    }
    e = e.slice(r);
  }
  return !1;
}
function $t(e, { globstar: t = !1 } = {}) {
  if (e.match(/\0/g))
    throw new Error(`Glob contains invalid characters: "${e}"`);
  if (!t)
    return et(e);
  const s = ht.source, n = new RegExp(
    `(?<=(${s}|^)\\*\\*${s})\\.\\.(?=${s}|$)`,
    "g"
  );
  return et(e.replace(n, "\0")).replace(/\0/g, "..");
}
function ys(e, { extended: t = !0, globstar: s = !1 } = {}) {
  if (!s || e.length == 0)
    return ms(...e);
  if (e.length === 0)
    return ".";
  let n;
  for (const r of e) {
    const i = r;
    i.length > 0 && (n ? n += `${ut}${i}` : n = i);
  }
  return n ? $t(n, { extended: t, globstar: s }) : ".";
}
const As = je, Rs = je, {
  basename: bs,
  delimiter: Ss,
  dirname: Me,
  extname: ze,
  format: vs,
  fromFileUrl: _s,
  isAbsolute: Et,
  join: yt,
  normalize: Os,
  parse: Ts,
  relative: ks,
  resolve: Ue,
  sep: Ns,
  toFileUrl: Is,
  toNamespacedPath: Ls
} = As, oe = (e, ...t) => {
  const s = new URL(e);
  return s.pathname = gt(
    yt(s.pathname, ...t).replace(/%/g, "%25").replace(/\\/g, "%5C")
  ), s.toString();
}, fe = (e) => /^(?!\.).*/.test(e) && !Et(e), Hn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  urlJoin: oe,
  isBareImport: fe,
  SEP: ut,
  SEP_PATTERN: ht,
  globToRegExp: $s,
  isGlob: Es,
  normalizeGlob: $t,
  joinGlobs: ys,
  posix: Rs,
  basename: bs,
  delimiter: Ss,
  dirname: Me,
  extname: ze,
  format: vs,
  fromFileUrl: _s,
  isAbsolute: Et,
  join: yt,
  normalize: Os,
  parse: Ts,
  relative: ks,
  resolve: Ue,
  sep: Ns,
  toFileUrl: Is,
  toNamespacedPath: Ls
}, Symbol.toStringTag, { value: "Module" })), Cs = [".tsx", ".ts", ".jsx", ".js", ".css", ".json"], At = (e) => {
  const t = ze(e);
  return Cs.includes(t) ? (/\.js(x)?$/.test(t) ? t.replace(/^\.js/, ".ts") : t).slice(1) : t === ".mjs" || t === ".cjs" || t === ".mts" || t === ".cts" ? "ts" : t == ".scss" ? "css" : t == ".png" || t == ".jpeg" || t == ".ttf" ? "dataurl" : t == ".svg" || t == ".html" || t == ".txt" ? "text" : t == ".wasm" ? "file" : t.length ? "text" : "ts";
}, we = "virtual-filesystem", Ps = (e, t, s) => {
  const n = s.filesystem;
  return {
    name: we,
    setup(r) {
      r.onResolve({ filter: /.*/ }, (i) => ({
        path: i.path,
        pluginData: i.pluginData ?? {},
        namespace: we
      })), r.onLoad({ filter: /.*/, namespace: we }, async (i) => {
        let o = await n.resolve(i.path, i?.pluginData?.importer);
        return {
          contents: await n.get(i.path, "buffer", i?.pluginData?.importer),
          pluginData: {
            importer: o
          },
          loader: At(o)
        };
      });
    }
  };
}, Fe = (e) => new TextEncoder().encode(e), Te = (e) => new TextDecoder().decode(e), F = "https://unpkg.com", Rt = (e) => /^(skypack|esm|esm\.sh|unpkg|jsdelivr|esm\.run)\:?/.test(e) || /^https?:\/\/(cdn\.skypack\.dev|cdn\.esm\.sh|cdn\.jsdelivr\.net\/npm|unpkg\.com)/.test(e) ? "npm" : /^(jsdelivr\.gh|github)\:?/.test(e) || /^https?:\/\/(cdn\.jsdelivr\.net\/gh|raw\.githubusercontent\.com)/.test(e) ? "github" : /^(deno)\:?/.test(e) || /^https?:\/\/(deno\.land\/x)/.test(e) ? "deno" : "other", xs = (e, t = F) => (/^skypack\:/.test(e) ? t = "https://cdn.skypack.dev" : /^(esm\.sh|esm)\:/.test(e) ? t = "https://cdn.esm.sh" : /^unpkg\:/.test(e) ? t = "https://unpkg.com" : /^(jsdelivr|esm\.run)\:/.test(e) ? t = "https://cdn.jsdelivr.net/npm" : /^(jsdelivr\.gh)\:/.test(e) ? t = "https://cdn.jsdelivr.net/gh" : /^(deno)\:/.test(e) ? t = "https://deno.land/x" : /^(github)\:/.test(e) && (t = "https://raw.githubusercontent.com"), /\/$/.test(t) ? t : `${t}/`), Ds = (e) => e.replace(/^(skypack|esm|esm\.sh|unpkg|jsdelivr|jsdelivr\.gh|esm\.run|deno|github)\:/, "").replace(/^https?:\/\/(cdn\.skypack\.dev|cdn\.esm\.sh|cdn\.jsdelivr\.net\/npm|unpkg\.com|cdn\.jsdelivr\.net\/gh|raw\.githubusercontent\.com|deno\.land\/x)/, "").replace(/^\//, ""), O = (e, t = F) => {
  let s = xs(e, t), n = Ds(e), r = new URL(n, s);
  return { import: e, path: n, origin: s, cdn: t, url: r };
}, G = "external-globals", js = Fe("export default {}"), Ms = {
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
}, zs = Object.keys(Ms), Us = ["v8/tools/codemap", "v8/tools/consarray", "v8/tools/csvparser", "v8/tools/logreader", "v8/tools/profile_view", "v8/tools/profile", "v8/tools/SourceMap", "v8/tools/splaytree", "v8/tools/tickprocessor-driver", "v8/tools/tickprocessor", "node-inspect/lib/_inspect", "node-inspect/lib/internal/inspect_client ", "node-inspect/lib/internal/inspect_repl", "_linklist", "_stream_wrap"], Fs = ["chokidar", "yargs", "fsevents", "worker_threads", "async_hooks", "diagnostics_channel", "http2", "inspector", "perf_hooks", "trace_events", "wasi", ...Us, ...zs], Bs = (e, t = []) => [...Fs, ...t].find((s) => !!(s === e || e.startsWith(`${s}/`)));
function Gs(e, t, s) {
  const { external: n = [] } = s?.esbuild ?? {};
  return {
    name: G,
    setup(r) {
      r.onResolve({ filter: /.*/ }, (i) => {
        let o = i.path.replace(/^node\:/, ""), { path: a } = O(o);
        if (Bs(a, n))
          return {
            path: a,
            namespace: G,
            external: !0
          };
      }), r.onLoad({ filter: /.*/, namespace: G }, (i) => ({
        pluginName: G,
        contents: js,
        warnings: [{
          text: `${i.path} is marked as an external module and will be ignored.`,
          details: `"${i.path}" is a built-in node module thus can't be bundled by https://bundlejs.com, sorry about that.`
        }]
      }));
    }
  };
}
const Ws = /^(@[^\/]+\/[^@\/]+)(?:@([^\/]+))?(\/.*)?$/, Xs = /^([^@\/]+)(?:@([^\/]+))?(\/.*)?$/;
function ue(e) {
  const t = Ws.exec(e) || Xs.exec(e);
  if (!t)
    throw new Error(`[parse-package-name] invalid package name: ${e}`);
  return {
    name: t[1] || "",
    version: t[2] || "latest",
    path: t[3] || ""
  };
}
const bt = /* @__PURE__ */ new Map(), Hs = "EXTERNAL_FETCHES", tt = async (e, t, s) => {
  let n = await fetch(t, s), r = n.clone();
  return "caches" in globalThis ? e.put(t, r) : bt.set(t, r), n;
};
let $e;
const qs = async () => $e || ($e = await caches.open(Hs)), Z = async (e, t = !1, s) => {
  let n = "Request" in globalThis ? new Request(e.toString()) : e.toString(), r, i, o;
  return "caches" in globalThis ? (i = await qs(), o = await i.match(n)) : o = bt.get(n), r = o, o ? t || tt(i, n, s) : r = await tt(i, n, s), r.clone();
};
function k(e, t) {
  if (typeof e == "string")
    return e;
  if (e) {
    let s, n;
    if (Array.isArray(e)) {
      for (s = 0; s < e.length; s++)
        if (n = k(e[s], t))
          return n;
    } else
      for (s in e)
        if (t.has(s))
          return k(e[s], t);
  }
}
function _(e, t, s) {
  throw new Error(
    s ? `No known conditions for "${t}" entry in "${e}" package` : `Missing "${t}" export in "${e}" package`
  );
}
function Be(e, t) {
  return t === e ? "." : t[0] === "." ? t : t.replace(new RegExp("^" + e + "/"), "./");
}
function Ys(e, t = ".", s = {}) {
  let { name: n, exports: r } = e;
  if (r) {
    let { browser: i, require: o, unsafe: a, conditions: c = [] } = s, l = Be(n, t);
    if (l[0] !== "." && (l = "./" + l), typeof r == "string")
      return l === "." ? r : _(n, l);
    let u = /* @__PURE__ */ new Set(["default", ...c]);
    a || u.add(o ? "require" : "import"), a || u.add(i ? "browser" : "node");
    let f, g, m = !1;
    for (f in r) {
      m = f[0] !== ".";
      break;
    }
    if (m)
      return l === "." ? k(r, u) || _(n, l, 1) : _(n, l);
    if (g = r[l])
      return k(g, u) || _(n, l, 1);
    for (f in r) {
      if (g = f[f.length - 1], g === "/" && l.startsWith(f))
        return (g = k(r[f], u)) ? g + l.substring(f.length) : _(n, l, 1);
      if (g === "*" && l.startsWith(f.slice(0, -1)) && l.substring(f.length - 1).length > 0)
        return (g = k(r[f], u)) ? g.replace("*", l.substring(f.length - 1)) : _(n, l, 1);
    }
    return _(n, l);
  }
}
function Vs(e, t = {}) {
  let s = 0, n, r = t.browser, i = t.fields || ["module", "main"];
  for (r && !i.includes("browser") && i.unshift("browser"); s < i.length; s++)
    if (n = e[i[s]]) {
      if (typeof n != "string")
        if (typeof n == "object" && i[s] == "browser") {
          if (typeof r == "string" && (n = n[r = Be(e.name, r)], n == null))
            return r;
        } else
          continue;
      return typeof n == "string" ? "./" + n.replace(/^\.?\//, "") : n;
    }
}
function Zs(e, t = ".", s = {}) {
  let { name: n, imports: r } = e;
  if (r) {
    let { browser: i, require: o, unsafe: a, conditions: c = [] } = s, l = Be(n, t);
    if (typeof r == "string")
      return l === "#" ? r : _(n, l);
    let u = /* @__PURE__ */ new Set(["default", ...c]);
    a || u.add(o ? "require" : "import"), a || u.add(i ? "browser" : "node");
    let f, g, m = !1;
    for (f in r) {
      m = f[0] !== "#";
      break;
    }
    if (m)
      return l === "#" ? k(r, u) || _(n, l, 1) : _(n, l);
    if (g = r[l])
      return k(g, u) || _(n, l, 1);
    for (f in r) {
      if (g = f[f.length - 1], g === "/" && l.startsWith(f))
        return (g = k(r[f], u)) ? g + l.substring(f.length) : _(n, l, 1);
      if (g === "*" && l.startsWith(f.slice(0, -1)) && l.substring(f.length - 1).length > 0)
        return (g = k(r[f], u)) ? g.replace("*", l.substring(f.length - 1)) : _(n, l, 1);
    }
    return _(n, l);
  }
}
const st = "cdn-url", ke = (e = F, t) => async (s) => {
  if (fe(s.path)) {
    let { path: n, origin: r } = O(s.path, e), i = Rt(r) == "npm", o = ue(n), a = o.path, c = s.pluginData?.pkg ?? {};
    if (n[0] == "#") {
      let g = Zs({ ...c, exports: c.imports }, n, {
        require: s.kind === "require-call" || s.kind === "require-resolve"
      });
      if (typeof g == "string") {
        a = g.replace(/^\.?\/?/, "/"), a && a[0] !== "/" && (a = `/${a}`);
        let m = i ? "@" + c.version : "", { url: { href: h } } = O(`${c.name}${m}${a}`);
        return {
          namespace: I,
          path: h,
          pluginData: { pkg: c }
        };
      }
    }
    if (("dependencies" in c || "devDependencies" in c || "peerDependencies" in c) && !/\S+@\S+/.test(n)) {
      let {
        devDependencies: g = {},
        dependencies: m = {},
        peerDependencies: h = {}
      } = c, d = Object.assign({}, g, h, m);
      Object.keys(d).includes(n) && (o.version = d[n]);
    }
    if (i)
      try {
        let { url: g } = O(`${o.name}@${o.version}/package.json`, r);
        c = await Z(g, !0).then((h) => h.json());
        let m = Ys(c, a ? "." + a.replace(/^\.?\/?/, "/") : ".", {
          require: s.kind === "require-call" || s.kind === "require-resolve"
        }) || Vs(c);
        typeof m == "string" && (a = m.replace(/^\.?\/?/, "/").replace(/\.js\.js$/, ".js")), a && a[0] !== "/" && (a = `/${a}`);
      } catch (g) {
        t.emit(
          "logger.warn",
          `You may want to change CDNs. The current CDN ${/unpkg\.com/.test(r) ? `path "${r}${n}" may not` : `"${r}" doesn't`} support package.json files.
There is a chance the CDN you're using doesn't support looking through the package.json of packages. bundlejs will switch to inaccurate guesses for package versions. For package.json support you may wish to use https://unpkg.com or other CDN's that support package.json.`
        ).emit("logger.warn", g);
      }
    let u = i ? "@" + o.version : "", { url: f } = O(`${o.name}${u}${a}`, r);
    return {
      namespace: I,
      path: f.toString(),
      pluginData: { pkg: c }
    };
  }
};
function Ks(e, t, s) {
  let { origin: n } = /:/.test(s?.cdn) ? O(s?.cdn) : O(s?.cdn + ":");
  return s.filesystem, {
    name: st,
    setup(r) {
      r.onResolve({ filter: /.*/ }, ke(n, e)), r.onResolve({ filter: /.*/, namespace: st }, ke(n, e));
    }
  };
}
const I = "http-url", St = async (e, t) => {
  try {
    let s = await Z(e);
    if (!s.ok)
      throw new Error(`Couldn't load ${s.url} (${s.status} code)`);
    return t.emit("logger.info", `Fetch ${e}`), {
      url: s.url,
      content: new Uint8Array(await s.arrayBuffer())
    };
  } catch (s) {
    throw new Error(`[getRequest] Failed at request (${e})
${s.toString()}`);
  }
}, Js = async (e, t, s, n, r) => {
  const i = /new URL\(['"`](.*)['"`],(?:\s+)?import\.meta\.url(?:\s+)?\)/g, o = new URL("./", e).toString(), a = r.filesystem, c = Te(t), u = Array.from(c.matchAll(i)).map(async ([, f]) => {
    let { content: g, url: m } = await St(oe(o, f), n);
    return a.set(s + ":" + m, t), {
      path: f,
      contents: g,
      get text() {
        return Te(g);
      }
    };
  });
  return await Promise.allSettled(u);
}, vt = (e = F, t) => async (s) => {
  let n = s.path.replace(/\/$/, "/index");
  if (!n.startsWith(".")) {
    if (/^https?:\/\//.test(n))
      return {
        path: n,
        namespace: I,
        pluginData: { pkg: s.pluginData?.pkg }
      };
    let i = new URL(
      oe(s.pluginData?.url ? s.pluginData?.url : e, "../", n)
    ).origin, a = Rt(i) == "npm" ? i : e;
    return fe(n) ? ke(a, t)(s) : {
      path: O(n, a).url.toString(),
      namespace: I,
      pluginData: { pkg: s.pluginData?.pkg }
    };
  }
  return {
    path: oe(s.pluginData?.url, "../", n),
    namespace: I,
    pluginData: { pkg: s.pluginData?.pkg }
  };
};
function Qs(e, t, s) {
  let { origin: n } = /:/.test(s?.cdn) ? O(s?.cdn) : O(s?.cdn + ":");
  const r = s.filesystem, [i, o] = t, a = i().assets ?? [];
  return {
    name: I,
    setup(c) {
      c.onResolve({ filter: /^https?:\/\// }, (l) => ({
        path: l.path,
        namespace: I
      })), c.onResolve({ filter: /.*/, namespace: I }, vt(n, e)), c.onLoad({ filter: /.*/, namespace: I }, async (l) => {
        let u = ze(l.path), f = (R = "") => u.length > 0 ? l.path : l.path + R, g, m;
        const h = u.length > 0 ? [""] : ["", ".ts", ".tsx", ".js", ".mjs", ".cjs"], d = h.length;
        let p;
        for (let R = 0; R < d; R++) {
          const w = h[R];
          try {
            ({ content: g, url: m } = await St(f(w), e));
            break;
          } catch (E) {
            if (R == 0 && (p = E), R >= d - 1)
              throw e.emit("logger.error", E.toString()), p;
          }
        }
        await r.set(l.namespace + ":" + l.path, g);
        let x = (await Js(m, g, l.namespace, e, s)).filter((R) => R.status == "rejected" ? (e.emit("logger:warn", `Asset fetch failed.
` + R?.reason?.toString()), !1) : !0).map((R) => {
          if (R.status == "fulfilled")
            return R.value;
        });
        return o({ assets: a.concat(x) }), {
          contents: g,
          loader: At(m),
          pluginData: { url: m, pkg: l.pluginData?.pkg }
        };
      });
    }
  };
}
const nt = "alias-globals", _t = (e, t = {}) => {
  if (!fe(e))
    return !1;
  let s = Object.keys(t), n = e.replace(/^node\:/, ""), r = ue(n);
  return s.find((i) => r.name === i);
}, Ee = (e = {}, t = F, s) => async (n) => {
  let r = n.path.replace(/^node\:/, ""), { path: i } = O(r);
  if (_t(i, e)) {
    let o = ue(i), a = e[o.name];
    return vt(t, s)({
      ...n,
      path: a
    });
  }
}, en = (e, t, s) => {
  let { origin: n } = /:/.test(s?.cdn) ? O(s?.cdn) : O(s?.cdn + ":"), r = s.alias ?? {};
  return {
    name: nt,
    setup(i) {
      i.onResolve({ filter: /^node\:.*/ }, (o) => _t(o.path, r) ? Ee(r, n, e)(o) : {
        path: o.path,
        namespace: G,
        external: !0
      }), i.onResolve({ filter: /.*/ }, Ee(r, n, e)), i.onResolve({ filter: /.*/, namespace: nt }, Ee(r, n, e));
    }
  };
}, U = /* @__PURE__ */ new Map(), Ot = async (e, t) => {
  let s = e;
  if (t && e.startsWith(".") && (s = Ue(Me(t), e)), U.has(s))
    return s;
  throw `File "${s}" does not exist`;
}, tn = async (e, t = "buffer", s) => {
  let n = await Ot(e, s);
  if (U.has(n)) {
    let r = U.get(n);
    return t == "string" ? Te(r) : r;
  }
}, sn = async (e, t, s) => {
  let n = e;
  s && e.startsWith(".") && (n = Ue(Me(s), e));
  try {
    U.set(n, t instanceof Uint8Array ? t : Fe(t));
  } catch {
    throw `Error occurred while writing to "${n}"`;
  }
}, rt = {
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
function nn(e) {
  return e.replace(/\<br\>/g, `
`).replace(/\&/g, "&amp;").replace(/\"/g, "&quot;").replace(/\'/g, "&#39;").replace(/\</g, "&lt;").replace(/\>/g, "&gt;");
}
class rn {
  result = "";
  _stack = [];
  _bold = !1;
  _underline = !1;
  _link = !1;
  text(t) {
    this.result += nn(t);
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
    let s;
    for (; (s = this.last()) === "</span>"; )
      this._stack.pop(), this.result += s;
    this.result += `<span class="color-${t}">`, this._stack.push("</span>");
  }
  done() {
    return this.reset(), this.result;
  }
}
function on(e) {
  e = e.trimEnd();
  let t = 0;
  const s = new rn();
  for (let n of e.matchAll(/\x1B\[([\d;]+)m/g)) {
    const r = n[1];
    s.text(e.slice(t, n.index)), t = n.index + n[0].length, r === "0" ? s.reset() : r === "1" ? s.bold() : r === "4" ? s.underline() : rt[r] && s.color(rt[r]);
  }
  return t < e.length && s.text(e.slice(t)), s.done();
}
const le = async (e, t = "error", s = !0) => {
  const { formatMessages: n } = await import("./esbuild-8a68ea5e.mjs").then((i) => i.b);
  return (await n(e, { color: s, kind: t })).map((i) => s ? on(i.replace(/(\s+)(\d+)(\s+)\│/g, `
$1$2$3\u2502`)) : i);
}, ln = {
  entryPoints: ["/index.tsx"],
  cdn: F,
  esbuild: {
    color: !0,
    globalName: "BundledCode",
    logLevel: "info",
    sourcemap: !1,
    incremental: !1,
    target: ["esnext"],
    format: "esm",
    bundle: !0,
    minify: !0,
    treeShaking: !0,
    platform: "browser"
  },
  ascii: "ascii",
  filesystem: {
    files: U,
    get: tn,
    set: sn,
    resolve: Ot,
    clear: () => U.clear()
  },
  init: {
    platform: ce
  }
};
async function qn(e = {}) {
  Y("initialized") || S.emit("init.loading");
  const t = Ge("build", e), s = Qt({ assets: [], GLOBAL: [Y, _e] }), [n] = s, { platform: r, ...i } = t.init ?? {}, { build: o } = await ft(r, i), { define: a = {}, loader: c = {}, ...l } = t.esbuild ?? {};
  let u = [], f = [], g;
  try {
    try {
      const m = "p.env.NODE_ENV".replace("p.", "process.");
      g = await o({
        entryPoints: t?.entryPoints ?? [],
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
          ...a
        },
        write: !1,
        outdir: "/",
        plugins: [
          en(S, s, t),
          Gs(S, s, t),
          Qs(S, s, t),
          Ks(S, s, t),
          Ps(S, s, t)
        ],
        ...l
      });
    } catch (m) {
      if (m.errors) {
        const h = [...await le(m.errors, "error", !1)], d = [...await le(m.errors, "error")];
        S.emit("logger.error", h, d);
        const p = (d.length > 1 ? `${d.length} error(s) ` : "") + "(if you are having trouble solving this issue, please create a new issue in the repo, https://github.com/okikio/bundle)";
        S.emit("logger.error", p);
        return;
      } else
        throw m;
    }
    return u = await Promise.all(
      [...n().assets].concat(g?.outputFiles)
    ), f = await Promise.all(
      u?.map(({ path: m, text: h, contents: d }) => /\.map$/.test(m) ? null : (l?.logLevel == "verbose" && (/\.(wasm|png|jpeg|webp)$/.test(m) ? S.emit("logger.log", "Output File: " + m) : S.emit("logger.log", "Output File: " + m + `
` + h)), { path: m, text: h, contents: d }))?.filter((m) => ![void 0, null].includes(m))
    ), {
      contents: f,
      outputs: u,
      ...g
    };
  } catch {
  }
}
const an = [
  "B",
  "kB",
  "MB",
  "GB",
  "TB",
  "PB",
  "EB",
  "ZB",
  "YB"
], cn = [
  "B",
  "kiB",
  "MiB",
  "GiB",
  "TiB",
  "PiB",
  "EiB",
  "ZiB",
  "YiB"
], fn = [
  "b",
  "kbit",
  "Mbit",
  "Gbit",
  "Tbit",
  "Pbit",
  "Ebit",
  "Zbit",
  "Ybit"
], un = [
  "b",
  "kibit",
  "Mibit",
  "Gibit",
  "Tibit",
  "Pibit",
  "Eibit",
  "Zibit",
  "Yibit"
], it = (e, t, s) => {
  let n = e;
  return typeof t == "string" || Array.isArray(t) ? n = e.toLocaleString(t, s) : (t === !0 || s !== void 0) && (n = e.toLocaleString(void 0, s)), n;
};
function ot(e, t) {
  if (!Number.isFinite(e))
    throw new TypeError(`Expected a finite number, got ${typeof e}: ${e}`);
  t = {
    bits: !1,
    binary: !1,
    ...t
  };
  const s = t.bits ? t.binary ? un : fn : t.binary ? cn : an;
  if (t.signed && e === 0)
    return ` 0 ${s[0]}`;
  const n = e < 0, r = n ? "-" : t.signed ? "+" : "";
  n && (e = -e);
  let i;
  if (t.minimumFractionDigits !== void 0 && (i = { minimumFractionDigits: t.minimumFractionDigits }), t.maximumFractionDigits !== void 0 && (i = { maximumFractionDigits: t.maximumFractionDigits, ...i }), e < 1) {
    const l = it(e, t.locale, i);
    return r + l + " " + s[0];
  }
  const o = Math.min(Math.floor(t.binary ? Math.log(e) / Math.log(1024) : Math.log10(e) / 3), s.length - 1);
  e /= (t.binary ? 1024 : 1e3) ** o, i || (e = e.toPrecision(3));
  const a = it(Number(e), t.locale, i), c = s[o];
  return r + a + " " + c;
}
const hn = {
  type: "gzip",
  quality: 9
};
async function Yn(e = [], t = {}) {
  const { type: s, quality: n } = Ge("compress", t), r = e.map((l) => l instanceof Uint8Array ? l : Fe(l)), i = ot(
    r.reduce((l, u) => l + u.byteLength, 0)
  ), o = await (async () => {
    switch (s) {
      case "lz4": {
        const { compress: l, getWASM: u } = await Promise.resolve().then(() => Gn);
        return await u(), async (f) => await l(f);
      }
      case "brotli": {
        const { compress: l, getWASM: u } = await Promise.resolve().then(() => Ln);
        return await u(), async (f) => await l(f, f.length, n);
      }
      default: {
        const { gzip: l, getWASM: u } = await Promise.resolve().then(() => Un);
        return await u(), async (f) => await l(f, n);
      }
    }
  })(), a = await Promise.all(
    r.map((l) => o(l))
  ), c = ot(
    a.reduce((l, { length: u }) => l + u, 0)
  );
  return {
    type: s,
    content: a,
    totalByteLength: i,
    totalCompressedSize: c,
    initialSize: `${i}`,
    size: `${c} (${s})`
  };
}
const C = (e) => typeof e == "object" && e != null, pn = (e) => typeof e == "object" ? e === null : typeof e != "function", dn = (e) => e !== "__proto__" && e !== "constructor" && e !== "prototype", Tt = (e, t) => {
  if (e === t)
    return !0;
  if (C(e) && C(t)) {
    if (Object.keys(e).length !== Object.keys(t).length)
      return !1;
    for (var s in e)
      if (!Tt(e[s], t[s]))
        return !1;
    return !0;
  }
}, gn = (e, t) => {
  let s = Object.keys(t), n = {}, r = 0;
  for (; r < s.length; r++) {
    let i = s[r], o = t[i];
    if (i in e) {
      let a = Array.isArray(e[i]) && Array.isArray(o);
      if (e[i] == o)
        continue;
      if (a)
        if (!Tt(e[i], o))
          n[i] = o;
        else
          continue;
      else if (C(e[i]) && C(o)) {
        let c = gn(e[i], o);
        Object.keys(c).length && (n[i] = c);
      } else
        n[i] = o;
    } else
      n[i] = o;
  }
  return n;
};
/*!
 * Based on assign-deep <https://github.com/jonschlinkert/assign-deep>
 *
 * Copyright (c) 2017-present, Jon Schlinkert.
 * Released under the MIT License.
 */
function se(e, ...t) {
  let s = 0;
  for (pn(e) && (e = t[s++]), e || (e = {}); s < t.length; s++)
    if (C(t[s]))
      for (const n of Object.keys(t[s]))
        dn(n) && (C(e[n]) && C(t[s][n]) ? e[n] = se(Array.isArray(e[n]) ? [] : {}, e[n], t[s][n]) : e[n] = t[s][n]);
  return e;
}
function Ge(e, t) {
  return e == "transform" ? se({}, mn, t) : e == "compress" ? se({}, hn, typeof t == "string" ? { type: t } : t) : se({}, ln, t);
}
const mn = {
  esbuild: {
    target: ["esnext"],
    format: "esm",
    minify: !0,
    treeShaking: !0,
    platform: "browser"
  },
  init: {
    platform: ce
  }
};
async function Vn(e, t = {}) {
  Y("initialized") || S.emit("init.loading");
  const s = Ge("transform", t), { platform: n, ...r } = s.init, { transform: i } = await ft(n, r), { define: o = {}, ...a } = s.esbuild ?? {};
  let c;
  try {
    try {
      const l = "p.env.NODE_ENV".replace("p.", "process.");
      c = await i(e, {
        define: {
          __NODE__: "false",
          [l]: '"production"',
          ...o
        },
        ...a
      });
    } catch (l) {
      if (l.errors) {
        const u = [...await le(l.errors, "error", !1)], f = [...await le(l.errors, "error")];
        S.emit("logger.error", u, f);
        const g = (f.length > 1 ? `${f.length} error(s) ` : "") + "(if you are having trouble solving this issue, please create a new issue in the repo, https://github.com/okikio/bundle)";
        S.emit("logger.error", g);
        return;
      } else
        throw l;
    }
    return c;
  } catch {
  }
}
const Zn = (e, t = 300, s) => {
  let n;
  return function(...r) {
    let i = this, o = () => {
      n = null, s || e.apply(i, r);
    }, a = s && !n;
    clearTimeout(n), n = setTimeout(o, t), a && e.apply(i, r);
  };
}, We = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", Xe = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$", W = {};
function He(e, t) {
  if (!W[e]) {
    W[e] = {};
    for (let s = 0; s < e.length; s++)
      W[e][e.charAt(s)] = s;
  }
  return W[e][t];
}
function wn(e) {
  if (e == null)
    return "";
  const t = he(e, 6, (s) => We.charAt(s));
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
function $n(e) {
  return e == null ? "" : e == "" ? null : pe(e.length, 32, (t) => He(We, e.charAt(t)));
}
function En(e) {
  return e == null ? "" : he(e, 6, (t) => Xe.charAt(t));
}
function yn(e) {
  return e == null ? "" : e == "" ? null : (e = e.replaceAll(" ", "+"), pe(e.length, 32, (t) => He(Xe, e.charAt(t))));
}
function An(e) {
  return he(e, 16, String.fromCharCode);
}
function Rn(e) {
  return e == null ? "" : e == "" ? null : pe(e.length, 32768, (t) => e.charCodeAt(t));
}
function he(e, t, s) {
  if (e == null)
    return "";
  const n = [], r = {}, i = {};
  let o, a, c, l = "", u = "", f = "", g = 2, m = 3, h = 2, d = 0, p = 0;
  for (a = 0; a < e.length; a += 1)
    if (l = e.charAt(a), Object.prototype.hasOwnProperty.call(r, l) || (r[l] = m++, i[l] = !0), f = u + l, Object.prototype.hasOwnProperty.call(r, f))
      u = f;
    else {
      if (Object.prototype.hasOwnProperty.call(i, u)) {
        if (u.charCodeAt(0) < 256) {
          for (o = 0; o < h; o++)
            d = d << 1, p == t - 1 ? (p = 0, n.push(s(d)), d = 0) : p++;
          for (c = u.charCodeAt(0), o = 0; o < 8; o++)
            d = d << 1 | c & 1, p == t - 1 ? (p = 0, n.push(s(d)), d = 0) : p++, c = c >> 1;
        } else {
          for (c = 1, o = 0; o < h; o++)
            d = d << 1 | c, p == t - 1 ? (p = 0, n.push(s(d)), d = 0) : p++, c = 0;
          for (c = u.charCodeAt(0), o = 0; o < 16; o++)
            d = d << 1 | c & 1, p == t - 1 ? (p = 0, n.push(s(d)), d = 0) : p++, c = c >> 1;
        }
        g--, g == 0 && (g = Math.pow(2, h), h++), delete i[u];
      } else
        for (c = r[u], o = 0; o < h; o++)
          d = d << 1 | c & 1, p == t - 1 ? (p = 0, n.push(s(d)), d = 0) : p++, c = c >> 1;
      g--, g == 0 && (g = Math.pow(2, h), h++), r[f] = m++, u = String(l);
    }
  if (u !== "") {
    if (Object.prototype.hasOwnProperty.call(i, u)) {
      if (u.charCodeAt(0) < 256) {
        for (o = 0; o < h; o++)
          d = d << 1, p == t - 1 ? (p = 0, n.push(s(d)), d = 0) : p++;
        for (c = u.charCodeAt(0), o = 0; o < 8; o++)
          d = d << 1 | c & 1, p == t - 1 ? (p = 0, n.push(s(d)), d = 0) : p++, c = c >> 1;
      } else {
        for (c = 1, o = 0; o < h; o++)
          d = d << 1 | c, p == t - 1 ? (p = 0, n.push(s(d)), d = 0) : p++, c = 0;
        for (c = u.charCodeAt(0), o = 0; o < 16; o++)
          d = d << 1 | c & 1, p == t - 1 ? (p = 0, n.push(s(d)), d = 0) : p++, c = c >> 1;
      }
      g--, g == 0 && (g = Math.pow(2, h), h++), delete i[u];
    } else
      for (c = r[u], o = 0; o < h; o++)
        d = d << 1 | c & 1, p == t - 1 ? (p = 0, n.push(s(d)), d = 0) : p++, c = c >> 1;
    g--, g == 0 && (g = Math.pow(2, h), h++);
  }
  for (c = 2, o = 0; o < h; o++)
    d = d << 1 | c & 1, p == t - 1 ? (p = 0, n.push(s(d)), d = 0) : p++, c = c >> 1;
  for (; ; )
    if (d = d << 1, p == t - 1) {
      n.push(s(d));
      break;
    } else
      p++;
  return n.join("");
}
function pe(e, t, s) {
  let n = [], r = 4, i = 4, o = 3, a = "", c = [], l, u, f, g, m, h, d, p = { val: s(0), position: t, index: 1 };
  for (l = 0; l < 3; l += 1)
    n[l] = l;
  for (f = 0, m = Math.pow(2, 2), h = 1; h != m; )
    g = p.val & p.position, p.position >>= 1, p.position == 0 && (p.position = t, p.val = s(p.index++)), f |= (g > 0 ? 1 : 0) * h, h <<= 1;
  switch (f) {
    case 0:
      for (f = 0, m = Math.pow(2, 8), h = 1; h != m; )
        g = p.val & p.position, p.position >>= 1, p.position == 0 && (p.position = t, p.val = s(p.index++)), f |= (g > 0 ? 1 : 0) * h, h <<= 1;
      d = String.fromCharCode(f);
      break;
    case 1:
      for (f = 0, m = Math.pow(2, 16), h = 1; h != m; )
        g = p.val & p.position, p.position >>= 1, p.position == 0 && (p.position = t, p.val = s(p.index++)), f |= (g > 0 ? 1 : 0) * h, h <<= 1;
      d = String.fromCharCode(f);
      break;
    case 2:
      return "";
  }
  for (n[3] = d, u = d, c.push(d); ; ) {
    if (p.index > e)
      return "";
    for (f = 0, m = Math.pow(2, o), h = 1; h != m; )
      g = p.val & p.position, p.position >>= 1, p.position == 0 && (p.position = t, p.val = s(p.index++)), f |= (g > 0 ? 1 : 0) * h, h <<= 1;
    switch (d = f) {
      case 0:
        for (f = 0, m = Math.pow(2, 8), h = 1; h != m; )
          g = p.val & p.position, p.position >>= 1, p.position == 0 && (p.position = t, p.val = s(p.index++)), f |= (g > 0 ? 1 : 0) * h, h <<= 1;
        n[i++] = String.fromCharCode(f), d = i - 1, r--;
        break;
      case 1:
        for (f = 0, m = Math.pow(2, 16), h = 1; h != m; )
          g = p.val & p.position, p.position >>= 1, p.position == 0 && (p.position = t, p.val = s(p.index++)), f |= (g > 0 ? 1 : 0) * h, h <<= 1;
        n[i++] = String.fromCharCode(f), d = i - 1, r--;
        break;
      case 2:
        return c.join("");
    }
    if (r == 0 && (r = Math.pow(2, o), o++), n[d])
      a = n[d];
    else if (d === i && typeof u == "string")
      a = u + u.charAt(0);
    else
      return null;
    c.push(a), n[i++] = u + a.charAt(0), r--, u = a, r == 0 && (r = Math.pow(2, o), o++);
  }
}
const Kn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  keyStrBase64: We,
  keyStrUriSafe: Xe,
  baseReverseDic: W,
  getBaseValue: He,
  compressToBase64: wn,
  decompressFromBase64: $n,
  compressToURL: En,
  decompressFromURL: yn,
  compress: An,
  decompress: Rn,
  _compress: he,
  _decompress: pe
}, Symbol.toStringTag, { value: "Module" })), bn = "2.0.0", Ne = 256, X = Number.MAX_SAFE_INTEGER || 9007199254740991, ne = 16;
let kt = 0;
const $ = (e, t) => ({ index: kt++, pattern: e, regex: new RegExp(e, t ? "g" : void 0) }), M = "0|[1-9]\\d*", z = "[0-9]+", qe = "\\d*[a-zA-Z-][a-zA-Z0-9-]*", Ie = `(?:${M}|${qe})`, Le = `(?:${z}|${qe})`, Ce = "[0-9A-Za-z-]+", Nt = `(${M})\\.(${M})\\.(${M})`, It = `(${z})\\.(${z})\\.(${z})`, K = `(?:\\+(${Ce}(?:\\.${Ce})*))`, Ye = `(?:-(${Ie}(?:\\.${Ie})*))`, Ve = `(?:-?(${Le}(?:\\.${Le})*))`, ye = `v?${Nt}${Ye}?${K}?`, ee = `[v=\\s]*${It}${Ve}?${K}?`, re = `${M}|x|X|\\*`, ie = `${z}|x|X|\\*`, D = "((?:<|>)?=?)", L = `[v=\\s]*(${re})(?:\\.(${re})(?:\\.(${re})(?:${Ye})?${K}?)?)?`, j = `[v=\\s]*(${ie})(?:\\.(${ie})(?:\\.(${ie})(?:${Ve})?${K}?)?)?`, lt = `(^|[^\\d])(\\d{1,${ne}})(?:\\.(\\d{1,${ne}}))?(?:\\.(\\d{1,${ne}}))?(?:$|[^\\d])`, Ae = "(?:~>?)", Re = "(?:\\^)", A = {
  NUMERICIDENTIFIER: $(M),
  NUMERICIDENTIFIERLOOSE: $(z),
  NONNUMERICIDENTIFIER: $(qe),
  MAINVERSION: $(Nt),
  MAINVERSIONLOOSE: $(It),
  PRERELEASEIDENTIFIER: $(Ie),
  PRERELEASEIDENTIFIERLOOSE: $(Le),
  PRERELEASE: $(Ye),
  PRERELEASELOOSE: $(Ve),
  BUILDIDENTIFIER: $(Ce),
  BUILD: $(K),
  FULLPLAIN: $(ye),
  FULL: $(`^${ye}$`),
  LOOSEPLAIN: $(ee),
  LOOSE: $(`^${ee}$`),
  GTLT: $(D),
  XRANGEIDENTIFIERLOOSE: $(ie),
  XRANGEIDENTIFIER: $(re),
  XRANGEPLAIN: $(L),
  XRANGEPLAINLOOSE: $(j),
  XRANGE: $(`^${D}\\s*${L}$`),
  XRANGELOOSE: $(`^${D}\\s*${j}$`),
  COERCE: $(lt),
  COERCERTL: $(lt, !0),
  LONETILDE: $("(?:~>?)"),
  TILDETRIM: $(`(\\s*)${Ae}\\s+`, !0),
  TILDE: $(`^${Ae}${L}$`),
  TILDELOOSE: $(`^${Ae}${j}$`),
  LONECARET: $("(?:\\^)"),
  CARETTRIM: $(`(\\s*)${Re}\\s+`, !0),
  CARET: $(`^${Re}${L}$`),
  CARETLOOSE: $(`^${Re}${j}$`),
  COMPARATORLOOSE: $(`^${D}\\s*(${ee})$|^$`),
  COMPARATOR: $(`^${D}\\s*(${ye})$|^$`),
  COMPARATORTRIM: $(`(\\s*)${D}\\s*(${ee}|${L})`, !0),
  HYPHENRANGE: $(`^\\s*(${L})\\s+-\\s+(${L})\\s*$`),
  HYPHENRANGELOOSE: $(`^\\s*(${j})\\s+-\\s+(${j})\\s*$`),
  STAR: $("(<|>)?=?\\s*\\*"),
  GTE0: $("^\\s*>=\\s*0\\.0\\.0\\s*$"),
  GTE0PRE: $("^\\s*>=\\s*0\\.0\\.0-0\\s*$")
}, Sn = ["includePrerelease", "loose", "rtl"], de = (e) => e ? typeof e != "object" ? { loose: !0 } : Sn.filter((t) => e[t]).reduce((t, s) => (t[s] = !0, t), {}) : {}, Pe = /^[0-9]+$/, H = (e, t) => {
  const s = Pe.test(e), n = Pe.test(t);
  let r = e, i = t;
  return s && n && (r = +e, i = +t), r === i ? 0 : s && !n ? -1 : n && !s ? 1 : r < i ? -1 : 1;
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
  constructor(t, s) {
    if (s = de(s), t instanceof T) {
      if (t.loose === !!s.loose && t.includePrerelease === !!s.includePrerelease)
        return t;
      t = t.version;
    } else if (typeof t != "string")
      throw new TypeError(`Invalid Version: ${t}`);
    if (t.length > Ne)
      throw new TypeError(
        `version is longer than ${Ne} characters`
      );
    this.options = s, this.loose = !!s.loose, this.includePrerelease = !!s.includePrerelease;
    const n = t.trim().match(s.loose ? A.LOOSE.regex : A.FULL.regex);
    if (!n)
      throw new TypeError(`Invalid Version: ${t}`);
    if (this.raw = t, this.major = +n[1], this.minor = +n[2], this.patch = +n[3], this.major > X || this.major < 0)
      throw new TypeError("Invalid major version");
    if (this.minor > X || this.minor < 0)
      throw new TypeError("Invalid minor version");
    if (this.patch > X || this.patch < 0)
      throw new TypeError("Invalid patch version");
    n[4] ? this.prerelease = n[4].split(".").map((r) => {
      if (/^[0-9]+$/.test(r)) {
        const i = +r;
        if (i >= 0 && i < X)
          return i;
      }
      return r;
    }) : this.prerelease = [], this.build = n[5] ? n[5].split(".") : [], this.format();
  }
  format() {
    return this.version = `${this.major}.${this.minor}.${this.patch}`, this.prerelease.length && (this.version += `-${this.prerelease.join(".")}`), this.version;
  }
  toString() {
    return this.version;
  }
  compare(t) {
    if (!(t instanceof T)) {
      if (typeof t == "string" && t === this.version)
        return 0;
      t = new T(t, this.options);
    }
    return t.version === this.version ? 0 : this.compareMain(t) || this.comparePre(t);
  }
  compareMain(t) {
    return t instanceof T || (t = new T(t, this.options)), H(this.major, t.major) || H(this.minor, t.minor) || H(this.patch, t.patch);
  }
  comparePre(t) {
    if (t instanceof T || (t = new T(t, this.options)), this.prerelease.length && !t.prerelease.length)
      return -1;
    if (!this.prerelease.length && t.prerelease.length)
      return 1;
    if (!this.prerelease.length && !t.prerelease.length)
      return 0;
    let s = 0;
    do {
      const n = this.prerelease[s], r = t.prerelease[s];
      if (n === void 0 && r === void 0)
        return 0;
      if (r === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === r)
        continue;
      return H(n, r);
    } while (++s);
  }
}
const ae = Symbol("SemVer ANY");
class ge {
  semver;
  operator;
  value;
  loose;
  options;
  constructor(t, s) {
    if (s = de(s), t instanceof ge) {
      if (t.loose === !!s.loose)
        return t;
      t = t.value;
    }
    this.options = s, this.loose = !!s.loose, this.parse(t), this.semver === ae ? this.value = "" : this.value = this.operator + this.semver.version;
  }
  parse(t) {
    const s = this.options.loose ? A.COMPARATORLOOSE.regex : A.COMPARATOR.regex, n = t.match(s);
    if (!n)
      throw new TypeError(`Invalid comparator: ${t}`);
    this.operator = n[1] !== void 0 ? n[1] : "", this.operator === "=" && (this.operator = ""), n[2] ? this.semver = new T(n[2], this.options.loose) : this.semver = ae;
  }
  toString() {
    return this.value;
  }
}
const B = /* @__PURE__ */ new Map(), te = /* @__PURE__ */ new Map(), vn = 1e3, Lt = "$1^", Ct = "$1~", Pt = "$1$2$3", xe = (e) => e.value === "<0.0.0-0", xt = (e) => e.value === "", Dt = (e, t) => (e = zt(e, t), e = jt(e, t), e = Ft(e, t), e = Gt(e), e), v = (e) => !e || e.toLowerCase() === "x" || e === "*", jt = (e, t) => e.trim().split(/\s+/).map((s) => Mt(s, t)).join(" "), Mt = (e, t) => {
  const s = t.loose ? A.TILDELOOSE.regex : A.TILDE.regex;
  return e.replace(s, (n, r, i, o, a) => {
    let c;
    return v(r) ? c = "" : v(i) ? c = `>=${r}.0.0 <${+r + 1}.0.0-0` : v(o) ? c = `>=${r}.${i}.0 <${r}.${+i + 1}.0-0` : a ? c = `>=${r}.${i}.${o}-${a} <${r}.${+i + 1}.0-0` : c = `>=${r}.${i}.${o} <${r}.${+i + 1}.0-0`, c;
  });
}, zt = (e, t) => e.trim().split(/\s+/).map((s) => Ut(s, t)).join(" "), Ut = (e, t) => {
  const s = t.loose ? A.CARETLOOSE.regex : A.CARET.regex, n = t.includePrerelease ? "-0" : "";
  return e.replace(s, (r, i, o, a, c) => {
    let l;
    return v(i) ? l = "" : v(o) ? l = `>=${i}.0.0${n} <${+i + 1}.0.0-0` : v(a) ? i === "0" ? l = `>=${i}.${o}.0${n} <${i}.${+o + 1}.0-0` : l = `>=${i}.${o}.0${n} <${+i + 1}.0.0-0` : c ? i === "0" ? o === "0" ? l = `>=${i}.${o}.${a}-${c} <${i}.${o}.${+a + 1}-0` : l = `>=${i}.${o}.${a}-${c} <${i}.${+o + 1}.0-0` : l = `>=${i}.${o}.${a}-${c} <${+i + 1}.0.0-0` : i === "0" ? o === "0" ? l = `>=${i}.${o}.${a}${n} <${i}.${o}.${+a + 1}-0` : l = `>=${i}.${o}.${a}${n} <${i}.${+o + 1}.0-0` : l = `>=${i}.${o}.${a} <${+i + 1}.0.0-0`, l;
  });
}, Ft = (e, t) => e.split(/\s+/).map((s) => Bt(s, t)).join(" "), Bt = (e, t) => {
  e = e.trim();
  const s = t.loose ? A.XRANGELOOSE.regex : A.XRANGE.regex;
  return e.replace(s, (n, r, i, o, a, c) => {
    const l = v(i), u = l || v(o), f = u || v(a), g = f;
    return r === "=" && g && (r = ""), c = t.includePrerelease ? "-0" : "", l ? r === ">" || r === "<" ? n = "<0.0.0-0" : n = "*" : r && g ? (u && (o = 0), a = 0, r === ">" ? (r = ">=", u ? (i = +i + 1, o = 0, a = 0) : (o = +o + 1, a = 0)) : r === "<=" && (r = "<", u ? i = +i + 1 : o = +o + 1), r === "<" && (c = "-0"), n = `${r + i}.${o}.${a}${c}`) : u ? n = `>=${i}.0.0${c} <${+i + 1}.0.0-0` : f && (n = `>=${i}.${o}.0${c} <${i}.${+o + 1}.0-0`), n;
  });
}, Gt = (e, t) => e.trim().replace(A.STAR.regex, ""), Wt = (e, t) => e.trim().replace(A[t.includePrerelease ? "GTE0PRE" : "GTE0"].regex, ""), Xt = (e) => (t, s, n, r, i, o, a, c, l, u, f, g, m) => (v(n) ? s = "" : v(r) ? s = `>=${n}.0.0${e ? "-0" : ""}` : v(i) ? s = `>=${n}.${r}.0${e ? "-0" : ""}` : o ? s = `>=${s}` : s = `>=${s}${e ? "-0" : ""}`, v(l) ? c = "" : v(u) ? c = `<${+l + 1}.0.0-0` : v(f) ? c = `<${l}.${+u + 1}.0-0` : g ? c = `<=${l}.${u}.${f}-${g}` : e ? c = `<${l}.${u}.${+f + 1}-0` : c = `<=${c}`, `${s} ${c}`.trim()), Ht = (e, t, s) => {
  for (let n = 0; n < e.length; n++)
    if (!e[n].test(t))
      return !1;
  if (t.prerelease.length && !s.includePrerelease) {
    for (let n = 0; n < e.length; n++)
      if (e[n].semver !== ae && e[n].semver.prerelease.length > 0) {
        const r = e[n].semver;
        if (r.major === t.major && r.minor === t.minor && r.patch === t.patch)
          return !0;
      }
    return !1;
  }
  return !0;
};
class V {
  range;
  raw;
  loose;
  options;
  includePrerelease;
  set;
  constructor(t, s) {
    if (s = de(s), t instanceof V)
      return t.loose === !!s.loose && t.includePrerelease === !!s.includePrerelease ? t : new V(t.raw, s);
    if (this.options = s, this.loose = !!s.loose, this.includePrerelease = !!s.includePrerelease, this.raw = t, this.set = t.split("||").map((n) => this.parseRange(n.trim())).filter((n) => n.length), !this.set.length)
      throw new TypeError(`Invalid SemVer Range: ${t}`);
    if (this.set.length > 1) {
      const n = this.set[0];
      if (this.set = this.set.filter((r) => !xe(r[0])), this.set.length === 0)
        this.set = [n];
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
    const n = `parseRange:${Object.keys(this.options).join(",")}:${t}`;
    if (B.has(n))
      return te.set(n, Date.now()), B.get(n);
    const r = this.options.loose, i = r ? A.HYPHENRANGELOOSE.regex : A.HYPHENRANGE.regex;
    t = t.replace(i, Xt(this.options.includePrerelease)), t = t.replace(A.COMPARATORTRIM.regex, Pt), t = t.replace(A.TILDETRIM.regex, Ct), t = t.replace(A.CARETTRIM.regex, Lt), t = t.split(/\s+/).join(" ");
    let o = t.split(" ").map((f) => Dt(f, this.options)).join(" ").split(/\s+/).map((f) => Wt(f, this.options));
    r && (o = o.filter((f) => !!f.match(A.COMPARATORLOOSE.regex)));
    const a = /* @__PURE__ */ new Map(), c = o.map((f) => new ge(f, this.options));
    for (const f of c) {
      if (xe(f))
        return [f];
      a.set(f.value, f);
    }
    a.size > 1 && a.has("") && a.delete("");
    const l = [...a.values()];
    let u = l;
    if (B.set(n, u), te.set(n, Date.now()), B.size >= vn) {
      let g = [...te.entries()].sort((m, h) => m[1] - h[1])[0][0];
      B.delete(g), te.delete(g);
    }
    return l;
  }
  test(t) {
    if (!t)
      return !1;
    if (typeof t == "string")
      try {
        t = new T(t, this.options);
      } catch {
        return !1;
      }
    for (let s = 0; s < this.set.length; s++)
      if (Ht(this.set[s], t, this.options))
        return !0;
    return !1;
  }
}
function De(e, t, s) {
  let n = null, r = null, i = null;
  try {
    i = new V(t, s);
  } catch {
    return null;
  }
  return e.forEach((o) => {
    i.test(o) && (!n || r.compare(o) === -1) && (n = o, r = new T(n, s));
  }), n;
}
const Jn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SEMVER_SPEC_VERSION: bn,
  MAX_LENGTH: Ne,
  MAX_SAFE_INTEGER: X,
  MAX_SAFE_COMPONENT_LENGTH: ne,
  get R() {
    return kt;
  },
  createToken: $,
  tokens: A,
  parseOptions: de,
  numeric: Pe,
  compareIdentifiers: H,
  SemVer: T,
  ANY: ae,
  Comparator: ge,
  caretTrimReplace: Lt,
  tildeTrimReplace: Ct,
  comparatorTrimReplace: Pt,
  isNullSet: xe,
  isAny: xt,
  parseComparator: Dt,
  isX: v,
  replaceTildes: jt,
  replaceTilde: Mt,
  replaceCarets: zt,
  replaceCaret: Ut,
  replaceXRanges: Ft,
  replaceXRange: Bt,
  replaceStars: Gt,
  replaceGTE0: Wt,
  hyphenReplace: Xt,
  testSet: Ht,
  Range: V,
  maxSatisfying: De,
  default: De
}, Symbol.toStringTag, { value: "Module" })), J = (e) => {
  const t = "https://registry.npmjs.com";
  let { name: s, version: n, path: r } = ue(e), i = `${t}/-/v1/search?text=${encodeURIComponent(s)}&popularity=0.5&size=30`, o = `${t}/${s}/${n}`, a = `${t}/${s}`;
  return { searchURL: i, packageURL: a, packageVersionURL: o, version: n, name: s, path: r };
}, Qn = async (e) => {
  let { searchURL: t } = J(e), s;
  try {
    s = await (await Z(t, !1)).json();
  } catch (r) {
    throw console.warn(r), r;
  }
  return { packages: s?.objects, info: s };
}, _n = async (e) => {
  let { packageURL: t } = J(e);
  try {
    return await (await Z(t, !1)).json();
  } catch (s) {
    throw console.warn(s), s;
  }
}, On = async (e) => {
  let { packageVersionURL: t } = J(e);
  try {
    return await (await Z(t, !1)).json();
  } catch (s) {
    throw console.warn(s), s;
  }
}, Tn = async (e) => {
  try {
    let t = await _n(e), s = Object.keys(t.versions), n = t["dist-tags"];
    return { versions: s, tags: n };
  } catch (t) {
    throw console.warn(t), t;
  }
}, kn = async (e) => {
  try {
    let { version: t } = J(e), s = await Tn(e);
    if (s) {
      const { versions: n, tags: r } = s;
      return t in r && (t = r[t]), n.includes(t) ? t : De(n, t);
    }
  } catch (t) {
    throw console.warn(t), t;
  }
}, er = async (e) => {
  try {
    const { name: t } = J(e), s = await kn(e);
    return await On(`${t}@${s}`);
  } catch (t) {
    throw console.warn(t), t;
  }
};
let be;
const Ze = async () => {
  if (be)
    return be;
  const e = await import("./brotli-41ceedfa.mjs"), { default: t, source: s } = e;
  return await t(await s()), be = e;
};
async function Nn(e, t = 4096, s = 6, n = 22) {
  const { compress: r } = await Ze();
  return r(e, t, s, n);
}
async function In(e, t = 4096) {
  const { decompress: s } = await Ze();
  return s(e, t);
}
const Ln = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getWASM: Ze,
  compress: Nn,
  decompress: In
}, Symbol.toStringTag, { value: "Module" }));
let qt, Se;
const P = async (e) => {
  if (Se)
    return Se;
  const t = await import("./denoflate-82001750.mjs"), { default: s } = t, { wasm: n } = await import("./gzip-dfcdb483.mjs");
  return qt = await s(e ?? await n()), Se = t;
};
async function Cn(e, t) {
  return (await P()).deflate(e, t);
}
async function Pn(e) {
  return (await P()).inflate(e);
}
async function xn(e, t) {
  return (await P()).gzip(e, t);
}
async function Dn(e) {
  return (await P()).gunzip(e);
}
async function jn(e, t) {
  return (await P()).zlib(e, t);
}
async function Mn(e) {
  return (await P()).unzlib(e);
}
const zn = qt, Un = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getWASM: P,
  deflate: Cn,
  inflate: Pn,
  gzip: xn,
  gunzip: Dn,
  zlib: jn,
  unzlib: Mn,
  default: zn
}, Symbol.toStringTag, { value: "Module" }));
let ve;
const Ke = async () => {
  if (ve)
    return ve;
  const e = await import("./lz4-54bbf0d3.mjs"), { default: t, source: s } = e;
  return await t(await s()), ve = e;
};
async function Fn(e) {
  const { lz4_compress: t } = await Ke();
  return t(e);
}
async function Bn(e) {
  const { lz4_decompress: t } = await Ke();
  return t(e);
}
const Gn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getWASM: Ke,
  compress: Fn,
  decompress: Bn
}, Symbol.toStringTag, { value: "Module" }));
function Wn(e) {
  if (typeof e == "string")
    return btoa(e);
  {
    const t = new Uint8Array(e);
    let s = "";
    for (let n = 0; n < t.length; ++n)
      s += String.fromCharCode(t[n]);
    return btoa(s);
  }
}
function Xn(e) {
  const t = Yt(e), s = new Uint8Array(t.length);
  for (let n = 0; n < s.length; ++n)
    s[n] = t.charCodeAt(n);
  return s.buffer;
}
function Yt(e) {
  return atob(e);
}
const tr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  encode: Wn,
  decode: Xn,
  decodeString: Yt
}, Symbol.toStringTag, { value: "Module" }));
export {
  en as ALIAS,
  nt as ALIAS_NAMESPACE,
  Ee as ALIAS_RESOLVE,
  rn as AnsiBuffer,
  un as BIBIT_UNITS,
  cn as BIBYTE_UNITS,
  fn as BIT_UNITS,
  ln as BUILD_CONFIG,
  an as BYTE_UNITS,
  bt as CACHE,
  Hs as CACHE_NAME,
  Ks as CDN,
  st as CDN_NAMESPACE,
  ke as CDN_RESOLVE,
  hn as COMPRESS_CONFIG,
  F as DEFAULT_CDN_HOST,
  Us as DeprecatedAPIs,
  js as EMPTY_EXPORT,
  rr as ESBUILD_SOURCE_WASM,
  rt as ESCAPE_TO_COLOR,
  S as EVENTS,
  Jt as EVENTS_OPTS,
  Gs as EXTERNAL,
  G as EXTERNALS_NAMESPACE,
  Fs as ExternalPackages,
  U as FileSystem,
  Qs as HTTP,
  I as HTTP_NAMESPACE,
  vt as HTTP_RESOLVE,
  $e as OPEN_CACHE,
  ce as PLATFORM_AUTO,
  zs as PolyfillKeys,
  Ms as PolyfillMap,
  Cs as RESOLVE_EXTENSIONS,
  Xs as RE_NON_SCOPED,
  Ws as RE_SCOPED,
  mn as TRANSFORM_CONFIG,
  we as VIRTUAL_FILESYSTEM_NAMESPACE,
  Ps as VIRTUAL_FS,
  on as ansi,
  _ as bail,
  tr as base64,
  Ln as brotli,
  qn as build,
  ot as bytes,
  Yn as compress,
  Ge as createConfig,
  le as createNotice,
  Qt as createState,
  Zn as debounce,
  Te as decode,
  se as deepAssign,
  gn as deepDiff,
  Tt as deepEqual,
  Un as denoflate,
  Fe as encode,
  Js as fetchAssets,
  St as fetchPkg,
  ot as formatBytes,
  xs as getCDNOrigin,
  Rt as getCDNStyle,
  O as getCDNUrl,
  es as getEsbuild,
  tn as getFile,
  _n as getPackage,
  On as getPackageOfVersion,
  Tn as getPackageVersions,
  Qn as getPackages,
  Ds as getPureImportPath,
  J as getRegistryURL,
  Z as getRequest,
  er as getResolvedPackage,
  Ot as getResolvedPath,
  Y as getState,
  nn as htmlEscape,
  At as inferLoader,
  ft as init,
  _t as isAlias,
  Bs as isExternal,
  C as isObject,
  pn as isPrimitive,
  dn as isValidKey,
  Vs as legacy,
  k as loop,
  Gn as lz4,
  Kn as lzstring,
  tt as newRequest,
  qs as openCache,
  ue as parsePackageName,
  Hn as path,
  ot as prettyBytes,
  on as render,
  Ys as resolveExports,
  Zs as resolveImports,
  kn as resolveVersion,
  Jn as semver,
  sn as setFile,
  _e as setState,
  it as toLocaleString,
  Be as toName,
  Vn as transform
};
//# sourceMappingURL=index.mjs.map
