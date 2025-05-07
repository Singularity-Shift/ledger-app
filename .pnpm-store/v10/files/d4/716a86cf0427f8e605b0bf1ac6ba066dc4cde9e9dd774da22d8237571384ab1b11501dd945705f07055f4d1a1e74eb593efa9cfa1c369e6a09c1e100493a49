import { grpc } from "@improbable-eng/grpc-web";
import _m0 from "protobufjs/minimal";
import { Coin } from "../../../cosmos/base/v1beta1/coin";
export declare const protobufPackage = "noble.forwarding.v1";
export interface QueryDenoms {
}
export interface QueryDenomsResponse {
    allowedDenoms: string[];
}
export interface QueryAddress {
    channel: string;
    recipient: string;
    fallback: string;
}
export interface QueryAddressResponse {
    address: string;
    exists: boolean;
}
export interface QueryStats {
}
export interface QueryStatsResponse {
    stats: Map<string, Stats>;
}
export interface QueryStatsResponse_StatsEntry {
    key: string;
    value?: Stats | undefined;
}
export interface QueryStatsByChannel {
    channel: string;
}
export interface QueryStatsByChannelResponse {
    numOfAccounts: bigint;
    numOfForwards: bigint;
    totalForwarded: Coin[];
}
export interface Stats {
    chainId: string;
    numOfAccounts: bigint;
    numOfForwards: bigint;
    totalForwarded: Coin[];
}
export declare const QueryDenoms: {
    encode(_: QueryDenoms, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryDenoms;
    fromJSON(_: any): QueryDenoms;
    toJSON(_: QueryDenoms): unknown;
    create(base?: DeepPartial<QueryDenoms>): QueryDenoms;
    fromPartial(_: DeepPartial<QueryDenoms>): QueryDenoms;
};
export declare const QueryDenomsResponse: {
    encode(message: QueryDenomsResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryDenomsResponse;
    fromJSON(object: any): QueryDenomsResponse;
    toJSON(message: QueryDenomsResponse): unknown;
    create(base?: DeepPartial<QueryDenomsResponse>): QueryDenomsResponse;
    fromPartial(object: DeepPartial<QueryDenomsResponse>): QueryDenomsResponse;
};
export declare const QueryAddress: {
    encode(message: QueryAddress, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryAddress;
    fromJSON(object: any): QueryAddress;
    toJSON(message: QueryAddress): unknown;
    create(base?: DeepPartial<QueryAddress>): QueryAddress;
    fromPartial(object: DeepPartial<QueryAddress>): QueryAddress;
};
export declare const QueryAddressResponse: {
    encode(message: QueryAddressResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryAddressResponse;
    fromJSON(object: any): QueryAddressResponse;
    toJSON(message: QueryAddressResponse): unknown;
    create(base?: DeepPartial<QueryAddressResponse>): QueryAddressResponse;
    fromPartial(object: DeepPartial<QueryAddressResponse>): QueryAddressResponse;
};
export declare const QueryStats: {
    encode(_: QueryStats, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryStats;
    fromJSON(_: any): QueryStats;
    toJSON(_: QueryStats): unknown;
    create(base?: DeepPartial<QueryStats>): QueryStats;
    fromPartial(_: DeepPartial<QueryStats>): QueryStats;
};
export declare const QueryStatsResponse: {
    encode(message: QueryStatsResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryStatsResponse;
    fromJSON(object: any): QueryStatsResponse;
    toJSON(message: QueryStatsResponse): unknown;
    create(base?: DeepPartial<QueryStatsResponse>): QueryStatsResponse;
    fromPartial(object: DeepPartial<QueryStatsResponse>): QueryStatsResponse;
};
export declare const QueryStatsResponse_StatsEntry: {
    encode(message: QueryStatsResponse_StatsEntry, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryStatsResponse_StatsEntry;
    fromJSON(object: any): QueryStatsResponse_StatsEntry;
    toJSON(message: QueryStatsResponse_StatsEntry): unknown;
    create(base?: DeepPartial<QueryStatsResponse_StatsEntry>): QueryStatsResponse_StatsEntry;
    fromPartial(object: DeepPartial<QueryStatsResponse_StatsEntry>): QueryStatsResponse_StatsEntry;
};
export declare const QueryStatsByChannel: {
    encode(message: QueryStatsByChannel, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryStatsByChannel;
    fromJSON(object: any): QueryStatsByChannel;
    toJSON(message: QueryStatsByChannel): unknown;
    create(base?: DeepPartial<QueryStatsByChannel>): QueryStatsByChannel;
    fromPartial(object: DeepPartial<QueryStatsByChannel>): QueryStatsByChannel;
};
export declare const QueryStatsByChannelResponse: {
    encode(message: QueryStatsByChannelResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryStatsByChannelResponse;
    fromJSON(object: any): QueryStatsByChannelResponse;
    toJSON(message: QueryStatsByChannelResponse): unknown;
    create(base?: DeepPartial<QueryStatsByChannelResponse>): QueryStatsByChannelResponse;
    fromPartial(object: DeepPartial<QueryStatsByChannelResponse>): QueryStatsByChannelResponse;
};
export declare const Stats: {
    encode(message: Stats, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): Stats;
    fromJSON(object: any): Stats;
    toJSON(message: Stats): unknown;
    create(base?: DeepPartial<Stats>): Stats;
    fromPartial(object: DeepPartial<Stats>): Stats;
};
export interface Query {
    Denoms(request: DeepPartial<QueryDenoms>, metadata?: grpc.Metadata): Promise<QueryDenomsResponse>;
    Address(request: DeepPartial<QueryAddress>, metadata?: grpc.Metadata): Promise<QueryAddressResponse>;
    Stats(request: DeepPartial<QueryStats>, metadata?: grpc.Metadata): Promise<QueryStatsResponse>;
    StatsByChannel(request: DeepPartial<QueryStatsByChannel>, metadata?: grpc.Metadata): Promise<QueryStatsByChannelResponse>;
}
export declare class QueryClientImpl implements Query {
    private readonly rpc;
    constructor(rpc: Rpc);
    Denoms(request: DeepPartial<QueryDenoms>, metadata?: grpc.Metadata): Promise<QueryDenomsResponse>;
    Address(request: DeepPartial<QueryAddress>, metadata?: grpc.Metadata): Promise<QueryAddressResponse>;
    Stats(request: DeepPartial<QueryStats>, metadata?: grpc.Metadata): Promise<QueryStatsResponse>;
    StatsByChannel(request: DeepPartial<QueryStatsByChannel>, metadata?: grpc.Metadata): Promise<QueryStatsByChannelResponse>;
}
export declare const QueryDesc: {
    serviceName: string;
};
export declare const QueryDenomsDesc: UnaryMethodDefinitionish;
export declare const QueryAddressDesc: UnaryMethodDefinitionish;
export declare const QueryStatsDesc: UnaryMethodDefinitionish;
export declare const QueryStatsByChannelDesc: UnaryMethodDefinitionish;
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
