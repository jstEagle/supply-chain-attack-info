import { ChainAdapter } from "./index";
import { NormalizedTransaction } from "@/lib/types";

// Tronscan public API (rate-limited)
export const tronAdapter: ChainAdapter = {
    symbol: "TRX",
    async fetchIncomingTransactions(
        address: string
    ): Promise<NormalizedTransaction[]> {
        try {
            const resp = await fetch(
                `https://apilist.tronscanapi.com/api/transfer?sort=-timestamp&count=true&limit=50&toAddress=${address}`,
                { cache: "no-store" }
            );
            if (!resp.ok) return [];
            const json = await resp.json().catch(() => ({} as any));
            const data = (json as any)?.data || [];
            const txs: NormalizedTransaction[] = (data as any[])
                .filter(
                    (d: any) =>
                        d.toAddress === address &&
                        d.tokenInfo?.tokenAbbr === "TRX"
                )
                .map((d: any) => ({
                    chain: "tron",
                    txid: d.transactionHash,
                    from: d.transferFromAddress,
                    to: d.toAddress,
                    amount: Number(d.amount || 0) / 1e6,
                    symbol: "TRX",
                    timestamp: Math.floor((d.timestamp || 0) / 1000),
                    explorerUrl: `https://tronscan.org/#/transaction/${d.transactionHash}`,
                    addressMatched: address,
                }));
            return txs;
        } catch {
            return [];
        }
    },
};
