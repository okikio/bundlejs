import { a as browser } from "./esbuild.mjs";
var bytes$2 = { exports: {} };
/*!
 * bytes
 * Copyright(c) 2012-2014 TJ Holowaychuk
 * Copyright(c) 2015 Jed Watson
 * MIT Licensed
 */
bytes$2.exports = bytes$1;
bytes$2.exports.format = format$2;
bytes$2.exports.parse = parse$3;
var formatThousandsRegExp = /\B(?=(\d{3})+(?!\d))/g;
var formatDecimalsRegExp = /(?:\.0*|(\.[^0]+)0+)$/;
var map = {
  b: 1,
  kb: 1 << 10,
  mb: 1 << 20,
  gb: 1 << 30,
  tb: Math.pow(1024, 4),
  pb: Math.pow(1024, 5)
};
var parseRegExp = /^((-|\+)?(\d+(?:\.\d+)?)) *(kb|mb|gb|tb|pb)$/i;
function bytes$1(value, options) {
  if (typeof value === "string") {
    return parse$3(value);
  }
  if (typeof value === "number") {
    return format$2(value, options);
  }
  return null;
}
function format$2(value, options) {
  if (!Number.isFinite(value)) {
    return null;
  }
  var mag = Math.abs(value);
  var thousandsSeparator = options && options.thousandsSeparator || "";
  var unitSeparator = options && options.unitSeparator || "";
  var decimalPlaces = options && options.decimalPlaces !== void 0 ? options.decimalPlaces : 2;
  var fixedDecimals = Boolean(options && options.fixedDecimals);
  var unit = options && options.unit || "";
  if (!unit || !map[unit.toLowerCase()]) {
    if (mag >= map.pb) {
      unit = "PB";
    } else if (mag >= map.tb) {
      unit = "TB";
    } else if (mag >= map.gb) {
      unit = "GB";
    } else if (mag >= map.mb) {
      unit = "MB";
    } else if (mag >= map.kb) {
      unit = "KB";
    } else {
      unit = "B";
    }
  }
  var val = value / map[unit.toLowerCase()];
  var str = val.toFixed(decimalPlaces);
  if (!fixedDecimals) {
    str = str.replace(formatDecimalsRegExp, "$1");
  }
  if (thousandsSeparator) {
    str = str.split(".").map(function(s, i) {
      return i === 0 ? s.replace(formatThousandsRegExp, thousandsSeparator) : s;
    }).join(".");
  }
  return str + unitSeparator + unit;
}
function parse$3(val) {
  if (typeof val === "number" && !isNaN(val)) {
    return val;
  }
  if (typeof val !== "string") {
    return null;
  }
  var results = parseRegExp.exec(val);
  var floatValue;
  var unit = "b";
  if (!results) {
    floatValue = parseInt(val, 10);
    unit = "b";
  } else {
    floatValue = parseFloat(results[1]);
    unit = results[4].toLowerCase();
  }
  if (isNaN(floatValue)) {
    return null;
  }
  return Math.floor(map[unit] * floatValue);
}
var bytes_1 = bytes$2.exports;
const encode$1 = (str) => new TextEncoder().encode(str);
const decode$1 = (buf) => new TextDecoder().decode(buf);
const DEFAULT_CDN_HOST = "https://unpkg.com";
const getCDNStyle = (urlStr) => {
  if (/^(skypack|esm|esm\.sh|unpkg|jsdelivr|esm\.run)\:?/.test(urlStr) || /^https?:\/\/(cdn\.skypack\.dev|cdn\.esm\.sh|cdn\.jsdelivr\.net\/npm|unpkg\.com)/.test(urlStr))
    return "npm";
  else if (/^(jsdelivr\.gh|github)\:?/.test(urlStr) || /^https?:\/\/(cdn\.jsdelivr\.net\/gh|raw\.githubusercontent\.com)/.test(urlStr))
    return "github";
  else if (/^(deno)\:?/.test(urlStr) || /^https?:\/\/(deno\.land\/x)/.test(urlStr))
    return "deno";
  return "other";
};
const getCDNOrigin = (importStr, cdn = DEFAULT_CDN_HOST) => {
  if (/^skypack\:/.test(importStr))
    cdn = `https://cdn.skypack.dev`;
  else if (/^(esm\.sh|esm)\:/.test(importStr))
    cdn = `https://cdn.esm.sh`;
  else if (/^unpkg\:/.test(importStr))
    cdn = `https://unpkg.com`;
  else if (/^(jsdelivr|esm\.run)\:/.test(importStr))
    cdn = `https://cdn.jsdelivr.net/npm`;
  else if (/^(jsdelivr\.gh)\:/.test(importStr))
    cdn = `https://cdn.jsdelivr.net/gh`;
  else if (/^(deno)\:/.test(importStr))
    cdn = `https://deno.land/x`;
  else if (/^(github)\:/.test(importStr))
    cdn = `https://raw.githubusercontent.com`;
  return /\/$/.test(cdn) ? cdn : `${cdn}/`;
};
const getPureImportPath = (importStr) => importStr.replace(/^(skypack|esm|esm\.sh|unpkg|jsdelivr|jsdelivr\.gh|esm\.run|deno|github)\:/, "").replace(/^https?:\/\/(cdn\.skypack\.dev|cdn\.esm\.sh|cdn\.jsdelivr\.net\/npm|unpkg\.com|cdn\.jsdelivr\.net\/gh|raw\.githubusercontent\.com|deno\.land\/x)/, "").replace(/^\//, "");
const getCDNUrl = (importStr, cdn = DEFAULT_CDN_HOST) => {
  let origin = getCDNOrigin(importStr, cdn);
  let path2 = getPureImportPath(importStr);
  let url = new URL(path2, origin);
  return { import: importStr, path: path2, origin, cdn, url };
};
const EXTERNALS_NAMESPACE = "external-globals";
const EMPTY_EXPORT = encode$1(`export default {}`);
const PolyfillMap = {
  "console": "console-browserify",
  "constants": "constants-browserify",
  "crypto": "crypto-browserify",
  "http": "http-browserify",
  "buffer": "buffer",
  "Dirent": "dirent",
  "vm": "vm-browserify",
  "zlib": "zlib-browserify",
  "assert": "assert",
  "child_process": "child_process",
  "cluster": "child_process",
  "dgram": "dgram",
  "dns": "dns",
  "domain": "domain-browser",
  "events": "events",
  "https": "https",
  "module": "module",
  "net": "net",
  "path": "path-browserify",
  "punycode": "punycode",
  "querystring": "querystring",
  "readline": "readline",
  "repl": "repl",
  "stream": "stream",
  "string_decoder": "string_decoder",
  "sys": "sys",
  "timers": "timers",
  "tls": "tls",
  "tty": "tty-browserify",
  "url": "url",
  "util": "util",
  "_shims": "_shims",
  "_stream_duplex": "_stream_duplex",
  "_stream_readable": "_stream_readable",
  "_stream_writable": "_stream_writable",
  "_stream_transform": "_stream_transform",
  "_stream_passthrough": "_stream_passthrough",
  process: "process/browser",
  fs: "memfs",
  os: "os-browserify/browser",
  "v8": "v8",
  "node-inspect": "node-inspect",
  "_linklist": "_linklist",
  "_stream_wrap": "_stream_wrap"
};
const PolyfillKeys = Object.keys(PolyfillMap);
const DeprecatedAPIs = ["v8/tools/codemap", "v8/tools/consarray", "v8/tools/csvparser", "v8/tools/logreader", "v8/tools/profile_view", "v8/tools/profile", "v8/tools/SourceMap", "v8/tools/splaytree", "v8/tools/tickprocessor-driver", "v8/tools/tickprocessor", "node-inspect/lib/_inspect", "node-inspect/lib/internal/inspect_client ", "node-inspect/lib/internal/inspect_repl", "_linklist", "_stream_wrap"];
const ExternalPackages = ["chokidar", "yargs", "fsevents", `worker_threads`, "async_hooks", "diagnostics_channel", "http2", "inspector", "perf_hooks", "trace_events", "wasi", ...DeprecatedAPIs, ...PolyfillKeys];
const isExternal = (id, external = []) => {
  return [...ExternalPackages, ...external].find((it) => {
    if (it === id)
      return true;
    if (id.startsWith(`${it}/`))
      return true;
    return false;
  });
};
const EXTERNAL = (events, state, config) => {
  const { external = [] } = config?.esbuild ?? {};
  return {
    name: EXTERNALS_NAMESPACE,
    setup(build2) {
      build2.onResolve({ filter: /.*/ }, (args) => {
        let path2 = args.path.replace(/^node\:/, "");
        let { path: argPath } = getCDNUrl(path2);
        if (isExternal(argPath, external)) {
          return {
            path: argPath,
            namespace: EXTERNALS_NAMESPACE,
            external: true
          };
        }
      });
      build2.onLoad({ filter: /.*/, namespace: EXTERNALS_NAMESPACE }, (args) => {
        return {
          pluginName: EXTERNALS_NAMESPACE,
          contents: EMPTY_EXPORT,
          warnings: [{
            text: `${args.path} is marked as an external module and will be ignored.`,
            details: `"${args.path}" is a built-in node module thus can't be bundled by https://bundlejs.com, sorry about that.`
          }]
        };
      });
    }
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
const CHAR_DOT = 46;
const CHAR_FORWARD_SLASH = 47;
const SEP = "/";
const SEP_PATTERN = /\/+/;
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
  return string.replaceAll(/[\s]/g, (c2) => {
    return WHITESPACE_ENCODINGS[c2] ?? c2;
  });
}
const sep$1 = "/";
const delimiter$1 = ":";
function resolve$2(...pathSegments) {
  let resolvedPath = "";
  let resolvedAbsolute = false;
  for (let i = pathSegments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    let path2;
    if (i >= 0)
      path2 = pathSegments[i];
    else {
      const { Deno } = globalThis;
      if (typeof Deno?.cwd !== "function") {
        throw new TypeError("Resolved a relative path without a CWD.");
      }
      path2 = Deno?.cwd?.() ?? "/";
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
function normalize$2(path2) {
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
function join$2(...paths) {
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
  return normalize$2(joined);
}
function relative$1(from, to) {
  assertPath(from);
  assertPath(to);
  if (from === to)
    return "";
  from = resolve$2(from);
  to = resolve$2(to);
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
  resolve: resolve$2,
  normalize: normalize$2,
  isAbsolute: isAbsolute$1,
  join: join$2,
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
const path$1 = _posix;
const { join: join$1, normalize: normalize$1 } = path$1;
const regExpEscapeChars = [
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
];
const rangeEscapeChars = ["-", "\\", "]"];
function globToRegExp(glob, {
  extended = true,
  globstar: globstarOption = true,
  os = "linux",
  caseInsensitive = false
} = {}) {
  if (glob == "") {
    return /(?!)/;
  }
  const sep2 = os == "windows" ? "(?:\\\\|/)+" : "/+";
  const sepMaybe = os == "windows" ? "(?:\\\\|/)*" : "/*";
  const seps = os == "windows" ? ["\\", "/"] : ["/"];
  const globstar = os == "windows" ? "(?:[^\\\\/]*(?:\\\\|/|$)+)*" : "(?:[^/]*(?:/|$)+)*";
  const wildcard = os == "windows" ? "[^\\\\/]*" : "[^/]*";
  const escapePrefix = os == "windows" ? "`" : "\\";
  let newLength = glob.length;
  for (; newLength > 1 && seps.includes(glob[newLength - 1]); newLength--)
    ;
  glob = glob.slice(0, newLength);
  let regExpString = "";
  for (let j2 = 0; j2 < glob.length; ) {
    let segment = "";
    const groupStack = [];
    let inRange = false;
    let inEscape = false;
    let endsWithSep = false;
    let i = j2;
    for (; i < glob.length && !seps.includes(glob[i]); i++) {
      if (inEscape) {
        inEscape = false;
        const escapeChars = inRange ? rangeEscapeChars : regExpEscapeChars;
        segment += escapeChars.includes(glob[i]) ? `\\${glob[i]}` : glob[i];
        continue;
      }
      if (glob[i] == escapePrefix) {
        inEscape = true;
        continue;
      }
      if (glob[i] == "[") {
        if (!inRange) {
          inRange = true;
          segment += "[";
          if (glob[i + 1] == "!") {
            i++;
            segment += "^";
          } else if (glob[i + 1] == "^") {
            i++;
            segment += "\\^";
          }
          continue;
        } else if (glob[i + 1] == ":") {
          let k2 = i + 1;
          let value = "";
          while (glob[k2 + 1] != null && glob[k2 + 1] != ":") {
            value += glob[k2 + 1];
            k2++;
          }
          if (glob[k2 + 1] == ":" && glob[k2 + 2] == "]") {
            i = k2 + 2;
            if (value == "alnum")
              segment += "\\dA-Za-z";
            else if (value == "alpha")
              segment += "A-Za-z";
            else if (value == "ascii")
              segment += "\0-\x7F";
            else if (value == "blank")
              segment += "	 ";
            else if (value == "cntrl")
              segment += "\0-\x7F";
            else if (value == "digit")
              segment += "\\d";
            else if (value == "graph")
              segment += "!-~";
            else if (value == "lower")
              segment += "a-z";
            else if (value == "print")
              segment += " -~";
            else if (value == "punct") {
              segment += `!"#$%&'()*+,\\-./:;<=>?@[\\\\\\]^_\u2018{|}~`;
            } else if (value == "space")
              segment += "\\s\v";
            else if (value == "upper")
              segment += "A-Z";
            else if (value == "word")
              segment += "\\w";
            else if (value == "xdigit")
              segment += "\\dA-Fa-f";
            continue;
          }
        }
      }
      if (glob[i] == "]" && inRange) {
        inRange = false;
        segment += "]";
        continue;
      }
      if (inRange) {
        if (glob[i] == "\\") {
          segment += `\\\\`;
        } else {
          segment += glob[i];
        }
        continue;
      }
      if (glob[i] == ")" && groupStack.length > 0 && groupStack[groupStack.length - 1] != "BRACE") {
        segment += ")";
        const type = groupStack.pop();
        if (type == "!") {
          segment += wildcard;
        } else if (type != "@") {
          segment += type;
        }
        continue;
      }
      if (glob[i] == "|" && groupStack.length > 0 && groupStack[groupStack.length - 1] != "BRACE") {
        segment += "|";
        continue;
      }
      if (glob[i] == "+" && extended && glob[i + 1] == "(") {
        i++;
        groupStack.push("+");
        segment += "(?:";
        continue;
      }
      if (glob[i] == "@" && extended && glob[i + 1] == "(") {
        i++;
        groupStack.push("@");
        segment += "(?:";
        continue;
      }
      if (glob[i] == "?") {
        if (extended && glob[i + 1] == "(") {
          i++;
          groupStack.push("?");
          segment += "(?:";
        } else {
          segment += ".";
        }
        continue;
      }
      if (glob[i] == "!" && extended && glob[i + 1] == "(") {
        i++;
        groupStack.push("!");
        segment += "(?!";
        continue;
      }
      if (glob[i] == "{") {
        groupStack.push("BRACE");
        segment += "(?:";
        continue;
      }
      if (glob[i] == "}" && groupStack[groupStack.length - 1] == "BRACE") {
        groupStack.pop();
        segment += ")";
        continue;
      }
      if (glob[i] == "," && groupStack[groupStack.length - 1] == "BRACE") {
        segment += "|";
        continue;
      }
      if (glob[i] == "*") {
        if (extended && glob[i + 1] == "(") {
          i++;
          groupStack.push("*");
          segment += "(?:";
        } else {
          const prevChar = glob[i - 1];
          let numStars = 1;
          while (glob[i + 1] == "*") {
            i++;
            numStars++;
          }
          const nextChar = glob[i + 1];
          if (globstarOption && numStars == 2 && [...seps, void 0].includes(prevChar) && [...seps, void 0].includes(nextChar)) {
            segment += globstar;
            endsWithSep = true;
          } else {
            segment += wildcard;
          }
        }
        continue;
      }
      segment += regExpEscapeChars.includes(glob[i]) ? `\\${glob[i]}` : glob[i];
    }
    if (groupStack.length > 0 || inRange || inEscape) {
      segment = "";
      for (const c2 of glob.slice(j2, i)) {
        segment += regExpEscapeChars.includes(c2) ? `\\${c2}` : c2;
        endsWithSep = false;
      }
    }
    regExpString += segment;
    if (!endsWithSep) {
      regExpString += i < glob.length ? sep2 : sepMaybe;
      endsWithSep = true;
    }
    while (seps.includes(glob[i]))
      i++;
    if (!(i > j2)) {
      throw new Error("Assertion failure: i > j (potential infinite loop)");
    }
    j2 = i;
  }
  regExpString = `^${regExpString}$`;
  return new RegExp(regExpString, caseInsensitive ? "i" : "");
}
function isGlob(str) {
  const chars = { "{": "}", "(": ")", "[": "]" };
  const regex = /\\(.)|(^!|\*|\?|[\].+)]\?|\[[^\\\]]+\]|\{[^\\}]+\}|\(\?[:!=][^\\)]+\)|\([^|]+\|[^\\)]+\))/;
  if (str === "") {
    return false;
  }
  let match;
  while (match = regex.exec(str)) {
    if (match[2])
      return true;
    let idx = match.index + match[0].length;
    const open = match[1];
    const close = open ? chars[open] : null;
    if (open && close) {
      const n = str.indexOf(close, idx);
      if (n !== -1) {
        idx = n + 1;
      }
    }
    str = str.slice(idx);
  }
  return false;
}
function normalizeGlob(glob, { globstar = false } = {}) {
  if (glob.match(/\0/g)) {
    throw new Error(`Glob contains invalid characters: "${glob}"`);
  }
  if (!globstar) {
    return normalize$1(glob);
  }
  const s = SEP_PATTERN.source;
  const badParentPattern = new RegExp(`(?<=(${s}|^)\\*\\*${s})\\.\\.(?=${s}|$)`, "g");
  return normalize$1(glob.replace(badParentPattern, "\0")).replace(/\0/g, "..");
}
function joinGlobs(globs, { extended = true, globstar = false } = {}) {
  if (!globstar || globs.length == 0) {
    return join$1(...globs);
  }
  if (globs.length === 0)
    return ".";
  let joined;
  for (const glob of globs) {
    const path2 = glob;
    if (path2.length > 0) {
      if (!joined)
        joined = path2;
      else
        joined += `${SEP}${path2}`;
    }
  }
  if (!joined)
    return ".";
  return normalizeGlob(joined, { extended, globstar });
}
const path = _posix;
const posix = _posix;
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
  resolve: resolve$1,
  sep,
  toFileUrl,
  toNamespacedPath
} = path;
var mod$4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  posix,
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
  resolve: resolve$1,
  sep,
  toFileUrl,
  toNamespacedPath,
  SEP,
  SEP_PATTERN,
  globToRegExp,
  isGlob,
  normalizeGlob,
  joinGlobs
}, Symbol.toStringTag, { value: "Module" }));
const urlJoin = (urlStr, ...args) => {
  const url = new URL(urlStr);
  url.pathname = encodeWhitespace(join(url.pathname, ...args).replace(/%/g, "%25").replace(/\\/g, "%5C"));
  return url.toString();
};
const isBareImport = (importStr) => {
  return /^(?!\.).*/.test(importStr) && !isAbsolute(importStr);
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
function loop$1(exports, keys) {
  if (typeof exports === "string") {
    return exports;
  }
  if (exports) {
    let idx, tmp;
    if (Array.isArray(exports)) {
      for (idx = 0; idx < exports.length; idx++) {
        if (tmp = loop$1(exports[idx], keys))
          return tmp;
      }
    } else {
      for (idx in exports) {
        if (keys.has(idx)) {
          return loop$1(exports[idx], keys);
        }
      }
    }
  }
}
function bail$1(name, entry, condition) {
  throw new Error(condition ? `No known conditions for "${entry}" entry in "${name}" package` : `Missing "${entry}" export in "${name}" package`);
}
function toName$1(name, entry) {
  return entry === name ? "." : entry[0] === "." ? entry : entry.replace(new RegExp("^" + name + "/"), "./");
}
function resolve(pkg, entry = ".", options = {}) {
  let { name, exports } = pkg;
  if (exports) {
    let { browser: browser2, require, unsafe, conditions = [] } = options;
    let target = toName$1(name, entry);
    if (target[0] !== ".")
      target = "./" + target;
    if (typeof exports === "string") {
      return target === "." ? exports : bail$1(name, target);
    }
    let allows = /* @__PURE__ */ new Set(["default", ...conditions]);
    unsafe || allows.add(require ? "require" : "import");
    unsafe || allows.add(browser2 ? "browser" : "node");
    let key, tmp, isSingle = false;
    for (key in exports) {
      isSingle = key[0] !== ".";
      break;
    }
    if (isSingle) {
      return target === "." ? loop$1(exports, allows) || bail$1(name, target, 1) : bail$1(name, target);
    }
    if (tmp = exports[target]) {
      return loop$1(tmp, allows) || bail$1(name, target, 1);
    }
    for (key in exports) {
      tmp = key[key.length - 1];
      if (tmp === "/" && target.startsWith(key)) {
        return (tmp = loop$1(exports[key], allows)) ? tmp + target.substring(key.length) : bail$1(name, target, 1);
      }
      if (tmp === "*" && target.startsWith(key.slice(0, -1))) {
        if (target.substring(key.length - 1).length > 0) {
          return (tmp = loop$1(exports[key], allows)) ? tmp.replace("*", target.substring(key.length - 1)) : bail$1(name, target, 1);
        }
      }
    }
    return bail$1(name, target);
  }
}
function legacy(pkg, options = {}) {
  let i = 0, value, browser2 = options.browser, fields = options.fields || ["module", "main"];
  if (browser2 && !fields.includes("browser")) {
    fields.unshift("browser");
  }
  for (; i < fields.length; i++) {
    if (value = pkg[fields[i]]) {
      if (typeof value == "string")
        ;
      else if (typeof value == "object" && fields[i] == "browser") {
        if (typeof browser2 == "string") {
          value = value[browser2 = toName$1(pkg.name, browser2)];
          if (value == null)
            return browser2;
        }
      } else {
        continue;
      }
      return typeof value == "string" ? "./" + value.replace(/^\.?\//, "") : value;
    }
  }
}
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
function loop(imports, keys) {
  if (typeof imports === "string") {
    return imports;
  }
  if (imports) {
    let idx, tmp;
    if (Array.isArray(imports)) {
      for (idx = 0; idx < imports.length; idx++) {
        if (tmp = loop(imports[idx], keys))
          return tmp;
      }
    } else {
      for (idx in imports) {
        if (keys.has(idx)) {
          return loop(imports[idx], keys);
        }
      }
    }
  }
}
function bail(name, entry, condition) {
  throw new Error(condition ? `No known conditions for "${entry}" entry in "${name}" package` : `Missing "${entry}" import in "${name}" package`);
}
function toName(name, entry) {
  return entry === name ? "." : entry[0] === "." ? entry : entry.replace(new RegExp("^" + name + "/"), "./");
}
function resolveImports(pkg, entry = ".", options = {}) {
  let { name, imports } = pkg;
  if (imports) {
    let { browser: browser2, require, unsafe, conditions = [] } = options;
    let target = toName(name, entry);
    if (typeof imports === "string") {
      return target === "#" ? imports : bail(name, target);
    }
    let allows = /* @__PURE__ */ new Set(["default", ...conditions]);
    unsafe || allows.add(require ? "require" : "import");
    unsafe || allows.add(browser2 ? "browser" : "node");
    let key, tmp, isSingle = false;
    for (key in imports) {
      isSingle = key[0] !== "#";
      break;
    }
    if (isSingle) {
      return target === "#" ? loop(imports, allows) || bail(name, target, 1) : bail(name, target);
    }
    if (tmp = imports[target]) {
      return loop(tmp, allows) || bail(name, target, 1);
    }
    for (key in imports) {
      tmp = key[key.length - 1];
      if (tmp === "/" && target.startsWith(key)) {
        return (tmp = loop(imports[key], allows)) ? tmp + target.substring(key.length) : bail(name, target, 1);
      }
      if (tmp === "*" && target.startsWith(key.slice(0, -1))) {
        if (target.substring(key.length - 1).length > 0) {
          return (tmp = loop(imports[key], allows)) ? tmp.replace("*", target.substring(key.length - 1)) : bail(name, target, 1);
        }
      }
    }
    return bail(name, target);
  }
}
const CDN_NAMESPACE = "cdn-url";
const CDN_RESOLVE = (cdn = DEFAULT_CDN_HOST, events) => {
  return async (args) => {
    if (isBareImport(args.path)) {
      let { path: argPath, origin } = getCDNUrl(args.path, cdn);
      let NPM_CDN = getCDNStyle(origin) == "npm";
      let parsed = parse(argPath);
      let subpath = parsed.path;
      let pkg = args.pluginData?.pkg ?? {};
      if (argPath[0] == "#") {
        let path2 = resolveImports({ ...pkg, exports: pkg.imports }, argPath, {
          require: args.kind === "require-call" || args.kind === "require-resolve"
        });
        if (typeof path2 === "string") {
          subpath = path2.replace(/^\.?\/?/, "/");
          if (subpath && subpath[0] !== "/")
            subpath = `/${subpath}`;
          let version2 = NPM_CDN ? "@" + pkg.version : "";
          let { url: { href } } = getCDNUrl(`${pkg.name}${version2}${subpath}`);
          return {
            namespace: HTTP_NAMESPACE,
            path: href,
            pluginData: { pkg }
          };
        }
      }
      let depsExists = "dependencies" in pkg || "devDependencies" in pkg || "peerDependencies" in pkg;
      if (depsExists && !/\S+@\S+/.test(argPath)) {
        let {
          devDependencies = {},
          dependencies = {},
          peerDependencies = {}
        } = pkg;
        let deps = Object.assign({}, devDependencies, peerDependencies, dependencies);
        let keys = Object.keys(deps);
        if (keys.includes(argPath))
          parsed.version = deps[argPath];
      }
      if (NPM_CDN) {
        try {
          let { url: PACKAGE_JSON_URL } = getCDNUrl(`${parsed.name}@${parsed.version}/package.json`, origin);
          pkg = await getRequest(PACKAGE_JSON_URL, true).then((res) => res.json());
          let path2 = resolve(pkg, subpath ? "." + subpath.replace(/^\.?\/?/, "/") : ".", {
            require: args.kind === "require-call" || args.kind === "require-resolve"
          }) || legacy(pkg);
          if (typeof path2 === "string")
            subpath = path2.replace(/^\.?\/?/, "/").replace(/\.js\.js$/, ".js");
          if (subpath && subpath[0] !== "/")
            subpath = `/${subpath}`;
        } catch (e) {
          events.emit("logger.warn", `You may want to change CDNs. The current CDN ${!/unpkg\.com/.test(origin) ? `"${origin}" doesn't` : `path "${origin}${argPath}" may not`} support package.json files.
There is a chance the CDN you're using doesn't support looking through the package.json of packages. bundlejs will switch to inaccurate guesses for package versions. For package.json support you may wish to use https://unpkg.com or other CDN's that support package.json.`).emit("logger.warn", e);
        }
      }
      let version = NPM_CDN ? "@" + parsed.version : "";
      let { url } = getCDNUrl(`${parsed.name}${version}${subpath}`, origin);
      return {
        namespace: HTTP_NAMESPACE,
        path: url.toString(),
        pluginData: { pkg }
      };
    }
  };
};
const CDN = (events, state, config) => {
  let { origin: cdn } = !/:/.test(config?.cdn) ? getCDNUrl(config?.cdn + ":") : getCDNUrl(config?.cdn);
  config.filesystem;
  return {
    name: CDN_NAMESPACE,
    setup(build2) {
      build2.onResolve({ filter: /.*/ }, CDN_RESOLVE(cdn, events));
      build2.onResolve({ filter: /.*/, namespace: CDN_NAMESPACE }, CDN_RESOLVE(cdn, events));
    }
  };
};
const HTTP_NAMESPACE = "http-url";
const fetchPkg = async (url, events) => {
  try {
    let response = await getRequest(url);
    if (!response.ok)
      throw new Error(`Couldn't load ${response.url} (${response.status} code)`);
    events.emit("logger.info", `Fetch ${url}`);
    return {
      url: response.url,
      content: new Uint8Array(await response.arrayBuffer())
    };
  } catch (err) {
    throw new Error(`[getRequest] Failed at request (${url})
${err.toString()}`);
  }
};
const fetchAssets = async (path2, content, namespace, events, config) => {
  const rgx = /new URL\(['"`](.*)['"`],(?:\s+)?import\.meta\.url(?:\s+)?\)/g;
  const parentURL = new URL("./", path2).toString();
  const FileSystem2 = config.filesystem;
  const code = decode$1(content);
  const matches = Array.from(code.matchAll(rgx));
  const promises = matches.map(async ([, assetURL]) => {
    let { content: asset, url } = await fetchPkg(urlJoin(parentURL, assetURL), events);
    FileSystem2.set(namespace + ":" + url, content);
    return {
      path: assetURL,
      contents: asset,
      get text() {
        return decode$1(asset);
      }
    };
  });
  return await Promise.allSettled(promises);
};
const HTTP_RESOLVE = (host = DEFAULT_CDN_HOST, events) => {
  return async (args) => {
    let argPath = args.path.replace(/\/$/, "/index");
    if (!argPath.startsWith(".")) {
      if (/^https?:\/\//.test(argPath)) {
        return {
          path: argPath,
          namespace: HTTP_NAMESPACE,
          pluginData: { pkg: args.pluginData?.pkg }
        };
      }
      let pathOrigin = new URL(urlJoin(args.pluginData?.url ? args.pluginData?.url : host, "../", argPath)).origin;
      let NPM_CDN = getCDNStyle(pathOrigin) == "npm";
      let origin = NPM_CDN ? pathOrigin : host;
      if (isBareImport(argPath)) {
        return CDN_RESOLVE(origin, events)(args);
      } else {
        return {
          path: getCDNUrl(argPath, origin).url.toString(),
          namespace: HTTP_NAMESPACE,
          pluginData: { pkg: args.pluginData?.pkg }
        };
      }
    }
    let path2 = urlJoin(args.pluginData?.url, "../", argPath);
    return {
      path: path2,
      namespace: HTTP_NAMESPACE,
      pluginData: { pkg: args.pluginData?.pkg }
    };
  };
};
const HTTP = (events, state, config) => {
  let { origin: host } = !/:/.test(config?.cdn) ? getCDNUrl(config?.cdn + ":") : getCDNUrl(config?.cdn);
  const FileSystem2 = config.filesystem;
  const assets = state.assets ?? [];
  return {
    name: HTTP_NAMESPACE,
    setup(build2) {
      build2.onResolve({ filter: /^https?:\/\// }, (args) => {
        return {
          path: args.path,
          namespace: HTTP_NAMESPACE
        };
      });
      build2.onResolve({ filter: /.*/, namespace: HTTP_NAMESPACE }, HTTP_RESOLVE(host, events));
      build2.onLoad({ filter: /.*/, namespace: HTTP_NAMESPACE }, async (args) => {
        let ext = extname(args.path);
        let argPath = (suffix = "") => ext.length > 0 ? args.path : args.path + suffix;
        let content, url;
        try {
          ({ content, url } = await fetchPkg(argPath(), events));
        } catch (err) {
          try {
            ({ content, url } = await fetchPkg(argPath(".ts"), events));
          } catch (e) {
            try {
              ({ content, url } = await fetchPkg(argPath(".tsx"), events));
            } catch (e2) {
              events.emit("logger.error", e2.toString());
              throw err;
            }
          }
        }
        await FileSystem2.set(args.namespace + ":" + args.path, content);
        let _assetResults = (await fetchAssets(url, content, args.namespace, events, config)).filter((result) => {
          if (result.status == "rejected") {
            events.emit("logger:warn", "Asset fetch failed.\n" + result?.reason?.toString());
            return false;
          } else
            return true;
        }).map((result) => {
          if (result.status == "fulfilled")
            return result.value;
        });
        state.assets = assets.concat(_assetResults);
        return {
          contents: content,
          loader: inferLoader(url),
          pluginData: { url, pkg: args.pluginData?.pkg }
        };
      });
    }
  };
};
const ALIAS_NAMESPACE = "alias-globals";
const isAlias = (id, aliases = {}) => {
  if (!isBareImport(id))
    return false;
  let aliasKeys = Object.keys(aliases);
  let path2 = id.replace(/^node\:/, "");
  let pkgDetails = parse(path2);
  return aliasKeys.find((it) => {
    return pkgDetails.name === it;
  });
};
const ALIAS_RESOLVE = (aliases = {}, host = DEFAULT_CDN_HOST, events) => {
  return async (args) => {
    let path2 = args.path.replace(/^node\:/, "");
    let { path: argPath } = getCDNUrl(path2);
    if (isAlias(argPath, aliases)) {
      let pkgDetails = parse(argPath);
      let aliasPath = aliases[pkgDetails.name];
      return HTTP_RESOLVE(host, events)({
        ...args,
        path: aliasPath
      });
    }
  };
};
const ALIAS = (events, state, config) => {
  let { origin: host } = !/:/.test(config?.cdn) ? getCDNUrl(config?.cdn + ":") : getCDNUrl(config?.cdn);
  let aliases = config.alias ?? {};
  return {
    name: ALIAS_NAMESPACE,
    setup(build2) {
      build2.onResolve({ filter: /^node\:.*/ }, (args) => {
        if (isAlias(args.path, aliases))
          return ALIAS_RESOLVE(aliases, host, events)(args);
        return {
          path: args.path,
          namespace: EXTERNALS_NAMESPACE,
          external: true
        };
      });
      build2.onResolve({ filter: /.*/ }, ALIAS_RESOLVE(aliases, host, events));
      build2.onResolve({ filter: /.*/, namespace: ALIAS_NAMESPACE }, ALIAS_RESOLVE(aliases, host, events));
    }
  };
};
const VIRTUAL_FILESYSTEM_NAMESPACE = "virtual-filesystem";
const VIRTUAL_FS = (events, state, config) => {
  const FileSystem2 = config.filesystem;
  return {
    name: VIRTUAL_FILESYSTEM_NAMESPACE,
    setup(build2) {
      build2.onResolve({ filter: /.*/ }, (args) => {
        return {
          path: args.path,
          pluginData: args.pluginData ?? {},
          namespace: VIRTUAL_FILESYSTEM_NAMESPACE
        };
      });
      build2.onLoad({ filter: /.*/, namespace: VIRTUAL_FILESYSTEM_NAMESPACE }, async (args) => {
        let resolvedPath = await FileSystem2.resolve(args.path, args?.pluginData?.importer);
        let content = await FileSystem2.get(args.path, "buffer", args?.pluginData?.importer);
        return {
          contents: content,
          pluginData: {
            importer: resolvedPath
          },
          loader: inferLoader(resolvedPath)
        };
      });
    }
  };
};
const PLATFORM_AUTO = "Deno" in globalThis ? "deno" : "process" in globalThis ? "node" : "browser";
const FileSystem = /* @__PURE__ */ new Map();
const getResolvedPath = async (path2, importer) => {
  let resolvedPath = path2;
  if (importer && path2.startsWith("."))
    resolvedPath = resolve$1(dirname(importer), path2);
  if (FileSystem.has(resolvedPath))
    return resolvedPath;
  throw `File "${resolvedPath}" does not exist`;
};
const getFile = async (path2, type = "buffer", importer) => {
  let resolvedPath = await getResolvedPath(path2, importer);
  if (FileSystem.has(resolvedPath)) {
    let file = FileSystem.get(resolvedPath);
    return type == "string" ? decode$1(file) : file;
  }
};
const setFile = async (path2, content, importer) => {
  let resolvedPath = path2;
  if (importer && path2.startsWith("."))
    resolvedPath = resolve$1(dirname(importer), path2);
  try {
    FileSystem.set(resolvedPath, content instanceof Uint8Array ? content : encode$1(content));
  } catch (e) {
    throw `Error occurred while writing to "${resolvedPath}"`;
  }
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
const EasyDefaultConfig = {
  entryPoints: ["/index.tsx"],
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
const DefaultConfig = deepAssign({}, EasyDefaultConfig, {
  "esbuild": {
    "color": true,
    "globalName": "BundledCode",
    "logLevel": "info",
    "sourcemap": false,
    "incremental": false
  },
  "ascii": "ascii",
  filesystem: {
    files: FileSystem,
    get: getFile,
    set: setFile,
    resolve: getResolvedPath,
    clear: () => FileSystem.clear()
  },
  init: {
    platform: PLATFORM_AUTO
  }
});
var o = class {
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
    let n = this.size;
    return this.set(n, e), this;
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
}, b$1 = (p, e, ...t) => {
  p.forEach((n) => {
    n[e](...t);
  });
};
var h = ({ callback: p = () => {
}, scope: e = null, name: t = "event" }) => ({ callback: p, scope: e, name: t }), c = class extends o {
  constructor(e = "event") {
    super();
    this.name = e;
  }
}, y$1 = class extends o {
  constructor() {
    super();
  }
  getEvent(e) {
    let t = this.get(e);
    return t instanceof c ? t : (this.set(e, new c(e)), this.get(e));
  }
  newListener(e, t, n) {
    let r = this.getEvent(e);
    return r.add(h({ name: e, callback: t, scope: n })), r;
  }
  on(e, t, n) {
    if (typeof e == "undefined" || e == null)
      return this;
    typeof e == "string" && (e = e.trim().split(/\s/g));
    let r, i, a = typeof e == "object" && !Array.isArray(e), l = a ? t : n;
    return a || (i = t), Object.keys(e).forEach((s) => {
      r = a ? s : e[s], a && (i = e[s]), this.newListener(r, i, l);
    }, this), this;
  }
  removeListener(e, t, n) {
    let r = this.get(e);
    if (r instanceof c && t) {
      let i = h({ name: e, callback: t, scope: n });
      r.forEach((a, l) => {
        if (a.callback === i.callback && a.scope === i.scope)
          return r.remove(l);
      });
    }
    return r;
  }
  off(e, t, n) {
    if (typeof e == "undefined" || e == null)
      return this;
    typeof e == "string" && (e = e.trim().split(/\s/g));
    let r, i, a = typeof e == "object" && !Array.isArray(e), l = a ? t : n;
    return a || (i = t), Object.keys(e).forEach((s) => {
      r = a ? s : e[s], a && (i = e[s]), typeof i == "function" ? this.removeListener(r, i, l) : this.remove(r);
    }, this), this;
  }
  once(e, t, n) {
    if (typeof e == "undefined" || e == null)
      return this;
    typeof e == "string" && (e = e.trim().split(/\s/g));
    let r = typeof e == "object" && !Array.isArray(e);
    return Object.keys(e).forEach((i) => {
      let a = r ? i : e[i], l = r ? e[i] : t, s = r ? t : n, u = (...f) => {
        l.apply(s, f), this.removeListener(a, u, s);
      };
      this.newListener(a, u, s);
    }, this), this;
  }
  emit(e, ...t) {
    return typeof e == "undefined" || e == null ? this : (typeof e == "string" && (e = e.trim().split(/\s/g)), e.forEach((n) => {
      let r = this.get(n);
      r instanceof c && r.forEach((i) => {
        let { callback: a, scope: l } = i;
        a.apply(l, t);
      });
    }, this), this);
  }
  clear() {
    return b$1(this, "clear"), super.clear(), this;
  }
};
const EVENTS_OPTS = {
  "init.start": console.log,
  "init.complete": console.info,
  "init.error": console.error,
  "init.loading": console.warn,
  "logger.log": console.log,
  "logger.error": console.error,
  "logger.warn": console.warn,
  "logger.info": console.info
};
const EVENTS = new y$1();
EVENTS.on(EVENTS_OPTS);
const STATE = {
  initialized: false,
  assets: [],
  esbuild: null
};
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
const createNotice = async (errors, kind = "error", color = true) => {
  let notices = await browser.exports.formatMessages(errors, { color, kind });
  return notices.map((msg) => !color ? msg : render(msg.replace(/(\s+)(\d+)(\s+)\│/g, "\n$1$2$3\u2502")));
};
const bytes = bytes_1;
const INPUT_EVENTS = {
  "build": build,
  "init": init
};
async function getESBUILD(platform = "node") {
  try {
    switch (platform) {
      case "node":
        return await import("esbuild");
      case "deno":
        return await import(
          /* @vite-ignore */
          `https://deno.land/x/esbuild@v${browser.exports.version}/mod.js`
        );
      default:
        return await import("./esbuild.mjs").then(function(n) {
          return n.b;
        });
    }
  } catch (e) {
    throw e;
  }
}
async function init({ platform, ...opts } = {}) {
  try {
    if (!STATE.initialized) {
      EVENTS.emit("init.start");
      STATE.esbuild = await getESBUILD(platform);
      if (platform !== "node" && platform !== "deno") {
        const { default: ESBUILD_WASM } = await import("./esbuild-wasm.mjs");
        await STATE.esbuild.initialize({
          wasmModule: new WebAssembly.Module(await ESBUILD_WASM()),
          ...opts
        });
      }
      STATE.initialized = true;
      EVENTS.emit("init.complete");
    }
    return STATE.esbuild;
  } catch (error) {
    EVENTS.emit("init.error", error);
    console.error(error);
  }
}
async function build(opts = {}) {
  if (!STATE.initialized)
    EVENTS.emit("init.loading");
  const CONFIG = deepAssign({}, DefaultConfig, opts);
  const { build: bundle } = await init(CONFIG.init);
  const { define = {}, loader = {}, ...esbuildOpts } = CONFIG.esbuild ?? {};
  let outputs = [];
  let content = [];
  let result;
  try {
    try {
      const keys = "p.env.NODE_ENV".replace("p.", "process.");
      result = await bundle({
        entryPoints: CONFIG?.entryPoints ?? [],
        metafile: Boolean(CONFIG.analysis),
        loader: {
          ".png": "file",
          ".jpeg": "file",
          ".ttf": "file",
          ".svg": "text",
          ".html": "text",
          ".scss": "css"
        },
        define: {
          "__NODE__": `false`,
          [keys]: `"production"`,
          ...define
        },
        write: false,
        outdir: "/",
        plugins: [
          ALIAS(EVENTS, STATE, CONFIG),
          EXTERNAL(EVENTS, STATE, CONFIG),
          HTTP(EVENTS, STATE, CONFIG),
          CDN(EVENTS, STATE, CONFIG),
          VIRTUAL_FS(EVENTS, STATE, CONFIG)
        ],
        ...esbuildOpts
      });
    } catch (e) {
      if (e.errors) {
        const asciMsgs = [...await createNotice(e.errors, "error", false)];
        const htmlMsgs = [...await createNotice(e.errors, "error")];
        EVENTS.emit("logger.error", asciMsgs, htmlMsgs);
        const message = (htmlMsgs.length > 1 ? `${htmlMsgs.length} error(s) ` : "") + "(if you are having trouble solving this issue, please create a new issue in the repo, https://github.com/okikio/bundle)";
        return EVENTS.emit("logger.error", message);
      } else
        throw e;
    }
    outputs = await Promise.all([...STATE.assets].concat(result?.outputFiles));
    content = await Promise.all(outputs?.map(({ path: path2, text, contents }) => {
      if (/\.map$/.test(path2))
        return encode$1("");
      if (esbuildOpts?.logLevel == "verbose") {
        const ignoreFile = /\.(wasm|png|jpeg|webp)$/.test(path2);
        if (ignoreFile) {
          EVENTS.emit("logger.log", "Output File: " + path2);
        } else {
          EVENTS.emit("logger.log", "Output File: " + path2 + "\n" + text);
        }
      }
      return contents;
    }));
    let { compression = {} } = CONFIG;
    let { type = "gzip", quality: level = 9 } = typeof compression == "string" ? { type: compression } : compression ?? {};
    let totalByteLength = bytes(content.reduce((acc, { byteLength }) => acc + byteLength, 0));
    let compressionMap = await (async () => {
      switch (type) {
        case "lz4":
          const { compress: lz4_compress } = await Promise.resolve().then(function() {
            return mod$1;
          });
          return async (code) => {
            return await lz4_compress(code);
          };
        case "brotli":
          const { compress: compress2 } = await Promise.resolve().then(function() {
            return mod$3;
          });
          return async (code) => {
            return await compress2(code, code.length, level);
          };
        default:
          const { gzip: gzip2, getWASM: getWASM2 } = await Promise.resolve().then(function() {
            return mod$2;
          });
          await getWASM2();
          return async (code) => {
            return await gzip2(code, level);
          };
      }
    })();
    let totalCompressedSize = bytes((await Promise.all(content.map(compressionMap))).reduce((acc, { length }) => acc + length, 0));
    return {
      result,
      outputFiles: result.outputFiles,
      initialSize: `${totalByteLength}`
    };
  } catch (e) {
  }
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
var v = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", y = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$", x = {};
function M(r, s) {
  if (!x[r]) {
    x[r] = {};
    for (let f = 0; f < r.length; f++)
      x[r][r.charAt(f)] = f;
  }
  return x[r][s];
}
function S(r) {
  if (r == null)
    return "";
  let s = b(r, 6, (f) => v.charAt(f));
  switch (s.length % 4) {
    default:
    case 0:
      return s;
    case 1:
      return s + "===";
    case 2:
      return s + "==";
    case 3:
      return s + "=";
  }
}
function O(r) {
  return r == null ? "" : r == "" ? null : A(r.length, 32, (s) => M(v, r.charAt(s)));
}
function j(r) {
  return r == null ? "" : b(r, 6, (s) => y.charAt(s));
}
function k(r) {
  return r == null ? "" : r == "" ? null : (r = r.replaceAll(" ", "+"), A(r.length, 32, (s) => M(y, r.charAt(s))));
}
function D(r) {
  return b(r, 16, String.fromCharCode);
}
function R(r) {
  return r == null ? "" : r == "" ? null : A(r.length, 32768, (s) => r.charCodeAt(s));
}
function b(r, s, f) {
  if (r == null)
    return "";
  let p = [], m = {}, h2 = {}, i, w, o2, g = "", u = "", d = "", l = 2, a = 3, c2 = 2, e = 0, t = 0;
  for (w = 0; w < r.length; w += 1)
    if (g = r.charAt(w), Object.prototype.hasOwnProperty.call(m, g) || (m[g] = a++, h2[g] = true), d = u + g, Object.prototype.hasOwnProperty.call(m, d))
      u = d;
    else {
      if (Object.prototype.hasOwnProperty.call(h2, u)) {
        if (u.charCodeAt(0) < 256) {
          for (i = 0; i < c2; i++)
            e = e << 1, t == s - 1 ? (t = 0, p.push(f(e)), e = 0) : t++;
          for (o2 = u.charCodeAt(0), i = 0; i < 8; i++)
            e = e << 1 | o2 & 1, t == s - 1 ? (t = 0, p.push(f(e)), e = 0) : t++, o2 = o2 >> 1;
        } else {
          for (o2 = 1, i = 0; i < c2; i++)
            e = e << 1 | o2, t == s - 1 ? (t = 0, p.push(f(e)), e = 0) : t++, o2 = 0;
          for (o2 = u.charCodeAt(0), i = 0; i < 16; i++)
            e = e << 1 | o2 & 1, t == s - 1 ? (t = 0, p.push(f(e)), e = 0) : t++, o2 = o2 >> 1;
        }
        l--, l == 0 && (l = Math.pow(2, c2), c2++), delete h2[u];
      } else
        for (o2 = m[u], i = 0; i < c2; i++)
          e = e << 1 | o2 & 1, t == s - 1 ? (t = 0, p.push(f(e)), e = 0) : t++, o2 = o2 >> 1;
      l--, l == 0 && (l = Math.pow(2, c2), c2++), m[d] = a++, u = String(g);
    }
  if (u !== "") {
    if (Object.prototype.hasOwnProperty.call(h2, u)) {
      if (u.charCodeAt(0) < 256) {
        for (i = 0; i < c2; i++)
          e = e << 1, t == s - 1 ? (t = 0, p.push(f(e)), e = 0) : t++;
        for (o2 = u.charCodeAt(0), i = 0; i < 8; i++)
          e = e << 1 | o2 & 1, t == s - 1 ? (t = 0, p.push(f(e)), e = 0) : t++, o2 = o2 >> 1;
      } else {
        for (o2 = 1, i = 0; i < c2; i++)
          e = e << 1 | o2, t == s - 1 ? (t = 0, p.push(f(e)), e = 0) : t++, o2 = 0;
        for (o2 = u.charCodeAt(0), i = 0; i < 16; i++)
          e = e << 1 | o2 & 1, t == s - 1 ? (t = 0, p.push(f(e)), e = 0) : t++, o2 = o2 >> 1;
      }
      l--, l == 0 && (l = Math.pow(2, c2), c2++), delete h2[u];
    } else
      for (o2 = m[u], i = 0; i < c2; i++)
        e = e << 1 | o2 & 1, t == s - 1 ? (t = 0, p.push(f(e)), e = 0) : t++, o2 = o2 >> 1;
    l--, l == 0 && (l = Math.pow(2, c2), c2++);
  }
  for (o2 = 2, i = 0; i < c2; i++)
    e = e << 1 | o2 & 1, t == s - 1 ? (t = 0, p.push(f(e)), e = 0) : t++, o2 = o2 >> 1;
  for (; ; )
    if (e = e << 1, t == s - 1) {
      p.push(f(e));
      break;
    } else
      t++;
  return p.join("");
}
function A(r, s, f) {
  let p = [], h2 = 4, i = 4, w = 3, o2 = "", g = [], u, d, l, a, c2, e, t, n = { val: f(0), position: s, index: 1 };
  for (u = 0; u < 3; u += 1)
    p[u] = u;
  for (l = 0, c2 = Math.pow(2, 2), e = 1; e != c2; )
    a = n.val & n.position, n.position >>= 1, n.position == 0 && (n.position = s, n.val = f(n.index++)), l |= (a > 0 ? 1 : 0) * e, e <<= 1;
  switch (l) {
    case 0:
      for (l = 0, c2 = Math.pow(2, 8), e = 1; e != c2; )
        a = n.val & n.position, n.position >>= 1, n.position == 0 && (n.position = s, n.val = f(n.index++)), l |= (a > 0 ? 1 : 0) * e, e <<= 1;
      t = String.fromCharCode(l);
      break;
    case 1:
      for (l = 0, c2 = Math.pow(2, 16), e = 1; e != c2; )
        a = n.val & n.position, n.position >>= 1, n.position == 0 && (n.position = s, n.val = f(n.index++)), l |= (a > 0 ? 1 : 0) * e, e <<= 1;
      t = String.fromCharCode(l);
      break;
    case 2:
      return "";
  }
  for (p[3] = t, d = t, g.push(t); ; ) {
    if (n.index > r)
      return "";
    for (l = 0, c2 = Math.pow(2, w), e = 1; e != c2; )
      a = n.val & n.position, n.position >>= 1, n.position == 0 && (n.position = s, n.val = f(n.index++)), l |= (a > 0 ? 1 : 0) * e, e <<= 1;
    switch (t = l) {
      case 0:
        for (l = 0, c2 = Math.pow(2, 8), e = 1; e != c2; )
          a = n.val & n.position, n.position >>= 1, n.position == 0 && (n.position = s, n.val = f(n.index++)), l |= (a > 0 ? 1 : 0) * e, e <<= 1;
        p[i++] = String.fromCharCode(l), t = i - 1, h2--;
        break;
      case 1:
        for (l = 0, c2 = Math.pow(2, 16), e = 1; e != c2; )
          a = n.val & n.position, n.position >>= 1, n.position == 0 && (n.position = s, n.val = f(n.index++)), l |= (a > 0 ? 1 : 0) * e, e <<= 1;
        p[i++] = String.fromCharCode(l), t = i - 1, h2--;
        break;
      case 2:
        return g.join("");
    }
    if (h2 == 0 && (h2 = Math.pow(2, w), w++), p[t])
      o2 = p[t];
    else if (t === i && typeof d == "string")
      o2 = d + d.charAt(0);
    else
      return null;
    g.push(o2), p[i++] = d + o2.charAt(0), h2--, d = o2, h2 == 0 && (h2 = Math.pow(2, w), w++);
  }
}
const parseTreeshakeExports = (str) => (str ?? "").split(/\],/).map((str2) => str2.replace(/\[|\]/g, ""));
const parseShareQuery = (shareURL) => {
  try {
    const searchParams = shareURL.searchParams;
    let result = "";
    let query = searchParams.get("query") || searchParams.get("q");
    let treeshake = searchParams.get("treeshake");
    if (query) {
      let queryArr = query.trim().split(",");
      let treeshakeArr = parseTreeshakeExports((treeshake ?? "").trim());
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
  try {
    const searchParams = shareURL.searchParams;
    const config = searchParams.get("config") ?? "{}";
    return deepAssign({}, EasyDefaultConfig, JSON.parse(config ? config : "{}"));
  } catch (e) {
  }
};
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
  let packages = result?.objects;
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
let initWASM$2;
const getWASM$2 = async () => {
  if (initWASM$2)
    return initWASM$2;
  const wasm2 = await import("./brotli.mjs");
  const { default: init2, source } = wasm2;
  await init2(await source());
  return initWASM$2 = wasm2;
};
async function compress$1(input, bufferSize = 4096, quality = 6, lgwin = 22) {
  const { compress: compress2 } = await getWASM$2();
  return compress2(input, bufferSize, quality, lgwin);
}
async function decompress$1(input, bufferSize = 4096) {
  const { decompress: decompress2 } = await getWASM$2();
  return decompress2(input, bufferSize);
}
var mod$3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getWASM: getWASM$2,
  compress: compress$1,
  decompress: decompress$1
}, Symbol.toStringTag, { value: "Module" }));
let wasm;
let initWASM$1;
const getWASM$1 = async (src) => {
  if (initWASM$1)
    return initWASM$1;
  const _exports = await import("./denoflate.mjs");
  const { default: init2 } = _exports;
  const { wasm: WASM } = await import("./gzip.mjs");
  wasm = await init2(src ?? await WASM());
  return initWASM$1 = _exports;
};
async function deflate(input, compression) {
  return (await getWASM$1()).deflate(input, compression);
}
async function inflate(input) {
  return (await getWASM$1()).inflate(input);
}
async function gzip(input, compression) {
  return (await getWASM$1()).gzip(input, compression);
}
async function gunzip(input) {
  return (await getWASM$1()).gunzip(input);
}
async function zlib(input, compression) {
  return (await getWASM$1()).zlib(input, compression);
}
async function unzlib(input) {
  return (await getWASM$1()).unzlib(input);
}
var wasm$1 = wasm;
var mod$2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get wasm() {
    return wasm;
  },
  get initWASM() {
    return initWASM$1;
  },
  getWASM: getWASM$1,
  deflate,
  inflate,
  gzip,
  gunzip,
  zlib,
  unzlib,
  "default": wasm$1
}, Symbol.toStringTag, { value: "Module" }));
let initWASM;
const getWASM = async () => {
  if (initWASM)
    return initWASM;
  const wasm2 = await import("./lz4.mjs");
  const { default: init2, source } = wasm2;
  await init2(await source());
  return initWASM = wasm2;
};
async function compress(input) {
  const { lz4_compress } = await getWASM();
  return lz4_compress(input);
}
async function decompress(input) {
  const { lz4_decompress } = await getWASM();
  return lz4_decompress(input);
}
var mod$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  compress,
  decompress
}, Symbol.toStringTag, { value: "Module" }));
function encode(data) {
  if (typeof data === "string") {
    return btoa(data);
  } else {
    const d = new Uint8Array(data);
    let dataString = "";
    for (let i = 0; i < d.length; ++i) {
      dataString += String.fromCharCode(d[i]);
    }
    return btoa(dataString);
  }
}
function decode(data) {
  const binaryString = decodeString(data);
  const binary = new Uint8Array(binaryString.length);
  for (let i = 0; i < binary.length; ++i) {
    binary[i] = binaryString.charCodeAt(i);
  }
  return binary.buffer;
}
function decodeString(data) {
  return atob(data);
}
var mod = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  encode,
  decode,
  decodeString
}, Symbol.toStringTag, { value: "Module" }));
export { ALIAS, ALIAS_NAMESPACE, ALIAS_RESOLVE, AnsiBuffer, CACHE, CACHE_NAME, CDN, CDN_NAMESPACE, CDN_RESOLVE, DEFAULT_CDN_HOST, DefaultConfig, DeprecatedAPIs, EMPTY_EXPORT, ESCAPE_TO_COLOR, EVENTS, EVENTS_OPTS, EXTERNAL, EXTERNALS_NAMESPACE, EasyDefaultConfig, ExternalPackages, FileSystem, HTTP, HTTP_NAMESPACE, HTTP_RESOLVE, INPUT_EVENTS, PLATFORM_AUTO, PolyfillKeys, PolyfillMap, RESOLVE_EXTENSIONS, SEP, SEP_PATTERN, STATE, VIRTUAL_FILESYSTEM_NAMESPACE, VIRTUAL_FS, render as ansi, bail, mod as base64, basename, mod$3 as brotli, build, D as compress, S as compressToBase64, j as compressToURL, debounce, decode$1 as decode, R as decompress, O as decompressFromBase64, k as decompressFromURL, deepAssign, deepDiff, deepEqual, delimiter, mod$2 as denoflate, dirname, encode$1 as encode, extname, fetchAssets, fetchPkg, format, fromFileUrl, getCDNOrigin, getCDNStyle, getCDNUrl, getESBUILD, getFile, getPackage, getPackages, getPureImportPath, getRegistryURL, getRequest, getResolvedPath, globToRegExp, htmlEscape, inferLoader, init, isAbsolute, isAlias, isBareImport, isExternal, isGlob, isObject, isPrimitive, isValidKey, join, joinGlobs, loop, mod$1 as lz4, newRequest, normalize, normalizeGlob, parse$1 as parse, parseConfig, parseShareQuery, parseTreeshakeExports, mod$4 as path, posix, relative, render, resolve$1 as resolve, resolveImports, sep, setFile, toFileUrl, toName, toNamespacedPath, urlJoin };
//# sourceMappingURL=index.mjs.map
