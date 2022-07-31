import { getRequest } from "./fetch-and-cache";
import { parsePackageName } from "./parse-package-name";
import { maxSatisfying } from "./semver";

/**
 * Returns registry url for packages which have an input string
 * 
 * @param input package to generate npm registry url for; it supports adding package versions "@okikio/animate@1.0"
 * @returns the proper npm registry url with package input package versions etc...
 */
export const getRegistryURL = (input: string) => {
  const host = "https://registry.npmjs.com";

  let { name, version, path } = parsePackageName(input);
  let searchURL = `${host}/-/v1/search?text=${encodeURIComponent(name)}&popularity=0.5&size=30`;
  let packageVersionURL = `${host}/${name}/${version}`;
  let packageURL = `${host}/${name}`;

  return { searchURL, packageURL, packageVersionURL, version, name, path };
};

/**
 * Searches the npm registry for packages with matching names
 * 
 * @param input package name to search for; it supports adding package versions "@okikio/animate@1.0", but will ignore them
 * @returns resulting package info.
 */
export const getPackages = async (input: string) => {
  let { searchURL } = getRegistryURL(input);
  let result: any;

  try {
    let response = await getRequest(searchURL, false);
    result = await response.json();
  } catch (e) {
    console.warn(e);
    throw e;
  }

  let packages = result?.objects;
  return { packages, info: result };
}

/**
 * Searches the npm registry for a package with the same name
 * 
 * @param input package name to search for; it supports adding package versions "@okikio/animate@1.0", but will ignore them
 * @returns resulting package info.
 */
export const getPackage = async (input: string) => {
  let { packageURL } = getRegistryURL(input);

  try {
    let response = await getRequest(packageURL, false);
    return await response.json();
  } catch (e) {
    console.warn(e);
    throw e;
  }
}

/**
 * Searches the npm registry for a package an lists out all it versions with an object of available { versions, tags }.
 * 
 * @param input package name to search for; it supports adding package versions "@okikio/animate@1.0", but will ignore them
 * @returns resulting package info.
 */
export const getPackageVersions = async (input: string) => {
  try {
    let pkg = await getPackage(input);
    let versions = Object.keys(pkg.versions);
    let tags = pkg['dist-tags'];
    return { versions, tags };
  } catch (e) {
    console.warn(e);
    throw e;
  }
}

/**
 * Searches the npm registry for a package with matching names
 * 
 * @param input package name to search for; it supports adding package versions "@okikio/animate@1.0", and will use that to resolve the package version
 * @returns resulting package info.
 */
export const resolveVersion = async (input: string) => {
  try {
    let { version: range } = getRegistryURL(input);
    let versionsAndTags = await getPackageVersions(input);
    if (versionsAndTags) {
      const { versions, tags } = versionsAndTags;

      if (range in tags) {
        range = tags[range];
      }

      return versions.includes(range)
        ? range
        : maxSatisfying(versions, range) as string;
    }
  } catch (e) {
    console.warn(e);
    throw e;
  }
}
/**
 * Searches the npm registry for a package with the same name, it then resolves the package version making sure it's valid, and give the appropriate package that matches the version set
 * 
 * @param input package name to search for; it supports adding package versions "@okikio/animate@1.0", and will use that to resolve the package version
 * @returns resulting package info.
 */
export const getResolvedPackage = async (input: string) => {
  try {
    let { name } = getRegistryURL(input);
    let version = await resolveVersion(input); 
    return await getPackage(`${name}@${version}`);
  } catch (e) {
    console.warn(e);
    throw e;
  }
}