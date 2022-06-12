/* tslint:disable */
/* eslint-disable */
/**
* @param {Uint8Array} input
* @param {number | undefined} compression
* @returns {Uint8Array}
*/
import * as dntShim from "../../../_dnt.shims.js";

export function deflate(input: Uint8Array, compression?: number): Uint8Array;
/**
* @param {Uint8Array} input
* @returns {Uint8Array}
*/
export function inflate(input: Uint8Array): Uint8Array;
/**
* @param {Uint8Array} input
* @param {number | undefined} compression
* @returns {Uint8Array}
*/
export function gzip(input: Uint8Array, compression?: number): Uint8Array;
/**
* @param {Uint8Array} input
* @returns {Uint8Array}
*/
export function gunzip(input: Uint8Array): Uint8Array;
/**
* @param {Uint8Array} input
* @param {number | undefined} compression
* @returns {Uint8Array}
*/
export function zlib(input: Uint8Array, compression?: number): Uint8Array;
/**
* @param {Uint8Array} input
* @returns {Uint8Array}
*/
export function unzlib(input: Uint8Array): Uint8Array;

export type InitInput = RequestInfo | URL | dntShim.Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly deflate: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly inflate: (a: number, b: number, c: number) => void;
  readonly gzip: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly gunzip: (a: number, b: number, c: number) => void;
  readonly zlib: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly unzlib: (a: number, b: number, c: number) => void;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_malloc: (a: number) => number;
  readonly __wbindgen_free: (a: number, b: number) => void;
}

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;