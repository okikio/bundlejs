let O = (n, t = 21) => (e = t) => {
  let r = "", i = e;
  for (; i--; )
    r += n[Math.random() * n.length | 0];
  return r;
};
const v = O("1234567890abcdef", 4), B = v();
let T = 0;
const E = () => `${B}-${T++}`;
class k {
  constructor(t) {
    this.projectRoot = t, this.nodeParts = {}, this.nodeMetas = {};
  }
  trimProjectRootId(t) {
    return t.replace(this.projectRoot, "");
  }
  getModuleUid(t) {
    return t in this.nodeMetas || (this.nodeMetas[t] = {
      uid: E(),
      meta: { id: this.trimProjectRootId(t), moduleParts: {}, imported: /* @__PURE__ */ new Set(), importedBy: /* @__PURE__ */ new Set() }
    }), this.nodeMetas[t].uid;
  }
  getBundleModuleUid(t, e) {
    return e in this.nodeMetas || (this.nodeMetas[e] = {
      uid: E(),
      meta: { id: this.trimProjectRootId(e), moduleParts: {}, imported: /* @__PURE__ */ new Set(), importedBy: /* @__PURE__ */ new Set() }
    }), t in this.nodeMetas[e].meta.moduleParts || (this.nodeMetas[e].meta.moduleParts[t] = E()), this.nodeMetas[e].meta.moduleParts[t];
  }
  setNodePart(t, e, r) {
    const i = this.getBundleModuleUid(t, e);
    if (i in this.nodeParts)
      throw new Error(
        `Override module: bundle id ${t}, module id ${e}, value ${JSON.stringify(
          r
        )}, existing value: ${JSON.stringify(this.nodeParts[i])}`
      );
    return this.nodeParts[i] = { ...r, mainUid: this.getModuleUid(e) }, i;
  }
  setNodeMeta(t, e) {
    this.getModuleUid(t), this.nodeMetas[t].meta.isEntry = e.isEntry, this.nodeMetas[t].meta.isExternal = e.isExternal;
  }
  hasNodePart(t, e) {
    return !(!(e in this.nodeMetas) || !(t in this.nodeMetas[e].meta.moduleParts) || !(this.nodeMetas[e].meta.moduleParts[t] in this.nodeParts));
  }
  getNodeParts() {
    return this.nodeParts;
  }
  getNodeMetas() {
    const t = {};
    for (const { uid: e, meta: r } of Object.values(this.nodeMetas))
      t[e] = {
        ...r,
        imported: [...r.imported].map((i) => {
          const [s, o] = i.split(","), a = { uid: s };
          return o === "true" && (a.dynamic = !0), a;
        }),
        importedBy: [...r.importedBy].map((i) => {
          const [s, o] = i.split(","), a = { uid: s };
          return o === "true" && (a.dynamic = !0), a;
        })
      };
    return t;
  }
  addImportedByLink(t, e) {
    const r = this.getModuleUid(e);
    this.getModuleUid(t), this.nodeMetas[t].meta.importedBy.add(r);
  }
  addImportedLink(t, e, r = !1) {
    const i = this.getModuleUid(e);
    this.getModuleUid(t), this.nodeMetas[t].meta.imported.add(String([i, r]));
  }
}
const w = (n) => "children" in n, U = (n, t, e, r) => {
  if (e.length === 0)
    throw new Error(`Error adding node to path ${n}`);
  const [i, ...s] = e;
  if (s.length === 0) {
    t.children.push({ ...r, name: i });
    return;
  } else {
    let o = t.children.find((a) => a.name === i && w(a));
    o || (o = { name: i, children: [] }, t.children.push(o)), U(n, o, s, r);
    return;
  }
}, z = (n) => {
  if (n.children.length === 1) {
    const t = n.children[0], e = `${n.name}/${t.name}`;
    return w(t) ? (n.name = e, n.children = t.children, z(n)) : {
      name: e,
      uid: t.uid
    };
  } else
    return n.children = n.children.map((t) => w(t) ? z(t) : t), n;
}, C = (n, t, e) => {
  const r = {
    name: n,
    children: []
  };
  for (const { id: i, renderedLength: s, gzipLength: o, brotliLength: a } of t) {
    const f = e.setNodePart(n, i, { renderedLength: s, gzipLength: o, brotliLength: a }), y = e.trimProjectRootId(i), P = y.split(/\\|\//).filter((M) => M !== "");
    U(y, r, P, { uid: f });
  }
  return r.children = r.children.map((i) => w(i) ? z(i) : i), r;
}, R = (n) => ({
  name: "root",
  children: n,
  isRoot: !0
}), x = (n, t, e) => {
  const r = {}, i = [n];
  for (; i.length > 0; ) {
    const s = i.shift();
    if (r[s])
      continue;
    r[s] = !0;
    const o = t(s);
    if (!o)
      return;
    o.isEntry && e.setNodeMeta(s, { isEntry: !0 }), o.isExternal && e.setNodeMeta(s, { isExternal: !0 });
    for (const a of o.importedIds)
      e.addImportedByLink(a, s), e.addImportedLink(s, a), i.push(a);
    for (const a of o.dynamicallyImportedIds)
      e.addImportedByLink(a, s), e.addImportedLink(s, a, !0), i.push(a);
  }
}, I = (n) => n.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
async function A({ title: n, data: t, template: e }) {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <title>${I(n)}</title>
        <link rel='stylesheet' href='/js/${e}.min.css' />
      </head>
      <body>
        <main></main>
        <script type="module" defer>
          import * as drawChart from "/js/${e}.min.js";
          const data = ${JSON.stringify(t)};
          
          const run = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            const chartNode = document.querySelector("main");
            drawChart.default(chartNode, data, width, height);
          };
      
          window.addEventListener('resize', run);
      
          document.addEventListener('DOMContentLoaded', run);
        <\/script>
      </body>
    </html>
  `;
}
const S = () => Promise.resolve(0), q = async (n) => {
  const { gzip: t, getWASM: e } = await import("./mod-cbcfa77c.mjs");
  return await e(), (await t(n, 9)).length;
}, D = async (n) => {
  const { compress: t } = await import("./mod-898f5b09.mjs");
  return (await t(n, n.length, 11)).length;
}, F = async (n, t, e = {}) => {
  const r = e.title ?? "Esbuild Visualizer", i = (e.template == !0 ? "treemap" : e.template) ?? "treemap", s = "";
  let o = /* @__PURE__ */ new Map();
  t.forEach(({ path: d, contents: c }) => {
    o.set(d, c);
  });
  const a = !!e.gzipSize, f = !!e.brotliSize, y = a ? q : S, P = f ? D : S, M = async ({
    id: d,
    mod: c
  }) => {
    const l = o.get(d);
    let m = l == null || l == null || l?.length == 0, [g, u, p] = await Promise.all(m ? [0, 0, c.bytesInOutput] : [y(l), P(l), l?.length]);
    return {
      id: d,
      gzipLength: g,
      brotliLength: u,
      renderedLength: p
    };
  }, b = [], h = new k(s);
  for (const [d, c] of Object.entries(n.outputs)) {
    const l = await Promise.all(
      Object.entries(c.inputs).map(([u, p]) => M({ id: u, mod: p }))
    ), m = C(d, l, h), g = o.get(d);
    if (m.children.length === 0 && g) {
      const u = await M({
        id: d,
        mod: { bytesInOutput: g?.length }
      }), p = `${d}-unknown`, N = h.setNodePart(d, p, u);
      h.setNodeMeta(p, { isEntry: !0 });
      const j = { name: d, uid: N };
      b.push(j);
    } else
      b.push(m);
  }
  const L = (d) => (c) => {
    const m = n.inputs?.[c]?.imports.map((u) => u.path);
    return {
      renderedLength: o.get(c)?.length ?? d.inputs?.[c]?.bytesInOutput ?? 0,
      importedIds: m ?? [],
      dynamicallyImportedIds: [],
      isEntry: d.entryPoint === c,
      isExternal: !1
    };
  };
  for (const [d, c] of Object.entries(n.outputs))
    c.entryPoint != null && x(d, L(c), h);
  const $ = {
    version: 3,
    tree: R(b),
    nodeParts: h.getNodeParts(),
    nodeMetas: h.getNodeMetas(),
    env: {},
    options: {
      gzip: a,
      brotli: f
    }
  };
  return await A({
    title: r,
    data: $,
    template: i
  });
}, H = async (n, t, e = {}, r = console.log) => {
  try {
    return await F(n, t, {
      title: "Bundle Analysis",
      ...e
    });
  } catch (i) {
    let { stack: s } = i;
    r([`[Analyzer] ${i}`, s], "warning"), console.warn(i, s);
  }
};
export {
  H as analyze
};
//# sourceMappingURL=index.mjs.map
