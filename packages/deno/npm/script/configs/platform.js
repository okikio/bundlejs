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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PLATFORM_AUTO = void 0;
/**
 * `@bundlejs/core`'s supported platforms
 */
const dntShim = __importStar(require("../_dnt.shims.js"));
/**
 * Automatically chooses the esbuild version to run based off platform heuristics,
 * e.g.
 * - The environment is deno if it supports `globalThis.Deno`
 * - The environment is node if it supports `globalThis.process`
 * - Otherwise the environment is the browser
 *
 */
exports.PLATFORM_AUTO = ("Deno" in dntShim.dntGlobalThis) ? "deno" : ("process" in dntShim.dntGlobalThis) ? "node" : "browser";
