import { isAbsolute } from "@std/path/posix";

export * from "@std/path/posix";
export * as posix from "@std/path/posix";
export * as windows from "@std/path/windows";

/**
 * An import counts as a bare import if it's neither a relative import of an absolute import
 */
export const isBareImport = (importStr: string) => {
  return /^(?!\.).*/.test(importStr) && !importStr.startsWith("data:") && !isAbsolute(importStr);
};
