// Based on `https://github.com/unjs/ufo`
import type { QueryValue } from "./query";

// Utils used from https://github.com/vuejs/vue-router-next/blob/master/src/encoding.ts (Author @posva)

// Regular expressions for various characters that need special handling in URLs.
export const HASH_RE = /#/g; // %23 (hash)
export const AMPERSAND_RE = /&/g; // %26 (ampersand)
export const SLASH_RE = /\//g; // %2F (slash)
export const EQUAL_RE = /=/g; // %3D (equal)
export const IM_RE = /\?/g; // %3F (question mark)
export const PLUS_RE = /\+/g; // %2B (plus)

export const ENC_CARET_RE = /%5e/gi; // ^
export const ENC_BACKTICK_RE = /%60/gi; // `
export const ENC_CURLY_OPEN_RE = /%7b/gi; // {
export const ENC_PIPE_RE = /%7c/gi; // |
export const ENC_CURLY_CLOSE_RE = /%7d/gi; // }

export const ENC_SPACE_RE = /%20/gi;
export const ENC_SLASH_RE = /%2f/gi;
export const ENC_ENC_SLASH_RE = /%252f/gi;

/**
 * Encodes a string or number for inclusion in a URL, with certain characters
 * remaining unencoded.
 * 
 * @param text - The input string or number to encode.
 * @returns The encoded version of the input.
 */
export function encode(text: string | number): string {
  return encodeURI("" + text).replace(ENC_PIPE_RE, "|");
}

/**
 * Encodes a string for use in the hash part of a URL, ensuring special
 * characters are handled correctly.
 * 
 * @param text - The string to encode for a URL hash.
 * @returns The encoded hash string.
 */
export function encodeHash(text: string): string {
  return encode(text)
    .replace(ENC_CURLY_OPEN_RE, "{")
    .replace(ENC_CURLY_CLOSE_RE, "}")
    .replace(ENC_CARET_RE, "^");
}

/**
 * Encode characters that need to be encoded query values on the query
 * section of the URL.
 *
 * @param input - string to encode
 * @returns encoded string
 */
export function encodeQueryValue(input: QueryValue): string {
  return (
    encode(typeof input === "string" ? input : JSON.stringify(input))
      // Encode the space as +, encode the + to differentiate it from the space
      .replace(PLUS_RE, "%2B")
      .replace(ENC_SPACE_RE, "+")
      .replace(HASH_RE, "%23")
      .replace(AMPERSAND_RE, "%26")
      .replace(ENC_BACKTICK_RE, "`")
      .replace(ENC_CARET_RE, "^")
  );
}

/**
 * Like `encodeQueryValue` but also encodes the `=` character.
 *
 * @param text - string to encode
 */
export function encodeQueryKey(text: string | number): string {
  return encodeQueryValue(text).replace(EQUAL_RE, "%3D");
}

/**
 * Encode characters that need to be encoded on the path section of the URL.
 *
 * @param text - string to encode
 * @returns encoded string
 */
export function encodePath(text: string | number): string {
  return encode(text)
    .replace(HASH_RE, "%23")
    .replace(IM_RE, "%3F")
    .replace(ENC_ENC_SLASH_RE, "%2F")
    .replace(AMPERSAND_RE, "%26")
    .replace(PLUS_RE, "%2B");
}

/**
 * Encode characters that need to be encoded on the path section of the URL as a
 * param. This function encodes everything {@link encodePath} does plus the
 * slash (`/`) character.
 *
 * @param text - string to encode
 * @returns encoded string
 */
export function encodeParam(text: string | number): string {
  return encodePath(text).replace(SLASH_RE, "%2F");
}

// Decoding Functions
/**
 * Decodes a URL component, safely returning the original text if decoding fails.
 * 
 * @param text - The encoded string to decode.
 * @returns The decoded string, or the original string if decoding fails.
 */
export function decode(text: string | number = ""): string {
  try {
    return decodeURIComponent("" + text);
  } catch {
    return "" + text;
  }
}

/**
 * Decode path section of URL (consistent with encodePath for slash encoding).
 *
 * @param text - string to decode
 * @returns decoded string
 */
export function decodePath(text: string): string {
  return decode(text.replace(ENC_SLASH_RE, "%252F"));
}

/**
 * Decode query key (consistent with encodeQueryKey for plus encoding).
 * Created different method for decoding key to avoid future changes on value encode/decode.
 * @param text - string to decode
 * @returns decoded string
 */
export function decodeQueryKey(text: string): string {
  return decode(text.replace(PLUS_RE, " "));
}

/**
 * Decode query value (consistent with encodeQueryValue for plus encoding).
 *
 * @param text - string to decode
 * @returns decoded string
 */
export function decodeQueryValue(text: string): string {
  return decode(text.replace(PLUS_RE, " "));
}