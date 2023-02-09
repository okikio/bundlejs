/**
 * Based on `semver` (https://npmjs.com/semver) by @npm (https://github.com/npm) a stripped down version that only allows for selecting the max satisfying version of a range of versions.
 */

// Note: this is the semver.org version of the spec that it implements
// Not necessarily the package version of this code.
export const SEMVER_SPEC_VERSION = "2.0.0";

export const MAX_LENGTH = 256;
export const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER ||
/* istanbul ignore next */ 9007199254740991;

// Max safe segment length for coercion.
export const MAX_SAFE_COMPONENT_LENGTH = 16;

export let R = 0;

export const createToken = (pattern: string, isGlobal?) => {
  const index = R++;
  return { index, pattern, regex: new RegExp(pattern, isGlobal ? "g" : undefined) };
};

const NUMERICIDENTIFIER = "0|[1-9]\\d*";
const NUMERICIDENTIFIERLOOSE = "[0-9]+";

const NONNUMERICIDENTIFIER = "\\d*[a-zA-Z-][a-zA-Z0-9-]*";

const PRERELEASEIDENTIFIER = `(?:${NUMERICIDENTIFIER}|${NONNUMERICIDENTIFIER})`;
const PRERELEASEIDENTIFIERLOOSE = `(?:${NUMERICIDENTIFIERLOOSE}|${NONNUMERICIDENTIFIER})`;

const BUILDIDENTIFIER = "[0-9A-Za-z-]+";

const MAINVERSION = `(${NUMERICIDENTIFIER})\\.` + `(${NUMERICIDENTIFIER})\\.` + `(${NUMERICIDENTIFIER})`;
const MAINVERSIONLOOSE = `(${NUMERICIDENTIFIERLOOSE})\\.` + `(${NUMERICIDENTIFIERLOOSE})\\.` + `(${NUMERICIDENTIFIERLOOSE})`;

const BUILD = `(?:\\+(${BUILDIDENTIFIER}(?:\\.${BUILDIDENTIFIER})*))`;

const PRERELEASE = `(?:-(${PRERELEASEIDENTIFIER}(?:\\.${PRERELEASEIDENTIFIER})*))`;
const PRERELEASELOOSE = `(?:-?(${PRERELEASEIDENTIFIERLOOSE}(?:\\.${PRERELEASEIDENTIFIERLOOSE})*))`;

const FULLPLAIN = `v?${MAINVERSION}${PRERELEASE}?${BUILD}?`;
const LOOSEPLAIN = `[v=\\s]*${MAINVERSIONLOOSE}${PRERELEASELOOSE}?${BUILD}?`;

const XRANGEIDENTIFIER = `${NUMERICIDENTIFIER}|x|X|\\*`;
const XRANGEIDENTIFIERLOOSE = `${NUMERICIDENTIFIERLOOSE}|x|X|\\*`;

const GTLT = "((?:<|>)?=?)";

const XRANGEPLAIN = `[v=\\s]*(${XRANGEIDENTIFIER})` + `(?:\\.(${XRANGEIDENTIFIER})` + `(?:\\.(${XRANGEIDENTIFIER})` + `(?:${PRERELEASE})?${BUILD}?` + ")?)?";

const XRANGEPLAINLOOSE = `[v=\\s]*(${XRANGEIDENTIFIERLOOSE})` + `(?:\\.(${XRANGEIDENTIFIERLOOSE})` + `(?:\\.(${XRANGEIDENTIFIERLOOSE})` + `(?:${PRERELEASELOOSE})?${BUILD}?` + ")?)?";

const COERCE = `${"(^|[^\\d])" + "(\\d{1,"}${MAX_SAFE_COMPONENT_LENGTH}})` + `(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?` + `(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?` + "(?:$|[^\\d])";

const LONETILDE = "(?:~>?)";
const LONECARET = "(?:\\^)";

export const tokens = {
  // The following Regular Expressions can be used for tokenizing,
  // validating, and parsing SemVer version strings.

  // ## Numeric Identifier
  // A single `0`, or a non-zero digit followed by zero or more digits.

  NUMERICIDENTIFIER: createToken(NUMERICIDENTIFIER),
  NUMERICIDENTIFIERLOOSE: createToken(NUMERICIDENTIFIERLOOSE),

  // ## Non-numeric Identifier
  // Zero or more digits, followed by a letter or hyphen, and then zero or
  // more letters, digits, or hyphens.

  NONNUMERICIDENTIFIER: createToken(NONNUMERICIDENTIFIER),

  // ## Main Version
  // Three dot-separated numeric identifiers.

  MAINVERSION: createToken(MAINVERSION),

  MAINVERSIONLOOSE: createToken(MAINVERSIONLOOSE),

  // ## Pre-release Version Identifier
  // A numeric identifier, or a non-numeric identifier.

  PRERELEASEIDENTIFIER: createToken(PRERELEASEIDENTIFIER),

  PRERELEASEIDENTIFIERLOOSE: createToken(PRERELEASEIDENTIFIERLOOSE),

  // ## Pre-release Version
  // Hyphen, followed by one or more dot-separated pre-release version
  // identifiers.

  PRERELEASE: createToken(PRERELEASE),

  PRERELEASELOOSE: createToken(PRERELEASELOOSE),

  // ## Build Metadata Identifier
  // Any combination of digits, letters, or hyphens.

  BUILDIDENTIFIER: createToken(BUILDIDENTIFIER),

  // ## Build Metadata
  // Plus sign, followed by one or more period-separated build metadata
  // identifiers.

  BUILD: createToken(BUILD),

  // ## Full Version String
  // A main version, followed optionally by a pre-release version and
  // build metadata.

  // Note that the only major, minor, patch, and pre-release sections of
  // the version string are capturing groups.  The build metadata is not a
  // capturing group, because it should not ever be used in version
  // comparison.

  FULLPLAIN: createToken(FULLPLAIN),

  FULL: createToken(`^${FULLPLAIN}$`),

  // like full, but allows v1.2.3 and =1.2.3, which people do sometimes.
  // also, 1.0.0alpha1 (prerelease without the hyphen) which is pretty
  // common in the npm registry.
  LOOSEPLAIN: createToken(LOOSEPLAIN),

  LOOSE: createToken(`^${LOOSEPLAIN}$`),

  GTLT: createToken(GTLT),

  // Something like "2.*" or "1.2.x".
  // Note that "x.x" is a valid xRange identifer, meaning "any version"
  // Only the first item is strictly required.
  XRANGEIDENTIFIERLOOSE: createToken(XRANGEIDENTIFIERLOOSE),
  XRANGEIDENTIFIER: createToken(XRANGEIDENTIFIER),

  XRANGEPLAIN: createToken(XRANGEPLAIN),

  XRANGEPLAINLOOSE: createToken(XRANGEPLAINLOOSE),

  XRANGE: createToken(`^${GTLT}\\s*${XRANGEPLAIN}$`),
  XRANGELOOSE: createToken(`^${GTLT}\\s*${XRANGEPLAINLOOSE}$`),

  // Coercion.
  // Extract anything that could conceivably be a part of a valid semver
  COERCE: createToken(COERCE),
  COERCERTL: createToken(COERCE, true),

  // Tilde ranges.
  // Meaning is "reasonably at or greater than"
  LONETILDE: createToken("(?:~>?)"),

  TILDETRIM: createToken(`(\\s*)${LONETILDE}\\s+`, true),

  TILDE: createToken(`^${LONETILDE}${XRANGEPLAIN}$`),
  TILDELOOSE: createToken(`^${LONETILDE}${XRANGEPLAINLOOSE}$`),

  // Caret ranges.
  // Meaning is "at least and backwards compatible with"
  LONECARET: createToken("(?:\\^)"),

  CARETTRIM: createToken(`(\\s*)${LONECARET}\\s+`, true),

  CARET: createToken(`^${LONECARET}${XRANGEPLAIN}$`),
  CARETLOOSE: createToken(`^${LONECARET}${XRANGEPLAINLOOSE}$`),

  // A simple gt/lt/eq thing, or just "" to indicate "any version"
  COMPARATORLOOSE: createToken(`^${GTLT}\\s*(${LOOSEPLAIN})$|^$`),
  COMPARATOR: createToken(`^${GTLT}\\s*(${FULLPLAIN})$|^$`),

  // An expression to strip any whitespace between the gtlt and the thing
  // it modifies, so that `> 1.2.3` ==> `>1.2.3`
  COMPARATORTRIM: createToken(`(\\s*)${GTLT
  }\\s*(${LOOSEPLAIN}|${XRANGEPLAIN})`, true),

  // Something like `1.2.3 - 1.2.4`
  // Note that these all use the loose form, because they'll be
  // checked against either the strict or loose comparator form
  // later.
  HYPHENRANGE: createToken(`^\\s*(${XRANGEPLAIN})` +
    "\\s+-\\s+" +
    `(${XRANGEPLAIN})` +
    "\\s*$"),

  HYPHENRANGELOOSE: createToken(`^\\s*(${XRANGEPLAINLOOSE})` +
    "\\s+-\\s+" +
    `(${XRANGEPLAINLOOSE})` +
    "\\s*$"),

  // Star ranges basically just allow anything at all.
  STAR: createToken("(<|>)?=?\\s*\\*"),
  // >=0.0.0 is like a star
  GTE0: createToken("^\\s*>=\\s*0\\.0\\.0\\s*$"),
  GTE0PRE: createToken("^\\s*>=\\s*0\\.0\\.0-0\\s*$"),
};

// parse out just the options we care about so we always get a consistent
// obj with keys in a consistent order.
const opts = ["includePrerelease", "loose", "rtl"];
export const parseOptions = options =>
  !options ? {}
    : typeof options !== "object" ? { loose: true }
      : opts.filter(k => options[k]).reduce((o, k) => {
        o[k] = true;
        return o;
      }, {});

export const numeric = /^[0-9]+$/;

/**
 * Compares two identifiers, must be numeric strings or truthy/falsy values.
 *
 * Sorts in ascending order when passed to `Array.sort()`.
 */
export const compareIdentifiers = (a: string | number, b: string | number): 1 | 0 | -1 => {
  const anum = numeric.test(a as string);
  const bnum = numeric.test(b as string);

  let _a: number | string = a;
  let _b: number | string = b;

  if (anum && bnum) {
    _a = +a;
    _b = +b;
  }

  return _a === _b ? 0
    : (anum && !bnum) ? -1
      : (bnum && !anum) ? 1
        : _a < _b ? -1
          : 1;
};

export interface Options {
  loose?: boolean | undefined;
  includePrerelease?: boolean | undefined;
}

export class SemVer {
  raw: string;
  loose: boolean;
  options: Options;

  major: number;
  minor: number;
  patch: number;
  version: string;
  build: ReadonlyArray<string>;
  prerelease: ReadonlyArray<string | number>;
  includePrerelease: boolean | undefined;

  constructor(version: string | SemVer, options?: boolean | Options) {
    options = parseOptions(options);

    if (version instanceof SemVer) {
      if (version.loose === !!options.loose &&
        version.includePrerelease === !!options.includePrerelease) {
        return version;
      } else {
        version = version.version;
      }
    } else if (typeof version !== "string") {
      throw new TypeError(`Invalid Version: ${version}`);
    }

    if (version.length > MAX_LENGTH) {
      throw new TypeError(
        `version is longer than ${MAX_LENGTH} characters`
      );
    }

    this.options = options;
    this.loose = !!options.loose;
    // this isn't actually relevant for versions, but keep it so that we
    // don't run into trouble passing this.options around.
    this.includePrerelease = !!options.includePrerelease;

    const m = version.trim().match(options.loose ? tokens.LOOSE.regex : tokens.FULL.regex);

    if (!m) {
      throw new TypeError(`Invalid Version: ${version}`);
    }

    this.raw = version;

    // these are actually numbers
    this.major = +m[1];
    this.minor = +m[2];
    this.patch = +m[3];

    if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
      throw new TypeError("Invalid major version");
    }

    if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
      throw new TypeError("Invalid minor version");
    }

    if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
      throw new TypeError("Invalid patch version");
    }

    // numberify any prerelease numeric ids
    if (!m[4]) {
      this.prerelease = [];
    } else {
      this.prerelease = m[4].split(".").map((id) => {
        if (/^[0-9]+$/.test(id)) {
          const num = +id;
          if (num >= 0 && num < MAX_SAFE_INTEGER) {
            return num;
          }
        }
        return id;
      });
    }

    this.build = m[5] ? m[5].split(".") : [];
    this.format();
  }

  format() {
    this.version = `${this.major}.${this.minor}.${this.patch}`;
    if (this.prerelease.length) {
      this.version += `-${this.prerelease.join(".")}`;
    }
    return this.version;
  }

  toString() {
    return this.version;
  }

  /**
   * Compares two versions excluding build identifiers (the bit after `+` in the semantic version string).
   *
   * @return
   * - `0` if `this` == `other`
   * - `1` if `this` is greater
   * - `-1` if `other` is greater.
   */
  compare(other: string | SemVer): 1 | 0 | -1 {
    if (!(other instanceof SemVer)) {
      if (typeof other === "string" && other === this.version) {
        return 0;
      }
      other = new SemVer(other, this.options);
    }

    if (other.version === this.version) {
      return 0;
    }

    return this.compareMain(other) || this.comparePre(other);
  }

  /**
   * Compares the release portion of two versions.
   *
   * @return
   * - `0` if `this` == `other`
   * - `1` if `this` is greater
   * - `-1` if `other` is greater.
   */
  compareMain(other: string | SemVer): 1 | 0 | -1 {
    if (!(other instanceof SemVer)) {
      other = new SemVer(other, this.options);
    }

    return (
      compareIdentifiers(this.major, other.major) ||
      compareIdentifiers(this.minor, other.minor) ||
      compareIdentifiers(this.patch, other.patch)
    );
  }

  /**
   * Compares the prerelease portion of two versions.
   *
   * @return
   * - `0` if `this` == `other`
   * - `1` if `this` is greater
   * - `-1` if `other` is greater.
   */
  comparePre(other: string | SemVer): 1 | 0 | -1 {
    if (!(other instanceof SemVer)) {
      other = new SemVer(other, this.options);
    }

    // NOT having a prerelease is > having one
    if (this.prerelease.length && !other.prerelease.length) {
      return -1;
    } else if (!this.prerelease.length && other.prerelease.length) {
      return 1;
    } else if (!this.prerelease.length && !other.prerelease.length) {
      return 0;
    }

    let i = 0;
    do {
      const a = this.prerelease[i];
      const b = other.prerelease[i];
      if (a === undefined && b === undefined) {
        return 0;
      } else if (b === undefined) {
        return 1;
      } else if (a === undefined) {
        return -1;
      } else if (a === b) {
        continue;
      } else {
        return compareIdentifiers(a, b);
      }
    } while (++i);
  }
}

export const ANY = Symbol("SemVer ANY");

export type ComparatorOperator = "" | "=" | "<" | ">" | "<=" | ">=";
export class Comparator {
  semver: SemVer | typeof ANY;
  operator: ComparatorOperator;
  value: string;
  loose: boolean;
  options: Options;

  constructor(comp: string | Comparator, optionsOrLoose?: boolean | Options) {
    optionsOrLoose = parseOptions(optionsOrLoose);

    if (comp instanceof Comparator) {
      if (comp.loose === !!optionsOrLoose.loose) {
        return comp;
      } else {
        comp = comp.value;
      }
    }

    this.options = optionsOrLoose;
    this.loose = !!optionsOrLoose.loose;
    this.parse(comp);

    if (this.semver === ANY) {
      this.value = "";
    } else {
      this.value = this.operator + this.semver.version;
    }

  }

  parse(comp: string) {
    const r = this.options.loose ? tokens.COMPARATORLOOSE.regex : tokens.COMPARATOR.regex;
    const m = comp.match(r);

    if (!m) {
      throw new TypeError(`Invalid comparator: ${comp}`);
    }

    this.operator = (m[1] !== undefined ? m[1] : "") as ComparatorOperator;
    if (this.operator === "=") {
      this.operator = "";
    }

    // if it literally is just '>' or '' then allow anything.
    if (!m[2]) {
      this.semver = ANY;
    } else {
      this.semver = new SemVer(m[2], this.options.loose);
    }
  }

  toString() {
    return this.value;
  }
}

const cache = new Map<string, Comparator[]>();
const cacheLastAccessTime = new Map<string, number>();
const cacheLimit = 1000;

export const caretTrimReplace = "$1^";
export const tildeTrimReplace = "$1~";
export const comparatorTrimReplace = "$1$2$3";

export const isNullSet = c => c.value === "<0.0.0-0";
export const isAny = c => c.value === "";


// comprised of xranges, tildes, stars, and gtlt's at this point.
// already replaced the hyphen ranges
// turn into a set of JUST comparators.
export const parseComparator = (comp, options) => {
  comp = replaceCarets(comp, options);
  comp = replaceTildes(comp, options);
  comp = replaceXRanges(comp, options);
  comp = replaceStars(comp, options);
  return comp;
};

export const isX = id => !id || id.toLowerCase() === "x" || id === "*";

// ~, ~> --> * (any, kinda silly)
// ~2, ~2.x, ~2.x.x, ~>2, ~>2.x ~>2.x.x --> >=2.0.0 <3.0.0-0
// ~2.0, ~2.0.x, ~>2.0, ~>2.0.x --> >=2.0.0 <2.1.0-0
// ~1.2, ~1.2.x, ~>1.2, ~>1.2.x --> >=1.2.0 <1.3.0-0
// ~1.2.3, ~>1.2.3 --> >=1.2.3 <1.3.0-0
// ~1.2.0, ~>1.2.0 --> >=1.2.0 <1.3.0-0
export const replaceTildes = (comp, options) =>
  comp.trim().split(/\s+/).map((c) => {
    return replaceTilde(c, options);
  }).join(" ");

export const replaceTilde = (comp, options) => {
  const r = options.loose ? tokens.TILDELOOSE.regex : tokens.TILDE.regex;
  return comp.replace(r, (_, M, m, p, pr) => {
    let ret;

    if (isX(M)) {
      ret = "";
    } else if (isX(m)) {
      ret = `>=${M}.0.0 <${+M + 1}.0.0-0`;
    } else if (isX(p)) {
      // ~1.2 == >=1.2.0 <1.3.0-0
      ret = `>=${M}.${m}.0 <${M}.${+m + 1}.0-0`;
    } else if (pr) {
      ret = `>=${M}.${m}.${p}-${pr
      } <${M}.${+m + 1}.0-0`;
    } else {
      // ~1.2.3 == >=1.2.3 <1.3.0-0
      ret = `>=${M}.${m}.${p
      } <${M}.${+m + 1}.0-0`;
    }

    return ret;
  });
};

// ^ --> * (any, kinda silly)
// ^2, ^2.x, ^2.x.x --> >=2.0.0 <3.0.0-0
// ^2.0, ^2.0.x --> >=2.0.0 <3.0.0-0
// ^1.2, ^1.2.x --> >=1.2.0 <2.0.0-0
// ^1.2.3 --> >=1.2.3 <2.0.0-0
// ^1.2.0 --> >=1.2.0 <2.0.0-0
export const replaceCarets = (comp, options) =>
  comp.trim().split(/\s+/).map((c) => {
    return replaceCaret(c, options);
  }).join(" ");

export const replaceCaret = (comp, options) => {
  const r = options.loose ? tokens.CARETLOOSE.regex : tokens.CARET.regex;
  const z = options.includePrerelease ? "-0" : "";
  return comp.replace(r, (_, M, m, p, pr) => {
    let ret;

    if (isX(M)) {
      ret = "";
    } else if (isX(m)) {
      ret = `>=${M}.0.0${z} <${+M + 1}.0.0-0`;
    } else if (isX(p)) {
      if (M === "0") {
        ret = `>=${M}.${m}.0${z} <${M}.${+m + 1}.0-0`;
      } else {
        ret = `>=${M}.${m}.0${z} <${+M + 1}.0.0-0`;
      }
    } else if (pr) {
      if (M === "0") {
        if (m === "0") {
          ret = `>=${M}.${m}.${p}-${pr
          } <${M}.${m}.${+p + 1}-0`;
        } else {
          ret = `>=${M}.${m}.${p}-${pr
          } <${M}.${+m + 1}.0-0`;
        }
      } else {
        ret = `>=${M}.${m}.${p}-${pr
        } <${+M + 1}.0.0-0`;
      }
    } else {
      if (M === "0") {
        if (m === "0") {
          ret = `>=${M}.${m}.${p
          }${z} <${M}.${m}.${+p + 1}-0`;
        } else {
          ret = `>=${M}.${m}.${p
          }${z} <${M}.${+m + 1}.0-0`;
        }
      } else {
        ret = `>=${M}.${m}.${p
        } <${+M + 1}.0.0-0`;
      }
    }

    return ret;
  });
};

export const replaceXRanges = (comp, options) => {
  return comp.split(/\s+/).map((c) => {
    return replaceXRange(c, options);
  }).join(" ");
};

export const replaceXRange = (comp, options) => {
  comp = comp.trim();
  const r = options.loose ? tokens.XRANGELOOSE.regex : tokens.XRANGE.regex;
  return comp.replace(r, (ret, gtlt, M, m, p, pr) => {
    const xM = isX(M);
    const xm = xM || isX(m);
    const xp = xm || isX(p);
    const anyX = xp;

    if (gtlt === "=" && anyX) {
      gtlt = "";
    }

    // if we're including prereleases in the match, then we need
    // to fix this to -0, the lowest possible prerelease value
    pr = options.includePrerelease ? "-0" : "";

    if (xM) {
      if (gtlt === ">" || gtlt === "<") {
        // nothing is allowed
        ret = "<0.0.0-0";
      } else {
        // nothing is forbidden
        ret = "*";
      }
    } else if (gtlt && anyX) {
      // we know patch is an x, because we have any x at all.
      // replace X with 0
      if (xm) {
        m = 0;
      }
      p = 0;

      if (gtlt === ">") {
        // >1 => >=2.0.0
        // >1.2 => >=1.3.0
        gtlt = ">=";
        if (xm) {
          M = +M + 1;
          m = 0;
          p = 0;
        } else {
          m = +m + 1;
          p = 0;
        }
      } else if (gtlt === "<=") {
        // <=0.7.x is actually <0.8.0, since any 0.7.x should
        // pass.  Similarly, <=7.x is actually <8.0.0, etc.
        gtlt = "<";
        if (xm) {
          M = +M + 1;
        } else {
          m = +m + 1;
        }
      }

      if (gtlt === "<") {
        pr = "-0";
      }

      ret = `${gtlt + M}.${m}.${p}${pr}`;
    } else if (xm) {
      ret = `>=${M}.0.0${pr} <${+M + 1}.0.0-0`;
    } else if (xp) {
      ret = `>=${M}.${m}.0${pr
      } <${M}.${+m + 1}.0-0`;
    }


    return ret;
  });
};

// Because * is AND-ed with everything else in the comparator,
// and '' means "any version", just remove the *s entirely.
export const replaceStars = (comp, options) => {
  // Looseness is ignored here.  star is always as loose as it gets!
  return comp.trim().replace(tokens.STAR.regex, "");
};

export const replaceGTE0 = (comp, options) => {
  return comp.trim()
    .replace(tokens[options.includePrerelease ? "GTE0PRE" : "GTE0"].regex, "");
};

// This function is passed to string.replace(tokens.HYPHENRANGE.regex)
// M, m, patch, prerelease, build
// 1.2 - 3.4.5 => >=1.2.0 <=3.4.5
// 1.2.3 - 3.4 => >=1.2.0 <3.5.0-0 Any 3.4.x will do
// 1.2 - 3.4 => >=1.2.0 <3.5.0-0
export const hyphenReplace = incPr => ($0,
  from, fM, fm, fp, fpr, fb,
  to, tM, tm, tp, tpr, tb) => {
  if (isX(fM)) {
    from = "";
  } else if (isX(fm)) {
    from = `>=${fM}.0.0${incPr ? "-0" : ""}`;
  } else if (isX(fp)) {
    from = `>=${fM}.${fm}.0${incPr ? "-0" : ""}`;
  } else if (fpr) {
    from = `>=${from}`;
  } else {
    from = `>=${from}${incPr ? "-0" : ""}`;
  }

  if (isX(tM)) {
    to = "";
  } else if (isX(tm)) {
    to = `<${+tM + 1}.0.0-0`;
  } else if (isX(tp)) {
    to = `<${tM}.${+tm + 1}.0-0`;
  } else if (tpr) {
    to = `<=${tM}.${tm}.${tp}-${tpr}`;
  } else if (incPr) {
    to = `<${tM}.${tm}.${+tp + 1}-0`;
  } else {
    to = `<=${to}`;
  }

  return (`${from} ${to}`).trim();
};

export const testSet = (set, version, options) => {
  for (let i = 0; i < set.length; i++) {
    if (!set[i].test(version)) {
      return false;
    }
  }

  if (version.prerelease.length && !options.includePrerelease) {
    // Find the set of versions that are allowed to have prereleases
    // For example, ^1.2.3-pr.1 desugars to >=1.2.3-pr.1 <2.0.0
    // That should allow `1.2.3-pr.2` to pass.
    // However, `1.2.4-alpha.notready` should NOT be allowed,
    // even though it's within the range set by the comparators.
    for (let i = 0; i < set.length; i++) {
      if (set[i].semver === ANY) {
        continue;
      }

      if (set[i].semver.prerelease.length > 0) {
        const allowed = set[i].semver;
        if (allowed.major === version.major &&
          allowed.minor === version.minor &&
          allowed.patch === version.patch) {
          return true;
        }
      }
    }

    // Version has a -pre, but it's not one of the ones we like.
    return false;
  }

  return true;
};

// hoisted class for cyclic dependency
export class Range {
  range: string;
  raw: string;
  loose: boolean;
  options: Options;
  includePrerelease: boolean;
  set: ReadonlyArray<ReadonlyArray<Comparator>>;

  constructor(range: string | Range, optionsOrLoose?: boolean | Options) {
    optionsOrLoose = parseOptions(optionsOrLoose);

    if (range instanceof Range) {
      if (
        range.loose === !!optionsOrLoose.loose &&
        range.includePrerelease === !!optionsOrLoose.includePrerelease
      ) {
        return range;
      } else {
        return new Range(range.raw, optionsOrLoose);
      }
    }

    this.options = optionsOrLoose;
    this.loose = !!optionsOrLoose.loose;
    this.includePrerelease = !!optionsOrLoose.includePrerelease;

    // First, split based on boolean or ||
    this.raw = range;
    this.set = range
      .split("||")
      // map the range to a 2d array of comparators
      .map(r => this.parseRange(r.trim()))
      // throw out any comparator lists that are empty
      // this generally means that it was not a valid range, which is allowed
      // in loose mode, but will still throw if the WHOLE range is invalid.
      .filter(c => c.length);

    if (!this.set.length) {
      throw new TypeError(`Invalid SemVer Range: ${range}`);
    }

    // if we have any that are not the null set, throw out null sets.
    if (this.set.length > 1) {
      // keep the first one, in case they're all null sets
      const first = this.set[0];
      this.set = this.set.filter(c => !isNullSet(c[0]));
      if (this.set.length === 0) {
        this.set = [first];
      } else if (this.set.length > 1) {
        // if we have any that are *, then the range is just *
        for (const c of this.set) {
          if (c.length === 1 && isAny(c[0])) {
            this.set = [c];
            break;
          }
        }
      }
    }

    this.format();
  }

  format() {
    this.range = this.set
      .map((comps) => {
        return comps.join(" ").trim();
      })
      .join("||")
      .trim();
    return this.range;
  }

  toString() {
    return this.range;
  }

  parseRange(range: string): ReadonlyArray<Comparator> {
    range = range.trim();

    // memoize range parsing for performance.
    // this is a very hot path, and fully deterministic.
    const memoOpts = Object.keys(this.options).join(",");
    const memoKey = `parseRange:${memoOpts}:${range}`;
    if (cache.has(memoKey)) {
      cacheLastAccessTime.set(memoKey, Date.now());
      return cache.get(memoKey);
    }

    const loose = this.options.loose;
    // `1.2.3 - 1.2.4` => `>=1.2.3 <=1.2.4`
    const hr = loose ? tokens.HYPHENRANGELOOSE.regex : tokens.HYPHENRANGE.regex;
    range = range.replace(hr, hyphenReplace(this.options.includePrerelease));
    // `> 1.2.3 < 1.2.5` => `>1.2.3 <1.2.5`
    range = range.replace(tokens.COMPARATORTRIM.regex, comparatorTrimReplace);

    // `~ 1.2.3` => `~1.2.3`
    range = range.replace(tokens.TILDETRIM.regex, tildeTrimReplace);

    // `^ 1.2.3` => `^1.2.3`
    range = range.replace(tokens.CARETTRIM.regex, caretTrimReplace);

    // normalize spaces
    range = range.split(/\s+/).join(" ");

    // At this point, the range is completely trimmed and
    // ready to be split into comparators.

    let rangeList = range
      .split(" ")
      .map(comp => parseComparator(comp, this.options))
      .join(" ")
      .split(/\s+/)
      // >=0.0.0 is equivalent to *
      .map(comp => replaceGTE0(comp, this.options));

    if (loose) {
      // in loose mode, throw out any that are not valid comparators
      rangeList = rangeList.filter(comp => {
        return !!comp.match(tokens.COMPARATORLOOSE.regex);
      });
    }

    // if any comparators are the null set, then replace with JUST null set
    // if more than one comparator, remove any * comparators
    // also, don't include the same comparator more than once
    const rangeMap = new Map();
    const comparators = rangeList.map(comp => new Comparator(comp, this.options));
    for (const comp of comparators) {
      if (isNullSet(comp)) {
        return [comp];
      }
      rangeMap.set(comp.value, comp);
    }
    if (rangeMap.size > 1 && rangeMap.has("")) {
      rangeMap.delete("");
    }

    const result = [...rangeMap.values()];
    const cacheValue = result;
    cache.set(memoKey, cacheValue);
    cacheLastAccessTime.set(memoKey, Date.now());

    if (cache.size >= cacheLimit) {
      const sortedCacheItems = [...cacheLastAccessTime.entries()].sort((a, b) => a[1] - b[1]);
      const oldestKey = sortedCacheItems[0][0];

      cache.delete(oldestKey);
      cacheLastAccessTime.delete(oldestKey);
    }
    return result;
  }

  // if ANY of the sets match ALL of its comparators, then pass
  test(version: string | SemVer): boolean {
    if (!version) {
      return false;
    }

    if (typeof version === "string") {
      try {
        version = new SemVer(version, this.options);
      } catch (er) {
        return false;
      }
    }

    for (let i = 0; i < this.set.length; i++) {
      if (testSet(this.set[i], version, this.options)) {
        return true;
      }
    }
    return false;
  }
}

/**
 * Return the highest version in the list that satisfies the range, or null if none of them do.
 */
export function maxSatisfying<T extends string | SemVer>(versions: ReadonlyArray<T>, range: string | Range, optionsOrLoose?: boolean | Options): T | null {
  let max = null;
  let maxSV = null;
  let rangeObj = null;
  try {
    rangeObj = new Range(range, optionsOrLoose);
  } catch (er) {
    return null;
  }
  versions.forEach((v) => {
    if (rangeObj.test(v)) {
      // satisfies(v, range, options)
      if (!max || maxSV.compare(v) === -1) {
        // compare(max, v, true)
        max = v;
        maxSV = new SemVer(max, optionsOrLoose);
      }
    }
  });
  return max;
}

export default maxSatisfying;