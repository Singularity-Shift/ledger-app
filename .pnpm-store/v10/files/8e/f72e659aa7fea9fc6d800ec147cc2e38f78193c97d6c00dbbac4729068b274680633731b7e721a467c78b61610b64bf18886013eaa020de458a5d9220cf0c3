import { grpc } from "@improbable-eng/grpc-web";
import _m0 from "protobufjs/minimal";
import { Coin } from "../../../cosmos/base/v1beta1/coin";
import { Any } from "../../../google/protobuf/any";
import { BridgeInfo, Params, ResponseResultType } from "./types";
export declare const protobufPackage = "opinit.opchild.v1";
/**
 * MsgExecuteMessages is a message to execute the given
 * authority messages with validator permission.
 */
export interface MsgExecuteMessages {
    /** Sender is the that actor that signed a messages */
    sender: string;
    /** messages are the arbitrary messages to be executed. */
    messages: Any[];
}
/** MsgExecuteMessagesResponse returns MsgExecuteMessages message result data */
export interface MsgExecuteMessagesResponse {
}
/** MsgSetBridgeInfo is a message to set the registered bridge information. */
export interface MsgSetBridgeInfo {
    /** the sender address */
    sender: string;
    /** bridge_info is the bridge information to be set. */
    bridgeInfo?: BridgeInfo | undefined;
}
/** MsgSetBridgeInfoResponse returns set bridge info result data */
export interface MsgSetBridgeInfoResponse {
}
/** MsgFinalizeTokenDeposit is a message to submit deposit funds from upper layer */
export interface MsgFinalizeTokenDeposit {
    /** the sender address */
    sender: string;
    /** from is l1 sender address */
    from: string;
    /** to is l2 recipient address */
    to: string;
    /** amount is the coin amount to deposit. */
    amount?: Coin | undefined;
    /** sequence is the sequence number of l1 bridge */
    sequence: bigint;
    /** height is the height of l1 which is including the deposit message */
    height: bigint;
    /** base_denom is the l1 denomination of the sent coin. */
    baseDenom: string;
    /** / data is a extra bytes for hooks. */
    data: Uint8Array;
}
/** MsgFinalizeTokenDepositResponse returns deposit result data */
export interface MsgFinalizeTokenDepositResponse {
    result: ResponseResultType;
}
/** MsgInitiateTokenWithdrawal is a message to withdraw a new token from L2 to L1. */
export interface MsgInitiateTokenWithdrawal {
    /** the l2 sender address */
    sender: string;
    /** to is l1 recipient address */
    to: string;
    /** amount is the coin amount to withdraw. */
    amount?: Coin | undefined;
}
/** MsgInitiateTokenWithdrawalResponse returns create token result data */
export interface MsgInitiateTokenWithdrawalResponse {
    /** l2 sequence number */
    sequence: bigint;
}
/** MsgAddValidator defines a SDK message for adding a new validator. */
export interface MsgAddValidator {
    /**
     * authority is the address that controls the module
     * (defaults to x/opchild unless overwritten).
     */
    authority: string;
    moniker: string;
    validatorAddress: string;
    pubkey?: Any | undefined;
}
/** MsgAddValidatorResponse returns add result data */
export interface MsgAddValidatorResponse {
}
/** MsgAddValidator is a message to remove a validator from designated list */
export interface MsgRemoveValidator {
    /**
     * authority is the address that controls the module
     * (defaults to x/opchild unless overwritten).
     */
    authority: string;
    /** validator is the validator to remove. */
    validatorAddress: string;
}
/** MsgAddValidatorResponse returns remove result data */
export interface MsgRemoveValidatorResponse {
}
/** MsgUpdateParams is a message to update parameters */
export interface MsgUpdateParams {
    /**
     * authority is the address that controls the module
     * (defaults to x/opchild unless overwritten).
     */
    authority: string;
    /** params are the arbitrary parameters to be updated. */
    params?: Params | undefined;
}
/** MsgUpdateParamsResponse returns parameter update result data */
export interface MsgUpdateParamsResponse {
}
/**
 * MsgSpendFeePool is a message to withdraw collected fees from the module
 * account to the recipient address.
 */
export interface MsgSpendFeePool {
    /**
     * authority is the address that controls the module
     * (defaults to x/opchild unless overwritten).
     */
    authority: string;
    /** recipient is address to receive the coins. */
    recipient: string;
    /** the coin amount to spend. */
    amount: Coin[];
}
/** MsgSpendFeePoolResponse returns deposit result data */
export interface MsgSpendFeePoolResponse {
}
/** MsgUpdateOracle is a message to update oracle prices which contains L1 extended commits for oracle. */
export interface MsgUpdateOracle {
    /** the sender address */
    sender: string;
    /** height is the height of l1 which is including the oracle message */
    height: bigint;
    /** / data is oracle votes bytes. */
    data: Uint8Array;
}
/** MsgUpdateOracleResponse returns oracle update result data */
export interface MsgUpdateOracleResponse {
}
export declare const MsgExecuteMessages: {
    encode(message: MsgExecuteMessages, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgExecuteMessages;
    fromJSON(object: any): MsgExecuteMessages;
    toJSON(message: MsgExecuteMessages): unknown;
    create<I extends Exact<DeepPartial<MsgExecuteMessages>, I>>(base?: I): MsgExecuteMessages;
    fromPartial<I extends Exact<DeepPartial<MsgExecuteMessages>, I>>(object: I): MsgExecuteMessages;
};
export declare const MsgExecuteMessagesResponse: {
    encode(_: MsgExecuteMessagesResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgExecuteMessagesResponse;
    fromJSON(_: any): MsgExecuteMessagesResponse;
    toJSON(_: MsgExecuteMessagesResponse): unknown;
    create<I extends Exact<DeepPartial<MsgExecuteMessagesResponse>, I>>(base?: I): MsgExecuteMessagesResponse;
    fromPartial<I extends Exact<DeepPartial<MsgExecuteMessagesResponse>, I>>(_: I): MsgExecuteMessagesResponse;
};
export declare const MsgSetBridgeInfo: {
    encode(message: MsgSetBridgeInfo, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgSetBridgeInfo;
    fromJSON(object: any): MsgSetBridgeInfo;
    toJSON(message: MsgSetBridgeInfo): unknown;
    create<I extends Exact<DeepPartial<MsgSetBridgeInfo>, I>>(base?: I): MsgSetBridgeInfo;
    fromPartial<I extends Exact<DeepPartial<MsgSetBridgeInfo>, I>>(object: I): MsgSetBridgeInfo;
};
export declare const MsgSetBridgeInfoResponse: {
    encode(_: MsgSetBridgeInfoResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgSetBridgeInfoResponse;
    fromJSON(_: any): MsgSetBridgeInfoResponse;
    toJSON(_: MsgSetBridgeInfoResponse): unknown;
    create<I extends Exact<DeepPartial<MsgSetBridgeInfoResponse>, I>>(base?: I): MsgSetBridgeInfoResponse;
    fromPartial<I extends Exact<DeepPartial<MsgSetBridgeInfoResponse>, I>>(_: I): MsgSetBridgeInfoResponse;
};
export declare const MsgFinalizeTokenDeposit: {
    encode(message: MsgFinalizeTokenDeposit, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgFinalizeTokenDeposit;
    fromJSON(object: any): MsgFinalizeTokenDeposit;
    toJSON(message: MsgFinalizeTokenDeposit): unknown;
    create<I extends Exact<DeepPartial<MsgFinalizeTokenDeposit>, I>>(base?: I): MsgFinalizeTokenDeposit;
    fromPartial<I extends Exact<DeepPartial<MsgFinalizeTokenDeposit>, I>>(object: I): MsgFinalizeTokenDeposit;
};
export declare const MsgFinalizeTokenDepositResponse: {
    encode(message: MsgFinalizeTokenDepositResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgFinalizeTokenDepositResponse;
    fromJSON(object: any): MsgFinalizeTokenDepositResponse;
    toJSON(message: MsgFinalizeTokenDepositResponse): unknown;
    create<I extends Exact<DeepPartial<MsgFinalizeTokenDepositResponse>, I>>(base?: I): MsgFinalizeTokenDepositResponse;
    fromPartial<I extends Exact<DeepPartial<MsgFinalizeTokenDepositResponse>, I>>(object: I): MsgFinalizeTokenDepositResponse;
};
export declare const MsgInitiateTokenWithdrawal: {
    encode(message: MsgInitiateTokenWithdrawal, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgInitiateTokenWithdrawal;
    fromJSON(object: any): MsgInitiateTokenWithdrawal;
    toJSON(message: MsgInitiateTokenWithdrawal): unknown;
    create<I extends Exact<DeepPartial<MsgInitiateTokenWithdrawal>, I>>(base?: I): MsgInitiateTokenWithdrawal;
    fromPartial<I extends Exact<DeepPartial<MsgInitiateTokenWithdrawal>, I>>(object: I): MsgInitiateTokenWithdrawal;
};
export declare const MsgInitiateTokenWithdrawalResponse: {
    encode(message: MsgInitiateTokenWithdrawalResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgInitiateTokenWithdrawalResponse;
    fromJSON(object: any): MsgInitiateTokenWithdrawalResponse;
    toJSON(message: MsgInitiateTokenWithdrawalResponse): unknown;
    create<I extends Exact<DeepPartial<MsgInitiateTokenWithdrawalResponse>, I>>(base?: I): MsgInitiateTokenWithdrawalResponse;
    fromPartial<I extends Exact<DeepPartial<MsgInitiateTokenWithdrawalResponse>, I>>(object: I): MsgInitiateTokenWithdrawalResponse;
};
export declare const MsgAddValidator: {
    encode(message: MsgAddValidator, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgAddValidator;
    fromJSON(object: any): MsgAddValidator;
    toJSON(message: MsgAddValidator): unknown;
    create<I extends Exact<DeepPartial<MsgAddValidator>, I>>(base?: I): MsgAddValidator;
    fromPartial<I extends Exact<DeepPartial<MsgAddValidator>, I>>(object: I): MsgAddValidator;
};
export declare const MsgAddValidatorResponse: {
    encode(_: MsgAddValidatorResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgAddValidatorResponse;
    fromJSON(_: any): MsgAddValidatorResponse;
    toJSON(_: MsgAddValidatorResponse): unknown;
    create<I extends Exact<DeepPartial<MsgAddValidatorResponse>, I>>(base?: I): MsgAddValidatorResponse;
    fromPartial<I extends Exact<DeepPartial<MsgAddValidatorResponse>, I>>(_: I): MsgAddValidatorResponse;
};
export declare const MsgRemoveValidator: {
    encode(message: MsgRemoveValidator, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgRemoveValidator;
    fromJSON(object: any): MsgRemoveValidator;
    toJSON(message: MsgRemoveValidator): unknown;
    create<I extends Exact<DeepPartial<MsgRemoveValidator>, I>>(base?: I): MsgRemoveValidator;
    fromPartial<I extends Exact<DeepPartial<MsgRemoveValidator>, I>>(object: I): MsgRemoveValidator;
};
export declare const MsgRemoveValidatorResponse: {
    encode(_: MsgRemoveValidatorResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgRemoveValidatorResponse;
    fromJSON(_: any): MsgRemoveValidatorResponse;
    toJSON(_: MsgRemoveValidatorResponse): unknown;
    create<I extends Exact<DeepPartial<MsgRemoveValidatorResponse>, I>>(base?: I): MsgRemoveValidatorResponse;
    fromPartial<I extends Exact<DeepPartial<MsgRemoveValidatorResponse>, I>>(_: I): MsgRemoveValidatorResponse;
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
export declare const MsgSpendFeePool: {
    encode(message: MsgSpendFeePool, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgSpendFeePool;
    fromJSON(object: any): MsgSpendFeePool;
    toJSON(message: MsgSpendFeePool): unknown;
    create<I extends Exact<DeepPartial<MsgSpendFeePool>, I>>(base?: I): MsgSpendFeePool;
    fromPartial<I extends Exact<DeepPartial<MsgSpendFeePool>, I>>(object: I): MsgSpendFeePool;
};
export declare const MsgSpendFeePoolResponse: {
    encode(_: MsgSpendFeePoolResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgSpendFeePoolResponse;
    fromJSON(_: any): MsgSpendFeePoolResponse;
    toJSON(_: MsgSpendFeePoolResponse): unknown;
    create<I extends Exact<DeepPartial<MsgSpendFeePoolResponse>, I>>(base?: I): MsgSpendFeePoolResponse;
    fromPartial<I extends Exact<DeepPartial<MsgSpendFeePoolResponse>, I>>(_: I): MsgSpendFeePoolResponse;
};
export declare const MsgUpdateOracle: {
    encode(message: MsgUpdateOracle, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgUpdateOracle;
    fromJSON(object: any): MsgUpdateOracle;
    toJSON(message: MsgUpdateOracle): unknown;
    create<I extends Exact<DeepPartial<MsgUpdateOracle>, I>>(base?: I): MsgUpdateOracle;
    fromPartial<I extends Exact<DeepPartial<MsgUpdateOracle>, I>>(object: I): MsgUpdateOracle;
};
export declare const MsgUpdateOracleResponse: {
    encode(_: MsgUpdateOracleResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgUpdateOracleResponse;
    fromJSON(_: any): MsgUpdateOracleResponse;
    toJSON(_: MsgUpdateOracleResponse): unknown;
    create<I extends Exact<DeepPartial<MsgUpdateOracleResponse>, I>>(base?: I): MsgUpdateOracleResponse;
    fromPartial<I extends Exact<DeepPartial<MsgUpdateOracleResponse>, I>>(_: I): MsgUpdateOracleResponse;
};
/** Msg defines the rollup Msg service. */
export interface Msg {
    /** ExecuteMessages defines a rpc handler method for MsgExecuteMessages. */
    ExecuteMessages(request: DeepPartial<MsgExecuteMessages>, metadata?: grpc.Metadata): Promise<MsgExecuteMessagesResponse>;
    /** SetBridgeInfo defines a rpc handler method for MsgSetBridgeInfo. */
    SetBridgeInfo(request: DeepPartial<MsgSetBridgeInfo>, metadata?: grpc.Metadata): Promise<MsgSetBridgeInfoResponse>;
    /** FinalizeTokenDeposit defines a rpc handler method for MsgFinalizeTokenDeposit. */
    FinalizeTokenDeposit(request: DeepPartial<MsgFinalizeTokenDeposit>, metadata?: grpc.Metadata): Promise<MsgFinalizeTokenDepositResponse>;
    /** InitiateTokenWithdrawal defines a user facing l2 => l1 token transfer interface. */
    InitiateTokenWithdrawal(request: DeepPartial<MsgInitiateTokenWithdrawal>, metadata?: grpc.Metadata): Promise<MsgInitiateTokenWithdrawalResponse>;
    /** AddValidator defines a rpc handler method for MsgAddValidator. */
    AddValidator(request: DeepPartial<MsgAddValidator>, metadata?: grpc.Metadata): Promise<MsgAddValidatorResponse>;
    /** RemoveValidator defines a rpc handler method for MsgRemoveValidator. */
    RemoveValidator(request: DeepPartial<MsgRemoveValidator>, metadata?: grpc.Metadata): Promise<MsgRemoveValidatorResponse>;
    /**
     * UpdateParams defines an operation for updating the
     * x/opchild module parameters.
     */
    UpdateParams(request: DeepPartial<MsgUpdateParams>, metadata?: grpc.Metadata): Promise<MsgUpdateParamsResponse>;
    /** SpendFeePool defines an operation that spend fee pool to a recipient. */
    SpendFeePool(request: DeepPartial<MsgSpendFeePool>, metadata?: grpc.Metadata): Promise<MsgSpendFeePoolResponse>;
    /** UpdateOracle defines an operation that update oracle prices. */
    UpdateOracle(request: DeepPartial<MsgUpdateOracle>, metadata?: grpc.Metadata): Promise<MsgUpdateOracleResponse>;
}
export declare class MsgClientImpl implements Msg {
    private readonly rpc;
    constructor(rpc: Rpc);
    ExecuteMessages(request: DeepPartial<MsgExecuteMessages>, metadata?: grpc.Metadata): Promise<MsgExecuteMessagesResponse>;
    SetBridgeInfo(request: DeepPartial<MsgSetBridgeInfo>, metadata?: grpc.Metadata): Promise<MsgSetBridgeInfoResponse>;
    FinalizeTokenDeposit(request: DeepPartial<MsgFinalizeTokenDeposit>, metadata?: grpc.Metadata): Promise<MsgFinalizeTokenDepositResponse>;
    InitiateTokenWithdrawal(request: DeepPartial<MsgInitiateTokenWithdrawal>, metadata?: grpc.Metadata): Promise<MsgInitiateTokenWithdrawalResponse>;
    AddValidator(request: DeepPartial<MsgAddValidator>, metadata?: grpc.Metadata): Promise<MsgAddValidatorResponse>;
    RemoveValidator(request: DeepPartial<MsgRemoveValidator>, metadata?: grpc.Metadata): Promise<MsgRemoveValidatorResponse>;
    UpdateParams(request: DeepPartial<MsgUpdateParams>, metadata?: grpc.Metadata): Promise<MsgUpdateParamsResponse>;
    SpendFeePool(request: DeepPartial<MsgSpendFeePool>, metadata?: grpc.Metadata): Promise<MsgSpendFeePoolResponse>;
    UpdateOracle(request: DeepPartial<MsgUpdateOracle>, metadata?: grpc.Metadata): Promise<MsgUpdateOracleResponse>;
}
export declare const MsgDesc: {
    serviceName: string;
};
export declare const MsgExecuteMessagesDesc: UnaryMethodDefinitionish;
export declare const MsgSetBridgeInfoDesc: UnaryMethodDefinitionish;
export declare const MsgFinalizeTokenDepositDesc: UnaryMethodDefinitionish;
export declare const MsgInitiateTokenWithdrawalDesc: UnaryMethodDefinitionish;
export declare const MsgAddValidatorDesc: UnaryMethodDefinitionish;
export declare const MsgRemoveValidatorDesc: UnaryMethodDefinitionish;
export declare const MsgUpdateParamsDesc: UnaryMethodDefinitionish;
export declare const MsgSpendFeePoolDesc: UnaryMethodDefinitionish;
export declare const MsgUpdateOracleDesc: UnaryMethodDefinitionish;
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
