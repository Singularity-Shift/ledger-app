import _m0 from "protobufjs/minimal";
import { PublicKey } from "../crypto/keys";
export declare const protobufPackage = "tendermint.types";
/** BlockIdFlag indicates which BlockID the signature is for */
export declare enum BlockIDFlag {
    /** BLOCK_ID_FLAG_UNKNOWN - indicates an error condition */
    BLOCK_ID_FLAG_UNKNOWN = 0,
    /** BLOCK_ID_FLAG_ABSENT - the vote was not received */
    BLOCK_ID_FLAG_ABSENT = 1,
    /** BLOCK_ID_FLAG_COMMIT - voted for the block that received the majority */
    BLOCK_ID_FLAG_COMMIT = 2,
    /** BLOCK_ID_FLAG_NIL - voted for nil */
    BLOCK_ID_FLAG_NIL = 3,
    UNRECOGNIZED = -1
}
export declare function blockIDFlagFromJSON(object: any): BlockIDFlag;
export declare function blockIDFlagToJSON(object: BlockIDFlag): string;
export interface ValidatorSet {
    validators: Validator[];
    proposer?: Validator | undefined;
    totalVotingPower: bigint;
}
export interface Validator {
    address: Uint8Array;
    pubKey?: PublicKey | undefined;
    votingPower: bigint;
    proposerPriority: bigint;
}
export interface SimpleValidator {
    pubKey?: PublicKey | undefined;
    votingPower: bigint;
}
export declare const ValidatorSet: {
    encode(message: ValidatorSet, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): ValidatorSet;
    fromJSON(object: any): ValidatorSet;
    toJSON(message: ValidatorSet): unknown;
    create<I extends Exact<DeepPartial<ValidatorSet>, I>>(base?: I): ValidatorSet;
    fromPartial<I extends Exact<DeepPartial<ValidatorSet>, I>>(object: I): ValidatorSet;
};
export declare const Validator: {
    encode(message: Validator, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): Validator;
    fromJSON(object: any): Validator;
    toJSON(message: Validator): unknown;
    create<I extends Exact<DeepPartial<Validator>, I>>(base?: I): Validator;
    fromPartial<I extends Exact<DeepPartial<Validator>, I>>(object: I): Validator;
};
export declare const SimpleValidator: {
    encode(message: SimpleValidator, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): SimpleValidator;
    fromJSON(object: any): SimpleValidator;
    toJSON(message: SimpleValidator): unknown;
    create<I extends Exact<DeepPartial<SimpleValidator>, I>>(base?: I): SimpleValidator;
    fromPartial<I extends Exact<DeepPartial<SimpleValidator>, I>>(object: I): SimpleValidator;
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
