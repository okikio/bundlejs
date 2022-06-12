"use strict";
// export const { encode } = new TextEncoder();
// export const { decode } = new TextDecoder();
Object.defineProperty(exports, "__esModule", { value: true });
exports.decode = exports.encode = void 0;
const encode = (str) => new TextEncoder().encode(str);
exports.encode = encode;
const decode = (buf) => new TextDecoder().decode(buf);
exports.decode = decode;
