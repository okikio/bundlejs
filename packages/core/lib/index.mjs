export { s as schema } from "./schema-3ff78f2a.mjs";
const version = "0.14.48";
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
const newRequest = async (cache2, request, fetchOpts) => {
  let networkResponse = await fetch(request, fetchOpts);
  let clonedResponse = networkResponse.clone();
  if ("caches" in globalThis)
    cache2.put(request, clonedResponse);
  else
    CACHE.set(request, clonedResponse);
  return networkResponse;
};
const getRequest = async (url, permanent = false, fetchOpts) => {
  let request = new Request(url.toString());
  let response;
  let cache2;
  let cacheResponse;
  if ("caches" in globalThis) {
    cache2 = await caches.open(CACHE_NAME);
    cacheResponse = await cache2.match(request);
  } else {
    cacheResponse = CACHE.get(request);
  }
  response = cacheResponse;
  if (!cacheResponse)
    response = await newRequest(cache2, request, fetchOpts);
  else if (!permanent)
    newRequest(cache2, request, fetchOpts);
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
function resolve$1(...pathSegments) {
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
function parse$1(path2) {
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
  normalize: normalize$2,
  isAbsolute: isAbsolute$1,
  join: join$2,
  relative: relative$1,
  toNamespacedPath: toNamespacedPath$1,
  dirname: dirname$1,
  basename: basename$1,
  extname: extname$1,
  format: format$1,
  parse: parse$1,
  fromFileUrl: fromFileUrl$1,
  toFileUrl: toFileUrl$1
}, Symbol.toStringTag, { value: "Module" }));
const path$2 = _posix;
const { join: join$1, normalize: normalize$1 } = path$2;
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
          let k = i + 1;
          let value = "";
          while (glob[k + 1] != null && glob[k + 1] != ":") {
            value += glob[k + 1];
            k++;
          }
          if (glob[k + 1] == ":" && glob[k + 2] == "]") {
            i = k + 2;
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
  const s2 = SEP_PATTERN.source;
  const badParentPattern = new RegExp(`(?<=(${s2}|^)\\*\\*${s2})\\.\\.(?=${s2}|$)`, "g");
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
const path$1 = _posix;
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
  parse,
  relative,
  resolve,
  sep,
  toFileUrl,
  toNamespacedPath
} = path$1;
const urlJoin = (urlStr, ...args) => {
  const url = new URL(urlStr);
  url.pathname = encodeWhitespace(join(url.pathname, ...args).replace(/%/g, "%25").replace(/\\/g, "%5C"));
  return url.toString();
};
const isBareImport = (importStr) => {
  return /^(?!\.).*/.test(importStr) && !isAbsolute(importStr);
};
var path = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  urlJoin,
  isBareImport,
  SEP,
  SEP_PATTERN,
  globToRegExp,
  isGlob,
  normalizeGlob,
  joinGlobs,
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
  parse,
  relative,
  resolve,
  sep,
  toFileUrl,
  toNamespacedPath
}, Symbol.toStringTag, { value: "Module" }));
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
function loop(exports, keys) {
  if (typeof exports === "string") {
    return exports;
  }
  if (exports) {
    let idx, tmp;
    if (Array.isArray(exports)) {
      for (idx = 0; idx < exports.length; idx++) {
        if (tmp = loop(exports[idx], keys))
          return tmp;
      }
    } else {
      for (idx in exports) {
        if (keys.has(idx)) {
          return loop(exports[idx], keys);
        }
      }
    }
  }
}
function bail(name, entry, condition) {
  throw new Error(condition ? `No known conditions for "${entry}" entry in "${name}" package` : `Missing "${entry}" export in "${name}" package`);
}
function toName(name, entry) {
  return entry === name ? "." : entry[0] === "." ? entry : entry.replace(new RegExp("^" + name + "/"), "./");
}
function resolveExports(pkg, entry = ".", options = {}) {
  let { name, exports } = pkg;
  if (exports) {
    let { browser, require, unsafe, conditions = [] } = options;
    let target = toName(name, entry);
    if (target[0] !== ".")
      target = "./" + target;
    if (typeof exports === "string") {
      return target === "." ? exports : bail(name, target);
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
      return target === "." ? loop(exports, allows) || bail(name, target, 1) : bail(name, target);
    }
    if (tmp = exports[target]) {
      return loop(tmp, allows) || bail(name, target, 1);
    }
    for (key in exports) {
      tmp = key[key.length - 1];
      if (tmp === "/" && target.startsWith(key)) {
        return (tmp = loop(exports[key], allows)) ? tmp + target.substring(key.length) : bail(name, target, 1);
      }
      if (tmp === "*" && target.startsWith(key.slice(0, -1))) {
        if (target.substring(key.length - 1).length > 0) {
          return (tmp = loop(exports[key], allows)) ? tmp.replace("*", target.substring(key.length - 1)) : bail(name, target, 1);
        }
      }
    }
    return bail(name, target);
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
          value = value[browser = toName(pkg.name, browser)];
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
const RE_SCOPED = /^(@[^\/]+\/[^@\/]+)(?:@([^\/]+))?(\/.*)?$/;
const RE_NON_SCOPED = /^([^@\/]+)(?:@([^\/]+))?(\/.*)?$/;
function parsePackageName(input) {
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
      let parsed = parsePackageName(argPath);
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
        let keys = Object.keys(deps);
        if (keys.includes(argPath))
          parsed.version = deps[argPath];
      }
      if (NPM_CDN) {
        try {
          let { url: PACKAGE_JSON_URL } = getCDNUrl(`${parsed.name}@${parsed.version}/package.json`, origin);
          pkg = await getRequest(PACKAGE_JSON_URL, true).then((res) => res.json());
          let path2 = resolveExports(pkg, subpath ? "." + subpath.replace(/^\.?\/?/, "/") : ".", {
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
const isAlias = (id, aliases = {}) => {
  if (!isBareImport(id))
    return false;
  let aliasKeys = Object.keys(aliases);
  let path2 = id.replace(/^node\:/, "");
  let pkgDetails = parsePackageName(path2);
  return aliasKeys.find((it) => {
    return pkgDetails.name === it;
  });
};
const ALIAS_RESOLVE = (aliases = {}, host = DEFAULT_CDN_HOST, events) => {
  return async (args) => {
    let path2 = args.path.replace(/^node\:/, "");
    let { path: argPath } = getCDNUrl(path2);
    if (isAlias(argPath, aliases)) {
      let pkgDetails = parsePackageName(argPath);
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
    resolvedPath = resolve(dirname(importer), path2);
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
    resolvedPath = resolve(dirname(importer), path2);
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
}, b = (p, e, ...t) => {
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
}, y = class extends o {
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
    return a || (i = t), Object.keys(e).forEach((s2) => {
      r = a ? s2 : e[s2], a && (i = e[s2]), this.newListener(r, i, l);
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
    return a || (i = t), Object.keys(e).forEach((s2) => {
      r = a ? s2 : e[s2], a && (i = e[s2]), typeof i == "function" ? this.removeListener(r, i, l) : this.remove(r);
    }, this), this;
  }
  once(e, t, n) {
    if (typeof e == "undefined" || e == null)
      return this;
    typeof e == "string" && (e = e.trim().split(/\s/g));
    let r = typeof e == "object" && !Array.isArray(e);
    return Object.keys(e).forEach((i) => {
      let a = r ? i : e[i], l = r ? e[i] : t, s2 = r ? t : n, u = (...f) => {
        l.apply(s2, f), this.removeListener(a, u, s2);
      };
      this.newListener(a, u, s2);
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
    return b(this, "clear"), super.clear(), this;
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
const EVENTS = new y();
EVENTS.on(EVENTS_OPTS);
const STATE = {
  initialized: false,
  assets: [],
  esbuild: null
};
const BYTE_UNITS = [
  "B",
  "kB",
  "MB",
  "GB",
  "TB",
  "PB",
  "EB",
  "ZB",
  "YB"
];
const BIBYTE_UNITS = [
  "B",
  "kiB",
  "MiB",
  "GiB",
  "TiB",
  "PiB",
  "EiB",
  "ZiB",
  "YiB"
];
const BIT_UNITS = [
  "b",
  "kbit",
  "Mbit",
  "Gbit",
  "Tbit",
  "Pbit",
  "Ebit",
  "Zbit",
  "Ybit"
];
const BIBIT_UNITS = [
  "b",
  "kibit",
  "Mibit",
  "Gibit",
  "Tibit",
  "Pibit",
  "Eibit",
  "Zibit",
  "Yibit"
];
const toLocaleString = (number, locale, options) => {
  let result = number;
  if (typeof locale === "string" || Array.isArray(locale)) {
    result = number.toLocaleString(locale, options);
  } else if (locale === true || options !== void 0) {
    result = number.toLocaleString(void 0, options);
  }
  return result;
};
function bytes(number, options) {
  if (!Number.isFinite(number)) {
    throw new TypeError(`Expected a finite number, got ${typeof number}: ${number}`);
  }
  options = {
    bits: false,
    binary: false,
    ...options
  };
  const UNITS = options.bits ? options.binary ? BIBIT_UNITS : BIT_UNITS : options.binary ? BIBYTE_UNITS : BYTE_UNITS;
  if (options.signed && number === 0) {
    return ` 0 ${UNITS[0]}`;
  }
  const isNegative = number < 0;
  const prefix = isNegative ? "-" : options.signed ? "+" : "";
  if (isNegative) {
    number = -number;
  }
  let localeOptions;
  if (options.minimumFractionDigits !== void 0) {
    localeOptions = { minimumFractionDigits: options.minimumFractionDigits };
  }
  if (options.maximumFractionDigits !== void 0) {
    localeOptions = { maximumFractionDigits: options.maximumFractionDigits, ...localeOptions };
  }
  if (number < 1) {
    const numberString2 = toLocaleString(number, options.locale, localeOptions);
    return prefix + numberString2 + " " + UNITS[0];
  }
  const exponent = Math.min(Math.floor(options.binary ? Math.log(number) / Math.log(1024) : Math.log10(number) / 3), UNITS.length - 1);
  number /= (options.binary ? 1024 : 1e3) ** exponent;
  if (!localeOptions) {
    number = number.toPrecision(3);
  }
  const numberString = toLocaleString(Number(number), options.locale, localeOptions);
  const unit = UNITS[exponent];
  return prefix + numberString + " " + unit;
}
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
  const { formatMessages } = await import("./esbuild-99c6955a.mjs").then(function(n) {
    return n.b;
  });
  let notices = await formatMessages(errors, { color, kind });
  return notices.map((msg) => !color ? msg : render(msg.replace(/(\s+)(\d+)(\s+)\│/g, "\n$1$2$3\u2502")));
};
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
          `https://deno.land/x/esbuild@v${version}/mod.js`
        );
      default:
        return await import("./esbuild-99c6955a.mjs").then(function(n) {
          return n.b;
        });
    }
  } catch (e) {
    throw e;
  }
}
async function init({ platform, ...opts2 } = {}) {
  try {
    if (!STATE.initialized) {
      STATE.initialized = true;
      EVENTS.emit("init.start");
      STATE.esbuild = await getESBUILD(platform);
      if (platform !== "node" && platform !== "deno") {
        const { default: ESBUILD_WASM } = await import("./esbuild-wasm-40c34107.mjs");
        await STATE.esbuild.initialize({
          wasmModule: new WebAssembly.Module(await ESBUILD_WASM()),
          ...opts2
        });
      }
      EVENTS.emit("init.complete");
    }
    return STATE.esbuild;
  } catch (error) {
    EVENTS.emit("init.error", error);
    console.error(error);
  }
}
async function build(opts2 = {}) {
  if (!STATE.initialized)
    EVENTS.emit("init.loading");
  const CONFIG = deepAssign({}, DefaultConfig, opts2);
  const { build: bundle } = await init(CONFIG.init);
  const { define = {}, loader = {}, ...esbuildOpts } = CONFIG.esbuild ?? {};
  let outputs = [];
  let contents = [];
  let result;
  try {
    try {
      const keys = "p.env.NODE_ENV".replace("p.", "process.");
      result = await bundle({
        entryPoints: CONFIG?.entryPoints ?? [],
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
async function getSize(contents = [], opts2 = {}) {
  const CONFIG = deepAssign({}, DefaultConfig, opts2);
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
const keyStrBase64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
const keyStrUriSafe = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$";
const baseReverseDic = {};
function getBaseValue(alphabet, character) {
  if (!baseReverseDic[alphabet]) {
    baseReverseDic[alphabet] = {};
    for (let i = 0; i < alphabet.length; i++) {
      baseReverseDic[alphabet][alphabet.charAt(i)] = i;
    }
  }
  return baseReverseDic[alphabet][character];
}
function compressToBase64(input) {
  if (input == null)
    return "";
  const res = _compress(input, 6, (a) => keyStrBase64.charAt(a));
  switch (res.length % 4) {
    default:
    case 0:
      return res;
    case 1:
      return res + "===";
    case 2:
      return res + "==";
    case 3:
      return res + "=";
  }
}
function decompressFromBase64(input) {
  if (input == null)
    return "";
  if (input == "")
    return null;
  return _decompress(input.length, 32, (index) => getBaseValue(keyStrBase64, input.charAt(index)));
}
function compressToURL(input) {
  if (input == null)
    return "";
  return _compress(input, 6, (a) => keyStrUriSafe.charAt(a));
}
function decompressFromURL$1(input) {
  if (input == null)
    return "";
  if (input == "")
    return null;
  input = input.replaceAll(" ", "+");
  return _decompress(input.length, 32, (index) => getBaseValue(keyStrUriSafe, input.charAt(index)));
}
function compress$2(uncompressed) {
  return _compress(uncompressed, 16, String.fromCharCode);
}
function decompress$2(compressed) {
  if (compressed == null)
    return "";
  if (compressed == "")
    return null;
  return _decompress(compressed.length, 32768, (index) => compressed.charCodeAt(index));
}
function _compress(uncompressed, bitsPerChar, getCharFromInt) {
  if (uncompressed == null)
    return "";
  const contextData = [];
  const contextDictionary = {};
  const contextDictionaryToCreate = {};
  let i;
  let j;
  let value;
  let contextC = "";
  let contextW = "";
  let contextWc = "";
  let contextEnlargeIn = 2;
  let contextDictSize = 3;
  let contextNumBits = 2;
  let contextDataVal = 0;
  let contextDataPosition = 0;
  for (j = 0; j < uncompressed.length; j += 1) {
    contextC = uncompressed.charAt(j);
    if (!Object.prototype.hasOwnProperty.call(contextDictionary, contextC)) {
      contextDictionary[contextC] = contextDictSize++;
      contextDictionaryToCreate[contextC] = true;
    }
    contextWc = contextW + contextC;
    if (Object.prototype.hasOwnProperty.call(contextDictionary, contextWc)) {
      contextW = contextWc;
    } else {
      if (Object.prototype.hasOwnProperty.call(contextDictionaryToCreate, contextW)) {
        if (contextW.charCodeAt(0) < 256) {
          for (i = 0; i < contextNumBits; i++) {
            contextDataVal = contextDataVal << 1;
            if (contextDataPosition == bitsPerChar - 1) {
              contextDataPosition = 0;
              contextData.push(getCharFromInt(contextDataVal));
              contextDataVal = 0;
            } else {
              contextDataPosition++;
            }
          }
          value = contextW.charCodeAt(0);
          for (i = 0; i < 8; i++) {
            contextDataVal = contextDataVal << 1 | value & 1;
            if (contextDataPosition == bitsPerChar - 1) {
              contextDataPosition = 0;
              contextData.push(getCharFromInt(contextDataVal));
              contextDataVal = 0;
            } else {
              contextDataPosition++;
            }
            value = value >> 1;
          }
        } else {
          value = 1;
          for (i = 0; i < contextNumBits; i++) {
            contextDataVal = contextDataVal << 1 | value;
            if (contextDataPosition == bitsPerChar - 1) {
              contextDataPosition = 0;
              contextData.push(getCharFromInt(contextDataVal));
              contextDataVal = 0;
            } else {
              contextDataPosition++;
            }
            value = 0;
          }
          value = contextW.charCodeAt(0);
          for (i = 0; i < 16; i++) {
            contextDataVal = contextDataVal << 1 | value & 1;
            if (contextDataPosition == bitsPerChar - 1) {
              contextDataPosition = 0;
              contextData.push(getCharFromInt(contextDataVal));
              contextDataVal = 0;
            } else {
              contextDataPosition++;
            }
            value = value >> 1;
          }
        }
        contextEnlargeIn--;
        if (contextEnlargeIn == 0) {
          contextEnlargeIn = Math.pow(2, contextNumBits);
          contextNumBits++;
        }
        delete contextDictionaryToCreate[contextW];
      } else {
        value = contextDictionary[contextW];
        for (i = 0; i < contextNumBits; i++) {
          contextDataVal = contextDataVal << 1 | value & 1;
          if (contextDataPosition == bitsPerChar - 1) {
            contextDataPosition = 0;
            contextData.push(getCharFromInt(contextDataVal));
            contextDataVal = 0;
          } else {
            contextDataPosition++;
          }
          value = value >> 1;
        }
      }
      contextEnlargeIn--;
      if (contextEnlargeIn == 0) {
        contextEnlargeIn = Math.pow(2, contextNumBits);
        contextNumBits++;
      }
      contextDictionary[contextWc] = contextDictSize++;
      contextW = String(contextC);
    }
  }
  if (contextW !== "") {
    if (Object.prototype.hasOwnProperty.call(contextDictionaryToCreate, contextW)) {
      if (contextW.charCodeAt(0) < 256) {
        for (i = 0; i < contextNumBits; i++) {
          contextDataVal = contextDataVal << 1;
          if (contextDataPosition == bitsPerChar - 1) {
            contextDataPosition = 0;
            contextData.push(getCharFromInt(contextDataVal));
            contextDataVal = 0;
          } else {
            contextDataPosition++;
          }
        }
        value = contextW.charCodeAt(0);
        for (i = 0; i < 8; i++) {
          contextDataVal = contextDataVal << 1 | value & 1;
          if (contextDataPosition == bitsPerChar - 1) {
            contextDataPosition = 0;
            contextData.push(getCharFromInt(contextDataVal));
            contextDataVal = 0;
          } else {
            contextDataPosition++;
          }
          value = value >> 1;
        }
      } else {
        value = 1;
        for (i = 0; i < contextNumBits; i++) {
          contextDataVal = contextDataVal << 1 | value;
          if (contextDataPosition == bitsPerChar - 1) {
            contextDataPosition = 0;
            contextData.push(getCharFromInt(contextDataVal));
            contextDataVal = 0;
          } else {
            contextDataPosition++;
          }
          value = 0;
        }
        value = contextW.charCodeAt(0);
        for (i = 0; i < 16; i++) {
          contextDataVal = contextDataVal << 1 | value & 1;
          if (contextDataPosition == bitsPerChar - 1) {
            contextDataPosition = 0;
            contextData.push(getCharFromInt(contextDataVal));
            contextDataVal = 0;
          } else {
            contextDataPosition++;
          }
          value = value >> 1;
        }
      }
      contextEnlargeIn--;
      if (contextEnlargeIn == 0) {
        contextEnlargeIn = Math.pow(2, contextNumBits);
        contextNumBits++;
      }
      delete contextDictionaryToCreate[contextW];
    } else {
      value = contextDictionary[contextW];
      for (i = 0; i < contextNumBits; i++) {
        contextDataVal = contextDataVal << 1 | value & 1;
        if (contextDataPosition == bitsPerChar - 1) {
          contextDataPosition = 0;
          contextData.push(getCharFromInt(contextDataVal));
          contextDataVal = 0;
        } else {
          contextDataPosition++;
        }
        value = value >> 1;
      }
    }
    contextEnlargeIn--;
    if (contextEnlargeIn == 0) {
      contextEnlargeIn = Math.pow(2, contextNumBits);
      contextNumBits++;
    }
  }
  value = 2;
  for (i = 0; i < contextNumBits; i++) {
    contextDataVal = contextDataVal << 1 | value & 1;
    if (contextDataPosition == bitsPerChar - 1) {
      contextDataPosition = 0;
      contextData.push(getCharFromInt(contextDataVal));
      contextDataVal = 0;
    } else
      contextDataPosition++;
    value = value >> 1;
  }
  while (true) {
    contextDataVal = contextDataVal << 1;
    if (contextDataPosition == bitsPerChar - 1) {
      contextData.push(getCharFromInt(contextDataVal));
      break;
    } else
      contextDataPosition++;
  }
  return contextData.join("");
}
function _decompress(length, resetValue, getNextValue) {
  let dictionary = [];
  let enlargeIn = 4;
  let dictSize = 4;
  let numBits = 3;
  let entry = "";
  let result = [];
  let i;
  let w;
  let bits;
  let resb;
  let maxpower;
  let power;
  let c2;
  let data = { val: getNextValue(0), position: resetValue, index: 1 };
  for (i = 0; i < 3; i += 1)
    dictionary[i] = i;
  bits = 0;
  maxpower = Math.pow(2, 2);
  power = 1;
  while (power != maxpower) {
    resb = data.val & data.position;
    data.position >>= 1;
    if (data.position == 0) {
      data.position = resetValue;
      data.val = getNextValue(data.index++);
    }
    bits |= (resb > 0 ? 1 : 0) * power;
    power <<= 1;
  }
  switch (bits) {
    case 0:
      bits = 0;
      maxpower = Math.pow(2, 8);
      power = 1;
      while (power != maxpower) {
        resb = data.val & data.position;
        data.position >>= 1;
        if (data.position == 0) {
          data.position = resetValue;
          data.val = getNextValue(data.index++);
        }
        bits |= (resb > 0 ? 1 : 0) * power;
        power <<= 1;
      }
      c2 = String.fromCharCode(bits);
      break;
    case 1:
      bits = 0;
      maxpower = Math.pow(2, 16);
      power = 1;
      while (power != maxpower) {
        resb = data.val & data.position;
        data.position >>= 1;
        if (data.position == 0) {
          data.position = resetValue;
          data.val = getNextValue(data.index++);
        }
        bits |= (resb > 0 ? 1 : 0) * power;
        power <<= 1;
      }
      c2 = String.fromCharCode(bits);
      break;
    case 2:
      return "";
  }
  dictionary[3] = c2;
  w = c2;
  result.push(c2);
  while (true) {
    if (data.index > length) {
      return "";
    }
    bits = 0;
    maxpower = Math.pow(2, numBits);
    power = 1;
    while (power != maxpower) {
      resb = data.val & data.position;
      data.position >>= 1;
      if (data.position == 0) {
        data.position = resetValue;
        data.val = getNextValue(data.index++);
      }
      bits |= (resb > 0 ? 1 : 0) * power;
      power <<= 1;
    }
    switch (c2 = bits) {
      case 0:
        bits = 0;
        maxpower = Math.pow(2, 8);
        power = 1;
        while (power != maxpower) {
          resb = data.val & data.position;
          data.position >>= 1;
          if (data.position == 0) {
            data.position = resetValue;
            data.val = getNextValue(data.index++);
          }
          bits |= (resb > 0 ? 1 : 0) * power;
          power <<= 1;
        }
        dictionary[dictSize++] = String.fromCharCode(bits);
        c2 = dictSize - 1;
        enlargeIn--;
        break;
      case 1:
        bits = 0;
        maxpower = Math.pow(2, 16);
        power = 1;
        while (power != maxpower) {
          resb = data.val & data.position;
          data.position >>= 1;
          if (data.position == 0) {
            data.position = resetValue;
            data.val = getNextValue(data.index++);
          }
          bits |= (resb > 0 ? 1 : 0) * power;
          power <<= 1;
        }
        dictionary[dictSize++] = String.fromCharCode(bits);
        c2 = dictSize - 1;
        enlargeIn--;
        break;
      case 2:
        return result.join("");
    }
    if (enlargeIn == 0) {
      enlargeIn = Math.pow(2, numBits);
      numBits++;
    }
    if (dictionary[c2]) {
      entry = dictionary[c2];
    } else {
      if (c2 === dictSize && typeof w === "string") {
        entry = w + w.charAt(0);
      } else {
        return null;
      }
    }
    result.push(entry);
    dictionary[dictSize++] = w + entry.charAt(0);
    enlargeIn--;
    w = entry;
    if (enlargeIn == 0) {
      enlargeIn = Math.pow(2, numBits);
      numBits++;
    }
  }
}
var lzstring = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  keyStrBase64,
  keyStrUriSafe,
  baseReverseDic,
  getBaseValue,
  compressToBase64,
  decompressFromBase64,
  compressToURL,
  decompressFromURL: decompressFromURL$1,
  compress: compress$2,
  decompress: decompress$2,
  _compress,
  _decompress
}, Symbol.toStringTag, { value: "Module" }));
const { decompressFromURL } = lzstring;
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
const SEMVER_SPEC_VERSION = "2.0.0";
const MAX_LENGTH = 256;
const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || 9007199254740991;
const MAX_SAFE_COMPONENT_LENGTH = 16;
let R = 0;
const createToken = (pattern, isGlobal) => {
  const index = R++;
  return { index, pattern, regex: new RegExp(pattern, isGlobal ? "g" : void 0) };
};
const NUMERICIDENTIFIER = "0|[1-9]\\d*";
const NUMERICIDENTIFIERLOOSE = "[0-9]+";
const NONNUMERICIDENTIFIER = "\\d*[a-zA-Z-][a-zA-Z0-9-]*";
const PRERELEASEIDENTIFIER = `(?:${NUMERICIDENTIFIER}|${NONNUMERICIDENTIFIER})`;
const PRERELEASEIDENTIFIERLOOSE = `(?:${NUMERICIDENTIFIERLOOSE}|${NONNUMERICIDENTIFIER})`;
const BUILDIDENTIFIER = "[0-9A-Za-z-]+";
const MAINVERSION = `(${NUMERICIDENTIFIER})\\.(${NUMERICIDENTIFIER})\\.(${NUMERICIDENTIFIER})`;
const MAINVERSIONLOOSE = `(${NUMERICIDENTIFIERLOOSE})\\.(${NUMERICIDENTIFIERLOOSE})\\.(${NUMERICIDENTIFIERLOOSE})`;
const BUILD = `(?:\\+(${BUILDIDENTIFIER}(?:\\.${BUILDIDENTIFIER})*))`;
const PRERELEASE = `(?:-(${PRERELEASEIDENTIFIER}(?:\\.${PRERELEASEIDENTIFIER})*))`;
const PRERELEASELOOSE = `(?:-?(${PRERELEASEIDENTIFIERLOOSE}(?:\\.${PRERELEASEIDENTIFIERLOOSE})*))`;
const FULLPLAIN = `v?${MAINVERSION}${PRERELEASE}?${BUILD}?`;
const LOOSEPLAIN = `[v=\\s]*${MAINVERSIONLOOSE}${PRERELEASELOOSE}?${BUILD}?`;
const XRANGEIDENTIFIER = `${NUMERICIDENTIFIER}|x|X|\\*`;
const XRANGEIDENTIFIERLOOSE = `${NUMERICIDENTIFIERLOOSE}|x|X|\\*`;
const GTLT = "((?:<|>)?=?)";
const XRANGEPLAIN = `[v=\\s]*(${XRANGEIDENTIFIER})(?:\\.(${XRANGEIDENTIFIER})(?:\\.(${XRANGEIDENTIFIER})(?:${PRERELEASE})?${BUILD}?)?)?`;
const XRANGEPLAINLOOSE = `[v=\\s]*(${XRANGEIDENTIFIERLOOSE})(?:\\.(${XRANGEIDENTIFIERLOOSE})(?:\\.(${XRANGEIDENTIFIERLOOSE})(?:${PRERELEASELOOSE})?${BUILD}?)?)?`;
const COERCE = `${"(^|[^\\d])(\\d{1,"}${MAX_SAFE_COMPONENT_LENGTH}})(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?(?:$|[^\\d])`;
const LONETILDE = "(?:~>?)";
const LONECARET = "(?:\\^)";
const tokens = {
  NUMERICIDENTIFIER: createToken(NUMERICIDENTIFIER),
  NUMERICIDENTIFIERLOOSE: createToken(NUMERICIDENTIFIERLOOSE),
  NONNUMERICIDENTIFIER: createToken(NONNUMERICIDENTIFIER),
  MAINVERSION: createToken(MAINVERSION),
  MAINVERSIONLOOSE: createToken(MAINVERSIONLOOSE),
  PRERELEASEIDENTIFIER: createToken(PRERELEASEIDENTIFIER),
  PRERELEASEIDENTIFIERLOOSE: createToken(PRERELEASEIDENTIFIERLOOSE),
  PRERELEASE: createToken(PRERELEASE),
  PRERELEASELOOSE: createToken(PRERELEASELOOSE),
  BUILDIDENTIFIER: createToken(BUILDIDENTIFIER),
  BUILD: createToken(BUILD),
  FULLPLAIN: createToken(FULLPLAIN),
  FULL: createToken(`^${FULLPLAIN}$`),
  LOOSEPLAIN: createToken(LOOSEPLAIN),
  LOOSE: createToken(`^${LOOSEPLAIN}$`),
  GTLT: createToken(GTLT),
  XRANGEIDENTIFIERLOOSE: createToken(XRANGEIDENTIFIERLOOSE),
  XRANGEIDENTIFIER: createToken(XRANGEIDENTIFIER),
  XRANGEPLAIN: createToken(XRANGEPLAIN),
  XRANGEPLAINLOOSE: createToken(XRANGEPLAINLOOSE),
  XRANGE: createToken(`^${GTLT}\\s*${XRANGEPLAIN}$`),
  XRANGELOOSE: createToken(`^${GTLT}\\s*${XRANGEPLAINLOOSE}$`),
  COERCE: createToken(COERCE),
  COERCERTL: createToken(COERCE, true),
  LONETILDE: createToken("(?:~>?)"),
  TILDETRIM: createToken(`(\\s*)${LONETILDE}\\s+`, true),
  TILDE: createToken(`^${LONETILDE}${XRANGEPLAIN}$`),
  TILDELOOSE: createToken(`^${LONETILDE}${XRANGEPLAINLOOSE}$`),
  LONECARET: createToken("(?:\\^)"),
  CARETTRIM: createToken(`(\\s*)${LONECARET}\\s+`, true),
  CARET: createToken(`^${LONECARET}${XRANGEPLAIN}$`),
  CARETLOOSE: createToken(`^${LONECARET}${XRANGEPLAINLOOSE}$`),
  COMPARATORLOOSE: createToken(`^${GTLT}\\s*(${LOOSEPLAIN})$|^$`),
  COMPARATOR: createToken(`^${GTLT}\\s*(${FULLPLAIN})$|^$`),
  COMPARATORTRIM: createToken(`(\\s*)${GTLT}\\s*(${LOOSEPLAIN}|${XRANGEPLAIN})`, true),
  HYPHENRANGE: createToken(`^\\s*(${XRANGEPLAIN})\\s+-\\s+(${XRANGEPLAIN})\\s*$`),
  HYPHENRANGELOOSE: createToken(`^\\s*(${XRANGEPLAINLOOSE})\\s+-\\s+(${XRANGEPLAINLOOSE})\\s*$`),
  STAR: createToken("(<|>)?=?\\s*\\*"),
  GTE0: createToken("^\\s*>=\\s*0\\.0\\.0\\s*$"),
  GTE0PRE: createToken("^\\s*>=\\s*0\\.0\\.0-0\\s*$")
};
const opts = ["includePrerelease", "loose", "rtl"];
const parseOptions = (options) => !options ? {} : typeof options !== "object" ? { loose: true } : opts.filter((k) => options[k]).reduce((o2, k) => {
  o2[k] = true;
  return o2;
}, {});
const numeric = /^[0-9]+$/;
const compareIdentifiers = (a, b2) => {
  const anum = numeric.test(a);
  const bnum = numeric.test(b2);
  let _a = a;
  let _b = b2;
  if (anum && bnum) {
    _a = +a;
    _b = +b2;
  }
  return _a === _b ? 0 : anum && !bnum ? -1 : bnum && !anum ? 1 : _a < _b ? -1 : 1;
};
class SemVer {
  constructor(version2, options) {
    options = parseOptions(options);
    if (version2 instanceof SemVer) {
      if (version2.loose === !!options.loose && version2.includePrerelease === !!options.includePrerelease) {
        return version2;
      } else {
        version2 = version2.version;
      }
    } else if (typeof version2 !== "string") {
      throw new TypeError(`Invalid Version: ${version2}`);
    }
    if (version2.length > MAX_LENGTH) {
      throw new TypeError(`version is longer than ${MAX_LENGTH} characters`);
    }
    this.options = options;
    this.loose = !!options.loose;
    this.includePrerelease = !!options.includePrerelease;
    const m = version2.trim().match(options.loose ? tokens.LOOSE.regex : tokens.FULL.regex);
    if (!m) {
      throw new TypeError(`Invalid Version: ${version2}`);
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
      this.prerelease = m[4].split(".").map((id) => {
        if (/^[0-9]+$/.test(id)) {
          const num = +id;
          if (num >= 0 && num < MAX_SAFE_INTEGER) {
            return num;
          }
        }
        return id;
      });
    }
    this.build = m[5] ? m[5].split(".") : [];
    this.format();
  }
  format() {
    this.version = `${this.major}.${this.minor}.${this.patch}`;
    if (this.prerelease.length) {
      this.version += `-${this.prerelease.join(".")}`;
    }
    return this.version;
  }
  toString() {
    return this.version;
  }
  compare(other) {
    if (!(other instanceof SemVer)) {
      if (typeof other === "string" && other === this.version) {
        return 0;
      }
      other = new SemVer(other, this.options);
    }
    if (other.version === this.version) {
      return 0;
    }
    return this.compareMain(other) || this.comparePre(other);
  }
  compareMain(other) {
    if (!(other instanceof SemVer)) {
      other = new SemVer(other, this.options);
    }
    return compareIdentifiers(this.major, other.major) || compareIdentifiers(this.minor, other.minor) || compareIdentifiers(this.patch, other.patch);
  }
  comparePre(other) {
    if (!(other instanceof SemVer)) {
      other = new SemVer(other, this.options);
    }
    if (this.prerelease.length && !other.prerelease.length) {
      return -1;
    } else if (!this.prerelease.length && other.prerelease.length) {
      return 1;
    } else if (!this.prerelease.length && !other.prerelease.length) {
      return 0;
    }
    let i = 0;
    do {
      const a = this.prerelease[i];
      const b2 = other.prerelease[i];
      if (a === void 0 && b2 === void 0) {
        return 0;
      } else if (b2 === void 0) {
        return 1;
      } else if (a === void 0) {
        return -1;
      } else if (a === b2) {
        continue;
      } else {
        return compareIdentifiers(a, b2);
      }
    } while (++i);
  }
}
const ANY = Symbol("SemVer ANY");
class Comparator {
  constructor(comp, optionsOrLoose) {
    optionsOrLoose = parseOptions(optionsOrLoose);
    if (comp instanceof Comparator) {
      if (comp.loose === !!optionsOrLoose.loose) {
        return comp;
      } else {
        comp = comp.value;
      }
    }
    this.options = optionsOrLoose;
    this.loose = !!optionsOrLoose.loose;
    this.parse(comp);
    if (this.semver === ANY) {
      this.value = "";
    } else {
      this.value = this.operator + this.semver.version;
    }
  }
  parse(comp) {
    const r = this.options.loose ? tokens.COMPARATORLOOSE.regex : tokens.COMPARATOR.regex;
    const m = comp.match(r);
    if (!m) {
      throw new TypeError(`Invalid comparator: ${comp}`);
    }
    this.operator = m[1] !== void 0 ? m[1] : "";
    if (this.operator === "=") {
      this.operator = "";
    }
    if (!m[2]) {
      this.semver = ANY;
    } else {
      this.semver = new SemVer(m[2], this.options.loose);
    }
  }
  toString() {
    return this.value;
  }
}
const cache = /* @__PURE__ */ new Map();
const cacheLastAccessTime = /* @__PURE__ */ new Map();
const cacheLimit = 1e3;
const caretTrimReplace = "$1^";
const tildeTrimReplace = "$1~";
const comparatorTrimReplace = "$1$2$3";
const isNullSet = (c2) => c2.value === "<0.0.0-0";
const isAny = (c2) => c2.value === "";
const parseComparator = (comp, options) => {
  comp = replaceCarets(comp, options);
  comp = replaceTildes(comp, options);
  comp = replaceXRanges(comp, options);
  comp = replaceStars(comp);
  return comp;
};
const isX = (id) => !id || id.toLowerCase() === "x" || id === "*";
const replaceTildes = (comp, options) => comp.trim().split(/\s+/).map((c2) => {
  return replaceTilde(c2, options);
}).join(" ");
const replaceTilde = (comp, options) => {
  const r = options.loose ? tokens.TILDELOOSE.regex : tokens.TILDE.regex;
  return comp.replace(r, (_, M, m, p, pr) => {
    let ret;
    if (isX(M)) {
      ret = "";
    } else if (isX(m)) {
      ret = `>=${M}.0.0 <${+M + 1}.0.0-0`;
    } else if (isX(p)) {
      ret = `>=${M}.${m}.0 <${M}.${+m + 1}.0-0`;
    } else if (pr) {
      ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
    } else {
      ret = `>=${M}.${m}.${p} <${M}.${+m + 1}.0-0`;
    }
    return ret;
  });
};
const replaceCarets = (comp, options) => comp.trim().split(/\s+/).map((c2) => {
  return replaceCaret(c2, options);
}).join(" ");
const replaceCaret = (comp, options) => {
  const r = options.loose ? tokens.CARETLOOSE.regex : tokens.CARET.regex;
  const z = options.includePrerelease ? "-0" : "";
  return comp.replace(r, (_, M, m, p, pr) => {
    let ret;
    if (isX(M)) {
      ret = "";
    } else if (isX(m)) {
      ret = `>=${M}.0.0${z} <${+M + 1}.0.0-0`;
    } else if (isX(p)) {
      if (M === "0") {
        ret = `>=${M}.${m}.0${z} <${M}.${+m + 1}.0-0`;
      } else {
        ret = `>=${M}.${m}.0${z} <${+M + 1}.0.0-0`;
      }
    } else if (pr) {
      if (M === "0") {
        if (m === "0") {
          ret = `>=${M}.${m}.${p}-${pr} <${M}.${m}.${+p + 1}-0`;
        } else {
          ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
        }
      } else {
        ret = `>=${M}.${m}.${p}-${pr} <${+M + 1}.0.0-0`;
      }
    } else {
      if (M === "0") {
        if (m === "0") {
          ret = `>=${M}.${m}.${p}${z} <${M}.${m}.${+p + 1}-0`;
        } else {
          ret = `>=${M}.${m}.${p}${z} <${M}.${+m + 1}.0-0`;
        }
      } else {
        ret = `>=${M}.${m}.${p} <${+M + 1}.0.0-0`;
      }
    }
    return ret;
  });
};
const replaceXRanges = (comp, options) => {
  return comp.split(/\s+/).map((c2) => {
    return replaceXRange(c2, options);
  }).join(" ");
};
const replaceXRange = (comp, options) => {
  comp = comp.trim();
  const r = options.loose ? tokens.XRANGELOOSE.regex : tokens.XRANGE.regex;
  return comp.replace(r, (ret, gtlt, M, m, p, pr) => {
    const xM = isX(M);
    const xm = xM || isX(m);
    const xp = xm || isX(p);
    const anyX = xp;
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
          M = +M + 1;
          m = 0;
          p = 0;
        } else {
          m = +m + 1;
          p = 0;
        }
      } else if (gtlt === "<=") {
        gtlt = "<";
        if (xm) {
          M = +M + 1;
        } else {
          m = +m + 1;
        }
      }
      if (gtlt === "<") {
        pr = "-0";
      }
      ret = `${gtlt + M}.${m}.${p}${pr}`;
    } else if (xm) {
      ret = `>=${M}.0.0${pr} <${+M + 1}.0.0-0`;
    } else if (xp) {
      ret = `>=${M}.${m}.0${pr} <${M}.${+m + 1}.0-0`;
    }
    return ret;
  });
};
const replaceStars = (comp, options) => {
  return comp.trim().replace(tokens.STAR.regex, "");
};
const replaceGTE0 = (comp, options) => {
  return comp.trim().replace(tokens[options.includePrerelease ? "GTE0PRE" : "GTE0"].regex, "");
};
const hyphenReplace = (incPr) => ($0, from, fM, fm, fp, fpr, fb, to, tM, tm, tp, tpr, tb) => {
  if (isX(fM)) {
    from = "";
  } else if (isX(fm)) {
    from = `>=${fM}.0.0${incPr ? "-0" : ""}`;
  } else if (isX(fp)) {
    from = `>=${fM}.${fm}.0${incPr ? "-0" : ""}`;
  } else if (fpr) {
    from = `>=${from}`;
  } else {
    from = `>=${from}${incPr ? "-0" : ""}`;
  }
  if (isX(tM)) {
    to = "";
  } else if (isX(tm)) {
    to = `<${+tM + 1}.0.0-0`;
  } else if (isX(tp)) {
    to = `<${tM}.${+tm + 1}.0-0`;
  } else if (tpr) {
    to = `<=${tM}.${tm}.${tp}-${tpr}`;
  } else if (incPr) {
    to = `<${tM}.${tm}.${+tp + 1}-0`;
  } else {
    to = `<=${to}`;
  }
  return `${from} ${to}`.trim();
};
const testSet = (set, version2, options) => {
  for (let i = 0; i < set.length; i++) {
    if (!set[i].test(version2)) {
      return false;
    }
  }
  if (version2.prerelease.length && !options.includePrerelease) {
    for (let i = 0; i < set.length; i++) {
      if (set[i].semver === ANY) {
        continue;
      }
      if (set[i].semver.prerelease.length > 0) {
        const allowed = set[i].semver;
        if (allowed.major === version2.major && allowed.minor === version2.minor && allowed.patch === version2.patch) {
          return true;
        }
      }
    }
    return false;
  }
  return true;
};
class Range {
  constructor(range, optionsOrLoose) {
    optionsOrLoose = parseOptions(optionsOrLoose);
    if (range instanceof Range) {
      if (range.loose === !!optionsOrLoose.loose && range.includePrerelease === !!optionsOrLoose.includePrerelease) {
        return range;
      } else {
        return new Range(range.raw, optionsOrLoose);
      }
    }
    this.options = optionsOrLoose;
    this.loose = !!optionsOrLoose.loose;
    this.includePrerelease = !!optionsOrLoose.includePrerelease;
    this.raw = range;
    this.set = range.split("||").map((r) => this.parseRange(r.trim())).filter((c2) => c2.length);
    if (!this.set.length) {
      throw new TypeError(`Invalid SemVer Range: ${range}`);
    }
    if (this.set.length > 1) {
      const first = this.set[0];
      this.set = this.set.filter((c2) => !isNullSet(c2[0]));
      if (this.set.length === 0) {
        this.set = [first];
      } else if (this.set.length > 1) {
        for (const c2 of this.set) {
          if (c2.length === 1 && isAny(c2[0])) {
            this.set = [c2];
            break;
          }
        }
      }
    }
    this.format();
  }
  format() {
    this.range = this.set.map((comps) => {
      return comps.join(" ").trim();
    }).join("||").trim();
    return this.range;
  }
  toString() {
    return this.range;
  }
  parseRange(range) {
    range = range.trim();
    const memoOpts = Object.keys(this.options).join(",");
    const memoKey = `parseRange:${memoOpts}:${range}`;
    if (cache.has(memoKey)) {
      cacheLastAccessTime.set(memoKey, Date.now());
      return cache.get(memoKey);
    }
    const loose = this.options.loose;
    const hr = loose ? tokens.HYPHENRANGELOOSE.regex : tokens.HYPHENRANGE.regex;
    range = range.replace(hr, hyphenReplace(this.options.includePrerelease));
    range = range.replace(tokens.COMPARATORTRIM.regex, comparatorTrimReplace);
    range = range.replace(tokens.TILDETRIM.regex, tildeTrimReplace);
    range = range.replace(tokens.CARETTRIM.regex, caretTrimReplace);
    range = range.split(/\s+/).join(" ");
    let rangeList = range.split(" ").map((comp) => parseComparator(comp, this.options)).join(" ").split(/\s+/).map((comp) => replaceGTE0(comp, this.options));
    if (loose) {
      rangeList = rangeList.filter((comp) => {
        return !!comp.match(tokens.COMPARATORLOOSE.regex);
      });
    }
    const rangeMap = /* @__PURE__ */ new Map();
    const comparators = rangeList.map((comp) => new Comparator(comp, this.options));
    for (const comp of comparators) {
      if (isNullSet(comp)) {
        return [comp];
      }
      rangeMap.set(comp.value, comp);
    }
    if (rangeMap.size > 1 && rangeMap.has("")) {
      rangeMap.delete("");
    }
    const result = [...rangeMap.values()];
    let cacheValue = result;
    cache.set(memoKey, cacheValue);
    cacheLastAccessTime.set(memoKey, Date.now());
    if (cache.size >= cacheLimit) {
      let sortedCacheItems = [...cacheLastAccessTime.entries()].sort((a, b2) => a[1] - b2[1]);
      let oldestKey = sortedCacheItems[0][0];
      cache.delete(oldestKey);
      cacheLastAccessTime.delete(oldestKey);
    }
    return result;
  }
  test(version2) {
    if (!version2) {
      return false;
    }
    if (typeof version2 === "string") {
      try {
        version2 = new SemVer(version2, this.options);
      } catch (er) {
        return false;
      }
    }
    for (let i = 0; i < this.set.length; i++) {
      if (testSet(this.set[i], version2, this.options)) {
        return true;
      }
    }
    return false;
  }
}
function maxSatisfying(versions, range, optionsOrLoose) {
  let max = null;
  let maxSV = null;
  let rangeObj = null;
  try {
    rangeObj = new Range(range, optionsOrLoose);
  } catch (er) {
    return null;
  }
  versions.forEach((v) => {
    if (rangeObj.test(v)) {
      if (!max || maxSV.compare(v) === -1) {
        max = v;
        maxSV = new SemVer(max, optionsOrLoose);
      }
    }
  });
  return max;
}
var semver = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SEMVER_SPEC_VERSION,
  MAX_LENGTH,
  MAX_SAFE_INTEGER,
  MAX_SAFE_COMPONENT_LENGTH,
  get R() {
    return R;
  },
  createToken,
  tokens,
  parseOptions,
  numeric,
  compareIdentifiers,
  SemVer,
  ANY,
  Comparator,
  caretTrimReplace,
  tildeTrimReplace,
  comparatorTrimReplace,
  isNullSet,
  isAny,
  parseComparator,
  isX,
  replaceTildes,
  replaceTilde,
  replaceCarets,
  replaceCaret,
  replaceXRanges,
  replaceXRange,
  replaceStars,
  replaceGTE0,
  hyphenReplace,
  testSet,
  Range,
  maxSatisfying,
  "default": maxSatisfying
}, Symbol.toStringTag, { value: "Module" }));
const getRegistryURL = (input) => {
  const host = "https://registry.npmjs.com";
  let { name, version: version2, path: path2 } = parsePackageName(input);
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
    let versions = Object.keys(pkg.versions);
    let tags = pkg["dist-tags"];
    return { versions, tags };
  } catch (e) {
    console.warn(e);
    throw e;
  }
};
const resolveVersion = async (input) => {
  try {
    let { version: range } = getRegistryURL(input);
    let versionsAndTags = await getPackageVersions(input);
    if (versionsAndTags) {
      const { versions, tags } = versionsAndTags;
      if (range in tags) {
        range = tags[range];
      }
      return versions.includes(range) ? range : maxSatisfying(versions, range);
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
  const wasm2 = await import("./brotli-0b81ed59.mjs");
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
  const _exports = await import("./denoflate-82001750.mjs");
  const { default: init2 } = _exports;
  const { wasm: WASM } = await import("./gzip-dfcdb483.mjs");
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
  const wasm2 = await import("./lz4-fc76edff.mjs");
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
export { ALIAS, ALIAS_NAMESPACE, ALIAS_RESOLVE, AnsiBuffer, BIBIT_UNITS, BIBYTE_UNITS, BIT_UNITS, BYTE_UNITS, CACHE, CACHE_NAME, CDN, CDN_NAMESPACE, CDN_RESOLVE, DEFAULT_CDN_HOST, DefaultConfig, DeprecatedAPIs, EMPTY_EXPORT, ESCAPE_TO_COLOR, EVENTS, EVENTS_OPTS, EXTERNAL, EXTERNALS_NAMESPACE, EasyDefaultConfig, ExternalPackages, FileSystem, HTTP, HTTP_NAMESPACE, HTTP_RESOLVE, INPUT_EVENTS, PLATFORM_AUTO, PolyfillKeys, PolyfillMap, RESOLVE_EXTENSIONS, RE_NON_SCOPED, RE_SCOPED, STATE, VIRTUAL_FILESYSTEM_NAMESPACE, VIRTUAL_FS, render as ansi, bail, mod as base64, mod$3 as brotli, build, bytes, debounce, decode$1 as decode, deepAssign, deepDiff, deepEqual, mod$2 as denoflate, encode$1 as encode, fetchAssets, fetchPkg, bytes as formatBytes, getCDNOrigin, getCDNStyle, getCDNUrl, getESBUILD, getFile, getPackage, getPackageVersions, getPackages, getPureImportPath, getRegistryURL, getRequest, getResolvedPackage, getResolvedPath, getSize, htmlEscape, inferLoader, init, isAlias, isExternal, isObject, isPrimitive, isValidKey, legacy, loop, mod$1 as lz4, lzstring, newRequest, parseConfig, parsePackageName, parseShareQuery, parseTreeshakeExports, path, bytes as prettyBytes, render, resolveExports, resolveImports, resolveVersion, semver, setFile, toLocaleString, toName };
//# sourceMappingURL=index.mjs.map
