/**
 * This class is a wrapper for the Capacitor Preferences API.
 * The goal is to simplify and abstract common storage operations for IGN mobile applications.
 *
 * See Capacitor documentation: https://capacitorjs.com/docs/apis/preferences
 *
 * Note:
 * - It might add some complexity for no reason - we could just user Preferences API directly
 */
/**
 * Storage operations wrapper for Capacitor
 * Replaces localStorage with Capacitor Preferences
 * Allow the use of different types of values instead of only strings
 */
export default class Storage {
    /**
     * Set a value
     * @param key - The key to store the value under
     * @param value - The value to store
     * @param type - The type of the value
     */
    static set(key: string, value: any, type?: 'string' | 'object' | 'boolean' | 'number' | 'array' | 'date'): Promise<void>;
    /**
     * Get a value
     * @param key - The key to get the value from
     * @param type - The type of the value - if not provided, the value will be returned as is (a string)
     * @returns The value
     */
    static get(key: string, type?: 'string' | 'object' | 'boolean' | 'number' | 'array' | 'date'): Promise<any | null>;
    /**
     * Remove a value
     * @param key - The key to remove the value from
     */
    static remove(key: string): Promise<void>;
    /**
     * Get all keys
     * @returns All keys
     */
    static keys(): Promise<string[]>;
    /**
     * Check if a key exists
     * @param key - The key to check
     * @returns True if the key exists, false otherwise
     */
    static has(key: string): Promise<boolean>;
    /**
     * Clear all values
     */
    static clear(): Promise<void>;
}
//# sourceMappingURL=Storage.d.ts.map