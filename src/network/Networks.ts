/**
 * This class is a wrapper for the Capacitor Network API
 * The goal is to simplify and abstract the usage of the Network API
 * 
 * See Capacitor documentation: https://capacitorjs.com/docs/apis/network
 */

import { ConnectionStatus, ConnectionType, Network } from '@capacitor/network';

export default class Networks {

  /**
   * Check if the device is connected to the network
   * @returns True if the device is connected to the network, false otherwise
   */
  public static async isConnected(): Promise<boolean> {
    return await Network.getStatus().then(status => status.connected);
  }

  /**
   * Get the type of connection the device is using
   * ConnectionType is one of 'wifi', 'cellular', 'none', 'unknown'
   * @returns The type of connection the device is using
   */
  public static async getConnectionType(): Promise<ConnectionType> {
    return await Network.getStatus().then(status => status.connectionType);
  }

  /**
   * Get the status of the network connection
   * ConnectionStatus is an object with the following properties:
   * - connected: boolean
   * - connectionType: ConnectionType
   * @returns The status of the network connection
   */
  public static async getStatus(): Promise<ConnectionStatus> {
    return await Network.getStatus();
  }

}