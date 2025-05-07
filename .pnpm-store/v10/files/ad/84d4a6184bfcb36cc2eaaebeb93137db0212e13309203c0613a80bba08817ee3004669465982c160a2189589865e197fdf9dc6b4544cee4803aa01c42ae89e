import { grpc } from "@improbable-eng/grpc-web";
import _m0 from "protobufjs/minimal";
import { ERC721OriginTokenInfo, Log, Params } from "./types";
export declare const protobufPackage = "minievm.evm.v1";
/**
 * QueryCodeRequest is the request type for the Query/Code RPC
 * method
 */
export interface QueryCodeRequest {
    /** hex encoded contract address to query */
    contractAddr: string;
}
/**
 * QueryCodeResponse is the response type for the Query/Code RPC
 * method
 */
export interface QueryCodeResponse {
    code: string;
}
/**
 * QueryStateRequest is the request type for the Query/State RPC
 * method
 */
export interface QueryStateRequest {
    /** It can be cosmos address or hex encoded address. */
    contractAddr: string;
    /** hex encoded hash string */
    key: string;
}
/**
 * QueryStateResponse is the response type for the Query/State RPC
 * method
 */
export interface QueryStateResponse {
    /** hex encoded hash string */
    value: string;
}
/**
 * QueryERC20FactoryRequest is the request type for the Query/ERC20Factory RPC
 * method
 */
export interface QueryERC20FactoryRequest {
}
/**
 * QueryERC20FactoryResponse is the response type for the Query/ERC20Factory RPC
 * method
 */
export interface QueryERC20FactoryResponse {
    /** 0x prefixed hex address */
    address: string;
}
/**
 * QueryERC20WrapperRequest is the request type for the Query/ERC20Wrapper RPC
 * method
 */
export interface QueryERC20WrapperRequest {
}
/**
 * QueryERC20WrapperResponse is the response type for the Query/ERC20Wrapper RPC
 * method
 */
export interface QueryERC20WrapperResponse {
    /** 0x prefixed hex address */
    address: string;
}
/**
 * QueryContractAddrByDenomRequest is the request type for the Query/ContractAddrByDenom RPC
 * method
 */
export interface QueryContractAddrByDenomRequest {
    denom: string;
}
/**
 * QueryContractAddrByDenomResponse is the response type for the Query/ContractAddrByDenom RPC
 * method
 */
export interface QueryContractAddrByDenomResponse {
    /** 0x prefixed hex address */
    address: string;
}
/**
 * QueryDenomRequest is the request type for the Query/Denom RPC
 * method
 */
export interface QueryDenomRequest {
    /** It can be cosmos address or hex encoded address. */
    contractAddr: string;
}
/**
 * QueryDenomResponse is the response type for the Query/Denom RPC
 * method
 */
export interface QueryDenomResponse {
    denom: string;
}
/**
 * QueryCallRequest is the request type for the Query/Call RPC
 * method
 */
export interface QueryCallRequest {
    /** sender address */
    sender: string;
    /** It can be cosmos address or hex encoded address. */
    contractAddr: string;
    /** hex encoded call input */
    input: string;
    /** Value is the amount of fee denom token to transfer to the contract. */
    value: string;
    /**
     * whether to trace the call
     * `nil` means no trace
     */
    traceOptions?: TraceOptions | undefined;
}
/** TraceOption is the option for tracing */
export interface TraceOptions {
    /** whether to trace memory */
    withMemory: boolean;
    /** whether to trace stack */
    withStack: boolean;
    /** wtether to trace storage */
    withStorage: boolean;
    /** whether to return data trace */
    withReturnData: boolean;
}
/**
 * QueryCallResponse is the response type for the Query/Call RPC
 * method
 */
export interface QueryCallResponse {
    /** hex encoded response bytes. */
    response: string;
    usedGas: bigint;
    logs: Log[];
    traceOutput: string;
    error: string;
}
/**
 * QueryERC721ClassIdsByContractAddrRequest is the request type for the Query/ERC721ClassIdsByContractAddr RPC
 * method
 */
export interface QueryERC721ClassIdByContractAddrRequest {
    contractAddr: string;
}
/**
 * QueryERC721ClassIdsByContractAddrResponse is the response type for the Query/ERC721ClassIdsByContractAddr RPC
 * method
 */
export interface QueryERC721ClassIdByContractAddrResponse {
    classId: string;
}
/**
 * QueryERC721OriginTokenInfosRequest is the request type for the Query/ERC721OriginTokenInfos RPC
 * method
 */
export interface QueryERC721OriginTokenInfosRequest {
    classId: string;
    tokenIds: string[];
}
/**
 * QueryERC721OriginTokenInfosResponse is the response type for the Query/ERC721OriginTokenInfos RPC
 * method
 */
export interface QueryERC721OriginTokenInfosResponse {
    tokenInfos: ERC721OriginTokenInfo[];
}
/** QueryParamsRequest is the request type for the Query/Params RPC method. */
export interface QueryParamsRequest {
}
/** QueryParamsResponse is the response type for the Query/Params RPC method. */
export interface QueryParamsResponse {
    /** params defines the parameters of the module. */
    params?: Params | undefined;
}
export declare const QueryCodeRequest: {
    encode(message: QueryCodeRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryCodeRequest;
    fromJSON(object: any): QueryCodeRequest;
    toJSON(message: QueryCodeRequest): unknown;
    create(base?: DeepPartial<QueryCodeRequest>): QueryCodeRequest;
    fromPartial(object: DeepPartial<QueryCodeRequest>): QueryCodeRequest;
};
export declare const QueryCodeResponse: {
    encode(message: QueryCodeResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryCodeResponse;
    fromJSON(object: any): QueryCodeResponse;
    toJSON(message: QueryCodeResponse): unknown;
    create(base?: DeepPartial<QueryCodeResponse>): QueryCodeResponse;
    fromPartial(object: DeepPartial<QueryCodeResponse>): QueryCodeResponse;
};
export declare const QueryStateRequest: {
    encode(message: QueryStateRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryStateRequest;
    fromJSON(object: any): QueryStateRequest;
    toJSON(message: QueryStateRequest): unknown;
    create(base?: DeepPartial<QueryStateRequest>): QueryStateRequest;
    fromPartial(object: DeepPartial<QueryStateRequest>): QueryStateRequest;
};
export declare const QueryStateResponse: {
    encode(message: QueryStateResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryStateResponse;
    fromJSON(object: any): QueryStateResponse;
    toJSON(message: QueryStateResponse): unknown;
    create(base?: DeepPartial<QueryStateResponse>): QueryStateResponse;
    fromPartial(object: DeepPartial<QueryStateResponse>): QueryStateResponse;
};
export declare const QueryERC20FactoryRequest: {
    encode(_: QueryERC20FactoryRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryERC20FactoryRequest;
    fromJSON(_: any): QueryERC20FactoryRequest;
    toJSON(_: QueryERC20FactoryRequest): unknown;
    create(base?: DeepPartial<QueryERC20FactoryRequest>): QueryERC20FactoryRequest;
    fromPartial(_: DeepPartial<QueryERC20FactoryRequest>): QueryERC20FactoryRequest;
};
export declare const QueryERC20FactoryResponse: {
    encode(message: QueryERC20FactoryResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryERC20FactoryResponse;
    fromJSON(object: any): QueryERC20FactoryResponse;
    toJSON(message: QueryERC20FactoryResponse): unknown;
    create(base?: DeepPartial<QueryERC20FactoryResponse>): QueryERC20FactoryResponse;
    fromPartial(object: DeepPartial<QueryERC20FactoryResponse>): QueryERC20FactoryResponse;
};
export declare const QueryERC20WrapperRequest: {
    encode(_: QueryERC20WrapperRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryERC20WrapperRequest;
    fromJSON(_: any): QueryERC20WrapperRequest;
    toJSON(_: QueryERC20WrapperRequest): unknown;
    create(base?: DeepPartial<QueryERC20WrapperRequest>): QueryERC20WrapperRequest;
    fromPartial(_: DeepPartial<QueryERC20WrapperRequest>): QueryERC20WrapperRequest;
};
export declare const QueryERC20WrapperResponse: {
    encode(message: QueryERC20WrapperResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryERC20WrapperResponse;
    fromJSON(object: any): QueryERC20WrapperResponse;
    toJSON(message: QueryERC20WrapperResponse): unknown;
    create(base?: DeepPartial<QueryERC20WrapperResponse>): QueryERC20WrapperResponse;
    fromPartial(object: DeepPartial<QueryERC20WrapperResponse>): QueryERC20WrapperResponse;
};
export declare const QueryContractAddrByDenomRequest: {
    encode(message: QueryContractAddrByDenomRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryContractAddrByDenomRequest;
    fromJSON(object: any): QueryContractAddrByDenomRequest;
    toJSON(message: QueryContractAddrByDenomRequest): unknown;
    create(base?: DeepPartial<QueryContractAddrByDenomRequest>): QueryContractAddrByDenomRequest;
    fromPartial(object: DeepPartial<QueryContractAddrByDenomRequest>): QueryContractAddrByDenomRequest;
};
export declare const QueryContractAddrByDenomResponse: {
    encode(message: QueryContractAddrByDenomResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryContractAddrByDenomResponse;
    fromJSON(object: any): QueryContractAddrByDenomResponse;
    toJSON(message: QueryContractAddrByDenomResponse): unknown;
    create(base?: DeepPartial<QueryContractAddrByDenomResponse>): QueryContractAddrByDenomResponse;
    fromPartial(object: DeepPartial<QueryContractAddrByDenomResponse>): QueryContractAddrByDenomResponse;
};
export declare const QueryDenomRequest: {
    encode(message: QueryDenomRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryDenomRequest;
    fromJSON(object: any): QueryDenomRequest;
    toJSON(message: QueryDenomRequest): unknown;
    create(base?: DeepPartial<QueryDenomRequest>): QueryDenomRequest;
    fromPartial(object: DeepPartial<QueryDenomRequest>): QueryDenomRequest;
};
export declare const QueryDenomResponse: {
    encode(message: QueryDenomResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryDenomResponse;
    fromJSON(object: any): QueryDenomResponse;
    toJSON(message: QueryDenomResponse): unknown;
    create(base?: DeepPartial<QueryDenomResponse>): QueryDenomResponse;
    fromPartial(object: DeepPartial<QueryDenomResponse>): QueryDenomResponse;
};
export declare const QueryCallRequest: {
    encode(message: QueryCallRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryCallRequest;
    fromJSON(object: any): QueryCallRequest;
    toJSON(message: QueryCallRequest): unknown;
    create(base?: DeepPartial<QueryCallRequest>): QueryCallRequest;
    fromPartial(object: DeepPartial<QueryCallRequest>): QueryCallRequest;
};
export declare const TraceOptions: {
    encode(message: TraceOptions, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): TraceOptions;
    fromJSON(object: any): TraceOptions;
    toJSON(message: TraceOptions): unknown;
    create(base?: DeepPartial<TraceOptions>): TraceOptions;
    fromPartial(object: DeepPartial<TraceOptions>): TraceOptions;
};
export declare const QueryCallResponse: {
    encode(message: QueryCallResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryCallResponse;
    fromJSON(object: any): QueryCallResponse;
    toJSON(message: QueryCallResponse): unknown;
    create(base?: DeepPartial<QueryCallResponse>): QueryCallResponse;
    fromPartial(object: DeepPartial<QueryCallResponse>): QueryCallResponse;
};
export declare const QueryERC721ClassIdByContractAddrRequest: {
    encode(message: QueryERC721ClassIdByContractAddrRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryERC721ClassIdByContractAddrRequest;
    fromJSON(object: any): QueryERC721ClassIdByContractAddrRequest;
    toJSON(message: QueryERC721ClassIdByContractAddrRequest): unknown;
    create(base?: DeepPartial<QueryERC721ClassIdByContractAddrRequest>): QueryERC721ClassIdByContractAddrRequest;
    fromPartial(object: DeepPartial<QueryERC721ClassIdByContractAddrRequest>): QueryERC721ClassIdByContractAddrRequest;
};
export declare const QueryERC721ClassIdByContractAddrResponse: {
    encode(message: QueryERC721ClassIdByContractAddrResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryERC721ClassIdByContractAddrResponse;
    fromJSON(object: any): QueryERC721ClassIdByContractAddrResponse;
    toJSON(message: QueryERC721ClassIdByContractAddrResponse): unknown;
    create(base?: DeepPartial<QueryERC721ClassIdByContractAddrResponse>): QueryERC721ClassIdByContractAddrResponse;
    fromPartial(object: DeepPartial<QueryERC721ClassIdByContractAddrResponse>): QueryERC721ClassIdByContractAddrResponse;
};
export declare const QueryERC721OriginTokenInfosRequest: {
    encode(message: QueryERC721OriginTokenInfosRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryERC721OriginTokenInfosRequest;
    fromJSON(object: any): QueryERC721OriginTokenInfosRequest;
    toJSON(message: QueryERC721OriginTokenInfosRequest): unknown;
    create(base?: DeepPartial<QueryERC721OriginTokenInfosRequest>): QueryERC721OriginTokenInfosRequest;
    fromPartial(object: DeepPartial<QueryERC721OriginTokenInfosRequest>): QueryERC721OriginTokenInfosRequest;
};
export declare const QueryERC721OriginTokenInfosResponse: {
    encode(message: QueryERC721OriginTokenInfosResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryERC721OriginTokenInfosResponse;
    fromJSON(object: any): QueryERC721OriginTokenInfosResponse;
    toJSON(message: QueryERC721OriginTokenInfosResponse): unknown;
    create(base?: DeepPartial<QueryERC721OriginTokenInfosResponse>): QueryERC721OriginTokenInfosResponse;
    fromPartial(object: DeepPartial<QueryERC721OriginTokenInfosResponse>): QueryERC721OriginTokenInfosResponse;
};
export declare const QueryParamsRequest: {
    encode(_: QueryParamsRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryParamsRequest;
    fromJSON(_: any): QueryParamsRequest;
    toJSON(_: QueryParamsRequest): unknown;
    create(base?: DeepPartial<QueryParamsRequest>): QueryParamsRequest;
    fromPartial(_: DeepPartial<QueryParamsRequest>): QueryParamsRequest;
};
export declare const QueryParamsResponse: {
    encode(message: QueryParamsResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryParamsResponse;
    fromJSON(object: any): QueryParamsResponse;
    toJSON(message: QueryParamsResponse): unknown;
    create(base?: DeepPartial<QueryParamsResponse>): QueryParamsResponse;
    fromPartial(object: DeepPartial<QueryParamsResponse>): QueryParamsResponse;
};
/** Query provides defines the gRPC querier service */
export interface Query {
    /** Code gets the module info. */
    Code(request: DeepPartial<QueryCodeRequest>, metadata?: grpc.Metadata): Promise<QueryCodeResponse>;
    /** State gets the state bytes of the given address and key bytes. */
    State(request: DeepPartial<QueryStateRequest>, metadata?: grpc.Metadata): Promise<QueryStateResponse>;
    /** ERC20Factory gets the ERC20Factory contract address. */
    ERC20Factory(request: DeepPartial<QueryERC20FactoryRequest>, metadata?: grpc.Metadata): Promise<QueryERC20FactoryResponse>;
    /** ERC20Wrapper gets the ERC20Wrapper contract address. */
    ERC20Wrapper(request: DeepPartial<QueryERC20WrapperRequest>, metadata?: grpc.Metadata): Promise<QueryERC20WrapperResponse>;
    /** ContractAddrByDenom gets the contract address by denom. */
    ContractAddrByDenom(request: DeepPartial<QueryContractAddrByDenomRequest>, metadata?: grpc.Metadata): Promise<QueryContractAddrByDenomResponse>;
    /** ERC721ClassIdByContractAddr gets the class id by contract address. */
    ERC721ClassIdByContractAddr(request: DeepPartial<QueryERC721ClassIdByContractAddrRequest>, metadata?: grpc.Metadata): Promise<QueryERC721ClassIdByContractAddrResponse>;
    /** ERC721OriginTokenInfos gets the origin token infos by class id and token ids. */
    ERC721OriginTokenInfos(request: DeepPartial<QueryERC721OriginTokenInfosRequest>, metadata?: grpc.Metadata): Promise<QueryERC721OriginTokenInfosResponse>;
    /** Denom gets the denom of the given contract address. */
    Denom(request: DeepPartial<QueryDenomRequest>, metadata?: grpc.Metadata): Promise<QueryDenomResponse>;
    /** Call execute entry function and return  the function result */
    Call(request: DeepPartial<QueryCallRequest>, metadata?: grpc.Metadata): Promise<QueryCallResponse>;
    /** Params queries all parameters. */
    Params(request: DeepPartial<QueryParamsRequest>, metadata?: grpc.Metadata): Promise<QueryParamsResponse>;
}
export declare class QueryClientImpl implements Query {
    private readonly rpc;
    constructor(rpc: Rpc);
    Code(request: DeepPartial<QueryCodeRequest>, metadata?: grpc.Metadata): Promise<QueryCodeResponse>;
    State(request: DeepPartial<QueryStateRequest>, metadata?: grpc.Metadata): Promise<QueryStateResponse>;
    ERC20Factory(request: DeepPartial<QueryERC20FactoryRequest>, metadata?: grpc.Metadata): Promise<QueryERC20FactoryResponse>;
    ERC20Wrapper(request: DeepPartial<QueryERC20WrapperRequest>, metadata?: grpc.Metadata): Promise<QueryERC20WrapperResponse>;
    ContractAddrByDenom(request: DeepPartial<QueryContractAddrByDenomRequest>, metadata?: grpc.Metadata): Promise<QueryContractAddrByDenomResponse>;
    ERC721ClassIdByContractAddr(request: DeepPartial<QueryERC721ClassIdByContractAddrRequest>, metadata?: grpc.Metadata): Promise<QueryERC721ClassIdByContractAddrResponse>;
    ERC721OriginTokenInfos(request: DeepPartial<QueryERC721OriginTokenInfosRequest>, metadata?: grpc.Metadata): Promise<QueryERC721OriginTokenInfosResponse>;
    Denom(request: DeepPartial<QueryDenomRequest>, metadata?: grpc.Metadata): Promise<QueryDenomResponse>;
    Call(request: DeepPartial<QueryCallRequest>, metadata?: grpc.Metadata): Promise<QueryCallResponse>;
    Params(request: DeepPartial<QueryParamsRequest>, metadata?: grpc.Metadata): Promise<QueryParamsResponse>;
}
export declare const QueryDesc: {
    serviceName: string;
};
export declare const QueryCodeDesc: UnaryMethodDefinitionish;
export declare const QueryStateDesc: UnaryMethodDefinitionish;
export declare const QueryERC20FactoryDesc: UnaryMethodDefinitionish;
export declare const QueryERC20WrapperDesc: UnaryMethodDefinitionish;
export declare const QueryContractAddrByDenomDesc: UnaryMethodDefinitionish;
export declare const QueryERC721ClassIdByContractAddrDesc: UnaryMethodDefinitionish;
export declare const QueryERC721OriginTokenInfosDesc: UnaryMethodDefinitionish;
export declare const QueryDenomDesc: UnaryMethodDefinitionish;
export declare const QueryCallDesc: UnaryMethodDefinitionish;
export declare const QueryParamsDesc: UnaryMethodDefinitionish;
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
