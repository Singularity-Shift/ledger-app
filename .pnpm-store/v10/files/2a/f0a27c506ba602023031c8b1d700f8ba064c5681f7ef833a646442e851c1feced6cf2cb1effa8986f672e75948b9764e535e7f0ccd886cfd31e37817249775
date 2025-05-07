import _m0 from "protobufjs/minimal";
import { BaseAccount } from "../../../cosmos/auth/v1beta1/auth";
export declare const protobufPackage = "opinit.ophost.v1";
/** BridgeAccount defines an account for bridge that holds coins without pubkey. */
export interface BridgeAccount {
    baseAccount?: BaseAccount | undefined;
}
export declare const BridgeAccount: {
    encode(message: BridgeAccount, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): BridgeAccount;
    fromJSON(object: any): BridgeAccount;
    toJSON(message: BridgeAccount): unknown;
    create<I extends Exact<DeepPartial<BridgeAccount>, I>>(base?: I): BridgeAccount;
    fromPartial<I extends Exact<DeepPartial<BridgeAccount>, I>>(object: I): BridgeAccount;
};
type Builtin = Date | Function | Uint8Array | string | number | boolean | bigint | undefined;
export type DeepPartial<T> = T extends Builtin ? T : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P : P & {
    [K in keyof P]: Exact<P[K], I[K]>;
} & {
    [K in Exclude<keyof I, KeysOfUnion<P>>]: never;
};
export {};
