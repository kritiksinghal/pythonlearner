#!/usr/bin/env python3
"""Check lesson Markdown structure without interpreting embedded code as Markdown."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
LESSONS = ROOT / "content" / "lessons"
PROJECT_SECTIONS = [
    "The goal",
    "What you will practice",
    "Plan",
    "Build it step by step",
    "The complete program",
    "Make it yourself",
]
STANDARD_SECTIONS = [
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
FENCE_OPEN = re.compile(r"^ {0,3}(`{3,}|~{3,})(.*)$")
HEADING = re.compile(r"^#{2} (?!#)(.+?)\s*#*\s*$")
TABLE_SEP = re.compile(r"^\s*\|?\s*:?-{3,}:?\s*(?:\|\s*:?-{3,}:?\s*)+\|?\s*$")
LATEX = re.compile(
    r"\$(?!\d)[^$\n]+\$(?!\d)|\\(?:rightarrow|leftarrow|leftrightarrow|times|cdot|div|pm|mp|leq|geq|neq|approx|equiv|sum|prod|sqrt|infty|dots|ldots|forall|exists|land|lor|neg)\b"
)


def table_cells(line):
    text = line.strip()
    text = re.sub(r"`+[^`]*`+", "", text)
    if text.startswith("|"):
        text = text[1:]
    if text.endswith("|"):
        text = text[:-1]
    return len(re.split(r"(?<!\\)\|", text))


def lint_file(path):
    lines = path.read_text(encoding="utf-8").splitlines()
    issues = []
    fence = None
    callouts = []
    outside_headings = []
    outside_text = []
    tables_checked = set()

    for number, line in enumerate(lines, 1):
        if fence:
            if line.strip() == ":::" and callouts:
                issues.append((number, f"callout {callouts[-1][0]!r} closes while fence from line {fence[2]} remains open"))
                callouts.pop()
                fence = None
                continue
            close = re.match(r"^ {0,3}(`{3,}|~{3,})[ \t]*$", line)
            if close and close.group(1)[0] == fence[0] and len(close.group(1)) >= fence[1]:
                fence = None
            continue

        opened = FENCE_OPEN.match(line)
        if opened:
            marker = opened.group(1)
            fence = (marker[0], len(marker), number)
            continue

        stripped = line.strip()
        if stripped == ":::" and callouts:
            callouts.pop()
        elif re.match(r"^:::[A-Za-z]+(?:[ \t]+[^\r\n]*)?$", line):
            callouts.append((line[3:].split()[0], number))

        heading = HEADING.match(line)
        if heading:
            outside_headings.append((number, heading.group(1).strip()))
        outside_text.append((number, line))

        prose_line = re.sub(r"`+[^`]*`+", "", line)
        if LATEX.search(prose_line):
            issues.append((number, "contains a LaTeX delimiter/command outside a code fence"))

    if fence:
        issues.append((fence[2], f"unclosed {fence[0]} fence of length {fence[1]}"))
    for name, number in callouts:
        issues.append((number, f"unclosed ::: block {name!r}"))

    frontmatter = "\n".join(lines[:30])
    is_project = bool(re.search(r"(?m)^type:\s*project\s*$", frontmatter))
    required = PROJECT_SECTIONS if is_project else STANDARD_SECTIONS
    heading_names = [name for _, name in outside_headings]
    for section in required:
        if section not in heading_names:
            issues.append((1, f"required section heading ## {section} is missing outside code"))

    # Find Markdown tables outside code by checking contiguous pipe rows.
    for index, (line_no, line) in enumerate(outside_text[:-1]):
        if not line.strip().startswith("|") or not TABLE_SEP.match(outside_text[index + 1][1]):
            continue
        if line_no in tables_checked:
            continue
        rows = [line]
        cursor = index + 1
        rows.append(outside_text[cursor][1])
        cursor += 1
        while cursor < len(outside_text) and outside_text[cursor][1].strip().startswith("|"):
            rows.append(outside_text[cursor][1])
            cursor += 1
        widths = [(outside_text[index + offset][0], table_cells(row)) for offset, row in enumerate(rows)]
        expected = widths[0][1]
        for row_no, count in widths[1:]:
            if count != expected:
                issues.append((row_no, f"table row has {count} columns; header has {expected}"))
        tables_checked.add(line_no)

    return issues


def main():
    files = sorted(LESSONS.glob("*/lesson.md"))
    broken = 0
    for path in files:
        issues = lint_file(path)
        if issues:
            broken += 1
            print(f"[BROKEN] {path.parent.name}")
            for line, issue in issues:
                print(f"  line {line}: {issue}")
    print(f"\nLesson structure lint: {len(files)} lessons checked, {broken} broken.")
    return 1 if broken else 0


if __name__ == "__main__":
    raise SystemExit(main())
