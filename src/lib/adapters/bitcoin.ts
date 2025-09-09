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
            const data = await resp.json().catch(() => []);
            const txs: NormalizedTransaction[] = [];
            for (const tx of Array.isArray(data) ? data : []) {
                const outs = Array.isArray((tx as any).vout)
                    ? (tx as any).vout
                    : (tx as any).out || [];
                for (const o of outs) {
                    const scriptpubkey_address =
                        (o as any).scriptpubkey_address || (o as any).address;
                    if (scriptpubkey_address === address) {
                        const amountSats =
                            (o as any).value ?? (o as any).satoshis ?? 0;
                        const txid = (tx as any).txid || (tx as any).hash;
                        txs.push({
                            chain: "bitcoin",
                            txid,
                            to: address,
                            amount: Number(amountSats) / 1e8,
                            symbol: "BTC",
                            timestamp:
                                (tx as any).status?.block_time ||
                                (tx as any).time ||
                                undefined,
                            explorerUrl: txid
                                ? `https://blockstream.info/tx/${txid}`
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
