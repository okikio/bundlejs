/**
 * Based on `parse-package-name` (https://npmjs.com/parse-package-name) by @egoist (https://github.com/egoist)
 */
/** Parsed a scoped package name into name, version, and path. */
export declare const RE_SCOPED: RegExp;
/** Parsed a non-scoped package name into name, version, path */
export declare const RE_NON_SCOPED: RegExp;
export declare function parsePackageName(input: string): {
    name: string;
    version: string;
    path: string;
};
export default parsePackageName;
