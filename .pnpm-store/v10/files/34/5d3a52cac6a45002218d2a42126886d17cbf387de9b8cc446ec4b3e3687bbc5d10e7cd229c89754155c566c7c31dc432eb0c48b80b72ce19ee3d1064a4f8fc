import _m0 from "protobufjs/minimal";
import { ChannelState } from "./types";
export declare const protobufPackage = "ibc.applications.perm.v1";
/** GenesisState defines the ibc perm genesis state */
export interface GenesisState {
    channelStates: ChannelState[];
}
export declare const GenesisState: {
    encode(message: GenesisState, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): GenesisState;
    fromJSON(object: any): GenesisState;
    toJSON(message: GenesisState): unknown;
    create(base?: DeepPartial<GenesisState>): GenesisState;
    fromPartial(object: DeepPartial<GenesisState>): GenesisState;
};
type Builtin = Date | Function | Uint8Array | string | number | boolean | bigint | undefined;
export type DeepPartial<T> = T extends Builtin ? T : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
export {};
