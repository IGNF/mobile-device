/**
 * This class is a wrapper for the Capacitor Filesystem API.
 * The goal is to simplify and abstract common file operations for IGN mobile applications.
 *
 * See Capacitor documentation: https://capacitorjs.com/docs/apis/filesystem
 * Important note: The Filesystem API requires declaring the Apple Privacy Manifest when targeting iOS.
 */

import { Filesystem as CapacitorFilesystem, Directory, Encoding } from '@capacitor/filesystem';
import type {
  FileSystemAppendOptions,
  FileSystemCopyOptions,
  FileSystemDeleteOptions,
  FileSystemDirectory,
  FileSystemEntrySummary,
  FileSystemGetUriOptions,
  FileSystemListOptions,
  FileSystemMetadata,
  FileSystemCreateDirectoryOptions,
  FileSystemRemoveDirectoryOptions,
  FileSystemRenameOptions,
  FileSystemStatOptions,
  FileSystemReadOptions,
  FileSystemWriteOptions,
  FileEncoding,
} from './types';

export default class FileSystem {
  /**
   * Optional base directory to use when callers do not provide one explicitly.
   */
  public static defaultDirectory: FileSystemDirectory = 'DATA';

  /**
   * Maps our string-based directories to Capacitor's Directory enum values.
   * We use strings in our API to keep it simple, but Capacitor uses enums internally.
   */
  private static readonly DIRECTORY_MAP: Record<FileSystemDirectory, Directory> = {
    DOCUMENTS: Directory.Documents,
    DATA: Directory.Data,
    LIBRARY: Directory.Library,
    CACHE: Directory.Cache,
    EXTERNAL: Directory.External,
    EXTERNAL_STORAGE: Directory.ExternalStorage,
    EXTERNAL_CACHE: Directory.ExternalCache,
    LIBRARY_NO_CLOUD: Directory.Library,
    TEMPORARY: Directory.Cache,
  };

  /**
   * Maps our string-based encodings to Capacitor's Encoding enum values.
   * We use strings in our API to keep it simple, but Capacitor uses enums internally.
   */
  private static readonly ENCODING_MAP: Record<FileEncoding, Encoding> = {
    utf8: Encoding.UTF8,
    ascii: Encoding.ASCII,
    utf16: Encoding.UTF16,
    base64: Encoding.UTF8, // Capacitor doesn't have base64, use UTF8 as fallback
  };

  /**
   * Check current file system permissions (Android scoped storage).
   */
  public static async checkPermissions(): Promise<boolean> {
    const result = await CapacitorFilesystem.checkPermissions();
    return result.publicStorage === 'granted';
  }

  /**
   * Request file system permissions from the user (Android scoped storage).
   */
  public static async requestPermissions(): Promise<boolean> {
    const result = await CapacitorFilesystem.requestPermissions();
    return result.publicStorage === 'granted';
  }

  /**
   * Read the contents of a file and return the raw data payload.
  */
  public static async readFile(options: FileSystemReadOptions): Promise<string> {
    // Use default directory if none provided
    const directory = options.directory || this.defaultDirectory;
    
    // Convert string-based types to Capacitor enum types
    const capacitorDirectory = this.DIRECTORY_MAP[directory];
    const capacitorEncoding = options.encoding ? this.ENCODING_MAP[options.encoding] : undefined;
    
    const result = await CapacitorFilesystem.readFile({
      path: options.path,
      directory: capacitorDirectory,
      encoding: capacitorEncoding,
    });
    
    return typeof result.data === 'string' ? result.data : await result.data.text();
  }

  /**
   * Write data to a file, creating parent directories when needed.
   */
  public static async writeFile(options: FileSystemWriteOptions): Promise<string> {
    // Use default directory if none provided
    const directory = options.directory || this.defaultDirectory;
    
    // Convert string-based types to Capacitor enum types
    const capacitorDirectory = this.DIRECTORY_MAP[directory];
    const capacitorEncoding = options.encoding ? this.ENCODING_MAP[options.encoding] : undefined;
    
    const result = await CapacitorFilesystem.writeFile({
      path: options.path,
      data: options.data as string,
      directory: capacitorDirectory,
      encoding: capacitorEncoding,
      recursive: options.recursive, // create any missing parent directories if true
    });
    return result.uri;
  }

  /**
   * Append data to an existing file, creating the file if it is missing.
   */
  public static async appendFile(options: FileSystemAppendOptions): Promise<boolean> {
    // Use default directory if none provided
    const directory = options.directory || this.defaultDirectory;
    
    // Convert string-based types to Capacitor enum types
    const capacitorDirectory = this.DIRECTORY_MAP[directory];
    const capacitorEncoding = options.encoding ? this.ENCODING_MAP[options.encoding] : undefined;
    
    await CapacitorFilesystem.appendFile({
      path: options.path,
      data: options.data as string,
      directory: capacitorDirectory,
      encoding: capacitorEncoding,
    });
    return true;
  }

  /**
   * Delete the file located at the provided path.
   */
  public static async deleteFile(options: FileSystemDeleteOptions): Promise<boolean> {
    // Use default directory if none provided
    const directory = options.directory || this.defaultDirectory;
    const capacitorDirectory = this.DIRECTORY_MAP[directory];
    
    await CapacitorFilesystem.deleteFile({
      path: options.path,
      directory: capacitorDirectory,
    });
    return true;
  }

  /**
   * Retrieve metadata about a file or directory (size, timestamps, etc.).
   */
  public static async stat(options: FileSystemStatOptions): Promise<FileSystemMetadata> {
    // Use default directory if none provided
    const directory = options.directory || this.defaultDirectory;
    const capacitorDirectory = this.DIRECTORY_MAP[directory];
    
    const result = await CapacitorFilesystem.stat({
      path: options.path,
      directory: capacitorDirectory,
    });
    
    return {
      name: result.uri.split('/').pop() || '',
      uri: result.uri,
      size: result.size,
      modifiedAt: result.mtime,
      createdAt: result.ctime,
      isDirectory: result.type === 'directory',
    };
  }

  /**
   * Compute the Capacitor file URI for a given path and directory.
   */
  public static async getUri(options: FileSystemGetUriOptions): Promise<string> {
    // Use default directory if none provided
    const directory = options.directory || this.defaultDirectory;
    const capacitorDirectory = this.DIRECTORY_MAP[directory];
    
    const result = await CapacitorFilesystem.getUri({
      path: options.path,
      directory: capacitorDirectory,
    });
    return result.uri;
  }

  /**
   * List the files and directories within a specific path.
   */
  public static async listDirectory(options: FileSystemListOptions): Promise<FileSystemEntrySummary[]> {
    // Use default directory if none provided
    const directory = options.directory || this.defaultDirectory;
    const capacitorDirectory = this.DIRECTORY_MAP[directory];
    
    const result = await CapacitorFilesystem.readdir({
      path: options.path,
      directory: capacitorDirectory,
    });
    
    return result.files.map(file => ({
      name: file.name,
      uri: file.uri,
      isDirectory: file.type === 'directory',
      size: file.size,
    }));
  }

  /**
   * Create a directory, optionally including missing parent folders.
   */
  public static async createDirectory(options: FileSystemCreateDirectoryOptions): Promise<boolean> {
    // Use default directory if none provided
    const directory = options.directory || this.defaultDirectory;
    const capacitorDirectory = this.DIRECTORY_MAP[directory];
    
    await CapacitorFilesystem.mkdir({
      path: options.path,
      directory: capacitorDirectory,
      recursive: options.recursive, // create any missing parent directories if true
    });
    return true;
  }

  /**
   * Remove a directory and, optionally, its nested contents.
   */
  public static async removeDirectory(options: FileSystemRemoveDirectoryOptions): Promise<boolean> {
    // Use default directory if none provided
    const directory = options.directory || this.defaultDirectory;
    const capacitorDirectory = this.DIRECTORY_MAP[directory];
    
    await CapacitorFilesystem.rmdir({
      path: options.path,
      directory: capacitorDirectory,
      recursive: options.recursive,
    });
    return true;
  }

  /**
   * Copy a file or directory to a new location.
   */
  public static async copy(options: FileSystemCopyOptions): Promise<string> {
    // Use default directory if none provided
    const fromDirectory = options.directory || this.defaultDirectory;
    const toDirectory = options.toDirectory || fromDirectory;
    
    const capacitorFromDirectory = this.DIRECTORY_MAP[fromDirectory];
    const capacitorToDirectory = this.DIRECTORY_MAP[toDirectory];
    
    const result = await CapacitorFilesystem.copy({
      from: options.from,
      to: options.to,
      directory: capacitorFromDirectory,
      toDirectory: capacitorToDirectory,
    });
    return result.uri;
  }

  /**
   * Move or rename a file or directory.
   */
  public static async rename(options: FileSystemRenameOptions): Promise<string> {
    // Use default directory if none provided
    const fromDirectory = options.directory || this.defaultDirectory;
    const toDirectory = options.toDirectory || fromDirectory;
    
    const capacitorFromDirectory = this.DIRECTORY_MAP[fromDirectory];
    const capacitorToDirectory = this.DIRECTORY_MAP[toDirectory];
    
    await CapacitorFilesystem.rename({
      from: options.from,
      to: options.to,
      directory: capacitorFromDirectory,
      toDirectory: capacitorToDirectory,
    });
    
    // Capacitor's rename doesn't return a uri, so we need to get it ourselves
    const uri = await this.getUri({
      path: options.to,
      directory: toDirectory,
    });
    return uri;
  }

  /**
   * Determine whether the provided path resolves to a local file URI.
   */
  public static isLocalFile(path: string): boolean {
    // Check for common local file URI schemes
    return (
      path.startsWith('file://') ||
      path.startsWith('content://') ||
      path.startsWith('capacitor://') ||
      (!path.startsWith('http://') && !path.startsWith('https://'))
    );
  }

  /**
   * Return the file extension (without the leading dot) for a given path.
   * Example: 'document.pdf' returns 'pdf'
   */
  public static getFileExtension(path: string): string {
    const fileName = this.getFileName(path);
    const lastDot = fileName.lastIndexOf('.');
    
    // No extension or ends with a dot
    if (lastDot === -1 || lastDot === fileName.length - 1) {
      return '';
    }
    
    return fileName.substring(lastDot + 1);
  }

  /**
   * Return the final segment (filename) from a provided path string.
   * Example: '/path/to/file.txt' returns 'file.txt'
   */
  public static getFileName(path: string): string {
    // Remove trailing slashes
    const cleanPath = path.replace(/\/+$/, '');
    
    // Get the last segment after the final slash
    const lastSlash = cleanPath.lastIndexOf('/');
    return lastSlash === -1 ? cleanPath : cleanPath.substring(lastSlash + 1);
  }
}
