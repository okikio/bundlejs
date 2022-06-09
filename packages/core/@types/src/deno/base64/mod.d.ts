/**
 * Converts given data with base64 encoding
 * @param data input to encode
 */
export declare function encode(data: string | ArrayBuffer): string;
/**
 * Converts given base64 encoded data back to original
 * @param data input to decode
 */
export declare function decode(data: string): ArrayBuffer;
/**
 * Decodes data assuming the output is in string type
 * @param data input to decode
 */
export declare function decodeString(data: string): string;
