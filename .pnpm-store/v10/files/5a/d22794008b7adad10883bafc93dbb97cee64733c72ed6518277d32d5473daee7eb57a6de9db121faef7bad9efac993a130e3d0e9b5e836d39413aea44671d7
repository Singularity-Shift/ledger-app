import _m0 from "protobufjs/minimal";
export declare const protobufPackage = "noble.forwarding.v1";
/** AccountRegistered is emitted whenever a new forwarding account is registered. */
export interface AccountRegistered {
    /** address is the address of the forwarding account. */
    address: string;
    /** channel is the channel id that funds are forwarded through. */
    channel: string;
    /** recipient is the address of the recipient of forwards. */
    recipient: string;
    /** fallback is the address of the fallback account. */
    fallback: string;
}
/** AccountCleared is emitted whenever a forwarding account is cleared. */
export interface AccountCleared {
    /** address is the address of the forwarding account. */
    address: string;
    /** recipient is the address of the fallback account. */
    recipient: string;
}
/** AllowedDenomsConfigured is emitted whenever the allowed denoms are updated. */
export interface AllowedDenomsConfigured {
    /** previous_denoms is the list of previously allowed denoms. */
    previousDenoms: string[];
    /** current_denoms is the list of currently allowed denoms. */
    currentDenoms: string[];
}
export declare const AccountRegistered: {
    encode(message: AccountRegistered, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): AccountRegistered;
    fromJSON(object: any): AccountRegistered;
    toJSON(message: AccountRegistered): unknown;
    create(base?: DeepPartial<AccountRegistered>): AccountRegistered;
    fromPartial(object: DeepPartial<AccountRegistered>): AccountRegistered;
};
export declare const AccountCleared: {
    encode(message: AccountCleared, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): AccountCleared;
    fromJSON(object: any): AccountCleared;
    toJSON(message: AccountCleared): unknown;
    create(base?: DeepPartial<AccountCleared>): AccountCleared;
    fromPartial(object: DeepPartial<AccountCleared>): AccountCleared;
};
export declare const AllowedDenomsConfigured: {
    encode(message: AllowedDenomsConfigured, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): AllowedDenomsConfigured;
    fromJSON(object: any): AllowedDenomsConfigured;
    toJSON(message: AllowedDenomsConfigured): unknown;
    create(base?: DeepPartial<AllowedDenomsConfigured>): AllowedDenomsConfigured;
    fromPartial(object: DeepPartial<AllowedDenomsConfigured>): AllowedDenomsConfigured;
};
type Builtin = Date | Function | Uint8Array | string | number | boolean | bigint | undefined;
export type DeepPartial<T> = T extends Builtin ? T : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
export {};
