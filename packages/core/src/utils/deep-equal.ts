export const isObject = (obj: any) => typeof obj === "object" && obj != null;
export const isPrimitive = (val) => (typeof val === "object" ? val === null : typeof val !== "function");
export const isValidKey = key => {
  return key !== "__proto__" && key !== "constructor" && key !== "prototype";
};

// Based on https://gist.github.com/egardner/efd34f270cc33db67c0246e837689cb9
// Deep Equality comparison example
//
// This is an example of how to implement an object-comparison function in 
// JavaScript (ES5+). A few points of interest here:
//
// * You can get an array of all an object's properties in ES5+ by calling
//   the class method Object.keys(obj). 
// * The function recursively calls itself in the for / in loop when it
//   compares the contents of each property
// * You can hide a "private" function inside a function of this kind by
//   placing one function declaration inside of another. The inner function
//   is not hoisted out into the global scope, so it is only visible inside
//   of the parent function.
// * The reason this nested helper function is necessary is that 
//   `typeof null` is still "object" in JS, a major "gotcha" to watch out for.
//
export const deepEqual = (obj1: any, obj2: any) => {
  if (obj1 === obj2) {
    return true;
  } else if (isObject(obj1) && isObject(obj2)) {
    if (Object.keys(obj1).length !== Object.keys(obj2).length) { return false; }
    for (const prop in obj1) {
      if (!deepEqual(obj1[prop], obj2[prop])) return false;
    }

    return true;
  }
};

/** Compares 2 objects and only keep the keys that are different in both objects */
export const deepDiff = (obj1: any, obj2: any) => {
  const keys = Object.keys(obj2);
  const result = {};
  let i = 0;
  for (; i < keys.length; i++) {
    const key = keys[i];
    const value = obj2[key];

    if (key in obj1) {
      const bothAreArrays = Array.isArray(obj1[key]) && Array.isArray(value);
      if (obj1[key] === value) {
        continue;
      } else if (bothAreArrays) {
        if (!deepEqual(obj1[key], value))
          result[key] = value;
        else continue;
      } else if (isObject(obj1[key]) && isObject(value)) {
        // Remove empty objects
        const diff = deepDiff(obj1[key], value);
        if (Object.keys(diff).length)
          result[key] = diff;
      } else {
        result[key] = value;
      }
    } else {
      result[key] = value;
    }
  }

  return result;
};

/*!
 * Based on assign-deep <https://github.com/jonschlinkert/assign-deep>
 *
 * Copyright (c) 2017-present, Jon Schlinkert.
 * Released under the MIT License.
 */
export function deepAssign(target, ...args) {
  let i = 0;
  if (isPrimitive(target)) target = args[i++];
  if (!target) target = {};
  for (; i < args.length; i++) {
    if (isObject(args[i])) {
      for (const key of Object.keys(args[i])) {
        if (isValidKey(key)) {
          if (isObject(target[key]) && isObject(args[i][key])) {
            target[key] = deepAssign(Array.isArray(target[key]) ? [] : {}, target[key], args[i][key]);
          } else {
            target[key] = args[i][key];
          }
        }
      }
    }
  }

  return target;
}
