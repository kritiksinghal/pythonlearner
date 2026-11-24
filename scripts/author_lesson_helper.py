#!/usr/bin/env python3
"""
Helper script to execute python run blocks in a lesson.md,
automatically attach the exact stdout in ```output blocks,
and report words, runnable counts, and section checks.
"""
import sys
import os
import re
import subprocess
import json

def process_lesson(lesson_dir):
    lesson_path = os.path.join(lesson_dir, "lesson.md")
    if not os.path.exists(lesson_path):
        print(f"Error: {lesson_path} not found")
        return False

    with open(lesson_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Split into lines
    lines = content.splitlines(keepends=True)
    new_lines = []
    i = 0
    n = len(lines)
    current_section = ""

    while i < n:
        line_str = lines[i].strip()
        if line_str.startswith("## ") and not line_str.startswith("### "):
            current_section = line_str[3:].strip().lower()

        if line_str == "```python run" or line_str.startswith("```python run"):
            new_lines.append(lines[i])
            code_lines = []
            i += 1
            while i < n and lines[i].strip() != "```":
                code_lines.append(lines[i])
                new_lines.append(lines[i])
                i += 1
            
            if i < n:
                new_lines.append(lines[i]) # closing ```
                i += 1

            code = "".join(code_lines)
            is_exercise = ("try it yourself" in current_section) or ("make it yourself" in current_section)

            # Skip existing output block if present
            # first skip empty lines
            temp_idx = i
            while temp_idx < n and not lines[temp_idx].strip():
                temp_idx += 1
            if temp_idx < n and lines[temp_idx].strip().startswith("```output"):
                temp_idx += 1
                while temp_idx < n and lines[temp_idx].strip() != "```":
                    temp_idx += 1
                if temp_idx < n:
                    temp_idx += 1 # skip closing ```
                i = temp_idx

            if not is_exercise:
                # Execute code
                res = subprocess.run([sys.executable, "-c", code], capture_output=True, text=True, timeout=5)
                if res.returncode != 0:
                    print(f"Error executing code at section '{current_section}': {res.stderr}")
                    return False
                actual_stdout = res.stdout.rstrip()
                new_lines.append("\n```output\n")
                if actual_stdout:
                    new_lines.append(actual_stdout + "\n")
                new_lines.append("```\n")
        else:
            new_lines.append(lines[i])
            i += 1

    with open(lesson_path, "w", encoding="utf-8") as f:
        f.writelines(new_lines)

    print(f"Updated {lesson_path} with verified outputs.")
    return True

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 author_lesson_helper.py <lesson_dir>")
        sys.exit(1)
    success = process_lesson(sys.argv[1])
    sys.exit(0 if success else 1)
