import _m0 from "protobufjs/minimal";
import { Coin } from "../../../cosmos/base/v1beta1/coin";
import { Duration } from "../../../google/protobuf/duration";
export declare const protobufPackage = "opinit.ophost.v1";
/** Params defines the set of ophost parameters. */
export interface Params {
    /** The amount to be paid by l2 creator. */
    registrationFee: Coin[];
}
/** BridgeConfig defines the set of bridge config. */
export interface BridgeConfig {
    /** The address of the challenger. */
    challenger: string;
    /** The address of the proposer. */
    proposer: string;
    /** The information about batch submission. */
    batchInfo?: BatchInfo | undefined;
    /**
     * The time interval at which checkpoints must be submitted.
     * NOTE: this param is currently not used, but will be used for challenge in future.
     */
    submissionInterval?: Duration | undefined;
    /** The minium time duration that must elapse before a withdrawal can be finalized. */
    finalizationPeriod?: Duration | undefined;
    /** The the first l2 block will be recorded on l1. */
    submissionStartHeight: bigint;
    /** oracle_enabled is a flag to enable oracle. */
    oracleEnabled: boolean;
    /** Normally it is IBC channelID for permissioned IBC relayer. */
    metadata: Uint8Array;
}
/** BatchInfo defines the set of batch information. */
export interface BatchInfo {
    /** The address of the batch submitter. */
    submitter: string;
    /** The target chain type. */
    chainType: BatchInfo_ChainType;
}
/** ChainType defines the type of chain. */
export declare enum BatchInfo_ChainType {
    /** CHAIN_TYPE_UNSPECIFIED - Unspecified chain type. */
    CHAIN_TYPE_UNSPECIFIED = 0,
    /** CHAIN_TYPE_INITIA - The chain type of the initia chain. */
    CHAIN_TYPE_INITIA = 1,
    /** CHAIN_TYPE_CELESTIA - The chain type of the celestia chain. */
    CHAIN_TYPE_CELESTIA = 2,
    UNRECOGNIZED = -1
}
export declare function batchInfo_ChainTypeFromJSON(object: any): BatchInfo_ChainType;
export declare function batchInfo_ChainTypeToJSON(object: BatchInfo_ChainType): string;
/** TokenPair defines l1 and l2 token pair */
export interface TokenPair {
    l1Denom: string;
    l2Denom: string;
}
/** Output is a l2 block submitted by proposer. */
export interface Output {
    /** Hash of the l2 output. */
    outputRoot: Uint8Array;
    /** The l1 block number that the output root was submitted in. */
    l1BlockNumber: bigint;
    /** Timestamp of the l1 block that the output root was submitted in. */
    l1BlockTime?: Date | undefined;
    /** The l2 block number that the output root was submitted in. */
    l2BlockNumber: bigint;
}
/** BatchInfoWithOutput defines the batch information with output. */
export interface BatchInfoWithOutput {
    batchInfo?: BatchInfo | undefined;
    output?: Output | undefined;
}
export declare const Params: {
    encode(message: Params, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): Params;
    fromJSON(object: any): Params;
    toJSON(message: Params): unknown;
    create<I extends Exact<DeepPartial<Params>, I>>(base?: I): Params;
    fromPartial<I extends Exact<DeepPartial<Params>, I>>(object: I): Params;
};
export declare const BridgeConfig: {
    encode(message: BridgeConfig, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): BridgeConfig;
    fromJSON(object: any): BridgeConfig;
    toJSON(message: BridgeConfig): unknown;
    create<I extends Exact<DeepPartial<BridgeConfig>, I>>(base?: I): BridgeConfig;
    fromPartial<I extends Exact<DeepPartial<BridgeConfig>, I>>(object: I): BridgeConfig;
};
export declare const BatchInfo: {
    encode(message: BatchInfo, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): BatchInfo;
    fromJSON(object: any): BatchInfo;
    toJSON(message: BatchInfo): unknown;
    create<I extends Exact<DeepPartial<BatchInfo>, I>>(base?: I): BatchInfo;
    fromPartial<I extends Exact<DeepPartial<BatchInfo>, I>>(object: I): BatchInfo;
};
export declare const TokenPair: {
    encode(message: TokenPair, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): TokenPair;
    fromJSON(object: any): TokenPair;
    toJSON(message: TokenPair): unknown;
    create<I extends Exact<DeepPartial<TokenPair>, I>>(base?: I): TokenPair;
    fromPartial<I extends Exact<DeepPartial<TokenPair>, I>>(object: I): TokenPair;
};
export declare const Output: {
    encode(message: Output, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): Output;
    fromJSON(object: any): Output;
    toJSON(message: Output): unknown;
    create<I extends Exact<DeepPartial<Output>, I>>(base?: I): Output;
    fromPartial<I extends Exact<DeepPartial<Output>, I>>(object: I): Output;
};
export declare const BatchInfoWithOutput: {
    encode(message: BatchInfoWithOutput, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): BatchInfoWithOutput;
    fromJSON(object: any): BatchInfoWithOutput;
    toJSON(message: BatchInfoWithOutput): unknown;
    create<I extends Exact<DeepPartial<BatchInfoWithOutput>, I>>(base?: I): BatchInfoWithOutput;
    fromPartial<I extends Exact<DeepPartial<BatchInfoWithOutput>, I>>(object: I): BatchInfoWithOutput;
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
