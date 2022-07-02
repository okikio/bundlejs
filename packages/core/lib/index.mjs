import { c as commonjsGlobal } from "./esbuild.mjs";
export { s as schema } from "./schema.mjs";
const version$1 = "0.14.48";
var bytes$2 = { exports: {} };
/*!
 * bytes
 * Copyright(c) 2012-2014 TJ Holowaychuk
 * Copyright(c) 2015 Jed Watson
 * MIT Licensed
 */
bytes$2.exports = bytes$1;
bytes$2.exports.format = format$2;
bytes$2.exports.parse = parse$9;
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
    return parse$9(value);
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
    str = str.split(".").map(function(s2, i) {
      return i === 0 ? s2.replace(formatThousandsRegExp, thousandsSeparator) : s2;
    }).join(".");
  }
  return str + unitSeparator + unit;
}
function parse$9(val) {
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
const isExternal = (id2, external = []) => {
  return [...ExternalPackages, ...external].find((it) => {
    if (it === id2)
      return true;
    if (id2.startsWith(`${it}/`))
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
      const { Deno: Deno2 } = globalThis;
      if (typeof Deno2?.cwd !== "function") {
        throw new TypeError("Resolved a relative path without a CWD.");
      }
      path2 = Deno2?.cwd?.() ?? "/";
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
function normalize$3(path2) {
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
  return normalize$3(joined);
}
function relative$1(from3, to) {
  assertPath(from3);
  assertPath(to);
  if (from3 === to)
    return "";
  from3 = resolve$2(from3);
  to = resolve$2(to);
  if (from3 === to)
    return "";
  let fromStart = 1;
  const fromEnd = from3.length;
  for (; fromStart < fromEnd; ++fromStart) {
    if (from3.charCodeAt(fromStart) !== CHAR_FORWARD_SLASH)
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
        if (from3.charCodeAt(fromStart + i) === CHAR_FORWARD_SLASH) {
          lastCommonSep = i;
        } else if (i === 0) {
          lastCommonSep = 0;
        }
      }
      break;
    }
    const fromCode = from3.charCodeAt(fromStart + i);
    const toCode = to.charCodeAt(toStart + i);
    if (fromCode !== toCode)
      break;
    else if (fromCode === CHAR_FORWARD_SLASH)
      lastCommonSep = i;
  }
  let out = "";
  for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
    if (i === fromEnd || from3.charCodeAt(i) === CHAR_FORWARD_SLASH) {
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
function parse$8(path2) {
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
  normalize: normalize$3,
  isAbsolute: isAbsolute$1,
  join: join$2,
  relative: relative$1,
  toNamespacedPath: toNamespacedPath$1,
  dirname: dirname$1,
  basename: basename$1,
  extname: extname$1,
  format: format$1,
  parse: parse$8,
  fromFileUrl: fromFileUrl$1,
  toFileUrl: toFileUrl$1
}, Symbol.toStringTag, { value: "Module" }));
const path$3 = _posix;
const { join: join$1, normalize: normalize$2 } = path$3;
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
  for (let j = 0; j < glob.length; ) {
    let segment = "";
    const groupStack = [];
    let inRange = false;
    let inEscape = false;
    let endsWithSep = false;
    let i = j;
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
      for (const c2 of glob.slice(j, i)) {
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
    if (!(i > j)) {
      throw new Error("Assertion failure: i > j (potential infinite loop)");
    }
    j = i;
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
  let match2;
  while (match2 = regex.exec(str)) {
    if (match2[2])
      return true;
    let idx = match2.index + match2[0].length;
    const open = match2[1];
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
    return normalize$2(glob);
  }
  const s2 = SEP_PATTERN.source;
  const badParentPattern = new RegExp(`(?<=(${s2}|^)\\*\\*${s2})\\.\\.(?=${s2}|$)`, "g");
  return normalize$2(glob.replace(badParentPattern, "\0")).replace(/\0/g, "..");
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
const path$2 = _posix;
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
  normalize: normalize$1,
  parse: parse$7,
  relative,
  resolve: resolve$1,
  sep,
  toFileUrl,
  toNamespacedPath
} = path$2;
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
  normalize: normalize$1,
  parse: parse$7,
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
function loop$1(exports, keys2) {
  if (typeof exports === "string") {
    return exports;
  }
  if (exports) {
    let idx, tmp;
    if (Array.isArray(exports)) {
      for (idx = 0; idx < exports.length; idx++) {
        if (tmp = loop$1(exports[idx], keys2))
          return tmp;
      }
    } else {
      for (idx in exports) {
        if (keys2.has(idx)) {
          return loop$1(exports[idx], keys2);
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
    let { browser, require, unsafe, conditions = [] } = options;
    let target = toName$1(name, entry);
    if (target[0] !== ".")
      target = "./" + target;
    if (typeof exports === "string") {
      return target === "." ? exports : bail$1(name, target);
    }
    let allows = /* @__PURE__ */ new Set(["default", ...conditions]);
    unsafe || allows.add(require ? "require" : "import");
    unsafe || allows.add(browser ? "browser" : "node");
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
  let i = 0, value, browser = options.browser, fields = options.fields || ["module", "main"];
  if (browser && !fields.includes("browser")) {
    fields.unshift("browser");
  }
  for (; i < fields.length; i++) {
    if (value = pkg[fields[i]]) {
      if (typeof value == "string")
        ;
      else if (typeof value == "object" && fields[i] == "browser") {
        if (typeof browser == "string") {
          value = value[browser = toName$1(pkg.name, browser)];
          if (value == null)
            return browser;
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
function parse$6(input) {
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
function loop(imports, keys2) {
  if (typeof imports === "string") {
    return imports;
  }
  if (imports) {
    let idx, tmp;
    if (Array.isArray(imports)) {
      for (idx = 0; idx < imports.length; idx++) {
        if (tmp = loop(imports[idx], keys2))
          return tmp;
      }
    } else {
      for (idx in imports) {
        if (keys2.has(idx)) {
          return loop(imports[idx], keys2);
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
    let { browser, require, unsafe, conditions = [] } = options;
    let target = toName(name, entry);
    if (typeof imports === "string") {
      return target === "#" ? imports : bail(name, target);
    }
    let allows = /* @__PURE__ */ new Set(["default", ...conditions]);
    unsafe || allows.add(require ? "require" : "import");
    unsafe || allows.add(browser ? "browser" : "node");
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
      let parsed = parse$6(argPath);
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
          let version22 = NPM_CDN ? "@" + pkg.version : "";
          let { url: { href } } = getCDNUrl(`${pkg.name}${version22}${subpath}`);
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
        let keys2 = Object.keys(deps);
        if (keys2.includes(argPath))
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
      let version2 = NPM_CDN ? "@" + parsed.version : "";
      let { url } = getCDNUrl(`${parsed.name}${version2}${subpath}`, origin);
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
const isAlias = (id2, aliases = {}) => {
  if (!isBareImport(id2))
    return false;
  let aliasKeys = Object.keys(aliases);
  let path2 = id2.replace(/^node\:/, "");
  let pkgDetails = parse$6(path2);
  return aliasKeys.find((it) => {
    return pkgDetails.name === it;
  });
};
const ALIAS_RESOLVE = (aliases = {}, host = DEFAULT_CDN_HOST, events) => {
  return async (args) => {
    let path2 = args.path.replace(/^node\:/, "");
    let { path: argPath } = getCDNUrl(path2);
    if (isAlias(argPath, aliases)) {
      let pkgDetails = parse$6(argPath);
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
const isObject$f = (obj) => typeof obj === "object" && obj != null;
const isPrimitive = (val) => typeof val === "object" ? val === null : typeof val !== "function";
const isValidKey = (key) => {
  return key !== "__proto__" && key !== "constructor" && key !== "prototype";
};
const deepEqual = (obj1, obj2) => {
  if (obj1 === obj2) {
    return true;
  } else if (isObject$f(obj1) && isObject$f(obj2)) {
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
  let keys2 = Object.keys(obj2);
  let result = {};
  let i = 0;
  for (; i < keys2.length; i++) {
    let key = keys2[i];
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
      } else if (isObject$f(obj1[key]) && isObject$f(value)) {
        let diff3 = deepDiff(obj1[key], value);
        if (Object.keys(diff3).length)
          result[key] = diff3;
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
    if (isObject$f(args[i])) {
      for (const key of Object.keys(args[i])) {
        if (isValidKey(key)) {
          if (isObject$f(target[key]) && isObject$f(args[i][key])) {
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
  set(e, t2) {
    return this.map.set(e, t2), this;
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
    let t2 = this.keys()[this.size - e];
    return this.get(t2);
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
  forEach(e, t2) {
    return this.map.forEach(e, t2), this;
  }
  [Symbol.iterator]() {
    return this.entries();
  }
}, b$1 = (p, e, ...t2) => {
  p.forEach((n) => {
    n[e](...t2);
  });
};
var h = ({ callback: p = () => {
}, scope: e = null, name: t2 = "event" }) => ({ callback: p, scope: e, name: t2 }), c = class extends o {
  constructor(e = "event") {
    super();
    this.name = e;
  }
}, y$1 = class extends o {
  constructor() {
    super();
  }
  getEvent(e) {
    let t2 = this.get(e);
    return t2 instanceof c ? t2 : (this.set(e, new c(e)), this.get(e));
  }
  newListener(e, t2, n) {
    let r = this.getEvent(e);
    return r.add(h({ name: e, callback: t2, scope: n })), r;
  }
  on(e, t2, n) {
    if (typeof e == "undefined" || e == null)
      return this;
    typeof e == "string" && (e = e.trim().split(/\s/g));
    let r, i, a = typeof e == "object" && !Array.isArray(e), l = a ? t2 : n;
    return a || (i = t2), Object.keys(e).forEach((s2) => {
      r = a ? s2 : e[s2], a && (i = e[s2]), this.newListener(r, i, l);
    }, this), this;
  }
  removeListener(e, t2, n) {
    let r = this.get(e);
    if (r instanceof c && t2) {
      let i = h({ name: e, callback: t2, scope: n });
      r.forEach((a, l) => {
        if (a.callback === i.callback && a.scope === i.scope)
          return r.remove(l);
      });
    }
    return r;
  }
  off(e, t2, n) {
    if (typeof e == "undefined" || e == null)
      return this;
    typeof e == "string" && (e = e.trim().split(/\s/g));
    let r, i, a = typeof e == "object" && !Array.isArray(e), l = a ? t2 : n;
    return a || (i = t2), Object.keys(e).forEach((s2) => {
      r = a ? s2 : e[s2], a && (i = e[s2]), typeof i == "function" ? this.removeListener(r, i, l) : this.remove(r);
    }, this), this;
  }
  once(e, t2, n) {
    if (typeof e == "undefined" || e == null)
      return this;
    typeof e == "string" && (e = e.trim().split(/\s/g));
    let r = typeof e == "object" && !Array.isArray(e);
    return Object.keys(e).forEach((i) => {
      let a = r ? i : e[i], l = r ? e[i] : t2, s2 = r ? t2 : n, u = (...f) => {
        l.apply(s2, f), this.removeListener(a, u, s2);
      };
      this.newListener(a, u, s2);
    }, this), this;
  }
  emit(e, ...t2) {
    return typeof e == "undefined" || e == null ? this : (typeof e == "string" && (e = e.trim().split(/\s/g)), e.forEach((n) => {
      let r = this.get(n);
      r instanceof c && r.forEach((i) => {
        let { callback: a, scope: l } = i;
        a.apply(l, t2);
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
const STATE$1 = {
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
  const { formatMessages } = await import("./esbuild.mjs").then(function(n) {
    return n.b;
  });
  let notices = await formatMessages(errors, { color, kind });
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
          `https://deno.land/x/esbuild@v${version$1}/mod.js`
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
    if (!STATE$1.initialized) {
      STATE$1.initialized = true;
      EVENTS.emit("init.start");
      STATE$1.esbuild = await getESBUILD(platform);
      if (platform !== "node" && platform !== "deno") {
        const { default: ESBUILD_WASM } = await import("./esbuild-wasm.mjs");
        await STATE$1.esbuild.initialize({
          wasmModule: new WebAssembly.Module(await ESBUILD_WASM()),
          ...opts
        });
      }
      EVENTS.emit("init.complete");
    }
    return STATE$1.esbuild;
  } catch (error) {
    EVENTS.emit("init.error", error);
    console.error(error);
  }
}
async function build(opts = {}) {
  if (!STATE$1.initialized)
    EVENTS.emit("init.loading");
  const CONFIG = deepAssign({}, DefaultConfig, opts);
  const { build: bundle } = await init(CONFIG.init);
  const { define = {}, loader = {}, ...esbuildOpts } = CONFIG.esbuild ?? {};
  let outputs = [];
  let contents = [];
  let result;
  try {
    try {
      const keys2 = "p.env.NODE_ENV".replace("p.", "process.");
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
          [keys2]: `"production"`,
          ...define
        },
        write: false,
        outdir: "/",
        plugins: [
          ALIAS(EVENTS, STATE$1, CONFIG),
          EXTERNAL(EVENTS, STATE$1, CONFIG),
          HTTP(EVENTS, STATE$1, CONFIG),
          CDN(EVENTS, STATE$1, CONFIG),
          VIRTUAL_FS(EVENTS, STATE$1, CONFIG)
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
    outputs = await Promise.all([...STATE$1.assets].concat(result?.outputFiles));
    contents = await Promise.all(outputs?.map(({ path: path2, text, contents: contents2 }) => {
      if (/\.map$/.test(path2))
        return { path: path2, text: "", contents: encode$1("") };
      if (esbuildOpts?.logLevel == "verbose") {
        const ignoreFile = /\.(wasm|png|jpeg|webp)$/.test(path2);
        if (ignoreFile) {
          EVENTS.emit("logger.log", "Output File: " + path2);
        } else {
          EVENTS.emit("logger.log", "Output File: " + path2 + "\n" + text);
        }
      }
      return { path: path2, text, contents: contents2 };
    }));
    return {
      content: contents,
      ...result.outputFiles
    };
  } catch (e) {
  }
}
async function getSize(contents = [], opts = {}) {
  const CONFIG = deepAssign({}, DefaultConfig, opts);
  let { compression = {} } = CONFIG;
  let { type = "gzip", quality: level = 9 } = typeof compression == "string" ? { type: compression } : compression ?? {};
  let totalByteLength = bytes(contents.reduce((acc, { contents: contents2 }) => acc + contents2.byteLength, 0));
  let compressionMap = await (async () => {
    switch (type) {
      case "lz4":
        const { compress: lz4_compress, getWASM: getLZ4 } = await Promise.resolve().then(function() {
          return mod$1;
        });
        await getLZ4();
        return async (code) => {
          return await lz4_compress(code);
        };
      case "brotli":
        const { compress: compress2, getWASM: getBrotli } = await Promise.resolve().then(function() {
          return mod$3;
        });
        await getBrotli();
        return async (code) => {
          return await compress2(code, code.length, level);
        };
      default:
        const { gzip: gzip2, getWASM: getGZIP } = await Promise.resolve().then(function() {
          return mod$2;
        });
        await getGZIP();
        return async (code) => {
          return await gzip2(code, level);
        };
    }
  })();
  let compressedContent = await Promise.all(contents.map(({ contents: contents2 }) => compressionMap(contents2)));
  let totalCompressedSize = bytes(compressedContent.reduce((acc, { length }) => acc + length, 0));
  return {
    type,
    content: compressedContent,
    totalByteLength,
    totalCompressedSize,
    initialSize: `${totalByteLength}`,
    size: `${totalCompressedSize} (${type})`
  };
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
function M(r, s2) {
  if (!x[r]) {
    x[r] = {};
    for (let f = 0; f < r.length; f++)
      x[r][r.charAt(f)] = f;
  }
  return x[r][s2];
}
function S(r) {
  if (r == null)
    return "";
  let s2 = b(r, 6, (f) => v.charAt(f));
  switch (s2.length % 4) {
    default:
    case 0:
      return s2;
    case 1:
      return s2 + "===";
    case 2:
      return s2 + "==";
    case 3:
      return s2 + "=";
  }
}
function O(r) {
  return r == null ? "" : r == "" ? null : A(r.length, 32, (s2) => M(v, r.charAt(s2)));
}
function j$1(r) {
  return r == null ? "" : b(r, 6, (s2) => y.charAt(s2));
}
function k(r) {
  return r == null ? "" : r == "" ? null : (r = r.replaceAll(" ", "+"), A(r.length, 32, (s2) => M(y, r.charAt(s2))));
}
function D(r) {
  return b(r, 16, String.fromCharCode);
}
function R(r) {
  return r == null ? "" : r == "" ? null : A(r.length, 32768, (s2) => r.charCodeAt(s2));
}
function b(r, s2, f) {
  if (r == null)
    return "";
  let p = [], m = {}, h2 = {}, i, w, o2, g = "", u = "", d = "", l = 2, a = 3, c2 = 2, e = 0, t2 = 0;
  for (w = 0; w < r.length; w += 1)
    if (g = r.charAt(w), Object.prototype.hasOwnProperty.call(m, g) || (m[g] = a++, h2[g] = true), d = u + g, Object.prototype.hasOwnProperty.call(m, d))
      u = d;
    else {
      if (Object.prototype.hasOwnProperty.call(h2, u)) {
        if (u.charCodeAt(0) < 256) {
          for (i = 0; i < c2; i++)
            e = e << 1, t2 == s2 - 1 ? (t2 = 0, p.push(f(e)), e = 0) : t2++;
          for (o2 = u.charCodeAt(0), i = 0; i < 8; i++)
            e = e << 1 | o2 & 1, t2 == s2 - 1 ? (t2 = 0, p.push(f(e)), e = 0) : t2++, o2 = o2 >> 1;
        } else {
          for (o2 = 1, i = 0; i < c2; i++)
            e = e << 1 | o2, t2 == s2 - 1 ? (t2 = 0, p.push(f(e)), e = 0) : t2++, o2 = 0;
          for (o2 = u.charCodeAt(0), i = 0; i < 16; i++)
            e = e << 1 | o2 & 1, t2 == s2 - 1 ? (t2 = 0, p.push(f(e)), e = 0) : t2++, o2 = o2 >> 1;
        }
        l--, l == 0 && (l = Math.pow(2, c2), c2++), delete h2[u];
      } else
        for (o2 = m[u], i = 0; i < c2; i++)
          e = e << 1 | o2 & 1, t2 == s2 - 1 ? (t2 = 0, p.push(f(e)), e = 0) : t2++, o2 = o2 >> 1;
      l--, l == 0 && (l = Math.pow(2, c2), c2++), m[d] = a++, u = String(g);
    }
  if (u !== "") {
    if (Object.prototype.hasOwnProperty.call(h2, u)) {
      if (u.charCodeAt(0) < 256) {
        for (i = 0; i < c2; i++)
          e = e << 1, t2 == s2 - 1 ? (t2 = 0, p.push(f(e)), e = 0) : t2++;
        for (o2 = u.charCodeAt(0), i = 0; i < 8; i++)
          e = e << 1 | o2 & 1, t2 == s2 - 1 ? (t2 = 0, p.push(f(e)), e = 0) : t2++, o2 = o2 >> 1;
      } else {
        for (o2 = 1, i = 0; i < c2; i++)
          e = e << 1 | o2, t2 == s2 - 1 ? (t2 = 0, p.push(f(e)), e = 0) : t2++, o2 = 0;
        for (o2 = u.charCodeAt(0), i = 0; i < 16; i++)
          e = e << 1 | o2 & 1, t2 == s2 - 1 ? (t2 = 0, p.push(f(e)), e = 0) : t2++, o2 = o2 >> 1;
      }
      l--, l == 0 && (l = Math.pow(2, c2), c2++), delete h2[u];
    } else
      for (o2 = m[u], i = 0; i < c2; i++)
        e = e << 1 | o2 & 1, t2 == s2 - 1 ? (t2 = 0, p.push(f(e)), e = 0) : t2++, o2 = o2 >> 1;
    l--, l == 0 && (l = Math.pow(2, c2), c2++);
  }
  for (o2 = 2, i = 0; i < c2; i++)
    e = e << 1 | o2 & 1, t2 == s2 - 1 ? (t2 = 0, p.push(f(e)), e = 0) : t2++, o2 = o2 >> 1;
  for (; ; )
    if (e = e << 1, t2 == s2 - 1) {
      p.push(f(e));
      break;
    } else
      t2++;
  return p.join("");
}
function A(r, s2, f) {
  let p = [], h2 = 4, i = 4, w = 3, o2 = "", g = [], u, d, l, a, c2, e, t2, n = { val: f(0), position: s2, index: 1 };
  for (u = 0; u < 3; u += 1)
    p[u] = u;
  for (l = 0, c2 = Math.pow(2, 2), e = 1; e != c2; )
    a = n.val & n.position, n.position >>= 1, n.position == 0 && (n.position = s2, n.val = f(n.index++)), l |= (a > 0 ? 1 : 0) * e, e <<= 1;
  switch (l) {
    case 0:
      for (l = 0, c2 = Math.pow(2, 8), e = 1; e != c2; )
        a = n.val & n.position, n.position >>= 1, n.position == 0 && (n.position = s2, n.val = f(n.index++)), l |= (a > 0 ? 1 : 0) * e, e <<= 1;
      t2 = String.fromCharCode(l);
      break;
    case 1:
      for (l = 0, c2 = Math.pow(2, 16), e = 1; e != c2; )
        a = n.val & n.position, n.position >>= 1, n.position == 0 && (n.position = s2, n.val = f(n.index++)), l |= (a > 0 ? 1 : 0) * e, e <<= 1;
      t2 = String.fromCharCode(l);
      break;
    case 2:
      return "";
  }
  for (p[3] = t2, d = t2, g.push(t2); ; ) {
    if (n.index > r)
      return "";
    for (l = 0, c2 = Math.pow(2, w), e = 1; e != c2; )
      a = n.val & n.position, n.position >>= 1, n.position == 0 && (n.position = s2, n.val = f(n.index++)), l |= (a > 0 ? 1 : 0) * e, e <<= 1;
    switch (t2 = l) {
      case 0:
        for (l = 0, c2 = Math.pow(2, 8), e = 1; e != c2; )
          a = n.val & n.position, n.position >>= 1, n.position == 0 && (n.position = s2, n.val = f(n.index++)), l |= (a > 0 ? 1 : 0) * e, e <<= 1;
        p[i++] = String.fromCharCode(l), t2 = i - 1, h2--;
        break;
      case 1:
        for (l = 0, c2 = Math.pow(2, 16), e = 1; e != c2; )
          a = n.val & n.position, n.position >>= 1, n.position == 0 && (n.position = s2, n.val = f(n.index++)), l |= (a > 0 ? 1 : 0) * e, e <<= 1;
        p[i++] = String.fromCharCode(l), t2 = i - 1, h2--;
        break;
      case 2:
        return g.join("");
    }
    if (h2 == 0 && (h2 = Math.pow(2, w), w++), p[t2])
      o2 = p[t2];
    else if (t2 === i && typeof d == "string")
      o2 = d + d.charAt(0);
    else
      return null;
    g.push(o2), p[i++] = d + o2.charAt(0), h2--, d = o2, h2 == 0 && (h2 = Math.pow(2, w), w++);
  }
}
var lzString = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  compress: D,
  compressToBase64: S,
  compressToURL: j$1,
  decompress: R,
  decompressFromBase64: O,
  decompressFromURL: k
}, Symbol.toStringTag, { value: "Module" }));
const { decompressFromURL } = lzString;
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
      result += "\n" + decompressFromURL(share.trim());
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
var re$5 = { exports: {} };
var check = function(it) {
  return it && it.Math == Math && it;
};
var global$k = check(typeof globalThis == "object" && globalThis) || check(typeof window == "object" && window) || check(typeof self == "object" && self) || check(typeof commonjsGlobal == "object" && commonjsGlobal) || function() {
  return this;
}() || Function("return this")();
var objectGetOwnPropertyDescriptor = {};
var fails$w = function(exec2) {
  try {
    return !!exec2();
  } catch (error) {
    return true;
  }
};
var fails$v = fails$w;
var descriptors = !fails$v(function() {
  return Object.defineProperty({}, 1, { get: function() {
    return 7;
  } })[1] != 7;
});
var fails$u = fails$w;
var functionBindNative = !fails$u(function() {
  var test2 = function() {
  }.bind();
  return typeof test2 != "function" || test2.hasOwnProperty("prototype");
});
var NATIVE_BIND$3 = functionBindNative;
var call$j = Function.prototype.call;
var functionCall = NATIVE_BIND$3 ? call$j.bind(call$j) : function() {
  return call$j.apply(call$j, arguments);
};
var objectPropertyIsEnumerable = {};
var $propertyIsEnumerable$1 = {}.propertyIsEnumerable;
var getOwnPropertyDescriptor$2 = Object.getOwnPropertyDescriptor;
var NASHORN_BUG = getOwnPropertyDescriptor$2 && !$propertyIsEnumerable$1.call({ 1: 2 }, 1);
objectPropertyIsEnumerable.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
  var descriptor = getOwnPropertyDescriptor$2(this, V);
  return !!descriptor && descriptor.enumerable;
} : $propertyIsEnumerable$1;
var createPropertyDescriptor$5 = function(bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value
  };
};
var NATIVE_BIND$2 = functionBindNative;
var FunctionPrototype$3 = Function.prototype;
var bind$5 = FunctionPrototype$3.bind;
var call$i = FunctionPrototype$3.call;
var uncurryThis$x = NATIVE_BIND$2 && bind$5.bind(call$i, call$i);
var functionUncurryThis = NATIVE_BIND$2 ? function(fn) {
  return fn && uncurryThis$x(fn);
} : function(fn) {
  return fn && function() {
    return call$i.apply(fn, arguments);
  };
};
var uncurryThis$w = functionUncurryThis;
var toString$e = uncurryThis$w({}.toString);
var stringSlice$7 = uncurryThis$w("".slice);
var classofRaw$1 = function(it) {
  return stringSlice$7(toString$e(it), 8, -1);
};
var uncurryThis$v = functionUncurryThis;
var fails$t = fails$w;
var classof$a = classofRaw$1;
var $Object$4 = Object;
var split = uncurryThis$v("".split);
var indexedObject = fails$t(function() {
  return !$Object$4("z").propertyIsEnumerable(0);
}) ? function(it) {
  return classof$a(it) == "String" ? split(it, "") : $Object$4(it);
} : $Object$4;
var $TypeError$d = TypeError;
var requireObjectCoercible$7 = function(it) {
  if (it == void 0)
    throw $TypeError$d("Can't call method on " + it);
  return it;
};
var IndexedObject$2 = indexedObject;
var requireObjectCoercible$6 = requireObjectCoercible$7;
var toIndexedObject$9 = function(it) {
  return IndexedObject$2(requireObjectCoercible$6(it));
};
var isCallable$m = function(argument) {
  return typeof argument == "function";
};
var isCallable$l = isCallable$m;
var isObject$e = function(it) {
  return typeof it == "object" ? it !== null : isCallable$l(it);
};
var global$j = global$k;
var isCallable$k = isCallable$m;
var aFunction = function(argument) {
  return isCallable$k(argument) ? argument : void 0;
};
var getBuiltIn$9 = function(namespace, method) {
  return arguments.length < 2 ? aFunction(global$j[namespace]) : global$j[namespace] && global$j[namespace][method];
};
var uncurryThis$u = functionUncurryThis;
var objectIsPrototypeOf = uncurryThis$u({}.isPrototypeOf);
var getBuiltIn$8 = getBuiltIn$9;
var engineUserAgent = getBuiltIn$8("navigator", "userAgent") || "";
var global$i = global$k;
var userAgent$2 = engineUserAgent;
var process$1 = global$i.process;
var Deno = global$i.Deno;
var versions = process$1 && process$1.versions || Deno && Deno.version;
var v8 = versions && versions.v8;
var match, version;
if (v8) {
  match = v8.split(".");
  version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
}
if (!version && userAgent$2) {
  match = userAgent$2.match(/Edge\/(\d+)/);
  if (!match || match[1] >= 74) {
    match = userAgent$2.match(/Chrome\/(\d+)/);
    if (match)
      version = +match[1];
  }
}
var engineV8Version = version;
var V8_VERSION$2 = engineV8Version;
var fails$s = fails$w;
var nativeSymbol = !!Object.getOwnPropertySymbols && !fails$s(function() {
  var symbol = Symbol();
  return !String(symbol) || !(Object(symbol) instanceof Symbol) || !Symbol.sham && V8_VERSION$2 && V8_VERSION$2 < 41;
});
var NATIVE_SYMBOL$6 = nativeSymbol;
var useSymbolAsUid = NATIVE_SYMBOL$6 && !Symbol.sham && typeof Symbol.iterator == "symbol";
var getBuiltIn$7 = getBuiltIn$9;
var isCallable$j = isCallable$m;
var isPrototypeOf$7 = objectIsPrototypeOf;
var USE_SYMBOL_AS_UID$1 = useSymbolAsUid;
var $Object$3 = Object;
var isSymbol$5 = USE_SYMBOL_AS_UID$1 ? function(it) {
  return typeof it == "symbol";
} : function(it) {
  var $Symbol2 = getBuiltIn$7("Symbol");
  return isCallable$j($Symbol2) && isPrototypeOf$7($Symbol2.prototype, $Object$3(it));
};
var $String$3 = String;
var tryToString$6 = function(argument) {
  try {
    return $String$3(argument);
  } catch (error) {
    return "Object";
  }
};
var isCallable$i = isCallable$m;
var tryToString$5 = tryToString$6;
var $TypeError$c = TypeError;
var aCallable$4 = function(argument) {
  if (isCallable$i(argument))
    return argument;
  throw $TypeError$c(tryToString$5(argument) + " is not a function");
};
var aCallable$3 = aCallable$4;
var getMethod$6 = function(V, P) {
  var func = V[P];
  return func == null ? void 0 : aCallable$3(func);
};
var call$h = functionCall;
var isCallable$h = isCallable$m;
var isObject$d = isObject$e;
var $TypeError$b = TypeError;
var ordinaryToPrimitive$1 = function(input, pref) {
  var fn, val;
  if (pref === "string" && isCallable$h(fn = input.toString) && !isObject$d(val = call$h(fn, input)))
    return val;
  if (isCallable$h(fn = input.valueOf) && !isObject$d(val = call$h(fn, input)))
    return val;
  if (pref !== "string" && isCallable$h(fn = input.toString) && !isObject$d(val = call$h(fn, input)))
    return val;
  throw $TypeError$b("Can't convert object to primitive value");
};
var shared$7 = { exports: {} };
var global$h = global$k;
var defineProperty$c = Object.defineProperty;
var defineGlobalProperty$3 = function(key, value) {
  try {
    defineProperty$c(global$h, key, { value, configurable: true, writable: true });
  } catch (error) {
    global$h[key] = value;
  }
  return value;
};
var global$g = global$k;
var defineGlobalProperty$2 = defineGlobalProperty$3;
var SHARED = "__core-js_shared__";
var store$3 = global$g[SHARED] || defineGlobalProperty$2(SHARED, {});
var sharedStore = store$3;
var store$2 = sharedStore;
(shared$7.exports = function(key, value) {
  return store$2[key] || (store$2[key] = value !== void 0 ? value : {});
})("versions", []).push({
  version: "3.23.3",
  mode: "global",
  copyright: "\xA9 2014-2022 Denis Pushkarev (zloirock.ru)",
  license: "https://github.com/zloirock/core-js/blob/v3.23.3/LICENSE",
  source: "https://github.com/zloirock/core-js"
});
var requireObjectCoercible$5 = requireObjectCoercible$7;
var $Object$2 = Object;
var toObject$8 = function(argument) {
  return $Object$2(requireObjectCoercible$5(argument));
};
var uncurryThis$t = functionUncurryThis;
var toObject$7 = toObject$8;
var hasOwnProperty = uncurryThis$t({}.hasOwnProperty);
var hasOwnProperty_1 = Object.hasOwn || function hasOwn(it, key) {
  return hasOwnProperty(toObject$7(it), key);
};
var uncurryThis$s = functionUncurryThis;
var id$1 = 0;
var postfix = Math.random();
var toString$d = uncurryThis$s(1 .toString);
var uid$4 = function(key) {
  return "Symbol(" + (key === void 0 ? "" : key) + ")_" + toString$d(++id$1 + postfix, 36);
};
var global$f = global$k;
var shared$6 = shared$7.exports;
var hasOwn$h = hasOwnProperty_1;
var uid$3 = uid$4;
var NATIVE_SYMBOL$5 = nativeSymbol;
var USE_SYMBOL_AS_UID = useSymbolAsUid;
var WellKnownSymbolsStore$1 = shared$6("wks");
var Symbol$1 = global$f.Symbol;
var symbolFor = Symbol$1 && Symbol$1["for"];
var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol$1 : Symbol$1 && Symbol$1.withoutSetter || uid$3;
var wellKnownSymbol$o = function(name) {
  if (!hasOwn$h(WellKnownSymbolsStore$1, name) || !(NATIVE_SYMBOL$5 || typeof WellKnownSymbolsStore$1[name] == "string")) {
    var description = "Symbol." + name;
    if (NATIVE_SYMBOL$5 && hasOwn$h(Symbol$1, name)) {
      WellKnownSymbolsStore$1[name] = Symbol$1[name];
    } else if (USE_SYMBOL_AS_UID && symbolFor) {
      WellKnownSymbolsStore$1[name] = symbolFor(description);
    } else {
      WellKnownSymbolsStore$1[name] = createWellKnownSymbol(description);
    }
  }
  return WellKnownSymbolsStore$1[name];
};
var call$g = functionCall;
var isObject$c = isObject$e;
var isSymbol$4 = isSymbol$5;
var getMethod$5 = getMethod$6;
var ordinaryToPrimitive = ordinaryToPrimitive$1;
var wellKnownSymbol$n = wellKnownSymbol$o;
var $TypeError$a = TypeError;
var TO_PRIMITIVE = wellKnownSymbol$n("toPrimitive");
var toPrimitive$2 = function(input, pref) {
  if (!isObject$c(input) || isSymbol$4(input))
    return input;
  var exoticToPrim = getMethod$5(input, TO_PRIMITIVE);
  var result;
  if (exoticToPrim) {
    if (pref === void 0)
      pref = "default";
    result = call$g(exoticToPrim, input, pref);
    if (!isObject$c(result) || isSymbol$4(result))
      return result;
    throw $TypeError$a("Can't convert object to primitive value");
  }
  if (pref === void 0)
    pref = "number";
  return ordinaryToPrimitive(input, pref);
};
var toPrimitive$1 = toPrimitive$2;
var isSymbol$3 = isSymbol$5;
var toPropertyKey$4 = function(argument) {
  var key = toPrimitive$1(argument, "string");
  return isSymbol$3(key) ? key : key + "";
};
var global$e = global$k;
var isObject$b = isObject$e;
var document$1 = global$e.document;
var EXISTS$1 = isObject$b(document$1) && isObject$b(document$1.createElement);
var documentCreateElement$2 = function(it) {
  return EXISTS$1 ? document$1.createElement(it) : {};
};
var DESCRIPTORS$g = descriptors;
var fails$r = fails$w;
var createElement = documentCreateElement$2;
var ie8DomDefine = !DESCRIPTORS$g && !fails$r(function() {
  return Object.defineProperty(createElement("div"), "a", {
    get: function() {
      return 7;
    }
  }).a != 7;
});
var DESCRIPTORS$f = descriptors;
var call$f = functionCall;
var propertyIsEnumerableModule$1 = objectPropertyIsEnumerable;
var createPropertyDescriptor$4 = createPropertyDescriptor$5;
var toIndexedObject$8 = toIndexedObject$9;
var toPropertyKey$3 = toPropertyKey$4;
var hasOwn$g = hasOwnProperty_1;
var IE8_DOM_DEFINE$1 = ie8DomDefine;
var $getOwnPropertyDescriptor$2 = Object.getOwnPropertyDescriptor;
objectGetOwnPropertyDescriptor.f = DESCRIPTORS$f ? $getOwnPropertyDescriptor$2 : function getOwnPropertyDescriptor(O2, P) {
  O2 = toIndexedObject$8(O2);
  P = toPropertyKey$3(P);
  if (IE8_DOM_DEFINE$1)
    try {
      return $getOwnPropertyDescriptor$2(O2, P);
    } catch (error) {
    }
  if (hasOwn$g(O2, P))
    return createPropertyDescriptor$4(!call$f(propertyIsEnumerableModule$1.f, O2, P), O2[P]);
};
var objectDefineProperty = {};
var DESCRIPTORS$e = descriptors;
var fails$q = fails$w;
var v8PrototypeDefineBug = DESCRIPTORS$e && fails$q(function() {
  return Object.defineProperty(function() {
  }, "prototype", {
    value: 42,
    writable: false
  }).prototype != 42;
});
var isObject$a = isObject$e;
var $String$2 = String;
var $TypeError$9 = TypeError;
var anObject$h = function(argument) {
  if (isObject$a(argument))
    return argument;
  throw $TypeError$9($String$2(argument) + " is not an object");
};
var DESCRIPTORS$d = descriptors;
var IE8_DOM_DEFINE = ie8DomDefine;
var V8_PROTOTYPE_DEFINE_BUG$1 = v8PrototypeDefineBug;
var anObject$g = anObject$h;
var toPropertyKey$2 = toPropertyKey$4;
var $TypeError$8 = TypeError;
var $defineProperty$1 = Object.defineProperty;
var $getOwnPropertyDescriptor$1 = Object.getOwnPropertyDescriptor;
var ENUMERABLE = "enumerable";
var CONFIGURABLE$1 = "configurable";
var WRITABLE = "writable";
objectDefineProperty.f = DESCRIPTORS$d ? V8_PROTOTYPE_DEFINE_BUG$1 ? function defineProperty(O2, P, Attributes) {
  anObject$g(O2);
  P = toPropertyKey$2(P);
  anObject$g(Attributes);
  if (typeof O2 === "function" && P === "prototype" && "value" in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
    var current = $getOwnPropertyDescriptor$1(O2, P);
    if (current && current[WRITABLE]) {
      O2[P] = Attributes.value;
      Attributes = {
        configurable: CONFIGURABLE$1 in Attributes ? Attributes[CONFIGURABLE$1] : current[CONFIGURABLE$1],
        enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
        writable: false
      };
    }
  }
  return $defineProperty$1(O2, P, Attributes);
} : $defineProperty$1 : function defineProperty2(O2, P, Attributes) {
  anObject$g(O2);
  P = toPropertyKey$2(P);
  anObject$g(Attributes);
  if (IE8_DOM_DEFINE)
    try {
      return $defineProperty$1(O2, P, Attributes);
    } catch (error) {
    }
  if ("get" in Attributes || "set" in Attributes)
    throw $TypeError$8("Accessors not supported");
  if ("value" in Attributes)
    O2[P] = Attributes.value;
  return O2;
};
var DESCRIPTORS$c = descriptors;
var definePropertyModule$6 = objectDefineProperty;
var createPropertyDescriptor$3 = createPropertyDescriptor$5;
var createNonEnumerableProperty$7 = DESCRIPTORS$c ? function(object, key, value) {
  return definePropertyModule$6.f(object, key, createPropertyDescriptor$3(1, value));
} : function(object, key, value) {
  object[key] = value;
  return object;
};
var makeBuiltIn$2 = { exports: {} };
var DESCRIPTORS$b = descriptors;
var hasOwn$f = hasOwnProperty_1;
var FunctionPrototype$2 = Function.prototype;
var getDescriptor = DESCRIPTORS$b && Object.getOwnPropertyDescriptor;
var EXISTS = hasOwn$f(FunctionPrototype$2, "name");
var PROPER = EXISTS && function something() {
}.name === "something";
var CONFIGURABLE = EXISTS && (!DESCRIPTORS$b || DESCRIPTORS$b && getDescriptor(FunctionPrototype$2, "name").configurable);
var functionName = {
  EXISTS,
  PROPER,
  CONFIGURABLE
};
var uncurryThis$r = functionUncurryThis;
var isCallable$g = isCallable$m;
var store$1 = sharedStore;
var functionToString$1 = uncurryThis$r(Function.toString);
if (!isCallable$g(store$1.inspectSource)) {
  store$1.inspectSource = function(it) {
    return functionToString$1(it);
  };
}
var inspectSource$3 = store$1.inspectSource;
var global$d = global$k;
var isCallable$f = isCallable$m;
var inspectSource$2 = inspectSource$3;
var WeakMap$1 = global$d.WeakMap;
var nativeWeakMap = isCallable$f(WeakMap$1) && /native code/.test(inspectSource$2(WeakMap$1));
var shared$5 = shared$7.exports;
var uid$2 = uid$4;
var keys$2 = shared$5("keys");
var sharedKey$4 = function(key) {
  return keys$2[key] || (keys$2[key] = uid$2(key));
};
var hiddenKeys$6 = {};
var NATIVE_WEAK_MAP = nativeWeakMap;
var global$c = global$k;
var uncurryThis$q = functionUncurryThis;
var isObject$9 = isObject$e;
var createNonEnumerableProperty$6 = createNonEnumerableProperty$7;
var hasOwn$e = hasOwnProperty_1;
var shared$4 = sharedStore;
var sharedKey$3 = sharedKey$4;
var hiddenKeys$5 = hiddenKeys$6;
var OBJECT_ALREADY_INITIALIZED = "Object already initialized";
var TypeError$3 = global$c.TypeError;
var WeakMap = global$c.WeakMap;
var set, get, has;
var enforce = function(it) {
  return has(it) ? get(it) : set(it, {});
};
var getterFor = function(TYPE) {
  return function(it) {
    var state;
    if (!isObject$9(it) || (state = get(it)).type !== TYPE) {
      throw TypeError$3("Incompatible receiver, " + TYPE + " required");
    }
    return state;
  };
};
if (NATIVE_WEAK_MAP || shared$4.state) {
  var store = shared$4.state || (shared$4.state = new WeakMap());
  var wmget = uncurryThis$q(store.get);
  var wmhas = uncurryThis$q(store.has);
  var wmset = uncurryThis$q(store.set);
  set = function(it, metadata) {
    if (wmhas(store, it))
      throw new TypeError$3(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    wmset(store, it, metadata);
    return metadata;
  };
  get = function(it) {
    return wmget(store, it) || {};
  };
  has = function(it) {
    return wmhas(store, it);
  };
} else {
  var STATE = sharedKey$3("state");
  hiddenKeys$5[STATE] = true;
  set = function(it, metadata) {
    if (hasOwn$e(it, STATE))
      throw new TypeError$3(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    createNonEnumerableProperty$6(it, STATE, metadata);
    return metadata;
  };
  get = function(it) {
    return hasOwn$e(it, STATE) ? it[STATE] : {};
  };
  has = function(it) {
    return hasOwn$e(it, STATE);
  };
}
var internalState = {
  set,
  get,
  has,
  enforce,
  getterFor
};
var fails$p = fails$w;
var isCallable$e = isCallable$m;
var hasOwn$d = hasOwnProperty_1;
var DESCRIPTORS$a = descriptors;
var CONFIGURABLE_FUNCTION_NAME$1 = functionName.CONFIGURABLE;
var inspectSource$1 = inspectSource$3;
var InternalStateModule$4 = internalState;
var enforceInternalState$1 = InternalStateModule$4.enforce;
var getInternalState$4 = InternalStateModule$4.get;
var defineProperty$b = Object.defineProperty;
var CONFIGURABLE_LENGTH = DESCRIPTORS$a && !fails$p(function() {
  return defineProperty$b(function() {
  }, "length", { value: 8 }).length !== 8;
});
var TEMPLATE = String(String).split("String");
var makeBuiltIn$1 = makeBuiltIn$2.exports = function(value, name, options) {
  if (String(name).slice(0, 7) === "Symbol(") {
    name = "[" + String(name).replace(/^Symbol\(([^)]*)\)/, "$1") + "]";
  }
  if (options && options.getter)
    name = "get " + name;
  if (options && options.setter)
    name = "set " + name;
  if (!hasOwn$d(value, "name") || CONFIGURABLE_FUNCTION_NAME$1 && value.name !== name) {
    if (DESCRIPTORS$a)
      defineProperty$b(value, "name", { value: name, configurable: true });
    else
      value.name = name;
  }
  if (CONFIGURABLE_LENGTH && options && hasOwn$d(options, "arity") && value.length !== options.arity) {
    defineProperty$b(value, "length", { value: options.arity });
  }
  try {
    if (options && hasOwn$d(options, "constructor") && options.constructor) {
      if (DESCRIPTORS$a)
        defineProperty$b(value, "prototype", { writable: false });
    } else if (value.prototype)
      value.prototype = void 0;
  } catch (error) {
  }
  var state = enforceInternalState$1(value);
  if (!hasOwn$d(state, "source")) {
    state.source = TEMPLATE.join(typeof name == "string" ? name : "");
  }
  return value;
};
Function.prototype.toString = makeBuiltIn$1(function toString() {
  return isCallable$e(this) && getInternalState$4(this).source || inspectSource$1(this);
}, "toString");
var isCallable$d = isCallable$m;
var definePropertyModule$5 = objectDefineProperty;
var makeBuiltIn = makeBuiltIn$2.exports;
var defineGlobalProperty$1 = defineGlobalProperty$3;
var defineBuiltIn$d = function(O2, key, value, options) {
  if (!options)
    options = {};
  var simple = options.enumerable;
  var name = options.name !== void 0 ? options.name : key;
  if (isCallable$d(value))
    makeBuiltIn(value, name, options);
  if (options.global) {
    if (simple)
      O2[key] = value;
    else
      defineGlobalProperty$1(key, value);
  } else {
    try {
      if (!options.unsafe)
        delete O2[key];
      else if (O2[key])
        simple = true;
    } catch (error) {
    }
    if (simple)
      O2[key] = value;
    else
      definePropertyModule$5.f(O2, key, {
        value,
        enumerable: false,
        configurable: !options.nonConfigurable,
        writable: !options.nonWritable
      });
  }
  return O2;
};
var objectGetOwnPropertyNames = {};
var ceil = Math.ceil;
var floor$2 = Math.floor;
var mathTrunc = Math.trunc || function trunc(x2) {
  var n = +x2;
  return (n > 0 ? floor$2 : ceil)(n);
};
var trunc2 = mathTrunc;
var toIntegerOrInfinity$4 = function(argument) {
  var number = +argument;
  return number !== number || number === 0 ? 0 : trunc2(number);
};
var toIntegerOrInfinity$3 = toIntegerOrInfinity$4;
var max$3 = Math.max;
var min$3 = Math.min;
var toAbsoluteIndex$3 = function(index, length) {
  var integer = toIntegerOrInfinity$3(index);
  return integer < 0 ? max$3(integer + length, 0) : min$3(integer, length);
};
var toIntegerOrInfinity$2 = toIntegerOrInfinity$4;
var min$2 = Math.min;
var toLength$4 = function(argument) {
  return argument > 0 ? min$2(toIntegerOrInfinity$2(argument), 9007199254740991) : 0;
};
var toLength$3 = toLength$4;
var lengthOfArrayLike$8 = function(obj) {
  return toLength$3(obj.length);
};
var toIndexedObject$7 = toIndexedObject$9;
var toAbsoluteIndex$2 = toAbsoluteIndex$3;
var lengthOfArrayLike$7 = lengthOfArrayLike$8;
var createMethod$3 = function(IS_INCLUDES) {
  return function($this, el, fromIndex) {
    var O2 = toIndexedObject$7($this);
    var length = lengthOfArrayLike$7(O2);
    var index = toAbsoluteIndex$2(fromIndex, length);
    var value;
    if (IS_INCLUDES && el != el)
      while (length > index) {
        value = O2[index++];
        if (value != value)
          return true;
      }
    else
      for (; length > index; index++) {
        if ((IS_INCLUDES || index in O2) && O2[index] === el)
          return IS_INCLUDES || index || 0;
      }
    return !IS_INCLUDES && -1;
  };
};
var arrayIncludes = {
  includes: createMethod$3(true),
  indexOf: createMethod$3(false)
};
var uncurryThis$p = functionUncurryThis;
var hasOwn$c = hasOwnProperty_1;
var toIndexedObject$6 = toIndexedObject$9;
var indexOf$1 = arrayIncludes.indexOf;
var hiddenKeys$4 = hiddenKeys$6;
var push$5 = uncurryThis$p([].push);
var objectKeysInternal = function(object, names) {
  var O2 = toIndexedObject$6(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O2)
    !hasOwn$c(hiddenKeys$4, key) && hasOwn$c(O2, key) && push$5(result, key);
  while (names.length > i)
    if (hasOwn$c(O2, key = names[i++])) {
      ~indexOf$1(result, key) || push$5(result, key);
    }
  return result;
};
var enumBugKeys$3 = [
  "constructor",
  "hasOwnProperty",
  "isPrototypeOf",
  "propertyIsEnumerable",
  "toLocaleString",
  "toString",
  "valueOf"
];
var internalObjectKeys$1 = objectKeysInternal;
var enumBugKeys$2 = enumBugKeys$3;
var hiddenKeys$3 = enumBugKeys$2.concat("length", "prototype");
objectGetOwnPropertyNames.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O2) {
  return internalObjectKeys$1(O2, hiddenKeys$3);
};
var objectGetOwnPropertySymbols = {};
objectGetOwnPropertySymbols.f = Object.getOwnPropertySymbols;
var getBuiltIn$6 = getBuiltIn$9;
var uncurryThis$o = functionUncurryThis;
var getOwnPropertyNamesModule$2 = objectGetOwnPropertyNames;
var getOwnPropertySymbolsModule$2 = objectGetOwnPropertySymbols;
var anObject$f = anObject$h;
var concat$1 = uncurryThis$o([].concat);
var ownKeys$1 = getBuiltIn$6("Reflect", "ownKeys") || function ownKeys(it) {
  var keys2 = getOwnPropertyNamesModule$2.f(anObject$f(it));
  var getOwnPropertySymbols2 = getOwnPropertySymbolsModule$2.f;
  return getOwnPropertySymbols2 ? concat$1(keys2, getOwnPropertySymbols2(it)) : keys2;
};
var hasOwn$b = hasOwnProperty_1;
var ownKeys2 = ownKeys$1;
var getOwnPropertyDescriptorModule$1 = objectGetOwnPropertyDescriptor;
var definePropertyModule$4 = objectDefineProperty;
var copyConstructorProperties$2 = function(target, source, exceptions) {
  var keys2 = ownKeys2(source);
  var defineProperty5 = definePropertyModule$4.f;
  var getOwnPropertyDescriptor4 = getOwnPropertyDescriptorModule$1.f;
  for (var i = 0; i < keys2.length; i++) {
    var key = keys2[i];
    if (!hasOwn$b(target, key) && !(exceptions && hasOwn$b(exceptions, key))) {
      defineProperty5(target, key, getOwnPropertyDescriptor4(source, key));
    }
  }
};
var fails$o = fails$w;
var isCallable$c = isCallable$m;
var replacement = /#|\.prototype\./;
var isForced$4 = function(feature, detection) {
  var value = data[normalize(feature)];
  return value == POLYFILL ? true : value == NATIVE ? false : isCallable$c(detection) ? fails$o(detection) : !!detection;
};
var normalize = isForced$4.normalize = function(string) {
  return String(string).replace(replacement, ".").toLowerCase();
};
var data = isForced$4.data = {};
var NATIVE = isForced$4.NATIVE = "N";
var POLYFILL = isForced$4.POLYFILL = "P";
var isForced_1 = isForced$4;
var global$b = global$k;
var getOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;
var createNonEnumerableProperty$5 = createNonEnumerableProperty$7;
var defineBuiltIn$c = defineBuiltIn$d;
var defineGlobalProperty = defineGlobalProperty$3;
var copyConstructorProperties$1 = copyConstructorProperties$2;
var isForced$3 = isForced_1;
var _export = function(options, source) {
  var TARGET = options.target;
  var GLOBAL = options.global;
  var STATIC = options.stat;
  var FORCED2, target, key, targetProperty, sourceProperty, descriptor;
  if (GLOBAL) {
    target = global$b;
  } else if (STATIC) {
    target = global$b[TARGET] || defineGlobalProperty(TARGET, {});
  } else {
    target = (global$b[TARGET] || {}).prototype;
  }
  if (target)
    for (key in source) {
      sourceProperty = source[key];
      if (options.dontCallGetSet) {
        descriptor = getOwnPropertyDescriptor$1(target, key);
        targetProperty = descriptor && descriptor.value;
      } else
        targetProperty = target[key];
      FORCED2 = isForced$3(GLOBAL ? key : TARGET + (STATIC ? "." : "#") + key, options.forced);
      if (!FORCED2 && targetProperty !== void 0) {
        if (typeof sourceProperty == typeof targetProperty)
          continue;
        copyConstructorProperties$1(sourceProperty, targetProperty);
      }
      if (options.sham || targetProperty && targetProperty.sham) {
        createNonEnumerableProperty$5(sourceProperty, "sham", true);
      }
      defineBuiltIn$c(target, key, sourceProperty, options);
    }
};
var classof$9 = classofRaw$1;
var isArray$5 = Array.isArray || function isArray(argument) {
  return classof$9(argument) == "Array";
};
var $TypeError$7 = TypeError;
var MAX_SAFE_INTEGER$2 = 9007199254740991;
var doesNotExceedSafeInteger$1 = function(it) {
  if (it > MAX_SAFE_INTEGER$2)
    throw $TypeError$7("Maximum allowed index exceeded");
  return it;
};
var toPropertyKey$1 = toPropertyKey$4;
var definePropertyModule$3 = objectDefineProperty;
var createPropertyDescriptor$2 = createPropertyDescriptor$5;
var createProperty$4 = function(object, key, value) {
  var propertyKey = toPropertyKey$1(key);
  if (propertyKey in object)
    definePropertyModule$3.f(object, propertyKey, createPropertyDescriptor$2(0, value));
  else
    object[propertyKey] = value;
};
var wellKnownSymbol$m = wellKnownSymbol$o;
var TO_STRING_TAG$3 = wellKnownSymbol$m("toStringTag");
var test$1 = {};
test$1[TO_STRING_TAG$3] = "z";
var toStringTagSupport = String(test$1) === "[object z]";
var TO_STRING_TAG_SUPPORT$2 = toStringTagSupport;
var isCallable$b = isCallable$m;
var classofRaw = classofRaw$1;
var wellKnownSymbol$l = wellKnownSymbol$o;
var TO_STRING_TAG$2 = wellKnownSymbol$l("toStringTag");
var $Object$1 = Object;
var CORRECT_ARGUMENTS = classofRaw(function() {
  return arguments;
}()) == "Arguments";
var tryGet = function(it, key) {
  try {
    return it[key];
  } catch (error) {
  }
};
var classof$8 = TO_STRING_TAG_SUPPORT$2 ? classofRaw : function(it) {
  var O2, tag, result;
  return it === void 0 ? "Undefined" : it === null ? "Null" : typeof (tag = tryGet(O2 = $Object$1(it), TO_STRING_TAG$2)) == "string" ? tag : CORRECT_ARGUMENTS ? classofRaw(O2) : (result = classofRaw(O2)) == "Object" && isCallable$b(O2.callee) ? "Arguments" : result;
};
var uncurryThis$n = functionUncurryThis;
var fails$n = fails$w;
var isCallable$a = isCallable$m;
var classof$7 = classof$8;
var getBuiltIn$5 = getBuiltIn$9;
var inspectSource = inspectSource$3;
var noop = function() {
};
var empty = [];
var construct = getBuiltIn$5("Reflect", "construct");
var constructorRegExp = /^\s*(?:class|function)\b/;
var exec$4 = uncurryThis$n(constructorRegExp.exec);
var INCORRECT_TO_STRING = !constructorRegExp.exec(noop);
var isConstructorModern = function isConstructor(argument) {
  if (!isCallable$a(argument))
    return false;
  try {
    construct(noop, empty, argument);
    return true;
  } catch (error) {
    return false;
  }
};
var isConstructorLegacy = function isConstructor2(argument) {
  if (!isCallable$a(argument))
    return false;
  switch (classof$7(argument)) {
    case "AsyncFunction":
    case "GeneratorFunction":
    case "AsyncGeneratorFunction":
      return false;
  }
  try {
    return INCORRECT_TO_STRING || !!exec$4(constructorRegExp, inspectSource(argument));
  } catch (error) {
    return true;
  }
};
isConstructorLegacy.sham = true;
var isConstructor$4 = !construct || fails$n(function() {
  var called;
  return isConstructorModern(isConstructorModern.call) || !isConstructorModern(Object) || !isConstructorModern(function() {
    called = true;
  }) || called;
}) ? isConstructorLegacy : isConstructorModern;
var isArray$4 = isArray$5;
var isConstructor$3 = isConstructor$4;
var isObject$8 = isObject$e;
var wellKnownSymbol$k = wellKnownSymbol$o;
var SPECIES$5 = wellKnownSymbol$k("species");
var $Array$3 = Array;
var arraySpeciesConstructor$1 = function(originalArray) {
  var C;
  if (isArray$4(originalArray)) {
    C = originalArray.constructor;
    if (isConstructor$3(C) && (C === $Array$3 || isArray$4(C.prototype)))
      C = void 0;
    else if (isObject$8(C)) {
      C = C[SPECIES$5];
      if (C === null)
        C = void 0;
    }
  }
  return C === void 0 ? $Array$3 : C;
};
var arraySpeciesConstructor = arraySpeciesConstructor$1;
var arraySpeciesCreate$2 = function(originalArray, length) {
  return new (arraySpeciesConstructor(originalArray))(length === 0 ? 0 : length);
};
var fails$m = fails$w;
var wellKnownSymbol$j = wellKnownSymbol$o;
var V8_VERSION$1 = engineV8Version;
var SPECIES$4 = wellKnownSymbol$j("species");
var arrayMethodHasSpeciesSupport$4 = function(METHOD_NAME) {
  return V8_VERSION$1 >= 51 || !fails$m(function() {
    var array = [];
    var constructor = array.constructor = {};
    constructor[SPECIES$4] = function() {
      return { foo: 1 };
    };
    return array[METHOD_NAME](Boolean).foo !== 1;
  });
};
var $$n = _export;
var fails$l = fails$w;
var isArray$3 = isArray$5;
var isObject$7 = isObject$e;
var toObject$6 = toObject$8;
var lengthOfArrayLike$6 = lengthOfArrayLike$8;
var doesNotExceedSafeInteger = doesNotExceedSafeInteger$1;
var createProperty$3 = createProperty$4;
var arraySpeciesCreate$1 = arraySpeciesCreate$2;
var arrayMethodHasSpeciesSupport$3 = arrayMethodHasSpeciesSupport$4;
var wellKnownSymbol$i = wellKnownSymbol$o;
var V8_VERSION = engineV8Version;
var IS_CONCAT_SPREADABLE = wellKnownSymbol$i("isConcatSpreadable");
var IS_CONCAT_SPREADABLE_SUPPORT = V8_VERSION >= 51 || !fails$l(function() {
  var array = [];
  array[IS_CONCAT_SPREADABLE] = false;
  return array.concat()[0] !== array;
});
var SPECIES_SUPPORT = arrayMethodHasSpeciesSupport$3("concat");
var isConcatSpreadable = function(O2) {
  if (!isObject$7(O2))
    return false;
  var spreadable = O2[IS_CONCAT_SPREADABLE];
  return spreadable !== void 0 ? !!spreadable : isArray$3(O2);
};
var FORCED$2 = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT;
$$n({ target: "Array", proto: true, arity: 1, forced: FORCED$2 }, {
  concat: function concat(arg) {
    var O2 = toObject$6(this);
    var A2 = arraySpeciesCreate$1(O2, 0);
    var n = 0;
    var i, k2, length, len, E;
    for (i = -1, length = arguments.length; i < length; i++) {
      E = i === -1 ? O2 : arguments[i];
      if (isConcatSpreadable(E)) {
        len = lengthOfArrayLike$6(E);
        doesNotExceedSafeInteger(n + len);
        for (k2 = 0; k2 < len; k2++, n++)
          if (k2 in E)
            createProperty$3(A2, n, E[k2]);
      } else {
        doesNotExceedSafeInteger(n + 1);
        createProperty$3(A2, n++, E);
      }
    }
    A2.length = n;
    return A2;
  }
});
var isCallable$9 = isCallable$m;
var $String$1 = String;
var $TypeError$6 = TypeError;
var aPossiblePrototype$1 = function(argument) {
  if (typeof argument == "object" || isCallable$9(argument))
    return argument;
  throw $TypeError$6("Can't set " + $String$1(argument) + " as a prototype");
};
var uncurryThis$m = functionUncurryThis;
var anObject$e = anObject$h;
var aPossiblePrototype = aPossiblePrototype$1;
var objectSetPrototypeOf = Object.setPrototypeOf || ("__proto__" in {} ? function() {
  var CORRECT_SETTER = false;
  var test2 = {};
  var setter;
  try {
    setter = uncurryThis$m(Object.getOwnPropertyDescriptor(Object.prototype, "__proto__").set);
    setter(test2, []);
    CORRECT_SETTER = test2 instanceof Array;
  } catch (error) {
  }
  return function setPrototypeOf2(O2, proto) {
    anObject$e(O2);
    aPossiblePrototype(proto);
    if (CORRECT_SETTER)
      setter(O2, proto);
    else
      O2.__proto__ = proto;
    return O2;
  };
}() : void 0);
var isCallable$8 = isCallable$m;
var isObject$6 = isObject$e;
var setPrototypeOf$1 = objectSetPrototypeOf;
var inheritIfRequired$3 = function($this, dummy, Wrapper) {
  var NewTarget, NewTargetPrototype;
  if (setPrototypeOf$1 && isCallable$8(NewTarget = dummy.constructor) && NewTarget !== Wrapper && isObject$6(NewTargetPrototype = NewTarget.prototype) && NewTargetPrototype !== Wrapper.prototype)
    setPrototypeOf$1($this, NewTargetPrototype);
  return $this;
};
var isObject$5 = isObject$e;
var classof$6 = classofRaw$1;
var wellKnownSymbol$h = wellKnownSymbol$o;
var MATCH$1 = wellKnownSymbol$h("match");
var isRegexp = function(it) {
  var isRegExp2;
  return isObject$5(it) && ((isRegExp2 = it[MATCH$1]) !== void 0 ? !!isRegExp2 : classof$6(it) == "RegExp");
};
var classof$5 = classof$8;
var $String = String;
var toString$c = function(argument) {
  if (classof$5(argument) === "Symbol")
    throw TypeError("Cannot convert a Symbol value to a string");
  return $String(argument);
};
var anObject$d = anObject$h;
var regexpFlags$1 = function() {
  var that = anObject$d(this);
  var result = "";
  if (that.hasIndices)
    result += "d";
  if (that.global)
    result += "g";
  if (that.ignoreCase)
    result += "i";
  if (that.multiline)
    result += "m";
  if (that.dotAll)
    result += "s";
  if (that.unicode)
    result += "u";
  if (that.unicodeSets)
    result += "v";
  if (that.sticky)
    result += "y";
  return result;
};
var call$e = functionCall;
var hasOwn$a = hasOwnProperty_1;
var isPrototypeOf$6 = objectIsPrototypeOf;
var regExpFlags = regexpFlags$1;
var RegExpPrototype$3 = RegExp.prototype;
var regexpGetFlags = function(R2) {
  var flags = R2.flags;
  return flags === void 0 && !("flags" in RegExpPrototype$3) && !hasOwn$a(R2, "flags") && isPrototypeOf$6(RegExpPrototype$3, R2) ? call$e(regExpFlags, R2) : flags;
};
var fails$k = fails$w;
var global$a = global$k;
var $RegExp$2 = global$a.RegExp;
var UNSUPPORTED_Y$3 = fails$k(function() {
  var re3 = $RegExp$2("a", "y");
  re3.lastIndex = 2;
  return re3.exec("abcd") != null;
});
var MISSED_STICKY$1 = UNSUPPORTED_Y$3 || fails$k(function() {
  return !$RegExp$2("a", "y").sticky;
});
var BROKEN_CARET = UNSUPPORTED_Y$3 || fails$k(function() {
  var re3 = $RegExp$2("^r", "gy");
  re3.lastIndex = 2;
  return re3.exec("str") != null;
});
var regexpStickyHelpers = {
  BROKEN_CARET,
  MISSED_STICKY: MISSED_STICKY$1,
  UNSUPPORTED_Y: UNSUPPORTED_Y$3
};
var defineProperty$a = objectDefineProperty.f;
var proxyAccessor$1 = function(Target, Source, key) {
  key in Target || defineProperty$a(Target, key, {
    configurable: true,
    get: function() {
      return Source[key];
    },
    set: function(it) {
      Source[key] = it;
    }
  });
};
var getBuiltIn$4 = getBuiltIn$9;
var definePropertyModule$2 = objectDefineProperty;
var wellKnownSymbol$g = wellKnownSymbol$o;
var DESCRIPTORS$9 = descriptors;
var SPECIES$3 = wellKnownSymbol$g("species");
var setSpecies$2 = function(CONSTRUCTOR_NAME) {
  var Constructor = getBuiltIn$4(CONSTRUCTOR_NAME);
  var defineProperty5 = definePropertyModule$2.f;
  if (DESCRIPTORS$9 && Constructor && !Constructor[SPECIES$3]) {
    defineProperty5(Constructor, SPECIES$3, {
      configurable: true,
      get: function() {
        return this;
      }
    });
  }
};
var fails$j = fails$w;
var global$9 = global$k;
var $RegExp$1 = global$9.RegExp;
var regexpUnsupportedDotAll = fails$j(function() {
  var re3 = $RegExp$1(".", "s");
  return !(re3.dotAll && re3.exec("\n") && re3.flags === "s");
});
var fails$i = fails$w;
var global$8 = global$k;
var $RegExp = global$8.RegExp;
var regexpUnsupportedNcg = fails$i(function() {
  var re3 = $RegExp("(?<a>b)", "g");
  return re3.exec("b").groups.a !== "b" || "b".replace(re3, "$<a>c") !== "bc";
});
var DESCRIPTORS$8 = descriptors;
var global$7 = global$k;
var uncurryThis$l = functionUncurryThis;
var isForced$2 = isForced_1;
var inheritIfRequired$2 = inheritIfRequired$3;
var createNonEnumerableProperty$4 = createNonEnumerableProperty$7;
var getOwnPropertyNames$1 = objectGetOwnPropertyNames.f;
var isPrototypeOf$5 = objectIsPrototypeOf;
var isRegExp$1 = isRegexp;
var toString$b = toString$c;
var getRegExpFlags$1 = regexpGetFlags;
var stickyHelpers$2 = regexpStickyHelpers;
var proxyAccessor = proxyAccessor$1;
var defineBuiltIn$b = defineBuiltIn$d;
var fails$h = fails$w;
var hasOwn$9 = hasOwnProperty_1;
var enforceInternalState = internalState.enforce;
var setSpecies$1 = setSpecies$2;
var wellKnownSymbol$f = wellKnownSymbol$o;
var UNSUPPORTED_DOT_ALL$1 = regexpUnsupportedDotAll;
var UNSUPPORTED_NCG$1 = regexpUnsupportedNcg;
var MATCH = wellKnownSymbol$f("match");
var NativeRegExp = global$7.RegExp;
var RegExpPrototype$2 = NativeRegExp.prototype;
var SyntaxError = global$7.SyntaxError;
var exec$3 = uncurryThis$l(RegExpPrototype$2.exec);
var charAt$6 = uncurryThis$l("".charAt);
var replace$5 = uncurryThis$l("".replace);
var stringIndexOf$1 = uncurryThis$l("".indexOf);
var stringSlice$6 = uncurryThis$l("".slice);
var IS_NCG = /^\?<[^\s\d!#%&*+<=>@^][^\s!#%&*+<=>@^]*>/;
var re1 = /a/g;
var re2 = /a/g;
var CORRECT_NEW = new NativeRegExp(re1) !== re1;
var MISSED_STICKY = stickyHelpers$2.MISSED_STICKY;
var UNSUPPORTED_Y$2 = stickyHelpers$2.UNSUPPORTED_Y;
var BASE_FORCED = DESCRIPTORS$8 && (!CORRECT_NEW || MISSED_STICKY || UNSUPPORTED_DOT_ALL$1 || UNSUPPORTED_NCG$1 || fails$h(function() {
  re2[MATCH] = false;
  return NativeRegExp(re1) != re1 || NativeRegExp(re2) == re2 || NativeRegExp(re1, "i") != "/a/i";
}));
var handleDotAll = function(string) {
  var length = string.length;
  var index = 0;
  var result = "";
  var brackets = false;
  var chr;
  for (; index <= length; index++) {
    chr = charAt$6(string, index);
    if (chr === "\\") {
      result += chr + charAt$6(string, ++index);
      continue;
    }
    if (!brackets && chr === ".") {
      result += "[\\s\\S]";
    } else {
      if (chr === "[") {
        brackets = true;
      } else if (chr === "]") {
        brackets = false;
      }
      result += chr;
    }
  }
  return result;
};
var handleNCG = function(string) {
  var length = string.length;
  var index = 0;
  var result = "";
  var named = [];
  var names = {};
  var brackets = false;
  var ncg = false;
  var groupid = 0;
  var groupname = "";
  var chr;
  for (; index <= length; index++) {
    chr = charAt$6(string, index);
    if (chr === "\\") {
      chr = chr + charAt$6(string, ++index);
    } else if (chr === "]") {
      brackets = false;
    } else if (!brackets)
      switch (true) {
        case chr === "[":
          brackets = true;
          break;
        case chr === "(":
          if (exec$3(IS_NCG, stringSlice$6(string, index + 1))) {
            index += 2;
            ncg = true;
          }
          result += chr;
          groupid++;
          continue;
        case (chr === ">" && ncg):
          if (groupname === "" || hasOwn$9(names, groupname)) {
            throw new SyntaxError("Invalid capture group name");
          }
          names[groupname] = true;
          named[named.length] = [groupname, groupid];
          ncg = false;
          groupname = "";
          continue;
      }
    if (ncg)
      groupname += chr;
    else
      result += chr;
  }
  return [result, named];
};
if (isForced$2("RegExp", BASE_FORCED)) {
  var RegExpWrapper = function RegExp2(pattern, flags) {
    var thisIsRegExp = isPrototypeOf$5(RegExpPrototype$2, this);
    var patternIsRegExp = isRegExp$1(pattern);
    var flagsAreUndefined = flags === void 0;
    var groups = [];
    var rawPattern = pattern;
    var rawFlags, dotAll, sticky, handled, result, state;
    if (!thisIsRegExp && patternIsRegExp && flagsAreUndefined && pattern.constructor === RegExpWrapper) {
      return pattern;
    }
    if (patternIsRegExp || isPrototypeOf$5(RegExpPrototype$2, pattern)) {
      pattern = pattern.source;
      if (flagsAreUndefined)
        flags = getRegExpFlags$1(rawPattern);
    }
    pattern = pattern === void 0 ? "" : toString$b(pattern);
    flags = flags === void 0 ? "" : toString$b(flags);
    rawPattern = pattern;
    if (UNSUPPORTED_DOT_ALL$1 && "dotAll" in re1) {
      dotAll = !!flags && stringIndexOf$1(flags, "s") > -1;
      if (dotAll)
        flags = replace$5(flags, /s/g, "");
    }
    rawFlags = flags;
    if (MISSED_STICKY && "sticky" in re1) {
      sticky = !!flags && stringIndexOf$1(flags, "y") > -1;
      if (sticky && UNSUPPORTED_Y$2)
        flags = replace$5(flags, /y/g, "");
    }
    if (UNSUPPORTED_NCG$1) {
      handled = handleNCG(pattern);
      pattern = handled[0];
      groups = handled[1];
    }
    result = inheritIfRequired$2(NativeRegExp(pattern, flags), thisIsRegExp ? this : RegExpPrototype$2, RegExpWrapper);
    if (dotAll || sticky || groups.length) {
      state = enforceInternalState(result);
      if (dotAll) {
        state.dotAll = true;
        state.raw = RegExpWrapper(handleDotAll(pattern), rawFlags);
      }
      if (sticky)
        state.sticky = true;
      if (groups.length)
        state.groups = groups;
    }
    if (pattern !== rawPattern)
      try {
        createNonEnumerableProperty$4(result, "source", rawPattern === "" ? "(?:)" : rawPattern);
      } catch (error) {
      }
    return result;
  };
  for (var keys$1 = getOwnPropertyNames$1(NativeRegExp), index = 0; keys$1.length > index; ) {
    proxyAccessor(RegExpWrapper, NativeRegExp, keys$1[index++]);
  }
  RegExpPrototype$2.constructor = RegExpWrapper;
  RegExpWrapper.prototype = RegExpPrototype$2;
  defineBuiltIn$b(global$7, "RegExp", RegExpWrapper, { constructor: true });
}
setSpecies$1("RegExp");
var objectDefineProperties = {};
var internalObjectKeys = objectKeysInternal;
var enumBugKeys$1 = enumBugKeys$3;
var objectKeys$2 = Object.keys || function keys(O2) {
  return internalObjectKeys(O2, enumBugKeys$1);
};
var DESCRIPTORS$7 = descriptors;
var V8_PROTOTYPE_DEFINE_BUG = v8PrototypeDefineBug;
var definePropertyModule$1 = objectDefineProperty;
var anObject$c = anObject$h;
var toIndexedObject$5 = toIndexedObject$9;
var objectKeys$1 = objectKeys$2;
objectDefineProperties.f = DESCRIPTORS$7 && !V8_PROTOTYPE_DEFINE_BUG ? Object.defineProperties : function defineProperties(O2, Properties) {
  anObject$c(O2);
  var props = toIndexedObject$5(Properties);
  var keys2 = objectKeys$1(Properties);
  var length = keys2.length;
  var index = 0;
  var key;
  while (length > index)
    definePropertyModule$1.f(O2, key = keys2[index++], props[key]);
  return O2;
};
var getBuiltIn$3 = getBuiltIn$9;
var html$1 = getBuiltIn$3("document", "documentElement");
var anObject$b = anObject$h;
var definePropertiesModule$1 = objectDefineProperties;
var enumBugKeys = enumBugKeys$3;
var hiddenKeys$2 = hiddenKeys$6;
var html = html$1;
var documentCreateElement$1 = documentCreateElement$2;
var sharedKey$2 = sharedKey$4;
var GT = ">";
var LT = "<";
var PROTOTYPE$1 = "prototype";
var SCRIPT = "script";
var IE_PROTO$1 = sharedKey$2("IE_PROTO");
var EmptyConstructor = function() {
};
var scriptTag = function(content) {
  return LT + SCRIPT + GT + content + LT + "/" + SCRIPT + GT;
};
var NullProtoObjectViaActiveX = function(activeXDocument2) {
  activeXDocument2.write(scriptTag(""));
  activeXDocument2.close();
  var temp = activeXDocument2.parentWindow.Object;
  activeXDocument2 = null;
  return temp;
};
var NullProtoObjectViaIFrame = function() {
  var iframe = documentCreateElement$1("iframe");
  var JS = "java" + SCRIPT + ":";
  var iframeDocument;
  iframe.style.display = "none";
  html.appendChild(iframe);
  iframe.src = String(JS);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(scriptTag("document.F=Object"));
  iframeDocument.close();
  return iframeDocument.F;
};
var activeXDocument;
var NullProtoObject = function() {
  try {
    activeXDocument = new ActiveXObject("htmlfile");
  } catch (error) {
  }
  NullProtoObject = typeof document != "undefined" ? document.domain && activeXDocument ? NullProtoObjectViaActiveX(activeXDocument) : NullProtoObjectViaIFrame() : NullProtoObjectViaActiveX(activeXDocument);
  var length = enumBugKeys.length;
  while (length--)
    delete NullProtoObject[PROTOTYPE$1][enumBugKeys[length]];
  return NullProtoObject();
};
hiddenKeys$2[IE_PROTO$1] = true;
var objectCreate = Object.create || function create(O2, Properties) {
  var result;
  if (O2 !== null) {
    EmptyConstructor[PROTOTYPE$1] = anObject$b(O2);
    result = new EmptyConstructor();
    EmptyConstructor[PROTOTYPE$1] = null;
    result[IE_PROTO$1] = O2;
  } else
    result = NullProtoObject();
  return Properties === void 0 ? result : definePropertiesModule$1.f(result, Properties);
};
var call$d = functionCall;
var uncurryThis$k = functionUncurryThis;
var toString$a = toString$c;
var regexpFlags = regexpFlags$1;
var stickyHelpers$1 = regexpStickyHelpers;
var shared$3 = shared$7.exports;
var create$3 = objectCreate;
var getInternalState$3 = internalState.get;
var UNSUPPORTED_DOT_ALL = regexpUnsupportedDotAll;
var UNSUPPORTED_NCG = regexpUnsupportedNcg;
var nativeReplace = shared$3("native-string-replace", String.prototype.replace);
var nativeExec = RegExp.prototype.exec;
var patchedExec = nativeExec;
var charAt$5 = uncurryThis$k("".charAt);
var indexOf = uncurryThis$k("".indexOf);
var replace$4 = uncurryThis$k("".replace);
var stringSlice$5 = uncurryThis$k("".slice);
var UPDATES_LAST_INDEX_WRONG = function() {
  var re12 = /a/;
  var re22 = /b*/g;
  call$d(nativeExec, re12, "a");
  call$d(nativeExec, re22, "a");
  return re12.lastIndex !== 0 || re22.lastIndex !== 0;
}();
var UNSUPPORTED_Y$1 = stickyHelpers$1.BROKEN_CARET;
var NPCG_INCLUDED = /()??/.exec("")[1] !== void 0;
var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED || UNSUPPORTED_Y$1 || UNSUPPORTED_DOT_ALL || UNSUPPORTED_NCG;
if (PATCH) {
  patchedExec = function exec2(string) {
    var re3 = this;
    var state = getInternalState$3(re3);
    var str = toString$a(string);
    var raw = state.raw;
    var result, reCopy, lastIndex, match2, i, object, group;
    if (raw) {
      raw.lastIndex = re3.lastIndex;
      result = call$d(patchedExec, raw, str);
      re3.lastIndex = raw.lastIndex;
      return result;
    }
    var groups = state.groups;
    var sticky = UNSUPPORTED_Y$1 && re3.sticky;
    var flags = call$d(regexpFlags, re3);
    var source = re3.source;
    var charsAdded = 0;
    var strCopy = str;
    if (sticky) {
      flags = replace$4(flags, "y", "");
      if (indexOf(flags, "g") === -1) {
        flags += "g";
      }
      strCopy = stringSlice$5(str, re3.lastIndex);
      if (re3.lastIndex > 0 && (!re3.multiline || re3.multiline && charAt$5(str, re3.lastIndex - 1) !== "\n")) {
        source = "(?: " + source + ")";
        strCopy = " " + strCopy;
        charsAdded++;
      }
      reCopy = new RegExp("^(?:" + source + ")", flags);
    }
    if (NPCG_INCLUDED) {
      reCopy = new RegExp("^" + source + "$(?!\\s)", flags);
    }
    if (UPDATES_LAST_INDEX_WRONG)
      lastIndex = re3.lastIndex;
    match2 = call$d(nativeExec, sticky ? reCopy : re3, strCopy);
    if (sticky) {
      if (match2) {
        match2.input = stringSlice$5(match2.input, charsAdded);
        match2[0] = stringSlice$5(match2[0], charsAdded);
        match2.index = re3.lastIndex;
        re3.lastIndex += match2[0].length;
      } else
        re3.lastIndex = 0;
    } else if (UPDATES_LAST_INDEX_WRONG && match2) {
      re3.lastIndex = re3.global ? match2.index + match2[0].length : lastIndex;
    }
    if (NPCG_INCLUDED && match2 && match2.length > 1) {
      call$d(nativeReplace, match2[0], reCopy, function() {
        for (i = 1; i < arguments.length - 2; i++) {
          if (arguments[i] === void 0)
            match2[i] = void 0;
        }
      });
    }
    if (match2 && groups) {
      match2.groups = object = create$3(null);
      for (i = 0; i < groups.length; i++) {
        group = groups[i];
        object[group[0]] = match2[group[1]];
      }
    }
    return match2;
  };
}
var regexpExec$3 = patchedExec;
var $$m = _export;
var exec$2 = regexpExec$3;
$$m({ target: "RegExp", proto: true, forced: /./.exec !== exec$2 }, {
  exec: exec$2
});
var PROPER_FUNCTION_NAME$2 = functionName.PROPER;
var defineBuiltIn$a = defineBuiltIn$d;
var anObject$a = anObject$h;
var $toString$1 = toString$c;
var fails$g = fails$w;
var getRegExpFlags = regexpGetFlags;
var TO_STRING$1 = "toString";
var RegExpPrototype$1 = RegExp.prototype;
var n$ToString = RegExpPrototype$1[TO_STRING$1];
var NOT_GENERIC = fails$g(function() {
  return n$ToString.call({ source: "a", flags: "b" }) != "/a/b";
});
var INCORRECT_NAME = PROPER_FUNCTION_NAME$2 && n$ToString.name != TO_STRING$1;
if (NOT_GENERIC || INCORRECT_NAME) {
  defineBuiltIn$a(RegExp.prototype, TO_STRING$1, function toString4() {
    var R2 = anObject$a(this);
    var pattern = $toString$1(R2.source);
    var flags = $toString$1(getRegExpFlags(R2));
    return "/" + pattern + "/" + flags;
  }, { unsafe: true });
}
var uncurryThis$j = functionUncurryThis;
var thisNumberValue$1 = uncurryThis$j(1 .valueOf);
var whitespaces$2 = "	\n\v\f\r \xA0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF";
var uncurryThis$i = functionUncurryThis;
var requireObjectCoercible$4 = requireObjectCoercible$7;
var toString$9 = toString$c;
var whitespaces$1 = whitespaces$2;
var replace$3 = uncurryThis$i("".replace);
var whitespace = "[" + whitespaces$1 + "]";
var ltrim = RegExp("^" + whitespace + whitespace + "*");
var rtrim = RegExp(whitespace + whitespace + "*$");
var createMethod$2 = function(TYPE) {
  return function($this) {
    var string = toString$9(requireObjectCoercible$4($this));
    if (TYPE & 1)
      string = replace$3(string, ltrim, "");
    if (TYPE & 2)
      string = replace$3(string, rtrim, "");
    return string;
  };
};
var stringTrim = {
  start: createMethod$2(1),
  end: createMethod$2(2),
  trim: createMethod$2(3)
};
var DESCRIPTORS$6 = descriptors;
var global$6 = global$k;
var uncurryThis$h = functionUncurryThis;
var isForced$1 = isForced_1;
var defineBuiltIn$9 = defineBuiltIn$d;
var hasOwn$8 = hasOwnProperty_1;
var inheritIfRequired$1 = inheritIfRequired$3;
var isPrototypeOf$4 = objectIsPrototypeOf;
var isSymbol$2 = isSymbol$5;
var toPrimitive = toPrimitive$2;
var fails$f = fails$w;
var getOwnPropertyNames2 = objectGetOwnPropertyNames.f;
var getOwnPropertyDescriptor2 = objectGetOwnPropertyDescriptor.f;
var defineProperty$9 = objectDefineProperty.f;
var thisNumberValue = thisNumberValue$1;
var trim = stringTrim.trim;
var NUMBER = "Number";
var NativeNumber = global$6[NUMBER];
var NumberPrototype = NativeNumber.prototype;
var TypeError$2 = global$6.TypeError;
var arraySlice$5 = uncurryThis$h("".slice);
var charCodeAt$2 = uncurryThis$h("".charCodeAt);
var toNumeric = function(value) {
  var primValue = toPrimitive(value, "number");
  return typeof primValue == "bigint" ? primValue : toNumber(primValue);
};
var toNumber = function(argument) {
  var it = toPrimitive(argument, "number");
  var first, third, radix, maxCode, digits, length, index, code;
  if (isSymbol$2(it))
    throw TypeError$2("Cannot convert a Symbol value to a number");
  if (typeof it == "string" && it.length > 2) {
    it = trim(it);
    first = charCodeAt$2(it, 0);
    if (first === 43 || first === 45) {
      third = charCodeAt$2(it, 2);
      if (third === 88 || third === 120)
        return NaN;
    } else if (first === 48) {
      switch (charCodeAt$2(it, 1)) {
        case 66:
        case 98:
          radix = 2;
          maxCode = 49;
          break;
        case 79:
        case 111:
          radix = 8;
          maxCode = 55;
          break;
        default:
          return +it;
      }
      digits = arraySlice$5(it, 2);
      length = digits.length;
      for (index = 0; index < length; index++) {
        code = charCodeAt$2(digits, index);
        if (code < 48 || code > maxCode)
          return NaN;
      }
      return parseInt(digits, radix);
    }
  }
  return +it;
};
if (isForced$1(NUMBER, !NativeNumber(" 0o1") || !NativeNumber("0b1") || NativeNumber("+0x1"))) {
  var NumberWrapper = function Number2(value) {
    var n = arguments.length < 1 ? 0 : NativeNumber(toNumeric(value));
    var dummy = this;
    return isPrototypeOf$4(NumberPrototype, dummy) && fails$f(function() {
      thisNumberValue(dummy);
    }) ? inheritIfRequired$1(Object(n), dummy, NumberWrapper) : n;
  };
  for (var keys2 = DESCRIPTORS$6 ? getOwnPropertyNames2(NativeNumber) : "MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,EPSILON,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,isFinite,isInteger,isNaN,isSafeInteger,parseFloat,parseInt,fromString,range".split(","), j = 0, key; keys2.length > j; j++) {
    if (hasOwn$8(NativeNumber, key = keys2[j]) && !hasOwn$8(NumberWrapper, key)) {
      defineProperty$9(NumberWrapper, key, getOwnPropertyDescriptor2(NativeNumber, key));
    }
  }
  NumberWrapper.prototype = NumberPrototype;
  NumberPrototype.constructor = NumberWrapper;
  defineBuiltIn$9(global$6, NUMBER, NumberWrapper, { constructor: true });
}
var $$l = _export;
$$l({ target: "Number", stat: true, nonConfigurable: true, nonWritable: true }, {
  MAX_SAFE_INTEGER: 9007199254740991
});
var SEMVER_SPEC_VERSION = "2.0.0";
var MAX_LENGTH$2 = 256;
var MAX_SAFE_INTEGER$1 = Number.MAX_SAFE_INTEGER || 9007199254740991;
var MAX_SAFE_COMPONENT_LENGTH = 16;
var constants = {
  SEMVER_SPEC_VERSION,
  MAX_LENGTH: MAX_LENGTH$2,
  MAX_SAFE_INTEGER: MAX_SAFE_INTEGER$1,
  MAX_SAFE_COMPONENT_LENGTH
};
var objectGetOwnPropertyNamesExternal = {};
var toAbsoluteIndex$1 = toAbsoluteIndex$3;
var lengthOfArrayLike$5 = lengthOfArrayLike$8;
var createProperty$2 = createProperty$4;
var $Array$2 = Array;
var max$2 = Math.max;
var arraySliceSimple = function(O2, start, end) {
  var length = lengthOfArrayLike$5(O2);
  var k2 = toAbsoluteIndex$1(start, length);
  var fin = toAbsoluteIndex$1(end === void 0 ? length : end, length);
  var result = $Array$2(max$2(fin - k2, 0));
  for (var n = 0; k2 < fin; k2++, n++)
    createProperty$2(result, n, O2[k2]);
  result.length = n;
  return result;
};
var classof$4 = classofRaw$1;
var toIndexedObject$4 = toIndexedObject$9;
var $getOwnPropertyNames$1 = objectGetOwnPropertyNames.f;
var arraySlice$4 = arraySliceSimple;
var windowNames = typeof window == "object" && window && Object.getOwnPropertyNames ? Object.getOwnPropertyNames(window) : [];
var getWindowNames = function(it) {
  try {
    return $getOwnPropertyNames$1(it);
  } catch (error) {
    return arraySlice$4(windowNames);
  }
};
objectGetOwnPropertyNamesExternal.f = function getOwnPropertyNames3(it) {
  return windowNames && classof$4(it) == "Window" ? getWindowNames(it) : $getOwnPropertyNames$1(toIndexedObject$4(it));
};
var wellKnownSymbolWrapped = {};
var wellKnownSymbol$e = wellKnownSymbol$o;
wellKnownSymbolWrapped.f = wellKnownSymbol$e;
var global$5 = global$k;
var path$1 = global$5;
var path = path$1;
var hasOwn$7 = hasOwnProperty_1;
var wrappedWellKnownSymbolModule$1 = wellKnownSymbolWrapped;
var defineProperty$8 = objectDefineProperty.f;
var defineWellKnownSymbol$2 = function(NAME2) {
  var Symbol2 = path.Symbol || (path.Symbol = {});
  if (!hasOwn$7(Symbol2, NAME2))
    defineProperty$8(Symbol2, NAME2, {
      value: wrappedWellKnownSymbolModule$1.f(NAME2)
    });
};
var call$c = functionCall;
var getBuiltIn$2 = getBuiltIn$9;
var wellKnownSymbol$d = wellKnownSymbol$o;
var defineBuiltIn$8 = defineBuiltIn$d;
var symbolDefineToPrimitive = function() {
  var Symbol2 = getBuiltIn$2("Symbol");
  var SymbolPrototype2 = Symbol2 && Symbol2.prototype;
  var valueOf = SymbolPrototype2 && SymbolPrototype2.valueOf;
  var TO_PRIMITIVE2 = wellKnownSymbol$d("toPrimitive");
  if (SymbolPrototype2 && !SymbolPrototype2[TO_PRIMITIVE2]) {
    defineBuiltIn$8(SymbolPrototype2, TO_PRIMITIVE2, function(hint) {
      return call$c(valueOf, this);
    }, { arity: 1 });
  }
};
var defineProperty$7 = objectDefineProperty.f;
var hasOwn$6 = hasOwnProperty_1;
var wellKnownSymbol$c = wellKnownSymbol$o;
var TO_STRING_TAG$1 = wellKnownSymbol$c("toStringTag");
var setToStringTag$4 = function(target, TAG, STATIC) {
  if (target && !STATIC)
    target = target.prototype;
  if (target && !hasOwn$6(target, TO_STRING_TAG$1)) {
    defineProperty$7(target, TO_STRING_TAG$1, { configurable: true, value: TAG });
  }
};
var uncurryThis$g = functionUncurryThis;
var aCallable$2 = aCallable$4;
var NATIVE_BIND$1 = functionBindNative;
var bind$4 = uncurryThis$g(uncurryThis$g.bind);
var functionBindContext = function(fn, that) {
  aCallable$2(fn);
  return that === void 0 ? fn : NATIVE_BIND$1 ? bind$4(fn, that) : function() {
    return fn.apply(that, arguments);
  };
};
var bind$3 = functionBindContext;
var uncurryThis$f = functionUncurryThis;
var IndexedObject$1 = indexedObject;
var toObject$5 = toObject$8;
var lengthOfArrayLike$4 = lengthOfArrayLike$8;
var arraySpeciesCreate = arraySpeciesCreate$2;
var push$4 = uncurryThis$f([].push);
var createMethod$1 = function(TYPE) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var IS_FILTER_REJECT = TYPE == 7;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  return function($this, callbackfn, that, specificCreate) {
    var O2 = toObject$5($this);
    var self2 = IndexedObject$1(O2);
    var boundFunction = bind$3(callbackfn, that);
    var length = lengthOfArrayLike$4(self2);
    var index = 0;
    var create4 = specificCreate || arraySpeciesCreate;
    var target = IS_MAP ? create4($this, length) : IS_FILTER || IS_FILTER_REJECT ? create4($this, 0) : void 0;
    var value, result;
    for (; length > index; index++)
      if (NO_HOLES || index in self2) {
        value = self2[index];
        result = boundFunction(value, index, O2);
        if (TYPE) {
          if (IS_MAP)
            target[index] = result;
          else if (result)
            switch (TYPE) {
              case 3:
                return true;
              case 5:
                return value;
              case 6:
                return index;
              case 2:
                push$4(target, value);
            }
          else
            switch (TYPE) {
              case 4:
                return false;
              case 7:
                push$4(target, value);
            }
        }
      }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
  };
};
var arrayIteration = {
  forEach: createMethod$1(0),
  map: createMethod$1(1),
  filter: createMethod$1(2),
  some: createMethod$1(3),
  every: createMethod$1(4),
  find: createMethod$1(5),
  findIndex: createMethod$1(6),
  filterReject: createMethod$1(7)
};
var $$k = _export;
var global$4 = global$k;
var call$b = functionCall;
var uncurryThis$e = functionUncurryThis;
var DESCRIPTORS$5 = descriptors;
var NATIVE_SYMBOL$4 = nativeSymbol;
var fails$e = fails$w;
var hasOwn$5 = hasOwnProperty_1;
var isPrototypeOf$3 = objectIsPrototypeOf;
var anObject$9 = anObject$h;
var toIndexedObject$3 = toIndexedObject$9;
var toPropertyKey = toPropertyKey$4;
var $toString = toString$c;
var createPropertyDescriptor$1 = createPropertyDescriptor$5;
var nativeObjectCreate = objectCreate;
var objectKeys = objectKeys$2;
var getOwnPropertyNamesModule$1 = objectGetOwnPropertyNames;
var getOwnPropertyNamesExternal = objectGetOwnPropertyNamesExternal;
var getOwnPropertySymbolsModule$1 = objectGetOwnPropertySymbols;
var getOwnPropertyDescriptorModule = objectGetOwnPropertyDescriptor;
var definePropertyModule = objectDefineProperty;
var definePropertiesModule = objectDefineProperties;
var propertyIsEnumerableModule = objectPropertyIsEnumerable;
var defineBuiltIn$7 = defineBuiltIn$d;
var shared$2 = shared$7.exports;
var sharedKey$1 = sharedKey$4;
var hiddenKeys$1 = hiddenKeys$6;
var uid$1 = uid$4;
var wellKnownSymbol$b = wellKnownSymbol$o;
var wrappedWellKnownSymbolModule = wellKnownSymbolWrapped;
var defineWellKnownSymbol$1 = defineWellKnownSymbol$2;
var defineSymbolToPrimitive = symbolDefineToPrimitive;
var setToStringTag$3 = setToStringTag$4;
var InternalStateModule$3 = internalState;
var $forEach$1 = arrayIteration.forEach;
var HIDDEN = sharedKey$1("hidden");
var SYMBOL = "Symbol";
var PROTOTYPE = "prototype";
var setInternalState$3 = InternalStateModule$3.set;
var getInternalState$2 = InternalStateModule$3.getterFor(SYMBOL);
var ObjectPrototype$1 = Object[PROTOTYPE];
var $Symbol = global$4.Symbol;
var SymbolPrototype$1 = $Symbol && $Symbol[PROTOTYPE];
var TypeError$1 = global$4.TypeError;
var QObject = global$4.QObject;
var nativeGetOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
var nativeDefineProperty = definePropertyModule.f;
var nativeGetOwnPropertyNames = getOwnPropertyNamesExternal.f;
var nativePropertyIsEnumerable = propertyIsEnumerableModule.f;
var push$3 = uncurryThis$e([].push);
var AllSymbols = shared$2("symbols");
var ObjectPrototypeSymbols = shared$2("op-symbols");
var WellKnownSymbolsStore = shared$2("wks");
var USE_SETTER = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;
var setSymbolDescriptor = DESCRIPTORS$5 && fails$e(function() {
  return nativeObjectCreate(nativeDefineProperty({}, "a", {
    get: function() {
      return nativeDefineProperty(this, "a", { value: 7 }).a;
    }
  })).a != 7;
}) ? function(O2, P, Attributes) {
  var ObjectPrototypeDescriptor = nativeGetOwnPropertyDescriptor(ObjectPrototype$1, P);
  if (ObjectPrototypeDescriptor)
    delete ObjectPrototype$1[P];
  nativeDefineProperty(O2, P, Attributes);
  if (ObjectPrototypeDescriptor && O2 !== ObjectPrototype$1) {
    nativeDefineProperty(ObjectPrototype$1, P, ObjectPrototypeDescriptor);
  }
} : nativeDefineProperty;
var wrap = function(tag, description) {
  var symbol = AllSymbols[tag] = nativeObjectCreate(SymbolPrototype$1);
  setInternalState$3(symbol, {
    type: SYMBOL,
    tag,
    description
  });
  if (!DESCRIPTORS$5)
    symbol.description = description;
  return symbol;
};
var $defineProperty = function defineProperty3(O2, P, Attributes) {
  if (O2 === ObjectPrototype$1)
    $defineProperty(ObjectPrototypeSymbols, P, Attributes);
  anObject$9(O2);
  var key = toPropertyKey(P);
  anObject$9(Attributes);
  if (hasOwn$5(AllSymbols, key)) {
    if (!Attributes.enumerable) {
      if (!hasOwn$5(O2, HIDDEN))
        nativeDefineProperty(O2, HIDDEN, createPropertyDescriptor$1(1, {}));
      O2[HIDDEN][key] = true;
    } else {
      if (hasOwn$5(O2, HIDDEN) && O2[HIDDEN][key])
        O2[HIDDEN][key] = false;
      Attributes = nativeObjectCreate(Attributes, { enumerable: createPropertyDescriptor$1(0, false) });
    }
    return setSymbolDescriptor(O2, key, Attributes);
  }
  return nativeDefineProperty(O2, key, Attributes);
};
var $defineProperties = function defineProperties2(O2, Properties) {
  anObject$9(O2);
  var properties = toIndexedObject$3(Properties);
  var keys2 = objectKeys(properties).concat($getOwnPropertySymbols(properties));
  $forEach$1(keys2, function(key) {
    if (!DESCRIPTORS$5 || call$b($propertyIsEnumerable, properties, key))
      $defineProperty(O2, key, properties[key]);
  });
  return O2;
};
var $create = function create2(O2, Properties) {
  return Properties === void 0 ? nativeObjectCreate(O2) : $defineProperties(nativeObjectCreate(O2), Properties);
};
var $propertyIsEnumerable = function propertyIsEnumerable2(V) {
  var P = toPropertyKey(V);
  var enumerable = call$b(nativePropertyIsEnumerable, this, P);
  if (this === ObjectPrototype$1 && hasOwn$5(AllSymbols, P) && !hasOwn$5(ObjectPrototypeSymbols, P))
    return false;
  return enumerable || !hasOwn$5(this, P) || !hasOwn$5(AllSymbols, P) || hasOwn$5(this, HIDDEN) && this[HIDDEN][P] ? enumerable : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor3(O2, P) {
  var it = toIndexedObject$3(O2);
  var key = toPropertyKey(P);
  if (it === ObjectPrototype$1 && hasOwn$5(AllSymbols, key) && !hasOwn$5(ObjectPrototypeSymbols, key))
    return;
  var descriptor = nativeGetOwnPropertyDescriptor(it, key);
  if (descriptor && hasOwn$5(AllSymbols, key) && !(hasOwn$5(it, HIDDEN) && it[HIDDEN][key])) {
    descriptor.enumerable = true;
  }
  return descriptor;
};
var $getOwnPropertyNames = function getOwnPropertyNames4(O2) {
  var names = nativeGetOwnPropertyNames(toIndexedObject$3(O2));
  var result = [];
  $forEach$1(names, function(key) {
    if (!hasOwn$5(AllSymbols, key) && !hasOwn$5(hiddenKeys$1, key))
      push$3(result, key);
  });
  return result;
};
var $getOwnPropertySymbols = function(O2) {
  var IS_OBJECT_PROTOTYPE = O2 === ObjectPrototype$1;
  var names = nativeGetOwnPropertyNames(IS_OBJECT_PROTOTYPE ? ObjectPrototypeSymbols : toIndexedObject$3(O2));
  var result = [];
  $forEach$1(names, function(key) {
    if (hasOwn$5(AllSymbols, key) && (!IS_OBJECT_PROTOTYPE || hasOwn$5(ObjectPrototype$1, key))) {
      push$3(result, AllSymbols[key]);
    }
  });
  return result;
};
if (!NATIVE_SYMBOL$4) {
  $Symbol = function Symbol2() {
    if (isPrototypeOf$3(SymbolPrototype$1, this))
      throw TypeError$1("Symbol is not a constructor");
    var description = !arguments.length || arguments[0] === void 0 ? void 0 : $toString(arguments[0]);
    var tag = uid$1(description);
    var setter = function(value) {
      if (this === ObjectPrototype$1)
        call$b(setter, ObjectPrototypeSymbols, value);
      if (hasOwn$5(this, HIDDEN) && hasOwn$5(this[HIDDEN], tag))
        this[HIDDEN][tag] = false;
      setSymbolDescriptor(this, tag, createPropertyDescriptor$1(1, value));
    };
    if (DESCRIPTORS$5 && USE_SETTER)
      setSymbolDescriptor(ObjectPrototype$1, tag, { configurable: true, set: setter });
    return wrap(tag, description);
  };
  SymbolPrototype$1 = $Symbol[PROTOTYPE];
  defineBuiltIn$7(SymbolPrototype$1, "toString", function toString4() {
    return getInternalState$2(this).tag;
  });
  defineBuiltIn$7($Symbol, "withoutSetter", function(description) {
    return wrap(uid$1(description), description);
  });
  propertyIsEnumerableModule.f = $propertyIsEnumerable;
  definePropertyModule.f = $defineProperty;
  definePropertiesModule.f = $defineProperties;
  getOwnPropertyDescriptorModule.f = $getOwnPropertyDescriptor;
  getOwnPropertyNamesModule$1.f = getOwnPropertyNamesExternal.f = $getOwnPropertyNames;
  getOwnPropertySymbolsModule$1.f = $getOwnPropertySymbols;
  wrappedWellKnownSymbolModule.f = function(name) {
    return wrap(wellKnownSymbol$b(name), name);
  };
  if (DESCRIPTORS$5) {
    nativeDefineProperty(SymbolPrototype$1, "description", {
      configurable: true,
      get: function description() {
        return getInternalState$2(this).description;
      }
    });
    {
      defineBuiltIn$7(ObjectPrototype$1, "propertyIsEnumerable", $propertyIsEnumerable, { unsafe: true });
    }
  }
}
$$k({ global: true, constructor: true, wrap: true, forced: !NATIVE_SYMBOL$4, sham: !NATIVE_SYMBOL$4 }, {
  Symbol: $Symbol
});
$forEach$1(objectKeys(WellKnownSymbolsStore), function(name) {
  defineWellKnownSymbol$1(name);
});
$$k({ target: SYMBOL, stat: true, forced: !NATIVE_SYMBOL$4 }, {
  useSetter: function() {
    USE_SETTER = true;
  },
  useSimple: function() {
    USE_SETTER = false;
  }
});
$$k({ target: "Object", stat: true, forced: !NATIVE_SYMBOL$4, sham: !DESCRIPTORS$5 }, {
  create: $create,
  defineProperty: $defineProperty,
  defineProperties: $defineProperties,
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor
});
$$k({ target: "Object", stat: true, forced: !NATIVE_SYMBOL$4 }, {
  getOwnPropertyNames: $getOwnPropertyNames
});
defineSymbolToPrimitive();
setToStringTag$3($Symbol, SYMBOL);
hiddenKeys$1[HIDDEN] = true;
var NATIVE_SYMBOL$3 = nativeSymbol;
var nativeSymbolRegistry = NATIVE_SYMBOL$3 && !!Symbol["for"] && !!Symbol.keyFor;
var $$j = _export;
var getBuiltIn$1 = getBuiltIn$9;
var hasOwn$4 = hasOwnProperty_1;
var toString$8 = toString$c;
var shared$1 = shared$7.exports;
var NATIVE_SYMBOL_REGISTRY$1 = nativeSymbolRegistry;
var StringToSymbolRegistry = shared$1("string-to-symbol-registry");
var SymbolToStringRegistry$1 = shared$1("symbol-to-string-registry");
$$j({ target: "Symbol", stat: true, forced: !NATIVE_SYMBOL_REGISTRY$1 }, {
  "for": function(key) {
    var string = toString$8(key);
    if (hasOwn$4(StringToSymbolRegistry, string))
      return StringToSymbolRegistry[string];
    var symbol = getBuiltIn$1("Symbol")(string);
    StringToSymbolRegistry[string] = symbol;
    SymbolToStringRegistry$1[symbol] = string;
    return symbol;
  }
});
var $$i = _export;
var hasOwn$3 = hasOwnProperty_1;
var isSymbol$1 = isSymbol$5;
var tryToString$4 = tryToString$6;
var shared = shared$7.exports;
var NATIVE_SYMBOL_REGISTRY = nativeSymbolRegistry;
var SymbolToStringRegistry = shared("symbol-to-string-registry");
$$i({ target: "Symbol", stat: true, forced: !NATIVE_SYMBOL_REGISTRY }, {
  keyFor: function keyFor(sym) {
    if (!isSymbol$1(sym))
      throw TypeError(tryToString$4(sym) + " is not a symbol");
    if (hasOwn$3(SymbolToStringRegistry, sym))
      return SymbolToStringRegistry[sym];
  }
});
var NATIVE_BIND = functionBindNative;
var FunctionPrototype$1 = Function.prototype;
var apply$3 = FunctionPrototype$1.apply;
var call$a = FunctionPrototype$1.call;
var functionApply = typeof Reflect == "object" && Reflect.apply || (NATIVE_BIND ? call$a.bind(apply$3) : function() {
  return call$a.apply(apply$3, arguments);
});
var uncurryThis$d = functionUncurryThis;
var arraySlice$3 = uncurryThis$d([].slice);
var $$h = _export;
var getBuiltIn = getBuiltIn$9;
var apply$2 = functionApply;
var call$9 = functionCall;
var uncurryThis$c = functionUncurryThis;
var fails$d = fails$w;
var isArray$2 = isArray$5;
var isCallable$7 = isCallable$m;
var isObject$4 = isObject$e;
var isSymbol = isSymbol$5;
var arraySlice$2 = arraySlice$3;
var NATIVE_SYMBOL$2 = nativeSymbol;
var $stringify = getBuiltIn("JSON", "stringify");
var exec$1 = uncurryThis$c(/./.exec);
var charAt$4 = uncurryThis$c("".charAt);
var charCodeAt$1 = uncurryThis$c("".charCodeAt);
var replace$2 = uncurryThis$c("".replace);
var numberToString = uncurryThis$c(1 .toString);
var tester = /[\uD800-\uDFFF]/g;
var low = /^[\uD800-\uDBFF]$/;
var hi = /^[\uDC00-\uDFFF]$/;
var WRONG_SYMBOLS_CONVERSION = !NATIVE_SYMBOL$2 || fails$d(function() {
  var symbol = getBuiltIn("Symbol")();
  return $stringify([symbol]) != "[null]" || $stringify({ a: symbol }) != "{}" || $stringify(Object(symbol)) != "{}";
});
var ILL_FORMED_UNICODE = fails$d(function() {
  return $stringify("\uDF06\uD834") !== '"\\udf06\\ud834"' || $stringify("\uDEAD") !== '"\\udead"';
});
var stringifyWithSymbolsFix = function(it, replacer) {
  var args = arraySlice$2(arguments);
  var $replacer = replacer;
  if (!isObject$4(replacer) && it === void 0 || isSymbol(it))
    return;
  if (!isArray$2(replacer))
    replacer = function(key, value) {
      if (isCallable$7($replacer))
        value = call$9($replacer, this, key, value);
      if (!isSymbol(value))
        return value;
    };
  args[1] = replacer;
  return apply$2($stringify, null, args);
};
var fixIllFormed = function(match2, offset, string) {
  var prev = charAt$4(string, offset - 1);
  var next2 = charAt$4(string, offset + 1);
  if (exec$1(low, match2) && !exec$1(hi, next2) || exec$1(hi, match2) && !exec$1(low, prev)) {
    return "\\u" + numberToString(charCodeAt$1(match2, 0), 16);
  }
  return match2;
};
if ($stringify) {
  $$h({ target: "JSON", stat: true, arity: 3, forced: WRONG_SYMBOLS_CONVERSION || ILL_FORMED_UNICODE }, {
    stringify: function stringify(it, replacer, space) {
      var args = arraySlice$2(arguments);
      var result = apply$2(WRONG_SYMBOLS_CONVERSION ? stringifyWithSymbolsFix : $stringify, null, args);
      return ILL_FORMED_UNICODE && typeof result == "string" ? replace$2(result, tester, fixIllFormed) : result;
    }
  });
}
var $$g = _export;
var NATIVE_SYMBOL$1 = nativeSymbol;
var fails$c = fails$w;
var getOwnPropertySymbolsModule = objectGetOwnPropertySymbols;
var toObject$4 = toObject$8;
var FORCED$1 = !NATIVE_SYMBOL$1 || fails$c(function() {
  getOwnPropertySymbolsModule.f(1);
});
$$g({ target: "Object", stat: true, forced: FORCED$1 }, {
  getOwnPropertySymbols: function getOwnPropertySymbols(it) {
    var $getOwnPropertySymbols2 = getOwnPropertySymbolsModule.f;
    return $getOwnPropertySymbols2 ? $getOwnPropertySymbols2(toObject$4(it)) : [];
  }
});
var $$f = _export;
var DESCRIPTORS$4 = descriptors;
var global$3 = global$k;
var uncurryThis$b = functionUncurryThis;
var hasOwn$2 = hasOwnProperty_1;
var isCallable$6 = isCallable$m;
var isPrototypeOf$2 = objectIsPrototypeOf;
var toString$7 = toString$c;
var defineProperty$6 = objectDefineProperty.f;
var copyConstructorProperties = copyConstructorProperties$2;
var NativeSymbol = global$3.Symbol;
var SymbolPrototype = NativeSymbol && NativeSymbol.prototype;
if (DESCRIPTORS$4 && isCallable$6(NativeSymbol) && (!("description" in SymbolPrototype) || NativeSymbol().description !== void 0)) {
  var EmptyStringDescriptionStore = {};
  var SymbolWrapper = function Symbol2() {
    var description = arguments.length < 1 || arguments[0] === void 0 ? void 0 : toString$7(arguments[0]);
    var result = isPrototypeOf$2(SymbolPrototype, this) ? new NativeSymbol(description) : description === void 0 ? NativeSymbol() : NativeSymbol(description);
    if (description === "")
      EmptyStringDescriptionStore[result] = true;
    return result;
  };
  copyConstructorProperties(SymbolWrapper, NativeSymbol);
  SymbolWrapper.prototype = SymbolPrototype;
  SymbolPrototype.constructor = SymbolWrapper;
  var NATIVE_SYMBOL = String(NativeSymbol("test")) == "Symbol(test)";
  var symbolToString = uncurryThis$b(SymbolPrototype.toString);
  var symbolValueOf = uncurryThis$b(SymbolPrototype.valueOf);
  var regexp = /^Symbol\((.*)\)[^)]+$/;
  var replace$1 = uncurryThis$b("".replace);
  var stringSlice$4 = uncurryThis$b("".slice);
  defineProperty$6(SymbolPrototype, "description", {
    configurable: true,
    get: function description() {
      var symbol = symbolValueOf(this);
      var string = symbolToString(symbol);
      if (hasOwn$2(EmptyStringDescriptionStore, symbol))
        return "";
      var desc = NATIVE_SYMBOL ? stringSlice$4(string, 7, -1) : replace$1(string, regexp, "$1");
      return desc === "" ? void 0 : desc;
    }
  });
  $$f({ global: true, constructor: true, forced: true }, {
    Symbol: SymbolWrapper
  });
}
var defineWellKnownSymbol = defineWellKnownSymbol$2;
defineWellKnownSymbol("iterator");
var wellKnownSymbol$a = wellKnownSymbol$o;
var create$2 = objectCreate;
var defineProperty$5 = objectDefineProperty.f;
var UNSCOPABLES = wellKnownSymbol$a("unscopables");
var ArrayPrototype$1 = Array.prototype;
if (ArrayPrototype$1[UNSCOPABLES] == void 0) {
  defineProperty$5(ArrayPrototype$1, UNSCOPABLES, {
    configurable: true,
    value: create$2(null)
  });
}
var addToUnscopables$1 = function(key) {
  ArrayPrototype$1[UNSCOPABLES][key] = true;
};
var iterators = {};
var fails$b = fails$w;
var correctPrototypeGetter = !fails$b(function() {
  function F() {
  }
  F.prototype.constructor = null;
  return Object.getPrototypeOf(new F()) !== F.prototype;
});
var hasOwn$1 = hasOwnProperty_1;
var isCallable$5 = isCallable$m;
var toObject$3 = toObject$8;
var sharedKey = sharedKey$4;
var CORRECT_PROTOTYPE_GETTER = correctPrototypeGetter;
var IE_PROTO = sharedKey("IE_PROTO");
var $Object = Object;
var ObjectPrototype = $Object.prototype;
var objectGetPrototypeOf = CORRECT_PROTOTYPE_GETTER ? $Object.getPrototypeOf : function(O2) {
  var object = toObject$3(O2);
  if (hasOwn$1(object, IE_PROTO))
    return object[IE_PROTO];
  var constructor = object.constructor;
  if (isCallable$5(constructor) && object instanceof constructor) {
    return constructor.prototype;
  }
  return object instanceof $Object ? ObjectPrototype : null;
};
var fails$a = fails$w;
var isCallable$4 = isCallable$m;
var getPrototypeOf$1 = objectGetPrototypeOf;
var defineBuiltIn$6 = defineBuiltIn$d;
var wellKnownSymbol$9 = wellKnownSymbol$o;
var ITERATOR$5 = wellKnownSymbol$9("iterator");
var BUGGY_SAFARI_ITERATORS$1 = false;
var IteratorPrototype$2, PrototypeOfArrayIteratorPrototype, arrayIterator;
if ([].keys) {
  arrayIterator = [].keys();
  if (!("next" in arrayIterator))
    BUGGY_SAFARI_ITERATORS$1 = true;
  else {
    PrototypeOfArrayIteratorPrototype = getPrototypeOf$1(getPrototypeOf$1(arrayIterator));
    if (PrototypeOfArrayIteratorPrototype !== Object.prototype)
      IteratorPrototype$2 = PrototypeOfArrayIteratorPrototype;
  }
}
var NEW_ITERATOR_PROTOTYPE = IteratorPrototype$2 == void 0 || fails$a(function() {
  var test2 = {};
  return IteratorPrototype$2[ITERATOR$5].call(test2) !== test2;
});
if (NEW_ITERATOR_PROTOTYPE)
  IteratorPrototype$2 = {};
if (!isCallable$4(IteratorPrototype$2[ITERATOR$5])) {
  defineBuiltIn$6(IteratorPrototype$2, ITERATOR$5, function() {
    return this;
  });
}
var iteratorsCore = {
  IteratorPrototype: IteratorPrototype$2,
  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS$1
};
var IteratorPrototype$1 = iteratorsCore.IteratorPrototype;
var create$1 = objectCreate;
var createPropertyDescriptor = createPropertyDescriptor$5;
var setToStringTag$2 = setToStringTag$4;
var Iterators$4 = iterators;
var returnThis$1 = function() {
  return this;
};
var createIteratorConstructor$1 = function(IteratorConstructor, NAME2, next2, ENUMERABLE_NEXT) {
  var TO_STRING_TAG2 = NAME2 + " Iterator";
  IteratorConstructor.prototype = create$1(IteratorPrototype$1, { next: createPropertyDescriptor(+!ENUMERABLE_NEXT, next2) });
  setToStringTag$2(IteratorConstructor, TO_STRING_TAG2, false);
  Iterators$4[TO_STRING_TAG2] = returnThis$1;
  return IteratorConstructor;
};
var $$e = _export;
var call$8 = functionCall;
var FunctionName = functionName;
var isCallable$3 = isCallable$m;
var createIteratorConstructor = createIteratorConstructor$1;
var getPrototypeOf = objectGetPrototypeOf;
var setPrototypeOf = objectSetPrototypeOf;
var setToStringTag$1 = setToStringTag$4;
var createNonEnumerableProperty$3 = createNonEnumerableProperty$7;
var defineBuiltIn$5 = defineBuiltIn$d;
var wellKnownSymbol$8 = wellKnownSymbol$o;
var Iterators$3 = iterators;
var IteratorsCore = iteratorsCore;
var PROPER_FUNCTION_NAME$1 = FunctionName.PROPER;
var CONFIGURABLE_FUNCTION_NAME = FunctionName.CONFIGURABLE;
var IteratorPrototype = IteratorsCore.IteratorPrototype;
var BUGGY_SAFARI_ITERATORS = IteratorsCore.BUGGY_SAFARI_ITERATORS;
var ITERATOR$4 = wellKnownSymbol$8("iterator");
var KEYS = "keys";
var VALUES = "values";
var ENTRIES = "entries";
var returnThis = function() {
  return this;
};
var defineIterator$3 = function(Iterable, NAME2, IteratorConstructor, next2, DEFAULT, IS_SET, FORCED2) {
  createIteratorConstructor(IteratorConstructor, NAME2, next2);
  var getIterationMethod = function(KIND) {
    if (KIND === DEFAULT && defaultIterator)
      return defaultIterator;
    if (!BUGGY_SAFARI_ITERATORS && KIND in IterablePrototype)
      return IterablePrototype[KIND];
    switch (KIND) {
      case KEYS:
        return function keys2() {
          return new IteratorConstructor(this, KIND);
        };
      case VALUES:
        return function values2() {
          return new IteratorConstructor(this, KIND);
        };
      case ENTRIES:
        return function entries() {
          return new IteratorConstructor(this, KIND);
        };
    }
    return function() {
      return new IteratorConstructor(this);
    };
  };
  var TO_STRING_TAG2 = NAME2 + " Iterator";
  var INCORRECT_VALUES_NAME = false;
  var IterablePrototype = Iterable.prototype;
  var nativeIterator = IterablePrototype[ITERATOR$4] || IterablePrototype["@@iterator"] || DEFAULT && IterablePrototype[DEFAULT];
  var defaultIterator = !BUGGY_SAFARI_ITERATORS && nativeIterator || getIterationMethod(DEFAULT);
  var anyNativeIterator = NAME2 == "Array" ? IterablePrototype.entries || nativeIterator : nativeIterator;
  var CurrentIteratorPrototype, methods, KEY;
  if (anyNativeIterator) {
    CurrentIteratorPrototype = getPrototypeOf(anyNativeIterator.call(new Iterable()));
    if (CurrentIteratorPrototype !== Object.prototype && CurrentIteratorPrototype.next) {
      if (getPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype) {
        if (setPrototypeOf) {
          setPrototypeOf(CurrentIteratorPrototype, IteratorPrototype);
        } else if (!isCallable$3(CurrentIteratorPrototype[ITERATOR$4])) {
          defineBuiltIn$5(CurrentIteratorPrototype, ITERATOR$4, returnThis);
        }
      }
      setToStringTag$1(CurrentIteratorPrototype, TO_STRING_TAG2, true);
    }
  }
  if (PROPER_FUNCTION_NAME$1 && DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
    if (CONFIGURABLE_FUNCTION_NAME) {
      createNonEnumerableProperty$3(IterablePrototype, "name", VALUES);
    } else {
      INCORRECT_VALUES_NAME = true;
      defaultIterator = function values2() {
        return call$8(nativeIterator, this);
      };
    }
  }
  if (DEFAULT) {
    methods = {
      values: getIterationMethod(VALUES),
      keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
      entries: getIterationMethod(ENTRIES)
    };
    if (FORCED2)
      for (KEY in methods) {
        if (BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
          defineBuiltIn$5(IterablePrototype, KEY, methods[KEY]);
        }
      }
    else
      $$e({ target: NAME2, proto: true, forced: BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME }, methods);
  }
  if (IterablePrototype[ITERATOR$4] !== defaultIterator) {
    defineBuiltIn$5(IterablePrototype, ITERATOR$4, defaultIterator, { name: DEFAULT });
  }
  Iterators$3[NAME2] = defaultIterator;
  return methods;
};
var toIndexedObject$2 = toIndexedObject$9;
var addToUnscopables = addToUnscopables$1;
var Iterators$2 = iterators;
var InternalStateModule$2 = internalState;
var defineProperty$4 = objectDefineProperty.f;
var defineIterator$2 = defineIterator$3;
var DESCRIPTORS$3 = descriptors;
var ARRAY_ITERATOR = "Array Iterator";
var setInternalState$2 = InternalStateModule$2.set;
var getInternalState$1 = InternalStateModule$2.getterFor(ARRAY_ITERATOR);
var es_array_iterator = defineIterator$2(Array, "Array", function(iterated, kind) {
  setInternalState$2(this, {
    type: ARRAY_ITERATOR,
    target: toIndexedObject$2(iterated),
    index: 0,
    kind
  });
}, function() {
  var state = getInternalState$1(this);
  var target = state.target;
  var kind = state.kind;
  var index = state.index++;
  if (!target || index >= target.length) {
    state.target = void 0;
    return { value: void 0, done: true };
  }
  if (kind == "keys")
    return { value: index, done: false };
  if (kind == "values")
    return { value: target[index], done: false };
  return { value: [index, target[index]], done: false };
}, "values");
var values = Iterators$2.Arguments = Iterators$2.Array;
addToUnscopables("keys");
addToUnscopables("values");
addToUnscopables("entries");
if (DESCRIPTORS$3 && values.name !== "values")
  try {
    defineProperty$4(values, "name", { value: "values" });
  } catch (error) {
  }
var TO_STRING_TAG_SUPPORT$1 = toStringTagSupport;
var classof$3 = classof$8;
var objectToString = TO_STRING_TAG_SUPPORT$1 ? {}.toString : function toString2() {
  return "[object " + classof$3(this) + "]";
};
var TO_STRING_TAG_SUPPORT = toStringTagSupport;
var defineBuiltIn$4 = defineBuiltIn$d;
var toString$6 = objectToString;
if (!TO_STRING_TAG_SUPPORT) {
  defineBuiltIn$4(Object.prototype, "toString", toString$6, { unsafe: true });
}
var uncurryThis$a = functionUncurryThis;
var toIntegerOrInfinity$1 = toIntegerOrInfinity$4;
var toString$5 = toString$c;
var requireObjectCoercible$3 = requireObjectCoercible$7;
var charAt$3 = uncurryThis$a("".charAt);
var charCodeAt = uncurryThis$a("".charCodeAt);
var stringSlice$3 = uncurryThis$a("".slice);
var createMethod = function(CONVERT_TO_STRING) {
  return function($this, pos) {
    var S2 = toString$5(requireObjectCoercible$3($this));
    var position = toIntegerOrInfinity$1(pos);
    var size = S2.length;
    var first, second;
    if (position < 0 || position >= size)
      return CONVERT_TO_STRING ? "" : void 0;
    first = charCodeAt(S2, position);
    return first < 55296 || first > 56319 || position + 1 === size || (second = charCodeAt(S2, position + 1)) < 56320 || second > 57343 ? CONVERT_TO_STRING ? charAt$3(S2, position) : first : CONVERT_TO_STRING ? stringSlice$3(S2, position, position + 2) : (first - 55296 << 10) + (second - 56320) + 65536;
  };
};
var stringMultibyte = {
  codeAt: createMethod(false),
  charAt: createMethod(true)
};
var charAt$2 = stringMultibyte.charAt;
var toString$4 = toString$c;
var InternalStateModule$1 = internalState;
var defineIterator$1 = defineIterator$3;
var STRING_ITERATOR = "String Iterator";
var setInternalState$1 = InternalStateModule$1.set;
var getInternalState = InternalStateModule$1.getterFor(STRING_ITERATOR);
defineIterator$1(String, "String", function(iterated) {
  setInternalState$1(this, {
    type: STRING_ITERATOR,
    string: toString$4(iterated),
    index: 0
  });
}, function next() {
  var state = getInternalState(this);
  var string = state.string;
  var index = state.index;
  var point;
  if (index >= string.length)
    return { value: void 0, done: true };
  point = charAt$2(string, index);
  state.index += point.length;
  return { value: point, done: false };
});
var domIterables = {
  CSSRuleList: 0,
  CSSStyleDeclaration: 0,
  CSSValueList: 0,
  ClientRectList: 0,
  DOMRectList: 0,
  DOMStringList: 0,
  DOMTokenList: 1,
  DataTransferItemList: 0,
  FileList: 0,
  HTMLAllCollection: 0,
  HTMLCollection: 0,
  HTMLFormElement: 0,
  HTMLSelectElement: 0,
  MediaList: 0,
  MimeTypeArray: 0,
  NamedNodeMap: 0,
  NodeList: 1,
  PaintRequestList: 0,
  Plugin: 0,
  PluginArray: 0,
  SVGLengthList: 0,
  SVGNumberList: 0,
  SVGPathSegList: 0,
  SVGPointList: 0,
  SVGStringList: 0,
  SVGTransformList: 0,
  SourceBufferList: 0,
  StyleSheetList: 0,
  TextTrackCueList: 0,
  TextTrackList: 0,
  TouchList: 0
};
var documentCreateElement = documentCreateElement$2;
var classList = documentCreateElement("span").classList;
var DOMTokenListPrototype$2 = classList && classList.constructor && classList.constructor.prototype;
var domTokenListPrototype = DOMTokenListPrototype$2 === Object.prototype ? void 0 : DOMTokenListPrototype$2;
var global$2 = global$k;
var DOMIterables$1 = domIterables;
var DOMTokenListPrototype$1 = domTokenListPrototype;
var ArrayIteratorMethods = es_array_iterator;
var createNonEnumerableProperty$2 = createNonEnumerableProperty$7;
var wellKnownSymbol$7 = wellKnownSymbol$o;
var ITERATOR$3 = wellKnownSymbol$7("iterator");
var TO_STRING_TAG = wellKnownSymbol$7("toStringTag");
var ArrayValues = ArrayIteratorMethods.values;
var handlePrototype$1 = function(CollectionPrototype, COLLECTION_NAME) {
  if (CollectionPrototype) {
    if (CollectionPrototype[ITERATOR$3] !== ArrayValues)
      try {
        createNonEnumerableProperty$2(CollectionPrototype, ITERATOR$3, ArrayValues);
      } catch (error) {
        CollectionPrototype[ITERATOR$3] = ArrayValues;
      }
    if (!CollectionPrototype[TO_STRING_TAG]) {
      createNonEnumerableProperty$2(CollectionPrototype, TO_STRING_TAG, COLLECTION_NAME);
    }
    if (DOMIterables$1[COLLECTION_NAME])
      for (var METHOD_NAME in ArrayIteratorMethods) {
        if (CollectionPrototype[METHOD_NAME] !== ArrayIteratorMethods[METHOD_NAME])
          try {
            createNonEnumerableProperty$2(CollectionPrototype, METHOD_NAME, ArrayIteratorMethods[METHOD_NAME]);
          } catch (error) {
            CollectionPrototype[METHOD_NAME] = ArrayIteratorMethods[METHOD_NAME];
          }
      }
  }
};
for (var COLLECTION_NAME$1 in DOMIterables$1) {
  handlePrototype$1(global$2[COLLECTION_NAME$1] && global$2[COLLECTION_NAME$1].prototype, COLLECTION_NAME$1);
}
handlePrototype$1(DOMTokenListPrototype$1, "DOMTokenList");
function _typeof$6(obj) {
  "@babel/helpers - typeof";
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof$6 = function _typeof2(obj2) {
      return typeof obj2;
    };
  } else {
    _typeof$6 = function _typeof2(obj2) {
      return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
    };
  }
  return _typeof$6(obj);
}
var debug$3 = (typeof process === "undefined" ? "undefined" : _typeof$6(process)) === "object" && process.env && {}.NODE_DEBUG && /\bsemver\b/i.test({}.NODE_DEBUG) ? function() {
  var _console;
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }
  return (_console = console).error.apply(_console, ["SEMVER"].concat(args));
} : function() {
};
var debug_1 = debug$3;
(function(module, exports) {
  var _require4 = constants, MAX_SAFE_COMPONENT_LENGTH2 = _require4.MAX_SAFE_COMPONENT_LENGTH;
  var debug2 = debug_1;
  exports = module.exports = {};
  var re3 = exports.re = [];
  var src = exports.src = [];
  var t2 = exports.t = {};
  var R2 = 0;
  var createToken = function createToken2(name, value, isGlobal) {
    var index = R2++;
    debug2(index, value);
    t2[name] = index;
    src[index] = value;
    re3[index] = new RegExp(value, isGlobal ? "g" : void 0);
  };
  createToken("NUMERICIDENTIFIER", "0|[1-9]\\d*");
  createToken("NUMERICIDENTIFIERLOOSE", "[0-9]+");
  createToken("NONNUMERICIDENTIFIER", "\\d*[a-zA-Z-][a-zA-Z0-9-]*");
  createToken("MAINVERSION", "(".concat(src[t2.NUMERICIDENTIFIER], ")\\.") + "(".concat(src[t2.NUMERICIDENTIFIER], ")\\.") + "(".concat(src[t2.NUMERICIDENTIFIER], ")"));
  createToken("MAINVERSIONLOOSE", "(".concat(src[t2.NUMERICIDENTIFIERLOOSE], ")\\.") + "(".concat(src[t2.NUMERICIDENTIFIERLOOSE], ")\\.") + "(".concat(src[t2.NUMERICIDENTIFIERLOOSE], ")"));
  createToken("PRERELEASEIDENTIFIER", "(?:".concat(src[t2.NUMERICIDENTIFIER], "|").concat(src[t2.NONNUMERICIDENTIFIER], ")"));
  createToken("PRERELEASEIDENTIFIERLOOSE", "(?:".concat(src[t2.NUMERICIDENTIFIERLOOSE], "|").concat(src[t2.NONNUMERICIDENTIFIER], ")"));
  createToken("PRERELEASE", "(?:-(".concat(src[t2.PRERELEASEIDENTIFIER], "(?:\\.").concat(src[t2.PRERELEASEIDENTIFIER], ")*))"));
  createToken("PRERELEASELOOSE", "(?:-?(".concat(src[t2.PRERELEASEIDENTIFIERLOOSE], "(?:\\.").concat(src[t2.PRERELEASEIDENTIFIERLOOSE], ")*))"));
  createToken("BUILDIDENTIFIER", "[0-9A-Za-z-]+");
  createToken("BUILD", "(?:\\+(".concat(src[t2.BUILDIDENTIFIER], "(?:\\.").concat(src[t2.BUILDIDENTIFIER], ")*))"));
  createToken("FULLPLAIN", "v?".concat(src[t2.MAINVERSION]).concat(src[t2.PRERELEASE], "?").concat(src[t2.BUILD], "?"));
  createToken("FULL", "^".concat(src[t2.FULLPLAIN], "$"));
  createToken("LOOSEPLAIN", "[v=\\s]*".concat(src[t2.MAINVERSIONLOOSE]).concat(src[t2.PRERELEASELOOSE], "?").concat(src[t2.BUILD], "?"));
  createToken("LOOSE", "^".concat(src[t2.LOOSEPLAIN], "$"));
  createToken("GTLT", "((?:<|>)?=?)");
  createToken("XRANGEIDENTIFIERLOOSE", "".concat(src[t2.NUMERICIDENTIFIERLOOSE], "|x|X|\\*"));
  createToken("XRANGEIDENTIFIER", "".concat(src[t2.NUMERICIDENTIFIER], "|x|X|\\*"));
  createToken("XRANGEPLAIN", "[v=\\s]*(".concat(src[t2.XRANGEIDENTIFIER], ")") + "(?:\\.(".concat(src[t2.XRANGEIDENTIFIER], ")") + "(?:\\.(".concat(src[t2.XRANGEIDENTIFIER], ")") + "(?:".concat(src[t2.PRERELEASE], ")?").concat(src[t2.BUILD], "?") + ")?)?");
  createToken("XRANGEPLAINLOOSE", "[v=\\s]*(".concat(src[t2.XRANGEIDENTIFIERLOOSE], ")") + "(?:\\.(".concat(src[t2.XRANGEIDENTIFIERLOOSE], ")") + "(?:\\.(".concat(src[t2.XRANGEIDENTIFIERLOOSE], ")") + "(?:".concat(src[t2.PRERELEASELOOSE], ")?").concat(src[t2.BUILD], "?") + ")?)?");
  createToken("XRANGE", "^".concat(src[t2.GTLT], "\\s*").concat(src[t2.XRANGEPLAIN], "$"));
  createToken("XRANGELOOSE", "^".concat(src[t2.GTLT], "\\s*").concat(src[t2.XRANGEPLAINLOOSE], "$"));
  createToken("COERCE", "".concat("(^|[^\\d])(\\d{1,").concat(MAX_SAFE_COMPONENT_LENGTH2, "})") + "(?:\\.(\\d{1,".concat(MAX_SAFE_COMPONENT_LENGTH2, "}))?") + "(?:\\.(\\d{1,".concat(MAX_SAFE_COMPONENT_LENGTH2, "}))?") + "(?:$|[^\\d])");
  createToken("COERCERTL", src[t2.COERCE], true);
  createToken("LONETILDE", "(?:~>?)");
  createToken("TILDETRIM", "(\\s*)".concat(src[t2.LONETILDE], "\\s+"), true);
  exports.tildeTrimReplace = "$1~";
  createToken("TILDE", "^".concat(src[t2.LONETILDE]).concat(src[t2.XRANGEPLAIN], "$"));
  createToken("TILDELOOSE", "^".concat(src[t2.LONETILDE]).concat(src[t2.XRANGEPLAINLOOSE], "$"));
  createToken("LONECARET", "(?:\\^)");
  createToken("CARETTRIM", "(\\s*)".concat(src[t2.LONECARET], "\\s+"), true);
  exports.caretTrimReplace = "$1^";
  createToken("CARET", "^".concat(src[t2.LONECARET]).concat(src[t2.XRANGEPLAIN], "$"));
  createToken("CARETLOOSE", "^".concat(src[t2.LONECARET]).concat(src[t2.XRANGEPLAINLOOSE], "$"));
  createToken("COMPARATORLOOSE", "^".concat(src[t2.GTLT], "\\s*(").concat(src[t2.LOOSEPLAIN], ")$|^$"));
  createToken("COMPARATOR", "^".concat(src[t2.GTLT], "\\s*(").concat(src[t2.FULLPLAIN], ")$|^$"));
  createToken("COMPARATORTRIM", "(\\s*)".concat(src[t2.GTLT], "\\s*(").concat(src[t2.LOOSEPLAIN], "|").concat(src[t2.XRANGEPLAIN], ")"), true);
  exports.comparatorTrimReplace = "$1$2$3";
  createToken("HYPHENRANGE", "^\\s*(".concat(src[t2.XRANGEPLAIN], ")") + "\\s+-\\s+" + "(".concat(src[t2.XRANGEPLAIN], ")") + "\\s*$");
  createToken("HYPHENRANGELOOSE", "^\\s*(".concat(src[t2.XRANGEPLAINLOOSE], ")") + "\\s+-\\s+" + "(".concat(src[t2.XRANGEPLAINLOOSE], ")") + "\\s*$");
  createToken("STAR", "(<|>)?=?\\s*\\*");
  createToken("GTE0", "^\\s*>=\\s*0.0.0\\s*$");
  createToken("GTE0PRE", "^\\s*>=\\s*0.0.0-0\\s*$");
})(re$5, re$5.exports);
var fails$9 = fails$w;
var arrayMethodIsStrict$5 = function(METHOD_NAME, argument) {
  var method = [][METHOD_NAME];
  return !!method && fails$9(function() {
    method.call(null, argument || function() {
      return 1;
    }, 1);
  });
};
var $$d = _export;
var uncurryThis$9 = functionUncurryThis;
var IndexedObject = indexedObject;
var toIndexedObject$1 = toIndexedObject$9;
var arrayMethodIsStrict$4 = arrayMethodIsStrict$5;
var un$Join = uncurryThis$9([].join);
var ES3_STRINGS = IndexedObject != Object;
var STRICT_METHOD$4 = arrayMethodIsStrict$4("join", ",");
$$d({ target: "Array", proto: true, forced: ES3_STRINGS || !STRICT_METHOD$4 }, {
  join: function join2(separator) {
    return un$Join(toIndexedObject$1(this), separator === void 0 ? "," : separator);
  }
});
var $$c = _export;
var $map = arrayIteration.map;
var arrayMethodHasSpeciesSupport$2 = arrayMethodHasSpeciesSupport$4;
var HAS_SPECIES_SUPPORT$2 = arrayMethodHasSpeciesSupport$2("map");
$$c({ target: "Array", proto: true, forced: !HAS_SPECIES_SUPPORT$2 }, {
  map: function map2(callbackfn) {
    return $map(this, callbackfn, arguments.length > 1 ? arguments[1] : void 0);
  }
});
var $$b = _export;
var DESCRIPTORS$2 = descriptors;
var defineProperty$3 = objectDefineProperty.f;
$$b({ target: "Object", stat: true, forced: Object.defineProperty !== defineProperty$3, sham: !DESCRIPTORS$2 }, {
  defineProperty: defineProperty$3
});
var uncurryThis$8 = functionUncurryThis;
var defineBuiltIn$3 = defineBuiltIn$d;
var regexpExec$2 = regexpExec$3;
var fails$8 = fails$w;
var wellKnownSymbol$6 = wellKnownSymbol$o;
var createNonEnumerableProperty$1 = createNonEnumerableProperty$7;
var SPECIES$2 = wellKnownSymbol$6("species");
var RegExpPrototype = RegExp.prototype;
var fixRegexpWellKnownSymbolLogic = function(KEY, exec2, FORCED2, SHAM) {
  var SYMBOL2 = wellKnownSymbol$6(KEY);
  var DELEGATES_TO_SYMBOL = !fails$8(function() {
    var O2 = {};
    O2[SYMBOL2] = function() {
      return 7;
    };
    return ""[KEY](O2) != 7;
  });
  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails$8(function() {
    var execCalled = false;
    var re3 = /a/;
    if (KEY === "split") {
      re3 = {};
      re3.constructor = {};
      re3.constructor[SPECIES$2] = function() {
        return re3;
      };
      re3.flags = "";
      re3[SYMBOL2] = /./[SYMBOL2];
    }
    re3.exec = function() {
      execCalled = true;
      return null;
    };
    re3[SYMBOL2]("");
    return !execCalled;
  });
  if (!DELEGATES_TO_SYMBOL || !DELEGATES_TO_EXEC || FORCED2) {
    var uncurriedNativeRegExpMethod = uncurryThis$8(/./[SYMBOL2]);
    var methods = exec2(SYMBOL2, ""[KEY], function(nativeMethod, regexp, str, arg2, forceStringMethod) {
      var uncurriedNativeMethod = uncurryThis$8(nativeMethod);
      var $exec = regexp.exec;
      if ($exec === regexpExec$2 || $exec === RegExpPrototype.exec) {
        if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
          return { done: true, value: uncurriedNativeRegExpMethod(regexp, str, arg2) };
        }
        return { done: true, value: uncurriedNativeMethod(str, regexp, arg2) };
      }
      return { done: false };
    });
    defineBuiltIn$3(String.prototype, KEY, methods[0]);
    defineBuiltIn$3(RegExpPrototype, SYMBOL2, methods[1]);
  }
  if (SHAM)
    createNonEnumerableProperty$1(RegExpPrototype[SYMBOL2], "sham", true);
};
var charAt$1 = stringMultibyte.charAt;
var advanceStringIndex$3 = function(S2, index, unicode) {
  return index + (unicode ? charAt$1(S2, index).length : 1);
};
var call$7 = functionCall;
var anObject$8 = anObject$h;
var isCallable$2 = isCallable$m;
var classof$2 = classofRaw$1;
var regexpExec$1 = regexpExec$3;
var $TypeError$5 = TypeError;
var regexpExecAbstract = function(R2, S2) {
  var exec2 = R2.exec;
  if (isCallable$2(exec2)) {
    var result = call$7(exec2, R2, S2);
    if (result !== null)
      anObject$8(result);
    return result;
  }
  if (classof$2(R2) === "RegExp")
    return call$7(regexpExec$1, R2, S2);
  throw $TypeError$5("RegExp#exec called on incompatible receiver");
};
var call$6 = functionCall;
var fixRegExpWellKnownSymbolLogic$2 = fixRegexpWellKnownSymbolLogic;
var anObject$7 = anObject$h;
var toLength$2 = toLength$4;
var toString$3 = toString$c;
var requireObjectCoercible$2 = requireObjectCoercible$7;
var getMethod$4 = getMethod$6;
var advanceStringIndex$2 = advanceStringIndex$3;
var regExpExec$2 = regexpExecAbstract;
fixRegExpWellKnownSymbolLogic$2("match", function(MATCH2, nativeMatch, maybeCallNative) {
  return [
    function match2(regexp) {
      var O2 = requireObjectCoercible$2(this);
      var matcher = regexp == void 0 ? void 0 : getMethod$4(regexp, MATCH2);
      return matcher ? call$6(matcher, regexp, O2) : new RegExp(regexp)[MATCH2](toString$3(O2));
    },
    function(string) {
      var rx = anObject$7(this);
      var S2 = toString$3(string);
      var res = maybeCallNative(nativeMatch, rx, S2);
      if (res.done)
        return res.value;
      if (!rx.global)
        return regExpExec$2(rx, S2);
      var fullUnicode = rx.unicode;
      rx.lastIndex = 0;
      var A2 = [];
      var n = 0;
      var result;
      while ((result = regExpExec$2(rx, S2)) !== null) {
        var matchStr = toString$3(result[0]);
        A2[n] = matchStr;
        if (matchStr === "")
          rx.lastIndex = advanceStringIndex$2(S2, toLength$2(rx.lastIndex), fullUnicode);
        n++;
      }
      return n === 0 ? null : A2;
    }
  ];
});
var isConstructor$2 = isConstructor$4;
var tryToString$3 = tryToString$6;
var $TypeError$4 = TypeError;
var aConstructor$1 = function(argument) {
  if (isConstructor$2(argument))
    return argument;
  throw $TypeError$4(tryToString$3(argument) + " is not a constructor");
};
var anObject$6 = anObject$h;
var aConstructor = aConstructor$1;
var wellKnownSymbol$5 = wellKnownSymbol$o;
var SPECIES$1 = wellKnownSymbol$5("species");
var speciesConstructor$1 = function(O2, defaultConstructor) {
  var C = anObject$6(O2).constructor;
  var S2;
  return C === void 0 || (S2 = anObject$6(C)[SPECIES$1]) == void 0 ? defaultConstructor : aConstructor(S2);
};
var apply$1 = functionApply;
var call$5 = functionCall;
var uncurryThis$7 = functionUncurryThis;
var fixRegExpWellKnownSymbolLogic$1 = fixRegexpWellKnownSymbolLogic;
var isRegExp = isRegexp;
var anObject$5 = anObject$h;
var requireObjectCoercible$1 = requireObjectCoercible$7;
var speciesConstructor = speciesConstructor$1;
var advanceStringIndex$1 = advanceStringIndex$3;
var toLength$1 = toLength$4;
var toString$2 = toString$c;
var getMethod$3 = getMethod$6;
var arraySlice$1 = arraySliceSimple;
var callRegExpExec = regexpExecAbstract;
var regexpExec = regexpExec$3;
var stickyHelpers = regexpStickyHelpers;
var fails$7 = fails$w;
var UNSUPPORTED_Y = stickyHelpers.UNSUPPORTED_Y;
var MAX_UINT32 = 4294967295;
var min$1 = Math.min;
var $push = [].push;
var exec = uncurryThis$7(/./.exec);
var push$2 = uncurryThis$7($push);
var stringSlice$2 = uncurryThis$7("".slice);
var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = !fails$7(function() {
  var re3 = /(?:)/;
  var originalExec = re3.exec;
  re3.exec = function() {
    return originalExec.apply(this, arguments);
  };
  var result = "ab".split(re3);
  return result.length !== 2 || result[0] !== "a" || result[1] !== "b";
});
fixRegExpWellKnownSymbolLogic$1("split", function(SPLIT, nativeSplit, maybeCallNative) {
  var internalSplit;
  if ("abbc".split(/(b)*/)[1] == "c" || "test".split(/(?:)/, -1).length != 4 || "ab".split(/(?:ab)*/).length != 2 || ".".split(/(.?)(.?)/).length != 4 || ".".split(/()()/).length > 1 || "".split(/.?/).length) {
    internalSplit = function(separator, limit) {
      var string = toString$2(requireObjectCoercible$1(this));
      var lim = limit === void 0 ? MAX_UINT32 : limit >>> 0;
      if (lim === 0)
        return [];
      if (separator === void 0)
        return [string];
      if (!isRegExp(separator)) {
        return call$5(nativeSplit, string, separator, lim);
      }
      var output = [];
      var flags = (separator.ignoreCase ? "i" : "") + (separator.multiline ? "m" : "") + (separator.unicode ? "u" : "") + (separator.sticky ? "y" : "");
      var lastLastIndex = 0;
      var separatorCopy = new RegExp(separator.source, flags + "g");
      var match2, lastIndex, lastLength;
      while (match2 = call$5(regexpExec, separatorCopy, string)) {
        lastIndex = separatorCopy.lastIndex;
        if (lastIndex > lastLastIndex) {
          push$2(output, stringSlice$2(string, lastLastIndex, match2.index));
          if (match2.length > 1 && match2.index < string.length)
            apply$1($push, output, arraySlice$1(match2, 1));
          lastLength = match2[0].length;
          lastLastIndex = lastIndex;
          if (output.length >= lim)
            break;
        }
        if (separatorCopy.lastIndex === match2.index)
          separatorCopy.lastIndex++;
      }
      if (lastLastIndex === string.length) {
        if (lastLength || !exec(separatorCopy, ""))
          push$2(output, "");
      } else
        push$2(output, stringSlice$2(string, lastLastIndex));
      return output.length > lim ? arraySlice$1(output, 0, lim) : output;
    };
  } else if ("0".split(void 0, 0).length) {
    internalSplit = function(separator, limit) {
      return separator === void 0 && limit === 0 ? [] : call$5(nativeSplit, this, separator, limit);
    };
  } else
    internalSplit = nativeSplit;
  return [
    function split2(separator, limit) {
      var O2 = requireObjectCoercible$1(this);
      var splitter = separator == void 0 ? void 0 : getMethod$3(separator, SPLIT);
      return splitter ? call$5(splitter, separator, O2, limit) : call$5(internalSplit, toString$2(O2), separator, limit);
    },
    function(string, limit) {
      var rx = anObject$5(this);
      var S2 = toString$2(string);
      var res = maybeCallNative(internalSplit, rx, S2, limit, internalSplit !== nativeSplit);
      if (res.done)
        return res.value;
      var C = speciesConstructor(rx, RegExp);
      var unicodeMatching = rx.unicode;
      var flags = (rx.ignoreCase ? "i" : "") + (rx.multiline ? "m" : "") + (rx.unicode ? "u" : "") + (UNSUPPORTED_Y ? "g" : "y");
      var splitter = new C(UNSUPPORTED_Y ? "^(?:" + rx.source + ")" : rx, flags);
      var lim = limit === void 0 ? MAX_UINT32 : limit >>> 0;
      if (lim === 0)
        return [];
      if (S2.length === 0)
        return callRegExpExec(splitter, S2) === null ? [S2] : [];
      var p = 0;
      var q = 0;
      var A2 = [];
      while (q < S2.length) {
        splitter.lastIndex = UNSUPPORTED_Y ? 0 : q;
        var z = callRegExpExec(splitter, UNSUPPORTED_Y ? stringSlice$2(S2, q) : S2);
        var e;
        if (z === null || (e = min$1(toLength$1(splitter.lastIndex + (UNSUPPORTED_Y ? q : 0)), S2.length)) === p) {
          q = advanceStringIndex$1(S2, q, unicodeMatching);
        } else {
          push$2(A2, stringSlice$2(S2, p, q));
          if (A2.length === lim)
            return A2;
          for (var i = 1; i <= z.length - 1; i++) {
            push$2(A2, z[i]);
            if (A2.length === lim)
              return A2;
          }
          q = p = e;
        }
      }
      push$2(A2, stringSlice$2(S2, p));
      return A2;
    }
  ];
}, !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC, UNSUPPORTED_Y);
var PROPER_FUNCTION_NAME = functionName.PROPER;
var fails$6 = fails$w;
var whitespaces = whitespaces$2;
var non = "\u200B\x85\u180E";
var stringTrimForced = function(METHOD_NAME) {
  return fails$6(function() {
    return !!whitespaces[METHOD_NAME]() || non[METHOD_NAME]() !== non || PROPER_FUNCTION_NAME && whitespaces[METHOD_NAME].name !== METHOD_NAME;
  });
};
var $$a = _export;
var $trim = stringTrim.trim;
var forcedStringTrimMethod = stringTrimForced;
$$a({ target: "String", proto: true, forced: forcedStringTrimMethod("trim") }, {
  trim: function trim2() {
    return $trim(this);
  }
});
var numeric = /^[0-9]+$/;
var compareIdentifiers$1 = function compareIdentifiers(a, b2) {
  var anum = numeric.test(a);
  var bnum = numeric.test(b2);
  if (anum && bnum) {
    a = +a;
    b2 = +b2;
  }
  return a === b2 ? 0 : anum && !bnum ? -1 : bnum && !anum ? 1 : a < b2 ? -1 : 1;
};
var rcompareIdentifiers = function rcompareIdentifiers2(a, b2) {
  return compareIdentifiers$1(b2, a);
};
var identifiers = {
  compareIdentifiers: compareIdentifiers$1,
  rcompareIdentifiers
};
function _typeof$5(obj) {
  "@babel/helpers - typeof";
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof$5 = function _typeof2(obj2) {
      return typeof obj2;
    };
  } else {
    _typeof$5 = function _typeof2(obj2) {
      return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
    };
  }
  return _typeof$5(obj);
}
function _classCallCheck$2(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties$2(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass$2(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties$2(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties$2(Constructor, staticProps);
  return Constructor;
}
var debug$2 = debug_1;
var _require$5 = constants, MAX_LENGTH$1 = _require$5.MAX_LENGTH, MAX_SAFE_INTEGER = _require$5.MAX_SAFE_INTEGER;
var _require2$1 = re$5.exports, re$4 = _require2$1.re, t$4 = _require2$1.t;
var _require3 = identifiers, compareIdentifiers2 = _require3.compareIdentifiers;
var SemVer$e = /* @__PURE__ */ function() {
  function SemVer2(version2, options) {
    _classCallCheck$2(this, SemVer2);
    if (!options || _typeof$5(options) !== "object") {
      options = {
        loose: !!options,
        includePrerelease: false
      };
    }
    if (version2 instanceof SemVer2) {
      if (version2.loose === !!options.loose && version2.includePrerelease === !!options.includePrerelease) {
        return version2;
      } else {
        version2 = version2.version;
      }
    } else if (typeof version2 !== "string") {
      throw new TypeError("Invalid Version: ".concat(version2));
    }
    if (version2.length > MAX_LENGTH$1) {
      throw new TypeError("version is longer than ".concat(MAX_LENGTH$1, " characters"));
    }
    debug$2("SemVer", version2, options);
    this.options = options;
    this.loose = !!options.loose;
    this.includePrerelease = !!options.includePrerelease;
    var m = version2.trim().match(options.loose ? re$4[t$4.LOOSE] : re$4[t$4.FULL]);
    if (!m) {
      throw new TypeError("Invalid Version: ".concat(version2));
    }
    this.raw = version2;
    this.major = +m[1];
    this.minor = +m[2];
    this.patch = +m[3];
    if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
      throw new TypeError("Invalid major version");
    }
    if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
      throw new TypeError("Invalid minor version");
    }
    if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
      throw new TypeError("Invalid patch version");
    }
    if (!m[4]) {
      this.prerelease = [];
    } else {
      this.prerelease = m[4].split(".").map(function(id2) {
        if (/^[0-9]+$/.test(id2)) {
          var num = +id2;
          if (num >= 0 && num < MAX_SAFE_INTEGER) {
            return num;
          }
        }
        return id2;
      });
    }
    this.build = m[5] ? m[5].split(".") : [];
    this.format();
  }
  _createClass$2(SemVer2, [{
    key: "format",
    value: function format2() {
      this.version = "".concat(this.major, ".").concat(this.minor, ".").concat(this.patch);
      if (this.prerelease.length) {
        this.version += "-".concat(this.prerelease.join("."));
      }
      return this.version;
    }
  }, {
    key: "toString",
    value: function toString4() {
      return this.version;
    }
  }, {
    key: "compare",
    value: function compare3(other) {
      debug$2("SemVer.compare", this.version, this.options, other);
      if (!(other instanceof SemVer2)) {
        if (typeof other === "string" && other === this.version) {
          return 0;
        }
        other = new SemVer2(other, this.options);
      }
      if (other.version === this.version) {
        return 0;
      }
      return this.compareMain(other) || this.comparePre(other);
    }
  }, {
    key: "compareMain",
    value: function compareMain(other) {
      if (!(other instanceof SemVer2)) {
        other = new SemVer2(other, this.options);
      }
      return compareIdentifiers2(this.major, other.major) || compareIdentifiers2(this.minor, other.minor) || compareIdentifiers2(this.patch, other.patch);
    }
  }, {
    key: "comparePre",
    value: function comparePre(other) {
      if (!(other instanceof SemVer2)) {
        other = new SemVer2(other, this.options);
      }
      if (this.prerelease.length && !other.prerelease.length) {
        return -1;
      } else if (!this.prerelease.length && other.prerelease.length) {
        return 1;
      } else if (!this.prerelease.length && !other.prerelease.length) {
        return 0;
      }
      var i = 0;
      do {
        var a = this.prerelease[i];
        var b2 = other.prerelease[i];
        debug$2("prerelease compare", i, a, b2);
        if (a === void 0 && b2 === void 0) {
          return 0;
        } else if (b2 === void 0) {
          return 1;
        } else if (a === void 0) {
          return -1;
        } else if (a === b2) {
          continue;
        } else {
          return compareIdentifiers2(a, b2);
        }
      } while (++i);
    }
  }, {
    key: "compareBuild",
    value: function compareBuild3(other) {
      if (!(other instanceof SemVer2)) {
        other = new SemVer2(other, this.options);
      }
      var i = 0;
      do {
        var a = this.build[i];
        var b2 = other.build[i];
        debug$2("prerelease compare", i, a, b2);
        if (a === void 0 && b2 === void 0) {
          return 0;
        } else if (b2 === void 0) {
          return 1;
        } else if (a === void 0) {
          return -1;
        } else if (a === b2) {
          continue;
        } else {
          return compareIdentifiers2(a, b2);
        }
      } while (++i);
    }
  }, {
    key: "inc",
    value: function inc3(release, identifier) {
      switch (release) {
        case "premajor":
          this.prerelease.length = 0;
          this.patch = 0;
          this.minor = 0;
          this.major++;
          this.inc("pre", identifier);
          break;
        case "preminor":
          this.prerelease.length = 0;
          this.patch = 0;
          this.minor++;
          this.inc("pre", identifier);
          break;
        case "prepatch":
          this.prerelease.length = 0;
          this.inc("patch", identifier);
          this.inc("pre", identifier);
          break;
        case "prerelease":
          if (this.prerelease.length === 0) {
            this.inc("patch", identifier);
          }
          this.inc("pre", identifier);
          break;
        case "major":
          if (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) {
            this.major++;
          }
          this.minor = 0;
          this.patch = 0;
          this.prerelease = [];
          break;
        case "minor":
          if (this.patch !== 0 || this.prerelease.length === 0) {
            this.minor++;
          }
          this.patch = 0;
          this.prerelease = [];
          break;
        case "patch":
          if (this.prerelease.length === 0) {
            this.patch++;
          }
          this.prerelease = [];
          break;
        case "pre":
          if (this.prerelease.length === 0) {
            this.prerelease = [0];
          } else {
            var i = this.prerelease.length;
            while (--i >= 0) {
              if (typeof this.prerelease[i] === "number") {
                this.prerelease[i]++;
                i = -2;
              }
            }
            if (i === -1) {
              this.prerelease.push(0);
            }
          }
          if (identifier) {
            if (this.prerelease[0] === identifier) {
              if (isNaN(this.prerelease[1])) {
                this.prerelease = [identifier, 0];
              }
            } else {
              this.prerelease = [identifier, 0];
            }
          }
          break;
        default:
          throw new Error("invalid increment argument: ".concat(release));
      }
      this.format();
      this.raw = this.version;
      return this;
    }
  }]);
  return SemVer2;
}();
var semver$1 = SemVer$e;
function _typeof$4(obj) {
  "@babel/helpers - typeof";
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof$4 = function _typeof2(obj2) {
      return typeof obj2;
    };
  } else {
    _typeof$4 = function _typeof2(obj2) {
      return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
    };
  }
  return _typeof$4(obj);
}
var _require$4 = constants, MAX_LENGTH = _require$4.MAX_LENGTH;
var _require2 = re$5.exports, re$3 = _require2.re, t$3 = _require2.t;
var SemVer$d = semver$1;
var parse$5 = function parse(version2, options) {
  if (!options || _typeof$4(options) !== "object") {
    options = {
      loose: !!options,
      includePrerelease: false
    };
  }
  if (version2 instanceof SemVer$d) {
    return version2;
  }
  if (typeof version2 !== "string") {
    return null;
  }
  if (version2.length > MAX_LENGTH) {
    return null;
  }
  var r = options.loose ? re$3[t$3.LOOSE] : re$3[t$3.FULL];
  if (!r.test(version2)) {
    return null;
  }
  try {
    return new SemVer$d(version2, options);
  } catch (er) {
    return null;
  }
};
var parse_1 = parse$5;
var parse$4 = parse_1;
var valid$1 = function valid(version2, options) {
  var v2 = parse$4(version2, options);
  return v2 ? v2.version : null;
};
var valid_1 = valid$1;
var uncurryThis$6 = functionUncurryThis;
var toObject$2 = toObject$8;
var floor$1 = Math.floor;
var charAt = uncurryThis$6("".charAt);
var replace = uncurryThis$6("".replace);
var stringSlice$1 = uncurryThis$6("".slice);
var SUBSTITUTION_SYMBOLS = /\$([$&'`]|\d{1,2}|<[^>]*>)/g;
var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&'`]|\d{1,2})/g;
var getSubstitution$1 = function(matched, str, position, captures, namedCaptures, replacement2) {
  var tailPos = position + matched.length;
  var m = captures.length;
  var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
  if (namedCaptures !== void 0) {
    namedCaptures = toObject$2(namedCaptures);
    symbols = SUBSTITUTION_SYMBOLS;
  }
  return replace(replacement2, symbols, function(match2, ch) {
    var capture;
    switch (charAt(ch, 0)) {
      case "$":
        return "$";
      case "&":
        return matched;
      case "`":
        return stringSlice$1(str, 0, position);
      case "'":
        return stringSlice$1(str, tailPos);
      case "<":
        capture = namedCaptures[stringSlice$1(ch, 1, -1)];
        break;
      default:
        var n = +ch;
        if (n === 0)
          return match2;
        if (n > m) {
          var f = floor$1(n / 10);
          if (f === 0)
            return match2;
          if (f <= m)
            return captures[f - 1] === void 0 ? charAt(ch, 1) : captures[f - 1] + charAt(ch, 1);
          return match2;
        }
        capture = captures[n - 1];
    }
    return capture === void 0 ? "" : capture;
  });
};
var apply = functionApply;
var call$4 = functionCall;
var uncurryThis$5 = functionUncurryThis;
var fixRegExpWellKnownSymbolLogic = fixRegexpWellKnownSymbolLogic;
var fails$5 = fails$w;
var anObject$4 = anObject$h;
var isCallable$1 = isCallable$m;
var toIntegerOrInfinity = toIntegerOrInfinity$4;
var toLength = toLength$4;
var toString$1 = toString$c;
var requireObjectCoercible = requireObjectCoercible$7;
var advanceStringIndex = advanceStringIndex$3;
var getMethod$2 = getMethod$6;
var getSubstitution = getSubstitution$1;
var regExpExec$1 = regexpExecAbstract;
var wellKnownSymbol$4 = wellKnownSymbol$o;
var REPLACE = wellKnownSymbol$4("replace");
var max$1 = Math.max;
var min = Math.min;
var concat2 = uncurryThis$5([].concat);
var push$1 = uncurryThis$5([].push);
var stringIndexOf = uncurryThis$5("".indexOf);
var stringSlice = uncurryThis$5("".slice);
var maybeToString = function(it) {
  return it === void 0 ? it : String(it);
};
var REPLACE_KEEPS_$0 = function() {
  return "a".replace(/./, "$0") === "$0";
}();
var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = function() {
  if (/./[REPLACE]) {
    return /./[REPLACE]("a", "$0") === "";
  }
  return false;
}();
var REPLACE_SUPPORTS_NAMED_GROUPS = !fails$5(function() {
  var re3 = /./;
  re3.exec = function() {
    var result = [];
    result.groups = { a: "7" };
    return result;
  };
  return "".replace(re3, "$<a>") !== "7";
});
fixRegExpWellKnownSymbolLogic("replace", function(_, nativeReplace2, maybeCallNative) {
  var UNSAFE_SUBSTITUTE = REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE ? "$" : "$0";
  return [
    function replace2(searchValue, replaceValue) {
      var O2 = requireObjectCoercible(this);
      var replacer = searchValue == void 0 ? void 0 : getMethod$2(searchValue, REPLACE);
      return replacer ? call$4(replacer, searchValue, O2, replaceValue) : call$4(nativeReplace2, toString$1(O2), searchValue, replaceValue);
    },
    function(string, replaceValue) {
      var rx = anObject$4(this);
      var S2 = toString$1(string);
      if (typeof replaceValue == "string" && stringIndexOf(replaceValue, UNSAFE_SUBSTITUTE) === -1 && stringIndexOf(replaceValue, "$<") === -1) {
        var res = maybeCallNative(nativeReplace2, rx, S2, replaceValue);
        if (res.done)
          return res.value;
      }
      var functionalReplace = isCallable$1(replaceValue);
      if (!functionalReplace)
        replaceValue = toString$1(replaceValue);
      var global2 = rx.global;
      if (global2) {
        var fullUnicode = rx.unicode;
        rx.lastIndex = 0;
      }
      var results = [];
      while (true) {
        var result = regExpExec$1(rx, S2);
        if (result === null)
          break;
        push$1(results, result);
        if (!global2)
          break;
        var matchStr = toString$1(result[0]);
        if (matchStr === "")
          rx.lastIndex = advanceStringIndex(S2, toLength(rx.lastIndex), fullUnicode);
      }
      var accumulatedResult = "";
      var nextSourcePosition = 0;
      for (var i = 0; i < results.length; i++) {
        result = results[i];
        var matched = toString$1(result[0]);
        var position = max$1(min(toIntegerOrInfinity(result.index), S2.length), 0);
        var captures = [];
        for (var j = 1; j < result.length; j++)
          push$1(captures, maybeToString(result[j]));
        var namedCaptures = result.groups;
        if (functionalReplace) {
          var replacerArgs = concat2([matched], captures, position, S2);
          if (namedCaptures !== void 0)
            push$1(replacerArgs, namedCaptures);
          var replacement2 = toString$1(apply(replaceValue, void 0, replacerArgs));
        } else {
          replacement2 = getSubstitution(matched, S2, position, captures, namedCaptures, replaceValue);
        }
        if (position >= nextSourcePosition) {
          accumulatedResult += stringSlice(S2, nextSourcePosition, position) + replacement2;
          nextSourcePosition = position + matched.length;
        }
      }
      return accumulatedResult + stringSlice(S2, nextSourcePosition);
    }
  ];
}, !REPLACE_SUPPORTS_NAMED_GROUPS || !REPLACE_KEEPS_$0 || REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE);
var parse$3 = parse_1;
var clean = function clean2(version2, options) {
  var s2 = parse$3(version2.trim().replace(/^[=v]+/, ""), options);
  return s2 ? s2.version : null;
};
var clean_1 = clean;
var SemVer$c = semver$1;
var inc = function inc2(version2, release, options, identifier) {
  if (typeof options === "string") {
    identifier = options;
    options = void 0;
  }
  try {
    return new SemVer$c(version2, options).inc(release, identifier).version;
  } catch (er) {
    return null;
  }
};
var inc_1 = inc;
var SemVer$b = semver$1;
var compare$a = function compare(a, b2, loose) {
  return new SemVer$b(a, loose).compare(new SemVer$b(b2, loose));
};
var compare_1 = compare$a;
var compare$9 = compare_1;
var eq$2 = function eq(a, b2, loose) {
  return compare$9(a, b2, loose) === 0;
};
var eq_1 = eq$2;
var parse$2 = parse_1;
var eq$1 = eq_1;
var diff = function diff2(version1, version2) {
  if (eq$1(version1, version2)) {
    return null;
  } else {
    var v1 = parse$2(version1);
    var v2 = parse$2(version2);
    var hasPre = v1.prerelease.length || v2.prerelease.length;
    var prefix = hasPre ? "pre" : "";
    var defaultResult = hasPre ? "prerelease" : "";
    for (var key in v1) {
      if (key === "major" || key === "minor" || key === "patch") {
        if (v1[key] !== v2[key]) {
          return prefix + key;
        }
      }
    }
    return defaultResult;
  }
};
var diff_1 = diff;
var SemVer$a = semver$1;
var major = function major2(a, loose) {
  return new SemVer$a(a, loose).major;
};
var major_1 = major;
var SemVer$9 = semver$1;
var minor = function minor2(a, loose) {
  return new SemVer$9(a, loose).minor;
};
var minor_1 = minor;
var SemVer$8 = semver$1;
var patch = function patch2(a, loose) {
  return new SemVer$8(a, loose).patch;
};
var patch_1 = patch;
var parse$1 = parse_1;
var prerelease = function prerelease2(version2, options) {
  var parsed = parse$1(version2, options);
  return parsed && parsed.prerelease.length ? parsed.prerelease : null;
};
var prerelease_1 = prerelease;
var compare$8 = compare_1;
var rcompare = function rcompare2(a, b2, loose) {
  return compare$8(b2, a, loose);
};
var rcompare_1 = rcompare;
var compare$7 = compare_1;
var compareLoose = function compareLoose2(a, b2) {
  return compare$7(a, b2, true);
};
var compareLoose_1 = compareLoose;
var SemVer$7 = semver$1;
var compareBuild$2 = function compareBuild(a, b2, loose) {
  var versionA = new SemVer$7(a, loose);
  var versionB = new SemVer$7(b2, loose);
  return versionA.compare(versionB) || versionA.compareBuild(versionB);
};
var compareBuild_1 = compareBuild$2;
var tryToString$2 = tryToString$6;
var $TypeError$3 = TypeError;
var deletePropertyOrThrow$1 = function(O2, P) {
  if (!delete O2[P])
    throw $TypeError$3("Cannot delete property " + tryToString$2(P) + " of " + tryToString$2(O2));
};
var arraySlice = arraySliceSimple;
var floor = Math.floor;
var mergeSort = function(array, comparefn) {
  var length = array.length;
  var middle = floor(length / 2);
  return length < 8 ? insertionSort(array, comparefn) : merge(array, mergeSort(arraySlice(array, 0, middle), comparefn), mergeSort(arraySlice(array, middle), comparefn), comparefn);
};
var insertionSort = function(array, comparefn) {
  var length = array.length;
  var i = 1;
  var element, j;
  while (i < length) {
    j = i;
    element = array[i];
    while (j && comparefn(array[j - 1], element) > 0) {
      array[j] = array[--j];
    }
    if (j !== i++)
      array[j] = element;
  }
  return array;
};
var merge = function(array, left, right, comparefn) {
  var llength = left.length;
  var rlength = right.length;
  var lindex = 0;
  var rindex = 0;
  while (lindex < llength || rindex < rlength) {
    array[lindex + rindex] = lindex < llength && rindex < rlength ? comparefn(left[lindex], right[rindex]) <= 0 ? left[lindex++] : right[rindex++] : lindex < llength ? left[lindex++] : right[rindex++];
  }
  return array;
};
var arraySort = mergeSort;
var userAgent$1 = engineUserAgent;
var firefox = userAgent$1.match(/firefox\/(\d+)/i);
var engineFfVersion = !!firefox && +firefox[1];
var UA = engineUserAgent;
var engineIsIeOrEdge = /MSIE|Trident/.test(UA);
var userAgent = engineUserAgent;
var webkit = userAgent.match(/AppleWebKit\/(\d+)\./);
var engineWebkitVersion = !!webkit && +webkit[1];
var $$9 = _export;
var uncurryThis$4 = functionUncurryThis;
var aCallable$1 = aCallable$4;
var toObject$1 = toObject$8;
var lengthOfArrayLike$3 = lengthOfArrayLike$8;
var deletePropertyOrThrow = deletePropertyOrThrow$1;
var toString3 = toString$c;
var fails$4 = fails$w;
var internalSort = arraySort;
var arrayMethodIsStrict$3 = arrayMethodIsStrict$5;
var FF = engineFfVersion;
var IE_OR_EDGE = engineIsIeOrEdge;
var V8 = engineV8Version;
var WEBKIT = engineWebkitVersion;
var test = [];
var un$Sort = uncurryThis$4(test.sort);
var push = uncurryThis$4(test.push);
var FAILS_ON_UNDEFINED = fails$4(function() {
  test.sort(void 0);
});
var FAILS_ON_NULL = fails$4(function() {
  test.sort(null);
});
var STRICT_METHOD$3 = arrayMethodIsStrict$3("sort");
var STABLE_SORT = !fails$4(function() {
  if (V8)
    return V8 < 70;
  if (FF && FF > 3)
    return;
  if (IE_OR_EDGE)
    return true;
  if (WEBKIT)
    return WEBKIT < 603;
  var result = "";
  var code, chr, value, index;
  for (code = 65; code < 76; code++) {
    chr = String.fromCharCode(code);
    switch (code) {
      case 66:
      case 69:
      case 70:
      case 72:
        value = 3;
        break;
      case 68:
      case 71:
        value = 4;
        break;
      default:
        value = 2;
    }
    for (index = 0; index < 47; index++) {
      test.push({ k: chr + index, v: value });
    }
  }
  test.sort(function(a, b2) {
    return b2.v - a.v;
  });
  for (index = 0; index < test.length; index++) {
    chr = test[index].k.charAt(0);
    if (result.charAt(result.length - 1) !== chr)
      result += chr;
  }
  return result !== "DGBEFHACIJK";
});
var FORCED = FAILS_ON_UNDEFINED || !FAILS_ON_NULL || !STRICT_METHOD$3 || !STABLE_SORT;
var getSortCompare = function(comparefn) {
  return function(x2, y2) {
    if (y2 === void 0)
      return -1;
    if (x2 === void 0)
      return 1;
    if (comparefn !== void 0)
      return +comparefn(x2, y2) || 0;
    return toString3(x2) > toString3(y2) ? 1 : -1;
  };
};
$$9({ target: "Array", proto: true, forced: FORCED }, {
  sort: function sort(comparefn) {
    if (comparefn !== void 0)
      aCallable$1(comparefn);
    var array = toObject$1(this);
    if (STABLE_SORT)
      return comparefn === void 0 ? un$Sort(array) : un$Sort(array, comparefn);
    var items = [];
    var arrayLength = lengthOfArrayLike$3(array);
    var itemsLength, index;
    for (index = 0; index < arrayLength; index++) {
      if (index in array)
        push(items, array[index]);
    }
    internalSort(items, getSortCompare(comparefn));
    itemsLength = items.length;
    index = 0;
    while (index < itemsLength)
      array[index] = items[index++];
    while (index < arrayLength)
      deletePropertyOrThrow(array, index++);
    return array;
  }
});
var compareBuild$1 = compareBuild_1;
var sort2 = function sort3(list, loose) {
  return list.sort(function(a, b2) {
    return compareBuild$1(a, b2, loose);
  });
};
var sort_1 = sort2;
var compareBuild2 = compareBuild_1;
var rsort = function rsort2(list, loose) {
  return list.sort(function(a, b2) {
    return compareBuild2(b2, a, loose);
  });
};
var rsort_1 = rsort;
var compare$6 = compare_1;
var gt$3 = function gt(a, b2, loose) {
  return compare$6(a, b2, loose) > 0;
};
var gt_1 = gt$3;
var compare$5 = compare_1;
var lt$2 = function lt(a, b2, loose) {
  return compare$5(a, b2, loose) < 0;
};
var lt_1 = lt$2;
var compare$4 = compare_1;
var neq$1 = function neq(a, b2, loose) {
  return compare$4(a, b2, loose) !== 0;
};
var neq_1 = neq$1;
var compare$3 = compare_1;
var gte$2 = function gte(a, b2, loose) {
  return compare$3(a, b2, loose) >= 0;
};
var gte_1 = gte$2;
var compare$2 = compare_1;
var lte$2 = function lte(a, b2, loose) {
  return compare$2(a, b2, loose) <= 0;
};
var lte_1 = lte$2;
function _typeof$3(obj) {
  "@babel/helpers - typeof";
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof$3 = function _typeof2(obj2) {
      return typeof obj2;
    };
  } else {
    _typeof$3 = function _typeof2(obj2) {
      return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
    };
  }
  return _typeof$3(obj);
}
var eq2 = eq_1;
var neq2 = neq_1;
var gt$2 = gt_1;
var gte$1 = gte_1;
var lt$1 = lt_1;
var lte$1 = lte_1;
var cmp$1 = function cmp(a, op, b2, loose) {
  switch (op) {
    case "===":
      if (_typeof$3(a) === "object")
        a = a.version;
      if (_typeof$3(b2) === "object")
        b2 = b2.version;
      return a === b2;
    case "!==":
      if (_typeof$3(a) === "object")
        a = a.version;
      if (_typeof$3(b2) === "object")
        b2 = b2.version;
      return a !== b2;
    case "":
    case "=":
    case "==":
      return eq2(a, b2, loose);
    case "!=":
      return neq2(a, b2, loose);
    case ">":
      return gt$2(a, b2, loose);
    case ">=":
      return gte$1(a, b2, loose);
    case "<":
      return lt$1(a, b2, loose);
    case "<=":
      return lte$1(a, b2, loose);
    default:
      throw new TypeError("Invalid operator: ".concat(op));
  }
};
var cmp_1 = cmp$1;
var SemVer$6 = semver$1;
var parse2 = parse_1;
var _require$3 = re$5.exports, re$2 = _require$3.re, t$2 = _require$3.t;
var coerce = function coerce2(version2, options) {
  if (version2 instanceof SemVer$6) {
    return version2;
  }
  if (typeof version2 === "number") {
    version2 = String(version2);
  }
  if (typeof version2 !== "string") {
    return null;
  }
  options = options || {};
  var match2 = null;
  if (!options.rtl) {
    match2 = version2.match(re$2[t$2.COERCE]);
  } else {
    var next2;
    while ((next2 = re$2[t$2.COERCERTL].exec(version2)) && (!match2 || match2.index + match2[0].length !== version2.length)) {
      if (!match2 || next2.index + next2[0].length !== match2.index + match2[0].length) {
        match2 = next2;
      }
      re$2[t$2.COERCERTL].lastIndex = next2.index + next2[1].length + next2[2].length;
    }
    re$2[t$2.COERCERTL].lastIndex = -1;
  }
  if (match2 === null)
    return null;
  return parse2("".concat(match2[2], ".").concat(match2[3] || "0", ".").concat(match2[4] || "0"), options);
};
var coerce_1 = coerce;
var $$8 = _export;
var $every = arrayIteration.every;
var arrayMethodIsStrict$2 = arrayMethodIsStrict$5;
var STRICT_METHOD$2 = arrayMethodIsStrict$2("every");
$$8({ target: "Array", proto: true, forced: !STRICT_METHOD$2 }, {
  every: function every(callbackfn) {
    return $every(this, callbackfn, arguments.length > 1 ? arguments[1] : void 0);
  }
});
var $$7 = _export;
var $filter = arrayIteration.filter;
var arrayMethodHasSpeciesSupport$1 = arrayMethodHasSpeciesSupport$4;
var HAS_SPECIES_SUPPORT$1 = arrayMethodHasSpeciesSupport$1("filter");
$$7({ target: "Array", proto: true, forced: !HAS_SPECIES_SUPPORT$1 }, {
  filter: function filter(callbackfn) {
    return $filter(this, callbackfn, arguments.length > 1 ? arguments[1] : void 0);
  }
});
var call$3 = functionCall;
var anObject$3 = anObject$h;
var getMethod$1 = getMethod$6;
var iteratorClose$2 = function(iterator, kind, value) {
  var innerResult, innerError;
  anObject$3(iterator);
  try {
    innerResult = getMethod$1(iterator, "return");
    if (!innerResult) {
      if (kind === "throw")
        throw value;
      return value;
    }
    innerResult = call$3(innerResult, iterator);
  } catch (error) {
    innerError = true;
    innerResult = error;
  }
  if (kind === "throw")
    throw value;
  if (innerError)
    throw innerResult;
  anObject$3(innerResult);
  return value;
};
var anObject$2 = anObject$h;
var iteratorClose$1 = iteratorClose$2;
var callWithSafeIterationClosing$1 = function(iterator, fn, value, ENTRIES2) {
  try {
    return ENTRIES2 ? fn(anObject$2(value)[0], value[1]) : fn(value);
  } catch (error) {
    iteratorClose$1(iterator, "throw", error);
  }
};
var wellKnownSymbol$3 = wellKnownSymbol$o;
var Iterators$1 = iterators;
var ITERATOR$2 = wellKnownSymbol$3("iterator");
var ArrayPrototype = Array.prototype;
var isArrayIteratorMethod$2 = function(it) {
  return it !== void 0 && (Iterators$1.Array === it || ArrayPrototype[ITERATOR$2] === it);
};
var classof$1 = classof$8;
var getMethod = getMethod$6;
var Iterators = iterators;
var wellKnownSymbol$2 = wellKnownSymbol$o;
var ITERATOR$1 = wellKnownSymbol$2("iterator");
var getIteratorMethod$3 = function(it) {
  if (it != void 0)
    return getMethod(it, ITERATOR$1) || getMethod(it, "@@iterator") || Iterators[classof$1(it)];
};
var call$2 = functionCall;
var aCallable = aCallable$4;
var anObject$1 = anObject$h;
var tryToString$1 = tryToString$6;
var getIteratorMethod$2 = getIteratorMethod$3;
var $TypeError$2 = TypeError;
var getIterator$2 = function(argument, usingIterator) {
  var iteratorMethod = arguments.length < 2 ? getIteratorMethod$2(argument) : usingIterator;
  if (aCallable(iteratorMethod))
    return anObject$1(call$2(iteratorMethod, argument));
  throw $TypeError$2(tryToString$1(argument) + " is not iterable");
};
var bind$2 = functionBindContext;
var call$1 = functionCall;
var toObject = toObject$8;
var callWithSafeIterationClosing = callWithSafeIterationClosing$1;
var isArrayIteratorMethod$1 = isArrayIteratorMethod$2;
var isConstructor$1 = isConstructor$4;
var lengthOfArrayLike$2 = lengthOfArrayLike$8;
var createProperty$1 = createProperty$4;
var getIterator$1 = getIterator$2;
var getIteratorMethod$1 = getIteratorMethod$3;
var $Array$1 = Array;
var arrayFrom = function from(arrayLike) {
  var O2 = toObject(arrayLike);
  var IS_CONSTRUCTOR = isConstructor$1(this);
  var argumentsLength = arguments.length;
  var mapfn = argumentsLength > 1 ? arguments[1] : void 0;
  var mapping = mapfn !== void 0;
  if (mapping)
    mapfn = bind$2(mapfn, argumentsLength > 2 ? arguments[2] : void 0);
  var iteratorMethod = getIteratorMethod$1(O2);
  var index = 0;
  var length, result, step, iterator, next2, value;
  if (iteratorMethod && !(this === $Array$1 && isArrayIteratorMethod$1(iteratorMethod))) {
    iterator = getIterator$1(O2, iteratorMethod);
    next2 = iterator.next;
    result = IS_CONSTRUCTOR ? new this() : [];
    for (; !(step = call$1(next2, iterator)).done; index++) {
      value = mapping ? callWithSafeIterationClosing(iterator, mapfn, [step.value, index], true) : step.value;
      createProperty$1(result, index, value);
    }
  } else {
    length = lengthOfArrayLike$2(O2);
    result = IS_CONSTRUCTOR ? new this(length) : $Array$1(length);
    for (; length > index; index++) {
      value = mapping ? mapfn(O2[index], index) : O2[index];
      createProperty$1(result, index, value);
    }
  }
  result.length = index;
  return result;
};
var wellKnownSymbol$1 = wellKnownSymbol$o;
var ITERATOR = wellKnownSymbol$1("iterator");
var SAFE_CLOSING = false;
try {
  var called = 0;
  var iteratorWithReturn = {
    next: function() {
      return { done: !!called++ };
    },
    "return": function() {
      SAFE_CLOSING = true;
    }
  };
  iteratorWithReturn[ITERATOR] = function() {
    return this;
  };
  Array.from(iteratorWithReturn, function() {
    throw 2;
  });
} catch (error) {
}
var checkCorrectnessOfIteration$2 = function(exec2, SKIP_CLOSING) {
  if (!SKIP_CLOSING && !SAFE_CLOSING)
    return false;
  var ITERATION_SUPPORT = false;
  try {
    var object = {};
    object[ITERATOR] = function() {
      return {
        next: function() {
          return { done: ITERATION_SUPPORT = true };
        }
      };
    };
    exec2(object);
  } catch (error) {
  }
  return ITERATION_SUPPORT;
};
var $$6 = _export;
var from2 = arrayFrom;
var checkCorrectnessOfIteration$1 = checkCorrectnessOfIteration$2;
var INCORRECT_ITERATION = !checkCorrectnessOfIteration$1(function(iterable) {
  Array.from(iterable);
});
$$6({ target: "Array", stat: true, forced: INCORRECT_ITERATION }, {
  from: from2
});
var $$5 = _export;
var isArray$1 = isArray$5;
$$5({ target: "Array", stat: true }, {
  isArray: isArray$1
});
var $$4 = _export;
var isArray2 = isArray$5;
var isConstructor3 = isConstructor$4;
var isObject$3 = isObject$e;
var toAbsoluteIndex = toAbsoluteIndex$3;
var lengthOfArrayLike$1 = lengthOfArrayLike$8;
var toIndexedObject = toIndexedObject$9;
var createProperty = createProperty$4;
var wellKnownSymbol = wellKnownSymbol$o;
var arrayMethodHasSpeciesSupport = arrayMethodHasSpeciesSupport$4;
var un$Slice = arraySlice$3;
var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport("slice");
var SPECIES = wellKnownSymbol("species");
var $Array = Array;
var max = Math.max;
$$4({ target: "Array", proto: true, forced: !HAS_SPECIES_SUPPORT }, {
  slice: function slice(start, end) {
    var O2 = toIndexedObject(this);
    var length = lengthOfArrayLike$1(O2);
    var k2 = toAbsoluteIndex(start, length);
    var fin = toAbsoluteIndex(end === void 0 ? length : end, length);
    var Constructor, result, n;
    if (isArray2(O2)) {
      Constructor = O2.constructor;
      if (isConstructor3(Constructor) && (Constructor === $Array || isArray2(Constructor.prototype))) {
        Constructor = void 0;
      } else if (isObject$3(Constructor)) {
        Constructor = Constructor[SPECIES];
        if (Constructor === null)
          Constructor = void 0;
      }
      if (Constructor === $Array || Constructor === void 0) {
        return un$Slice(O2, k2, fin);
      }
    }
    result = new (Constructor === void 0 ? $Array : Constructor)(max(fin - k2, 0));
    for (n = 0; k2 < fin; k2++, n++)
      if (k2 in O2)
        createProperty(result, n, O2[k2]);
    result.length = n;
    return result;
  }
});
var $$3 = _export;
var $some = arrayIteration.some;
var arrayMethodIsStrict$1 = arrayMethodIsStrict$5;
var STRICT_METHOD$1 = arrayMethodIsStrict$1("some");
$$3({ target: "Array", proto: true, forced: !STRICT_METHOD$1 }, {
  some: function some(callbackfn) {
    return $some(this, callbackfn, arguments.length > 1 ? arguments[1] : void 0);
  }
});
var uncurryThis$3 = functionUncurryThis;
var defineBuiltIn$2 = defineBuiltIn$d;
var DatePrototype = Date.prototype;
var INVALID_DATE = "Invalid Date";
var TO_STRING = "toString";
var un$DateToString = uncurryThis$3(DatePrototype[TO_STRING]);
var getTime = uncurryThis$3(DatePrototype.getTime);
if (String(new Date(NaN)) != INVALID_DATE) {
  defineBuiltIn$2(DatePrototype, TO_STRING, function toString4() {
    var value = getTime(this);
    return value === value ? un$DateToString(this) : INVALID_DATE;
  });
}
var DESCRIPTORS$1 = descriptors;
var FUNCTION_NAME_EXISTS = functionName.EXISTS;
var uncurryThis$2 = functionUncurryThis;
var defineProperty$2 = objectDefineProperty.f;
var FunctionPrototype = Function.prototype;
var functionToString = uncurryThis$2(FunctionPrototype.toString);
var nameRE = /function\b(?:\s|\/\*[\S\s]*?\*\/|\/\/[^\n\r]*[\n\r]+)*([^\s(/]*)/;
var regExpExec = uncurryThis$2(nameRE.exec);
var NAME = "name";
if (DESCRIPTORS$1 && !FUNCTION_NAME_EXISTS) {
  defineProperty$2(FunctionPrototype, NAME, {
    configurable: true,
    get: function() {
      try {
        return regExpExec(nameRE, functionToString(this))[1];
      } catch (error) {
        return "";
      }
    }
  });
}
var internalMetadata = { exports: {} };
var fails$3 = fails$w;
var arrayBufferNonExtensible = fails$3(function() {
  if (typeof ArrayBuffer == "function") {
    var buffer = new ArrayBuffer(8);
    if (Object.isExtensible(buffer))
      Object.defineProperty(buffer, "a", { value: 8 });
  }
});
var fails$2 = fails$w;
var isObject$2 = isObject$e;
var classof = classofRaw$1;
var ARRAY_BUFFER_NON_EXTENSIBLE = arrayBufferNonExtensible;
var $isExtensible = Object.isExtensible;
var FAILS_ON_PRIMITIVES = fails$2(function() {
  $isExtensible(1);
});
var objectIsExtensible = FAILS_ON_PRIMITIVES || ARRAY_BUFFER_NON_EXTENSIBLE ? function isExtensible(it) {
  if (!isObject$2(it))
    return false;
  if (ARRAY_BUFFER_NON_EXTENSIBLE && classof(it) == "ArrayBuffer")
    return false;
  return $isExtensible ? $isExtensible(it) : true;
} : $isExtensible;
var fails$1 = fails$w;
var freezing = !fails$1(function() {
  return Object.isExtensible(Object.preventExtensions({}));
});
var $$2 = _export;
var uncurryThis$1 = functionUncurryThis;
var hiddenKeys = hiddenKeys$6;
var isObject$1 = isObject$e;
var hasOwn2 = hasOwnProperty_1;
var defineProperty$1 = objectDefineProperty.f;
var getOwnPropertyNamesModule = objectGetOwnPropertyNames;
var getOwnPropertyNamesExternalModule = objectGetOwnPropertyNamesExternal;
var isExtensible2 = objectIsExtensible;
var uid = uid$4;
var FREEZING = freezing;
var REQUIRED = false;
var METADATA = uid("meta");
var id = 0;
var setMetadata = function(it) {
  defineProperty$1(it, METADATA, { value: {
    objectID: "O" + id++,
    weakData: {}
  } });
};
var fastKey$1 = function(it, create4) {
  if (!isObject$1(it))
    return typeof it == "symbol" ? it : (typeof it == "string" ? "S" : "P") + it;
  if (!hasOwn2(it, METADATA)) {
    if (!isExtensible2(it))
      return "F";
    if (!create4)
      return "E";
    setMetadata(it);
  }
  return it[METADATA].objectID;
};
var getWeakData = function(it, create4) {
  if (!hasOwn2(it, METADATA)) {
    if (!isExtensible2(it))
      return true;
    if (!create4)
      return false;
    setMetadata(it);
  }
  return it[METADATA].weakData;
};
var onFreeze = function(it) {
  if (FREEZING && REQUIRED && isExtensible2(it) && !hasOwn2(it, METADATA))
    setMetadata(it);
  return it;
};
var enable = function() {
  meta.enable = function() {
  };
  REQUIRED = true;
  var getOwnPropertyNames5 = getOwnPropertyNamesModule.f;
  var splice = uncurryThis$1([].splice);
  var test2 = {};
  test2[METADATA] = 1;
  if (getOwnPropertyNames5(test2).length) {
    getOwnPropertyNamesModule.f = function(it) {
      var result = getOwnPropertyNames5(it);
      for (var i = 0, length = result.length; i < length; i++) {
        if (result[i] === METADATA) {
          splice(result, i, 1);
          break;
        }
      }
      return result;
    };
    $$2({ target: "Object", stat: true, forced: true }, {
      getOwnPropertyNames: getOwnPropertyNamesExternalModule.f
    });
  }
};
var meta = internalMetadata.exports = {
  enable,
  fastKey: fastKey$1,
  getWeakData,
  onFreeze
};
hiddenKeys[METADATA] = true;
var bind$1 = functionBindContext;
var call = functionCall;
var anObject = anObject$h;
var tryToString = tryToString$6;
var isArrayIteratorMethod = isArrayIteratorMethod$2;
var lengthOfArrayLike = lengthOfArrayLike$8;
var isPrototypeOf$1 = objectIsPrototypeOf;
var getIterator = getIterator$2;
var getIteratorMethod = getIteratorMethod$3;
var iteratorClose = iteratorClose$2;
var $TypeError$1 = TypeError;
var Result = function(stopped, result) {
  this.stopped = stopped;
  this.result = result;
};
var ResultPrototype = Result.prototype;
var iterate$2 = function(iterable, unboundFunction, options) {
  var that = options && options.that;
  var AS_ENTRIES = !!(options && options.AS_ENTRIES);
  var IS_ITERATOR = !!(options && options.IS_ITERATOR);
  var INTERRUPTED = !!(options && options.INTERRUPTED);
  var fn = bind$1(unboundFunction, that);
  var iterator, iterFn, index, length, result, next2, step;
  var stop = function(condition) {
    if (iterator)
      iteratorClose(iterator, "normal", condition);
    return new Result(true, condition);
  };
  var callFn = function(value) {
    if (AS_ENTRIES) {
      anObject(value);
      return INTERRUPTED ? fn(value[0], value[1], stop) : fn(value[0], value[1]);
    }
    return INTERRUPTED ? fn(value, stop) : fn(value);
  };
  if (IS_ITERATOR) {
    iterator = iterable;
  } else {
    iterFn = getIteratorMethod(iterable);
    if (!iterFn)
      throw $TypeError$1(tryToString(iterable) + " is not iterable");
    if (isArrayIteratorMethod(iterFn)) {
      for (index = 0, length = lengthOfArrayLike(iterable); length > index; index++) {
        result = callFn(iterable[index]);
        if (result && isPrototypeOf$1(ResultPrototype, result))
          return result;
      }
      return new Result(false);
    }
    iterator = getIterator(iterable, iterFn);
  }
  next2 = iterator.next;
  while (!(step = call(next2, iterator)).done) {
    try {
      result = callFn(step.value);
    } catch (error) {
      iteratorClose(iterator, "throw", error);
    }
    if (typeof result == "object" && result && isPrototypeOf$1(ResultPrototype, result))
      return result;
  }
  return new Result(false);
};
var isPrototypeOf = objectIsPrototypeOf;
var $TypeError = TypeError;
var anInstance$2 = function(it, Prototype) {
  if (isPrototypeOf(Prototype, it))
    return it;
  throw $TypeError("Incorrect invocation");
};
var $$1 = _export;
var global$1 = global$k;
var uncurryThis = functionUncurryThis;
var isForced = isForced_1;
var defineBuiltIn$1 = defineBuiltIn$d;
var InternalMetadataModule = internalMetadata.exports;
var iterate$1 = iterate$2;
var anInstance$1 = anInstance$2;
var isCallable = isCallable$m;
var isObject = isObject$e;
var fails = fails$w;
var checkCorrectnessOfIteration = checkCorrectnessOfIteration$2;
var setToStringTag = setToStringTag$4;
var inheritIfRequired = inheritIfRequired$3;
var collection$2 = function(CONSTRUCTOR_NAME, wrapper, common) {
  var IS_MAP = CONSTRUCTOR_NAME.indexOf("Map") !== -1;
  var IS_WEAK = CONSTRUCTOR_NAME.indexOf("Weak") !== -1;
  var ADDER = IS_MAP ? "set" : "add";
  var NativeConstructor = global$1[CONSTRUCTOR_NAME];
  var NativePrototype = NativeConstructor && NativeConstructor.prototype;
  var Constructor = NativeConstructor;
  var exported = {};
  var fixMethod = function(KEY) {
    var uncurriedNativeMethod = uncurryThis(NativePrototype[KEY]);
    defineBuiltIn$1(NativePrototype, KEY, KEY == "add" ? function add(value) {
      uncurriedNativeMethod(this, value === 0 ? 0 : value);
      return this;
    } : KEY == "delete" ? function(key) {
      return IS_WEAK && !isObject(key) ? false : uncurriedNativeMethod(this, key === 0 ? 0 : key);
    } : KEY == "get" ? function get2(key) {
      return IS_WEAK && !isObject(key) ? void 0 : uncurriedNativeMethod(this, key === 0 ? 0 : key);
    } : KEY == "has" ? function has2(key) {
      return IS_WEAK && !isObject(key) ? false : uncurriedNativeMethod(this, key === 0 ? 0 : key);
    } : function set2(key, value) {
      uncurriedNativeMethod(this, key === 0 ? 0 : key, value);
      return this;
    });
  };
  var REPLACE2 = isForced(CONSTRUCTOR_NAME, !isCallable(NativeConstructor) || !(IS_WEAK || NativePrototype.forEach && !fails(function() {
    new NativeConstructor().entries().next();
  })));
  if (REPLACE2) {
    Constructor = common.getConstructor(wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER);
    InternalMetadataModule.enable();
  } else if (isForced(CONSTRUCTOR_NAME, true)) {
    var instance = new Constructor();
    var HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance;
    var THROWS_ON_PRIMITIVES = fails(function() {
      instance.has(1);
    });
    var ACCEPT_ITERABLES = checkCorrectnessOfIteration(function(iterable) {
      new NativeConstructor(iterable);
    });
    var BUGGY_ZERO = !IS_WEAK && fails(function() {
      var $instance = new NativeConstructor();
      var index = 5;
      while (index--)
        $instance[ADDER](index, index);
      return !$instance.has(-0);
    });
    if (!ACCEPT_ITERABLES) {
      Constructor = wrapper(function(dummy, iterable) {
        anInstance$1(dummy, NativePrototype);
        var that = inheritIfRequired(new NativeConstructor(), dummy, Constructor);
        if (iterable != void 0)
          iterate$1(iterable, that[ADDER], { that, AS_ENTRIES: IS_MAP });
        return that;
      });
      Constructor.prototype = NativePrototype;
      NativePrototype.constructor = Constructor;
    }
    if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
      fixMethod("delete");
      fixMethod("has");
      IS_MAP && fixMethod("get");
    }
    if (BUGGY_ZERO || HASNT_CHAINING)
      fixMethod(ADDER);
    if (IS_WEAK && NativePrototype.clear)
      delete NativePrototype.clear;
  }
  exported[CONSTRUCTOR_NAME] = Constructor;
  $$1({ global: true, constructor: true, forced: Constructor != NativeConstructor }, exported);
  setToStringTag(Constructor, CONSTRUCTOR_NAME);
  if (!IS_WEAK)
    common.setStrong(Constructor, CONSTRUCTOR_NAME, IS_MAP);
  return Constructor;
};
var defineBuiltIn = defineBuiltIn$d;
var defineBuiltIns$1 = function(target, src, options) {
  for (var key in src)
    defineBuiltIn(target, key, src[key], options);
  return target;
};
var defineProperty4 = objectDefineProperty.f;
var create3 = objectCreate;
var defineBuiltIns = defineBuiltIns$1;
var bind = functionBindContext;
var anInstance = anInstance$2;
var iterate = iterate$2;
var defineIterator = defineIterator$3;
var setSpecies = setSpecies$2;
var DESCRIPTORS = descriptors;
var fastKey = internalMetadata.exports.fastKey;
var InternalStateModule = internalState;
var setInternalState = InternalStateModule.set;
var internalStateGetterFor = InternalStateModule.getterFor;
var collectionStrong$2 = {
  getConstructor: function(wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER) {
    var Constructor = wrapper(function(that, iterable) {
      anInstance(that, Prototype);
      setInternalState(that, {
        type: CONSTRUCTOR_NAME,
        index: create3(null),
        first: void 0,
        last: void 0,
        size: 0
      });
      if (!DESCRIPTORS)
        that.size = 0;
      if (iterable != void 0)
        iterate(iterable, that[ADDER], { that, AS_ENTRIES: IS_MAP });
    });
    var Prototype = Constructor.prototype;
    var getInternalState2 = internalStateGetterFor(CONSTRUCTOR_NAME);
    var define = function(that, key, value) {
      var state = getInternalState2(that);
      var entry = getEntry(that, key);
      var previous, index;
      if (entry) {
        entry.value = value;
      } else {
        state.last = entry = {
          index: index = fastKey(key, true),
          key,
          value,
          previous: previous = state.last,
          next: void 0,
          removed: false
        };
        if (!state.first)
          state.first = entry;
        if (previous)
          previous.next = entry;
        if (DESCRIPTORS)
          state.size++;
        else
          that.size++;
        if (index !== "F")
          state.index[index] = entry;
      }
      return that;
    };
    var getEntry = function(that, key) {
      var state = getInternalState2(that);
      var index = fastKey(key);
      var entry;
      if (index !== "F")
        return state.index[index];
      for (entry = state.first; entry; entry = entry.next) {
        if (entry.key == key)
          return entry;
      }
    };
    defineBuiltIns(Prototype, {
      clear: function clear() {
        var that = this;
        var state = getInternalState2(that);
        var data2 = state.index;
        var entry = state.first;
        while (entry) {
          entry.removed = true;
          if (entry.previous)
            entry.previous = entry.previous.next = void 0;
          delete data2[entry.index];
          entry = entry.next;
        }
        state.first = state.last = void 0;
        if (DESCRIPTORS)
          state.size = 0;
        else
          that.size = 0;
      },
      "delete": function(key) {
        var that = this;
        var state = getInternalState2(that);
        var entry = getEntry(that, key);
        if (entry) {
          var next2 = entry.next;
          var prev = entry.previous;
          delete state.index[entry.index];
          entry.removed = true;
          if (prev)
            prev.next = next2;
          if (next2)
            next2.previous = prev;
          if (state.first == entry)
            state.first = next2;
          if (state.last == entry)
            state.last = prev;
          if (DESCRIPTORS)
            state.size--;
          else
            that.size--;
        }
        return !!entry;
      },
      forEach: function forEach3(callbackfn) {
        var state = getInternalState2(this);
        var boundFunction = bind(callbackfn, arguments.length > 1 ? arguments[1] : void 0);
        var entry;
        while (entry = entry ? entry.next : state.first) {
          boundFunction(entry.value, entry.key, this);
          while (entry && entry.removed)
            entry = entry.previous;
        }
      },
      has: function has2(key) {
        return !!getEntry(this, key);
      }
    });
    defineBuiltIns(Prototype, IS_MAP ? {
      get: function get2(key) {
        var entry = getEntry(this, key);
        return entry && entry.value;
      },
      set: function set2(key, value) {
        return define(this, key === 0 ? 0 : key, value);
      }
    } : {
      add: function add(value) {
        return define(this, value = value === 0 ? 0 : value, value);
      }
    });
    if (DESCRIPTORS)
      defineProperty4(Prototype, "size", {
        get: function() {
          return getInternalState2(this).size;
        }
      });
    return Constructor;
  },
  setStrong: function(Constructor, CONSTRUCTOR_NAME, IS_MAP) {
    var ITERATOR_NAME = CONSTRUCTOR_NAME + " Iterator";
    var getInternalCollectionState = internalStateGetterFor(CONSTRUCTOR_NAME);
    var getInternalIteratorState = internalStateGetterFor(ITERATOR_NAME);
    defineIterator(Constructor, CONSTRUCTOR_NAME, function(iterated, kind) {
      setInternalState(this, {
        type: ITERATOR_NAME,
        target: iterated,
        state: getInternalCollectionState(iterated),
        kind,
        last: void 0
      });
    }, function() {
      var state = getInternalIteratorState(this);
      var kind = state.kind;
      var entry = state.last;
      while (entry && entry.removed)
        entry = entry.previous;
      if (!state.target || !(state.last = entry = entry ? entry.next : state.state.first)) {
        state.target = void 0;
        return { value: void 0, done: true };
      }
      if (kind == "keys")
        return { value: entry.key, done: false };
      if (kind == "values")
        return { value: entry.value, done: false };
      return { value: [entry.key, entry.value], done: false };
    }, IS_MAP ? "entries" : "values", !IS_MAP, true);
    setSpecies(CONSTRUCTOR_NAME);
  }
};
var collection$1 = collection$2;
var collectionStrong$1 = collectionStrong$2;
collection$1("Map", function(init2) {
  return function Map2() {
    return init2(this, arguments.length ? arguments[0] : void 0);
  };
}, collectionStrong$1);
function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray$2(arr) || _nonIterableSpread();
}
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter))
    return Array.from(iter);
}
function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr))
    return _arrayLikeToArray$2(arr);
}
function _createForOfIteratorHelper$2(o2) {
  if (typeof Symbol === "undefined" || o2[Symbol.iterator] == null) {
    if (Array.isArray(o2) || (o2 = _unsupportedIterableToArray$2(o2))) {
      var i = 0;
      var F = function F2() {
      };
      return { s: F, n: function n() {
        if (i >= o2.length)
          return { done: true };
        return { done: false, value: o2[i++] };
      }, e: function e(_e) {
        throw _e;
      }, f: F };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var it, normalCompletion = true, didErr = false, err;
  return { s: function s2() {
    it = o2[Symbol.iterator]();
  }, n: function n() {
    var step = it.next();
    normalCompletion = step.done;
    return step;
  }, e: function e(_e2) {
    didErr = true;
    err = _e2;
  }, f: function f() {
    try {
      if (!normalCompletion && it["return"] != null)
        it["return"]();
    } finally {
      if (didErr)
        throw err;
    }
  } };
}
function _unsupportedIterableToArray$2(o2, minLen) {
  if (!o2)
    return;
  if (typeof o2 === "string")
    return _arrayLikeToArray$2(o2, minLen);
  var n = Object.prototype.toString.call(o2).slice(8, -1);
  if (n === "Object" && o2.constructor)
    n = o2.constructor.name;
  if (n === "Map" || n === "Set")
    return Array.from(o2);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray$2(o2, minLen);
}
function _arrayLikeToArray$2(arr, len) {
  if (len == null || len > arr.length)
    len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}
function _typeof$2(obj) {
  "@babel/helpers - typeof";
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof$2 = function _typeof2(obj2) {
      return typeof obj2;
    };
  } else {
    _typeof$2 = function _typeof2(obj2) {
      return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
    };
  }
  return _typeof$2(obj);
}
function _classCallCheck$1(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties$1(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass$1(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties$1(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties$1(Constructor, staticProps);
  return Constructor;
}
var Range$a = /* @__PURE__ */ function() {
  function Range2(range2, options) {
    var _this = this;
    _classCallCheck$1(this, Range2);
    if (!options || _typeof$2(options) !== "object") {
      options = {
        loose: !!options,
        includePrerelease: false
      };
    }
    if (range2 instanceof Range2) {
      if (range2.loose === !!options.loose && range2.includePrerelease === !!options.includePrerelease) {
        return range2;
      } else {
        return new Range2(range2.raw, options);
      }
    }
    if (range2 instanceof Comparator$2) {
      this.raw = range2.value;
      this.set = [[range2]];
      this.format();
      return this;
    }
    this.options = options;
    this.loose = !!options.loose;
    this.includePrerelease = !!options.includePrerelease;
    this.raw = range2;
    this.set = range2.split(/\s*\|\|\s*/).map(function(range3) {
      return _this.parseRange(range3.trim());
    }).filter(function(c3) {
      return c3.length;
    });
    if (!this.set.length) {
      throw new TypeError("Invalid SemVer Range: ".concat(range2));
    }
    if (this.set.length > 1) {
      var first = this.set[0];
      this.set = this.set.filter(function(c3) {
        return !isNullSet(c3[0]);
      });
      if (this.set.length === 0)
        this.set = [first];
      else if (this.set.length > 1) {
        var _iterator = _createForOfIteratorHelper$2(this.set), _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done; ) {
            var c2 = _step.value;
            if (c2.length === 1 && isAny(c2[0])) {
              this.set = [c2];
              break;
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
    }
    this.format();
  }
  _createClass$1(Range2, [{
    key: "format",
    value: function format2() {
      this.range = this.set.map(function(comps) {
        return comps.join(" ").trim();
      }).join("||").trim();
      return this.range;
    }
  }, {
    key: "toString",
    value: function toString4() {
      return this.range;
    }
  }, {
    key: "parseRange",
    value: function parseRange(range2) {
      var _this2 = this;
      var loose = this.options.loose;
      range2 = range2.trim();
      var hr = loose ? re$1[t$1.HYPHENRANGELOOSE] : re$1[t$1.HYPHENRANGE];
      range2 = range2.replace(hr, hyphenReplace(this.options.includePrerelease));
      debug$1("hyphen replace", range2);
      range2 = range2.replace(re$1[t$1.COMPARATORTRIM], comparatorTrimReplace);
      debug$1("comparator trim", range2, re$1[t$1.COMPARATORTRIM]);
      range2 = range2.replace(re$1[t$1.TILDETRIM], tildeTrimReplace);
      range2 = range2.replace(re$1[t$1.CARETTRIM], caretTrimReplace);
      range2 = range2.split(/\s+/).join(" ");
      var compRe = loose ? re$1[t$1.COMPARATORLOOSE] : re$1[t$1.COMPARATOR];
      var rangeList = range2.split(" ").map(function(comp2) {
        return parseComparator(comp2, _this2.options);
      }).join(" ").split(/\s+/).map(function(comp2) {
        return replaceGTE0(comp2, _this2.options);
      }).filter(this.options.loose ? function(comp2) {
        return !!comp2.match(compRe);
      } : function() {
        return true;
      }).map(function(comp2) {
        return new Comparator$2(comp2, _this2.options);
      });
      rangeList.length;
      var rangeMap = /* @__PURE__ */ new Map();
      var _iterator2 = _createForOfIteratorHelper$2(rangeList), _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done; ) {
          var comp = _step2.value;
          if (isNullSet(comp))
            return [comp];
          rangeMap.set(comp.value, comp);
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
      if (rangeMap.size > 1 && rangeMap.has(""))
        rangeMap["delete"]("");
      return _toConsumableArray(rangeMap.values());
    }
  }, {
    key: "intersects",
    value: function intersects3(range2, options) {
      if (!(range2 instanceof Range2)) {
        throw new TypeError("a Range is required");
      }
      return this.set.some(function(thisComparators) {
        return isSatisfiable(thisComparators, options) && range2.set.some(function(rangeComparators) {
          return isSatisfiable(rangeComparators, options) && thisComparators.every(function(thisComparator) {
            return rangeComparators.every(function(rangeComparator) {
              return thisComparator.intersects(rangeComparator, options);
            });
          });
        });
      });
    }
  }, {
    key: "test",
    value: function test2(version2) {
      if (!version2) {
        return false;
      }
      if (typeof version2 === "string") {
        try {
          version2 = new SemVer$5(version2, this.options);
        } catch (er) {
          return false;
        }
      }
      for (var i = 0; i < this.set.length; i++) {
        if (testSet(this.set[i], version2, this.options)) {
          return true;
        }
      }
      return false;
    }
  }]);
  return Range2;
}();
var range = Range$a;
var Comparator$2 = comparator;
var debug$1 = debug_1;
var SemVer$5 = semver$1;
var _require$2 = re$5.exports, re$1 = _require$2.re, t$1 = _require$2.t, comparatorTrimReplace = _require$2.comparatorTrimReplace, tildeTrimReplace = _require$2.tildeTrimReplace, caretTrimReplace = _require$2.caretTrimReplace;
var isNullSet = function isNullSet2(c2) {
  return c2.value === "<0.0.0-0";
};
var isAny = function isAny2(c2) {
  return c2.value === "";
};
var isSatisfiable = function isSatisfiable2(comparators, options) {
  var result = true;
  var remainingComparators = comparators.slice();
  var testComparator = remainingComparators.pop();
  while (result && remainingComparators.length) {
    result = remainingComparators.every(function(otherComparator) {
      return testComparator.intersects(otherComparator, options);
    });
    testComparator = remainingComparators.pop();
  }
  return result;
};
var parseComparator = function parseComparator2(comp, options) {
  debug$1("comp", comp, options);
  comp = replaceCarets(comp, options);
  debug$1("caret", comp);
  comp = replaceTildes(comp, options);
  debug$1("tildes", comp);
  comp = replaceXRanges(comp, options);
  debug$1("xrange", comp);
  comp = replaceStars(comp, options);
  debug$1("stars", comp);
  return comp;
};
var isX = function isX2(id2) {
  return !id2 || id2.toLowerCase() === "x" || id2 === "*";
};
var replaceTildes = function replaceTildes2(comp, options) {
  return comp.trim().split(/\s+/).map(function(comp2) {
    return replaceTilde(comp2, options);
  }).join(" ");
};
var replaceTilde = function replaceTilde2(comp, options) {
  var r = options.loose ? re$1[t$1.TILDELOOSE] : re$1[t$1.TILDE];
  return comp.replace(r, function(_, M2, m, p, pr) {
    debug$1("tilde", comp, _, M2, m, p, pr);
    var ret;
    if (isX(M2)) {
      ret = "";
    } else if (isX(m)) {
      ret = ">=".concat(M2, ".0.0 <").concat(+M2 + 1, ".0.0-0");
    } else if (isX(p)) {
      ret = ">=".concat(M2, ".").concat(m, ".0 <").concat(M2, ".").concat(+m + 1, ".0-0");
    } else if (pr) {
      debug$1("replaceTilde pr", pr);
      ret = ">=".concat(M2, ".").concat(m, ".").concat(p, "-").concat(pr, " <").concat(M2, ".").concat(+m + 1, ".0-0");
    } else {
      ret = ">=".concat(M2, ".").concat(m, ".").concat(p, " <").concat(M2, ".").concat(+m + 1, ".0-0");
    }
    debug$1("tilde return", ret);
    return ret;
  });
};
var replaceCarets = function replaceCarets2(comp, options) {
  return comp.trim().split(/\s+/).map(function(comp2) {
    return replaceCaret(comp2, options);
  }).join(" ");
};
var replaceCaret = function replaceCaret2(comp, options) {
  debug$1("caret", comp, options);
  var r = options.loose ? re$1[t$1.CARETLOOSE] : re$1[t$1.CARET];
  var z = options.includePrerelease ? "-0" : "";
  return comp.replace(r, function(_, M2, m, p, pr) {
    debug$1("caret", comp, _, M2, m, p, pr);
    var ret;
    if (isX(M2)) {
      ret = "";
    } else if (isX(m)) {
      ret = ">=".concat(M2, ".0.0").concat(z, " <").concat(+M2 + 1, ".0.0-0");
    } else if (isX(p)) {
      if (M2 === "0") {
        ret = ">=".concat(M2, ".").concat(m, ".0").concat(z, " <").concat(M2, ".").concat(+m + 1, ".0-0");
      } else {
        ret = ">=".concat(M2, ".").concat(m, ".0").concat(z, " <").concat(+M2 + 1, ".0.0-0");
      }
    } else if (pr) {
      debug$1("replaceCaret pr", pr);
      if (M2 === "0") {
        if (m === "0") {
          ret = ">=".concat(M2, ".").concat(m, ".").concat(p, "-").concat(pr, " <").concat(M2, ".").concat(m, ".").concat(+p + 1, "-0");
        } else {
          ret = ">=".concat(M2, ".").concat(m, ".").concat(p, "-").concat(pr, " <").concat(M2, ".").concat(+m + 1, ".0-0");
        }
      } else {
        ret = ">=".concat(M2, ".").concat(m, ".").concat(p, "-").concat(pr, " <").concat(+M2 + 1, ".0.0-0");
      }
    } else {
      debug$1("no pr");
      if (M2 === "0") {
        if (m === "0") {
          ret = ">=".concat(M2, ".").concat(m, ".").concat(p).concat(z, " <").concat(M2, ".").concat(m, ".").concat(+p + 1, "-0");
        } else {
          ret = ">=".concat(M2, ".").concat(m, ".").concat(p).concat(z, " <").concat(M2, ".").concat(+m + 1, ".0-0");
        }
      } else {
        ret = ">=".concat(M2, ".").concat(m, ".").concat(p, " <").concat(+M2 + 1, ".0.0-0");
      }
    }
    debug$1("caret return", ret);
    return ret;
  });
};
var replaceXRanges = function replaceXRanges2(comp, options) {
  debug$1("replaceXRanges", comp, options);
  return comp.split(/\s+/).map(function(comp2) {
    return replaceXRange(comp2, options);
  }).join(" ");
};
var replaceXRange = function replaceXRange2(comp, options) {
  comp = comp.trim();
  var r = options.loose ? re$1[t$1.XRANGELOOSE] : re$1[t$1.XRANGE];
  return comp.replace(r, function(ret, gtlt, M2, m, p, pr) {
    debug$1("xRange", comp, ret, gtlt, M2, m, p, pr);
    var xM = isX(M2);
    var xm = xM || isX(m);
    var xp = xm || isX(p);
    var anyX = xp;
    if (gtlt === "=" && anyX) {
      gtlt = "";
    }
    pr = options.includePrerelease ? "-0" : "";
    if (xM) {
      if (gtlt === ">" || gtlt === "<") {
        ret = "<0.0.0-0";
      } else {
        ret = "*";
      }
    } else if (gtlt && anyX) {
      if (xm) {
        m = 0;
      }
      p = 0;
      if (gtlt === ">") {
        gtlt = ">=";
        if (xm) {
          M2 = +M2 + 1;
          m = 0;
          p = 0;
        } else {
          m = +m + 1;
          p = 0;
        }
      } else if (gtlt === "<=") {
        gtlt = "<";
        if (xm) {
          M2 = +M2 + 1;
        } else {
          m = +m + 1;
        }
      }
      if (gtlt === "<")
        pr = "-0";
      ret = "".concat(gtlt + M2, ".").concat(m, ".").concat(p).concat(pr);
    } else if (xm) {
      ret = ">=".concat(M2, ".0.0").concat(pr, " <").concat(+M2 + 1, ".0.0-0");
    } else if (xp) {
      ret = ">=".concat(M2, ".").concat(m, ".0").concat(pr, " <").concat(M2, ".").concat(+m + 1, ".0-0");
    }
    debug$1("xRange return", ret);
    return ret;
  });
};
var replaceStars = function replaceStars2(comp, options) {
  debug$1("replaceStars", comp, options);
  return comp.trim().replace(re$1[t$1.STAR], "");
};
var replaceGTE0 = function replaceGTE02(comp, options) {
  debug$1("replaceGTE0", comp, options);
  return comp.trim().replace(re$1[options.includePrerelease ? t$1.GTE0PRE : t$1.GTE0], "");
};
var hyphenReplace = function hyphenReplace2(incPr) {
  return function($0, from3, fM, fm, fp, fpr, fb, to, tM, tm, tp, tpr, tb) {
    if (isX(fM)) {
      from3 = "";
    } else if (isX(fm)) {
      from3 = ">=".concat(fM, ".0.0").concat(incPr ? "-0" : "");
    } else if (isX(fp)) {
      from3 = ">=".concat(fM, ".").concat(fm, ".0").concat(incPr ? "-0" : "");
    } else if (fpr) {
      from3 = ">=".concat(from3);
    } else {
      from3 = ">=".concat(from3).concat(incPr ? "-0" : "");
    }
    if (isX(tM)) {
      to = "";
    } else if (isX(tm)) {
      to = "<".concat(+tM + 1, ".0.0-0");
    } else if (isX(tp)) {
      to = "<".concat(tM, ".").concat(+tm + 1, ".0-0");
    } else if (tpr) {
      to = "<=".concat(tM, ".").concat(tm, ".").concat(tp, "-").concat(tpr);
    } else if (incPr) {
      to = "<".concat(tM, ".").concat(tm, ".").concat(+tp + 1, "-0");
    } else {
      to = "<=".concat(to);
    }
    return "".concat(from3, " ").concat(to).trim();
  };
};
var testSet = function testSet2(set2, version2, options) {
  for (var i = 0; i < set2.length; i++) {
    if (!set2[i].test(version2)) {
      return false;
    }
  }
  if (version2.prerelease.length && !options.includePrerelease) {
    for (var _i = 0; _i < set2.length; _i++) {
      debug$1(set2[_i].semver);
      if (set2[_i].semver === Comparator$2.ANY) {
        continue;
      }
      if (set2[_i].semver.prerelease.length > 0) {
        var allowed = set2[_i].semver;
        if (allowed.major === version2.major && allowed.minor === version2.minor && allowed.patch === version2.patch) {
          return true;
        }
      }
    }
    return false;
  }
  return true;
};
function _typeof$1(obj) {
  "@babel/helpers - typeof";
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof$1 = function _typeof2(obj2) {
      return typeof obj2;
    };
  } else {
    _typeof$1 = function _typeof2(obj2) {
      return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
    };
  }
  return _typeof$1(obj);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties(Constructor, staticProps);
  return Constructor;
}
var ANY$2 = Symbol("SemVer ANY");
var Comparator$1 = /* @__PURE__ */ function() {
  _createClass(Comparator2, null, [{
    key: "ANY",
    get: function get2() {
      return ANY$2;
    }
  }]);
  function Comparator2(comp, options) {
    _classCallCheck(this, Comparator2);
    if (!options || _typeof$1(options) !== "object") {
      options = {
        loose: !!options,
        includePrerelease: false
      };
    }
    if (comp instanceof Comparator2) {
      if (comp.loose === !!options.loose) {
        return comp;
      } else {
        comp = comp.value;
      }
    }
    debug("comparator", comp, options);
    this.options = options;
    this.loose = !!options.loose;
    this.parse(comp);
    if (this.semver === ANY$2) {
      this.value = "";
    } else {
      this.value = this.operator + this.semver.version;
    }
    debug("comp", this);
  }
  _createClass(Comparator2, [{
    key: "parse",
    value: function parse3(comp) {
      var r = this.options.loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR];
      var m = comp.match(r);
      if (!m) {
        throw new TypeError("Invalid comparator: ".concat(comp));
      }
      this.operator = m[1] !== void 0 ? m[1] : "";
      if (this.operator === "=") {
        this.operator = "";
      }
      if (!m[2]) {
        this.semver = ANY$2;
      } else {
        this.semver = new SemVer$4(m[2], this.options.loose);
      }
    }
  }, {
    key: "toString",
    value: function toString4() {
      return this.value;
    }
  }, {
    key: "test",
    value: function test2(version2) {
      debug("Comparator.test", version2, this.options.loose);
      if (this.semver === ANY$2 || version2 === ANY$2) {
        return true;
      }
      if (typeof version2 === "string") {
        try {
          version2 = new SemVer$4(version2, this.options);
        } catch (er) {
          return false;
        }
      }
      return cmp2(version2, this.operator, this.semver, this.options);
    }
  }, {
    key: "intersects",
    value: function intersects3(comp, options) {
      if (!(comp instanceof Comparator2)) {
        throw new TypeError("a Comparator is required");
      }
      if (!options || _typeof$1(options) !== "object") {
        options = {
          loose: !!options,
          includePrerelease: false
        };
      }
      if (this.operator === "") {
        if (this.value === "") {
          return true;
        }
        return new Range$9(comp.value, options).test(this.value);
      } else if (comp.operator === "") {
        if (comp.value === "") {
          return true;
        }
        return new Range$9(this.value, options).test(comp.semver);
      }
      var sameDirectionIncreasing = (this.operator === ">=" || this.operator === ">") && (comp.operator === ">=" || comp.operator === ">");
      var sameDirectionDecreasing = (this.operator === "<=" || this.operator === "<") && (comp.operator === "<=" || comp.operator === "<");
      var sameSemVer = this.semver.version === comp.semver.version;
      var differentDirectionsInclusive = (this.operator === ">=" || this.operator === "<=") && (comp.operator === ">=" || comp.operator === "<=");
      var oppositeDirectionsLessThan = cmp2(this.semver, "<", comp.semver, options) && (this.operator === ">=" || this.operator === ">") && (comp.operator === "<=" || comp.operator === "<");
      var oppositeDirectionsGreaterThan = cmp2(this.semver, ">", comp.semver, options) && (this.operator === "<=" || this.operator === "<") && (comp.operator === ">=" || comp.operator === ">");
      return sameDirectionIncreasing || sameDirectionDecreasing || sameSemVer && differentDirectionsInclusive || oppositeDirectionsLessThan || oppositeDirectionsGreaterThan;
    }
  }]);
  return Comparator2;
}();
var comparator = Comparator$1;
var _require$1 = re$5.exports, re = _require$1.re, t = _require$1.t;
var cmp2 = cmp_1;
var debug = debug_1;
var SemVer$4 = semver$1;
var Range$9 = range;
var Range$8 = range;
var satisfies$3 = function satisfies(version2, range2, options) {
  try {
    range2 = new Range$8(range2, options);
  } catch (er) {
    return false;
  }
  return range2.test(version2);
};
var satisfies_1 = satisfies$3;
var Range$7 = range;
var toComparators = function toComparators2(range2, options) {
  return new Range$7(range2, options).set.map(function(comp) {
    return comp.map(function(c2) {
      return c2.value;
    }).join(" ").trim().split(" ");
  });
};
var toComparators_1 = toComparators;
var $forEach = arrayIteration.forEach;
var arrayMethodIsStrict = arrayMethodIsStrict$5;
var STRICT_METHOD = arrayMethodIsStrict("forEach");
var arrayForEach = !STRICT_METHOD ? function forEach(callbackfn) {
  return $forEach(this, callbackfn, arguments.length > 1 ? arguments[1] : void 0);
} : [].forEach;
var $ = _export;
var forEach$1 = arrayForEach;
$({ target: "Array", proto: true, forced: [].forEach != forEach$1 }, {
  forEach: forEach$1
});
var global = global$k;
var DOMIterables = domIterables;
var DOMTokenListPrototype = domTokenListPrototype;
var forEach2 = arrayForEach;
var createNonEnumerableProperty = createNonEnumerableProperty$7;
var handlePrototype = function(CollectionPrototype) {
  if (CollectionPrototype && CollectionPrototype.forEach !== forEach2)
    try {
      createNonEnumerableProperty(CollectionPrototype, "forEach", forEach2);
    } catch (error) {
      CollectionPrototype.forEach = forEach2;
    }
};
for (var COLLECTION_NAME in DOMIterables) {
  if (DOMIterables[COLLECTION_NAME]) {
    handlePrototype(global[COLLECTION_NAME] && global[COLLECTION_NAME].prototype);
  }
}
handlePrototype(DOMTokenListPrototype);
var SemVer$3 = semver$1;
var Range$6 = range;
var maxSatisfying = function maxSatisfying2(versions2, range2, options) {
  var max2 = null;
  var maxSV = null;
  var rangeObj = null;
  try {
    rangeObj = new Range$6(range2, options);
  } catch (er) {
    return null;
  }
  versions2.forEach(function(v2) {
    if (rangeObj.test(v2)) {
      if (!max2 || maxSV.compare(v2) === -1) {
        max2 = v2;
        maxSV = new SemVer$3(max2, options);
      }
    }
  });
  return max2;
};
var maxSatisfying_1 = maxSatisfying;
var SemVer$2 = semver$1;
var Range$5 = range;
var minSatisfying = function minSatisfying2(versions2, range2, options) {
  var min2 = null;
  var minSV = null;
  var rangeObj = null;
  try {
    rangeObj = new Range$5(range2, options);
  } catch (er) {
    return null;
  }
  versions2.forEach(function(v2) {
    if (rangeObj.test(v2)) {
      if (!min2 || minSV.compare(v2) === 1) {
        min2 = v2;
        minSV = new SemVer$2(min2, options);
      }
    }
  });
  return min2;
};
var minSatisfying_1 = minSatisfying;
var SemVer$1 = semver$1;
var Range$4 = range;
var gt$1 = gt_1;
var minVersion = function minVersion2(range2, loose) {
  range2 = new Range$4(range2, loose);
  var minver = new SemVer$1("0.0.0");
  if (range2.test(minver)) {
    return minver;
  }
  minver = new SemVer$1("0.0.0-0");
  if (range2.test(minver)) {
    return minver;
  }
  minver = null;
  for (var i = 0; i < range2.set.length; ++i) {
    var comparators = range2.set[i];
    comparators.forEach(function(comparator2) {
      var compver = new SemVer$1(comparator2.semver.version);
      switch (comparator2.operator) {
        case ">":
          if (compver.prerelease.length === 0) {
            compver.patch++;
          } else {
            compver.prerelease.push(0);
          }
          compver.raw = compver.format();
        case "":
        case ">=":
          if (!minver || gt$1(minver, compver)) {
            minver = compver;
          }
          break;
        case "<":
        case "<=":
          break;
        default:
          throw new Error("Unexpected operation: ".concat(comparator2.operator));
      }
    });
  }
  if (minver && range2.test(minver)) {
    return minver;
  }
  return null;
};
var minVersion_1 = minVersion;
var Range$3 = range;
var validRange = function validRange2(range2, options) {
  try {
    return new Range$3(range2, options).range || "*";
  } catch (er) {
    return null;
  }
};
var valid2 = validRange;
function _typeof(obj) {
  "@babel/helpers - typeof";
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof2(obj2) {
      return typeof obj2;
    };
  } else {
    _typeof = function _typeof2(obj2) {
      return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
    };
  }
  return _typeof(obj);
}
var SemVer = semver$1;
var Comparator = comparator;
var ANY$1 = Comparator.ANY;
var Range$2 = range;
var satisfies$2 = satisfies_1;
var gt2 = gt_1;
var lt2 = lt_1;
var lte2 = lte_1;
var gte2 = gte_1;
var outside$2 = function outside(version2, range2, hilo, options) {
  version2 = new SemVer(version2, options);
  range2 = new Range$2(range2, options);
  var gtfn, ltefn, ltfn, comp, ecomp;
  switch (hilo) {
    case ">":
      gtfn = gt2;
      ltefn = lte2;
      ltfn = lt2;
      comp = ">";
      ecomp = ">=";
      break;
    case "<":
      gtfn = lt2;
      ltefn = gte2;
      ltfn = gt2;
      comp = "<";
      ecomp = "<=";
      break;
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  }
  if (satisfies$2(version2, range2, options)) {
    return false;
  }
  var _loop = function _loop2(i2) {
    var comparators = range2.set[i2];
    var high = null;
    var low2 = null;
    comparators.forEach(function(comparator2) {
      if (comparator2.semver === ANY$1) {
        comparator2 = new Comparator(">=0.0.0");
      }
      high = high || comparator2;
      low2 = low2 || comparator2;
      if (gtfn(comparator2.semver, high.semver, options)) {
        high = comparator2;
      } else if (ltfn(comparator2.semver, low2.semver, options)) {
        low2 = comparator2;
      }
    });
    if (high.operator === comp || high.operator === ecomp) {
      return {
        v: false
      };
    }
    if ((!low2.operator || low2.operator === comp) && ltefn(version2, low2.semver)) {
      return {
        v: false
      };
    } else if (low2.operator === ecomp && ltfn(version2, low2.semver)) {
      return {
        v: false
      };
    }
  };
  for (var i = 0; i < range2.set.length; ++i) {
    var _ret = _loop(i);
    if (_typeof(_ret) === "object")
      return _ret.v;
  }
  return true;
};
var outside_1 = outside$2;
var outside$1 = outside_1;
var gtr = function gtr2(version2, range2, options) {
  return outside$1(version2, range2, ">", options);
};
var gtr_1 = gtr;
var outside2 = outside_1;
var ltr = function ltr2(version2, range2, options) {
  return outside2(version2, range2, "<", options);
};
var ltr_1 = ltr;
var Range$1 = range;
var intersects = function intersects2(r1, r2, options) {
  r1 = new Range$1(r1, options);
  r2 = new Range$1(r2, options);
  return r1.intersects(r2);
};
var intersects_1 = intersects;
function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray$1(arr, i) || _nonIterableRest();
}
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr)))
    return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = void 0;
  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);
      if (i && _arr.length === i)
        break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null)
        _i["return"]();
    } finally {
      if (_d)
        throw _e;
    }
  }
  return _arr;
}
function _arrayWithHoles(arr) {
  if (Array.isArray(arr))
    return arr;
}
function _createForOfIteratorHelper$1(o2) {
  if (typeof Symbol === "undefined" || o2[Symbol.iterator] == null) {
    if (Array.isArray(o2) || (o2 = _unsupportedIterableToArray$1(o2))) {
      var i = 0;
      var F = function F2() {
      };
      return { s: F, n: function n() {
        if (i >= o2.length)
          return { done: true };
        return { done: false, value: o2[i++] };
      }, e: function e(_e2) {
        throw _e2;
      }, f: F };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var it, normalCompletion = true, didErr = false, err;
  return { s: function s2() {
    it = o2[Symbol.iterator]();
  }, n: function n() {
    var step = it.next();
    normalCompletion = step.done;
    return step;
  }, e: function e(_e3) {
    didErr = true;
    err = _e3;
  }, f: function f() {
    try {
      if (!normalCompletion && it["return"] != null)
        it["return"]();
    } finally {
      if (didErr)
        throw err;
    }
  } };
}
function _unsupportedIterableToArray$1(o2, minLen) {
  if (!o2)
    return;
  if (typeof o2 === "string")
    return _arrayLikeToArray$1(o2, minLen);
  var n = Object.prototype.toString.call(o2).slice(8, -1);
  if (n === "Object" && o2.constructor)
    n = o2.constructor.name;
  if (n === "Map" || n === "Set")
    return Array.from(o2);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray$1(o2, minLen);
}
function _arrayLikeToArray$1(arr, len) {
  if (len == null || len > arr.length)
    len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}
var satisfies$1 = satisfies_1;
var compare$1 = compare_1;
var simplify = function(versions2, range2, options) {
  var set2 = [];
  var min2 = null;
  var prev = null;
  var v2 = versions2.sort(function(a, b2) {
    return compare$1(a, b2, options);
  });
  var _iterator = _createForOfIteratorHelper$1(v2), _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done; ) {
      var version2 = _step.value;
      var included = satisfies$1(version2, range2, options);
      if (included) {
        prev = version2;
        if (!min2)
          min2 = version2;
      } else {
        if (prev) {
          set2.push([min2, prev]);
        }
        prev = null;
        min2 = null;
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  if (min2)
    set2.push([min2, null]);
  var ranges = [];
  for (var _i = 0, _set = set2; _i < _set.length; _i++) {
    var _set$_i = _slicedToArray(_set[_i], 2), _min = _set$_i[0], max2 = _set$_i[1];
    if (_min === max2)
      ranges.push(_min);
    else if (!max2 && _min === v2[0])
      ranges.push("*");
    else if (!max2)
      ranges.push(">=".concat(_min));
    else if (_min === v2[0])
      ranges.push("<=".concat(max2));
    else
      ranges.push("".concat(_min, " - ").concat(max2));
  }
  var simplified = ranges.join(" || ");
  var original = typeof range2.raw === "string" ? range2.raw : String(range2);
  return simplified.length < original.length ? simplified : range2;
};
var collection = collection$2;
var collectionStrong = collectionStrong$2;
collection("Set", function(init2) {
  return function Set2() {
    return init2(this, arguments.length ? arguments[0] : void 0);
  };
}, collectionStrong);
function _createForOfIteratorHelper(o2) {
  if (typeof Symbol === "undefined" || o2[Symbol.iterator] == null) {
    if (Array.isArray(o2) || (o2 = _unsupportedIterableToArray(o2))) {
      var i = 0;
      var F = function F2() {
      };
      return { s: F, n: function n() {
        if (i >= o2.length)
          return { done: true };
        return { done: false, value: o2[i++] };
      }, e: function e(_e) {
        throw _e;
      }, f: F };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var it, normalCompletion = true, didErr = false, err;
  return { s: function s2() {
    it = o2[Symbol.iterator]();
  }, n: function n() {
    var step = it.next();
    normalCompletion = step.done;
    return step;
  }, e: function e(_e2) {
    didErr = true;
    err = _e2;
  }, f: function f() {
    try {
      if (!normalCompletion && it["return"] != null)
        it["return"]();
    } finally {
      if (didErr)
        throw err;
    }
  } };
}
function _unsupportedIterableToArray(o2, minLen) {
  if (!o2)
    return;
  if (typeof o2 === "string")
    return _arrayLikeToArray(o2, minLen);
  var n = Object.prototype.toString.call(o2).slice(8, -1);
  if (n === "Object" && o2.constructor)
    n = o2.constructor.name;
  if (n === "Map" || n === "Set")
    return Array.from(o2);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray(o2, minLen);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length)
    len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}
var Range = range;
var _require = comparator, ANY = _require.ANY;
var satisfies2 = satisfies_1;
var compare2 = compare_1;
var subset = function subset2(sub, dom, options) {
  sub = new Range(sub, options);
  dom = new Range(dom, options);
  var sawNonNull = false;
  var _iterator = _createForOfIteratorHelper(sub.set), _step;
  try {
    OUTER:
      for (_iterator.s(); !(_step = _iterator.n()).done; ) {
        var simpleSub = _step.value;
        var _iterator2 = _createForOfIteratorHelper(dom.set), _step2;
        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done; ) {
            var simpleDom = _step2.value;
            var isSub = simpleSubset(simpleSub, simpleDom, options);
            sawNonNull = sawNonNull || isSub !== null;
            if (isSub)
              continue OUTER;
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
        if (sawNonNull)
          return false;
      }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return true;
};
var simpleSubset = function simpleSubset2(sub, dom, options) {
  if (sub.length === 1 && sub[0].semver === ANY)
    return dom.length === 1 && dom[0].semver === ANY;
  var eqSet = /* @__PURE__ */ new Set();
  var gt3, lt3;
  var _iterator3 = _createForOfIteratorHelper(sub), _step3;
  try {
    for (_iterator3.s(); !(_step3 = _iterator3.n()).done; ) {
      var c2 = _step3.value;
      if (c2.operator === ">" || c2.operator === ">=")
        gt3 = higherGT(gt3, c2, options);
      else if (c2.operator === "<" || c2.operator === "<=")
        lt3 = lowerLT(lt3, c2, options);
      else
        eqSet.add(c2.semver);
    }
  } catch (err) {
    _iterator3.e(err);
  } finally {
    _iterator3.f();
  }
  if (eqSet.size > 1)
    return null;
  var gtltComp;
  if (gt3 && lt3) {
    gtltComp = compare2(gt3.semver, lt3.semver, options);
    if (gtltComp > 0)
      return null;
    else if (gtltComp === 0 && (gt3.operator !== ">=" || lt3.operator !== "<="))
      return null;
  }
  var _iterator4 = _createForOfIteratorHelper(eqSet), _step4;
  try {
    for (_iterator4.s(); !(_step4 = _iterator4.n()).done; ) {
      var eq3 = _step4.value;
      if (gt3 && !satisfies2(eq3, String(gt3), options))
        return null;
      if (lt3 && !satisfies2(eq3, String(lt3), options))
        return null;
      var _iterator6 = _createForOfIteratorHelper(dom), _step6;
      try {
        for (_iterator6.s(); !(_step6 = _iterator6.n()).done; ) {
          var _c = _step6.value;
          if (!satisfies2(eq3, String(_c), options))
            return false;
        }
      } catch (err) {
        _iterator6.e(err);
      } finally {
        _iterator6.f();
      }
      return true;
    }
  } catch (err) {
    _iterator4.e(err);
  } finally {
    _iterator4.f();
  }
  var higher, lower;
  var hasDomLT, hasDomGT;
  var _iterator5 = _createForOfIteratorHelper(dom), _step5;
  try {
    for (_iterator5.s(); !(_step5 = _iterator5.n()).done; ) {
      var _c2 = _step5.value;
      hasDomGT = hasDomGT || _c2.operator === ">" || _c2.operator === ">=";
      hasDomLT = hasDomLT || _c2.operator === "<" || _c2.operator === "<=";
      if (gt3) {
        if (_c2.operator === ">" || _c2.operator === ">=") {
          higher = higherGT(gt3, _c2, options);
          if (higher === _c2)
            return false;
        } else if (gt3.operator === ">=" && !satisfies2(gt3.semver, String(_c2), options))
          return false;
      }
      if (lt3) {
        if (_c2.operator === "<" || _c2.operator === "<=") {
          lower = lowerLT(lt3, _c2, options);
          if (lower === _c2)
            return false;
        } else if (lt3.operator === "<=" && !satisfies2(lt3.semver, String(_c2), options))
          return false;
      }
      if (!_c2.operator && (lt3 || gt3) && gtltComp !== 0)
        return false;
    }
  } catch (err) {
    _iterator5.e(err);
  } finally {
    _iterator5.f();
  }
  if (gt3 && hasDomLT && !lt3 && gtltComp !== 0)
    return false;
  if (lt3 && hasDomGT && !gt3 && gtltComp !== 0)
    return false;
  return true;
};
var higherGT = function higherGT2(a, b2, options) {
  if (!a)
    return b2;
  var comp = compare2(a.semver, b2.semver, options);
  return comp > 0 ? a : comp < 0 ? b2 : b2.operator === ">" && a.operator === ">=" ? b2 : a;
};
var lowerLT = function lowerLT2(a, b2, options) {
  if (!a)
    return b2;
  var comp = compare2(a.semver, b2.semver, options);
  return comp < 0 ? a : comp > 0 ? b2 : b2.operator === "<" && a.operator === "<=" ? b2 : a;
};
var subset_1 = subset;
var internalRe = re$5.exports;
var semver = {
  re: internalRe.re,
  src: internalRe.src,
  tokens: internalRe.t,
  SEMVER_SPEC_VERSION: constants.SEMVER_SPEC_VERSION,
  SemVer: semver$1,
  compareIdentifiers: identifiers.compareIdentifiers,
  rcompareIdentifiers: identifiers.rcompareIdentifiers,
  parse: parse_1,
  valid: valid_1,
  clean: clean_1,
  inc: inc_1,
  diff: diff_1,
  major: major_1,
  minor: minor_1,
  patch: patch_1,
  prerelease: prerelease_1,
  compare: compare_1,
  rcompare: rcompare_1,
  compareLoose: compareLoose_1,
  compareBuild: compareBuild_1,
  sort: sort_1,
  rsort: rsort_1,
  gt: gt_1,
  lt: lt_1,
  eq: eq_1,
  neq: neq_1,
  gte: gte_1,
  lte: lte_1,
  cmp: cmp_1,
  coerce: coerce_1,
  Comparator: comparator,
  Range: range,
  satisfies: satisfies_1,
  toComparators: toComparators_1,
  maxSatisfying: maxSatisfying_1,
  minSatisfying: minSatisfying_1,
  minVersion: minVersion_1,
  validRange: valid2,
  outside: outside_1,
  gtr: gtr_1,
  ltr: ltr_1,
  intersects: intersects_1,
  simplifyRange: simplify,
  subset: subset_1
};
const getRegistryURL = (input) => {
  const host = "https://registry.npmjs.com";
  let { name, version: version2, path: path2 } = parse$6(input);
  let searchURL = `${host}/-/v1/search?text=${encodeURIComponent(name)}&popularity=0.5&size=30`;
  let packageVersionURL = `${host}/${name}/${version2}`;
  let packageURL = `${host}/${name}`;
  return { searchURL, packageURL, packageVersionURL, version: version2, name, path: path2 };
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
  try {
    let response = await getRequest(packageURL, false);
    return await response.json();
  } catch (e) {
    console.warn(e);
    throw e;
  }
};
const getPackageVersions = async (input) => {
  try {
    let pkg = await getPackage(input);
    let versions2 = Object.keys(pkg.versions);
    let tags = pkg["dist-tags"];
    return { versions: versions2, tags };
  } catch (e) {
    console.warn(e);
    throw e;
  }
};
const resolveVersion = async (input) => {
  try {
    let { version: range2 } = getRegistryURL(input);
    let versionsAndTags = await getPackageVersions(input);
    if (versionsAndTags) {
      const { versions: versions2, tags } = versionsAndTags;
      if (range2 in tags) {
        range2 = tags[range2];
      }
      return versions2.includes(range2) ? range2 : semver.maxSatisfying(versions2, range2);
    }
  } catch (e) {
    console.warn(e);
    throw e;
  }
};
const getResolvedPackage = async (input) => {
  try {
    let { name } = getRegistryURL(input);
    let version2 = await resolveVersion(input);
    return await getPackage(`${name}@${version2}`);
  } catch (e) {
    console.warn(e);
    throw e;
  }
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
  getWASM,
  compress,
  decompress
}, Symbol.toStringTag, { value: "Module" }));
function encode(data2) {
  if (typeof data2 === "string") {
    return btoa(data2);
  } else {
    const d = new Uint8Array(data2);
    let dataString = "";
    for (let i = 0; i < d.length; ++i) {
      dataString += String.fromCharCode(d[i]);
    }
    return btoa(dataString);
  }
}
function decode(data2) {
  const binaryString = decodeString(data2);
  const binary = new Uint8Array(binaryString.length);
  for (let i = 0; i < binary.length; ++i) {
    binary[i] = binaryString.charCodeAt(i);
  }
  return binary.buffer;
}
function decodeString(data2) {
  return atob(data2);
}
var mod = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  encode,
  decode,
  decodeString
}, Symbol.toStringTag, { value: "Module" }));
export { ALIAS, ALIAS_NAMESPACE, ALIAS_RESOLVE, AnsiBuffer, CACHE, CACHE_NAME, CDN, CDN_NAMESPACE, CDN_RESOLVE, DEFAULT_CDN_HOST, DefaultConfig, DeprecatedAPIs, EMPTY_EXPORT, ESCAPE_TO_COLOR, EVENTS, EVENTS_OPTS, EXTERNAL, EXTERNALS_NAMESPACE, EasyDefaultConfig, ExternalPackages, FileSystem, HTTP, HTTP_NAMESPACE, HTTP_RESOLVE, INPUT_EVENTS, PLATFORM_AUTO, PolyfillKeys, PolyfillMap, RESOLVE_EXTENSIONS, SEP, SEP_PATTERN, STATE$1 as STATE, VIRTUAL_FILESYSTEM_NAMESPACE, VIRTUAL_FS, render as ansi, bail, mod as base64, basename, mod$3 as brotli, build, D as compress, S as compressToBase64, j$1 as compressToURL, debounce, decode$1 as decode, R as decompress, O as decompressFromBase64, k as decompressFromURL, deepAssign, deepDiff, deepEqual, delimiter, mod$2 as denoflate, dirname, encode$1 as encode, extname, fetchAssets, fetchPkg, format, fromFileUrl, getCDNOrigin, getCDNStyle, getCDNUrl, getESBUILD, getFile, getPackage, getPackageVersions, getPackages, getPureImportPath, getRegistryURL, getRequest, getResolvedPackage, getResolvedPath, getSize, globToRegExp, htmlEscape, inferLoader, init, isAbsolute, isAlias, isBareImport, isExternal, isGlob, isObject$f as isObject, isPrimitive, isValidKey, join, joinGlobs, loop, mod$1 as lz4, newRequest, normalize$1 as normalize, normalizeGlob, parse$7 as parse, parseConfig, parseShareQuery, parseTreeshakeExports, mod$4 as path, posix, relative, render, resolve$1 as resolve, resolveImports, resolveVersion, sep, setFile, toFileUrl, toName, toNamespacedPath, urlJoin };
//# sourceMappingURL=index.mjs.map
