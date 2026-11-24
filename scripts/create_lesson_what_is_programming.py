import os
import json
import subprocess
import re

slug = "what-is-programming-and-python"
lesson_dir = f"content/lessons/{slug}"
os.makedirs(lesson_dir, exist_ok=True)

# Generate real outputs
def run_py(code):
    res = subprocess.run(["python3", "-c", code], capture_output=True, text=True)
    if res.returncode != 0:
        raise RuntimeError(f"Code failed:\n{code}\nError: {res.stderr}")
    return res.stdout.rstrip()

def run_err(code):
    res = subprocess.run(["python3", "-c", code], capture_output=True, text=True)
    return res.stderr.strip()

c1 = "print('Welcome to Python programming!')"
o1 = run_py(c1)

c2 = """hours_in_day = 24
minutes_per_hour = 60
seconds_per_minute = 60
total_seconds = hours_in_day * minutes_per_hour * seconds_per_minute
print('Seconds in a standard day:', total_seconds)"""
o2 = run_py(c2)

c3 = """greeting = 'Code'
repeated_banner = greeting * 4
print(repeated_banner)"""
o3 = run_py(c3)

c4 = """print(type(100))
print(type(3.14159))
print(type('Antigravity'))
print(type(True))"""
o4 = run_py(c4)

c5 = """total_runs = 186
overs_bowled = 20
run_rate = total_runs / overs_bowled
print('Match run rate:', round(run_rate, 2))"""
o5 = run_py(c5)

c6 = """celsius_temp = 32
fahrenheit_temp = (celsius_temp * 9 / 5) + 32
print('Temperature in Fahrenheit:', fahrenheit_temp)"""
o6 = run_py(c6)

c7 = """song1_seconds = 215
song2_seconds = 190
song3_seconds = 255
total_minutes = (song1_seconds + song2_seconds + song3_seconds) / 60
print('Playlist duration in minutes:', round(total_minutes, 1))"""
o7 = run_py(c7)

c8 = """ticket_price = 150
attendees = 45
hall_rental = 2500
profit = (ticket_price * attendees) - hall_rental
print('Net concert profit:', profit)"""
o8 = run_py(c8)

c_ex1 = """item_price = 45
quantity = 6
tax_rate = 0.05
subtotal = item_price * quantity
total_cost = subtotal + (subtotal * tax_rate)
print('Total bill:', total_cost)"""
o_ex1 = run_py(c_ex1)

c_ex2 = """distance_km = 42.195
miles_conversion_factor = 0.621371
marathon_miles = distance_km * miles_conversion_factor
print('Marathon distance in miles:', round(marathon_miles, 2))"""
o_ex2 = run_py(c_ex2)

c_ex3 = """principal = 50000
rate_percent = 7.5
time_years = 3
simple_interest = (principal * rate_percent * time_years) / 100
total_maturity = principal + simple_interest
print('Interest earned:', simple_interest)
print('Maturity amount:', total_maturity)"""
o_ex3 = run_py(c_ex3)

err1 = run_err("print('Hello world'")
err2 = run_err("print(pythn)")
err3 = run_err("speed = 100 / 0")

content = f"""---
title: "What is programming and Python"
curriculumTitle: "What is programming and Python"
track: "Python from zero"
module: "M1 Getting started"
order: 1
level: "Beginner"
summary: "Understand what computer programming actually means, how Python translates your thoughts into machine actions, and why Python has become the world's most versatile computing language."
prerequisites: []
learningGoals:
  - "Understand the fundamental distinction between human thought, source code, and machine hardware execution."
  - "Explain how the Python interpreter transforms text into bytecode and executes it via the CPython virtual machine."
  - "Discover the design philosophy, syntax cleanliness, and ecosystem strengths that distinguish Python from compiled languages."
  - "Recognize the primary execution environments including interactive shells, standalone script files, and browser-based WebAssembly runtimes."
relatedProblems: []
---

## What you will learn

- The core definition of **programming** as systematic, sequential problem-solving using formal language instructions.
- How computer hardware interacts with software, moving from high-level source code to low-level electrical signals.
- The fundamental architecture of an **interpreter** versus a traditional ahead-of-time compiler.
- How the reference implementation **CPython** compiles human-readable code into intermediate **bytecode** before running it.
- Why Python's readable design philosophy makes it the premier modern choice for web engineering, scientific computing, automation, and machine learning.

## Why this matters

Every digital convenience you interact with daily—from instant messaging apps and satellite navigation to banking ledgers and music recommendation algorithms—runs on written instructions. Computers possess enormous processing speed and flawless recall, yet they cannot guess intentions or interpret vague requests. Writing software is the process of translating human intuition, logic, and domain rules into unambiguous instructions that hardware can execute without confusion. Learning Python gives you the direct ability to automate tedious everyday tasks, analyze massive datasets, build web services, and command computing systems with remarkable clarity.

## The big idea

Think of a computer as an extraordinarily obedient commercial kitchen assistant who knows how to chop, boil, measure, and stir, but has zero culinary intuition. If you tell this assistant to "make something tasty for lunch," the assistant freezes because "tasty" is subjective and undefined. However, if you hand the assistant a precise, step-by-step recipe that specifies measuring 200 grams of flour, whisking two eggs for ninety seconds, and heating a pan to medium heat, the assistant executes each task flawlessly every single time.

A computer program is that exact recipe. Computer hardware understands only binary machine code—a staggering flood of ones and zeroes representing electrical switch states across billions of microscopic transistors on a silicon chip. Because writing raw binary instructions is tedious and error-prone for human brains, computer scientists created **high-level languages** like Python. Python sits between human natural language and raw silicon hardware. You write clean, expressive text using words like `print`, `for`, and `if`, and the Python engine translates your text into low-level machine instructions behind the scenes.

## Step by step

### 1. Computer instructions and sequential execution

Computers execute instructions sequentially from the top of your file to the bottom, following a strict chronological flow known as the **control flow**. When you instruct Python to display text using the built-in `print()` function, Python reads the statement, evaluates the inner content, and sends the resulting text to your terminal display output.

```python run
{c1}
```

```output
{o1}
```

Line 1 invokes the `print()` function with a text string enclosed in quotes. Python immediately identifies the function call, verifies that the syntax conforms to the language grammar rules, and writes the character stream to the standard output device. Every program begins with simple instructions executed in orderly succession.

### 2. Performing computations and storing intermediate state

A program is far more than static text; it is an active engine for calculating values and tracking changing conditions. When you assign numbers to descriptive labels called **variables**, Python reserves memory storage and links that name to the underlying numerical value. You can then perform arithmetic using standard operators such as multiplication `*`, addition `+`, and division `/`.

```python run
{c2}
```

```output
{o2}
```

In this script, lines 1 through 3 establish three named variables: `hours_in_day`, `minutes_per_hour`, and `seconds_per_minute`. On line 4, Python evaluates the arithmetic expression on the right-hand side of the `=` operator by multiplying twenty-four by sixty, then multiplying the intermediate result by sixty again. Finally, on line 5, `print()` receives a descriptive label alongside the calculated total, outputting both neatly separated by a space.

### 3. Combining text and arithmetic expressions

Python allows expressive manipulation of text data alongside numerical data. When you multiply a text string by an integer, Python does not attempt numerical math; instead, it duplicates the string sequence multiple times.

```python run
{c3}
```

```output
{o3}
```

Line 1 assigns the string `'Code'` to the variable `greeting`. Line 2 applies the multiplication operator `*` between the string and the integer `4`. Python understands that multiplying a sequence by an integer means string repetition, producing the concatenated string `'CodeCodeCodeCode'`. Line 3 prints the combined banner text to the output window.

### 4. High-level types: how Python categorizes data

In Python, every single piece of data has an associated **data type**. The data type informs the Python interpreter about how much memory to allocate, what operations are mathematically valid, and how the value should behave when manipulated. You can inspect the underlying type of any variable or literal using the built-in `type()` function.

```python run
{c4}
```

```output
{o4}
```

Line 1 inspects the whole number `100`, which Python categorizes as `int` (integer). Line 2 inspects `3.14159`, which Python identifies as `float` (floating-point decimal number). Line 3 checks `'Antigravity'`, identifying it as `str` (string of textual characters). Line 4 evaluates `True`, identifying it as `bool` (Boolean logic state). Python dynamically determines these types at runtime without forcing you to write explicit type declarations beforehand.

### 5. Solving real domain problems: cricket run rates

To appreciate the power of software, consider how programming simplifies real calculations. In cricket, a team's run rate represents the average number of runs scored per six-ball over. Calculating this manually during a live match requires dividing total runs by overs bowled and rounding the decimal output.

```python run
{c5}
```

```output
{o5}
```

Line 1 records the total runs scored (`186`). Line 2 records completed overs (`20`). Line 3 calculates the quotient using the division operator `/`. Division in Python always yields a floating-point number. Line 4 uses Python's built-in `round()` function to limit the display to two decimal places, presenting a clear match metric of `9.3`.

### 6. Converting environmental data: temperature scales

Weather sensors across different regions record temperature in Celsius or Fahrenheit. Software acts as the universal bridge that ingests raw telemetry, applies exact mathematical transformations, and displays standardized readouts.

```python run
{c6}
```

```output
{o6}
```

Line 1 records a comfortable summer temperature of `32` degrees Celsius. Line 2 applies the standard conversion formula: multiply by nine, divide by five, and add thirty-two. Python evaluates parenthesized expressions first, adhering strictly to mathematical precedence rules. Line 3 prints the converted temperature of `89.6` Fahrenheit.

### 7. Tracking digital media: music playlist durations

Digital audio players store individual track lengths in seconds. To present human-friendly playlist summaries, audio software aggregates track seconds and converts them into decimal minutes.

```python run
{c7}
```

```output
{o7}
```

Lines 1 through 3 declare durations for three consecutive songs in seconds. Line 4 calculates the total sum within parentheses and divides by sixty to convert the duration to minutes. Line 5 rounds the resulting float to one decimal place, informing the listener that their playlist runs for approximately `11.0` minutes.

### 8. Financial modeling: event profit calculation

Software is the backbone of commercial accounting. By modeling ticket sales, attendance metrics, and fixed venue expenses, a simple script can project financial viability before an event occurs.

```python run
{c8}
```

```output
{o8}
```

Line 1 sets the admission ticket price to `150` dollars. Line 2 records `45` registered attendees. Line 3 defines the fixed hall rental fee of `2500` dollars. Line 4 calculates gross ticket revenue (`150 * 45 = 6750`) and subtracts the venue cost, storing the net profit of `4250`. Line 5 prints the financial summary.

## What Python is doing behind the scenes

When you click "Run" or pass a `.py` script to Python, your computer does not directly feed characters like `p-r-i-n-t` to the central processing unit (CPU). Instead, Python executes a multi-stage translation pipeline managed by **CPython**, the standard reference implementation written in the C language:

| Stage | Name | What happens during this phase |
| :--- | :--- | :--- |
| **Stage 1** | **Lexical Analysis (Tokenizing)** | The interpreter scans raw source text and breaks characters into discrete linguistic tokens (`NAME`, `OP`, `NUMBER`, `STRING`). |
| **Stage 2** | **Parsing (AST Construction)** | The parser arranges tokens into an **Abstract Syntax Tree (AST)**, validating grammatical rules and structural relationships. |
| **Stage 3** | **Bytecode Compilation** | The compiler traverses the AST and generates compact, platform-independent virtual instructions called **bytecode** (cached in `.pyc` files). |
| **Stage 4** | **Virtual Machine Execution** | The **Python Virtual Machine (PVM)** loops through bytecode instructions one by one, executing low-level C functions on your computer's CPU. |

```mermaid
flowchart LR
    A["Source Code (.py)"] --> B["Tokenizer (Tokens)"]
    B --> C["Parser (Syntax Tree)"]
    C --> D["Bytecode (.pyc)"]
    D --> E["Python Virtual Machine"]
    E --> F["CPU Execution & Output"]
```

Because this entire pipeline happens automatically in memory within fractions of a millisecond, Python gives you the immediate feedback of an interpreted scripting language while leveraging compiled bytecode execution under the hood.

## Common mistakes

### 1. Forgetting closing parentheses or quotation marks

Because Python parses code strictly according to formal syntax rules, omitting a closing parenthesis or quotation mark causes the parser to fail before execution even starts.

Broken code:
```python
print("Hello world"
```

Real error message:
```output
{err1}
```

How to fix it: ensure every opening parenthesis `(` has a matching closing parenthesis `)`, and every opening quote has an identical closing quote:
```python run
print("Hello world")
```

```output
Hello world
```

### 2. Misspelling identifiers and function names

Python is strictly case-sensitive and literal. If you mistype a variable name or function identifier, Python searches its namespace, fails to locate the identifier, and raises a runtime exception.

Broken code:
```python
print(pythn)
```

Real error message:
```output
{err2}
```

How to fix it: inspect your spelling carefully. If you intended to print a literal string of text, enclose it in quotes. If you intended to print a variable, verify that the variable was assigned earlier with the exact same spelling:
```python run
python_name = "Python 3.12"
print(python_name)
```

```output
Python 3.12
```

### 3. Attempting mathematically impossible operations

Computers adhere to formal mathematical laws. Dividing any number by zero is mathematically undefined, and Python immediately halts execution with an explicit exception rather than producing corrupted state.

Broken code:
```python
speed = 100 / 0
```

Real error message:
```output
{err3}
```

How to fix it: verify that denominator values are positive or negative non-zero numbers before performing division:
```python run
distance = 100
time_elapsed = 2
speed = distance / time_elapsed
print("Calculated speed:", speed)
```

```output
Calculated speed: 50.0
```

## Cheat sheet

| Concept | Python Syntax Example | Description |
| :--- | :--- | :--- |
| **Display output** | `print("Hello!")` | Transmits text and evaluated expressions to standard output |
| **Assign variable** | `score = 95` | Binds a descriptive name to a value stored in memory |
| **Inspect type** | `type(42)` | Returns the underlying class (`int`, `float`, `str`, `bool`) |
| **Arithmetic** | `total = 10 + (5 * 2)` | Evaluates mathematical expressions following operator precedence |
| **String repetition** | `"Na" * 4` | Concatenates multiple copies of a text sequence |
| **Decimal rounding** | `round(3.14159, 2)` | Rounds a floating-point number to specified decimal places |
| **Line comment** | `# Explain logic here` | Ignored by the Python interpreter; documents intent for human readers |

## Try it yourself

### Exercise 1 (easy): Grocery invoice subtotal

Write a script that calculates the total cost of purchasing `6` units of an organic beverage priced at `45` rupees each, applying a `5%` tax rate (`0.05`). Compute the subtotal, calculate tax, and print the final invoice total.

```python run
item_price = 45
quantity = 6
tax_rate = 0.05
subtotal = item_price * quantity
total_cost = subtotal + (subtotal * tax_rate)
print('Total bill:', total_cost)
```

:::solution Solution
Multiply item price by quantity to derive the subtotal, multiply the subtotal by tax rate to compute additional tax, and sum both values.

```python run
{c_ex1}
```
:::

### Exercise 2 (medium): Marathon distance converter

A standard marathon course covers exactly `42.195` kilometers. Write a program that converts this distance into miles using the conversion factor `1 kilometer = 0.621371 miles`. Round the resulting mileage to two decimal places before printing.

```python run
distance_km = 42.195
miles_conversion_factor = 0.621371
marathon_miles = distance_km * miles_conversion_factor
print('Marathon distance in miles:', round(marathon_miles, 2))
```

:::solution Solution
Multiply the distance in kilometers by the conversion factor and pass the product to `round(value, 2)`:

```python run
{c_ex2}
```
:::

### Exercise 3 (challenge): Simple interest financial maturity

Write a script that calculates simple interest on a principal deposit of `50000` currency units invested at an annual interest rate of `7.5%` for `3` years. Use the formula `interest = (principal * rate * time) / 100`, calculate the total maturity balance (`principal + interest`), and print both metrics clearly.

```python run
principal = 50000
rate_percent = 7.5
time_years = 3
simple_interest = (principal * rate_percent * time_years) / 100
total_maturity = principal + simple_interest
print('Interest earned:', simple_interest)
print('Maturity amount:', total_maturity)
```

:::solution Solution
Multiply principal, rate, and time, divide by 100 to yield interest, then add the interest back to principal for total maturity value:

```python run
{c_ex3}
```
:::

## Recap

- **Programming** is the disciplined process of writing clear, ordered instructions to automate calculations and solve problems.
- Computer hardware understands binary electrical signals; high-level languages like **Python** allow humans to express complex logic using natural syntax.
- The standard **CPython** engine translates your source code into intermediate **bytecode**, which executes inside the Python Virtual Machine.
- Every piece of data in Python belongs to a specific **data type**, such as integers (`int`), floating-point numbers (`float`), and strings (`str`).
- Python executes statements sequentially from top to bottom, halting immediately with an informative traceback when it encounters syntax errors or invalid arithmetic.

Reference: Python documentation, General Python FAQ
"""

with open(f"{lesson_dir}/lesson.md", "w", encoding="utf-8") as f:
    f.write(content)

# Now create quiz.json
quiz = [
    {
        "question": "What primary role does the Python interpreter perform when you run a program?",
        "options": [
            "It physically solders electrical connections on your motherboard to match your code.",
            "It translates your human-readable source code into bytecode and executes it via a virtual machine.",
            "It permanently converts your computer's operating system into raw assembly instructions.",
            "It compiles your Python code into a standalone hardware microchip."
        ],
        "correctIndex": 1,
        "explanation": "The Python interpreter (such as CPython) parses human-readable text into an abstract syntax tree, compiles it into platform-independent bytecode, and executes those instructions on the Python Virtual Machine. It does not alter hardware or permanently reflash the operating system."
    },
    {
        "question": "What is the primary operational difference between high-level programming languages and machine code?",
        "options": [
            "High-level languages can only solve simple addition, whereas machine code solves calculus.",
            "High-level languages use human-readable syntax and abstraction, whereas machine code consists of raw binary instructions executed directly by the CPU.",
            "High-level languages run without requiring electrical power on the host computer.",
            "Machine code requires a web browser to run, whereas high-level languages do not."
        ],
        "correctIndex": 1,
        "explanation": "High-level languages like Python provide readable words, structured data types, and logical operators that abstract away hardware specifics. Machine code consists of raw binary bits (1s and 0s) that the CPU's arithmetic logic unit decodes directly."
    },
    {
        "question": "What output is produced by evaluating the expression `print('Py' * 3)`?",
        "options": [
            "Py 3",
            "PyPyPy",
            "TypeError: unsupported operand type",
            "9"
        ],
        "correctIndex": 1,
        "explanation": "In Python, multiplying a string by an integer duplicates the string sequence without spaces. Multiplying `'Py'` by `3` yields `'PyPyPy'`. It does not calculate numbers or raise an error."
    },
    {
        "question": "Which of the following built-in functions reports the underlying data type of a value in Python?",
        "options": [
            "typeof()",
            "inspect()",
            "type()",
            "classof()"
        ],
        "correctIndex": 2,
        "explanation": "Python provides the built-in function `type()` to inspect the runtime category of any object, returning types such as `<class 'int'>` or `<class 'str'>`. Keywords like `typeof` belong to JavaScript, not Python."
    },
    {
        "question": "Why does Python evaluate `186 / 20` to `9.3` as a float rather than an integer `9`?",
        "options": [
            "Because Python 3 division with a single forward slash `/` always performs true floating-point division.",
            "Because 186 is an imaginary number in standard arithmetic.",
            "Because the terminal display automatically appends decimals to all whole numbers.",
            "Because Python was unable to find an exact whole factor."
        ],
        "correctIndex": 0,
        "explanation": "In Python 3, the single slash operator `/` denotes true division, always returning a `float` even when numbers divide evenly (e.g. `4 / 2` yields `2.0`). Floor division that truncates to an integer requires the `//` operator."
    },
    {
        "question": "What happens if you attempt to execute the line `result = 45 / 0` in Python?",
        "options": [
            "Python assigns `result` the value `Infinity` and continues execution silently.",
            "Python rounds the output to 0.",
            "Python raises a `ZeroDivisionError` and halts execution.",
            "Python restarts the host operating system."
        ],
        "correctIndex": 2,
        "explanation": "Division by zero is mathematically undefined. Python immediately stops execution and raises a `ZeroDivisionError` exception with an informative traceback, preventing corrupted numerical calculations."
    },
    {
        "question": "What is the primary role of Python's intermediate bytecode (`.pyc` files)?",
        "options": [
            "To encrypt source code so that no other programmer can read it.",
            "To cache parsed, pre-compiled virtual machine instructions, speeding up subsequent program startup times.",
            "To convert Python scripts into HTML web pages automatically.",
            "To compress text files so they consume less space on USB drives."
        ],
        "correctIndex": 1,
        "explanation": "Bytecode represents an intermediate stage between human source text and machine hardware. CPython caches compiled bytecode in `__pycache__` directories to bypass the tokenizing and parsing phases on future executions when source files haven't changed."
    },
    {
        "question": "Which error will Python raise if you execute `print(score)` before assigning any value to `score`?",
        "options": [
            "SyntaxError: invalid syntax",
            "NameError: name 'score' is not defined",
            "TypeError: unsupported operand",
            "ValueError: invalid literal"
        ],
        "correctIndex": 1,
        "explanation": "When Python encounters an identifier that has not been defined in the local, global, or built-in namespace, it raises a `NameError`. It is not a syntax error because the grammar `print(identifier)` is syntactically valid."
    },
    {
        "question": "What happens if a program contains a `SyntaxError` on line 10 of a 20-line file?",
        "options": [
            "Lines 1 through 9 execute, and then the program halts on line 10.",
            "The program will not execute any lines because Python's parser fails during the compilation phase before execution begins.",
            "Python skips line 10 and executes lines 11 through 20.",
            "Python automatically corrects the syntax error and runs the entire file."
        ],
        "correctIndex": 1,
        "explanation": "Syntax errors are caught during the parsing phase before the Python Virtual Machine executes any runtime instructions. Because the parser cannot construct a valid Abstract Syntax Tree, the script does not start running at all."
    }
]

with open(f"{lesson_dir}/quiz.json", "w", encoding="utf-8") as f:
    json.dump(quiz, f, indent=2)

print(f"Successfully generated {slug}")
