import _m0 from "protobufjs/minimal";
import { ClassTrace, Params } from "./types";
export declare const protobufPackage = "ibc.applications.nft_transfer.v1";
/** GenesisState defines the ibc nft-transfer genesis state */
export interface GenesisState {
    portId: string;
    classTraces: ClassTrace[];
    classData: ClassData[];
    tokenData: TokenData[];
    params?: Params | undefined;
}
/**
 * ClassData contains the class trace hash and the class data
 * for genesis.
 */
export interface ClassData {
    traceHash: Uint8Array;
    data: string;
}
/**
 * TokenData contains the trace hash, token id, and the token data
 * for genesis.
 */
export interface TokenData {
    traceHash: Uint8Array;
    tokenId: string;
    data: string;
}
export declare const GenesisState: {
    encode(message: GenesisState, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): GenesisState;
    fromJSON(object: any): GenesisState;
    toJSON(message: GenesisState): unknown;
    create(base?: DeepPartial<GenesisState>): GenesisState;
    fromPartial(object: DeepPartial<GenesisState>): GenesisState;
};
export declare const ClassData: {
    encode(message: ClassData, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): ClassData;
    fromJSON(object: any): ClassData;
    toJSON(message: ClassData): unknown;
    create(base?: DeepPartial<ClassData>): ClassData;
    fromPartial(object: DeepPartial<ClassData>): ClassData;
};
export declare const TokenData: {
    encode(message: TokenData, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): TokenData;
    fromJSON(object: any): TokenData;
    toJSON(message: TokenData): unknown;
    create(base?: DeepPartial<TokenData>): TokenData;
    fromPartial(object: DeepPartial<TokenData>): TokenData;
};
type Builtin = Date | Function | Uint8Array | string | number | boolean | bigint | undefined;
export type DeepPartial<T> = T extends Builtin ? T : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
export {};
