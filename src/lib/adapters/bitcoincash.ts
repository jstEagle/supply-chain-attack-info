import { ChainAdapter } from "./index";
import { NormalizedTransaction } from "@/lib/types";

// Use Blockchair public API for BCH if rate allows (no key but may throttle)
export const bitcoincashAdapter: ChainAdapter = {
    symbol: "BCH",
    async fetchIncomingTransactions(
        address: string
    ): Promise<NormalizedTransaction[]> {
        try {
            const resp = await fetch(
                `https://api.blockchair.com/bitcoin-cash/dashboards/address/${address}`,
                { cache: "no-store" }
            );
            if (!resp.ok) return [];
            const json = await resp.json().catch(() => ({} as any));
            const data = (json as any)?.data?.[address];
            const txs: NormalizedTransaction[] = [];
            const txHashes: string[] = data?.transactions || [];
            for (const hash of txHashes.slice(0, 20)) {
                const txResp = await fetch(
                    `https://api.blockchair.com/bitcoin-cash/raw/transaction/${hash}`,
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
                            chain: "bitcoincash",
                            txid: hash,
                            to: address,
                            amount,
                            symbol: "BCH",
                            explorerUrl: `https://blockchair.com/bitcoin-cash/transaction/${hash}`,
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
