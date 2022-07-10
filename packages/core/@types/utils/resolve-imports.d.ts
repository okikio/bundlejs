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
