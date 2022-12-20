function Et(X, pe) {
  for (var re = 0; re < pe.length; re++) {
    const se = pe[re];
    if (typeof se != "string" && !Array.isArray(se)) {
      for (const ie in se)
        if (ie !== "default" && !(ie in X)) {
          const me = Object.getOwnPropertyDescriptor(se, ie);
          me && Object.defineProperty(X, ie, me.get ? me : {
            enumerable: !0,
            get: () => se[ie]
          });
        }
    }
  }
  return Object.freeze(Object.defineProperty(X, Symbol.toStringTag, { value: "Module" }));
}
function kt(X) {
  return X && X.__esModule && Object.prototype.hasOwnProperty.call(X, "default") ? X.default : X;
}
var Te = { exports: {} };
(function(X) {
  ((pe) => {
    var re = Object.defineProperty, se = Object.getOwnPropertyDescriptor, ie = Object.getOwnPropertyNames, me = Object.prototype.hasOwnProperty, Je = (t, n) => {
      for (var r in n)
        re(t, r, { get: n[r], enumerable: !0 });
    }, Ye = (t, n, r, c) => {
      if (n && typeof n == "object" || typeof n == "function")
        for (let m of ie(n))
          !me.call(t, m) && m !== r && re(t, m, { get: () => n[m], enumerable: !(c = se(n, m)) || c.enumerable });
      return t;
    }, He = (t) => Ye(re({}, "__esModule", { value: !0 }), t), te = (t, n, r) => new Promise((c, m) => {
      var g = (f) => {
        try {
          v(r.next(f));
        } catch (k) {
          m(k);
        }
      }, u = (f) => {
        try {
          v(r.throw(f));
        } catch (k) {
          m(k);
        }
      }, v = (f) => f.done ? c(f.value) : Promise.resolve(f.value).then(g, u);
      v((r = r.apply(t, n)).next());
    }), ye = {};
    Je(ye, {
      analyzeMetafile: () => gt,
      analyzeMetafileSync: () => bt,
      build: () => ft,
      buildSync: () => pt,
      default: () => _t,
      formatMessages: () => mt,
      formatMessagesSync: () => wt,
      initialize: () => vt,
      serve: () => dt,
      transform: () => ht,
      transformSync: () => yt,
      version: () => ct
    }), pe.exports = He(ye);
    function Oe(t) {
      let n = (c) => {
        if (c === null)
          r.write8(0);
        else if (typeof c == "boolean")
          r.write8(1), r.write8(+c);
        else if (typeof c == "number")
          r.write8(2), r.write32(c | 0);
        else if (typeof c == "string")
          r.write8(3), r.write(K(c));
        else if (c instanceof Uint8Array)
          r.write8(4), r.write(c);
        else if (c instanceof Array) {
          r.write8(5), r.write32(c.length);
          for (let m of c)
            n(m);
        } else {
          let m = Object.keys(c);
          r.write8(6), r.write32(m.length);
          for (let g of m)
            r.write(K(g)), n(c[g]);
        }
      }, r = new Pe();
      return r.write32(0), r.write32(t.id << 1 | +!t.isRequest), n(t.value), $e(r.buf, r.len - 4, 0), r.buf.subarray(0, r.len);
    }
    function Qe(t) {
      let n = () => {
        switch (r.read8()) {
          case 0:
            return null;
          case 1:
            return !!r.read8();
          case 2:
            return r.read32();
          case 3:
            return ae(r.read());
          case 4:
            return r.read();
          case 5: {
            let u = r.read32(), v = [];
            for (let f = 0; f < u; f++)
              v.push(n());
            return v;
          }
          case 6: {
            let u = r.read32(), v = {};
            for (let f = 0; f < u; f++)
              v[ae(r.read())] = n();
            return v;
          }
          default:
            throw new Error("Invalid packet");
        }
      }, r = new Pe(t), c = r.read32(), m = (c & 1) === 0;
      c >>>= 1;
      let g = n();
      if (r.ptr !== t.length)
        throw new Error("Invalid packet");
      return { id: c, isRequest: m, value: g };
    }
    var Pe = class {
      constructor(t = new Uint8Array(1024)) {
        this.buf = t, this.len = 0, this.ptr = 0;
      }
      _write(t) {
        if (this.len + t > this.buf.length) {
          let n = new Uint8Array((this.len + t) * 2);
          n.set(this.buf), this.buf = n;
        }
        return this.len += t, this.len - t;
      }
      write8(t) {
        let n = this._write(1);
        this.buf[n] = t;
      }
      write32(t) {
        let n = this._write(4);
        $e(this.buf, t, n);
      }
      write(t) {
        let n = this._write(4 + t.length);
        $e(this.buf, t.length, n), this.buf.set(t, n + 4);
      }
      _read(t) {
        if (this.ptr + t > this.buf.length)
          throw new Error("Invalid packet");
        return this.ptr += t, this.ptr - t;
      }
      read8() {
        return this.buf[this._read(1)];
      }
      read32() {
        return Re(this.buf, this._read(4));
      }
      read() {
        let t = this.read32(), n = new Uint8Array(t), r = this._read(n.length);
        return n.set(this.buf.subarray(r, r + t)), n;
      }
    }, K, ae, ke;
    if (typeof TextEncoder < "u" && typeof TextDecoder < "u") {
      let t = new TextEncoder(), n = new TextDecoder();
      K = (r) => t.encode(r), ae = (r) => n.decode(r), ke = 'new TextEncoder().encode("")';
    } else if (typeof Buffer < "u")
      K = (t) => Buffer.from(t), ae = (t) => {
        let { buffer: n, byteOffset: r, byteLength: c } = t;
        return Buffer.from(n, r, c).toString();
      }, ke = 'Buffer.from("")';
    else
      throw new Error("No UTF-8 codec found");
    if (!(K("") instanceof Uint8Array))
      throw new Error(`Invariant violation: "${ke} instanceof Uint8Array" is incorrectly false

This indicates that your JavaScript environment is broken. You cannot use
esbuild in this environment because esbuild relies on this invariant. This
is not a problem with esbuild. You need to fix your environment instead.
`);
    function Re(t, n) {
      return t[n++] | t[n++] << 8 | t[n++] << 16 | t[n++] << 24;
    }
    function $e(t, n, r) {
      t[r++] = n, t[r++] = n >> 8, t[r++] = n >> 16, t[r++] = n >> 24;
    }
    var Y = JSON.stringify, Ue = "warning", De = "silent";
    function Ae(t) {
      if (G(t, "target"), t.indexOf(",") >= 0)
        throw new Error(`Invalid target: ${t}`);
      return t;
    }
    var we = () => null, F = (t) => typeof t == "boolean" ? null : "a boolean", Xe = (t) => typeof t == "boolean" || typeof t == "object" && !Array.isArray(t) ? null : "a boolean or an object", $ = (t) => typeof t == "string" ? null : "a string", be = (t) => t instanceof RegExp ? null : "a RegExp object", ue = (t) => typeof t == "number" && t === (t | 0) ? null : "an integer", Se = (t) => typeof t == "function" ? null : "a function", L = (t) => Array.isArray(t) ? null : "an array", q = (t) => typeof t == "object" && t !== null && !Array.isArray(t) ? null : "an object", Ke = (t) => t instanceof WebAssembly.Module ? null : "a WebAssembly.Module", qe = (t) => typeof t == "object" && t !== null ? null : "an array or an object", Ce = (t) => typeof t == "object" && !Array.isArray(t) ? null : "an object or null", Ie = (t) => typeof t == "string" || typeof t == "boolean" ? null : "a string or a boolean", Ze = (t) => typeof t == "string" || typeof t == "object" && t !== null && !Array.isArray(t) ? null : "a string or an object", et = (t) => typeof t == "string" || Array.isArray(t) ? null : "a string or an array", Me = (t) => typeof t == "string" || t instanceof Uint8Array ? null : "a string or a Uint8Array", tt = (t) => typeof t == "string" || t instanceof URL ? null : "a string or a URL";
    function i(t, n, r, c) {
      let m = t[r];
      if (n[r + ""] = !0, m === void 0)
        return;
      let g = c(m);
      if (g !== null)
        throw new Error(`${Y(r)} must be ${g}`);
      return m;
    }
    function W(t, n, r) {
      for (let c in t)
        if (!(c in n))
          throw new Error(`Invalid option ${r}: ${Y(c)}`);
    }
    function nt(t) {
      let n = /* @__PURE__ */ Object.create(null), r = i(t, n, "wasmURL", tt), c = i(t, n, "wasmModule", Ke), m = i(t, n, "worker", F);
      return W(t, n, "in initialize() call"), {
        wasmURL: r,
        wasmModule: c,
        worker: m
      };
    }
    function Ne(t) {
      let n;
      if (t !== void 0) {
        n = /* @__PURE__ */ Object.create(null);
        for (let r in t) {
          let c = t[r];
          if (typeof c == "string" || c === !1)
            n[r] = c;
          else
            throw new Error(`Expected ${Y(r)} in mangle cache to map to either a string or false`);
        }
      }
      return n;
    }
    function ve(t, n, r, c, m) {
      let g = i(n, r, "color", F), u = i(n, r, "logLevel", $), v = i(n, r, "logLimit", ue);
      g !== void 0 ? t.push(`--color=${g}`) : c && t.push("--color=true"), t.push(`--log-level=${u || m}`), t.push(`--log-limit=${v || 0}`);
    }
    function G(t, n, r) {
      if (typeof t != "string")
        throw new Error(`Expected value for ${n}${r !== void 0 ? " " + Y(r) : ""} to be a string, got ${typeof t} instead`);
      return t;
    }
    function Fe(t, n, r) {
      let c = i(n, r, "legalComments", $), m = i(n, r, "sourceRoot", $), g = i(n, r, "sourcesContent", F), u = i(n, r, "target", et), v = i(n, r, "format", $), f = i(n, r, "globalName", $), k = i(n, r, "mangleProps", be), T = i(n, r, "reserveProps", be), P = i(n, r, "mangleQuoted", F), D = i(n, r, "minify", F), S = i(n, r, "minifySyntax", F), R = i(n, r, "minifyWhitespace", F), x = i(n, r, "minifyIdentifiers", F), A = i(n, r, "drop", L), M = i(n, r, "charset", $), w = i(n, r, "treeShaking", F), l = i(n, r, "ignoreAnnotations", F), s = i(n, r, "jsx", $), a = i(n, r, "jsxFactory", $), h = i(n, r, "jsxFragment", $), b = i(n, r, "jsxImportSource", $), _ = i(n, r, "jsxDev", F), d = i(n, r, "jsxSideEffects", F), e = i(n, r, "define", q), o = i(n, r, "logOverride", q), p = i(n, r, "supported", q), y = i(n, r, "pure", L), j = i(n, r, "keepNames", F), C = i(n, r, "platform", $);
      if (c && t.push(`--legal-comments=${c}`), m !== void 0 && t.push(`--source-root=${m}`), g !== void 0 && t.push(`--sources-content=${g}`), u && (Array.isArray(u) ? t.push(`--target=${Array.from(u).map(Ae).join(",")}`) : t.push(`--target=${Ae(u)}`)), v && t.push(`--format=${v}`), f && t.push(`--global-name=${f}`), C && t.push(`--platform=${C}`), D && t.push("--minify"), S && t.push("--minify-syntax"), R && t.push("--minify-whitespace"), x && t.push("--minify-identifiers"), M && t.push(`--charset=${M}`), w !== void 0 && t.push(`--tree-shaking=${w}`), l && t.push("--ignore-annotations"), A)
        for (let O of A)
          t.push(`--drop:${G(O, "drop")}`);
      if (k && t.push(`--mangle-props=${k.source}`), T && t.push(`--reserve-props=${T.source}`), P !== void 0 && t.push(`--mangle-quoted=${P}`), s && t.push(`--jsx=${s}`), a && t.push(`--jsx-factory=${a}`), h && t.push(`--jsx-fragment=${h}`), b && t.push(`--jsx-import-source=${b}`), _ && t.push("--jsx-dev"), d && t.push("--jsx-side-effects"), e)
        for (let O in e) {
          if (O.indexOf("=") >= 0)
            throw new Error(`Invalid define: ${O}`);
          t.push(`--define:${O}=${G(e[O], "define", O)}`);
        }
      if (o)
        for (let O in o) {
          if (O.indexOf("=") >= 0)
            throw new Error(`Invalid log override: ${O}`);
          t.push(`--log-override:${O}=${G(o[O], "log override", O)}`);
        }
      if (p)
        for (let O in p) {
          if (O.indexOf("=") >= 0)
            throw new Error(`Invalid supported: ${O}`);
          const U = p[O];
          if (typeof U != "boolean")
            throw new Error(`Expected value for supported ${Y(O)} to be a boolean, got ${typeof U} instead`);
          t.push(`--supported:${O}=${U}`);
        }
      if (y)
        for (let O of y)
          t.push(`--pure:${G(O, "pure")}`);
      j && t.push("--keep-names");
    }
    function rt(t, n, r, c, m) {
      var g;
      let u = [], v = [], f = /* @__PURE__ */ Object.create(null), k = null, T = null, P = null;
      ve(u, n, f, r, c), Fe(u, n, f);
      let D = i(n, f, "sourcemap", Ie), S = i(n, f, "bundle", F), R = i(n, f, "watch", Xe), x = i(n, f, "splitting", F), A = i(n, f, "preserveSymlinks", F), M = i(n, f, "metafile", F), w = i(n, f, "outfile", $), l = i(n, f, "outdir", $), s = i(n, f, "outbase", $), a = i(n, f, "tsconfig", $), h = i(n, f, "resolveExtensions", L), b = i(n, f, "nodePaths", L), _ = i(n, f, "mainFields", L), d = i(n, f, "conditions", L), e = i(n, f, "external", L), o = i(n, f, "packages", $), p = i(n, f, "alias", q), y = i(n, f, "loader", q), j = i(n, f, "outExtension", q), C = i(n, f, "publicPath", $), O = i(n, f, "entryNames", $), U = i(n, f, "chunkNames", $), z = i(n, f, "assetNames", $), H = i(n, f, "inject", L), V = i(n, f, "banner", q), N = i(n, f, "footer", q), I = i(n, f, "entryPoints", qe), J = i(n, f, "absWorkingDir", $), Q = i(n, f, "stdin", q), oe = (g = i(n, f, "write", F)) != null ? g : m, ge = i(n, f, "allowOverwrite", F), ee = i(n, f, "incremental", F) === !0, Z = i(n, f, "mangleCache", q);
      if (f.plugins = !0, W(n, f, `in ${t}() call`), D && u.push(`--sourcemap${D === !0 ? "" : `=${D}`}`), S && u.push("--bundle"), ge && u.push("--allow-overwrite"), R)
        if (u.push("--watch"), typeof R == "boolean")
          P = {};
        else {
          let E = /* @__PURE__ */ Object.create(null), B = i(R, E, "onRebuild", Se);
          W(R, E, `on "watch" in ${t}() call`), P = { onRebuild: B };
        }
      if (x && u.push("--splitting"), A && u.push("--preserve-symlinks"), M && u.push("--metafile"), w && u.push(`--outfile=${w}`), l && u.push(`--outdir=${l}`), s && u.push(`--outbase=${s}`), a && u.push(`--tsconfig=${a}`), o && u.push(`--packages=${o}`), h) {
        let E = [];
        for (let B of h) {
          if (G(B, "resolve extension"), B.indexOf(",") >= 0)
            throw new Error(`Invalid resolve extension: ${B}`);
          E.push(B);
        }
        u.push(`--resolve-extensions=${E.join(",")}`);
      }
      if (C && u.push(`--public-path=${C}`), O && u.push(`--entry-names=${O}`), U && u.push(`--chunk-names=${U}`), z && u.push(`--asset-names=${z}`), _) {
        let E = [];
        for (let B of _) {
          if (G(B, "main field"), B.indexOf(",") >= 0)
            throw new Error(`Invalid main field: ${B}`);
          E.push(B);
        }
        u.push(`--main-fields=${E.join(",")}`);
      }
      if (d) {
        let E = [];
        for (let B of d) {
          if (G(B, "condition"), B.indexOf(",") >= 0)
            throw new Error(`Invalid condition: ${B}`);
          E.push(B);
        }
        u.push(`--conditions=${E.join(",")}`);
      }
      if (e)
        for (let E of e)
          u.push(`--external:${G(E, "external")}`);
      if (p)
        for (let E in p) {
          if (E.indexOf("=") >= 0)
            throw new Error(`Invalid package name in alias: ${E}`);
          u.push(`--alias:${E}=${G(p[E], "alias", E)}`);
        }
      if (V)
        for (let E in V) {
          if (E.indexOf("=") >= 0)
            throw new Error(`Invalid banner file type: ${E}`);
          u.push(`--banner:${E}=${G(V[E], "banner", E)}`);
        }
      if (N)
        for (let E in N) {
          if (E.indexOf("=") >= 0)
            throw new Error(`Invalid footer file type: ${E}`);
          u.push(`--footer:${E}=${G(N[E], "footer", E)}`);
        }
      if (H)
        for (let E of H)
          u.push(`--inject:${G(E, "inject")}`);
      if (y)
        for (let E in y) {
          if (E.indexOf("=") >= 0)
            throw new Error(`Invalid loader extension: ${E}`);
          u.push(`--loader:${E}=${G(y[E], "loader", E)}`);
        }
      if (j)
        for (let E in j) {
          if (E.indexOf("=") >= 0)
            throw new Error(`Invalid out extension: ${E}`);
          u.push(`--out-extension:${E}=${G(j[E], "out extension", E)}`);
        }
      if (I)
        if (Array.isArray(I))
          for (let E of I)
            v.push(["", G(E, "entry point")]);
        else
          for (let E in I)
            v.push([E, G(I[E], "entry point", E)]);
      if (Q) {
        let E = /* @__PURE__ */ Object.create(null), B = i(Q, E, "contents", Me), We = i(Q, E, "resolveDir", $), ze = i(Q, E, "sourcefile", $), Ge = i(Q, E, "loader", $);
        W(Q, E, 'in "stdin" object'), ze && u.push(`--sourcefile=${ze}`), Ge && u.push(`--loader=${Ge}`), We && (T = We), typeof B == "string" ? k = K(B) : B instanceof Uint8Array && (k = B);
      }
      let he = [];
      if (b)
        for (let E of b)
          E += "", he.push(E);
      return {
        entries: v,
        flags: u,
        write: oe,
        stdinContents: k,
        stdinResolveDir: T,
        absWorkingDir: J,
        incremental: ee,
        nodePaths: he,
        watch: P,
        mangleCache: Ne(Z)
      };
    }
    function st(t, n, r, c) {
      let m = [], g = /* @__PURE__ */ Object.create(null);
      ve(m, n, g, r, c), Fe(m, n, g);
      let u = i(n, g, "sourcemap", Ie), v = i(n, g, "tsconfigRaw", Ze), f = i(n, g, "sourcefile", $), k = i(n, g, "loader", $), T = i(n, g, "banner", $), P = i(n, g, "footer", $), D = i(n, g, "mangleCache", q);
      return W(n, g, `in ${t}() call`), u && m.push(`--sourcemap=${u === !0 ? "external" : u}`), v && m.push(`--tsconfig-raw=${typeof v == "string" ? v : JSON.stringify(v)}`), f && m.push(`--sourcefile=${f}`), k && m.push(`--loader=${k}`), T && m.push(`--banner=${T}`), P && m.push(`--footer=${P}`), {
        flags: m,
        mangleCache: Ne(D)
      };
    }
    function it(t) {
      const n = {}, r = { didClose: !1, reason: "" };
      let c = {}, m = 0, g = 0, u = new Uint8Array(16 * 1024), v = 0, f = (l) => {
        let s = v + l.length;
        if (s > u.length) {
          let h = new Uint8Array(s * 2);
          h.set(u), u = h;
        }
        u.set(l, v), v += l.length;
        let a = 0;
        for (; a + 4 <= v; ) {
          let h = Re(u, a);
          if (a + 4 + h > v)
            break;
          a += 4, R(u.subarray(a, a + h)), a += h;
        }
        a > 0 && (u.copyWithin(0, a, v), v -= a);
      }, k = (l) => {
        r.didClose = !0, l && (r.reason = ": " + (l.message || l));
        const s = "The service was stopped" + r.reason;
        for (let a in c)
          c[a](s, null);
        c = {};
      }, T = (l, s, a) => {
        if (r.didClose)
          return a("The service is no longer running" + r.reason, null);
        let h = m++;
        c[h] = (b, _) => {
          try {
            a(b, _);
          } finally {
            l && l.unref();
          }
        }, l && l.ref(), t.writeToStdin(Oe({ id: h, isRequest: !0, value: s }));
      }, P = (l, s) => {
        if (r.didClose)
          throw new Error("The service is no longer running" + r.reason);
        t.writeToStdin(Oe({ id: l, isRequest: !1, value: s }));
      }, D = (l, s) => te(this, null, function* () {
        try {
          if (s.command === "ping") {
            P(l, {});
            return;
          }
          if (typeof s.key == "number") {
            const a = n[s.key];
            if (a) {
              const h = a[s.command];
              if (h) {
                yield h(l, s);
                return;
              }
            }
          }
          throw new Error("Invalid command: " + s.command);
        } catch (a) {
          P(l, { errors: [ce(a, t, null, void 0, "")] });
        }
      }), S = !0, R = (l) => {
        if (S) {
          S = !1;
          let a = String.fromCharCode(...l);
          if (a !== "0.16.10")
            throw new Error(`Cannot start service: Host version "0.16.10" does not match binary version ${Y(a)}`);
          return;
        }
        let s = Qe(l);
        if (s.isRequest)
          D(s.id, s.value);
        else {
          let a = c[s.id];
          delete c[s.id], s.value.error ? a(s.value.error, {}) : a(null, s.value);
        }
      };
      return {
        readFromStdout: f,
        afterClose: k,
        service: {
          buildOrServe: ({ callName: l, refs: s, serveOptions: a, options: h, isTTY: b, defaultWD: _, callback: d }) => {
            let e = 0;
            const o = g++, p = {}, y = {
              ref() {
                ++e === 1 && s && s.ref();
              },
              unref() {
                --e === 0 && (delete n[o], s && s.unref());
              }
            };
            n[o] = p, y.ref(), lt(
              l,
              o,
              T,
              P,
              y,
              t,
              p,
              h,
              a,
              b,
              _,
              r,
              (j, C) => {
                try {
                  d(j, C);
                } finally {
                  y.unref();
                }
              }
            );
          },
          transform: ({ callName: l, refs: s, input: a, options: h, isTTY: b, fs: _, callback: d }) => {
            const e = Ve();
            let o = (p) => {
              try {
                if (typeof a != "string" && !(a instanceof Uint8Array))
                  throw new Error('The input to "transform" must be a string or a Uint8Array');
                let {
                  flags: y,
                  mangleCache: j
                } = st(l, h, b, De), C = {
                  command: "transform",
                  flags: y,
                  inputFS: p !== null,
                  input: p !== null ? K(p) : typeof a == "string" ? K(a) : a
                };
                j && (C.mangleCache = j), T(s, C, (O, U) => {
                  if (O)
                    return d(new Error(O), null);
                  let z = ne(U.errors, e), H = ne(U.warnings, e), V = 1, N = () => {
                    if (--V === 0) {
                      let I = { warnings: H, code: U.code, map: U.map };
                      "legalComments" in U && (I.legalComments = U?.legalComments), U.mangleCache && (I.mangleCache = U?.mangleCache), d(null, I);
                    }
                  };
                  if (z.length > 0)
                    return d(fe("Transform failed", z, H), null);
                  U.codeFS && (V++, _.readFile(U.code, (I, J) => {
                    I !== null ? d(I, null) : (U.code = J, N());
                  })), U.mapFS && (V++, _.readFile(U.map, (I, J) => {
                    I !== null ? d(I, null) : (U.map = J, N());
                  })), N();
                });
              } catch (y) {
                let j = [];
                try {
                  ve(j, h, {}, b, De);
                } catch {
                }
                const C = ce(y, t, e, void 0, "");
                T(s, { command: "error", flags: j, error: C }, () => {
                  C.detail = e.load(C.detail), d(fe("Transform failed", [C], []), null);
                });
              }
            };
            if ((typeof a == "string" || a instanceof Uint8Array) && a.length > 1024 * 1024) {
              let p = o;
              o = () => _.writeFile(a, p);
            }
            o(null);
          },
          formatMessages: ({ callName: l, refs: s, messages: a, options: h, callback: b }) => {
            let _ = le(a, "messages", null, "");
            if (!h)
              throw new Error(`Missing second argument in ${l}() call`);
            let d = {}, e = i(h, d, "kind", $), o = i(h, d, "color", F), p = i(h, d, "terminalWidth", ue);
            if (W(h, d, `in ${l}() call`), e === void 0)
              throw new Error(`Missing "kind" in ${l}() call`);
            if (e !== "error" && e !== "warning")
              throw new Error(`Expected "kind" to be "error" or "warning" in ${l}() call`);
            let y = {
              command: "format-msgs",
              messages: _,
              isWarning: e === "warning"
            };
            o !== void 0 && (y.color = o), p !== void 0 && (y.terminalWidth = p), T(s, y, (j, C) => {
              if (j)
                return b(new Error(j), null);
              b(null, C.messages);
            });
          },
          analyzeMetafile: ({ callName: l, refs: s, metafile: a, options: h, callback: b }) => {
            h === void 0 && (h = {});
            let _ = {}, d = i(h, _, "color", F), e = i(h, _, "verbose", F);
            W(h, _, `in ${l}() call`);
            let o = {
              command: "analyze-metafile",
              metafile: a
            };
            d !== void 0 && (o.color = d), e !== void 0 && (o.verbose = e), T(s, o, (p, y) => {
              if (p)
                return b(new Error(p), null);
              b(null, y.result);
            });
          }
        }
      };
    }
    function lt(t, n, r, c, m, g, u, v, f, k, T, P, D) {
      const S = Ve(), R = (w, l, s, a) => {
        const h = [];
        try {
          ve(h, v, {}, k, Ue);
        } catch {
        }
        const b = ce(w, g, S, s, l);
        r(m, { command: "error", flags: h, error: b }, () => {
          b.detail = S.load(b.detail), a(b);
        });
      }, x = (w, l) => {
        R(w, l, void 0, (s) => {
          D(fe("Build failed", [s], []), null);
        });
      };
      let A;
      if (typeof v == "object") {
        const w = v.plugins;
        if (w !== void 0) {
          if (!Array.isArray(w))
            throw new Error('"plugins" must be an array');
          A = w;
        }
      }
      if (A && A.length > 0) {
        if (g.isSync) {
          x(new Error("Cannot use plugins in synchronous API calls"), "");
          return;
        }
        at(
          n,
          r,
          c,
          m,
          g,
          u,
          v,
          A,
          S
        ).then(
          (w) => {
            if (!w.ok) {
              x(w.error, w.pluginName);
              return;
            }
            try {
              M(w.requestPlugins, w.runOnEndCallbacks);
            } catch (l) {
              x(l, "");
            }
          },
          (w) => x(w, "")
        );
        return;
      }
      try {
        M(null, (w, l, s) => s());
      } catch (w) {
        x(w, "");
      }
      function M(w, l) {
        let s = !g.isWriteUnavailable, {
          entries: a,
          flags: h,
          write: b,
          stdinContents: _,
          stdinResolveDir: d,
          absWorkingDir: e,
          incremental: o,
          nodePaths: p,
          watch: y,
          mangleCache: j
        } = rt(t, v, k, Ue, s), C = {
          command: "build",
          key: n,
          entries: a,
          flags: h,
          write: b,
          stdinContents: _,
          stdinResolveDir: d,
          absWorkingDir: e || T,
          incremental: o,
          nodePaths: p
        };
        w && (C.plugins = w), j && (C.mangleCache = j);
        let O = f && ot(n, r, c, m, u, f, C), U, z, H = (N, I) => {
          N.outputFiles && (I.outputFiles = N.outputFiles.map(ut)), N.metafile && (I.metafile = JSON.parse(N.metafile)), N.mangleCache && (I.mangleCache = N.mangleCache), N.writeToStdout !== void 0 && console.log(ae(N.writeToStdout).replace(/\n$/, ""));
        }, V = (N, I) => {
          let J = {
            errors: ne(N.errors, S),
            warnings: ne(N.warnings, S)
          };
          H(N, J), l(J, R, () => {
            if (J.errors.length > 0)
              return I(fe("Build failed", J.errors, J.warnings), null);
            if (N.rebuild) {
              if (!U) {
                let Q = !1;
                U = () => new Promise((oe, ge) => {
                  if (Q || P.didClose)
                    throw new Error("Cannot rebuild");
                  r(
                    m,
                    { command: "rebuild", key: n },
                    (ee, Z) => {
                      if (ee)
                        return I(fe("Build failed", [{ id: "", pluginName: "", text: ee, location: null, notes: [], detail: void 0 }], []), null);
                      V(Z, (he, E) => {
                        he ? ge(he) : oe(E);
                      });
                    }
                  );
                }), m.ref(), U.dispose = () => {
                  Q || (Q = !0, r(m, { command: "rebuild-dispose", key: n }, () => {
                  }), m.unref());
                };
              }
              J.rebuild = U;
            }
            if (N.watch) {
              if (!z) {
                let Q = !1;
                m.ref(), z = () => {
                  Q || (Q = !0, delete u["watch-rebuild"], r(m, { command: "watch-stop", key: n }, () => {
                  }), m.unref());
                }, y && (u["watch-rebuild"] = (oe, ge) => {
                  try {
                    let ee = ge.args, Z = {
                      errors: ne(ee.errors, S),
                      warnings: ne(ee.warnings, S)
                    };
                    H(ee, Z), l(Z, R, () => {
                      if (Z.errors.length > 0) {
                        y.onRebuild && y.onRebuild(fe("Build failed", Z.errors, Z.warnings), null);
                        return;
                      }
                      Z.stop = z, y.onRebuild && y.onRebuild(null, Z);
                    });
                  } catch (ee) {
                    console.error(ee);
                  }
                  c(oe, {});
                });
              }
              J.stop = z;
            }
            I(null, J);
          });
        };
        if (b && g.isWriteUnavailable)
          throw new Error('The "write" option is unavailable in this environment');
        if (o && g.isSync)
          throw new Error('Cannot use "incremental" with a synchronous build');
        if (y && g.isSync)
          throw new Error('Cannot use "watch" with a synchronous build');
        r(m, C, (N, I) => {
          if (N)
            return D(new Error(N), null);
          if (O) {
            let J = I, Q = !1;
            m.ref();
            let oe = {
              port: J.port,
              host: J.host,
              wait: O.wait,
              stop() {
                Q || (Q = !0, O.stop(), m.unref());
              }
            };
            return m.ref(), O.wait.then(m.unref, m.unref), D(null, oe);
          }
          return V(I, D);
        });
      }
    }
    var ot = (t, n, r, c, m, g, u) => {
      let v = {}, f = i(g, v, "port", ue), k = i(g, v, "host", $), T = i(g, v, "servedir", $), P = i(g, v, "onRequest", Se), D = new Promise((S, R) => {
        m["serve-wait"] = (x, A) => {
          A.error !== null ? R(new Error(A.error)) : S(), r(x, {});
        };
      });
      return u.serve = {}, W(g, v, "in serve() call"), f !== void 0 && (u.serve.port = f), k !== void 0 && (u.serve.host = k), T !== void 0 && (u.serve.servedir = T), m["serve-request"] = (S, R) => {
        P && P(R.args), r(S, {});
      }, {
        wait: D,
        stop() {
          n(c, { command: "serve-stop", key: t }, () => {
          });
        }
      };
    }, at = (t, n, r, c, m, g, u, v, f) => te(void 0, null, function* () {
      let k = [], T = [], P = {}, D = {}, S = 0, R = 0, x = [], A = !1;
      v = [...v];
      for (let w of v) {
        let l = {};
        if (typeof w != "object")
          throw new Error(`Plugin at index ${R} must be an object`);
        const s = i(w, l, "name", $);
        if (typeof s != "string" || s === "")
          throw new Error(`Plugin at index ${R} is missing a name`);
        try {
          let a = i(w, l, "setup", Se);
          if (typeof a != "function")
            throw new Error("Plugin is missing a setup function");
          W(w, l, `on plugin ${Y(s)}`);
          let h = {
            name: s,
            onResolve: [],
            onLoad: []
          };
          R++;
          let _ = a({
            initialOptions: u,
            resolve: (d, e = {}) => {
              if (!A)
                throw new Error('Cannot call "resolve" before plugin setup has completed');
              if (typeof d != "string")
                throw new Error("The path to resolve must be a string");
              let o = /* @__PURE__ */ Object.create(null), p = i(e, o, "pluginName", $), y = i(e, o, "importer", $), j = i(e, o, "namespace", $), C = i(e, o, "resolveDir", $), O = i(e, o, "kind", $), U = i(e, o, "pluginData", we);
              return W(e, o, "in resolve() call"), new Promise((z, H) => {
                const V = {
                  command: "resolve",
                  path: d,
                  key: t,
                  pluginName: s
                };
                if (p != null && (V.pluginName = p), y != null && (V.importer = y), j != null && (V.namespace = j), C != null && (V.resolveDir = C), O != null)
                  V.kind = O;
                else
                  throw new Error('Must specify "kind" when calling "resolve"');
                U != null && (V.pluginData = f.store(U)), n(c, V, (N, I) => {
                  N !== null ? H(new Error(N)) : z({
                    errors: ne(I.errors, f),
                    warnings: ne(I.warnings, f),
                    path: I.path,
                    external: I.external,
                    sideEffects: I.sideEffects,
                    namespace: I.namespace,
                    suffix: I.suffix,
                    pluginData: f.load(I.pluginData)
                  });
                });
              });
            },
            onStart(d) {
              let e = 'This error came from the "onStart" callback registered here:', o = xe(new Error(e), m, "onStart");
              k.push({ name: s, callback: d, note: o });
            },
            onEnd(d) {
              let e = 'This error came from the "onEnd" callback registered here:', o = xe(new Error(e), m, "onEnd");
              T.push({ name: s, callback: d, note: o });
            },
            onResolve(d, e) {
              let o = 'This error came from the "onResolve" callback registered here:', p = xe(new Error(o), m, "onResolve"), y = {}, j = i(d, y, "filter", be), C = i(d, y, "namespace", $);
              if (W(d, y, `in onResolve() call for plugin ${Y(s)}`), j == null)
                throw new Error("onResolve() call is missing a filter");
              let O = S++;
              P[O] = { name: s, callback: e, note: p }, h.onResolve.push({ id: O, filter: j.source, namespace: C || "" });
            },
            onLoad(d, e) {
              let o = 'This error came from the "onLoad" callback registered here:', p = xe(new Error(o), m, "onLoad"), y = {}, j = i(d, y, "filter", be), C = i(d, y, "namespace", $);
              if (W(d, y, `in onLoad() call for plugin ${Y(s)}`), j == null)
                throw new Error("onLoad() call is missing a filter");
              let O = S++;
              D[O] = { name: s, callback: e, note: p }, h.onLoad.push({ id: O, filter: j.source, namespace: C || "" });
            },
            esbuild: m.esbuild
          });
          _ && (yield _), x.push(h);
        } catch (a) {
          return { ok: !1, error: a, pluginName: s };
        }
      }
      g["on-start"] = (w, l) => te(void 0, null, function* () {
        let s = { errors: [], warnings: [] };
        yield Promise.all(k.map((a) => te(void 0, [a], function* ({ name: h, callback: b, note: _ }) {
          try {
            let d = yield b();
            if (d != null) {
              if (typeof d != "object")
                throw new Error(`Expected onStart() callback in plugin ${Y(h)} to return an object`);
              let e = {}, o = i(d, e, "errors", L), p = i(d, e, "warnings", L);
              W(d, e, `from onStart() callback in plugin ${Y(h)}`), o != null && s.errors.push(...le(o, "errors", f, h)), p != null && s.warnings.push(...le(p, "warnings", f, h));
            }
          } catch (d) {
            s.errors.push(ce(d, m, f, _ && _(), h));
          }
        }))), r(w, s);
      }), g["on-resolve"] = (w, l) => te(void 0, null, function* () {
        let s = {}, a = "", h, b;
        for (let _ of l.ids)
          try {
            ({ name: a, callback: h, note: b } = P[_]);
            let d = yield h({
              path: l.path,
              importer: l.importer,
              namespace: l.namespace,
              resolveDir: l.resolveDir,
              kind: l.kind,
              pluginData: f.load(l.pluginData)
            });
            if (d != null) {
              if (typeof d != "object")
                throw new Error(`Expected onResolve() callback in plugin ${Y(a)} to return an object`);
              let e = {}, o = i(d, e, "pluginName", $), p = i(d, e, "path", $), y = i(d, e, "namespace", $), j = i(d, e, "suffix", $), C = i(d, e, "external", F), O = i(d, e, "sideEffects", F), U = i(d, e, "pluginData", we), z = i(d, e, "errors", L), H = i(d, e, "warnings", L), V = i(d, e, "watchFiles", L), N = i(d, e, "watchDirs", L);
              W(d, e, `from onResolve() callback in plugin ${Y(a)}`), s.id = _, o != null && (s.pluginName = o), p != null && (s.path = p), y != null && (s.namespace = y), j != null && (s.suffix = j), C != null && (s.external = C), O != null && (s.sideEffects = O), U != null && (s.pluginData = f.store(U)), z != null && (s.errors = le(z, "errors", f, a)), H != null && (s.warnings = le(H, "warnings", f, a)), V != null && (s.watchFiles = _e(V, "watchFiles")), N != null && (s.watchDirs = _e(N, "watchDirs"));
              break;
            }
          } catch (d) {
            s = { id: _, errors: [ce(d, m, f, b && b(), a)] };
            break;
          }
        r(w, s);
      }), g["on-load"] = (w, l) => te(void 0, null, function* () {
        let s = {}, a = "", h, b;
        for (let _ of l.ids)
          try {
            ({ name: a, callback: h, note: b } = D[_]);
            let d = yield h({
              path: l.path,
              namespace: l.namespace,
              suffix: l.suffix,
              pluginData: f.load(l.pluginData)
            });
            if (d != null) {
              if (typeof d != "object")
                throw new Error(`Expected onLoad() callback in plugin ${Y(a)} to return an object`);
              let e = {}, o = i(d, e, "pluginName", $), p = i(d, e, "contents", Me), y = i(d, e, "resolveDir", $), j = i(d, e, "pluginData", we), C = i(d, e, "loader", $), O = i(d, e, "errors", L), U = i(d, e, "warnings", L), z = i(d, e, "watchFiles", L), H = i(d, e, "watchDirs", L);
              W(d, e, `from onLoad() callback in plugin ${Y(a)}`), s.id = _, o != null && (s.pluginName = o), p instanceof Uint8Array ? s.contents = p : p != null && (s.contents = K(p)), y != null && (s.resolveDir = y), j != null && (s.pluginData = f.store(j)), C != null && (s.loader = C), O != null && (s.errors = le(O, "errors", f, a)), U != null && (s.warnings = le(U, "warnings", f, a)), z != null && (s.watchFiles = _e(z, "watchFiles")), H != null && (s.watchDirs = _e(H, "watchDirs"));
              break;
            }
          } catch (d) {
            s = { id: _, errors: [ce(d, m, f, b && b(), a)] };
            break;
          }
        r(w, s);
      });
      let M = (w, l, s) => s();
      return T.length > 0 && (M = (w, l, s) => {
        (() => te(void 0, null, function* () {
          for (const { name: a, callback: h, note: b } of T)
            try {
              yield h(w);
            } catch (_) {
              w.errors.push(yield new Promise((d) => l(_, a, b && b(), d)));
            }
        }))().then(s);
      }), A = !0, {
        ok: !0,
        requestPlugins: x,
        runOnEndCallbacks: M
      };
    });
    function Ve() {
      const t = /* @__PURE__ */ new Map();
      let n = 0;
      return {
        load(r) {
          return t.get(r);
        },
        store(r) {
          if (r === void 0)
            return -1;
          const c = n++;
          return t.set(c, r), c;
        }
      };
    }
    function xe(t, n, r) {
      let c, m = !1;
      return () => {
        if (m)
          return c;
        m = !0;
        try {
          let g = (t.stack + "").split(`
`);
          g.splice(1, 1);
          let u = Be(n, g, r);
          if (u)
            return c = { text: t.message, location: u }, c;
        } catch {
        }
      };
    }
    function ce(t, n, r, c, m) {
      let g = "Internal error", u = null;
      try {
        g = (t && t.message || t) + "";
      } catch {
      }
      try {
        u = Be(n, (t.stack + "").split(`
`), "");
      } catch {
      }
      return { id: "", pluginName: m, text: g, location: u, notes: c ? [c] : [], detail: r ? r.store(t) : -1 };
    }
    function Be(t, n, r) {
      let c = "    at ";
      if (t.readFileSync && !n[0].startsWith(c) && n[1].startsWith(c))
        for (let m = 1; m < n.length; m++) {
          let g = n[m];
          if (g.startsWith(c))
            for (g = g.slice(c.length); ; ) {
              let u = /^(?:new |async )?\S+ \((.*)\)$/.exec(g);
              if (u) {
                g = u[1];
                continue;
              }
              if (u = /^eval at \S+ \((.*)\)(?:, \S+:\d+:\d+)?$/.exec(g), u) {
                g = u[1];
                continue;
              }
              if (u = /^(\S+):(\d+):(\d+)$/.exec(g), u) {
                let v;
                try {
                  v = t.readFileSync(u[1], "utf8");
                } catch {
                  break;
                }
                let f = v.split(/\r\n|\r|\n|\u2028|\u2029/)[+u[2] - 1] || "", k = +u[3] - 1, T = f.slice(k, k + r.length) === r ? r.length : 0;
                return {
                  file: u[1],
                  namespace: "file",
                  line: +u[2],
                  column: K(f.slice(0, k)).length,
                  length: K(f.slice(k, k + T)).length,
                  lineText: f + `
` + n.slice(1).join(`
`),
                  suggestion: ""
                };
              }
              break;
            }
        }
      return null;
    }
    function fe(t, n, r) {
      let c = 5, m = n.length < 1 ? "" : ` with ${n.length} error${n.length < 2 ? "" : "s"}:` + n.slice(0, c + 1).map((u, v) => {
        if (v === c)
          return `
...`;
        if (!u.location)
          return `
error: ${u.text}`;
        let { file: f, line: k, column: T } = u.location, P = u.pluginName ? `[plugin: ${u.pluginName}] ` : "";
        return `
${f}:${k}:${T}: ERROR: ${P}${u.text}`;
      }).join(""), g = new Error(`${t}${m}`);
      return g.errors = n, g.warnings = r, g;
    }
    function ne(t, n) {
      for (const r of t)
        r.detail = n.load(r.detail);
      return t;
    }
    function Le(t, n) {
      if (t == null)
        return null;
      let r = {}, c = i(t, r, "file", $), m = i(t, r, "namespace", $), g = i(t, r, "line", ue), u = i(t, r, "column", ue), v = i(t, r, "length", ue), f = i(t, r, "lineText", $), k = i(t, r, "suggestion", $);
      return W(t, r, n), {
        file: c || "",
        namespace: m || "",
        line: g || 0,
        column: u || 0,
        length: v || 0,
        lineText: f || "",
        suggestion: k || ""
      };
    }
    function le(t, n, r, c) {
      let m = [], g = 0;
      for (const u of t) {
        let v = {}, f = i(u, v, "id", $), k = i(u, v, "pluginName", $), T = i(u, v, "text", $), P = i(u, v, "location", Ce), D = i(u, v, "notes", L), S = i(u, v, "detail", we), R = `in element ${g} of "${n}"`;
        W(u, v, R);
        let x = [];
        if (D)
          for (const A of D) {
            let M = {}, w = i(A, M, "text", $), l = i(A, M, "location", Ce);
            W(A, M, R), x.push({
              text: w || "",
              location: Le(l, R)
            });
          }
        m.push({
          id: f || "",
          pluginName: k || c,
          text: T || "",
          location: Le(P, R),
          notes: x,
          detail: r ? r.store(S) : -1
        }), g++;
      }
      return m;
    }
    function _e(t, n) {
      const r = [];
      for (const c of t) {
        if (typeof c != "string")
          throw new Error(`${Y(n)} must be an array of strings`);
        r.push(c);
      }
      return r;
    }
    function ut({ path: t, contents: n }) {
      let r = null;
      return {
        path: t,
        contents: n,
        get text() {
          const c = this.contents;
          return (r === null || c !== n) && (n = c, r = ae(c)), r;
        }
      };
    }
    var ct = "0.16.10", ft = (t) => Ee().build(t), dt = () => {
      throw new Error('The "serve" API only works in node');
    }, ht = (t, n) => Ee().transform(t, n), mt = (t, n) => Ee().formatMessages(t, n), gt = (t, n) => Ee().analyzeMetafile(t, n), pt = () => {
      throw new Error('The "buildSync" API only works in node');
    }, yt = () => {
      throw new Error('The "transformSync" API only works in node');
    }, wt = () => {
      throw new Error('The "formatMessagesSync" API only works in node');
    }, bt = () => {
      throw new Error('The "analyzeMetafileSync" API only works in node');
    }, de, je, Ee = () => {
      if (je)
        return je;
      throw de ? new Error('You need to wait for the promise returned from "initialize" to be resolved before calling this') : new Error('You need to call "initialize" before calling this');
    }, vt = (t) => {
      t = nt(t || {});
      let n = t.wasmURL, r = t.wasmModule, c = t.worker !== !1;
      if (!n && !r)
        throw new Error('Must provide either the "wasmURL" option or the "wasmModule" option');
      if (de)
        throw new Error('Cannot call "initialize" more than once');
      return de = xt(n || "", r, c), de.catch(() => {
        de = void 0;
      }), de;
    }, xt = (t, n, r) => te(void 0, null, function* () {
      let c;
      if (r) {
        let k = new Blob([`onmessage=((postMessage) => {
      // Copyright 2018 The Go Authors. All rights reserved.
      // Use of this source code is governed by a BSD-style
      // license that can be found in the LICENSE file.
      var __async = (__this, __arguments, generator) => {
        return new Promise((resolve, reject) => {
          var fulfilled = (value) => {
            try {
              step(generator.next(value));
            } catch (e) {
              reject(e);
            }
          };
          var rejected = (value) => {
            try {
              step(generator.throw(value));
            } catch (e) {
              reject(e);
            }
          };
          var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
          step((generator = generator.apply(__this, __arguments)).next());
        });
      };
      let onmessage;
      let globalThis = {};
      for (let o = self; o; o = Object.getPrototypeOf(o))
        for (let k of Object.getOwnPropertyNames(o))
          if (!(k in globalThis))
            Object.defineProperty(globalThis, k, { get: () => self[k] });
      "use strict";
      (() => {
        const enosys = () => {
          const err = new Error("not implemented");
          err.code = "ENOSYS";
          return err;
        };
        if (!globalThis.fs) {
          let outputBuf = "";
          globalThis.fs = {
            constants: { O_WRONLY: -1, O_RDWR: -1, O_CREAT: -1, O_TRUNC: -1, O_APPEND: -1, O_EXCL: -1 },
            writeSync(fd, buf) {
              outputBuf += decoder.decode(buf);
              const nl = outputBuf.lastIndexOf("\\n");
              if (nl != -1) {
                console.log(outputBuf.substr(0, nl));
                outputBuf = outputBuf.substr(nl + 1);
              }
              return buf.length;
            },
            write(fd, buf, offset, length, position, callback) {
              if (offset !== 0 || length !== buf.length || position !== null) {
                callback(enosys());
                return;
              }
              const n = this.writeSync(fd, buf);
              callback(null, n);
            },
            chmod(path, mode, callback) {
              callback(enosys());
            },
            chown(path, uid, gid, callback) {
              callback(enosys());
            },
            close(fd, callback) {
              callback(enosys());
            },
            fchmod(fd, mode, callback) {
              callback(enosys());
            },
            fchown(fd, uid, gid, callback) {
              callback(enosys());
            },
            fstat(fd, callback) {
              callback(enosys());
            },
            fsync(fd, callback) {
              callback(null);
            },
            ftruncate(fd, length, callback) {
              callback(enosys());
            },
            lchown(path, uid, gid, callback) {
              callback(enosys());
            },
            link(path, link, callback) {
              callback(enosys());
            },
            lstat(path, callback) {
              callback(enosys());
            },
            mkdir(path, perm, callback) {
              callback(enosys());
            },
            open(path, flags, mode, callback) {
              callback(enosys());
            },
            read(fd, buffer, offset, length, position, callback) {
              callback(enosys());
            },
            readdir(path, callback) {
              callback(enosys());
            },
            readlink(path, callback) {
              callback(enosys());
            },
            rename(from, to, callback) {
              callback(enosys());
            },
            rmdir(path, callback) {
              callback(enosys());
            },
            stat(path, callback) {
              callback(enosys());
            },
            symlink(path, link, callback) {
              callback(enosys());
            },
            truncate(path, length, callback) {
              callback(enosys());
            },
            unlink(path, callback) {
              callback(enosys());
            },
            utimes(path, atime, mtime, callback) {
              callback(enosys());
            }
          };
        }
        if (!globalThis.process) {
          globalThis.process = {
            getuid() {
              return -1;
            },
            getgid() {
              return -1;
            },
            geteuid() {
              return -1;
            },
            getegid() {
              return -1;
            },
            getgroups() {
              throw enosys();
            },
            pid: -1,
            ppid: -1,
            umask() {
              throw enosys();
            },
            cwd() {
              throw enosys();
            },
            chdir() {
              throw enosys();
            }
          };
        }
        if (!globalThis.crypto) {
          throw new Error("globalThis.crypto is not available, polyfill required (crypto.getRandomValues only)");
        }
        if (!globalThis.performance) {
          throw new Error("globalThis.performance is not available, polyfill required (performance.now only)");
        }
        if (!globalThis.TextEncoder) {
          throw new Error("globalThis.TextEncoder is not available, polyfill required");
        }
        if (!globalThis.TextDecoder) {
          throw new Error("globalThis.TextDecoder is not available, polyfill required");
        }
        const encoder = new TextEncoder("utf-8");
        const decoder = new TextDecoder("utf-8");
        globalThis.Go = class {
          constructor() {
            this.argv = ["js"];
            this.env = {};
            this.exit = (code) => {
              if (code !== 0) {
                console.warn("exit code:", code);
              }
            };
            this._exitPromise = new Promise((resolve) => {
              this._resolveExitPromise = resolve;
            });
            this._pendingEvent = null;
            this._scheduledTimeouts = /* @__PURE__ */ new Map();
            this._nextCallbackTimeoutID = 1;
            const setInt64 = (addr, v) => {
              this.mem.setUint32(addr + 0, v, true);
              this.mem.setUint32(addr + 4, Math.floor(v / 4294967296), true);
            };
            const getInt64 = (addr) => {
              const low = this.mem.getUint32(addr + 0, true);
              const high = this.mem.getInt32(addr + 4, true);
              return low + high * 4294967296;
            };
            const loadValue = (addr) => {
              const f = this.mem.getFloat64(addr, true);
              if (f === 0) {
                return void 0;
              }
              if (!isNaN(f)) {
                return f;
              }
              const id = this.mem.getUint32(addr, true);
              return this._values[id];
            };
            const storeValue = (addr, v) => {
              const nanHead = 2146959360;
              if (typeof v === "number" && v !== 0) {
                if (isNaN(v)) {
                  this.mem.setUint32(addr + 4, nanHead, true);
                  this.mem.setUint32(addr, 0, true);
                  return;
                }
                this.mem.setFloat64(addr, v, true);
                return;
              }
              if (v === void 0) {
                this.mem.setFloat64(addr, 0, true);
                return;
              }
              let id = this._ids.get(v);
              if (id === void 0) {
                id = this._idPool.pop();
                if (id === void 0) {
                  id = this._values.length;
                }
                this._values[id] = v;
                this._goRefCounts[id] = 0;
                this._ids.set(v, id);
              }
              this._goRefCounts[id]++;
              let typeFlag = 0;
              switch (typeof v) {
                case "object":
                  if (v !== null) {
                    typeFlag = 1;
                  }
                  break;
                case "string":
                  typeFlag = 2;
                  break;
                case "symbol":
                  typeFlag = 3;
                  break;
                case "function":
                  typeFlag = 4;
                  break;
              }
              this.mem.setUint32(addr + 4, nanHead | typeFlag, true);
              this.mem.setUint32(addr, id, true);
            };
            const loadSlice = (addr) => {
              const array = getInt64(addr + 0);
              const len = getInt64(addr + 8);
              return new Uint8Array(this._inst.exports.mem.buffer, array, len);
            };
            const loadSliceOfValues = (addr) => {
              const array = getInt64(addr + 0);
              const len = getInt64(addr + 8);
              const a = new Array(len);
              for (let i = 0; i < len; i++) {
                a[i] = loadValue(array + i * 8);
              }
              return a;
            };
            const loadString = (addr) => {
              const saddr = getInt64(addr + 0);
              const len = getInt64(addr + 8);
              return decoder.decode(new DataView(this._inst.exports.mem.buffer, saddr, len));
            };
            const timeOrigin = Date.now() - performance.now();
            this.importObject = {
              go: {
                "runtime.wasmExit": (sp) => {
                  sp >>>= 0;
                  const code = this.mem.getInt32(sp + 8, true);
                  this.exited = true;
                  delete this._inst;
                  delete this._values;
                  delete this._goRefCounts;
                  delete this._ids;
                  delete this._idPool;
                  this.exit(code);
                },
                "runtime.wasmWrite": (sp) => {
                  sp >>>= 0;
                  const fd = getInt64(sp + 8);
                  const p = getInt64(sp + 16);
                  const n = this.mem.getInt32(sp + 24, true);
                  globalThis.fs.writeSync(fd, new Uint8Array(this._inst.exports.mem.buffer, p, n));
                },
                "runtime.resetMemoryDataView": (sp) => {
                  sp >>>= 0;
                  this.mem = new DataView(this._inst.exports.mem.buffer);
                },
                "runtime.nanotime1": (sp) => {
                  sp >>>= 0;
                  setInt64(sp + 8, (timeOrigin + performance.now()) * 1e6);
                },
                "runtime.walltime": (sp) => {
                  sp >>>= 0;
                  const msec = new Date().getTime();
                  setInt64(sp + 8, msec / 1e3);
                  this.mem.setInt32(sp + 16, msec % 1e3 * 1e6, true);
                },
                "runtime.scheduleTimeoutEvent": (sp) => {
                  sp >>>= 0;
                  const id = this._nextCallbackTimeoutID;
                  this._nextCallbackTimeoutID++;
                  this._scheduledTimeouts.set(id, setTimeout(
                    () => {
                      this._resume();
                      while (this._scheduledTimeouts.has(id)) {
                        console.warn("scheduleTimeoutEvent: missed timeout event");
                        this._resume();
                      }
                    },
                    getInt64(sp + 8) + 1
                  ));
                  this.mem.setInt32(sp + 16, id, true);
                },
                "runtime.clearTimeoutEvent": (sp) => {
                  sp >>>= 0;
                  const id = this.mem.getInt32(sp + 8, true);
                  clearTimeout(this._scheduledTimeouts.get(id));
                  this._scheduledTimeouts.delete(id);
                },
                "runtime.getRandomData": (sp) => {
                  sp >>>= 0;
                  crypto.getRandomValues(loadSlice(sp + 8));
                },
                "syscall/js.finalizeRef": (sp) => {
                  sp >>>= 0;
                  const id = this.mem.getUint32(sp + 8, true);
                  this._goRefCounts[id]--;
                  if (this._goRefCounts[id] === 0) {
                    const v = this._values[id];
                    this._values[id] = null;
                    this._ids.delete(v);
                    this._idPool.push(id);
                  }
                },
                "syscall/js.stringVal": (sp) => {
                  sp >>>= 0;
                  storeValue(sp + 24, loadString(sp + 8));
                },
                "syscall/js.valueGet": (sp) => {
                  sp >>>= 0;
                  const result = Reflect.get(loadValue(sp + 8), loadString(sp + 16));
                  sp = this._inst.exports.getsp() >>> 0;
                  storeValue(sp + 32, result);
                },
                "syscall/js.valueSet": (sp) => {
                  sp >>>= 0;
                  Reflect.set(loadValue(sp + 8), loadString(sp + 16), loadValue(sp + 32));
                },
                "syscall/js.valueDelete": (sp) => {
                  sp >>>= 0;
                  Reflect.deleteProperty(loadValue(sp + 8), loadString(sp + 16));
                },
                "syscall/js.valueIndex": (sp) => {
                  sp >>>= 0;
                  storeValue(sp + 24, Reflect.get(loadValue(sp + 8), getInt64(sp + 16)));
                },
                "syscall/js.valueSetIndex": (sp) => {
                  sp >>>= 0;
                  Reflect.set(loadValue(sp + 8), getInt64(sp + 16), loadValue(sp + 24));
                },
                "syscall/js.valueCall": (sp) => {
                  sp >>>= 0;
                  try {
                    const v = loadValue(sp + 8);
                    const m = Reflect.get(v, loadString(sp + 16));
                    const args = loadSliceOfValues(sp + 32);
                    const result = Reflect.apply(m, v, args);
                    sp = this._inst.exports.getsp() >>> 0;
                    storeValue(sp + 56, result);
                    this.mem.setUint8(sp + 64, 1);
                  } catch (err) {
                    sp = this._inst.exports.getsp() >>> 0;
                    storeValue(sp + 56, err);
                    this.mem.setUint8(sp + 64, 0);
                  }
                },
                "syscall/js.valueInvoke": (sp) => {
                  sp >>>= 0;
                  try {
                    const v = loadValue(sp + 8);
                    const args = loadSliceOfValues(sp + 16);
                    const result = Reflect.apply(v, void 0, args);
                    sp = this._inst.exports.getsp() >>> 0;
                    storeValue(sp + 40, result);
                    this.mem.setUint8(sp + 48, 1);
                  } catch (err) {
                    sp = this._inst.exports.getsp() >>> 0;
                    storeValue(sp + 40, err);
                    this.mem.setUint8(sp + 48, 0);
                  }
                },
                "syscall/js.valueNew": (sp) => {
                  sp >>>= 0;
                  try {
                    const v = loadValue(sp + 8);
                    const args = loadSliceOfValues(sp + 16);
                    const result = Reflect.construct(v, args);
                    sp = this._inst.exports.getsp() >>> 0;
                    storeValue(sp + 40, result);
                    this.mem.setUint8(sp + 48, 1);
                  } catch (err) {
                    sp = this._inst.exports.getsp() >>> 0;
                    storeValue(sp + 40, err);
                    this.mem.setUint8(sp + 48, 0);
                  }
                },
                "syscall/js.valueLength": (sp) => {
                  sp >>>= 0;
                  setInt64(sp + 16, parseInt(loadValue(sp + 8).length));
                },
                "syscall/js.valuePrepareString": (sp) => {
                  sp >>>= 0;
                  const str = encoder.encode(String(loadValue(sp + 8)));
                  storeValue(sp + 16, str);
                  setInt64(sp + 24, str.length);
                },
                "syscall/js.valueLoadString": (sp) => {
                  sp >>>= 0;
                  const str = loadValue(sp + 8);
                  loadSlice(sp + 16).set(str);
                },
                "syscall/js.valueInstanceOf": (sp) => {
                  sp >>>= 0;
                  this.mem.setUint8(sp + 24, loadValue(sp + 8) instanceof loadValue(sp + 16) ? 1 : 0);
                },
                "syscall/js.copyBytesToGo": (sp) => {
                  sp >>>= 0;
                  const dst = loadSlice(sp + 8);
                  const src = loadValue(sp + 32);
                  if (!(src instanceof Uint8Array || src instanceof Uint8ClampedArray)) {
                    this.mem.setUint8(sp + 48, 0);
                    return;
                  }
                  const toCopy = src.subarray(0, dst.length);
                  dst.set(toCopy);
                  setInt64(sp + 40, toCopy.length);
                  this.mem.setUint8(sp + 48, 1);
                },
                "syscall/js.copyBytesToJS": (sp) => {
                  sp >>>= 0;
                  const dst = loadValue(sp + 8);
                  const src = loadSlice(sp + 16);
                  if (!(dst instanceof Uint8Array || dst instanceof Uint8ClampedArray)) {
                    this.mem.setUint8(sp + 48, 0);
                    return;
                  }
                  const toCopy = src.subarray(0, dst.length);
                  dst.set(toCopy);
                  setInt64(sp + 40, toCopy.length);
                  this.mem.setUint8(sp + 48, 1);
                },
                "debug": (value) => {
                  console.log(value);
                }
              }
            };
          }
          run(instance) {
            return __async(this, null, function* () {
              if (!(instance instanceof WebAssembly.Instance)) {
                throw new Error("Go.run: WebAssembly.Instance expected");
              }
              this._inst = instance;
              this.mem = new DataView(this._inst.exports.mem.buffer);
              this._values = [
                NaN,
                0,
                null,
                true,
                false,
                globalThis,
                this
              ];
              this._goRefCounts = new Array(this._values.length).fill(Infinity);
              this._ids = /* @__PURE__ */ new Map([
                [0, 1],
                [null, 2],
                [true, 3],
                [false, 4],
                [globalThis, 5],
                [this, 6]
              ]);
              this._idPool = [];
              this.exited = false;
              let offset = 4096;
              const strPtr = (str) => {
                const ptr = offset;
                const bytes = encoder.encode(str + "\\0");
                new Uint8Array(this.mem.buffer, offset, bytes.length).set(bytes);
                offset += bytes.length;
                if (offset % 8 !== 0) {
                  offset += 8 - offset % 8;
                }
                return ptr;
              };
              const argc = this.argv.length;
              const argvPtrs = [];
              this.argv.forEach((arg) => {
                argvPtrs.push(strPtr(arg));
              });
              argvPtrs.push(0);
              const keys = Object.keys(this.env).sort();
              keys.forEach((key) => {
                argvPtrs.push(strPtr(\`\${key}=\${this.env[key]}\`));
              });
              argvPtrs.push(0);
              const argv = offset;
              argvPtrs.forEach((ptr) => {
                this.mem.setUint32(offset, ptr, true);
                this.mem.setUint32(offset + 4, 0, true);
                offset += 8;
              });
              const wasmMinDataAddr = 4096 + 8192;
              if (offset >= wasmMinDataAddr) {
                throw new Error("total length of command line and environment variables exceeds limit");
              }
              this._inst.exports.run(argc, argv);
              if (this.exited) {
                this._resolveExitPromise();
              }
              yield this._exitPromise;
            });
          }
          _resume() {
            if (this.exited) {
              throw new Error("Go program has already exited");
            }
            this._inst.exports.resume();
            if (this.exited) {
              this._resolveExitPromise();
            }
          }
          _makeFuncWrapper(id) {
            const go = this;
            return function() {
              const event = { id, this: this, args: arguments };
              go._pendingEvent = event;
              go._resume();
              return event.result;
            };
          }
        };
      })();
      onmessage = ({ data: wasm }) => {
        let decoder = new TextDecoder();
        let fs = globalThis.fs;
        let stderr = "";
        fs.writeSync = (fd, buffer) => {
          if (fd === 1) {
            postMessage(buffer);
          } else if (fd === 2) {
            stderr += decoder.decode(buffer);
            let parts = stderr.split("\\n");
            if (parts.length > 1)
              console.log(parts.slice(0, -1).join("\\n"));
            stderr = parts[parts.length - 1];
          } else {
            throw new Error("Bad write");
          }
          return buffer.length;
        };
        let stdin = [];
        let resumeStdin;
        let stdinPos = 0;
        onmessage = ({ data }) => {
          if (data.length > 0) {
            stdin.push(data);
            if (resumeStdin)
              resumeStdin();
          }
        };
        fs.read = (fd, buffer, offset, length, position, callback) => {
          if (fd !== 0 || offset !== 0 || length !== buffer.length || position !== null) {
            throw new Error("Bad read");
          }
          if (stdin.length === 0) {
            resumeStdin = () => fs.read(fd, buffer, offset, length, position, callback);
            return;
          }
          let first = stdin[0];
          let count = Math.max(0, Math.min(length, first.length - stdinPos));
          buffer.set(first.subarray(stdinPos, stdinPos + count), offset);
          stdinPos += count;
          if (stdinPos === first.length) {
            stdin.shift();
            stdinPos = 0;
          }
          callback(null, count);
        };
        let go = new globalThis.Go();
        go.argv = ["", \`--service=\${"0.16.10"}\`];
        tryToInstantiateModule(wasm, go).then(
          (instance) => {
            postMessage(null);
            go.run(instance);
          },
          (error) => {
            postMessage(error);
          }
        );
      };
      function tryToInstantiateModule(wasm, go) {
        return __async(this, null, function* () {
          if (wasm instanceof WebAssembly.Module) {
            return WebAssembly.instantiate(wasm, go.importObject);
          }
          const res = yield fetch(wasm);
          if (!res.ok)
            throw new Error(\`Failed to download \${JSON.stringify(wasm)}\`);
          if ("instantiateStreaming" in WebAssembly && /^application\\/wasm($|;)/i.test(res.headers.get("Content-Type") || "")) {
            const result2 = yield WebAssembly.instantiateStreaming(res, go.importObject);
            return result2.instance;
          }
          const bytes = yield res.arrayBuffer();
          const result = yield WebAssembly.instantiate(bytes, go.importObject);
          return result.instance;
        });
      }
      return (m) => onmessage(m);
    })(postMessage)`], { type: "text/javascript" });
        c = new Worker(URL.createObjectURL(k));
      } else {
        let k = ((T) => {
          var P = (x, A, M) => new Promise((w, l) => {
            var s = (b) => {
              try {
                h(M.next(b));
              } catch (_) {
                l(_);
              }
            }, a = (b) => {
              try {
                h(M.throw(b));
              } catch (_) {
                l(_);
              }
            }, h = (b) => b.done ? w(b.value) : Promise.resolve(b.value).then(s, a);
            h((M = M.apply(x, A)).next());
          });
          let D, S = {};
          for (let x = self; x; x = Object.getPrototypeOf(x))
            for (let A of Object.getOwnPropertyNames(x))
              A in S || Object.defineProperty(S, A, { get: () => self[A] });
          (() => {
            const x = () => {
              const w = new Error("not implemented");
              return w.code = "ENOSYS", w;
            };
            if (!S.fs) {
              let w = "";
              S.fs = {
                constants: { O_WRONLY: -1, O_RDWR: -1, O_CREAT: -1, O_TRUNC: -1, O_APPEND: -1, O_EXCL: -1 },
                writeSync(l, s) {
                  w += M.decode(s);
                  const a = w.lastIndexOf(`
`);
                  return a != -1 && (console.log(w.substr(0, a)), w = w.substr(a + 1)), s.length;
                },
                write(l, s, a, h, b, _) {
                  if (a !== 0 || h !== s.length || b !== null) {
                    _(x());
                    return;
                  }
                  const d = this.writeSync(l, s);
                  _(null, d);
                },
                chmod(l, s, a) {
                  a(x());
                },
                chown(l, s, a, h) {
                  h(x());
                },
                close(l, s) {
                  s(x());
                },
                fchmod(l, s, a) {
                  a(x());
                },
                fchown(l, s, a, h) {
                  h(x());
                },
                fstat(l, s) {
                  s(x());
                },
                fsync(l, s) {
                  s(null);
                },
                ftruncate(l, s, a) {
                  a(x());
                },
                lchown(l, s, a, h) {
                  h(x());
                },
                link(l, s, a) {
                  a(x());
                },
                lstat(l, s) {
                  s(x());
                },
                mkdir(l, s, a) {
                  a(x());
                },
                open(l, s, a, h) {
                  h(x());
                },
                read(l, s, a, h, b, _) {
                  _(x());
                },
                readdir(l, s) {
                  s(x());
                },
                readlink(l, s) {
                  s(x());
                },
                rename(l, s, a) {
                  a(x());
                },
                rmdir(l, s) {
                  s(x());
                },
                stat(l, s) {
                  s(x());
                },
                symlink(l, s, a) {
                  a(x());
                },
                truncate(l, s, a) {
                  a(x());
                },
                unlink(l, s) {
                  s(x());
                },
                utimes(l, s, a, h) {
                  h(x());
                }
              };
            }
            if (S.process || (S.process = {
              getuid() {
                return -1;
              },
              getgid() {
                return -1;
              },
              geteuid() {
                return -1;
              },
              getegid() {
                return -1;
              },
              getgroups() {
                throw x();
              },
              pid: -1,
              ppid: -1,
              umask() {
                throw x();
              },
              cwd() {
                throw x();
              },
              chdir() {
                throw x();
              }
            }), !S.crypto)
              throw new Error("globalThis.crypto is not available, polyfill required (crypto.getRandomValues only)");
            if (!S.performance)
              throw new Error("globalThis.performance is not available, polyfill required (performance.now only)");
            if (!S.TextEncoder)
              throw new Error("globalThis.TextEncoder is not available, polyfill required");
            if (!S.TextDecoder)
              throw new Error("globalThis.TextDecoder is not available, polyfill required");
            const A = new TextEncoder("utf-8"), M = new TextDecoder("utf-8");
            S.Go = class {
              constructor() {
                this.argv = ["js"], this.env = {}, this.exit = (e) => {
                  e !== 0 && console.warn("exit code:", e);
                }, this._exitPromise = new Promise((e) => {
                  this._resolveExitPromise = e;
                }), this._pendingEvent = null, this._scheduledTimeouts = /* @__PURE__ */ new Map(), this._nextCallbackTimeoutID = 1;
                const w = (e, o) => {
                  this.mem.setUint32(e + 0, o, !0), this.mem.setUint32(e + 4, Math.floor(o / 4294967296), !0);
                }, l = (e) => {
                  const o = this.mem.getUint32(e + 0, !0), p = this.mem.getInt32(e + 4, !0);
                  return o + p * 4294967296;
                }, s = (e) => {
                  const o = this.mem.getFloat64(e, !0);
                  if (o === 0)
                    return;
                  if (!isNaN(o))
                    return o;
                  const p = this.mem.getUint32(e, !0);
                  return this._values[p];
                }, a = (e, o) => {
                  if (typeof o == "number" && o !== 0) {
                    if (isNaN(o)) {
                      this.mem.setUint32(e + 4, 2146959360, !0), this.mem.setUint32(e, 0, !0);
                      return;
                    }
                    this.mem.setFloat64(e, o, !0);
                    return;
                  }
                  if (o === void 0) {
                    this.mem.setFloat64(e, 0, !0);
                    return;
                  }
                  let y = this._ids.get(o);
                  y === void 0 && (y = this._idPool.pop(), y === void 0 && (y = this._values.length), this._values[y] = o, this._goRefCounts[y] = 0, this._ids.set(o, y)), this._goRefCounts[y]++;
                  let j = 0;
                  switch (typeof o) {
                    case "object":
                      o !== null && (j = 1);
                      break;
                    case "string":
                      j = 2;
                      break;
                    case "symbol":
                      j = 3;
                      break;
                    case "function":
                      j = 4;
                      break;
                  }
                  this.mem.setUint32(e + 4, 2146959360 | j, !0), this.mem.setUint32(e, y, !0);
                }, h = (e) => {
                  const o = l(e + 0), p = l(e + 8);
                  return new Uint8Array(this._inst.exports.mem.buffer, o, p);
                }, b = (e) => {
                  const o = l(e + 0), p = l(e + 8), y = new Array(p);
                  for (let j = 0; j < p; j++)
                    y[j] = s(o + j * 8);
                  return y;
                }, _ = (e) => {
                  const o = l(e + 0), p = l(e + 8);
                  return M.decode(new DataView(this._inst.exports.mem.buffer, o, p));
                }, d = Date.now() - performance.now();
                this.importObject = {
                  go: {
                    "runtime.wasmExit": (e) => {
                      e >>>= 0;
                      const o = this.mem.getInt32(e + 8, !0);
                      this.exited = !0, delete this._inst, delete this._values, delete this._goRefCounts, delete this._ids, delete this._idPool, this.exit(o);
                    },
                    "runtime.wasmWrite": (e) => {
                      e >>>= 0;
                      const o = l(e + 8), p = l(e + 16), y = this.mem.getInt32(e + 24, !0);
                      S.fs.writeSync(o, new Uint8Array(this._inst.exports.mem.buffer, p, y));
                    },
                    "runtime.resetMemoryDataView": (e) => {
                      this.mem = new DataView(this._inst.exports.mem.buffer);
                    },
                    "runtime.nanotime1": (e) => {
                      e >>>= 0, w(e + 8, (d + performance.now()) * 1e6);
                    },
                    "runtime.walltime": (e) => {
                      e >>>= 0;
                      const o = new Date().getTime();
                      w(e + 8, o / 1e3), this.mem.setInt32(e + 16, o % 1e3 * 1e6, !0);
                    },
                    "runtime.scheduleTimeoutEvent": (e) => {
                      e >>>= 0;
                      const o = this._nextCallbackTimeoutID;
                      this._nextCallbackTimeoutID++, this._scheduledTimeouts.set(o, setTimeout(
                        () => {
                          for (this._resume(); this._scheduledTimeouts.has(o); )
                            console.warn("scheduleTimeoutEvent: missed timeout event"), this._resume();
                        },
                        l(e + 8) + 1
                      )), this.mem.setInt32(e + 16, o, !0);
                    },
                    "runtime.clearTimeoutEvent": (e) => {
                      e >>>= 0;
                      const o = this.mem.getInt32(e + 8, !0);
                      clearTimeout(this._scheduledTimeouts.get(o)), this._scheduledTimeouts.delete(o);
                    },
                    "runtime.getRandomData": (e) => {
                      e >>>= 0, crypto.getRandomValues(h(e + 8));
                    },
                    "syscall/js.finalizeRef": (e) => {
                      e >>>= 0;
                      const o = this.mem.getUint32(e + 8, !0);
                      if (this._goRefCounts[o]--, this._goRefCounts[o] === 0) {
                        const p = this._values[o];
                        this._values[o] = null, this._ids.delete(p), this._idPool.push(o);
                      }
                    },
                    "syscall/js.stringVal": (e) => {
                      e >>>= 0, a(e + 24, _(e + 8));
                    },
                    "syscall/js.valueGet": (e) => {
                      e >>>= 0;
                      const o = Reflect.get(s(e + 8), _(e + 16));
                      e = this._inst.exports.getsp() >>> 0, a(e + 32, o);
                    },
                    "syscall/js.valueSet": (e) => {
                      e >>>= 0, Reflect.set(s(e + 8), _(e + 16), s(e + 32));
                    },
                    "syscall/js.valueDelete": (e) => {
                      e >>>= 0, Reflect.deleteProperty(s(e + 8), _(e + 16));
                    },
                    "syscall/js.valueIndex": (e) => {
                      e >>>= 0, a(e + 24, Reflect.get(s(e + 8), l(e + 16)));
                    },
                    "syscall/js.valueSetIndex": (e) => {
                      e >>>= 0, Reflect.set(s(e + 8), l(e + 16), s(e + 24));
                    },
                    "syscall/js.valueCall": (e) => {
                      e >>>= 0;
                      try {
                        const o = s(e + 8), p = Reflect.get(o, _(e + 16)), y = b(e + 32), j = Reflect.apply(p, o, y);
                        e = this._inst.exports.getsp() >>> 0, a(e + 56, j), this.mem.setUint8(e + 64, 1);
                      } catch (o) {
                        e = this._inst.exports.getsp() >>> 0, a(e + 56, o), this.mem.setUint8(e + 64, 0);
                      }
                    },
                    "syscall/js.valueInvoke": (e) => {
                      e >>>= 0;
                      try {
                        const o = s(e + 8), p = b(e + 16), y = Reflect.apply(o, void 0, p);
                        e = this._inst.exports.getsp() >>> 0, a(e + 40, y), this.mem.setUint8(e + 48, 1);
                      } catch (o) {
                        e = this._inst.exports.getsp() >>> 0, a(e + 40, o), this.mem.setUint8(e + 48, 0);
                      }
                    },
                    "syscall/js.valueNew": (e) => {
                      e >>>= 0;
                      try {
                        const o = s(e + 8), p = b(e + 16), y = Reflect.construct(o, p);
                        e = this._inst.exports.getsp() >>> 0, a(e + 40, y), this.mem.setUint8(e + 48, 1);
                      } catch (o) {
                        e = this._inst.exports.getsp() >>> 0, a(e + 40, o), this.mem.setUint8(e + 48, 0);
                      }
                    },
                    "syscall/js.valueLength": (e) => {
                      e >>>= 0, w(e + 16, parseInt(s(e + 8).length));
                    },
                    "syscall/js.valuePrepareString": (e) => {
                      e >>>= 0;
                      const o = A.encode(String(s(e + 8)));
                      a(e + 16, o), w(e + 24, o.length);
                    },
                    "syscall/js.valueLoadString": (e) => {
                      e >>>= 0;
                      const o = s(e + 8);
                      h(e + 16).set(o);
                    },
                    "syscall/js.valueInstanceOf": (e) => {
                      e >>>= 0, this.mem.setUint8(e + 24, s(e + 8) instanceof s(e + 16) ? 1 : 0);
                    },
                    "syscall/js.copyBytesToGo": (e) => {
                      e >>>= 0;
                      const o = h(e + 8), p = s(e + 32);
                      if (!(p instanceof Uint8Array || p instanceof Uint8ClampedArray)) {
                        this.mem.setUint8(e + 48, 0);
                        return;
                      }
                      const y = p.subarray(0, o.length);
                      o.set(y), w(e + 40, y.length), this.mem.setUint8(e + 48, 1);
                    },
                    "syscall/js.copyBytesToJS": (e) => {
                      e >>>= 0;
                      const o = s(e + 8), p = h(e + 16);
                      if (!(o instanceof Uint8Array || o instanceof Uint8ClampedArray)) {
                        this.mem.setUint8(e + 48, 0);
                        return;
                      }
                      const y = p.subarray(0, o.length);
                      o.set(y), w(e + 40, y.length), this.mem.setUint8(e + 48, 1);
                    },
                    debug: (e) => {
                      console.log(e);
                    }
                  }
                };
              }
              run(w) {
                return P(this, null, function* () {
                  if (!(w instanceof WebAssembly.Instance))
                    throw new Error("Go.run: WebAssembly.Instance expected");
                  this._inst = w, this.mem = new DataView(this._inst.exports.mem.buffer), this._values = [
                    NaN,
                    0,
                    null,
                    !0,
                    !1,
                    S,
                    this
                  ], this._goRefCounts = new Array(this._values.length).fill(1 / 0), this._ids = /* @__PURE__ */ new Map([
                    [0, 1],
                    [null, 2],
                    [!0, 3],
                    [!1, 4],
                    [S, 5],
                    [this, 6]
                  ]), this._idPool = [], this.exited = !1;
                  let l = 4096;
                  const s = (e) => {
                    const o = l, p = A.encode(e + "\0");
                    return new Uint8Array(this.mem.buffer, l, p.length).set(p), l += p.length, l % 8 !== 0 && (l += 8 - l % 8), o;
                  }, a = this.argv.length, h = [];
                  this.argv.forEach((e) => {
                    h.push(s(e));
                  }), h.push(0), Object.keys(this.env).sort().forEach((e) => {
                    h.push(s(`${e}=${this.env[e]}`));
                  }), h.push(0);
                  const _ = l;
                  h.forEach((e) => {
                    this.mem.setUint32(l, e, !0), this.mem.setUint32(l + 4, 0, !0), l += 8;
                  });
                  const d = 4096 + 8192;
                  if (l >= d)
                    throw new Error("total length of command line and environment variables exceeds limit");
                  this._inst.exports.run(a, _), this.exited && this._resolveExitPromise(), yield this._exitPromise;
                });
              }
              _resume() {
                if (this.exited)
                  throw new Error("Go program has already exited");
                this._inst.exports.resume(), this.exited && this._resolveExitPromise();
              }
              _makeFuncWrapper(w) {
                const l = this;
                return function() {
                  const s = { id: w, this: this, args: arguments };
                  return l._pendingEvent = s, l._resume(), s.result;
                };
              }
            };
          })(), D = ({ data: x }) => {
            let A = new TextDecoder(), M = S.fs, w = "";
            M.writeSync = (b, _) => {
              if (b === 1)
                T(_);
              else if (b === 2) {
                w += A.decode(_);
                let d = w.split(`
`);
                d.length > 1 && console.log(d.slice(0, -1).join(`
`)), w = d[d.length - 1];
              } else
                throw new Error("Bad write");
              return _.length;
            };
            let l = [], s, a = 0;
            D = ({ data: b }) => {
              b.length > 0 && (l.push(b), s && s());
            }, M.read = (b, _, d, e, o, p) => {
              if (b !== 0 || d !== 0 || e !== _.length || o !== null)
                throw new Error("Bad read");
              if (l.length === 0) {
                s = () => M.read(b, _, d, e, o, p);
                return;
              }
              let y = l[0], j = Math.max(0, Math.min(e, y.length - a));
              _.set(y.subarray(a, a + j), d), a += j, a === y.length && (l.shift(), a = 0), p(null, j);
            };
            let h = new S.Go();
            h.argv = ["", "--service=0.16.10"], R(x, h).then(
              (b) => {
                T(null), h.run(b);
              },
              (b) => {
                T(b);
              }
            );
          };
          function R(x, A) {
            return P(this, null, function* () {
              if (x instanceof WebAssembly.Module)
                return WebAssembly.instantiate(x, A.importObject);
              const M = yield fetch(x);
              if (!M.ok)
                throw new Error(`Failed to download ${JSON.stringify(x)}`);
              if ("instantiateStreaming" in WebAssembly && /^application\/wasm($|;)/i.test(M.headers.get("Content-Type") || ""))
                return (yield WebAssembly.instantiateStreaming(M, A.importObject)).instance;
              const w = yield M.arrayBuffer();
              return (yield WebAssembly.instantiate(w, A.importObject)).instance;
            });
          }
          return (x) => D(x);
        })((T) => c.onmessage({ data: T }));
        c = {
          onmessage: null,
          postMessage: (T) => setTimeout(() => k({ data: T })),
          terminate() {
          }
        };
      }
      let m, g;
      const u = new Promise((k, T) => {
        m = k, g = T;
      });
      c.onmessage = ({ data: k }) => {
        c.onmessage = ({ data: T }) => v(T), k ? g(k) : m();
      }, c.postMessage(n || new URL(t, location.href).toString());
      let { readFromStdout: v, service: f } = it({
        writeToStdin(k) {
          c.postMessage(k);
        },
        isSync: !1,
        isWriteUnavailable: !0,
        esbuild: ye
      });
      yield u, je = {
        build: (k) => new Promise((T, P) => f.buildOrServe({
          callName: "build",
          refs: null,
          serveOptions: null,
          options: k,
          isTTY: !1,
          defaultWD: "/",
          callback: (D, S) => D ? P(D) : T(S)
        })),
        transform: (k, T) => new Promise((P, D) => f.transform({
          callName: "transform",
          refs: null,
          input: k,
          options: T || {},
          isTTY: !1,
          fs: {
            readFile(S, R) {
              R(new Error("Internal error"), null);
            },
            writeFile(S, R) {
              R(null);
            }
          },
          callback: (S, R) => S ? D(S) : P(R)
        })),
        formatMessages: (k, T) => new Promise((P, D) => f.formatMessages({
          callName: "formatMessages",
          refs: null,
          messages: k,
          options: T,
          callback: (S, R) => S ? D(S) : P(R)
        })),
        analyzeMetafile: (k, T) => new Promise((P, D) => f.analyzeMetafile({
          callName: "analyzeMetafile",
          refs: null,
          metafile: typeof k == "string" ? k : JSON.stringify(k),
          options: T,
          callback: (S, R) => S ? D(S) : P(R)
        }))
      };
    }), _t = ye;
  })(X);
})(Te);
const $t = /* @__PURE__ */ kt(Te.exports), St = /* @__PURE__ */ Et({
  __proto__: null,
  default: $t
}, [Te.exports]);
export {
  St as b
};
//# sourceMappingURL=esbuild-5181e8c1.mjs.map
