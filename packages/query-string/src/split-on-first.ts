// Based on https://github.com/sindresorhus/split-on-first
/**
 * Splits a string on the first occurrence of a separator.
 * @param str - The string to split.
 * @param separator - The separator to use for splitting.
 * @returns An array containing the parts of the string before and after the separator.
 * @throws {TypeError} If the arguments are not strings.
 * @example
 * ```
 * import splitOnFirst from 'split-on-first';
 * 
 * splitOnFirst('a-b-c', '-');
 * //=> ['a', 'b-c']
 * 
 * splitOnFirst('key:value:value2', ':');
 * //=> ['key', 'value:value2']
 * 
 * splitOnFirst('a---b---c', '---');
 * //=> ['a', 'b---c']
 * 
 * splitOnFirst('a-b-c', '+');
 * //=> []
 * 
 * splitOnFirst('abc', '');
 * //=> []
 * ```
 */
export function splitOnFirst(str: string, separator: string) {
  // Validate input types
  if (typeof str !== 'string' || typeof separator !== 'string') {
    throw new TypeError('Expected the arguments to be of type `string`');
  }

  // Handle cases where string or separator is empty
  if (str === '' || separator === '') {
    return [];
  }

  // Find the index of the separator
  const separatorIndex = str.indexOf(separator);

  // If the separator is not found, return an empty array
  if (separatorIndex === -1) {
    return [];
  }

  // Return the parts of the string before and after the separator
  return [
    str.slice(0, separatorIndex),
    str.slice(separatorIndex + separator.length)
  ] as const;
}

export default splitOnFirst;