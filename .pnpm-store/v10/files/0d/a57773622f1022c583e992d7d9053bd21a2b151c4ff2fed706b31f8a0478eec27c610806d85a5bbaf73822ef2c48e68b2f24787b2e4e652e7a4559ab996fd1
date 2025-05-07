import _m0 from "protobufjs/minimal";
import { MarketMap } from "./market";
import { Params } from "./params";
export declare const protobufPackage = "connect.marketmap.v2";
/** GenesisState defines the x/marketmap module's genesis state. */
export interface GenesisState {
    /**
     * MarketMap defines the global set of market configurations for all providers
     * and markets.
     */
    marketMap?: MarketMap | undefined;
    /**
     * LastUpdated is the last block height that the market map was updated.
     * This field can be used as an optimization for clients checking if there
     * is a new update to the map.
     */
    lastUpdated: bigint;
    /** Params are the parameters for the x/marketmap module. */
    params?: Params | undefined;
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
