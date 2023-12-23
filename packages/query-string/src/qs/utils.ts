import { STRINGIFY_DEFAULT_FORMAT } from './consts.ts';
import { Format } from './formats.ts';

// Hex table for encoding characters
export const HEX_TABLE: string[] = new Array(256)
  .fill(0)
  .map((_, i) => '%' + i.toString(16).toUpperCase().padStart(2, '0'));
  
/**
 * Compacts arrays within a queue of objects by removing undefined values.
 * The function mutates the objects in the queue.
 * 
 * @param queue - A queue of objects containing properties that reference arrays to be compacted.
 */
export function compactQueue(queue: Array<{ obj: { [key: string]: any[] }; prop: string }>): void {
  while (queue.length > 1) {
    const item = queue.pop();
    if (!item) continue;

    const obj = item.obj[item.prop];

    if (Array.isArray(obj)) {
      item.obj[item.prop] = obj.filter(el => el !== undefined);
    }
  }
}

/**
 * Converts an array to an object, optionally using plain objects.
 * @param source - The array to convert.
 * @param options - Optional settings for object creation.
 * @returns The converted object.
 */
export function arrayToObject(source: any[], options?: { plainObjects?: boolean }): Record<number, any> {
  const obj: Record<number, any> = options?.plainObjects ? Object.create(null) : {};
  source.forEach((item, index) => {
    if (item !== undefined) {
      obj[index] = item;
    }
  });
  return obj;
}

/**
 * Merges two objects recursively.
 * @param target - The target object to merge into.
 * @param source - The source object to merge from.
 * @param options - Optional settings like handling of plain objects and prototypes.
 * @returns The merged object.
 */
export function merge(target: any, source: any, options?: { plainObjects?: boolean; allowPrototypes?: boolean }): any {
  if (!source) return target;
  if (typeof source !== 'object') {
    if (Array.isArray(target)) {
      target.push(source);
    } else if (target && typeof target === 'object') {
      if (options?.plainObjects || options?.allowPrototypes || !Object.prototype.hasOwnProperty.call(Object.prototype, source)) {
        target[source] = true;
      }
    } else {
      return [target, source];
    }

    return target;
  }

  if (!target || typeof target !== 'object') {
    return [target, ...source];
  }

  let mergeTarget = target;
  if (Array.isArray(target) && !Array.isArray(source)) {
    mergeTarget = arrayToObject(target, options);
  }

  if (Array.isArray(target) && Array.isArray(source)) {
    source.forEach((item, index) => {
      if (target.hasOwnProperty(index)) {
        if (target[index] && typeof target[index] === 'object' && item && typeof item === 'object') {
          target[index] = merge(target[index], item, options);
        } else {
          target.push(item);
        }
      } else {
        target[index] = item;
      }
    });
    return target;
  }

  return Object.keys(source).reduce((acc, key) => {
    if (acc.hasOwnProperty(key)) {
      acc[key] = merge(acc[key], source[key], options);
    } else {
      acc[key] = source[key];
    }
    return acc;
  }, mergeTarget);
}

/**
  * Assigns properties from a source object to a target object.
  * @param target - The target object.
  * @param source - The source object.
  * @returns The target object with properties from the source.
  */
export function assign(target: Record<string, any>, source: Record<string, any>): Record<string, any> {
  return Object.assign(target, source);
}

/**
 * Decodes a string using the specified charset.
 * @param str - The string to decode.
 * @param charset - The charset to use for decoding.
 * @returns The decoded string.
 */
export function decode(str: string, charset: 'iso-8859-1' | 'utf-8'): string {
  const strWithoutPlus = str.replace(/\+/g, ' ');
  if (charset === 'iso-8859-1') {
    // unescape never throws, no try...catch needed:
    return strWithoutPlus.replace(/%[0-9a-f]{2}/gi, match => unescape(match));
  }
  try {
    return decodeURIComponent(strWithoutPlus);
  } catch (e) {
    return strWithoutPlus;
  }
}

/**
 * Encodes a string for use in a URL, adhering to the specified charset and format.
 * @param str - The string or symbol to encode.
 * @param charset - The character set to use for encoding (e.g., 'utf-8', 'iso-8859-1').
 * @param format - The format to adhere to (e.g., RFC1738, RFC3986).
 * @returns The encoded string.
 */
export function encode(str: string | symbol, charset: 'utf-8' | 'iso-8859-1', format = STRINGIFY_DEFAULT_FORMAT, type?: "key" | "value"): string {
  if (typeof str === 'string' && str.length === 0) {
    return str.toString();
  }

  const string = typeof str === 'symbol' ? Symbol.prototype.toString.call(str) : String(str);
  if (charset === 'iso-8859-1') {
    return escape(string).replace(/%u[0-9a-f]{4}/gi, match =>
      `%26%23${parseInt(match.slice(2), 16)}%3B`
    );
  }

  let out = '';
  for (const char of string) {
    const code = char.charCodeAt(0);

    if (
      isUnreserved(code) ||
      (format === Format.RFC1738 && isRFC1738Reserved(code))
    ) {
      out += char;
      continue;
    }

    if (code < 0x80) {
      out += HEX_TABLE[code];
      continue;
    }

    if (code < 0x800) {
      out += HEX_TABLE[0xC0 | (code >> 6)] + HEX_TABLE[0x80 | (code & 0x3F)];
      continue;
    }

    if (code < 0xD800 || code >= 0xE000) {
      out += HEX_TABLE[0xE0 | (code >> 12)] +
        HEX_TABLE[0x80 | ((code >> 6) & 0x3F)] +
        HEX_TABLE[0x80 | (code & 0x3F)];
      continue;
    }

    // Handle UTF-16 surrogate pairs
    const surrogatePair = getSurrogatePair(string, char);
    out += surrogatePair;
  }

  return out;
}

/**
 * Determines if a character code is an unreserved character in URI encoding.
 * @param code - The character code.
 * @returns True if the character is unreserved, false otherwise.
 */
export function isUnreserved(code: number): boolean {
  return (
    (code >= 0x41 && code <= 0x5A) || // A-Z
    (code >= 0x61 && code <= 0x7A) || // a-z
    (code >= 0x30 && code <= 0x39) || // 0-9
    code === 0x2D || // -
    code === 0x2E || // .
    code === 0x5F || // _
    code === 0x7E   // ~
  );
}

/**
 * Determines if a character code is reserved according to RFC1738.
 * @param code - The character code.
 * @returns True if the character is reserved in RFC1738, false otherwise.
 */
export function isRFC1738Reserved(code: number): boolean {
  return code === 0x28 || code === 0x29; // ( )
}

/**
 * Handles UTF-16 surrogate pairs for encoding.
 * @param string - The entire string being encoded.
 * @param char - The current character.
 * @returns The encoded surrogate pair.
 */
export function getSurrogatePair(string: string, char: string): string {
  const highSurrogate = char.charCodeAt(0);
  const lowSurrogate = string.charCodeAt(1);
  const surrogateCode = 0x10000 + (((highSurrogate & 0x3FF) << 10) | (lowSurrogate & 0x3FF));

  return HEX_TABLE[0xF0 | (surrogateCode >> 18)] +
    HEX_TABLE[0x80 | ((surrogateCode >> 12) & 0x3F)] +
    HEX_TABLE[0x80 | ((surrogateCode >> 6) & 0x3F)] +
    HEX_TABLE[0x80 | (surrogateCode & 0x3F)];
}

/**
 * Recursively removes empty or nullish values from an object or array.
 * @param value - The object or array to be compacted.
 * @returns The compacted object or array with nullish values removed.
 */
export function compact(value: any): any {
  // A queue to manage objects/arrays for compaction
  const queue: Array<{ obj: { [key: string]: any }; prop: string }> = [{ obj: { o: value }, prop: 'o' }];
  // A list to keep track of references and avoid circular references
  const refs: any[] = [];

  for (let i = 0; i < queue.length; i++) {
    const item = queue[i];
    const obj = item.obj[item.prop];

    // Skip if not an object or null
    if (typeof obj !== 'object' || obj === null) {
      continue;
    }

    const keys = Object.keys(obj);
    for (const key of keys) {
      const val = obj[key];
      if (typeof val === 'object' && val !== null && refs.indexOf(val) === -1) {
        queue.push({ obj: obj, prop: key });
        refs.push(val);
      }
    }
  }

  compactQueue(queue);

  return value;
}

/**
 * Combines two arrays or values into an array.
 * @param a - The first array or value.
 * @param b - The second array or value.
 * @returns The combined array.
 */
export function combine(a: any | any[], b: any | any[]): any[] {
  return [].concat(a, b);
}

/**
 * Maps a value or each element of an array using the provided function.
 * @param val - The value or array to map.
 * @param fn - The mapping function.
 * @returns The mapped value or array.
 */
export function maybeMap(val: any | any[], fn: (item: any) => any): any | any[] {
  if (Array.isArray(val)) {
    return val.map(fn);
  }
  return fn(val);
}

/**
 * Checks if the given object is a RegExp.
 * 
 * @param obj - The object to check.
 * @returns True if the object is a RegExp, false otherwise.
 */
export function isRegExp(obj: any): obj is RegExp {
  return Object.prototype.toString.call(obj) === '[object RegExp]';
}

/**
 * Checks if the given object is a Buffer.
 * 
 * Note: This function assumes a Node.js environment where Buffer is defined.
 * In other environments, this function will always return false unless the
 * environment has a similar Buffer implementation.
 * 
 * @param obj - The object to check.
 * @returns True if the object is a Buffer, false otherwise.
 */
export function isBuffer(obj: any): obj is Buffer {
  if (!obj || typeof obj !== 'object') {
    return false;
  }

  return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));
}

/**
 * Checks if a value is a non-nullish primitive (string, number, boolean, symbol, bigint).
 * @param v - The value to check.
 * @returns True if the value is a non-nullish primitive, false otherwise.
 */
export function isNonNullishPrimitive(v: any): boolean {
  return (
    typeof v === 'string' ||
    typeof v === 'number' ||
    typeof v === 'boolean' ||
    typeof v === 'symbol' ||
    typeof v === 'bigint'
  );
}

export const isArray = Array.isArray;
export function pushToArray(arr: any[], valueOrArray: any) {
  if (isArray(valueOrArray)) {
    arr.push(...valueOrArray);
  } else {
    arr.push(valueOrArray);
  }
};

export function toSort<T extends any[]>(arr: T, sort: boolean | ((a: any, b: any) => number) = false) {
  if (typeof sort === "function") {
    return arr.sort(sort);
  }

  return sort ? arr.sort() : arr;
}