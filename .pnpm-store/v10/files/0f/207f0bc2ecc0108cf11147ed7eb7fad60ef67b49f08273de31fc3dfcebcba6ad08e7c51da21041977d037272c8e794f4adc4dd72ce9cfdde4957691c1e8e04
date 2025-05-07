import _m0 from "protobufjs/minimal";
export declare const protobufPackage = "ibc.applications.perm.v1";
/** ChannelState defines the channel state for the specific port-id:channel-id pair. */
export interface ChannelState {
    portId: string;
    channelId: string;
    /** admin is the address that controls the channel relayers */
    admin: string;
    relayers: string[];
}
export declare const ChannelState: {
    encode(message: ChannelState, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): ChannelState;
    fromJSON(object: any): ChannelState;
    toJSON(message: ChannelState): unknown;
    create(base?: DeepPartial<ChannelState>): ChannelState;
    fromPartial(object: DeepPartial<ChannelState>): ChannelState;
};
type Builtin = Date | Function | Uint8Array | string | number | boolean | bigint | undefined;
export type DeepPartial<T> = T extends Builtin ? T : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
export {};
