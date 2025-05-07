import _m0 from "protobufjs/minimal";
export declare const protobufPackage = "connect.types.v2";
/**
 * CurrencyPair is the standard representation of a pair of assets, where one
 * (Base) is priced in terms of the other (Quote)
 */
export interface CurrencyPair {
    Base: string;
    Quote: string;
}
export declare const CurrencyPair: {
    encode(message: CurrencyPair, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): CurrencyPair;
    fromJSON(object: any): CurrencyPair;
    toJSON(message: CurrencyPair): unknown;
    create(base?: DeepPartial<CurrencyPair>): CurrencyPair;
    fromPartial(object: DeepPartial<CurrencyPair>): CurrencyPair;
};
type Builtin = Date | Function | Uint8Array | string | number | boolean | bigint | undefined;
export type DeepPartial<T> = T extends Builtin ? T : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
export {};
