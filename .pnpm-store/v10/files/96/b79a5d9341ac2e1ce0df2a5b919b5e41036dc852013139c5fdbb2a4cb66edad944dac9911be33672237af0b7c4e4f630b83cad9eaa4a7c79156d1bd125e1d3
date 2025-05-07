import { default as Transport } from '@ledgerhq/hw-transport';
import { AccAddress, SignatureV2, SignDoc } from '../..';
import { Key } from '../Key';
import { AppInfoResponse, DeviceInfoResponse, PublicKeyResponse, VersionResponse } from './types';
declare global {
    interface Window {
        google: any;
    }
    interface Navigator {
        hid: any;
    }
}
export declare class LedgerError extends Error {
    constructor(message: string);
}
export declare class LedgerKey extends Key {
    private transport?;
    private app;
    private path;
    constructor(transport?: Transport | undefined);
    get accAddress(): AccAddress;
    static create(transport?: Transport, index?: number): Promise<LedgerKey>;
    private initialize;
    loadAccountDetails(): Promise<LedgerKey>;
    sign(message: Buffer): Promise<Buffer>;
    signWithKeccak256(): Promise<Buffer>;
    createSignature(_tx: SignDoc): Promise<SignatureV2>;
    getAppAddressAndPubKey(): Promise<PublicKeyResponse>;
    getAppInfo(): AppInfoResponse;
    getAppDeviceInfo(): Promise<DeviceInfoResponse>;
    getAppPublicKey(): Promise<PublicKeyResponse>;
    getAppVersion(): VersionResponse;
    showAddressAndPubKey(): Promise<PublicKeyResponse>;
}
