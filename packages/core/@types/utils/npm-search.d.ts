/**
 * Returns registry url for packages which have the input string
 *
 * @param input package to generate npm registry url for
 * @returns the proper npm registry url with package input package versions etc...
 */
export declare const getRegistryURL: (input: string) => {
    searchURL: string;
    packageURL: string;
    version: string;
    name: string;
    path: string;
};
/**
 * Searches the npm registry for packages with matching names
 *
 * @param input package name to search for
 * @returns resulting package info.
 */
export declare const getPackages: (input: string) => Promise<{
    packages: any;
    info: any;
}>;
/**
 * Searches the npm registry for packages with matching names
 *
 * @param input package name to search for
 * @returns resulting package info.
 */
export declare const getPackage: (input: string) => Promise<any>;
