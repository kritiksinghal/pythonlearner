#!/usr/bin/env python3
"""
scripts/verify_lessons.py

Self-enforcing verification for PyLearner lessons per LESSON_STANDARD.md:
1. All 9 required ## sections exist, in the order given in LESSON_STANDARD.md.
2. The explanation has at least 1,500 words (not counting code blocks).
3. At least 8 runnable examples (```python run blocks).
4. quiz.json is valid JSON with 8-10 questions, 4 options each, and a correctIndex within range.
5. The curriculumTitle frontmatter value exists in CURRICULUM.md.
6. Every exercise in "Try it yourself" or "Make it yourself" has a data-only starter, expected output, hint, and solution block.
7. Every solution starts with the starter's literal data assignments and prints the expected output with Python 3.12.
8. Every ```python run block outside exercise sections is followed by an ```output block (print a WARN otherwise).
9. Running runnable examples with LESSON_PYTHON (default python3.12) produces output that matches the ```output block.
10. Running code blocks paired with error output reproduces the displayed final error line.

Exits with non-zero code on any FAIL.
"""

import sys
import glob
import os
import re
import ast
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


def parse_exercises(content):
    """Collect exercise tasks, hints, expected output, starters, and solutions."""
    lines = content.splitlines()
    sections = []
    section = ""
    current = None
    i = 0

    def add_current():
        nonlocal current
        if current is not None:
            current["task"] = "\n".join(current.pop("task_lines")).strip()
            sections.append(current)
            current = None

    def new_exercise(name, section_name, line_number):
        return {
            "section": section_name, "heading": name, "heading_line": line_number,
            "starters": [], "solutions": [], "expected": [], "inputs": [], "hints": [],
            "stray_code": [], "stray_outputs": [], "task_lines": [], "task_closed": False,
        }

    while i < len(lines):
        line = lines[i]
        trimmed = line.strip()
        if trimmed.startswith("## ") and not trimmed.startswith("### "):
            add_current()
            section = trimmed[3:].strip().lower()
            if section == "make it yourself":
                current = new_exercise("Make it yourself", section, i + 1)
            i += 1
            continue

        if section not in ("try it yourself", "make it yourself"):
            i += 1
            continue

        if trimmed.startswith("### ") and section == "try it yourself":
            add_current()
            current = new_exercise(trimmed[4:].strip(), section, i + 1)
            i += 1
            continue

        if current is None:
            i += 1
            continue

        if trimmed.startswith(":::solution"):
            solution_start = i + 1
            body = []
            i += 1
            fence = None
            while i < len(lines):
                opening = re.match(r"^\s*(`{3,}|~{3,})(.*)$", lines[i])
                if opening and fence is None:
                    fence = (opening.group(1)[0], len(opening.group(1)))
                elif fence:
                    closing = re.match(r"^\s*(`{3,}|~{3,})\s*$", lines[i])
                    if closing and closing.group(1)[0] == fence[0] and len(closing.group(1)) >= fence[1]:
                        fence = None
                if lines[i].strip() == ":::" and fence is None:
                    break
                body.append(lines[i])
                i += 1
            current["solutions"].append({"line": solution_start, "body": "\n".join(body)})
            if i < len(lines):
                i += 1
            continue

        if trimmed.startswith(":::tip") or trimmed.startswith(":::hint"):
            current["task_closed"] = True
            hint_body = []
            i += 1
            while i < len(lines) and lines[i].strip() != ":::":
                hint_body.append(lines[i])
                i += 1
            current["hints"].append("\n".join(hint_body).strip())
            if i < len(lines):
                i += 1
            continue

        opening = re.match(r"^\s*```([^`]*)$", line)
        if opening:
            info = opening.group(1).strip().lower()
            info = trimmed[3:].strip().lower()
            start_line = i + 1
            body = []
            i += 1
            while i < len(lines) and not re.match(r"^\s*```\s*$", lines[i]):
                body.append(lines[i])
                i += 1
            if i >= len(lines):
                break
            if info == "expected":
                current["task_closed"] = True
                current["expected"].append({"line": start_line, "body": "\n".join(body)})
            elif info in ("input", "sample input"):
                current["task_closed"] = True
                current["inputs"].append({"line": start_line, "tag": info, "body": "\n".join(body)})
            elif info == "python run":
                current["task_closed"] = True
                next_line = i + 1
                while next_line < len(lines) and not lines[next_line].strip():
                    next_line += 1
                has_output = next_line < len(lines) and lines[next_line].strip().startswith("```output")
                current["starters"].append({
                    "line": start_line,
                    "body": "\n".join(body),
                    "followed_by_output": has_output,
                })
            elif info == "python":
                current["stray_code"].append(start_line)
            elif info == "output":
                current["stray_outputs"].append(start_line)
            i += 1
            continue

        if trimmed and not trimmed.startswith(":::") and not current["task_closed"]:
            current["task_lines"].append(trimmed)
        i += 1

    add_current()
    return sections


def run_interactive_solution(code, stdin_text, interpreter):
    harness = f'''import builtins, io, json, sys
code = {json.dumps(code)}
input_text = {json.dumps(stdin_text)}
old_in, old_out, old_input = sys.stdin, sys.stdout, builtins.input
sys.stdin = io.StringIO(input_text + ("\\n" if input_text and not input_text.endswith("\\n") else ""))
captured = io.StringIO()
sys.stdout = captured
def learner_input(prompt=""):
    if prompt:
        print(prompt, end="", file=sys.stdout)
    line = sys.stdin.readline()
    if line == "":
        raise EOFError("sample input ended early")
    print(line.rstrip("\\r\\n"), file=sys.stdout)
    return line.rstrip("\\r\\n")
builtins.input = learner_input
try:
    exec(compile(code, "<lesson_solution>", "exec"), {{}})
    result = {{"output": captured.getvalue().rstrip()}}
except BaseException as error:
    result = {{"error": f"{{type(error).__name__}}: {{error}}"}}
finally:
    builtins.input = old_input
    sys.stdin, sys.stdout = old_in, old_out
print(json.dumps(result))
'''
    proc = subprocess.run([interpreter, "-c", harness], capture_output=True, text=True, timeout=5)
    if proc.returncode != 0:
        return None, proc.stderr.strip() or proc.stdout.strip() or "interactive solution process failed"
    try:
        result = json.loads(proc.stdout)
    except json.JSONDecodeError:
        return None, f"invalid verifier response: {proc.stdout!r}"
    if "error" in result:
        return None, result["error"]
    return result.get("output", ""), None


def verify_exercises(content, lesson_slug, interpreter):
    failures = 0
    exercises = parse_exercises(content)
    checked_starters = 0
    new_starters = 0
    for exercise in exercises:
        heading = exercise["heading"]
        starters = exercise["starters"]
        solutions = exercise["solutions"]
        if exercise["stray_code"]:
            failures += len(exercise["stray_code"])
            print(f"[FAIL] {lesson_slug}: Exercise '{heading}' has Python answer code outside its solution block")
        if exercise["stray_outputs"]:
            failures += len(exercise["stray_outputs"])
            print(f"[FAIL] {lesson_slug}: Exercise '{heading}' has an output block outside its solution block")
        if not starters:
            new_starters += 1
            failures += 1
            print(f"[FAIL] {lesson_slug}: Exercise '{heading}' has no ```python run starter")
        elif len(starters) > 1:
            failures += 1
            print(f"[FAIL] {lesson_slug}: Exercise '{heading}' has {len(starters)} starters; expected one")

        if not exercise["task"]:
            failures += 1
            print(f"[FAIL] {lesson_slug}: Exercise '{heading}' has no task text")
        else:
            sentences = re.split(r"(?<=[.!?])\s+", exercise["task"])
            for sentence in sentences:
                words = re.findall(r"\b[\w'-]+\b", sentence)
                if len(words) > 20:
                    print(f"[WARN] {lesson_slug}: Exercise '{heading}' has a task sentence over 20 words ({len(words)})")
            if re.search(r"\b(below|above|the text|the data|the operation)\b", exercise["task"], re.I) and not re.search(r"`[A-Za-z_]\w*`", exercise["task"]):
                print(f"[WARN] {lesson_slug}: Exercise '{heading}' uses a vague reference without a backticked variable")

        if len(exercise["expected"]) != 1:
            failures += 1
            print(f"[FAIL] {lesson_slug}: Exercise '{heading}' needs exactly one ```expected block")
        if len(exercise["inputs"]) != 1:
            failures += 1
            print(f"[FAIL] {lesson_slug}: Exercise '{heading}' needs exactly one sample-input block")
        if not exercise["hints"] or not any(exercise["hints"]):
            failures += 1
            print(f"[FAIL] {lesson_slug}: Exercise '{heading}' has no Hint callout")

        starter_assignments = []
        for starter in starters:
            nonblank = [line.strip() for line in starter["body"].splitlines() if line.strip()]
            comment_lines = [line for line in nonblank if line.startswith("#")]
            source_lines = [line for line in nonblank if not line.startswith("#")]
            valid = bool(comment_lines) and comment_lines[0].startswith("# ") and comment_lines[-1] == "# Write your code below"
            try:
                parsed = ast.parse("\n".join(source_lines))
                for statement in parsed.body:
                    if not isinstance(statement, ast.Assign) or len(statement.targets) != 1 or not isinstance(statement.targets[0], ast.Name):
                        raise ValueError("only simple literal assignments are allowed")
                    ast.literal_eval(statement.value)
                    starter_assignments.append(ast.dump(statement, include_attributes=False))
            except (SyntaxError, ValueError, TypeError) as error:
                valid = False
                print(f"[FAIL] {lesson_slug} (line {starter['line']}): Exercise '{heading}' starter is not data-only: {error}")
                failures += 1
            if not valid:
                failures += 1
                print(
                    f"[FAIL] {lesson_slug} (line {starter['line']}): Exercise '{heading}' starter must have "
                    "an instruction comment, literal sample assignments/comments, and '# Write your code below' last"
                )
            else:
                checked_starters += 1
            if starter["followed_by_output"]:
                failures += 1
                print(f"[FAIL] {lesson_slug}: Exercise '{heading}' has an output block attached to its starter")

        if not solutions:
            failures += 1
            print(f"[FAIL] {lesson_slug}: Exercise '{heading}' has no :::solution block")
            continue

        for solution_index, solution in enumerate(solutions, start=1):
            explanation = re.sub(r"```[\s\S]*?```", " ", solution["body"])
            explanation = re.sub(r"(?m)^\s*:::\s*$", " ", explanation).strip()
            if not explanation:
                failures += 1
                print(f"[FAIL] {lesson_slug}: Exercise '{heading}' solution #{solution_index} has no explanation")
            code_blocks = list(re.finditer(
                r"(?m)^```python(?: run)?\s*\r?\n([\s\S]*?)\r?\n```",
                solution["body"],
            ))
            if not code_blocks:
                failures += 1
                print(f"[FAIL] {lesson_slug}: Exercise '{heading}' solution #{solution_index} has no Python code")
                continue

            for code_index, code_match in enumerate(code_blocks):
                code = code_match.group(1)
                if code_index == 0 and starter_assignments:
                    try:
                        solution_tree = ast.parse(code)
                        solution_assignments = [
                            ast.dump(node, include_attributes=False)
                            for node in solution_tree.body[:len(starter_assignments)]
                            if isinstance(node, ast.Assign)
                        ]
                        if starter_assignments and solution_assignments != starter_assignments:
                            failures += 1
                            print(f"[FAIL] {lesson_slug}: Exercise '{heading}' solution does not start with its starter data")
                    except SyntaxError as error:
                        failures += 1
                        print(f"[FAIL] {lesson_slug}: Exercise '{heading}' solution has invalid Python: {error}")
                following = solution["body"][code_match.end():]
                output_match = re.match(
                    r"(?:\s*\r?\n)*```output[^\r\n]*\r?\n([\s\S]*?)\r?\n```",
                    following,
                )
                try:
                    if exercise["inputs"] and exercise["inputs"][0]["tag"] == "input":
                        actual_output, run_error = run_interactive_solution(code, exercise["inputs"][0]["body"], interpreter)
                        return_code = 0 if run_error is None else 1
                        actual_stdout = actual_output or ""
                    else:
                        proc = subprocess.run(
                            [interpreter, "-c", code], capture_output=True, text=True, timeout=5
                        )
                        return_code = proc.returncode
                        actual_stdout = proc.stdout
                        run_error = proc.stderr.strip().splitlines()[-1] if proc.stderr.strip() else "non-zero exit"
                    if return_code != 0:
                        failures += 1
                        print(f"[FAIL] {lesson_slug}: Exercise '{heading}' solution code failed: {run_error}")
                    elif output_match and actual_stdout.rstrip() != output_match.group(1).rstrip():
                        failures += 1
                        print(
                            f"[FAIL] {lesson_slug}: Exercise '{heading}' solution output mismatch; "
                            f"expected {output_match.group(1).rstrip()!r}, got {actual_stdout.rstrip()!r}"
                        )
                    else:
                        expected = exercise["expected"][0]["body"].rstrip() if exercise["expected"] else None
                        actual = actual_stdout.rstrip()
                        if expected is None or actual != expected:
                            failures += 1
                            print(f"[FAIL] {lesson_slug}: Exercise '{heading}' output differs from Expected output; expected {expected!r}, got {actual!r}")
                        else:
                            print(f"[PASS] {lesson_slug}: Exercise '{heading}' solution matches Expected output")
                except subprocess.TimeoutExpired:
                    failures += 1
                    print(f"[FAIL] {lesson_slug}: Exercise '{heading}' solution timed out after 5s")
                except OSError as error:
                    failures += 1
                    print(f"[FAIL] {lesson_slug}: Could not run solution for '{heading}': {error}")
    print(
        f"[EXERCISES] {lesson_slug}: {len(exercises)} found, "
        f"{checked_starters} data-only starters, {new_starters} new starters needed"
    )
    return len(exercises), failures

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
        preceding = re.sub(r"```[\s\S]*?```", "", raw_content[:match.start()])
        headings = re.findall(r"(?m)^## (?!#)(.+)$", preceding)
        current_section = headings[-1].strip().lower() if headings else ""
        if "try it yourself" in current_section or "make it yourself" in current_section:
            try:
                if not ast.parse(code).body:
                    continue
            except SyntaxError:
                pass
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
    total_exercises = 0

    print(f"Verifying {len(lesson_files)} lesson(s) against LESSON_STANDARD.md...")
    print("=" * 70)

    for file_path in lesson_files:
        lesson_dir = os.path.dirname(file_path)
        lesson_slug = os.path.basename(lesson_dir)
        print(f"\n--- Checking lesson: {lesson_slug} ---")

        with open(file_path, "r", encoding="utf-8") as f:
            raw_content = f.read()

        exercise_count, exercise_failures = verify_exercises(raw_content, lesson_slug, interpreter)
        total_exercises += exercise_count
        total_failures += exercise_failures

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
        in_solution_block = False

        while i < n:
            line_str = file_lines[i].strip()

            if line_str.startswith(":::solution"):
                in_solution_block = True
            elif line_str == ":::" and in_solution_block:
                in_solution_block = False

            if line_str.startswith("## ") and not line_str.startswith("### "):
                current_section = line_str[3:].strip().lower()

            if line_str == "```python run" or line_str.startswith("```python run"):
                solution_run = in_solution_block
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

                # Exercise solutions have their own sample-input-aware check above.
                if solution_run:
                    while i < n and not file_lines[i].strip():
                        i += 1
                    if i < n and file_lines[i].strip().startswith("```output"):
                        i += 1
                        while i < n and file_lines[i].strip() != "```":
                            i += 1
                        if i < n:
                            i += 1
                    continue

                # Skip blank lines
                while i < n and not file_lines[i].strip():
                    i += 1

                is_exercise_section = ("try it yourself" in current_section) or ("make it yourself" in current_section)

                # Empty exercise starters are editable prompts, not examples to
                # execute or compare against an output block.
                if is_exercise_section:
                    try:
                        if not ast.parse(code).body:
                            continue
                    except SyntaxError:
                        pass

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
    print(f"Exercises found: {total_exercises}")
    print(f"Summary: {total_passes} checks passed, {total_warnings} warnings, {total_failures} failures.")
    print("=" * 70)

    if total_failures > 0:
        sys.exit(1)
    else:
        sys.exit(0)

if __name__ == "__main__":
    verify_lessons(resolve_lesson_interpreter())
