/**
 * 
 * See Capacitor documentation: https://capacitorjs.com/docs/apis/preferences
 */

import { Preferences } from '@capacitor/preferences';

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
  static async set(key: string, value: any, type?: 'string' | 'object' | 'boolean' | 'number' | 'array' | 'date'): Promise<void> {
    if (!type) { // auto-detect type if not provided
      if (typeof value === 'string') type = 'string';
      else if (typeof value === 'boolean') type = 'boolean';
      else if (typeof value === 'number') type = 'number';
      else if (Array.isArray(value)) type = 'array';
      else if (value instanceof Date) type = 'date';
      else type = 'object';
    }

    // serialize value based on type
    let serializedValue: string;
    switch (type) {
      case 'string':
        serializedValue = value;
        break;
      case 'boolean':
        serializedValue = value.toString();
        break;
      case 'number':
        serializedValue = value.toString();
        break;
      case 'date':
        serializedValue = value instanceof Date ? value.toISOString() : new Date(value).toISOString();
        break;
      case 'array':
      case 'object':
        serializedValue = JSON.stringify(value);
        break;
    }

    await Preferences.set({ key, value: serializedValue });
  }

  /**
   * Get a value
   * @param key - The key to get the value from
   * @param type - The type of the value - if not provided, the value will be returned as is (a string)
   * @returns The value
   */
  static async get(key: string, type?: 'string' | 'object' | 'boolean' | 'number' | 'array' | 'date'): Promise<any | null> {
    const result = await Preferences.get({ key });
    if (!result.value) return null;

    // If no type specified or type is string, return raw value
    if (!type || type === 'string') {
      return result.value;
    }

    // Deserialize based on type
    switch (type) {
      case 'boolean':
        return result.value === 'true';
      case 'number':
        return parseFloat(result.value);
      case 'date':
        return new Date(result.value);
      case 'array':
      case 'object':
        try {
          return JSON.parse(result.value);
        } catch (e) {
          return null;
        }
      default:
        return result.value;
    }
  }

  /**
   * Remove a value
   * @param key - The key to remove the value from
   */
  static async remove(key: string): Promise<void> {
    await Preferences.remove({ key });
  }

  /**
   * Get all keys
   * @returns All keys
   */
  static async keys(): Promise<string[]> {
    return await Preferences.keys().then(result => result.keys);
  }

  /**
   * Check if a key exists
   * @param key - The key to check
   * @returns True if the key exists, false otherwise
   */
  static async has(key: string): Promise<boolean> {
    return await Preferences.keys().then(result => result.keys.includes(key));
  }

  /**
   * Clear all values
   */
  static async clear(): Promise<void> {
    await Preferences.clear();
  }

}