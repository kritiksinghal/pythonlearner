# HANDOVER: Python learning website ("PyLearner")

Updated 24 Nov 2026. Read this whole file before touching anything. It documents the project vision, the fixed stack, architecture, what is built and programmatically verified, what requires human visual checks, and exact next steps.

---

## 1. Vision (do not drift from this)

A free website where anyone can go from zero to advanced Python.

1. **Lessons** (basics to advanced), explained so clearly that a complete beginner can follow, each with a quiz.
2. **Practice area**: the user writes Python in an editor and the site runs it against 10–15 hidden test cases (like HackerRank), showing which tests failed with expected vs actual output.
3. **AI tutor**: explains why a test failed, what is missing, how to improve. Later it becomes an agent that can search official Python docs, run code, and search the web.
4. **Accounts and progress tracking.**

Two tracks of content:
- **"Python from zero"** (about 50 lessons across 9 modules M1–M9)
- **"CS50P"** (10 lessons, one per CS50P week)

Everything must be free to run. The owner (Kritik) is a beginner who wants strict, phase-by-phase work. **Do not add features, pages, libraries or refactors that the current phase did not ask for.** If you think something is missing, list it under "Suggestions" in your report and do not build it.

---

## 2. Fixed Stack (do not change)

- **Framework**: Next.js (App Router, version 16) + TypeScript + Tailwind CSS
- **Code Editor**: Monaco editor via `@monaco-editor/react`
- **Execution Engine**: Python runs **ONLY** in the user's browser with Pyodide (v0.26.4, Python 3.12 runtime) inside a Web Worker (`public/pyodideWorker.js`). Never run user code on the server.
- **Content Storage**: Lessons and practice problems are stored as static Markdown and JSON files in `/content`.
- **Custom Markdown Renderer**: `MarkdownView` is a custom-built parser and renderer supporting GitHub alerts, tables, numbered/bulleted lists, custom callouts (`:::tip`, `:::warning`, `:::remember`, `:::deep`, `:::solution`), runnable code blocks (` ```python run `), and output blocks (` ```output `). No third-party Markdown packages (`marked`, `remark`, etc.) are allowed.
- **Later Phases**: Supabase (auth, user progress tracking) and Gemini API (server routes only, API keys in `.env.local`).

---

## 3. Working Agreement & Operating Rules

1. **One phase at a time**: Every phase has an acceptance checklist.
2. **Short plan first**: State the files to create or modify before building.
3. **Keep code clean and simple**: Short explanatory comments for beginners.
4. **Preserve prior working code**: Never delete or rewrite earlier code unless explicitly instructed.
5. **Honesty rule**: If a visual or runtime aspect cannot be programmatically verified in the terminal, state **"needs human check"**—never claim PASS without concrete verification.
6. **No secrets in commits**: `.env.local` is gitignored; never ask the user to paste API keys into chat.
7. **Curriculum fidelity**: Every lesson must strictly follow `content/LESSON_STANDARD.md` and map to `content/CURRICULUM.md`.

### How to Run Locally

```bash
export PATH="$HOME/.local/node/bin:$PATH"   # Node path on mac environment
cd ~/pythonlearner
npm run dev                                 # Starts local dev server at http://localhost:3000
LESSON_PYTHON="$HOME/Library/spyder-6/envs/spyder-runtime/bin/python3.12" python3 scripts/verify_lessons.py  # Verifies with Python 3.12.x; default is python3.12
```

---

## 4. Visual Identity & Design System

- **Typography**:
  - Headings & Accent Numbers: **Doto** (dot-matrix display font)
  - Body & Reading Text: **Hanken Grotesk**
  - Code & Console Output: **JetBrains Mono**
- **Color Palette**:
  - Paper: `#F7F8FA` (Light mode) / `#0E1116` (Dark mode)
  - Ink: `#111418` (Light mode) / `#F7F8FA` (Dark mode)
  - Accent Token: **Python Yellow** (`#FFC832`) for dots, active navigation indicators, and focus rings. (Never yellow text on white background).
  - Status indicators: Green for passing tests, red for failing tests.
  - **No blues**: Removed legacy blues/sky/indigo across the site.
- **Layout**:
  - Two-column grid on desktop ($\ge 1024\text{px}$): 220px sticky sidebar for table of contents + main content column with max 70ch reading width.
  - Collapsible non-overlapping accordion table of contents on mobile ($< 1024\text{px}$).
  - `scroll-margin-top` on headings prevents content from hiding beneath the sticky navbar.

---

## 5. Current State of Development

| Phase | Description | Current Status |
|---|---|---|
| **Phase 1** | Foundation (pages, navbar, footer, tokens, folder layout) | **DONE** |
| **Phase 2** | Monaco editor + Pyodide Web Worker + test runner (5s timeout, readable errors) | **DONE** |
| **Phase 3** | Practice system: `/practice`, `/practice/[slug]`, 6 initial problems, test runner | **DONE** (70 test cases verified with python3) |
| **Phase 3.5** | Visual identity (Doto font, halftone canvas, dot-grid mark, ruled lists) | **DONE** |
| **Phase 4** | Initial lesson & quiz infrastructure (`/learn`, `/learn/[slug]`, `QuizView`) | **DONE** |
| **Phase 6A** | Curriculum map (`CURRICULUM.md`), lesson standard (`LESSON_STANDARD.md`), TOC component, callouts, `verify_lessons.py` | **DONE** |
| **Polish Pass** | Visual identity fixes (Doto headings, yellow accents, TOC layout fixes, track counters) | **DONE** |
| **Phase 6B (Python from zero lessons 1–25 + CS50P Week 1)** | 26 lessons complete and verified with Python 3.12.11 | **IN PROGRESS** (25 of 50 Python-from-zero lessons plus 1 of 10 CS50P lessons; 413 checks passing) |

### Remaining Roadmap

- **Phase 6B (Continuation)**: Complete remaining lessons in Module 5 (Recursion), Modules 6–9, and CS50P Weeks 2–10.
- **Phase 5**: AI feedback on failed tests (Gemini server route `POST /api/tutor/feedback` with rate limiting and prompt guardrails).
- **Phase 7**: User authentication and progress tracking with Supabase.
- **Phase 8**: Re-chunk the Python 3.12 documentation for hybrid search (BM25 + embeddings + reranker); do not use the Python 3.15 chunks for lessons.
- **Phase 9**: Autonomous AI Tutor agent (tutor selects between docs search, code execution, web search, and lesson content).

---

## 6. Completed Lessons Inventory (26 Lessons Verified)

The first 25 Python-from-zero lessons and CS50P Week 1 pass the automated requirements in `content/LESSON_STANDARD.md` using Python 3.12.11. All runnable examples match their output blocks; all 19 documented error messages match Python 3.12.11.

| # | Slug | Track | Module | Order | Word Count | Runnables | Quiz Qs | Verification |
|---|---|---|---|---|---:|---:|---:|---|
| 1 | `what-is-programming-and-python` | Python from zero | M1 Getting started | 1 | 2,028 | 17 | 9 | PASS |
| 2 | `your-first-program-with-print` | Python from zero | M1 Getting started | 2 | 1,736 | 17 | 9 | PASS |
| 3 | `variables-and-types` | Python from zero | M1 Getting started | 3 | 2,005 | 18 | 9 | PASS |
| 4 | `numbers-and-math` | Python from zero | M1 Getting started | 4 | 1,830 | 17 | 9 | PASS |
| 5 | `text-strings` | Python from zero | M1 Getting started | 5 | 1,827 | 17 | 9 | PASS |
| 6 | `talking-to-the-user-with-input-and-f-strings` | Python from zero | M1 Getting started | 6 | 1,658 | 16 | 9 | PASS |
| 7 | `true-false-and-comparisons` | Python from zero | M2 Making decisions | 7 | 1,503 | 18 | 9 | PASS |
| 8 | `making-decisions-with-if` | Python from zero | M2 Making decisions | 8 | 1,929 | 16 | 9 | PASS |
| 9 | `and-or-not` | Python from zero | M2 Making decisions | 9 | 1,952 | 17 | 9 | PASS |
| 10 | `repeating-with-loops` | Python from zero | M3 Repeating | 10 | 1,540 | 19 | 9 | PASS |
| 11 | `for-loops-and-range` | Python from zero | M3 Repeating | 11 | 1,733 | 16 | 9 | PASS |
| 12 | `break-continue-and-loop-else` | Python from zero | M3 Repeating | 12 | 1,670 | 14 | 9 | PASS |
| 13 | `nested-loops-and-patterns` | Python from zero | M3 Repeating | 13 | 1,683 | 16 | 9 | PASS |
| 14 | `lists` | Python from zero | M4 Collections | 14 | 1,692 | 16 | 9 | PASS |
| 15 | `indexing-and-slicing` | Python from zero | M4 Collections | 15 | 1,556 | 17 | 9 | PASS |
| 16 | `tuples` | Python from zero | M4 Collections | 16 | 1,628 | 16 | 9 | PASS |
| 17 | `dictionaries` | Python from zero | M4 Collections | 17 | 2,057 | 11 | 9 | PASS |
| 18 | `sets` | Python from zero | M4 Collections | 18 | 1,711 | 11 | 9 | PASS |
| 19 | `comprehensions` | Python from zero | M4 Collections | 19 | 1,709 | 11 | 9 | PASS |
| 20 | `sorting-zip-and-enumerate` | Python from zero | M4 Collections | 20 | 1,580 | 12 | 9 | PASS |
| 21 | `defining-functions` | Python from zero | M5 Functions | 21 | 1,574 | 11 | 9 | PASS |
| 22 | `parameters-and-return-values` | Python from zero | M5 Functions | 22 | 1,617 | 12 | 9 | PASS |
| 23 | `scope` | Python from zero | M5 Functions | 23 | 1,643 | 11 | 9 | PASS |
| 24 | `default-keyword-args-and-kwargs` | Python from zero | M5 Functions | 24 | 1,602 | 11 | 9 | PASS |
| 25 | `lambda-map-and-filter` | Python from zero | M5 Functions | 25 | 1,602 | 11 | 9 | PASS |
| 26 | `functions-and-variables` | CS50P | Week 0 / 1 | 1 | 2,435 | 16 | 9 | PASS |

**Automated Verification Status**: `LESSON_PYTHON="$HOME/Library/spyder-6/envs/spyder-runtime/bin/python3.12" python3 scripts/verify_lessons.py` produces `Error messages checked: 19` and `Summary: 413 checks passed, 0 warnings, 0 failures.`

---

## 7. File Map & Project Architecture

```
pythonlearner/
├── app/
│   ├── globals.css                       # Design tokens, CSS variables, dark/light theme
│   ├── layout.tsx                        # Root layout with fonts, Navbar, Footer
│   ├── page.tsx                          # Landing page with halftone hero & feature grid
│   ├── learn/
│   │   ├── page.tsx                      # Lesson catalog grouped by track and module
│   │   └── [slug]/page.tsx               # Dynamic lesson viewer with TOC, runnables & quiz
│   ├── practice/
│   │   ├── page.tsx                      # Practice problem listing with track filters
│   │   └── [slug]/page.tsx               # Monaco editor, Pyodide runner & test suite
│   └── test-markdown/page.tsx            # Test workbench for MarkdownView (delete before launch)
├── components/
│   ├── CodeEditor.tsx                    # Monaco editor wrapper with keybindings
│   ├── DotGridGlyph.tsx                  # Doto decorative marks and visual accents
│   ├── Footer.tsx                        # Global site footer
│   ├── HalftoneCanvas.tsx                # Procedural halftone canvas background
│   ├── LessonTableOfContents.tsx         # Sticky desktop TOC & mobile accordion
│   ├── MarkdownView.tsx                  # Custom Markdown, table, alert & callout engine
│   ├── Navbar.tsx                        # Sticky navigation bar with active route tokens
│   ├── QuizView.tsx                      # Interactive multiple-choice quiz with explanations
│   ├── RunnableCodeBlock.tsx             # Pyodide browser-runner with terminal output pane
│   └── TestResults.tsx                   # Practice test execution reporter (expected vs actual)
├── content/
│   ├── CURRICULUM.md                     # Master track & module order for all 60 lessons
│   ├── LESSON_STANDARD.md                # Self-enforcing lesson quality & structural standard
│   ├── lessons/<slug>/
│   │   ├── lesson.md                     # Lesson frontmatter & 9 structured sections
│   │   └── quiz.json                     # 8–10 question quiz schema
│   ├── problems/<slug>.json              # Practice problems, starter code, test suites
│   └── source/
│       ├── cs50p-notes/                  # CS50P Markdown notes from Notion (source for CS50P track)
│       └── python-docs/                  # Target location for Python doc chunks (Phase 8)
├── lib/
│   ├── lessons.ts                        # Frontmatter parsing, reading time, curriculum mapping
│   ├── problems.ts                       # Problem loader, test case isolation
│   ├── pyodideRunner.ts                  # Worker messaging interface
│   ├── pyodideWorker.ts                  # Worker initialization logic
│   └── usePyodide.ts                     # React hook for browser-side Python execution
├── public/
│   └── pyodideWorker.js                  # Dedicated Web Worker hosting Pyodide 0.26.4
└── scripts/
    └── verify_lessons.py                 # Autonomous lesson verification test harness
```

---

## 8. Standards, Rules & Verification Harness

### Lesson Verification Harness (`scripts/verify_lessons.py`)

The verification script enforces every dimension of `LESSON_STANDARD.md`:
1. **Interpreter Check**: Uses `LESSON_PYTHON` (default `python3.12`), stops with a clear error if missing or not Python 3.12.x, and prints the version used.
2. **Curriculum Title Check**: Ensures `curriculumTitle` exists in `content/CURRICULUM.md`.
3. **Section Check**: Checks the nine standard `##` sections in order. Projects use their six project-specific section headings.
4. **Word Count Check**: Counts outside code blocks, HTML tags, and callouts: 1,500+ words for standard lessons and 1,000+ for projects.
5. **Runnable Examples**: Uses `runnableMin` when present (default 8; projects require at least 3) and runs examples with the validated Python 3.12 interpreter, comparing outputs character-for-character.
6. **Error Message Check**: Runs Python code paired with an error output block and compares the final error line.
7. **Project Support**: `type: project` requires "The goal", "What you will practice", "Plan", "Build it step by step", "The complete program", and "Make it yourself"; 1,000+ words; 3+ runnable examples; and a quiz of 5–8 questions.
8. **Quiz Schema**: Standard quizzes contain 8–10 questions; project quizzes contain 5–8. Every question needs exactly four options and a valid `correctIndex`.
9. **Documentation Version**: Do not use the Python 3.15 `chunks.jsonl` source for lesson facts. Lessons target Python 3.12; Phase 8 must re-chunk the Python 3.12 docs. That chunks file is currently missing from this checkout.

---

## 9. Known Issues, Loose Ends & Human Check Items

1. **Needs Human Check (Visual Layout)**:
   - Confirm table of contents on `/learn/[slug]` does not overlap lesson text at 1440px (wide desktop), 1024px (tablet landscape), and 390px (mobile).
   - Confirm active-nav dot and track indicators render in Python yellow (`#FFC832`) across light and dark modes.
2. **Missing Source Material**:
   - `content/source/python-docs/chunks.jsonl` is currently missing. If restored, it contains Python 3.15 documentation and must not be used as lesson source because lesson facts target Python 3.12. For Phase 8, re-chunk the Python 3.12 documentation to match the browser runtime.
3. **Pre-Launch Cleanup**:
   - `/test-markdown` route must be deleted before production release.
   - Confirm `referenceSolution` in problem JSON files is never bundled into client payloads.

---

## 10. Next Steps for Continuing Development

When continuing in the next turn or chat, proceed directly with:

1. **Finish Module 5 ("M5 Functions")**: Lesson 26, `recursion` (curriculumTitle: "Recursion", order 26).
2. **Continue Module 6 ("M6 Errors, files, modules")**: Lessons 27–32.
3. **Continue Module 7 ("M7 Objects")**: Lessons 33–37.
4. **Continue Module 8 ("M8 Advanced")**: Lessons 38–45.
5. **Continue Module 9 ("M9 Projects")**: Lessons 46–50.
6. **Complete CS50P Track**: Lessons 2–10 (`conditionals`, `loops`, `exceptions`, `libraries`, `unit-tests`, `file-io`, `cs50p-regular-expressions`, `object-oriented-programming`, `et-cetera`).
7. Run `LESSON_PYTHON="$HOME/Library/spyder-6/envs/spyder-runtime/bin/python3.12" python3 scripts/verify_lessons.py` across all completed lessons and confirm 100% pass rate.
