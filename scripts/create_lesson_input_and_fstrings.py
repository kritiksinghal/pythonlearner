import os
import json
import subprocess

slug = "talking-to-the-user-with-input-and-f-strings"
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

c1 = """user_name = 'Arjun'
course_name = 'Python Essentials'
welcome_message = f'Hello {user_name}, welcome to {course_name}!'
print(welcome_message)"""
o1 = run_py(c1)

c2 = """ticket_price = 120
quantity = 4
print(f'Total booking cost: ${ticket_price * quantity}')"""
o2 = run_py(c2)

c3 = """movie_rating = 8.654
print(f'IMDb score formatted: {movie_rating:.1f}')
print(f'Two decimals precision: {movie_rating:.2f}')"""
o3 = run_py(c3)

c4 = """annual_revenue = 4500000
attendance = 12500
print(f'Gross Revenue: ${annual_revenue:,}')
print(f'Total Attendees: {attendance:,}')"""
o4 = run_py(c4)

c5 = """player_id = 7
order_number = 42
print(f'Player Tag: #{player_id:04d}')
print(f'Invoice ID: INV-{order_number:06d}')"""
o5 = run_py(c5)

c6 = """raw_input_age = '24'
raw_input_height = '1.75'
age = int(raw_input_age)
height = float(raw_input_height)
print(f'Age in months: {age * 12}')
print(f'Height in centimeters: {height * 100:.0f}')"""
o6 = run_py(c6)

c7 = """item1 = 'Notebook'
price1 = 45.50
item2 = 'Fountain Pen'
price2 = 120.00
print(f'{item1:<15} : ${price1:>7.2f}')
print(f'{item2:<15} : ${price2:>7.2f}')"""
o7 = run_py(c7)

c8 = """match_overs = 18.4
current_score = 152
print(f'{match_overs=}')
print(f'{current_score=}')"""
o8 = run_py(c8)

c_ex1 = """raw_temp = '28'
celsius = int(raw_temp)
fahrenheit = (celsius * 9 / 5) + 32
print(f'{celsius}°C is equivalent to {fahrenheit:.1f}°F')"""
o_ex1 = run_py(c_ex1)

c_ex2 = """raw_total = '3500'
raw_people = '4'
raw_tip_percent = '10'
subtotal = float(raw_total)
people = int(raw_people)
tip_pct = float(raw_tip_percent)
grand_total = subtotal + (subtotal * (tip_pct / 100))
per_person = grand_total / people
print(f'Grand Total: ₹{grand_total:,.2f}')
print(f'Share Per Person: ₹{per_person:,.2f}')"""
o_ex2 = run_py(c_ex2)

c_ex3 = """student_name = 'Devika Sharma'
marks_math = 92
marks_science = 88
marks_english = 95
total_marks = marks_math + marks_science + marks_english
percentage = (total_marks / 300) * 100
print('=' * 30)
print(f'STUDENT REPORT: {student_name.upper()}')
print('-' * 30)
print(f'{"Math":<12} : {marks_math:>3}')
print(f'{"Science":<12} : {marks_science:>3}')
print(f'{"English":<12} : {marks_english:>3}')
print('-' * 30)
print(f'Total: {total_marks}/300 ({percentage:.2f}%)')
print('=' * 30)"""
o_ex3 = run_py(c_ex3)

err1 = run_err("user_age = '25'; next_year = user_age + 1")
err2 = run_err("val = int('forty-two')")
err3 = run_err("print(f'Score: {score_missing}')")

content = f"""---
title: "Talking to the user with input() and f-strings"
curriculumTitle: "Talking to the user with input() and f-strings"
track: "Python from zero"
module: "M1 Getting started"
order: 6
level: "Beginner"
summary: "Gather interactive user input with the input() function, convert incoming string data to numbers, and format expressive output using modern Python f-strings."
prerequisites:
  - "what-is-programming-and-python"
  - "your-first-program-with-print"
  - "variables-and-types"
  - "numbers-and-math"
  - "text-strings"
learningGoals:
  - "Prompt users for interactive terminal input using the built-in `input()` function."
  - "Recognize that `input()` always returns text (`str`) and cast responses to `int` or `float` for numerical processing."
  - "Interpolate variables and live Python expressions inside text using modern **f-strings**."
  - "Apply advanced f-string format specifiers for decimal precision (`:.2f`), thousands separators (`:,`), and column alignment (`:<`, `:>`)."
relatedProblems: []
---

## What you will learn

- How the `input()` function pauses program execution to read keystrokes from the keyboard.
- Why every value returned by `input()` is strictly a **string**, regardless of what digits the user typed.
- How to cast user text into numbers using `int()` and `float()` to perform mathematical calculations.
- Constructing clear, readable strings by embedding variable expressions directly inside formatted string literals (**f-strings**).
- Formatting decimal precision, adding comma separators to large monetary figures, and zero-padding digital identifiers.
- Aligning textual and numerical data into neat columns using width and alignment format specifiers.

## Why this matters

A computer program that operates only on pre-written constants is like a digital calculator with glued buttons—it can only run one hardcoded equation over and over. Real-world applications become useful precisely when they interact dynamically with human beings. An automated teller machine must ask how much cash you want to withdraw; an e-commerce website asks for your shipping address; and a gaming application prompts for your player name. Mastering `input()` allows your software to collect live information from users, while f-strings provide the standard, elegant syntax for presenting tailored, polished replies back to them.

## The big idea

Imagine sitting across from a bank teller behind a glass counter. When you approach the window, the teller slides a paper withdrawal slip through a brass slot and waits patiently. You write down your account details and slide the paper back. The teller takes your slip, reads the handwriting, verifies the numbers, stamps the ledger, and hands you an official printed receipt showing your name, transaction amount, and updated account balance.

In Python, the `input()` function is that brass slot. When Python encounters `input('Enter your name: ')`, it prints your prompt message, pauses execution completely, and waits for the human user to type characters on their keyboard and press Enter. The paper slip slid back into Python is always made of text (**string**). If the user wrote the digits `500`, Python receives the text `"500"`. If you want to deduct that amount from an account balance, you must explicitly convert that text into a numerical `int` or `float` before doing arithmetic. Once calculated, Python's **f-strings** act as the customized receipt generator, seamlessly blending numbers, names, and currency symbols into clean, readable text.

## Step by step

### 1. Interactive terminal input and the return type rule

The built-in `input(prompt)` function displays an optional message on screen and waits for user keystrokes until Enter is pressed.

```python
# Interactive demonstration (runs in a full terminal)
user_name = input("Enter your username: ")
print("Welcome back,", user_name)
```

Sample interactive session:
```output
Enter your username: Devika
Welcome back, Devika
```

:::remember
The `input()` function **always** returns a string (`str`). Even if the user types `42`, Python stores `"42"`. If you need a number, you must explicitly wrap `input()` with `int()` or `float()`. Because browser code runners cannot pause for live keyboard input, our runnable examples below simulate input using variables to demonstrate real Python execution.
:::

### 2. Basic f-strings: embedding variables into text

Introduced in Python 3.6, **f-strings** (formatted string literals) allow you to interpolate variables directly into text. Prefix your quotation marks with the letter `f` (or `F`), and place any variable name inside curly braces `{}`.

```python run
{c1}
```

```output
{o1}
```

In line 3, the string is preceded by the lowercase letter `f`. Python scans the string literal, identifies the replacement fields `{user_name}` and `{course_name}`, evaluates their current values in memory, converts them to text, and replaces the braces with `'Arjun'` and `'Python Essentials'`.

### 3. Evaluating expressions directly inside replacement fields

Replacement fields inside f-strings are not restricted to simple variable names; they can evaluate full Python expressions, function calls, and arithmetic operations.

```python run
{c2}
```

```output
{o2}
```

Inside `{ticket_price * quantity}`, Python multiplies `120` by `4`, evaluates the product `480`, converts it to text, and inserts it immediately after the dollar sign. This eliminates intermediate single-use variables.

### 4. Controlling decimal precision with format specifiers

When working with floating-point calculations such as ratings, percentages, or currency, displaying raw binary floats with fifteen decimal digits looks sloppy. You can append a colon `:` followed by a **format specifier** inside the curly braces:
- `:.1f`: Formats a float rounded to exactly 1 decimal place.
- `:.2f`: Formats a float rounded to exactly 2 decimal places.

```python run
{c3}
```

```output
{o3}
```

Line 2 formats `8.654` with `:.1f`, rounding to `8.7`. Line 3 formats with `:.2f`, rounding to `8.65`. The underlying numerical variable remains untouched in memory; only the formatted visual string is altered.

### 5. Thousands comma separators for financial values

Reading large numbers like `4500000` is difficult for human eyes. Adding `:,` inside the format specifier instructs Python to place comma separators every three digits.

```python run
{c4}
```

```output
{o4}
```

In line 3, `{annual_revenue:,}` transforms `4500000` into `$4,500,000`. In line 4, `attendance` formats cleanly as `12,500`. You can combine commas with decimal precision using `,:2f` (e.g. `₹4,500,000.00`).

### 6. Zero-padding digital identifiers with `:0nd`

Databases and invoice systems often require fixed-width serial numbers like `#0007` or `INV-000042`. Adding `:04d` pads an integer with leading zeroes until the total width reaches 4 digits.

```python run
{c5}
```

```output
{o5}
```

Line 3 uses `:04d` to display `7` as `0007`. Line 4 uses `:06d` to pad `42` to six digits `000042`. The letter `d` denotes a decimal integer.

### 7. Converting simulated user input strings to numbers

When handling user data from `input()`, wrap the input string with `int()` for whole numbers or `float()` for decimal values before performing math.

```python run
{c6}
```

```output
{o6}
```

Lines 3 and 4 convert textual strings `'24'` and `'1.75'` into actual numerical types. Lines 5 and 6 perform mathematical multiplication and format the results neatly inside f-strings.

### 8. Aligning tabular text into clean columns

You can create clean text tables without third-party libraries by specifying column widths and alignment arrows:
- `:<15`: Left-align within a 15-character wide column.
- `:>7.2f`: Right-align a two-decimal float within a 7-character wide column.
- `:^20`: Center text within a 20-character wide column.

```python run
{c7}
```

```output
{o7}
```

Lines 5 and 6 align `'Notebook'` and `'Fountain Pen'` cleanly to the left within 15 character spaces, while their respective prices align to the right, creating a neat vertical decimal line.

## What Python is doing behind the scenes

When Python compiles an f-string during bytecode generation, it does not perform slow string search-and-replace at runtime. Instead, the CPython compiler translates `{expr:spec}` into optimized virtual machine instructions:

```mermaid
flowchart TD
    A["f-string: f'Total: ${price * qty:,.2f}'"] --> B["CPython Parser"]
    B --> C["Bytecode: BINARY_OP (price * qty)"]
    C --> D["Bytecode: FORMAT_VALUE (format_spec=',.2f')"]
    D --> E["Bytecode: BUILD_STRING (concatenates parts)"]
```

Because f-strings are evaluated as compiled bytecode expressions directly inside the local evaluation stack, they execute significantly faster than legacy `%` formatting or `.format()` method calls.

## Common mistakes

### 1. Attempting arithmetic directly on raw `input()` strings

Because `input()` returns a string, adding an integer to it causes a `TypeError`, while multiplying it duplicates the text rather than doing arithmetic.

Broken code:
```python
user_age = '25'
next_year = user_age + 1
```

Real error message:
```output
{err1}
```

How to fix it: wrap the string in `int()` before calculating:
```python run
user_age = "25"
next_year = int(user_age) + 1
print(f"Next year you will be {next_year}")
```

```output
Next year you will be 26
```

### 2. Passing invalid non-numeric text to `int()`

Passing words or letters like `'forty-two'` to `int()` raises a `ValueError` because Python cannot convert non-digit characters into a base-10 number.

Broken code:
```python
val = int('forty-two')
```

Real error message:
```output
{err2}
```

How to fix it: ensure the string contains valid numerical digits (or validate with `.isdigit()` beforehand, as covered in the strings lesson):
```python run
val_str = "42"
if val_str.isdigit():
    val = int(val_str)
    print(f"Parsed valid number: {val}")
```

```output
Parsed valid number: 42
```

### 3. Misspelling variable names inside replacement fields

Variables inside `{}` must exist in the current scope. A typo inside curly braces raises a `NameError`.

Broken code:
```python
print(f'Score: {score_missing}')
```

Real error message:
```output
{err3}
```

How to fix it: verify that the identifier inside braces matches an assigned variable:
```python run
score_actual = 95
print(f"Score: {score_actual}")
```

```output
Score: 95
```

## Cheat sheet

| Specifier / Pattern | Code Example | Output Result | Description |
| :--- | :--- | :--- | :--- |
| **Basic placeholder** | `f"Hi {name}"` | `Hi Maya` | Interpolates variable |
| **Inline expression** | `f"{10 * 5}"` | `50` | Evaluates math in braces |
| **Decimal places** | `f"{3.14159:.2f}"` | `3.14` | Rounds to 2 decimal places |
| **Thousands comma** | `f"{1000000:,}"` | `1,000,000` | Inserts digit separators |
| **Combined comma+float** | `f"{2500.5:,.2f}"` | `2,500.50` | Commas plus 2 decimals |
| **Zero-padding** | `f"{9:03d}"` | `009` | Pads integer to width 3 |
| **Left-alignment** | `f"{'Item':<10}"` | `'Item      '` | Left-aligns in 10-char space |
| **Right-alignment** | `f"{45:>10}"` | `'        45'` | Right-aligns in 10-char space |
| **Debug inspect (3.8+)**| `f"{x=}"` | `x=10` | Prints variable name and value |

## Try it yourself

### Exercise 1 (easy): Temperature conversion display

Given a simulated temperature string `raw_temp = '28'` (in Celsius), convert it to an integer, calculate Fahrenheit using the formula `(celsius * 9 / 5) + 32`, and print a formatted summary showing one decimal place: `28°C is equivalent to 82.4°F`.

```python run
raw_temp = '28'
celsius = int(raw_temp)
fahrenheit = (celsius * 9 / 5) + 32
print(f'{celsius}°C is equivalent to {fahrenheit:.1f}°F')
```

:::solution Solution
Cast `raw_temp` to `int`, compute `fahrenheit`, and interpolate both values using `{fahrenheit:.1f}`:

```python run
{c_ex1}
```
:::

### Exercise 2 (medium): Restaurant bill splitter

Write a script that processes three simulated input strings: `raw_total = '3500'`, `raw_people = '4'`, and `raw_tip_percent = '10'`. Calculate the total tip amount, the grand bill total (`subtotal + tip`), and the per-person share (`grand_total / people`). Display the grand total and individual share with rupee symbols `₹`, thousands commas, and two decimal places.

```python run
raw_total = '3500'
raw_people = '4'
raw_tip_percent = '10'
subtotal = float(raw_total)
people = int(raw_people)
tip_pct = float(raw_tip_percent)
grand_total = subtotal + (subtotal * (tip_pct / 100))
per_person = grand_total / people
print(f'Grand Total: ₹{grand_total:,.2f}')
print(f'Share Per Person: ₹{per_person:,.2f}')
```

:::solution Solution
Cast `raw_total` and `raw_tip_percent` to floats, cast `raw_people` to an integer, compute shares, and format with `:,.2f`:

```python run
{c_ex2}
```
:::

### Exercise 3 (challenge): Academic report card generator

Given a student name `student_name = 'Devika Sharma'` and exam marks `marks_math = 92`, `marks_science = 88`, and `marks_english = 95`, generate a formatted report card with boundary lines `'=' * 30`, left-aligned subject names (`:<12`), right-aligned marks (`:>3`), total marks out of 300, and overall percentage rounded to two decimal places.

```python run
student_name = 'Devika Sharma'
marks_math = 92
marks_science = 88
marks_english = 95
total_marks = marks_math + marks_science + marks_english
percentage = (total_marks / 300) * 100
print('=' * 30)
print(f'STUDENT REPORT: {student_name.upper()}')
print('-' * 30)
print(f'{"Math":<12} : {marks_math:>3}')
print(f'{"Science":<12} : {marks_science:>3}')
print(f'{"English":<12} : {marks_english:>3}')
print('-' * 30)
print(f'Total: {total_marks}/300 ({percentage:.2f}%)')
print('=' * 30)
```

:::solution Solution
Calculate sum and percentage, uppercase the student name, and use column width specifiers `:<12` and `:>3`:

```python run
{c_ex3}
```
:::

## Recap

- The `input()` function prompts the user for terminal keyboard input and **always** returns data as a `str`.
- Wrap `input()` responses with `int()` or `float()` to perform numerical arithmetic.
- Prefix string literals with `f` to create modern, fast **f-strings**.
- Variables and live expressions placed inside `{}` are evaluated and converted to text automatically.
- Format specifiers such as `:.2f` (decimal precision), `:,` (thousands commas), and `:04d` (zero-padding) format numbers cleanly.
- Column width specifiers like `:<15` and `:>10` enable clean tabular alignment.

Reference: Python documentation, Formatted string literals
"""

with open(f"{lesson_dir}/lesson.md", "w", encoding="utf-8") as f:
    f.write(content)

quiz = [
    {
        "question": "What is the return data type of the built-in `input()` function in Python 3?",
        "options": [
            "`int` if the user types whole numbers, `float` for decimals, and `str` otherwise",
            "Always `str` (string)",
            "`None`",
            "`bool`"
        ],
        "correctIndex": 1,
        "explanation": "In Python 3, `input()` unconditionally returns a string (`str`), even if the user enters only digits. To perform math on the input, you must explicitly convert it using `int()` or `float()`."
    },
    {
        "question": "Which prefix turns a standard string literal into a formatted f-string in Python?",
        "options": [
            "The prefix `f` or `F` immediately preceding the opening quote",
            "The prefix `format:` inside the string",
            "The prefix `$` before the variable name",
            "The suffix `.format`"
        ],
        "correctIndex": 0,
        "explanation": "Preceding the opening quote with `f` or `F` (e.g. `f'Hello {name}'`) designates the string as an f-string, enabling expression interpolation inside curly braces `{}`."
    },
    {
        "question": "What does the format specifier `:.2f` accomplish inside an f-string placeholder `{cost:.2f}`?",
        "options": [
            "Multiplies the variable by 2.",
            "Formats the number as a floating-point value rounded to exactly two decimal places.",
            "Truncates the number to two total digits.",
            "Converts the number into binary format."
        ],
        "correctIndex": 1,
        "explanation": "The format specifier `:.2f` formats a number as a fixed-point float rounded to 2 decimal places (e.g. `12.3456` becomes `12.35`)."
    },
    {
        "question": "What output is produced by evaluating `f'{1500000:,}'`?",
        "options": [
            "'1500000'",
            "'1,500,000'",
            "'1.500.000'",
            "'15,00,000'"
        ],
        "correctIndex": 1,
        "explanation": "The comma `,` format specifier automatically inserts standard thousands comma separators every three digits, producing `'1,500,000'`."
    },
    {
        "question": "What will `f'{7:04d}'` display?",
        "options": [
            "'7000'",
            "'0007'",
            "'7.000'",
            "'007'"
        ],
        "correctIndex": 1,
        "explanation": "The format specifier `:04d` zero-pads an integer to a total width of 4 characters, turning `7` into `'0007'`."
    },
    {
        "question": "What happens if you execute `result = input('Enter number: ') * 2` and the user enters `5`?",
        "options": [
            "`result` is integer `10`",
            "`result` is string `'55'`",
            "`result` is float `10.0`",
            "Python raises a `TypeError`"
        ],
        "correctIndex": 1,
        "explanation": "Because `input()` returns string `'5'`, multiplying string `'5'` by integer `2` performs string repetition, resulting in string `'55'`. To get `10`, you must write `int(input(...)) * 2`."
    },
    {
        "question": "What error occurs if you run `int('twenty')`?",
        "options": [
            "SyntaxError: invalid syntax",
            "ValueError: invalid literal for int() with base 10: 'twenty'",
            "TypeError: unsupported operand type",
            "NameError: name 'twenty' is not defined"
        ],
        "correctIndex": 1,
        "explanation": "The `int()` function expects a string composed of valid numeric digits. Passing an alphabetic word raises a `ValueError`."
    },
    {
        "question": "Which format specifier aligns text to the left within a 12-character wide column?",
        "options": [
            ":>12",
            ":<12",
            ":^12",
            ":left12"
        ],
        "correctIndex": 1,
        "explanation": "The `<` character specifies left alignment, while `>` specifies right alignment and `^` specifies centering. Thus `:<12` left-aligns content within 12 character spaces."
    },
    {
        "question": "What is the benefit of the debugging f-string syntax `f'{score=}'` introduced in Python 3.8?",
        "options": [
            "It reassigns `score` to zero.",
            "It automatically prints both the variable expression name and its evaluated value, like `'score=95'`.",
            "It checks if `score` is equal to None.",
            "It hides the value of `score` from terminal logs."
        ],
        "correctIndex": 1,
        "explanation": "Appending an equals sign `=` to an expression inside an f-string (e.g. `{score=}`) is a handy debugging shorthand that outputs the expression text followed by its evaluated value, such as `'score=95'`."
    }
]

with open(f"{lesson_dir}/quiz.json", "w", encoding="utf-8") as f:
    json.dump(quiz, f, indent=2)

print(f"Successfully generated {slug}")
