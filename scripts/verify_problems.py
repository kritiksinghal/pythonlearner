#!/usr/bin/env python3
"""Validate problem definitions and run public solutions with Python 3.12."""
import copy
import glob
import io
import json
import os
import re
import shutil
import subprocess
import sys


def python312():
    configured = os.environ.get("LESSON_PYTHON", "python3.12")
    executable = shutil.which(configured)
    if executable is None and os.path.isfile(configured) and os.access(configured, os.X_OK):
        executable = configured
    if executable is None:
        print(f"ERROR: Python 3.12 interpreter not found: {configured}")
        sys.exit(2)
    version = subprocess.run([executable, "--version"], capture_output=True, text=True, timeout=5)
    version_text = (version.stdout or version.stderr).strip()
    if version.returncode or not re.fullmatch(r"Python 3\.12\.\d+", version_text):
        print(f"ERROR: verifier requires Python 3.12.x; found {version_text or 'unknown'}")
        sys.exit(2)
    print(f"Using problem interpreter: {version_text} ({executable})")
    return executable


def run_code(code, problem, test):
    namespace = {}
    if problem["testType"] == "function":
        try:
            exec(compile(code, "<problem_solution>", "exec"), namespace)
            fn = namespace.get(problem.get("functionName", ""))
            if not callable(fn):
                return False, "missing function"
            actual = fn(*copy.deepcopy(test["args"]))
            return actual == test["expected"], repr(actual)
        except BaseException as error:
            return False, f"{type(error).__name__}: {error}"

    old_in, old_out = sys.stdin, sys.stdout
    raw = test.get("input", "")
    sys.stdin = io.StringIO(raw + ("\n" if not raw.endswith("\n") else ""))
    sys.stdout = io.StringIO()
    try:
        exec(compile(code, "<problem_solution>", "exec"), {})
        actual = sys.stdout.getvalue().rstrip()
        expected = test.get("expectedOutput", "").rstrip()
        return actual == expected, actual
    except BaseException as error:
        return False, f"{type(error).__name__}: {error}"
    finally:
        sys.stdin, sys.stdout = old_in, old_out


def main():
    interpreter = python312()
    files = sorted(glob.glob("content/problems/*.json"))
    failures = 0
    checks = 0
    advanced = 0
    for path in files:
        slug = os.path.basename(path)[:-5]
        try:
            with open(path, encoding="utf-8") as source:
                problem = json.load(source)
        except Exception as error:
            failures += 1
            print(f"[FAIL] {slug}: invalid JSON: {error}")
            continue

        for field in ("slug", "title", "track", "difficulty", "testType", "description", "starterCode", "tests", "solution"):
            if field not in problem:
                failures += 1
                print(f"[FAIL] {slug}: missing {field}")
        solution = problem.get("solution")
        if not isinstance(solution, dict) or not isinstance(solution.get("code"), str) or not solution.get("code", "").strip():
            failures += 1
            print(f"[FAIL] {slug}: solution.code is missing")
            continue
        if not isinstance(solution.get("explanation"), str) or not solution["explanation"].strip():
            failures += 1
            print(f"[FAIL] {slug}: solution.explanation is missing")
        else:
            sentence_count = len(re.findall(r"[.!?](?:\s|$)", solution["explanation"].strip()))
            if not 3 <= sentence_count <= 5:
                failures += 1
                print(f"[FAIL] {slug}: Solution explanation must have 3-5 plain sentences (found {sentence_count})")

        tests = problem.get("tests", [])
        if not isinstance(tests, list) or not tests:
            failures += 1
            print(f"[FAIL] {slug}: tests must be a non-empty list")
            continue
        if problem.get("difficulty") == "Advanced":
            advanced += 1
            if not 12 <= len(tests) <= 15:
                failures += 1
                print(f"[FAIL] {slug}: Advanced problem needs 12-15 tests (found {len(tests)})")
            if not problem.get("relatedLessons"):
                failures += 1
                print(f"[FAIL] {slug}: Advanced problem needs relatedLessons")
            wrong_solutions = problem.get("wrongSolutions", [])
            if not 2 <= len(wrong_solutions) <= 3:
                failures += 1
                print(f"[FAIL] {slug}: Advanced problem needs 2-3 wrongSolutions (found {len(wrong_solutions)})")
            missing_hints = [index + 1 for index, test in enumerate(tests) if not isinstance(test.get("hint"), str) or not test["hint"].strip()]
            if missing_hints:
                failures += 1
                print(f"[FAIL] {slug}: tests need a hint; missing on #{missing_hints}")

        if problem.get("difficulty") not in {"Easy", "Medium", "Hard", "Advanced"}:
            failures += 1
            print(f"[FAIL] {slug}: unsupported difficulty {problem.get('difficulty')!r}")
        if problem.get("testType") not in {"function", "stdio"}:
            failures += 1
            print(f"[FAIL] {slug}: unsupported testType {problem.get('testType')!r}")
            continue

        solution_failed = False
        for index, test in enumerate(tests, start=1):
            checks += 1
            passed, actual = run_code(solution["code"], problem, test)
            if not passed:
                solution_failed = True
                failures += 1
                print(f"[FAIL] {slug}: solution failed test {index}; got {actual}")
        if not solution_failed:
            print(f"[PASS] {slug}: solution passes all {len(tests)} tests")

        for wrong_index, wrong in enumerate(problem.get("wrongSolutions", []), start=1):
            wrong_passes_all = True
            for test in tests:
                checks += 1
                passed, _ = run_code(wrong, problem, test)
                if not passed:
                    wrong_passes_all = False
                    break
            if wrong_passes_all:
                failures += 1
                print(f"[FAIL] {slug}: wrongSolutions[{wrong_index}] passes every test")
            else:
                print(f"[PASS] {slug}: wrongSolutions[{wrong_index}] is caught by a test")

    if advanced != 15:
        failures += 1
        print(f"[FAIL] Expected exactly 15 Advanced problems; found {advanced}")
    print(f"\nProblem checks: {checks} executed, {len(files)} problem files, {advanced} Advanced; {failures} failures.")
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
