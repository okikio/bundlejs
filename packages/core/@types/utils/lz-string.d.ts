/**
 * Based on `@amoutonbrady/lz-string` (https://npmjs.com/@amoutonbrady/lz-string) by @amoutonbrady (https://github.com/amoutonbrady)
 */
export declare const keyStrBase64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
export declare const keyStrUriSafe = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$";
export declare const baseReverseDic: Record<string, Record<string, number>>;
export declare function getBaseValue(alphabet: string, character: string): number;
export declare function compressToBase64(input: string): string;
export declare function decompressFromBase64(input: string): string | null;
export declare function compressToURL(input: string): string;
export declare function decompressFromURL(input: string): string | null;
export declare function compress(uncompressed: string): string;
export declare function decompress(compressed: null | string): string | null;
/**
 * @internal
 */
export declare function _compress(uncompressed: null | string, bitsPerChar: number, getCharFromInt: (int: number) => string): string;
/**
 * @internal
 */
export declare function _decompress(length: number, resetValue: number, getNextValue: (index: number) => number): string;
