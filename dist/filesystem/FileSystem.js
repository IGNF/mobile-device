/**
 * This class is a wrapper for the Capacitor Filesystem API.
 * The goal is to simplify and abstract common file operations for IGN mobile applications.
 *
 * See Capacitor documentation: https://capacitorjs.com/docs/apis/filesystem
 * Important note: The Filesystem API requires declaring the Apple Privacy Manifest when targeting iOS.
 */
import { Filesystem as CapacitorFilesystem, Directory, Encoding } from '@capacitor/filesystem';
class FileSystem {
    static getCapacitorDirectory(optionDirectory) {
        const directory = optionDirectory || this.defaultDirectory;
        return this.DIRECTORY_MAP[directory];
    }
    /**
     * Check current file system permissions (Android scoped storage).
     */
    static async checkPermissions() {
        const result = await CapacitorFilesystem.checkPermissions();
        return result.publicStorage === 'granted';
    }
    /**
     * Request file system permissions from the user (Android scoped storage).
     */
    static async requestPermissions() {
        const result = await CapacitorFilesystem.requestPermissions();
        return result.publicStorage === 'granted';
    }
    /**
     * Read the contents of a file and return the raw data payload.
    */
    static async readFile(options) {
        // Use default directory if none provided
        const capacitorDirectory = this.getCapacitorDirectory(options.directory);
        // Convert string-based types to Capacitor enum types
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
    static async writeFile(options) {
        // Use default directory if none provided
        const capacitorDirectory = this.getCapacitorDirectory(options.directory);
        const capacitorEncoding = options.encoding ? this.ENCODING_MAP[options.encoding] : undefined;
        const result = await CapacitorFilesystem.writeFile({
            path: options.path,
            data: options.data,
            directory: capacitorDirectory,
            encoding: capacitorEncoding,
            recursive: options.recursive, // create any missing parent directories if true
        });
        return result.uri;
    }
    /**
     * Append data to an existing file, creating the file if it is missing.
     */
    static async appendFile(options) {
        // Use default directory if none provided
        const capacitorDirectory = this.getCapacitorDirectory(options.directory);
        // Convert string-based types to Capacitor enum types
        const capacitorEncoding = options.encoding ? this.ENCODING_MAP[options.encoding] : undefined;
        await CapacitorFilesystem.appendFile({
            path: options.path,
            data: options.data,
            directory: capacitorDirectory,
            encoding: capacitorEncoding,
        });
        return true;
    }
    /**
     * Delete the file located at the provided path.
     */
    static async deleteFile(options) {
        // Use default directory if none provided
        const capacitorDirectory = this.getCapacitorDirectory(options.directory);
        await CapacitorFilesystem.deleteFile({
            path: options.path,
            directory: capacitorDirectory,
        });
        return true;
    }
    /**
     * Retrieve metadata about a file or directory (size, timestamps, etc.).
     */
    static async stat(options) {
        // Use default directory if none provided
        const capacitorDirectory = this.getCapacitorDirectory(options.directory);
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
    static async getUri(options) {
        // Use default directory if none provided
        const capacitorDirectory = this.getCapacitorDirectory(options.directory);
        const result = await CapacitorFilesystem.getUri({
            path: options.path,
            directory: capacitorDirectory,
        });
        return result.uri;
    }
    /**
     * List the files and directories within a specific path.
     */
    static async listDirectory(options) {
        // Use default directory if none provided
        const capacitorDirectory = this.getCapacitorDirectory(options.directory);
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
    static async createDirectory(options) {
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
    static async removeDirectory(options) {
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
    static async copy(options) {
        // Use default directory if none provided
        const fromDirectory = this.getCapacitorDirectory(options.directory);
        const toDirectory = this.getCapacitorDirectory(options.toDirectory);
        const capacitorFromDirectory = this.DIRECTORY_MAP[fromDirectory];
        const capacitorToDirectory = this.getCapacitorDirectory(toDirectory);
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
    static async rename(options) {
        // Use default directory if none provided
        const fromDirectory = this.getCapacitorDirectory(options.directory);
        const toDirectory = this.getCapacitorDirectory(options.toDirectory);
        const capacitorFromDirectory = this.DIRECTORY_MAP[fromDirectory];
        const capacitorToDirectory = this.getCapacitorDirectory(toDirectory);
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
    static isLocalFile(path) {
        // Check for common local file URI schemes
        return (path.startsWith('file://') ||
            path.startsWith('content://') ||
            path.startsWith('capacitor://') ||
            (!path.startsWith('http://') && !path.startsWith('https://')));
    }
    /**
     * Return the file extension (without the leading dot) for a given path.
     * Example: 'document.pdf' returns 'pdf'
     */
    static getFileExtension(path) {
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
    static getFileName(path) {
        // Remove trailing slashes
        const cleanPath = path.replace(/\/+$/, '');
        // Get the last segment after the final slash
        const lastSlash = cleanPath.lastIndexOf('/');
        return lastSlash === -1 ? cleanPath : cleanPath.substring(lastSlash + 1);
    }
}
/**
 * Optional base directory to use when callers do not provide one explicitly.
 */
FileSystem.defaultDirectory = 'DATA';
/**
 * Maps our string-based directories to Capacitor's Directory enum values.
 * We use strings in our API to keep it simple, but Capacitor uses enums internally.
 */
FileSystem.DIRECTORY_MAP = {
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
FileSystem.ENCODING_MAP = {
    utf8: Encoding.UTF8,
    ascii: Encoding.ASCII,
    utf16: Encoding.UTF16,
    base64: Encoding.UTF8, // Capacitor doesn't have base64, use UTF8 as fallback
};
export default FileSystem;
//# sourceMappingURL=FileSystem.js.map