import { ChainAdapter } from "./index";
import { NormalizedTransaction } from "@/lib/types";

// Blockchair public API for Litecoin
export const litecoinAdapter: ChainAdapter = {
    symbol: "LTC",
    async fetchIncomingTransactions(
        address: string
    ): Promise<NormalizedTransaction[]> {
        try {
            const resp = await fetch(
                `https://api.blockchair.com/litecoin/dashboards/address/${address}`,
                { cache: "no-store" }
            );
            if (!resp.ok) return [];
            const json = await resp.json().catch(() => ({} as any));
            const data = (json as any)?.data?.[address];
            const txs: NormalizedTransaction[] = [];
            const txHashes: string[] = data?.transactions || [];
            for (const hash of txHashes.slice(0, 20)) {
                const txResp = await fetch(
                    `https://api.blockchair.com/litecoin/raw/transaction/${hash}`,
                    { cache: "no-store" }
                );
                if (!txResp.ok) continue;
                const raw = await txResp.json().catch(() => ({} as any));
                const outs =
                    (raw as any)?.data?.[hash]?.decoded_raw_transaction?.vout ||
                    [];
                for (const o of outs) {
                    const addresses: string[] =
                        (o as any)?.scriptPubKey?.addresses || [];
                    if (addresses.includes(address)) {
                        const amount = Number((o as any).value || 0);
                        txs.push({
                            chain: "litecoin",
                            txid: hash,
                            to: address,
                            amount,
                            symbol: "LTC",
                            explorerUrl: `https://blockchair.com/litecoin/transaction/${hash}`,
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
