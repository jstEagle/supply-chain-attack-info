import { NormalizedTransaction, SupportedChain } from "@/lib/types";

export interface ChainAdapter {
    symbol: string;
    fetchIncomingTransactions: (
        address: string
    ) => Promise<NormalizedTransaction[]>;
}

export async function fetchAllForChain(
    adapter: ChainAdapter,
    chain: SupportedChain,
    addresses: string[]
): Promise<NormalizedTransaction[]> {
    const results = await Promise.all(
        addresses.map(async (addr) => {
            try {
                const txs = await adapter.fetchIncomingTransactions(addr);
                return txs.map((t) => ({ ...t, chain, addressMatched: addr }));
            } catch {
                return [];
            }
        })
    );
    return results.flat();
}
