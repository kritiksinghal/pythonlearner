# HANDOVER: Python learning website (PyLearner)

Updated 27 Nov 2026. Read this whole file before touching the project. It records the product direction, fixed stack, working agreement, status, and next phase.

---

## 1. Vision

A free website where anyone can learn Python from zero to advanced.

1. **Lessons:** a complete curriculum with quizzes, clear explanations, and runnable examples.
2. **Practice:** learners write Python in an editor and run it against hidden test cases in their browser.
3. **Clear failure feedback without AI: expected vs actual output for each failed test, plus a hand-written hint per test.**
4. **Local progress:** progress is saved in the browser without accounts or a server-side profile.

The tracks are **Python from zero** (50 lessons across 9 modules) and **CS50P** (10 lessons, one per week).

The owner, Kritik, prefers strict phase-by-phase work. Do not add features, pages, libraries, or refactors outside the current phase. If an improvement is not requested, list it as a suggestion rather than building it.

---

## 2. Fixed stack

- **Framework:** Next.js App Router + TypeScript + Tailwind CSS.
- **Code editor:** Monaco through `@monaco-editor/react`, loaded from a pinned HTTPS CDN only on routes that run code.
- **Execution:** Pyodide 0.26.4 (Python 3.12) in the browser using a Web Worker. Never execute learner code on the server.
- **Content:** lesson Markdown, quiz JSON, and problem JSON live under `/content`; pages that read them must be generated at build time.
- **Markdown:** `MarkdownView` is a custom renderer for lesson content. Do not add a third-party Markdown renderer.
- **Progress:** browser `localStorage`; no login or account service.

---

## 3. Working agreement

1. Work on one phase at a time and follow its acceptance list.
2. Before implementation, give a short plan naming the affected areas.
3. Keep code direct and preserve working behavior unless the phase explicitly changes it.
4. If visual or runtime behavior cannot be verified in a browser, say **needs human check**; never claim PASS without evidence.
5. Never commit secrets.
6. Lessons must follow `content/LESSON_STANDARD.md` and `content/CURRICULUM.md`.
7. The project owner commits; do not run git commands.

### How to run locally

```bash
export PATH="$HOME/.local/node/bin:$PATH"
npm run dev
```

Production builds run the CSS output guard automatically after Next.js finishes:

```bash
npm run build
```

Keep `package-lock.json` intact when installing across platforms. It includes the optional Linux x64 GNU packages for Tailwind Oxide and Lightning CSS that Vercel needs, even when the lockfile was generated on macOS.

```bash
LESSON_PYTHON="$HOME/Library/spyder-6/envs/spyder-runtime/bin/python3.12" python3 scripts/verify_lessons.py
node scripts/verify_in_pyodide.mjs
LESSON_PYTHON="$HOME/Library/spyder-6/envs/spyder-runtime/bin/python3.12" python3 scripts/verify_problems.py
npm run build
```

`verify_in_pyodide.mjs` also runs stdin self-tests by extracting and loading the same `PLAIN_RUNNER_PY` helper embedded in `public/pyodideWorker.js`.

The development server is normally available at `http://localhost:3000`. Both lesson verification commands must pass before lesson work is considered complete.

---

## 4. Visual identity

- **Typography:** Doto for headings and accent numbers; Hanken Grotesk for reading; JetBrains Mono for code and console output.
- **Colors:** paper `#F7F8FA` / dark `#0E1116`; ink `#111418` / dark `#F7F8FA`; Python yellow `#FFC832` for dots, active indicators, and focus rings. Do not use yellow text on white.
- **Status:** green for passing tests and red for failing tests.
- **Palette:** no blue accents.
- **Layout:** desktop lesson pages use a 220px contents rail and a reading column up to 70ch. Below 1024px the contents control stays in normal flow and collapses. Headings use scroll margin below the sticky navbar.

---

## 5. Current state and roadmap

| Phase | Description | Status |
|---|---|---|
| Foundation | Navigation, visual system, lesson and practice routes | Done |
| Browser runner | Monaco, Pyodide worker, hidden tests, timeout and result display | Done; plain-run stdin self-tested in Pyodide, browser behavior needs human check |
| Curriculum | 50 Python-from-zero lessons and 10 CS50P lessons with quizzes | 60 lessons verified on Python 3.12.11 and Pyodide 0.26.4 |
| F1 | Remove obsolete AI copy and routes, clean up, and make deployment-ready | Done; production build, lint, both lesson verifiers, static output and leak scans checked; browser checks need human check |
| F2 | Add more practice problems with hand-written hints and collapsed solutions | Done; 15 Advanced problems added |
| F3 | Save progress in the browser with localStorage, without login | Planned |
| F4 | Quality pass with real browser tests | Planned |
| F5 | Final deployment check | Planned |

---

## 6. Architecture map

- `app/`: App Router pages and route metadata.
- `components/`: navigation, custom Markdown, quiz, code editor, runner feedback, and visual elements.
- `content/lessons/<slug>/`: lesson Markdown and quiz JSON.
- `content/problems/`: problem definitions, public solution dropdown content, private reference solutions, wrong solutions, and test data. Only the `solution` field may reach the client; `referenceSolution` and `wrongSolutions` must never appear in client assets.
- `lib/lessons.ts`: lesson and curriculum file loader, used at build time for static routes.
- `lib/problems.ts`: problem data loader and public problem metadata.
- `public/pyodideWorker.js`: pinned Pyodide worker.
- `scripts/verify_lessons.py`: Python 3.12 lesson verification.
- `scripts/verify_problems.py`: Python 3.12 problem schema, solution, test, and distractor verification.
- `scripts/verify_in_pyodide.mjs`: lesson examples run through Pyodide 0.26.4.

---

## 7. Verification and deployment requirements

- `LESSON_PYTHON` selects the lesson verifier's interpreter; it must report Python 3.12.x.
- The verifier checks titles, sections, word counts, runnable outputs, error lines, and quiz schema.
- The Pyodide verifier checks browser-compatible lesson examples against Pyodide 0.26.4.
- Plain lesson and practice runs accept pre-entered stdin, one line per `input()` call; the worker prints input prompts and echoed lines as a terminal transcript. `run`/function and stdio test modes retain their existing behavior.
- Dynamic lesson and problem slugs must be enumerated at build time; content must not be read from `/content` at request time.
- Practice problem pages send the learner-facing `solution` object only. The `referenceSolution` and `wrongSolutions` fields stay server-side.
- After `npm run build`, verify the client asset leak scan with:

  ```bash
  if rg -n 'referenceSolution|wrongSolutions' .next/static; then
    echo "Problem answer leak found in client assets"
    exit 1
  else
    echo "No referenceSolution or wrongSolutions in client assets; solution is allowed"
  fi
  ```

- Production checks include clean install, build, lint, static route output, case-sensitive path checks, and confirming the client asset leak scan reports zero hits for `referenceSolution` and `wrongSolutions`. The public `solution` field is allowed.

---

## 8. Known issues and human checks

- Browser visual and runtime checks for page appearance, custom 404/error pages, offline/blocked CDN Retry, blank exercise editors, the collapsed practice solution disclosure, difficulty filter, related lesson links, failure hints, the conditional lesson Input box, practice stdin panel, terminal transcript, and Ctrl/Cmd+Enter shortcuts need human check. In this workspace, `npm run dev` could not bind to port 3000 (`EPERM`), so no browser preview was available.
- Visual checks remain for lesson contents layout at wide desktop, tablet, and mobile widths, and for light/dark active indicators.
- Set `NEXT_PUBLIC_SITE_URL` to the production domain before deployment; the local build currently uses its localhost fallback.
- Deployment domain and production environment settings must be confirmed by the owner before F5.

---

## 9. Next steps

1. Finish F1 cleanup and deploy-readiness.
2. F2: author more practice problems with a distinct hand-written hint for each test.
3. F3: save lesson/practice progress in localStorage without login.
4. F4: verify important flows in real browsers, including mobile and offline behavior.
5. F5: check the final deployment configuration and production build.
