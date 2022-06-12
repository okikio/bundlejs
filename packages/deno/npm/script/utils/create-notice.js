"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNotice = void 0;
const esbuild_wasm_1 = require("esbuild-wasm");
const ansi_js_1 = require("./ansi.js");
/**
 * Inspired by https://github.com/egoist/play-esbuild/blob/main/src/lib/esbuild.ts
 * I didn't even know this was exported by esbuild, great job @egoist
*/
const createNotice = async (errors, kind = "error", color = true) => {
    const notices = await (0, esbuild_wasm_1.formatMessages)(errors, { color, kind });
    return notices.map((msg) => !color ? msg : (0, ansi_js_1.ansi)(msg.replace(/(\s+)(\d+)(\s+)\│/g, "\n$1$2$3│")));
};
exports.createNotice = createNotice;
exports.default = exports.createNotice;
