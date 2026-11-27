---
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
  - "Prompt users for interactive terminal input using the built-in input() function."
  - "Recognize that input() always returns text (str) and cast responses to int or float for numerical processing."
  - "Interpolate variables and live Python expressions inside text using modern f-strings."
  - "Apply advanced f-string format specifiers for decimal precision (:.2f), thousands separators (:,), and column alignment (:<, :>)."
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

In Python, the `input()` function is that brass slot. When Python encounters `input("Enter your name: ")`, it prints your prompt message, pauses execution completely, and waits for the human user to type characters on their keyboard and press Enter. The paper slip slid back into Python is always made of text (**string**). If the user wrote the digits `500`, Python receives the text `"500"`. If you want to deduct that amount from an account balance, you must explicitly convert that text into a numerical `int` or `float` before doing arithmetic. Once calculated, Python's **f-strings** act as the customized receipt generator, seamlessly blending numbers, names, and currency symbols into clean, readable text.

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
user_name = "Arjun"
course_name = "Python Essentials"
welcome_message = f"Hello {user_name}, welcome to {course_name}!"
print(welcome_message)
```

```output
Hello Arjun, welcome to Python Essentials!
```

In line 3, the string is preceded by the lowercase letter `f`. Python scans the string literal, identifies the replacement fields `{user_name}` and `{course_name}`, evaluates their current values in memory, converts them to text, and replaces the braces with `'Arjun'` and `'Python Essentials'`.

### 3. Evaluating expressions directly inside replacement fields

Replacement fields inside f-strings are not restricted to simple variable names; they can evaluate full Python expressions, function calls, and arithmetic operations.

```python run
ticket_price = 120
quantity = 4
print(f"Total booking cost: ${ticket_price * quantity}")
```

```output
Total booking cost: $480
```

Inside `{ticket_price * quantity}`, Python multiplies `120` by `4`, evaluates the product `480`, converts it to text, and inserts it immediately after the dollar sign. This eliminates intermediate single-use variables.

### 4. Controlling decimal precision with format specifiers

When working with floating-point calculations such as ratings, percentages, or currency, displaying raw binary floats with fifteen decimal digits looks sloppy. You can append a colon `:` followed by a **format specifier** inside the curly braces:
- `:.1f`: Formats a float rounded to exactly 1 decimal place.
- `:.2f`: Formats a float rounded to exactly 2 decimal places.

```python run
movie_rating = 8.654
print(f"IMDb score formatted: {movie_rating:.1f}")
print(f"Two decimals precision: {movie_rating:.2f}")
```

```output
IMDb score formatted: 8.7
Two decimals precision: 8.65
```

Line 2 formats `8.654` with `:.1f`, rounding to `8.7`. Line 3 formats with `:.2f`, rounding to `8.65`. The underlying numerical variable remains untouched in memory; only the formatted visual string is altered.

### 5. Thousands comma separators for financial values

Reading large numbers like `4500000` is difficult for human eyes. Adding `:,` inside the format specifier instructs Python to place comma separators every three digits.

```python run
annual_revenue = 4500000
attendance = 12500
print(f"Gross Revenue: ${annual_revenue:,}")
print(f"Total Attendees: {attendance:,}")
```

```output
Gross Revenue: $4,500,000
Total Attendees: 12,500
```

In line 3, `{annual_revenue:,}` transforms `4500000` into `$4,500,000`. In line 4, `attendance` formats cleanly as `12,500`. You can combine commas with decimal precision using `,:2f` (e.g. `₹4,500,000.00`).

### 6. Zero-padding digital identifiers with `:0nd`

Databases and invoice systems often require fixed-width serial numbers like `#0007` or `INV-000042`. Adding `:04d` pads an integer with leading zeroes until the total width reaches 4 digits.

```python run
player_id = 7
order_number = 42
print(f"Player Tag: #{player_id:04d}")
print(f"Invoice ID: INV-{order_number:06d}")
```

```output
Player Tag: #0007
Invoice ID: INV-000042
```

Line 3 uses `:04d` to display `7` as `0007`. Line 4 uses `:06d` to pad `42` to six digits `000042`. The letter `d` denotes a decimal integer.

### 7. Converting simulated user input strings to numbers

When handling user data from `input()`, wrap the input string with `int()` for whole numbers or `float()` for decimal values before performing math.

```python run
raw_input_age = "24"
raw_input_height = "1.75"
age = int(raw_input_age)
height = float(raw_input_height)
print(f"Age in months: {age * 12}")
print(f"Height in centimeters: {height * 100:.0f}")
```

```output
Age in months: 288
Height in centimeters: 175
```

Lines 3 and 4 convert textual strings `'24'` and `'1.75'` into actual numerical types. Lines 5 and 6 perform mathematical multiplication and format the results neatly inside f-strings.

### 8. Aligning tabular text into clean columns

You can create clean text tables without third-party libraries by specifying column widths and alignment arrows:
- `:<15`: Left-align within a 15-character wide column.
- `:>7.2f`: Right-align a two-decimal float within a 7-character wide column.
- `:^20`: Center text within a 20-character wide column.

```python run
item1 = "Notebook"
price1 = 45.50
item2 = "Fountain Pen"
price2 = 120.00
print(f"{item1:<15} : ${price1:>7.2f}")
print(f"{item2:<15} : ${price2:>7.2f}")
```

```output
Notebook        : $  45.50
Fountain Pen    : $ 120.00
```

Lines 5 and 6 align `'Notebook'` and `'Fountain Pen'` cleanly to the left within 15 character spaces, while their respective prices align to the right, creating a neat vertical decimal line.

## What Python is doing behind the scenes

When Python compiles an f-string during bytecode generation, it does not perform slow string search-and-replace at runtime. Instead, the CPython compiler translates `{expr:spec}` into optimized virtual machine instructions:

| Step in CPython Pipeline | Action Taken by Compiler / Interpreter |
| :--- | :--- |
| **Lexing & Tokenizing** | Recognizes the `f` prefix and extracts string segments and expression tokens inside `{}`. |
| **Bytecode Generation** | Generates `BINARY_OP` for mathematical expressions, followed by `FORMAT_VALUE` with the format specifier. |
| **String Construction** | Calls the optimized `BUILD_STRING` opcode, concatenating pre-computed literals and formatted results in one C-level memory allocation. |
| **Speed Advantage** | Executes up to 2x faster than `.format()` and 3x faster than `%` interpolation because method lookups are completely bypassed. |

## Common mistakes

### 1. Attempting arithmetic directly on raw `input()` strings

Because `input()` returns a string, adding an integer to it causes a `TypeError`, while multiplying it duplicates the text rather than doing arithmetic.

Broken code:
```python
user_age = "25"
next_year = user_age + 1
```

Real error message:
```output
TypeError: can only concatenate str (not "int") to str
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
val = int("forty-two")
```

Real error message:
```output
ValueError: invalid literal for int() with base 10: 'forty-two'
```

How to fix it: ensure the string contains valid numerical digits (or validate with `.isdigit()` beforehand):
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
print(f"Score: {score_missing}")
```

Real error message:
```output
NameError: name 'score_missing' is not defined
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

## Try it yourself

### Exercise 1 (easy): Temperature conversion display

Ask the user for a temperature in Celsius. Convert it to Fahrenheit. Print the temperature as `28°C is equivalent to 82.4°F`, with Fahrenheit to one decimal place.

:::tip Hint
Use the lesson idea about talking to the user with input and f strings. Trace the sample values before printing so you can check each step.
:::

```input
28
```

```expected
Enter temperature in Celsius: 28
28°C is equivalent to 82.4°F
```

```python run
# Ask the user for a Celsius temperature and print its Fahrenheit conversion.
# Write your code below
```


:::solution Solution

Read the Celsius value with `input()`, convert it to a number, then format the Fahrenheit result to one decimal place.

```python run
raw_temp = input("Enter temperature in Celsius: ")
celsius = float(raw_temp)
fahrenheit = (celsius * 9 / 5) + 32
print(f"{celsius:g}°C is equivalent to {fahrenheit:.1f}°F")
```

```output
Enter temperature in Celsius: 28
28°C is equivalent to 82.4°F
```
:::

### Exercise 2 (medium): Restaurant bill splitter

Ask for the bill subtotal in rupees, the number of people, and the tip percentage. Calculate the tip, grand total, and each person’s share. Print both totals with rupee symbols, commas, and two decimal places.

:::tip Hint
Use the lesson idea about talking to the user with input and f strings. Trace the sample values before printing so you can check each step.
:::

```input
3500
4
10
```

```expected
Bill subtotal in rupees: 3500
Number of people: 4
Tip percent: 10
Grand Total: ₹3,850.00
Share Per Person: ₹962.50
```

```python run
# Ask for a bill, group size, and tip percentage; print the total and each share.
# Write your code below
```


:::solution Solution

Read the three responses as text, convert them to numeric values, then calculate and format the tip-inclusive totals.

```python run
raw_total = input("Bill subtotal in rupees: ")
raw_people = input("Number of people: ")
raw_tip_percent = input("Tip percent: ")
subtotal = float(raw_total)
people = int(raw_people)
tip_pct = float(raw_tip_percent)
tip = subtotal * tip_pct / 100
grand_total = subtotal + tip
per_person = grand_total / people
print(f"Grand Total: ₹{grand_total:,.2f}")
print(f"Share Per Person: ₹{per_person:,.2f}")
```

```output
Bill subtotal in rupees: 3500
Number of people: 4
Tip percent: 10
Grand Total: ₹3,850.00
Share Per Person: ₹962.50
```
:::

### Exercise 3 (challenge): Academic report card generator

Ask for a student name and marks in Math, Science, and English. Calculate the total and percentage. Print an aligned report card with the name in uppercase and the percentage to two decimals.

:::tip Hint
Use the lesson idea about talking to the user with input and f strings. Trace the sample values before printing so you can check each step.
:::
```input
Devika Sharma
92
88
95
```

```expected
Student name: Devika Sharma
Math marks: 92
Science marks: 88
English marks: 95
==============================
STUDENT REPORT: DEVIKA SHARMA
------------------------------
Math         :  92
Science      :  88
English      :  95
------------------------------
Total: 275/300 (91.67%)
==============================
```

```python run
# Ask for a student name and three marks, then print an aligned report card.
# Write your code below
```


:::solution Solution

Collect the name and marks, convert each mark to an integer, and use f-string widths to align the report.

```python run
student_name = input("Student name: ")
marks_math = int(input("Math marks: "))
marks_science = int(input("Science marks: "))
marks_english = int(input("English marks: "))
total_marks = marks_math + marks_science + marks_english
percentage = total_marks / 300 * 100
print("=" * 30)
print(f"STUDENT REPORT: {student_name.upper()}")
print("-" * 30)
print(f"{'Math':<12} : {marks_math:>3}")
print(f"{'Science':<12} : {marks_science:>3}")
print(f"{'English':<12} : {marks_english:>3}")
print("-" * 30)
print(f"Total: {total_marks}/300 ({percentage:.2f}%)")
print("=" * 30)
```

```output
Student name: Devika Sharma
Math marks: 92
Science marks: 88
English marks: 95
==============================
STUDENT REPORT: DEVIKA SHARMA
------------------------------
Math         :  92
Science      :  88
English      :  95
------------------------------
Total: 275/300 (91.67%)
==============================
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
