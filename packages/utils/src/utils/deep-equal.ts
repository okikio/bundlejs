import { diff, patch } from "@opentf/obj-diff"; 
import { deepMerge } from "@std/collections";
import { equal } from "@std/assert";

export * from "@opentf/obj-diff";

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
export function deepEqual(obj1: any, obj2: any) {
  return equal(obj1, obj2);
};

/** Compares 2 objects and only keep the keys that are different in both objects */
export const deepDiff = (obj1: any, obj2: any) => {
  return patch({}, diff(obj1, obj2));
};

export const deepAssign = deepMerge;
export { deepMerge };