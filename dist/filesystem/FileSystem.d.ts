/**
 * This class is a wrapper for the Capacitor Filesystem API.
 * The goal is to simplify and abstract common file operations for IGN mobile applications.
 *
 * See Capacitor documentation: https://capacitorjs.com/docs/apis/filesystem
 * Important note: The Filesystem API requires declaring the Apple Privacy Manifest when targeting iOS.
 */
import type { FileSystemAppendOptions, FileSystemCopyOptions, FileSystemDeleteOptions, FileSystemDirectory, FileSystemEntrySummary, FileSystemGetUriOptions, FileSystemListOptions, FileSystemMetadata, FileSystemCreateDirectoryOptions, FileSystemRemoveDirectoryOptions, FileSystemRenameOptions, FileSystemStatOptions, FileSystemReadOptions, FileSystemWriteOptions } from './types';
export default class FileSystem {
    /**
     * Optional base directory to use when callers do not provide one explicitly.
     */
    static defaultDirectory: FileSystemDirectory;
    /**
     * Maps our string-based directories to Capacitor's Directory enum values.
     * We use strings in our API to keep it simple, but Capacitor uses enums internally.
     */
    private static readonly DIRECTORY_MAP;
    /**
     * Maps our string-based encodings to Capacitor's Encoding enum values.
     * We use strings in our API to keep it simple, but Capacitor uses enums internally.
     */
    private static readonly ENCODING_MAP;
    private static getCapacitorDirectory;
    private static getCapacitorEncoding;
    private static stripDataUrlPrefix;
    private static blobToBase64;
    /**
     * Check current file system permissions (Android scoped storage).
     */
    static checkPermissions(): Promise<boolean>;
    /**
     * Request file system permissions from the user (Android scoped storage).
     */
    static requestPermissions(): Promise<boolean>;
    /**
     * Read the contents of a file and return the raw data payload.
    */
    static readFile(options: FileSystemReadOptions): Promise<string>;
    /**
     * Write data to a file, creating parent directories when needed.
     */
    static writeFile(options: FileSystemWriteOptions): Promise<string>;
    /**
     * Append data to an existing file, creating the file if it is missing.
     */
    static appendFile(options: FileSystemAppendOptions): Promise<boolean>;
    /**
     * Delete the file located at the provided path.
     */
    static deleteFile(options: FileSystemDeleteOptions): Promise<boolean>;
    /**
     * Retrieve metadata about a file or directory (size, timestamps, etc.).
     */
    static stat(options: FileSystemStatOptions): Promise<FileSystemMetadata>;
    /**
     * Compute the Capacitor file URI for a given path and directory.
     */
    static getUri(options: FileSystemGetUriOptions): Promise<string>;
    /**
     * List the files and directories within a specific path.
     */
    static listDirectory(options: FileSystemListOptions): Promise<FileSystemEntrySummary[]>;
    /**
     * Create a directory, optionally including missing parent folders.
     */
    static createDirectory(options: FileSystemCreateDirectoryOptions): Promise<boolean>;
    /**
     * Remove a directory and, optionally, its nested contents.
     */
    static removeDirectory(options: FileSystemRemoveDirectoryOptions): Promise<boolean>;
    /**
     * Copy a file or directory to a new location.
     */
    static copy(options: FileSystemCopyOptions): Promise<string>;
    /**
     * Move or rename a file or directory.
     */
    static rename(options: FileSystemRenameOptions): Promise<string>;
    /**
     * Determine whether the provided path resolves to a local file URI.
     */
    static isLocalFile(path: string): boolean;
    /**
     * Return the file extension (without the leading dot) for a given path.
     * Example: 'document.pdf' returns 'pdf'
     */
    static getFileExtension(path: string): string;
    /**
     * Return the final segment (filename) from a provided path string.
     * Example: '/path/to/file.txt' returns 'file.txt'
     */
    static getFileName(path: string): string;
}
//# sourceMappingURL=FileSystem.d.ts.map