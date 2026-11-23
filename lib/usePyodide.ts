/*
 * usePyodide.ts — custom hook that manages a Pyodide Web Worker.
 *
 * Supports both:
 * - "function" testType
 * - "stdio" testType
 *
 * Enforces a 5-second execution timeout. If exceeded, terminates
 * the worker, shows a friendly message, and spawns a fresh worker.
 */

"use client";

import { useRef, useState, useCallback, useEffect } from "react";

/** The shape of a single test result coming back from the worker */
export interface TestResult {
  input: string;
  expected: string;
  got?: string;
  ok: boolean;
  error?: string;
}

/** What the worker sends back: either an array of results, or a fatal error */
export type RunResult = { fatal: string } | TestResult[];

/** What our hook exposes to the page */
export interface PyodideHook {
  isLoading: boolean;
  isRunning: boolean;
  runTests: (
    code: string,
    testType: "function" | "stdio",
    functionName: string,
    testsJson: string
  ) => void;
  results: RunResult | null;
}

const TIMEOUT_MS = 5000; // 5-second limit per run

export function usePyodide(): PyodideHook {
  const workerRef = useRef<Worker | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<RunResult | null>(null);

  // Create (or re-create) the worker
  const spawnWorker = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.terminate();
    }

    const worker = new Worker("/pyodideWorker.js");
    workerRef.current = worker;
    setIsLoading(true);

    worker.onmessage = (e: MessageEvent) => {
      const msg = e.data;

      if (msg.type === "ready") {
        setIsLoading(false);
      }

      if (msg.type === "result") {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setResults(msg.data);
        setIsRunning(false);
      }

      if (msg.type === "error") {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setResults({ fatal: msg.message });
        setIsRunning(false);
        setIsLoading(false);
      }
    };

    worker.onerror = (err) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setResults({
        fatal: "Worker error: " + (err.message || "Could not load Python worker."),
      });
      setIsRunning(false);
      setIsLoading(false);
    };

    return worker;
  }, []);

  // Spawn the worker on mount
  useEffect(() => {
    spawnWorker();
    return () => {
      workerRef.current?.terminate();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [spawnWorker]);

  // Send code to the worker to run tests
  const runTests = useCallback(
    (
      code: string,
      testType: "function" | "stdio",
      functionName: string,
      testsJson: string
    ) => {
      if (!workerRef.current || isLoading) return;

      setIsRunning(true);
      setResults(null);

      // Start the 5-second timeout
      timeoutRef.current = setTimeout(() => {
        workerRef.current?.terminate();
        setResults({
          fatal: "Your code took too long. Check for an infinite loop.",
        });
        setIsRunning(false);
        spawnWorker(); // respawn so the user can continue
      }, TIMEOUT_MS);

      workerRef.current.postMessage({
        type: "run",
        code,
        testType,
        functionName,
        testsJson,
      });
    },
    [isLoading, spawnWorker]
  );

  return { isLoading, isRunning, runTests, results };
}
