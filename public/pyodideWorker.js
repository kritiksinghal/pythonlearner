/*
 * pyodideWorker.js — runs user Python code inside Pyodide on a Web Worker.
 *
 * Supports both:
 * 1. "function" testType (calls a function with arguments and checks return value)
 * 2. "stdio" testType (redirects sys.stdin / sys.stdout, checks printed output)
 *
 * Messages IN  → { type: "run", code, testType, functionName, testsJson }
 * Messages OUT → { type: "ready" }
 *                { type: "result", data }
 *                { type: "error", message }
 */

/* global importScripts, loadPyodide */

const PYODIDE_CDN_BASE = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/";

// Load Pyodide from the CDN
importScripts(PYODIDE_CDN_BASE + "pyodide.js");

// Python helper that supports both function calls and stdio mocking
const RUNNER_PY = `
import json, sys, io

def run_tests(code, test_type, func_name, tests_json):
    tests = json.loads(tests_json)

    # ── 1. Function testType ──
    if test_type == "function":
        ns = {}
        try:
            exec(code, ns)
        except SyntaxError as e:
            line_info = f" on line {e.lineno}" if e.lineno else ""
            return json.dumps({"fatal": f"SyntaxError{line_info}: {e.msg}"})
        except BaseException as e:
            return json.dumps({"fatal": f"{type(e).__name__}: {e}"})

        fn = ns.get(func_name)
        if not callable(fn):
            return json.dumps({"fatal": f"Your code must define a function named {func_name}."})

        results = []
        for t in tests:
            item = {
                "input": ", ".join(repr(a) for a in t["args"]),
                "expected": repr(t["expected"]),
            }
            try:
                out = fn(*t["args"])
                item["got"] = repr(out)
                item["ok"] = bool(out == t["expected"])
            except BaseException as e:
                item["ok"] = False
                item["error"] = f"{type(e).__name__}: {e}"
            results.append(item)
        return json.dumps(results)

    # ── 2. Stdio testType ──
    elif test_type == "stdio":
        try:
            compiled = compile(code, "<user_code>", "exec")
        except SyntaxError as e:
            line_info = f" on line {e.lineno}" if e.lineno else ""
            return json.dumps({"fatal": f"SyntaxError{line_info}: {e.msg}"})
        except BaseException as e:
            return json.dumps({"fatal": f"{type(e).__name__}: {e}"})

        results = []
        for t in tests:
            raw_input = t.get("input", "")
            expected_output = t.get("expectedOutput", "")
            item = {
                "input": raw_input,
                "expected": expected_output,
            }

            old_in, old_out = sys.stdin, sys.stdout
            sys.stdin = io.StringIO(raw_input + ("\\n" if not raw_input.endswith("\\n") else ""))
            sys.stdout = io.StringIO()
            ns = {}
            try:
                exec(compiled, ns)
                actual_output = sys.stdout.getvalue().rstrip()
                item["got"] = actual_output
                item["ok"] = (actual_output == expected_output.rstrip())
            except EOFError:
                item["ok"] = False
                item["error"] = "EOFError: Program called input() more times than provided input lines."
                item["got"] = sys.stdout.getvalue().rstrip()
            except BaseException as e:
                item["ok"] = False
                item["error"] = f"{type(e).__name__}: {e}"
                item["got"] = sys.stdout.getvalue().rstrip()
            finally:
                sys.stdin, sys.stdout = old_in, old_out

            results.append(item)
        return json.dumps(results)

    return json.dumps({"fatal": f"Unknown testType: {test_type}"})
`;

let pyodide = null;

async function init() {
  try {
    pyodide = await loadPyodide({
      indexURL: PYODIDE_CDN_BASE,
    });
    pyodide.runPython(RUNNER_PY);
    self.postMessage({ type: "ready" });
  } catch (err) {
    self.postMessage({
      type: "error",
      message: "Failed to load Python: " + (err ? err.message : "Unknown error"),
    });
  }
}

// Listen for execution messages
self.onmessage = async (e) => {
  if (e.data.type === "run") {
    const { code, testType, functionName, testsJson } = e.data;
    try {
      pyodide.globals.set("USER_CODE", code);
      pyodide.globals.set("TEST_TYPE", testType || "function");
      pyodide.globals.set("FUNC_NAME", functionName || "");
      pyodide.globals.set("TESTS_JSON", testsJson);
      const raw = pyodide.runPython(`run_tests(USER_CODE, TEST_TYPE, FUNC_NAME, TESTS_JSON)`);
      const data = JSON.parse(raw);
      self.postMessage({ type: "result", data });
    } catch (err) {
      self.postMessage({
        type: "error",
        message: err ? err.message : "Execution failed",
      });
    }
  }
};

// Begin loading
init();
