"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWASM = exports.wasm = exports.unzlib = exports.zlib = exports.gunzip = exports.gzip = exports.inflate = exports.deflate = void 0;
// https://deno.land/x/denoflate@1.2.1/mod.ts
var denoflate_js_1 = require("./pkg/denoflate.js");
Object.defineProperty(exports, "deflate", { enumerable: true, get: function () { return denoflate_js_1.deflate; } });
Object.defineProperty(exports, "inflate", { enumerable: true, get: function () { return denoflate_js_1.inflate; } });
Object.defineProperty(exports, "gzip", { enumerable: true, get: function () { return denoflate_js_1.gzip; } });
Object.defineProperty(exports, "gunzip", { enumerable: true, get: function () { return denoflate_js_1.gunzip; } });
Object.defineProperty(exports, "zlib", { enumerable: true, get: function () { return denoflate_js_1.zlib; } });
Object.defineProperty(exports, "unzlib", { enumerable: true, get: function () { return denoflate_js_1.unzlib; } });
const denoflate_js_2 = __importDefault(require("./pkg/denoflate.js"));
const denoflate_bg_wasm_js_1 = require("./pkg/denoflate_bg.wasm.js");
const getWASM = async () => {
    if (exports.wasm)
        return exports.wasm;
    // @ts-ignore: Not sure why this errors out
    return (exports.wasm = await (0, denoflate_js_2.default)(denoflate_bg_wasm_js_1.wasm));
};
exports.getWASM = getWASM;
exports.default = exports.wasm;
