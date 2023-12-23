// Based on https://github.com/sindresorhus/query-string
import type { StringifyOptions, ParseOptions, ParsedQuery, ParsedUrl, UrlObject, Stringifiable, StringifiableRecord } from './types.ts';
import { decodeUriComponent } from './decode-uri-component.ts';
import { splitOnFirst } from './split-on-first.ts';
import { includeKeys, type PredicateFunction } from './filter-obj.ts';

const ENCODE_FRAGMENT_IDENTIFIER = Symbol('ENCODE_FRAGMENT_IDENTIFIER');

/**
 * Strictly encodes a URI component by replacing certain characters.
 * @param value - The string to encode.
 * @returns The encoded string.
 */
const STRICT_URI_ENCODE = (string: string): string =>
  encodeURIComponent(string).replace(/[!'()*]/g, x => `%${x.charCodeAt(0).toString(16).toUpperCase()}`);

/**
 * Checks if a value is null or undefined.
 * @param value - The value to check.
 * @returns `true` if the value is null or undefined, `false` otherwise.
 */
const isNullOrUndefined = (value: unknown): boolean => value === null || value === undefined;

/**
 * Checks if a value should be skipped based on the provided options.
 * @param value - The value to be checked.
 * @param options - The stringify options.
 * @returns `true` if the value should be skipped, `false` otherwise.
 */
const shouldSkipValue = (value: unknown, options: StringifyOptions): boolean => {
  return value === undefined
    || (options.skipNull && value === null)
    || (options.skipEmptyString && value === '');
};

type ArrayFormatEncoder = (key: string, value: unknown) => string;

/**
 * Creates an encoder function based on the specified array format options.
 * @param options - The options specifying how to format arrays.
 * @returns An array encoder function.
 */
const encoderForArrayFormat = (options: StringifyOptions): ArrayFormatEncoder => {
  const keyValueSep = options.arrayFormat === 'bracket-separator' ? '[]=' : '=';
  return (key, value) => {
    key = encode(key, options);
    switch (options.arrayFormat) {
      case 'index':
      case 'bracket':
      case 'colon-list-separator': {
        return (value as unknown[])
          .filter(item => !shouldSkipValue(item, options))
          .map((item, idx) => {
            if (item === null) {
              return ({
                'index': `${key}[${idx}]`,
                'bracket': `${key}[]`,
                'colon-list-separator': `${key}:list=`,
              })[options.arrayFormat];
            }

            item = encode(item as string, options);
            return ({
              'index': `${key}[${idx}]=${item}`,
              'bracket': `${key}[]=${item}`,
              'colon-list-separator': `${key}:list=${item}`,
            })[options.arrayFormat]
          }).join('&');
      }


      case 'comma':
      case 'separator':
      case 'bracket-separator': {
        const arrValue = value as unknown[];

        // Handle empty array specifically for 'bracket-separator'
        if (arrValue.length === 0 && options.arrayFormat === 'bracket-separator') {
          return `${key}[]`;
        }

        // Join array values with the arrayFormatSeparator or '&'
        const joinWith = options.arrayFormatSeparator;
        const encodedValues = arrValue
          .filter(item => !shouldSkipValue(item, options))
          .map((item, idx) => {
            if (item === null) return '';

            item = encode(item as string, options);
            if (idx === 0) 
              return `${key}${keyValueSep}${item}`
            
            return item;
      })
          .join(joinWith);
        return encodedValues;
      }

      default: {
        return (value as unknown[])
          .filter(item => !shouldSkipValue(item, options))
          .map((item) => {
            if (item === null) return key;

            item = encode(item as string, options);
            return `${key}=${item}`
          }).join('&');
      }
    }
  };
};

type ParserFunction = (key: string, value: string | null, accumulator: ParsedQuery) => void;

/**
 * Creates a parser function based on the specified array format options.
 * @param options - The options specifying how to format arrays during parsing.
 * @returns A parser function.
 */
const parserForArrayFormat = (options: ParseOptions): ParserFunction => {
  const keySuffixPattern = {
    'index': /\[(\d*)]$/,
    'bracket': /(\[])$/,
    'colon-list-separator': /(:list)$/,
    'bracket-separator': /(\[])$/
  };

  return (key, value, accumulator) => {
    let result: RegExpExecArray | null;
    const pattern = keySuffixPattern[options.arrayFormat];

    if (pattern) {
      result = pattern.exec(key);
      key = key.replace(pattern, '');
    }

    switch (options.arrayFormat) {
      case 'index':
      case 'bracket':
      case 'colon-list-separator':
      case 'bracket-separator': {
        if (!result) {
          accumulator[key] = value;
          return;
        }

        if (accumulator[key] === undefined) {
          accumulator[key] = (options.arrayFormat === 'index') ? {} : [];
        }

        if (options.arrayFormat === 'index') {
          accumulator[key][result[1]] = value;
        } else {
          const arrayValue = value === null ? [] : (
            options.arrayFormat === 'bracket-separator' ? [value] : 
              value
                .split(options.arrayFormatSeparator)
                .map(item => decode(item, options))
          );

          accumulator[key] = [...(accumulator[key] as string[]), ...arrayValue];
        }
        break;
      }

      case 'comma':
      case 'separator': {
        const isArray = typeof value === 'string' && value.includes(options.arrayFormatSeparator);
        const isEncodedArray = typeof value === 'string' && !isArray && decode(value, options).includes(options.arrayFormatSeparator);
        value = isEncodedArray ? decode(value, options) : value;
        accumulator[key] = isArray || isEncodedArray ? value.split(options.arrayFormatSeparator).map(item => decode(item, options)) : (value === null ? value : decode(value, options));
        break;
      }

      default: {
        if (accumulator[key] === undefined) {
          accumulator[key] = value;
        } else {
          accumulator[key] = [...([accumulator[key]].flat() as string[]), value];
        }
      }
    }
  };
}

/**
 * Validates that the provided value is a single-character string.
 * This is used to ensure that the array format separator in query strings
 * is properly formatted.
 * 
 * @param value - The value to be validated as an array format separator.
 * @throws {TypeError} Throws an error if the value is not a single-character string.
 */
const validateArrayFormatSeparator = (value: string): void => {
  if (typeof value !== 'string' || value.length !== 1) {
    throw new TypeError('arrayFormatSeparator must be a single character string');
  }
};

/**
 * Encodes a given value based on the provided options.
 * @param value - The value to be encoded.
 * @param options - Options that determine how the encoding should be done.
 * @returns The encoded value if encoding is enabled, otherwise returns the original value.
 */
const encode = (value: string, options: StringifyOptions): string => {
  return options.encode ? (options.strict ? STRICT_URI_ENCODE(value) : encodeURIComponent(value)) : value;
}

/**
 * Decodes a given value if the decode option is set.
 * @param value - The value to be decoded.
 * @param options - Options that determine if the decoding should be done.
 * @returns The decoded value if decoding is enabled, otherwise returns the original value.
 */
const decode = (value: string, options: ParseOptions): string => {
  return options.decode ? decodeUriComponent(value) : value;
}

/**
 * Sorts the keys of an object or the elements of an array.
 * @param input - The object or array to be sorted.
 * @returns The sorted object or array.
 */
const keysSorter = (input: any): any => {
  if (Array.isArray(input)) 
    return input.sort();

  if (typeof input === 'object' && input !== null) {
    return keysSorter(Object.keys(input))
      .sort((a: string, b: string) => Number(a) - Number(b))
      .map((key: string) => input[key]);
  }

  return input;
}

/**
 * Removes the hash fragment from a given string.
 * @param input - The string from which the hash fragment should be removed.
 * @returns The string without the hash fragment.
 */
const removeHash = (input: string): string => {
  const hashStart = input.indexOf('#');
  return hashStart !== -1 ? input.slice(0, hashStart) : input;
};

/**
 * Extracts the hash fragment from a URL.
 * @param url - The URL from which the hash fragment should be extracted.
 * @returns The hash fragment of the URL.
 */
const getHash = (url: string): string => {
  const hashStart = url.indexOf('#');
  return hashStart !== -1 ? url.slice(hashStart) : '';
};

/**
 * Parses a string value into a number or boolean if applicable, based on the provided options.
 * @param value - The value to be parsed.
 * @param options - Options specifying whether to parse numbers and booleans.
 * @returns The parsed value, converted to number or boolean if applicable, otherwise the original string.
 */
const parseValue = (value: string | string[] | Record<string, string>, options: ParseOptions): string | string[] | Record<string, string> | number | boolean => {
  if (typeof value === 'string' && value.trim() !== '') {
    if (options.parseNumbers && !isNaN(+value)) {
      return Number(value);
    } else if (options.parseBooleans && value !== null) {
      const lowerValue = value.toLowerCase();
      if (lowerValue === 'true' || lowerValue === 'false') 
        return lowerValue === 'true';
    }
  }

  return value;
}

/**
 * Extracts the query string from a given URL. 
 * Note: This behaviour can be changed with the `skipNull` option.
 * @param input - The URL from which the query string should be extracted.
 * @returns The extracted query string, or an empty string if no query string is found.
 */
export function extract(input: string): string {
  input = removeHash(input);
  const queryStart = input.indexOf('?');
  return queryStart === -1 ? '' : input.slice(queryStart + 1);
}

/**
 * Parses a query string into an object based on the provided options.
 * Parse a query string into an object. Leading `?` or `#` are ignored, so you can pass `location.search` or `location.hash` directly.
 * The returned object is created with [`Object.create(null)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create) and thus does not have a `prototype`.

 * @param query - The query string to be parsed.
 * @param options - Configuration options for parsing the query string.
 * @returns The parsed query as an object.
 */
export function parse(query: string, options?: ParseOptions): ParsedQuery {
  const defaultOptions: ParseOptions = {
    decode: true,
    sort: true,
    arrayFormat: 'none',
    arrayFormatSeparator: ',',
    parseNumbers: false,
    parseBooleans: false,
  };

  options = { ...defaultOptions, ...options };
  validateArrayFormatSeparator(options.arrayFormatSeparator);

  const formatter = parserForArrayFormat(options);
  const returnValue: ParsedQuery = Object.create(null);

  if (
    typeof query !== 'string' || 
    !(query = query.trim().replace(/^[?#&]/, ''))
  ) return returnValue;

  for (const parameter of query.split('&')) {
    if (parameter === '') continue;

    const _parameter = options.decode ? parameter.replace(/\+/g, ' ') : parameter;
    let [key = _parameter, value] = splitOnFirst(_parameter, '=');    

    // Missing `=` should be `null`:
    // http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
    value = value === undefined ? null : (['comma', 'separator', 'bracket-separator'].includes(options.arrayFormat) ? value : decode(value, options));
    formatter(decode(key, options), value, returnValue);
  }

  const keys = Object.keys(returnValue);
  const sortedReturnValue: ParsedQuery = Object.create(null);
  const sortedKeys = options.sort !== false ? 
    keys.sort(options.sort === true ? undefined : options.sort) : 
    keys;

  for (const key of sortedKeys) {
    const value = returnValue[key];
    sortedReturnValue[key] = (typeof value === 'object' && !Array.isArray(value) && value !== null) ? 
      Object.fromEntries(
        Object.entries(value)
          .map(([k, v]) => [k, parseValue(v, options)])
      ) : parseValue(value, options) as any;
  }

  return sortedReturnValue;
}

/**
 * Checks if a value should be skipped based on the provided options.
 * @param value - The value to be checked.
 * @param options - The stringify options.
 * @returns `true` if the value should be skipped, `false` otherwise.
 */
const shouldFilterValue = (value: unknown, options: StringifyOptions): boolean => {
  return (
    (options.skipNull && isNullOrUndefined(value)) ||
    (options.skipEmptyString && value === '')
  );
};

/**
 * Converts an object into a query string based on provided options.
 * Stringify an object into a query string and sort the keys.
 * @param object - The object to be stringified.
 * @param options - Configuration options for stringifying the object.
 * @returns The stringified query.
 */
export function stringify(
  // TODO: Use the below instead when the following TS issues are fixed:
  // - https://github.com/microsoft/TypeScript/issues/15300
  // - https://github.com/microsoft/TypeScript/issues/42021
  // Context: https://github.com/sindresorhus/query-string/issues/298
  // object: StringifiableRecord,
  object: Record<string, any>, 
  options?: StringifyOptions
): string {
  if (!object) return '';

  options = {
    encode: true,
    strict: true,
    arrayFormat: 'none',
    arrayFormatSeparator: ',',
    ...options,
  };

  validateArrayFormatSeparator(options.arrayFormatSeparator);
  const formatter = encoderForArrayFormat(options);

  const objectCopy: Record<string, any> = {};
  for (const [key, value] of Object.entries(object)) {
    if (!shouldFilterValue(value, options)) {
      objectCopy[key] = value;
    }
  }

  const keys = Object.keys(objectCopy);
  if (options.sort !== false) 
    keys.sort(typeof options.sort === 'function' ? options.sort : undefined);

  return keys
    .map(key => {
      const value = objectCopy[key];
      if (value === undefined) return '';
      if (value === null) return encode(key, options);

      if (Array.isArray(value)) {
        // Handle arrays according to the array format
        return formatter(key, value);
      }

      // Handle non-array values
      return `${encode(key, options)}=${encode(value, options)}`;
    })
    .filter(part => part.length > 0)
    .join('&');
}

/**
 * Parses a URL and extracts its components.
 * If the `parseFragmentIdentifier` option is `true`, the object will also contain a `fragmentIdentifier` property.

 * @param url - The URL to parse.
 * @param options - Parsing options.
 * @returns An object containing the base URL, query object, and optionally the fragment identifier.
 * @example
 * ```
 * import queryString from 'query-string';
 * 
 * queryString.parseUrl('https://foo.bar?foo=bar');
 * //=> {url: 'https://foo.bar', query: {foo: 'bar'}}
 * 
 * queryString.parseUrl('https://foo.bar?foo=bar#xyz', {parseFragmentIdentifier: true});
 * //=> {url: 'https://foo.bar', query: {foo: 'bar'}, fragmentIdentifier: 'xyz'}
 * ```
 */
export function parseUrl(url: string, options?: ParseOptions): ParsedUrl {
  options = {
    decode: true,
    ...options,
  };

  const [urlWithoutHash = url, hash] = splitOnFirst(url, '#');
  const baseUrl = urlWithoutHash.split('?')[0] ?? '';
  const query = parse(extract(urlWithoutHash), options);

  const result: ParsedUrl = {
    url: baseUrl,
    query: query,
  };

  if (options.parseFragmentIdentifier && hash) {
    result.fragmentIdentifier = decode(hash, options);
  }

  return result;
}

/**
 * Constructs a URL with a query string from an object.
 * Stringify an object into a URL with a query string and sorting the keys. The inverse of [`.parseUrl()`](https://github.com/sindresorhus/query-string#parseurlstring-options)
 * Query items in the `query` property overrides queries in the `url` property.
 * The `fragmentIdentifier` property overrides the fragment identifier in the `url` property.

 * @param object - The object containing the URL and query parameters.
 * @param options - Stringifying options.
 * @returns The constructed URL with the query string.
 * @example
 * ```
 * queryString.stringifyUrl({url: 'https://foo.bar', query: {foo: 'bar'}});
 * //=> 'https://foo.bar?foo=bar'
 * 
 * queryString.stringifyUrl({url: 'https://foo.bar?foo=baz', query: {foo: 'bar'}});
 * //=> 'https://foo.bar?foo=bar'
 * 
 * queryString.stringifyUrl({
 *   url: 'https://foo.bar',
 *   query: {
 *     top: 'foo'
 *   },
 *   fragmentIdentifier: 'bar'
 * });
 * //=> 'https://foo.bar?top=foo#bar'
 * ```
 */
export function stringifyUrl(object: UrlObject, options?: StringifyOptions): string {
  options = {
    encode: true,
    strict: true,
    [ENCODE_FRAGMENT_IDENTIFIER]: true,
    ...options,
  };

  const baseUrl = removeHash(object.url).split('?')[0] ?? '';
  const queryFromUrl = extract(object.url);
  const queryObject = {
    ...parse(queryFromUrl, { sort: false }),
    ...object.query,
  };

  let queryString = stringify(queryObject, options);
  if (queryString) queryString = `?${queryString}`;

  let hash = getHash(object.url);
  if (object.fragmentIdentifier) {
    hash = options[ENCODE_FRAGMENT_IDENTIFIER] ? 
      `#${encode(object.fragmentIdentifier, options)}` : 
      `#${object.fragmentIdentifier}`;
  }

  return `${baseUrl}${queryString}${hash}`;
}

/**
 * Picks certain query parameters from a URL based on a provided filter and reconstructs the URL.
 * @param input - The original URL.
 * @param filter - A filter function or an array of keys to pick from the query string.
 * @param options - Options for parsing and stringifying the URL.
 * @returns A new URL with only the picked query parameters.
 * @example
 * ```
 * queryString.pick('https://foo.bar?foo=1&bar=2#hello', ['foo']);
 * //=> 'https://foo.bar?foo=1#hello'
 * 
 * queryString.pick('https://foo.bar?foo=1&bar=2#hello', (name, value) => value === 2, {parseNumbers: true});
 * //=> 'https://foo.bar?bar=2#hello'
 * ```
 */
export function pick(
  input: string,
  filter: ((key: string, value: string | boolean | number) => boolean) | string[],
  options?: ParseOptions & StringifyOptions
): string {
  options = {
    parseFragmentIdentifier: true,
    [ENCODE_FRAGMENT_IDENTIFIER]: false,
    ...options,
  };

  const { url, query, fragmentIdentifier } = parseUrl(input, options);
  const filterFunction: PredicateFunction<ParsedQuery<string>> = Array.isArray(filter)
    ? (key) => filter.includes(key)
    : (key, value) => filter(key, value as string | boolean | number);

  return stringifyUrl({
    url,
    query: includeKeys(query, filterFunction) as StringifiableRecord,
    fragmentIdentifier,
  }, options);
}

/**
 * Excludes certain query parameters from a URL based on a provided filter and reconstructs the URL.
 * @param input - The original URL.
 * @param filter - A filter function or an array of keys to exclude from the query string.
 * @param options - Options for parsing and stringifying the URL.
 * @returns A new URL with the specified query parameters excluded.
 * @example
 * ```
 * queryString.exclude('https://foo.bar?foo=1&bar=2#hello', ['foo']);
 * //=> 'https://foo.bar?bar=2#hello'
 * 
 * queryString.exclude('https://foo.bar?foo=1&bar=2#hello', (name, value) => value === 2, {parseNumbers: true});
 * //=> 'https://foo.bar?foo=1#hello'
 * ```
 */
export function exclude(input: string, filter: ((key: string, value: string | boolean | number) => boolean) | string[], options?: ParseOptions & StringifyOptions): string {
  const exclusionFilter = Array.isArray(filter)
    ? (key: string) => !filter.includes(key)
    : (key: string, value: any) => !filter(key, value);

  return pick(input, exclusionFilter, options);
}
