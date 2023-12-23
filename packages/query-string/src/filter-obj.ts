// Based on https://github.com/sindresorhus/filter-obj
export type PredicateFunction<ObjectType> = (key: keyof ObjectType, value: ObjectType[keyof ObjectType], object: ObjectType) => boolean;

/**
 * Creates a new object including keys from the original object based on a predicate. 
 * Filter object keys and values into a new object.
 * @param obj - The original object.
 * @param predicate - A predicate used to determine which keys to include. Can be an array of keys or a function.
 * @returns A new object with keys that match the predicate.
 * @example
 * ```
 * import {includeKeys} from 'filter-obj';
 * 
 * const object = {
 *   foo: true,
 *   bar: false
 * };
 * 
 * const newObject = includeKeys(object, (key, value) => value === true);
 * //=> {foo: true}
 * 
 * const newObject2 = includeKeys(object, ['bar']);
 * //=> {bar: false}
 * ```
 */
export function includeKeys<
  ObjectType extends Record<PropertyKey, any>,
>(
  obj: ObjectType,
  predicate: Array<keyof ObjectType> | PredicateFunction<ObjectType>
): Partial<ObjectType> {
  const result: Partial<ObjectType> = {};

  if (Array.isArray(predicate)) {
    // If predicate is an array, include keys present in the array
    for (const key of predicate) {
      const descriptor = Object.getOwnPropertyDescriptor(obj, key);
      if (descriptor?.enumerable) {
        Object.defineProperty(result, key, descriptor);
      }
    }
  } else {
    // If predicate is a function, use it to determine which keys to include
    for (const key of Reflect.ownKeys(obj) as Array<keyof ObjectType>) {
      const descriptor = Object.getOwnPropertyDescriptor(obj, key);
      if (descriptor?.enumerable) {
        const value = obj[key];
        if (predicate(key, value, obj)) {
          Object.defineProperty(result, key, descriptor);
        }
      }
    }
  }

  return result;
}

/**
 * Creates a new object excluding keys from the original object based on a predicate.
 * Filter object keys and values into a new object.
 * @param obj - The original object.
 * @param predicate - A predicate used to determine which keys to exclude. Can be an array of keys or a function.
 * @returns A new object with keys that do not match the predicate.
 * @example
 * ```
 * import {excludeKeys} from 'filter-obj';
 * 
 * const object = {
 *   foo: true,
 *   bar: false
 * };
 * 
 * const newObject = excludeKeys(object, (key, value) => value === true);
 * //=> {bar: false}
 * 
 * const newObject3 = excludeKeys(object, ['bar']);
 * //=> {foo: true}
 * ```
 */
export function excludeKeys<
  ObjectType extends Record<PropertyKey, any>,
>(
  obj: ObjectType,
  predicate: Array<keyof ObjectType> | PredicateFunction<ObjectType>
): Partial<ObjectType> {
  if (Array.isArray(predicate)) {
    // If predicate is an array, exclude keys present in the array
    const set = new Set(predicate);
    return includeKeys(obj, key => !set.has(key));
  }

  // If predicate is a function, use it to determine which keys to exclude
  return includeKeys(obj, (key, value, obj) => !predicate(key, value, obj));
}
