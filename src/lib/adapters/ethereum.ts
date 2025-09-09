import { ChainAdapter } from "./index";
import { NormalizedTransaction } from "@/lib/types";

// Use Blockscout public instance for mainnet as fallback; better to use Etherscan with key.
export const ethereumAdapter: ChainAdapter = {
    symbol: "ETH",
    async fetchIncomingTransactions(
        address: string
    ): Promise<NormalizedTransaction[]> {
        try {
            const resp = await fetch(
                `https://eth.blockscout.com/api/v2/addresses/${address}/transactions?filter=to&order=desc&items_count=50`,
                { cache: "no-store" }
            );
            if (!resp.ok) return [];
            const json = await resp.json().catch(() => ({} as any));
            const items = (json as any)?.items || [];
            const txs: NormalizedTransaction[] = (items as any[]).map(
                (it: any) => ({
                    chain: "ethereum",
                    txid: it.hash,
                    from: it.from?.hash,
                    to: it.to?.hash || address,
                    amount: Number(it.value || 0) / 1e18,
                    symbol: "ETH",
                    timestamp: it.timestamp
                        ? Math.floor(new Date(it.timestamp).getTime() / 1000)
                        : undefined,
                    explorerUrl: `https://etherscan.io/tx/${it.hash}`,
                    addressMatched: address,
                })
            );
            return txs;
        } catch {
            return [];
        }
    },
};
