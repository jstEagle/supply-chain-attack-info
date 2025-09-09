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
            const json = (await resp.json().catch(() => ({} as unknown))) as {
                data?: Array<{
                    toAddress?: string;
                    tokenInfo?: { tokenAbbr?: string };
                    transactionHash?: string;
                    transferFromAddress?: string;
                    amount?: number | string;
                    timestamp?: number;
                }>;
            };
            const data = json?.data || [];
            const txs: NormalizedTransaction[] = [];
            for (const d of data) {
                if (d.toAddress !== address) continue;
                if (d.tokenInfo?.tokenAbbr !== "TRX") continue;
                if (!d.transactionHash) continue;
                txs.push({
                    chain: "tron",
                    txid: d.transactionHash,
                    from: d.transferFromAddress,
                    to: d.toAddress,
                    amount: Number(d.amount || 0) / 1e6,
                    symbol: "TRX",
                    timestamp: Math.floor((d.timestamp || 0) / 1000),
                    explorerUrl: `https://tronscan.org/#/transaction/${d.transactionHash}`,
                    addressMatched: address,
                });
            }
            return txs;
        } catch {
            return [];
        }
    },
};
