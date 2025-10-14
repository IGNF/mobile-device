/**
 * Public types for the filesystem wrapper so consuming apps stay Capacitor-agnostic.
 */

export type FileSystemDirectory =
  | 'DOCUMENTS'
  | 'DATA'
  | 'LIBRARY'
  | 'CACHE'
  | 'EXTERNAL'
  | 'EXTERNAL_STORAGE'
  | 'EXTERNAL_CACHE'
  | 'LIBRARY_NO_CLOUD'
  | 'TEMPORARY';

export type FileEncoding = 'utf8' | 'ascii' | 'utf16' | 'base64';

export interface FileSystemReadOptions {
  path: string;
  directory?: FileSystemDirectory;
  encoding?: FileEncoding;
}

export interface FileSystemWriteOptions {
  path: string;
  data: string | Blob;
  directory?: FileSystemDirectory;
  encoding?: FileEncoding;
  recursive?: boolean;
}

export interface FileSystemAppendOptions {
  path: string;
  data: string | Blob;
  directory?: FileSystemDirectory;
  encoding?: FileEncoding;
}

export interface FileSystemDeleteOptions {
  path: string;
  directory?: FileSystemDirectory;
}

export interface FileSystemCreateDirectoryOptions {
  path: string;
  directory?: FileSystemDirectory;
  recursive?: boolean;
}

export interface FileSystemRemoveDirectoryOptions {
  path: string;
  directory?: FileSystemDirectory;
  recursive?: boolean;
}

export interface FileSystemListOptions {
  path: string;
  directory?: FileSystemDirectory;
}

export interface FileSystemCopyOptions {
  from: string;
  to: string;
  directory?: FileSystemDirectory;
  toDirectory?: FileSystemDirectory;
}

export interface FileSystemRenameOptions {
  from: string;
  to: string;
  directory?: FileSystemDirectory;
  toDirectory?: FileSystemDirectory;
}

export interface FileSystemStatOptions {
  path: string;
  directory?: FileSystemDirectory;
}

export interface FileSystemGetUriOptions {
  path: string;
  directory?: FileSystemDirectory;
}

export interface FileSystemMetadata {
  name: string;
  uri: string;
  size: number;
  modifiedAt: number;
  createdAt?: number;
  isDirectory: boolean;
}

export interface FileSystemEntrySummary {
  name: string;
  uri: string;
  isDirectory: boolean;
  size?: number;
}

export interface FileSystemReadFileInChunksOptions {
  path: string;
  directory?: FileSystemDirectory;
  encoding?: FileEncoding;
  chunkSize: number;
}

export interface FileSystemDownloadFileOptions {
  url: string;
  targetPath: string;
  directory?: FileSystemDirectory;
}