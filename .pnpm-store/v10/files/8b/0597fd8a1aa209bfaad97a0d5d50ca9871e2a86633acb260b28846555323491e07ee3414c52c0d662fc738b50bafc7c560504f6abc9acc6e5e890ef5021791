import { grpc } from "@improbable-eng/grpc-web";
import _m0 from "protobufjs/minimal";
import { PageRequest, PageResponse } from "../../../cosmos/base/query/v1beta1/pagination";
import { BridgeInfo, Params, Validator } from "./types";
export declare const protobufPackage = "opinit.opchild.v1";
/** QueryValidatorsRequest is request type for Query/Validators RPC method. */
export interface QueryValidatorsRequest {
    /** pagination defines an optional pagination for the request. */
    pagination?: PageRequest | undefined;
}
/** QueryValidatorsResponse is response type for the Query/Validators RPC method */
export interface QueryValidatorsResponse {
    /** validators contains all the queried validators. */
    validators: Validator[];
    /** pagination defines the pagination in the response. */
    pagination?: PageResponse | undefined;
}
/** QueryValidatorRequest is response type for the Query/Validator RPC method */
export interface QueryValidatorRequest {
    /** validator_addr defines the validator address to query for. */
    validatorAddr: string;
}
/** QueryValidatorResponse is response type for the Query/Validator RPC method */
export interface QueryValidatorResponse {
    /** validator defines the validator info. */
    validator?: Validator | undefined;
}
/** QueryBridgeInfoRequest is request type for the Query/BridgeInfo RPC method. */
export interface QueryBridgeInfoRequest {
}
/** QueryBridgeInfoResponse is response type for the Query/BridgeInfo RPC method. */
export interface QueryBridgeInfoResponse {
    /** bridge_info holds all the information about the bridge. */
    bridgeInfo?: BridgeInfo | undefined;
}
/** QueryParamsRequest is request type for the Query/Params RPC method. */
export interface QueryParamsRequest {
}
/** QueryParamsResponse is response type for the Query/Params RPC method. */
export interface QueryParamsResponse {
    /** params holds all the parameters of this module. */
    params?: Params | undefined;
}
/** QueryNextL1SequenceRequest is request type for the Query/NextL1Sequence RPC method. */
export interface QueryNextL1SequenceRequest {
}
/** QueryNextL1SequenceResponse is response type for the Query/NextL1Sequence RPC method. */
export interface QueryNextL1SequenceResponse {
    /** next_l1_sequence holds the next l1 sequence number. */
    nextL1Sequence: bigint;
}
/** QueryNextL2SequenceRequest is request type for the Query/NextL2Sequence RPC method. */
export interface QueryNextL2SequenceRequest {
}
/** QueryNextL2SequenceResponse is response type for the Query/NextL2Sequence RPC method. */
export interface QueryNextL2SequenceResponse {
    /** next_l2_sequence holds the next l2 sequence number. */
    nextL2Sequence: bigint;
}
/** QueryBaseDenomRequest is request type for the Query/BaseDenom RPC method. */
export interface QueryBaseDenomRequest {
    denom: string;
}
/** QueryBaseDenomResponse is response type for the Query/BaseDenom RPC method. */
export interface QueryBaseDenomResponse {
    baseDenom: string;
}
export declare const QueryValidatorsRequest: {
    encode(message: QueryValidatorsRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryValidatorsRequest;
    fromJSON(object: any): QueryValidatorsRequest;
    toJSON(message: QueryValidatorsRequest): unknown;
    create<I extends Exact<DeepPartial<QueryValidatorsRequest>, I>>(base?: I): QueryValidatorsRequest;
    fromPartial<I extends Exact<DeepPartial<QueryValidatorsRequest>, I>>(object: I): QueryValidatorsRequest;
};
export declare const QueryValidatorsResponse: {
    encode(message: QueryValidatorsResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryValidatorsResponse;
    fromJSON(object: any): QueryValidatorsResponse;
    toJSON(message: QueryValidatorsResponse): unknown;
    create<I extends Exact<DeepPartial<QueryValidatorsResponse>, I>>(base?: I): QueryValidatorsResponse;
    fromPartial<I extends Exact<DeepPartial<QueryValidatorsResponse>, I>>(object: I): QueryValidatorsResponse;
};
export declare const QueryValidatorRequest: {
    encode(message: QueryValidatorRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryValidatorRequest;
    fromJSON(object: any): QueryValidatorRequest;
    toJSON(message: QueryValidatorRequest): unknown;
    create<I extends Exact<DeepPartial<QueryValidatorRequest>, I>>(base?: I): QueryValidatorRequest;
    fromPartial<I extends Exact<DeepPartial<QueryValidatorRequest>, I>>(object: I): QueryValidatorRequest;
};
export declare const QueryValidatorResponse: {
    encode(message: QueryValidatorResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryValidatorResponse;
    fromJSON(object: any): QueryValidatorResponse;
    toJSON(message: QueryValidatorResponse): unknown;
    create<I extends Exact<DeepPartial<QueryValidatorResponse>, I>>(base?: I): QueryValidatorResponse;
    fromPartial<I extends Exact<DeepPartial<QueryValidatorResponse>, I>>(object: I): QueryValidatorResponse;
};
export declare const QueryBridgeInfoRequest: {
    encode(_: QueryBridgeInfoRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryBridgeInfoRequest;
    fromJSON(_: any): QueryBridgeInfoRequest;
    toJSON(_: QueryBridgeInfoRequest): unknown;
    create<I extends Exact<DeepPartial<QueryBridgeInfoRequest>, I>>(base?: I): QueryBridgeInfoRequest;
    fromPartial<I extends Exact<DeepPartial<QueryBridgeInfoRequest>, I>>(_: I): QueryBridgeInfoRequest;
};
export declare const QueryBridgeInfoResponse: {
    encode(message: QueryBridgeInfoResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryBridgeInfoResponse;
    fromJSON(object: any): QueryBridgeInfoResponse;
    toJSON(message: QueryBridgeInfoResponse): unknown;
    create<I extends Exact<DeepPartial<QueryBridgeInfoResponse>, I>>(base?: I): QueryBridgeInfoResponse;
    fromPartial<I extends Exact<DeepPartial<QueryBridgeInfoResponse>, I>>(object: I): QueryBridgeInfoResponse;
};
export declare const QueryParamsRequest: {
    encode(_: QueryParamsRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryParamsRequest;
    fromJSON(_: any): QueryParamsRequest;
    toJSON(_: QueryParamsRequest): unknown;
    create<I extends Exact<DeepPartial<QueryParamsRequest>, I>>(base?: I): QueryParamsRequest;
    fromPartial<I extends Exact<DeepPartial<QueryParamsRequest>, I>>(_: I): QueryParamsRequest;
};
export declare const QueryParamsResponse: {
    encode(message: QueryParamsResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryParamsResponse;
    fromJSON(object: any): QueryParamsResponse;
    toJSON(message: QueryParamsResponse): unknown;
    create<I extends Exact<DeepPartial<QueryParamsResponse>, I>>(base?: I): QueryParamsResponse;
    fromPartial<I extends Exact<DeepPartial<QueryParamsResponse>, I>>(object: I): QueryParamsResponse;
};
export declare const QueryNextL1SequenceRequest: {
    encode(_: QueryNextL1SequenceRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryNextL1SequenceRequest;
    fromJSON(_: any): QueryNextL1SequenceRequest;
    toJSON(_: QueryNextL1SequenceRequest): unknown;
    create<I extends Exact<DeepPartial<QueryNextL1SequenceRequest>, I>>(base?: I): QueryNextL1SequenceRequest;
    fromPartial<I extends Exact<DeepPartial<QueryNextL1SequenceRequest>, I>>(_: I): QueryNextL1SequenceRequest;
};
export declare const QueryNextL1SequenceResponse: {
    encode(message: QueryNextL1SequenceResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryNextL1SequenceResponse;
    fromJSON(object: any): QueryNextL1SequenceResponse;
    toJSON(message: QueryNextL1SequenceResponse): unknown;
    create<I extends Exact<DeepPartial<QueryNextL1SequenceResponse>, I>>(base?: I): QueryNextL1SequenceResponse;
    fromPartial<I extends Exact<DeepPartial<QueryNextL1SequenceResponse>, I>>(object: I): QueryNextL1SequenceResponse;
};
export declare const QueryNextL2SequenceRequest: {
    encode(_: QueryNextL2SequenceRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryNextL2SequenceRequest;
    fromJSON(_: any): QueryNextL2SequenceRequest;
    toJSON(_: QueryNextL2SequenceRequest): unknown;
    create<I extends Exact<DeepPartial<QueryNextL2SequenceRequest>, I>>(base?: I): QueryNextL2SequenceRequest;
    fromPartial<I extends Exact<DeepPartial<QueryNextL2SequenceRequest>, I>>(_: I): QueryNextL2SequenceRequest;
};
export declare const QueryNextL2SequenceResponse: {
    encode(message: QueryNextL2SequenceResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryNextL2SequenceResponse;
    fromJSON(object: any): QueryNextL2SequenceResponse;
    toJSON(message: QueryNextL2SequenceResponse): unknown;
    create<I extends Exact<DeepPartial<QueryNextL2SequenceResponse>, I>>(base?: I): QueryNextL2SequenceResponse;
    fromPartial<I extends Exact<DeepPartial<QueryNextL2SequenceResponse>, I>>(object: I): QueryNextL2SequenceResponse;
};
export declare const QueryBaseDenomRequest: {
    encode(message: QueryBaseDenomRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryBaseDenomRequest;
    fromJSON(object: any): QueryBaseDenomRequest;
    toJSON(message: QueryBaseDenomRequest): unknown;
    create<I extends Exact<DeepPartial<QueryBaseDenomRequest>, I>>(base?: I): QueryBaseDenomRequest;
    fromPartial<I extends Exact<DeepPartial<QueryBaseDenomRequest>, I>>(object: I): QueryBaseDenomRequest;
};
export declare const QueryBaseDenomResponse: {
    encode(message: QueryBaseDenomResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryBaseDenomResponse;
    fromJSON(object: any): QueryBaseDenomResponse;
    toJSON(message: QueryBaseDenomResponse): unknown;
    create<I extends Exact<DeepPartial<QueryBaseDenomResponse>, I>>(base?: I): QueryBaseDenomResponse;
    fromPartial<I extends Exact<DeepPartial<QueryBaseDenomResponse>, I>>(object: I): QueryBaseDenomResponse;
};
/** Query defines the gRPC querier service. */
export interface Query {
    /**
     * Validators queries all validators
     *
     * When called from another module, this query might consume a high amount of
     * gas if the pagination field is incorrectly set.
     */
    Validators(request: DeepPartial<QueryValidatorsRequest>, metadata?: grpc.Metadata): Promise<QueryValidatorsResponse>;
    /** Validator queries validator info for given validator address. */
    Validator(request: DeepPartial<QueryValidatorRequest>, metadata?: grpc.Metadata): Promise<QueryValidatorResponse>;
    /** BridgeInfo queries the bridge information. */
    BridgeInfo(request: DeepPartial<QueryBridgeInfoRequest>, metadata?: grpc.Metadata): Promise<QueryBridgeInfoResponse>;
    /** Parameters queries the rollup parameters. */
    Params(request: DeepPartial<QueryParamsRequest>, metadata?: grpc.Metadata): Promise<QueryParamsResponse>;
    /** NextL1Sequence queries the next l1 sequence number. */
    NextL1Sequence(request: DeepPartial<QueryNextL1SequenceRequest>, metadata?: grpc.Metadata): Promise<QueryNextL1SequenceResponse>;
    /** NextL2Sequence queries the next l2 sequence number. */
    NextL2Sequence(request: DeepPartial<QueryNextL2SequenceRequest>, metadata?: grpc.Metadata): Promise<QueryNextL2SequenceResponse>;
    BaseDenom(request: DeepPartial<QueryBaseDenomRequest>, metadata?: grpc.Metadata): Promise<QueryBaseDenomResponse>;
}
export declare class QueryClientImpl implements Query {
    private readonly rpc;
    constructor(rpc: Rpc);
    Validators(request: DeepPartial<QueryValidatorsRequest>, metadata?: grpc.Metadata): Promise<QueryValidatorsResponse>;
    Validator(request: DeepPartial<QueryValidatorRequest>, metadata?: grpc.Metadata): Promise<QueryValidatorResponse>;
    BridgeInfo(request: DeepPartial<QueryBridgeInfoRequest>, metadata?: grpc.Metadata): Promise<QueryBridgeInfoResponse>;
    Params(request: DeepPartial<QueryParamsRequest>, metadata?: grpc.Metadata): Promise<QueryParamsResponse>;
    NextL1Sequence(request: DeepPartial<QueryNextL1SequenceRequest>, metadata?: grpc.Metadata): Promise<QueryNextL1SequenceResponse>;
    NextL2Sequence(request: DeepPartial<QueryNextL2SequenceRequest>, metadata?: grpc.Metadata): Promise<QueryNextL2SequenceResponse>;
    BaseDenom(request: DeepPartial<QueryBaseDenomRequest>, metadata?: grpc.Metadata): Promise<QueryBaseDenomResponse>;
}
export declare const QueryDesc: {
    serviceName: string;
};
export declare const QueryValidatorsDesc: UnaryMethodDefinitionish;
export declare const QueryValidatorDesc: UnaryMethodDefinitionish;
export declare const QueryBridgeInfoDesc: UnaryMethodDefinitionish;
export declare const QueryParamsDesc: UnaryMethodDefinitionish;
export declare const QueryNextL1SequenceDesc: UnaryMethodDefinitionish;
export declare const QueryNextL2SequenceDesc: UnaryMethodDefinitionish;
export declare const QueryBaseDenomDesc: UnaryMethodDefinitionish;
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
type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P : P & {
    [K in keyof P]: Exact<P[K], I[K]>;
} & {
    [K in Exclude<keyof I, KeysOfUnion<P>>]: never;
};
export declare class GrpcWebError extends gt.Error {
    code: grpc.Code;
    metadata: grpc.Metadata;
    constructor(message: string, code: grpc.Code, metadata: grpc.Metadata);
}
export {};
