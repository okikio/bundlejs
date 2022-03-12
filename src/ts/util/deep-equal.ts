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
export const isObject = (obj: any) => typeof obj === "object" && obj != null;
export const deepEqual = (obj1: any, obj2: any) => {
    if (obj1 === obj2) {
        return true;
    } else if (isObject(obj1) && isObject(obj2)) {
        if (Object.keys(obj1).length !== Object.keys(obj2).length) { return false; }
        for (var prop in obj1) {
            if (!deepEqual(obj1[prop], obj2[prop])) return false;
        }

        return true;
    }
}