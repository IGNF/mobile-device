/**
 * @ign/mobile-device
 * Capacitor device API wrappers for IGN mobile applications
 */

// Export classes
export { default as Storage } from './storage/Storage';
export { default as Device } from './device/Device';
export { default as Network } from './network/Network';
export { default as FileSystem } from './filesystem/FileSystem';

// Export types for FileSystem
export type {
  FileSystemDirectory,
  FileEncoding,
  FileSystemReadOptions,
  FileSystemWriteOptions,
  FileSystemAppendOptions,
  FileSystemDeleteOptions,
  FileSystemCreateDirectoryOptions,
  FileSystemRemoveDirectoryOptions,
  FileSystemListOptions,
  FileSystemCopyOptions,
  FileSystemRenameOptions,
  FileSystemStatOptions,
  FileSystemGetUriOptions,
  FileSystemMetadata,
  FileSystemEntrySummary,
} from './filesystem/types';

// Export types for Network (if any exist in Network.ts)
// Add other type exports as needed when you add more modules
