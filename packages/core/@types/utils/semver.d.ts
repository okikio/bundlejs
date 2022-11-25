/**
 * Based on `semver` (https://npmjs.com/semver) by @npm (https://github.com/npm) a stripped down version that only allows for selecting the max satisfying version of a range of versions.
 */
export declare const SEMVER_SPEC_VERSION = "2.0.0";
export declare const MAX_LENGTH = 256;
export declare const MAX_SAFE_INTEGER: number;
export declare const MAX_SAFE_COMPONENT_LENGTH = 16;
export declare let R: number;
export declare const createToken: (pattern: string, isGlobal?: any) => {
    index: number;
    pattern: string;
    regex: RegExp;
};
export declare const tokens: {
    NUMERICIDENTIFIER: {
        index: number;
        pattern: string;
        regex: RegExp;
    };
    NUMERICIDENTIFIERLOOSE: {
        index: number;
        pattern: string;
        regex: RegExp;
    };
    NONNUMERICIDENTIFIER: {
        index: number;
        pattern: string;
        regex: RegExp;
    };
    MAINVERSION: {
        index: number;
        pattern: string;
        regex: RegExp;
    };
    MAINVERSIONLOOSE: {
        index: number;
        pattern: string;
        regex: RegExp;
    };
    PRERELEASEIDENTIFIER: {
        index: number;
        pattern: string;
        regex: RegExp;
    };
    PRERELEASEIDENTIFIERLOOSE: {
        index: number;
        pattern: string;
        regex: RegExp;
    };
    PRERELEASE: {
        index: number;
        pattern: string;
        regex: RegExp;
    };
    PRERELEASELOOSE: {
        index: number;
        pattern: string;
        regex: RegExp;
    };
    BUILDIDENTIFIER: {
        index: number;
        pattern: string;
        regex: RegExp;
    };
    BUILD: {
        index: number;
        pattern: string;
        regex: RegExp;
    };
    FULLPLAIN: {
        index: number;
        pattern: string;
        regex: RegExp;
    };
    FULL: {
        index: number;
        pattern: string;
        regex: RegExp;
    };
    LOOSEPLAIN: {
        index: number;
        pattern: string;
        regex: RegExp;
    };
    LOOSE: {
        index: number;
        pattern: string;
        regex: RegExp;
    };
    GTLT: {
        index: number;
        pattern: string;
        regex: RegExp;
    };
    XRANGEIDENTIFIERLOOSE: {
        index: number;
        pattern: string;
        regex: RegExp;
    };
    XRANGEIDENTIFIER: {
        index: number;
        pattern: string;
        regex: RegExp;
    };
    XRANGEPLAIN: {
        index: number;
        pattern: string;
        regex: RegExp;
    };
    XRANGEPLAINLOOSE: {
        index: number;
        pattern: string;
        regex: RegExp;
    };
    XRANGE: {
        index: number;
        pattern: string;
        regex: RegExp;
    };
    XRANGELOOSE: {
        index: number;
        pattern: string;
        regex: RegExp;
    };
    COERCE: {
        index: number;
        pattern: string;
        regex: RegExp;
    };
    COERCERTL: {
        index: number;
        pattern: string;
        regex: RegExp;
    };
    LONETILDE: {
        index: number;
        pattern: string;
        regex: RegExp;
    };
    TILDETRIM: {
        index: number;
        pattern: string;
        regex: RegExp;
    };
    TILDE: {
        index: number;
        pattern: string;
        regex: RegExp;
    };
    TILDELOOSE: {
        index: number;
        pattern: string;
        regex: RegExp;
    };
    LONECARET: {
        index: number;
        pattern: string;
        regex: RegExp;
    };
    CARETTRIM: {
        index: number;
        pattern: string;
        regex: RegExp;
    };
    CARET: {
        index: number;
        pattern: string;
        regex: RegExp;
    };
    CARETLOOSE: {
        index: number;
        pattern: string;
        regex: RegExp;
    };
    COMPARATORLOOSE: {
        index: number;
        pattern: string;
        regex: RegExp;
    };
    COMPARATOR: {
        index: number;
        pattern: string;
        regex: RegExp;
    };
    COMPARATORTRIM: {
        index: number;
        pattern: string;
        regex: RegExp;
    };
    HYPHENRANGE: {
        index: number;
        pattern: string;
        regex: RegExp;
    };
    HYPHENRANGELOOSE: {
        index: number;
        pattern: string;
        regex: RegExp;
    };
    STAR: {
        index: number;
        pattern: string;
        regex: RegExp;
    };
    GTE0: {
        index: number;
        pattern: string;
        regex: RegExp;
    };
    GTE0PRE: {
        index: number;
        pattern: string;
        regex: RegExp;
    };
};
export declare const parseOptions: (options: any) => {
    loose?: undefined;
} | {
    loose: boolean;
};
export declare const numeric: RegExp;
/**
 * Compares two identifiers, must be numeric strings or truthy/falsy values.
 *
 * Sorts in ascending order when passed to `Array.sort()`.
 */
export declare const compareIdentifiers: (a: string | number, b: string | number) => 1 | 0 | -1;
export interface Options {
    loose?: boolean | undefined;
    includePrerelease?: boolean | undefined;
}
export declare class SemVer {
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
    constructor(version: string | SemVer, options?: boolean | Options);
    format(): string;
    toString(): string;
    /**
     * Compares two versions excluding build identifiers (the bit after `+` in the semantic version string).
     *
     * @return
     * - `0` if `this` == `other`
     * - `1` if `this` is greater
     * - `-1` if `other` is greater.
     */
    compare(other: string | SemVer): 1 | 0 | -1;
    /**
     * Compares the release portion of two versions.
     *
     * @return
     * - `0` if `this` == `other`
     * - `1` if `this` is greater
     * - `-1` if `other` is greater.
     */
    compareMain(other: string | SemVer): 1 | 0 | -1;
    /**
     * Compares the prerelease portion of two versions.
     *
     * @return
     * - `0` if `this` == `other`
     * - `1` if `this` is greater
     * - `-1` if `other` is greater.
     */
    comparePre(other: string | SemVer): 1 | 0 | -1;
}
export declare const ANY: unique symbol;
export type ComparatorOperator = "" | "=" | "<" | ">" | "<=" | ">=";
export declare class Comparator {
    semver: SemVer | typeof ANY;
    operator: ComparatorOperator;
    value: string;
    loose: boolean;
    options: Options;
    constructor(comp: string | Comparator, optionsOrLoose?: boolean | Options);
    parse(comp: string): void;
    toString(): string;
}
export declare const caretTrimReplace = "$1^";
export declare const tildeTrimReplace = "$1~";
export declare const comparatorTrimReplace = "$1$2$3";
export declare const isNullSet: (c: any) => boolean;
export declare const isAny: (c: any) => boolean;
export declare const parseComparator: (comp: any, options: any) => any;
export declare const isX: (id: any) => boolean;
export declare const replaceTildes: (comp: any, options: any) => any;
export declare const replaceTilde: (comp: any, options: any) => any;
export declare const replaceCarets: (comp: any, options: any) => any;
export declare const replaceCaret: (comp: any, options: any) => any;
export declare const replaceXRanges: (comp: any, options: any) => any;
export declare const replaceXRange: (comp: any, options: any) => any;
export declare const replaceStars: (comp: any, options: any) => any;
export declare const replaceGTE0: (comp: any, options: any) => any;
export declare const hyphenReplace: (incPr: any) => ($0: any, from: any, fM: any, fm: any, fp: any, fpr: any, fb: any, to: any, tM: any, tm: any, tp: any, tpr: any, tb: any) => string;
export declare const testSet: (set: any, version: any, options: any) => boolean;
export declare class Range {
    range: string;
    raw: string;
    loose: boolean;
    options: Options;
    includePrerelease: boolean;
    set: ReadonlyArray<ReadonlyArray<Comparator>>;
    constructor(range: string | Range, optionsOrLoose?: boolean | Options);
    format(): string;
    toString(): string;
    parseRange(range: string): ReadonlyArray<Comparator>;
    test(version: string | SemVer): boolean;
}
/**
 * Return the highest version in the list that satisfies the range, or null if none of them do.
 */
export declare function maxSatisfying<T extends string | SemVer>(versions: ReadonlyArray<T>, range: string | Range, optionsOrLoose?: boolean | Options): T | null;
export default maxSatisfying;
