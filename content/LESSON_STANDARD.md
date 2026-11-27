Target: Python 3.12 (what runs in the browser). Never use newer features.
Length: 1,500-2,500 words of explanation, not counting code.
Runnable minimum: 8 by default; an integer frontmatter `runnableMin` may set a different minimum. Projects require at least 3 runnable examples even if `runnableMin` is lower.
Voice: second person, short sentences, plain words. Define each new term in bold the first time. Never write "simply", "just", "obviously" or "easy".
Sections, in this order, as ## headings:
1. What you will learn (3-5 bullet goals)
2. Why this matters (a real-life reason, 3-4 sentences)
3. The big idea (plain explanation and ONE everyday analogy)
4. Step by step (### subsections; each concept = explain, a runnable example, its Output block, then a line-by-line walkthrough)
5. What Python is doing behind the scenes (a table tracing variable values step by step, where it helps)
6. Common mistakes (3-5; each shows the broken code, the REAL error message copied from running it, and the fix)
7. Cheat sheet (a table)
8. Try it yourself (3 exercises: easy, medium, challenge; each has a complete task, a `sample input` or `input` block, an `expected` output block immediately before its starter, and separate collapsed Hint and Solution dropdowns)
9. Recap (5 bullets)
Examples: Usually 8-12 runnable examples per lesson; use the configured minimum for browser-limited lessons and projects. Make examples realistic (prices, marks, names, games), never foo/bar.
Runnable blocks (```python run) outside exercise sections must be followed by an ```output block with the exact output and a short explanation of what the code does. In "Try it yourself" and "Make it yourself", each task names what to ask the user, what to do with the response, and what to display. Include one ```sample input block with the supplied sample values; use ```input for lines that should prefill the runner's Input box for a task that calls `input()`. Put a ```expected block immediately before the starter. Each starter has one instruction comment, literal sample-data assignments when the task uses preset data, and a final `# Write your code below` line. Do not include solution logic or attach an output block to the starter. Put the full answer and a short explanation in a collapsed `:::solution` block. Add a short, collapsed `:::tip Hint` dropdown. Generate expected output by running the solution with Python 3.12 and the sample stdin when applicable. Ordinary runnable examples use preset data rather than `input()`; exercise run blocks may use `input()` when the task calls for user input and must include the matching sample-input block. Runnable code cannot use the network, threads, or external packages. Show disk and environment commands in plain code blocks with sample sessions.
Quiz: 8-10 questions mixing "what does this code print", concepts, and find-the-bug. Every explanation says why the right answer is right and why the most tempting wrong answer is wrong.
Accuracy: every runnable output and every error message must come from actually running Python 3.12. Facts must come from the Python 3.12 documentation at `docs.python.org/3.12`; never use newer Python documentation. Do not copy text from books or courses. CS50P lessons: use my notes as the source, rewrite in your own words, credit "Based on Harvard's CS50P" at the end.
Verification: `scripts/verify_lessons.py` runs code with the executable named by `LESSON_PYTHON` (default: `python3.12`). It must stop if that executable is missing or is not Python 3.12.x.
Scope rule: a lesson covers only the topic in its curriculum title; other topics get one sentence and 'covered in <lesson title>'. Do not teach them in depth.
Browser limitations: lessons about things that cannot run in the browser (pip, virtual environments, async, pytest, files from disk, sys.argv) use `runnableMin: 3`, show terminal commands in ```bash blocks with sample output, and still need 1,500+ words.
Projects: lessons with `type: project` have required ## sections: "The goal", "What you will practice", "Plan", "Build it step by step", "The complete program", "Make it yourself"; at least 1,000 words; at least 3 runnable examples; quiz of 5-8 questions. In projects, runnable blocks cannot use input(); simulate input with variables, and show the real input() version in a plain ```python block with a sample session.
