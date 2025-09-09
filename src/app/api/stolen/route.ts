import { NextResponse } from "next/server";
import { getChainAddresses } from "@/lib/attackers";
import { fetchAllForChain } from "@/lib/adapters";
import { bitcoinAdapter } from "@/lib/adapters/bitcoin";
import { bitcoincashAdapter } from "@/lib/adapters/bitcoincash";
import { ethereumAdapter } from "@/lib/adapters/ethereum";
import { tronAdapter } from "@/lib/adapters/tron";
import { solanaAdapter } from "@/lib/adapters/solana";
import { litecoinAdapter } from "@/lib/adapters/litecoin";
import { aggregateTotals } from "@/lib/aggregate";

export const runtime = "edge";
export const revalidate = 300; // 5 minutes ISR-like

export async function GET() {
    try {
        const [btc, bch, eth, trx, sol, ltc] = await Promise.all([
            fetchAllForChain(
                bitcoinAdapter,
                "bitcoin",
                getChainAddresses("bitcoin")
            ),
            fetchAllForChain(
                bitcoincashAdapter,
                "bitcoincash",
                getChainAddresses("bitcoincash")
            ),
            fetchAllForChain(
                ethereumAdapter,
                "ethereum",
                getChainAddresses("ethereum")
            ),
            fetchAllForChain(tronAdapter, "tron", getChainAddresses("tron")),
            fetchAllForChain(
                solanaAdapter,
                "solana",
                getChainAddresses("solana")
            ),
            fetchAllForChain(
                litecoinAdapter,
                "litecoin",
                getChainAddresses("litecoin")
            ),
        ]);
        const transactions = [...btc, ...bch, ...eth, ...trx, ...sol, ...ltc];
        const totals = aggregateTotals(transactions);

        const res = NextResponse.json({
            totals,
            transactions,
            lastUpdated: new Date().toISOString(),
        });
        res.headers.set(
            "Cache-Control",
            "public, s-maxage=300, stale-while-revalidate=600"
        );
        return res;
    } catch {
        const res = NextResponse.json(
            { error: "failed_to_fetch", message: "Error fetching chain data" },
            { status: 500 }
        );
        res.headers.set(
            "Cache-Control",
            "public, s-maxage=60, stale-while-revalidate=120"
        );
        return res;
    }
}
