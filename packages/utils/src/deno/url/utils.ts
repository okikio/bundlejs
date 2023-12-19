import type { QueryObject, ParsedQuery } from "./query.ts";
import { parseQuery, stringifyQuery } from "./query.ts";
import { decode } from "./encoding.ts";

/**
 * Checks if the given string represents a relative URL.
 * 
 * @param inputString - The URL string to check.
 * @returns `true` if the string is a relative URL, otherwise `false`.
 */
export function isRelative(inputString: string) {
  // Checks if the string starts with './' or '../'.
  return ["./", "../"].some((string_) => inputString.startsWith(string_));
}

/**
 * Regular expressions for identifying relative URLs.
 * These patterns are used to detect URLs that start with "./" or "../".
 * - PROTOCOL_STRICT_REGEX: Matches URLs with a strict protocol format.
 * - PROTOCOL_REGEX: Matches URLs with a more flexible protocol format.
 * - PROTOCOL_RELATIVE_REGEX: Matches protocol-relative URLs (e.g., "//example.com").
 */
export const PROTOCOL_STRICT_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{1,2})/;
export const PROTOCOL_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{2})?/;
export const PROTOCOL_RELATIVE_REGEX = /^([/\\]\s*){2,}[^/\\]/;

/**
 * Options for the hasProtocol function.
 * - acceptRelative: If true, relative protocols are accepted (e.g., "//example.com").
 * - strict: If true, uses strict protocol matching.
 */
export interface HasProtocolOptions {
  acceptRelative?: boolean;
  strict?: boolean;
}

/**
 * Checks if a given string contains a URL protocol.
 * 
 * @param inputString - The string to check.
 * @param opts - Optional settings to customize the check.
 * @returns `true` if a protocol is found, otherwise `false`.
 */
export function hasProtocol(
  inputString: string,
  opts?: HasProtocolOptions
): boolean;

/**
 * @deprecated Use hasProtocol(inputString, { acceptRelative: true }) instead.
 */
export function hasProtocol(
  inputString: string,
  acceptRelative: boolean
): boolean;

export function hasProtocol(
  inputString: string,
  opts: boolean | HasProtocolOptions = {}
): boolean {
  // Handling deprecated boolean option.
  if (typeof opts === "boolean") {
    opts = { acceptRelative: opts };
  }

  // Check for strict protocol pattern.
  if (opts.strict) {
    return PROTOCOL_STRICT_REGEX.test(inputString);
  }

  // Check for general protocol pattern and optionally relative URLs.
  return (
    PROTOCOL_REGEX.test(inputString) ||
    (opts.acceptRelative ? PROTOCOL_RELATIVE_REGEX.test(inputString) : false)
  );
}

/**
 * Regular expression to identify potentially harmful script protocols.
 * Used primarily for security checks.
 * e.g This regex can be used to detect potentially dangerous protocols like 'javascript:'.
 */
export const PROTOCOL_SCRIPT_RE = /^[\s\0]*(blob|data|javascript|vbscript):$/i;

/**
 * Checks if the given protocol is a script protocol (e.g., javascript:).
 * 
 * @param protocol - The protocol string to check.
 * @returns `true` if the protocol is a script protocol, otherwise `false`.
 */
export function isScriptProtocol(protocol?: string) {
  return !!protocol && PROTOCOL_SCRIPT_RE.test(protocol);
}

/**
 * Regular expression to detect a trailing slash in a URL.
 * Used in functions that handle trailing slashes in URLs.
 */
export const TRAILING_SLASH_RE = /\/$|\/\?|\/#/;

/**
 * Checks if a given URL has a trailing slash.
 * 
 * @param input - The URL string to check.
 * @param respectQueryAndFragment - Whether to consider query and fragment in the URL.
 * @returns `true` if the URL has a trailing slash, otherwise `false`.
 */
export function hasTrailingSlash(
  input = "",
  respectQueryAndFragment?: boolean
): boolean {
  if (!respectQueryAndFragment) {
    return input.endsWith("/");
  }
  return TRAILING_SLASH_RE.test(input);
}

/**
 * Removes the trailing slash from a URL if present.
 * 
 * @param input - The URL string to modify.
 * @param respectQueryAndFragment - Whether to consider query and fragment in removing.
 * @returns The URL string without a trailing slash.
 */
export function withoutTrailingSlash(
  input = "",
  respectQueryAndFragment?: boolean
): string {
  if (!respectQueryAndFragment) {
    return (hasTrailingSlash(input) ? input.slice(0, -1) : input) || "/";
  }
  if (!hasTrailingSlash(input, true)) {
    return input || "/";
  }
  let path = input;
  let fragment = "";
  const fragmentIndex = input.indexOf("#");
  if (fragmentIndex >= 0) {
    path = input.slice(0, fragmentIndex);
    fragment = input.slice(fragmentIndex);
  }
  const [s0, ...s] = path.split("?");
  return (
    (s0.slice(0, -1) || "/") +
    (s.length > 0 ? `?${s.join("?")}` : "") +
    fragment
  );
}

/**
 * Ensures a URL ends with a trailing slash.
 * 
 * @param input - The URL string to modify.
 * @param respectQueryAndFragment - Whether to consider query and fragment in adding.
 * @returns The URL string with a trailing slash.
 */
export function withTrailingSlash(
  input = "",
  respectQueryAndFragment?: boolean
): string {
  if (!respectQueryAndFragment) {
    return input.endsWith("/") ? input : input + "/";
  }
  if (hasTrailingSlash(input, true)) {
    return input || "/";
  }
  let path = input;
  let fragment = "";
  const fragmentIndex = input.indexOf("#");
  if (fragmentIndex >= 0) {
    path = input.slice(0, fragmentIndex);
    fragment = input.slice(fragmentIndex);
    if (!path) {
      return fragment;
    }
  }
  const [s0, ...s] = path.split("?");
  return s0 + "/" + (s.length > 0 ? `?${s.join("?")}` : "") + fragment;
}

/**
 * Checks if a given URL has a leading slash.
 * 
 * @param input - The URL string to check.
 * @returns `true` if the URL starts with a slash, otherwise `false`.
 */
export function hasLeadingSlash(input = ""): boolean {
  return input.startsWith("/");
}

/**
 * Removes the leading slash from a URL if present.
 * 
 * @param input - The URL string to modify.
 * @returns The URL string without a leading slash.
 */
export function withoutLeadingSlash(input = ""): string {
  return (hasLeadingSlash(input) ? input.slice(1) : input) || "/";
}

/**
 * Ensures a URL starts with a leading slash.
 * 
 * @param input - The URL string to modify.
 * @returns The URL string with a leading slash.
 */
export function withLeadingSlash(input = ""): string {
  return hasLeadingSlash(input) ? input : "/" + input;
}

/**
 * Removes double slashes from a URL, except in the protocol part.
 * 
 * @param input - The URL string to clean.
 * @returns The URL string with double slashes removed.
 */
export function cleanDoubleSlashes(input = ""): string {
  return input
    .split("://")
    .map((string_) => string_.replace(/\/{2,}/g, "/"))
    .join("://");
}

/**
 * Resolves a URL against a base URL.
 * 
 * @param input - The URL string to resolve.
 * @param base - The base URL string.
 * @returns The resolved URL.
 */
export function withBase(input: string, base: string) {
  if (isEmptyURL(base) || hasProtocol(input)) {
    return input;
  }
  const _base = withoutTrailingSlash(base);
  if (input.startsWith(_base)) {
    return input;
  }
  return joinURL(_base, input);
}

/**
 * Removes the base part from a URL.
 * 
 * @param input - The URL string to modify.
 * @param base - The base URL string to remove.
 * @returns The URL string without the base part.
 */
export function withoutBase(input: string, base: string) {
  if (isEmptyURL(base)) {
    return input;
  }
  const _base = withoutTrailingSlash(base);
  if (!input.startsWith(_base)) {
    return input;
  }
  const trimmed = input.slice(_base.length);
  return trimmed[0] === "/" ? trimmed : "/" + trimmed;
}

/**
 * Appends query parameters to a URL.
 * 
 * @param input - The URL string to modify.
 * @param query - The query parameters to append.
 * @returns The URL string with query parameters appended.
 */
export function withQuery(input: string, query: QueryObject): string {
  const parsed = new URL(input);
  const mergedQuery = { ...parseQuery(parsed.search), ...query };
  parsed.search = stringifyQuery(mergedQuery);
  return parsed.href;
}

/**
 * Extracts query parameters from a URL.
 * 
 * @param input - The URL string to parse.
 * @returns The extracted query parameters as an object.
 */
export function getQuery<T extends ParsedQuery = ParsedQuery>(
  input: string
): T {
  return parseQuery<T>(new URL(input).search);
}

/**
 * Checks if a URL is empty or only contains a root slash.
 * 
 * @param url - The URL string to check.
 * @returns `true` if the URL is empty or only a slash, otherwise `false`.
 */
export function isEmptyURL(url: string) {
  return !url || url === "/";
}

/**
 * Checks if a URL is not empty and not just a root slash.
 * 
 * @param url - The URL string to check.
 * @returns `true` if the URL is non-empty and not just a slash, otherwise `false`.
 */
export function isNonEmptyURL(url: string) {
  return url && url !== "/";
}

/**
 * Regular expression for detecting and removing leading slashes in URL segments.
 * Utilized in functions that join multiple URL segments.
 */
export const JOIN_LEADING_SLASH_RE = /^\.?\//;

/**
 * Joins multiple URL segments with a base URL.
 * 
 * @param base - The base URL string.
 * @param input - The URL segments to join.
 * @returns The joined URL.
 */
export function joinURL(base: string, ...input: string[]): string {
  let url = base || "";

  for (const segment of input.filter((url) => isNonEmptyURL(url))) {
    if (url) {
      // TODO: Handle .. when joining
      const _segment = segment.replace(JOIN_LEADING_SLASH_RE, "");
      url = withTrailingSlash(url) + _segment;
    } else {
      url = segment;
    }
  }

  return url;
}

/**
 * Appends the HTTP protocol to a URL.
 * 
 * @param input - The URL string to modify.
 * @returns The URL string with the HTTP protocol.
 */
export function withHttp(input: string): string {
  return withProtocol(input, "http://");
}

/**
 * Appends the HTTPS protocol to a URL.
 * 
 * @param input - The URL string to modify.
 * @returns The URL string with the HTTPS protocol.
 */
export function withHttps(input: string): string {
  return withProtocol(input, "https://");
}

/**
 * Removes any protocol from a URL.
 * 
 * @param input - The URL string to modify.
 * @returns The URL string without any protocol.
 */
export function withoutProtocol(input: string): string {
  return withProtocol(input, "");
}

/**
 * Adds or replaces the protocol of a URL.
 * 
 * @param input - The URL string to modify.
 * @param protocol - The protocol to add or replace with.
 * @returns The URL string with the specified protocol.
 */
export function withProtocol(input: string, protocol: string): string {
  const match = input.match(PROTOCOL_REGEX);
  if (!match) {
    return protocol + input;
  }
  return protocol + input.slice(match[0].length);
}

/**
 * Appends a URL to another URL, merging their components. It modifies the base URL.
 * 
 * @param base - The base URL object.
 * @param url - The URL object to append.
 * @returns The modified base URL object.
 */
export function appendUrl(base: URL, url: URL) {
  if (url.protocol.length) {
    throw new Error("Cannot append a URL with protocol");
  }

  if (url.search) {
    const _query = Object.assign(parseQuery(base.search), parseQuery(url.search));
    base.search = stringifyQuery(_query);
  }

  if (url.pathname) {
    base.pathname =
      withTrailingSlash(this.pathname) + withoutLeadingSlash(url.pathname);
  }

  if (url.hash) {
    base.hash = url.hash;
  }

  return base;
}

/**
 * Creates a URL object from a string.
 * 
 * @param input - The URL string to create an object from.
 * @returns The created URL object.
 */
export function createURL(input: string): URL {
  return new URL(input);
}

/**
 * Normalizes a URL string to its absolute form.
 * 
 * @param input - The URL string to normalize.
 * @returns The normalized URL string.
 */
export function normalizeURL(input: string): string {
  return createURL(input).toString();
}

/**
 * Resolves one or more URLs against a base URL.
 * 
 * @param base - The base URL string.
 * @param input - The URL strings to resolve against the base.
 * @returns The resolved URL string.
 */
export function resolveURL(base: string, ...input: string[]): string {
  const url = createURL(base);

  for (const index of input.filter((url) => isNonEmptyURL(url))) {
    appendUrl(url, createURL(index));
  }

  return url.toString();
}

/**
 * Checks if two paths are the same after normalization.
 * 
 * @param p1 - The first path to compare.
 * @param p2 - The second path to compare.
 * @returns `true` if the paths are the same, otherwise `false`.
 */
export function isSamePath(p1: string, p2: string) {
  return decode(withoutTrailingSlash(p1)) === decode(withoutTrailingSlash(p2));
}

/**
 * Interface defining options for URL comparison.
 * - trailingSlash: Consider trailing slash in comparison.
 * - leadingSlash: Consider leading slash in comparison.
 * - encoding: Consider URL encoding in comparison.
 */
export interface CompareURLOptions {
  trailingSlash?: boolean;
  leadingSlash?: boolean;
  encoding?: boolean;
}

/**
 * Compares two URLs for equality with configurable options.
 * 
 * @param a - The first URL to compare.
 * @param b - The second URL to compare.
 * @param options - Options to configure the comparison.
 * @returns `true` if the URLs are equal based on the options, otherwise `false`.
 */
export function isEqual(a: string, b: string, options: CompareURLOptions = {}) {
  if (!options.trailingSlash) {
    a = withTrailingSlash(a);
    b = withTrailingSlash(b);
  }
  if (!options.leadingSlash) {
    a = withLeadingSlash(a);
    b = withLeadingSlash(b);
  }
  if (!options.encoding) {
    a = decode(a);
    b = decode(b);
  }
  return a === b;
}