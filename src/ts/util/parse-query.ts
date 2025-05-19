import { decompressFromURL } from "@amoutonbrady/lz-string";
import { EasyDefaultConfig } from "../configs/bundle-options";
import { basename, extname } from "../deno/path/mod.ts";
import { deepAssign } from "./deep-equal";
import { parse as parsePackageName } from "parse-package-name";

export const parseInput = (value: string) => {
    const host = "https://registry.npmjs.com/-/v1/search?text";
    // const host = "https://api.npms.io/v2/search?q";
    let urlScheme = `${host}=${encodeURIComponent(
        value
    )}&popularity=0.5&size=30`;

    let version = "";
    let exec = /([\S]+)@([\S]+)/g.exec(value);
    if (exec) {
        let [, pkg, ver] = exec;
        version = ver;
        urlScheme = `${host}=${encodeURIComponent(
            pkg
        )}&popularity=0.5&size=30`;
    }

    return { url: urlScheme, version };
};

/**
 * Treeshake exports/imports. It allows for specifing multiple exports per package, through this syntax
 * ```ts
 * "[{ x,y,z }],[*],[* as X],[{ type xyz }]" 
 * // to
 * export { x, y, z } from "...";
 * export * from "...";
 * export * as X from "...";
 * export { type xyz } from "...";
 * ```
 * where the square brackets represent seperate packages, and everything inside the squarebrackets,
 * are the exported methods, types, etc...
 */
export const parseTreeshakeExports = (str: string) =>
    (str ?? "").split(/\],/).map((str) => str.replace(/\[|\]/g, ""));

/**
 * Grab the basename w/o an extension
 */
export const fromBasename = (path: string) =>
    basename(path.replace(/^https?\:\/\//, ""), extname(path));
    
/**
 * Get cleaned up module name
 * e.g. "@okikio/animate" -> okikioAnimate
 */
export const getModuleName = (str: string) => {
    let name = str;
    let path = null;
    let version = null;
    try {
        const parsed = parsePackageName(str);
        name = parsed.name;
        path = parsed.path;
        version = parsed.version;
    } catch (e) { }

    let baseName = name; // Use the package name as the base for the alias
    if (/^https?:\/\//.test(str)) { // If it's a URL, derive basename differently
        baseName = fromBasename(str);
    } else if (path) { // If there's a path within the package, append it to the name
        baseName += fromBasename(path).replace(/[^a-zA-Z0-9_]/g, '_'); // Sanitize and append path part
    }
    
    let result = baseName.split(/(?:-|_|\/)/g)
        .map((x: string | any[], i: number) => i > 0 && x.length > 0 && typeof x === 'string' ? (x[0].toUpperCase() + x.slice(1)) : x)
        .join("")
        .replace(/[^\w\s]/gi, "");

    if (version) {
        const sanitizedVersion = version.replace(/[^a-zA-Z0-9_]/g, '_');
        result += "_" + sanitizedVersion;
    }

    if (/^\d/.test(result)) {
        result = "_" + result;
    }
    return result;
}

// Inspired by https://github.com/solidjs/solid-playground
/**
* Converts URL's into code. It allows for specifing multiple exports per package, through this syntax
* ```ts
* "/?q=(import)@okikio/emitter,(import)@okikio/animate,(import)@okikio/animate,(import)@okikio/animate,(import)@okikio/animate,@okikio/animate,@okikio/animate,@okikio/animate,@okikio/animate&treeshake=[T],[{+animate+}],[{+animate+as+B+}],[*+as+TR],[{+type+animate+}],[*],[{+animate+as+A+}],[*+as+PR],[{+animate+}]&share=MYewdgziA2CmB00QHMAUAiAwiG6CUQA" 
* // to
* // Click Build for the Bundled, Minified & Gzipped package size
* import T from "@okikio/emitter";
* import { animate } from "@okikio/animate";
* import { animate as B } from "@okikio/animate";
* import * as TR from "@okikio/animate";
* import { type animate } from "@okikio/animate";
* export * from "@okikio/animate";
* export { animate as A } from "@okikio/animate";
* export * as PR from "@okikio/animate";
* export { animate } from "@okikio/animate";
* console.log("Cool")
* ```
* - `q` represents the module, e.g. react, vue, etc... You can add `(import)` in-front of a specific module to make it an import instead of an export
* - `treeshake` represents the exports to treeshake. Read more about this here, {@link parseTreeshakeExports}
* - `share` represents all other code that isn't export/import
*/
export const parseSearchQuery = (shareURL: URL) => {
    try {
        const searchParams = shareURL.searchParams;
        let result = "";
        let query = searchParams.get("query") || searchParams.get("q");
        let treeshakeParam = searchParams.get("treeshake"); // null if not present
        
        if (query) {
            let rawQueryArr = query.trim().split(",");
            let queryArr: string[];
            const moduleCounts = new Map<string, number>(); 

            if (treeshakeParam == null) {
                const uniqueModuleQueries = new Set<string>();
                queryArr = rawQueryArr.filter(item => {
                    const moduleName = item.startsWith("(import)") ? item.substring("(import)".length) : item;
                    if (uniqueModuleQueries.has(moduleName)) {
                        moduleCounts.set(moduleName, (moduleCounts.get(moduleName) || 1) + 1);
                        return false;
                    }
                    uniqueModuleQueries.add(moduleName);
                    moduleCounts.set(moduleName, 1);
                    return true;
                });
            } else {
                queryArr = rawQueryArr;
            }

            let treeshakeArr = parseTreeshakeExports((treeshakeParam ?? "").trim());

            const generatedLines = queryArr
                .map((q_item, i) => {
                    const moduleQuery = q_item.trim();
                    const isImport = moduleQuery.startsWith("(import)");
                    const moduleName = (isImport ? moduleQuery.substring("(import)".length) : moduleQuery)?.trim();

                    if (!moduleName) return ""; 

                    let currentModuleLines: string[] = [];
                    const specificTreeshakeForModule = treeshakeArr[i]?.trim();

                    if (isImport) {
                        const importName = getModuleName(moduleName);
                        const importClause = specificTreeshakeForModule || `* as ${importName}`;

                        if (importClause === "*") { 
                            currentModuleLines.push(`import "${moduleName}";`);
                        } else if (importClause.startsWith("* as")) { 
                            currentModuleLines.push(`import ${importClause} from "${moduleName}";`);
                        } else if (importClause.startsWith("{") && importClause.endsWith("}")) { 
                            currentModuleLines.push(`import ${importClause} from "${moduleName}";`);
                        } else { 
                            currentModuleLines.push(`import ${importClause} from "${moduleName}";`);
                        }
                    } else { // Export
                        const moduleAlias = getModuleName(moduleName);

                        if (queryArr.length === 1 && (specificTreeshakeForModule == null || specificTreeshakeForModule === "")) {
                            currentModuleLines.push(`export * from "${moduleName}";`);
                            currentModuleLines.push(`export { default } from "${moduleName}";`);
                        } else {
                            if (specificTreeshakeForModule != null && specificTreeshakeForModule !== "") {
                                let individualExportParts = specificTreeshakeForModule.split(',');
                                for (const part of individualExportParts) {
                                    let clause = part.trim();
                                    if (clause === "") continue;

                                    if (clause === "*") {
                                        if (queryArr.length > 1 || individualExportParts.length > 1) {
                                            currentModuleLines.push(`export * as ${moduleAlias} from "${moduleName}";`);
                                        } else {
                                            currentModuleLines.push(`export * from "${moduleName}";`);
                                        }
                                    } else if (clause.startsWith("* as")) {
                                        currentModuleLines.push(`export ${clause} from "${moduleName}";`);
                                    } else if (clause.startsWith("{") && clause.endsWith("}")) {
                                        if (clause === "{default}") {
                                            if (queryArr.length > 1 || individualExportParts.length > 1) {
                                                currentModuleLines.push(`export { default as ${moduleAlias}Default } from "${moduleName}";`);
                                            } else {
                                                currentModuleLines.push(`export { default } from "${moduleName}";`);
                                            }
                                        } else {
                                            currentModuleLines.push(`export ${clause} from "${moduleName}";`);
                                        }
                                    } else { 
                                        currentModuleLines.push(`export { ${clause} } from "${moduleName}";`);
                                    }
                                }
                            } else {
                                // Default aliasing for multiple modules/versions when no specific treeshake
                                currentModuleLines.push(`export * as ${moduleAlias} from "${moduleName}";`);
                                currentModuleLines.push(`export { default as ${moduleAlias}Default } from "${moduleName}";`);
                            }
                        }
                    }
                    return currentModuleLines.join("\n");
                })
                .filter(s => s.length > 0);

            if (generatedLines.length > 0) {
                result += "// Click Build for the Bundled, Minified & Compressed package size\n";
                result += generatedLines.join("\n");
            }
        }

        let share = searchParams.get("share");
        if (share) result += "\n" + decompressFromURL(share.trim());

        let plaintext = searchParams.get("text");
        if (plaintext) {
            result += "\n" + JSON.parse(
                /**    
                 * Support users wrapping/not-wrapping plaintext in a string, 
                 * e.g. 
                 * ```md
                 * 
                 * 
                 * /?text="console.log(document)\nconsole.log(window)"
                 * and
                 * /?text=console.log(document)\nconsole.log(window)
                 * 
                 * 
                 * are the same, they result in 
                 * ```ts
                 * console.log(document)
                 * console.log(window)
                 * ```
                */
                /^["']/.test(plaintext) && /["']$/.test(plaintext) ? plaintext : JSON.stringify("" + plaintext).replace(/\\\\/g, "\\")
            );
        }

        return result.trim();
    } catch (e) { }
};

/**
* Converts URL's into config. 
* - `config` represents the JSON config
*/
export const parseConfig = (shareURL: URL) => {
    try {
        const searchParams = shareURL.searchParams;
        const config = searchParams.get("config") ?? "{}";
        return deepAssign({}, EasyDefaultConfig, JSON.parse(config ? config : "{}"));
    } catch (e) { }
};