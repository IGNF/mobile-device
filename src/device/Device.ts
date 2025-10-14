/**
 * This class is a wrapper for the Capacitor Device API and the KeepAwake plugin
 * The goal is to simplify and abstract the usage of the Device API and the KeepAwake plugin
 * 
 * See Capacitor documentation: https://capacitorjs.com/docs/apis/device
*/

import { Device as CapacitorDevice, DeviceInfo } from '@capacitor/device';
import { KeepAwake } from '@capacitor-community/keep-awake';

export default class Device {

  /**
   * Device methods
   */

  /**
   * Get the device id
   * @returns The device id
   */
  public static async getDeviceId(): Promise<string> {
    return (await (CapacitorDevice.getId())).identifier;
  }

  /**
   * Get the device info
   * @returns The device info (see DeviceInfo interface)
   */
  public static async getDeviceInfo(): Promise<DeviceInfo> {
    return await CapacitorDevice.getInfo();
  }

  /**
   * Check if the device is mobile
   * @returns True if the device is mobile, false otherwise (web)
   */
  public static async isDeviceMobile(): Promise<boolean> {
    return await CapacitorDevice.getInfo().then(info => info.platform === 'ios' || info.platform === 'android');
  }

  /**
   * Check if the device is iOS
   * @returns True if the device is iOS, false otherwise
   */
  public static async isDeviceIOS(): Promise<boolean> {
    return await CapacitorDevice.getInfo().then(info => info.platform === 'ios');
  }

  /**
   * Check if the device is Android
   * @returns True if the device is Android, false otherwise
   */
  public static async isDeviceAndroid(): Promise<boolean> {
    return await CapacitorDevice.getInfo().then(info => info.platform === 'android');
  }

  /**
   * Check if the device is an emulator
   * @returns True if the device is an emulator, false otherwise
   */
  public static async isDeviceEmulator(): Promise<boolean> {
    return await CapacitorDevice.getInfo().then(info => info.isVirtual);
  }


  /**
   * Awake methods
   */

  /**
   * Keep the screen awake
   * Used to prevent the screen from dimming or turning off
   */
  public static async keepAwake(): Promise<void> {
    await KeepAwake.isSupported().then(async isSupported => {
      if (isSupported) {
        await KeepAwake.keepAwake();
      }
    });
  }

  /**
   * Allow the screen to sleep
   * Used to allow the screen to dim or turn off
   */
  public static async allowSleep(): Promise<void> {
    await KeepAwake.isSupported().then(async isSupported => {
      if (isSupported) {
        await KeepAwake.allowSleep();
      }
    });
  }

  /**
   * Check if the screen is kept awake
   * @returns True if the screen is kept awake, false otherwise
   */
  public static async isKeptAwake(): Promise<boolean> {
    return await KeepAwake.isKeptAwake().then(isKeptAwake => isKeptAwake.isKeptAwake);
  }

}