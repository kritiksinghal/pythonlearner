"use client";

import type { ProblemSolution } from "@/lib/problems";

export default function SolutionDisclosure({ solution }: { solution: ProblemSolution }) {
  return (
    <details
      className="group mt-5 rounded-md border border-border bg-surface p-3.5"
    >
      <summary className="flex cursor-pointer select-none items-center justify-between text-xs font-medium text-foreground sm:text-sm">
        <span className="flex items-center gap-2">
          <span className="rounded bg-accent/20 px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider">Solution</span>
          <span>Try it yourself first</span>
        </span>
        <span className="text-xs text-muted transition-transform group-open:rotate-180">▼</span>
      </summary>
      <div className="mt-3 border-t border-border pt-3">
        <pre className="overflow-x-auto rounded border border-border bg-code-bg p-3 font-mono text-xs leading-relaxed text-foreground">
          <code>{solution.code}</code>
        </pre>
        <p className="mt-3 text-sm leading-relaxed text-foreground">{solution.explanation}</p>
      </div>
    </details>
  );
}
