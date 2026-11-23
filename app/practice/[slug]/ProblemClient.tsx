/*
 * ProblemClient.tsx — interactive practice editor and test runner for a problem.
 *
 * Runs client-side Python in a Web Worker using Pyodide.
 * Works for both "function" and "stdio" test types.
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
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Navigation Breadcrumb */}
      <div className="mb-4 flex items-center gap-2 text-sm text-muted">
        <Link href="/practice" className="transition-colors hover:text-accent">
          ← Back to all problems
        </Link>
        <span>/</span>
        <span className="text-foreground">{problem.title}</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* ── Left Column: Problem details ── */}
        <section className="h-fit rounded-xl border border-border bg-surface p-6 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
            <h1 className="text-2xl font-bold tracking-tight">{problem.title}</h1>
            <div className="flex items-center gap-2">
              <span className="rounded bg-code-bg px-2.5 py-1 text-xs font-medium text-muted">
                {problem.track}
              </span>
              <span
                className={`rounded px-2 py-0.5 text-xs font-semibold ${
                  problem.difficulty === "Easy"
                    ? "bg-green-100 text-green-800 dark:bg-green-950/60 dark:text-green-300"
                    : problem.difficulty === "Medium"
                      ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                      : "bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300"
                }`}
              >
                {problem.difficulty}
              </span>
            </div>
          </div>

          {/* Render description formatted with Markdown */}
          <div className="mt-4">
            <MarkdownView content={problem.description} />
          </div>

          {/* Quick info footer */}
          <div className="mt-6 rounded-lg border border-border bg-code-bg p-3.5 text-xs text-muted">
            <span className="font-semibold text-foreground">Test mode: </span>
            {problem.testType === "function" ? (
              <span>
                Function call (<code>def {problem.functionName}()</code>)
              </span>
            ) : (
              <span>Standard I/O (reads with <code>input()</code>, prints with <code>print()</code>)</span>
            )}
          </div>
        </section>

        {/* ── Right Column: Code Editor + Run Button + Results ── */}
        <section className="flex flex-col gap-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">Your Code</h2>
            {isLoading && (
              <span className="flex items-center gap-1.5 text-xs text-muted">
                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-accent" />
                Loading Python…
              </span>
            )}
          </div>

          {/* Monaco Editor */}
          <CodeEditor code={code} onChange={setCode} />

          {/* Run button */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleRun}
              disabled={isLoading || isRunning}
              className="inline-flex items-center justify-center rounded-lg bg-accent px-6 py-2.5 font-medium text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading
                ? "Loading Python…"
                : isRunning
                  ? "Running tests…"
                  : "Run Tests"}
            </button>

            {isRunning && (
              <span className="text-xs text-muted">
                Executing tests against your solution…
              </span>
            )}
          </div>

          {/* Test results panel below */}
          <div className="border-t border-border pt-4">
            <h3 className="mb-3 text-base font-semibold tracking-tight">Results</h3>
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
