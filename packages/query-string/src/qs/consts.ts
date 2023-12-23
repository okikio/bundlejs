import type { IStringifyOptions } from "./types.ts";
import { encode } from "./utils.ts";
import formats from "./formats.ts";

/**
 * Generates array prefix based on the provided format.
 */
export const ARRAY_PREFIX_GENERATORS: Record<IStringifyOptions['arrayFormat'], string | ((prefix: string, key: string) => string) | ((prefix: string) => string)> = {
  brackets: (prefix: string) => `${prefix}[]`,
  comma: 'comma',
  indices: (prefix: string, key: string) => `${prefix}[${key}]`,
  repeat: (prefix: string) => prefix
};

/**
 * The default format used for stringification.
 */
export const STRINGIFY_DEFAULT_FORMAT = formats.default;

/**
 * Default options for stringification.
 */
export const STRINGIFY_DEFAULTS: IStringifyOptions = {
  addQueryPrefix: false,
  allowDots: false,
  arrayFormat: 'indices',
  charset: 'utf-8',
  charsetSentinel: false,
  delimiter: '&',
  encode: true,
  encoder: encode,
  encodeValuesOnly: false,
  format: STRINGIFY_DEFAULT_FORMAT,
  /** @deprecated */
  indices: false,
  serializeDate: (date: Date) => date.toISOString(),
  skipNulls: false,
  strictNullHandling: false,
};

/**
 * A unique sentinel value used in the stringification process to handle circular references.
 */
export const SENTINEL = {};