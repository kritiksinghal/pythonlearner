import os
import json
import subprocess

slug = "text-strings"
lesson_dir = f"content/lessons/{slug}"
os.makedirs(lesson_dir, exist_ok=True)

def run_py(code):
    res = subprocess.run(["python3", "-c", code], capture_output=True, text=True)
    if res.returncode != 0:
        raise RuntimeError(f"Code failed:\n{code}\nError: {res.stderr}")
    return res.stdout.rstrip()

def run_err(code):
    res = subprocess.run(["python3", "-c", code], capture_output=True, text=True)
    return res.stderr.strip()

c1 = """single_quoted = 'Python language'
double_quoted = "Data science"
multi_line_text = '''Line one: Introduction
Line two: Methods
Line three: Conclusion'''
print(single_quoted)
print(double_quoted)
print(multi_line_text)"""
o1 = run_py(c1)

c2 = """first_name = 'Ada'
last_name = 'Lovelace'
full_name = first_name + ' ' + last_name
divider = '=' * 20
print(divider)
print('Programmer:', full_name)
print('Total characters:', len(full_name))
print(divider)"""
o2 = run_py(c2)

c3 = """headline = '  the cricket match final in mumbai  '
cleaned_headline = headline.strip().title()
shouting = cleaned_headline.upper()
print('Original:', repr(headline))
print('Cleaned:', cleaned_headline)
print('Shouting:', shouting)"""
o3 = run_py(c3)

c4 = """user_email = 'student.help@domain.org'
print('Starts with student:', user_email.startswith('student'))
print('Ends with .org:', user_email.endswith('.org'))
print('Count of dot characters:', user_email.count('.'))
print('Index of @ symbol:', user_email.find('@'))"""
o4 = run_py(c4)

c5 = """raw_phone = '987-654-3210'
standardized_phone = raw_phone.replace('-', '')
print('Original phone:', raw_phone)
print('Cleaned digits:', standardized_phone)
print('Are all characters digits?', standardized_phone.isdigit())"""
o5 = run_py(c5)

c6 = """raw_input_code = 'alpha99'
alpha_only = 'Antigravity'
numeric_only = '2026'
print(raw_input_code, 'is alphanumeric:', raw_input_code.isalnum())
print(alpha_only, 'is pure alphabetic:', alpha_only.isalpha())
print(numeric_only, 'is pure numeric:', numeric_only.isdigit())"""
o6 = run_py(c6)

c7 = """song_title = 'bohemian rhapsody'
first_word_cap = song_title.capitalize()
swapped = song_title.title().swapcase()
print('Capitalize only first letter:', first_word_cap)
print('Swap case:', swapped)"""
o7 = run_py(c7)

c8 = """filename = 'financial_report_q3.PDF'
lower_filename = filename.lower()
is_pdf_document = lower_filename.endswith('.pdf')
print('Standardized filename:', lower_filename)
print('Is verified PDF format:', is_pdf_document)"""
o8 = run_py(c8)

c_ex1 = """raw_author = '   arundhati roy   '
clean_author = raw_author.strip().title()
print('Sanitized author name:', clean_author)"""
o_ex1 = run_py(c_ex1)

c_ex2 = """raw_card = '4532-8901-2345-9876'
digits_only = raw_card.replace('-', '')
masked_card = '*' * 12 + digits_only[12:]
print('Masked account number:', masked_card)"""
o_ex2 = run_py(c_ex2)

c_ex3 = """paragraph = 'Python is powerful. Python is fast. Python is friendly.'
target_word = 'Python'
occurrences = paragraph.count(target_word)
replaced_text = paragraph.replace(target_word, 'Snake', 2)
print('Occurrences of Python:', occurrences)
print('Replaced first two:', replaced_text)"""
o_ex3 = run_py(c_ex3)

err1 = run_err("greeting = 'Hello'; greeting[0] = 'J'")
err2 = run_err("score = 98; msg = 'Score: ' + score")
err3 = run_err("s = 'Python'; idx = s.index('missing')")

content = f"""---
title: "Text (strings)"
curriculumTitle: "Text (strings)"
track: "Python from zero"
module: "M1 Getting started"
order: 5
level: "Beginner"
summary: "Master Python text processing: create multi-line strings, understand sequence immutability, measure lengths, and transform text using essential built-in string methods."
prerequisites:
  - "what-is-programming-and-python"
  - "your-first-program-with-print"
  - "variables-and-types"
  - "numbers-and-math"
learningGoals:
  - "Declare single-line and multi-line string literals using single, double, and triple quotes."
  - "Explain the concept of string immutability and why text cannot be altered in-place in memory."
  - "Calculate string lengths using `len()` and concatenate strings using `+` and `*`."
  - "Apply core transformation and inspection methods including `.upper()`, `.lower()`, `.strip()`, `.replace()`, `.find()`, and `.count()`."
relatedProblems: []
---

## What you will learn

- How Python defines textual data as ordered sequences of Unicode characters (**strings**).
- When to employ triple-quoted strings for multi-line documentation and complex blocks of text.
- Why Python strings are strictly **immutable** and how all string methods return fresh copies rather than modifying the original object.
- Measuring string size and character boundaries using the built-in `len()` function.
- Cleaning user input by trimming unwanted surrounding whitespace with `.strip()`, `.lstrip()`, and `.rstrip()`.
- Transforming text casing using `.upper()`, `.lower()`, `.title()`, and `.capitalize()`.
- Searching, counting, and substituting character patterns using `.find()`, `.count()`, and `.replace()`.
- Inspecting string characteristics using Boolean predicates like `.startswith()`, `.endswith()`, `.isalpha()`, and `.isdigit()`.

## Why this matters

The vast majority of data transferred across the modern internet is textual: customer usernames, email messages, JSON API payloads, database query records, sensor logs, and website articles. Without robust text manipulation skills, your software cannot clean messy user input, validate phone numbers, search search logs for error codes, or format financial reports. In Python, strings are first-class objects equipped with dozens of powerful built-in methods that allow you to sanitize, filter, analyze, and reshape text with concise, readable expressions.

## The big idea

Imagine a classic set of wooden letter printing blocks used in vintage letterpress printing. When you arrange wooden blocks on a tray to spell the word `"PYTHON"`, you have created a physical string of characters. If you want to change that text to uppercase `"PYTHON ROCKS"`, you cannot melt or redraw the wooden blocks currently sitting on the tray. Instead, you leave the original arrangement intact, select a fresh set of blocks from your workshop drawer, and assemble a brand-new tray containing the new text.

In Python, this property is known as **immutability**. Once a string is created in computer memory, its individual characters can never be mutated, deleted, or replaced in-place. Whenever you call a string method—such as `.upper()`, `.strip()`, or `.replace()`—Python does not alter the original string in memory. Instead, Python allocates fresh memory, builds a brand-new string containing the transformed characters, and returns that new string to you. Understanding immutability eliminates an entire class of subtle memory corruption bugs.

## Step by step

### 1. Declaring single-line and multi-line strings

Python offers three flexible ways to declare string literals: single quotes `'...'`, double quotes `"..."`, and triple quotes `'''...'''` or `\"\"\"...\"\"\"`. Triple-quoted strings preserve literal line breaks and internal quotes without requiring escape characters.

```python run
{c1}
```

```output
{o1}
```

Lines 1 and 2 define single-line strings using single and double quotes. Line 3 defines `multi_line_text` using triple quotes. When printed on line 8, Python preserves every newline character exactly as formatted in the source code.

### 2. Concatenation, repetition, and the `len()` function

Strings can be joined using the concatenation operator `+` and multiplied using the repetition operator `*`. The built-in `len()` function returns the total number of characters in the string, including spaces, punctuation, and escape codes.

```python run
{c2}
```

```output
{o2}
```

Line 3 joins `first_name`, a space literal `' '`, and `last_name` into a single unified string `'Ada Lovelace'`. Line 4 duplicates the `'='` character twenty times. On line 7, `len(full_name)` counts the characters, correctly returning `12` (three letters for Ada, one space, and eight letters for Lovelace).

### 3. Cleaning whitespace and adjusting letter casing

Raw input entered by human users frequently contains accidental leading or trailing spaces. The `.strip()` method removes whitespace from both ends, while case transformation methods adjust letter capitalization:
- `.strip()`: Strips whitespace (spaces, tabs, newlines) from both ends.
- `.title()`: Capitalizes the first letter of every word.
- `.upper()`: Converts all alphabetic characters to uppercase.
- `.lower()`: Converts all alphabetic characters to lowercase.

```python run
{c3}
```

```output
{o3}
```

Line 2 chains `.strip()` and `.title()` together in a single statement. The `.strip()` call trims the outer spaces, and `.title()` capitalizes each word, producing `'The Cricket Match Final In Mumbai'`. Line 3 converts the cleaned string to full uppercase `'THE CRICKET MATCH FINAL IN MUMBAI'`.

### 4. Inspecting string prefixes, suffixes, and frequencies

Python provides intuitive inspection methods that return Boolean states (`True` or `False`) or numerical counts:
- `.startswith(prefix)`: Returns `True` if the string begins with the specified substring.
- `.endswith(suffix)`: Returns `True` if the string terminates with the specified substring.
- `.count(substring)`: Returns the integer count of non-overlapping occurrences.
- `.find(substring)`: Returns the lowest zero-based index where the substring is located, or `-1` if not found.

```python run
{c4}
```

```output
{o4}
```

Lines 2 and 3 verify that `user_email` begins with `'student'` and terminates with `'.org'`. Line 4 counts how many periods exist (`2`). Line 5 locates the `@` symbol at zero-based index `12`.

### 5. Replacing characters with `.replace()`

The `.replace(old, new)` method searches a string for all occurrences of the substring `old` and replaces them with `new`, returning a fresh string.

```python run
{c5}
```

```output
{o5}
```

Line 2 replaces every hyphen `'-'` in the phone number with an empty string `''`, stripping the delimiters. Line 5 calls `.isdigit()` on the resulting string `'9876543210'`, returning `True` because every remaining character is a numerical digit.

### 6. Validating character categories with Boolean predicates

Python offers a family of character-inspection methods:
- `.isalnum()`: `True` if all characters are letters or numbers (no spaces or symbols).
- `.isalpha()`: `True` if all characters are strictly alphabetic letters.
- `.isdigit()`: `True` if all characters are digits `0-9`.
- `.isspace()`: `True` if the string contains only whitespace characters.

```python run
{c6}
```

```output
{o6}
```

Line 4 verifies that `'alpha99'` is alphanumeric (`True`). Line 5 checks `'Antigravity'` for purely alphabetic characters (`True`). Line 6 checks `'2026'` for numeric digits (`True`).

### 7. Specialized casing: `.capitalize()` and `.swapcase()`

Beyond `.upper()` and `.title()`, Python provides `.capitalize()` (capitalizes only the very first character of the entire string, making all remaining letters lowercase) and `.swapcase()` (inverts case for every character).

```python run
{c7}
```

```output
{o7}
```

Line 2 capitalizes the first letter `'B'` of `'bohemian rhapsody'`, leaving `'rhapsody'` lowercase. Line 3 takes the title-cased version and swaps every uppercase letter to lowercase and vice versa.

### 8. Case-insensitive comparison and file extension validation

Because Python is strictly case-sensitive, comparing `'REPORT.PDF'` to `'.pdf'` evaluates to `False`. Professional code normalizes strings with `.lower()` before validating suffixes or matching commands.

```python run
{c8}
```

```output
{o8}
```

Line 2 normalizes `'financial_report_q3.PDF'` to lowercase `'financial_report_q3.pdf'`. Line 3 checks `.endswith('.pdf')`, safely returning `True` regardless of whether the original file extension was entered in uppercase, lowercase, or mixed case.

## What Python is doing behind the scenes

Under the hood, CPython represents strings using the **`PyUnicodeObject`** structure. Python 3 strings are sequences of Unicode code points capable of representing any language, emoji, or symbol in human history:

| Unicode Representation | How Python Allocates Memory |
| :--- | :--- |
| **Latin-1 (1 byte / char)** | Strings containing only ASCII / Latin characters (e.g. `'Hello'`) allocate 1 byte per character to minimize RAM usage. |
| **UCS-2 (2 bytes / char)** | Strings containing characters from languages like Greek, Cyrillic, or Arabic allocate 2 bytes per character. |
| **UCS-4 (4 bytes / char)** | Strings containing complex scripts, mathematical symbols, or emoji (e.g. `'🐍'`) allocate 4 bytes per character. |

Because strings are **immutable**, Python frequently employs **string interning** behind the scenes. When identical short string literals appear multiple times across your program, Python stores only a single copy in memory and points multiple variable identifiers to the exact same memory address.

## Common mistakes

### 1. Attempting to modify a character in place

Because strings are immutable, attempting to assign a new character to a string index raises a `TypeError`.

Broken code:
```python
greeting = 'Hello'
greeting[0] = 'J'
```

Real error message:
```output
{err1}
```

How to fix it: construct a new string using concatenation or slicing (covered in depth in the slicing lesson):
```python run
greeting = "Hello"
new_greeting = "J" + greeting[1:]
print("Reconstructed greeting:", new_greeting)
```

```output
Reconstructed greeting: Jello
```

### 2. Forgetting that string methods do not modify in-place

Because strings are immutable, calling a method like `.strip()` or `.upper()` returns a new string. If you do not assign the result back to a variable, the transformed value is discarded.

Broken code:
```python
city = "  new york  "
city.strip()
print("City:", city)
```

Actual output:
```output
City:   new york  
```

How to fix it: assign the return value back to the variable:
```python run
city = "  new york  "
city = city.strip()
print("Cleaned city:", city)
```

```output
Cleaned city: new york
```

### 3. Concatenating strings with non-string data types

Attempting to concatenate an integer or float directly to a string using `+` raises a `TypeError`.

Broken code:
```python
score = 98
msg = 'Score: ' + score
```

Real error message:
```output
{err2}
```

How to fix it: convert the number to text explicitly using `str()`, or use f-strings (covered in the upcoming input and f-strings lesson):
```python run
score = 98
msg = "Score: " + str(score)
print(msg)
```

```output
Score: 98
```

## Cheat sheet

| Method / Operator | Code Example | Return Value | Description |
| :--- | :--- | :--- | :--- |
| **Length** | `len("Python")` | `6` | Total character count |
| **Concatenate** | `"Py" + "thon"` | `"Python"` | Joins two strings |
| **Repeat** | `"Hi" * 3` | `"HiHiHi"` | Repeats string $n$ times |
| **Strip whitespace** | `" text ".strip()` | `"text"` | Trims outer whitespace |
| **Uppercase** | `"code".upper()` | `"CODE"` | Converts all letters to upper |
| **Lowercase** | `"CODE".lower()` | `"code"` | Converts all letters to lower |
| **Title case** | `"data science".title()` | `"Data Science"` | Capitalizes each word |
| **Replace** | `"a-b".replace("-", ":")` | `"a:b"` | Substitutes substrings |
| **Prefix check** | `"file.py".startswith("file")` | `True` | Checks starting substring |
| **Suffix check** | `"file.py".endswith(".py")` | `True` | Checks ending substring |
| **Count** | `"banana".count("a")` | `3` | Counts occurrences |
| **Find index** | `"hello".find("l")` | `2` | Zero-based index (or -1) |

## Try it yourself

### Exercise 1 (easy): Clean and standardize author name

A book catalog database received the messy string `raw_author = '   arundhati roy   '`. Write a script that removes all leading and trailing whitespace and transforms the name into proper title casing (`'Arundhati Roy'`), then prints the result.

```python run
raw_author = '   arundhati roy   '
clean_author = raw_author.strip().title()
print('Sanitized author name:', clean_author)
```

:::solution Solution
Chain the `.strip()` method to remove the outer whitespace and `.title()` to capitalize both the first and last names:

```python run
{c_ex1}
```
:::

### Exercise 2 (medium): Masking payment card digits

To protect customer privacy, an e-commerce checkout screen must display only the final four digits of a payment card number, replacing all preceding digits with asterisks. Given `raw_card = '4532-8901-2345-9876'`, remove the hyphens and generate a masked string showing 12 asterisks followed by the last 4 digits (`'************9876'`).

```python run
raw_card = '4532-8901-2345-9876'
digits_only = raw_card.replace('-', '')
masked_card = '*' * 12 + digits_only[12:]
print('Masked account number:', masked_card)
```

:::solution Solution
Use `.replace('-', '')` to remove hyphens, then combine `'*' * 12` with the final four digits extracted via slice `[12:]`:

```python run
{c_ex2}
```
:::

### Exercise 3 (challenge): Word frequency and selective replacement

Given the passage `paragraph = 'Python is powerful. Python is fast. Python is friendly.'`, count how many times the word `'Python'` appears. Then, use `.replace(old, new, count)` to substitute only the first two occurrences of `'Python'` with `'Snake'`, leaving the third occurrence unchanged. Print both the count and the transformed text.

```python run
paragraph = 'Python is powerful. Python is fast. Python is friendly.'
target_word = 'Python'
occurrences = paragraph.count(target_word)
replaced_text = paragraph.replace(target_word, 'Snake', 2)
print('Occurrences of Python:', occurrences)
print('Replaced first two:', replaced_text)
```

:::solution Solution
Pass `target_word` to `.count()` to determine frequency, and pass the optional third argument `2` to `.replace()` to restrict replacement to the first two occurrences:

```python run
{c_ex3}
```
:::

## Recap

- Strings are ordered, **immutable** sequences of Unicode characters in Python.
- Multi-line strings can be declared using triple quotes (`'''` or `\"\"\"`).
- The `len()` function calculates the total character count of any string.
- String methods never mutate the original string in memory; they always return a fresh transformed string.
- Methods like `.strip()`, `.upper()`, `.lower()`, and `.title()` handle text cleaning and capitalization.
- Inspection methods like `.startswith()`, `.endswith()`, `.isalpha()`, and `.isdigit()` return Boolean indicators.

Reference: Python documentation, Text Sequence Type — str
"""

with open(f"{lesson_dir}/lesson.md", "w", encoding="utf-8") as f:
    f.write(content)

quiz = [
    {
        "question": "What does it mean that Python strings are 'immutable'?",
        "options": [
            "Strings cannot be printed to the screen.",
            "Once created, the individual characters of a string cannot be changed or replaced in-place in memory.",
            "Strings can only contain alphabetic letters and cannot hold numbers.",
            "Strings are automatically erased from memory after five seconds."
        ],
        "correctIndex": 1,
        "explanation": "Immutability means that a string object in memory cannot be altered after creation. Any method or operation that appears to modify a string (such as `.replace()` or `.upper()`) actually creates and returns a brand-new string."
    },
    {
        "question": "What is the return value of `len('Data Science')`?",
        "options": [
            "11",
            "12",
            "10",
            "2"
        ],
        "correctIndex": 1,
        "explanation": "`'Data'` has 4 characters, `'Science'` has 7 characters, and the space between them counts as 1 character. 4 + 1 + 7 = 12 characters total."
    },
    {
        "question": "What will `text = '  python  '; text.strip()` leave as the value of `text`?",
        "options": [
            "'python'",
            "'  python  '",
            "'PYTHON'",
            "None"
        ],
        "correctIndex": 1,
        "explanation": "Because strings are immutable, `text.strip()` returns `'python'`, but does not modify the variable `text`. Without reassignment (`text = text.strip()`), `text` retains its original untrimmed value `'  python  '`."
    },
    {
        "question": "What does the expression `'2026'.isdigit()` return?",
        "options": [
            "True",
            "False",
            "2026",
            "TypeError"
        ],
        "correctIndex": 0,
        "explanation": "The `.isdigit()` method returns `True` if every character in the string is a numerical digit (0 through 9) and the string is not empty."
    },
    {
        "question": "What does the method call `'database_dump.sql'.endswith('.sql')` return?",
        "options": [
            "'.sql'",
            "True",
            "False",
            "14"
        ],
        "correctIndex": 1,
        "explanation": "The `.endswith()` method returns a Boolean `True` if the string terminates with the specified suffix, and `False` otherwise."
    },
    {
        "question": "What output is produced by evaluating `'Mississippi'.count('s')`?",
        "options": [
            "2",
            "4",
            "3",
            "1"
        ],
        "correctIndex": 1,
        "explanation": "The letter `'s'` appears exactly 4 times in `'Mississippi'` (two pairs of double 's')."
    },
    {
        "question": "What will `'hello'.find('z')` return?",
        "options": [
            "0",
            "-1",
            "False",
            "ValueError: substring not found"
        ],
        "correctIndex": 1,
        "explanation": "The `.find()` method returns `-1` when the target substring does not exist within the string. (In contrast, `.index()` raises a ValueError)."
    },
    {
        "question": "What happens if you run the statement `'Hello'[0] = 'h'`?",
        "options": [
            "The first letter is replaced with 'h', producing 'hello'.",
            "Python raises a `TypeError: 'str' object does not support item assignment`.",
            "Python duplicates the string.",
            "Python converts the string to an integer."
        ],
        "correctIndex": 1,
        "explanation": "Because Python strings are immutable, attempting to overwrite an index using item assignment raises a `TypeError`."
    },
    {
        "question": "Which method capitalizes the first letter of every word in a title string?",
        "options": [
            ".capitalize()",
            ".upper()",
            ".title()",
            ".toTitleCase()"
        ],
        "correctIndex": 2,
        "explanation": "The `.title()` method capitalizes the first letter of each word in the string. In contrast, `.capitalize()` only capitalizes the very first letter of the entire string."
    }
]

with open(f"{lesson_dir}/quiz.json", "w", encoding="utf-8") as f:
    json.dump(quiz, f, indent=2)

print(f"Successfully generated {slug}")
