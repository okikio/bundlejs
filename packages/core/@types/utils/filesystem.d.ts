import type { EVENTS } from "../configs/events.ts";
export interface IFileSystem<T, Content = Uint8Array> {
    /** Direct Access to Virtual Filesystem Storage, if requred for some specific use case */
    files: () => Promise<T>;
    /**
     * Retrevies file from virtual file system storage in either string or uint8array buffer format
     *
     * @param path path of file in virtual file system storage
     * @returns file from file system storage as a Uint8Array buffer
     */
    get: (path: string) => Promise<Content>;
    /**
     * Writes file to filesystem in either string or uint8array buffer format
     *
     * @param path path of file in virtual file system storage
     * @param content contents of file to store as a Uint8Array buffer, if no Uint8Array is given, a new folder is created
     */
    set: (path: string, content?: Content, type?: "file" | "folder") => Promise<void>;
    /**
     * Deletes files and directories at specific paths in the virtual file system storage
     *
     * @param path the relative or absolute path to resolve to
     * @returns promise indicating delete was successful
     */
    delete: (path: string) => Promise<boolean>;
}
export declare function isValid(file: unknown): boolean;
/**
 * Resolves path to a file in the virtual file system storage
 *
 * @param path the relative or absolute path to resolve to
 * @param importer an absolute path to use to determine relative file paths
 * @returns resolved final path
 */
export declare function getResolvedPath(path: string, importer?: string): string;
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
export declare function getFile<T, F extends IFileSystem<T>>(fs: F, path: string, type?: "string" | "buffer", importer?: string): Promise<string | Uint8Array>;
/**
 * Writes file to filesystem in either string or uint8array buffer format
 *
 * @param fs virtual file system
 * @param path path of file in virtual file system storage
 * @param content contents of file to store, you can store buffers and/or strings
 * @param importer an absolute path to use to determine a relative file path
 */
export declare function setFile<T, F extends IFileSystem<T>>(fs: F, path: string, content?: Uint8Array | string, importer?: string): Promise<void>;
/**
 * Deletes file in the filesystem
 *
 * @param fs virtual file system
 * @param path path of file in virtual file system storage
 * @param importer an absolute path to use to determine a relative file path
 * @returns true if a file or folder existed and has been removed, or false if file/folder doesn't exist.
 */
export declare function deleteFile<T, F extends IFileSystem<T>>(fs: F, path: string, importer?: string): Promise<boolean>;
/** Virtual Filesystem Storage */
export declare function createDefaultFileSystem<Content = Uint8Array>(FileSystem?: Map<string, Content>): IFileSystem<Map<string, Content>, Content>;
/** Origin Private File System - Virtual Filesystem Storage */
export declare function createOPFSFileSystem(): Promise<IFileSystem<IFileSystem<Map<string, FileSystemDirectoryHandle | FileSystemHandle | FileSystemFileHandle>, FileSystemDirectoryHandle | FileSystemHandle | FileSystemFileHandle>, Uint8Array>>;
/**
 * Selects the OPFS File System if possible, otherwise fallback to the default Map based Virtual File System
 * @param type Virtual File System to use
 */
export declare function useFileSystem(events: typeof EVENTS, type?: "OPFS" | "DEFAULT"): Promise<IFileSystem<IFileSystem<Map<string, FileSystemDirectoryHandle | FileSystemHandle | FileSystemFileHandle>, FileSystemDirectoryHandle | FileSystemHandle | FileSystemFileHandle>, Uint8Array> | IFileSystem<Map<string, Uint8Array>, Uint8Array>>;
export type WriterableFileStreamData = BufferSource | Blob | DataView | Uint8Array | String | string;
export type FileSystemWritableFileStreamData = {
    type: "write";
    data: WriterableFileStreamData;
    position?: number;
} | {
    type: "seek";
    position: number;
} | {
    type: "truncate";
    size: number;
} | {
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
};
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
