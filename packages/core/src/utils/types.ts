export interface FileSystemFileHandleWithPath extends FileSystemFileHandle {
  absolutePath: string
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

/**
 * Available only in secure contexts.
 *
 * [MDN Reference](https://developer.mozilla.org/docs/Web/API/FileSystemDirectoryHandle)
 */
export interface FileSystemDirectoryHandle extends FileSystemHandle {
  readonly kind: "directory";
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/FileSystemDirectoryHandle/getDirectoryHandle) */
  getDirectoryHandle(name: string, options?: FileSystemGetDirectoryOptions): Promise<FileSystemDirectoryHandle>;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/FileSystemDirectoryHandle/getFileHandle) */
  getFileHandle(name: string, options?: FileSystemGetFileOptions): Promise<FileSystemFileHandle>;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/FileSystemDirectoryHandle/removeEntry) */
  removeEntry(name: string, options?: FileSystemRemoveOptions): Promise<void>;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/FileSystemDirectoryHandle/resolve) */
  resolve(possibleDescendant: FileSystemHandle): Promise<string[] | null>;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/FileSystemDirectoryHandle/values) */
  values(): AsyncIterable<FileSystemHandle>;
}