/**
 * Based on https://deno.land/x/json5@v1.0.0/mod.ts
 */
import JSON5_MOD from "json5";

/**
 * Converts a JSON5 string into an object.
 * @template T Type of return value.
 * @param text A valid JSON string.
 * @param reviver A function that transforms the results. This function is called for each member of the object. If a member contains nested objects, the nested objects are transformed before the parent object is.
 */
export function parse<T = any>(text: string, reviver?: ((this: any, key: string, value: any) => any | null)): T {
  return JSON5_MOD.parse(text, reviver);
}

/**
 * Converts a JavaScript value to a JSON5 string.
 * @param value A JavaScript value, usually an object or array, to be converted.
 * @param replacer A function that transforms the results.
 * @param space Adds indentation, white space, and line break characters to the return-value JSON text to make it easier to read.
 */
export function stringify(value: any, replacer?: ((this: any, key: string, value: any) => any) | null, space?: string | number | undefined): string {
  return JSON5_MOD.stringify(value, replacer, parseInt(space + '') || undefined);
}

// defaults
const JSON5 = { parse, stringify };
export default JSON5;