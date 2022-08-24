const Ke = "0.15.5", le = "Deno" in globalThis ? "deno" : "process" in globalThis ? "node" : "browser";
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
}, Jt = (e, t, ...s) => {
  e.forEach((r) => {
    r[t](...s);
  });
}, Qe = ({ callback: e = () => {
}, scope: t = null, name: s = "event" }) => ({ callback: e, scope: t, name: s }), J = class extends at {
  constructor(e = "event") {
    super(), this.name = e;
  }
}, Kt = class extends at {
  constructor() {
    super();
  }
  getEvent(e) {
    let t = this.get(e);
    return t instanceof J ? t : (this.set(e, new J(e)), this.get(e));
  }
  newListener(e, t, s) {
    let r = this.getEvent(e);
    return r.add(Qe({ name: e, callback: t, scope: s })), r;
  }
  on(e, t, s) {
    if (typeof e > "u" || e == null)
      return this;
    typeof e == "string" && (e = e.trim().split(/\s/g));
    let r, n, i = typeof e == "object" && !Array.isArray(e), o = i ? t : s;
    return i || (n = t), Object.keys(e).forEach((c) => {
      r = i ? c : e[c], i && (n = e[c]), this.newListener(r, n, o);
    }, this), this;
  }
  removeListener(e, t, s) {
    let r = this.get(e);
    if (r instanceof J && t) {
      let n = Qe({ name: e, callback: t, scope: s });
      r.forEach((i, o) => {
        if (i.callback === n.callback && i.scope === n.scope)
          return r.remove(o);
      });
    }
    return r;
  }
  off(e, t, s) {
    if (typeof e > "u" || e == null)
      return this;
    typeof e == "string" && (e = e.trim().split(/\s/g));
    let r, n, i = typeof e == "object" && !Array.isArray(e), o = i ? t : s;
    return i || (n = t), Object.keys(e).forEach((c) => {
      r = i ? c : e[c], i && (n = e[c]), typeof n == "function" ? this.removeListener(r, n, o) : this.remove(r);
    }, this), this;
  }
  once(e, t, s) {
    if (typeof e > "u" || e == null)
      return this;
    typeof e == "string" && (e = e.trim().split(/\s/g));
    let r = typeof e == "object" && !Array.isArray(e);
    return Object.keys(e).forEach((n) => {
      let i = r ? n : e[n], o = r ? e[n] : t, c = r ? t : s, a = (...l) => {
        o.apply(c, l), this.removeListener(i, a, c);
      };
      this.newListener(i, a, c);
    }, this), this;
  }
  emit(e, ...t) {
    return typeof e > "u" || e == null ? this : (typeof e == "string" && (e = e.trim().split(/\s/g)), e.forEach((s) => {
      let r = this.get(s);
      r instanceof J && r.forEach((n) => {
        let { callback: i, scope: o } = n;
        i.apply(o, t);
      });
    }, this), this);
  }
  clear() {
    return Jt(this, "clear"), super.clear(), this;
  }
};
const Qt = {
  "init.start": console.log,
  "init.complete": console.info,
  "init.error": console.error,
  "init.loading": console.warn,
  "logger.log": console.log,
  "logger.error": console.error,
  "logger.warn": console.warn,
  "logger.info": console.info
}, S = new Kt();
S.on(Qt);
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
function es(e) {
  let t = e;
  return [
    () => t,
    (s) => (typeof s == "object" && !Array.isArray(s) && s !== null ? Object.assign(t, s) : t = s ?? e, t)
  ];
}
async function ts(e = le) {
  try {
    switch (e) {
      case "node":
        return await import("esbuild");
      case "deno":
        return await import(
          /* @vite-ignore */
          `https://deno.land/x/esbuild@v${Ke}/mod.js`
        );
      case "deno-wasm":
        return await import(
          /* @vite-ignore */
          `https://deno.land/x/esbuild@v${Ke}/wasm.js`
        );
      default:
        return await import("./esbuild-893de9eb.mjs").then((t) => t.b);
    }
  } catch (t) {
    throw t;
  }
}
async function ft(e = le, t = {}) {
  try {
    if (!Y("initialized")) {
      _e("initialized", !0), S.emit("init.start");
      const s = await ts(e);
      if (_e("esbuild", s), e !== "node" && e !== "deno")
        if ("wasmModule" in t)
          await s.initialize(t);
        else {
          const { default: r } = await import("./esbuild-wasm-89d7a516.mjs");
          await s.initialize({
            wasmModule: new WebAssembly.Module(await r()),
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
const H = 46, y = 47, ut = "/", ht = /\/+/;
function N(e) {
  if (typeof e != "string")
    throw new TypeError(
      `Path must be a string. Received ${JSON.stringify(e)}`
    );
}
function pt(e) {
  return e === y;
}
function dt(e, t, s, r) {
  let n = "", i = 0, o = -1, c = 0, a;
  for (let l = 0, f = e.length; l <= f; ++l) {
    if (l < f)
      a = e.charCodeAt(l);
    else {
      if (r(a))
        break;
      a = y;
    }
    if (r(a)) {
      if (!(o === l - 1 || c === 1))
        if (o !== l - 1 && c === 2) {
          if (n.length < 2 || i !== 2 || n.charCodeAt(n.length - 1) !== H || n.charCodeAt(n.length - 2) !== H) {
            if (n.length > 2) {
              const u = n.lastIndexOf(s);
              u === -1 ? (n = "", i = 0) : (n = n.slice(0, u), i = n.length - 1 - n.lastIndexOf(s)), o = l, c = 0;
              continue;
            } else if (n.length === 2 || n.length === 1) {
              n = "", i = 0, o = l, c = 0;
              continue;
            }
          }
          t && (n.length > 0 ? n += `${s}..` : n = "..", i = 2);
        } else
          n.length > 0 ? n += s + e.slice(o + 1, l) : n = e.slice(o + 1, l), i = l - o - 1;
      o = l, c = 0;
    } else
      a === H && c !== -1 ? ++c : c = -1;
  }
  return n;
}
function ss(e, t) {
  const s = t.dir || t.root, r = t.base || (t.name || "") + (t.ext || "");
  return s ? s === t.root ? s + r : s + e + r : r;
}
const rs = {
  "	": "%09",
  "\n": "%0A",
  "\v": "%0B",
  "\f": "%0C",
  "\r": "%0D",
  " ": "%20"
};
function gt(e) {
  return e.replaceAll(/[\s]/g, (t) => rs[t] ?? t);
}
const ns = "/", is = ":";
function Oe(...e) {
  let t = "", s = !1;
  for (let r = e.length - 1; r >= -1 && !s; r--) {
    let n;
    if (r >= 0)
      n = e[r];
    else {
      const { Deno: i } = globalThis;
      if (typeof i?.cwd != "function")
        throw new TypeError("Resolved a relative path without a CWD.");
      n = i?.cwd?.() ?? "/";
    }
    N(n), n.length !== 0 && (t = `${n}/${t}`, s = n.charCodeAt(0) === y);
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
function $t(e) {
  return N(e), e.length > 0 && e.charCodeAt(0) === y;
}
function os(...e) {
  if (e.length === 0)
    return ".";
  let t;
  for (let s = 0, r = e.length; s < r; ++s) {
    const n = e[s];
    N(n), n.length > 0 && (t ? t += `/${n}` : t = n);
  }
  return t ? mt(t) : ".";
}
function ls(e, t) {
  if (N(e), N(t), e === t || (e = Oe(e), t = Oe(t), e === t))
    return "";
  let s = 1;
  const r = e.length;
  for (; s < r && e.charCodeAt(s) === y; ++s)
    ;
  const n = r - s;
  let i = 1;
  const o = t.length;
  for (; i < o && t.charCodeAt(i) === y; ++i)
    ;
  const c = o - i, a = n < c ? n : c;
  let l = -1, f = 0;
  for (; f <= a; ++f) {
    if (f === a) {
      if (c > a) {
        if (t.charCodeAt(i + f) === y)
          return t.slice(i + f + 1);
        if (f === 0)
          return t.slice(i + f);
      } else
        n > a && (e.charCodeAt(s + f) === y ? l = f : f === 0 && (l = 0));
      break;
    }
    const g = e.charCodeAt(s + f), m = t.charCodeAt(i + f);
    if (g !== m)
      break;
    g === y && (l = f);
  }
  let u = "";
  for (f = s + l + 1; f <= r; ++f)
    (f === r || e.charCodeAt(f) === y) && (u.length === 0 ? u += ".." : u += "/..");
  return u.length > 0 ? u + t.slice(i + l) : (i += l, t.charCodeAt(i) === y && ++i, t.slice(i));
}
function as(e) {
  return e;
}
function cs(e) {
  if (N(e), e.length === 0)
    return ".";
  const t = e.charCodeAt(0) === y;
  let s = -1, r = !0;
  for (let n = e.length - 1; n >= 1; --n)
    if (e.charCodeAt(n) === y) {
      if (!r) {
        s = n;
        break;
      }
    } else
      r = !1;
  return s === -1 ? t ? "/" : "." : t && s === 1 ? "//" : e.slice(0, s);
}
function fs(e, t = "") {
  if (t !== void 0 && typeof t != "string")
    throw new TypeError('"ext" argument must be a string');
  N(e);
  let s = 0, r = -1, n = !0, i;
  if (t !== void 0 && t.length > 0 && t.length <= e.length) {
    if (t.length === e.length && t === e)
      return "";
    let o = t.length - 1, c = -1;
    for (i = e.length - 1; i >= 0; --i) {
      const a = e.charCodeAt(i);
      if (a === y) {
        if (!n) {
          s = i + 1;
          break;
        }
      } else
        c === -1 && (n = !1, c = i + 1), o >= 0 && (a === t.charCodeAt(o) ? --o === -1 && (r = i) : (o = -1, r = c));
    }
    return s === r ? r = c : r === -1 && (r = e.length), e.slice(s, r);
  } else {
    for (i = e.length - 1; i >= 0; --i)
      if (e.charCodeAt(i) === y) {
        if (!n) {
          s = i + 1;
          break;
        }
      } else
        r === -1 && (n = !1, r = i + 1);
    return r === -1 ? "" : e.slice(s, r);
  }
}
function us(e) {
  N(e);
  let t = -1, s = 0, r = -1, n = !0, i = 0;
  for (let o = e.length - 1; o >= 0; --o) {
    const c = e.charCodeAt(o);
    if (c === y) {
      if (!n) {
        s = o + 1;
        break;
      }
      continue;
    }
    r === -1 && (n = !1, r = o + 1), c === H ? t === -1 ? t = o : i !== 1 && (i = 1) : t !== -1 && (i = -1);
  }
  return t === -1 || r === -1 || i === 0 || i === 1 && t === r - 1 && t === s + 1 ? "" : e.slice(t, r);
}
function hs(e) {
  if (e === null || typeof e != "object")
    throw new TypeError(
      `The "pathObject" argument must be of type Object. Received type ${typeof e}`
    );
  return ss("/", e);
}
function ps(e) {
  N(e);
  const t = { root: "", dir: "", base: "", ext: "", name: "" };
  if (e.length === 0)
    return t;
  const s = e.charCodeAt(0) === y;
  let r;
  s ? (t.root = "/", r = 1) : r = 0;
  let n = -1, i = 0, o = -1, c = !0, a = e.length - 1, l = 0;
  for (; a >= r; --a) {
    const f = e.charCodeAt(a);
    if (f === y) {
      if (!c) {
        i = a + 1;
        break;
      }
      continue;
    }
    o === -1 && (c = !1, o = a + 1), f === H ? n === -1 ? n = a : l !== 1 && (l = 1) : n !== -1 && (l = -1);
  }
  return n === -1 || o === -1 || l === 0 || l === 1 && n === o - 1 && n === i + 1 ? o !== -1 && (i === 0 && s ? t.base = t.name = e.slice(1, o) : t.base = t.name = e.slice(i, o)) : (i === 0 && s ? (t.name = e.slice(1, n), t.base = e.slice(1, o)) : (t.name = e.slice(i, n), t.base = e.slice(i, o)), t.ext = e.slice(n, o)), i > 0 ? t.dir = e.slice(0, i - 1) : s && (t.dir = "/"), t;
}
function ds(e) {
  if (e = e instanceof URL ? e : new URL(e), e.protocol != "file:")
    throw new TypeError("Must be a file URL.");
  return decodeURIComponent(
    e.pathname.replace(/%(?![0-9A-Fa-f]{2})/g, "%25")
  );
}
function gs(e) {
  if (!$t(e))
    throw new TypeError("Must be an absolute path.");
  const t = new URL("file:///");
  return t.pathname = gt(
    e.replace(/%/g, "%25").replace(/\\/g, "%5C")
  ), t;
}
const je = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  sep: ns,
  delimiter: is,
  resolve: Oe,
  normalize: mt,
  isAbsolute: $t,
  join: os,
  relative: ls,
  toNamespacedPath: as,
  dirname: cs,
  basename: fs,
  extname: us,
  format: hs,
  parse: ps,
  fromFileUrl: ds,
  toFileUrl: gs
}, Symbol.toStringTag, { value: "Module" })), ms = je, { join: $s, normalize: et } = ms, me = [
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
function Es(e, {
  extended: t = !0,
  globstar: s = !0,
  os: r = "linux",
  caseInsensitive: n = !1
} = {}) {
  if (e == "")
    return /(?!)/;
  const i = r == "windows" ? "(?:\\\\|/)+" : "/+", o = r == "windows" ? "(?:\\\\|/)*" : "/*", c = r == "windows" ? ["\\", "/"] : ["/"], a = r == "windows" ? "(?:[^\\\\/]*(?:\\\\|/|$)+)*" : "(?:[^/]*(?:/|$)+)*", l = r == "windows" ? "[^\\\\/]*" : "[^/]*", f = r == "windows" ? "`" : "\\";
  let u = e.length;
  for (; u > 1 && c.includes(e[u - 1]); u--)
    ;
  e = e.slice(0, u);
  let g = "";
  for (let m = 0; m < e.length; ) {
    let h = "";
    const d = [];
    let p = !1, P = !1, R = !1, $ = m;
    for (; $ < e.length && !c.includes(e[$]); $++) {
      if (P) {
        P = !1, h += (p ? ws : me).includes(e[$]) ? `\\${e[$]}` : e[$];
        continue;
      }
      if (e[$] == f) {
        P = !0;
        continue;
      }
      if (e[$] == "[")
        if (p) {
          if (e[$ + 1] == ":") {
            let E = $ + 1, b = "";
            for (; e[E + 1] != null && e[E + 1] != ":"; )
              b += e[E + 1], E++;
            if (e[E + 1] == ":" && e[E + 2] == "]") {
              $ = E + 2, b == "alnum" ? h += "\\dA-Za-z" : b == "alpha" ? h += "A-Za-z" : b == "ascii" ? h += "\0-\x7F" : b == "blank" ? h += "	 " : b == "cntrl" ? h += "\0-\x7F" : b == "digit" ? h += "\\d" : b == "graph" ? h += "!-~" : b == "lower" ? h += "a-z" : b == "print" ? h += " -~" : b == "punct" ? h += `!"#$%&'()*+,\\-./:;<=>?@[\\\\\\]^_\u2018{|}~` : b == "space" ? h += "\\s\v" : b == "upper" ? h += "A-Z" : b == "word" ? h += "\\w" : b == "xdigit" && (h += "\\dA-Fa-f");
              continue;
            }
          }
        } else {
          p = !0, h += "[", e[$ + 1] == "!" ? ($++, h += "^") : e[$ + 1] == "^" && ($++, h += "\\^");
          continue;
        }
      if (e[$] == "]" && p) {
        p = !1, h += "]";
        continue;
      }
      if (p) {
        e[$] == "\\" ? h += "\\\\" : h += e[$];
        continue;
      }
      if (e[$] == ")" && d.length > 0 && d[d.length - 1] != "BRACE") {
        h += ")";
        const E = d.pop();
        E == "!" ? h += l : E != "@" && (h += E);
        continue;
      }
      if (e[$] == "|" && d.length > 0 && d[d.length - 1] != "BRACE") {
        h += "|";
        continue;
      }
      if (e[$] == "+" && t && e[$ + 1] == "(") {
        $++, d.push("+"), h += "(?:";
        continue;
      }
      if (e[$] == "@" && t && e[$ + 1] == "(") {
        $++, d.push("@"), h += "(?:";
        continue;
      }
      if (e[$] == "?") {
        t && e[$ + 1] == "(" ? ($++, d.push("?"), h += "(?:") : h += ".";
        continue;
      }
      if (e[$] == "!" && t && e[$ + 1] == "(") {
        $++, d.push("!"), h += "(?!";
        continue;
      }
      if (e[$] == "{") {
        d.push("BRACE"), h += "(?:";
        continue;
      }
      if (e[$] == "}" && d[d.length - 1] == "BRACE") {
        d.pop(), h += ")";
        continue;
      }
      if (e[$] == "," && d[d.length - 1] == "BRACE") {
        h += "|";
        continue;
      }
      if (e[$] == "*") {
        if (t && e[$ + 1] == "(")
          $++, d.push("*"), h += "(?:";
        else {
          const E = e[$ - 1];
          let b = 1;
          for (; e[$ + 1] == "*"; )
            $++, b++;
          const Zt = e[$ + 1];
          s && b == 2 && [...c, void 0].includes(E) && [...c, void 0].includes(Zt) ? (h += a, R = !0) : h += l;
        }
        continue;
      }
      h += me.includes(e[$]) ? `\\${e[$]}` : e[$];
    }
    if (d.length > 0 || p || P) {
      h = "";
      for (const E of e.slice(m, $))
        h += me.includes(E) ? `\\${E}` : E, R = !1;
    }
    for (g += h, R || (g += $ < e.length ? i : o, R = !0); c.includes(e[$]); )
      $++;
    if (!($ > m))
      throw new Error("Assertion failure: i > j (potential infinite loop)");
    m = $;
  }
  return g = `^${g}$`, new RegExp(g, n ? "i" : "");
}
function ys(e) {
  const t = { "{": "}", "(": ")", "[": "]" }, s = /\\(.)|(^!|\*|\?|[\].+)]\?|\[[^\\\]]+\]|\{[^\\}]+\}|\(\?[:!=][^\\)]+\)|\([^|]+\|[^\\)]+\))/;
  if (e === "")
    return !1;
  let r;
  for (; r = s.exec(e); ) {
    if (r[2])
      return !0;
    let n = r.index + r[0].length;
    const i = r[1], o = i ? t[i] : null;
    if (i && o) {
      const c = e.indexOf(o, n);
      c !== -1 && (n = c + 1);
    }
    e = e.slice(n);
  }
  return !1;
}
function wt(e, { globstar: t = !1 } = {}) {
  if (e.match(/\0/g))
    throw new Error(`Glob contains invalid characters: "${e}"`);
  if (!t)
    return et(e);
  const s = ht.source, r = new RegExp(
    `(?<=(${s}|^)\\*\\*${s})\\.\\.(?=${s}|$)`,
    "g"
  );
  return et(e.replace(r, "\0")).replace(/\0/g, "..");
}
function As(e, { extended: t = !0, globstar: s = !1 } = {}) {
  if (!s || e.length == 0)
    return $s(...e);
  if (e.length === 0)
    return ".";
  let r;
  for (const n of e) {
    const i = n;
    i.length > 0 && (r ? r += `${ut}${i}` : r = i);
  }
  return r ? wt(r, { extended: t, globstar: s }) : ".";
}
const Rs = je, bs = je, {
  basename: Ss,
  delimiter: vs,
  dirname: Me,
  extname: ze,
  format: _s,
  fromFileUrl: Os,
  isAbsolute: Et,
  join: yt,
  normalize: ks,
  parse: Ts,
  relative: Ns,
  resolve: Fe,
  sep: xs,
  toFileUrl: Cs,
  toNamespacedPath: Is
} = Rs, ne = (e, ...t) => {
  const s = new URL(e);
  return s.pathname = gt(
    yt(s.pathname, ...t).replace(/%/g, "%25").replace(/\\/g, "%5C")
  ), s.toString();
}, ae = (e) => /^(?!\.).*/.test(e) && !Et(e), Hr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  urlJoin: ne,
  isBareImport: ae,
  SEP: ut,
  SEP_PATTERN: ht,
  globToRegExp: Es,
  isGlob: ys,
  normalizeGlob: wt,
  joinGlobs: As,
  posix: bs,
  basename: Ss,
  delimiter: vs,
  dirname: Me,
  extname: ze,
  format: _s,
  fromFileUrl: Os,
  isAbsolute: Et,
  join: yt,
  normalize: ks,
  parse: Ts,
  relative: Ns,
  resolve: Fe,
  sep: xs,
  toFileUrl: Cs,
  toNamespacedPath: Is
}, Symbol.toStringTag, { value: "Module" })), Ls = [".tsx", ".ts", ".jsx", ".js", ".css", ".json"], At = (e) => {
  const t = ze(e);
  return Ls.includes(t) ? (/\.js(x)?$/.test(t) ? t.replace(/^\.js/, ".ts") : t).slice(1) : t === ".mjs" || t === ".cjs" || t === ".mts" || t === ".cts" ? "ts" : t == ".scss" ? "css" : t == ".png" || t == ".jpeg" || t == ".ttf" ? "dataurl" : t == ".svg" || t == ".html" || t == ".txt" ? "text" : t == ".wasm" ? "file" : t.length ? "text" : "ts";
}, $e = "virtual-filesystem", Ps = (e, t, s) => {
  const r = s.filesystem;
  return {
    name: $e,
    setup(n) {
      n.onResolve({ filter: /.*/ }, (i) => ({
        path: i.path,
        pluginData: i.pluginData ?? {},
        namespace: $e
      })), n.onLoad({ filter: /.*/, namespace: $e }, async (i) => {
        let o = await r.resolve(i.path, i?.pluginData?.importer);
        return {
          contents: await r.get(i.path, "buffer", i?.pluginData?.importer),
          pluginData: {
            importer: o
          },
          loader: At(o)
        };
      });
    }
  };
}, Ue = (e) => new TextEncoder().encode(e), ke = (e) => new TextDecoder().decode(e), U = "https://unpkg.com", Rt = (e) => /^(skypack|esm|esm\.sh|unpkg|jsdelivr|esm\.run)\:?/.test(e) || /^https?:\/\/(cdn\.skypack\.dev|cdn\.esm\.sh|cdn\.jsdelivr\.net\/npm|unpkg\.com)/.test(e) ? "npm" : /^(jsdelivr\.gh|github)\:?/.test(e) || /^https?:\/\/(cdn\.jsdelivr\.net\/gh|raw\.githubusercontent\.com)/.test(e) ? "github" : /^(deno)\:?/.test(e) || /^https?:\/\/(deno\.land\/x)/.test(e) ? "deno" : "other", Ds = (e, t = U) => (/^skypack\:/.test(e) ? t = "https://cdn.skypack.dev" : /^(esm\.sh|esm)\:/.test(e) ? t = "https://cdn.esm.sh" : /^unpkg\:/.test(e) ? t = "https://unpkg.com" : /^(jsdelivr|esm\.run)\:/.test(e) ? t = "https://cdn.jsdelivr.net/npm" : /^(jsdelivr\.gh)\:/.test(e) ? t = "https://cdn.jsdelivr.net/gh" : /^(deno)\:/.test(e) ? t = "https://deno.land/x" : /^(github)\:/.test(e) && (t = "https://raw.githubusercontent.com"), /\/$/.test(t) ? t : `${t}/`), js = (e) => e.replace(/^(skypack|esm|esm\.sh|unpkg|jsdelivr|jsdelivr\.gh|esm\.run|deno|github)\:/, "").replace(/^https?:\/\/(cdn\.skypack\.dev|cdn\.esm\.sh|cdn\.jsdelivr\.net\/npm|unpkg\.com|cdn\.jsdelivr\.net\/gh|raw\.githubusercontent\.com|deno\.land\/x)/, "").replace(/^\//, ""), O = (e, t = U) => {
  let s = Ds(e, t), r = js(e), n = new URL(r, s);
  return { import: e, path: r, origin: s, cdn: t, url: n };
}, G = "external-globals", Ms = Ue("export default {}"), zs = {
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
}, Fs = Object.keys(zs), Us = ["v8/tools/codemap", "v8/tools/consarray", "v8/tools/csvparser", "v8/tools/logreader", "v8/tools/profile_view", "v8/tools/profile", "v8/tools/SourceMap", "v8/tools/splaytree", "v8/tools/tickprocessor-driver", "v8/tools/tickprocessor", "node-inspect/lib/_inspect", "node-inspect/lib/internal/inspect_client ", "node-inspect/lib/internal/inspect_repl", "_linklist", "_stream_wrap"], Bs = ["chokidar", "yargs", "fsevents", "worker_threads", "async_hooks", "diagnostics_channel", "http2", "inspector", "perf_hooks", "trace_events", "wasi", ...Us, ...Fs], Gs = (e, t = []) => [...Bs, ...t].find((s) => !!(s === e || e.startsWith(`${s}/`)));
function Ws(e, t, s) {
  const { external: r = [] } = s?.esbuild ?? {};
  return {
    name: G,
    setup(n) {
      n.onResolve({ filter: /.*/ }, (i) => {
        let o = i.path.replace(/^node\:/, ""), { path: c } = O(o);
        if (Gs(c, r))
          return {
            path: c,
            namespace: G,
            external: !0
          };
      }), n.onLoad({ filter: /.*/, namespace: G }, (i) => ({
        pluginName: G,
        contents: Ms,
        warnings: [{
          text: `${i.path} is marked as an external module and will be ignored.`,
          details: `"${i.path}" is a built-in node module thus can't be bundled by https://bundlejs.com, sorry about that.`
        }]
      }));
    }
  };
}
const Xs = /^(@[^\/]+\/[^@\/]+)(?:@([^\/]+))?(\/.*)?$/, qs = /^([^@\/]+)(?:@([^\/]+))?(\/.*)?$/;
function ce(e) {
  const t = Xs.exec(e) || qs.exec(e);
  if (!t)
    throw new Error(`[parse-package-name] invalid package name: ${e}`);
  return {
    name: t[1] || "",
    version: t[2] || "latest",
    path: t[3] || ""
  };
}
const bt = /* @__PURE__ */ new Map(), Hs = "EXTERNAL_FETCHES", tt = async (e, t, s) => {
  let r = await fetch(t, s), n = r.clone();
  return "caches" in globalThis ? e.put(t, n) : bt.set(t, n), r;
};
let we;
const Ys = async () => we || (we = await caches.open(Hs)), fe = async (e, t = !1, s) => {
  let r = new Request(e.toString()), n, i, o;
  return "caches" in globalThis ? (i = await Ys(), o = await i.match(r)) : o = bt.get(r), n = o, o ? t || tt(i, r, s) : n = await tt(i, r, s), n.clone();
};
function T(e, t) {
  if (typeof e == "string")
    return e;
  if (e) {
    let s, r;
    if (Array.isArray(e)) {
      for (s = 0; s < e.length; s++)
        if (r = T(e[s], t))
          return r;
    } else
      for (s in e)
        if (t.has(s))
          return T(e[s], t);
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
function Vs(e, t = ".", s = {}) {
  let { name: r, exports: n } = e;
  if (n) {
    let { browser: i, require: o, unsafe: c, conditions: a = [] } = s, l = Be(r, t);
    if (l[0] !== "." && (l = "./" + l), typeof n == "string")
      return l === "." ? n : _(r, l);
    let f = /* @__PURE__ */ new Set(["default", ...a]);
    c || f.add(o ? "require" : "import"), c || f.add(i ? "browser" : "node");
    let u, g, m = !1;
    for (u in n) {
      m = u[0] !== ".";
      break;
    }
    if (m)
      return l === "." ? T(n, f) || _(r, l, 1) : _(r, l);
    if (g = n[l])
      return T(g, f) || _(r, l, 1);
    for (u in n) {
      if (g = u[u.length - 1], g === "/" && l.startsWith(u))
        return (g = T(n[u], f)) ? g + l.substring(u.length) : _(r, l, 1);
      if (g === "*" && l.startsWith(u.slice(0, -1)) && l.substring(u.length - 1).length > 0)
        return (g = T(n[u], f)) ? g.replace("*", l.substring(u.length - 1)) : _(r, l, 1);
    }
    return _(r, l);
  }
}
function Zs(e, t = {}) {
  let s = 0, r, n = t.browser, i = t.fields || ["module", "main"];
  for (n && !i.includes("browser") && i.unshift("browser"); s < i.length; s++)
    if (r = e[i[s]]) {
      if (typeof r != "string")
        if (typeof r == "object" && i[s] == "browser") {
          if (typeof n == "string" && (r = r[n = Be(e.name, n)], r == null))
            return n;
        } else
          continue;
      return typeof r == "string" ? "./" + r.replace(/^\.?\//, "") : r;
    }
}
function Js(e, t = ".", s = {}) {
  let { name: r, imports: n } = e;
  if (n) {
    let { browser: i, require: o, unsafe: c, conditions: a = [] } = s, l = Be(r, t);
    if (typeof n == "string")
      return l === "#" ? n : _(r, l);
    let f = /* @__PURE__ */ new Set(["default", ...a]);
    c || f.add(o ? "require" : "import"), c || f.add(i ? "browser" : "node");
    let u, g, m = !1;
    for (u in n) {
      m = u[0] !== "#";
      break;
    }
    if (m)
      return l === "#" ? T(n, f) || _(r, l, 1) : _(r, l);
    if (g = n[l])
      return T(g, f) || _(r, l, 1);
    for (u in n) {
      if (g = u[u.length - 1], g === "/" && l.startsWith(u))
        return (g = T(n[u], f)) ? g + l.substring(u.length) : _(r, l, 1);
      if (g === "*" && l.startsWith(u.slice(0, -1)) && l.substring(u.length - 1).length > 0)
        return (g = T(n[u], f)) ? g.replace("*", l.substring(u.length - 1)) : _(r, l, 1);
    }
    return _(r, l);
  }
}
const st = "cdn-url", Te = (e = U, t) => async (s) => {
  if (ae(s.path)) {
    let { path: r, origin: n } = O(s.path, e), i = Rt(n) == "npm", o = ce(r), c = o.path, a = s.pluginData?.pkg ?? {};
    if (r[0] == "#") {
      let g = Js({ ...a, exports: a.imports }, r, {
        require: s.kind === "require-call" || s.kind === "require-resolve"
      });
      if (typeof g == "string") {
        c = g.replace(/^\.?\/?/, "/"), c && c[0] !== "/" && (c = `/${c}`);
        let m = i ? "@" + a.version : "", { url: { href: h } } = O(`${a.name}${m}${c}`);
        return {
          namespace: x,
          path: h,
          pluginData: { pkg: a }
        };
      }
    }
    if (("dependencies" in a || "devDependencies" in a || "peerDependencies" in a) && !/\S+@\S+/.test(r)) {
      let {
        devDependencies: g = {},
        dependencies: m = {},
        peerDependencies: h = {}
      } = a, d = Object.assign({}, g, h, m);
      Object.keys(d).includes(r) && (o.version = d[r]);
    }
    if (i)
      try {
        let { url: g } = O(`${o.name}@${o.version}/package.json`, n);
        a = await fe(g, !0).then((h) => h.json());
        let m = Vs(a, c ? "." + c.replace(/^\.?\/?/, "/") : ".", {
          require: s.kind === "require-call" || s.kind === "require-resolve"
        }) || Zs(a);
        typeof m == "string" && (c = m.replace(/^\.?\/?/, "/").replace(/\.js\.js$/, ".js")), c && c[0] !== "/" && (c = `/${c}`);
      } catch (g) {
        t.emit(
          "logger.warn",
          `You may want to change CDNs. The current CDN ${/unpkg\.com/.test(n) ? `path "${n}${r}" may not` : `"${n}" doesn't`} support package.json files.
There is a chance the CDN you're using doesn't support looking through the package.json of packages. bundlejs will switch to inaccurate guesses for package versions. For package.json support you may wish to use https://unpkg.com or other CDN's that support package.json.`
        ).emit("logger.warn", g);
      }
    let f = i ? "@" + o.version : "", { url: u } = O(`${o.name}${f}${c}`, n);
    return {
      namespace: x,
      path: u.toString(),
      pluginData: { pkg: a }
    };
  }
};
function Ks(e, t, s) {
  let { origin: r } = /:/.test(s?.cdn) ? O(s?.cdn) : O(s?.cdn + ":");
  return s.filesystem, {
    name: st,
    setup(n) {
      n.onResolve({ filter: /.*/ }, Te(r, e)), n.onResolve({ filter: /.*/, namespace: st }, Te(r, e));
    }
  };
}
const x = "http-url", St = async (e, t) => {
  try {
    let s = await fe(e);
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
}, Qs = async (e, t, s, r, n) => {
  const i = /new URL\(['"`](.*)['"`],(?:\s+)?import\.meta\.url(?:\s+)?\)/g, o = new URL("./", e).toString(), c = n.filesystem, a = ke(t), f = Array.from(a.matchAll(i)).map(async ([, u]) => {
    let { content: g, url: m } = await St(ne(o, u), r);
    return c.set(s + ":" + m, t), {
      path: u,
      contents: g,
      get text() {
        return ke(g);
      }
    };
  });
  return await Promise.allSettled(f);
}, vt = (e = U, t) => async (s) => {
  let r = s.path.replace(/\/$/, "/index");
  if (!r.startsWith(".")) {
    if (/^https?:\/\//.test(r))
      return {
        path: r,
        namespace: x,
        pluginData: { pkg: s.pluginData?.pkg }
      };
    let i = new URL(
      ne(s.pluginData?.url ? s.pluginData?.url : e, "../", r)
    ).origin, c = Rt(i) == "npm" ? i : e;
    return ae(r) ? Te(c, t)(s) : {
      path: O(r, c).url.toString(),
      namespace: x,
      pluginData: { pkg: s.pluginData?.pkg }
    };
  }
  return {
    path: ne(s.pluginData?.url, "../", r),
    namespace: x,
    pluginData: { pkg: s.pluginData?.pkg }
  };
};
function er(e, t, s) {
  let { origin: r } = /:/.test(s?.cdn) ? O(s?.cdn) : O(s?.cdn + ":");
  const n = s.filesystem, [i, o] = t, c = i().assets ?? [];
  return {
    name: x,
    setup(a) {
      a.onResolve({ filter: /^https?:\/\// }, (l) => ({
        path: l.path,
        namespace: x
      })), a.onResolve({ filter: /.*/, namespace: x }, vt(r, e)), a.onLoad({ filter: /.*/, namespace: x }, async (l) => {
        let f = ze(l.path), u = (R = "") => f.length > 0 ? l.path : l.path + R, g, m;
        const h = f.length > 0 ? [""] : ["", ".ts", ".tsx", ".js", ".mjs", ".cjs"], d = h.length;
        let p;
        for (let R = 0; R < d; R++) {
          const $ = h[R];
          try {
            ({ content: g, url: m } = await St(u($), e));
            break;
          } catch (E) {
            if (R == 0 && (p = E), R >= d - 1)
              throw e.emit("logger.error", E.toString()), p;
          }
        }
        await n.set(l.namespace + ":" + l.path, g);
        let P = (await Qs(m, g, l.namespace, e, s)).filter((R) => R.status == "rejected" ? (e.emit("logger:warn", `Asset fetch failed.
` + R?.reason?.toString()), !1) : !0).map((R) => {
          if (R.status == "fulfilled")
            return R.value;
        });
        return o({ assets: c.concat(P) }), {
          contents: g,
          loader: At(m),
          pluginData: { url: m, pkg: l.pluginData?.pkg }
        };
      });
    }
  };
}
const rt = "alias-globals", _t = (e, t = {}) => {
  if (!ae(e))
    return !1;
  let s = Object.keys(t), r = e.replace(/^node\:/, ""), n = ce(r);
  return s.find((i) => n.name === i);
}, Ee = (e = {}, t = U, s) => async (r) => {
  let n = r.path.replace(/^node\:/, ""), { path: i } = O(n);
  if (_t(i, e)) {
    let o = ce(i), c = e[o.name];
    return vt(t, s)({
      ...r,
      path: c
    });
  }
}, tr = (e, t, s) => {
  let { origin: r } = /:/.test(s?.cdn) ? O(s?.cdn) : O(s?.cdn + ":"), n = s.alias ?? {};
  return {
    name: rt,
    setup(i) {
      i.onResolve({ filter: /^node\:.*/ }, (o) => _t(o.path, n) ? Ee(n, r, e)(o) : {
        path: o.path,
        namespace: G,
        external: !0
      }), i.onResolve({ filter: /.*/ }, Ee(n, r, e)), i.onResolve({ filter: /.*/, namespace: rt }, Ee(n, r, e));
    }
  };
}, F = /* @__PURE__ */ new Map(), Ot = async (e, t) => {
  let s = e;
  if (t && e.startsWith(".") && (s = Fe(Me(t), e)), F.has(s))
    return s;
  throw `File "${s}" does not exist`;
}, sr = async (e, t = "buffer", s) => {
  let r = await Ot(e, s);
  if (F.has(r)) {
    let n = F.get(r);
    return t == "string" ? ke(n) : n;
  }
}, rr = async (e, t, s) => {
  let r = e;
  s && e.startsWith(".") && (r = Fe(Me(s), e));
  try {
    F.set(r, t instanceof Uint8Array ? t : Ue(t));
  } catch {
    throw `Error occurred while writing to "${r}"`;
  }
}, nt = {
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
function nr(e) {
  return e.replace(/\<br\>/g, `
`).replace(/\&/g, "&amp;").replace(/\"/g, "&quot;").replace(/\'/g, "&#39;").replace(/\</g, "&lt;").replace(/\>/g, "&gt;");
}
class ir {
  constructor() {
    this.result = "", this._stack = [], this._bold = !1, this._underline = !1, this._link = !1;
  }
  text(t) {
    this.result += nr(t);
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
function or(e) {
  e = e.trimEnd();
  let t = 0;
  const s = new ir();
  for (let r of e.matchAll(/\x1B\[([\d;]+)m/g)) {
    const n = r[1];
    s.text(e.slice(t, r.index)), t = r.index + r[0].length, n === "0" ? s.reset() : n === "1" ? s.bold() : n === "4" ? s.underline() : nt[n] && s.color(nt[n]);
  }
  return t < e.length && s.text(e.slice(t)), s.done();
}
const ie = async (e, t = "error", s = !0) => {
  const { formatMessages: r } = await import("./esbuild-893de9eb.mjs").then((i) => i.b);
  return (await r(e, { color: s, kind: t })).map((i) => s ? or(i.replace(/(\s+)(\d+)(\s+)\│/g, `
$1$2$3\u2502`)) : i);
}, lr = {
  entryPoints: ["/index.tsx"],
  cdn: U,
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
    files: F,
    get: sr,
    set: rr,
    resolve: Ot,
    clear: () => F.clear()
  },
  init: {
    platform: le
  }
};
async function Yr(e = {}) {
  Y("initialized") || S.emit("init.loading");
  const t = Ge("build", e), s = es({ assets: [], GLOBAL: [Y, _e] }), [r] = s, { platform: n, ...i } = t.init ?? {}, { build: o } = await ft(n, i), { define: c = {}, loader: a = {}, ...l } = t.esbuild ?? {};
  let f = [], u = [], g;
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
          ...c
        },
        write: !1,
        outdir: "/",
        plugins: [
          tr(S, s, t),
          Ws(S, s, t),
          er(S, s, t),
          Ks(S, s, t),
          Ps(S, s, t)
        ],
        ...l
      });
    } catch (m) {
      if (m.errors) {
        const h = [...await ie(m.errors, "error", !1)], d = [...await ie(m.errors, "error")];
        S.emit("logger.error", h, d);
        const p = (d.length > 1 ? `${d.length} error(s) ` : "") + "(if you are having trouble solving this issue, please create a new issue in the repo, https://github.com/okikio/bundle)";
        return S.emit("logger.error", p);
      } else
        throw m;
    }
    return f = await Promise.all(
      [...r().assets].concat(g?.outputFiles)
    ), u = await Promise.all(
      f?.map(({ path: m, text: h, contents: d }) => /\.map$/.test(m) ? null : (l?.logLevel == "verbose" && (/\.(wasm|png|jpeg|webp)$/.test(m) ? S.emit("logger.log", "Output File: " + m) : S.emit("logger.log", "Output File: " + m + `
` + h)), { path: m, text: h, contents: d }))?.filter((m) => ![void 0, null].includes(m))
    ), {
      contents: u,
      outputs: f,
      ...g
    };
  } catch {
  }
}
const ar = [
  "B",
  "kB",
  "MB",
  "GB",
  "TB",
  "PB",
  "EB",
  "ZB",
  "YB"
], cr = [
  "B",
  "kiB",
  "MiB",
  "GiB",
  "TiB",
  "PiB",
  "EiB",
  "ZiB",
  "YiB"
], fr = [
  "b",
  "kbit",
  "Mbit",
  "Gbit",
  "Tbit",
  "Pbit",
  "Ebit",
  "Zbit",
  "Ybit"
], ur = [
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
  let r = e;
  return typeof t == "string" || Array.isArray(t) ? r = e.toLocaleString(t, s) : (t === !0 || s !== void 0) && (r = e.toLocaleString(void 0, s)), r;
};
function ot(e, t) {
  if (!Number.isFinite(e))
    throw new TypeError(`Expected a finite number, got ${typeof e}: ${e}`);
  t = {
    bits: !1,
    binary: !1,
    ...t
  };
  const s = t.bits ? t.binary ? ur : fr : t.binary ? cr : ar;
  if (t.signed && e === 0)
    return ` 0 ${s[0]}`;
  const r = e < 0, n = r ? "-" : t.signed ? "+" : "";
  r && (e = -e);
  let i;
  if (t.minimumFractionDigits !== void 0 && (i = { minimumFractionDigits: t.minimumFractionDigits }), t.maximumFractionDigits !== void 0 && (i = { maximumFractionDigits: t.maximumFractionDigits, ...i }), e < 1) {
    const l = it(e, t.locale, i);
    return n + l + " " + s[0];
  }
  const o = Math.min(Math.floor(t.binary ? Math.log(e) / Math.log(1024) : Math.log10(e) / 3), s.length - 1);
  e /= (t.binary ? 1024 : 1e3) ** o, i || (e = e.toPrecision(3));
  const c = it(Number(e), t.locale, i), a = s[o];
  return n + c + " " + a;
}
const hr = {
  type: "gzip",
  quality: 9
};
async function Vr(e = [], t = {}) {
  const { type: s, quality: r } = Ge("compress", t), n = e.map((l) => l instanceof Uint8Array ? l : Ue(l)), i = ot(
    n.reduce((l, f) => l + f.byteLength, 0)
  ), o = await (async () => {
    switch (s) {
      case "lz4": {
        const { compress: l, getWASM: f } = await Promise.resolve().then(() => Wr);
        return await f(), async (u) => await l(u);
      }
      case "brotli": {
        const { compress: l, getWASM: f } = await Promise.resolve().then(() => Ir);
        return await f(), async (u) => await l(u, u.length, r);
      }
      default: {
        const { gzip: l, getWASM: f } = await Promise.resolve().then(() => Ur);
        return await f(), async (u) => await l(u, r);
      }
    }
  })(), c = await Promise.all(
    n.map((l) => o(l))
  ), a = ot(
    c.reduce((l, { length: f }) => l + f, 0)
  );
  return {
    type: s,
    content: c,
    totalByteLength: i,
    totalCompressedSize: a,
    initialSize: `${i}`,
    size: `${a} (${s})`
  };
}
const I = (e) => typeof e == "object" && e != null, pr = (e) => typeof e == "object" ? e === null : typeof e != "function", dr = (e) => e !== "__proto__" && e !== "constructor" && e !== "prototype", kt = (e, t) => {
  if (e === t)
    return !0;
  if (I(e) && I(t)) {
    if (Object.keys(e).length !== Object.keys(t).length)
      return !1;
    for (var s in e)
      if (!kt(e[s], t[s]))
        return !1;
    return !0;
  }
}, gr = (e, t) => {
  let s = Object.keys(t), r = {}, n = 0;
  for (; n < s.length; n++) {
    let i = s[n], o = t[i];
    if (i in e) {
      let c = Array.isArray(e[i]) && Array.isArray(o);
      if (e[i] == o)
        continue;
      if (c)
        if (!kt(e[i], o))
          r[i] = o;
        else
          continue;
      else if (I(e[i]) && I(o)) {
        let a = gr(e[i], o);
        Object.keys(a).length && (r[i] = a);
      } else
        r[i] = o;
    } else
      r[i] = o;
  }
  return r;
};
/*!
 * Based on assign-deep <https://github.com/jonschlinkert/assign-deep>
 *
 * Copyright (c) 2017-present, Jon Schlinkert.
 * Released under the MIT License.
 */
function ee(e, ...t) {
  let s = 0;
  for (pr(e) && (e = t[s++]), e || (e = {}); s < t.length; s++)
    if (I(t[s]))
      for (const r of Object.keys(t[s]))
        dr(r) && (I(e[r]) && I(t[s][r]) ? e[r] = ee(Array.isArray(e[r]) ? [] : {}, e[r], t[s][r]) : e[r] = t[s][r]);
  return e;
}
function Ge(e, t) {
  return e == "transform" ? ee({}, mr, t) : e == "compress" ? ee({}, hr, typeof t == "string" ? { type: t } : t) : ee({}, lr, t);
}
const mr = {
  esbuild: {
    target: ["esnext"],
    format: "esm",
    minify: !0,
    treeShaking: !0,
    platform: "browser"
  },
  init: {
    platform: le
  }
};
async function Zr(e, t = {}) {
  Y("initialized") || S.emit("init.loading");
  const s = Ge("transform", t), { platform: r, ...n } = s.init, { transform: i } = await ft(r, n), { define: o = {}, loader: c = {}, ...a } = s.esbuild ?? {};
  let l;
  try {
    try {
      const f = "p.env.NODE_ENV".replace("p.", "process.");
      l = await i(e, {
        define: {
          __NODE__: "false",
          [f]: '"production"',
          ...o
        },
        ...a
      });
    } catch (f) {
      if (f.errors) {
        const u = [...await ie(f.errors, "error", !1)], g = [...await ie(f.errors, "error")];
        S.emit("logger.error", u, g);
        const m = (g.length > 1 ? `${g.length} error(s) ` : "") + "(if you are having trouble solving this issue, please create a new issue in the repo, https://github.com/okikio/bundle)";
        return S.emit("logger.error", m);
      } else
        throw f;
    }
    return l;
  } catch {
  }
}
const Jr = (e, t = 300, s) => {
  let r;
  return function(...n) {
    let i = this, o = () => {
      r = null, s || e.apply(i, n);
    }, c = s && !r;
    clearTimeout(r), r = setTimeout(o, t), c && e.apply(i, n);
  };
}, We = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", Xe = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$", W = {};
function qe(e, t) {
  if (!W[e]) {
    W[e] = {};
    for (let s = 0; s < e.length; s++)
      W[e][e.charAt(s)] = s;
  }
  return W[e][t];
}
function $r(e) {
  if (e == null)
    return "";
  const t = ue(e, 6, (s) => We.charAt(s));
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
function wr(e) {
  return e == null ? "" : e == "" ? null : he(e.length, 32, (t) => qe(We, e.charAt(t)));
}
function Er(e) {
  return e == null ? "" : ue(e, 6, (t) => Xe.charAt(t));
}
function yr(e) {
  return e == null ? "" : e == "" ? null : (e = e.replaceAll(" ", "+"), he(e.length, 32, (t) => qe(Xe, e.charAt(t))));
}
function Ar(e) {
  return ue(e, 16, String.fromCharCode);
}
function Rr(e) {
  return e == null ? "" : e == "" ? null : he(e.length, 32768, (t) => e.charCodeAt(t));
}
function ue(e, t, s) {
  if (e == null)
    return "";
  const r = [], n = {}, i = {};
  let o, c, a, l = "", f = "", u = "", g = 2, m = 3, h = 2, d = 0, p = 0;
  for (c = 0; c < e.length; c += 1)
    if (l = e.charAt(c), Object.prototype.hasOwnProperty.call(n, l) || (n[l] = m++, i[l] = !0), u = f + l, Object.prototype.hasOwnProperty.call(n, u))
      f = u;
    else {
      if (Object.prototype.hasOwnProperty.call(i, f)) {
        if (f.charCodeAt(0) < 256) {
          for (o = 0; o < h; o++)
            d = d << 1, p == t - 1 ? (p = 0, r.push(s(d)), d = 0) : p++;
          for (a = f.charCodeAt(0), o = 0; o < 8; o++)
            d = d << 1 | a & 1, p == t - 1 ? (p = 0, r.push(s(d)), d = 0) : p++, a = a >> 1;
        } else {
          for (a = 1, o = 0; o < h; o++)
            d = d << 1 | a, p == t - 1 ? (p = 0, r.push(s(d)), d = 0) : p++, a = 0;
          for (a = f.charCodeAt(0), o = 0; o < 16; o++)
            d = d << 1 | a & 1, p == t - 1 ? (p = 0, r.push(s(d)), d = 0) : p++, a = a >> 1;
        }
        g--, g == 0 && (g = Math.pow(2, h), h++), delete i[f];
      } else
        for (a = n[f], o = 0; o < h; o++)
          d = d << 1 | a & 1, p == t - 1 ? (p = 0, r.push(s(d)), d = 0) : p++, a = a >> 1;
      g--, g == 0 && (g = Math.pow(2, h), h++), n[u] = m++, f = String(l);
    }
  if (f !== "") {
    if (Object.prototype.hasOwnProperty.call(i, f)) {
      if (f.charCodeAt(0) < 256) {
        for (o = 0; o < h; o++)
          d = d << 1, p == t - 1 ? (p = 0, r.push(s(d)), d = 0) : p++;
        for (a = f.charCodeAt(0), o = 0; o < 8; o++)
          d = d << 1 | a & 1, p == t - 1 ? (p = 0, r.push(s(d)), d = 0) : p++, a = a >> 1;
      } else {
        for (a = 1, o = 0; o < h; o++)
          d = d << 1 | a, p == t - 1 ? (p = 0, r.push(s(d)), d = 0) : p++, a = 0;
        for (a = f.charCodeAt(0), o = 0; o < 16; o++)
          d = d << 1 | a & 1, p == t - 1 ? (p = 0, r.push(s(d)), d = 0) : p++, a = a >> 1;
      }
      g--, g == 0 && (g = Math.pow(2, h), h++), delete i[f];
    } else
      for (a = n[f], o = 0; o < h; o++)
        d = d << 1 | a & 1, p == t - 1 ? (p = 0, r.push(s(d)), d = 0) : p++, a = a >> 1;
    g--, g == 0 && (g = Math.pow(2, h), h++);
  }
  for (a = 2, o = 0; o < h; o++)
    d = d << 1 | a & 1, p == t - 1 ? (p = 0, r.push(s(d)), d = 0) : p++, a = a >> 1;
  for (; ; )
    if (d = d << 1, p == t - 1) {
      r.push(s(d));
      break;
    } else
      p++;
  return r.join("");
}
function he(e, t, s) {
  let r = [], n = 4, i = 4, o = 3, c = "", a = [], l, f, u, g, m, h, d, p = { val: s(0), position: t, index: 1 };
  for (l = 0; l < 3; l += 1)
    r[l] = l;
  for (u = 0, m = Math.pow(2, 2), h = 1; h != m; )
    g = p.val & p.position, p.position >>= 1, p.position == 0 && (p.position = t, p.val = s(p.index++)), u |= (g > 0 ? 1 : 0) * h, h <<= 1;
  switch (u) {
    case 0:
      for (u = 0, m = Math.pow(2, 8), h = 1; h != m; )
        g = p.val & p.position, p.position >>= 1, p.position == 0 && (p.position = t, p.val = s(p.index++)), u |= (g > 0 ? 1 : 0) * h, h <<= 1;
      d = String.fromCharCode(u);
      break;
    case 1:
      for (u = 0, m = Math.pow(2, 16), h = 1; h != m; )
        g = p.val & p.position, p.position >>= 1, p.position == 0 && (p.position = t, p.val = s(p.index++)), u |= (g > 0 ? 1 : 0) * h, h <<= 1;
      d = String.fromCharCode(u);
      break;
    case 2:
      return "";
  }
  for (r[3] = d, f = d, a.push(d); ; ) {
    if (p.index > e)
      return "";
    for (u = 0, m = Math.pow(2, o), h = 1; h != m; )
      g = p.val & p.position, p.position >>= 1, p.position == 0 && (p.position = t, p.val = s(p.index++)), u |= (g > 0 ? 1 : 0) * h, h <<= 1;
    switch (d = u) {
      case 0:
        for (u = 0, m = Math.pow(2, 8), h = 1; h != m; )
          g = p.val & p.position, p.position >>= 1, p.position == 0 && (p.position = t, p.val = s(p.index++)), u |= (g > 0 ? 1 : 0) * h, h <<= 1;
        r[i++] = String.fromCharCode(u), d = i - 1, n--;
        break;
      case 1:
        for (u = 0, m = Math.pow(2, 16), h = 1; h != m; )
          g = p.val & p.position, p.position >>= 1, p.position == 0 && (p.position = t, p.val = s(p.index++)), u |= (g > 0 ? 1 : 0) * h, h <<= 1;
        r[i++] = String.fromCharCode(u), d = i - 1, n--;
        break;
      case 2:
        return a.join("");
    }
    if (n == 0 && (n = Math.pow(2, o), o++), r[d])
      c = r[d];
    else if (d === i && typeof f == "string")
      c = f + f.charAt(0);
    else
      return null;
    a.push(c), r[i++] = f + c.charAt(0), n--, f = c, n == 0 && (n = Math.pow(2, o), o++);
  }
}
const br = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  keyStrBase64: We,
  keyStrUriSafe: Xe,
  baseReverseDic: W,
  getBaseValue: qe,
  compressToBase64: $r,
  decompressFromBase64: wr,
  compressToURL: Er,
  decompressFromURL: yr,
  compress: Ar,
  decompress: Rr,
  _compress: ue,
  _decompress: he
}, Symbol.toStringTag, { value: "Module" })), Sr = "2.0.0", Ne = 256, X = Number.MAX_SAFE_INTEGER || 9007199254740991, te = 16;
let Tt = 0;
const w = (e, t) => ({ index: Tt++, pattern: e, regex: new RegExp(e, t ? "g" : void 0) }), M = "0|[1-9]\\d*", z = "[0-9]+", He = "\\d*[a-zA-Z-][a-zA-Z0-9-]*", xe = `(?:${M}|${He})`, Ce = `(?:${z}|${He})`, Ie = "[0-9A-Za-z-]+", Nt = `(${M})\\.(${M})\\.(${M})`, xt = `(${z})\\.(${z})\\.(${z})`, Z = `(?:\\+(${Ie}(?:\\.${Ie})*))`, Ye = `(?:-(${xe}(?:\\.${xe})*))`, Ve = `(?:-?(${Ce}(?:\\.${Ce})*))`, ye = `v?${Nt}${Ye}?${Z}?`, K = `[v=\\s]*${xt}${Ve}?${Z}?`, se = `${M}|x|X|\\*`, re = `${z}|x|X|\\*`, D = "((?:<|>)?=?)", C = `[v=\\s]*(${se})(?:\\.(${se})(?:\\.(${se})(?:${Ye})?${Z}?)?)?`, j = `[v=\\s]*(${re})(?:\\.(${re})(?:\\.(${re})(?:${Ve})?${Z}?)?)?`, lt = `(^|[^\\d])(\\d{1,${te}})(?:\\.(\\d{1,${te}}))?(?:\\.(\\d{1,${te}}))?(?:$|[^\\d])`, Ae = "(?:~>?)", Re = "(?:\\^)", A = {
  NUMERICIDENTIFIER: w(M),
  NUMERICIDENTIFIERLOOSE: w(z),
  NONNUMERICIDENTIFIER: w(He),
  MAINVERSION: w(Nt),
  MAINVERSIONLOOSE: w(xt),
  PRERELEASEIDENTIFIER: w(xe),
  PRERELEASEIDENTIFIERLOOSE: w(Ce),
  PRERELEASE: w(Ye),
  PRERELEASELOOSE: w(Ve),
  BUILDIDENTIFIER: w(Ie),
  BUILD: w(Z),
  FULLPLAIN: w(ye),
  FULL: w(`^${ye}$`),
  LOOSEPLAIN: w(K),
  LOOSE: w(`^${K}$`),
  GTLT: w(D),
  XRANGEIDENTIFIERLOOSE: w(re),
  XRANGEIDENTIFIER: w(se),
  XRANGEPLAIN: w(C),
  XRANGEPLAINLOOSE: w(j),
  XRANGE: w(`^${D}\\s*${C}$`),
  XRANGELOOSE: w(`^${D}\\s*${j}$`),
  COERCE: w(lt),
  COERCERTL: w(lt, !0),
  LONETILDE: w("(?:~>?)"),
  TILDETRIM: w(`(\\s*)${Ae}\\s+`, !0),
  TILDE: w(`^${Ae}${C}$`),
  TILDELOOSE: w(`^${Ae}${j}$`),
  LONECARET: w("(?:\\^)"),
  CARETTRIM: w(`(\\s*)${Re}\\s+`, !0),
  CARET: w(`^${Re}${C}$`),
  CARETLOOSE: w(`^${Re}${j}$`),
  COMPARATORLOOSE: w(`^${D}\\s*(${K})$|^$`),
  COMPARATOR: w(`^${D}\\s*(${ye})$|^$`),
  COMPARATORTRIM: w(`(\\s*)${D}\\s*(${K}|${C})`, !0),
  HYPHENRANGE: w(`^\\s*(${C})\\s+-\\s+(${C})\\s*$`),
  HYPHENRANGELOOSE: w(`^\\s*(${j})\\s+-\\s+(${j})\\s*$`),
  STAR: w("(<|>)?=?\\s*\\*"),
  GTE0: w("^\\s*>=\\s*0\\.0\\.0\\s*$"),
  GTE0PRE: w("^\\s*>=\\s*0\\.0\\.0-0\\s*$")
}, vr = ["includePrerelease", "loose", "rtl"], pe = (e) => e ? typeof e != "object" ? { loose: !0 } : vr.filter((t) => e[t]).reduce((t, s) => (t[s] = !0, t), {}) : {}, Le = /^[0-9]+$/, q = (e, t) => {
  const s = Le.test(e), r = Le.test(t);
  let n = e, i = t;
  return s && r && (n = +e, i = +t), n === i ? 0 : s && !r ? -1 : r && !s ? 1 : n < i ? -1 : 1;
};
class k {
  constructor(t, s) {
    if (s = pe(s), t instanceof k) {
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
    const r = t.trim().match(s.loose ? A.LOOSE.regex : A.FULL.regex);
    if (!r)
      throw new TypeError(`Invalid Version: ${t}`);
    if (this.raw = t, this.major = +r[1], this.minor = +r[2], this.patch = +r[3], this.major > X || this.major < 0)
      throw new TypeError("Invalid major version");
    if (this.minor > X || this.minor < 0)
      throw new TypeError("Invalid minor version");
    if (this.patch > X || this.patch < 0)
      throw new TypeError("Invalid patch version");
    r[4] ? this.prerelease = r[4].split(".").map((n) => {
      if (/^[0-9]+$/.test(n)) {
        const i = +n;
        if (i >= 0 && i < X)
          return i;
      }
      return n;
    }) : this.prerelease = [], this.build = r[5] ? r[5].split(".") : [], this.format();
  }
  format() {
    return this.version = `${this.major}.${this.minor}.${this.patch}`, this.prerelease.length && (this.version += `-${this.prerelease.join(".")}`), this.version;
  }
  toString() {
    return this.version;
  }
  compare(t) {
    if (!(t instanceof k)) {
      if (typeof t == "string" && t === this.version)
        return 0;
      t = new k(t, this.options);
    }
    return t.version === this.version ? 0 : this.compareMain(t) || this.comparePre(t);
  }
  compareMain(t) {
    return t instanceof k || (t = new k(t, this.options)), q(this.major, t.major) || q(this.minor, t.minor) || q(this.patch, t.patch);
  }
  comparePre(t) {
    if (t instanceof k || (t = new k(t, this.options)), this.prerelease.length && !t.prerelease.length)
      return -1;
    if (!this.prerelease.length && t.prerelease.length)
      return 1;
    if (!this.prerelease.length && !t.prerelease.length)
      return 0;
    let s = 0;
    do {
      const r = this.prerelease[s], n = t.prerelease[s];
      if (r === void 0 && n === void 0)
        return 0;
      if (n === void 0)
        return 1;
      if (r === void 0)
        return -1;
      if (r === n)
        continue;
      return q(r, n);
    } while (++s);
  }
}
const oe = Symbol("SemVer ANY");
class de {
  constructor(t, s) {
    if (s = pe(s), t instanceof de) {
      if (t.loose === !!s.loose)
        return t;
      t = t.value;
    }
    this.options = s, this.loose = !!s.loose, this.parse(t), this.semver === oe ? this.value = "" : this.value = this.operator + this.semver.version;
  }
  parse(t) {
    const s = this.options.loose ? A.COMPARATORLOOSE.regex : A.COMPARATOR.regex, r = t.match(s);
    if (!r)
      throw new TypeError(`Invalid comparator: ${t}`);
    this.operator = r[1] !== void 0 ? r[1] : "", this.operator === "=" && (this.operator = ""), r[2] ? this.semver = new k(r[2], this.options.loose) : this.semver = oe;
  }
  toString() {
    return this.value;
  }
}
const B = /* @__PURE__ */ new Map(), Q = /* @__PURE__ */ new Map(), _r = 1e3, Ct = "$1^", It = "$1~", Lt = "$1$2$3", Pe = (e) => e.value === "<0.0.0-0", Pt = (e) => e.value === "", Dt = (e, t) => (e = zt(e, t), e = jt(e, t), e = Ut(e, t), e = Gt(e), e), v = (e) => !e || e.toLowerCase() === "x" || e === "*", jt = (e, t) => e.trim().split(/\s+/).map((s) => Mt(s, t)).join(" "), Mt = (e, t) => {
  const s = t.loose ? A.TILDELOOSE.regex : A.TILDE.regex;
  return e.replace(s, (r, n, i, o, c) => {
    let a;
    return v(n) ? a = "" : v(i) ? a = `>=${n}.0.0 <${+n + 1}.0.0-0` : v(o) ? a = `>=${n}.${i}.0 <${n}.${+i + 1}.0-0` : c ? a = `>=${n}.${i}.${o}-${c} <${n}.${+i + 1}.0-0` : a = `>=${n}.${i}.${o} <${n}.${+i + 1}.0-0`, a;
  });
}, zt = (e, t) => e.trim().split(/\s+/).map((s) => Ft(s, t)).join(" "), Ft = (e, t) => {
  const s = t.loose ? A.CARETLOOSE.regex : A.CARET.regex, r = t.includePrerelease ? "-0" : "";
  return e.replace(s, (n, i, o, c, a) => {
    let l;
    return v(i) ? l = "" : v(o) ? l = `>=${i}.0.0${r} <${+i + 1}.0.0-0` : v(c) ? i === "0" ? l = `>=${i}.${o}.0${r} <${i}.${+o + 1}.0-0` : l = `>=${i}.${o}.0${r} <${+i + 1}.0.0-0` : a ? i === "0" ? o === "0" ? l = `>=${i}.${o}.${c}-${a} <${i}.${o}.${+c + 1}-0` : l = `>=${i}.${o}.${c}-${a} <${i}.${+o + 1}.0-0` : l = `>=${i}.${o}.${c}-${a} <${+i + 1}.0.0-0` : i === "0" ? o === "0" ? l = `>=${i}.${o}.${c}${r} <${i}.${o}.${+c + 1}-0` : l = `>=${i}.${o}.${c}${r} <${i}.${+o + 1}.0-0` : l = `>=${i}.${o}.${c} <${+i + 1}.0.0-0`, l;
  });
}, Ut = (e, t) => e.split(/\s+/).map((s) => Bt(s, t)).join(" "), Bt = (e, t) => {
  e = e.trim();
  const s = t.loose ? A.XRANGELOOSE.regex : A.XRANGE.regex;
  return e.replace(s, (r, n, i, o, c, a) => {
    const l = v(i), f = l || v(o), u = f || v(c), g = u;
    return n === "=" && g && (n = ""), a = t.includePrerelease ? "-0" : "", l ? n === ">" || n === "<" ? r = "<0.0.0-0" : r = "*" : n && g ? (f && (o = 0), c = 0, n === ">" ? (n = ">=", f ? (i = +i + 1, o = 0, c = 0) : (o = +o + 1, c = 0)) : n === "<=" && (n = "<", f ? i = +i + 1 : o = +o + 1), n === "<" && (a = "-0"), r = `${n + i}.${o}.${c}${a}`) : f ? r = `>=${i}.0.0${a} <${+i + 1}.0.0-0` : u && (r = `>=${i}.${o}.0${a} <${i}.${+o + 1}.0-0`), r;
  });
}, Gt = (e, t) => e.trim().replace(A.STAR.regex, ""), Wt = (e, t) => e.trim().replace(A[t.includePrerelease ? "GTE0PRE" : "GTE0"].regex, ""), Xt = (e) => (t, s, r, n, i, o, c, a, l, f, u, g, m) => (v(r) ? s = "" : v(n) ? s = `>=${r}.0.0${e ? "-0" : ""}` : v(i) ? s = `>=${r}.${n}.0${e ? "-0" : ""}` : o ? s = `>=${s}` : s = `>=${s}${e ? "-0" : ""}`, v(l) ? a = "" : v(f) ? a = `<${+l + 1}.0.0-0` : v(u) ? a = `<${l}.${+f + 1}.0-0` : g ? a = `<=${l}.${f}.${u}-${g}` : e ? a = `<${l}.${f}.${+u + 1}-0` : a = `<=${a}`, `${s} ${a}`.trim()), qt = (e, t, s) => {
  for (let r = 0; r < e.length; r++)
    if (!e[r].test(t))
      return !1;
  if (t.prerelease.length && !s.includePrerelease) {
    for (let r = 0; r < e.length; r++)
      if (e[r].semver !== oe && e[r].semver.prerelease.length > 0) {
        const n = e[r].semver;
        if (n.major === t.major && n.minor === t.minor && n.patch === t.patch)
          return !0;
      }
    return !1;
  }
  return !0;
};
class V {
  constructor(t, s) {
    if (s = pe(s), t instanceof V)
      return t.loose === !!s.loose && t.includePrerelease === !!s.includePrerelease ? t : new V(t.raw, s);
    if (this.options = s, this.loose = !!s.loose, this.includePrerelease = !!s.includePrerelease, this.raw = t, this.set = t.split("||").map((r) => this.parseRange(r.trim())).filter((r) => r.length), !this.set.length)
      throw new TypeError(`Invalid SemVer Range: ${t}`);
    if (this.set.length > 1) {
      const r = this.set[0];
      if (this.set = this.set.filter((n) => !Pe(n[0])), this.set.length === 0)
        this.set = [r];
      else if (this.set.length > 1) {
        for (const n of this.set)
          if (n.length === 1 && Pt(n[0])) {
            this.set = [n];
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
    const r = `parseRange:${Object.keys(this.options).join(",")}:${t}`;
    if (B.has(r))
      return Q.set(r, Date.now()), B.get(r);
    const n = this.options.loose, i = n ? A.HYPHENRANGELOOSE.regex : A.HYPHENRANGE.regex;
    t = t.replace(i, Xt(this.options.includePrerelease)), t = t.replace(A.COMPARATORTRIM.regex, Lt), t = t.replace(A.TILDETRIM.regex, It), t = t.replace(A.CARETTRIM.regex, Ct), t = t.split(/\s+/).join(" ");
    let o = t.split(" ").map((u) => Dt(u, this.options)).join(" ").split(/\s+/).map((u) => Wt(u, this.options));
    n && (o = o.filter((u) => !!u.match(A.COMPARATORLOOSE.regex)));
    const c = /* @__PURE__ */ new Map(), a = o.map((u) => new de(u, this.options));
    for (const u of a) {
      if (Pe(u))
        return [u];
      c.set(u.value, u);
    }
    c.size > 1 && c.has("") && c.delete("");
    const l = [...c.values()];
    let f = l;
    if (B.set(r, f), Q.set(r, Date.now()), B.size >= _r) {
      let g = [...Q.entries()].sort((m, h) => m[1] - h[1])[0][0];
      B.delete(g), Q.delete(g);
    }
    return l;
  }
  test(t) {
    if (!t)
      return !1;
    if (typeof t == "string")
      try {
        t = new k(t, this.options);
      } catch {
        return !1;
      }
    for (let s = 0; s < this.set.length; s++)
      if (qt(this.set[s], t, this.options))
        return !0;
    return !1;
  }
}
function De(e, t, s) {
  let r = null, n = null, i = null;
  try {
    i = new V(t, s);
  } catch {
    return null;
  }
  return e.forEach((o) => {
    i.test(o) && (!r || n.compare(o) === -1) && (r = o, n = new k(r, s));
  }), r;
}
const Kr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SEMVER_SPEC_VERSION: Sr,
  MAX_LENGTH: Ne,
  MAX_SAFE_INTEGER: X,
  MAX_SAFE_COMPONENT_LENGTH: te,
  get R() {
    return Tt;
  },
  createToken: w,
  tokens: A,
  parseOptions: pe,
  numeric: Le,
  compareIdentifiers: q,
  SemVer: k,
  ANY: oe,
  Comparator: de,
  caretTrimReplace: Ct,
  tildeTrimReplace: It,
  comparatorTrimReplace: Lt,
  isNullSet: Pe,
  isAny: Pt,
  parseComparator: Dt,
  isX: v,
  replaceTildes: jt,
  replaceTilde: Mt,
  replaceCarets: zt,
  replaceCaret: Ft,
  replaceXRanges: Ut,
  replaceXRange: Bt,
  replaceStars: Gt,
  replaceGTE0: Wt,
  hyphenReplace: Xt,
  testSet: qt,
  Range: V,
  maxSatisfying: De,
  default: De
}, Symbol.toStringTag, { value: "Module" })), ge = (e) => {
  const t = "https://registry.npmjs.com";
  let { name: s, version: r, path: n } = ce(e), i = `${t}/-/v1/search?text=${encodeURIComponent(s)}&popularity=0.5&size=30`, o = `${t}/${s}/${r}`, c = `${t}/${s}`;
  return { searchURL: i, packageURL: c, packageVersionURL: o, version: r, name: s, path: n };
}, Qr = async (e) => {
  let { searchURL: t } = ge(e), s;
  try {
    s = await (await fe(t, !1)).json();
  } catch (n) {
    throw console.warn(n), n;
  }
  return { packages: s?.objects, info: s };
}, Ht = async (e) => {
  let { packageURL: t } = ge(e);
  try {
    return await (await fe(t, !1)).json();
  } catch (s) {
    throw console.warn(s), s;
  }
}, Or = async (e) => {
  try {
    let t = await Ht(e), s = Object.keys(t.versions), r = t["dist-tags"];
    return { versions: s, tags: r };
  } catch (t) {
    throw console.warn(t), t;
  }
}, kr = async (e) => {
  try {
    let { version: t } = ge(e), s = await Or(e);
    if (s) {
      const { versions: r, tags: n } = s;
      return t in n && (t = n[t]), r.includes(t) ? t : De(r, t);
    }
  } catch (t) {
    throw console.warn(t), t;
  }
}, en = async (e) => {
  try {
    let { name: t } = ge(e), s = await kr(e);
    return await Ht(`${t}@${s}`);
  } catch (t) {
    throw console.warn(t), t;
  }
}, { decompressFromURL: Tr } = br, Nr = (e) => (e ?? "").split(/\],/).map((t) => t.replace(/\[|\]/g, "")), tn = (e) => {
  try {
    const t = e.searchParams;
    let s = "", r = t.get("query") || t.get("q"), n = t.get("treeshake");
    if (r) {
      let c = r.trim().split(","), a = Nr((n ?? "").trim());
      s += `// Click Build for the Bundled, Minified & Compressed package size
` + c.map((l, f) => {
        let u = a[f] && a[f].trim() !== "*" ? a[f].trim().split(",").join(", ") : "*", [
          ,
          ,
          g = "export",
          m
        ] = /^(\((.*)\))?(.*)/.exec(l);
        return `${g} ${u} from ${JSON.stringify(
          m
        )};`;
      }).join(`
`);
    }
    let i = t.get("share");
    i && (s += `
` + Tr(i.trim()));
    let o = t.get("text");
    return o && (s += `
` + JSON.parse(
      /^["']/.test(o) && /["']$/.test(o) ? o : JSON.stringify("" + o).replace(/\\\\/g, "\\")
    )), s.trim();
  } catch {
  }
};
let be;
const Ze = async () => {
  if (be)
    return be;
  const e = await import("./brotli-f636bd85.mjs"), { default: t, source: s } = e;
  return await t(await s()), be = e;
};
async function xr(e, t = 4096, s = 6, r = 22) {
  const { compress: n } = await Ze();
  return n(e, t, s, r);
}
async function Cr(e, t = 4096) {
  const { decompress: s } = await Ze();
  return s(e, t);
}
const Ir = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getWASM: Ze,
  compress: xr,
  decompress: Cr
}, Symbol.toStringTag, { value: "Module" }));
let Yt, Se;
const L = async (e) => {
  if (Se)
    return Se;
  const t = await import("./denoflate-82001750.mjs"), { default: s } = t, { wasm: r } = await import("./gzip-dfcdb483.mjs");
  return Yt = await s(e ?? await r()), Se = t;
};
async function Lr(e, t) {
  return (await L()).deflate(e, t);
}
async function Pr(e) {
  return (await L()).inflate(e);
}
async function Dr(e, t) {
  return (await L()).gzip(e, t);
}
async function jr(e) {
  return (await L()).gunzip(e);
}
async function Mr(e, t) {
  return (await L()).zlib(e, t);
}
async function zr(e) {
  return (await L()).unzlib(e);
}
const Fr = Yt, Ur = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getWASM: L,
  deflate: Lr,
  inflate: Pr,
  gzip: Dr,
  gunzip: jr,
  zlib: Mr,
  unzlib: zr,
  default: Fr
}, Symbol.toStringTag, { value: "Module" }));
let ve;
const Je = async () => {
  if (ve)
    return ve;
  const e = await import("./lz4-54bbf0d3.mjs"), { default: t, source: s } = e;
  return await t(await s()), ve = e;
};
async function Br(e) {
  const { lz4_compress: t } = await Je();
  return t(e);
}
async function Gr(e) {
  const { lz4_decompress: t } = await Je();
  return t(e);
}
const Wr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getWASM: Je,
  compress: Br,
  decompress: Gr
}, Symbol.toStringTag, { value: "Module" }));
function Xr(e) {
  if (typeof e == "string")
    return btoa(e);
  {
    const t = new Uint8Array(e);
    let s = "";
    for (let r = 0; r < t.length; ++r)
      s += String.fromCharCode(t[r]);
    return btoa(s);
  }
}
function qr(e) {
  const t = Vt(e), s = new Uint8Array(t.length);
  for (let r = 0; r < s.length; ++r)
    s[r] = t.charCodeAt(r);
  return s.buffer;
}
function Vt(e) {
  return atob(e);
}
const sn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  encode: Xr,
  decode: qr,
  decodeString: Vt
}, Symbol.toStringTag, { value: "Module" }));
export {
  tr as ALIAS,
  rt as ALIAS_NAMESPACE,
  Ee as ALIAS_RESOLVE,
  ir as AnsiBuffer,
  ur as BIBIT_UNITS,
  cr as BIBYTE_UNITS,
  fr as BIT_UNITS,
  lr as BUILD_CONFIG,
  ar as BYTE_UNITS,
  bt as CACHE,
  Hs as CACHE_NAME,
  Ks as CDN,
  st as CDN_NAMESPACE,
  Te as CDN_RESOLVE,
  hr as COMPRESS_CONFIG,
  U as DEFAULT_CDN_HOST,
  Us as DeprecatedAPIs,
  Ms as EMPTY_EXPORT,
  nt as ESCAPE_TO_COLOR,
  S as EVENTS,
  Qt as EVENTS_OPTS,
  Ws as EXTERNAL,
  G as EXTERNALS_NAMESPACE,
  Bs as ExternalPackages,
  F as FileSystem,
  er as HTTP,
  x as HTTP_NAMESPACE,
  vt as HTTP_RESOLVE,
  we as OPEN_CACHE,
  le as PLATFORM_AUTO,
  Fs as PolyfillKeys,
  zs as PolyfillMap,
  Ls as RESOLVE_EXTENSIONS,
  qs as RE_NON_SCOPED,
  Xs as RE_SCOPED,
  mr as TRANSFORM_CONFIG,
  $e as VIRTUAL_FILESYSTEM_NAMESPACE,
  Ps as VIRTUAL_FS,
  or as ansi,
  _ as bail,
  sn as base64,
  Ir as brotli,
  Yr as build,
  ot as bytes,
  Vr as compress,
  Ge as createConfig,
  ie as createNotice,
  es as createState,
  Jr as debounce,
  ke as decode,
  ee as deepAssign,
  gr as deepDiff,
  kt as deepEqual,
  Ur as denoflate,
  Ue as encode,
  Qs as fetchAssets,
  St as fetchPkg,
  ot as formatBytes,
  Ds as getCDNOrigin,
  Rt as getCDNStyle,
  O as getCDNUrl,
  ts as getEsbuild,
  sr as getFile,
  Ht as getPackage,
  Or as getPackageVersions,
  Qr as getPackages,
  js as getPureImportPath,
  ge as getRegistryURL,
  fe as getRequest,
  en as getResolvedPackage,
  Ot as getResolvedPath,
  Y as getState,
  nr as htmlEscape,
  At as inferLoader,
  ft as init,
  _t as isAlias,
  Gs as isExternal,
  I as isObject,
  pr as isPrimitive,
  dr as isValidKey,
  Zs as legacy,
  T as loop,
  Wr as lz4,
  br as lzstring,
  tt as newRequest,
  Ys as openCache,
  ce as parsePackageName,
  tn as parseShareQuery,
  Nr as parseTreeshakeExports,
  Hr as path,
  ot as prettyBytes,
  or as render,
  Vs as resolveExports,
  Js as resolveImports,
  kr as resolveVersion,
  Kr as semver,
  rr as setFile,
  _e as setState,
  it as toLocaleString,
  Be as toName,
  Zr as transform
};
//# sourceMappingURL=index.mjs.map
