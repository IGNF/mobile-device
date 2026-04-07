/**
 * This class is a wrapper for the Capacitor Network API
 * The goal is to simplify and abstract the usage of the Network API
 * 
 * See Capacitor documentation: https://capacitorjs.com/docs/apis/network
 */

import { PluginListenerHandle } from '@capacitor/core';
import { ConnectionStatus, ConnectionType, Network as CapacitorNetwork } from '@capacitor/network';

export default class Network {

  /**
   * Check if the device is connected to the network
   * @returns True if the device is connected to the network, false otherwise
   */
  public static async isConnected(): Promise<boolean> {
    return await CapacitorNetwork.getStatus().then(status => status.connected);
  }

  /**
   * Get the type of connection the device is using
   * ConnectionType is one of 'wifi', 'cellular', 'none', 'unknown'
   * @returns The type of connection the device is using
   */
  public static async getConnectionType(): Promise<ConnectionType> {
    return await CapacitorNetwork.getStatus().then(status => status.connectionType);
  }

  /**
   * Get the status of the network connection
   * ConnectionStatus is an object with the following properties:
   * - connected: boolean
   * - connectionType: ConnectionType
   * @returns The status of the network connection
   */
  public static async getStatus(): Promise<ConnectionStatus> {
    return await CapacitorNetwork.getStatus();
  }

  /**
   * Watch for changes in the network connection
   * @param callback The callback to call when the network connection changes
   * @returns The listener handle
   */
  public static async watch(callback: (status: ConnectionStatus) => void): Promise<PluginListenerHandle> {
    return await CapacitorNetwork.addListener('networkStatusChange', (status: ConnectionStatus) => {
      callback(status);
    });
  }

  /**
   * Unwatch for changes in the network connection
   * @param listener The listener to unsubscribe from
   */
  public static async unwatch(listener: PluginListenerHandle): Promise<void> {
    await listener.remove();
  }

}