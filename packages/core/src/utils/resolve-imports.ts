/** 
 * Based on `resolve.exports` (https://npmjs.com/resolve.exports) by @lukeed (https://github.com/lukeed), but tweaked to work for imports
 */
import { toName, bail, loop } from "./resolve-exports";

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
export function resolveImports(pkg: Record<any, any>, entry = ".", options: ResolveImportOptions = {}) {
  const { name, imports } = pkg;

  if (imports) {
    const { browser, require, unsafe, conditions = [] } = options;

    const target = toName(name, entry);
    // if (target[0] !== '.') target = './' + target;

    if (typeof imports === "string") {
      return target === "#" ? imports : bail(name, target);
    }

    const allows = new Set(["default", ...conditions]);
    unsafe || allows.add(require ? "require" : "import");
    unsafe || allows.add(browser ? "browser" : "node");

    let key, tmp, isSingle = false;

    for (key in imports) {
      isSingle = key[0] !== "#";
      break;
    }

    if (isSingle) {
      return target === "#"
        ? loop(imports, allows) || bail(name, target, 1)
        : bail(name, target);
    }

    if (tmp = imports[target]) {
      return loop(tmp, allows) || bail(name, target, 1);
    }

    for (key in imports) {
      tmp = key[key.length - 1];
      if (tmp === "/" && target.startsWith(key)) {
        return (tmp = loop(imports[key], allows))
          ? (tmp + target.substring(key.length))
          : bail(name, target, 1);
      }
      if (tmp === "*" && target.startsWith(key.slice(0, -1))) {
        // do not trigger if no *content* to inject
        if (target.substring(key.length - 1).length > 0) {
          return (tmp = loop(imports[key], allows))
            ? tmp.replace("*", target.substring(key.length - 1))
            : bail(name, target, 1);
        }
      }
    }

    return bail(name, target);
  }
}