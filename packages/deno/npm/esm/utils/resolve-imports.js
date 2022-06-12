// @ts-nocheck
// deno-lint-ignore-file
/** The `resolve.exports` package but for imports */
/**
 * @param {object | string} imports
 * @param {Set<string>} keys
 */
export function loop(imports, keys) {
    if (typeof imports === 'string') {
        return imports;
    }
    if (imports) {
        let idx, tmp;
        if (Array.isArray(imports)) {
            for (idx = 0; idx < imports.length; idx++) {
                if (tmp = loop(imports[idx], keys))
                    return tmp;
            }
        }
        else {
            for (idx in imports) {
                if (keys.has(idx)) {
                    return loop(imports[idx], keys);
                }
            }
        }
    }
}
/**
 * @param {string} name The package name
 * @param {string} entry The target entry, eg "."
 * @param {number} [condition] Unmatched condition?
 */
export function bail(name, entry, condition) {
    throw new Error(condition
        ? `No known conditions for "${entry}" entry in "${name}" package`
        : `Missing "${entry}" import in "${name}" package`);
}
/**
 * @param {string} name the package name
 * @param {string} entry the target path/import
 */
export function toName(name, entry) {
    return entry === name ? '.'
        : entry[0] === '.' ? entry
            : entry.replace(new RegExp('^' + name + '\/'), './');
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
export function resolveImports(pkg, entry = '.', options = {}) {
    let { name, imports } = pkg;
    if (imports) {
        let { browser, require, unsafe, conditions = [] } = options;
        let target = toName(name, entry);
        // if (target[0] !== '.') target = './' + target;
        if (typeof imports === 'string') {
            return target === '#' ? imports : bail(name, target);
        }
        let allows = new Set(['default', ...conditions]);
        unsafe || allows.add(require ? 'require' : 'import');
        unsafe || allows.add(browser ? 'browser' : 'node');
        let key, tmp, isSingle = false;
        for (key in imports) {
            isSingle = key[0] !== '#';
            break;
        }
        if (isSingle) {
            return target === '#'
                ? loop(imports, allows) || bail(name, target, 1)
                : bail(name, target);
        }
        if (tmp = imports[target]) {
            return loop(tmp, allows) || bail(name, target, 1);
        }
        for (key in imports) {
            tmp = key[key.length - 1];
            if (tmp === '/' && target.startsWith(key)) {
                return (tmp = loop(imports[key], allows))
                    ? (tmp + target.substring(key.length))
                    : bail(name, target, 1);
            }
            if (tmp === '*' && target.startsWith(key.slice(0, -1))) {
                // do not trigger if no *content* to inject
                if (target.substring(key.length - 1).length > 0) {
                    return (tmp = loop(imports[key], allows))
                        ? tmp.replace('*', target.substring(key.length - 1))
                        : bail(name, target, 1);
                }
            }
        }
        return bail(name, target);
    }
}
