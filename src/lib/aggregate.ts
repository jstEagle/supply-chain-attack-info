import {
    ChainTotals,
    NormalizedTransaction,
    SupportedChain,
} from "@/lib/types";

export function aggregateTotals(txs: NormalizedTransaction[]): ChainTotals[] {
    const byChain: Record<SupportedChain, ChainTotals> = {
        bitcoin: { chain: "bitcoin", symbol: "BTC", totalReceived: 0 },
        bitcoincash: { chain: "bitcoincash", symbol: "BCH", totalReceived: 0 },
        ethereum: { chain: "ethereum", symbol: "ETH", totalReceived: 0 },
        tron: { chain: "tron", symbol: "TRX", totalReceived: 0 },
        solana: { chain: "solana", symbol: "SOL", totalReceived: 0 },
        litecoin: { chain: "litecoin", symbol: "LTC", totalReceived: 0 },
    };

    for (const t of txs) {
        byChain[t.chain].totalReceived += t.amount;
    }
    return Object.values(byChain);
}
