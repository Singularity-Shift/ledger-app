import { grpc } from "@improbable-eng/grpc-web";
import _m0 from "protobufjs/minimal";
import { DecCoin } from "../../../cosmos/base/v1beta1/coin";
export declare const protobufPackage = "initia.tx.v1";
/** QueryGasPricesRequest is the request type for the Query/GasPrices RPC method. */
export interface QueryGasPricesRequest {
}
/** QueryGasPricesResponse is the response type for the Query/GasPrices RPC method. */
export interface QueryGasPricesResponse {
    gasPrices: DecCoin[];
}
/** QueryGasPriceRequest is the request type for the Query/GasPrice RPC method. */
export interface QueryGasPriceRequest {
    /** denom defines the denomination of the gas price to query. */
    denom: string;
}
/** QueryGasPriceResponse is the response type for the Query/GasPrice RPC method. */
export interface QueryGasPriceResponse {
    gasPrice?: DecCoin | undefined;
}
export declare const QueryGasPricesRequest: {
    encode(_: QueryGasPricesRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryGasPricesRequest;
    fromJSON(_: any): QueryGasPricesRequest;
    toJSON(_: QueryGasPricesRequest): unknown;
    create(base?: DeepPartial<QueryGasPricesRequest>): QueryGasPricesRequest;
    fromPartial(_: DeepPartial<QueryGasPricesRequest>): QueryGasPricesRequest;
};
export declare const QueryGasPricesResponse: {
    encode(message: QueryGasPricesResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryGasPricesResponse;
    fromJSON(object: any): QueryGasPricesResponse;
    toJSON(message: QueryGasPricesResponse): unknown;
    create(base?: DeepPartial<QueryGasPricesResponse>): QueryGasPricesResponse;
    fromPartial(object: DeepPartial<QueryGasPricesResponse>): QueryGasPricesResponse;
};
export declare const QueryGasPriceRequest: {
    encode(message: QueryGasPriceRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryGasPriceRequest;
    fromJSON(object: any): QueryGasPriceRequest;
    toJSON(message: QueryGasPriceRequest): unknown;
    create(base?: DeepPartial<QueryGasPriceRequest>): QueryGasPriceRequest;
    fromPartial(object: DeepPartial<QueryGasPriceRequest>): QueryGasPriceRequest;
};
export declare const QueryGasPriceResponse: {
    encode(message: QueryGasPriceResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryGasPriceResponse;
    fromJSON(object: any): QueryGasPriceResponse;
    toJSON(message: QueryGasPriceResponse): unknown;
    create(base?: DeepPartial<QueryGasPriceResponse>): QueryGasPriceResponse;
    fromPartial(object: DeepPartial<QueryGasPriceResponse>): QueryGasPriceResponse;
};
/** Query provides defines the gRPC querier service. */
export interface Query {
    /** GasPrices returns the gas prices for the network. */
    GasPrices(request: DeepPartial<QueryGasPricesRequest>, metadata?: grpc.Metadata): Promise<QueryGasPricesResponse>;
    /** GasPrice returns the gas price for the network. */
    GasPrice(request: DeepPartial<QueryGasPriceRequest>, metadata?: grpc.Metadata): Promise<QueryGasPriceResponse>;
}
export declare class QueryClientImpl implements Query {
    private readonly rpc;
    constructor(rpc: Rpc);
    GasPrices(request: DeepPartial<QueryGasPricesRequest>, metadata?: grpc.Metadata): Promise<QueryGasPricesResponse>;
    GasPrice(request: DeepPartial<QueryGasPriceRequest>, metadata?: grpc.Metadata): Promise<QueryGasPriceResponse>;
}
export declare const QueryDesc: {
    serviceName: string;
};
export declare const QueryGasPricesDesc: UnaryMethodDefinitionish;
export declare const QueryGasPriceDesc: UnaryMethodDefinitionish;
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
