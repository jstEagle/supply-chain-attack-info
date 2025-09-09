import Link from "next/link";

export default function Home() {
    return (
        <div className="space-y-16">
            <section className="relative overflow-hidden rounded-2xl px-6 py-16 sm:px-12 glass soft-shadow">
                <div className="absolute -top-20 left-1/2 -translate-x-1/2 h-72 w-72 bg-cyan-400/30 blur-3xl rounded-full" />
                <div className="absolute -bottom-24 right-1/2 translate-x-1/2 h-72 w-72 bg-fuchsia-400/20 blur-3xl rounded-full" />
                <div className="mx-auto max-w-3xl text-center space-y-6 relative">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[12px] uppercase tracking-wide">
                        <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                        Live Monitor
                    </div>
                    <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent">
                        Supply Chain Attack Tracker
                    </h1>
                    <p className="text-base sm:text-lg/7 opacity-90 max-w-3xl mx-auto">
                        A major supply chain attack on multiple npm packages
                        redirected crypto deposits to attacker-owned addresses
                        across several chains. This dashboard aggregates the
                        proceeds and surfaces a transparent breakdown by chain
                        and transaction.
                    </p>
                    <div className="flex items-center justify-center gap-4">
                        <Link
                            href="/stolen"
                            className="px-6 py-3 rounded-full glass soft-shadow text-base font-semibold"
                        >
                            View Stolen Funds
                        </Link>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-3xl">
                <div className="rounded-2xl glass soft-shadow p-8 sm:p-10 space-y-5">
                    <h2 className="text-2xl font-semibold tracking-tight text-center">
                        Incident breakdown
                    </h2>
                    <p className="text-base/7 opacity-80 text-center">
                        A recent supply chain attack compromised a reputable
                        developer&rsquo;s NPM account, injecting malicious code
                        into widely used JavaScript packages, affecting over 1
                        billion downloads.
                    </p>
                    <div className="space-y-3 text-base/7 opacity-90">
                        <p>
                            The malware targets cryptocurrency wallets,
                            potentially swapping wallet addresses during
                            transactions to steal funds. Ledger&rsquo;s CTO,
                            Charles Guillemet, advised users to verify
                            transactions carefully and avoid on-chain
                            transactions with software wallets until resolved.
                        </p>
                        <p>
                            The malicious packages have been disabled, and
                            developers are urged to audit dependencies to
                            prevent further impact.
                        </p>
                    </div>
                </div>
            </section>

            <section className="space-y-7 mx-auto max-w-5xl">
                <div className="text-center space-y-3">
                    <h2 className="text-xl font-semibold">
                        Coverage and analysis
                    </h2>
                    <p className="text-base opacity-70">
                        Curated articles and threads tracking the investigation.
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pb-10">
                    <a
                        href="https://news.ycombinator.com/item?id=45169657&trk=public_post_comment-text"
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-xl glass soft-shadow p-5 hover:bg-white/10 transition"
                    >
                        <div className="text-base font-semibold">
                            Hacker News thread
                        </div>
                        <div className="text-sm opacity-80">
                            Read the DEVs perspective and see where it started.
                        </div>
                        <div className="text-sm opacity-70 mt-3">Read →</div>
                    </a>
                    <a
                        href="https://npmdiff.dev/simple-swizzle/0.2.2/0.2.3/package/index.js/"
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-xl glass soft-shadow p-5 hover:bg-white/10 transition"
                    >
                        <div className="text-base font-semibold">
                            See the actual package diff.
                        </div>
                        <div className="text-sm opacity-80">
                            For all the DEVs out there, see the actual package
                            diff.
                        </div>
                        <div className="text-sm opacity-70 mt-3">Read →</div>
                    </a>
                    <a
                        href="https://www.aikido.dev/blog/npm-debug-and-chalk-packages-compromised"
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-xl glass soft-shadow p-5 hover:bg-white/10 transition"
                    >
                        <div className="text-base font-semibold">Aikido</div>
                        <div className="text-sm opacity-80">
                            Good coverage of the incident. Recommend a read.
                        </div>
                        <div className="text-sm opacity-70 mt-3">Read →</div>
                    </a>
                    <a
                        href="https://www.securityalliance.org/news/2025-09-npm-supply-chain"
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-xl glass soft-shadow p-5 hover:bg-white/10 transition"
                    >
                        <div className="text-base font-semibold">
                            Security Alliance
                        </div>
                        <div className="text-sm opacity-80">
                            More good coverage of the incident.
                        </div>
                        <div className="text-sm opacity-70 mt-3">Read →</div>
                    </a>
                </div>
            </section>
        </div>
    );
}
