import _m0 from "protobufjs/minimal";
import { CurrencyPair } from "../../types/v2/currency_pair";
export declare const protobufPackage = "connect.marketmap.v2";
/** Market encapsulates a Ticker and its provider-specific configuration. */
export interface Market {
    /**
     * Ticker represents a price feed for a given asset pair i.e. BTC/USD. The
     * price feed is scaled to a number of decimal places and has a minimum number
     * of providers required to consider the ticker valid.
     */
    ticker?: Ticker | undefined;
    /** ProviderConfigs is the list of provider-specific configs for this Market. */
    providerConfigs: ProviderConfig[];
}
/**
 * Ticker represents a price feed for a given asset pair i.e. BTC/USD. The price
 * feed is scaled to a number of decimal places and has a minimum number of
 * providers required to consider the ticker valid.
 */
export interface Ticker {
    /** CurrencyPair is the currency pair for this ticker. */
    currencyPair?: CurrencyPair | undefined;
    /**
     * Decimals is the number of decimal places for the ticker. The number of
     * decimal places is used to convert the price to a human-readable format.
     */
    decimals: bigint;
    /**
     * MinProviderCount is the minimum number of providers required to consider
     * the ticker valid.
     */
    minProviderCount: bigint;
    /**
     * Enabled is the flag that denotes if the Ticker is enabled for price
     * fetching by an oracle.
     */
    enabled: boolean;
    /**
     * MetadataJSON is a string of JSON that encodes any extra configuration
     * for the given ticker.
     */
    metadataJSON: string;
}
export interface ProviderConfig {
    /**
     * Name corresponds to the name of the provider for which the configuration is
     * being set.
     */
    name: string;
    /**
     * OffChainTicker is the off-chain representation of the ticker i.e. BTC/USD.
     * The off-chain ticker is unique to a given provider and is used to fetch the
     * price of the ticker from the provider.
     */
    offChainTicker: string;
    /**
     * NormalizeByPair is the currency pair for this ticker to be normalized by.
     * For example, if the desired Ticker is BTC/USD, this market could be reached
     * using: OffChainTicker = BTC/USDT NormalizeByPair = USDT/USD This field is
     * optional and nullable.
     */
    normalizeByPair?: CurrencyPair | undefined;
    /**
     * Invert is a boolean indicating if the BASE and QUOTE of the market should
     * be inverted. i.e. BASE -> QUOTE, QUOTE -> BASE
     */
    invert: boolean;
    /**
     * MetadataJSON is a string of JSON that encodes any extra configuration
     * for the given provider config.
     */
    metadataJSON: string;
}
/** MarketMap maps ticker strings to their Markets. */
export interface MarketMap {
    /**
     * Markets is the full list of tickers and their associated configurations
     * to be stored on-chain.
     */
    markets: Map<string, Market>;
}
export interface MarketMap_MarketsEntry {
    key: string;
    value?: Market | undefined;
}
export declare const Market: {
    encode(message: Market, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): Market;
    fromJSON(object: any): Market;
    toJSON(message: Market): unknown;
    create(base?: DeepPartial<Market>): Market;
    fromPartial(object: DeepPartial<Market>): Market;
};
export declare const Ticker: {
    encode(message: Ticker, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): Ticker;
    fromJSON(object: any): Ticker;
    toJSON(message: Ticker): unknown;
    create(base?: DeepPartial<Ticker>): Ticker;
    fromPartial(object: DeepPartial<Ticker>): Ticker;
};
export declare const ProviderConfig: {
    encode(message: ProviderConfig, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): ProviderConfig;
    fromJSON(object: any): ProviderConfig;
    toJSON(message: ProviderConfig): unknown;
    create(base?: DeepPartial<ProviderConfig>): ProviderConfig;
    fromPartial(object: DeepPartial<ProviderConfig>): ProviderConfig;
};
export declare const MarketMap: {
    encode(message: MarketMap, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MarketMap;
    fromJSON(object: any): MarketMap;
    toJSON(message: MarketMap): unknown;
    create(base?: DeepPartial<MarketMap>): MarketMap;
    fromPartial(object: DeepPartial<MarketMap>): MarketMap;
};
export declare const MarketMap_MarketsEntry: {
    encode(message: MarketMap_MarketsEntry, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MarketMap_MarketsEntry;
    fromJSON(object: any): MarketMap_MarketsEntry;
    toJSON(message: MarketMap_MarketsEntry): unknown;
    create(base?: DeepPartial<MarketMap_MarketsEntry>): MarketMap_MarketsEntry;
    fromPartial(object: DeepPartial<MarketMap_MarketsEntry>): MarketMap_MarketsEntry;
};
type Builtin = Date | Function | Uint8Array | string | number | boolean | bigint | undefined;
export type DeepPartial<T> = T extends Builtin ? T : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
export {};
