// Based off of https://github.com/SamVerschueren/decode-uri-component
// Define constants for regular expressions
const TOKEN = '%[a-f0-9]{2}';
const SINGLE_MATCHER = new RegExp(`(${TOKEN})|([^%]+?)`, 'gi');
const MULTI_MATCHER = new RegExp(`(${TOKEN})+`, 'gi');

/**
 * Tries to decode a set of URI components.
 * @param components - The array of components to decode.
 * @param split - The index at which to split the components.
 * @returns An array of decoded components.
 */
function decodeComponents(components: string[], split: number = 1): string[] {
  try {
    // Attempt to decode the entire string first
    return [decodeURIComponent(components.join(''))];
  } catch {
    // If the entire string can't be decoded, return the original components if there's only one
    if (components.length === 1) {
      return components;
    }

    // Split the array into two parts and decode each part recursively
    const left = components.slice(0, split);
    const right = components.slice(split);
    return [...decodeComponents(left), ...decodeComponents(right)];
  }
}

/**
 * Decodes a URI component.
 * @param input - The encoded URI component.
 * @returns The decoded URI component.
 */
function decode(input: string): string {
  try {
    // Attempt to decode using the built-in decoder
    return decodeURIComponent(input);
  } catch {
    let tokens = input.match(SINGLE_MATCHER) || [];

    // Iterate through the tokens, trying to decode progressively
    for (let i = 1; i < tokens.length; i++) {
      input = decodeComponents(tokens, i).join('');
      tokens = input.match(SINGLE_MATCHER) || [];
    }

    return input;
  }
}

/**
 * Custom decoder for URI components, handling specific edge cases.
 * @param input - The encoded URI component.
 * @returns The decoded URI component.
 */
function customDecodeURIComponent(input: string): string {
  const replaceMap: Record<string, string> = {
    '%FE%FF': '\uFFFD\uFFFD',
    '%FF%FE': '\uFFFD\uFFFD',
  };

  let match = MULTI_MATCHER.exec(input);
  while (match) {
    try {
      // Try to decode as large chunks as possible
      replaceMap[match[0]] = decodeURIComponent(match[0]);
    } catch {
      const result = decode(match[0]);

      if (result !== match[0]) {
        replaceMap[match[0]] = result;
      }
    }

    match = MULTI_MATCHER.exec(input);
  }

  // Special handling for '%C2'
  replaceMap['%C2'] = '\uFFFD';

  // Replace all decoded components in the input string
  Object.keys(replaceMap).forEach((key) => {
    input = input.replace(new RegExp(key, 'g'), replaceMap[key]);
  });

  return input;
}

/**
 * Decodes a URI component previously created by `encodeURIComponent()`, using a custom decoder if necessary.
 * @param encodedURI - The encoded URI to decode.
 * @returns The decoded URI component.
 * @throws {TypeError} If `encodedURI` is not a string.
 * @example
 * ```
 * decodeUriComponent('st%C3%A5le')
 * //=> 'ståle'
 * ```
 */
export function decodeUriComponent(encodedURI: string): string {
  if (typeof encodedURI !== 'string') {
    throw new TypeError(`Expected \`encodedURI\` to be of type \`string\`, got \`${typeof encodedURI}\``);
  }

  try {
    // Use the built-in decoder first
    return decodeURIComponent(encodedURI);
  } catch {
    // Fallback to the custom decoder if the built-in one fails
    return customDecodeURIComponent(encodedURI);
  }
}

export default decodeUriComponent;
