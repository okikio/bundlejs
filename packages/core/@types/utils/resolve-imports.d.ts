/** The `resolve.exports` package but for imports */
/**
 * @param {object} imports
 * @param {Set<string>} keys
 */
export declare function loop(imports: Record<any, any>, keys: Set<string>): any;
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
export interface ResolveImportOptions {
    browser?: boolean;
    require?: boolean;
    conditions?: string[];
    unsafe?: boolean;
}
/**
 * @param {object} pkg package.json contents
 * @param {string} [entry] entry name or import path
 * @param {object} [options]
 * @param {boolean} [options.browser]
 * @param {boolean} [options.require]
 * @param {string[]} [options.conditions]
 * @param {boolean} [options.unsafe]
 */
export declare function resolveImports(pkg: Record<any, any>, entry?: string, options?: ResolveImportOptions): any;
