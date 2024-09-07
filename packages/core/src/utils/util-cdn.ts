/**
 * The default CDN host
 */
export const DEFAULT_CDN_HOST = "https://unpkg.com";

/**
 * Returns the CDN style supported by certain CDN's
 * e.g. 
 * - `npm` - unpkg, skypack, esm.sh, and jsdelivr all support `npm` style imports for example they support adding versions to their URLs like this `https://unpkg.com/@okikio/animate@beta`
 * - `github` - github, and jsdelivr.gh both support `github` style imports, as in they don't support adding versions to their URLs like this `https://cdn.jsdelivr.net/gh/jquery/jquery/dist/jquery.min.js`
 * - `deno` - deno supports `deno` style imports, as in they don't support adding versions to their URLs like this `https://deno.land/x/brotli/mod.ts`
 * - `other` - CDNs that haven't been added to the list
 */
export const getCDNStyle = (urlStr: string) => {
  // esm|esm\.sh|
  // (cdn\.)?esm\.sh|
  // skypack|
  // cdn\.skypack\.dev|
  if (
    /^(unpkg|jsdelivr|esm\.run)\:?/.test(urlStr) ||
    /^(https?:\/\/)?(cdn\.jsdelivr\.net\/npm|unpkg\.com)/.test(urlStr)
  ) return "npm";

  else if (
    /^(jsdelivr\.gh|github)\:?/.test(urlStr) ||
    /^https?:\/\/(cdn\.jsdelivr\.net\/gh|raw\.githubusercontent\.com)/.test(urlStr)
  ) return "github";

  else if (
    /^(deno)\:?/.test(urlStr) ||
    /^https?:\/\/(deno\.land\/x)/.test(urlStr)
  ) return "deno";

  return "other";
};

/**
 * Based on the URL scheme of the import, this method will return an actual CDN host origin to use,
 * e.g. 
 * ```ts
 * getCDNHost("react") //= https://unpkg.com
 * getCDNHost("react", "https://cdn.skypack.dev") //= https://cdn.skypack.dev/
 * 
 * // CDN URL Schemes take precedence above everything
 * getCDNHost("esm:react", "https://cdn.skypack.dev") //= https://cdn.esm.sh/
 * ```
 * 
 * > _**Note**: The returned CDN URL string will end with a '/' e.g. `https://cdn.esm.sh/`_
 * 
 * @param importStr imports to find a CDN for
 * @param cdn The default CDN host to use. This can change based on the config of the user. This may be diregarded if the `importStr` has a CDN URL Scheme
 * @returns CDN URL host string
 */
export const getCDNOrigin = (importStr: string, cdn = DEFAULT_CDN_HOST) => {
  // `skypack:` --> `https://cdn.skypack.dev`
  if (/^skypack\:/.test(importStr))
    cdn = "https://cdn.skypack.dev";

  // `jsr:` --> `https://esm.sh`
  else if (/^(jsr)\:/.test(importStr))
    cdn = `https://esm.sh/jsr`;

  // `esm.sh:` or `esm:` --> `https://esm.sh`
  else if (/^(esm\.sh|esm)\:/.test(importStr))
    cdn = "https://esm.sh";

  // `unpkg:` --> `https://unpkg.com`
  else if (/^unpkg\:/.test(importStr))
    cdn = "https://unpkg.com";

  // (NPM) `jsdelivr:` or `esm.run:` --> `https://cdn.jsdelivr.net/npm`
  else if (/^(jsdelivr|esm\.run)\:/.test(importStr))
    cdn = "https://cdn.jsdelivr.net/npm";

  // (GitHub) `jsdelivr.gh:` --> `https://cdn.jsdelivr.net/gh`
  else if (/^(jsdelivr\.gh)\:/.test(importStr))
    cdn = "https://cdn.jsdelivr.net/gh";

  // `deno:` --> `https://deno.land/x`
  else if (/^(deno)\:/.test(importStr))
    cdn = "https://deno.land/x";

  // `github:` --> `https://raw.githubusercontent.com`
  else if (/^(github)\:/.test(importStr))
    cdn = "https://raw.githubusercontent.com";

  return /\/$/.test(cdn) ? cdn : `${cdn}/`;
};

/**
 * Remove CDN URL Schemes like `deno:...`, `unpkg:...`, etc... and known CDN hosts, e.g. `https://raw.githubusercontent.com/...`, `https://cdn.skypack.dev/...`, etc...  Leaving only the import path
 */
export const getPureImportPath = (importStr: string) =>
  importStr
    .replace(/^(skypack|esm|esm\.sh|unpkg|jsdelivr|jsdelivr\.gh|esm\.run|deno|github|jsr)\:/, "")
    .replace(/^(https?:\/\/)?(cdn\.skypack\.dev|(cdn\.)?esm\.sh|(cdn\.)?esm\.sh\/jsr|cdn\.jsdelivr\.net\/npm|unpkg\.com|cdn\.jsdelivr\.net\/gh|raw\.githubusercontent\.com|deno\.land\/x)/, "")
    .replace(/^\//, "");

/**
 * Generates a CDN URL for an import, taking advantage of CDN URL Schemes in imports and the default CDN hosts parameter to decide the CDN host
 * Read through {@link getCDNOrigin} and {@link getPureImportPath}
 */
export const getCDNUrl = (importStr: string, cdn = DEFAULT_CDN_HOST) => {
  const origin = getCDNOrigin(importStr, cdn);
  const path = getPureImportPath(importStr);
  const url = new URL(path, origin);
  return { import: importStr, path, origin, cdn, url };
};

