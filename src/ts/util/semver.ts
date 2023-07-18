// Copyright 2018-2023 the Deno authors. All rights reserved. MIT license.

/**
 * MAX is a sentinel value used by some range calculations.
 * It is equivalent to `∞.∞.∞`.
 */
export const MAX: SemVer = {
  major: Number.POSITIVE_INFINITY,
  minor: Number.POSITIVE_INFINITY,
  patch: Number.POSITIVE_INFINITY,
  prerelease: [],
  build: [],
};

/**
 * The minimum valid SemVer object. Equivalent to `0.0.0`.
 */
export const MIN: SemVer = {
  major: 0,
  minor: 0,
  patch: 0,
  prerelease: [],
  build: [],
};

/**
 * A sentinel value used to denote an invalid SemVer object
 * which may be the result of impossible ranges or comparator operations.
 * @example
 * ```ts
 * import { eq } from "https://deno.land/std@$STD_VERSION/semver/eq.ts";
 * import { parse } from "https://deno.land/std@$STD_VERSION/semver/parse.ts";
 * import { INVALID } from "https://deno.land/std@$STD_VERSION/semver/constants.ts"
 * eq(parse("1.2.3"), INVALID);
 * ```
 */
export const INVALID: SemVer = {
  major: Number.NEGATIVE_INFINITY,
  minor: Number.POSITIVE_INFINITY,
  patch: Number.POSITIVE_INFINITY,
  prerelease: [],
  build: [],
};

/**
 * ANY is a sentinel value used by some range calculations. It is not a valid
 * SemVer object and should not be used directly.
 * @example
 * ```ts
 * import { eq } from "https://deno.land/std@$STD_VERSION/semver/eq.ts";
 * import { parse } from "https://deno.land/std@$STD_VERSION/semver/parse.ts";
 * import { ANY } from "https://deno.land/std@$STD_VERSION/semver/constants.ts"
 * eq(parse("1.2.3"), ANY); // false
 * ```
 */
export const ANY: SemVer = {
  major: Number.NaN,
  minor: Number.NaN,
  patch: Number.NaN,
  prerelease: [],
  build: [],
};

/**
 * A comparator which will span all valid semantic versions
 */
export const ALL: SemVerComparator = {
  operator: "",
  semver: ANY,
  min: MIN,
  max: MAX,
};

/**
 * A comparator which will not span any semantic versions
 */
export const NONE: SemVerComparator = {
  operator: "<",
  semver: MIN,
  min: MAX,
  max: MIN,
};

// The actual regexps
const re: RegExp[] = [];
const src: string[] = [];
let R = 0;

// The following Regular Expressions can be used for tokenizing,
// validating, and parsing SemVer version strings.

// ## Numeric Identifier
// A single `0`, or a non-zero digit followed by zero or more digits.

const NUMERICIDENTIFIER: number = R++;
src[NUMERICIDENTIFIER] = "0|[1-9]\\d*";

// ## Non-numeric Identifier
// Zero or more digits, followed by a letter or hyphen, and then zero or
// more letters, digits, or hyphens.

const NONNUMERICIDENTIFIER: number = R++;
src[NONNUMERICIDENTIFIER] = "\\d*[a-zA-Z-][a-zA-Z0-9-]*";

// ## Main Version
// Three dot-separated numeric identifiers.

const MAINVERSION: number = R++;
const nid = src[NUMERICIDENTIFIER];
src[MAINVERSION] = `(${nid})\\.(${nid})\\.(${nid})`;

// ## Pre-release Version Identifier
// A numeric identifier, or a non-numeric identifier.

const PRERELEASEIDENTIFIER: number = R++;
src[PRERELEASEIDENTIFIER] = "(?:" + src[NUMERICIDENTIFIER] + "|" +
  src[NONNUMERICIDENTIFIER] + ")";

// ## Pre-release Version
// Hyphen, followed by one or more dot-separated pre-release version
// identifiers.

const PRERELEASE: number = R++;
src[PRERELEASE] = "(?:-(" +
  src[PRERELEASEIDENTIFIER] +
  "(?:\\." +
  src[PRERELEASEIDENTIFIER] +
  ")*))";

// ## Build Metadata Identifier
// Any combination of digits, letters, or hyphens.

const BUILDIDENTIFIER: number = R++;
src[BUILDIDENTIFIER] = "[0-9A-Za-z-]+";

// ## Build Metadata
// Plus sign, followed by one or more period-separated build metadata
// identifiers.

const BUILD: number = R++;
src[BUILD] = "(?:\\+(" + src[BUILDIDENTIFIER] + "(?:\\." +
  src[BUILDIDENTIFIER] + ")*))";

// ## Full Version String
// A main version, followed optionally by a pre-release version and
// build metadata.

// Note that the only major, minor, patch, and pre-release sections of
// the version string are capturing groups.  The build metadata is not a
// capturing group, because it should not ever be used in version
// comparison.

const FULL: number = R++;
const FULLPLAIN = "v?" + src[MAINVERSION] + src[PRERELEASE] + "?" + src[BUILD] +
  "?";

src[FULL] = "^" + FULLPLAIN + "$";

const GTLT: number = R++;
src[GTLT] = "((?:<|>)?=?)";

// Something like "2.*" or "1.2.x".
// Note that "x.x" is a valid xRange identifier, meaning "any version"
// Only the first item is strictly required.
const XRANGEIDENTIFIER: number = R++;
src[XRANGEIDENTIFIER] = src[NUMERICIDENTIFIER] + "|x|X|\\*";

const XRANGEPLAIN: number = R++;
src[XRANGEPLAIN] = "[v=\\s]*(" +
  src[XRANGEIDENTIFIER] +
  ")" +
  "(?:\\.(" +
  src[XRANGEIDENTIFIER] +
  ")" +
  "(?:\\.(" +
  src[XRANGEIDENTIFIER] +
  ")" +
  "(?:" +
  src[PRERELEASE] +
  ")?" +
  src[BUILD] +
  "?" +
  ")?)?";

const XRANGE: number = R++;
src[XRANGE] = "^" + src[GTLT] + "\\s*" + src[XRANGEPLAIN] + "$";

// Tilde ranges.
// Meaning is "reasonably at or greater than"
const LONETILDE: number = R++;
src[LONETILDE] = "(?:~>?)";

const TILDE: number = R++;
src[TILDE] = "^" + src[LONETILDE] + src[XRANGEPLAIN] + "$";

// Caret ranges.
// Meaning is "at least and backwards compatible with"
const LONECARET: number = R++;
src[LONECARET] = "(?:\\^)";

const CARET: number = R++;
src[CARET] = "^" + src[LONECARET] + src[XRANGEPLAIN] + "$";

// A simple gt/lt/eq thing, or just "" to indicate "any version"
const COMPARATOR: number = R++;
src[COMPARATOR] = "^" + src[GTLT] + "\\s*(" + FULLPLAIN + ")$|^$";

// Something like `1.2.3 - 1.2.4`
const HYPHENRANGE: number = R++;
src[HYPHENRANGE] = "^\\s*(" +
  src[XRANGEPLAIN] +
  ")" +
  "\\s+-\\s+" +
  "(" +
  src[XRANGEPLAIN] +
  ")" +
  "\\s*$";

// Star ranges basically just allow anything at all.
const STAR: number = R++;
src[STAR] = "(<|>)?=?\\s*\\*";

// Compile to actual regexp objects.
// All are flag-free, unless they were created above with a flag.
for (let i = 0; i < R; i++) {
  if (!re[i]) {
    re[i] = new RegExp(src[i]);
  }
}


function formatNumber(value: number) {
  if (value === Number.POSITIVE_INFINITY) {
    return "∞";
  } else if (value === Number.NEGATIVE_INFINITY) {
    return "⧞";
  } else {
    return value.toFixed(0);
  }
}

/**
 * Format a SemVer object into a string.
 *
 * If any number is NaN then NaN will be printed.
 *
 * If any number is positive or negative infinity then '∞' or '⧞' will be printed instead.
 *
 * @param semver The semantic version to format
 * @returns The string representation of a semantic version.
 */
export function format(semver: SemVer, style: FormatStyle = "full") {
  if (semver === ANY) {
    return "*";
  }

  const major = formatNumber(semver.major);
  const minor = formatNumber(semver.minor);
  const patch = formatNumber(semver.patch);
  const pre = semver.prerelease.join(".");
  const build = semver.build.join(".");

  const primary = `${major}.${minor}.${patch}`;
  const release = [primary, pre].filter((v) => v).join("-");
  const full = [release, build].filter((v) => v).join("+");
  switch (style) {
    case "full":
      return full;
    case "release":
      return release;
    case "primary":
      return primary;
    case "build":
      return build;
    case "pre":
      return pre;
    case "patch":
      return patch;
    case "minor":
      return minor;
    case "major":
      return major;
  }
}


function pre(
  prerelease: ReadonlyArray<string | number>,
  identifier: string | undefined,
) {
  let values = [...prerelease];

  // In reality this will either be 0, 1 or 2 entries.
  let i: number = values.length;
  while (--i >= 0) {
    if (typeof values[i] === "number") {
      // deno-fmt-ignore
      (values[i] as number)++;
      i = -2;
    }
  }

  if (i === -1) {
    // didn't increment anything
    values.push(0);
  }

  if (identifier) {
    // 1.2.0-beta.1 bumps to 1.2.0-beta.2,
    // 1.2.0-beta.foobar or 1.2.0-beta bumps to 1.2.0-beta.0
    if (values[0] === identifier) {
      if (isNaN(values[1] as number)) {
        values = [identifier, 0];
      }
    } else {
      values = [identifier, 0];
    }
  }
  return values;
}

function parseBuild(
  build: string[],
  metadata: string | undefined,
) {
  return metadata === undefined ? build : metadata.split(".").filter((m) => m);
}

/**
 * Returns the new version resulting from an increment by release type.
 *
 * `premajor`, `preminor` and `prepatch` will bump the version up to the next version,
 * based on the type, and will also add prerelease metadata.
 *
 * If called from a non-prerelease version, the `prerelease` will work the same as
 * `prepatch`. The patch version is incremented and then is made into a prerelease. If
 * the input version is already a prerelease it will simply increment the prerelease
 * metadata.
 *
 * If a prerelease identifier is specified without a number then a number will be added.
 * For example `pre` will result in `pre.0`. If the existing version already has a
 * prerelease with a number and its the same prerelease identifier then the number
 * will be incremented. If the identifier differs from the new identifier then the new
 * identifier is applied and the number is reset to `0`.
 *
 * If the input version has build metadata it will be preserved on the resulting version
 * unless a new build parameter is specified. Specifying `""` will unset existing build
 * metadata.
 * @param version The version to increment
 * @param release The type of increment to perform
 * @param prerelease The pre-release metadata of the new version
 * @param build The build metadata of the new version
 * @returns
 */
export function increment(
  version: SemVer,
  release: ReleaseType,
  prerelease?: string,
  build?: string,
): SemVer;
/** @deprecated (will be removed after 0.200.0) Use `increment(version: SemVer, release: ReleaseType, prerelease?: string, build?: string)` instead. */
export function increment(
  version: string | SemVer,
  release: ReleaseType,
  options?: { includePrerelease: boolean },
  prerelease?: string,
  build?: string,
): string;
export function increment(
  version: string | SemVer,
  release: ReleaseType,
  optionsOrPrerelease?: { includePrerelease: boolean } | string,
  buildOrPrerelease?: string,
  buildOrUndefined?: string,
): string | SemVer {
  let options: { includePrerelease: boolean } = { includePrerelease: true };
  let prerelease: string | undefined;
  let build: string | undefined;
  if (typeof optionsOrPrerelease === "object") {
    options = optionsOrPrerelease;
    prerelease = buildOrPrerelease;
    build = buildOrUndefined;
  } else {
    prerelease = optionsOrPrerelease;
    build = buildOrPrerelease;
  }
  let isLegacy = false;
  if (typeof version === "string") {
    version = parse(version, options);
    isLegacy = true;
  }
  let result: SemVer;
  switch (release) {
    case "premajor":
      result = {
        major: version.major + 1,
        minor: 0,
        patch: 0,
        prerelease: pre(version.prerelease, prerelease),
        build: parseBuild(version.build, build),
      };
      break;
    case "preminor":
      result = {
        major: version.major,
        minor: version.minor + 1,
        patch: 0,
        prerelease: pre(version.prerelease, prerelease),
        build: parseBuild(version.build, build),
      };
      break;
    case "prepatch":
      result = {
        major: version.major,
        minor: version.minor,
        patch: version.patch + 1,
        prerelease: pre(version.prerelease, prerelease),
        build: parseBuild(version.build, build),
      };
      break;
    // If the input is a non-prerelease version, this acts the same as
    // prepatch.
    case "prerelease":
      if (version.prerelease.length === 0) {
        result = {
          major: version.major,
          minor: version.minor,
          patch: version.patch + 1,
          prerelease: pre(version.prerelease, prerelease),
          build: parseBuild(version.build, build),
        };
        break;
      } else {
        result = {
          major: version.major,
          minor: version.minor,
          patch: version.patch,
          prerelease: pre(version.prerelease, prerelease),
          build: parseBuild(version.build, build),
        };
        break;
      }
    case "major":
      // If this is a pre-major version, bump up to the same major version.
      // Otherwise increment major.
      // 1.0.0-5 bumps to 1.0.0
      // 1.1.0 bumps to 2.0.0
      if (
        version.minor !== 0 ||
        version.patch !== 0 ||
        version.prerelease.length === 0
      ) {
        result = {
          major: version.major + 1,
          minor: 0,
          patch: 0,
          prerelease: [],
          build: parseBuild(version.build, build),
        };
        break;
      } else {
        result = {
          major: version.major,
          minor: 0,
          patch: 0,
          prerelease: [],
          build: parseBuild(version.build, build),
        };
        break;
      }
    case "minor":
      // If this is a pre-minor version, bump up to the same minor version.
      // Otherwise increment minor.
      // 1.2.0-5 bumps to 1.2.0
      // 1.2.1 bumps to 1.3.0
      if (
        version.patch !== 0 ||
        version.prerelease.length === 0
      ) {
        result = {
          major: version.major,
          minor: version.minor + 1,
          patch: 0,
          prerelease: [],
          build: parseBuild(version.build, build),
        };
        break;
      } else {
        result = {
          major: version.major,
          minor: version.minor,
          patch: 0,
          prerelease: [],
          build: parseBuild(version.build, build),
        };
        break;
      }
    case "patch":
      // If this is not a pre-release version, it will increment the patch.
      // If it is a pre-release it will bump up to the same patch version.
      // 1.2.0-5 patches to 1.2.0
      // 1.2.0 patches to 1.2.1
      if (version.prerelease.length === 0) {
        result = {
          major: version.major,
          minor: version.minor,
          patch: version.patch + 1,
          prerelease: [],
          build: parseBuild(version.build, build),
        };
        break;
      } else {
        result = {
          major: version.major,
          minor: version.minor,
          patch: version.patch,
          prerelease: [],
          build: parseBuild(version.build, build),
        };
        break;
      }
    // 1.0.0 "pre" would become 1.0.0-0
    // 1.0.0-0 would become 1.0.0-1
    // 1.0.0-beta.0 would be come 1.0.0-beta.1
    // switching the pre identifier resets the number to 0
    case "pre":
      result = {
        major: version.major,
        minor: version.minor,
        patch: version.patch,
        prerelease: pre(version.prerelease, prerelease),
        build: parseBuild(version.build, build),
      };
      break;
    default:
      throw new Error(`invalid increment argument: ${release}`);
  }
  if (isLegacy) {
    return format(result);
  }
  return result;
}

/** Greater than comparison */
export function gt(
  s0: SemVer,
  s1: SemVer,
): boolean;
/**
 * @deprecated (will be removed after 0.200.0) Use `gt(s0: SemVer, s1: SemVer)` instead.
 *
 * Greater than comparison */
export function gt(
  s0: string | SemVer,
  s1: string | SemVer,
  options?: { includePrerelease: boolean },
): boolean;
export function gt(
  s0: string | SemVer,
  s1: string | SemVer,
  options?: { includePrerelease: boolean },
): boolean {
  return compare(s0, s1, options) > 0;
}

/**
 * The minimum semantic version that could match this comparator
 * @param semver The semantic version of the comparator
 * @param operator The operator of the comparator
 * @returns The minimum valid semantic version
 */
export function comparatorMin(semver: SemVer, operator: Operator): SemVer {
  if (semver === ANY) {
    return MIN;
  }

  switch (operator) {
    case ">":
      return semver.prerelease.length > 0
        ? increment(semver, "pre")
        : increment(semver, "patch");
    case "!=":
    case "!==":
    case "<=":
    case "<":
      // The min(<0.0.0) is MAX
      return gt(semver, MIN) ? MIN : MAX;
    case ">=":
    case "":
    case "=":
    case "==":
    case "===":
      return semver;
  }
}

/**
 * The maximum version that could match this comparator.
 *
 * If an invalid comparator is given such as <0.0.0 then
 * an out of range semver will be returned.
 * @returns the version, the MAX version or the next smallest patch version
 */
export function comparatorMax(semver: SemVer, operator: Operator): SemVer {
  if (semver === ANY) {
    return MAX;
  }
  switch (operator) {
    case "!=":
    case "!==":
    case ">":
    case ">=":
      return MAX;
    case "":
    case "=":
    case "==":
    case "===":
    case "<=":
      return semver;
    case "<": {
      const patch = semver.patch - 1;
      const minor = patch >= 0 ? semver.minor : semver.minor - 1;
      const major = minor >= 0 ? semver.major : semver.major - 1;
      // if you try to do <0.0.0 it will Give you -∞.∞.∞
      // which means no SemVer can compare successfully to it.
      if (major < 0) {
        return INVALID;
      } else {
        return {
          major,
          minor: minor >= 0 ? minor : Number.POSITIVE_INFINITY,
          patch: patch >= 0 ? patch : Number.POSITIVE_INFINITY,
          prerelease: [],
          build: [],
        };
      }
    }
  }
}

/** Less than or equal to comparison */
export function lte(
  s0: SemVer,
  s1: SemVer,
): boolean;
/**
 * @deprecated (will be removed after 0.200.0) Use `lte(s0: SemVer, s1: SemVer)` instead.
 *
 * Less than or equal to comparison */
export function lte(
  s0: string | SemVer,
  s1: string | SemVer,
  options?: { includePrerelease: boolean },
): boolean;
export function lte(
  s0: string | SemVer,
  s1: string | SemVer,
  options?: { includePrerelease: boolean },
): boolean {
  return compare(s0, s1, options) <= 0;
}


/**
 * Compare two semantic version objects.
 *
 * Returns `0` if `v1 == v2`, or `1` if `v1` is greater, or `-1` if `v2` is
 * greater.
 *
 * Sorts in ascending order if passed to `Array.sort()`,
 */
export function compare(
  s0: SemVer,
  s1: SemVer,
): 1 | 0 | -1;
/** @deprecated (will be removed after 0.200.0) Use `compare(s0: SemVer, s1: SemVer)` instead. */
export function compare(
  s0: string | SemVer,
  s1: string | SemVer,
  options?: { includePrerelease: boolean },
): 1 | 0 | -1;
export function compare(
  s0: string | SemVer,
  s1: string | SemVer,
  options?: { includePrerelease: boolean },
): 1 | 0 | -1 {
  const v0 = parse(s0, options);
  const v1 = parse(s1, options);
  const includePrerelease = options?.includePrerelease ?? true;
  if (s0 === s1) return 0;
  if (includePrerelease) {
    return (
      compareNumber(v0.major, v1.major) ||
      compareNumber(v0.minor, v1.minor) ||
      compareNumber(v0.patch, v1.patch) ||
      checkIdentifier(v0.prerelease, v1.prerelease) ||
      compareIdentifier(v0.prerelease, v1.prerelease)
    );
  } else {
    return (compareNumber(v0.major, v1.major) ||
      compareNumber(v0.minor, v1.minor) ||
      compareNumber(v0.patch, v1.patch));
  }
}


/** Sorts a list of semantic versions in ascending order. */
export function sort(
  list: SemVer[],
): SemVer[];
/** @deprecated (will be removed after 0.200.0) Use `sort(list: SemVer[])` instead. */
export function sort(
  list: (string | SemVer)[],
  options?: { includePrerelease: boolean },
): (SemVer | string)[];
export function sort(
  list: (string | SemVer)[],
  options?: { includePrerelease: boolean },
): (SemVer | string)[] {
  return list.sort((a, b) => compare(a, b, options));
}

/** Greater than or equal to comparison */
export function gte(
  s0: SemVer,
  s1: SemVer,
): boolean;
/** @deprecated (will be removed after 0.200.0) Use `gte(s0: SemVer, s1: SemVer)` instead.
 *
 * Greater than or equal to comparison */
export function gte(
  s0: string | SemVer,
  s1: string | SemVer,
  options?: { includePrerelease: boolean },
): boolean;
export function gte(
  s0: string | SemVer,
  s1: string | SemVer,
  options?: { includePrerelease: boolean },
): boolean {
  return compare(s0, s1, options) >= 0;
}

/**
 * Parses a comparator string into a valid SemVerComparator.
 * @param comparator
 * @returns A valid SemVerComparator
 */
export function parseComparator(comparator: string): SemVerComparator {
  const r = re[COMPARATOR];
  const m = comparator.match(r);

  if (!m) {
    return NONE;
  }

  const operator = (m[1] ?? "") as Operator;
  const semver = m[2] ? parse(m[2]) : ANY;
  const min = comparatorMin(semver, operator);
  const max = comparatorMax(semver, operator);
  return {
    operator,
    semver,
    min,
    max,
  };
}

/**
 * Test to see if the version satisfies the range.
 * @param version The version to test
 * @param range The range to check
 * @returns true if the version is in the range
 */
export function testRange(version: SemVer, range: SemVerRange): boolean {
  for (const r of range.ranges) {
    if (r.every((c) => gte(version, c.min) && lte(version, c.max))) {
      return true;
    }
  }
  return false;
}



/**
 * Checks to see if value is a valid SemVer object. It does a check
 * into each field including prerelease and build.
 *
 * Some invalid SemVer sentinels can still return true such as ANY and INVALID.
 * An object which has the same value as a sentinel but isn't reference equal
 * will still fail.
 *
 * Objects which are valid SemVer objects but have _extra_ fields are still
 * considered SemVer objects and this will return true.
 *
 * A type assertion is added to the value.
 * @param value The value to check to see if its a valid SemVer object
 * @returns True if value is a valid SemVer otherwise false
 */
export function isSemVer(value: unknown): value is SemVer {
  if (value == null) return false;
  if (Array.isArray(value)) return false;
  if (typeof value !== "object") return false;
  if (value === INVALID) return true;
  if (value === ANY) return true;

  const { major, minor, patch, build, prerelease } = value as Record<
    string,
    unknown
  >;
  const result = typeof major === "number" && isValidNumber(major) &&
    typeof minor === "number" && isValidNumber(minor) &&
    typeof patch === "number" && isValidNumber(patch) &&
    Array.isArray(prerelease) &&
    Array.isArray(build) &&
    prerelease.every((v) => typeof v === "string" || typeof v === "number") &&
    prerelease.filter((v) => typeof v === "string").every((v) =>
      isValidString(v)
    ) &&
    prerelease.filter((v) => typeof v === "number").every((v) =>
      isValidNumber(v)
    ) &&
    build.every((v) => typeof v === "string" && isValidString(v));
  return result;
}

// ~, ~> --> * (any, kinda silly)
// ~2, ~2.x, ~2.x.x, ~>2, ~>2.x ~>2.x.x --> >=2.0.0 <3.0.0
// ~2.0, ~2.0.x, ~>2.0, ~>2.0.x --> >=2.0.0 <2.1.0
// ~1.2, ~1.2.x, ~>1.2, ~>1.2.x --> >=1.2.0 <1.3.0
// ~1.2.3, ~>1.2.3 --> >=1.2.3 <1.3.0
// ~1.2.0, ~>1.2.0 --> >=1.2.0 <1.3.0
function replaceTildes(comp: string): string {
  return comp
    .trim()
    .split(/\s+/)
    .map((comp) => replaceTilde(comp))
    .join(" ");
}

function replaceTilde(comp: string): string {
  const r: RegExp = re[TILDE];
  return comp.replace(
    r,
    (_: string, M: string, m: string, p: string, pr: string) => {
      let ret: string;

      if (isX(M)) {
        ret = "";
      } else if (isX(m)) {
        ret = ">=" + M + ".0.0 <" + (+M + 1) + ".0.0";
      } else if (isX(p)) {
        // ~1.2 == >=1.2.0 <1.3.0
        ret = ">=" + M + "." + m + ".0 <" + M + "." + (+m + 1) + ".0";
      } else if (pr) {
        ret = ">=" +
          M +
          "." +
          m +
          "." +
          p +
          "-" +
          pr +
          " <" +
          M +
          "." +
          (+m + 1) +
          ".0";
      } else {
        // ~1.2.3 == >=1.2.3 <1.3.0
        ret = ">=" + M + "." + m + "." + p + " <" + M + "." + (+m + 1) + ".0";
      }

      return ret;
    },
  );
}

// ^ --> * (any, kinda silly)
// ^2, ^2.x, ^2.x.x --> >=2.0.0 <3.0.0
// ^2.0, ^2.0.x --> >=2.0.0 <3.0.0
// ^1.2, ^1.2.x --> >=1.2.0 <2.0.0
// ^1.2.3 --> >=1.2.3 <2.0.0
// ^1.2.0 --> >=1.2.0 <2.0.0
function replaceCarets(comp: string): string {
  return comp
    .trim()
    .split(/\s+/)
    .map((comp) => replaceCaret(comp))
    .join(" ");
}

function replaceCaret(comp: string): string {
  const r: RegExp = re[CARET];
  return comp.replace(r, (_: string, M, m, p, pr) => {
    let ret: string;

    if (isX(M)) {
      ret = "";
    } else if (isX(m)) {
      ret = ">=" + M + ".0.0 <" + (+M + 1) + ".0.0";
    } else if (isX(p)) {
      if (M === "0") {
        ret = ">=" + M + "." + m + ".0 <" + M + "." + (+m + 1) + ".0";
      } else {
        ret = ">=" + M + "." + m + ".0 <" + (+M + 1) + ".0.0";
      }
    } else if (pr) {
      if (M === "0") {
        if (m === "0") {
          ret = ">=" +
            M +
            "." +
            m +
            "." +
            p +
            "-" +
            pr +
            " <" +
            M +
            "." +
            m +
            "." +
            (+p + 1);
        } else {
          ret = ">=" +
            M +
            "." +
            m +
            "." +
            p +
            "-" +
            pr +
            " <" +
            M +
            "." +
            (+m + 1) +
            ".0";
        }
      } else {
        ret = ">=" + M + "." + m + "." + p + "-" + pr + " <" + (+M + 1) +
          ".0.0";
      }
    } else {
      if (M === "0") {
        if (m === "0") {
          ret = ">=" + M + "." + m + "." + p + " <" + M + "." + m + "." +
            (+p + 1);
        } else {
          ret = ">=" + M + "." + m + "." + p + " <" + M + "." + (+m + 1) + ".0";
        }
      } else {
        ret = ">=" + M + "." + m + "." + p + " <" + (+M + 1) + ".0.0";
      }
    }

    return ret;
  });
}

function replaceXRanges(comp: string): string {
  return comp
    .split(/\s+/)
    .map((comp) => replaceXRange(comp))
    .join(" ");
}

function replaceXRange(comp: string): string {
  comp = comp.trim();
  const r: RegExp = re[XRANGE];
  return comp.replace(r, (ret: string, gtlt, M, m, p, _pr) => {
    const xM: boolean = isX(M);
    const xm: boolean = xM || isX(m);
    const xp: boolean = xm || isX(p);
    const anyX: boolean = xp;

    if (gtlt === "=" && anyX) {
      gtlt = "";
    }

    if (xM) {
      if (gtlt === ">" || gtlt === "<") {
        // nothing is allowed
        ret = "<0.0.0";
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
        // >1.2.3 => >= 1.2.4
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

      ret = gtlt + M + "." + m + "." + p;
    } else if (xm) {
      ret = ">=" + M + ".0.0 <" + (+M + 1) + ".0.0";
    } else if (xp) {
      ret = ">=" + M + "." + m + ".0 <" + M + "." + (+m + 1) + ".0";
    }

    return ret;
  });
}

// Because * is AND-ed with everything else in the comparator,
// and '' means "any version", just remove the *s entirely.
function replaceStars(comp: string): string {
  return comp.trim().replace(re[STAR], "");
}

// This function is passed to string.replace(re[HYPHENRANGE])
// M, m, patch, prerelease, build
// 1.2 - 3.4.5 -> >=1.2.0 <=3.4.5
// 1.2.3 - 3.4 -> >=1.2.0 <3.5.0 Any 3.4.x will do
// 1.2 - 3.4 -> >=1.2.0 <3.5.0
function hyphenReplace(
  _$0: string,
  from: string,
  fM: string,
  fm: string,
  fp: string,
  _fpr: string,
  _fb: string,
  to: string,
  tM: string,
  tm: string,
  tp: string,
  tpr: string,
  _tb: string,
) {
  if (isX(fM)) {
    from = "";
  } else if (isX(fm)) {
    from = ">=" + fM + ".0.0";
  } else if (isX(fp)) {
    from = ">=" + fM + "." + fm + ".0";
  } else {
    from = ">=" + from;
  }

  if (isX(tM)) {
    to = "";
  } else if (isX(tm)) {
    to = "<" + (+tM + 1) + ".0.0";
  } else if (isX(tp)) {
    to = "<" + tM + "." + (+tm + 1) + ".0";
  } else if (tpr) {
    to = "<=" + tM + "." + tm + "." + tp + "-" + tpr;
  } else {
    to = "<=" + to;
  }

  return (from + " " + to).trim();
}

function isX(id: string): boolean {
  return !id || id.toLowerCase() === "x" || id === "*";
}

/**
 * Parses a range string into a SemVerRange object or throws a TypeError.
 * @param range The range string
 * @returns A valid semantic version range
 */
export function parseRange(range: string): SemVerRange {
  // handle spaces around and between comparator and version
  range = range.trim().replaceAll(/(?<=<|>|=) /g, "");

  if (range === "") {
    return { ranges: [[ALL]] };
  }

  // Split into groups of comparators, these are considered OR'd together.
  const ranges = range
    .trim()
    .split(/\s*\|\|\s*/)
    .map((range) => {
      // convert `1.2.3 - 1.2.4` into `>=1.2.3 <=1.2.4`
      const hr: RegExp = re[HYPHENRANGE];
      range = range.replace(hr, hyphenReplace);
      range = replaceCarets(range);
      range = replaceTildes(range);
      range = replaceXRanges(range);
      range = replaceStars(range);

      // At this point, the range is completely trimmed and
      // ready to be split into comparators.
      // These are considered AND's
      if (range === "") {
        return [ALL];
      } else {
        return range
          .split(" ")
          .filter((r) => r)
          .map((r) => parseComparator(r));
      }
    });

  return { ranges };
}



export function compareNumber(
  a: number,
  b: number,
): 1 | 0 | -1 {
  if (isNaN(a) || isNaN(b)) {
    throw new Error("Comparison against non-numbers");
  }
  return a === b ? 0 : a < b ? -1 : 1;
}

export function checkIdentifier(
  v1: ReadonlyArray<string | number>,
  v2: ReadonlyArray<string | number>,
): 1 | 0 | -1 {
  // NOT having a prerelease is > having one
  // But NOT having a build is < having one
  if (v1.length && !v2.length) {
    return -1;
  } else if (!v1.length && v2.length) {
    return 1;
  } else {
    return 0;
  }
}

export function compareIdentifier(
  v1: ReadonlyArray<string | number>,
  v2: ReadonlyArray<string | number>,
): 1 | 0 | -1 {
  let i = 0;
  do {
    const a = v1[i];
    const b = v2[i];
    if (a === undefined && b === undefined) {
      // same length is equal
      return 0;
    } else if (b === undefined) {
      // longer > shorter
      return 1;
    } else if (a === undefined) {
      // shorter < longer
      return -1;
    } else if (typeof a === "string" && typeof b === "number") {
      // string > number
      return 1;
    } else if (typeof a === "number" && typeof b === "string") {
      // number < string
      return -1;
    } else if (a < b) {
      return -1;
    } else if (a > b) {
      return 1;
    } else {
      // If they're equal, continue comparing segments.
      continue;
    }
  } while (++i);

  // It can't ever reach here, but typescript doesn't realize that so
  // add this line so the return type is inferred correctly.
  return 0;
}
/**
 * Returns true if the value is a valid SemVer number.
 *
 * Must be a number. Must not be NaN. Can be positive or negative infinity.
 * Can be between 0 and MAX_SAFE_INTEGER.
 * @param value The value to check
 * @returns True if its a valid semver number
 */
export function isValidNumber(value: unknown): value is number {
  return (
    typeof value === "number" &&
    !Number.isNaN(value) && (
      !Number.isFinite(value) ||
      (0 <= value && value <= Number.MAX_SAFE_INTEGER)
    )
  );
}

export const MAX_LENGTH = 256;

/**
 * Returns true if the value is a valid semver pre-release or build identifier.
 *
 * Must be a string. Must be between 1 and 256 characters long. Must match
 * the regular expression /[0-9A-Za-z-]+/.
 * @param value The value to check
 * @returns True if the value is a valid semver string.
 */
export function isValidString(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length > 0 &&
    value.length <= MAX_LENGTH &&
    !!value.match(/[0-9A-Za-z-]+/)
  );
}

/**
 * Checks to see if the value is a valid Operator string.
 *
 * Adds a type assertion if true.
 * @param value The value to check
 * @returns True if the value is a valid Operator string otherwise false.
 */
export function isValidOperator(value: unknown): value is Operator {
  if (typeof value !== "string") return false;
  switch (value) {
    case "":
    case "=":
    case "==":
    case "===":
    case "!==":
    case "!=":
    case ">":
    case ">=":
    case "<":
    case "<=":
      return true;
    default:
      return false;
  }
}

export {
  CARET,
  COMPARATOR,
  FULL,
  HYPHENRANGE,
  NUMERICIDENTIFIER, STAR,
  TILDE,
  XRANGE, re,
  src
};

/**
 * The possible release types are used as an operator for the
 * increment function and as a result of the difference function.
 */
export type ReleaseType =
  | "pre"
  | "major"
  | "premajor"
  | "minor"
  | "preminor"
  | "patch"
  | "prepatch"
  | "prerelease";

/**
 * SemVer comparison operators.
 */
export type Operator =
  | ""
  | "="
  | "=="
  | "==="
  | "!=="
  | "!="
  | ">"
  | ">="
  | "<"
  | "<=";

/**
 * The style to use when formatting a SemVer object into a string
 */
export type FormatStyle =
  | "full"
  | "release"
  | "primary"
  | "build"
  | "pre"
  | "patch"
  | "minor"
  | "major";

/**
 * The shape of a valid semantic version comparator
 * @example >=0.0.0
 */
export interface SemVerComparator {
  operator: Operator;
  semver: SemVer;
  min: SemVer;
  max: SemVer;
}

/**
 * A SemVer object parsed into its constituent parts.
 */
export interface SemVer {
  major: number;
  minor: number;
  patch: number;
  prerelease: (string | number)[];
  build: string[];
}

type SemVerRangeAnd = SemVerComparator[];
type SemVerRangeOr = SemVerRangeAnd[];

/**
 * A type representing a semantic version range. The ranges consist of
 * a nested array, which represents a set of OR comparisons while the
 * inner array represents AND comparisons.
 */
export interface SemVerRange {
  // The outer array is OR while each inner array is AND
  ranges: SemVerRangeOr;
}

/**
 * Attempt to parse a string as a semantic version, returning either a `SemVer`
 * object or throws a TypeError.
 * @param version The version string to parse
 * @returns A valid SemVer
 */
export function parse(version: string | SemVer): SemVer;
/** @deprecated (will be removed after 0.200.0) Use parse(version: string | SemVer) instead. */
export function parse(
  version: string | SemVer | null,
  options?: { includePrerelease: boolean },
): SemVer;
/**
 * Attempt to parse a string as a semantic version, returning either a `SemVer`
 * object or throws a TypeError.
 * @param version The version string to parse
 * @returns A valid SemVer
 */
export function parse(
  version: string | SemVer | null,
  options?: { includePrerelease: boolean },
): SemVer {
  const includePrerelease = options?.includePrerelease ?? true;
  if (typeof version === "object") {
    if (isSemVer(version)) {
      return version;
    } else {
      throw new TypeError(`not a valid SemVer object`);
    }
  }
  if (typeof version !== "string") {
    throw new TypeError(
      `version must be a string`,
    );
  }

  if (version.length > MAX_LENGTH) {
    throw new TypeError(
      `version is longer than ${MAX_LENGTH} characters`,
    );
  }

  version = version.trim();

  const r = re[FULL];
  const m = version.match(r);
  if (!m) {
    throw new TypeError(`Invalid Version: ${version}`);
  }

  // these are actually numbers
  const major = parseInt(m[1]);
  const minor = parseInt(m[2]);
  const patch = parseInt(m[3]);

  if (major > Number.MAX_SAFE_INTEGER || major < 0) {
    throw new TypeError("Invalid major version");
  }

  if (minor > Number.MAX_SAFE_INTEGER || minor < 0) {
    throw new TypeError("Invalid minor version");
  }

  if (patch > Number.MAX_SAFE_INTEGER || patch < 0) {
    throw new TypeError("Invalid patch version");
  }

  // number-ify any prerelease numeric ids
  const numericIdentifier = new RegExp(`^${src[NUMERICIDENTIFIER]}$`);
  const prerelease = (m[4] ?? "")
    .split(".")
    .filter((id) => id)
    .map((id: string) => {
      const num = parseInt(id);
      if (id.match(numericIdentifier) && isValidNumber(num)) {
        return num;
      } else {
        return id;
      }
    });

  const build = m[5]?.split(".")?.filter((m) => m) ?? [];
  if (includePrerelease) {
    return {
      major,
      minor,
      patch,
      prerelease,
      build,
    };
  } else {
    return {
      major,
      minor,
      patch,
      prerelease: [],
      build: [],
    };
  }
}

/**
 * Returns the highest version in the list that satisfies the range, or `undefined`
 * if none of them do.
 * @param versions The versions to check.
 * @param range The range of possible versions to compare to.
 * @returns The highest version in versions that satisfies the range.
 */
export function maxSatisfying(
  versions: SemVer[],
  range: SemVerRange,
): SemVer | undefined;
/**
 * @deprecated (will be removed after 0.200.0) Use `maxSatisfying(versions: SemVer[], range: SemVerRange)` instead.
 */
export function maxSatisfying<T extends string | SemVer>(
  versions: readonly T[],
  range: string | SemVerRange,
  options?: { includePrerelease: boolean },
): T | undefined;
export function maxSatisfying(
  versions: readonly SemVer[],
  range: string | SemVerRange,
  options?: { includePrerelease: boolean },
): SemVer | undefined {
  const r = typeof range === "string" ? parseRange(range) : range;
  const satisfying = versions.filter((v) =>
    testRange(typeof v === "string" ? parse(v, options) : v, r)
  );
  const sorted = sort(satisfying);
  return sorted.pop();
}

