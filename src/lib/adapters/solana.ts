import { ChainAdapter } from "./index";
import { NormalizedTransaction } from "@/lib/types";

// Solscan public API (rate-limited)
export const solanaAdapter: ChainAdapter = {
    symbol: "SOL",
    async fetchIncomingTransactions(
        address: string
    ): Promise<NormalizedTransaction[]> {
        try {
            const resp = await fetch(
                `https://public-api.solscan.io/account/transactions?address=${address}&limit=50`,
                { cache: "no-store" }
            );
            if (!resp.ok) return [];
            const json = (await resp
                .json()
                .catch(() => [] as unknown)) as unknown[];
            const txs: NormalizedTransaction[] = [];
            for (const entry of Array.isArray(json) ? json : []) {
                type Transfer = {
                    type?: string;
                    params?: {
                        destination?: string;
                        source?: string;
                        amount?: string | number;
                    };
                };
                type SolTx = {
                    parsedInstruction?: Transfer[];
                    txHash?: string;
                    blockTime?: number;
                };
                const tx = entry as SolTx;
                const transfers = (tx.parsedInstruction || []).filter(
                    (i) => i.type === "transfer"
                );
                for (const t of transfers) {
                    if (t?.params?.destination === address) {
                        const lamports = Number(t?.params?.amount || 0);
                        const txHash = tx.txHash;
                        if (!txHash) continue;
                        txs.push({
                            chain: "solana",
                            txid: txHash,
                            from: t?.params?.source,
                            to: address,
                            amount: lamports / 1e9,
                            symbol: "SOL",
                            timestamp: tx.blockTime,
                            explorerUrl: `https://solscan.io/tx/${txHash}`,
                            addressMatched: address,
                        });
                    }
                }
            }
            return txs;
        } catch {
            return [];
        }
    },
};
