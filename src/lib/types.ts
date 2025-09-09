export type SupportedChain =
    | "bitcoin"
    | "bitcoincash"
    | "ethereum"
    | "tron"
    | "solana"
    | "litecoin";

export interface ChainAddress {
    chain: SupportedChain;
    address: string;
}

export interface NormalizedTransaction {
    chain: SupportedChain;
    txid: string;
    from?: string;
    to?: string;
    amount: number; // in native units
    amountUsd?: number; // optional, computed later
    symbol: string; // e.g., BTC, BCH, ETH, TRX, SOL
    timestamp?: number; // unix seconds
    explorerUrl?: string;
    addressMatched: string; // the attacker address that received funds
}

export interface ChainTotals {
    chain: SupportedChain;
    symbol: string;
    totalReceived: number; // native units
    totalReceivedUsd?: number;
}

export interface AggregatedStatsResponse {
    totals: ChainTotals[];
    grandTotalUsd?: number;
    lastUpdated: string;
}
