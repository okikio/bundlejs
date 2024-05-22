export * from "@std/encoding/ascii85";
export * from "@std/encoding/base32";
export * from "@std/encoding/base58";
export * from "@std/encoding/base64";
export * from "@std/encoding/base64url";
export * from "@std/encoding/hex";
export * from "@std/encoding/varint";

import * as _ascii85 from "@std/encoding/ascii85";
import * as _base32 from "@std/encoding/base32";
import * as _base58 from "@std/encoding/base58";
import * as _base64 from "@std/encoding/base64";
import * as _base64url from "@std/encoding/base64url";
import * as _hex from "@std/encoding/hex";
import * as _varint from "@std/encoding/varint";

/**
 * ASCII85 encoding/decoding utilities.
 */
export const ascii85 = {
  /**
   * Decodes a string from ASCII85 encoding.
   * @inheritDoc _ascii85.decodeAscii85
   */
  decode: _ascii85.decodeAscii85,

  /**
   * Encodes a string to ASCII85 encoding.
   * @inheritDoc _ascii85.encodeAscii85
   */
  encode: _ascii85.encodeAscii85
};

/**
 * Base32 encoding/decoding utilities.
 */
export const base32 = {
  /**
   * Decodes a string from Base32 encoding.
   * @inheritDoc _base32.decodeBase32
   */
  decode: _base32.decodeBase32,

  /**
   * Encodes a string to Base32 encoding.
   * @inheritDoc _base32.encodeBase32
   */
  encode: _base32.encodeBase32
};

/**
 * Base58 encoding/decoding utilities.
 */
export const base58 = {
  /**
   * Decodes a string from Base58 encoding.
   * @inheritDoc _base58.decodeBase58
   */
  decode: _base58.decodeBase58,

  /**
   * Encodes a string to Base58 encoding.
   * @inheritDoc _base58.encodeBase58
   */
  encode: _base58.encodeBase58
};

/**
 * Base64 encoding/decoding utilities.
 */
export const base64 = {
  /**
   * Decodes a string from Base64 encoding.
   * @inheritDoc _base64.decodeBase64
   */
  decode: _base64.decodeBase64,

  /**
   * Encodes a string to Base64 encoding.
   * @inheritDoc _base64.encodeBase64
   */
  encode: _base64.encodeBase64
};

/**
 * Base64 URL encoding/decoding utilities.
 */
export const base64url = {
  /**
   * Decodes a string from Base64 URL encoding.
   * @inheritDoc _base64url.decodeBase64Url
   */
  decode: _base64url.decodeBase64Url,

  /**
   * Encodes a string to Base64 URL encoding.
   * @inheritDoc _base64url.encodeBase64Url
   */
  encode: _base64url.encodeBase64Url
};

/**
 * Hexadecimal encoding/decoding utilities.
 */
export const hex = {
  /**
   * Decodes a string from hexadecimal encoding.
   * @inheritDoc _hex.decodeHex
   */
  decode: _hex.decodeHex,

  /**
   * Encodes a string to hexadecimal encoding.
   * @inheritDoc _hex.encodeHex
   */
  encode: _hex.encodeHex
};

/**
 * Variable integer encoding/decoding utilities.
 */
export const varint = {
  /**
   * Decodes a variable integer.
   * @inheritDoc _varint.decodeVarint
   */
  decode: _varint.decodeVarint,

  /**
   * Encodes a variable integer.
   * @inheritDoc _varint.encodeVarint
   */
  encode: _varint.encodeVarint
};
