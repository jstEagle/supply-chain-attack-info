import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import Providers from "@/components/providers";
import GitHubDropdown from "@/components/GitHubDropdown";
import { MALWARE_GIST_URL, SITE_REPO_URL } from "@/lib/links";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Supply Chain Attack Tracker",
    description:
        "Track proceeds from the recent multi-chain address-replacement attack.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <Providers>
                    <header className="sticky top-0 z-50 bg-transparent">
                        <div className="mx-auto max-w-6xl px-4 py-3">
                            <div className="glass soft-shadow rounded-full px-4 py-2 border border-white/10">
                                <nav className="flex items-center justify-between">
                                    <Link
                                        href="/"
                                        className="text-xl sm:text-2xl font-semibold tracking-tight text-white"
                                    >
                                        Attack Tracker
                                    </Link>
                                    <div className="flex items-center gap-2 text-lg">
                                        <Link
                                            href="/stolen"
                                            className="px-3 py-1.5 rounded-full opacity-90 hover:opacity-100 hover:bg-white/10 transition"
                                        >
                                            Stolen
                                        </Link>
                                        <GitHubDropdown
                                            repoUrl={SITE_REPO_URL}
                                            gistUrl={MALWARE_GIST_URL}
                                        />
                                    </div>
                                </nav>
                            </div>
                        </div>
                    </header>
                    <main className="mx-auto max-w-6xl px-4 py-10">
                        {children}
                    </main>
                    <footer className="mt-10 mb-6">
                        <div className="mx-auto max-w-6xl px-4">
                            <div className="glass soft-shadow rounded-xl px-4 py-3 text-sm flex items-center justify-between">
                                <span className="opacity-80">
                                    Built by jstEagle
                                </span>
                                <div className="flex items-center gap-3">
                                    <a
                                        className="hover:underline"
                                        target="_blank"
                                        rel="noreferrer"
                                        href="https://jsteagle.dev"
                                    >
                                        Website
                                    </a>
                                    <a
                                        className="hover:underline"
                                        target="_blank"
                                        rel="noreferrer"
                                        href="https://x.com/jst_eagle"
                                    >
                                        Twitter
                                    </a>
                                </div>
                            </div>
                        </div>
                    </footer>
                </Providers>
            </body>
        </html>
    );
}
