var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a2, b2) => {
  for (var prop in b2 || (b2 = {}))
    if (__hasOwnProp.call(b2, prop))
      __defNormalProp(a2, prop, b2[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b2)) {
      if (__propIsEnum.call(b2, prop))
        __defNormalProp(a2, prop, b2[prop]);
    }
  return a2;
};
var __spreadProps = (a2, b2) => __defProps(a2, __getOwnPropDescs(b2));
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
import { g as getWASM, a as gzip, c as compress, b as compress$1 } from "./compress.js";
export { m as brotli, e as denoflate, f as lz4 } from "./compress.js";
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
        } catch (e2) {
          events.emit("logger.warn", `You may want to change CDNs. The current CDN ${!/unpkg\.com/.test(origin) ? `"${origin}" doesn't` : `path "${origin}${argPath}" may not`} support package.json files.
There is a chance the CDN you're using doesn't support looking through the package.json of packages. bundlejs will switch to inaccurate guesses for package versions. For package.json support you may wish to use https://unpkg.com or other CDN's that support package.json.`).emit("logger.warn", e2);
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
          } catch (e2) {
            try {
              ({ content, url } = await fetchPkg(argPath(".tsx"), events));
            } catch (e22) {
              events.emit("logger.error", e22.toString());
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
  } catch (e2) {
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
  constructor(e2) {
    this.map = new Map(e2);
  }
  getMap() {
    return this.map;
  }
  get(e2) {
    return this.map.get(e2);
  }
  keys() {
    return Array.from(this.map.keys());
  }
  values() {
    return Array.from(this.map.values());
  }
  set(e2, t) {
    return this.map.set(e2, t), this;
  }
  add(e2) {
    let n2 = this.size;
    return this.set(n2, e2), this;
  }
  get size() {
    return this.map.size;
  }
  get length() {
    return this.map.size;
  }
  last(e2 = 1) {
    let t = this.keys()[this.size - e2];
    return this.get(t);
  }
  delete(e2) {
    return this.map.delete(e2);
  }
  remove(e2) {
    return this.map.delete(e2), this;
  }
  clear() {
    return this.map.clear(), this;
  }
  has(e2) {
    return this.map.has(e2);
  }
  entries() {
    return this.map.entries();
  }
  forEach(e2, t) {
    return this.map.forEach(e2, t), this;
  }
  [Symbol.iterator]() {
    return this.entries();
  }
}, b$1 = (p2, e2, ...t) => {
  p2.forEach((n2) => {
    n2[e2](...t);
  });
};
var h$1 = ({ callback: p2 = () => {
}, scope: e2 = null, name: t = "event" }) => ({ callback: p2, scope: e2, name: t }), c$1 = class extends o$1 {
  constructor(e2 = "event") {
    super();
    this.name = e2;
  }
}, y$2 = class extends o$1 {
  constructor() {
    super();
  }
  getEvent(e2) {
    let t = this.get(e2);
    return t instanceof c$1 ? t : (this.set(e2, new c$1(e2)), this.get(e2));
  }
  newListener(e2, t, n2) {
    let r2 = this.getEvent(e2);
    return r2.add(h$1({ name: e2, callback: t, scope: n2 })), r2;
  }
  on(e2, t, n2) {
    if (typeof e2 == "undefined" || e2 == null)
      return this;
    typeof e2 == "string" && (e2 = e2.trim().split(/\s/g));
    let r2, i, a2 = typeof e2 == "object" && !Array.isArray(e2), l2 = a2 ? t : n2;
    return a2 || (i = t), Object.keys(e2).forEach((s) => {
      r2 = a2 ? s : e2[s], a2 && (i = e2[s]), this.newListener(r2, i, l2);
    }, this), this;
  }
  removeListener(e2, t, n2) {
    let r2 = this.get(e2);
    if (r2 instanceof c$1 && t) {
      let i = h$1({ name: e2, callback: t, scope: n2 });
      r2.forEach((a2, l2) => {
        if (a2.callback === i.callback && a2.scope === i.scope)
          return r2.remove(l2);
      });
    }
    return r2;
  }
  off(e2, t, n2) {
    if (typeof e2 == "undefined" || e2 == null)
      return this;
    typeof e2 == "string" && (e2 = e2.trim().split(/\s/g));
    let r2, i, a2 = typeof e2 == "object" && !Array.isArray(e2), l2 = a2 ? t : n2;
    return a2 || (i = t), Object.keys(e2).forEach((s) => {
      r2 = a2 ? s : e2[s], a2 && (i = e2[s]), typeof i == "function" ? this.removeListener(r2, i, l2) : this.remove(r2);
    }, this), this;
  }
  once(e2, t, n2) {
    if (typeof e2 == "undefined" || e2 == null)
      return this;
    typeof e2 == "string" && (e2 = e2.trim().split(/\s/g));
    let r2 = typeof e2 == "object" && !Array.isArray(e2);
    return Object.keys(e2).forEach((i) => {
      let a2 = r2 ? i : e2[i], l2 = r2 ? e2[i] : t, s = r2 ? t : n2, u2 = (...f3) => {
        l2.apply(s, f3), this.removeListener(a2, u2, s);
      };
      this.newListener(a2, u2, s);
    }, this), this;
  }
  emit(e2, ...t) {
    return typeof e2 == "undefined" || e2 == null ? this : (typeof e2 == "string" && (e2 = e2.trim().split(/\s/g)), e2.forEach((n2) => {
      let r2 = this.get(n2);
      r2 instanceof c$1 && r2.forEach((i) => {
        let { callback: a2, scope: l2 } = i;
        a2.apply(l2, t);
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
  } catch (e2) {
    throw e2;
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
          wasmModule: new WebAssembly.Module(await source)
        }, opts));
      }
      await getWASM();
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
  const { build: bundle, transform, transformSync, formatMessages } = await init(CONFIG.init);
  const _a2 = CONFIG.esbuild ?? {}, { define = {}, loader = {} } = _a2, esbuildOpts = __objRest(_a2, ["define", "loader"]);
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
    } catch (e2) {
      if (e2.errors) {
        let asciMsgs = [...await createNotice(e2.errors, "error", false)];
        let htmlMsgs = [...await createNotice(e2.errors, "error")];
        EVENTS.emit("logger.error", asciMsgs, htmlMsgs);
        let message = (htmlMsgs.length > 1 ? `${htmlMsgs.length} error(s) ` : "") + "(if you are having trouble solving this issue, please create a new issue in the repo, https://github.com/okikio/bundle)";
        return EVENTS.emit("logger.error", message);
      } else
        throw e2;
      console.error(e2);
    }
    content = await Promise.all([...STATE.assets].concat(result?.outputFiles)?.map(async ({ path: path2, text, contents }) => {
      let ignoreFile = /\.(wasm|png|jpeg|webp)$/.test(path2);
      if (/\.map$/.test(path2))
        return encode$1("");
      if (esbuildOpts?.logLevel == "verbose") {
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
    let totalCompressedSize = bytes((await Promise.all(content.map((code) => {
      switch (type) {
        case "lz4":
          return compress$1(code);
        case "brotli":
          return compress(code, code.length, level);
        default:
          return gzip(code, level);
      }
    }))).reduce((acc, { length }) => acc + length, 0));
    return {
      result,
      outputFiles: result.outputFiles,
      initialSize: `${totalByteLength}`,
      size: `${totalCompressedSize} (${type})`
    };
  } catch (e2) {
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
    for (let f3 = 0; f3 < r2.length; f3++)
      x$1[r2][r2.charAt(f3)] = f3;
  }
  return x$1[r2][s];
}
function k$1(r2) {
  return r2 == null ? "" : r2 == "" ? null : (r2 = r2.replaceAll(" ", "+"), A$1(r2.length, 32, (s) => M$1(y$1, r2.charAt(s))));
}
function A$1(r2, s, f3) {
  let p2 = [], h2 = 4, i = 4, w2 = 3, o2 = "", g2 = [], u2, d2, l2, a2, c2, e2, t, n2 = { val: f3(0), position: s, index: 1 };
  for (u2 = 0; u2 < 3; u2 += 1)
    p2[u2] = u2;
  for (l2 = 0, c2 = Math.pow(2, 2), e2 = 1; e2 != c2; )
    a2 = n2.val & n2.position, n2.position >>= 1, n2.position == 0 && (n2.position = s, n2.val = f3(n2.index++)), l2 |= (a2 > 0 ? 1 : 0) * e2, e2 <<= 1;
  switch (l2) {
    case 0:
      for (l2 = 0, c2 = Math.pow(2, 8), e2 = 1; e2 != c2; )
        a2 = n2.val & n2.position, n2.position >>= 1, n2.position == 0 && (n2.position = s, n2.val = f3(n2.index++)), l2 |= (a2 > 0 ? 1 : 0) * e2, e2 <<= 1;
      t = String.fromCharCode(l2);
      break;
    case 1:
      for (l2 = 0, c2 = Math.pow(2, 16), e2 = 1; e2 != c2; )
        a2 = n2.val & n2.position, n2.position >>= 1, n2.position == 0 && (n2.position = s, n2.val = f3(n2.index++)), l2 |= (a2 > 0 ? 1 : 0) * e2, e2 <<= 1;
      t = String.fromCharCode(l2);
      break;
    case 2:
      return "";
  }
  for (p2[3] = t, d2 = t, g2.push(t); ; ) {
    if (n2.index > r2)
      return "";
    for (l2 = 0, c2 = Math.pow(2, w2), e2 = 1; e2 != c2; )
      a2 = n2.val & n2.position, n2.position >>= 1, n2.position == 0 && (n2.position = s, n2.val = f3(n2.index++)), l2 |= (a2 > 0 ? 1 : 0) * e2, e2 <<= 1;
    switch (t = l2) {
      case 0:
        for (l2 = 0, c2 = Math.pow(2, 8), e2 = 1; e2 != c2; )
          a2 = n2.val & n2.position, n2.position >>= 1, n2.position == 0 && (n2.position = s, n2.val = f3(n2.index++)), l2 |= (a2 > 0 ? 1 : 0) * e2, e2 <<= 1;
        p2[i++] = String.fromCharCode(l2), t = i - 1, h2--;
        break;
      case 1:
        for (l2 = 0, c2 = Math.pow(2, 16), e2 = 1; e2 != c2; )
          a2 = n2.val & n2.position, n2.position >>= 1, n2.position == 0 && (n2.position = s, n2.val = f3(n2.index++)), l2 |= (a2 > 0 ? 1 : 0) * e2, e2 <<= 1;
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
  } catch (e2) {
  }
};
const parseConfig = (shareURL) => {
  try {
    const searchParams = shareURL.searchParams;
    const config = searchParams.get("config") ?? "{}";
    return deepAssign({}, EasyDefaultConfig, JSON.parse(config ? config : "{}"));
  } catch (e2) {
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
  } catch (e2) {
    console.warn(e2);
    throw e2;
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
  } catch (e2) {
    console.warn(e2);
    throw e2;
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
for (var e2 = "2.75.6", t = {}, i = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", s = 0; s < i.length; s++)
  t[i.charCodeAt(s)] = s;
function n(e2, t, i) {
  i === 4 ? e2.push([t[0], t[1], t[2], t[3]]) : i === 5 ? e2.push([t[0], t[1], t[2], t[3], t[4]]) : i === 1 && e2.push([t[0]]);
}
function r(e2) {
  var t = "";
  e2 = e2 < 0 ? -e2 << 1 | 1 : e2 << 1;
  do {
    var s = 31 & e2;
    (e2 >>>= 5) > 0 && (s |= 32), t += i[s];
  } while (e2 > 0);
  return t;
}
class a {
  constructor(e2) {
    this.bits = e2 instanceof a ? e2.bits.slice() : [];
  }
  add(e2) {
    this.bits[e2 >> 5] |= 1 << (31 & e2);
  }
  has(e2) {
    return !!(this.bits[e2 >> 5] & 1 << (31 & e2));
  }
}
class o {
  constructor(e2, t, i) {
    this.start = e2, this.end = t, this.original = i, this.intro = "", this.outro = "", this.content = i, this.storeName = false, this.edited = false, Object.defineProperties(this, { previous: { writable: true, value: null }, next: { writable: true, value: null } });
  }
  appendLeft(e2) {
    this.outro += e2;
  }
  appendRight(e2) {
    this.intro = this.intro + e2;
  }
  clone() {
    const e2 = new o(this.start, this.end, this.original);
    return e2.intro = this.intro, e2.outro = this.outro, e2.content = this.content, e2.storeName = this.storeName, e2.edited = this.edited, e2;
  }
  contains(e2) {
    return this.start < e2 && e2 < this.end;
  }
  eachNext(e2) {
    let t = this;
    for (; t; )
      e2(t), t = t.next;
  }
  eachPrevious(e2) {
    let t = this;
    for (; t; )
      e2(t), t = t.previous;
  }
  edit(e2, t, i) {
    return this.content = e2, i || (this.intro = "", this.outro = ""), this.storeName = t, this.edited = true, this;
  }
  prependLeft(e2) {
    this.outro = e2 + this.outro;
  }
  prependRight(e2) {
    this.intro = e2 + this.intro;
  }
  split(e2) {
    const t = e2 - this.start, i = this.original.slice(0, t), s = this.original.slice(t);
    this.original = i;
    const n2 = new o(e2, this.end, s);
    return n2.outro = this.outro, this.outro = "", this.end = e2, this.edited ? (n2.edit("", false), this.content = "") : this.content = i, n2.next = this.next, n2.next && (n2.next.previous = n2), n2.previous = this, this.next = n2, n2;
  }
  toString() {
    return this.intro + this.content + this.outro;
  }
  trimEnd(e2) {
    if (this.outro = this.outro.replace(e2, ""), this.outro.length)
      return true;
    const t = this.content.replace(e2, "");
    return t.length ? (t !== this.content && this.split(this.start + t.length).edit("", void 0, true), true) : (this.edit("", void 0, true), this.intro = this.intro.replace(e2, ""), !!this.intro.length || void 0);
  }
  trimStart(e2) {
    if (this.intro = this.intro.replace(e2, ""), this.intro.length)
      return true;
    const t = this.content.replace(e2, "");
    return t.length ? (t !== this.content && (this.split(this.end - t.length), this.edit("", void 0, true)), true) : (this.edit("", void 0, true), this.outro = this.outro.replace(e2, ""), !!this.outro.length || void 0);
  }
}
let l = () => {
  throw new Error("Unsupported environment: `window.btoa` or `Buffer` should be supported.");
};
typeof window != "undefined" && typeof window.btoa == "function" ? l = (e2) => window.btoa(unescape(encodeURIComponent(e2))) : typeof Buffer == "function" && (l = (e2) => Buffer.from(e2, "utf-8").toString("base64"));
class h {
  constructor(e2) {
    this.version = 3, this.file = e2.file, this.sources = e2.sources, this.sourcesContent = e2.sourcesContent, this.names = e2.names, this.mappings = function(e3) {
      for (var t = 0, i = 0, s = 0, n2 = 0, a2 = "", o2 = 0; o2 < e3.length; o2++) {
        var l2 = e3[o2];
        if (o2 > 0 && (a2 += ";"), l2.length !== 0) {
          for (var h2 = 0, c2 = [], u2 = 0, d2 = l2; u2 < d2.length; u2++) {
            var p2 = d2[u2], f3 = r(p2[0] - h2);
            h2 = p2[0], p2.length > 1 && (f3 += r(p2[1] - t) + r(p2[2] - i) + r(p2[3] - s), t = p2[1], i = p2[2], s = p2[3]), p2.length === 5 && (f3 += r(p2[4] - n2), n2 = p2[4]), c2.push(f3);
          }
          a2 += c2.join(",");
        }
      }
      return a2;
    }(e2.mappings);
  }
  toString() {
    return JSON.stringify(this);
  }
  toUrl() {
    return "data:application/json;charset=utf-8;base64," + l(this.toString());
  }
}
function c(e2) {
  const t = e2.split("\n"), i = t.filter((e3) => /^\t+/.test(e3)), s = t.filter((e3) => /^ {2,}/.test(e3));
  if (i.length === 0 && s.length === 0)
    return null;
  if (i.length >= s.length)
    return "	";
  const n2 = s.reduce((e3, t2) => {
    const i2 = /^ +/.exec(t2)[0].length;
    return Math.min(i2, e3);
  }, 1 / 0);
  return new Array(n2 + 1).join(" ");
}
function u(e2, t) {
  const i = e2.split(/[/\\]/), s = t.split(/[/\\]/);
  for (i.pop(); i[0] === s[0]; )
    i.shift(), s.shift();
  if (i.length) {
    let e3 = i.length;
    for (; e3--; )
      i[e3] = "..";
  }
  return i.concat(s).join("/");
}
const d = Object.prototype.toString;
function p(e2) {
  return d.call(e2) === "[object Object]";
}
function f2(e2) {
  const t = e2.split("\n"), i = [];
  for (let e3 = 0, s = 0; e3 < t.length; e3++)
    i.push(s), s += t[e3].length + 1;
  return function(e3) {
    let t2 = 0, s = i.length;
    for (; t2 < s; ) {
      const n3 = t2 + s >> 1;
      e3 < i[n3] ? s = n3 : t2 = n3 + 1;
    }
    const n2 = t2 - 1;
    return { line: n2, column: e3 - i[n2] };
  };
}
class m2 {
  constructor(e2) {
    this.hires = e2, this.generatedCodeLine = 0, this.generatedCodeColumn = 0, this.raw = [], this.rawSegments = this.raw[this.generatedCodeLine] = [], this.pending = null;
  }
  addEdit(e2, t, i, s) {
    if (t.length) {
      const t2 = [this.generatedCodeColumn, e2, i.line, i.column];
      s >= 0 && t2.push(s), this.rawSegments.push(t2);
    } else
      this.pending && this.rawSegments.push(this.pending);
    this.advance(t), this.pending = null;
  }
  addUneditedChunk(e2, t, i, s, n2) {
    let r2 = t.start, a2 = true;
    for (; r2 < t.end; )
      (this.hires || a2 || n2.has(r2)) && this.rawSegments.push([this.generatedCodeColumn, e2, s.line, s.column]), i[r2] === "\n" ? (s.line += 1, s.column = 0, this.generatedCodeLine += 1, this.raw[this.generatedCodeLine] = this.rawSegments = [], this.generatedCodeColumn = 0, a2 = true) : (s.column += 1, this.generatedCodeColumn += 1, a2 = false), r2 += 1;
    this.pending = null;
  }
  advance(e2) {
    if (!e2)
      return;
    const t = e2.split("\n");
    if (t.length > 1) {
      for (let e3 = 0; e3 < t.length - 1; e3++)
        this.generatedCodeLine++, this.raw[this.generatedCodeLine] = this.rawSegments = [];
      this.generatedCodeColumn = 0;
    }
    this.generatedCodeColumn += t[t.length - 1].length;
  }
}
const g = "\n", y = { insertLeft: false, insertRight: false, storeName: false };
class x {
  constructor(e2, t = {}) {
    const i = new o(0, e2.length, e2);
    Object.defineProperties(this, { original: { writable: true, value: e2 }, outro: { writable: true, value: "" }, intro: { writable: true, value: "" }, firstChunk: { writable: true, value: i }, lastChunk: { writable: true, value: i }, lastSearchedChunk: { writable: true, value: i }, byStart: { writable: true, value: {} }, byEnd: { writable: true, value: {} }, filename: { writable: true, value: t.filename }, indentExclusionRanges: { writable: true, value: t.indentExclusionRanges }, sourcemapLocations: { writable: true, value: new a() }, storedNames: { writable: true, value: {} }, indentStr: { writable: true, value: c(e2) } }), this.byStart[0] = i, this.byEnd[e2.length] = i;
  }
  addSourcemapLocation(e2) {
    this.sourcemapLocations.add(e2);
  }
  append(e2) {
    if (typeof e2 != "string")
      throw new TypeError("outro content must be a string");
    return this.outro += e2, this;
  }
  appendLeft(e2, t) {
    if (typeof t != "string")
      throw new TypeError("inserted content must be a string");
    this._split(e2);
    const i = this.byEnd[e2];
    return i ? i.appendLeft(t) : this.intro += t, this;
  }
  appendRight(e2, t) {
    if (typeof t != "string")
      throw new TypeError("inserted content must be a string");
    this._split(e2);
    const i = this.byStart[e2];
    return i ? i.appendRight(t) : this.outro += t, this;
  }
  clone() {
    const e2 = new x(this.original, { filename: this.filename });
    let t = this.firstChunk, i = e2.firstChunk = e2.lastSearchedChunk = t.clone();
    for (; t; ) {
      e2.byStart[i.start] = i, e2.byEnd[i.end] = i;
      const s = t.next, n2 = s && s.clone();
      n2 && (i.next = n2, n2.previous = i, i = n2), t = s;
    }
    return e2.lastChunk = i, this.indentExclusionRanges && (e2.indentExclusionRanges = this.indentExclusionRanges.slice()), e2.sourcemapLocations = new a(this.sourcemapLocations), e2.intro = this.intro, e2.outro = this.outro, e2;
  }
  generateDecodedMap(e2) {
    e2 = e2 || {};
    const t = Object.keys(this.storedNames), i = new m2(e2.hires), s = f2(this.original);
    return this.intro && i.advance(this.intro), this.firstChunk.eachNext((e3) => {
      const n2 = s(e3.start);
      e3.intro.length && i.advance(e3.intro), e3.edited ? i.addEdit(0, e3.content, n2, e3.storeName ? t.indexOf(e3.original) : -1) : i.addUneditedChunk(0, e3, this.original, n2, this.sourcemapLocations), e3.outro.length && i.advance(e3.outro);
    }), { file: e2.file ? e2.file.split(/[/\\]/).pop() : null, sources: [e2.source ? u(e2.file || "", e2.source) : null], sourcesContent: e2.includeContent ? [this.original] : [null], names: t, mappings: i.raw };
  }
  generateMap(e2) {
    return new h(this.generateDecodedMap(e2));
  }
  getIndentString() {
    return this.indentStr === null ? "	" : this.indentStr;
  }
  indent(e2, t) {
    const i = /^[^\r\n]/gm;
    if (p(e2) && (t = e2, e2 = void 0), (e2 = e2 !== void 0 ? e2 : this.indentStr || "	") === "")
      return this;
    const s = {};
    if ((t = t || {}).exclude) {
      (typeof t.exclude[0] == "number" ? [t.exclude] : t.exclude).forEach((e3) => {
        for (let t2 = e3[0]; t2 < e3[1]; t2 += 1)
          s[t2] = true;
      });
    }
    let n2 = t.indentStart !== false;
    const r2 = (t2) => n2 ? `${e2}${t2}` : (n2 = true, t2);
    this.intro = this.intro.replace(i, r2);
    let a2 = 0, o2 = this.firstChunk;
    for (; o2; ) {
      const t2 = o2.end;
      if (o2.edited)
        s[a2] || (o2.content = o2.content.replace(i, r2), o2.content.length && (n2 = o2.content[o2.content.length - 1] === "\n"));
      else
        for (a2 = o2.start; a2 < t2; ) {
          if (!s[a2]) {
            const t3 = this.original[a2];
            t3 === "\n" ? n2 = true : t3 !== "\r" && n2 && (n2 = false, a2 === o2.start || (this._splitChunk(o2, a2), o2 = o2.next), o2.prependRight(e2));
          }
          a2 += 1;
        }
      a2 = o2.end, o2 = o2.next;
    }
    return this.outro = this.outro.replace(i, r2), this;
  }
  insert() {
    throw new Error("magicString.insert(...) is deprecated. Use prependRight(...) or appendLeft(...)");
  }
  insertLeft(e2, t) {
    return y.insertLeft || (console.warn("magicString.insertLeft(...) is deprecated. Use magicString.appendLeft(...) instead"), y.insertLeft = true), this.appendLeft(e2, t);
  }
  insertRight(e2, t) {
    return y.insertRight || (console.warn("magicString.insertRight(...) is deprecated. Use magicString.prependRight(...) instead"), y.insertRight = true), this.prependRight(e2, t);
  }
  move(e2, t, i) {
    if (i >= e2 && i <= t)
      throw new Error("Cannot move a selection inside itself");
    this._split(e2), this._split(t), this._split(i);
    const s = this.byStart[e2], n2 = this.byEnd[t], r2 = s.previous, a2 = n2.next, o2 = this.byStart[i];
    if (!o2 && n2 === this.lastChunk)
      return this;
    const l2 = o2 ? o2.previous : this.lastChunk;
    return r2 && (r2.next = a2), a2 && (a2.previous = r2), l2 && (l2.next = s), o2 && (o2.previous = n2), s.previous || (this.firstChunk = n2.next), n2.next || (this.lastChunk = s.previous, this.lastChunk.next = null), s.previous = l2, n2.next = o2 || null, l2 || (this.firstChunk = s), o2 || (this.lastChunk = n2), this;
  }
  overwrite(e2, t, i, s) {
    if (typeof i != "string")
      throw new TypeError("replacement content must be a string");
    for (; e2 < 0; )
      e2 += this.original.length;
    for (; t < 0; )
      t += this.original.length;
    if (t > this.original.length)
      throw new Error("end is out of bounds");
    if (e2 === t)
      throw new Error("Cannot overwrite a zero-length range \u2013 use appendLeft or prependRight instead");
    this._split(e2), this._split(t), s === true && (y.storeName || (console.warn("The final argument to magicString.overwrite(...) should be an options object. See https://github.com/rich-harris/magic-string"), y.storeName = true), s = { storeName: true });
    const n2 = s !== void 0 && s.storeName, r2 = s !== void 0 && s.contentOnly;
    if (n2) {
      const i2 = this.original.slice(e2, t);
      Object.defineProperty(this.storedNames, i2, { writable: true, value: true, enumerable: true });
    }
    const a2 = this.byStart[e2], l2 = this.byEnd[t];
    if (a2) {
      let e3 = a2;
      for (; e3 !== l2; ) {
        if (e3.next !== this.byStart[e3.end])
          throw new Error("Cannot overwrite across a split point");
        e3 = e3.next, e3.edit("", false);
      }
      a2.edit(i, n2, r2);
    } else {
      const s2 = new o(e2, t, "").edit(i, n2);
      l2.next = s2, s2.previous = l2;
    }
    return this;
  }
  prepend(e2) {
    if (typeof e2 != "string")
      throw new TypeError("outro content must be a string");
    return this.intro = e2 + this.intro, this;
  }
  prependLeft(e2, t) {
    if (typeof t != "string")
      throw new TypeError("inserted content must be a string");
    this._split(e2);
    const i = this.byEnd[e2];
    return i ? i.prependLeft(t) : this.intro = t + this.intro, this;
  }
  prependRight(e2, t) {
    if (typeof t != "string")
      throw new TypeError("inserted content must be a string");
    this._split(e2);
    const i = this.byStart[e2];
    return i ? i.prependRight(t) : this.outro = t + this.outro, this;
  }
  remove(e2, t) {
    for (; e2 < 0; )
      e2 += this.original.length;
    for (; t < 0; )
      t += this.original.length;
    if (e2 === t)
      return this;
    if (e2 < 0 || t > this.original.length)
      throw new Error("Character is out of bounds");
    if (e2 > t)
      throw new Error("end must be greater than start");
    this._split(e2), this._split(t);
    let i = this.byStart[e2];
    for (; i; )
      i.intro = "", i.outro = "", i.edit(""), i = t > i.end ? this.byStart[i.end] : null;
    return this;
  }
  lastChar() {
    if (this.outro.length)
      return this.outro[this.outro.length - 1];
    let e2 = this.lastChunk;
    do {
      if (e2.outro.length)
        return e2.outro[e2.outro.length - 1];
      if (e2.content.length)
        return e2.content[e2.content.length - 1];
      if (e2.intro.length)
        return e2.intro[e2.intro.length - 1];
    } while (e2 = e2.previous);
    return this.intro.length ? this.intro[this.intro.length - 1] : "";
  }
  lastLine() {
    let e2 = this.outro.lastIndexOf(g);
    if (e2 !== -1)
      return this.outro.substr(e2 + 1);
    let t = this.outro, i = this.lastChunk;
    do {
      if (i.outro.length > 0) {
        if (e2 = i.outro.lastIndexOf(g), e2 !== -1)
          return i.outro.substr(e2 + 1) + t;
        t = i.outro + t;
      }
      if (i.content.length > 0) {
        if (e2 = i.content.lastIndexOf(g), e2 !== -1)
          return i.content.substr(e2 + 1) + t;
        t = i.content + t;
      }
      if (i.intro.length > 0) {
        if (e2 = i.intro.lastIndexOf(g), e2 !== -1)
          return i.intro.substr(e2 + 1) + t;
        t = i.intro + t;
      }
    } while (i = i.previous);
    return e2 = this.intro.lastIndexOf(g), e2 !== -1 ? this.intro.substr(e2 + 1) + t : this.intro + t;
  }
  slice(e2 = 0, t = this.original.length) {
    for (; e2 < 0; )
      e2 += this.original.length;
    for (; t < 0; )
      t += this.original.length;
    let i = "", s = this.firstChunk;
    for (; s && (s.start > e2 || s.end <= e2); ) {
      if (s.start < t && s.end >= t)
        return i;
      s = s.next;
    }
    if (s && s.edited && s.start !== e2)
      throw new Error(`Cannot use replaced character ${e2} as slice start anchor.`);
    const n2 = s;
    for (; s; ) {
      !s.intro || n2 === s && s.start !== e2 || (i += s.intro);
      const r2 = s.start < t && s.end >= t;
      if (r2 && s.edited && s.end !== t)
        throw new Error(`Cannot use replaced character ${t} as slice end anchor.`);
      const a2 = n2 === s ? e2 - s.start : 0, o2 = r2 ? s.content.length + t - s.end : s.content.length;
      if (i += s.content.slice(a2, o2), !s.outro || r2 && s.end !== t || (i += s.outro), r2)
        break;
      s = s.next;
    }
    return i;
  }
  snip(e2, t) {
    const i = this.clone();
    return i.remove(0, e2), i.remove(t, i.original.length), i;
  }
  _split(e2) {
    if (this.byStart[e2] || this.byEnd[e2])
      return;
    let t = this.lastSearchedChunk;
    const i = e2 > t.end;
    for (; t; ) {
      if (t.contains(e2))
        return this._splitChunk(t, e2);
      t = i ? this.byStart[t.end] : this.byEnd[t.start];
    }
  }
  _splitChunk(e2, t) {
    if (e2.edited && e2.content.length) {
      const i2 = f2(this.original)(t);
      throw new Error(`Cannot split a chunk that has already been edited (${i2.line}:${i2.column} \u2013 "${e2.original}")`);
    }
    const i = e2.split(t);
    return this.byEnd[t] = e2, this.byStart[t] = i, this.byEnd[i.end] = i, e2 === this.lastChunk && (this.lastChunk = i), this.lastSearchedChunk = e2, true;
  }
  toString() {
    let e2 = this.intro, t = this.firstChunk;
    for (; t; )
      e2 += t.toString(), t = t.next;
    return e2 + this.outro;
  }
  isEmpty() {
    let e2 = this.firstChunk;
    do {
      if (e2.intro.length && e2.intro.trim() || e2.content.length && e2.content.trim() || e2.outro.length && e2.outro.trim())
        return false;
    } while (e2 = e2.next);
    return true;
  }
  length() {
    let e2 = this.firstChunk, t = 0;
    do {
      t += e2.intro.length + e2.content.length + e2.outro.length;
    } while (e2 = e2.next);
    return t;
  }
  trimLines() {
    return this.trim("[\\r\\n]");
  }
  trim(e2) {
    return this.trimStart(e2).trimEnd(e2);
  }
  trimEndAborted(e2) {
    const t = new RegExp((e2 || "\\s") + "+$");
    if (this.outro = this.outro.replace(t, ""), this.outro.length)
      return true;
    let i = this.lastChunk;
    do {
      const e3 = i.end, s = i.trimEnd(t);
      if (i.end !== e3 && (this.lastChunk === i && (this.lastChunk = i.next), this.byEnd[i.end] = i, this.byStart[i.next.start] = i.next, this.byEnd[i.next.end] = i.next), s)
        return true;
      i = i.previous;
    } while (i);
    return false;
  }
  trimEnd(e2) {
    return this.trimEndAborted(e2), this;
  }
  trimStartAborted(e2) {
    const t = new RegExp("^" + (e2 || "\\s") + "+");
    if (this.intro = this.intro.replace(t, ""), this.intro.length)
      return true;
    let i = this.firstChunk;
    do {
      const e3 = i.end, s = i.trimStart(t);
      if (i.end !== e3 && (i === this.lastChunk && (this.lastChunk = i.next), this.byEnd[i.end] = i, this.byStart[i.next.start] = i.next, this.byEnd[i.next.end] = i.next), s)
        return true;
      i = i.next;
    } while (i);
    return false;
  }
  trimStart(e2) {
    return this.trimStartAborted(e2), this;
  }
  hasChanged() {
    return this.original !== this.toString();
  }
  replace(e2, t) {
    function i(e3, i2) {
      return typeof t == "string" ? t.replace(/\$(\$|&|\d+)/g, (t2, i3) => {
        if (i3 === "$")
          return "$";
        if (i3 === "&")
          return e3[0];
        return +i3 < e3.length ? e3[+i3] : `$${i3}`;
      }) : t(...e3, e3.index, i2, e3.groups);
    }
    if (typeof e2 != "string" && e2.global) {
      (function(e3, t2) {
        let i2;
        const s = [];
        for (; i2 = e3.exec(t2); )
          s.push(i2);
        return s;
      })(e2, this.original).forEach((e3) => {
        e3.index != null && this.overwrite(e3.index, e3.index + e3[0].length, i(e3, this.original));
      });
    } else {
      const t2 = this.original.match(e2);
      t2 && t2.index != null && this.overwrite(t2.index, t2.index + t2[0].length, i(t2, this.original));
    }
    return this;
  }
}
const E = Object.prototype.hasOwnProperty;
class b {
  constructor(e2 = {}) {
    this.intro = e2.intro || "", this.separator = e2.separator !== void 0 ? e2.separator : "\n", this.sources = [], this.uniqueSources = [], this.uniqueSourceIndexByFilename = {};
  }
  addSource(e2) {
    if (e2 instanceof x)
      return this.addSource({ content: e2, filename: e2.filename, separator: this.separator });
    if (!p(e2) || !e2.content)
      throw new Error("bundle.addSource() takes an object with a `content` property, which should be an instance of MagicString, and an optional `filename`");
    if (["filename", "indentExclusionRanges", "separator"].forEach((t) => {
      E.call(e2, t) || (e2[t] = e2.content[t]);
    }), e2.separator === void 0 && (e2.separator = this.separator), e2.filename)
      if (E.call(this.uniqueSourceIndexByFilename, e2.filename)) {
        const t = this.uniqueSources[this.uniqueSourceIndexByFilename[e2.filename]];
        if (e2.content.original !== t.content)
          throw new Error(`Illegal source: same filename (${e2.filename}), different contents`);
      } else
        this.uniqueSourceIndexByFilename[e2.filename] = this.uniqueSources.length, this.uniqueSources.push({ filename: e2.filename, content: e2.content.original });
    return this.sources.push(e2), this;
  }
  append(e2, t) {
    return this.addSource({ content: new x(e2), separator: t && t.separator || "" }), this;
  }
  clone() {
    const e2 = new b({ intro: this.intro, separator: this.separator });
    return this.sources.forEach((t) => {
      e2.addSource({ filename: t.filename, content: t.content.clone(), separator: t.separator });
    }), e2;
  }
  generateDecodedMap(e2 = {}) {
    const t = [];
    this.sources.forEach((e3) => {
      Object.keys(e3.content.storedNames).forEach((e4) => {
        ~t.indexOf(e4) || t.push(e4);
      });
    });
    const i = new m2(e2.hires);
    return this.intro && i.advance(this.intro), this.sources.forEach((e3, s) => {
      s > 0 && i.advance(this.separator);
      const n2 = e3.filename ? this.uniqueSourceIndexByFilename[e3.filename] : -1, r2 = e3.content, a2 = f2(r2.original);
      r2.intro && i.advance(r2.intro), r2.firstChunk.eachNext((s2) => {
        const o2 = a2(s2.start);
        s2.intro.length && i.advance(s2.intro), e3.filename ? s2.edited ? i.addEdit(n2, s2.content, o2, s2.storeName ? t.indexOf(s2.original) : -1) : i.addUneditedChunk(n2, s2, r2.original, o2, r2.sourcemapLocations) : i.advance(s2.content), s2.outro.length && i.advance(s2.outro);
      }), r2.outro && i.advance(r2.outro);
    }), { file: e2.file ? e2.file.split(/[/\\]/).pop() : null, sources: this.uniqueSources.map((t2) => e2.file ? u(e2.file, t2.filename) : t2.filename), sourcesContent: this.uniqueSources.map((t2) => e2.includeContent ? t2.content : null), names: t, mappings: i.raw };
  }
  generateMap(e2) {
    return new h(this.generateDecodedMap(e2));
  }
  getIndentString() {
    const e2 = {};
    return this.sources.forEach((t) => {
      const i = t.content.indentStr;
      i !== null && (e2[i] || (e2[i] = 0), e2[i] += 1);
    }), Object.keys(e2).sort((t, i) => e2[t] - e2[i])[0] || "	";
  }
  indent(e2) {
    if (arguments.length || (e2 = this.getIndentString()), e2 === "")
      return this;
    let t = !this.intro || this.intro.slice(-1) === "\n";
    return this.sources.forEach((i, s) => {
      const n2 = i.separator !== void 0 ? i.separator : this.separator, r2 = t || s > 0 && /\r?\n$/.test(n2);
      i.content.indent(e2, { exclude: i.indentExclusionRanges, indentStart: r2 }), t = i.content.lastChar() === "\n";
    }), this.intro && (this.intro = e2 + this.intro.replace(/^[^\n]/gm, (t2, i) => i > 0 ? e2 + t2 : t2)), this;
  }
  prepend(e2) {
    return this.intro = e2 + this.intro, this;
  }
  toString() {
    const e2 = this.sources.map((e3, t) => {
      const i = e3.separator !== void 0 ? e3.separator : this.separator;
      return (t > 0 ? i : "") + e3.content.toString();
    }).join("");
    return this.intro + e2;
  }
  isEmpty() {
    return (!this.intro.length || !this.intro.trim()) && !this.sources.some((e2) => !e2.content.isEmpty());
  }
  length() {
    return this.sources.reduce((e2, t) => e2 + t.content.length(), this.intro.length);
  }
  trimLines() {
    return this.trim("[\\r\\n]");
  }
  trim(e2) {
    return this.trimStart(e2).trimEnd(e2);
  }
  trimStart(e2) {
    const t = new RegExp("^" + (e2 || "\\s") + "+");
    if (this.intro = this.intro.replace(t, ""), !this.intro) {
      let t2, i = 0;
      do {
        if (t2 = this.sources[i++], !t2)
          break;
      } while (!t2.content.trimStartAborted(e2));
    }
    return this;
  }
  trimEnd(e2) {
    const t = new RegExp((e2 || "\\s") + "+$");
    let i, s = this.sources.length - 1;
    do {
      if (i = this.sources[s--], !i) {
        this.intro = this.intro.replace(t, "");
        break;
      }
    } while (!i.content.trimEndAborted(e2));
    return this;
  }
}
const v = /^(?:\/|(?:[A-Za-z]:)?[\\|/])/, S = /^\.?\.\//, A = /\\/g, I = /[/\\]/, k = /\.[^.]+$/;
function P(e2) {
  return v.test(e2);
}
function w(e2) {
  return S.test(e2);
}
function C(e2) {
  return e2.replace(A, "/");
}
function _(e2) {
  return e2.split(I).pop() || "";
}
function N(e2) {
  const t = /[/\\][^/\\]*$/.exec(e2);
  if (!t)
    return ".";
  const i = e2.slice(0, -t[0].length);
  return i || "/";
}
function $(e2) {
  const t = k.exec(_(e2));
  return t ? t[0] : "";
}
function T(e2, t) {
  const i = e2.split(I).filter(Boolean), s = t.split(I).filter(Boolean);
  for (i[0] === "." && i.shift(), s[0] === "." && s.shift(); i[0] && s[0] && i[0] === s[0]; )
    i.shift(), s.shift();
  for (; s[0] === ".." && i.length > 0; )
    s.shift(), i.pop();
  for (; i.pop(); )
    s.unshift("..");
  return s.join("/");
}
function O(...e2) {
  const t = e2.shift();
  if (!t)
    return "/";
  let i = t.split(I);
  for (const t2 of e2)
    if (P(t2))
      i = t2.split(I);
    else {
      const e3 = t2.split(I);
      for (; e3[0] === "." || e3[0] === ".."; ) {
        e3.shift() === ".." && i.pop();
      }
      i.push(...e3);
    }
  return i.join("/");
}
function R(e2, t, i) {
  const s = e2.get(t);
  if (s)
    return s;
  const n2 = i();
  return e2.set(t, n2), n2;
}
const M = Symbol("Unknown Key"), D = Symbol("Unknown Non-Accessor Key"), L = Symbol("Unknown Integer"), V = [], B = [M], F = [D], z = [L], j = Symbol("Entities");
class U {
  constructor() {
    this.entityPaths = Object.create(null, { [j]: { value: /* @__PURE__ */ new Set() } });
  }
  trackEntityAtPathAndGetIfTracked(e2, t) {
    const i = this.getEntities(e2);
    return !!i.has(t) || (i.add(t), false);
  }
  withTrackedEntityAtPath(e2, t, i, s) {
    const n2 = this.getEntities(e2);
    if (n2.has(t))
      return s;
    n2.add(t);
    const r2 = i();
    return n2.delete(t), r2;
  }
  getEntities(e2) {
    let t = this.entityPaths;
    for (const i of e2)
      t = t[i] = t[i] || Object.create(null, { [j]: { value: /* @__PURE__ */ new Set() } });
    return t[j];
  }
}
const G = new U();
class H {
  constructor() {
    this.entityPaths = Object.create(null, { [j]: { value: /* @__PURE__ */ new Map() } });
  }
  trackEntityAtPathAndGetIfTracked(e2, t, i) {
    let s = this.entityPaths;
    for (const t2 of e2)
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
  deoptimizePath(e2) {
  }
  deoptimizeThisOnInteractionAtPath({ thisArg: e2 }, t, i) {
    e2.deoptimizePath(B);
  }
  getLiteralValueAtPath(e2, t, i) {
    return W;
  }
  getReturnExpressionWhenCalledAtPath(e2, t, i, s) {
    return X;
  }
  hasEffectsOnInteractionAtPath(e2, t, i) {
    return true;
  }
  include(e2, t, i) {
    this.included = true;
  }
  includeCallArguments(e2, t) {
    for (const i of t)
      i.include(e2, false);
  }
  shouldBeIncluded(e2) {
    return true;
  }
}
const X = new class extends K {
}(), Y = { thisArg: null, type: 0 }, Q = { args: [X], thisArg: null, type: 1 }, Z = [], J = { args: Z, thisArg: null, type: 2, withNew: false };
class ee extends K {
  constructor(e2) {
    super(), this.name = e2, this.alwaysRendered = false, this.initReached = false, this.isId = false, this.isReassigned = false, this.kind = null, this.renderBaseName = null, this.renderName = null;
  }
  addReference(e2) {
  }
  getBaseVariableName() {
    return this.renderBaseName || this.renderName || this.name;
  }
  getName(e2) {
    const t = this.renderName || this.name;
    return this.renderBaseName ? `${this.renderBaseName}${e2(t)}` : t;
  }
  hasEffectsOnInteractionAtPath(e2, { type: t }, i) {
    return t !== 0 || e2.length > 0;
  }
  include() {
    this.included = true;
  }
  markCalledFromTryStatement() {
  }
  setRenderNames(e2, t) {
    this.renderBaseName = e2, this.renderName = t;
  }
}
class te extends ee {
  constructor(e2, t) {
    super(t), this.referenced = false, this.module = e2, this.isNamespace = t === "*";
  }
  addReference(e2) {
    this.referenced = true, this.name !== "default" && this.name !== "*" || this.module.suggestName(e2.name);
  }
  hasEffectsOnInteractionAtPath(e2, { type: t }) {
    return t !== 0 || e2.length > (this.isNamespace ? 1 : 0);
  }
  include() {
    this.included || (this.included = true, this.module.used = true);
  }
}
const ie = Object.freeze(/* @__PURE__ */ Object.create(null)), se = Object.freeze({}), ne = Object.freeze([]);
function re(e2, t, i) {
  if (typeof i == "number")
    throw new Error("locate takes a { startIndex, offsetLine, offsetColumn } object as the third argument");
  return function(e3, t2) {
    t2 === void 0 && (t2 = {});
    var i2 = t2.offsetLine || 0, s = t2.offsetColumn || 0, n2 = e3.split("\n"), r2 = 0, a2 = n2.map(function(e4, t3) {
      var i3 = r2 + e4.length + 1, s2 = { start: r2, end: i3, line: t3 };
      return r2 = i3, s2;
    }), o2 = 0;
    function l2(e4, t3) {
      return e4.start <= t3 && t3 < e4.end;
    }
    function h2(e4, t3) {
      return { line: i2 + e4.line, column: s + t3 - e4.start, character: t3 };
    }
    return function(t3, i3) {
      typeof t3 == "string" && (t3 = e3.indexOf(t3, i3 || 0));
      for (var s2 = a2[o2], n3 = t3 >= s2.end ? 1 : -1; s2; ) {
        if (l2(s2, t3))
          return h2(s2, t3);
        s2 = a2[o2 += n3];
      }
    };
  }(e2, i)(t, i && i.startIndex);
}
function ae(e2) {
  return e2.replace(/^\t+/, (e3) => e3.split("	").join("  "));
}
function oe(e2, t) {
  const i = e2.length <= 1, s = e2.map((e3) => `"${e3}"`);
  let n2 = i ? s[0] : `${s.slice(0, -1).join(", ")} and ${s.slice(-1)[0]}`;
  return t && (n2 += ` ${i ? t[0] : t[1]}`), n2;
}
function le(e2) {
  const t = _(e2);
  return t.substring(0, t.length - $(e2).length);
}
function he(e2) {
  return P(e2) ? T(O(), e2) : e2;
}
function ce(e2) {
  return e2[0] === "/" || e2[0] === "." && (e2[1] === "/" || e2[1] === ".") || P(e2);
}
const ue = /^(\.\.\/)*\.\.$/;
function de(e2, t, i, s) {
  let n2 = C(T(N(e2), t));
  if (i && n2.endsWith(".js") && (n2 = n2.slice(0, -3)), s) {
    if (n2 === "")
      return "../" + _(t);
    if (ue.test(n2))
      return n2.split("/").concat(["..", _(t)]).join("/");
  }
  return n2 ? n2.startsWith("..") ? n2 : "./" + n2 : ".";
}
function pe(e2) {
  throw e2 instanceof Error || (e2 = Object.assign(new Error(e2.message), e2)), e2;
}
function fe(e2, t, i, s) {
  if (typeof t == "object") {
    const { line: i2, column: n2 } = t;
    e2.loc = { column: n2, file: s, line: i2 };
  } else {
    e2.pos = t;
    const { line: n2, column: r2 } = re(i, t, { offsetLine: 1 });
    e2.loc = { column: r2, file: s, line: n2 };
  }
  if (e2.frame === void 0) {
    const { line: t2, column: s2 } = e2.loc;
    e2.frame = function(e3, t3, i2) {
      let s3 = e3.split("\n");
      const n2 = Math.max(0, t3 - 3);
      let r2 = Math.min(t3 + 2, s3.length);
      for (s3 = s3.slice(n2, r2); !/\S/.test(s3[s3.length - 1]); )
        s3.pop(), r2 -= 1;
      const a2 = String(r2).length;
      return s3.map((e4, s4) => {
        const r3 = n2 + s4 + 1 === t3;
        let o2 = String(s4 + n2 + 1);
        for (; o2.length < a2; )
          o2 = ` ${o2}`;
        if (r3) {
          const t4 = function(e5) {
            let t5 = "";
            for (; e5--; )
              t5 += " ";
            return t5;
          }(a2 + 2 + ae(e4.slice(0, i2)).length) + "^";
          return `${o2}: ${ae(e4)}
${t4}`;
        }
        return `${o2}: ${ae(e4)}`;
      }).join("\n");
    }(i, t2, s2);
  }
}
var me;
function ge({ fileName: e2, code: t }, i) {
  const s = { code: me.CHUNK_INVALID, message: `Chunk "${e2}" is not valid JavaScript: ${i.message}.` };
  return fe(s, i.loc, t, e2), s;
}
function ye(e2, t, i) {
  return { code: "INVALID_EXPORT_OPTION", message: `"${e2}" was specified for "output.exports", but entry module "${he(i)}" has the following exports: ${t.join(", ")}` };
}
function xe(e2, t, i, s) {
  return { code: me.INVALID_OPTION, message: `Invalid value ${s !== void 0 ? `${JSON.stringify(s)} ` : ""}for option "${e2}" - ${i}.`, url: `https://rollupjs.org/guide/en/#${t}` };
}
function Ee(e2, t, i) {
  return { code: me.MISSING_EXPORT, message: `'${e2}' is not exported by ${he(i)}, imported by ${he(t)}`, url: "https://rollupjs.org/guide/en/#error-name-is-not-exported-by-module" };
}
function be(e2) {
  const t = Array.from(e2.implicitlyLoadedBefore, (e3) => he(e3.id)).sort();
  return { code: me.MISSING_IMPLICIT_DEPENDANT, message: `Module "${he(e2.id)}" that should be implicitly loaded before ${oe(t)} is not included in the module graph. Either it was not imported by an included module or only via a tree-shaken dynamic import, or no imported bindings were used and it had otherwise no side-effects.` };
}
function ve(e2, t, i) {
  const s = i ? "reexport" : "import";
  return { code: me.UNEXPECTED_NAMED_IMPORT, id: e2, message: `The named export "${t}" was ${s}ed from the external module ${he(e2)} even though its interop type is "defaultOnly". Either remove or change this ${s} or change the value of the "output.interop" option.`, url: "https://rollupjs.org/guide/en/#outputinterop" };
}
function Se(e2) {
  return { code: me.UNEXPECTED_NAMED_IMPORT, id: e2, message: `There was a namespace "*" reexport from the external module ${he(e2)} even though its interop type is "defaultOnly". This will be ignored as namespace reexports only reexport named exports. If this is not intended, either remove or change this reexport or change the value of the "output.interop" option.`, url: "https://rollupjs.org/guide/en/#outputinterop" };
}
function Ae(e2) {
  return { code: me.VALIDATION_ERROR, message: e2 };
}
function Ie() {
  return { code: me.ALREADY_CLOSED, message: 'Bundle is already closed, no more calls to "generate" or "write" are allowed.' };
}
function ke(e2, t, i) {
  Pe(e2, t, i.onwarn, i.strictDeprecations);
}
function Pe(e2, t, i, s) {
  if (t || s) {
    const t2 = function(e3) {
      return __spreadValues({ code: me.DEPRECATED_FEATURE }, typeof e3 == "string" ? { message: e3 } : e3);
    }(e2);
    if (s)
      return pe(t2);
    i(t2);
  }
}
!function(e2) {
  e2.ALREADY_CLOSED = "ALREADY_CLOSED", e2.ASSET_NOT_FINALISED = "ASSET_NOT_FINALISED", e2.ASSET_NOT_FOUND = "ASSET_NOT_FOUND", e2.ASSET_SOURCE_ALREADY_SET = "ASSET_SOURCE_ALREADY_SET", e2.ASSET_SOURCE_MISSING = "ASSET_SOURCE_MISSING", e2.BAD_LOADER = "BAD_LOADER", e2.CANNOT_EMIT_FROM_OPTIONS_HOOK = "CANNOT_EMIT_FROM_OPTIONS_HOOK", e2.CHUNK_NOT_GENERATED = "CHUNK_NOT_GENERATED", e2.CHUNK_INVALID = "CHUNK_INVALID", e2.CIRCULAR_REEXPORT = "CIRCULAR_REEXPORT", e2.CYCLIC_CROSS_CHUNK_REEXPORT = "CYCLIC_CROSS_CHUNK_REEXPORT", e2.DEPRECATED_FEATURE = "DEPRECATED_FEATURE", e2.EXTERNAL_SYNTHETIC_EXPORTS = "EXTERNAL_SYNTHETIC_EXPORTS", e2.FILE_NAME_CONFLICT = "FILE_NAME_CONFLICT", e2.FILE_NOT_FOUND = "FILE_NOT_FOUND", e2.INPUT_HOOK_IN_OUTPUT_PLUGIN = "INPUT_HOOK_IN_OUTPUT_PLUGIN", e2.INVALID_CHUNK = "INVALID_CHUNK", e2.INVALID_EXPORT_OPTION = "INVALID_EXPORT_OPTION", e2.INVALID_EXTERNAL_ID = "INVALID_EXTERNAL_ID", e2.INVALID_OPTION = "INVALID_OPTION", e2.INVALID_PLUGIN_HOOK = "INVALID_PLUGIN_HOOK", e2.INVALID_ROLLUP_PHASE = "INVALID_ROLLUP_PHASE", e2.MISSING_EXPORT = "MISSING_EXPORT", e2.MISSING_IMPLICIT_DEPENDANT = "MISSING_IMPLICIT_DEPENDANT", e2.MIXED_EXPORTS = "MIXED_EXPORTS", e2.NAMESPACE_CONFLICT = "NAMESPACE_CONFLICT", e2.AMBIGUOUS_EXTERNAL_NAMESPACES = "AMBIGUOUS_EXTERNAL_NAMESPACES", e2.NO_TRANSFORM_MAP_OR_AST_WITHOUT_CODE = "NO_TRANSFORM_MAP_OR_AST_WITHOUT_CODE", e2.PLUGIN_ERROR = "PLUGIN_ERROR", e2.PREFER_NAMED_EXPORTS = "PREFER_NAMED_EXPORTS", e2.SYNTHETIC_NAMED_EXPORTS_NEED_NAMESPACE_EXPORT = "SYNTHETIC_NAMED_EXPORTS_NEED_NAMESPACE_EXPORT", e2.UNEXPECTED_NAMED_IMPORT = "UNEXPECTED_NAMED_IMPORT", e2.UNRESOLVED_ENTRY = "UNRESOLVED_ENTRY", e2.UNRESOLVED_IMPORT = "UNRESOLVED_IMPORT", e2.VALIDATION_ERROR = "VALIDATION_ERROR";
}(me || (me = {}));
var we = /* @__PURE__ */ new Set(["await", "break", "case", "catch", "class", "const", "continue", "debugger", "default", "delete", "do", "else", "enum", "eval", "export", "extends", "false", "finally", "for", "function", "if", "implements", "import", "in", "instanceof", "interface", "let", "NaN", "new", "null", "package", "private", "protected", "public", "return", "static", "super", "switch", "this", "throw", "true", "try", "typeof", "undefined", "var", "void", "while", "with", "yield"]);
const Ce = /[^$_a-zA-Z0-9]/g, _e = (e2) => /\d/.test(e2[0]);
function Ne(e2) {
  return e2 = e2.replace(/-(\w)/g, (e3, t) => t.toUpperCase()).replace(Ce, "_"), (_e(e2) || we.has(e2)) && (e2 = `_${e2}`), e2 || "_";
}
class $e {
  constructor(e2, t, i, s, n2) {
    this.options = e2, this.id = t, this.renormalizeRenderPath = n2, this.declarations = /* @__PURE__ */ new Map(), this.defaultVariableName = "", this.dynamicImporters = [], this.execIndex = 1 / 0, this.exportedVariables = /* @__PURE__ */ new Map(), this.importers = [], this.mostCommonSuggestion = 0, this.nameSuggestions = /* @__PURE__ */ new Map(), this.namespaceVariableName = "", this.reexported = false, this.renderPath = void 0, this.used = false, this.variableName = "", this.suggestedVariableName = Ne(t.split(/[\\/]/).pop());
    const { importers: r2, dynamicImporters: a2 } = this, o2 = this.info = { ast: null, code: null, dynamicallyImportedIdResolutions: ne, dynamicallyImportedIds: ne, get dynamicImporters() {
      return a2.sort();
    }, hasDefaultExport: null, get hasModuleSideEffects() {
      return ke("Accessing ModuleInfo.hasModuleSideEffects from plugins is deprecated. Please use ModuleInfo.moduleSideEffects instead.", false, e2), o2.moduleSideEffects;
    }, id: t, implicitlyLoadedAfterOneOf: ne, implicitlyLoadedBefore: ne, importedIdResolutions: ne, importedIds: ne, get importers() {
      return r2.sort();
    }, isEntry: false, isExternal: true, isIncluded: null, meta: s, moduleSideEffects: i, syntheticNamedExports: false };
    Object.defineProperty(this.info, "hasModuleSideEffects", { enumerable: false });
  }
  getVariableForExportName(e2) {
    const t = this.declarations.get(e2);
    if (t)
      return [t];
    const i = new te(this, e2);
    return this.declarations.set(e2, i), this.exportedVariables.set(i, e2), [i];
  }
  setRenderPath(e2, t) {
    this.renderPath = typeof e2.paths == "function" ? e2.paths(this.id) : e2.paths[this.id], this.renderPath || (this.renderPath = this.renormalizeRenderPath ? C(T(t, this.id)) : this.id);
  }
  suggestName(e2) {
    var t;
    const i = ((t = this.nameSuggestions.get(e2)) !== null && t !== void 0 ? t : 0) + 1;
    this.nameSuggestions.set(e2, i), i > this.mostCommonSuggestion && (this.mostCommonSuggestion = i, this.suggestedVariableName = e2);
  }
  warnUnusedImports() {
    const e2 = Array.from(this.declarations).filter(([e3, t2]) => e3 !== "*" && !t2.included && !this.reexported && !t2.referenced).map(([e3]) => e3);
    if (e2.length === 0)
      return;
    const t = /* @__PURE__ */ new Set();
    for (const i2 of e2)
      for (const e3 of this.declarations.get(i2).module.importers)
        t.add(e3);
    const i = [...t];
    this.options.onwarn({ code: "UNUSED_EXTERNAL_IMPORT", message: `${oe(e2, ["is", "are"])} imported from external module "${this.id}" but never used in ${oe(i.map((e3) => he(e3)))}.`, names: e2, source: this.id, sources: i });
  }
}
const Te = { ArrayPattern(e2, t) {
  for (const i of t.elements)
    i && Te[i.type](e2, i);
}, AssignmentPattern(e2, t) {
  Te[t.left.type](e2, t.left);
}, Identifier(e2, t) {
  e2.push(t.name);
}, MemberExpression() {
}, ObjectPattern(e2, t) {
  for (const i of t.properties)
    i.type === "RestElement" ? Te.RestElement(e2, i) : Te[i.value.type](e2, i.value);
}, RestElement(e2, t) {
  Te[t.argument.type](e2, t.argument);
} }, Oe = function(e2) {
  const t = [];
  return Te[e2.type](t, e2), t;
};
new Set("break case class catch const continue debugger default delete do else export extends finally for function if import in instanceof let new return super switch this throw try typeof var void while with yield enum await implements package protected static interface private public arguments Infinity NaN undefined null true false eval uneval isFinite isNaN parseFloat parseInt decodeURI decodeURIComponent encodeURI encodeURIComponent escape unescape Object Function Boolean Symbol Error EvalError InternalError RangeError ReferenceError SyntaxError TypeError URIError Number Math Date String RegExp Array Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array Float32Array Float64Array Map Set WeakMap WeakSet SIMD ArrayBuffer DataView JSON Promise Generator GeneratorFunction Reflect Proxy Intl".split(" ")).add("");
function Re() {
  return { brokenFlow: 0, includedCallArguments: /* @__PURE__ */ new Set(), includedLabels: /* @__PURE__ */ new Set() };
}
function Me() {
  return { accessed: new U(), assigned: new U(), brokenFlow: 0, called: new H(), ignore: { breaks: false, continues: false, labels: /* @__PURE__ */ new Set(), returnYield: false }, includedLabels: /* @__PURE__ */ new Set(), instantiated: new H(), replacedVariableInits: /* @__PURE__ */ new Map() };
}
function De(e2, t = null) {
  return Object.create(t, e2);
}
const Le = new class extends K {
  getLiteralValueAtPath() {
  }
}(), Ve = { value: { hasEffectsWhenCalled: null, returns: X } }, Be = new class extends K {
  getReturnExpressionWhenCalledAtPath(e2) {
    return e2.length === 1 ? Qe(qe, e2[0]) : X;
  }
  hasEffectsOnInteractionAtPath(e2, t, i) {
    return t.type === 0 ? e2.length > 1 : t.type !== 2 || e2.length !== 1 || Ye(qe, e2[0], t, i);
  }
}(), Fe = { value: { hasEffectsWhenCalled: null, returns: Be } }, ze = new class extends K {
  getReturnExpressionWhenCalledAtPath(e2) {
    return e2.length === 1 ? Qe(Ke, e2[0]) : X;
  }
  hasEffectsOnInteractionAtPath(e2, t, i) {
    return t.type === 0 ? e2.length > 1 : t.type !== 2 || e2.length !== 1 || Ye(Ke, e2[0], t, i);
  }
}(), je = { value: { hasEffectsWhenCalled: null, returns: ze } }, Ue = new class extends K {
  getReturnExpressionWhenCalledAtPath(e2) {
    return e2.length === 1 ? Qe(Xe, e2[0]) : X;
  }
  hasEffectsOnInteractionAtPath(e2, t, i) {
    return t.type === 0 ? e2.length > 1 : t.type !== 2 || e2.length !== 1 || Ye(Xe, e2[0], t, i);
  }
}(), Ge = { value: { hasEffectsWhenCalled: null, returns: Ue } }, He = { value: { hasEffectsWhenCalled({ args: e2 }, t) {
  const i = e2[1];
  return e2.length < 2 || typeof i.getLiteralValueAtPath(V, G, { deoptimizeCache() {
  } }) == "symbol" && i.hasEffectsOnInteractionAtPath(V, J, t);
}, returns: Ue } }, We = De({ hasOwnProperty: Fe, isPrototypeOf: Fe, propertyIsEnumerable: Fe, toLocaleString: Ge, toString: Ge, valueOf: Ve }), qe = De({ valueOf: Fe }, We), Ke = De({ toExponential: Ge, toFixed: Ge, toLocaleString: Ge, toPrecision: Ge, valueOf: je }, We), Xe = De({ anchor: Ge, at: Ve, big: Ge, blink: Ge, bold: Ge, charAt: Ge, charCodeAt: je, codePointAt: Ve, concat: Ge, endsWith: Fe, fixed: Ge, fontcolor: Ge, fontsize: Ge, includes: Fe, indexOf: je, italics: Ge, lastIndexOf: je, link: Ge, localeCompare: je, match: Ve, matchAll: Ve, normalize: Ge, padEnd: Ge, padStart: Ge, repeat: Ge, replace: He, replaceAll: He, search: je, slice: Ge, small: Ge, split: Ve, startsWith: Fe, strike: Ge, sub: Ge, substr: Ge, substring: Ge, sup: Ge, toLocaleLowerCase: Ge, toLocaleUpperCase: Ge, toLowerCase: Ge, toString: Ge, toUpperCase: Ge, trim: Ge, trimEnd: Ge, trimLeft: Ge, trimRight: Ge, trimStart: Ge, valueOf: Ge }, We);
function Ye(e2, t, i, s) {
  var n2, r2;
  return typeof t != "string" || !e2[t] || (((r2 = (n2 = e2[t]).hasEffectsWhenCalled) === null || r2 === void 0 ? void 0 : r2.call(n2, i, s)) || false);
}
function Qe(e2, t) {
  return typeof t == "string" && e2[t] ? e2[t].returns : X;
}
function Ze(e2, t, i) {
  i(e2, t);
}
function Je(e2, t, i) {
}
var et = {};
et.Program = et.BlockStatement = et.StaticBlock = function(e2, t, i) {
  for (var s = 0, n2 = e2.body; s < n2.length; s += 1) {
    i(n2[s], t, "Statement");
  }
}, et.Statement = Ze, et.EmptyStatement = Je, et.ExpressionStatement = et.ParenthesizedExpression = et.ChainExpression = function(e2, t, i) {
  return i(e2.expression, t, "Expression");
}, et.IfStatement = function(e2, t, i) {
  i(e2.test, t, "Expression"), i(e2.consequent, t, "Statement"), e2.alternate && i(e2.alternate, t, "Statement");
}, et.LabeledStatement = function(e2, t, i) {
  return i(e2.body, t, "Statement");
}, et.BreakStatement = et.ContinueStatement = Je, et.WithStatement = function(e2, t, i) {
  i(e2.object, t, "Expression"), i(e2.body, t, "Statement");
}, et.SwitchStatement = function(e2, t, i) {
  i(e2.discriminant, t, "Expression");
  for (var s = 0, n2 = e2.cases; s < n2.length; s += 1) {
    var r2 = n2[s];
    r2.test && i(r2.test, t, "Expression");
    for (var a2 = 0, o2 = r2.consequent; a2 < o2.length; a2 += 1) {
      i(o2[a2], t, "Statement");
    }
  }
}, et.SwitchCase = function(e2, t, i) {
  e2.test && i(e2.test, t, "Expression");
  for (var s = 0, n2 = e2.consequent; s < n2.length; s += 1) {
    i(n2[s], t, "Statement");
  }
}, et.ReturnStatement = et.YieldExpression = et.AwaitExpression = function(e2, t, i) {
  e2.argument && i(e2.argument, t, "Expression");
}, et.ThrowStatement = et.SpreadElement = function(e2, t, i) {
  return i(e2.argument, t, "Expression");
}, et.TryStatement = function(e2, t, i) {
  i(e2.block, t, "Statement"), e2.handler && i(e2.handler, t), e2.finalizer && i(e2.finalizer, t, "Statement");
}, et.CatchClause = function(e2, t, i) {
  e2.param && i(e2.param, t, "Pattern"), i(e2.body, t, "Statement");
}, et.WhileStatement = et.DoWhileStatement = function(e2, t, i) {
  i(e2.test, t, "Expression"), i(e2.body, t, "Statement");
}, et.ForStatement = function(e2, t, i) {
  e2.init && i(e2.init, t, "ForInit"), e2.test && i(e2.test, t, "Expression"), e2.update && i(e2.update, t, "Expression"), i(e2.body, t, "Statement");
}, et.ForInStatement = et.ForOfStatement = function(e2, t, i) {
  i(e2.left, t, "ForInit"), i(e2.right, t, "Expression"), i(e2.body, t, "Statement");
}, et.ForInit = function(e2, t, i) {
  e2.type === "VariableDeclaration" ? i(e2, t) : i(e2, t, "Expression");
}, et.DebuggerStatement = Je, et.FunctionDeclaration = function(e2, t, i) {
  return i(e2, t, "Function");
}, et.VariableDeclaration = function(e2, t, i) {
  for (var s = 0, n2 = e2.declarations; s < n2.length; s += 1) {
    i(n2[s], t);
  }
}, et.VariableDeclarator = function(e2, t, i) {
  i(e2.id, t, "Pattern"), e2.init && i(e2.init, t, "Expression");
}, et.Function = function(e2, t, i) {
  e2.id && i(e2.id, t, "Pattern");
  for (var s = 0, n2 = e2.params; s < n2.length; s += 1) {
    i(n2[s], t, "Pattern");
  }
  i(e2.body, t, e2.expression ? "Expression" : "Statement");
}, et.Pattern = function(e2, t, i) {
  e2.type === "Identifier" ? i(e2, t, "VariablePattern") : e2.type === "MemberExpression" ? i(e2, t, "MemberPattern") : i(e2, t);
}, et.VariablePattern = Je, et.MemberPattern = Ze, et.RestElement = function(e2, t, i) {
  return i(e2.argument, t, "Pattern");
}, et.ArrayPattern = function(e2, t, i) {
  for (var s = 0, n2 = e2.elements; s < n2.length; s += 1) {
    var r2 = n2[s];
    r2 && i(r2, t, "Pattern");
  }
}, et.ObjectPattern = function(e2, t, i) {
  for (var s = 0, n2 = e2.properties; s < n2.length; s += 1) {
    var r2 = n2[s];
    r2.type === "Property" ? (r2.computed && i(r2.key, t, "Expression"), i(r2.value, t, "Pattern")) : r2.type === "RestElement" && i(r2.argument, t, "Pattern");
  }
}, et.Expression = Ze, et.ThisExpression = et.Super = et.MetaProperty = Je, et.ArrayExpression = function(e2, t, i) {
  for (var s = 0, n2 = e2.elements; s < n2.length; s += 1) {
    var r2 = n2[s];
    r2 && i(r2, t, "Expression");
  }
}, et.ObjectExpression = function(e2, t, i) {
  for (var s = 0, n2 = e2.properties; s < n2.length; s += 1) {
    i(n2[s], t);
  }
}, et.FunctionExpression = et.ArrowFunctionExpression = et.FunctionDeclaration, et.SequenceExpression = function(e2, t, i) {
  for (var s = 0, n2 = e2.expressions; s < n2.length; s += 1) {
    i(n2[s], t, "Expression");
  }
}, et.TemplateLiteral = function(e2, t, i) {
  for (var s = 0, n2 = e2.quasis; s < n2.length; s += 1) {
    i(n2[s], t);
  }
  for (var r2 = 0, a2 = e2.expressions; r2 < a2.length; r2 += 1) {
    i(a2[r2], t, "Expression");
  }
}, et.TemplateElement = Je, et.UnaryExpression = et.UpdateExpression = function(e2, t, i) {
  i(e2.argument, t, "Expression");
}, et.BinaryExpression = et.LogicalExpression = function(e2, t, i) {
  i(e2.left, t, "Expression"), i(e2.right, t, "Expression");
}, et.AssignmentExpression = et.AssignmentPattern = function(e2, t, i) {
  i(e2.left, t, "Pattern"), i(e2.right, t, "Expression");
}, et.ConditionalExpression = function(e2, t, i) {
  i(e2.test, t, "Expression"), i(e2.consequent, t, "Expression"), i(e2.alternate, t, "Expression");
}, et.NewExpression = et.CallExpression = function(e2, t, i) {
  if (i(e2.callee, t, "Expression"), e2.arguments)
    for (var s = 0, n2 = e2.arguments; s < n2.length; s += 1) {
      i(n2[s], t, "Expression");
    }
}, et.MemberExpression = function(e2, t, i) {
  i(e2.object, t, "Expression"), e2.computed && i(e2.property, t, "Expression");
}, et.ExportNamedDeclaration = et.ExportDefaultDeclaration = function(e2, t, i) {
  e2.declaration && i(e2.declaration, t, e2.type === "ExportNamedDeclaration" || e2.declaration.id ? "Statement" : "Expression"), e2.source && i(e2.source, t, "Expression");
}, et.ExportAllDeclaration = function(e2, t, i) {
  e2.exported && i(e2.exported, t), i(e2.source, t, "Expression");
}, et.ImportDeclaration = function(e2, t, i) {
  for (var s = 0, n2 = e2.specifiers; s < n2.length; s += 1) {
    i(n2[s], t);
  }
  i(e2.source, t, "Expression");
}, et.ImportExpression = function(e2, t, i) {
  i(e2.source, t, "Expression");
}, et.ImportSpecifier = et.ImportDefaultSpecifier = et.ImportNamespaceSpecifier = et.Identifier = et.PrivateIdentifier = et.Literal = Je, et.TaggedTemplateExpression = function(e2, t, i) {
  i(e2.tag, t, "Expression"), i(e2.quasi, t, "Expression");
}, et.ClassDeclaration = et.ClassExpression = function(e2, t, i) {
  return i(e2, t, "Class");
}, et.Class = function(e2, t, i) {
  e2.id && i(e2.id, t, "Pattern"), e2.superClass && i(e2.superClass, t, "Expression"), i(e2.body, t);
}, et.ClassBody = function(e2, t, i) {
  for (var s = 0, n2 = e2.body; s < n2.length; s += 1) {
    i(n2[s], t);
  }
}, et.MethodDefinition = et.PropertyDefinition = et.Property = function(e2, t, i) {
  e2.computed && i(e2.key, t, "Expression"), e2.value && i(e2.value, t, "Expression");
};
const it = new RegExp("^#[ \\f\\r\\t\\v\\u00a0\\u1680\\u2000-\\u200a\\u2028\\u2029\\u202f\\u205f\\u3000\\ufeff]+sourceMappingURL=.+");
function st(e2, t, i = e2.type) {
  const { annotations: s } = t;
  let n2 = s[t.annotationIndex];
  for (; n2 && e2.start >= n2.end; )
    at(e2, n2, t.code), n2 = s[++t.annotationIndex];
  if (n2 && n2.end <= e2.end)
    for (et[i](e2, t, st); (n2 = s[t.annotationIndex]) && n2.end <= e2.end; )
      ++t.annotationIndex, ht(e2, n2, false);
}
const nt = /[^\s(]/g, rt = /\S/g;
function at(e2, t, i) {
  const s = [];
  let n2;
  if (ot(i.slice(t.end, e2.start), nt)) {
    const t2 = e2.start;
    for (; ; ) {
      switch (s.push(e2), e2.type) {
        case "ExpressionStatement":
        case "ChainExpression":
          e2 = e2.expression;
          continue;
        case "SequenceExpression":
          if (ot(i.slice(t2, e2.start), rt)) {
            e2 = e2.expressions[0];
            continue;
          }
          n2 = true;
          break;
        case "ConditionalExpression":
          if (ot(i.slice(t2, e2.start), rt)) {
            e2 = e2.test;
            continue;
          }
          n2 = true;
          break;
        case "LogicalExpression":
        case "BinaryExpression":
          if (ot(i.slice(t2, e2.start), rt)) {
            e2 = e2.left;
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
    ht(e2, t, false);
  else
    for (const e3 of s)
      ht(e3, t, true);
}
function ot(e2, t) {
  let i;
  for (; (i = t.exec(e2)) !== null; ) {
    if (i[0] === "/") {
      const i2 = e2.charCodeAt(t.lastIndex);
      if (i2 === 42) {
        t.lastIndex = e2.indexOf("*/", t.lastIndex + 1) + 2;
        continue;
      }
      if (i2 === 47) {
        t.lastIndex = e2.indexOf("\n", t.lastIndex + 1) + 1;
        continue;
      }
    }
    return t.lastIndex = 0, false;
  }
  return true;
}
const lt = /[@#]__PURE__/;
function ht(e2, t, i) {
  const s = i ? "_rollupAnnotations" : "_rollupRemoved", n2 = e2[s];
  n2 ? n2.push(t) : e2[s] = [t];
}
const ct = { Literal: [], Program: ["body"] };
class ut extends K {
  constructor(e2, t, i) {
    super(), this.deoptimized = false, this.esTreeNode = e2, this.keys = ct[e2.type] || function(e3) {
      return ct[e3.type] = Object.keys(e3).filter((t2) => typeof e3[t2] == "object" && t2.charCodeAt(0) !== 95), ct[e3.type];
    }(e2), this.parent = t, this.context = t.context, this.createScope(i), this.parseNode(e2), this.initialise(), this.context.magicString.addSourcemapLocation(this.start), this.context.magicString.addSourcemapLocation(this.end);
  }
  addExportedVariables(e2, t) {
  }
  bind() {
    for (const e2 of this.keys) {
      const t = this[e2];
      if (t !== null)
        if (Array.isArray(t))
          for (const e3 of t)
            e3 == null || e3.bind();
        else
          t.bind();
    }
  }
  createScope(e2) {
    this.scope = e2;
  }
  hasEffects(e2) {
    this.deoptimized || this.applyDeoptimizations();
    for (const t of this.keys) {
      const i = this[t];
      if (i !== null) {
        if (Array.isArray(i)) {
          for (const t2 of i)
            if (t2 == null ? void 0 : t2.hasEffects(e2))
              return true;
        } else if (i.hasEffects(e2))
          return true;
      }
    }
    return false;
  }
  hasEffectsAsAssignmentTarget(e2, t) {
    return this.hasEffects(e2) || this.hasEffectsOnInteractionAtPath(V, this.assignmentInteraction, e2);
  }
  include(e2, t, i) {
    this.deoptimized || this.applyDeoptimizations(), this.included = true;
    for (const i2 of this.keys) {
      const s = this[i2];
      if (s !== null)
        if (Array.isArray(s))
          for (const i3 of s)
            i3 == null || i3.include(e2, t);
        else
          s.include(e2, t);
    }
  }
  includeAsAssignmentTarget(e2, t, i) {
    this.include(e2, t);
  }
  initialise() {
  }
  insertSemicolon(e2) {
    e2.original[this.end - 1] !== ";" && e2.appendLeft(this.end, ";");
  }
  parseNode(e2) {
    for (const [t, i] of Object.entries(e2))
      if (!this.hasOwnProperty(t))
        if (t.charCodeAt(0) === 95) {
          if (t === "_rollupAnnotations")
            this.annotations = i;
          else if (t === "_rollupRemoved")
            for (const { start: e3, end: t2 } of i)
              this.context.magicString.remove(e3, t2);
        } else if (typeof i != "object" || i === null)
          this[t] = i;
        else if (Array.isArray(i)) {
          this[t] = [];
          for (const e3 of i)
            this[t].push(e3 === null ? null : new (this.context.getNodeConstructor(e3.type))(e3, this, this.scope));
        } else
          this[t] = new (this.context.getNodeConstructor(i.type))(i, this, this.scope);
  }
  render(e2, t) {
    for (const i of this.keys) {
      const s = this[i];
      if (s !== null)
        if (Array.isArray(s))
          for (const i2 of s)
            i2 == null || i2.render(e2, t);
        else
          s.render(e2, t);
    }
  }
  setAssignedValue(e2) {
    this.assignmentInteraction = { args: [e2], thisArg: null, type: 1 };
  }
  shouldBeIncluded(e2) {
    return this.included || !e2.brokenFlow && this.hasEffects(Me());
  }
  applyDeoptimizations() {
    this.deoptimized = true;
    for (const e2 of this.keys) {
      const t = this[e2];
      if (t !== null)
        if (Array.isArray(t))
          for (const e3 of t)
            e3 == null || e3.deoptimizePath(B);
        else
          t.deoptimizePath(B);
    }
    this.context.requestTreeshakingPass();
  }
}
class dt extends ut {
  deoptimizeThisOnInteractionAtPath(e2, t, i) {
    t.length > 0 && this.argument.deoptimizeThisOnInteractionAtPath(e2, [M, ...t], i);
  }
  hasEffects(e2) {
    this.deoptimized || this.applyDeoptimizations();
    const { propertyReadSideEffects: t } = this.context.options.treeshake;
    return this.argument.hasEffects(e2) || t && (t === "always" || this.argument.hasEffectsOnInteractionAtPath(B, Y, e2));
  }
  applyDeoptimizations() {
    this.deoptimized = true, this.argument.deoptimizePath([M, M]), this.context.requestTreeshakingPass();
  }
}
class pt extends K {
  constructor(e2) {
    super(), this.description = e2;
  }
  deoptimizeThisOnInteractionAtPath({ type: e2, thisArg: t }, i) {
    e2 === 2 && i.length === 0 && this.description.mutatesSelfAsArray && t.deoptimizePath(z);
  }
  getReturnExpressionWhenCalledAtPath(e2, { thisArg: t }) {
    return e2.length > 0 ? X : this.description.returnsPrimitive || (this.description.returns === "self" ? t || X : this.description.returns());
  }
  hasEffectsOnInteractionAtPath(e2, t, i) {
    var s, n2;
    const { type: r2 } = t;
    if (e2.length > (r2 === 0 ? 1 : 0))
      return true;
    if (r2 === 2) {
      if (this.description.mutatesSelfAsArray === true && ((s = t.thisArg) === null || s === void 0 ? void 0 : s.hasEffectsOnInteractionAtPath(z, Q, i)))
        return true;
      if (this.description.callsArgs) {
        for (const e3 of this.description.callsArgs)
          if ((n2 = t.args[e3]) === null || n2 === void 0 ? void 0 : n2.hasEffectsOnInteractionAtPath(V, J, i))
            return true;
      }
    }
    return false;
  }
}
const ft = [new pt({ callsArgs: null, mutatesSelfAsArray: false, returns: null, returnsPrimitive: Be })], mt = [new pt({ callsArgs: null, mutatesSelfAsArray: false, returns: null, returnsPrimitive: Ue })], gt = [new pt({ callsArgs: null, mutatesSelfAsArray: false, returns: null, returnsPrimitive: ze })], yt = [new pt({ callsArgs: null, mutatesSelfAsArray: false, returns: null, returnsPrimitive: X })], xt = /^\d+$/;
class Et extends K {
  constructor(e2, t, i = false) {
    if (super(), this.prototypeExpression = t, this.immutable = i, this.allProperties = [], this.deoptimizedPaths = /* @__PURE__ */ Object.create(null), this.expressionsToBeDeoptimizedByKey = /* @__PURE__ */ Object.create(null), this.gettersByKey = /* @__PURE__ */ Object.create(null), this.hasLostTrack = false, this.hasUnknownDeoptimizedInteger = false, this.hasUnknownDeoptimizedProperty = false, this.propertiesAndGettersByKey = /* @__PURE__ */ Object.create(null), this.propertiesAndSettersByKey = /* @__PURE__ */ Object.create(null), this.settersByKey = /* @__PURE__ */ Object.create(null), this.thisParametersToBeDeoptimized = /* @__PURE__ */ new Set(), this.unknownIntegerProps = [], this.unmatchableGetters = [], this.unmatchablePropertiesAndGetters = [], this.unmatchableSetters = [], Array.isArray(e2))
      this.buildPropertyMaps(e2);
    else {
      this.propertiesAndGettersByKey = this.propertiesAndSettersByKey = e2;
      for (const t2 of Object.values(e2))
        this.allProperties.push(...t2);
    }
  }
  deoptimizeAllProperties(e2) {
    var t;
    const i = this.hasLostTrack || this.hasUnknownDeoptimizedProperty;
    if (e2 ? this.hasUnknownDeoptimizedProperty = true : this.hasLostTrack = true, !i) {
      for (const e3 of Object.values(this.propertiesAndGettersByKey).concat(Object.values(this.settersByKey)))
        for (const t2 of e3)
          t2.deoptimizePath(B);
      (t = this.prototypeExpression) === null || t === void 0 || t.deoptimizePath([M, M]), this.deoptimizeCachedEntities();
    }
  }
  deoptimizeIntegerProperties() {
    if (!(this.hasLostTrack || this.hasUnknownDeoptimizedProperty || this.hasUnknownDeoptimizedInteger)) {
      this.hasUnknownDeoptimizedInteger = true;
      for (const [e2, t] of Object.entries(this.propertiesAndGettersByKey))
        if (xt.test(e2))
          for (const e3 of t)
            e3.deoptimizePath(B);
      this.deoptimizeCachedIntegerEntities();
    }
  }
  deoptimizePath(e2) {
    var t;
    if (this.hasLostTrack || this.immutable)
      return;
    const i = e2[0];
    if (e2.length === 1) {
      if (typeof i != "string")
        return i === L ? this.deoptimizeIntegerProperties() : this.deoptimizeAllProperties(i === D);
      if (!this.deoptimizedPaths[i]) {
        this.deoptimizedPaths[i] = true;
        const e3 = this.expressionsToBeDeoptimizedByKey[i];
        if (e3)
          for (const t2 of e3)
            t2.deoptimizeCache();
      }
    }
    const s = e2.length === 1 ? B : e2.slice(1);
    for (const e3 of typeof i == "string" ? (this.propertiesAndGettersByKey[i] || this.unmatchablePropertiesAndGetters).concat(this.settersByKey[i] || this.unmatchableSetters) : this.allProperties)
      e3.deoptimizePath(s);
    (t = this.prototypeExpression) === null || t === void 0 || t.deoptimizePath(e2.length === 1 ? [...e2, M] : e2);
  }
  deoptimizeThisOnInteractionAtPath(e2, t, i) {
    var s;
    const [n2, ...r2] = t;
    if (this.hasLostTrack || (e2.type === 2 || t.length > 1) && (this.hasUnknownDeoptimizedProperty || typeof n2 == "string" && this.deoptimizedPaths[n2]))
      return void e2.thisArg.deoptimizePath(B);
    const [a2, o2, l2] = e2.type === 2 || t.length > 1 ? [this.propertiesAndGettersByKey, this.propertiesAndGettersByKey, this.unmatchablePropertiesAndGetters] : e2.type === 0 ? [this.propertiesAndGettersByKey, this.gettersByKey, this.unmatchableGetters] : [this.propertiesAndSettersByKey, this.settersByKey, this.unmatchableSetters];
    if (typeof n2 == "string") {
      if (a2[n2]) {
        const t2 = o2[n2];
        if (t2)
          for (const s2 of t2)
            s2.deoptimizeThisOnInteractionAtPath(e2, r2, i);
        return void (this.immutable || this.thisParametersToBeDeoptimized.add(e2.thisArg));
      }
      for (const t2 of l2)
        t2.deoptimizeThisOnInteractionAtPath(e2, r2, i);
      if (xt.test(n2))
        for (const t2 of this.unknownIntegerProps)
          t2.deoptimizeThisOnInteractionAtPath(e2, r2, i);
    } else {
      for (const t2 of Object.values(o2).concat([l2]))
        for (const s2 of t2)
          s2.deoptimizeThisOnInteractionAtPath(e2, r2, i);
      for (const t2 of this.unknownIntegerProps)
        t2.deoptimizeThisOnInteractionAtPath(e2, r2, i);
    }
    this.immutable || this.thisParametersToBeDeoptimized.add(e2.thisArg), (s = this.prototypeExpression) === null || s === void 0 || s.deoptimizeThisOnInteractionAtPath(e2, t, i);
  }
  getLiteralValueAtPath(e2, t, i) {
    if (e2.length === 0)
      return q;
    const s = e2[0], n2 = this.getMemberExpressionAndTrackDeopt(s, i);
    return n2 ? n2.getLiteralValueAtPath(e2.slice(1), t, i) : this.prototypeExpression ? this.prototypeExpression.getLiteralValueAtPath(e2, t, i) : e2.length !== 1 ? W : void 0;
  }
  getReturnExpressionWhenCalledAtPath(e2, t, i, s) {
    if (e2.length === 0)
      return X;
    const [n2, ...r2] = e2, a2 = this.getMemberExpressionAndTrackDeopt(n2, s);
    return a2 ? a2.getReturnExpressionWhenCalledAtPath(r2, t, i, s) : this.prototypeExpression ? this.prototypeExpression.getReturnExpressionWhenCalledAtPath(e2, t, i, s) : X;
  }
  hasEffectsOnInteractionAtPath(e2, t, i) {
    const [s, ...n2] = e2;
    if (n2.length || t.type === 2) {
      const r3 = this.getMemberExpression(s);
      return r3 ? r3.hasEffectsOnInteractionAtPath(n2, t, i) : !this.prototypeExpression || this.prototypeExpression.hasEffectsOnInteractionAtPath(e2, t, i);
    }
    if (s === D)
      return false;
    if (this.hasLostTrack)
      return true;
    const [r2, a2, o2] = t.type === 0 ? [this.propertiesAndGettersByKey, this.gettersByKey, this.unmatchableGetters] : [this.propertiesAndSettersByKey, this.settersByKey, this.unmatchableSetters];
    if (typeof s == "string") {
      if (r2[s]) {
        const e3 = a2[s];
        if (e3) {
          for (const s2 of e3)
            if (s2.hasEffectsOnInteractionAtPath(n2, t, i))
              return true;
        }
        return false;
      }
      for (const e3 of o2)
        if (e3.hasEffectsOnInteractionAtPath(n2, t, i))
          return true;
    } else
      for (const e3 of Object.values(a2).concat([o2]))
        for (const s2 of e3)
          if (s2.hasEffectsOnInteractionAtPath(n2, t, i))
            return true;
    return !!this.prototypeExpression && this.prototypeExpression.hasEffectsOnInteractionAtPath(e2, t, i);
  }
  buildPropertyMaps(e2) {
    const { allProperties: t, propertiesAndGettersByKey: i, propertiesAndSettersByKey: s, settersByKey: n2, gettersByKey: r2, unknownIntegerProps: a2, unmatchablePropertiesAndGetters: o2, unmatchableGetters: l2, unmatchableSetters: h2 } = this, c2 = [];
    for (let u2 = e2.length - 1; u2 >= 0; u2--) {
      const { key: d2, kind: p2, property: f3 } = e2[u2];
      if (t.push(f3), typeof d2 != "string") {
        if (d2 === L) {
          a2.push(f3);
          continue;
        }
        p2 === "set" && h2.push(f3), p2 === "get" && l2.push(f3), p2 !== "get" && c2.push(f3), p2 !== "set" && o2.push(f3);
      } else
        p2 === "set" ? s[d2] || (s[d2] = [f3, ...c2], n2[d2] = [f3, ...h2]) : p2 === "get" ? i[d2] || (i[d2] = [f3, ...o2], r2[d2] = [f3, ...l2]) : (s[d2] || (s[d2] = [f3, ...c2]), i[d2] || (i[d2] = [f3, ...o2]));
    }
  }
  deoptimizeCachedEntities() {
    for (const e2 of Object.values(this.expressionsToBeDeoptimizedByKey))
      for (const t of e2)
        t.deoptimizeCache();
    for (const e2 of this.thisParametersToBeDeoptimized)
      e2.deoptimizePath(B);
  }
  deoptimizeCachedIntegerEntities() {
    for (const [e2, t] of Object.entries(this.expressionsToBeDeoptimizedByKey))
      if (xt.test(e2))
        for (const e3 of t)
          e3.deoptimizeCache();
    for (const e2 of this.thisParametersToBeDeoptimized)
      e2.deoptimizePath(z);
  }
  getMemberExpression(e2) {
    if (this.hasLostTrack || this.hasUnknownDeoptimizedProperty || typeof e2 != "string" || this.hasUnknownDeoptimizedInteger && xt.test(e2) || this.deoptimizedPaths[e2])
      return X;
    const t = this.propertiesAndGettersByKey[e2];
    return (t == null ? void 0 : t.length) === 1 ? t[0] : t || this.unmatchablePropertiesAndGetters.length > 0 || this.unknownIntegerProps.length && xt.test(e2) ? X : null;
  }
  getMemberExpressionAndTrackDeopt(e2, t) {
    if (typeof e2 != "string")
      return X;
    const i = this.getMemberExpression(e2);
    if (i !== X && !this.immutable) {
      (this.expressionsToBeDeoptimizedByKey[e2] = this.expressionsToBeDeoptimizedByKey[e2] || []).push(t);
    }
    return i;
  }
}
const bt = (e2) => typeof e2 == "string" && /^\d+$/.test(e2), vt = new class extends K {
  deoptimizeThisOnInteractionAtPath({ type: e2, thisArg: t }, i) {
    e2 !== 2 || i.length !== 1 || bt(i[0]) || t.deoptimizePath(B);
  }
  getLiteralValueAtPath(e2) {
    return e2.length === 1 && bt(e2[0]) ? void 0 : W;
  }
  hasEffectsOnInteractionAtPath(e2, { type: t }) {
    return e2.length > 1 || t === 2;
  }
}(), St = new Et({ __proto__: null, hasOwnProperty: ft, isPrototypeOf: ft, propertyIsEnumerable: ft, toLocaleString: mt, toString: mt, valueOf: yt }, vt, true), At = [{ key: L, kind: "init", property: X }, { key: "length", kind: "init", property: ze }], It = [new pt({ callsArgs: [0], mutatesSelfAsArray: "deopt-only", returns: null, returnsPrimitive: Be })], kt = [new pt({ callsArgs: [0], mutatesSelfAsArray: "deopt-only", returns: null, returnsPrimitive: ze })], Pt = [new pt({ callsArgs: null, mutatesSelfAsArray: true, returns: () => new Et(At, Mt), returnsPrimitive: null })], wt = [new pt({ callsArgs: null, mutatesSelfAsArray: "deopt-only", returns: () => new Et(At, Mt), returnsPrimitive: null })], Ct = [new pt({ callsArgs: [0], mutatesSelfAsArray: "deopt-only", returns: () => new Et(At, Mt), returnsPrimitive: null })], _t = [new pt({ callsArgs: null, mutatesSelfAsArray: true, returns: null, returnsPrimitive: ze })], Nt = [new pt({ callsArgs: null, mutatesSelfAsArray: true, returns: null, returnsPrimitive: X })], $t = [new pt({ callsArgs: null, mutatesSelfAsArray: "deopt-only", returns: null, returnsPrimitive: X })], Tt = [new pt({ callsArgs: [0], mutatesSelfAsArray: "deopt-only", returns: null, returnsPrimitive: X })], Ot = [new pt({ callsArgs: null, mutatesSelfAsArray: true, returns: "self", returnsPrimitive: null })], Rt = [new pt({ callsArgs: [0], mutatesSelfAsArray: true, returns: "self", returnsPrimitive: null })], Mt = new Et({ __proto__: null, at: $t, concat: wt, copyWithin: Ot, entries: wt, every: It, fill: Ot, filter: Ct, find: Tt, findIndex: kt, findLast: Tt, findLastIndex: kt, flat: wt, flatMap: Ct, forEach: Tt, groupBy: Tt, groupByToMap: Tt, includes: ft, indexOf: gt, join: mt, keys: yt, lastIndexOf: gt, map: Ct, pop: Nt, push: _t, reduce: Tt, reduceRight: Tt, reverse: Ot, shift: Nt, slice: wt, some: It, sort: Rt, splice: Pt, toLocaleString: mt, toString: mt, unshift: _t, values: $t }, St, true);
class Dt extends ee {
  constructor(e2, t, i, s) {
    super(e2), this.calledFromTryStatement = false, this.additionalInitializers = null, this.expressionsToBeDeoptimized = [], this.declarations = t ? [t] : [], this.init = i, this.deoptimizationTracker = s.deoptimizationTracker, this.module = s.module;
  }
  addDeclaration(e2, t) {
    this.declarations.push(e2);
    const i = this.markInitializersForDeoptimization();
    t !== null && i.push(t);
  }
  consolidateInitializers() {
    if (this.additionalInitializers !== null) {
      for (const e2 of this.additionalInitializers)
        e2.deoptimizePath(B);
      this.additionalInitializers = null;
    }
  }
  deoptimizePath(e2) {
    var t, i;
    if (!this.isReassigned && !this.deoptimizationTracker.trackEntityAtPathAndGetIfTracked(e2, this))
      if (e2.length === 0) {
        if (!this.isReassigned) {
          this.isReassigned = true;
          const e3 = this.expressionsToBeDeoptimized;
          this.expressionsToBeDeoptimized = [];
          for (const t2 of e3)
            t2.deoptimizeCache();
          (t = this.init) === null || t === void 0 || t.deoptimizePath(B);
        }
      } else
        (i = this.init) === null || i === void 0 || i.deoptimizePath(e2);
  }
  deoptimizeThisOnInteractionAtPath(e2, t, i) {
    if (this.isReassigned || !this.init)
      return e2.thisArg.deoptimizePath(B);
    i.withTrackedEntityAtPath(t, this.init, () => this.init.deoptimizeThisOnInteractionAtPath(e2, t, i), void 0);
  }
  getLiteralValueAtPath(e2, t, i) {
    return this.isReassigned || !this.init ? W : t.withTrackedEntityAtPath(e2, this.init, () => (this.expressionsToBeDeoptimized.push(i), this.init.getLiteralValueAtPath(e2, t, i)), W);
  }
  getReturnExpressionWhenCalledAtPath(e2, t, i, s) {
    return this.isReassigned || !this.init ? X : i.withTrackedEntityAtPath(e2, this.init, () => (this.expressionsToBeDeoptimized.push(s), this.init.getReturnExpressionWhenCalledAtPath(e2, t, i, s)), X);
  }
  hasEffectsOnInteractionAtPath(e2, t, i) {
    switch (t.type) {
      case 0:
        return !!this.isReassigned || this.init && !i.accessed.trackEntityAtPathAndGetIfTracked(e2, this) && this.init.hasEffectsOnInteractionAtPath(e2, t, i);
      case 1:
        return !!this.included || e2.length !== 0 && (!!this.isReassigned || this.init && !i.assigned.trackEntityAtPathAndGetIfTracked(e2, this) && this.init.hasEffectsOnInteractionAtPath(e2, t, i));
      case 2:
        return !!this.isReassigned || this.init && !(t.withNew ? i.instantiated : i.called).trackEntityAtPathAndGetIfTracked(e2, t.args, this) && this.init.hasEffectsOnInteractionAtPath(e2, t, i);
    }
  }
  include() {
    if (!this.included) {
      this.included = true;
      for (const e2 of this.declarations) {
        e2.included || e2.include(Re(), false);
        let t = e2.parent;
        for (; !t.included && (t.included = true, t.type !== "Program"); )
          t = t.parent;
      }
    }
  }
  includeCallArguments(e2, t) {
    if (this.isReassigned || this.init && e2.includedCallArguments.has(this.init))
      for (const i of t)
        i.include(e2, false);
    else
      this.init && (e2.includedCallArguments.add(this.init), this.init.includeCallArguments(e2, t), e2.includedCallArguments.delete(this.init));
  }
  markCalledFromTryStatement() {
    this.calledFromTryStatement = true;
  }
  markInitializersForDeoptimization() {
    return this.additionalInitializers === null && (this.additionalInitializers = this.init === null ? [] : [this.init], this.init = X, this.isReassigned = true), this.additionalInitializers;
  }
}
function Lt(e2) {
  let t = "";
  do {
    const i = e2 % 64;
    e2 = Math.floor(e2 / 64), t = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$"[i] + t;
  } while (e2 !== 0);
  return t;
}
function Vt(e2, t) {
  let i = e2, s = 1;
  for (; t.has(i) || we.has(i); )
    i = `${e2}$${Lt(s++)}`;
  return t.add(i), i;
}
class Bt {
  constructor() {
    this.children = [], this.variables = /* @__PURE__ */ new Map();
  }
  addDeclaration(e2, t, i, s) {
    const n2 = e2.name;
    let r2 = this.variables.get(n2);
    return r2 ? r2.addDeclaration(e2, i) : (r2 = new Dt(e2.name, e2, i || Le, t), this.variables.set(n2, r2)), r2;
  }
  contains(e2) {
    return this.variables.has(e2);
  }
  findVariable(e2) {
    throw new Error("Internal Error: findVariable needs to be implemented by a subclass");
  }
}
class Ft extends Bt {
  constructor(e2) {
    super(), this.accessedOutsideVariables = /* @__PURE__ */ new Map(), this.parent = e2, e2.children.push(this);
  }
  addAccessedDynamicImport(e2) {
    (this.accessedDynamicImports || (this.accessedDynamicImports = /* @__PURE__ */ new Set())).add(e2), this.parent instanceof Ft && this.parent.addAccessedDynamicImport(e2);
  }
  addAccessedGlobals(e2, t) {
    const i = t.get(this) || /* @__PURE__ */ new Set();
    for (const t2 of e2)
      i.add(t2);
    t.set(this, i), this.parent instanceof Ft && this.parent.addAccessedGlobals(e2, t);
  }
  addNamespaceMemberAccess(e2, t) {
    this.accessedOutsideVariables.set(e2, t), this.parent.addNamespaceMemberAccess(e2, t);
  }
  addReturnExpression(e2) {
    this.parent instanceof Ft && this.parent.addReturnExpression(e2);
  }
  addUsedOutsideNames(e2, t, i, s) {
    for (const s2 of this.accessedOutsideVariables.values())
      s2.included && (e2.add(s2.getBaseVariableName()), t === "system" && i.has(s2) && e2.add("exports"));
    const n2 = s.get(this);
    if (n2)
      for (const t2 of n2)
        e2.add(t2);
  }
  contains(e2) {
    return this.variables.has(e2) || this.parent.contains(e2);
  }
  deconflict(e2, t, i) {
    const s = /* @__PURE__ */ new Set();
    if (this.addUsedOutsideNames(s, e2, t, i), this.accessedDynamicImports)
      for (const e3 of this.accessedDynamicImports)
        e3.inlineNamespace && s.add(e3.inlineNamespace.getBaseVariableName());
    for (const [e3, t2] of this.variables)
      (t2.included || t2.alwaysRendered) && t2.setRenderNames(null, Vt(e3, s));
    for (const s2 of this.children)
      s2.deconflict(e2, t, i);
  }
  findLexicalBoundary() {
    return this.parent.findLexicalBoundary();
  }
  findVariable(e2) {
    const t = this.variables.get(e2) || this.accessedOutsideVariables.get(e2);
    if (t)
      return t;
    const i = this.parent.findVariable(e2);
    return this.accessedOutsideVariables.set(e2, i), i;
  }
}
class zt extends Ft {
  constructor(e2, t) {
    super(e2), this.parameters = [], this.hasRest = false, this.context = t, this.hoistedBodyVarScope = new Ft(this);
  }
  addParameterDeclaration(e2) {
    const t = e2.name;
    let i = this.hoistedBodyVarScope.variables.get(t);
    return i ? i.addDeclaration(e2, null) : i = new Dt(t, e2, X, this.context), this.variables.set(t, i), i;
  }
  addParameterVariables(e2, t) {
    this.parameters = e2;
    for (const t2 of e2)
      for (const e3 of t2)
        e3.alwaysRendered = true;
    this.hasRest = t;
  }
  includeCallArguments(e2, t) {
    let i = false, s = false;
    const n2 = this.hasRest && this.parameters[this.parameters.length - 1];
    for (const i2 of t)
      if (i2 instanceof dt) {
        for (const i3 of t)
          i3.include(e2, false);
        break;
      }
    for (let r2 = t.length - 1; r2 >= 0; r2--) {
      const a2 = this.parameters[r2] || n2, o2 = t[r2];
      if (a2)
        if (i = false, a2.length === 0)
          s = true;
        else
          for (const e3 of a2)
            e3.included && (s = true), e3.calledFromTryStatement && (i = true);
      !s && o2.shouldBeIncluded(e2) && (s = true), s && o2.include(e2, i);
    }
  }
}
class jt extends zt {
  constructor() {
    super(...arguments), this.returnExpression = null, this.returnExpressions = [];
  }
  addReturnExpression(e2) {
    this.returnExpressions.push(e2);
  }
  getReturnExpression() {
    return this.returnExpression === null && this.updateReturnExpression(), this.returnExpression;
  }
  updateReturnExpression() {
    if (this.returnExpressions.length === 1)
      this.returnExpression = this.returnExpressions[0];
    else {
      this.returnExpression = X;
      for (const e2 of this.returnExpressions)
        e2.deoptimizePath(B);
    }
  }
}
function Ut(e2, t) {
  if (e2.type === "MemberExpression")
    return !e2.computed && Ut(e2.object, e2);
  if (e2.type === "Identifier") {
    if (!t)
      return true;
    switch (t.type) {
      case "MemberExpression":
        return t.computed || e2 === t.object;
      case "MethodDefinition":
        return t.computed;
      case "PropertyDefinition":
      case "Property":
        return t.computed || e2 === t.value;
      case "ExportSpecifier":
      case "ImportSpecifier":
        return e2 === t.local;
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
const Gt = Symbol("Value Properties"), Ht = { hasEffectsWhenCalled: () => false }, Wt = { hasEffectsWhenCalled: () => true }, qt = { __proto__: null, [Gt]: Wt }, Kt = { __proto__: null, [Gt]: Ht }, Xt = { __proto__: null, [Gt]: { hasEffectsWhenCalled: ({ args: e2 }, t) => !e2.length || e2[0].hasEffectsOnInteractionAtPath(F, Q, t) } }, Yt = { __proto__: null, [Gt]: Wt, prototype: qt }, Qt = { __proto__: null, [Gt]: Ht, prototype: qt }, Zt = { __proto__: null, [Gt]: Ht, from: Kt, of: Kt, prototype: qt }, Jt = { __proto__: null, [Gt]: Ht, supportedLocalesOf: Qt }, ei = { global: qt, globalThis: qt, self: qt, window: qt, __proto__: null, [Gt]: Wt, Array: { __proto__: null, [Gt]: Wt, from: qt, isArray: Kt, of: Kt, prototype: qt }, ArrayBuffer: { __proto__: null, [Gt]: Ht, isView: Kt, prototype: qt }, Atomics: qt, BigInt: Yt, BigInt64Array: Yt, BigUint64Array: Yt, Boolean: Qt, constructor: Yt, DataView: Qt, Date: { __proto__: null, [Gt]: Ht, now: Kt, parse: Kt, prototype: qt, UTC: Kt }, decodeURI: Kt, decodeURIComponent: Kt, encodeURI: Kt, encodeURIComponent: Kt, Error: Qt, escape: Kt, eval: qt, EvalError: Qt, Float32Array: Zt, Float64Array: Zt, Function: Yt, hasOwnProperty: qt, Infinity: qt, Int16Array: Zt, Int32Array: Zt, Int8Array: Zt, isFinite: Kt, isNaN: Kt, isPrototypeOf: qt, JSON: qt, Map: Qt, Math: { __proto__: null, [Gt]: Wt, abs: Kt, acos: Kt, acosh: Kt, asin: Kt, asinh: Kt, atan: Kt, atan2: Kt, atanh: Kt, cbrt: Kt, ceil: Kt, clz32: Kt, cos: Kt, cosh: Kt, exp: Kt, expm1: Kt, floor: Kt, fround: Kt, hypot: Kt, imul: Kt, log: Kt, log10: Kt, log1p: Kt, log2: Kt, max: Kt, min: Kt, pow: Kt, random: Kt, round: Kt, sign: Kt, sin: Kt, sinh: Kt, sqrt: Kt, tan: Kt, tanh: Kt, trunc: Kt }, NaN: qt, Number: { __proto__: null, [Gt]: Ht, isFinite: Kt, isInteger: Kt, isNaN: Kt, isSafeInteger: Kt, parseFloat: Kt, parseInt: Kt, prototype: qt }, Object: { __proto__: null, [Gt]: Ht, create: Kt, defineProperty: Xt, defineProperties: Xt, getOwnPropertyDescriptor: Kt, getOwnPropertyNames: Kt, getOwnPropertySymbols: Kt, getPrototypeOf: Kt, hasOwn: Kt, is: Kt, isExtensible: Kt, isFrozen: Kt, isSealed: Kt, keys: Kt, fromEntries: Kt, entries: Kt, prototype: qt }, parseFloat: Kt, parseInt: Kt, Promise: { __proto__: null, [Gt]: Wt, all: qt, prototype: qt, race: qt, reject: qt, resolve: qt }, propertyIsEnumerable: qt, Proxy: qt, RangeError: Qt, ReferenceError: Qt, Reflect: qt, RegExp: Qt, Set: Qt, SharedArrayBuffer: Yt, String: { __proto__: null, [Gt]: Ht, fromCharCode: Kt, fromCodePoint: Kt, prototype: qt, raw: Kt }, Symbol: { __proto__: null, [Gt]: Ht, for: Kt, keyFor: Kt, prototype: qt }, SyntaxError: Qt, toLocaleString: qt, toString: qt, TypeError: Qt, Uint16Array: Zt, Uint32Array: Zt, Uint8Array: Zt, Uint8ClampedArray: Zt, unescape: Kt, URIError: Qt, valueOf: qt, WeakMap: Qt, WeakSet: Qt, clearInterval: Yt, clearTimeout: Yt, console: qt, Intl: { __proto__: null, [Gt]: Wt, Collator: Jt, DateTimeFormat: Jt, ListFormat: Jt, NumberFormat: Jt, PluralRules: Jt, RelativeTimeFormat: Jt }, setInterval: Yt, setTimeout: Yt, TextDecoder: Yt, TextEncoder: Yt, URL: Yt, URLSearchParams: Yt, AbortController: Yt, AbortSignal: Yt, addEventListener: qt, alert: qt, AnalyserNode: Yt, Animation: Yt, AnimationEvent: Yt, applicationCache: qt, ApplicationCache: Yt, ApplicationCacheErrorEvent: Yt, atob: qt, Attr: Yt, Audio: Yt, AudioBuffer: Yt, AudioBufferSourceNode: Yt, AudioContext: Yt, AudioDestinationNode: Yt, AudioListener: Yt, AudioNode: Yt, AudioParam: Yt, AudioProcessingEvent: Yt, AudioScheduledSourceNode: Yt, AudioWorkletNode: Yt, BarProp: Yt, BaseAudioContext: Yt, BatteryManager: Yt, BeforeUnloadEvent: Yt, BiquadFilterNode: Yt, Blob: Yt, BlobEvent: Yt, blur: qt, BroadcastChannel: Yt, btoa: qt, ByteLengthQueuingStrategy: Yt, Cache: Yt, caches: qt, CacheStorage: Yt, cancelAnimationFrame: qt, cancelIdleCallback: qt, CanvasCaptureMediaStreamTrack: Yt, CanvasGradient: Yt, CanvasPattern: Yt, CanvasRenderingContext2D: Yt, ChannelMergerNode: Yt, ChannelSplitterNode: Yt, CharacterData: Yt, clientInformation: qt, ClipboardEvent: Yt, close: qt, closed: qt, CloseEvent: Yt, Comment: Yt, CompositionEvent: Yt, confirm: qt, ConstantSourceNode: Yt, ConvolverNode: Yt, CountQueuingStrategy: Yt, createImageBitmap: qt, Credential: Yt, CredentialsContainer: Yt, crypto: qt, Crypto: Yt, CryptoKey: Yt, CSS: Yt, CSSConditionRule: Yt, CSSFontFaceRule: Yt, CSSGroupingRule: Yt, CSSImportRule: Yt, CSSKeyframeRule: Yt, CSSKeyframesRule: Yt, CSSMediaRule: Yt, CSSNamespaceRule: Yt, CSSPageRule: Yt, CSSRule: Yt, CSSRuleList: Yt, CSSStyleDeclaration: Yt, CSSStyleRule: Yt, CSSStyleSheet: Yt, CSSSupportsRule: Yt, CustomElementRegistry: Yt, customElements: qt, CustomEvent: Yt, DataTransfer: Yt, DataTransferItem: Yt, DataTransferItemList: Yt, defaultstatus: qt, defaultStatus: qt, DelayNode: Yt, DeviceMotionEvent: Yt, DeviceOrientationEvent: Yt, devicePixelRatio: qt, dispatchEvent: qt, document: qt, Document: Yt, DocumentFragment: Yt, DocumentType: Yt, DOMError: Yt, DOMException: Yt, DOMImplementation: Yt, DOMMatrix: Yt, DOMMatrixReadOnly: Yt, DOMParser: Yt, DOMPoint: Yt, DOMPointReadOnly: Yt, DOMQuad: Yt, DOMRect: Yt, DOMRectReadOnly: Yt, DOMStringList: Yt, DOMStringMap: Yt, DOMTokenList: Yt, DragEvent: Yt, DynamicsCompressorNode: Yt, Element: Yt, ErrorEvent: Yt, Event: Yt, EventSource: Yt, EventTarget: Yt, external: qt, fetch: qt, File: Yt, FileList: Yt, FileReader: Yt, find: qt, focus: qt, FocusEvent: Yt, FontFace: Yt, FontFaceSetLoadEvent: Yt, FormData: Yt, frames: qt, GainNode: Yt, Gamepad: Yt, GamepadButton: Yt, GamepadEvent: Yt, getComputedStyle: qt, getSelection: qt, HashChangeEvent: Yt, Headers: Yt, history: qt, History: Yt, HTMLAllCollection: Yt, HTMLAnchorElement: Yt, HTMLAreaElement: Yt, HTMLAudioElement: Yt, HTMLBaseElement: Yt, HTMLBodyElement: Yt, HTMLBRElement: Yt, HTMLButtonElement: Yt, HTMLCanvasElement: Yt, HTMLCollection: Yt, HTMLContentElement: Yt, HTMLDataElement: Yt, HTMLDataListElement: Yt, HTMLDetailsElement: Yt, HTMLDialogElement: Yt, HTMLDirectoryElement: Yt, HTMLDivElement: Yt, HTMLDListElement: Yt, HTMLDocument: Yt, HTMLElement: Yt, HTMLEmbedElement: Yt, HTMLFieldSetElement: Yt, HTMLFontElement: Yt, HTMLFormControlsCollection: Yt, HTMLFormElement: Yt, HTMLFrameElement: Yt, HTMLFrameSetElement: Yt, HTMLHeadElement: Yt, HTMLHeadingElement: Yt, HTMLHRElement: Yt, HTMLHtmlElement: Yt, HTMLIFrameElement: Yt, HTMLImageElement: Yt, HTMLInputElement: Yt, HTMLLabelElement: Yt, HTMLLegendElement: Yt, HTMLLIElement: Yt, HTMLLinkElement: Yt, HTMLMapElement: Yt, HTMLMarqueeElement: Yt, HTMLMediaElement: Yt, HTMLMenuElement: Yt, HTMLMetaElement: Yt, HTMLMeterElement: Yt, HTMLModElement: Yt, HTMLObjectElement: Yt, HTMLOListElement: Yt, HTMLOptGroupElement: Yt, HTMLOptionElement: Yt, HTMLOptionsCollection: Yt, HTMLOutputElement: Yt, HTMLParagraphElement: Yt, HTMLParamElement: Yt, HTMLPictureElement: Yt, HTMLPreElement: Yt, HTMLProgressElement: Yt, HTMLQuoteElement: Yt, HTMLScriptElement: Yt, HTMLSelectElement: Yt, HTMLShadowElement: Yt, HTMLSlotElement: Yt, HTMLSourceElement: Yt, HTMLSpanElement: Yt, HTMLStyleElement: Yt, HTMLTableCaptionElement: Yt, HTMLTableCellElement: Yt, HTMLTableColElement: Yt, HTMLTableElement: Yt, HTMLTableRowElement: Yt, HTMLTableSectionElement: Yt, HTMLTemplateElement: Yt, HTMLTextAreaElement: Yt, HTMLTimeElement: Yt, HTMLTitleElement: Yt, HTMLTrackElement: Yt, HTMLUListElement: Yt, HTMLUnknownElement: Yt, HTMLVideoElement: Yt, IDBCursor: Yt, IDBCursorWithValue: Yt, IDBDatabase: Yt, IDBFactory: Yt, IDBIndex: Yt, IDBKeyRange: Yt, IDBObjectStore: Yt, IDBOpenDBRequest: Yt, IDBRequest: Yt, IDBTransaction: Yt, IDBVersionChangeEvent: Yt, IdleDeadline: Yt, IIRFilterNode: Yt, Image: Yt, ImageBitmap: Yt, ImageBitmapRenderingContext: Yt, ImageCapture: Yt, ImageData: Yt, indexedDB: qt, innerHeight: qt, innerWidth: qt, InputEvent: Yt, IntersectionObserver: Yt, IntersectionObserverEntry: Yt, isSecureContext: qt, KeyboardEvent: Yt, KeyframeEffect: Yt, length: qt, localStorage: qt, location: qt, Location: Yt, locationbar: qt, matchMedia: qt, MediaDeviceInfo: Yt, MediaDevices: Yt, MediaElementAudioSourceNode: Yt, MediaEncryptedEvent: Yt, MediaError: Yt, MediaKeyMessageEvent: Yt, MediaKeySession: Yt, MediaKeyStatusMap: Yt, MediaKeySystemAccess: Yt, MediaList: Yt, MediaQueryList: Yt, MediaQueryListEvent: Yt, MediaRecorder: Yt, MediaSettingsRange: Yt, MediaSource: Yt, MediaStream: Yt, MediaStreamAudioDestinationNode: Yt, MediaStreamAudioSourceNode: Yt, MediaStreamEvent: Yt, MediaStreamTrack: Yt, MediaStreamTrackEvent: Yt, menubar: qt, MessageChannel: Yt, MessageEvent: Yt, MessagePort: Yt, MIDIAccess: Yt, MIDIConnectionEvent: Yt, MIDIInput: Yt, MIDIInputMap: Yt, MIDIMessageEvent: Yt, MIDIOutput: Yt, MIDIOutputMap: Yt, MIDIPort: Yt, MimeType: Yt, MimeTypeArray: Yt, MouseEvent: Yt, moveBy: qt, moveTo: qt, MutationEvent: Yt, MutationObserver: Yt, MutationRecord: Yt, name: qt, NamedNodeMap: Yt, NavigationPreloadManager: Yt, navigator: qt, Navigator: Yt, NetworkInformation: Yt, Node: Yt, NodeFilter: qt, NodeIterator: Yt, NodeList: Yt, Notification: Yt, OfflineAudioCompletionEvent: Yt, OfflineAudioContext: Yt, offscreenBuffering: qt, OffscreenCanvas: Yt, open: qt, openDatabase: qt, Option: Yt, origin: qt, OscillatorNode: Yt, outerHeight: qt, outerWidth: qt, PageTransitionEvent: Yt, pageXOffset: qt, pageYOffset: qt, PannerNode: Yt, parent: qt, Path2D: Yt, PaymentAddress: Yt, PaymentRequest: Yt, PaymentRequestUpdateEvent: Yt, PaymentResponse: Yt, performance: qt, Performance: Yt, PerformanceEntry: Yt, PerformanceLongTaskTiming: Yt, PerformanceMark: Yt, PerformanceMeasure: Yt, PerformanceNavigation: Yt, PerformanceNavigationTiming: Yt, PerformanceObserver: Yt, PerformanceObserverEntryList: Yt, PerformancePaintTiming: Yt, PerformanceResourceTiming: Yt, PerformanceTiming: Yt, PeriodicWave: Yt, Permissions: Yt, PermissionStatus: Yt, personalbar: qt, PhotoCapabilities: Yt, Plugin: Yt, PluginArray: Yt, PointerEvent: Yt, PopStateEvent: Yt, postMessage: qt, Presentation: Yt, PresentationAvailability: Yt, PresentationConnection: Yt, PresentationConnectionAvailableEvent: Yt, PresentationConnectionCloseEvent: Yt, PresentationConnectionList: Yt, PresentationReceiver: Yt, PresentationRequest: Yt, print: qt, ProcessingInstruction: Yt, ProgressEvent: Yt, PromiseRejectionEvent: Yt, prompt: qt, PushManager: Yt, PushSubscription: Yt, PushSubscriptionOptions: Yt, queueMicrotask: qt, RadioNodeList: Yt, Range: Yt, ReadableStream: Yt, RemotePlayback: Yt, removeEventListener: qt, Request: Yt, requestAnimationFrame: qt, requestIdleCallback: qt, resizeBy: qt, ResizeObserver: Yt, ResizeObserverEntry: Yt, resizeTo: qt, Response: Yt, RTCCertificate: Yt, RTCDataChannel: Yt, RTCDataChannelEvent: Yt, RTCDtlsTransport: Yt, RTCIceCandidate: Yt, RTCIceTransport: Yt, RTCPeerConnection: Yt, RTCPeerConnectionIceEvent: Yt, RTCRtpReceiver: Yt, RTCRtpSender: Yt, RTCSctpTransport: Yt, RTCSessionDescription: Yt, RTCStatsReport: Yt, RTCTrackEvent: Yt, screen: qt, Screen: Yt, screenLeft: qt, ScreenOrientation: Yt, screenTop: qt, screenX: qt, screenY: qt, ScriptProcessorNode: Yt, scroll: qt, scrollbars: qt, scrollBy: qt, scrollTo: qt, scrollX: qt, scrollY: qt, SecurityPolicyViolationEvent: Yt, Selection: Yt, ServiceWorker: Yt, ServiceWorkerContainer: Yt, ServiceWorkerRegistration: Yt, sessionStorage: qt, ShadowRoot: Yt, SharedWorker: Yt, SourceBuffer: Yt, SourceBufferList: Yt, speechSynthesis: qt, SpeechSynthesisEvent: Yt, SpeechSynthesisUtterance: Yt, StaticRange: Yt, status: qt, statusbar: qt, StereoPannerNode: Yt, stop: qt, Storage: Yt, StorageEvent: Yt, StorageManager: Yt, styleMedia: qt, StyleSheet: Yt, StyleSheetList: Yt, SubtleCrypto: Yt, SVGAElement: Yt, SVGAngle: Yt, SVGAnimatedAngle: Yt, SVGAnimatedBoolean: Yt, SVGAnimatedEnumeration: Yt, SVGAnimatedInteger: Yt, SVGAnimatedLength: Yt, SVGAnimatedLengthList: Yt, SVGAnimatedNumber: Yt, SVGAnimatedNumberList: Yt, SVGAnimatedPreserveAspectRatio: Yt, SVGAnimatedRect: Yt, SVGAnimatedString: Yt, SVGAnimatedTransformList: Yt, SVGAnimateElement: Yt, SVGAnimateMotionElement: Yt, SVGAnimateTransformElement: Yt, SVGAnimationElement: Yt, SVGCircleElement: Yt, SVGClipPathElement: Yt, SVGComponentTransferFunctionElement: Yt, SVGDefsElement: Yt, SVGDescElement: Yt, SVGDiscardElement: Yt, SVGElement: Yt, SVGEllipseElement: Yt, SVGFEBlendElement: Yt, SVGFEColorMatrixElement: Yt, SVGFEComponentTransferElement: Yt, SVGFECompositeElement: Yt, SVGFEConvolveMatrixElement: Yt, SVGFEDiffuseLightingElement: Yt, SVGFEDisplacementMapElement: Yt, SVGFEDistantLightElement: Yt, SVGFEDropShadowElement: Yt, SVGFEFloodElement: Yt, SVGFEFuncAElement: Yt, SVGFEFuncBElement: Yt, SVGFEFuncGElement: Yt, SVGFEFuncRElement: Yt, SVGFEGaussianBlurElement: Yt, SVGFEImageElement: Yt, SVGFEMergeElement: Yt, SVGFEMergeNodeElement: Yt, SVGFEMorphologyElement: Yt, SVGFEOffsetElement: Yt, SVGFEPointLightElement: Yt, SVGFESpecularLightingElement: Yt, SVGFESpotLightElement: Yt, SVGFETileElement: Yt, SVGFETurbulenceElement: Yt, SVGFilterElement: Yt, SVGForeignObjectElement: Yt, SVGGElement: Yt, SVGGeometryElement: Yt, SVGGradientElement: Yt, SVGGraphicsElement: Yt, SVGImageElement: Yt, SVGLength: Yt, SVGLengthList: Yt, SVGLinearGradientElement: Yt, SVGLineElement: Yt, SVGMarkerElement: Yt, SVGMaskElement: Yt, SVGMatrix: Yt, SVGMetadataElement: Yt, SVGMPathElement: Yt, SVGNumber: Yt, SVGNumberList: Yt, SVGPathElement: Yt, SVGPatternElement: Yt, SVGPoint: Yt, SVGPointList: Yt, SVGPolygonElement: Yt, SVGPolylineElement: Yt, SVGPreserveAspectRatio: Yt, SVGRadialGradientElement: Yt, SVGRect: Yt, SVGRectElement: Yt, SVGScriptElement: Yt, SVGSetElement: Yt, SVGStopElement: Yt, SVGStringList: Yt, SVGStyleElement: Yt, SVGSVGElement: Yt, SVGSwitchElement: Yt, SVGSymbolElement: Yt, SVGTextContentElement: Yt, SVGTextElement: Yt, SVGTextPathElement: Yt, SVGTextPositioningElement: Yt, SVGTitleElement: Yt, SVGTransform: Yt, SVGTransformList: Yt, SVGTSpanElement: Yt, SVGUnitTypes: Yt, SVGUseElement: Yt, SVGViewElement: Yt, TaskAttributionTiming: Yt, Text: Yt, TextEvent: Yt, TextMetrics: Yt, TextTrack: Yt, TextTrackCue: Yt, TextTrackCueList: Yt, TextTrackList: Yt, TimeRanges: Yt, toolbar: qt, top: qt, Touch: Yt, TouchEvent: Yt, TouchList: Yt, TrackEvent: Yt, TransitionEvent: Yt, TreeWalker: Yt, UIEvent: Yt, ValidityState: Yt, visualViewport: qt, VisualViewport: Yt, VTTCue: Yt, WaveShaperNode: Yt, WebAssembly: qt, WebGL2RenderingContext: Yt, WebGLActiveInfo: Yt, WebGLBuffer: Yt, WebGLContextEvent: Yt, WebGLFramebuffer: Yt, WebGLProgram: Yt, WebGLQuery: Yt, WebGLRenderbuffer: Yt, WebGLRenderingContext: Yt, WebGLSampler: Yt, WebGLShader: Yt, WebGLShaderPrecisionFormat: Yt, WebGLSync: Yt, WebGLTexture: Yt, WebGLTransformFeedback: Yt, WebGLUniformLocation: Yt, WebGLVertexArrayObject: Yt, WebSocket: Yt, WheelEvent: Yt, Window: Yt, Worker: Yt, WritableStream: Yt, XMLDocument: Yt, XMLHttpRequest: Yt, XMLHttpRequestEventTarget: Yt, XMLHttpRequestUpload: Yt, XMLSerializer: Yt, XPathEvaluator: Yt, XPathExpression: Yt, XPathResult: Yt, XSLTProcessor: Yt };
for (const e2 of ["window", "global", "self", "globalThis"])
  ei[e2] = ei;
function ti(e2) {
  let t = ei;
  for (const i of e2) {
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
  getLiteralValueAtPath(e2, t, i) {
    return ti([this.name, ...e2]) ? q : W;
  }
  hasEffectsOnInteractionAtPath(e2, t, i) {
    switch (t.type) {
      case 0:
        return e2.length === 0 ? this.name !== "undefined" && !ti([this.name]) : !ti([this.name, ...e2].slice(0, -1));
      case 1:
        return true;
      case 2: {
        const s = ti([this.name, ...e2]);
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
  addExportedVariables(e2, t) {
    t.has(this.variable) && e2.push(this.variable);
  }
  bind() {
    !this.variable && Ut(this, this.parent) && (this.variable = this.scope.findVariable(this.name), this.variable.addReference(this));
  }
  declare(e2, t) {
    let i;
    const { treeshake: s } = this.context.options;
    switch (e2) {
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
        throw new Error(`Internal Error: Unexpected identifier kind ${e2}.`);
    }
    return i.kind = e2, [this.variable = i];
  }
  deoptimizePath(e2) {
    var t;
    e2.length !== 0 || this.scope.contains(this.name) || this.disallowImportReassignment(), (t = this.variable) === null || t === void 0 || t.deoptimizePath(e2);
  }
  deoptimizeThisOnInteractionAtPath(e2, t, i) {
    this.variable.deoptimizeThisOnInteractionAtPath(e2, t, i);
  }
  getLiteralValueAtPath(e2, t, i) {
    return this.getVariableRespectingTDZ().getLiteralValueAtPath(e2, t, i);
  }
  getReturnExpressionWhenCalledAtPath(e2, t, i, s) {
    return this.getVariableRespectingTDZ().getReturnExpressionWhenCalledAtPath(e2, t, i, s);
  }
  hasEffects(e2) {
    return this.deoptimized || this.applyDeoptimizations(), !(!this.isPossibleTDZ() || this.variable.kind === "var") || this.context.options.treeshake.unknownGlobalSideEffects && this.variable instanceof ii && this.variable.hasEffectsOnInteractionAtPath(V, Y, e2);
  }
  hasEffectsOnInteractionAtPath(e2, t, i) {
    switch (t.type) {
      case 0:
        return this.variable !== null && this.getVariableRespectingTDZ().hasEffectsOnInteractionAtPath(e2, t, i);
      case 1:
        return (e2.length > 0 ? this.getVariableRespectingTDZ() : this.variable).hasEffectsOnInteractionAtPath(e2, t, i);
      case 2:
        return this.getVariableRespectingTDZ().hasEffectsOnInteractionAtPath(e2, t, i);
    }
  }
  include() {
    this.deoptimized || this.applyDeoptimizations(), this.included || (this.included = true, this.variable !== null && this.context.includeVariableInModule(this.variable));
  }
  includeCallArguments(e2, t) {
    this.variable.includeCallArguments(e2, t);
  }
  isPossibleTDZ() {
    if (this.isTDZAccess !== null)
      return this.isTDZAccess;
    if (!(this.variable instanceof Dt && this.variable.kind && this.variable.kind in si))
      return this.isTDZAccess = false;
    let e2;
    return this.variable.declarations && this.variable.declarations.length === 1 && (e2 = this.variable.declarations[0]) && this.start < e2.start && ri(this) === ri(e2) ? this.isTDZAccess = true : this.variable.initReached ? this.isTDZAccess = false : this.isTDZAccess = true;
  }
  markDeclarationReached() {
    this.variable.initReached = true;
  }
  render(e2, { snippets: { getPropertyAccess: t } }, { renderedParentType: i, isCalleeOfRenderedParent: s, isShorthandProperty: n2 } = ie) {
    if (this.variable) {
      const r2 = this.variable.getName(t);
      r2 !== this.name && (e2.overwrite(this.start, this.end, r2, { contentOnly: true, storeName: true }), n2 && e2.prependRight(this.start, `${this.name}: `)), r2 === "eval" && i === "CallExpression" && s && e2.appendRight(this.start, "0, ");
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
function ri(e2) {
  for (; e2 && !/^Program|Function/.test(e2.type); )
    e2 = e2.parent;
  return e2;
}
function ai(e2, t, i, s) {
  if (t.remove(i, s), e2.annotations)
    for (const s2 of e2.annotations) {
      if (!(s2.start < i))
        return;
      t.remove(s2.start, s2.end);
    }
}
function oi(e2, t) {
  if (e2.annotations || e2.parent.type !== "ExpressionStatement" || (e2 = e2.parent), e2.annotations)
    for (const i of e2.annotations)
      t.remove(i.start, i.end);
}
const li = { isNoStatement: true };
function hi(e2, t, i = 0) {
  let s, n2;
  for (s = e2.indexOf(t, i); ; ) {
    if ((i = e2.indexOf("/", i)) === -1 || i >= s)
      return s;
    n2 = e2.charCodeAt(++i), ++i, (i = n2 === 47 ? e2.indexOf("\n", i) + 1 : e2.indexOf("*/", i) + 2) > s && (s = e2.indexOf(t, i));
  }
}
const ci = /\S/g;
function ui(e2, t) {
  ci.lastIndex = t;
  return ci.exec(e2).index;
}
function di(e2) {
  let t, i, s = 0;
  for (t = e2.indexOf("\n", s); ; ) {
    if (s = e2.indexOf("/", s), s === -1 || s > t)
      return [t, t + 1];
    if (i = e2.charCodeAt(s + 1), i === 47)
      return [s, t + 1];
    s = e2.indexOf("*/", s + 3) + 2, s > t && (t = e2.indexOf("\n", s));
  }
}
function pi(e2, t, i, s, n2) {
  let r2, a2, o2, l2, h2 = e2[0], c2 = !h2.included || h2.needsBoundaries;
  c2 && (l2 = i + di(t.original.slice(i, h2.start))[1]);
  for (let i2 = 1; i2 <= e2.length; i2++)
    r2 = h2, a2 = l2, o2 = c2, h2 = e2[i2], c2 = h2 !== void 0 && (!h2.included || h2.needsBoundaries), o2 || c2 ? (l2 = r2.end + di(t.original.slice(r2.end, h2 === void 0 ? s : h2.start))[1], r2.included ? o2 ? r2.render(t, n2, { end: l2, start: a2 }) : r2.render(t, n2) : ai(r2, t, a2, l2)) : r2.render(t, n2);
}
function fi(e2, t, i, s) {
  const n2 = [];
  let r2, a2, o2, l2, h2, c2 = i - 1;
  for (let s2 = 0; s2 < e2.length; s2++) {
    for (a2 = e2[s2], r2 !== void 0 && (c2 = r2.end + hi(t.original.slice(r2.end, a2.start), ",")), o2 = l2 = c2 + 1 + di(t.original.slice(c2 + 1, a2.start))[1]; h2 = t.original.charCodeAt(o2), h2 === 32 || h2 === 9 || h2 === 10 || h2 === 13; )
      o2++;
    r2 !== void 0 && n2.push({ contentEnd: l2, end: o2, node: r2, separator: c2, start: i }), r2 = a2, i = o2;
  }
  return n2.push({ contentEnd: s, end: s, node: r2, separator: null, start: i }), n2;
}
function mi(e2, t, i) {
  for (; ; ) {
    const [s, n2] = di(e2.original.slice(t, i));
    if (s === -1)
      break;
    e2.remove(t + s, t += n2);
  }
}
class gi extends Ft {
  addDeclaration(e2, t, i, s) {
    if (s) {
      const n2 = this.parent.addDeclaration(e2, t, i, s);
      return n2.markInitializersForDeoptimization(), n2;
    }
    return super.addDeclaration(e2, t, i, false);
  }
}
class yi extends ut {
  initialise() {
    this.directive && this.directive !== "use strict" && this.parent.type === "Program" && this.context.warn({ code: "MODULE_LEVEL_DIRECTIVE", message: `Module level directives cause errors when bundled, '${this.directive}' was ignored.` }, this.start);
  }
  render(e2, t) {
    super.render(e2, t), this.included && this.insertSemicolon(e2);
  }
  shouldBeIncluded(e2) {
    return this.directive && this.directive !== "use strict" ? this.parent.type !== "Program" : super.shouldBeIncluded(e2);
  }
  applyDeoptimizations() {
  }
}
class xi extends ut {
  constructor() {
    super(...arguments), this.directlyIncluded = false;
  }
  addImplicitReturnExpressionToScope() {
    const e2 = this.body[this.body.length - 1];
    e2 && e2.type === "ReturnStatement" || this.scope.addReturnExpression(X);
  }
  createScope(e2) {
    this.scope = this.parent.preventChildBlockScope ? e2 : new gi(e2);
  }
  hasEffects(e2) {
    if (this.deoptimizeBody)
      return true;
    for (const t of this.body) {
      if (e2.brokenFlow)
        break;
      if (t.hasEffects(e2))
        return true;
    }
    return false;
  }
  include(e2, t) {
    if (!this.deoptimizeBody || !this.directlyIncluded) {
      this.included = true, this.directlyIncluded = true, this.deoptimizeBody && (t = true);
      for (const i of this.body)
        (t || i.shouldBeIncluded(e2)) && i.include(e2, t);
    }
  }
  initialise() {
    const e2 = this.body[0];
    this.deoptimizeBody = e2 instanceof yi && e2.directive === "use asm";
  }
  render(e2, t) {
    this.body.length ? pi(this.body, e2, this.start + 1, this.end - 1, t) : super.render(e2, t);
  }
}
class Ei extends ut {
  constructor() {
    super(...arguments), this.declarationInit = null;
  }
  addExportedVariables(e2, t) {
    this.argument.addExportedVariables(e2, t);
  }
  declare(e2, t) {
    return this.declarationInit = t, this.argument.declare(e2, X);
  }
  deoptimizePath(e2) {
    e2.length === 0 && this.argument.deoptimizePath(V);
  }
  hasEffectsOnInteractionAtPath(e2, t, i) {
    return e2.length > 0 || this.argument.hasEffectsOnInteractionAtPath(V, t, i);
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
  deoptimizePath(e2) {
    this.getObjectEntity().deoptimizePath(e2), e2.length === 1 && e2[0] === M && this.scope.getReturnExpression().deoptimizePath(B);
  }
  deoptimizeThisOnInteractionAtPath(e2, t, i) {
    t.length > 0 && this.getObjectEntity().deoptimizeThisOnInteractionAtPath(e2, t, i);
  }
  getLiteralValueAtPath(e2, t, i) {
    return this.getObjectEntity().getLiteralValueAtPath(e2, t, i);
  }
  getReturnExpressionWhenCalledAtPath(e2, t, i, s) {
    return e2.length > 0 ? this.getObjectEntity().getReturnExpressionWhenCalledAtPath(e2, t, i, s) : this.async ? (this.deoptimizedReturn || (this.deoptimizedReturn = true, this.scope.getReturnExpression().deoptimizePath(B), this.context.requestTreeshakingPass()), X) : this.scope.getReturnExpression();
  }
  hasEffectsOnInteractionAtPath(e2, t, i) {
    if (e2.length > 0 || t.type !== 2)
      return this.getObjectEntity().hasEffectsOnInteractionAtPath(e2, t, i);
    if (this.async) {
      const { propertyReadSideEffects: e3 } = this.context.options.treeshake, t2 = this.scope.getReturnExpression();
      if (t2.hasEffectsOnInteractionAtPath(["then"], J, i) || e3 && (e3 === "always" || t2.hasEffectsOnInteractionAtPath(["then"], Y, i)))
        return true;
    }
    for (const e3 of this.params)
      if (e3.hasEffects(i))
        return true;
    return false;
  }
  include(e2, t) {
    this.deoptimized || this.applyDeoptimizations(), this.included = true;
    const { brokenFlow: i } = e2;
    e2.brokenFlow = 0, this.body.include(e2, t), e2.brokenFlow = i;
  }
  includeCallArguments(e2, t) {
    this.scope.includeCallArguments(e2, t);
  }
  initialise() {
    this.scope.addParameterVariables(this.params.map((e2) => e2.declare("parameter", X)), this.params[this.params.length - 1] instanceof Ei), this.body instanceof xi ? this.body.addImplicitReturnExpressionToScope() : this.scope.addReturnExpression(this.body);
  }
  parseNode(e2) {
    e2.body.type === "BlockStatement" && (this.body = new xi(e2.body, this, this.scope.hoistedBodyVarScope)), super.parseNode(e2);
  }
  applyDeoptimizations() {
  }
}
bi.prototype.preventChildBlockScope = true;
class vi extends bi {
  constructor() {
    super(...arguments), this.objectEntity = null;
  }
  createScope(e2) {
    this.scope = new jt(e2, this.context);
  }
  hasEffects() {
    return this.deoptimized || this.applyDeoptimizations(), false;
  }
  hasEffectsOnInteractionAtPath(e2, t, i) {
    if (super.hasEffectsOnInteractionAtPath(e2, t, i))
      return true;
    if (t.type === 2) {
      const { ignore: e3, brokenFlow: t2 } = i;
      if (i.ignore = { breaks: false, continues: false, labels: /* @__PURE__ */ new Set(), returnYield: true }, this.body.hasEffects(i))
        return true;
      i.ignore = e3, i.brokenFlow = t2;
    }
    return false;
  }
  include(e2, t) {
    super.include(e2, t);
    for (const i of this.params)
      i instanceof ni || i.include(e2, t);
  }
  getObjectEntity() {
    return this.objectEntity !== null ? this.objectEntity : this.objectEntity = new Et([], St);
  }
}
function Si(e2, { exportNamesByVariable: t, snippets: { _: i, getObject: s, getPropertyAccess: n2 } }, r2 = "") {
  if (e2.length === 1 && t.get(e2[0]).length === 1) {
    const s2 = e2[0];
    return `exports('${t.get(s2)}',${i}${s2.getName(n2)}${r2})`;
  }
  {
    const i2 = [];
    for (const s2 of e2)
      for (const e3 of t.get(s2))
        i2.push([e3, s2.getName(n2) + r2]);
    return `exports(${s(i2, { lineBreakIndent: null })})`;
  }
}
function Ai(e2, t, i, s, { exportNamesByVariable: n2, snippets: { _: r2 } }) {
  s.prependRight(t, `exports('${n2.get(e2)}',${r2}`), s.appendLeft(i, ")");
}
function Ii(e2, t, i, s, n2, r2) {
  const { _: a2, getPropertyAccess: o2 } = r2.snippets;
  n2.appendLeft(i, `,${a2}${Si([e2], r2)},${a2}${e2.getName(o2)}`), s && (n2.prependRight(t, "("), n2.appendLeft(i, ")"));
}
class ki extends ut {
  addExportedVariables(e2, t) {
    for (const i of this.properties)
      i.type === "Property" ? i.value.addExportedVariables(e2, t) : i.argument.addExportedVariables(e2, t);
  }
  declare(e2, t) {
    const i = [];
    for (const s of this.properties)
      i.push(...s.declare(e2, t));
    return i;
  }
  deoptimizePath(e2) {
    if (e2.length === 0)
      for (const t of this.properties)
        t.deoptimizePath(e2);
  }
  hasEffectsOnInteractionAtPath(e2, t, i) {
    for (const e3 of this.properties)
      if (e3.hasEffectsOnInteractionAtPath(V, t, i))
        return true;
    return false;
  }
  markDeclarationReached() {
    for (const e2 of this.properties)
      e2.markDeclarationReached();
  }
}
class Pi extends Dt {
  constructor(e2) {
    super("arguments", null, X, e2);
  }
  hasEffectsOnInteractionAtPath(e2, { type: t }) {
    return t !== 0 || e2.length > 1;
  }
}
class wi extends Dt {
  constructor(e2) {
    super("this", null, null, e2), this.deoptimizedPaths = [], this.entitiesToBeDeoptimized = /* @__PURE__ */ new Set(), this.thisDeoptimizationList = [], this.thisDeoptimizations = new H();
  }
  addEntityToBeDeoptimized(e2) {
    for (const t of this.deoptimizedPaths)
      e2.deoptimizePath(t);
    for (const { interaction: t, path: i } of this.thisDeoptimizationList)
      e2.deoptimizeThisOnInteractionAtPath(t, i, G);
    this.entitiesToBeDeoptimized.add(e2);
  }
  deoptimizePath(e2) {
    if (e2.length !== 0 && !this.deoptimizationTracker.trackEntityAtPathAndGetIfTracked(e2, this)) {
      this.deoptimizedPaths.push(e2);
      for (const t of this.entitiesToBeDeoptimized)
        t.deoptimizePath(e2);
    }
  }
  deoptimizeThisOnInteractionAtPath(e2, t) {
    const i = { interaction: e2, path: t };
    if (!this.thisDeoptimizations.trackEntityAtPathAndGetIfTracked(t, e2.type, e2.thisArg)) {
      for (const i2 of this.entitiesToBeDeoptimized)
        i2.deoptimizeThisOnInteractionAtPath(e2, t, G);
      this.thisDeoptimizationList.push(i);
    }
  }
  hasEffectsOnInteractionAtPath(e2, t, i) {
    return this.getInit(i).hasEffectsOnInteractionAtPath(e2, t, i) || super.hasEffectsOnInteractionAtPath(e2, t, i);
  }
  getInit(e2) {
    return e2.replacedVariableInits.get(this) || X;
  }
}
class Ci extends jt {
  constructor(e2, t) {
    super(e2, t), this.variables.set("arguments", this.argumentsVariable = new Pi(t)), this.variables.set("this", this.thisVariable = new wi(t));
  }
  findLexicalBoundary() {
    return this;
  }
  includeCallArguments(e2, t) {
    if (super.includeCallArguments(e2, t), this.argumentsVariable.included)
      for (const i of t)
        i.included || i.include(e2, false);
  }
}
class _i extends bi {
  constructor() {
    super(...arguments), this.objectEntity = null;
  }
  createScope(e2) {
    this.scope = new Ci(e2, this.context);
  }
  deoptimizeThisOnInteractionAtPath(e2, t, i) {
    super.deoptimizeThisOnInteractionAtPath(e2, t, i), e2.type === 2 && t.length === 0 && this.scope.thisVariable.addEntityToBeDeoptimized(e2.thisArg);
  }
  hasEffects(e2) {
    var t;
    return this.deoptimized || this.applyDeoptimizations(), !!((t = this.id) === null || t === void 0 ? void 0 : t.hasEffects(e2));
  }
  hasEffectsOnInteractionAtPath(e2, t, i) {
    if (super.hasEffectsOnInteractionAtPath(e2, t, i))
      return true;
    if (t.type === 2) {
      const e3 = i.replacedVariableInits.get(this.scope.thisVariable);
      i.replacedVariableInits.set(this.scope.thisVariable, t.withNew ? new Et(/* @__PURE__ */ Object.create(null), St) : X);
      const { brokenFlow: s, ignore: n2 } = i;
      if (i.ignore = { breaks: false, continues: false, labels: /* @__PURE__ */ new Set(), returnYield: true }, this.body.hasEffects(i))
        return true;
      i.brokenFlow = s, e3 ? i.replacedVariableInits.set(this.scope.thisVariable, e3) : i.replacedVariableInits.delete(this.scope.thisVariable), i.ignore = n2;
    }
    return false;
  }
  include(e2, t) {
    var i;
    super.include(e2, t), (i = this.id) === null || i === void 0 || i.include();
    const s = this.scope.argumentsVariable.included;
    for (const i2 of this.params)
      i2 instanceof ni && !s || i2.include(e2, t);
  }
  initialise() {
    var e2;
    super.initialise(), (e2 = this.id) === null || e2 === void 0 || e2.declare("function", this);
  }
  getObjectEntity() {
    return this.objectEntity !== null ? this.objectEntity : this.objectEntity = new Et([{ key: "prototype", kind: "init", property: new Et([], St) }], St);
  }
}
const Ni = { "!=": (e2, t) => e2 != t, "!==": (e2, t) => e2 !== t, "%": (e2, t) => e2 % t, "&": (e2, t) => e2 & t, "*": (e2, t) => e2 * t, "**": (e2, t) => e2 ** t, "+": (e2, t) => e2 + t, "-": (e2, t) => e2 - t, "/": (e2, t) => e2 / t, "<": (e2, t) => e2 < t, "<<": (e2, t) => e2 << t, "<=": (e2, t) => e2 <= t, "==": (e2, t) => e2 == t, "===": (e2, t) => e2 === t, ">": (e2, t) => e2 > t, ">=": (e2, t) => e2 >= t, ">>": (e2, t) => e2 >> t, ">>>": (e2, t) => e2 >>> t, "^": (e2, t) => e2 ^ t, "|": (e2, t) => e2 | t };
function $i(e2, t, i) {
  if (i.arguments.length > 0)
    if (i.arguments[i.arguments.length - 1].included)
      for (const s of i.arguments)
        s.render(e2, t);
    else {
      let s = i.arguments.length - 2;
      for (; s >= 0 && !i.arguments[s].included; )
        s--;
      if (s >= 0) {
        for (let n2 = 0; n2 <= s; n2++)
          i.arguments[n2].render(e2, t);
        e2.remove(hi(e2.original, ",", i.arguments[s].end), i.end - 1);
      } else
        e2.remove(hi(e2.original, "(", i.callee.end) + 1, i.end - 1);
    }
}
class Ti extends ut {
  deoptimizeThisOnInteractionAtPath() {
  }
  getLiteralValueAtPath(e2) {
    return e2.length > 0 || this.value === null && this.context.code.charCodeAt(this.start) !== 110 || typeof this.value == "bigint" || this.context.code.charCodeAt(this.start) === 47 ? W : this.value;
  }
  getReturnExpressionWhenCalledAtPath(e2) {
    return e2.length !== 1 ? X : Qe(this.members, e2[0]);
  }
  hasEffectsOnInteractionAtPath(e2, t, i) {
    switch (t.type) {
      case 0:
        return e2.length > (this.value === null ? 0 : 1);
      case 1:
        return true;
      case 2:
        return e2.length !== 1 || Ye(this.members, e2[0], t, i);
    }
  }
  initialise() {
    this.members = function(e2) {
      switch (typeof e2) {
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
  parseNode(e2) {
    this.value = e2.value, this.regex = e2.regex, super.parseNode(e2);
  }
  render(e2) {
    typeof this.value == "string" && e2.indentExclusionRanges.push([this.start + 1, this.end - 1]);
  }
}
function Oi(e2) {
  return e2.computed ? function(e3) {
    if (e3 instanceof Ti)
      return String(e3.value);
    return null;
  }(e2.property) : e2.property.name;
}
function Ri(e2) {
  const t = e2.propertyKey, i = e2.object;
  if (typeof t == "string") {
    if (i instanceof ni)
      return [{ key: i.name, pos: i.start }, { key: t, pos: e2.property.start }];
    if (i instanceof Mi) {
      const s = Ri(i);
      return s && [...s, { key: t, pos: e2.property.start }];
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
    const e2 = Ri(this), t = e2 && this.scope.findVariable(e2[0].key);
    if (t && t.isNamespace) {
      const i = Di(t, e2.slice(1), this.context);
      i ? typeof i == "string" ? this.replacement = i : (this.variable = i, this.scope.addNamespaceMemberAccess(function(e3) {
        let t2 = e3[0].key;
        for (let i2 = 1; i2 < e3.length; i2++)
          t2 += "." + e3[i2].key;
        return t2;
      }(e2), i)) : super.bind();
    } else
      super.bind();
  }
  deoptimizeCache() {
    const e2 = this.expressionsToBeDeoptimized;
    this.expressionsToBeDeoptimized = [], this.propertyKey = M, this.object.deoptimizePath(B);
    for (const t of e2)
      t.deoptimizeCache();
  }
  deoptimizePath(e2) {
    if (e2.length === 0 && this.disallowNamespaceReassignment(), this.variable)
      this.variable.deoptimizePath(e2);
    else if (!this.replacement && e2.length < 7) {
      const t = this.getPropertyKey();
      this.object.deoptimizePath([t === M ? D : t, ...e2]);
    }
  }
  deoptimizeThisOnInteractionAtPath(e2, t, i) {
    this.variable ? this.variable.deoptimizeThisOnInteractionAtPath(e2, t, i) : this.replacement || (t.length < 7 ? this.object.deoptimizeThisOnInteractionAtPath(e2, [this.getPropertyKey(), ...t], i) : e2.thisArg.deoptimizePath(B));
  }
  getLiteralValueAtPath(e2, t, i) {
    return this.variable ? this.variable.getLiteralValueAtPath(e2, t, i) : this.replacement ? W : (this.expressionsToBeDeoptimized.push(i), e2.length < 7 ? this.object.getLiteralValueAtPath([this.getPropertyKey(), ...e2], t, i) : W);
  }
  getReturnExpressionWhenCalledAtPath(e2, t, i, s) {
    return this.variable ? this.variable.getReturnExpressionWhenCalledAtPath(e2, t, i, s) : this.replacement ? X : (this.expressionsToBeDeoptimized.push(s), e2.length < 7 ? this.object.getReturnExpressionWhenCalledAtPath([this.getPropertyKey(), ...e2], t, i, s) : X);
  }
  hasEffects(e2) {
    return this.deoptimized || this.applyDeoptimizations(), this.property.hasEffects(e2) || this.object.hasEffects(e2) || this.hasAccessEffect(e2);
  }
  hasEffectsAsAssignmentTarget(e2, t) {
    return t && !this.deoptimized && this.applyDeoptimizations(), this.assignmentDeoptimized || this.applyAssignmentDeoptimization(), this.property.hasEffects(e2) || this.object.hasEffects(e2) || t && this.hasAccessEffect(e2) || this.hasEffectsOnInteractionAtPath(V, this.assignmentInteraction, e2);
  }
  hasEffectsOnInteractionAtPath(e2, t, i) {
    return this.variable ? this.variable.hasEffectsOnInteractionAtPath(e2, t, i) : !!this.replacement || (!(e2.length < 7) || this.object.hasEffectsOnInteractionAtPath([this.getPropertyKey(), ...e2], t, i));
  }
  include(e2, t) {
    this.deoptimized || this.applyDeoptimizations(), this.includeProperties(e2, t);
  }
  includeAsAssignmentTarget(e2, t, i) {
    this.assignmentDeoptimized || this.applyAssignmentDeoptimization(), i ? this.include(e2, t) : this.includeProperties(e2, t);
  }
  includeCallArguments(e2, t) {
    this.variable ? this.variable.includeCallArguments(e2, t) : super.includeCallArguments(e2, t);
  }
  initialise() {
    this.propertyKey = Oi(this), this.accessInteraction = { thisArg: this.object, type: 0 };
  }
  render(e2, t, { renderedParentType: i, isCalleeOfRenderedParent: s, renderedSurroundingElement: n2 } = ie) {
    if (this.variable || this.replacement) {
      const { snippets: { getPropertyAccess: n3 } } = t;
      let r2 = this.variable ? this.variable.getName(n3) : this.replacement;
      i && s && (r2 = "0, " + r2), e2.overwrite(this.start, this.end, r2, { contentOnly: true, storeName: true });
    } else
      i && s && e2.appendRight(this.start, "0, "), this.object.render(e2, t, { renderedSurroundingElement: n2 }), this.property.render(e2, t);
  }
  setAssignedValue(e2) {
    this.assignmentInteraction = { args: [e2], thisArg: this.object, type: 1 };
  }
  applyDeoptimizations() {
    this.deoptimized = true;
    const { propertyReadSideEffects: e2 } = this.context.options.treeshake;
    if (this.bound && e2 && !this.variable && !this.replacement) {
      const e3 = this.getPropertyKey();
      this.object.deoptimizeThisOnInteractionAtPath(this.accessInteraction, [e3], G), this.context.requestTreeshakingPass();
    }
  }
  applyAssignmentDeoptimization() {
    this.assignmentDeoptimized = true;
    const { propertyReadSideEffects: e2 } = this.context.options.treeshake;
    this.bound && e2 && !this.variable && !this.replacement && (this.object.deoptimizeThisOnInteractionAtPath(this.assignmentInteraction, [this.getPropertyKey()], G), this.context.requestTreeshakingPass());
  }
  disallowNamespaceReassignment() {
    if (this.object instanceof ni) {
      this.scope.findVariable(this.object.name).isNamespace && (this.variable && this.context.includeVariableInModule(this.variable), this.context.warn({ code: "ILLEGAL_NAMESPACE_REASSIGNMENT", message: `Illegal reassignment to import '${this.object.name}'` }, this.start));
    }
  }
  getPropertyKey() {
    if (this.propertyKey === null) {
      this.propertyKey = M;
      const e2 = this.property.getLiteralValueAtPath(V, G, this);
      return this.propertyKey = typeof e2 == "symbol" ? M : String(e2);
    }
    return this.propertyKey;
  }
  hasAccessEffect(e2) {
    const { propertyReadSideEffects: t } = this.context.options.treeshake;
    return !(this.variable || this.replacement) && t && (t === "always" || this.object.hasEffectsOnInteractionAtPath([this.getPropertyKey()], this.accessInteraction, e2));
  }
  includeProperties(e2, t) {
    this.included || (this.included = true, this.variable && this.context.includeVariableInModule(this.variable)), this.object.include(e2, t), this.property.include(e2, t);
  }
}
function Di(e2, t, i) {
  if (t.length === 0)
    return e2;
  if (!e2.isNamespace || e2 instanceof te)
    return null;
  const s = t[0].key, n2 = e2.context.traceExport(s);
  if (!n2) {
    const n3 = e2.context.fileName;
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
      for (const e2 of this.deoptimizableDependentExpressions)
        e2.deoptimizeCache();
      for (const e2 of this.expressionsToBeDeoptimized)
        e2.deoptimizePath(B);
    }
  }
  deoptimizePath(e2) {
    if (e2.length === 0 || this.context.deoptimizationTracker.trackEntityAtPathAndGetIfTracked(e2, this))
      return;
    const t = this.getReturnExpression();
    t !== X && t.deoptimizePath(e2);
  }
  deoptimizeThisOnInteractionAtPath(e2, t, i) {
    const s = this.getReturnExpression(i);
    s === X ? e2.thisArg.deoptimizePath(B) : i.withTrackedEntityAtPath(t, s, () => {
      this.expressionsToBeDeoptimized.add(e2.thisArg), s.deoptimizeThisOnInteractionAtPath(e2, t, i);
    }, void 0);
  }
  getLiteralValueAtPath(e2, t, i) {
    const s = this.getReturnExpression(t);
    return s === X ? W : t.withTrackedEntityAtPath(e2, s, () => (this.deoptimizableDependentExpressions.push(i), s.getLiteralValueAtPath(e2, t, i)), W);
  }
  getReturnExpressionWhenCalledAtPath(e2, t, i, s) {
    const n2 = this.getReturnExpression(i);
    return this.returnExpression === X ? X : i.withTrackedEntityAtPath(e2, n2, () => (this.deoptimizableDependentExpressions.push(s), n2.getReturnExpressionWhenCalledAtPath(e2, t, i, s)), X);
  }
  hasEffectsOnInteractionAtPath(e2, t, i) {
    const { type: s } = t;
    if (s === 2) {
      if ((t.withNew ? i.instantiated : i.called).trackEntityAtPathAndGetIfTracked(e2, t.args, this))
        return false;
    } else if ((s === 1 ? i.assigned : i.accessed).trackEntityAtPathAndGetIfTracked(e2, this))
      return false;
    return this.getReturnExpression().hasEffectsOnInteractionAtPath(e2, t, i);
  }
}
class Vi extends zt {
  addDeclaration(e2, t, i, s) {
    const n2 = this.variables.get(e2.name);
    return n2 ? (this.parent.addDeclaration(e2, t, Le, s), n2.addDeclaration(e2, i), n2) : this.parent.addDeclaration(e2, t, i, s);
  }
}
class Bi extends Ft {
  constructor(e2, t, i) {
    super(e2), this.variables.set("this", this.thisVariable = new Dt("this", null, t, i)), this.instanceScope = new Ft(this), this.instanceScope.variables.set("this", new wi(i));
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
  deoptimizePath(e2) {
    this.getAccessedValue().deoptimizePath(e2);
  }
  deoptimizeThisOnInteractionAtPath(e2, t, i) {
    return e2.type === 0 && this.kind === "get" && t.length === 0 ? this.value.deoptimizeThisOnInteractionAtPath({ args: Z, thisArg: e2.thisArg, type: 2, withNew: false }, V, i) : e2.type === 1 && this.kind === "set" && t.length === 0 ? this.value.deoptimizeThisOnInteractionAtPath({ args: e2.args, thisArg: e2.thisArg, type: 2, withNew: false }, V, i) : void this.getAccessedValue().deoptimizeThisOnInteractionAtPath(e2, t, i);
  }
  getLiteralValueAtPath(e2, t, i) {
    return this.getAccessedValue().getLiteralValueAtPath(e2, t, i);
  }
  getReturnExpressionWhenCalledAtPath(e2, t, i, s) {
    return this.getAccessedValue().getReturnExpressionWhenCalledAtPath(e2, t, i, s);
  }
  hasEffects(e2) {
    return this.key.hasEffects(e2);
  }
  hasEffectsOnInteractionAtPath(e2, t, i) {
    return this.kind === "get" && t.type === 0 && e2.length === 0 ? this.value.hasEffectsOnInteractionAtPath(V, { args: Z, thisArg: t.thisArg, type: 2, withNew: false }, i) : this.kind === "set" && t.type === 1 ? this.value.hasEffectsOnInteractionAtPath(V, { args: t.args, thisArg: t.thisArg, type: 2, withNew: false }, i) : this.getAccessedValue().hasEffectsOnInteractionAtPath(e2, t, i);
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
  constructor(e2, t) {
    super(), this.object = e2, this.key = t;
  }
  deoptimizePath(e2) {
    this.object.deoptimizePath([this.key, ...e2]);
  }
  deoptimizeThisOnInteractionAtPath(e2, t, i) {
    this.object.deoptimizeThisOnInteractionAtPath(e2, [this.key, ...t], i);
  }
  getLiteralValueAtPath(e2, t, i) {
    return this.object.getLiteralValueAtPath([this.key, ...e2], t, i);
  }
  getReturnExpressionWhenCalledAtPath(e2, t, i, s) {
    return this.object.getReturnExpressionWhenCalledAtPath([this.key, ...e2], t, i, s);
  }
  hasEffectsOnInteractionAtPath(e2, t, i) {
    return this.object.hasEffectsOnInteractionAtPath([this.key, ...e2], t, i);
  }
}
class Ui extends ut {
  constructor() {
    super(...arguments), this.objectEntity = null;
  }
  createScope(e2) {
    this.scope = new Ft(e2);
  }
  deoptimizeCache() {
    this.getObjectEntity().deoptimizeAllProperties();
  }
  deoptimizePath(e2) {
    this.getObjectEntity().deoptimizePath(e2);
  }
  deoptimizeThisOnInteractionAtPath(e2, t, i) {
    this.getObjectEntity().deoptimizeThisOnInteractionAtPath(e2, t, i);
  }
  getLiteralValueAtPath(e2, t, i) {
    return this.getObjectEntity().getLiteralValueAtPath(e2, t, i);
  }
  getReturnExpressionWhenCalledAtPath(e2, t, i, s) {
    return this.getObjectEntity().getReturnExpressionWhenCalledAtPath(e2, t, i, s);
  }
  hasEffects(e2) {
    var t, i;
    this.deoptimized || this.applyDeoptimizations();
    const s = ((t = this.superClass) === null || t === void 0 ? void 0 : t.hasEffects(e2)) || this.body.hasEffects(e2);
    return (i = this.id) === null || i === void 0 || i.markDeclarationReached(), s || super.hasEffects(e2);
  }
  hasEffectsOnInteractionAtPath(e2, t, i) {
    var s;
    return t.type === 2 && e2.length === 0 ? !t.withNew || (this.classConstructor !== null ? this.classConstructor.hasEffectsOnInteractionAtPath(e2, t, i) : (s = this.superClass) === null || s === void 0 ? void 0 : s.hasEffectsOnInteractionAtPath(e2, t, i)) || false : this.getObjectEntity().hasEffectsOnInteractionAtPath(e2, t, i);
  }
  include(e2, t) {
    var i;
    this.deoptimized || this.applyDeoptimizations(), this.included = true, (i = this.superClass) === null || i === void 0 || i.include(e2, t), this.body.include(e2, t), this.id && (this.id.markDeclarationReached(), this.id.include());
  }
  initialise() {
    var e2;
    (e2 = this.id) === null || e2 === void 0 || e2.declare("class", this);
    for (const e3 of this.body.body)
      if (e3 instanceof zi && e3.kind === "constructor")
        return void (this.classConstructor = e3);
    this.classConstructor = null;
  }
  applyDeoptimizations() {
    this.deoptimized = true;
    for (const e2 of this.body.body)
      e2.static || e2 instanceof zi && e2.kind === "constructor" || e2.deoptimizePath(B);
    this.context.requestTreeshakingPass();
  }
  getObjectEntity() {
    if (this.objectEntity !== null)
      return this.objectEntity;
    const e2 = [], t = [];
    for (const i of this.body.body) {
      const s = i.static ? e2 : t, n2 = i.kind;
      if (s === t && !n2)
        continue;
      const r2 = n2 === "set" || n2 === "get" ? n2 : "init";
      let a2;
      if (i.computed) {
        const e3 = i.key.getLiteralValueAtPath(V, G, this);
        if (typeof e3 == "symbol") {
          s.push({ key: M, kind: r2, property: i });
          continue;
        }
        a2 = String(e3);
      } else
        a2 = i.key instanceof ni ? i.key.name : String(i.key.value);
      s.push({ key: a2, kind: r2, property: i });
    }
    return e2.unshift({ key: "prototype", kind: "init", property: new Et(t, this.superClass ? new ji(this.superClass, "prototype") : St) }), this.objectEntity = new Et(e2, this.superClass || St);
  }
}
class Gi extends Ui {
  initialise() {
    super.initialise(), this.id !== null && (this.id.variable.isId = true);
  }
  parseNode(e2) {
    e2.id !== null && (this.id = new ni(e2.id, this, this.scope.parent)), super.parseNode(e2);
  }
  render(e2, t) {
    const { exportNamesByVariable: i, format: s, snippets: { _: n2 } } = t;
    s === "system" && this.id && i.has(this.id.variable) && e2.appendLeft(this.end, `${n2}${Si([this.id.variable], t)};`), super.render(e2, t);
  }
}
class Hi extends K {
  constructor(e2) {
    super(), this.expressions = e2, this.included = false;
  }
  deoptimizePath(e2) {
    for (const t of this.expressions)
      t.deoptimizePath(e2);
  }
  getReturnExpressionWhenCalledAtPath(e2, t, i, s) {
    return new Hi(this.expressions.map((n2) => n2.getReturnExpressionWhenCalledAtPath(e2, t, i, s)));
  }
  hasEffectsOnInteractionAtPath(e2, t, i) {
    for (const s of this.expressions)
      if (s.hasEffectsOnInteractionAtPath(e2, t, i))
        return true;
    return false;
  }
  include(e2, t) {
    for (const i of this.expressions)
      i.included || i.include(e2, t);
  }
}
class Wi extends ut {
  hasEffects() {
    return false;
  }
  initialise() {
    this.context.addExport(this);
  }
  render(e2, t, i) {
    e2.remove(i.start, i.end);
  }
  applyDeoptimizations() {
  }
}
Wi.prototype.needsBoundaries = true;
class qi extends _i {
  initialise() {
    super.initialise(), this.id !== null && (this.id.variable.isId = true);
  }
  parseNode(e2) {
    e2.id !== null && (this.id = new ni(e2.id, this, this.scope.parent)), super.parseNode(e2);
  }
}
class Ki extends ut {
  include(e2, t) {
    super.include(e2, t), t && this.context.includeVariableInModule(this.variable);
  }
  initialise() {
    const e2 = this.declaration;
    this.declarationName = e2.id && e2.id.name || this.declaration.name, this.variable = this.scope.addExportDefaultDeclaration(this.declarationName || this.context.getModuleName(), this, this.context), this.context.addExport(this);
  }
  render(e2, t, i) {
    const { start: s, end: n2 } = i, r2 = function(e3, t2) {
      return ui(e3, hi(e3, "default", t2) + 7);
    }(e2.original, this.start);
    if (this.declaration instanceof qi)
      this.renderNamedDeclaration(e2, r2, "function", "(", this.declaration.id === null, t);
    else if (this.declaration instanceof Gi)
      this.renderNamedDeclaration(e2, r2, "class", "{", this.declaration.id === null, t);
    else {
      if (this.variable.getOriginalVariable() !== this.variable)
        return void ai(this, e2, s, n2);
      if (!this.variable.included)
        return e2.remove(this.start, r2), this.declaration.render(e2, t, { renderedSurroundingElement: "ExpressionStatement" }), void (e2.original[this.end - 1] !== ";" && e2.appendLeft(this.end, ";"));
      this.renderVariableDeclaration(e2, r2, t);
    }
    this.declaration.render(e2, t);
  }
  applyDeoptimizations() {
  }
  renderNamedDeclaration(e2, t, i, s, n2, r2) {
    const { exportNamesByVariable: a2, format: o2, snippets: { getPropertyAccess: l2 } } = r2, h2 = this.variable.getName(l2);
    e2.remove(this.start, t), n2 && e2.appendLeft(function(e3, t2, i2, s2) {
      const n3 = hi(e3, t2, s2) + t2.length;
      e3 = e3.slice(n3, hi(e3, i2, n3));
      const r3 = hi(e3, "*");
      return r3 === -1 ? n3 : n3 + r3 + 1;
    }(e2.original, i, s, t), ` ${h2}`), o2 === "system" && this.declaration instanceof Gi && a2.has(this.variable) && e2.appendLeft(this.end, ` ${Si([this.variable], r2)};`);
  }
  renderVariableDeclaration(e2, t, { format: i, exportNamesByVariable: s, snippets: { cnst: n2, getPropertyAccess: r2 } }) {
    const a2 = e2.original.charCodeAt(this.end - 1) === 59, o2 = i === "system" && s.get(this.variable);
    o2 ? (e2.overwrite(this.start, t, `${n2} ${this.variable.getName(r2)} = exports('${o2[0]}', `), e2.appendRight(a2 ? this.end - 1 : this.end, ")" + (a2 ? "" : ";"))) : (e2.overwrite(this.start, t, `${n2} ${this.variable.getName(r2)} = `), a2 || e2.appendLeft(this.end, ";"));
  }
}
Ki.prototype.needsBoundaries = true;
class Xi extends ut {
  bind() {
    var e2;
    (e2 = this.declaration) === null || e2 === void 0 || e2.bind();
  }
  hasEffects(e2) {
    var t;
    return !!((t = this.declaration) === null || t === void 0 ? void 0 : t.hasEffects(e2));
  }
  initialise() {
    this.context.addExport(this);
  }
  render(e2, t, i) {
    const { start: s, end: n2 } = i;
    this.declaration === null ? e2.remove(s, n2) : (e2.remove(this.start, this.declaration.start), this.declaration.render(e2, t, { end: n2, start: s }));
  }
  applyDeoptimizations() {
  }
}
Xi.prototype.needsBoundaries = true;
class Yi extends gi {
  constructor() {
    super(...arguments), this.hoistedDeclarations = [];
  }
  addDeclaration(e2, t, i, s) {
    return this.hoistedDeclarations.push(e2), super.addDeclaration(e2, t, i, s);
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
  hasEffects(e2) {
    var t;
    if (this.test.hasEffects(e2))
      return true;
    const i = this.getTestValue();
    if (typeof i == "symbol") {
      const { brokenFlow: t2 } = e2;
      if (this.consequent.hasEffects(e2))
        return true;
      const i2 = e2.brokenFlow;
      return e2.brokenFlow = t2, this.alternate === null ? false : !!this.alternate.hasEffects(e2) || (e2.brokenFlow = e2.brokenFlow < i2 ? e2.brokenFlow : i2, false);
    }
    return i ? this.consequent.hasEffects(e2) : !!((t = this.alternate) === null || t === void 0 ? void 0 : t.hasEffects(e2));
  }
  include(e2, t) {
    if (this.included = true, t)
      this.includeRecursively(t, e2);
    else {
      const t2 = this.getTestValue();
      typeof t2 == "symbol" ? this.includeUnknownTest(e2) : this.includeKnownTest(e2, t2);
    }
  }
  parseNode(e2) {
    this.consequentScope = new Yi(this.scope), this.consequent = new (this.context.getNodeConstructor(e2.consequent.type))(e2.consequent, this, this.consequentScope), e2.alternate && (this.alternateScope = new Yi(this.scope), this.alternate = new (this.context.getNodeConstructor(e2.alternate.type))(e2.alternate, this, this.alternateScope)), super.parseNode(e2);
  }
  render(e2, t) {
    const { snippets: { getPropertyAccess: i } } = t, s = this.getTestValue(), n2 = [], r2 = this.test.included, a2 = !this.context.options.treeshake;
    r2 ? this.test.render(e2, t) : e2.remove(this.start, this.consequent.start), this.consequent.included && (a2 || typeof s == "symbol" || s) ? this.consequent.render(e2, t) : (e2.overwrite(this.consequent.start, this.consequent.end, r2 ? ";" : ""), n2.push(...this.consequentScope.hoistedDeclarations)), this.alternate && (!this.alternate.included || !a2 && typeof s != "symbol" && s ? (r2 && this.shouldKeepAlternateBranch() ? e2.overwrite(this.alternate.start, this.end, ";") : e2.remove(this.consequent.end, this.end), n2.push(...this.alternateScope.hoistedDeclarations)) : (r2 ? e2.original.charCodeAt(this.alternate.start - 1) === 101 && e2.prependLeft(this.alternate.start, " ") : e2.remove(this.consequent.end, this.alternate.start), this.alternate.render(e2, t))), this.renderHoistedDeclarations(n2, e2, i);
  }
  applyDeoptimizations() {
  }
  getTestValue() {
    return this.testValue === Qi ? this.testValue = this.test.getLiteralValueAtPath(V, G, this) : this.testValue;
  }
  includeKnownTest(e2, t) {
    var i;
    this.test.shouldBeIncluded(e2) && this.test.include(e2, false), t && this.consequent.shouldBeIncluded(e2) && this.consequent.include(e2, false, { asSingleStatement: true }), !t && ((i = this.alternate) === null || i === void 0 ? void 0 : i.shouldBeIncluded(e2)) && this.alternate.include(e2, false, { asSingleStatement: true });
  }
  includeRecursively(e2, t) {
    var i;
    this.test.include(t, e2), this.consequent.include(t, e2), (i = this.alternate) === null || i === void 0 || i.include(t, e2);
  }
  includeUnknownTest(e2) {
    var t;
    this.test.include(e2, false);
    const { brokenFlow: i } = e2;
    let s = 0;
    this.consequent.shouldBeIncluded(e2) && (this.consequent.include(e2, false, { asSingleStatement: true }), s = e2.brokenFlow, e2.brokenFlow = i), ((t = this.alternate) === null || t === void 0 ? void 0 : t.shouldBeIncluded(e2)) && (this.alternate.include(e2, false, { asSingleStatement: true }), e2.brokenFlow = e2.brokenFlow < s ? e2.brokenFlow : s);
  }
  renderHoistedDeclarations(e2, t, i) {
    const s = [...new Set(e2.map((e3) => {
      const t2 = e3.variable;
      return t2.included ? t2.getName(i) : "";
    }))].filter(Boolean).join(", ");
    if (s) {
      const e3 = this.parent.type, i2 = e3 !== "Program" && e3 !== "BlockStatement";
      t.prependRight(this.start, `${i2 ? "{ " : ""}var ${s}; `), i2 && t.appendLeft(this.end, " }");
    }
  }
  shouldKeepAlternateBranch() {
    let e2 = this.parent;
    do {
      if (e2 instanceof Zi && e2.alternate)
        return true;
      if (e2 instanceof xi)
        return false;
      e2 = e2.parent;
    } while (e2);
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
  render(e2, t, i) {
    e2.remove(i.start, i.end);
  }
  applyDeoptimizations() {
  }
}
Ji.prototype.needsBoundaries = true;
const es = { auto: "_interopDefault", default: null, defaultOnly: null, esModule: null, false: null, true: "_interopDefaultLegacy" }, ts = (e2, t) => e2 === "esModule" || t && (e2 === "auto" || e2 === "true"), is = { auto: "_interopNamespace", default: "_interopNamespaceDefault", defaultOnly: "_interopNamespaceDefaultOnly", esModule: null, false: null, true: "_interopNamespace" }, ss = (e2, t) => ts(e2, t) && es[e2] === "_interopDefault", ns = (e2, t, i, s, n2, r2, a2) => {
  const o2 = new Set(e2);
  for (const e3 of ys)
    t.has(e3) && o2.add(e3);
  return ys.map((e3) => o2.has(e3) ? rs[e3](i, s, n2, r2, a2, o2) : "").join("");
}, rs = { _interopDefaultLegacy(e2, t, i) {
  const { _: s, getDirectReturnFunction: n2, n: r2 } = t, [a2, o2] = n2(["e"], { functionReturn: true, lineBreakIndent: null, name: "_interopDefaultLegacy" });
  return `${a2}e${s}&&${s}typeof e${s}===${s}'object'${s}&&${s}'default'${s}in e${s}?${s}${i ? as(t) : os(t)}${o2}${r2}${r2}`;
}, _interopDefault(e2, t, i) {
  const { _: s, getDirectReturnFunction: n2, n: r2 } = t, [a2, o2] = n2(["e"], { functionReturn: true, lineBreakIndent: null, name: "_interopDefault" });
  return `${a2}e${s}&&${s}e.__esModule${s}?${s}${i ? as(t) : os(t)}${o2}${r2}${r2}`;
}, _interopNamespaceDefaultOnly(e2, t, i, s, n2) {
  const { getDirectReturnFunction: r2, getObject: a2, n: o2 } = t, [l2, h2] = r2(["e"], { functionReturn: true, lineBreakIndent: null, name: "_interopNamespaceDefaultOnly" });
  return `${l2}${ms(s, gs(n2, a2([["__proto__", "null"], ["default", "e"]], { lineBreakIndent: null }), t))}${h2}${o2}${o2}`;
}, _interopNamespaceDefault(e2, t, i, s, n2) {
  const { _: r2, n: a2 } = t;
  return `function _interopNamespaceDefault(e)${r2}{${a2}` + ls(e2, e2, t, i, s, n2) + `}${a2}${a2}`;
}, _interopNamespace(e2, t, i, s, n2, r2) {
  const { _: a2, getDirectReturnFunction: o2, n: l2 } = t;
  if (r2.has("_interopNamespaceDefault")) {
    const [e3, t2] = o2(["e"], { functionReturn: true, lineBreakIndent: null, name: "_interopNamespace" });
    return `${e3}e${a2}&&${a2}e.__esModule${a2}?${a2}e${a2}:${a2}_interopNamespaceDefault(e)${t2}${l2}${l2}`;
  }
  return `function _interopNamespace(e)${a2}{${l2}${e2}if${a2}(e${a2}&&${a2}e.__esModule)${a2}return e;${l2}` + ls(e2, e2, t, i, s, n2) + `}${l2}${l2}`;
}, _mergeNamespaces(e2, t, i, s, n2) {
  const { _: r2, cnst: a2, n: o2 } = t, l2 = a2 === "var" && i;
  return `function _mergeNamespaces(n, m)${r2}{${o2}${e2}${cs(`{${o2}${e2}${e2}${e2}if${r2}(k${r2}!==${r2}'default'${r2}&&${r2}!(k in n))${r2}{${o2}` + (i ? l2 ? ds : ps : fs)(e2, e2 + e2 + e2 + e2, t) + `${e2}${e2}${e2}}${o2}${e2}${e2}}`, l2, e2, t)}${o2}${e2}return ${ms(s, gs(n2, "n", t))};${o2}}${o2}${o2}`;
} }, as = ({ _: e2, getObject: t }) => `e${e2}:${e2}${t([["default", "e"]], { lineBreakIndent: null })}`, os = ({ _: e2, getPropertyAccess: t }) => `e${t("default")}${e2}:${e2}e`, ls = (e2, t, i, s, n2, r2) => {
  const { _: a2, cnst: o2, getObject: l2, getPropertyAccess: h2, n: c2, s: u2 } = i, d2 = `{${c2}` + (s ? us : fs)(e2, t + e2 + e2, i) + `${t}${e2}}`;
  return `${t}${o2} n${a2}=${a2}Object.create(null${r2 ? `,${a2}{${a2}[Symbol.toStringTag]:${a2}${xs(l2)}${a2}}` : ""});${c2}${t}if${a2}(e)${a2}{${c2}${t}${e2}${hs(d2, !s, i)}${c2}${t}}${c2}${t}n${h2("default")}${a2}=${a2}e;${c2}${t}return ${ms(n2, "n")}${u2}${c2}`;
}, hs = (e2, t, { _: i, cnst: s, getFunctionIntro: n2, s: r2 }) => s !== "var" || t ? `for${i}(${s} k in e)${i}${e2}` : `Object.keys(e).forEach(${n2(["k"], { isAsync: false, name: null })}${e2})${r2}`, cs = (e2, t, i, { _: s, cnst: n2, getDirectReturnFunction: r2, getFunctionIntro: a2, n: o2 }) => {
  if (t) {
    const [t2, n3] = r2(["e"], { functionReturn: false, lineBreakIndent: { base: i, t: i }, name: null });
    return `m.forEach(${t2}e${s}&&${s}typeof e${s}!==${s}'string'${s}&&${s}!Array.isArray(e)${s}&&${s}Object.keys(e).forEach(${a2(["k"], { isAsync: false, name: null })}${e2})${n3});`;
  }
  return `for${s}(var i${s}=${s}0;${s}i${s}<${s}m.length;${s}i++)${s}{${o2}${i}${i}${n2} e${s}=${s}m[i];${o2}${i}${i}if${s}(typeof e${s}!==${s}'string'${s}&&${s}!Array.isArray(e))${s}{${s}for${s}(${n2} k in e)${s}${e2}${s}}${o2}${i}}`;
}, us = (e2, t, i) => {
  const { _: s, n: n2 } = i;
  return `${t}if${s}(k${s}!==${s}'default')${s}{${n2}` + ds(e2, t + e2, i) + `${t}}${n2}`;
}, ds = (e2, t, { _: i, cnst: s, getDirectReturnFunction: n2, n: r2 }) => {
  const [a2, o2] = n2([], { functionReturn: true, lineBreakIndent: null, name: null });
  return `${t}${s} d${i}=${i}Object.getOwnPropertyDescriptor(e,${i}k);${r2}${t}Object.defineProperty(n,${i}k,${i}d.get${i}?${i}d${i}:${i}{${r2}${t}${e2}enumerable:${i}true,${r2}${t}${e2}get:${i}${a2}e[k]${o2}${r2}${t}});${r2}`;
}, ps = (e2, t, { _: i, cnst: s, getDirectReturnFunction: n2, n: r2 }) => {
  const [a2, o2] = n2([], { functionReturn: true, lineBreakIndent: null, name: null });
  return `${t}${s} d${i}=${i}Object.getOwnPropertyDescriptor(e,${i}k);${r2}${t}if${i}(d)${i}{${r2}${t}${e2}Object.defineProperty(n,${i}k,${i}d.get${i}?${i}d${i}:${i}{${r2}${t}${e2}${e2}enumerable:${i}true,${r2}${t}${e2}${e2}get:${i}${a2}e[k]${o2}${r2}${t}${e2}});${r2}${t}}${r2}`;
}, fs = (e2, t, { _: i, n: s }) => `${t}n[k]${i}=${i}e[k];${s}`, ms = (e2, t) => e2 ? `Object.freeze(${t})` : t, gs = (e2, t, { _: i, getObject: s }) => e2 ? `Object.defineProperty(${t},${i}Symbol.toStringTag,${i}${xs(s)})` : t, ys = Object.keys(rs);
function xs(e2) {
  return e2([["value", "'Module'"]], { lineBreakIndent: null });
}
function Es(e2, t, i) {
  return t === "external" ? is[String(i(e2 instanceof $e ? e2.id : null))] : t === "default" ? "_interopNamespaceDefaultOnly" : null;
}
const bs = { amd: ["require"], cjs: ["require"], system: ["module"] };
const vs = "ROLLUP_ASSET_URL_", Ss = "ROLLUP_FILE_URL_";
const As = { amd: ["document", "module", "URL"], cjs: ["document", "require", "URL"], es: [], iife: ["document", "URL"], system: ["module"], umd: ["document", "require", "URL"] }, Is = { amd: ["document", "require", "URL"], cjs: ["document", "require", "URL"], es: [], iife: ["document", "URL"], system: ["module", "URL"], umd: ["document", "require", "URL"] }, ks = (e2, t = "URL") => `new ${t}(${e2}).href`, Ps = (e2, t = false) => ks(`'${e2}', ${t ? "typeof document === 'undefined' ? location.href : " : ""}document.currentScript && document.currentScript.src || document.baseURI`), ws = (e2) => (t, { chunkId: i }) => {
  const s = e2(i);
  return t === null ? `({ url: ${s} })` : t === "url" ? s : "undefined";
}, Cs = (e2, t = false) => `${t ? "typeof document === 'undefined' ? location.href : " : ""}(document.currentScript && document.currentScript.src || new URL('${e2}', document.baseURI).href)`, _s = { amd: (e2) => (e2[0] !== "." && (e2 = "./" + e2), ks(`require.toUrl('${e2}'), document.baseURI`)), cjs: (e2) => `(typeof document === 'undefined' ? ${ks(`'file:' + __dirname + '/${e2}'`, "(require('u' + 'rl').URL)")} : ${Ps(e2)})`, es: (e2) => ks(`'${e2}', import.meta.url`), iife: (e2) => Ps(e2), system: (e2) => ks(`'${e2}', module.meta.url`), umd: (e2) => `(typeof document === 'undefined' && typeof location === 'undefined' ? ${ks(`'file:' + __dirname + '/${e2}'`, "(require('u' + 'rl').URL)")} : ${Ps(e2, true)})` }, Ns = { amd: ws(() => ks("module.uri, document.baseURI")), cjs: ws((e2) => `(typeof document === 'undefined' ? ${ks("'file:' + __filename", "(require('u' + 'rl').URL)")} : ${Cs(e2)})`), iife: ws((e2) => Cs(e2)), system: (e2, { snippets: { getPropertyAccess: t } }) => e2 === null ? "module.meta" : `module.meta${t(e2)}`, umd: ws((e2) => `(typeof document === 'undefined' && typeof location === 'undefined' ? ${ks("'file:' + __filename", "(require('u' + 'rl').URL)")} : ${Cs(e2, true)})`) };
class $s extends ut {
  constructor() {
    super(...arguments), this.hasCachedEffect = false;
  }
  hasEffects(e2) {
    if (this.hasCachedEffect)
      return true;
    for (const t of this.body)
      if (t.hasEffects(e2))
        return this.hasCachedEffect = true;
    return false;
  }
  include(e2, t) {
    this.included = true;
    for (const i of this.body)
      (t || i.shouldBeIncluded(e2)) && i.include(e2, t);
  }
  render(e2, t) {
    this.body.length ? pi(this.body, e2, this.start, this.end, t) : super.render(e2, t);
  }
  applyDeoptimizations() {
  }
}
class Ts extends ut {
  hasEffects(e2) {
    var t;
    if ((t = this.test) === null || t === void 0 ? void 0 : t.hasEffects(e2))
      return true;
    for (const t2 of this.consequent) {
      if (e2.brokenFlow)
        break;
      if (t2.hasEffects(e2))
        return true;
    }
    return false;
  }
  include(e2, t) {
    var i;
    this.included = true, (i = this.test) === null || i === void 0 || i.include(e2, t);
    for (const i2 of this.consequent)
      (t || i2.shouldBeIncluded(e2)) && i2.include(e2, t);
  }
  render(e2, t, i) {
    if (this.consequent.length) {
      this.test && this.test.render(e2, t);
      const s = this.test ? this.test.end : hi(e2.original, "default", this.start) + 7, n2 = hi(e2.original, ":", s) + 1;
      pi(this.consequent, e2, n2, i.end, t);
    } else
      super.render(e2, t);
  }
}
Ts.prototype.needsBoundaries = true;
class Os extends ut {
  deoptimizeThisOnInteractionAtPath() {
  }
  getLiteralValueAtPath(e2) {
    return e2.length > 0 || this.quasis.length !== 1 ? W : this.quasis[0].value.cooked;
  }
  getReturnExpressionWhenCalledAtPath(e2) {
    return e2.length !== 1 ? X : Qe(Xe, e2[0]);
  }
  hasEffectsOnInteractionAtPath(e2, t, i) {
    return t.type === 0 ? e2.length > 1 : t.type !== 2 || e2.length !== 1 || Ye(Xe, e2[0], t, i);
  }
  render(e2, t) {
    e2.indentExclusionRanges.push([this.start, this.end]), super.render(e2, t);
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
  constructor(e2, t, i) {
    super(e2, t, t.declaration, i), this.hasId = false, this.originalId = null, this.originalVariable = null;
    const s = t.declaration;
    (s instanceof qi || s instanceof Gi) && s.id ? (this.hasId = true, this.originalId = s.id) : s instanceof ni && (this.originalId = s);
  }
  addReference(e2) {
    this.hasId || (this.name = e2.name);
  }
  getAssignedVariableName() {
    return this.originalId && this.originalId.name || null;
  }
  getBaseVariableName() {
    const e2 = this.getOriginalVariable();
    return e2 === this ? super.getBaseVariableName() : e2.getBaseVariableName();
  }
  getDirectOriginalVariable() {
    return !this.originalId || !this.hasId && (this.originalId.isPossibleTDZ() || this.originalId.variable.isReassigned || this.originalId.variable instanceof Rs || "syntheticNamespace" in this.originalId.variable) ? null : this.originalId.variable;
  }
  getName(e2) {
    const t = this.getOriginalVariable();
    return t === this ? super.getName(e2) : t.getName(e2);
  }
  getOriginalVariable() {
    if (this.originalVariable)
      return this.originalVariable;
    let e2, t = this;
    const i = /* @__PURE__ */ new Set();
    do {
      i.add(t), e2 = t, t = e2.getDirectOriginalVariable();
    } while (t instanceof Ms && !i.has(t));
    return this.originalVariable = t || e2;
  }
}
class Ds extends Ft {
  constructor(e2, t) {
    super(e2), this.context = t, this.variables.set("this", new Dt("this", null, Le, t));
  }
  addExportDefaultDeclaration(e2, t, i) {
    const s = new Ms(e2, t, i);
    return this.variables.set("default", s), s;
  }
  addNamespaceMemberAccess() {
  }
  deconflict(e2, t, i) {
    for (const s of this.children)
      s.deconflict(e2, t, i);
  }
  findLexicalBoundary() {
    return this;
  }
  findVariable(e2) {
    const t = this.variables.get(e2) || this.accessedOutsideVariables.get(e2);
    if (t)
      return t;
    const i = this.context.traceVariable(e2) || this.parent.findVariable(e2);
    return i instanceof ii && this.accessedOutsideVariables.set(e2, i), i;
  }
}
const Ls = { "!": (e2) => !e2, "+": (e2) => +e2, "-": (e2) => -e2, delete: () => W, typeof: (e2) => typeof e2, void: () => {
}, "~": (e2) => ~e2 };
function Vs(e2, t) {
  return e2.renderBaseName !== null && t.has(e2) && e2.isReassigned;
}
class Bs extends ut {
  deoptimizePath() {
    for (const e2 of this.declarations)
      e2.deoptimizePath(V);
  }
  hasEffectsOnInteractionAtPath() {
    return false;
  }
  include(e2, t, { asSingleStatement: i } = ie) {
    this.included = true;
    for (const s of this.declarations)
      (t || s.shouldBeIncluded(e2)) && s.include(e2, t), i && s.id.include(e2, t);
  }
  initialise() {
    for (const e2 of this.declarations)
      e2.declareDeclarator(this.kind);
  }
  render(e2, t, i = ie) {
    if (function(e3, t2) {
      for (const i2 of e3) {
        if (!i2.id.included)
          return false;
        if (i2.id.type === "Identifier") {
          if (t2.has(i2.id.variable))
            return false;
        } else {
          const e4 = [];
          if (i2.id.addExportedVariables(e4, t2), e4.length > 0)
            return false;
        }
      }
      return true;
    }(this.declarations, t.exportNamesByVariable)) {
      for (const i2 of this.declarations)
        i2.render(e2, t);
      i.isNoStatement || e2.original.charCodeAt(this.end - 1) === 59 || e2.appendLeft(this.end, ";");
    } else
      this.renderReplacedDeclarations(e2, t);
  }
  applyDeoptimizations() {
  }
  renderDeclarationEnd(e2, t, i, s, n2, r2, a2) {
    e2.original.charCodeAt(this.end - 1) === 59 && e2.remove(this.end - 1, this.end), t += ";", i !== null ? (e2.original.charCodeAt(s - 1) !== 10 || e2.original.charCodeAt(this.end) !== 10 && e2.original.charCodeAt(this.end) !== 13 || (s--, e2.original.charCodeAt(s) === 13 && s--), s === i + 1 ? e2.overwrite(i, n2, t) : (e2.overwrite(i, i + 1, t), e2.remove(s, n2))) : e2.appendLeft(n2, t), r2.length > 0 && e2.appendLeft(n2, ` ${Si(r2, a2)};`);
  }
  renderReplacedDeclarations(e2, t) {
    const i = fi(this.declarations, e2, this.start + this.kind.length, this.end - (e2.original.charCodeAt(this.end - 1) === 59 ? 1 : 0));
    let s, n2;
    n2 = ui(e2.original, this.start + this.kind.length);
    let r2 = n2 - 1;
    e2.remove(this.start, r2);
    let a2, l2 = false, h2 = false, c2 = "";
    const u2 = [], d2 = function(e3, t2, i2) {
      var s2;
      let n3 = null;
      if (t2.format === "system") {
        for (const { node: r3 } of e3)
          r3.id instanceof ni && r3.init && i2.length === 0 && ((s2 = t2.exportNamesByVariable.get(r3.id.variable)) === null || s2 === void 0 ? void 0 : s2.length) === 1 ? (n3 = r3.id.variable, i2.push(n3)) : r3.id.addExportedVariables(i2, t2.exportNamesByVariable);
        i2.length > 1 ? n3 = null : n3 && (i2.length = 0);
      }
      return n3;
    }(i, t, u2);
    for (const { node: u3, start: p2, separator: f3, contentEnd: m3, end: g2 } of i)
      if (u3.included) {
        if (u3.render(e2, t), a2 = "", !u3.id.included || u3.id instanceof ni && Vs(u3.id.variable, t.exportNamesByVariable))
          h2 && (c2 += ";"), l2 = false;
        else {
          if (d2 && d2 === u3.id.variable) {
            const i2 = hi(e2.original, "=", u3.id.end);
            Ai(d2, ui(e2.original, i2 + 1), f3 === null ? m3 : f3, e2, t);
          }
          l2 ? c2 += "," : (h2 && (c2 += ";"), a2 += `${this.kind} `, l2 = true);
        }
        n2 === r2 + 1 ? e2.overwrite(r2, n2, c2 + a2) : (e2.overwrite(r2, r2 + 1, c2), e2.appendLeft(n2, a2)), s = m3, n2 = g2, h2 = true, r2 = f3, c2 = "";
      } else
        e2.remove(p2, g2);
    this.renderDeclarationEnd(e2, c2, r2, s, n2, u2, t);
  }
}
const Fs = { ArrayExpression: class extends ut {
  constructor() {
    super(...arguments), this.objectEntity = null;
  }
  deoptimizePath(e2) {
    this.getObjectEntity().deoptimizePath(e2);
  }
  deoptimizeThisOnInteractionAtPath(e2, t, i) {
    this.getObjectEntity().deoptimizeThisOnInteractionAtPath(e2, t, i);
  }
  getLiteralValueAtPath(e2, t, i) {
    return this.getObjectEntity().getLiteralValueAtPath(e2, t, i);
  }
  getReturnExpressionWhenCalledAtPath(e2, t, i, s) {
    return this.getObjectEntity().getReturnExpressionWhenCalledAtPath(e2, t, i, s);
  }
  hasEffectsOnInteractionAtPath(e2, t, i) {
    return this.getObjectEntity().hasEffectsOnInteractionAtPath(e2, t, i);
  }
  applyDeoptimizations() {
    this.deoptimized = true;
    let e2 = false;
    for (let t = 0; t < this.elements.length; t++) {
      const i = this.elements[t];
      i && (e2 || i instanceof dt) && (e2 = true, i.deoptimizePath(B));
    }
    this.context.requestTreeshakingPass();
  }
  getObjectEntity() {
    if (this.objectEntity !== null)
      return this.objectEntity;
    const e2 = [{ key: "length", kind: "init", property: ze }];
    let t = false;
    for (let i = 0; i < this.elements.length; i++) {
      const s = this.elements[i];
      t || s instanceof dt ? s && (t = true, e2.unshift({ key: L, kind: "init", property: s })) : s ? e2.push({ key: String(i), kind: "init", property: s }) : e2.push({ key: String(i), kind: "init", property: Le });
    }
    return this.objectEntity = new Et(e2, Mt);
  }
}, ArrayPattern: class extends ut {
  addExportedVariables(e2, t) {
    for (const i of this.elements)
      i == null || i.addExportedVariables(e2, t);
  }
  declare(e2) {
    const t = [];
    for (const i of this.elements)
      i !== null && t.push(...i.declare(e2, X));
    return t;
  }
  deoptimizePath() {
    for (const e2 of this.elements)
      e2 == null || e2.deoptimizePath(V);
  }
  hasEffectsOnInteractionAtPath(e2, t, i) {
    for (const e3 of this.elements)
      if (e3 == null ? void 0 : e3.hasEffectsOnInteractionAtPath(V, t, i))
        return true;
    return false;
  }
  markDeclarationReached() {
    for (const e2 of this.elements)
      e2 == null || e2.markDeclarationReached();
  }
}, ArrowFunctionExpression: vi, AssignmentExpression: class extends ut {
  hasEffects(e2) {
    const { deoptimized: t, left: i, right: s } = this;
    return t || this.applyDeoptimizations(), s.hasEffects(e2) || i.hasEffectsAsAssignmentTarget(e2, this.operator !== "=");
  }
  hasEffectsOnInteractionAtPath(e2, t, i) {
    return this.right.hasEffectsOnInteractionAtPath(e2, t, i);
  }
  include(e2, t) {
    const { deoptimized: i, left: s, right: n2, operator: r2 } = this;
    i || this.applyDeoptimizations(), this.included = true, (t || r2 !== "=" || s.included || s.hasEffectsAsAssignmentTarget(Me(), false)) && s.includeAsAssignmentTarget(e2, t, r2 !== "="), n2.include(e2, t);
  }
  initialise() {
    this.left.setAssignedValue(this.right);
  }
  render(e2, t, { preventASI: i, renderedParentType: s, renderedSurroundingElement: n2 } = ie) {
    const { left: r2, right: a2, start: o2, end: l2, parent: h2 } = this;
    if (r2.included)
      r2.render(e2, t), a2.render(e2, t);
    else {
      const l3 = ui(e2.original, hi(e2.original, "=", r2.end) + 1);
      e2.remove(o2, l3), i && mi(e2, l3, a2.start), a2.render(e2, t, { renderedParentType: s || h2.type, renderedSurroundingElement: n2 || h2.type });
    }
    if (t.format === "system")
      if (r2 instanceof ni) {
        const i2 = r2.variable, s2 = t.exportNamesByVariable.get(i2);
        if (s2)
          return void (s2.length === 1 ? Ai(i2, o2, l2, e2, t) : Ii(i2, o2, l2, h2.type !== "ExpressionStatement", e2, t));
      } else {
        const i2 = [];
        if (r2.addExportedVariables(i2, t.exportNamesByVariable), i2.length > 0)
          return void function(e3, t2, i3, s2, n3, r3) {
            const { _: a3, getDirectReturnIifeLeft: o3 } = r3.snippets;
            n3.prependRight(t2, o3(["v"], `${Si(e3, r3)},${a3}v`, { needsArrowReturnParens: true, needsWrappedFunction: s2 })), n3.appendLeft(i3, ")");
          }(i2, o2, l2, n2 === "ExpressionStatement", e2, t);
      }
    r2.included && r2 instanceof ki && (n2 === "ExpressionStatement" || n2 === "ArrowFunctionExpression") && (e2.appendRight(o2, "("), e2.prependLeft(l2, ")"));
  }
  applyDeoptimizations() {
    this.deoptimized = true, this.left.deoptimizePath(V), this.right.deoptimizePath(B), this.context.requestTreeshakingPass();
  }
}, AssignmentPattern: class extends ut {
  addExportedVariables(e2, t) {
    this.left.addExportedVariables(e2, t);
  }
  declare(e2, t) {
    return this.left.declare(e2, t);
  }
  deoptimizePath(e2) {
    e2.length === 0 && this.left.deoptimizePath(e2);
  }
  hasEffectsOnInteractionAtPath(e2, t, i) {
    return e2.length > 0 || this.left.hasEffectsOnInteractionAtPath(V, t, i);
  }
  markDeclarationReached() {
    this.left.markDeclarationReached();
  }
  render(e2, t, { isShorthandProperty: i } = ie) {
    this.left.render(e2, t, { isShorthandProperty: i }), this.right.render(e2, t);
  }
  applyDeoptimizations() {
    this.deoptimized = true, this.left.deoptimizePath(V), this.right.deoptimizePath(B), this.context.requestTreeshakingPass();
  }
}, AwaitExpression: class extends ut {
  hasEffects() {
    return this.deoptimized || this.applyDeoptimizations(), true;
  }
  include(e2, t) {
    if (this.deoptimized || this.applyDeoptimizations(), !this.included) {
      this.included = true;
      e:
        if (!this.context.usesTopLevelAwait) {
          let e3 = this.parent;
          do {
            if (e3 instanceof _i || e3 instanceof vi)
              break e;
          } while (e3 = e3.parent);
          this.context.usesTopLevelAwait = true;
        }
    }
    this.argument.include(e2, t);
  }
}, BinaryExpression: class extends ut {
  deoptimizeCache() {
  }
  getLiteralValueAtPath(e2, t, i) {
    if (e2.length > 0)
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
  hasEffects(e2) {
    return this.operator === "+" && this.parent instanceof yi && this.left.getLiteralValueAtPath(V, G, this) === "" || super.hasEffects(e2);
  }
  hasEffectsOnInteractionAtPath(e2, { type: t }) {
    return t !== 0 || e2.length > 1;
  }
  render(e2, t, { renderedSurroundingElement: i } = ie) {
    this.left.render(e2, t, { renderedSurroundingElement: i }), this.right.render(e2, t);
  }
}, BlockStatement: xi, BreakStatement: class extends ut {
  hasEffects(e2) {
    if (this.label) {
      if (!e2.ignore.labels.has(this.label.name))
        return true;
      e2.includedLabels.add(this.label.name), e2.brokenFlow = 2;
    } else {
      if (!e2.ignore.breaks)
        return true;
      e2.brokenFlow = 1;
    }
    return false;
  }
  include(e2) {
    this.included = true, this.label && (this.label.include(), e2.includedLabels.add(this.label.name)), e2.brokenFlow = this.label ? 2 : 1;
  }
}, CallExpression: class extends Li {
  bind() {
    if (super.bind(), this.callee instanceof ni) {
      this.scope.findVariable(this.callee.name).isNamespace && this.context.warn({ code: "CANNOT_CALL_NAMESPACE", message: `Cannot call a namespace ('${this.callee.name}')` }, this.start), this.callee.name === "eval" && this.context.warn({ code: "EVAL", message: "Use of eval is strongly discouraged, as it poses security risks and may cause issues with minification", url: "https://rollupjs.org/guide/en/#avoiding-eval" }, this.start);
    }
    this.interaction = { args: this.arguments, thisArg: this.callee instanceof Mi && !this.callee.variable ? this.callee.object : null, type: 2, withNew: false };
  }
  hasEffects(e2) {
    try {
      for (const t of this.arguments)
        if (t.hasEffects(e2))
          return true;
      return (!this.context.options.treeshake.annotations || !this.annotations) && (this.callee.hasEffects(e2) || this.callee.hasEffectsOnInteractionAtPath(V, this.interaction, e2));
    } finally {
      this.deoptimized || this.applyDeoptimizations();
    }
  }
  include(e2, t) {
    this.deoptimized || this.applyDeoptimizations(), t ? (super.include(e2, t), t === "variables" && this.callee instanceof ni && this.callee.variable && this.callee.variable.markCalledFromTryStatement()) : (this.included = true, this.callee.include(e2, false)), this.callee.includeCallArguments(e2, this.arguments);
    const i = this.getReturnExpression();
    i.included || i.include(e2, false);
  }
  render(e2, t, { renderedSurroundingElement: i } = ie) {
    this.callee.render(e2, t, { isCalleeOfRenderedParent: true, renderedSurroundingElement: i }), $i(e2, t, this);
  }
  applyDeoptimizations() {
    this.deoptimized = true, this.interaction.thisArg && this.callee.deoptimizeThisOnInteractionAtPath(this.interaction, V, G);
    for (const e2 of this.arguments)
      e2.deoptimizePath(B);
    this.context.requestTreeshakingPass();
  }
  getReturnExpression(e2 = G) {
    return this.returnExpression === null ? (this.returnExpression = X, this.returnExpression = this.callee.getReturnExpressionWhenCalledAtPath(V, this.interaction, e2, this)) : this.returnExpression;
  }
}, CatchClause: class extends ut {
  createScope(e2) {
    this.scope = new Vi(e2, this.context);
  }
  parseNode(e2) {
    const { param: t } = e2;
    t && (this.param = new (this.context.getNodeConstructor(t.type))(t, this, this.scope), this.param.declare("parameter", X)), super.parseNode(e2);
  }
}, ChainExpression: class extends ut {
}, ClassBody: class extends ut {
  createScope(e2) {
    this.scope = new Bi(e2, this.parent, this.context);
  }
  include(e2, t) {
    this.included = true, this.context.includeVariableInModule(this.scope.thisVariable);
    for (const i of this.body)
      i.include(e2, t);
  }
  parseNode(e2) {
    const t = this.body = [];
    for (const i of e2.body)
      t.push(new (this.context.getNodeConstructor(i.type))(i, this, i.static ? this.scope : this.scope.instanceScope));
    super.parseNode(e2);
  }
  applyDeoptimizations() {
  }
}, ClassDeclaration: Gi, ClassExpression: class extends Ui {
  render(e2, t, { renderedSurroundingElement: i } = ie) {
    super.render(e2, t), i === "ExpressionStatement" && (e2.appendRight(this.start, "("), e2.prependLeft(this.end, ")"));
  }
}, ConditionalExpression: class extends ut {
  constructor() {
    super(...arguments), this.expressionsToBeDeoptimized = [], this.isBranchResolutionAnalysed = false, this.usedBranch = null;
  }
  deoptimizeCache() {
    if (this.usedBranch !== null) {
      const e2 = this.usedBranch === this.consequent ? this.alternate : this.consequent;
      this.usedBranch = null, e2.deoptimizePath(B);
      for (const e3 of this.expressionsToBeDeoptimized)
        e3.deoptimizeCache();
    }
  }
  deoptimizePath(e2) {
    const t = this.getUsedBranch();
    t ? t.deoptimizePath(e2) : (this.consequent.deoptimizePath(e2), this.alternate.deoptimizePath(e2));
  }
  deoptimizeThisOnInteractionAtPath(e2, t, i) {
    this.consequent.deoptimizeThisOnInteractionAtPath(e2, t, i), this.alternate.deoptimizeThisOnInteractionAtPath(e2, t, i);
  }
  getLiteralValueAtPath(e2, t, i) {
    const s = this.getUsedBranch();
    return s ? (this.expressionsToBeDeoptimized.push(i), s.getLiteralValueAtPath(e2, t, i)) : W;
  }
  getReturnExpressionWhenCalledAtPath(e2, t, i, s) {
    const n2 = this.getUsedBranch();
    return n2 ? (this.expressionsToBeDeoptimized.push(s), n2.getReturnExpressionWhenCalledAtPath(e2, t, i, s)) : new Hi([this.consequent.getReturnExpressionWhenCalledAtPath(e2, t, i, s), this.alternate.getReturnExpressionWhenCalledAtPath(e2, t, i, s)]);
  }
  hasEffects(e2) {
    if (this.test.hasEffects(e2))
      return true;
    const t = this.getUsedBranch();
    return t ? t.hasEffects(e2) : this.consequent.hasEffects(e2) || this.alternate.hasEffects(e2);
  }
  hasEffectsOnInteractionAtPath(e2, t, i) {
    const s = this.getUsedBranch();
    return s ? s.hasEffectsOnInteractionAtPath(e2, t, i) : this.consequent.hasEffectsOnInteractionAtPath(e2, t, i) || this.alternate.hasEffectsOnInteractionAtPath(e2, t, i);
  }
  include(e2, t) {
    this.included = true;
    const i = this.getUsedBranch();
    t || this.test.shouldBeIncluded(e2) || i === null ? (this.test.include(e2, t), this.consequent.include(e2, t), this.alternate.include(e2, t)) : i.include(e2, t);
  }
  includeCallArguments(e2, t) {
    const i = this.getUsedBranch();
    i ? i.includeCallArguments(e2, t) : (this.consequent.includeCallArguments(e2, t), this.alternate.includeCallArguments(e2, t));
  }
  render(e2, t, { isCalleeOfRenderedParent: i, preventASI: s, renderedParentType: n2, renderedSurroundingElement: r2 } = ie) {
    const a2 = this.getUsedBranch();
    if (this.test.included)
      this.test.render(e2, t, { renderedSurroundingElement: r2 }), this.consequent.render(e2, t), this.alternate.render(e2, t);
    else {
      const o2 = hi(e2.original, ":", this.consequent.end), l2 = ui(e2.original, (this.consequent.included ? hi(e2.original, "?", this.test.end) : o2) + 1);
      s && mi(e2, l2, a2.start), e2.remove(this.start, l2), this.consequent.included && e2.remove(o2, this.end), oi(this, e2), a2.render(e2, t, { isCalleeOfRenderedParent: i, preventASI: true, renderedParentType: n2 || this.parent.type, renderedSurroundingElement: r2 || this.parent.type });
    }
  }
  getUsedBranch() {
    if (this.isBranchResolutionAnalysed)
      return this.usedBranch;
    this.isBranchResolutionAnalysed = true;
    const e2 = this.test.getLiteralValueAtPath(V, G, this);
    return typeof e2 == "symbol" ? null : this.usedBranch = e2 ? this.consequent : this.alternate;
  }
}, ContinueStatement: class extends ut {
  hasEffects(e2) {
    if (this.label) {
      if (!e2.ignore.labels.has(this.label.name))
        return true;
      e2.includedLabels.add(this.label.name), e2.brokenFlow = 2;
    } else {
      if (!e2.ignore.continues)
        return true;
      e2.brokenFlow = 1;
    }
    return false;
  }
  include(e2) {
    this.included = true, this.label && (this.label.include(), e2.includedLabels.add(this.label.name)), e2.brokenFlow = this.label ? 2 : 1;
  }
}, DoWhileStatement: class extends ut {
  hasEffects(e2) {
    if (this.test.hasEffects(e2))
      return true;
    const { brokenFlow: t, ignore: { breaks: i, continues: s } } = e2;
    return e2.ignore.breaks = true, e2.ignore.continues = true, !!this.body.hasEffects(e2) || (e2.ignore.breaks = i, e2.ignore.continues = s, e2.brokenFlow = t, false);
  }
  include(e2, t) {
    this.included = true, this.test.include(e2, t);
    const { brokenFlow: i } = e2;
    this.body.include(e2, t, { asSingleStatement: true }), e2.brokenFlow = i;
  }
}, EmptyStatement: class extends ut {
  hasEffects() {
    return false;
  }
}, ExportAllDeclaration: Wi, ExportDefaultDeclaration: Ki, ExportNamedDeclaration: Xi, ExportSpecifier: class extends ut {
  applyDeoptimizations() {
  }
}, ExpressionStatement: yi, ForInStatement: class extends ut {
  createScope(e2) {
    this.scope = new gi(e2);
  }
  hasEffects(e2) {
    const { deoptimized: t, left: i, right: s } = this;
    if (t || this.applyDeoptimizations(), i.hasEffectsAsAssignmentTarget(e2, false) || s.hasEffects(e2))
      return true;
    const { brokenFlow: n2, ignore: { breaks: r2, continues: a2 } } = e2;
    return e2.ignore.breaks = true, e2.ignore.continues = true, !!this.body.hasEffects(e2) || (e2.ignore.breaks = r2, e2.ignore.continues = a2, e2.brokenFlow = n2, false);
  }
  include(e2, t) {
    const { body: i, deoptimized: s, left: n2, right: r2 } = this;
    s || this.applyDeoptimizations(), this.included = true, n2.includeAsAssignmentTarget(e2, t || true, false), r2.include(e2, t);
    const { brokenFlow: a2 } = e2;
    i.include(e2, t, { asSingleStatement: true }), e2.brokenFlow = a2;
  }
  initialise() {
    this.left.setAssignedValue(X);
  }
  render(e2, t) {
    this.left.render(e2, t, li), this.right.render(e2, t, li), e2.original.charCodeAt(this.right.start - 1) === 110 && e2.prependLeft(this.right.start, " "), this.body.render(e2, t);
  }
  applyDeoptimizations() {
    this.deoptimized = true, this.left.deoptimizePath(V), this.context.requestTreeshakingPass();
  }
}, ForOfStatement: class extends ut {
  createScope(e2) {
    this.scope = new gi(e2);
  }
  hasEffects() {
    return this.deoptimized || this.applyDeoptimizations(), true;
  }
  include(e2, t) {
    const { body: i, deoptimized: s, left: n2, right: r2 } = this;
    s || this.applyDeoptimizations(), this.included = true, n2.includeAsAssignmentTarget(e2, t || true, false), r2.include(e2, t);
    const { brokenFlow: a2 } = e2;
    i.include(e2, t, { asSingleStatement: true }), e2.brokenFlow = a2;
  }
  initialise() {
    this.left.setAssignedValue(X);
  }
  render(e2, t) {
    this.left.render(e2, t, li), this.right.render(e2, t, li), e2.original.charCodeAt(this.right.start - 1) === 102 && e2.prependLeft(this.right.start, " "), this.body.render(e2, t);
  }
  applyDeoptimizations() {
    this.deoptimized = true, this.left.deoptimizePath(V), this.context.requestTreeshakingPass();
  }
}, ForStatement: class extends ut {
  createScope(e2) {
    this.scope = new gi(e2);
  }
  hasEffects(e2) {
    var t, i, s;
    if (((t = this.init) === null || t === void 0 ? void 0 : t.hasEffects(e2)) || ((i = this.test) === null || i === void 0 ? void 0 : i.hasEffects(e2)) || ((s = this.update) === null || s === void 0 ? void 0 : s.hasEffects(e2)))
      return true;
    const { brokenFlow: n2, ignore: { breaks: r2, continues: a2 } } = e2;
    return e2.ignore.breaks = true, e2.ignore.continues = true, !!this.body.hasEffects(e2) || (e2.ignore.breaks = r2, e2.ignore.continues = a2, e2.brokenFlow = n2, false);
  }
  include(e2, t) {
    var i, s, n2;
    this.included = true, (i = this.init) === null || i === void 0 || i.include(e2, t, { asSingleStatement: true }), (s = this.test) === null || s === void 0 || s.include(e2, t);
    const { brokenFlow: r2 } = e2;
    (n2 = this.update) === null || n2 === void 0 || n2.include(e2, t), this.body.include(e2, t, { asSingleStatement: true }), e2.brokenFlow = r2;
  }
  render(e2, t) {
    var i, s, n2;
    (i = this.init) === null || i === void 0 || i.render(e2, t, li), (s = this.test) === null || s === void 0 || s.render(e2, t, li), (n2 = this.update) === null || n2 === void 0 || n2.render(e2, t, li), this.body.render(e2, t);
  }
}, FunctionDeclaration: qi, FunctionExpression: class extends _i {
  render(e2, t, { renderedSurroundingElement: i } = ie) {
    super.render(e2, t), i === "ExpressionStatement" && (e2.appendRight(this.start, "("), e2.prependLeft(this.end, ")"));
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
  include(e2, t) {
    this.included || (this.included = true, this.context.includeDynamicImport(this), this.scope.addAccessedDynamicImport(this)), this.source.include(e2, t);
  }
  initialise() {
    this.context.addDynamicImport(this);
  }
  render(e2, t) {
    if (this.inlineNamespace) {
      const { snippets: { getDirectReturnFunction: i, getPropertyAccess: s } } = t, [n2, r2] = i([], { functionReturn: true, lineBreakIndent: null, name: null });
      e2.overwrite(this.start, this.end, `Promise.resolve().then(${n2}${this.inlineNamespace.getName(s)}${r2})`, { contentOnly: true });
    } else
      this.mechanism && (e2.overwrite(this.start, hi(e2.original, "(", this.start + 6) + 1, this.mechanism.left, { contentOnly: true }), e2.overwrite(this.end - 1, this.end, this.mechanism.right, { contentOnly: true })), this.source.render(e2, t);
  }
  renderFinalResolution(e2, t, i, { getDirectReturnFunction: s }) {
    if (e2.overwrite(this.source.start, this.source.end, t), i) {
      const [t2, n2] = s(["n"], { functionReturn: true, lineBreakIndent: null, name: null });
      e2.prependLeft(this.end, `.then(${t2}n.${i}${n2})`);
    }
  }
  setExternalResolution(e2, t, i, s, n2, r2) {
    const { format: a2 } = i;
    this.resolution = t;
    const o2 = [...bs[a2] || []];
    let l2;
    ({ helper: l2, mechanism: this.mechanism } = this.getDynamicImportMechanismAndHelper(t, e2, i, s, n2)), l2 && o2.push(l2), o2.length > 0 && this.scope.addAccessedGlobals(o2, r2);
  }
  setInternalResolution(e2) {
    this.inlineNamespace = e2;
  }
  applyDeoptimizations() {
  }
  getDynamicImportMechanismAndHelper(e2, t, { compact: i, dynamicImportFunction: s, format: n2, generatedCode: { arrowFunctions: r2 }, interop: a2 }, { _: o2, getDirectReturnFunction: l2, getDirectReturnIifeLeft: h2 }, c2) {
    const u2 = c2.hookFirstSync("renderDynamicImport", [{ customResolution: typeof this.resolution == "string" ? this.resolution : null, format: n2, moduleId: this.context.module.id, targetModuleId: this.resolution && typeof this.resolution != "string" ? this.resolution.id : null }]);
    if (u2)
      return { helper: null, mechanism: u2 };
    const d2 = !this.resolution || typeof this.resolution == "string";
    switch (n2) {
      case "cjs": {
        const i2 = Es(e2, t, a2);
        let s2 = "require(", n3 = ")";
        i2 && (s2 = `/*#__PURE__*/${i2}(${s2}`, n3 += ")");
        const [o3, c3] = l2([], { functionReturn: true, lineBreakIndent: null, name: null });
        return s2 = `Promise.resolve().then(${o3}${s2}`, n3 += `${c3})`, !r2 && d2 && (s2 = h2(["t"], `${s2}t${n3}`, { needsArrowReturnParens: false, needsWrappedFunction: true }), n3 = ")"), { helper: i2, mechanism: { left: s2, right: n3 } };
      }
      case "amd": {
        const s2 = i ? "c" : "resolve", n3 = i ? "e" : "reject", c3 = Es(e2, t, a2), [u3, p2] = l2(["m"], { functionReturn: false, lineBreakIndent: null, name: null }), f3 = c3 ? `${u3}${s2}(/*#__PURE__*/${c3}(m))${p2}` : s2, [m3, g2] = l2([s2, n3], { functionReturn: false, lineBreakIndent: null, name: null });
        let y2 = `new Promise(${m3}require([`, x2 = `],${o2}${f3},${o2}${n3})${g2})`;
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
  hasEffects(e2) {
    const t = e2.brokenFlow;
    return e2.ignore.labels.add(this.label.name), !!this.body.hasEffects(e2) || (e2.ignore.labels.delete(this.label.name), e2.includedLabels.has(this.label.name) && (e2.includedLabels.delete(this.label.name), e2.brokenFlow = t), false);
  }
  include(e2, t) {
    this.included = true;
    const i = e2.brokenFlow;
    this.body.include(e2, t), (t || e2.includedLabels.has(this.label.name)) && (this.label.include(), e2.includedLabels.delete(this.label.name), e2.brokenFlow = i);
  }
  render(e2, t) {
    this.label.included ? this.label.render(e2, t) : e2.remove(this.start, ui(e2.original, hi(e2.original, ":", this.label.end) + 1)), this.body.render(e2, t);
  }
}, Literal: Ti, LogicalExpression: class extends ut {
  constructor() {
    super(...arguments), this.expressionsToBeDeoptimized = [], this.isBranchResolutionAnalysed = false, this.usedBranch = null;
  }
  deoptimizeCache() {
    if (this.usedBranch) {
      const e2 = this.usedBranch === this.left ? this.right : this.left;
      this.usedBranch = null, e2.deoptimizePath(B);
      for (const e3 of this.expressionsToBeDeoptimized)
        e3.deoptimizeCache();
      this.context.requestTreeshakingPass();
    }
  }
  deoptimizePath(e2) {
    const t = this.getUsedBranch();
    t ? t.deoptimizePath(e2) : (this.left.deoptimizePath(e2), this.right.deoptimizePath(e2));
  }
  deoptimizeThisOnInteractionAtPath(e2, t, i) {
    this.left.deoptimizeThisOnInteractionAtPath(e2, t, i), this.right.deoptimizeThisOnInteractionAtPath(e2, t, i);
  }
  getLiteralValueAtPath(e2, t, i) {
    const s = this.getUsedBranch();
    return s ? (this.expressionsToBeDeoptimized.push(i), s.getLiteralValueAtPath(e2, t, i)) : W;
  }
  getReturnExpressionWhenCalledAtPath(e2, t, i, s) {
    const n2 = this.getUsedBranch();
    return n2 ? (this.expressionsToBeDeoptimized.push(s), n2.getReturnExpressionWhenCalledAtPath(e2, t, i, s)) : new Hi([this.left.getReturnExpressionWhenCalledAtPath(e2, t, i, s), this.right.getReturnExpressionWhenCalledAtPath(e2, t, i, s)]);
  }
  hasEffects(e2) {
    return !!this.left.hasEffects(e2) || this.getUsedBranch() !== this.left && this.right.hasEffects(e2);
  }
  hasEffectsOnInteractionAtPath(e2, t, i) {
    const s = this.getUsedBranch();
    return s ? s.hasEffectsOnInteractionAtPath(e2, t, i) : this.left.hasEffectsOnInteractionAtPath(e2, t, i) || this.right.hasEffectsOnInteractionAtPath(e2, t, i);
  }
  include(e2, t) {
    this.included = true;
    const i = this.getUsedBranch();
    t || i === this.right && this.left.shouldBeIncluded(e2) || !i ? (this.left.include(e2, t), this.right.include(e2, t)) : i.include(e2, t);
  }
  render(e2, t, { isCalleeOfRenderedParent: i, preventASI: s, renderedParentType: n2, renderedSurroundingElement: r2 } = ie) {
    if (this.left.included && this.right.included)
      this.left.render(e2, t, { preventASI: s, renderedSurroundingElement: r2 }), this.right.render(e2, t);
    else {
      const a2 = hi(e2.original, this.operator, this.left.end);
      if (this.right.included) {
        const t2 = ui(e2.original, a2 + 2);
        e2.remove(this.start, t2), s && mi(e2, t2, this.right.start);
      } else
        e2.remove(a2, this.end);
      oi(this, e2), this.getUsedBranch().render(e2, t, { isCalleeOfRenderedParent: i, preventASI: s, renderedParentType: n2 || this.parent.type, renderedSurroundingElement: r2 || this.parent.type });
    }
  }
  getUsedBranch() {
    if (!this.isBranchResolutionAnalysed) {
      this.isBranchResolutionAnalysed = true;
      const e2 = this.left.getLiteralValueAtPath(V, G, this);
      if (typeof e2 == "symbol")
        return null;
      this.usedBranch = this.operator === "||" && e2 || this.operator === "&&" && !e2 || this.operator === "??" && e2 != null ? this.left : this.right;
    }
    return this.usedBranch;
  }
}, MemberExpression: Mi, MetaProperty: class extends ut {
  addAccessedGlobals(e2, t) {
    const i = this.metaProperty, s = (i && (i.startsWith(Ss) || i.startsWith(vs) || i.startsWith("ROLLUP_CHUNK_URL_")) ? Is : As)[e2];
    s.length > 0 && this.scope.addAccessedGlobals(s, t);
  }
  getReferencedFileName(e2) {
    const t = this.metaProperty;
    return t && t.startsWith(Ss) ? e2.getFileName(t.substring(Ss.length)) : null;
  }
  hasEffects() {
    return false;
  }
  hasEffectsOnInteractionAtPath(e2, { type: t }) {
    return e2.length > 1 || t !== 0;
  }
  include() {
    if (!this.included && (this.included = true, this.meta.name === "import")) {
      this.context.addImportMeta(this);
      const e2 = this.parent;
      this.metaProperty = e2 instanceof Mi && typeof e2.propertyKey == "string" ? e2.propertyKey : null;
    }
  }
  renderFinalMechanism(e2, t, i, s, n2) {
    var r2;
    const a2 = this.parent, o2 = this.metaProperty;
    if (o2 && (o2.startsWith(Ss) || o2.startsWith(vs) || o2.startsWith("ROLLUP_CHUNK_URL_"))) {
      let s2, r3 = null, l3 = null, h2 = null;
      o2.startsWith(Ss) ? (r3 = o2.substring(Ss.length), s2 = n2.getFileName(r3)) : o2.startsWith(vs) ? (ke(`Using the "${vs}" prefix to reference files is deprecated. Use the "${Ss}" prefix instead.`, true, this.context.options), l3 = o2.substring(vs.length), s2 = n2.getFileName(l3)) : (ke(`Using the "ROLLUP_CHUNK_URL_" prefix to reference files is deprecated. Use the "${Ss}" prefix instead.`, true, this.context.options), h2 = o2.substring("ROLLUP_CHUNK_URL_".length), s2 = n2.getFileName(h2));
      const c2 = C(T(N(t), s2));
      let u2;
      return l3 !== null && (u2 = n2.hookFirstSync("resolveAssetUrl", [{ assetFileName: s2, chunkId: t, format: i, moduleId: this.context.module.id, relativeAssetPath: c2 }])), u2 || (u2 = n2.hookFirstSync("resolveFileUrl", [{ assetReferenceId: l3, chunkId: t, chunkReferenceId: h2, fileName: s2, format: i, moduleId: this.context.module.id, referenceId: r3 || l3 || h2, relativePath: c2 }]) || _s[i](c2)), void e2.overwrite(a2.start, a2.end, u2, { contentOnly: true });
    }
    const l2 = n2.hookFirstSync("resolveImportMeta", [o2, { chunkId: t, format: i, moduleId: this.context.module.id }]) || ((r2 = Ns[i]) === null || r2 === void 0 ? void 0 : r2.call(Ns, o2, { chunkId: t, snippets: s }));
    typeof l2 == "string" && (a2 instanceof Mi ? e2.overwrite(a2.start, a2.end, l2, { contentOnly: true }) : e2.overwrite(this.start, this.end, l2, { contentOnly: true }));
  }
}, MethodDefinition: zi, NewExpression: class extends ut {
  hasEffects(e2) {
    try {
      for (const t of this.arguments)
        if (t.hasEffects(e2))
          return true;
      return (!this.context.options.treeshake.annotations || !this.annotations) && (this.callee.hasEffects(e2) || this.callee.hasEffectsOnInteractionAtPath(V, this.interaction, e2));
    } finally {
      this.deoptimized || this.applyDeoptimizations();
    }
  }
  hasEffectsOnInteractionAtPath(e2, { type: t }) {
    return e2.length > 0 || t !== 0;
  }
  include(e2, t) {
    this.deoptimized || this.applyDeoptimizations(), t ? super.include(e2, t) : (this.included = true, this.callee.include(e2, false)), this.callee.includeCallArguments(e2, this.arguments);
  }
  initialise() {
    this.interaction = { args: this.arguments, thisArg: null, type: 2, withNew: true };
  }
  render(e2, t) {
    this.callee.render(e2, t), $i(e2, t, this);
  }
  applyDeoptimizations() {
    this.deoptimized = true;
    for (const e2 of this.arguments)
      e2.deoptimizePath(B);
    this.context.requestTreeshakingPass();
  }
}, ObjectExpression: class extends ut {
  constructor() {
    super(...arguments), this.objectEntity = null;
  }
  deoptimizeCache() {
    this.getObjectEntity().deoptimizeAllProperties();
  }
  deoptimizePath(e2) {
    this.getObjectEntity().deoptimizePath(e2);
  }
  deoptimizeThisOnInteractionAtPath(e2, t, i) {
    this.getObjectEntity().deoptimizeThisOnInteractionAtPath(e2, t, i);
  }
  getLiteralValueAtPath(e2, t, i) {
    return this.getObjectEntity().getLiteralValueAtPath(e2, t, i);
  }
  getReturnExpressionWhenCalledAtPath(e2, t, i, s) {
    return this.getObjectEntity().getReturnExpressionWhenCalledAtPath(e2, t, i, s);
  }
  hasEffectsOnInteractionAtPath(e2, t, i) {
    return this.getObjectEntity().hasEffectsOnInteractionAtPath(e2, t, i);
  }
  render(e2, t, { renderedSurroundingElement: i } = ie) {
    super.render(e2, t), i !== "ExpressionStatement" && i !== "ArrowFunctionExpression" || (e2.appendRight(this.start, "("), e2.prependLeft(this.end, ")"));
  }
  applyDeoptimizations() {
  }
  getObjectEntity() {
    if (this.objectEntity !== null)
      return this.objectEntity;
    let e2 = St;
    const t = [];
    for (const i of this.properties) {
      if (i instanceof dt) {
        t.push({ key: M, kind: "init", property: i });
        continue;
      }
      let s;
      if (i.computed) {
        const e3 = i.key.getLiteralValueAtPath(V, G, this);
        if (typeof e3 == "symbol") {
          t.push({ key: M, kind: i.kind, property: i });
          continue;
        }
        s = String(e3);
      } else if (s = i.key instanceof ni ? i.key.name : String(i.key.value), s === "__proto__" && i.kind === "init") {
        e2 = i.value instanceof Ti && i.value.value === null ? null : i.value;
        continue;
      }
      t.push({ key: s, kind: i.kind, property: i });
    }
    return this.objectEntity = new Et(t, e2);
  }
}, ObjectPattern: ki, PrivateIdentifier: class extends ut {
}, Program: $s, Property: class extends Fi {
  constructor() {
    super(...arguments), this.declarationInit = null;
  }
  declare(e2, t) {
    return this.declarationInit = t, this.value.declare(e2, X);
  }
  hasEffects(e2) {
    this.deoptimized || this.applyDeoptimizations();
    const t = this.context.options.treeshake.propertyReadSideEffects;
    return this.parent.type === "ObjectPattern" && t === "always" || this.key.hasEffects(e2) || this.value.hasEffects(e2);
  }
  markDeclarationReached() {
    this.value.markDeclarationReached();
  }
  render(e2, t) {
    this.shorthand || this.key.render(e2, t), this.value.render(e2, t, { isShorthandProperty: this.shorthand });
  }
  applyDeoptimizations() {
    this.deoptimized = true, this.declarationInit !== null && (this.declarationInit.deoptimizePath([M, M]), this.context.requestTreeshakingPass());
  }
}, PropertyDefinition: class extends ut {
  deoptimizePath(e2) {
    var t;
    (t = this.value) === null || t === void 0 || t.deoptimizePath(e2);
  }
  deoptimizeThisOnInteractionAtPath(e2, t, i) {
    var s;
    (s = this.value) === null || s === void 0 || s.deoptimizeThisOnInteractionAtPath(e2, t, i);
  }
  getLiteralValueAtPath(e2, t, i) {
    return this.value ? this.value.getLiteralValueAtPath(e2, t, i) : W;
  }
  getReturnExpressionWhenCalledAtPath(e2, t, i, s) {
    return this.value ? this.value.getReturnExpressionWhenCalledAtPath(e2, t, i, s) : X;
  }
  hasEffects(e2) {
    var t;
    return this.key.hasEffects(e2) || this.static && !!((t = this.value) === null || t === void 0 ? void 0 : t.hasEffects(e2));
  }
  hasEffectsOnInteractionAtPath(e2, t, i) {
    return !this.value || this.value.hasEffectsOnInteractionAtPath(e2, t, i);
  }
  applyDeoptimizations() {
  }
}, RestElement: Ei, ReturnStatement: class extends ut {
  hasEffects(e2) {
    var t;
    return !(e2.ignore.returnYield && !((t = this.argument) === null || t === void 0 ? void 0 : t.hasEffects(e2))) || (e2.brokenFlow = 2, false);
  }
  include(e2, t) {
    var i;
    this.included = true, (i = this.argument) === null || i === void 0 || i.include(e2, t), e2.brokenFlow = 2;
  }
  initialise() {
    this.scope.addReturnExpression(this.argument || X);
  }
  render(e2, t) {
    this.argument && (this.argument.render(e2, t, { preventASI: true }), this.argument.start === this.start + 6 && e2.prependLeft(this.start + 6, " "));
  }
}, SequenceExpression: class extends ut {
  deoptimizePath(e2) {
    this.expressions[this.expressions.length - 1].deoptimizePath(e2);
  }
  deoptimizeThisOnInteractionAtPath(e2, t, i) {
    this.expressions[this.expressions.length - 1].deoptimizeThisOnInteractionAtPath(e2, t, i);
  }
  getLiteralValueAtPath(e2, t, i) {
    return this.expressions[this.expressions.length - 1].getLiteralValueAtPath(e2, t, i);
  }
  hasEffects(e2) {
    for (const t of this.expressions)
      if (t.hasEffects(e2))
        return true;
    return false;
  }
  hasEffectsOnInteractionAtPath(e2, t, i) {
    return this.expressions[this.expressions.length - 1].hasEffectsOnInteractionAtPath(e2, t, i);
  }
  include(e2, t) {
    this.included = true;
    const i = this.expressions[this.expressions.length - 1];
    for (const s of this.expressions)
      (t || s === i && !(this.parent instanceof yi) || s.shouldBeIncluded(e2)) && s.include(e2, t);
  }
  render(e2, t, { renderedParentType: i, isCalleeOfRenderedParent: s, preventASI: n2 } = ie) {
    let r2 = 0, a2 = null;
    const o2 = this.expressions[this.expressions.length - 1];
    for (const { node: l2, separator: h2, start: c2, end: u2 } of fi(this.expressions, e2, this.start, this.end))
      if (l2.included)
        if (r2++, a2 = h2, r2 === 1 && n2 && mi(e2, c2, l2.start), r2 === 1) {
          const n3 = i || this.parent.type;
          l2.render(e2, t, { isCalleeOfRenderedParent: s && l2 === o2, renderedParentType: n3, renderedSurroundingElement: n3 });
        } else
          l2.render(e2, t);
      else
        ai(l2, e2, c2, u2);
    a2 && e2.remove(a2, this.end);
  }
}, SpreadElement: dt, StaticBlock: class extends ut {
  createScope(e2) {
    this.scope = new gi(e2);
  }
  hasEffects(e2) {
    for (const t of this.body)
      if (t.hasEffects(e2))
        return true;
    return false;
  }
  include(e2, t) {
    this.included = true;
    for (const i of this.body)
      (t || i.shouldBeIncluded(e2)) && i.include(e2, t);
  }
  render(e2, t) {
    this.body.length ? pi(this.body, e2, this.start + 1, this.end - 1, t) : super.render(e2, t);
  }
}, Super: class extends ut {
  bind() {
    this.variable = this.scope.findVariable("this");
  }
  deoptimizePath(e2) {
    this.variable.deoptimizePath(e2);
  }
  deoptimizeThisOnInteractionAtPath(e2, t, i) {
    this.variable.deoptimizeThisOnInteractionAtPath(e2, t, i);
  }
  include() {
    this.included || (this.included = true, this.context.includeVariableInModule(this.variable));
  }
}, SwitchCase: Ts, SwitchStatement: class extends ut {
  createScope(e2) {
    this.scope = new gi(e2);
  }
  hasEffects(e2) {
    if (this.discriminant.hasEffects(e2))
      return true;
    const { brokenFlow: t, ignore: { breaks: i } } = e2;
    let s = 1 / 0;
    e2.ignore.breaks = true;
    for (const i2 of this.cases) {
      if (i2.hasEffects(e2))
        return true;
      s = e2.brokenFlow < s ? e2.brokenFlow : s, e2.brokenFlow = t;
    }
    return this.defaultCase !== null && s !== 1 && (e2.brokenFlow = s), e2.ignore.breaks = i, false;
  }
  include(e2, t) {
    this.included = true, this.discriminant.include(e2, t);
    const { brokenFlow: i } = e2;
    let s = 1 / 0, n2 = t || this.defaultCase !== null && this.defaultCase < this.cases.length - 1;
    for (let r2 = this.cases.length - 1; r2 >= 0; r2--) {
      const a2 = this.cases[r2];
      if (a2.included && (n2 = true), !n2) {
        const e3 = Me();
        e3.ignore.breaks = true, n2 = a2.hasEffects(e3);
      }
      n2 ? (a2.include(e2, t), s = s < e2.brokenFlow ? s : e2.brokenFlow, e2.brokenFlow = i) : s = i;
    }
    n2 && this.defaultCase !== null && s !== 1 && (e2.brokenFlow = s);
  }
  initialise() {
    for (let e2 = 0; e2 < this.cases.length; e2++)
      if (this.cases[e2].test === null)
        return void (this.defaultCase = e2);
    this.defaultCase = null;
  }
  render(e2, t) {
    this.discriminant.render(e2, t), this.cases.length > 0 && pi(this.cases, e2, this.cases[0].start, this.end - 1, t);
  }
}, TaggedTemplateExpression: class extends Li {
  bind() {
    if (super.bind(), this.tag.type === "Identifier") {
      const e2 = this.tag.name;
      this.scope.findVariable(e2).isNamespace && this.context.warn({ code: "CANNOT_CALL_NAMESPACE", message: `Cannot call a namespace ('${e2}')` }, this.start);
    }
  }
  hasEffects(e2) {
    try {
      for (const t of this.quasi.expressions)
        if (t.hasEffects(e2))
          return true;
      return this.tag.hasEffects(e2) || this.tag.hasEffectsOnInteractionAtPath(V, this.interaction, e2);
    } finally {
      this.deoptimized || this.applyDeoptimizations();
    }
  }
  include(e2, t) {
    this.deoptimized || this.applyDeoptimizations(), t ? super.include(e2, t) : (this.included = true, this.tag.include(e2, t), this.quasi.include(e2, t)), this.tag.includeCallArguments(e2, this.interaction.args);
    const i = this.getReturnExpression();
    i.included || i.include(e2, false);
  }
  initialise() {
    this.interaction = { args: [X, ...this.quasi.expressions], thisArg: this.tag instanceof Mi && !this.tag.variable ? this.tag.object : null, type: 2, withNew: false };
  }
  render(e2, t) {
    this.tag.render(e2, t, { isCalleeOfRenderedParent: true }), this.quasi.render(e2, t);
  }
  applyDeoptimizations() {
    this.deoptimized = true, this.interaction.thisArg && this.tag.deoptimizeThisOnInteractionAtPath(this.interaction, V, G);
    for (const e2 of this.quasi.expressions)
      e2.deoptimizePath(B);
    this.context.requestTreeshakingPass();
  }
  getReturnExpression(e2 = G) {
    return this.returnExpression === null ? (this.returnExpression = X, this.returnExpression = this.tag.getReturnExpressionWhenCalledAtPath(V, this.interaction, e2, this)) : this.returnExpression;
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
  parseNode(e2) {
    this.value = e2.value, super.parseNode(e2);
  }
  render() {
  }
}, TemplateLiteral: Os, ThisExpression: class extends ut {
  bind() {
    this.variable = this.scope.findVariable("this");
  }
  deoptimizePath(e2) {
    this.variable.deoptimizePath(e2);
  }
  deoptimizeThisOnInteractionAtPath(e2, t, i) {
    this.variable.deoptimizeThisOnInteractionAtPath(e2.thisArg === this ? __spreadProps(__spreadValues({}, e2), { thisArg: this.variable }) : e2, t, i);
  }
  hasEffectsOnInteractionAtPath(e2, t, i) {
    return e2.length === 0 ? t.type !== 0 : this.variable.hasEffectsOnInteractionAtPath(e2, t, i);
  }
  include() {
    this.included || (this.included = true, this.context.includeVariableInModule(this.variable));
  }
  initialise() {
    this.alias = this.scope.findLexicalBoundary() instanceof Ds ? this.context.moduleContext : null, this.alias === "undefined" && this.context.warn({ code: "THIS_IS_UNDEFINED", message: "The 'this' keyword is equivalent to 'undefined' at the top level of an ES module, and has been rewritten", url: "https://rollupjs.org/guide/en/#error-this-is-undefined" }, this.start);
  }
  render(e2) {
    this.alias !== null && e2.overwrite(this.start, this.end, this.alias, { contentOnly: false, storeName: true });
  }
}, ThrowStatement: class extends ut {
  hasEffects() {
    return true;
  }
  include(e2, t) {
    this.included = true, this.argument.include(e2, t), e2.brokenFlow = 2;
  }
  render(e2, t) {
    this.argument.render(e2, t, { preventASI: true }), this.argument.start === this.start + 5 && e2.prependLeft(this.start + 5, " ");
  }
}, TryStatement: class extends ut {
  constructor() {
    super(...arguments), this.directlyIncluded = false, this.includedLabelsAfterBlock = null;
  }
  hasEffects(e2) {
    var t;
    return (this.context.options.treeshake.tryCatchDeoptimization ? this.block.body.length > 0 : this.block.hasEffects(e2)) || !!((t = this.finalizer) === null || t === void 0 ? void 0 : t.hasEffects(e2));
  }
  include(e2, t) {
    var i, s;
    const n2 = (i = this.context.options.treeshake) === null || i === void 0 ? void 0 : i.tryCatchDeoptimization, { brokenFlow: r2 } = e2;
    if (this.directlyIncluded && n2) {
      if (this.includedLabelsAfterBlock)
        for (const t2 of this.includedLabelsAfterBlock)
          e2.includedLabels.add(t2);
    } else
      this.included = true, this.directlyIncluded = true, this.block.include(e2, n2 ? "variables" : t), e2.includedLabels.size > 0 && (this.includedLabelsAfterBlock = [...e2.includedLabels]), e2.brokenFlow = r2;
    this.handler !== null && (this.handler.include(e2, t), e2.brokenFlow = r2), (s = this.finalizer) === null || s === void 0 || s.include(e2, t);
  }
}, UnaryExpression: class extends ut {
  getLiteralValueAtPath(e2, t, i) {
    if (e2.length > 0)
      return W;
    const s = this.argument.getLiteralValueAtPath(V, t, i);
    return typeof s == "symbol" ? W : Ls[this.operator](s);
  }
  hasEffects(e2) {
    return this.deoptimized || this.applyDeoptimizations(), !(this.operator === "typeof" && this.argument instanceof ni) && (this.argument.hasEffects(e2) || this.operator === "delete" && this.argument.hasEffectsOnInteractionAtPath(V, Q, e2));
  }
  hasEffectsOnInteractionAtPath(e2, { type: t }) {
    return t !== 0 || e2.length > (this.operator === "void" ? 0 : 1);
  }
  applyDeoptimizations() {
    this.deoptimized = true, this.operator === "delete" && (this.argument.deoptimizePath(V), this.context.requestTreeshakingPass());
  }
}, UnknownNode: class extends ut {
  hasEffects() {
    return true;
  }
  include(e2) {
    super.include(e2, true);
  }
}, UpdateExpression: class extends ut {
  hasEffects(e2) {
    return this.deoptimized || this.applyDeoptimizations(), this.argument.hasEffectsAsAssignmentTarget(e2, true);
  }
  hasEffectsOnInteractionAtPath(e2, { type: t }) {
    return e2.length > 1 || t !== 0;
  }
  include(e2, t) {
    this.deoptimized || this.applyDeoptimizations(), this.included = true, this.argument.includeAsAssignmentTarget(e2, t, true);
  }
  initialise() {
    this.argument.setAssignedValue(X);
  }
  render(e2, t) {
    const { exportNamesByVariable: i, format: s, snippets: { _: n2 } } = t;
    if (this.argument.render(e2, t), s === "system") {
      const s2 = this.argument.variable, r2 = i.get(s2);
      if (r2)
        if (this.prefix)
          r2.length === 1 ? Ai(s2, this.start, this.end, e2, t) : Ii(s2, this.start, this.end, this.parent.type !== "ExpressionStatement", e2, t);
        else {
          const i2 = this.operator[0];
          !function(e3, t2, i3, s3, n3, r3, a2) {
            const { _: o2 } = r3.snippets;
            n3.prependRight(t2, `${Si([e3], r3, a2)},${o2}`), s3 && (n3.prependRight(t2, "("), n3.appendLeft(i3, ")"));
          }(s2, this.start, this.end, this.parent.type !== "ExpressionStatement", e2, t, `${n2}${i2}${n2}1`);
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
  declareDeclarator(e2) {
    this.id.declare(e2, this.init || Le);
  }
  deoptimizePath(e2) {
    this.id.deoptimizePath(e2);
  }
  hasEffects(e2) {
    var t;
    const i = (t = this.init) === null || t === void 0 ? void 0 : t.hasEffects(e2);
    return this.id.markDeclarationReached(), i || this.id.hasEffects(e2);
  }
  include(e2, t) {
    var i;
    this.included = true, (i = this.init) === null || i === void 0 || i.include(e2, t), this.id.markDeclarationReached(), (t || this.id.shouldBeIncluded(e2)) && this.id.include(e2, t);
  }
  render(e2, t) {
    const { exportNamesByVariable: i, snippets: { _: s } } = t, n2 = this.id.included;
    if (n2)
      this.id.render(e2, t);
    else {
      const t2 = hi(e2.original, "=", this.id.end);
      e2.remove(this.start, ui(e2.original, t2 + 1));
    }
    this.init ? this.init.render(e2, t, n2 ? ie : { renderedSurroundingElement: "ExpressionStatement" }) : this.id instanceof ni && Vs(this.id.variable, i) && e2.appendLeft(this.end, `${s}=${s}void 0`);
  }
  applyDeoptimizations() {
  }
}, WhileStatement: class extends ut {
  hasEffects(e2) {
    if (this.test.hasEffects(e2))
      return true;
    const { brokenFlow: t, ignore: { breaks: i, continues: s } } = e2;
    return e2.ignore.breaks = true, e2.ignore.continues = true, !!this.body.hasEffects(e2) || (e2.ignore.breaks = i, e2.ignore.continues = s, e2.brokenFlow = t, false);
  }
  include(e2, t) {
    this.included = true, this.test.include(e2, t);
    const { brokenFlow: i } = e2;
    this.body.include(e2, t, { asSingleStatement: true }), e2.brokenFlow = i;
  }
}, YieldExpression: class extends ut {
  hasEffects(e2) {
    var t;
    return this.deoptimized || this.applyDeoptimizations(), !(e2.ignore.returnYield && !((t = this.argument) === null || t === void 0 ? void 0 : t.hasEffects(e2)));
  }
  render(e2, t) {
    this.argument && (this.argument.render(e2, t, { preventASI: true }), this.argument.start === this.start + 5 && e2.prependLeft(this.start + 5, " "));
  }
} };
class zs extends ee {
  constructor(e2) {
    super("_missingExportShim"), this.module = e2;
  }
  include() {
    super.include(), this.module.needsExportShim = true;
  }
}
class js extends ee {
  constructor(e2) {
    super(e2.getModuleName()), this.memberVariables = null, this.mergedNamespaces = [], this.referencedEarly = false, this.references = [], this.context = e2, this.module = e2.module;
  }
  addReference(e2) {
    this.references.push(e2), this.name = e2.name;
  }
  getMemberVariables() {
    if (this.memberVariables)
      return this.memberVariables;
    const e2 = /* @__PURE__ */ Object.create(null);
    for (const t of this.context.getExports().concat(this.context.getReexports()))
      if (t[0] !== "*" && t !== this.module.info.syntheticNamedExports) {
        const i = this.context.traceExport(t);
        i && (e2[t] = i);
      }
    return this.memberVariables = e2;
  }
  include() {
    this.included = true, this.context.includeAllExports();
  }
  prepare(e2) {
    this.mergedNamespaces.length > 0 && this.module.scope.addAccessedGlobals(["_mergeNamespaces"], e2);
  }
  renderBlock(e2) {
    const { exportNamesByVariable: t, format: i, freeze: s, indent: n2, namespaceToStringTag: r2, snippets: { _: a2, cnst: o2, getObject: l2, getPropertyAccess: h2, n: c2, s: u2 } } = e2, d2 = this.getMemberVariables(), p2 = Object.entries(d2).map(([e3, t2]) => this.referencedEarly || t2.isReassigned ? [null, `get ${e3}${a2}()${a2}{${a2}return ${t2.getName(h2)}${u2}${a2}}`] : [e3, t2.getName(h2)]);
    p2.unshift([null, `__proto__:${a2}null`]);
    let f3 = l2(p2, { lineBreakIndent: { base: "", t: n2 } });
    if (this.mergedNamespaces.length > 0) {
      const e3 = this.mergedNamespaces.map((e4) => e4.getName(h2));
      f3 = `/*#__PURE__*/_mergeNamespaces(${f3},${a2}[${e3.join(`,${a2}`)}])`;
    } else
      r2 && (f3 = `/*#__PURE__*/Object.defineProperty(${f3},${a2}Symbol.toStringTag,${a2}${xs(l2)})`), s && (f3 = `/*#__PURE__*/Object.freeze(${f3})`);
    return f3 = `${o2} ${this.getName(h2)}${a2}=${a2}${f3};`, i === "system" && t.has(this) && (f3 += `${c2}${Si([this], e2)};`), f3;
  }
  renderFirst() {
    return this.referencedEarly;
  }
  setMergedNamespaces(e2) {
    this.mergedNamespaces = e2;
    const t = this.context.getModuleExecIndex();
    for (const e3 of this.references)
      if (e3.context.getModuleExecIndex() <= t) {
        this.referencedEarly = true;
        break;
      }
  }
}
js.prototype.isNamespace = true;
class Us extends ee {
  constructor(e2, t, i) {
    super(t), this.baseVariable = null, this.context = e2, this.module = e2.module, this.syntheticNamespace = i;
  }
  getBaseVariable() {
    if (this.baseVariable)
      return this.baseVariable;
    let e2 = this.syntheticNamespace;
    for (; e2 instanceof Ms || e2 instanceof Us; ) {
      if (e2 instanceof Ms) {
        const t = e2.getOriginalVariable();
        if (t === e2)
          break;
        e2 = t;
      }
      e2 instanceof Us && (e2 = e2.syntheticNamespace);
    }
    return this.baseVariable = e2;
  }
  getBaseVariableName() {
    return this.syntheticNamespace.getBaseVariableName();
  }
  getName(e2) {
    return `${this.syntheticNamespace.getName(e2)}${e2(this.name)}`;
  }
  include() {
    this.included = true, this.context.includeVariableInModule(this.syntheticNamespace);
  }
  setRenderNames(e2, t) {
    super.setRenderNames(e2, t);
  }
}
var Gs;
function Hs(e2) {
  return e2.id;
}
!function(e2) {
  e2[e2.LOAD_AND_PARSE = 0] = "LOAD_AND_PARSE", e2[e2.ANALYSE = 1] = "ANALYSE", e2[e2.GENERATE = 2] = "GENERATE";
}(Gs || (Gs = {}));
var Ws = "performance" in (typeof globalThis != "undefined" ? globalThis : typeof window != "undefined" ? window : {}) ? performance : { now: () => 0 }, qs = { memoryUsage: () => ({ heapUsed: 0 }) };
const Ks = () => {
};
let Xs = /* @__PURE__ */ new Map();
function Ys(e2, t) {
  switch (t) {
    case 1:
      return `# ${e2}`;
    case 2:
      return `## ${e2}`;
    case 3:
      return e2;
    default:
      return `${"  ".repeat(t - 4)}- ${e2}`;
  }
}
function Qs(e2, t = 3) {
  e2 = Ys(e2, t);
  const i = qs.memoryUsage().heapUsed, s = Ws.now(), n2 = Xs.get(e2);
  n2 === void 0 ? Xs.set(e2, { memory: 0, startMemory: i, startTime: s, time: 0, totalMemory: 0 }) : (n2.startMemory = i, n2.startTime = s);
}
function Zs(e2, t = 3) {
  e2 = Ys(e2, t);
  const i = Xs.get(e2);
  if (i !== void 0) {
    const e3 = qs.memoryUsage().heapUsed;
    i.memory += e3 - i.startMemory, i.time += Ws.now() - i.startTime, i.totalMemory = Math.max(i.totalMemory, e3);
  }
}
function Js() {
  const e2 = {};
  for (const [t, { memory: i, time: s, totalMemory: n2 }] of Xs)
    e2[t] = [s, i, n2];
  return e2;
}
let en = Ks, tn = Ks;
const sn = ["load", "resolveDynamicImport", "resolveId", "transform"];
function nn(e2, t) {
  for (const i of sn)
    if (i in e2) {
      let s = `plugin ${t}`;
      e2.name && (s += ` (${e2.name})`), s += ` - ${i}`;
      const n2 = e2[i];
      e2[i] = function(...e3) {
        en(s, 4);
        const t2 = n2.apply(this, e3);
        return tn(s, 4), t2 && typeof t2.then == "function" ? (en(`${s} (async)`, 4), t2.then((e4) => (tn(`${s} (async)`, 4), e4))) : t2;
      };
    }
  return e2;
}
function rn(e2) {
  e2.isExecuted = true;
  const t = [e2], i = /* @__PURE__ */ new Set();
  for (const e3 of t)
    for (const s of [...e3.dependencies, ...e3.implicitlyLoadedBefore])
      s instanceof $e || s.isExecuted || !s.info.moduleSideEffects && !e3.implicitlyLoadedBefore.has(s) || i.has(s.id) || (s.isExecuted = true, i.add(s.id), t.push(s));
}
const an = { identifier: null, localName: "_missingExportShim" };
function on(e2, t, i, s, n2 = /* @__PURE__ */ new Map()) {
  const r2 = n2.get(t);
  if (r2) {
    if (r2.has(e2))
      return s ? [null] : pe((a2 = t, o2 = e2.id, { code: me.CIRCULAR_REEXPORT, id: o2, message: `"${a2}" cannot be exported from ${he(o2)} as it is a reexport that references itself.` }));
    r2.add(e2);
  } else
    n2.set(t, /* @__PURE__ */ new Set([e2]));
  var a2, o2;
  return e2.getVariableForExportName(t, { importerForSideEffects: i, isExportAllSearch: s, searchedNamesAndModules: n2 });
}
class ln {
  constructor(e2, t, i, s, n2, r2, a2) {
    this.graph = e2, this.id = t, this.options = i, this.alternativeReexportModules = /* @__PURE__ */ new Map(), this.chunkFileNames = /* @__PURE__ */ new Set(), this.chunkNames = [], this.cycles = /* @__PURE__ */ new Set(), this.dependencies = /* @__PURE__ */ new Set(), this.dynamicDependencies = /* @__PURE__ */ new Set(), this.dynamicImporters = [], this.dynamicImports = [], this.execIndex = 1 / 0, this.implicitlyLoadedAfter = /* @__PURE__ */ new Set(), this.implicitlyLoadedBefore = /* @__PURE__ */ new Set(), this.importDescriptions = /* @__PURE__ */ new Map(), this.importMetas = [], this.importedFromNotTreeshaken = false, this.importers = [], this.includedDynamicImporters = [], this.includedImports = /* @__PURE__ */ new Set(), this.isExecuted = false, this.isUserDefinedEntryPoint = false, this.needsExportShim = false, this.sideEffectDependenciesByVariable = /* @__PURE__ */ new Map(), this.sources = /* @__PURE__ */ new Set(), this.usesTopLevelAwait = false, this.allExportNames = null, this.ast = null, this.exportAllModules = [], this.exportAllSources = /* @__PURE__ */ new Set(), this.exportNamesByVariable = null, this.exportShimVariable = new zs(this), this.exports = /* @__PURE__ */ new Map(), this.namespaceReexportsByName = /* @__PURE__ */ new Map(), this.reexportDescriptions = /* @__PURE__ */ new Map(), this.relevantDependencies = null, this.syntheticExports = /* @__PURE__ */ new Map(), this.syntheticNamespace = null, this.transformDependencies = [], this.transitiveReexports = null, this.excludeFromSourcemap = /\0/.test(t), this.context = i.moduleContext(t), this.preserveSignature = this.options.preserveEntrySignatures;
    const o2 = this, { dynamicImports: l2, dynamicImporters: h2, implicitlyLoadedAfter: c2, implicitlyLoadedBefore: u2, importers: d2, reexportDescriptions: p2, sources: f3 } = this;
    this.info = { ast: null, code: null, get dynamicallyImportedIdResolutions() {
      return l2.map(({ argument: e3 }) => typeof e3 == "string" && o2.resolvedIds[e3]).filter(Boolean);
    }, get dynamicallyImportedIds() {
      return l2.map(({ id: e3 }) => e3).filter((e3) => e3 != null);
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
      return Array.from(f3, (e3) => o2.resolvedIds[e3]).filter(Boolean);
    }, get importedIds() {
      return Array.from(f3, (e3) => {
        var t2;
        return (t2 = o2.resolvedIds[e3]) === null || t2 === void 0 ? void 0 : t2.id;
      }).filter(Boolean);
    }, get importers() {
      return d2.sort();
    }, isEntry: s, isExternal: false, get isIncluded() {
      return e2.phase !== Gs.GENERATE ? null : o2.isIncluded();
    }, meta: __spreadValues({}, a2), moduleSideEffects: n2, syntheticNamedExports: r2 }, Object.defineProperty(this.info, "hasModuleSideEffects", { enumerable: false });
  }
  basename() {
    const e2 = _(this.id), t = $(this.id);
    return Ne(t ? e2.slice(0, -t.length) : e2);
  }
  bindReferences() {
    this.ast.bind();
  }
  error(e2, t) {
    return this.addLocationToLogProps(e2, t), pe(e2);
  }
  getAllExportNames() {
    if (this.allExportNames)
      return this.allExportNames;
    this.allExportNames = /* @__PURE__ */ new Set([...this.exports.keys(), ...this.reexportDescriptions.keys()]);
    for (const e2 of this.exportAllModules)
      if (e2 instanceof $e)
        this.allExportNames.add(`*${e2.id}`);
      else
        for (const t of e2.getAllExportNames())
          t !== "default" && this.allExportNames.add(t);
    return typeof this.info.syntheticNamedExports == "string" && this.allExportNames.delete(this.info.syntheticNamedExports), this.allExportNames;
  }
  getDependenciesToBeIncluded() {
    if (this.relevantDependencies)
      return this.relevantDependencies;
    this.relevantDependencies = /* @__PURE__ */ new Set();
    const e2 = /* @__PURE__ */ new Set(), t = /* @__PURE__ */ new Set(), i = new Set(this.includedImports);
    if (this.info.isEntry || this.includedDynamicImporters.length > 0 || this.namespace.included || this.implicitlyLoadedAfter.size > 0)
      for (const e3 of [...this.getReexports(), ...this.getExports()]) {
        const [t2] = this.getVariableForExportName(e3);
        t2 && i.add(t2);
      }
    for (let s of i) {
      const i2 = this.sideEffectDependenciesByVariable.get(s);
      if (i2)
        for (const e3 of i2)
          t.add(e3);
      s instanceof Us ? s = s.getBaseVariable() : s instanceof Ms && (s = s.getOriginalVariable()), e2.add(s.module);
    }
    if (this.options.treeshake && this.info.moduleSideEffects !== "no-treeshake")
      this.addRelevantSideEffectDependencies(this.relevantDependencies, e2, t);
    else
      for (const e3 of this.dependencies)
        this.relevantDependencies.add(e3);
    for (const t2 of e2)
      this.relevantDependencies.add(t2);
    return this.relevantDependencies;
  }
  getExportNamesByVariable() {
    if (this.exportNamesByVariable)
      return this.exportNamesByVariable;
    const e2 = /* @__PURE__ */ new Map();
    for (const t of this.getAllExportNames()) {
      let [i] = this.getVariableForExportName(t);
      if (i instanceof Ms && (i = i.getOriginalVariable()), !i || !(i.included || i instanceof te))
        continue;
      const s = e2.get(i);
      s ? s.push(t) : e2.set(i, [t]);
    }
    return this.exportNamesByVariable = e2;
  }
  getExports() {
    return Array.from(this.exports.keys());
  }
  getReexports() {
    if (this.transitiveReexports)
      return this.transitiveReexports;
    this.transitiveReexports = [];
    const e2 = new Set(this.reexportDescriptions.keys());
    for (const t of this.exportAllModules)
      if (t instanceof $e)
        e2.add(`*${t.id}`);
      else
        for (const i of [...t.getReexports(), ...t.getExports()])
          i !== "default" && e2.add(i);
    return this.transitiveReexports = [...e2];
  }
  getRenderedExports() {
    const e2 = [], t = [];
    for (const i of this.exports.keys()) {
      const [s] = this.getVariableForExportName(i);
      (s && s.included ? e2 : t).push(i);
    }
    return { removedExports: t, renderedExports: e2 };
  }
  getSyntheticNamespace() {
    return this.syntheticNamespace === null && (this.syntheticNamespace = void 0, [this.syntheticNamespace] = this.getVariableForExportName(typeof this.info.syntheticNamedExports == "string" ? this.info.syntheticNamedExports : "default", { onlyExplicit: true })), this.syntheticNamespace ? this.syntheticNamespace : pe((e2 = this.id, t = this.info.syntheticNamedExports, { code: me.SYNTHETIC_NAMED_EXPORTS_NEED_NAMESPACE_EXPORT, id: e2, message: `Module "${he(e2)}" that is marked with 'syntheticNamedExports: ${JSON.stringify(t)}' needs ${typeof t == "string" && t !== "default" ? `an explicit export named "${t}"` : "a default export"} that does not reexport an unresolved named export of the same module.` }));
    var e2, t;
  }
  getVariableForExportName(e2, { importerForSideEffects: t, isExportAllSearch: i, onlyExplicit: s, searchedNamesAndModules: n2 } = se) {
    var r2;
    if (e2[0] === "*") {
      if (e2.length === 1)
        return [this.namespace];
      return this.graph.modulesById.get(e2.slice(1)).getVariableForExportName("*");
    }
    const a2 = this.reexportDescriptions.get(e2);
    if (a2) {
      const [e3] = on(a2.module, a2.localName, t, false, n2);
      return e3 ? (t && hn(e3, t, this), [e3]) : this.error(Ee(a2.localName, this.id, a2.module.id), a2.start);
    }
    const o2 = this.exports.get(e2);
    if (o2) {
      if (o2 === an)
        return [this.exportShimVariable];
      const e3 = o2.localName, i2 = this.traceVariable(e3, { importerForSideEffects: t, searchedNamesAndModules: n2 });
      return t && (R(t.sideEffectDependenciesByVariable, i2, () => /* @__PURE__ */ new Set()).add(this), hn(i2, t, this)), [i2];
    }
    if (s)
      return [null];
    if (e2 !== "default") {
      const i2 = (r2 = this.namespaceReexportsByName.get(e2)) !== null && r2 !== void 0 ? r2 : this.getVariableFromNamespaceReexports(e2, t, n2);
      if (this.namespaceReexportsByName.set(e2, i2), i2[0])
        return i2;
    }
    return this.info.syntheticNamedExports ? [R(this.syntheticExports, e2, () => new Us(this.astContext, e2, this.getSyntheticNamespace()))] : !i && this.options.shimMissingExports ? (this.shimMissingExport(e2), [this.exportShimVariable]) : [null];
  }
  hasEffects() {
    return this.info.moduleSideEffects === "no-treeshake" || this.ast.included && this.ast.hasEffects(Me());
  }
  include() {
    const e2 = Re();
    this.ast.shouldBeIncluded(e2) && this.ast.include(e2, false);
  }
  includeAllExports(e2) {
    this.isExecuted || (rn(this), this.graph.needsTreeshakingPass = true);
    for (const t of this.exports.keys())
      if (e2 || t !== this.info.syntheticNamedExports) {
        const e3 = this.getVariableForExportName(t)[0];
        e3.deoptimizePath(B), e3.included || this.includeVariable(e3);
      }
    for (const e3 of this.getReexports()) {
      const [t] = this.getVariableForExportName(e3);
      t && (t.deoptimizePath(B), t.included || this.includeVariable(t), t instanceof te && (t.module.reexported = true));
    }
    e2 && this.namespace.setMergedNamespaces(this.includeAndGetAdditionalMergedNamespaces());
  }
  includeAllInBundle() {
    this.ast.include(Re(), true), this.includeAllExports(false);
  }
  isIncluded() {
    return this.ast.included || this.namespace.included || this.importedFromNotTreeshaken;
  }
  linkImports() {
    this.addModulesToImportDescriptions(this.importDescriptions), this.addModulesToImportDescriptions(this.reexportDescriptions);
    const e2 = [];
    for (const t of this.exportAllSources) {
      const i = this.graph.modulesById.get(this.resolvedIds[t].id);
      i instanceof $e ? e2.push(i) : this.exportAllModules.push(i);
    }
    this.exportAllModules.push(...e2);
  }
  render(e2) {
    const t = this.magicString.clone();
    return this.ast.render(t, e2), this.usesTopLevelAwait = this.astContext.usesTopLevelAwait, t;
  }
  setSource(_c) {
    var _d = _c, { ast: e2, code: t, customTransformCache: i, originalCode: s, originalSourcemap: n2, resolvedIds: r2, sourcemapChain: a2, transformDependencies: o2, transformFiles: l2 } = _d, h2 = __objRest(_d, ["ast", "code", "customTransformCache", "originalCode", "originalSourcemap", "resolvedIds", "sourcemapChain", "transformDependencies", "transformFiles"]);
    this.info.code = t, this.originalCode = s, this.originalSourcemap = n2, this.sourcemapChain = a2, l2 && (this.transformFiles = l2), this.transformDependencies = o2, this.customTransformCache = i, this.updateOptions(h2), en("generate ast", 3), e2 || (e2 = this.tryParse()), tn("generate ast", 3), this.resolvedIds = r2 || /* @__PURE__ */ Object.create(null);
    const c2 = this.id;
    this.magicString = new x(t, { filename: this.excludeFromSourcemap ? null : c2, indentExclusionRanges: [] }), en("analyse ast", 3), this.astContext = { addDynamicImport: this.addDynamicImport.bind(this), addExport: this.addExport.bind(this), addImport: this.addImport.bind(this), addImportMeta: this.addImportMeta.bind(this), code: t, deoptimizationTracker: this.graph.deoptimizationTracker, error: this.error.bind(this), fileName: c2, getExports: this.getExports.bind(this), getModuleExecIndex: () => this.execIndex, getModuleName: this.basename.bind(this), getNodeConstructor: (e3) => Fs[e3] || Fs.UnknownNode, getReexports: this.getReexports.bind(this), importDescriptions: this.importDescriptions, includeAllExports: () => this.includeAllExports(true), includeDynamicImport: this.includeDynamicImport.bind(this), includeVariableInModule: this.includeVariableInModule.bind(this), magicString: this.magicString, module: this, moduleContext: this.context, options: this.options, requestTreeshakingPass: () => this.graph.needsTreeshakingPass = true, traceExport: (e3) => this.getVariableForExportName(e3)[0], traceVariable: this.traceVariable.bind(this), usesTopLevelAwait: false, warn: this.warn.bind(this) }, this.scope = new Ds(this.graph.scope, this.astContext), this.namespace = new js(this.astContext), this.ast = new $s(e2, { context: this.astContext, type: "Module" }, this.scope), this.info.ast = e2, tn("analyse ast", 3);
  }
  toJSON() {
    return { ast: this.ast.esTreeNode, code: this.info.code, customTransformCache: this.customTransformCache, dependencies: Array.from(this.dependencies, Hs), id: this.id, meta: this.info.meta, moduleSideEffects: this.info.moduleSideEffects, originalCode: this.originalCode, originalSourcemap: this.originalSourcemap, resolvedIds: this.resolvedIds, sourcemapChain: this.sourcemapChain, syntheticNamedExports: this.info.syntheticNamedExports, transformDependencies: this.transformDependencies, transformFiles: this.transformFiles };
  }
  traceVariable(e2, { importerForSideEffects: t, isExportAllSearch: i, searchedNamesAndModules: s } = se) {
    const n2 = this.scope.variables.get(e2);
    if (n2)
      return n2;
    const r2 = this.importDescriptions.get(e2);
    if (r2) {
      const e3 = r2.module;
      if (e3 instanceof ln && r2.name === "*")
        return e3.namespace;
      const [n3] = on(e3, r2.name, t || this, i, s);
      return n3 || this.error(Ee(r2.name, this.id, e3.id), r2.start);
    }
    return null;
  }
  tryParse() {
    try {
      return this.graph.contextParse(this.info.code);
    } catch (e2) {
      let t = e2.message.replace(/ \(\d+:\d+\)$/, "");
      return this.id.endsWith(".json") ? t += " (Note that you need @rollup/plugin-json to import JSON files)" : this.id.endsWith(".js") || (t += " (Note that you need plugins to import files that are not JavaScript)"), this.error({ code: "PARSE_ERROR", message: t, parserError: e2 }, e2.pos);
    }
  }
  updateOptions({ meta: e2, moduleSideEffects: t, syntheticNamedExports: i }) {
    t != null && (this.info.moduleSideEffects = t), i != null && (this.info.syntheticNamedExports = i), e2 != null && Object.assign(this.info.meta, e2);
  }
  warn(e2, t) {
    this.addLocationToLogProps(e2, t), this.options.onwarn(e2);
  }
  addDynamicImport(e2) {
    let t = e2.source;
    t instanceof Os ? t.quasis.length === 1 && t.quasis[0].value.cooked && (t = t.quasis[0].value.cooked) : t instanceof Ti && typeof t.value == "string" && (t = t.value), this.dynamicImports.push({ argument: t, id: null, node: e2, resolution: null });
  }
  addExport(e2) {
    if (e2 instanceof Ki)
      this.exports.set("default", { identifier: e2.variable.getAssignedVariableName(), localName: "default" });
    else if (e2 instanceof Wi) {
      const t = e2.source.value;
      if (this.sources.add(t), e2.exported) {
        const i = e2.exported.name;
        this.reexportDescriptions.set(i, { localName: "*", module: null, source: t, start: e2.start });
      } else
        this.exportAllSources.add(t);
    } else if (e2.source instanceof Ti) {
      const t = e2.source.value;
      this.sources.add(t);
      for (const i of e2.specifiers) {
        const e3 = i.exported.name;
        this.reexportDescriptions.set(e3, { localName: i.local.name, module: null, source: t, start: i.start });
      }
    } else if (e2.declaration) {
      const t = e2.declaration;
      if (t instanceof Bs)
        for (const e3 of t.declarations)
          for (const t2 of Oe(e3.id))
            this.exports.set(t2, { identifier: null, localName: t2 });
      else {
        const e3 = t.id.name;
        this.exports.set(e3, { identifier: null, localName: e3 });
      }
    } else
      for (const t of e2.specifiers) {
        const e3 = t.local.name, i = t.exported.name;
        this.exports.set(i, { identifier: null, localName: e3 });
      }
  }
  addImport(e2) {
    const t = e2.source.value;
    this.sources.add(t);
    for (const i of e2.specifiers) {
      const e3 = i.type === "ImportDefaultSpecifier", s = i.type === "ImportNamespaceSpecifier", n2 = e3 ? "default" : s ? "*" : i.imported.name;
      this.importDescriptions.set(i.local.name, { module: null, name: n2, source: t, start: i.start });
    }
  }
  addImportMeta(e2) {
    this.importMetas.push(e2);
  }
  addLocationToLogProps(e2, t) {
    e2.id = this.id, e2.pos = t;
    let i = this.info.code;
    const s = re(i, t, { offsetLine: 1 });
    if (s) {
      let { column: n2, line: r2 } = s;
      try {
        ({ column: n2, line: r2 } = function(e3, t2) {
          const i2 = e3.filter((e4) => !!e4.mappings);
          e:
            for (; i2.length > 0; ) {
              const e4 = i2.pop().mappings[t2.line - 1];
              if (e4) {
                const i3 = e4.filter((e5) => e5.length > 1), s2 = i3[i3.length - 1];
                for (const e5 of i3)
                  if (e5[0] >= t2.column || e5 === s2) {
                    t2 = { column: e5[3], line: e5[2] + 1 };
                    continue e;
                  }
              }
              throw new Error("Can't resolve original location of error.");
            }
          return t2;
        }(this.sourcemapChain, { column: n2, line: r2 })), i = this.originalCode;
      } catch (e3) {
        this.options.onwarn({ code: "SOURCEMAP_ERROR", id: this.id, loc: { column: n2, file: this.id, line: r2 }, message: `Error when using sourcemap for reporting an error: ${e3.message}`, pos: t });
      }
      fe(e2, { column: n2, line: r2 }, i, this.id);
    }
  }
  addModulesToImportDescriptions(e2) {
    for (const t of e2.values()) {
      const { id: e3 } = this.resolvedIds[t.source];
      t.module = this.graph.modulesById.get(e3);
    }
  }
  addRelevantSideEffectDependencies(e2, t, i) {
    const s = /* @__PURE__ */ new Set(), n2 = (r2) => {
      for (const a2 of r2)
        s.has(a2) || (s.add(a2), t.has(a2) ? e2.add(a2) : (a2.info.moduleSideEffects || i.has(a2)) && (a2 instanceof $e || a2.hasEffects() ? e2.add(a2) : n2(a2.dependencies)));
    };
    n2(this.dependencies), n2(i);
  }
  getVariableFromNamespaceReexports(e2, t, i) {
    let s = null;
    const n2 = /* @__PURE__ */ new Map(), r2 = /* @__PURE__ */ new Set();
    for (const a2 of this.exportAllModules) {
      if (a2.info.syntheticNamedExports === e2)
        continue;
      const [o2, l2] = on(a2, e2, t, true, cn(i));
      a2 instanceof $e || l2 ? r2.add(o2) : o2 instanceof Us ? s || (s = o2) : o2 && n2.set(o2, a2);
    }
    if (n2.size > 0) {
      const t2 = [...n2], i2 = t2[0][0];
      return t2.length === 1 ? [i2] : (this.options.onwarn(function(e3, t3, i3) {
        return { code: me.NAMESPACE_CONFLICT, message: `Conflicting namespaces: "${he(t3)}" re-exports "${e3}" from one of the modules ${oe(i3.map((e4) => he(e4)))} (will be ignored)`, name: e3, reexporter: t3, sources: i3 };
      }(e2, this.id, t2.map(([, e3]) => e3.id))), [null]);
    }
    if (r2.size > 0) {
      const t2 = [...r2], i2 = t2[0];
      return t2.length > 1 && this.options.onwarn(function(e3, t3, i3, s2) {
        return { code: me.AMBIGUOUS_EXTERNAL_NAMESPACES, message: `Ambiguous external namespace resolution: "${he(t3)}" re-exports "${e3}" from one of the external modules ${oe(s2.map((e4) => he(e4)))}, guessing "${he(i3)}".`, name: e3, reexporter: t3, sources: s2 };
      }(e2, this.id, i2.module.id, t2.map((e3) => e3.module.id))), [i2, true];
    }
    return s ? [s] : [null];
  }
  includeAndGetAdditionalMergedNamespaces() {
    const e2 = /* @__PURE__ */ new Set(), t = /* @__PURE__ */ new Set();
    for (const i of [this, ...this.exportAllModules])
      if (i instanceof $e) {
        const [t2] = i.getVariableForExportName("*");
        t2.include(), this.includedImports.add(t2), e2.add(t2);
      } else if (i.info.syntheticNamedExports) {
        const e3 = i.getSyntheticNamespace();
        e3.include(), this.includedImports.add(e3), t.add(e3);
      }
    return [...t, ...e2];
  }
  includeDynamicImport(e2) {
    const t = this.dynamicImports.find((t2) => t2.node === e2).resolution;
    t instanceof ln && (t.includedDynamicImporters.push(this), t.includeAllExports(true));
  }
  includeVariable(e2) {
    if (!e2.included) {
      e2.include(), this.graph.needsTreeshakingPass = true;
      const t = e2.module;
      if (t instanceof ln && (t.isExecuted || rn(t), t !== this)) {
        const t2 = function(e3, t3) {
          const i = R(t3.sideEffectDependenciesByVariable, e3, () => /* @__PURE__ */ new Set());
          let s = e3;
          const n2 = /* @__PURE__ */ new Set([s]);
          for (; ; ) {
            const e4 = s.module;
            if (s = s instanceof Ms ? s.getDirectOriginalVariable() : s instanceof Us ? s.syntheticNamespace : null, !s || n2.has(s))
              break;
            n2.add(s), i.add(e4);
            const t4 = e4.sideEffectDependenciesByVariable.get(s);
            if (t4)
              for (const e5 of t4)
                i.add(e5);
          }
          return i;
        }(e2, this);
        for (const e3 of t2)
          e3.isExecuted || rn(e3);
      }
    }
  }
  includeVariableInModule(e2) {
    this.includeVariable(e2);
    const t = e2.module;
    t && t !== this && this.includedImports.add(e2);
  }
  shimMissingExport(e2) {
    this.options.onwarn({ code: "SHIMMED_EXPORT", exporter: he(this.id), exportName: e2, message: `Missing export "${e2}" has been shimmed in module ${he(this.id)}.` }), this.exports.set(e2, an);
  }
}
function hn(e2, t, i) {
  if (e2.module instanceof ln && e2.module !== i) {
    const s = e2.module.cycles;
    if (s.size > 0) {
      const n2 = i.cycles;
      for (const r2 of n2)
        if (s.has(r2)) {
          t.alternativeReexportModules.set(e2, i);
          break;
        }
    }
  }
}
const cn = (e2) => e2 && new Map(Array.from(e2, ([e3, t]) => [e3, new Set(t)]));
function un(e2) {
  return e2.endsWith(".js") ? e2.slice(0, -3) : e2;
}
function dn(e2, t) {
  return e2.autoId ? `${e2.basePath ? e2.basePath + "/" : ""}${un(t)}` : e2.id || "";
}
function pn(e2, t, i, s, n2, r2, a2, o2 = "return ") {
  const { _: l2, cnst: h2, getDirectReturnFunction: c2, getFunctionIntro: u2, getPropertyAccess: d2, n: p2, s: f3 } = n2;
  if (!i)
    return `${p2}${p2}${o2}${function(e3, t2, i2, s2, n3) {
      if (e3.length > 0)
        return e3[0].local;
      for (const { defaultVariableName: e4, id: r3, isChunk: a3, name: o3, namedExportsMode: l3, namespaceVariableName: h3, reexports: c3 } of t2)
        if (c3)
          return fn(o3, c3[0].imported, l3, a3, e4, h3, i2, r3, s2, n3);
    }(e2, t, s, a2, d2)};`;
  let m3 = "";
  for (const { defaultVariableName: e3, id: n3, isChunk: o3, name: h3, namedExportsMode: u3, namespaceVariableName: f4, reexports: g2 } of t)
    if (g2 && i) {
      for (const t2 of g2)
        if (t2.reexported !== "*") {
          const i2 = fn(h3, t2.imported, u3, o3, e3, f4, s, n3, a2, d2);
          if (m3 && (m3 += p2), t2.imported !== "*" && t2.needsLiveBinding) {
            const [e4, s2] = c2([], { functionReturn: true, lineBreakIndent: null, name: null });
            m3 += `Object.defineProperty(exports,${l2}'${t2.reexported}',${l2}{${p2}${r2}enumerable:${l2}true,${p2}${r2}get:${l2}${e4}${i2}${s2}${p2}});`;
          } else
            m3 += `exports${d2(t2.reexported)}${l2}=${l2}${i2};`;
        }
    }
  for (const { exported: t2, local: i2 } of e2) {
    const e3 = `exports${d2(t2)}`, s2 = i2;
    e3 !== s2 && (m3 && (m3 += p2), m3 += `${e3}${l2}=${l2}${s2};`);
  }
  for (const { name: e3, reexports: s2 } of t)
    if (s2 && i) {
      for (const t2 of s2)
        if (t2.reexported === "*") {
          m3 && (m3 += p2);
          const i2 = `{${p2}${r2}if${l2}(k${l2}!==${l2}'default'${l2}&&${l2}!exports.hasOwnProperty(k))${l2}${yn(e3, t2.needsLiveBinding, r2, n2)}${f3}${p2}}`;
          m3 += h2 === "var" && t2.needsLiveBinding ? `Object.keys(${e3}).forEach(${u2(["k"], { isAsync: false, name: null })}${i2});` : `for${l2}(${h2} k in ${e3})${l2}${i2}`;
        }
    }
  return m3 ? `${p2}${p2}${m3}` : "";
}
function fn(e2, t, i, s, n2, r2, a2, o2, l2, h2) {
  if (t === "default") {
    if (!s) {
      const t2 = String(a2(o2)), i2 = es[t2] ? n2 : e2;
      return ts(t2, l2) ? `${i2}${h2("default")}` : i2;
    }
    return i ? `${e2}${h2("default")}` : e2;
  }
  return t === "*" ? (s ? !i : is[String(a2(o2))]) ? r2 : e2 : `${e2}${h2(t)}`;
}
function mn(e2) {
  return e2([["value", "true"]], { lineBreakIndent: null });
}
function gn(e2, t, i, { _: s, getObject: n2 }) {
  if (e2) {
    if (t)
      return i ? `Object.defineProperties(exports,${s}${n2([["__esModule", mn(n2)], [null, `[Symbol.toStringTag]:${s}${xs(n2)}`]], { lineBreakIndent: null })});` : `Object.defineProperty(exports,${s}'__esModule',${s}${mn(n2)});`;
    if (i)
      return `Object.defineProperty(exports,${s}Symbol.toStringTag,${s}${xs(n2)});`;
  }
  return "";
}
const yn = (e2, t, i, { _: s, getDirectReturnFunction: n2, n: r2 }) => {
  if (t) {
    const [t2, a2] = n2([], { functionReturn: true, lineBreakIndent: null, name: null });
    return `Object.defineProperty(exports,${s}k,${s}{${r2}${i}${i}enumerable:${s}true,${r2}${i}${i}get:${s}${t2}${e2}[k]${a2}${r2}${i}})`;
  }
  return `exports[k]${s}=${s}${e2}[k]`;
};
function xn(e2, t, i, s, n2, r2, a2, o2) {
  const { _: l2, cnst: h2, n: c2 } = o2, u2 = /* @__PURE__ */ new Set(), d2 = [], p2 = (e3, t2, i2) => {
    u2.add(t2), d2.push(`${h2} ${e3}${l2}=${l2}/*#__PURE__*/${t2}(${i2});`);
  };
  for (const { defaultVariableName: i2, imports: s2, id: n3, isChunk: r3, name: a3, namedExportsMode: o3, namespaceVariableName: l3, reexports: h3 } of e2)
    if (r3) {
      for (const { imported: e3, reexported: t2 } of [...s2 || [], ...h3 || []])
        if (e3 === "*" && t2 !== "*") {
          o3 || p2(l3, "_interopNamespaceDefaultOnly", a3);
          break;
        }
    } else {
      const e3 = String(t(n3));
      let r4 = false, o4 = false;
      for (const { imported: t2, reexported: n4 } of [...s2 || [], ...h3 || []]) {
        let s3, h4;
        t2 === "default" ? r4 || (r4 = true, i2 !== l3 && (h4 = i2, s3 = es[e3])) : t2 === "*" && n4 !== "*" && (o4 || (o4 = true, s3 = is[e3], h4 = l3)), s3 && p2(h4, s3, a3);
      }
    }
  return `${ns(u2, r2, a2, o2, i, s, n2)}${d2.length > 0 ? `${d2.join(c2)}${c2}${c2}` : ""}`;
}
function En(e2) {
  return e2[0] === "." ? un(e2) : e2;
}
const bn = { assert: true, buffer: true, console: true, constants: true, domain: true, events: true, http: true, https: true, os: true, path: true, process: true, punycode: true, querystring: true, stream: true, string_decoder: true, timers: true, tty: true, url: true, util: true, vm: true, zlib: true };
function vn(e2, t) {
  const i = t.map(({ id: e3 }) => e3).filter((e3) => e3 in bn);
  i.length && e2({ code: "MISSING_NODE_BUILTINS", message: `Creating a browser bundle that depends on Node.js built-in modules (${oe(i)}). You might need to include https://github.com/FredKSchott/rollup-plugin-polyfill-node`, modules: i });
}
const Sn = (e2, t) => e2.split(".").map(t).join("");
function An(e2, t, i, s, { _: n2, getPropertyAccess: r2 }) {
  const a2 = e2.split(".");
  a2[0] = (typeof i == "function" ? i(a2[0]) : i[a2[0]]) || a2[0];
  const o2 = a2.pop();
  let l2 = t, h2 = a2.map((e3) => (l2 += r2(e3), `${l2}${n2}=${n2}${l2}${n2}||${n2}{}`)).concat(`${l2}${r2(o2)}`).join(`,${n2}`) + `${n2}=${n2}${s}`;
  return a2.length > 0 && (h2 = `(${h2})`), h2;
}
function In(e2) {
  let t = e2.length;
  for (; t--; ) {
    const { imports: i, reexports: s } = e2[t];
    if (i || s)
      return e2.slice(0, t + 1);
  }
  return [];
}
const kn = ({ dependencies: e2, exports: t }) => {
  const i = new Set(t.map((e3) => e3.exported));
  i.add("default");
  for (const { reexports: t2 } of e2)
    if (t2)
      for (const e3 of t2)
        e3.reexported !== "*" && i.add(e3.reexported);
  return i;
}, Pn = (e2, t, { _: i, cnst: s, getObject: n2, n: r2 }) => e2 ? `${r2}${t}${s} _starExcludes${i}=${i}${n2([...e2].map((e3) => [e3, "1"]), { lineBreakIndent: { base: t, t } })};` : "", wn = (e2, t, { _: i, n: s }) => e2.length ? `${s}${t}var ${e2.join(`,${i}`)};` : "", Cn = (e2, t, i) => _n(e2.filter((e3) => e3.hoisted).map((e3) => ({ name: e3.exported, value: e3.local })), t, i);
function _n(e2, t, { _: i, n: s }) {
  return e2.length === 0 ? "" : e2.length === 1 ? `exports('${e2[0].name}',${i}${e2[0].value});${s}${s}` : `exports({${s}` + e2.map(({ name: e3, value: s2 }) => `${t}${e3}:${i}${s2}`).join(`,${s}`) + `${s}});${s}${s}`;
}
const Nn = (e2, t, i) => _n(e2.filter((e3) => e3.expression).map((e3) => ({ name: e3.exported, value: e3.local })), t, i), $n = (e2, t, i) => _n(e2.filter((e3) => e3.local === "_missingExportShim").map((e3) => ({ name: e3.exported, value: "_missingExportShim" })), t, i);
function Tn(e2, t, i) {
  return e2 ? `${t}${Sn(e2, i)}` : "null";
}
var On = { amd: function(e2, { accessedGlobals: t, dependencies: i, exports: s, hasExports: n2, id: r2, indent: a2, intro: o2, isEntryFacade: l2, isModuleFacade: h2, namedExportsMode: c2, outro: u2, snippets: d2, warn: p2 }, { amd: f3, esModule: m3, externalLiveBindings: g2, freeze: y2, interop: x2, namespaceToStringTag: E2, strict: b2 }) {
  vn(p2, i);
  const v2 = i.map((e3) => `'${En(e3.id)}'`), S2 = i.map((e3) => e3.name), { n: A2, getNonArrowFunctionIntro: I2, _: k2 } = d2;
  c2 && n2 && (S2.unshift("exports"), v2.unshift("'exports'")), t.has("require") && (S2.unshift("require"), v2.unshift("'require'")), t.has("module") && (S2.unshift("module"), v2.unshift("'module'"));
  const P2 = dn(f3, r2), w2 = (P2 ? `'${P2}',${k2}` : "") + (v2.length ? `[${v2.join(`,${k2}`)}],${k2}` : ""), C2 = b2 ? `${k2}'use strict';` : "";
  e2.prepend(`${o2}${xn(i, x2, g2, y2, E2, t, a2, d2)}`);
  const _2 = pn(s, i, c2, x2, d2, a2, g2);
  let N2 = gn(c2 && n2, l2 && m3, h2 && E2, d2);
  return N2 && (N2 = A2 + A2 + N2), e2.append(`${_2}${N2}${u2}`), e2.indent(a2).prepend(`${f3.define}(${w2}(${I2(S2, { isAsync: false, name: null })}{${C2}${A2}${A2}`).append(`${A2}${A2}}));`);
}, cjs: function(e2, { accessedGlobals: t, dependencies: i, exports: s, hasExports: n2, indent: r2, intro: a2, isEntryFacade: o2, isModuleFacade: l2, namedExportsMode: h2, outro: c2, snippets: u2 }, { compact: d2, esModule: p2, externalLiveBindings: f3, freeze: m3, interop: g2, namespaceToStringTag: y2, strict: x2 }) {
  const { _: E2, n: b2 } = u2, v2 = x2 ? `'use strict';${b2}${b2}` : "";
  let S2 = gn(h2 && n2, o2 && p2, l2 && y2, u2);
  S2 && (S2 += b2 + b2);
  const A2 = function(e3, { _: t2, cnst: i2, n: s2 }, n3) {
    let r3 = "", a3 = false;
    for (const { id: o3, name: l3, reexports: h3, imports: c3 } of e3)
      h3 || c3 ? (r3 += n3 && a3 ? "," : `${r3 ? `;${s2}` : ""}${i2} `, a3 = true, r3 += `${l3}${t2}=${t2}require('${o3}')`) : (r3 && (r3 += n3 && !a3 ? "," : `;${s2}`), a3 = false, r3 += `require('${o3}')`);
    if (r3)
      return `${r3};${s2}${s2}`;
    return "";
  }(i, u2, d2), I2 = xn(i, g2, f3, m3, y2, t, r2, u2);
  e2.prepend(`${v2}${a2}${S2}${A2}${I2}`);
  const k2 = pn(s, i, h2, g2, u2, r2, f3, `module.exports${E2}=${E2}`);
  return e2.append(`${k2}${c2}`);
}, es: function(e2, { accessedGlobals: t, indent: i, intro: s, outro: n2, dependencies: r2, exports: a2, snippets: o2 }, { externalLiveBindings: l2, freeze: h2, namespaceToStringTag: c2 }) {
  const { _: u2, n: d2 } = o2, p2 = function(e3, t2) {
    const i2 = [];
    for (const { id: s2, reexports: n3, imports: r3, name: a3 } of e3)
      if (n3 || r3) {
        if (r3) {
          let e4 = null, n4 = null;
          const a4 = [];
          for (const t3 of r3)
            t3.imported === "default" ? e4 = t3 : t3.imported === "*" ? n4 = t3 : a4.push(t3);
          n4 && i2.push(`import${t2}*${t2}as ${n4.local} from${t2}'${s2}';`), e4 && a4.length === 0 ? i2.push(`import ${e4.local} from${t2}'${s2}';`) : a4.length > 0 && i2.push(`import ${e4 ? `${e4.local},${t2}` : ""}{${t2}${a4.map((e5) => e5.imported === e5.local ? e5.imported : `${e5.imported} as ${e5.local}`).join(`,${t2}`)}${t2}}${t2}from${t2}'${s2}';`);
        }
        if (n3) {
          let e4 = null;
          const o3 = [], l3 = [];
          for (const t3 of n3)
            t3.reexported === "*" ? e4 = t3 : t3.imported === "*" ? o3.push(t3) : l3.push(t3);
          if (e4 && i2.push(`export${t2}*${t2}from${t2}'${s2}';`), o3.length > 0) {
            r3 && r3.some((e5) => e5.imported === "*" && e5.local === a3) || i2.push(`import${t2}*${t2}as ${a3} from${t2}'${s2}';`);
            for (const e5 of o3)
              i2.push(`export${t2}{${t2}${a3 === e5.reexported ? a3 : `${a3} as ${e5.reexported}`} };`);
          }
          l3.length > 0 && i2.push(`export${t2}{${t2}${l3.map((e5) => e5.imported === e5.reexported ? e5.imported : `${e5.imported} as ${e5.reexported}`).join(`,${t2}`)}${t2}}${t2}from${t2}'${s2}';`);
        }
      } else
        i2.push(`import${t2}'${s2}';`);
    return i2;
  }(r2, u2);
  p2.length > 0 && (s += p2.join(d2) + d2 + d2), (s += ns(null, t, i, o2, l2, h2, c2)) && e2.prepend(s);
  const f3 = function(e3, { _: t2, cnst: i2 }) {
    const s2 = [], n3 = [];
    for (const r3 of e3)
      r3.expression && s2.push(`${i2} ${r3.local}${t2}=${t2}${r3.expression};`), n3.push(r3.exported === r3.local ? r3.local : `${r3.local} as ${r3.exported}`);
    n3.length && s2.push(`export${t2}{${t2}${n3.join(`,${t2}`)}${t2}};`);
    return s2;
  }(a2, o2);
  return f3.length && e2.append(d2 + d2 + f3.join(d2).trim()), n2 && e2.append(n2), e2.trim();
}, iife: function(e2, { accessedGlobals: t, dependencies: i, exports: s, hasExports: n2, indent: r2, intro: a2, namedExportsMode: o2, outro: l2, snippets: h2, warn: c2 }, { compact: u2, esModule: d2, extend: p2, freeze: f3, externalLiveBindings: m3, globals: g2, interop: y2, name: x2, namespaceToStringTag: E2, strict: b2 }) {
  const { _: v2, cnst: S2, getNonArrowFunctionIntro: A2, getPropertyAccess: I2, n: k2 } = h2, P2 = x2 && x2.includes("."), w2 = !p2 && !P2;
  if (x2 && w2 && (_e(C2 = x2) || we.has(C2) || Ce.test(C2)))
    return pe({ code: "ILLEGAL_IDENTIFIER_AS_NAME", message: `Given name "${x2}" is not a legal JS identifier. If you need this, you can try "output.extend: true".` });
  var C2;
  vn(c2, i);
  const _2 = In(i), N2 = _2.map((e3) => e3.globalName || "null"), $2 = _2.map((e3) => e3.name);
  n2 && !x2 && c2({ code: "MISSING_NAME_OPTION_FOR_IIFE_EXPORT", message: 'If you do not supply "output.name", you may not be able to access the exports of an IIFE bundle.' }), o2 && n2 && (p2 ? (N2.unshift(`this${Sn(x2, I2)}${v2}=${v2}this${Sn(x2, I2)}${v2}||${v2}{}`), $2.unshift("exports")) : (N2.unshift("{}"), $2.unshift("exports")));
  const T2 = b2 ? `${r2}'use strict';${k2}` : "", O2 = xn(i, y2, m3, f3, E2, t, r2, h2);
  e2.prepend(`${a2}${O2}`);
  let R2 = `(${A2($2, { isAsync: false, name: null })}{${k2}${T2}${k2}`;
  n2 && (!x2 || p2 && o2 || (R2 = (w2 ? `${S2} ${x2}` : `this${Sn(x2, I2)}`) + `${v2}=${v2}${R2}`), P2 && (R2 = function(e3, t2, i2, { _: s2, getPropertyAccess: n3, s: r3 }, a3) {
    const o3 = e3.split(".");
    o3[0] = (typeof i2 == "function" ? i2(o3[0]) : i2[o3[0]]) || o3[0], o3.pop();
    let l3 = t2;
    return o3.map((e4) => (l3 += n3(e4), `${l3}${s2}=${s2}${l3}${s2}||${s2}{}${r3}`)).join(a3 ? "," : "\n") + (a3 && o3.length ? ";" : "\n");
  }(x2, "this", g2, h2, u2) + R2));
  let M2 = `${k2}${k2}})(${N2.join(`,${v2}`)});`;
  n2 && !p2 && o2 && (M2 = `${k2}${k2}${r2}return exports;${M2}`);
  const D2 = pn(s, i, o2, y2, h2, r2, m3);
  let L2 = gn(o2 && n2, d2, E2, h2);
  return L2 && (L2 = k2 + k2 + L2), e2.append(`${D2}${L2}${l2}`), e2.indent(r2).prepend(R2).append(M2);
}, system: function(e2, { accessedGlobals: t, dependencies: i, exports: s, hasExports: n2, indent: r2, intro: a2, snippets: o2, outro: l2, usesTopLevelAwait: h2 }, { externalLiveBindings: c2, freeze: u2, name: d2, namespaceToStringTag: p2, strict: f3, systemNullSetters: m3 }) {
  const { _: g2, getFunctionIntro: y2, getNonArrowFunctionIntro: x2, n: E2, s: b2 } = o2, { importBindings: v2, setters: S2, starExcludes: A2 } = function(e3, t2, i2, { _: s2, cnst: n3, getObject: r3, getPropertyAccess: a3, n: o3 }) {
    const l3 = [], h3 = [];
    let c3 = null;
    for (const { imports: u3, reexports: d3 } of e3) {
      const p3 = [];
      if (u3)
        for (const e4 of u3)
          l3.push(e4.local), e4.imported === "*" ? p3.push(`${e4.local}${s2}=${s2}module;`) : p3.push(`${e4.local}${s2}=${s2}module${a3(e4.imported)};`);
      if (d3) {
        const o4 = [];
        let l4 = false;
        for (const { imported: e4, reexported: t3 } of d3)
          t3 === "*" ? l4 = true : o4.push([t3, e4 === "*" ? "module" : `module${a3(e4)}`]);
        if (o4.length > 1 || l4) {
          const a4 = r3(o4, { lineBreakIndent: null });
          l4 ? (c3 || (c3 = kn({ dependencies: e3, exports: t2 })), p3.push(`${n3} setter${s2}=${s2}${a4};`, `for${s2}(${n3} name in module)${s2}{`, `${i2}if${s2}(!_starExcludes[name])${s2}setter[name]${s2}=${s2}module[name];`, "}", "exports(setter);")) : p3.push(`exports(${a4});`);
        } else {
          const [e4, t3] = o4[0];
          p3.push(`exports('${e4}',${s2}${t3});`);
        }
      }
      h3.push(p3.join(`${o3}${i2}${i2}${i2}`));
    }
    return { importBindings: l3, setters: h3, starExcludes: c3 };
  }(i, s, r2, o2), I2 = d2 ? `'${d2}',${g2}` : "", k2 = t.has("module") ? ["exports", "module"] : n2 ? ["exports"] : [];
  let P2 = `System.register(${I2}[` + i.map(({ id: e3 }) => `'${e3}'`).join(`,${g2}`) + `],${g2}(${x2(k2, { isAsync: false, name: null })}{${E2}${r2}${f3 ? "'use strict';" : ""}` + Pn(A2, r2, o2) + wn(v2, r2, o2) + `${E2}${r2}return${g2}{${S2.length ? `${E2}${r2}${r2}setters:${g2}[${S2.map((e3) => e3 ? `${y2(["module"], { isAsync: false, name: null })}{${E2}${r2}${r2}${r2}${e3}${E2}${r2}${r2}}` : m3 ? "null" : `${y2([], { isAsync: false, name: null })}{}`).join(`,${g2}`)}],` : ""}${E2}`;
  P2 += `${r2}${r2}execute:${g2}(${x2([], { isAsync: h2, name: null })}{${E2}${E2}`;
  const w2 = `${r2}${r2}})${E2}${r2}}${b2}${E2}}));`;
  return e2.prepend(a2 + ns(null, t, r2, o2, c2, u2, p2) + Cn(s, r2, o2)), e2.append(`${l2}${E2}${E2}` + Nn(s, r2, o2) + $n(s, r2, o2)), e2.indent(`${r2}${r2}${r2}`).append(w2).prepend(P2);
}, umd: function(e2, { accessedGlobals: t, dependencies: i, exports: s, hasExports: n2, id: r2, indent: a2, intro: o2, namedExportsMode: l2, outro: h2, snippets: c2, warn: u2 }, { amd: d2, compact: p2, esModule: f3, extend: m3, externalLiveBindings: g2, freeze: y2, interop: x2, name: E2, namespaceToStringTag: b2, globals: v2, noConflict: S2, strict: A2 }) {
  const { _: I2, cnst: k2, getFunctionIntro: P2, getNonArrowFunctionIntro: w2, getPropertyAccess: C2, n: _2, s: N2 } = c2, $2 = p2 ? "f" : "factory", T2 = p2 ? "g" : "global";
  if (n2 && !E2)
    return pe({ code: "MISSING_NAME_OPTION_FOR_IIFE_EXPORT", message: 'You must supply "output.name" for UMD bundles that have exports so that the exports are accessible in environments without a module loader.' });
  vn(u2, i);
  const O2 = i.map((e3) => `'${En(e3.id)}'`), R2 = i.map((e3) => `require('${e3.id}')`), M2 = In(i), D2 = M2.map((e3) => Tn(e3.globalName, T2, C2)), L2 = M2.map((e3) => e3.name);
  l2 && (n2 || S2) && (O2.unshift("'exports'"), R2.unshift("exports"), D2.unshift(An(E2, T2, v2, (m3 ? `${Tn(E2, T2, C2)}${I2}||${I2}` : "") + "{}", c2)), L2.unshift("exports"));
  const V2 = dn(d2, r2), B2 = (V2 ? `'${V2}',${I2}` : "") + (O2.length ? `[${O2.join(`,${I2}`)}],${I2}` : ""), F2 = d2.define, z2 = !l2 && n2 ? `module.exports${I2}=${I2}` : "", j2 = A2 ? `${I2}'use strict';${_2}` : "";
  let U2;
  if (S2) {
    const e3 = p2 ? "e" : "exports";
    let t2;
    if (!l2 && n2)
      t2 = `${k2} ${e3}${I2}=${I2}${An(E2, T2, v2, `${$2}(${D2.join(`,${I2}`)})`, c2)};`;
    else {
      t2 = `${k2} ${e3}${I2}=${I2}${D2.shift()};${_2}${a2}${a2}${$2}(${[e3].concat(D2).join(`,${I2}`)});`;
    }
    U2 = `(${P2([], { isAsync: false, name: null })}{${_2}${a2}${a2}${k2} current${I2}=${I2}${function(e4, t3, { _: i2, getPropertyAccess: s2 }) {
      let n3 = t3;
      return e4.split(".").map((e5) => n3 += s2(e5)).join(`${i2}&&${i2}`);
    }(E2, T2, c2)};${_2}${a2}${a2}${t2}${_2}${a2}${a2}${e3}.noConflict${I2}=${I2}${P2([], { isAsync: false, name: null })}{${I2}${Tn(E2, T2, C2)}${I2}=${I2}current;${I2}return ${e3}${N2}${I2}};${_2}${a2}})()`;
  } else
    U2 = `${$2}(${D2.join(`,${I2}`)})`, !l2 && n2 && (U2 = An(E2, T2, v2, U2, c2));
  const G2 = n2 || S2 && l2 || D2.length > 0, H2 = [$2];
  G2 && H2.unshift(T2);
  const W2 = G2 ? `this,${I2}` : "", q2 = G2 ? `(${T2}${I2}=${I2}typeof globalThis${I2}!==${I2}'undefined'${I2}?${I2}globalThis${I2}:${I2}${T2}${I2}||${I2}self,${I2}` : "", K2 = G2 ? ")" : "", X2 = G2 ? `${a2}typeof exports${I2}===${I2}'object'${I2}&&${I2}typeof module${I2}!==${I2}'undefined'${I2}?${I2}${z2}${$2}(${R2.join(`,${I2}`)})${I2}:${_2}` : "", Y2 = `(${w2(H2, { isAsync: false, name: null })}{${_2}` + X2 + `${a2}typeof ${F2}${I2}===${I2}'function'${I2}&&${I2}${F2}.amd${I2}?${I2}${F2}(${B2}${$2})${I2}:${_2}${a2}${q2}${U2}${K2};${_2}})(${W2}(${w2(L2, { isAsync: false, name: null })}{${j2}${_2}`, Q2 = _2 + _2 + "}));";
  e2.prepend(`${o2}${xn(i, x2, g2, y2, b2, t, a2, c2)}`);
  const Z2 = pn(s, i, l2, x2, c2, a2, g2);
  let J2 = gn(l2 && n2, f3, b2, c2);
  return J2 && (J2 = _2 + _2 + J2), e2.append(`${Z2}${J2}${h2}`), e2.trim().indent(a2).append(Q2).prepend(Y2);
} };
class Rn {
  constructor(e2, t) {
    this.isOriginal = true, this.filename = e2, this.content = t;
  }
  traceSegment(e2, t, i) {
    return { column: t, line: e2, name: i, source: this };
  }
}
class Mn {
  constructor(e2, t) {
    this.sources = t, this.names = e2.names, this.mappings = e2.mappings;
  }
  traceMappings() {
    const e2 = [], t = /* @__PURE__ */ new Map(), i = [], s = [], n2 = /* @__PURE__ */ new Map(), r2 = [];
    for (const a2 of this.mappings) {
      const o2 = [];
      for (const r3 of a2) {
        if (r3.length === 1)
          continue;
        const a3 = this.sources[r3[1]];
        if (!a3)
          continue;
        const l2 = a3.traceSegment(r3[2], r3[3], r3.length === 5 ? this.names[r3[4]] : "");
        if (l2) {
          const { column: a4, line: h2, name: c2, source: { content: u2, filename: d2 } } = l2;
          let p2 = t.get(d2);
          if (p2 === void 0)
            p2 = e2.length, e2.push(d2), t.set(d2, p2), i[p2] = u2;
          else if (i[p2] == null)
            i[p2] = u2;
          else if (u2 != null && i[p2] !== u2)
            return pe({ message: `Multiple conflicting contents for sourcemap source ${d2}` });
          const f3 = [r3[0], p2, h2, a4];
          if (c2) {
            let e3 = n2.get(c2);
            e3 === void 0 && (e3 = s.length, s.push(c2), n2.set(c2, e3)), f3[4] = e3;
          }
          o2.push(f3);
        }
      }
      r2.push(o2);
    }
    return { mappings: r2, names: s, sources: e2, sourcesContent: i };
  }
  traceSegment(e2, t, i) {
    const s = this.mappings[e2];
    if (!s)
      return null;
    let n2 = 0, r2 = s.length - 1;
    for (; n2 <= r2; ) {
      const e3 = n2 + r2 >> 1, a2 = s[e3];
      if (a2[0] === t || n2 === r2) {
        if (a2.length == 1)
          return null;
        const e4 = this.sources[a2[1]];
        return e4 ? e4.traceSegment(a2[2], a2[3], a2.length === 5 ? this.names[a2[4]] : i) : null;
      }
      a2[0] > t ? r2 = e3 - 1 : n2 = e3 + 1;
    }
    return null;
  }
}
function Dn(e2) {
  return function(t, i) {
    return i.mappings ? new Mn(i, [t]) : (e2({ code: "SOURCEMAP_BROKEN", message: `Sourcemap is likely to be incorrect: a plugin (${i.plugin}) was used to transform files, but didn't generate a sourcemap for the transformation. Consult the plugin documentation for help`, plugin: i.plugin, url: "https://rollupjs.org/guide/en/#warning-sourcemap-is-likely-to-be-incorrect" }), new Mn({ mappings: [], names: [] }, [t]));
  };
}
function Ln(e2, t, i, s, n2) {
  let r2;
  if (i) {
    const t2 = i.sources, s2 = i.sourcesContent || [], n3 = N(e2) || ".", a2 = i.sourceRoot || ".", o2 = t2.map((e3, t3) => new Rn(O(n3, a2, e3), s2[t3]));
    r2 = new Mn(i, o2);
  } else
    r2 = new Rn(e2, t);
  return s.reduce(n2, r2);
}
var Vn = {}, Bn = Fn;
function Fn(e2, t) {
  if (!e2)
    throw new Error(t || "Assertion failed");
}
Fn.equal = function(e2, t, i) {
  if (e2 != t)
    throw new Error(i || "Assertion failed: " + e2 + " != " + t);
};
var zn = { exports: {} };
typeof Object.create == "function" ? zn.exports = function(e2, t) {
  t && (e2.super_ = t, e2.prototype = Object.create(t.prototype, { constructor: { value: e2, enumerable: false, writable: true, configurable: true } }));
} : zn.exports = function(e2, t) {
  if (t) {
    e2.super_ = t;
    var i = function() {
    };
    i.prototype = t.prototype, e2.prototype = new i(), e2.prototype.constructor = e2;
  }
};
var jn = Bn, Un = zn.exports;
function Gn(e2, t) {
  return (64512 & e2.charCodeAt(t)) == 55296 && (!(t < 0 || t + 1 >= e2.length) && (64512 & e2.charCodeAt(t + 1)) == 56320);
}
function Hn(e2) {
  return (e2 >>> 24 | e2 >>> 8 & 65280 | e2 << 8 & 16711680 | (255 & e2) << 24) >>> 0;
}
function Wn(e2) {
  return e2.length === 1 ? "0" + e2 : e2;
}
function qn(e2) {
  return e2.length === 7 ? "0" + e2 : e2.length === 6 ? "00" + e2 : e2.length === 5 ? "000" + e2 : e2.length === 4 ? "0000" + e2 : e2.length === 3 ? "00000" + e2 : e2.length === 2 ? "000000" + e2 : e2.length === 1 ? "0000000" + e2 : e2;
}
Vn.inherits = Un, Vn.toArray = function(e2, t) {
  if (Array.isArray(e2))
    return e2.slice();
  if (!e2)
    return [];
  var i = [];
  if (typeof e2 == "string")
    if (t) {
      if (t === "hex")
        for ((e2 = e2.replace(/[^a-z0-9]+/gi, "")).length % 2 != 0 && (e2 = "0" + e2), n2 = 0; n2 < e2.length; n2 += 2)
          i.push(parseInt(e2[n2] + e2[n2 + 1], 16));
    } else
      for (var s = 0, n2 = 0; n2 < e2.length; n2++) {
        var r2 = e2.charCodeAt(n2);
        r2 < 128 ? i[s++] = r2 : r2 < 2048 ? (i[s++] = r2 >> 6 | 192, i[s++] = 63 & r2 | 128) : Gn(e2, n2) ? (r2 = 65536 + ((1023 & r2) << 10) + (1023 & e2.charCodeAt(++n2)), i[s++] = r2 >> 18 | 240, i[s++] = r2 >> 12 & 63 | 128, i[s++] = r2 >> 6 & 63 | 128, i[s++] = 63 & r2 | 128) : (i[s++] = r2 >> 12 | 224, i[s++] = r2 >> 6 & 63 | 128, i[s++] = 63 & r2 | 128);
      }
  else
    for (n2 = 0; n2 < e2.length; n2++)
      i[n2] = 0 | e2[n2];
  return i;
}, Vn.toHex = function(e2) {
  for (var t = "", i = 0; i < e2.length; i++)
    t += Wn(e2[i].toString(16));
  return t;
}, Vn.htonl = Hn, Vn.toHex32 = function(e2, t) {
  for (var i = "", s = 0; s < e2.length; s++) {
    var n2 = e2[s];
    t === "little" && (n2 = Hn(n2)), i += qn(n2.toString(16));
  }
  return i;
}, Vn.zero2 = Wn, Vn.zero8 = qn, Vn.join32 = function(e2, t, i, s) {
  var n2 = i - t;
  jn(n2 % 4 == 0);
  for (var r2 = new Array(n2 / 4), a2 = 0, o2 = t; a2 < r2.length; a2++, o2 += 4) {
    var l2;
    l2 = s === "big" ? e2[o2] << 24 | e2[o2 + 1] << 16 | e2[o2 + 2] << 8 | e2[o2 + 3] : e2[o2 + 3] << 24 | e2[o2 + 2] << 16 | e2[o2 + 1] << 8 | e2[o2], r2[a2] = l2 >>> 0;
  }
  return r2;
}, Vn.split32 = function(e2, t) {
  for (var i = new Array(4 * e2.length), s = 0, n2 = 0; s < e2.length; s++, n2 += 4) {
    var r2 = e2[s];
    t === "big" ? (i[n2] = r2 >>> 24, i[n2 + 1] = r2 >>> 16 & 255, i[n2 + 2] = r2 >>> 8 & 255, i[n2 + 3] = 255 & r2) : (i[n2 + 3] = r2 >>> 24, i[n2 + 2] = r2 >>> 16 & 255, i[n2 + 1] = r2 >>> 8 & 255, i[n2] = 255 & r2);
  }
  return i;
}, Vn.rotr32 = function(e2, t) {
  return e2 >>> t | e2 << 32 - t;
}, Vn.rotl32 = function(e2, t) {
  return e2 << t | e2 >>> 32 - t;
}, Vn.sum32 = function(e2, t) {
  return e2 + t >>> 0;
}, Vn.sum32_3 = function(e2, t, i) {
  return e2 + t + i >>> 0;
}, Vn.sum32_4 = function(e2, t, i, s) {
  return e2 + t + i + s >>> 0;
}, Vn.sum32_5 = function(e2, t, i, s, n2) {
  return e2 + t + i + s + n2 >>> 0;
}, Vn.sum64 = function(e2, t, i, s) {
  var n2 = e2[t], r2 = s + e2[t + 1] >>> 0, a2 = (r2 < s ? 1 : 0) + i + n2;
  e2[t] = a2 >>> 0, e2[t + 1] = r2;
}, Vn.sum64_hi = function(e2, t, i, s) {
  return (t + s >>> 0 < t ? 1 : 0) + e2 + i >>> 0;
}, Vn.sum64_lo = function(e2, t, i, s) {
  return t + s >>> 0;
}, Vn.sum64_4_hi = function(e2, t, i, s, n2, r2, a2, o2) {
  var l2 = 0, h2 = t;
  return l2 += (h2 = h2 + s >>> 0) < t ? 1 : 0, l2 += (h2 = h2 + r2 >>> 0) < r2 ? 1 : 0, e2 + i + n2 + a2 + (l2 += (h2 = h2 + o2 >>> 0) < o2 ? 1 : 0) >>> 0;
}, Vn.sum64_4_lo = function(e2, t, i, s, n2, r2, a2, o2) {
  return t + s + r2 + o2 >>> 0;
}, Vn.sum64_5_hi = function(e2, t, i, s, n2, r2, a2, o2, l2, h2) {
  var c2 = 0, u2 = t;
  return c2 += (u2 = u2 + s >>> 0) < t ? 1 : 0, c2 += (u2 = u2 + r2 >>> 0) < r2 ? 1 : 0, c2 += (u2 = u2 + o2 >>> 0) < o2 ? 1 : 0, e2 + i + n2 + a2 + l2 + (c2 += (u2 = u2 + h2 >>> 0) < h2 ? 1 : 0) >>> 0;
}, Vn.sum64_5_lo = function(e2, t, i, s, n2, r2, a2, o2, l2, h2) {
  return t + s + r2 + o2 + h2 >>> 0;
}, Vn.rotr64_hi = function(e2, t, i) {
  return (t << 32 - i | e2 >>> i) >>> 0;
}, Vn.rotr64_lo = function(e2, t, i) {
  return (e2 << 32 - i | t >>> i) >>> 0;
}, Vn.shr64_hi = function(e2, t, i) {
  return e2 >>> i;
}, Vn.shr64_lo = function(e2, t, i) {
  return (e2 << 32 - i | t >>> i) >>> 0;
};
var Kn = {}, Xn = Vn, Yn = Bn;
function Qn() {
  this.pending = null, this.pendingTotal = 0, this.blockSize = this.constructor.blockSize, this.outSize = this.constructor.outSize, this.hmacStrength = this.constructor.hmacStrength, this.padLength = this.constructor.padLength / 8, this.endian = "big", this._delta8 = this.blockSize / 8, this._delta32 = this.blockSize / 32;
}
Kn.BlockHash = Qn, Qn.prototype.update = function(e2, t) {
  if (e2 = Xn.toArray(e2, t), this.pending ? this.pending = this.pending.concat(e2) : this.pending = e2, this.pendingTotal += e2.length, this.pending.length >= this._delta8) {
    var i = (e2 = this.pending).length % this._delta8;
    this.pending = e2.slice(e2.length - i, e2.length), this.pending.length === 0 && (this.pending = null), e2 = Xn.join32(e2, 0, e2.length - i, this.endian);
    for (var s = 0; s < e2.length; s += this._delta32)
      this._update(e2, s, s + this._delta32);
  }
  return this;
}, Qn.prototype.digest = function(e2) {
  return this.update(this._pad()), Yn(this.pending === null), this._digest(e2);
}, Qn.prototype._pad = function() {
  var e2 = this.pendingTotal, t = this._delta8, i = t - (e2 + this.padLength) % t, s = new Array(i + this.padLength);
  s[0] = 128;
  for (var n2 = 1; n2 < i; n2++)
    s[n2] = 0;
  if (e2 <<= 3, this.endian === "big") {
    for (var r2 = 8; r2 < this.padLength; r2++)
      s[n2++] = 0;
    s[n2++] = 0, s[n2++] = 0, s[n2++] = 0, s[n2++] = 0, s[n2++] = e2 >>> 24 & 255, s[n2++] = e2 >>> 16 & 255, s[n2++] = e2 >>> 8 & 255, s[n2++] = 255 & e2;
  } else
    for (s[n2++] = 255 & e2, s[n2++] = e2 >>> 8 & 255, s[n2++] = e2 >>> 16 & 255, s[n2++] = e2 >>> 24 & 255, s[n2++] = 0, s[n2++] = 0, s[n2++] = 0, s[n2++] = 0, r2 = 8; r2 < this.padLength; r2++)
      s[n2++] = 0;
  return s;
};
var Zn = {}, Jn = Vn.rotr32;
function er(e2, t, i) {
  return e2 & t ^ ~e2 & i;
}
function tr(e2, t, i) {
  return e2 & t ^ e2 & i ^ t & i;
}
function ir(e2, t, i) {
  return e2 ^ t ^ i;
}
Zn.ft_1 = function(e2, t, i, s) {
  return e2 === 0 ? er(t, i, s) : e2 === 1 || e2 === 3 ? ir(t, i, s) : e2 === 2 ? tr(t, i, s) : void 0;
}, Zn.ch32 = er, Zn.maj32 = tr, Zn.p32 = ir, Zn.s0_256 = function(e2) {
  return Jn(e2, 2) ^ Jn(e2, 13) ^ Jn(e2, 22);
}, Zn.s1_256 = function(e2) {
  return Jn(e2, 6) ^ Jn(e2, 11) ^ Jn(e2, 25);
}, Zn.g0_256 = function(e2) {
  return Jn(e2, 7) ^ Jn(e2, 18) ^ e2 >>> 3;
}, Zn.g1_256 = function(e2) {
  return Jn(e2, 17) ^ Jn(e2, 19) ^ e2 >>> 10;
};
var sr = Vn, nr = Kn, rr = Zn, ar = Bn, or = sr.sum32, lr = sr.sum32_4, hr = sr.sum32_5, cr = rr.ch32, ur = rr.maj32, dr = rr.s0_256, pr = rr.s1_256, fr = rr.g0_256, mr = rr.g1_256, gr = nr.BlockHash, yr = [1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298];
function xr() {
  if (!(this instanceof xr))
    return new xr();
  gr.call(this), this.h = [1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225], this.k = yr, this.W = new Array(64);
}
sr.inherits(xr, gr);
var Er = xr;
xr.blockSize = 512, xr.outSize = 256, xr.hmacStrength = 192, xr.padLength = 64, xr.prototype._update = function(e2, t) {
  for (var i = this.W, s = 0; s < 16; s++)
    i[s] = e2[t + s];
  for (; s < i.length; s++)
    i[s] = lr(mr(i[s - 2]), i[s - 7], fr(i[s - 15]), i[s - 16]);
  var n2 = this.h[0], r2 = this.h[1], a2 = this.h[2], o2 = this.h[3], l2 = this.h[4], h2 = this.h[5], c2 = this.h[6], u2 = this.h[7];
  for (ar(this.k.length === i.length), s = 0; s < i.length; s++) {
    var d2 = hr(u2, pr(l2), cr(l2, h2, c2), this.k[s], i[s]), p2 = or(dr(n2), ur(n2, r2, a2));
    u2 = c2, c2 = h2, h2 = l2, l2 = or(o2, d2), o2 = a2, a2 = r2, r2 = n2, n2 = or(d2, p2);
  }
  this.h[0] = or(this.h[0], n2), this.h[1] = or(this.h[1], r2), this.h[2] = or(this.h[2], a2), this.h[3] = or(this.h[3], o2), this.h[4] = or(this.h[4], l2), this.h[5] = or(this.h[5], h2), this.h[6] = or(this.h[6], c2), this.h[7] = or(this.h[7], u2);
}, xr.prototype._digest = function(e2) {
  return e2 === "hex" ? sr.toHex32(this.h, "big") : sr.split32(this.h, "big");
};
var br = Er;
const vr = () => br(), Sr = { amd: kr, cjs: kr, es: Ir, iife: kr, system: Ir, umd: kr };
function Ar(e2, t, i, s, n2, r2, a2, o2, l2, h2, c2, u2, d2) {
  const p2 = e2.slice().reverse();
  for (const e3 of p2)
    e3.scope.addUsedOutsideNames(s, n2, c2, u2);
  !function(e3, t2, i2) {
    for (const s2 of t2) {
      for (const t3 of s2.scope.variables.values())
        t3.included && !(t3.renderBaseName || t3 instanceof Ms && t3.getOriginalVariable() !== t3) && t3.setRenderNames(null, Vt(t3.name, e3));
      if (i2.has(s2)) {
        const t3 = s2.namespace;
        t3.setRenderNames(null, Vt(t3.name, e3));
      }
    }
  }(s, p2, d2), Sr[n2](s, i, t, r2, a2, o2, l2, h2);
  for (const e3 of p2)
    e3.scope.deconflict(n2, c2, u2);
}
function Ir(e2, t, i, s, n2, r2, a2, o2) {
  for (const t2 of i.dependencies)
    (n2 || t2 instanceof $e) && (t2.variableName = Vt(t2.suggestedVariableName, e2));
  for (const i2 of t) {
    const t2 = i2.module, s2 = i2.name;
    i2.isNamespace && (n2 || t2 instanceof $e) ? i2.setRenderNames(null, (t2 instanceof $e ? t2 : a2.get(t2)).variableName) : t2 instanceof $e && s2 === "default" ? i2.setRenderNames(null, Vt([...t2.exportedVariables].some(([e3, t3]) => t3 === "*" && e3.included) ? t2.suggestedVariableName + "__default" : t2.suggestedVariableName, e2)) : i2.setRenderNames(null, Vt(s2, e2));
  }
  for (const t2 of o2)
    t2.setRenderNames(null, Vt(t2.name, e2));
}
function kr(e2, t, { deconflictedDefault: i, deconflictedNamespace: s, dependencies: n2 }, r2, a2, o2, l2) {
  for (const t2 of n2)
    t2.variableName = Vt(t2.suggestedVariableName, e2);
  for (const t2 of s)
    t2.namespaceVariableName = Vt(`${t2.suggestedVariableName}__namespace`, e2);
  for (const t2 of i)
    s.has(t2) && ss(String(r2(t2.id)), o2) ? t2.defaultVariableName = t2.namespaceVariableName : t2.defaultVariableName = Vt(`${t2.suggestedVariableName}__default`, e2);
  for (const e3 of t) {
    const t2 = e3.module;
    if (t2 instanceof $e) {
      const i2 = e3.name;
      if (i2 === "default") {
        const i3 = String(r2(t2.id)), s2 = es[i3] ? t2.defaultVariableName : t2.variableName;
        ts(i3, o2) ? e3.setRenderNames(s2, "default") : e3.setRenderNames(null, s2);
      } else
        i2 === "*" ? e3.setRenderNames(null, is[String(r2(t2.id))] ? t2.namespaceVariableName : t2.variableName) : e3.setRenderNames(t2.variableName, null);
    } else {
      const i2 = l2.get(t2);
      a2 && e3.isNamespace ? e3.setRenderNames(null, i2.exportMode === "default" ? i2.namespaceVariableName : i2.variableName) : i2.exportMode === "default" ? e3.setRenderNames(null, i2.variableName) : e3.setRenderNames(i2.variableName, i2.getVariableExportName(e3));
    }
  }
}
const Pr = /[\\'\r\n\u2028\u2029]/, wr = /(['\r\n\u2028\u2029])/g, Cr = /\\/g;
function _r(e2) {
  return e2.match(Pr) ? e2.replace(Cr, "\\\\").replace(wr, "\\$1") : e2;
}
function Nr(e2, { exports: t, name: i, format: s }, n2, r2, a2) {
  const o2 = e2.getExportNames();
  if (t === "default") {
    if (o2.length !== 1 || o2[0] !== "default")
      return pe(ye("default", o2, r2));
  } else if (t === "none" && o2.length)
    return pe(ye("none", o2, r2));
  return t === "auto" && (o2.length === 0 ? t = "none" : o2.length === 1 && o2[0] === "default" ? (s === "cjs" && n2.has("exports") && a2(function(e3) {
    const t2 = he(e3);
    return { code: me.PREFER_NAMED_EXPORTS, id: e3, message: `Entry module "${t2}" is implicitly using "default" export mode, which means for CommonJS output that its default export is assigned to "module.exports". For many tools, such CommonJS output will not be interchangeable with the original ES module. If this is intended, explicitly set "output.exports" to either "auto" or "default", otherwise you might want to consider changing the signature of "${t2}" to use named exports only.`, url: "https://rollupjs.org/guide/en/#outputexports" };
  }(r2)), t = "default") : (s !== "es" && s !== "system" && o2.includes("default") && a2(function(e3, t2) {
    return { code: me.MIXED_EXPORTS, id: e3, message: `Entry module "${he(e3)}" is using named and default exports together. Consumers of your bundle will have to use \`${t2 || "chunk"}["default"]\` to access the default export, which may not be what you want. Use \`output.exports: "named"\` to disable this warning`, url: "https://rollupjs.org/guide/en/#outputexports" };
  }(r2, i)), t = "named")), t;
}
function $r(e2) {
  const t = e2.split("\n"), i = t.filter((e3) => /^\t+/.test(e3)), s = t.filter((e3) => /^ {2,}/.test(e3));
  if (i.length === 0 && s.length === 0)
    return null;
  if (i.length >= s.length)
    return "	";
  const n2 = s.reduce((e3, t2) => {
    const i2 = /^ +/.exec(t2)[0].length;
    return Math.min(i2, e3);
  }, 1 / 0);
  return new Array(n2 + 1).join(" ");
}
function Tr(e2, t, i, s, n2) {
  const r2 = e2.getDependenciesToBeIncluded();
  for (const e3 of r2) {
    if (e3 instanceof $e) {
      t.push(e3);
      continue;
    }
    const r3 = n2.get(e3);
    r3 === s ? i.has(e3) || (i.add(e3), Tr(e3, t, i, s, n2)) : t.push(r3);
  }
}
function Or(e2) {
  if (!e2)
    return null;
  if (typeof e2 == "string" && (e2 = JSON.parse(e2)), e2.mappings === "")
    return { mappings: [], names: [], sources: [], version: 3 };
  const i = typeof e2.mappings == "string" ? function(e3) {
    for (var i2 = [], s = [], r2 = [0, 0, 0, 0, 0], a2 = 0, o2 = 0, l2 = 0, h2 = 0; o2 < e3.length; o2++) {
      var c2 = e3.charCodeAt(o2);
      if (c2 === 44)
        n(s, r2, a2), a2 = 0;
      else if (c2 === 59)
        n(s, r2, a2), a2 = 0, i2.push(s), s = [], r2[0] = 0;
      else {
        var u2 = t[c2];
        if (u2 === void 0)
          throw new Error("Invalid character (" + String.fromCharCode(c2) + ")");
        var d2 = 32 & u2;
        if (h2 += (u2 &= 31) << l2, d2)
          l2 += 5;
        else {
          var p2 = 1 & h2;
          h2 >>>= 1, p2 && (h2 = h2 === 0 ? -2147483648 : -h2), r2[a2] += h2, a2++, h2 = l2 = 0;
        }
      }
    }
    return n(s, r2, a2), i2.push(s), i2;
  }(e2.mappings) : e2.mappings;
  return __spreadProps(__spreadValues({}, e2), { mappings: i });
}
function Rr(e2, t, i) {
  return ce(e2) ? pe(Ae(`Invalid pattern "${e2}" for "${t}", patterns can be neither absolute nor relative paths.`)) : e2.replace(/\[(\w+)\]/g, (e3, s) => {
    if (!i.hasOwnProperty(s))
      return pe(Ae(`"[${s}]" is not a valid placeholder in "${t}" pattern.`));
    const n2 = i[s]();
    return ce(n2) ? pe(Ae(`Invalid substitution "${n2}" for placeholder "[${s}]" in "${t}" pattern, can be neither absolute nor relative path.`)) : n2;
  });
}
function Mr(e2, t) {
  const i = new Set(Object.keys(t).map((e3) => e3.toLowerCase()));
  if (!i.has(e2.toLocaleLowerCase()))
    return e2;
  const s = $(e2);
  e2 = e2.substring(0, e2.length - s.length);
  let n2, r2 = 1;
  for (; i.has((n2 = e2 + ++r2 + s).toLowerCase()); )
    ;
  return n2;
}
const Dr = [".js", ".jsx", ".ts", ".tsx"];
function Lr(e2, t, i, s) {
  const n2 = typeof t == "function" ? t(e2.id) : t[e2.id];
  return n2 || (i ? (s({ code: "MISSING_GLOBAL_NAME", guess: e2.variableName, message: `No name was provided for external module '${e2.id}' in output.globals \u2013 guessing '${e2.variableName}'`, source: e2.id }), e2.variableName) : void 0);
}
class Vr {
  constructor(e2, t, i, s, n2, r2, a2, o2, l2, h2) {
    this.orderedModules = e2, this.inputOptions = t, this.outputOptions = i, this.unsetOptions = s, this.pluginDriver = n2, this.modulesById = r2, this.chunkByModule = a2, this.facadeChunkByModule = o2, this.includedNamespaces = l2, this.manualChunkAlias = h2, this.entryModules = [], this.exportMode = "named", this.facadeModule = null, this.id = null, this.namespaceVariableName = "", this.needsExportsShim = false, this.variableName = "", this.accessedGlobalsByScope = /* @__PURE__ */ new Map(), this.dependencies = /* @__PURE__ */ new Set(), this.dynamicDependencies = /* @__PURE__ */ new Set(), this.dynamicEntryModules = [], this.dynamicName = null, this.exportNamesByVariable = /* @__PURE__ */ new Map(), this.exports = /* @__PURE__ */ new Set(), this.exportsByName = /* @__PURE__ */ new Map(), this.fileName = null, this.implicitEntryModules = [], this.implicitlyLoadedBefore = /* @__PURE__ */ new Set(), this.imports = /* @__PURE__ */ new Set(), this.includedReexportsByModule = /* @__PURE__ */ new Map(), this.indentString = void 0, this.isEmpty = true, this.name = null, this.renderedDependencies = null, this.renderedExports = null, this.renderedHash = void 0, this.renderedModuleSources = /* @__PURE__ */ new Map(), this.renderedModules = /* @__PURE__ */ Object.create(null), this.renderedSource = null, this.sortedExportNames = null, this.strictFacade = false, this.usedModules = void 0, this.execIndex = e2.length > 0 ? e2[0].execIndex : 1 / 0;
    const c2 = new Set(e2);
    for (const t2 of e2) {
      t2.namespace.included && l2.add(t2), this.isEmpty && t2.isIncluded() && (this.isEmpty = false), (t2.info.isEntry || i.preserveModules) && this.entryModules.push(t2);
      for (const e3 of t2.includedDynamicImporters)
        c2.has(e3) || (this.dynamicEntryModules.push(t2), t2.info.syntheticNamedExports && !i.preserveModules && (l2.add(t2), this.exports.add(t2.namespace)));
      t2.implicitlyLoadedAfter.size > 0 && this.implicitEntryModules.push(t2);
    }
    this.suggestedVariableName = Ne(this.generateVariableName());
  }
  static generateFacade(e2, t, i, s, n2, r2, a2, o2, l2, h2) {
    const c2 = new Vr([], e2, t, i, s, n2, r2, a2, o2, null);
    c2.assignFacadeName(h2, l2), a2.has(l2) || a2.set(l2, c2);
    for (const e3 of l2.getDependenciesToBeIncluded())
      c2.dependencies.add(e3 instanceof ln ? r2.get(e3) : e3);
    return !c2.dependencies.has(r2.get(l2)) && l2.info.moduleSideEffects && l2.hasEffects() && c2.dependencies.add(r2.get(l2)), c2.ensureReexportsAreAvailableForModule(l2), c2.facadeModule = l2, c2.strictFacade = true, c2;
  }
  canModuleBeFacade(e2, t) {
    const i = e2.getExportNamesByVariable();
    for (const t2 of this.exports)
      if (!i.has(t2))
        return i.size === 0 && e2.isUserDefinedEntryPoint && e2.preserveSignature === "strict" && this.unsetOptions.has("preserveEntrySignatures") && this.inputOptions.onwarn({ code: "EMPTY_FACADE", id: e2.id, message: `To preserve the export signature of the entry module "${he(e2.id)}", an empty facade chunk was created. This often happens when creating a bundle for a web app where chunks are placed in script tags and exports are ignored. In this case it is recommended to set "preserveEntrySignatures: false" to avoid this and reduce the number of chunks. Otherwise if this is intentional, set "preserveEntrySignatures: 'strict'" explicitly to silence this warning.`, url: "https://rollupjs.org/guide/en/#preserveentrysignatures" }), false;
    for (const s of t)
      if (!i.has(s) && s.module !== e2)
        return false;
    return true;
  }
  generateExports() {
    this.sortedExportNames = null;
    const e2 = new Set(this.exports);
    if (this.facadeModule !== null && (this.facadeModule.preserveSignature !== false || this.strictFacade)) {
      const t = this.facadeModule.getExportNamesByVariable();
      for (const [i, s] of t) {
        this.exportNamesByVariable.set(i, [...s]);
        for (const e3 of s)
          this.exportsByName.set(e3, i);
        e2.delete(i);
      }
    }
    this.outputOptions.minifyInternalExports ? function(e3, t, i) {
      let s = 0;
      for (const n2 of e3) {
        let [e4] = n2.name;
        if (t.has(e4))
          do {
            e4 = Lt(++s), e4.charCodeAt(0) === 49 && (s += 9 * 64 ** (e4.length - 1), e4 = Lt(s));
          } while (we.has(e4) || t.has(e4));
        t.set(e4, n2), i.set(n2, [e4]);
      }
    }(e2, this.exportsByName, this.exportNamesByVariable) : function(e3, t, i) {
      for (const s of e3) {
        let e4 = 0, n2 = s.name;
        for (; t.has(n2); )
          n2 = s.name + "$" + ++e4;
        t.set(n2, s), i.set(s, [n2]);
      }
    }(e2, this.exportsByName, this.exportNamesByVariable), (this.outputOptions.preserveModules || this.facadeModule && this.facadeModule.info.isEntry) && (this.exportMode = Nr(this, this.outputOptions, this.unsetOptions, this.facadeModule.id, this.inputOptions.onwarn));
  }
  generateFacades() {
    var e2;
    const t = [], i = /* @__PURE__ */ new Set([...this.entryModules, ...this.implicitEntryModules]), s = new Set(this.dynamicEntryModules.map(({ namespace: e3 }) => e3));
    for (const e3 of i)
      if (e3.preserveSignature)
        for (const t2 of e3.getExportNamesByVariable().keys())
          s.add(t2);
    for (const e3 of i) {
      const i2 = Array.from(new Set(e3.chunkNames.filter(({ isUserDefined: e4 }) => e4).map(({ name: e4 }) => e4)), (e4) => ({ name: e4 }));
      if (i2.length === 0 && e3.isUserDefinedEntryPoint && i2.push({}), i2.push(...Array.from(e3.chunkFileNames, (e4) => ({ fileName: e4 }))), i2.length === 0 && i2.push({}), !this.facadeModule) {
        const t2 = e3.preserveSignature === "strict" || e3.preserveSignature === "exports-only" && e3.getExportNamesByVariable().size !== 0;
        (!t2 || this.outputOptions.preserveModules || this.canModuleBeFacade(e3, s)) && (this.facadeModule = e3, this.facadeChunkByModule.set(e3, this), e3.preserveSignature && (this.strictFacade = t2), this.assignFacadeName(i2.shift(), e3));
      }
      for (const s2 of i2)
        t.push(Vr.generateFacade(this.inputOptions, this.outputOptions, this.unsetOptions, this.pluginDriver, this.modulesById, this.chunkByModule, this.facadeChunkByModule, this.includedNamespaces, e3, s2));
    }
    for (const t2 of this.dynamicEntryModules)
      t2.info.syntheticNamedExports || (!this.facadeModule && this.canModuleBeFacade(t2, s) ? (this.facadeModule = t2, this.facadeChunkByModule.set(t2, this), this.strictFacade = true, this.dynamicName = Br(t2)) : this.facadeModule === t2 && !this.strictFacade && this.canModuleBeFacade(t2, s) ? this.strictFacade = true : ((e2 = this.facadeChunkByModule.get(t2)) === null || e2 === void 0 ? void 0 : e2.strictFacade) || (this.includedNamespaces.add(t2), this.exports.add(t2.namespace)));
    return this.outputOptions.preserveModules || this.addNecessaryImportsForFacades(), t;
  }
  generateId(e2, t, i, s) {
    if (this.fileName !== null)
      return this.fileName;
    const [n2, r2] = this.facadeModule && this.facadeModule.isUserDefinedEntryPoint ? [t.entryFileNames, "output.entryFileNames"] : [t.chunkFileNames, "output.chunkFileNames"];
    return Mr(Rr(typeof n2 == "function" ? n2(this.getChunkInfo()) : n2, r2, { format: () => t.format, hash: () => s ? this.computeContentHashWithDependencies(e2, t, i) : "[hash]", name: () => this.getChunkName() }), i);
  }
  generateIdPreserveModules(e2, t, i, s) {
    const [{ id: n2 }] = this.orderedModules, r2 = this.outputOptions.sanitizeFileName(n2.split(Fr, 1)[0]);
    let a2;
    const o2 = s.has("entryFileNames") ? "[name][assetExtname].js" : t.entryFileNames, l2 = typeof o2 == "function" ? o2(this.getChunkInfo()) : o2;
    if (P(r2)) {
      const i2 = N(r2), s2 = $(r2), n3 = `${i2}/${Rr(l2, "output.entryFileNames", { assetExtname: () => Dr.includes(s2) ? "" : s2, ext: () => s2.substring(1), extname: () => s2, format: () => t.format, name: () => this.getChunkName() })}`, { preserveModulesRoot: o3 } = t;
      a2 = o3 && n3.startsWith(o3) ? n3.slice(o3.length).replace(/^[\\/]/, "") : T(e2, n3);
    } else {
      const e3 = $(r2);
      a2 = `_virtual/${Rr(l2, "output.entryFileNames", { assetExtname: () => Dr.includes(e3) ? "" : e3, ext: () => e3.substring(1), extname: () => e3, format: () => t.format, name: () => le(r2) })}`;
    }
    return Mr(C(a2), i);
  }
  getChunkInfo() {
    const e2 = this.facadeModule, t = this.getChunkName.bind(this);
    return { exports: this.getExportNames(), facadeModuleId: e2 && e2.id, isDynamicEntry: this.dynamicEntryModules.length > 0, isEntry: e2 !== null && e2.info.isEntry, isImplicitEntry: this.implicitEntryModules.length > 0, modules: this.renderedModules, get name() {
      return t();
    }, type: "chunk" };
  }
  getChunkInfoWithFileNames() {
    return Object.assign(this.getChunkInfo(), { code: void 0, dynamicImports: Array.from(this.dynamicDependencies, Hs), fileName: this.id, implicitlyLoadedBefore: Array.from(this.implicitlyLoadedBefore, Hs), importedBindings: this.getImportedBindingsPerDependency(), imports: Array.from(this.dependencies, Hs), map: void 0, referencedFiles: this.getReferencedFiles() });
  }
  getChunkName() {
    var e2;
    return (e2 = this.name) !== null && e2 !== void 0 ? e2 : this.name = this.outputOptions.sanitizeFileName(this.getFallbackChunkName());
  }
  getExportNames() {
    var e2;
    return (e2 = this.sortedExportNames) !== null && e2 !== void 0 ? e2 : this.sortedExportNames = Array.from(this.exportsByName.keys()).sort();
  }
  getRenderedHash() {
    if (this.renderedHash)
      return this.renderedHash;
    const e2 = vr(), t = this.pluginDriver.hookReduceValueSync("augmentChunkHash", "", [this.getChunkInfo()], (e3, t2) => (t2 && (e3 += t2), e3));
    return e2.update(t), e2.update(this.renderedSource.toString()), e2.update(this.getExportNames().map((e3) => {
      const t2 = this.exportsByName.get(e3);
      return `${he(t2.module.id).replace(/\\/g, "/")}:${t2.name}:${e3}`;
    }).join(",")), this.renderedHash = e2.digest("hex");
  }
  getVariableExportName(e2) {
    return this.outputOptions.preserveModules && e2 instanceof js ? "*" : this.exportNamesByVariable.get(e2)[0];
  }
  link() {
    this.dependencies = function(e2, t, i) {
      const s = [], n2 = /* @__PURE__ */ new Set();
      for (let r3 = t.length - 1; r3 >= 0; r3--) {
        const a2 = t[r3];
        if (!n2.has(a2)) {
          const t2 = [];
          Tr(a2, t2, n2, e2, i), s.unshift(t2);
        }
      }
      const r2 = /* @__PURE__ */ new Set();
      for (const e3 of s)
        for (const t2 of e3)
          r2.add(t2);
      return r2;
    }(this, this.orderedModules, this.chunkByModule);
    for (const e2 of this.orderedModules)
      this.addDependenciesToChunk(e2.dynamicDependencies, this.dynamicDependencies), this.addDependenciesToChunk(e2.implicitlyLoadedBefore, this.implicitlyLoadedBefore), this.setUpChunkImportsAndExportsForModule(e2);
  }
  preRender(e2, t, i) {
    const { _: s, getPropertyAccess: n2, n: r2 } = i, a2 = new b({ separator: `${r2}${r2}` });
    this.usedModules = [], this.indentString = function(e3, t2) {
      if (t2.indent !== true)
        return t2.indent;
      for (const t3 of e3) {
        const e4 = $r(t3.originalCode);
        if (e4 !== null)
          return e4;
      }
      return "	";
    }(this.orderedModules, e2);
    const o2 = { dynamicImportFunction: e2.dynamicImportFunction, exportNamesByVariable: this.exportNamesByVariable, format: e2.format, freeze: e2.freeze, indent: this.indentString, namespaceToStringTag: e2.namespaceToStringTag, outputPluginDriver: this.pluginDriver, snippets: i };
    if (e2.hoistTransitiveImports && !this.outputOptions.preserveModules && this.facadeModule !== null)
      for (const e3 of this.dependencies)
        e3 instanceof Vr && this.inlineChunkDependencies(e3);
    this.prepareModulesForRendering(i), this.setIdentifierRenderResolutions(e2);
    let l2 = "";
    const h2 = this.renderedModules;
    for (const t2 of this.orderedModules) {
      let i2 = 0;
      if (t2.isIncluded() || this.includedNamespaces.has(t2)) {
        const s3 = t2.render(o2).trim();
        i2 = s3.length(), i2 && (e2.compact && s3.lastLine().includes("//") && s3.append("\n"), this.renderedModuleSources.set(t2, s3), a2.addSource(s3), this.usedModules.push(t2));
        const n4 = t2.namespace;
        if (this.includedNamespaces.has(t2) && !this.outputOptions.preserveModules) {
          const e3 = n4.renderBlock(o2);
          n4.renderFirst() ? l2 += r2 + e3 : a2.addSource(new x(e3));
        }
      }
      const { renderedExports: s2, removedExports: n3 } = t2.getRenderedExports(), { renderedModuleSources: c2 } = this;
      h2[t2.id] = { get code() {
        var e3, i3;
        return (i3 = (e3 = c2.get(t2)) === null || e3 === void 0 ? void 0 : e3.toString()) !== null && i3 !== void 0 ? i3 : null;
      }, originalLength: t2.originalCode.length, removedExports: n3, renderedExports: s2, renderedLength: i2 };
    }
    if (l2 && a2.prepend(l2 + r2 + r2), this.needsExportsShim && a2.prepend(`${r2}${i.cnst} _missingExportShim${s}=${s}void 0;${r2}${r2}`), e2.compact ? this.renderedSource = a2 : this.renderedSource = a2.trim(), this.renderedHash = void 0, this.isEmpty && this.getExportNames().length === 0 && this.dependencies.size === 0) {
      const e3 = this.getChunkName();
      this.inputOptions.onwarn({ chunkName: e3, code: "EMPTY_BUNDLE", message: `Generated an empty chunk: "${e3}"` });
    }
    this.setExternalRenderPaths(e2, t), this.renderedDependencies = this.getChunkDependencyDeclarations(e2, n2), this.renderedExports = this.exportMode === "none" ? [] : this.getChunkExportDeclarations(e2.format, n2);
  }
  async render(e2, t, i, s) {
    en("render format", 2);
    const n2 = e2.format, r2 = On[n2];
    e2.dynamicImportFunction && n2 !== "es" && this.inputOptions.onwarn(xe("output.dynamicImportFunction", "outputdynamicImportFunction", 'this option is ignored for formats other than "es"'));
    for (const e3 of this.dependencies) {
      const t2 = this.renderedDependencies.get(e3);
      if (e3 instanceof $e) {
        const i2 = e3.renderPath;
        t2.id = _r(e3.renormalizeRenderPath ? de(this.id, i2, false, false) : i2);
      } else
        t2.namedExportsMode = e3.exportMode !== "default", t2.id = _r(de(this.id, e3.id, false, true));
    }
    this.finaliseDynamicImports(e2, s), this.finaliseImportMetas(n2, s);
    const a2 = this.renderedExports.length !== 0 || [...this.renderedDependencies.values()].some((e3) => e3.reexports && e3.reexports.length !== 0);
    let o2 = null;
    const l2 = /* @__PURE__ */ new Set();
    for (const e3 of this.orderedModules) {
      e3.usesTopLevelAwait && (o2 = e3.id);
      const t2 = this.accessedGlobalsByScope.get(e3.scope);
      if (t2)
        for (const e4 of t2)
          l2.add(e4);
    }
    if (o2 !== null && n2 !== "es" && n2 !== "system")
      return pe({ code: "INVALID_TLA_FORMAT", id: o2, message: `Module format ${n2} does not support top-level await. Use the "es" or "system" output formats rather.` });
    if (!this.id)
      throw new Error("Internal Error: expecting chunk id");
    const c2 = r2(this.renderedSource, { accessedGlobals: l2, dependencies: [...this.renderedDependencies.values()], exports: this.renderedExports, hasExports: a2, id: this.id, indent: this.indentString, intro: t.intro, isEntryFacade: this.outputOptions.preserveModules || this.facadeModule !== null && this.facadeModule.info.isEntry, isModuleFacade: this.facadeModule !== null, namedExportsMode: this.exportMode !== "default", outro: t.outro, snippets: s, usesTopLevelAwait: o2 !== null, warn: this.inputOptions.onwarn }, e2);
    t.banner && c2.prepend(t.banner), t.footer && c2.append(t.footer);
    const u2 = c2.toString();
    tn("render format", 2);
    let d2 = null;
    const p2 = [];
    let f3 = await function({ code: e3, options: t2, outputPluginDriver: i2, renderChunk: s2, sourcemapChain: n3 }) {
      return i2.hookReduceArg0("renderChunk", [e3, s2, t2], (e4, t3, i3) => {
        if (t3 == null)
          return e4;
        if (typeof t3 == "string" && (t3 = { code: t3, map: void 0 }), t3.map !== null) {
          const e5 = Or(t3.map);
          n3.push(e5 || { missing: true, plugin: i3.name });
        }
        return t3.code;
      });
    }({ code: u2, options: e2, outputPluginDriver: this.pluginDriver, renderChunk: i, sourcemapChain: p2 });
    if (e2.sourcemap) {
      let t2;
      en("sourcemap", 2), t2 = e2.file ? O(e2.sourcemapFile || e2.file) : e2.dir ? O(e2.dir, this.id) : O(this.id);
      const i2 = c2.generateDecodedMap({});
      d2 = function(e3, t3, i3, s2, n3, r3) {
        const a3 = Dn(r3), o3 = i3.filter((e4) => !e4.excludeFromSourcemap).map((e4) => Ln(e4.id, e4.originalCode, e4.originalSourcemap, e4.sourcemapChain, a3)), l3 = new Mn(t3, o3), c3 = s2.reduce(a3, l3);
        let { sources: u3, sourcesContent: d3, names: p3, mappings: f4 } = c3.traceMappings();
        if (e3) {
          const t4 = N(e3);
          u3 = u3.map((e4) => T(t4, e4)), e3 = _(e3);
        }
        return d3 = n3 ? null : d3, new h({ file: e3, mappings: f4, names: p3, sources: u3, sourcesContent: d3 });
      }(t2, i2, this.usedModules, p2, e2.sourcemapExcludeSources, this.inputOptions.onwarn), d2.sources = d2.sources.map((i3) => {
        const { sourcemapPathTransform: s2 } = e2;
        if (s2) {
          const e3 = s2(i3, `${t2}.map`);
          return typeof e3 != "string" && pe(Ae("sourcemapPathTransform function must return a string.")), e3;
        }
        return i3;
      }).map(C), tn("sourcemap", 2);
    }
    return e2.compact || f3[f3.length - 1] === "\n" || (f3 += "\n"), { code: f3, map: d2 };
  }
  addDependenciesToChunk(e2, t) {
    for (const i of e2)
      if (i instanceof ln) {
        const e3 = this.chunkByModule.get(i);
        e3 && e3 !== this && t.add(e3);
      } else
        t.add(i);
  }
  addNecessaryImportsForFacades() {
    for (const [e2, t] of this.includedReexportsByModule)
      if (this.includedNamespaces.has(e2))
        for (const e3 of t)
          this.imports.add(e3);
  }
  assignFacadeName({ fileName: e2, name: t }, i) {
    e2 ? this.fileName = e2 : this.name = this.outputOptions.sanitizeFileName(t || Br(i));
  }
  checkCircularDependencyImport(e2, t) {
    const i = e2.module;
    if (i instanceof ln) {
      const o2 = this.chunkByModule.get(i);
      let l2;
      do {
        if (l2 = t.alternativeReexportModules.get(e2), l2) {
          const h2 = this.chunkByModule.get(l2);
          h2 && h2 !== o2 && this.inputOptions.onwarn((s = i.getExportNamesByVariable().get(e2)[0], n2 = i.id, r2 = l2.id, a2 = t.id, { code: me.CYCLIC_CROSS_CHUNK_REEXPORT, exporter: n2, importer: a2, message: `Export "${s}" of module ${he(n2)} was reexported through module ${he(r2)} while both modules are dependencies of each other and will end up in different chunks by current Rollup settings. This scenario is not well supported at the moment as it will produce a circular dependency between chunks and will likely lead to broken execution order.
Either change the import in ${he(a2)} to point directly to the exporting module or do not use "preserveModules" to ensure these modules end up in the same chunk.`, reexporter: r2 })), t = l2;
        }
      } while (l2);
    }
    var s, n2, r2, a2;
  }
  computeContentHashWithDependencies(e2, t, i) {
    const s = vr();
    s.update([e2.intro, e2.outro, e2.banner, e2.footer].join(":")), s.update(t.format);
    const n2 = /* @__PURE__ */ new Set([this]);
    for (const r2 of n2)
      if (r2 instanceof $e ? s.update(`:${r2.renderPath}`) : (s.update(r2.getRenderedHash()), s.update(r2.generateId(e2, t, i, false))), !(r2 instanceof $e))
        for (const e3 of [...r2.dependencies, ...r2.dynamicDependencies])
          n2.add(e3);
    return s.digest("hex").substr(0, 8);
  }
  ensureReexportsAreAvailableForModule(e2) {
    const t = [], i = e2.getExportNamesByVariable();
    for (const s of i.keys()) {
      const i2 = s instanceof Us, n2 = i2 ? s.getBaseVariable() : s;
      if (!(n2 instanceof js && this.outputOptions.preserveModules)) {
        this.checkCircularDependencyImport(n2, e2);
        const s2 = n2.module;
        if (s2 instanceof ln) {
          const e3 = this.chunkByModule.get(s2);
          e3 && e3 !== this && (e3.exports.add(n2), t.push(n2), i2 && this.imports.add(n2));
        }
      }
    }
    t.length && this.includedReexportsByModule.set(e2, t);
  }
  finaliseDynamicImports(e2, t) {
    const i = e2.format === "amd";
    for (const [e3, s] of this.renderedModuleSources)
      for (const { node: n2, resolution: r2 } of e3.dynamicImports) {
        const e4 = this.chunkByModule.get(r2), a2 = this.facadeChunkByModule.get(r2);
        if (!r2 || !n2.included || e4 === this)
          continue;
        const o2 = r2 instanceof ln ? `'${_r(de(this.id, (a2 || e4).id, i, true))}'` : r2 instanceof $e ? `'${_r(r2.renormalizeRenderPath ? de(this.id, r2.renderPath, i, false) : r2.renderPath)}'` : r2;
        n2.renderFinalResolution(s, o2, r2 instanceof ln && !(a2 == null ? void 0 : a2.strictFacade) && e4.exportNamesByVariable.get(r2.namespace)[0], t);
      }
  }
  finaliseImportMetas(e2, t) {
    for (const [i, s] of this.renderedModuleSources)
      for (const n2 of i.importMetas)
        n2.renderFinalMechanism(s, this.id, e2, t, this.pluginDriver);
  }
  generateVariableName() {
    if (this.manualChunkAlias)
      return this.manualChunkAlias;
    const e2 = this.entryModules[0] || this.implicitEntryModules[0] || this.dynamicEntryModules[0] || this.orderedModules[this.orderedModules.length - 1];
    return e2 ? Br(e2) : "chunk";
  }
  getChunkDependencyDeclarations(e2, t) {
    const i = this.getImportSpecifiers(t), s = this.getReexportSpecifiers(), n2 = /* @__PURE__ */ new Map();
    for (const t2 of this.dependencies) {
      const r2 = i.get(t2) || null, a2 = s.get(t2) || null, o2 = t2 instanceof $e || t2.exportMode !== "default";
      n2.set(t2, { defaultVariableName: t2.defaultVariableName, globalName: t2 instanceof $e && (e2.format === "umd" || e2.format === "iife") && Lr(t2, e2.globals, (r2 || a2) !== null, this.inputOptions.onwarn), id: void 0, imports: r2, isChunk: t2 instanceof Vr, name: t2.variableName, namedExportsMode: o2, namespaceVariableName: t2.namespaceVariableName, reexports: a2 });
    }
    return n2;
  }
  getChunkExportDeclarations(e2, t) {
    const i = [];
    for (const s of this.getExportNames()) {
      if (s[0] === "*")
        continue;
      const n2 = this.exportsByName.get(s);
      if (!(n2 instanceof Us)) {
        const e3 = n2.module;
        if (e3 && this.chunkByModule.get(e3) !== this)
          continue;
      }
      let r2 = null, a2 = false, o2 = n2.getName(t);
      if (n2 instanceof Dt) {
        for (const e3 of n2.declarations)
          if (e3.parent instanceof qi || e3 instanceof Ki && e3.declaration instanceof qi) {
            a2 = true;
            break;
          }
      } else
        n2 instanceof Us && (r2 = o2, e2 === "es" && (o2 = n2.renderName));
      i.push({ exported: s, expression: r2, hoisted: a2, local: o2 });
    }
    return i;
  }
  getDependenciesToBeDeconflicted(e2, t, i) {
    const s = /* @__PURE__ */ new Set(), n2 = /* @__PURE__ */ new Set(), r2 = /* @__PURE__ */ new Set();
    for (const t2 of [...this.exportNamesByVariable.keys(), ...this.imports])
      if (e2 || t2.isNamespace) {
        const a2 = t2.module;
        if (a2 instanceof $e)
          s.add(a2), e2 && (t2.name === "default" ? es[String(i(a2.id))] && n2.add(a2) : t2.name === "*" && is[String(i(a2.id))] && r2.add(a2));
        else {
          const i2 = this.chunkByModule.get(a2);
          i2 !== this && (s.add(i2), e2 && i2.exportMode === "default" && t2.isNamespace && r2.add(i2));
        }
      }
    if (t)
      for (const e3 of this.dependencies)
        s.add(e3);
    return { deconflictedDefault: n2, deconflictedNamespace: r2, dependencies: s };
  }
  getFallbackChunkName() {
    return this.manualChunkAlias ? this.manualChunkAlias : this.dynamicName ? this.dynamicName : this.fileName ? le(this.fileName) : le(this.orderedModules[this.orderedModules.length - 1].id);
  }
  getImportSpecifiers(e2) {
    const { interop: t } = this.outputOptions, i = /* @__PURE__ */ new Map();
    for (const s of this.imports) {
      const n2 = s.module;
      let r2, a2;
      if (n2 instanceof $e) {
        if (r2 = n2, a2 = s.name, a2 !== "default" && a2 !== "*" && t(n2.id) === "defaultOnly")
          return pe(ve(n2.id, a2, false));
      } else
        r2 = this.chunkByModule.get(n2), a2 = r2.getVariableExportName(s);
      R(i, r2, () => []).push({ imported: a2, local: s.getName(e2) });
    }
    return i;
  }
  getImportedBindingsPerDependency() {
    const e2 = {};
    for (const [t, i] of this.renderedDependencies) {
      const s = /* @__PURE__ */ new Set();
      if (i.imports)
        for (const { imported: e3 } of i.imports)
          s.add(e3);
      if (i.reexports)
        for (const { imported: e3 } of i.reexports)
          s.add(e3);
      e2[t.id] = [...s];
    }
    return e2;
  }
  getReexportSpecifiers() {
    const { externalLiveBindings: e2, interop: t } = this.outputOptions, i = /* @__PURE__ */ new Map();
    for (let s of this.getExportNames()) {
      let n2, r2, a2 = false;
      if (s[0] === "*") {
        const i2 = s.substring(1);
        t(i2) === "defaultOnly" && this.inputOptions.onwarn(Se(i2)), a2 = e2, n2 = this.modulesById.get(i2), r2 = s = "*";
      } else {
        const i2 = this.exportsByName.get(s);
        if (i2 instanceof Us)
          continue;
        const o2 = i2.module;
        if (o2 instanceof ln) {
          if (n2 = this.chunkByModule.get(o2), n2 === this)
            continue;
          r2 = n2.getVariableExportName(i2), a2 = i2.isReassigned;
        } else {
          if (n2 = o2, r2 = i2.name, r2 !== "default" && r2 !== "*" && t(o2.id) === "defaultOnly")
            return pe(ve(o2.id, r2, true));
          a2 = e2 && (r2 !== "default" || ts(String(t(o2.id)), true));
        }
      }
      R(i, n2, () => []).push({ imported: r2, needsLiveBinding: a2, reexported: s });
    }
    return i;
  }
  getReferencedFiles() {
    const e2 = [];
    for (const t of this.orderedModules)
      for (const i of t.importMetas) {
        const t2 = i.getReferencedFileName(this.pluginDriver);
        t2 && e2.push(t2);
      }
    return e2;
  }
  inlineChunkDependencies(e2) {
    for (const t of e2.dependencies)
      this.dependencies.has(t) || (this.dependencies.add(t), t instanceof Vr && this.inlineChunkDependencies(t));
  }
  prepareModulesForRendering(e2) {
    var t;
    const i = this.accessedGlobalsByScope;
    for (const s of this.orderedModules) {
      for (const { node: n2, resolution: r2 } of s.dynamicImports)
        if (n2.included)
          if (r2 instanceof ln) {
            const s2 = this.chunkByModule.get(r2);
            s2 === this ? n2.setInternalResolution(r2.namespace) : n2.setExternalResolution(((t = this.facadeChunkByModule.get(r2)) === null || t === void 0 ? void 0 : t.exportMode) || s2.exportMode, r2, this.outputOptions, e2, this.pluginDriver, i);
          } else
            n2.setExternalResolution("external", r2, this.outputOptions, e2, this.pluginDriver, i);
      for (const e3 of s.importMetas)
        e3.addAccessedGlobals(this.outputOptions.format, i);
      this.includedNamespaces.has(s) && !this.outputOptions.preserveModules && s.namespace.prepare(i);
    }
  }
  setExternalRenderPaths(e2, t) {
    for (const i of [...this.dependencies, ...this.dynamicDependencies])
      i instanceof $e && i.setRenderPath(e2, t);
  }
  setIdentifierRenderResolutions({ format: e2, interop: t, namespaceToStringTag: i }) {
    const s = /* @__PURE__ */ new Set();
    for (const t2 of this.getExportNames()) {
      const i2 = this.exportsByName.get(t2);
      e2 !== "es" && e2 !== "system" && i2.isReassigned && !i2.isId ? i2.setRenderNames("exports", t2) : i2 instanceof Us ? s.add(i2) : i2.setRenderNames(null, null);
    }
    for (const e3 of this.orderedModules)
      if (e3.needsExportShim) {
        this.needsExportsShim = true;
        break;
      }
    const n2 = /* @__PURE__ */ new Set(["Object", "Promise"]);
    switch (this.needsExportsShim && n2.add("_missingExportShim"), i && n2.add("Symbol"), e2) {
      case "system":
        n2.add("module").add("exports");
        break;
      case "es":
        break;
      case "cjs":
        n2.add("module").add("require").add("__filename").add("__dirname");
      default:
        n2.add("exports");
        for (const e3 of ys)
          n2.add(e3);
    }
    Ar(this.orderedModules, this.getDependenciesToBeDeconflicted(e2 !== "es" && e2 !== "system", e2 === "amd" || e2 === "umd" || e2 === "iife", t), this.imports, n2, e2, t, this.outputOptions.preserveModules, this.outputOptions.externalLiveBindings, this.chunkByModule, s, this.exportNamesByVariable, this.accessedGlobalsByScope, this.includedNamespaces);
  }
  setUpChunkImportsAndExportsForModule(e2) {
    const t = new Set(e2.includedImports);
    if (!this.outputOptions.preserveModules && this.includedNamespaces.has(e2)) {
      const i = e2.namespace.getMemberVariables();
      for (const e3 of Object.values(i))
        t.add(e3);
    }
    for (let i of t) {
      i instanceof Ms && (i = i.getOriginalVariable()), i instanceof Us && (i = i.getBaseVariable());
      const t2 = this.chunkByModule.get(i.module);
      t2 !== this && (this.imports.add(i), !(i instanceof js && this.outputOptions.preserveModules) && i.module instanceof ln && (t2.exports.add(i), this.checkCircularDependencyImport(i, e2)));
    }
    (this.includedNamespaces.has(e2) || e2.info.isEntry && e2.preserveSignature !== false || e2.includedDynamicImporters.some((e3) => this.chunkByModule.get(e3) !== this)) && this.ensureReexportsAreAvailableForModule(e2);
    for (const { node: t2, resolution: i } of e2.dynamicImports)
      t2.included && i instanceof ln && this.chunkByModule.get(i) === this && !this.includedNamespaces.has(i) && (this.includedNamespaces.add(i), this.ensureReexportsAreAvailableForModule(i));
  }
}
function Br(e2) {
  var t, i, s, n2;
  return (n2 = (i = (t = e2.chunkNames.find(({ isUserDefined: e3 }) => e3)) === null || t === void 0 ? void 0 : t.name) !== null && i !== void 0 ? i : (s = e2.chunkNames[0]) === null || s === void 0 ? void 0 : s.name) !== null && n2 !== void 0 ? n2 : le(e2.id);
}
const Fr = /[?#]/;
function zr(e2, t, i) {
  e2 in t && i(function(e3) {
    return { code: me.FILE_NAME_CONFLICT, message: `The emitted file "${e3}" overwrites a previously emitted file of the same name.` };
  }(e2)), t[e2] = jr;
}
const jr = { type: "placeholder" };
function Ur(e2, t, i) {
  if (!(typeof e2 == "string" || e2 instanceof Uint8Array)) {
    const e3 = t.fileName || t.name || i;
    return pe(Ae(`Could not set source for ${typeof e3 == "string" ? `asset "${e3}"` : "unnamed asset"}, asset source needs to be a string, Uint8Array or Buffer.`));
  }
  return e2;
}
function Gr(e2, t) {
  return typeof e2.fileName != "string" ? pe((i = e2.name || t, { code: me.ASSET_NOT_FINALISED, message: `Plugin error - Unable to get file name for asset "${i}". Ensure that the source is set and that generate is called first.` })) : e2.fileName;
  var i;
}
function Hr(e2, t) {
  var i;
  const s = e2.fileName || e2.module && ((i = t == null ? void 0 : t.get(e2.module)) === null || i === void 0 ? void 0 : i.id);
  return s || pe((n2 = e2.fileName || e2.name, { code: me.CHUNK_NOT_GENERATED, message: `Plugin error - Unable to get file name for chunk "${n2}". Ensure that generate is called first.` }));
  var n2;
}
class Wr {
  constructor(e2, t, i) {
    this.graph = e2, this.options = t, this.bundle = null, this.facadeChunkByModule = null, this.outputOptions = null, this.assertAssetsFinalized = () => {
      for (const [t2, i2] of this.filesByReferenceId)
        if (i2.type === "asset" && typeof i2.fileName != "string")
          return pe((e3 = i2.name || t2, { code: me.ASSET_SOURCE_MISSING, message: `Plugin error creating asset "${e3}" - no asset source set.` }));
      var e3;
    }, this.emitFile = (e3) => function(e4) {
      return Boolean(e4 && (e4.type === "asset" || e4.type === "chunk"));
    }(e3) ? function(e4) {
      const t2 = e4.fileName || e4.name;
      return !t2 || typeof t2 == "string" && !ce(t2);
    }(e3) ? e3.type === "chunk" ? this.emitChunk(e3) : this.emitAsset(e3) : pe(Ae(`The "fileName" or "name" properties of emitted files must be strings that are neither absolute nor relative paths, received "${e3.fileName || e3.name}".`)) : pe(Ae(`Emitted files must be of type "asset" or "chunk", received "${e3 && e3.type}".`)), this.getFileName = (e3) => {
      const t2 = this.filesByReferenceId.get(e3);
      return t2 ? t2.type === "chunk" ? Hr(t2, this.facadeChunkByModule) : Gr(t2, e3) : pe((i2 = e3, { code: me.FILE_NOT_FOUND, message: `Plugin error - Unable to get file name for unknown file "${i2}".` }));
      var i2;
    }, this.setAssetSource = (e3, t2) => {
      const i2 = this.filesByReferenceId.get(e3);
      if (!i2)
        return pe((s = e3, { code: me.ASSET_NOT_FOUND, message: `Plugin error - Unable to set the source for unknown asset "${s}".` }));
      var s, n2;
      if (i2.type !== "asset")
        return pe(Ae(`Asset sources can only be set for emitted assets but "${e3}" is an emitted chunk.`));
      if (i2.source !== void 0)
        return pe((n2 = i2.name || e3, { code: me.ASSET_SOURCE_ALREADY_SET, message: `Unable to set the source for asset "${n2}", source already set.` }));
      const r2 = Ur(t2, i2, e3);
      this.bundle ? this.finalizeAsset(i2, r2, e3, this.bundle) : i2.source = r2;
    }, this.setOutputBundle = (e3, t2, i2) => {
      this.outputOptions = t2, this.bundle = e3, this.facadeChunkByModule = i2;
      for (const e4 of this.filesByReferenceId.values())
        e4.fileName && zr(e4.fileName, this.bundle, this.options.onwarn);
      for (const [e4, t3] of this.filesByReferenceId)
        t3.type === "asset" && t3.source !== void 0 && this.finalizeAsset(t3, t3.source, e4, this.bundle);
    }, this.filesByReferenceId = i ? new Map(i.filesByReferenceId) : /* @__PURE__ */ new Map();
  }
  assignReferenceId(e2, t) {
    let i;
    do {
      i = vr().update(i || t).digest("hex").substring(0, 8);
    } while (this.filesByReferenceId.has(i));
    return this.filesByReferenceId.set(i, e2), i;
  }
  emitAsset(e2) {
    const t = e2.source !== void 0 ? Ur(e2.source, e2, null) : void 0, i = { fileName: e2.fileName, name: e2.name, source: t, type: "asset" }, s = this.assignReferenceId(i, e2.fileName || e2.name || e2.type);
    return this.bundle && (e2.fileName && zr(e2.fileName, this.bundle, this.options.onwarn), t !== void 0 && this.finalizeAsset(i, t, s, this.bundle)), s;
  }
  emitChunk(e2) {
    if (this.graph.phase > Gs.LOAD_AND_PARSE)
      return pe({ code: me.INVALID_ROLLUP_PHASE, message: "Cannot emit chunks after module loading has finished." });
    if (typeof e2.id != "string")
      return pe(Ae(`Emitted chunks need to have a valid string id, received "${e2.id}"`));
    const t = { fileName: e2.fileName, module: null, name: e2.name || e2.id, type: "chunk" };
    return this.graph.moduleLoader.emitChunk(e2).then((e3) => t.module = e3).catch(() => {
    }), this.assignReferenceId(t, e2.id);
  }
  finalizeAsset(e2, t, i, s) {
    const n2 = e2.fileName || function(e3, t2) {
      for (const [i2, s2] of Object.entries(e3))
        if (s2.type === "asset" && qr(t2, s2.source))
          return i2;
      return null;
    }(s, t) || function(e3, t2, i2, s2) {
      const n3 = i2.sanitizeFileName(e3 || "asset");
      return Mr(Rr(typeof i2.assetFileNames == "function" ? i2.assetFileNames({ name: e3, source: t2, type: "asset" }) : i2.assetFileNames, "output.assetFileNames", { ext: () => $(n3).substring(1), extname: () => $(n3), hash: () => vr().update(n3).update(":").update(t2).digest("hex").substring(0, 8), name: () => n3.substring(0, n3.length - $(n3).length) }), s2);
    }(e2.name, t, this.outputOptions, s), r2 = __spreadProps(__spreadValues({}, e2), { fileName: n2, source: t });
    this.filesByReferenceId.set(i, r2);
    const { options: a2 } = this;
    s[n2] = { fileName: n2, get isAsset() {
      return ke(`Accessing "isAsset" on files in the bundle is deprecated, please use "type === 'asset'" instead`, true, a2), true;
    }, name: e2.name, source: t, type: "asset" };
  }
}
function qr(e2, t) {
  if (typeof e2 == "string")
    return e2 === t;
  if (typeof t == "string")
    return false;
  if ("equals" in e2)
    return e2.equals(t);
  if (e2.length !== t.length)
    return false;
  for (let i = 0; i < e2.length; i++)
    if (e2[i] !== t[i])
      return false;
  return true;
}
const Kr = (e2, t) => t ? `${e2}
${t}` : e2, Xr = (e2, t) => t ? `${e2}

${t}` : e2;
function Yr(e2, t) {
  const i = [], s = new Set(t.keys()), n2 = /* @__PURE__ */ Object.create(null);
  for (const [e3, i2] of t) {
    Qr(e3, n2[i2] = n2[i2] || [], s);
  }
  for (const [e3, t2] of Object.entries(n2))
    i.push({ alias: e3, modules: t2 });
  const r2 = /* @__PURE__ */ new Map(), { dependentEntryPointsByModule: a2, dynamicEntryModules: o2 } = function(e3) {
    const t2 = /* @__PURE__ */ new Set(), i2 = /* @__PURE__ */ new Map(), s2 = new Set(e3);
    for (const e4 of s2) {
      const n3 = /* @__PURE__ */ new Set([e4]);
      for (const r3 of n3) {
        R(i2, r3, () => /* @__PURE__ */ new Set()).add(e4);
        for (const e5 of r3.getDependenciesToBeIncluded())
          e5 instanceof $e || n3.add(e5);
        for (const { resolution: e5 } of r3.dynamicImports)
          e5 instanceof ln && e5.includedDynamicImporters.length > 0 && (t2.add(e5), s2.add(e5));
        for (const e5 of r3.implicitlyLoadedBefore)
          t2.add(e5), s2.add(e5);
      }
    }
    return { dependentEntryPointsByModule: i2, dynamicEntryModules: t2 };
  }(e2), l2 = function(e3, t2) {
    const i2 = /* @__PURE__ */ new Map();
    for (const s2 of t2) {
      const t3 = R(i2, s2, () => /* @__PURE__ */ new Set());
      for (const i3 of [...s2.includedDynamicImporters, ...s2.implicitlyLoadedAfter])
        for (const s3 of e3.get(i3))
          t3.add(s3);
    }
    return i2;
  }(a2, o2), h2 = new Set(e2);
  function c2(e3, t2) {
    const i2 = /* @__PURE__ */ new Set([e3]);
    for (const n3 of i2) {
      const o3 = R(r2, n3, () => /* @__PURE__ */ new Set());
      if (!t2 || !u2(t2, a2.get(n3))) {
        o3.add(e3);
        for (const e4 of n3.getDependenciesToBeIncluded())
          e4 instanceof $e || s.has(e4) || i2.add(e4);
      }
    }
  }
  function u2(e3, t2) {
    const i2 = new Set(e3);
    for (const e4 of i2)
      if (!t2.has(e4)) {
        if (h2.has(e4))
          return false;
        const t3 = l2.get(e4);
        for (const e5 of t3)
          i2.add(e5);
      }
    return true;
  }
  for (const t2 of e2)
    s.has(t2) || c2(t2, null);
  for (const e3 of o2)
    s.has(e3) || c2(e3, l2.get(e3));
  return i.push(...function(e3, t2) {
    const i2 = /* @__PURE__ */ Object.create(null);
    for (const [s2, n3] of t2) {
      let t3 = "";
      for (const i3 of e3)
        t3 += n3.has(i3) ? "X" : "_";
      const r3 = i2[t3];
      r3 ? r3.push(s2) : i2[t3] = [s2];
    }
    return Object.values(i2).map((e4) => ({ alias: null, modules: e4 }));
  }([...e2, ...o2], r2)), i;
}
function Qr(e2, t, i) {
  const s = /* @__PURE__ */ new Set([e2]);
  for (const e3 of s) {
    i.add(e3), t.push(e3);
    for (const t2 of e3.dependencies)
      t2 instanceof $e || i.has(t2) || s.add(t2);
  }
}
const Zr = (e2, t) => e2.execIndex > t.execIndex ? 1 : -1;
function Jr(e2, t, i) {
  const s = Symbol(e2.id), n2 = [he(e2.id)];
  let r2 = t;
  for (e2.cycles.add(s); r2 !== e2; )
    r2.cycles.add(s), n2.push(he(r2.id)), r2 = i.get(r2);
  return n2.push(n2[0]), n2.reverse(), n2;
}
const ea = (e2, t) => t ? `(${e2})` : e2, ta = /^(?!\d)[\w$]+$/;
class ia {
  constructor(e2, t, i, s, n2) {
    this.outputOptions = e2, this.unsetOptions = t, this.inputOptions = i, this.pluginDriver = s, this.graph = n2, this.facadeChunkByModule = /* @__PURE__ */ new Map(), this.includedNamespaces = /* @__PURE__ */ new Set();
  }
  async generate(e2) {
    en("GENERATE", 1);
    const t = /* @__PURE__ */ Object.create(null);
    this.pluginDriver.setOutputBundle(t, this.outputOptions, this.facadeChunkByModule);
    try {
      await this.pluginDriver.hookParallel("renderStart", [this.outputOptions, this.inputOptions]), en("generate chunks", 2);
      const e3 = await this.generateChunks();
      e3.length > 1 && function(e4, t2) {
        if (e4.format === "umd" || e4.format === "iife")
          return pe(xe("output.format", "outputformat", "UMD and IIFE output formats are not supported for code-splitting builds", e4.format));
        if (typeof e4.file == "string")
          return pe(xe("output.file", "outputdir", 'when building multiple chunks, the "output.dir" option must be used, not "output.file". To inline dynamic imports, set the "inlineDynamicImports" option'));
        if (e4.sourcemapFile)
          return pe(xe("output.sourcemapFile", "outputsourcemapfile", '"output.sourcemapFile" is only supported for single-file builds'));
        !e4.amd.autoId && e4.amd.id && t2(xe("output.amd.id", "outputamd", 'this option is only properly supported for single-file builds. Use "output.amd.autoId" and "output.amd.basePath" instead'));
      }(this.outputOptions, this.inputOptions.onwarn);
      const i = function(e4) {
        if (e4.length === 0)
          return "/";
        if (e4.length === 1)
          return N(e4[0]);
        const t2 = e4.slice(1).reduce((e5, t3) => {
          const i2 = t3.split(/\/+|\\+/);
          let s2;
          for (s2 = 0; e5[s2] === i2[s2] && s2 < Math.min(e5.length, i2.length); s2++)
            ;
          return e5.slice(0, s2);
        }, e4[0].split(/\/+|\\+/));
        return t2.length > 1 ? t2.join("/") : "/";
      }(function(e4) {
        const t2 = [];
        for (const i2 of e4)
          for (const e5 of i2.entryModules)
            P(e5.id) && t2.push(e5.id);
        return t2;
      }(e3));
      tn("generate chunks", 2), en("render modules", 2);
      const s = await async function(e4, t2) {
        try {
          let [i2, s2, n3, r2] = await Promise.all([t2.hookReduceValue("banner", e4.banner(), [], Kr), t2.hookReduceValue("footer", e4.footer(), [], Kr), t2.hookReduceValue("intro", e4.intro(), [], Xr), t2.hookReduceValue("outro", e4.outro(), [], Xr)]);
          return n3 && (n3 += "\n\n"), r2 && (r2 = `

${r2}`), i2.length && (i2 += "\n"), s2.length && (s2 = "\n" + s2), { banner: i2, footer: s2, intro: n3, outro: r2 };
        } catch (e5) {
          return pe({ code: "ADDON_ERROR", message: `Could not retrieve ${e5.hook}. Check configuration of plugin ${e5.plugin}.
	Error Message: ${e5.message}` });
        }
      }(this.outputOptions, this.pluginDriver), n2 = function({ compact: e4, generatedCode: { arrowFunctions: t2, constBindings: i2, objectShorthand: s2, reservedNamesAsProps: n3 } }) {
        const { _: r2, n: a2, s: o2 } = e4 ? { _: "", n: "", s: "" } : { _: " ", n: "\n", s: ";" }, l2 = i2 ? "const" : "var", h2 = (e5, { isAsync: t3, name: i3 }) => `${t3 ? "async " : ""}function${i3 ? ` ${i3}` : ""}${r2}(${e5.join(`,${r2}`)})${r2}`, c2 = t2 ? (e5, { isAsync: t3, name: i3 }) => {
          const s3 = e5.length === 1;
          return `${i3 ? `${l2} ${i3}${r2}=${r2}` : ""}${t3 ? `async${s3 ? " " : r2}` : ""}${s3 ? e5[0] : `(${e5.join(`,${r2}`)})`}${r2}=>${r2}`;
        } : h2, u2 = (e5, { functionReturn: i3, lineBreakIndent: s3, name: n4 }) => [`${c2(e5, { isAsync: false, name: n4 })}${t2 ? s3 ? `${a2}${s3.base}${s3.t}` : "" : `{${s3 ? `${a2}${s3.base}${s3.t}` : r2}${i3 ? "return " : ""}`}`, t2 ? `${n4 ? ";" : ""}${s3 ? `${a2}${s3.base}` : ""}` : `${o2}${s3 ? `${a2}${s3.base}` : r2}}`], d2 = n3 ? (e5) => ta.test(e5) : (e5) => !we.has(e5) && ta.test(e5);
        return { _: r2, cnst: l2, getDirectReturnFunction: u2, getDirectReturnIifeLeft: (e5, i3, { needsArrowReturnParens: s3, needsWrappedFunction: n4 }) => {
          const [r3, a3] = u2(e5, { functionReturn: true, lineBreakIndent: null, name: null });
          return `${ea(`${r3}${ea(i3, t2 && s3)}${a3}`, t2 || n4)}(`;
        }, getFunctionIntro: c2, getNonArrowFunctionIntro: h2, getObject(e5, { lineBreakIndent: t3 }) {
          const i3 = t3 ? `${a2}${t3.base}${t3.t}` : r2;
          return `{${e5.map(([e6, t4]) => {
            if (e6 === null)
              return `${i3}${t4}`;
            const n4 = !d2(e6);
            return e6 === t4 && s2 && !n4 ? i3 + e6 : `${i3}${n4 ? `'${e6}'` : e6}:${r2}${t4}`;
          }).join(",")}${e5.length === 0 ? "" : t3 ? `${a2}${t3.base}` : r2}}`;
        }, getPropertyAccess: (e5) => d2(e5) ? `.${e5}` : `[${JSON.stringify(e5)}]`, n: a2, s: o2 };
      }(this.outputOptions);
      this.prerenderChunks(e3, i, n2), tn("render modules", 2), await this.addFinalizedChunksToBundle(e3, i, s, t, n2);
    } catch (e3) {
      throw await this.pluginDriver.hookParallel("renderError", [e3]), e3;
    }
    return await this.pluginDriver.hookSeq("generateBundle", [this.outputOptions, t, e2]), this.finaliseAssets(t), tn("GENERATE", 1), t;
  }
  async addFinalizedChunksToBundle(e2, t, i, s, n2) {
    this.assignChunkIds(e2, t, i, s);
    for (const t2 of e2)
      s[t2.id] = t2.getChunkInfoWithFileNames();
    await Promise.all(e2.map(async (e3) => {
      const t2 = s[e3.id];
      Object.assign(t2, await e3.render(this.outputOptions, i, t2, n2));
    }));
  }
  async addManualChunks(e2) {
    const t = /* @__PURE__ */ new Map(), i = await Promise.all(Object.entries(e2).map(async ([e3, t2]) => ({ alias: e3, entries: await this.graph.moduleLoader.addAdditionalModules(t2) })));
    for (const { alias: e3, entries: s } of i)
      for (const i2 of s)
        na(e3, i2, t);
    return t;
  }
  assignChunkIds(e2, t, i, s) {
    const n2 = [], r2 = [];
    for (const t2 of e2)
      (t2.facadeModule && t2.facadeModule.isUserDefinedEntryPoint ? n2 : r2).push(t2);
    const a2 = n2.concat(r2);
    for (const e3 of a2)
      this.outputOptions.file ? e3.id = _(this.outputOptions.file) : this.outputOptions.preserveModules ? e3.id = e3.generateIdPreserveModules(t, this.outputOptions, s, this.unsetOptions) : e3.id = e3.generateId(i, this.outputOptions, s, true), s[e3.id] = jr;
  }
  assignManualChunks(e2) {
    const t = [], i = { getModuleIds: () => this.graph.modulesById.keys(), getModuleInfo: this.graph.getModuleInfo };
    for (const s2 of this.graph.modulesById.values())
      if (s2 instanceof ln) {
        const n2 = e2(s2.id, i);
        typeof n2 == "string" && t.push([n2, s2]);
      }
    t.sort(([e3], [t2]) => e3 > t2 ? 1 : e3 < t2 ? -1 : 0);
    const s = /* @__PURE__ */ new Map();
    for (const [e3, i2] of t)
      na(e3, i2, s);
    return s;
  }
  finaliseAssets(e2) {
    for (const t of Object.values(e2))
      if (t.type || (ke('A plugin is directly adding properties to the bundle object in the "generateBundle" hook. This is deprecated and will be removed in a future Rollup version, please use "this.emitFile" instead.', true, this.inputOptions), t.type = "asset"), this.outputOptions.validate && "code" in t)
        try {
          this.graph.contextParse(t.code, { allowHashBang: true, ecmaVersion: "latest" });
        } catch (e3) {
          this.inputOptions.onwarn(ge(t, e3));
        }
    this.pluginDriver.finaliseAssets();
  }
  async generateChunks() {
    const { manualChunks: e2 } = this.outputOptions, t = typeof e2 == "object" ? await this.addManualChunks(e2) : this.assignManualChunks(e2), i = [], s = /* @__PURE__ */ new Map();
    for (const { alias: e3, modules: n3 } of this.outputOptions.inlineDynamicImports ? [{ alias: null, modules: sa(this.graph.modulesById) }] : this.outputOptions.preserveModules ? sa(this.graph.modulesById).map((e4) => ({ alias: null, modules: [e4] })) : Yr(this.graph.entryModules, t)) {
      n3.sort(Zr);
      const t2 = new Vr(n3, this.inputOptions, this.outputOptions, this.unsetOptions, this.pluginDriver, this.graph.modulesById, s, this.facadeChunkByModule, this.includedNamespaces, e3);
      i.push(t2);
      for (const e4 of n3)
        s.set(e4, t2);
    }
    for (const e3 of i)
      e3.link();
    const n2 = [];
    for (const e3 of i)
      n2.push(...e3.generateFacades());
    return [...i, ...n2];
  }
  prerenderChunks(e2, t, i) {
    for (const t2 of e2)
      t2.generateExports();
    for (const s of e2)
      s.preRender(this.outputOptions, t, i);
  }
}
function sa(e2) {
  return [...e2.values()].filter((e3) => e3 instanceof ln && (e3.isIncluded() || e3.info.isEntry || e3.includedDynamicImporters.length > 0));
}
function na(e2, t, i) {
  const s = i.get(t);
  if (typeof s == "string" && s !== e2)
    return pe((n2 = t.id, r2 = e2, a2 = s, { code: me.INVALID_CHUNK, message: `Cannot assign ${he(n2)} to the "${r2}" chunk as it is already in the "${a2}" chunk.` }));
  var n2, r2, a2;
  i.set(t, e2);
}
var ra = [509, 0, 227, 0, 150, 4, 294, 9, 1368, 2, 2, 1, 6, 3, 41, 2, 5, 0, 166, 1, 574, 3, 9, 9, 370, 1, 154, 10, 50, 3, 123, 2, 54, 14, 32, 10, 3, 1, 11, 3, 46, 10, 8, 0, 46, 9, 7, 2, 37, 13, 2, 9, 6, 1, 45, 0, 13, 2, 49, 13, 9, 3, 2, 11, 83, 11, 7, 0, 161, 11, 6, 9, 7, 3, 56, 1, 2, 6, 3, 1, 3, 2, 10, 0, 11, 1, 3, 6, 4, 4, 193, 17, 10, 9, 5, 0, 82, 19, 13, 9, 214, 6, 3, 8, 28, 1, 83, 16, 16, 9, 82, 12, 9, 9, 84, 14, 5, 9, 243, 14, 166, 9, 71, 5, 2, 1, 3, 3, 2, 0, 2, 1, 13, 9, 120, 6, 3, 6, 4, 0, 29, 9, 41, 6, 2, 3, 9, 0, 10, 10, 47, 15, 406, 7, 2, 7, 17, 9, 57, 21, 2, 13, 123, 5, 4, 0, 2, 1, 2, 6, 2, 0, 9, 9, 49, 4, 2, 1, 2, 4, 9, 9, 330, 3, 19306, 9, 87, 9, 39, 4, 60, 6, 26, 9, 1014, 0, 2, 54, 8, 3, 82, 0, 12, 1, 19628, 1, 4706, 45, 3, 22, 543, 4, 4, 5, 9, 7, 3, 6, 31, 3, 149, 2, 1418, 49, 513, 54, 5, 49, 9, 0, 15, 0, 23, 4, 2, 14, 1361, 6, 2, 16, 3, 6, 2, 1, 2, 4, 262, 6, 10, 9, 357, 0, 62, 13, 1495, 6, 110, 6, 6, 9, 4759, 9, 787719, 239], aa = [0, 11, 2, 25, 2, 18, 2, 1, 2, 14, 3, 13, 35, 122, 70, 52, 268, 28, 4, 48, 48, 31, 14, 29, 6, 37, 11, 29, 3, 35, 5, 7, 2, 4, 43, 157, 19, 35, 5, 35, 5, 39, 9, 51, 13, 10, 2, 14, 2, 6, 2, 1, 2, 10, 2, 14, 2, 6, 2, 1, 68, 310, 10, 21, 11, 7, 25, 5, 2, 41, 2, 8, 70, 5, 3, 0, 2, 43, 2, 1, 4, 0, 3, 22, 11, 22, 10, 30, 66, 18, 2, 1, 11, 21, 11, 25, 71, 55, 7, 1, 65, 0, 16, 3, 2, 2, 2, 28, 43, 28, 4, 28, 36, 7, 2, 27, 28, 53, 11, 21, 11, 18, 14, 17, 111, 72, 56, 50, 14, 50, 14, 35, 349, 41, 7, 1, 79, 28, 11, 0, 9, 21, 43, 17, 47, 20, 28, 22, 13, 52, 58, 1, 3, 0, 14, 44, 33, 24, 27, 35, 30, 0, 3, 0, 9, 34, 4, 0, 13, 47, 15, 3, 22, 0, 2, 0, 36, 17, 2, 24, 85, 6, 2, 0, 2, 3, 2, 14, 2, 9, 8, 46, 39, 7, 3, 1, 3, 21, 2, 6, 2, 1, 2, 4, 4, 0, 19, 0, 13, 4, 159, 52, 19, 3, 21, 2, 31, 47, 21, 1, 2, 0, 185, 46, 42, 3, 37, 47, 21, 0, 60, 42, 14, 0, 72, 26, 38, 6, 186, 43, 117, 63, 32, 7, 3, 0, 3, 7, 2, 1, 2, 23, 16, 0, 2, 0, 95, 7, 3, 38, 17, 0, 2, 0, 29, 0, 11, 39, 8, 0, 22, 0, 12, 45, 20, 0, 19, 72, 264, 8, 2, 36, 18, 0, 50, 29, 113, 6, 2, 1, 2, 37, 22, 0, 26, 5, 2, 1, 2, 31, 15, 0, 328, 18, 190, 0, 80, 921, 103, 110, 18, 195, 2637, 96, 16, 1070, 4050, 582, 8634, 568, 8, 30, 18, 78, 18, 29, 19, 47, 17, 3, 32, 20, 6, 18, 689, 63, 129, 74, 6, 0, 67, 12, 65, 1, 2, 0, 29, 6135, 9, 1237, 43, 8, 8936, 3, 2, 6, 2, 1, 2, 290, 46, 2, 18, 3, 9, 395, 2309, 106, 6, 12, 4, 8, 8, 9, 5991, 84, 2, 70, 2, 1, 3, 0, 3, 1, 3, 3, 2, 11, 2, 0, 2, 6, 2, 64, 2, 3, 3, 7, 2, 6, 2, 27, 2, 3, 2, 4, 2, 0, 4, 6, 2, 339, 3, 24, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 7, 1845, 30, 482, 44, 11, 6, 17, 0, 322, 29, 19, 43, 1269, 6, 2, 3, 2, 1, 2, 14, 2, 196, 60, 67, 8, 0, 1205, 3, 2, 26, 2, 1, 2, 0, 3, 0, 2, 9, 2, 3, 2, 0, 2, 0, 7, 0, 5, 0, 2, 0, 2, 0, 2, 2, 2, 1, 2, 0, 3, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 1, 2, 0, 3, 3, 2, 6, 2, 3, 2, 3, 2, 0, 2, 9, 2, 16, 6, 2, 2, 4, 2, 16, 4421, 42719, 33, 4152, 8, 221, 3, 5761, 15, 7472, 3104, 541, 1507, 4938], oa = "\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0560-\u0588\u05D0-\u05EA\u05EF-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u0870-\u0887\u0889-\u088E\u08A0-\u08C9\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C5D\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D04-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u1711\u171F-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1878\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4C\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1C90-\u1CBA\u1CBD-\u1CBF\u1CE9-\u1CEC\u1CEE-\u1CF3\u1CF5\u1CF6\u1CFA\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309B-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u31A0-\u31BF\u31F0-\u31FF\u3400-\u4DBF\u4E00-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7CA\uA7D0\uA7D1\uA7D3\uA7D5-\uA7D9\uA7F2-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA8FE\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB69\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC", la = { 3: "abstract boolean byte char class double enum export extends final float goto implements import int interface long native package private protected public short static super synchronized throws transient volatile", 5: "class enum extends super const export import", 6: "enum", strict: "implements interface let package private protected public static yield", strictBind: "eval arguments" }, ha = "break case catch continue debugger default do else finally for function if return switch throw try var while with null true false instanceof typeof void delete new in this", ca = { 5: ha, "5module": ha + " export import", 6: ha + " const class extends export import super" }, ua = /^in(stanceof)?$/, da = new RegExp("[" + oa + "]"), pa = new RegExp("[" + oa + "\u200C\u200D\xB7\u0300-\u036F\u0387\u0483-\u0487\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u0669\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u06F0-\u06F9\u0711\u0730-\u074A\u07A6-\u07B0\u07C0-\u07C9\u07EB-\u07F3\u07FD\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u0898-\u089F\u08CA-\u08E1\u08E3-\u0903\u093A-\u093C\u093E-\u094F\u0951-\u0957\u0962\u0963\u0966-\u096F\u0981-\u0983\u09BC\u09BE-\u09C4\u09C7\u09C8\u09CB-\u09CD\u09D7\u09E2\u09E3\u09E6-\u09EF\u09FE\u0A01-\u0A03\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A66-\u0A71\u0A75\u0A81-\u0A83\u0ABC\u0ABE-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AE2\u0AE3\u0AE6-\u0AEF\u0AFA-\u0AFF\u0B01-\u0B03\u0B3C\u0B3E-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B55-\u0B57\u0B62\u0B63\u0B66-\u0B6F\u0B82\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD7\u0BE6-\u0BEF\u0C00-\u0C04\u0C3C\u0C3E-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C66-\u0C6F\u0C81-\u0C83\u0CBC\u0CBE-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CE2\u0CE3\u0CE6-\u0CEF\u0D00-\u0D03\u0D3B\u0D3C\u0D3E-\u0D44\u0D46-\u0D48\u0D4A-\u0D4D\u0D57\u0D62\u0D63\u0D66-\u0D6F\u0D81-\u0D83\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0E50-\u0E59\u0EB1\u0EB4-\u0EBC\u0EC8-\u0ECD\u0ED0-\u0ED9\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E\u0F3F\u0F71-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102B-\u103E\u1040-\u1049\u1056-\u1059\u105E-\u1060\u1062-\u1064\u1067-\u106D\u1071-\u1074\u1082-\u108D\u108F-\u109D\u135D-\u135F\u1369-\u1371\u1712-\u1715\u1732-\u1734\u1752\u1753\u1772\u1773\u17B4-\u17D3\u17DD\u17E0-\u17E9\u180B-\u180D\u180F-\u1819\u18A9\u1920-\u192B\u1930-\u193B\u1946-\u194F\u19D0-\u19DA\u1A17-\u1A1B\u1A55-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AB0-\u1ABD\u1ABF-\u1ACE\u1B00-\u1B04\u1B34-\u1B44\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1B82\u1BA1-\u1BAD\u1BB0-\u1BB9\u1BE6-\u1BF3\u1C24-\u1C37\u1C40-\u1C49\u1C50-\u1C59\u1CD0-\u1CD2\u1CD4-\u1CE8\u1CED\u1CF4\u1CF7-\u1CF9\u1DC0-\u1DFF\u203F\u2040\u2054\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302F\u3099\u309A\uA620-\uA629\uA66F\uA674-\uA67D\uA69E\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA823-\uA827\uA82C\uA880\uA881\uA8B4-\uA8C5\uA8D0-\uA8D9\uA8E0-\uA8F1\uA8FF-\uA909\uA926-\uA92D\uA947-\uA953\uA980-\uA983\uA9B3-\uA9C0\uA9D0-\uA9D9\uA9E5\uA9F0-\uA9F9\uAA29-\uAA36\uAA43\uAA4C\uAA4D\uAA50-\uAA59\uAA7B-\uAA7D\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEB-\uAAEF\uAAF5\uAAF6\uABE3-\uABEA\uABEC\uABED\uABF0-\uABF9\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFF10-\uFF19\uFF3F]");
function fa(e2, t) {
  for (var i = 65536, s = 0; s < t.length; s += 2) {
    if ((i += t[s]) > e2)
      return false;
    if ((i += t[s + 1]) >= e2)
      return true;
  }
}
function ma(e2, t) {
  return e2 < 65 ? e2 === 36 : e2 < 91 || (e2 < 97 ? e2 === 95 : e2 < 123 || (e2 <= 65535 ? e2 >= 170 && da.test(String.fromCharCode(e2)) : t !== false && fa(e2, aa)));
}
function ga(e2, t) {
  return e2 < 48 ? e2 === 36 : e2 < 58 || !(e2 < 65) && (e2 < 91 || (e2 < 97 ? e2 === 95 : e2 < 123 || (e2 <= 65535 ? e2 >= 170 && pa.test(String.fromCharCode(e2)) : t !== false && (fa(e2, aa) || fa(e2, ra)))));
}
var ya = function(e2, t) {
  t === void 0 && (t = {}), this.label = e2, this.keyword = t.keyword, this.beforeExpr = !!t.beforeExpr, this.startsExpr = !!t.startsExpr, this.isLoop = !!t.isLoop, this.isAssign = !!t.isAssign, this.prefix = !!t.prefix, this.postfix = !!t.postfix, this.binop = t.binop || null, this.updateContext = null;
};
function xa(e2, t) {
  return new ya(e2, { beforeExpr: true, binop: t });
}
var Ea = { beforeExpr: true }, ba = { startsExpr: true }, va = {};
function Sa(e2, t) {
  return t === void 0 && (t = {}), t.keyword = e2, va[e2] = new ya(e2, t);
}
var Aa = { num: new ya("num", ba), regexp: new ya("regexp", ba), string: new ya("string", ba), name: new ya("name", ba), privateId: new ya("privateId", ba), eof: new ya("eof"), bracketL: new ya("[", { beforeExpr: true, startsExpr: true }), bracketR: new ya("]"), braceL: new ya("{", { beforeExpr: true, startsExpr: true }), braceR: new ya("}"), parenL: new ya("(", { beforeExpr: true, startsExpr: true }), parenR: new ya(")"), comma: new ya(",", Ea), semi: new ya(";", Ea), colon: new ya(":", Ea), dot: new ya("."), question: new ya("?", Ea), questionDot: new ya("?."), arrow: new ya("=>", Ea), template: new ya("template"), invalidTemplate: new ya("invalidTemplate"), ellipsis: new ya("...", Ea), backQuote: new ya("`", ba), dollarBraceL: new ya("${", { beforeExpr: true, startsExpr: true }), eq: new ya("=", { beforeExpr: true, isAssign: true }), assign: new ya("_=", { beforeExpr: true, isAssign: true }), incDec: new ya("++/--", { prefix: true, postfix: true, startsExpr: true }), prefix: new ya("!/~", { beforeExpr: true, prefix: true, startsExpr: true }), logicalOR: xa("||", 1), logicalAND: xa("&&", 2), bitwiseOR: xa("|", 3), bitwiseXOR: xa("^", 4), bitwiseAND: xa("&", 5), equality: xa("==/!=/===/!==", 6), relational: xa("</>/<=/>=", 7), bitShift: xa("<</>>/>>>", 8), plusMin: new ya("+/-", { beforeExpr: true, binop: 9, prefix: true, startsExpr: true }), modulo: xa("%", 10), star: xa("*", 10), slash: xa("/", 10), starstar: new ya("**", { beforeExpr: true }), coalesce: xa("??", 1), _break: Sa("break"), _case: Sa("case", Ea), _catch: Sa("catch"), _continue: Sa("continue"), _debugger: Sa("debugger"), _default: Sa("default", Ea), _do: Sa("do", { isLoop: true, beforeExpr: true }), _else: Sa("else", Ea), _finally: Sa("finally"), _for: Sa("for", { isLoop: true }), _function: Sa("function", ba), _if: Sa("if"), _return: Sa("return", Ea), _switch: Sa("switch"), _throw: Sa("throw", Ea), _try: Sa("try"), _var: Sa("var"), _const: Sa("const"), _while: Sa("while", { isLoop: true }), _with: Sa("with"), _new: Sa("new", { beforeExpr: true, startsExpr: true }), _this: Sa("this", ba), _super: Sa("super", ba), _class: Sa("class", ba), _extends: Sa("extends", Ea), _export: Sa("export"), _import: Sa("import", ba), _null: Sa("null", ba), _true: Sa("true", ba), _false: Sa("false", ba), _in: Sa("in", { beforeExpr: true, binop: 7 }), _instanceof: Sa("instanceof", { beforeExpr: true, binop: 7 }), _typeof: Sa("typeof", { beforeExpr: true, prefix: true, startsExpr: true }), _void: Sa("void", { beforeExpr: true, prefix: true, startsExpr: true }), _delete: Sa("delete", { beforeExpr: true, prefix: true, startsExpr: true }) }, Ia = /\r\n?|\n|\u2028|\u2029/, ka = new RegExp(Ia.source, "g");
function Pa(e2) {
  return e2 === 10 || e2 === 13 || e2 === 8232 || e2 === 8233;
}
function wa(e2, t, i) {
  i === void 0 && (i = e2.length);
  for (var s = t; s < i; s++) {
    var n2 = e2.charCodeAt(s);
    if (Pa(n2))
      return s < i - 1 && n2 === 13 && e2.charCodeAt(s + 1) === 10 ? s + 2 : s + 1;
  }
  return -1;
}
var Ca = /[\u1680\u2000-\u200a\u202f\u205f\u3000\ufeff]/, _a = /(?:\s|\/\/.*|\/\*[^]*?\*\/)*/g, Na = Object.prototype, $a = Na.hasOwnProperty, Ta = Na.toString, Oa = Object.hasOwn || function(e2, t) {
  return $a.call(e2, t);
}, Ra = Array.isArray || function(e2) {
  return Ta.call(e2) === "[object Array]";
};
function Ma(e2) {
  return new RegExp("^(?:" + e2.replace(/ /g, "|") + ")$");
}
function Da(e2) {
  return e2 <= 65535 ? String.fromCharCode(e2) : (e2 -= 65536, String.fromCharCode(55296 + (e2 >> 10), 56320 + (1023 & e2)));
}
var La = /(?:[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/, Va = function(e2, t) {
  this.line = e2, this.column = t;
};
Va.prototype.offset = function(e2) {
  return new Va(this.line, this.column + e2);
};
var Ba = function(e2, t, i) {
  this.start = t, this.end = i, e2.sourceFile !== null && (this.source = e2.sourceFile);
};
function Fa(e2, t) {
  for (var i = 1, s = 0; ; ) {
    var n2 = wa(e2, s, t);
    if (n2 < 0)
      return new Va(i, t - s);
    ++i, s = n2;
  }
}
var za = { ecmaVersion: null, sourceType: "script", onInsertedSemicolon: null, onTrailingComma: null, allowReserved: null, allowReturnOutsideFunction: false, allowImportExportEverywhere: false, allowAwaitOutsideFunction: null, allowSuperOutsideMethod: null, allowHashBang: false, locations: false, onToken: null, onComment: null, ranges: false, program: null, sourceFile: null, directSourceFile: null, preserveParens: false }, ja = false;
function Ua(e2) {
  var t = {};
  for (var i in za)
    t[i] = e2 && Oa(e2, i) ? e2[i] : za[i];
  if (t.ecmaVersion === "latest" ? t.ecmaVersion = 1e8 : t.ecmaVersion == null ? (!ja && typeof console == "object" && console.warn && (ja = true, console.warn("Since Acorn 8.0.0, options.ecmaVersion is required.\nDefaulting to 2020, but this will stop working in the future.")), t.ecmaVersion = 11) : t.ecmaVersion >= 2015 && (t.ecmaVersion -= 2009), t.allowReserved == null && (t.allowReserved = t.ecmaVersion < 5), Ra(t.onToken)) {
    var s = t.onToken;
    t.onToken = function(e3) {
      return s.push(e3);
    };
  }
  return Ra(t.onComment) && (t.onComment = function(e3, t2) {
    return function(i2, s2, n2, r2, a2, o2) {
      var l2 = { type: i2 ? "Block" : "Line", value: s2, start: n2, end: r2 };
      e3.locations && (l2.loc = new Ba(this, a2, o2)), e3.ranges && (l2.range = [n2, r2]), t2.push(l2);
    };
  }(t, t.onComment)), t;
}
function Ga(e2, t) {
  return 2 | (e2 ? 4 : 0) | (t ? 8 : 0);
}
var Ha = function(e2, t, i) {
  this.options = e2 = Ua(e2), this.sourceFile = e2.sourceFile, this.keywords = Ma(ca[e2.ecmaVersion >= 6 ? 6 : e2.sourceType === "module" ? "5module" : 5]);
  var s = "";
  e2.allowReserved !== true && (s = la[e2.ecmaVersion >= 6 ? 6 : e2.ecmaVersion === 5 ? 5 : 3], e2.sourceType === "module" && (s += " await")), this.reservedWords = Ma(s);
  var n2 = (s ? s + " " : "") + la.strict;
  this.reservedWordsStrict = Ma(n2), this.reservedWordsStrictBind = Ma(n2 + " " + la.strictBind), this.input = String(t), this.containsEsc = false, i ? (this.pos = i, this.lineStart = this.input.lastIndexOf("\n", i - 1) + 1, this.curLine = this.input.slice(0, this.lineStart).split(Ia).length) : (this.pos = this.lineStart = 0, this.curLine = 1), this.type = Aa.eof, this.value = null, this.start = this.end = this.pos, this.startLoc = this.endLoc = this.curPosition(), this.lastTokEndLoc = this.lastTokStartLoc = null, this.lastTokStart = this.lastTokEnd = this.pos, this.context = this.initialContext(), this.exprAllowed = true, this.inModule = e2.sourceType === "module", this.strict = this.inModule || this.strictDirective(this.pos), this.potentialArrowAt = -1, this.potentialArrowInForAwait = false, this.yieldPos = this.awaitPos = this.awaitIdentPos = 0, this.labels = [], this.undefinedExports = /* @__PURE__ */ Object.create(null), this.pos === 0 && e2.allowHashBang && this.input.slice(0, 2) === "#!" && this.skipLineComment(2), this.scopeStack = [], this.enterScope(1), this.regexpState = null, this.privateNameStack = [];
}, Wa = { inFunction: { configurable: true }, inGenerator: { configurable: true }, inAsync: { configurable: true }, canAwait: { configurable: true }, allowSuper: { configurable: true }, allowDirectSuper: { configurable: true }, treatFunctionsAsVar: { configurable: true }, allowNewDotTarget: { configurable: true }, inClassStaticBlock: { configurable: true } };
Ha.prototype.parse = function() {
  var e2 = this.options.program || this.startNode();
  return this.nextToken(), this.parseTopLevel(e2);
}, Wa.inFunction.get = function() {
  return (2 & this.currentVarScope().flags) > 0;
}, Wa.inGenerator.get = function() {
  return (8 & this.currentVarScope().flags) > 0 && !this.currentVarScope().inClassFieldInit;
}, Wa.inAsync.get = function() {
  return (4 & this.currentVarScope().flags) > 0 && !this.currentVarScope().inClassFieldInit;
}, Wa.canAwait.get = function() {
  for (var e2 = this.scopeStack.length - 1; e2 >= 0; e2--) {
    var t = this.scopeStack[e2];
    if (t.inClassFieldInit || 256 & t.flags)
      return false;
    if (2 & t.flags)
      return (4 & t.flags) > 0;
  }
  return this.inModule && this.options.ecmaVersion >= 13 || this.options.allowAwaitOutsideFunction;
}, Wa.allowSuper.get = function() {
  var e2 = this.currentThisScope(), t = e2.flags, i = e2.inClassFieldInit;
  return (64 & t) > 0 || i || this.options.allowSuperOutsideMethod;
}, Wa.allowDirectSuper.get = function() {
  return (128 & this.currentThisScope().flags) > 0;
}, Wa.treatFunctionsAsVar.get = function() {
  return this.treatFunctionsAsVarInScope(this.currentScope());
}, Wa.allowNewDotTarget.get = function() {
  var e2 = this.currentThisScope(), t = e2.flags, i = e2.inClassFieldInit;
  return (258 & t) > 0 || i;
}, Wa.inClassStaticBlock.get = function() {
  return (256 & this.currentVarScope().flags) > 0;
}, Ha.extend = function() {
  for (var e2 = [], t = arguments.length; t--; )
    e2[t] = arguments[t];
  for (var i = this, s = 0; s < e2.length; s++)
    i = e2[s](i);
  return i;
}, Ha.parse = function(e2, t) {
  return new this(t, e2).parse();
}, Ha.parseExpressionAt = function(e2, t, i) {
  var s = new this(i, e2, t);
  return s.nextToken(), s.parseExpression();
}, Ha.tokenizer = function(e2, t) {
  return new this(t, e2);
}, Object.defineProperties(Ha.prototype, Wa);
var qa = Ha.prototype, Ka = /^(?:'((?:\\.|[^'\\])*?)'|"((?:\\.|[^"\\])*?)")/;
qa.strictDirective = function(e2) {
  if (this.options.ecmaVersion < 5)
    return false;
  for (; ; ) {
    _a.lastIndex = e2, e2 += _a.exec(this.input)[0].length;
    var t = Ka.exec(this.input.slice(e2));
    if (!t)
      return false;
    if ((t[1] || t[2]) === "use strict") {
      _a.lastIndex = e2 + t[0].length;
      var i = _a.exec(this.input), s = i.index + i[0].length, n2 = this.input.charAt(s);
      return n2 === ";" || n2 === "}" || Ia.test(i[0]) && !(/[(`.[+\-/*%<>=,?^&]/.test(n2) || n2 === "!" && this.input.charAt(s + 1) === "=");
    }
    e2 += t[0].length, _a.lastIndex = e2, e2 += _a.exec(this.input)[0].length, this.input[e2] === ";" && e2++;
  }
}, qa.eat = function(e2) {
  return this.type === e2 && (this.next(), true);
}, qa.isContextual = function(e2) {
  return this.type === Aa.name && this.value === e2 && !this.containsEsc;
}, qa.eatContextual = function(e2) {
  return !!this.isContextual(e2) && (this.next(), true);
}, qa.expectContextual = function(e2) {
  this.eatContextual(e2) || this.unexpected();
}, qa.canInsertSemicolon = function() {
  return this.type === Aa.eof || this.type === Aa.braceR || Ia.test(this.input.slice(this.lastTokEnd, this.start));
}, qa.insertSemicolon = function() {
  if (this.canInsertSemicolon())
    return this.options.onInsertedSemicolon && this.options.onInsertedSemicolon(this.lastTokEnd, this.lastTokEndLoc), true;
}, qa.semicolon = function() {
  this.eat(Aa.semi) || this.insertSemicolon() || this.unexpected();
}, qa.afterTrailingComma = function(e2, t) {
  if (this.type === e2)
    return this.options.onTrailingComma && this.options.onTrailingComma(this.lastTokStart, this.lastTokStartLoc), t || this.next(), true;
}, qa.expect = function(e2) {
  this.eat(e2) || this.unexpected();
}, qa.unexpected = function(e2) {
  this.raise(e2 != null ? e2 : this.start, "Unexpected token");
};
var Xa = function() {
  this.shorthandAssign = this.trailingComma = this.parenthesizedAssign = this.parenthesizedBind = this.doubleProto = -1;
};
qa.checkPatternErrors = function(e2, t) {
  if (e2) {
    e2.trailingComma > -1 && this.raiseRecoverable(e2.trailingComma, "Comma is not permitted after the rest element");
    var i = t ? e2.parenthesizedAssign : e2.parenthesizedBind;
    i > -1 && this.raiseRecoverable(i, "Parenthesized pattern");
  }
}, qa.checkExpressionErrors = function(e2, t) {
  if (!e2)
    return false;
  var i = e2.shorthandAssign, s = e2.doubleProto;
  if (!t)
    return i >= 0 || s >= 0;
  i >= 0 && this.raise(i, "Shorthand property assignments are valid only in destructuring patterns"), s >= 0 && this.raiseRecoverable(s, "Redefinition of __proto__ property");
}, qa.checkYieldAwaitInDefaultParams = function() {
  this.yieldPos && (!this.awaitPos || this.yieldPos < this.awaitPos) && this.raise(this.yieldPos, "Yield expression cannot be a default value"), this.awaitPos && this.raise(this.awaitPos, "Await expression cannot be a default value");
}, qa.isSimpleAssignTarget = function(e2) {
  return e2.type === "ParenthesizedExpression" ? this.isSimpleAssignTarget(e2.expression) : e2.type === "Identifier" || e2.type === "MemberExpression";
};
var Ya = Ha.prototype;
Ya.parseTopLevel = function(e2) {
  var t = /* @__PURE__ */ Object.create(null);
  for (e2.body || (e2.body = []); this.type !== Aa.eof; ) {
    var i = this.parseStatement(null, true, t);
    e2.body.push(i);
  }
  if (this.inModule)
    for (var s = 0, n2 = Object.keys(this.undefinedExports); s < n2.length; s += 1) {
      var r2 = n2[s];
      this.raiseRecoverable(this.undefinedExports[r2].start, "Export '" + r2 + "' is not defined");
    }
  return this.adaptDirectivePrologue(e2.body), this.next(), e2.sourceType = this.options.sourceType, this.finishNode(e2, "Program");
};
var Qa = { kind: "loop" }, Za = { kind: "switch" };
Ya.isLet = function(e2) {
  if (this.options.ecmaVersion < 6 || !this.isContextual("let"))
    return false;
  _a.lastIndex = this.pos;
  var t = _a.exec(this.input), i = this.pos + t[0].length, s = this.input.charCodeAt(i);
  if (s === 91 || s === 92 || s > 55295 && s < 56320)
    return true;
  if (e2)
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
  var e2, t = _a.exec(this.input), i = this.pos + t[0].length;
  return !(Ia.test(this.input.slice(this.pos, i)) || this.input.slice(i, i + 8) !== "function" || i + 8 !== this.input.length && (ga(e2 = this.input.charCodeAt(i + 8)) || e2 > 55295 && e2 < 56320));
}, Ya.parseStatement = function(e2, t, i) {
  var s, n2 = this.type, r2 = this.startNode();
  switch (this.isLet(e2) && (n2 = Aa._var, s = "let"), n2) {
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
      return e2 && (this.strict || e2 !== "if" && e2 !== "label") && this.options.ecmaVersion >= 6 && this.unexpected(), this.parseFunctionStatement(r2, false, !e2);
    case Aa._class:
      return e2 && this.unexpected(), this.parseClass(r2, true);
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
      return s = s || this.value, e2 && s !== "var" && this.unexpected(), this.parseVarStatement(r2, s);
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
        var a2 = _a.exec(this.input), o2 = this.pos + a2[0].length, l2 = this.input.charCodeAt(o2);
        if (l2 === 40 || l2 === 46)
          return this.parseExpressionStatement(r2, this.parseExpression());
      }
      return this.options.allowImportExportEverywhere || (t || this.raise(this.start, "'import' and 'export' may only appear at the top level"), this.inModule || this.raise(this.start, "'import' and 'export' may appear only with 'sourceType: module'")), n2 === Aa._import ? this.parseImport(r2) : this.parseExport(r2, i);
    default:
      if (this.isAsyncFunction())
        return e2 && this.unexpected(), this.next(), this.parseFunctionStatement(r2, true, !e2);
      var h2 = this.value, c2 = this.parseExpression();
      return n2 === Aa.name && c2.type === "Identifier" && this.eat(Aa.colon) ? this.parseLabeledStatement(r2, h2, c2, e2) : this.parseExpressionStatement(r2, c2);
  }
}, Ya.parseBreakContinueStatement = function(e2, t) {
  var i = t === "break";
  this.next(), this.eat(Aa.semi) || this.insertSemicolon() ? e2.label = null : this.type !== Aa.name ? this.unexpected() : (e2.label = this.parseIdent(), this.semicolon());
  for (var s = 0; s < this.labels.length; ++s) {
    var n2 = this.labels[s];
    if (e2.label == null || n2.name === e2.label.name) {
      if (n2.kind != null && (i || n2.kind === "loop"))
        break;
      if (e2.label && i)
        break;
    }
  }
  return s === this.labels.length && this.raise(e2.start, "Unsyntactic " + t), this.finishNode(e2, i ? "BreakStatement" : "ContinueStatement");
}, Ya.parseDebuggerStatement = function(e2) {
  return this.next(), this.semicolon(), this.finishNode(e2, "DebuggerStatement");
}, Ya.parseDoStatement = function(e2) {
  return this.next(), this.labels.push(Qa), e2.body = this.parseStatement("do"), this.labels.pop(), this.expect(Aa._while), e2.test = this.parseParenExpression(), this.options.ecmaVersion >= 6 ? this.eat(Aa.semi) : this.semicolon(), this.finishNode(e2, "DoWhileStatement");
}, Ya.parseForStatement = function(e2) {
  this.next();
  var t = this.options.ecmaVersion >= 9 && this.canAwait && this.eatContextual("await") ? this.lastTokStart : -1;
  if (this.labels.push(Qa), this.enterScope(0), this.expect(Aa.parenL), this.type === Aa.semi)
    return t > -1 && this.unexpected(t), this.parseFor(e2, null);
  var i = this.isLet();
  if (this.type === Aa._var || this.type === Aa._const || i) {
    var s = this.startNode(), n2 = i ? "let" : this.value;
    return this.next(), this.parseVar(s, true, n2), this.finishNode(s, "VariableDeclaration"), (this.type === Aa._in || this.options.ecmaVersion >= 6 && this.isContextual("of")) && s.declarations.length === 1 ? (this.options.ecmaVersion >= 9 && (this.type === Aa._in ? t > -1 && this.unexpected(t) : e2.await = t > -1), this.parseForIn(e2, s)) : (t > -1 && this.unexpected(t), this.parseFor(e2, s));
  }
  var r2 = this.isContextual("let"), a2 = false, o2 = new Xa(), l2 = this.parseExpression(!(t > -1) || "await", o2);
  return this.type === Aa._in || (a2 = this.options.ecmaVersion >= 6 && this.isContextual("of")) ? (this.options.ecmaVersion >= 9 && (this.type === Aa._in ? t > -1 && this.unexpected(t) : e2.await = t > -1), r2 && a2 && this.raise(l2.start, "The left-hand side of a for-of loop may not start with 'let'."), this.toAssignable(l2, false, o2), this.checkLValPattern(l2), this.parseForIn(e2, l2)) : (this.checkExpressionErrors(o2, true), t > -1 && this.unexpected(t), this.parseFor(e2, l2));
}, Ya.parseFunctionStatement = function(e2, t, i) {
  return this.next(), this.parseFunction(e2, eo | (i ? 0 : to), false, t);
}, Ya.parseIfStatement = function(e2) {
  return this.next(), e2.test = this.parseParenExpression(), e2.consequent = this.parseStatement("if"), e2.alternate = this.eat(Aa._else) ? this.parseStatement("if") : null, this.finishNode(e2, "IfStatement");
}, Ya.parseReturnStatement = function(e2) {
  return this.inFunction || this.options.allowReturnOutsideFunction || this.raise(this.start, "'return' outside of function"), this.next(), this.eat(Aa.semi) || this.insertSemicolon() ? e2.argument = null : (e2.argument = this.parseExpression(), this.semicolon()), this.finishNode(e2, "ReturnStatement");
}, Ya.parseSwitchStatement = function(e2) {
  var t;
  this.next(), e2.discriminant = this.parseParenExpression(), e2.cases = [], this.expect(Aa.braceL), this.labels.push(Za), this.enterScope(0);
  for (var i = false; this.type !== Aa.braceR; )
    if (this.type === Aa._case || this.type === Aa._default) {
      var s = this.type === Aa._case;
      t && this.finishNode(t, "SwitchCase"), e2.cases.push(t = this.startNode()), t.consequent = [], this.next(), s ? t.test = this.parseExpression() : (i && this.raiseRecoverable(this.lastTokStart, "Multiple default clauses"), i = true, t.test = null), this.expect(Aa.colon);
    } else
      t || this.unexpected(), t.consequent.push(this.parseStatement(null));
  return this.exitScope(), t && this.finishNode(t, "SwitchCase"), this.next(), this.labels.pop(), this.finishNode(e2, "SwitchStatement");
}, Ya.parseThrowStatement = function(e2) {
  return this.next(), Ia.test(this.input.slice(this.lastTokEnd, this.start)) && this.raise(this.lastTokEnd, "Illegal newline after throw"), e2.argument = this.parseExpression(), this.semicolon(), this.finishNode(e2, "ThrowStatement");
};
var Ja = [];
Ya.parseTryStatement = function(e2) {
  if (this.next(), e2.block = this.parseBlock(), e2.handler = null, this.type === Aa._catch) {
    var t = this.startNode();
    if (this.next(), this.eat(Aa.parenL)) {
      t.param = this.parseBindingAtom();
      var i = t.param.type === "Identifier";
      this.enterScope(i ? 32 : 0), this.checkLValPattern(t.param, i ? 4 : 2), this.expect(Aa.parenR);
    } else
      this.options.ecmaVersion < 10 && this.unexpected(), t.param = null, this.enterScope(0);
    t.body = this.parseBlock(false), this.exitScope(), e2.handler = this.finishNode(t, "CatchClause");
  }
  return e2.finalizer = this.eat(Aa._finally) ? this.parseBlock() : null, e2.handler || e2.finalizer || this.raise(e2.start, "Missing catch or finally clause"), this.finishNode(e2, "TryStatement");
}, Ya.parseVarStatement = function(e2, t) {
  return this.next(), this.parseVar(e2, false, t), this.semicolon(), this.finishNode(e2, "VariableDeclaration");
}, Ya.parseWhileStatement = function(e2) {
  return this.next(), e2.test = this.parseParenExpression(), this.labels.push(Qa), e2.body = this.parseStatement("while"), this.labels.pop(), this.finishNode(e2, "WhileStatement");
}, Ya.parseWithStatement = function(e2) {
  return this.strict && this.raise(this.start, "'with' in strict mode"), this.next(), e2.object = this.parseParenExpression(), e2.body = this.parseStatement("with"), this.finishNode(e2, "WithStatement");
}, Ya.parseEmptyStatement = function(e2) {
  return this.next(), this.finishNode(e2, "EmptyStatement");
}, Ya.parseLabeledStatement = function(e2, t, i, s) {
  for (var n2 = 0, r2 = this.labels; n2 < r2.length; n2 += 1) {
    r2[n2].name === t && this.raise(i.start, "Label '" + t + "' is already declared");
  }
  for (var a2 = this.type.isLoop ? "loop" : this.type === Aa._switch ? "switch" : null, o2 = this.labels.length - 1; o2 >= 0; o2--) {
    var l2 = this.labels[o2];
    if (l2.statementStart !== e2.start)
      break;
    l2.statementStart = this.start, l2.kind = a2;
  }
  return this.labels.push({ name: t, kind: a2, statementStart: this.start }), e2.body = this.parseStatement(s ? s.indexOf("label") === -1 ? s + "label" : s : "label"), this.labels.pop(), e2.label = i, this.finishNode(e2, "LabeledStatement");
}, Ya.parseExpressionStatement = function(e2, t) {
  return e2.expression = t, this.semicolon(), this.finishNode(e2, "ExpressionStatement");
}, Ya.parseBlock = function(e2, t, i) {
  for (e2 === void 0 && (e2 = true), t === void 0 && (t = this.startNode()), t.body = [], this.expect(Aa.braceL), e2 && this.enterScope(0); this.type !== Aa.braceR; ) {
    var s = this.parseStatement(null);
    t.body.push(s);
  }
  return i && (this.strict = false), this.next(), e2 && this.exitScope(), this.finishNode(t, "BlockStatement");
}, Ya.parseFor = function(e2, t) {
  return e2.init = t, this.expect(Aa.semi), e2.test = this.type === Aa.semi ? null : this.parseExpression(), this.expect(Aa.semi), e2.update = this.type === Aa.parenR ? null : this.parseExpression(), this.expect(Aa.parenR), e2.body = this.parseStatement("for"), this.exitScope(), this.labels.pop(), this.finishNode(e2, "ForStatement");
}, Ya.parseForIn = function(e2, t) {
  var i = this.type === Aa._in;
  return this.next(), t.type === "VariableDeclaration" && t.declarations[0].init != null && (!i || this.options.ecmaVersion < 8 || this.strict || t.kind !== "var" || t.declarations[0].id.type !== "Identifier") && this.raise(t.start, (i ? "for-in" : "for-of") + " loop variable declaration may not have an initializer"), e2.left = t, e2.right = i ? this.parseExpression() : this.parseMaybeAssign(), this.expect(Aa.parenR), e2.body = this.parseStatement("for"), this.exitScope(), this.labels.pop(), this.finishNode(e2, i ? "ForInStatement" : "ForOfStatement");
}, Ya.parseVar = function(e2, t, i) {
  for (e2.declarations = [], e2.kind = i; ; ) {
    var s = this.startNode();
    if (this.parseVarId(s, i), this.eat(Aa.eq) ? s.init = this.parseMaybeAssign(t) : i !== "const" || this.type === Aa._in || this.options.ecmaVersion >= 6 && this.isContextual("of") ? s.id.type === "Identifier" || t && (this.type === Aa._in || this.isContextual("of")) ? s.init = null : this.raise(this.lastTokEnd, "Complex binding patterns require an initialization value") : this.unexpected(), e2.declarations.push(this.finishNode(s, "VariableDeclarator")), !this.eat(Aa.comma))
      break;
  }
  return e2;
}, Ya.parseVarId = function(e2, t) {
  e2.id = this.parseBindingAtom(), this.checkLValPattern(e2.id, t === "var" ? 1 : 2, false);
};
var eo = 1, to = 2;
function io(e2, t) {
  var i = t.key.name, s = e2[i], n2 = "true";
  return t.type !== "MethodDefinition" || t.kind !== "get" && t.kind !== "set" || (n2 = (t.static ? "s" : "i") + t.kind), s === "iget" && n2 === "iset" || s === "iset" && n2 === "iget" || s === "sget" && n2 === "sset" || s === "sset" && n2 === "sget" ? (e2[i] = "true", false) : !!s || (e2[i] = n2, false);
}
function so(e2, t) {
  var i = e2.computed, s = e2.key;
  return !i && (s.type === "Identifier" && s.name === t || s.type === "Literal" && s.value === t);
}
Ya.parseFunction = function(e2, t, i, s, n2) {
  this.initFunction(e2), (this.options.ecmaVersion >= 9 || this.options.ecmaVersion >= 6 && !s) && (this.type === Aa.star && t & to && this.unexpected(), e2.generator = this.eat(Aa.star)), this.options.ecmaVersion >= 8 && (e2.async = !!s), t & eo && (e2.id = 4 & t && this.type !== Aa.name ? null : this.parseIdent(), !e2.id || t & to || this.checkLValSimple(e2.id, this.strict || e2.generator || e2.async ? this.treatFunctionsAsVar ? 1 : 2 : 3));
  var r2 = this.yieldPos, a2 = this.awaitPos, o2 = this.awaitIdentPos;
  return this.yieldPos = 0, this.awaitPos = 0, this.awaitIdentPos = 0, this.enterScope(Ga(e2.async, e2.generator)), t & eo || (e2.id = this.type === Aa.name ? this.parseIdent() : null), this.parseFunctionParams(e2), this.parseFunctionBody(e2, i, false, n2), this.yieldPos = r2, this.awaitPos = a2, this.awaitIdentPos = o2, this.finishNode(e2, t & eo ? "FunctionDeclaration" : "FunctionExpression");
}, Ya.parseFunctionParams = function(e2) {
  this.expect(Aa.parenL), e2.params = this.parseBindingList(Aa.parenR, false, this.options.ecmaVersion >= 8), this.checkYieldAwaitInDefaultParams();
}, Ya.parseClass = function(e2, t) {
  this.next();
  var i = this.strict;
  this.strict = true, this.parseClassId(e2, t), this.parseClassSuper(e2);
  var s = this.enterClassBody(), n2 = this.startNode(), r2 = false;
  for (n2.body = [], this.expect(Aa.braceL); this.type !== Aa.braceR; ) {
    var a2 = this.parseClassElement(e2.superClass !== null);
    a2 && (n2.body.push(a2), a2.type === "MethodDefinition" && a2.kind === "constructor" ? (r2 && this.raise(a2.start, "Duplicate constructor in the same class"), r2 = true) : a2.key && a2.key.type === "PrivateIdentifier" && io(s, a2) && this.raiseRecoverable(a2.key.start, "Identifier '#" + a2.key.name + "' has already been declared"));
  }
  return this.strict = i, this.next(), e2.body = this.finishNode(n2, "ClassBody"), this.exitClassBody(), this.finishNode(e2, t ? "ClassDeclaration" : "ClassExpression");
}, Ya.parseClassElement = function(e2) {
  if (this.eat(Aa.semi))
    return null;
  var t = this.options.ecmaVersion, i = this.startNode(), s = "", n2 = false, r2 = false, a2 = "method", o2 = false;
  if (this.eatContextual("static")) {
    if (t >= 13 && this.eat(Aa.braceL))
      return this.parseClassStaticBlock(i), i;
    this.isClassElementNameStart() || this.type === Aa.star ? o2 = true : s = "static";
  }
  if (i.static = o2, !s && t >= 8 && this.eatContextual("async") && (!this.isClassElementNameStart() && this.type !== Aa.star || this.canInsertSemicolon() ? s = "async" : r2 = true), !s && (t >= 9 || !r2) && this.eat(Aa.star) && (n2 = true), !s && !r2 && !n2) {
    var l2 = this.value;
    (this.eatContextual("get") || this.eatContextual("set")) && (this.isClassElementNameStart() ? a2 = l2 : s = l2);
  }
  if (s ? (i.computed = false, i.key = this.startNodeAt(this.lastTokStart, this.lastTokStartLoc), i.key.name = s, this.finishNode(i.key, "Identifier")) : this.parseClassElementName(i), t < 13 || this.type === Aa.parenL || a2 !== "method" || n2 || r2) {
    var h2 = !i.static && so(i, "constructor"), c2 = h2 && e2;
    h2 && a2 !== "method" && this.raise(i.key.start, "Constructor can't have get/set modifier"), i.kind = h2 ? "constructor" : a2, this.parseClassMethod(i, n2, r2, c2);
  } else
    this.parseClassField(i);
  return i;
}, Ya.isClassElementNameStart = function() {
  return this.type === Aa.name || this.type === Aa.privateId || this.type === Aa.num || this.type === Aa.string || this.type === Aa.bracketL || this.type.keyword;
}, Ya.parseClassElementName = function(e2) {
  this.type === Aa.privateId ? (this.value === "constructor" && this.raise(this.start, "Classes can't have an element named '#constructor'"), e2.computed = false, e2.key = this.parsePrivateIdent()) : this.parsePropertyName(e2);
}, Ya.parseClassMethod = function(e2, t, i, s) {
  var n2 = e2.key;
  e2.kind === "constructor" ? (t && this.raise(n2.start, "Constructor can't be a generator"), i && this.raise(n2.start, "Constructor can't be an async method")) : e2.static && so(e2, "prototype") && this.raise(n2.start, "Classes may not have a static property named prototype");
  var r2 = e2.value = this.parseMethod(t, i, s);
  return e2.kind === "get" && r2.params.length !== 0 && this.raiseRecoverable(r2.start, "getter should have no params"), e2.kind === "set" && r2.params.length !== 1 && this.raiseRecoverable(r2.start, "setter should have exactly one param"), e2.kind === "set" && r2.params[0].type === "RestElement" && this.raiseRecoverable(r2.params[0].start, "Setter cannot use rest params"), this.finishNode(e2, "MethodDefinition");
}, Ya.parseClassField = function(e2) {
  if (so(e2, "constructor") ? this.raise(e2.key.start, "Classes can't have a field named 'constructor'") : e2.static && so(e2, "prototype") && this.raise(e2.key.start, "Classes can't have a static field named 'prototype'"), this.eat(Aa.eq)) {
    var t = this.currentThisScope(), i = t.inClassFieldInit;
    t.inClassFieldInit = true, e2.value = this.parseMaybeAssign(), t.inClassFieldInit = i;
  } else
    e2.value = null;
  return this.semicolon(), this.finishNode(e2, "PropertyDefinition");
}, Ya.parseClassStaticBlock = function(e2) {
  e2.body = [];
  var t = this.labels;
  for (this.labels = [], this.enterScope(320); this.type !== Aa.braceR; ) {
    var i = this.parseStatement(null);
    e2.body.push(i);
  }
  return this.next(), this.exitScope(), this.labels = t, this.finishNode(e2, "StaticBlock");
}, Ya.parseClassId = function(e2, t) {
  this.type === Aa.name ? (e2.id = this.parseIdent(), t && this.checkLValSimple(e2.id, 2, false)) : (t === true && this.unexpected(), e2.id = null);
}, Ya.parseClassSuper = function(e2) {
  e2.superClass = this.eat(Aa._extends) ? this.parseExprSubscripts(false) : null;
}, Ya.enterClassBody = function() {
  var e2 = { declared: /* @__PURE__ */ Object.create(null), used: [] };
  return this.privateNameStack.push(e2), e2.declared;
}, Ya.exitClassBody = function() {
  for (var e2 = this.privateNameStack.pop(), t = e2.declared, i = e2.used, s = this.privateNameStack.length, n2 = s === 0 ? null : this.privateNameStack[s - 1], r2 = 0; r2 < i.length; ++r2) {
    var a2 = i[r2];
    Oa(t, a2.name) || (n2 ? n2.used.push(a2) : this.raiseRecoverable(a2.start, "Private field '#" + a2.name + "' must be declared in an enclosing class"));
  }
}, Ya.parseExport = function(e2, t) {
  if (this.next(), this.eat(Aa.star))
    return this.options.ecmaVersion >= 11 && (this.eatContextual("as") ? (e2.exported = this.parseModuleExportName(), this.checkExport(t, e2.exported, this.lastTokStart)) : e2.exported = null), this.expectContextual("from"), this.type !== Aa.string && this.unexpected(), e2.source = this.parseExprAtom(), this.semicolon(), this.finishNode(e2, "ExportAllDeclaration");
  if (this.eat(Aa._default)) {
    var i;
    if (this.checkExport(t, "default", this.lastTokStart), this.type === Aa._function || (i = this.isAsyncFunction())) {
      var s = this.startNode();
      this.next(), i && this.next(), e2.declaration = this.parseFunction(s, 4 | eo, false, i);
    } else if (this.type === Aa._class) {
      var n2 = this.startNode();
      e2.declaration = this.parseClass(n2, "nullableID");
    } else
      e2.declaration = this.parseMaybeAssign(), this.semicolon();
    return this.finishNode(e2, "ExportDefaultDeclaration");
  }
  if (this.shouldParseExportStatement())
    e2.declaration = this.parseStatement(null), e2.declaration.type === "VariableDeclaration" ? this.checkVariableExport(t, e2.declaration.declarations) : this.checkExport(t, e2.declaration.id, e2.declaration.id.start), e2.specifiers = [], e2.source = null;
  else {
    if (e2.declaration = null, e2.specifiers = this.parseExportSpecifiers(t), this.eatContextual("from"))
      this.type !== Aa.string && this.unexpected(), e2.source = this.parseExprAtom();
    else {
      for (var r2 = 0, a2 = e2.specifiers; r2 < a2.length; r2 += 1) {
        var o2 = a2[r2];
        this.checkUnreserved(o2.local), this.checkLocalExport(o2.local), o2.local.type === "Literal" && this.raise(o2.local.start, "A string literal cannot be used as an exported binding without `from`.");
      }
      e2.source = null;
    }
    this.semicolon();
  }
  return this.finishNode(e2, "ExportNamedDeclaration");
}, Ya.checkExport = function(e2, t, i) {
  e2 && (typeof t != "string" && (t = t.type === "Identifier" ? t.name : t.value), Oa(e2, t) && this.raiseRecoverable(i, "Duplicate export '" + t + "'"), e2[t] = true);
}, Ya.checkPatternExport = function(e2, t) {
  var i = t.type;
  if (i === "Identifier")
    this.checkExport(e2, t, t.start);
  else if (i === "ObjectPattern")
    for (var s = 0, n2 = t.properties; s < n2.length; s += 1) {
      var r2 = n2[s];
      this.checkPatternExport(e2, r2);
    }
  else if (i === "ArrayPattern")
    for (var a2 = 0, o2 = t.elements; a2 < o2.length; a2 += 1) {
      var l2 = o2[a2];
      l2 && this.checkPatternExport(e2, l2);
    }
  else
    i === "Property" ? this.checkPatternExport(e2, t.value) : i === "AssignmentPattern" ? this.checkPatternExport(e2, t.left) : i === "RestElement" ? this.checkPatternExport(e2, t.argument) : i === "ParenthesizedExpression" && this.checkPatternExport(e2, t.expression);
}, Ya.checkVariableExport = function(e2, t) {
  if (e2)
    for (var i = 0, s = t; i < s.length; i += 1) {
      var n2 = s[i];
      this.checkPatternExport(e2, n2.id);
    }
}, Ya.shouldParseExportStatement = function() {
  return this.type.keyword === "var" || this.type.keyword === "const" || this.type.keyword === "class" || this.type.keyword === "function" || this.isLet() || this.isAsyncFunction();
}, Ya.parseExportSpecifiers = function(e2) {
  var t = [], i = true;
  for (this.expect(Aa.braceL); !this.eat(Aa.braceR); ) {
    if (i)
      i = false;
    else if (this.expect(Aa.comma), this.afterTrailingComma(Aa.braceR))
      break;
    var s = this.startNode();
    s.local = this.parseModuleExportName(), s.exported = this.eatContextual("as") ? this.parseModuleExportName() : s.local, this.checkExport(e2, s.exported, s.exported.start), t.push(this.finishNode(s, "ExportSpecifier"));
  }
  return t;
}, Ya.parseImport = function(e2) {
  return this.next(), this.type === Aa.string ? (e2.specifiers = Ja, e2.source = this.parseExprAtom()) : (e2.specifiers = this.parseImportSpecifiers(), this.expectContextual("from"), e2.source = this.type === Aa.string ? this.parseExprAtom() : this.unexpected()), this.semicolon(), this.finishNode(e2, "ImportDeclaration");
}, Ya.parseImportSpecifiers = function() {
  var e2 = [], t = true;
  if (this.type === Aa.name) {
    var i = this.startNode();
    if (i.local = this.parseIdent(), this.checkLValSimple(i.local, 2), e2.push(this.finishNode(i, "ImportDefaultSpecifier")), !this.eat(Aa.comma))
      return e2;
  }
  if (this.type === Aa.star) {
    var s = this.startNode();
    return this.next(), this.expectContextual("as"), s.local = this.parseIdent(), this.checkLValSimple(s.local, 2), e2.push(this.finishNode(s, "ImportNamespaceSpecifier")), e2;
  }
  for (this.expect(Aa.braceL); !this.eat(Aa.braceR); ) {
    if (t)
      t = false;
    else if (this.expect(Aa.comma), this.afterTrailingComma(Aa.braceR))
      break;
    var n2 = this.startNode();
    n2.imported = this.parseModuleExportName(), this.eatContextual("as") ? n2.local = this.parseIdent() : (this.checkUnreserved(n2.imported), n2.local = n2.imported), this.checkLValSimple(n2.local, 2), e2.push(this.finishNode(n2, "ImportSpecifier"));
  }
  return e2;
}, Ya.parseModuleExportName = function() {
  if (this.options.ecmaVersion >= 13 && this.type === Aa.string) {
    var e2 = this.parseLiteral(this.value);
    return La.test(e2.value) && this.raise(e2.start, "An export name cannot include a lone surrogate."), e2;
  }
  return this.parseIdent(true);
}, Ya.adaptDirectivePrologue = function(e2) {
  for (var t = 0; t < e2.length && this.isDirectiveCandidate(e2[t]); ++t)
    e2[t].directive = e2[t].expression.raw.slice(1, -1);
}, Ya.isDirectiveCandidate = function(e2) {
  return e2.type === "ExpressionStatement" && e2.expression.type === "Literal" && typeof e2.expression.value == "string" && (this.input[e2.start] === '"' || this.input[e2.start] === "'");
};
var no = Ha.prototype;
no.toAssignable = function(e2, t, i) {
  if (this.options.ecmaVersion >= 6 && e2)
    switch (e2.type) {
      case "Identifier":
        this.inAsync && e2.name === "await" && this.raise(e2.start, "Cannot use 'await' as identifier inside an async function");
        break;
      case "ObjectPattern":
      case "ArrayPattern":
      case "AssignmentPattern":
      case "RestElement":
        break;
      case "ObjectExpression":
        e2.type = "ObjectPattern", i && this.checkPatternErrors(i, true);
        for (var s = 0, n2 = e2.properties; s < n2.length; s += 1) {
          var r2 = n2[s];
          this.toAssignable(r2, t), r2.type !== "RestElement" || r2.argument.type !== "ArrayPattern" && r2.argument.type !== "ObjectPattern" || this.raise(r2.argument.start, "Unexpected token");
        }
        break;
      case "Property":
        e2.kind !== "init" && this.raise(e2.key.start, "Object pattern can't contain getter or setter"), this.toAssignable(e2.value, t);
        break;
      case "ArrayExpression":
        e2.type = "ArrayPattern", i && this.checkPatternErrors(i, true), this.toAssignableList(e2.elements, t);
        break;
      case "SpreadElement":
        e2.type = "RestElement", this.toAssignable(e2.argument, t), e2.argument.type === "AssignmentPattern" && this.raise(e2.argument.start, "Rest elements cannot have a default value");
        break;
      case "AssignmentExpression":
        e2.operator !== "=" && this.raise(e2.left.end, "Only '=' operator can be used for specifying default value."), e2.type = "AssignmentPattern", delete e2.operator, this.toAssignable(e2.left, t);
        break;
      case "ParenthesizedExpression":
        this.toAssignable(e2.expression, t, i);
        break;
      case "ChainExpression":
        this.raiseRecoverable(e2.start, "Optional chaining cannot appear in left-hand side");
        break;
      case "MemberExpression":
        if (!t)
          break;
      default:
        this.raise(e2.start, "Assigning to rvalue");
    }
  else
    i && this.checkPatternErrors(i, true);
  return e2;
}, no.toAssignableList = function(e2, t) {
  for (var i = e2.length, s = 0; s < i; s++) {
    var n2 = e2[s];
    n2 && this.toAssignable(n2, t);
  }
  if (i) {
    var r2 = e2[i - 1];
    this.options.ecmaVersion === 6 && t && r2 && r2.type === "RestElement" && r2.argument.type !== "Identifier" && this.unexpected(r2.argument.start);
  }
  return e2;
}, no.parseSpread = function(e2) {
  var t = this.startNode();
  return this.next(), t.argument = this.parseMaybeAssign(false, e2), this.finishNode(t, "SpreadElement");
}, no.parseRestBinding = function() {
  var e2 = this.startNode();
  return this.next(), this.options.ecmaVersion === 6 && this.type !== Aa.name && this.unexpected(), e2.argument = this.parseBindingAtom(), this.finishNode(e2, "RestElement");
}, no.parseBindingAtom = function() {
  if (this.options.ecmaVersion >= 6)
    switch (this.type) {
      case Aa.bracketL:
        var e2 = this.startNode();
        return this.next(), e2.elements = this.parseBindingList(Aa.bracketR, true, true), this.finishNode(e2, "ArrayPattern");
      case Aa.braceL:
        return this.parseObj(true);
    }
  return this.parseIdent();
}, no.parseBindingList = function(e2, t, i) {
  for (var s = [], n2 = true; !this.eat(e2); )
    if (n2 ? n2 = false : this.expect(Aa.comma), t && this.type === Aa.comma)
      s.push(null);
    else {
      if (i && this.afterTrailingComma(e2))
        break;
      if (this.type === Aa.ellipsis) {
        var r2 = this.parseRestBinding();
        this.parseBindingListItem(r2), s.push(r2), this.type === Aa.comma && this.raise(this.start, "Comma is not permitted after the rest element"), this.expect(e2);
        break;
      }
      var a2 = this.parseMaybeDefault(this.start, this.startLoc);
      this.parseBindingListItem(a2), s.push(a2);
    }
  return s;
}, no.parseBindingListItem = function(e2) {
  return e2;
}, no.parseMaybeDefault = function(e2, t, i) {
  if (i = i || this.parseBindingAtom(), this.options.ecmaVersion < 6 || !this.eat(Aa.eq))
    return i;
  var s = this.startNodeAt(e2, t);
  return s.left = i, s.right = this.parseMaybeAssign(), this.finishNode(s, "AssignmentPattern");
}, no.checkLValSimple = function(e2, t, i) {
  t === void 0 && (t = 0);
  var s = t !== 0;
  switch (e2.type) {
    case "Identifier":
      this.strict && this.reservedWordsStrictBind.test(e2.name) && this.raiseRecoverable(e2.start, (s ? "Binding " : "Assigning to ") + e2.name + " in strict mode"), s && (t === 2 && e2.name === "let" && this.raiseRecoverable(e2.start, "let is disallowed as a lexically bound name"), i && (Oa(i, e2.name) && this.raiseRecoverable(e2.start, "Argument name clash"), i[e2.name] = true), t !== 5 && this.declareName(e2.name, t, e2.start));
      break;
    case "ChainExpression":
      this.raiseRecoverable(e2.start, "Optional chaining cannot appear in left-hand side");
      break;
    case "MemberExpression":
      s && this.raiseRecoverable(e2.start, "Binding member expression");
      break;
    case "ParenthesizedExpression":
      return s && this.raiseRecoverable(e2.start, "Binding parenthesized expression"), this.checkLValSimple(e2.expression, t, i);
    default:
      this.raise(e2.start, (s ? "Binding" : "Assigning to") + " rvalue");
  }
}, no.checkLValPattern = function(e2, t, i) {
  switch (t === void 0 && (t = 0), e2.type) {
    case "ObjectPattern":
      for (var s = 0, n2 = e2.properties; s < n2.length; s += 1) {
        var r2 = n2[s];
        this.checkLValInnerPattern(r2, t, i);
      }
      break;
    case "ArrayPattern":
      for (var a2 = 0, o2 = e2.elements; a2 < o2.length; a2 += 1) {
        var l2 = o2[a2];
        l2 && this.checkLValInnerPattern(l2, t, i);
      }
      break;
    default:
      this.checkLValSimple(e2, t, i);
  }
}, no.checkLValInnerPattern = function(e2, t, i) {
  switch (t === void 0 && (t = 0), e2.type) {
    case "Property":
      this.checkLValInnerPattern(e2.value, t, i);
      break;
    case "AssignmentPattern":
      this.checkLValPattern(e2.left, t, i);
      break;
    case "RestElement":
      this.checkLValPattern(e2.argument, t, i);
      break;
    default:
      this.checkLValPattern(e2, t, i);
  }
};
var ro = function(e2, t, i, s, n2) {
  this.token = e2, this.isExpr = !!t, this.preserveSpace = !!i, this.override = s, this.generator = !!n2;
}, ao = { b_stat: new ro("{", false), b_expr: new ro("{", true), b_tmpl: new ro("${", false), p_stat: new ro("(", false), p_expr: new ro("(", true), q_tmpl: new ro("`", true, true, function(e2) {
  return e2.tryReadTemplateToken();
}), f_stat: new ro("function", false), f_expr: new ro("function", true), f_expr_gen: new ro("function", true, false, null, true), f_gen: new ro("function", false, false, null, true) }, oo = Ha.prototype;
oo.initialContext = function() {
  return [ao.b_stat];
}, oo.curContext = function() {
  return this.context[this.context.length - 1];
}, oo.braceIsBlock = function(e2) {
  var t = this.curContext();
  return t === ao.f_expr || t === ao.f_stat || (e2 !== Aa.colon || t !== ao.b_stat && t !== ao.b_expr ? e2 === Aa._return || e2 === Aa.name && this.exprAllowed ? Ia.test(this.input.slice(this.lastTokEnd, this.start)) : e2 === Aa._else || e2 === Aa.semi || e2 === Aa.eof || e2 === Aa.parenR || e2 === Aa.arrow || (e2 === Aa.braceL ? t === ao.b_stat : e2 !== Aa._var && e2 !== Aa._const && e2 !== Aa.name && !this.exprAllowed) : !t.isExpr);
}, oo.inGeneratorContext = function() {
  for (var e2 = this.context.length - 1; e2 >= 1; e2--) {
    var t = this.context[e2];
    if (t.token === "function")
      return t.generator;
  }
  return false;
}, oo.updateContext = function(e2) {
  var t, i = this.type;
  i.keyword && e2 === Aa.dot ? this.exprAllowed = false : (t = i.updateContext) ? t.call(this, e2) : this.exprAllowed = i.beforeExpr;
}, oo.overrideContext = function(e2) {
  this.curContext() !== e2 && (this.context[this.context.length - 1] = e2);
}, Aa.parenR.updateContext = Aa.braceR.updateContext = function() {
  if (this.context.length !== 1) {
    var e2 = this.context.pop();
    e2 === ao.b_stat && this.curContext().token === "function" && (e2 = this.context.pop()), this.exprAllowed = !e2.isExpr;
  } else
    this.exprAllowed = true;
}, Aa.braceL.updateContext = function(e2) {
  this.context.push(this.braceIsBlock(e2) ? ao.b_stat : ao.b_expr), this.exprAllowed = true;
}, Aa.dollarBraceL.updateContext = function() {
  this.context.push(ao.b_tmpl), this.exprAllowed = true;
}, Aa.parenL.updateContext = function(e2) {
  var t = e2 === Aa._if || e2 === Aa._for || e2 === Aa._with || e2 === Aa._while;
  this.context.push(t ? ao.p_stat : ao.p_expr), this.exprAllowed = true;
}, Aa.incDec.updateContext = function() {
}, Aa._function.updateContext = Aa._class.updateContext = function(e2) {
  !e2.beforeExpr || e2 === Aa._else || e2 === Aa.semi && this.curContext() !== ao.p_stat || e2 === Aa._return && Ia.test(this.input.slice(this.lastTokEnd, this.start)) || (e2 === Aa.colon || e2 === Aa.braceL) && this.curContext() === ao.b_stat ? this.context.push(ao.f_stat) : this.context.push(ao.f_expr), this.exprAllowed = false;
}, Aa.backQuote.updateContext = function() {
  this.curContext() === ao.q_tmpl ? this.context.pop() : this.context.push(ao.q_tmpl), this.exprAllowed = false;
}, Aa.star.updateContext = function(e2) {
  if (e2 === Aa._function) {
    var t = this.context.length - 1;
    this.context[t] === ao.f_expr ? this.context[t] = ao.f_expr_gen : this.context[t] = ao.f_gen;
  }
  this.exprAllowed = true;
}, Aa.name.updateContext = function(e2) {
  var t = false;
  this.options.ecmaVersion >= 6 && e2 !== Aa.dot && (this.value === "of" && !this.exprAllowed || this.value === "yield" && this.inGeneratorContext()) && (t = true), this.exprAllowed = t;
};
var lo = Ha.prototype;
function ho(e2) {
  return e2.type === "MemberExpression" && e2.property.type === "PrivateIdentifier" || e2.type === "ChainExpression" && ho(e2.expression);
}
lo.checkPropClash = function(e2, t, i) {
  if (!(this.options.ecmaVersion >= 9 && e2.type === "SpreadElement" || this.options.ecmaVersion >= 6 && (e2.computed || e2.method || e2.shorthand))) {
    var s, n2 = e2.key;
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
    var r2 = e2.kind;
    if (this.options.ecmaVersion >= 6)
      s === "__proto__" && r2 === "init" && (t.proto && (i ? i.doubleProto < 0 && (i.doubleProto = n2.start) : this.raiseRecoverable(n2.start, "Redefinition of __proto__ property")), t.proto = true);
    else {
      var a2 = t[s = "$" + s];
      if (a2)
        (r2 === "init" ? this.strict && a2.init || a2.get || a2.set : a2.init || a2[r2]) && this.raiseRecoverable(n2.start, "Redefinition of property");
      else
        a2 = t[s] = { init: false, get: false, set: false };
      a2[r2] = true;
    }
  }
}, lo.parseExpression = function(e2, t) {
  var i = this.start, s = this.startLoc, n2 = this.parseMaybeAssign(e2, t);
  if (this.type === Aa.comma) {
    var r2 = this.startNodeAt(i, s);
    for (r2.expressions = [n2]; this.eat(Aa.comma); )
      r2.expressions.push(this.parseMaybeAssign(e2, t));
    return this.finishNode(r2, "SequenceExpression");
  }
  return n2;
}, lo.parseMaybeAssign = function(e2, t, i) {
  if (this.isContextual("yield")) {
    if (this.inGenerator)
      return this.parseYield(e2);
    this.exprAllowed = false;
  }
  var s = false, n2 = -1, r2 = -1, a2 = -1;
  t ? (n2 = t.parenthesizedAssign, r2 = t.trailingComma, a2 = t.doubleProto, t.parenthesizedAssign = t.trailingComma = -1) : (t = new Xa(), s = true);
  var o2 = this.start, l2 = this.startLoc;
  this.type !== Aa.parenL && this.type !== Aa.name || (this.potentialArrowAt = this.start, this.potentialArrowInForAwait = e2 === "await");
  var h2 = this.parseMaybeConditional(e2, t);
  if (i && (h2 = i.call(this, h2, o2, l2)), this.type.isAssign) {
    var c2 = this.startNodeAt(o2, l2);
    return c2.operator = this.value, this.type === Aa.eq && (h2 = this.toAssignable(h2, false, t)), s || (t.parenthesizedAssign = t.trailingComma = t.doubleProto = -1), t.shorthandAssign >= h2.start && (t.shorthandAssign = -1), this.type === Aa.eq ? this.checkLValPattern(h2) : this.checkLValSimple(h2), c2.left = h2, this.next(), c2.right = this.parseMaybeAssign(e2), a2 > -1 && (t.doubleProto = a2), this.finishNode(c2, "AssignmentExpression");
  }
  return s && this.checkExpressionErrors(t, true), n2 > -1 && (t.parenthesizedAssign = n2), r2 > -1 && (t.trailingComma = r2), h2;
}, lo.parseMaybeConditional = function(e2, t) {
  var i = this.start, s = this.startLoc, n2 = this.parseExprOps(e2, t);
  if (this.checkExpressionErrors(t))
    return n2;
  if (this.eat(Aa.question)) {
    var r2 = this.startNodeAt(i, s);
    return r2.test = n2, r2.consequent = this.parseMaybeAssign(), this.expect(Aa.colon), r2.alternate = this.parseMaybeAssign(e2), this.finishNode(r2, "ConditionalExpression");
  }
  return n2;
}, lo.parseExprOps = function(e2, t) {
  var i = this.start, s = this.startLoc, n2 = this.parseMaybeUnary(t, false, false, e2);
  return this.checkExpressionErrors(t) || n2.start === i && n2.type === "ArrowFunctionExpression" ? n2 : this.parseExprOp(n2, i, s, -1, e2);
}, lo.parseExprOp = function(e2, t, i, s, n2) {
  var r2 = this.type.binop;
  if (r2 != null && (!n2 || this.type !== Aa._in) && r2 > s) {
    var a2 = this.type === Aa.logicalOR || this.type === Aa.logicalAND, o2 = this.type === Aa.coalesce;
    o2 && (r2 = Aa.logicalAND.binop);
    var l2 = this.value;
    this.next();
    var h2 = this.start, c2 = this.startLoc, u2 = this.parseExprOp(this.parseMaybeUnary(null, false, false, n2), h2, c2, r2, n2), d2 = this.buildBinary(t, i, e2, u2, l2, a2 || o2);
    return (a2 && this.type === Aa.coalesce || o2 && (this.type === Aa.logicalOR || this.type === Aa.logicalAND)) && this.raiseRecoverable(this.start, "Logical expressions and coalesce expressions cannot be mixed. Wrap either by parentheses"), this.parseExprOp(d2, t, i, s, n2);
  }
  return e2;
}, lo.buildBinary = function(e2, t, i, s, n2, r2) {
  s.type === "PrivateIdentifier" && this.raise(s.start, "Private identifier can only be left side of binary expression");
  var a2 = this.startNodeAt(e2, t);
  return a2.left = i, a2.operator = n2, a2.right = s, this.finishNode(a2, r2 ? "LogicalExpression" : "BinaryExpression");
}, lo.parseMaybeUnary = function(e2, t, i, s) {
  var n2, r2 = this.start, a2 = this.startLoc;
  if (this.isContextual("await") && this.canAwait)
    n2 = this.parseAwait(s), t = true;
  else if (this.type.prefix) {
    var o2 = this.startNode(), l2 = this.type === Aa.incDec;
    o2.operator = this.value, o2.prefix = true, this.next(), o2.argument = this.parseMaybeUnary(null, true, l2, s), this.checkExpressionErrors(e2, true), l2 ? this.checkLValSimple(o2.argument) : this.strict && o2.operator === "delete" && o2.argument.type === "Identifier" ? this.raiseRecoverable(o2.start, "Deleting local variable in strict mode") : o2.operator === "delete" && ho(o2.argument) ? this.raiseRecoverable(o2.start, "Private fields can not be deleted") : t = true, n2 = this.finishNode(o2, l2 ? "UpdateExpression" : "UnaryExpression");
  } else if (t || this.type !== Aa.privateId) {
    if (n2 = this.parseExprSubscripts(e2, s), this.checkExpressionErrors(e2))
      return n2;
    for (; this.type.postfix && !this.canInsertSemicolon(); ) {
      var h2 = this.startNodeAt(r2, a2);
      h2.operator = this.value, h2.prefix = false, h2.argument = n2, this.checkLValSimple(n2), this.next(), n2 = this.finishNode(h2, "UpdateExpression");
    }
  } else
    (s || this.privateNameStack.length === 0) && this.unexpected(), n2 = this.parsePrivateIdent(), this.type !== Aa._in && this.unexpected();
  return i || !this.eat(Aa.starstar) ? n2 : t ? void this.unexpected(this.lastTokStart) : this.buildBinary(r2, a2, n2, this.parseMaybeUnary(null, false, false, s), "**", false);
}, lo.parseExprSubscripts = function(e2, t) {
  var i = this.start, s = this.startLoc, n2 = this.parseExprAtom(e2, t);
  if (n2.type === "ArrowFunctionExpression" && this.input.slice(this.lastTokStart, this.lastTokEnd) !== ")")
    return n2;
  var r2 = this.parseSubscripts(n2, i, s, false, t);
  return e2 && r2.type === "MemberExpression" && (e2.parenthesizedAssign >= r2.start && (e2.parenthesizedAssign = -1), e2.parenthesizedBind >= r2.start && (e2.parenthesizedBind = -1), e2.trailingComma >= r2.start && (e2.trailingComma = -1)), r2;
}, lo.parseSubscripts = function(e2, t, i, s, n2) {
  for (var r2 = this.options.ecmaVersion >= 8 && e2.type === "Identifier" && e2.name === "async" && this.lastTokEnd === e2.end && !this.canInsertSemicolon() && e2.end - e2.start == 5 && this.potentialArrowAt === e2.start, a2 = false; ; ) {
    var o2 = this.parseSubscript(e2, t, i, s, r2, a2, n2);
    if (o2.optional && (a2 = true), o2 === e2 || o2.type === "ArrowFunctionExpression") {
      if (a2) {
        var l2 = this.startNodeAt(t, i);
        l2.expression = o2, o2 = this.finishNode(l2, "ChainExpression");
      }
      return o2;
    }
    e2 = o2;
  }
}, lo.parseSubscript = function(e2, t, i, s, n2, r2, a2) {
  var o2 = this.options.ecmaVersion >= 11, l2 = o2 && this.eat(Aa.questionDot);
  s && l2 && this.raise(this.lastTokStart, "Optional chaining cannot appear in the callee of new expressions");
  var h2 = this.eat(Aa.bracketL);
  if (h2 || l2 && this.type !== Aa.parenL && this.type !== Aa.backQuote || this.eat(Aa.dot)) {
    var c2 = this.startNodeAt(t, i);
    c2.object = e2, h2 ? (c2.property = this.parseExpression(), this.expect(Aa.bracketR)) : this.type === Aa.privateId && e2.type !== "Super" ? c2.property = this.parsePrivateIdent() : c2.property = this.parseIdent(this.options.allowReserved !== "never"), c2.computed = !!h2, o2 && (c2.optional = l2), e2 = this.finishNode(c2, "MemberExpression");
  } else if (!s && this.eat(Aa.parenL)) {
    var u2 = new Xa(), d2 = this.yieldPos, p2 = this.awaitPos, f3 = this.awaitIdentPos;
    this.yieldPos = 0, this.awaitPos = 0, this.awaitIdentPos = 0;
    var m3 = this.parseExprList(Aa.parenR, this.options.ecmaVersion >= 8, false, u2);
    if (n2 && !l2 && !this.canInsertSemicolon() && this.eat(Aa.arrow))
      return this.checkPatternErrors(u2, false), this.checkYieldAwaitInDefaultParams(), this.awaitIdentPos > 0 && this.raise(this.awaitIdentPos, "Cannot use 'await' as identifier inside an async function"), this.yieldPos = d2, this.awaitPos = p2, this.awaitIdentPos = f3, this.parseArrowExpression(this.startNodeAt(t, i), m3, true, a2);
    this.checkExpressionErrors(u2, true), this.yieldPos = d2 || this.yieldPos, this.awaitPos = p2 || this.awaitPos, this.awaitIdentPos = f3 || this.awaitIdentPos;
    var g2 = this.startNodeAt(t, i);
    g2.callee = e2, g2.arguments = m3, o2 && (g2.optional = l2), e2 = this.finishNode(g2, "CallExpression");
  } else if (this.type === Aa.backQuote) {
    (l2 || r2) && this.raise(this.start, "Optional chaining cannot appear in the tag of tagged template expressions");
    var y2 = this.startNodeAt(t, i);
    y2.tag = e2, y2.quasi = this.parseTemplate({ isTagged: true }), e2 = this.finishNode(y2, "TaggedTemplateExpression");
  }
  return e2;
}, lo.parseExprAtom = function(e2, t) {
  this.type === Aa.slash && this.readRegexp();
  var i, s = this.potentialArrowAt === this.start;
  switch (this.type) {
    case Aa._super:
      return this.allowSuper || this.raise(this.start, "'super' keyword outside a method"), i = this.startNode(), this.next(), this.type !== Aa.parenL || this.allowDirectSuper || this.raise(i.start, "super() call outside constructor of a subclass"), this.type !== Aa.dot && this.type !== Aa.bracketL && this.type !== Aa.parenL && this.unexpected(), this.finishNode(i, "Super");
    case Aa._this:
      return i = this.startNode(), this.next(), this.finishNode(i, "ThisExpression");
    case Aa.name:
      var n2 = this.start, r2 = this.startLoc, a2 = this.containsEsc, o2 = this.parseIdent(false);
      if (this.options.ecmaVersion >= 8 && !a2 && o2.name === "async" && !this.canInsertSemicolon() && this.eat(Aa._function))
        return this.overrideContext(ao.f_expr), this.parseFunction(this.startNodeAt(n2, r2), 0, false, true, t);
      if (s && !this.canInsertSemicolon()) {
        if (this.eat(Aa.arrow))
          return this.parseArrowExpression(this.startNodeAt(n2, r2), [o2], false, t);
        if (this.options.ecmaVersion >= 8 && o2.name === "async" && this.type === Aa.name && !a2 && (!this.potentialArrowInForAwait || this.value !== "of" || this.containsEsc))
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
      return e2 && (e2.parenthesizedAssign < 0 && !this.isSimpleAssignTarget(c2) && (e2.parenthesizedAssign = h2), e2.parenthesizedBind < 0 && (e2.parenthesizedBind = h2)), c2;
    case Aa.bracketL:
      return i = this.startNode(), this.next(), i.elements = this.parseExprList(Aa.bracketR, true, true, e2), this.finishNode(i, "ArrayExpression");
    case Aa.braceL:
      return this.overrideContext(ao.b_expr), this.parseObj(false, e2);
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
  var e2 = this.startNode();
  this.containsEsc && this.raiseRecoverable(this.start, "Escape sequence in keyword import");
  var t = this.parseIdent(true);
  switch (this.type) {
    case Aa.parenL:
      return this.parseDynamicImport(e2);
    case Aa.dot:
      return e2.meta = t, this.parseImportMeta(e2);
    default:
      this.unexpected();
  }
}, lo.parseDynamicImport = function(e2) {
  if (this.next(), e2.source = this.parseMaybeAssign(), !this.eat(Aa.parenR)) {
    var t = this.start;
    this.eat(Aa.comma) && this.eat(Aa.parenR) ? this.raiseRecoverable(t, "Trailing comma is not allowed in import()") : this.unexpected(t);
  }
  return this.finishNode(e2, "ImportExpression");
}, lo.parseImportMeta = function(e2) {
  this.next();
  var t = this.containsEsc;
  return e2.property = this.parseIdent(true), e2.property.name !== "meta" && this.raiseRecoverable(e2.property.start, "The only valid meta property for import is 'import.meta'"), t && this.raiseRecoverable(e2.start, "'import.meta' must not contain escaped characters"), this.options.sourceType === "module" || this.options.allowImportExportEverywhere || this.raiseRecoverable(e2.start, "Cannot use 'import.meta' outside a module"), this.finishNode(e2, "MetaProperty");
}, lo.parseLiteral = function(e2) {
  var t = this.startNode();
  return t.value = e2, t.raw = this.input.slice(this.start, this.end), t.raw.charCodeAt(t.raw.length - 1) === 110 && (t.bigint = t.raw.slice(0, -1).replace(/_/g, "")), this.next(), this.finishNode(t, "Literal");
}, lo.parseParenExpression = function() {
  this.expect(Aa.parenL);
  var e2 = this.parseExpression();
  return this.expect(Aa.parenR), e2;
}, lo.parseParenAndDistinguishExpression = function(e2, t) {
  var i, s = this.start, n2 = this.startLoc, r2 = this.options.ecmaVersion >= 8;
  if (this.options.ecmaVersion >= 6) {
    this.next();
    var a2, o2 = this.start, l2 = this.startLoc, h2 = [], c2 = true, u2 = false, d2 = new Xa(), p2 = this.yieldPos, f3 = this.awaitPos;
    for (this.yieldPos = 0, this.awaitPos = 0; this.type !== Aa.parenR; ) {
      if (c2 ? c2 = false : this.expect(Aa.comma), r2 && this.afterTrailingComma(Aa.parenR, true)) {
        u2 = true;
        break;
      }
      if (this.type === Aa.ellipsis) {
        a2 = this.start, h2.push(this.parseParenItem(this.parseRestBinding())), this.type === Aa.comma && this.raise(this.start, "Comma is not permitted after the rest element");
        break;
      }
      h2.push(this.parseMaybeAssign(false, d2, this.parseParenItem));
    }
    var m3 = this.lastTokEnd, g2 = this.lastTokEndLoc;
    if (this.expect(Aa.parenR), e2 && !this.canInsertSemicolon() && this.eat(Aa.arrow))
      return this.checkPatternErrors(d2, false), this.checkYieldAwaitInDefaultParams(), this.yieldPos = p2, this.awaitPos = f3, this.parseParenArrowList(s, n2, h2, t);
    h2.length && !u2 || this.unexpected(this.lastTokStart), a2 && this.unexpected(a2), this.checkExpressionErrors(d2, true), this.yieldPos = p2 || this.yieldPos, this.awaitPos = f3 || this.awaitPos, h2.length > 1 ? ((i = this.startNodeAt(o2, l2)).expressions = h2, this.finishNodeAt(i, "SequenceExpression", m3, g2)) : i = h2[0];
  } else
    i = this.parseParenExpression();
  if (this.options.preserveParens) {
    var y2 = this.startNodeAt(s, n2);
    return y2.expression = i, this.finishNode(y2, "ParenthesizedExpression");
  }
  return i;
}, lo.parseParenItem = function(e2) {
  return e2;
}, lo.parseParenArrowList = function(e2, t, i, s) {
  return this.parseArrowExpression(this.startNodeAt(e2, t), i, false, s);
};
var co = [];
lo.parseNew = function() {
  this.containsEsc && this.raiseRecoverable(this.start, "Escape sequence in keyword new");
  var e2 = this.startNode(), t = this.parseIdent(true);
  if (this.options.ecmaVersion >= 6 && this.eat(Aa.dot)) {
    e2.meta = t;
    var i = this.containsEsc;
    return e2.property = this.parseIdent(true), e2.property.name !== "target" && this.raiseRecoverable(e2.property.start, "The only valid meta property for new is 'new.target'"), i && this.raiseRecoverable(e2.start, "'new.target' must not contain escaped characters"), this.allowNewDotTarget || this.raiseRecoverable(e2.start, "'new.target' can only be used in functions and class static block"), this.finishNode(e2, "MetaProperty");
  }
  var s = this.start, n2 = this.startLoc, r2 = this.type === Aa._import;
  return e2.callee = this.parseSubscripts(this.parseExprAtom(), s, n2, true, false), r2 && e2.callee.type === "ImportExpression" && this.raise(s, "Cannot use new with import()"), this.eat(Aa.parenL) ? e2.arguments = this.parseExprList(Aa.parenR, this.options.ecmaVersion >= 8, false) : e2.arguments = co, this.finishNode(e2, "NewExpression");
}, lo.parseTemplateElement = function(e2) {
  var t = e2.isTagged, i = this.startNode();
  return this.type === Aa.invalidTemplate ? (t || this.raiseRecoverable(this.start, "Bad escape sequence in untagged template literal"), i.value = { raw: this.value, cooked: null }) : i.value = { raw: this.input.slice(this.start, this.end).replace(/\r\n?/g, "\n"), cooked: this.value }, this.next(), i.tail = this.type === Aa.backQuote, this.finishNode(i, "TemplateElement");
}, lo.parseTemplate = function(e2) {
  e2 === void 0 && (e2 = {});
  var t = e2.isTagged;
  t === void 0 && (t = false);
  var i = this.startNode();
  this.next(), i.expressions = [];
  var s = this.parseTemplateElement({ isTagged: t });
  for (i.quasis = [s]; !s.tail; )
    this.type === Aa.eof && this.raise(this.pos, "Unterminated template literal"), this.expect(Aa.dollarBraceL), i.expressions.push(this.parseExpression()), this.expect(Aa.braceR), i.quasis.push(s = this.parseTemplateElement({ isTagged: t }));
  return this.next(), this.finishNode(i, "TemplateLiteral");
}, lo.isAsyncProp = function(e2) {
  return !e2.computed && e2.key.type === "Identifier" && e2.key.name === "async" && (this.type === Aa.name || this.type === Aa.num || this.type === Aa.string || this.type === Aa.bracketL || this.type.keyword || this.options.ecmaVersion >= 9 && this.type === Aa.star) && !Ia.test(this.input.slice(this.lastTokEnd, this.start));
}, lo.parseObj = function(e2, t) {
  var i = this.startNode(), s = true, n2 = {};
  for (i.properties = [], this.next(); !this.eat(Aa.braceR); ) {
    if (s)
      s = false;
    else if (this.expect(Aa.comma), this.options.ecmaVersion >= 5 && this.afterTrailingComma(Aa.braceR))
      break;
    var r2 = this.parseProperty(e2, t);
    e2 || this.checkPropClash(r2, n2, t), i.properties.push(r2);
  }
  return this.finishNode(i, e2 ? "ObjectPattern" : "ObjectExpression");
}, lo.parseProperty = function(e2, t) {
  var i, s, n2, r2, a2 = this.startNode();
  if (this.options.ecmaVersion >= 9 && this.eat(Aa.ellipsis))
    return e2 ? (a2.argument = this.parseIdent(false), this.type === Aa.comma && this.raise(this.start, "Comma is not permitted after the rest element"), this.finishNode(a2, "RestElement")) : (this.type === Aa.parenL && t && (t.parenthesizedAssign < 0 && (t.parenthesizedAssign = this.start), t.parenthesizedBind < 0 && (t.parenthesizedBind = this.start)), a2.argument = this.parseMaybeAssign(false, t), this.type === Aa.comma && t && t.trailingComma < 0 && (t.trailingComma = this.start), this.finishNode(a2, "SpreadElement"));
  this.options.ecmaVersion >= 6 && (a2.method = false, a2.shorthand = false, (e2 || t) && (n2 = this.start, r2 = this.startLoc), e2 || (i = this.eat(Aa.star)));
  var o2 = this.containsEsc;
  return this.parsePropertyName(a2), !e2 && !o2 && this.options.ecmaVersion >= 8 && !i && this.isAsyncProp(a2) ? (s = true, i = this.options.ecmaVersion >= 9 && this.eat(Aa.star), this.parsePropertyName(a2, t)) : s = false, this.parsePropertyValue(a2, e2, i, s, n2, r2, t, o2), this.finishNode(a2, "Property");
}, lo.parsePropertyValue = function(e2, t, i, s, n2, r2, a2, o2) {
  if ((i || s) && this.type === Aa.colon && this.unexpected(), this.eat(Aa.colon))
    e2.value = t ? this.parseMaybeDefault(this.start, this.startLoc) : this.parseMaybeAssign(false, a2), e2.kind = "init";
  else if (this.options.ecmaVersion >= 6 && this.type === Aa.parenL)
    t && this.unexpected(), e2.kind = "init", e2.method = true, e2.value = this.parseMethod(i, s);
  else if (t || o2 || !(this.options.ecmaVersion >= 5) || e2.computed || e2.key.type !== "Identifier" || e2.key.name !== "get" && e2.key.name !== "set" || this.type === Aa.comma || this.type === Aa.braceR || this.type === Aa.eq)
    this.options.ecmaVersion >= 6 && !e2.computed && e2.key.type === "Identifier" ? ((i || s) && this.unexpected(), this.checkUnreserved(e2.key), e2.key.name !== "await" || this.awaitIdentPos || (this.awaitIdentPos = n2), e2.kind = "init", t ? e2.value = this.parseMaybeDefault(n2, r2, this.copyNode(e2.key)) : this.type === Aa.eq && a2 ? (a2.shorthandAssign < 0 && (a2.shorthandAssign = this.start), e2.value = this.parseMaybeDefault(n2, r2, this.copyNode(e2.key))) : e2.value = this.copyNode(e2.key), e2.shorthand = true) : this.unexpected();
  else {
    (i || s) && this.unexpected(), e2.kind = e2.key.name, this.parsePropertyName(e2), e2.value = this.parseMethod(false);
    var l2 = e2.kind === "get" ? 0 : 1;
    if (e2.value.params.length !== l2) {
      var h2 = e2.value.start;
      e2.kind === "get" ? this.raiseRecoverable(h2, "getter should have no params") : this.raiseRecoverable(h2, "setter should have exactly one param");
    } else
      e2.kind === "set" && e2.value.params[0].type === "RestElement" && this.raiseRecoverable(e2.value.params[0].start, "Setter cannot use rest params");
  }
}, lo.parsePropertyName = function(e2) {
  if (this.options.ecmaVersion >= 6) {
    if (this.eat(Aa.bracketL))
      return e2.computed = true, e2.key = this.parseMaybeAssign(), this.expect(Aa.bracketR), e2.key;
    e2.computed = false;
  }
  return e2.key = this.type === Aa.num || this.type === Aa.string ? this.parseExprAtom() : this.parseIdent(this.options.allowReserved !== "never");
}, lo.initFunction = function(e2) {
  e2.id = null, this.options.ecmaVersion >= 6 && (e2.generator = e2.expression = false), this.options.ecmaVersion >= 8 && (e2.async = false);
}, lo.parseMethod = function(e2, t, i) {
  var s = this.startNode(), n2 = this.yieldPos, r2 = this.awaitPos, a2 = this.awaitIdentPos;
  return this.initFunction(s), this.options.ecmaVersion >= 6 && (s.generator = e2), this.options.ecmaVersion >= 8 && (s.async = !!t), this.yieldPos = 0, this.awaitPos = 0, this.awaitIdentPos = 0, this.enterScope(64 | Ga(t, s.generator) | (i ? 128 : 0)), this.expect(Aa.parenL), s.params = this.parseBindingList(Aa.parenR, false, this.options.ecmaVersion >= 8), this.checkYieldAwaitInDefaultParams(), this.parseFunctionBody(s, false, true, false), this.yieldPos = n2, this.awaitPos = r2, this.awaitIdentPos = a2, this.finishNode(s, "FunctionExpression");
}, lo.parseArrowExpression = function(e2, t, i, s) {
  var n2 = this.yieldPos, r2 = this.awaitPos, a2 = this.awaitIdentPos;
  return this.enterScope(16 | Ga(i, false)), this.initFunction(e2), this.options.ecmaVersion >= 8 && (e2.async = !!i), this.yieldPos = 0, this.awaitPos = 0, this.awaitIdentPos = 0, e2.params = this.toAssignableList(t, true), this.parseFunctionBody(e2, true, false, s), this.yieldPos = n2, this.awaitPos = r2, this.awaitIdentPos = a2, this.finishNode(e2, "ArrowFunctionExpression");
}, lo.parseFunctionBody = function(e2, t, i, s) {
  var n2 = t && this.type !== Aa.braceL, r2 = this.strict, a2 = false;
  if (n2)
    e2.body = this.parseMaybeAssign(s), e2.expression = true, this.checkParams(e2, false);
  else {
    var o2 = this.options.ecmaVersion >= 7 && !this.isSimpleParamList(e2.params);
    r2 && !o2 || (a2 = this.strictDirective(this.end)) && o2 && this.raiseRecoverable(e2.start, "Illegal 'use strict' directive in function with non-simple parameter list");
    var l2 = this.labels;
    this.labels = [], a2 && (this.strict = true), this.checkParams(e2, !r2 && !a2 && !t && !i && this.isSimpleParamList(e2.params)), this.strict && e2.id && this.checkLValSimple(e2.id, 5), e2.body = this.parseBlock(false, void 0, a2 && !r2), e2.expression = false, this.adaptDirectivePrologue(e2.body.body), this.labels = l2;
  }
  this.exitScope();
}, lo.isSimpleParamList = function(e2) {
  for (var t = 0, i = e2; t < i.length; t += 1) {
    if (i[t].type !== "Identifier")
      return false;
  }
  return true;
}, lo.checkParams = function(e2, t) {
  for (var i = /* @__PURE__ */ Object.create(null), s = 0, n2 = e2.params; s < n2.length; s += 1) {
    var r2 = n2[s];
    this.checkLValInnerPattern(r2, 1, t ? null : i);
  }
}, lo.parseExprList = function(e2, t, i, s) {
  for (var n2 = [], r2 = true; !this.eat(e2); ) {
    if (r2)
      r2 = false;
    else if (this.expect(Aa.comma), t && this.afterTrailingComma(e2))
      break;
    var a2 = void 0;
    i && this.type === Aa.comma ? a2 = null : this.type === Aa.ellipsis ? (a2 = this.parseSpread(s), s && this.type === Aa.comma && s.trailingComma < 0 && (s.trailingComma = this.start)) : a2 = this.parseMaybeAssign(false, s), n2.push(a2);
  }
  return n2;
}, lo.checkUnreserved = function(e2) {
  var t = e2.start, i = e2.end, s = e2.name;
  (this.inGenerator && s === "yield" && this.raiseRecoverable(t, "Cannot use 'yield' as identifier inside a generator"), this.inAsync && s === "await" && this.raiseRecoverable(t, "Cannot use 'await' as identifier inside an async function"), this.currentThisScope().inClassFieldInit && s === "arguments" && this.raiseRecoverable(t, "Cannot use 'arguments' in class field initializer"), !this.inClassStaticBlock || s !== "arguments" && s !== "await" || this.raise(t, "Cannot use " + s + " in class static initialization block"), this.keywords.test(s) && this.raise(t, "Unexpected keyword '" + s + "'"), this.options.ecmaVersion < 6 && this.input.slice(t, i).indexOf("\\") !== -1) || (this.strict ? this.reservedWordsStrict : this.reservedWords).test(s) && (this.inAsync || s !== "await" || this.raiseRecoverable(t, "Cannot use keyword 'await' outside an async function"), this.raiseRecoverable(t, "The keyword '" + s + "' is reserved"));
}, lo.parseIdent = function(e2, t) {
  var i = this.startNode();
  return this.type === Aa.name ? i.name = this.value : this.type.keyword ? (i.name = this.type.keyword, i.name !== "class" && i.name !== "function" || this.lastTokEnd === this.lastTokStart + 1 && this.input.charCodeAt(this.lastTokStart) === 46 || this.context.pop()) : this.unexpected(), this.next(!!e2), this.finishNode(i, "Identifier"), e2 || (this.checkUnreserved(i), i.name !== "await" || this.awaitIdentPos || (this.awaitIdentPos = i.start)), i;
}, lo.parsePrivateIdent = function() {
  var e2 = this.startNode();
  return this.type === Aa.privateId ? e2.name = this.value : this.unexpected(), this.next(), this.finishNode(e2, "PrivateIdentifier"), this.privateNameStack.length === 0 ? this.raise(e2.start, "Private field '#" + e2.name + "' must be declared in an enclosing class") : this.privateNameStack[this.privateNameStack.length - 1].used.push(e2), e2;
}, lo.parseYield = function(e2) {
  this.yieldPos || (this.yieldPos = this.start);
  var t = this.startNode();
  return this.next(), this.type === Aa.semi || this.canInsertSemicolon() || this.type !== Aa.star && !this.type.startsExpr ? (t.delegate = false, t.argument = null) : (t.delegate = this.eat(Aa.star), t.argument = this.parseMaybeAssign(e2)), this.finishNode(t, "YieldExpression");
}, lo.parseAwait = function(e2) {
  this.awaitPos || (this.awaitPos = this.start);
  var t = this.startNode();
  return this.next(), t.argument = this.parseMaybeUnary(null, true, false, e2), this.finishNode(t, "AwaitExpression");
};
var uo = Ha.prototype;
uo.raise = function(e2, t) {
  var i = Fa(this.input, e2);
  t += " (" + i.line + ":" + i.column + ")";
  var s = new SyntaxError(t);
  throw s.pos = e2, s.loc = i, s.raisedAt = this.pos, s;
}, uo.raiseRecoverable = uo.raise, uo.curPosition = function() {
  if (this.options.locations)
    return new Va(this.curLine, this.pos - this.lineStart);
};
var po = Ha.prototype, fo = function(e2) {
  this.flags = e2, this.var = [], this.lexical = [], this.functions = [], this.inClassFieldInit = false;
};
po.enterScope = function(e2) {
  this.scopeStack.push(new fo(e2));
}, po.exitScope = function() {
  this.scopeStack.pop();
}, po.treatFunctionsAsVarInScope = function(e2) {
  return 2 & e2.flags || !this.inModule && 1 & e2.flags;
}, po.declareName = function(e2, t, i) {
  var s = false;
  if (t === 2) {
    var n2 = this.currentScope();
    s = n2.lexical.indexOf(e2) > -1 || n2.functions.indexOf(e2) > -1 || n2.var.indexOf(e2) > -1, n2.lexical.push(e2), this.inModule && 1 & n2.flags && delete this.undefinedExports[e2];
  } else if (t === 4) {
    this.currentScope().lexical.push(e2);
  } else if (t === 3) {
    var r2 = this.currentScope();
    s = this.treatFunctionsAsVar ? r2.lexical.indexOf(e2) > -1 : r2.lexical.indexOf(e2) > -1 || r2.var.indexOf(e2) > -1, r2.functions.push(e2);
  } else
    for (var a2 = this.scopeStack.length - 1; a2 >= 0; --a2) {
      var o2 = this.scopeStack[a2];
      if (o2.lexical.indexOf(e2) > -1 && !(32 & o2.flags && o2.lexical[0] === e2) || !this.treatFunctionsAsVarInScope(o2) && o2.functions.indexOf(e2) > -1) {
        s = true;
        break;
      }
      if (o2.var.push(e2), this.inModule && 1 & o2.flags && delete this.undefinedExports[e2], 259 & o2.flags)
        break;
    }
  s && this.raiseRecoverable(i, "Identifier '" + e2 + "' has already been declared");
}, po.checkLocalExport = function(e2) {
  this.scopeStack[0].lexical.indexOf(e2.name) === -1 && this.scopeStack[0].var.indexOf(e2.name) === -1 && (this.undefinedExports[e2.name] = e2);
}, po.currentScope = function() {
  return this.scopeStack[this.scopeStack.length - 1];
}, po.currentVarScope = function() {
  for (var e2 = this.scopeStack.length - 1; ; e2--) {
    var t = this.scopeStack[e2];
    if (259 & t.flags)
      return t;
  }
}, po.currentThisScope = function() {
  for (var e2 = this.scopeStack.length - 1; ; e2--) {
    var t = this.scopeStack[e2];
    if (259 & t.flags && !(16 & t.flags))
      return t;
  }
};
var mo = function(e2, t, i) {
  this.type = "", this.start = t, this.end = 0, e2.options.locations && (this.loc = new Ba(e2, i)), e2.options.directSourceFile && (this.sourceFile = e2.options.directSourceFile), e2.options.ranges && (this.range = [t, 0]);
}, go = Ha.prototype;
function yo(e2, t, i, s) {
  return e2.type = t, e2.end = i, this.options.locations && (e2.loc.end = s), this.options.ranges && (e2.range[1] = i), e2;
}
go.startNode = function() {
  return new mo(this, this.start, this.startLoc);
}, go.startNodeAt = function(e2, t) {
  return new mo(this, e2, t);
}, go.finishNode = function(e2, t) {
  return yo.call(this, e2, t, this.lastTokEnd, this.lastTokEndLoc);
}, go.finishNodeAt = function(e2, t, i, s) {
  return yo.call(this, e2, t, i, s);
}, go.copyNode = function(e2) {
  var t = new mo(this, e2.start, this.startLoc);
  for (var i in e2)
    t[i] = e2[i];
  return t;
};
var xo = "ASCII ASCII_Hex_Digit AHex Alphabetic Alpha Any Assigned Bidi_Control Bidi_C Bidi_Mirrored Bidi_M Case_Ignorable CI Cased Changes_When_Casefolded CWCF Changes_When_Casemapped CWCM Changes_When_Lowercased CWL Changes_When_NFKC_Casefolded CWKCF Changes_When_Titlecased CWT Changes_When_Uppercased CWU Dash Default_Ignorable_Code_Point DI Deprecated Dep Diacritic Dia Emoji Emoji_Component Emoji_Modifier Emoji_Modifier_Base Emoji_Presentation Extender Ext Grapheme_Base Gr_Base Grapheme_Extend Gr_Ext Hex_Digit Hex IDS_Binary_Operator IDSB IDS_Trinary_Operator IDST ID_Continue IDC ID_Start IDS Ideographic Ideo Join_Control Join_C Logical_Order_Exception LOE Lowercase Lower Math Noncharacter_Code_Point NChar Pattern_Syntax Pat_Syn Pattern_White_Space Pat_WS Quotation_Mark QMark Radical Regional_Indicator RI Sentence_Terminal STerm Soft_Dotted SD Terminal_Punctuation Term Unified_Ideograph UIdeo Uppercase Upper Variation_Selector VS White_Space space XID_Continue XIDC XID_Start XIDS", Eo = xo + " Extended_Pictographic", bo = Eo + " EBase EComp EMod EPres ExtPict", vo = { 9: xo, 10: Eo, 11: Eo, 12: bo, 13: "ASCII ASCII_Hex_Digit AHex Alphabetic Alpha Any Assigned Bidi_Control Bidi_C Bidi_Mirrored Bidi_M Case_Ignorable CI Cased Changes_When_Casefolded CWCF Changes_When_Casemapped CWCM Changes_When_Lowercased CWL Changes_When_NFKC_Casefolded CWKCF Changes_When_Titlecased CWT Changes_When_Uppercased CWU Dash Default_Ignorable_Code_Point DI Deprecated Dep Diacritic Dia Emoji Emoji_Component Emoji_Modifier Emoji_Modifier_Base Emoji_Presentation Extender Ext Grapheme_Base Gr_Base Grapheme_Extend Gr_Ext Hex_Digit Hex IDS_Binary_Operator IDSB IDS_Trinary_Operator IDST ID_Continue IDC ID_Start IDS Ideographic Ideo Join_Control Join_C Logical_Order_Exception LOE Lowercase Lower Math Noncharacter_Code_Point NChar Pattern_Syntax Pat_Syn Pattern_White_Space Pat_WS Quotation_Mark QMark Radical Regional_Indicator RI Sentence_Terminal STerm Soft_Dotted SD Terminal_Punctuation Term Unified_Ideograph UIdeo Uppercase Upper Variation_Selector VS White_Space space XID_Continue XIDC XID_Start XIDS Extended_Pictographic EBase EComp EMod EPres ExtPict" }, So = "Cased_Letter LC Close_Punctuation Pe Connector_Punctuation Pc Control Cc cntrl Currency_Symbol Sc Dash_Punctuation Pd Decimal_Number Nd digit Enclosing_Mark Me Final_Punctuation Pf Format Cf Initial_Punctuation Pi Letter L Letter_Number Nl Line_Separator Zl Lowercase_Letter Ll Mark M Combining_Mark Math_Symbol Sm Modifier_Letter Lm Modifier_Symbol Sk Nonspacing_Mark Mn Number N Open_Punctuation Ps Other C Other_Letter Lo Other_Number No Other_Punctuation Po Other_Symbol So Paragraph_Separator Zp Private_Use Co Punctuation P punct Separator Z Space_Separator Zs Spacing_Mark Mc Surrogate Cs Symbol S Titlecase_Letter Lt Unassigned Cn Uppercase_Letter Lu", Ao = "Adlam Adlm Ahom Anatolian_Hieroglyphs Hluw Arabic Arab Armenian Armn Avestan Avst Balinese Bali Bamum Bamu Bassa_Vah Bass Batak Batk Bengali Beng Bhaiksuki Bhks Bopomofo Bopo Brahmi Brah Braille Brai Buginese Bugi Buhid Buhd Canadian_Aboriginal Cans Carian Cari Caucasian_Albanian Aghb Chakma Cakm Cham Cham Cherokee Cher Common Zyyy Coptic Copt Qaac Cuneiform Xsux Cypriot Cprt Cyrillic Cyrl Deseret Dsrt Devanagari Deva Duployan Dupl Egyptian_Hieroglyphs Egyp Elbasan Elba Ethiopic Ethi Georgian Geor Glagolitic Glag Gothic Goth Grantha Gran Greek Grek Gujarati Gujr Gurmukhi Guru Han Hani Hangul Hang Hanunoo Hano Hatran Hatr Hebrew Hebr Hiragana Hira Imperial_Aramaic Armi Inherited Zinh Qaai Inscriptional_Pahlavi Phli Inscriptional_Parthian Prti Javanese Java Kaithi Kthi Kannada Knda Katakana Kana Kayah_Li Kali Kharoshthi Khar Khmer Khmr Khojki Khoj Khudawadi Sind Lao Laoo Latin Latn Lepcha Lepc Limbu Limb Linear_A Lina Linear_B Linb Lisu Lisu Lycian Lyci Lydian Lydi Mahajani Mahj Malayalam Mlym Mandaic Mand Manichaean Mani Marchen Marc Masaram_Gondi Gonm Meetei_Mayek Mtei Mende_Kikakui Mend Meroitic_Cursive Merc Meroitic_Hieroglyphs Mero Miao Plrd Modi Mongolian Mong Mro Mroo Multani Mult Myanmar Mymr Nabataean Nbat New_Tai_Lue Talu Newa Newa Nko Nkoo Nushu Nshu Ogham Ogam Ol_Chiki Olck Old_Hungarian Hung Old_Italic Ital Old_North_Arabian Narb Old_Permic Perm Old_Persian Xpeo Old_South_Arabian Sarb Old_Turkic Orkh Oriya Orya Osage Osge Osmanya Osma Pahawh_Hmong Hmng Palmyrene Palm Pau_Cin_Hau Pauc Phags_Pa Phag Phoenician Phnx Psalter_Pahlavi Phlp Rejang Rjng Runic Runr Samaritan Samr Saurashtra Saur Sharada Shrd Shavian Shaw Siddham Sidd SignWriting Sgnw Sinhala Sinh Sora_Sompeng Sora Soyombo Soyo Sundanese Sund Syloti_Nagri Sylo Syriac Syrc Tagalog Tglg Tagbanwa Tagb Tai_Le Tale Tai_Tham Lana Tai_Viet Tavt Takri Takr Tamil Taml Tangut Tang Telugu Telu Thaana Thaa Thai Thai Tibetan Tibt Tifinagh Tfng Tirhuta Tirh Ugaritic Ugar Vai Vaii Warang_Citi Wara Yi Yiii Zanabazar_Square Zanb", Io = Ao + " Dogra Dogr Gunjala_Gondi Gong Hanifi_Rohingya Rohg Makasar Maka Medefaidrin Medf Old_Sogdian Sogo Sogdian Sogd", ko = Io + " Elymaic Elym Nandinagari Nand Nyiakeng_Puachue_Hmong Hmnp Wancho Wcho", Po = ko + " Chorasmian Chrs Diak Dives_Akuru Khitan_Small_Script Kits Yezi Yezidi", wo = { 9: Ao, 10: Io, 11: ko, 12: Po, 13: "Adlam Adlm Ahom Anatolian_Hieroglyphs Hluw Arabic Arab Armenian Armn Avestan Avst Balinese Bali Bamum Bamu Bassa_Vah Bass Batak Batk Bengali Beng Bhaiksuki Bhks Bopomofo Bopo Brahmi Brah Braille Brai Buginese Bugi Buhid Buhd Canadian_Aboriginal Cans Carian Cari Caucasian_Albanian Aghb Chakma Cakm Cham Cham Cherokee Cher Common Zyyy Coptic Copt Qaac Cuneiform Xsux Cypriot Cprt Cyrillic Cyrl Deseret Dsrt Devanagari Deva Duployan Dupl Egyptian_Hieroglyphs Egyp Elbasan Elba Ethiopic Ethi Georgian Geor Glagolitic Glag Gothic Goth Grantha Gran Greek Grek Gujarati Gujr Gurmukhi Guru Han Hani Hangul Hang Hanunoo Hano Hatran Hatr Hebrew Hebr Hiragana Hira Imperial_Aramaic Armi Inherited Zinh Qaai Inscriptional_Pahlavi Phli Inscriptional_Parthian Prti Javanese Java Kaithi Kthi Kannada Knda Katakana Kana Kayah_Li Kali Kharoshthi Khar Khmer Khmr Khojki Khoj Khudawadi Sind Lao Laoo Latin Latn Lepcha Lepc Limbu Limb Linear_A Lina Linear_B Linb Lisu Lisu Lycian Lyci Lydian Lydi Mahajani Mahj Malayalam Mlym Mandaic Mand Manichaean Mani Marchen Marc Masaram_Gondi Gonm Meetei_Mayek Mtei Mende_Kikakui Mend Meroitic_Cursive Merc Meroitic_Hieroglyphs Mero Miao Plrd Modi Mongolian Mong Mro Mroo Multani Mult Myanmar Mymr Nabataean Nbat New_Tai_Lue Talu Newa Newa Nko Nkoo Nushu Nshu Ogham Ogam Ol_Chiki Olck Old_Hungarian Hung Old_Italic Ital Old_North_Arabian Narb Old_Permic Perm Old_Persian Xpeo Old_South_Arabian Sarb Old_Turkic Orkh Oriya Orya Osage Osge Osmanya Osma Pahawh_Hmong Hmng Palmyrene Palm Pau_Cin_Hau Pauc Phags_Pa Phag Phoenician Phnx Psalter_Pahlavi Phlp Rejang Rjng Runic Runr Samaritan Samr Saurashtra Saur Sharada Shrd Shavian Shaw Siddham Sidd SignWriting Sgnw Sinhala Sinh Sora_Sompeng Sora Soyombo Soyo Sundanese Sund Syloti_Nagri Sylo Syriac Syrc Tagalog Tglg Tagbanwa Tagb Tai_Le Tale Tai_Tham Lana Tai_Viet Tavt Takri Takr Tamil Taml Tangut Tang Telugu Telu Thaana Thaa Thai Thai Tibetan Tibt Tifinagh Tfng Tirhuta Tirh Ugaritic Ugar Vai Vaii Warang_Citi Wara Yi Yiii Zanabazar_Square Zanb Dogra Dogr Gunjala_Gondi Gong Hanifi_Rohingya Rohg Makasar Maka Medefaidrin Medf Old_Sogdian Sogo Sogdian Sogd Elymaic Elym Nandinagari Nand Nyiakeng_Puachue_Hmong Hmnp Wancho Wcho Chorasmian Chrs Diak Dives_Akuru Khitan_Small_Script Kits Yezi Yezidi Cypro_Minoan Cpmn Old_Uyghur Ougr Tangsa Tnsa Toto Vithkuqi Vith" }, Co = {};
function _o(e2) {
  var t = Co[e2] = { binary: Ma(vo[e2] + " " + So), nonBinary: { General_Category: Ma(So), Script: Ma(wo[e2]) } };
  t.nonBinary.Script_Extensions = t.nonBinary.Script, t.nonBinary.gc = t.nonBinary.General_Category, t.nonBinary.sc = t.nonBinary.Script, t.nonBinary.scx = t.nonBinary.Script_Extensions;
}
for (var No = 0, $o = [9, 10, 11, 12, 13]; No < $o.length; No += 1) {
  _o($o[No]);
}
var To = Ha.prototype, Oo = function(e2) {
  this.parser = e2, this.validFlags = "gim" + (e2.options.ecmaVersion >= 6 ? "uy" : "") + (e2.options.ecmaVersion >= 9 ? "s" : "") + (e2.options.ecmaVersion >= 13 ? "d" : ""), this.unicodeProperties = Co[e2.options.ecmaVersion >= 13 ? 13 : e2.options.ecmaVersion], this.source = "", this.flags = "", this.start = 0, this.switchU = false, this.switchN = false, this.pos = 0, this.lastIntValue = 0, this.lastStringValue = "", this.lastAssertionIsQuantifiable = false, this.numCapturingParens = 0, this.maxBackReference = 0, this.groupNames = [], this.backReferenceNames = [];
};
function Ro(e2) {
  return e2 === 36 || e2 >= 40 && e2 <= 43 || e2 === 46 || e2 === 63 || e2 >= 91 && e2 <= 94 || e2 >= 123 && e2 <= 125;
}
function Mo(e2) {
  return e2 >= 65 && e2 <= 90 || e2 >= 97 && e2 <= 122;
}
function Do(e2) {
  return Mo(e2) || e2 === 95;
}
function Lo(e2) {
  return Do(e2) || Vo(e2);
}
function Vo(e2) {
  return e2 >= 48 && e2 <= 57;
}
function Bo(e2) {
  return e2 >= 48 && e2 <= 57 || e2 >= 65 && e2 <= 70 || e2 >= 97 && e2 <= 102;
}
function Fo(e2) {
  return e2 >= 65 && e2 <= 70 ? e2 - 65 + 10 : e2 >= 97 && e2 <= 102 ? e2 - 97 + 10 : e2 - 48;
}
function zo(e2) {
  return e2 >= 48 && e2 <= 55;
}
Oo.prototype.reset = function(e2, t, i) {
  var s = i.indexOf("u") !== -1;
  this.start = 0 | e2, this.source = t + "", this.flags = i, this.switchU = s && this.parser.options.ecmaVersion >= 6, this.switchN = s && this.parser.options.ecmaVersion >= 9;
}, Oo.prototype.raise = function(e2) {
  this.parser.raiseRecoverable(this.start, "Invalid regular expression: /" + this.source + "/: " + e2);
}, Oo.prototype.at = function(e2, t) {
  t === void 0 && (t = false);
  var i = this.source, s = i.length;
  if (e2 >= s)
    return -1;
  var n2 = i.charCodeAt(e2);
  if (!t && !this.switchU || n2 <= 55295 || n2 >= 57344 || e2 + 1 >= s)
    return n2;
  var r2 = i.charCodeAt(e2 + 1);
  return r2 >= 56320 && r2 <= 57343 ? (n2 << 10) + r2 - 56613888 : n2;
}, Oo.prototype.nextIndex = function(e2, t) {
  t === void 0 && (t = false);
  var i = this.source, s = i.length;
  if (e2 >= s)
    return s;
  var n2, r2 = i.charCodeAt(e2);
  return !t && !this.switchU || r2 <= 55295 || r2 >= 57344 || e2 + 1 >= s || (n2 = i.charCodeAt(e2 + 1)) < 56320 || n2 > 57343 ? e2 + 1 : e2 + 2;
}, Oo.prototype.current = function(e2) {
  return e2 === void 0 && (e2 = false), this.at(this.pos, e2);
}, Oo.prototype.lookahead = function(e2) {
  return e2 === void 0 && (e2 = false), this.at(this.nextIndex(this.pos, e2), e2);
}, Oo.prototype.advance = function(e2) {
  e2 === void 0 && (e2 = false), this.pos = this.nextIndex(this.pos, e2);
}, Oo.prototype.eat = function(e2, t) {
  return t === void 0 && (t = false), this.current(t) === e2 && (this.advance(t), true);
}, To.validateRegExpFlags = function(e2) {
  for (var t = e2.validFlags, i = e2.flags, s = 0; s < i.length; s++) {
    var n2 = i.charAt(s);
    t.indexOf(n2) === -1 && this.raise(e2.start, "Invalid regular expression flag"), i.indexOf(n2, s + 1) > -1 && this.raise(e2.start, "Duplicate regular expression flag");
  }
}, To.validateRegExpPattern = function(e2) {
  this.regexp_pattern(e2), !e2.switchN && this.options.ecmaVersion >= 9 && e2.groupNames.length > 0 && (e2.switchN = true, this.regexp_pattern(e2));
}, To.regexp_pattern = function(e2) {
  e2.pos = 0, e2.lastIntValue = 0, e2.lastStringValue = "", e2.lastAssertionIsQuantifiable = false, e2.numCapturingParens = 0, e2.maxBackReference = 0, e2.groupNames.length = 0, e2.backReferenceNames.length = 0, this.regexp_disjunction(e2), e2.pos !== e2.source.length && (e2.eat(41) && e2.raise("Unmatched ')'"), (e2.eat(93) || e2.eat(125)) && e2.raise("Lone quantifier brackets")), e2.maxBackReference > e2.numCapturingParens && e2.raise("Invalid escape");
  for (var t = 0, i = e2.backReferenceNames; t < i.length; t += 1) {
    var s = i[t];
    e2.groupNames.indexOf(s) === -1 && e2.raise("Invalid named capture referenced");
  }
}, To.regexp_disjunction = function(e2) {
  for (this.regexp_alternative(e2); e2.eat(124); )
    this.regexp_alternative(e2);
  this.regexp_eatQuantifier(e2, true) && e2.raise("Nothing to repeat"), e2.eat(123) && e2.raise("Lone quantifier brackets");
}, To.regexp_alternative = function(e2) {
  for (; e2.pos < e2.source.length && this.regexp_eatTerm(e2); )
    ;
}, To.regexp_eatTerm = function(e2) {
  return this.regexp_eatAssertion(e2) ? (e2.lastAssertionIsQuantifiable && this.regexp_eatQuantifier(e2) && e2.switchU && e2.raise("Invalid quantifier"), true) : !!(e2.switchU ? this.regexp_eatAtom(e2) : this.regexp_eatExtendedAtom(e2)) && (this.regexp_eatQuantifier(e2), true);
}, To.regexp_eatAssertion = function(e2) {
  var t = e2.pos;
  if (e2.lastAssertionIsQuantifiable = false, e2.eat(94) || e2.eat(36))
    return true;
  if (e2.eat(92)) {
    if (e2.eat(66) || e2.eat(98))
      return true;
    e2.pos = t;
  }
  if (e2.eat(40) && e2.eat(63)) {
    var i = false;
    if (this.options.ecmaVersion >= 9 && (i = e2.eat(60)), e2.eat(61) || e2.eat(33))
      return this.regexp_disjunction(e2), e2.eat(41) || e2.raise("Unterminated group"), e2.lastAssertionIsQuantifiable = !i, true;
  }
  return e2.pos = t, false;
}, To.regexp_eatQuantifier = function(e2, t) {
  return t === void 0 && (t = false), !!this.regexp_eatQuantifierPrefix(e2, t) && (e2.eat(63), true);
}, To.regexp_eatQuantifierPrefix = function(e2, t) {
  return e2.eat(42) || e2.eat(43) || e2.eat(63) || this.regexp_eatBracedQuantifier(e2, t);
}, To.regexp_eatBracedQuantifier = function(e2, t) {
  var i = e2.pos;
  if (e2.eat(123)) {
    var s = 0, n2 = -1;
    if (this.regexp_eatDecimalDigits(e2) && (s = e2.lastIntValue, e2.eat(44) && this.regexp_eatDecimalDigits(e2) && (n2 = e2.lastIntValue), e2.eat(125)))
      return n2 !== -1 && n2 < s && !t && e2.raise("numbers out of order in {} quantifier"), true;
    e2.switchU && !t && e2.raise("Incomplete quantifier"), e2.pos = i;
  }
  return false;
}, To.regexp_eatAtom = function(e2) {
  return this.regexp_eatPatternCharacters(e2) || e2.eat(46) || this.regexp_eatReverseSolidusAtomEscape(e2) || this.regexp_eatCharacterClass(e2) || this.regexp_eatUncapturingGroup(e2) || this.regexp_eatCapturingGroup(e2);
}, To.regexp_eatReverseSolidusAtomEscape = function(e2) {
  var t = e2.pos;
  if (e2.eat(92)) {
    if (this.regexp_eatAtomEscape(e2))
      return true;
    e2.pos = t;
  }
  return false;
}, To.regexp_eatUncapturingGroup = function(e2) {
  var t = e2.pos;
  if (e2.eat(40)) {
    if (e2.eat(63) && e2.eat(58)) {
      if (this.regexp_disjunction(e2), e2.eat(41))
        return true;
      e2.raise("Unterminated group");
    }
    e2.pos = t;
  }
  return false;
}, To.regexp_eatCapturingGroup = function(e2) {
  if (e2.eat(40)) {
    if (this.options.ecmaVersion >= 9 ? this.regexp_groupSpecifier(e2) : e2.current() === 63 && e2.raise("Invalid group"), this.regexp_disjunction(e2), e2.eat(41))
      return e2.numCapturingParens += 1, true;
    e2.raise("Unterminated group");
  }
  return false;
}, To.regexp_eatExtendedAtom = function(e2) {
  return e2.eat(46) || this.regexp_eatReverseSolidusAtomEscape(e2) || this.regexp_eatCharacterClass(e2) || this.regexp_eatUncapturingGroup(e2) || this.regexp_eatCapturingGroup(e2) || this.regexp_eatInvalidBracedQuantifier(e2) || this.regexp_eatExtendedPatternCharacter(e2);
}, To.regexp_eatInvalidBracedQuantifier = function(e2) {
  return this.regexp_eatBracedQuantifier(e2, true) && e2.raise("Nothing to repeat"), false;
}, To.regexp_eatSyntaxCharacter = function(e2) {
  var t = e2.current();
  return !!Ro(t) && (e2.lastIntValue = t, e2.advance(), true);
}, To.regexp_eatPatternCharacters = function(e2) {
  for (var t = e2.pos, i = 0; (i = e2.current()) !== -1 && !Ro(i); )
    e2.advance();
  return e2.pos !== t;
}, To.regexp_eatExtendedPatternCharacter = function(e2) {
  var t = e2.current();
  return !(t === -1 || t === 36 || t >= 40 && t <= 43 || t === 46 || t === 63 || t === 91 || t === 94 || t === 124) && (e2.advance(), true);
}, To.regexp_groupSpecifier = function(e2) {
  if (e2.eat(63)) {
    if (this.regexp_eatGroupName(e2))
      return e2.groupNames.indexOf(e2.lastStringValue) !== -1 && e2.raise("Duplicate capture group name"), void e2.groupNames.push(e2.lastStringValue);
    e2.raise("Invalid group");
  }
}, To.regexp_eatGroupName = function(e2) {
  if (e2.lastStringValue = "", e2.eat(60)) {
    if (this.regexp_eatRegExpIdentifierName(e2) && e2.eat(62))
      return true;
    e2.raise("Invalid capture group name");
  }
  return false;
}, To.regexp_eatRegExpIdentifierName = function(e2) {
  if (e2.lastStringValue = "", this.regexp_eatRegExpIdentifierStart(e2)) {
    for (e2.lastStringValue += Da(e2.lastIntValue); this.regexp_eatRegExpIdentifierPart(e2); )
      e2.lastStringValue += Da(e2.lastIntValue);
    return true;
  }
  return false;
}, To.regexp_eatRegExpIdentifierStart = function(e2) {
  var t = e2.pos, i = this.options.ecmaVersion >= 11, s = e2.current(i);
  return e2.advance(i), s === 92 && this.regexp_eatRegExpUnicodeEscapeSequence(e2, i) && (s = e2.lastIntValue), function(e3) {
    return ma(e3, true) || e3 === 36 || e3 === 95;
  }(s) ? (e2.lastIntValue = s, true) : (e2.pos = t, false);
}, To.regexp_eatRegExpIdentifierPart = function(e2) {
  var t = e2.pos, i = this.options.ecmaVersion >= 11, s = e2.current(i);
  return e2.advance(i), s === 92 && this.regexp_eatRegExpUnicodeEscapeSequence(e2, i) && (s = e2.lastIntValue), function(e3) {
    return ga(e3, true) || e3 === 36 || e3 === 95 || e3 === 8204 || e3 === 8205;
  }(s) ? (e2.lastIntValue = s, true) : (e2.pos = t, false);
}, To.regexp_eatAtomEscape = function(e2) {
  return !!(this.regexp_eatBackReference(e2) || this.regexp_eatCharacterClassEscape(e2) || this.regexp_eatCharacterEscape(e2) || e2.switchN && this.regexp_eatKGroupName(e2)) || (e2.switchU && (e2.current() === 99 && e2.raise("Invalid unicode escape"), e2.raise("Invalid escape")), false);
}, To.regexp_eatBackReference = function(e2) {
  var t = e2.pos;
  if (this.regexp_eatDecimalEscape(e2)) {
    var i = e2.lastIntValue;
    if (e2.switchU)
      return i > e2.maxBackReference && (e2.maxBackReference = i), true;
    if (i <= e2.numCapturingParens)
      return true;
    e2.pos = t;
  }
  return false;
}, To.regexp_eatKGroupName = function(e2) {
  if (e2.eat(107)) {
    if (this.regexp_eatGroupName(e2))
      return e2.backReferenceNames.push(e2.lastStringValue), true;
    e2.raise("Invalid named reference");
  }
  return false;
}, To.regexp_eatCharacterEscape = function(e2) {
  return this.regexp_eatControlEscape(e2) || this.regexp_eatCControlLetter(e2) || this.regexp_eatZero(e2) || this.regexp_eatHexEscapeSequence(e2) || this.regexp_eatRegExpUnicodeEscapeSequence(e2, false) || !e2.switchU && this.regexp_eatLegacyOctalEscapeSequence(e2) || this.regexp_eatIdentityEscape(e2);
}, To.regexp_eatCControlLetter = function(e2) {
  var t = e2.pos;
  if (e2.eat(99)) {
    if (this.regexp_eatControlLetter(e2))
      return true;
    e2.pos = t;
  }
  return false;
}, To.regexp_eatZero = function(e2) {
  return e2.current() === 48 && !Vo(e2.lookahead()) && (e2.lastIntValue = 0, e2.advance(), true);
}, To.regexp_eatControlEscape = function(e2) {
  var t = e2.current();
  return t === 116 ? (e2.lastIntValue = 9, e2.advance(), true) : t === 110 ? (e2.lastIntValue = 10, e2.advance(), true) : t === 118 ? (e2.lastIntValue = 11, e2.advance(), true) : t === 102 ? (e2.lastIntValue = 12, e2.advance(), true) : t === 114 && (e2.lastIntValue = 13, e2.advance(), true);
}, To.regexp_eatControlLetter = function(e2) {
  var t = e2.current();
  return !!Mo(t) && (e2.lastIntValue = t % 32, e2.advance(), true);
}, To.regexp_eatRegExpUnicodeEscapeSequence = function(e2, t) {
  t === void 0 && (t = false);
  var i, s = e2.pos, n2 = t || e2.switchU;
  if (e2.eat(117)) {
    if (this.regexp_eatFixedHexDigits(e2, 4)) {
      var r2 = e2.lastIntValue;
      if (n2 && r2 >= 55296 && r2 <= 56319) {
        var a2 = e2.pos;
        if (e2.eat(92) && e2.eat(117) && this.regexp_eatFixedHexDigits(e2, 4)) {
          var o2 = e2.lastIntValue;
          if (o2 >= 56320 && o2 <= 57343)
            return e2.lastIntValue = 1024 * (r2 - 55296) + (o2 - 56320) + 65536, true;
        }
        e2.pos = a2, e2.lastIntValue = r2;
      }
      return true;
    }
    if (n2 && e2.eat(123) && this.regexp_eatHexDigits(e2) && e2.eat(125) && ((i = e2.lastIntValue) >= 0 && i <= 1114111))
      return true;
    n2 && e2.raise("Invalid unicode escape"), e2.pos = s;
  }
  return false;
}, To.regexp_eatIdentityEscape = function(e2) {
  if (e2.switchU)
    return !!this.regexp_eatSyntaxCharacter(e2) || !!e2.eat(47) && (e2.lastIntValue = 47, true);
  var t = e2.current();
  return !(t === 99 || e2.switchN && t === 107) && (e2.lastIntValue = t, e2.advance(), true);
}, To.regexp_eatDecimalEscape = function(e2) {
  e2.lastIntValue = 0;
  var t = e2.current();
  if (t >= 49 && t <= 57) {
    do {
      e2.lastIntValue = 10 * e2.lastIntValue + (t - 48), e2.advance();
    } while ((t = e2.current()) >= 48 && t <= 57);
    return true;
  }
  return false;
}, To.regexp_eatCharacterClassEscape = function(e2) {
  var t = e2.current();
  if (function(e3) {
    return e3 === 100 || e3 === 68 || e3 === 115 || e3 === 83 || e3 === 119 || e3 === 87;
  }(t))
    return e2.lastIntValue = -1, e2.advance(), true;
  if (e2.switchU && this.options.ecmaVersion >= 9 && (t === 80 || t === 112)) {
    if (e2.lastIntValue = -1, e2.advance(), e2.eat(123) && this.regexp_eatUnicodePropertyValueExpression(e2) && e2.eat(125))
      return true;
    e2.raise("Invalid property name");
  }
  return false;
}, To.regexp_eatUnicodePropertyValueExpression = function(e2) {
  var t = e2.pos;
  if (this.regexp_eatUnicodePropertyName(e2) && e2.eat(61)) {
    var i = e2.lastStringValue;
    if (this.regexp_eatUnicodePropertyValue(e2)) {
      var s = e2.lastStringValue;
      return this.regexp_validateUnicodePropertyNameAndValue(e2, i, s), true;
    }
  }
  if (e2.pos = t, this.regexp_eatLoneUnicodePropertyNameOrValue(e2)) {
    var n2 = e2.lastStringValue;
    return this.regexp_validateUnicodePropertyNameOrValue(e2, n2), true;
  }
  return false;
}, To.regexp_validateUnicodePropertyNameAndValue = function(e2, t, i) {
  Oa(e2.unicodeProperties.nonBinary, t) || e2.raise("Invalid property name"), e2.unicodeProperties.nonBinary[t].test(i) || e2.raise("Invalid property value");
}, To.regexp_validateUnicodePropertyNameOrValue = function(e2, t) {
  e2.unicodeProperties.binary.test(t) || e2.raise("Invalid property name");
}, To.regexp_eatUnicodePropertyName = function(e2) {
  var t = 0;
  for (e2.lastStringValue = ""; Do(t = e2.current()); )
    e2.lastStringValue += Da(t), e2.advance();
  return e2.lastStringValue !== "";
}, To.regexp_eatUnicodePropertyValue = function(e2) {
  var t = 0;
  for (e2.lastStringValue = ""; Lo(t = e2.current()); )
    e2.lastStringValue += Da(t), e2.advance();
  return e2.lastStringValue !== "";
}, To.regexp_eatLoneUnicodePropertyNameOrValue = function(e2) {
  return this.regexp_eatUnicodePropertyValue(e2);
}, To.regexp_eatCharacterClass = function(e2) {
  if (e2.eat(91)) {
    if (e2.eat(94), this.regexp_classRanges(e2), e2.eat(93))
      return true;
    e2.raise("Unterminated character class");
  }
  return false;
}, To.regexp_classRanges = function(e2) {
  for (; this.regexp_eatClassAtom(e2); ) {
    var t = e2.lastIntValue;
    if (e2.eat(45) && this.regexp_eatClassAtom(e2)) {
      var i = e2.lastIntValue;
      !e2.switchU || t !== -1 && i !== -1 || e2.raise("Invalid character class"), t !== -1 && i !== -1 && t > i && e2.raise("Range out of order in character class");
    }
  }
}, To.regexp_eatClassAtom = function(e2) {
  var t = e2.pos;
  if (e2.eat(92)) {
    if (this.regexp_eatClassEscape(e2))
      return true;
    if (e2.switchU) {
      var i = e2.current();
      (i === 99 || zo(i)) && e2.raise("Invalid class escape"), e2.raise("Invalid escape");
    }
    e2.pos = t;
  }
  var s = e2.current();
  return s !== 93 && (e2.lastIntValue = s, e2.advance(), true);
}, To.regexp_eatClassEscape = function(e2) {
  var t = e2.pos;
  if (e2.eat(98))
    return e2.lastIntValue = 8, true;
  if (e2.switchU && e2.eat(45))
    return e2.lastIntValue = 45, true;
  if (!e2.switchU && e2.eat(99)) {
    if (this.regexp_eatClassControlLetter(e2))
      return true;
    e2.pos = t;
  }
  return this.regexp_eatCharacterClassEscape(e2) || this.regexp_eatCharacterEscape(e2);
}, To.regexp_eatClassControlLetter = function(e2) {
  var t = e2.current();
  return !(!Vo(t) && t !== 95) && (e2.lastIntValue = t % 32, e2.advance(), true);
}, To.regexp_eatHexEscapeSequence = function(e2) {
  var t = e2.pos;
  if (e2.eat(120)) {
    if (this.regexp_eatFixedHexDigits(e2, 2))
      return true;
    e2.switchU && e2.raise("Invalid escape"), e2.pos = t;
  }
  return false;
}, To.regexp_eatDecimalDigits = function(e2) {
  var t = e2.pos, i = 0;
  for (e2.lastIntValue = 0; Vo(i = e2.current()); )
    e2.lastIntValue = 10 * e2.lastIntValue + (i - 48), e2.advance();
  return e2.pos !== t;
}, To.regexp_eatHexDigits = function(e2) {
  var t = e2.pos, i = 0;
  for (e2.lastIntValue = 0; Bo(i = e2.current()); )
    e2.lastIntValue = 16 * e2.lastIntValue + Fo(i), e2.advance();
  return e2.pos !== t;
}, To.regexp_eatLegacyOctalEscapeSequence = function(e2) {
  if (this.regexp_eatOctalDigit(e2)) {
    var t = e2.lastIntValue;
    if (this.regexp_eatOctalDigit(e2)) {
      var i = e2.lastIntValue;
      t <= 3 && this.regexp_eatOctalDigit(e2) ? e2.lastIntValue = 64 * t + 8 * i + e2.lastIntValue : e2.lastIntValue = 8 * t + i;
    } else
      e2.lastIntValue = t;
    return true;
  }
  return false;
}, To.regexp_eatOctalDigit = function(e2) {
  var t = e2.current();
  return zo(t) ? (e2.lastIntValue = t - 48, e2.advance(), true) : (e2.lastIntValue = 0, false);
}, To.regexp_eatFixedHexDigits = function(e2, t) {
  var i = e2.pos;
  e2.lastIntValue = 0;
  for (var s = 0; s < t; ++s) {
    var n2 = e2.current();
    if (!Bo(n2))
      return e2.pos = i, false;
    e2.lastIntValue = 16 * e2.lastIntValue + Fo(n2), e2.advance();
  }
  return true;
};
var jo = function(e2) {
  this.type = e2.type, this.value = e2.value, this.start = e2.start, this.end = e2.end, e2.options.locations && (this.loc = new Ba(e2, e2.startLoc, e2.endLoc)), e2.options.ranges && (this.range = [e2.start, e2.end]);
}, Uo = Ha.prototype;
function Go(e2) {
  return typeof BigInt != "function" ? null : BigInt(e2.replace(/_/g, ""));
}
Uo.next = function(e2) {
  !e2 && this.type.keyword && this.containsEsc && this.raiseRecoverable(this.start, "Escape sequence in keyword " + this.type.keyword), this.options.onToken && this.options.onToken(new jo(this)), this.lastTokEnd = this.end, this.lastTokStart = this.start, this.lastTokEndLoc = this.endLoc, this.lastTokStartLoc = this.startLoc, this.nextToken();
}, Uo.getToken = function() {
  return this.next(), new jo(this);
}, typeof Symbol != "undefined" && (Uo[Symbol.iterator] = function() {
  var e2 = this;
  return { next: function() {
    var t = e2.getToken();
    return { done: t.type === Aa.eof, value: t };
  } };
}), Uo.nextToken = function() {
  var e2 = this.curContext();
  return e2 && e2.preserveSpace || this.skipSpace(), this.start = this.pos, this.options.locations && (this.startLoc = this.curPosition()), this.pos >= this.input.length ? this.finishToken(Aa.eof) : e2.override ? e2.override(this) : void this.readToken(this.fullCharCodeAtPos());
}, Uo.readToken = function(e2) {
  return ma(e2, this.options.ecmaVersion >= 6) || e2 === 92 ? this.readWord() : this.getTokenFromCode(e2);
}, Uo.fullCharCodeAtPos = function() {
  var e2 = this.input.charCodeAt(this.pos);
  if (e2 <= 55295 || e2 >= 56320)
    return e2;
  var t = this.input.charCodeAt(this.pos + 1);
  return t <= 56319 || t >= 57344 ? e2 : (e2 << 10) + t - 56613888;
}, Uo.skipBlockComment = function() {
  var e2 = this.options.onComment && this.curPosition(), t = this.pos, i = this.input.indexOf("*/", this.pos += 2);
  if (i === -1 && this.raise(this.pos - 2, "Unterminated comment"), this.pos = i + 2, this.options.locations)
    for (var s = void 0, n2 = t; (s = wa(this.input, n2, this.pos)) > -1; )
      ++this.curLine, n2 = this.lineStart = s;
  this.options.onComment && this.options.onComment(true, this.input.slice(t + 2, i), t, this.pos, e2, this.curPosition());
}, Uo.skipLineComment = function(e2) {
  for (var t = this.pos, i = this.options.onComment && this.curPosition(), s = this.input.charCodeAt(this.pos += e2); this.pos < this.input.length && !Pa(s); )
    s = this.input.charCodeAt(++this.pos);
  this.options.onComment && this.options.onComment(false, this.input.slice(t + e2, this.pos), t, this.pos, i, this.curPosition());
}, Uo.skipSpace = function() {
  e:
    for (; this.pos < this.input.length; ) {
      var e2 = this.input.charCodeAt(this.pos);
      switch (e2) {
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
          if (!(e2 > 8 && e2 < 14 || e2 >= 5760 && Ca.test(String.fromCharCode(e2))))
            break e;
          ++this.pos;
      }
    }
}, Uo.finishToken = function(e2, t) {
  this.end = this.pos, this.options.locations && (this.endLoc = this.curPosition());
  var i = this.type;
  this.type = e2, this.value = t, this.updateContext(i);
}, Uo.readToken_dot = function() {
  var e2 = this.input.charCodeAt(this.pos + 1);
  if (e2 >= 48 && e2 <= 57)
    return this.readNumber(true);
  var t = this.input.charCodeAt(this.pos + 2);
  return this.options.ecmaVersion >= 6 && e2 === 46 && t === 46 ? (this.pos += 3, this.finishToken(Aa.ellipsis)) : (++this.pos, this.finishToken(Aa.dot));
}, Uo.readToken_slash = function() {
  var e2 = this.input.charCodeAt(this.pos + 1);
  return this.exprAllowed ? (++this.pos, this.readRegexp()) : e2 === 61 ? this.finishOp(Aa.assign, 2) : this.finishOp(Aa.slash, 1);
}, Uo.readToken_mult_modulo_exp = function(e2) {
  var t = this.input.charCodeAt(this.pos + 1), i = 1, s = e2 === 42 ? Aa.star : Aa.modulo;
  return this.options.ecmaVersion >= 7 && e2 === 42 && t === 42 && (++i, s = Aa.starstar, t = this.input.charCodeAt(this.pos + 2)), t === 61 ? this.finishOp(Aa.assign, i + 1) : this.finishOp(s, i);
}, Uo.readToken_pipe_amp = function(e2) {
  var t = this.input.charCodeAt(this.pos + 1);
  if (t === e2) {
    if (this.options.ecmaVersion >= 12) {
      if (this.input.charCodeAt(this.pos + 2) === 61)
        return this.finishOp(Aa.assign, 3);
    }
    return this.finishOp(e2 === 124 ? Aa.logicalOR : Aa.logicalAND, 2);
  }
  return t === 61 ? this.finishOp(Aa.assign, 2) : this.finishOp(e2 === 124 ? Aa.bitwiseOR : Aa.bitwiseAND, 1);
}, Uo.readToken_caret = function() {
  return this.input.charCodeAt(this.pos + 1) === 61 ? this.finishOp(Aa.assign, 2) : this.finishOp(Aa.bitwiseXOR, 1);
}, Uo.readToken_plus_min = function(e2) {
  var t = this.input.charCodeAt(this.pos + 1);
  return t === e2 ? t !== 45 || this.inModule || this.input.charCodeAt(this.pos + 2) !== 62 || this.lastTokEnd !== 0 && !Ia.test(this.input.slice(this.lastTokEnd, this.pos)) ? this.finishOp(Aa.incDec, 2) : (this.skipLineComment(3), this.skipSpace(), this.nextToken()) : t === 61 ? this.finishOp(Aa.assign, 2) : this.finishOp(Aa.plusMin, 1);
}, Uo.readToken_lt_gt = function(e2) {
  var t = this.input.charCodeAt(this.pos + 1), i = 1;
  return t === e2 ? (i = e2 === 62 && this.input.charCodeAt(this.pos + 2) === 62 ? 3 : 2, this.input.charCodeAt(this.pos + i) === 61 ? this.finishOp(Aa.assign, i + 1) : this.finishOp(Aa.bitShift, i)) : t !== 33 || e2 !== 60 || this.inModule || this.input.charCodeAt(this.pos + 2) !== 45 || this.input.charCodeAt(this.pos + 3) !== 45 ? (t === 61 && (i = 2), this.finishOp(Aa.relational, i)) : (this.skipLineComment(4), this.skipSpace(), this.nextToken());
}, Uo.readToken_eq_excl = function(e2) {
  var t = this.input.charCodeAt(this.pos + 1);
  return t === 61 ? this.finishOp(Aa.equality, this.input.charCodeAt(this.pos + 2) === 61 ? 3 : 2) : e2 === 61 && t === 62 && this.options.ecmaVersion >= 6 ? (this.pos += 2, this.finishToken(Aa.arrow)) : this.finishOp(e2 === 61 ? Aa.eq : Aa.prefix, 1);
}, Uo.readToken_question = function() {
  var e2 = this.options.ecmaVersion;
  if (e2 >= 11) {
    var t = this.input.charCodeAt(this.pos + 1);
    if (t === 46) {
      var i = this.input.charCodeAt(this.pos + 2);
      if (i < 48 || i > 57)
        return this.finishOp(Aa.questionDot, 2);
    }
    if (t === 63) {
      if (e2 >= 12) {
        if (this.input.charCodeAt(this.pos + 2) === 61)
          return this.finishOp(Aa.assign, 3);
      }
      return this.finishOp(Aa.coalesce, 2);
    }
  }
  return this.finishOp(Aa.question, 1);
}, Uo.readToken_numberSign = function() {
  var e2 = 35;
  if (this.options.ecmaVersion >= 13 && (++this.pos, ma(e2 = this.fullCharCodeAtPos(), true) || e2 === 92))
    return this.finishToken(Aa.privateId, this.readWord1());
  this.raise(this.pos, "Unexpected character '" + Da(e2) + "'");
}, Uo.getTokenFromCode = function(e2) {
  switch (e2) {
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
      return this.readString(e2);
    case 47:
      return this.readToken_slash();
    case 37:
    case 42:
      return this.readToken_mult_modulo_exp(e2);
    case 124:
    case 38:
      return this.readToken_pipe_amp(e2);
    case 94:
      return this.readToken_caret();
    case 43:
    case 45:
      return this.readToken_plus_min(e2);
    case 60:
    case 62:
      return this.readToken_lt_gt(e2);
    case 61:
    case 33:
      return this.readToken_eq_excl(e2);
    case 63:
      return this.readToken_question();
    case 126:
      return this.finishOp(Aa.prefix, 1);
    case 35:
      return this.readToken_numberSign();
  }
  this.raise(this.pos, "Unexpected character '" + Da(e2) + "'");
}, Uo.finishOp = function(e2, t) {
  var i = this.input.slice(this.pos, this.pos + t);
  return this.pos += t, this.finishToken(e2, i);
}, Uo.readRegexp = function() {
  for (var e2, t, i = this.pos; ; ) {
    this.pos >= this.input.length && this.raise(i, "Unterminated regular expression");
    var s = this.input.charAt(this.pos);
    if (Ia.test(s) && this.raise(i, "Unterminated regular expression"), e2)
      e2 = false;
    else {
      if (s === "[")
        t = true;
      else if (s === "]" && t)
        t = false;
      else if (s === "/" && !t)
        break;
      e2 = s === "\\";
    }
    ++this.pos;
  }
  var n2 = this.input.slice(i, this.pos);
  ++this.pos;
  var r2 = this.pos, a2 = this.readWord1();
  this.containsEsc && this.unexpected(r2);
  var o2 = this.regexpState || (this.regexpState = new Oo(this));
  o2.reset(i, n2, a2), this.validateRegExpFlags(o2), this.validateRegExpPattern(o2);
  var l2 = null;
  try {
    l2 = new RegExp(n2, a2);
  } catch (e3) {
  }
  return this.finishToken(Aa.regexp, { pattern: n2, flags: a2, value: l2 });
}, Uo.readInt = function(e2, t, i) {
  for (var s = this.options.ecmaVersion >= 12 && t === void 0, n2 = i && this.input.charCodeAt(this.pos) === 48, r2 = this.pos, a2 = 0, o2 = 0, l2 = 0, h2 = t == null ? 1 / 0 : t; l2 < h2; ++l2, ++this.pos) {
    var c2 = this.input.charCodeAt(this.pos), u2 = void 0;
    if (s && c2 === 95)
      n2 && this.raiseRecoverable(this.pos, "Numeric separator is not allowed in legacy octal numeric literals"), o2 === 95 && this.raiseRecoverable(this.pos, "Numeric separator must be exactly one underscore"), l2 === 0 && this.raiseRecoverable(this.pos, "Numeric separator is not allowed at the first of digits"), o2 = c2;
    else {
      if ((u2 = c2 >= 97 ? c2 - 97 + 10 : c2 >= 65 ? c2 - 65 + 10 : c2 >= 48 && c2 <= 57 ? c2 - 48 : 1 / 0) >= e2)
        break;
      o2 = c2, a2 = a2 * e2 + u2;
    }
  }
  return s && o2 === 95 && this.raiseRecoverable(this.pos - 1, "Numeric separator is not allowed at the last of digits"), this.pos === r2 || t != null && this.pos - r2 !== t ? null : a2;
}, Uo.readRadixNumber = function(e2) {
  var t = this.pos;
  this.pos += 2;
  var i = this.readInt(e2);
  return i == null && this.raise(this.start + 2, "Expected number in radix " + e2), this.options.ecmaVersion >= 11 && this.input.charCodeAt(this.pos) === 110 ? (i = Go(this.input.slice(t, this.pos)), ++this.pos) : ma(this.fullCharCodeAtPos()) && this.raise(this.pos, "Identifier directly after number"), this.finishToken(Aa.num, i);
}, Uo.readNumber = function(e2) {
  var t = this.pos;
  e2 || this.readInt(10, void 0, true) !== null || this.raise(t, "Invalid number");
  var i = this.pos - t >= 2 && this.input.charCodeAt(t) === 48;
  i && this.strict && this.raise(t, "Invalid number");
  var s = this.input.charCodeAt(this.pos);
  if (!i && !e2 && this.options.ecmaVersion >= 11 && s === 110) {
    var n2 = Go(this.input.slice(t, this.pos));
    return ++this.pos, ma(this.fullCharCodeAtPos()) && this.raise(this.pos, "Identifier directly after number"), this.finishToken(Aa.num, n2);
  }
  i && /[89]/.test(this.input.slice(t, this.pos)) && (i = false), s !== 46 || i || (++this.pos, this.readInt(10), s = this.input.charCodeAt(this.pos)), s !== 69 && s !== 101 || i || ((s = this.input.charCodeAt(++this.pos)) !== 43 && s !== 45 || ++this.pos, this.readInt(10) === null && this.raise(t, "Invalid number")), ma(this.fullCharCodeAtPos()) && this.raise(this.pos, "Identifier directly after number");
  var r2, a2 = (r2 = this.input.slice(t, this.pos), i ? parseInt(r2, 8) : parseFloat(r2.replace(/_/g, "")));
  return this.finishToken(Aa.num, a2);
}, Uo.readCodePoint = function() {
  var e2;
  if (this.input.charCodeAt(this.pos) === 123) {
    this.options.ecmaVersion < 6 && this.unexpected();
    var t = ++this.pos;
    e2 = this.readHexChar(this.input.indexOf("}", this.pos) - this.pos), ++this.pos, e2 > 1114111 && this.invalidStringToken(t, "Code point out of bounds");
  } else
    e2 = this.readHexChar(4);
  return e2;
}, Uo.readString = function(e2) {
  for (var t = "", i = ++this.pos; ; ) {
    this.pos >= this.input.length && this.raise(this.start, "Unterminated string constant");
    var s = this.input.charCodeAt(this.pos);
    if (s === e2)
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
  } catch (e2) {
    if (e2 !== Ho)
      throw e2;
    this.readInvalidTemplateToken();
  }
  this.inTemplateElement = false;
}, Uo.invalidStringToken = function(e2, t) {
  if (this.inTemplateElement && this.options.ecmaVersion >= 9)
    throw Ho;
  this.raise(e2, t);
}, Uo.readTmplToken = function() {
  for (var e2 = "", t = this.pos; ; ) {
    this.pos >= this.input.length && this.raise(this.start, "Unterminated template");
    var i = this.input.charCodeAt(this.pos);
    if (i === 96 || i === 36 && this.input.charCodeAt(this.pos + 1) === 123)
      return this.pos !== this.start || this.type !== Aa.template && this.type !== Aa.invalidTemplate ? (e2 += this.input.slice(t, this.pos), this.finishToken(Aa.template, e2)) : i === 36 ? (this.pos += 2, this.finishToken(Aa.dollarBraceL)) : (++this.pos, this.finishToken(Aa.backQuote));
    if (i === 92)
      e2 += this.input.slice(t, this.pos), e2 += this.readEscapedChar(true), t = this.pos;
    else if (Pa(i)) {
      switch (e2 += this.input.slice(t, this.pos), ++this.pos, i) {
        case 13:
          this.input.charCodeAt(this.pos) === 10 && ++this.pos;
        case 10:
          e2 += "\n";
          break;
        default:
          e2 += String.fromCharCode(i);
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
}, Uo.readEscapedChar = function(e2) {
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
      if (this.strict && this.invalidStringToken(this.pos - 1, "Invalid escape sequence"), e2) {
        var i = this.pos - 1;
        return this.invalidStringToken(i, "Invalid escape sequence in template string"), null;
      }
    default:
      if (t >= 48 && t <= 55) {
        var s = this.input.substr(this.pos - 1, 3).match(/^[0-7]+/)[0], n2 = parseInt(s, 8);
        return n2 > 255 && (s = s.slice(0, -1), n2 = parseInt(s, 8)), this.pos += s.length - 1, t = this.input.charCodeAt(this.pos), s === "0" && t !== 56 && t !== 57 || !this.strict && !e2 || this.invalidStringToken(this.pos - 1 - s.length, e2 ? "Octal literal in template string" : "Octal literal in strict mode"), String.fromCharCode(n2);
      }
      return Pa(t) ? "" : String.fromCharCode(t);
  }
}, Uo.readHexChar = function(e2) {
  var t = this.pos, i = this.readInt(16, e2);
  return i === null && this.invalidStringToken(t, "Bad character escape sequence"), i;
}, Uo.readWord1 = function() {
  this.containsEsc = false;
  for (var e2 = "", t = true, i = this.pos, s = this.options.ecmaVersion >= 6; this.pos < this.input.length; ) {
    var n2 = this.fullCharCodeAtPos();
    if (ga(n2, s))
      this.pos += n2 <= 65535 ? 1 : 2;
    else {
      if (n2 !== 92)
        break;
      this.containsEsc = true, e2 += this.input.slice(i, this.pos);
      var r2 = this.pos;
      this.input.charCodeAt(++this.pos) !== 117 && this.invalidStringToken(this.pos, "Expecting Unicode escape sequence \\uXXXX"), ++this.pos;
      var a2 = this.readCodePoint();
      (t ? ma : ga)(a2, s) || this.invalidStringToken(r2, "Invalid Unicode escape"), e2 += Da(a2), i = this.pos;
    }
    t = false;
  }
  return e2 + this.input.slice(i, this.pos);
}, Uo.readWord = function() {
  var e2 = this.readWord1(), t = Aa.name;
  return this.keywords.test(e2) && (t = va[e2]), this.finishToken(t, e2);
};
Ha.acorn = { Parser: Ha, version: "8.7.1", defaultOptions: za, Position: Va, SourceLocation: Ba, getLineInfo: Fa, Node: mo, TokenType: ya, tokTypes: Aa, keywordTypes: va, TokContext: ro, tokContexts: ao, isIdentifierChar: ga, isIdentifierStart: ma, Token: jo, isNewLine: Pa, lineBreak: Ia, lineBreakG: ka, nonASCIIwhitespace: Ca };
class Wo {
  constructor(e2) {
    this.maxParallel = e2, this.queue = [], this.workerCount = 0;
  }
  run(e2) {
    return new Promise((t, i) => {
      this.queue.push({ reject: i, resolve: t, task: e2 }), this.work();
    });
  }
  async work() {
    if (this.workerCount >= this.maxParallel)
      return;
    let e2;
    for (this.workerCount++; e2 = this.queue.shift(); ) {
      const { reject: t, resolve: i, task: s } = e2;
      try {
        i(await s());
      } catch (e3) {
        t(e3);
      }
    }
    this.workerCount--;
  }
}
const qo = (e2) => () => {
  pe({ code: "NO_FS_IN_BROWSER", message: `Cannot access the file system (via "${e2}") when using the browser build of Rollup. Make sure you supply a plugin with custom resolveId and load hooks to Rollup.`, url: "https://rollupjs.org/guide/en/#a-simple-example" });
}, Ko = { mkdir: qo("fs.mkdir"), readFile: qo("fs.readFile"), writeFile: qo("fs.writeFile") };
async function Xo(e2, t, i, s, n2, r2, a2, o2) {
  const l2 = await function(e3, t2, i2, s2, n3, r3, a3) {
    let o3 = null, l3 = null;
    if (n3) {
      o3 = /* @__PURE__ */ new Set();
      for (const i3 of n3)
        e3 === i3.source && t2 === i3.importer && o3.add(i3.plugin);
      l3 = (e4, t3) => __spreadProps(__spreadValues({}, e4), { resolve: (e5, i3, { custom: r4, isEntry: a4, skipSelf: o4 } = ie) => s2(e5, i3, r4, a4, o4 ? [...n3, { importer: i3, plugin: t3, source: e5 }] : n3) });
    }
    return i2.hookFirst("resolveId", [e3, t2, { custom: r3, isEntry: a3 }], l3, o3);
  }(e2, t, s, n2, r2, a2, o2);
  return l2;
}
function Yo(e2, t, { hook: i, id: s } = {}) {
  return typeof e2 == "string" && (e2 = { message: e2 }), e2.code && e2.code !== me.PLUGIN_ERROR && (e2.pluginCode = e2.code), e2.code = me.PLUGIN_ERROR, e2.plugin = t, i && (e2.hook = i), s && (e2.id = s), pe(e2);
}
const Qo = [{ active: true, deprecated: "resolveAssetUrl", replacement: "resolveFileUrl" }];
const Zo = { delete: () => false, get() {
}, has: () => false, set() {
} };
function Jo(e2) {
  return e2.startsWith("at position ") || e2.startsWith("at output position ") ? pe({ code: "ANONYMOUS_PLUGIN_CACHE", message: "A plugin is trying to use the Rollup cache but is not declaring a plugin name or cacheKey." }) : pe({ code: "DUPLICATE_PLUGIN_NAME", message: `The plugin name ${e2} is being used twice in the same build. Plugin names must be distinct or provide a cacheKey (please post an issue to the plugin if you are a plugin user).` });
}
async function el(e2, t, i, s) {
  const n2 = t.id, r2 = [];
  let a2 = e2.map === null ? null : Or(e2.map);
  const o2 = e2.code;
  let l2 = e2.ast;
  const c2 = [], u2 = [];
  let d2 = false;
  const p2 = () => d2 = true;
  let f3 = "";
  const m3 = e2.code;
  let g2;
  try {
    g2 = await i.hookReduceArg0("transform", [m3, n2], function(e3, i2, n3) {
      let a3, o3;
      if (typeof i2 == "string")
        a3 = i2;
      else {
        if (!i2 || typeof i2 != "object")
          return e3;
        if (t.updateOptions(i2), i2.code == null)
          return (i2.map || i2.ast) && s(function(e4) {
            return { code: me.NO_TRANSFORM_MAP_OR_AST_WITHOUT_CODE, message: `The plugin "${e4}" returned a "map" or "ast" without returning a "code". This will be ignored.` };
          }(n3.name)), e3;
        ({ code: a3, map: o3, ast: l2 } = i2);
      }
      return o3 !== null && r2.push(Or(typeof o3 == "string" ? JSON.parse(o3) : o3) || { missing: true, plugin: n3.name }), a3;
    }, (e3, t2) => {
      return f3 = t2.name, __spreadProps(__spreadValues({}, e3), { addWatchFile(t3) {
        c2.push(t3), e3.addWatchFile(t3);
      }, cache: d2 ? e3.cache : (l3 = e3.cache, g3 = p2, { delete: (e4) => (g3(), l3.delete(e4)), get: (e4) => (g3(), l3.get(e4)), has: (e4) => (g3(), l3.has(e4)), set: (e4, t3) => (g3(), l3.set(e4, t3)) }), emitAsset: (t3, i2) => (u2.push({ name: t3, source: i2, type: "asset" }), e3.emitAsset(t3, i2)), emitChunk: (t3, i2) => (u2.push({ id: t3, name: i2 && i2.name, type: "chunk" }), e3.emitChunk(t3, i2)), emitFile: (e4) => (u2.push(e4), i.emitFile(e4)), error: (t3, i2) => (typeof t3 == "string" && (t3 = { message: t3 }), i2 && fe(t3, i2, m3, n2), t3.id = n2, t3.hook = "transform", e3.error(t3)), getCombinedSourcemap() {
        const e4 = function(e5, t3, i2, s2, n3) {
          return s2.length ? __spreadValues({ version: 3 }, Ln(e5, t3, i2, s2, Dn(n3)).traceMappings()) : i2;
        }(n2, o2, a2, r2, s);
        if (!e4) {
          return new x(o2).generateMap({ hires: true, includeContent: true, source: n2 });
        }
        return a2 !== e4 && (a2 = e4, r2.length = 0), new h(__spreadProps(__spreadValues({}, e4), { file: null, sourcesContent: e4.sourcesContent }));
      }, setAssetSource() {
        return this.error({ code: "INVALID_SETASSETSOURCE", message: "setAssetSource cannot be called in transform for caching reasons. Use emitFile with a source, or call setAssetSource in another hook." });
      }, warn(t3, i2) {
        typeof t3 == "string" && (t3 = { message: t3 }), i2 && fe(t3, i2, m3, n2), t3.id = n2, t3.hook = "transform", e3.warn(t3);
      } });
      var l3, g3;
    });
  } catch (e3) {
    Yo(e3, f3, { hook: "transform", id: n2 });
  }
  return d2 || u2.length && (t.transformFiles = u2), { ast: l2, code: g2, customTransformCache: d2, originalCode: o2, originalSourcemap: a2, sourcemapChain: r2, transformDependencies: c2 };
}
class tl {
  constructor(e2, t, i, s) {
    this.graph = e2, this.modulesById = t, this.options = i, this.pluginDriver = s, this.implicitEntryModules = /* @__PURE__ */ new Set(), this.indexedEntryModules = [], this.latestLoadModulesPromise = Promise.resolve(), this.moduleLoadPromises = /* @__PURE__ */ new Map(), this.modulesWithLoadedDependencies = /* @__PURE__ */ new Set(), this.nextChunkNamePriority = 0, this.nextEntryModuleIndex = 0, this.resolveId = async (e3, t2, i2, s2, n2 = null) => this.getResolvedIdWithDefaults(this.getNormalizedResolvedIdWithoutDefaults(!this.options.external(e3, t2, false) && await Xo(e3, t2, this.options.preserveSymlinks, this.pluginDriver, this.resolveId, n2, i2, typeof s2 == "boolean" ? s2 : !t2), t2, e3)), this.hasModuleSideEffects = i.treeshake ? i.treeshake.moduleSideEffects : () => true, this.readQueue = new Wo(i.maxParallelFileReads);
  }
  async addAdditionalModules(e2) {
    const t = this.extendLoadModulesPromise(Promise.all(e2.map((e3) => this.loadEntryModule(e3, false, void 0, null))));
    return await this.awaitLoadModulesPromise(), t;
  }
  async addEntryModules(e2, t) {
    const i = this.nextEntryModuleIndex;
    this.nextEntryModuleIndex += e2.length;
    const s = this.nextChunkNamePriority;
    this.nextChunkNamePriority += e2.length;
    const n2 = await this.extendLoadModulesPromise(Promise.all(e2.map(({ id: e3, importer: t2 }) => this.loadEntryModule(e3, true, t2, null))).then((n3) => {
      for (let r2 = 0; r2 < n3.length; r2++) {
        const a2 = n3[r2];
        a2.isUserDefinedEntryPoint = a2.isUserDefinedEntryPoint || t, sl(a2, e2[r2], t, s + r2);
        const o2 = this.indexedEntryModules.find((e3) => e3.module === a2);
        o2 ? o2.index = Math.min(o2.index, i + r2) : this.indexedEntryModules.push({ index: i + r2, module: a2 });
      }
      return this.indexedEntryModules.sort(({ index: e3 }, { index: t2 }) => e3 > t2 ? 1 : -1), n3;
    }));
    return await this.awaitLoadModulesPromise(), { entryModules: this.indexedEntryModules.map(({ module: e3 }) => e3), implicitEntryModules: [...this.implicitEntryModules], newEntryModules: n2 };
  }
  async emitChunk({ fileName: e2, id: t, importer: i, name: s, implicitlyLoadedAfterOneOf: n2, preserveSignature: r2 }) {
    const a2 = { fileName: e2 || null, id: t, importer: i, name: s || null }, o2 = n2 ? await this.addEntryWithImplicitDependants(a2, n2) : (await this.addEntryModules([a2], false)).newEntryModules[0];
    return r2 != null && (o2.preserveSignature = r2), o2;
  }
  async preloadModule(e2) {
    return (await this.fetchModule(this.getResolvedIdWithDefaults(e2), void 0, false, !e2.resolveDependencies || "resolveDependencies")).info;
  }
  addEntryWithImplicitDependants(e2, t) {
    const i = this.nextChunkNamePriority++;
    return this.extendLoadModulesPromise(this.loadEntryModule(e2.id, false, e2.importer, null).then(async (s) => {
      if (sl(s, e2, false, i), !s.info.isEntry) {
        this.implicitEntryModules.add(s);
        const i2 = await Promise.all(t.map((t2) => this.loadEntryModule(t2, false, e2.importer, s.id)));
        for (const e3 of i2)
          s.implicitlyLoadedAfter.add(e3);
        for (const e3 of s.implicitlyLoadedAfter)
          e3.implicitlyLoadedBefore.add(s);
      }
      return s;
    }));
  }
  async addModuleSource(e2, t, i) {
    let s;
    en("load modules", 3);
    try {
      s = await this.readQueue.run(async () => {
        var t2;
        return (t2 = await this.pluginDriver.hookFirst("load", [e2])) !== null && t2 !== void 0 ? t2 : await Ko.readFile(e2, "utf8");
      });
    } catch (i2) {
      tn("load modules", 3);
      let s2 = `Could not load ${e2}`;
      throw t && (s2 += ` (imported by ${he(t)})`), s2 += `: ${i2.message}`, i2.message = s2, i2;
    }
    tn("load modules", 3);
    const n2 = typeof s == "string" ? { code: s } : s != null && typeof s == "object" && typeof s.code == "string" ? s : pe(function(e3) {
      return { code: me.BAD_LOADER, message: `Error loading ${he(e3)}: plugin load hook should return a string, a { code, map } object, or nothing/null` };
    }(e2)), r2 = this.graph.cachedModules.get(e2);
    if (!r2 || r2.customTransformCache || r2.originalCode !== n2.code || await this.pluginDriver.hookFirst("shouldTransformCachedModule", [{ ast: r2.ast, code: r2.code, id: r2.id, meta: r2.meta, moduleSideEffects: r2.moduleSideEffects, resolvedSources: r2.resolvedIds, syntheticNamedExports: r2.syntheticNamedExports }]))
      i.updateOptions(n2), i.setSource(await el(n2, i, this.pluginDriver, this.options.onwarn));
    else {
      if (r2.transformFiles)
        for (const e3 of r2.transformFiles)
          this.pluginDriver.emitFile(e3);
      i.setSource(r2);
    }
  }
  async awaitLoadModulesPromise() {
    let e2;
    do {
      e2 = this.latestLoadModulesPromise, await e2;
    } while (e2 !== this.latestLoadModulesPromise);
  }
  extendLoadModulesPromise(e2) {
    return this.latestLoadModulesPromise = Promise.all([e2, this.latestLoadModulesPromise]), this.latestLoadModulesPromise.catch(() => {
    }), e2;
  }
  async fetchDynamicDependencies(e2, t) {
    const i = await Promise.all(t.map((t2) => t2.then(async ([t3, i2]) => i2 === null ? null : typeof i2 == "string" ? (t3.resolution = i2, null) : t3.resolution = await this.fetchResolvedDependency(he(i2.id), e2.id, i2))));
    for (const t2 of i)
      t2 && (e2.dynamicDependencies.add(t2), t2.dynamicImporters.push(e2.id));
  }
  async fetchModule({ id: e2, meta: t, moduleSideEffects: i, syntheticNamedExports: s }, n2, r2, a2) {
    const o2 = this.modulesById.get(e2);
    if (o2 instanceof ln)
      return await this.handleExistingModule(o2, r2, a2), o2;
    const l2 = new ln(this.graph, e2, this.options, r2, i, s, t);
    this.modulesById.set(e2, l2), this.graph.watchFiles[e2] = true;
    const h2 = this.addModuleSource(e2, n2, l2).then(() => [this.getResolveStaticDependencyPromises(l2), this.getResolveDynamicImportPromises(l2), c2]), c2 = rl(h2).then(() => this.pluginDriver.hookParallel("moduleParsed", [l2.info]));
    c2.catch(() => {
    }), this.moduleLoadPromises.set(l2, h2);
    const u2 = await h2;
    return a2 ? a2 === "resolveDependencies" && await c2 : await this.fetchModuleDependencies(l2, ...u2), l2;
  }
  async fetchModuleDependencies(e2, t, i, s) {
    this.modulesWithLoadedDependencies.has(e2) || (this.modulesWithLoadedDependencies.add(e2), await Promise.all([this.fetchStaticDependencies(e2, t), this.fetchDynamicDependencies(e2, i)]), e2.linkImports(), await s);
  }
  fetchResolvedDependency(e2, t, i) {
    if (i.external) {
      const { external: s, id: n2, moduleSideEffects: r2, meta: a2 } = i;
      this.modulesById.has(n2) || this.modulesById.set(n2, new $e(this.options, n2, r2, a2, s !== "absolute" && P(n2)));
      const o2 = this.modulesById.get(n2);
      return o2 instanceof $e ? Promise.resolve(o2) : pe(function(e3, t2) {
        return { code: me.INVALID_EXTERNAL_ID, message: `'${e3}' is imported as an external by ${he(t2)}, but is already an existing non-external module id.` };
      }(e2, t));
    }
    return this.fetchModule(i, t, false, false);
  }
  async fetchStaticDependencies(e2, t) {
    for (const i of await Promise.all(t.map((t2) => t2.then(([t3, i2]) => this.fetchResolvedDependency(t3, e2.id, i2)))))
      e2.dependencies.add(i), i.importers.push(e2.id);
    if (!this.options.treeshake || e2.info.moduleSideEffects === "no-treeshake")
      for (const t2 of e2.dependencies)
        t2 instanceof ln && (t2.importedFromNotTreeshaken = true);
  }
  getNormalizedResolvedIdWithoutDefaults(e2, t, i) {
    const { makeAbsoluteExternalsRelative: s } = this.options;
    if (e2) {
      if (typeof e2 == "object") {
        const n4 = e2.external || this.options.external(e2.id, t, true);
        return __spreadProps(__spreadValues({}, e2), { external: n4 && (n4 === "relative" || !P(e2.id) || n4 === true && nl(e2.id, i, s) || "absolute") });
      }
      const n3 = this.options.external(e2, t, true);
      return { external: n3 && (nl(e2, i, s) || "absolute"), id: n3 && s ? il(e2, t) : e2 };
    }
    const n2 = s ? il(i, t) : i;
    return e2 === false || this.options.external(n2, t, true) ? { external: nl(n2, i, s) || "absolute", id: n2 } : null;
  }
  getResolveDynamicImportPromises(e2) {
    return e2.dynamicImports.map(async (t) => {
      const i = await this.resolveDynamicImport(e2, typeof t.argument == "string" ? t.argument : t.argument.esTreeNode, e2.id);
      return i && typeof i == "object" && (t.id = i.id), [t, i];
    });
  }
  getResolveStaticDependencyPromises(e2) {
    return Array.from(e2.sources, async (t) => [t, e2.resolvedIds[t] = e2.resolvedIds[t] || this.handleResolveId(await this.resolveId(t, e2.id, se, false), t, e2.id)]);
  }
  getResolvedIdWithDefaults(e2) {
    var t, i;
    if (!e2)
      return null;
    const s = e2.external || false;
    return { external: s, id: e2.id, meta: e2.meta || {}, moduleSideEffects: (t = e2.moduleSideEffects) !== null && t !== void 0 ? t : this.hasModuleSideEffects(e2.id, !!s), syntheticNamedExports: (i = e2.syntheticNamedExports) !== null && i !== void 0 && i };
  }
  async handleExistingModule(e2, t, i) {
    const s = this.moduleLoadPromises.get(e2);
    if (i)
      return i === "resolveDependencies" ? rl(s) : s;
    if (t) {
      e2.info.isEntry = true, this.implicitEntryModules.delete(e2);
      for (const t2 of e2.implicitlyLoadedAfter)
        t2.implicitlyLoadedBefore.delete(e2);
      e2.implicitlyLoadedAfter.clear();
    }
    return this.fetchModuleDependencies(e2, ...await s);
  }
  handleResolveId(e2, t, i) {
    return e2 === null ? w(t) ? pe(function(e3, t2) {
      return { code: me.UNRESOLVED_IMPORT, message: `Could not resolve '${e3}' from ${he(t2)}` };
    }(t, i)) : (this.options.onwarn(function(e3, t2) {
      return { code: me.UNRESOLVED_IMPORT, importer: he(t2), message: `'${e3}' is imported by ${he(t2)}, but could not be resolved \u2013 treating it as an external dependency`, source: e3, url: "https://rollupjs.org/guide/en/#warning-treating-module-as-external-dependency" };
    }(t, i)), { external: true, id: t, meta: {}, moduleSideEffects: this.hasModuleSideEffects(t, true), syntheticNamedExports: false }) : (e2.external && e2.syntheticNamedExports && this.options.onwarn(function(e3, t2) {
      return { code: me.EXTERNAL_SYNTHETIC_EXPORTS, importer: he(t2), message: `External '${e3}' can not have 'syntheticNamedExports' enabled.`, source: e3 };
    }(t, i)), e2);
  }
  async loadEntryModule(e2, t, i, s) {
    const n2 = await Xo(e2, i, this.options.preserveSymlinks, this.pluginDriver, this.resolveId, null, se, true);
    return n2 == null ? pe(s === null ? function(e3) {
      return { code: me.UNRESOLVED_ENTRY, message: `Could not resolve entry module (${he(e3)}).` };
    }(e2) : function(e3, t2) {
      return { code: me.MISSING_IMPLICIT_DEPENDANT, message: `Module "${he(e3)}" that should be implicitly loaded before "${he(t2)}" could not be resolved.` };
    }(e2, s)) : n2 === false || typeof n2 == "object" && n2.external ? pe(s === null ? function(e3) {
      return { code: me.UNRESOLVED_ENTRY, message: `Entry module cannot be external (${he(e3)}).` };
    }(e2) : function(e3, t2) {
      return { code: me.MISSING_IMPLICIT_DEPENDANT, message: `Module "${he(e3)}" that should be implicitly loaded before "${he(t2)}" cannot be external.` };
    }(e2, s)) : this.fetchModule(this.getResolvedIdWithDefaults(typeof n2 == "object" ? n2 : { id: n2 }), void 0, t, false);
  }
  async resolveDynamicImport(e2, t, i) {
    var s, n2;
    const r2 = await this.pluginDriver.hookFirst("resolveDynamicImport", [t, i]);
    return typeof t != "string" ? typeof r2 == "string" ? r2 : r2 ? __spreadValues({ external: false, moduleSideEffects: true }, r2) : null : r2 == null ? (s = (n2 = e2.resolvedIds)[t]) !== null && s !== void 0 ? s : n2[t] = this.handleResolveId(await this.resolveId(t, e2.id, se, false), t, e2.id) : this.handleResolveId(this.getResolvedIdWithDefaults(this.getNormalizedResolvedIdWithoutDefaults(r2, i, t)), t, i);
  }
}
function il(e2, t) {
  return w(e2) ? t ? O(t, "..", e2) : O(e2) : e2;
}
function sl(e2, { fileName: t, name: i }, s, n2) {
  var r2;
  if (t !== null)
    e2.chunkFileNames.add(t);
  else if (i !== null) {
    let t2 = 0;
    for (; ((r2 = e2.chunkNames[t2]) === null || r2 === void 0 ? void 0 : r2.priority) < n2; )
      t2++;
    e2.chunkNames.splice(t2, 0, { isUserDefined: s, name: i, priority: n2 });
  }
}
function nl(e2, t, i) {
  return i === true || i === "ifRelativeSource" && w(t) || !P(e2);
}
async function rl(e2) {
  const [t, i] = await e2;
  return Promise.all([...t, ...i]);
}
class al extends Bt {
  constructor() {
    super(), this.parent = null, this.variables.set("undefined", new Rs());
  }
  findVariable(e2) {
    let t = this.variables.get(e2);
    return t || (t = new ii(e2), this.variables.set(e2, t)), t;
  }
}
function ol(e2, t, i, s, n2, r2) {
  let a2 = false;
  return (...o2) => (a2 || (a2 = true, ke({ message: `The "this.${t}" plugin context function used by plugin ${s} is deprecated. The "this.${i}" plugin context function should be used instead.`, plugin: s }, n2, r2)), e2(...o2));
}
function ll(e2, t, i, s, n2, r2) {
  let a2, o2 = true;
  if (typeof e2.cacheKey != "string" && (e2.name.startsWith("at position ") || e2.name.startsWith("at output position ") || r2.has(e2.name) ? o2 = false : r2.add(e2.name)), t)
    if (o2) {
      const i2 = e2.cacheKey || e2.name;
      h2 = t[i2] || (t[i2] = /* @__PURE__ */ Object.create(null)), a2 = { delete: (e3) => delete h2[e3], get(e3) {
        const t2 = h2[e3];
        if (t2)
          return t2[0] = 0, t2[1];
      }, has(e3) {
        const t2 = h2[e3];
        return !!t2 && (t2[0] = 0, true);
      }, set(e3, t2) {
        h2[e3] = [0, t2];
      } };
    } else
      l2 = e2.name, a2 = { delete: () => Jo(l2), get: () => Jo(l2), has: () => Jo(l2), set: () => Jo(l2) };
  else
    a2 = Zo;
  var l2, h2;
  const c2 = { addWatchFile(e3) {
    if (i.phase >= Gs.GENERATE)
      return this.error({ code: me.INVALID_ROLLUP_PHASE, message: "Cannot call addWatchFile after the build has finished." });
    i.watchFiles[e3] = true;
  }, cache: a2, emitAsset: ol((e3, t2) => n2.emitFile({ name: e3, source: t2, type: "asset" }), "emitAsset", "emitFile", e2.name, true, s), emitChunk: ol((e3, t2) => n2.emitFile({ id: e3, name: t2 && t2.name, type: "chunk" }), "emitChunk", "emitFile", e2.name, true, s), emitFile: n2.emitFile.bind(n2), error: (t2) => Yo(t2, e2.name), getAssetFileName: ol(n2.getFileName, "getAssetFileName", "getFileName", e2.name, true, s), getChunkFileName: ol(n2.getFileName, "getChunkFileName", "getFileName", e2.name, true, s), getFileName: n2.getFileName, getModuleIds: () => i.modulesById.keys(), getModuleInfo: i.getModuleInfo, getWatchFiles: () => Object.keys(i.watchFiles), isExternal: ol((e3, t2, i2 = false) => s.external(e3, t2, i2), "isExternal", "resolve", e2.name, true, s), load: (e3) => i.moduleLoader.preloadModule(e3), meta: { rollupVersion: "2.75.6", watchMode: i.watchMode }, get moduleIds() {
    const t2 = i.modulesById.keys();
    return function* () {
      ke({ message: `Accessing "this.moduleIds" on the plugin context by plugin ${e2.name} is deprecated. The "this.getModuleIds" plugin context function should be used instead.`, plugin: e2.name }, false, s), yield* t2;
    }();
  }, parse: i.contextParse.bind(i), resolve: (t2, s2, { custom: n3, isEntry: r3, skipSelf: a3 } = ie) => i.moduleLoader.resolveId(t2, s2, n3, r3, a3 ? [{ importer: s2, plugin: e2, source: t2 }] : null), resolveId: ol((e3, t2) => i.moduleLoader.resolveId(e3, t2, ie, void 0).then((e4) => e4 && e4.id), "resolveId", "resolve", e2.name, true, s), setAssetSource: n2.setAssetSource, warn(t2) {
    typeof t2 == "string" && (t2 = { message: t2 }), t2.code && (t2.pluginCode = t2.code), t2.code = "PLUGIN_WARNING", t2.plugin = e2.name, s.onwarn(t2);
  } };
  return c2;
}
const hl = Object.keys({ buildEnd: 1, buildStart: 1, closeBundle: 1, closeWatcher: 1, load: 1, moduleParsed: 1, options: 1, resolveDynamicImport: 1, resolveId: 1, shouldTransformCachedModule: 1, transform: 1, watchChange: 1 });
function cl(e2, t) {
  return pe({ code: "INVALID_PLUGIN_HOOK", message: `Error running plugin hook ${e2} for ${t}, expected a function hook.` });
}
class ul {
  constructor(e2, t, i, s, n2) {
    this.graph = e2, this.options = t, this.unfulfilledActions = /* @__PURE__ */ new Set(), function(e3, t2) {
      for (const { active: i2, deprecated: s2, replacement: n3 } of Qo)
        for (const r3 of e3)
          s2 in r3 && ke({ message: `The "${s2}" hook used by plugin ${r3.name} is deprecated. The "${n3}" hook should be used instead.`, plugin: r3.name }, i2, t2);
    }(i, t), this.pluginCache = s, this.fileEmitter = new Wr(e2, t, n2 && n2.fileEmitter), this.emitFile = this.fileEmitter.emitFile.bind(this.fileEmitter), this.getFileName = this.fileEmitter.getFileName.bind(this.fileEmitter), this.finaliseAssets = this.fileEmitter.assertAssetsFinalized.bind(this.fileEmitter), this.setOutputBundle = this.fileEmitter.setOutputBundle.bind(this.fileEmitter), this.plugins = i.concat(n2 ? n2.plugins : []);
    const r2 = /* @__PURE__ */ new Set();
    if (this.pluginContexts = new Map(this.plugins.map((i2) => [i2, ll(i2, s, e2, t, this.fileEmitter, r2)])), n2)
      for (const e3 of i)
        for (const i2 of hl)
          i2 in e3 && t.onwarn((a2 = e3.name, o2 = i2, { code: me.INPUT_HOOK_IN_OUTPUT_PLUGIN, message: `The "${o2}" hook used by the output plugin ${a2} is a build time hook and will not be run for that plugin. Either this plugin cannot be used as an output plugin, or it should have an option to configure it as an output plugin.` }));
    var a2, o2;
  }
  createOutputPluginDriver(e2) {
    return new ul(this.graph, this.options, e2, this.pluginCache, this);
  }
  getUnfulfilledHookActions() {
    return this.unfulfilledActions;
  }
  hookFirst(e2, t, i, s) {
    let n2 = Promise.resolve(void 0);
    for (const r2 of this.plugins)
      s && s.has(r2) || (n2 = n2.then((s2) => s2 != null ? s2 : this.runHook(e2, t, r2, false, i)));
    return n2;
  }
  hookFirstSync(e2, t, i) {
    for (const s of this.plugins) {
      const n2 = this.runHookSync(e2, t, s, i);
      if (n2 != null)
        return n2;
    }
    return null;
  }
  hookParallel(e2, t, i) {
    const s = [];
    for (const n2 of this.plugins) {
      const r2 = this.runHook(e2, t, n2, false, i);
      r2 && s.push(r2);
    }
    return Promise.all(s).then(() => {
    });
  }
  hookReduceArg0(e2, [t, ...i], s, n2) {
    let r2 = Promise.resolve(t);
    for (const t2 of this.plugins)
      r2 = r2.then((r3) => {
        const a2 = [r3, ...i], o2 = this.runHook(e2, a2, t2, false, n2);
        return o2 ? o2.then((e3) => s.call(this.pluginContexts.get(t2), r3, e3, t2)) : r3;
      });
    return r2;
  }
  hookReduceArg0Sync(e2, [t, ...i], s, n2) {
    for (const r2 of this.plugins) {
      const a2 = [t, ...i], o2 = this.runHookSync(e2, a2, r2, n2);
      t = s.call(this.pluginContexts.get(r2), t, o2, r2);
    }
    return t;
  }
  hookReduceValue(e2, t, i, s, n2) {
    let r2 = Promise.resolve(t);
    for (const t2 of this.plugins)
      r2 = r2.then((r3) => {
        const a2 = this.runHook(e2, i, t2, true, n2);
        return a2 ? a2.then((e3) => s.call(this.pluginContexts.get(t2), r3, e3, t2)) : r3;
      });
    return r2;
  }
  hookReduceValueSync(e2, t, i, s, n2) {
    let r2 = t;
    for (const t2 of this.plugins) {
      const a2 = this.runHookSync(e2, i, t2, n2);
      r2 = s.call(this.pluginContexts.get(t2), r2, a2, t2);
    }
    return r2;
  }
  hookSeq(e2, t, i) {
    let s = Promise.resolve();
    for (const n2 of this.plugins)
      s = s.then(() => this.runHook(e2, t, n2, false, i));
    return s;
  }
  runHook(e2, t, i, s, n2) {
    const r2 = i[e2];
    if (!r2)
      return;
    let a2 = this.pluginContexts.get(i);
    n2 && (a2 = n2(a2, i));
    let o2 = null;
    return Promise.resolve().then(() => {
      if (typeof r2 != "function")
        return s ? r2 : cl(e2, i.name);
      const n3 = r2.apply(a2, t);
      return n3 && n3.then ? (o2 = [i.name, e2, t], this.unfulfilledActions.add(o2), Promise.resolve(n3).then((e3) => (this.unfulfilledActions.delete(o2), e3))) : n3;
    }).catch((t2) => (o2 !== null && this.unfulfilledActions.delete(o2), Yo(t2, i.name, { hook: e2 })));
  }
  runHookSync(e2, t, i, s) {
    const n2 = i[e2];
    if (!n2)
      return;
    let r2 = this.pluginContexts.get(i);
    s && (r2 = s(r2, i));
    try {
      return typeof n2 != "function" ? cl(e2, i.name) : n2.apply(r2, t);
    } catch (t2) {
      return Yo(t2, i.name, { hook: e2 });
    }
  }
}
class dl {
  constructor(e2, t) {
    var i, s;
    if (this.options = e2, this.cachedModules = /* @__PURE__ */ new Map(), this.deoptimizationTracker = new U(), this.entryModules = [], this.modulesById = /* @__PURE__ */ new Map(), this.needsTreeshakingPass = false, this.phase = Gs.LOAD_AND_PARSE, this.scope = new al(), this.watchFiles = /* @__PURE__ */ Object.create(null), this.watchMode = false, this.externalModules = [], this.implicitEntryModules = [], this.modules = [], this.getModuleInfo = (e3) => {
      const t2 = this.modulesById.get(e3);
      return t2 ? t2.info : null;
    }, e2.cache !== false) {
      if ((i = e2.cache) === null || i === void 0 ? void 0 : i.modules)
        for (const t2 of e2.cache.modules)
          this.cachedModules.set(t2.id, t2);
      this.pluginCache = ((s = e2.cache) === null || s === void 0 ? void 0 : s.plugins) || /* @__PURE__ */ Object.create(null);
      for (const e3 in this.pluginCache) {
        const t2 = this.pluginCache[e3];
        for (const e4 of Object.values(t2))
          e4[0]++;
      }
    }
    if (t) {
      this.watchMode = true;
      const e3 = (...e4) => this.pluginDriver.hookParallel("watchChange", e4), i2 = () => this.pluginDriver.hookParallel("closeWatcher", []);
      t.onCurrentAwaited("change", e3), t.onCurrentAwaited("close", i2);
    }
    this.pluginDriver = new ul(this, e2, e2.plugins, this.pluginCache), this.acornParser = Ha.extend(...e2.acornInjectPlugins), this.moduleLoader = new tl(this, this.modulesById, this.options, this.pluginDriver);
  }
  async build() {
    en("generate module graph", 2), await this.generateModuleGraph(), tn("generate module graph", 2), en("sort modules", 2), this.phase = Gs.ANALYSE, this.sortModules(), tn("sort modules", 2), en("mark included statements", 2), this.includeStatements(), tn("mark included statements", 2), this.phase = Gs.GENERATE;
  }
  contextParse(e2, t = {}) {
    const i = t.onComment, s = [];
    t.onComment = i && typeof i == "function" ? (e3, n3, r2, a2, ...o2) => (s.push({ end: a2, start: r2, type: e3 ? "Block" : "Line", value: n3 }), i.call(t, e3, n3, r2, a2, ...o2)) : s;
    const n2 = this.acornParser.parse(e2, __spreadValues(__spreadValues({}, this.options.acorn), t));
    return typeof i == "object" && i.push(...s), t.onComment = i, function(e3, t2, i2) {
      const s2 = [], n3 = [];
      for (const t3 of e3)
        lt.test(t3.value) ? s2.push(t3) : it.test(t3.value) && n3.push(t3);
      for (const e4 of n3)
        ht(t2, e4, false);
      st(t2, { annotationIndex: 0, annotations: s2, code: i2 });
    }(s, n2, e2), n2;
  }
  getCache() {
    for (const e2 in this.pluginCache) {
      const t = this.pluginCache[e2];
      let i = true;
      for (const [e3, s] of Object.entries(t))
        s[0] >= this.options.experimentalCacheExpiry ? delete t[e3] : i = false;
      i && delete this.pluginCache[e2];
    }
    return { modules: this.modules.map((e2) => e2.toJSON()), plugins: this.pluginCache };
  }
  async generateModuleGraph() {
    var e2;
    if ({ entryModules: this.entryModules, implicitEntryModules: this.implicitEntryModules } = await this.moduleLoader.addEntryModules((e2 = this.options.input, Array.isArray(e2) ? e2.map((e3) => ({ fileName: null, id: e3, implicitlyLoadedAfter: [], importer: void 0, name: null })) : Object.entries(e2).map(([e3, t]) => ({ fileName: null, id: t, implicitlyLoadedAfter: [], importer: void 0, name: e3 }))), true), this.entryModules.length === 0)
      throw new Error("You must supply options.input to rollup");
    for (const e3 of this.modulesById.values())
      e3 instanceof ln ? this.modules.push(e3) : this.externalModules.push(e3);
  }
  includeStatements() {
    for (const e2 of [...this.entryModules, ...this.implicitEntryModules])
      rn(e2);
    if (this.options.treeshake) {
      let e2 = 1;
      do {
        en(`treeshaking pass ${e2}`, 3), this.needsTreeshakingPass = false;
        for (const e3 of this.modules)
          e3.isExecuted && (e3.info.moduleSideEffects === "no-treeshake" ? e3.includeAllInBundle() : e3.include());
        if (e2 === 1)
          for (const e3 of [...this.entryModules, ...this.implicitEntryModules])
            e3.preserveSignature !== false && (e3.includeAllExports(false), this.needsTreeshakingPass = true);
        tn("treeshaking pass " + e2++, 3);
      } while (this.needsTreeshakingPass);
    } else
      for (const e2 of this.modules)
        e2.includeAllInBundle();
    for (const e2 of this.externalModules)
      e2.warnUnusedImports();
    for (const e2 of this.implicitEntryModules)
      for (const t of e2.implicitlyLoadedAfter)
        t.info.isEntry || t.isIncluded() || pe(be(t));
  }
  sortModules() {
    const { orderedModules: e2, cyclePaths: t } = function(e3) {
      let t2 = 0;
      const i = [], s = /* @__PURE__ */ new Set(), n2 = /* @__PURE__ */ new Set(), r2 = /* @__PURE__ */ new Map(), a2 = [], o2 = (e4) => {
        if (e4 instanceof ln) {
          for (const t3 of e4.dependencies)
            r2.has(t3) ? s.has(t3) || i.push(Jr(t3, e4, r2)) : (r2.set(t3, e4), o2(t3));
          for (const t3 of e4.implicitlyLoadedBefore)
            n2.add(t3);
          for (const { resolution: t3 } of e4.dynamicImports)
            t3 instanceof ln && n2.add(t3);
          a2.push(e4);
        }
        e4.execIndex = t2++, s.add(e4);
      };
      for (const t3 of e3)
        r2.has(t3) || (r2.set(t3, null), o2(t3));
      for (const e4 of n2)
        r2.has(e4) || (r2.set(e4, null), o2(e4));
      return { cyclePaths: i, orderedModules: a2 };
    }(this.entryModules);
    for (const e3 of t)
      this.options.onwarn({ code: "CIRCULAR_DEPENDENCY", cycle: e3, importer: e3[0], message: `Circular dependency: ${e3.join(" -> ")}` });
    this.modules = e2;
    for (const e3 of this.modules)
      e3.bindReferences();
    this.warnForMissingExports();
  }
  warnForMissingExports() {
    for (const e2 of this.modules)
      for (const t of e2.importDescriptions.values())
        t.name === "*" || t.module.getVariableForExportName(t.name)[0] || e2.warn({ code: "NON_EXISTENT_EXPORT", message: `Non-existent export '${t.name}' is imported from ${he(t.module.id)}`, name: t.name, source: t.module.id }, t.start);
  }
}
function pl(e2) {
  return Array.isArray(e2) ? e2.filter(Boolean) : e2 ? [e2] : [];
}
function fl(e2, t) {
  return t();
}
const ml = (e2) => console.warn(e2.message || e2);
function gl(e2, t, i, s, n2 = /$./) {
  const r2 = new Set(t), a2 = Object.keys(e2).filter((e3) => !(r2.has(e3) || n2.test(e3)));
  a2.length > 0 && s({ code: "UNKNOWN_OPTION", message: `Unknown ${i}: ${a2.join(", ")}. Allowed options: ${[...r2].sort().join(", ")}` });
}
const yl = { recommended: { annotations: true, correctVarValueBeforeDeclaration: false, moduleSideEffects: () => true, propertyReadSideEffects: true, tryCatchDeoptimization: true, unknownGlobalSideEffects: false }, safest: { annotations: true, correctVarValueBeforeDeclaration: true, moduleSideEffects: () => true, propertyReadSideEffects: true, tryCatchDeoptimization: true, unknownGlobalSideEffects: true }, smallest: { annotations: true, correctVarValueBeforeDeclaration: false, moduleSideEffects: () => false, propertyReadSideEffects: false, tryCatchDeoptimization: false, unknownGlobalSideEffects: false } }, xl = { es2015: { arrowFunctions: true, constBindings: true, objectShorthand: true, reservedNamesAsProps: true, symbols: true }, es5: { arrowFunctions: false, constBindings: false, objectShorthand: false, reservedNamesAsProps: true, symbols: false } }, El = (e2, t, i, s) => {
  const n2 = e2 == null ? void 0 : e2.preset;
  if (n2) {
    const s2 = t[n2];
    if (s2)
      return __spreadValues(__spreadValues({}, s2), e2);
    pe(xe(`${i}.preset`, bl(i), `valid values are ${oe(Object.keys(t))}`, n2));
  }
  return ((e3, t2, i2) => (s2) => {
    if (typeof s2 == "string") {
      const n3 = e3[s2];
      if (n3)
        return n3;
      pe(xe(t2, bl(t2), `valid values are ${i2}${oe(Object.keys(e3))}. You can also supply an object for more fine-grained control`, s2));
    }
    return ((e4) => e4 && typeof e4 == "object" ? e4 : {})(s2);
  })(t, i, s)(e2);
}, bl = (e2) => e2.split(".").join("").toLowerCase();
const vl = (e2) => {
  const { onwarn: t } = e2;
  return t ? (e3) => {
    e3.toString = () => {
      let t2 = "";
      return e3.plugin && (t2 += `(${e3.plugin} plugin) `), e3.loc && (t2 += `${he(e3.loc.file)} (${e3.loc.line}:${e3.loc.column}) `), t2 += e3.message, t2;
    }, t(e3, ml);
  } : ml;
}, Sl = (e2) => __spreadValues({ allowAwaitOutsideFunction: true, ecmaVersion: "latest", preserveParens: false, sourceType: "module" }, e2.acorn), Al = (e2) => pl(e2.acornInjectPlugins), Il = (e2) => {
  var t;
  return ((t = e2.cache) === null || t === void 0 ? void 0 : t.cache) || e2.cache;
}, kl = (e2) => {
  if (e2 === true)
    return () => true;
  if (typeof e2 == "function")
    return (t, ...i) => !t.startsWith("\0") && e2(t, ...i) || false;
  if (e2) {
    const t = /* @__PURE__ */ new Set(), i = [];
    for (const s of pl(e2))
      s instanceof RegExp ? i.push(s) : t.add(s);
    return (e3, ...s) => t.has(e3) || i.some((t2) => t2.test(e3));
  }
  return () => false;
}, Pl = (e2, t, i) => {
  const s = e2.inlineDynamicImports;
  return s && Pe('The "inlineDynamicImports" option is deprecated. Use the "output.inlineDynamicImports" option instead.', false, t, i), s;
}, wl = (e2) => {
  const t = e2.input;
  return t == null ? [] : typeof t == "string" ? [t] : t;
}, Cl = (e2, t, i) => {
  const s = e2.manualChunks;
  return s && Pe('The "manualChunks" option is deprecated. Use the "output.manualChunks" option instead.', false, t, i), s;
}, _l = (e2) => {
  const t = e2.maxParallelFileReads;
  return typeof t == "number" ? t <= 0 ? 1 / 0 : t : 20;
}, Nl = (e2, t) => {
  const i = e2.moduleContext;
  if (typeof i == "function")
    return (e3) => {
      var s;
      return (s = i(e3)) !== null && s !== void 0 ? s : t;
    };
  if (i) {
    const e3 = /* @__PURE__ */ Object.create(null);
    for (const [t2, s] of Object.entries(i))
      e3[O(t2)] = s;
    return (i2) => e3[i2] || t;
  }
  return () => t;
}, $l = (e2, t) => {
  const i = e2.preserveEntrySignatures;
  return i == null && t.add("preserveEntrySignatures"), i != null ? i : "strict";
}, Tl = (e2, t, i) => {
  const s = e2.preserveModules;
  return s && Pe('The "preserveModules" option is deprecated. Use the "output.preserveModules" option instead.', false, t, i), s;
}, Ol = (e2, t, i) => {
  const s = e2.treeshake;
  if (s === false)
    return false;
  const n2 = El(e2.treeshake, yl, "treeshake", "false, true, ");
  return n2.pureExternalModules !== void 0 && Pe(`The "treeshake.pureExternalModules" option is deprecated. The "treeshake.moduleSideEffects" option should be used instead. "treeshake.pureExternalModules: true" is equivalent to "treeshake.moduleSideEffects: 'no-external'"`, true, t, i), { annotations: n2.annotations !== false, correctVarValueBeforeDeclaration: n2.correctVarValueBeforeDeclaration === true, moduleSideEffects: typeof s == "object" && s.pureExternalModules ? Rl(s.moduleSideEffects, s.pureExternalModules) : Rl(n2.moduleSideEffects, void 0), propertyReadSideEffects: n2.propertyReadSideEffects === "always" ? "always" : n2.propertyReadSideEffects !== false, tryCatchDeoptimization: n2.tryCatchDeoptimization !== false, unknownGlobalSideEffects: n2.unknownGlobalSideEffects !== false };
}, Rl = (e2, t) => {
  if (typeof e2 == "boolean")
    return () => e2;
  if (e2 === "no-external")
    return (e3, t2) => !t2;
  if (typeof e2 == "function")
    return (t2, i2) => !!t2.startsWith("\0") || e2(t2, i2) !== false;
  if (Array.isArray(e2)) {
    const t2 = new Set(e2);
    return (e3) => t2.has(e3);
  }
  e2 && pe(xe("treeshake.moduleSideEffects", "treeshake", 'please use one of false, "no-external", a function or an array'));
  const i = kl(t);
  return (e3, t2) => !(t2 && i(e3));
}, Ml = /[\x00-\x1F\x7F<>*#"{}|^[\]`;?:&=+$,]/g, Dl = /^[a-z]:/i;
function Ll(e2) {
  const t = Dl.exec(e2), i = t ? t[0] : "";
  return i + e2.substr(i.length).replace(Ml, "_");
}
const Vl = (e2, t, i) => {
  const { file: s } = e2;
  if (typeof s == "string") {
    if (t)
      return pe(xe("output.file", "outputdir", 'you must set "output.dir" instead of "output.file" when using the "output.preserveModules" option'));
    if (!Array.isArray(i.input))
      return pe(xe("output.file", "outputdir", 'you must set "output.dir" instead of "output.file" when providing named inputs'));
  }
  return s;
}, Bl = (e2) => {
  const t = e2.format;
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
}, Fl = (e2, t) => {
  var i;
  const s = ((i = e2.inlineDynamicImports) !== null && i !== void 0 ? i : t.inlineDynamicImports) || false, { input: n2 } = t;
  return s && (Array.isArray(n2) ? n2 : Object.keys(n2)).length > 1 ? pe(xe("output.inlineDynamicImports", "outputinlinedynamicimports", 'multiple inputs are not supported when "output.inlineDynamicImports" is true')) : s;
}, zl = (e2, t, i) => {
  var s;
  const n2 = ((s = e2.preserveModules) !== null && s !== void 0 ? s : i.preserveModules) || false;
  if (n2) {
    if (t)
      return pe(xe("output.inlineDynamicImports", "outputinlinedynamicimports", 'this option is not supported for "output.preserveModules"'));
    if (i.preserveEntrySignatures === false)
      return pe(xe("preserveEntrySignatures", "preserveentrysignatures", 'setting this option to false is not supported for "output.preserveModules"'));
  }
  return n2;
}, jl = (e2, t) => {
  const i = e2.preferConst;
  return i != null && ke('The "output.preferConst" option is deprecated. Use the "output.generatedCode.constBindings" option instead.', false, t), !!i;
}, Ul = (e2) => {
  const { preserveModulesRoot: t } = e2;
  if (t != null)
    return O(t);
}, Gl = (e2) => {
  const t = __spreadValues({ autoId: false, basePath: "", define: "define" }, e2.amd);
  if ((t.autoId || t.basePath) && t.id)
    return pe(xe("output.amd.id", "outputamd", 'this option cannot be used together with "output.amd.autoId"/"output.amd.basePath"'));
  if (t.basePath && !t.autoId)
    return pe(xe("output.amd.basePath", "outputamd", 'this option only works with "output.amd.autoId"'));
  let i;
  return i = t.autoId ? { autoId: true, basePath: t.basePath, define: t.define } : { autoId: false, define: t.define, id: t.id }, i;
}, Hl = (e2, t) => {
  const i = e2[t];
  return typeof i == "function" ? i : () => i || "";
}, Wl = (e2, t) => {
  const { dir: i } = e2;
  return typeof i == "string" && typeof t == "string" ? pe(xe("output.dir", "outputdir", 'you must set either "output.file" for a single-file build or "output.dir" when generating multiple chunks')) : i;
}, ql = (e2, t) => {
  const i = e2.dynamicImportFunction;
  return i && ke('The "output.dynamicImportFunction" option is deprecated. Use the "renderDynamicImport" plugin hook instead.', false, t), i;
}, Kl = (e2, t) => {
  const i = e2.entryFileNames;
  return i == null && t.add("entryFileNames"), i != null ? i : "[name].js";
};
function Xl(e2, t) {
  const i = e2.exports;
  if (i == null)
    t.add("exports");
  else if (!["default", "named", "none", "auto"].includes(i))
    return pe((s = i, { code: me.INVALID_EXPORT_OPTION, message: `"output.exports" must be "default", "named", "none", "auto", or left unspecified (defaults to "auto"), received "${s}"`, url: "https://rollupjs.org/guide/en/#outputexports" }));
  var s;
  return i || "auto";
}
const Yl = (e2, t) => {
  const i = El(e2.generatedCode, xl, "output.generatedCode", "");
  return { arrowFunctions: i.arrowFunctions === true, constBindings: i.constBindings === true || t, objectShorthand: i.objectShorthand === true, reservedNamesAsProps: i.reservedNamesAsProps === true, symbols: i.symbols === true };
}, Ql = (e2, t) => {
  if (t)
    return "";
  const i = e2.indent;
  return i === false ? "" : i == null || i;
}, Zl = /* @__PURE__ */ new Set(["auto", "esModule", "default", "defaultOnly", true, false]), Jl = (e2, t) => {
  const i = e2.interop, s = /* @__PURE__ */ new Set(), n2 = (e3) => {
    if (!s.has(e3)) {
      if (s.add(e3), !Zl.has(e3))
        return pe(xe("output.interop", "outputinterop", `use one of ${Array.from(Zl, (e4) => JSON.stringify(e4)).join(", ")}`, e3));
      typeof e3 == "boolean" && ke({ message: `The boolean value "${e3}" for the "output.interop" option is deprecated. Use ${e3 ? '"auto"' : '"esModule", "default" or "defaultOnly"'} instead.`, url: "https://rollupjs.org/guide/en/#outputinterop" }, false, t);
    }
    return e3;
  };
  if (typeof i == "function") {
    const e3 = /* @__PURE__ */ Object.create(null);
    let t2 = null;
    return (s2) => s2 === null ? t2 || n2(t2 = i(s2)) : s2 in e3 ? e3[s2] : n2(e3[s2] = i(s2));
  }
  return i === void 0 ? () => true : () => n2(i);
}, eh = (e2, t, i, s) => {
  const n2 = e2.manualChunks || s.manualChunks;
  if (n2) {
    if (t)
      return pe(xe("output.manualChunks", "outputmanualchunks", 'this option is not supported for "output.inlineDynamicImports"'));
    if (i)
      return pe(xe("output.manualChunks", "outputmanualchunks", 'this option is not supported for "output.preserveModules"'));
  }
  return n2 || {};
}, th = (e2, t, i) => {
  var s;
  return (s = e2.minifyInternalExports) !== null && s !== void 0 ? s : i || t === "es" || t === "system";
}, ih = (e2, t, i) => {
  const s = e2.namespaceToStringTag;
  return s != null ? (ke('The "output.namespaceToStringTag" option is deprecated. Use the "output.generatedCode.symbols" option instead.', false, i), s) : t.symbols || false;
};
function sh(e2) {
  return async function(e3, t) {
    const { options: i, unsetOptions: s } = await async function(e4, t2) {
      if (!e4)
        throw new Error("You must supply an options object to rollup");
      const i2 = pl(e4.plugins), { options: s2, unsetOptions: n3 } = function(e5) {
        var t3, i3, s3;
        const n4 = /* @__PURE__ */ new Set(), r3 = (t3 = e5.context) !== null && t3 !== void 0 ? t3 : "undefined", a3 = vl(e5), o2 = e5.strictDeprecations || false, l2 = { acorn: Sl(e5), acornInjectPlugins: Al(e5), cache: Il(e5), context: r3, experimentalCacheExpiry: (i3 = e5.experimentalCacheExpiry) !== null && i3 !== void 0 ? i3 : 10, external: kl(e5.external), inlineDynamicImports: Pl(e5, a3, o2), input: wl(e5), makeAbsoluteExternalsRelative: (s3 = e5.makeAbsoluteExternalsRelative) === null || s3 === void 0 || s3, manualChunks: Cl(e5, a3, o2), maxParallelFileReads: _l(e5), moduleContext: Nl(e5, r3), onwarn: a3, perf: e5.perf || false, plugins: pl(e5.plugins), preserveEntrySignatures: $l(e5, n4), preserveModules: Tl(e5, a3, o2), preserveSymlinks: e5.preserveSymlinks || false, shimMissingExports: e5.shimMissingExports || false, strictDeprecations: o2, treeshake: Ol(e5, a3, o2) };
        return gl(e5, [...Object.keys(l2), "watch"], "input options", l2.onwarn, /^(output)$/), { options: l2, unsetOptions: n4 };
      }(await i2.reduce(function(e5) {
        return async (t3, i3) => i3.options && await i3.options.call({ meta: { rollupVersion: "2.75.6", watchMode: e5 } }, await t3) || t3;
      }(t2), Promise.resolve(e4)));
      return nh(s2.plugins, "at position "), { options: s2, unsetOptions: n3 };
    }(e3, t !== null);
    !function(e4) {
      e4.perf ? (Xs = /* @__PURE__ */ new Map(), en = Qs, tn = Zs, e4.plugins = e4.plugins.map(nn)) : (en = Ks, tn = Ks);
    }(i);
    const n2 = new dl(i, t), r2 = e3.cache !== false;
    delete i.cache, delete e3.cache, en("BUILD", 1), await fl(n2.pluginDriver, async () => {
      try {
        await n2.pluginDriver.hookParallel("buildStart", [i]), await n2.build();
      } catch (e4) {
        const t2 = Object.keys(n2.watchFiles);
        throw t2.length > 0 && (e4.watchFiles = t2), await n2.pluginDriver.hookParallel("buildEnd", [e4]), await n2.pluginDriver.hookParallel("closeBundle", []), e4;
      }
      await n2.pluginDriver.hookParallel("buildEnd", []);
    }), tn("BUILD", 1);
    const a2 = { cache: r2 ? n2.getCache() : void 0, async close() {
      a2.closed || (a2.closed = true, await n2.pluginDriver.hookParallel("closeBundle", []));
    }, closed: false, generate: async (e4) => a2.closed ? pe(Ie()) : rh(false, i, s, e4, n2), watchFiles: Object.keys(n2.watchFiles), write: async (e4) => a2.closed ? pe(Ie()) : rh(true, i, s, e4, n2) };
    i.perf && (a2.getTimings = Js);
    return a2;
  }(e2, null);
}
function nh(e2, t) {
  e2.forEach((e3, i) => {
    e3.name || (e3.name = `${t}${i + 1}`);
  });
}
function rh(e2, t, i, s, n2) {
  const { options: r2, outputPluginDriver: a2, unsetOptions: o2 } = function(e3, t2, i2, s2) {
    if (!e3)
      throw new Error("You must supply an options object");
    const n3 = pl(e3.plugins);
    nh(n3, "at output position ");
    const r3 = t2.createOutputPluginDriver(n3);
    return __spreadProps(__spreadValues({}, ah(i2, s2, e3, r3)), { outputPluginDriver: r3 });
  }(s, n2.pluginDriver, t, i);
  return fl(0, async () => {
    const i2 = new ia(r2, o2, t, a2, n2), s2 = await i2.generate(e2);
    if (e2) {
      if (!r2.dir && !r2.file)
        return pe({ code: "MISSING_OPTION", message: 'You must specify "output.file" or "output.dir" for the build.' });
      await Promise.all(Object.values(s2).map((e3) => async function(e4, t2) {
        const i3 = O(t2.dir || N(t2.file), e4.fileName);
        let s3, n3;
        if (await Ko.mkdir(N(i3), { recursive: true }), e4.type === "asset")
          n3 = e4.source;
        else if (n3 = e4.code, t2.sourcemap && e4.map) {
          let r3;
          t2.sourcemap === "inline" ? r3 = e4.map.toUrl() : (r3 = `${_(e4.fileName)}.map`, s3 = Ko.writeFile(`${i3}.map`, e4.map.toString())), t2.sourcemap !== "hidden" && (n3 += `//# sourceMappingURL=${r3}
`);
        }
        return Promise.all([Ko.writeFile(i3, n3), s3]);
      }(e3, r2))), await a2.hookParallel("writeBundle", [r2, s2]);
    }
    return l2 = s2, { output: Object.values(l2).filter((e3) => Object.keys(e3).length > 0).sort((e3, t2) => {
      const i3 = lh(e3), s3 = lh(t2);
      return i3 === s3 ? 0 : i3 < s3 ? -1 : 1;
    }) };
    var l2;
  });
}
function ah(e2, t, i, s) {
  return function(e3, t2, i2) {
    var s2, n2, r2, a2, o2, l2, h2;
    const c2 = new Set(i2), u2 = e3.compact || false, d2 = Bl(e3), p2 = Fl(e3, t2), f3 = zl(e3, p2, t2), m3 = Vl(e3, f3, t2), g2 = jl(e3, t2), y2 = Yl(e3, g2), x2 = { amd: Gl(e3), assetFileNames: (s2 = e3.assetFileNames) !== null && s2 !== void 0 ? s2 : "assets/[name]-[hash][extname]", banner: Hl(e3, "banner"), chunkFileNames: (n2 = e3.chunkFileNames) !== null && n2 !== void 0 ? n2 : "[name]-[hash].js", compact: u2, dir: Wl(e3, m3), dynamicImportFunction: ql(e3, t2), entryFileNames: Kl(e3, c2), esModule: (r2 = e3.esModule) === null || r2 === void 0 || r2, exports: Xl(e3, c2), extend: e3.extend || false, externalLiveBindings: (a2 = e3.externalLiveBindings) === null || a2 === void 0 || a2, file: m3, footer: Hl(e3, "footer"), format: d2, freeze: (o2 = e3.freeze) === null || o2 === void 0 || o2, generatedCode: y2, globals: e3.globals || {}, hoistTransitiveImports: (l2 = e3.hoistTransitiveImports) === null || l2 === void 0 || l2, indent: Ql(e3, u2), inlineDynamicImports: p2, interop: Jl(e3, t2), intro: Hl(e3, "intro"), manualChunks: eh(e3, p2, f3, t2), minifyInternalExports: th(e3, d2, u2), name: e3.name, namespaceToStringTag: ih(e3, y2, t2), noConflict: e3.noConflict || false, outro: Hl(e3, "outro"), paths: e3.paths || {}, plugins: pl(e3.plugins), preferConst: g2, preserveModules: f3, preserveModulesRoot: Ul(e3), sanitizeFileName: typeof e3.sanitizeFileName == "function" ? e3.sanitizeFileName : e3.sanitizeFileName === false ? (e4) => e4 : Ll, sourcemap: e3.sourcemap || false, sourcemapExcludeSources: e3.sourcemapExcludeSources || false, sourcemapFile: e3.sourcemapFile, sourcemapPathTransform: e3.sourcemapPathTransform, strict: (h2 = e3.strict) === null || h2 === void 0 || h2, systemNullSetters: e3.systemNullSetters || false, validate: e3.validate || false };
    return gl(e3, Object.keys(x2), "output options", t2.onwarn), { options: x2, unsetOptions: c2 };
  }(s.hookReduceArg0Sync("outputOptions", [i.output || i], (e3, t2) => t2 || e3, (e3) => {
    const t2 = () => e3.error({ code: me.CANNOT_EMIT_FROM_OPTIONS_HOOK, message: 'Cannot emit files or set asset sources in the "outputOptions" hook, use the "renderStart" hook instead.' });
    return __spreadProps(__spreadValues({}, e3), { emitFile: t2, setAssetSource: t2 });
  }), e2, t);
}
var oh;
function lh(e2) {
  return e2.type === "asset" ? oh.ASSET : e2.isEntry ? oh.ENTRY_CHUNK : oh.SECONDARY_CHUNK;
}
!function(e2) {
  e2[e2.ENTRY_CHUNK = 0] = "ENTRY_CHUNK", e2[e2.SECONDARY_CHUNK = 1] = "SECONDARY_CHUNK", e2[e2.ASSET = 2] = "ASSET";
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
