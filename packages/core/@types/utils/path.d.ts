export * from "../deno/path/mod.ts";
/**
 * Based on https://github.com/egoist/play-esbuild/blob/main/src/lib/path.ts#L123
 *
 * Support joining paths to a URL
 */
export declare const urlJoin: (urlStr: string, ...args: string[]) => string;
/**
 * An import counts as a bare import if it's neither a relative import of an absolute import
 */
export declare const isBareImport: (importStr: string) => boolean;
