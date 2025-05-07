import _m0 from "protobufjs/minimal";
import { BaseAccount } from "../../../cosmos/auth/v1beta1/auth";
export declare const protobufPackage = "noble.forwarding.v1";
export interface ForwardingAccount {
    baseAccount?: BaseAccount | undefined;
    channel: string;
    recipient: string;
    createdAt: bigint;
    fallback: string;
}
export interface ForwardingPubKey {
    key: Uint8Array;
}
export declare const ForwardingAccount: {
    encode(message: ForwardingAccount, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): ForwardingAccount;
    fromJSON(object: any): ForwardingAccount;
    toJSON(message: ForwardingAccount): unknown;
    create(base?: DeepPartial<ForwardingAccount>): ForwardingAccount;
    fromPartial(object: DeepPartial<ForwardingAccount>): ForwardingAccount;
};
export declare const ForwardingPubKey: {
    encode(message: ForwardingPubKey, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): ForwardingPubKey;
    fromJSON(object: any): ForwardingPubKey;
    toJSON(message: ForwardingPubKey): unknown;
    create(base?: DeepPartial<ForwardingPubKey>): ForwardingPubKey;
    fromPartial(object: DeepPartial<ForwardingPubKey>): ForwardingPubKey;
};
type Builtin = Date | Function | Uint8Array | string | number | boolean | bigint | undefined;
export type DeepPartial<T> = T extends Builtin ? T : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
export {};
