import { isAbsolute, join } from "../deno/path/mod";
import { encodeWhitespace } from "../deno/path/_util";

export { extname, join, isAbsolute } from "@std/path/posix";
// export * from "@std/path/posix/join";
// export * from "../deno/path/mod.ts";

/** 
 * Based on https://github.com/egoist/play-esbuild/blob/main/src/lib/path.ts#L123
 * 
 * Support joining paths to a URL
 */
export const urlJoin = (urlStr: string, ...args: string[]) => {
    const url = new URL(urlStr);
    url.pathname = encodeWhitespace(
        join(url.pathname, ...args).replace(/%/g, "%25").replace(/\\/g, "%5C"),
    );
    return url.toString();
}

/**
 * An import counts as a bare import if it's neither a relative import of an absolute import
 */
 export const isBareImport = (importStr: string) => {
    return /^(?!\.).*/.test(importStr) && !isAbsolute(importStr);
}