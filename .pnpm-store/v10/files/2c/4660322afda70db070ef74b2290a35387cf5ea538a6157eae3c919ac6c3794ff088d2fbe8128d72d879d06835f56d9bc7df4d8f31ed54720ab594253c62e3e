import { grpc } from "@improbable-eng/grpc-web";
import _m0 from "protobufjs/minimal";
import { Market } from "./market";
import { Params } from "./params";
export declare const protobufPackage = "connect.marketmap.v2";
/**
 * MsgUpsertMarkets defines a message carrying a payload for performing market
 * upserts (update or create if does not exist) in the x/marketmap module.
 */
export interface MsgUpsertMarkets {
    /**
     * Authority is the signer of this transaction.  This authority must be
     * authorized by the module to execute the message.
     */
    authority: string;
    /**
     * CreateMarkets is the list of all markets to be created for the given
     * transaction.
     */
    markets: Market[];
}
/**
 * MsgUpsertMarketsResponse is the response from the UpsertMarkets API in the
 * x/marketmap module.
 */
export interface MsgUpsertMarketsResponse {
    /**
     * UpdatedMarkets is a map between the ticker and whether the market was
     * updated.
     * Deprecated: This field will be empty in all responses.
     *
     * @deprecated
     */
    marketUpdates: Map<string, boolean>;
}
export interface MsgUpsertMarketsResponse_MarketUpdatesEntry {
    key: string;
    value: boolean;
}
/**
 * MsgCreateMarkets defines a message carrying a payload for creating markets in
 * the x/marketmap module.
 */
export interface MsgCreateMarkets {
    /**
     * Authority is the signer of this transaction.  This authority must be
     * authorized by the module to execute the message.
     */
    authority: string;
    /**
     * CreateMarkets is the list of all markets to be created for the given
     * transaction.
     */
    createMarkets: Market[];
}
/** MsgUpdateMarketMapResponse is the response message for MsgUpdateMarketMap. */
export interface MsgCreateMarketsResponse {
}
/**
 * MsgUpdateMarkets defines a message carrying a payload for updating the
 * x/marketmap module.
 */
export interface MsgUpdateMarkets {
    /**
     * Authority is the signer of this transaction.  This authority must be
     * authorized by the module to execute the message.
     */
    authority: string;
    /**
     * UpdateMarkets is the list of all markets to be updated for the given
     * transaction.
     */
    updateMarkets: Market[];
}
/** MsgUpdateMarketsResponse is the response message for MsgUpdateMarkets. */
export interface MsgUpdateMarketsResponse {
}
/**
 * MsgParams defines the Msg/Params request type. It contains the
 * new parameters for the x/marketmap module.
 */
export interface MsgParams {
    /** Params defines the new parameters for the x/marketmap module. */
    params?: Params | undefined;
    /**
     * Authority defines the authority that is updating the x/marketmap module
     * parameters.
     */
    authority: string;
}
/** MsgParamsResponse defines the Msg/Params response type. */
export interface MsgParamsResponse {
}
/**
 * MsgRemoveMarketAuthorities defines the Msg/RemoveMarketAuthoritiesResponse
 * request type. It contains the new addresses to remove from the list of
 * authorities
 */
export interface MsgRemoveMarketAuthorities {
    /** RemoveAddresses is the list of addresses to remove. */
    removeAddresses: string[];
    /**
     * Admin defines the authority that is the x/marketmap
     * Admin account.  This account is set in the module parameters.
     */
    admin: string;
}
/**
 * MsgRemoveMarketAuthoritiesResponse defines the
 * Msg/RemoveMarketAuthoritiesResponse response type.
 */
export interface MsgRemoveMarketAuthoritiesResponse {
}
/**
 * MsgRemoveMarkets defines the Msg/RemoveMarkets request type. It contains the
 * new markets to be removed from the market map.
 */
export interface MsgRemoveMarkets {
    /**
     * Authority is the signer of this transaction.  This authority must be
     * authorized by the module to execute the message.
     */
    authority: string;
    /** Markets is the list of markets to remove. */
    markets: string[];
}
/**
 * MsgRemoveMarketsResponse defines the
 * Msg/MsgRemoveMarketsResponse response type.
 */
export interface MsgRemoveMarketsResponse {
    /** DeletedMarkets is the list of markets that were removed. */
    deletedMarkets: string[];
}
export declare const MsgUpsertMarkets: {
    encode(message: MsgUpsertMarkets, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgUpsertMarkets;
    fromJSON(object: any): MsgUpsertMarkets;
    toJSON(message: MsgUpsertMarkets): unknown;
    create(base?: DeepPartial<MsgUpsertMarkets>): MsgUpsertMarkets;
    fromPartial(object: DeepPartial<MsgUpsertMarkets>): MsgUpsertMarkets;
};
export declare const MsgUpsertMarketsResponse: {
    encode(message: MsgUpsertMarketsResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgUpsertMarketsResponse;
    fromJSON(object: any): MsgUpsertMarketsResponse;
    toJSON(message: MsgUpsertMarketsResponse): unknown;
    create(base?: DeepPartial<MsgUpsertMarketsResponse>): MsgUpsertMarketsResponse;
    fromPartial(object: DeepPartial<MsgUpsertMarketsResponse>): MsgUpsertMarketsResponse;
};
export declare const MsgUpsertMarketsResponse_MarketUpdatesEntry: {
    encode(message: MsgUpsertMarketsResponse_MarketUpdatesEntry, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgUpsertMarketsResponse_MarketUpdatesEntry;
    fromJSON(object: any): MsgUpsertMarketsResponse_MarketUpdatesEntry;
    toJSON(message: MsgUpsertMarketsResponse_MarketUpdatesEntry): unknown;
    create(base?: DeepPartial<MsgUpsertMarketsResponse_MarketUpdatesEntry>): MsgUpsertMarketsResponse_MarketUpdatesEntry;
    fromPartial(object: DeepPartial<MsgUpsertMarketsResponse_MarketUpdatesEntry>): MsgUpsertMarketsResponse_MarketUpdatesEntry;
};
export declare const MsgCreateMarkets: {
    encode(message: MsgCreateMarkets, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgCreateMarkets;
    fromJSON(object: any): MsgCreateMarkets;
    toJSON(message: MsgCreateMarkets): unknown;
    create(base?: DeepPartial<MsgCreateMarkets>): MsgCreateMarkets;
    fromPartial(object: DeepPartial<MsgCreateMarkets>): MsgCreateMarkets;
};
export declare const MsgCreateMarketsResponse: {
    encode(_: MsgCreateMarketsResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgCreateMarketsResponse;
    fromJSON(_: any): MsgCreateMarketsResponse;
    toJSON(_: MsgCreateMarketsResponse): unknown;
    create(base?: DeepPartial<MsgCreateMarketsResponse>): MsgCreateMarketsResponse;
    fromPartial(_: DeepPartial<MsgCreateMarketsResponse>): MsgCreateMarketsResponse;
};
export declare const MsgUpdateMarkets: {
    encode(message: MsgUpdateMarkets, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgUpdateMarkets;
    fromJSON(object: any): MsgUpdateMarkets;
    toJSON(message: MsgUpdateMarkets): unknown;
    create(base?: DeepPartial<MsgUpdateMarkets>): MsgUpdateMarkets;
    fromPartial(object: DeepPartial<MsgUpdateMarkets>): MsgUpdateMarkets;
};
export declare const MsgUpdateMarketsResponse: {
    encode(_: MsgUpdateMarketsResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgUpdateMarketsResponse;
    fromJSON(_: any): MsgUpdateMarketsResponse;
    toJSON(_: MsgUpdateMarketsResponse): unknown;
    create(base?: DeepPartial<MsgUpdateMarketsResponse>): MsgUpdateMarketsResponse;
    fromPartial(_: DeepPartial<MsgUpdateMarketsResponse>): MsgUpdateMarketsResponse;
};
export declare const MsgParams: {
    encode(message: MsgParams, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgParams;
    fromJSON(object: any): MsgParams;
    toJSON(message: MsgParams): unknown;
    create(base?: DeepPartial<MsgParams>): MsgParams;
    fromPartial(object: DeepPartial<MsgParams>): MsgParams;
};
export declare const MsgParamsResponse: {
    encode(_: MsgParamsResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgParamsResponse;
    fromJSON(_: any): MsgParamsResponse;
    toJSON(_: MsgParamsResponse): unknown;
    create(base?: DeepPartial<MsgParamsResponse>): MsgParamsResponse;
    fromPartial(_: DeepPartial<MsgParamsResponse>): MsgParamsResponse;
};
export declare const MsgRemoveMarketAuthorities: {
    encode(message: MsgRemoveMarketAuthorities, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgRemoveMarketAuthorities;
    fromJSON(object: any): MsgRemoveMarketAuthorities;
    toJSON(message: MsgRemoveMarketAuthorities): unknown;
    create(base?: DeepPartial<MsgRemoveMarketAuthorities>): MsgRemoveMarketAuthorities;
    fromPartial(object: DeepPartial<MsgRemoveMarketAuthorities>): MsgRemoveMarketAuthorities;
};
export declare const MsgRemoveMarketAuthoritiesResponse: {
    encode(_: MsgRemoveMarketAuthoritiesResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgRemoveMarketAuthoritiesResponse;
    fromJSON(_: any): MsgRemoveMarketAuthoritiesResponse;
    toJSON(_: MsgRemoveMarketAuthoritiesResponse): unknown;
    create(base?: DeepPartial<MsgRemoveMarketAuthoritiesResponse>): MsgRemoveMarketAuthoritiesResponse;
    fromPartial(_: DeepPartial<MsgRemoveMarketAuthoritiesResponse>): MsgRemoveMarketAuthoritiesResponse;
};
export declare const MsgRemoveMarkets: {
    encode(message: MsgRemoveMarkets, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgRemoveMarkets;
    fromJSON(object: any): MsgRemoveMarkets;
    toJSON(message: MsgRemoveMarkets): unknown;
    create(base?: DeepPartial<MsgRemoveMarkets>): MsgRemoveMarkets;
    fromPartial(object: DeepPartial<MsgRemoveMarkets>): MsgRemoveMarkets;
};
export declare const MsgRemoveMarketsResponse: {
    encode(message: MsgRemoveMarketsResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgRemoveMarketsResponse;
    fromJSON(object: any): MsgRemoveMarketsResponse;
    toJSON(message: MsgRemoveMarketsResponse): unknown;
    create(base?: DeepPartial<MsgRemoveMarketsResponse>): MsgRemoveMarketsResponse;
    fromPartial(object: DeepPartial<MsgRemoveMarketsResponse>): MsgRemoveMarketsResponse;
};
/** Msg is the message service for the x/marketmap module. */
export interface Msg {
    /** CreateMarkets creates markets from the given message. */
    CreateMarkets(request: DeepPartial<MsgCreateMarkets>, metadata?: grpc.Metadata): Promise<MsgCreateMarketsResponse>;
    /** UpdateMarkets updates markets from the given message. */
    UpdateMarkets(request: DeepPartial<MsgUpdateMarkets>, metadata?: grpc.Metadata): Promise<MsgUpdateMarketsResponse>;
    /**
     * UpdateParams defines a method for updating the x/marketmap module
     * parameters.
     */
    UpdateParams(request: DeepPartial<MsgParams>, metadata?: grpc.Metadata): Promise<MsgParamsResponse>;
    /**
     * RemoveMarketAuthorities defines a method for removing market authorities
     * from the x/marketmap module. the signer must be the admin.
     */
    RemoveMarketAuthorities(request: DeepPartial<MsgRemoveMarketAuthorities>, metadata?: grpc.Metadata): Promise<MsgRemoveMarketAuthoritiesResponse>;
    /**
     * UpsertMarkets wraps both Create / Update markets into a single message.
     * Specifically if a market does not exist it will be created, otherwise it
     * will be updated. The response will be a map between ticker -> updated.
     */
    UpsertMarkets(request: DeepPartial<MsgUpsertMarkets>, metadata?: grpc.Metadata): Promise<MsgUpsertMarketsResponse>;
    /**
     * RemoveMarkets removes the given markets from the marketmap if:
     * - they exist in the map
     * - they are disabled
     */
    RemoveMarkets(request: DeepPartial<MsgRemoveMarkets>, metadata?: grpc.Metadata): Promise<MsgRemoveMarketsResponse>;
}
export declare class MsgClientImpl implements Msg {
    private readonly rpc;
    constructor(rpc: Rpc);
    CreateMarkets(request: DeepPartial<MsgCreateMarkets>, metadata?: grpc.Metadata): Promise<MsgCreateMarketsResponse>;
    UpdateMarkets(request: DeepPartial<MsgUpdateMarkets>, metadata?: grpc.Metadata): Promise<MsgUpdateMarketsResponse>;
    UpdateParams(request: DeepPartial<MsgParams>, metadata?: grpc.Metadata): Promise<MsgParamsResponse>;
    RemoveMarketAuthorities(request: DeepPartial<MsgRemoveMarketAuthorities>, metadata?: grpc.Metadata): Promise<MsgRemoveMarketAuthoritiesResponse>;
    UpsertMarkets(request: DeepPartial<MsgUpsertMarkets>, metadata?: grpc.Metadata): Promise<MsgUpsertMarketsResponse>;
    RemoveMarkets(request: DeepPartial<MsgRemoveMarkets>, metadata?: grpc.Metadata): Promise<MsgRemoveMarketsResponse>;
}
export declare const MsgDesc: {
    serviceName: string;
};
export declare const MsgCreateMarketsDesc: UnaryMethodDefinitionish;
export declare const MsgUpdateMarketsDesc: UnaryMethodDefinitionish;
export declare const MsgUpdateParamsDesc: UnaryMethodDefinitionish;
export declare const MsgRemoveMarketAuthoritiesDesc: UnaryMethodDefinitionish;
export declare const MsgUpsertMarketsDesc: UnaryMethodDefinitionish;
export declare const MsgRemoveMarketsDesc: UnaryMethodDefinitionish;
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
