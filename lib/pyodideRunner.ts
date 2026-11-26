/*
 * lib/pyodideRunner.ts
 *
 * Shared runner for executing plain Python code blocks in lessons.
 * Manages a background Pyodide Web Worker with a 5-second timeout.
 * If code exceeds 5 seconds, terminates the worker and spawns a fresh one.
 */

let worker: Worker | null = null;
let isReady = false;
const readyCallbacks: (() => void)[] = [];

interface ActiveJob {
  id: string;
  callback: (res: { output?: string; fatal?: string }) => void;
  timeoutId: ReturnType<typeof setTimeout>;
}

let activeJob: ActiveJob | null = null;

function getWorker(): Worker {
  if (typeof window === "undefined") {
    throw new Error("Pyodide runs only in the browser.");
  }

  if (!worker) {
    worker = new Worker("/pyodideWorker.js");
    isReady = false;

    worker.onmessage = (e: MessageEvent) => {
      const msg = e.data;

      if (msg.type === "ready") {
        isReady = true;
        while (readyCallbacks.length > 0) {
          const cb = readyCallbacks.shift();
          cb?.();
        }
      } else if (msg.type === "plain_result" && activeJob) {
        if (msg.id === activeJob.id) {
          clearTimeout(activeJob.timeoutId);
          const cb = activeJob.callback;
          activeJob = null;
          cb(msg.data);
        }
      } else if (msg.type === "error" && activeJob) {
        clearTimeout(activeJob.timeoutId);
        const cb = activeJob.callback;
        activeJob = null;
        readyCallbacks.length = 0;
        worker?.terminate();
        worker = null;
        isReady = false;
        cb({ fatal: "Python could not load. Check your connection, then retry." });
      }
    };

    worker.onerror = () => {
      if (activeJob) {
        clearTimeout(activeJob.timeoutId);
        const cb = activeJob.callback;
        activeJob = null;
        readyCallbacks.length = 0;
        worker?.terminate();
        worker = null;
        isReady = false;
        cb({ fatal: "Python could not load. Check your connection, then retry." });
      }
    };
  }

  return worker;
}

/** Pre-initialize the worker so it is ready when the user visits /learn */
export function initPyodideWorker(): void {
  if (typeof window !== "undefined") {
    getWorker();
  }
}

/** Check if the worker is loaded */
export function isPyodideReady(): boolean {
  return isReady;
}

/**
 * Executes a Python script in the Web Worker.
 * Returns printed output or error message.
 * Enforces a strict 5-second timeout.
 */
export function runPlainPython(
  code: string,
  stdin = ""
): Promise<{ output?: string; fatal?: string }> {
  return new Promise((resolve) => {
    try {
      const currentWorker = getWorker();
      const id = Math.random().toString(36).substring(2, 9);
      const waitingForPython = !isReady;

      // 5-second timeout guard
      const timeoutId = setTimeout(() => {
        if (activeJob && activeJob.id === id) {
          if (worker) {
            worker.terminate();
            worker = null;
          }
          isReady = false;
          readyCallbacks.length = 0;
          activeJob = null;
          resolve({
            fatal: waitingForPython
              ? "Python is taking too long to load. Check your connection, then retry."
              : "Your code took too long. Check for an infinite loop, then retry.",
          });
        }
      }, 5000);

      activeJob = { id, callback: resolve, timeoutId };

      const send = () => {
        currentWorker.postMessage({ type: "run_plain", id, code, stdin });
      };

      if (isReady) {
        send();
      } else {
        readyCallbacks.push(send);
      }
    } catch (err: unknown) {
      resolve({
        fatal: "Execution failed: " + (err instanceof Error ? err.message : "Unknown error"),
      });
    }
  });
}

export function resetPyodideWorker(): void {
  worker?.terminate();
  worker = null;
  isReady = false;
  readyCallbacks.length = 0;
  if (activeJob) {
    clearTimeout(activeJob.timeoutId);
    const callback = activeJob.callback;
    activeJob = null;
    callback({ fatal: "Python worker restarted. Try running the code again." });
  }
}
