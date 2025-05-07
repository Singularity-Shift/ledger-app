import { grpc } from "@improbable-eng/grpc-web";
import _m0 from "protobufjs/minimal";
import { Coin } from "../../../cosmos/base/v1beta1/coin";
import { BatchInfo, BridgeConfig, Params } from "./types";
export declare const protobufPackage = "opinit.ophost.v1";
/** MsgRecordBatch is no_op message, which is only for tx indexing. */
export interface MsgRecordBatch {
    submitter: string;
    bridgeId: bigint;
    batchBytes: Uint8Array;
}
/** MsgRecordBatchResponse returns MsgRecordBatch message result data */
export interface MsgRecordBatchResponse {
}
/**
 * MsgCreateBridge is a message to register a new bridge with
 * new bridge id.
 */
export interface MsgCreateBridge {
    creator: string;
    config?: BridgeConfig | undefined;
}
/**
 * MsgCreateBridgeResponse returns MsgCreateBridge message
 * result data
 */
export interface MsgCreateBridgeResponse {
    bridgeId: bigint;
}
/** MsgProposeOutput is a message to submit l2 block proposal. */
export interface MsgProposeOutput {
    proposer: string;
    bridgeId: bigint;
    outputIndex: bigint;
    l2BlockNumber: bigint;
    outputRoot: Uint8Array;
}
/** MsgProposeOutputResponse returns deposit result data */
export interface MsgProposeOutputResponse {
}
/**
 * MsgDeleteOutput is a message to delete unfinalized l2 output proposals
 * in [outputIndex, nextOutputIndex) range.
 */
export interface MsgDeleteOutput {
    challenger: string;
    bridgeId: bigint;
    outputIndex: bigint;
}
/** MsgDeleteOutputResponse returns a message handle result. */
export interface MsgDeleteOutputResponse {
}
/** MsgInitiateTokenDeposit is a message to deposit a new token from L1 to L2. */
export interface MsgInitiateTokenDeposit {
    sender: string;
    bridgeId: bigint;
    to: string;
    amount?: Coin | undefined;
    data: Uint8Array;
}
/** MsgInitiateTokenDepositResponse returns a message handle result. */
export interface MsgInitiateTokenDepositResponse {
    sequence: bigint;
}
/** MsgFinalizeTokenWithdrawal is a message finalizing funds withdrawal from L2. */
export interface MsgFinalizeTokenWithdrawal {
    sender: string;
    bridgeId: bigint;
    outputIndex: bigint;
    withdrawalProofs: Uint8Array[];
    from: string;
    to: string;
    sequence: bigint;
    amount?: Coin | undefined;
    /** version of the output root */
    version: Uint8Array;
    storageRoot: Uint8Array;
    lastBlockHash: Uint8Array;
}
/** MsgFinalizeTokenWithdrawalResponse returns a message handle result. */
export interface MsgFinalizeTokenWithdrawalResponse {
}
/** MsgUpdateProposer is a message to change a proposer */
export interface MsgUpdateProposer {
    /**
     * authority is the address that controls the module (defaults to x/gov unless overwritten)
     * or the current proposer address.
     */
    authority: string;
    bridgeId: bigint;
    newProposer: string;
}
/** MsgUpdateProposerResponse returns a message handle result. */
export interface MsgUpdateProposerResponse {
    /** last finalized output index */
    outputIndex: bigint;
    /** last finalized l2 block number */
    l2BlockNumber: bigint;
}
/** MsgUpdateChallenger is a message to change a challenger */
export interface MsgUpdateChallenger {
    /**
     * authority is the address that controls the module (defaults to x/gov unless overwritten)
     * or the current challenger address.
     *
     * If the given authority is a challenger address, it has the ability to replace itself with another address.
     */
    authority: string;
    bridgeId: bigint;
    challenger: string;
}
/** MsgUpdateChallengerResponse returns a message handle result. */
export interface MsgUpdateChallengerResponse {
    /** last finalized output index */
    outputIndex: bigint;
    /** last finalized l2 block number */
    l2BlockNumber: bigint;
}
/** MsgUpdateBatchInfo is a message to change a batch info */
export interface MsgUpdateBatchInfo {
    /**
     * authority is the address that controls the module (defaults to x/gov unless overwritten)
     * or the current proposer address.
     */
    authority: string;
    bridgeId: bigint;
    newBatchInfo?: BatchInfo | undefined;
}
/** MsgUpdateBatchInfoResponse returns a message handle result. */
export interface MsgUpdateBatchInfoResponse {
    /** last finalized output index */
    outputIndex: bigint;
    /** last finalized l2 block number */
    l2BlockNumber: bigint;
}
/** MsgUpdateOracleFlag is a message to change oracle config */
export interface MsgUpdateOracleConfig {
    /**
     * authority is the address that controls the module (defaults to x/gov unless overwritten)
     * or the current proposer address.
     */
    authority: string;
    bridgeId: bigint;
    oracleEnabled: boolean;
}
/** MsgUpdateOracleFlagResponse returns a message handle result. */
export interface MsgUpdateOracleConfigResponse {
}
/** MsgUpdateMetadata is a message to change metadata */
export interface MsgUpdateMetadata {
    /**
     * authority is the address that controls the module (defaults to x/gov unless overwritten)
     * or the current challenger address.
     *
     * If the given authority is a challenger address, it has the ability to replace oneself to another address or remove
     * oneself.
     */
    authority: string;
    bridgeId: bigint;
    metadata: Uint8Array;
}
/** MsgUpdateMetadataResponse returns a message handle result. */
export interface MsgUpdateMetadataResponse {
    /** last finalized output index */
    outputIndex: bigint;
    /** last finalized l2 block number */
    l2BlockNumber: bigint;
}
/** MsgUpdateParams is a message to update parameters */
export interface MsgUpdateParams {
    /**
     * authority is the address that controls the module
     * (defaults to x/gov unless overwritten).
     */
    authority: string;
    /** params are the arbitrary parameters to be updated. */
    params?: Params | undefined;
}
/** MsgUpdateParamsResponse returns a message handle result. */
export interface MsgUpdateParamsResponse {
}
export declare const MsgRecordBatch: {
    encode(message: MsgRecordBatch, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgRecordBatch;
    fromJSON(object: any): MsgRecordBatch;
    toJSON(message: MsgRecordBatch): unknown;
    create<I extends Exact<DeepPartial<MsgRecordBatch>, I>>(base?: I): MsgRecordBatch;
    fromPartial<I extends Exact<DeepPartial<MsgRecordBatch>, I>>(object: I): MsgRecordBatch;
};
export declare const MsgRecordBatchResponse: {
    encode(_: MsgRecordBatchResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgRecordBatchResponse;
    fromJSON(_: any): MsgRecordBatchResponse;
    toJSON(_: MsgRecordBatchResponse): unknown;
    create<I extends Exact<DeepPartial<MsgRecordBatchResponse>, I>>(base?: I): MsgRecordBatchResponse;
    fromPartial<I extends Exact<DeepPartial<MsgRecordBatchResponse>, I>>(_: I): MsgRecordBatchResponse;
};
export declare const MsgCreateBridge: {
    encode(message: MsgCreateBridge, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgCreateBridge;
    fromJSON(object: any): MsgCreateBridge;
    toJSON(message: MsgCreateBridge): unknown;
    create<I extends Exact<DeepPartial<MsgCreateBridge>, I>>(base?: I): MsgCreateBridge;
    fromPartial<I extends Exact<DeepPartial<MsgCreateBridge>, I>>(object: I): MsgCreateBridge;
};
export declare const MsgCreateBridgeResponse: {
    encode(message: MsgCreateBridgeResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgCreateBridgeResponse;
    fromJSON(object: any): MsgCreateBridgeResponse;
    toJSON(message: MsgCreateBridgeResponse): unknown;
    create<I extends Exact<DeepPartial<MsgCreateBridgeResponse>, I>>(base?: I): MsgCreateBridgeResponse;
    fromPartial<I extends Exact<DeepPartial<MsgCreateBridgeResponse>, I>>(object: I): MsgCreateBridgeResponse;
};
export declare const MsgProposeOutput: {
    encode(message: MsgProposeOutput, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgProposeOutput;
    fromJSON(object: any): MsgProposeOutput;
    toJSON(message: MsgProposeOutput): unknown;
    create<I extends Exact<DeepPartial<MsgProposeOutput>, I>>(base?: I): MsgProposeOutput;
    fromPartial<I extends Exact<DeepPartial<MsgProposeOutput>, I>>(object: I): MsgProposeOutput;
};
export declare const MsgProposeOutputResponse: {
    encode(_: MsgProposeOutputResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgProposeOutputResponse;
    fromJSON(_: any): MsgProposeOutputResponse;
    toJSON(_: MsgProposeOutputResponse): unknown;
    create<I extends Exact<DeepPartial<MsgProposeOutputResponse>, I>>(base?: I): MsgProposeOutputResponse;
    fromPartial<I extends Exact<DeepPartial<MsgProposeOutputResponse>, I>>(_: I): MsgProposeOutputResponse;
};
export declare const MsgDeleteOutput: {
    encode(message: MsgDeleteOutput, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgDeleteOutput;
    fromJSON(object: any): MsgDeleteOutput;
    toJSON(message: MsgDeleteOutput): unknown;
    create<I extends Exact<DeepPartial<MsgDeleteOutput>, I>>(base?: I): MsgDeleteOutput;
    fromPartial<I extends Exact<DeepPartial<MsgDeleteOutput>, I>>(object: I): MsgDeleteOutput;
};
export declare const MsgDeleteOutputResponse: {
    encode(_: MsgDeleteOutputResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgDeleteOutputResponse;
    fromJSON(_: any): MsgDeleteOutputResponse;
    toJSON(_: MsgDeleteOutputResponse): unknown;
    create<I extends Exact<DeepPartial<MsgDeleteOutputResponse>, I>>(base?: I): MsgDeleteOutputResponse;
    fromPartial<I extends Exact<DeepPartial<MsgDeleteOutputResponse>, I>>(_: I): MsgDeleteOutputResponse;
};
export declare const MsgInitiateTokenDeposit: {
    encode(message: MsgInitiateTokenDeposit, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgInitiateTokenDeposit;
    fromJSON(object: any): MsgInitiateTokenDeposit;
    toJSON(message: MsgInitiateTokenDeposit): unknown;
    create<I extends Exact<DeepPartial<MsgInitiateTokenDeposit>, I>>(base?: I): MsgInitiateTokenDeposit;
    fromPartial<I extends Exact<DeepPartial<MsgInitiateTokenDeposit>, I>>(object: I): MsgInitiateTokenDeposit;
};
export declare const MsgInitiateTokenDepositResponse: {
    encode(message: MsgInitiateTokenDepositResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgInitiateTokenDepositResponse;
    fromJSON(object: any): MsgInitiateTokenDepositResponse;
    toJSON(message: MsgInitiateTokenDepositResponse): unknown;
    create<I extends Exact<DeepPartial<MsgInitiateTokenDepositResponse>, I>>(base?: I): MsgInitiateTokenDepositResponse;
    fromPartial<I extends Exact<DeepPartial<MsgInitiateTokenDepositResponse>, I>>(object: I): MsgInitiateTokenDepositResponse;
};
export declare const MsgFinalizeTokenWithdrawal: {
    encode(message: MsgFinalizeTokenWithdrawal, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgFinalizeTokenWithdrawal;
    fromJSON(object: any): MsgFinalizeTokenWithdrawal;
    toJSON(message: MsgFinalizeTokenWithdrawal): unknown;
    create<I extends Exact<DeepPartial<MsgFinalizeTokenWithdrawal>, I>>(base?: I): MsgFinalizeTokenWithdrawal;
    fromPartial<I extends Exact<DeepPartial<MsgFinalizeTokenWithdrawal>, I>>(object: I): MsgFinalizeTokenWithdrawal;
};
export declare const MsgFinalizeTokenWithdrawalResponse: {
    encode(_: MsgFinalizeTokenWithdrawalResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgFinalizeTokenWithdrawalResponse;
    fromJSON(_: any): MsgFinalizeTokenWithdrawalResponse;
    toJSON(_: MsgFinalizeTokenWithdrawalResponse): unknown;
    create<I extends Exact<DeepPartial<MsgFinalizeTokenWithdrawalResponse>, I>>(base?: I): MsgFinalizeTokenWithdrawalResponse;
    fromPartial<I extends Exact<DeepPartial<MsgFinalizeTokenWithdrawalResponse>, I>>(_: I): MsgFinalizeTokenWithdrawalResponse;
};
export declare const MsgUpdateProposer: {
    encode(message: MsgUpdateProposer, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgUpdateProposer;
    fromJSON(object: any): MsgUpdateProposer;
    toJSON(message: MsgUpdateProposer): unknown;
    create<I extends Exact<DeepPartial<MsgUpdateProposer>, I>>(base?: I): MsgUpdateProposer;
    fromPartial<I extends Exact<DeepPartial<MsgUpdateProposer>, I>>(object: I): MsgUpdateProposer;
};
export declare const MsgUpdateProposerResponse: {
    encode(message: MsgUpdateProposerResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgUpdateProposerResponse;
    fromJSON(object: any): MsgUpdateProposerResponse;
    toJSON(message: MsgUpdateProposerResponse): unknown;
    create<I extends Exact<DeepPartial<MsgUpdateProposerResponse>, I>>(base?: I): MsgUpdateProposerResponse;
    fromPartial<I extends Exact<DeepPartial<MsgUpdateProposerResponse>, I>>(object: I): MsgUpdateProposerResponse;
};
export declare const MsgUpdateChallenger: {
    encode(message: MsgUpdateChallenger, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgUpdateChallenger;
    fromJSON(object: any): MsgUpdateChallenger;
    toJSON(message: MsgUpdateChallenger): unknown;
    create<I extends Exact<DeepPartial<MsgUpdateChallenger>, I>>(base?: I): MsgUpdateChallenger;
    fromPartial<I extends Exact<DeepPartial<MsgUpdateChallenger>, I>>(object: I): MsgUpdateChallenger;
};
export declare const MsgUpdateChallengerResponse: {
    encode(message: MsgUpdateChallengerResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgUpdateChallengerResponse;
    fromJSON(object: any): MsgUpdateChallengerResponse;
    toJSON(message: MsgUpdateChallengerResponse): unknown;
    create<I extends Exact<DeepPartial<MsgUpdateChallengerResponse>, I>>(base?: I): MsgUpdateChallengerResponse;
    fromPartial<I extends Exact<DeepPartial<MsgUpdateChallengerResponse>, I>>(object: I): MsgUpdateChallengerResponse;
};
export declare const MsgUpdateBatchInfo: {
    encode(message: MsgUpdateBatchInfo, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgUpdateBatchInfo;
    fromJSON(object: any): MsgUpdateBatchInfo;
    toJSON(message: MsgUpdateBatchInfo): unknown;
    create<I extends Exact<DeepPartial<MsgUpdateBatchInfo>, I>>(base?: I): MsgUpdateBatchInfo;
    fromPartial<I extends Exact<DeepPartial<MsgUpdateBatchInfo>, I>>(object: I): MsgUpdateBatchInfo;
};
export declare const MsgUpdateBatchInfoResponse: {
    encode(message: MsgUpdateBatchInfoResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgUpdateBatchInfoResponse;
    fromJSON(object: any): MsgUpdateBatchInfoResponse;
    toJSON(message: MsgUpdateBatchInfoResponse): unknown;
    create<I extends Exact<DeepPartial<MsgUpdateBatchInfoResponse>, I>>(base?: I): MsgUpdateBatchInfoResponse;
    fromPartial<I extends Exact<DeepPartial<MsgUpdateBatchInfoResponse>, I>>(object: I): MsgUpdateBatchInfoResponse;
};
export declare const MsgUpdateOracleConfig: {
    encode(message: MsgUpdateOracleConfig, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgUpdateOracleConfig;
    fromJSON(object: any): MsgUpdateOracleConfig;
    toJSON(message: MsgUpdateOracleConfig): unknown;
    create<I extends Exact<DeepPartial<MsgUpdateOracleConfig>, I>>(base?: I): MsgUpdateOracleConfig;
    fromPartial<I extends Exact<DeepPartial<MsgUpdateOracleConfig>, I>>(object: I): MsgUpdateOracleConfig;
};
export declare const MsgUpdateOracleConfigResponse: {
    encode(_: MsgUpdateOracleConfigResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgUpdateOracleConfigResponse;
    fromJSON(_: any): MsgUpdateOracleConfigResponse;
    toJSON(_: MsgUpdateOracleConfigResponse): unknown;
    create<I extends Exact<DeepPartial<MsgUpdateOracleConfigResponse>, I>>(base?: I): MsgUpdateOracleConfigResponse;
    fromPartial<I extends Exact<DeepPartial<MsgUpdateOracleConfigResponse>, I>>(_: I): MsgUpdateOracleConfigResponse;
};
export declare const MsgUpdateMetadata: {
    encode(message: MsgUpdateMetadata, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgUpdateMetadata;
    fromJSON(object: any): MsgUpdateMetadata;
    toJSON(message: MsgUpdateMetadata): unknown;
    create<I extends Exact<DeepPartial<MsgUpdateMetadata>, I>>(base?: I): MsgUpdateMetadata;
    fromPartial<I extends Exact<DeepPartial<MsgUpdateMetadata>, I>>(object: I): MsgUpdateMetadata;
};
export declare const MsgUpdateMetadataResponse: {
    encode(message: MsgUpdateMetadataResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgUpdateMetadataResponse;
    fromJSON(object: any): MsgUpdateMetadataResponse;
    toJSON(message: MsgUpdateMetadataResponse): unknown;
    create<I extends Exact<DeepPartial<MsgUpdateMetadataResponse>, I>>(base?: I): MsgUpdateMetadataResponse;
    fromPartial<I extends Exact<DeepPartial<MsgUpdateMetadataResponse>, I>>(object: I): MsgUpdateMetadataResponse;
};
export declare const MsgUpdateParams: {
    encode(message: MsgUpdateParams, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgUpdateParams;
    fromJSON(object: any): MsgUpdateParams;
    toJSON(message: MsgUpdateParams): unknown;
    create<I extends Exact<DeepPartial<MsgUpdateParams>, I>>(base?: I): MsgUpdateParams;
    fromPartial<I extends Exact<DeepPartial<MsgUpdateParams>, I>>(object: I): MsgUpdateParams;
};
export declare const MsgUpdateParamsResponse: {
    encode(_: MsgUpdateParamsResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgUpdateParamsResponse;
    fromJSON(_: any): MsgUpdateParamsResponse;
    toJSON(_: MsgUpdateParamsResponse): unknown;
    create<I extends Exact<DeepPartial<MsgUpdateParamsResponse>, I>>(base?: I): MsgUpdateParamsResponse;
    fromPartial<I extends Exact<DeepPartial<MsgUpdateParamsResponse>, I>>(_: I): MsgUpdateParamsResponse;
};
/** Msg defines the rollup Msg service. */
export interface Msg {
    /** RecordBatch defines a rpc handler method for MsgRecordBatch. */
    RecordBatch(request: DeepPartial<MsgRecordBatch>, metadata?: grpc.Metadata): Promise<MsgRecordBatchResponse>;
    /** CreateBridge defines a rpc handler method for MsgCreateBridge. */
    CreateBridge(request: DeepPartial<MsgCreateBridge>, metadata?: grpc.Metadata): Promise<MsgCreateBridgeResponse>;
    /** ProposeOutput defines a rpc handler method for MsgProposeOutput. */
    ProposeOutput(request: DeepPartial<MsgProposeOutput>, metadata?: grpc.Metadata): Promise<MsgProposeOutputResponse>;
    /** DeleteOutput defines a rpc handler method for MsgDeleteOutput. */
    DeleteOutput(request: DeepPartial<MsgDeleteOutput>, metadata?: grpc.Metadata): Promise<MsgDeleteOutputResponse>;
    /** InitiateTokenDeposit defines a user facing l1 => l2 token transfer interface. */
    InitiateTokenDeposit(request: DeepPartial<MsgInitiateTokenDeposit>, metadata?: grpc.Metadata): Promise<MsgInitiateTokenDepositResponse>;
    /** FinalizeTokenWithdrawal defines a user facing l2 => l1 token transfer interface. */
    FinalizeTokenWithdrawal(request: DeepPartial<MsgFinalizeTokenWithdrawal>, metadata?: grpc.Metadata): Promise<MsgFinalizeTokenWithdrawalResponse>;
    /** UpdateProposer defines a rpc handler method for MsgUpdateProposer. */
    UpdateProposer(request: DeepPartial<MsgUpdateProposer>, metadata?: grpc.Metadata): Promise<MsgUpdateProposerResponse>;
    /** UpdateChallenger defines a rpc handler method for MsgUpdateChallenger. */
    UpdateChallenger(request: DeepPartial<MsgUpdateChallenger>, metadata?: grpc.Metadata): Promise<MsgUpdateChallengerResponse>;
    /** UpdateBatchInfo defines a rpc handler method for MsgUpdateBatchInfo. */
    UpdateBatchInfo(request: DeepPartial<MsgUpdateBatchInfo>, metadata?: grpc.Metadata): Promise<MsgUpdateBatchInfoResponse>;
    /** UpdateMetadata defines a rpc handler method for MsgUpdateMetadata. */
    UpdateMetadata(request: DeepPartial<MsgUpdateMetadata>, metadata?: grpc.Metadata): Promise<MsgUpdateMetadataResponse>;
    /** UpdateOracleConfig defines a rpc handler method for MsgUpdateOracleConfig. */
    UpdateOracleConfig(request: DeepPartial<MsgUpdateOracleConfig>, metadata?: grpc.Metadata): Promise<MsgUpdateOracleConfigResponse>;
    /**
     * UpdateParams defines an operation for updating the
     * x/opchild module parameters.
     */
    UpdateParams(request: DeepPartial<MsgUpdateParams>, metadata?: grpc.Metadata): Promise<MsgUpdateParamsResponse>;
}
export declare class MsgClientImpl implements Msg {
    private readonly rpc;
    constructor(rpc: Rpc);
    RecordBatch(request: DeepPartial<MsgRecordBatch>, metadata?: grpc.Metadata): Promise<MsgRecordBatchResponse>;
    CreateBridge(request: DeepPartial<MsgCreateBridge>, metadata?: grpc.Metadata): Promise<MsgCreateBridgeResponse>;
    ProposeOutput(request: DeepPartial<MsgProposeOutput>, metadata?: grpc.Metadata): Promise<MsgProposeOutputResponse>;
    DeleteOutput(request: DeepPartial<MsgDeleteOutput>, metadata?: grpc.Metadata): Promise<MsgDeleteOutputResponse>;
    InitiateTokenDeposit(request: DeepPartial<MsgInitiateTokenDeposit>, metadata?: grpc.Metadata): Promise<MsgInitiateTokenDepositResponse>;
    FinalizeTokenWithdrawal(request: DeepPartial<MsgFinalizeTokenWithdrawal>, metadata?: grpc.Metadata): Promise<MsgFinalizeTokenWithdrawalResponse>;
    UpdateProposer(request: DeepPartial<MsgUpdateProposer>, metadata?: grpc.Metadata): Promise<MsgUpdateProposerResponse>;
    UpdateChallenger(request: DeepPartial<MsgUpdateChallenger>, metadata?: grpc.Metadata): Promise<MsgUpdateChallengerResponse>;
    UpdateBatchInfo(request: DeepPartial<MsgUpdateBatchInfo>, metadata?: grpc.Metadata): Promise<MsgUpdateBatchInfoResponse>;
    UpdateMetadata(request: DeepPartial<MsgUpdateMetadata>, metadata?: grpc.Metadata): Promise<MsgUpdateMetadataResponse>;
    UpdateOracleConfig(request: DeepPartial<MsgUpdateOracleConfig>, metadata?: grpc.Metadata): Promise<MsgUpdateOracleConfigResponse>;
    UpdateParams(request: DeepPartial<MsgUpdateParams>, metadata?: grpc.Metadata): Promise<MsgUpdateParamsResponse>;
}
export declare const MsgDesc: {
    serviceName: string;
};
export declare const MsgRecordBatchDesc: UnaryMethodDefinitionish;
export declare const MsgCreateBridgeDesc: UnaryMethodDefinitionish;
export declare const MsgProposeOutputDesc: UnaryMethodDefinitionish;
export declare const MsgDeleteOutputDesc: UnaryMethodDefinitionish;
export declare const MsgInitiateTokenDepositDesc: UnaryMethodDefinitionish;
export declare const MsgFinalizeTokenWithdrawalDesc: UnaryMethodDefinitionish;
export declare const MsgUpdateProposerDesc: UnaryMethodDefinitionish;
export declare const MsgUpdateChallengerDesc: UnaryMethodDefinitionish;
export declare const MsgUpdateBatchInfoDesc: UnaryMethodDefinitionish;
export declare const MsgUpdateMetadataDesc: UnaryMethodDefinitionish;
export declare const MsgUpdateOracleConfigDesc: UnaryMethodDefinitionish;
export declare const MsgUpdateParamsDesc: UnaryMethodDefinitionish;
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
