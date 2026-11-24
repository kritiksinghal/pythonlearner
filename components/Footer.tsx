"use client";

import { useState, useEffect } from "react";

export default function Footer() {
  const [year, setYear] = useState(2026);
  useEffect(() => setYear(new Date().getFullYear()), []);

  return (
    <footer className="mt-auto border-t border-border bg-background py-8 text-center text-xs text-muted">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-4 sm:flex-row sm:px-6">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          <span>PyLearner — Free Python curriculum & browser test runner</span>
        </div>
        <div>
          <span>© {year} · Built for focused learning</span>
        </div>
      </div>
    </footer>
  );
}
