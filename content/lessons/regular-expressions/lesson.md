---
title: "Regular expressions"
curriculumTitle: "Regular expressions"
track: "Python from zero"
module: "M8 Advanced"
order: 43
level: "Advanced"
summary: "Use Python's re module to search, validate, capture, and replace text patterns."
prerequisites:
  - "Testing your code (assert and unittest)"
learningGoals:
  - "Write a regular expression for a simple text pattern"
  - "Choose search, match, or fullmatch for the task"
  - "Use character classes, quantifiers, and capture groups"
  - "Replace or find repeated matches with the re module"
relatedProblems: []
---
## What you will learn

- What a **regular expression** describes
- How `re.search()` finds a pattern within text
- How character classes and quantifiers express repeated characters
- How capture groups retrieve parts of a match
- When to use `fullmatch()`, `findall()`, and `sub()`

## Why this matters

Text often follows a pattern without being identical: a code may contain a fixed prefix and digits, or a message may include several numbers. Checking each character manually can make the program long and fragile. A regular expression gives the `re` module a compact description of what to find. It is useful for search and validation, as long as the pattern remains clear to the next reader.

## The big idea

Think of a regular expression as a stencil for text. The stencil describes which characters fit and how many are allowed; the `re` module slides it over text to find a match. A pattern can describe literal characters, a category such as digits, or a repeated sequence.

A **regular expression** (often called a regex) is a string that describes a text pattern. Python's `re` module provides functions for matching these patterns. Prefix patterns with `r` to make a raw string, which avoids having Python treat backslashes as string escape sequences before the regex engine sees them.

## Step by step

### Search for literal text

`re.search()` scans through a string and returns a match object for the first place a pattern occurs. If no match exists, it returns `None`.

```python run
import re

message = "The ferry leaves at 6:20 from Pier 4"
match = re.search(r"ferry", message)
print(match.group())
print(match.start())
```

```output
ferry
4
```

The pattern contains only literal letters, so it finds the first occurrence of `ferry`. The match object stores the matched text and its position. `start()` returns the starting character index.

### Match any digit with `\d`

The pattern `\d` represents a digit. Add a quantifier to specify how many digits to find.

```python run
import re

text = "Gate B12 opens at 18:45"
match = re.search(r"\d\d", text)
print(match.group())
```

```output
12
```

The first two consecutive digits are `12`. A regular expression finds the leftmost matching part by default. Use a more precise pattern when you want a complete code or number.

### Require a repeated character with `+`

The `+` quantifier means one or more repetitions of the preceding item. Here it finds a sequence of digits rather than exactly two.

```python run
import re

receipt = "Order 48271 confirmed"
match = re.search(r"\d+", receipt)
print(match.group())
```

```output
48271
```

The pattern `\d+` matches the longest available run of digits at the first matching position. `*` means zero or more, while `?` makes the preceding item optional.

### Use a character class

Square brackets define a character class: a match can use any one character listed inside. A hyphen can specify a range, such as `A-Z` for uppercase English letters.

```python run
import re

code = "M7"
match = re.fullmatch(r"[A-Z]\d", code)
print(match is not None)
```

```output
True
```

The pattern requires one uppercase letter followed by one digit, and `fullmatch()` requires the entire string to fit. If the code were `M72`, the extra digit would make full matching fail.

### Validate a complete string

Use `re.fullmatch()` when every character in the input must fit your pattern. This is often clearer than using start and end markers in a search expression.

```python run
import re

seat_code = "C14"
valid = re.fullmatch(r"[A-Z]\d{2}", seat_code)
print(valid is not None)
```

```output
True
```

`\d{2}` means exactly two digits. The full string must be one uppercase letter followed by those two digits. For user input, explain the expected format before rejecting a value.

### Capture part of a match

Parentheses create a capture group. The match object can return that part separately from the full match.

```python run
import re

line = "Room: 204"
match = re.search(r"Room: (\d+)", line)
print(match.group())
print(match.group(1))
```

```output
Room: 204
204
```

`group()` without a number returns the whole matched phrase. `group(1)` returns the first parenthesized part. Groups are numbered from one in order of their opening parentheses.

### Capture several fields

Use multiple capture groups when you want different pieces of a structured string.

```python run
import re

record = "Mina scored 38 runs"
match = re.fullmatch(r"([A-Za-z]+) scored (\d+) runs", record)
print(match.group(1))
print(match.group(2))
```

```output
Mina
38
```

The first group captures a name made of letters, and the second captures digits. A real name may include spaces, apostrophes, or accented characters, so do not treat this deliberately small pattern as universal name validation.

### Find every match

`re.findall()` returns all non-overlapping matches as a list. If the pattern has capture groups, the returned list contains group values instead of full match strings.

```python run
import re

report = "Rain: 8 mm; wind: 14 km/h; cloud: 62 percent"
print(re.findall(r"\d+", report))
```

```output
['8', '14', '62']
```

The strings look numeric, but they are still text. Convert them with `int()` before arithmetic. For large text processed incrementally, `finditer()` returns match objects one at a time.

### Replace matching text

`re.sub()` returns a new string with each matching part replaced. It does not change the original string because strings are immutable.

```python run
import re

message = "Call 555-0134 after 555-0188"
hidden = re.sub(r"\d", "X", message)
print(hidden)
```

```output
Call XXX-XXXX after XXX-XXXX
```

The pattern matches each digit independently, and the replacement inserts `X` for each one. You could limit the number of replacements with the `count` argument when only the first matches should change.

### Use a named capture group

Named groups make patterns easier to read when the captured pieces have meaningful roles.

```python run
import re

entry = "score=76"
match = re.fullmatch(r"score=(?P<points>\d+)", entry)
print(match.group("points"))
```

```output
76
```

The group name `points` describes the captured digits. Named groups can help when a pattern has several parts and numeric group positions would be easy to confuse.

### Ignore letter case when appropriate

Pass `re.IGNORECASE` when uppercase and lowercase letters should be treated as equivalent for a search.

```python run
import re

headline = "New Album Arrives Friday"
match = re.search(r"album", headline, re.IGNORECASE)
print(match.group())
```

```output
Album
```

The returned text preserves the capitalization from the original string. The flag changes how the pattern matches; it does not rewrite the input.

### Escape a character that has regex meaning

Some characters, such as a period, have special meaning in patterns. Use `re.escape()` when you need to match text supplied literally.

```python run
import re

nickname = "R.J."
pattern = re.escape(nickname)
print(re.fullmatch(pattern, "R.J.") is not None)
```

```output
True
```

Without escaping, each period means “any character” in a regular expression. Escaping turns them into literal periods so the nickname is matched exactly.

## What Python is doing behind the scenes

Python first parses the pattern string, then the regular expression engine interprets the pattern. A raw string such as `r"\d+"` keeps the backslash for the regex engine. The engine searches from left to right unless an operation such as `fullmatch()` requires the entire input to match.

Successful operations return a match object that contains the full match, capture groups, and character positions. `search()` and `match()` return either a match object or `None`; `fullmatch()` also returns a match object only when the entire string fits. `findall()` and `sub()` return new values rather than altering the original string.

| Pattern part | Meaning | Example |
|---|---|---|
| `\d` | A digit | `\d+` matches one or more digits |
| `[A-Z]` | One uppercase ASCII letter | `[A-Z]\d` |
| `+` | One or more of previous item | `\d+` |
| `*` | Zero or more of previous item | `colou*r` |
| `{m}` | Exactly m repetitions | `\d{4}` |
| `( ... )` | Capture a group | `Room: (\d+)` |
| `(?P<name>...)` | Named capture | `(?P<year>\d{4})` |

Regular expressions can become difficult to maintain when they combine many nested alternatives and optional pieces. Build a pattern in small steps, name groups, and add tests for representative inputs. For complicated structured formats such as JSON or CSV, use a parser designed for that format instead of a regex.

When a pattern is shared across multiple calls, you can compile it with `re.compile()` and then call methods on the compiled pattern. This can make repeated use clearer by keeping the pattern in one named variable. For a single, simple check, a direct call such as `re.search()` is usually easy to read.

## Common mistakes

### Use `search()` when the whole value must be valid

`search()` succeeds if a match appears anywhere inside the text. Use `fullmatch()` when no extra characters should remain before or after the pattern.

### Forget that a match can be `None`

If no substring fits, `search()` returns `None`. Check that the match exists before calling `.group()` or reading its positions.

### Forget to make a pattern raw

Backslashes can be interpreted by Python's string parser first. Use a raw string such as `r"\d+"` for most regex patterns so the regex engine receives the intended backslashes.

### Match a partial number

The pattern `\d\d` finds two digits inside a longer number. Use `\d+` for a run or `fullmatch()` with a precise width when the entire string should be a number.

### Use regex to parse a structured format

Nested or quoted formats have rules that are easy to miss with a pattern. Use `json` for JSON and `csv` for CSV; those formats are covered in **JSON and CSV**.

## Cheat sheet

| Goal | Function or pattern |
|---|---|
| Search anywhere | `re.search(pattern, text)` |
| Match at beginning | `re.match(pattern, text)` |
| Require entire string | `re.fullmatch(pattern, text)` |
| Find many matches | `re.findall(pattern, text)` |
| Replace matches | `re.sub(pattern, replacement, text)` |
| Capture a piece | `(pattern)` or `(?P<label>pattern)` |
| Treat pattern literally | `re.escape(text)` |
| Ignore case | `re.IGNORECASE` |

## Try it yourself

### Easy: find digits

Use `message` as the sample data. Use a regex to find the first group of digits in a message. Print the result exactly as shown in Expected output.


:::tip Hint
Use the lesson idea about regular expressions. Trace the sample values before printing so you can check each step.
:::

```sample input
message = 'Level 27 unlocked'
```

```expected
27
```

```python run
# Complete the Easy: find digits task.
message = 'Level 27 unlocked'
# Write your code below
```


:::solution
`\d+` matches a run of one or more digits, and `group()` returns the matched text.

```python
message = 'Level 27 unlocked'
import re

message = "Level 27 unlocked"
match = re.search(r"\d+", message)
print(match.group())
```
:::

### Medium: validate a room code

Use `room_code` as the sample data. Check that a code is one uppercase letter followed by two digits. Print the result exactly as shown in Expected output.


:::tip Hint
Use the lesson idea about regular expressions. Trace the sample values before printing so you can check each step.
:::

```sample input
room_code = 'A42'
```

```expected
True
```

```python run
# Complete the Medium: validate a room code task.
room_code = 'A42'
# Write your code below
```


:::solution
The character class accepts one uppercase letter, and `\d{2}` requires exactly two digits. fullmatch rejects extra characters.

```python
room_code = 'A42'
import re

print(re.fullmatch(r"[A-Z]\d{2}", "H08") is not None)
```
:::

### Challenge: capture a time

Use `time_text` as the sample data. Capture the hour and minute from a string in `HH:MM` form. Print the result exactly as shown in Expected output.


:::tip Hint
Use the lesson idea about regular expressions. Trace the sample values before printing so you can check each step.
:::

```sample input
time_text = "07:35"
```

```expected
07
35
```

```python run
# Complete the Challenge: capture a time task.
time_text = "07:35"
# Write your code below
```


:::solution
Named groups capture each two-digit part. The fullmatch requires the whole text to fit the pattern.

```python
time_text = "07:35"
import re

match = re.fullmatch(r"(?P<hour>\d{2}):(?P<minute>\d{2})", "07:35")
print(match.group("hour"))
print(match.group("minute"))
```
:::

## Recap

- A regular expression describes a pattern that the `re` module can find in text.
- Use raw string patterns so backslashes reach the regex engine clearly.
- Choose `search`, `fullmatch`, `findall`, or `sub` based on the task.
- Capture groups retrieve fields from a matched string.
- Use a dedicated parser for structured formats instead of a complex regex.

Reference: Python documentation, Regular Expression HOWTO
