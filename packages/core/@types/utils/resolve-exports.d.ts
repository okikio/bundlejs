/**
 * Based on `resolve.exports` (https://npmjs.com/resolve.exports) by @lukeed (https://github.com/lukeed)
 */
/**
 * @param {object} exports
 * @param {Set<string>} keys
 */
export declare function loop(exports: Record<any, any>, keys: Set<string>): any;
/**
 * @param {string} name The package name
 * @param {string} entry The target entry, eg "."
 * @param {number} [condition] Unmatched condition?
 */
export declare function bail(name: string, entry: string, condition?: number): void;
/**
 * @param {string} name the package name
 * @param {string} entry the target path/import
 */
export declare function toName(name: string, entry: string): string;
export declare type Options = {
    browser?: boolean;
    conditions?: readonly string[];
    require?: boolean;
    unsafe?: false;
} | {
    conditions?: readonly string[];
    unsafe?: true;
};
/**
 * @param {object} pkg package.json contents
 * @param {string} [entry] entry name or import path
 * @param {object} [options]
 * @param {boolean} [options.browser]
 * @param {boolean} [options.require]
 * @param {string[]} [options.conditions]
 * @param {boolean} [options.unsafe]
 */
export declare function resolveExports<T = Record<any, any>>(pkg: T, entry?: string, options?: Options): string | void;
export declare type BrowserFiles = Record<string, string | false>;
/**
 * @param {object} pkg
 * @param {object} [options]
 * @param {string|boolean} [options.browser]
 * @param {string[]} [options.fields]
 */
export declare function legacy<T = Record<any, any>>(pkg: T, options?: {
    browser: true;
    fields?: string[];
}): BrowserFiles | string | void;
export declare function legacy<T = Record<any, any>>(pkg: T, options?: {
    browser: string;
    fields?: string[];
}): string | false | void;
export declare function legacy<T = Record<any, any>>(pkg: T, options?: {
    browser: false;
    fields?: string[];
}): string | void;
