"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPackage = exports.getPackages = exports.getRegistryURL = void 0;
const parse_package_name_1 = require("parse-package-name");
const fetch_and_cache_js_1 = require("./fetch-and-cache.js");
/**
 * Returns registry url for packages which have the input string
 *
 * @param input package to generate npm registry url for
 * @returns the proper npm registry url with package input package versions etc...
 */
const getRegistryURL = (input) => {
    const host = "https://registry.npmjs.com";
    const { name, version, path } = (0, parse_package_name_1.parse)(input);
    const searchURL = `${host}/-/v1/search?text=${encodeURIComponent(name)}&popularity=0.5&size=30`;
    const packageURL = `${host}/${name}/${version}`;
    return { searchURL, packageURL, version, name, path };
};
exports.getRegistryURL = getRegistryURL;
/**
 * Searches the npm registry for packages with matching names
 *
 * @param input package name to search for
 * @returns resulting package info.
 */
const getPackages = async (input) => {
    const { searchURL } = (0, exports.getRegistryURL)(input);
    let result;
    try {
        const response = await (0, fetch_and_cache_js_1.getRequest)(searchURL, false);
        result = await response.json();
    }
    catch (e) {
        console.warn(e);
        throw e;
    }
    const packages = result?.objects;
    return { packages, info: result };
};
exports.getPackages = getPackages;
/**
 * Searches the npm registry for packages with matching names
 *
 * @param input package name to search for
 * @returns resulting package info.
 */
const getPackage = async (input) => {
    const { packageURL } = (0, exports.getRegistryURL)(input);
    let result;
    try {
        const response = await (0, fetch_and_cache_js_1.getRequest)(packageURL, false);
        result = await response.json();
    }
    catch (e) {
        console.warn(e);
        throw e;
    }
    return result;
};
exports.getPackage = getPackage;
