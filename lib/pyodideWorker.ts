/*
 * /lib/pyodideWorker.ts
 *
 * Types and helper functions for interacting with the Pyodide Web Worker.
 */

export interface TestResult {
  input: string;
  expected: string;
  got?: string;
  ok: boolean;
  error?: string;
}

export type RunResult = { fatal: string } | TestResult[];

export interface RunWorkerMessage {
  type: "run";
  code: string;
  testType: "function" | "stdio";
  functionName?: string;
  testsJson: string;
}

export type WorkerResponse =
  | { type: "ready" }
  | { type: "result"; data: RunResult }
  | { type: "error"; message: string };

export { usePyodide } from "./usePyodide";
