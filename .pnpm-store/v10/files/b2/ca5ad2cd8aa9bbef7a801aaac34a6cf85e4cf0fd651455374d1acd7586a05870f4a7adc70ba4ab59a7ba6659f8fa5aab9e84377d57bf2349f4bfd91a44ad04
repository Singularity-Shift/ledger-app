import { grpc } from "@improbable-eng/grpc-web";
import _m0 from "protobufjs/minimal";
export declare const protobufPackage = "noble.forwarding.v1";
export interface MsgRegisterAccount {
    signer: string;
    recipient: string;
    channel: string;
    fallback: string;
}
export interface MsgRegisterAccountResponse {
    address: string;
}
export interface MsgClearAccount {
    signer: string;
    address: string;
    fallback: boolean;
}
export interface MsgClearAccountResponse {
}
export interface MsgSetAllowedDenoms {
    signer: string;
    denoms: string[];
}
export interface MsgSetAllowedDenomsResponse {
}
export declare const MsgRegisterAccount: {
    encode(message: MsgRegisterAccount, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgRegisterAccount;
    fromJSON(object: any): MsgRegisterAccount;
    toJSON(message: MsgRegisterAccount): unknown;
    create(base?: DeepPartial<MsgRegisterAccount>): MsgRegisterAccount;
    fromPartial(object: DeepPartial<MsgRegisterAccount>): MsgRegisterAccount;
};
export declare const MsgRegisterAccountResponse: {
    encode(message: MsgRegisterAccountResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgRegisterAccountResponse;
    fromJSON(object: any): MsgRegisterAccountResponse;
    toJSON(message: MsgRegisterAccountResponse): unknown;
    create(base?: DeepPartial<MsgRegisterAccountResponse>): MsgRegisterAccountResponse;
    fromPartial(object: DeepPartial<MsgRegisterAccountResponse>): MsgRegisterAccountResponse;
};
export declare const MsgClearAccount: {
    encode(message: MsgClearAccount, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgClearAccount;
    fromJSON(object: any): MsgClearAccount;
    toJSON(message: MsgClearAccount): unknown;
    create(base?: DeepPartial<MsgClearAccount>): MsgClearAccount;
    fromPartial(object: DeepPartial<MsgClearAccount>): MsgClearAccount;
};
export declare const MsgClearAccountResponse: {
    encode(_: MsgClearAccountResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgClearAccountResponse;
    fromJSON(_: any): MsgClearAccountResponse;
    toJSON(_: MsgClearAccountResponse): unknown;
    create(base?: DeepPartial<MsgClearAccountResponse>): MsgClearAccountResponse;
    fromPartial(_: DeepPartial<MsgClearAccountResponse>): MsgClearAccountResponse;
};
export declare const MsgSetAllowedDenoms: {
    encode(message: MsgSetAllowedDenoms, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgSetAllowedDenoms;
    fromJSON(object: any): MsgSetAllowedDenoms;
    toJSON(message: MsgSetAllowedDenoms): unknown;
    create(base?: DeepPartial<MsgSetAllowedDenoms>): MsgSetAllowedDenoms;
    fromPartial(object: DeepPartial<MsgSetAllowedDenoms>): MsgSetAllowedDenoms;
};
export declare const MsgSetAllowedDenomsResponse: {
    encode(_: MsgSetAllowedDenomsResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgSetAllowedDenomsResponse;
    fromJSON(_: any): MsgSetAllowedDenomsResponse;
    toJSON(_: MsgSetAllowedDenomsResponse): unknown;
    create(base?: DeepPartial<MsgSetAllowedDenomsResponse>): MsgSetAllowedDenomsResponse;
    fromPartial(_: DeepPartial<MsgSetAllowedDenomsResponse>): MsgSetAllowedDenomsResponse;
};
export interface Msg {
    RegisterAccount(request: DeepPartial<MsgRegisterAccount>, metadata?: grpc.Metadata): Promise<MsgRegisterAccountResponse>;
    ClearAccount(request: DeepPartial<MsgClearAccount>, metadata?: grpc.Metadata): Promise<MsgClearAccountResponse>;
    SetAllowedDenoms(request: DeepPartial<MsgSetAllowedDenoms>, metadata?: grpc.Metadata): Promise<MsgSetAllowedDenomsResponse>;
}
export declare class MsgClientImpl implements Msg {
    private readonly rpc;
    constructor(rpc: Rpc);
    RegisterAccount(request: DeepPartial<MsgRegisterAccount>, metadata?: grpc.Metadata): Promise<MsgRegisterAccountResponse>;
    ClearAccount(request: DeepPartial<MsgClearAccount>, metadata?: grpc.Metadata): Promise<MsgClearAccountResponse>;
    SetAllowedDenoms(request: DeepPartial<MsgSetAllowedDenoms>, metadata?: grpc.Metadata): Promise<MsgSetAllowedDenomsResponse>;
}
export declare const MsgDesc: {
    serviceName: string;
};
export declare const MsgRegisterAccountDesc: UnaryMethodDefinitionish;
export declare const MsgClearAccountDesc: UnaryMethodDefinitionish;
export declare const MsgSetAllowedDenomsDesc: UnaryMethodDefinitionish;
interface UnaryMethodDefinitionishR extends grpc.UnaryMethodDefinition<any, any> {
    requestStream: any;
    responseStream: any;
}
type UnaryMethodDefinitionish = UnaryMethodDefinitionishR;
interface Rpc {
    unary<T extends UnaryMethodDefinitionish>(methodDesc: T, request: any, metadata: grpc.Metadata | undefined): Promise<any>;
}
export declare class GrpcWebImpl {
    private host;
    private options;
    constructor(host: string, options: {
        transport?: grpc.TransportFactory;
        debug?: boolean;
        metadata?: grpc.Metadata;
        upStreamRetryCodes?: number[];
    });
    unary<T extends UnaryMethodDefinitionish>(methodDesc: T, _request: any, metadata: grpc.Metadata | undefined): Promise<any>;
}
declare const gt: any;
type Builtin = Date | Function | Uint8Array | string | number | boolean | bigint | undefined;
export type DeepPartial<T> = T extends Builtin ? T : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
export declare class GrpcWebError extends gt.Error {
    code: grpc.Code;
    metadata: grpc.Metadata;
    constructor(message: string, code: grpc.Code, metadata: grpc.Metadata);
}
export {};
