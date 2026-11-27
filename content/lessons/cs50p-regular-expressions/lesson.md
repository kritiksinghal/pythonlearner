---
title: "Regular expressions"
curriculumTitle: "Regular expressions"
track: "CS50P"
module: "Week 7 Regular Expressions"
order: 8
level: "Beginner"
summary: "Describe text patterns with re and choose the right kind of match."
prerequisites:
  - "file-io"
learningGoals:
  - "Build patterns from character classes and repetition symbols"
  - "Choose between search, match, and fullmatch"
  - "Capture groups and extract or replace matching text"
  - "Use raw strings and flags where appropriate"
relatedProblems: []
---
## What you will learn

- What a regular expression describes
- How digits, word characters, character classes, and repetition symbols work
- How `re.search`, `re.match`, and `re.fullmatch` differ
- How groups, `findall`, `sub`, and flags support common text tasks
- Why pattern matches describe format but do not prove real-world validity

## Why this matters

Text often follows a recognizable shape: a code may have a fixed number of digits, a label may contain two parts separated by punctuation, or a sentence may have repeated spaces. A regular expression describes that shape compactly. The `re` module can then search, check, extract, or replace text according to the pattern. A pattern is useful only when it matches the intended scope: finding a piece inside a longer string is different from requiring the entire input to fit. A match can confirm the form you described, but it cannot establish every real-world fact about an email address or other value.

## The big idea

A regular expression (regex) is a small language for describing text patterns. A pattern combines literal characters such as `@` with special symbols such as `\d` for a digit and `+` for one or more repetitions. Use a raw string like `r"\d+"` so the backslash reaches the regex engine clearly.

The `re` module offers several match scopes. `search` looks anywhere in the text, `match` checks from the start, and `fullmatch` requires the whole text to fit. Groups in parentheses can capture pieces of a match, `findall` can return multiple matches, `sub` can replace matched text, and `IGNORECASE` can make a search ignore letter case.

## Step by step

### Match a fixed number of digits

The `\d` token means one digit, and `{3}` means exactly three repetitions. Use `fullmatch` when every character in the input must belong to that pattern.

```python run
import re

print(bool(re.fullmatch(r"\d{3}", "582")))
print(bool(re.fullmatch(r"\d{3}", "5821")))
```

```output
True
False
```

The first string has exactly three digits. The second has an extra character, so the whole string does not fit.

### Find a pattern anywhere in the text

`search` looks for a matching portion at any position. It can succeed even when other characters surround the match.

```python run
import re

found = re.search(r"\d{3}", "gate-582-open")
print(bool(found))
```

```output
True
```

The three digits occur inside the longer string. This is useful for finding a piece of text, but it is not sufficient when validating a complete input.

### Compare match scopes

`match` starts at the beginning, while `fullmatch` requires the entire text. The same pattern may succeed under one rule and fail under another.

```python run
import re

pattern = r"\d{2}"
print(bool(re.search(pattern, "x47z")))
print(bool(re.match(pattern, "47z")))
print(bool(re.fullmatch(pattern, "47z")))
```

```output
True
True
False
```

`search` finds the digits after the first character. `match` sees two digits at the start, but `fullmatch` rejects the trailing letter.

### Use a character class

Square brackets define a set of allowed characters for one position. `[ABC]` means one character selected from A, B, or C.

```python run
import re

print(bool(re.fullmatch(r"[ABC]\d", "B6")))
print(bool(re.fullmatch(r"[ABC]\d", "D6")))
```

```output
True
False
```

The first character must be one of the three listed letters, followed by a digit. `D` is not in the set, so that input fails.

### Match a range of letters

The range `[a-z]` represents one lowercase letter. Combine it with `+` when one or more such characters are allowed.

```python run
import re

print(bool(re.fullmatch(r"[a-z]+", "orchid")))
print(bool(re.fullmatch(r"[a-z]+", "Orchid")))
```

```output
True
False
```

The uppercase initial does not fit the lowercase-only range. A pattern should reflect the exact character range the program wants to accept.

### Distinguish repetition symbols

`*` means zero or more of the previous item, `+` means one or more, and `?` means zero or one. These symbols describe how many repetitions are allowed.

```python run
import re

for pattern in (r"ab*", r"ab+", r"ab?"):
    print(pattern, bool(re.fullmatch(pattern, "a")), bool(re.fullmatch(pattern, "ab")))
```

```output
ab* True True
ab+ False True
ab? True True
```

With only `a`, the `b*` and `b?` patterns can match because the `b` is optional in those counts. `b+` requires at least one `b`.

### Use a bounded repetition

`{m,n}` allows a range of repetition counts. Here the pattern accepts between two and four digits.

```python run
import re

for code in ["8", "81", "813", "8134", "81347"]:
    print(code, bool(re.fullmatch(r"\d{2,4}", code)))
```

```output
8 False
81 True
813 True
8134 True
81347 False
```

The endpoints are included in the allowed count. One digit is too few and five are too many.

### Match a literal period

A plain dot in a regex matches any character except a newline. Write `\.` when the pattern needs an actual period.

```python run
import re

print(bool(re.fullmatch(r"\w+\.org", "fieldnotes.org")))
print(bool(re.fullmatch(r"\w+\.org", "fieldnotesXorg")))
```

```output
True
False
```

The escaped dot accepts a period at that position. Without the backslash, the character could be something else.

### Combine pieces into a simple format

The pattern `\w+@\w+\.com` describes one or more word characters, an at sign, another word-character sequence, a period, and `com`.

```python run
import re

for address in ["stagecrew@lights.com", "stage crew@lights.com", "stagecrew@lights.org"]:
    result = "Valid format" if re.fullmatch(r"\w+@\w+\.com", address) else "Invalid format"
    print(result)
```

```output
Valid format
Invalid format
Invalid format
```

The space is not a word character, and the final suffix must be `.com`. This checks only the described format; it does not prove that an address is real or reachable.

### Capture two pieces with a group

Parentheses make groups. A successful match can return the text captured by those groups.

```python run
import re

match = re.fullmatch(r"(.+), (.+)", "Rao, Meera")
if match:
    surname, given_name = match.groups()
    print(given_name, surname)
```

```output
Meera Rao
```

The pattern captures the text before the comma and the text after it. The names are then printed in the opposite order.

### Find every matching number

`findall` returns each non-overlapping piece that matches the pattern. `\d+` means one or more digits.

```python run
import re

print(re.findall(r"\d+", "Table 14 has 8 seats in row 3"))
```

```output
['14', '8', '3']
```

Each group of consecutive digits becomes one item in the result list. The surrounding words are not returned because they do not match the pattern.

### Replace repeated whitespace

`sub` replaces each match with a replacement string. `\s+` matches a run of one or more whitespace characters.

```python run
import re

print(re.sub(r"\s+", " ", "Meet   near\tthe   arch"))
```

```output
Meet near the arch
```

The spaces and tab are replaced with one ordinary space. The replacement does not otherwise change the words.

### Ignore letter case

Pass `re.IGNORECASE` when uppercase and lowercase versions should be treated alike.

```python run
import re

print(bool(re.search(r"open", "Doors OPEN at six", re.IGNORECASE)))
```

```output
True
```

The text uses uppercase letters, but the flag makes the search case-insensitive.

### Anchor a pattern at both ends

The `^` and `$` symbols mark the start and end of text. Anchors make it clear that the pattern must not match only a substring.

```python run
import re

pattern = r"^\w+@[\w.]+$"
print(bool(re.fullmatch(pattern, "crew@lights.example")))
print(bool(re.fullmatch(pattern, "before crew@lights.example after")))
```

```output
True
False
```

The first string fits the pattern from beginning to end. The second has extra text around the address. `fullmatch` already requires the whole string, while anchors can also express boundaries in patterns used with other matching functions.

## What Python is doing behind the scenes

The `re` functions interpret the pattern and test it against the supplied text. `search` scans for a matching portion; `match` attempts from the beginning; `fullmatch` accepts only when the entire input is consumed by the pattern. Successful match functions return a match object, while a failed attempt returns `None`. Calling `bool` on either result makes a simple true-or-false display.

Special pattern symbols change how nearby characters are interpreted. A character class limits one position to a set, a repetition operator controls how many copies of the preceding item can appear, and parentheses capture parts of the match. Raw strings keep backslashes readable in Python source. A period needs escaping when it should mean a literal period rather than any character.

## Common mistakes

### Forgetting the raw string prefix

Patterns with backslashes are easier to write as raw strings such as `r"\d+"`. The raw prefix keeps the backslash available for the regex pattern.

### Using search to validate a whole value

`search` can succeed on a substring while unwanted text remains before or after it. Choose `fullmatch` when every character must satisfy the format.

### Using a dot for a literal period

A bare dot matches a broad character. Write `\.` when the pattern needs an actual period.

### Assuming format proves reality

A pattern can check whether text has a shape you describe. A match alone does not prove that an email or other real-world value exists or is valid in every sense.

### Making a pattern difficult to review

Build the pattern from small pieces and test representative inputs. A compact expression is less useful if it is too hard to see which part accepts or rejects a value.

Name the shape in plain language before adding symbols. For example, state “two digits, then one uppercase letter” and build each part separately. Try one example that should fit and one near miss that should fail. This makes it easier to tell whether the repetition count, character set, or match scope needs adjustment.

## Cheat sheet

| Pattern or function | Meaning |
|---|---|
| `\d` | A digit |
| `\w` | A letter, digit, or underscore |
| `\s` | Whitespace |
| `.` | Any character except newline |
| `+`, `*`, `?` | One-or-more, zero-or-more, zero-or-one |
| `{m,n}` | Between m and n repetitions |
| `[abc]` | One listed character |
| `(...)` | Capture a group |
| `re.search` | Find anywhere |
| `re.match` | Check from the start |
| `re.fullmatch` | Require the whole input |
| `re.findall` / `re.sub` | Find many / replace matches |

## Try it yourself

### Easy: check a short locker code

Use `locker_code` as the sample data. Require exactly four digits. Print the result exactly as shown in Expected output.


:::tip Hint
Use the lesson idea about cs50p regular expressions. Trace the sample values before printing so you can check each step.
:::

```sample input
locker_code = '6391'
```

```expected
True
False
```

```python run
# Complete the Easy: check a short locker code task.
locker_code = '6391'
# Write your code below
```


:::solution
The first code contains four digits. The second contains only three, so it does not fit the required shape.

```python
locker_code = '6391'
import re

print(bool(re.fullmatch(r"\d{4}", "6391")))
print(bool(re.fullmatch(r"\d{4}", "639")))
```
:::

### Medium: collect the set numbers

Use `match_line` as the sample data. Extract all digit groups from a line describing a match.


:::tip Hint
Use the lesson idea about cs50p regular expressions. Trace the sample values before printing so you can check each step.
:::

```sample input
match_line = 'Match 3-2, 6-1'
```

```expected
['2', '11', '3', '9']
```

```python run
# Complete the Medium: collect the set numbers task.
match_line = 'Match 3-2, 6-1'
# Write your code below
```


:::solution
`findall` returns each consecutive run of digits in order, including set numbers and point totals.

```python
match_line = 'Match 3-2, 6-1'
import re

print(re.findall(r"\d+", "Set 2: 11 points, set 3: 9 points"))
```
:::

### Challenge: change a roster name order

Use `roster_name` as the sample data. Capture a surname and given name separated by a comma, then print the given name first.


:::tip Hint
Use the lesson idea about cs50p regular expressions. Trace the sample values before printing so you can check each step.
:::

```sample input
roster_name = "Das, Kabir"
```

```expected
Kabir Das
```

```python run
# Complete the Challenge: change a roster name order task.
roster_name = "Das, Kabir"
# Write your code below
```


:::solution
The two groups capture the text on either side of the comma. Printing them in reverse order changes the display while preserving both pieces.

```python
roster_name = "Das, Kabir"
import re

match = re.fullmatch(r"(.+), (.+)", "Das, Kabir")
if match:
    family_name, first_name = match.groups()
    print(first_name, family_name)
else:
    print("Use surname, given name")
```
:::

## Recap

- Regex patterns describe text shape with literal characters, classes, and repetition.
- Use raw strings to keep backslashes readable and escape a dot when it must be literal.
- Choose `search`, `match`, or `fullmatch` based on how much of the text must fit.
- Groups extract pieces, `findall` collects matches, and `sub` replaces them.
- A format match does not prove that a real-world value is genuine.

Based on Harvard's CS50P
Reference: Python documentation, Regular Expression HOWTO
