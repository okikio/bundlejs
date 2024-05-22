import { join as joinUrl } from "@std/url"; 
export * from "@std/url";

/** 
 * Based on https://github.com/egoist/play-esbuild/blob/main/src/lib/path.ts#L123
 * 
 * Support joining paths to a URL
 */
export const urlJoin = (urlStr: string, ...args: string[]) => {
  const url = joinUrl(urlStr, ...args);
  return url.toString();
};