import _m0 from "protobufjs/minimal";
export declare const protobufPackage = "connect.oracle.module.v2";
/** Module is the config object of the builder module. */
export interface Module {
    /**
     * Authority defines the custom module authority. If not set, defaults to the
     * governance module.
     */
    authority: string;
}
export declare const Module: {
    encode(message: Module, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): Module;
    fromJSON(object: any): Module;
    toJSON(message: Module): unknown;
    create(base?: DeepPartial<Module>): Module;
    fromPartial(object: DeepPartial<Module>): Module;
};
type Builtin = Date | Function | Uint8Array | string | number | boolean | bigint | undefined;
export type DeepPartial<T> = T extends Builtin ? T : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
export {};
