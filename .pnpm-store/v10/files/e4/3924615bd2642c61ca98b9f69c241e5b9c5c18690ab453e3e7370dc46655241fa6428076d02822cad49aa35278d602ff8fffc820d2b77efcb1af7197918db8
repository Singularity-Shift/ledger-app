import _m0 from "protobufjs/minimal";
export declare const protobufPackage = "connect.marketmap.v2";
/** Params defines the parameters for the x/marketmap module. */
export interface Params {
    /**
     * MarketAuthorities is the list of authority accounts that are able to
     * control updating the marketmap.
     */
    marketAuthorities: string[];
    /**
     * Admin is an address that can remove addresses from the MarketAuthorities
     * list. Only governance can add to the MarketAuthorities or change the Admin.
     */
    admin: string;
}
export declare const Params: {
    encode(message: Params, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): Params;
    fromJSON(object: any): Params;
    toJSON(message: Params): unknown;
    create(base?: DeepPartial<Params>): Params;
    fromPartial(object: DeepPartial<Params>): Params;
};
type Builtin = Date | Function | Uint8Array | string | number | boolean | bigint | undefined;
export type DeepPartial<T> = T extends Builtin ? T : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
export {};
