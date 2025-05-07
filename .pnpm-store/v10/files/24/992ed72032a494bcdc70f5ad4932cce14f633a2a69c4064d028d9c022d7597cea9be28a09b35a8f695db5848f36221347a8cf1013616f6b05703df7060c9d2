import _m0 from "protobufjs/minimal";
export declare const protobufPackage = "initia.move.v1";
/** UpgradePolicy is the policy for upgrading a move module. */
export declare enum UpgradePolicy {
    /** UNSPECIFIED - UNSPECIFIED: a placeholder for an unspecified upgrade policy. */
    UNSPECIFIED = 0,
    /**
     * COMPATIBLE - COMPATIBLE: Whether a compatibility check should be performed for upgrades. The check only passes if
     * a new module has (a) the same public functions (b) for existing resources, no layout change.
     */
    COMPATIBLE = 1,
    /** IMMUTABLE - IMMUTABLE: Whether the modules in the package are immutable and cannot be upgraded. */
    IMMUTABLE = 2,
    UNRECOGNIZED = -1
}
export declare function upgradePolicyFromJSON(object: any): UpgradePolicy;
export declare function upgradePolicyToJSON(object: UpgradePolicy): string;
/** Params defines the set of move parameters. */
export interface Params {
    baseDenom: string;
    baseMinGasPrice: string;
    /** CSR: Percentage of fees distributed to developers */
    contractSharedRevenueRatio: string;
    /** flag whether to enable script execution */
    scriptEnabled: boolean;
    /**
     * It is a list of addresses with permission to distribute contracts,
     * and an empty list is interpreted as allowing anyone to distribute.
     */
    allowedPublishers: string[];
}
/** RawParams defines the raw params to store. */
export interface RawParams {
    baseDenom: string;
    baseMinGasPrice: string;
    /** CSR: Percentage of fees distributed to developers */
    contractSharedRevenueRatio: string;
    /** flag whether to enable script execution */
    scriptEnabled: boolean;
}
/** Module is data for the uploaded contract move code */
export interface Module {
    address: string;
    moduleName: string;
    abi: string;
    rawBytes: Uint8Array;
    upgradePolicy: UpgradePolicy;
}
/** Checksum is checksum of the uploaded contract move code */
export interface Checksum {
    address: string;
    moduleName: string;
    checksum: Uint8Array;
}
/** Resource is data for the stored move resource */
export interface Resource {
    address: string;
    structTag: string;
    moveResource: string;
    rawBytes: Uint8Array;
}
/** TableInfo is data stored under Table address */
export interface TableInfo {
    address: string;
    keyType: string;
    valueType: string;
}
/** TableEntry is data stored under Table address and the key bytes */
export interface TableEntry {
    address: string;
    key: string;
    value: string;
    keyBytes: Uint8Array;
    valueBytes: Uint8Array;
}
/** proto wrapper to store the value */
export interface UpgradePolicyProto {
    policy: UpgradePolicy;
}
/**
 * DexPair contains coin metadata address
 * std::dex::Pool and std::dex::Config resources.
 */
export interface DexPair {
    metadataQuote: string;
    metadataLp: string;
}
/** ExecuteAuthorizationItem is the information for granting module execution */
export interface ExecuteAuthorizationItem {
    /** ModuleAddr is the address of the module deployer */
    moduleAddress: string;
    /** ModuleName is the names of module to execute */
    moduleName: string;
    /** FunctionName is the name of function to execute with wildcard '*' support */
    functionNames: string[];
}
export declare const Params: {
    encode(message: Params, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): Params;
    fromJSON(object: any): Params;
    toJSON(message: Params): unknown;
    create(base?: DeepPartial<Params>): Params;
    fromPartial(object: DeepPartial<Params>): Params;
};
export declare const RawParams: {
    encode(message: RawParams, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): RawParams;
    fromJSON(object: any): RawParams;
    toJSON(message: RawParams): unknown;
    create(base?: DeepPartial<RawParams>): RawParams;
    fromPartial(object: DeepPartial<RawParams>): RawParams;
};
export declare const Module: {
    encode(message: Module, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): Module;
    fromJSON(object: any): Module;
    toJSON(message: Module): unknown;
    create(base?: DeepPartial<Module>): Module;
    fromPartial(object: DeepPartial<Module>): Module;
};
export declare const Checksum: {
    encode(message: Checksum, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): Checksum;
    fromJSON(object: any): Checksum;
    toJSON(message: Checksum): unknown;
    create(base?: DeepPartial<Checksum>): Checksum;
    fromPartial(object: DeepPartial<Checksum>): Checksum;
};
export declare const Resource: {
    encode(message: Resource, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): Resource;
    fromJSON(object: any): Resource;
    toJSON(message: Resource): unknown;
    create(base?: DeepPartial<Resource>): Resource;
    fromPartial(object: DeepPartial<Resource>): Resource;
};
export declare const TableInfo: {
    encode(message: TableInfo, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): TableInfo;
    fromJSON(object: any): TableInfo;
    toJSON(message: TableInfo): unknown;
    create(base?: DeepPartial<TableInfo>): TableInfo;
    fromPartial(object: DeepPartial<TableInfo>): TableInfo;
};
export declare const TableEntry: {
    encode(message: TableEntry, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): TableEntry;
    fromJSON(object: any): TableEntry;
    toJSON(message: TableEntry): unknown;
    create(base?: DeepPartial<TableEntry>): TableEntry;
    fromPartial(object: DeepPartial<TableEntry>): TableEntry;
};
export declare const UpgradePolicyProto: {
    encode(message: UpgradePolicyProto, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): UpgradePolicyProto;
    fromJSON(object: any): UpgradePolicyProto;
    toJSON(message: UpgradePolicyProto): unknown;
    create(base?: DeepPartial<UpgradePolicyProto>): UpgradePolicyProto;
    fromPartial(object: DeepPartial<UpgradePolicyProto>): UpgradePolicyProto;
};
export declare const DexPair: {
    encode(message: DexPair, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): DexPair;
    fromJSON(object: any): DexPair;
    toJSON(message: DexPair): unknown;
    create(base?: DeepPartial<DexPair>): DexPair;
    fromPartial(object: DeepPartial<DexPair>): DexPair;
};
export declare const ExecuteAuthorizationItem: {
    encode(message: ExecuteAuthorizationItem, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): ExecuteAuthorizationItem;
    fromJSON(object: any): ExecuteAuthorizationItem;
    toJSON(message: ExecuteAuthorizationItem): unknown;
    create(base?: DeepPartial<ExecuteAuthorizationItem>): ExecuteAuthorizationItem;
    fromPartial(object: DeepPartial<ExecuteAuthorizationItem>): ExecuteAuthorizationItem;
};
type Builtin = Date | Function | Uint8Array | string | number | boolean | bigint | undefined;
export type DeepPartial<T> = T extends Builtin ? T : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
export {};
