/** 
 * Based on `resolve.exports` (https://npmjs.com/resolve.exports) by @lukeed (https://github.com/lukeed)
 */

/**
 * @param {object} exports
 * @param {Set<string>} keys
 */
export function loop(exports: Record<any, any>, keys: Set<string>) {
  if (typeof exports === "string") {
    return exports;
  }

  if (exports) {
    let idx, tmp;
    if (Array.isArray(exports)) {
      for (idx = 0; idx < exports.length; idx++) {
        if (tmp = loop(exports[idx], keys)) return tmp;
      }
    } else {
      for (idx in exports) {
        if (keys.has(idx)) {
          return loop(exports[idx], keys);
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
export function bail(name: string, entry: string, condition?: number) {
  throw new Error(
    condition
      ? `No known conditions for "${entry}" entry in "${name}" package`
      : `Missing "${entry}" export in "${name}" package`
  );
}

/**
 * @param {string} name the package name
 * @param {string} entry the target path/import
 */
export function toName(name: string, entry: string) {
  return entry === name ? "."
    : entry[0] === "." ? entry
      : entry.replace(new RegExp("^" + name + "\/"), "./");
}


export type Options = {
	browser?: boolean;
	conditions?: readonly string[];
	require?: boolean;
	unsafe?: false;
} | {
	conditions?: readonly string[];
	unsafe?: true;
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
export function resolveExports<T = Record<any, any>>(pkg: T, entry = ".", options: Options = {}): string | void {
  const { name, exports } = pkg as unknown as Record<any, any>;

  if (exports) {
    // @ts-ignore
    const { browser, require, unsafe, conditions = [] } = options;

    let target = toName(name, entry);
    if (target[0] !== ".") target = "./" + target;

    if (typeof exports === "string") {
      return target === "." ? exports : bail(name, target);
    }

    const allows = new Set(["default", ...conditions]);
    unsafe || allows.add(require ? "require" : "import");
    unsafe || allows.add(browser ? "browser" : "node");

    let key, tmp, isSingle = false;

    for (key in exports) {
      isSingle = key[0] !== ".";
      break;
    }

    if (isSingle) {
      return target === "."
        ? loop(exports, allows) || bail(name, target, 1)
        : bail(name, target);
    }

    if (tmp = exports[target]) {
      return loop(tmp, allows) || bail(name, target, 1);
    }

    for (key in exports) {
      tmp = key[key.length - 1];
      if (tmp === "/" && target.startsWith(key)) {
        return (tmp = loop(exports[key], allows))
          ? (tmp + target.substring(key.length))
          : bail(name, target, 1);
      }
      if (tmp === "*" && target.startsWith(key.slice(0, -1))) {
        // do not trigger if no *content* to inject
        if (target.substring(key.length - 1).length > 0) {
          return (tmp = loop(exports[key], allows))
            ? tmp.replace("*", target.substring(key.length - 1))
            : bail(name, target, 1);
        }
      }
    }

    return bail(name, target);
  }
}

export type BrowserFiles = Record<string, string | false>;

/**
 * @param {object} pkg
 * @param {object} [options]
 * @param {string|boolean} [options.browser]
 * @param {string[]} [options.fields]
 */
export function legacy<T = Record<any, any>>(pkg: T, options?: { browser: true, fields?: string[] }): BrowserFiles | string | void;
export function legacy<T = Record<any, any>>(pkg: T, options?: { browser: string, fields?: string[] }): string | false | void;
export function legacy<T = Record<any, any>>(pkg: T, options?: { browser: false, fields?: string[] }): string | void;
export function legacy<T = Record<any, any>>(pkg: T, options: {
	browser?: boolean | string;
	fields?: string[];
} = {}): BrowserFiles | string | false | void {
  let i = 0, value,
    browser = options.browser,
    fields = options.fields || ["module", "main"];

  if (browser && !fields.includes("browser")) {
    fields.unshift("browser");
  }

  for (; i < fields.length; i++) {
    if (value = pkg[fields[i]]) {
      if (typeof value == "string") {
        //
      } else if (typeof value == "object" && fields[i] == "browser") {
        if (typeof browser == "string") {
          value = value[browser = toName((pkg as unknown as { name: string }).name, browser)];
          if (value == null) return browser;
        }
      } else {
        continue;
      }

      return typeof value == "string"
        ? ("./" + value.replace(/^\.?\//, ""))
        : value;
    }
  }
}