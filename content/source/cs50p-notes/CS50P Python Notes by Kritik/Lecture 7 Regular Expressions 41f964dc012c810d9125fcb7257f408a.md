# Lecture 7: Regular Expressions

<aside>
🧠

**Big idea:** regular expressions (regex) describe the **shape** of text, not the exact text. Instead of “exactly [ada@gmail.com](mailto:ada@gmail.com)” you say “some letters, an @, some letters, a dot, some letters”.

</aside>

## 🧠 Understand it first

A regular expression (regex) is a small language for describing a text pattern. For example, `\d{3}` means “exactly three digits.” You write the pattern, then choose how strict the match should be.

`re.search` looks anywhere in the text, `re.match` checks from the start, and `re.fullmatch` requires the whole text to fit. A raw string such as `r"\d{3}"` makes backslashes easier to write. Regex is useful for checking a format, but a format match alone does not prove that an address or other real-world value is genuinely valid.

![A visual guide to Lecture 7: how a regex pattern checks text.](Lecture%207%20Regular%20Expressions/cs50p-lecture-7-regex-visual.svg)

A visual guide to Lecture 7: how a regex pattern checks text.

### 🔍 Read a pattern like a tiny recipe

```python
import re

print(bool(re.fullmatch(r"\d{3}", "704")))   # True
print(bool(re.fullmatch(r"\d{3}", "7045")))  # False
```

1. The `r` makes this a raw string, so Python leaves the backslash available for the regex pattern.
2. `\d` means “one digit.” `{3}` means “exactly three repetitions.”
3. `fullmatch` asks whether the entire string fits. `704` fits; `7045` has an extra digit, so it does not.
4. `bool(...)` turns the match object or `None` into a clear `True` or `False`.

Use `search` when a match anywhere is enough, `match` for the beginning, and `fullmatch` for the whole string. In a pattern, a bare dot means “any character”; `\.` means an actual period.

<aside>
🛑

**Oops!** `re.search(r"\d{3}", "x704y")` can find three digits inside the text. If you are validating a whole input, prefer `fullmatch` so extra characters do not sneak through.

</aside>

## 📝 Notes

### 1. A first example

```python
import re

email = input('Email: ').strip()

if re.fullmatch(r'\w+@\w+\.com', email):
    print('Valid')
else:
    print('Invalid')
```

Write patterns as **raw strings**, `r'...'`, so backslashes stay as typed.

### 2. The pattern toolbox

| Symbol | Meaning |
| --- | --- |
| `.` | any character except a new line |
| `*` | zero or more of the previous thing |
| `+` | one or more |
| `?` | zero or one |
| `{m}` | exactly m times |
| `{m,n}` | between m and n times |
| `^` | start of the text |
| `$` | end of the text |
| `[abc]` | one of a, b or c |
| `[a-z]` | any lower-case letter |
| `[^abc]` | anything except a, b, c |
| `\d` | a digit |
| `\w` | a letter, digit or underscore |
| `\s` | a space or whitespace |
| `\.` | a real dot (escaped) |
| `A|B` | A or B |
| `(...)` | a group |

### 3. Build a pattern step by step

Goal: a simple email like `kritik@jiit.ac.in`.

1. `\w+` matches the name `kritik`.
2. `@` matches the at sign.
3. `[\w.]+` matches `jiit.ac.in`, allowing dots.
4. Put it together: `r'^\w+@[\w.]+$'`.

### 4. Groups

Brackets let you pull out parts of a match.

```python
import re

name = 'Potter, Harry'
if matches := re.search(r'^(.+), (.+)$', name):
    last, first = matches.groups()
    print(first, last)     # Harry Potter
```

`:=` is the **walrus operator**. It stores the result and checks it in one step.

### 5. `findall` and `sub`

```python
import re
print(re.findall(r'\d+', 'I am 19 and live at 42 Main St'))   # ['19', '42']
print(re.sub(r'\s+', ' ', 'too    many   spaces'))             # too many spaces
```

### 6. Flags

`re.IGNORECASE` ignores upper or lower case: `re.search(r'hello', text, re.IGNORECASE)`.

## 📖 Key definitions

| Term | Simple meaning |
| --- | --- |
| Regex | A pattern language for matching text |
| Pattern | The description of the shape you want |
| `re.search` | Find a match anywhere in the text |
| `re.fullmatch` | The entire text must match |
| Group | Part of a pattern in `()` that you can extract |
| Raw string | A string like `r'\d'` where backslashes stay as typed |
| Anchor | `^` and `$` pin a pattern to the start and end |

## ⚠️ Common mistakes

- Forgetting the `r` before the pattern string.
- Using `.` when you meant a real dot. Write `\.` instead.
- Using `search` when you need the whole text to match. Use `fullmatch` or add `^` and `$`.
- Making patterns too clever. Test small pieces first.

## 🧑‍💻 Programming questions

- 🧑‍💻 P1. **Mobile number.** Validate an Indian mobile number: exactly 10 digits, starting with 6, 7, 8 or 9.
    
    💡 Hint: `[6-9]` followed by nine digits.
    
    ```python
    import re
    
    n = input('Mobile: ')
    print('Valid' if re.fullmatch(r'[6-9]\d{9}', n) else 'Invalid')
    ```
    
- 🧑‍💻 P2. **Extract numbers.** Print all numbers found in a sentence.
    
    💡 Hint: `re.findall` with a digit pattern.
    
    ```python
    import re
    
    print(re.findall(r'\d+', input('Text: ')))
    ```
    
- 🧑‍💻 P3. **Name swap.** Convert `Last, First` into `First Last`.
    
    💡 Hint: two groups.
    
    ```python
    import re
    
    if m := re.fullmatch(r'(.+), (.+)', input('Name: ').strip()):
        last, first = m.groups()
        print(first, last)
    else:
        print('Use Last, First')
    ```
    
- 🧑‍💻 P4. **Hex colour.** Check whether text is a valid hex colour such as `#1a2B3c` (a `#` and exactly six hex characters).
    
    💡 Hint: `[0-9a-fA-F]{6}`.
    
    ```python
    import re
    
    colour = input('Colour: ')
    print('Valid' if re.fullmatch(r'#[0-9a-fA-F]{6}', colour) else 'Invalid')
    ```
    
- 🧑‍💻 P5. **Clean spaces.** Replace any run of spaces in a sentence with a single space.
    
    💡 Hint: `re.sub`.
    
    ```python
    import re
    
    text = input('Text: ')
    print(re.sub(r' +', ' ', text).strip())
    ```
    

## 🎯 MCQs

- 🎯 Q1. Which symbol means “one or more”? (A) * (B) + (C) ? (D) .
    
    **Answer: (B).** `*` is zero or more.
    
- 🎯 Q2. What does `\d` match? (A) a letter (B) a digit (C) a space (D) any character
    
    **Answer: (B).**
    
- 🎯 Q3. Which function requires the whole text to match? (A) [re.search](http://re.search) (B) re.findall (C) re.fullmatch (D) re.sub
    
    **Answer: (C).**
    
- 🎯 Q4. How do you match a real dot? (A) . (B) . (C) .* (D) [.]]
    
    **Answer: (B).** A plain `.` means any character.
    
- 🎯 Q5. Why write patterns as `r'...'`? (A) it makes them faster (B) backslashes stay as typed (C) it is required for brackets (D) it ignores case
    
    **Answer: (B).**
    

## ✅ Quick recap

- Regex describes the shape of text; use the `re` module.
- `search` finds anywhere, `fullmatch` needs the whole text.
- `\d`, `\w`, `.`, `*`, `+`, `?`, `{m}` and `[...]` are your core tools.
- Groups `()` extract parts of a match.