/*
 * components/TestResults.tsx — displays test results for both function and stdio tests.
 *
 * Disciplined hairline design with crisp pass/fail indicators.
 * Displays:
 * - "X of N tests passed" summary
 * - One row per test with pass/fail status
 * - For function tests: input signature, expected return value, actual returned value
 * - For stdio tests: input fed to input(), expected printed output, actual printed output
 * - Friendly error messages for syntax errors, missing functions, and timeouts
 */

"use client";

import type { RunResult, TestResult } from "@/lib/usePyodide";

interface Props {
  results: RunResult | null;
  totalTests: number;
  testType: "function" | "stdio";
  functionName?: string;
  hints?: string[];
}

export default function TestResults({
  results,
  totalTests,
  testType,
  functionName,
  hints = [],
}: Props) {
  // Before any test run
  if (!results) {
    return (
      <div className="rounded-md border border-border bg-surface p-4 text-xs font-mono text-muted">
        Press &ldquo;Run Tests&rdquo; to test your code against {totalTests} test cases.
      </div>
    );
  }

  // Fatal error (e.g. syntax error with line number, missing function, or timeout)
  if ("fatal" in results) {
    return (
      <div className="rounded-md border border-red-300 bg-red-50 p-4 text-xs dark:border-red-900/60 dark:bg-red-950/40">
        <p className="font-semibold text-red-700 dark:text-red-300 font-mono">
          ⚠️ {results.fatal}
        </p>
      </div>
    );
  }

  const testResults = results as TestResult[];
  const passedCount = testResults.filter((r) => r.ok).length;
  const allPassed = passedCount === testResults.length;

  return (
    <div className="space-y-3">
      {/* Summary heading */}
      <div
        className={`flex items-center justify-between rounded-md border p-3.5 text-xs font-mono font-medium ${
          allPassed
            ? "border-green-300 bg-green-50 text-green-900 dark:border-green-900 dark:bg-green-950/40 dark:text-green-200"
            : "border-border bg-surface text-foreground"
        }`}
      >
        <span className="font-semibold">
          {passedCount} of {testResults.length} tests passed
        </span>
        {allPassed && <span>All tests passed ✓</span>}
      </div>

      {/* List of individual test rows */}
      <div className="space-y-2">
        {testResults.map((r, i) => (
          <div
            key={i}
            className={`rounded-md border p-3 text-xs transition-colors ${
              r.ok
                ? "border-border bg-surface hover:border-muted/50"
                : "border-red-300 bg-red-50/50 dark:border-red-900/50 dark:bg-red-950/20"
            }`}
          >
            {/* Header: Test number + pass/fail status + signature or badge */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center rounded px-1.5 py-0.2 font-mono text-[10px] font-bold ${
                    r.ok
                      ? "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300"
                      : "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
                  }`}
                >
                  {r.ok ? "PASS" : "FAIL"}
                </span>
                <span className="font-mono text-foreground">Test {i + 1}</span>
              </div>

              {testType === "function" && functionName && (
                <code className="rounded bg-code-bg px-1.5 py-0.5 font-mono text-[11px] text-muted">
                  {functionName}({r.input})
                </code>
              )}
              {testType === "stdio" && (
                <span className="rounded bg-code-bg px-1.5 py-0.5 font-mono text-[11px] text-muted">
                  stdio
                </span>
              )}
            </div>

              {!r.ok && hints[i] && (
                <p className="mt-2 text-xs leading-relaxed text-muted">
                  <span className="font-semibold text-foreground">Hint: </span>{hints[i]}
                </p>
              )}

            {/* Test details */}
            <div className="mt-2.5 space-y-2 font-mono text-xs">
              {/* Input for stdio tests */}
              {testType === "stdio" && (
                <div>
                  <span className="text-muted block text-[10px] uppercase tracking-wider mb-0.5">
                    Input:
                  </span>
                  <pre className="rounded border border-border bg-code-bg/70 p-2 whitespace-pre-wrap leading-relaxed text-foreground">
                    {r.input ? r.input : "(empty input)"}
                  </pre>
                </div>
              )}

              {/* Expected vs Actual */}
              <div className="grid gap-2 sm:grid-cols-2">
                <div>
                  <span className="text-muted block text-[10px] uppercase tracking-wider mb-0.5">
                    Expected:
                  </span>
                  <pre className="rounded border border-border bg-code-bg/70 p-2 whitespace-pre-wrap leading-relaxed text-foreground">
                    {r.expected}
                  </pre>
                </div>

                <div>
                  <span className="text-muted block text-[10px] uppercase tracking-wider mb-0.5">
                    Actual:
                  </span>
                  {r.error ? (
                    <pre className="rounded border border-red-300 bg-red-50 p-2 whitespace-pre-wrap leading-relaxed text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
                      {r.error}
                    </pre>
                  ) : (
                    <pre
                      className={`rounded border p-2 whitespace-pre-wrap leading-relaxed ${
                        r.ok
                          ? "border-border bg-code-bg/70 text-foreground"
                          : "border-red-300 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300 font-semibold"
                      }`}
                    >
                      {r.got !== undefined && r.got !== "" ? r.got : "(nothing printed)"}
                    </pre>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
