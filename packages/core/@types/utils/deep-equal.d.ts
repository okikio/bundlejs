export declare const isObject: (obj: any) => boolean;
export declare const isPrimitive: (val: any) => boolean;
export declare const isValidKey: (key: any) => boolean;
export declare const deepEqual: (obj1: any, obj2: any) => boolean;
/** Compares 2 objects and only keep the keys that are different in both objects */
export declare const deepDiff: (obj1: any, obj2: any) => {};
/*!
 * Based on assign-deep <https://github.com/jonschlinkert/assign-deep>
 *
 * Copyright (c) 2017-present, Jon Schlinkert.
 * Released under the MIT License.
 */
export declare function deepAssign(target: any, ...args: any[]): any;
