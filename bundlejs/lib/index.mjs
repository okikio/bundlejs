import { s as sr } from "./schema-ce6ce54b.mjs";
const Yt = "0.14.51", nt = (e) => new TextEncoder().encode(e), Se = (e) => new TextDecoder().decode(e), B = "https://unpkg.com", rt = (e) => /^(skypack|esm|esm\.sh|unpkg|jsdelivr|esm\.run)\:?/.test(e) || /^https?:\/\/(cdn\.skypack\.dev|cdn\.esm\.sh|cdn\.jsdelivr\.net\/npm|unpkg\.com)/.test(e) ? "npm" : /^(jsdelivr\.gh|github)\:?/.test(e) || /^https?:\/\/(cdn\.jsdelivr\.net\/gh|raw\.githubusercontent\.com)/.test(e) ? "github" : /^(deno)\:?/.test(e) || /^https?:\/\/(deno\.land\/x)/.test(e) ? "deno" : "other", Zt = (e, t = B) => (/^skypack\:/.test(e) ? t = "https://cdn.skypack.dev" : /^(esm\.sh|esm)\:/.test(e) ? t = "https://cdn.esm.sh" : /^unpkg\:/.test(e) ? t = "https://unpkg.com" : /^(jsdelivr|esm\.run)\:/.test(e) ? t = "https://cdn.jsdelivr.net/npm" : /^(jsdelivr\.gh)\:/.test(e) ? t = "https://cdn.jsdelivr.net/gh" : /^(deno)\:/.test(e) ? t = "https://deno.land/x" : /^(github)\:/.test(e) && (t = "https://raw.githubusercontent.com"), /\/$/.test(t) ? t : `${t}/`), Vt = (e) => e.replace(/^(skypack|esm|esm\.sh|unpkg|jsdelivr|jsdelivr\.gh|esm\.run|deno|github)\:/, "").replace(/^https?:\/\/(cdn\.skypack\.dev|cdn\.esm\.sh|cdn\.jsdelivr\.net\/npm|unpkg\.com|cdn\.jsdelivr\.net\/gh|raw\.githubusercontent\.com|deno\.land\/x)/, "").replace(/^\//, ""), T = (e, t = B) => {
  let s = Zt(e, t), n = Vt(e), r = new URL(n, s);
  return { import: e, path: n, origin: s, cdn: t, url: r };
}, W = "external-globals", Jt = nt("export default {}"), Kt = {
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
}, Qt = Object.keys(Kt), es = ["v8/tools/codemap", "v8/tools/consarray", "v8/tools/csvparser", "v8/tools/logreader", "v8/tools/profile_view", "v8/tools/profile", "v8/tools/SourceMap", "v8/tools/splaytree", "v8/tools/tickprocessor-driver", "v8/tools/tickprocessor", "node-inspect/lib/_inspect", "node-inspect/lib/internal/inspect_client ", "node-inspect/lib/internal/inspect_repl", "_linklist", "_stream_wrap"], ts = ["chokidar", "yargs", "fsevents", "worker_threads", "async_hooks", "diagnostics_channel", "http2", "inspector", "perf_hooks", "trace_events", "wasi", ...es, ...Qt], ss = (e, t = []) => [...ts, ...t].find((s) => !!(s === e || e.startsWith(`${s}/`))), ns = (e, t, s) => {
  const { external: n = [] } = s?.esbuild ?? {};
  return {
    name: W,
    setup(r) {
      r.onResolve({ filter: /.*/ }, (i) => {
        let l = i.path.replace(/^node\:/, ""), { path: o } = T(l);
        if (ss(o, n))
          return {
            path: o,
            namespace: W,
            external: !0
          };
      }), r.onLoad({ filter: /.*/, namespace: W }, (i) => ({
        pluginName: W,
        contents: Jt,
        warnings: [{
          text: `${i.path} is marked as an external module and will be ignored.`,
          details: `"${i.path}" is a built-in node module thus can't be bundled by https://bundlejs.com, sorry about that.`
        }]
      }));
    }
  };
}, it = /* @__PURE__ */ new Map(), rs = "EXTERNAL_FETCHES", He = async (e, t, s) => {
  let n = await fetch(t, s), r = n.clone();
  return "caches" in globalThis ? e.put(t, r) : it.set(t, r), n;
};
let de;
const is = async () => de || (de = await caches.open(rs)), le = async (e, t = !1, s) => {
  let n = new Request(e.toString()), r, i, l;
  return "caches" in globalThis ? (i = await is(), l = await i.match(n)) : l = it.get(n), r = l, l ? t || He(i, n, s) : r = await He(i, n, s), r.clone();
}, Y = 46, E = 47, lt = "/", ot = /\/+/;
function N(e) {
  if (typeof e != "string")
    throw new TypeError(
      `Path must be a string. Received ${JSON.stringify(e)}`
    );
}
function at(e) {
  return e === E;
}
function ct(e, t, s, n) {
  let r = "", i = 0, l = -1, o = 0, a;
  for (let c = 0, h = e.length; c <= h; ++c) {
    if (c < h)
      a = e.charCodeAt(c);
    else {
      if (n(a))
        break;
      a = E;
    }
    if (n(a)) {
      if (!(l === c - 1 || o === 1))
        if (l !== c - 1 && o === 2) {
          if (r.length < 2 || i !== 2 || r.charCodeAt(r.length - 1) !== Y || r.charCodeAt(r.length - 2) !== Y) {
            if (r.length > 2) {
              const u = r.lastIndexOf(s);
              u === -1 ? (r = "", i = 0) : (r = r.slice(0, u), i = r.length - 1 - r.lastIndexOf(s)), l = c, o = 0;
              continue;
            } else if (r.length === 2 || r.length === 1) {
              r = "", i = 0, l = c, o = 0;
              continue;
            }
          }
          t && (r.length > 0 ? r += `${s}..` : r = "..", i = 2);
        } else
          r.length > 0 ? r += s + e.slice(l + 1, c) : r = e.slice(l + 1, c), i = c - l - 1;
      l = c, o = 0;
    } else
      a === Y && o !== -1 ? ++o : o = -1;
  }
  return r;
}
function ls(e, t) {
  const s = t.dir || t.root, n = t.base || (t.name || "") + (t.ext || "");
  return s ? s === t.root ? s + n : s + e + n : n;
}
const os = {
  "	": "%09",
  "\n": "%0A",
  "\v": "%0B",
  "\f": "%0C",
  "\r": "%0D",
  " ": "%20"
};
function ft(e) {
  return e.replaceAll(/[\s]/g, (t) => os[t] ?? t);
}
const as = "/", cs = ":";
function be(...e) {
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
    N(r), r.length !== 0 && (t = `${r}/${t}`, s = r.charCodeAt(0) === E);
  }
  return t = ct(
    t,
    !s,
    "/",
    at
  ), s ? t.length > 0 ? `/${t}` : "/" : t.length > 0 ? t : ".";
}
function ut(e) {
  if (N(e), e.length === 0)
    return ".";
  const t = e.charCodeAt(0) === E, s = e.charCodeAt(e.length - 1) === E;
  return e = ct(e, !t, "/", at), e.length === 0 && !t && (e = "."), e.length > 0 && s && (e += "/"), t ? `/${e}` : e;
}
function ht(e) {
  return N(e), e.length > 0 && e.charCodeAt(0) === E;
}
function fs(...e) {
  if (e.length === 0)
    return ".";
  let t;
  for (let s = 0, n = e.length; s < n; ++s) {
    const r = e[s];
    N(r), r.length > 0 && (t ? t += `/${r}` : t = r);
  }
  return t ? ut(t) : ".";
}
function us(e, t) {
  if (N(e), N(t), e === t || (e = be(e), t = be(t), e === t))
    return "";
  let s = 1;
  const n = e.length;
  for (; s < n && e.charCodeAt(s) === E; ++s)
    ;
  const r = n - s;
  let i = 1;
  const l = t.length;
  for (; i < l && t.charCodeAt(i) === E; ++i)
    ;
  const o = l - i, a = r < o ? r : o;
  let c = -1, h = 0;
  for (; h <= a; ++h) {
    if (h === a) {
      if (o > a) {
        if (t.charCodeAt(i + h) === E)
          return t.slice(i + h + 1);
        if (h === 0)
          return t.slice(i + h);
      } else
        r > a && (e.charCodeAt(s + h) === E ? c = h : h === 0 && (c = 0));
      break;
    }
    const g = e.charCodeAt(s + h), $ = t.charCodeAt(i + h);
    if (g !== $)
      break;
    g === E && (c = h);
  }
  let u = "";
  for (h = s + c + 1; h <= n; ++h)
    (h === n || e.charCodeAt(h) === E) && (u.length === 0 ? u += ".." : u += "/..");
  return u.length > 0 ? u + t.slice(i + c) : (i += c, t.charCodeAt(i) === E && ++i, t.slice(i));
}
function hs(e) {
  return e;
}
function ps(e) {
  if (N(e), e.length === 0)
    return ".";
  const t = e.charCodeAt(0) === E;
  let s = -1, n = !0;
  for (let r = e.length - 1; r >= 1; --r)
    if (e.charCodeAt(r) === E) {
      if (!n) {
        s = r;
        break;
      }
    } else
      n = !1;
  return s === -1 ? t ? "/" : "." : t && s === 1 ? "//" : e.slice(0, s);
}
function ds(e, t = "") {
  if (t !== void 0 && typeof t != "string")
    throw new TypeError('"ext" argument must be a string');
  N(e);
  let s = 0, n = -1, r = !0, i;
  if (t !== void 0 && t.length > 0 && t.length <= e.length) {
    if (t.length === e.length && t === e)
      return "";
    let l = t.length - 1, o = -1;
    for (i = e.length - 1; i >= 0; --i) {
      const a = e.charCodeAt(i);
      if (a === E) {
        if (!r) {
          s = i + 1;
          break;
        }
      } else
        o === -1 && (r = !1, o = i + 1), l >= 0 && (a === t.charCodeAt(l) ? --l === -1 && (n = i) : (l = -1, n = o));
    }
    return s === n ? n = o : n === -1 && (n = e.length), e.slice(s, n);
  } else {
    for (i = e.length - 1; i >= 0; --i)
      if (e.charCodeAt(i) === E) {
        if (!r) {
          s = i + 1;
          break;
        }
      } else
        n === -1 && (r = !1, n = i + 1);
    return n === -1 ? "" : e.slice(s, n);
  }
}
function gs(e) {
  N(e);
  let t = -1, s = 0, n = -1, r = !0, i = 0;
  for (let l = e.length - 1; l >= 0; --l) {
    const o = e.charCodeAt(l);
    if (o === E) {
      if (!r) {
        s = l + 1;
        break;
      }
      continue;
    }
    n === -1 && (r = !1, n = l + 1), o === Y ? t === -1 ? t = l : i !== 1 && (i = 1) : t !== -1 && (i = -1);
  }
  return t === -1 || n === -1 || i === 0 || i === 1 && t === n - 1 && t === s + 1 ? "" : e.slice(t, n);
}
function ms(e) {
  if (e === null || typeof e != "object")
    throw new TypeError(
      `The "pathObject" argument must be of type Object. Received type ${typeof e}`
    );
  return ls("/", e);
}
function $s(e) {
  N(e);
  const t = { root: "", dir: "", base: "", ext: "", name: "" };
  if (e.length === 0)
    return t;
  const s = e.charCodeAt(0) === E;
  let n;
  s ? (t.root = "/", n = 1) : n = 0;
  let r = -1, i = 0, l = -1, o = !0, a = e.length - 1, c = 0;
  for (; a >= n; --a) {
    const h = e.charCodeAt(a);
    if (h === E) {
      if (!o) {
        i = a + 1;
        break;
      }
      continue;
    }
    l === -1 && (o = !1, l = a + 1), h === Y ? r === -1 ? r = a : c !== 1 && (c = 1) : r !== -1 && (c = -1);
  }
  return r === -1 || l === -1 || c === 0 || c === 1 && r === l - 1 && r === i + 1 ? l !== -1 && (i === 0 && s ? t.base = t.name = e.slice(1, l) : t.base = t.name = e.slice(i, l)) : (i === 0 && s ? (t.name = e.slice(1, r), t.base = e.slice(1, l)) : (t.name = e.slice(i, r), t.base = e.slice(i, l)), t.ext = e.slice(r, l)), i > 0 ? t.dir = e.slice(0, i - 1) : s && (t.dir = "/"), t;
}
function ws(e) {
  if (e = e instanceof URL ? e : new URL(e), e.protocol != "file:")
    throw new TypeError("Must be a file URL.");
  return decodeURIComponent(
    e.pathname.replace(/%(?![0-9A-Fa-f]{2})/g, "%25")
  );
}
function Es(e) {
  if (!ht(e))
    throw new TypeError("Must be an absolute path.");
  const t = new URL("file:///");
  return t.pathname = ft(
    e.replace(/%/g, "%25").replace(/\\/g, "%5C")
  ), t;
}
const Le = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  sep: as,
  delimiter: cs,
  resolve: be,
  normalize: ut,
  isAbsolute: ht,
  join: fs,
  relative: us,
  toNamespacedPath: hs,
  dirname: ps,
  basename: ds,
  extname: gs,
  format: ms,
  parse: $s,
  fromFileUrl: ws,
  toFileUrl: Es
}, Symbol.toStringTag, { value: "Module" })), ys = Le, { join: As, normalize: Ye } = ys, ge = [
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
], Rs = ["-", "\\", "]"];
function vs(e, {
  extended: t = !0,
  globstar: s = !0,
  os: n = "linux",
  caseInsensitive: r = !1
} = {}) {
  if (e == "")
    return /(?!)/;
  const i = n == "windows" ? "(?:\\\\|/)+" : "/+", l = n == "windows" ? "(?:\\\\|/)*" : "/*", o = n == "windows" ? ["\\", "/"] : ["/"], a = n == "windows" ? "(?:[^\\\\/]*(?:\\\\|/|$)+)*" : "(?:[^/]*(?:/|$)+)*", c = n == "windows" ? "[^\\\\/]*" : "[^/]*", h = n == "windows" ? "`" : "\\";
  let u = e.length;
  for (; u > 1 && o.includes(e[u - 1]); u--)
    ;
  e = e.slice(0, u);
  let g = "";
  for (let $ = 0; $ < e.length; ) {
    let p = "";
    const d = [];
    let f = !1, D = !1, P = !1, m = $;
    for (; m < e.length && !o.includes(e[m]); m++) {
      if (D) {
        D = !1, p += (f ? Rs : ge).includes(e[m]) ? `\\${e[m]}` : e[m];
        continue;
      }
      if (e[m] == h) {
        D = !0;
        continue;
      }
      if (e[m] == "[")
        if (f) {
          if (e[m + 1] == ":") {
            let A = m + 1, R = "";
            for (; e[A + 1] != null && e[A + 1] != ":"; )
              R += e[A + 1], A++;
            if (e[A + 1] == ":" && e[A + 2] == "]") {
              m = A + 2, R == "alnum" ? p += "\\dA-Za-z" : R == "alpha" ? p += "A-Za-z" : R == "ascii" ? p += "\0-\x7F" : R == "blank" ? p += "	 " : R == "cntrl" ? p += "\0-\x7F" : R == "digit" ? p += "\\d" : R == "graph" ? p += "!-~" : R == "lower" ? p += "a-z" : R == "print" ? p += " -~" : R == "punct" ? p += `!"#$%&'()*+,\\-./:;<=>?@[\\\\\\]^_\u2018{|}~` : R == "space" ? p += "\\s\v" : R == "upper" ? p += "A-Z" : R == "word" ? p += "\\w" : R == "xdigit" && (p += "\\dA-Fa-f");
              continue;
            }
          }
        } else {
          f = !0, p += "[", e[m + 1] == "!" ? (m++, p += "^") : e[m + 1] == "^" && (m++, p += "\\^");
          continue;
        }
      if (e[m] == "]" && f) {
        f = !1, p += "]";
        continue;
      }
      if (f) {
        e[m] == "\\" ? p += "\\\\" : p += e[m];
        continue;
      }
      if (e[m] == ")" && d.length > 0 && d[d.length - 1] != "BRACE") {
        p += ")";
        const A = d.pop();
        A == "!" ? p += c : A != "@" && (p += A);
        continue;
      }
      if (e[m] == "|" && d.length > 0 && d[d.length - 1] != "BRACE") {
        p += "|";
        continue;
      }
      if (e[m] == "+" && t && e[m + 1] == "(") {
        m++, d.push("+"), p += "(?:";
        continue;
      }
      if (e[m] == "@" && t && e[m + 1] == "(") {
        m++, d.push("@"), p += "(?:";
        continue;
      }
      if (e[m] == "?") {
        t && e[m + 1] == "(" ? (m++, d.push("?"), p += "(?:") : p += ".";
        continue;
      }
      if (e[m] == "!" && t && e[m + 1] == "(") {
        m++, d.push("!"), p += "(?!";
        continue;
      }
      if (e[m] == "{") {
        d.push("BRACE"), p += "(?:";
        continue;
      }
      if (e[m] == "}" && d[d.length - 1] == "BRACE") {
        d.pop(), p += ")";
        continue;
      }
      if (e[m] == "," && d[d.length - 1] == "BRACE") {
        p += "|";
        continue;
      }
      if (e[m] == "*") {
        if (t && e[m + 1] == "(")
          m++, d.push("*"), p += "(?:";
        else {
          const A = e[m - 1];
          let R = 1;
          for (; e[m + 1] == "*"; )
            m++, R++;
          const Ht = e[m + 1];
          s && R == 2 && [...o, void 0].includes(A) && [...o, void 0].includes(Ht) ? (p += a, P = !0) : p += c;
        }
        continue;
      }
      p += ge.includes(e[m]) ? `\\${e[m]}` : e[m];
    }
    if (d.length > 0 || f || D) {
      p = "";
      for (const A of e.slice($, m))
        p += ge.includes(A) ? `\\${A}` : A, P = !1;
    }
    for (g += p, P || (g += m < e.length ? i : l, P = !0); o.includes(e[m]); )
      m++;
    if (!(m > $))
      throw new Error("Assertion failure: i > j (potential infinite loop)");
    $ = m;
  }
  return g = `^${g}$`, new RegExp(g, r ? "i" : "");
}
function Ss(e) {
  const t = { "{": "}", "(": ")", "[": "]" }, s = /\\(.)|(^!|\*|\?|[\].+)]\?|\[[^\\\]]+\]|\{[^\\}]+\}|\(\?[:!=][^\\)]+\)|\([^|]+\|[^\\)]+\))/;
  if (e === "")
    return !1;
  let n;
  for (; n = s.exec(e); ) {
    if (n[2])
      return !0;
    let r = n.index + n[0].length;
    const i = n[1], l = i ? t[i] : null;
    if (i && l) {
      const o = e.indexOf(l, r);
      o !== -1 && (r = o + 1);
    }
    e = e.slice(r);
  }
  return !1;
}
function pt(e, { globstar: t = !1 } = {}) {
  if (e.match(/\0/g))
    throw new Error(`Glob contains invalid characters: "${e}"`);
  if (!t)
    return Ye(e);
  const s = ot.source, n = new RegExp(
    `(?<=(${s}|^)\\*\\*${s})\\.\\.(?=${s}|$)`,
    "g"
  );
  return Ye(e.replace(n, "\0")).replace(/\0/g, "..");
}
function bs(e, { extended: t = !0, globstar: s = !1 } = {}) {
  if (!s || e.length == 0)
    return As(...e);
  if (e.length === 0)
    return ".";
  let n;
  for (const r of e) {
    const i = r;
    i.length > 0 && (n ? n += `${lt}${i}` : n = i);
  }
  return n ? pt(n, { extended: t, globstar: s }) : ".";
}
const Ts = Le, ks = Le, {
  basename: _s,
  delimiter: Os,
  dirname: Ce,
  extname: De,
  format: Ns,
  fromFileUrl: xs,
  isAbsolute: dt,
  join: gt,
  normalize: Ps,
  parse: Is,
  relative: Ls,
  resolve: je,
  sep: Cs,
  toFileUrl: Ds,
  toNamespacedPath: js
} = Ts, re = (e, ...t) => {
  const s = new URL(e);
  return s.pathname = ft(
    gt(s.pathname, ...t).replace(/%/g, "%25").replace(/\\/g, "%5C")
  ), s.toString();
}, oe = (e) => /^(?!\.).*/.test(e) && !dt(e), Wn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  urlJoin: re,
  isBareImport: oe,
  SEP: lt,
  SEP_PATTERN: ot,
  globToRegExp: vs,
  isGlob: Ss,
  normalizeGlob: pt,
  joinGlobs: bs,
  posix: ks,
  basename: _s,
  delimiter: Os,
  dirname: Ce,
  extname: De,
  format: Ns,
  fromFileUrl: xs,
  isAbsolute: dt,
  join: gt,
  normalize: Ps,
  parse: Is,
  relative: Ls,
  resolve: je,
  sep: Cs,
  toFileUrl: Ds,
  toNamespacedPath: js
}, Symbol.toStringTag, { value: "Module" })), Ms = [".tsx", ".ts", ".jsx", ".js", ".css", ".json"], mt = (e) => {
  const t = De(e);
  return Ms.includes(t) ? (/\.js(x)?$/.test(t) ? t.replace(/^\.js/, ".ts") : t).slice(1) : t === ".mjs" || t === ".cjs" || t === ".mts" || t === ".cts" ? "ts" : t == ".scss" ? "css" : t == ".png" || t == ".jpeg" || t == ".ttf" ? "dataurl" : t == ".svg" || t == ".html" || t == ".txt" ? "text" : t == ".wasm" ? "file" : t.length ? "text" : "ts";
};
function O(e, t) {
  if (typeof e == "string")
    return e;
  if (e) {
    let s, n;
    if (Array.isArray(e)) {
      for (s = 0; s < e.length; s++)
        if (n = O(e[s], t))
          return n;
    } else
      for (s in e)
        if (t.has(s))
          return O(e[s], t);
  }
}
function b(e, t, s) {
  throw new Error(
    s ? `No known conditions for "${t}" entry in "${e}" package` : `Missing "${t}" export in "${e}" package`
  );
}
function Me(e, t) {
  return t === e ? "." : t[0] === "." ? t : t.replace(new RegExp("^" + e + "/"), "./");
}
function zs(e, t = ".", s = {}) {
  let { name: n, exports: r } = e;
  if (r) {
    let { browser: i, require: l, unsafe: o, conditions: a = [] } = s, c = Me(n, t);
    if (c[0] !== "." && (c = "./" + c), typeof r == "string")
      return c === "." ? r : b(n, c);
    let h = /* @__PURE__ */ new Set(["default", ...a]);
    o || h.add(l ? "require" : "import"), o || h.add(i ? "browser" : "node");
    let u, g, $ = !1;
    for (u in r) {
      $ = u[0] !== ".";
      break;
    }
    if ($)
      return c === "." ? O(r, h) || b(n, c, 1) : b(n, c);
    if (g = r[c])
      return O(g, h) || b(n, c, 1);
    for (u in r) {
      if (g = u[u.length - 1], g === "/" && c.startsWith(u))
        return (g = O(r[u], h)) ? g + c.substring(u.length) : b(n, c, 1);
      if (g === "*" && c.startsWith(u.slice(0, -1)) && c.substring(u.length - 1).length > 0)
        return (g = O(r[u], h)) ? g.replace("*", c.substring(u.length - 1)) : b(n, c, 1);
    }
    return b(n, c);
  }
}
function Us(e, t = {}) {
  let s = 0, n, r = t.browser, i = t.fields || ["module", "main"];
  for (r && !i.includes("browser") && i.unshift("browser"); s < i.length; s++)
    if (n = e[i[s]]) {
      if (typeof n != "string")
        if (typeof n == "object" && i[s] == "browser") {
          if (typeof r == "string" && (n = n[r = Me(e.name, r)], n == null))
            return r;
        } else
          continue;
      return typeof n == "string" ? "./" + n.replace(/^\.?\//, "") : n;
    }
}
const Fs = /^(@[^\/]+\/[^@\/]+)(?:@([^\/]+))?(\/.*)?$/, Bs = /^([^@\/]+)(?:@([^\/]+))?(\/.*)?$/;
function ae(e) {
  const t = Fs.exec(e) || Bs.exec(e);
  if (!t)
    throw new Error(`[parse-package-name] invalid package name: ${e}`);
  return {
    name: t[1] || "",
    version: t[2] || "latest",
    path: t[3] || ""
  };
}
function Gs(e, t = ".", s = {}) {
  let { name: n, imports: r } = e;
  if (r) {
    let { browser: i, require: l, unsafe: o, conditions: a = [] } = s, c = Me(n, t);
    if (typeof r == "string")
      return c === "#" ? r : b(n, c);
    let h = /* @__PURE__ */ new Set(["default", ...a]);
    o || h.add(l ? "require" : "import"), o || h.add(i ? "browser" : "node");
    let u, g, $ = !1;
    for (u in r) {
      $ = u[0] !== "#";
      break;
    }
    if ($)
      return c === "#" ? O(r, h) || b(n, c, 1) : b(n, c);
    if (g = r[c])
      return O(g, h) || b(n, c, 1);
    for (u in r) {
      if (g = u[u.length - 1], g === "/" && c.startsWith(u))
        return (g = O(r[u], h)) ? g + c.substring(u.length) : b(n, c, 1);
      if (g === "*" && c.startsWith(u.slice(0, -1)) && c.substring(u.length - 1).length > 0)
        return (g = O(r[u], h)) ? g.replace("*", c.substring(u.length - 1)) : b(n, c, 1);
    }
    return b(n, c);
  }
}
const Ze = "cdn-url", Te = (e = B, t) => async (s) => {
  if (oe(s.path)) {
    let { path: n, origin: r } = T(s.path, e), i = rt(r) == "npm", l = ae(n), o = l.path, a = s.pluginData?.pkg ?? {};
    if (n[0] == "#") {
      let g = Gs({ ...a, exports: a.imports }, n, {
        require: s.kind === "require-call" || s.kind === "require-resolve"
      });
      if (typeof g == "string") {
        o = g.replace(/^\.?\/?/, "/"), o && o[0] !== "/" && (o = `/${o}`);
        let $ = i ? "@" + a.version : "", { url: { href: p } } = T(`${a.name}${$}${o}`);
        return {
          namespace: x,
          path: p,
          pluginData: { pkg: a }
        };
      }
    }
    if (("dependencies" in a || "devDependencies" in a || "peerDependencies" in a) && !/\S+@\S+/.test(n)) {
      let {
        devDependencies: g = {},
        dependencies: $ = {},
        peerDependencies: p = {}
      } = a, d = Object.assign({}, g, p, $);
      Object.keys(d).includes(n) && (l.version = d[n]);
    }
    if (i)
      try {
        let { url: g } = T(`${l.name}@${l.version}/package.json`, r);
        a = await le(g, !0).then((p) => p.json());
        let $ = zs(a, o ? "." + o.replace(/^\.?\/?/, "/") : ".", {
          require: s.kind === "require-call" || s.kind === "require-resolve"
        }) || Us(a);
        typeof $ == "string" && (o = $.replace(/^\.?\/?/, "/").replace(/\.js\.js$/, ".js")), o && o[0] !== "/" && (o = `/${o}`);
      } catch (g) {
        t.emit(
          "logger.warn",
          `You may want to change CDNs. The current CDN ${/unpkg\.com/.test(r) ? `path "${r}${n}" may not` : `"${r}" doesn't`} support package.json files.
There is a chance the CDN you're using doesn't support looking through the package.json of packages. bundlejs will switch to inaccurate guesses for package versions. For package.json support you may wish to use https://unpkg.com or other CDN's that support package.json.`
        ).emit("logger.warn", g);
      }
    let h = i ? "@" + l.version : "", { url: u } = T(`${l.name}${h}${o}`, r);
    return {
      namespace: x,
      path: u.toString(),
      pluginData: { pkg: a }
    };
  }
}, Ws = (e, t, s) => {
  let { origin: n } = /:/.test(s?.cdn) ? T(s?.cdn) : T(s?.cdn + ":");
  return s.filesystem, {
    name: Ze,
    setup(r) {
      r.onResolve({ filter: /.*/ }, Te(n, e)), r.onResolve({ filter: /.*/, namespace: Ze }, Te(n, e));
    }
  };
}, x = "http-url", $t = async (e, t) => {
  try {
    let s = await le(e);
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
}, Xs = async (e, t, s, n, r) => {
  const i = /new URL\(['"`](.*)['"`],(?:\s+)?import\.meta\.url(?:\s+)?\)/g, l = new URL("./", e).toString(), o = r.filesystem, a = Se(t), h = Array.from(a.matchAll(i)).map(async ([, u]) => {
    let { content: g, url: $ } = await $t(re(l, u), n);
    return o.set(s + ":" + $, t), {
      path: u,
      contents: g,
      get text() {
        return Se(g);
      }
    };
  });
  return await Promise.allSettled(h);
}, wt = (e = B, t) => async (s) => {
  let n = s.path.replace(/\/$/, "/index");
  if (!n.startsWith(".")) {
    if (/^https?:\/\//.test(n))
      return {
        path: n,
        namespace: x,
        pluginData: { pkg: s.pluginData?.pkg }
      };
    let i = new URL(
      re(s.pluginData?.url ? s.pluginData?.url : e, "../", n)
    ).origin, o = rt(i) == "npm" ? i : e;
    return oe(n) ? Te(o, t)(s) : {
      path: T(n, o).url.toString(),
      namespace: x,
      pluginData: { pkg: s.pluginData?.pkg }
    };
  }
  return {
    path: re(s.pluginData?.url, "../", n),
    namespace: x,
    pluginData: { pkg: s.pluginData?.pkg }
  };
}, qs = (e, t, s) => {
  let { origin: n } = /:/.test(s?.cdn) ? T(s?.cdn) : T(s?.cdn + ":");
  const r = s.filesystem, i = t.assets ?? [];
  return {
    name: x,
    setup(l) {
      l.onResolve({ filter: /^https?:\/\// }, (o) => ({
        path: o.path,
        namespace: x
      })), l.onResolve({ filter: /.*/, namespace: x }, wt(n, e)), l.onLoad({ filter: /.*/, namespace: x }, async (o) => {
        let a = De(o.path), c = (f = "") => a.length > 0 ? o.path : o.path + f, h, u;
        const g = a.length > 0 ? [""] : ["", ".ts", ".tsx", ".js", ".mjs", ".cjs"], $ = g.length;
        let p;
        for (let f = 0; f < $; f++) {
          const D = g[f];
          try {
            ({ content: h, url: u } = await $t(c(D), e));
            break;
          } catch (P) {
            if (f == 0 && (p = P), f >= $ - 1)
              throw e.emit("logger.error", P.toString()), p;
          }
        }
        await r.set(o.namespace + ":" + o.path, h);
        let d = (await Xs(u, h, o.namespace, e, s)).filter((f) => f.status == "rejected" ? (e.emit("logger:warn", `Asset fetch failed.
` + f?.reason?.toString()), !1) : !0).map((f) => {
          if (f.status == "fulfilled")
            return f.value;
        });
        return t.assets = i.concat(d), {
          contents: h,
          loader: mt(u),
          pluginData: { url: u, pkg: o.pluginData?.pkg }
        };
      });
    }
  };
}, Ve = "alias-globals", Et = (e, t = {}) => {
  if (!oe(e))
    return !1;
  let s = Object.keys(t), n = e.replace(/^node\:/, ""), r = ae(n);
  return s.find((i) => r.name === i);
}, me = (e = {}, t = B, s) => async (n) => {
  let r = n.path.replace(/^node\:/, ""), { path: i } = T(r);
  if (Et(i, e)) {
    let l = ae(i), o = e[l.name];
    return wt(t, s)({
      ...n,
      path: o
    });
  }
}, Hs = (e, t, s) => {
  let { origin: n } = /:/.test(s?.cdn) ? T(s?.cdn) : T(s?.cdn + ":"), r = s.alias ?? {};
  return {
    name: Ve,
    setup(i) {
      i.onResolve({ filter: /^node\:.*/ }, (l) => Et(l.path, r) ? me(r, n, e)(l) : {
        path: l.path,
        namespace: W,
        external: !0
      }), i.onResolve({ filter: /.*/ }, me(r, n, e)), i.onResolve({ filter: /.*/, namespace: Ve }, me(r, n, e));
    }
  };
}, $e = "virtual-filesystem", Ys = (e, t, s) => {
  const n = s.filesystem;
  return {
    name: $e,
    setup(r) {
      r.onResolve({ filter: /.*/ }, (i) => ({
        path: i.path,
        pluginData: i.pluginData ?? {},
        namespace: $e
      })), r.onLoad({ filter: /.*/, namespace: $e }, async (i) => {
        let l = await n.resolve(i.path, i?.pluginData?.importer);
        return {
          contents: await n.get(i.path, "buffer", i?.pluginData?.importer),
          pluginData: {
            importer: l
          },
          loader: mt(l)
        };
      });
    }
  };
}, Zs = "Deno" in globalThis ? "deno" : "process" in globalThis ? "node" : "browser", F = /* @__PURE__ */ new Map(), yt = async (e, t) => {
  let s = e;
  if (t && e.startsWith(".") && (s = je(Ce(t), e)), F.has(s))
    return s;
  throw `File "${s}" does not exist`;
}, Vs = async (e, t = "buffer", s) => {
  let n = await yt(e, s);
  if (F.has(n)) {
    let r = F.get(n);
    return t == "string" ? Se(r) : r;
  }
}, Js = async (e, t, s) => {
  let n = e;
  s && e.startsWith(".") && (n = je(Ce(s), e));
  try {
    F.set(n, t instanceof Uint8Array ? t : nt(t));
  } catch {
    throw `Error occurred while writing to "${n}"`;
  }
}, L = (e) => typeof e == "object" && e != null, Ks = (e) => typeof e == "object" ? e === null : typeof e != "function", Qs = (e) => e !== "__proto__" && e !== "constructor" && e !== "prototype", At = (e, t) => {
  if (e === t)
    return !0;
  if (L(e) && L(t)) {
    if (Object.keys(e).length !== Object.keys(t).length)
      return !1;
    for (var s in e)
      if (!At(e[s], t[s]))
        return !1;
    return !0;
  }
}, en = (e, t) => {
  let s = Object.keys(t), n = {}, r = 0;
  for (; r < s.length; r++) {
    let i = s[r], l = t[i];
    if (i in e) {
      let o = Array.isArray(e[i]) && Array.isArray(l);
      if (e[i] == l)
        continue;
      if (o)
        if (!At(e[i], l))
          n[i] = l;
        else
          continue;
      else if (L(e[i]) && L(l)) {
        let a = en(e[i], l);
        Object.keys(a).length && (n[i] = a);
      } else
        n[i] = l;
    } else
      n[i] = l;
  }
  return n;
};
/*!
 * Based on assign-deep <https://github.com/jonschlinkert/assign-deep>
 *
 * Copyright (c) 2017-present, Jon Schlinkert.
 * Released under the MIT License.
 */
const V = (e, ...t) => {
  let s = 0;
  for (Ks(e) && (e = t[s++]), e || (e = {}); s < t.length; s++)
    if (L(t[s]))
      for (const n of Object.keys(t[s]))
        Qs(n) && (L(e[n]) && L(t[s][n]) ? e[n] = V(Array.isArray(e[n]) ? [] : {}, e[n], t[s][n]) : e[n] = t[s][n]);
  return e;
}, Rt = {
  entryPoints: ["/index.tsx"],
  cdn: B,
  compression: "gzip",
  esbuild: {
    target: ["esnext"],
    format: "esm",
    bundle: !0,
    minify: !0,
    treeShaking: !0,
    platform: "browser"
  }
}, vt = V({}, Rt, {
  esbuild: {
    color: !0,
    globalName: "BundledCode",
    logLevel: "info",
    sourcemap: !1,
    incremental: !1
  },
  ascii: "ascii",
  filesystem: {
    files: F,
    get: Vs,
    set: Js,
    resolve: yt,
    clear: () => F.clear()
  },
  init: {
    platform: Zs
  }
});
var St = class {
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
}, tn = (e, t, ...s) => {
  e.forEach((n) => {
    n[t](...s);
  });
}, Je = ({ callback: e = () => {
}, scope: t = null, name: s = "event" }) => ({ callback: e, scope: t, name: s }), K = class extends St {
  constructor(e = "event") {
    super(), this.name = e;
  }
}, sn = class extends St {
  constructor() {
    super();
  }
  getEvent(e) {
    let t = this.get(e);
    return t instanceof K ? t : (this.set(e, new K(e)), this.get(e));
  }
  newListener(e, t, s) {
    let n = this.getEvent(e);
    return n.add(Je({ name: e, callback: t, scope: s })), n;
  }
  on(e, t, s) {
    if (typeof e > "u" || e == null)
      return this;
    typeof e == "string" && (e = e.trim().split(/\s/g));
    let n, r, i = typeof e == "object" && !Array.isArray(e), l = i ? t : s;
    return i || (r = t), Object.keys(e).forEach((o) => {
      n = i ? o : e[o], i && (r = e[o]), this.newListener(n, r, l);
    }, this), this;
  }
  removeListener(e, t, s) {
    let n = this.get(e);
    if (n instanceof K && t) {
      let r = Je({ name: e, callback: t, scope: s });
      n.forEach((i, l) => {
        if (i.callback === r.callback && i.scope === r.scope)
          return n.remove(l);
      });
    }
    return n;
  }
  off(e, t, s) {
    if (typeof e > "u" || e == null)
      return this;
    typeof e == "string" && (e = e.trim().split(/\s/g));
    let n, r, i = typeof e == "object" && !Array.isArray(e), l = i ? t : s;
    return i || (r = t), Object.keys(e).forEach((o) => {
      n = i ? o : e[o], i && (r = e[o]), typeof r == "function" ? this.removeListener(n, r, l) : this.remove(n);
    }, this), this;
  }
  once(e, t, s) {
    if (typeof e > "u" || e == null)
      return this;
    typeof e == "string" && (e = e.trim().split(/\s/g));
    let n = typeof e == "object" && !Array.isArray(e);
    return Object.keys(e).forEach((r) => {
      let i = n ? r : e[r], l = n ? e[r] : t, o = n ? t : s, a = (...c) => {
        l.apply(o, c), this.removeListener(i, a, o);
      };
      this.newListener(i, a, o);
    }, this), this;
  }
  emit(e, ...t) {
    return typeof e > "u" || e == null ? this : (typeof e == "string" && (e = e.trim().split(/\s/g)), e.forEach((s) => {
      let n = this.get(s);
      n instanceof K && n.forEach((r) => {
        let { callback: i, scope: l } = r;
        i.apply(l, t);
      });
    }, this), this);
  }
  clear() {
    return tn(this, "clear"), super.clear(), this;
  }
};
const nn = {
  "init.start": console.log,
  "init.complete": console.info,
  "init.error": console.error,
  "init.loading": console.warn,
  "logger.log": console.log,
  "logger.error": console.error,
  "logger.warn": console.warn,
  "logger.info": console.info
}, S = new sn();
S.on(nn);
const k = {
  initialized: !1,
  assets: [],
  esbuild: null
}, rn = [
  "B",
  "kB",
  "MB",
  "GB",
  "TB",
  "PB",
  "EB",
  "ZB",
  "YB"
], ln = [
  "B",
  "kiB",
  "MiB",
  "GiB",
  "TiB",
  "PiB",
  "EiB",
  "ZiB",
  "YiB"
], on = [
  "b",
  "kbit",
  "Mbit",
  "Gbit",
  "Tbit",
  "Pbit",
  "Ebit",
  "Zbit",
  "Ybit"
], an = [
  "b",
  "kibit",
  "Mibit",
  "Gibit",
  "Tibit",
  "Pibit",
  "Eibit",
  "Zibit",
  "Yibit"
], Ke = (e, t, s) => {
  let n = e;
  return typeof t == "string" || Array.isArray(t) ? n = e.toLocaleString(t, s) : (t === !0 || s !== void 0) && (n = e.toLocaleString(void 0, s)), n;
};
function Qe(e, t) {
  if (!Number.isFinite(e))
    throw new TypeError(`Expected a finite number, got ${typeof e}: ${e}`);
  t = {
    bits: !1,
    binary: !1,
    ...t
  };
  const s = t.bits ? t.binary ? an : on : t.binary ? ln : rn;
  if (t.signed && e === 0)
    return ` 0 ${s[0]}`;
  const n = e < 0, r = n ? "-" : t.signed ? "+" : "";
  n && (e = -e);
  let i;
  if (t.minimumFractionDigits !== void 0 && (i = { minimumFractionDigits: t.minimumFractionDigits }), t.maximumFractionDigits !== void 0 && (i = { maximumFractionDigits: t.maximumFractionDigits, ...i }), e < 1) {
    const c = Ke(e, t.locale, i);
    return r + c + " " + s[0];
  }
  const l = Math.min(Math.floor(t.binary ? Math.log(e) / Math.log(1024) : Math.log10(e) / 3), s.length - 1);
  e /= (t.binary ? 1024 : 1e3) ** l, i || (e = e.toPrecision(3));
  const o = Ke(Number(e), t.locale, i), a = s[l];
  return r + o + " " + a;
}
const et = {
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
function cn(e) {
  return e.replace(/\<br\>/g, `
`).replace(/\&/g, "&amp;").replace(/\"/g, "&quot;").replace(/\'/g, "&#39;").replace(/\</g, "&lt;").replace(/\>/g, "&gt;");
}
class fn {
  constructor() {
    this.result = "", this._stack = [], this._bold = !1, this._underline = !1, this._link = !1;
  }
  text(t) {
    this.result += cn(t);
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
function un(e) {
  e = e.trimEnd();
  let t = 0;
  const s = new fn();
  for (let n of e.matchAll(/\x1B\[([\d;]+)m/g)) {
    const r = n[1];
    s.text(e.slice(t, n.index)), t = n.index + n[0].length, r === "0" ? s.reset() : r === "1" ? s.bold() : r === "4" ? s.underline() : et[r] && s.color(et[r]);
  }
  return t < e.length && s.text(e.slice(t)), s.done();
}
const tt = async (e, t = "error", s = !0) => {
  const { formatMessages: n } = await import("./esbuild-62f66476.mjs").then((i) => i.b);
  return (await n(e, { color: s, kind: t })).map((i) => s ? un(i.replace(/(\s+)(\d+)(\s+)\│/g, `
$1$2$3\u2502`)) : i);
}, Xn = {
  build: pn,
  init: bt
};
async function hn(e = "node") {
  try {
    switch (e) {
      case "node":
        return await import("esbuild");
      case "deno":
        return await import(
          /* @vite-ignore */
          `https://deno.land/x/esbuild@v${Yt}/mod.js`
        );
      default:
        return await import("./esbuild-62f66476.mjs").then((t) => t.b);
    }
  } catch (t) {
    throw t;
  }
}
async function bt({ platform: e, ...t } = {}) {
  try {
    if (!k.initialized) {
      if (k.initialized = !0, S.emit("init.start"), k.esbuild = await hn(e), e !== "node" && e !== "deno") {
        const { default: s } = await import("./esbuild-wasm-52ab7d86.mjs");
        await k.esbuild.initialize({
          wasmModule: new WebAssembly.Module(await s()),
          ...t
        });
      }
      S.emit("init.complete");
    }
    return k.esbuild;
  } catch (s) {
    S.emit("init.error", s), console.error(s);
  }
}
async function pn(e = {}) {
  k.initialized || S.emit("init.loading");
  const t = V({}, vt, e), { build: s } = await bt(t.init), { define: n = {}, loader: r = {}, ...i } = t.esbuild ?? {};
  let l = [], o = [], a;
  try {
    try {
      const c = "p.env.NODE_ENV".replace("p.", "process.");
      a = await s({
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
          [c]: '"production"',
          ...n
        },
        write: !1,
        outdir: "/",
        plugins: [
          Hs(S, k, t),
          ns(S, k, t),
          qs(S, k, t),
          Ws(S, k, t),
          Ys(S, k, t)
        ],
        ...i
      });
    } catch (c) {
      if (c.errors) {
        const h = [...await tt(c.errors, "error", !1)], u = [...await tt(c.errors, "error")];
        S.emit("logger.error", h, u);
        const g = (u.length > 1 ? `${u.length} error(s) ` : "") + "(if you are having trouble solving this issue, please create a new issue in the repo, https://github.com/okikio/bundle)";
        return S.emit("logger.error", g);
      } else
        throw c;
    }
    return l = await Promise.all(
      [...k.assets].concat(a?.outputFiles)
    ), o = await Promise.all(
      l?.map(({ path: c, text: h, contents: u }) => /\.map$/.test(c) ? null : (i?.logLevel == "verbose" && (/\.(wasm|png|jpeg|webp)$/.test(c) ? S.emit("logger.log", "Output File: " + c) : S.emit("logger.log", "Output File: " + c + `
` + h)), { path: c, text: h, contents: u }))?.filter((c) => ![void 0, null].includes(c))
    ), {
      contents: o,
      outputs: l,
      ...a
    };
  } catch {
  }
}
async function qn(e = [], t = {}) {
  const s = V({}, vt, t);
  let { compression: n = {} } = s, { type: r = "gzip", quality: i = 9 } = typeof n == "string" ? { type: n } : n ?? {},  l = (
    e.reduce((h, { contents: u }) => h + u.byteLength, 0)
  ), o = await (async () => {
    switch (r) {
      case "lz4":
        const { compress: h, getWASM: u } = await Promise.resolve().then(() => Fn);
        return await u(), async (f) => await h(f);
      case "brotli":
        const { compress: g, getWASM: $ } = await Promise.resolve().then(() => Nn);
        return await $(), async (f) => await g(f, f.length, i);
      default:
        const { gzip: p, getWASM: d } = await Promise.resolve().then(() => Mn);
        return await d(), async (f) => await p(f, i);
    }
  })(), a = await Promise.all(
    e.map(({ contents: h }) => o(h))
  ), c = (
    a.reduce((h, { length: u }) => h + u, 0)
  );
  return {
    type: r,
    content: a,
    totalInitialSize: l,
    totalCompressedSize: c,
    initialSize: `${Qe(l)}`,
    size: `${Qe(c)} (${r})`
  };
}
const Hn = (e, t = 300, s) => {
  let n;
  return function(...r) {
    let i = this, l = () => {
      n = null, s || e.apply(i, r);
    }, o = s && !n;
    clearTimeout(n), n = setTimeout(l, t), o && e.apply(i, r);
  };
}, ze = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", Ue = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$", X = {};
function Fe(e, t) {
  if (!X[e]) {
    X[e] = {};
    for (let s = 0; s < e.length; s++)
      X[e][e.charAt(s)] = s;
  }
  return X[e][t];
}
function dn(e) {
  if (e == null)
    return "";
  const t = ce(e, 6, (s) => ze.charAt(s));
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
function gn(e) {
  return e == null ? "" : e == "" ? null : fe(e.length, 32, (t) => Fe(ze, e.charAt(t)));
}
function mn(e) {
  return e == null ? "" : ce(e, 6, (t) => Ue.charAt(t));
}
function $n(e) {
  return e == null ? "" : e == "" ? null : (e = e.replaceAll(" ", "+"), fe(e.length, 32, (t) => Fe(Ue, e.charAt(t))));
}
function wn(e) {
  return ce(e, 16, String.fromCharCode);
}
function En(e) {
  return e == null ? "" : e == "" ? null : fe(e.length, 32768, (t) => e.charCodeAt(t));
}
function ce(e, t, s) {
  if (e == null)
    return "";
  const n = [], r = {}, i = {};
  let l, o, a, c = "", h = "", u = "", g = 2, $ = 3, p = 2, d = 0, f = 0;
  for (o = 0; o < e.length; o += 1)
    if (c = e.charAt(o), Object.prototype.hasOwnProperty.call(r, c) || (r[c] = $++, i[c] = !0), u = h + c, Object.prototype.hasOwnProperty.call(r, u))
      h = u;
    else {
      if (Object.prototype.hasOwnProperty.call(i, h)) {
        if (h.charCodeAt(0) < 256) {
          for (l = 0; l < p; l++)
            d = d << 1, f == t - 1 ? (f = 0, n.push(s(d)), d = 0) : f++;
          for (a = h.charCodeAt(0), l = 0; l < 8; l++)
            d = d << 1 | a & 1, f == t - 1 ? (f = 0, n.push(s(d)), d = 0) : f++, a = a >> 1;
        } else {
          for (a = 1, l = 0; l < p; l++)
            d = d << 1 | a, f == t - 1 ? (f = 0, n.push(s(d)), d = 0) : f++, a = 0;
          for (a = h.charCodeAt(0), l = 0; l < 16; l++)
            d = d << 1 | a & 1, f == t - 1 ? (f = 0, n.push(s(d)), d = 0) : f++, a = a >> 1;
        }
        g--, g == 0 && (g = Math.pow(2, p), p++), delete i[h];
      } else
        for (a = r[h], l = 0; l < p; l++)
          d = d << 1 | a & 1, f == t - 1 ? (f = 0, n.push(s(d)), d = 0) : f++, a = a >> 1;
      g--, g == 0 && (g = Math.pow(2, p), p++), r[u] = $++, h = String(c);
    }
  if (h !== "") {
    if (Object.prototype.hasOwnProperty.call(i, h)) {
      if (h.charCodeAt(0) < 256) {
        for (l = 0; l < p; l++)
          d = d << 1, f == t - 1 ? (f = 0, n.push(s(d)), d = 0) : f++;
        for (a = h.charCodeAt(0), l = 0; l < 8; l++)
          d = d << 1 | a & 1, f == t - 1 ? (f = 0, n.push(s(d)), d = 0) : f++, a = a >> 1;
      } else {
        for (a = 1, l = 0; l < p; l++)
          d = d << 1 | a, f == t - 1 ? (f = 0, n.push(s(d)), d = 0) : f++, a = 0;
        for (a = h.charCodeAt(0), l = 0; l < 16; l++)
          d = d << 1 | a & 1, f == t - 1 ? (f = 0, n.push(s(d)), d = 0) : f++, a = a >> 1;
      }
      g--, g == 0 && (g = Math.pow(2, p), p++), delete i[h];
    } else
      for (a = r[h], l = 0; l < p; l++)
        d = d << 1 | a & 1, f == t - 1 ? (f = 0, n.push(s(d)), d = 0) : f++, a = a >> 1;
    g--, g == 0 && (g = Math.pow(2, p), p++);
  }
  for (a = 2, l = 0; l < p; l++)
    d = d << 1 | a & 1, f == t - 1 ? (f = 0, n.push(s(d)), d = 0) : f++, a = a >> 1;
  for (; ; )
    if (d = d << 1, f == t - 1) {
      n.push(s(d));
      break;
    } else
      f++;
  return n.join("");
}
function fe(e, t, s) {
  let n = [], r = 4, i = 4, l = 3, o = "", a = [], c, h, u, g, $, p, d, f = { val: s(0), position: t, index: 1 };
  for (c = 0; c < 3; c += 1)
    n[c] = c;
  for (u = 0, $ = Math.pow(2, 2), p = 1; p != $; )
    g = f.val & f.position, f.position >>= 1, f.position == 0 && (f.position = t, f.val = s(f.index++)), u |= (g > 0 ? 1 : 0) * p, p <<= 1;
  switch (u) {
    case 0:
      for (u = 0, $ = Math.pow(2, 8), p = 1; p != $; )
        g = f.val & f.position, f.position >>= 1, f.position == 0 && (f.position = t, f.val = s(f.index++)), u |= (g > 0 ? 1 : 0) * p, p <<= 1;
      d = String.fromCharCode(u);
      break;
    case 1:
      for (u = 0, $ = Math.pow(2, 16), p = 1; p != $; )
        g = f.val & f.position, f.position >>= 1, f.position == 0 && (f.position = t, f.val = s(f.index++)), u |= (g > 0 ? 1 : 0) * p, p <<= 1;
      d = String.fromCharCode(u);
      break;
    case 2:
      return "";
  }
  for (n[3] = d, h = d, a.push(d); ; ) {
    if (f.index > e)
      return "";
    for (u = 0, $ = Math.pow(2, l), p = 1; p != $; )
      g = f.val & f.position, f.position >>= 1, f.position == 0 && (f.position = t, f.val = s(f.index++)), u |= (g > 0 ? 1 : 0) * p, p <<= 1;
    switch (d = u) {
      case 0:
        for (u = 0, $ = Math.pow(2, 8), p = 1; p != $; )
          g = f.val & f.position, f.position >>= 1, f.position == 0 && (f.position = t, f.val = s(f.index++)), u |= (g > 0 ? 1 : 0) * p, p <<= 1;
        n[i++] = String.fromCharCode(u), d = i - 1, r--;
        break;
      case 1:
        for (u = 0, $ = Math.pow(2, 16), p = 1; p != $; )
          g = f.val & f.position, f.position >>= 1, f.position == 0 && (f.position = t, f.val = s(f.index++)), u |= (g > 0 ? 1 : 0) * p, p <<= 1;
        n[i++] = String.fromCharCode(u), d = i - 1, r--;
        break;
      case 2:
        return a.join("");
    }
    if (r == 0 && (r = Math.pow(2, l), l++), n[d])
      o = n[d];
    else if (d === i && typeof h == "string")
      o = h + h.charAt(0);
    else
      return null;
    a.push(o), n[i++] = h + o.charAt(0), r--, h = o, r == 0 && (r = Math.pow(2, l), l++);
  }
}
const yn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  keyStrBase64: ze,
  keyStrUriSafe: Ue,
  baseReverseDic: X,
  getBaseValue: Fe,
  compressToBase64: dn,
  decompressFromBase64: gn,
  compressToURL: mn,
  decompressFromURL: $n,
  compress: wn,
  decompress: En,
  _compress: ce,
  _decompress: fe
}, Symbol.toStringTag, { value: "Module" })), { decompressFromURL: An } = yn, Rn = (e) => (e ?? "").split(/\],/).map((t) => t.replace(/\[|\]/g, "")), Yn = (e) => {
  try {
    const t = e.searchParams;
    let s = "", n = t.get("query") || t.get("q"), r = t.get("treeshake");
    if (n) {
      let o = n.trim().split(","), a = Rn((r ?? "").trim());
      s += `// Click Build for the Bundled, Minified & Compressed package size
` + o.map((c, h) => {
        let u = a[h] && a[h].trim() !== "*" ? a[h].trim().split(",").join(", ") : "*", [
          ,
          ,
          g = "export",
          $
        ] = /^(\((.*)\))?(.*)/.exec(c);
        return `${g} ${u} from ${JSON.stringify(
          $
        )};`;
      }).join(`
`);
    }
    let i = t.get("share");
    i && (s += `
` + An(i.trim()));
    let l = t.get("text");
    return l && (s += `
` + JSON.parse(
      /^["']/.test(l) && /["']$/.test(l) ? l : JSON.stringify("" + l).replace(/\\\\/g, "\\")
    )), s.trim();
  } catch {
  }
}, Zn = (e) => {
  try {
    const s = e.searchParams.get("config") ?? "{}";
    return V({}, Rt, JSON.parse(s || "{}"));
  } catch {
  }
}, vn = "2.0.0", ke = 256, q = Number.MAX_SAFE_INTEGER || 9007199254740991, te = 16;
let Tt = 0;
const w = (e, t) => ({ index: Tt++, pattern: e, regex: new RegExp(e, t ? "g" : void 0) }), z = "0|[1-9]\\d*", U = "[0-9]+", Be = "\\d*[a-zA-Z-][a-zA-Z0-9-]*", _e = `(?:${z}|${Be})`, Oe = `(?:${U}|${Be})`, Ne = "[0-9A-Za-z-]+", kt = `(${z})\\.(${z})\\.(${z})`, _t = `(${U})\\.(${U})\\.(${U})`, J = `(?:\\+(${Ne}(?:\\.${Ne})*))`, Ge = `(?:-(${_e}(?:\\.${_e})*))`, We = `(?:-?(${Oe}(?:\\.${Oe})*))`, we = `v?${kt}${Ge}?${J}?`, Q = `[v=\\s]*${_t}${We}?${J}?`, se = `${z}|x|X|\\*`, ne = `${U}|x|X|\\*`, j = "((?:<|>)?=?)", I = `[v=\\s]*(${se})(?:\\.(${se})(?:\\.(${se})(?:${Ge})?${J}?)?)?`, M = `[v=\\s]*(${ne})(?:\\.(${ne})(?:\\.(${ne})(?:${We})?${J}?)?)?`, st = `(^|[^\\d])(\\d{1,${te}})(?:\\.(\\d{1,${te}}))?(?:\\.(\\d{1,${te}}))?(?:$|[^\\d])`, Ee = "(?:~>?)", ye = "(?:\\^)", y = {
  NUMERICIDENTIFIER: w(z),
  NUMERICIDENTIFIERLOOSE: w(U),
  NONNUMERICIDENTIFIER: w(Be),
  MAINVERSION: w(kt),
  MAINVERSIONLOOSE: w(_t),
  PRERELEASEIDENTIFIER: w(_e),
  PRERELEASEIDENTIFIERLOOSE: w(Oe),
  PRERELEASE: w(Ge),
  PRERELEASELOOSE: w(We),
  BUILDIDENTIFIER: w(Ne),
  BUILD: w(J),
  FULLPLAIN: w(we),
  FULL: w(`^${we}$`),
  LOOSEPLAIN: w(Q),
  LOOSE: w(`^${Q}$`),
  GTLT: w(j),
  XRANGEIDENTIFIERLOOSE: w(ne),
  XRANGEIDENTIFIER: w(se),
  XRANGEPLAIN: w(I),
  XRANGEPLAINLOOSE: w(M),
  XRANGE: w(`^${j}\\s*${I}$`),
  XRANGELOOSE: w(`^${j}\\s*${M}$`),
  COERCE: w(st),
  COERCERTL: w(st, !0),
  LONETILDE: w("(?:~>?)"),
  TILDETRIM: w(`(\\s*)${Ee}\\s+`, !0),
  TILDE: w(`^${Ee}${I}$`),
  TILDELOOSE: w(`^${Ee}${M}$`),
  LONECARET: w("(?:\\^)"),
  CARETTRIM: w(`(\\s*)${ye}\\s+`, !0),
  CARET: w(`^${ye}${I}$`),
  CARETLOOSE: w(`^${ye}${M}$`),
  COMPARATORLOOSE: w(`^${j}\\s*(${Q})$|^$`),
  COMPARATOR: w(`^${j}\\s*(${we})$|^$`),
  COMPARATORTRIM: w(`(\\s*)${j}\\s*(${Q}|${I})`, !0),
  HYPHENRANGE: w(`^\\s*(${I})\\s+-\\s+(${I})\\s*$`),
  HYPHENRANGELOOSE: w(`^\\s*(${M})\\s+-\\s+(${M})\\s*$`),
  STAR: w("(<|>)?=?\\s*\\*"),
  GTE0: w("^\\s*>=\\s*0\\.0\\.0\\s*$"),
  GTE0PRE: w("^\\s*>=\\s*0\\.0\\.0-0\\s*$")
}, Sn = ["includePrerelease", "loose", "rtl"], ue = (e) => e ? typeof e != "object" ? { loose: !0 } : Sn.filter((t) => e[t]).reduce((t, s) => (t[s] = !0, t), {}) : {}, xe = /^[0-9]+$/, H = (e, t) => {
  const s = xe.test(e), n = xe.test(t);
  let r = e, i = t;
  return s && n && (r = +e, i = +t), r === i ? 0 : s && !n ? -1 : n && !s ? 1 : r < i ? -1 : 1;
};
class _ {
  constructor(t, s) {
    if (s = ue(s), t instanceof _) {
      if (t.loose === !!s.loose && t.includePrerelease === !!s.includePrerelease)
        return t;
      t = t.version;
    } else if (typeof t != "string")
      throw new TypeError(`Invalid Version: ${t}`);
    if (t.length > ke)
      throw new TypeError(
        `version is longer than ${ke} characters`
      );
    this.options = s, this.loose = !!s.loose, this.includePrerelease = !!s.includePrerelease;
    const n = t.trim().match(s.loose ? y.LOOSE.regex : y.FULL.regex);
    if (!n)
      throw new TypeError(`Invalid Version: ${t}`);
    if (this.raw = t, this.major = +n[1], this.minor = +n[2], this.patch = +n[3], this.major > q || this.major < 0)
      throw new TypeError("Invalid major version");
    if (this.minor > q || this.minor < 0)
      throw new TypeError("Invalid minor version");
    if (this.patch > q || this.patch < 0)
      throw new TypeError("Invalid patch version");
    n[4] ? this.prerelease = n[4].split(".").map((r) => {
      if (/^[0-9]+$/.test(r)) {
        const i = +r;
        if (i >= 0 && i < q)
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
    if (!(t instanceof _)) {
      if (typeof t == "string" && t === this.version)
        return 0;
      t = new _(t, this.options);
    }
    return t.version === this.version ? 0 : this.compareMain(t) || this.comparePre(t);
  }
  compareMain(t) {
    return t instanceof _ || (t = new _(t, this.options)), H(this.major, t.major) || H(this.minor, t.minor) || H(this.patch, t.patch);
  }
  comparePre(t) {
    if (t instanceof _ || (t = new _(t, this.options)), this.prerelease.length && !t.prerelease.length)
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
const ie = Symbol("SemVer ANY");
class he {
  constructor(t, s) {
    if (s = ue(s), t instanceof he) {
      if (t.loose === !!s.loose)
        return t;
      t = t.value;
    }
    this.options = s, this.loose = !!s.loose, this.parse(t), this.semver === ie ? this.value = "" : this.value = this.operator + this.semver.version;
  }
  parse(t) {
    const s = this.options.loose ? y.COMPARATORLOOSE.regex : y.COMPARATOR.regex, n = t.match(s);
    if (!n)
      throw new TypeError(`Invalid comparator: ${t}`);
    this.operator = n[1] !== void 0 ? n[1] : "", this.operator === "=" && (this.operator = ""), n[2] ? this.semver = new _(n[2], this.options.loose) : this.semver = ie;
  }
  toString() {
    return this.value;
  }
}
const G = /* @__PURE__ */ new Map(), ee = /* @__PURE__ */ new Map(), bn = 1e3, Ot = "$1^", Nt = "$1~", xt = "$1$2$3", Pe = (e) => e.value === "<0.0.0-0", Pt = (e) => e.value === "", It = (e, t) => (e = Dt(e, t), e = Lt(e, t), e = Mt(e, t), e = Ut(e), e), v = (e) => !e || e.toLowerCase() === "x" || e === "*", Lt = (e, t) => e.trim().split(/\s+/).map((s) => Ct(s, t)).join(" "), Ct = (e, t) => {
  const s = t.loose ? y.TILDELOOSE.regex : y.TILDE.regex;
  return e.replace(s, (n, r, i, l, o) => {
    let a;
    return v(r) ? a = "" : v(i) ? a = `>=${r}.0.0 <${+r + 1}.0.0-0` : v(l) ? a = `>=${r}.${i}.0 <${r}.${+i + 1}.0-0` : o ? a = `>=${r}.${i}.${l}-${o} <${r}.${+i + 1}.0-0` : a = `>=${r}.${i}.${l} <${r}.${+i + 1}.0-0`, a;
  });
}, Dt = (e, t) => e.trim().split(/\s+/).map((s) => jt(s, t)).join(" "), jt = (e, t) => {
  const s = t.loose ? y.CARETLOOSE.regex : y.CARET.regex, n = t.includePrerelease ? "-0" : "";
  return e.replace(s, (r, i, l, o, a) => {
    let c;
    return v(i) ? c = "" : v(l) ? c = `>=${i}.0.0${n} <${+i + 1}.0.0-0` : v(o) ? i === "0" ? c = `>=${i}.${l}.0${n} <${i}.${+l + 1}.0-0` : c = `>=${i}.${l}.0${n} <${+i + 1}.0.0-0` : a ? i === "0" ? l === "0" ? c = `>=${i}.${l}.${o}-${a} <${i}.${l}.${+o + 1}-0` : c = `>=${i}.${l}.${o}-${a} <${i}.${+l + 1}.0-0` : c = `>=${i}.${l}.${o}-${a} <${+i + 1}.0.0-0` : i === "0" ? l === "0" ? c = `>=${i}.${l}.${o}${n} <${i}.${l}.${+o + 1}-0` : c = `>=${i}.${l}.${o}${n} <${i}.${+l + 1}.0-0` : c = `>=${i}.${l}.${o} <${+i + 1}.0.0-0`, c;
  });
}, Mt = (e, t) => e.split(/\s+/).map((s) => zt(s, t)).join(" "), zt = (e, t) => {
  e = e.trim();
  const s = t.loose ? y.XRANGELOOSE.regex : y.XRANGE.regex;
  return e.replace(s, (n, r, i, l, o, a) => {
    const c = v(i), h = c || v(l), u = h || v(o), g = u;
    return r === "=" && g && (r = ""), a = t.includePrerelease ? "-0" : "", c ? r === ">" || r === "<" ? n = "<0.0.0-0" : n = "*" : r && g ? (h && (l = 0), o = 0, r === ">" ? (r = ">=", h ? (i = +i + 1, l = 0, o = 0) : (l = +l + 1, o = 0)) : r === "<=" && (r = "<", h ? i = +i + 1 : l = +l + 1), r === "<" && (a = "-0"), n = `${r + i}.${l}.${o}${a}`) : h ? n = `>=${i}.0.0${a} <${+i + 1}.0.0-0` : u && (n = `>=${i}.${l}.0${a} <${i}.${+l + 1}.0-0`), n;
  });
}, Ut = (e, t) => e.trim().replace(y.STAR.regex, ""), Ft = (e, t) => e.trim().replace(y[t.includePrerelease ? "GTE0PRE" : "GTE0"].regex, ""), Bt = (e) => (t, s, n, r, i, l, o, a, c, h, u, g, $) => (v(n) ? s = "" : v(r) ? s = `>=${n}.0.0${e ? "-0" : ""}` : v(i) ? s = `>=${n}.${r}.0${e ? "-0" : ""}` : l ? s = `>=${s}` : s = `>=${s}${e ? "-0" : ""}`, v(c) ? a = "" : v(h) ? a = `<${+c + 1}.0.0-0` : v(u) ? a = `<${c}.${+h + 1}.0-0` : g ? a = `<=${c}.${h}.${u}-${g}` : e ? a = `<${c}.${h}.${+u + 1}-0` : a = `<=${a}`, `${s} ${a}`.trim()), Gt = (e, t, s) => {
  for (let n = 0; n < e.length; n++)
    if (!e[n].test(t))
      return !1;
  if (t.prerelease.length && !s.includePrerelease) {
    for (let n = 0; n < e.length; n++)
      if (e[n].semver !== ie && e[n].semver.prerelease.length > 0) {
        const r = e[n].semver;
        if (r.major === t.major && r.minor === t.minor && r.patch === t.patch)
          return !0;
      }
    return !1;
  }
  return !0;
};
class Z {
  constructor(t, s) {
    if (s = ue(s), t instanceof Z)
      return t.loose === !!s.loose && t.includePrerelease === !!s.includePrerelease ? t : new Z(t.raw, s);
    if (this.options = s, this.loose = !!s.loose, this.includePrerelease = !!s.includePrerelease, this.raw = t, this.set = t.split("||").map((n) => this.parseRange(n.trim())).filter((n) => n.length), !this.set.length)
      throw new TypeError(`Invalid SemVer Range: ${t}`);
    if (this.set.length > 1) {
      const n = this.set[0];
      if (this.set = this.set.filter((r) => !Pe(r[0])), this.set.length === 0)
        this.set = [n];
      else if (this.set.length > 1) {
        for (const r of this.set)
          if (r.length === 1 && Pt(r[0])) {
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
    if (G.has(n))
      return ee.set(n, Date.now()), G.get(n);
    const r = this.options.loose, i = r ? y.HYPHENRANGELOOSE.regex : y.HYPHENRANGE.regex;
    t = t.replace(i, Bt(this.options.includePrerelease)), t = t.replace(y.COMPARATORTRIM.regex, xt), t = t.replace(y.TILDETRIM.regex, Nt), t = t.replace(y.CARETTRIM.regex, Ot), t = t.split(/\s+/).join(" ");
    let l = t.split(" ").map((u) => It(u, this.options)).join(" ").split(/\s+/).map((u) => Ft(u, this.options));
    r && (l = l.filter((u) => !!u.match(y.COMPARATORLOOSE.regex)));
    const o = /* @__PURE__ */ new Map(), a = l.map((u) => new he(u, this.options));
    for (const u of a) {
      if (Pe(u))
        return [u];
      o.set(u.value, u);
    }
    o.size > 1 && o.has("") && o.delete("");
    const c = [...o.values()];
    let h = c;
    if (G.set(n, h), ee.set(n, Date.now()), G.size >= bn) {
      let g = [...ee.entries()].sort(($, p) => $[1] - p[1])[0][0];
      G.delete(g), ee.delete(g);
    }
    return c;
  }
  test(t) {
    if (!t)
      return !1;
    if (typeof t == "string")
      try {
        t = new _(t, this.options);
      } catch {
        return !1;
      }
    for (let s = 0; s < this.set.length; s++)
      if (Gt(this.set[s], t, this.options))
        return !0;
    return !1;
  }
}
function Ie(e, t, s) {
  let n = null, r = null, i = null;
  try {
    i = new Z(t, s);
  } catch {
    return null;
  }
  return e.forEach((l) => {
    i.test(l) && (!n || r.compare(l) === -1) && (n = l, r = new _(n, s));
  }), n;
}
const Vn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SEMVER_SPEC_VERSION: vn,
  MAX_LENGTH: ke,
  MAX_SAFE_INTEGER: q,
  MAX_SAFE_COMPONENT_LENGTH: te,
  get R() {
    return Tt;
  },
  createToken: w,
  tokens: y,
  parseOptions: ue,
  numeric: xe,
  compareIdentifiers: H,
  SemVer: _,
  ANY: ie,
  Comparator: he,
  caretTrimReplace: Ot,
  tildeTrimReplace: Nt,
  comparatorTrimReplace: xt,
  isNullSet: Pe,
  isAny: Pt,
  parseComparator: It,
  isX: v,
  replaceTildes: Lt,
  replaceTilde: Ct,
  replaceCarets: Dt,
  replaceCaret: jt,
  replaceXRanges: Mt,
  replaceXRange: zt,
  replaceStars: Ut,
  replaceGTE0: Ft,
  hyphenReplace: Bt,
  testSet: Gt,
  Range: Z,
  maxSatisfying: Ie,
  default: Ie
}, Symbol.toStringTag, { value: "Module" })), pe = (e) => {
  const t = "https://registry.npmjs.com";
  let { name: s, version: n, path: r } = ae(e), i = `${t}/-/v1/search?text=${encodeURIComponent(s)}&popularity=0.5&size=30`, l = `${t}/${s}/${n}`, o = `${t}/${s}`;
  return { searchURL: i, packageURL: o, packageVersionURL: l, version: n, name: s, path: r };
}, Jn = async (e) => {
  let { searchURL: t } = pe(e), s;
  try {
    s = await (await le(t, !1)).json();
  } catch (r) {
    throw console.warn(r), r;
  }
  return { packages: s?.objects, info: s };
}, Wt = async (e) => {
  let { packageURL: t } = pe(e);
  try {
    return await (await le(t, !1)).json();
  } catch (s) {
    throw console.warn(s), s;
  }
}, Tn = async (e) => {
  try {
    let t = await Wt(e), s = Object.keys(t.versions), n = t["dist-tags"];
    return { versions: s, tags: n };
  } catch (t) {
    throw console.warn(t), t;
  }
}, kn = async (e) => {
  try {
    let { version: t } = pe(e), s = await Tn(e);
    if (s) {
      const { versions: n, tags: r } = s;
      return t in r && (t = r[t]), n.includes(t) ? t : Ie(n, t);
    }
  } catch (t) {
    throw console.warn(t), t;
  }
}, Kn = async (e) => {
  try {
    let { name: t } = pe(e), s = await kn(e);
    return await Wt(`${t}@${s}`);
  } catch (t) {
    throw console.warn(t), t;
  }
};
let Ae;
const Xe = async () => {
  if (Ae)
    return Ae;
  const e = await import("./brotli-d55aae48.mjs"), { default: t, source: s } = e;
  return await t(await s()), Ae = e;
};
async function _n(e, t = 4096, s = 6, n = 22) {
  const { compress: r } = await Xe();
  return r(e, t, s, n);
}
async function On(e, t = 4096) {
  const { decompress: s } = await Xe();
  return s(e, t);
}
const Nn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getWASM: Xe,
  compress: _n,
  decompress: On
}, Symbol.toStringTag, { value: "Module" }));
let Xt, Re;
const C = async (e) => {
  if (Re)
    return Re;
  const t = await import("./denoflate-82001750.mjs"), { default: s } = t, { wasm: n } = await import("./gzip-dfcdb483.mjs");
  return Xt = await s(e ?? await n()), Re = t;
};
async function xn(e, t) {
  return (await C()).deflate(e, t);
}
async function Pn(e) {
  return (await C()).inflate(e);
}
async function In(e, t) {
  return (await C()).gzip(e, t);
}
async function Ln(e) {
  return (await C()).gunzip(e);
}
async function Cn(e, t) {
  return (await C()).zlib(e, t);
}
async function Dn(e) {
  return (await C()).unzlib(e);
}
const jn = Xt, Mn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getWASM: C,
  deflate: xn,
  inflate: Pn,
  gzip: In,
  gunzip: Ln,
  zlib: Cn,
  unzlib: Dn,
  default: jn
}, Symbol.toStringTag, { value: "Module" }));
let ve;
const qe = async () => {
  if (ve)
    return ve;
  const e = await import("./lz4-54bbf0d3.mjs"), { default: t, source: s } = e;
  return await t(await s()), ve = e;
};
async function zn(e) {
  const { lz4_compress: t } = await qe();
  return t(e);
}
async function Un(e) {
  const { lz4_decompress: t } = await qe();
  return t(e);
}
const Fn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getWASM: qe,
  compress: zn,
  decompress: Un
}, Symbol.toStringTag, { value: "Module" }));
function Bn(e) {
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
function Gn(e) {
  const t = qt(e), s = new Uint8Array(t.length);
  for (let n = 0; n < s.length; ++n)
    s[n] = t.charCodeAt(n);
  return s.buffer;
}
function qt(e) {
  return atob(e);
}
const Qn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  encode: Bn,
  decode: Gn,
  decodeString: qt
}, Symbol.toStringTag, { value: "Module" }));
export {
  Hs as ALIAS,
  Ve as ALIAS_NAMESPACE,
  me as ALIAS_RESOLVE,
  fn as AnsiBuffer,
  an as BIBIT_UNITS,
  ln as BIBYTE_UNITS,
  on as BIT_UNITS,
  rn as BYTE_UNITS,
  it as CACHE,
  rs as CACHE_NAME,
  Ws as CDN,
  Ze as CDN_NAMESPACE,
  Te as CDN_RESOLVE,
  B as DEFAULT_CDN_HOST,
  vt as DefaultConfig,
  es as DeprecatedAPIs,
  Jt as EMPTY_EXPORT,
  et as ESCAPE_TO_COLOR,
  S as EVENTS,
  nn as EVENTS_OPTS,
  ns as EXTERNAL,
  W as EXTERNALS_NAMESPACE,
  Rt as EasyDefaultConfig,
  ts as ExternalPackages,
  F as FileSystem,
  qs as HTTP,
  x as HTTP_NAMESPACE,
  wt as HTTP_RESOLVE,
  Xn as INPUT_EVENTS,
  de as OPEN_CACHE,
  Zs as PLATFORM_AUTO,
  Qt as PolyfillKeys,
  Kt as PolyfillMap,
  Ms as RESOLVE_EXTENSIONS,
  Bs as RE_NON_SCOPED,
  Fs as RE_SCOPED,
  k as STATE,
  $e as VIRTUAL_FILESYSTEM_NAMESPACE,
  Ys as VIRTUAL_FS,
  un as ansi,
  b as bail,
  Qn as base64,
  Nn as brotli,
  pn as build,
  Qe as bytes,
  Hn as debounce,
  Se as decode,
  V as deepAssign,
  en as deepDiff,
  At as deepEqual,
  Mn as denoflate,
  nt as encode,
  Xs as fetchAssets,
  $t as fetchPkg,
  Qe as formatBytes,
  Zt as getCDNOrigin,
  rt as getCDNStyle,
  T as getCDNUrl,
  hn as getESBUILD,
  Vs as getFile,
  Wt as getPackage,
  Tn as getPackageVersions,
  Jn as getPackages,
  Vt as getPureImportPath,
  pe as getRegistryURL,
  le as getRequest,
  Kn as getResolvedPackage,
  yt as getResolvedPath,
  qn as getSize,
  cn as htmlEscape,
  mt as inferLoader,
  bt as init,
  Et as isAlias,
  ss as isExternal,
  L as isObject,
  Ks as isPrimitive,
  Qs as isValidKey,
  Us as legacy,
  O as loop,
  Fn as lz4,
  yn as lzstring,
  He as newRequest,
  is as openCache,
  Zn as parseConfig,
  ae as parsePackageName,
  Yn as parseShareQuery,
  Rn as parseTreeshakeExports,
  Wn as path,
  Qe as prettyBytes,
  un as render,
  zs as resolveExports,
  Gs as resolveImports,
  kn as resolveVersion,
  sr as schema,
  Vn as semver,
  Js as setFile,
  Ke as toLocaleString,
  Me as toName
};
//# sourceMappingURL=index.mjs.map
