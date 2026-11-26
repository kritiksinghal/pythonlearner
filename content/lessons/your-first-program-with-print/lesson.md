---
title: "Your first program with print()"
curriculumTitle: "Your first program with print()"
track: "Python from zero"
module: "M1 Getting started"
order: 2
level: "Beginner"
summary: "Master Python's foundational output tool: outputting text and numbers, formatting data with custom separators, controlling line endings, and handling escape sequences."
prerequisites:
  - "what-is-programming-and-python"
learningGoals:
  - "Invoke the built-in `print()` function to emit text, numbers, and evaluated expressions to standard output."
  - "Pass multiple positional arguments to `print()` and explain how Python automatically separates them with spaces."
  - "Customize the `sep` and `end` keyword arguments to control inter-item formatting and trailing newline behavior."
  - "Employ escape characters like `\n`, `\t`, and escaped quotation marks to format complex multi-line text structures."
relatedProblems: []
---

## What you will learn

- How the built-in `print()` function serves as your program's primary window to the outside world.
- Supplying single arguments versus multiple comma-separated arguments to output complex data structures in one statement.
- Overriding the default space separator using the keyword parameter `sep`.
- Overriding the automatic trailing newline character using the keyword parameter `end`.
- Embedding special whitespace and formatting instructions using backslash **escape sequences** such as `\n` and `\t`.
- Avoiding syntax and runtime errors caused by missing quotes, omitted commas, and unterminated string literals.

## Why this matters

When software executes, calculations take place in microscopic electrical registers deep inside silicon chips. Without output, a program could calculate the trajectory of a spacecraft or process millions of bank transactions, but you would have zero evidence of what occurred. The `print()` function is the universal debugging stethoscope and communication megaphone of Python programming. Whether you are displaying account balances to a customer, inspecting the state of variables while fixing a tricky bug, or formatting diagnostic logs on a high-traffic web server, `print()` is the very first tool every developer relies on.

## The big idea

Imagine an automated public address announcer in an international airport. When the announcer wants to inform passengers, they pick up a microphone and speak a message. If they read several luggage tag codes, they speak each code clearly with a deliberate pause between each one, and when finished, they let go of the microphone button, marking the end of that announcement before the next one starts.

In Python, `print()` is that exact announcer. The computer's terminal screen is the public address speaker. When you call `print('Flight', 101, 'Boarding')`, Python walks up to the microphone, announces each item one by one, inserts a standard single space between them (the default `sep` behavior), and automatically concludes with a line break (the default `end` behavior), so the next announcement begins fresh on a brand-new line.

## Step by step

### 1. The simplest program: displaying text

To emit text to the screen, pass a text string enclosed in matching quotes inside the parentheses of `print()`.

```python run
print('Hello, Python learner!')
```

```output
Hello, Python learner!
```

The word `print` is the identifier of Python's built-in function. The parentheses `()` signal to Python that you are calling this function. Inside the parentheses, you pass the text `'Hello, Python learner!'` wrapped in single quotes. Python reads the characters, writes them to the standard output buffer, and automatically advances the terminal cursor to the next line.

### 2. Outputting multiple values in a single call

You frequently need to display explanatory text alongside numerical values. Instead of writing multiple print calls, you can supply multiple **positional arguments** separated by commas inside the parentheses.

```python run
print('Score:', 98, 'out of', 100)
```

```output
Score: 98 out of 100
```

Here, `print()` receives four distinct arguments: `'Score:'`, the integer `98`, the string `'out of'`, and the integer `100`. Python evaluates each argument, converts numbers into readable text strings automatically, and joins them together using a single space between each item before emitting the final sentence to the screen.

### 3. Customizing the separator with `sep`

By default, Python places a single space character between every argument passed to `print()`. You can change this behavior by supplying the **keyword argument** `sep`.

```python run
print('2026', '11', '24', sep='-')
```

```output
2026-11-24
```

In this example, three string arguments are passed: `'2026'`, `'11'`, and `'24'`. By setting `sep='-'`, you instruct Python to insert a hyphen instead of a space between each element. If you set `sep=''`, Python concatenates the items with zero space in between.

### 4. Controlling trailing newlines with `end`

Every time `print()` finishes displaying its arguments, it automatically appends an invisible **newline character** (`\n`). This pushes any subsequent output to the start of the next line. You can override this behavior using the `end` keyword argument.

```python run
print('Ready...', end=' ')
print('Set...', end=' ')
print('Go!')
```

```output
Ready... Set... Go!
```

Line 1 prints `'Ready...'` and specifies `end=' '` (a single space instead of a newline). Line 2 prints `'Set...'` with another space at the end. Because neither line ended with a newline character, line 3 (`'Go!'`) prints right alongside them on the exact same line, followed by its normal default newline.

### 5. Formatting multi-line text with escape characters

An **escape sequence** starts with a backslash `\` followed by a character code. It tells Python to treat the combination as a special character rather than literal letters:

- `\n` inserts a newline (moving down one row).
- `\t` inserts a horizontal tab (aligning items into clean columns).
- `\\` produces a single literal backslash.

```python run
print("Item\tQty\tPrice\nApple\t3\t45\nOrange\t2\t30")
```

```output
Item	Qty	Price
Apple	3	45
Orange	2	30
```

Python interprets `\t` as a column tab stop and `\n` as an instantaneous carriage return to the next line. This allows a single string literal to output a formatted tabular receipt.

### 6. Embedding quotation marks inside text

If you enclose your string in single quotes, you can freely use double quotes inside without escaping them. Conversely, if you enclose your string in double quotes, you can include single quotes freely.

```python run
print('He said, "Practice makes permanent!"')
```

```output
He said, "Practice makes permanent!"
```

Because the outer string boundary uses single quotes `'...'`, the inner double quotes around `"Practice makes permanent!"` are treated as ordinary text characters. If you need both quotation types inside the same text, escape inner quotes with a backslash like `\'`.

### 7. Combining `sep` and `end` together

Keyword arguments can be combined within the same `print()` call to produce specialized progress indicators and terminal feedback.

```python run
print('Loading', '.', '.', '.', sep='', end=' [DONE]\n')
```

```output
Loading... [DONE]
```

Here, `sep=''` ensures no unwanted spaces appear between the three period strings, while `end=' [DONE]\n'` appends the completion tag and an explicit newline at the very end of the stream.

### 8. Real-world modeling: sports match scoreboard

Printing variable values together with descriptive labels allows you to generate dynamic match scoreboards and summaries cleanly.

```python run
team1 = 'Mumbai'
team2 = 'Chennai'
runs1 = 175
runs2 = 172
print(team1, 'scored', runs1, 'runs', sep=' ')
print(team2, 'scored', runs2, 'runs', sep=' ')
print('Margin:', runs1 - runs2, 'runs')
```

```output
Mumbai scored 175 runs
Chennai scored 172 runs
Margin: 3 runs
```

Lines 1 through 4 assign team names and run totals. Lines 5 and 6 print the team scores. Line 7 evaluates the arithmetic subtraction `runs1 - runs2` inside the print call, computing the margin of victory and displaying the final result.

## What Python is doing behind the scenes

When you invoke `print()`, Python interacts with your host operating system's standard I/O (Input/Output) streams:

| Component | Role in the Output Pipeline |
| :--- | :--- |
| `sys.stdout` | The default standard output text stream that `print()` writes to behind the scenes. |
| Object conversion (`str()`) | Python automatically invokes the `__str__()` method on every non-string argument (converting numbers, booleans, and objects into text). |
| Output buffer | Python batches characters in memory before sending them in chunks to the terminal display to maintain high performance. |
| Flush behavior | When a newline `\n` is printed, or when the script completes, Python flushes the memory buffer, ensuring every character appears on screen immediately. |

Tracing the execution of `print("Score:", 98, sep="-", end="!")`:

| Step | Action Taken by Python Runtime | Current Output Buffer State |
| :--- | :--- | :--- |
| **1** | Convert first argument `"Score:"` to text and append | `"Score:"` |
| **2** | Append custom separator `"-"` | `"Score:-"` |
| **3** | Convert integer `98` to text `"98"` and append | `"Score:-98"` |
| **4** | Append custom terminator `end="!"` | `"Score:-98!"` |
| **5** | Send completed buffer to terminal display | Cursor sits immediately after `!` |

## Common mistakes

### 1. Forgetting quotation marks around text literals

Python interprets unquoted words as variable or function identifiers. If you write text without quotes, Python searches for a variable with that name, cannot find it, and halts with a `NameError`.

Broken code:
```python
print(Hello, world!)
```

Real error message:
```output
File "<string>", line 1
    print(Hello, world!)
                      ^
SyntaxError: invalid syntax
```

How to fix it: wrap literal text in single or double quotes so Python recognizes it as a string literal:
```python run
print("Hello, world!")
```

```output
Hello, world!
```

### 2. Forgetting commas between multiple arguments

When passing multiple values to `print()`, you must separate each argument with a comma `,`. Omitting a comma confuses Python's parser because adjacent literals violate grammatical rules.

Broken code:
```python
print('Score:' 95)
```

Real error message:
```output
File "<string>", line 1
    print('Score:' 95)
          ^^^^^^^^^^^
SyntaxError: invalid syntax. Perhaps you forgot a comma?
```

How to fix it: place a comma between every argument in the parameter list:
```python run
print('Score:', 95)
```

```output
Score: 95
```

### 3. Unterminated string literals (mismatched quotes)

Opening a string with a single quote `'` and closing it with a double quote `"` leaves the string open. The parser reaches the end of the line without finding the matching quote and raises a `SyntaxError`.

Broken code:
```python
print('Unfinished string)
```

Real error message:
```output
File "<string>", line 1
    print('Unfinished string)
          ^
SyntaxError: unterminated string literal (detected at line 1)
```

How to fix it: ensure every string starts and ends with identical quotation marks:
```python run
print('Finished string')
```

```output
Finished string
```

## Cheat sheet

| Feature | Code Syntax | Output Result |
| :--- | :--- | :--- |
| **Single string** | `print('Hi')` | `Hi` followed by newline |
| **Multiple items** | `print('Age:', 21)` | `Age: 21` (separated by space) |
| **Custom separator** | `print('A', 'B', sep='/')` | `A/B` |
| **No separator** | `print('X', 'Y', sep='')` | `XY` |
| **Custom line end** | `print('Wait', end='...')` | `Wait...` (no newline) |
| **Newline escape** | `print('Line1\nLine2')` | Prints across two lines |
| **Tab escape** | `print('Name\tMarks')` | Inserts tab alignment |
| **Repeated characters** | `print('=' * 20)` | `====================` |

## Try it yourself

### Exercise 1 (easy): Formatted product pricing label

Create three variables: `item = 'Cricket Bat'`, `price = 2400`, and `discount = 300`. In a single `print()` call, output the item name, original price, discount amount, and the calculated final price (`price - discount`), separating each piece of information with a vertical bar surrounded by spaces (`sep=' | '`).

```python run
# Complete the Formatted product pricing label task.
# Sample data: item = 'Cricket Bat', price = 2400
# Write your code below and print the result
```


:::solution Solution
Pass the labels and mathematical calculation as distinct arguments separated by commas, setting `sep=' | '`:

```python run
item = 'Cricket Bat'
price = 2400
discount = 300
print(item, 'Original Price:', price, 'Discount:', discount, 'Final:', price - discount, sep=' | ')
```

```output
Cricket Bat | Original Price: | 2400 | Discount: | 300 | Final: | 2100
```
:::

### Exercise 2 (medium): Single-line breadcrumb navigation

Write three consecutive `print()` calls that print `'Step 1'`, `'Step 2'`, and `'Complete!'`. Use the `end` keyword parameter so all three steps appear on one single line connected by arrows like `' -> '`, finishing with a normal newline after `'Complete!'`.

```python run
# Complete the Single-line breadcrumb navigation task.
# Sample data: end=' -> '
# Write your code below and print the result
```


:::solution Solution
Set `end=' -> '` on the first two print statements, leaving the third statement with the default newline:

```python run
print('Step 1', end=' -> ')
print('Step 2', end=' -> ')
print('Complete!')
```

```output
Step 1 -> Step 2 -> Complete!
```
:::

### Exercise 3 (challenge): Formatted commercial receipt

Build a formatted store receipt using repeated string banners (`'=' * 30` and `'-' * 30`), custom currency separators (`sep=': $'`), and clean headers. Output a receipt number `#4092`, a stationery charge of `$350`, a sales tax of `$17.5`, and the total balance `$367.5`.

```python run
# Complete the Formatted commercial receipt task.
# Sample data: sep=': $'
# Write your code below and print the result
```


:::solution Solution
Use `print('=' * 30)` for boundary rules, `sep=''` to join receipt numbers, and `sep=': $'` to format price labels:

```python run
print('=' * 30)
print('RECEIPT #', 4092, sep='')
print('Stationery Pack', 350, sep=': $')
print('Sales Tax (5%)', 17.5, sep=': $')
print('-' * 30)
print('Total Due', 367.5, sep=': $')
print('=' * 30)
```

```output
==============================
RECEIPT #4092
Stationery Pack: $350
Sales Tax (5%): $17.5
------------------------------
Total Due: $367.5
==============================
```
:::

## Recap

- The `print()` function displays text and numerical values on the computer terminal.
- Comma-separated arguments are automatically converted to text and joined with a single space.
- The `sep` keyword argument overrides the default space separator between multiple items.
- The `end` keyword argument overrides the default trailing newline character `\n`.
- Escape sequences like `\n` (newline) and `\t` (tab) allow advanced text structuring within string literals.

Reference: Python documentation, Built-in Functions
