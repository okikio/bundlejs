var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a3, b3) => {
  for (var prop in b3 || (b3 = {}))
    if (__hasOwnProp.call(b3, prop))
      __defNormalProp(a3, prop, b3[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b3)) {
      if (__propIsEnum.call(b3, prop))
        __defNormalProp(a3, prop, b3[prop]);
    }
  return a3;
};
var __spreadProps = (a3, b3) => __defProps(a3, __getOwnPropDescs(b3));
var __objRest = (source2, exclude) => {
  var target = {};
  for (var prop in source2)
    if (__hasOwnProp.call(source2, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source2[prop];
  if (source2 != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source2)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source2, prop))
        target[prop] = source2[prop];
    }
  return target;
};
import { a as browser, s as source } from "./esbuild-wasm.js";
export { m as brotli, a as denoflate, b as lz4 } from "./compress.js";
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
  return [...ExternalPackages, ...external].find((it2) => {
    if (it2 === id)
      return true;
    if (id.startsWith(`${it2}/`))
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
function relative$1(from, to2) {
  assertPath(from);
  assertPath(to2);
  if (from === to2)
    return "";
  from = resolve$2(from);
  to2 = resolve$2(to2);
  if (from === to2)
    return "";
  let fromStart = 1;
  const fromEnd = from.length;
  for (; fromStart < fromEnd; ++fromStart) {
    if (from.charCodeAt(fromStart) !== CHAR_FORWARD_SLASH)
      break;
  }
  const fromLen = fromEnd - fromStart;
  let toStart = 1;
  const toEnd = to2.length;
  for (; toStart < toEnd; ++toStart) {
    if (to2.charCodeAt(toStart) !== CHAR_FORWARD_SLASH)
      break;
  }
  const toLen = toEnd - toStart;
  const length = fromLen < toLen ? fromLen : toLen;
  let lastCommonSep = -1;
  let i = 0;
  for (; i <= length; ++i) {
    if (i === length) {
      if (toLen > length) {
        if (to2.charCodeAt(toStart + i) === CHAR_FORWARD_SLASH) {
          return to2.slice(toStart + i + 1);
        } else if (i === 0) {
          return to2.slice(toStart + i);
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
    const toCode = to2.charCodeAt(toStart + i);
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
    return out + to2.slice(toStart + lastCommonSep);
  else {
    toStart += lastCommonSep;
    if (to2.charCodeAt(toStart) === CHAR_FORWARD_SLASH)
      ++toStart;
    return to2.slice(toStart);
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
  os: os2 = "linux",
  caseInsensitive = false
} = {}) {
  if (glob == "") {
    return /(?!)/;
  }
  const sep2 = os2 == "windows" ? "(?:\\\\|/)+" : "/+";
  const sepMaybe = os2 == "windows" ? "(?:\\\\|/)*" : "/*";
  const seps = os2 == "windows" ? ["\\", "/"] : ["/"];
  const globstar = os2 == "windows" ? "(?:[^\\\\/]*(?:\\\\|/|$)+)*" : "(?:[^/]*(?:/|$)+)*";
  const wildcard = os2 == "windows" ? "[^\\\\/]*" : "[^/]*";
  const escapePrefix = os2 == "windows" ? "`" : "\\";
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
      const n2 = str.indexOf(close, idx);
      if (n2 !== -1) {
        idx = n2 + 1;
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
var mod$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
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
    let { browser: browser2, require: require2, unsafe, conditions = [] } = options;
    let target = toName$1(name, entry);
    if (target[0] !== ".")
      target = "./" + target;
    if (typeof exports === "string") {
      return target === "." ? exports : bail$1(name, target);
    }
    let allows = /* @__PURE__ */ new Set(["default", ...conditions]);
    unsafe || allows.add(require2 ? "require" : "import");
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
  const m3 = RE_SCOPED.exec(input) || RE_NON_SCOPED.exec(input);
  if (!m3) {
    throw new Error(`[parse-package-name] invalid package name: ${input}`);
  }
  return {
    name: m3[1] || "",
    version: m3[2] || "latest",
    path: m3[3] || ""
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
    let { browser: browser2, require: require2, unsafe, conditions = [] } = options;
    let target = toName(name, entry);
    if (typeof imports === "string") {
      return target === "#" ? imports : bail(name, target);
    }
    let allows = /* @__PURE__ */ new Set(["default", ...conditions]);
    unsafe || allows.add(require2 ? "require" : "import");
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
        let path2 = resolveImports(__spreadProps(__spreadValues({}, pkg), { exports: pkg.imports }), argPath, {
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
  return aliasKeys.find((it2) => {
    return pkgDetails.name === it2;
  });
};
const ALIAS_RESOLVE = (aliases = {}, host = DEFAULT_CDN_HOST, events) => {
  return async (args) => {
    let path2 = args.path.replace(/^node\:/, "");
    let { path: argPath } = getCDNUrl(path2);
    if (isAlias(argPath, aliases)) {
      let pkgDetails = parse(argPath);
      let aliasPath = aliases[pkgDetails.name];
      return HTTP_RESOLVE(host, events)(__spreadProps(__spreadValues({}, args), {
        path: aliasPath
      }));
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
var o$1 = class {
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
    let n2 = this.size;
    return this.set(n2, e), this;
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
}, b$1 = (p2, e, ...t) => {
  p2.forEach((n2) => {
    n2[e](...t);
  });
};
var h$1 = ({ callback: p2 = () => {
}, scope: e = null, name: t = "event" }) => ({ callback: p2, scope: e, name: t }), c$1 = class extends o$1 {
  constructor(e = "event") {
    super();
    this.name = e;
  }
}, y$2 = class extends o$1 {
  constructor() {
    super();
  }
  getEvent(e) {
    let t = this.get(e);
    return t instanceof c$1 ? t : (this.set(e, new c$1(e)), this.get(e));
  }
  newListener(e, t, n2) {
    let r2 = this.getEvent(e);
    return r2.add(h$1({ name: e, callback: t, scope: n2 })), r2;
  }
  on(e, t, n2) {
    if (typeof e == "undefined" || e == null)
      return this;
    typeof e == "string" && (e = e.trim().split(/\s/g));
    let r2, i, a3 = typeof e == "object" && !Array.isArray(e), l2 = a3 ? t : n2;
    return a3 || (i = t), Object.keys(e).forEach((s) => {
      r2 = a3 ? s : e[s], a3 && (i = e[s]), this.newListener(r2, i, l2);
    }, this), this;
  }
  removeListener(e, t, n2) {
    let r2 = this.get(e);
    if (r2 instanceof c$1 && t) {
      let i = h$1({ name: e, callback: t, scope: n2 });
      r2.forEach((a3, l2) => {
        if (a3.callback === i.callback && a3.scope === i.scope)
          return r2.remove(l2);
      });
    }
    return r2;
  }
  off(e, t, n2) {
    if (typeof e == "undefined" || e == null)
      return this;
    typeof e == "string" && (e = e.trim().split(/\s/g));
    let r2, i, a3 = typeof e == "object" && !Array.isArray(e), l2 = a3 ? t : n2;
    return a3 || (i = t), Object.keys(e).forEach((s) => {
      r2 = a3 ? s : e[s], a3 && (i = e[s]), typeof i == "function" ? this.removeListener(r2, i, l2) : this.remove(r2);
    }, this), this;
  }
  once(e, t, n2) {
    if (typeof e == "undefined" || e == null)
      return this;
    typeof e == "string" && (e = e.trim().split(/\s/g));
    let r2 = typeof e == "object" && !Array.isArray(e);
    return Object.keys(e).forEach((i) => {
      let a3 = r2 ? i : e[i], l2 = r2 ? e[i] : t, s = r2 ? t : n2, u2 = (...f2) => {
        l2.apply(s, f2), this.removeListener(a3, u2, s);
      };
      this.newListener(a3, u2, s);
    }, this), this;
  }
  emit(e, ...t) {
    return typeof e == "undefined" || e == null ? this : (typeof e == "string" && (e = e.trim().split(/\s/g)), e.forEach((n2) => {
      let r2 = this.get(n2);
      r2 instanceof c$1 && r2.forEach((i) => {
        let { callback: a3, scope: l2 } = i;
        a3.apply(l2, t);
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
const EVENTS = new y$2();
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
  for (let m3 of ansi.matchAll(/\x1B\[([\d;]+)m/g)) {
    const escape = m3[1];
    buffer.text(ansi.slice(i, m3.index));
    i = m3.index + m3[0].length;
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
        return await import("./esbuild-wasm.js").then(function(n2) {
          return n2.b;
        });
    }
  } catch (e) {
    throw e;
  }
}
async function init(_a2 = {}) {
  var _b = _a2, { platform } = _b, opts = __objRest(_b, ["platform"]);
  try {
    if (!STATE.initialized) {
      EVENTS.emit("init.start");
      STATE.esbuild = await getESBUILD(platform);
      if (platform !== "node" && platform !== "deno") {
        await STATE.esbuild.initialize(__spreadValues({
          wasmModule: new WebAssembly.Module(await source())
        }, opts));
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
  const _a2 = CONFIG.esbuild ?? {}, { define = {}, loader = {} } = _a2, esbuildOpts = __objRest(_a2, ["define", "loader"]);
  let outputs = [];
  let content = [];
  let result;
  try {
    try {
      const keys = "p.env.NODE_ENV".replace("p.", "process.");
      result = await bundle(__spreadValues({
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
        define: __spreadValues({
          "__NODE__": `false`,
          [keys]: `"production"`
        }, define),
        write: false,
        outdir: "/",
        plugins: [
          ALIAS(EVENTS, STATE, CONFIG),
          EXTERNAL(EVENTS, STATE, CONFIG),
          HTTP(EVENTS, STATE, CONFIG),
          CDN(EVENTS, STATE, CONFIG),
          VIRTUAL_FS(EVENTS, STATE, CONFIG)
        ]
      }, esbuildOpts));
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
          const { compress: lz4_compress } = await import("./compress.js").then(function(n2) {
            return n2.b;
          });
          return async (code) => {
            return await lz4_compress(code);
          };
        case "brotli":
          const { compress } = await import("./compress.js").then(function(n2) {
            return n2.m;
          });
          return (code) => {
            return compress(code, code.length, level);
          };
        default:
          const { gzip, getWASM } = await import("./compress.js").then(function(n2) {
            return n2.a;
          });
          await getWASM();
          return async (code) => {
            return await gzip(code, level);
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
var y$1 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$", x$1 = {};
function M$1(r2, s) {
  if (!x$1[r2]) {
    x$1[r2] = {};
    for (let f2 = 0; f2 < r2.length; f2++)
      x$1[r2][r2.charAt(f2)] = f2;
  }
  return x$1[r2][s];
}
function k$1(r2) {
  return r2 == null ? "" : r2 == "" ? null : (r2 = r2.replaceAll(" ", "+"), A$1(r2.length, 32, (s) => M$1(y$1, r2.charAt(s))));
}
function A$1(r2, s, f2) {
  let p2 = [], h2 = 4, i = 4, w2 = 3, o2 = "", g2 = [], u2, d2, l2, a3, c2, e, t, n2 = { val: f2(0), position: s, index: 1 };
  for (u2 = 0; u2 < 3; u2 += 1)
    p2[u2] = u2;
  for (l2 = 0, c2 = Math.pow(2, 2), e = 1; e != c2; )
    a3 = n2.val & n2.position, n2.position >>= 1, n2.position == 0 && (n2.position = s, n2.val = f2(n2.index++)), l2 |= (a3 > 0 ? 1 : 0) * e, e <<= 1;
  switch (l2) {
    case 0:
      for (l2 = 0, c2 = Math.pow(2, 8), e = 1; e != c2; )
        a3 = n2.val & n2.position, n2.position >>= 1, n2.position == 0 && (n2.position = s, n2.val = f2(n2.index++)), l2 |= (a3 > 0 ? 1 : 0) * e, e <<= 1;
      t = String.fromCharCode(l2);
      break;
    case 1:
      for (l2 = 0, c2 = Math.pow(2, 16), e = 1; e != c2; )
        a3 = n2.val & n2.position, n2.position >>= 1, n2.position == 0 && (n2.position = s, n2.val = f2(n2.index++)), l2 |= (a3 > 0 ? 1 : 0) * e, e <<= 1;
      t = String.fromCharCode(l2);
      break;
    case 2:
      return "";
  }
  for (p2[3] = t, d2 = t, g2.push(t); ; ) {
    if (n2.index > r2)
      return "";
    for (l2 = 0, c2 = Math.pow(2, w2), e = 1; e != c2; )
      a3 = n2.val & n2.position, n2.position >>= 1, n2.position == 0 && (n2.position = s, n2.val = f2(n2.index++)), l2 |= (a3 > 0 ? 1 : 0) * e, e <<= 1;
    switch (t = l2) {
      case 0:
        for (l2 = 0, c2 = Math.pow(2, 8), e = 1; e != c2; )
          a3 = n2.val & n2.position, n2.position >>= 1, n2.position == 0 && (n2.position = s, n2.val = f2(n2.index++)), l2 |= (a3 > 0 ? 1 : 0) * e, e <<= 1;
        p2[i++] = String.fromCharCode(l2), t = i - 1, h2--;
        break;
      case 1:
        for (l2 = 0, c2 = Math.pow(2, 16), e = 1; e != c2; )
          a3 = n2.val & n2.position, n2.position >>= 1, n2.position == 0 && (n2.position = s, n2.val = f2(n2.index++)), l2 |= (a3 > 0 ? 1 : 0) * e, e <<= 1;
        p2[i++] = String.fromCharCode(l2), t = i - 1, h2--;
        break;
      case 2:
        return g2.join("");
    }
    if (h2 == 0 && (h2 = Math.pow(2, w2), w2++), p2[t])
      o2 = p2[t];
    else if (t === i && typeof d2 == "string")
      o2 = d2 + d2.charAt(0);
    else
      return null;
    g2.push(o2), p2[i++] = d2 + o2.charAt(0), h2--, d2 = o2, h2 == 0 && (h2 = Math.pow(2, w2), w2++);
  }
}
const parseTreeshakeExports = (str) => (str ?? "").split(/\],/).map((str2) => str2.replace(/\[|\]/g, ""));
const parseShareQuery = (shareURL) => {
  try {
    const searchParams = shareURL.searchParams;
    let result = "";
    let query = searchParams.get("query") || searchParams.get("q");
    let treeshake2 = searchParams.get("treeshake");
    if (query) {
      let queryArr = query.trim().split(",");
      let treeshakeArr = parseTreeshakeExports((treeshake2 ?? "").trim());
      result += "// Click Build for the Bundled, Minified & Compressed package size\n" + queryArr.map((q2, i) => {
        let treeshakeExports = treeshakeArr[i] && treeshakeArr[i].trim() !== "*" ? treeshakeArr[i].trim().split(",").join(", ") : "*";
        let [
          ,
          ,
          declaration = "export",
          module
        ] = /^(\((.*)\))?(.*)/.exec(q2);
        return `${declaration} ${treeshakeExports} from ${JSON.stringify(module)};`;
      }).join("\n");
    }
    let share = searchParams.get("share");
    if (share)
      result += "\n" + k$1(share.trim());
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
/*
  @license
	Rollup.js v2.75.6
	Tue, 07 Jun 2022 14:42:22 GMT - commit 0ab16cc04b7d6dfe5bd14340ba7448085a379e25

	https://github.com/rollup/rollup

	Released under the MIT License.
*/
for (var e = "2.75.6", t = {}, i = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", s = 0; s < i.length; s++)
  t[i.charCodeAt(s)] = s;
function n(e, t, i) {
  i === 4 ? e.push([t[0], t[1], t[2], t[3]]) : i === 5 ? e.push([t[0], t[1], t[2], t[3], t[4]]) : i === 1 && e.push([t[0]]);
}
function r(e) {
  var t = "";
  e = e < 0 ? -e << 1 | 1 : e << 1;
  do {
    var s = 31 & e;
    (e >>>= 5) > 0 && (s |= 32), t += i[s];
  } while (e > 0);
  return t;
}
class a2 {
  constructor(e) {
    this.bits = e instanceof a2 ? e.bits.slice() : [];
  }
  add(e) {
    this.bits[e >> 5] |= 1 << (31 & e);
  }
  has(e) {
    return !!(this.bits[e >> 5] & 1 << (31 & e));
  }
}
class o {
  constructor(e, t, i) {
    this.start = e, this.end = t, this.original = i, this.intro = "", this.outro = "", this.content = i, this.storeName = false, this.edited = false, Object.defineProperties(this, { previous: { writable: true, value: null }, next: { writable: true, value: null } });
  }
  appendLeft(e) {
    this.outro += e;
  }
  appendRight(e) {
    this.intro = this.intro + e;
  }
  clone() {
    const e = new o(this.start, this.end, this.original);
    return e.intro = this.intro, e.outro = this.outro, e.content = this.content, e.storeName = this.storeName, e.edited = this.edited, e;
  }
  contains(e) {
    return this.start < e && e < this.end;
  }
  eachNext(e) {
    let t = this;
    for (; t; )
      e(t), t = t.next;
  }
  eachPrevious(e) {
    let t = this;
    for (; t; )
      e(t), t = t.previous;
  }
  edit(e, t, i) {
    return this.content = e, i || (this.intro = "", this.outro = ""), this.storeName = t, this.edited = true, this;
  }
  prependLeft(e) {
    this.outro = e + this.outro;
  }
  prependRight(e) {
    this.intro = e + this.intro;
  }
  split(e) {
    const t = e - this.start, i = this.original.slice(0, t), s = this.original.slice(t);
    this.original = i;
    const n2 = new o(e, this.end, s);
    return n2.outro = this.outro, this.outro = "", this.end = e, this.edited ? (n2.edit("", false), this.content = "") : this.content = i, n2.next = this.next, n2.next && (n2.next.previous = n2), n2.previous = this, this.next = n2, n2;
  }
  toString() {
    return this.intro + this.content + this.outro;
  }
  trimEnd(e) {
    if (this.outro = this.outro.replace(e, ""), this.outro.length)
      return true;
    const t = this.content.replace(e, "");
    return t.length ? (t !== this.content && this.split(this.start + t.length).edit("", void 0, true), true) : (this.edit("", void 0, true), this.intro = this.intro.replace(e, ""), !!this.intro.length || void 0);
  }
  trimStart(e) {
    if (this.intro = this.intro.replace(e, ""), this.intro.length)
      return true;
    const t = this.content.replace(e, "");
    return t.length ? (t !== this.content && (this.split(this.end - t.length), this.edit("", void 0, true)), true) : (this.edit("", void 0, true), this.outro = this.outro.replace(e, ""), !!this.outro.length || void 0);
  }
}
let l = () => {
  throw new Error("Unsupported environment: `window.btoa` or `Buffer` should be supported.");
};
typeof window != "undefined" && typeof window.btoa == "function" ? l = (e) => window.btoa(unescape(encodeURIComponent(e))) : typeof Buffer == "function" && (l = (e) => Buffer.from(e, "utf-8").toString("base64"));
class h {
  constructor(e) {
    this.version = 3, this.file = e.file, this.sources = e.sources, this.sourcesContent = e.sourcesContent, this.names = e.names, this.mappings = function(e2) {
      for (var t = 0, i = 0, s = 0, n2 = 0, a3 = "", o2 = 0; o2 < e2.length; o2++) {
        var l2 = e2[o2];
        if (o2 > 0 && (a3 += ";"), l2.length !== 0) {
          for (var h2 = 0, c2 = [], u2 = 0, d2 = l2; u2 < d2.length; u2++) {
            var p2 = d2[u2], f2 = r(p2[0] - h2);
            h2 = p2[0], p2.length > 1 && (f2 += r(p2[1] - t) + r(p2[2] - i) + r(p2[3] - s), t = p2[1], i = p2[2], s = p2[3]), p2.length === 5 && (f2 += r(p2[4] - n2), n2 = p2[4]), c2.push(f2);
          }
          a3 += c2.join(",");
        }
      }
      return a3;
    }(e.mappings);
  }
  toString() {
    return JSON.stringify(this);
  }
  toUrl() {
    return "data:application/json;charset=utf-8;base64," + l(this.toString());
  }
}
function c(e) {
  const t = e.split("\n"), i = t.filter((e2) => /^\t+/.test(e2)), s = t.filter((e2) => /^ {2,}/.test(e2));
  if (i.length === 0 && s.length === 0)
    return null;
  if (i.length >= s.length)
    return "	";
  const n2 = s.reduce((e2, t2) => {
    const i2 = /^ +/.exec(t2)[0].length;
    return Math.min(i2, e2);
  }, 1 / 0);
  return new Array(n2 + 1).join(" ");
}
function u(e, t) {
  const i = e.split(/[/\\]/), s = t.split(/[/\\]/);
  for (i.pop(); i[0] === s[0]; )
    i.shift(), s.shift();
  if (i.length) {
    let e2 = i.length;
    for (; e2--; )
      i[e2] = "..";
  }
  return i.concat(s).join("/");
}
const d = Object.prototype.toString;
function p(e) {
  return d.call(e) === "[object Object]";
}
function f(e) {
  const t = e.split("\n"), i = [];
  for (let e2 = 0, s = 0; e2 < t.length; e2++)
    i.push(s), s += t[e2].length + 1;
  return function(e2) {
    let t2 = 0, s = i.length;
    for (; t2 < s; ) {
      const n3 = t2 + s >> 1;
      e2 < i[n3] ? s = n3 : t2 = n3 + 1;
    }
    const n2 = t2 - 1;
    return { line: n2, column: e2 - i[n2] };
  };
}
class m2 {
  constructor(e) {
    this.hires = e, this.generatedCodeLine = 0, this.generatedCodeColumn = 0, this.raw = [], this.rawSegments = this.raw[this.generatedCodeLine] = [], this.pending = null;
  }
  addEdit(e, t, i, s) {
    if (t.length) {
      const t2 = [this.generatedCodeColumn, e, i.line, i.column];
      s >= 0 && t2.push(s), this.rawSegments.push(t2);
    } else
      this.pending && this.rawSegments.push(this.pending);
    this.advance(t), this.pending = null;
  }
  addUneditedChunk(e, t, i, s, n2) {
    let r2 = t.start, a3 = true;
    for (; r2 < t.end; )
      (this.hires || a3 || n2.has(r2)) && this.rawSegments.push([this.generatedCodeColumn, e, s.line, s.column]), i[r2] === "\n" ? (s.line += 1, s.column = 0, this.generatedCodeLine += 1, this.raw[this.generatedCodeLine] = this.rawSegments = [], this.generatedCodeColumn = 0, a3 = true) : (s.column += 1, this.generatedCodeColumn += 1, a3 = false), r2 += 1;
    this.pending = null;
  }
  advance(e) {
    if (!e)
      return;
    const t = e.split("\n");
    if (t.length > 1) {
      for (let e2 = 0; e2 < t.length - 1; e2++)
        this.generatedCodeLine++, this.raw[this.generatedCodeLine] = this.rawSegments = [];
      this.generatedCodeColumn = 0;
    }
    this.generatedCodeColumn += t[t.length - 1].length;
  }
}
const g = "\n", y = { insertLeft: false, insertRight: false, storeName: false };
class x {
  constructor(e, t = {}) {
    const i = new o(0, e.length, e);
    Object.defineProperties(this, { original: { writable: true, value: e }, outro: { writable: true, value: "" }, intro: { writable: true, value: "" }, firstChunk: { writable: true, value: i }, lastChunk: { writable: true, value: i }, lastSearchedChunk: { writable: true, value: i }, byStart: { writable: true, value: {} }, byEnd: { writable: true, value: {} }, filename: { writable: true, value: t.filename }, indentExclusionRanges: { writable: true, value: t.indentExclusionRanges }, sourcemapLocations: { writable: true, value: new a2() }, storedNames: { writable: true, value: {} }, indentStr: { writable: true, value: c(e) } }), this.byStart[0] = i, this.byEnd[e.length] = i;
  }
  addSourcemapLocation(e) {
    this.sourcemapLocations.add(e);
  }
  append(e) {
    if (typeof e != "string")
      throw new TypeError("outro content must be a string");
    return this.outro += e, this;
  }
  appendLeft(e, t) {
    if (typeof t != "string")
      throw new TypeError("inserted content must be a string");
    this._split(e);
    const i = this.byEnd[e];
    return i ? i.appendLeft(t) : this.intro += t, this;
  }
  appendRight(e, t) {
    if (typeof t != "string")
      throw new TypeError("inserted content must be a string");
    this._split(e);
    const i = this.byStart[e];
    return i ? i.appendRight(t) : this.outro += t, this;
  }
  clone() {
    const e = new x(this.original, { filename: this.filename });
    let t = this.firstChunk, i = e.firstChunk = e.lastSearchedChunk = t.clone();
    for (; t; ) {
      e.byStart[i.start] = i, e.byEnd[i.end] = i;
      const s = t.next, n2 = s && s.clone();
      n2 && (i.next = n2, n2.previous = i, i = n2), t = s;
    }
    return e.lastChunk = i, this.indentExclusionRanges && (e.indentExclusionRanges = this.indentExclusionRanges.slice()), e.sourcemapLocations = new a2(this.sourcemapLocations), e.intro = this.intro, e.outro = this.outro, e;
  }
  generateDecodedMap(e) {
    e = e || {};
    const t = Object.keys(this.storedNames), i = new m2(e.hires), s = f(this.original);
    return this.intro && i.advance(this.intro), this.firstChunk.eachNext((e2) => {
      const n2 = s(e2.start);
      e2.intro.length && i.advance(e2.intro), e2.edited ? i.addEdit(0, e2.content, n2, e2.storeName ? t.indexOf(e2.original) : -1) : i.addUneditedChunk(0, e2, this.original, n2, this.sourcemapLocations), e2.outro.length && i.advance(e2.outro);
    }), { file: e.file ? e.file.split(/[/\\]/).pop() : null, sources: [e.source ? u(e.file || "", e.source) : null], sourcesContent: e.includeContent ? [this.original] : [null], names: t, mappings: i.raw };
  }
  generateMap(e) {
    return new h(this.generateDecodedMap(e));
  }
  getIndentString() {
    return this.indentStr === null ? "	" : this.indentStr;
  }
  indent(e, t) {
    const i = /^[^\r\n]/gm;
    if (p(e) && (t = e, e = void 0), (e = e !== void 0 ? e : this.indentStr || "	") === "")
      return this;
    const s = {};
    if ((t = t || {}).exclude) {
      (typeof t.exclude[0] == "number" ? [t.exclude] : t.exclude).forEach((e2) => {
        for (let t2 = e2[0]; t2 < e2[1]; t2 += 1)
          s[t2] = true;
      });
    }
    let n2 = t.indentStart !== false;
    const r2 = (t2) => n2 ? `${e}${t2}` : (n2 = true, t2);
    this.intro = this.intro.replace(i, r2);
    let a3 = 0, o2 = this.firstChunk;
    for (; o2; ) {
      const t2 = o2.end;
      if (o2.edited)
        s[a3] || (o2.content = o2.content.replace(i, r2), o2.content.length && (n2 = o2.content[o2.content.length - 1] === "\n"));
      else
        for (a3 = o2.start; a3 < t2; ) {
          if (!s[a3]) {
            const t3 = this.original[a3];
            t3 === "\n" ? n2 = true : t3 !== "\r" && n2 && (n2 = false, a3 === o2.start || (this._splitChunk(o2, a3), o2 = o2.next), o2.prependRight(e));
          }
          a3 += 1;
        }
      a3 = o2.end, o2 = o2.next;
    }
    return this.outro = this.outro.replace(i, r2), this;
  }
  insert() {
    throw new Error("magicString.insert(...) is deprecated. Use prependRight(...) or appendLeft(...)");
  }
  insertLeft(e, t) {
    return y.insertLeft || (console.warn("magicString.insertLeft(...) is deprecated. Use magicString.appendLeft(...) instead"), y.insertLeft = true), this.appendLeft(e, t);
  }
  insertRight(e, t) {
    return y.insertRight || (console.warn("magicString.insertRight(...) is deprecated. Use magicString.prependRight(...) instead"), y.insertRight = true), this.prependRight(e, t);
  }
  move(e, t, i) {
    if (i >= e && i <= t)
      throw new Error("Cannot move a selection inside itself");
    this._split(e), this._split(t), this._split(i);
    const s = this.byStart[e], n2 = this.byEnd[t], r2 = s.previous, a3 = n2.next, o2 = this.byStart[i];
    if (!o2 && n2 === this.lastChunk)
      return this;
    const l2 = o2 ? o2.previous : this.lastChunk;
    return r2 && (r2.next = a3), a3 && (a3.previous = r2), l2 && (l2.next = s), o2 && (o2.previous = n2), s.previous || (this.firstChunk = n2.next), n2.next || (this.lastChunk = s.previous, this.lastChunk.next = null), s.previous = l2, n2.next = o2 || null, l2 || (this.firstChunk = s), o2 || (this.lastChunk = n2), this;
  }
  overwrite(e, t, i, s) {
    if (typeof i != "string")
      throw new TypeError("replacement content must be a string");
    for (; e < 0; )
      e += this.original.length;
    for (; t < 0; )
      t += this.original.length;
    if (t > this.original.length)
      throw new Error("end is out of bounds");
    if (e === t)
      throw new Error("Cannot overwrite a zero-length range \u2013 use appendLeft or prependRight instead");
    this._split(e), this._split(t), s === true && (y.storeName || (console.warn("The final argument to magicString.overwrite(...) should be an options object. See https://github.com/rich-harris/magic-string"), y.storeName = true), s = { storeName: true });
    const n2 = s !== void 0 && s.storeName, r2 = s !== void 0 && s.contentOnly;
    if (n2) {
      const i2 = this.original.slice(e, t);
      Object.defineProperty(this.storedNames, i2, { writable: true, value: true, enumerable: true });
    }
    const a3 = this.byStart[e], l2 = this.byEnd[t];
    if (a3) {
      let e2 = a3;
      for (; e2 !== l2; ) {
        if (e2.next !== this.byStart[e2.end])
          throw new Error("Cannot overwrite across a split point");
        e2 = e2.next, e2.edit("", false);
      }
      a3.edit(i, n2, r2);
    } else {
      const s2 = new o(e, t, "").edit(i, n2);
      l2.next = s2, s2.previous = l2;
    }
    return this;
  }
  prepend(e) {
    if (typeof e != "string")
      throw new TypeError("outro content must be a string");
    return this.intro = e + this.intro, this;
  }
  prependLeft(e, t) {
    if (typeof t != "string")
      throw new TypeError("inserted content must be a string");
    this._split(e);
    const i = this.byEnd[e];
    return i ? i.prependLeft(t) : this.intro = t + this.intro, this;
  }
  prependRight(e, t) {
    if (typeof t != "string")
      throw new TypeError("inserted content must be a string");
    this._split(e);
    const i = this.byStart[e];
    return i ? i.prependRight(t) : this.outro = t + this.outro, this;
  }
  remove(e, t) {
    for (; e < 0; )
      e += this.original.length;
    for (; t < 0; )
      t += this.original.length;
    if (e === t)
      return this;
    if (e < 0 || t > this.original.length)
      throw new Error("Character is out of bounds");
    if (e > t)
      throw new Error("end must be greater than start");
    this._split(e), this._split(t);
    let i = this.byStart[e];
    for (; i; )
      i.intro = "", i.outro = "", i.edit(""), i = t > i.end ? this.byStart[i.end] : null;
    return this;
  }
  lastChar() {
    if (this.outro.length)
      return this.outro[this.outro.length - 1];
    let e = this.lastChunk;
    do {
      if (e.outro.length)
        return e.outro[e.outro.length - 1];
      if (e.content.length)
        return e.content[e.content.length - 1];
      if (e.intro.length)
        return e.intro[e.intro.length - 1];
    } while (e = e.previous);
    return this.intro.length ? this.intro[this.intro.length - 1] : "";
  }
  lastLine() {
    let e = this.outro.lastIndexOf(g);
    if (e !== -1)
      return this.outro.substr(e + 1);
    let t = this.outro, i = this.lastChunk;
    do {
      if (i.outro.length > 0) {
        if (e = i.outro.lastIndexOf(g), e !== -1)
          return i.outro.substr(e + 1) + t;
        t = i.outro + t;
      }
      if (i.content.length > 0) {
        if (e = i.content.lastIndexOf(g), e !== -1)
          return i.content.substr(e + 1) + t;
        t = i.content + t;
      }
      if (i.intro.length > 0) {
        if (e = i.intro.lastIndexOf(g), e !== -1)
          return i.intro.substr(e + 1) + t;
        t = i.intro + t;
      }
    } while (i = i.previous);
    return e = this.intro.lastIndexOf(g), e !== -1 ? this.intro.substr(e + 1) + t : this.intro + t;
  }
  slice(e = 0, t = this.original.length) {
    for (; e < 0; )
      e += this.original.length;
    for (; t < 0; )
      t += this.original.length;
    let i = "", s = this.firstChunk;
    for (; s && (s.start > e || s.end <= e); ) {
      if (s.start < t && s.end >= t)
        return i;
      s = s.next;
    }
    if (s && s.edited && s.start !== e)
      throw new Error(`Cannot use replaced character ${e} as slice start anchor.`);
    const n2 = s;
    for (; s; ) {
      !s.intro || n2 === s && s.start !== e || (i += s.intro);
      const r2 = s.start < t && s.end >= t;
      if (r2 && s.edited && s.end !== t)
        throw new Error(`Cannot use replaced character ${t} as slice end anchor.`);
      const a3 = n2 === s ? e - s.start : 0, o2 = r2 ? s.content.length + t - s.end : s.content.length;
      if (i += s.content.slice(a3, o2), !s.outro || r2 && s.end !== t || (i += s.outro), r2)
        break;
      s = s.next;
    }
    return i;
  }
  snip(e, t) {
    const i = this.clone();
    return i.remove(0, e), i.remove(t, i.original.length), i;
  }
  _split(e) {
    if (this.byStart[e] || this.byEnd[e])
      return;
    let t = this.lastSearchedChunk;
    const i = e > t.end;
    for (; t; ) {
      if (t.contains(e))
        return this._splitChunk(t, e);
      t = i ? this.byStart[t.end] : this.byEnd[t.start];
    }
  }
  _splitChunk(e, t) {
    if (e.edited && e.content.length) {
      const i2 = f(this.original)(t);
      throw new Error(`Cannot split a chunk that has already been edited (${i2.line}:${i2.column} \u2013 "${e.original}")`);
    }
    const i = e.split(t);
    return this.byEnd[t] = e, this.byStart[t] = i, this.byEnd[i.end] = i, e === this.lastChunk && (this.lastChunk = i), this.lastSearchedChunk = e, true;
  }
  toString() {
    let e = this.intro, t = this.firstChunk;
    for (; t; )
      e += t.toString(), t = t.next;
    return e + this.outro;
  }
  isEmpty() {
    let e = this.firstChunk;
    do {
      if (e.intro.length && e.intro.trim() || e.content.length && e.content.trim() || e.outro.length && e.outro.trim())
        return false;
    } while (e = e.next);
    return true;
  }
  length() {
    let e = this.firstChunk, t = 0;
    do {
      t += e.intro.length + e.content.length + e.outro.length;
    } while (e = e.next);
    return t;
  }
  trimLines() {
    return this.trim("[\\r\\n]");
  }
  trim(e) {
    return this.trimStart(e).trimEnd(e);
  }
  trimEndAborted(e) {
    const t = new RegExp((e || "\\s") + "+$");
    if (this.outro = this.outro.replace(t, ""), this.outro.length)
      return true;
    let i = this.lastChunk;
    do {
      const e2 = i.end, s = i.trimEnd(t);
      if (i.end !== e2 && (this.lastChunk === i && (this.lastChunk = i.next), this.byEnd[i.end] = i, this.byStart[i.next.start] = i.next, this.byEnd[i.next.end] = i.next), s)
        return true;
      i = i.previous;
    } while (i);
    return false;
  }
  trimEnd(e) {
    return this.trimEndAborted(e), this;
  }
  trimStartAborted(e) {
    const t = new RegExp("^" + (e || "\\s") + "+");
    if (this.intro = this.intro.replace(t, ""), this.intro.length)
      return true;
    let i = this.firstChunk;
    do {
      const e2 = i.end, s = i.trimStart(t);
      if (i.end !== e2 && (i === this.lastChunk && (this.lastChunk = i.next), this.byEnd[i.end] = i, this.byStart[i.next.start] = i.next, this.byEnd[i.next.end] = i.next), s)
        return true;
      i = i.next;
    } while (i);
    return false;
  }
  trimStart(e) {
    return this.trimStartAborted(e), this;
  }
  hasChanged() {
    return this.original !== this.toString();
  }
  replace(e, t) {
    function i(e2, i2) {
      return typeof t == "string" ? t.replace(/\$(\$|&|\d+)/g, (t2, i3) => {
        if (i3 === "$")
          return "$";
        if (i3 === "&")
          return e2[0];
        return +i3 < e2.length ? e2[+i3] : `$${i3}`;
      }) : t(...e2, e2.index, i2, e2.groups);
    }
    if (typeof e != "string" && e.global) {
      (function(e2, t2) {
        let i2;
        const s = [];
        for (; i2 = e2.exec(t2); )
          s.push(i2);
        return s;
      })(e, this.original).forEach((e2) => {
        e2.index != null && this.overwrite(e2.index, e2.index + e2[0].length, i(e2, this.original));
      });
    } else {
      const t2 = this.original.match(e);
      t2 && t2.index != null && this.overwrite(t2.index, t2.index + t2[0].length, i(t2, this.original));
    }
    return this;
  }
}
const E = Object.prototype.hasOwnProperty;
class b2 {
  constructor(e = {}) {
    this.intro = e.intro || "", this.separator = e.separator !== void 0 ? e.separator : "\n", this.sources = [], this.uniqueSources = [], this.uniqueSourceIndexByFilename = {};
  }
  addSource(e) {
    if (e instanceof x)
      return this.addSource({ content: e, filename: e.filename, separator: this.separator });
    if (!p(e) || !e.content)
      throw new Error("bundle.addSource() takes an object with a `content` property, which should be an instance of MagicString, and an optional `filename`");
    if (["filename", "indentExclusionRanges", "separator"].forEach((t) => {
      E.call(e, t) || (e[t] = e.content[t]);
    }), e.separator === void 0 && (e.separator = this.separator), e.filename)
      if (E.call(this.uniqueSourceIndexByFilename, e.filename)) {
        const t = this.uniqueSources[this.uniqueSourceIndexByFilename[e.filename]];
        if (e.content.original !== t.content)
          throw new Error(`Illegal source: same filename (${e.filename}), different contents`);
      } else
        this.uniqueSourceIndexByFilename[e.filename] = this.uniqueSources.length, this.uniqueSources.push({ filename: e.filename, content: e.content.original });
    return this.sources.push(e), this;
  }
  append(e, t) {
    return this.addSource({ content: new x(e), separator: t && t.separator || "" }), this;
  }
  clone() {
    const e = new b2({ intro: this.intro, separator: this.separator });
    return this.sources.forEach((t) => {
      e.addSource({ filename: t.filename, content: t.content.clone(), separator: t.separator });
    }), e;
  }
  generateDecodedMap(e = {}) {
    const t = [];
    this.sources.forEach((e2) => {
      Object.keys(e2.content.storedNames).forEach((e3) => {
        ~t.indexOf(e3) || t.push(e3);
      });
    });
    const i = new m2(e.hires);
    return this.intro && i.advance(this.intro), this.sources.forEach((e2, s) => {
      s > 0 && i.advance(this.separator);
      const n2 = e2.filename ? this.uniqueSourceIndexByFilename[e2.filename] : -1, r2 = e2.content, a3 = f(r2.original);
      r2.intro && i.advance(r2.intro), r2.firstChunk.eachNext((s2) => {
        const o2 = a3(s2.start);
        s2.intro.length && i.advance(s2.intro), e2.filename ? s2.edited ? i.addEdit(n2, s2.content, o2, s2.storeName ? t.indexOf(s2.original) : -1) : i.addUneditedChunk(n2, s2, r2.original, o2, r2.sourcemapLocations) : i.advance(s2.content), s2.outro.length && i.advance(s2.outro);
      }), r2.outro && i.advance(r2.outro);
    }), { file: e.file ? e.file.split(/[/\\]/).pop() : null, sources: this.uniqueSources.map((t2) => e.file ? u(e.file, t2.filename) : t2.filename), sourcesContent: this.uniqueSources.map((t2) => e.includeContent ? t2.content : null), names: t, mappings: i.raw };
  }
  generateMap(e) {
    return new h(this.generateDecodedMap(e));
  }
  getIndentString() {
    const e = {};
    return this.sources.forEach((t) => {
      const i = t.content.indentStr;
      i !== null && (e[i] || (e[i] = 0), e[i] += 1);
    }), Object.keys(e).sort((t, i) => e[t] - e[i])[0] || "	";
  }
  indent(e) {
    if (arguments.length || (e = this.getIndentString()), e === "")
      return this;
    let t = !this.intro || this.intro.slice(-1) === "\n";
    return this.sources.forEach((i, s) => {
      const n2 = i.separator !== void 0 ? i.separator : this.separator, r2 = t || s > 0 && /\r?\n$/.test(n2);
      i.content.indent(e, { exclude: i.indentExclusionRanges, indentStart: r2 }), t = i.content.lastChar() === "\n";
    }), this.intro && (this.intro = e + this.intro.replace(/^[^\n]/gm, (t2, i) => i > 0 ? e + t2 : t2)), this;
  }
  prepend(e) {
    return this.intro = e + this.intro, this;
  }
  toString() {
    const e = this.sources.map((e2, t) => {
      const i = e2.separator !== void 0 ? e2.separator : this.separator;
      return (t > 0 ? i : "") + e2.content.toString();
    }).join("");
    return this.intro + e;
  }
  isEmpty() {
    return (!this.intro.length || !this.intro.trim()) && !this.sources.some((e) => !e.content.isEmpty());
  }
  length() {
    return this.sources.reduce((e, t) => e + t.content.length(), this.intro.length);
  }
  trimLines() {
    return this.trim("[\\r\\n]");
  }
  trim(e) {
    return this.trimStart(e).trimEnd(e);
  }
  trimStart(e) {
    const t = new RegExp("^" + (e || "\\s") + "+");
    if (this.intro = this.intro.replace(t, ""), !this.intro) {
      let t2, i = 0;
      do {
        if (t2 = this.sources[i++], !t2)
          break;
      } while (!t2.content.trimStartAborted(e));
    }
    return this;
  }
  trimEnd(e) {
    const t = new RegExp((e || "\\s") + "+$");
    let i, s = this.sources.length - 1;
    do {
      if (i = this.sources[s--], !i) {
        this.intro = this.intro.replace(t, "");
        break;
      }
    } while (!i.content.trimEndAborted(e));
    return this;
  }
}
const v = /^(?:\/|(?:[A-Za-z]:)?[\\|/])/, S = /^\.?\.\//, A = /\\/g, I = /[/\\]/, k = /\.[^.]+$/;
function P(e) {
  return v.test(e);
}
function w(e) {
  return S.test(e);
}
function C(e) {
  return e.replace(A, "/");
}
function _(e) {
  return e.split(I).pop() || "";
}
function N(e) {
  const t = /[/\\][^/\\]*$/.exec(e);
  if (!t)
    return ".";
  const i = e.slice(0, -t[0].length);
  return i || "/";
}
function $(e) {
  const t = k.exec(_(e));
  return t ? t[0] : "";
}
function T(e, t) {
  const i = e.split(I).filter(Boolean), s = t.split(I).filter(Boolean);
  for (i[0] === "." && i.shift(), s[0] === "." && s.shift(); i[0] && s[0] && i[0] === s[0]; )
    i.shift(), s.shift();
  for (; s[0] === ".." && i.length > 0; )
    s.shift(), i.pop();
  for (; i.pop(); )
    s.unshift("..");
  return s.join("/");
}
function O(...e) {
  const t = e.shift();
  if (!t)
    return "/";
  let i = t.split(I);
  for (const t2 of e)
    if (P(t2))
      i = t2.split(I);
    else {
      const e2 = t2.split(I);
      for (; e2[0] === "." || e2[0] === ".."; ) {
        e2.shift() === ".." && i.pop();
      }
      i.push(...e2);
    }
  return i.join("/");
}
function R(e, t, i) {
  const s = e.get(t);
  if (s)
    return s;
  const n2 = i();
  return e.set(t, n2), n2;
}
const M = Symbol("Unknown Key"), D = Symbol("Unknown Non-Accessor Key"), L = Symbol("Unknown Integer"), V = [], B = [M], F = [D], z = [L], j = Symbol("Entities");
class U {
  constructor() {
    this.entityPaths = Object.create(null, { [j]: { value: /* @__PURE__ */ new Set() } });
  }
  trackEntityAtPathAndGetIfTracked(e, t) {
    const i = this.getEntities(e);
    return !!i.has(t) || (i.add(t), false);
  }
  withTrackedEntityAtPath(e, t, i, s) {
    const n2 = this.getEntities(e);
    if (n2.has(t))
      return s;
    n2.add(t);
    const r2 = i();
    return n2.delete(t), r2;
  }
  getEntities(e) {
    let t = this.entityPaths;
    for (const i of e)
      t = t[i] = t[i] || Object.create(null, { [j]: { value: /* @__PURE__ */ new Set() } });
    return t[j];
  }
}
const G = new U();
class H {
  constructor() {
    this.entityPaths = Object.create(null, { [j]: { value: /* @__PURE__ */ new Map() } });
  }
  trackEntityAtPathAndGetIfTracked(e, t, i) {
    let s = this.entityPaths;
    for (const t2 of e)
      s = s[t2] = s[t2] || Object.create(null, { [j]: { value: /* @__PURE__ */ new Map() } });
    const n2 = R(s[j], t, () => /* @__PURE__ */ new Set());
    return !!n2.has(i) || (n2.add(i), false);
  }
}
const W = Symbol("Unknown Value"), q = Symbol("Unknown Truthy Value");
class K {
  constructor() {
    this.included = false;
  }
  deoptimizePath(e) {
  }
  deoptimizeThisOnInteractionAtPath({ thisArg: e }, t, i) {
    e.deoptimizePath(B);
  }
  getLiteralValueAtPath(e, t, i) {
    return W;
  }
  getReturnExpressionWhenCalledAtPath(e, t, i, s) {
    return X;
  }
  hasEffectsOnInteractionAtPath(e, t, i) {
    return true;
  }
  include(e, t, i) {
    this.included = true;
  }
  includeCallArguments(e, t) {
    for (const i of t)
      i.include(e, false);
  }
  shouldBeIncluded(e) {
    return true;
  }
}
const X = new class extends K {
}(), Y = { thisArg: null, type: 0 }, Q = { args: [X], thisArg: null, type: 1 }, Z = [], J = { args: Z, thisArg: null, type: 2, withNew: false };
class ee extends K {
  constructor(e) {
    super(), this.name = e, this.alwaysRendered = false, this.initReached = false, this.isId = false, this.isReassigned = false, this.kind = null, this.renderBaseName = null, this.renderName = null;
  }
  addReference(e) {
  }
  getBaseVariableName() {
    return this.renderBaseName || this.renderName || this.name;
  }
  getName(e) {
    const t = this.renderName || this.name;
    return this.renderBaseName ? `${this.renderBaseName}${e(t)}` : t;
  }
  hasEffectsOnInteractionAtPath(e, { type: t }, i) {
    return t !== 0 || e.length > 0;
  }
  include() {
    this.included = true;
  }
  markCalledFromTryStatement() {
  }
  setRenderNames(e, t) {
    this.renderBaseName = e, this.renderName = t;
  }
}
class te extends ee {
  constructor(e, t) {
    super(t), this.referenced = false, this.module = e, this.isNamespace = t === "*";
  }
  addReference(e) {
    this.referenced = true, this.name !== "default" && this.name !== "*" || this.module.suggestName(e.name);
  }
  hasEffectsOnInteractionAtPath(e, { type: t }) {
    return t !== 0 || e.length > (this.isNamespace ? 1 : 0);
  }
  include() {
    this.included || (this.included = true, this.module.used = true);
  }
}
const ie = Object.freeze(/* @__PURE__ */ Object.create(null)), se = Object.freeze({}), ne = Object.freeze([]);
function re(e, t, i) {
  if (typeof i == "number")
    throw new Error("locate takes a { startIndex, offsetLine, offsetColumn } object as the third argument");
  return function(e2, t2) {
    t2 === void 0 && (t2 = {});
    var i2 = t2.offsetLine || 0, s = t2.offsetColumn || 0, n2 = e2.split("\n"), r2 = 0, a3 = n2.map(function(e3, t3) {
      var i3 = r2 + e3.length + 1, s2 = { start: r2, end: i3, line: t3 };
      return r2 = i3, s2;
    }), o2 = 0;
    function l2(e3, t3) {
      return e3.start <= t3 && t3 < e3.end;
    }
    function h2(e3, t3) {
      return { line: i2 + e3.line, column: s + t3 - e3.start, character: t3 };
    }
    return function(t3, i3) {
      typeof t3 == "string" && (t3 = e2.indexOf(t3, i3 || 0));
      for (var s2 = a3[o2], n3 = t3 >= s2.end ? 1 : -1; s2; ) {
        if (l2(s2, t3))
          return h2(s2, t3);
        s2 = a3[o2 += n3];
      }
    };
  }(e, i)(t, i && i.startIndex);
}
function ae(e) {
  return e.replace(/^\t+/, (e2) => e2.split("	").join("  "));
}
function oe(e, t) {
  const i = e.length <= 1, s = e.map((e2) => `"${e2}"`);
  let n2 = i ? s[0] : `${s.slice(0, -1).join(", ")} and ${s.slice(-1)[0]}`;
  return t && (n2 += ` ${i ? t[0] : t[1]}`), n2;
}
function le(e) {
  const t = _(e);
  return t.substring(0, t.length - $(e).length);
}
function he(e) {
  return P(e) ? T(O(), e) : e;
}
function ce(e) {
  return e[0] === "/" || e[0] === "." && (e[1] === "/" || e[1] === ".") || P(e);
}
const ue = /^(\.\.\/)*\.\.$/;
function de(e, t, i, s) {
  let n2 = C(T(N(e), t));
  if (i && n2.endsWith(".js") && (n2 = n2.slice(0, -3)), s) {
    if (n2 === "")
      return "../" + _(t);
    if (ue.test(n2))
      return n2.split("/").concat(["..", _(t)]).join("/");
  }
  return n2 ? n2.startsWith("..") ? n2 : "./" + n2 : ".";
}
function pe(e) {
  throw e instanceof Error || (e = Object.assign(new Error(e.message), e)), e;
}
function fe(e, t, i, s) {
  if (typeof t == "object") {
    const { line: i2, column: n2 } = t;
    e.loc = { column: n2, file: s, line: i2 };
  } else {
    e.pos = t;
    const { line: n2, column: r2 } = re(i, t, { offsetLine: 1 });
    e.loc = { column: r2, file: s, line: n2 };
  }
  if (e.frame === void 0) {
    const { line: t2, column: s2 } = e.loc;
    e.frame = function(e2, t3, i2) {
      let s3 = e2.split("\n");
      const n2 = Math.max(0, t3 - 3);
      let r2 = Math.min(t3 + 2, s3.length);
      for (s3 = s3.slice(n2, r2); !/\S/.test(s3[s3.length - 1]); )
        s3.pop(), r2 -= 1;
      const a3 = String(r2).length;
      return s3.map((e3, s4) => {
        const r3 = n2 + s4 + 1 === t3;
        let o2 = String(s4 + n2 + 1);
        for (; o2.length < a3; )
          o2 = ` ${o2}`;
        if (r3) {
          const t4 = function(e4) {
            let t5 = "";
            for (; e4--; )
              t5 += " ";
            return t5;
          }(a3 + 2 + ae(e3.slice(0, i2)).length) + "^";
          return `${o2}: ${ae(e3)}
${t4}`;
        }
        return `${o2}: ${ae(e3)}`;
      }).join("\n");
    }(i, t2, s2);
  }
}
var me;
function ge({ fileName: e, code: t }, i) {
  const s = { code: me.CHUNK_INVALID, message: `Chunk "${e}" is not valid JavaScript: ${i.message}.` };
  return fe(s, i.loc, t, e), s;
}
function ye(e, t, i) {
  return { code: "INVALID_EXPORT_OPTION", message: `"${e}" was specified for "output.exports", but entry module "${he(i)}" has the following exports: ${t.join(", ")}` };
}
function xe(e, t, i, s) {
  return { code: me.INVALID_OPTION, message: `Invalid value ${s !== void 0 ? `${JSON.stringify(s)} ` : ""}for option "${e}" - ${i}.`, url: `https://rollupjs.org/guide/en/#${t}` };
}
function Ee(e, t, i) {
  return { code: me.MISSING_EXPORT, message: `'${e}' is not exported by ${he(i)}, imported by ${he(t)}`, url: "https://rollupjs.org/guide/en/#error-name-is-not-exported-by-module" };
}
function be(e) {
  const t = Array.from(e.implicitlyLoadedBefore, (e2) => he(e2.id)).sort();
  return { code: me.MISSING_IMPLICIT_DEPENDANT, message: `Module "${he(e.id)}" that should be implicitly loaded before ${oe(t)} is not included in the module graph. Either it was not imported by an included module or only via a tree-shaken dynamic import, or no imported bindings were used and it had otherwise no side-effects.` };
}
function ve(e, t, i) {
  const s = i ? "reexport" : "import";
  return { code: me.UNEXPECTED_NAMED_IMPORT, id: e, message: `The named export "${t}" was ${s}ed from the external module ${he(e)} even though its interop type is "defaultOnly". Either remove or change this ${s} or change the value of the "output.interop" option.`, url: "https://rollupjs.org/guide/en/#outputinterop" };
}
function Se(e) {
  return { code: me.UNEXPECTED_NAMED_IMPORT, id: e, message: `There was a namespace "*" reexport from the external module ${he(e)} even though its interop type is "defaultOnly". This will be ignored as namespace reexports only reexport named exports. If this is not intended, either remove or change this reexport or change the value of the "output.interop" option.`, url: "https://rollupjs.org/guide/en/#outputinterop" };
}
function Ae(e) {
  return { code: me.VALIDATION_ERROR, message: e };
}
function Ie() {
  return { code: me.ALREADY_CLOSED, message: 'Bundle is already closed, no more calls to "generate" or "write" are allowed.' };
}
function ke(e, t, i) {
  Pe(e, t, i.onwarn, i.strictDeprecations);
}
function Pe(e, t, i, s) {
  if (t || s) {
    const t2 = function(e2) {
      return __spreadValues({ code: me.DEPRECATED_FEATURE }, typeof e2 == "string" ? { message: e2 } : e2);
    }(e);
    if (s)
      return pe(t2);
    i(t2);
  }
}
!function(e) {
  e.ALREADY_CLOSED = "ALREADY_CLOSED", e.ASSET_NOT_FINALISED = "ASSET_NOT_FINALISED", e.ASSET_NOT_FOUND = "ASSET_NOT_FOUND", e.ASSET_SOURCE_ALREADY_SET = "ASSET_SOURCE_ALREADY_SET", e.ASSET_SOURCE_MISSING = "ASSET_SOURCE_MISSING", e.BAD_LOADER = "BAD_LOADER", e.CANNOT_EMIT_FROM_OPTIONS_HOOK = "CANNOT_EMIT_FROM_OPTIONS_HOOK", e.CHUNK_NOT_GENERATED = "CHUNK_NOT_GENERATED", e.CHUNK_INVALID = "CHUNK_INVALID", e.CIRCULAR_REEXPORT = "CIRCULAR_REEXPORT", e.CYCLIC_CROSS_CHUNK_REEXPORT = "CYCLIC_CROSS_CHUNK_REEXPORT", e.DEPRECATED_FEATURE = "DEPRECATED_FEATURE", e.EXTERNAL_SYNTHETIC_EXPORTS = "EXTERNAL_SYNTHETIC_EXPORTS", e.FILE_NAME_CONFLICT = "FILE_NAME_CONFLICT", e.FILE_NOT_FOUND = "FILE_NOT_FOUND", e.INPUT_HOOK_IN_OUTPUT_PLUGIN = "INPUT_HOOK_IN_OUTPUT_PLUGIN", e.INVALID_CHUNK = "INVALID_CHUNK", e.INVALID_EXPORT_OPTION = "INVALID_EXPORT_OPTION", e.INVALID_EXTERNAL_ID = "INVALID_EXTERNAL_ID", e.INVALID_OPTION = "INVALID_OPTION", e.INVALID_PLUGIN_HOOK = "INVALID_PLUGIN_HOOK", e.INVALID_ROLLUP_PHASE = "INVALID_ROLLUP_PHASE", e.MISSING_EXPORT = "MISSING_EXPORT", e.MISSING_IMPLICIT_DEPENDANT = "MISSING_IMPLICIT_DEPENDANT", e.MIXED_EXPORTS = "MIXED_EXPORTS", e.NAMESPACE_CONFLICT = "NAMESPACE_CONFLICT", e.AMBIGUOUS_EXTERNAL_NAMESPACES = "AMBIGUOUS_EXTERNAL_NAMESPACES", e.NO_TRANSFORM_MAP_OR_AST_WITHOUT_CODE = "NO_TRANSFORM_MAP_OR_AST_WITHOUT_CODE", e.PLUGIN_ERROR = "PLUGIN_ERROR", e.PREFER_NAMED_EXPORTS = "PREFER_NAMED_EXPORTS", e.SYNTHETIC_NAMED_EXPORTS_NEED_NAMESPACE_EXPORT = "SYNTHETIC_NAMED_EXPORTS_NEED_NAMESPACE_EXPORT", e.UNEXPECTED_NAMED_IMPORT = "UNEXPECTED_NAMED_IMPORT", e.UNRESOLVED_ENTRY = "UNRESOLVED_ENTRY", e.UNRESOLVED_IMPORT = "UNRESOLVED_IMPORT", e.VALIDATION_ERROR = "VALIDATION_ERROR";
}(me || (me = {}));
var we = /* @__PURE__ */ new Set(["await", "break", "case", "catch", "class", "const", "continue", "debugger", "default", "delete", "do", "else", "enum", "eval", "export", "extends", "false", "finally", "for", "function", "if", "implements", "import", "in", "instanceof", "interface", "let", "NaN", "new", "null", "package", "private", "protected", "public", "return", "static", "super", "switch", "this", "throw", "true", "try", "typeof", "undefined", "var", "void", "while", "with", "yield"]);
const Ce = /[^$_a-zA-Z0-9]/g, _e = (e) => /\d/.test(e[0]);
function Ne(e) {
  return e = e.replace(/-(\w)/g, (e2, t) => t.toUpperCase()).replace(Ce, "_"), (_e(e) || we.has(e)) && (e = `_${e}`), e || "_";
}
class $e {
  constructor(e, t, i, s, n2) {
    this.options = e, this.id = t, this.renormalizeRenderPath = n2, this.declarations = /* @__PURE__ */ new Map(), this.defaultVariableName = "", this.dynamicImporters = [], this.execIndex = 1 / 0, this.exportedVariables = /* @__PURE__ */ new Map(), this.importers = [], this.mostCommonSuggestion = 0, this.nameSuggestions = /* @__PURE__ */ new Map(), this.namespaceVariableName = "", this.reexported = false, this.renderPath = void 0, this.used = false, this.variableName = "", this.suggestedVariableName = Ne(t.split(/[\\/]/).pop());
    const { importers: r2, dynamicImporters: a3 } = this, o2 = this.info = { ast: null, code: null, dynamicallyImportedIdResolutions: ne, dynamicallyImportedIds: ne, get dynamicImporters() {
      return a3.sort();
    }, hasDefaultExport: null, get hasModuleSideEffects() {
      return ke("Accessing ModuleInfo.hasModuleSideEffects from plugins is deprecated. Please use ModuleInfo.moduleSideEffects instead.", false, e), o2.moduleSideEffects;
    }, id: t, implicitlyLoadedAfterOneOf: ne, implicitlyLoadedBefore: ne, importedIdResolutions: ne, importedIds: ne, get importers() {
      return r2.sort();
    }, isEntry: false, isExternal: true, isIncluded: null, meta: s, moduleSideEffects: i, syntheticNamedExports: false };
    Object.defineProperty(this.info, "hasModuleSideEffects", { enumerable: false });
  }
  getVariableForExportName(e) {
    const t = this.declarations.get(e);
    if (t)
      return [t];
    const i = new te(this, e);
    return this.declarations.set(e, i), this.exportedVariables.set(i, e), [i];
  }
  setRenderPath(e, t) {
    this.renderPath = typeof e.paths == "function" ? e.paths(this.id) : e.paths[this.id], this.renderPath || (this.renderPath = this.renormalizeRenderPath ? C(T(t, this.id)) : this.id);
  }
  suggestName(e) {
    var t;
    const i = ((t = this.nameSuggestions.get(e)) !== null && t !== void 0 ? t : 0) + 1;
    this.nameSuggestions.set(e, i), i > this.mostCommonSuggestion && (this.mostCommonSuggestion = i, this.suggestedVariableName = e);
  }
  warnUnusedImports() {
    const e = Array.from(this.declarations).filter(([e2, t2]) => e2 !== "*" && !t2.included && !this.reexported && !t2.referenced).map(([e2]) => e2);
    if (e.length === 0)
      return;
    const t = /* @__PURE__ */ new Set();
    for (const i2 of e)
      for (const e2 of this.declarations.get(i2).module.importers)
        t.add(e2);
    const i = [...t];
    this.options.onwarn({ code: "UNUSED_EXTERNAL_IMPORT", message: `${oe(e, ["is", "are"])} imported from external module "${this.id}" but never used in ${oe(i.map((e2) => he(e2)))}.`, names: e, source: this.id, sources: i });
  }
}
const Te = { ArrayPattern(e, t) {
  for (const i of t.elements)
    i && Te[i.type](e, i);
}, AssignmentPattern(e, t) {
  Te[t.left.type](e, t.left);
}, Identifier(e, t) {
  e.push(t.name);
}, MemberExpression() {
}, ObjectPattern(e, t) {
  for (const i of t.properties)
    i.type === "RestElement" ? Te.RestElement(e, i) : Te[i.value.type](e, i.value);
}, RestElement(e, t) {
  Te[t.argument.type](e, t.argument);
} }, Oe = function(e) {
  const t = [];
  return Te[e.type](t, e), t;
};
new Set("break case class catch const continue debugger default delete do else export extends finally for function if import in instanceof let new return super switch this throw try typeof var void while with yield enum await implements package protected static interface private public arguments Infinity NaN undefined null true false eval uneval isFinite isNaN parseFloat parseInt decodeURI decodeURIComponent encodeURI encodeURIComponent escape unescape Object Function Boolean Symbol Error EvalError InternalError RangeError ReferenceError SyntaxError TypeError URIError Number Math Date String RegExp Array Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array Float32Array Float64Array Map Set WeakMap WeakSet SIMD ArrayBuffer DataView JSON Promise Generator GeneratorFunction Reflect Proxy Intl".split(" ")).add("");
function Re() {
  return { brokenFlow: 0, includedCallArguments: /* @__PURE__ */ new Set(), includedLabels: /* @__PURE__ */ new Set() };
}
function Me() {
  return { accessed: new U(), assigned: new U(), brokenFlow: 0, called: new H(), ignore: { breaks: false, continues: false, labels: /* @__PURE__ */ new Set(), returnYield: false }, includedLabels: /* @__PURE__ */ new Set(), instantiated: new H(), replacedVariableInits: /* @__PURE__ */ new Map() };
}
function De(e, t = null) {
  return Object.create(t, e);
}
const Le = new class extends K {
  getLiteralValueAtPath() {
  }
}(), Ve = { value: { hasEffectsWhenCalled: null, returns: X } }, Be = new class extends K {
  getReturnExpressionWhenCalledAtPath(e) {
    return e.length === 1 ? Qe(qe, e[0]) : X;
  }
  hasEffectsOnInteractionAtPath(e, t, i) {
    return t.type === 0 ? e.length > 1 : t.type !== 2 || e.length !== 1 || Ye(qe, e[0], t, i);
  }
}(), Fe = { value: { hasEffectsWhenCalled: null, returns: Be } }, ze = new class extends K {
  getReturnExpressionWhenCalledAtPath(e) {
    return e.length === 1 ? Qe(Ke, e[0]) : X;
  }
  hasEffectsOnInteractionAtPath(e, t, i) {
    return t.type === 0 ? e.length > 1 : t.type !== 2 || e.length !== 1 || Ye(Ke, e[0], t, i);
  }
}(), je = { value: { hasEffectsWhenCalled: null, returns: ze } }, Ue = new class extends K {
  getReturnExpressionWhenCalledAtPath(e) {
    return e.length === 1 ? Qe(Xe, e[0]) : X;
  }
  hasEffectsOnInteractionAtPath(e, t, i) {
    return t.type === 0 ? e.length > 1 : t.type !== 2 || e.length !== 1 || Ye(Xe, e[0], t, i);
  }
}(), Ge = { value: { hasEffectsWhenCalled: null, returns: Ue } }, He = { value: { hasEffectsWhenCalled({ args: e }, t) {
  const i = e[1];
  return e.length < 2 || typeof i.getLiteralValueAtPath(V, G, { deoptimizeCache() {
  } }) == "symbol" && i.hasEffectsOnInteractionAtPath(V, J, t);
}, returns: Ue } }, We = De({ hasOwnProperty: Fe, isPrototypeOf: Fe, propertyIsEnumerable: Fe, toLocaleString: Ge, toString: Ge, valueOf: Ve }), qe = De({ valueOf: Fe }, We), Ke = De({ toExponential: Ge, toFixed: Ge, toLocaleString: Ge, toPrecision: Ge, valueOf: je }, We), Xe = De({ anchor: Ge, at: Ve, big: Ge, blink: Ge, bold: Ge, charAt: Ge, charCodeAt: je, codePointAt: Ve, concat: Ge, endsWith: Fe, fixed: Ge, fontcolor: Ge, fontsize: Ge, includes: Fe, indexOf: je, italics: Ge, lastIndexOf: je, link: Ge, localeCompare: je, match: Ve, matchAll: Ve, normalize: Ge, padEnd: Ge, padStart: Ge, repeat: Ge, replace: He, replaceAll: He, search: je, slice: Ge, small: Ge, split: Ve, startsWith: Fe, strike: Ge, sub: Ge, substr: Ge, substring: Ge, sup: Ge, toLocaleLowerCase: Ge, toLocaleUpperCase: Ge, toLowerCase: Ge, toString: Ge, toUpperCase: Ge, trim: Ge, trimEnd: Ge, trimLeft: Ge, trimRight: Ge, trimStart: Ge, valueOf: Ge }, We);
function Ye(e, t, i, s) {
  var n2, r2;
  return typeof t != "string" || !e[t] || (((r2 = (n2 = e[t]).hasEffectsWhenCalled) === null || r2 === void 0 ? void 0 : r2.call(n2, i, s)) || false);
}
function Qe(e, t) {
  return typeof t == "string" && e[t] ? e[t].returns : X;
}
function Ze(e, t, i) {
  i(e, t);
}
function Je(e, t, i) {
}
var et = {};
et.Program = et.BlockStatement = et.StaticBlock = function(e, t, i) {
  for (var s = 0, n2 = e.body; s < n2.length; s += 1) {
    i(n2[s], t, "Statement");
  }
}, et.Statement = Ze, et.EmptyStatement = Je, et.ExpressionStatement = et.ParenthesizedExpression = et.ChainExpression = function(e, t, i) {
  return i(e.expression, t, "Expression");
}, et.IfStatement = function(e, t, i) {
  i(e.test, t, "Expression"), i(e.consequent, t, "Statement"), e.alternate && i(e.alternate, t, "Statement");
}, et.LabeledStatement = function(e, t, i) {
  return i(e.body, t, "Statement");
}, et.BreakStatement = et.ContinueStatement = Je, et.WithStatement = function(e, t, i) {
  i(e.object, t, "Expression"), i(e.body, t, "Statement");
}, et.SwitchStatement = function(e, t, i) {
  i(e.discriminant, t, "Expression");
  for (var s = 0, n2 = e.cases; s < n2.length; s += 1) {
    var r2 = n2[s];
    r2.test && i(r2.test, t, "Expression");
    for (var a3 = 0, o2 = r2.consequent; a3 < o2.length; a3 += 1) {
      i(o2[a3], t, "Statement");
    }
  }
}, et.SwitchCase = function(e, t, i) {
  e.test && i(e.test, t, "Expression");
  for (var s = 0, n2 = e.consequent; s < n2.length; s += 1) {
    i(n2[s], t, "Statement");
  }
}, et.ReturnStatement = et.YieldExpression = et.AwaitExpression = function(e, t, i) {
  e.argument && i(e.argument, t, "Expression");
}, et.ThrowStatement = et.SpreadElement = function(e, t, i) {
  return i(e.argument, t, "Expression");
}, et.TryStatement = function(e, t, i) {
  i(e.block, t, "Statement"), e.handler && i(e.handler, t), e.finalizer && i(e.finalizer, t, "Statement");
}, et.CatchClause = function(e, t, i) {
  e.param && i(e.param, t, "Pattern"), i(e.body, t, "Statement");
}, et.WhileStatement = et.DoWhileStatement = function(e, t, i) {
  i(e.test, t, "Expression"), i(e.body, t, "Statement");
}, et.ForStatement = function(e, t, i) {
  e.init && i(e.init, t, "ForInit"), e.test && i(e.test, t, "Expression"), e.update && i(e.update, t, "Expression"), i(e.body, t, "Statement");
}, et.ForInStatement = et.ForOfStatement = function(e, t, i) {
  i(e.left, t, "ForInit"), i(e.right, t, "Expression"), i(e.body, t, "Statement");
}, et.ForInit = function(e, t, i) {
  e.type === "VariableDeclaration" ? i(e, t) : i(e, t, "Expression");
}, et.DebuggerStatement = Je, et.FunctionDeclaration = function(e, t, i) {
  return i(e, t, "Function");
}, et.VariableDeclaration = function(e, t, i) {
  for (var s = 0, n2 = e.declarations; s < n2.length; s += 1) {
    i(n2[s], t);
  }
}, et.VariableDeclarator = function(e, t, i) {
  i(e.id, t, "Pattern"), e.init && i(e.init, t, "Expression");
}, et.Function = function(e, t, i) {
  e.id && i(e.id, t, "Pattern");
  for (var s = 0, n2 = e.params; s < n2.length; s += 1) {
    i(n2[s], t, "Pattern");
  }
  i(e.body, t, e.expression ? "Expression" : "Statement");
}, et.Pattern = function(e, t, i) {
  e.type === "Identifier" ? i(e, t, "VariablePattern") : e.type === "MemberExpression" ? i(e, t, "MemberPattern") : i(e, t);
}, et.VariablePattern = Je, et.MemberPattern = Ze, et.RestElement = function(e, t, i) {
  return i(e.argument, t, "Pattern");
}, et.ArrayPattern = function(e, t, i) {
  for (var s = 0, n2 = e.elements; s < n2.length; s += 1) {
    var r2 = n2[s];
    r2 && i(r2, t, "Pattern");
  }
}, et.ObjectPattern = function(e, t, i) {
  for (var s = 0, n2 = e.properties; s < n2.length; s += 1) {
    var r2 = n2[s];
    r2.type === "Property" ? (r2.computed && i(r2.key, t, "Expression"), i(r2.value, t, "Pattern")) : r2.type === "RestElement" && i(r2.argument, t, "Pattern");
  }
}, et.Expression = Ze, et.ThisExpression = et.Super = et.MetaProperty = Je, et.ArrayExpression = function(e, t, i) {
  for (var s = 0, n2 = e.elements; s < n2.length; s += 1) {
    var r2 = n2[s];
    r2 && i(r2, t, "Expression");
  }
}, et.ObjectExpression = function(e, t, i) {
  for (var s = 0, n2 = e.properties; s < n2.length; s += 1) {
    i(n2[s], t);
  }
}, et.FunctionExpression = et.ArrowFunctionExpression = et.FunctionDeclaration, et.SequenceExpression = function(e, t, i) {
  for (var s = 0, n2 = e.expressions; s < n2.length; s += 1) {
    i(n2[s], t, "Expression");
  }
}, et.TemplateLiteral = function(e, t, i) {
  for (var s = 0, n2 = e.quasis; s < n2.length; s += 1) {
    i(n2[s], t);
  }
  for (var r2 = 0, a3 = e.expressions; r2 < a3.length; r2 += 1) {
    i(a3[r2], t, "Expression");
  }
}, et.TemplateElement = Je, et.UnaryExpression = et.UpdateExpression = function(e, t, i) {
  i(e.argument, t, "Expression");
}, et.BinaryExpression = et.LogicalExpression = function(e, t, i) {
  i(e.left, t, "Expression"), i(e.right, t, "Expression");
}, et.AssignmentExpression = et.AssignmentPattern = function(e, t, i) {
  i(e.left, t, "Pattern"), i(e.right, t, "Expression");
}, et.ConditionalExpression = function(e, t, i) {
  i(e.test, t, "Expression"), i(e.consequent, t, "Expression"), i(e.alternate, t, "Expression");
}, et.NewExpression = et.CallExpression = function(e, t, i) {
  if (i(e.callee, t, "Expression"), e.arguments)
    for (var s = 0, n2 = e.arguments; s < n2.length; s += 1) {
      i(n2[s], t, "Expression");
    }
}, et.MemberExpression = function(e, t, i) {
  i(e.object, t, "Expression"), e.computed && i(e.property, t, "Expression");
}, et.ExportNamedDeclaration = et.ExportDefaultDeclaration = function(e, t, i) {
  e.declaration && i(e.declaration, t, e.type === "ExportNamedDeclaration" || e.declaration.id ? "Statement" : "Expression"), e.source && i(e.source, t, "Expression");
}, et.ExportAllDeclaration = function(e, t, i) {
  e.exported && i(e.exported, t), i(e.source, t, "Expression");
}, et.ImportDeclaration = function(e, t, i) {
  for (var s = 0, n2 = e.specifiers; s < n2.length; s += 1) {
    i(n2[s], t);
  }
  i(e.source, t, "Expression");
}, et.ImportExpression = function(e, t, i) {
  i(e.source, t, "Expression");
}, et.ImportSpecifier = et.ImportDefaultSpecifier = et.ImportNamespaceSpecifier = et.Identifier = et.PrivateIdentifier = et.Literal = Je, et.TaggedTemplateExpression = function(e, t, i) {
  i(e.tag, t, "Expression"), i(e.quasi, t, "Expression");
}, et.ClassDeclaration = et.ClassExpression = function(e, t, i) {
  return i(e, t, "Class");
}, et.Class = function(e, t, i) {
  e.id && i(e.id, t, "Pattern"), e.superClass && i(e.superClass, t, "Expression"), i(e.body, t);
}, et.ClassBody = function(e, t, i) {
  for (var s = 0, n2 = e.body; s < n2.length; s += 1) {
    i(n2[s], t);
  }
}, et.MethodDefinition = et.PropertyDefinition = et.Property = function(e, t, i) {
  e.computed && i(e.key, t, "Expression"), e.value && i(e.value, t, "Expression");
};
const it = new RegExp("^#[ \\f\\r\\t\\v\\u00a0\\u1680\\u2000-\\u200a\\u2028\\u2029\\u202f\\u205f\\u3000\\ufeff]+sourceMappingURL=.+");
function st(e, t, i = e.type) {
  const { annotations: s } = t;
  let n2 = s[t.annotationIndex];
  for (; n2 && e.start >= n2.end; )
    at(e, n2, t.code), n2 = s[++t.annotationIndex];
  if (n2 && n2.end <= e.end)
    for (et[i](e, t, st); (n2 = s[t.annotationIndex]) && n2.end <= e.end; )
      ++t.annotationIndex, ht(e, n2, false);
}
const nt = /[^\s(]/g, rt = /\S/g;
function at(e, t, i) {
  const s = [];
  let n2;
  if (ot(i.slice(t.end, e.start), nt)) {
    const t2 = e.start;
    for (; ; ) {
      switch (s.push(e), e.type) {
        case "ExpressionStatement":
        case "ChainExpression":
          e = e.expression;
          continue;
        case "SequenceExpression":
          if (ot(i.slice(t2, e.start), rt)) {
            e = e.expressions[0];
            continue;
          }
          n2 = true;
          break;
        case "ConditionalExpression":
          if (ot(i.slice(t2, e.start), rt)) {
            e = e.test;
            continue;
          }
          n2 = true;
          break;
        case "LogicalExpression":
        case "BinaryExpression":
          if (ot(i.slice(t2, e.start), rt)) {
            e = e.left;
            continue;
          }
          n2 = true;
          break;
        case "CallExpression":
        case "NewExpression":
          break;
        default:
          n2 = true;
      }
      break;
    }
  } else
    n2 = true;
  if (n2)
    ht(e, t, false);
  else
    for (const e2 of s)
      ht(e2, t, true);
}
function ot(e, t) {
  let i;
  for (; (i = t.exec(e)) !== null; ) {
    if (i[0] === "/") {
      const i2 = e.charCodeAt(t.lastIndex);
      if (i2 === 42) {
        t.lastIndex = e.indexOf("*/", t.lastIndex + 1) + 2;
        continue;
      }
      if (i2 === 47) {
        t.lastIndex = e.indexOf("\n", t.lastIndex + 1) + 1;
        continue;
      }
    }
    return t.lastIndex = 0, false;
  }
  return true;
}
const lt = /[@#]__PURE__/;
function ht(e, t, i) {
  const s = i ? "_rollupAnnotations" : "_rollupRemoved", n2 = e[s];
  n2 ? n2.push(t) : e[s] = [t];
}
const ct = { Literal: [], Program: ["body"] };
class ut extends K {
  constructor(e, t, i) {
    super(), this.deoptimized = false, this.esTreeNode = e, this.keys = ct[e.type] || function(e2) {
      return ct[e2.type] = Object.keys(e2).filter((t2) => typeof e2[t2] == "object" && t2.charCodeAt(0) !== 95), ct[e2.type];
    }(e), this.parent = t, this.context = t.context, this.createScope(i), this.parseNode(e), this.initialise(), this.context.magicString.addSourcemapLocation(this.start), this.context.magicString.addSourcemapLocation(this.end);
  }
  addExportedVariables(e, t) {
  }
  bind() {
    for (const e of this.keys) {
      const t = this[e];
      if (t !== null)
        if (Array.isArray(t))
          for (const e2 of t)
            e2 == null || e2.bind();
        else
          t.bind();
    }
  }
  createScope(e) {
    this.scope = e;
  }
  hasEffects(e) {
    this.deoptimized || this.applyDeoptimizations();
    for (const t of this.keys) {
      const i = this[t];
      if (i !== null) {
        if (Array.isArray(i)) {
          for (const t2 of i)
            if (t2 == null ? void 0 : t2.hasEffects(e))
              return true;
        } else if (i.hasEffects(e))
          return true;
      }
    }
    return false;
  }
  hasEffectsAsAssignmentTarget(e, t) {
    return this.hasEffects(e) || this.hasEffectsOnInteractionAtPath(V, this.assignmentInteraction, e);
  }
  include(e, t, i) {
    this.deoptimized || this.applyDeoptimizations(), this.included = true;
    for (const i2 of this.keys) {
      const s = this[i2];
      if (s !== null)
        if (Array.isArray(s))
          for (const i3 of s)
            i3 == null || i3.include(e, t);
        else
          s.include(e, t);
    }
  }
  includeAsAssignmentTarget(e, t, i) {
    this.include(e, t);
  }
  initialise() {
  }
  insertSemicolon(e) {
    e.original[this.end - 1] !== ";" && e.appendLeft(this.end, ";");
  }
  parseNode(e) {
    for (const [t, i] of Object.entries(e))
      if (!this.hasOwnProperty(t))
        if (t.charCodeAt(0) === 95) {
          if (t === "_rollupAnnotations")
            this.annotations = i;
          else if (t === "_rollupRemoved")
            for (const { start: e2, end: t2 } of i)
              this.context.magicString.remove(e2, t2);
        } else if (typeof i != "object" || i === null)
          this[t] = i;
        else if (Array.isArray(i)) {
          this[t] = [];
          for (const e2 of i)
            this[t].push(e2 === null ? null : new (this.context.getNodeConstructor(e2.type))(e2, this, this.scope));
        } else
          this[t] = new (this.context.getNodeConstructor(i.type))(i, this, this.scope);
  }
  render(e, t) {
    for (const i of this.keys) {
      const s = this[i];
      if (s !== null)
        if (Array.isArray(s))
          for (const i2 of s)
            i2 == null || i2.render(e, t);
        else
          s.render(e, t);
    }
  }
  setAssignedValue(e) {
    this.assignmentInteraction = { args: [e], thisArg: null, type: 1 };
  }
  shouldBeIncluded(e) {
    return this.included || !e.brokenFlow && this.hasEffects(Me());
  }
  applyDeoptimizations() {
    this.deoptimized = true;
    for (const e of this.keys) {
      const t = this[e];
      if (t !== null)
        if (Array.isArray(t))
          for (const e2 of t)
            e2 == null || e2.deoptimizePath(B);
        else
          t.deoptimizePath(B);
    }
    this.context.requestTreeshakingPass();
  }
}
class dt extends ut {
  deoptimizeThisOnInteractionAtPath(e, t, i) {
    t.length > 0 && this.argument.deoptimizeThisOnInteractionAtPath(e, [M, ...t], i);
  }
  hasEffects(e) {
    this.deoptimized || this.applyDeoptimizations();
    const { propertyReadSideEffects: t } = this.context.options.treeshake;
    return this.argument.hasEffects(e) || t && (t === "always" || this.argument.hasEffectsOnInteractionAtPath(B, Y, e));
  }
  applyDeoptimizations() {
    this.deoptimized = true, this.argument.deoptimizePath([M, M]), this.context.requestTreeshakingPass();
  }
}
class pt extends K {
  constructor(e) {
    super(), this.description = e;
  }
  deoptimizeThisOnInteractionAtPath({ type: e, thisArg: t }, i) {
    e === 2 && i.length === 0 && this.description.mutatesSelfAsArray && t.deoptimizePath(z);
  }
  getReturnExpressionWhenCalledAtPath(e, { thisArg: t }) {
    return e.length > 0 ? X : this.description.returnsPrimitive || (this.description.returns === "self" ? t || X : this.description.returns());
  }
  hasEffectsOnInteractionAtPath(e, t, i) {
    var s, n2;
    const { type: r2 } = t;
    if (e.length > (r2 === 0 ? 1 : 0))
      return true;
    if (r2 === 2) {
      if (this.description.mutatesSelfAsArray === true && ((s = t.thisArg) === null || s === void 0 ? void 0 : s.hasEffectsOnInteractionAtPath(z, Q, i)))
        return true;
      if (this.description.callsArgs) {
        for (const e2 of this.description.callsArgs)
          if ((n2 = t.args[e2]) === null || n2 === void 0 ? void 0 : n2.hasEffectsOnInteractionAtPath(V, J, i))
            return true;
      }
    }
    return false;
  }
}
const ft = [new pt({ callsArgs: null, mutatesSelfAsArray: false, returns: null, returnsPrimitive: Be })], mt = [new pt({ callsArgs: null, mutatesSelfAsArray: false, returns: null, returnsPrimitive: Ue })], gt = [new pt({ callsArgs: null, mutatesSelfAsArray: false, returns: null, returnsPrimitive: ze })], yt = [new pt({ callsArgs: null, mutatesSelfAsArray: false, returns: null, returnsPrimitive: X })], xt = /^\d+$/;
class Et extends K {
  constructor(e, t, i = false) {
    if (super(), this.prototypeExpression = t, this.immutable = i, this.allProperties = [], this.deoptimizedPaths = /* @__PURE__ */ Object.create(null), this.expressionsToBeDeoptimizedByKey = /* @__PURE__ */ Object.create(null), this.gettersByKey = /* @__PURE__ */ Object.create(null), this.hasLostTrack = false, this.hasUnknownDeoptimizedInteger = false, this.hasUnknownDeoptimizedProperty = false, this.propertiesAndGettersByKey = /* @__PURE__ */ Object.create(null), this.propertiesAndSettersByKey = /* @__PURE__ */ Object.create(null), this.settersByKey = /* @__PURE__ */ Object.create(null), this.thisParametersToBeDeoptimized = /* @__PURE__ */ new Set(), this.unknownIntegerProps = [], this.unmatchableGetters = [], this.unmatchablePropertiesAndGetters = [], this.unmatchableSetters = [], Array.isArray(e))
      this.buildPropertyMaps(e);
    else {
      this.propertiesAndGettersByKey = this.propertiesAndSettersByKey = e;
      for (const t2 of Object.values(e))
        this.allProperties.push(...t2);
    }
  }
  deoptimizeAllProperties(e) {
    var t;
    const i = this.hasLostTrack || this.hasUnknownDeoptimizedProperty;
    if (e ? this.hasUnknownDeoptimizedProperty = true : this.hasLostTrack = true, !i) {
      for (const e2 of Object.values(this.propertiesAndGettersByKey).concat(Object.values(this.settersByKey)))
        for (const t2 of e2)
          t2.deoptimizePath(B);
      (t = this.prototypeExpression) === null || t === void 0 || t.deoptimizePath([M, M]), this.deoptimizeCachedEntities();
    }
  }
  deoptimizeIntegerProperties() {
    if (!(this.hasLostTrack || this.hasUnknownDeoptimizedProperty || this.hasUnknownDeoptimizedInteger)) {
      this.hasUnknownDeoptimizedInteger = true;
      for (const [e, t] of Object.entries(this.propertiesAndGettersByKey))
        if (xt.test(e))
          for (const e2 of t)
            e2.deoptimizePath(B);
      this.deoptimizeCachedIntegerEntities();
    }
  }
  deoptimizePath(e) {
    var t;
    if (this.hasLostTrack || this.immutable)
      return;
    const i = e[0];
    if (e.length === 1) {
      if (typeof i != "string")
        return i === L ? this.deoptimizeIntegerProperties() : this.deoptimizeAllProperties(i === D);
      if (!this.deoptimizedPaths[i]) {
        this.deoptimizedPaths[i] = true;
        const e2 = this.expressionsToBeDeoptimizedByKey[i];
        if (e2)
          for (const t2 of e2)
            t2.deoptimizeCache();
      }
    }
    const s = e.length === 1 ? B : e.slice(1);
    for (const e2 of typeof i == "string" ? (this.propertiesAndGettersByKey[i] || this.unmatchablePropertiesAndGetters).concat(this.settersByKey[i] || this.unmatchableSetters) : this.allProperties)
      e2.deoptimizePath(s);
    (t = this.prototypeExpression) === null || t === void 0 || t.deoptimizePath(e.length === 1 ? [...e, M] : e);
  }
  deoptimizeThisOnInteractionAtPath(e, t, i) {
    var s;
    const [n2, ...r2] = t;
    if (this.hasLostTrack || (e.type === 2 || t.length > 1) && (this.hasUnknownDeoptimizedProperty || typeof n2 == "string" && this.deoptimizedPaths[n2]))
      return void e.thisArg.deoptimizePath(B);
    const [a3, o2, l2] = e.type === 2 || t.length > 1 ? [this.propertiesAndGettersByKey, this.propertiesAndGettersByKey, this.unmatchablePropertiesAndGetters] : e.type === 0 ? [this.propertiesAndGettersByKey, this.gettersByKey, this.unmatchableGetters] : [this.propertiesAndSettersByKey, this.settersByKey, this.unmatchableSetters];
    if (typeof n2 == "string") {
      if (a3[n2]) {
        const t2 = o2[n2];
        if (t2)
          for (const s2 of t2)
            s2.deoptimizeThisOnInteractionAtPath(e, r2, i);
        return void (this.immutable || this.thisParametersToBeDeoptimized.add(e.thisArg));
      }
      for (const t2 of l2)
        t2.deoptimizeThisOnInteractionAtPath(e, r2, i);
      if (xt.test(n2))
        for (const t2 of this.unknownIntegerProps)
          t2.deoptimizeThisOnInteractionAtPath(e, r2, i);
    } else {
      for (const t2 of Object.values(o2).concat([l2]))
        for (const s2 of t2)
          s2.deoptimizeThisOnInteractionAtPath(e, r2, i);
      for (const t2 of this.unknownIntegerProps)
        t2.deoptimizeThisOnInteractionAtPath(e, r2, i);
    }
    this.immutable || this.thisParametersToBeDeoptimized.add(e.thisArg), (s = this.prototypeExpression) === null || s === void 0 || s.deoptimizeThisOnInteractionAtPath(e, t, i);
  }
  getLiteralValueAtPath(e, t, i) {
    if (e.length === 0)
      return q;
    const s = e[0], n2 = this.getMemberExpressionAndTrackDeopt(s, i);
    return n2 ? n2.getLiteralValueAtPath(e.slice(1), t, i) : this.prototypeExpression ? this.prototypeExpression.getLiteralValueAtPath(e, t, i) : e.length !== 1 ? W : void 0;
  }
  getReturnExpressionWhenCalledAtPath(e, t, i, s) {
    if (e.length === 0)
      return X;
    const [n2, ...r2] = e, a3 = this.getMemberExpressionAndTrackDeopt(n2, s);
    return a3 ? a3.getReturnExpressionWhenCalledAtPath(r2, t, i, s) : this.prototypeExpression ? this.prototypeExpression.getReturnExpressionWhenCalledAtPath(e, t, i, s) : X;
  }
  hasEffectsOnInteractionAtPath(e, t, i) {
    const [s, ...n2] = e;
    if (n2.length || t.type === 2) {
      const r3 = this.getMemberExpression(s);
      return r3 ? r3.hasEffectsOnInteractionAtPath(n2, t, i) : !this.prototypeExpression || this.prototypeExpression.hasEffectsOnInteractionAtPath(e, t, i);
    }
    if (s === D)
      return false;
    if (this.hasLostTrack)
      return true;
    const [r2, a3, o2] = t.type === 0 ? [this.propertiesAndGettersByKey, this.gettersByKey, this.unmatchableGetters] : [this.propertiesAndSettersByKey, this.settersByKey, this.unmatchableSetters];
    if (typeof s == "string") {
      if (r2[s]) {
        const e2 = a3[s];
        if (e2) {
          for (const s2 of e2)
            if (s2.hasEffectsOnInteractionAtPath(n2, t, i))
              return true;
        }
        return false;
      }
      for (const e2 of o2)
        if (e2.hasEffectsOnInteractionAtPath(n2, t, i))
          return true;
    } else
      for (const e2 of Object.values(a3).concat([o2]))
        for (const s2 of e2)
          if (s2.hasEffectsOnInteractionAtPath(n2, t, i))
            return true;
    return !!this.prototypeExpression && this.prototypeExpression.hasEffectsOnInteractionAtPath(e, t, i);
  }
  buildPropertyMaps(e) {
    const { allProperties: t, propertiesAndGettersByKey: i, propertiesAndSettersByKey: s, settersByKey: n2, gettersByKey: r2, unknownIntegerProps: a3, unmatchablePropertiesAndGetters: o2, unmatchableGetters: l2, unmatchableSetters: h2 } = this, c2 = [];
    for (let u2 = e.length - 1; u2 >= 0; u2--) {
      const { key: d2, kind: p2, property: f2 } = e[u2];
      if (t.push(f2), typeof d2 != "string") {
        if (d2 === L) {
          a3.push(f2);
          continue;
        }
        p2 === "set" && h2.push(f2), p2 === "get" && l2.push(f2), p2 !== "get" && c2.push(f2), p2 !== "set" && o2.push(f2);
      } else
        p2 === "set" ? s[d2] || (s[d2] = [f2, ...c2], n2[d2] = [f2, ...h2]) : p2 === "get" ? i[d2] || (i[d2] = [f2, ...o2], r2[d2] = [f2, ...l2]) : (s[d2] || (s[d2] = [f2, ...c2]), i[d2] || (i[d2] = [f2, ...o2]));
    }
  }
  deoptimizeCachedEntities() {
    for (const e of Object.values(this.expressionsToBeDeoptimizedByKey))
      for (const t of e)
        t.deoptimizeCache();
    for (const e of this.thisParametersToBeDeoptimized)
      e.deoptimizePath(B);
  }
  deoptimizeCachedIntegerEntities() {
    for (const [e, t] of Object.entries(this.expressionsToBeDeoptimizedByKey))
      if (xt.test(e))
        for (const e2 of t)
          e2.deoptimizeCache();
    for (const e of this.thisParametersToBeDeoptimized)
      e.deoptimizePath(z);
  }
  getMemberExpression(e) {
    if (this.hasLostTrack || this.hasUnknownDeoptimizedProperty || typeof e != "string" || this.hasUnknownDeoptimizedInteger && xt.test(e) || this.deoptimizedPaths[e])
      return X;
    const t = this.propertiesAndGettersByKey[e];
    return (t == null ? void 0 : t.length) === 1 ? t[0] : t || this.unmatchablePropertiesAndGetters.length > 0 || this.unknownIntegerProps.length && xt.test(e) ? X : null;
  }
  getMemberExpressionAndTrackDeopt(e, t) {
    if (typeof e != "string")
      return X;
    const i = this.getMemberExpression(e);
    if (i !== X && !this.immutable) {
      (this.expressionsToBeDeoptimizedByKey[e] = this.expressionsToBeDeoptimizedByKey[e] || []).push(t);
    }
    return i;
  }
}
const bt = (e) => typeof e == "string" && /^\d+$/.test(e), vt = new class extends K {
  deoptimizeThisOnInteractionAtPath({ type: e, thisArg: t }, i) {
    e !== 2 || i.length !== 1 || bt(i[0]) || t.deoptimizePath(B);
  }
  getLiteralValueAtPath(e) {
    return e.length === 1 && bt(e[0]) ? void 0 : W;
  }
  hasEffectsOnInteractionAtPath(e, { type: t }) {
    return e.length > 1 || t === 2;
  }
}(), St = new Et({ __proto__: null, hasOwnProperty: ft, isPrototypeOf: ft, propertyIsEnumerable: ft, toLocaleString: mt, toString: mt, valueOf: yt }, vt, true), At = [{ key: L, kind: "init", property: X }, { key: "length", kind: "init", property: ze }], It = [new pt({ callsArgs: [0], mutatesSelfAsArray: "deopt-only", returns: null, returnsPrimitive: Be })], kt = [new pt({ callsArgs: [0], mutatesSelfAsArray: "deopt-only", returns: null, returnsPrimitive: ze })], Pt = [new pt({ callsArgs: null, mutatesSelfAsArray: true, returns: () => new Et(At, Mt), returnsPrimitive: null })], wt = [new pt({ callsArgs: null, mutatesSelfAsArray: "deopt-only", returns: () => new Et(At, Mt), returnsPrimitive: null })], Ct = [new pt({ callsArgs: [0], mutatesSelfAsArray: "deopt-only", returns: () => new Et(At, Mt), returnsPrimitive: null })], _t = [new pt({ callsArgs: null, mutatesSelfAsArray: true, returns: null, returnsPrimitive: ze })], Nt = [new pt({ callsArgs: null, mutatesSelfAsArray: true, returns: null, returnsPrimitive: X })], $t = [new pt({ callsArgs: null, mutatesSelfAsArray: "deopt-only", returns: null, returnsPrimitive: X })], Tt = [new pt({ callsArgs: [0], mutatesSelfAsArray: "deopt-only", returns: null, returnsPrimitive: X })], Ot = [new pt({ callsArgs: null, mutatesSelfAsArray: true, returns: "self", returnsPrimitive: null })], Rt = [new pt({ callsArgs: [0], mutatesSelfAsArray: true, returns: "self", returnsPrimitive: null })], Mt = new Et({ __proto__: null, at: $t, concat: wt, copyWithin: Ot, entries: wt, every: It, fill: Ot, filter: Ct, find: Tt, findIndex: kt, findLast: Tt, findLastIndex: kt, flat: wt, flatMap: Ct, forEach: Tt, groupBy: Tt, groupByToMap: Tt, includes: ft, indexOf: gt, join: mt, keys: yt, lastIndexOf: gt, map: Ct, pop: Nt, push: _t, reduce: Tt, reduceRight: Tt, reverse: Ot, shift: Nt, slice: wt, some: It, sort: Rt, splice: Pt, toLocaleString: mt, toString: mt, unshift: _t, values: $t }, St, true);
class Dt extends ee {
  constructor(e, t, i, s) {
    super(e), this.calledFromTryStatement = false, this.additionalInitializers = null, this.expressionsToBeDeoptimized = [], this.declarations = t ? [t] : [], this.init = i, this.deoptimizationTracker = s.deoptimizationTracker, this.module = s.module;
  }
  addDeclaration(e, t) {
    this.declarations.push(e);
    const i = this.markInitializersForDeoptimization();
    t !== null && i.push(t);
  }
  consolidateInitializers() {
    if (this.additionalInitializers !== null) {
      for (const e of this.additionalInitializers)
        e.deoptimizePath(B);
      this.additionalInitializers = null;
    }
  }
  deoptimizePath(e) {
    var t, i;
    if (!this.isReassigned && !this.deoptimizationTracker.trackEntityAtPathAndGetIfTracked(e, this))
      if (e.length === 0) {
        if (!this.isReassigned) {
          this.isReassigned = true;
          const e2 = this.expressionsToBeDeoptimized;
          this.expressionsToBeDeoptimized = [];
          for (const t2 of e2)
            t2.deoptimizeCache();
          (t = this.init) === null || t === void 0 || t.deoptimizePath(B);
        }
      } else
        (i = this.init) === null || i === void 0 || i.deoptimizePath(e);
  }
  deoptimizeThisOnInteractionAtPath(e, t, i) {
    if (this.isReassigned || !this.init)
      return e.thisArg.deoptimizePath(B);
    i.withTrackedEntityAtPath(t, this.init, () => this.init.deoptimizeThisOnInteractionAtPath(e, t, i), void 0);
  }
  getLiteralValueAtPath(e, t, i) {
    return this.isReassigned || !this.init ? W : t.withTrackedEntityAtPath(e, this.init, () => (this.expressionsToBeDeoptimized.push(i), this.init.getLiteralValueAtPath(e, t, i)), W);
  }
  getReturnExpressionWhenCalledAtPath(e, t, i, s) {
    return this.isReassigned || !this.init ? X : i.withTrackedEntityAtPath(e, this.init, () => (this.expressionsToBeDeoptimized.push(s), this.init.getReturnExpressionWhenCalledAtPath(e, t, i, s)), X);
  }
  hasEffectsOnInteractionAtPath(e, t, i) {
    switch (t.type) {
      case 0:
        return !!this.isReassigned || this.init && !i.accessed.trackEntityAtPathAndGetIfTracked(e, this) && this.init.hasEffectsOnInteractionAtPath(e, t, i);
      case 1:
        return !!this.included || e.length !== 0 && (!!this.isReassigned || this.init && !i.assigned.trackEntityAtPathAndGetIfTracked(e, this) && this.init.hasEffectsOnInteractionAtPath(e, t, i));
      case 2:
        return !!this.isReassigned || this.init && !(t.withNew ? i.instantiated : i.called).trackEntityAtPathAndGetIfTracked(e, t.args, this) && this.init.hasEffectsOnInteractionAtPath(e, t, i);
    }
  }
  include() {
    if (!this.included) {
      this.included = true;
      for (const e of this.declarations) {
        e.included || e.include(Re(), false);
        let t = e.parent;
        for (; !t.included && (t.included = true, t.type !== "Program"); )
          t = t.parent;
      }
    }
  }
  includeCallArguments(e, t) {
    if (this.isReassigned || this.init && e.includedCallArguments.has(this.init))
      for (const i of t)
        i.include(e, false);
    else
      this.init && (e.includedCallArguments.add(this.init), this.init.includeCallArguments(e, t), e.includedCallArguments.delete(this.init));
  }
  markCalledFromTryStatement() {
    this.calledFromTryStatement = true;
  }
  markInitializersForDeoptimization() {
    return this.additionalInitializers === null && (this.additionalInitializers = this.init === null ? [] : [this.init], this.init = X, this.isReassigned = true), this.additionalInitializers;
  }
}
function Lt(e) {
  let t = "";
  do {
    const i = e % 64;
    e = Math.floor(e / 64), t = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$"[i] + t;
  } while (e !== 0);
  return t;
}
function Vt(e, t) {
  let i = e, s = 1;
  for (; t.has(i) || we.has(i); )
    i = `${e}$${Lt(s++)}`;
  return t.add(i), i;
}
class Bt {
  constructor() {
    this.children = [], this.variables = /* @__PURE__ */ new Map();
  }
  addDeclaration(e, t, i, s) {
    const n2 = e.name;
    let r2 = this.variables.get(n2);
    return r2 ? r2.addDeclaration(e, i) : (r2 = new Dt(e.name, e, i || Le, t), this.variables.set(n2, r2)), r2;
  }
  contains(e) {
    return this.variables.has(e);
  }
  findVariable(e) {
    throw new Error("Internal Error: findVariable needs to be implemented by a subclass");
  }
}
class Ft extends Bt {
  constructor(e) {
    super(), this.accessedOutsideVariables = /* @__PURE__ */ new Map(), this.parent = e, e.children.push(this);
  }
  addAccessedDynamicImport(e) {
    (this.accessedDynamicImports || (this.accessedDynamicImports = /* @__PURE__ */ new Set())).add(e), this.parent instanceof Ft && this.parent.addAccessedDynamicImport(e);
  }
  addAccessedGlobals(e, t) {
    const i = t.get(this) || /* @__PURE__ */ new Set();
    for (const t2 of e)
      i.add(t2);
    t.set(this, i), this.parent instanceof Ft && this.parent.addAccessedGlobals(e, t);
  }
  addNamespaceMemberAccess(e, t) {
    this.accessedOutsideVariables.set(e, t), this.parent.addNamespaceMemberAccess(e, t);
  }
  addReturnExpression(e) {
    this.parent instanceof Ft && this.parent.addReturnExpression(e);
  }
  addUsedOutsideNames(e, t, i, s) {
    for (const s2 of this.accessedOutsideVariables.values())
      s2.included && (e.add(s2.getBaseVariableName()), t === "system" && i.has(s2) && e.add("exports"));
    const n2 = s.get(this);
    if (n2)
      for (const t2 of n2)
        e.add(t2);
  }
  contains(e) {
    return this.variables.has(e) || this.parent.contains(e);
  }
  deconflict(e, t, i) {
    const s = /* @__PURE__ */ new Set();
    if (this.addUsedOutsideNames(s, e, t, i), this.accessedDynamicImports)
      for (const e2 of this.accessedDynamicImports)
        e2.inlineNamespace && s.add(e2.inlineNamespace.getBaseVariableName());
    for (const [e2, t2] of this.variables)
      (t2.included || t2.alwaysRendered) && t2.setRenderNames(null, Vt(e2, s));
    for (const s2 of this.children)
      s2.deconflict(e, t, i);
  }
  findLexicalBoundary() {
    return this.parent.findLexicalBoundary();
  }
  findVariable(e) {
    const t = this.variables.get(e) || this.accessedOutsideVariables.get(e);
    if (t)
      return t;
    const i = this.parent.findVariable(e);
    return this.accessedOutsideVariables.set(e, i), i;
  }
}
class zt extends Ft {
  constructor(e, t) {
    super(e), this.parameters = [], this.hasRest = false, this.context = t, this.hoistedBodyVarScope = new Ft(this);
  }
  addParameterDeclaration(e) {
    const t = e.name;
    let i = this.hoistedBodyVarScope.variables.get(t);
    return i ? i.addDeclaration(e, null) : i = new Dt(t, e, X, this.context), this.variables.set(t, i), i;
  }
  addParameterVariables(e, t) {
    this.parameters = e;
    for (const t2 of e)
      for (const e2 of t2)
        e2.alwaysRendered = true;
    this.hasRest = t;
  }
  includeCallArguments(e, t) {
    let i = false, s = false;
    const n2 = this.hasRest && this.parameters[this.parameters.length - 1];
    for (const i2 of t)
      if (i2 instanceof dt) {
        for (const i3 of t)
          i3.include(e, false);
        break;
      }
    for (let r2 = t.length - 1; r2 >= 0; r2--) {
      const a3 = this.parameters[r2] || n2, o2 = t[r2];
      if (a3)
        if (i = false, a3.length === 0)
          s = true;
        else
          for (const e2 of a3)
            e2.included && (s = true), e2.calledFromTryStatement && (i = true);
      !s && o2.shouldBeIncluded(e) && (s = true), s && o2.include(e, i);
    }
  }
}
class jt extends zt {
  constructor() {
    super(...arguments), this.returnExpression = null, this.returnExpressions = [];
  }
  addReturnExpression(e) {
    this.returnExpressions.push(e);
  }
  getReturnExpression() {
    return this.returnExpression === null && this.updateReturnExpression(), this.returnExpression;
  }
  updateReturnExpression() {
    if (this.returnExpressions.length === 1)
      this.returnExpression = this.returnExpressions[0];
    else {
      this.returnExpression = X;
      for (const e of this.returnExpressions)
        e.deoptimizePath(B);
    }
  }
}
function Ut(e, t) {
  if (e.type === "MemberExpression")
    return !e.computed && Ut(e.object, e);
  if (e.type === "Identifier") {
    if (!t)
      return true;
    switch (t.type) {
      case "MemberExpression":
        return t.computed || e === t.object;
      case "MethodDefinition":
        return t.computed;
      case "PropertyDefinition":
      case "Property":
        return t.computed || e === t.value;
      case "ExportSpecifier":
      case "ImportSpecifier":
        return e === t.local;
      case "LabeledStatement":
      case "BreakStatement":
      case "ContinueStatement":
        return false;
      default:
        return true;
    }
  }
  return false;
}
const Gt = Symbol("Value Properties"), Ht = { hasEffectsWhenCalled: () => false }, Wt = { hasEffectsWhenCalled: () => true }, qt = { __proto__: null, [Gt]: Wt }, Kt = { __proto__: null, [Gt]: Ht }, Xt = { __proto__: null, [Gt]: { hasEffectsWhenCalled: ({ args: e }, t) => !e.length || e[0].hasEffectsOnInteractionAtPath(F, Q, t) } }, Yt = { __proto__: null, [Gt]: Wt, prototype: qt }, Qt = { __proto__: null, [Gt]: Ht, prototype: qt }, Zt = { __proto__: null, [Gt]: Ht, from: Kt, of: Kt, prototype: qt }, Jt = { __proto__: null, [Gt]: Ht, supportedLocalesOf: Qt }, ei = { global: qt, globalThis: qt, self: qt, window: qt, __proto__: null, [Gt]: Wt, Array: { __proto__: null, [Gt]: Wt, from: qt, isArray: Kt, of: Kt, prototype: qt }, ArrayBuffer: { __proto__: null, [Gt]: Ht, isView: Kt, prototype: qt }, Atomics: qt, BigInt: Yt, BigInt64Array: Yt, BigUint64Array: Yt, Boolean: Qt, constructor: Yt, DataView: Qt, Date: { __proto__: null, [Gt]: Ht, now: Kt, parse: Kt, prototype: qt, UTC: Kt }, decodeURI: Kt, decodeURIComponent: Kt, encodeURI: Kt, encodeURIComponent: Kt, Error: Qt, escape: Kt, eval: qt, EvalError: Qt, Float32Array: Zt, Float64Array: Zt, Function: Yt, hasOwnProperty: qt, Infinity: qt, Int16Array: Zt, Int32Array: Zt, Int8Array: Zt, isFinite: Kt, isNaN: Kt, isPrototypeOf: qt, JSON: qt, Map: Qt, Math: { __proto__: null, [Gt]: Wt, abs: Kt, acos: Kt, acosh: Kt, asin: Kt, asinh: Kt, atan: Kt, atan2: Kt, atanh: Kt, cbrt: Kt, ceil: Kt, clz32: Kt, cos: Kt, cosh: Kt, exp: Kt, expm1: Kt, floor: Kt, fround: Kt, hypot: Kt, imul: Kt, log: Kt, log10: Kt, log1p: Kt, log2: Kt, max: Kt, min: Kt, pow: Kt, random: Kt, round: Kt, sign: Kt, sin: Kt, sinh: Kt, sqrt: Kt, tan: Kt, tanh: Kt, trunc: Kt }, NaN: qt, Number: { __proto__: null, [Gt]: Ht, isFinite: Kt, isInteger: Kt, isNaN: Kt, isSafeInteger: Kt, parseFloat: Kt, parseInt: Kt, prototype: qt }, Object: { __proto__: null, [Gt]: Ht, create: Kt, defineProperty: Xt, defineProperties: Xt, getOwnPropertyDescriptor: Kt, getOwnPropertyNames: Kt, getOwnPropertySymbols: Kt, getPrototypeOf: Kt, hasOwn: Kt, is: Kt, isExtensible: Kt, isFrozen: Kt, isSealed: Kt, keys: Kt, fromEntries: Kt, entries: Kt, prototype: qt }, parseFloat: Kt, parseInt: Kt, Promise: { __proto__: null, [Gt]: Wt, all: qt, prototype: qt, race: qt, reject: qt, resolve: qt }, propertyIsEnumerable: qt, Proxy: qt, RangeError: Qt, ReferenceError: Qt, Reflect: qt, RegExp: Qt, Set: Qt, SharedArrayBuffer: Yt, String: { __proto__: null, [Gt]: Ht, fromCharCode: Kt, fromCodePoint: Kt, prototype: qt, raw: Kt }, Symbol: { __proto__: null, [Gt]: Ht, for: Kt, keyFor: Kt, prototype: qt }, SyntaxError: Qt, toLocaleString: qt, toString: qt, TypeError: Qt, Uint16Array: Zt, Uint32Array: Zt, Uint8Array: Zt, Uint8ClampedArray: Zt, unescape: Kt, URIError: Qt, valueOf: qt, WeakMap: Qt, WeakSet: Qt, clearInterval: Yt, clearTimeout: Yt, console: qt, Intl: { __proto__: null, [Gt]: Wt, Collator: Jt, DateTimeFormat: Jt, ListFormat: Jt, NumberFormat: Jt, PluralRules: Jt, RelativeTimeFormat: Jt }, setInterval: Yt, setTimeout: Yt, TextDecoder: Yt, TextEncoder: Yt, URL: Yt, URLSearchParams: Yt, AbortController: Yt, AbortSignal: Yt, addEventListener: qt, alert: qt, AnalyserNode: Yt, Animation: Yt, AnimationEvent: Yt, applicationCache: qt, ApplicationCache: Yt, ApplicationCacheErrorEvent: Yt, atob: qt, Attr: Yt, Audio: Yt, AudioBuffer: Yt, AudioBufferSourceNode: Yt, AudioContext: Yt, AudioDestinationNode: Yt, AudioListener: Yt, AudioNode: Yt, AudioParam: Yt, AudioProcessingEvent: Yt, AudioScheduledSourceNode: Yt, AudioWorkletNode: Yt, BarProp: Yt, BaseAudioContext: Yt, BatteryManager: Yt, BeforeUnloadEvent: Yt, BiquadFilterNode: Yt, Blob: Yt, BlobEvent: Yt, blur: qt, BroadcastChannel: Yt, btoa: qt, ByteLengthQueuingStrategy: Yt, Cache: Yt, caches: qt, CacheStorage: Yt, cancelAnimationFrame: qt, cancelIdleCallback: qt, CanvasCaptureMediaStreamTrack: Yt, CanvasGradient: Yt, CanvasPattern: Yt, CanvasRenderingContext2D: Yt, ChannelMergerNode: Yt, ChannelSplitterNode: Yt, CharacterData: Yt, clientInformation: qt, ClipboardEvent: Yt, close: qt, closed: qt, CloseEvent: Yt, Comment: Yt, CompositionEvent: Yt, confirm: qt, ConstantSourceNode: Yt, ConvolverNode: Yt, CountQueuingStrategy: Yt, createImageBitmap: qt, Credential: Yt, CredentialsContainer: Yt, crypto: qt, Crypto: Yt, CryptoKey: Yt, CSS: Yt, CSSConditionRule: Yt, CSSFontFaceRule: Yt, CSSGroupingRule: Yt, CSSImportRule: Yt, CSSKeyframeRule: Yt, CSSKeyframesRule: Yt, CSSMediaRule: Yt, CSSNamespaceRule: Yt, CSSPageRule: Yt, CSSRule: Yt, CSSRuleList: Yt, CSSStyleDeclaration: Yt, CSSStyleRule: Yt, CSSStyleSheet: Yt, CSSSupportsRule: Yt, CustomElementRegistry: Yt, customElements: qt, CustomEvent: Yt, DataTransfer: Yt, DataTransferItem: Yt, DataTransferItemList: Yt, defaultstatus: qt, defaultStatus: qt, DelayNode: Yt, DeviceMotionEvent: Yt, DeviceOrientationEvent: Yt, devicePixelRatio: qt, dispatchEvent: qt, document: qt, Document: Yt, DocumentFragment: Yt, DocumentType: Yt, DOMError: Yt, DOMException: Yt, DOMImplementation: Yt, DOMMatrix: Yt, DOMMatrixReadOnly: Yt, DOMParser: Yt, DOMPoint: Yt, DOMPointReadOnly: Yt, DOMQuad: Yt, DOMRect: Yt, DOMRectReadOnly: Yt, DOMStringList: Yt, DOMStringMap: Yt, DOMTokenList: Yt, DragEvent: Yt, DynamicsCompressorNode: Yt, Element: Yt, ErrorEvent: Yt, Event: Yt, EventSource: Yt, EventTarget: Yt, external: qt, fetch: qt, File: Yt, FileList: Yt, FileReader: Yt, find: qt, focus: qt, FocusEvent: Yt, FontFace: Yt, FontFaceSetLoadEvent: Yt, FormData: Yt, frames: qt, GainNode: Yt, Gamepad: Yt, GamepadButton: Yt, GamepadEvent: Yt, getComputedStyle: qt, getSelection: qt, HashChangeEvent: Yt, Headers: Yt, history: qt, History: Yt, HTMLAllCollection: Yt, HTMLAnchorElement: Yt, HTMLAreaElement: Yt, HTMLAudioElement: Yt, HTMLBaseElement: Yt, HTMLBodyElement: Yt, HTMLBRElement: Yt, HTMLButtonElement: Yt, HTMLCanvasElement: Yt, HTMLCollection: Yt, HTMLContentElement: Yt, HTMLDataElement: Yt, HTMLDataListElement: Yt, HTMLDetailsElement: Yt, HTMLDialogElement: Yt, HTMLDirectoryElement: Yt, HTMLDivElement: Yt, HTMLDListElement: Yt, HTMLDocument: Yt, HTMLElement: Yt, HTMLEmbedElement: Yt, HTMLFieldSetElement: Yt, HTMLFontElement: Yt, HTMLFormControlsCollection: Yt, HTMLFormElement: Yt, HTMLFrameElement: Yt, HTMLFrameSetElement: Yt, HTMLHeadElement: Yt, HTMLHeadingElement: Yt, HTMLHRElement: Yt, HTMLHtmlElement: Yt, HTMLIFrameElement: Yt, HTMLImageElement: Yt, HTMLInputElement: Yt, HTMLLabelElement: Yt, HTMLLegendElement: Yt, HTMLLIElement: Yt, HTMLLinkElement: Yt, HTMLMapElement: Yt, HTMLMarqueeElement: Yt, HTMLMediaElement: Yt, HTMLMenuElement: Yt, HTMLMetaElement: Yt, HTMLMeterElement: Yt, HTMLModElement: Yt, HTMLObjectElement: Yt, HTMLOListElement: Yt, HTMLOptGroupElement: Yt, HTMLOptionElement: Yt, HTMLOptionsCollection: Yt, HTMLOutputElement: Yt, HTMLParagraphElement: Yt, HTMLParamElement: Yt, HTMLPictureElement: Yt, HTMLPreElement: Yt, HTMLProgressElement: Yt, HTMLQuoteElement: Yt, HTMLScriptElement: Yt, HTMLSelectElement: Yt, HTMLShadowElement: Yt, HTMLSlotElement: Yt, HTMLSourceElement: Yt, HTMLSpanElement: Yt, HTMLStyleElement: Yt, HTMLTableCaptionElement: Yt, HTMLTableCellElement: Yt, HTMLTableColElement: Yt, HTMLTableElement: Yt, HTMLTableRowElement: Yt, HTMLTableSectionElement: Yt, HTMLTemplateElement: Yt, HTMLTextAreaElement: Yt, HTMLTimeElement: Yt, HTMLTitleElement: Yt, HTMLTrackElement: Yt, HTMLUListElement: Yt, HTMLUnknownElement: Yt, HTMLVideoElement: Yt, IDBCursor: Yt, IDBCursorWithValue: Yt, IDBDatabase: Yt, IDBFactory: Yt, IDBIndex: Yt, IDBKeyRange: Yt, IDBObjectStore: Yt, IDBOpenDBRequest: Yt, IDBRequest: Yt, IDBTransaction: Yt, IDBVersionChangeEvent: Yt, IdleDeadline: Yt, IIRFilterNode: Yt, Image: Yt, ImageBitmap: Yt, ImageBitmapRenderingContext: Yt, ImageCapture: Yt, ImageData: Yt, indexedDB: qt, innerHeight: qt, innerWidth: qt, InputEvent: Yt, IntersectionObserver: Yt, IntersectionObserverEntry: Yt, isSecureContext: qt, KeyboardEvent: Yt, KeyframeEffect: Yt, length: qt, localStorage: qt, location: qt, Location: Yt, locationbar: qt, matchMedia: qt, MediaDeviceInfo: Yt, MediaDevices: Yt, MediaElementAudioSourceNode: Yt, MediaEncryptedEvent: Yt, MediaError: Yt, MediaKeyMessageEvent: Yt, MediaKeySession: Yt, MediaKeyStatusMap: Yt, MediaKeySystemAccess: Yt, MediaList: Yt, MediaQueryList: Yt, MediaQueryListEvent: Yt, MediaRecorder: Yt, MediaSettingsRange: Yt, MediaSource: Yt, MediaStream: Yt, MediaStreamAudioDestinationNode: Yt, MediaStreamAudioSourceNode: Yt, MediaStreamEvent: Yt, MediaStreamTrack: Yt, MediaStreamTrackEvent: Yt, menubar: qt, MessageChannel: Yt, MessageEvent: Yt, MessagePort: Yt, MIDIAccess: Yt, MIDIConnectionEvent: Yt, MIDIInput: Yt, MIDIInputMap: Yt, MIDIMessageEvent: Yt, MIDIOutput: Yt, MIDIOutputMap: Yt, MIDIPort: Yt, MimeType: Yt, MimeTypeArray: Yt, MouseEvent: Yt, moveBy: qt, moveTo: qt, MutationEvent: Yt, MutationObserver: Yt, MutationRecord: Yt, name: qt, NamedNodeMap: Yt, NavigationPreloadManager: Yt, navigator: qt, Navigator: Yt, NetworkInformation: Yt, Node: Yt, NodeFilter: qt, NodeIterator: Yt, NodeList: Yt, Notification: Yt, OfflineAudioCompletionEvent: Yt, OfflineAudioContext: Yt, offscreenBuffering: qt, OffscreenCanvas: Yt, open: qt, openDatabase: qt, Option: Yt, origin: qt, OscillatorNode: Yt, outerHeight: qt, outerWidth: qt, PageTransitionEvent: Yt, pageXOffset: qt, pageYOffset: qt, PannerNode: Yt, parent: qt, Path2D: Yt, PaymentAddress: Yt, PaymentRequest: Yt, PaymentRequestUpdateEvent: Yt, PaymentResponse: Yt, performance: qt, Performance: Yt, PerformanceEntry: Yt, PerformanceLongTaskTiming: Yt, PerformanceMark: Yt, PerformanceMeasure: Yt, PerformanceNavigation: Yt, PerformanceNavigationTiming: Yt, PerformanceObserver: Yt, PerformanceObserverEntryList: Yt, PerformancePaintTiming: Yt, PerformanceResourceTiming: Yt, PerformanceTiming: Yt, PeriodicWave: Yt, Permissions: Yt, PermissionStatus: Yt, personalbar: qt, PhotoCapabilities: Yt, Plugin: Yt, PluginArray: Yt, PointerEvent: Yt, PopStateEvent: Yt, postMessage: qt, Presentation: Yt, PresentationAvailability: Yt, PresentationConnection: Yt, PresentationConnectionAvailableEvent: Yt, PresentationConnectionCloseEvent: Yt, PresentationConnectionList: Yt, PresentationReceiver: Yt, PresentationRequest: Yt, print: qt, ProcessingInstruction: Yt, ProgressEvent: Yt, PromiseRejectionEvent: Yt, prompt: qt, PushManager: Yt, PushSubscription: Yt, PushSubscriptionOptions: Yt, queueMicrotask: qt, RadioNodeList: Yt, Range: Yt, ReadableStream: Yt, RemotePlayback: Yt, removeEventListener: qt, Request: Yt, requestAnimationFrame: qt, requestIdleCallback: qt, resizeBy: qt, ResizeObserver: Yt, ResizeObserverEntry: Yt, resizeTo: qt, Response: Yt, RTCCertificate: Yt, RTCDataChannel: Yt, RTCDataChannelEvent: Yt, RTCDtlsTransport: Yt, RTCIceCandidate: Yt, RTCIceTransport: Yt, RTCPeerConnection: Yt, RTCPeerConnectionIceEvent: Yt, RTCRtpReceiver: Yt, RTCRtpSender: Yt, RTCSctpTransport: Yt, RTCSessionDescription: Yt, RTCStatsReport: Yt, RTCTrackEvent: Yt, screen: qt, Screen: Yt, screenLeft: qt, ScreenOrientation: Yt, screenTop: qt, screenX: qt, screenY: qt, ScriptProcessorNode: Yt, scroll: qt, scrollbars: qt, scrollBy: qt, scrollTo: qt, scrollX: qt, scrollY: qt, SecurityPolicyViolationEvent: Yt, Selection: Yt, ServiceWorker: Yt, ServiceWorkerContainer: Yt, ServiceWorkerRegistration: Yt, sessionStorage: qt, ShadowRoot: Yt, SharedWorker: Yt, SourceBuffer: Yt, SourceBufferList: Yt, speechSynthesis: qt, SpeechSynthesisEvent: Yt, SpeechSynthesisUtterance: Yt, StaticRange: Yt, status: qt, statusbar: qt, StereoPannerNode: Yt, stop: qt, Storage: Yt, StorageEvent: Yt, StorageManager: Yt, styleMedia: qt, StyleSheet: Yt, StyleSheetList: Yt, SubtleCrypto: Yt, SVGAElement: Yt, SVGAngle: Yt, SVGAnimatedAngle: Yt, SVGAnimatedBoolean: Yt, SVGAnimatedEnumeration: Yt, SVGAnimatedInteger: Yt, SVGAnimatedLength: Yt, SVGAnimatedLengthList: Yt, SVGAnimatedNumber: Yt, SVGAnimatedNumberList: Yt, SVGAnimatedPreserveAspectRatio: Yt, SVGAnimatedRect: Yt, SVGAnimatedString: Yt, SVGAnimatedTransformList: Yt, SVGAnimateElement: Yt, SVGAnimateMotionElement: Yt, SVGAnimateTransformElement: Yt, SVGAnimationElement: Yt, SVGCircleElement: Yt, SVGClipPathElement: Yt, SVGComponentTransferFunctionElement: Yt, SVGDefsElement: Yt, SVGDescElement: Yt, SVGDiscardElement: Yt, SVGElement: Yt, SVGEllipseElement: Yt, SVGFEBlendElement: Yt, SVGFEColorMatrixElement: Yt, SVGFEComponentTransferElement: Yt, SVGFECompositeElement: Yt, SVGFEConvolveMatrixElement: Yt, SVGFEDiffuseLightingElement: Yt, SVGFEDisplacementMapElement: Yt, SVGFEDistantLightElement: Yt, SVGFEDropShadowElement: Yt, SVGFEFloodElement: Yt, SVGFEFuncAElement: Yt, SVGFEFuncBElement: Yt, SVGFEFuncGElement: Yt, SVGFEFuncRElement: Yt, SVGFEGaussianBlurElement: Yt, SVGFEImageElement: Yt, SVGFEMergeElement: Yt, SVGFEMergeNodeElement: Yt, SVGFEMorphologyElement: Yt, SVGFEOffsetElement: Yt, SVGFEPointLightElement: Yt, SVGFESpecularLightingElement: Yt, SVGFESpotLightElement: Yt, SVGFETileElement: Yt, SVGFETurbulenceElement: Yt, SVGFilterElement: Yt, SVGForeignObjectElement: Yt, SVGGElement: Yt, SVGGeometryElement: Yt, SVGGradientElement: Yt, SVGGraphicsElement: Yt, SVGImageElement: Yt, SVGLength: Yt, SVGLengthList: Yt, SVGLinearGradientElement: Yt, SVGLineElement: Yt, SVGMarkerElement: Yt, SVGMaskElement: Yt, SVGMatrix: Yt, SVGMetadataElement: Yt, SVGMPathElement: Yt, SVGNumber: Yt, SVGNumberList: Yt, SVGPathElement: Yt, SVGPatternElement: Yt, SVGPoint: Yt, SVGPointList: Yt, SVGPolygonElement: Yt, SVGPolylineElement: Yt, SVGPreserveAspectRatio: Yt, SVGRadialGradientElement: Yt, SVGRect: Yt, SVGRectElement: Yt, SVGScriptElement: Yt, SVGSetElement: Yt, SVGStopElement: Yt, SVGStringList: Yt, SVGStyleElement: Yt, SVGSVGElement: Yt, SVGSwitchElement: Yt, SVGSymbolElement: Yt, SVGTextContentElement: Yt, SVGTextElement: Yt, SVGTextPathElement: Yt, SVGTextPositioningElement: Yt, SVGTitleElement: Yt, SVGTransform: Yt, SVGTransformList: Yt, SVGTSpanElement: Yt, SVGUnitTypes: Yt, SVGUseElement: Yt, SVGViewElement: Yt, TaskAttributionTiming: Yt, Text: Yt, TextEvent: Yt, TextMetrics: Yt, TextTrack: Yt, TextTrackCue: Yt, TextTrackCueList: Yt, TextTrackList: Yt, TimeRanges: Yt, toolbar: qt, top: qt, Touch: Yt, TouchEvent: Yt, TouchList: Yt, TrackEvent: Yt, TransitionEvent: Yt, TreeWalker: Yt, UIEvent: Yt, ValidityState: Yt, visualViewport: qt, VisualViewport: Yt, VTTCue: Yt, WaveShaperNode: Yt, WebAssembly: qt, WebGL2RenderingContext: Yt, WebGLActiveInfo: Yt, WebGLBuffer: Yt, WebGLContextEvent: Yt, WebGLFramebuffer: Yt, WebGLProgram: Yt, WebGLQuery: Yt, WebGLRenderbuffer: Yt, WebGLRenderingContext: Yt, WebGLSampler: Yt, WebGLShader: Yt, WebGLShaderPrecisionFormat: Yt, WebGLSync: Yt, WebGLTexture: Yt, WebGLTransformFeedback: Yt, WebGLUniformLocation: Yt, WebGLVertexArrayObject: Yt, WebSocket: Yt, WheelEvent: Yt, Window: Yt, Worker: Yt, WritableStream: Yt, XMLDocument: Yt, XMLHttpRequest: Yt, XMLHttpRequestEventTarget: Yt, XMLHttpRequestUpload: Yt, XMLSerializer: Yt, XPathEvaluator: Yt, XPathExpression: Yt, XPathResult: Yt, XSLTProcessor: Yt };
for (const e of ["window", "global", "self", "globalThis"])
  ei[e] = ei;
function ti(e) {
  let t = ei;
  for (const i of e) {
    if (typeof i != "string")
      return null;
    if (t = t[i], !t)
      return null;
  }
  return t[Gt];
}
class ii extends ee {
  constructor() {
    super(...arguments), this.isReassigned = true;
  }
  getLiteralValueAtPath(e, t, i) {
    return ti([this.name, ...e]) ? q : W;
  }
  hasEffectsOnInteractionAtPath(e, t, i) {
    switch (t.type) {
      case 0:
        return e.length === 0 ? this.name !== "undefined" && !ti([this.name]) : !ti([this.name, ...e].slice(0, -1));
      case 1:
        return true;
      case 2: {
        const s = ti([this.name, ...e]);
        return !s || s.hasEffectsWhenCalled(t, i);
      }
    }
  }
}
const si = { __proto__: null, class: true, const: true, let: true, var: true };
class ni extends ut {
  constructor() {
    super(...arguments), this.variable = null, this.isTDZAccess = null;
  }
  addExportedVariables(e, t) {
    t.has(this.variable) && e.push(this.variable);
  }
  bind() {
    !this.variable && Ut(this, this.parent) && (this.variable = this.scope.findVariable(this.name), this.variable.addReference(this));
  }
  declare(e, t) {
    let i;
    const { treeshake: s } = this.context.options;
    switch (e) {
      case "var":
        i = this.scope.addDeclaration(this, this.context, t, true), s && s.correctVarValueBeforeDeclaration && i.markInitializersForDeoptimization();
        break;
      case "function":
      case "let":
      case "const":
      case "class":
        i = this.scope.addDeclaration(this, this.context, t, false);
        break;
      case "parameter":
        i = this.scope.addParameterDeclaration(this);
        break;
      default:
        throw new Error(`Internal Error: Unexpected identifier kind ${e}.`);
    }
    return i.kind = e, [this.variable = i];
  }
  deoptimizePath(e) {
    var t;
    e.length !== 0 || this.scope.contains(this.name) || this.disallowImportReassignment(), (t = this.variable) === null || t === void 0 || t.deoptimizePath(e);
  }
  deoptimizeThisOnInteractionAtPath(e, t, i) {
    this.variable.deoptimizeThisOnInteractionAtPath(e, t, i);
  }
  getLiteralValueAtPath(e, t, i) {
    return this.getVariableRespectingTDZ().getLiteralValueAtPath(e, t, i);
  }
  getReturnExpressionWhenCalledAtPath(e, t, i, s) {
    return this.getVariableRespectingTDZ().getReturnExpressionWhenCalledAtPath(e, t, i, s);
  }
  hasEffects(e) {
    return this.deoptimized || this.applyDeoptimizations(), !(!this.isPossibleTDZ() || this.variable.kind === "var") || this.context.options.treeshake.unknownGlobalSideEffects && this.variable instanceof ii && this.variable.hasEffectsOnInteractionAtPath(V, Y, e);
  }
  hasEffectsOnInteractionAtPath(e, t, i) {
    switch (t.type) {
      case 0:
        return this.variable !== null && this.getVariableRespectingTDZ().hasEffectsOnInteractionAtPath(e, t, i);
      case 1:
        return (e.length > 0 ? this.getVariableRespectingTDZ() : this.variable).hasEffectsOnInteractionAtPath(e, t, i);
      case 2:
        return this.getVariableRespectingTDZ().hasEffectsOnInteractionAtPath(e, t, i);
    }
  }
  include() {
    this.deoptimized || this.applyDeoptimizations(), this.included || (this.included = true, this.variable !== null && this.context.includeVariableInModule(this.variable));
  }
  includeCallArguments(e, t) {
    this.variable.includeCallArguments(e, t);
  }
  isPossibleTDZ() {
    if (this.isTDZAccess !== null)
      return this.isTDZAccess;
    if (!(this.variable instanceof Dt && this.variable.kind && this.variable.kind in si))
      return this.isTDZAccess = false;
    let e;
    return this.variable.declarations && this.variable.declarations.length === 1 && (e = this.variable.declarations[0]) && this.start < e.start && ri(this) === ri(e) ? this.isTDZAccess = true : this.variable.initReached ? this.isTDZAccess = false : this.isTDZAccess = true;
  }
  markDeclarationReached() {
    this.variable.initReached = true;
  }
  render(e, { snippets: { getPropertyAccess: t } }, { renderedParentType: i, isCalleeOfRenderedParent: s, isShorthandProperty: n2 } = ie) {
    if (this.variable) {
      const r2 = this.variable.getName(t);
      r2 !== this.name && (e.overwrite(this.start, this.end, r2, { contentOnly: true, storeName: true }), n2 && e.prependRight(this.start, `${this.name}: `)), r2 === "eval" && i === "CallExpression" && s && e.appendRight(this.start, "0, ");
    }
  }
  applyDeoptimizations() {
    this.deoptimized = true, this.variable instanceof Dt && (this.variable.consolidateInitializers(), this.context.requestTreeshakingPass());
  }
  disallowImportReassignment() {
    return this.context.error({ code: "ILLEGAL_REASSIGNMENT", message: `Illegal reassignment to import '${this.name}'` }, this.start);
  }
  getVariableRespectingTDZ() {
    return this.isPossibleTDZ() ? X : this.variable;
  }
}
function ri(e) {
  for (; e && !/^Program|Function/.test(e.type); )
    e = e.parent;
  return e;
}
function ai(e, t, i, s) {
  if (t.remove(i, s), e.annotations)
    for (const s2 of e.annotations) {
      if (!(s2.start < i))
        return;
      t.remove(s2.start, s2.end);
    }
}
function oi(e, t) {
  if (e.annotations || e.parent.type !== "ExpressionStatement" || (e = e.parent), e.annotations)
    for (const i of e.annotations)
      t.remove(i.start, i.end);
}
const li = { isNoStatement: true };
function hi(e, t, i = 0) {
  let s, n2;
  for (s = e.indexOf(t, i); ; ) {
    if ((i = e.indexOf("/", i)) === -1 || i >= s)
      return s;
    n2 = e.charCodeAt(++i), ++i, (i = n2 === 47 ? e.indexOf("\n", i) + 1 : e.indexOf("*/", i) + 2) > s && (s = e.indexOf(t, i));
  }
}
const ci = /\S/g;
function ui(e, t) {
  ci.lastIndex = t;
  return ci.exec(e).index;
}
function di(e) {
  let t, i, s = 0;
  for (t = e.indexOf("\n", s); ; ) {
    if (s = e.indexOf("/", s), s === -1 || s > t)
      return [t, t + 1];
    if (i = e.charCodeAt(s + 1), i === 47)
      return [s, t + 1];
    s = e.indexOf("*/", s + 3) + 2, s > t && (t = e.indexOf("\n", s));
  }
}
function pi(e, t, i, s, n2) {
  let r2, a3, o2, l2, h2 = e[0], c2 = !h2.included || h2.needsBoundaries;
  c2 && (l2 = i + di(t.original.slice(i, h2.start))[1]);
  for (let i2 = 1; i2 <= e.length; i2++)
    r2 = h2, a3 = l2, o2 = c2, h2 = e[i2], c2 = h2 !== void 0 && (!h2.included || h2.needsBoundaries), o2 || c2 ? (l2 = r2.end + di(t.original.slice(r2.end, h2 === void 0 ? s : h2.start))[1], r2.included ? o2 ? r2.render(t, n2, { end: l2, start: a3 }) : r2.render(t, n2) : ai(r2, t, a3, l2)) : r2.render(t, n2);
}
function fi(e, t, i, s) {
  const n2 = [];
  let r2, a3, o2, l2, h2, c2 = i - 1;
  for (let s2 = 0; s2 < e.length; s2++) {
    for (a3 = e[s2], r2 !== void 0 && (c2 = r2.end + hi(t.original.slice(r2.end, a3.start), ",")), o2 = l2 = c2 + 1 + di(t.original.slice(c2 + 1, a3.start))[1]; h2 = t.original.charCodeAt(o2), h2 === 32 || h2 === 9 || h2 === 10 || h2 === 13; )
      o2++;
    r2 !== void 0 && n2.push({ contentEnd: l2, end: o2, node: r2, separator: c2, start: i }), r2 = a3, i = o2;
  }
  return n2.push({ contentEnd: s, end: s, node: r2, separator: null, start: i }), n2;
}
function mi(e, t, i) {
  for (; ; ) {
    const [s, n2] = di(e.original.slice(t, i));
    if (s === -1)
      break;
    e.remove(t + s, t += n2);
  }
}
class gi extends Ft {
  addDeclaration(e, t, i, s) {
    if (s) {
      const n2 = this.parent.addDeclaration(e, t, i, s);
      return n2.markInitializersForDeoptimization(), n2;
    }
    return super.addDeclaration(e, t, i, false);
  }
}
class yi extends ut {
  initialise() {
    this.directive && this.directive !== "use strict" && this.parent.type === "Program" && this.context.warn({ code: "MODULE_LEVEL_DIRECTIVE", message: `Module level directives cause errors when bundled, '${this.directive}' was ignored.` }, this.start);
  }
  render(e, t) {
    super.render(e, t), this.included && this.insertSemicolon(e);
  }
  shouldBeIncluded(e) {
    return this.directive && this.directive !== "use strict" ? this.parent.type !== "Program" : super.shouldBeIncluded(e);
  }
  applyDeoptimizations() {
  }
}
class xi extends ut {
  constructor() {
    super(...arguments), this.directlyIncluded = false;
  }
  addImplicitReturnExpressionToScope() {
    const e = this.body[this.body.length - 1];
    e && e.type === "ReturnStatement" || this.scope.addReturnExpression(X);
  }
  createScope(e) {
    this.scope = this.parent.preventChildBlockScope ? e : new gi(e);
  }
  hasEffects(e) {
    if (this.deoptimizeBody)
      return true;
    for (const t of this.body) {
      if (e.brokenFlow)
        break;
      if (t.hasEffects(e))
        return true;
    }
    return false;
  }
  include(e, t) {
    if (!this.deoptimizeBody || !this.directlyIncluded) {
      this.included = true, this.directlyIncluded = true, this.deoptimizeBody && (t = true);
      for (const i of this.body)
        (t || i.shouldBeIncluded(e)) && i.include(e, t);
    }
  }
  initialise() {
    const e = this.body[0];
    this.deoptimizeBody = e instanceof yi && e.directive === "use asm";
  }
  render(e, t) {
    this.body.length ? pi(this.body, e, this.start + 1, this.end - 1, t) : super.render(e, t);
  }
}
class Ei extends ut {
  constructor() {
    super(...arguments), this.declarationInit = null;
  }
  addExportedVariables(e, t) {
    this.argument.addExportedVariables(e, t);
  }
  declare(e, t) {
    return this.declarationInit = t, this.argument.declare(e, X);
  }
  deoptimizePath(e) {
    e.length === 0 && this.argument.deoptimizePath(V);
  }
  hasEffectsOnInteractionAtPath(e, t, i) {
    return e.length > 0 || this.argument.hasEffectsOnInteractionAtPath(V, t, i);
  }
  markDeclarationReached() {
    this.argument.markDeclarationReached();
  }
  applyDeoptimizations() {
    this.deoptimized = true, this.declarationInit !== null && (this.declarationInit.deoptimizePath([M, M]), this.context.requestTreeshakingPass());
  }
}
class bi extends ut {
  constructor() {
    super(...arguments), this.objectEntity = null, this.deoptimizedReturn = false;
  }
  deoptimizePath(e) {
    this.getObjectEntity().deoptimizePath(e), e.length === 1 && e[0] === M && this.scope.getReturnExpression().deoptimizePath(B);
  }
  deoptimizeThisOnInteractionAtPath(e, t, i) {
    t.length > 0 && this.getObjectEntity().deoptimizeThisOnInteractionAtPath(e, t, i);
  }
  getLiteralValueAtPath(e, t, i) {
    return this.getObjectEntity().getLiteralValueAtPath(e, t, i);
  }
  getReturnExpressionWhenCalledAtPath(e, t, i, s) {
    return e.length > 0 ? this.getObjectEntity().getReturnExpressionWhenCalledAtPath(e, t, i, s) : this.async ? (this.deoptimizedReturn || (this.deoptimizedReturn = true, this.scope.getReturnExpression().deoptimizePath(B), this.context.requestTreeshakingPass()), X) : this.scope.getReturnExpression();
  }
  hasEffectsOnInteractionAtPath(e, t, i) {
    if (e.length > 0 || t.type !== 2)
      return this.getObjectEntity().hasEffectsOnInteractionAtPath(e, t, i);
    if (this.async) {
      const { propertyReadSideEffects: e2 } = this.context.options.treeshake, t2 = this.scope.getReturnExpression();
      if (t2.hasEffectsOnInteractionAtPath(["then"], J, i) || e2 && (e2 === "always" || t2.hasEffectsOnInteractionAtPath(["then"], Y, i)))
        return true;
    }
    for (const e2 of this.params)
      if (e2.hasEffects(i))
        return true;
    return false;
  }
  include(e, t) {
    this.deoptimized || this.applyDeoptimizations(), this.included = true;
    const { brokenFlow: i } = e;
    e.brokenFlow = 0, this.body.include(e, t), e.brokenFlow = i;
  }
  includeCallArguments(e, t) {
    this.scope.includeCallArguments(e, t);
  }
  initialise() {
    this.scope.addParameterVariables(this.params.map((e) => e.declare("parameter", X)), this.params[this.params.length - 1] instanceof Ei), this.body instanceof xi ? this.body.addImplicitReturnExpressionToScope() : this.scope.addReturnExpression(this.body);
  }
  parseNode(e) {
    e.body.type === "BlockStatement" && (this.body = new xi(e.body, this, this.scope.hoistedBodyVarScope)), super.parseNode(e);
  }
  applyDeoptimizations() {
  }
}
bi.prototype.preventChildBlockScope = true;
class vi extends bi {
  constructor() {
    super(...arguments), this.objectEntity = null;
  }
  createScope(e) {
    this.scope = new jt(e, this.context);
  }
  hasEffects() {
    return this.deoptimized || this.applyDeoptimizations(), false;
  }
  hasEffectsOnInteractionAtPath(e, t, i) {
    if (super.hasEffectsOnInteractionAtPath(e, t, i))
      return true;
    if (t.type === 2) {
      const { ignore: e2, brokenFlow: t2 } = i;
      if (i.ignore = { breaks: false, continues: false, labels: /* @__PURE__ */ new Set(), returnYield: true }, this.body.hasEffects(i))
        return true;
      i.ignore = e2, i.brokenFlow = t2;
    }
    return false;
  }
  include(e, t) {
    super.include(e, t);
    for (const i of this.params)
      i instanceof ni || i.include(e, t);
  }
  getObjectEntity() {
    return this.objectEntity !== null ? this.objectEntity : this.objectEntity = new Et([], St);
  }
}
function Si(e, { exportNamesByVariable: t, snippets: { _: i, getObject: s, getPropertyAccess: n2 } }, r2 = "") {
  if (e.length === 1 && t.get(e[0]).length === 1) {
    const s2 = e[0];
    return `exports('${t.get(s2)}',${i}${s2.getName(n2)}${r2})`;
  }
  {
    const i2 = [];
    for (const s2 of e)
      for (const e2 of t.get(s2))
        i2.push([e2, s2.getName(n2) + r2]);
    return `exports(${s(i2, { lineBreakIndent: null })})`;
  }
}
function Ai(e, t, i, s, { exportNamesByVariable: n2, snippets: { _: r2 } }) {
  s.prependRight(t, `exports('${n2.get(e)}',${r2}`), s.appendLeft(i, ")");
}
function Ii(e, t, i, s, n2, r2) {
  const { _: a3, getPropertyAccess: o2 } = r2.snippets;
  n2.appendLeft(i, `,${a3}${Si([e], r2)},${a3}${e.getName(o2)}`), s && (n2.prependRight(t, "("), n2.appendLeft(i, ")"));
}
class ki extends ut {
  addExportedVariables(e, t) {
    for (const i of this.properties)
      i.type === "Property" ? i.value.addExportedVariables(e, t) : i.argument.addExportedVariables(e, t);
  }
  declare(e, t) {
    const i = [];
    for (const s of this.properties)
      i.push(...s.declare(e, t));
    return i;
  }
  deoptimizePath(e) {
    if (e.length === 0)
      for (const t of this.properties)
        t.deoptimizePath(e);
  }
  hasEffectsOnInteractionAtPath(e, t, i) {
    for (const e2 of this.properties)
      if (e2.hasEffectsOnInteractionAtPath(V, t, i))
        return true;
    return false;
  }
  markDeclarationReached() {
    for (const e of this.properties)
      e.markDeclarationReached();
  }
}
class Pi extends Dt {
  constructor(e) {
    super("arguments", null, X, e);
  }
  hasEffectsOnInteractionAtPath(e, { type: t }) {
    return t !== 0 || e.length > 1;
  }
}
class wi extends Dt {
  constructor(e) {
    super("this", null, null, e), this.deoptimizedPaths = [], this.entitiesToBeDeoptimized = /* @__PURE__ */ new Set(), this.thisDeoptimizationList = [], this.thisDeoptimizations = new H();
  }
  addEntityToBeDeoptimized(e) {
    for (const t of this.deoptimizedPaths)
      e.deoptimizePath(t);
    for (const { interaction: t, path: i } of this.thisDeoptimizationList)
      e.deoptimizeThisOnInteractionAtPath(t, i, G);
    this.entitiesToBeDeoptimized.add(e);
  }
  deoptimizePath(e) {
    if (e.length !== 0 && !this.deoptimizationTracker.trackEntityAtPathAndGetIfTracked(e, this)) {
      this.deoptimizedPaths.push(e);
      for (const t of this.entitiesToBeDeoptimized)
        t.deoptimizePath(e);
    }
  }
  deoptimizeThisOnInteractionAtPath(e, t) {
    const i = { interaction: e, path: t };
    if (!this.thisDeoptimizations.trackEntityAtPathAndGetIfTracked(t, e.type, e.thisArg)) {
      for (const i2 of this.entitiesToBeDeoptimized)
        i2.deoptimizeThisOnInteractionAtPath(e, t, G);
      this.thisDeoptimizationList.push(i);
    }
  }
  hasEffectsOnInteractionAtPath(e, t, i) {
    return this.getInit(i).hasEffectsOnInteractionAtPath(e, t, i) || super.hasEffectsOnInteractionAtPath(e, t, i);
  }
  getInit(e) {
    return e.replacedVariableInits.get(this) || X;
  }
}
class Ci extends jt {
  constructor(e, t) {
    super(e, t), this.variables.set("arguments", this.argumentsVariable = new Pi(t)), this.variables.set("this", this.thisVariable = new wi(t));
  }
  findLexicalBoundary() {
    return this;
  }
  includeCallArguments(e, t) {
    if (super.includeCallArguments(e, t), this.argumentsVariable.included)
      for (const i of t)
        i.included || i.include(e, false);
  }
}
class _i extends bi {
  constructor() {
    super(...arguments), this.objectEntity = null;
  }
  createScope(e) {
    this.scope = new Ci(e, this.context);
  }
  deoptimizeThisOnInteractionAtPath(e, t, i) {
    super.deoptimizeThisOnInteractionAtPath(e, t, i), e.type === 2 && t.length === 0 && this.scope.thisVariable.addEntityToBeDeoptimized(e.thisArg);
  }
  hasEffects(e) {
    var t;
    return this.deoptimized || this.applyDeoptimizations(), !!((t = this.id) === null || t === void 0 ? void 0 : t.hasEffects(e));
  }
  hasEffectsOnInteractionAtPath(e, t, i) {
    if (super.hasEffectsOnInteractionAtPath(e, t, i))
      return true;
    if (t.type === 2) {
      const e2 = i.replacedVariableInits.get(this.scope.thisVariable);
      i.replacedVariableInits.set(this.scope.thisVariable, t.withNew ? new Et(/* @__PURE__ */ Object.create(null), St) : X);
      const { brokenFlow: s, ignore: n2 } = i;
      if (i.ignore = { breaks: false, continues: false, labels: /* @__PURE__ */ new Set(), returnYield: true }, this.body.hasEffects(i))
        return true;
      i.brokenFlow = s, e2 ? i.replacedVariableInits.set(this.scope.thisVariable, e2) : i.replacedVariableInits.delete(this.scope.thisVariable), i.ignore = n2;
    }
    return false;
  }
  include(e, t) {
    var i;
    super.include(e, t), (i = this.id) === null || i === void 0 || i.include();
    const s = this.scope.argumentsVariable.included;
    for (const i2 of this.params)
      i2 instanceof ni && !s || i2.include(e, t);
  }
  initialise() {
    var e;
    super.initialise(), (e = this.id) === null || e === void 0 || e.declare("function", this);
  }
  getObjectEntity() {
    return this.objectEntity !== null ? this.objectEntity : this.objectEntity = new Et([{ key: "prototype", kind: "init", property: new Et([], St) }], St);
  }
}
const Ni = { "!=": (e, t) => e != t, "!==": (e, t) => e !== t, "%": (e, t) => e % t, "&": (e, t) => e & t, "*": (e, t) => e * t, "**": (e, t) => e ** t, "+": (e, t) => e + t, "-": (e, t) => e - t, "/": (e, t) => e / t, "<": (e, t) => e < t, "<<": (e, t) => e << t, "<=": (e, t) => e <= t, "==": (e, t) => e == t, "===": (e, t) => e === t, ">": (e, t) => e > t, ">=": (e, t) => e >= t, ">>": (e, t) => e >> t, ">>>": (e, t) => e >>> t, "^": (e, t) => e ^ t, "|": (e, t) => e | t };
function $i(e, t, i) {
  if (i.arguments.length > 0)
    if (i.arguments[i.arguments.length - 1].included)
      for (const s of i.arguments)
        s.render(e, t);
    else {
      let s = i.arguments.length - 2;
      for (; s >= 0 && !i.arguments[s].included; )
        s--;
      if (s >= 0) {
        for (let n2 = 0; n2 <= s; n2++)
          i.arguments[n2].render(e, t);
        e.remove(hi(e.original, ",", i.arguments[s].end), i.end - 1);
      } else
        e.remove(hi(e.original, "(", i.callee.end) + 1, i.end - 1);
    }
}
class Ti extends ut {
  deoptimizeThisOnInteractionAtPath() {
  }
  getLiteralValueAtPath(e) {
    return e.length > 0 || this.value === null && this.context.code.charCodeAt(this.start) !== 110 || typeof this.value == "bigint" || this.context.code.charCodeAt(this.start) === 47 ? W : this.value;
  }
  getReturnExpressionWhenCalledAtPath(e) {
    return e.length !== 1 ? X : Qe(this.members, e[0]);
  }
  hasEffectsOnInteractionAtPath(e, t, i) {
    switch (t.type) {
      case 0:
        return e.length > (this.value === null ? 0 : 1);
      case 1:
        return true;
      case 2:
        return e.length !== 1 || Ye(this.members, e[0], t, i);
    }
  }
  initialise() {
    this.members = function(e) {
      switch (typeof e) {
        case "boolean":
          return qe;
        case "number":
          return Ke;
        case "string":
          return Xe;
      }
      return /* @__PURE__ */ Object.create(null);
    }(this.value);
  }
  parseNode(e) {
    this.value = e.value, this.regex = e.regex, super.parseNode(e);
  }
  render(e) {
    typeof this.value == "string" && e.indentExclusionRanges.push([this.start + 1, this.end - 1]);
  }
}
function Oi(e) {
  return e.computed ? function(e2) {
    if (e2 instanceof Ti)
      return String(e2.value);
    return null;
  }(e.property) : e.property.name;
}
function Ri(e) {
  const t = e.propertyKey, i = e.object;
  if (typeof t == "string") {
    if (i instanceof ni)
      return [{ key: i.name, pos: i.start }, { key: t, pos: e.property.start }];
    if (i instanceof Mi) {
      const s = Ri(i);
      return s && [...s, { key: t, pos: e.property.start }];
    }
  }
  return null;
}
class Mi extends ut {
  constructor() {
    super(...arguments), this.variable = null, this.assignmentDeoptimized = false, this.bound = false, this.expressionsToBeDeoptimized = [], this.replacement = null;
  }
  bind() {
    this.bound = true;
    const e = Ri(this), t = e && this.scope.findVariable(e[0].key);
    if (t && t.isNamespace) {
      const i = Di(t, e.slice(1), this.context);
      i ? typeof i == "string" ? this.replacement = i : (this.variable = i, this.scope.addNamespaceMemberAccess(function(e2) {
        let t2 = e2[0].key;
        for (let i2 = 1; i2 < e2.length; i2++)
          t2 += "." + e2[i2].key;
        return t2;
      }(e), i)) : super.bind();
    } else
      super.bind();
  }
  deoptimizeCache() {
    const e = this.expressionsToBeDeoptimized;
    this.expressionsToBeDeoptimized = [], this.propertyKey = M, this.object.deoptimizePath(B);
    for (const t of e)
      t.deoptimizeCache();
  }
  deoptimizePath(e) {
    if (e.length === 0 && this.disallowNamespaceReassignment(), this.variable)
      this.variable.deoptimizePath(e);
    else if (!this.replacement && e.length < 7) {
      const t = this.getPropertyKey();
      this.object.deoptimizePath([t === M ? D : t, ...e]);
    }
  }
  deoptimizeThisOnInteractionAtPath(e, t, i) {
    this.variable ? this.variable.deoptimizeThisOnInteractionAtPath(e, t, i) : this.replacement || (t.length < 7 ? this.object.deoptimizeThisOnInteractionAtPath(e, [this.getPropertyKey(), ...t], i) : e.thisArg.deoptimizePath(B));
  }
  getLiteralValueAtPath(e, t, i) {
    return this.variable ? this.variable.getLiteralValueAtPath(e, t, i) : this.replacement ? W : (this.expressionsToBeDeoptimized.push(i), e.length < 7 ? this.object.getLiteralValueAtPath([this.getPropertyKey(), ...e], t, i) : W);
  }
  getReturnExpressionWhenCalledAtPath(e, t, i, s) {
    return this.variable ? this.variable.getReturnExpressionWhenCalledAtPath(e, t, i, s) : this.replacement ? X : (this.expressionsToBeDeoptimized.push(s), e.length < 7 ? this.object.getReturnExpressionWhenCalledAtPath([this.getPropertyKey(), ...e], t, i, s) : X);
  }
  hasEffects(e) {
    return this.deoptimized || this.applyDeoptimizations(), this.property.hasEffects(e) || this.object.hasEffects(e) || this.hasAccessEffect(e);
  }
  hasEffectsAsAssignmentTarget(e, t) {
    return t && !this.deoptimized && this.applyDeoptimizations(), this.assignmentDeoptimized || this.applyAssignmentDeoptimization(), this.property.hasEffects(e) || this.object.hasEffects(e) || t && this.hasAccessEffect(e) || this.hasEffectsOnInteractionAtPath(V, this.assignmentInteraction, e);
  }
  hasEffectsOnInteractionAtPath(e, t, i) {
    return this.variable ? this.variable.hasEffectsOnInteractionAtPath(e, t, i) : !!this.replacement || (!(e.length < 7) || this.object.hasEffectsOnInteractionAtPath([this.getPropertyKey(), ...e], t, i));
  }
  include(e, t) {
    this.deoptimized || this.applyDeoptimizations(), this.includeProperties(e, t);
  }
  includeAsAssignmentTarget(e, t, i) {
    this.assignmentDeoptimized || this.applyAssignmentDeoptimization(), i ? this.include(e, t) : this.includeProperties(e, t);
  }
  includeCallArguments(e, t) {
    this.variable ? this.variable.includeCallArguments(e, t) : super.includeCallArguments(e, t);
  }
  initialise() {
    this.propertyKey = Oi(this), this.accessInteraction = { thisArg: this.object, type: 0 };
  }
  render(e, t, { renderedParentType: i, isCalleeOfRenderedParent: s, renderedSurroundingElement: n2 } = ie) {
    if (this.variable || this.replacement) {
      const { snippets: { getPropertyAccess: n3 } } = t;
      let r2 = this.variable ? this.variable.getName(n3) : this.replacement;
      i && s && (r2 = "0, " + r2), e.overwrite(this.start, this.end, r2, { contentOnly: true, storeName: true });
    } else
      i && s && e.appendRight(this.start, "0, "), this.object.render(e, t, { renderedSurroundingElement: n2 }), this.property.render(e, t);
  }
  setAssignedValue(e) {
    this.assignmentInteraction = { args: [e], thisArg: this.object, type: 1 };
  }
  applyDeoptimizations() {
    this.deoptimized = true;
    const { propertyReadSideEffects: e } = this.context.options.treeshake;
    if (this.bound && e && !this.variable && !this.replacement) {
      const e2 = this.getPropertyKey();
      this.object.deoptimizeThisOnInteractionAtPath(this.accessInteraction, [e2], G), this.context.requestTreeshakingPass();
    }
  }
  applyAssignmentDeoptimization() {
    this.assignmentDeoptimized = true;
    const { propertyReadSideEffects: e } = this.context.options.treeshake;
    this.bound && e && !this.variable && !this.replacement && (this.object.deoptimizeThisOnInteractionAtPath(this.assignmentInteraction, [this.getPropertyKey()], G), this.context.requestTreeshakingPass());
  }
  disallowNamespaceReassignment() {
    if (this.object instanceof ni) {
      this.scope.findVariable(this.object.name).isNamespace && (this.variable && this.context.includeVariableInModule(this.variable), this.context.warn({ code: "ILLEGAL_NAMESPACE_REASSIGNMENT", message: `Illegal reassignment to import '${this.object.name}'` }, this.start));
    }
  }
  getPropertyKey() {
    if (this.propertyKey === null) {
      this.propertyKey = M;
      const e = this.property.getLiteralValueAtPath(V, G, this);
      return this.propertyKey = typeof e == "symbol" ? M : String(e);
    }
    return this.propertyKey;
  }
  hasAccessEffect(e) {
    const { propertyReadSideEffects: t } = this.context.options.treeshake;
    return !(this.variable || this.replacement) && t && (t === "always" || this.object.hasEffectsOnInteractionAtPath([this.getPropertyKey()], this.accessInteraction, e));
  }
  includeProperties(e, t) {
    this.included || (this.included = true, this.variable && this.context.includeVariableInModule(this.variable)), this.object.include(e, t), this.property.include(e, t);
  }
}
function Di(e, t, i) {
  if (t.length === 0)
    return e;
  if (!e.isNamespace || e instanceof te)
    return null;
  const s = t[0].key, n2 = e.context.traceExport(s);
  if (!n2) {
    const n3 = e.context.fileName;
    return i.warn({ code: "MISSING_EXPORT", exporter: he(n3), importer: he(i.fileName), message: `'${s}' is not exported by '${he(n3)}'`, missing: s, url: "https://rollupjs.org/guide/en/#error-name-is-not-exported-by-module" }, t[0].pos), "undefined";
  }
  return Di(n2, t.slice(1), i);
}
class Li extends ut {
  constructor() {
    super(...arguments), this.returnExpression = null, this.deoptimizableDependentExpressions = [], this.expressionsToBeDeoptimized = /* @__PURE__ */ new Set();
  }
  deoptimizeCache() {
    if (this.returnExpression !== X) {
      this.returnExpression = X;
      for (const e of this.deoptimizableDependentExpressions)
        e.deoptimizeCache();
      for (const e of this.expressionsToBeDeoptimized)
        e.deoptimizePath(B);
    }
  }
  deoptimizePath(e) {
    if (e.length === 0 || this.context.deoptimizationTracker.trackEntityAtPathAndGetIfTracked(e, this))
      return;
    const t = this.getReturnExpression();
    t !== X && t.deoptimizePath(e);
  }
  deoptimizeThisOnInteractionAtPath(e, t, i) {
    const s = this.getReturnExpression(i);
    s === X ? e.thisArg.deoptimizePath(B) : i.withTrackedEntityAtPath(t, s, () => {
      this.expressionsToBeDeoptimized.add(e.thisArg), s.deoptimizeThisOnInteractionAtPath(e, t, i);
    }, void 0);
  }
  getLiteralValueAtPath(e, t, i) {
    const s = this.getReturnExpression(t);
    return s === X ? W : t.withTrackedEntityAtPath(e, s, () => (this.deoptimizableDependentExpressions.push(i), s.getLiteralValueAtPath(e, t, i)), W);
  }
  getReturnExpressionWhenCalledAtPath(e, t, i, s) {
    const n2 = this.getReturnExpression(i);
    return this.returnExpression === X ? X : i.withTrackedEntityAtPath(e, n2, () => (this.deoptimizableDependentExpressions.push(s), n2.getReturnExpressionWhenCalledAtPath(e, t, i, s)), X);
  }
  hasEffectsOnInteractionAtPath(e, t, i) {
    const { type: s } = t;
    if (s === 2) {
      if ((t.withNew ? i.instantiated : i.called).trackEntityAtPathAndGetIfTracked(e, t.args, this))
        return false;
    } else if ((s === 1 ? i.assigned : i.accessed).trackEntityAtPathAndGetIfTracked(e, this))
      return false;
    return this.getReturnExpression().hasEffectsOnInteractionAtPath(e, t, i);
  }
}
class Vi extends zt {
  addDeclaration(e, t, i, s) {
    const n2 = this.variables.get(e.name);
    return n2 ? (this.parent.addDeclaration(e, t, Le, s), n2.addDeclaration(e, i), n2) : this.parent.addDeclaration(e, t, i, s);
  }
}
class Bi extends Ft {
  constructor(e, t, i) {
    super(e), this.variables.set("this", this.thisVariable = new Dt("this", null, t, i)), this.instanceScope = new Ft(this), this.instanceScope.variables.set("this", new wi(i));
  }
  findLexicalBoundary() {
    return this;
  }
}
class Fi extends ut {
  constructor() {
    super(...arguments), this.accessedValue = null;
  }
  deoptimizeCache() {
  }
  deoptimizePath(e) {
    this.getAccessedValue().deoptimizePath(e);
  }
  deoptimizeThisOnInteractionAtPath(e, t, i) {
    return e.type === 0 && this.kind === "get" && t.length === 0 ? this.value.deoptimizeThisOnInteractionAtPath({ args: Z, thisArg: e.thisArg, type: 2, withNew: false }, V, i) : e.type === 1 && this.kind === "set" && t.length === 0 ? this.value.deoptimizeThisOnInteractionAtPath({ args: e.args, thisArg: e.thisArg, type: 2, withNew: false }, V, i) : void this.getAccessedValue().deoptimizeThisOnInteractionAtPath(e, t, i);
  }
  getLiteralValueAtPath(e, t, i) {
    return this.getAccessedValue().getLiteralValueAtPath(e, t, i);
  }
  getReturnExpressionWhenCalledAtPath(e, t, i, s) {
    return this.getAccessedValue().getReturnExpressionWhenCalledAtPath(e, t, i, s);
  }
  hasEffects(e) {
    return this.key.hasEffects(e);
  }
  hasEffectsOnInteractionAtPath(e, t, i) {
    return this.kind === "get" && t.type === 0 && e.length === 0 ? this.value.hasEffectsOnInteractionAtPath(V, { args: Z, thisArg: t.thisArg, type: 2, withNew: false }, i) : this.kind === "set" && t.type === 1 ? this.value.hasEffectsOnInteractionAtPath(V, { args: t.args, thisArg: t.thisArg, type: 2, withNew: false }, i) : this.getAccessedValue().hasEffectsOnInteractionAtPath(e, t, i);
  }
  applyDeoptimizations() {
  }
  getAccessedValue() {
    return this.accessedValue === null ? this.kind === "get" ? (this.accessedValue = X, this.accessedValue = this.value.getReturnExpressionWhenCalledAtPath(V, J, G, this)) : this.accessedValue = this.value : this.accessedValue;
  }
}
class zi extends Fi {
  applyDeoptimizations() {
  }
}
class ji extends K {
  constructor(e, t) {
    super(), this.object = e, this.key = t;
  }
  deoptimizePath(e) {
    this.object.deoptimizePath([this.key, ...e]);
  }
  deoptimizeThisOnInteractionAtPath(e, t, i) {
    this.object.deoptimizeThisOnInteractionAtPath(e, [this.key, ...t], i);
  }
  getLiteralValueAtPath(e, t, i) {
    return this.object.getLiteralValueAtPath([this.key, ...e], t, i);
  }
  getReturnExpressionWhenCalledAtPath(e, t, i, s) {
    return this.object.getReturnExpressionWhenCalledAtPath([this.key, ...e], t, i, s);
  }
  hasEffectsOnInteractionAtPath(e, t, i) {
    return this.object.hasEffectsOnInteractionAtPath([this.key, ...e], t, i);
  }
}
class Ui extends ut {
  constructor() {
    super(...arguments), this.objectEntity = null;
  }
  createScope(e) {
    this.scope = new Ft(e);
  }
  deoptimizeCache() {
    this.getObjectEntity().deoptimizeAllProperties();
  }
  deoptimizePath(e) {
    this.getObjectEntity().deoptimizePath(e);
  }
  deoptimizeThisOnInteractionAtPath(e, t, i) {
    this.getObjectEntity().deoptimizeThisOnInteractionAtPath(e, t, i);
  }
  getLiteralValueAtPath(e, t, i) {
    return this.getObjectEntity().getLiteralValueAtPath(e, t, i);
  }
  getReturnExpressionWhenCalledAtPath(e, t, i, s) {
    return this.getObjectEntity().getReturnExpressionWhenCalledAtPath(e, t, i, s);
  }
  hasEffects(e) {
    var t, i;
    this.deoptimized || this.applyDeoptimizations();
    const s = ((t = this.superClass) === null || t === void 0 ? void 0 : t.hasEffects(e)) || this.body.hasEffects(e);
    return (i = this.id) === null || i === void 0 || i.markDeclarationReached(), s || super.hasEffects(e);
  }
  hasEffectsOnInteractionAtPath(e, t, i) {
    var s;
    return t.type === 2 && e.length === 0 ? !t.withNew || (this.classConstructor !== null ? this.classConstructor.hasEffectsOnInteractionAtPath(e, t, i) : (s = this.superClass) === null || s === void 0 ? void 0 : s.hasEffectsOnInteractionAtPath(e, t, i)) || false : this.getObjectEntity().hasEffectsOnInteractionAtPath(e, t, i);
  }
  include(e, t) {
    var i;
    this.deoptimized || this.applyDeoptimizations(), this.included = true, (i = this.superClass) === null || i === void 0 || i.include(e, t), this.body.include(e, t), this.id && (this.id.markDeclarationReached(), this.id.include());
  }
  initialise() {
    var e;
    (e = this.id) === null || e === void 0 || e.declare("class", this);
    for (const e2 of this.body.body)
      if (e2 instanceof zi && e2.kind === "constructor")
        return void (this.classConstructor = e2);
    this.classConstructor = null;
  }
  applyDeoptimizations() {
    this.deoptimized = true;
    for (const e of this.body.body)
      e.static || e instanceof zi && e.kind === "constructor" || e.deoptimizePath(B);
    this.context.requestTreeshakingPass();
  }
  getObjectEntity() {
    if (this.objectEntity !== null)
      return this.objectEntity;
    const e = [], t = [];
    for (const i of this.body.body) {
      const s = i.static ? e : t, n2 = i.kind;
      if (s === t && !n2)
        continue;
      const r2 = n2 === "set" || n2 === "get" ? n2 : "init";
      let a3;
      if (i.computed) {
        const e2 = i.key.getLiteralValueAtPath(V, G, this);
        if (typeof e2 == "symbol") {
          s.push({ key: M, kind: r2, property: i });
          continue;
        }
        a3 = String(e2);
      } else
        a3 = i.key instanceof ni ? i.key.name : String(i.key.value);
      s.push({ key: a3, kind: r2, property: i });
    }
    return e.unshift({ key: "prototype", kind: "init", property: new Et(t, this.superClass ? new ji(this.superClass, "prototype") : St) }), this.objectEntity = new Et(e, this.superClass || St);
  }
}
class Gi extends Ui {
  initialise() {
    super.initialise(), this.id !== null && (this.id.variable.isId = true);
  }
  parseNode(e) {
    e.id !== null && (this.id = new ni(e.id, this, this.scope.parent)), super.parseNode(e);
  }
  render(e, t) {
    const { exportNamesByVariable: i, format: s, snippets: { _: n2 } } = t;
    s === "system" && this.id && i.has(this.id.variable) && e.appendLeft(this.end, `${n2}${Si([this.id.variable], t)};`), super.render(e, t);
  }
}
class Hi extends K {
  constructor(e) {
    super(), this.expressions = e, this.included = false;
  }
  deoptimizePath(e) {
    for (const t of this.expressions)
      t.deoptimizePath(e);
  }
  getReturnExpressionWhenCalledAtPath(e, t, i, s) {
    return new Hi(this.expressions.map((n2) => n2.getReturnExpressionWhenCalledAtPath(e, t, i, s)));
  }
  hasEffectsOnInteractionAtPath(e, t, i) {
    for (const s of this.expressions)
      if (s.hasEffectsOnInteractionAtPath(e, t, i))
        return true;
    return false;
  }
  include(e, t) {
    for (const i of this.expressions)
      i.included || i.include(e, t);
  }
}
class Wi extends ut {
  hasEffects() {
    return false;
  }
  initialise() {
    this.context.addExport(this);
  }
  render(e, t, i) {
    e.remove(i.start, i.end);
  }
  applyDeoptimizations() {
  }
}
Wi.prototype.needsBoundaries = true;
class qi extends _i {
  initialise() {
    super.initialise(), this.id !== null && (this.id.variable.isId = true);
  }
  parseNode(e) {
    e.id !== null && (this.id = new ni(e.id, this, this.scope.parent)), super.parseNode(e);
  }
}
class Ki extends ut {
  include(e, t) {
    super.include(e, t), t && this.context.includeVariableInModule(this.variable);
  }
  initialise() {
    const e = this.declaration;
    this.declarationName = e.id && e.id.name || this.declaration.name, this.variable = this.scope.addExportDefaultDeclaration(this.declarationName || this.context.getModuleName(), this, this.context), this.context.addExport(this);
  }
  render(e, t, i) {
    const { start: s, end: n2 } = i, r2 = function(e2, t2) {
      return ui(e2, hi(e2, "default", t2) + 7);
    }(e.original, this.start);
    if (this.declaration instanceof qi)
      this.renderNamedDeclaration(e, r2, "function", "(", this.declaration.id === null, t);
    else if (this.declaration instanceof Gi)
      this.renderNamedDeclaration(e, r2, "class", "{", this.declaration.id === null, t);
    else {
      if (this.variable.getOriginalVariable() !== this.variable)
        return void ai(this, e, s, n2);
      if (!this.variable.included)
        return e.remove(this.start, r2), this.declaration.render(e, t, { renderedSurroundingElement: "ExpressionStatement" }), void (e.original[this.end - 1] !== ";" && e.appendLeft(this.end, ";"));
      this.renderVariableDeclaration(e, r2, t);
    }
    this.declaration.render(e, t);
  }
  applyDeoptimizations() {
  }
  renderNamedDeclaration(e, t, i, s, n2, r2) {
    const { exportNamesByVariable: a3, format: o2, snippets: { getPropertyAccess: l2 } } = r2, h2 = this.variable.getName(l2);
    e.remove(this.start, t), n2 && e.appendLeft(function(e2, t2, i2, s2) {
      const n3 = hi(e2, t2, s2) + t2.length;
      e2 = e2.slice(n3, hi(e2, i2, n3));
      const r3 = hi(e2, "*");
      return r3 === -1 ? n3 : n3 + r3 + 1;
    }(e.original, i, s, t), ` ${h2}`), o2 === "system" && this.declaration instanceof Gi && a3.has(this.variable) && e.appendLeft(this.end, ` ${Si([this.variable], r2)};`);
  }
  renderVariableDeclaration(e, t, { format: i, exportNamesByVariable: s, snippets: { cnst: n2, getPropertyAccess: r2 } }) {
    const a3 = e.original.charCodeAt(this.end - 1) === 59, o2 = i === "system" && s.get(this.variable);
    o2 ? (e.overwrite(this.start, t, `${n2} ${this.variable.getName(r2)} = exports('${o2[0]}', `), e.appendRight(a3 ? this.end - 1 : this.end, ")" + (a3 ? "" : ";"))) : (e.overwrite(this.start, t, `${n2} ${this.variable.getName(r2)} = `), a3 || e.appendLeft(this.end, ";"));
  }
}
Ki.prototype.needsBoundaries = true;
class Xi extends ut {
  bind() {
    var e;
    (e = this.declaration) === null || e === void 0 || e.bind();
  }
  hasEffects(e) {
    var t;
    return !!((t = this.declaration) === null || t === void 0 ? void 0 : t.hasEffects(e));
  }
  initialise() {
    this.context.addExport(this);
  }
  render(e, t, i) {
    const { start: s, end: n2 } = i;
    this.declaration === null ? e.remove(s, n2) : (e.remove(this.start, this.declaration.start), this.declaration.render(e, t, { end: n2, start: s }));
  }
  applyDeoptimizations() {
  }
}
Xi.prototype.needsBoundaries = true;
class Yi extends gi {
  constructor() {
    super(...arguments), this.hoistedDeclarations = [];
  }
  addDeclaration(e, t, i, s) {
    return this.hoistedDeclarations.push(e), super.addDeclaration(e, t, i, s);
  }
}
const Qi = Symbol("unset");
class Zi extends ut {
  constructor() {
    super(...arguments), this.testValue = Qi;
  }
  deoptimizeCache() {
    this.testValue = W;
  }
  hasEffects(e) {
    var t;
    if (this.test.hasEffects(e))
      return true;
    const i = this.getTestValue();
    if (typeof i == "symbol") {
      const { brokenFlow: t2 } = e;
      if (this.consequent.hasEffects(e))
        return true;
      const i2 = e.brokenFlow;
      return e.brokenFlow = t2, this.alternate === null ? false : !!this.alternate.hasEffects(e) || (e.brokenFlow = e.brokenFlow < i2 ? e.brokenFlow : i2, false);
    }
    return i ? this.consequent.hasEffects(e) : !!((t = this.alternate) === null || t === void 0 ? void 0 : t.hasEffects(e));
  }
  include(e, t) {
    if (this.included = true, t)
      this.includeRecursively(t, e);
    else {
      const t2 = this.getTestValue();
      typeof t2 == "symbol" ? this.includeUnknownTest(e) : this.includeKnownTest(e, t2);
    }
  }
  parseNode(e) {
    this.consequentScope = new Yi(this.scope), this.consequent = new (this.context.getNodeConstructor(e.consequent.type))(e.consequent, this, this.consequentScope), e.alternate && (this.alternateScope = new Yi(this.scope), this.alternate = new (this.context.getNodeConstructor(e.alternate.type))(e.alternate, this, this.alternateScope)), super.parseNode(e);
  }
  render(e, t) {
    const { snippets: { getPropertyAccess: i } } = t, s = this.getTestValue(), n2 = [], r2 = this.test.included, a3 = !this.context.options.treeshake;
    r2 ? this.test.render(e, t) : e.remove(this.start, this.consequent.start), this.consequent.included && (a3 || typeof s == "symbol" || s) ? this.consequent.render(e, t) : (e.overwrite(this.consequent.start, this.consequent.end, r2 ? ";" : ""), n2.push(...this.consequentScope.hoistedDeclarations)), this.alternate && (!this.alternate.included || !a3 && typeof s != "symbol" && s ? (r2 && this.shouldKeepAlternateBranch() ? e.overwrite(this.alternate.start, this.end, ";") : e.remove(this.consequent.end, this.end), n2.push(...this.alternateScope.hoistedDeclarations)) : (r2 ? e.original.charCodeAt(this.alternate.start - 1) === 101 && e.prependLeft(this.alternate.start, " ") : e.remove(this.consequent.end, this.alternate.start), this.alternate.render(e, t))), this.renderHoistedDeclarations(n2, e, i);
  }
  applyDeoptimizations() {
  }
  getTestValue() {
    return this.testValue === Qi ? this.testValue = this.test.getLiteralValueAtPath(V, G, this) : this.testValue;
  }
  includeKnownTest(e, t) {
    var i;
    this.test.shouldBeIncluded(e) && this.test.include(e, false), t && this.consequent.shouldBeIncluded(e) && this.consequent.include(e, false, { asSingleStatement: true }), !t && ((i = this.alternate) === null || i === void 0 ? void 0 : i.shouldBeIncluded(e)) && this.alternate.include(e, false, { asSingleStatement: true });
  }
  includeRecursively(e, t) {
    var i;
    this.test.include(t, e), this.consequent.include(t, e), (i = this.alternate) === null || i === void 0 || i.include(t, e);
  }
  includeUnknownTest(e) {
    var t;
    this.test.include(e, false);
    const { brokenFlow: i } = e;
    let s = 0;
    this.consequent.shouldBeIncluded(e) && (this.consequent.include(e, false, { asSingleStatement: true }), s = e.brokenFlow, e.brokenFlow = i), ((t = this.alternate) === null || t === void 0 ? void 0 : t.shouldBeIncluded(e)) && (this.alternate.include(e, false, { asSingleStatement: true }), e.brokenFlow = e.brokenFlow < s ? e.brokenFlow : s);
  }
  renderHoistedDeclarations(e, t, i) {
    const s = [...new Set(e.map((e2) => {
      const t2 = e2.variable;
      return t2.included ? t2.getName(i) : "";
    }))].filter(Boolean).join(", ");
    if (s) {
      const e2 = this.parent.type, i2 = e2 !== "Program" && e2 !== "BlockStatement";
      t.prependRight(this.start, `${i2 ? "{ " : ""}var ${s}; `), i2 && t.appendLeft(this.end, " }");
    }
  }
  shouldKeepAlternateBranch() {
    let e = this.parent;
    do {
      if (e instanceof Zi && e.alternate)
        return true;
      if (e instanceof xi)
        return false;
      e = e.parent;
    } while (e);
    return false;
  }
}
class Ji extends ut {
  bind() {
  }
  hasEffects() {
    return false;
  }
  initialise() {
    this.context.addImport(this);
  }
  render(e, t, i) {
    e.remove(i.start, i.end);
  }
  applyDeoptimizations() {
  }
}
Ji.prototype.needsBoundaries = true;
const es = { auto: "_interopDefault", default: null, defaultOnly: null, esModule: null, false: null, true: "_interopDefaultLegacy" }, ts = (e, t) => e === "esModule" || t && (e === "auto" || e === "true"), is = { auto: "_interopNamespace", default: "_interopNamespaceDefault", defaultOnly: "_interopNamespaceDefaultOnly", esModule: null, false: null, true: "_interopNamespace" }, ss = (e, t) => ts(e, t) && es[e] === "_interopDefault", ns = (e, t, i, s, n2, r2, a3) => {
  const o2 = new Set(e);
  for (const e2 of ys)
    t.has(e2) && o2.add(e2);
  return ys.map((e2) => o2.has(e2) ? rs[e2](i, s, n2, r2, a3, o2) : "").join("");
}, rs = { _interopDefaultLegacy(e, t, i) {
  const { _: s, getDirectReturnFunction: n2, n: r2 } = t, [a3, o2] = n2(["e"], { functionReturn: true, lineBreakIndent: null, name: "_interopDefaultLegacy" });
  return `${a3}e${s}&&${s}typeof e${s}===${s}'object'${s}&&${s}'default'${s}in e${s}?${s}${i ? as(t) : os(t)}${o2}${r2}${r2}`;
}, _interopDefault(e, t, i) {
  const { _: s, getDirectReturnFunction: n2, n: r2 } = t, [a3, o2] = n2(["e"], { functionReturn: true, lineBreakIndent: null, name: "_interopDefault" });
  return `${a3}e${s}&&${s}e.__esModule${s}?${s}${i ? as(t) : os(t)}${o2}${r2}${r2}`;
}, _interopNamespaceDefaultOnly(e, t, i, s, n2) {
  const { getDirectReturnFunction: r2, getObject: a3, n: o2 } = t, [l2, h2] = r2(["e"], { functionReturn: true, lineBreakIndent: null, name: "_interopNamespaceDefaultOnly" });
  return `${l2}${ms(s, gs(n2, a3([["__proto__", "null"], ["default", "e"]], { lineBreakIndent: null }), t))}${h2}${o2}${o2}`;
}, _interopNamespaceDefault(e, t, i, s, n2) {
  const { _: r2, n: a3 } = t;
  return `function _interopNamespaceDefault(e)${r2}{${a3}` + ls(e, e, t, i, s, n2) + `}${a3}${a3}`;
}, _interopNamespace(e, t, i, s, n2, r2) {
  const { _: a3, getDirectReturnFunction: o2, n: l2 } = t;
  if (r2.has("_interopNamespaceDefault")) {
    const [e2, t2] = o2(["e"], { functionReturn: true, lineBreakIndent: null, name: "_interopNamespace" });
    return `${e2}e${a3}&&${a3}e.__esModule${a3}?${a3}e${a3}:${a3}_interopNamespaceDefault(e)${t2}${l2}${l2}`;
  }
  return `function _interopNamespace(e)${a3}{${l2}${e}if${a3}(e${a3}&&${a3}e.__esModule)${a3}return e;${l2}` + ls(e, e, t, i, s, n2) + `}${l2}${l2}`;
}, _mergeNamespaces(e, t, i, s, n2) {
  const { _: r2, cnst: a3, n: o2 } = t, l2 = a3 === "var" && i;
  return `function _mergeNamespaces(n, m)${r2}{${o2}${e}${cs(`{${o2}${e}${e}${e}if${r2}(k${r2}!==${r2}'default'${r2}&&${r2}!(k in n))${r2}{${o2}` + (i ? l2 ? ds : ps : fs)(e, e + e + e + e, t) + `${e}${e}${e}}${o2}${e}${e}}`, l2, e, t)}${o2}${e}return ${ms(s, gs(n2, "n", t))};${o2}}${o2}${o2}`;
} }, as = ({ _: e, getObject: t }) => `e${e}:${e}${t([["default", "e"]], { lineBreakIndent: null })}`, os = ({ _: e, getPropertyAccess: t }) => `e${t("default")}${e}:${e}e`, ls = (e, t, i, s, n2, r2) => {
  const { _: a3, cnst: o2, getObject: l2, getPropertyAccess: h2, n: c2, s: u2 } = i, d2 = `{${c2}` + (s ? us : fs)(e, t + e + e, i) + `${t}${e}}`;
  return `${t}${o2} n${a3}=${a3}Object.create(null${r2 ? `,${a3}{${a3}[Symbol.toStringTag]:${a3}${xs(l2)}${a3}}` : ""});${c2}${t}if${a3}(e)${a3}{${c2}${t}${e}${hs(d2, !s, i)}${c2}${t}}${c2}${t}n${h2("default")}${a3}=${a3}e;${c2}${t}return ${ms(n2, "n")}${u2}${c2}`;
}, hs = (e, t, { _: i, cnst: s, getFunctionIntro: n2, s: r2 }) => s !== "var" || t ? `for${i}(${s} k in e)${i}${e}` : `Object.keys(e).forEach(${n2(["k"], { isAsync: false, name: null })}${e})${r2}`, cs = (e, t, i, { _: s, cnst: n2, getDirectReturnFunction: r2, getFunctionIntro: a3, n: o2 }) => {
  if (t) {
    const [t2, n3] = r2(["e"], { functionReturn: false, lineBreakIndent: { base: i, t: i }, name: null });
    return `m.forEach(${t2}e${s}&&${s}typeof e${s}!==${s}'string'${s}&&${s}!Array.isArray(e)${s}&&${s}Object.keys(e).forEach(${a3(["k"], { isAsync: false, name: null })}${e})${n3});`;
  }
  return `for${s}(var i${s}=${s}0;${s}i${s}<${s}m.length;${s}i++)${s}{${o2}${i}${i}${n2} e${s}=${s}m[i];${o2}${i}${i}if${s}(typeof e${s}!==${s}'string'${s}&&${s}!Array.isArray(e))${s}{${s}for${s}(${n2} k in e)${s}${e}${s}}${o2}${i}}`;
}, us = (e, t, i) => {
  const { _: s, n: n2 } = i;
  return `${t}if${s}(k${s}!==${s}'default')${s}{${n2}` + ds(e, t + e, i) + `${t}}${n2}`;
}, ds = (e, t, { _: i, cnst: s, getDirectReturnFunction: n2, n: r2 }) => {
  const [a3, o2] = n2([], { functionReturn: true, lineBreakIndent: null, name: null });
  return `${t}${s} d${i}=${i}Object.getOwnPropertyDescriptor(e,${i}k);${r2}${t}Object.defineProperty(n,${i}k,${i}d.get${i}?${i}d${i}:${i}{${r2}${t}${e}enumerable:${i}true,${r2}${t}${e}get:${i}${a3}e[k]${o2}${r2}${t}});${r2}`;
}, ps = (e, t, { _: i, cnst: s, getDirectReturnFunction: n2, n: r2 }) => {
  const [a3, o2] = n2([], { functionReturn: true, lineBreakIndent: null, name: null });
  return `${t}${s} d${i}=${i}Object.getOwnPropertyDescriptor(e,${i}k);${r2}${t}if${i}(d)${i}{${r2}${t}${e}Object.defineProperty(n,${i}k,${i}d.get${i}?${i}d${i}:${i}{${r2}${t}${e}${e}enumerable:${i}true,${r2}${t}${e}${e}get:${i}${a3}e[k]${o2}${r2}${t}${e}});${r2}${t}}${r2}`;
}, fs = (e, t, { _: i, n: s }) => `${t}n[k]${i}=${i}e[k];${s}`, ms = (e, t) => e ? `Object.freeze(${t})` : t, gs = (e, t, { _: i, getObject: s }) => e ? `Object.defineProperty(${t},${i}Symbol.toStringTag,${i}${xs(s)})` : t, ys = Object.keys(rs);
function xs(e) {
  return e([["value", "'Module'"]], { lineBreakIndent: null });
}
function Es(e, t, i) {
  return t === "external" ? is[String(i(e instanceof $e ? e.id : null))] : t === "default" ? "_interopNamespaceDefaultOnly" : null;
}
const bs = { amd: ["require"], cjs: ["require"], system: ["module"] };
const vs = "ROLLUP_ASSET_URL_", Ss = "ROLLUP_FILE_URL_";
const As = { amd: ["document", "module", "URL"], cjs: ["document", "require", "URL"], es: [], iife: ["document", "URL"], system: ["module"], umd: ["document", "require", "URL"] }, Is = { amd: ["document", "require", "URL"], cjs: ["document", "require", "URL"], es: [], iife: ["document", "URL"], system: ["module", "URL"], umd: ["document", "require", "URL"] }, ks = (e, t = "URL") => `new ${t}(${e}).href`, Ps = (e, t = false) => ks(`'${e}', ${t ? "typeof document === 'undefined' ? location.href : " : ""}document.currentScript && document.currentScript.src || document.baseURI`), ws = (e) => (t, { chunkId: i }) => {
  const s = e(i);
  return t === null ? `({ url: ${s} })` : t === "url" ? s : "undefined";
}, Cs = (e, t = false) => `${t ? "typeof document === 'undefined' ? location.href : " : ""}(document.currentScript && document.currentScript.src || new URL('${e}', document.baseURI).href)`, _s = { amd: (e) => (e[0] !== "." && (e = "./" + e), ks(`require.toUrl('${e}'), document.baseURI`)), cjs: (e) => `(typeof document === 'undefined' ? ${ks(`'file:' + __dirname + '/${e}'`, "(require('u' + 'rl').URL)")} : ${Ps(e)})`, es: (e) => ks(`'${e}', import.meta.url`), iife: (e) => Ps(e), system: (e) => ks(`'${e}', module.meta.url`), umd: (e) => `(typeof document === 'undefined' && typeof location === 'undefined' ? ${ks(`'file:' + __dirname + '/${e}'`, "(require('u' + 'rl').URL)")} : ${Ps(e, true)})` }, Ns = { amd: ws(() => ks("module.uri, document.baseURI")), cjs: ws((e) => `(typeof document === 'undefined' ? ${ks("'file:' + __filename", "(require('u' + 'rl').URL)")} : ${Cs(e)})`), iife: ws((e) => Cs(e)), system: (e, { snippets: { getPropertyAccess: t } }) => e === null ? "module.meta" : `module.meta${t(e)}`, umd: ws((e) => `(typeof document === 'undefined' && typeof location === 'undefined' ? ${ks("'file:' + __filename", "(require('u' + 'rl').URL)")} : ${Cs(e, true)})`) };
class $s extends ut {
  constructor() {
    super(...arguments), this.hasCachedEffect = false;
  }
  hasEffects(e) {
    if (this.hasCachedEffect)
      return true;
    for (const t of this.body)
      if (t.hasEffects(e))
        return this.hasCachedEffect = true;
    return false;
  }
  include(e, t) {
    this.included = true;
    for (const i of this.body)
      (t || i.shouldBeIncluded(e)) && i.include(e, t);
  }
  render(e, t) {
    this.body.length ? pi(this.body, e, this.start, this.end, t) : super.render(e, t);
  }
  applyDeoptimizations() {
  }
}
class Ts extends ut {
  hasEffects(e) {
    var t;
    if ((t = this.test) === null || t === void 0 ? void 0 : t.hasEffects(e))
      return true;
    for (const t2 of this.consequent) {
      if (e.brokenFlow)
        break;
      if (t2.hasEffects(e))
        return true;
    }
    return false;
  }
  include(e, t) {
    var i;
    this.included = true, (i = this.test) === null || i === void 0 || i.include(e, t);
    for (const i2 of this.consequent)
      (t || i2.shouldBeIncluded(e)) && i2.include(e, t);
  }
  render(e, t, i) {
    if (this.consequent.length) {
      this.test && this.test.render(e, t);
      const s = this.test ? this.test.end : hi(e.original, "default", this.start) + 7, n2 = hi(e.original, ":", s) + 1;
      pi(this.consequent, e, n2, i.end, t);
    } else
      super.render(e, t);
  }
}
Ts.prototype.needsBoundaries = true;
class Os extends ut {
  deoptimizeThisOnInteractionAtPath() {
  }
  getLiteralValueAtPath(e) {
    return e.length > 0 || this.quasis.length !== 1 ? W : this.quasis[0].value.cooked;
  }
  getReturnExpressionWhenCalledAtPath(e) {
    return e.length !== 1 ? X : Qe(Xe, e[0]);
  }
  hasEffectsOnInteractionAtPath(e, t, i) {
    return t.type === 0 ? e.length > 1 : t.type !== 2 || e.length !== 1 || Ye(Xe, e[0], t, i);
  }
  render(e, t) {
    e.indentExclusionRanges.push([this.start, this.end]), super.render(e, t);
  }
}
class Rs extends ee {
  constructor() {
    super("undefined");
  }
  getLiteralValueAtPath() {
  }
}
class Ms extends Dt {
  constructor(e, t, i) {
    super(e, t, t.declaration, i), this.hasId = false, this.originalId = null, this.originalVariable = null;
    const s = t.declaration;
    (s instanceof qi || s instanceof Gi) && s.id ? (this.hasId = true, this.originalId = s.id) : s instanceof ni && (this.originalId = s);
  }
  addReference(e) {
    this.hasId || (this.name = e.name);
  }
  getAssignedVariableName() {
    return this.originalId && this.originalId.name || null;
  }
  getBaseVariableName() {
    const e = this.getOriginalVariable();
    return e === this ? super.getBaseVariableName() : e.getBaseVariableName();
  }
  getDirectOriginalVariable() {
    return !this.originalId || !this.hasId && (this.originalId.isPossibleTDZ() || this.originalId.variable.isReassigned || this.originalId.variable instanceof Rs || "syntheticNamespace" in this.originalId.variable) ? null : this.originalId.variable;
  }
  getName(e) {
    const t = this.getOriginalVariable();
    return t === this ? super.getName(e) : t.getName(e);
  }
  getOriginalVariable() {
    if (this.originalVariable)
      return this.originalVariable;
    let e, t = this;
    const i = /* @__PURE__ */ new Set();
    do {
      i.add(t), e = t, t = e.getDirectOriginalVariable();
    } while (t instanceof Ms && !i.has(t));
    return this.originalVariable = t || e;
  }
}
class Ds extends Ft {
  constructor(e, t) {
    super(e), this.context = t, this.variables.set("this", new Dt("this", null, Le, t));
  }
  addExportDefaultDeclaration(e, t, i) {
    const s = new Ms(e, t, i);
    return this.variables.set("default", s), s;
  }
  addNamespaceMemberAccess() {
  }
  deconflict(e, t, i) {
    for (const s of this.children)
      s.deconflict(e, t, i);
  }
  findLexicalBoundary() {
    return this;
  }
  findVariable(e) {
    const t = this.variables.get(e) || this.accessedOutsideVariables.get(e);
    if (t)
      return t;
    const i = this.context.traceVariable(e) || this.parent.findVariable(e);
    return i instanceof ii && this.accessedOutsideVariables.set(e, i), i;
  }
}
const Ls = { "!": (e) => !e, "+": (e) => +e, "-": (e) => -e, delete: () => W, typeof: (e) => typeof e, void: () => {
}, "~": (e) => ~e };
function Vs(e, t) {
  return e.renderBaseName !== null && t.has(e) && e.isReassigned;
}
class Bs extends ut {
  deoptimizePath() {
    for (const e of this.declarations)
      e.deoptimizePath(V);
  }
  hasEffectsOnInteractionAtPath() {
    return false;
  }
  include(e, t, { asSingleStatement: i } = ie) {
    this.included = true;
    for (const s of this.declarations)
      (t || s.shouldBeIncluded(e)) && s.include(e, t), i && s.id.include(e, t);
  }
  initialise() {
    for (const e of this.declarations)
      e.declareDeclarator(this.kind);
  }
  render(e, t, i = ie) {
    if (function(e2, t2) {
      for (const i2 of e2) {
        if (!i2.id.included)
          return false;
        if (i2.id.type === "Identifier") {
          if (t2.has(i2.id.variable))
            return false;
        } else {
          const e3 = [];
          if (i2.id.addExportedVariables(e3, t2), e3.length > 0)
            return false;
        }
      }
      return true;
    }(this.declarations, t.exportNamesByVariable)) {
      for (const i2 of this.declarations)
        i2.render(e, t);
      i.isNoStatement || e.original.charCodeAt(this.end - 1) === 59 || e.appendLeft(this.end, ";");
    } else
      this.renderReplacedDeclarations(e, t);
  }
  applyDeoptimizations() {
  }
  renderDeclarationEnd(e, t, i, s, n2, r2, a3) {
    e.original.charCodeAt(this.end - 1) === 59 && e.remove(this.end - 1, this.end), t += ";", i !== null ? (e.original.charCodeAt(s - 1) !== 10 || e.original.charCodeAt(this.end) !== 10 && e.original.charCodeAt(this.end) !== 13 || (s--, e.original.charCodeAt(s) === 13 && s--), s === i + 1 ? e.overwrite(i, n2, t) : (e.overwrite(i, i + 1, t), e.remove(s, n2))) : e.appendLeft(n2, t), r2.length > 0 && e.appendLeft(n2, ` ${Si(r2, a3)};`);
  }
  renderReplacedDeclarations(e, t) {
    const i = fi(this.declarations, e, this.start + this.kind.length, this.end - (e.original.charCodeAt(this.end - 1) === 59 ? 1 : 0));
    let s, n2;
    n2 = ui(e.original, this.start + this.kind.length);
    let r2 = n2 - 1;
    e.remove(this.start, r2);
    let a3, l2 = false, h2 = false, c2 = "";
    const u2 = [], d2 = function(e2, t2, i2) {
      var s2;
      let n3 = null;
      if (t2.format === "system") {
        for (const { node: r3 } of e2)
          r3.id instanceof ni && r3.init && i2.length === 0 && ((s2 = t2.exportNamesByVariable.get(r3.id.variable)) === null || s2 === void 0 ? void 0 : s2.length) === 1 ? (n3 = r3.id.variable, i2.push(n3)) : r3.id.addExportedVariables(i2, t2.exportNamesByVariable);
        i2.length > 1 ? n3 = null : n3 && (i2.length = 0);
      }
      return n3;
    }(i, t, u2);
    for (const { node: u3, start: p2, separator: f2, contentEnd: m3, end: g2 } of i)
      if (u3.included) {
        if (u3.render(e, t), a3 = "", !u3.id.included || u3.id instanceof ni && Vs(u3.id.variable, t.exportNamesByVariable))
          h2 && (c2 += ";"), l2 = false;
        else {
          if (d2 && d2 === u3.id.variable) {
            const i2 = hi(e.original, "=", u3.id.end);
            Ai(d2, ui(e.original, i2 + 1), f2 === null ? m3 : f2, e, t);
          }
          l2 ? c2 += "," : (h2 && (c2 += ";"), a3 += `${this.kind} `, l2 = true);
        }
        n2 === r2 + 1 ? e.overwrite(r2, n2, c2 + a3) : (e.overwrite(r2, r2 + 1, c2), e.appendLeft(n2, a3)), s = m3, n2 = g2, h2 = true, r2 = f2, c2 = "";
      } else
        e.remove(p2, g2);
    this.renderDeclarationEnd(e, c2, r2, s, n2, u2, t);
  }
}
const Fs = { ArrayExpression: class extends ut {
  constructor() {
    super(...arguments), this.objectEntity = null;
  }
  deoptimizePath(e) {
    this.getObjectEntity().deoptimizePath(e);
  }
  deoptimizeThisOnInteractionAtPath(e, t, i) {
    this.getObjectEntity().deoptimizeThisOnInteractionAtPath(e, t, i);
  }
  getLiteralValueAtPath(e, t, i) {
    return this.getObjectEntity().getLiteralValueAtPath(e, t, i);
  }
  getReturnExpressionWhenCalledAtPath(e, t, i, s) {
    return this.getObjectEntity().getReturnExpressionWhenCalledAtPath(e, t, i, s);
  }
  hasEffectsOnInteractionAtPath(e, t, i) {
    return this.getObjectEntity().hasEffectsOnInteractionAtPath(e, t, i);
  }
  applyDeoptimizations() {
    this.deoptimized = true;
    let e = false;
    for (let t = 0; t < this.elements.length; t++) {
      const i = this.elements[t];
      i && (e || i instanceof dt) && (e = true, i.deoptimizePath(B));
    }
    this.context.requestTreeshakingPass();
  }
  getObjectEntity() {
    if (this.objectEntity !== null)
      return this.objectEntity;
    const e = [{ key: "length", kind: "init", property: ze }];
    let t = false;
    for (let i = 0; i < this.elements.length; i++) {
      const s = this.elements[i];
      t || s instanceof dt ? s && (t = true, e.unshift({ key: L, kind: "init", property: s })) : s ? e.push({ key: String(i), kind: "init", property: s }) : e.push({ key: String(i), kind: "init", property: Le });
    }
    return this.objectEntity = new Et(e, Mt);
  }
}, ArrayPattern: class extends ut {
  addExportedVariables(e, t) {
    for (const i of this.elements)
      i == null || i.addExportedVariables(e, t);
  }
  declare(e) {
    const t = [];
    for (const i of this.elements)
      i !== null && t.push(...i.declare(e, X));
    return t;
  }
  deoptimizePath() {
    for (const e of this.elements)
      e == null || e.deoptimizePath(V);
  }
  hasEffectsOnInteractionAtPath(e, t, i) {
    for (const e2 of this.elements)
      if (e2 == null ? void 0 : e2.hasEffectsOnInteractionAtPath(V, t, i))
        return true;
    return false;
  }
  markDeclarationReached() {
    for (const e of this.elements)
      e == null || e.markDeclarationReached();
  }
}, ArrowFunctionExpression: vi, AssignmentExpression: class extends ut {
  hasEffects(e) {
    const { deoptimized: t, left: i, right: s } = this;
    return t || this.applyDeoptimizations(), s.hasEffects(e) || i.hasEffectsAsAssignmentTarget(e, this.operator !== "=");
  }
  hasEffectsOnInteractionAtPath(e, t, i) {
    return this.right.hasEffectsOnInteractionAtPath(e, t, i);
  }
  include(e, t) {
    const { deoptimized: i, left: s, right: n2, operator: r2 } = this;
    i || this.applyDeoptimizations(), this.included = true, (t || r2 !== "=" || s.included || s.hasEffectsAsAssignmentTarget(Me(), false)) && s.includeAsAssignmentTarget(e, t, r2 !== "="), n2.include(e, t);
  }
  initialise() {
    this.left.setAssignedValue(this.right);
  }
  render(e, t, { preventASI: i, renderedParentType: s, renderedSurroundingElement: n2 } = ie) {
    const { left: r2, right: a3, start: o2, end: l2, parent: h2 } = this;
    if (r2.included)
      r2.render(e, t), a3.render(e, t);
    else {
      const l3 = ui(e.original, hi(e.original, "=", r2.end) + 1);
      e.remove(o2, l3), i && mi(e, l3, a3.start), a3.render(e, t, { renderedParentType: s || h2.type, renderedSurroundingElement: n2 || h2.type });
    }
    if (t.format === "system")
      if (r2 instanceof ni) {
        const i2 = r2.variable, s2 = t.exportNamesByVariable.get(i2);
        if (s2)
          return void (s2.length === 1 ? Ai(i2, o2, l2, e, t) : Ii(i2, o2, l2, h2.type !== "ExpressionStatement", e, t));
      } else {
        const i2 = [];
        if (r2.addExportedVariables(i2, t.exportNamesByVariable), i2.length > 0)
          return void function(e2, t2, i3, s2, n3, r3) {
            const { _: a4, getDirectReturnIifeLeft: o3 } = r3.snippets;
            n3.prependRight(t2, o3(["v"], `${Si(e2, r3)},${a4}v`, { needsArrowReturnParens: true, needsWrappedFunction: s2 })), n3.appendLeft(i3, ")");
          }(i2, o2, l2, n2 === "ExpressionStatement", e, t);
      }
    r2.included && r2 instanceof ki && (n2 === "ExpressionStatement" || n2 === "ArrowFunctionExpression") && (e.appendRight(o2, "("), e.prependLeft(l2, ")"));
  }
  applyDeoptimizations() {
    this.deoptimized = true, this.left.deoptimizePath(V), this.right.deoptimizePath(B), this.context.requestTreeshakingPass();
  }
}, AssignmentPattern: class extends ut {
  addExportedVariables(e, t) {
    this.left.addExportedVariables(e, t);
  }
  declare(e, t) {
    return this.left.declare(e, t);
  }
  deoptimizePath(e) {
    e.length === 0 && this.left.deoptimizePath(e);
  }
  hasEffectsOnInteractionAtPath(e, t, i) {
    return e.length > 0 || this.left.hasEffectsOnInteractionAtPath(V, t, i);
  }
  markDeclarationReached() {
    this.left.markDeclarationReached();
  }
  render(e, t, { isShorthandProperty: i } = ie) {
    this.left.render(e, t, { isShorthandProperty: i }), this.right.render(e, t);
  }
  applyDeoptimizations() {
    this.deoptimized = true, this.left.deoptimizePath(V), this.right.deoptimizePath(B), this.context.requestTreeshakingPass();
  }
}, AwaitExpression: class extends ut {
  hasEffects() {
    return this.deoptimized || this.applyDeoptimizations(), true;
  }
  include(e, t) {
    if (this.deoptimized || this.applyDeoptimizations(), !this.included) {
      this.included = true;
      e:
        if (!this.context.usesTopLevelAwait) {
          let e2 = this.parent;
          do {
            if (e2 instanceof _i || e2 instanceof vi)
              break e;
          } while (e2 = e2.parent);
          this.context.usesTopLevelAwait = true;
        }
    }
    this.argument.include(e, t);
  }
}, BinaryExpression: class extends ut {
  deoptimizeCache() {
  }
  getLiteralValueAtPath(e, t, i) {
    if (e.length > 0)
      return W;
    const s = this.left.getLiteralValueAtPath(V, t, i);
    if (typeof s == "symbol")
      return W;
    const n2 = this.right.getLiteralValueAtPath(V, t, i);
    if (typeof n2 == "symbol")
      return W;
    const r2 = Ni[this.operator];
    return r2 ? r2(s, n2) : W;
  }
  hasEffects(e) {
    return this.operator === "+" && this.parent instanceof yi && this.left.getLiteralValueAtPath(V, G, this) === "" || super.hasEffects(e);
  }
  hasEffectsOnInteractionAtPath(e, { type: t }) {
    return t !== 0 || e.length > 1;
  }
  render(e, t, { renderedSurroundingElement: i } = ie) {
    this.left.render(e, t, { renderedSurroundingElement: i }), this.right.render(e, t);
  }
}, BlockStatement: xi, BreakStatement: class extends ut {
  hasEffects(e) {
    if (this.label) {
      if (!e.ignore.labels.has(this.label.name))
        return true;
      e.includedLabels.add(this.label.name), e.brokenFlow = 2;
    } else {
      if (!e.ignore.breaks)
        return true;
      e.brokenFlow = 1;
    }
    return false;
  }
  include(e) {
    this.included = true, this.label && (this.label.include(), e.includedLabels.add(this.label.name)), e.brokenFlow = this.label ? 2 : 1;
  }
}, CallExpression: class extends Li {
  bind() {
    if (super.bind(), this.callee instanceof ni) {
      this.scope.findVariable(this.callee.name).isNamespace && this.context.warn({ code: "CANNOT_CALL_NAMESPACE", message: `Cannot call a namespace ('${this.callee.name}')` }, this.start), this.callee.name === "eval" && this.context.warn({ code: "EVAL", message: "Use of eval is strongly discouraged, as it poses security risks and may cause issues with minification", url: "https://rollupjs.org/guide/en/#avoiding-eval" }, this.start);
    }
    this.interaction = { args: this.arguments, thisArg: this.callee instanceof Mi && !this.callee.variable ? this.callee.object : null, type: 2, withNew: false };
  }
  hasEffects(e) {
    try {
      for (const t of this.arguments)
        if (t.hasEffects(e))
          return true;
      return (!this.context.options.treeshake.annotations || !this.annotations) && (this.callee.hasEffects(e) || this.callee.hasEffectsOnInteractionAtPath(V, this.interaction, e));
    } finally {
      this.deoptimized || this.applyDeoptimizations();
    }
  }
  include(e, t) {
    this.deoptimized || this.applyDeoptimizations(), t ? (super.include(e, t), t === "variables" && this.callee instanceof ni && this.callee.variable && this.callee.variable.markCalledFromTryStatement()) : (this.included = true, this.callee.include(e, false)), this.callee.includeCallArguments(e, this.arguments);
    const i = this.getReturnExpression();
    i.included || i.include(e, false);
  }
  render(e, t, { renderedSurroundingElement: i } = ie) {
    this.callee.render(e, t, { isCalleeOfRenderedParent: true, renderedSurroundingElement: i }), $i(e, t, this);
  }
  applyDeoptimizations() {
    this.deoptimized = true, this.interaction.thisArg && this.callee.deoptimizeThisOnInteractionAtPath(this.interaction, V, G);
    for (const e of this.arguments)
      e.deoptimizePath(B);
    this.context.requestTreeshakingPass();
  }
  getReturnExpression(e = G) {
    return this.returnExpression === null ? (this.returnExpression = X, this.returnExpression = this.callee.getReturnExpressionWhenCalledAtPath(V, this.interaction, e, this)) : this.returnExpression;
  }
}, CatchClause: class extends ut {
  createScope(e) {
    this.scope = new Vi(e, this.context);
  }
  parseNode(e) {
    const { param: t } = e;
    t && (this.param = new (this.context.getNodeConstructor(t.type))(t, this, this.scope), this.param.declare("parameter", X)), super.parseNode(e);
  }
}, ChainExpression: class extends ut {
}, ClassBody: class extends ut {
  createScope(e) {
    this.scope = new Bi(e, this.parent, this.context);
  }
  include(e, t) {
    this.included = true, this.context.includeVariableInModule(this.scope.thisVariable);
    for (const i of this.body)
      i.include(e, t);
  }
  parseNode(e) {
    const t = this.body = [];
    for (const i of e.body)
      t.push(new (this.context.getNodeConstructor(i.type))(i, this, i.static ? this.scope : this.scope.instanceScope));
    super.parseNode(e);
  }
  applyDeoptimizations() {
  }
}, ClassDeclaration: Gi, ClassExpression: class extends Ui {
  render(e, t, { renderedSurroundingElement: i } = ie) {
    super.render(e, t), i === "ExpressionStatement" && (e.appendRight(this.start, "("), e.prependLeft(this.end, ")"));
  }
}, ConditionalExpression: class extends ut {
  constructor() {
    super(...arguments), this.expressionsToBeDeoptimized = [], this.isBranchResolutionAnalysed = false, this.usedBranch = null;
  }
  deoptimizeCache() {
    if (this.usedBranch !== null) {
      const e = this.usedBranch === this.consequent ? this.alternate : this.consequent;
      this.usedBranch = null, e.deoptimizePath(B);
      for (const e2 of this.expressionsToBeDeoptimized)
        e2.deoptimizeCache();
    }
  }
  deoptimizePath(e) {
    const t = this.getUsedBranch();
    t ? t.deoptimizePath(e) : (this.consequent.deoptimizePath(e), this.alternate.deoptimizePath(e));
  }
  deoptimizeThisOnInteractionAtPath(e, t, i) {
    this.consequent.deoptimizeThisOnInteractionAtPath(e, t, i), this.alternate.deoptimizeThisOnInteractionAtPath(e, t, i);
  }
  getLiteralValueAtPath(e, t, i) {
    const s = this.getUsedBranch();
    return s ? (this.expressionsToBeDeoptimized.push(i), s.getLiteralValueAtPath(e, t, i)) : W;
  }
  getReturnExpressionWhenCalledAtPath(e, t, i, s) {
    const n2 = this.getUsedBranch();
    return n2 ? (this.expressionsToBeDeoptimized.push(s), n2.getReturnExpressionWhenCalledAtPath(e, t, i, s)) : new Hi([this.consequent.getReturnExpressionWhenCalledAtPath(e, t, i, s), this.alternate.getReturnExpressionWhenCalledAtPath(e, t, i, s)]);
  }
  hasEffects(e) {
    if (this.test.hasEffects(e))
      return true;
    const t = this.getUsedBranch();
    return t ? t.hasEffects(e) : this.consequent.hasEffects(e) || this.alternate.hasEffects(e);
  }
  hasEffectsOnInteractionAtPath(e, t, i) {
    const s = this.getUsedBranch();
    return s ? s.hasEffectsOnInteractionAtPath(e, t, i) : this.consequent.hasEffectsOnInteractionAtPath(e, t, i) || this.alternate.hasEffectsOnInteractionAtPath(e, t, i);
  }
  include(e, t) {
    this.included = true;
    const i = this.getUsedBranch();
    t || this.test.shouldBeIncluded(e) || i === null ? (this.test.include(e, t), this.consequent.include(e, t), this.alternate.include(e, t)) : i.include(e, t);
  }
  includeCallArguments(e, t) {
    const i = this.getUsedBranch();
    i ? i.includeCallArguments(e, t) : (this.consequent.includeCallArguments(e, t), this.alternate.includeCallArguments(e, t));
  }
  render(e, t, { isCalleeOfRenderedParent: i, preventASI: s, renderedParentType: n2, renderedSurroundingElement: r2 } = ie) {
    const a3 = this.getUsedBranch();
    if (this.test.included)
      this.test.render(e, t, { renderedSurroundingElement: r2 }), this.consequent.render(e, t), this.alternate.render(e, t);
    else {
      const o2 = hi(e.original, ":", this.consequent.end), l2 = ui(e.original, (this.consequent.included ? hi(e.original, "?", this.test.end) : o2) + 1);
      s && mi(e, l2, a3.start), e.remove(this.start, l2), this.consequent.included && e.remove(o2, this.end), oi(this, e), a3.render(e, t, { isCalleeOfRenderedParent: i, preventASI: true, renderedParentType: n2 || this.parent.type, renderedSurroundingElement: r2 || this.parent.type });
    }
  }
  getUsedBranch() {
    if (this.isBranchResolutionAnalysed)
      return this.usedBranch;
    this.isBranchResolutionAnalysed = true;
    const e = this.test.getLiteralValueAtPath(V, G, this);
    return typeof e == "symbol" ? null : this.usedBranch = e ? this.consequent : this.alternate;
  }
}, ContinueStatement: class extends ut {
  hasEffects(e) {
    if (this.label) {
      if (!e.ignore.labels.has(this.label.name))
        return true;
      e.includedLabels.add(this.label.name), e.brokenFlow = 2;
    } else {
      if (!e.ignore.continues)
        return true;
      e.brokenFlow = 1;
    }
    return false;
  }
  include(e) {
    this.included = true, this.label && (this.label.include(), e.includedLabels.add(this.label.name)), e.brokenFlow = this.label ? 2 : 1;
  }
}, DoWhileStatement: class extends ut {
  hasEffects(e) {
    if (this.test.hasEffects(e))
      return true;
    const { brokenFlow: t, ignore: { breaks: i, continues: s } } = e;
    return e.ignore.breaks = true, e.ignore.continues = true, !!this.body.hasEffects(e) || (e.ignore.breaks = i, e.ignore.continues = s, e.brokenFlow = t, false);
  }
  include(e, t) {
    this.included = true, this.test.include(e, t);
    const { brokenFlow: i } = e;
    this.body.include(e, t, { asSingleStatement: true }), e.brokenFlow = i;
  }
}, EmptyStatement: class extends ut {
  hasEffects() {
    return false;
  }
}, ExportAllDeclaration: Wi, ExportDefaultDeclaration: Ki, ExportNamedDeclaration: Xi, ExportSpecifier: class extends ut {
  applyDeoptimizations() {
  }
}, ExpressionStatement: yi, ForInStatement: class extends ut {
  createScope(e) {
    this.scope = new gi(e);
  }
  hasEffects(e) {
    const { deoptimized: t, left: i, right: s } = this;
    if (t || this.applyDeoptimizations(), i.hasEffectsAsAssignmentTarget(e, false) || s.hasEffects(e))
      return true;
    const { brokenFlow: n2, ignore: { breaks: r2, continues: a3 } } = e;
    return e.ignore.breaks = true, e.ignore.continues = true, !!this.body.hasEffects(e) || (e.ignore.breaks = r2, e.ignore.continues = a3, e.brokenFlow = n2, false);
  }
  include(e, t) {
    const { body: i, deoptimized: s, left: n2, right: r2 } = this;
    s || this.applyDeoptimizations(), this.included = true, n2.includeAsAssignmentTarget(e, t || true, false), r2.include(e, t);
    const { brokenFlow: a3 } = e;
    i.include(e, t, { asSingleStatement: true }), e.brokenFlow = a3;
  }
  initialise() {
    this.left.setAssignedValue(X);
  }
  render(e, t) {
    this.left.render(e, t, li), this.right.render(e, t, li), e.original.charCodeAt(this.right.start - 1) === 110 && e.prependLeft(this.right.start, " "), this.body.render(e, t);
  }
  applyDeoptimizations() {
    this.deoptimized = true, this.left.deoptimizePath(V), this.context.requestTreeshakingPass();
  }
}, ForOfStatement: class extends ut {
  createScope(e) {
    this.scope = new gi(e);
  }
  hasEffects() {
    return this.deoptimized || this.applyDeoptimizations(), true;
  }
  include(e, t) {
    const { body: i, deoptimized: s, left: n2, right: r2 } = this;
    s || this.applyDeoptimizations(), this.included = true, n2.includeAsAssignmentTarget(e, t || true, false), r2.include(e, t);
    const { brokenFlow: a3 } = e;
    i.include(e, t, { asSingleStatement: true }), e.brokenFlow = a3;
  }
  initialise() {
    this.left.setAssignedValue(X);
  }
  render(e, t) {
    this.left.render(e, t, li), this.right.render(e, t, li), e.original.charCodeAt(this.right.start - 1) === 102 && e.prependLeft(this.right.start, " "), this.body.render(e, t);
  }
  applyDeoptimizations() {
    this.deoptimized = true, this.left.deoptimizePath(V), this.context.requestTreeshakingPass();
  }
}, ForStatement: class extends ut {
  createScope(e) {
    this.scope = new gi(e);
  }
  hasEffects(e) {
    var t, i, s;
    if (((t = this.init) === null || t === void 0 ? void 0 : t.hasEffects(e)) || ((i = this.test) === null || i === void 0 ? void 0 : i.hasEffects(e)) || ((s = this.update) === null || s === void 0 ? void 0 : s.hasEffects(e)))
      return true;
    const { brokenFlow: n2, ignore: { breaks: r2, continues: a3 } } = e;
    return e.ignore.breaks = true, e.ignore.continues = true, !!this.body.hasEffects(e) || (e.ignore.breaks = r2, e.ignore.continues = a3, e.brokenFlow = n2, false);
  }
  include(e, t) {
    var i, s, n2;
    this.included = true, (i = this.init) === null || i === void 0 || i.include(e, t, { asSingleStatement: true }), (s = this.test) === null || s === void 0 || s.include(e, t);
    const { brokenFlow: r2 } = e;
    (n2 = this.update) === null || n2 === void 0 || n2.include(e, t), this.body.include(e, t, { asSingleStatement: true }), e.brokenFlow = r2;
  }
  render(e, t) {
    var i, s, n2;
    (i = this.init) === null || i === void 0 || i.render(e, t, li), (s = this.test) === null || s === void 0 || s.render(e, t, li), (n2 = this.update) === null || n2 === void 0 || n2.render(e, t, li), this.body.render(e, t);
  }
}, FunctionDeclaration: qi, FunctionExpression: class extends _i {
  render(e, t, { renderedSurroundingElement: i } = ie) {
    super.render(e, t), i === "ExpressionStatement" && (e.appendRight(this.start, "("), e.prependLeft(this.end, ")"));
  }
}, Identifier: ni, IfStatement: Zi, ImportDeclaration: Ji, ImportDefaultSpecifier: class extends ut {
  applyDeoptimizations() {
  }
}, ImportExpression: class extends ut {
  constructor() {
    super(...arguments), this.inlineNamespace = null, this.mechanism = null, this.resolution = null;
  }
  hasEffects() {
    return true;
  }
  include(e, t) {
    this.included || (this.included = true, this.context.includeDynamicImport(this), this.scope.addAccessedDynamicImport(this)), this.source.include(e, t);
  }
  initialise() {
    this.context.addDynamicImport(this);
  }
  render(e, t) {
    if (this.inlineNamespace) {
      const { snippets: { getDirectReturnFunction: i, getPropertyAccess: s } } = t, [n2, r2] = i([], { functionReturn: true, lineBreakIndent: null, name: null });
      e.overwrite(this.start, this.end, `Promise.resolve().then(${n2}${this.inlineNamespace.getName(s)}${r2})`, { contentOnly: true });
    } else
      this.mechanism && (e.overwrite(this.start, hi(e.original, "(", this.start + 6) + 1, this.mechanism.left, { contentOnly: true }), e.overwrite(this.end - 1, this.end, this.mechanism.right, { contentOnly: true })), this.source.render(e, t);
  }
  renderFinalResolution(e, t, i, { getDirectReturnFunction: s }) {
    if (e.overwrite(this.source.start, this.source.end, t), i) {
      const [t2, n2] = s(["n"], { functionReturn: true, lineBreakIndent: null, name: null });
      e.prependLeft(this.end, `.then(${t2}n.${i}${n2})`);
    }
  }
  setExternalResolution(e, t, i, s, n2, r2) {
    const { format: a3 } = i;
    this.resolution = t;
    const o2 = [...bs[a3] || []];
    let l2;
    ({ helper: l2, mechanism: this.mechanism } = this.getDynamicImportMechanismAndHelper(t, e, i, s, n2)), l2 && o2.push(l2), o2.length > 0 && this.scope.addAccessedGlobals(o2, r2);
  }
  setInternalResolution(e) {
    this.inlineNamespace = e;
  }
  applyDeoptimizations() {
  }
  getDynamicImportMechanismAndHelper(e, t, { compact: i, dynamicImportFunction: s, format: n2, generatedCode: { arrowFunctions: r2 }, interop: a3 }, { _: o2, getDirectReturnFunction: l2, getDirectReturnIifeLeft: h2 }, c2) {
    const u2 = c2.hookFirstSync("renderDynamicImport", [{ customResolution: typeof this.resolution == "string" ? this.resolution : null, format: n2, moduleId: this.context.module.id, targetModuleId: this.resolution && typeof this.resolution != "string" ? this.resolution.id : null }]);
    if (u2)
      return { helper: null, mechanism: u2 };
    const d2 = !this.resolution || typeof this.resolution == "string";
    switch (n2) {
      case "cjs": {
        const i2 = Es(e, t, a3);
        let s2 = "require(", n3 = ")";
        i2 && (s2 = `/*#__PURE__*/${i2}(${s2}`, n3 += ")");
        const [o3, c3] = l2([], { functionReturn: true, lineBreakIndent: null, name: null });
        return s2 = `Promise.resolve().then(${o3}${s2}`, n3 += `${c3})`, !r2 && d2 && (s2 = h2(["t"], `${s2}t${n3}`, { needsArrowReturnParens: false, needsWrappedFunction: true }), n3 = ")"), { helper: i2, mechanism: { left: s2, right: n3 } };
      }
      case "amd": {
        const s2 = i ? "c" : "resolve", n3 = i ? "e" : "reject", c3 = Es(e, t, a3), [u3, p2] = l2(["m"], { functionReturn: false, lineBreakIndent: null, name: null }), f2 = c3 ? `${u3}${s2}(/*#__PURE__*/${c3}(m))${p2}` : s2, [m3, g2] = l2([s2, n3], { functionReturn: false, lineBreakIndent: null, name: null });
        let y2 = `new Promise(${m3}require([`, x2 = `],${o2}${f2},${o2}${n3})${g2})`;
        return !r2 && d2 && (y2 = h2(["t"], `${y2}t${x2}`, { needsArrowReturnParens: false, needsWrappedFunction: true }), x2 = ")"), { helper: c3, mechanism: { left: y2, right: x2 } };
      }
      case "system":
        return { helper: null, mechanism: { left: "module.import(", right: ")" } };
      case "es":
        if (s)
          return { helper: null, mechanism: { left: `${s}(`, right: ")" } };
    }
    return { helper: null, mechanism: null };
  }
}, ImportNamespaceSpecifier: class extends ut {
  applyDeoptimizations() {
  }
}, ImportSpecifier: class extends ut {
  applyDeoptimizations() {
  }
}, LabeledStatement: class extends ut {
  hasEffects(e) {
    const t = e.brokenFlow;
    return e.ignore.labels.add(this.label.name), !!this.body.hasEffects(e) || (e.ignore.labels.delete(this.label.name), e.includedLabels.has(this.label.name) && (e.includedLabels.delete(this.label.name), e.brokenFlow = t), false);
  }
  include(e, t) {
    this.included = true;
    const i = e.brokenFlow;
    this.body.include(e, t), (t || e.includedLabels.has(this.label.name)) && (this.label.include(), e.includedLabels.delete(this.label.name), e.brokenFlow = i);
  }
  render(e, t) {
    this.label.included ? this.label.render(e, t) : e.remove(this.start, ui(e.original, hi(e.original, ":", this.label.end) + 1)), this.body.render(e, t);
  }
}, Literal: Ti, LogicalExpression: class extends ut {
  constructor() {
    super(...arguments), this.expressionsToBeDeoptimized = [], this.isBranchResolutionAnalysed = false, this.usedBranch = null;
  }
  deoptimizeCache() {
    if (this.usedBranch) {
      const e = this.usedBranch === this.left ? this.right : this.left;
      this.usedBranch = null, e.deoptimizePath(B);
      for (const e2 of this.expressionsToBeDeoptimized)
        e2.deoptimizeCache();
      this.context.requestTreeshakingPass();
    }
  }
  deoptimizePath(e) {
    const t = this.getUsedBranch();
    t ? t.deoptimizePath(e) : (this.left.deoptimizePath(e), this.right.deoptimizePath(e));
  }
  deoptimizeThisOnInteractionAtPath(e, t, i) {
    this.left.deoptimizeThisOnInteractionAtPath(e, t, i), this.right.deoptimizeThisOnInteractionAtPath(e, t, i);
  }
  getLiteralValueAtPath(e, t, i) {
    const s = this.getUsedBranch();
    return s ? (this.expressionsToBeDeoptimized.push(i), s.getLiteralValueAtPath(e, t, i)) : W;
  }
  getReturnExpressionWhenCalledAtPath(e, t, i, s) {
    const n2 = this.getUsedBranch();
    return n2 ? (this.expressionsToBeDeoptimized.push(s), n2.getReturnExpressionWhenCalledAtPath(e, t, i, s)) : new Hi([this.left.getReturnExpressionWhenCalledAtPath(e, t, i, s), this.right.getReturnExpressionWhenCalledAtPath(e, t, i, s)]);
  }
  hasEffects(e) {
    return !!this.left.hasEffects(e) || this.getUsedBranch() !== this.left && this.right.hasEffects(e);
  }
  hasEffectsOnInteractionAtPath(e, t, i) {
    const s = this.getUsedBranch();
    return s ? s.hasEffectsOnInteractionAtPath(e, t, i) : this.left.hasEffectsOnInteractionAtPath(e, t, i) || this.right.hasEffectsOnInteractionAtPath(e, t, i);
  }
  include(e, t) {
    this.included = true;
    const i = this.getUsedBranch();
    t || i === this.right && this.left.shouldBeIncluded(e) || !i ? (this.left.include(e, t), this.right.include(e, t)) : i.include(e, t);
  }
  render(e, t, { isCalleeOfRenderedParent: i, preventASI: s, renderedParentType: n2, renderedSurroundingElement: r2 } = ie) {
    if (this.left.included && this.right.included)
      this.left.render(e, t, { preventASI: s, renderedSurroundingElement: r2 }), this.right.render(e, t);
    else {
      const a3 = hi(e.original, this.operator, this.left.end);
      if (this.right.included) {
        const t2 = ui(e.original, a3 + 2);
        e.remove(this.start, t2), s && mi(e, t2, this.right.start);
      } else
        e.remove(a3, this.end);
      oi(this, e), this.getUsedBranch().render(e, t, { isCalleeOfRenderedParent: i, preventASI: s, renderedParentType: n2 || this.parent.type, renderedSurroundingElement: r2 || this.parent.type });
    }
  }
  getUsedBranch() {
    if (!this.isBranchResolutionAnalysed) {
      this.isBranchResolutionAnalysed = true;
      const e = this.left.getLiteralValueAtPath(V, G, this);
      if (typeof e == "symbol")
        return null;
      this.usedBranch = this.operator === "||" && e || this.operator === "&&" && !e || this.operator === "??" && e != null ? this.left : this.right;
    }
    return this.usedBranch;
  }
}, MemberExpression: Mi, MetaProperty: class extends ut {
  addAccessedGlobals(e, t) {
    const i = this.metaProperty, s = (i && (i.startsWith(Ss) || i.startsWith(vs) || i.startsWith("ROLLUP_CHUNK_URL_")) ? Is : As)[e];
    s.length > 0 && this.scope.addAccessedGlobals(s, t);
  }
  getReferencedFileName(e) {
    const t = this.metaProperty;
    return t && t.startsWith(Ss) ? e.getFileName(t.substring(Ss.length)) : null;
  }
  hasEffects() {
    return false;
  }
  hasEffectsOnInteractionAtPath(e, { type: t }) {
    return e.length > 1 || t !== 0;
  }
  include() {
    if (!this.included && (this.included = true, this.meta.name === "import")) {
      this.context.addImportMeta(this);
      const e = this.parent;
      this.metaProperty = e instanceof Mi && typeof e.propertyKey == "string" ? e.propertyKey : null;
    }
  }
  renderFinalMechanism(e, t, i, s, n2) {
    var r2;
    const a3 = this.parent, o2 = this.metaProperty;
    if (o2 && (o2.startsWith(Ss) || o2.startsWith(vs) || o2.startsWith("ROLLUP_CHUNK_URL_"))) {
      let s2, r3 = null, l3 = null, h2 = null;
      o2.startsWith(Ss) ? (r3 = o2.substring(Ss.length), s2 = n2.getFileName(r3)) : o2.startsWith(vs) ? (ke(`Using the "${vs}" prefix to reference files is deprecated. Use the "${Ss}" prefix instead.`, true, this.context.options), l3 = o2.substring(vs.length), s2 = n2.getFileName(l3)) : (ke(`Using the "ROLLUP_CHUNK_URL_" prefix to reference files is deprecated. Use the "${Ss}" prefix instead.`, true, this.context.options), h2 = o2.substring("ROLLUP_CHUNK_URL_".length), s2 = n2.getFileName(h2));
      const c2 = C(T(N(t), s2));
      let u2;
      return l3 !== null && (u2 = n2.hookFirstSync("resolveAssetUrl", [{ assetFileName: s2, chunkId: t, format: i, moduleId: this.context.module.id, relativeAssetPath: c2 }])), u2 || (u2 = n2.hookFirstSync("resolveFileUrl", [{ assetReferenceId: l3, chunkId: t, chunkReferenceId: h2, fileName: s2, format: i, moduleId: this.context.module.id, referenceId: r3 || l3 || h2, relativePath: c2 }]) || _s[i](c2)), void e.overwrite(a3.start, a3.end, u2, { contentOnly: true });
    }
    const l2 = n2.hookFirstSync("resolveImportMeta", [o2, { chunkId: t, format: i, moduleId: this.context.module.id }]) || ((r2 = Ns[i]) === null || r2 === void 0 ? void 0 : r2.call(Ns, o2, { chunkId: t, snippets: s }));
    typeof l2 == "string" && (a3 instanceof Mi ? e.overwrite(a3.start, a3.end, l2, { contentOnly: true }) : e.overwrite(this.start, this.end, l2, { contentOnly: true }));
  }
}, MethodDefinition: zi, NewExpression: class extends ut {
  hasEffects(e) {
    try {
      for (const t of this.arguments)
        if (t.hasEffects(e))
          return true;
      return (!this.context.options.treeshake.annotations || !this.annotations) && (this.callee.hasEffects(e) || this.callee.hasEffectsOnInteractionAtPath(V, this.interaction, e));
    } finally {
      this.deoptimized || this.applyDeoptimizations();
    }
  }
  hasEffectsOnInteractionAtPath(e, { type: t }) {
    return e.length > 0 || t !== 0;
  }
  include(e, t) {
    this.deoptimized || this.applyDeoptimizations(), t ? super.include(e, t) : (this.included = true, this.callee.include(e, false)), this.callee.includeCallArguments(e, this.arguments);
  }
  initialise() {
    this.interaction = { args: this.arguments, thisArg: null, type: 2, withNew: true };
  }
  render(e, t) {
    this.callee.render(e, t), $i(e, t, this);
  }
  applyDeoptimizations() {
    this.deoptimized = true;
    for (const e of this.arguments)
      e.deoptimizePath(B);
    this.context.requestTreeshakingPass();
  }
}, ObjectExpression: class extends ut {
  constructor() {
    super(...arguments), this.objectEntity = null;
  }
  deoptimizeCache() {
    this.getObjectEntity().deoptimizeAllProperties();
  }
  deoptimizePath(e) {
    this.getObjectEntity().deoptimizePath(e);
  }
  deoptimizeThisOnInteractionAtPath(e, t, i) {
    this.getObjectEntity().deoptimizeThisOnInteractionAtPath(e, t, i);
  }
  getLiteralValueAtPath(e, t, i) {
    return this.getObjectEntity().getLiteralValueAtPath(e, t, i);
  }
  getReturnExpressionWhenCalledAtPath(e, t, i, s) {
    return this.getObjectEntity().getReturnExpressionWhenCalledAtPath(e, t, i, s);
  }
  hasEffectsOnInteractionAtPath(e, t, i) {
    return this.getObjectEntity().hasEffectsOnInteractionAtPath(e, t, i);
  }
  render(e, t, { renderedSurroundingElement: i } = ie) {
    super.render(e, t), i !== "ExpressionStatement" && i !== "ArrowFunctionExpression" || (e.appendRight(this.start, "("), e.prependLeft(this.end, ")"));
  }
  applyDeoptimizations() {
  }
  getObjectEntity() {
    if (this.objectEntity !== null)
      return this.objectEntity;
    let e = St;
    const t = [];
    for (const i of this.properties) {
      if (i instanceof dt) {
        t.push({ key: M, kind: "init", property: i });
        continue;
      }
      let s;
      if (i.computed) {
        const e2 = i.key.getLiteralValueAtPath(V, G, this);
        if (typeof e2 == "symbol") {
          t.push({ key: M, kind: i.kind, property: i });
          continue;
        }
        s = String(e2);
      } else if (s = i.key instanceof ni ? i.key.name : String(i.key.value), s === "__proto__" && i.kind === "init") {
        e = i.value instanceof Ti && i.value.value === null ? null : i.value;
        continue;
      }
      t.push({ key: s, kind: i.kind, property: i });
    }
    return this.objectEntity = new Et(t, e);
  }
}, ObjectPattern: ki, PrivateIdentifier: class extends ut {
}, Program: $s, Property: class extends Fi {
  constructor() {
    super(...arguments), this.declarationInit = null;
  }
  declare(e, t) {
    return this.declarationInit = t, this.value.declare(e, X);
  }
  hasEffects(e) {
    this.deoptimized || this.applyDeoptimizations();
    const t = this.context.options.treeshake.propertyReadSideEffects;
    return this.parent.type === "ObjectPattern" && t === "always" || this.key.hasEffects(e) || this.value.hasEffects(e);
  }
  markDeclarationReached() {
    this.value.markDeclarationReached();
  }
  render(e, t) {
    this.shorthand || this.key.render(e, t), this.value.render(e, t, { isShorthandProperty: this.shorthand });
  }
  applyDeoptimizations() {
    this.deoptimized = true, this.declarationInit !== null && (this.declarationInit.deoptimizePath([M, M]), this.context.requestTreeshakingPass());
  }
}, PropertyDefinition: class extends ut {
  deoptimizePath(e) {
    var t;
    (t = this.value) === null || t === void 0 || t.deoptimizePath(e);
  }
  deoptimizeThisOnInteractionAtPath(e, t, i) {
    var s;
    (s = this.value) === null || s === void 0 || s.deoptimizeThisOnInteractionAtPath(e, t, i);
  }
  getLiteralValueAtPath(e, t, i) {
    return this.value ? this.value.getLiteralValueAtPath(e, t, i) : W;
  }
  getReturnExpressionWhenCalledAtPath(e, t, i, s) {
    return this.value ? this.value.getReturnExpressionWhenCalledAtPath(e, t, i, s) : X;
  }
  hasEffects(e) {
    var t;
    return this.key.hasEffects(e) || this.static && !!((t = this.value) === null || t === void 0 ? void 0 : t.hasEffects(e));
  }
  hasEffectsOnInteractionAtPath(e, t, i) {
    return !this.value || this.value.hasEffectsOnInteractionAtPath(e, t, i);
  }
  applyDeoptimizations() {
  }
}, RestElement: Ei, ReturnStatement: class extends ut {
  hasEffects(e) {
    var t;
    return !(e.ignore.returnYield && !((t = this.argument) === null || t === void 0 ? void 0 : t.hasEffects(e))) || (e.brokenFlow = 2, false);
  }
  include(e, t) {
    var i;
    this.included = true, (i = this.argument) === null || i === void 0 || i.include(e, t), e.brokenFlow = 2;
  }
  initialise() {
    this.scope.addReturnExpression(this.argument || X);
  }
  render(e, t) {
    this.argument && (this.argument.render(e, t, { preventASI: true }), this.argument.start === this.start + 6 && e.prependLeft(this.start + 6, " "));
  }
}, SequenceExpression: class extends ut {
  deoptimizePath(e) {
    this.expressions[this.expressions.length - 1].deoptimizePath(e);
  }
  deoptimizeThisOnInteractionAtPath(e, t, i) {
    this.expressions[this.expressions.length - 1].deoptimizeThisOnInteractionAtPath(e, t, i);
  }
  getLiteralValueAtPath(e, t, i) {
    return this.expressions[this.expressions.length - 1].getLiteralValueAtPath(e, t, i);
  }
  hasEffects(e) {
    for (const t of this.expressions)
      if (t.hasEffects(e))
        return true;
    return false;
  }
  hasEffectsOnInteractionAtPath(e, t, i) {
    return this.expressions[this.expressions.length - 1].hasEffectsOnInteractionAtPath(e, t, i);
  }
  include(e, t) {
    this.included = true;
    const i = this.expressions[this.expressions.length - 1];
    for (const s of this.expressions)
      (t || s === i && !(this.parent instanceof yi) || s.shouldBeIncluded(e)) && s.include(e, t);
  }
  render(e, t, { renderedParentType: i, isCalleeOfRenderedParent: s, preventASI: n2 } = ie) {
    let r2 = 0, a3 = null;
    const o2 = this.expressions[this.expressions.length - 1];
    for (const { node: l2, separator: h2, start: c2, end: u2 } of fi(this.expressions, e, this.start, this.end))
      if (l2.included)
        if (r2++, a3 = h2, r2 === 1 && n2 && mi(e, c2, l2.start), r2 === 1) {
          const n3 = i || this.parent.type;
          l2.render(e, t, { isCalleeOfRenderedParent: s && l2 === o2, renderedParentType: n3, renderedSurroundingElement: n3 });
        } else
          l2.render(e, t);
      else
        ai(l2, e, c2, u2);
    a3 && e.remove(a3, this.end);
  }
}, SpreadElement: dt, StaticBlock: class extends ut {
  createScope(e) {
    this.scope = new gi(e);
  }
  hasEffects(e) {
    for (const t of this.body)
      if (t.hasEffects(e))
        return true;
    return false;
  }
  include(e, t) {
    this.included = true;
    for (const i of this.body)
      (t || i.shouldBeIncluded(e)) && i.include(e, t);
  }
  render(e, t) {
    this.body.length ? pi(this.body, e, this.start + 1, this.end - 1, t) : super.render(e, t);
  }
}, Super: class extends ut {
  bind() {
    this.variable = this.scope.findVariable("this");
  }
  deoptimizePath(e) {
    this.variable.deoptimizePath(e);
  }
  deoptimizeThisOnInteractionAtPath(e, t, i) {
    this.variable.deoptimizeThisOnInteractionAtPath(e, t, i);
  }
  include() {
    this.included || (this.included = true, this.context.includeVariableInModule(this.variable));
  }
}, SwitchCase: Ts, SwitchStatement: class extends ut {
  createScope(e) {
    this.scope = new gi(e);
  }
  hasEffects(e) {
    if (this.discriminant.hasEffects(e))
      return true;
    const { brokenFlow: t, ignore: { breaks: i } } = e;
    let s = 1 / 0;
    e.ignore.breaks = true;
    for (const i2 of this.cases) {
      if (i2.hasEffects(e))
        return true;
      s = e.brokenFlow < s ? e.brokenFlow : s, e.brokenFlow = t;
    }
    return this.defaultCase !== null && s !== 1 && (e.brokenFlow = s), e.ignore.breaks = i, false;
  }
  include(e, t) {
    this.included = true, this.discriminant.include(e, t);
    const { brokenFlow: i } = e;
    let s = 1 / 0, n2 = t || this.defaultCase !== null && this.defaultCase < this.cases.length - 1;
    for (let r2 = this.cases.length - 1; r2 >= 0; r2--) {
      const a3 = this.cases[r2];
      if (a3.included && (n2 = true), !n2) {
        const e2 = Me();
        e2.ignore.breaks = true, n2 = a3.hasEffects(e2);
      }
      n2 ? (a3.include(e, t), s = s < e.brokenFlow ? s : e.brokenFlow, e.brokenFlow = i) : s = i;
    }
    n2 && this.defaultCase !== null && s !== 1 && (e.brokenFlow = s);
  }
  initialise() {
    for (let e = 0; e < this.cases.length; e++)
      if (this.cases[e].test === null)
        return void (this.defaultCase = e);
    this.defaultCase = null;
  }
  render(e, t) {
    this.discriminant.render(e, t), this.cases.length > 0 && pi(this.cases, e, this.cases[0].start, this.end - 1, t);
  }
}, TaggedTemplateExpression: class extends Li {
  bind() {
    if (super.bind(), this.tag.type === "Identifier") {
      const e = this.tag.name;
      this.scope.findVariable(e).isNamespace && this.context.warn({ code: "CANNOT_CALL_NAMESPACE", message: `Cannot call a namespace ('${e}')` }, this.start);
    }
  }
  hasEffects(e) {
    try {
      for (const t of this.quasi.expressions)
        if (t.hasEffects(e))
          return true;
      return this.tag.hasEffects(e) || this.tag.hasEffectsOnInteractionAtPath(V, this.interaction, e);
    } finally {
      this.deoptimized || this.applyDeoptimizations();
    }
  }
  include(e, t) {
    this.deoptimized || this.applyDeoptimizations(), t ? super.include(e, t) : (this.included = true, this.tag.include(e, t), this.quasi.include(e, t)), this.tag.includeCallArguments(e, this.interaction.args);
    const i = this.getReturnExpression();
    i.included || i.include(e, false);
  }
  initialise() {
    this.interaction = { args: [X, ...this.quasi.expressions], thisArg: this.tag instanceof Mi && !this.tag.variable ? this.tag.object : null, type: 2, withNew: false };
  }
  render(e, t) {
    this.tag.render(e, t, { isCalleeOfRenderedParent: true }), this.quasi.render(e, t);
  }
  applyDeoptimizations() {
    this.deoptimized = true, this.interaction.thisArg && this.tag.deoptimizeThisOnInteractionAtPath(this.interaction, V, G);
    for (const e of this.quasi.expressions)
      e.deoptimizePath(B);
    this.context.requestTreeshakingPass();
  }
  getReturnExpression(e = G) {
    return this.returnExpression === null ? (this.returnExpression = X, this.returnExpression = this.tag.getReturnExpressionWhenCalledAtPath(V, this.interaction, e, this)) : this.returnExpression;
  }
}, TemplateElement: class extends ut {
  bind() {
  }
  hasEffects() {
    return false;
  }
  include() {
    this.included = true;
  }
  parseNode(e) {
    this.value = e.value, super.parseNode(e);
  }
  render() {
  }
}, TemplateLiteral: Os, ThisExpression: class extends ut {
  bind() {
    this.variable = this.scope.findVariable("this");
  }
  deoptimizePath(e) {
    this.variable.deoptimizePath(e);
  }
  deoptimizeThisOnInteractionAtPath(e, t, i) {
    this.variable.deoptimizeThisOnInteractionAtPath(e.thisArg === this ? __spreadProps(__spreadValues({}, e), { thisArg: this.variable }) : e, t, i);
  }
  hasEffectsOnInteractionAtPath(e, t, i) {
    return e.length === 0 ? t.type !== 0 : this.variable.hasEffectsOnInteractionAtPath(e, t, i);
  }
  include() {
    this.included || (this.included = true, this.context.includeVariableInModule(this.variable));
  }
  initialise() {
    this.alias = this.scope.findLexicalBoundary() instanceof Ds ? this.context.moduleContext : null, this.alias === "undefined" && this.context.warn({ code: "THIS_IS_UNDEFINED", message: "The 'this' keyword is equivalent to 'undefined' at the top level of an ES module, and has been rewritten", url: "https://rollupjs.org/guide/en/#error-this-is-undefined" }, this.start);
  }
  render(e) {
    this.alias !== null && e.overwrite(this.start, this.end, this.alias, { contentOnly: false, storeName: true });
  }
}, ThrowStatement: class extends ut {
  hasEffects() {
    return true;
  }
  include(e, t) {
    this.included = true, this.argument.include(e, t), e.brokenFlow = 2;
  }
  render(e, t) {
    this.argument.render(e, t, { preventASI: true }), this.argument.start === this.start + 5 && e.prependLeft(this.start + 5, " ");
  }
}, TryStatement: class extends ut {
  constructor() {
    super(...arguments), this.directlyIncluded = false, this.includedLabelsAfterBlock = null;
  }
  hasEffects(e) {
    var t;
    return (this.context.options.treeshake.tryCatchDeoptimization ? this.block.body.length > 0 : this.block.hasEffects(e)) || !!((t = this.finalizer) === null || t === void 0 ? void 0 : t.hasEffects(e));
  }
  include(e, t) {
    var i, s;
    const n2 = (i = this.context.options.treeshake) === null || i === void 0 ? void 0 : i.tryCatchDeoptimization, { brokenFlow: r2 } = e;
    if (this.directlyIncluded && n2) {
      if (this.includedLabelsAfterBlock)
        for (const t2 of this.includedLabelsAfterBlock)
          e.includedLabels.add(t2);
    } else
      this.included = true, this.directlyIncluded = true, this.block.include(e, n2 ? "variables" : t), e.includedLabels.size > 0 && (this.includedLabelsAfterBlock = [...e.includedLabels]), e.brokenFlow = r2;
    this.handler !== null && (this.handler.include(e, t), e.brokenFlow = r2), (s = this.finalizer) === null || s === void 0 || s.include(e, t);
  }
}, UnaryExpression: class extends ut {
  getLiteralValueAtPath(e, t, i) {
    if (e.length > 0)
      return W;
    const s = this.argument.getLiteralValueAtPath(V, t, i);
    return typeof s == "symbol" ? W : Ls[this.operator](s);
  }
  hasEffects(e) {
    return this.deoptimized || this.applyDeoptimizations(), !(this.operator === "typeof" && this.argument instanceof ni) && (this.argument.hasEffects(e) || this.operator === "delete" && this.argument.hasEffectsOnInteractionAtPath(V, Q, e));
  }
  hasEffectsOnInteractionAtPath(e, { type: t }) {
    return t !== 0 || e.length > (this.operator === "void" ? 0 : 1);
  }
  applyDeoptimizations() {
    this.deoptimized = true, this.operator === "delete" && (this.argument.deoptimizePath(V), this.context.requestTreeshakingPass());
  }
}, UnknownNode: class extends ut {
  hasEffects() {
    return true;
  }
  include(e) {
    super.include(e, true);
  }
}, UpdateExpression: class extends ut {
  hasEffects(e) {
    return this.deoptimized || this.applyDeoptimizations(), this.argument.hasEffectsAsAssignmentTarget(e, true);
  }
  hasEffectsOnInteractionAtPath(e, { type: t }) {
    return e.length > 1 || t !== 0;
  }
  include(e, t) {
    this.deoptimized || this.applyDeoptimizations(), this.included = true, this.argument.includeAsAssignmentTarget(e, t, true);
  }
  initialise() {
    this.argument.setAssignedValue(X);
  }
  render(e, t) {
    const { exportNamesByVariable: i, format: s, snippets: { _: n2 } } = t;
    if (this.argument.render(e, t), s === "system") {
      const s2 = this.argument.variable, r2 = i.get(s2);
      if (r2)
        if (this.prefix)
          r2.length === 1 ? Ai(s2, this.start, this.end, e, t) : Ii(s2, this.start, this.end, this.parent.type !== "ExpressionStatement", e, t);
        else {
          const i2 = this.operator[0];
          !function(e2, t2, i3, s3, n3, r3, a3) {
            const { _: o2 } = r3.snippets;
            n3.prependRight(t2, `${Si([e2], r3, a3)},${o2}`), s3 && (n3.prependRight(t2, "("), n3.appendLeft(i3, ")"));
          }(s2, this.start, this.end, this.parent.type !== "ExpressionStatement", e, t, `${n2}${i2}${n2}1`);
        }
    }
  }
  applyDeoptimizations() {
    if (this.deoptimized = true, this.argument.deoptimizePath(V), this.argument instanceof ni) {
      this.scope.findVariable(this.argument.name).isReassigned = true;
    }
    this.context.requestTreeshakingPass();
  }
}, VariableDeclaration: Bs, VariableDeclarator: class extends ut {
  declareDeclarator(e) {
    this.id.declare(e, this.init || Le);
  }
  deoptimizePath(e) {
    this.id.deoptimizePath(e);
  }
  hasEffects(e) {
    var t;
    const i = (t = this.init) === null || t === void 0 ? void 0 : t.hasEffects(e);
    return this.id.markDeclarationReached(), i || this.id.hasEffects(e);
  }
  include(e, t) {
    var i;
    this.included = true, (i = this.init) === null || i === void 0 || i.include(e, t), this.id.markDeclarationReached(), (t || this.id.shouldBeIncluded(e)) && this.id.include(e, t);
  }
  render(e, t) {
    const { exportNamesByVariable: i, snippets: { _: s } } = t, n2 = this.id.included;
    if (n2)
      this.id.render(e, t);
    else {
      const t2 = hi(e.original, "=", this.id.end);
      e.remove(this.start, ui(e.original, t2 + 1));
    }
    this.init ? this.init.render(e, t, n2 ? ie : { renderedSurroundingElement: "ExpressionStatement" }) : this.id instanceof ni && Vs(this.id.variable, i) && e.appendLeft(this.end, `${s}=${s}void 0`);
  }
  applyDeoptimizations() {
  }
}, WhileStatement: class extends ut {
  hasEffects(e) {
    if (this.test.hasEffects(e))
      return true;
    const { brokenFlow: t, ignore: { breaks: i, continues: s } } = e;
    return e.ignore.breaks = true, e.ignore.continues = true, !!this.body.hasEffects(e) || (e.ignore.breaks = i, e.ignore.continues = s, e.brokenFlow = t, false);
  }
  include(e, t) {
    this.included = true, this.test.include(e, t);
    const { brokenFlow: i } = e;
    this.body.include(e, t, { asSingleStatement: true }), e.brokenFlow = i;
  }
}, YieldExpression: class extends ut {
  hasEffects(e) {
    var t;
    return this.deoptimized || this.applyDeoptimizations(), !(e.ignore.returnYield && !((t = this.argument) === null || t === void 0 ? void 0 : t.hasEffects(e)));
  }
  render(e, t) {
    this.argument && (this.argument.render(e, t, { preventASI: true }), this.argument.start === this.start + 5 && e.prependLeft(this.start + 5, " "));
  }
} };
class zs extends ee {
  constructor(e) {
    super("_missingExportShim"), this.module = e;
  }
  include() {
    super.include(), this.module.needsExportShim = true;
  }
}
class js extends ee {
  constructor(e) {
    super(e.getModuleName()), this.memberVariables = null, this.mergedNamespaces = [], this.referencedEarly = false, this.references = [], this.context = e, this.module = e.module;
  }
  addReference(e) {
    this.references.push(e), this.name = e.name;
  }
  getMemberVariables() {
    if (this.memberVariables)
      return this.memberVariables;
    const e = /* @__PURE__ */ Object.create(null);
    for (const t of this.context.getExports().concat(this.context.getReexports()))
      if (t[0] !== "*" && t !== this.module.info.syntheticNamedExports) {
        const i = this.context.traceExport(t);
        i && (e[t] = i);
      }
    return this.memberVariables = e;
  }
  include() {
    this.included = true, this.context.includeAllExports();
  }
  prepare(e) {
    this.mergedNamespaces.length > 0 && this.module.scope.addAccessedGlobals(["_mergeNamespaces"], e);
  }
  renderBlock(e) {
    const { exportNamesByVariable: t, format: i, freeze: s, indent: n2, namespaceToStringTag: r2, snippets: { _: a3, cnst: o2, getObject: l2, getPropertyAccess: h2, n: c2, s: u2 } } = e, d2 = this.getMemberVariables(), p2 = Object.entries(d2).map(([e2, t2]) => this.referencedEarly || t2.isReassigned ? [null, `get ${e2}${a3}()${a3}{${a3}return ${t2.getName(h2)}${u2}${a3}}`] : [e2, t2.getName(h2)]);
    p2.unshift([null, `__proto__:${a3}null`]);
    let f2 = l2(p2, { lineBreakIndent: { base: "", t: n2 } });
    if (this.mergedNamespaces.length > 0) {
      const e2 = this.mergedNamespaces.map((e3) => e3.getName(h2));
      f2 = `/*#__PURE__*/_mergeNamespaces(${f2},${a3}[${e2.join(`,${a3}`)}])`;
    } else
      r2 && (f2 = `/*#__PURE__*/Object.defineProperty(${f2},${a3}Symbol.toStringTag,${a3}${xs(l2)})`), s && (f2 = `/*#__PURE__*/Object.freeze(${f2})`);
    return f2 = `${o2} ${this.getName(h2)}${a3}=${a3}${f2};`, i === "system" && t.has(this) && (f2 += `${c2}${Si([this], e)};`), f2;
  }
  renderFirst() {
    return this.referencedEarly;
  }
  setMergedNamespaces(e) {
    this.mergedNamespaces = e;
    const t = this.context.getModuleExecIndex();
    for (const e2 of this.references)
      if (e2.context.getModuleExecIndex() <= t) {
        this.referencedEarly = true;
        break;
      }
  }
}
js.prototype.isNamespace = true;
class Us extends ee {
  constructor(e, t, i) {
    super(t), this.baseVariable = null, this.context = e, this.module = e.module, this.syntheticNamespace = i;
  }
  getBaseVariable() {
    if (this.baseVariable)
      return this.baseVariable;
    let e = this.syntheticNamespace;
    for (; e instanceof Ms || e instanceof Us; ) {
      if (e instanceof Ms) {
        const t = e.getOriginalVariable();
        if (t === e)
          break;
        e = t;
      }
      e instanceof Us && (e = e.syntheticNamespace);
    }
    return this.baseVariable = e;
  }
  getBaseVariableName() {
    return this.syntheticNamespace.getBaseVariableName();
  }
  getName(e) {
    return `${this.syntheticNamespace.getName(e)}${e(this.name)}`;
  }
  include() {
    this.included = true, this.context.includeVariableInModule(this.syntheticNamespace);
  }
  setRenderNames(e, t) {
    super.setRenderNames(e, t);
  }
}
var Gs;
function Hs(e) {
  return e.id;
}
!function(e) {
  e[e.LOAD_AND_PARSE = 0] = "LOAD_AND_PARSE", e[e.ANALYSE = 1] = "ANALYSE", e[e.GENERATE = 2] = "GENERATE";
}(Gs || (Gs = {}));
var Ws = "performance" in (typeof globalThis != "undefined" ? globalThis : typeof window != "undefined" ? window : {}) ? performance : { now: () => 0 }, qs = { memoryUsage: () => ({ heapUsed: 0 }) };
const Ks = () => {
};
let Xs = /* @__PURE__ */ new Map();
function Ys(e, t) {
  switch (t) {
    case 1:
      return `# ${e}`;
    case 2:
      return `## ${e}`;
    case 3:
      return e;
    default:
      return `${"  ".repeat(t - 4)}- ${e}`;
  }
}
function Qs(e, t = 3) {
  e = Ys(e, t);
  const i = qs.memoryUsage().heapUsed, s = Ws.now(), n2 = Xs.get(e);
  n2 === void 0 ? Xs.set(e, { memory: 0, startMemory: i, startTime: s, time: 0, totalMemory: 0 }) : (n2.startMemory = i, n2.startTime = s);
}
function Zs(e, t = 3) {
  e = Ys(e, t);
  const i = Xs.get(e);
  if (i !== void 0) {
    const e2 = qs.memoryUsage().heapUsed;
    i.memory += e2 - i.startMemory, i.time += Ws.now() - i.startTime, i.totalMemory = Math.max(i.totalMemory, e2);
  }
}
function Js() {
  const e = {};
  for (const [t, { memory: i, time: s, totalMemory: n2 }] of Xs)
    e[t] = [s, i, n2];
  return e;
}
let en = Ks, tn = Ks;
const sn = ["load", "resolveDynamicImport", "resolveId", "transform"];
function nn(e, t) {
  for (const i of sn)
    if (i in e) {
      let s = `plugin ${t}`;
      e.name && (s += ` (${e.name})`), s += ` - ${i}`;
      const n2 = e[i];
      e[i] = function(...e2) {
        en(s, 4);
        const t2 = n2.apply(this, e2);
        return tn(s, 4), t2 && typeof t2.then == "function" ? (en(`${s} (async)`, 4), t2.then((e3) => (tn(`${s} (async)`, 4), e3))) : t2;
      };
    }
  return e;
}
function rn(e) {
  e.isExecuted = true;
  const t = [e], i = /* @__PURE__ */ new Set();
  for (const e2 of t)
    for (const s of [...e2.dependencies, ...e2.implicitlyLoadedBefore])
      s instanceof $e || s.isExecuted || !s.info.moduleSideEffects && !e2.implicitlyLoadedBefore.has(s) || i.has(s.id) || (s.isExecuted = true, i.add(s.id), t.push(s));
}
const an = { identifier: null, localName: "_missingExportShim" };
function on(e, t, i, s, n2 = /* @__PURE__ */ new Map()) {
  const r2 = n2.get(t);
  if (r2) {
    if (r2.has(e))
      return s ? [null] : pe((a3 = t, o2 = e.id, { code: me.CIRCULAR_REEXPORT, id: o2, message: `"${a3}" cannot be exported from ${he(o2)} as it is a reexport that references itself.` }));
    r2.add(e);
  } else
    n2.set(t, /* @__PURE__ */ new Set([e]));
  var a3, o2;
  return e.getVariableForExportName(t, { importerForSideEffects: i, isExportAllSearch: s, searchedNamesAndModules: n2 });
}
class ln {
  constructor(e, t, i, s, n2, r2, a3) {
    this.graph = e, this.id = t, this.options = i, this.alternativeReexportModules = /* @__PURE__ */ new Map(), this.chunkFileNames = /* @__PURE__ */ new Set(), this.chunkNames = [], this.cycles = /* @__PURE__ */ new Set(), this.dependencies = /* @__PURE__ */ new Set(), this.dynamicDependencies = /* @__PURE__ */ new Set(), this.dynamicImporters = [], this.dynamicImports = [], this.execIndex = 1 / 0, this.implicitlyLoadedAfter = /* @__PURE__ */ new Set(), this.implicitlyLoadedBefore = /* @__PURE__ */ new Set(), this.importDescriptions = /* @__PURE__ */ new Map(), this.importMetas = [], this.importedFromNotTreeshaken = false, this.importers = [], this.includedDynamicImporters = [], this.includedImports = /* @__PURE__ */ new Set(), this.isExecuted = false, this.isUserDefinedEntryPoint = false, this.needsExportShim = false, this.sideEffectDependenciesByVariable = /* @__PURE__ */ new Map(), this.sources = /* @__PURE__ */ new Set(), this.usesTopLevelAwait = false, this.allExportNames = null, this.ast = null, this.exportAllModules = [], this.exportAllSources = /* @__PURE__ */ new Set(), this.exportNamesByVariable = null, this.exportShimVariable = new zs(this), this.exports = /* @__PURE__ */ new Map(), this.namespaceReexportsByName = /* @__PURE__ */ new Map(), this.reexportDescriptions = /* @__PURE__ */ new Map(), this.relevantDependencies = null, this.syntheticExports = /* @__PURE__ */ new Map(), this.syntheticNamespace = null, this.transformDependencies = [], this.transitiveReexports = null, this.excludeFromSourcemap = /\0/.test(t), this.context = i.moduleContext(t), this.preserveSignature = this.options.preserveEntrySignatures;
    const o2 = this, { dynamicImports: l2, dynamicImporters: h2, implicitlyLoadedAfter: c2, implicitlyLoadedBefore: u2, importers: d2, reexportDescriptions: p2, sources: f2 } = this;
    this.info = { ast: null, code: null, get dynamicallyImportedIdResolutions() {
      return l2.map(({ argument: e2 }) => typeof e2 == "string" && o2.resolvedIds[e2]).filter(Boolean);
    }, get dynamicallyImportedIds() {
      return l2.map(({ id: e2 }) => e2).filter((e2) => e2 != null);
    }, get dynamicImporters() {
      return h2.sort();
    }, get hasDefaultExport() {
      return o2.ast ? o2.exports.has("default") || p2.has("default") : null;
    }, get hasModuleSideEffects() {
      return ke("Accessing ModuleInfo.hasModuleSideEffects from plugins is deprecated. Please use ModuleInfo.moduleSideEffects instead.", false, i), this.moduleSideEffects;
    }, id: t, get implicitlyLoadedAfterOneOf() {
      return Array.from(c2, Hs).sort();
    }, get implicitlyLoadedBefore() {
      return Array.from(u2, Hs).sort();
    }, get importedIdResolutions() {
      return Array.from(f2, (e2) => o2.resolvedIds[e2]).filter(Boolean);
    }, get importedIds() {
      return Array.from(f2, (e2) => {
        var t2;
        return (t2 = o2.resolvedIds[e2]) === null || t2 === void 0 ? void 0 : t2.id;
      }).filter(Boolean);
    }, get importers() {
      return d2.sort();
    }, isEntry: s, isExternal: false, get isIncluded() {
      return e.phase !== Gs.GENERATE ? null : o2.isIncluded();
    }, meta: __spreadValues({}, a3), moduleSideEffects: n2, syntheticNamedExports: r2 }, Object.defineProperty(this.info, "hasModuleSideEffects", { enumerable: false });
  }
  basename() {
    const e = _(this.id), t = $(this.id);
    return Ne(t ? e.slice(0, -t.length) : e);
  }
  bindReferences() {
    this.ast.bind();
  }
  error(e, t) {
    return this.addLocationToLogProps(e, t), pe(e);
  }
  getAllExportNames() {
    if (this.allExportNames)
      return this.allExportNames;
    this.allExportNames = /* @__PURE__ */ new Set([...this.exports.keys(), ...this.reexportDescriptions.keys()]);
    for (const e of this.exportAllModules)
      if (e instanceof $e)
        this.allExportNames.add(`*${e.id}`);
      else
        for (const t of e.getAllExportNames())
          t !== "default" && this.allExportNames.add(t);
    return typeof this.info.syntheticNamedExports == "string" && this.allExportNames.delete(this.info.syntheticNamedExports), this.allExportNames;
  }
  getDependenciesToBeIncluded() {
    if (this.relevantDependencies)
      return this.relevantDependencies;
    this.relevantDependencies = /* @__PURE__ */ new Set();
    const e = /* @__PURE__ */ new Set(), t = /* @__PURE__ */ new Set(), i = new Set(this.includedImports);
    if (this.info.isEntry || this.includedDynamicImporters.length > 0 || this.namespace.included || this.implicitlyLoadedAfter.size > 0)
      for (const e2 of [...this.getReexports(), ...this.getExports()]) {
        const [t2] = this.getVariableForExportName(e2);
        t2 && i.add(t2);
      }
    for (let s of i) {
      const i2 = this.sideEffectDependenciesByVariable.get(s);
      if (i2)
        for (const e2 of i2)
          t.add(e2);
      s instanceof Us ? s = s.getBaseVariable() : s instanceof Ms && (s = s.getOriginalVariable()), e.add(s.module);
    }
    if (this.options.treeshake && this.info.moduleSideEffects !== "no-treeshake")
      this.addRelevantSideEffectDependencies(this.relevantDependencies, e, t);
    else
      for (const e2 of this.dependencies)
        this.relevantDependencies.add(e2);
    for (const t2 of e)
      this.relevantDependencies.add(t2);
    return this.relevantDependencies;
  }
  getExportNamesByVariable() {
    if (this.exportNamesByVariable)
      return this.exportNamesByVariable;
    const e = /* @__PURE__ */ new Map();
    for (const t of this.getAllExportNames()) {
      let [i] = this.getVariableForExportName(t);
      if (i instanceof Ms && (i = i.getOriginalVariable()), !i || !(i.included || i instanceof te))
        continue;
      const s = e.get(i);
      s ? s.push(t) : e.set(i, [t]);
    }
    return this.exportNamesByVariable = e;
  }
  getExports() {
    return Array.from(this.exports.keys());
  }
  getReexports() {
    if (this.transitiveReexports)
      return this.transitiveReexports;
    this.transitiveReexports = [];
    const e = new Set(this.reexportDescriptions.keys());
    for (const t of this.exportAllModules)
      if (t instanceof $e)
        e.add(`*${t.id}`);
      else
        for (const i of [...t.getReexports(), ...t.getExports()])
          i !== "default" && e.add(i);
    return this.transitiveReexports = [...e];
  }
  getRenderedExports() {
    const e = [], t = [];
    for (const i of this.exports.keys()) {
      const [s] = this.getVariableForExportName(i);
      (s && s.included ? e : t).push(i);
    }
    return { removedExports: t, renderedExports: e };
  }
  getSyntheticNamespace() {
    return this.syntheticNamespace === null && (this.syntheticNamespace = void 0, [this.syntheticNamespace] = this.getVariableForExportName(typeof this.info.syntheticNamedExports == "string" ? this.info.syntheticNamedExports : "default", { onlyExplicit: true })), this.syntheticNamespace ? this.syntheticNamespace : pe((e = this.id, t = this.info.syntheticNamedExports, { code: me.SYNTHETIC_NAMED_EXPORTS_NEED_NAMESPACE_EXPORT, id: e, message: `Module "${he(e)}" that is marked with 'syntheticNamedExports: ${JSON.stringify(t)}' needs ${typeof t == "string" && t !== "default" ? `an explicit export named "${t}"` : "a default export"} that does not reexport an unresolved named export of the same module.` }));
    var e, t;
  }
  getVariableForExportName(e, { importerForSideEffects: t, isExportAllSearch: i, onlyExplicit: s, searchedNamesAndModules: n2 } = se) {
    var r2;
    if (e[0] === "*") {
      if (e.length === 1)
        return [this.namespace];
      return this.graph.modulesById.get(e.slice(1)).getVariableForExportName("*");
    }
    const a3 = this.reexportDescriptions.get(e);
    if (a3) {
      const [e2] = on(a3.module, a3.localName, t, false, n2);
      return e2 ? (t && hn(e2, t, this), [e2]) : this.error(Ee(a3.localName, this.id, a3.module.id), a3.start);
    }
    const o2 = this.exports.get(e);
    if (o2) {
      if (o2 === an)
        return [this.exportShimVariable];
      const e2 = o2.localName, i2 = this.traceVariable(e2, { importerForSideEffects: t, searchedNamesAndModules: n2 });
      return t && (R(t.sideEffectDependenciesByVariable, i2, () => /* @__PURE__ */ new Set()).add(this), hn(i2, t, this)), [i2];
    }
    if (s)
      return [null];
    if (e !== "default") {
      const i2 = (r2 = this.namespaceReexportsByName.get(e)) !== null && r2 !== void 0 ? r2 : this.getVariableFromNamespaceReexports(e, t, n2);
      if (this.namespaceReexportsByName.set(e, i2), i2[0])
        return i2;
    }
    return this.info.syntheticNamedExports ? [R(this.syntheticExports, e, () => new Us(this.astContext, e, this.getSyntheticNamespace()))] : !i && this.options.shimMissingExports ? (this.shimMissingExport(e), [this.exportShimVariable]) : [null];
  }
  hasEffects() {
    return this.info.moduleSideEffects === "no-treeshake" || this.ast.included && this.ast.hasEffects(Me());
  }
  include() {
    const e = Re();
    this.ast.shouldBeIncluded(e) && this.ast.include(e, false);
  }
  includeAllExports(e) {
    this.isExecuted || (rn(this), this.graph.needsTreeshakingPass = true);
    for (const t of this.exports.keys())
      if (e || t !== this.info.syntheticNamedExports) {
        const e2 = this.getVariableForExportName(t)[0];
        e2.deoptimizePath(B), e2.included || this.includeVariable(e2);
      }
    for (const e2 of this.getReexports()) {
      const [t] = this.getVariableForExportName(e2);
      t && (t.deoptimizePath(B), t.included || this.includeVariable(t), t instanceof te && (t.module.reexported = true));
    }
    e && this.namespace.setMergedNamespaces(this.includeAndGetAdditionalMergedNamespaces());
  }
  includeAllInBundle() {
    this.ast.include(Re(), true), this.includeAllExports(false);
  }
  isIncluded() {
    return this.ast.included || this.namespace.included || this.importedFromNotTreeshaken;
  }
  linkImports() {
    this.addModulesToImportDescriptions(this.importDescriptions), this.addModulesToImportDescriptions(this.reexportDescriptions);
    const e = [];
    for (const t of this.exportAllSources) {
      const i = this.graph.modulesById.get(this.resolvedIds[t].id);
      i instanceof $e ? e.push(i) : this.exportAllModules.push(i);
    }
    this.exportAllModules.push(...e);
  }
  render(e) {
    const t = this.magicString.clone();
    return this.ast.render(t, e), this.usesTopLevelAwait = this.astContext.usesTopLevelAwait, t;
  }
  setSource(_c) {
    var _d = _c, { ast: e, code: t, customTransformCache: i, originalCode: s, originalSourcemap: n2, resolvedIds: r2, sourcemapChain: a3, transformDependencies: o2, transformFiles: l2 } = _d, h2 = __objRest(_d, ["ast", "code", "customTransformCache", "originalCode", "originalSourcemap", "resolvedIds", "sourcemapChain", "transformDependencies", "transformFiles"]);
    this.info.code = t, this.originalCode = s, this.originalSourcemap = n2, this.sourcemapChain = a3, l2 && (this.transformFiles = l2), this.transformDependencies = o2, this.customTransformCache = i, this.updateOptions(h2), en("generate ast", 3), e || (e = this.tryParse()), tn("generate ast", 3), this.resolvedIds = r2 || /* @__PURE__ */ Object.create(null);
    const c2 = this.id;
    this.magicString = new x(t, { filename: this.excludeFromSourcemap ? null : c2, indentExclusionRanges: [] }), en("analyse ast", 3), this.astContext = { addDynamicImport: this.addDynamicImport.bind(this), addExport: this.addExport.bind(this), addImport: this.addImport.bind(this), addImportMeta: this.addImportMeta.bind(this), code: t, deoptimizationTracker: this.graph.deoptimizationTracker, error: this.error.bind(this), fileName: c2, getExports: this.getExports.bind(this), getModuleExecIndex: () => this.execIndex, getModuleName: this.basename.bind(this), getNodeConstructor: (e2) => Fs[e2] || Fs.UnknownNode, getReexports: this.getReexports.bind(this), importDescriptions: this.importDescriptions, includeAllExports: () => this.includeAllExports(true), includeDynamicImport: this.includeDynamicImport.bind(this), includeVariableInModule: this.includeVariableInModule.bind(this), magicString: this.magicString, module: this, moduleContext: this.context, options: this.options, requestTreeshakingPass: () => this.graph.needsTreeshakingPass = true, traceExport: (e2) => this.getVariableForExportName(e2)[0], traceVariable: this.traceVariable.bind(this), usesTopLevelAwait: false, warn: this.warn.bind(this) }, this.scope = new Ds(this.graph.scope, this.astContext), this.namespace = new js(this.astContext), this.ast = new $s(e, { context: this.astContext, type: "Module" }, this.scope), this.info.ast = e, tn("analyse ast", 3);
  }
  toJSON() {
    return { ast: this.ast.esTreeNode, code: this.info.code, customTransformCache: this.customTransformCache, dependencies: Array.from(this.dependencies, Hs), id: this.id, meta: this.info.meta, moduleSideEffects: this.info.moduleSideEffects, originalCode: this.originalCode, originalSourcemap: this.originalSourcemap, resolvedIds: this.resolvedIds, sourcemapChain: this.sourcemapChain, syntheticNamedExports: this.info.syntheticNamedExports, transformDependencies: this.transformDependencies, transformFiles: this.transformFiles };
  }
  traceVariable(e, { importerForSideEffects: t, isExportAllSearch: i, searchedNamesAndModules: s } = se) {
    const n2 = this.scope.variables.get(e);
    if (n2)
      return n2;
    const r2 = this.importDescriptions.get(e);
    if (r2) {
      const e2 = r2.module;
      if (e2 instanceof ln && r2.name === "*")
        return e2.namespace;
      const [n3] = on(e2, r2.name, t || this, i, s);
      return n3 || this.error(Ee(r2.name, this.id, e2.id), r2.start);
    }
    return null;
  }
  tryParse() {
    try {
      return this.graph.contextParse(this.info.code);
    } catch (e) {
      let t = e.message.replace(/ \(\d+:\d+\)$/, "");
      return this.id.endsWith(".json") ? t += " (Note that you need @rollup/plugin-json to import JSON files)" : this.id.endsWith(".js") || (t += " (Note that you need plugins to import files that are not JavaScript)"), this.error({ code: "PARSE_ERROR", message: t, parserError: e }, e.pos);
    }
  }
  updateOptions({ meta: e, moduleSideEffects: t, syntheticNamedExports: i }) {
    t != null && (this.info.moduleSideEffects = t), i != null && (this.info.syntheticNamedExports = i), e != null && Object.assign(this.info.meta, e);
  }
  warn(e, t) {
    this.addLocationToLogProps(e, t), this.options.onwarn(e);
  }
  addDynamicImport(e) {
    let t = e.source;
    t instanceof Os ? t.quasis.length === 1 && t.quasis[0].value.cooked && (t = t.quasis[0].value.cooked) : t instanceof Ti && typeof t.value == "string" && (t = t.value), this.dynamicImports.push({ argument: t, id: null, node: e, resolution: null });
  }
  addExport(e) {
    if (e instanceof Ki)
      this.exports.set("default", { identifier: e.variable.getAssignedVariableName(), localName: "default" });
    else if (e instanceof Wi) {
      const t = e.source.value;
      if (this.sources.add(t), e.exported) {
        const i = e.exported.name;
        this.reexportDescriptions.set(i, { localName: "*", module: null, source: t, start: e.start });
      } else
        this.exportAllSources.add(t);
    } else if (e.source instanceof Ti) {
      const t = e.source.value;
      this.sources.add(t);
      for (const i of e.specifiers) {
        const e2 = i.exported.name;
        this.reexportDescriptions.set(e2, { localName: i.local.name, module: null, source: t, start: i.start });
      }
    } else if (e.declaration) {
      const t = e.declaration;
      if (t instanceof Bs)
        for (const e2 of t.declarations)
          for (const t2 of Oe(e2.id))
            this.exports.set(t2, { identifier: null, localName: t2 });
      else {
        const e2 = t.id.name;
        this.exports.set(e2, { identifier: null, localName: e2 });
      }
    } else
      for (const t of e.specifiers) {
        const e2 = t.local.name, i = t.exported.name;
        this.exports.set(i, { identifier: null, localName: e2 });
      }
  }
  addImport(e) {
    const t = e.source.value;
    this.sources.add(t);
    for (const i of e.specifiers) {
      const e2 = i.type === "ImportDefaultSpecifier", s = i.type === "ImportNamespaceSpecifier", n2 = e2 ? "default" : s ? "*" : i.imported.name;
      this.importDescriptions.set(i.local.name, { module: null, name: n2, source: t, start: i.start });
    }
  }
  addImportMeta(e) {
    this.importMetas.push(e);
  }
  addLocationToLogProps(e, t) {
    e.id = this.id, e.pos = t;
    let i = this.info.code;
    const s = re(i, t, { offsetLine: 1 });
    if (s) {
      let { column: n2, line: r2 } = s;
      try {
        ({ column: n2, line: r2 } = function(e2, t2) {
          const i2 = e2.filter((e3) => !!e3.mappings);
          e:
            for (; i2.length > 0; ) {
              const e3 = i2.pop().mappings[t2.line - 1];
              if (e3) {
                const i3 = e3.filter((e4) => e4.length > 1), s2 = i3[i3.length - 1];
                for (const e4 of i3)
                  if (e4[0] >= t2.column || e4 === s2) {
                    t2 = { column: e4[3], line: e4[2] + 1 };
                    continue e;
                  }
              }
              throw new Error("Can't resolve original location of error.");
            }
          return t2;
        }(this.sourcemapChain, { column: n2, line: r2 })), i = this.originalCode;
      } catch (e2) {
        this.options.onwarn({ code: "SOURCEMAP_ERROR", id: this.id, loc: { column: n2, file: this.id, line: r2 }, message: `Error when using sourcemap for reporting an error: ${e2.message}`, pos: t });
      }
      fe(e, { column: n2, line: r2 }, i, this.id);
    }
  }
  addModulesToImportDescriptions(e) {
    for (const t of e.values()) {
      const { id: e2 } = this.resolvedIds[t.source];
      t.module = this.graph.modulesById.get(e2);
    }
  }
  addRelevantSideEffectDependencies(e, t, i) {
    const s = /* @__PURE__ */ new Set(), n2 = (r2) => {
      for (const a3 of r2)
        s.has(a3) || (s.add(a3), t.has(a3) ? e.add(a3) : (a3.info.moduleSideEffects || i.has(a3)) && (a3 instanceof $e || a3.hasEffects() ? e.add(a3) : n2(a3.dependencies)));
    };
    n2(this.dependencies), n2(i);
  }
  getVariableFromNamespaceReexports(e, t, i) {
    let s = null;
    const n2 = /* @__PURE__ */ new Map(), r2 = /* @__PURE__ */ new Set();
    for (const a3 of this.exportAllModules) {
      if (a3.info.syntheticNamedExports === e)
        continue;
      const [o2, l2] = on(a3, e, t, true, cn(i));
      a3 instanceof $e || l2 ? r2.add(o2) : o2 instanceof Us ? s || (s = o2) : o2 && n2.set(o2, a3);
    }
    if (n2.size > 0) {
      const t2 = [...n2], i2 = t2[0][0];
      return t2.length === 1 ? [i2] : (this.options.onwarn(function(e2, t3, i3) {
        return { code: me.NAMESPACE_CONFLICT, message: `Conflicting namespaces: "${he(t3)}" re-exports "${e2}" from one of the modules ${oe(i3.map((e3) => he(e3)))} (will be ignored)`, name: e2, reexporter: t3, sources: i3 };
      }(e, this.id, t2.map(([, e2]) => e2.id))), [null]);
    }
    if (r2.size > 0) {
      const t2 = [...r2], i2 = t2[0];
      return t2.length > 1 && this.options.onwarn(function(e2, t3, i3, s2) {
        return { code: me.AMBIGUOUS_EXTERNAL_NAMESPACES, message: `Ambiguous external namespace resolution: "${he(t3)}" re-exports "${e2}" from one of the external modules ${oe(s2.map((e3) => he(e3)))}, guessing "${he(i3)}".`, name: e2, reexporter: t3, sources: s2 };
      }(e, this.id, i2.module.id, t2.map((e2) => e2.module.id))), [i2, true];
    }
    return s ? [s] : [null];
  }
  includeAndGetAdditionalMergedNamespaces() {
    const e = /* @__PURE__ */ new Set(), t = /* @__PURE__ */ new Set();
    for (const i of [this, ...this.exportAllModules])
      if (i instanceof $e) {
        const [t2] = i.getVariableForExportName("*");
        t2.include(), this.includedImports.add(t2), e.add(t2);
      } else if (i.info.syntheticNamedExports) {
        const e2 = i.getSyntheticNamespace();
        e2.include(), this.includedImports.add(e2), t.add(e2);
      }
    return [...t, ...e];
  }
  includeDynamicImport(e) {
    const t = this.dynamicImports.find((t2) => t2.node === e).resolution;
    t instanceof ln && (t.includedDynamicImporters.push(this), t.includeAllExports(true));
  }
  includeVariable(e) {
    if (!e.included) {
      e.include(), this.graph.needsTreeshakingPass = true;
      const t = e.module;
      if (t instanceof ln && (t.isExecuted || rn(t), t !== this)) {
        const t2 = function(e2, t3) {
          const i = R(t3.sideEffectDependenciesByVariable, e2, () => /* @__PURE__ */ new Set());
          let s = e2;
          const n2 = /* @__PURE__ */ new Set([s]);
          for (; ; ) {
            const e3 = s.module;
            if (s = s instanceof Ms ? s.getDirectOriginalVariable() : s instanceof Us ? s.syntheticNamespace : null, !s || n2.has(s))
              break;
            n2.add(s), i.add(e3);
            const t4 = e3.sideEffectDependenciesByVariable.get(s);
            if (t4)
              for (const e4 of t4)
                i.add(e4);
          }
          return i;
        }(e, this);
        for (const e2 of t2)
          e2.isExecuted || rn(e2);
      }
    }
  }
  includeVariableInModule(e) {
    this.includeVariable(e);
    const t = e.module;
    t && t !== this && this.includedImports.add(e);
  }
  shimMissingExport(e) {
    this.options.onwarn({ code: "SHIMMED_EXPORT", exporter: he(this.id), exportName: e, message: `Missing export "${e}" has been shimmed in module ${he(this.id)}.` }), this.exports.set(e, an);
  }
}
function hn(e, t, i) {
  if (e.module instanceof ln && e.module !== i) {
    const s = e.module.cycles;
    if (s.size > 0) {
      const n2 = i.cycles;
      for (const r2 of n2)
        if (s.has(r2)) {
          t.alternativeReexportModules.set(e, i);
          break;
        }
    }
  }
}
const cn = (e) => e && new Map(Array.from(e, ([e2, t]) => [e2, new Set(t)]));
function un(e) {
  return e.endsWith(".js") ? e.slice(0, -3) : e;
}
function dn(e, t) {
  return e.autoId ? `${e.basePath ? e.basePath + "/" : ""}${un(t)}` : e.id || "";
}
function pn(e, t, i, s, n2, r2, a3, o2 = "return ") {
  const { _: l2, cnst: h2, getDirectReturnFunction: c2, getFunctionIntro: u2, getPropertyAccess: d2, n: p2, s: f2 } = n2;
  if (!i)
    return `${p2}${p2}${o2}${function(e2, t2, i2, s2, n3) {
      if (e2.length > 0)
        return e2[0].local;
      for (const { defaultVariableName: e3, id: r3, isChunk: a4, name: o3, namedExportsMode: l3, namespaceVariableName: h3, reexports: c3 } of t2)
        if (c3)
          return fn(o3, c3[0].imported, l3, a4, e3, h3, i2, r3, s2, n3);
    }(e, t, s, a3, d2)};`;
  let m3 = "";
  for (const { defaultVariableName: e2, id: n3, isChunk: o3, name: h3, namedExportsMode: u3, namespaceVariableName: f3, reexports: g2 } of t)
    if (g2 && i) {
      for (const t2 of g2)
        if (t2.reexported !== "*") {
          const i2 = fn(h3, t2.imported, u3, o3, e2, f3, s, n3, a3, d2);
          if (m3 && (m3 += p2), t2.imported !== "*" && t2.needsLiveBinding) {
            const [e3, s2] = c2([], { functionReturn: true, lineBreakIndent: null, name: null });
            m3 += `Object.defineProperty(exports,${l2}'${t2.reexported}',${l2}{${p2}${r2}enumerable:${l2}true,${p2}${r2}get:${l2}${e3}${i2}${s2}${p2}});`;
          } else
            m3 += `exports${d2(t2.reexported)}${l2}=${l2}${i2};`;
        }
    }
  for (const { exported: t2, local: i2 } of e) {
    const e2 = `exports${d2(t2)}`, s2 = i2;
    e2 !== s2 && (m3 && (m3 += p2), m3 += `${e2}${l2}=${l2}${s2};`);
  }
  for (const { name: e2, reexports: s2 } of t)
    if (s2 && i) {
      for (const t2 of s2)
        if (t2.reexported === "*") {
          m3 && (m3 += p2);
          const i2 = `{${p2}${r2}if${l2}(k${l2}!==${l2}'default'${l2}&&${l2}!exports.hasOwnProperty(k))${l2}${yn(e2, t2.needsLiveBinding, r2, n2)}${f2}${p2}}`;
          m3 += h2 === "var" && t2.needsLiveBinding ? `Object.keys(${e2}).forEach(${u2(["k"], { isAsync: false, name: null })}${i2});` : `for${l2}(${h2} k in ${e2})${l2}${i2}`;
        }
    }
  return m3 ? `${p2}${p2}${m3}` : "";
}
function fn(e, t, i, s, n2, r2, a3, o2, l2, h2) {
  if (t === "default") {
    if (!s) {
      const t2 = String(a3(o2)), i2 = es[t2] ? n2 : e;
      return ts(t2, l2) ? `${i2}${h2("default")}` : i2;
    }
    return i ? `${e}${h2("default")}` : e;
  }
  return t === "*" ? (s ? !i : is[String(a3(o2))]) ? r2 : e : `${e}${h2(t)}`;
}
function mn(e) {
  return e([["value", "true"]], { lineBreakIndent: null });
}
function gn(e, t, i, { _: s, getObject: n2 }) {
  if (e) {
    if (t)
      return i ? `Object.defineProperties(exports,${s}${n2([["__esModule", mn(n2)], [null, `[Symbol.toStringTag]:${s}${xs(n2)}`]], { lineBreakIndent: null })});` : `Object.defineProperty(exports,${s}'__esModule',${s}${mn(n2)});`;
    if (i)
      return `Object.defineProperty(exports,${s}Symbol.toStringTag,${s}${xs(n2)});`;
  }
  return "";
}
const yn = (e, t, i, { _: s, getDirectReturnFunction: n2, n: r2 }) => {
  if (t) {
    const [t2, a3] = n2([], { functionReturn: true, lineBreakIndent: null, name: null });
    return `Object.defineProperty(exports,${s}k,${s}{${r2}${i}${i}enumerable:${s}true,${r2}${i}${i}get:${s}${t2}${e}[k]${a3}${r2}${i}})`;
  }
  return `exports[k]${s}=${s}${e}[k]`;
};
function xn(e, t, i, s, n2, r2, a3, o2) {
  const { _: l2, cnst: h2, n: c2 } = o2, u2 = /* @__PURE__ */ new Set(), d2 = [], p2 = (e2, t2, i2) => {
    u2.add(t2), d2.push(`${h2} ${e2}${l2}=${l2}/*#__PURE__*/${t2}(${i2});`);
  };
  for (const { defaultVariableName: i2, imports: s2, id: n3, isChunk: r3, name: a4, namedExportsMode: o3, namespaceVariableName: l3, reexports: h3 } of e)
    if (r3) {
      for (const { imported: e2, reexported: t2 } of [...s2 || [], ...h3 || []])
        if (e2 === "*" && t2 !== "*") {
          o3 || p2(l3, "_interopNamespaceDefaultOnly", a4);
          break;
        }
    } else {
      const e2 = String(t(n3));
      let r4 = false, o4 = false;
      for (const { imported: t2, reexported: n4 } of [...s2 || [], ...h3 || []]) {
        let s3, h4;
        t2 === "default" ? r4 || (r4 = true, i2 !== l3 && (h4 = i2, s3 = es[e2])) : t2 === "*" && n4 !== "*" && (o4 || (o4 = true, s3 = is[e2], h4 = l3)), s3 && p2(h4, s3, a4);
      }
    }
  return `${ns(u2, r2, a3, o2, i, s, n2)}${d2.length > 0 ? `${d2.join(c2)}${c2}${c2}` : ""}`;
}
function En(e) {
  return e[0] === "." ? un(e) : e;
}
const bn = { assert: true, buffer: true, console: true, constants: true, domain: true, events: true, http: true, https: true, os: true, path: true, process: true, punycode: true, querystring: true, stream: true, string_decoder: true, timers: true, tty: true, url: true, util: true, vm: true, zlib: true };
function vn(e, t) {
  const i = t.map(({ id: e2 }) => e2).filter((e2) => e2 in bn);
  i.length && e({ code: "MISSING_NODE_BUILTINS", message: `Creating a browser bundle that depends on Node.js built-in modules (${oe(i)}). You might need to include https://github.com/FredKSchott/rollup-plugin-polyfill-node`, modules: i });
}
const Sn = (e, t) => e.split(".").map(t).join("");
function An(e, t, i, s, { _: n2, getPropertyAccess: r2 }) {
  const a3 = e.split(".");
  a3[0] = (typeof i == "function" ? i(a3[0]) : i[a3[0]]) || a3[0];
  const o2 = a3.pop();
  let l2 = t, h2 = a3.map((e2) => (l2 += r2(e2), `${l2}${n2}=${n2}${l2}${n2}||${n2}{}`)).concat(`${l2}${r2(o2)}`).join(`,${n2}`) + `${n2}=${n2}${s}`;
  return a3.length > 0 && (h2 = `(${h2})`), h2;
}
function In(e) {
  let t = e.length;
  for (; t--; ) {
    const { imports: i, reexports: s } = e[t];
    if (i || s)
      return e.slice(0, t + 1);
  }
  return [];
}
const kn = ({ dependencies: e, exports: t }) => {
  const i = new Set(t.map((e2) => e2.exported));
  i.add("default");
  for (const { reexports: t2 } of e)
    if (t2)
      for (const e2 of t2)
        e2.reexported !== "*" && i.add(e2.reexported);
  return i;
}, Pn = (e, t, { _: i, cnst: s, getObject: n2, n: r2 }) => e ? `${r2}${t}${s} _starExcludes${i}=${i}${n2([...e].map((e2) => [e2, "1"]), { lineBreakIndent: { base: t, t } })};` : "", wn = (e, t, { _: i, n: s }) => e.length ? `${s}${t}var ${e.join(`,${i}`)};` : "", Cn = (e, t, i) => _n(e.filter((e2) => e2.hoisted).map((e2) => ({ name: e2.exported, value: e2.local })), t, i);
function _n(e, t, { _: i, n: s }) {
  return e.length === 0 ? "" : e.length === 1 ? `exports('${e[0].name}',${i}${e[0].value});${s}${s}` : `exports({${s}` + e.map(({ name: e2, value: s2 }) => `${t}${e2}:${i}${s2}`).join(`,${s}`) + `${s}});${s}${s}`;
}
const Nn = (e, t, i) => _n(e.filter((e2) => e2.expression).map((e2) => ({ name: e2.exported, value: e2.local })), t, i), $n = (e, t, i) => _n(e.filter((e2) => e2.local === "_missingExportShim").map((e2) => ({ name: e2.exported, value: "_missingExportShim" })), t, i);
function Tn(e, t, i) {
  return e ? `${t}${Sn(e, i)}` : "null";
}
var On = { amd: function(e, { accessedGlobals: t, dependencies: i, exports: s, hasExports: n2, id: r2, indent: a3, intro: o2, isEntryFacade: l2, isModuleFacade: h2, namedExportsMode: c2, outro: u2, snippets: d2, warn: p2 }, { amd: f2, esModule: m3, externalLiveBindings: g2, freeze: y2, interop: x2, namespaceToStringTag: E2, strict: b3 }) {
  vn(p2, i);
  const v2 = i.map((e2) => `'${En(e2.id)}'`), S2 = i.map((e2) => e2.name), { n: A2, getNonArrowFunctionIntro: I2, _: k2 } = d2;
  c2 && n2 && (S2.unshift("exports"), v2.unshift("'exports'")), t.has("require") && (S2.unshift("require"), v2.unshift("'require'")), t.has("module") && (S2.unshift("module"), v2.unshift("'module'"));
  const P2 = dn(f2, r2), w2 = (P2 ? `'${P2}',${k2}` : "") + (v2.length ? `[${v2.join(`,${k2}`)}],${k2}` : ""), C2 = b3 ? `${k2}'use strict';` : "";
  e.prepend(`${o2}${xn(i, x2, g2, y2, E2, t, a3, d2)}`);
  const _2 = pn(s, i, c2, x2, d2, a3, g2);
  let N2 = gn(c2 && n2, l2 && m3, h2 && E2, d2);
  return N2 && (N2 = A2 + A2 + N2), e.append(`${_2}${N2}${u2}`), e.indent(a3).prepend(`${f2.define}(${w2}(${I2(S2, { isAsync: false, name: null })}{${C2}${A2}${A2}`).append(`${A2}${A2}}));`);
}, cjs: function(e, { accessedGlobals: t, dependencies: i, exports: s, hasExports: n2, indent: r2, intro: a3, isEntryFacade: o2, isModuleFacade: l2, namedExportsMode: h2, outro: c2, snippets: u2 }, { compact: d2, esModule: p2, externalLiveBindings: f2, freeze: m3, interop: g2, namespaceToStringTag: y2, strict: x2 }) {
  const { _: E2, n: b3 } = u2, v2 = x2 ? `'use strict';${b3}${b3}` : "";
  let S2 = gn(h2 && n2, o2 && p2, l2 && y2, u2);
  S2 && (S2 += b3 + b3);
  const A2 = function(e2, { _: t2, cnst: i2, n: s2 }, n3) {
    let r3 = "", a4 = false;
    for (const { id: o3, name: l3, reexports: h3, imports: c3 } of e2)
      h3 || c3 ? (r3 += n3 && a4 ? "," : `${r3 ? `;${s2}` : ""}${i2} `, a4 = true, r3 += `${l3}${t2}=${t2}require('${o3}')`) : (r3 && (r3 += n3 && !a4 ? "," : `;${s2}`), a4 = false, r3 += `require('${o3}')`);
    if (r3)
      return `${r3};${s2}${s2}`;
    return "";
  }(i, u2, d2), I2 = xn(i, g2, f2, m3, y2, t, r2, u2);
  e.prepend(`${v2}${a3}${S2}${A2}${I2}`);
  const k2 = pn(s, i, h2, g2, u2, r2, f2, `module.exports${E2}=${E2}`);
  return e.append(`${k2}${c2}`);
}, es: function(e, { accessedGlobals: t, indent: i, intro: s, outro: n2, dependencies: r2, exports: a3, snippets: o2 }, { externalLiveBindings: l2, freeze: h2, namespaceToStringTag: c2 }) {
  const { _: u2, n: d2 } = o2, p2 = function(e2, t2) {
    const i2 = [];
    for (const { id: s2, reexports: n3, imports: r3, name: a4 } of e2)
      if (n3 || r3) {
        if (r3) {
          let e3 = null, n4 = null;
          const a5 = [];
          for (const t3 of r3)
            t3.imported === "default" ? e3 = t3 : t3.imported === "*" ? n4 = t3 : a5.push(t3);
          n4 && i2.push(`import${t2}*${t2}as ${n4.local} from${t2}'${s2}';`), e3 && a5.length === 0 ? i2.push(`import ${e3.local} from${t2}'${s2}';`) : a5.length > 0 && i2.push(`import ${e3 ? `${e3.local},${t2}` : ""}{${t2}${a5.map((e4) => e4.imported === e4.local ? e4.imported : `${e4.imported} as ${e4.local}`).join(`,${t2}`)}${t2}}${t2}from${t2}'${s2}';`);
        }
        if (n3) {
          let e3 = null;
          const o3 = [], l3 = [];
          for (const t3 of n3)
            t3.reexported === "*" ? e3 = t3 : t3.imported === "*" ? o3.push(t3) : l3.push(t3);
          if (e3 && i2.push(`export${t2}*${t2}from${t2}'${s2}';`), o3.length > 0) {
            r3 && r3.some((e4) => e4.imported === "*" && e4.local === a4) || i2.push(`import${t2}*${t2}as ${a4} from${t2}'${s2}';`);
            for (const e4 of o3)
              i2.push(`export${t2}{${t2}${a4 === e4.reexported ? a4 : `${a4} as ${e4.reexported}`} };`);
          }
          l3.length > 0 && i2.push(`export${t2}{${t2}${l3.map((e4) => e4.imported === e4.reexported ? e4.imported : `${e4.imported} as ${e4.reexported}`).join(`,${t2}`)}${t2}}${t2}from${t2}'${s2}';`);
        }
      } else
        i2.push(`import${t2}'${s2}';`);
    return i2;
  }(r2, u2);
  p2.length > 0 && (s += p2.join(d2) + d2 + d2), (s += ns(null, t, i, o2, l2, h2, c2)) && e.prepend(s);
  const f2 = function(e2, { _: t2, cnst: i2 }) {
    const s2 = [], n3 = [];
    for (const r3 of e2)
      r3.expression && s2.push(`${i2} ${r3.local}${t2}=${t2}${r3.expression};`), n3.push(r3.exported === r3.local ? r3.local : `${r3.local} as ${r3.exported}`);
    n3.length && s2.push(`export${t2}{${t2}${n3.join(`,${t2}`)}${t2}};`);
    return s2;
  }(a3, o2);
  return f2.length && e.append(d2 + d2 + f2.join(d2).trim()), n2 && e.append(n2), e.trim();
}, iife: function(e, { accessedGlobals: t, dependencies: i, exports: s, hasExports: n2, indent: r2, intro: a3, namedExportsMode: o2, outro: l2, snippets: h2, warn: c2 }, { compact: u2, esModule: d2, extend: p2, freeze: f2, externalLiveBindings: m3, globals: g2, interop: y2, name: x2, namespaceToStringTag: E2, strict: b3 }) {
  const { _: v2, cnst: S2, getNonArrowFunctionIntro: A2, getPropertyAccess: I2, n: k2 } = h2, P2 = x2 && x2.includes("."), w2 = !p2 && !P2;
  if (x2 && w2 && (_e(C2 = x2) || we.has(C2) || Ce.test(C2)))
    return pe({ code: "ILLEGAL_IDENTIFIER_AS_NAME", message: `Given name "${x2}" is not a legal JS identifier. If you need this, you can try "output.extend: true".` });
  var C2;
  vn(c2, i);
  const _2 = In(i), N2 = _2.map((e2) => e2.globalName || "null"), $2 = _2.map((e2) => e2.name);
  n2 && !x2 && c2({ code: "MISSING_NAME_OPTION_FOR_IIFE_EXPORT", message: 'If you do not supply "output.name", you may not be able to access the exports of an IIFE bundle.' }), o2 && n2 && (p2 ? (N2.unshift(`this${Sn(x2, I2)}${v2}=${v2}this${Sn(x2, I2)}${v2}||${v2}{}`), $2.unshift("exports")) : (N2.unshift("{}"), $2.unshift("exports")));
  const T2 = b3 ? `${r2}'use strict';${k2}` : "", O2 = xn(i, y2, m3, f2, E2, t, r2, h2);
  e.prepend(`${a3}${O2}`);
  let R2 = `(${A2($2, { isAsync: false, name: null })}{${k2}${T2}${k2}`;
  n2 && (!x2 || p2 && o2 || (R2 = (w2 ? `${S2} ${x2}` : `this${Sn(x2, I2)}`) + `${v2}=${v2}${R2}`), P2 && (R2 = function(e2, t2, i2, { _: s2, getPropertyAccess: n3, s: r3 }, a4) {
    const o3 = e2.split(".");
    o3[0] = (typeof i2 == "function" ? i2(o3[0]) : i2[o3[0]]) || o3[0], o3.pop();
    let l3 = t2;
    return o3.map((e3) => (l3 += n3(e3), `${l3}${s2}=${s2}${l3}${s2}||${s2}{}${r3}`)).join(a4 ? "," : "\n") + (a4 && o3.length ? ";" : "\n");
  }(x2, "this", g2, h2, u2) + R2));
  let M2 = `${k2}${k2}})(${N2.join(`,${v2}`)});`;
  n2 && !p2 && o2 && (M2 = `${k2}${k2}${r2}return exports;${M2}`);
  const D2 = pn(s, i, o2, y2, h2, r2, m3);
  let L2 = gn(o2 && n2, d2, E2, h2);
  return L2 && (L2 = k2 + k2 + L2), e.append(`${D2}${L2}${l2}`), e.indent(r2).prepend(R2).append(M2);
}, system: function(e, { accessedGlobals: t, dependencies: i, exports: s, hasExports: n2, indent: r2, intro: a3, snippets: o2, outro: l2, usesTopLevelAwait: h2 }, { externalLiveBindings: c2, freeze: u2, name: d2, namespaceToStringTag: p2, strict: f2, systemNullSetters: m3 }) {
  const { _: g2, getFunctionIntro: y2, getNonArrowFunctionIntro: x2, n: E2, s: b3 } = o2, { importBindings: v2, setters: S2, starExcludes: A2 } = function(e2, t2, i2, { _: s2, cnst: n3, getObject: r3, getPropertyAccess: a4, n: o3 }) {
    const l3 = [], h3 = [];
    let c3 = null;
    for (const { imports: u3, reexports: d3 } of e2) {
      const p3 = [];
      if (u3)
        for (const e3 of u3)
          l3.push(e3.local), e3.imported === "*" ? p3.push(`${e3.local}${s2}=${s2}module;`) : p3.push(`${e3.local}${s2}=${s2}module${a4(e3.imported)};`);
      if (d3) {
        const o4 = [];
        let l4 = false;
        for (const { imported: e3, reexported: t3 } of d3)
          t3 === "*" ? l4 = true : o4.push([t3, e3 === "*" ? "module" : `module${a4(e3)}`]);
        if (o4.length > 1 || l4) {
          const a5 = r3(o4, { lineBreakIndent: null });
          l4 ? (c3 || (c3 = kn({ dependencies: e2, exports: t2 })), p3.push(`${n3} setter${s2}=${s2}${a5};`, `for${s2}(${n3} name in module)${s2}{`, `${i2}if${s2}(!_starExcludes[name])${s2}setter[name]${s2}=${s2}module[name];`, "}", "exports(setter);")) : p3.push(`exports(${a5});`);
        } else {
          const [e3, t3] = o4[0];
          p3.push(`exports('${e3}',${s2}${t3});`);
        }
      }
      h3.push(p3.join(`${o3}${i2}${i2}${i2}`));
    }
    return { importBindings: l3, setters: h3, starExcludes: c3 };
  }(i, s, r2, o2), I2 = d2 ? `'${d2}',${g2}` : "", k2 = t.has("module") ? ["exports", "module"] : n2 ? ["exports"] : [];
  let P2 = `System.register(${I2}[` + i.map(({ id: e2 }) => `'${e2}'`).join(`,${g2}`) + `],${g2}(${x2(k2, { isAsync: false, name: null })}{${E2}${r2}${f2 ? "'use strict';" : ""}` + Pn(A2, r2, o2) + wn(v2, r2, o2) + `${E2}${r2}return${g2}{${S2.length ? `${E2}${r2}${r2}setters:${g2}[${S2.map((e2) => e2 ? `${y2(["module"], { isAsync: false, name: null })}{${E2}${r2}${r2}${r2}${e2}${E2}${r2}${r2}}` : m3 ? "null" : `${y2([], { isAsync: false, name: null })}{}`).join(`,${g2}`)}],` : ""}${E2}`;
  P2 += `${r2}${r2}execute:${g2}(${x2([], { isAsync: h2, name: null })}{${E2}${E2}`;
  const w2 = `${r2}${r2}})${E2}${r2}}${b3}${E2}}));`;
  return e.prepend(a3 + ns(null, t, r2, o2, c2, u2, p2) + Cn(s, r2, o2)), e.append(`${l2}${E2}${E2}` + Nn(s, r2, o2) + $n(s, r2, o2)), e.indent(`${r2}${r2}${r2}`).append(w2).prepend(P2);
}, umd: function(e, { accessedGlobals: t, dependencies: i, exports: s, hasExports: n2, id: r2, indent: a3, intro: o2, namedExportsMode: l2, outro: h2, snippets: c2, warn: u2 }, { amd: d2, compact: p2, esModule: f2, extend: m3, externalLiveBindings: g2, freeze: y2, interop: x2, name: E2, namespaceToStringTag: b3, globals: v2, noConflict: S2, strict: A2 }) {
  const { _: I2, cnst: k2, getFunctionIntro: P2, getNonArrowFunctionIntro: w2, getPropertyAccess: C2, n: _2, s: N2 } = c2, $2 = p2 ? "f" : "factory", T2 = p2 ? "g" : "global";
  if (n2 && !E2)
    return pe({ code: "MISSING_NAME_OPTION_FOR_IIFE_EXPORT", message: 'You must supply "output.name" for UMD bundles that have exports so that the exports are accessible in environments without a module loader.' });
  vn(u2, i);
  const O2 = i.map((e2) => `'${En(e2.id)}'`), R2 = i.map((e2) => `require('${e2.id}')`), M2 = In(i), D2 = M2.map((e2) => Tn(e2.globalName, T2, C2)), L2 = M2.map((e2) => e2.name);
  l2 && (n2 || S2) && (O2.unshift("'exports'"), R2.unshift("exports"), D2.unshift(An(E2, T2, v2, (m3 ? `${Tn(E2, T2, C2)}${I2}||${I2}` : "") + "{}", c2)), L2.unshift("exports"));
  const V2 = dn(d2, r2), B2 = (V2 ? `'${V2}',${I2}` : "") + (O2.length ? `[${O2.join(`,${I2}`)}],${I2}` : ""), F2 = d2.define, z2 = !l2 && n2 ? `module.exports${I2}=${I2}` : "", j2 = A2 ? `${I2}'use strict';${_2}` : "";
  let U2;
  if (S2) {
    const e2 = p2 ? "e" : "exports";
    let t2;
    if (!l2 && n2)
      t2 = `${k2} ${e2}${I2}=${I2}${An(E2, T2, v2, `${$2}(${D2.join(`,${I2}`)})`, c2)};`;
    else {
      t2 = `${k2} ${e2}${I2}=${I2}${D2.shift()};${_2}${a3}${a3}${$2}(${[e2].concat(D2).join(`,${I2}`)});`;
    }
    U2 = `(${P2([], { isAsync: false, name: null })}{${_2}${a3}${a3}${k2} current${I2}=${I2}${function(e3, t3, { _: i2, getPropertyAccess: s2 }) {
      let n3 = t3;
      return e3.split(".").map((e4) => n3 += s2(e4)).join(`${i2}&&${i2}`);
    }(E2, T2, c2)};${_2}${a3}${a3}${t2}${_2}${a3}${a3}${e2}.noConflict${I2}=${I2}${P2([], { isAsync: false, name: null })}{${I2}${Tn(E2, T2, C2)}${I2}=${I2}current;${I2}return ${e2}${N2}${I2}};${_2}${a3}})()`;
  } else
    U2 = `${$2}(${D2.join(`,${I2}`)})`, !l2 && n2 && (U2 = An(E2, T2, v2, U2, c2));
  const G2 = n2 || S2 && l2 || D2.length > 0, H2 = [$2];
  G2 && H2.unshift(T2);
  const W2 = G2 ? `this,${I2}` : "", q2 = G2 ? `(${T2}${I2}=${I2}typeof globalThis${I2}!==${I2}'undefined'${I2}?${I2}globalThis${I2}:${I2}${T2}${I2}||${I2}self,${I2}` : "", K2 = G2 ? ")" : "", X2 = G2 ? `${a3}typeof exports${I2}===${I2}'object'${I2}&&${I2}typeof module${I2}!==${I2}'undefined'${I2}?${I2}${z2}${$2}(${R2.join(`,${I2}`)})${I2}:${_2}` : "", Y2 = `(${w2(H2, { isAsync: false, name: null })}{${_2}` + X2 + `${a3}typeof ${F2}${I2}===${I2}'function'${I2}&&${I2}${F2}.amd${I2}?${I2}${F2}(${B2}${$2})${I2}:${_2}${a3}${q2}${U2}${K2};${_2}})(${W2}(${w2(L2, { isAsync: false, name: null })}{${j2}${_2}`, Q2 = _2 + _2 + "}));";
  e.prepend(`${o2}${xn(i, x2, g2, y2, b3, t, a3, c2)}`);
  const Z2 = pn(s, i, l2, x2, c2, a3, g2);
  let J2 = gn(l2 && n2, f2, b3, c2);
  return J2 && (J2 = _2 + _2 + J2), e.append(`${Z2}${J2}${h2}`), e.trim().indent(a3).append(Q2).prepend(Y2);
} };
class Rn {
  constructor(e, t) {
    this.isOriginal = true, this.filename = e, this.content = t;
  }
  traceSegment(e, t, i) {
    return { column: t, line: e, name: i, source: this };
  }
}
class Mn {
  constructor(e, t) {
    this.sources = t, this.names = e.names, this.mappings = e.mappings;
  }
  traceMappings() {
    const e = [], t = /* @__PURE__ */ new Map(), i = [], s = [], n2 = /* @__PURE__ */ new Map(), r2 = [];
    for (const a3 of this.mappings) {
      const o2 = [];
      for (const r3 of a3) {
        if (r3.length === 1)
          continue;
        const a4 = this.sources[r3[1]];
        if (!a4)
          continue;
        const l2 = a4.traceSegment(r3[2], r3[3], r3.length === 5 ? this.names[r3[4]] : "");
        if (l2) {
          const { column: a5, line: h2, name: c2, source: { content: u2, filename: d2 } } = l2;
          let p2 = t.get(d2);
          if (p2 === void 0)
            p2 = e.length, e.push(d2), t.set(d2, p2), i[p2] = u2;
          else if (i[p2] == null)
            i[p2] = u2;
          else if (u2 != null && i[p2] !== u2)
            return pe({ message: `Multiple conflicting contents for sourcemap source ${d2}` });
          const f2 = [r3[0], p2, h2, a5];
          if (c2) {
            let e2 = n2.get(c2);
            e2 === void 0 && (e2 = s.length, s.push(c2), n2.set(c2, e2)), f2[4] = e2;
          }
          o2.push(f2);
        }
      }
      r2.push(o2);
    }
    return { mappings: r2, names: s, sources: e, sourcesContent: i };
  }
  traceSegment(e, t, i) {
    const s = this.mappings[e];
    if (!s)
      return null;
    let n2 = 0, r2 = s.length - 1;
    for (; n2 <= r2; ) {
      const e2 = n2 + r2 >> 1, a3 = s[e2];
      if (a3[0] === t || n2 === r2) {
        if (a3.length == 1)
          return null;
        const e3 = this.sources[a3[1]];
        return e3 ? e3.traceSegment(a3[2], a3[3], a3.length === 5 ? this.names[a3[4]] : i) : null;
      }
      a3[0] > t ? r2 = e2 - 1 : n2 = e2 + 1;
    }
    return null;
  }
}
function Dn(e) {
  return function(t, i) {
    return i.mappings ? new Mn(i, [t]) : (e({ code: "SOURCEMAP_BROKEN", message: `Sourcemap is likely to be incorrect: a plugin (${i.plugin}) was used to transform files, but didn't generate a sourcemap for the transformation. Consult the plugin documentation for help`, plugin: i.plugin, url: "https://rollupjs.org/guide/en/#warning-sourcemap-is-likely-to-be-incorrect" }), new Mn({ mappings: [], names: [] }, [t]));
  };
}
function Ln(e, t, i, s, n2) {
  let r2;
  if (i) {
    const t2 = i.sources, s2 = i.sourcesContent || [], n3 = N(e) || ".", a3 = i.sourceRoot || ".", o2 = t2.map((e2, t3) => new Rn(O(n3, a3, e2), s2[t3]));
    r2 = new Mn(i, o2);
  } else
    r2 = new Rn(e, t);
  return s.reduce(n2, r2);
}
var Vn = {}, Bn = Fn;
function Fn(e, t) {
  if (!e)
    throw new Error(t || "Assertion failed");
}
Fn.equal = function(e, t, i) {
  if (e != t)
    throw new Error(i || "Assertion failed: " + e + " != " + t);
};
var zn = { exports: {} };
typeof Object.create == "function" ? zn.exports = function(e, t) {
  t && (e.super_ = t, e.prototype = Object.create(t.prototype, { constructor: { value: e, enumerable: false, writable: true, configurable: true } }));
} : zn.exports = function(e, t) {
  if (t) {
    e.super_ = t;
    var i = function() {
    };
    i.prototype = t.prototype, e.prototype = new i(), e.prototype.constructor = e;
  }
};
var jn = Bn, Un = zn.exports;
function Gn(e, t) {
  return (64512 & e.charCodeAt(t)) == 55296 && (!(t < 0 || t + 1 >= e.length) && (64512 & e.charCodeAt(t + 1)) == 56320);
}
function Hn(e) {
  return (e >>> 24 | e >>> 8 & 65280 | e << 8 & 16711680 | (255 & e) << 24) >>> 0;
}
function Wn(e) {
  return e.length === 1 ? "0" + e : e;
}
function qn(e) {
  return e.length === 7 ? "0" + e : e.length === 6 ? "00" + e : e.length === 5 ? "000" + e : e.length === 4 ? "0000" + e : e.length === 3 ? "00000" + e : e.length === 2 ? "000000" + e : e.length === 1 ? "0000000" + e : e;
}
Vn.inherits = Un, Vn.toArray = function(e, t) {
  if (Array.isArray(e))
    return e.slice();
  if (!e)
    return [];
  var i = [];
  if (typeof e == "string")
    if (t) {
      if (t === "hex")
        for ((e = e.replace(/[^a-z0-9]+/gi, "")).length % 2 != 0 && (e = "0" + e), n2 = 0; n2 < e.length; n2 += 2)
          i.push(parseInt(e[n2] + e[n2 + 1], 16));
    } else
      for (var s = 0, n2 = 0; n2 < e.length; n2++) {
        var r2 = e.charCodeAt(n2);
        r2 < 128 ? i[s++] = r2 : r2 < 2048 ? (i[s++] = r2 >> 6 | 192, i[s++] = 63 & r2 | 128) : Gn(e, n2) ? (r2 = 65536 + ((1023 & r2) << 10) + (1023 & e.charCodeAt(++n2)), i[s++] = r2 >> 18 | 240, i[s++] = r2 >> 12 & 63 | 128, i[s++] = r2 >> 6 & 63 | 128, i[s++] = 63 & r2 | 128) : (i[s++] = r2 >> 12 | 224, i[s++] = r2 >> 6 & 63 | 128, i[s++] = 63 & r2 | 128);
      }
  else
    for (n2 = 0; n2 < e.length; n2++)
      i[n2] = 0 | e[n2];
  return i;
}, Vn.toHex = function(e) {
  for (var t = "", i = 0; i < e.length; i++)
    t += Wn(e[i].toString(16));
  return t;
}, Vn.htonl = Hn, Vn.toHex32 = function(e, t) {
  for (var i = "", s = 0; s < e.length; s++) {
    var n2 = e[s];
    t === "little" && (n2 = Hn(n2)), i += qn(n2.toString(16));
  }
  return i;
}, Vn.zero2 = Wn, Vn.zero8 = qn, Vn.join32 = function(e, t, i, s) {
  var n2 = i - t;
  jn(n2 % 4 == 0);
  for (var r2 = new Array(n2 / 4), a3 = 0, o2 = t; a3 < r2.length; a3++, o2 += 4) {
    var l2;
    l2 = s === "big" ? e[o2] << 24 | e[o2 + 1] << 16 | e[o2 + 2] << 8 | e[o2 + 3] : e[o2 + 3] << 24 | e[o2 + 2] << 16 | e[o2 + 1] << 8 | e[o2], r2[a3] = l2 >>> 0;
  }
  return r2;
}, Vn.split32 = function(e, t) {
  for (var i = new Array(4 * e.length), s = 0, n2 = 0; s < e.length; s++, n2 += 4) {
    var r2 = e[s];
    t === "big" ? (i[n2] = r2 >>> 24, i[n2 + 1] = r2 >>> 16 & 255, i[n2 + 2] = r2 >>> 8 & 255, i[n2 + 3] = 255 & r2) : (i[n2 + 3] = r2 >>> 24, i[n2 + 2] = r2 >>> 16 & 255, i[n2 + 1] = r2 >>> 8 & 255, i[n2] = 255 & r2);
  }
  return i;
}, Vn.rotr32 = function(e, t) {
  return e >>> t | e << 32 - t;
}, Vn.rotl32 = function(e, t) {
  return e << t | e >>> 32 - t;
}, Vn.sum32 = function(e, t) {
  return e + t >>> 0;
}, Vn.sum32_3 = function(e, t, i) {
  return e + t + i >>> 0;
}, Vn.sum32_4 = function(e, t, i, s) {
  return e + t + i + s >>> 0;
}, Vn.sum32_5 = function(e, t, i, s, n2) {
  return e + t + i + s + n2 >>> 0;
}, Vn.sum64 = function(e, t, i, s) {
  var n2 = e[t], r2 = s + e[t + 1] >>> 0, a3 = (r2 < s ? 1 : 0) + i + n2;
  e[t] = a3 >>> 0, e[t + 1] = r2;
}, Vn.sum64_hi = function(e, t, i, s) {
  return (t + s >>> 0 < t ? 1 : 0) + e + i >>> 0;
}, Vn.sum64_lo = function(e, t, i, s) {
  return t + s >>> 0;
}, Vn.sum64_4_hi = function(e, t, i, s, n2, r2, a3, o2) {
  var l2 = 0, h2 = t;
  return l2 += (h2 = h2 + s >>> 0) < t ? 1 : 0, l2 += (h2 = h2 + r2 >>> 0) < r2 ? 1 : 0, e + i + n2 + a3 + (l2 += (h2 = h2 + o2 >>> 0) < o2 ? 1 : 0) >>> 0;
}, Vn.sum64_4_lo = function(e, t, i, s, n2, r2, a3, o2) {
  return t + s + r2 + o2 >>> 0;
}, Vn.sum64_5_hi = function(e, t, i, s, n2, r2, a3, o2, l2, h2) {
  var c2 = 0, u2 = t;
  return c2 += (u2 = u2 + s >>> 0) < t ? 1 : 0, c2 += (u2 = u2 + r2 >>> 0) < r2 ? 1 : 0, c2 += (u2 = u2 + o2 >>> 0) < o2 ? 1 : 0, e + i + n2 + a3 + l2 + (c2 += (u2 = u2 + h2 >>> 0) < h2 ? 1 : 0) >>> 0;
}, Vn.sum64_5_lo = function(e, t, i, s, n2, r2, a3, o2, l2, h2) {
  return t + s + r2 + o2 + h2 >>> 0;
}, Vn.rotr64_hi = function(e, t, i) {
  return (t << 32 - i | e >>> i) >>> 0;
}, Vn.rotr64_lo = function(e, t, i) {
  return (e << 32 - i | t >>> i) >>> 0;
}, Vn.shr64_hi = function(e, t, i) {
  return e >>> i;
}, Vn.shr64_lo = function(e, t, i) {
  return (e << 32 - i | t >>> i) >>> 0;
};
var Kn = {}, Xn = Vn, Yn = Bn;
function Qn() {
  this.pending = null, this.pendingTotal = 0, this.blockSize = this.constructor.blockSize, this.outSize = this.constructor.outSize, this.hmacStrength = this.constructor.hmacStrength, this.padLength = this.constructor.padLength / 8, this.endian = "big", this._delta8 = this.blockSize / 8, this._delta32 = this.blockSize / 32;
}
Kn.BlockHash = Qn, Qn.prototype.update = function(e, t) {
  if (e = Xn.toArray(e, t), this.pending ? this.pending = this.pending.concat(e) : this.pending = e, this.pendingTotal += e.length, this.pending.length >= this._delta8) {
    var i = (e = this.pending).length % this._delta8;
    this.pending = e.slice(e.length - i, e.length), this.pending.length === 0 && (this.pending = null), e = Xn.join32(e, 0, e.length - i, this.endian);
    for (var s = 0; s < e.length; s += this._delta32)
      this._update(e, s, s + this._delta32);
  }
  return this;
}, Qn.prototype.digest = function(e) {
  return this.update(this._pad()), Yn(this.pending === null), this._digest(e);
}, Qn.prototype._pad = function() {
  var e = this.pendingTotal, t = this._delta8, i = t - (e + this.padLength) % t, s = new Array(i + this.padLength);
  s[0] = 128;
  for (var n2 = 1; n2 < i; n2++)
    s[n2] = 0;
  if (e <<= 3, this.endian === "big") {
    for (var r2 = 8; r2 < this.padLength; r2++)
      s[n2++] = 0;
    s[n2++] = 0, s[n2++] = 0, s[n2++] = 0, s[n2++] = 0, s[n2++] = e >>> 24 & 255, s[n2++] = e >>> 16 & 255, s[n2++] = e >>> 8 & 255, s[n2++] = 255 & e;
  } else
    for (s[n2++] = 255 & e, s[n2++] = e >>> 8 & 255, s[n2++] = e >>> 16 & 255, s[n2++] = e >>> 24 & 255, s[n2++] = 0, s[n2++] = 0, s[n2++] = 0, s[n2++] = 0, r2 = 8; r2 < this.padLength; r2++)
      s[n2++] = 0;
  return s;
};
var Zn = {}, Jn = Vn.rotr32;
function er(e, t, i) {
  return e & t ^ ~e & i;
}
function tr(e, t, i) {
  return e & t ^ e & i ^ t & i;
}
function ir(e, t, i) {
  return e ^ t ^ i;
}
Zn.ft_1 = function(e, t, i, s) {
  return e === 0 ? er(t, i, s) : e === 1 || e === 3 ? ir(t, i, s) : e === 2 ? tr(t, i, s) : void 0;
}, Zn.ch32 = er, Zn.maj32 = tr, Zn.p32 = ir, Zn.s0_256 = function(e) {
  return Jn(e, 2) ^ Jn(e, 13) ^ Jn(e, 22);
}, Zn.s1_256 = function(e) {
  return Jn(e, 6) ^ Jn(e, 11) ^ Jn(e, 25);
}, Zn.g0_256 = function(e) {
  return Jn(e, 7) ^ Jn(e, 18) ^ e >>> 3;
}, Zn.g1_256 = function(e) {
  return Jn(e, 17) ^ Jn(e, 19) ^ e >>> 10;
};
var sr = Vn, nr = Kn, rr = Zn, ar = Bn, or = sr.sum32, lr = sr.sum32_4, hr = sr.sum32_5, cr = rr.ch32, ur = rr.maj32, dr = rr.s0_256, pr = rr.s1_256, fr = rr.g0_256, mr = rr.g1_256, gr = nr.BlockHash, yr = [1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298];
function xr() {
  if (!(this instanceof xr))
    return new xr();
  gr.call(this), this.h = [1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225], this.k = yr, this.W = new Array(64);
}
sr.inherits(xr, gr);
var Er = xr;
xr.blockSize = 512, xr.outSize = 256, xr.hmacStrength = 192, xr.padLength = 64, xr.prototype._update = function(e, t) {
  for (var i = this.W, s = 0; s < 16; s++)
    i[s] = e[t + s];
  for (; s < i.length; s++)
    i[s] = lr(mr(i[s - 2]), i[s - 7], fr(i[s - 15]), i[s - 16]);
  var n2 = this.h[0], r2 = this.h[1], a3 = this.h[2], o2 = this.h[3], l2 = this.h[4], h2 = this.h[5], c2 = this.h[6], u2 = this.h[7];
  for (ar(this.k.length === i.length), s = 0; s < i.length; s++) {
    var d2 = hr(u2, pr(l2), cr(l2, h2, c2), this.k[s], i[s]), p2 = or(dr(n2), ur(n2, r2, a3));
    u2 = c2, c2 = h2, h2 = l2, l2 = or(o2, d2), o2 = a3, a3 = r2, r2 = n2, n2 = or(d2, p2);
  }
  this.h[0] = or(this.h[0], n2), this.h[1] = or(this.h[1], r2), this.h[2] = or(this.h[2], a3), this.h[3] = or(this.h[3], o2), this.h[4] = or(this.h[4], l2), this.h[5] = or(this.h[5], h2), this.h[6] = or(this.h[6], c2), this.h[7] = or(this.h[7], u2);
}, xr.prototype._digest = function(e) {
  return e === "hex" ? sr.toHex32(this.h, "big") : sr.split32(this.h, "big");
};
var br = Er;
const vr = () => br(), Sr = { amd: kr, cjs: kr, es: Ir, iife: kr, system: Ir, umd: kr };
function Ar(e, t, i, s, n2, r2, a3, o2, l2, h2, c2, u2, d2) {
  const p2 = e.slice().reverse();
  for (const e2 of p2)
    e2.scope.addUsedOutsideNames(s, n2, c2, u2);
  !function(e2, t2, i2) {
    for (const s2 of t2) {
      for (const t3 of s2.scope.variables.values())
        t3.included && !(t3.renderBaseName || t3 instanceof Ms && t3.getOriginalVariable() !== t3) && t3.setRenderNames(null, Vt(t3.name, e2));
      if (i2.has(s2)) {
        const t3 = s2.namespace;
        t3.setRenderNames(null, Vt(t3.name, e2));
      }
    }
  }(s, p2, d2), Sr[n2](s, i, t, r2, a3, o2, l2, h2);
  for (const e2 of p2)
    e2.scope.deconflict(n2, c2, u2);
}
function Ir(e, t, i, s, n2, r2, a3, o2) {
  for (const t2 of i.dependencies)
    (n2 || t2 instanceof $e) && (t2.variableName = Vt(t2.suggestedVariableName, e));
  for (const i2 of t) {
    const t2 = i2.module, s2 = i2.name;
    i2.isNamespace && (n2 || t2 instanceof $e) ? i2.setRenderNames(null, (t2 instanceof $e ? t2 : a3.get(t2)).variableName) : t2 instanceof $e && s2 === "default" ? i2.setRenderNames(null, Vt([...t2.exportedVariables].some(([e2, t3]) => t3 === "*" && e2.included) ? t2.suggestedVariableName + "__default" : t2.suggestedVariableName, e)) : i2.setRenderNames(null, Vt(s2, e));
  }
  for (const t2 of o2)
    t2.setRenderNames(null, Vt(t2.name, e));
}
function kr(e, t, { deconflictedDefault: i, deconflictedNamespace: s, dependencies: n2 }, r2, a3, o2, l2) {
  for (const t2 of n2)
    t2.variableName = Vt(t2.suggestedVariableName, e);
  for (const t2 of s)
    t2.namespaceVariableName = Vt(`${t2.suggestedVariableName}__namespace`, e);
  for (const t2 of i)
    s.has(t2) && ss(String(r2(t2.id)), o2) ? t2.defaultVariableName = t2.namespaceVariableName : t2.defaultVariableName = Vt(`${t2.suggestedVariableName}__default`, e);
  for (const e2 of t) {
    const t2 = e2.module;
    if (t2 instanceof $e) {
      const i2 = e2.name;
      if (i2 === "default") {
        const i3 = String(r2(t2.id)), s2 = es[i3] ? t2.defaultVariableName : t2.variableName;
        ts(i3, o2) ? e2.setRenderNames(s2, "default") : e2.setRenderNames(null, s2);
      } else
        i2 === "*" ? e2.setRenderNames(null, is[String(r2(t2.id))] ? t2.namespaceVariableName : t2.variableName) : e2.setRenderNames(t2.variableName, null);
    } else {
      const i2 = l2.get(t2);
      a3 && e2.isNamespace ? e2.setRenderNames(null, i2.exportMode === "default" ? i2.namespaceVariableName : i2.variableName) : i2.exportMode === "default" ? e2.setRenderNames(null, i2.variableName) : e2.setRenderNames(i2.variableName, i2.getVariableExportName(e2));
    }
  }
}
const Pr = /[\\'\r\n\u2028\u2029]/, wr = /(['\r\n\u2028\u2029])/g, Cr = /\\/g;
function _r(e) {
  return e.match(Pr) ? e.replace(Cr, "\\\\").replace(wr, "\\$1") : e;
}
function Nr(e, { exports: t, name: i, format: s }, n2, r2, a3) {
  const o2 = e.getExportNames();
  if (t === "default") {
    if (o2.length !== 1 || o2[0] !== "default")
      return pe(ye("default", o2, r2));
  } else if (t === "none" && o2.length)
    return pe(ye("none", o2, r2));
  return t === "auto" && (o2.length === 0 ? t = "none" : o2.length === 1 && o2[0] === "default" ? (s === "cjs" && n2.has("exports") && a3(function(e2) {
    const t2 = he(e2);
    return { code: me.PREFER_NAMED_EXPORTS, id: e2, message: `Entry module "${t2}" is implicitly using "default" export mode, which means for CommonJS output that its default export is assigned to "module.exports". For many tools, such CommonJS output will not be interchangeable with the original ES module. If this is intended, explicitly set "output.exports" to either "auto" or "default", otherwise you might want to consider changing the signature of "${t2}" to use named exports only.`, url: "https://rollupjs.org/guide/en/#outputexports" };
  }(r2)), t = "default") : (s !== "es" && s !== "system" && o2.includes("default") && a3(function(e2, t2) {
    return { code: me.MIXED_EXPORTS, id: e2, message: `Entry module "${he(e2)}" is using named and default exports together. Consumers of your bundle will have to use \`${t2 || "chunk"}["default"]\` to access the default export, which may not be what you want. Use \`output.exports: "named"\` to disable this warning`, url: "https://rollupjs.org/guide/en/#outputexports" };
  }(r2, i)), t = "named")), t;
}
function $r(e) {
  const t = e.split("\n"), i = t.filter((e2) => /^\t+/.test(e2)), s = t.filter((e2) => /^ {2,}/.test(e2));
  if (i.length === 0 && s.length === 0)
    return null;
  if (i.length >= s.length)
    return "	";
  const n2 = s.reduce((e2, t2) => {
    const i2 = /^ +/.exec(t2)[0].length;
    return Math.min(i2, e2);
  }, 1 / 0);
  return new Array(n2 + 1).join(" ");
}
function Tr(e, t, i, s, n2) {
  const r2 = e.getDependenciesToBeIncluded();
  for (const e2 of r2) {
    if (e2 instanceof $e) {
      t.push(e2);
      continue;
    }
    const r3 = n2.get(e2);
    r3 === s ? i.has(e2) || (i.add(e2), Tr(e2, t, i, s, n2)) : t.push(r3);
  }
}
function Or(e) {
  if (!e)
    return null;
  if (typeof e == "string" && (e = JSON.parse(e)), e.mappings === "")
    return { mappings: [], names: [], sources: [], version: 3 };
  const i = typeof e.mappings == "string" ? function(e2) {
    for (var i2 = [], s = [], r2 = [0, 0, 0, 0, 0], a3 = 0, o2 = 0, l2 = 0, h2 = 0; o2 < e2.length; o2++) {
      var c2 = e2.charCodeAt(o2);
      if (c2 === 44)
        n(s, r2, a3), a3 = 0;
      else if (c2 === 59)
        n(s, r2, a3), a3 = 0, i2.push(s), s = [], r2[0] = 0;
      else {
        var u2 = t[c2];
        if (u2 === void 0)
          throw new Error("Invalid character (" + String.fromCharCode(c2) + ")");
        var d2 = 32 & u2;
        if (h2 += (u2 &= 31) << l2, d2)
          l2 += 5;
        else {
          var p2 = 1 & h2;
          h2 >>>= 1, p2 && (h2 = h2 === 0 ? -2147483648 : -h2), r2[a3] += h2, a3++, h2 = l2 = 0;
        }
      }
    }
    return n(s, r2, a3), i2.push(s), i2;
  }(e.mappings) : e.mappings;
  return __spreadProps(__spreadValues({}, e), { mappings: i });
}
function Rr(e, t, i) {
  return ce(e) ? pe(Ae(`Invalid pattern "${e}" for "${t}", patterns can be neither absolute nor relative paths.`)) : e.replace(/\[(\w+)\]/g, (e2, s) => {
    if (!i.hasOwnProperty(s))
      return pe(Ae(`"[${s}]" is not a valid placeholder in "${t}" pattern.`));
    const n2 = i[s]();
    return ce(n2) ? pe(Ae(`Invalid substitution "${n2}" for placeholder "[${s}]" in "${t}" pattern, can be neither absolute nor relative path.`)) : n2;
  });
}
function Mr(e, t) {
  const i = new Set(Object.keys(t).map((e2) => e2.toLowerCase()));
  if (!i.has(e.toLocaleLowerCase()))
    return e;
  const s = $(e);
  e = e.substring(0, e.length - s.length);
  let n2, r2 = 1;
  for (; i.has((n2 = e + ++r2 + s).toLowerCase()); )
    ;
  return n2;
}
const Dr = [".js", ".jsx", ".ts", ".tsx"];
function Lr(e, t, i, s) {
  const n2 = typeof t == "function" ? t(e.id) : t[e.id];
  return n2 || (i ? (s({ code: "MISSING_GLOBAL_NAME", guess: e.variableName, message: `No name was provided for external module '${e.id}' in output.globals \u2013 guessing '${e.variableName}'`, source: e.id }), e.variableName) : void 0);
}
class Vr {
  constructor(e, t, i, s, n2, r2, a3, o2, l2, h2) {
    this.orderedModules = e, this.inputOptions = t, this.outputOptions = i, this.unsetOptions = s, this.pluginDriver = n2, this.modulesById = r2, this.chunkByModule = a3, this.facadeChunkByModule = o2, this.includedNamespaces = l2, this.manualChunkAlias = h2, this.entryModules = [], this.exportMode = "named", this.facadeModule = null, this.id = null, this.namespaceVariableName = "", this.needsExportsShim = false, this.variableName = "", this.accessedGlobalsByScope = /* @__PURE__ */ new Map(), this.dependencies = /* @__PURE__ */ new Set(), this.dynamicDependencies = /* @__PURE__ */ new Set(), this.dynamicEntryModules = [], this.dynamicName = null, this.exportNamesByVariable = /* @__PURE__ */ new Map(), this.exports = /* @__PURE__ */ new Set(), this.exportsByName = /* @__PURE__ */ new Map(), this.fileName = null, this.implicitEntryModules = [], this.implicitlyLoadedBefore = /* @__PURE__ */ new Set(), this.imports = /* @__PURE__ */ new Set(), this.includedReexportsByModule = /* @__PURE__ */ new Map(), this.indentString = void 0, this.isEmpty = true, this.name = null, this.renderedDependencies = null, this.renderedExports = null, this.renderedHash = void 0, this.renderedModuleSources = /* @__PURE__ */ new Map(), this.renderedModules = /* @__PURE__ */ Object.create(null), this.renderedSource = null, this.sortedExportNames = null, this.strictFacade = false, this.usedModules = void 0, this.execIndex = e.length > 0 ? e[0].execIndex : 1 / 0;
    const c2 = new Set(e);
    for (const t2 of e) {
      t2.namespace.included && l2.add(t2), this.isEmpty && t2.isIncluded() && (this.isEmpty = false), (t2.info.isEntry || i.preserveModules) && this.entryModules.push(t2);
      for (const e2 of t2.includedDynamicImporters)
        c2.has(e2) || (this.dynamicEntryModules.push(t2), t2.info.syntheticNamedExports && !i.preserveModules && (l2.add(t2), this.exports.add(t2.namespace)));
      t2.implicitlyLoadedAfter.size > 0 && this.implicitEntryModules.push(t2);
    }
    this.suggestedVariableName = Ne(this.generateVariableName());
  }
  static generateFacade(e, t, i, s, n2, r2, a3, o2, l2, h2) {
    const c2 = new Vr([], e, t, i, s, n2, r2, a3, o2, null);
    c2.assignFacadeName(h2, l2), a3.has(l2) || a3.set(l2, c2);
    for (const e2 of l2.getDependenciesToBeIncluded())
      c2.dependencies.add(e2 instanceof ln ? r2.get(e2) : e2);
    return !c2.dependencies.has(r2.get(l2)) && l2.info.moduleSideEffects && l2.hasEffects() && c2.dependencies.add(r2.get(l2)), c2.ensureReexportsAreAvailableForModule(l2), c2.facadeModule = l2, c2.strictFacade = true, c2;
  }
  canModuleBeFacade(e, t) {
    const i = e.getExportNamesByVariable();
    for (const t2 of this.exports)
      if (!i.has(t2))
        return i.size === 0 && e.isUserDefinedEntryPoint && e.preserveSignature === "strict" && this.unsetOptions.has("preserveEntrySignatures") && this.inputOptions.onwarn({ code: "EMPTY_FACADE", id: e.id, message: `To preserve the export signature of the entry module "${he(e.id)}", an empty facade chunk was created. This often happens when creating a bundle for a web app where chunks are placed in script tags and exports are ignored. In this case it is recommended to set "preserveEntrySignatures: false" to avoid this and reduce the number of chunks. Otherwise if this is intentional, set "preserveEntrySignatures: 'strict'" explicitly to silence this warning.`, url: "https://rollupjs.org/guide/en/#preserveentrysignatures" }), false;
    for (const s of t)
      if (!i.has(s) && s.module !== e)
        return false;
    return true;
  }
  generateExports() {
    this.sortedExportNames = null;
    const e = new Set(this.exports);
    if (this.facadeModule !== null && (this.facadeModule.preserveSignature !== false || this.strictFacade)) {
      const t = this.facadeModule.getExportNamesByVariable();
      for (const [i, s] of t) {
        this.exportNamesByVariable.set(i, [...s]);
        for (const e2 of s)
          this.exportsByName.set(e2, i);
        e.delete(i);
      }
    }
    this.outputOptions.minifyInternalExports ? function(e2, t, i) {
      let s = 0;
      for (const n2 of e2) {
        let [e3] = n2.name;
        if (t.has(e3))
          do {
            e3 = Lt(++s), e3.charCodeAt(0) === 49 && (s += 9 * 64 ** (e3.length - 1), e3 = Lt(s));
          } while (we.has(e3) || t.has(e3));
        t.set(e3, n2), i.set(n2, [e3]);
      }
    }(e, this.exportsByName, this.exportNamesByVariable) : function(e2, t, i) {
      for (const s of e2) {
        let e3 = 0, n2 = s.name;
        for (; t.has(n2); )
          n2 = s.name + "$" + ++e3;
        t.set(n2, s), i.set(s, [n2]);
      }
    }(e, this.exportsByName, this.exportNamesByVariable), (this.outputOptions.preserveModules || this.facadeModule && this.facadeModule.info.isEntry) && (this.exportMode = Nr(this, this.outputOptions, this.unsetOptions, this.facadeModule.id, this.inputOptions.onwarn));
  }
  generateFacades() {
    var e;
    const t = [], i = /* @__PURE__ */ new Set([...this.entryModules, ...this.implicitEntryModules]), s = new Set(this.dynamicEntryModules.map(({ namespace: e2 }) => e2));
    for (const e2 of i)
      if (e2.preserveSignature)
        for (const t2 of e2.getExportNamesByVariable().keys())
          s.add(t2);
    for (const e2 of i) {
      const i2 = Array.from(new Set(e2.chunkNames.filter(({ isUserDefined: e3 }) => e3).map(({ name: e3 }) => e3)), (e3) => ({ name: e3 }));
      if (i2.length === 0 && e2.isUserDefinedEntryPoint && i2.push({}), i2.push(...Array.from(e2.chunkFileNames, (e3) => ({ fileName: e3 }))), i2.length === 0 && i2.push({}), !this.facadeModule) {
        const t2 = e2.preserveSignature === "strict" || e2.preserveSignature === "exports-only" && e2.getExportNamesByVariable().size !== 0;
        (!t2 || this.outputOptions.preserveModules || this.canModuleBeFacade(e2, s)) && (this.facadeModule = e2, this.facadeChunkByModule.set(e2, this), e2.preserveSignature && (this.strictFacade = t2), this.assignFacadeName(i2.shift(), e2));
      }
      for (const s2 of i2)
        t.push(Vr.generateFacade(this.inputOptions, this.outputOptions, this.unsetOptions, this.pluginDriver, this.modulesById, this.chunkByModule, this.facadeChunkByModule, this.includedNamespaces, e2, s2));
    }
    for (const t2 of this.dynamicEntryModules)
      t2.info.syntheticNamedExports || (!this.facadeModule && this.canModuleBeFacade(t2, s) ? (this.facadeModule = t2, this.facadeChunkByModule.set(t2, this), this.strictFacade = true, this.dynamicName = Br(t2)) : this.facadeModule === t2 && !this.strictFacade && this.canModuleBeFacade(t2, s) ? this.strictFacade = true : ((e = this.facadeChunkByModule.get(t2)) === null || e === void 0 ? void 0 : e.strictFacade) || (this.includedNamespaces.add(t2), this.exports.add(t2.namespace)));
    return this.outputOptions.preserveModules || this.addNecessaryImportsForFacades(), t;
  }
  generateId(e, t, i, s) {
    if (this.fileName !== null)
      return this.fileName;
    const [n2, r2] = this.facadeModule && this.facadeModule.isUserDefinedEntryPoint ? [t.entryFileNames, "output.entryFileNames"] : [t.chunkFileNames, "output.chunkFileNames"];
    return Mr(Rr(typeof n2 == "function" ? n2(this.getChunkInfo()) : n2, r2, { format: () => t.format, hash: () => s ? this.computeContentHashWithDependencies(e, t, i) : "[hash]", name: () => this.getChunkName() }), i);
  }
  generateIdPreserveModules(e, t, i, s) {
    const [{ id: n2 }] = this.orderedModules, r2 = this.outputOptions.sanitizeFileName(n2.split(Fr, 1)[0]);
    let a3;
    const o2 = s.has("entryFileNames") ? "[name][assetExtname].js" : t.entryFileNames, l2 = typeof o2 == "function" ? o2(this.getChunkInfo()) : o2;
    if (P(r2)) {
      const i2 = N(r2), s2 = $(r2), n3 = `${i2}/${Rr(l2, "output.entryFileNames", { assetExtname: () => Dr.includes(s2) ? "" : s2, ext: () => s2.substring(1), extname: () => s2, format: () => t.format, name: () => this.getChunkName() })}`, { preserveModulesRoot: o3 } = t;
      a3 = o3 && n3.startsWith(o3) ? n3.slice(o3.length).replace(/^[\\/]/, "") : T(e, n3);
    } else {
      const e2 = $(r2);
      a3 = `_virtual/${Rr(l2, "output.entryFileNames", { assetExtname: () => Dr.includes(e2) ? "" : e2, ext: () => e2.substring(1), extname: () => e2, format: () => t.format, name: () => le(r2) })}`;
    }
    return Mr(C(a3), i);
  }
  getChunkInfo() {
    const e = this.facadeModule, t = this.getChunkName.bind(this);
    return { exports: this.getExportNames(), facadeModuleId: e && e.id, isDynamicEntry: this.dynamicEntryModules.length > 0, isEntry: e !== null && e.info.isEntry, isImplicitEntry: this.implicitEntryModules.length > 0, modules: this.renderedModules, get name() {
      return t();
    }, type: "chunk" };
  }
  getChunkInfoWithFileNames() {
    return Object.assign(this.getChunkInfo(), { code: void 0, dynamicImports: Array.from(this.dynamicDependencies, Hs), fileName: this.id, implicitlyLoadedBefore: Array.from(this.implicitlyLoadedBefore, Hs), importedBindings: this.getImportedBindingsPerDependency(), imports: Array.from(this.dependencies, Hs), map: void 0, referencedFiles: this.getReferencedFiles() });
  }
  getChunkName() {
    var e;
    return (e = this.name) !== null && e !== void 0 ? e : this.name = this.outputOptions.sanitizeFileName(this.getFallbackChunkName());
  }
  getExportNames() {
    var e;
    return (e = this.sortedExportNames) !== null && e !== void 0 ? e : this.sortedExportNames = Array.from(this.exportsByName.keys()).sort();
  }
  getRenderedHash() {
    if (this.renderedHash)
      return this.renderedHash;
    const e = vr(), t = this.pluginDriver.hookReduceValueSync("augmentChunkHash", "", [this.getChunkInfo()], (e2, t2) => (t2 && (e2 += t2), e2));
    return e.update(t), e.update(this.renderedSource.toString()), e.update(this.getExportNames().map((e2) => {
      const t2 = this.exportsByName.get(e2);
      return `${he(t2.module.id).replace(/\\/g, "/")}:${t2.name}:${e2}`;
    }).join(",")), this.renderedHash = e.digest("hex");
  }
  getVariableExportName(e) {
    return this.outputOptions.preserveModules && e instanceof js ? "*" : this.exportNamesByVariable.get(e)[0];
  }
  link() {
    this.dependencies = function(e, t, i) {
      const s = [], n2 = /* @__PURE__ */ new Set();
      for (let r3 = t.length - 1; r3 >= 0; r3--) {
        const a3 = t[r3];
        if (!n2.has(a3)) {
          const t2 = [];
          Tr(a3, t2, n2, e, i), s.unshift(t2);
        }
      }
      const r2 = /* @__PURE__ */ new Set();
      for (const e2 of s)
        for (const t2 of e2)
          r2.add(t2);
      return r2;
    }(this, this.orderedModules, this.chunkByModule);
    for (const e of this.orderedModules)
      this.addDependenciesToChunk(e.dynamicDependencies, this.dynamicDependencies), this.addDependenciesToChunk(e.implicitlyLoadedBefore, this.implicitlyLoadedBefore), this.setUpChunkImportsAndExportsForModule(e);
  }
  preRender(e, t, i) {
    const { _: s, getPropertyAccess: n2, n: r2 } = i, a3 = new b2({ separator: `${r2}${r2}` });
    this.usedModules = [], this.indentString = function(e2, t2) {
      if (t2.indent !== true)
        return t2.indent;
      for (const t3 of e2) {
        const e3 = $r(t3.originalCode);
        if (e3 !== null)
          return e3;
      }
      return "	";
    }(this.orderedModules, e);
    const o2 = { dynamicImportFunction: e.dynamicImportFunction, exportNamesByVariable: this.exportNamesByVariable, format: e.format, freeze: e.freeze, indent: this.indentString, namespaceToStringTag: e.namespaceToStringTag, outputPluginDriver: this.pluginDriver, snippets: i };
    if (e.hoistTransitiveImports && !this.outputOptions.preserveModules && this.facadeModule !== null)
      for (const e2 of this.dependencies)
        e2 instanceof Vr && this.inlineChunkDependencies(e2);
    this.prepareModulesForRendering(i), this.setIdentifierRenderResolutions(e);
    let l2 = "";
    const h2 = this.renderedModules;
    for (const t2 of this.orderedModules) {
      let i2 = 0;
      if (t2.isIncluded() || this.includedNamespaces.has(t2)) {
        const s3 = t2.render(o2).trim();
        i2 = s3.length(), i2 && (e.compact && s3.lastLine().includes("//") && s3.append("\n"), this.renderedModuleSources.set(t2, s3), a3.addSource(s3), this.usedModules.push(t2));
        const n4 = t2.namespace;
        if (this.includedNamespaces.has(t2) && !this.outputOptions.preserveModules) {
          const e2 = n4.renderBlock(o2);
          n4.renderFirst() ? l2 += r2 + e2 : a3.addSource(new x(e2));
        }
      }
      const { renderedExports: s2, removedExports: n3 } = t2.getRenderedExports(), { renderedModuleSources: c2 } = this;
      h2[t2.id] = { get code() {
        var e2, i3;
        return (i3 = (e2 = c2.get(t2)) === null || e2 === void 0 ? void 0 : e2.toString()) !== null && i3 !== void 0 ? i3 : null;
      }, originalLength: t2.originalCode.length, removedExports: n3, renderedExports: s2, renderedLength: i2 };
    }
    if (l2 && a3.prepend(l2 + r2 + r2), this.needsExportsShim && a3.prepend(`${r2}${i.cnst} _missingExportShim${s}=${s}void 0;${r2}${r2}`), e.compact ? this.renderedSource = a3 : this.renderedSource = a3.trim(), this.renderedHash = void 0, this.isEmpty && this.getExportNames().length === 0 && this.dependencies.size === 0) {
      const e2 = this.getChunkName();
      this.inputOptions.onwarn({ chunkName: e2, code: "EMPTY_BUNDLE", message: `Generated an empty chunk: "${e2}"` });
    }
    this.setExternalRenderPaths(e, t), this.renderedDependencies = this.getChunkDependencyDeclarations(e, n2), this.renderedExports = this.exportMode === "none" ? [] : this.getChunkExportDeclarations(e.format, n2);
  }
  async render(e, t, i, s) {
    en("render format", 2);
    const n2 = e.format, r2 = On[n2];
    e.dynamicImportFunction && n2 !== "es" && this.inputOptions.onwarn(xe("output.dynamicImportFunction", "outputdynamicImportFunction", 'this option is ignored for formats other than "es"'));
    for (const e2 of this.dependencies) {
      const t2 = this.renderedDependencies.get(e2);
      if (e2 instanceof $e) {
        const i2 = e2.renderPath;
        t2.id = _r(e2.renormalizeRenderPath ? de(this.id, i2, false, false) : i2);
      } else
        t2.namedExportsMode = e2.exportMode !== "default", t2.id = _r(de(this.id, e2.id, false, true));
    }
    this.finaliseDynamicImports(e, s), this.finaliseImportMetas(n2, s);
    const a3 = this.renderedExports.length !== 0 || [...this.renderedDependencies.values()].some((e2) => e2.reexports && e2.reexports.length !== 0);
    let o2 = null;
    const l2 = /* @__PURE__ */ new Set();
    for (const e2 of this.orderedModules) {
      e2.usesTopLevelAwait && (o2 = e2.id);
      const t2 = this.accessedGlobalsByScope.get(e2.scope);
      if (t2)
        for (const e3 of t2)
          l2.add(e3);
    }
    if (o2 !== null && n2 !== "es" && n2 !== "system")
      return pe({ code: "INVALID_TLA_FORMAT", id: o2, message: `Module format ${n2} does not support top-level await. Use the "es" or "system" output formats rather.` });
    if (!this.id)
      throw new Error("Internal Error: expecting chunk id");
    const c2 = r2(this.renderedSource, { accessedGlobals: l2, dependencies: [...this.renderedDependencies.values()], exports: this.renderedExports, hasExports: a3, id: this.id, indent: this.indentString, intro: t.intro, isEntryFacade: this.outputOptions.preserveModules || this.facadeModule !== null && this.facadeModule.info.isEntry, isModuleFacade: this.facadeModule !== null, namedExportsMode: this.exportMode !== "default", outro: t.outro, snippets: s, usesTopLevelAwait: o2 !== null, warn: this.inputOptions.onwarn }, e);
    t.banner && c2.prepend(t.banner), t.footer && c2.append(t.footer);
    const u2 = c2.toString();
    tn("render format", 2);
    let d2 = null;
    const p2 = [];
    let f2 = await function({ code: e2, options: t2, outputPluginDriver: i2, renderChunk: s2, sourcemapChain: n3 }) {
      return i2.hookReduceArg0("renderChunk", [e2, s2, t2], (e3, t3, i3) => {
        if (t3 == null)
          return e3;
        if (typeof t3 == "string" && (t3 = { code: t3, map: void 0 }), t3.map !== null) {
          const e4 = Or(t3.map);
          n3.push(e4 || { missing: true, plugin: i3.name });
        }
        return t3.code;
      });
    }({ code: u2, options: e, outputPluginDriver: this.pluginDriver, renderChunk: i, sourcemapChain: p2 });
    if (e.sourcemap) {
      let t2;
      en("sourcemap", 2), t2 = e.file ? O(e.sourcemapFile || e.file) : e.dir ? O(e.dir, this.id) : O(this.id);
      const i2 = c2.generateDecodedMap({});
      d2 = function(e2, t3, i3, s2, n3, r3) {
        const a4 = Dn(r3), o3 = i3.filter((e3) => !e3.excludeFromSourcemap).map((e3) => Ln(e3.id, e3.originalCode, e3.originalSourcemap, e3.sourcemapChain, a4)), l3 = new Mn(t3, o3), c3 = s2.reduce(a4, l3);
        let { sources: u3, sourcesContent: d3, names: p3, mappings: f3 } = c3.traceMappings();
        if (e2) {
          const t4 = N(e2);
          u3 = u3.map((e3) => T(t4, e3)), e2 = _(e2);
        }
        return d3 = n3 ? null : d3, new h({ file: e2, mappings: f3, names: p3, sources: u3, sourcesContent: d3 });
      }(t2, i2, this.usedModules, p2, e.sourcemapExcludeSources, this.inputOptions.onwarn), d2.sources = d2.sources.map((i3) => {
        const { sourcemapPathTransform: s2 } = e;
        if (s2) {
          const e2 = s2(i3, `${t2}.map`);
          return typeof e2 != "string" && pe(Ae("sourcemapPathTransform function must return a string.")), e2;
        }
        return i3;
      }).map(C), tn("sourcemap", 2);
    }
    return e.compact || f2[f2.length - 1] === "\n" || (f2 += "\n"), { code: f2, map: d2 };
  }
  addDependenciesToChunk(e, t) {
    for (const i of e)
      if (i instanceof ln) {
        const e2 = this.chunkByModule.get(i);
        e2 && e2 !== this && t.add(e2);
      } else
        t.add(i);
  }
  addNecessaryImportsForFacades() {
    for (const [e, t] of this.includedReexportsByModule)
      if (this.includedNamespaces.has(e))
        for (const e2 of t)
          this.imports.add(e2);
  }
  assignFacadeName({ fileName: e, name: t }, i) {
    e ? this.fileName = e : this.name = this.outputOptions.sanitizeFileName(t || Br(i));
  }
  checkCircularDependencyImport(e, t) {
    const i = e.module;
    if (i instanceof ln) {
      const o2 = this.chunkByModule.get(i);
      let l2;
      do {
        if (l2 = t.alternativeReexportModules.get(e), l2) {
          const h2 = this.chunkByModule.get(l2);
          h2 && h2 !== o2 && this.inputOptions.onwarn((s = i.getExportNamesByVariable().get(e)[0], n2 = i.id, r2 = l2.id, a3 = t.id, { code: me.CYCLIC_CROSS_CHUNK_REEXPORT, exporter: n2, importer: a3, message: `Export "${s}" of module ${he(n2)} was reexported through module ${he(r2)} while both modules are dependencies of each other and will end up in different chunks by current Rollup settings. This scenario is not well supported at the moment as it will produce a circular dependency between chunks and will likely lead to broken execution order.
Either change the import in ${he(a3)} to point directly to the exporting module or do not use "preserveModules" to ensure these modules end up in the same chunk.`, reexporter: r2 })), t = l2;
        }
      } while (l2);
    }
    var s, n2, r2, a3;
  }
  computeContentHashWithDependencies(e, t, i) {
    const s = vr();
    s.update([e.intro, e.outro, e.banner, e.footer].join(":")), s.update(t.format);
    const n2 = /* @__PURE__ */ new Set([this]);
    for (const r2 of n2)
      if (r2 instanceof $e ? s.update(`:${r2.renderPath}`) : (s.update(r2.getRenderedHash()), s.update(r2.generateId(e, t, i, false))), !(r2 instanceof $e))
        for (const e2 of [...r2.dependencies, ...r2.dynamicDependencies])
          n2.add(e2);
    return s.digest("hex").substr(0, 8);
  }
  ensureReexportsAreAvailableForModule(e) {
    const t = [], i = e.getExportNamesByVariable();
    for (const s of i.keys()) {
      const i2 = s instanceof Us, n2 = i2 ? s.getBaseVariable() : s;
      if (!(n2 instanceof js && this.outputOptions.preserveModules)) {
        this.checkCircularDependencyImport(n2, e);
        const s2 = n2.module;
        if (s2 instanceof ln) {
          const e2 = this.chunkByModule.get(s2);
          e2 && e2 !== this && (e2.exports.add(n2), t.push(n2), i2 && this.imports.add(n2));
        }
      }
    }
    t.length && this.includedReexportsByModule.set(e, t);
  }
  finaliseDynamicImports(e, t) {
    const i = e.format === "amd";
    for (const [e2, s] of this.renderedModuleSources)
      for (const { node: n2, resolution: r2 } of e2.dynamicImports) {
        const e3 = this.chunkByModule.get(r2), a3 = this.facadeChunkByModule.get(r2);
        if (!r2 || !n2.included || e3 === this)
          continue;
        const o2 = r2 instanceof ln ? `'${_r(de(this.id, (a3 || e3).id, i, true))}'` : r2 instanceof $e ? `'${_r(r2.renormalizeRenderPath ? de(this.id, r2.renderPath, i, false) : r2.renderPath)}'` : r2;
        n2.renderFinalResolution(s, o2, r2 instanceof ln && !(a3 == null ? void 0 : a3.strictFacade) && e3.exportNamesByVariable.get(r2.namespace)[0], t);
      }
  }
  finaliseImportMetas(e, t) {
    for (const [i, s] of this.renderedModuleSources)
      for (const n2 of i.importMetas)
        n2.renderFinalMechanism(s, this.id, e, t, this.pluginDriver);
  }
  generateVariableName() {
    if (this.manualChunkAlias)
      return this.manualChunkAlias;
    const e = this.entryModules[0] || this.implicitEntryModules[0] || this.dynamicEntryModules[0] || this.orderedModules[this.orderedModules.length - 1];
    return e ? Br(e) : "chunk";
  }
  getChunkDependencyDeclarations(e, t) {
    const i = this.getImportSpecifiers(t), s = this.getReexportSpecifiers(), n2 = /* @__PURE__ */ new Map();
    for (const t2 of this.dependencies) {
      const r2 = i.get(t2) || null, a3 = s.get(t2) || null, o2 = t2 instanceof $e || t2.exportMode !== "default";
      n2.set(t2, { defaultVariableName: t2.defaultVariableName, globalName: t2 instanceof $e && (e.format === "umd" || e.format === "iife") && Lr(t2, e.globals, (r2 || a3) !== null, this.inputOptions.onwarn), id: void 0, imports: r2, isChunk: t2 instanceof Vr, name: t2.variableName, namedExportsMode: o2, namespaceVariableName: t2.namespaceVariableName, reexports: a3 });
    }
    return n2;
  }
  getChunkExportDeclarations(e, t) {
    const i = [];
    for (const s of this.getExportNames()) {
      if (s[0] === "*")
        continue;
      const n2 = this.exportsByName.get(s);
      if (!(n2 instanceof Us)) {
        const e2 = n2.module;
        if (e2 && this.chunkByModule.get(e2) !== this)
          continue;
      }
      let r2 = null, a3 = false, o2 = n2.getName(t);
      if (n2 instanceof Dt) {
        for (const e2 of n2.declarations)
          if (e2.parent instanceof qi || e2 instanceof Ki && e2.declaration instanceof qi) {
            a3 = true;
            break;
          }
      } else
        n2 instanceof Us && (r2 = o2, e === "es" && (o2 = n2.renderName));
      i.push({ exported: s, expression: r2, hoisted: a3, local: o2 });
    }
    return i;
  }
  getDependenciesToBeDeconflicted(e, t, i) {
    const s = /* @__PURE__ */ new Set(), n2 = /* @__PURE__ */ new Set(), r2 = /* @__PURE__ */ new Set();
    for (const t2 of [...this.exportNamesByVariable.keys(), ...this.imports])
      if (e || t2.isNamespace) {
        const a3 = t2.module;
        if (a3 instanceof $e)
          s.add(a3), e && (t2.name === "default" ? es[String(i(a3.id))] && n2.add(a3) : t2.name === "*" && is[String(i(a3.id))] && r2.add(a3));
        else {
          const i2 = this.chunkByModule.get(a3);
          i2 !== this && (s.add(i2), e && i2.exportMode === "default" && t2.isNamespace && r2.add(i2));
        }
      }
    if (t)
      for (const e2 of this.dependencies)
        s.add(e2);
    return { deconflictedDefault: n2, deconflictedNamespace: r2, dependencies: s };
  }
  getFallbackChunkName() {
    return this.manualChunkAlias ? this.manualChunkAlias : this.dynamicName ? this.dynamicName : this.fileName ? le(this.fileName) : le(this.orderedModules[this.orderedModules.length - 1].id);
  }
  getImportSpecifiers(e) {
    const { interop: t } = this.outputOptions, i = /* @__PURE__ */ new Map();
    for (const s of this.imports) {
      const n2 = s.module;
      let r2, a3;
      if (n2 instanceof $e) {
        if (r2 = n2, a3 = s.name, a3 !== "default" && a3 !== "*" && t(n2.id) === "defaultOnly")
          return pe(ve(n2.id, a3, false));
      } else
        r2 = this.chunkByModule.get(n2), a3 = r2.getVariableExportName(s);
      R(i, r2, () => []).push({ imported: a3, local: s.getName(e) });
    }
    return i;
  }
  getImportedBindingsPerDependency() {
    const e = {};
    for (const [t, i] of this.renderedDependencies) {
      const s = /* @__PURE__ */ new Set();
      if (i.imports)
        for (const { imported: e2 } of i.imports)
          s.add(e2);
      if (i.reexports)
        for (const { imported: e2 } of i.reexports)
          s.add(e2);
      e[t.id] = [...s];
    }
    return e;
  }
  getReexportSpecifiers() {
    const { externalLiveBindings: e, interop: t } = this.outputOptions, i = /* @__PURE__ */ new Map();
    for (let s of this.getExportNames()) {
      let n2, r2, a3 = false;
      if (s[0] === "*") {
        const i2 = s.substring(1);
        t(i2) === "defaultOnly" && this.inputOptions.onwarn(Se(i2)), a3 = e, n2 = this.modulesById.get(i2), r2 = s = "*";
      } else {
        const i2 = this.exportsByName.get(s);
        if (i2 instanceof Us)
          continue;
        const o2 = i2.module;
        if (o2 instanceof ln) {
          if (n2 = this.chunkByModule.get(o2), n2 === this)
            continue;
          r2 = n2.getVariableExportName(i2), a3 = i2.isReassigned;
        } else {
          if (n2 = o2, r2 = i2.name, r2 !== "default" && r2 !== "*" && t(o2.id) === "defaultOnly")
            return pe(ve(o2.id, r2, true));
          a3 = e && (r2 !== "default" || ts(String(t(o2.id)), true));
        }
      }
      R(i, n2, () => []).push({ imported: r2, needsLiveBinding: a3, reexported: s });
    }
    return i;
  }
  getReferencedFiles() {
    const e = [];
    for (const t of this.orderedModules)
      for (const i of t.importMetas) {
        const t2 = i.getReferencedFileName(this.pluginDriver);
        t2 && e.push(t2);
      }
    return e;
  }
  inlineChunkDependencies(e) {
    for (const t of e.dependencies)
      this.dependencies.has(t) || (this.dependencies.add(t), t instanceof Vr && this.inlineChunkDependencies(t));
  }
  prepareModulesForRendering(e) {
    var t;
    const i = this.accessedGlobalsByScope;
    for (const s of this.orderedModules) {
      for (const { node: n2, resolution: r2 } of s.dynamicImports)
        if (n2.included)
          if (r2 instanceof ln) {
            const s2 = this.chunkByModule.get(r2);
            s2 === this ? n2.setInternalResolution(r2.namespace) : n2.setExternalResolution(((t = this.facadeChunkByModule.get(r2)) === null || t === void 0 ? void 0 : t.exportMode) || s2.exportMode, r2, this.outputOptions, e, this.pluginDriver, i);
          } else
            n2.setExternalResolution("external", r2, this.outputOptions, e, this.pluginDriver, i);
      for (const e2 of s.importMetas)
        e2.addAccessedGlobals(this.outputOptions.format, i);
      this.includedNamespaces.has(s) && !this.outputOptions.preserveModules && s.namespace.prepare(i);
    }
  }
  setExternalRenderPaths(e, t) {
    for (const i of [...this.dependencies, ...this.dynamicDependencies])
      i instanceof $e && i.setRenderPath(e, t);
  }
  setIdentifierRenderResolutions({ format: e, interop: t, namespaceToStringTag: i }) {
    const s = /* @__PURE__ */ new Set();
    for (const t2 of this.getExportNames()) {
      const i2 = this.exportsByName.get(t2);
      e !== "es" && e !== "system" && i2.isReassigned && !i2.isId ? i2.setRenderNames("exports", t2) : i2 instanceof Us ? s.add(i2) : i2.setRenderNames(null, null);
    }
    for (const e2 of this.orderedModules)
      if (e2.needsExportShim) {
        this.needsExportsShim = true;
        break;
      }
    const n2 = /* @__PURE__ */ new Set(["Object", "Promise"]);
    switch (this.needsExportsShim && n2.add("_missingExportShim"), i && n2.add("Symbol"), e) {
      case "system":
        n2.add("module").add("exports");
        break;
      case "es":
        break;
      case "cjs":
        n2.add("module").add("require").add("__filename").add("__dirname");
      default:
        n2.add("exports");
        for (const e2 of ys)
          n2.add(e2);
    }
    Ar(this.orderedModules, this.getDependenciesToBeDeconflicted(e !== "es" && e !== "system", e === "amd" || e === "umd" || e === "iife", t), this.imports, n2, e, t, this.outputOptions.preserveModules, this.outputOptions.externalLiveBindings, this.chunkByModule, s, this.exportNamesByVariable, this.accessedGlobalsByScope, this.includedNamespaces);
  }
  setUpChunkImportsAndExportsForModule(e) {
    const t = new Set(e.includedImports);
    if (!this.outputOptions.preserveModules && this.includedNamespaces.has(e)) {
      const i = e.namespace.getMemberVariables();
      for (const e2 of Object.values(i))
        t.add(e2);
    }
    for (let i of t) {
      i instanceof Ms && (i = i.getOriginalVariable()), i instanceof Us && (i = i.getBaseVariable());
      const t2 = this.chunkByModule.get(i.module);
      t2 !== this && (this.imports.add(i), !(i instanceof js && this.outputOptions.preserveModules) && i.module instanceof ln && (t2.exports.add(i), this.checkCircularDependencyImport(i, e)));
    }
    (this.includedNamespaces.has(e) || e.info.isEntry && e.preserveSignature !== false || e.includedDynamicImporters.some((e2) => this.chunkByModule.get(e2) !== this)) && this.ensureReexportsAreAvailableForModule(e);
    for (const { node: t2, resolution: i } of e.dynamicImports)
      t2.included && i instanceof ln && this.chunkByModule.get(i) === this && !this.includedNamespaces.has(i) && (this.includedNamespaces.add(i), this.ensureReexportsAreAvailableForModule(i));
  }
}
function Br(e) {
  var t, i, s, n2;
  return (n2 = (i = (t = e.chunkNames.find(({ isUserDefined: e2 }) => e2)) === null || t === void 0 ? void 0 : t.name) !== null && i !== void 0 ? i : (s = e.chunkNames[0]) === null || s === void 0 ? void 0 : s.name) !== null && n2 !== void 0 ? n2 : le(e.id);
}
const Fr = /[?#]/;
function zr(e, t, i) {
  e in t && i(function(e2) {
    return { code: me.FILE_NAME_CONFLICT, message: `The emitted file "${e2}" overwrites a previously emitted file of the same name.` };
  }(e)), t[e] = jr;
}
const jr = { type: "placeholder" };
function Ur(e, t, i) {
  if (!(typeof e == "string" || e instanceof Uint8Array)) {
    const e2 = t.fileName || t.name || i;
    return pe(Ae(`Could not set source for ${typeof e2 == "string" ? `asset "${e2}"` : "unnamed asset"}, asset source needs to be a string, Uint8Array or Buffer.`));
  }
  return e;
}
function Gr(e, t) {
  return typeof e.fileName != "string" ? pe((i = e.name || t, { code: me.ASSET_NOT_FINALISED, message: `Plugin error - Unable to get file name for asset "${i}". Ensure that the source is set and that generate is called first.` })) : e.fileName;
  var i;
}
function Hr(e, t) {
  var i;
  const s = e.fileName || e.module && ((i = t == null ? void 0 : t.get(e.module)) === null || i === void 0 ? void 0 : i.id);
  return s || pe((n2 = e.fileName || e.name, { code: me.CHUNK_NOT_GENERATED, message: `Plugin error - Unable to get file name for chunk "${n2}". Ensure that generate is called first.` }));
  var n2;
}
class Wr {
  constructor(e, t, i) {
    this.graph = e, this.options = t, this.bundle = null, this.facadeChunkByModule = null, this.outputOptions = null, this.assertAssetsFinalized = () => {
      for (const [t2, i2] of this.filesByReferenceId)
        if (i2.type === "asset" && typeof i2.fileName != "string")
          return pe((e2 = i2.name || t2, { code: me.ASSET_SOURCE_MISSING, message: `Plugin error creating asset "${e2}" - no asset source set.` }));
      var e2;
    }, this.emitFile = (e2) => function(e3) {
      return Boolean(e3 && (e3.type === "asset" || e3.type === "chunk"));
    }(e2) ? function(e3) {
      const t2 = e3.fileName || e3.name;
      return !t2 || typeof t2 == "string" && !ce(t2);
    }(e2) ? e2.type === "chunk" ? this.emitChunk(e2) : this.emitAsset(e2) : pe(Ae(`The "fileName" or "name" properties of emitted files must be strings that are neither absolute nor relative paths, received "${e2.fileName || e2.name}".`)) : pe(Ae(`Emitted files must be of type "asset" or "chunk", received "${e2 && e2.type}".`)), this.getFileName = (e2) => {
      const t2 = this.filesByReferenceId.get(e2);
      return t2 ? t2.type === "chunk" ? Hr(t2, this.facadeChunkByModule) : Gr(t2, e2) : pe((i2 = e2, { code: me.FILE_NOT_FOUND, message: `Plugin error - Unable to get file name for unknown file "${i2}".` }));
      var i2;
    }, this.setAssetSource = (e2, t2) => {
      const i2 = this.filesByReferenceId.get(e2);
      if (!i2)
        return pe((s = e2, { code: me.ASSET_NOT_FOUND, message: `Plugin error - Unable to set the source for unknown asset "${s}".` }));
      var s, n2;
      if (i2.type !== "asset")
        return pe(Ae(`Asset sources can only be set for emitted assets but "${e2}" is an emitted chunk.`));
      if (i2.source !== void 0)
        return pe((n2 = i2.name || e2, { code: me.ASSET_SOURCE_ALREADY_SET, message: `Unable to set the source for asset "${n2}", source already set.` }));
      const r2 = Ur(t2, i2, e2);
      this.bundle ? this.finalizeAsset(i2, r2, e2, this.bundle) : i2.source = r2;
    }, this.setOutputBundle = (e2, t2, i2) => {
      this.outputOptions = t2, this.bundle = e2, this.facadeChunkByModule = i2;
      for (const e3 of this.filesByReferenceId.values())
        e3.fileName && zr(e3.fileName, this.bundle, this.options.onwarn);
      for (const [e3, t3] of this.filesByReferenceId)
        t3.type === "asset" && t3.source !== void 0 && this.finalizeAsset(t3, t3.source, e3, this.bundle);
    }, this.filesByReferenceId = i ? new Map(i.filesByReferenceId) : /* @__PURE__ */ new Map();
  }
  assignReferenceId(e, t) {
    let i;
    do {
      i = vr().update(i || t).digest("hex").substring(0, 8);
    } while (this.filesByReferenceId.has(i));
    return this.filesByReferenceId.set(i, e), i;
  }
  emitAsset(e) {
    const t = e.source !== void 0 ? Ur(e.source, e, null) : void 0, i = { fileName: e.fileName, name: e.name, source: t, type: "asset" }, s = this.assignReferenceId(i, e.fileName || e.name || e.type);
    return this.bundle && (e.fileName && zr(e.fileName, this.bundle, this.options.onwarn), t !== void 0 && this.finalizeAsset(i, t, s, this.bundle)), s;
  }
  emitChunk(e) {
    if (this.graph.phase > Gs.LOAD_AND_PARSE)
      return pe({ code: me.INVALID_ROLLUP_PHASE, message: "Cannot emit chunks after module loading has finished." });
    if (typeof e.id != "string")
      return pe(Ae(`Emitted chunks need to have a valid string id, received "${e.id}"`));
    const t = { fileName: e.fileName, module: null, name: e.name || e.id, type: "chunk" };
    return this.graph.moduleLoader.emitChunk(e).then((e2) => t.module = e2).catch(() => {
    }), this.assignReferenceId(t, e.id);
  }
  finalizeAsset(e, t, i, s) {
    const n2 = e.fileName || function(e2, t2) {
      for (const [i2, s2] of Object.entries(e2))
        if (s2.type === "asset" && qr(t2, s2.source))
          return i2;
      return null;
    }(s, t) || function(e2, t2, i2, s2) {
      const n3 = i2.sanitizeFileName(e2 || "asset");
      return Mr(Rr(typeof i2.assetFileNames == "function" ? i2.assetFileNames({ name: e2, source: t2, type: "asset" }) : i2.assetFileNames, "output.assetFileNames", { ext: () => $(n3).substring(1), extname: () => $(n3), hash: () => vr().update(n3).update(":").update(t2).digest("hex").substring(0, 8), name: () => n3.substring(0, n3.length - $(n3).length) }), s2);
    }(e.name, t, this.outputOptions, s), r2 = __spreadProps(__spreadValues({}, e), { fileName: n2, source: t });
    this.filesByReferenceId.set(i, r2);
    const { options: a3 } = this;
    s[n2] = { fileName: n2, get isAsset() {
      return ke(`Accessing "isAsset" on files in the bundle is deprecated, please use "type === 'asset'" instead`, true, a3), true;
    }, name: e.name, source: t, type: "asset" };
  }
}
function qr(e, t) {
  if (typeof e == "string")
    return e === t;
  if (typeof t == "string")
    return false;
  if ("equals" in e)
    return e.equals(t);
  if (e.length !== t.length)
    return false;
  for (let i = 0; i < e.length; i++)
    if (e[i] !== t[i])
      return false;
  return true;
}
const Kr = (e, t) => t ? `${e}
${t}` : e, Xr = (e, t) => t ? `${e}

${t}` : e;
function Yr(e, t) {
  const i = [], s = new Set(t.keys()), n2 = /* @__PURE__ */ Object.create(null);
  for (const [e2, i2] of t) {
    Qr(e2, n2[i2] = n2[i2] || [], s);
  }
  for (const [e2, t2] of Object.entries(n2))
    i.push({ alias: e2, modules: t2 });
  const r2 = /* @__PURE__ */ new Map(), { dependentEntryPointsByModule: a3, dynamicEntryModules: o2 } = function(e2) {
    const t2 = /* @__PURE__ */ new Set(), i2 = /* @__PURE__ */ new Map(), s2 = new Set(e2);
    for (const e3 of s2) {
      const n3 = /* @__PURE__ */ new Set([e3]);
      for (const r3 of n3) {
        R(i2, r3, () => /* @__PURE__ */ new Set()).add(e3);
        for (const e4 of r3.getDependenciesToBeIncluded())
          e4 instanceof $e || n3.add(e4);
        for (const { resolution: e4 } of r3.dynamicImports)
          e4 instanceof ln && e4.includedDynamicImporters.length > 0 && (t2.add(e4), s2.add(e4));
        for (const e4 of r3.implicitlyLoadedBefore)
          t2.add(e4), s2.add(e4);
      }
    }
    return { dependentEntryPointsByModule: i2, dynamicEntryModules: t2 };
  }(e), l2 = function(e2, t2) {
    const i2 = /* @__PURE__ */ new Map();
    for (const s2 of t2) {
      const t3 = R(i2, s2, () => /* @__PURE__ */ new Set());
      for (const i3 of [...s2.includedDynamicImporters, ...s2.implicitlyLoadedAfter])
        for (const s3 of e2.get(i3))
          t3.add(s3);
    }
    return i2;
  }(a3, o2), h2 = new Set(e);
  function c2(e2, t2) {
    const i2 = /* @__PURE__ */ new Set([e2]);
    for (const n3 of i2) {
      const o3 = R(r2, n3, () => /* @__PURE__ */ new Set());
      if (!t2 || !u2(t2, a3.get(n3))) {
        o3.add(e2);
        for (const e3 of n3.getDependenciesToBeIncluded())
          e3 instanceof $e || s.has(e3) || i2.add(e3);
      }
    }
  }
  function u2(e2, t2) {
    const i2 = new Set(e2);
    for (const e3 of i2)
      if (!t2.has(e3)) {
        if (h2.has(e3))
          return false;
        const t3 = l2.get(e3);
        for (const e4 of t3)
          i2.add(e4);
      }
    return true;
  }
  for (const t2 of e)
    s.has(t2) || c2(t2, null);
  for (const e2 of o2)
    s.has(e2) || c2(e2, l2.get(e2));
  return i.push(...function(e2, t2) {
    const i2 = /* @__PURE__ */ Object.create(null);
    for (const [s2, n3] of t2) {
      let t3 = "";
      for (const i3 of e2)
        t3 += n3.has(i3) ? "X" : "_";
      const r3 = i2[t3];
      r3 ? r3.push(s2) : i2[t3] = [s2];
    }
    return Object.values(i2).map((e3) => ({ alias: null, modules: e3 }));
  }([...e, ...o2], r2)), i;
}
function Qr(e, t, i) {
  const s = /* @__PURE__ */ new Set([e]);
  for (const e2 of s) {
    i.add(e2), t.push(e2);
    for (const t2 of e2.dependencies)
      t2 instanceof $e || i.has(t2) || s.add(t2);
  }
}
const Zr = (e, t) => e.execIndex > t.execIndex ? 1 : -1;
function Jr(e, t, i) {
  const s = Symbol(e.id), n2 = [he(e.id)];
  let r2 = t;
  for (e.cycles.add(s); r2 !== e; )
    r2.cycles.add(s), n2.push(he(r2.id)), r2 = i.get(r2);
  return n2.push(n2[0]), n2.reverse(), n2;
}
const ea = (e, t) => t ? `(${e})` : e, ta = /^(?!\d)[\w$]+$/;
class ia {
  constructor(e, t, i, s, n2) {
    this.outputOptions = e, this.unsetOptions = t, this.inputOptions = i, this.pluginDriver = s, this.graph = n2, this.facadeChunkByModule = /* @__PURE__ */ new Map(), this.includedNamespaces = /* @__PURE__ */ new Set();
  }
  async generate(e) {
    en("GENERATE", 1);
    const t = /* @__PURE__ */ Object.create(null);
    this.pluginDriver.setOutputBundle(t, this.outputOptions, this.facadeChunkByModule);
    try {
      await this.pluginDriver.hookParallel("renderStart", [this.outputOptions, this.inputOptions]), en("generate chunks", 2);
      const e2 = await this.generateChunks();
      e2.length > 1 && function(e3, t2) {
        if (e3.format === "umd" || e3.format === "iife")
          return pe(xe("output.format", "outputformat", "UMD and IIFE output formats are not supported for code-splitting builds", e3.format));
        if (typeof e3.file == "string")
          return pe(xe("output.file", "outputdir", 'when building multiple chunks, the "output.dir" option must be used, not "output.file". To inline dynamic imports, set the "inlineDynamicImports" option'));
        if (e3.sourcemapFile)
          return pe(xe("output.sourcemapFile", "outputsourcemapfile", '"output.sourcemapFile" is only supported for single-file builds'));
        !e3.amd.autoId && e3.amd.id && t2(xe("output.amd.id", "outputamd", 'this option is only properly supported for single-file builds. Use "output.amd.autoId" and "output.amd.basePath" instead'));
      }(this.outputOptions, this.inputOptions.onwarn);
      const i = function(e3) {
        if (e3.length === 0)
          return "/";
        if (e3.length === 1)
          return N(e3[0]);
        const t2 = e3.slice(1).reduce((e4, t3) => {
          const i2 = t3.split(/\/+|\\+/);
          let s2;
          for (s2 = 0; e4[s2] === i2[s2] && s2 < Math.min(e4.length, i2.length); s2++)
            ;
          return e4.slice(0, s2);
        }, e3[0].split(/\/+|\\+/));
        return t2.length > 1 ? t2.join("/") : "/";
      }(function(e3) {
        const t2 = [];
        for (const i2 of e3)
          for (const e4 of i2.entryModules)
            P(e4.id) && t2.push(e4.id);
        return t2;
      }(e2));
      tn("generate chunks", 2), en("render modules", 2);
      const s = await async function(e3, t2) {
        try {
          let [i2, s2, n3, r2] = await Promise.all([t2.hookReduceValue("banner", e3.banner(), [], Kr), t2.hookReduceValue("footer", e3.footer(), [], Kr), t2.hookReduceValue("intro", e3.intro(), [], Xr), t2.hookReduceValue("outro", e3.outro(), [], Xr)]);
          return n3 && (n3 += "\n\n"), r2 && (r2 = `

${r2}`), i2.length && (i2 += "\n"), s2.length && (s2 = "\n" + s2), { banner: i2, footer: s2, intro: n3, outro: r2 };
        } catch (e4) {
          return pe({ code: "ADDON_ERROR", message: `Could not retrieve ${e4.hook}. Check configuration of plugin ${e4.plugin}.
	Error Message: ${e4.message}` });
        }
      }(this.outputOptions, this.pluginDriver), n2 = function({ compact: e3, generatedCode: { arrowFunctions: t2, constBindings: i2, objectShorthand: s2, reservedNamesAsProps: n3 } }) {
        const { _: r2, n: a3, s: o2 } = e3 ? { _: "", n: "", s: "" } : { _: " ", n: "\n", s: ";" }, l2 = i2 ? "const" : "var", h2 = (e4, { isAsync: t3, name: i3 }) => `${t3 ? "async " : ""}function${i3 ? ` ${i3}` : ""}${r2}(${e4.join(`,${r2}`)})${r2}`, c2 = t2 ? (e4, { isAsync: t3, name: i3 }) => {
          const s3 = e4.length === 1;
          return `${i3 ? `${l2} ${i3}${r2}=${r2}` : ""}${t3 ? `async${s3 ? " " : r2}` : ""}${s3 ? e4[0] : `(${e4.join(`,${r2}`)})`}${r2}=>${r2}`;
        } : h2, u2 = (e4, { functionReturn: i3, lineBreakIndent: s3, name: n4 }) => [`${c2(e4, { isAsync: false, name: n4 })}${t2 ? s3 ? `${a3}${s3.base}${s3.t}` : "" : `{${s3 ? `${a3}${s3.base}${s3.t}` : r2}${i3 ? "return " : ""}`}`, t2 ? `${n4 ? ";" : ""}${s3 ? `${a3}${s3.base}` : ""}` : `${o2}${s3 ? `${a3}${s3.base}` : r2}}`], d2 = n3 ? (e4) => ta.test(e4) : (e4) => !we.has(e4) && ta.test(e4);
        return { _: r2, cnst: l2, getDirectReturnFunction: u2, getDirectReturnIifeLeft: (e4, i3, { needsArrowReturnParens: s3, needsWrappedFunction: n4 }) => {
          const [r3, a4] = u2(e4, { functionReturn: true, lineBreakIndent: null, name: null });
          return `${ea(`${r3}${ea(i3, t2 && s3)}${a4}`, t2 || n4)}(`;
        }, getFunctionIntro: c2, getNonArrowFunctionIntro: h2, getObject(e4, { lineBreakIndent: t3 }) {
          const i3 = t3 ? `${a3}${t3.base}${t3.t}` : r2;
          return `{${e4.map(([e5, t4]) => {
            if (e5 === null)
              return `${i3}${t4}`;
            const n4 = !d2(e5);
            return e5 === t4 && s2 && !n4 ? i3 + e5 : `${i3}${n4 ? `'${e5}'` : e5}:${r2}${t4}`;
          }).join(",")}${e4.length === 0 ? "" : t3 ? `${a3}${t3.base}` : r2}}`;
        }, getPropertyAccess: (e4) => d2(e4) ? `.${e4}` : `[${JSON.stringify(e4)}]`, n: a3, s: o2 };
      }(this.outputOptions);
      this.prerenderChunks(e2, i, n2), tn("render modules", 2), await this.addFinalizedChunksToBundle(e2, i, s, t, n2);
    } catch (e2) {
      throw await this.pluginDriver.hookParallel("renderError", [e2]), e2;
    }
    return await this.pluginDriver.hookSeq("generateBundle", [this.outputOptions, t, e]), this.finaliseAssets(t), tn("GENERATE", 1), t;
  }
  async addFinalizedChunksToBundle(e, t, i, s, n2) {
    this.assignChunkIds(e, t, i, s);
    for (const t2 of e)
      s[t2.id] = t2.getChunkInfoWithFileNames();
    await Promise.all(e.map(async (e2) => {
      const t2 = s[e2.id];
      Object.assign(t2, await e2.render(this.outputOptions, i, t2, n2));
    }));
  }
  async addManualChunks(e) {
    const t = /* @__PURE__ */ new Map(), i = await Promise.all(Object.entries(e).map(async ([e2, t2]) => ({ alias: e2, entries: await this.graph.moduleLoader.addAdditionalModules(t2) })));
    for (const { alias: e2, entries: s } of i)
      for (const i2 of s)
        na(e2, i2, t);
    return t;
  }
  assignChunkIds(e, t, i, s) {
    const n2 = [], r2 = [];
    for (const t2 of e)
      (t2.facadeModule && t2.facadeModule.isUserDefinedEntryPoint ? n2 : r2).push(t2);
    const a3 = n2.concat(r2);
    for (const e2 of a3)
      this.outputOptions.file ? e2.id = _(this.outputOptions.file) : this.outputOptions.preserveModules ? e2.id = e2.generateIdPreserveModules(t, this.outputOptions, s, this.unsetOptions) : e2.id = e2.generateId(i, this.outputOptions, s, true), s[e2.id] = jr;
  }
  assignManualChunks(e) {
    const t = [], i = { getModuleIds: () => this.graph.modulesById.keys(), getModuleInfo: this.graph.getModuleInfo };
    for (const s2 of this.graph.modulesById.values())
      if (s2 instanceof ln) {
        const n2 = e(s2.id, i);
        typeof n2 == "string" && t.push([n2, s2]);
      }
    t.sort(([e2], [t2]) => e2 > t2 ? 1 : e2 < t2 ? -1 : 0);
    const s = /* @__PURE__ */ new Map();
    for (const [e2, i2] of t)
      na(e2, i2, s);
    return s;
  }
  finaliseAssets(e) {
    for (const t of Object.values(e))
      if (t.type || (ke('A plugin is directly adding properties to the bundle object in the "generateBundle" hook. This is deprecated and will be removed in a future Rollup version, please use "this.emitFile" instead.', true, this.inputOptions), t.type = "asset"), this.outputOptions.validate && "code" in t)
        try {
          this.graph.contextParse(t.code, { allowHashBang: true, ecmaVersion: "latest" });
        } catch (e2) {
          this.inputOptions.onwarn(ge(t, e2));
        }
    this.pluginDriver.finaliseAssets();
  }
  async generateChunks() {
    const { manualChunks: e } = this.outputOptions, t = typeof e == "object" ? await this.addManualChunks(e) : this.assignManualChunks(e), i = [], s = /* @__PURE__ */ new Map();
    for (const { alias: e2, modules: n3 } of this.outputOptions.inlineDynamicImports ? [{ alias: null, modules: sa(this.graph.modulesById) }] : this.outputOptions.preserveModules ? sa(this.graph.modulesById).map((e3) => ({ alias: null, modules: [e3] })) : Yr(this.graph.entryModules, t)) {
      n3.sort(Zr);
      const t2 = new Vr(n3, this.inputOptions, this.outputOptions, this.unsetOptions, this.pluginDriver, this.graph.modulesById, s, this.facadeChunkByModule, this.includedNamespaces, e2);
      i.push(t2);
      for (const e3 of n3)
        s.set(e3, t2);
    }
    for (const e2 of i)
      e2.link();
    const n2 = [];
    for (const e2 of i)
      n2.push(...e2.generateFacades());
    return [...i, ...n2];
  }
  prerenderChunks(e, t, i) {
    for (const t2 of e)
      t2.generateExports();
    for (const s of e)
      s.preRender(this.outputOptions, t, i);
  }
}
function sa(e) {
  return [...e.values()].filter((e2) => e2 instanceof ln && (e2.isIncluded() || e2.info.isEntry || e2.includedDynamicImporters.length > 0));
}
function na(e, t, i) {
  const s = i.get(t);
  if (typeof s == "string" && s !== e)
    return pe((n2 = t.id, r2 = e, a3 = s, { code: me.INVALID_CHUNK, message: `Cannot assign ${he(n2)} to the "${r2}" chunk as it is already in the "${a3}" chunk.` }));
  var n2, r2, a3;
  i.set(t, e);
}
var ra = [509, 0, 227, 0, 150, 4, 294, 9, 1368, 2, 2, 1, 6, 3, 41, 2, 5, 0, 166, 1, 574, 3, 9, 9, 370, 1, 154, 10, 50, 3, 123, 2, 54, 14, 32, 10, 3, 1, 11, 3, 46, 10, 8, 0, 46, 9, 7, 2, 37, 13, 2, 9, 6, 1, 45, 0, 13, 2, 49, 13, 9, 3, 2, 11, 83, 11, 7, 0, 161, 11, 6, 9, 7, 3, 56, 1, 2, 6, 3, 1, 3, 2, 10, 0, 11, 1, 3, 6, 4, 4, 193, 17, 10, 9, 5, 0, 82, 19, 13, 9, 214, 6, 3, 8, 28, 1, 83, 16, 16, 9, 82, 12, 9, 9, 84, 14, 5, 9, 243, 14, 166, 9, 71, 5, 2, 1, 3, 3, 2, 0, 2, 1, 13, 9, 120, 6, 3, 6, 4, 0, 29, 9, 41, 6, 2, 3, 9, 0, 10, 10, 47, 15, 406, 7, 2, 7, 17, 9, 57, 21, 2, 13, 123, 5, 4, 0, 2, 1, 2, 6, 2, 0, 9, 9, 49, 4, 2, 1, 2, 4, 9, 9, 330, 3, 19306, 9, 87, 9, 39, 4, 60, 6, 26, 9, 1014, 0, 2, 54, 8, 3, 82, 0, 12, 1, 19628, 1, 4706, 45, 3, 22, 543, 4, 4, 5, 9, 7, 3, 6, 31, 3, 149, 2, 1418, 49, 513, 54, 5, 49, 9, 0, 15, 0, 23, 4, 2, 14, 1361, 6, 2, 16, 3, 6, 2, 1, 2, 4, 262, 6, 10, 9, 357, 0, 62, 13, 1495, 6, 110, 6, 6, 9, 4759, 9, 787719, 239], aa = [0, 11, 2, 25, 2, 18, 2, 1, 2, 14, 3, 13, 35, 122, 70, 52, 268, 28, 4, 48, 48, 31, 14, 29, 6, 37, 11, 29, 3, 35, 5, 7, 2, 4, 43, 157, 19, 35, 5, 35, 5, 39, 9, 51, 13, 10, 2, 14, 2, 6, 2, 1, 2, 10, 2, 14, 2, 6, 2, 1, 68, 310, 10, 21, 11, 7, 25, 5, 2, 41, 2, 8, 70, 5, 3, 0, 2, 43, 2, 1, 4, 0, 3, 22, 11, 22, 10, 30, 66, 18, 2, 1, 11, 21, 11, 25, 71, 55, 7, 1, 65, 0, 16, 3, 2, 2, 2, 28, 43, 28, 4, 28, 36, 7, 2, 27, 28, 53, 11, 21, 11, 18, 14, 17, 111, 72, 56, 50, 14, 50, 14, 35, 349, 41, 7, 1, 79, 28, 11, 0, 9, 21, 43, 17, 47, 20, 28, 22, 13, 52, 58, 1, 3, 0, 14, 44, 33, 24, 27, 35, 30, 0, 3, 0, 9, 34, 4, 0, 13, 47, 15, 3, 22, 0, 2, 0, 36, 17, 2, 24, 85, 6, 2, 0, 2, 3, 2, 14, 2, 9, 8, 46, 39, 7, 3, 1, 3, 21, 2, 6, 2, 1, 2, 4, 4, 0, 19, 0, 13, 4, 159, 52, 19, 3, 21, 2, 31, 47, 21, 1, 2, 0, 185, 46, 42, 3, 37, 47, 21, 0, 60, 42, 14, 0, 72, 26, 38, 6, 186, 43, 117, 63, 32, 7, 3, 0, 3, 7, 2, 1, 2, 23, 16, 0, 2, 0, 95, 7, 3, 38, 17, 0, 2, 0, 29, 0, 11, 39, 8, 0, 22, 0, 12, 45, 20, 0, 19, 72, 264, 8, 2, 36, 18, 0, 50, 29, 113, 6, 2, 1, 2, 37, 22, 0, 26, 5, 2, 1, 2, 31, 15, 0, 328, 18, 190, 0, 80, 921, 103, 110, 18, 195, 2637, 96, 16, 1070, 4050, 582, 8634, 568, 8, 30, 18, 78, 18, 29, 19, 47, 17, 3, 32, 20, 6, 18, 689, 63, 129, 74, 6, 0, 67, 12, 65, 1, 2, 0, 29, 6135, 9, 1237, 43, 8, 8936, 3, 2, 6, 2, 1, 2, 290, 46, 2, 18, 3, 9, 395, 2309, 106, 6, 12, 4, 8, 8, 9, 5991, 84, 2, 70, 2, 1, 3, 0, 3, 1, 3, 3, 2, 11, 2, 0, 2, 6, 2, 64, 2, 3, 3, 7, 2, 6, 2, 27, 2, 3, 2, 4, 2, 0, 4, 6, 2, 339, 3, 24, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 7, 1845, 30, 482, 44, 11, 6, 17, 0, 322, 29, 19, 43, 1269, 6, 2, 3, 2, 1, 2, 14, 2, 196, 60, 67, 8, 0, 1205, 3, 2, 26, 2, 1, 2, 0, 3, 0, 2, 9, 2, 3, 2, 0, 2, 0, 7, 0, 5, 0, 2, 0, 2, 0, 2, 2, 2, 1, 2, 0, 3, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 1, 2, 0, 3, 3, 2, 6, 2, 3, 2, 3, 2, 0, 2, 9, 2, 16, 6, 2, 2, 4, 2, 16, 4421, 42719, 33, 4152, 8, 221, 3, 5761, 15, 7472, 3104, 541, 1507, 4938], oa = "\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0560-\u0588\u05D0-\u05EA\u05EF-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u0870-\u0887\u0889-\u088E\u08A0-\u08C9\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C5D\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D04-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u1711\u171F-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1878\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4C\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1C90-\u1CBA\u1CBD-\u1CBF\u1CE9-\u1CEC\u1CEE-\u1CF3\u1CF5\u1CF6\u1CFA\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309B-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u31A0-\u31BF\u31F0-\u31FF\u3400-\u4DBF\u4E00-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7CA\uA7D0\uA7D1\uA7D3\uA7D5-\uA7D9\uA7F2-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA8FE\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB69\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC", la = { 3: "abstract boolean byte char class double enum export extends final float goto implements import int interface long native package private protected public short static super synchronized throws transient volatile", 5: "class enum extends super const export import", 6: "enum", strict: "implements interface let package private protected public static yield", strictBind: "eval arguments" }, ha = "break case catch continue debugger default do else finally for function if return switch throw try var while with null true false instanceof typeof void delete new in this", ca = { 5: ha, "5module": ha + " export import", 6: ha + " const class extends export import super" }, ua = /^in(stanceof)?$/, da = new RegExp("[" + oa + "]"), pa = new RegExp("[" + oa + "\u200C\u200D\xB7\u0300-\u036F\u0387\u0483-\u0487\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u0669\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u06F0-\u06F9\u0711\u0730-\u074A\u07A6-\u07B0\u07C0-\u07C9\u07EB-\u07F3\u07FD\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u0898-\u089F\u08CA-\u08E1\u08E3-\u0903\u093A-\u093C\u093E-\u094F\u0951-\u0957\u0962\u0963\u0966-\u096F\u0981-\u0983\u09BC\u09BE-\u09C4\u09C7\u09C8\u09CB-\u09CD\u09D7\u09E2\u09E3\u09E6-\u09EF\u09FE\u0A01-\u0A03\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A66-\u0A71\u0A75\u0A81-\u0A83\u0ABC\u0ABE-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AE2\u0AE3\u0AE6-\u0AEF\u0AFA-\u0AFF\u0B01-\u0B03\u0B3C\u0B3E-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B55-\u0B57\u0B62\u0B63\u0B66-\u0B6F\u0B82\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD7\u0BE6-\u0BEF\u0C00-\u0C04\u0C3C\u0C3E-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C66-\u0C6F\u0C81-\u0C83\u0CBC\u0CBE-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CE2\u0CE3\u0CE6-\u0CEF\u0D00-\u0D03\u0D3B\u0D3C\u0D3E-\u0D44\u0D46-\u0D48\u0D4A-\u0D4D\u0D57\u0D62\u0D63\u0D66-\u0D6F\u0D81-\u0D83\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0E50-\u0E59\u0EB1\u0EB4-\u0EBC\u0EC8-\u0ECD\u0ED0-\u0ED9\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E\u0F3F\u0F71-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102B-\u103E\u1040-\u1049\u1056-\u1059\u105E-\u1060\u1062-\u1064\u1067-\u106D\u1071-\u1074\u1082-\u108D\u108F-\u109D\u135D-\u135F\u1369-\u1371\u1712-\u1715\u1732-\u1734\u1752\u1753\u1772\u1773\u17B4-\u17D3\u17DD\u17E0-\u17E9\u180B-\u180D\u180F-\u1819\u18A9\u1920-\u192B\u1930-\u193B\u1946-\u194F\u19D0-\u19DA\u1A17-\u1A1B\u1A55-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AB0-\u1ABD\u1ABF-\u1ACE\u1B00-\u1B04\u1B34-\u1B44\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1B82\u1BA1-\u1BAD\u1BB0-\u1BB9\u1BE6-\u1BF3\u1C24-\u1C37\u1C40-\u1C49\u1C50-\u1C59\u1CD0-\u1CD2\u1CD4-\u1CE8\u1CED\u1CF4\u1CF7-\u1CF9\u1DC0-\u1DFF\u203F\u2040\u2054\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302F\u3099\u309A\uA620-\uA629\uA66F\uA674-\uA67D\uA69E\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA823-\uA827\uA82C\uA880\uA881\uA8B4-\uA8C5\uA8D0-\uA8D9\uA8E0-\uA8F1\uA8FF-\uA909\uA926-\uA92D\uA947-\uA953\uA980-\uA983\uA9B3-\uA9C0\uA9D0-\uA9D9\uA9E5\uA9F0-\uA9F9\uAA29-\uAA36\uAA43\uAA4C\uAA4D\uAA50-\uAA59\uAA7B-\uAA7D\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEB-\uAAEF\uAAF5\uAAF6\uABE3-\uABEA\uABEC\uABED\uABF0-\uABF9\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFF10-\uFF19\uFF3F]");
function fa(e, t) {
  for (var i = 65536, s = 0; s < t.length; s += 2) {
    if ((i += t[s]) > e)
      return false;
    if ((i += t[s + 1]) >= e)
      return true;
  }
}
function ma(e, t) {
  return e < 65 ? e === 36 : e < 91 || (e < 97 ? e === 95 : e < 123 || (e <= 65535 ? e >= 170 && da.test(String.fromCharCode(e)) : t !== false && fa(e, aa)));
}
function ga(e, t) {
  return e < 48 ? e === 36 : e < 58 || !(e < 65) && (e < 91 || (e < 97 ? e === 95 : e < 123 || (e <= 65535 ? e >= 170 && pa.test(String.fromCharCode(e)) : t !== false && (fa(e, aa) || fa(e, ra)))));
}
var ya = function(e, t) {
  t === void 0 && (t = {}), this.label = e, this.keyword = t.keyword, this.beforeExpr = !!t.beforeExpr, this.startsExpr = !!t.startsExpr, this.isLoop = !!t.isLoop, this.isAssign = !!t.isAssign, this.prefix = !!t.prefix, this.postfix = !!t.postfix, this.binop = t.binop || null, this.updateContext = null;
};
function xa(e, t) {
  return new ya(e, { beforeExpr: true, binop: t });
}
var Ea = { beforeExpr: true }, ba = { startsExpr: true }, va = {};
function Sa(e, t) {
  return t === void 0 && (t = {}), t.keyword = e, va[e] = new ya(e, t);
}
var Aa = { num: new ya("num", ba), regexp: new ya("regexp", ba), string: new ya("string", ba), name: new ya("name", ba), privateId: new ya("privateId", ba), eof: new ya("eof"), bracketL: new ya("[", { beforeExpr: true, startsExpr: true }), bracketR: new ya("]"), braceL: new ya("{", { beforeExpr: true, startsExpr: true }), braceR: new ya("}"), parenL: new ya("(", { beforeExpr: true, startsExpr: true }), parenR: new ya(")"), comma: new ya(",", Ea), semi: new ya(";", Ea), colon: new ya(":", Ea), dot: new ya("."), question: new ya("?", Ea), questionDot: new ya("?."), arrow: new ya("=>", Ea), template: new ya("template"), invalidTemplate: new ya("invalidTemplate"), ellipsis: new ya("...", Ea), backQuote: new ya("`", ba), dollarBraceL: new ya("${", { beforeExpr: true, startsExpr: true }), eq: new ya("=", { beforeExpr: true, isAssign: true }), assign: new ya("_=", { beforeExpr: true, isAssign: true }), incDec: new ya("++/--", { prefix: true, postfix: true, startsExpr: true }), prefix: new ya("!/~", { beforeExpr: true, prefix: true, startsExpr: true }), logicalOR: xa("||", 1), logicalAND: xa("&&", 2), bitwiseOR: xa("|", 3), bitwiseXOR: xa("^", 4), bitwiseAND: xa("&", 5), equality: xa("==/!=/===/!==", 6), relational: xa("</>/<=/>=", 7), bitShift: xa("<</>>/>>>", 8), plusMin: new ya("+/-", { beforeExpr: true, binop: 9, prefix: true, startsExpr: true }), modulo: xa("%", 10), star: xa("*", 10), slash: xa("/", 10), starstar: new ya("**", { beforeExpr: true }), coalesce: xa("??", 1), _break: Sa("break"), _case: Sa("case", Ea), _catch: Sa("catch"), _continue: Sa("continue"), _debugger: Sa("debugger"), _default: Sa("default", Ea), _do: Sa("do", { isLoop: true, beforeExpr: true }), _else: Sa("else", Ea), _finally: Sa("finally"), _for: Sa("for", { isLoop: true }), _function: Sa("function", ba), _if: Sa("if"), _return: Sa("return", Ea), _switch: Sa("switch"), _throw: Sa("throw", Ea), _try: Sa("try"), _var: Sa("var"), _const: Sa("const"), _while: Sa("while", { isLoop: true }), _with: Sa("with"), _new: Sa("new", { beforeExpr: true, startsExpr: true }), _this: Sa("this", ba), _super: Sa("super", ba), _class: Sa("class", ba), _extends: Sa("extends", Ea), _export: Sa("export"), _import: Sa("import", ba), _null: Sa("null", ba), _true: Sa("true", ba), _false: Sa("false", ba), _in: Sa("in", { beforeExpr: true, binop: 7 }), _instanceof: Sa("instanceof", { beforeExpr: true, binop: 7 }), _typeof: Sa("typeof", { beforeExpr: true, prefix: true, startsExpr: true }), _void: Sa("void", { beforeExpr: true, prefix: true, startsExpr: true }), _delete: Sa("delete", { beforeExpr: true, prefix: true, startsExpr: true }) }, Ia = /\r\n?|\n|\u2028|\u2029/, ka = new RegExp(Ia.source, "g");
function Pa(e) {
  return e === 10 || e === 13 || e === 8232 || e === 8233;
}
function wa(e, t, i) {
  i === void 0 && (i = e.length);
  for (var s = t; s < i; s++) {
    var n2 = e.charCodeAt(s);
    if (Pa(n2))
      return s < i - 1 && n2 === 13 && e.charCodeAt(s + 1) === 10 ? s + 2 : s + 1;
  }
  return -1;
}
var Ca = /[\u1680\u2000-\u200a\u202f\u205f\u3000\ufeff]/, _a = /(?:\s|\/\/.*|\/\*[^]*?\*\/)*/g, Na = Object.prototype, $a = Na.hasOwnProperty, Ta = Na.toString, Oa = Object.hasOwn || function(e, t) {
  return $a.call(e, t);
}, Ra = Array.isArray || function(e) {
  return Ta.call(e) === "[object Array]";
};
function Ma(e) {
  return new RegExp("^(?:" + e.replace(/ /g, "|") + ")$");
}
function Da(e) {
  return e <= 65535 ? String.fromCharCode(e) : (e -= 65536, String.fromCharCode(55296 + (e >> 10), 56320 + (1023 & e)));
}
var La = /(?:[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/, Va = function(e, t) {
  this.line = e, this.column = t;
};
Va.prototype.offset = function(e) {
  return new Va(this.line, this.column + e);
};
var Ba = function(e, t, i) {
  this.start = t, this.end = i, e.sourceFile !== null && (this.source = e.sourceFile);
};
function Fa(e, t) {
  for (var i = 1, s = 0; ; ) {
    var n2 = wa(e, s, t);
    if (n2 < 0)
      return new Va(i, t - s);
    ++i, s = n2;
  }
}
var za = { ecmaVersion: null, sourceType: "script", onInsertedSemicolon: null, onTrailingComma: null, allowReserved: null, allowReturnOutsideFunction: false, allowImportExportEverywhere: false, allowAwaitOutsideFunction: null, allowSuperOutsideMethod: null, allowHashBang: false, locations: false, onToken: null, onComment: null, ranges: false, program: null, sourceFile: null, directSourceFile: null, preserveParens: false }, ja = false;
function Ua(e) {
  var t = {};
  for (var i in za)
    t[i] = e && Oa(e, i) ? e[i] : za[i];
  if (t.ecmaVersion === "latest" ? t.ecmaVersion = 1e8 : t.ecmaVersion == null ? (!ja && typeof console == "object" && console.warn && (ja = true, console.warn("Since Acorn 8.0.0, options.ecmaVersion is required.\nDefaulting to 2020, but this will stop working in the future.")), t.ecmaVersion = 11) : t.ecmaVersion >= 2015 && (t.ecmaVersion -= 2009), t.allowReserved == null && (t.allowReserved = t.ecmaVersion < 5), Ra(t.onToken)) {
    var s = t.onToken;
    t.onToken = function(e2) {
      return s.push(e2);
    };
  }
  return Ra(t.onComment) && (t.onComment = function(e2, t2) {
    return function(i2, s2, n2, r2, a3, o2) {
      var l2 = { type: i2 ? "Block" : "Line", value: s2, start: n2, end: r2 };
      e2.locations && (l2.loc = new Ba(this, a3, o2)), e2.ranges && (l2.range = [n2, r2]), t2.push(l2);
    };
  }(t, t.onComment)), t;
}
function Ga(e, t) {
  return 2 | (e ? 4 : 0) | (t ? 8 : 0);
}
var Ha = function(e, t, i) {
  this.options = e = Ua(e), this.sourceFile = e.sourceFile, this.keywords = Ma(ca[e.ecmaVersion >= 6 ? 6 : e.sourceType === "module" ? "5module" : 5]);
  var s = "";
  e.allowReserved !== true && (s = la[e.ecmaVersion >= 6 ? 6 : e.ecmaVersion === 5 ? 5 : 3], e.sourceType === "module" && (s += " await")), this.reservedWords = Ma(s);
  var n2 = (s ? s + " " : "") + la.strict;
  this.reservedWordsStrict = Ma(n2), this.reservedWordsStrictBind = Ma(n2 + " " + la.strictBind), this.input = String(t), this.containsEsc = false, i ? (this.pos = i, this.lineStart = this.input.lastIndexOf("\n", i - 1) + 1, this.curLine = this.input.slice(0, this.lineStart).split(Ia).length) : (this.pos = this.lineStart = 0, this.curLine = 1), this.type = Aa.eof, this.value = null, this.start = this.end = this.pos, this.startLoc = this.endLoc = this.curPosition(), this.lastTokEndLoc = this.lastTokStartLoc = null, this.lastTokStart = this.lastTokEnd = this.pos, this.context = this.initialContext(), this.exprAllowed = true, this.inModule = e.sourceType === "module", this.strict = this.inModule || this.strictDirective(this.pos), this.potentialArrowAt = -1, this.potentialArrowInForAwait = false, this.yieldPos = this.awaitPos = this.awaitIdentPos = 0, this.labels = [], this.undefinedExports = /* @__PURE__ */ Object.create(null), this.pos === 0 && e.allowHashBang && this.input.slice(0, 2) === "#!" && this.skipLineComment(2), this.scopeStack = [], this.enterScope(1), this.regexpState = null, this.privateNameStack = [];
}, Wa = { inFunction: { configurable: true }, inGenerator: { configurable: true }, inAsync: { configurable: true }, canAwait: { configurable: true }, allowSuper: { configurable: true }, allowDirectSuper: { configurable: true }, treatFunctionsAsVar: { configurable: true }, allowNewDotTarget: { configurable: true }, inClassStaticBlock: { configurable: true } };
Ha.prototype.parse = function() {
  var e = this.options.program || this.startNode();
  return this.nextToken(), this.parseTopLevel(e);
}, Wa.inFunction.get = function() {
  return (2 & this.currentVarScope().flags) > 0;
}, Wa.inGenerator.get = function() {
  return (8 & this.currentVarScope().flags) > 0 && !this.currentVarScope().inClassFieldInit;
}, Wa.inAsync.get = function() {
  return (4 & this.currentVarScope().flags) > 0 && !this.currentVarScope().inClassFieldInit;
}, Wa.canAwait.get = function() {
  for (var e = this.scopeStack.length - 1; e >= 0; e--) {
    var t = this.scopeStack[e];
    if (t.inClassFieldInit || 256 & t.flags)
      return false;
    if (2 & t.flags)
      return (4 & t.flags) > 0;
  }
  return this.inModule && this.options.ecmaVersion >= 13 || this.options.allowAwaitOutsideFunction;
}, Wa.allowSuper.get = function() {
  var e = this.currentThisScope(), t = e.flags, i = e.inClassFieldInit;
  return (64 & t) > 0 || i || this.options.allowSuperOutsideMethod;
}, Wa.allowDirectSuper.get = function() {
  return (128 & this.currentThisScope().flags) > 0;
}, Wa.treatFunctionsAsVar.get = function() {
  return this.treatFunctionsAsVarInScope(this.currentScope());
}, Wa.allowNewDotTarget.get = function() {
  var e = this.currentThisScope(), t = e.flags, i = e.inClassFieldInit;
  return (258 & t) > 0 || i;
}, Wa.inClassStaticBlock.get = function() {
  return (256 & this.currentVarScope().flags) > 0;
}, Ha.extend = function() {
  for (var e = [], t = arguments.length; t--; )
    e[t] = arguments[t];
  for (var i = this, s = 0; s < e.length; s++)
    i = e[s](i);
  return i;
}, Ha.parse = function(e, t) {
  return new this(t, e).parse();
}, Ha.parseExpressionAt = function(e, t, i) {
  var s = new this(i, e, t);
  return s.nextToken(), s.parseExpression();
}, Ha.tokenizer = function(e, t) {
  return new this(t, e);
}, Object.defineProperties(Ha.prototype, Wa);
var qa = Ha.prototype, Ka = /^(?:'((?:\\.|[^'\\])*?)'|"((?:\\.|[^"\\])*?)")/;
qa.strictDirective = function(e) {
  if (this.options.ecmaVersion < 5)
    return false;
  for (; ; ) {
    _a.lastIndex = e, e += _a.exec(this.input)[0].length;
    var t = Ka.exec(this.input.slice(e));
    if (!t)
      return false;
    if ((t[1] || t[2]) === "use strict") {
      _a.lastIndex = e + t[0].length;
      var i = _a.exec(this.input), s = i.index + i[0].length, n2 = this.input.charAt(s);
      return n2 === ";" || n2 === "}" || Ia.test(i[0]) && !(/[(`.[+\-/*%<>=,?^&]/.test(n2) || n2 === "!" && this.input.charAt(s + 1) === "=");
    }
    e += t[0].length, _a.lastIndex = e, e += _a.exec(this.input)[0].length, this.input[e] === ";" && e++;
  }
}, qa.eat = function(e) {
  return this.type === e && (this.next(), true);
}, qa.isContextual = function(e) {
  return this.type === Aa.name && this.value === e && !this.containsEsc;
}, qa.eatContextual = function(e) {
  return !!this.isContextual(e) && (this.next(), true);
}, qa.expectContextual = function(e) {
  this.eatContextual(e) || this.unexpected();
}, qa.canInsertSemicolon = function() {
  return this.type === Aa.eof || this.type === Aa.braceR || Ia.test(this.input.slice(this.lastTokEnd, this.start));
}, qa.insertSemicolon = function() {
  if (this.canInsertSemicolon())
    return this.options.onInsertedSemicolon && this.options.onInsertedSemicolon(this.lastTokEnd, this.lastTokEndLoc), true;
}, qa.semicolon = function() {
  this.eat(Aa.semi) || this.insertSemicolon() || this.unexpected();
}, qa.afterTrailingComma = function(e, t) {
  if (this.type === e)
    return this.options.onTrailingComma && this.options.onTrailingComma(this.lastTokStart, this.lastTokStartLoc), t || this.next(), true;
}, qa.expect = function(e) {
  this.eat(e) || this.unexpected();
}, qa.unexpected = function(e) {
  this.raise(e != null ? e : this.start, "Unexpected token");
};
var Xa = function() {
  this.shorthandAssign = this.trailingComma = this.parenthesizedAssign = this.parenthesizedBind = this.doubleProto = -1;
};
qa.checkPatternErrors = function(e, t) {
  if (e) {
    e.trailingComma > -1 && this.raiseRecoverable(e.trailingComma, "Comma is not permitted after the rest element");
    var i = t ? e.parenthesizedAssign : e.parenthesizedBind;
    i > -1 && this.raiseRecoverable(i, "Parenthesized pattern");
  }
}, qa.checkExpressionErrors = function(e, t) {
  if (!e)
    return false;
  var i = e.shorthandAssign, s = e.doubleProto;
  if (!t)
    return i >= 0 || s >= 0;
  i >= 0 && this.raise(i, "Shorthand property assignments are valid only in destructuring patterns"), s >= 0 && this.raiseRecoverable(s, "Redefinition of __proto__ property");
}, qa.checkYieldAwaitInDefaultParams = function() {
  this.yieldPos && (!this.awaitPos || this.yieldPos < this.awaitPos) && this.raise(this.yieldPos, "Yield expression cannot be a default value"), this.awaitPos && this.raise(this.awaitPos, "Await expression cannot be a default value");
}, qa.isSimpleAssignTarget = function(e) {
  return e.type === "ParenthesizedExpression" ? this.isSimpleAssignTarget(e.expression) : e.type === "Identifier" || e.type === "MemberExpression";
};
var Ya = Ha.prototype;
Ya.parseTopLevel = function(e) {
  var t = /* @__PURE__ */ Object.create(null);
  for (e.body || (e.body = []); this.type !== Aa.eof; ) {
    var i = this.parseStatement(null, true, t);
    e.body.push(i);
  }
  if (this.inModule)
    for (var s = 0, n2 = Object.keys(this.undefinedExports); s < n2.length; s += 1) {
      var r2 = n2[s];
      this.raiseRecoverable(this.undefinedExports[r2].start, "Export '" + r2 + "' is not defined");
    }
  return this.adaptDirectivePrologue(e.body), this.next(), e.sourceType = this.options.sourceType, this.finishNode(e, "Program");
};
var Qa = { kind: "loop" }, Za = { kind: "switch" };
Ya.isLet = function(e) {
  if (this.options.ecmaVersion < 6 || !this.isContextual("let"))
    return false;
  _a.lastIndex = this.pos;
  var t = _a.exec(this.input), i = this.pos + t[0].length, s = this.input.charCodeAt(i);
  if (s === 91 || s === 92 || s > 55295 && s < 56320)
    return true;
  if (e)
    return false;
  if (s === 123)
    return true;
  if (ma(s, true)) {
    for (var n2 = i + 1; ga(s = this.input.charCodeAt(n2), true); )
      ++n2;
    if (s === 92 || s > 55295 && s < 56320)
      return true;
    var r2 = this.input.slice(i, n2);
    if (!ua.test(r2))
      return true;
  }
  return false;
}, Ya.isAsyncFunction = function() {
  if (this.options.ecmaVersion < 8 || !this.isContextual("async"))
    return false;
  _a.lastIndex = this.pos;
  var e, t = _a.exec(this.input), i = this.pos + t[0].length;
  return !(Ia.test(this.input.slice(this.pos, i)) || this.input.slice(i, i + 8) !== "function" || i + 8 !== this.input.length && (ga(e = this.input.charCodeAt(i + 8)) || e > 55295 && e < 56320));
}, Ya.parseStatement = function(e, t, i) {
  var s, n2 = this.type, r2 = this.startNode();
  switch (this.isLet(e) && (n2 = Aa._var, s = "let"), n2) {
    case Aa._break:
    case Aa._continue:
      return this.parseBreakContinueStatement(r2, n2.keyword);
    case Aa._debugger:
      return this.parseDebuggerStatement(r2);
    case Aa._do:
      return this.parseDoStatement(r2);
    case Aa._for:
      return this.parseForStatement(r2);
    case Aa._function:
      return e && (this.strict || e !== "if" && e !== "label") && this.options.ecmaVersion >= 6 && this.unexpected(), this.parseFunctionStatement(r2, false, !e);
    case Aa._class:
      return e && this.unexpected(), this.parseClass(r2, true);
    case Aa._if:
      return this.parseIfStatement(r2);
    case Aa._return:
      return this.parseReturnStatement(r2);
    case Aa._switch:
      return this.parseSwitchStatement(r2);
    case Aa._throw:
      return this.parseThrowStatement(r2);
    case Aa._try:
      return this.parseTryStatement(r2);
    case Aa._const:
    case Aa._var:
      return s = s || this.value, e && s !== "var" && this.unexpected(), this.parseVarStatement(r2, s);
    case Aa._while:
      return this.parseWhileStatement(r2);
    case Aa._with:
      return this.parseWithStatement(r2);
    case Aa.braceL:
      return this.parseBlock(true, r2);
    case Aa.semi:
      return this.parseEmptyStatement(r2);
    case Aa._export:
    case Aa._import:
      if (this.options.ecmaVersion > 10 && n2 === Aa._import) {
        _a.lastIndex = this.pos;
        var a3 = _a.exec(this.input), o2 = this.pos + a3[0].length, l2 = this.input.charCodeAt(o2);
        if (l2 === 40 || l2 === 46)
          return this.parseExpressionStatement(r2, this.parseExpression());
      }
      return this.options.allowImportExportEverywhere || (t || this.raise(this.start, "'import' and 'export' may only appear at the top level"), this.inModule || this.raise(this.start, "'import' and 'export' may appear only with 'sourceType: module'")), n2 === Aa._import ? this.parseImport(r2) : this.parseExport(r2, i);
    default:
      if (this.isAsyncFunction())
        return e && this.unexpected(), this.next(), this.parseFunctionStatement(r2, true, !e);
      var h2 = this.value, c2 = this.parseExpression();
      return n2 === Aa.name && c2.type === "Identifier" && this.eat(Aa.colon) ? this.parseLabeledStatement(r2, h2, c2, e) : this.parseExpressionStatement(r2, c2);
  }
}, Ya.parseBreakContinueStatement = function(e, t) {
  var i = t === "break";
  this.next(), this.eat(Aa.semi) || this.insertSemicolon() ? e.label = null : this.type !== Aa.name ? this.unexpected() : (e.label = this.parseIdent(), this.semicolon());
  for (var s = 0; s < this.labels.length; ++s) {
    var n2 = this.labels[s];
    if (e.label == null || n2.name === e.label.name) {
      if (n2.kind != null && (i || n2.kind === "loop"))
        break;
      if (e.label && i)
        break;
    }
  }
  return s === this.labels.length && this.raise(e.start, "Unsyntactic " + t), this.finishNode(e, i ? "BreakStatement" : "ContinueStatement");
}, Ya.parseDebuggerStatement = function(e) {
  return this.next(), this.semicolon(), this.finishNode(e, "DebuggerStatement");
}, Ya.parseDoStatement = function(e) {
  return this.next(), this.labels.push(Qa), e.body = this.parseStatement("do"), this.labels.pop(), this.expect(Aa._while), e.test = this.parseParenExpression(), this.options.ecmaVersion >= 6 ? this.eat(Aa.semi) : this.semicolon(), this.finishNode(e, "DoWhileStatement");
}, Ya.parseForStatement = function(e) {
  this.next();
  var t = this.options.ecmaVersion >= 9 && this.canAwait && this.eatContextual("await") ? this.lastTokStart : -1;
  if (this.labels.push(Qa), this.enterScope(0), this.expect(Aa.parenL), this.type === Aa.semi)
    return t > -1 && this.unexpected(t), this.parseFor(e, null);
  var i = this.isLet();
  if (this.type === Aa._var || this.type === Aa._const || i) {
    var s = this.startNode(), n2 = i ? "let" : this.value;
    return this.next(), this.parseVar(s, true, n2), this.finishNode(s, "VariableDeclaration"), (this.type === Aa._in || this.options.ecmaVersion >= 6 && this.isContextual("of")) && s.declarations.length === 1 ? (this.options.ecmaVersion >= 9 && (this.type === Aa._in ? t > -1 && this.unexpected(t) : e.await = t > -1), this.parseForIn(e, s)) : (t > -1 && this.unexpected(t), this.parseFor(e, s));
  }
  var r2 = this.isContextual("let"), a3 = false, o2 = new Xa(), l2 = this.parseExpression(!(t > -1) || "await", o2);
  return this.type === Aa._in || (a3 = this.options.ecmaVersion >= 6 && this.isContextual("of")) ? (this.options.ecmaVersion >= 9 && (this.type === Aa._in ? t > -1 && this.unexpected(t) : e.await = t > -1), r2 && a3 && this.raise(l2.start, "The left-hand side of a for-of loop may not start with 'let'."), this.toAssignable(l2, false, o2), this.checkLValPattern(l2), this.parseForIn(e, l2)) : (this.checkExpressionErrors(o2, true), t > -1 && this.unexpected(t), this.parseFor(e, l2));
}, Ya.parseFunctionStatement = function(e, t, i) {
  return this.next(), this.parseFunction(e, eo | (i ? 0 : to), false, t);
}, Ya.parseIfStatement = function(e) {
  return this.next(), e.test = this.parseParenExpression(), e.consequent = this.parseStatement("if"), e.alternate = this.eat(Aa._else) ? this.parseStatement("if") : null, this.finishNode(e, "IfStatement");
}, Ya.parseReturnStatement = function(e) {
  return this.inFunction || this.options.allowReturnOutsideFunction || this.raise(this.start, "'return' outside of function"), this.next(), this.eat(Aa.semi) || this.insertSemicolon() ? e.argument = null : (e.argument = this.parseExpression(), this.semicolon()), this.finishNode(e, "ReturnStatement");
}, Ya.parseSwitchStatement = function(e) {
  var t;
  this.next(), e.discriminant = this.parseParenExpression(), e.cases = [], this.expect(Aa.braceL), this.labels.push(Za), this.enterScope(0);
  for (var i = false; this.type !== Aa.braceR; )
    if (this.type === Aa._case || this.type === Aa._default) {
      var s = this.type === Aa._case;
      t && this.finishNode(t, "SwitchCase"), e.cases.push(t = this.startNode()), t.consequent = [], this.next(), s ? t.test = this.parseExpression() : (i && this.raiseRecoverable(this.lastTokStart, "Multiple default clauses"), i = true, t.test = null), this.expect(Aa.colon);
    } else
      t || this.unexpected(), t.consequent.push(this.parseStatement(null));
  return this.exitScope(), t && this.finishNode(t, "SwitchCase"), this.next(), this.labels.pop(), this.finishNode(e, "SwitchStatement");
}, Ya.parseThrowStatement = function(e) {
  return this.next(), Ia.test(this.input.slice(this.lastTokEnd, this.start)) && this.raise(this.lastTokEnd, "Illegal newline after throw"), e.argument = this.parseExpression(), this.semicolon(), this.finishNode(e, "ThrowStatement");
};
var Ja = [];
Ya.parseTryStatement = function(e) {
  if (this.next(), e.block = this.parseBlock(), e.handler = null, this.type === Aa._catch) {
    var t = this.startNode();
    if (this.next(), this.eat(Aa.parenL)) {
      t.param = this.parseBindingAtom();
      var i = t.param.type === "Identifier";
      this.enterScope(i ? 32 : 0), this.checkLValPattern(t.param, i ? 4 : 2), this.expect(Aa.parenR);
    } else
      this.options.ecmaVersion < 10 && this.unexpected(), t.param = null, this.enterScope(0);
    t.body = this.parseBlock(false), this.exitScope(), e.handler = this.finishNode(t, "CatchClause");
  }
  return e.finalizer = this.eat(Aa._finally) ? this.parseBlock() : null, e.handler || e.finalizer || this.raise(e.start, "Missing catch or finally clause"), this.finishNode(e, "TryStatement");
}, Ya.parseVarStatement = function(e, t) {
  return this.next(), this.parseVar(e, false, t), this.semicolon(), this.finishNode(e, "VariableDeclaration");
}, Ya.parseWhileStatement = function(e) {
  return this.next(), e.test = this.parseParenExpression(), this.labels.push(Qa), e.body = this.parseStatement("while"), this.labels.pop(), this.finishNode(e, "WhileStatement");
}, Ya.parseWithStatement = function(e) {
  return this.strict && this.raise(this.start, "'with' in strict mode"), this.next(), e.object = this.parseParenExpression(), e.body = this.parseStatement("with"), this.finishNode(e, "WithStatement");
}, Ya.parseEmptyStatement = function(e) {
  return this.next(), this.finishNode(e, "EmptyStatement");
}, Ya.parseLabeledStatement = function(e, t, i, s) {
  for (var n2 = 0, r2 = this.labels; n2 < r2.length; n2 += 1) {
    r2[n2].name === t && this.raise(i.start, "Label '" + t + "' is already declared");
  }
  for (var a3 = this.type.isLoop ? "loop" : this.type === Aa._switch ? "switch" : null, o2 = this.labels.length - 1; o2 >= 0; o2--) {
    var l2 = this.labels[o2];
    if (l2.statementStart !== e.start)
      break;
    l2.statementStart = this.start, l2.kind = a3;
  }
  return this.labels.push({ name: t, kind: a3, statementStart: this.start }), e.body = this.parseStatement(s ? s.indexOf("label") === -1 ? s + "label" : s : "label"), this.labels.pop(), e.label = i, this.finishNode(e, "LabeledStatement");
}, Ya.parseExpressionStatement = function(e, t) {
  return e.expression = t, this.semicolon(), this.finishNode(e, "ExpressionStatement");
}, Ya.parseBlock = function(e, t, i) {
  for (e === void 0 && (e = true), t === void 0 && (t = this.startNode()), t.body = [], this.expect(Aa.braceL), e && this.enterScope(0); this.type !== Aa.braceR; ) {
    var s = this.parseStatement(null);
    t.body.push(s);
  }
  return i && (this.strict = false), this.next(), e && this.exitScope(), this.finishNode(t, "BlockStatement");
}, Ya.parseFor = function(e, t) {
  return e.init = t, this.expect(Aa.semi), e.test = this.type === Aa.semi ? null : this.parseExpression(), this.expect(Aa.semi), e.update = this.type === Aa.parenR ? null : this.parseExpression(), this.expect(Aa.parenR), e.body = this.parseStatement("for"), this.exitScope(), this.labels.pop(), this.finishNode(e, "ForStatement");
}, Ya.parseForIn = function(e, t) {
  var i = this.type === Aa._in;
  return this.next(), t.type === "VariableDeclaration" && t.declarations[0].init != null && (!i || this.options.ecmaVersion < 8 || this.strict || t.kind !== "var" || t.declarations[0].id.type !== "Identifier") && this.raise(t.start, (i ? "for-in" : "for-of") + " loop variable declaration may not have an initializer"), e.left = t, e.right = i ? this.parseExpression() : this.parseMaybeAssign(), this.expect(Aa.parenR), e.body = this.parseStatement("for"), this.exitScope(), this.labels.pop(), this.finishNode(e, i ? "ForInStatement" : "ForOfStatement");
}, Ya.parseVar = function(e, t, i) {
  for (e.declarations = [], e.kind = i; ; ) {
    var s = this.startNode();
    if (this.parseVarId(s, i), this.eat(Aa.eq) ? s.init = this.parseMaybeAssign(t) : i !== "const" || this.type === Aa._in || this.options.ecmaVersion >= 6 && this.isContextual("of") ? s.id.type === "Identifier" || t && (this.type === Aa._in || this.isContextual("of")) ? s.init = null : this.raise(this.lastTokEnd, "Complex binding patterns require an initialization value") : this.unexpected(), e.declarations.push(this.finishNode(s, "VariableDeclarator")), !this.eat(Aa.comma))
      break;
  }
  return e;
}, Ya.parseVarId = function(e, t) {
  e.id = this.parseBindingAtom(), this.checkLValPattern(e.id, t === "var" ? 1 : 2, false);
};
var eo = 1, to = 2;
function io(e, t) {
  var i = t.key.name, s = e[i], n2 = "true";
  return t.type !== "MethodDefinition" || t.kind !== "get" && t.kind !== "set" || (n2 = (t.static ? "s" : "i") + t.kind), s === "iget" && n2 === "iset" || s === "iset" && n2 === "iget" || s === "sget" && n2 === "sset" || s === "sset" && n2 === "sget" ? (e[i] = "true", false) : !!s || (e[i] = n2, false);
}
function so(e, t) {
  var i = e.computed, s = e.key;
  return !i && (s.type === "Identifier" && s.name === t || s.type === "Literal" && s.value === t);
}
Ya.parseFunction = function(e, t, i, s, n2) {
  this.initFunction(e), (this.options.ecmaVersion >= 9 || this.options.ecmaVersion >= 6 && !s) && (this.type === Aa.star && t & to && this.unexpected(), e.generator = this.eat(Aa.star)), this.options.ecmaVersion >= 8 && (e.async = !!s), t & eo && (e.id = 4 & t && this.type !== Aa.name ? null : this.parseIdent(), !e.id || t & to || this.checkLValSimple(e.id, this.strict || e.generator || e.async ? this.treatFunctionsAsVar ? 1 : 2 : 3));
  var r2 = this.yieldPos, a3 = this.awaitPos, o2 = this.awaitIdentPos;
  return this.yieldPos = 0, this.awaitPos = 0, this.awaitIdentPos = 0, this.enterScope(Ga(e.async, e.generator)), t & eo || (e.id = this.type === Aa.name ? this.parseIdent() : null), this.parseFunctionParams(e), this.parseFunctionBody(e, i, false, n2), this.yieldPos = r2, this.awaitPos = a3, this.awaitIdentPos = o2, this.finishNode(e, t & eo ? "FunctionDeclaration" : "FunctionExpression");
}, Ya.parseFunctionParams = function(e) {
  this.expect(Aa.parenL), e.params = this.parseBindingList(Aa.parenR, false, this.options.ecmaVersion >= 8), this.checkYieldAwaitInDefaultParams();
}, Ya.parseClass = function(e, t) {
  this.next();
  var i = this.strict;
  this.strict = true, this.parseClassId(e, t), this.parseClassSuper(e);
  var s = this.enterClassBody(), n2 = this.startNode(), r2 = false;
  for (n2.body = [], this.expect(Aa.braceL); this.type !== Aa.braceR; ) {
    var a3 = this.parseClassElement(e.superClass !== null);
    a3 && (n2.body.push(a3), a3.type === "MethodDefinition" && a3.kind === "constructor" ? (r2 && this.raise(a3.start, "Duplicate constructor in the same class"), r2 = true) : a3.key && a3.key.type === "PrivateIdentifier" && io(s, a3) && this.raiseRecoverable(a3.key.start, "Identifier '#" + a3.key.name + "' has already been declared"));
  }
  return this.strict = i, this.next(), e.body = this.finishNode(n2, "ClassBody"), this.exitClassBody(), this.finishNode(e, t ? "ClassDeclaration" : "ClassExpression");
}, Ya.parseClassElement = function(e) {
  if (this.eat(Aa.semi))
    return null;
  var t = this.options.ecmaVersion, i = this.startNode(), s = "", n2 = false, r2 = false, a3 = "method", o2 = false;
  if (this.eatContextual("static")) {
    if (t >= 13 && this.eat(Aa.braceL))
      return this.parseClassStaticBlock(i), i;
    this.isClassElementNameStart() || this.type === Aa.star ? o2 = true : s = "static";
  }
  if (i.static = o2, !s && t >= 8 && this.eatContextual("async") && (!this.isClassElementNameStart() && this.type !== Aa.star || this.canInsertSemicolon() ? s = "async" : r2 = true), !s && (t >= 9 || !r2) && this.eat(Aa.star) && (n2 = true), !s && !r2 && !n2) {
    var l2 = this.value;
    (this.eatContextual("get") || this.eatContextual("set")) && (this.isClassElementNameStart() ? a3 = l2 : s = l2);
  }
  if (s ? (i.computed = false, i.key = this.startNodeAt(this.lastTokStart, this.lastTokStartLoc), i.key.name = s, this.finishNode(i.key, "Identifier")) : this.parseClassElementName(i), t < 13 || this.type === Aa.parenL || a3 !== "method" || n2 || r2) {
    var h2 = !i.static && so(i, "constructor"), c2 = h2 && e;
    h2 && a3 !== "method" && this.raise(i.key.start, "Constructor can't have get/set modifier"), i.kind = h2 ? "constructor" : a3, this.parseClassMethod(i, n2, r2, c2);
  } else
    this.parseClassField(i);
  return i;
}, Ya.isClassElementNameStart = function() {
  return this.type === Aa.name || this.type === Aa.privateId || this.type === Aa.num || this.type === Aa.string || this.type === Aa.bracketL || this.type.keyword;
}, Ya.parseClassElementName = function(e) {
  this.type === Aa.privateId ? (this.value === "constructor" && this.raise(this.start, "Classes can't have an element named '#constructor'"), e.computed = false, e.key = this.parsePrivateIdent()) : this.parsePropertyName(e);
}, Ya.parseClassMethod = function(e, t, i, s) {
  var n2 = e.key;
  e.kind === "constructor" ? (t && this.raise(n2.start, "Constructor can't be a generator"), i && this.raise(n2.start, "Constructor can't be an async method")) : e.static && so(e, "prototype") && this.raise(n2.start, "Classes may not have a static property named prototype");
  var r2 = e.value = this.parseMethod(t, i, s);
  return e.kind === "get" && r2.params.length !== 0 && this.raiseRecoverable(r2.start, "getter should have no params"), e.kind === "set" && r2.params.length !== 1 && this.raiseRecoverable(r2.start, "setter should have exactly one param"), e.kind === "set" && r2.params[0].type === "RestElement" && this.raiseRecoverable(r2.params[0].start, "Setter cannot use rest params"), this.finishNode(e, "MethodDefinition");
}, Ya.parseClassField = function(e) {
  if (so(e, "constructor") ? this.raise(e.key.start, "Classes can't have a field named 'constructor'") : e.static && so(e, "prototype") && this.raise(e.key.start, "Classes can't have a static field named 'prototype'"), this.eat(Aa.eq)) {
    var t = this.currentThisScope(), i = t.inClassFieldInit;
    t.inClassFieldInit = true, e.value = this.parseMaybeAssign(), t.inClassFieldInit = i;
  } else
    e.value = null;
  return this.semicolon(), this.finishNode(e, "PropertyDefinition");
}, Ya.parseClassStaticBlock = function(e) {
  e.body = [];
  var t = this.labels;
  for (this.labels = [], this.enterScope(320); this.type !== Aa.braceR; ) {
    var i = this.parseStatement(null);
    e.body.push(i);
  }
  return this.next(), this.exitScope(), this.labels = t, this.finishNode(e, "StaticBlock");
}, Ya.parseClassId = function(e, t) {
  this.type === Aa.name ? (e.id = this.parseIdent(), t && this.checkLValSimple(e.id, 2, false)) : (t === true && this.unexpected(), e.id = null);
}, Ya.parseClassSuper = function(e) {
  e.superClass = this.eat(Aa._extends) ? this.parseExprSubscripts(false) : null;
}, Ya.enterClassBody = function() {
  var e = { declared: /* @__PURE__ */ Object.create(null), used: [] };
  return this.privateNameStack.push(e), e.declared;
}, Ya.exitClassBody = function() {
  for (var e = this.privateNameStack.pop(), t = e.declared, i = e.used, s = this.privateNameStack.length, n2 = s === 0 ? null : this.privateNameStack[s - 1], r2 = 0; r2 < i.length; ++r2) {
    var a3 = i[r2];
    Oa(t, a3.name) || (n2 ? n2.used.push(a3) : this.raiseRecoverable(a3.start, "Private field '#" + a3.name + "' must be declared in an enclosing class"));
  }
}, Ya.parseExport = function(e, t) {
  if (this.next(), this.eat(Aa.star))
    return this.options.ecmaVersion >= 11 && (this.eatContextual("as") ? (e.exported = this.parseModuleExportName(), this.checkExport(t, e.exported, this.lastTokStart)) : e.exported = null), this.expectContextual("from"), this.type !== Aa.string && this.unexpected(), e.source = this.parseExprAtom(), this.semicolon(), this.finishNode(e, "ExportAllDeclaration");
  if (this.eat(Aa._default)) {
    var i;
    if (this.checkExport(t, "default", this.lastTokStart), this.type === Aa._function || (i = this.isAsyncFunction())) {
      var s = this.startNode();
      this.next(), i && this.next(), e.declaration = this.parseFunction(s, 4 | eo, false, i);
    } else if (this.type === Aa._class) {
      var n2 = this.startNode();
      e.declaration = this.parseClass(n2, "nullableID");
    } else
      e.declaration = this.parseMaybeAssign(), this.semicolon();
    return this.finishNode(e, "ExportDefaultDeclaration");
  }
  if (this.shouldParseExportStatement())
    e.declaration = this.parseStatement(null), e.declaration.type === "VariableDeclaration" ? this.checkVariableExport(t, e.declaration.declarations) : this.checkExport(t, e.declaration.id, e.declaration.id.start), e.specifiers = [], e.source = null;
  else {
    if (e.declaration = null, e.specifiers = this.parseExportSpecifiers(t), this.eatContextual("from"))
      this.type !== Aa.string && this.unexpected(), e.source = this.parseExprAtom();
    else {
      for (var r2 = 0, a3 = e.specifiers; r2 < a3.length; r2 += 1) {
        var o2 = a3[r2];
        this.checkUnreserved(o2.local), this.checkLocalExport(o2.local), o2.local.type === "Literal" && this.raise(o2.local.start, "A string literal cannot be used as an exported binding without `from`.");
      }
      e.source = null;
    }
    this.semicolon();
  }
  return this.finishNode(e, "ExportNamedDeclaration");
}, Ya.checkExport = function(e, t, i) {
  e && (typeof t != "string" && (t = t.type === "Identifier" ? t.name : t.value), Oa(e, t) && this.raiseRecoverable(i, "Duplicate export '" + t + "'"), e[t] = true);
}, Ya.checkPatternExport = function(e, t) {
  var i = t.type;
  if (i === "Identifier")
    this.checkExport(e, t, t.start);
  else if (i === "ObjectPattern")
    for (var s = 0, n2 = t.properties; s < n2.length; s += 1) {
      var r2 = n2[s];
      this.checkPatternExport(e, r2);
    }
  else if (i === "ArrayPattern")
    for (var a3 = 0, o2 = t.elements; a3 < o2.length; a3 += 1) {
      var l2 = o2[a3];
      l2 && this.checkPatternExport(e, l2);
    }
  else
    i === "Property" ? this.checkPatternExport(e, t.value) : i === "AssignmentPattern" ? this.checkPatternExport(e, t.left) : i === "RestElement" ? this.checkPatternExport(e, t.argument) : i === "ParenthesizedExpression" && this.checkPatternExport(e, t.expression);
}, Ya.checkVariableExport = function(e, t) {
  if (e)
    for (var i = 0, s = t; i < s.length; i += 1) {
      var n2 = s[i];
      this.checkPatternExport(e, n2.id);
    }
}, Ya.shouldParseExportStatement = function() {
  return this.type.keyword === "var" || this.type.keyword === "const" || this.type.keyword === "class" || this.type.keyword === "function" || this.isLet() || this.isAsyncFunction();
}, Ya.parseExportSpecifiers = function(e) {
  var t = [], i = true;
  for (this.expect(Aa.braceL); !this.eat(Aa.braceR); ) {
    if (i)
      i = false;
    else if (this.expect(Aa.comma), this.afterTrailingComma(Aa.braceR))
      break;
    var s = this.startNode();
    s.local = this.parseModuleExportName(), s.exported = this.eatContextual("as") ? this.parseModuleExportName() : s.local, this.checkExport(e, s.exported, s.exported.start), t.push(this.finishNode(s, "ExportSpecifier"));
  }
  return t;
}, Ya.parseImport = function(e) {
  return this.next(), this.type === Aa.string ? (e.specifiers = Ja, e.source = this.parseExprAtom()) : (e.specifiers = this.parseImportSpecifiers(), this.expectContextual("from"), e.source = this.type === Aa.string ? this.parseExprAtom() : this.unexpected()), this.semicolon(), this.finishNode(e, "ImportDeclaration");
}, Ya.parseImportSpecifiers = function() {
  var e = [], t = true;
  if (this.type === Aa.name) {
    var i = this.startNode();
    if (i.local = this.parseIdent(), this.checkLValSimple(i.local, 2), e.push(this.finishNode(i, "ImportDefaultSpecifier")), !this.eat(Aa.comma))
      return e;
  }
  if (this.type === Aa.star) {
    var s = this.startNode();
    return this.next(), this.expectContextual("as"), s.local = this.parseIdent(), this.checkLValSimple(s.local, 2), e.push(this.finishNode(s, "ImportNamespaceSpecifier")), e;
  }
  for (this.expect(Aa.braceL); !this.eat(Aa.braceR); ) {
    if (t)
      t = false;
    else if (this.expect(Aa.comma), this.afterTrailingComma(Aa.braceR))
      break;
    var n2 = this.startNode();
    n2.imported = this.parseModuleExportName(), this.eatContextual("as") ? n2.local = this.parseIdent() : (this.checkUnreserved(n2.imported), n2.local = n2.imported), this.checkLValSimple(n2.local, 2), e.push(this.finishNode(n2, "ImportSpecifier"));
  }
  return e;
}, Ya.parseModuleExportName = function() {
  if (this.options.ecmaVersion >= 13 && this.type === Aa.string) {
    var e = this.parseLiteral(this.value);
    return La.test(e.value) && this.raise(e.start, "An export name cannot include a lone surrogate."), e;
  }
  return this.parseIdent(true);
}, Ya.adaptDirectivePrologue = function(e) {
  for (var t = 0; t < e.length && this.isDirectiveCandidate(e[t]); ++t)
    e[t].directive = e[t].expression.raw.slice(1, -1);
}, Ya.isDirectiveCandidate = function(e) {
  return e.type === "ExpressionStatement" && e.expression.type === "Literal" && typeof e.expression.value == "string" && (this.input[e.start] === '"' || this.input[e.start] === "'");
};
var no = Ha.prototype;
no.toAssignable = function(e, t, i) {
  if (this.options.ecmaVersion >= 6 && e)
    switch (e.type) {
      case "Identifier":
        this.inAsync && e.name === "await" && this.raise(e.start, "Cannot use 'await' as identifier inside an async function");
        break;
      case "ObjectPattern":
      case "ArrayPattern":
      case "AssignmentPattern":
      case "RestElement":
        break;
      case "ObjectExpression":
        e.type = "ObjectPattern", i && this.checkPatternErrors(i, true);
        for (var s = 0, n2 = e.properties; s < n2.length; s += 1) {
          var r2 = n2[s];
          this.toAssignable(r2, t), r2.type !== "RestElement" || r2.argument.type !== "ArrayPattern" && r2.argument.type !== "ObjectPattern" || this.raise(r2.argument.start, "Unexpected token");
        }
        break;
      case "Property":
        e.kind !== "init" && this.raise(e.key.start, "Object pattern can't contain getter or setter"), this.toAssignable(e.value, t);
        break;
      case "ArrayExpression":
        e.type = "ArrayPattern", i && this.checkPatternErrors(i, true), this.toAssignableList(e.elements, t);
        break;
      case "SpreadElement":
        e.type = "RestElement", this.toAssignable(e.argument, t), e.argument.type === "AssignmentPattern" && this.raise(e.argument.start, "Rest elements cannot have a default value");
        break;
      case "AssignmentExpression":
        e.operator !== "=" && this.raise(e.left.end, "Only '=' operator can be used for specifying default value."), e.type = "AssignmentPattern", delete e.operator, this.toAssignable(e.left, t);
        break;
      case "ParenthesizedExpression":
        this.toAssignable(e.expression, t, i);
        break;
      case "ChainExpression":
        this.raiseRecoverable(e.start, "Optional chaining cannot appear in left-hand side");
        break;
      case "MemberExpression":
        if (!t)
          break;
      default:
        this.raise(e.start, "Assigning to rvalue");
    }
  else
    i && this.checkPatternErrors(i, true);
  return e;
}, no.toAssignableList = function(e, t) {
  for (var i = e.length, s = 0; s < i; s++) {
    var n2 = e[s];
    n2 && this.toAssignable(n2, t);
  }
  if (i) {
    var r2 = e[i - 1];
    this.options.ecmaVersion === 6 && t && r2 && r2.type === "RestElement" && r2.argument.type !== "Identifier" && this.unexpected(r2.argument.start);
  }
  return e;
}, no.parseSpread = function(e) {
  var t = this.startNode();
  return this.next(), t.argument = this.parseMaybeAssign(false, e), this.finishNode(t, "SpreadElement");
}, no.parseRestBinding = function() {
  var e = this.startNode();
  return this.next(), this.options.ecmaVersion === 6 && this.type !== Aa.name && this.unexpected(), e.argument = this.parseBindingAtom(), this.finishNode(e, "RestElement");
}, no.parseBindingAtom = function() {
  if (this.options.ecmaVersion >= 6)
    switch (this.type) {
      case Aa.bracketL:
        var e = this.startNode();
        return this.next(), e.elements = this.parseBindingList(Aa.bracketR, true, true), this.finishNode(e, "ArrayPattern");
      case Aa.braceL:
        return this.parseObj(true);
    }
  return this.parseIdent();
}, no.parseBindingList = function(e, t, i) {
  for (var s = [], n2 = true; !this.eat(e); )
    if (n2 ? n2 = false : this.expect(Aa.comma), t && this.type === Aa.comma)
      s.push(null);
    else {
      if (i && this.afterTrailingComma(e))
        break;
      if (this.type === Aa.ellipsis) {
        var r2 = this.parseRestBinding();
        this.parseBindingListItem(r2), s.push(r2), this.type === Aa.comma && this.raise(this.start, "Comma is not permitted after the rest element"), this.expect(e);
        break;
      }
      var a3 = this.parseMaybeDefault(this.start, this.startLoc);
      this.parseBindingListItem(a3), s.push(a3);
    }
  return s;
}, no.parseBindingListItem = function(e) {
  return e;
}, no.parseMaybeDefault = function(e, t, i) {
  if (i = i || this.parseBindingAtom(), this.options.ecmaVersion < 6 || !this.eat(Aa.eq))
    return i;
  var s = this.startNodeAt(e, t);
  return s.left = i, s.right = this.parseMaybeAssign(), this.finishNode(s, "AssignmentPattern");
}, no.checkLValSimple = function(e, t, i) {
  t === void 0 && (t = 0);
  var s = t !== 0;
  switch (e.type) {
    case "Identifier":
      this.strict && this.reservedWordsStrictBind.test(e.name) && this.raiseRecoverable(e.start, (s ? "Binding " : "Assigning to ") + e.name + " in strict mode"), s && (t === 2 && e.name === "let" && this.raiseRecoverable(e.start, "let is disallowed as a lexically bound name"), i && (Oa(i, e.name) && this.raiseRecoverable(e.start, "Argument name clash"), i[e.name] = true), t !== 5 && this.declareName(e.name, t, e.start));
      break;
    case "ChainExpression":
      this.raiseRecoverable(e.start, "Optional chaining cannot appear in left-hand side");
      break;
    case "MemberExpression":
      s && this.raiseRecoverable(e.start, "Binding member expression");
      break;
    case "ParenthesizedExpression":
      return s && this.raiseRecoverable(e.start, "Binding parenthesized expression"), this.checkLValSimple(e.expression, t, i);
    default:
      this.raise(e.start, (s ? "Binding" : "Assigning to") + " rvalue");
  }
}, no.checkLValPattern = function(e, t, i) {
  switch (t === void 0 && (t = 0), e.type) {
    case "ObjectPattern":
      for (var s = 0, n2 = e.properties; s < n2.length; s += 1) {
        var r2 = n2[s];
        this.checkLValInnerPattern(r2, t, i);
      }
      break;
    case "ArrayPattern":
      for (var a3 = 0, o2 = e.elements; a3 < o2.length; a3 += 1) {
        var l2 = o2[a3];
        l2 && this.checkLValInnerPattern(l2, t, i);
      }
      break;
    default:
      this.checkLValSimple(e, t, i);
  }
}, no.checkLValInnerPattern = function(e, t, i) {
  switch (t === void 0 && (t = 0), e.type) {
    case "Property":
      this.checkLValInnerPattern(e.value, t, i);
      break;
    case "AssignmentPattern":
      this.checkLValPattern(e.left, t, i);
      break;
    case "RestElement":
      this.checkLValPattern(e.argument, t, i);
      break;
    default:
      this.checkLValPattern(e, t, i);
  }
};
var ro = function(e, t, i, s, n2) {
  this.token = e, this.isExpr = !!t, this.preserveSpace = !!i, this.override = s, this.generator = !!n2;
}, ao = { b_stat: new ro("{", false), b_expr: new ro("{", true), b_tmpl: new ro("${", false), p_stat: new ro("(", false), p_expr: new ro("(", true), q_tmpl: new ro("`", true, true, function(e) {
  return e.tryReadTemplateToken();
}), f_stat: new ro("function", false), f_expr: new ro("function", true), f_expr_gen: new ro("function", true, false, null, true), f_gen: new ro("function", false, false, null, true) }, oo = Ha.prototype;
oo.initialContext = function() {
  return [ao.b_stat];
}, oo.curContext = function() {
  return this.context[this.context.length - 1];
}, oo.braceIsBlock = function(e) {
  var t = this.curContext();
  return t === ao.f_expr || t === ao.f_stat || (e !== Aa.colon || t !== ao.b_stat && t !== ao.b_expr ? e === Aa._return || e === Aa.name && this.exprAllowed ? Ia.test(this.input.slice(this.lastTokEnd, this.start)) : e === Aa._else || e === Aa.semi || e === Aa.eof || e === Aa.parenR || e === Aa.arrow || (e === Aa.braceL ? t === ao.b_stat : e !== Aa._var && e !== Aa._const && e !== Aa.name && !this.exprAllowed) : !t.isExpr);
}, oo.inGeneratorContext = function() {
  for (var e = this.context.length - 1; e >= 1; e--) {
    var t = this.context[e];
    if (t.token === "function")
      return t.generator;
  }
  return false;
}, oo.updateContext = function(e) {
  var t, i = this.type;
  i.keyword && e === Aa.dot ? this.exprAllowed = false : (t = i.updateContext) ? t.call(this, e) : this.exprAllowed = i.beforeExpr;
}, oo.overrideContext = function(e) {
  this.curContext() !== e && (this.context[this.context.length - 1] = e);
}, Aa.parenR.updateContext = Aa.braceR.updateContext = function() {
  if (this.context.length !== 1) {
    var e = this.context.pop();
    e === ao.b_stat && this.curContext().token === "function" && (e = this.context.pop()), this.exprAllowed = !e.isExpr;
  } else
    this.exprAllowed = true;
}, Aa.braceL.updateContext = function(e) {
  this.context.push(this.braceIsBlock(e) ? ao.b_stat : ao.b_expr), this.exprAllowed = true;
}, Aa.dollarBraceL.updateContext = function() {
  this.context.push(ao.b_tmpl), this.exprAllowed = true;
}, Aa.parenL.updateContext = function(e) {
  var t = e === Aa._if || e === Aa._for || e === Aa._with || e === Aa._while;
  this.context.push(t ? ao.p_stat : ao.p_expr), this.exprAllowed = true;
}, Aa.incDec.updateContext = function() {
}, Aa._function.updateContext = Aa._class.updateContext = function(e) {
  !e.beforeExpr || e === Aa._else || e === Aa.semi && this.curContext() !== ao.p_stat || e === Aa._return && Ia.test(this.input.slice(this.lastTokEnd, this.start)) || (e === Aa.colon || e === Aa.braceL) && this.curContext() === ao.b_stat ? this.context.push(ao.f_stat) : this.context.push(ao.f_expr), this.exprAllowed = false;
}, Aa.backQuote.updateContext = function() {
  this.curContext() === ao.q_tmpl ? this.context.pop() : this.context.push(ao.q_tmpl), this.exprAllowed = false;
}, Aa.star.updateContext = function(e) {
  if (e === Aa._function) {
    var t = this.context.length - 1;
    this.context[t] === ao.f_expr ? this.context[t] = ao.f_expr_gen : this.context[t] = ao.f_gen;
  }
  this.exprAllowed = true;
}, Aa.name.updateContext = function(e) {
  var t = false;
  this.options.ecmaVersion >= 6 && e !== Aa.dot && (this.value === "of" && !this.exprAllowed || this.value === "yield" && this.inGeneratorContext()) && (t = true), this.exprAllowed = t;
};
var lo = Ha.prototype;
function ho(e) {
  return e.type === "MemberExpression" && e.property.type === "PrivateIdentifier" || e.type === "ChainExpression" && ho(e.expression);
}
lo.checkPropClash = function(e, t, i) {
  if (!(this.options.ecmaVersion >= 9 && e.type === "SpreadElement" || this.options.ecmaVersion >= 6 && (e.computed || e.method || e.shorthand))) {
    var s, n2 = e.key;
    switch (n2.type) {
      case "Identifier":
        s = n2.name;
        break;
      case "Literal":
        s = String(n2.value);
        break;
      default:
        return;
    }
    var r2 = e.kind;
    if (this.options.ecmaVersion >= 6)
      s === "__proto__" && r2 === "init" && (t.proto && (i ? i.doubleProto < 0 && (i.doubleProto = n2.start) : this.raiseRecoverable(n2.start, "Redefinition of __proto__ property")), t.proto = true);
    else {
      var a3 = t[s = "$" + s];
      if (a3)
        (r2 === "init" ? this.strict && a3.init || a3.get || a3.set : a3.init || a3[r2]) && this.raiseRecoverable(n2.start, "Redefinition of property");
      else
        a3 = t[s] = { init: false, get: false, set: false };
      a3[r2] = true;
    }
  }
}, lo.parseExpression = function(e, t) {
  var i = this.start, s = this.startLoc, n2 = this.parseMaybeAssign(e, t);
  if (this.type === Aa.comma) {
    var r2 = this.startNodeAt(i, s);
    for (r2.expressions = [n2]; this.eat(Aa.comma); )
      r2.expressions.push(this.parseMaybeAssign(e, t));
    return this.finishNode(r2, "SequenceExpression");
  }
  return n2;
}, lo.parseMaybeAssign = function(e, t, i) {
  if (this.isContextual("yield")) {
    if (this.inGenerator)
      return this.parseYield(e);
    this.exprAllowed = false;
  }
  var s = false, n2 = -1, r2 = -1, a3 = -1;
  t ? (n2 = t.parenthesizedAssign, r2 = t.trailingComma, a3 = t.doubleProto, t.parenthesizedAssign = t.trailingComma = -1) : (t = new Xa(), s = true);
  var o2 = this.start, l2 = this.startLoc;
  this.type !== Aa.parenL && this.type !== Aa.name || (this.potentialArrowAt = this.start, this.potentialArrowInForAwait = e === "await");
  var h2 = this.parseMaybeConditional(e, t);
  if (i && (h2 = i.call(this, h2, o2, l2)), this.type.isAssign) {
    var c2 = this.startNodeAt(o2, l2);
    return c2.operator = this.value, this.type === Aa.eq && (h2 = this.toAssignable(h2, false, t)), s || (t.parenthesizedAssign = t.trailingComma = t.doubleProto = -1), t.shorthandAssign >= h2.start && (t.shorthandAssign = -1), this.type === Aa.eq ? this.checkLValPattern(h2) : this.checkLValSimple(h2), c2.left = h2, this.next(), c2.right = this.parseMaybeAssign(e), a3 > -1 && (t.doubleProto = a3), this.finishNode(c2, "AssignmentExpression");
  }
  return s && this.checkExpressionErrors(t, true), n2 > -1 && (t.parenthesizedAssign = n2), r2 > -1 && (t.trailingComma = r2), h2;
}, lo.parseMaybeConditional = function(e, t) {
  var i = this.start, s = this.startLoc, n2 = this.parseExprOps(e, t);
  if (this.checkExpressionErrors(t))
    return n2;
  if (this.eat(Aa.question)) {
    var r2 = this.startNodeAt(i, s);
    return r2.test = n2, r2.consequent = this.parseMaybeAssign(), this.expect(Aa.colon), r2.alternate = this.parseMaybeAssign(e), this.finishNode(r2, "ConditionalExpression");
  }
  return n2;
}, lo.parseExprOps = function(e, t) {
  var i = this.start, s = this.startLoc, n2 = this.parseMaybeUnary(t, false, false, e);
  return this.checkExpressionErrors(t) || n2.start === i && n2.type === "ArrowFunctionExpression" ? n2 : this.parseExprOp(n2, i, s, -1, e);
}, lo.parseExprOp = function(e, t, i, s, n2) {
  var r2 = this.type.binop;
  if (r2 != null && (!n2 || this.type !== Aa._in) && r2 > s) {
    var a3 = this.type === Aa.logicalOR || this.type === Aa.logicalAND, o2 = this.type === Aa.coalesce;
    o2 && (r2 = Aa.logicalAND.binop);
    var l2 = this.value;
    this.next();
    var h2 = this.start, c2 = this.startLoc, u2 = this.parseExprOp(this.parseMaybeUnary(null, false, false, n2), h2, c2, r2, n2), d2 = this.buildBinary(t, i, e, u2, l2, a3 || o2);
    return (a3 && this.type === Aa.coalesce || o2 && (this.type === Aa.logicalOR || this.type === Aa.logicalAND)) && this.raiseRecoverable(this.start, "Logical expressions and coalesce expressions cannot be mixed. Wrap either by parentheses"), this.parseExprOp(d2, t, i, s, n2);
  }
  return e;
}, lo.buildBinary = function(e, t, i, s, n2, r2) {
  s.type === "PrivateIdentifier" && this.raise(s.start, "Private identifier can only be left side of binary expression");
  var a3 = this.startNodeAt(e, t);
  return a3.left = i, a3.operator = n2, a3.right = s, this.finishNode(a3, r2 ? "LogicalExpression" : "BinaryExpression");
}, lo.parseMaybeUnary = function(e, t, i, s) {
  var n2, r2 = this.start, a3 = this.startLoc;
  if (this.isContextual("await") && this.canAwait)
    n2 = this.parseAwait(s), t = true;
  else if (this.type.prefix) {
    var o2 = this.startNode(), l2 = this.type === Aa.incDec;
    o2.operator = this.value, o2.prefix = true, this.next(), o2.argument = this.parseMaybeUnary(null, true, l2, s), this.checkExpressionErrors(e, true), l2 ? this.checkLValSimple(o2.argument) : this.strict && o2.operator === "delete" && o2.argument.type === "Identifier" ? this.raiseRecoverable(o2.start, "Deleting local variable in strict mode") : o2.operator === "delete" && ho(o2.argument) ? this.raiseRecoverable(o2.start, "Private fields can not be deleted") : t = true, n2 = this.finishNode(o2, l2 ? "UpdateExpression" : "UnaryExpression");
  } else if (t || this.type !== Aa.privateId) {
    if (n2 = this.parseExprSubscripts(e, s), this.checkExpressionErrors(e))
      return n2;
    for (; this.type.postfix && !this.canInsertSemicolon(); ) {
      var h2 = this.startNodeAt(r2, a3);
      h2.operator = this.value, h2.prefix = false, h2.argument = n2, this.checkLValSimple(n2), this.next(), n2 = this.finishNode(h2, "UpdateExpression");
    }
  } else
    (s || this.privateNameStack.length === 0) && this.unexpected(), n2 = this.parsePrivateIdent(), this.type !== Aa._in && this.unexpected();
  return i || !this.eat(Aa.starstar) ? n2 : t ? void this.unexpected(this.lastTokStart) : this.buildBinary(r2, a3, n2, this.parseMaybeUnary(null, false, false, s), "**", false);
}, lo.parseExprSubscripts = function(e, t) {
  var i = this.start, s = this.startLoc, n2 = this.parseExprAtom(e, t);
  if (n2.type === "ArrowFunctionExpression" && this.input.slice(this.lastTokStart, this.lastTokEnd) !== ")")
    return n2;
  var r2 = this.parseSubscripts(n2, i, s, false, t);
  return e && r2.type === "MemberExpression" && (e.parenthesizedAssign >= r2.start && (e.parenthesizedAssign = -1), e.parenthesizedBind >= r2.start && (e.parenthesizedBind = -1), e.trailingComma >= r2.start && (e.trailingComma = -1)), r2;
}, lo.parseSubscripts = function(e, t, i, s, n2) {
  for (var r2 = this.options.ecmaVersion >= 8 && e.type === "Identifier" && e.name === "async" && this.lastTokEnd === e.end && !this.canInsertSemicolon() && e.end - e.start == 5 && this.potentialArrowAt === e.start, a3 = false; ; ) {
    var o2 = this.parseSubscript(e, t, i, s, r2, a3, n2);
    if (o2.optional && (a3 = true), o2 === e || o2.type === "ArrowFunctionExpression") {
      if (a3) {
        var l2 = this.startNodeAt(t, i);
        l2.expression = o2, o2 = this.finishNode(l2, "ChainExpression");
      }
      return o2;
    }
    e = o2;
  }
}, lo.parseSubscript = function(e, t, i, s, n2, r2, a3) {
  var o2 = this.options.ecmaVersion >= 11, l2 = o2 && this.eat(Aa.questionDot);
  s && l2 && this.raise(this.lastTokStart, "Optional chaining cannot appear in the callee of new expressions");
  var h2 = this.eat(Aa.bracketL);
  if (h2 || l2 && this.type !== Aa.parenL && this.type !== Aa.backQuote || this.eat(Aa.dot)) {
    var c2 = this.startNodeAt(t, i);
    c2.object = e, h2 ? (c2.property = this.parseExpression(), this.expect(Aa.bracketR)) : this.type === Aa.privateId && e.type !== "Super" ? c2.property = this.parsePrivateIdent() : c2.property = this.parseIdent(this.options.allowReserved !== "never"), c2.computed = !!h2, o2 && (c2.optional = l2), e = this.finishNode(c2, "MemberExpression");
  } else if (!s && this.eat(Aa.parenL)) {
    var u2 = new Xa(), d2 = this.yieldPos, p2 = this.awaitPos, f2 = this.awaitIdentPos;
    this.yieldPos = 0, this.awaitPos = 0, this.awaitIdentPos = 0;
    var m3 = this.parseExprList(Aa.parenR, this.options.ecmaVersion >= 8, false, u2);
    if (n2 && !l2 && !this.canInsertSemicolon() && this.eat(Aa.arrow))
      return this.checkPatternErrors(u2, false), this.checkYieldAwaitInDefaultParams(), this.awaitIdentPos > 0 && this.raise(this.awaitIdentPos, "Cannot use 'await' as identifier inside an async function"), this.yieldPos = d2, this.awaitPos = p2, this.awaitIdentPos = f2, this.parseArrowExpression(this.startNodeAt(t, i), m3, true, a3);
    this.checkExpressionErrors(u2, true), this.yieldPos = d2 || this.yieldPos, this.awaitPos = p2 || this.awaitPos, this.awaitIdentPos = f2 || this.awaitIdentPos;
    var g2 = this.startNodeAt(t, i);
    g2.callee = e, g2.arguments = m3, o2 && (g2.optional = l2), e = this.finishNode(g2, "CallExpression");
  } else if (this.type === Aa.backQuote) {
    (l2 || r2) && this.raise(this.start, "Optional chaining cannot appear in the tag of tagged template expressions");
    var y2 = this.startNodeAt(t, i);
    y2.tag = e, y2.quasi = this.parseTemplate({ isTagged: true }), e = this.finishNode(y2, "TaggedTemplateExpression");
  }
  return e;
}, lo.parseExprAtom = function(e, t) {
  this.type === Aa.slash && this.readRegexp();
  var i, s = this.potentialArrowAt === this.start;
  switch (this.type) {
    case Aa._super:
      return this.allowSuper || this.raise(this.start, "'super' keyword outside a method"), i = this.startNode(), this.next(), this.type !== Aa.parenL || this.allowDirectSuper || this.raise(i.start, "super() call outside constructor of a subclass"), this.type !== Aa.dot && this.type !== Aa.bracketL && this.type !== Aa.parenL && this.unexpected(), this.finishNode(i, "Super");
    case Aa._this:
      return i = this.startNode(), this.next(), this.finishNode(i, "ThisExpression");
    case Aa.name:
      var n2 = this.start, r2 = this.startLoc, a3 = this.containsEsc, o2 = this.parseIdent(false);
      if (this.options.ecmaVersion >= 8 && !a3 && o2.name === "async" && !this.canInsertSemicolon() && this.eat(Aa._function))
        return this.overrideContext(ao.f_expr), this.parseFunction(this.startNodeAt(n2, r2), 0, false, true, t);
      if (s && !this.canInsertSemicolon()) {
        if (this.eat(Aa.arrow))
          return this.parseArrowExpression(this.startNodeAt(n2, r2), [o2], false, t);
        if (this.options.ecmaVersion >= 8 && o2.name === "async" && this.type === Aa.name && !a3 && (!this.potentialArrowInForAwait || this.value !== "of" || this.containsEsc))
          return o2 = this.parseIdent(false), !this.canInsertSemicolon() && this.eat(Aa.arrow) || this.unexpected(), this.parseArrowExpression(this.startNodeAt(n2, r2), [o2], true, t);
      }
      return o2;
    case Aa.regexp:
      var l2 = this.value;
      return (i = this.parseLiteral(l2.value)).regex = { pattern: l2.pattern, flags: l2.flags }, i;
    case Aa.num:
    case Aa.string:
      return this.parseLiteral(this.value);
    case Aa._null:
    case Aa._true:
    case Aa._false:
      return (i = this.startNode()).value = this.type === Aa._null ? null : this.type === Aa._true, i.raw = this.type.keyword, this.next(), this.finishNode(i, "Literal");
    case Aa.parenL:
      var h2 = this.start, c2 = this.parseParenAndDistinguishExpression(s, t);
      return e && (e.parenthesizedAssign < 0 && !this.isSimpleAssignTarget(c2) && (e.parenthesizedAssign = h2), e.parenthesizedBind < 0 && (e.parenthesizedBind = h2)), c2;
    case Aa.bracketL:
      return i = this.startNode(), this.next(), i.elements = this.parseExprList(Aa.bracketR, true, true, e), this.finishNode(i, "ArrayExpression");
    case Aa.braceL:
      return this.overrideContext(ao.b_expr), this.parseObj(false, e);
    case Aa._function:
      return i = this.startNode(), this.next(), this.parseFunction(i, 0);
    case Aa._class:
      return this.parseClass(this.startNode(), false);
    case Aa._new:
      return this.parseNew();
    case Aa.backQuote:
      return this.parseTemplate();
    case Aa._import:
      return this.options.ecmaVersion >= 11 ? this.parseExprImport() : this.unexpected();
    default:
      this.unexpected();
  }
}, lo.parseExprImport = function() {
  var e = this.startNode();
  this.containsEsc && this.raiseRecoverable(this.start, "Escape sequence in keyword import");
  var t = this.parseIdent(true);
  switch (this.type) {
    case Aa.parenL:
      return this.parseDynamicImport(e);
    case Aa.dot:
      return e.meta = t, this.parseImportMeta(e);
    default:
      this.unexpected();
  }
}, lo.parseDynamicImport = function(e) {
  if (this.next(), e.source = this.parseMaybeAssign(), !this.eat(Aa.parenR)) {
    var t = this.start;
    this.eat(Aa.comma) && this.eat(Aa.parenR) ? this.raiseRecoverable(t, "Trailing comma is not allowed in import()") : this.unexpected(t);
  }
  return this.finishNode(e, "ImportExpression");
}, lo.parseImportMeta = function(e) {
  this.next();
  var t = this.containsEsc;
  return e.property = this.parseIdent(true), e.property.name !== "meta" && this.raiseRecoverable(e.property.start, "The only valid meta property for import is 'import.meta'"), t && this.raiseRecoverable(e.start, "'import.meta' must not contain escaped characters"), this.options.sourceType === "module" || this.options.allowImportExportEverywhere || this.raiseRecoverable(e.start, "Cannot use 'import.meta' outside a module"), this.finishNode(e, "MetaProperty");
}, lo.parseLiteral = function(e) {
  var t = this.startNode();
  return t.value = e, t.raw = this.input.slice(this.start, this.end), t.raw.charCodeAt(t.raw.length - 1) === 110 && (t.bigint = t.raw.slice(0, -1).replace(/_/g, "")), this.next(), this.finishNode(t, "Literal");
}, lo.parseParenExpression = function() {
  this.expect(Aa.parenL);
  var e = this.parseExpression();
  return this.expect(Aa.parenR), e;
}, lo.parseParenAndDistinguishExpression = function(e, t) {
  var i, s = this.start, n2 = this.startLoc, r2 = this.options.ecmaVersion >= 8;
  if (this.options.ecmaVersion >= 6) {
    this.next();
    var a3, o2 = this.start, l2 = this.startLoc, h2 = [], c2 = true, u2 = false, d2 = new Xa(), p2 = this.yieldPos, f2 = this.awaitPos;
    for (this.yieldPos = 0, this.awaitPos = 0; this.type !== Aa.parenR; ) {
      if (c2 ? c2 = false : this.expect(Aa.comma), r2 && this.afterTrailingComma(Aa.parenR, true)) {
        u2 = true;
        break;
      }
      if (this.type === Aa.ellipsis) {
        a3 = this.start, h2.push(this.parseParenItem(this.parseRestBinding())), this.type === Aa.comma && this.raise(this.start, "Comma is not permitted after the rest element");
        break;
      }
      h2.push(this.parseMaybeAssign(false, d2, this.parseParenItem));
    }
    var m3 = this.lastTokEnd, g2 = this.lastTokEndLoc;
    if (this.expect(Aa.parenR), e && !this.canInsertSemicolon() && this.eat(Aa.arrow))
      return this.checkPatternErrors(d2, false), this.checkYieldAwaitInDefaultParams(), this.yieldPos = p2, this.awaitPos = f2, this.parseParenArrowList(s, n2, h2, t);
    h2.length && !u2 || this.unexpected(this.lastTokStart), a3 && this.unexpected(a3), this.checkExpressionErrors(d2, true), this.yieldPos = p2 || this.yieldPos, this.awaitPos = f2 || this.awaitPos, h2.length > 1 ? ((i = this.startNodeAt(o2, l2)).expressions = h2, this.finishNodeAt(i, "SequenceExpression", m3, g2)) : i = h2[0];
  } else
    i = this.parseParenExpression();
  if (this.options.preserveParens) {
    var y2 = this.startNodeAt(s, n2);
    return y2.expression = i, this.finishNode(y2, "ParenthesizedExpression");
  }
  return i;
}, lo.parseParenItem = function(e) {
  return e;
}, lo.parseParenArrowList = function(e, t, i, s) {
  return this.parseArrowExpression(this.startNodeAt(e, t), i, false, s);
};
var co = [];
lo.parseNew = function() {
  this.containsEsc && this.raiseRecoverable(this.start, "Escape sequence in keyword new");
  var e = this.startNode(), t = this.parseIdent(true);
  if (this.options.ecmaVersion >= 6 && this.eat(Aa.dot)) {
    e.meta = t;
    var i = this.containsEsc;
    return e.property = this.parseIdent(true), e.property.name !== "target" && this.raiseRecoverable(e.property.start, "The only valid meta property for new is 'new.target'"), i && this.raiseRecoverable(e.start, "'new.target' must not contain escaped characters"), this.allowNewDotTarget || this.raiseRecoverable(e.start, "'new.target' can only be used in functions and class static block"), this.finishNode(e, "MetaProperty");
  }
  var s = this.start, n2 = this.startLoc, r2 = this.type === Aa._import;
  return e.callee = this.parseSubscripts(this.parseExprAtom(), s, n2, true, false), r2 && e.callee.type === "ImportExpression" && this.raise(s, "Cannot use new with import()"), this.eat(Aa.parenL) ? e.arguments = this.parseExprList(Aa.parenR, this.options.ecmaVersion >= 8, false) : e.arguments = co, this.finishNode(e, "NewExpression");
}, lo.parseTemplateElement = function(e) {
  var t = e.isTagged, i = this.startNode();
  return this.type === Aa.invalidTemplate ? (t || this.raiseRecoverable(this.start, "Bad escape sequence in untagged template literal"), i.value = { raw: this.value, cooked: null }) : i.value = { raw: this.input.slice(this.start, this.end).replace(/\r\n?/g, "\n"), cooked: this.value }, this.next(), i.tail = this.type === Aa.backQuote, this.finishNode(i, "TemplateElement");
}, lo.parseTemplate = function(e) {
  e === void 0 && (e = {});
  var t = e.isTagged;
  t === void 0 && (t = false);
  var i = this.startNode();
  this.next(), i.expressions = [];
  var s = this.parseTemplateElement({ isTagged: t });
  for (i.quasis = [s]; !s.tail; )
    this.type === Aa.eof && this.raise(this.pos, "Unterminated template literal"), this.expect(Aa.dollarBraceL), i.expressions.push(this.parseExpression()), this.expect(Aa.braceR), i.quasis.push(s = this.parseTemplateElement({ isTagged: t }));
  return this.next(), this.finishNode(i, "TemplateLiteral");
}, lo.isAsyncProp = function(e) {
  return !e.computed && e.key.type === "Identifier" && e.key.name === "async" && (this.type === Aa.name || this.type === Aa.num || this.type === Aa.string || this.type === Aa.bracketL || this.type.keyword || this.options.ecmaVersion >= 9 && this.type === Aa.star) && !Ia.test(this.input.slice(this.lastTokEnd, this.start));
}, lo.parseObj = function(e, t) {
  var i = this.startNode(), s = true, n2 = {};
  for (i.properties = [], this.next(); !this.eat(Aa.braceR); ) {
    if (s)
      s = false;
    else if (this.expect(Aa.comma), this.options.ecmaVersion >= 5 && this.afterTrailingComma(Aa.braceR))
      break;
    var r2 = this.parseProperty(e, t);
    e || this.checkPropClash(r2, n2, t), i.properties.push(r2);
  }
  return this.finishNode(i, e ? "ObjectPattern" : "ObjectExpression");
}, lo.parseProperty = function(e, t) {
  var i, s, n2, r2, a3 = this.startNode();
  if (this.options.ecmaVersion >= 9 && this.eat(Aa.ellipsis))
    return e ? (a3.argument = this.parseIdent(false), this.type === Aa.comma && this.raise(this.start, "Comma is not permitted after the rest element"), this.finishNode(a3, "RestElement")) : (this.type === Aa.parenL && t && (t.parenthesizedAssign < 0 && (t.parenthesizedAssign = this.start), t.parenthesizedBind < 0 && (t.parenthesizedBind = this.start)), a3.argument = this.parseMaybeAssign(false, t), this.type === Aa.comma && t && t.trailingComma < 0 && (t.trailingComma = this.start), this.finishNode(a3, "SpreadElement"));
  this.options.ecmaVersion >= 6 && (a3.method = false, a3.shorthand = false, (e || t) && (n2 = this.start, r2 = this.startLoc), e || (i = this.eat(Aa.star)));
  var o2 = this.containsEsc;
  return this.parsePropertyName(a3), !e && !o2 && this.options.ecmaVersion >= 8 && !i && this.isAsyncProp(a3) ? (s = true, i = this.options.ecmaVersion >= 9 && this.eat(Aa.star), this.parsePropertyName(a3, t)) : s = false, this.parsePropertyValue(a3, e, i, s, n2, r2, t, o2), this.finishNode(a3, "Property");
}, lo.parsePropertyValue = function(e, t, i, s, n2, r2, a3, o2) {
  if ((i || s) && this.type === Aa.colon && this.unexpected(), this.eat(Aa.colon))
    e.value = t ? this.parseMaybeDefault(this.start, this.startLoc) : this.parseMaybeAssign(false, a3), e.kind = "init";
  else if (this.options.ecmaVersion >= 6 && this.type === Aa.parenL)
    t && this.unexpected(), e.kind = "init", e.method = true, e.value = this.parseMethod(i, s);
  else if (t || o2 || !(this.options.ecmaVersion >= 5) || e.computed || e.key.type !== "Identifier" || e.key.name !== "get" && e.key.name !== "set" || this.type === Aa.comma || this.type === Aa.braceR || this.type === Aa.eq)
    this.options.ecmaVersion >= 6 && !e.computed && e.key.type === "Identifier" ? ((i || s) && this.unexpected(), this.checkUnreserved(e.key), e.key.name !== "await" || this.awaitIdentPos || (this.awaitIdentPos = n2), e.kind = "init", t ? e.value = this.parseMaybeDefault(n2, r2, this.copyNode(e.key)) : this.type === Aa.eq && a3 ? (a3.shorthandAssign < 0 && (a3.shorthandAssign = this.start), e.value = this.parseMaybeDefault(n2, r2, this.copyNode(e.key))) : e.value = this.copyNode(e.key), e.shorthand = true) : this.unexpected();
  else {
    (i || s) && this.unexpected(), e.kind = e.key.name, this.parsePropertyName(e), e.value = this.parseMethod(false);
    var l2 = e.kind === "get" ? 0 : 1;
    if (e.value.params.length !== l2) {
      var h2 = e.value.start;
      e.kind === "get" ? this.raiseRecoverable(h2, "getter should have no params") : this.raiseRecoverable(h2, "setter should have exactly one param");
    } else
      e.kind === "set" && e.value.params[0].type === "RestElement" && this.raiseRecoverable(e.value.params[0].start, "Setter cannot use rest params");
  }
}, lo.parsePropertyName = function(e) {
  if (this.options.ecmaVersion >= 6) {
    if (this.eat(Aa.bracketL))
      return e.computed = true, e.key = this.parseMaybeAssign(), this.expect(Aa.bracketR), e.key;
    e.computed = false;
  }
  return e.key = this.type === Aa.num || this.type === Aa.string ? this.parseExprAtom() : this.parseIdent(this.options.allowReserved !== "never");
}, lo.initFunction = function(e) {
  e.id = null, this.options.ecmaVersion >= 6 && (e.generator = e.expression = false), this.options.ecmaVersion >= 8 && (e.async = false);
}, lo.parseMethod = function(e, t, i) {
  var s = this.startNode(), n2 = this.yieldPos, r2 = this.awaitPos, a3 = this.awaitIdentPos;
  return this.initFunction(s), this.options.ecmaVersion >= 6 && (s.generator = e), this.options.ecmaVersion >= 8 && (s.async = !!t), this.yieldPos = 0, this.awaitPos = 0, this.awaitIdentPos = 0, this.enterScope(64 | Ga(t, s.generator) | (i ? 128 : 0)), this.expect(Aa.parenL), s.params = this.parseBindingList(Aa.parenR, false, this.options.ecmaVersion >= 8), this.checkYieldAwaitInDefaultParams(), this.parseFunctionBody(s, false, true, false), this.yieldPos = n2, this.awaitPos = r2, this.awaitIdentPos = a3, this.finishNode(s, "FunctionExpression");
}, lo.parseArrowExpression = function(e, t, i, s) {
  var n2 = this.yieldPos, r2 = this.awaitPos, a3 = this.awaitIdentPos;
  return this.enterScope(16 | Ga(i, false)), this.initFunction(e), this.options.ecmaVersion >= 8 && (e.async = !!i), this.yieldPos = 0, this.awaitPos = 0, this.awaitIdentPos = 0, e.params = this.toAssignableList(t, true), this.parseFunctionBody(e, true, false, s), this.yieldPos = n2, this.awaitPos = r2, this.awaitIdentPos = a3, this.finishNode(e, "ArrowFunctionExpression");
}, lo.parseFunctionBody = function(e, t, i, s) {
  var n2 = t && this.type !== Aa.braceL, r2 = this.strict, a3 = false;
  if (n2)
    e.body = this.parseMaybeAssign(s), e.expression = true, this.checkParams(e, false);
  else {
    var o2 = this.options.ecmaVersion >= 7 && !this.isSimpleParamList(e.params);
    r2 && !o2 || (a3 = this.strictDirective(this.end)) && o2 && this.raiseRecoverable(e.start, "Illegal 'use strict' directive in function with non-simple parameter list");
    var l2 = this.labels;
    this.labels = [], a3 && (this.strict = true), this.checkParams(e, !r2 && !a3 && !t && !i && this.isSimpleParamList(e.params)), this.strict && e.id && this.checkLValSimple(e.id, 5), e.body = this.parseBlock(false, void 0, a3 && !r2), e.expression = false, this.adaptDirectivePrologue(e.body.body), this.labels = l2;
  }
  this.exitScope();
}, lo.isSimpleParamList = function(e) {
  for (var t = 0, i = e; t < i.length; t += 1) {
    if (i[t].type !== "Identifier")
      return false;
  }
  return true;
}, lo.checkParams = function(e, t) {
  for (var i = /* @__PURE__ */ Object.create(null), s = 0, n2 = e.params; s < n2.length; s += 1) {
    var r2 = n2[s];
    this.checkLValInnerPattern(r2, 1, t ? null : i);
  }
}, lo.parseExprList = function(e, t, i, s) {
  for (var n2 = [], r2 = true; !this.eat(e); ) {
    if (r2)
      r2 = false;
    else if (this.expect(Aa.comma), t && this.afterTrailingComma(e))
      break;
    var a3 = void 0;
    i && this.type === Aa.comma ? a3 = null : this.type === Aa.ellipsis ? (a3 = this.parseSpread(s), s && this.type === Aa.comma && s.trailingComma < 0 && (s.trailingComma = this.start)) : a3 = this.parseMaybeAssign(false, s), n2.push(a3);
  }
  return n2;
}, lo.checkUnreserved = function(e) {
  var t = e.start, i = e.end, s = e.name;
  (this.inGenerator && s === "yield" && this.raiseRecoverable(t, "Cannot use 'yield' as identifier inside a generator"), this.inAsync && s === "await" && this.raiseRecoverable(t, "Cannot use 'await' as identifier inside an async function"), this.currentThisScope().inClassFieldInit && s === "arguments" && this.raiseRecoverable(t, "Cannot use 'arguments' in class field initializer"), !this.inClassStaticBlock || s !== "arguments" && s !== "await" || this.raise(t, "Cannot use " + s + " in class static initialization block"), this.keywords.test(s) && this.raise(t, "Unexpected keyword '" + s + "'"), this.options.ecmaVersion < 6 && this.input.slice(t, i).indexOf("\\") !== -1) || (this.strict ? this.reservedWordsStrict : this.reservedWords).test(s) && (this.inAsync || s !== "await" || this.raiseRecoverable(t, "Cannot use keyword 'await' outside an async function"), this.raiseRecoverable(t, "The keyword '" + s + "' is reserved"));
}, lo.parseIdent = function(e, t) {
  var i = this.startNode();
  return this.type === Aa.name ? i.name = this.value : this.type.keyword ? (i.name = this.type.keyword, i.name !== "class" && i.name !== "function" || this.lastTokEnd === this.lastTokStart + 1 && this.input.charCodeAt(this.lastTokStart) === 46 || this.context.pop()) : this.unexpected(), this.next(!!e), this.finishNode(i, "Identifier"), e || (this.checkUnreserved(i), i.name !== "await" || this.awaitIdentPos || (this.awaitIdentPos = i.start)), i;
}, lo.parsePrivateIdent = function() {
  var e = this.startNode();
  return this.type === Aa.privateId ? e.name = this.value : this.unexpected(), this.next(), this.finishNode(e, "PrivateIdentifier"), this.privateNameStack.length === 0 ? this.raise(e.start, "Private field '#" + e.name + "' must be declared in an enclosing class") : this.privateNameStack[this.privateNameStack.length - 1].used.push(e), e;
}, lo.parseYield = function(e) {
  this.yieldPos || (this.yieldPos = this.start);
  var t = this.startNode();
  return this.next(), this.type === Aa.semi || this.canInsertSemicolon() || this.type !== Aa.star && !this.type.startsExpr ? (t.delegate = false, t.argument = null) : (t.delegate = this.eat(Aa.star), t.argument = this.parseMaybeAssign(e)), this.finishNode(t, "YieldExpression");
}, lo.parseAwait = function(e) {
  this.awaitPos || (this.awaitPos = this.start);
  var t = this.startNode();
  return this.next(), t.argument = this.parseMaybeUnary(null, true, false, e), this.finishNode(t, "AwaitExpression");
};
var uo = Ha.prototype;
uo.raise = function(e, t) {
  var i = Fa(this.input, e);
  t += " (" + i.line + ":" + i.column + ")";
  var s = new SyntaxError(t);
  throw s.pos = e, s.loc = i, s.raisedAt = this.pos, s;
}, uo.raiseRecoverable = uo.raise, uo.curPosition = function() {
  if (this.options.locations)
    return new Va(this.curLine, this.pos - this.lineStart);
};
var po = Ha.prototype, fo = function(e) {
  this.flags = e, this.var = [], this.lexical = [], this.functions = [], this.inClassFieldInit = false;
};
po.enterScope = function(e) {
  this.scopeStack.push(new fo(e));
}, po.exitScope = function() {
  this.scopeStack.pop();
}, po.treatFunctionsAsVarInScope = function(e) {
  return 2 & e.flags || !this.inModule && 1 & e.flags;
}, po.declareName = function(e, t, i) {
  var s = false;
  if (t === 2) {
    var n2 = this.currentScope();
    s = n2.lexical.indexOf(e) > -1 || n2.functions.indexOf(e) > -1 || n2.var.indexOf(e) > -1, n2.lexical.push(e), this.inModule && 1 & n2.flags && delete this.undefinedExports[e];
  } else if (t === 4) {
    this.currentScope().lexical.push(e);
  } else if (t === 3) {
    var r2 = this.currentScope();
    s = this.treatFunctionsAsVar ? r2.lexical.indexOf(e) > -1 : r2.lexical.indexOf(e) > -1 || r2.var.indexOf(e) > -1, r2.functions.push(e);
  } else
    for (var a3 = this.scopeStack.length - 1; a3 >= 0; --a3) {
      var o2 = this.scopeStack[a3];
      if (o2.lexical.indexOf(e) > -1 && !(32 & o2.flags && o2.lexical[0] === e) || !this.treatFunctionsAsVarInScope(o2) && o2.functions.indexOf(e) > -1) {
        s = true;
        break;
      }
      if (o2.var.push(e), this.inModule && 1 & o2.flags && delete this.undefinedExports[e], 259 & o2.flags)
        break;
    }
  s && this.raiseRecoverable(i, "Identifier '" + e + "' has already been declared");
}, po.checkLocalExport = function(e) {
  this.scopeStack[0].lexical.indexOf(e.name) === -1 && this.scopeStack[0].var.indexOf(e.name) === -1 && (this.undefinedExports[e.name] = e);
}, po.currentScope = function() {
  return this.scopeStack[this.scopeStack.length - 1];
}, po.currentVarScope = function() {
  for (var e = this.scopeStack.length - 1; ; e--) {
    var t = this.scopeStack[e];
    if (259 & t.flags)
      return t;
  }
}, po.currentThisScope = function() {
  for (var e = this.scopeStack.length - 1; ; e--) {
    var t = this.scopeStack[e];
    if (259 & t.flags && !(16 & t.flags))
      return t;
  }
};
var mo = function(e, t, i) {
  this.type = "", this.start = t, this.end = 0, e.options.locations && (this.loc = new Ba(e, i)), e.options.directSourceFile && (this.sourceFile = e.options.directSourceFile), e.options.ranges && (this.range = [t, 0]);
}, go = Ha.prototype;
function yo(e, t, i, s) {
  return e.type = t, e.end = i, this.options.locations && (e.loc.end = s), this.options.ranges && (e.range[1] = i), e;
}
go.startNode = function() {
  return new mo(this, this.start, this.startLoc);
}, go.startNodeAt = function(e, t) {
  return new mo(this, e, t);
}, go.finishNode = function(e, t) {
  return yo.call(this, e, t, this.lastTokEnd, this.lastTokEndLoc);
}, go.finishNodeAt = function(e, t, i, s) {
  return yo.call(this, e, t, i, s);
}, go.copyNode = function(e) {
  var t = new mo(this, e.start, this.startLoc);
  for (var i in e)
    t[i] = e[i];
  return t;
};
var xo = "ASCII ASCII_Hex_Digit AHex Alphabetic Alpha Any Assigned Bidi_Control Bidi_C Bidi_Mirrored Bidi_M Case_Ignorable CI Cased Changes_When_Casefolded CWCF Changes_When_Casemapped CWCM Changes_When_Lowercased CWL Changes_When_NFKC_Casefolded CWKCF Changes_When_Titlecased CWT Changes_When_Uppercased CWU Dash Default_Ignorable_Code_Point DI Deprecated Dep Diacritic Dia Emoji Emoji_Component Emoji_Modifier Emoji_Modifier_Base Emoji_Presentation Extender Ext Grapheme_Base Gr_Base Grapheme_Extend Gr_Ext Hex_Digit Hex IDS_Binary_Operator IDSB IDS_Trinary_Operator IDST ID_Continue IDC ID_Start IDS Ideographic Ideo Join_Control Join_C Logical_Order_Exception LOE Lowercase Lower Math Noncharacter_Code_Point NChar Pattern_Syntax Pat_Syn Pattern_White_Space Pat_WS Quotation_Mark QMark Radical Regional_Indicator RI Sentence_Terminal STerm Soft_Dotted SD Terminal_Punctuation Term Unified_Ideograph UIdeo Uppercase Upper Variation_Selector VS White_Space space XID_Continue XIDC XID_Start XIDS", Eo = xo + " Extended_Pictographic", bo = Eo + " EBase EComp EMod EPres ExtPict", vo = { 9: xo, 10: Eo, 11: Eo, 12: bo, 13: "ASCII ASCII_Hex_Digit AHex Alphabetic Alpha Any Assigned Bidi_Control Bidi_C Bidi_Mirrored Bidi_M Case_Ignorable CI Cased Changes_When_Casefolded CWCF Changes_When_Casemapped CWCM Changes_When_Lowercased CWL Changes_When_NFKC_Casefolded CWKCF Changes_When_Titlecased CWT Changes_When_Uppercased CWU Dash Default_Ignorable_Code_Point DI Deprecated Dep Diacritic Dia Emoji Emoji_Component Emoji_Modifier Emoji_Modifier_Base Emoji_Presentation Extender Ext Grapheme_Base Gr_Base Grapheme_Extend Gr_Ext Hex_Digit Hex IDS_Binary_Operator IDSB IDS_Trinary_Operator IDST ID_Continue IDC ID_Start IDS Ideographic Ideo Join_Control Join_C Logical_Order_Exception LOE Lowercase Lower Math Noncharacter_Code_Point NChar Pattern_Syntax Pat_Syn Pattern_White_Space Pat_WS Quotation_Mark QMark Radical Regional_Indicator RI Sentence_Terminal STerm Soft_Dotted SD Terminal_Punctuation Term Unified_Ideograph UIdeo Uppercase Upper Variation_Selector VS White_Space space XID_Continue XIDC XID_Start XIDS Extended_Pictographic EBase EComp EMod EPres ExtPict" }, So = "Cased_Letter LC Close_Punctuation Pe Connector_Punctuation Pc Control Cc cntrl Currency_Symbol Sc Dash_Punctuation Pd Decimal_Number Nd digit Enclosing_Mark Me Final_Punctuation Pf Format Cf Initial_Punctuation Pi Letter L Letter_Number Nl Line_Separator Zl Lowercase_Letter Ll Mark M Combining_Mark Math_Symbol Sm Modifier_Letter Lm Modifier_Symbol Sk Nonspacing_Mark Mn Number N Open_Punctuation Ps Other C Other_Letter Lo Other_Number No Other_Punctuation Po Other_Symbol So Paragraph_Separator Zp Private_Use Co Punctuation P punct Separator Z Space_Separator Zs Spacing_Mark Mc Surrogate Cs Symbol S Titlecase_Letter Lt Unassigned Cn Uppercase_Letter Lu", Ao = "Adlam Adlm Ahom Anatolian_Hieroglyphs Hluw Arabic Arab Armenian Armn Avestan Avst Balinese Bali Bamum Bamu Bassa_Vah Bass Batak Batk Bengali Beng Bhaiksuki Bhks Bopomofo Bopo Brahmi Brah Braille Brai Buginese Bugi Buhid Buhd Canadian_Aboriginal Cans Carian Cari Caucasian_Albanian Aghb Chakma Cakm Cham Cham Cherokee Cher Common Zyyy Coptic Copt Qaac Cuneiform Xsux Cypriot Cprt Cyrillic Cyrl Deseret Dsrt Devanagari Deva Duployan Dupl Egyptian_Hieroglyphs Egyp Elbasan Elba Ethiopic Ethi Georgian Geor Glagolitic Glag Gothic Goth Grantha Gran Greek Grek Gujarati Gujr Gurmukhi Guru Han Hani Hangul Hang Hanunoo Hano Hatran Hatr Hebrew Hebr Hiragana Hira Imperial_Aramaic Armi Inherited Zinh Qaai Inscriptional_Pahlavi Phli Inscriptional_Parthian Prti Javanese Java Kaithi Kthi Kannada Knda Katakana Kana Kayah_Li Kali Kharoshthi Khar Khmer Khmr Khojki Khoj Khudawadi Sind Lao Laoo Latin Latn Lepcha Lepc Limbu Limb Linear_A Lina Linear_B Linb Lisu Lisu Lycian Lyci Lydian Lydi Mahajani Mahj Malayalam Mlym Mandaic Mand Manichaean Mani Marchen Marc Masaram_Gondi Gonm Meetei_Mayek Mtei Mende_Kikakui Mend Meroitic_Cursive Merc Meroitic_Hieroglyphs Mero Miao Plrd Modi Mongolian Mong Mro Mroo Multani Mult Myanmar Mymr Nabataean Nbat New_Tai_Lue Talu Newa Newa Nko Nkoo Nushu Nshu Ogham Ogam Ol_Chiki Olck Old_Hungarian Hung Old_Italic Ital Old_North_Arabian Narb Old_Permic Perm Old_Persian Xpeo Old_South_Arabian Sarb Old_Turkic Orkh Oriya Orya Osage Osge Osmanya Osma Pahawh_Hmong Hmng Palmyrene Palm Pau_Cin_Hau Pauc Phags_Pa Phag Phoenician Phnx Psalter_Pahlavi Phlp Rejang Rjng Runic Runr Samaritan Samr Saurashtra Saur Sharada Shrd Shavian Shaw Siddham Sidd SignWriting Sgnw Sinhala Sinh Sora_Sompeng Sora Soyombo Soyo Sundanese Sund Syloti_Nagri Sylo Syriac Syrc Tagalog Tglg Tagbanwa Tagb Tai_Le Tale Tai_Tham Lana Tai_Viet Tavt Takri Takr Tamil Taml Tangut Tang Telugu Telu Thaana Thaa Thai Thai Tibetan Tibt Tifinagh Tfng Tirhuta Tirh Ugaritic Ugar Vai Vaii Warang_Citi Wara Yi Yiii Zanabazar_Square Zanb", Io = Ao + " Dogra Dogr Gunjala_Gondi Gong Hanifi_Rohingya Rohg Makasar Maka Medefaidrin Medf Old_Sogdian Sogo Sogdian Sogd", ko = Io + " Elymaic Elym Nandinagari Nand Nyiakeng_Puachue_Hmong Hmnp Wancho Wcho", Po = ko + " Chorasmian Chrs Diak Dives_Akuru Khitan_Small_Script Kits Yezi Yezidi", wo = { 9: Ao, 10: Io, 11: ko, 12: Po, 13: "Adlam Adlm Ahom Anatolian_Hieroglyphs Hluw Arabic Arab Armenian Armn Avestan Avst Balinese Bali Bamum Bamu Bassa_Vah Bass Batak Batk Bengali Beng Bhaiksuki Bhks Bopomofo Bopo Brahmi Brah Braille Brai Buginese Bugi Buhid Buhd Canadian_Aboriginal Cans Carian Cari Caucasian_Albanian Aghb Chakma Cakm Cham Cham Cherokee Cher Common Zyyy Coptic Copt Qaac Cuneiform Xsux Cypriot Cprt Cyrillic Cyrl Deseret Dsrt Devanagari Deva Duployan Dupl Egyptian_Hieroglyphs Egyp Elbasan Elba Ethiopic Ethi Georgian Geor Glagolitic Glag Gothic Goth Grantha Gran Greek Grek Gujarati Gujr Gurmukhi Guru Han Hani Hangul Hang Hanunoo Hano Hatran Hatr Hebrew Hebr Hiragana Hira Imperial_Aramaic Armi Inherited Zinh Qaai Inscriptional_Pahlavi Phli Inscriptional_Parthian Prti Javanese Java Kaithi Kthi Kannada Knda Katakana Kana Kayah_Li Kali Kharoshthi Khar Khmer Khmr Khojki Khoj Khudawadi Sind Lao Laoo Latin Latn Lepcha Lepc Limbu Limb Linear_A Lina Linear_B Linb Lisu Lisu Lycian Lyci Lydian Lydi Mahajani Mahj Malayalam Mlym Mandaic Mand Manichaean Mani Marchen Marc Masaram_Gondi Gonm Meetei_Mayek Mtei Mende_Kikakui Mend Meroitic_Cursive Merc Meroitic_Hieroglyphs Mero Miao Plrd Modi Mongolian Mong Mro Mroo Multani Mult Myanmar Mymr Nabataean Nbat New_Tai_Lue Talu Newa Newa Nko Nkoo Nushu Nshu Ogham Ogam Ol_Chiki Olck Old_Hungarian Hung Old_Italic Ital Old_North_Arabian Narb Old_Permic Perm Old_Persian Xpeo Old_South_Arabian Sarb Old_Turkic Orkh Oriya Orya Osage Osge Osmanya Osma Pahawh_Hmong Hmng Palmyrene Palm Pau_Cin_Hau Pauc Phags_Pa Phag Phoenician Phnx Psalter_Pahlavi Phlp Rejang Rjng Runic Runr Samaritan Samr Saurashtra Saur Sharada Shrd Shavian Shaw Siddham Sidd SignWriting Sgnw Sinhala Sinh Sora_Sompeng Sora Soyombo Soyo Sundanese Sund Syloti_Nagri Sylo Syriac Syrc Tagalog Tglg Tagbanwa Tagb Tai_Le Tale Tai_Tham Lana Tai_Viet Tavt Takri Takr Tamil Taml Tangut Tang Telugu Telu Thaana Thaa Thai Thai Tibetan Tibt Tifinagh Tfng Tirhuta Tirh Ugaritic Ugar Vai Vaii Warang_Citi Wara Yi Yiii Zanabazar_Square Zanb Dogra Dogr Gunjala_Gondi Gong Hanifi_Rohingya Rohg Makasar Maka Medefaidrin Medf Old_Sogdian Sogo Sogdian Sogd Elymaic Elym Nandinagari Nand Nyiakeng_Puachue_Hmong Hmnp Wancho Wcho Chorasmian Chrs Diak Dives_Akuru Khitan_Small_Script Kits Yezi Yezidi Cypro_Minoan Cpmn Old_Uyghur Ougr Tangsa Tnsa Toto Vithkuqi Vith" }, Co = {};
function _o(e) {
  var t = Co[e] = { binary: Ma(vo[e] + " " + So), nonBinary: { General_Category: Ma(So), Script: Ma(wo[e]) } };
  t.nonBinary.Script_Extensions = t.nonBinary.Script, t.nonBinary.gc = t.nonBinary.General_Category, t.nonBinary.sc = t.nonBinary.Script, t.nonBinary.scx = t.nonBinary.Script_Extensions;
}
for (var No = 0, $o = [9, 10, 11, 12, 13]; No < $o.length; No += 1) {
  _o($o[No]);
}
var To = Ha.prototype, Oo = function(e) {
  this.parser = e, this.validFlags = "gim" + (e.options.ecmaVersion >= 6 ? "uy" : "") + (e.options.ecmaVersion >= 9 ? "s" : "") + (e.options.ecmaVersion >= 13 ? "d" : ""), this.unicodeProperties = Co[e.options.ecmaVersion >= 13 ? 13 : e.options.ecmaVersion], this.source = "", this.flags = "", this.start = 0, this.switchU = false, this.switchN = false, this.pos = 0, this.lastIntValue = 0, this.lastStringValue = "", this.lastAssertionIsQuantifiable = false, this.numCapturingParens = 0, this.maxBackReference = 0, this.groupNames = [], this.backReferenceNames = [];
};
function Ro(e) {
  return e === 36 || e >= 40 && e <= 43 || e === 46 || e === 63 || e >= 91 && e <= 94 || e >= 123 && e <= 125;
}
function Mo(e) {
  return e >= 65 && e <= 90 || e >= 97 && e <= 122;
}
function Do(e) {
  return Mo(e) || e === 95;
}
function Lo(e) {
  return Do(e) || Vo(e);
}
function Vo(e) {
  return e >= 48 && e <= 57;
}
function Bo(e) {
  return e >= 48 && e <= 57 || e >= 65 && e <= 70 || e >= 97 && e <= 102;
}
function Fo(e) {
  return e >= 65 && e <= 70 ? e - 65 + 10 : e >= 97 && e <= 102 ? e - 97 + 10 : e - 48;
}
function zo(e) {
  return e >= 48 && e <= 55;
}
Oo.prototype.reset = function(e, t, i) {
  var s = i.indexOf("u") !== -1;
  this.start = 0 | e, this.source = t + "", this.flags = i, this.switchU = s && this.parser.options.ecmaVersion >= 6, this.switchN = s && this.parser.options.ecmaVersion >= 9;
}, Oo.prototype.raise = function(e) {
  this.parser.raiseRecoverable(this.start, "Invalid regular expression: /" + this.source + "/: " + e);
}, Oo.prototype.at = function(e, t) {
  t === void 0 && (t = false);
  var i = this.source, s = i.length;
  if (e >= s)
    return -1;
  var n2 = i.charCodeAt(e);
  if (!t && !this.switchU || n2 <= 55295 || n2 >= 57344 || e + 1 >= s)
    return n2;
  var r2 = i.charCodeAt(e + 1);
  return r2 >= 56320 && r2 <= 57343 ? (n2 << 10) + r2 - 56613888 : n2;
}, Oo.prototype.nextIndex = function(e, t) {
  t === void 0 && (t = false);
  var i = this.source, s = i.length;
  if (e >= s)
    return s;
  var n2, r2 = i.charCodeAt(e);
  return !t && !this.switchU || r2 <= 55295 || r2 >= 57344 || e + 1 >= s || (n2 = i.charCodeAt(e + 1)) < 56320 || n2 > 57343 ? e + 1 : e + 2;
}, Oo.prototype.current = function(e) {
  return e === void 0 && (e = false), this.at(this.pos, e);
}, Oo.prototype.lookahead = function(e) {
  return e === void 0 && (e = false), this.at(this.nextIndex(this.pos, e), e);
}, Oo.prototype.advance = function(e) {
  e === void 0 && (e = false), this.pos = this.nextIndex(this.pos, e);
}, Oo.prototype.eat = function(e, t) {
  return t === void 0 && (t = false), this.current(t) === e && (this.advance(t), true);
}, To.validateRegExpFlags = function(e) {
  for (var t = e.validFlags, i = e.flags, s = 0; s < i.length; s++) {
    var n2 = i.charAt(s);
    t.indexOf(n2) === -1 && this.raise(e.start, "Invalid regular expression flag"), i.indexOf(n2, s + 1) > -1 && this.raise(e.start, "Duplicate regular expression flag");
  }
}, To.validateRegExpPattern = function(e) {
  this.regexp_pattern(e), !e.switchN && this.options.ecmaVersion >= 9 && e.groupNames.length > 0 && (e.switchN = true, this.regexp_pattern(e));
}, To.regexp_pattern = function(e) {
  e.pos = 0, e.lastIntValue = 0, e.lastStringValue = "", e.lastAssertionIsQuantifiable = false, e.numCapturingParens = 0, e.maxBackReference = 0, e.groupNames.length = 0, e.backReferenceNames.length = 0, this.regexp_disjunction(e), e.pos !== e.source.length && (e.eat(41) && e.raise("Unmatched ')'"), (e.eat(93) || e.eat(125)) && e.raise("Lone quantifier brackets")), e.maxBackReference > e.numCapturingParens && e.raise("Invalid escape");
  for (var t = 0, i = e.backReferenceNames; t < i.length; t += 1) {
    var s = i[t];
    e.groupNames.indexOf(s) === -1 && e.raise("Invalid named capture referenced");
  }
}, To.regexp_disjunction = function(e) {
  for (this.regexp_alternative(e); e.eat(124); )
    this.regexp_alternative(e);
  this.regexp_eatQuantifier(e, true) && e.raise("Nothing to repeat"), e.eat(123) && e.raise("Lone quantifier brackets");
}, To.regexp_alternative = function(e) {
  for (; e.pos < e.source.length && this.regexp_eatTerm(e); )
    ;
}, To.regexp_eatTerm = function(e) {
  return this.regexp_eatAssertion(e) ? (e.lastAssertionIsQuantifiable && this.regexp_eatQuantifier(e) && e.switchU && e.raise("Invalid quantifier"), true) : !!(e.switchU ? this.regexp_eatAtom(e) : this.regexp_eatExtendedAtom(e)) && (this.regexp_eatQuantifier(e), true);
}, To.regexp_eatAssertion = function(e) {
  var t = e.pos;
  if (e.lastAssertionIsQuantifiable = false, e.eat(94) || e.eat(36))
    return true;
  if (e.eat(92)) {
    if (e.eat(66) || e.eat(98))
      return true;
    e.pos = t;
  }
  if (e.eat(40) && e.eat(63)) {
    var i = false;
    if (this.options.ecmaVersion >= 9 && (i = e.eat(60)), e.eat(61) || e.eat(33))
      return this.regexp_disjunction(e), e.eat(41) || e.raise("Unterminated group"), e.lastAssertionIsQuantifiable = !i, true;
  }
  return e.pos = t, false;
}, To.regexp_eatQuantifier = function(e, t) {
  return t === void 0 && (t = false), !!this.regexp_eatQuantifierPrefix(e, t) && (e.eat(63), true);
}, To.regexp_eatQuantifierPrefix = function(e, t) {
  return e.eat(42) || e.eat(43) || e.eat(63) || this.regexp_eatBracedQuantifier(e, t);
}, To.regexp_eatBracedQuantifier = function(e, t) {
  var i = e.pos;
  if (e.eat(123)) {
    var s = 0, n2 = -1;
    if (this.regexp_eatDecimalDigits(e) && (s = e.lastIntValue, e.eat(44) && this.regexp_eatDecimalDigits(e) && (n2 = e.lastIntValue), e.eat(125)))
      return n2 !== -1 && n2 < s && !t && e.raise("numbers out of order in {} quantifier"), true;
    e.switchU && !t && e.raise("Incomplete quantifier"), e.pos = i;
  }
  return false;
}, To.regexp_eatAtom = function(e) {
  return this.regexp_eatPatternCharacters(e) || e.eat(46) || this.regexp_eatReverseSolidusAtomEscape(e) || this.regexp_eatCharacterClass(e) || this.regexp_eatUncapturingGroup(e) || this.regexp_eatCapturingGroup(e);
}, To.regexp_eatReverseSolidusAtomEscape = function(e) {
  var t = e.pos;
  if (e.eat(92)) {
    if (this.regexp_eatAtomEscape(e))
      return true;
    e.pos = t;
  }
  return false;
}, To.regexp_eatUncapturingGroup = function(e) {
  var t = e.pos;
  if (e.eat(40)) {
    if (e.eat(63) && e.eat(58)) {
      if (this.regexp_disjunction(e), e.eat(41))
        return true;
      e.raise("Unterminated group");
    }
    e.pos = t;
  }
  return false;
}, To.regexp_eatCapturingGroup = function(e) {
  if (e.eat(40)) {
    if (this.options.ecmaVersion >= 9 ? this.regexp_groupSpecifier(e) : e.current() === 63 && e.raise("Invalid group"), this.regexp_disjunction(e), e.eat(41))
      return e.numCapturingParens += 1, true;
    e.raise("Unterminated group");
  }
  return false;
}, To.regexp_eatExtendedAtom = function(e) {
  return e.eat(46) || this.regexp_eatReverseSolidusAtomEscape(e) || this.regexp_eatCharacterClass(e) || this.regexp_eatUncapturingGroup(e) || this.regexp_eatCapturingGroup(e) || this.regexp_eatInvalidBracedQuantifier(e) || this.regexp_eatExtendedPatternCharacter(e);
}, To.regexp_eatInvalidBracedQuantifier = function(e) {
  return this.regexp_eatBracedQuantifier(e, true) && e.raise("Nothing to repeat"), false;
}, To.regexp_eatSyntaxCharacter = function(e) {
  var t = e.current();
  return !!Ro(t) && (e.lastIntValue = t, e.advance(), true);
}, To.regexp_eatPatternCharacters = function(e) {
  for (var t = e.pos, i = 0; (i = e.current()) !== -1 && !Ro(i); )
    e.advance();
  return e.pos !== t;
}, To.regexp_eatExtendedPatternCharacter = function(e) {
  var t = e.current();
  return !(t === -1 || t === 36 || t >= 40 && t <= 43 || t === 46 || t === 63 || t === 91 || t === 94 || t === 124) && (e.advance(), true);
}, To.regexp_groupSpecifier = function(e) {
  if (e.eat(63)) {
    if (this.regexp_eatGroupName(e))
      return e.groupNames.indexOf(e.lastStringValue) !== -1 && e.raise("Duplicate capture group name"), void e.groupNames.push(e.lastStringValue);
    e.raise("Invalid group");
  }
}, To.regexp_eatGroupName = function(e) {
  if (e.lastStringValue = "", e.eat(60)) {
    if (this.regexp_eatRegExpIdentifierName(e) && e.eat(62))
      return true;
    e.raise("Invalid capture group name");
  }
  return false;
}, To.regexp_eatRegExpIdentifierName = function(e) {
  if (e.lastStringValue = "", this.regexp_eatRegExpIdentifierStart(e)) {
    for (e.lastStringValue += Da(e.lastIntValue); this.regexp_eatRegExpIdentifierPart(e); )
      e.lastStringValue += Da(e.lastIntValue);
    return true;
  }
  return false;
}, To.regexp_eatRegExpIdentifierStart = function(e) {
  var t = e.pos, i = this.options.ecmaVersion >= 11, s = e.current(i);
  return e.advance(i), s === 92 && this.regexp_eatRegExpUnicodeEscapeSequence(e, i) && (s = e.lastIntValue), function(e2) {
    return ma(e2, true) || e2 === 36 || e2 === 95;
  }(s) ? (e.lastIntValue = s, true) : (e.pos = t, false);
}, To.regexp_eatRegExpIdentifierPart = function(e) {
  var t = e.pos, i = this.options.ecmaVersion >= 11, s = e.current(i);
  return e.advance(i), s === 92 && this.regexp_eatRegExpUnicodeEscapeSequence(e, i) && (s = e.lastIntValue), function(e2) {
    return ga(e2, true) || e2 === 36 || e2 === 95 || e2 === 8204 || e2 === 8205;
  }(s) ? (e.lastIntValue = s, true) : (e.pos = t, false);
}, To.regexp_eatAtomEscape = function(e) {
  return !!(this.regexp_eatBackReference(e) || this.regexp_eatCharacterClassEscape(e) || this.regexp_eatCharacterEscape(e) || e.switchN && this.regexp_eatKGroupName(e)) || (e.switchU && (e.current() === 99 && e.raise("Invalid unicode escape"), e.raise("Invalid escape")), false);
}, To.regexp_eatBackReference = function(e) {
  var t = e.pos;
  if (this.regexp_eatDecimalEscape(e)) {
    var i = e.lastIntValue;
    if (e.switchU)
      return i > e.maxBackReference && (e.maxBackReference = i), true;
    if (i <= e.numCapturingParens)
      return true;
    e.pos = t;
  }
  return false;
}, To.regexp_eatKGroupName = function(e) {
  if (e.eat(107)) {
    if (this.regexp_eatGroupName(e))
      return e.backReferenceNames.push(e.lastStringValue), true;
    e.raise("Invalid named reference");
  }
  return false;
}, To.regexp_eatCharacterEscape = function(e) {
  return this.regexp_eatControlEscape(e) || this.regexp_eatCControlLetter(e) || this.regexp_eatZero(e) || this.regexp_eatHexEscapeSequence(e) || this.regexp_eatRegExpUnicodeEscapeSequence(e, false) || !e.switchU && this.regexp_eatLegacyOctalEscapeSequence(e) || this.regexp_eatIdentityEscape(e);
}, To.regexp_eatCControlLetter = function(e) {
  var t = e.pos;
  if (e.eat(99)) {
    if (this.regexp_eatControlLetter(e))
      return true;
    e.pos = t;
  }
  return false;
}, To.regexp_eatZero = function(e) {
  return e.current() === 48 && !Vo(e.lookahead()) && (e.lastIntValue = 0, e.advance(), true);
}, To.regexp_eatControlEscape = function(e) {
  var t = e.current();
  return t === 116 ? (e.lastIntValue = 9, e.advance(), true) : t === 110 ? (e.lastIntValue = 10, e.advance(), true) : t === 118 ? (e.lastIntValue = 11, e.advance(), true) : t === 102 ? (e.lastIntValue = 12, e.advance(), true) : t === 114 && (e.lastIntValue = 13, e.advance(), true);
}, To.regexp_eatControlLetter = function(e) {
  var t = e.current();
  return !!Mo(t) && (e.lastIntValue = t % 32, e.advance(), true);
}, To.regexp_eatRegExpUnicodeEscapeSequence = function(e, t) {
  t === void 0 && (t = false);
  var i, s = e.pos, n2 = t || e.switchU;
  if (e.eat(117)) {
    if (this.regexp_eatFixedHexDigits(e, 4)) {
      var r2 = e.lastIntValue;
      if (n2 && r2 >= 55296 && r2 <= 56319) {
        var a3 = e.pos;
        if (e.eat(92) && e.eat(117) && this.regexp_eatFixedHexDigits(e, 4)) {
          var o2 = e.lastIntValue;
          if (o2 >= 56320 && o2 <= 57343)
            return e.lastIntValue = 1024 * (r2 - 55296) + (o2 - 56320) + 65536, true;
        }
        e.pos = a3, e.lastIntValue = r2;
      }
      return true;
    }
    if (n2 && e.eat(123) && this.regexp_eatHexDigits(e) && e.eat(125) && ((i = e.lastIntValue) >= 0 && i <= 1114111))
      return true;
    n2 && e.raise("Invalid unicode escape"), e.pos = s;
  }
  return false;
}, To.regexp_eatIdentityEscape = function(e) {
  if (e.switchU)
    return !!this.regexp_eatSyntaxCharacter(e) || !!e.eat(47) && (e.lastIntValue = 47, true);
  var t = e.current();
  return !(t === 99 || e.switchN && t === 107) && (e.lastIntValue = t, e.advance(), true);
}, To.regexp_eatDecimalEscape = function(e) {
  e.lastIntValue = 0;
  var t = e.current();
  if (t >= 49 && t <= 57) {
    do {
      e.lastIntValue = 10 * e.lastIntValue + (t - 48), e.advance();
    } while ((t = e.current()) >= 48 && t <= 57);
    return true;
  }
  return false;
}, To.regexp_eatCharacterClassEscape = function(e) {
  var t = e.current();
  if (function(e2) {
    return e2 === 100 || e2 === 68 || e2 === 115 || e2 === 83 || e2 === 119 || e2 === 87;
  }(t))
    return e.lastIntValue = -1, e.advance(), true;
  if (e.switchU && this.options.ecmaVersion >= 9 && (t === 80 || t === 112)) {
    if (e.lastIntValue = -1, e.advance(), e.eat(123) && this.regexp_eatUnicodePropertyValueExpression(e) && e.eat(125))
      return true;
    e.raise("Invalid property name");
  }
  return false;
}, To.regexp_eatUnicodePropertyValueExpression = function(e) {
  var t = e.pos;
  if (this.regexp_eatUnicodePropertyName(e) && e.eat(61)) {
    var i = e.lastStringValue;
    if (this.regexp_eatUnicodePropertyValue(e)) {
      var s = e.lastStringValue;
      return this.regexp_validateUnicodePropertyNameAndValue(e, i, s), true;
    }
  }
  if (e.pos = t, this.regexp_eatLoneUnicodePropertyNameOrValue(e)) {
    var n2 = e.lastStringValue;
    return this.regexp_validateUnicodePropertyNameOrValue(e, n2), true;
  }
  return false;
}, To.regexp_validateUnicodePropertyNameAndValue = function(e, t, i) {
  Oa(e.unicodeProperties.nonBinary, t) || e.raise("Invalid property name"), e.unicodeProperties.nonBinary[t].test(i) || e.raise("Invalid property value");
}, To.regexp_validateUnicodePropertyNameOrValue = function(e, t) {
  e.unicodeProperties.binary.test(t) || e.raise("Invalid property name");
}, To.regexp_eatUnicodePropertyName = function(e) {
  var t = 0;
  for (e.lastStringValue = ""; Do(t = e.current()); )
    e.lastStringValue += Da(t), e.advance();
  return e.lastStringValue !== "";
}, To.regexp_eatUnicodePropertyValue = function(e) {
  var t = 0;
  for (e.lastStringValue = ""; Lo(t = e.current()); )
    e.lastStringValue += Da(t), e.advance();
  return e.lastStringValue !== "";
}, To.regexp_eatLoneUnicodePropertyNameOrValue = function(e) {
  return this.regexp_eatUnicodePropertyValue(e);
}, To.regexp_eatCharacterClass = function(e) {
  if (e.eat(91)) {
    if (e.eat(94), this.regexp_classRanges(e), e.eat(93))
      return true;
    e.raise("Unterminated character class");
  }
  return false;
}, To.regexp_classRanges = function(e) {
  for (; this.regexp_eatClassAtom(e); ) {
    var t = e.lastIntValue;
    if (e.eat(45) && this.regexp_eatClassAtom(e)) {
      var i = e.lastIntValue;
      !e.switchU || t !== -1 && i !== -1 || e.raise("Invalid character class"), t !== -1 && i !== -1 && t > i && e.raise("Range out of order in character class");
    }
  }
}, To.regexp_eatClassAtom = function(e) {
  var t = e.pos;
  if (e.eat(92)) {
    if (this.regexp_eatClassEscape(e))
      return true;
    if (e.switchU) {
      var i = e.current();
      (i === 99 || zo(i)) && e.raise("Invalid class escape"), e.raise("Invalid escape");
    }
    e.pos = t;
  }
  var s = e.current();
  return s !== 93 && (e.lastIntValue = s, e.advance(), true);
}, To.regexp_eatClassEscape = function(e) {
  var t = e.pos;
  if (e.eat(98))
    return e.lastIntValue = 8, true;
  if (e.switchU && e.eat(45))
    return e.lastIntValue = 45, true;
  if (!e.switchU && e.eat(99)) {
    if (this.regexp_eatClassControlLetter(e))
      return true;
    e.pos = t;
  }
  return this.regexp_eatCharacterClassEscape(e) || this.regexp_eatCharacterEscape(e);
}, To.regexp_eatClassControlLetter = function(e) {
  var t = e.current();
  return !(!Vo(t) && t !== 95) && (e.lastIntValue = t % 32, e.advance(), true);
}, To.regexp_eatHexEscapeSequence = function(e) {
  var t = e.pos;
  if (e.eat(120)) {
    if (this.regexp_eatFixedHexDigits(e, 2))
      return true;
    e.switchU && e.raise("Invalid escape"), e.pos = t;
  }
  return false;
}, To.regexp_eatDecimalDigits = function(e) {
  var t = e.pos, i = 0;
  for (e.lastIntValue = 0; Vo(i = e.current()); )
    e.lastIntValue = 10 * e.lastIntValue + (i - 48), e.advance();
  return e.pos !== t;
}, To.regexp_eatHexDigits = function(e) {
  var t = e.pos, i = 0;
  for (e.lastIntValue = 0; Bo(i = e.current()); )
    e.lastIntValue = 16 * e.lastIntValue + Fo(i), e.advance();
  return e.pos !== t;
}, To.regexp_eatLegacyOctalEscapeSequence = function(e) {
  if (this.regexp_eatOctalDigit(e)) {
    var t = e.lastIntValue;
    if (this.regexp_eatOctalDigit(e)) {
      var i = e.lastIntValue;
      t <= 3 && this.regexp_eatOctalDigit(e) ? e.lastIntValue = 64 * t + 8 * i + e.lastIntValue : e.lastIntValue = 8 * t + i;
    } else
      e.lastIntValue = t;
    return true;
  }
  return false;
}, To.regexp_eatOctalDigit = function(e) {
  var t = e.current();
  return zo(t) ? (e.lastIntValue = t - 48, e.advance(), true) : (e.lastIntValue = 0, false);
}, To.regexp_eatFixedHexDigits = function(e, t) {
  var i = e.pos;
  e.lastIntValue = 0;
  for (var s = 0; s < t; ++s) {
    var n2 = e.current();
    if (!Bo(n2))
      return e.pos = i, false;
    e.lastIntValue = 16 * e.lastIntValue + Fo(n2), e.advance();
  }
  return true;
};
var jo = function(e) {
  this.type = e.type, this.value = e.value, this.start = e.start, this.end = e.end, e.options.locations && (this.loc = new Ba(e, e.startLoc, e.endLoc)), e.options.ranges && (this.range = [e.start, e.end]);
}, Uo = Ha.prototype;
function Go(e) {
  return typeof BigInt != "function" ? null : BigInt(e.replace(/_/g, ""));
}
Uo.next = function(e) {
  !e && this.type.keyword && this.containsEsc && this.raiseRecoverable(this.start, "Escape sequence in keyword " + this.type.keyword), this.options.onToken && this.options.onToken(new jo(this)), this.lastTokEnd = this.end, this.lastTokStart = this.start, this.lastTokEndLoc = this.endLoc, this.lastTokStartLoc = this.startLoc, this.nextToken();
}, Uo.getToken = function() {
  return this.next(), new jo(this);
}, typeof Symbol != "undefined" && (Uo[Symbol.iterator] = function() {
  var e = this;
  return { next: function() {
    var t = e.getToken();
    return { done: t.type === Aa.eof, value: t };
  } };
}), Uo.nextToken = function() {
  var e = this.curContext();
  return e && e.preserveSpace || this.skipSpace(), this.start = this.pos, this.options.locations && (this.startLoc = this.curPosition()), this.pos >= this.input.length ? this.finishToken(Aa.eof) : e.override ? e.override(this) : void this.readToken(this.fullCharCodeAtPos());
}, Uo.readToken = function(e) {
  return ma(e, this.options.ecmaVersion >= 6) || e === 92 ? this.readWord() : this.getTokenFromCode(e);
}, Uo.fullCharCodeAtPos = function() {
  var e = this.input.charCodeAt(this.pos);
  if (e <= 55295 || e >= 56320)
    return e;
  var t = this.input.charCodeAt(this.pos + 1);
  return t <= 56319 || t >= 57344 ? e : (e << 10) + t - 56613888;
}, Uo.skipBlockComment = function() {
  var e = this.options.onComment && this.curPosition(), t = this.pos, i = this.input.indexOf("*/", this.pos += 2);
  if (i === -1 && this.raise(this.pos - 2, "Unterminated comment"), this.pos = i + 2, this.options.locations)
    for (var s = void 0, n2 = t; (s = wa(this.input, n2, this.pos)) > -1; )
      ++this.curLine, n2 = this.lineStart = s;
  this.options.onComment && this.options.onComment(true, this.input.slice(t + 2, i), t, this.pos, e, this.curPosition());
}, Uo.skipLineComment = function(e) {
  for (var t = this.pos, i = this.options.onComment && this.curPosition(), s = this.input.charCodeAt(this.pos += e); this.pos < this.input.length && !Pa(s); )
    s = this.input.charCodeAt(++this.pos);
  this.options.onComment && this.options.onComment(false, this.input.slice(t + e, this.pos), t, this.pos, i, this.curPosition());
}, Uo.skipSpace = function() {
  e:
    for (; this.pos < this.input.length; ) {
      var e = this.input.charCodeAt(this.pos);
      switch (e) {
        case 32:
        case 160:
          ++this.pos;
          break;
        case 13:
          this.input.charCodeAt(this.pos + 1) === 10 && ++this.pos;
        case 10:
        case 8232:
        case 8233:
          ++this.pos, this.options.locations && (++this.curLine, this.lineStart = this.pos);
          break;
        case 47:
          switch (this.input.charCodeAt(this.pos + 1)) {
            case 42:
              this.skipBlockComment();
              break;
            case 47:
              this.skipLineComment(2);
              break;
            default:
              break e;
          }
          break;
        default:
          if (!(e > 8 && e < 14 || e >= 5760 && Ca.test(String.fromCharCode(e))))
            break e;
          ++this.pos;
      }
    }
}, Uo.finishToken = function(e, t) {
  this.end = this.pos, this.options.locations && (this.endLoc = this.curPosition());
  var i = this.type;
  this.type = e, this.value = t, this.updateContext(i);
}, Uo.readToken_dot = function() {
  var e = this.input.charCodeAt(this.pos + 1);
  if (e >= 48 && e <= 57)
    return this.readNumber(true);
  var t = this.input.charCodeAt(this.pos + 2);
  return this.options.ecmaVersion >= 6 && e === 46 && t === 46 ? (this.pos += 3, this.finishToken(Aa.ellipsis)) : (++this.pos, this.finishToken(Aa.dot));
}, Uo.readToken_slash = function() {
  var e = this.input.charCodeAt(this.pos + 1);
  return this.exprAllowed ? (++this.pos, this.readRegexp()) : e === 61 ? this.finishOp(Aa.assign, 2) : this.finishOp(Aa.slash, 1);
}, Uo.readToken_mult_modulo_exp = function(e) {
  var t = this.input.charCodeAt(this.pos + 1), i = 1, s = e === 42 ? Aa.star : Aa.modulo;
  return this.options.ecmaVersion >= 7 && e === 42 && t === 42 && (++i, s = Aa.starstar, t = this.input.charCodeAt(this.pos + 2)), t === 61 ? this.finishOp(Aa.assign, i + 1) : this.finishOp(s, i);
}, Uo.readToken_pipe_amp = function(e) {
  var t = this.input.charCodeAt(this.pos + 1);
  if (t === e) {
    if (this.options.ecmaVersion >= 12) {
      if (this.input.charCodeAt(this.pos + 2) === 61)
        return this.finishOp(Aa.assign, 3);
    }
    return this.finishOp(e === 124 ? Aa.logicalOR : Aa.logicalAND, 2);
  }
  return t === 61 ? this.finishOp(Aa.assign, 2) : this.finishOp(e === 124 ? Aa.bitwiseOR : Aa.bitwiseAND, 1);
}, Uo.readToken_caret = function() {
  return this.input.charCodeAt(this.pos + 1) === 61 ? this.finishOp(Aa.assign, 2) : this.finishOp(Aa.bitwiseXOR, 1);
}, Uo.readToken_plus_min = function(e) {
  var t = this.input.charCodeAt(this.pos + 1);
  return t === e ? t !== 45 || this.inModule || this.input.charCodeAt(this.pos + 2) !== 62 || this.lastTokEnd !== 0 && !Ia.test(this.input.slice(this.lastTokEnd, this.pos)) ? this.finishOp(Aa.incDec, 2) : (this.skipLineComment(3), this.skipSpace(), this.nextToken()) : t === 61 ? this.finishOp(Aa.assign, 2) : this.finishOp(Aa.plusMin, 1);
}, Uo.readToken_lt_gt = function(e) {
  var t = this.input.charCodeAt(this.pos + 1), i = 1;
  return t === e ? (i = e === 62 && this.input.charCodeAt(this.pos + 2) === 62 ? 3 : 2, this.input.charCodeAt(this.pos + i) === 61 ? this.finishOp(Aa.assign, i + 1) : this.finishOp(Aa.bitShift, i)) : t !== 33 || e !== 60 || this.inModule || this.input.charCodeAt(this.pos + 2) !== 45 || this.input.charCodeAt(this.pos + 3) !== 45 ? (t === 61 && (i = 2), this.finishOp(Aa.relational, i)) : (this.skipLineComment(4), this.skipSpace(), this.nextToken());
}, Uo.readToken_eq_excl = function(e) {
  var t = this.input.charCodeAt(this.pos + 1);
  return t === 61 ? this.finishOp(Aa.equality, this.input.charCodeAt(this.pos + 2) === 61 ? 3 : 2) : e === 61 && t === 62 && this.options.ecmaVersion >= 6 ? (this.pos += 2, this.finishToken(Aa.arrow)) : this.finishOp(e === 61 ? Aa.eq : Aa.prefix, 1);
}, Uo.readToken_question = function() {
  var e = this.options.ecmaVersion;
  if (e >= 11) {
    var t = this.input.charCodeAt(this.pos + 1);
    if (t === 46) {
      var i = this.input.charCodeAt(this.pos + 2);
      if (i < 48 || i > 57)
        return this.finishOp(Aa.questionDot, 2);
    }
    if (t === 63) {
      if (e >= 12) {
        if (this.input.charCodeAt(this.pos + 2) === 61)
          return this.finishOp(Aa.assign, 3);
      }
      return this.finishOp(Aa.coalesce, 2);
    }
  }
  return this.finishOp(Aa.question, 1);
}, Uo.readToken_numberSign = function() {
  var e = 35;
  if (this.options.ecmaVersion >= 13 && (++this.pos, ma(e = this.fullCharCodeAtPos(), true) || e === 92))
    return this.finishToken(Aa.privateId, this.readWord1());
  this.raise(this.pos, "Unexpected character '" + Da(e) + "'");
}, Uo.getTokenFromCode = function(e) {
  switch (e) {
    case 46:
      return this.readToken_dot();
    case 40:
      return ++this.pos, this.finishToken(Aa.parenL);
    case 41:
      return ++this.pos, this.finishToken(Aa.parenR);
    case 59:
      return ++this.pos, this.finishToken(Aa.semi);
    case 44:
      return ++this.pos, this.finishToken(Aa.comma);
    case 91:
      return ++this.pos, this.finishToken(Aa.bracketL);
    case 93:
      return ++this.pos, this.finishToken(Aa.bracketR);
    case 123:
      return ++this.pos, this.finishToken(Aa.braceL);
    case 125:
      return ++this.pos, this.finishToken(Aa.braceR);
    case 58:
      return ++this.pos, this.finishToken(Aa.colon);
    case 96:
      if (this.options.ecmaVersion < 6)
        break;
      return ++this.pos, this.finishToken(Aa.backQuote);
    case 48:
      var t = this.input.charCodeAt(this.pos + 1);
      if (t === 120 || t === 88)
        return this.readRadixNumber(16);
      if (this.options.ecmaVersion >= 6) {
        if (t === 111 || t === 79)
          return this.readRadixNumber(8);
        if (t === 98 || t === 66)
          return this.readRadixNumber(2);
      }
    case 49:
    case 50:
    case 51:
    case 52:
    case 53:
    case 54:
    case 55:
    case 56:
    case 57:
      return this.readNumber(false);
    case 34:
    case 39:
      return this.readString(e);
    case 47:
      return this.readToken_slash();
    case 37:
    case 42:
      return this.readToken_mult_modulo_exp(e);
    case 124:
    case 38:
      return this.readToken_pipe_amp(e);
    case 94:
      return this.readToken_caret();
    case 43:
    case 45:
      return this.readToken_plus_min(e);
    case 60:
    case 62:
      return this.readToken_lt_gt(e);
    case 61:
    case 33:
      return this.readToken_eq_excl(e);
    case 63:
      return this.readToken_question();
    case 126:
      return this.finishOp(Aa.prefix, 1);
    case 35:
      return this.readToken_numberSign();
  }
  this.raise(this.pos, "Unexpected character '" + Da(e) + "'");
}, Uo.finishOp = function(e, t) {
  var i = this.input.slice(this.pos, this.pos + t);
  return this.pos += t, this.finishToken(e, i);
}, Uo.readRegexp = function() {
  for (var e, t, i = this.pos; ; ) {
    this.pos >= this.input.length && this.raise(i, "Unterminated regular expression");
    var s = this.input.charAt(this.pos);
    if (Ia.test(s) && this.raise(i, "Unterminated regular expression"), e)
      e = false;
    else {
      if (s === "[")
        t = true;
      else if (s === "]" && t)
        t = false;
      else if (s === "/" && !t)
        break;
      e = s === "\\";
    }
    ++this.pos;
  }
  var n2 = this.input.slice(i, this.pos);
  ++this.pos;
  var r2 = this.pos, a3 = this.readWord1();
  this.containsEsc && this.unexpected(r2);
  var o2 = this.regexpState || (this.regexpState = new Oo(this));
  o2.reset(i, n2, a3), this.validateRegExpFlags(o2), this.validateRegExpPattern(o2);
  var l2 = null;
  try {
    l2 = new RegExp(n2, a3);
  } catch (e2) {
  }
  return this.finishToken(Aa.regexp, { pattern: n2, flags: a3, value: l2 });
}, Uo.readInt = function(e, t, i) {
  for (var s = this.options.ecmaVersion >= 12 && t === void 0, n2 = i && this.input.charCodeAt(this.pos) === 48, r2 = this.pos, a3 = 0, o2 = 0, l2 = 0, h2 = t == null ? 1 / 0 : t; l2 < h2; ++l2, ++this.pos) {
    var c2 = this.input.charCodeAt(this.pos), u2 = void 0;
    if (s && c2 === 95)
      n2 && this.raiseRecoverable(this.pos, "Numeric separator is not allowed in legacy octal numeric literals"), o2 === 95 && this.raiseRecoverable(this.pos, "Numeric separator must be exactly one underscore"), l2 === 0 && this.raiseRecoverable(this.pos, "Numeric separator is not allowed at the first of digits"), o2 = c2;
    else {
      if ((u2 = c2 >= 97 ? c2 - 97 + 10 : c2 >= 65 ? c2 - 65 + 10 : c2 >= 48 && c2 <= 57 ? c2 - 48 : 1 / 0) >= e)
        break;
      o2 = c2, a3 = a3 * e + u2;
    }
  }
  return s && o2 === 95 && this.raiseRecoverable(this.pos - 1, "Numeric separator is not allowed at the last of digits"), this.pos === r2 || t != null && this.pos - r2 !== t ? null : a3;
}, Uo.readRadixNumber = function(e) {
  var t = this.pos;
  this.pos += 2;
  var i = this.readInt(e);
  return i == null && this.raise(this.start + 2, "Expected number in radix " + e), this.options.ecmaVersion >= 11 && this.input.charCodeAt(this.pos) === 110 ? (i = Go(this.input.slice(t, this.pos)), ++this.pos) : ma(this.fullCharCodeAtPos()) && this.raise(this.pos, "Identifier directly after number"), this.finishToken(Aa.num, i);
}, Uo.readNumber = function(e) {
  var t = this.pos;
  e || this.readInt(10, void 0, true) !== null || this.raise(t, "Invalid number");
  var i = this.pos - t >= 2 && this.input.charCodeAt(t) === 48;
  i && this.strict && this.raise(t, "Invalid number");
  var s = this.input.charCodeAt(this.pos);
  if (!i && !e && this.options.ecmaVersion >= 11 && s === 110) {
    var n2 = Go(this.input.slice(t, this.pos));
    return ++this.pos, ma(this.fullCharCodeAtPos()) && this.raise(this.pos, "Identifier directly after number"), this.finishToken(Aa.num, n2);
  }
  i && /[89]/.test(this.input.slice(t, this.pos)) && (i = false), s !== 46 || i || (++this.pos, this.readInt(10), s = this.input.charCodeAt(this.pos)), s !== 69 && s !== 101 || i || ((s = this.input.charCodeAt(++this.pos)) !== 43 && s !== 45 || ++this.pos, this.readInt(10) === null && this.raise(t, "Invalid number")), ma(this.fullCharCodeAtPos()) && this.raise(this.pos, "Identifier directly after number");
  var r2, a3 = (r2 = this.input.slice(t, this.pos), i ? parseInt(r2, 8) : parseFloat(r2.replace(/_/g, "")));
  return this.finishToken(Aa.num, a3);
}, Uo.readCodePoint = function() {
  var e;
  if (this.input.charCodeAt(this.pos) === 123) {
    this.options.ecmaVersion < 6 && this.unexpected();
    var t = ++this.pos;
    e = this.readHexChar(this.input.indexOf("}", this.pos) - this.pos), ++this.pos, e > 1114111 && this.invalidStringToken(t, "Code point out of bounds");
  } else
    e = this.readHexChar(4);
  return e;
}, Uo.readString = function(e) {
  for (var t = "", i = ++this.pos; ; ) {
    this.pos >= this.input.length && this.raise(this.start, "Unterminated string constant");
    var s = this.input.charCodeAt(this.pos);
    if (s === e)
      break;
    s === 92 ? (t += this.input.slice(i, this.pos), t += this.readEscapedChar(false), i = this.pos) : s === 8232 || s === 8233 ? (this.options.ecmaVersion < 10 && this.raise(this.start, "Unterminated string constant"), ++this.pos, this.options.locations && (this.curLine++, this.lineStart = this.pos)) : (Pa(s) && this.raise(this.start, "Unterminated string constant"), ++this.pos);
  }
  return t += this.input.slice(i, this.pos++), this.finishToken(Aa.string, t);
};
var Ho = {};
Uo.tryReadTemplateToken = function() {
  this.inTemplateElement = true;
  try {
    this.readTmplToken();
  } catch (e) {
    if (e !== Ho)
      throw e;
    this.readInvalidTemplateToken();
  }
  this.inTemplateElement = false;
}, Uo.invalidStringToken = function(e, t) {
  if (this.inTemplateElement && this.options.ecmaVersion >= 9)
    throw Ho;
  this.raise(e, t);
}, Uo.readTmplToken = function() {
  for (var e = "", t = this.pos; ; ) {
    this.pos >= this.input.length && this.raise(this.start, "Unterminated template");
    var i = this.input.charCodeAt(this.pos);
    if (i === 96 || i === 36 && this.input.charCodeAt(this.pos + 1) === 123)
      return this.pos !== this.start || this.type !== Aa.template && this.type !== Aa.invalidTemplate ? (e += this.input.slice(t, this.pos), this.finishToken(Aa.template, e)) : i === 36 ? (this.pos += 2, this.finishToken(Aa.dollarBraceL)) : (++this.pos, this.finishToken(Aa.backQuote));
    if (i === 92)
      e += this.input.slice(t, this.pos), e += this.readEscapedChar(true), t = this.pos;
    else if (Pa(i)) {
      switch (e += this.input.slice(t, this.pos), ++this.pos, i) {
        case 13:
          this.input.charCodeAt(this.pos) === 10 && ++this.pos;
        case 10:
          e += "\n";
          break;
        default:
          e += String.fromCharCode(i);
      }
      this.options.locations && (++this.curLine, this.lineStart = this.pos), t = this.pos;
    } else
      ++this.pos;
  }
}, Uo.readInvalidTemplateToken = function() {
  for (; this.pos < this.input.length; this.pos++)
    switch (this.input[this.pos]) {
      case "\\":
        ++this.pos;
        break;
      case "$":
        if (this.input[this.pos + 1] !== "{")
          break;
      case "`":
        return this.finishToken(Aa.invalidTemplate, this.input.slice(this.start, this.pos));
    }
  this.raise(this.start, "Unterminated template");
}, Uo.readEscapedChar = function(e) {
  var t = this.input.charCodeAt(++this.pos);
  switch (++this.pos, t) {
    case 110:
      return "\n";
    case 114:
      return "\r";
    case 120:
      return String.fromCharCode(this.readHexChar(2));
    case 117:
      return Da(this.readCodePoint());
    case 116:
      return "	";
    case 98:
      return "\b";
    case 118:
      return "\v";
    case 102:
      return "\f";
    case 13:
      this.input.charCodeAt(this.pos) === 10 && ++this.pos;
    case 10:
      return this.options.locations && (this.lineStart = this.pos, ++this.curLine), "";
    case 56:
    case 57:
      if (this.strict && this.invalidStringToken(this.pos - 1, "Invalid escape sequence"), e) {
        var i = this.pos - 1;
        return this.invalidStringToken(i, "Invalid escape sequence in template string"), null;
      }
    default:
      if (t >= 48 && t <= 55) {
        var s = this.input.substr(this.pos - 1, 3).match(/^[0-7]+/)[0], n2 = parseInt(s, 8);
        return n2 > 255 && (s = s.slice(0, -1), n2 = parseInt(s, 8)), this.pos += s.length - 1, t = this.input.charCodeAt(this.pos), s === "0" && t !== 56 && t !== 57 || !this.strict && !e || this.invalidStringToken(this.pos - 1 - s.length, e ? "Octal literal in template string" : "Octal literal in strict mode"), String.fromCharCode(n2);
      }
      return Pa(t) ? "" : String.fromCharCode(t);
  }
}, Uo.readHexChar = function(e) {
  var t = this.pos, i = this.readInt(16, e);
  return i === null && this.invalidStringToken(t, "Bad character escape sequence"), i;
}, Uo.readWord1 = function() {
  this.containsEsc = false;
  for (var e = "", t = true, i = this.pos, s = this.options.ecmaVersion >= 6; this.pos < this.input.length; ) {
    var n2 = this.fullCharCodeAtPos();
    if (ga(n2, s))
      this.pos += n2 <= 65535 ? 1 : 2;
    else {
      if (n2 !== 92)
        break;
      this.containsEsc = true, e += this.input.slice(i, this.pos);
      var r2 = this.pos;
      this.input.charCodeAt(++this.pos) !== 117 && this.invalidStringToken(this.pos, "Expecting Unicode escape sequence \\uXXXX"), ++this.pos;
      var a3 = this.readCodePoint();
      (t ? ma : ga)(a3, s) || this.invalidStringToken(r2, "Invalid Unicode escape"), e += Da(a3), i = this.pos;
    }
    t = false;
  }
  return e + this.input.slice(i, this.pos);
}, Uo.readWord = function() {
  var e = this.readWord1(), t = Aa.name;
  return this.keywords.test(e) && (t = va[e]), this.finishToken(t, e);
};
Ha.acorn = { Parser: Ha, version: "8.7.1", defaultOptions: za, Position: Va, SourceLocation: Ba, getLineInfo: Fa, Node: mo, TokenType: ya, tokTypes: Aa, keywordTypes: va, TokContext: ro, tokContexts: ao, isIdentifierChar: ga, isIdentifierStart: ma, Token: jo, isNewLine: Pa, lineBreak: Ia, lineBreakG: ka, nonASCIIwhitespace: Ca };
class Wo {
  constructor(e) {
    this.maxParallel = e, this.queue = [], this.workerCount = 0;
  }
  run(e) {
    return new Promise((t, i) => {
      this.queue.push({ reject: i, resolve: t, task: e }), this.work();
    });
  }
  async work() {
    if (this.workerCount >= this.maxParallel)
      return;
    let e;
    for (this.workerCount++; e = this.queue.shift(); ) {
      const { reject: t, resolve: i, task: s } = e;
      try {
        i(await s());
      } catch (e2) {
        t(e2);
      }
    }
    this.workerCount--;
  }
}
const qo = (e) => () => {
  pe({ code: "NO_FS_IN_BROWSER", message: `Cannot access the file system (via "${e}") when using the browser build of Rollup. Make sure you supply a plugin with custom resolveId and load hooks to Rollup.`, url: "https://rollupjs.org/guide/en/#a-simple-example" });
}, Ko = { mkdir: qo("fs.mkdir"), readFile: qo("fs.readFile"), writeFile: qo("fs.writeFile") };
async function Xo(e, t, i, s, n2, r2, a3, o2) {
  const l2 = await function(e2, t2, i2, s2, n3, r3, a4) {
    let o3 = null, l3 = null;
    if (n3) {
      o3 = /* @__PURE__ */ new Set();
      for (const i3 of n3)
        e2 === i3.source && t2 === i3.importer && o3.add(i3.plugin);
      l3 = (e3, t3) => __spreadProps(__spreadValues({}, e3), { resolve: (e4, i3, { custom: r4, isEntry: a5, skipSelf: o4 } = ie) => s2(e4, i3, r4, a5, o4 ? [...n3, { importer: i3, plugin: t3, source: e4 }] : n3) });
    }
    return i2.hookFirst("resolveId", [e2, t2, { custom: r3, isEntry: a4 }], l3, o3);
  }(e, t, s, n2, r2, a3, o2);
  return l2;
}
function Yo(e, t, { hook: i, id: s } = {}) {
  return typeof e == "string" && (e = { message: e }), e.code && e.code !== me.PLUGIN_ERROR && (e.pluginCode = e.code), e.code = me.PLUGIN_ERROR, e.plugin = t, i && (e.hook = i), s && (e.id = s), pe(e);
}
const Qo = [{ active: true, deprecated: "resolveAssetUrl", replacement: "resolveFileUrl" }];
const Zo = { delete: () => false, get() {
}, has: () => false, set() {
} };
function Jo(e) {
  return e.startsWith("at position ") || e.startsWith("at output position ") ? pe({ code: "ANONYMOUS_PLUGIN_CACHE", message: "A plugin is trying to use the Rollup cache but is not declaring a plugin name or cacheKey." }) : pe({ code: "DUPLICATE_PLUGIN_NAME", message: `The plugin name ${e} is being used twice in the same build. Plugin names must be distinct or provide a cacheKey (please post an issue to the plugin if you are a plugin user).` });
}
async function el(e, t, i, s) {
  const n2 = t.id, r2 = [];
  let a3 = e.map === null ? null : Or(e.map);
  const o2 = e.code;
  let l2 = e.ast;
  const c2 = [], u2 = [];
  let d2 = false;
  const p2 = () => d2 = true;
  let f2 = "";
  const m3 = e.code;
  let g2;
  try {
    g2 = await i.hookReduceArg0("transform", [m3, n2], function(e2, i2, n3) {
      let a4, o3;
      if (typeof i2 == "string")
        a4 = i2;
      else {
        if (!i2 || typeof i2 != "object")
          return e2;
        if (t.updateOptions(i2), i2.code == null)
          return (i2.map || i2.ast) && s(function(e3) {
            return { code: me.NO_TRANSFORM_MAP_OR_AST_WITHOUT_CODE, message: `The plugin "${e3}" returned a "map" or "ast" without returning a "code". This will be ignored.` };
          }(n3.name)), e2;
        ({ code: a4, map: o3, ast: l2 } = i2);
      }
      return o3 !== null && r2.push(Or(typeof o3 == "string" ? JSON.parse(o3) : o3) || { missing: true, plugin: n3.name }), a4;
    }, (e2, t2) => {
      return f2 = t2.name, __spreadProps(__spreadValues({}, e2), { addWatchFile(t3) {
        c2.push(t3), e2.addWatchFile(t3);
      }, cache: d2 ? e2.cache : (l3 = e2.cache, g3 = p2, { delete: (e3) => (g3(), l3.delete(e3)), get: (e3) => (g3(), l3.get(e3)), has: (e3) => (g3(), l3.has(e3)), set: (e3, t3) => (g3(), l3.set(e3, t3)) }), emitAsset: (t3, i2) => (u2.push({ name: t3, source: i2, type: "asset" }), e2.emitAsset(t3, i2)), emitChunk: (t3, i2) => (u2.push({ id: t3, name: i2 && i2.name, type: "chunk" }), e2.emitChunk(t3, i2)), emitFile: (e3) => (u2.push(e3), i.emitFile(e3)), error: (t3, i2) => (typeof t3 == "string" && (t3 = { message: t3 }), i2 && fe(t3, i2, m3, n2), t3.id = n2, t3.hook = "transform", e2.error(t3)), getCombinedSourcemap() {
        const e3 = function(e4, t3, i2, s2, n3) {
          return s2.length ? __spreadValues({ version: 3 }, Ln(e4, t3, i2, s2, Dn(n3)).traceMappings()) : i2;
        }(n2, o2, a3, r2, s);
        if (!e3) {
          return new x(o2).generateMap({ hires: true, includeContent: true, source: n2 });
        }
        return a3 !== e3 && (a3 = e3, r2.length = 0), new h(__spreadProps(__spreadValues({}, e3), { file: null, sourcesContent: e3.sourcesContent }));
      }, setAssetSource() {
        return this.error({ code: "INVALID_SETASSETSOURCE", message: "setAssetSource cannot be called in transform for caching reasons. Use emitFile with a source, or call setAssetSource in another hook." });
      }, warn(t3, i2) {
        typeof t3 == "string" && (t3 = { message: t3 }), i2 && fe(t3, i2, m3, n2), t3.id = n2, t3.hook = "transform", e2.warn(t3);
      } });
      var l3, g3;
    });
  } catch (e2) {
    Yo(e2, f2, { hook: "transform", id: n2 });
  }
  return d2 || u2.length && (t.transformFiles = u2), { ast: l2, code: g2, customTransformCache: d2, originalCode: o2, originalSourcemap: a3, sourcemapChain: r2, transformDependencies: c2 };
}
class tl {
  constructor(e, t, i, s) {
    this.graph = e, this.modulesById = t, this.options = i, this.pluginDriver = s, this.implicitEntryModules = /* @__PURE__ */ new Set(), this.indexedEntryModules = [], this.latestLoadModulesPromise = Promise.resolve(), this.moduleLoadPromises = /* @__PURE__ */ new Map(), this.modulesWithLoadedDependencies = /* @__PURE__ */ new Set(), this.nextChunkNamePriority = 0, this.nextEntryModuleIndex = 0, this.resolveId = async (e2, t2, i2, s2, n2 = null) => this.getResolvedIdWithDefaults(this.getNormalizedResolvedIdWithoutDefaults(!this.options.external(e2, t2, false) && await Xo(e2, t2, this.options.preserveSymlinks, this.pluginDriver, this.resolveId, n2, i2, typeof s2 == "boolean" ? s2 : !t2), t2, e2)), this.hasModuleSideEffects = i.treeshake ? i.treeshake.moduleSideEffects : () => true, this.readQueue = new Wo(i.maxParallelFileReads);
  }
  async addAdditionalModules(e) {
    const t = this.extendLoadModulesPromise(Promise.all(e.map((e2) => this.loadEntryModule(e2, false, void 0, null))));
    return await this.awaitLoadModulesPromise(), t;
  }
  async addEntryModules(e, t) {
    const i = this.nextEntryModuleIndex;
    this.nextEntryModuleIndex += e.length;
    const s = this.nextChunkNamePriority;
    this.nextChunkNamePriority += e.length;
    const n2 = await this.extendLoadModulesPromise(Promise.all(e.map(({ id: e2, importer: t2 }) => this.loadEntryModule(e2, true, t2, null))).then((n3) => {
      for (let r2 = 0; r2 < n3.length; r2++) {
        const a3 = n3[r2];
        a3.isUserDefinedEntryPoint = a3.isUserDefinedEntryPoint || t, sl(a3, e[r2], t, s + r2);
        const o2 = this.indexedEntryModules.find((e2) => e2.module === a3);
        o2 ? o2.index = Math.min(o2.index, i + r2) : this.indexedEntryModules.push({ index: i + r2, module: a3 });
      }
      return this.indexedEntryModules.sort(({ index: e2 }, { index: t2 }) => e2 > t2 ? 1 : -1), n3;
    }));
    return await this.awaitLoadModulesPromise(), { entryModules: this.indexedEntryModules.map(({ module: e2 }) => e2), implicitEntryModules: [...this.implicitEntryModules], newEntryModules: n2 };
  }
  async emitChunk({ fileName: e, id: t, importer: i, name: s, implicitlyLoadedAfterOneOf: n2, preserveSignature: r2 }) {
    const a3 = { fileName: e || null, id: t, importer: i, name: s || null }, o2 = n2 ? await this.addEntryWithImplicitDependants(a3, n2) : (await this.addEntryModules([a3], false)).newEntryModules[0];
    return r2 != null && (o2.preserveSignature = r2), o2;
  }
  async preloadModule(e) {
    return (await this.fetchModule(this.getResolvedIdWithDefaults(e), void 0, false, !e.resolveDependencies || "resolveDependencies")).info;
  }
  addEntryWithImplicitDependants(e, t) {
    const i = this.nextChunkNamePriority++;
    return this.extendLoadModulesPromise(this.loadEntryModule(e.id, false, e.importer, null).then(async (s) => {
      if (sl(s, e, false, i), !s.info.isEntry) {
        this.implicitEntryModules.add(s);
        const i2 = await Promise.all(t.map((t2) => this.loadEntryModule(t2, false, e.importer, s.id)));
        for (const e2 of i2)
          s.implicitlyLoadedAfter.add(e2);
        for (const e2 of s.implicitlyLoadedAfter)
          e2.implicitlyLoadedBefore.add(s);
      }
      return s;
    }));
  }
  async addModuleSource(e, t, i) {
    let s;
    en("load modules", 3);
    try {
      s = await this.readQueue.run(async () => {
        var t2;
        return (t2 = await this.pluginDriver.hookFirst("load", [e])) !== null && t2 !== void 0 ? t2 : await Ko.readFile(e, "utf8");
      });
    } catch (i2) {
      tn("load modules", 3);
      let s2 = `Could not load ${e}`;
      throw t && (s2 += ` (imported by ${he(t)})`), s2 += `: ${i2.message}`, i2.message = s2, i2;
    }
    tn("load modules", 3);
    const n2 = typeof s == "string" ? { code: s } : s != null && typeof s == "object" && typeof s.code == "string" ? s : pe(function(e2) {
      return { code: me.BAD_LOADER, message: `Error loading ${he(e2)}: plugin load hook should return a string, a { code, map } object, or nothing/null` };
    }(e)), r2 = this.graph.cachedModules.get(e);
    if (!r2 || r2.customTransformCache || r2.originalCode !== n2.code || await this.pluginDriver.hookFirst("shouldTransformCachedModule", [{ ast: r2.ast, code: r2.code, id: r2.id, meta: r2.meta, moduleSideEffects: r2.moduleSideEffects, resolvedSources: r2.resolvedIds, syntheticNamedExports: r2.syntheticNamedExports }]))
      i.updateOptions(n2), i.setSource(await el(n2, i, this.pluginDriver, this.options.onwarn));
    else {
      if (r2.transformFiles)
        for (const e2 of r2.transformFiles)
          this.pluginDriver.emitFile(e2);
      i.setSource(r2);
    }
  }
  async awaitLoadModulesPromise() {
    let e;
    do {
      e = this.latestLoadModulesPromise, await e;
    } while (e !== this.latestLoadModulesPromise);
  }
  extendLoadModulesPromise(e) {
    return this.latestLoadModulesPromise = Promise.all([e, this.latestLoadModulesPromise]), this.latestLoadModulesPromise.catch(() => {
    }), e;
  }
  async fetchDynamicDependencies(e, t) {
    const i = await Promise.all(t.map((t2) => t2.then(async ([t3, i2]) => i2 === null ? null : typeof i2 == "string" ? (t3.resolution = i2, null) : t3.resolution = await this.fetchResolvedDependency(he(i2.id), e.id, i2))));
    for (const t2 of i)
      t2 && (e.dynamicDependencies.add(t2), t2.dynamicImporters.push(e.id));
  }
  async fetchModule({ id: e, meta: t, moduleSideEffects: i, syntheticNamedExports: s }, n2, r2, a3) {
    const o2 = this.modulesById.get(e);
    if (o2 instanceof ln)
      return await this.handleExistingModule(o2, r2, a3), o2;
    const l2 = new ln(this.graph, e, this.options, r2, i, s, t);
    this.modulesById.set(e, l2), this.graph.watchFiles[e] = true;
    const h2 = this.addModuleSource(e, n2, l2).then(() => [this.getResolveStaticDependencyPromises(l2), this.getResolveDynamicImportPromises(l2), c2]), c2 = rl(h2).then(() => this.pluginDriver.hookParallel("moduleParsed", [l2.info]));
    c2.catch(() => {
    }), this.moduleLoadPromises.set(l2, h2);
    const u2 = await h2;
    return a3 ? a3 === "resolveDependencies" && await c2 : await this.fetchModuleDependencies(l2, ...u2), l2;
  }
  async fetchModuleDependencies(e, t, i, s) {
    this.modulesWithLoadedDependencies.has(e) || (this.modulesWithLoadedDependencies.add(e), await Promise.all([this.fetchStaticDependencies(e, t), this.fetchDynamicDependencies(e, i)]), e.linkImports(), await s);
  }
  fetchResolvedDependency(e, t, i) {
    if (i.external) {
      const { external: s, id: n2, moduleSideEffects: r2, meta: a3 } = i;
      this.modulesById.has(n2) || this.modulesById.set(n2, new $e(this.options, n2, r2, a3, s !== "absolute" && P(n2)));
      const o2 = this.modulesById.get(n2);
      return o2 instanceof $e ? Promise.resolve(o2) : pe(function(e2, t2) {
        return { code: me.INVALID_EXTERNAL_ID, message: `'${e2}' is imported as an external by ${he(t2)}, but is already an existing non-external module id.` };
      }(e, t));
    }
    return this.fetchModule(i, t, false, false);
  }
  async fetchStaticDependencies(e, t) {
    for (const i of await Promise.all(t.map((t2) => t2.then(([t3, i2]) => this.fetchResolvedDependency(t3, e.id, i2)))))
      e.dependencies.add(i), i.importers.push(e.id);
    if (!this.options.treeshake || e.info.moduleSideEffects === "no-treeshake")
      for (const t2 of e.dependencies)
        t2 instanceof ln && (t2.importedFromNotTreeshaken = true);
  }
  getNormalizedResolvedIdWithoutDefaults(e, t, i) {
    const { makeAbsoluteExternalsRelative: s } = this.options;
    if (e) {
      if (typeof e == "object") {
        const n4 = e.external || this.options.external(e.id, t, true);
        return __spreadProps(__spreadValues({}, e), { external: n4 && (n4 === "relative" || !P(e.id) || n4 === true && nl(e.id, i, s) || "absolute") });
      }
      const n3 = this.options.external(e, t, true);
      return { external: n3 && (nl(e, i, s) || "absolute"), id: n3 && s ? il(e, t) : e };
    }
    const n2 = s ? il(i, t) : i;
    return e === false || this.options.external(n2, t, true) ? { external: nl(n2, i, s) || "absolute", id: n2 } : null;
  }
  getResolveDynamicImportPromises(e) {
    return e.dynamicImports.map(async (t) => {
      const i = await this.resolveDynamicImport(e, typeof t.argument == "string" ? t.argument : t.argument.esTreeNode, e.id);
      return i && typeof i == "object" && (t.id = i.id), [t, i];
    });
  }
  getResolveStaticDependencyPromises(e) {
    return Array.from(e.sources, async (t) => [t, e.resolvedIds[t] = e.resolvedIds[t] || this.handleResolveId(await this.resolveId(t, e.id, se, false), t, e.id)]);
  }
  getResolvedIdWithDefaults(e) {
    var t, i;
    if (!e)
      return null;
    const s = e.external || false;
    return { external: s, id: e.id, meta: e.meta || {}, moduleSideEffects: (t = e.moduleSideEffects) !== null && t !== void 0 ? t : this.hasModuleSideEffects(e.id, !!s), syntheticNamedExports: (i = e.syntheticNamedExports) !== null && i !== void 0 && i };
  }
  async handleExistingModule(e, t, i) {
    const s = this.moduleLoadPromises.get(e);
    if (i)
      return i === "resolveDependencies" ? rl(s) : s;
    if (t) {
      e.info.isEntry = true, this.implicitEntryModules.delete(e);
      for (const t2 of e.implicitlyLoadedAfter)
        t2.implicitlyLoadedBefore.delete(e);
      e.implicitlyLoadedAfter.clear();
    }
    return this.fetchModuleDependencies(e, ...await s);
  }
  handleResolveId(e, t, i) {
    return e === null ? w(t) ? pe(function(e2, t2) {
      return { code: me.UNRESOLVED_IMPORT, message: `Could not resolve '${e2}' from ${he(t2)}` };
    }(t, i)) : (this.options.onwarn(function(e2, t2) {
      return { code: me.UNRESOLVED_IMPORT, importer: he(t2), message: `'${e2}' is imported by ${he(t2)}, but could not be resolved \u2013 treating it as an external dependency`, source: e2, url: "https://rollupjs.org/guide/en/#warning-treating-module-as-external-dependency" };
    }(t, i)), { external: true, id: t, meta: {}, moduleSideEffects: this.hasModuleSideEffects(t, true), syntheticNamedExports: false }) : (e.external && e.syntheticNamedExports && this.options.onwarn(function(e2, t2) {
      return { code: me.EXTERNAL_SYNTHETIC_EXPORTS, importer: he(t2), message: `External '${e2}' can not have 'syntheticNamedExports' enabled.`, source: e2 };
    }(t, i)), e);
  }
  async loadEntryModule(e, t, i, s) {
    const n2 = await Xo(e, i, this.options.preserveSymlinks, this.pluginDriver, this.resolveId, null, se, true);
    return n2 == null ? pe(s === null ? function(e2) {
      return { code: me.UNRESOLVED_ENTRY, message: `Could not resolve entry module (${he(e2)}).` };
    }(e) : function(e2, t2) {
      return { code: me.MISSING_IMPLICIT_DEPENDANT, message: `Module "${he(e2)}" that should be implicitly loaded before "${he(t2)}" could not be resolved.` };
    }(e, s)) : n2 === false || typeof n2 == "object" && n2.external ? pe(s === null ? function(e2) {
      return { code: me.UNRESOLVED_ENTRY, message: `Entry module cannot be external (${he(e2)}).` };
    }(e) : function(e2, t2) {
      return { code: me.MISSING_IMPLICIT_DEPENDANT, message: `Module "${he(e2)}" that should be implicitly loaded before "${he(t2)}" cannot be external.` };
    }(e, s)) : this.fetchModule(this.getResolvedIdWithDefaults(typeof n2 == "object" ? n2 : { id: n2 }), void 0, t, false);
  }
  async resolveDynamicImport(e, t, i) {
    var s, n2;
    const r2 = await this.pluginDriver.hookFirst("resolveDynamicImport", [t, i]);
    return typeof t != "string" ? typeof r2 == "string" ? r2 : r2 ? __spreadValues({ external: false, moduleSideEffects: true }, r2) : null : r2 == null ? (s = (n2 = e.resolvedIds)[t]) !== null && s !== void 0 ? s : n2[t] = this.handleResolveId(await this.resolveId(t, e.id, se, false), t, e.id) : this.handleResolveId(this.getResolvedIdWithDefaults(this.getNormalizedResolvedIdWithoutDefaults(r2, i, t)), t, i);
  }
}
function il(e, t) {
  return w(e) ? t ? O(t, "..", e) : O(e) : e;
}
function sl(e, { fileName: t, name: i }, s, n2) {
  var r2;
  if (t !== null)
    e.chunkFileNames.add(t);
  else if (i !== null) {
    let t2 = 0;
    for (; ((r2 = e.chunkNames[t2]) === null || r2 === void 0 ? void 0 : r2.priority) < n2; )
      t2++;
    e.chunkNames.splice(t2, 0, { isUserDefined: s, name: i, priority: n2 });
  }
}
function nl(e, t, i) {
  return i === true || i === "ifRelativeSource" && w(t) || !P(e);
}
async function rl(e) {
  const [t, i] = await e;
  return Promise.all([...t, ...i]);
}
class al extends Bt {
  constructor() {
    super(), this.parent = null, this.variables.set("undefined", new Rs());
  }
  findVariable(e) {
    let t = this.variables.get(e);
    return t || (t = new ii(e), this.variables.set(e, t)), t;
  }
}
function ol(e, t, i, s, n2, r2) {
  let a3 = false;
  return (...o2) => (a3 || (a3 = true, ke({ message: `The "this.${t}" plugin context function used by plugin ${s} is deprecated. The "this.${i}" plugin context function should be used instead.`, plugin: s }, n2, r2)), e(...o2));
}
function ll(e, t, i, s, n2, r2) {
  let a3, o2 = true;
  if (typeof e.cacheKey != "string" && (e.name.startsWith("at position ") || e.name.startsWith("at output position ") || r2.has(e.name) ? o2 = false : r2.add(e.name)), t)
    if (o2) {
      const i2 = e.cacheKey || e.name;
      h2 = t[i2] || (t[i2] = /* @__PURE__ */ Object.create(null)), a3 = { delete: (e2) => delete h2[e2], get(e2) {
        const t2 = h2[e2];
        if (t2)
          return t2[0] = 0, t2[1];
      }, has(e2) {
        const t2 = h2[e2];
        return !!t2 && (t2[0] = 0, true);
      }, set(e2, t2) {
        h2[e2] = [0, t2];
      } };
    } else
      l2 = e.name, a3 = { delete: () => Jo(l2), get: () => Jo(l2), has: () => Jo(l2), set: () => Jo(l2) };
  else
    a3 = Zo;
  var l2, h2;
  const c2 = { addWatchFile(e2) {
    if (i.phase >= Gs.GENERATE)
      return this.error({ code: me.INVALID_ROLLUP_PHASE, message: "Cannot call addWatchFile after the build has finished." });
    i.watchFiles[e2] = true;
  }, cache: a3, emitAsset: ol((e2, t2) => n2.emitFile({ name: e2, source: t2, type: "asset" }), "emitAsset", "emitFile", e.name, true, s), emitChunk: ol((e2, t2) => n2.emitFile({ id: e2, name: t2 && t2.name, type: "chunk" }), "emitChunk", "emitFile", e.name, true, s), emitFile: n2.emitFile.bind(n2), error: (t2) => Yo(t2, e.name), getAssetFileName: ol(n2.getFileName, "getAssetFileName", "getFileName", e.name, true, s), getChunkFileName: ol(n2.getFileName, "getChunkFileName", "getFileName", e.name, true, s), getFileName: n2.getFileName, getModuleIds: () => i.modulesById.keys(), getModuleInfo: i.getModuleInfo, getWatchFiles: () => Object.keys(i.watchFiles), isExternal: ol((e2, t2, i2 = false) => s.external(e2, t2, i2), "isExternal", "resolve", e.name, true, s), load: (e2) => i.moduleLoader.preloadModule(e2), meta: { rollupVersion: "2.75.6", watchMode: i.watchMode }, get moduleIds() {
    const t2 = i.modulesById.keys();
    return function* () {
      ke({ message: `Accessing "this.moduleIds" on the plugin context by plugin ${e.name} is deprecated. The "this.getModuleIds" plugin context function should be used instead.`, plugin: e.name }, false, s), yield* t2;
    }();
  }, parse: i.contextParse.bind(i), resolve: (t2, s2, { custom: n3, isEntry: r3, skipSelf: a4 } = ie) => i.moduleLoader.resolveId(t2, s2, n3, r3, a4 ? [{ importer: s2, plugin: e, source: t2 }] : null), resolveId: ol((e2, t2) => i.moduleLoader.resolveId(e2, t2, ie, void 0).then((e3) => e3 && e3.id), "resolveId", "resolve", e.name, true, s), setAssetSource: n2.setAssetSource, warn(t2) {
    typeof t2 == "string" && (t2 = { message: t2 }), t2.code && (t2.pluginCode = t2.code), t2.code = "PLUGIN_WARNING", t2.plugin = e.name, s.onwarn(t2);
  } };
  return c2;
}
const hl = Object.keys({ buildEnd: 1, buildStart: 1, closeBundle: 1, closeWatcher: 1, load: 1, moduleParsed: 1, options: 1, resolveDynamicImport: 1, resolveId: 1, shouldTransformCachedModule: 1, transform: 1, watchChange: 1 });
function cl(e, t) {
  return pe({ code: "INVALID_PLUGIN_HOOK", message: `Error running plugin hook ${e} for ${t}, expected a function hook.` });
}
class ul {
  constructor(e, t, i, s, n2) {
    this.graph = e, this.options = t, this.unfulfilledActions = /* @__PURE__ */ new Set(), function(e2, t2) {
      for (const { active: i2, deprecated: s2, replacement: n3 } of Qo)
        for (const r3 of e2)
          s2 in r3 && ke({ message: `The "${s2}" hook used by plugin ${r3.name} is deprecated. The "${n3}" hook should be used instead.`, plugin: r3.name }, i2, t2);
    }(i, t), this.pluginCache = s, this.fileEmitter = new Wr(e, t, n2 && n2.fileEmitter), this.emitFile = this.fileEmitter.emitFile.bind(this.fileEmitter), this.getFileName = this.fileEmitter.getFileName.bind(this.fileEmitter), this.finaliseAssets = this.fileEmitter.assertAssetsFinalized.bind(this.fileEmitter), this.setOutputBundle = this.fileEmitter.setOutputBundle.bind(this.fileEmitter), this.plugins = i.concat(n2 ? n2.plugins : []);
    const r2 = /* @__PURE__ */ new Set();
    if (this.pluginContexts = new Map(this.plugins.map((i2) => [i2, ll(i2, s, e, t, this.fileEmitter, r2)])), n2)
      for (const e2 of i)
        for (const i2 of hl)
          i2 in e2 && t.onwarn((a3 = e2.name, o2 = i2, { code: me.INPUT_HOOK_IN_OUTPUT_PLUGIN, message: `The "${o2}" hook used by the output plugin ${a3} is a build time hook and will not be run for that plugin. Either this plugin cannot be used as an output plugin, or it should have an option to configure it as an output plugin.` }));
    var a3, o2;
  }
  createOutputPluginDriver(e) {
    return new ul(this.graph, this.options, e, this.pluginCache, this);
  }
  getUnfulfilledHookActions() {
    return this.unfulfilledActions;
  }
  hookFirst(e, t, i, s) {
    let n2 = Promise.resolve(void 0);
    for (const r2 of this.plugins)
      s && s.has(r2) || (n2 = n2.then((s2) => s2 != null ? s2 : this.runHook(e, t, r2, false, i)));
    return n2;
  }
  hookFirstSync(e, t, i) {
    for (const s of this.plugins) {
      const n2 = this.runHookSync(e, t, s, i);
      if (n2 != null)
        return n2;
    }
    return null;
  }
  hookParallel(e, t, i) {
    const s = [];
    for (const n2 of this.plugins) {
      const r2 = this.runHook(e, t, n2, false, i);
      r2 && s.push(r2);
    }
    return Promise.all(s).then(() => {
    });
  }
  hookReduceArg0(e, [t, ...i], s, n2) {
    let r2 = Promise.resolve(t);
    for (const t2 of this.plugins)
      r2 = r2.then((r3) => {
        const a3 = [r3, ...i], o2 = this.runHook(e, a3, t2, false, n2);
        return o2 ? o2.then((e2) => s.call(this.pluginContexts.get(t2), r3, e2, t2)) : r3;
      });
    return r2;
  }
  hookReduceArg0Sync(e, [t, ...i], s, n2) {
    for (const r2 of this.plugins) {
      const a3 = [t, ...i], o2 = this.runHookSync(e, a3, r2, n2);
      t = s.call(this.pluginContexts.get(r2), t, o2, r2);
    }
    return t;
  }
  hookReduceValue(e, t, i, s, n2) {
    let r2 = Promise.resolve(t);
    for (const t2 of this.plugins)
      r2 = r2.then((r3) => {
        const a3 = this.runHook(e, i, t2, true, n2);
        return a3 ? a3.then((e2) => s.call(this.pluginContexts.get(t2), r3, e2, t2)) : r3;
      });
    return r2;
  }
  hookReduceValueSync(e, t, i, s, n2) {
    let r2 = t;
    for (const t2 of this.plugins) {
      const a3 = this.runHookSync(e, i, t2, n2);
      r2 = s.call(this.pluginContexts.get(t2), r2, a3, t2);
    }
    return r2;
  }
  hookSeq(e, t, i) {
    let s = Promise.resolve();
    for (const n2 of this.plugins)
      s = s.then(() => this.runHook(e, t, n2, false, i));
    return s;
  }
  runHook(e, t, i, s, n2) {
    const r2 = i[e];
    if (!r2)
      return;
    let a3 = this.pluginContexts.get(i);
    n2 && (a3 = n2(a3, i));
    let o2 = null;
    return Promise.resolve().then(() => {
      if (typeof r2 != "function")
        return s ? r2 : cl(e, i.name);
      const n3 = r2.apply(a3, t);
      return n3 && n3.then ? (o2 = [i.name, e, t], this.unfulfilledActions.add(o2), Promise.resolve(n3).then((e2) => (this.unfulfilledActions.delete(o2), e2))) : n3;
    }).catch((t2) => (o2 !== null && this.unfulfilledActions.delete(o2), Yo(t2, i.name, { hook: e })));
  }
  runHookSync(e, t, i, s) {
    const n2 = i[e];
    if (!n2)
      return;
    let r2 = this.pluginContexts.get(i);
    s && (r2 = s(r2, i));
    try {
      return typeof n2 != "function" ? cl(e, i.name) : n2.apply(r2, t);
    } catch (t2) {
      return Yo(t2, i.name, { hook: e });
    }
  }
}
class dl {
  constructor(e, t) {
    var i, s;
    if (this.options = e, this.cachedModules = /* @__PURE__ */ new Map(), this.deoptimizationTracker = new U(), this.entryModules = [], this.modulesById = /* @__PURE__ */ new Map(), this.needsTreeshakingPass = false, this.phase = Gs.LOAD_AND_PARSE, this.scope = new al(), this.watchFiles = /* @__PURE__ */ Object.create(null), this.watchMode = false, this.externalModules = [], this.implicitEntryModules = [], this.modules = [], this.getModuleInfo = (e2) => {
      const t2 = this.modulesById.get(e2);
      return t2 ? t2.info : null;
    }, e.cache !== false) {
      if ((i = e.cache) === null || i === void 0 ? void 0 : i.modules)
        for (const t2 of e.cache.modules)
          this.cachedModules.set(t2.id, t2);
      this.pluginCache = ((s = e.cache) === null || s === void 0 ? void 0 : s.plugins) || /* @__PURE__ */ Object.create(null);
      for (const e2 in this.pluginCache) {
        const t2 = this.pluginCache[e2];
        for (const e3 of Object.values(t2))
          e3[0]++;
      }
    }
    if (t) {
      this.watchMode = true;
      const e2 = (...e3) => this.pluginDriver.hookParallel("watchChange", e3), i2 = () => this.pluginDriver.hookParallel("closeWatcher", []);
      t.onCurrentAwaited("change", e2), t.onCurrentAwaited("close", i2);
    }
    this.pluginDriver = new ul(this, e, e.plugins, this.pluginCache), this.acornParser = Ha.extend(...e.acornInjectPlugins), this.moduleLoader = new tl(this, this.modulesById, this.options, this.pluginDriver);
  }
  async build() {
    en("generate module graph", 2), await this.generateModuleGraph(), tn("generate module graph", 2), en("sort modules", 2), this.phase = Gs.ANALYSE, this.sortModules(), tn("sort modules", 2), en("mark included statements", 2), this.includeStatements(), tn("mark included statements", 2), this.phase = Gs.GENERATE;
  }
  contextParse(e, t = {}) {
    const i = t.onComment, s = [];
    t.onComment = i && typeof i == "function" ? (e2, n3, r2, a3, ...o2) => (s.push({ end: a3, start: r2, type: e2 ? "Block" : "Line", value: n3 }), i.call(t, e2, n3, r2, a3, ...o2)) : s;
    const n2 = this.acornParser.parse(e, __spreadValues(__spreadValues({}, this.options.acorn), t));
    return typeof i == "object" && i.push(...s), t.onComment = i, function(e2, t2, i2) {
      const s2 = [], n3 = [];
      for (const t3 of e2)
        lt.test(t3.value) ? s2.push(t3) : it.test(t3.value) && n3.push(t3);
      for (const e3 of n3)
        ht(t2, e3, false);
      st(t2, { annotationIndex: 0, annotations: s2, code: i2 });
    }(s, n2, e), n2;
  }
  getCache() {
    for (const e in this.pluginCache) {
      const t = this.pluginCache[e];
      let i = true;
      for (const [e2, s] of Object.entries(t))
        s[0] >= this.options.experimentalCacheExpiry ? delete t[e2] : i = false;
      i && delete this.pluginCache[e];
    }
    return { modules: this.modules.map((e) => e.toJSON()), plugins: this.pluginCache };
  }
  async generateModuleGraph() {
    var e;
    if ({ entryModules: this.entryModules, implicitEntryModules: this.implicitEntryModules } = await this.moduleLoader.addEntryModules((e = this.options.input, Array.isArray(e) ? e.map((e2) => ({ fileName: null, id: e2, implicitlyLoadedAfter: [], importer: void 0, name: null })) : Object.entries(e).map(([e2, t]) => ({ fileName: null, id: t, implicitlyLoadedAfter: [], importer: void 0, name: e2 }))), true), this.entryModules.length === 0)
      throw new Error("You must supply options.input to rollup");
    for (const e2 of this.modulesById.values())
      e2 instanceof ln ? this.modules.push(e2) : this.externalModules.push(e2);
  }
  includeStatements() {
    for (const e of [...this.entryModules, ...this.implicitEntryModules])
      rn(e);
    if (this.options.treeshake) {
      let e = 1;
      do {
        en(`treeshaking pass ${e}`, 3), this.needsTreeshakingPass = false;
        for (const e2 of this.modules)
          e2.isExecuted && (e2.info.moduleSideEffects === "no-treeshake" ? e2.includeAllInBundle() : e2.include());
        if (e === 1)
          for (const e2 of [...this.entryModules, ...this.implicitEntryModules])
            e2.preserveSignature !== false && (e2.includeAllExports(false), this.needsTreeshakingPass = true);
        tn("treeshaking pass " + e++, 3);
      } while (this.needsTreeshakingPass);
    } else
      for (const e of this.modules)
        e.includeAllInBundle();
    for (const e of this.externalModules)
      e.warnUnusedImports();
    for (const e of this.implicitEntryModules)
      for (const t of e.implicitlyLoadedAfter)
        t.info.isEntry || t.isIncluded() || pe(be(t));
  }
  sortModules() {
    const { orderedModules: e, cyclePaths: t } = function(e2) {
      let t2 = 0;
      const i = [], s = /* @__PURE__ */ new Set(), n2 = /* @__PURE__ */ new Set(), r2 = /* @__PURE__ */ new Map(), a3 = [], o2 = (e3) => {
        if (e3 instanceof ln) {
          for (const t3 of e3.dependencies)
            r2.has(t3) ? s.has(t3) || i.push(Jr(t3, e3, r2)) : (r2.set(t3, e3), o2(t3));
          for (const t3 of e3.implicitlyLoadedBefore)
            n2.add(t3);
          for (const { resolution: t3 } of e3.dynamicImports)
            t3 instanceof ln && n2.add(t3);
          a3.push(e3);
        }
        e3.execIndex = t2++, s.add(e3);
      };
      for (const t3 of e2)
        r2.has(t3) || (r2.set(t3, null), o2(t3));
      for (const e3 of n2)
        r2.has(e3) || (r2.set(e3, null), o2(e3));
      return { cyclePaths: i, orderedModules: a3 };
    }(this.entryModules);
    for (const e2 of t)
      this.options.onwarn({ code: "CIRCULAR_DEPENDENCY", cycle: e2, importer: e2[0], message: `Circular dependency: ${e2.join(" -> ")}` });
    this.modules = e;
    for (const e2 of this.modules)
      e2.bindReferences();
    this.warnForMissingExports();
  }
  warnForMissingExports() {
    for (const e of this.modules)
      for (const t of e.importDescriptions.values())
        t.name === "*" || t.module.getVariableForExportName(t.name)[0] || e.warn({ code: "NON_EXISTENT_EXPORT", message: `Non-existent export '${t.name}' is imported from ${he(t.module.id)}`, name: t.name, source: t.module.id }, t.start);
  }
}
function pl(e) {
  return Array.isArray(e) ? e.filter(Boolean) : e ? [e] : [];
}
function fl(e, t) {
  return t();
}
const ml = (e) => console.warn(e.message || e);
function gl(e, t, i, s, n2 = /$./) {
  const r2 = new Set(t), a3 = Object.keys(e).filter((e2) => !(r2.has(e2) || n2.test(e2)));
  a3.length > 0 && s({ code: "UNKNOWN_OPTION", message: `Unknown ${i}: ${a3.join(", ")}. Allowed options: ${[...r2].sort().join(", ")}` });
}
const yl = { recommended: { annotations: true, correctVarValueBeforeDeclaration: false, moduleSideEffects: () => true, propertyReadSideEffects: true, tryCatchDeoptimization: true, unknownGlobalSideEffects: false }, safest: { annotations: true, correctVarValueBeforeDeclaration: true, moduleSideEffects: () => true, propertyReadSideEffects: true, tryCatchDeoptimization: true, unknownGlobalSideEffects: true }, smallest: { annotations: true, correctVarValueBeforeDeclaration: false, moduleSideEffects: () => false, propertyReadSideEffects: false, tryCatchDeoptimization: false, unknownGlobalSideEffects: false } }, xl = { es2015: { arrowFunctions: true, constBindings: true, objectShorthand: true, reservedNamesAsProps: true, symbols: true }, es5: { arrowFunctions: false, constBindings: false, objectShorthand: false, reservedNamesAsProps: true, symbols: false } }, El = (e, t, i, s) => {
  const n2 = e == null ? void 0 : e.preset;
  if (n2) {
    const s2 = t[n2];
    if (s2)
      return __spreadValues(__spreadValues({}, s2), e);
    pe(xe(`${i}.preset`, bl(i), `valid values are ${oe(Object.keys(t))}`, n2));
  }
  return ((e2, t2, i2) => (s2) => {
    if (typeof s2 == "string") {
      const n3 = e2[s2];
      if (n3)
        return n3;
      pe(xe(t2, bl(t2), `valid values are ${i2}${oe(Object.keys(e2))}. You can also supply an object for more fine-grained control`, s2));
    }
    return ((e3) => e3 && typeof e3 == "object" ? e3 : {})(s2);
  })(t, i, s)(e);
}, bl = (e) => e.split(".").join("").toLowerCase();
const vl = (e) => {
  const { onwarn: t } = e;
  return t ? (e2) => {
    e2.toString = () => {
      let t2 = "";
      return e2.plugin && (t2 += `(${e2.plugin} plugin) `), e2.loc && (t2 += `${he(e2.loc.file)} (${e2.loc.line}:${e2.loc.column}) `), t2 += e2.message, t2;
    }, t(e2, ml);
  } : ml;
}, Sl = (e) => __spreadValues({ allowAwaitOutsideFunction: true, ecmaVersion: "latest", preserveParens: false, sourceType: "module" }, e.acorn), Al = (e) => pl(e.acornInjectPlugins), Il = (e) => {
  var t;
  return ((t = e.cache) === null || t === void 0 ? void 0 : t.cache) || e.cache;
}, kl = (e) => {
  if (e === true)
    return () => true;
  if (typeof e == "function")
    return (t, ...i) => !t.startsWith("\0") && e(t, ...i) || false;
  if (e) {
    const t = /* @__PURE__ */ new Set(), i = [];
    for (const s of pl(e))
      s instanceof RegExp ? i.push(s) : t.add(s);
    return (e2, ...s) => t.has(e2) || i.some((t2) => t2.test(e2));
  }
  return () => false;
}, Pl = (e, t, i) => {
  const s = e.inlineDynamicImports;
  return s && Pe('The "inlineDynamicImports" option is deprecated. Use the "output.inlineDynamicImports" option instead.', false, t, i), s;
}, wl = (e) => {
  const t = e.input;
  return t == null ? [] : typeof t == "string" ? [t] : t;
}, Cl = (e, t, i) => {
  const s = e.manualChunks;
  return s && Pe('The "manualChunks" option is deprecated. Use the "output.manualChunks" option instead.', false, t, i), s;
}, _l = (e) => {
  const t = e.maxParallelFileReads;
  return typeof t == "number" ? t <= 0 ? 1 / 0 : t : 20;
}, Nl = (e, t) => {
  const i = e.moduleContext;
  if (typeof i == "function")
    return (e2) => {
      var s;
      return (s = i(e2)) !== null && s !== void 0 ? s : t;
    };
  if (i) {
    const e2 = /* @__PURE__ */ Object.create(null);
    for (const [t2, s] of Object.entries(i))
      e2[O(t2)] = s;
    return (i2) => e2[i2] || t;
  }
  return () => t;
}, $l = (e, t) => {
  const i = e.preserveEntrySignatures;
  return i == null && t.add("preserveEntrySignatures"), i != null ? i : "strict";
}, Tl = (e, t, i) => {
  const s = e.preserveModules;
  return s && Pe('The "preserveModules" option is deprecated. Use the "output.preserveModules" option instead.', false, t, i), s;
}, Ol = (e, t, i) => {
  const s = e.treeshake;
  if (s === false)
    return false;
  const n2 = El(e.treeshake, yl, "treeshake", "false, true, ");
  return n2.pureExternalModules !== void 0 && Pe(`The "treeshake.pureExternalModules" option is deprecated. The "treeshake.moduleSideEffects" option should be used instead. "treeshake.pureExternalModules: true" is equivalent to "treeshake.moduleSideEffects: 'no-external'"`, true, t, i), { annotations: n2.annotations !== false, correctVarValueBeforeDeclaration: n2.correctVarValueBeforeDeclaration === true, moduleSideEffects: typeof s == "object" && s.pureExternalModules ? Rl(s.moduleSideEffects, s.pureExternalModules) : Rl(n2.moduleSideEffects, void 0), propertyReadSideEffects: n2.propertyReadSideEffects === "always" ? "always" : n2.propertyReadSideEffects !== false, tryCatchDeoptimization: n2.tryCatchDeoptimization !== false, unknownGlobalSideEffects: n2.unknownGlobalSideEffects !== false };
}, Rl = (e, t) => {
  if (typeof e == "boolean")
    return () => e;
  if (e === "no-external")
    return (e2, t2) => !t2;
  if (typeof e == "function")
    return (t2, i2) => !!t2.startsWith("\0") || e(t2, i2) !== false;
  if (Array.isArray(e)) {
    const t2 = new Set(e);
    return (e2) => t2.has(e2);
  }
  e && pe(xe("treeshake.moduleSideEffects", "treeshake", 'please use one of false, "no-external", a function or an array'));
  const i = kl(t);
  return (e2, t2) => !(t2 && i(e2));
}, Ml = /[\x00-\x1F\x7F<>*#"{}|^[\]`;?:&=+$,]/g, Dl = /^[a-z]:/i;
function Ll(e) {
  const t = Dl.exec(e), i = t ? t[0] : "";
  return i + e.substr(i.length).replace(Ml, "_");
}
const Vl = (e, t, i) => {
  const { file: s } = e;
  if (typeof s == "string") {
    if (t)
      return pe(xe("output.file", "outputdir", 'you must set "output.dir" instead of "output.file" when using the "output.preserveModules" option'));
    if (!Array.isArray(i.input))
      return pe(xe("output.file", "outputdir", 'you must set "output.dir" instead of "output.file" when providing named inputs'));
  }
  return s;
}, Bl = (e) => {
  const t = e.format;
  switch (t) {
    case void 0:
    case "es":
    case "esm":
    case "module":
      return "es";
    case "cjs":
    case "commonjs":
      return "cjs";
    case "system":
    case "systemjs":
      return "system";
    case "amd":
    case "iife":
    case "umd":
      return t;
    default:
      return pe({ message: 'You must specify "output.format", which can be one of "amd", "cjs", "system", "es", "iife" or "umd".', url: "https://rollupjs.org/guide/en/#outputformat" });
  }
}, Fl = (e, t) => {
  var i;
  const s = ((i = e.inlineDynamicImports) !== null && i !== void 0 ? i : t.inlineDynamicImports) || false, { input: n2 } = t;
  return s && (Array.isArray(n2) ? n2 : Object.keys(n2)).length > 1 ? pe(xe("output.inlineDynamicImports", "outputinlinedynamicimports", 'multiple inputs are not supported when "output.inlineDynamicImports" is true')) : s;
}, zl = (e, t, i) => {
  var s;
  const n2 = ((s = e.preserveModules) !== null && s !== void 0 ? s : i.preserveModules) || false;
  if (n2) {
    if (t)
      return pe(xe("output.inlineDynamicImports", "outputinlinedynamicimports", 'this option is not supported for "output.preserveModules"'));
    if (i.preserveEntrySignatures === false)
      return pe(xe("preserveEntrySignatures", "preserveentrysignatures", 'setting this option to false is not supported for "output.preserveModules"'));
  }
  return n2;
}, jl = (e, t) => {
  const i = e.preferConst;
  return i != null && ke('The "output.preferConst" option is deprecated. Use the "output.generatedCode.constBindings" option instead.', false, t), !!i;
}, Ul = (e) => {
  const { preserveModulesRoot: t } = e;
  if (t != null)
    return O(t);
}, Gl = (e) => {
  const t = __spreadValues({ autoId: false, basePath: "", define: "define" }, e.amd);
  if ((t.autoId || t.basePath) && t.id)
    return pe(xe("output.amd.id", "outputamd", 'this option cannot be used together with "output.amd.autoId"/"output.amd.basePath"'));
  if (t.basePath && !t.autoId)
    return pe(xe("output.amd.basePath", "outputamd", 'this option only works with "output.amd.autoId"'));
  let i;
  return i = t.autoId ? { autoId: true, basePath: t.basePath, define: t.define } : { autoId: false, define: t.define, id: t.id }, i;
}, Hl = (e, t) => {
  const i = e[t];
  return typeof i == "function" ? i : () => i || "";
}, Wl = (e, t) => {
  const { dir: i } = e;
  return typeof i == "string" && typeof t == "string" ? pe(xe("output.dir", "outputdir", 'you must set either "output.file" for a single-file build or "output.dir" when generating multiple chunks')) : i;
}, ql = (e, t) => {
  const i = e.dynamicImportFunction;
  return i && ke('The "output.dynamicImportFunction" option is deprecated. Use the "renderDynamicImport" plugin hook instead.', false, t), i;
}, Kl = (e, t) => {
  const i = e.entryFileNames;
  return i == null && t.add("entryFileNames"), i != null ? i : "[name].js";
};
function Xl(e, t) {
  const i = e.exports;
  if (i == null)
    t.add("exports");
  else if (!["default", "named", "none", "auto"].includes(i))
    return pe((s = i, { code: me.INVALID_EXPORT_OPTION, message: `"output.exports" must be "default", "named", "none", "auto", or left unspecified (defaults to "auto"), received "${s}"`, url: "https://rollupjs.org/guide/en/#outputexports" }));
  var s;
  return i || "auto";
}
const Yl = (e, t) => {
  const i = El(e.generatedCode, xl, "output.generatedCode", "");
  return { arrowFunctions: i.arrowFunctions === true, constBindings: i.constBindings === true || t, objectShorthand: i.objectShorthand === true, reservedNamesAsProps: i.reservedNamesAsProps === true, symbols: i.symbols === true };
}, Ql = (e, t) => {
  if (t)
    return "";
  const i = e.indent;
  return i === false ? "" : i == null || i;
}, Zl = /* @__PURE__ */ new Set(["auto", "esModule", "default", "defaultOnly", true, false]), Jl = (e, t) => {
  const i = e.interop, s = /* @__PURE__ */ new Set(), n2 = (e2) => {
    if (!s.has(e2)) {
      if (s.add(e2), !Zl.has(e2))
        return pe(xe("output.interop", "outputinterop", `use one of ${Array.from(Zl, (e3) => JSON.stringify(e3)).join(", ")}`, e2));
      typeof e2 == "boolean" && ke({ message: `The boolean value "${e2}" for the "output.interop" option is deprecated. Use ${e2 ? '"auto"' : '"esModule", "default" or "defaultOnly"'} instead.`, url: "https://rollupjs.org/guide/en/#outputinterop" }, false, t);
    }
    return e2;
  };
  if (typeof i == "function") {
    const e2 = /* @__PURE__ */ Object.create(null);
    let t2 = null;
    return (s2) => s2 === null ? t2 || n2(t2 = i(s2)) : s2 in e2 ? e2[s2] : n2(e2[s2] = i(s2));
  }
  return i === void 0 ? () => true : () => n2(i);
}, eh = (e, t, i, s) => {
  const n2 = e.manualChunks || s.manualChunks;
  if (n2) {
    if (t)
      return pe(xe("output.manualChunks", "outputmanualchunks", 'this option is not supported for "output.inlineDynamicImports"'));
    if (i)
      return pe(xe("output.manualChunks", "outputmanualchunks", 'this option is not supported for "output.preserveModules"'));
  }
  return n2 || {};
}, th = (e, t, i) => {
  var s;
  return (s = e.minifyInternalExports) !== null && s !== void 0 ? s : i || t === "es" || t === "system";
}, ih = (e, t, i) => {
  const s = e.namespaceToStringTag;
  return s != null ? (ke('The "output.namespaceToStringTag" option is deprecated. Use the "output.generatedCode.symbols" option instead.', false, i), s) : t.symbols || false;
};
function sh(e) {
  return async function(e2, t) {
    const { options: i, unsetOptions: s } = await async function(e3, t2) {
      if (!e3)
        throw new Error("You must supply an options object to rollup");
      const i2 = pl(e3.plugins), { options: s2, unsetOptions: n3 } = function(e4) {
        var t3, i3, s3;
        const n4 = /* @__PURE__ */ new Set(), r3 = (t3 = e4.context) !== null && t3 !== void 0 ? t3 : "undefined", a4 = vl(e4), o2 = e4.strictDeprecations || false, l2 = { acorn: Sl(e4), acornInjectPlugins: Al(e4), cache: Il(e4), context: r3, experimentalCacheExpiry: (i3 = e4.experimentalCacheExpiry) !== null && i3 !== void 0 ? i3 : 10, external: kl(e4.external), inlineDynamicImports: Pl(e4, a4, o2), input: wl(e4), makeAbsoluteExternalsRelative: (s3 = e4.makeAbsoluteExternalsRelative) === null || s3 === void 0 || s3, manualChunks: Cl(e4, a4, o2), maxParallelFileReads: _l(e4), moduleContext: Nl(e4, r3), onwarn: a4, perf: e4.perf || false, plugins: pl(e4.plugins), preserveEntrySignatures: $l(e4, n4), preserveModules: Tl(e4, a4, o2), preserveSymlinks: e4.preserveSymlinks || false, shimMissingExports: e4.shimMissingExports || false, strictDeprecations: o2, treeshake: Ol(e4, a4, o2) };
        return gl(e4, [...Object.keys(l2), "watch"], "input options", l2.onwarn, /^(output)$/), { options: l2, unsetOptions: n4 };
      }(await i2.reduce(function(e4) {
        return async (t3, i3) => i3.options && await i3.options.call({ meta: { rollupVersion: "2.75.6", watchMode: e4 } }, await t3) || t3;
      }(t2), Promise.resolve(e3)));
      return nh(s2.plugins, "at position "), { options: s2, unsetOptions: n3 };
    }(e2, t !== null);
    !function(e3) {
      e3.perf ? (Xs = /* @__PURE__ */ new Map(), en = Qs, tn = Zs, e3.plugins = e3.plugins.map(nn)) : (en = Ks, tn = Ks);
    }(i);
    const n2 = new dl(i, t), r2 = e2.cache !== false;
    delete i.cache, delete e2.cache, en("BUILD", 1), await fl(n2.pluginDriver, async () => {
      try {
        await n2.pluginDriver.hookParallel("buildStart", [i]), await n2.build();
      } catch (e3) {
        const t2 = Object.keys(n2.watchFiles);
        throw t2.length > 0 && (e3.watchFiles = t2), await n2.pluginDriver.hookParallel("buildEnd", [e3]), await n2.pluginDriver.hookParallel("closeBundle", []), e3;
      }
      await n2.pluginDriver.hookParallel("buildEnd", []);
    }), tn("BUILD", 1);
    const a3 = { cache: r2 ? n2.getCache() : void 0, async close() {
      a3.closed || (a3.closed = true, await n2.pluginDriver.hookParallel("closeBundle", []));
    }, closed: false, generate: async (e3) => a3.closed ? pe(Ie()) : rh(false, i, s, e3, n2), watchFiles: Object.keys(n2.watchFiles), write: async (e3) => a3.closed ? pe(Ie()) : rh(true, i, s, e3, n2) };
    i.perf && (a3.getTimings = Js);
    return a3;
  }(e, null);
}
function nh(e, t) {
  e.forEach((e2, i) => {
    e2.name || (e2.name = `${t}${i + 1}`);
  });
}
function rh(e, t, i, s, n2) {
  const { options: r2, outputPluginDriver: a3, unsetOptions: o2 } = function(e2, t2, i2, s2) {
    if (!e2)
      throw new Error("You must supply an options object");
    const n3 = pl(e2.plugins);
    nh(n3, "at output position ");
    const r3 = t2.createOutputPluginDriver(n3);
    return __spreadProps(__spreadValues({}, ah(i2, s2, e2, r3)), { outputPluginDriver: r3 });
  }(s, n2.pluginDriver, t, i);
  return fl(0, async () => {
    const i2 = new ia(r2, o2, t, a3, n2), s2 = await i2.generate(e);
    if (e) {
      if (!r2.dir && !r2.file)
        return pe({ code: "MISSING_OPTION", message: 'You must specify "output.file" or "output.dir" for the build.' });
      await Promise.all(Object.values(s2).map((e2) => async function(e3, t2) {
        const i3 = O(t2.dir || N(t2.file), e3.fileName);
        let s3, n3;
        if (await Ko.mkdir(N(i3), { recursive: true }), e3.type === "asset")
          n3 = e3.source;
        else if (n3 = e3.code, t2.sourcemap && e3.map) {
          let r3;
          t2.sourcemap === "inline" ? r3 = e3.map.toUrl() : (r3 = `${_(e3.fileName)}.map`, s3 = Ko.writeFile(`${i3}.map`, e3.map.toString())), t2.sourcemap !== "hidden" && (n3 += `//# sourceMappingURL=${r3}
`);
        }
        return Promise.all([Ko.writeFile(i3, n3), s3]);
      }(e2, r2))), await a3.hookParallel("writeBundle", [r2, s2]);
    }
    return l2 = s2, { output: Object.values(l2).filter((e2) => Object.keys(e2).length > 0).sort((e2, t2) => {
      const i3 = lh(e2), s3 = lh(t2);
      return i3 === s3 ? 0 : i3 < s3 ? -1 : 1;
    }) };
    var l2;
  });
}
function ah(e, t, i, s) {
  return function(e2, t2, i2) {
    var s2, n2, r2, a3, o2, l2, h2;
    const c2 = new Set(i2), u2 = e2.compact || false, d2 = Bl(e2), p2 = Fl(e2, t2), f2 = zl(e2, p2, t2), m3 = Vl(e2, f2, t2), g2 = jl(e2, t2), y2 = Yl(e2, g2), x2 = { amd: Gl(e2), assetFileNames: (s2 = e2.assetFileNames) !== null && s2 !== void 0 ? s2 : "assets/[name]-[hash][extname]", banner: Hl(e2, "banner"), chunkFileNames: (n2 = e2.chunkFileNames) !== null && n2 !== void 0 ? n2 : "[name]-[hash].js", compact: u2, dir: Wl(e2, m3), dynamicImportFunction: ql(e2, t2), entryFileNames: Kl(e2, c2), esModule: (r2 = e2.esModule) === null || r2 === void 0 || r2, exports: Xl(e2, c2), extend: e2.extend || false, externalLiveBindings: (a3 = e2.externalLiveBindings) === null || a3 === void 0 || a3, file: m3, footer: Hl(e2, "footer"), format: d2, freeze: (o2 = e2.freeze) === null || o2 === void 0 || o2, generatedCode: y2, globals: e2.globals || {}, hoistTransitiveImports: (l2 = e2.hoistTransitiveImports) === null || l2 === void 0 || l2, indent: Ql(e2, u2), inlineDynamicImports: p2, interop: Jl(e2, t2), intro: Hl(e2, "intro"), manualChunks: eh(e2, p2, f2, t2), minifyInternalExports: th(e2, d2, u2), name: e2.name, namespaceToStringTag: ih(e2, y2, t2), noConflict: e2.noConflict || false, outro: Hl(e2, "outro"), paths: e2.paths || {}, plugins: pl(e2.plugins), preferConst: g2, preserveModules: f2, preserveModulesRoot: Ul(e2), sanitizeFileName: typeof e2.sanitizeFileName == "function" ? e2.sanitizeFileName : e2.sanitizeFileName === false ? (e3) => e3 : Ll, sourcemap: e2.sourcemap || false, sourcemapExcludeSources: e2.sourcemapExcludeSources || false, sourcemapFile: e2.sourcemapFile, sourcemapPathTransform: e2.sourcemapPathTransform, strict: (h2 = e2.strict) === null || h2 === void 0 || h2, systemNullSetters: e2.systemNullSetters || false, validate: e2.validate || false };
    return gl(e2, Object.keys(x2), "output options", t2.onwarn), { options: x2, unsetOptions: c2 };
  }(s.hookReduceArg0Sync("outputOptions", [i.output || i], (e2, t2) => t2 || e2, (e2) => {
    const t2 = () => e2.error({ code: me.CANNOT_EMIT_FROM_OPTIONS_HOOK, message: 'Cannot emit files or set asset sources in the "outputOptions" hook, use the "renderStart" hook instead.' });
    return __spreadProps(__spreadValues({}, e2), { emitFile: t2, setAssetSource: t2 });
  }), e, t);
}
var oh;
function lh(e) {
  return e.type === "asset" ? oh.ASSET : e.isEntry ? oh.ENTRY_CHUNK : oh.SECONDARY_CHUNK;
}
!function(e) {
  e[e.ENTRY_CHUNK = 0] = "ENTRY_CHUNK", e[e.SECONDARY_CHUNK = 1] = "SECONDARY_CHUNK", e[e.ASSET = 2] = "ASSET";
}(oh || (oh = {}));
const isFileSchema = (id) => id.startsWith("file://") || id.startsWith("/");
const isRelativePath = (id) => stripSchema(id).startsWith(".");
const stripSchema = (id) => id.replace(/^file\:(\/\/)?/, "");
const SEARCH_EXTENSIONS = [
  "/index.tsx",
  "/index.ts",
  "/index.js",
  ".tsx",
  ".ts",
  ".json",
  ".js"
];
function searchFile(vfs, filepath, extensions) {
  for (const ext of ["", ...extensions]) {
    if (vfs.has(filepath + ext)) {
      return filepath + ext;
    }
  }
}
const virtualfs = (vfs) => {
  return {
    name: "virtual-fs",
    resolveId(id, importer) {
      const normalized = stripSchema(id);
      if (isFileSchema(id) && importer == null) {
        return searchFile(vfs, normalized, SEARCH_EXTENSIONS);
      }
      if (importer && isFileSchema(importer) && isRelativePath(id)) {
        const rawImporter = importer.replace(/^file\:/, "");
        const fullpath = rawImporter ? resolve$1(dirname(rawImporter), normalized) : id;
        const reslovedWithExt = searchFile(vfs, fullpath, SEARCH_EXTENSIONS);
        if (reslovedWithExt)
          return reslovedWithExt;
        this.warn(`[rollup-plugin-virtual-fs] can not resolve id: ${fullpath}`);
      }
    },
    load(id) {
      const real = stripSchema(id);
      const ret = vfs.get(real);
      if (ret)
        return ret;
      throw new Error(`[virtualFs] ${id} is not found on files`);
    }
  };
};
const treeshake = async (code, options = {}, rollupOpts = {}) => {
  const inputFile = "/input.js";
  const vfs = new Map(Object.entries({
    [inputFile]: code
  }));
  const build2 = await sh({
    input: inputFile,
    treeshake: true,
    plugins: [virtualfs(vfs)]
  });
  const { output } = await build2.generate(__spreadValues({
    format: options?.format ?? "esm",
    compact: options?.minify,
    name: options?.globalName
  }, Object.assign({}, rollupOpts)));
  let content = output[0].code;
  return content?.trim?.();
};
function encode(data) {
  if (typeof data === "string") {
    return btoa(data);
  } else {
    const d2 = new Uint8Array(data);
    let dataString = "";
    for (let i = 0; i < d2.length; ++i) {
      dataString += String.fromCharCode(d2[i]);
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
export { ALIAS, ALIAS_NAMESPACE, ALIAS_RESOLVE, AnsiBuffer, CACHE, CACHE_NAME, CDN, CDN_NAMESPACE, CDN_RESOLVE, DEFAULT_CDN_HOST, DefaultConfig, DeprecatedAPIs, EMPTY_EXPORT, ESCAPE_TO_COLOR, EVENTS, EVENTS_OPTS, EXTERNAL, EXTERNALS_NAMESPACE, EasyDefaultConfig, ExternalPackages, FileSystem, HTTP, HTTP_NAMESPACE, HTTP_RESOLVE, INPUT_EVENTS, PLATFORM_AUTO, PolyfillKeys, PolyfillMap, RESOLVE_EXTENSIONS, SEARCH_EXTENSIONS, SEP, SEP_PATTERN, STATE, VIRTUAL_FILESYSTEM_NAMESPACE, VIRTUAL_FS, render as ansi, bail, mod as base64, basename, build, debounce, decode$1 as decode, deepAssign, deepDiff, deepEqual, delimiter, dirname, encode$1 as encode, extname, fetchAssets, fetchPkg, format, fromFileUrl, getCDNOrigin, getCDNStyle, getCDNUrl, getESBUILD, getFile, getPackage, getPackages, getPureImportPath, getRegistryURL, getRequest, getResolvedPath, globToRegExp, htmlEscape, inferLoader, init, isAbsolute, isAlias, isBareImport, isExternal, isFileSchema, isGlob, isObject, isPrimitive, isRelativePath, isValidKey, join, joinGlobs, loop, newRequest, normalize, normalizeGlob, parse$1 as parse, parseConfig, parseShareQuery, parseTreeshakeExports, mod$1 as path, posix, relative, render, resolve$1 as resolve, resolveImports, searchFile, sep, setFile, stripSchema, toFileUrl, toName, toNamespacedPath, treeshake, urlJoin, virtualfs };
//# sourceMappingURL=index.mjs.map
