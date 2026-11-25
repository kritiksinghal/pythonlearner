"use client";

import Link from "next/link";

export default function Footer() {
  const year = 2026;
  return (
    <footer className="mt-auto border-t border-border bg-background py-8 text-center text-xs text-muted">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-4 sm:flex-row sm:px-6">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          <span>PyLearner — Free Python curriculum & browser test runner</span>
        </div>
        <div>
          <span>© {year} · Built for focused learning · </span>
          <Link href="/about" className="underline underline-offset-4 hover:text-foreground">About</Link>
        </div>
      </div>
    </footer>
  );
}
