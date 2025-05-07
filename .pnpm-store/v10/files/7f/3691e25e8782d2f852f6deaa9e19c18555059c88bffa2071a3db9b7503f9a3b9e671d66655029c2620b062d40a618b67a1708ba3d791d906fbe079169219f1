import { grpc } from "@improbable-eng/grpc-web";
import _m0 from "protobufjs/minimal";
import { PageRequest, PageResponse } from "../../../../cosmos/base/query/v1beta1/pagination";
import { ChannelState } from "./types";
export declare const protobufPackage = "ibc.applications.perm.v1";
/** QueryChannelStatesRequest is the request type for the Query/ChannelStates RPC method. */
export interface QueryChannelStatesRequest {
    /** pagination defines an optional pagination for the request. */
    pagination?: PageRequest | undefined;
}
/** QueryChannelStatesResponse is the response type for the Query/ChannelStates RPC method. */
export interface QueryChannelStatesResponse {
    /** channel_states returns all stored ChannelState objects. */
    channelStates: ChannelState[];
    /** pagination defines the pagination in the response. */
    pagination?: PageResponse | undefined;
}
/** QueryChannelStateRequest is the request type for the Query/ChannelState RPC method. */
export interface QueryChannelStateRequest {
    channelId: string;
    portId: string;
}
/** QueryChannelStateResponse is the response type for the Query/ChannelState RPC method. */
export interface QueryChannelStateResponse {
    /** channel_state returns the stored ChannelState object. */
    channelState?: ChannelState | undefined;
}
export declare const QueryChannelStatesRequest: {
    encode(message: QueryChannelStatesRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryChannelStatesRequest;
    fromJSON(object: any): QueryChannelStatesRequest;
    toJSON(message: QueryChannelStatesRequest): unknown;
    create(base?: DeepPartial<QueryChannelStatesRequest>): QueryChannelStatesRequest;
    fromPartial(object: DeepPartial<QueryChannelStatesRequest>): QueryChannelStatesRequest;
};
export declare const QueryChannelStatesResponse: {
    encode(message: QueryChannelStatesResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryChannelStatesResponse;
    fromJSON(object: any): QueryChannelStatesResponse;
    toJSON(message: QueryChannelStatesResponse): unknown;
    create(base?: DeepPartial<QueryChannelStatesResponse>): QueryChannelStatesResponse;
    fromPartial(object: DeepPartial<QueryChannelStatesResponse>): QueryChannelStatesResponse;
};
export declare const QueryChannelStateRequest: {
    encode(message: QueryChannelStateRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryChannelStateRequest;
    fromJSON(object: any): QueryChannelStateRequest;
    toJSON(message: QueryChannelStateRequest): unknown;
    create(base?: DeepPartial<QueryChannelStateRequest>): QueryChannelStateRequest;
    fromPartial(object: DeepPartial<QueryChannelStateRequest>): QueryChannelStateRequest;
};
export declare const QueryChannelStateResponse: {
    encode(message: QueryChannelStateResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryChannelStateResponse;
    fromJSON(object: any): QueryChannelStateResponse;
    toJSON(message: QueryChannelStateResponse): unknown;
    create(base?: DeepPartial<QueryChannelStateResponse>): QueryChannelStateResponse;
    fromPartial(object: DeepPartial<QueryChannelStateResponse>): QueryChannelStateResponse;
};
/** Query provides defines the gRPC querier service. */
export interface Query {
    /** ChannelStates queries all channel states. */
    ChannelStates(request: DeepPartial<QueryChannelStatesRequest>, metadata?: grpc.Metadata): Promise<QueryChannelStatesResponse>;
    /** ChannelState queries the channel state for the specific port-id:channel-id pair. */
    ChannelState(request: DeepPartial<QueryChannelStateRequest>, metadata?: grpc.Metadata): Promise<QueryChannelStateResponse>;
}
export declare class QueryClientImpl implements Query {
    private readonly rpc;
    constructor(rpc: Rpc);
    ChannelStates(request: DeepPartial<QueryChannelStatesRequest>, metadata?: grpc.Metadata): Promise<QueryChannelStatesResponse>;
    ChannelState(request: DeepPartial<QueryChannelStateRequest>, metadata?: grpc.Metadata): Promise<QueryChannelStateResponse>;
}
export declare const QueryDesc: {
    serviceName: string;
};
export declare const QueryChannelStatesDesc: UnaryMethodDefinitionish;
export declare const QueryChannelStateDesc: UnaryMethodDefinitionish;
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
