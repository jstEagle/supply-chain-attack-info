import { ChainAdapter } from "./index";
import { NormalizedTransaction } from "@/lib/types";

// Uses Blockstream API (no key) https://blockstream.info/api/
export const bitcoinAdapter: ChainAdapter = {
    symbol: "BTC",
    async fetchIncomingTransactions(
        address: string
    ): Promise<NormalizedTransaction[]> {
        try {
            const resp = await fetch(
                `https://blockstream.info/api/address/${address}/txs`,
                { cache: "no-store" }
            );
            if (!resp.ok) return [];
            const data = await resp.json().catch(() => [] as unknown);

            type BlockstreamVout = {
                scriptpubkey_address?: string;
                value?: number;
            };
            type BlockstreamOut = { address?: string; satoshis?: number };
            type BlockstreamTx = {
                txid?: string;
                hash?: string;
                time?: number;
                status?: { block_time?: number };
                vout?: BlockstreamVout[];
                out?: BlockstreamOut[];
            };

            const txs: NormalizedTransaction[] = [];
            const arr = Array.isArray(data) ? (data as unknown[]) : [];
            for (const entry of arr) {
                const tx = entry as BlockstreamTx;
                const outs: Array<BlockstreamVout | BlockstreamOut> =
                    Array.isArray(tx.vout) ? tx.vout! : tx.out ?? [];
                for (const o of outs) {
                    const out = o as Partial<BlockstreamVout & BlockstreamOut>;
                    const toAddr = out.scriptpubkey_address ?? out.address;
                    if (toAddr === address) {
                        const amountSats = (out.value ??
                            out.satoshis ??
                            0) as number;
                        const txid = tx.txid ?? tx.hash;
                        if (!txid) {
                            continue;
                        }
                        txs.push({
                            chain: "bitcoin",
                            txid,
                            to: address,
                            amount: Number(amountSats) / 1e8,
                            symbol: "BTC",
                            timestamp:
                                tx.status?.block_time ?? tx.time ?? undefined,
                            explorerUrl: `https://blockstream.info/tx/${txid}`,
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
