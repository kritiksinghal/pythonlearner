# Problems

This folder contains coding problems as JSON files. Each problem includes a
description, starter code, a public dropdown solution, and hidden test cases.

## Content rules

1. **Tracks** — Every problem file must include a `track` field. The first two tracks are `"Python from zero"` and `"CS50P"`.
2. **Test type** — Every problem must have a `testType` field set to one of:
   - `"function"` — call a function and compare the return value.
   - `"stdio"` — feed text to `input()` and compare what is printed.
3. **Solutions** — `solution` contains the learner-facing code and explanation.
   Keep `referenceSolution` and `wrongSolutions` server-side for verification;
   never include either field in public problem metadata or client assets.
4. **Advanced problems** — Include 12-15 tests, a `hint` on every test, and a
   non-empty `relatedLessons` array. Include two or three `wrongSolutions` that
   fail at least one test each.
