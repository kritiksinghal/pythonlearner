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
export type PlainRunResult = { output?: string; fatal?: string } | null;

/** What our hook exposes to the page */
export interface PyodideHook {
  isLoading: boolean;
  isRunning: boolean;
  isPlainRunning: boolean;
  loadError: string | null;
  retry: () => void;
  runTests: (
    code: string,
    testType: "function" | "stdio",
    functionName: string,
    testsJson: string
  ) => void;
  results: RunResult | null;
  plainResult: PlainRunResult;
  runPlain: (code: string, stdin: string) => void;
}

const TIMEOUT_MS = 5000; // 5-second limit per run

export function usePyodide(): PyodideHook {
  const workerRef = useRef<Worker | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loadTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [isPlainRunning, setIsPlainRunning] = useState(false);
  const [results, setResults] = useState<RunResult | null>(null);
  const [plainResult, setPlainResult] = useState<PlainRunResult>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Create (or re-create) the worker
  const spawnWorker = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.terminate();
    }

    const worker = new Worker("/pyodideWorker.js");
    workerRef.current = worker;
    setIsLoading(true);
    setLoadError(null);
    if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current);
    loadTimeoutRef.current = setTimeout(() => {
      worker.terminate();
      if (workerRef.current === worker) workerRef.current = null;
      setIsLoading(false);
      setLoadError("Python is taking too long to load. Check your connection, then retry.");
      setResults({ fatal: "Python is taking too long to load. Check your connection, then retry." });
    }, 15000);

    worker.onmessage = (e: MessageEvent) => {
      const msg = e.data;

      if (msg.type === "ready") {
        if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current);
        setIsLoading(false);
      }

      if (msg.type === "result") {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setResults(msg.data);
        setIsRunning(false);
      }

      if (msg.type === "plain_result") {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setPlainResult(msg.data);
        setIsPlainRunning(false);
      }

      if (msg.type === "error") {
        if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setResults({ fatal: msg.message });
        setIsRunning(false);
        setIsPlainRunning(false);
        setIsLoading(false);
        setLoadError("Python could not load. Check your connection, then retry.");
      }
    };

    worker.onerror = () => {
      if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setResults({
        fatal: "Python could not load. Check your connection, then retry.",
      });
      setIsRunning(false);
      setIsPlainRunning(false);
      setIsLoading(false);
      setLoadError("Python could not load. Check your connection, then retry.");
    };

    return worker;
  }, []);

  const retry = useCallback(() => {
    setResults(null);
    setIsRunning(false);
    setIsPlainRunning(false);
    setLoadError(null);
    spawnWorker();
  }, [spawnWorker]);

  // Spawn the worker on mount
  useEffect(() => {
    const startTimer = setTimeout(spawnWorker, 0);
    return () => {
      clearTimeout(startTimer);
      workerRef.current?.terminate();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current);
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

  const runPlain = useCallback((code: string, stdin: string) => {
    if (!workerRef.current || isLoading) return;

    setIsPlainRunning(true);
    setPlainResult(null);
    timeoutRef.current = setTimeout(() => {
      workerRef.current?.terminate();
      setPlainResult({ fatal: "Your code took too long. Check for an infinite loop." });
      setIsPlainRunning(false);
      spawnWorker();
    }, TIMEOUT_MS);

    workerRef.current.postMessage({ type: "run_plain", code, stdin });
  }, [isLoading, spawnWorker]);

  return { isLoading, isRunning, isPlainRunning, loadError, retry, runTests, results, runPlain, plainResult };
}
