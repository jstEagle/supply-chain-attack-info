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
            const json = await resp.json().catch(() => [] as any);
            const txs: NormalizedTransaction[] = [];
            for (const tx of Array.isArray(json) ? json : []) {
                const transfers =
                    (tx as any).parsedInstruction?.filter?.(
                        (i: any) => i.type === "transfer"
                    ) || [];
                for (const t of transfers) {
                    if (t?.params?.destination === address) {
                        const lamports = Number(t?.params?.amount || 0);
                        const txHash = (tx as any).txHash;
                        txs.push({
                            chain: "solana",
                            txid: txHash,
                            from: t?.params?.source,
                            to: address,
                            amount: lamports / 1e9,
                            symbol: "SOL",
                            timestamp: (tx as any).blockTime,
                            explorerUrl: txHash
                                ? `https://solscan.io/tx/${txHash}`
                                : undefined,
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
