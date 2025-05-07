import _m0 from "protobufjs/minimal";
import { BridgeInfo, DenomPair, Params, Validator } from "./types";
export declare const protobufPackage = "opinit.opchild.v1";
/** GenesisState defines the rollup module's genesis state. */
export interface GenesisState {
    /** params defines all the parameters of related to deposit. */
    params?: Params | undefined;
    /**
     * last_validator_powers is a special index that provides a historical list
     * of the last-block's bonded validators.
     */
    lastValidatorPowers: LastValidatorPower[];
    /** delegations defines the validator set at genesis. */
    validators: Validator[];
    nextL2Sequence: bigint;
    nextL1Sequence: bigint;
    bridgeInfo?: BridgeInfo | undefined;
    exported: boolean;
    denomPairs: DenomPair[];
}
/** LastValidatorPower required for validator set update logic. */
export interface LastValidatorPower {
    /** address is the address of the validator. */
    address: string;
    /** power defines the power of the validator. */
    power: bigint;
}
export declare const GenesisState: {
    encode(message: GenesisState, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): GenesisState;
    fromJSON(object: any): GenesisState;
    toJSON(message: GenesisState): unknown;
    create<I extends Exact<DeepPartial<GenesisState>, I>>(base?: I): GenesisState;
    fromPartial<I extends Exact<DeepPartial<GenesisState>, I>>(object: I): GenesisState;
};
export declare const LastValidatorPower: {
    encode(message: LastValidatorPower, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): LastValidatorPower;
    fromJSON(object: any): LastValidatorPower;
    toJSON(message: LastValidatorPower): unknown;
    create<I extends Exact<DeepPartial<LastValidatorPower>, I>>(base?: I): LastValidatorPower;
    fromPartial<I extends Exact<DeepPartial<LastValidatorPower>, I>>(object: I): LastValidatorPower;
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
