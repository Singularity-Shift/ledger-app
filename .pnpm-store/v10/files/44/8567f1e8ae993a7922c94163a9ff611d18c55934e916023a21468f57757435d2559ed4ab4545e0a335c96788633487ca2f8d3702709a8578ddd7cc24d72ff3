import _m0 from "protobufjs/minimal";
import { Coin, DecCoin } from "../../../cosmos/base/v1beta1/coin";
import { Any } from "../../../google/protobuf/any";
import { ValidatorUpdate } from "../../../tendermint/abci/types";
import { BridgeConfig } from "../../ophost/v1/types";
export declare const protobufPackage = "opinit.opchild.v1";
/** ResponseResultType defines the possible outcomes of the execution of a message */
export declare enum ResponseResultType {
    /** RESPONSE_RESULT_TYPE_UNSPECIFIED - Default zero value enumeration */
    RESPONSE_RESULT_TYPE_UNSPECIFIED = 0,
    /** RESPONSE_RESULT_TYPE_NOOP - The message did not execute msg operation (because, for example, deposit had already been finalized) */
    RESPONSE_RESULT_TYPE_NOOP = 1,
    /** RESPONSE_RESULT_TYPE_SUCCESS - The message was executed successfully */
    RESPONSE_RESULT_TYPE_SUCCESS = 2,
    UNRECOGNIZED = -1
}
export declare function responseResultTypeFromJSON(object: any): ResponseResultType;
export declare function responseResultTypeToJSON(object: ResponseResultType): string;
/** Params defines the set of opchild parameters. */
export interface Params {
    /** max_validators is the maximum number of validators. */
    maxValidators: number;
    /** historical_entries is the number of historical entries to persist. */
    historicalEntries: number;
    minGasPrices: DecCoin[];
    /**
     * the account address of bridge executor who can execute permissioned bridge
     * messages.
     */
    bridgeExecutors: string[];
    /** the account address of admin who can execute permissioned cosmos messages. */
    admin: string;
    /** the list of addresses that are allowed to pay zero fee. */
    feeWhitelist: string[];
    /** Max gas for hook execution of `MsgFinalizeTokenDeposit` */
    hookMaxGas: bigint;
}
/**
 * Validator defines a validator, together with the total amount of the
 * Validator's bond shares and their exchange rate to coins. Slashing results in
 * a decrease in the exchange rate, allowing correct calculation of future
 * undelegations without iterating over delegators. When coins are delegated to
 * this validator, the validator is credited with a delegation whose number of
 * bond shares is based on the amount of coins delegated divided by the current
 * exchange rate. Voting power can be calculated as total bonded shares
 * multiplied by exchange rate.
 */
export interface Validator {
    moniker: string;
    /**
     * operator_address defines the address of the validator's operator;
     * bech encoded in JSON.
     */
    operatorAddress: string;
    /**
     * consensus_pubkey is the consensus public key of the validator,
     * as a Protobuf Any.
     */
    consensusPubkey?: Any | undefined;
    consPower: bigint;
}
/**
 * ValidatorUpdates defines an array of abci.ValidatorUpdate objects.
 * TODO: explore moving this to proto/cosmos/base to separate modules
 * from tendermint dependence
 */
export interface ValidatorUpdates {
    updates: ValidatorUpdate[];
}
/** BridgeInfo defines the information of the bridge. */
export interface BridgeInfo {
    /** bridge id is the unique identifier of the bridge which is assigned from l1. */
    bridgeId: bigint;
    /** bridge_addr is the address of the bridge on l1. */
    bridgeAddr: string;
    /** l1_chain_id is the chain id of the l1 chain. */
    l1ChainId: string;
    /**
     * l1_client_id is the IBC client ID, which is allocated for l1 chain, in l2 chain state.
     * This is used to verify the validator set in oracle update messages.
     */
    l1ClientId: string;
    /** bridge_config is the configuration of the bridge. */
    bridgeConfig?: BridgeConfig | undefined;
}
/** CoinsWrapper defines the set of coins. */
export interface CoinsWrapper {
    coins: Coin[];
}
export interface DenomPair {
    denom: string;
    baseDenom: string;
}
export declare const Params: {
    encode(message: Params, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): Params;
    fromJSON(object: any): Params;
    toJSON(message: Params): unknown;
    create<I extends Exact<DeepPartial<Params>, I>>(base?: I): Params;
    fromPartial<I extends Exact<DeepPartial<Params>, I>>(object: I): Params;
};
export declare const Validator: {
    encode(message: Validator, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): Validator;
    fromJSON(object: any): Validator;
    toJSON(message: Validator): unknown;
    create<I extends Exact<DeepPartial<Validator>, I>>(base?: I): Validator;
    fromPartial<I extends Exact<DeepPartial<Validator>, I>>(object: I): Validator;
};
export declare const ValidatorUpdates: {
    encode(message: ValidatorUpdates, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): ValidatorUpdates;
    fromJSON(object: any): ValidatorUpdates;
    toJSON(message: ValidatorUpdates): unknown;
    create<I extends Exact<DeepPartial<ValidatorUpdates>, I>>(base?: I): ValidatorUpdates;
    fromPartial<I extends Exact<DeepPartial<ValidatorUpdates>, I>>(object: I): ValidatorUpdates;
};
export declare const BridgeInfo: {
    encode(message: BridgeInfo, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): BridgeInfo;
    fromJSON(object: any): BridgeInfo;
    toJSON(message: BridgeInfo): unknown;
    create<I extends Exact<DeepPartial<BridgeInfo>, I>>(base?: I): BridgeInfo;
    fromPartial<I extends Exact<DeepPartial<BridgeInfo>, I>>(object: I): BridgeInfo;
};
export declare const CoinsWrapper: {
    encode(message: CoinsWrapper, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): CoinsWrapper;
    fromJSON(object: any): CoinsWrapper;
    toJSON(message: CoinsWrapper): unknown;
    create<I extends Exact<DeepPartial<CoinsWrapper>, I>>(base?: I): CoinsWrapper;
    fromPartial<I extends Exact<DeepPartial<CoinsWrapper>, I>>(object: I): CoinsWrapper;
};
export declare const DenomPair: {
    encode(message: DenomPair, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): DenomPair;
    fromJSON(object: any): DenomPair;
    toJSON(message: DenomPair): unknown;
    create<I extends Exact<DeepPartial<DenomPair>, I>>(base?: I): DenomPair;
    fromPartial<I extends Exact<DeepPartial<DenomPair>, I>>(object: I): DenomPair;
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
