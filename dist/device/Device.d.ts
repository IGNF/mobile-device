/**
 * This class is a wrapper for the Capacitor Device API and the KeepAwake plugin
 * The goal is to simplify and abstract the usage of the Device API and the KeepAwake plugin
 *
 * See Capacitor documentation: https://capacitorjs.com/docs/apis/device
*/
import { DeviceInfo } from '@capacitor/device';
export default class Device {
    /**
     * Device methods
     */
    /**
     * Get the device id
     * @returns The device id
     */
    static getDeviceId(): Promise<string>;
    /**
     * Get the device info
     * @returns The device info (see DeviceInfo interface)
     */
    static getDeviceInfo(): Promise<DeviceInfo>;
    /**
     * Check if the device is mobile
     * @returns True if the device is mobile, false otherwise (web)
     */
    static isDeviceMobile(): Promise<boolean>;
    /**
     * Check if the device is iOS
     * @returns True if the device is iOS, false otherwise
     */
    static isDeviceIOS(): Promise<boolean>;
    /**
     * Check if the device is Android
     * @returns True if the device is Android, false otherwise
     */
    static isDeviceAndroid(): Promise<boolean>;
    /**
     * Check if the device is an emulator
     * @returns True if the device is an emulator, false otherwise
     */
    static isDeviceEmulator(): Promise<boolean>;
    /**
     * Awake methods
     */
    /**
     * Keep the screen awake
     * Used to prevent the screen from dimming or turning off
     */
    static keepAwake(): Promise<void>;
    /**
     * Allow the screen to sleep
     * Used to allow the screen to dim or turn off
     */
    static allowSleep(): Promise<void>;
    /**
     * Check if the screen is kept awake
     * @returns True if the screen is kept awake, false otherwise
     */
    static isKeptAwake(): Promise<boolean>;
}
//# sourceMappingURL=Device.d.ts.map