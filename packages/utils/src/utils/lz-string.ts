/**
 * Based on `@amoutonbrady/lz-string` (https://npmjs.com/@amoutonbrady/lz-string) by @amoutonbrady (https://github.com/amoutonbrady)
 */

// private property
export const keyStrBase64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
export const keyStrUriSafe = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$";
export const baseReverseDic: Record<string, Record<string, number>> = {};

export function getBaseValue(alphabet: string, character: string) {
  if (!baseReverseDic[alphabet]) {
    baseReverseDic[alphabet] = {};

    for (let i = 0; i < alphabet.length; i++) {
      baseReverseDic[alphabet][alphabet.charAt(i)] = i;
    }
  }

  return baseReverseDic[alphabet][character];
}

export function compressToBase64(input: string): string {
  if (input == null) return "";
  const res = _compress(input, 6, (a) => keyStrBase64.charAt(a));

  // To produce valid Base64
  switch (res.length % 4) {
  default: // When could this happen ?
  case 0:
    return res;
  case 1:
    return res + "===";
  case 2:
    return res + "==";
  case 3:
    return res + "=";
  }
}

export function decompressFromBase64(input: string): string | null {
  if (input == null) return "";
  if (input == "") return null;
  return _decompress(input.length, 32, (index) => getBaseValue(keyStrBase64, input.charAt(index)));
}

//compress into a string that is already URI encoded
export function compressToURL(input: string): string {
  if (input == null) return "";
  return _compress(input, 6, (a) => keyStrUriSafe.charAt(a));
}

//decompress from an output of decompressFromURL
export function decompressFromURL(input: string): string | null {
  if (input == null) return "";
  if (input == "") return null;
  input = input.replaceAll(" ", "+");

  return _decompress(input.length, 32, (index) => getBaseValue(keyStrUriSafe, input.charAt(index)));
}

export function compressToUTF16(input: string) {
  if (input == null) return "";
  return _compress(input, 15, function (a) { return String.fromCharCode(a + 32); }) + " ";
}

export function decompressFromUTF16 (compressed: string) {
  if (compressed == null) return "";
  if (compressed == "") return null;
  return _decompress(compressed.length, 16384, function (index) { return compressed.charCodeAt(index) - 32; });
}

export function compress(uncompressed: string): string {
  return _compress(uncompressed, 16, String.fromCharCode);
}

export function decompress(compressed: null | string): string | null {
  if (compressed == null) return "";
  if (compressed == "") return null;
  return _decompress(compressed.length, 32768, (index) => compressed.charCodeAt(index));
}

/**
 * @internal
 */
export function _compress(
  uncompressed: null | string,
  bitsPerChar: number,
  getCharFromInt: (int: number) => string,
) {
  if (uncompressed == null) return "";

  const contextData = [];
  const contextDictionary: Record<string, number> = {};
  const contextDictionaryToCreate: Record<string, boolean> = {};

  let i: number;
  let j: number;
  let value: number;

  let contextC = "";
  let contextW = "";
  let contextWc = "";

  // Compensate for the first entry which should not count
  let contextEnlargeIn = 2;
  let contextDictSize = 3;
  let contextNumBits = 2;
  let contextDataVal = 0;
  let contextDataPosition = 0;

  for (j = 0; j < uncompressed.length; j += 1) {
    contextC = uncompressed.charAt(j);

    if (!Object.prototype.hasOwnProperty.call(contextDictionary, contextC)) {
      contextDictionary[contextC] = contextDictSize++;
      contextDictionaryToCreate[contextC] = true;
    }

    contextWc = contextW + contextC;

    if (Object.prototype.hasOwnProperty.call(contextDictionary, contextWc)) {
      contextW = contextWc;
    } else {
      if (Object.prototype.hasOwnProperty.call(contextDictionaryToCreate, contextW)) {
        if (contextW.charCodeAt(0) < 256) {
          for (i = 0; i < contextNumBits; i++) {
            contextDataVal = contextDataVal << 1;
            if (contextDataPosition == bitsPerChar - 1) {
              contextDataPosition = 0;
              contextData.push(getCharFromInt(contextDataVal));
              contextDataVal = 0;
            } else {
              contextDataPosition++;
            }
          }
          value = contextW.charCodeAt(0);
          for (i = 0; i < 8; i++) {
            contextDataVal = (contextDataVal << 1) | (value & 1);
            if (contextDataPosition == bitsPerChar - 1) {
              contextDataPosition = 0;
              contextData.push(getCharFromInt(contextDataVal));
              contextDataVal = 0;
            } else {
              contextDataPosition++;
            }
            value = value >> 1;
          }
        } else {
          value = 1;
          for (i = 0; i < contextNumBits; i++) {
            contextDataVal = (contextDataVal << 1) | value;
            if (contextDataPosition == bitsPerChar - 1) {
              contextDataPosition = 0;
              contextData.push(getCharFromInt(contextDataVal));
              contextDataVal = 0;
            } else {
              contextDataPosition++;
            }
            value = 0;
          }
          value = contextW.charCodeAt(0);
          for (i = 0; i < 16; i++) {
            contextDataVal = (contextDataVal << 1) | (value & 1);
            if (contextDataPosition == bitsPerChar - 1) {
              contextDataPosition = 0;
              contextData.push(getCharFromInt(contextDataVal));
              contextDataVal = 0;
            } else {
              contextDataPosition++;
            }
            value = value >> 1;
          }
        }
        contextEnlargeIn--;
        if (contextEnlargeIn == 0) {
          contextEnlargeIn = Math.pow(2, contextNumBits);
          contextNumBits++;
        }
        delete contextDictionaryToCreate[contextW];
      } else {
        value = contextDictionary[contextW];
        for (i = 0; i < contextNumBits; i++) {
          contextDataVal = (contextDataVal << 1) | (value & 1);
          if (contextDataPosition == bitsPerChar - 1) {
            contextDataPosition = 0;
            contextData.push(getCharFromInt(contextDataVal));
            contextDataVal = 0;
          } else {
            contextDataPosition++;
          }
          value = value >> 1;
        }
      }
      contextEnlargeIn--;
      if (contextEnlargeIn == 0) {
        contextEnlargeIn = Math.pow(2, contextNumBits);
        contextNumBits++;
      }
      // Add wc to the dictionary.
      contextDictionary[contextWc] = contextDictSize++;
      contextW = String(contextC);
    }
  }

  // Output the code for w.
  if (contextW !== "") {
    if (Object.prototype.hasOwnProperty.call(contextDictionaryToCreate, contextW)) {
      if (contextW.charCodeAt(0) < 256) {
        for (i = 0; i < contextNumBits; i++) {
          contextDataVal = contextDataVal << 1;
          if (contextDataPosition == bitsPerChar - 1) {
            contextDataPosition = 0;
            contextData.push(getCharFromInt(contextDataVal));
            contextDataVal = 0;
          } else {
            contextDataPosition++;
          }
        }
        value = contextW.charCodeAt(0);
        for (i = 0; i < 8; i++) {
          contextDataVal = (contextDataVal << 1) | (value & 1);
          if (contextDataPosition == bitsPerChar - 1) {
            contextDataPosition = 0;
            contextData.push(getCharFromInt(contextDataVal));
            contextDataVal = 0;
          } else {
            contextDataPosition++;
          }
          value = value >> 1;
        }
      } else {
        value = 1;
        for (i = 0; i < contextNumBits; i++) {
          contextDataVal = (contextDataVal << 1) | value;
          if (contextDataPosition == bitsPerChar - 1) {
            contextDataPosition = 0;
            contextData.push(getCharFromInt(contextDataVal));
            contextDataVal = 0;
          } else {
            contextDataPosition++;
          }
          value = 0;
        }
        value = contextW.charCodeAt(0);
        for (i = 0; i < 16; i++) {
          contextDataVal = (contextDataVal << 1) | (value & 1);
          if (contextDataPosition == bitsPerChar - 1) {
            contextDataPosition = 0;
            contextData.push(getCharFromInt(contextDataVal));
            contextDataVal = 0;
          } else {
            contextDataPosition++;
          }
          value = value >> 1;
        }
      }
      contextEnlargeIn--;
      if (contextEnlargeIn == 0) {
        contextEnlargeIn = Math.pow(2, contextNumBits);
        contextNumBits++;
      }
      delete contextDictionaryToCreate[contextW];
    } else {
      value = contextDictionary[contextW];
      for (i = 0; i < contextNumBits; i++) {
        contextDataVal = (contextDataVal << 1) | (value & 1);
        if (contextDataPosition == bitsPerChar - 1) {
          contextDataPosition = 0;
          contextData.push(getCharFromInt(contextDataVal));
          contextDataVal = 0;
        } else {
          contextDataPosition++;
        }
        value = value >> 1;
      }
    }
    contextEnlargeIn--;
    if (contextEnlargeIn == 0) {
      contextEnlargeIn = Math.pow(2, contextNumBits);
      contextNumBits++;
    }
  }

  // Mark the end of the stream
  value = 2;

  for (i = 0; i < contextNumBits; i++) {
    contextDataVal = (contextDataVal << 1) | (value & 1);
    if (contextDataPosition == bitsPerChar - 1) {
      contextDataPosition = 0;
      contextData.push(getCharFromInt(contextDataVal));
      contextDataVal = 0;
    } else contextDataPosition++;

    value = value >> 1;
  }

  // Flush the last char
  while (true) {
    contextDataVal = contextDataVal << 1;
    if (contextDataPosition == bitsPerChar - 1) {
      contextData.push(getCharFromInt(contextDataVal));
      break;
    } else contextDataPosition++;
  }

  return contextData.join("");
}

/**
 * @internal
 */
export function _decompress(length: number, resetValue: number, getNextValue: (index: number) => number) {
  const dictionary: (string | number)[] = [];
  let next: number;
  let enlargeIn = 4;
  let dictSize = 4;
  let numBits = 3;
  let entry = "";
  const result = [];
  let i: number;
  let w: string | number;
  let bits: number;
  let resb: number;
  let maxpower: number;
  let power: number;
  let c: string | number;
  const data = { val: getNextValue(0), position: resetValue, index: 1 };

  for (i = 0; i < 3; i += 1) dictionary[i] = i;

  bits = 0;
  maxpower = Math.pow(2, 2);
  power = 1;
  while (power != maxpower) {
    resb = data.val & data.position;
    data.position >>= 1;
    if (data.position == 0) {
      data.position = resetValue;
      data.val = getNextValue(data.index++);
    }
    bits |= (resb > 0 ? 1 : 0) * power;
    power <<= 1;
  }

  switch ((next = bits)) {
  case 0:
    bits = 0;
    maxpower = Math.pow(2, 8);
    power = 1;
    while (power != maxpower) {
      resb = data.val & data.position;
      data.position >>= 1;
      if (data.position == 0) {
        data.position = resetValue;
        data.val = getNextValue(data.index++);
      }
      bits |= (resb > 0 ? 1 : 0) * power;
      power <<= 1;
    }
    c = String.fromCharCode(bits);
    break;
  case 1:
    bits = 0;
    maxpower = Math.pow(2, 16);
    power = 1;
    while (power != maxpower) {
      resb = data.val & data.position;
      data.position >>= 1;
      if (data.position == 0) {
        data.position = resetValue;
        data.val = getNextValue(data.index++);
      }
      bits |= (resb > 0 ? 1 : 0) * power;
      power <<= 1;
    }
    c = String.fromCharCode(bits);
    break;
  case 2:
    return "";
  }
  dictionary[3] = c! as string;
  w = c!;
  result.push(c!);
  while (true) {
    if (data.index > length) {
      return "";
    }

    bits = 0;
    maxpower = Math.pow(2, numBits);
    power = 1;
    while (power != maxpower) {
      resb = data.val & data.position;
      data.position >>= 1;
      if (data.position == 0) {
        data.position = resetValue;
        data.val = getNextValue(data.index++);
      }
      bits |= (resb > 0 ? 1 : 0) * power;
      power <<= 1;
    }

    switch ((c = bits)) {
    case 0:
      bits = 0;
      maxpower = Math.pow(2, 8);
      power = 1;
      while (power != maxpower) {
        resb = data.val & data.position;
        data.position >>= 1;
        if (data.position == 0) {
          data.position = resetValue;
          data.val = getNextValue(data.index++);
        }
        bits |= (resb > 0 ? 1 : 0) * power;
        power <<= 1;
      }

      dictionary[dictSize++] = String.fromCharCode(bits);
      c = dictSize - 1;
      enlargeIn--;
      break;
    case 1:
      bits = 0;
      maxpower = Math.pow(2, 16);
      power = 1;
      while (power != maxpower) {
        resb = data.val & data.position;
        data.position >>= 1;
        if (data.position == 0) {
          data.position = resetValue;
          data.val = getNextValue(data.index++);
        }
        bits |= (resb > 0 ? 1 : 0) * power;
        power <<= 1;
      }
      dictionary[dictSize++] = String.fromCharCode(bits);
      c = dictSize - 1;
      enlargeIn--;
      break;
    case 2:
      return result.join("");
    }

    if (enlargeIn == 0) {
      enlargeIn = Math.pow(2, numBits);
      numBits++;
    }

    if (dictionary[c]) {
      entry = dictionary[c] as string;
    } else {
      if (c === dictSize && typeof w === "string") {
        entry = w + w.charAt(0);
      } else {
        return null;
      }
    }
    result.push(entry);

    // Add w+entry[0] to the dictionary.
    dictionary[dictSize++] = w + entry.charAt(0);
    enlargeIn--;

    w = entry;

    if (enlargeIn == 0) {
      enlargeIn = Math.pow(2, numBits);
      numBits++;
    }
  }
}