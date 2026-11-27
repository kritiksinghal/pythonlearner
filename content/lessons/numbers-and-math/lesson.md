---
title: "Numbers and math"
curriculumTitle: "Numbers and math"
track: "Python from zero"
module: "M1 Getting started"
order: 4
level: "Beginner"
summary: "Understand Python's integer and floating-point representations, master the seven fundamental arithmetic operators, evaluate operator precedence, and apply built-in mathematical functions."
prerequisites:
  - "what-is-programming-and-python"
  - "your-first-program-with-print"
  - "variables-and-types"
learningGoals:
  - "Differentiate between exact arbitrary-precision integers (`int`) and binary IEEE 754 floating-point decimals (`float`)."
  - "Master all seven core arithmetic operators including true division `/`, floor division `//`, modulo `%`, and exponentiation `**`."
  - "Apply standard operator precedence (PEMDAS) and parentheses to control complex numerical evaluation order."
  - "Utilize built-in mathematical functions including `abs()`, `round()`, `min()`, `max()`, and augmented assignment operators."
relatedProblems: []
---
## What you will learn

- The architectural differences between exact whole numbers (**integers**) and real decimal numbers (**floats**).
- How to make large numeric literals readable using underscore digit separators like `1_000_000`.
- The distinct roles of true division `/` versus integer floor division `//`.
- How the modulo operator `%` extracts remainders for divisibility, cyclical clocks, and batch grouping.
- Calculating powers and compound growth using the exponentiation operator `**`.
- Using operator precedence rules (PEMDAS) to eliminate order-of-operation calculation bugs.
- Applying built-in utility functions including `abs()`, `round()`, `min()`, and `max()`.
- Updating variable values in-place with augmented assignment operators (`+=`, `-=`, `*=`, `/=`).

## Why this matters

Virtually every computational task reduces to arithmetic operations at some level. A video game engine calculates geometric distances between players and walls; an e-commerce platform applies promotional percentage discounts and calculates shipping taxes; a meteorological model computes pressure gradients to forecast storm trajectories; and a financial portfolio compounds interest across thousands of investment assets. Mastering Python's numerical representations and arithmetic operators ensures that your software models real-world physics and commerce accurately, avoiding rounding errors, overflow issues, and division hazards.

## The big idea

Think of Python's numerical system like two distinct measuring instruments in a carpentry workshop: a rigid steel counting ruler with engraved centimeter notches, and an elastic measuring tape marked with microscopic millimeter fractions.

When you count whole physical items—like 12 chairs, 4 wheels, or 7 concert tickets—you use the rigid ruler. You cannot buy 3.4 chairs; you have whole integer counts. This is Python's **`int`** type. Python integers have arbitrary precision, meaning they can grow to hundreds of digits without ever losing accuracy.

When you measure physical quantities that vary continuously—like 72.4 kilograms, 36.6 degrees Celsius, or 18.25 liters of gasoline—you use the flexible measuring tape. This is Python's **`float`** type. Because computers store floating-point fractions using binary electrical switches (powers of 1/2, 1/4, 1/8) rather than decimal tenths (1/10), floating-point numbers represent real-world measurements with immense range, but occasionally display tiny binary rounding approximations (such as `0.1 + 0.2` equalling `0.30000000000000004`). Knowing which tool to apply ensures your programs calculate exact outcomes every time.

## Step by step

### 1. Integers and underscore digit separators

Integers represent whole positive and negative numbers without fractional parts. In Python 3, integers have no fixed 32-bit or 64-bit size limit; they expand dynamically to fit whatever magnitude your system memory supports. To improve code readability when writing large numbers, Python allows underscores `_` as visual digit separators.

```python run
wallet_balance = 1_500_000
deposit = 250_000
total_assets = wallet_balance + deposit
print('Total balance with digit separators:', total_assets)
```

```output
Total balance with digit separators: 1750000
```

In lines 1 and 2, `1_500_000` and `250_000` use underscores to group thousands. The Python interpreter ignores underscores entirely during parsing, treating the numbers as ordinary integers `1500000` and `250000`. The addition on line 3 calculates the total `1750000` cleanly.

### 2. Dividing numbers: true division versus floor division

Python provides two division operators that serve different mathematical purposes:
- **True division (`/`)**: Always returns a floating-point number, even if the division divides evenly (e.g., `10 / 2` yields `5.0`).
- **Floor division (`//`)**: Truncates any decimal fraction and returns the largest whole integer less than or equal to the quotient.
- **Modulo (`%`)**: Returns the leftover remainder after integer division.

```python run
total_eggs = 58
carton_size = 12
full_cartons = total_eggs // carton_size
leftover_eggs = total_eggs % carton_size
print('Full cartons:', full_cartons)
print('Leftover eggs:', leftover_eggs)
```

```output
Full cartons: 4
Leftover eggs: 10
```

Here, `58 // 12` calculates how many full cartons of 12 can be filled from 58 eggs, yielding `4`. Meanwhile, `58 % 12` calculates the leftover eggs that do not fill a carton, yielding `10`. Combining `//` and `%` allows you to split quantities into discrete bundles with remainders.

### 3. Exponentiation: calculating powers

To raise a number to a power, use the double asterisk operator `**`. Do not use the caret `^`, which in Python represents the bitwise XOR operator, not mathematical exponentiation.

```python run
side_length = 5
cube_volume = side_length ** 3
two_to_the_tenth = 2 ** 10
print('Cube volume:', cube_volume)
print('2 raised to 10:', two_to_the_tenth)
```

```output
Cube volume: 125
2 raised to 10: 1024
```

Line 2 calculates five cubed (`5 * 5 * 5 = 125`). Line 3 calculates two to the tenth power (`1024`), a fundamental number in digital byte storage. The `**` operator works with both integers and floating-point fractional exponents (e.g., `16 ** 0.5` computes the square root of 16).

### 4. Operator precedence: PEMDAS and explicit grouping

When multiple operators appear in a single expression, Python resolves them according to strict **operator precedence** rules:
1. **Parentheses `()`**: Expressions enclosed in parentheses evaluate first.
2. **Exponentiation `**`**: Evaluates from right to left.
3. **Multiplication `*`, True Division `/`, Floor Division `//`, Modulo `%`**: Evaluates from left to right.
4. **Addition `+`, Subtraction `-`**: Evaluates from left to right.

```python run
test1 = 82
test2 = 91
test3 = 76
average_score = (test1 + test2 + test3) / 3
print('Exact average:', average_score)
print('Rounded to 1 decimal:', round(average_score, 1))
```

```output
Exact average: 83.0
Rounded to 1 decimal: 83.0
```

Line 4 wraps `test1 + test2 + test3` inside parentheses. This forces Python to sum the three scores (`249`) before dividing by `3`, producing the correct average of `83.0`. Without parentheses, division would bind to `test3` alone, resulting in a severe logic error.

### 5. Absolute values with `abs()`

The built-in function `abs()` returns the non-negative magnitude of a number, stripping away negative signs.

```python run
loss = -450
depth = -12.8
print('Absolute financial loss:', abs(loss))
print('Absolute elevation depth:', abs(depth))
```

```output
Absolute financial loss: 450
Absolute elevation depth: 12.8
```

On line 3, `abs(-450)` converts the negative financial loss into an absolute magnitude of `450`. On line 4, `abs(-12.8)` converts negative elevation into a positive distance of `12.8`.

### 6. Finding extremes with `min()` and `max()`

Python includes built-in `min()` and `max()` functions that accept any quantity of numerical arguments and return the smallest or largest value respectively.

```python run
score_a = 88
score_b = 94
score_c = 72
highest = max(score_a, score_b, score_c)
lowest = min(score_a, score_b, score_c)
print('Top mark:', highest)
print('Lowest mark:', lowest)
```

```output
Top mark: 94
Lowest mark: 72
```

Passing three numerical exam scores to `max()` identifies `94` as the top score, while `min()` extracts `72` as the lowest score without requiring complex comparison statements.

### 7. Updating values in place: augmented assignment

You frequently need to update an existing variable by adding to it, multiplying it, or subtracting an amount. Python provides **augmented assignment operators** such as `+=`, `-=`, `*=`, and `/=` as convenient shorthands for `variable = variable + value`.

```python run
points = 100
points += 25
points *= 2
points -= 10
print('Final game points:', points)
```

```output
Final game points: 240
```

Line 2 updates `points` from 100 to 125 (`points = points + 25`). Line 3 doubles the score to 250 (`points = points * 2`). Line 4 subtracts 10, leaving `points` at `240`.

### 8. Floating-point precision reality

Because computers store floating-point numbers in binary base-2 registers, fractions like 1/10 cannot be represented with perfect decimal precision, leading to small approximation artifacts.

```python run
float_sum = 0.1 + 0.2
print('Raw binary float sum:', float_sum)
print('Clean rounded float:', round(float_sum, 2))
```

```output
Raw binary float sum: 0.30000000000000004
Clean rounded float: 0.3
```

In pure binary floating-point representation, `0.1 + 0.2` produces `0.30000000000000004`. Whenever you present floating-point results to users, use `round(value, decimal_places)` to display clean human-readable numbers.

## What Python is doing behind the scenes

Under the hood, Python represents numbers using two completely different internal C data structures inside the CPython runtime:

| Data Type | Internal C Representation | Precision Limit | Use Case |
| :--- | :--- | :--- | :--- |
| **`int`** | Variable-length array of 30-bit digits (`PyLongObject`) | **Unlimited** (bounded only by total system RAM) | Counting items, IDs, loop counters, cryptography |
| **`float`** | Standard 64-bit double (`double` in C / IEEE 754) | **53 bits of precision** (~15–17 decimal digits) | Physical measurements, coordinates, probabilities |

Tracing how Python evaluates the expression `result = 14 // 4 + 3 * 2 ** 2`:

| Step | Operation Identified | Sub-expression Evaluated | Intermediate State |
| :--- | :--- | :--- | :--- |
| **1** | Exponentiation `**` (highest precedence) | `2 ** 2` | `4` |
| **2** | Floor division `//` (leftmost multiplicative) | `14 // 4` | `3` |
| **3** | Multiplication `*` (multiplicative) | `3 * 4` | `12` |
| **4** | Addition `+` (additive) | `3 + 12` | `15` |
| **5** | Variable binding `=` | `result = 15` | Stored in namespace |

## Common mistakes

### 1. Division by zero with `/` or `//`

Dividing any number by zero is mathematically undefined. Python halts execution immediately with an explicit `ZeroDivisionError`.

Broken code:
```python
quotient = 100 // 0
```

Real error message:
```output
Traceback (most recent call last):
  File "<string>", line 1, in <module>
    quotient = 100 // 0
               ~~~~^^~~
ZeroDivisionError: integer division or modulo by zero
```

How to fix it: verify that divisor variables contain non-zero values before performing division or modulo operations:
```python run
total_amount = 100
divisor = 4
quotient = total_amount // divisor
print("Safe quotient:", quotient)
```

```output
Safe quotient: 25
```

### 2. Forgetting parentheses when computing averages

A classic beginner error is writing `a + b / 2`. Because division `/` has higher precedence than addition `+`, Python divides `b` by two first, then adds `a`.

Broken code:
```python
exam1 = 80
exam2 = 90
wrong_avg = exam1 + exam2 / 2
print("Incorrect average:", wrong_avg)
```

Actual output:
```output
Incorrect average: 125.0
```

How to fix it: wrap the addition inside parentheses `(exam1 + exam2)` to enforce addition before division:
```python run
exam1 = 80
exam2 = 90
correct_avg = (exam1 + exam2) / 2
print("Correct average:", correct_avg)
```

```output
Correct average: 85.0
```

### 3. Mixing text strings and numbers in arithmetic

Python will not automatically convert a text string containing digits into an integer during arithmetic operations. Attempting to add an `int` to a `str` raises a `TypeError`.

Broken code:
```python
calc = 5 + '10'
```

Real error message:
```output
Traceback (most recent call last):
  File "<string>", line 1, in <module>
    calc = 5 + '10'
           ~~^~~~~~
TypeError: unsupported operand type(s) for +: 'int' and 'str'
```

How to fix it: convert the string to an integer explicitly using `int()` before calculating:
```python run
number_val = int("10")
calc = 5 + number_val
print("Calculated sum:", calc)
```

```output
Calculated sum: 15
```

## Cheat sheet

| Operator / Function | Syntax Example | Math Operation | Result |
| :--- | :--- | :--- | :--- |
| **Addition** | `15 + 4` | Sum | `19` |
| **Subtraction** | `15 - 4` | Difference | `11` |
| **Multiplication** | `15 * 4` | Product | `60` |
| **True Division** | `15 / 4` | True quotient (float) | `3.75` |
| **Floor Division** | `15 // 4` | Truncated quotient | `3` |
| **Modulo** | `15 % 4` | Remainder | `3` |
| **Exponentiation** | `2 ** 4` | Power ($2^4$) | `16` |
| **Absolute value** | `abs(-25)` | Magnitude | `25` |
| **Rounding** | `round(3.14159, 2)` | Decimal rounding | `3.14` |
| **Minimum** | `min(4, 9, 2)` | Lowest value | `2` |
| **Maximum** | `max(4, 9, 2)` | Highest value | `9` |

## Try it yourself

### Exercise 1 (easy): Vehicle fuel economy

Use `distance_km` and `fuel_liters` as the sample data. A commuter travels `450` kilometers on a road trip using `30` liters of fuel. Write a script that calculates fuel efficiency in kilometers per liter (`km / liters`) and prints the result. Print the result exactly as shown in Expected output.


:::tip Hint
Use the lesson idea about numbers and math. Trace the sample values before printing so you can check each step.
:::

```sample input
distance_km = 450
fuel_liters = 30
```

```expected
Fuel efficiency (km/L): 15.0
```

```python run
# Complete the Exercise 1 (easy): Vehicle fuel economy task.
distance_km = 450
fuel_liters = 30
# Write your code below
```


:::solution Solution
Divide the total distance traveled by total liters consumed using the true division operator `/`:

```python run
distance_km = 450
fuel_liters = 30
km_per_liter = distance_km / fuel_liters
print('Fuel efficiency (km/L):', km_per_liter)
```

```output
Fuel efficiency (km/L): 15.0
```
:::

### Exercise 2 (medium): ATM currency note breakdown

Break `amount_rupees` into 500, 100, and 10 rupee notes using `//` and `%`. Print each note count.


:::tip Hint
Use the lesson idea about numbers and math. Trace the sample values before printing so you can check each step.
:::

```sample input
total_rupees = 1870
```

```expected
500 notes: 3
100 notes: 3
10 notes: 7
```

```python run
# Complete the Exercise 2 (medium): ATM currency note breakdown task.
total_rupees = 1870
# Write your code below
```


:::solution Solution
Use integer floor division `//` to determine the count of notes for each denomination, and modulo `%` to extract the remaining balance for the next lower note:

```python run
total_rupees = 1870
notes_500 = total_rupees // 500
rem_after_500 = total_rupees % 500
notes_100 = rem_after_500 // 100
rem_after_100 = rem_after_500 % 100
notes_10 = rem_after_100 // 10
print('500 notes:', notes_500)
print('100 notes:', notes_100)
print('10 notes:', notes_10)
```

```output
500 notes: 3
100 notes: 3
10 notes: 7
```
:::

### Exercise 3 (challenge): Compound investment growth

Use `principal`, `annual_rate`, and `years` to calculate compound interest. Print the maturity balance and profit to two decimals.

:::tip Hint
Use the lesson idea about numbers and math. Trace the sample values before printing so you can check each step.
:::

```sample input
principal = 10000
annual_rate = 0.08
```

```expected
Maturity balance: 14693.28
Compound interest profit: 4693.28
```

```python run
# Complete the Exercise 3 (challenge): Compound investment growth task.
principal = 10000
annual_rate = 0.08
# Write your code below
```


:::solution Solution
Use `(1 + annual_rate) ** years` to compute the compound multiplier, multiply by principal, and round the final numbers:

```python run
principal = 10000
annual_rate = 0.08
years = 5
final_amount = principal * ((1 + annual_rate) ** years)
profit_earned = final_amount - principal
print('Maturity balance:', round(final_amount, 2))
print('Compound interest profit:', round(profit_earned, 2))
```

```output
Maturity balance: 14693.28
Compound interest profit: 4693.28
```
:::

## Recap

- Python represents numbers as arbitrary-precision **integers** (`int`) or double-precision **floats** (`float`).
- Large numbers can include underscores (e.g., `1_000_000`) to enhance human readability without affecting numeric values.
- True division `/` always produces a `float`, while floor division `//` truncates the decimal remainder.
- Modulo `%` extracts the integer remainder, which is essential for determining divisibility and cyclical schedules.
- Exponentiation is performed with `**`, not `^`.
- Parentheses `()` override standard PEMDAS precedence and should always be used to group complex mathematical expressions.

Reference: Python documentation, Numeric Types — int, float, complex
