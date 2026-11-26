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

export interface RunPlainWorkerMessage {
  type: "run_plain";
  id?: string;
  code: string;
  stdin?: string;
}

export type WorkerResponse =
  | { type: "ready" }
  | { type: "result"; data: RunResult }
  | { type: "plain_result"; id?: string; data: { output?: string; fatal?: string } }
  | { type: "error"; message: string };

export { usePyodide } from "./usePyodide";
