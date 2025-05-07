import { default as Transport } from '@ledgerhq/hw-transport';
import { CommonResponse, AppInfoResponse, VersionResponse, PublicKeyResponse, DeviceInfoResponse, SignResponse } from './types';
export default class InitiaApp {
    private transport;
    private info;
    private version;
    constructor(transport?: Transport);
    static serializeHRP(hrp: string): Buffer;
    static getBech32FromPK(hrp: string, pk: Buffer): string;
    private validateCompatibility;
    initialize(): Promise<CommonResponse | undefined>;
    getInfo(): AppInfoResponse;
    getVersion(): VersionResponse;
    getDeviceInfo(): Promise<DeviceInfoResponse>;
    getPublicKey(path: number[]): Promise<PublicKeyResponse>;
    getAddressAndPubKey(path: number[], hrp: string): Promise<PublicKeyResponse>;
    showAddressAndPubKey(path: number[], hrp: string): Promise<PublicKeyResponse>;
    sign(path: number[], message: Buffer): Promise<SignResponse>;
}
