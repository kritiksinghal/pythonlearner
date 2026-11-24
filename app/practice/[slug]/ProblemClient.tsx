/*
 * ProblemClient.tsx — interactive practice editor and test runner for a problem.
 *
 * Restyled with hairline borders, disciplined typography,
 * dark action button with yellow accent mark, and zero heavy shadows.
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import CodeEditor from "@/components/CodeEditor";
import TestResults from "@/components/TestResults";
import MarkdownView from "@/components/MarkdownView";
import { usePyodide } from "@/lib/usePyodide";
import type { Problem } from "@/lib/problems";

interface Props {
  problem: Omit<Problem, "referenceSolution">;
}

export default function ProblemClient({ problem }: Props) {
  const [code, setCode] = useState(problem.starterCode);
  const { isLoading, isRunning, runTests, results } = usePyodide();

  // Trigger test runner in Web Worker
  const handleRun = () => {
    runTests(
      code,
      problem.testType,
      problem.functionName || "",
      JSON.stringify(problem.tests)
    );
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      {/* Navigation Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-xs font-mono text-muted">
        <Link href="/practice" className="transition-colors hover:text-foreground">
          ← ALL PROBLEMS
        </Link>
        <span>/</span>
        <span className="text-foreground">{problem.title.toUpperCase()}</span>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* ── Left Column: Problem details ── */}
        <section className="h-fit rounded-lg border border-border bg-surface p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
            <h1 className="font-doto text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              {problem.title}
            </h1>
            <div className="flex items-center gap-2">
              <span className="rounded border border-border bg-code-bg px-2 py-0.5 font-mono text-[11px] text-muted">
                {problem.track}
              </span>
              <span
                className={`rounded border px-2 py-0.5 font-mono text-[11px] font-semibold ${
                  problem.difficulty === "Easy"
                    ? "border-green-200 bg-green-50/80 text-green-800 dark:border-green-900 dark:bg-green-950/40 dark:text-green-300"
                    : problem.difficulty === "Medium"
                      ? "border-amber-200 bg-amber-50/80 text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300"
                      : "border-red-200 bg-red-50/80 text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
                }`}
              >
                {problem.difficulty}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="mt-5">
            <MarkdownView content={problem.description} />
          </div>

          {/* Test mode summary */}
          <div className="mt-8 rounded-md border border-border bg-code-bg/60 p-3 text-xs text-muted font-mono">
            <span className="font-semibold text-foreground">Target: </span>
            {problem.testType === "function" ? (
              <span>
                Function <code>{problem.functionName}()</code>
              </span>
            ) : (
              <span>Standard I/O (reads via <code>input()</code>, prints via <code>print()</code>)</span>
            )}
          </div>
        </section>

        {/* ── Right Column: Editor + Run Button + Results ── */}
        <section className="flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-muted">
              Editor
            </h2>
            {isLoading && (
              <span className="flex items-center gap-1.5 text-xs font-mono text-muted">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                Loading Python…
              </span>
            )}
          </div>

          {/* Monaco Editor */}
          <CodeEditor code={code} onChange={setCode} height="340px" />

          {/* Action Bar */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleRun}
              disabled={isLoading || isRunning}
              className="inline-flex items-center gap-2.5 rounded-md bg-foreground px-5 py-2 text-xs font-medium text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              <span>
                {isLoading
                  ? "Loading Python…"
                  : isRunning
                    ? "Running tests…"
                    : "Run Tests"}
              </span>
            </button>

            {isRunning && (
              <span className="text-xs font-mono text-muted">
                Testing against hidden cases…
              </span>
            )}
          </div>

          {/* Test results panel below */}
          <div className="border-t border-border pt-4">
            <h3 className="mb-3 text-xs font-mono font-semibold uppercase tracking-wider text-muted">
              Test Results
            </h3>
            <TestResults
              results={results}
              totalTests={problem.tests.length}
              testType={problem.testType}
              functionName={problem.functionName}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
