/**
 * The default CDN host
 */
export declare const DEFAULT_CDN_HOST = "https://unpkg.com";
/**
 * Returns the CDN style supported by certain CDN's
 * e.g.
 * - `npm` - unpkg, skypack, esm.sh, and jsdelivr all support `npm` style imports for example they support adding versions to their URLs like this `https://unpkg.com/@okikio/animate@beta`
 * - `github` - github, and jsdelivr.gh both support `github` style imports, as in they don't support adding versions to their URLs like this `https://cdn.jsdelivr.net/gh/jquery/jquery/dist/jquery.min.js`
 * - `deno` - deno supports `deno` style imports, as in they don't support adding versions to their URLs like this `https://deno.land/x/brotli/mod.ts`
 * - `other` - CDNs that haven't been added to the list
 */
export declare const getCDNStyle: (urlStr: string) => "deno" | "github" | "npm" | "other";
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
export declare const getCDNOrigin: (importStr: string, cdn?: string) => string;
/**
 * Remove CDN URL Schemes like `deno:...`, `unpkg:...`, etc... and known CDN hosts, e.g. `https://raw.githubusercontent.com/...`, `https://cdn.skypack.dev/...`, etc...  Leaving only the import path
 */
export declare const getPureImportPath: (importStr: string) => string;
/**
 * Generates a CDN URL for an import, taking advantage of CDN URL Schemes in imports and the default CDN hosts parameter to decide the CDN host
 * Read through {@link getCDNOrigin} and {@link getPureImportPath}
 */
export declare const getCDNUrl: (importStr: string, cdn?: string) => {
    import: string;
    path: string;
    origin: string;
    cdn: string;
    url: URL;
};
