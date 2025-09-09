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
            const json = (await resp.json().catch(() => ({} as unknown))) as {
                data?: Record<
                    string,
                    {
                        transactions?: string[];
                    }
                >;
            };
            const data = json?.data?.[address];
            const txs: NormalizedTransaction[] = [];
            const txHashes: string[] = data?.transactions || [];
            for (const hash of txHashes.slice(0, 20)) {
                const txResp = await fetch(
                    `https://api.blockchair.com/bitcoin-cash/raw/transaction/${hash}`,
                    { cache: "no-store" }
                );
                if (!txResp.ok) continue;
                const raw = (await txResp
                    .json()
                    .catch(() => ({} as unknown))) as {
                    data?: Record<
                        string,
                        {
                            decoded_raw_transaction?: {
                                vout?: Array<{
                                    value?: number | string;
                                    scriptPubKey?: { addresses?: string[] };
                                }>;
                            };
                        }
                    >;
                };
                const outs =
                    raw?.data?.[hash]?.decoded_raw_transaction?.vout || [];
                for (const o of outs) {
                    const addresses: string[] =
                        o?.scriptPubKey?.addresses || [];
                    if (addresses.includes(address)) {
                        const amount = Number(o.value || 0);
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
