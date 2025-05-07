import _m0 from "protobufjs/minimal";
export declare const protobufPackage = "cosmos.evidence.v1beta1";
/**
 * Equivocation implements the Evidence interface and defines evidence of double
 * signing misbehavior.
 */
export interface Equivocation {
    /** height is the equivocation height. */
    height: bigint;
    /** time is the equivocation time. */
    time?: Date | undefined;
    /** power is the equivocation validator power. */
    power: bigint;
    /** consensus_address is the equivocation validator consensus address. */
    consensusAddress: string;
}
export declare const Equivocation: {
    encode(message: Equivocation, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): Equivocation;
    fromJSON(object: any): Equivocation;
    toJSON(message: Equivocation): unknown;
    create(base?: DeepPartial<Equivocation>): Equivocation;
    fromPartial(object: DeepPartial<Equivocation>): Equivocation;
};
type Builtin = Date | Function | Uint8Array | string | number | boolean | bigint | undefined;
export type DeepPartial<T> = T extends Builtin ? T : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
export {};
