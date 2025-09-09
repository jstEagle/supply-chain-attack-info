"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type GitHubDropdownProps = {
    repoUrl: string;
    gistUrl: string;
};

export default function GitHubDropdown({
    repoUrl,
    gistUrl,
}: GitHubDropdownProps) {
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const closeTimeoutRef = useRef<number | null>(null);

    function clearCloseTimeout() {
        if (closeTimeoutRef.current !== null) {
            window.clearTimeout(closeTimeoutRef.current);
            closeTimeoutRef.current = null;
        }
    }

    function scheduleClose() {
        clearCloseTimeout();
        closeTimeoutRef.current = window.setTimeout(() => {
            setOpen(false);
        }, 200);
    }

    useEffect(() => {
        function onClickOutside(event: MouseEvent) {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", onClickOutside);
        return () => document.removeEventListener("mousedown", onClickOutside);
    }, []);

    return (
        <div
            className="relative"
            ref={menuRef}
            onMouseEnter={() => {
                clearCloseTimeout();
                setOpen(true);
            }}
            onMouseLeave={() => {
                scheduleClose();
            }}
        >
            <button
                type="button"
                className="px-3 py-1.5 rounded-full opacity-80 hover:opacity-100 hover:bg-white/10 transition flex items-center gap-1"
                onClick={() => setOpen((v) => !v)}
                onFocus={() => setOpen(true)}
                onBlur={() => scheduleClose()}
                aria-haspopup="menu"
                aria-expanded={open}
            >
                <span>GitHub</span>
                <svg
                    className={`h-3 w-3 transition-transform ${
                        open ? "rotate-180" : "rotate-0"
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                >
                    <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 011.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" />
                </svg>
            </button>
            {open ? (
                <div
                    role="menu"
                    className="absolute right-0 mt-2 w-56 soft-shadow rounded-xl border border-white/20 overflow-hidden bg-slate-900/90 backdrop-blur-xl"
                    onMouseEnter={clearCloseTimeout}
                    onMouseLeave={scheduleClose}
                >
                    <div className="p-1">
                        <Link
                            href={repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition"
                            role="menuitem"
                            onClick={() => setOpen(false)}
                        >
                            <svg
                                viewBox="0 0 16 16"
                                aria-hidden="true"
                                className="h-4 w-4"
                                fill="currentColor"
                            >
                                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                            </svg>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium">
                                    View Site Repository
                                </span>
                                <span className="text-xs opacity-70">
                                    Open the codebase on GitHub
                                </span>
                            </div>
                        </Link>
                        <Link
                            href={gistUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition"
                            role="menuitem"
                            onClick={() => setOpen(false)}
                        >
                            <svg
                                viewBox="0 0 16 16"
                                aria-hidden="true"
                                className="h-4 w-4"
                                fill="currentColor"
                            >
                                <path d="M7.177 3.073a.75.75 0 01.646-.073l6 2.25a.75.75 0 010 1.4l-6 2.25a.75.75 0 01-.646-1.373L11.418 6 7.177 4.073a.75.75 0 01-.073-1zM2.5 2.75A.75.75 0 013.25 2h1.5a.75.75 0 010 1.5h-1.5A.75.75 0 012.5 2.75zm0 2.5A.75.75 0 013.25 4.5h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zm0 2.5A.75.75 0 013.25 7h1.5a.75.75 0 010 1.5h-1.5A.75.75 0 012.5 7.75zM2.5 10.25a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75z" />
                            </svg>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium">
                                    View Malware Gist
                                </span>
                                <span className="text-xs opacity-70">
                                    Open the sample in a gist
                                </span>
                            </div>
                        </Link>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
