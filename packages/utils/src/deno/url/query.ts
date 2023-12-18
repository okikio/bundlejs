// Based on `https://github.com/unjs/ufo`
import {
  decodeQueryKey,
  decodeQueryValue,
  encodeQueryKey,
  encodeQueryValue,
} from "./encoding.ts";

/**
 * Defines the types that can be used as values in a query string.
 */
export type QueryValue =
  | string
  | number
  | undefined
  | null
  | boolean
  | Array<QueryValue>
  | Record<string, any>;

/**
 * Represents a query object where keys are strings and values are `QueryValue`.
 */
export type QueryObject = Record<string, QueryValue | QueryValue[]>;

/**
 * Represents a parsed query where values are always in string form.
 */
export type ParsedQuery = Record<string, string | string[]>;

/**
 * Parses a query string into an object, with keys and values decoded.
 * 
 * @param parametersString - The query string to parse.
 * @returns An object representing the parsed query.
 */
export function parseQuery<T extends ParsedQuery = ParsedQuery>(
  parametersString = ""
): T {
  const object: ParsedQuery = {};
  if (parametersString[0] === "?") {
    parametersString = parametersString.slice(1);
  }
  for (const parameter of parametersString.split("&")) {
    const s = parameter.match(/([^=]+)=?(.*)/) || [];
    if (s.length < 2) {
      continue;
    }
    const key = decodeQueryKey(s[1]);
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = decodeQueryValue(s[2] || "");
    if (object[key] === undefined) {
      object[key] = value;
    } else if (Array.isArray(object[key])) {
      (object[key] as string[]).push(value);
    } else {
      object[key] = [object[key] as string, value];
    }
  }
  return object as T;
}

/**
 * Encodes a key-value pair into a query string format.
 * 
 * @param key - The key to encode.
 * @param value - The value to encode, can be an array or a single value.
 * @returns The encoded key-value pair as a string.
 */
export function encodeQueryItem(
  key: string,
  value: QueryValue | QueryValue[]
): string {
  if (typeof value === "number" || typeof value === "boolean") {
    value = String(value);
  }
  if (!value) {
    return encodeQueryKey(key);
  }

  if (Array.isArray(value)) {
    return value
      .map((_value) => `${encodeQueryKey(key)}=${encodeQueryValue(_value)}`)
      .join("&");
  }

  return `${encodeQueryKey(key)}=${encodeQueryValue(value)}`;
}

/**
 * Converts a `QueryObject` into a query string, encoding keys and values.
 * 
 * @param query - The `QueryObject` to stringify.
 * @returns The query object as a stringified query string.
 */
export function stringifyQuery(query: QueryObject) {
  return Object.keys(query)
    .filter((k) => query[k] !== undefined)
    .map((k) => encodeQueryItem(k, query[k]))
    .filter(Boolean)
    .join("&");
}