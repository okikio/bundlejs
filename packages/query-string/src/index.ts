// Importing dependencies
import decodeComponent from 'decode-uri-component';
import splitOnFirst from 'split-on-first';
import { includeKeys } from 'filter-obj';

import type { ParseOptions, ParsedQuery, ParsedUrl, StringifyOptions, UrlObject } from './types.ts';

// Function implementations (from .js file)
const isNullOrUndefined = (value: unknown): boolean => value === null || value === undefined;
const strictUriEncode = (str: string): string => encodeURIComponent(str).replace(/[!'()*]/g, x => `%${x.charCodeAt(0).toString(16).toUpperCase()}`);
const encodeFragmentIdentifier = Symbol('encodeFragmentIdentifier');


function encoderForArrayFormat(options: StringifyOptions) {
  switch (options.arrayFormat) {
    case 'index': {
      return key => (result, value) => {
        const index = result.length;

        if (
          value === undefined
          || (options.skipNull && value === null)
          || (options.skipEmptyString && value === '')
        ) {
          return result;
        }

        if (value === null) {
          return [
            ...result, [encode(key, options), '[', index, ']'].join(''),
          ];
        }

        return [
          ...result,
          [encode(key, options), '[', encode(index, options), ']=', encode(value, options)].join(''),
        ];
      };
    }

    case 'bracket': {
      return key => (result, value) => {
        if (
          value === undefined
          || (options.skipNull && value === null)
          || (options.skipEmptyString && value === '')
        ) {
          return result;
        }

        if (value === null) {
          return [
            ...result,
            [encode(key, options), '[]'].join(''),
          ];
        }

        return [
          ...result,
          [encode(key, options), '[]=', encode(value, options)].join(''),
        ];
      };
    }

    case 'colon-list-separator': {
      return key => (result, value) => {
        if (
          value === undefined
          || (options.skipNull && value === null)
          || (options.skipEmptyString && value === '')
        ) {
          return result;
        }

        if (value === null) {
          return [
            ...result,
            [encode(key, options), ':list='].join(''),
          ];
        }

        return [
          ...result,
          [encode(key, options), ':list=', encode(value, options)].join(''),
        ];
      };
    }

    case 'comma':
    case 'separator':
    case 'bracket-separator': {
      const keyValueSep = options.arrayFormat === 'bracket-separator'
        ? '[]='
        : '=';

      return key => (result, value) => {
        if (
          value === undefined
          || (options.skipNull && value === null)
          || (options.skipEmptyString && value === '')
        ) {
          return result;
        }

        // Translate null to an empty string so that it doesn't serialize as 'null'
        value = value === null ? '' : value;

        if (result.length === 0) {
          return [[encode(key, options), keyValueSep, encode(value, options)].join('')];
        }

        return [[result, encode(value, options)].join(options.arrayFormatSeparator)];
      };
    }

    default: {
      return key => (result, value) => {
        if (
          value === undefined
          || (options.skipNull && value === null)
          || (options.skipEmptyString && value === '')
        ) {
          return result;
        }

        if (value === null) {
          return [
            ...result,
            encode(key, options),
          ];
        }

        return [
          ...result,
          [encode(key, options), '=', encode(value, options)].join(''),
        ];
      };
    }
  }
}

function parserForArrayFormat(options: StringifyOptions) {
  let result;

  switch (options.arrayFormat) {
    case 'index': {
      return (key, value, accumulator) => {
        result = /\[(\d*)]$/.exec(key);

        key = key.replace(/\[\d*]$/, '');

        if (!result) {
          accumulator[key] = value;
          return;
        }

        if (accumulator[key] === undefined) {
          accumulator[key] = {};
        }

        accumulator[key][result[1]] = value;
      };
    }

    case 'bracket': {
      return (key, value, accumulator) => {
        result = /(\[])$/.exec(key);
        key = key.replace(/\[]$/, '');

        if (!result) {
          accumulator[key] = value;
          return;
        }

        if (accumulator[key] === undefined) {
          accumulator[key] = [value];
          return;
        }

        accumulator[key] = [...accumulator[key], value];
      };
    }

    case 'colon-list-separator': {
      return (key, value, accumulator) => {
        result = /(:list)$/.exec(key);
        key = key.replace(/:list$/, '');

        if (!result) {
          accumulator[key] = value;
          return;
        }

        if (accumulator[key] === undefined) {
          accumulator[key] = [value];
          return;
        }

        accumulator[key] = [...accumulator[key], value];
      };
    }

    case 'comma':
    case 'separator': {
      return (key, value, accumulator) => {
        const isArray = typeof value === 'string' && value.includes(options.arrayFormatSeparator);
        const isEncodedArray = (typeof value === 'string' && !isArray && decode(value, options).includes(options.arrayFormatSeparator));
        value = isEncodedArray ? decode(value, options) : value;
        const newValue = isArray || isEncodedArray ? value.split(options.arrayFormatSeparator).map(item => decode(item, options)) : (value === null ? value : decode(value, options));
        accumulator[key] = newValue;
      };
    }

    case 'bracket-separator': {
      return (key, value, accumulator) => {
        const isArray = /(\[])$/.test(key);
        key = key.replace(/\[]$/, '');

        if (!isArray) {
          accumulator[key] = value ? decode(value, options) : value;
          return;
        }

        const arrayValue = value === null
          ? []
          : value.split(options.arrayFormatSeparator).map(item => decode(item, options));

        if (accumulator[key] === undefined) {
          accumulator[key] = arrayValue;
          return;
        }

        accumulator[key] = [...accumulator[key], ...arrayValue];
      };
    }

    default: {
      return (key, value, accumulator) => {
        if (accumulator[key] === undefined) {
          accumulator[key] = value;
          return;
        }

        accumulator[key] = [...[accumulator[key]].flat(), value];
      };
    }
  }
}

function validateArrayFormatSeparator(value: any) {
  if (typeof value !== 'string' || value.length !== 1) {
    throw new TypeError('arrayFormatSeparator must be single character string');
  }
}

function encode(value: string, options: any): string {
  // ... (rest of the implementation from the .js file)
}

function decode(value: string, options: any): string {
  // ... (rest of the implementation from the .js file)
}

function keysSorter(input: any): any {
  // ... (rest of the implementation from the .js file)
}

function removeHash(input: string): string {
  // ... (rest of the implementation from the .js file)
}

function getHash(url: string): string {
  // ... (rest of the implementation from the .js file)
}

function parseValue(value: string, options: any): any {
  // ... (rest of the implementation from the .js file)
}

/**
Extract a query string from a URL that can be passed into `.parse()`.

Note: This behaviour can be changed with the `skipNull` option.
*/
export function extract(url: string): string {
  // ... (rest of the implementation from the .js file)
}

/**
Parse a query string into an object. Leading `?` or `#` are ignored, so you can pass `location.search` or `location.hash` directly.

The returned object is created with [`Object.create(null)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create) and thus does not have a `prototype`.

@param query - The query string to parse.
*/
export function parse(query: string, options: { parseBooleans: true; parseNumbers: true } & ParseOptions): ParsedQuery<string | boolean | number>;
export function parse(query: string, options: { parseBooleans: true } & ParseOptions): ParsedQuery<string | boolean>;
export function parse(query: string, options: { parseNumbers: true } & ParseOptions): ParsedQuery<string | number>;
export function parse(query: string, options?: ParseOptions): ParsedQuery;
export function parse(query: string, options?: ParseOptions): any {
  // ... (rest of the implementation from the .js file)
}


/**
Stringify an object into a query string and sort the keys.
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
  // ... (rest of the implementation from the .js file)
}

/**
Extract the URL and the query string as an object.

If the `parseFragmentIdentifier` option is `true`, the object will also contain a `fragmentIdentifier` property.

@param url - The URL to parse.

@example
```
import queryString from 'query-string';

queryString.parseUrl('https://foo.bar?foo=bar');
//=> {url: 'https://foo.bar', query: {foo: 'bar'}}

queryString.parseUrl('https://foo.bar?foo=bar#xyz', {parseFragmentIdentifier: true});
//=> {url: 'https://foo.bar', query: {foo: 'bar'}, fragmentIdentifier: 'xyz'}
```
*/
export function parseUrl(url: string, options?: ParseOptions): ParsedUrl {
  // ... (rest of the implementation from the .js file)
}

/**
Stringify an object into a URL with a query string and sorting the keys. The inverse of [`.parseUrl()`](https://github.com/sindresorhus/query-string#parseurlstring-options)

Query items in the `query` property overrides queries in the `url` property.

The `fragmentIdentifier` property overrides the fragment identifier in the `url` property.

@example
```
queryString.stringifyUrl({url: 'https://foo.bar', query: {foo: 'bar'}});
//=> 'https://foo.bar?foo=bar'

queryString.stringifyUrl({url: 'https://foo.bar?foo=baz', query: {foo: 'bar'}});
//=> 'https://foo.bar?foo=bar'

queryString.stringifyUrl({
  url: 'https://foo.bar',
  query: {
    top: 'foo'
  },
  fragmentIdentifier: 'bar'
});
//=> 'https://foo.bar?top=foo#bar'
```
*/
export function stringifyUrl(
  object: UrlObject,
  options?: StringifyOptions
): string {
  // ... (rest of the implementation from the .js file)
}

/**
Pick query parameters from a URL.

@param url - The URL containing the query parameters to pick.
@param keys - The names of the query parameters to keep. All other query parameters will be removed from the URL.
@param filter - A filter predicate that will be provided the name of each query parameter and its value. The `parseNumbers` and `parseBooleans` options also affect `value`.

@returns The URL with the picked query parameters.

@example
```
queryString.pick('https://foo.bar?foo=1&bar=2#hello', ['foo']);
//=> 'https://foo.bar?foo=1#hello'

queryString.pick('https://foo.bar?foo=1&bar=2#hello', (name, value) => value === 2, {parseNumbers: true});
//=> 'https://foo.bar?bar=2#hello'
```
*/
export function pick(
  url: string,
  keys: readonly string[],
  options?: ParseOptions & StringifyOptions
): string;
export function pick(
  url: string,
  filter: (key: string, value: string | boolean | number) => boolean,
  options?: { parseBooleans: true; parseNumbers: true } & ParseOptions & StringifyOptions
): string;
export function pick(
  url: string,
  filter: (key: string, value: string | boolean) => boolean,
  options?: { parseBooleans: true } & ParseOptions & StringifyOptions
): string;
export function pick(
  url: string,
  filter: (key: string, value: string | number) => boolean,
  options?: { parseNumbers: true } & ParseOptions & StringifyOptions
): string {
  // ... (rest of the implementation from the .js file)
}


/**
Exclude query parameters from a URL. Like `.pick()` but reversed.

@param url - The URL containing the query parameters to exclude.
@param keys - The names of the query parameters to remove. All other query parameters will remain in the URL.
@param filter - A filter predicate that will be provided the name of each query parameter and its value. The `parseNumbers` and `parseBooleans` options also affect `value`.

@returns The URL without the excluded the query parameters.

@example
```
queryString.exclude('https://foo.bar?foo=1&bar=2#hello', ['foo']);
//=> 'https://foo.bar?bar=2#hello'

queryString.exclude('https://foo.bar?foo=1&bar=2#hello', (name, value) => value === 2, {parseNumbers: true});
//=> 'https://foo.bar?foo=1#hello'
```
*/
export function exclude(
  url: string,
  keys: readonly string[],
  options?: ParseOptions & StringifyOptions
): string;
export function exclude(
  url: string,
  filter: (key: string, value: string | boolean | number) => boolean,
  options?: { parseBooleans: true; parseNumbers: true } & ParseOptions & StringifyOptions
): string;
export function exclude(
  url: string,
  filter: (key: string, value: string | boolean) => boolean,
  options?: { parseBooleans: true } & ParseOptions & StringifyOptions
): string;
export function exclude(
  url: string,
  filter: (key: string, value: string | number) => boolean,
  options?: { parseNumbers: true } & ParseOptions & StringifyOptions
): string {
  // ... (rest of the implementation from the .js file)
}

// ... (include any remaining functions and exports from the .js file)
