import { decode, encode } from "./encode-decode.ts";
import { dirname, basename, resolve, sep } from "../deno/path/mod.ts";

import { LOGGER_WARN, dispatchEvent } from "../configs/events.ts";
import { Velo } from "velo";

export interface IFileSystem<T, Content = Uint8Array> {
  /** Direct Access to Virtual Filesystem Storage, if requred for some specific use case */
  files: () => Promise<T>,

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
 * Retrevies file from virtual file system storage in either string or uint8array buffer format
 * 
 * If `getFile` returns these
 * - `undefined` means file doesn't exist
 * - `null` means content is an intentionally empty file 
 * 
 * @param fs virtual file system 
 * @param path path of file in virtual file system storage
 * @param type format to retrieve file in, buffer and string are the 2 option available
 * @param importer an absolute path to use to determine a relative file path
 * @returns file from file system storage in either string format or as a Uint8Array buffer
 * 
 */
export async function getFile<T, F extends IFileSystem<T>>(fs: F, path: string, type: "string" | "buffer" = "buffer", importer?: string) {
  const resolvedPath = getResolvedPath(path, importer);

  try {
    const file = await fs.get(resolvedPath);
    if (file === undefined) return undefined;
    if (!isValid(file)) return null;

    if (type === "string") return decode(file!);
    return file;
  } catch (e) {
    throw new Error(`Error occurred while getting "${resolvedPath}": ${e}`, { cause: e });
  }
};

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
    console.log({ file })
    if (file === undefined) return false;

    return await fs.delete(resolvedPath);
  } catch (e) {
    throw new Error(`Error occurred while deleting "${resolvedPath}": ${e}`, { cause: e });
  }
};

/** Virtual Filesystem Storage */
export function createDefaultFileSystem<Content = Uint8Array>(FileSystem = new Map<string, Content | null | undefined>()) {
  const fs: IFileSystem<typeof FileSystem, Content> = {
    files: async () => FileSystem,
    get: async (path: string) => FileSystem.get(resolve(path)),
    async set(path: string, content?: Content | null) {
      const resolvedPath = resolve(path);
      const dir = dirname(resolvedPath);

      const parentDirs = dir.split(sep).filter(x => x.length > 0);
      const len = parentDirs.length;

      // Generate all the subdirectories in b/w
      let accPath = parentDirs[0] !== sep ? "/" : "";
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

    // Write the message to the begining of the file.
    const encodedMessage = contents instanceof Uint8Array ? contents : encode(contents);
    accessHandle.write(encodedMessage, { at: 0 });

    // Persist changes to disk.
    accessHandle.flush();

    // Always close FileSystemSyncAccessHandle if done.
    return accessHandle.close();
  }
  
  // https://developer.mozilla.org/en-US/docs/Web/API/FileSystemFileHandle/createWritable
  // Create a FileSystemWritableFileStream to write to.
  const writable = await fileHandle.createWritable!();

  // Write the contents of the file to the stream.
  await writable.write(contents);

  // Close the file and write the contents to disk.
  return await writable.close();
}

/**
 * Read File Contents of Origin Private File System (OPFS) file handles as Uint8Arrays
 */
async function readFile(fileHandle: FileSystemFileHandle) {
  // https://developer.mozilla.org/en-US/docs/Web/API/FileSystemFileHandle/createSyncAccessHandle
  if ("createSyncAccessHandle" in fileHandle && fileHandle.createSyncAccessHandle) {
    // Get sync access handle
    const accessHandle = await fileHandle.createSyncAccessHandle();

    // Get size of the file.
    const fileSize = accessHandle.getSize();

    // Read file content to a buffer.
    const buffer = new Uint8Array(new ArrayBuffer(fileSize));
    accessHandle.read(buffer, { at: 0 });
    return buffer;
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/FileSystemFileHandle/getFile
  // Get file contents
  const fileData = await fileHandle.getFile();
  const arrbuf = await fileData.arrayBuffer();

  // Return file contents as ArrayBuffer.
  return new Uint8Array(arrbuf);
}

/** Origin Private File System - Virtual Filesystem Storage */
export async function createOPFSFileSystem() {
  try {
    if (!("navigator" in globalThis) || !globalThis?.navigator?.storage) {
      throw new Error("OPFS not supported by the current browser");
    }

    const INTERNAL_FS = createDefaultFileSystem<FileSystemHandle | FileSystemFileHandle | FileSystemDirectoryHandle>();
    const files = await INTERNAL_FS.files();

    const root = await navigator.storage.getDirectory();
    files.set(sep, root);

    const fs: IFileSystem<typeof INTERNAL_FS> = {
      async files() {
        return INTERNAL_FS;
      },
      async get(path: string) {
        const resPath = path.replace(/[:,]/g, "_");
        console.log({
          resPath,
          files
        })
        const fileOrFolderHandle = await INTERNAL_FS.get(resPath);
        if (fileOrFolderHandle.kind === "file") {
          return await readFile(fileOrFolderHandle as FileSystemFileHandle);
        } else {
          return null;
        }
      },
      async set(path: string, content: Uint8Array | string, importer?: string) {
        const resPath = path.replace(/[:,]/g, "_");
        const resolvedPath = resolve(resPath);
        const dir = dirname(resolvedPath);

        const parentDirs = dir.split(sep).filter(x => x.length > 0);
        const len = parentDirs.length;

        // Generate all the subdirectories in b/w
        let accPath = parentDirs[0] !== sep ? "/" : "";
        let parentDirHandle = root;
        for (let i = 0; i < len; i++) {
          const parentDir = parentDirs[i];
          accPath += parentDir;

          if (!files.has(accPath)) {
            parentDirHandle = await parentDirHandle.getDirectoryHandle(parentDir, { "create": true });
            files.set(accPath, parentDirHandle);
          }

          accPath += sep;
        }

        const fileHandle = await parentDirHandle.getFileHandle(basename(resolvedPath), { "create": true });
        await writeFile(fileHandle, content);
        files.set(resolvedPath, fileHandle);
      },
      async delete(path: string) {
        const resolvedPath = resolve(path);
        const dirPath = dirname(resolvedPath);

        const fileHandle = await INTERNAL_FS.get(resolvedPath) as FileSystemFileHandle; 
        const folderHandle = await INTERNAL_FS.get(dirPath) as FileSystemDirectoryHandle; 

        await folderHandle.removeEntry(fileHandle.name);
        return await INTERNAL_FS.delete(resolvedPath)
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
export async function useFileSystem(type: "OPFS" | "DEFAULT" = "DEFAULT") {
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

export type WriterableFileStreamData = BufferSource | Blob | DataView | Uint8Array | String | string;
export type FileSystemWritableFileStreamData =
  { type: "write", data: WriterableFileStreamData; position?: number; } |
  { type: "seek", position: number; } |
  { type: "truncate", size: number; } |
  {
    /**
     * A string that is one of the following: "write", "seek", or "truncate".
     */
    type: "write" | "seek" | "truncate";

    /**
     * The file data to write. Can be an ArrayBuffer, a TypedArray, a DataView, a Blob, a String object, or a string literal. This property is required if type is set to write. 
     */
    data?: WriterableFileStreamData;

    /** 
     * The byte position the current file cursor should move to if type seek is used.Can also be set with if type is write, in which case the write will start at the position. 
     */
    position?: number;

    /**
     * An unsigned long value representing the amount of bytes the stream should contain.This property is required if type is set to truncate.
     */
    size?: number;
  }

export interface FileSystemWritableFileStream extends WritableStream {
  seek(position: number): Promise<void>;
  truncate(newSize: number): Promise<void>;
  write(buffer: WriterableFileStreamData | FileSystemWritableFileStreamData): Promise<void>;
}

export interface FileSystemCreateWritableOptions {
  /**
   *  If false or not specified, the temporary file starts out empty, otherwise the existing file is first copied to this temporary file.
   */
  keepExistingData?: boolean;
}

export interface FileSystemReadWriteOptions {
  at?: number;
}

/** Available only in secure contexts. */
export interface FileSystemSyncAccessHandle {
  close(): void;
  flush(): void;
  getSize(): number;
  read(buffer: BufferSource, options?: FileSystemReadWriteOptions): number;
  truncate(newSize: number): void;
  write(buffer: BufferSource, options?: FileSystemReadWriteOptions): number;
}

/** Available only in secure contexts. */
export interface FileSystemFileHandle extends FileSystemHandle {
  readonly kind: "file";
  createSyncAccessHandle?(): Promise<FileSystemSyncAccessHandle>;
  /**
   * The createWritable() method of the FileSystemFileHandle interface creates a FileSystemWritableFileStream 
   * that can be used to write to a file. The method returns a Promise which resolves to this created stream.
   * 
   * Any changes made through the stream won't be reflected in the file represented by the file handle 
   * until the stream has been closed. This is typically implemented by writing data to a temporary file, 
   * and only replacing the file represented by file handle with the temporary file when the 
   * writable filestream is closed.
   */
  createWritable?(options?: FileSystemCreateWritableOptions): Promise<FileSystemWritableFileStream>;
  getFile(): Promise<File>;
}