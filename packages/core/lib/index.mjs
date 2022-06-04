const ESCAPE_TO_COLOR = {
  "37": "dim",
  "31": "red",
  "32": "green",
  "34": "blue",
  "36": "cyan",
  "35": "magenta",
  "33": "yellow",
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
function htmlEscape(string) {
  return string.replace(/\<br\>/g, "\n").replace(/\&/g, "&amp;").replace(/\"/g, "&quot;").replace(/\'/g, "&#39;").replace(/\</g, "&lt;").replace(/\>/g, "&gt;");
}
class AnsiBuffer {
  constructor() {
    this.result = "";
    this._stack = [];
    this._bold = false;
    this._underline = false;
    this._link = false;
  }
  text(text) {
    this.result += htmlEscape(text);
  }
  reset() {
    let close;
    while (close = this._stack.pop()) {
      this.result += close;
    }
  }
  bold() {
    if (!this._bold) {
      this._bold = true;
      this.result += "<strong>";
      this._stack.push("</strong>");
    }
  }
  underline() {
    if (!this._underline) {
      this._underline = true;
      this.result += "<ins>";
      this._stack.push("</ins>");
    }
  }
  last() {
    return this._stack[this._stack.length - 1];
  }
  color(color) {
    let close;
    while ((close = this.last()) === "</span>") {
      this._stack.pop();
      this.result += close;
    }
    this.result += `<span class="color-${color}">`;
    this._stack.push("</span>");
  }
  done() {
    this.reset();
    return this.result;
  }
}
function render(ansi) {
  ansi = ansi.trimEnd();
  let i = 0;
  const buffer = new AnsiBuffer();
  for (let m of ansi.matchAll(/\x1B\[([\d;]+)m/g)) {
    const escape = m[1];
    buffer.text(ansi.slice(i, m.index));
    i = m.index + m[0].length;
    if (escape === "0") {
      buffer.reset();
    } else if (escape === "1") {
      buffer.bold();
    } else if (escape === "4") {
      buffer.underline();
    } else if (ESCAPE_TO_COLOR[escape]) {
      buffer.color(ESCAPE_TO_COLOR[escape]);
    }
  }
  if (i < ansi.length) {
    buffer.text(ansi.slice(i));
  }
  return buffer.done();
}
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
const isObject = (obj) => typeof obj === "object" && obj != null;
const isPrimitive = (val) => typeof val === "object" ? val === null : typeof val !== "function";
const isValidKey = (key) => {
  return key !== "__proto__" && key !== "constructor" && key !== "prototype";
};
const deepEqual = (obj1, obj2) => {
  if (obj1 === obj2) {
    return true;
  } else if (isObject(obj1) && isObject(obj2)) {
    if (Object.keys(obj1).length !== Object.keys(obj2).length) {
      return false;
    }
    for (var prop in obj1) {
      if (!deepEqual(obj1[prop], obj2[prop]))
        return false;
    }
    return true;
  }
};
const deepDiff = (obj1, obj2) => {
  let keys = Object.keys(obj2);
  let result = {};
  let i = 0;
  for (; i < keys.length; i++) {
    let key = keys[i];
    let value = obj2[key];
    if (key in obj1) {
      let bothAreArrays = Array.isArray(obj1[key]) && Array.isArray(value);
      if (obj1[key] == value) {
        continue;
      } else if (bothAreArrays) {
        if (!deepEqual(obj1[key], value))
          result[key] = value;
        else
          continue;
      } else if (isObject(obj1[key]) && isObject(value)) {
        let diff = deepDiff(obj1[key], value);
        if (Object.keys(diff).length)
          result[key] = diff;
      } else {
        result[key] = value;
      }
    } else {
      result[key] = value;
    }
  }
  return result;
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
const encode = (str) => new TextEncoder().encode(str);
const decode = (buf) => new TextDecoder().decode(buf);
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
const CHAR_DOT = 46;
const CHAR_FORWARD_SLASH = 47;
function assertPath(path2) {
  if (typeof path2 !== "string") {
    throw new TypeError(`Path must be a string. Received ${JSON.stringify(path2)}`);
  }
}
function isPosixPathSeparator(code) {
  return code === CHAR_FORWARD_SLASH;
}
function normalizeString(path2, allowAboveRoot, separator, isPathSeparator2) {
  let res = "";
  let lastSegmentLength = 0;
  let lastSlash = -1;
  let dots = 0;
  let code;
  for (let i = 0, len = path2.length; i <= len; ++i) {
    if (i < len)
      code = path2.charCodeAt(i);
    else if (isPathSeparator2(code))
      break;
    else
      code = CHAR_FORWARD_SLASH;
    if (isPathSeparator2(code)) {
      if (lastSlash === i - 1 || dots === 1)
        ;
      else if (lastSlash !== i - 1 && dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== CHAR_DOT || res.charCodeAt(res.length - 2) !== CHAR_DOT) {
          if (res.length > 2) {
            const lastSlashIndex = res.lastIndexOf(separator);
            if (lastSlashIndex === -1) {
              res = "";
              lastSegmentLength = 0;
            } else {
              res = res.slice(0, lastSlashIndex);
              lastSegmentLength = res.length - 1 - res.lastIndexOf(separator);
            }
            lastSlash = i;
            dots = 0;
            continue;
          } else if (res.length === 2 || res.length === 1) {
            res = "";
            lastSegmentLength = 0;
            lastSlash = i;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          if (res.length > 0)
            res += `${separator}..`;
          else
            res = "..";
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0)
          res += separator + path2.slice(lastSlash + 1, i);
        else
          res = path2.slice(lastSlash + 1, i);
        lastSegmentLength = i - lastSlash - 1;
      }
      lastSlash = i;
      dots = 0;
    } else if (code === CHAR_DOT && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}
function _format(sep2, pathObject) {
  const dir = pathObject.dir || pathObject.root;
  const base = pathObject.base || (pathObject.name || "") + (pathObject.ext || "");
  if (!dir)
    return base;
  if (dir === pathObject.root)
    return dir + base;
  return dir + sep2 + base;
}
const WHITESPACE_ENCODINGS = {
  "	": "%09",
  "\n": "%0A",
  "\v": "%0B",
  "\f": "%0C",
  "\r": "%0D",
  " ": "%20"
};
function encodeWhitespace(string) {
  return string.replaceAll(/[\s]/g, (c) => {
    var _a;
    return (_a = WHITESPACE_ENCODINGS[c]) != null ? _a : c;
  });
}
const sep$1 = "/";
const delimiter$1 = ":";
function resolve$1(...pathSegments) {
  var _a, _b;
  let resolvedPath = "";
  let resolvedAbsolute = false;
  for (let i = pathSegments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    let path2;
    if (i >= 0)
      path2 = pathSegments[i];
    else {
      const { Deno } = globalThis;
      if (typeof (Deno == null ? void 0 : Deno.cwd) !== "function") {
        throw new TypeError("Resolved a relative path without a CWD.");
      }
      path2 = (_b = (_a = Deno == null ? void 0 : Deno.cwd) == null ? void 0 : _a.call(Deno)) != null ? _b : "/";
    }
    assertPath(path2);
    if (path2.length === 0) {
      continue;
    }
    resolvedPath = `${path2}/${resolvedPath}`;
    resolvedAbsolute = path2.charCodeAt(0) === CHAR_FORWARD_SLASH;
  }
  resolvedPath = normalizeString(resolvedPath, !resolvedAbsolute, "/", isPosixPathSeparator);
  if (resolvedAbsolute) {
    if (resolvedPath.length > 0)
      return `/${resolvedPath}`;
    else
      return "/";
  } else if (resolvedPath.length > 0)
    return resolvedPath;
  else
    return ".";
}
function normalize$1(path2) {
  assertPath(path2);
  if (path2.length === 0)
    return ".";
  const isAbsolute2 = path2.charCodeAt(0) === CHAR_FORWARD_SLASH;
  const trailingSeparator = path2.charCodeAt(path2.length - 1) === CHAR_FORWARD_SLASH;
  path2 = normalizeString(path2, !isAbsolute2, "/", isPosixPathSeparator);
  if (path2.length === 0 && !isAbsolute2)
    path2 = ".";
  if (path2.length > 0 && trailingSeparator)
    path2 += "/";
  if (isAbsolute2)
    return `/${path2}`;
  return path2;
}
function isAbsolute$1(path2) {
  assertPath(path2);
  return path2.length > 0 && path2.charCodeAt(0) === CHAR_FORWARD_SLASH;
}
function join$1(...paths) {
  if (paths.length === 0)
    return ".";
  let joined;
  for (let i = 0, len = paths.length; i < len; ++i) {
    const path2 = paths[i];
    assertPath(path2);
    if (path2.length > 0) {
      if (!joined)
        joined = path2;
      else
        joined += `/${path2}`;
    }
  }
  if (!joined)
    return ".";
  return normalize$1(joined);
}
function relative$1(from, to) {
  assertPath(from);
  assertPath(to);
  if (from === to)
    return "";
  from = resolve$1(from);
  to = resolve$1(to);
  if (from === to)
    return "";
  let fromStart = 1;
  const fromEnd = from.length;
  for (; fromStart < fromEnd; ++fromStart) {
    if (from.charCodeAt(fromStart) !== CHAR_FORWARD_SLASH)
      break;
  }
  const fromLen = fromEnd - fromStart;
  let toStart = 1;
  const toEnd = to.length;
  for (; toStart < toEnd; ++toStart) {
    if (to.charCodeAt(toStart) !== CHAR_FORWARD_SLASH)
      break;
  }
  const toLen = toEnd - toStart;
  const length = fromLen < toLen ? fromLen : toLen;
  let lastCommonSep = -1;
  let i = 0;
  for (; i <= length; ++i) {
    if (i === length) {
      if (toLen > length) {
        if (to.charCodeAt(toStart + i) === CHAR_FORWARD_SLASH) {
          return to.slice(toStart + i + 1);
        } else if (i === 0) {
          return to.slice(toStart + i);
        }
      } else if (fromLen > length) {
        if (from.charCodeAt(fromStart + i) === CHAR_FORWARD_SLASH) {
          lastCommonSep = i;
        } else if (i === 0) {
          lastCommonSep = 0;
        }
      }
      break;
    }
    const fromCode = from.charCodeAt(fromStart + i);
    const toCode = to.charCodeAt(toStart + i);
    if (fromCode !== toCode)
      break;
    else if (fromCode === CHAR_FORWARD_SLASH)
      lastCommonSep = i;
  }
  let out = "";
  for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
    if (i === fromEnd || from.charCodeAt(i) === CHAR_FORWARD_SLASH) {
      if (out.length === 0)
        out += "..";
      else
        out += "/..";
    }
  }
  if (out.length > 0)
    return out + to.slice(toStart + lastCommonSep);
  else {
    toStart += lastCommonSep;
    if (to.charCodeAt(toStart) === CHAR_FORWARD_SLASH)
      ++toStart;
    return to.slice(toStart);
  }
}
function toNamespacedPath$1(path2) {
  return path2;
}
function dirname$1(path2) {
  assertPath(path2);
  if (path2.length === 0)
    return ".";
  const hasRoot = path2.charCodeAt(0) === CHAR_FORWARD_SLASH;
  let end = -1;
  let matchedSlash = true;
  for (let i = path2.length - 1; i >= 1; --i) {
    if (path2.charCodeAt(i) === CHAR_FORWARD_SLASH) {
      if (!matchedSlash) {
        end = i;
        break;
      }
    } else {
      matchedSlash = false;
    }
  }
  if (end === -1)
    return hasRoot ? "/" : ".";
  if (hasRoot && end === 1)
    return "//";
  return path2.slice(0, end);
}
function basename$1(path2, ext = "") {
  if (ext !== void 0 && typeof ext !== "string") {
    throw new TypeError('"ext" argument must be a string');
  }
  assertPath(path2);
  let start = 0;
  let end = -1;
  let matchedSlash = true;
  let i;
  if (ext !== void 0 && ext.length > 0 && ext.length <= path2.length) {
    if (ext.length === path2.length && ext === path2)
      return "";
    let extIdx = ext.length - 1;
    let firstNonSlashEnd = -1;
    for (i = path2.length - 1; i >= 0; --i) {
      const code = path2.charCodeAt(i);
      if (code === CHAR_FORWARD_SLASH) {
        if (!matchedSlash) {
          start = i + 1;
          break;
        }
      } else {
        if (firstNonSlashEnd === -1) {
          matchedSlash = false;
          firstNonSlashEnd = i + 1;
        }
        if (extIdx >= 0) {
          if (code === ext.charCodeAt(extIdx)) {
            if (--extIdx === -1) {
              end = i;
            }
          } else {
            extIdx = -1;
            end = firstNonSlashEnd;
          }
        }
      }
    }
    if (start === end)
      end = firstNonSlashEnd;
    else if (end === -1)
      end = path2.length;
    return path2.slice(start, end);
  } else {
    for (i = path2.length - 1; i >= 0; --i) {
      if (path2.charCodeAt(i) === CHAR_FORWARD_SLASH) {
        if (!matchedSlash) {
          start = i + 1;
          break;
        }
      } else if (end === -1) {
        matchedSlash = false;
        end = i + 1;
      }
    }
    if (end === -1)
      return "";
    return path2.slice(start, end);
  }
}
function extname$1(path2) {
  assertPath(path2);
  let startDot = -1;
  let startPart = 0;
  let end = -1;
  let matchedSlash = true;
  let preDotState = 0;
  for (let i = path2.length - 1; i >= 0; --i) {
    const code = path2.charCodeAt(i);
    if (code === CHAR_FORWARD_SLASH) {
      if (!matchedSlash) {
        startPart = i + 1;
        break;
      }
      continue;
    }
    if (end === -1) {
      matchedSlash = false;
      end = i + 1;
    }
    if (code === CHAR_DOT) {
      if (startDot === -1)
        startDot = i;
      else if (preDotState !== 1)
        preDotState = 1;
    } else if (startDot !== -1) {
      preDotState = -1;
    }
  }
  if (startDot === -1 || end === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    return "";
  }
  return path2.slice(startDot, end);
}
function format$1(pathObject) {
  if (pathObject === null || typeof pathObject !== "object") {
    throw new TypeError(`The "pathObject" argument must be of type Object. Received type ${typeof pathObject}`);
  }
  return _format("/", pathObject);
}
function parse$2(path2) {
  assertPath(path2);
  const ret = { root: "", dir: "", base: "", ext: "", name: "" };
  if (path2.length === 0)
    return ret;
  const isAbsolute2 = path2.charCodeAt(0) === CHAR_FORWARD_SLASH;
  let start;
  if (isAbsolute2) {
    ret.root = "/";
    start = 1;
  } else {
    start = 0;
  }
  let startDot = -1;
  let startPart = 0;
  let end = -1;
  let matchedSlash = true;
  let i = path2.length - 1;
  let preDotState = 0;
  for (; i >= start; --i) {
    const code = path2.charCodeAt(i);
    if (code === CHAR_FORWARD_SLASH) {
      if (!matchedSlash) {
        startPart = i + 1;
        break;
      }
      continue;
    }
    if (end === -1) {
      matchedSlash = false;
      end = i + 1;
    }
    if (code === CHAR_DOT) {
      if (startDot === -1)
        startDot = i;
      else if (preDotState !== 1)
        preDotState = 1;
    } else if (startDot !== -1) {
      preDotState = -1;
    }
  }
  if (startDot === -1 || end === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    if (end !== -1) {
      if (startPart === 0 && isAbsolute2) {
        ret.base = ret.name = path2.slice(1, end);
      } else {
        ret.base = ret.name = path2.slice(startPart, end);
      }
    }
  } else {
    if (startPart === 0 && isAbsolute2) {
      ret.name = path2.slice(1, startDot);
      ret.base = path2.slice(1, end);
    } else {
      ret.name = path2.slice(startPart, startDot);
      ret.base = path2.slice(startPart, end);
    }
    ret.ext = path2.slice(startDot, end);
  }
  if (startPart > 0)
    ret.dir = path2.slice(0, startPart - 1);
  else if (isAbsolute2)
    ret.dir = "/";
  return ret;
}
function fromFileUrl$1(url) {
  url = url instanceof URL ? url : new URL(url);
  if (url.protocol != "file:") {
    throw new TypeError("Must be a file URL.");
  }
  return decodeURIComponent(url.pathname.replace(/%(?![0-9A-Fa-f]{2})/g, "%25"));
}
function toFileUrl$1(path2) {
  if (!isAbsolute$1(path2)) {
    throw new TypeError("Must be an absolute path.");
  }
  const url = new URL("file:///");
  url.pathname = encodeWhitespace(path2.replace(/%/g, "%25").replace(/\\/g, "%5C"));
  return url;
}
var _posix = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  sep: sep$1,
  delimiter: delimiter$1,
  resolve: resolve$1,
  normalize: normalize$1,
  isAbsolute: isAbsolute$1,
  join: join$1,
  relative: relative$1,
  toNamespacedPath: toNamespacedPath$1,
  dirname: dirname$1,
  basename: basename$1,
  extname: extname$1,
  format: format$1,
  parse: parse$2,
  fromFileUrl: fromFileUrl$1,
  toFileUrl: toFileUrl$1
}, Symbol.toStringTag, { value: "Module" }));
const path = _posix;
const {
  basename,
  delimiter,
  dirname,
  extname,
  format,
  fromFileUrl,
  isAbsolute,
  join,
  normalize,
  parse: parse$1,
  relative,
  resolve,
  sep,
  toFileUrl,
  toNamespacedPath
} = path;
const FileSystem = /* @__PURE__ */ new Map();
const getResolvedPath = (path2, importer) => {
  let resolvedPath = path2;
  if (importer && path2.startsWith("."))
    resolvedPath = resolve(dirname(importer), path2);
  if (FileSystem.has(resolvedPath))
    return resolvedPath;
  throw `File "${resolvedPath}" does not exist`;
};
const getFile = (path2, type = "buffer", importer) => {
  let resolvedPath = getResolvedPath(path2, importer);
  if (FileSystem.has(resolvedPath)) {
    let file = FileSystem.get(resolvedPath);
    return type == "string" ? decode(file) : file;
  }
};
const setFile = (path2, content, importer) => {
  let resolvedPath = path2;
  if (importer && path2.startsWith("."))
    resolvedPath = resolve(dirname(importer), path2);
  try {
    FileSystem.set(resolvedPath, content instanceof Uint8Array ? content : encode(content));
  } catch (e) {
    throw `Error occurred while writing to "${resolvedPath}"`;
  }
};
const RESOLVE_EXTENSIONS = [".tsx", ".ts", ".jsx", ".js", ".css", ".json"];
const inferLoader = (urlStr) => {
  const ext = extname(urlStr);
  if (RESOLVE_EXTENSIONS.includes(ext))
    return (/\.js(x)?$/.test(ext) ? ext.replace(/^\.js/, ".ts") : ext).slice(1);
  if (ext === ".mjs" || ext === ".cjs")
    return "ts";
  if (ext === ".mts" || ext === ".cts")
    return "ts";
  if (ext == ".scss")
    return "css";
  if (ext == ".png" || ext == ".jpeg" || ext == ".ttf")
    return "dataurl";
  if (ext == ".svg" || ext == ".html" || ext == ".txt")
    return "text";
  if (ext == ".wasm")
    return "file";
  return ext.length ? "text" : "ts";
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
const parseTreeshakeExports = (str) => (str != null ? str : "").split(/\],/).map((str2) => str2.replace(/\[|\]/g, ""));
const parseShareQuery = (shareURL) => {
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
var RE_SCOPED = /^(@[^\/]+\/[^@\/]+)(?:@([^\/]+))?(\/.*)?$/;
var RE_NON_SCOPED = /^([^@\/]+)(?:@([^\/]+))?(\/.*)?$/;
function parse(input) {
  const m = RE_SCOPED.exec(input) || RE_NON_SCOPED.exec(input);
  if (!m) {
    throw new Error(`[parse-package-name] invalid package name: ${input}`);
  }
  return {
    name: m[1] || "",
    version: m[2] || "latest",
    path: m[3] || ""
  };
}
const getRegistryURL = (input) => {
  const host = "https://registry.npmjs.com";
  let { name, version, path: path2 } = parse(input);
  let searchURL = `${host}/-/v1/search?text=${encodeURIComponent(name)}&popularity=0.5&size=30`;
  let packageURL = `${host}/${name}/${version}`;
  return { searchURL, packageURL, version, name, path: path2 };
};
const getPackages = async (input) => {
  let { searchURL } = getRegistryURL(input);
  let result;
  try {
    let response = await getRequest(searchURL, false);
    result = await response.json();
  } catch (e) {
    console.warn(e);
    throw e;
  }
  let packages = result == null ? void 0 : result.objects;
  return { packages, info: result };
};
const getPackage = async (input) => {
  let { packageURL } = getRegistryURL(input);
  let result;
  try {
    let response = await getRequest(packageURL, false);
    result = await response.json();
  } catch (e) {
    console.warn(e);
    throw e;
  }
  return result;
};
export { AnsiBuffer, CACHE, CACHE_NAME, ESCAPE_TO_COLOR, FileSystem, RESOLVE_EXTENSIONS, debounce, decode, deepAssign, deepDiff, deepEqual, encode, getFile, getPackage, getPackages, getRegistryURL, getRequest, getResolvedPath, htmlEscape, inferLoader, isObject, isPrimitive, isValidKey, newRequest, parseConfig, parseShareQuery, parseTreeshakeExports, render, setFile };
//# sourceMappingURL=index.mjs.map
