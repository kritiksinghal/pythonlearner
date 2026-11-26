/*
 * components/RunnableCodeBlock.tsx
 *
 * Mini interactive Python editor for lesson code examples.
 * Disciplined hairline design, dark action button with yellow accent mark,
 * and clean terminal output box.
 */

"use client";

import { useState } from "react";
import CodeEditor from "./CodeEditor";
import { resetPyodideWorker, runPlainPython } from "@/lib/pyodideRunner";

interface Props {
  initialCode: string;
  title?: string;
}

export default function RunnableCodeBlock({ initialCode, title = "Interactive Example" }: Props) {
  const [code, setCode] = useState(initialCode.trim());
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showRetry, setShowRetry] = useState(false);

  const handleRun = async () => {
    setIsRunning(true);
    setOutput(null);
    setError(null);
    setShowRetry(false);

    const res = await runPlainPython(code);
    setIsRunning(false);

    if (res.fatal) {
      setError(res.fatal);
      setShowRetry(/could not load|failed to load|taking too long to load/i.test(res.fatal));
    } else {
      setOutput(res.output ?? "(No output)");
    }
  };

  const handleRetry = () => {
    resetPyodideWorker();
    void handleRun();
  };

  return (
    <div className="my-6 overflow-hidden rounded-md border border-border bg-surface">
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

      {/* Action Bar */}
      <div className="flex items-center justify-between border-t border-border bg-code-bg/30 px-3.5 py-2">
        <button
          onClick={handleRun}
          disabled={isRunning}
          className="inline-flex items-center gap-2 rounded bg-foreground px-3.5 py-1.5 text-xs font-medium text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          <span>{isRunning ? "Running…" : "Run code"}</span>
        </button>

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
        </div>
      )}
    </div>
  );
}
