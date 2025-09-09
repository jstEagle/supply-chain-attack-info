"use client";
import { useQuery } from "@tanstack/react-query";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

interface TotalsItem {
    chain: "bitcoin" | "bitcoincash" | "ethereum" | "tron" | "solana";
    symbol: string;
    totalReceived: number;
}

interface TxnItem {
    chain: TotalsItem["chain"];
    txid: string;
    from?: string;
    to?: string;
    amount: number;
    symbol: string;
    timestamp?: number;
    explorerUrl?: string;
    addressMatched: string;
}

interface ApiResponse {
    totals: TotalsItem[];
    transactions: TxnItem[];
    lastUpdated: string;
}

async function fetchData(): Promise<ApiResponse> {
    const res = await fetch("/api/stolen", { next: { revalidate: 300 } });
    if (!res.ok) throw new Error("Failed to load");
    return res.json();
}

export default function StolenPage() {
    // Mark client
    return <ClientStolen />;
}

function ClientStolen() {
    dayjs.extend(relativeTime);
    const { data, isLoading, error } = useQuery({
        queryKey: ["stolen"],
        queryFn: fetchData,
        staleTime: 1000 * 60,
    });
    const [chainFilter, setChainFilter] = useState<null | TotalsItem["chain"]>(
        null
    );
    const [sorting, setSorting] = useState<SortingState>([
        { id: "timestamp", desc: true },
    ]);

    const filteredTxs = useMemo(() => {
        const txs = data?.transactions ?? [];
        return chainFilter ? txs.filter((t) => t.chain === chainFilter) : txs;
    }, [data, chainFilter]);

    const columnHelper = createColumnHelper<TxnItem>();
    const columns = useMemo(
        () => [
            columnHelper.accessor("chain", {
                header: "Chain",
                cell: (info) => info.getValue(),
            }),
            columnHelper.accessor("symbol", {
                header: "Asset",
                cell: (info) => info.getValue(),
            }),
            columnHelper.accessor("amount", {
                header: "Amount",
                cell: (info) =>
                    info.getValue().toLocaleString(undefined, {
                        maximumFractionDigits: 8,
                    }),
            }),
            columnHelper.accessor("timestamp", {
                header: "Time",
                cell: (info) =>
                    info.getValue()
                        ? dayjs(info.getValue()! * 1000).fromNow()
                        : "—",
            }),
            columnHelper.accessor("txid", {
                header: "Transaction",
                cell: (info) => {
                    const row = info.row.original;
                    return row.explorerUrl ? (
                        <a
                            className="text-blue-600 hover:underline"
                            target="_blank"
                            rel="noreferrer"
                            href={row.explorerUrl}
                        >
                            {info.getValue().slice(0, 10)}…
                        </a>
                    ) : (
                        info.getValue()
                    );
                },
            }),
            columnHelper.accessor("addressMatched", {
                header: "Attack Address",
                cell: (info) => (
                    <code className="text-xs">{info.getValue()}</code>
                ),
            }),
        ],
        [columnHelper]
    );

    const table = useReactTable({
        data: filteredTxs,
        columns,
        state: { sorting },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    if (isLoading) return <div className="opacity-70">Loading…</div>;
    if (error) return <div className="text-red-600">Failed to load.</div>;

    return (
        <div className="space-y-8">
            <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">Stolen funds</h1>
                    <p className="text-sm opacity-70">
                        Aggregated incoming transfers to attacker addresses
                        across chains.
                    </p>
                </div>
                <div className="flex gap-2 flex-wrap items-center">
                    <label className="text-sm opacity-80">Filter:</label>
                    <button
                        onClick={() => setChainFilter(null)}
                        className={`px-3 py-1 rounded border ${
                            chainFilter === null
                                ? "bg-foreground text-background"
                                : "border-black/10 dark:border-white/10"
                        }`}
                    >
                        All
                    </button>
                    {data!.totals.map((t) => (
                        <button
                            key={t.chain}
                            onClick={() => setChainFilter(t.chain)}
                            className={`px-3 py-1 rounded border ${
                                chainFilter === t.chain
                                    ? "bg-foreground text-background"
                                    : "border-black/10 dark:border-white/10"
                            }`}
                        >
                            {t.symbol}
                        </button>
                    ))}
                </div>
            </header>

            <section>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {data!.totals.map((t) => (
                        <div
                            key={t.chain}
                            className="rounded-lg glass p-4 soft-shadow"
                        >
                            <div className="text-xs opacity-70">
                                {t.chain.toUpperCase()}
                            </div>
                            <div className="text-lg font-semibold">
                                {t.totalReceived.toLocaleString(undefined, {
                                    maximumFractionDigits: 6,
                                })}{" "}
                                {t.symbol}
                            </div>
                        </div>
                    ))}
                </div>
                <p className="text-xs opacity-60 mt-1">
                    Last updated {dayjs(data!.lastUpdated).fromNow()}.
                </p>
            </section>

            <section className="space-y-3">
                <h2 className="text-lg font-semibold">Transactions</h2>
                <div className="overflow-x-auto rounded-lg glass soft-shadow">
                    <table className="w-full text-sm">
                        <thead className="bg-white/5">
                            {table.getHeaderGroups().map((hg) => (
                                <tr key={hg.id}>
                                    {hg.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            className="text-left px-3 py-2 cursor-pointer select-none"
                                            onClick={header.column.getToggleSortingHandler()}
                                        >
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                            {{ asc: " ↑", desc: " ↓" }[
                                                header.column.getIsSorted() as string
                                            ] ?? null}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {table.getRowModel().rows.map((row) => (
                                <tr
                                    key={row.id}
                                    className="border-t border-black/5 dark:border-white/5"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <td
                                            key={cell.id}
                                            className="px-3 py-2 whitespace-nowrap"
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="text-xs opacity-70">
                Data is fetched from public explorers and cached at the CDN edge
                for 5 minutes.
            </section>
        </div>
    );
}
