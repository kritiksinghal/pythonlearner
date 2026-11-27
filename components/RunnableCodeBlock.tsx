/*
 * components/RunnableCodeBlock.tsx
 *
 * Mini interactive Python editor for lesson code examples.
 * Disciplined hairline design, dark action button with yellow accent mark,
 * and clean terminal output box.
 */

"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import CodeEditor from "./CodeEditor";
import { resetPyodideWorker, runPlainPython } from "@/lib/pyodideRunner";

interface Props {
  initialCode: string;
  expectedOutput?: string;
  initialStdin?: string;
  showInput?: boolean;
  title?: string;
}

function normalizePrintedOutput(value: string) {
  return value
    .split(/\r?\n/)
    .map((line) => line.replace(/[ \t]+$/, ""))
    .join("\n")
    .replace(/(?:\n[ \t]*)+$/, "");
}

export default function RunnableCodeBlock({ initialCode, expectedOutput, initialStdin = "", showInput = false, title = "Interactive Example" }: Props) {
  const [code, setCode] = useState(initialCode.trim());
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showRetry, setShowRetry] = useState(false);
  const [checkFeedback, setCheckFeedback] = useState<string | null>(null);
  const [stdin, setStdin] = useState(initialStdin);
  const needsInput = /\binput\s*\(|\bsys\s*\.\s*stdin\b/.test(code);
  const inputId = useId();
  const blockRef = useRef<HTMLDivElement>(null);

  const handleRun = useCallback(async () => {
    setIsRunning(true);
    setOutput(null);
    setError(null);
    setShowRetry(false);
    setCheckFeedback(null);

    const res = await runPlainPython(code, stdin);
    setIsRunning(false);

    if (res.fatal) {
      setError(res.fatal);
      setShowRetry(/could not load|failed to load|taking too long to load/i.test(res.fatal));
    } else {
      setOutput(res.output ?? "(No output)");
    }
    return res;
  }, [code, stdin]);

  const handleCheck = useCallback(async () => {
    if (expectedOutput === undefined) return;
    const res = await handleRun();
    if (res.fatal) return;
    const actual = res.output ?? "";
    if (actual === "(No output printed)" || !actual.trim()) {
      setCheckFeedback("Your code printed nothing. Use print() to show your result.");
      return;
    }
    const expectedNormalized = normalizePrintedOutput(expectedOutput);
    const actualNormalized = normalizePrintedOutput(actual);
    if (expectedNormalized === actualNormalized) {
      setCheckFeedback("✓ Correct! Your output matches.");
      return;
    }
    const expectedLines = expectedNormalized.split("\n");
    const actualLines = actualNormalized.split("\n");
    let firstDifference = 0;
    while (
      firstDifference < Math.min(expectedLines.length, actualLines.length) &&
      expectedLines[firstDifference] === actualLines[firstDifference]
    ) {
      firstDifference += 1;
    }
    setCheckFeedback(`Not yet. First difference: line ${firstDifference + 1}.`);
  }, [expectedOutput, handleRun]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
        if (!blockRef.current?.contains(document.activeElement)) return;
        event.preventDefault();
        void handleRun();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleRun]);

  const handleRetry = () => {
    resetPyodideWorker();
    void handleRun();
  };

  return (
    <div ref={blockRef} className="my-6 overflow-hidden rounded-md border border-border bg-surface">
      {/* Block Header */}
      <div className="flex items-center justify-between border-b border-border bg-code-bg/40 px-3.5 py-1.5 text-xs font-mono">
        <span className="flex items-center gap-1.5 text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          <span>{title}</span>
        </span>
        <span className="text-[10px] text-muted">editable</span>
      </div>

      {/* Mini Code Editor */}
      <div className="p-1.5">
        <CodeEditor code={code} onChange={setCode} height="140px" />
      </div>

      {(needsInput || showInput) && (
        <div className="border-t border-border px-3.5 py-3">
          <label htmlFor={inputId} className="mb-1.5 block text-[10px] font-mono uppercase tracking-wider text-muted">
            Input: one line for each input() call
          </label>
          <textarea
            id={inputId}
            value={stdin}
            onChange={(event) => setStdin(event.target.value)}
            placeholder={'Asha\n42'}
            rows={2}
            className="w-full resize-y rounded border border-border bg-surface p-2 font-mono text-xs text-foreground placeholder:text-muted/70 focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>
      )}

      {/* Action Bar */}
      <div className="flex flex-wrap items-center gap-2 border-t border-border bg-code-bg/30 px-3.5 py-2">
        <button
          onClick={() => void handleRun()}
          disabled={isRunning}
          className="inline-flex items-center gap-2 rounded bg-foreground px-3.5 py-1.5 text-xs font-medium text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          <span>{isRunning ? "Running…" : "Run code"}</span>
        </button>
        {expectedOutput !== undefined && (
          <button
            type="button"
            onClick={() => void handleCheck()}
            disabled={isRunning}
            className="rounded border border-border bg-surface px-3.5 py-1.5 text-xs font-medium text-foreground hover:border-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            Check my answer
          </button>
        )}

        {isRunning && (
          <span className="text-xs font-mono text-muted">Executing…</span>
        )}
      </div>

      {/* Output Panel (only shown after running) */}
      {(output !== null || error !== null) && (
        <div className="border-t border-border bg-code-bg/40 p-3">
          <div className="mb-1 text-[10px] font-mono uppercase tracking-wider text-muted">
            Terminal Output
          </div>
          {checkFeedback && (
            <p className="mb-2 text-xs font-medium text-foreground" role="status">{checkFeedback}</p>
          )}
          {error ? (
            <div className="space-y-3">
              <pre className="rounded border border-red-300 bg-red-50 p-2 font-mono text-xs text-red-700 whitespace-pre-wrap dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300" role="alert">
                ⚠️ {error}
              </pre>
              {showRetry && (
                <button
                  type="button"
                  onClick={handleRetry}
                  className="rounded-md bg-foreground px-4 py-2 text-xs font-medium text-background hover:opacity-90"
                >
                  Retry Python
                </button>
              )}
            </div>
          ) : (
            <pre className="rounded border border-border bg-surface p-2 font-mono text-xs text-foreground whitespace-pre-wrap">
              {output}
            </pre>
          )}
          {checkFeedback?.startsWith("Not yet.") && expectedOutput !== undefined && (
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <div>
                <div className="mb-1 text-[10px] font-mono uppercase tracking-wider text-muted">Expected</div>
                <pre className="rounded border border-border bg-surface p-2 font-mono text-xs whitespace-pre-wrap">{expectedOutput || "(empty output)"}</pre>
              </div>
              <div>
                <div className="mb-1 text-[10px] font-mono uppercase tracking-wider text-muted">Your output</div>
                <pre className="rounded border border-border bg-surface p-2 font-mono text-xs whitespace-pre-wrap">{output || "(empty output)"}</pre>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
