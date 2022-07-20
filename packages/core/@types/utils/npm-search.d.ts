/**
 * Returns registry url for packages which have an input string
 *
 * @param input package to generate npm registry url for; it supports adding package versions "@okikio/animate@1.0"
 * @returns the proper npm registry url with package input package versions etc...
 */
export declare const getRegistryURL: (input: string) => {
    searchURL: string;
    packageURL: string;
    packageVersionURL: string;
    version: string;
    name: string;
    path: string;
};
/**
 * Searches the npm registry for packages with matching names
 *
 * @param input package name to search for; it supports adding package versions "@okikio/animate@1.0", but will ignore them
 * @returns resulting package info.
 */
export declare const getPackages: (input: string) => Promise<{
    packages: any;
    info: any;
}>;
/**
 * Searches the npm registry for a package with the same name
 *
 * @param input package name to search for; it supports adding package versions "@okikio/animate@1.0", but will ignore them
 * @returns resulting package info.
 */
export declare const getPackage: (input: string) => Promise<any>;
/**
 * Searches the npm registry for a package an lists out all it versions with an object of available { versions, tags }.
 *
 * @param input package name to search for; it supports adding package versions "@okikio/animate@1.0", but will ignore them
 * @returns resulting package info.
 */
export declare const getPackageVersions: (input: string) => Promise<{
    versions: string[];
    tags: any;
}>;
/**
 * Searches the npm registry for a package with matching names
 *
 * @param input package name to search for; it supports adding package versions "@okikio/animate@1.0", and will use that to resolve the package version
 * @returns resulting package info.
 */
export declare const resolveVersion: (input: string) => Promise<string>;
/**
 * Searches the npm registry for a package with the same name, it then resolves the package version making sure it's valid, and give the appropriate package that matches the version set
 *
 * @param input package name to search for; it supports adding package versions "@okikio/animate@1.0", and will use that to resolve the package version
 * @returns resulting package info.
 */
export declare const getResolvedPackage: (input: string) => Promise<any>;
