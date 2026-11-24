#!/usr/bin/env python3
"""
scripts/verify_lessons.py

Self-enforcing verification for PyLearner lessons per LESSON_STANDARD.md:
1. All 9 required ## sections exist, in the order given in LESSON_STANDARD.md.
2. The explanation has at least 1,500 words (not counting code blocks).
3. At least 8 runnable examples (```python run blocks).
4. quiz.json is valid JSON with 8-10 questions, 4 options each, and a correctIndex within range.
5. The curriculumTitle frontmatter value exists in CURRICULUM.md.
6. Every ```python run block outside the "Try it yourself" section is followed by an ```output block (print a WARN otherwise).
7. Running runnable examples with LESSON_PYTHON (default python3.12) produces output that matches the ```output block.
8. Running code blocks paired with error output reproduces the displayed final error line.

Exits with non-zero code on any FAIL.
"""

import sys
import glob
import os
import re
import json
import shutil
import subprocess

REQUIRED_SECTIONS = [
    "What you will learn",
    "Why this matters",
    "The big idea",
    "Step by step",
    "What Python is doing behind the scenes",
    "Common mistakes",
    "Cheat sheet",
    "Try it yourself",
    "Recap",
]

PROJECT_SECTIONS = [
    "The goal",
    "What you will practice",
    "Plan",
    "Build it step by step",
    "The complete program",
    "Make it yourself",
]

def load_curriculum_titles():
    curriculum_path = "content/CURRICULUM.md"
    if not os.path.exists(curriculum_path):
        return set()

    titles = set()
    with open(curriculum_path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            if line.startswith("Track:"):
                # Track lines might contain lessons e.g. CS50P (...): A; B; C
                paren_idx = line.find("(")
                after_paren = line[paren_idx:] if paren_idx != -1 else line
                colon_idx = after_paren.find(":")
                if colon_idx != -1:
                    parts = after_paren[colon_idx + 1:].split(";")
                    for p in parts:
                        t = p.strip()
                        if t:
                            titles.add(t)
            elif line.startswith("M") and ":" in line:
                # Module lines e.g. M1 Getting started: A; B; C
                colon_idx = line.find(":")
                parts = line[colon_idx + 1:].split(";")
                for p in parts:
                    t = p.strip()
                    if t:
                        titles.add(t)
    return titles

def parse_frontmatter(content):
    match = re.match(r"^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n([\s\S]*))?$", content)
    if not match:
        return {}, content
    yaml_text = match.group(1)
    body = match.group(2) or ""
    data = {}
    for line in yaml_text.splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        if ":" in line:
            k, v = line.split(":", 1)
            k = k.strip()
            v = v.strip().strip("\"'")
            data[k] = v
    return data, body

def count_words(text_without_code):
    # Strip HTML-like tags, markdown symbols, and count clean words
    cleaned = re.sub(r"<[^>]+>", " ", text_without_code)
    cleaned = re.sub(r":::[a-zA-Z]+[^\n]*", " ", cleaned)
    cleaned = re.sub(r":::", " ", cleaned)
    words = [w for w in cleaned.split() if w and not w.startswith("#")]
    return len(words)

def resolve_lesson_interpreter():
    configured = os.environ.get("LESSON_PYTHON", "python3.12")
    executable = shutil.which(configured)
    if executable is None and os.path.isfile(configured) and os.access(configured, os.X_OK):
        executable = configured

    if executable is None:
        print(
            f"ERROR: LESSON_PYTHON='{configured}' was not found or is not executable. "
            "Install Python 3.12 or set LESSON_PYTHON to its executable path."
        )
        sys.exit(2)

    try:
        version_result = subprocess.run(
            [executable, "--version"],
            capture_output=True,
            text=True,
            timeout=5,
        )
    except (OSError, subprocess.TimeoutExpired) as error:
        print(f"ERROR: Could not run LESSON_PYTHON='{configured}': {error}")
        sys.exit(2)

    version_text = (version_result.stdout or version_result.stderr).strip()
    if version_result.returncode != 0 or not re.fullmatch(r"Python 3\.12\.\d+", version_text):
        print(
            f"ERROR: LESSON_PYTHON='{configured}' must be Python 3.12.x; "
            f"reported version: {version_text or 'unknown'}."
        )
        sys.exit(2)

    print(f"Using lesson interpreter: {version_text} ({executable})")
    return executable


def verify_error_examples(raw_content, lesson_slug, interpreter):
    pattern = re.compile(
        r"```python(?: run)?[^\r\n]*\r?\n([\s\S]*?)\r?\n```"
        r"(?:(?!```)[\s\S])*?```output[^\r\n]*\r?\n([\s\S]*?)\r?\n```"
    )
    error_line_pattern = re.compile(r"^[A-Za-z_][A-Za-z0-9_.]*(?:Error|Exception): .+$")
    checks = 0
    failures = 0

    for match in pattern.finditer(raw_content):
        code, expected_output = match.groups()
        expected_lines = expected_output.rstrip().splitlines()
        if not expected_lines or not error_line_pattern.fullmatch(expected_lines[-1].strip()):
            continue

        checks += 1
        expected_error = expected_lines[-1].strip()
        line_number = raw_content.count("\n", 0, match.start(1)) + 1
        try:
            proc = subprocess.run(
                [interpreter, "-c", code],
                capture_output=True,
                text=True,
                timeout=5,
            )
            stderr_lines = proc.stderr.rstrip().splitlines()
            actual_error = stderr_lines[-1].strip() if stderr_lines else ""
            if proc.returncode != 0 and actual_error == expected_error:
                print(f"[PASS] {lesson_slug} (line {line_number}): Error message matches")
            else:
                failures += 1
                print(
                    f"[FAIL] {lesson_slug} (line {line_number}): Error message mismatch\n"
                    f"  Expected: {expected_error!r}\n"
                    f"  Actual: {actual_error!r} (exit {proc.returncode})"
                )
        except subprocess.TimeoutExpired:
            failures += 1
            print(f"[FAIL] {lesson_slug} (line {line_number}): Error example timed out after 5s")
        except OSError as error:
            failures += 1
            print(f"[FAIL] {lesson_slug} (line {line_number}): Could not run error example: {error}")

    return checks, failures


def verify_lessons(interpreter):
    lesson_files = sorted(glob.glob("content/lessons/*/lesson.md"))
    if not lesson_files:
        print("No lesson files found in content/lessons/")
        sys.exit(1)

    curriculum_titles = load_curriculum_titles()

    total_failures = 0
    total_warnings = 0
    total_passes = 0
    total_error_checks = 0

    print(f"Verifying {len(lesson_files)} lesson(s) against LESSON_STANDARD.md...")
    print("=" * 70)

    for file_path in lesson_files:
        lesson_dir = os.path.dirname(file_path)
        lesson_slug = os.path.basename(lesson_dir)
        print(f"\n--- Checking lesson: {lesson_slug} ---")

        with open(file_path, "r", encoding="utf-8") as f:
            raw_content = f.read()

        frontmatter, body = parse_frontmatter(raw_content)
        is_project = frontmatter.get("type") == "project"

        # ── 1. Frontmatter curriculumTitle Check ──
        c_title = frontmatter.get("curriculumTitle")
        if not c_title:
            total_failures += 1
            print(f"[FAIL] {lesson_slug}: Missing 'curriculumTitle' in frontmatter")
        elif c_title not in curriculum_titles:
            total_failures += 1
            print(f"[FAIL] {lesson_slug}: curriculumTitle '{c_title}' not found in CURRICULUM.md")
        else:
            total_passes += 1
            print(f"[PASS] {lesson_slug}: curriculumTitle '{c_title}' matches CURRICULUM.md")

        # ── 2. Word Count Check (>= 1500 words for normal, >= 1000 for project, not counting code) ──
        body_no_code = re.sub(r"```[\s\S]*?```", "", body)
        word_count = count_words(body_no_code)
        min_words = 1000 if is_project else 1500
        if word_count < min_words:
            total_failures += 1
            print(f"[FAIL] {lesson_slug}: Word count is {word_count} (minimum required: {min_words})")
        else:
            total_passes += 1
            print(f"[PASS] {lesson_slug}: Word count is {word_count} (>= {min_words})")

        # ── 3. Required Sections Check (in order) ──
        # Extract ## headings outside code blocks
        lines = body_no_code.splitlines()
        found_headings = []
        for line in lines:
            trimmed = line.strip()
            if trimmed.startswith("## ") and not trimmed.startswith("### "):
                found_headings.append(trimmed[3:].strip())

        # Check for presence and order of required sections
        expected_sections = PROJECT_SECTIONS if is_project else REQUIRED_SECTIONS
        found_indices = []
        missing_sections = []

        for req in expected_sections:
            req_l = req.lower()
            matched_idx = -1
            for idx, h in enumerate(found_headings):
                if h.lower() == req_l or h.lower().startswith(req_l):
                    matched_idx = idx
                    break
            if matched_idx == -1:
                missing_sections.append(req)
            else:
                found_indices.append(matched_idx)

        if missing_sections:
            total_failures += 1
            print(f"[FAIL] {lesson_slug}: Missing required sections: {missing_sections}")
        elif found_indices != sorted(found_indices):
            total_failures += 1
            print(f"[FAIL] {lesson_slug}: Required sections are out of order")
        else:
            total_passes += 1
            sec_count = len(expected_sections)
            print(f"[PASS] {lesson_slug}: All {sec_count} required ## sections exist in correct order")

        # ── 4. Runnable Examples Check ──
        runnable_blocks = re.findall(r"```python run\b", raw_content)
        runnable_count = len(runnable_blocks)
        runnable_min_default = 3 if is_project else 8
        runnable_min = runnable_min_default
        if "runnableMin" in frontmatter:
            try:
                requested_min = int(frontmatter["runnableMin"])
                if requested_min < 1:
                    raise ValueError
                runnable_min = max(3, requested_min) if is_project else requested_min
            except ValueError:
                total_failures += 1
                print(f"[FAIL] {lesson_slug}: 'runnableMin' must be a positive integer")

        if runnable_count < runnable_min:
            total_failures += 1
            print(f"[FAIL] {lesson_slug}: Runnable examples count is {runnable_count} (minimum required: {runnable_min})")
        else:
            total_passes += 1
            print(f"[PASS] {lesson_slug}: Runnable examples count is {runnable_count} (>= {runnable_min})")

        # ── 5. Code Execution & Output Matching Check ──
        file_lines = raw_content.splitlines(keepends=True)
        i = 0
        n = len(file_lines)
        current_section = ""

        while i < n:
            line_str = file_lines[i].strip()

            if line_str.startswith("## ") and not line_str.startswith("### "):
                current_section = line_str[3:].strip().lower()

            if line_str == "```python run" or line_str.startswith("```python run"):
                start_line = i + 1
                code_lines = []
                i += 1
                while i < n and file_lines[i].strip() != "```":
                    code_lines.append(file_lines[i])
                    i += 1

                if i >= n:
                    total_failures += 1
                    print(f"[FAIL] {lesson_slug} (line {start_line}): Unclosed ```python run block")
                    break

                code = "".join(code_lines)
                i += 1  # Skip closing ```

                # Skip blank lines
                while i < n and not file_lines[i].strip():
                    i += 1

                is_exercise_section = ("try it yourself" in current_section) or ("make it yourself" in current_section)

                # Check if immediately followed by ```output
                if i < n and file_lines[i].strip().startswith("```output"):
                    output_lines = []
                    i += 1
                    while i < n and file_lines[i].strip() != "```":
                        output_lines.append(file_lines[i])
                        i += 1

                    expected_output = "".join(output_lines).rstrip()
                    if i < n:
                        i += 1  # Skip closing ```

                    # Run code with LESSON_PYTHON with a 5-second timeout
                    try:
                        proc = subprocess.run(
                            [interpreter, "-c", code],
                            capture_output=True,
                            text=True,
                            timeout=5
                        )
                        actual_output = proc.stdout.rstrip()

                        if proc.returncode != 0:
                            total_failures += 1
                            err_detail = proc.stderr.strip().splitlines()[-1] if proc.stderr.strip() else "Process exited with non-zero code"
                            print(f"[FAIL] {lesson_slug} (line {start_line}): Code execution error -> {err_detail}")
                        elif actual_output == expected_output:
                            total_passes += 1
                            print(f"[PASS] {lesson_slug} (line {start_line}): Output matches")
                        else:
                            total_failures += 1
                            print(
                                f"[FAIL] {lesson_slug} (line {start_line}): Output mismatch\n"
                                f"  Expected:\n{repr(expected_output)}\n"
                                f"  Actual:\n{repr(actual_output)}"
                            )
                    except subprocess.TimeoutExpired:
                        total_failures += 1
                        print(f"[FAIL] {lesson_slug} (line {start_line}): Execution timed out after 5s")
                    except Exception as e:
                        total_failures += 1
                        print(f"[FAIL] {lesson_slug} (line {start_line}): Execution error: {e}")
                else:
                    if not is_exercise_section:
                        total_warnings += 1
                        print(f"[WARN] {lesson_slug} (line {start_line}): ```python run block outside '{'Make it yourself' if is_project else 'Try it yourself'}' missing ```output block")
                    else:
                        # Inside exercises, runnable blocks without output are expected
                        pass
            else:
                i += 1

        error_checks, error_failures = verify_error_examples(raw_content, lesson_slug, interpreter)
        total_error_checks += error_checks
        total_failures += error_failures
        total_passes += error_checks - error_failures

        # ── 6. quiz.json Validation Check ──
        quiz_path = os.path.join(lesson_dir, "quiz.json")
        if not os.path.exists(quiz_path):
            total_failures += 1
            print(f"[FAIL] {lesson_slug}: quiz.json file is missing")
        else:
            try:
                with open(quiz_path, "r", encoding="utf-8") as qf:
                    quiz_data = json.load(qf)

                quiz_min = 5 if is_project else 8
                quiz_max = 8 if is_project else 10
                if not isinstance(quiz_data, list):
                    total_failures += 1
                    print(f"[FAIL] {lesson_slug}: quiz.json root must be a JSON array")
                elif not (quiz_min <= len(quiz_data) <= quiz_max):
                    total_failures += 1
                    print(f"[FAIL] {lesson_slug}: quiz.json must contain {quiz_min}-{quiz_max} questions (found {len(quiz_data)})")
                else:
                    quiz_valid = True
                    for q_idx, q in enumerate(quiz_data):
                        if not isinstance(q, dict):
                            quiz_valid = False
                            print(f"[FAIL] {lesson_slug}: Question #{q_idx+1} is not an object")
                            break
                        if not q.get("question") or not isinstance(q["question"], str):
                            quiz_valid = False
                            print(f"[FAIL] {lesson_slug}: Question #{q_idx+1} missing valid 'question' text")
                            break
                        opts = q.get("options")
                        if not isinstance(opts, list) or len(opts) != 4:
                            quiz_valid = False
                            print(f"[FAIL] {lesson_slug}: Question #{q_idx+1} must have exactly 4 options (found {len(opts) if isinstance(opts, list) else 0})")
                            break
                        c_idx = q.get("correctIndex")
                        if not isinstance(c_idx, int) or not (0 <= c_idx < 4):
                            quiz_valid = False
                            print(f"[FAIL] {lesson_slug}: Question #{q_idx+1} correctIndex {c_idx} out of range [0..3]")
                            break
                        if not q.get("explanation") or not isinstance(q["explanation"], str):
                            quiz_valid = False
                            print(f"[FAIL] {lesson_slug}: Question #{q_idx+1} missing valid 'explanation'")
                            break

                    if quiz_valid:
                        total_passes += 1
                        print(f"[PASS] {lesson_slug}: quiz.json is valid with {len(quiz_data)} questions")
                    else:
                        total_failures += 1
            except Exception as e:
                total_failures += 1
                print(f"[FAIL] {lesson_slug}: Invalid JSON in quiz.json -> {e}")

    print("\n" + "=" * 70)
    print(f"Error messages checked: {total_error_checks}")
    print(f"Summary: {total_passes} checks passed, {total_warnings} warnings, {total_failures} failures.")
    print("=" * 70)

    if total_failures > 0:
        sys.exit(1)
    else:
        sys.exit(0)

if __name__ == "__main__":
    verify_lessons(resolve_lesson_interpreter())
