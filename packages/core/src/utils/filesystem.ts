import { decode, encode } from "@bundle/utils/utils/encode-decode.ts";
import { dirname, basename, resolve, posix, join } from "@bundle/utils/utils/path.ts";
import { LOGGER_WARN, dispatchEvent } from "../configs/events.ts";
import type { FileSystemFileHandleWithPath } from "./types.ts";

export const ROOT_DIR = "root";

export interface IFileSystem<T, Content = Uint8Array> {
  /** Direct Access to Virtual Filesystem Storage, if requred for some specific use case */
  files: () => Promise<Map<string, T>>,

  /**
   * Retrevies file from virtual file system storage in either string or uint8array buffer format
   * 
   * @param path path of file in virtual file system storage
   * @returns file from file system storage as a Uint8Array buffer
   */
  get: (path: string) => Promise<Content | null | undefined>,

  /**
   * Writes file to filesystem in either string or uint8array buffer format
   * 
   * @param path path of file in virtual file system storage
   * @param content contents of file to store as a Uint8Array buffer, if no Uint8Array is given, a new folder is created
   */
  set: (path: string, content?: Content | null, type?: "file" | "folder") => Promise<void>,

  /**
   * Deletes files and directories at specific paths in the virtual file system storage 
   * 
   * @param path the relative or absolute path to resolve to
   * @returns promise indicating delete was successful
   */
  delete: (path: string) => Promise<boolean | void>,
}

export function isValid(file: unknown) {
  return file !== undefined && file !== null && !Number.isNaN(file);
}

/**
 * Resolves path to a file in the virtual file system storage 
 * 
 * @param path the relative or absolute path to resolve to
 * @param importer an absolute path to use to determine relative file paths
 * @returns resolved final path
 */
export function getResolvedPath(path: string, importer?: string) {
  let resolvedPath = path;
  if (importer && path.startsWith("."))
    resolvedPath = resolve(dirname(importer), path);

  return resolvedPath;
  // throw `File "${resolvedPath}" does not exist`;
};

/**
 * Retrieves file from virtual file system storage in either string or uint8array buffer format
 * 
 * If `getFile` returns these
 * - `undefined` means file doesn't exist
 * - `null` means content is an intentionally empty file 
 * 
 * @param fs virtual file system 
 * @param path path of file in virtual file system storage
 * @param type format to retrieve file in, buffer and string are the 2 options available
 * @param importer an absolute path to use to determine a relative file path
 * @returns file from file system storage in either string format or as a Uint8Array buffer
 */
export async function getFile<T, F extends IFileSystem<T, Content>, Content = Uint8Array>(fs: F, path: string, type: "string", importer?: string): Promise<string | null>;
export async function getFile<T, F extends IFileSystem<T, Content>, Content = Uint8Array>(fs: F, path: string, type: "buffer", importer?: string): Promise<Awaited<Content> | null>;
export async function getFile<T, F extends IFileSystem<T, Content>, Content = Uint8Array>(fs: F, path: string, type: string = "buffer", importer?: string): Promise<string | Awaited<Content> | null> {
  const resolvedPath = getResolvedPath(path, importer);

  console.log({
    type: "setFile",
    path,
    resolvedPath,
  })

  try {
    const file = await fs.get(resolvedPath);
    if (file === undefined) return null;
    if (!isValid(file)) return null;

    if (type === "string" && ArrayBuffer.isView(file)) return decode(file);
    return file;
  } catch (e) { }
  return null;
}

/**
 * Writes file to filesystem in either string or uint8array buffer format
 * 
 * @param fs virtual file system 
 * @param path path of file in virtual file system storage
 * @param content contents of file to store, you can store buffers and/or strings
 * @param importer an absolute path to use to determine a relative file path
 */
export async function setFile<T, F extends IFileSystem<T>>(fs: F, path: string, content?: Uint8Array | string, importer?: string) {
  const resolvedPath = getResolvedPath(path, importer);

  try {
    if (!isValid(content)) await fs.set(resolvedPath, null, 'folder');
    await fs.set(resolvedPath, content instanceof Uint8Array ? content : encode(content!), 'file');
  } catch (e) {
    throw new Error(`Error occurred while writing to "${resolvedPath}": ${e}`, { cause: e });
  }
};

/**
 * Deletes file in the filesystem
 * 
 * @param fs virtual file system 
 * @param path path of file in virtual file system storage
 * @param importer an absolute path to use to determine a relative file path
 * @returns true if a file or folder existed and has been removed, or false if file/folder doesn't exist.
 */
export async function deleteFile<T, F extends IFileSystem<T>>(fs: F, path: string, importer?: string) {
  const resolvedPath = getResolvedPath(path, importer);
  try {
    const file = await fs.get(resolvedPath);
    if (file === undefined) return false;

    return await fs.delete(resolvedPath);
  } catch (e) {
    throw new Error(`Error occurred while deleting "${resolvedPath}": ${e}`, { cause: e });
  }
};

/** Virtual Filesystem Storage */
export function createDefaultFileSystem<T = Uint8Array, Content = Uint8Array>(FileSystem = new Map<string, Content | undefined | null>()) {
  const fs: IFileSystem<T, Content> = {
    files: async () => FileSystem as unknown as Map<string, T>,
    get: async (path: string) => FileSystem.get(resolve(path)),
    async set(path: string, content?: Content | null) {
      const resolvedPath = resolve(path);
      const dir = dirname(resolvedPath);

      const parentDirs = dir.split(posix.SEPARATOR).filter(x => x.length > 0);
      const len = parentDirs.length;
      FileSystem.set("/", null);

      // Generate all the subdirectories in b/w
      let accPath = parentDirs[0] !== posix.SEPARATOR ? "/" : "";
      for (let i = 0; i < len; i ++) {
        accPath += parentDirs[i];
        if (!FileSystem.has(accPath)) 
          FileSystem.set(accPath, null);
        accPath += "/";
      }

      FileSystem.set(resolvedPath, content);
    },
    async delete(path: string) {
      return FileSystem.delete(resolve(path))
    }
  };

  return fs;
}

/**
 * Write File Contents the Origin Private File System (OPFS) file handles
 */
async function writeFile(fileHandle: FileSystemFileHandle, contents: Uint8Array | string) {
  // https://developer.mozilla.org/en-US/docs/Web/API/FileSystemFileHandle/createSyncAccessHandle
  if ("createSyncAccessHandle" in fileHandle && fileHandle.createSyncAccessHandle) {
    // Get sync access handle
    const accessHandle = await fileHandle.createSyncAccessHandle();

    try {
      // Write the message to the begining of the file.
      const encodedMessage = contents instanceof Uint8Array ? contents : encode(contents);
      accessHandle.write(encodedMessage, { at: 0 });

      // Persist changes to disk.
      accessHandle.flush();
    } finally {
      // Always close FileSystemSyncAccessHandle if done.
      accessHandle.close();
    }
  }
  
  // https://developer.mozilla.org/en-US/docs/Web/API/FileSystemFileHandle/createWritable
  // Create a FileSystemWritableFileStream to write to.
  const writable = await fileHandle.createWritable!();

  // Write the contents of the file to the stream.
  await writable.write(contents);

  // Close the file and write the contents to disk.
  await writable.close();
}

/**
 * Read File Contents of Origin Private File System (OPFS) file handles as Uint8Arrays
 */
async function readFile(fileHandle: FileSystemFileHandle) {
  // https://developer.mozilla.org/en-US/docs/Web/API/FileSystemFileHandle/createSyncAccessHandle
  if ("createSyncAccessHandle" in fileHandle && fileHandle.createSyncAccessHandle) {
    // Get sync access handle
    const accessHandle = await fileHandle.createSyncAccessHandle();

    try {
      // Get size of the file.
      const fileSize = accessHandle.getSize();

      // Read file content to a buffer.
      const buffer = new Uint8Array(new ArrayBuffer(fileSize));
      accessHandle.read(buffer, { at: 0 });

      return buffer;
    } finally {
      // Always close FileSystemSyncAccessHandle if done.
      accessHandle.close();
    }
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/FileSystemFileHandle/getFile
  // Get file contents
  const fileData = await fileHandle.getFile();
  const arrbuf = await fileData.arrayBuffer();

  // Return file contents as ArrayBuffer.
  return new Uint8Array(arrbuf); 
}

async function traverseFileSystem(root: FileSystemDirectoryHandle, path: string, files?: Map<string, FileSystemHandle | FileSystemFileHandle | FileSystemDirectoryHandle> | null, { create = true } = {}) {
  files ??= new Map<string, FileSystemHandle | FileSystemFileHandle | FileSystemDirectoryHandle>();

  const resPath = path.replace(/[:,]/g, "_");
  const resolvedPath = resolve(resPath);
  const dir = dirname(resolvedPath);

  const parentDirs = dir.split(posix.SEPARATOR).filter(x => x.length > 0);
  const len = parentDirs.length;

  // Generate all the subdirectories in between
  let accPath = parentDirs[0] !== posix.SEPARATOR ? "/" : "";
  let parentDirHandle = root;
  files.set(posix.SEPARATOR, root);

  for (let i = 0; i < len; i++) {
    const parentDir = parentDirs[i];
    accPath += parentDir;

    if (!files.has(accPath)) {
      parentDirHandle = await parentDirHandle.getDirectoryHandle(parentDir, { "create": create });
      files.set(accPath, parentDirHandle);
    }

    accPath += posix.SEPARATOR;
  }

  return {
    resolvedPath,
    parentDirs,
    dir,
    files,
    parentDirHandle
  }
}

async function getRelativePath(root: FileSystemDirectoryHandle, entry: FileSystemFileHandle) {
  // Check if handle exists inside our directory handle
  const relativePaths = await root.resolve(entry);

  // relativePath is an array of names, giving the relative path
  if (Array.isArray(relativePaths) && relativePaths.length > 0) {
    return relativePaths.join(posix.SEPARATOR)
  }

  return null
}

export const enum ListFilter {
  File = "file",
  Directory = "directory",
  Both = "both",
}

// Define the overloads with the correct return types
function listFilesRecursively(
  root: FileSystemDirectoryHandle,
  entry?: FileSystemHandle | null,
  opts?: { filter?: ListFilter.File, recursive?: boolean }
): AsyncGenerator<FileSystemFileHandleWithPath>;
function listFilesRecursively(
  root: FileSystemDirectoryHandle,
  entry?: FileSystemHandle | null,
  opts?: { filter: ListFilter.Both, recursive?: boolean }
): AsyncGenerator<FileSystemFileHandleWithPath | FileSystemHandle>;
function listFilesRecursively(
  root: FileSystemDirectoryHandle,
  entry?: FileSystemHandle | null,
  opts?: { filter: ListFilter.Directory, recursive?: boolean }
): AsyncGenerator<FileSystemHandle>;
function listFilesRecursively(
  root: FileSystemDirectoryHandle,
  entry?: FileSystemHandle | null,
  opts?: { filter?: ListFilter, recursive?: boolean }
): AsyncGenerator<FileSystemFileHandleWithPath>;
async function* listFilesRecursively(
  root: FileSystemDirectoryHandle,
  entry?: FileSystemHandle | null,
  opts: { filter?: ListFilter, recursive?: boolean } = {}
): AsyncGenerator<FileSystemFileHandleWithPath> | AsyncGenerator<FileSystemHandle> | AsyncGenerator<FileSystemFileHandleWithPath | FileSystemHandle> {
  const { filter = ListFilter.File, recursive = true } = opts;
  const allowFiles = filter === ListFilter.File || filter === ListFilter.Both;
  const allowDirectories = filter === ListFilter.Directory || filter === ListFilter.Both;
  entry ??= root;

  if (entry.kind === "file" && allowFiles) {
    const fileHandle = entry as FileSystemFileHandleWithPath;
    if (fileHandle) {
      const absolutePath = posix.SEPARATOR + await getRelativePath(root, entry as FileSystemFileHandle);
      if (absolutePath) fileHandle.absolutePath = absolutePath;
      yield fileHandle;
    }
  } else if (entry.kind === "directory") {
    for await (const handle of (entry as FileSystemDirectoryHandle).values()) {
      if (allowDirectories) {
        yield handle;
      }

      if (recursive) {
        yield* listFilesRecursively(root, handle, opts);
      } 
    }
  }
}

/** Origin Private File System - Virtual Filesystem Storage */
export async function createOPFSFileSystem() {
  try {
    if (!("navigator" in globalThis) || !globalThis?.navigator?.storage) {
      throw new Error("OPFS not supported by the current browser");
    }

    const INTERNAL_FS = createDefaultFileSystem<FileSystemFileHandleWithPath>();
    const initRoot = await navigator.storage.getDirectory();
    const root = await initRoot.getDirectoryHandle(ROOT_DIR, { "create": true });

    const fs: IFileSystem<FileSystemFileHandleWithPath> = {
      async files() {
        const files = await INTERNAL_FS.files();
        files.clear();

        for await (const fileHandle of listFilesRecursively(root)) {
          const file = await fileHandle.getFile();
          INTERNAL_FS.set(
            fileHandle.absolutePath, 
            new Uint8Array(await file.arrayBuffer())
          );
        }

        return files;
      },
      async get(path: string) {
        const { parentDirHandle, resolvedPath } = await traverseFileSystem(root, path);
        const _basename = basename(resolvedPath);
        const isRootDir = _basename === posix.SEPARATOR || _basename.length < 1;

        let fileHandle: FileSystemDirectoryHandle | FileSystemFileHandle = parentDirHandle;
        if (!isRootDir) {
          try {
            fileHandle = await parentDirHandle.getFileHandle(_basename);
          } catch (e) { }
        }

        if (fileHandle.kind === "file") {
          return await readFile(fileHandle);
        } else {
          return null;
        }
      },
      async set(path: string, content?: Uint8Array | string | null, type?: string) {
        const { parentDirHandle, resolvedPath } = await traverseFileSystem(root, path);
        const _basename = basename(resolvedPath);
        const isRootDir = _basename === posix.SEPARATOR || _basename.length < 1;

        let fileHandle: FileSystemDirectoryHandle | FileSystemFileHandle = parentDirHandle;
        if (!isRootDir) {
          try {
            fileHandle = await parentDirHandle.getFileHandle(_basename, { "create": true });
          } catch (e) { }
        }

        if (content && fileHandle.kind === "file") 
          await writeFile(fileHandle, content);
      },
      async delete(path: string) {
        try {
          const { parentDirHandle, resolvedPath } = await traverseFileSystem(root, path, null, { create: false });
          const _basename = basename(resolvedPath);
          const isRootDir = _basename === posix.SEPARATOR || _basename.length < 1;

          let fileHandle: FileSystemDirectoryHandle | FileSystemFileHandle = parentDirHandle;
          if (!isRootDir) {
            try {
              fileHandle = await parentDirHandle.getFileHandle(_basename);
            } catch (e) {}
          }
          
          if (!isRootDir) {
            await parentDirHandle.removeEntry(_basename, { recursive: true });
          }
          
          // If you reach the root folder delete all the child entries, 
          // we need the root folder to always exist
          else if (fileHandle.kind === "directory" && isRootDir) {
            const list = listFilesRecursively(root, fileHandle, {
              filter: ListFilter.Both,
              recursive: false
            });

            for await (const entry of list) {
              await parentDirHandle.removeEntry(entry.name, { recursive: true });
            }
          }
        } catch (error) {
          console.error(`Error occurred while deleting "${path}":`, error);
          throw error;
        }
        return true;
      }
    }

    return fs;
  } catch(e) {
    throw new Error(`Cannot create OPFS Virtual File System: ${e}`, { cause: e })
  }
}

/**
 * Selects the OPFS File System if possible, otherwise fallback to the default Map based Virtual File System
 * @param type Virtual File System to use
 */
export async function useFileSystem(type?: "DEFAULT"): Promise<IFileSystem<Uint8Array>>;
export async function useFileSystem(type?: "OPFS"): Promise<IFileSystem<FileSystemFileHandleWithPath>>;
export async function useFileSystem(type: string = "DEFAULT") {
  try {
    switch (type) {
      case "DEFAULT":
        return createDefaultFileSystem();
      case "OPFS":
        return await createOPFSFileSystem();
    }
  } catch (e) {
    dispatchEvent(LOGGER_WARN, e);
  }

  return createDefaultFileSystem();
}