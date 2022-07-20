import { s as Qr } from "./schema-8ec31a1b.mjs";
const Ht = "0.14.49", Le = (e) => new TextEncoder().encode(e), ve = (e) => new TextDecoder().decode(e), U = "https://unpkg.com", nt = (e) => /^(skypack|esm|esm\.sh|unpkg|jsdelivr|esm\.run)\:?/.test(e) || /^https?:\/\/(cdn\.skypack\.dev|cdn\.esm\.sh|cdn\.jsdelivr\.net\/npm|unpkg\.com)/.test(e) ? "npm" : /^(jsdelivr\.gh|github)\:?/.test(e) || /^https?:\/\/(cdn\.jsdelivr\.net\/gh|raw\.githubusercontent\.com)/.test(e) ? "github" : /^(deno)\:?/.test(e) || /^https?:\/\/(deno\.land\/x)/.test(e) ? "deno" : "other", Yt = (e, t = U) => (/^skypack\:/.test(e) ? t = "https://cdn.skypack.dev" : /^(esm\.sh|esm)\:/.test(e) ? t = "https://cdn.esm.sh" : /^unpkg\:/.test(e) ? t = "https://unpkg.com" : /^(jsdelivr|esm\.run)\:/.test(e) ? t = "https://cdn.jsdelivr.net/npm" : /^(jsdelivr\.gh)\:/.test(e) ? t = "https://cdn.jsdelivr.net/gh" : /^(deno)\:/.test(e) ? t = "https://deno.land/x" : /^(github)\:/.test(e) && (t = "https://raw.githubusercontent.com"), /\/$/.test(t) ? t : `${t}/`), Zt = (e) => e.replace(/^(skypack|esm|esm\.sh|unpkg|jsdelivr|jsdelivr\.gh|esm\.run|deno|github)\:/, "").replace(/^https?:\/\/(cdn\.skypack\.dev|cdn\.esm\.sh|cdn\.jsdelivr\.net\/npm|unpkg\.com|cdn\.jsdelivr\.net\/gh|raw\.githubusercontent\.com|deno\.land\/x)/, "").replace(/^\//, ""), T = (e, t = U) => {
  let s = Yt(e, t), r = Zt(e), n = new URL(r, s);
  return { import: e, path: r, origin: s, cdn: t, url: n };
}, B = "external-globals", Vt = Le("export default {}"), Jt = {
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
}, Kt = Object.keys(Jt), Qt = ["v8/tools/codemap", "v8/tools/consarray", "v8/tools/csvparser", "v8/tools/logreader", "v8/tools/profile_view", "v8/tools/profile", "v8/tools/SourceMap", "v8/tools/splaytree", "v8/tools/tickprocessor-driver", "v8/tools/tickprocessor", "node-inspect/lib/_inspect", "node-inspect/lib/internal/inspect_client ", "node-inspect/lib/internal/inspect_repl", "_linklist", "_stream_wrap"], es = ["chokidar", "yargs", "fsevents", "worker_threads", "async_hooks", "diagnostics_channel", "http2", "inspector", "perf_hooks", "trace_events", "wasi", ...Qt, ...Kt], ts = (e, t = []) => [...es, ...t].find((s) => !!(s === e || e.startsWith(`${s}/`))), ss = (e, t, s) => {
  const { external: r = [] } = s?.esbuild ?? {};
  return {
    name: B,
    setup(n) {
      n.onResolve({ filter: /.*/ }, (i) => {
        let l = i.path.replace(/^node\:/, ""), { path: o } = T(l);
        if (ts(o, r))
          return {
            path: o,
            namespace: B,
            external: !0
          };
      }), n.onLoad({ filter: /.*/, namespace: B }, (i) => ({
        pluginName: B,
        contents: Vt,
        warnings: [{
          text: `${i.path} is marked as an external module and will be ignored.`,
          details: `"${i.path}" is a built-in node module thus can't be bundled by https://bundlejs.com, sorry about that.`
        }]
      }));
    }
  };
}, it = /* @__PURE__ */ new Map(), rs = "EXTERNAL_FETCHES", Ye = async (e, t, s) => {
  let r = await fetch(t, s), n = r.clone();
  return "caches" in globalThis ? e.put(t, n) : it.set(t, n), r;
}, oe = async (e, t = !1, s) => {
  let r = new Request(e.toString()), n, i, l;
  return "caches" in globalThis ? (i = await caches.open(rs), l = await i.match(r)) : l = it.get(r), n = l, l ? t || Ye(i, r, s) : n = await Ye(i, r, s), n.clone();
}, q = 46, E = 47, lt = "/", ot = /\/+/;
function N(e) {
  if (typeof e != "string")
    throw new TypeError(`Path must be a string. Received ${JSON.stringify(e)}`);
}
function at(e) {
  return e === E;
}
function ct(e, t, s, r) {
  let n = "", i = 0, l = -1, o = 0, a;
  for (let c = 0, u = e.length; c <= u; ++c) {
    if (c < u)
      a = e.charCodeAt(c);
    else {
      if (r(a))
        break;
      a = E;
    }
    if (r(a)) {
      if (!(l === c - 1 || o === 1))
        if (l !== c - 1 && o === 2) {
          if (n.length < 2 || i !== 2 || n.charCodeAt(n.length - 1) !== q || n.charCodeAt(n.length - 2) !== q) {
            if (n.length > 2) {
              const f = n.lastIndexOf(s);
              f === -1 ? (n = "", i = 0) : (n = n.slice(0, f), i = n.length - 1 - n.lastIndexOf(s)), l = c, o = 0;
              continue;
            } else if (n.length === 2 || n.length === 1) {
              n = "", i = 0, l = c, o = 0;
              continue;
            }
          }
          t && (n.length > 0 ? n += `${s}..` : n = "..", i = 2);
        } else
          n.length > 0 ? n += s + e.slice(l + 1, c) : n = e.slice(l + 1, c), i = c - l - 1;
      l = c, o = 0;
    } else
      a === q && o !== -1 ? ++o : o = -1;
  }
  return n;
}
function ns(e, t) {
  const s = t.dir || t.root, r = t.base || (t.name || "") + (t.ext || "");
  return s ? s === t.root ? s + r : s + e + r : r;
}
const is = {
  "	": "%09",
  "\n": "%0A",
  "\v": "%0B",
  "\f": "%0C",
  "\r": "%0D",
  " ": "%20"
};
function ft(e) {
  return e.replaceAll(/[\s]/g, (t) => is[t] ?? t);
}
const ls = "/", os = ":";
function be(...e) {
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
    N(n), n.length !== 0 && (t = `${n}/${t}`, s = n.charCodeAt(0) === E);
  }
  return t = ct(t, !s, "/", at), s ? t.length > 0 ? `/${t}` : "/" : t.length > 0 ? t : ".";
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
function as(...e) {
  if (e.length === 0)
    return ".";
  let t;
  for (let s = 0, r = e.length; s < r; ++s) {
    const n = e[s];
    N(n), n.length > 0 && (t ? t += `/${n}` : t = n);
  }
  return t ? ut(t) : ".";
}
function cs(e, t) {
  if (N(e), N(t), e === t || (e = be(e), t = be(t), e === t))
    return "";
  let s = 1;
  const r = e.length;
  for (; s < r && e.charCodeAt(s) === E; ++s)
    ;
  const n = r - s;
  let i = 1;
  const l = t.length;
  for (; i < l && t.charCodeAt(i) === E; ++i)
    ;
  const o = l - i, a = n < o ? n : o;
  let c = -1, u = 0;
  for (; u <= a; ++u) {
    if (u === a) {
      if (o > a) {
        if (t.charCodeAt(i + u) === E)
          return t.slice(i + u + 1);
        if (u === 0)
          return t.slice(i + u);
      } else
        n > a && (e.charCodeAt(s + u) === E ? c = u : u === 0 && (c = 0));
      break;
    }
    const g = e.charCodeAt(s + u), m = t.charCodeAt(i + u);
    if (g !== m)
      break;
    g === E && (c = u);
  }
  let f = "";
  for (u = s + c + 1; u <= r; ++u)
    (u === r || e.charCodeAt(u) === E) && (f.length === 0 ? f += ".." : f += "/..");
  return f.length > 0 ? f + t.slice(i + c) : (i += c, t.charCodeAt(i) === E && ++i, t.slice(i));
}
function fs(e) {
  return e;
}
function us(e) {
  if (N(e), e.length === 0)
    return ".";
  const t = e.charCodeAt(0) === E;
  let s = -1, r = !0;
  for (let n = e.length - 1; n >= 1; --n)
    if (e.charCodeAt(n) === E) {
      if (!r) {
        s = n;
        break;
      }
    } else
      r = !1;
  return s === -1 ? t ? "/" : "." : t && s === 1 ? "//" : e.slice(0, s);
}
function hs(e, t = "") {
  if (t !== void 0 && typeof t != "string")
    throw new TypeError('"ext" argument must be a string');
  N(e);
  let s = 0, r = -1, n = !0, i;
  if (t !== void 0 && t.length > 0 && t.length <= e.length) {
    if (t.length === e.length && t === e)
      return "";
    let l = t.length - 1, o = -1;
    for (i = e.length - 1; i >= 0; --i) {
      const a = e.charCodeAt(i);
      if (a === E) {
        if (!n) {
          s = i + 1;
          break;
        }
      } else
        o === -1 && (n = !1, o = i + 1), l >= 0 && (a === t.charCodeAt(l) ? --l === -1 && (r = i) : (l = -1, r = o));
    }
    return s === r ? r = o : r === -1 && (r = e.length), e.slice(s, r);
  } else {
    for (i = e.length - 1; i >= 0; --i)
      if (e.charCodeAt(i) === E) {
        if (!n) {
          s = i + 1;
          break;
        }
      } else
        r === -1 && (n = !1, r = i + 1);
    return r === -1 ? "" : e.slice(s, r);
  }
}
function ps(e) {
  N(e);
  let t = -1, s = 0, r = -1, n = !0, i = 0;
  for (let l = e.length - 1; l >= 0; --l) {
    const o = e.charCodeAt(l);
    if (o === E) {
      if (!n) {
        s = l + 1;
        break;
      }
      continue;
    }
    r === -1 && (n = !1, r = l + 1), o === q ? t === -1 ? t = l : i !== 1 && (i = 1) : t !== -1 && (i = -1);
  }
  return t === -1 || r === -1 || i === 0 || i === 1 && t === r - 1 && t === s + 1 ? "" : e.slice(t, r);
}
function ds(e) {
  if (e === null || typeof e != "object")
    throw new TypeError(`The "pathObject" argument must be of type Object. Received type ${typeof e}`);
  return ns("/", e);
}
function gs(e) {
  N(e);
  const t = { root: "", dir: "", base: "", ext: "", name: "" };
  if (e.length === 0)
    return t;
  const s = e.charCodeAt(0) === E;
  let r;
  s ? (t.root = "/", r = 1) : r = 0;
  let n = -1, i = 0, l = -1, o = !0, a = e.length - 1, c = 0;
  for (; a >= r; --a) {
    const u = e.charCodeAt(a);
    if (u === E) {
      if (!o) {
        i = a + 1;
        break;
      }
      continue;
    }
    l === -1 && (o = !1, l = a + 1), u === q ? n === -1 ? n = a : c !== 1 && (c = 1) : n !== -1 && (c = -1);
  }
  return n === -1 || l === -1 || c === 0 || c === 1 && n === l - 1 && n === i + 1 ? l !== -1 && (i === 0 && s ? t.base = t.name = e.slice(1, l) : t.base = t.name = e.slice(i, l)) : (i === 0 && s ? (t.name = e.slice(1, n), t.base = e.slice(1, l)) : (t.name = e.slice(i, n), t.base = e.slice(i, l)), t.ext = e.slice(n, l)), i > 0 ? t.dir = e.slice(0, i - 1) : s && (t.dir = "/"), t;
}
function ms(e) {
  if (e = e instanceof URL ? e : new URL(e), e.protocol != "file:")
    throw new TypeError("Must be a file URL.");
  return decodeURIComponent(e.pathname.replace(/%(?![0-9A-Fa-f]{2})/g, "%25"));
}
function $s(e) {
  if (!ht(e))
    throw new TypeError("Must be an absolute path.");
  const t = new URL("file:///");
  return t.pathname = ft(e.replace(/%/g, "%25").replace(/\\/g, "%5C")), t;
}
const Ce = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  sep: ls,
  delimiter: os,
  resolve: be,
  normalize: ut,
  isAbsolute: ht,
  join: as,
  relative: cs,
  toNamespacedPath: fs,
  dirname: us,
  basename: hs,
  extname: ps,
  format: ds,
  parse: gs,
  fromFileUrl: ms,
  toFileUrl: $s
}, Symbol.toStringTag, { value: "Module" })), ws = Ce, { join: Es, normalize: Ze } = ws, ge = [
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
], ys = ["-", "\\", "]"];
function As(e, {
  extended: t = !0,
  globstar: s = !0,
  os: r = "linux",
  caseInsensitive: n = !1
} = {}) {
  if (e == "")
    return /(?!)/;
  const i = r == "windows" ? "(?:\\\\|/)+" : "/+", l = r == "windows" ? "(?:\\\\|/)*" : "/*", o = r == "windows" ? ["\\", "/"] : ["/"], a = r == "windows" ? "(?:[^\\\\/]*(?:\\\\|/|$)+)*" : "(?:[^/]*(?:/|$)+)*", c = r == "windows" ? "[^\\\\/]*" : "[^/]*", u = r == "windows" ? "`" : "\\";
  let f = e.length;
  for (; f > 1 && o.includes(e[f - 1]); f--)
    ;
  e = e.slice(0, f);
  let g = "";
  for (let m = 0; m < e.length; ) {
    let p = "";
    const d = [];
    let h = !1, V = !1, J = !1, $ = m;
    for (; $ < e.length && !o.includes(e[$]); $++) {
      if (V) {
        V = !1, p += (h ? ys : ge).includes(e[$]) ? `\\${e[$]}` : e[$];
        continue;
      }
      if (e[$] == u) {
        V = !0;
        continue;
      }
      if (e[$] == "[")
        if (h) {
          if (e[$ + 1] == ":") {
            let A = $ + 1, R = "";
            for (; e[A + 1] != null && e[A + 1] != ":"; )
              R += e[A + 1], A++;
            if (e[A + 1] == ":" && e[A + 2] == "]") {
              $ = A + 2, R == "alnum" ? p += "\\dA-Za-z" : R == "alpha" ? p += "A-Za-z" : R == "ascii" ? p += "\0-\x7F" : R == "blank" ? p += "	 " : R == "cntrl" ? p += "\0-\x7F" : R == "digit" ? p += "\\d" : R == "graph" ? p += "!-~" : R == "lower" ? p += "a-z" : R == "print" ? p += " -~" : R == "punct" ? p += `!"#$%&'()*+,\\-./:;<=>?@[\\\\\\]^_\u2018{|}~` : R == "space" ? p += "\\s\v" : R == "upper" ? p += "A-Z" : R == "word" ? p += "\\w" : R == "xdigit" && (p += "\\dA-Fa-f");
              continue;
            }
          }
        } else {
          h = !0, p += "[", e[$ + 1] == "!" ? ($++, p += "^") : e[$ + 1] == "^" && ($++, p += "\\^");
          continue;
        }
      if (e[$] == "]" && h) {
        h = !1, p += "]";
        continue;
      }
      if (h) {
        e[$] == "\\" ? p += "\\\\" : p += e[$];
        continue;
      }
      if (e[$] == ")" && d.length > 0 && d[d.length - 1] != "BRACE") {
        p += ")";
        const A = d.pop();
        A == "!" ? p += c : A != "@" && (p += A);
        continue;
      }
      if (e[$] == "|" && d.length > 0 && d[d.length - 1] != "BRACE") {
        p += "|";
        continue;
      }
      if (e[$] == "+" && t && e[$ + 1] == "(") {
        $++, d.push("+"), p += "(?:";
        continue;
      }
      if (e[$] == "@" && t && e[$ + 1] == "(") {
        $++, d.push("@"), p += "(?:";
        continue;
      }
      if (e[$] == "?") {
        t && e[$ + 1] == "(" ? ($++, d.push("?"), p += "(?:") : p += ".";
        continue;
      }
      if (e[$] == "!" && t && e[$ + 1] == "(") {
        $++, d.push("!"), p += "(?!";
        continue;
      }
      if (e[$] == "{") {
        d.push("BRACE"), p += "(?:";
        continue;
      }
      if (e[$] == "}" && d[d.length - 1] == "BRACE") {
        d.pop(), p += ")";
        continue;
      }
      if (e[$] == "," && d[d.length - 1] == "BRACE") {
        p += "|";
        continue;
      }
      if (e[$] == "*") {
        if (t && e[$ + 1] == "(")
          $++, d.push("*"), p += "(?:";
        else {
          const A = e[$ - 1];
          let R = 1;
          for (; e[$ + 1] == "*"; )
            $++, R++;
          const qt = e[$ + 1];
          s && R == 2 && [...o, void 0].includes(A) && [...o, void 0].includes(qt) ? (p += a, J = !0) : p += c;
        }
        continue;
      }
      p += ge.includes(e[$]) ? `\\${e[$]}` : e[$];
    }
    if (d.length > 0 || h || V) {
      p = "";
      for (const A of e.slice(m, $))
        p += ge.includes(A) ? `\\${A}` : A, J = !1;
    }
    for (g += p, J || (g += $ < e.length ? i : l, J = !0); o.includes(e[$]); )
      $++;
    if (!($ > m))
      throw new Error("Assertion failure: i > j (potential infinite loop)");
    m = $;
  }
  return g = `^${g}$`, new RegExp(g, n ? "i" : "");
}
function Rs(e) {
  const t = { "{": "}", "(": ")", "[": "]" }, s = /\\(.)|(^!|\*|\?|[\].+)]\?|\[[^\\\]]+\]|\{[^\\}]+\}|\(\?[:!=][^\\)]+\)|\([^|]+\|[^\\)]+\))/;
  if (e === "")
    return !1;
  let r;
  for (; r = s.exec(e); ) {
    if (r[2])
      return !0;
    let n = r.index + r[0].length;
    const i = r[1], l = i ? t[i] : null;
    if (i && l) {
      const o = e.indexOf(l, n);
      o !== -1 && (n = o + 1);
    }
    e = e.slice(n);
  }
  return !1;
}
function pt(e, { globstar: t = !1 } = {}) {
  if (e.match(/\0/g))
    throw new Error(`Glob contains invalid characters: "${e}"`);
  if (!t)
    return Ze(e);
  const s = ot.source, r = new RegExp(`(?<=(${s}|^)\\*\\*${s})\\.\\.(?=${s}|$)`, "g");
  return Ze(e.replace(r, "\0")).replace(/\0/g, "..");
}
function Ss(e, { extended: t = !0, globstar: s = !1 } = {}) {
  if (!s || e.length == 0)
    return Es(...e);
  if (e.length === 0)
    return ".";
  let r;
  for (const n of e) {
    const i = n;
    i.length > 0 && (r ? r += `${lt}${i}` : r = i);
  }
  return r ? pt(r, { extended: t, globstar: s }) : ".";
}
const vs = Ce, bs = Ce, {
  basename: Ts,
  delimiter: ks,
  dirname: De,
  extname: je,
  format: _s,
  fromFileUrl: Os,
  isAbsolute: dt,
  join: gt,
  normalize: Ns,
  parse: xs,
  relative: Ps,
  resolve: Me,
  sep: Is,
  toFileUrl: Ls,
  toNamespacedPath: Cs
} = vs, ie = (e, ...t) => {
  const s = new URL(e);
  return s.pathname = ft(gt(s.pathname, ...t).replace(/%/g, "%25").replace(/\\/g, "%5C")), s.toString();
}, ae = (e) => /^(?!\.).*/.test(e) && !dt(e), Fr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  urlJoin: ie,
  isBareImport: ae,
  SEP: lt,
  SEP_PATTERN: ot,
  globToRegExp: As,
  isGlob: Rs,
  normalizeGlob: pt,
  joinGlobs: Ss,
  posix: bs,
  basename: Ts,
  delimiter: ks,
  dirname: De,
  extname: je,
  format: _s,
  fromFileUrl: Os,
  isAbsolute: dt,
  join: gt,
  normalize: Ns,
  parse: xs,
  relative: Ps,
  resolve: Me,
  sep: Is,
  toFileUrl: Ls,
  toNamespacedPath: Cs
}, Symbol.toStringTag, { value: "Module" })), Ds = [".tsx", ".ts", ".jsx", ".js", ".css", ".json"], mt = (e) => {
  const t = je(e);
  return Ds.includes(t) ? (/\.js(x)?$/.test(t) ? t.replace(/^\.js/, ".ts") : t).slice(1) : t === ".mjs" || t === ".cjs" || t === ".mts" || t === ".cts" ? "ts" : t == ".scss" ? "css" : t == ".png" || t == ".jpeg" || t == ".ttf" ? "dataurl" : t == ".svg" || t == ".html" || t == ".txt" ? "text" : t == ".wasm" ? "file" : t.length ? "text" : "ts";
};
function O(e, t) {
  if (typeof e == "string")
    return e;
  if (e) {
    let s, r;
    if (Array.isArray(e)) {
      for (s = 0; s < e.length; s++)
        if (r = O(e[s], t))
          return r;
    } else
      for (s in e)
        if (t.has(s))
          return O(e[s], t);
  }
}
function b(e, t, s) {
  throw new Error(s ? `No known conditions for "${t}" entry in "${e}" package` : `Missing "${t}" export in "${e}" package`);
}
function ze(e, t) {
  return t === e ? "." : t[0] === "." ? t : t.replace(new RegExp("^" + e + "/"), "./");
}
function js(e, t = ".", s = {}) {
  let { name: r, exports: n } = e;
  if (n) {
    let { browser: i, require: l, unsafe: o, conditions: a = [] } = s, c = ze(r, t);
    if (c[0] !== "." && (c = "./" + c), typeof n == "string")
      return c === "." ? n : b(r, c);
    let u = /* @__PURE__ */ new Set(["default", ...a]);
    o || u.add(l ? "require" : "import"), o || u.add(i ? "browser" : "node");
    let f, g, m = !1;
    for (f in n) {
      m = f[0] !== ".";
      break;
    }
    if (m)
      return c === "." ? O(n, u) || b(r, c, 1) : b(r, c);
    if (g = n[c])
      return O(g, u) || b(r, c, 1);
    for (f in n) {
      if (g = f[f.length - 1], g === "/" && c.startsWith(f))
        return (g = O(n[f], u)) ? g + c.substring(f.length) : b(r, c, 1);
      if (g === "*" && c.startsWith(f.slice(0, -1)) && c.substring(f.length - 1).length > 0)
        return (g = O(n[f], u)) ? g.replace("*", c.substring(f.length - 1)) : b(r, c, 1);
    }
    return b(r, c);
  }
}
function Ms(e, t = {}) {
  let s = 0, r, n = t.browser, i = t.fields || ["module", "main"];
  for (n && !i.includes("browser") && i.unshift("browser"); s < i.length; s++)
    if (r = e[i[s]]) {
      if (typeof r != "string")
        if (typeof r == "object" && i[s] == "browser") {
          if (typeof n == "string" && (r = r[n = ze(e.name, n)], r == null))
            return n;
        } else
          continue;
      return typeof r == "string" ? "./" + r.replace(/^\.?\//, "") : r;
    }
}
const zs = /^(@[^\/]+\/[^@\/]+)(?:@([^\/]+))?(\/.*)?$/, Us = /^([^@\/]+)(?:@([^\/]+))?(\/.*)?$/;
function ce(e) {
  const t = zs.exec(e) || Us.exec(e);
  if (!t)
    throw new Error(`[parse-package-name] invalid package name: ${e}`);
  return {
    name: t[1] || "",
    version: t[2] || "latest",
    path: t[3] || ""
  };
}
function Fs(e, t = ".", s = {}) {
  let { name: r, imports: n } = e;
  if (n) {
    let { browser: i, require: l, unsafe: o, conditions: a = [] } = s, c = ze(r, t);
    if (typeof n == "string")
      return c === "#" ? n : b(r, c);
    let u = /* @__PURE__ */ new Set(["default", ...a]);
    o || u.add(l ? "require" : "import"), o || u.add(i ? "browser" : "node");
    let f, g, m = !1;
    for (f in n) {
      m = f[0] !== "#";
      break;
    }
    if (m)
      return c === "#" ? O(n, u) || b(r, c, 1) : b(r, c);
    if (g = n[c])
      return O(g, u) || b(r, c, 1);
    for (f in n) {
      if (g = f[f.length - 1], g === "/" && c.startsWith(f))
        return (g = O(n[f], u)) ? g + c.substring(f.length) : b(r, c, 1);
      if (g === "*" && c.startsWith(f.slice(0, -1)) && c.substring(f.length - 1).length > 0)
        return (g = O(n[f], u)) ? g.replace("*", c.substring(f.length - 1)) : b(r, c, 1);
    }
    return b(r, c);
  }
}
const Ve = "cdn-url", Te = (e = U, t) => async (s) => {
  if (ae(s.path)) {
    let { path: r, origin: n } = T(s.path, e), i = nt(n) == "npm", l = ce(r), o = l.path, a = s.pluginData?.pkg ?? {};
    if (r[0] == "#") {
      let g = Fs({ ...a, exports: a.imports }, r, {
        require: s.kind === "require-call" || s.kind === "require-resolve"
      });
      if (typeof g == "string") {
        o = g.replace(/^\.?\/?/, "/"), o && o[0] !== "/" && (o = `/${o}`);
        let m = i ? "@" + a.version : "", { url: { href: p } } = T(`${a.name}${m}${o}`);
        return {
          namespace: x,
          path: p,
          pluginData: { pkg: a }
        };
      }
    }
    if (("dependencies" in a || "devDependencies" in a || "peerDependencies" in a) && !/\S+@\S+/.test(r)) {
      let {
        devDependencies: g = {},
        dependencies: m = {},
        peerDependencies: p = {}
      } = a, d = Object.assign({}, g, p, m);
      Object.keys(d).includes(r) && (l.version = d[r]);
    }
    if (i)
      try {
        let { url: g } = T(`${l.name}@${l.version}/package.json`, n);
        a = await oe(g, !0).then((p) => p.json());
        let m = js(a, o ? "." + o.replace(/^\.?\/?/, "/") : ".", {
          require: s.kind === "require-call" || s.kind === "require-resolve"
        }) || Ms(a);
        typeof m == "string" && (o = m.replace(/^\.?\/?/, "/").replace(/\.js\.js$/, ".js")), o && o[0] !== "/" && (o = `/${o}`);
      } catch (g) {
        t.emit("logger.warn", `You may want to change CDNs. The current CDN ${/unpkg\.com/.test(n) ? `path "${n}${r}" may not` : `"${n}" doesn't`} support package.json files.
There is a chance the CDN you're using doesn't support looking through the package.json of packages. bundlejs will switch to inaccurate guesses for package versions. For package.json support you may wish to use https://unpkg.com or other CDN's that support package.json.`).emit("logger.warn", g);
      }
    let u = i ? "@" + l.version : "", { url: f } = T(`${l.name}${u}${o}`, n);
    return {
      namespace: x,
      path: f.toString(),
      pluginData: { pkg: a }
    };
  }
}, Bs = (e, t, s) => {
  let { origin: r } = /:/.test(s?.cdn) ? T(s?.cdn) : T(s?.cdn + ":");
  return s.filesystem, {
    name: Ve,
    setup(n) {
      n.onResolve({ filter: /.*/ }, Te(r, e)), n.onResolve({ filter: /.*/, namespace: Ve }, Te(r, e));
    }
  };
}, x = "http-url", te = async (e, t) => {
  try {
    let s = await oe(e);
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
}, Gs = async (e, t, s, r, n) => {
  const i = /new URL\(['"`](.*)['"`],(?:\s+)?import\.meta\.url(?:\s+)?\)/g, l = new URL("./", e).toString(), o = n.filesystem, a = ve(t), u = Array.from(a.matchAll(i)).map(async ([, f]) => {
    let { content: g, url: m } = await te(ie(l, f), r);
    return o.set(s + ":" + m, t), {
      path: f,
      contents: g,
      get text() {
        return ve(g);
      }
    };
  });
  return await Promise.allSettled(u);
}, $t = (e = U, t) => async (s) => {
  let r = s.path.replace(/\/$/, "/index");
  if (!r.startsWith(".")) {
    if (/^https?:\/\//.test(r))
      return {
        path: r,
        namespace: x,
        pluginData: { pkg: s.pluginData?.pkg }
      };
    let i = new URL(ie(s.pluginData?.url ? s.pluginData?.url : e, "../", r)).origin, o = nt(i) == "npm" ? i : e;
    return ae(r) ? Te(o, t)(s) : {
      path: T(r, o).url.toString(),
      namespace: x,
      pluginData: { pkg: s.pluginData?.pkg }
    };
  }
  return {
    path: ie(s.pluginData?.url, "../", r),
    namespace: x,
    pluginData: { pkg: s.pluginData?.pkg }
  };
}, Ws = (e, t, s) => {
  let { origin: r } = /:/.test(s?.cdn) ? T(s?.cdn) : T(s?.cdn + ":");
  const n = s.filesystem, i = t.assets ?? [];
  return {
    name: x,
    setup(l) {
      l.onResolve({ filter: /^https?:\/\// }, (o) => ({
        path: o.path,
        namespace: x
      })), l.onResolve({ filter: /.*/, namespace: x }, $t(r, e)), l.onLoad({ filter: /.*/, namespace: x }, async (o) => {
        let a = je(o.path), c = (m = "") => a.length > 0 ? o.path : o.path + m, u, f;
        try {
          ({ content: u, url: f } = await te(c(), e));
        } catch (m) {
          try {
            ({ content: u, url: f } = await te(c(".ts"), e));
          } catch {
            try {
              ({ content: u, url: f } = await te(c(".tsx"), e));
            } catch (d) {
              throw e.emit("logger.error", d.toString()), m;
            }
          }
        }
        await n.set(o.namespace + ":" + o.path, u);
        let g = (await Gs(f, u, o.namespace, e, s)).filter((m) => m.status == "rejected" ? (e.emit("logger:warn", `Asset fetch failed.
` + m?.reason?.toString()), !1) : !0).map((m) => {
          if (m.status == "fulfilled")
            return m.value;
        });
        return t.assets = i.concat(g), {
          contents: u,
          loader: mt(f),
          pluginData: { url: f, pkg: o.pluginData?.pkg }
        };
      });
    }
  };
}, Je = "alias-globals", wt = (e, t = {}) => {
  if (!ae(e))
    return !1;
  let s = Object.keys(t), r = e.replace(/^node\:/, ""), n = ce(r);
  return s.find((i) => n.name === i);
}, me = (e = {}, t = U, s) => async (r) => {
  let n = r.path.replace(/^node\:/, ""), { path: i } = T(n);
  if (wt(i, e)) {
    let l = ce(i), o = e[l.name];
    return $t(t, s)({
      ...r,
      path: o
    });
  }
}, Xs = (e, t, s) => {
  let { origin: r } = /:/.test(s?.cdn) ? T(s?.cdn) : T(s?.cdn + ":"), n = s.alias ?? {};
  return {
    name: Je,
    setup(i) {
      i.onResolve({ filter: /^node\:.*/ }, (l) => wt(l.path, n) ? me(n, r, e)(l) : {
        path: l.path,
        namespace: B,
        external: !0
      }), i.onResolve({ filter: /.*/ }, me(n, r, e)), i.onResolve({ filter: /.*/, namespace: Je }, me(n, r, e));
    }
  };
}, $e = "virtual-filesystem", qs = (e, t, s) => {
  const r = s.filesystem;
  return {
    name: $e,
    setup(n) {
      n.onResolve({ filter: /.*/ }, (i) => ({
        path: i.path,
        pluginData: i.pluginData ?? {},
        namespace: $e
      })), n.onLoad({ filter: /.*/, namespace: $e }, async (i) => {
        let l = await r.resolve(i.path, i?.pluginData?.importer);
        return {
          contents: await r.get(i.path, "buffer", i?.pluginData?.importer),
          pluginData: {
            importer: l
          },
          loader: mt(l)
        };
      });
    }
  };
}, Hs = "Deno" in globalThis ? "deno" : "process" in globalThis ? "node" : "browser", z = /* @__PURE__ */ new Map(), Et = async (e, t) => {
  let s = e;
  if (t && e.startsWith(".") && (s = Me(De(t), e)), z.has(s))
    return s;
  throw `File "${s}" does not exist`;
}, Ys = async (e, t = "buffer", s) => {
  let r = await Et(e, s);
  if (z.has(r)) {
    let n = z.get(r);
    return t == "string" ? ve(n) : n;
  }
}, Zs = async (e, t, s) => {
  let r = e;
  s && e.startsWith(".") && (r = Me(De(s), e));
  try {
    z.set(r, t instanceof Uint8Array ? t : Le(t));
  } catch {
    throw `Error occurred while writing to "${r}"`;
  }
}, I = (e) => typeof e == "object" && e != null, Vs = (e) => typeof e == "object" ? e === null : typeof e != "function", Js = (e) => e !== "__proto__" && e !== "constructor" && e !== "prototype", yt = (e, t) => {
  if (e === t)
    return !0;
  if (I(e) && I(t)) {
    if (Object.keys(e).length !== Object.keys(t).length)
      return !1;
    for (var s in e)
      if (!yt(e[s], t[s]))
        return !1;
    return !0;
  }
}, Ks = (e, t) => {
  let s = Object.keys(t), r = {}, n = 0;
  for (; n < s.length; n++) {
    let i = s[n], l = t[i];
    if (i in e) {
      let o = Array.isArray(e[i]) && Array.isArray(l);
      if (e[i] == l)
        continue;
      if (o)
        if (!yt(e[i], l))
          r[i] = l;
        else
          continue;
      else if (I(e[i]) && I(l)) {
        let a = Ks(e[i], l);
        Object.keys(a).length && (r[i] = a);
      } else
        r[i] = l;
    } else
      r[i] = l;
  }
  return r;
};
/*!
 * Based on assign-deep <https://github.com/jonschlinkert/assign-deep>
 *
 * Copyright (c) 2017-present, Jon Schlinkert.
 * Released under the MIT License.
 */
const Y = (e, ...t) => {
  let s = 0;
  for (Vs(e) && (e = t[s++]), e || (e = {}); s < t.length; s++)
    if (I(t[s]))
      for (const r of Object.keys(t[s]))
        Js(r) && (I(e[r]) && I(t[s][r]) ? e[r] = Y(Array.isArray(e[r]) ? [] : {}, e[r], t[s][r]) : e[r] = t[s][r]);
  return e;
}, At = {
  entryPoints: ["/index.tsx"],
  cdn: U,
  compression: "gzip",
  esbuild: {
    target: ["esnext"],
    format: "esm",
    bundle: !0,
    minify: !0,
    treeShaking: !0,
    platform: "browser"
  }
}, Rt = Y({}, At, {
  esbuild: {
    color: !0,
    globalName: "BundledCode",
    logLevel: "info",
    sourcemap: !1,
    incremental: !1
  },
  ascii: "ascii",
  filesystem: {
    files: z,
    get: Ys,
    set: Zs,
    resolve: Et,
    clear: () => z.clear()
  },
  init: {
    platform: Hs
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
}, Qs = (e, t, ...s) => {
  e.forEach((r) => {
    r[t](...s);
  });
}, Ke = ({ callback: e = () => {
}, scope: t = null, name: s = "event" }) => ({ callback: e, scope: t, name: s }), K = class extends St {
  constructor(e = "event") {
    super(), this.name = e;
  }
}, er = class extends St {
  constructor() {
    super();
  }
  getEvent(e) {
    let t = this.get(e);
    return t instanceof K ? t : (this.set(e, new K(e)), this.get(e));
  }
  newListener(e, t, s) {
    let r = this.getEvent(e);
    return r.add(Ke({ name: e, callback: t, scope: s })), r;
  }
  on(e, t, s) {
    if (typeof e > "u" || e == null)
      return this;
    typeof e == "string" && (e = e.trim().split(/\s/g));
    let r, n, i = typeof e == "object" && !Array.isArray(e), l = i ? t : s;
    return i || (n = t), Object.keys(e).forEach((o) => {
      r = i ? o : e[o], i && (n = e[o]), this.newListener(r, n, l);
    }, this), this;
  }
  removeListener(e, t, s) {
    let r = this.get(e);
    if (r instanceof K && t) {
      let n = Ke({ name: e, callback: t, scope: s });
      r.forEach((i, l) => {
        if (i.callback === n.callback && i.scope === n.scope)
          return r.remove(l);
      });
    }
    return r;
  }
  off(e, t, s) {
    if (typeof e > "u" || e == null)
      return this;
    typeof e == "string" && (e = e.trim().split(/\s/g));
    let r, n, i = typeof e == "object" && !Array.isArray(e), l = i ? t : s;
    return i || (n = t), Object.keys(e).forEach((o) => {
      r = i ? o : e[o], i && (n = e[o]), typeof n == "function" ? this.removeListener(r, n, l) : this.remove(r);
    }, this), this;
  }
  once(e, t, s) {
    if (typeof e > "u" || e == null)
      return this;
    typeof e == "string" && (e = e.trim().split(/\s/g));
    let r = typeof e == "object" && !Array.isArray(e);
    return Object.keys(e).forEach((n) => {
      let i = r ? n : e[n], l = r ? e[n] : t, o = r ? t : s, a = (...c) => {
        l.apply(o, c), this.removeListener(i, a, o);
      };
      this.newListener(i, a, o);
    }, this), this;
  }
  emit(e, ...t) {
    return typeof e > "u" || e == null ? this : (typeof e == "string" && (e = e.trim().split(/\s/g)), e.forEach((s) => {
      let r = this.get(s);
      r instanceof K && r.forEach((n) => {
        let { callback: i, scope: l } = n;
        i.apply(l, t);
      });
    }, this), this);
  }
  clear() {
    return Qs(this, "clear"), super.clear(), this;
  }
};
const tr = {
  "init.start": console.log,
  "init.complete": console.info,
  "init.error": console.error,
  "init.loading": console.warn,
  "logger.log": console.log,
  "logger.error": console.error,
  "logger.warn": console.warn,
  "logger.info": console.info
}, v = new er();
v.on(tr);
const k = {
  initialized: !1,
  assets: [],
  esbuild: null
}, sr = [
  "B",
  "kB",
  "MB",
  "GB",
  "TB",
  "PB",
  "EB",
  "ZB",
  "YB"
], rr = [
  "B",
  "kiB",
  "MiB",
  "GiB",
  "TiB",
  "PiB",
  "EiB",
  "ZiB",
  "YiB"
], nr = [
  "b",
  "kbit",
  "Mbit",
  "Gbit",
  "Tbit",
  "Pbit",
  "Ebit",
  "Zbit",
  "Ybit"
], ir = [
  "b",
  "kibit",
  "Mibit",
  "Gibit",
  "Tibit",
  "Pibit",
  "Eibit",
  "Zibit",
  "Yibit"
], Qe = (e, t, s) => {
  let r = e;
  return typeof t == "string" || Array.isArray(t) ? r = e.toLocaleString(t, s) : (t === !0 || s !== void 0) && (r = e.toLocaleString(void 0, s)), r;
};
function et(e, t) {
  if (!Number.isFinite(e))
    throw new TypeError(`Expected a finite number, got ${typeof e}: ${e}`);
  t = {
    bits: !1,
    binary: !1,
    ...t
  };
  const s = t.bits ? t.binary ? ir : nr : t.binary ? rr : sr;
  if (t.signed && e === 0)
    return ` 0 ${s[0]}`;
  const r = e < 0, n = r ? "-" : t.signed ? "+" : "";
  r && (e = -e);
  let i;
  if (t.minimumFractionDigits !== void 0 && (i = { minimumFractionDigits: t.minimumFractionDigits }), t.maximumFractionDigits !== void 0 && (i = { maximumFractionDigits: t.maximumFractionDigits, ...i }), e < 1) {
    const c = Qe(e, t.locale, i);
    return n + c + " " + s[0];
  }
  const l = Math.min(Math.floor(t.binary ? Math.log(e) / Math.log(1024) : Math.log10(e) / 3), s.length - 1);
  e /= (t.binary ? 1024 : 1e3) ** l, i || (e = e.toPrecision(3));
  const o = Qe(Number(e), t.locale, i), a = s[l];
  return n + o + " " + a;
}
const tt = {
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
function lr(e) {
  return e.replace(/\<br\>/g, `
`).replace(/\&/g, "&amp;").replace(/\"/g, "&quot;").replace(/\'/g, "&#39;").replace(/\</g, "&lt;").replace(/\>/g, "&gt;");
}
class or {
  constructor() {
    this.result = "", this._stack = [], this._bold = !1, this._underline = !1, this._link = !1;
  }
  text(t) {
    this.result += lr(t);
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
function ar(e) {
  e = e.trimEnd();
  let t = 0;
  const s = new or();
  for (let r of e.matchAll(/\x1B\[([\d;]+)m/g)) {
    const n = r[1];
    s.text(e.slice(t, r.index)), t = r.index + r[0].length, n === "0" ? s.reset() : n === "1" ? s.bold() : n === "4" ? s.underline() : tt[n] && s.color(tt[n]);
  }
  return t < e.length && s.text(e.slice(t)), s.done();
}
const st = async (e, t = "error", s = !0) => {
  const { formatMessages: r } = await import("./esbuild-c12617fc.mjs").then((i) => i.b);
  return (await r(e, { color: s, kind: t })).map((i) => s ? ar(i.replace(/(\s+)(\d+)(\s+)\│/g, `
$1$2$3\u2502`)) : i);
}, Br = {
  build: fr,
  init: vt
};
async function cr(e = "node") {
  try {
    switch (e) {
      case "node":
        return await import("esbuild");
      case "deno":
        return await import(
          /* @vite-ignore */
          `https://deno.land/x/esbuild@v${Ht}/mod.js`
        );
      default:
        return await import("./esbuild-c12617fc.mjs").then((t) => t.b);
    }
  } catch (t) {
    throw t;
  }
}
async function vt({ platform: e, ...t } = {}) {
  try {
    if (!k.initialized) {
      if (k.initialized = !0, v.emit("init.start"), k.esbuild = await cr(e), e !== "node" && e !== "deno") {
        const { default: s } = await import("./esbuild-wasm-38155f31.mjs");
        await k.esbuild.initialize({
          wasmModule: new WebAssembly.Module(await s()),
          ...t
        });
      }
      v.emit("init.complete");
    }
    return k.esbuild;
  } catch (s) {
    v.emit("init.error", s), console.error(s);
  }
}
async function fr(e = {}) {
  k.initialized || v.emit("init.loading");
  const t = Y({}, Rt, e), { build: s } = await vt(t.init), { define: r = {}, loader: n = {}, ...i } = t.esbuild ?? {};
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
          ...r
        },
        write: !1,
        outdir: "/",
        plugins: [
          Xs(v, k, t),
          ss(v, k, t),
          Ws(v, k, t),
          Bs(v, k, t),
          qs(v, k, t)
        ],
        ...i
      });
    } catch (c) {
      if (c.errors) {
        const u = [...await st(c.errors, "error", !1)], f = [...await st(c.errors, "error")];
        v.emit("logger.error", u, f);
        const g = (f.length > 1 ? `${f.length} error(s) ` : "") + "(if you are having trouble solving this issue, please create a new issue in the repo, https://github.com/okikio/bundle)";
        return v.emit("logger.error", g);
      } else
        throw c;
    }
    return l = await Promise.all([...k.assets].concat(a?.outputFiles)), o = await Promise.all(l?.map(({ path: c, text: u, contents: f }) => /\.map$/.test(c) ? { path: c, text: "", contents: Le("") } : (i?.logLevel == "verbose" && (/\.(wasm|png|jpeg|webp)$/.test(c) ? v.emit("logger.log", "Output File: " + c) : v.emit("logger.log", "Output File: " + c + `
` + u)), { path: c, text: u, contents: f }))), {
      content: o,
      ...a.outputFiles
    };
  } catch {
  }
}
async function Gr(e = [], t = {}) {
  const s = Y({}, Rt, t);
  let { compression: r = {} } = s, { type: n = "gzip", quality: i = 9 } = typeof r == "string" ? { type: r } : r ?? {}, l = et(e.reduce((u, { contents: f }) => u + f.byteLength, 0)), o = await (async () => {
    switch (n) {
      case "lz4":
        const { compress: u, getWASM: f } = await Promise.resolve().then(() => Mr);
        return await f(), async (h) => await u(h);
      case "brotli":
        const { compress: g, getWASM: m } = await Promise.resolve().then(() => kr);
        return await m(), async (h) => await g(h, h.length, i);
      default:
        const { gzip: p, getWASM: d } = await Promise.resolve().then(() => Cr);
        return await d(), async (h) => await p(h, i);
    }
  })(), a = await Promise.all(e.map(({ contents: u }) => o(u))), c = et(a.reduce((u, { length: f }) => u + f, 0));
  return {
    type: n,
    content: a,
    totalByteLength: l,
    totalCompressedSize: c,
    initialSize: `${l}`,
    size: `${c} (${n})`
  };
}
const Wr = (e, t = 300, s) => {
  let r;
  return function(...n) {
    let i = this, l = () => {
      r = null, s || e.apply(i, n);
    }, o = s && !r;
    clearTimeout(r), r = setTimeout(l, t), o && e.apply(i, n);
  };
}, Ue = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", Fe = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$", G = {};
function Be(e, t) {
  if (!G[e]) {
    G[e] = {};
    for (let s = 0; s < e.length; s++)
      G[e][e.charAt(s)] = s;
  }
  return G[e][t];
}
function ur(e) {
  if (e == null)
    return "";
  const t = fe(e, 6, (s) => Ue.charAt(s));
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
function hr(e) {
  return e == null ? "" : e == "" ? null : ue(e.length, 32, (t) => Be(Ue, e.charAt(t)));
}
function pr(e) {
  return e == null ? "" : fe(e, 6, (t) => Fe.charAt(t));
}
function dr(e) {
  return e == null ? "" : e == "" ? null : (e = e.replaceAll(" ", "+"), ue(e.length, 32, (t) => Be(Fe, e.charAt(t))));
}
function gr(e) {
  return fe(e, 16, String.fromCharCode);
}
function mr(e) {
  return e == null ? "" : e == "" ? null : ue(e.length, 32768, (t) => e.charCodeAt(t));
}
function fe(e, t, s) {
  if (e == null)
    return "";
  const r = [], n = {}, i = {};
  let l, o, a, c = "", u = "", f = "", g = 2, m = 3, p = 2, d = 0, h = 0;
  for (o = 0; o < e.length; o += 1)
    if (c = e.charAt(o), Object.prototype.hasOwnProperty.call(n, c) || (n[c] = m++, i[c] = !0), f = u + c, Object.prototype.hasOwnProperty.call(n, f))
      u = f;
    else {
      if (Object.prototype.hasOwnProperty.call(i, u)) {
        if (u.charCodeAt(0) < 256) {
          for (l = 0; l < p; l++)
            d = d << 1, h == t - 1 ? (h = 0, r.push(s(d)), d = 0) : h++;
          for (a = u.charCodeAt(0), l = 0; l < 8; l++)
            d = d << 1 | a & 1, h == t - 1 ? (h = 0, r.push(s(d)), d = 0) : h++, a = a >> 1;
        } else {
          for (a = 1, l = 0; l < p; l++)
            d = d << 1 | a, h == t - 1 ? (h = 0, r.push(s(d)), d = 0) : h++, a = 0;
          for (a = u.charCodeAt(0), l = 0; l < 16; l++)
            d = d << 1 | a & 1, h == t - 1 ? (h = 0, r.push(s(d)), d = 0) : h++, a = a >> 1;
        }
        g--, g == 0 && (g = Math.pow(2, p), p++), delete i[u];
      } else
        for (a = n[u], l = 0; l < p; l++)
          d = d << 1 | a & 1, h == t - 1 ? (h = 0, r.push(s(d)), d = 0) : h++, a = a >> 1;
      g--, g == 0 && (g = Math.pow(2, p), p++), n[f] = m++, u = String(c);
    }
  if (u !== "") {
    if (Object.prototype.hasOwnProperty.call(i, u)) {
      if (u.charCodeAt(0) < 256) {
        for (l = 0; l < p; l++)
          d = d << 1, h == t - 1 ? (h = 0, r.push(s(d)), d = 0) : h++;
        for (a = u.charCodeAt(0), l = 0; l < 8; l++)
          d = d << 1 | a & 1, h == t - 1 ? (h = 0, r.push(s(d)), d = 0) : h++, a = a >> 1;
      } else {
        for (a = 1, l = 0; l < p; l++)
          d = d << 1 | a, h == t - 1 ? (h = 0, r.push(s(d)), d = 0) : h++, a = 0;
        for (a = u.charCodeAt(0), l = 0; l < 16; l++)
          d = d << 1 | a & 1, h == t - 1 ? (h = 0, r.push(s(d)), d = 0) : h++, a = a >> 1;
      }
      g--, g == 0 && (g = Math.pow(2, p), p++), delete i[u];
    } else
      for (a = n[u], l = 0; l < p; l++)
        d = d << 1 | a & 1, h == t - 1 ? (h = 0, r.push(s(d)), d = 0) : h++, a = a >> 1;
    g--, g == 0 && (g = Math.pow(2, p), p++);
  }
  for (a = 2, l = 0; l < p; l++)
    d = d << 1 | a & 1, h == t - 1 ? (h = 0, r.push(s(d)), d = 0) : h++, a = a >> 1;
  for (; ; )
    if (d = d << 1, h == t - 1) {
      r.push(s(d));
      break;
    } else
      h++;
  return r.join("");
}
function ue(e, t, s) {
  let r = [], n = 4, i = 4, l = 3, o = "", a = [], c, u, f, g, m, p, d, h = { val: s(0), position: t, index: 1 };
  for (c = 0; c < 3; c += 1)
    r[c] = c;
  for (f = 0, m = Math.pow(2, 2), p = 1; p != m; )
    g = h.val & h.position, h.position >>= 1, h.position == 0 && (h.position = t, h.val = s(h.index++)), f |= (g > 0 ? 1 : 0) * p, p <<= 1;
  switch (f) {
    case 0:
      for (f = 0, m = Math.pow(2, 8), p = 1; p != m; )
        g = h.val & h.position, h.position >>= 1, h.position == 0 && (h.position = t, h.val = s(h.index++)), f |= (g > 0 ? 1 : 0) * p, p <<= 1;
      d = String.fromCharCode(f);
      break;
    case 1:
      for (f = 0, m = Math.pow(2, 16), p = 1; p != m; )
        g = h.val & h.position, h.position >>= 1, h.position == 0 && (h.position = t, h.val = s(h.index++)), f |= (g > 0 ? 1 : 0) * p, p <<= 1;
      d = String.fromCharCode(f);
      break;
    case 2:
      return "";
  }
  for (r[3] = d, u = d, a.push(d); ; ) {
    if (h.index > e)
      return "";
    for (f = 0, m = Math.pow(2, l), p = 1; p != m; )
      g = h.val & h.position, h.position >>= 1, h.position == 0 && (h.position = t, h.val = s(h.index++)), f |= (g > 0 ? 1 : 0) * p, p <<= 1;
    switch (d = f) {
      case 0:
        for (f = 0, m = Math.pow(2, 8), p = 1; p != m; )
          g = h.val & h.position, h.position >>= 1, h.position == 0 && (h.position = t, h.val = s(h.index++)), f |= (g > 0 ? 1 : 0) * p, p <<= 1;
        r[i++] = String.fromCharCode(f), d = i - 1, n--;
        break;
      case 1:
        for (f = 0, m = Math.pow(2, 16), p = 1; p != m; )
          g = h.val & h.position, h.position >>= 1, h.position == 0 && (h.position = t, h.val = s(h.index++)), f |= (g > 0 ? 1 : 0) * p, p <<= 1;
        r[i++] = String.fromCharCode(f), d = i - 1, n--;
        break;
      case 2:
        return a.join("");
    }
    if (n == 0 && (n = Math.pow(2, l), l++), r[d])
      o = r[d];
    else if (d === i && typeof u == "string")
      o = u + u.charAt(0);
    else
      return null;
    a.push(o), r[i++] = u + o.charAt(0), n--, u = o, n == 0 && (n = Math.pow(2, l), l++);
  }
}
const $r = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  keyStrBase64: Ue,
  keyStrUriSafe: Fe,
  baseReverseDic: G,
  getBaseValue: Be,
  compressToBase64: ur,
  decompressFromBase64: hr,
  compressToURL: pr,
  decompressFromURL: dr,
  compress: gr,
  decompress: mr,
  _compress: fe,
  _decompress: ue
}, Symbol.toStringTag, { value: "Module" })), { decompressFromURL: wr } = $r, Er = (e) => (e ?? "").split(/\],/).map((t) => t.replace(/\[|\]/g, "")), Xr = (e) => {
  try {
    const t = e.searchParams;
    let s = "", r = t.get("query") || t.get("q"), n = t.get("treeshake");
    if (r) {
      let o = r.trim().split(","), a = Er((n ?? "").trim());
      s += `// Click Build for the Bundled, Minified & Compressed package size
` + o.map((c, u) => {
        let f = a[u] && a[u].trim() !== "*" ? a[u].trim().split(",").join(", ") : "*", [
          ,
          ,
          g = "export",
          m
        ] = /^(\((.*)\))?(.*)/.exec(c);
        return `${g} ${f} from ${JSON.stringify(m)};`;
      }).join(`
`);
    }
    let i = t.get("share");
    i && (s += `
` + wr(i.trim()));
    let l = t.get("text");
    return l && (s += `
` + JSON.parse(/^["']/.test(l) && /["']$/.test(l) ? l : JSON.stringify("" + l).replace(/\\\\/g, "\\"))), s.trim();
  } catch {
  }
}, qr = (e) => {
  try {
    const s = e.searchParams.get("config") ?? "{}";
    return Y({}, At, JSON.parse(s || "{}"));
  } catch {
  }
}, yr = "2.0.0", ke = 256, W = Number.MAX_SAFE_INTEGER || 9007199254740991, se = 16;
let bt = 0;
const w = (e, t) => ({ index: bt++, pattern: e, regex: new RegExp(e, t ? "g" : void 0) }), j = "0|[1-9]\\d*", M = "[0-9]+", Ge = "\\d*[a-zA-Z-][a-zA-Z0-9-]*", _e = `(?:${j}|${Ge})`, Oe = `(?:${M}|${Ge})`, Ne = "[0-9A-Za-z-]+", Tt = `(${j})\\.(${j})\\.(${j})`, kt = `(${M})\\.(${M})\\.(${M})`, Z = `(?:\\+(${Ne}(?:\\.${Ne})*))`, We = `(?:-(${_e}(?:\\.${_e})*))`, Xe = `(?:-?(${Oe}(?:\\.${Oe})*))`, we = `v?${Tt}${We}?${Z}?`, Q = `[v=\\s]*${kt}${Xe}?${Z}?`, re = `${j}|x|X|\\*`, ne = `${M}|x|X|\\*`, C = "((?:<|>)?=?)", P = `[v=\\s]*(${re})(?:\\.(${re})(?:\\.(${re})(?:${We})?${Z}?)?)?`, D = `[v=\\s]*(${ne})(?:\\.(${ne})(?:\\.(${ne})(?:${Xe})?${Z}?)?)?`, rt = `(^|[^\\d])(\\d{1,${se}})(?:\\.(\\d{1,${se}}))?(?:\\.(\\d{1,${se}}))?(?:$|[^\\d])`, Ee = "(?:~>?)", ye = "(?:\\^)", y = {
  NUMERICIDENTIFIER: w(j),
  NUMERICIDENTIFIERLOOSE: w(M),
  NONNUMERICIDENTIFIER: w(Ge),
  MAINVERSION: w(Tt),
  MAINVERSIONLOOSE: w(kt),
  PRERELEASEIDENTIFIER: w(_e),
  PRERELEASEIDENTIFIERLOOSE: w(Oe),
  PRERELEASE: w(We),
  PRERELEASELOOSE: w(Xe),
  BUILDIDENTIFIER: w(Ne),
  BUILD: w(Z),
  FULLPLAIN: w(we),
  FULL: w(`^${we}$`),
  LOOSEPLAIN: w(Q),
  LOOSE: w(`^${Q}$`),
  GTLT: w(C),
  XRANGEIDENTIFIERLOOSE: w(ne),
  XRANGEIDENTIFIER: w(re),
  XRANGEPLAIN: w(P),
  XRANGEPLAINLOOSE: w(D),
  XRANGE: w(`^${C}\\s*${P}$`),
  XRANGELOOSE: w(`^${C}\\s*${D}$`),
  COERCE: w(rt),
  COERCERTL: w(rt, !0),
  LONETILDE: w("(?:~>?)"),
  TILDETRIM: w(`(\\s*)${Ee}\\s+`, !0),
  TILDE: w(`^${Ee}${P}$`),
  TILDELOOSE: w(`^${Ee}${D}$`),
  LONECARET: w("(?:\\^)"),
  CARETTRIM: w(`(\\s*)${ye}\\s+`, !0),
  CARET: w(`^${ye}${P}$`),
  CARETLOOSE: w(`^${ye}${D}$`),
  COMPARATORLOOSE: w(`^${C}\\s*(${Q})$|^$`),
  COMPARATOR: w(`^${C}\\s*(${we})$|^$`),
  COMPARATORTRIM: w(`(\\s*)${C}\\s*(${Q}|${P})`, !0),
  HYPHENRANGE: w(`^\\s*(${P})\\s+-\\s+(${P})\\s*$`),
  HYPHENRANGELOOSE: w(`^\\s*(${D})\\s+-\\s+(${D})\\s*$`),
  STAR: w("(<|>)?=?\\s*\\*"),
  GTE0: w("^\\s*>=\\s*0\\.0\\.0\\s*$"),
  GTE0PRE: w("^\\s*>=\\s*0\\.0\\.0-0\\s*$")
}, Ar = ["includePrerelease", "loose", "rtl"], he = (e) => e ? typeof e != "object" ? { loose: !0 } : Ar.filter((t) => e[t]).reduce((t, s) => (t[s] = !0, t), {}) : {}, xe = /^[0-9]+$/, X = (e, t) => {
  const s = xe.test(e), r = xe.test(t);
  let n = e, i = t;
  return s && r && (n = +e, i = +t), n === i ? 0 : s && !r ? -1 : r && !s ? 1 : n < i ? -1 : 1;
};
class _ {
  constructor(t, s) {
    if (s = he(s), t instanceof _) {
      if (t.loose === !!s.loose && t.includePrerelease === !!s.includePrerelease)
        return t;
      t = t.version;
    } else if (typeof t != "string")
      throw new TypeError(`Invalid Version: ${t}`);
    if (t.length > ke)
      throw new TypeError(`version is longer than ${ke} characters`);
    this.options = s, this.loose = !!s.loose, this.includePrerelease = !!s.includePrerelease;
    const r = t.trim().match(s.loose ? y.LOOSE.regex : y.FULL.regex);
    if (!r)
      throw new TypeError(`Invalid Version: ${t}`);
    if (this.raw = t, this.major = +r[1], this.minor = +r[2], this.patch = +r[3], this.major > W || this.major < 0)
      throw new TypeError("Invalid major version");
    if (this.minor > W || this.minor < 0)
      throw new TypeError("Invalid minor version");
    if (this.patch > W || this.patch < 0)
      throw new TypeError("Invalid patch version");
    r[4] ? this.prerelease = r[4].split(".").map((n) => {
      if (/^[0-9]+$/.test(n)) {
        const i = +n;
        if (i >= 0 && i < W)
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
    if (!(t instanceof _)) {
      if (typeof t == "string" && t === this.version)
        return 0;
      t = new _(t, this.options);
    }
    return t.version === this.version ? 0 : this.compareMain(t) || this.comparePre(t);
  }
  compareMain(t) {
    return t instanceof _ || (t = new _(t, this.options)), X(this.major, t.major) || X(this.minor, t.minor) || X(this.patch, t.patch);
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
      const r = this.prerelease[s], n = t.prerelease[s];
      if (r === void 0 && n === void 0)
        return 0;
      if (n === void 0)
        return 1;
      if (r === void 0)
        return -1;
      if (r === n)
        continue;
      return X(r, n);
    } while (++s);
  }
}
const le = Symbol("SemVer ANY");
class pe {
  constructor(t, s) {
    if (s = he(s), t instanceof pe) {
      if (t.loose === !!s.loose)
        return t;
      t = t.value;
    }
    this.options = s, this.loose = !!s.loose, this.parse(t), this.semver === le ? this.value = "" : this.value = this.operator + this.semver.version;
  }
  parse(t) {
    const s = this.options.loose ? y.COMPARATORLOOSE.regex : y.COMPARATOR.regex, r = t.match(s);
    if (!r)
      throw new TypeError(`Invalid comparator: ${t}`);
    this.operator = r[1] !== void 0 ? r[1] : "", this.operator === "=" && (this.operator = ""), r[2] ? this.semver = new _(r[2], this.options.loose) : this.semver = le;
  }
  toString() {
    return this.value;
  }
}
const F = /* @__PURE__ */ new Map(), ee = /* @__PURE__ */ new Map(), Rr = 1e3, _t = "$1^", Ot = "$1~", Nt = "$1$2$3", Pe = (e) => e.value === "<0.0.0-0", xt = (e) => e.value === "", Pt = (e, t) => (e = Ct(e, t), e = It(e, t), e = jt(e, t), e = zt(e), e), S = (e) => !e || e.toLowerCase() === "x" || e === "*", It = (e, t) => e.trim().split(/\s+/).map((s) => Lt(s, t)).join(" "), Lt = (e, t) => {
  const s = t.loose ? y.TILDELOOSE.regex : y.TILDE.regex;
  return e.replace(s, (r, n, i, l, o) => {
    let a;
    return S(n) ? a = "" : S(i) ? a = `>=${n}.0.0 <${+n + 1}.0.0-0` : S(l) ? a = `>=${n}.${i}.0 <${n}.${+i + 1}.0-0` : o ? a = `>=${n}.${i}.${l}-${o} <${n}.${+i + 1}.0-0` : a = `>=${n}.${i}.${l} <${n}.${+i + 1}.0-0`, a;
  });
}, Ct = (e, t) => e.trim().split(/\s+/).map((s) => Dt(s, t)).join(" "), Dt = (e, t) => {
  const s = t.loose ? y.CARETLOOSE.regex : y.CARET.regex, r = t.includePrerelease ? "-0" : "";
  return e.replace(s, (n, i, l, o, a) => {
    let c;
    return S(i) ? c = "" : S(l) ? c = `>=${i}.0.0${r} <${+i + 1}.0.0-0` : S(o) ? i === "0" ? c = `>=${i}.${l}.0${r} <${i}.${+l + 1}.0-0` : c = `>=${i}.${l}.0${r} <${+i + 1}.0.0-0` : a ? i === "0" ? l === "0" ? c = `>=${i}.${l}.${o}-${a} <${i}.${l}.${+o + 1}-0` : c = `>=${i}.${l}.${o}-${a} <${i}.${+l + 1}.0-0` : c = `>=${i}.${l}.${o}-${a} <${+i + 1}.0.0-0` : i === "0" ? l === "0" ? c = `>=${i}.${l}.${o}${r} <${i}.${l}.${+o + 1}-0` : c = `>=${i}.${l}.${o}${r} <${i}.${+l + 1}.0-0` : c = `>=${i}.${l}.${o} <${+i + 1}.0.0-0`, c;
  });
}, jt = (e, t) => e.split(/\s+/).map((s) => Mt(s, t)).join(" "), Mt = (e, t) => {
  e = e.trim();
  const s = t.loose ? y.XRANGELOOSE.regex : y.XRANGE.regex;
  return e.replace(s, (r, n, i, l, o, a) => {
    const c = S(i), u = c || S(l), f = u || S(o), g = f;
    return n === "=" && g && (n = ""), a = t.includePrerelease ? "-0" : "", c ? n === ">" || n === "<" ? r = "<0.0.0-0" : r = "*" : n && g ? (u && (l = 0), o = 0, n === ">" ? (n = ">=", u ? (i = +i + 1, l = 0, o = 0) : (l = +l + 1, o = 0)) : n === "<=" && (n = "<", u ? i = +i + 1 : l = +l + 1), n === "<" && (a = "-0"), r = `${n + i}.${l}.${o}${a}`) : u ? r = `>=${i}.0.0${a} <${+i + 1}.0.0-0` : f && (r = `>=${i}.${l}.0${a} <${i}.${+l + 1}.0-0`), r;
  });
}, zt = (e, t) => e.trim().replace(y.STAR.regex, ""), Ut = (e, t) => e.trim().replace(y[t.includePrerelease ? "GTE0PRE" : "GTE0"].regex, ""), Ft = (e) => (t, s, r, n, i, l, o, a, c, u, f, g, m) => (S(r) ? s = "" : S(n) ? s = `>=${r}.0.0${e ? "-0" : ""}` : S(i) ? s = `>=${r}.${n}.0${e ? "-0" : ""}` : l ? s = `>=${s}` : s = `>=${s}${e ? "-0" : ""}`, S(c) ? a = "" : S(u) ? a = `<${+c + 1}.0.0-0` : S(f) ? a = `<${c}.${+u + 1}.0-0` : g ? a = `<=${c}.${u}.${f}-${g}` : e ? a = `<${c}.${u}.${+f + 1}-0` : a = `<=${a}`, `${s} ${a}`.trim()), Bt = (e, t, s) => {
  for (let r = 0; r < e.length; r++)
    if (!e[r].test(t))
      return !1;
  if (t.prerelease.length && !s.includePrerelease) {
    for (let r = 0; r < e.length; r++)
      if (e[r].semver !== le && e[r].semver.prerelease.length > 0) {
        const n = e[r].semver;
        if (n.major === t.major && n.minor === t.minor && n.patch === t.patch)
          return !0;
      }
    return !1;
  }
  return !0;
};
class H {
  constructor(t, s) {
    if (s = he(s), t instanceof H)
      return t.loose === !!s.loose && t.includePrerelease === !!s.includePrerelease ? t : new H(t.raw, s);
    if (this.options = s, this.loose = !!s.loose, this.includePrerelease = !!s.includePrerelease, this.raw = t, this.set = t.split("||").map((r) => this.parseRange(r.trim())).filter((r) => r.length), !this.set.length)
      throw new TypeError(`Invalid SemVer Range: ${t}`);
    if (this.set.length > 1) {
      const r = this.set[0];
      if (this.set = this.set.filter((n) => !Pe(n[0])), this.set.length === 0)
        this.set = [r];
      else if (this.set.length > 1) {
        for (const n of this.set)
          if (n.length === 1 && xt(n[0])) {
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
    if (F.has(r))
      return ee.set(r, Date.now()), F.get(r);
    const n = this.options.loose, i = n ? y.HYPHENRANGELOOSE.regex : y.HYPHENRANGE.regex;
    t = t.replace(i, Ft(this.options.includePrerelease)), t = t.replace(y.COMPARATORTRIM.regex, Nt), t = t.replace(y.TILDETRIM.regex, Ot), t = t.replace(y.CARETTRIM.regex, _t), t = t.split(/\s+/).join(" ");
    let l = t.split(" ").map((f) => Pt(f, this.options)).join(" ").split(/\s+/).map((f) => Ut(f, this.options));
    n && (l = l.filter((f) => !!f.match(y.COMPARATORLOOSE.regex)));
    const o = /* @__PURE__ */ new Map(), a = l.map((f) => new pe(f, this.options));
    for (const f of a) {
      if (Pe(f))
        return [f];
      o.set(f.value, f);
    }
    o.size > 1 && o.has("") && o.delete("");
    const c = [...o.values()];
    let u = c;
    if (F.set(r, u), ee.set(r, Date.now()), F.size >= Rr) {
      let g = [...ee.entries()].sort((m, p) => m[1] - p[1])[0][0];
      F.delete(g), ee.delete(g);
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
      if (Bt(this.set[s], t, this.options))
        return !0;
    return !1;
  }
}
function Ie(e, t, s) {
  let r = null, n = null, i = null;
  try {
    i = new H(t, s);
  } catch {
    return null;
  }
  return e.forEach((l) => {
    i.test(l) && (!r || n.compare(l) === -1) && (r = l, n = new _(r, s));
  }), r;
}
const Hr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SEMVER_SPEC_VERSION: yr,
  MAX_LENGTH: ke,
  MAX_SAFE_INTEGER: W,
  MAX_SAFE_COMPONENT_LENGTH: se,
  get R() {
    return bt;
  },
  createToken: w,
  tokens: y,
  parseOptions: he,
  numeric: xe,
  compareIdentifiers: X,
  SemVer: _,
  ANY: le,
  Comparator: pe,
  caretTrimReplace: _t,
  tildeTrimReplace: Ot,
  comparatorTrimReplace: Nt,
  isNullSet: Pe,
  isAny: xt,
  parseComparator: Pt,
  isX: S,
  replaceTildes: It,
  replaceTilde: Lt,
  replaceCarets: Ct,
  replaceCaret: Dt,
  replaceXRanges: jt,
  replaceXRange: Mt,
  replaceStars: zt,
  replaceGTE0: Ut,
  hyphenReplace: Ft,
  testSet: Bt,
  Range: H,
  maxSatisfying: Ie,
  default: Ie
}, Symbol.toStringTag, { value: "Module" })), de = (e) => {
  const t = "https://registry.npmjs.com";
  let { name: s, version: r, path: n } = ce(e), i = `${t}/-/v1/search?text=${encodeURIComponent(s)}&popularity=0.5&size=30`, l = `${t}/${s}/${r}`, o = `${t}/${s}`;
  return { searchURL: i, packageURL: o, packageVersionURL: l, version: r, name: s, path: n };
}, Yr = async (e) => {
  let { searchURL: t } = de(e), s;
  try {
    s = await (await oe(t, !1)).json();
  } catch (n) {
    throw console.warn(n), n;
  }
  return { packages: s?.objects, info: s };
}, Gt = async (e) => {
  let { packageURL: t } = de(e);
  try {
    return await (await oe(t, !1)).json();
  } catch (s) {
    throw console.warn(s), s;
  }
}, Sr = async (e) => {
  try {
    let t = await Gt(e), s = Object.keys(t.versions), r = t["dist-tags"];
    return { versions: s, tags: r };
  } catch (t) {
    throw console.warn(t), t;
  }
}, vr = async (e) => {
  try {
    let { version: t } = de(e), s = await Sr(e);
    if (s) {
      const { versions: r, tags: n } = s;
      return t in n && (t = n[t]), r.includes(t) ? t : Ie(r, t);
    }
  } catch (t) {
    throw console.warn(t), t;
  }
}, Zr = async (e) => {
  try {
    let { name: t } = de(e), s = await vr(e);
    return await Gt(`${t}@${s}`);
  } catch (t) {
    throw console.warn(t), t;
  }
};
let Ae;
const qe = async () => {
  if (Ae)
    return Ae;
  const e = await import("./brotli-1fa8b7e9.mjs"), { default: t, source: s } = e;
  return await t(await s()), Ae = e;
};
async function br(e, t = 4096, s = 6, r = 22) {
  const { compress: n } = await qe();
  return n(e, t, s, r);
}
async function Tr(e, t = 4096) {
  const { decompress: s } = await qe();
  return s(e, t);
}
const kr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getWASM: qe,
  compress: br,
  decompress: Tr
}, Symbol.toStringTag, { value: "Module" }));
let Wt, Re;
const L = async (e) => {
  if (Re)
    return Re;
  const t = await import("./denoflate-82001750.mjs"), { default: s } = t, { wasm: r } = await import("./gzip-dfcdb483.mjs");
  return Wt = await s(e ?? await r()), Re = t;
};
async function _r(e, t) {
  return (await L()).deflate(e, t);
}
async function Or(e) {
  return (await L()).inflate(e);
}
async function Nr(e, t) {
  return (await L()).gzip(e, t);
}
async function xr(e) {
  return (await L()).gunzip(e);
}
async function Pr(e, t) {
  return (await L()).zlib(e, t);
}
async function Ir(e) {
  return (await L()).unzlib(e);
}
const Lr = Wt, Cr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getWASM: L,
  deflate: _r,
  inflate: Or,
  gzip: Nr,
  gunzip: xr,
  zlib: Pr,
  unzlib: Ir,
  default: Lr
}, Symbol.toStringTag, { value: "Module" }));
let Se;
const He = async () => {
  if (Se)
    return Se;
  const e = await import("./lz4-27585704.mjs"), { default: t, source: s } = e;
  return await t(await s()), Se = e;
};
async function Dr(e) {
  const { lz4_compress: t } = await He();
  return t(e);
}
async function jr(e) {
  const { lz4_decompress: t } = await He();
  return t(e);
}
const Mr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getWASM: He,
  compress: Dr,
  decompress: jr
}, Symbol.toStringTag, { value: "Module" }));
function zr(e) {
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
function Ur(e) {
  const t = Xt(e), s = new Uint8Array(t.length);
  for (let r = 0; r < s.length; ++r)
    s[r] = t.charCodeAt(r);
  return s.buffer;
}
function Xt(e) {
  return atob(e);
}
const Vr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  encode: zr,
  decode: Ur,
  decodeString: Xt
}, Symbol.toStringTag, { value: "Module" }));
export {
  Xs as ALIAS,
  Je as ALIAS_NAMESPACE,
  me as ALIAS_RESOLVE,
  or as AnsiBuffer,
  ir as BIBIT_UNITS,
  rr as BIBYTE_UNITS,
  nr as BIT_UNITS,
  sr as BYTE_UNITS,
  it as CACHE,
  rs as CACHE_NAME,
  Bs as CDN,
  Ve as CDN_NAMESPACE,
  Te as CDN_RESOLVE,
  U as DEFAULT_CDN_HOST,
  Rt as DefaultConfig,
  Qt as DeprecatedAPIs,
  Vt as EMPTY_EXPORT,
  tt as ESCAPE_TO_COLOR,
  v as EVENTS,
  tr as EVENTS_OPTS,
  ss as EXTERNAL,
  B as EXTERNALS_NAMESPACE,
  At as EasyDefaultConfig,
  es as ExternalPackages,
  z as FileSystem,
  Ws as HTTP,
  x as HTTP_NAMESPACE,
  $t as HTTP_RESOLVE,
  Br as INPUT_EVENTS,
  Hs as PLATFORM_AUTO,
  Kt as PolyfillKeys,
  Jt as PolyfillMap,
  Ds as RESOLVE_EXTENSIONS,
  Us as RE_NON_SCOPED,
  zs as RE_SCOPED,
  k as STATE,
  $e as VIRTUAL_FILESYSTEM_NAMESPACE,
  qs as VIRTUAL_FS,
  ar as ansi,
  b as bail,
  Vr as base64,
  kr as brotli,
  fr as build,
  et as bytes,
  Wr as debounce,
  ve as decode,
  Y as deepAssign,
  Ks as deepDiff,
  yt as deepEqual,
  Cr as denoflate,
  Le as encode,
  Gs as fetchAssets,
  te as fetchPkg,
  et as formatBytes,
  Yt as getCDNOrigin,
  nt as getCDNStyle,
  T as getCDNUrl,
  cr as getESBUILD,
  Ys as getFile,
  Gt as getPackage,
  Sr as getPackageVersions,
  Yr as getPackages,
  Zt as getPureImportPath,
  de as getRegistryURL,
  oe as getRequest,
  Zr as getResolvedPackage,
  Et as getResolvedPath,
  Gr as getSize,
  lr as htmlEscape,
  mt as inferLoader,
  vt as init,
  wt as isAlias,
  ts as isExternal,
  I as isObject,
  Vs as isPrimitive,
  Js as isValidKey,
  Ms as legacy,
  O as loop,
  Mr as lz4,
  $r as lzstring,
  Ye as newRequest,
  qr as parseConfig,
  ce as parsePackageName,
  Xr as parseShareQuery,
  Er as parseTreeshakeExports,
  Fr as path,
  et as prettyBytes,
  ar as render,
  js as resolveExports,
  Fs as resolveImports,
  vr as resolveVersion,
  Qr as schema,
  Hr as semver,
  Zs as setFile,
  Qe as toLocaleString,
  ze as toName
};
//# sourceMappingURL=index.mjs.map
