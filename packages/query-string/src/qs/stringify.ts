// @filename: stringify.ts
import type { IStringifyOptions } from './types.ts';
import { ARRAY_PREFIX_GENERATORS, STRINGIFY_DEFAULTS, STRINGIFY_DEFAULT_FORMAT } from './consts.ts';

import { isArray, isBuffer, isNonNullishPrimitive, toSort } from './utils.ts';
import * as JSON5 from '@bundle/utils/utils/json5.ts';
import { formatters } from './formats.ts';

/**
 * Stringifies a value into a query string format, with a given prefix and options.
 * 
 * @param value - The value to be stringified.
 * @param prefix - The prefix to be added to the stringified value.
 * @param opts - Stringification options.
 * @returns The stringified representation of the value.
 */
export function stringify(obj: any, prefix: string, opts: IStringifyOptions = {}): string {
  const prefixGenerators = ARRAY_PREFIX_GENERATORS[opts.arrayFormat];
  const formatter = opts.format in formatters ? formatters[opts.format] : formatters[STRINGIFY_DEFAULT_FORMAT];
  const buildString = (item: any, prefix: string = '', parents: Set<any> = new Set()): string[] => {
    if (parents.has(item)) {
      throw new RangeError('Cyclic object value');
    }

    if (item instanceof Date) {
      item = opts.serializeDate ? opts.serializeDate(item) : item.toISOString();
    } else if (item && typeof item === 'object' && !(item instanceof Date)) {
      parents.add(item);
    }

    // Apply filter if provided and is a function
    if (typeof opts.filter === 'function') {
      item = opts.filter(prefix, item);
    }

    if (item === null) {
      if (opts.strictNullHandling) {
        return [opts.encoder && !opts.encodeValuesOnly ? opts.encoder(prefix, opts.charset, opts.format, "key") : prefix];
      }

      item = '';
    }

    if (isNonNullishPrimitive(item) || isBuffer(item)) {
      const key = opts.encode && !opts.encodeValuesOnly ? opts.encoder(prefix, opts.charset, opts.format, "key") : prefix;
      const value = opts.encode ? opts.encoder(item, opts.charset, opts.format, "value") : String(item);
      return [`${formatter(key)}=${formatter(value)}`];
    }
    if (Array.isArray(item)) {
      const values: string[] = [];
      if (item.length === 0 && opts.arrayFormat === 'brackets') {
        return []; // `${prefix}[]`
      }

      if (opts.arrayFormat === 'comma') {
        const arrayValues = item.map(subItem => {
          if (parents.has(subItem)) {
            throw new RangeError('Cyclic object value');
          }

          if (subItem instanceof Date) {
            subItem = opts.serializeDate ? opts.serializeDate(subItem) : subItem.toISOString();
          } else if (subItem && typeof subItem === 'object' && !(subItem instanceof Date)) {
            parents.add(subItem);
          }

          // Apply filter if provided and is a function
          if (typeof opts.filter === 'function') {
            subItem = opts.filter(prefix, subItem);
          }

          if (subItem === null) {
            if (opts.strictNullHandling) {
              return [null];
            }

            subItem = '';
          }

          if (isNonNullishPrimitive(subItem) || isBuffer(subItem)) {
            const value = opts.encode ? opts.encoder(subItem, opts.charset, opts.format, "value") : String(subItem);
            return formatter(value);
          }

          // TODO: Create an upgraded version of JSON5, which supports JSON6 features and more...in a clean package
          if (Array.isArray(subItem) || typeof subItem === "object") {
            subItem = JSON5.stringify(subItem);

            const value = opts.encode ? opts.encoder(subItem, opts.charset, opts.format, "value") : String(subItem);
            return formatter(value);
          }

          return null;
        }).filter(subItem => !(opts.skipNulls && subItem == null));

        const delimiter = opts.encode && !opts.encodeValuesOnly ? opts.encoder(',', opts.charset, opts.format) : String(',');
        const joinedArray = arrayValues.join(delimiter);

        const key = opts.encode && !opts.encodeValuesOnly ? opts.encoder(prefix, opts.charset, opts.format, "key") : prefix;
        if (opts.commaRoundTrip && item.length === 1) {
          return [`${formatter(key)}[]=${(joinedArray)}`];
        }

        console.log({
          prefix,
          arrayValues
        })
        return arrayValues.length > 0 ? [`${formatter(key)}=${(joinedArray)}`] : [];
      }

      item.forEach((subItem, index) => {
        if (subItem === undefined || (opts.skipNulls && subItem == null)) return;

        const arrayPrefix = typeof prefixGenerators === 'function' ? prefixGenerators(prefix, `${index}`) : prefix;
        values.push(...buildString(subItem, arrayPrefix, parents));
      });

      return values;
    }

    if (typeof item === 'object') {
      const values: string[] = [];
      toSort(Object.keys(item), opts.sort).forEach(key => {
        if (Array.isArray(opts.filter) && !opts.filter.includes(key)) return;

        const value = item[key];
        if (value === undefined || (opts.skipNulls && value == null)) return;

        const keyPrefix = opts.allowDots ? `${prefix}.${key}` : `${prefix}[${key}]`;
        values.push(...buildString(value, keyPrefix, parents));
      });

      return values;
    }

    return [];
  };

  const queryString = buildString(obj, prefix).join(opts.delimiter);
  return queryString;
}

/**
 * Normalizes the options for stringify function.
 * @param opts - The options to normalize.
 * @returns The normalized options as a StringifyOptions object.
 */
export function normalizeStringifyOptions(opts: Partial<IStringifyOptions & { commaRoundTrip?: boolean }>) {
  if (!opts) return STRINGIFY_DEFAULTS;
  if (opts.encoder !== undefined && typeof opts.encoder !== 'function') {
    throw new TypeError('Encoder has to be a function.');
  }

  const charset = opts.charset ?? STRINGIFY_DEFAULTS.charset;
  if (charset !== 'utf-8' && charset !== 'iso-8859-1') {
    throw new TypeError('The charset option must be either utf-8, iso-8859-1, or undefined');
  }

  const format = opts.format in formatters ? opts.format : STRINGIFY_DEFAULT_FORMAT;
  const filter = typeof opts.filter === 'function' || isArray(opts.filter) ? opts.filter : STRINGIFY_DEFAULTS.filter;
  const arrayFormat = opts.arrayFormat in ARRAY_PREFIX_GENERATORS ? opts.arrayFormat : (
    'indices' in opts ? (opts.indices ? 'indices' : 'repeat') : STRINGIFY_DEFAULTS.arrayFormat
  );

  if (
    'commaRoundTrip' in opts &&
    typeof opts.commaRoundTrip !== 'boolean' &&
    typeof opts.commaRoundTrip !== "undefined"
  ) {
    throw new TypeError('`commaRoundTrip` must be a boolean, or absent');
  }

  return {
    addQueryPrefix: opts.addQueryPrefix ?? STRINGIFY_DEFAULTS.addQueryPrefix,
    allowDots: opts.allowDots ?? STRINGIFY_DEFAULTS.allowDots,
    arrayFormat,
    charset,
    charsetSentinel: opts.charsetSentinel ?? STRINGIFY_DEFAULTS.charsetSentinel,
    commaRoundTrip: opts.commaRoundTrip,
    delimiter: opts.delimiter ?? STRINGIFY_DEFAULTS.delimiter,
    encode: opts.encode ?? STRINGIFY_DEFAULTS.encode,
    encoder: opts.encoder ?? STRINGIFY_DEFAULTS.encoder,
    encodeValuesOnly: opts.encodeValuesOnly ?? STRINGIFY_DEFAULTS.encodeValuesOnly,
    filter,
    format,
    indices: opts.indices ?? STRINGIFY_DEFAULTS.indices,
    serializeDate: opts.serializeDate ?? STRINGIFY_DEFAULTS.serializeDate,
    skipNulls: opts.skipNulls ?? STRINGIFY_DEFAULTS.skipNulls,
    strictNullHandling: opts.strictNullHandling ?? STRINGIFY_DEFAULTS.strictNullHandling,
    sort: opts.sort ?? undefined,
  };
}

/**
 * Stringifies an object into a query string format with full options.
 * 
 * @param obj - The object to be stringified.
 * @param options - Options for stringification.
 * @returns The stringified representation of the object.
 */
export default function fullStringify(obj: any, options: IStringifyOptions = {}): string {
  const opts = normalizeStringifyOptions(options);

  // Filter the object if a filter is provided
  if (isArray(opts.filter)) {
    obj = Object.keys(obj)
      .filter(key => (opts.filter as string[]).includes(key))
      .reduce((acc, key) => ({ ...acc, [key]: obj[key] }), {});
  } else if (typeof opts.filter === 'function') {
    obj = opts.filter('', obj);
  }

  // Handle non-object types or null
  if (typeof obj !== 'object' || obj === null) {
    return '';
  }

  // Build the query string using the stringify function
  const keys = toSort(Object.keys(obj), opts.sort).map(key => {
    return stringify(obj[key], key, { ...opts, encoder: opts.encode ? opts.encoder : null });
  }).filter(x => x.length > 0);

  // Concatenate the parts of the query string
  const queryString = keys.join(opts.delimiter);
  const isQuery = queryString.length > 0;
  const prefix = opts.addQueryPrefix && isQuery ? '?' : '';

  // Add charset sentinel if necessary
  if (opts.charsetSentinel && isQuery) {
    const sentinel = opts.charset === 'iso-8859-1' ? 'utf8=%26%2310003%3B&' : 'utf8=%E2%9C%93&';
    return prefix + sentinel + queryString;
  }

  return prefix + queryString;
}