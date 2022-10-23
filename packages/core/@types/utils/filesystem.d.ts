/** Virtual Filesystem Storage */
export declare const FileSystem: Map<string, Uint8Array>;
/**
 * Resolves path to a file in the virtual file system storage
 *
 * @param path the relative or absolute path to resolve to
 * @param importer an absolute path to use to determine relative file paths
 * @returns resolved final path
 */
export declare const getResolvedPath: (path: string, importer?: string) => Promise<string>;
/**
 * Retrevies file from virtual file system storage in either string or uint8array buffer format
 *
 * @param path path of file in virtual file system storage
 * @param type format to retrieve file in, buffer and string are the 2 option available
 * @param importer an absolute path to use to determine a relative file path
 * @returns file from file system storage in either string format or as a Uint8Array buffer
 */
export declare const getFile: (path: string, type?: "string" | "buffer", importer?: string) => Promise<string | Uint8Array>;
/**
 * Writes file to filesystem in either string or uint8array buffer format
 *
 * @param path path of file in virtual file system storage
 * @param content contents of file to store, you can store buffers and/or strings
 * @param importer an absolute path to use to determine a relative file path
 */
export declare const setFile: (path: string, content: Uint8Array | string, importer?: string) => Promise<void>;
