import { dirname, resolve } from "../deno/path/mod";
import { decode, encode } from "./encode-decode";

/** Virtual Filesystem Storage */
export const FileSystem = new Map<string, Uint8Array>();

/**
 * Resolves path to a file in the virtual file system storage 
 * 
 * @param path the relative or absolute path to resolve to
 * @param importer an absolute path to use to determine relative file paths
 * @returns resolved final path
 */
export const getResolvedPath = async (path: string, importer?: string) => {
  let resolvedPath = path;
  if (importer && path.startsWith('.'))
    resolvedPath = resolve(dirname(importer), path);

  if (FileSystem.has(resolvedPath)) return resolvedPath;
  throw `File "${resolvedPath}" does not exist`;
}

/**
 * Retrevies file from virtual file system storage in either string or uint8array buffer format
 * 
 * @param path path of file in virtual file system storage
 * @param type format to retrieve file in, buffer and string are the 2 option available
 * @param importer an absolute path to use to determine a relative file path
 * @returns file from file system storage in either string format or as a Uint8Array buffer
 */
export const getFile = async (path: string, type: 'string' | 'buffer' = "buffer", importer?: string) => {
  let resolvedPath = await getResolvedPath(path, importer);

  if (FileSystem.has(resolvedPath)) {
    let file = FileSystem.get(resolvedPath);
    return type == "string" ? decode(file) : file;
  }
}

/**
 * Writes file to filesystem in either string or uint8array buffer format
 * 
 * @param path path of file in virtual file system storage
 * @param content contents of file to store, you can store buffers and/or strings
 * @param importer an absolute path to use to determine a relative file path
 */
export const setFile = async (path: string, content: Uint8Array | string, importer?: string) => {
  let resolvedPath = path;
  if (importer && path.startsWith('.'))
    resolvedPath = resolve(dirname(importer), path);

  try {
    FileSystem.set(resolvedPath, content instanceof Uint8Array ? content : encode(content));
  } catch (e) {
    throw `Error occurred while writing to "${resolvedPath}"`;
  }
}