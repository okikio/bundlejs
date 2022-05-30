const debounce = (func, wait = 300, immediate) => {
  let timeout;
  return function(...args) {
    let context = this;
    let later = () => {
      timeout = null;
      if (!immediate)
        func.apply(context, args);
    };
    let callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow)
      func.apply(context, args);
  };
};
const CACHE = /* @__PURE__ */ new Map();
const CACHE_NAME = "EXTERNAL_FETCHES";
const newRequest = async (cache, request, fetchOpts) => {
  let networkResponse = await fetch(request, fetchOpts);
  let clonedResponse = networkResponse.clone();
  if ("caches" in globalThis)
    cache.put(request, clonedResponse);
  else
    CACHE.set(request, clonedResponse);
  return networkResponse;
};
const getRequest = async (url, permanent = false, fetchOpts) => {
  let request = new Request(url.toString());
  let response;
  let cache;
  let cacheResponse;
  if ("caches" in globalThis) {
    cache = await caches.open(CACHE_NAME);
    cacheResponse = await cache.match(request);
  } else {
    cacheResponse = CACHE.get(request);
  }
  response = cacheResponse;
  if (!cacheResponse)
    response = await newRequest(cache, request, fetchOpts);
  else if (!permanent)
    newRequest(cache, request, fetchOpts);
  return response.clone();
};
var y = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$", x = {};
function M(r, s) {
  if (!x[r]) {
    x[r] = {};
    for (let f = 0; f < r.length; f++)
      x[r][r.charAt(f)] = f;
  }
  return x[r][s];
}
function k(r) {
  return r == null ? "" : r == "" ? null : (r = r.replaceAll(" ", "+"), A(r.length, 32, (s) => M(y, r.charAt(s))));
}
function A(r, s, f) {
  let p = [], h = 4, i = 4, w = 3, o = "", g = [], u, d, l, a, c, e, t, n = { val: f(0), position: s, index: 1 };
  for (u = 0; u < 3; u += 1)
    p[u] = u;
  for (l = 0, c = Math.pow(2, 2), e = 1; e != c; )
    a = n.val & n.position, n.position >>= 1, n.position == 0 && (n.position = s, n.val = f(n.index++)), l |= (a > 0 ? 1 : 0) * e, e <<= 1;
  switch (l) {
    case 0:
      for (l = 0, c = Math.pow(2, 8), e = 1; e != c; )
        a = n.val & n.position, n.position >>= 1, n.position == 0 && (n.position = s, n.val = f(n.index++)), l |= (a > 0 ? 1 : 0) * e, e <<= 1;
      t = String.fromCharCode(l);
      break;
    case 1:
      for (l = 0, c = Math.pow(2, 16), e = 1; e != c; )
        a = n.val & n.position, n.position >>= 1, n.position == 0 && (n.position = s, n.val = f(n.index++)), l |= (a > 0 ? 1 : 0) * e, e <<= 1;
      t = String.fromCharCode(l);
      break;
    case 2:
      return "";
  }
  for (p[3] = t, d = t, g.push(t); ; ) {
    if (n.index > r)
      return "";
    for (l = 0, c = Math.pow(2, w), e = 1; e != c; )
      a = n.val & n.position, n.position >>= 1, n.position == 0 && (n.position = s, n.val = f(n.index++)), l |= (a > 0 ? 1 : 0) * e, e <<= 1;
    switch (t = l) {
      case 0:
        for (l = 0, c = Math.pow(2, 8), e = 1; e != c; )
          a = n.val & n.position, n.position >>= 1, n.position == 0 && (n.position = s, n.val = f(n.index++)), l |= (a > 0 ? 1 : 0) * e, e <<= 1;
        p[i++] = String.fromCharCode(l), t = i - 1, h--;
        break;
      case 1:
        for (l = 0, c = Math.pow(2, 16), e = 1; e != c; )
          a = n.val & n.position, n.position >>= 1, n.position == 0 && (n.position = s, n.val = f(n.index++)), l |= (a > 0 ? 1 : 0) * e, e <<= 1;
        p[i++] = String.fromCharCode(l), t = i - 1, h--;
        break;
      case 2:
        return g.join("");
    }
    if (h == 0 && (h = Math.pow(2, w), w++), p[t])
      o = p[t];
    else if (t === i && typeof d == "string")
      o = d + d.charAt(0);
    else
      return null;
    g.push(o), p[i++] = d + o.charAt(0), h--, d = o, h == 0 && (h = Math.pow(2, w), w++);
  }
}
const isObject = (obj) => typeof obj === "object" && obj != null;
const isPrimitive = (val) => typeof val === "object" ? val === null : typeof val !== "function";
const isValidKey = (key) => {
  return key !== "__proto__" && key !== "constructor" && key !== "prototype";
};
/*!
 * Based on assign-deep <https://github.com/jonschlinkert/assign-deep>
 *
 * Copyright (c) 2017-present, Jon Schlinkert.
 * Released under the MIT License.
 */
const deepAssign = (target, ...args) => {
  let i = 0;
  if (isPrimitive(target))
    target = args[i++];
  if (!target)
    target = {};
  for (; i < args.length; i++) {
    if (isObject(args[i])) {
      for (const key of Object.keys(args[i])) {
        if (isValidKey(key)) {
          if (isObject(target[key]) && isObject(args[i][key])) {
            target[key] = deepAssign(Array.isArray(target[key]) ? [] : {}, target[key], args[i][key]);
          } else {
            target[key] = args[i][key];
          }
        }
      }
    }
  }
  return target;
};
const DEFAULT_CDN_HOST = "https://unpkg.com";
const EasyDefaultConfig = {
  "cdn": DEFAULT_CDN_HOST,
  "compression": "gzip",
  "analysis": false,
  "esbuild": {
    "target": ["esnext"],
    "format": "esm",
    "bundle": true,
    "minify": true,
    "treeShaking": true,
    "platform": "browser"
  }
};
deepAssign({}, EasyDefaultConfig, {
  "esbuild": {
    "color": true,
    "globalName": "BundledCode",
    "logLevel": "info",
    "sourcemap": false,
    "incremental": false
  }
});
const parseInput = (value) => {
  const host = "https://api.npms.io/v2/search?q";
  let urlScheme = `${host}=${encodeURIComponent(value)}&size=30`;
  let version = "";
  let exec = /([\S]+)@([\S]+)/g.exec(value);
  if (exec) {
    let [, pkg, ver] = exec;
    version = ver;
    urlScheme = `${host}=${encodeURIComponent(pkg)}&size=30`;
  }
  return { url: urlScheme, version };
};
const parseTreeshakeExports = (str) => (str != null ? str : "").split(/\],/).map((str2) => str2.replace(/\[|\]/g, ""));
const parseSearchQuery = (shareURL) => {
  try {
    const searchParams = shareURL.searchParams;
    let result = "";
    let query = searchParams.get("query") || searchParams.get("q");
    let treeshake = searchParams.get("treeshake");
    if (query) {
      let queryArr = query.trim().split(",");
      let treeshakeArr = parseTreeshakeExports((treeshake != null ? treeshake : "").trim());
      result += "// Click Build for the Bundled, Minified & Compressed package size\n" + queryArr.map((q, i) => {
        let treeshakeExports = treeshakeArr[i] && treeshakeArr[i].trim() !== "*" ? treeshakeArr[i].trim().split(",").join(", ") : "*";
        let [
          ,
          ,
          declaration = "export",
          module
        ] = /^(\((.*)\))?(.*)/.exec(q);
        return `${declaration} ${treeshakeExports} from ${JSON.stringify(module)};`;
      }).join("\n");
    }
    let share = searchParams.get("share");
    if (share)
      result += "\n" + k(share.trim());
    let plaintext = searchParams.get("text");
    if (plaintext) {
      result += "\n" + JSON.parse(/^["']/.test(plaintext) && /["']$/.test(plaintext) ? plaintext : JSON.stringify("" + plaintext).replace(/\\\\/g, "\\"));
    }
    return result.trim();
  } catch (e) {
  }
};
const parseConfig = (shareURL) => {
  var _a;
  try {
    const searchParams = shareURL.searchParams;
    const config = (_a = searchParams.get("config")) != null ? _a : "{}";
    return deepAssign({}, EasyDefaultConfig, JSON.parse(config ? config : "{}"));
  } catch (e) {
  }
};
export { CACHE, CACHE_NAME, debounce, getRequest, newRequest, parseConfig, parseInput, parseSearchQuery, parseTreeshakeExports };
