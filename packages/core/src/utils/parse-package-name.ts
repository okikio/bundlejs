/** 
 * Based on `parse-package-name` (https://npmjs.com/parse-package-name) by @egoist (https://github.com/egoist) 
 */

/** Parsed a scoped package name into name, version, and path. */
export const RE_SCOPED = /^(@[^\/]+\/[^@\/]+)(?:@([^\/]+))?(\/.*)?$/;

/** Parsed a non-scoped package name into name, version, path */
export const RE_NON_SCOPED = /^([^@\/]+)(?:@([^\/]+))?(\/.*)?$/;

export function parsePackageName(input: string, ignoreError = false) {
  const m = RE_SCOPED.exec(input) || RE_NON_SCOPED.exec(input);

  if (!m && !ignoreError) {
    throw new Error(`[parse-package-name] invalid package name: ${input}`);
  }
  
  return {
    name: m?.[1] || "",
    version: m?.[2] || "latest",
    path: m?.[3] || "",
  };
}

export default parsePackageName;