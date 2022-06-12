import { parse as parsePackageName } from "parse-package-name";
import { getRequest } from "./fetch-and-cache.js";
/**
 * Returns registry url for packages which have the input string
 *
 * @param input package to generate npm registry url for
 * @returns the proper npm registry url with package input package versions etc...
 */
export const getRegistryURL = (input) => {
    const host = "https://registry.npmjs.com";
    const { name, version, path } = parsePackageName(input);
    const searchURL = `${host}/-/v1/search?text=${encodeURIComponent(name)}&popularity=0.5&size=30`;
    const packageURL = `${host}/${name}/${version}`;
    return { searchURL, packageURL, version, name, path };
};
/**
 * Searches the npm registry for packages with matching names
 *
 * @param input package name to search for
 * @returns resulting package info.
 */
export const getPackages = async (input) => {
    const { searchURL } = getRegistryURL(input);
    let result;
    try {
        const response = await getRequest(searchURL, false);
        result = await response.json();
    }
    catch (e) {
        console.warn(e);
        throw e;
    }
    const packages = result?.objects;
    return { packages, info: result };
};
/**
 * Searches the npm registry for packages with matching names
 *
 * @param input package name to search for
 * @returns resulting package info.
 */
export const getPackage = async (input) => {
    const { packageURL } = getRegistryURL(input);
    let result;
    try {
        const response = await getRequest(packageURL, false);
        result = await response.json();
    }
    catch (e) {
        console.warn(e);
        throw e;
    }
    return result;
};
