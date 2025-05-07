import _m0 from "protobufjs/minimal";
export declare const protobufPackage = "connect.abci.v2";
/** OracleVoteExtension defines the vote extension structure for oracle prices. */
export interface OracleVoteExtension {
    /**
     * Prices defines a map of id(CurrencyPair) -> price.Bytes() . i.e. 1 ->
     * 0x123.. (bytes). Notice the `id` function is determined by the
     * `CurrencyPairIDStrategy` used in the VoteExtensionHandler.
     */
    prices: Map<bigint, Uint8Array>;
}
export interface OracleVoteExtension_PricesEntry {
    key: bigint;
    value: Uint8Array;
}
export declare const OracleVoteExtension: {
    encode(message: OracleVoteExtension, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): OracleVoteExtension;
    fromJSON(object: any): OracleVoteExtension;
    toJSON(message: OracleVoteExtension): unknown;
    create(base?: DeepPartial<OracleVoteExtension>): OracleVoteExtension;
    fromPartial(object: DeepPartial<OracleVoteExtension>): OracleVoteExtension;
};
export declare const OracleVoteExtension_PricesEntry: {
    encode(message: OracleVoteExtension_PricesEntry, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): OracleVoteExtension_PricesEntry;
    fromJSON(object: any): OracleVoteExtension_PricesEntry;
    toJSON(message: OracleVoteExtension_PricesEntry): unknown;
    create(base?: DeepPartial<OracleVoteExtension_PricesEntry>): OracleVoteExtension_PricesEntry;
    fromPartial(object: DeepPartial<OracleVoteExtension_PricesEntry>): OracleVoteExtension_PricesEntry;
};
type Builtin = Date | Function | Uint8Array | string | number | boolean | bigint | undefined;
export type DeepPartial<T> = T extends Builtin ? T : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
export {};
