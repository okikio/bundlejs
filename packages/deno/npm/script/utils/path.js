"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBareImport = exports.urlJoin = void 0;
const mod_js_1 = require("../deno/path/mod.js");
__exportStar(require("../deno/path/mod.js"), exports);
/**
 * Based on https://github.com/egoist/play-esbuild/blob/main/src/lib/path.ts#L123
 *
 * Support joining paths to a URL
 */
const urlJoin = (urlStr, ...args) => {
    const url = new URL(urlStr);
    url.pathname = (0, mod_js_1.encodeWhitespace)((0, mod_js_1.join)(url.pathname, ...args).replace(/%/g, "%25").replace(/\\/g, "%5C"));
    return url.toString();
};
exports.urlJoin = urlJoin;
/**
 * An import counts as a bare import if it's neither a relative import of an absolute import
 */
const isBareImport = (importStr) => {
    return /^(?!\.).*/.test(importStr) && !(0, mod_js_1.isAbsolute)(importStr);
};
exports.isBareImport = isBareImport;
