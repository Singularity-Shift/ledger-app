import { grpc } from "@improbable-eng/grpc-web";
import _m0 from "protobufjs/minimal";
import { PublicKey } from "../crypto/keys";
import { ProofOps } from "../crypto/proof";
import { ConsensusParams } from "../types/params";
import { BlockIDFlag } from "../types/validator";
export declare const protobufPackage = "tendermint.abci";
export declare enum CheckTxType {
    NEW = 0,
    RECHECK = 1,
    UNRECOGNIZED = -1
}
export declare function checkTxTypeFromJSON(object: any): CheckTxType;
export declare function checkTxTypeToJSON(object: CheckTxType): string;
export declare enum MisbehaviorType {
    UNKNOWN = 0,
    DUPLICATE_VOTE = 1,
    LIGHT_CLIENT_ATTACK = 2,
    UNRECOGNIZED = -1
}
export declare function misbehaviorTypeFromJSON(object: any): MisbehaviorType;
export declare function misbehaviorTypeToJSON(object: MisbehaviorType): string;
export interface Request {
    echo?: RequestEcho | undefined;
    flush?: RequestFlush | undefined;
    info?: RequestInfo | undefined;
    initChain?: RequestInitChain | undefined;
    query?: RequestQuery | undefined;
    checkTx?: RequestCheckTx | undefined;
    commit?: RequestCommit | undefined;
    listSnapshots?: RequestListSnapshots | undefined;
    offerSnapshot?: RequestOfferSnapshot | undefined;
    loadSnapshotChunk?: RequestLoadSnapshotChunk | undefined;
    applySnapshotChunk?: RequestApplySnapshotChunk | undefined;
    prepareProposal?: RequestPrepareProposal | undefined;
    processProposal?: RequestProcessProposal | undefined;
    extendVote?: RequestExtendVote | undefined;
    verifyVoteExtension?: RequestVerifyVoteExtension | undefined;
    finalizeBlock?: RequestFinalizeBlock | undefined;
}
export interface RequestEcho {
    message: string;
}
export interface RequestFlush {
}
export interface RequestInfo {
    version: string;
    blockVersion: bigint;
    p2pVersion: bigint;
    abciVersion: string;
}
export interface RequestInitChain {
    time?: Date | undefined;
    chainId: string;
    consensusParams?: ConsensusParams | undefined;
    validators: ValidatorUpdate[];
    appStateBytes: Uint8Array;
    initialHeight: bigint;
}
export interface RequestQuery {
    data: Uint8Array;
    path: string;
    height: bigint;
    prove: boolean;
}
export interface RequestCheckTx {
    tx: Uint8Array;
    type: CheckTxType;
}
export interface RequestCommit {
}
/** lists available snapshots */
export interface RequestListSnapshots {
}
/** offers a snapshot to the application */
export interface RequestOfferSnapshot {
    /** snapshot offered by peers */
    snapshot?: Snapshot | undefined;
    /** light client-verified app hash for snapshot height */
    appHash: Uint8Array;
}
/** loads a snapshot chunk */
export interface RequestLoadSnapshotChunk {
    height: bigint;
    format: number;
    chunk: number;
}
/** Applies a snapshot chunk */
export interface RequestApplySnapshotChunk {
    index: number;
    chunk: Uint8Array;
    sender: string;
}
export interface RequestPrepareProposal {
    /** the modified transactions cannot exceed this size. */
    maxTxBytes: bigint;
    /**
     * txs is an array of transactions that will be included in a block,
     * sent to the app for possible modifications.
     */
    txs: Uint8Array[];
    localLastCommit?: ExtendedCommitInfo | undefined;
    misbehavior: Misbehavior[];
    height: bigint;
    time?: Date | undefined;
    nextValidatorsHash: Uint8Array;
    /** address of the public key of the validator proposing the block. */
    proposerAddress: Uint8Array;
}
export interface RequestProcessProposal {
    txs: Uint8Array[];
    proposedLastCommit?: CommitInfo | undefined;
    misbehavior: Misbehavior[];
    /** hash is the merkle root hash of the fields of the proposed block. */
    hash: Uint8Array;
    height: bigint;
    time?: Date | undefined;
    nextValidatorsHash: Uint8Array;
    /** address of the public key of the original proposer of the block. */
    proposerAddress: Uint8Array;
}
/** Extends a vote with application-injected data */
export interface RequestExtendVote {
    /** the hash of the block that this vote may be referring to */
    hash: Uint8Array;
    /** the height of the extended vote */
    height: bigint;
    /** info of the block that this vote may be referring to */
    time?: Date | undefined;
    txs: Uint8Array[];
    proposedLastCommit?: CommitInfo | undefined;
    misbehavior: Misbehavior[];
    nextValidatorsHash: Uint8Array;
    /** address of the public key of the original proposer of the block. */
    proposerAddress: Uint8Array;
}
/** Verify the vote extension */
export interface RequestVerifyVoteExtension {
    /** the hash of the block that this received vote corresponds to */
    hash: Uint8Array;
    /** the validator that signed the vote extension */
    validatorAddress: Uint8Array;
    height: bigint;
    voteExtension: Uint8Array;
}
export interface RequestFinalizeBlock {
    txs: Uint8Array[];
    decidedLastCommit?: CommitInfo | undefined;
    misbehavior: Misbehavior[];
    /** hash is the merkle root hash of the fields of the decided block. */
    hash: Uint8Array;
    height: bigint;
    time?: Date | undefined;
    nextValidatorsHash: Uint8Array;
    /** proposer_address is the address of the public key of the original proposer of the block. */
    proposerAddress: Uint8Array;
}
export interface Response {
    exception?: ResponseException | undefined;
    echo?: ResponseEcho | undefined;
    flush?: ResponseFlush | undefined;
    info?: ResponseInfo | undefined;
    initChain?: ResponseInitChain | undefined;
    query?: ResponseQuery | undefined;
    checkTx?: ResponseCheckTx | undefined;
    commit?: ResponseCommit | undefined;
    listSnapshots?: ResponseListSnapshots | undefined;
    offerSnapshot?: ResponseOfferSnapshot | undefined;
    loadSnapshotChunk?: ResponseLoadSnapshotChunk | undefined;
    applySnapshotChunk?: ResponseApplySnapshotChunk | undefined;
    prepareProposal?: ResponsePrepareProposal | undefined;
    processProposal?: ResponseProcessProposal | undefined;
    extendVote?: ResponseExtendVote | undefined;
    verifyVoteExtension?: ResponseVerifyVoteExtension | undefined;
    finalizeBlock?: ResponseFinalizeBlock | undefined;
}
/** nondeterministic */
export interface ResponseException {
    error: string;
}
export interface ResponseEcho {
    message: string;
}
export interface ResponseFlush {
}
export interface ResponseInfo {
    data: string;
    version: string;
    appVersion: bigint;
    lastBlockHeight: bigint;
    lastBlockAppHash: Uint8Array;
}
export interface ResponseInitChain {
    consensusParams?: ConsensusParams | undefined;
    validators: ValidatorUpdate[];
    appHash: Uint8Array;
}
export interface ResponseQuery {
    code: number;
    /** bytes data = 2; // use "value" instead. */
    log: string;
    /** nondeterministic */
    info: string;
    index: bigint;
    key: Uint8Array;
    value: Uint8Array;
    proofOps?: ProofOps | undefined;
    height: bigint;
    codespace: string;
}
export interface ResponseCheckTx {
    code: number;
    data: Uint8Array;
    /** nondeterministic */
    log: string;
    /** nondeterministic */
    info: string;
    gasWanted: bigint;
    gasUsed: bigint;
    events: Event[];
    codespace: string;
}
export interface ResponseCommit {
    retainHeight: bigint;
}
export interface ResponseListSnapshots {
    snapshots: Snapshot[];
}
export interface ResponseOfferSnapshot {
    result: ResponseOfferSnapshot_Result;
}
export declare enum ResponseOfferSnapshot_Result {
    /** UNKNOWN - Unknown result, abort all snapshot restoration */
    UNKNOWN = 0,
    /** ACCEPT - Snapshot accepted, apply chunks */
    ACCEPT = 1,
    /** ABORT - Abort all snapshot restoration */
    ABORT = 2,
    /** REJECT - Reject this specific snapshot, try others */
    REJECT = 3,
    /** REJECT_FORMAT - Reject all snapshots of this format, try others */
    REJECT_FORMAT = 4,
    /** REJECT_SENDER - Reject all snapshots from the sender(s), try others */
    REJECT_SENDER = 5,
    UNRECOGNIZED = -1
}
export declare function responseOfferSnapshot_ResultFromJSON(object: any): ResponseOfferSnapshot_Result;
export declare function responseOfferSnapshot_ResultToJSON(object: ResponseOfferSnapshot_Result): string;
export interface ResponseLoadSnapshotChunk {
    chunk: Uint8Array;
}
export interface ResponseApplySnapshotChunk {
    result: ResponseApplySnapshotChunk_Result;
    /** Chunks to refetch and reapply */
    refetchChunks: number[];
    /** Chunk senders to reject and ban */
    rejectSenders: string[];
}
export declare enum ResponseApplySnapshotChunk_Result {
    /** UNKNOWN - Unknown result, abort all snapshot restoration */
    UNKNOWN = 0,
    /** ACCEPT - Chunk successfully accepted */
    ACCEPT = 1,
    /** ABORT - Abort all snapshot restoration */
    ABORT = 2,
    /** RETRY - Retry chunk (combine with refetch and reject) */
    RETRY = 3,
    /** RETRY_SNAPSHOT - Retry snapshot (combine with refetch and reject) */
    RETRY_SNAPSHOT = 4,
    /** REJECT_SNAPSHOT - Reject this snapshot, try others */
    REJECT_SNAPSHOT = 5,
    UNRECOGNIZED = -1
}
export declare function responseApplySnapshotChunk_ResultFromJSON(object: any): ResponseApplySnapshotChunk_Result;
export declare function responseApplySnapshotChunk_ResultToJSON(object: ResponseApplySnapshotChunk_Result): string;
export interface ResponsePrepareProposal {
    txs: Uint8Array[];
}
export interface ResponseProcessProposal {
    status: ResponseProcessProposal_ProposalStatus;
}
export declare enum ResponseProcessProposal_ProposalStatus {
    UNKNOWN = 0,
    ACCEPT = 1,
    REJECT = 2,
    UNRECOGNIZED = -1
}
export declare function responseProcessProposal_ProposalStatusFromJSON(object: any): ResponseProcessProposal_ProposalStatus;
export declare function responseProcessProposal_ProposalStatusToJSON(object: ResponseProcessProposal_ProposalStatus): string;
export interface ResponseExtendVote {
    voteExtension: Uint8Array;
}
export interface ResponseVerifyVoteExtension {
    status: ResponseVerifyVoteExtension_VerifyStatus;
}
export declare enum ResponseVerifyVoteExtension_VerifyStatus {
    UNKNOWN = 0,
    ACCEPT = 1,
    /**
     * REJECT - Rejecting the vote extension will reject the entire precommit by the sender.
     * Incorrectly implementing this thus has liveness implications as it may affect
     * CometBFT's ability to receive 2/3+ valid votes to finalize the block.
     * Honest nodes should never be rejected.
     */
    REJECT = 2,
    UNRECOGNIZED = -1
}
export declare function responseVerifyVoteExtension_VerifyStatusFromJSON(object: any): ResponseVerifyVoteExtension_VerifyStatus;
export declare function responseVerifyVoteExtension_VerifyStatusToJSON(object: ResponseVerifyVoteExtension_VerifyStatus): string;
export interface ResponseFinalizeBlock {
    /** set of block events emmitted as part of executing the block */
    events: Event[];
    /**
     * the result of executing each transaction including the events
     * the particular transction emitted. This should match the order
     * of the transactions delivered in the block itself
     */
    txResults: ExecTxResult[];
    /** a list of updates to the validator set. These will reflect the validator set at current height + 2. */
    validatorUpdates: ValidatorUpdate[];
    /** updates to the consensus params, if any. */
    consensusParamUpdates?: ConsensusParams | undefined;
    /**
     * app_hash is the hash of the applications' state which is used to confirm that execution of the transactions was
     * deterministic. It is up to the application to decide which algorithm to use.
     */
    appHash: Uint8Array;
}
export interface CommitInfo {
    round: number;
    votes: VoteInfo[];
}
/**
 * ExtendedCommitInfo is similar to CommitInfo except that it is only used in
 * the PrepareProposal request such that CometBFT can provide vote extensions
 * to the application.
 */
export interface ExtendedCommitInfo {
    /** The round at which the block proposer decided in the previous height. */
    round: number;
    /**
     * List of validators' addresses in the last validator set with their voting
     * information, including vote extensions.
     */
    votes: ExtendedVoteInfo[];
}
/**
 * Event allows application developers to attach additional information to
 * ResponseFinalizeBlock and ResponseCheckTx.
 * Later, transactions may be queried using these events.
 */
export interface Event {
    type: string;
    attributes: EventAttribute[];
}
/** EventAttribute is a single key-value pair, associated with an event. */
export interface EventAttribute {
    key: string;
    value: string;
    /** nondeterministic */
    index: boolean;
}
/**
 * ExecTxResult contains results of executing one individual transaction.
 *
 * * Its structure is equivalent to #ResponseDeliverTx which will be deprecated/deleted
 */
export interface ExecTxResult {
    code: number;
    data: Uint8Array;
    /** nondeterministic */
    log: string;
    /** nondeterministic */
    info: string;
    gasWanted: bigint;
    gasUsed: bigint;
    /** nondeterministic */
    events: Event[];
    codespace: string;
}
/**
 * TxResult contains results of executing the transaction.
 *
 * One usage is indexing transaction results.
 */
export interface TxResult {
    height: bigint;
    index: number;
    tx: Uint8Array;
    result?: ExecTxResult | undefined;
}
export interface Validator {
    /** The first 20 bytes of SHA256(public key) */
    address: Uint8Array;
    /** PubKey pub_key = 2 [(gogoproto.nullable)=false]; */
    power: bigint;
}
export interface ValidatorUpdate {
    pubKey?: PublicKey | undefined;
    power: bigint;
}
export interface VoteInfo {
    validator?: Validator | undefined;
    blockIdFlag: BlockIDFlag;
}
export interface ExtendedVoteInfo {
    /** The validator that sent the vote. */
    validator?: Validator | undefined;
    /** Non-deterministic extension provided by the sending validator's application. */
    voteExtension: Uint8Array;
    /** Vote extension signature created by CometBFT */
    extensionSignature: Uint8Array;
    /** block_id_flag indicates whether the validator voted for a block, nil, or did not vote at all */
    blockIdFlag: BlockIDFlag;
}
export interface Misbehavior {
    type: MisbehaviorType;
    /** The offending validator */
    validator?: Validator | undefined;
    /** The height when the offense occurred */
    height: bigint;
    /** The corresponding time where the offense occurred */
    time?: Date | undefined;
    /**
     * Total voting power of the validator set in case the ABCI application does
     * not store historical validators.
     * https://github.com/tendermint/tendermint/issues/4581
     */
    totalVotingPower: bigint;
}
export interface Snapshot {
    /** The height at which the snapshot was taken */
    height: bigint;
    /** The application-specific snapshot format */
    format: number;
    /** Number of chunks in the snapshot */
    chunks: number;
    /** Arbitrary snapshot hash, equal only if identical */
    hash: Uint8Array;
    /** Arbitrary application metadata */
    metadata: Uint8Array;
}
export declare const Request: {
    encode(message: Request, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): Request;
    fromJSON(object: any): Request;
    toJSON(message: Request): unknown;
    create<I extends Exact<DeepPartial<Request>, I>>(base?: I): Request;
    fromPartial<I extends Exact<DeepPartial<Request>, I>>(object: I): Request;
};
export declare const RequestEcho: {
    encode(message: RequestEcho, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): RequestEcho;
    fromJSON(object: any): RequestEcho;
    toJSON(message: RequestEcho): unknown;
    create<I extends Exact<DeepPartial<RequestEcho>, I>>(base?: I): RequestEcho;
    fromPartial<I extends Exact<DeepPartial<RequestEcho>, I>>(object: I): RequestEcho;
};
export declare const RequestFlush: {
    encode(_: RequestFlush, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): RequestFlush;
    fromJSON(_: any): RequestFlush;
    toJSON(_: RequestFlush): unknown;
    create<I extends Exact<DeepPartial<RequestFlush>, I>>(base?: I): RequestFlush;
    fromPartial<I extends Exact<DeepPartial<RequestFlush>, I>>(_: I): RequestFlush;
};
export declare const RequestInfo: {
    encode(message: RequestInfo, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): RequestInfo;
    fromJSON(object: any): RequestInfo;
    toJSON(message: RequestInfo): unknown;
    create<I extends Exact<DeepPartial<RequestInfo>, I>>(base?: I): RequestInfo;
    fromPartial<I extends Exact<DeepPartial<RequestInfo>, I>>(object: I): RequestInfo;
};
export declare const RequestInitChain: {
    encode(message: RequestInitChain, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): RequestInitChain;
    fromJSON(object: any): RequestInitChain;
    toJSON(message: RequestInitChain): unknown;
    create<I extends Exact<DeepPartial<RequestInitChain>, I>>(base?: I): RequestInitChain;
    fromPartial<I extends Exact<DeepPartial<RequestInitChain>, I>>(object: I): RequestInitChain;
};
export declare const RequestQuery: {
    encode(message: RequestQuery, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): RequestQuery;
    fromJSON(object: any): RequestQuery;
    toJSON(message: RequestQuery): unknown;
    create<I extends Exact<DeepPartial<RequestQuery>, I>>(base?: I): RequestQuery;
    fromPartial<I extends Exact<DeepPartial<RequestQuery>, I>>(object: I): RequestQuery;
};
export declare const RequestCheckTx: {
    encode(message: RequestCheckTx, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): RequestCheckTx;
    fromJSON(object: any): RequestCheckTx;
    toJSON(message: RequestCheckTx): unknown;
    create<I extends Exact<DeepPartial<RequestCheckTx>, I>>(base?: I): RequestCheckTx;
    fromPartial<I extends Exact<DeepPartial<RequestCheckTx>, I>>(object: I): RequestCheckTx;
};
export declare const RequestCommit: {
    encode(_: RequestCommit, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): RequestCommit;
    fromJSON(_: any): RequestCommit;
    toJSON(_: RequestCommit): unknown;
    create<I extends Exact<DeepPartial<RequestCommit>, I>>(base?: I): RequestCommit;
    fromPartial<I extends Exact<DeepPartial<RequestCommit>, I>>(_: I): RequestCommit;
};
export declare const RequestListSnapshots: {
    encode(_: RequestListSnapshots, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): RequestListSnapshots;
    fromJSON(_: any): RequestListSnapshots;
    toJSON(_: RequestListSnapshots): unknown;
    create<I extends Exact<DeepPartial<RequestListSnapshots>, I>>(base?: I): RequestListSnapshots;
    fromPartial<I extends Exact<DeepPartial<RequestListSnapshots>, I>>(_: I): RequestListSnapshots;
};
export declare const RequestOfferSnapshot: {
    encode(message: RequestOfferSnapshot, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): RequestOfferSnapshot;
    fromJSON(object: any): RequestOfferSnapshot;
    toJSON(message: RequestOfferSnapshot): unknown;
    create<I extends Exact<DeepPartial<RequestOfferSnapshot>, I>>(base?: I): RequestOfferSnapshot;
    fromPartial<I extends Exact<DeepPartial<RequestOfferSnapshot>, I>>(object: I): RequestOfferSnapshot;
};
export declare const RequestLoadSnapshotChunk: {
    encode(message: RequestLoadSnapshotChunk, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): RequestLoadSnapshotChunk;
    fromJSON(object: any): RequestLoadSnapshotChunk;
    toJSON(message: RequestLoadSnapshotChunk): unknown;
    create<I extends Exact<DeepPartial<RequestLoadSnapshotChunk>, I>>(base?: I): RequestLoadSnapshotChunk;
    fromPartial<I extends Exact<DeepPartial<RequestLoadSnapshotChunk>, I>>(object: I): RequestLoadSnapshotChunk;
};
export declare const RequestApplySnapshotChunk: {
    encode(message: RequestApplySnapshotChunk, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): RequestApplySnapshotChunk;
    fromJSON(object: any): RequestApplySnapshotChunk;
    toJSON(message: RequestApplySnapshotChunk): unknown;
    create<I extends Exact<DeepPartial<RequestApplySnapshotChunk>, I>>(base?: I): RequestApplySnapshotChunk;
    fromPartial<I extends Exact<DeepPartial<RequestApplySnapshotChunk>, I>>(object: I): RequestApplySnapshotChunk;
};
export declare const RequestPrepareProposal: {
    encode(message: RequestPrepareProposal, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): RequestPrepareProposal;
    fromJSON(object: any): RequestPrepareProposal;
    toJSON(message: RequestPrepareProposal): unknown;
    create<I extends Exact<DeepPartial<RequestPrepareProposal>, I>>(base?: I): RequestPrepareProposal;
    fromPartial<I extends Exact<DeepPartial<RequestPrepareProposal>, I>>(object: I): RequestPrepareProposal;
};
export declare const RequestProcessProposal: {
    encode(message: RequestProcessProposal, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): RequestProcessProposal;
    fromJSON(object: any): RequestProcessProposal;
    toJSON(message: RequestProcessProposal): unknown;
    create<I extends Exact<DeepPartial<RequestProcessProposal>, I>>(base?: I): RequestProcessProposal;
    fromPartial<I extends Exact<DeepPartial<RequestProcessProposal>, I>>(object: I): RequestProcessProposal;
};
export declare const RequestExtendVote: {
    encode(message: RequestExtendVote, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): RequestExtendVote;
    fromJSON(object: any): RequestExtendVote;
    toJSON(message: RequestExtendVote): unknown;
    create<I extends Exact<DeepPartial<RequestExtendVote>, I>>(base?: I): RequestExtendVote;
    fromPartial<I extends Exact<DeepPartial<RequestExtendVote>, I>>(object: I): RequestExtendVote;
};
export declare const RequestVerifyVoteExtension: {
    encode(message: RequestVerifyVoteExtension, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): RequestVerifyVoteExtension;
    fromJSON(object: any): RequestVerifyVoteExtension;
    toJSON(message: RequestVerifyVoteExtension): unknown;
    create<I extends Exact<DeepPartial<RequestVerifyVoteExtension>, I>>(base?: I): RequestVerifyVoteExtension;
    fromPartial<I extends Exact<DeepPartial<RequestVerifyVoteExtension>, I>>(object: I): RequestVerifyVoteExtension;
};
export declare const RequestFinalizeBlock: {
    encode(message: RequestFinalizeBlock, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): RequestFinalizeBlock;
    fromJSON(object: any): RequestFinalizeBlock;
    toJSON(message: RequestFinalizeBlock): unknown;
    create<I extends Exact<DeepPartial<RequestFinalizeBlock>, I>>(base?: I): RequestFinalizeBlock;
    fromPartial<I extends Exact<DeepPartial<RequestFinalizeBlock>, I>>(object: I): RequestFinalizeBlock;
};
export declare const Response: {
    encode(message: Response, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): Response;
    fromJSON(object: any): Response;
    toJSON(message: Response): unknown;
    create<I extends Exact<DeepPartial<Response>, I>>(base?: I): Response;
    fromPartial<I extends Exact<DeepPartial<Response>, I>>(object: I): Response;
};
export declare const ResponseException: {
    encode(message: ResponseException, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): ResponseException;
    fromJSON(object: any): ResponseException;
    toJSON(message: ResponseException): unknown;
    create<I extends Exact<DeepPartial<ResponseException>, I>>(base?: I): ResponseException;
    fromPartial<I extends Exact<DeepPartial<ResponseException>, I>>(object: I): ResponseException;
};
export declare const ResponseEcho: {
    encode(message: ResponseEcho, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): ResponseEcho;
    fromJSON(object: any): ResponseEcho;
    toJSON(message: ResponseEcho): unknown;
    create<I extends Exact<DeepPartial<ResponseEcho>, I>>(base?: I): ResponseEcho;
    fromPartial<I extends Exact<DeepPartial<ResponseEcho>, I>>(object: I): ResponseEcho;
};
export declare const ResponseFlush: {
    encode(_: ResponseFlush, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): ResponseFlush;
    fromJSON(_: any): ResponseFlush;
    toJSON(_: ResponseFlush): unknown;
    create<I extends Exact<DeepPartial<ResponseFlush>, I>>(base?: I): ResponseFlush;
    fromPartial<I extends Exact<DeepPartial<ResponseFlush>, I>>(_: I): ResponseFlush;
};
export declare const ResponseInfo: {
    encode(message: ResponseInfo, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): ResponseInfo;
    fromJSON(object: any): ResponseInfo;
    toJSON(message: ResponseInfo): unknown;
    create<I extends Exact<DeepPartial<ResponseInfo>, I>>(base?: I): ResponseInfo;
    fromPartial<I extends Exact<DeepPartial<ResponseInfo>, I>>(object: I): ResponseInfo;
};
export declare const ResponseInitChain: {
    encode(message: ResponseInitChain, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): ResponseInitChain;
    fromJSON(object: any): ResponseInitChain;
    toJSON(message: ResponseInitChain): unknown;
    create<I extends Exact<DeepPartial<ResponseInitChain>, I>>(base?: I): ResponseInitChain;
    fromPartial<I extends Exact<DeepPartial<ResponseInitChain>, I>>(object: I): ResponseInitChain;
};
export declare const ResponseQuery: {
    encode(message: ResponseQuery, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): ResponseQuery;
    fromJSON(object: any): ResponseQuery;
    toJSON(message: ResponseQuery): unknown;
    create<I extends Exact<DeepPartial<ResponseQuery>, I>>(base?: I): ResponseQuery;
    fromPartial<I extends Exact<DeepPartial<ResponseQuery>, I>>(object: I): ResponseQuery;
};
export declare const ResponseCheckTx: {
    encode(message: ResponseCheckTx, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): ResponseCheckTx;
    fromJSON(object: any): ResponseCheckTx;
    toJSON(message: ResponseCheckTx): unknown;
    create<I extends Exact<DeepPartial<ResponseCheckTx>, I>>(base?: I): ResponseCheckTx;
    fromPartial<I extends Exact<DeepPartial<ResponseCheckTx>, I>>(object: I): ResponseCheckTx;
};
export declare const ResponseCommit: {
    encode(message: ResponseCommit, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): ResponseCommit;
    fromJSON(object: any): ResponseCommit;
    toJSON(message: ResponseCommit): unknown;
    create<I extends Exact<DeepPartial<ResponseCommit>, I>>(base?: I): ResponseCommit;
    fromPartial<I extends Exact<DeepPartial<ResponseCommit>, I>>(object: I): ResponseCommit;
};
export declare const ResponseListSnapshots: {
    encode(message: ResponseListSnapshots, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): ResponseListSnapshots;
    fromJSON(object: any): ResponseListSnapshots;
    toJSON(message: ResponseListSnapshots): unknown;
    create<I extends Exact<DeepPartial<ResponseListSnapshots>, I>>(base?: I): ResponseListSnapshots;
    fromPartial<I extends Exact<DeepPartial<ResponseListSnapshots>, I>>(object: I): ResponseListSnapshots;
};
export declare const ResponseOfferSnapshot: {
    encode(message: ResponseOfferSnapshot, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): ResponseOfferSnapshot;
    fromJSON(object: any): ResponseOfferSnapshot;
    toJSON(message: ResponseOfferSnapshot): unknown;
    create<I extends Exact<DeepPartial<ResponseOfferSnapshot>, I>>(base?: I): ResponseOfferSnapshot;
    fromPartial<I extends Exact<DeepPartial<ResponseOfferSnapshot>, I>>(object: I): ResponseOfferSnapshot;
};
export declare const ResponseLoadSnapshotChunk: {
    encode(message: ResponseLoadSnapshotChunk, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): ResponseLoadSnapshotChunk;
    fromJSON(object: any): ResponseLoadSnapshotChunk;
    toJSON(message: ResponseLoadSnapshotChunk): unknown;
    create<I extends Exact<DeepPartial<ResponseLoadSnapshotChunk>, I>>(base?: I): ResponseLoadSnapshotChunk;
    fromPartial<I extends Exact<DeepPartial<ResponseLoadSnapshotChunk>, I>>(object: I): ResponseLoadSnapshotChunk;
};
export declare const ResponseApplySnapshotChunk: {
    encode(message: ResponseApplySnapshotChunk, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): ResponseApplySnapshotChunk;
    fromJSON(object: any): ResponseApplySnapshotChunk;
    toJSON(message: ResponseApplySnapshotChunk): unknown;
    create<I extends Exact<DeepPartial<ResponseApplySnapshotChunk>, I>>(base?: I): ResponseApplySnapshotChunk;
    fromPartial<I extends Exact<DeepPartial<ResponseApplySnapshotChunk>, I>>(object: I): ResponseApplySnapshotChunk;
};
export declare const ResponsePrepareProposal: {
    encode(message: ResponsePrepareProposal, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): ResponsePrepareProposal;
    fromJSON(object: any): ResponsePrepareProposal;
    toJSON(message: ResponsePrepareProposal): unknown;
    create<I extends Exact<DeepPartial<ResponsePrepareProposal>, I>>(base?: I): ResponsePrepareProposal;
    fromPartial<I extends Exact<DeepPartial<ResponsePrepareProposal>, I>>(object: I): ResponsePrepareProposal;
};
export declare const ResponseProcessProposal: {
    encode(message: ResponseProcessProposal, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): ResponseProcessProposal;
    fromJSON(object: any): ResponseProcessProposal;
    toJSON(message: ResponseProcessProposal): unknown;
    create<I extends Exact<DeepPartial<ResponseProcessProposal>, I>>(base?: I): ResponseProcessProposal;
    fromPartial<I extends Exact<DeepPartial<ResponseProcessProposal>, I>>(object: I): ResponseProcessProposal;
};
export declare const ResponseExtendVote: {
    encode(message: ResponseExtendVote, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): ResponseExtendVote;
    fromJSON(object: any): ResponseExtendVote;
    toJSON(message: ResponseExtendVote): unknown;
    create<I extends Exact<DeepPartial<ResponseExtendVote>, I>>(base?: I): ResponseExtendVote;
    fromPartial<I extends Exact<DeepPartial<ResponseExtendVote>, I>>(object: I): ResponseExtendVote;
};
export declare const ResponseVerifyVoteExtension: {
    encode(message: ResponseVerifyVoteExtension, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): ResponseVerifyVoteExtension;
    fromJSON(object: any): ResponseVerifyVoteExtension;
    toJSON(message: ResponseVerifyVoteExtension): unknown;
    create<I extends Exact<DeepPartial<ResponseVerifyVoteExtension>, I>>(base?: I): ResponseVerifyVoteExtension;
    fromPartial<I extends Exact<DeepPartial<ResponseVerifyVoteExtension>, I>>(object: I): ResponseVerifyVoteExtension;
};
export declare const ResponseFinalizeBlock: {
    encode(message: ResponseFinalizeBlock, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): ResponseFinalizeBlock;
    fromJSON(object: any): ResponseFinalizeBlock;
    toJSON(message: ResponseFinalizeBlock): unknown;
    create<I extends Exact<DeepPartial<ResponseFinalizeBlock>, I>>(base?: I): ResponseFinalizeBlock;
    fromPartial<I extends Exact<DeepPartial<ResponseFinalizeBlock>, I>>(object: I): ResponseFinalizeBlock;
};
export declare const CommitInfo: {
    encode(message: CommitInfo, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): CommitInfo;
    fromJSON(object: any): CommitInfo;
    toJSON(message: CommitInfo): unknown;
    create<I extends Exact<DeepPartial<CommitInfo>, I>>(base?: I): CommitInfo;
    fromPartial<I extends Exact<DeepPartial<CommitInfo>, I>>(object: I): CommitInfo;
};
export declare const ExtendedCommitInfo: {
    encode(message: ExtendedCommitInfo, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): ExtendedCommitInfo;
    fromJSON(object: any): ExtendedCommitInfo;
    toJSON(message: ExtendedCommitInfo): unknown;
    create<I extends Exact<DeepPartial<ExtendedCommitInfo>, I>>(base?: I): ExtendedCommitInfo;
    fromPartial<I extends Exact<DeepPartial<ExtendedCommitInfo>, I>>(object: I): ExtendedCommitInfo;
};
export declare const Event: {
    encode(message: Event, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): Event;
    fromJSON(object: any): Event;
    toJSON(message: Event): unknown;
    create<I extends Exact<DeepPartial<Event>, I>>(base?: I): Event;
    fromPartial<I extends Exact<DeepPartial<Event>, I>>(object: I): Event;
};
export declare const EventAttribute: {
    encode(message: EventAttribute, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): EventAttribute;
    fromJSON(object: any): EventAttribute;
    toJSON(message: EventAttribute): unknown;
    create<I extends Exact<DeepPartial<EventAttribute>, I>>(base?: I): EventAttribute;
    fromPartial<I extends Exact<DeepPartial<EventAttribute>, I>>(object: I): EventAttribute;
};
export declare const ExecTxResult: {
    encode(message: ExecTxResult, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): ExecTxResult;
    fromJSON(object: any): ExecTxResult;
    toJSON(message: ExecTxResult): unknown;
    create<I extends Exact<DeepPartial<ExecTxResult>, I>>(base?: I): ExecTxResult;
    fromPartial<I extends Exact<DeepPartial<ExecTxResult>, I>>(object: I): ExecTxResult;
};
export declare const TxResult: {
    encode(message: TxResult, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): TxResult;
    fromJSON(object: any): TxResult;
    toJSON(message: TxResult): unknown;
    create<I extends Exact<DeepPartial<TxResult>, I>>(base?: I): TxResult;
    fromPartial<I extends Exact<DeepPartial<TxResult>, I>>(object: I): TxResult;
};
export declare const Validator: {
    encode(message: Validator, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): Validator;
    fromJSON(object: any): Validator;
    toJSON(message: Validator): unknown;
    create<I extends Exact<DeepPartial<Validator>, I>>(base?: I): Validator;
    fromPartial<I extends Exact<DeepPartial<Validator>, I>>(object: I): Validator;
};
export declare const ValidatorUpdate: {
    encode(message: ValidatorUpdate, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): ValidatorUpdate;
    fromJSON(object: any): ValidatorUpdate;
    toJSON(message: ValidatorUpdate): unknown;
    create<I extends Exact<DeepPartial<ValidatorUpdate>, I>>(base?: I): ValidatorUpdate;
    fromPartial<I extends Exact<DeepPartial<ValidatorUpdate>, I>>(object: I): ValidatorUpdate;
};
export declare const VoteInfo: {
    encode(message: VoteInfo, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): VoteInfo;
    fromJSON(object: any): VoteInfo;
    toJSON(message: VoteInfo): unknown;
    create<I extends Exact<DeepPartial<VoteInfo>, I>>(base?: I): VoteInfo;
    fromPartial<I extends Exact<DeepPartial<VoteInfo>, I>>(object: I): VoteInfo;
};
export declare const ExtendedVoteInfo: {
    encode(message: ExtendedVoteInfo, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): ExtendedVoteInfo;
    fromJSON(object: any): ExtendedVoteInfo;
    toJSON(message: ExtendedVoteInfo): unknown;
    create<I extends Exact<DeepPartial<ExtendedVoteInfo>, I>>(base?: I): ExtendedVoteInfo;
    fromPartial<I extends Exact<DeepPartial<ExtendedVoteInfo>, I>>(object: I): ExtendedVoteInfo;
};
export declare const Misbehavior: {
    encode(message: Misbehavior, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): Misbehavior;
    fromJSON(object: any): Misbehavior;
    toJSON(message: Misbehavior): unknown;
    create<I extends Exact<DeepPartial<Misbehavior>, I>>(base?: I): Misbehavior;
    fromPartial<I extends Exact<DeepPartial<Misbehavior>, I>>(object: I): Misbehavior;
};
export declare const Snapshot: {
    encode(message: Snapshot, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): Snapshot;
    fromJSON(object: any): Snapshot;
    toJSON(message: Snapshot): unknown;
    create<I extends Exact<DeepPartial<Snapshot>, I>>(base?: I): Snapshot;
    fromPartial<I extends Exact<DeepPartial<Snapshot>, I>>(object: I): Snapshot;
};
export interface ABCI {
    Echo(request: DeepPartial<RequestEcho>, metadata?: grpc.Metadata): Promise<ResponseEcho>;
    Flush(request: DeepPartial<RequestFlush>, metadata?: grpc.Metadata): Promise<ResponseFlush>;
    Info(request: DeepPartial<RequestInfo>, metadata?: grpc.Metadata): Promise<ResponseInfo>;
    CheckTx(request: DeepPartial<RequestCheckTx>, metadata?: grpc.Metadata): Promise<ResponseCheckTx>;
    Query(request: DeepPartial<RequestQuery>, metadata?: grpc.Metadata): Promise<ResponseQuery>;
    Commit(request: DeepPartial<RequestCommit>, metadata?: grpc.Metadata): Promise<ResponseCommit>;
    InitChain(request: DeepPartial<RequestInitChain>, metadata?: grpc.Metadata): Promise<ResponseInitChain>;
    ListSnapshots(request: DeepPartial<RequestListSnapshots>, metadata?: grpc.Metadata): Promise<ResponseListSnapshots>;
    OfferSnapshot(request: DeepPartial<RequestOfferSnapshot>, metadata?: grpc.Metadata): Promise<ResponseOfferSnapshot>;
    LoadSnapshotChunk(request: DeepPartial<RequestLoadSnapshotChunk>, metadata?: grpc.Metadata): Promise<ResponseLoadSnapshotChunk>;
    ApplySnapshotChunk(request: DeepPartial<RequestApplySnapshotChunk>, metadata?: grpc.Metadata): Promise<ResponseApplySnapshotChunk>;
    PrepareProposal(request: DeepPartial<RequestPrepareProposal>, metadata?: grpc.Metadata): Promise<ResponsePrepareProposal>;
    ProcessProposal(request: DeepPartial<RequestProcessProposal>, metadata?: grpc.Metadata): Promise<ResponseProcessProposal>;
    ExtendVote(request: DeepPartial<RequestExtendVote>, metadata?: grpc.Metadata): Promise<ResponseExtendVote>;
    VerifyVoteExtension(request: DeepPartial<RequestVerifyVoteExtension>, metadata?: grpc.Metadata): Promise<ResponseVerifyVoteExtension>;
    FinalizeBlock(request: DeepPartial<RequestFinalizeBlock>, metadata?: grpc.Metadata): Promise<ResponseFinalizeBlock>;
}
export declare class ABCIClientImpl implements ABCI {
    private readonly rpc;
    constructor(rpc: Rpc);
    Echo(request: DeepPartial<RequestEcho>, metadata?: grpc.Metadata): Promise<ResponseEcho>;
    Flush(request: DeepPartial<RequestFlush>, metadata?: grpc.Metadata): Promise<ResponseFlush>;
    Info(request: DeepPartial<RequestInfo>, metadata?: grpc.Metadata): Promise<ResponseInfo>;
    CheckTx(request: DeepPartial<RequestCheckTx>, metadata?: grpc.Metadata): Promise<ResponseCheckTx>;
    Query(request: DeepPartial<RequestQuery>, metadata?: grpc.Metadata): Promise<ResponseQuery>;
    Commit(request: DeepPartial<RequestCommit>, metadata?: grpc.Metadata): Promise<ResponseCommit>;
    InitChain(request: DeepPartial<RequestInitChain>, metadata?: grpc.Metadata): Promise<ResponseInitChain>;
    ListSnapshots(request: DeepPartial<RequestListSnapshots>, metadata?: grpc.Metadata): Promise<ResponseListSnapshots>;
    OfferSnapshot(request: DeepPartial<RequestOfferSnapshot>, metadata?: grpc.Metadata): Promise<ResponseOfferSnapshot>;
    LoadSnapshotChunk(request: DeepPartial<RequestLoadSnapshotChunk>, metadata?: grpc.Metadata): Promise<ResponseLoadSnapshotChunk>;
    ApplySnapshotChunk(request: DeepPartial<RequestApplySnapshotChunk>, metadata?: grpc.Metadata): Promise<ResponseApplySnapshotChunk>;
    PrepareProposal(request: DeepPartial<RequestPrepareProposal>, metadata?: grpc.Metadata): Promise<ResponsePrepareProposal>;
    ProcessProposal(request: DeepPartial<RequestProcessProposal>, metadata?: grpc.Metadata): Promise<ResponseProcessProposal>;
    ExtendVote(request: DeepPartial<RequestExtendVote>, metadata?: grpc.Metadata): Promise<ResponseExtendVote>;
    VerifyVoteExtension(request: DeepPartial<RequestVerifyVoteExtension>, metadata?: grpc.Metadata): Promise<ResponseVerifyVoteExtension>;
    FinalizeBlock(request: DeepPartial<RequestFinalizeBlock>, metadata?: grpc.Metadata): Promise<ResponseFinalizeBlock>;
}
export declare const ABCIDesc: {
    serviceName: string;
};
export declare const ABCIEchoDesc: UnaryMethodDefinitionish;
export declare const ABCIFlushDesc: UnaryMethodDefinitionish;
export declare const ABCIInfoDesc: UnaryMethodDefinitionish;
export declare const ABCICheckTxDesc: UnaryMethodDefinitionish;
export declare const ABCIQueryDesc: UnaryMethodDefinitionish;
export declare const ABCICommitDesc: UnaryMethodDefinitionish;
export declare const ABCIInitChainDesc: UnaryMethodDefinitionish;
export declare const ABCIListSnapshotsDesc: UnaryMethodDefinitionish;
export declare const ABCIOfferSnapshotDesc: UnaryMethodDefinitionish;
export declare const ABCILoadSnapshotChunkDesc: UnaryMethodDefinitionish;
export declare const ABCIApplySnapshotChunkDesc: UnaryMethodDefinitionish;
export declare const ABCIPrepareProposalDesc: UnaryMethodDefinitionish;
export declare const ABCIProcessProposalDesc: UnaryMethodDefinitionish;
export declare const ABCIExtendVoteDesc: UnaryMethodDefinitionish;
export declare const ABCIVerifyVoteExtensionDesc: UnaryMethodDefinitionish;
export declare const ABCIFinalizeBlockDesc: UnaryMethodDefinitionish;
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
