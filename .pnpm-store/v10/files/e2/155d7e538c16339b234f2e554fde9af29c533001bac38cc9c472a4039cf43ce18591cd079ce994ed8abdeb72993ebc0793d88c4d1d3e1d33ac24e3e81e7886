import { grpc } from "@improbable-eng/grpc-web";
import _m0 from "protobufjs/minimal";
import { PageRequest, PageResponse } from "../../../cosmos/base/query/v1beta1/pagination";
import { BatchInfoWithOutput, BridgeConfig, Output, Params, TokenPair } from "./types";
export declare const protobufPackage = "opinit.ophost.v1";
/** QueryBridgeRequest is request type for Query/Bridge RPC method. */
export interface QueryBridgeRequest {
    bridgeId: bigint;
}
/** QueryBridgeResponse is response type for the Query/Bridge RPC method */
export interface QueryBridgeResponse {
    bridgeId: bigint;
    bridgeAddr: string;
    bridgeConfig?: BridgeConfig | undefined;
}
/** QueryBridgesRequest is request type for Query/Bridges RPC method. */
export interface QueryBridgesRequest {
    /** pagination defines the pagination in the request. */
    pagination?: PageRequest | undefined;
}
/** QueryBridgesResponse is response type for the Query/Bridges RPC method */
export interface QueryBridgesResponse {
    bridges: QueryBridgeResponse[];
    /** pagination defines the pagination in the response. */
    pagination?: PageResponse | undefined;
}
/** QueryTokenPairByL1DenomRequest is response type for the Query/TokenPairByL1Denom RPC method */
export interface QueryTokenPairByL1DenomRequest {
    bridgeId: bigint;
    l1Denom: string;
}
/** QueryTokenPairByL1DenomResponse is response type for the Query/TokenPairByL1Denom RPC method */
export interface QueryTokenPairByL1DenomResponse {
    tokenPair?: TokenPair | undefined;
}
/** QueryTokenPairByL2DenomRequest is response type for the Query/TokenPairByL2Denom RPC method */
export interface QueryTokenPairByL2DenomRequest {
    bridgeId: bigint;
    l2Denom: string;
}
/** QueryTokenPairByL2DenomResponse is response type for the Query/TokenPairByL2Denom RPC method */
export interface QueryTokenPairByL2DenomResponse {
    tokenPair?: TokenPair | undefined;
}
/** QueryTokenPairsRequest is response type for the Query/TokenPairs RPC method */
export interface QueryTokenPairsRequest {
    bridgeId: bigint;
    /** pagination defines the pagination in the request. */
    pagination?: PageRequest | undefined;
}
/** QueryTokenPairsResponse is response type for the Query/TokenPairs RPC method */
export interface QueryTokenPairsResponse {
    tokenPairs: TokenPair[];
    /** pagination defines the pagination in the response. */
    pagination?: PageResponse | undefined;
}
/** QueryLastFinalizedOutputRequest is request type for the Query/LastFinalizedOutput RPC method. */
export interface QueryLastFinalizedOutputRequest {
    bridgeId: bigint;
}
/** QueryLastFinalizedOutputResponse is response type for the Query/LastFinalizedOutput RPC method */
export interface QueryLastFinalizedOutputResponse {
    outputIndex: bigint;
    outputProposal?: Output | undefined;
}
/** QueryOutputProposalRequest is response type for the Query/OutputProposal RPC method */
export interface QueryOutputProposalRequest {
    bridgeId: bigint;
    outputIndex: bigint;
}
/** QueryOutputProposalResponse is response type for the Query/OutputProposal RPC method */
export interface QueryOutputProposalResponse {
    bridgeId: bigint;
    outputIndex: bigint;
    outputProposal?: Output | undefined;
}
/** QueryOutputProposalsRequest is response type for the Query/OutputProposals RPC method */
export interface QueryOutputProposalsRequest {
    bridgeId: bigint;
    /** pagination defines the pagination in the request. */
    pagination?: PageRequest | undefined;
}
/** QueryOutputProposalsResponse is response type for the Query/OutputProposals RPC method */
export interface QueryOutputProposalsResponse {
    outputProposals: QueryOutputProposalResponse[];
    /** pagination defines the pagination in the response. */
    pagination?: PageResponse | undefined;
}
/** QueryParamsRequest is request type for the Query/Params RPC method. */
export interface QueryParamsRequest {
}
/** QueryParamsResponse is response type for the Query/Params RPC method. */
export interface QueryParamsResponse {
    /** params holds all the parameters of this module. */
    params?: Params | undefined;
}
/** QueryClaimedRequest is request type for the Query/Claimed RPC method. */
export interface QueryClaimedRequest {
    bridgeId: bigint;
    withdrawalHash: Uint8Array;
}
/** QueryClaimedResponse is response type for the Query/Claimed RPC method */
export interface QueryClaimedResponse {
    claimed: boolean;
}
/** QueryNextL1SequenceRequest is request type for the Query/NextL1Sequence RPC method. */
export interface QueryNextL1SequenceRequest {
    bridgeId: bigint;
}
/** QueryNextL1SequenceResponse is response type for the Query/NextL1Sequence RPC method. */
export interface QueryNextL1SequenceResponse {
    nextL1Sequence: bigint;
}
/** QueryBatchInfosRequest is request type for Query/BatchInfos RPC method. */
export interface QueryBatchInfosRequest {
    bridgeId: bigint;
    pagination?: PageRequest | undefined;
}
/** QueryBatchInfosResponse is response type for Query/BatchInfos RPC method. */
export interface QueryBatchInfosResponse {
    batchInfos: BatchInfoWithOutput[];
    /** pagination defines the pagination in the response. */
    pagination?: PageResponse | undefined;
}
export declare const QueryBridgeRequest: {
    encode(message: QueryBridgeRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryBridgeRequest;
    fromJSON(object: any): QueryBridgeRequest;
    toJSON(message: QueryBridgeRequest): unknown;
    create<I extends Exact<DeepPartial<QueryBridgeRequest>, I>>(base?: I): QueryBridgeRequest;
    fromPartial<I extends Exact<DeepPartial<QueryBridgeRequest>, I>>(object: I): QueryBridgeRequest;
};
export declare const QueryBridgeResponse: {
    encode(message: QueryBridgeResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryBridgeResponse;
    fromJSON(object: any): QueryBridgeResponse;
    toJSON(message: QueryBridgeResponse): unknown;
    create<I extends Exact<DeepPartial<QueryBridgeResponse>, I>>(base?: I): QueryBridgeResponse;
    fromPartial<I extends Exact<DeepPartial<QueryBridgeResponse>, I>>(object: I): QueryBridgeResponse;
};
export declare const QueryBridgesRequest: {
    encode(message: QueryBridgesRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryBridgesRequest;
    fromJSON(object: any): QueryBridgesRequest;
    toJSON(message: QueryBridgesRequest): unknown;
    create<I extends Exact<DeepPartial<QueryBridgesRequest>, I>>(base?: I): QueryBridgesRequest;
    fromPartial<I extends Exact<DeepPartial<QueryBridgesRequest>, I>>(object: I): QueryBridgesRequest;
};
export declare const QueryBridgesResponse: {
    encode(message: QueryBridgesResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryBridgesResponse;
    fromJSON(object: any): QueryBridgesResponse;
    toJSON(message: QueryBridgesResponse): unknown;
    create<I extends Exact<DeepPartial<QueryBridgesResponse>, I>>(base?: I): QueryBridgesResponse;
    fromPartial<I extends Exact<DeepPartial<QueryBridgesResponse>, I>>(object: I): QueryBridgesResponse;
};
export declare const QueryTokenPairByL1DenomRequest: {
    encode(message: QueryTokenPairByL1DenomRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryTokenPairByL1DenomRequest;
    fromJSON(object: any): QueryTokenPairByL1DenomRequest;
    toJSON(message: QueryTokenPairByL1DenomRequest): unknown;
    create<I extends Exact<DeepPartial<QueryTokenPairByL1DenomRequest>, I>>(base?: I): QueryTokenPairByL1DenomRequest;
    fromPartial<I extends Exact<DeepPartial<QueryTokenPairByL1DenomRequest>, I>>(object: I): QueryTokenPairByL1DenomRequest;
};
export declare const QueryTokenPairByL1DenomResponse: {
    encode(message: QueryTokenPairByL1DenomResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryTokenPairByL1DenomResponse;
    fromJSON(object: any): QueryTokenPairByL1DenomResponse;
    toJSON(message: QueryTokenPairByL1DenomResponse): unknown;
    create<I extends Exact<DeepPartial<QueryTokenPairByL1DenomResponse>, I>>(base?: I): QueryTokenPairByL1DenomResponse;
    fromPartial<I extends Exact<DeepPartial<QueryTokenPairByL1DenomResponse>, I>>(object: I): QueryTokenPairByL1DenomResponse;
};
export declare const QueryTokenPairByL2DenomRequest: {
    encode(message: QueryTokenPairByL2DenomRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryTokenPairByL2DenomRequest;
    fromJSON(object: any): QueryTokenPairByL2DenomRequest;
    toJSON(message: QueryTokenPairByL2DenomRequest): unknown;
    create<I extends Exact<DeepPartial<QueryTokenPairByL2DenomRequest>, I>>(base?: I): QueryTokenPairByL2DenomRequest;
    fromPartial<I extends Exact<DeepPartial<QueryTokenPairByL2DenomRequest>, I>>(object: I): QueryTokenPairByL2DenomRequest;
};
export declare const QueryTokenPairByL2DenomResponse: {
    encode(message: QueryTokenPairByL2DenomResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryTokenPairByL2DenomResponse;
    fromJSON(object: any): QueryTokenPairByL2DenomResponse;
    toJSON(message: QueryTokenPairByL2DenomResponse): unknown;
    create<I extends Exact<DeepPartial<QueryTokenPairByL2DenomResponse>, I>>(base?: I): QueryTokenPairByL2DenomResponse;
    fromPartial<I extends Exact<DeepPartial<QueryTokenPairByL2DenomResponse>, I>>(object: I): QueryTokenPairByL2DenomResponse;
};
export declare const QueryTokenPairsRequest: {
    encode(message: QueryTokenPairsRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryTokenPairsRequest;
    fromJSON(object: any): QueryTokenPairsRequest;
    toJSON(message: QueryTokenPairsRequest): unknown;
    create<I extends Exact<DeepPartial<QueryTokenPairsRequest>, I>>(base?: I): QueryTokenPairsRequest;
    fromPartial<I extends Exact<DeepPartial<QueryTokenPairsRequest>, I>>(object: I): QueryTokenPairsRequest;
};
export declare const QueryTokenPairsResponse: {
    encode(message: QueryTokenPairsResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryTokenPairsResponse;
    fromJSON(object: any): QueryTokenPairsResponse;
    toJSON(message: QueryTokenPairsResponse): unknown;
    create<I extends Exact<DeepPartial<QueryTokenPairsResponse>, I>>(base?: I): QueryTokenPairsResponse;
    fromPartial<I extends Exact<DeepPartial<QueryTokenPairsResponse>, I>>(object: I): QueryTokenPairsResponse;
};
export declare const QueryLastFinalizedOutputRequest: {
    encode(message: QueryLastFinalizedOutputRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryLastFinalizedOutputRequest;
    fromJSON(object: any): QueryLastFinalizedOutputRequest;
    toJSON(message: QueryLastFinalizedOutputRequest): unknown;
    create<I extends Exact<DeepPartial<QueryLastFinalizedOutputRequest>, I>>(base?: I): QueryLastFinalizedOutputRequest;
    fromPartial<I extends Exact<DeepPartial<QueryLastFinalizedOutputRequest>, I>>(object: I): QueryLastFinalizedOutputRequest;
};
export declare const QueryLastFinalizedOutputResponse: {
    encode(message: QueryLastFinalizedOutputResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryLastFinalizedOutputResponse;
    fromJSON(object: any): QueryLastFinalizedOutputResponse;
    toJSON(message: QueryLastFinalizedOutputResponse): unknown;
    create<I extends Exact<DeepPartial<QueryLastFinalizedOutputResponse>, I>>(base?: I): QueryLastFinalizedOutputResponse;
    fromPartial<I extends Exact<DeepPartial<QueryLastFinalizedOutputResponse>, I>>(object: I): QueryLastFinalizedOutputResponse;
};
export declare const QueryOutputProposalRequest: {
    encode(message: QueryOutputProposalRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryOutputProposalRequest;
    fromJSON(object: any): QueryOutputProposalRequest;
    toJSON(message: QueryOutputProposalRequest): unknown;
    create<I extends Exact<DeepPartial<QueryOutputProposalRequest>, I>>(base?: I): QueryOutputProposalRequest;
    fromPartial<I extends Exact<DeepPartial<QueryOutputProposalRequest>, I>>(object: I): QueryOutputProposalRequest;
};
export declare const QueryOutputProposalResponse: {
    encode(message: QueryOutputProposalResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryOutputProposalResponse;
    fromJSON(object: any): QueryOutputProposalResponse;
    toJSON(message: QueryOutputProposalResponse): unknown;
    create<I extends Exact<DeepPartial<QueryOutputProposalResponse>, I>>(base?: I): QueryOutputProposalResponse;
    fromPartial<I extends Exact<DeepPartial<QueryOutputProposalResponse>, I>>(object: I): QueryOutputProposalResponse;
};
export declare const QueryOutputProposalsRequest: {
    encode(message: QueryOutputProposalsRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryOutputProposalsRequest;
    fromJSON(object: any): QueryOutputProposalsRequest;
    toJSON(message: QueryOutputProposalsRequest): unknown;
    create<I extends Exact<DeepPartial<QueryOutputProposalsRequest>, I>>(base?: I): QueryOutputProposalsRequest;
    fromPartial<I extends Exact<DeepPartial<QueryOutputProposalsRequest>, I>>(object: I): QueryOutputProposalsRequest;
};
export declare const QueryOutputProposalsResponse: {
    encode(message: QueryOutputProposalsResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryOutputProposalsResponse;
    fromJSON(object: any): QueryOutputProposalsResponse;
    toJSON(message: QueryOutputProposalsResponse): unknown;
    create<I extends Exact<DeepPartial<QueryOutputProposalsResponse>, I>>(base?: I): QueryOutputProposalsResponse;
    fromPartial<I extends Exact<DeepPartial<QueryOutputProposalsResponse>, I>>(object: I): QueryOutputProposalsResponse;
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
export declare const QueryClaimedRequest: {
    encode(message: QueryClaimedRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryClaimedRequest;
    fromJSON(object: any): QueryClaimedRequest;
    toJSON(message: QueryClaimedRequest): unknown;
    create<I extends Exact<DeepPartial<QueryClaimedRequest>, I>>(base?: I): QueryClaimedRequest;
    fromPartial<I extends Exact<DeepPartial<QueryClaimedRequest>, I>>(object: I): QueryClaimedRequest;
};
export declare const QueryClaimedResponse: {
    encode(message: QueryClaimedResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryClaimedResponse;
    fromJSON(object: any): QueryClaimedResponse;
    toJSON(message: QueryClaimedResponse): unknown;
    create<I extends Exact<DeepPartial<QueryClaimedResponse>, I>>(base?: I): QueryClaimedResponse;
    fromPartial<I extends Exact<DeepPartial<QueryClaimedResponse>, I>>(object: I): QueryClaimedResponse;
};
export declare const QueryNextL1SequenceRequest: {
    encode(message: QueryNextL1SequenceRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryNextL1SequenceRequest;
    fromJSON(object: any): QueryNextL1SequenceRequest;
    toJSON(message: QueryNextL1SequenceRequest): unknown;
    create<I extends Exact<DeepPartial<QueryNextL1SequenceRequest>, I>>(base?: I): QueryNextL1SequenceRequest;
    fromPartial<I extends Exact<DeepPartial<QueryNextL1SequenceRequest>, I>>(object: I): QueryNextL1SequenceRequest;
};
export declare const QueryNextL1SequenceResponse: {
    encode(message: QueryNextL1SequenceResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryNextL1SequenceResponse;
    fromJSON(object: any): QueryNextL1SequenceResponse;
    toJSON(message: QueryNextL1SequenceResponse): unknown;
    create<I extends Exact<DeepPartial<QueryNextL1SequenceResponse>, I>>(base?: I): QueryNextL1SequenceResponse;
    fromPartial<I extends Exact<DeepPartial<QueryNextL1SequenceResponse>, I>>(object: I): QueryNextL1SequenceResponse;
};
export declare const QueryBatchInfosRequest: {
    encode(message: QueryBatchInfosRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryBatchInfosRequest;
    fromJSON(object: any): QueryBatchInfosRequest;
    toJSON(message: QueryBatchInfosRequest): unknown;
    create<I extends Exact<DeepPartial<QueryBatchInfosRequest>, I>>(base?: I): QueryBatchInfosRequest;
    fromPartial<I extends Exact<DeepPartial<QueryBatchInfosRequest>, I>>(object: I): QueryBatchInfosRequest;
};
export declare const QueryBatchInfosResponse: {
    encode(message: QueryBatchInfosResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryBatchInfosResponse;
    fromJSON(object: any): QueryBatchInfosResponse;
    toJSON(message: QueryBatchInfosResponse): unknown;
    create<I extends Exact<DeepPartial<QueryBatchInfosResponse>, I>>(base?: I): QueryBatchInfosResponse;
    fromPartial<I extends Exact<DeepPartial<QueryBatchInfosResponse>, I>>(object: I): QueryBatchInfosResponse;
};
/** Query defines the gRPC querier service. */
export interface Query {
    /** Bridge queries bridge info. */
    Bridge(request: DeepPartial<QueryBridgeRequest>, metadata?: grpc.Metadata): Promise<QueryBridgeResponse>;
    /** Bridges queries bridge infos. */
    Bridges(request: DeepPartial<QueryBridgesRequest>, metadata?: grpc.Metadata): Promise<QueryBridgesResponse>;
    /** TokenPairByL1Denom queries token pair by l1 denom. */
    TokenPairByL1Denom(request: DeepPartial<QueryTokenPairByL1DenomRequest>, metadata?: grpc.Metadata): Promise<QueryTokenPairByL1DenomResponse>;
    /** TokenPairByL2Denom queries token pair by l2 denom. */
    TokenPairByL2Denom(request: DeepPartial<QueryTokenPairByL2DenomRequest>, metadata?: grpc.Metadata): Promise<QueryTokenPairByL2DenomResponse>;
    /** TokenPairs queries all (l1 denom, l2 denom) pair. */
    TokenPairs(request: DeepPartial<QueryTokenPairsRequest>, metadata?: grpc.Metadata): Promise<QueryTokenPairsResponse>;
    /** LastFinalizedOutput queries last finalized output. */
    LastFinalizedOutput(request: DeepPartial<QueryLastFinalizedOutputRequest>, metadata?: grpc.Metadata): Promise<QueryLastFinalizedOutputResponse>;
    /** OutputProposal queries output proposal by output index. */
    OutputProposal(request: DeepPartial<QueryOutputProposalRequest>, metadata?: grpc.Metadata): Promise<QueryOutputProposalResponse>;
    /** OutputProposals queries all output proposals. */
    OutputProposals(request: DeepPartial<QueryOutputProposalsRequest>, metadata?: grpc.Metadata): Promise<QueryOutputProposalsResponse>;
    /** Parameters queries the rollup parameters. */
    Params(request: DeepPartial<QueryParamsRequest>, metadata?: grpc.Metadata): Promise<QueryParamsResponse>;
    /** Claimed queries whether the output is claimed. */
    Claimed(request: DeepPartial<QueryClaimedRequest>, metadata?: grpc.Metadata): Promise<QueryClaimedResponse>;
    /** NextL1Sequence queries the next l1 sequence. */
    NextL1Sequence(request: DeepPartial<QueryNextL1SequenceRequest>, metadata?: grpc.Metadata): Promise<QueryNextL1SequenceResponse>;
    /** BatchInfos queries all batch infos. */
    BatchInfos(request: DeepPartial<QueryBatchInfosRequest>, metadata?: grpc.Metadata): Promise<QueryBatchInfosResponse>;
}
export declare class QueryClientImpl implements Query {
    private readonly rpc;
    constructor(rpc: Rpc);
    Bridge(request: DeepPartial<QueryBridgeRequest>, metadata?: grpc.Metadata): Promise<QueryBridgeResponse>;
    Bridges(request: DeepPartial<QueryBridgesRequest>, metadata?: grpc.Metadata): Promise<QueryBridgesResponse>;
    TokenPairByL1Denom(request: DeepPartial<QueryTokenPairByL1DenomRequest>, metadata?: grpc.Metadata): Promise<QueryTokenPairByL1DenomResponse>;
    TokenPairByL2Denom(request: DeepPartial<QueryTokenPairByL2DenomRequest>, metadata?: grpc.Metadata): Promise<QueryTokenPairByL2DenomResponse>;
    TokenPairs(request: DeepPartial<QueryTokenPairsRequest>, metadata?: grpc.Metadata): Promise<QueryTokenPairsResponse>;
    LastFinalizedOutput(request: DeepPartial<QueryLastFinalizedOutputRequest>, metadata?: grpc.Metadata): Promise<QueryLastFinalizedOutputResponse>;
    OutputProposal(request: DeepPartial<QueryOutputProposalRequest>, metadata?: grpc.Metadata): Promise<QueryOutputProposalResponse>;
    OutputProposals(request: DeepPartial<QueryOutputProposalsRequest>, metadata?: grpc.Metadata): Promise<QueryOutputProposalsResponse>;
    Params(request: DeepPartial<QueryParamsRequest>, metadata?: grpc.Metadata): Promise<QueryParamsResponse>;
    Claimed(request: DeepPartial<QueryClaimedRequest>, metadata?: grpc.Metadata): Promise<QueryClaimedResponse>;
    NextL1Sequence(request: DeepPartial<QueryNextL1SequenceRequest>, metadata?: grpc.Metadata): Promise<QueryNextL1SequenceResponse>;
    BatchInfos(request: DeepPartial<QueryBatchInfosRequest>, metadata?: grpc.Metadata): Promise<QueryBatchInfosResponse>;
}
export declare const QueryDesc: {
    serviceName: string;
};
export declare const QueryBridgeDesc: UnaryMethodDefinitionish;
export declare const QueryBridgesDesc: UnaryMethodDefinitionish;
export declare const QueryTokenPairByL1DenomDesc: UnaryMethodDefinitionish;
export declare const QueryTokenPairByL2DenomDesc: UnaryMethodDefinitionish;
export declare const QueryTokenPairsDesc: UnaryMethodDefinitionish;
export declare const QueryLastFinalizedOutputDesc: UnaryMethodDefinitionish;
export declare const QueryOutputProposalDesc: UnaryMethodDefinitionish;
export declare const QueryOutputProposalsDesc: UnaryMethodDefinitionish;
export declare const QueryParamsDesc: UnaryMethodDefinitionish;
export declare const QueryClaimedDesc: UnaryMethodDefinitionish;
export declare const QueryNextL1SequenceDesc: UnaryMethodDefinitionish;
export declare const QueryBatchInfosDesc: UnaryMethodDefinitionish;
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
