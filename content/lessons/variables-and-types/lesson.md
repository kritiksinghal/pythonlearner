---
title: "Variables and types"
curriculumTitle: "Variables and types"
track: "Python from zero"
module: "M1 Getting started"
order: 1
level: "Beginner"
summary: "Learn how to store data in variables and work with the four core Python types: integers, floats, strings, and booleans."
prerequisites: []
learningGoals:
  - "Store and update data in variables"
  - "Recognize the 4 core Python types: int, float, str, bool"
  - "Convert between types using int(), float(), str()"
  - "Perform basic math calculations with variables"
relatedProblems:
  - "count-vowels"
---

## What you will learn

- How to create a **variable** and store data in it
- The difference between the four main types: **int**, **float**, **str**, and **bool**
- How to do math with numbers and join text with strings
- How to check and change the type of a value
- The rules for naming your variables

## Why this matters

Every program you will ever write needs to remember information. A game remembers your score. A weather app remembers the temperature. An online store remembers item prices. Variables are how programs hold on to that information while the code runs. Without variables, every piece of data would vanish the moment you moved to the next line. Understanding types matters because Python treats the number `5` differently from the text `"5"`. Mixing them up causes errors that confuse beginners constantly.

## The big idea

A **variable** is a named container that holds one piece of data. Think of it like a **labelled sticky note** you can stick on the fridge. You write "eggs" on the note, and later you read the note to know what to buy. You can also scratch out "eggs" and write "milk" — the label stays, but the contents change.

In Python, you create a variable by writing a name, then `=`, then the value you want to store. The `=` sign is called the **assignment operator**. It does not mean "equals" in the math sense — it means "store this value inside this name."

Every value in Python has a **type**. The type tells Python what kind of data it is and what operations are allowed. The four types you will use constantly are:

- **int** — whole numbers like `0`, `42`, `-7`
- **float** — decimal numbers like `3.14`, `0.5`, `-2.0`
- **str** — text wrapped in quotes like `"hello"`, `'world'`
- **bool** — `True` or `False` (always with a capital letter)

## Step by step

### Creating your first variable

To create a variable, pick a name and use `=` to assign a value. Python remembers this value until you change it or the program ends.

```python run
name = "Priya"
print(name)
```

```output
Priya
```

**Line by line:** Line 1 creates a variable called `name` and stores the text `"Priya"` inside it. Line 2 calls `print()`, which looks up whatever is stored in `name` and displays it on screen.

### Changing a variable's value

A variable is not permanent. You can assign a new value to the same name at any time. The old value is forgotten.

```python run
score = 85
print(score)
score = 92
print(score)
```

```output
85
92
```

**Line by line:** Line 1 stores `85` in `score`. Line 2 prints `85`. Line 3 overwrites `score` with `92` — the number `85` is gone. Line 4 prints the new value, `92`. This is called **reassignment**.

### Working with integers and floats

An **integer** (`int`) is a whole number with no decimal point. A **float** is a number that has a decimal point, even if the decimal part is zero (like `7.0`).

```python run
whole = 7
fraction = 3.14
print(whole)
print(fraction)
```

```output
7
3.14
```

Python automatically decides whether a number is an `int` or `float` based on whether you include a decimal point.

### Doing math with variables

You can use `+`, `-`, `*`, and `/` to do arithmetic. Python follows the normal math order of operations (multiplication before addition).

```python run
price = 250
quantity = 3
total = price * quantity
print(total)
```

```output
750
```

**Line by line:** `price` holds `250`, `quantity` holds `3`. Line 3 multiplies them and stores the result (`750`) in a new variable called `total`. Line 4 prints `750`.

Two operators that may be new to you are `//` (floor division, which drops the decimal) and `%` (modulo, which gives the remainder after division).

```python run
minutes = 135
hours = minutes // 60
leftover = minutes % 60
print(hours)
print(leftover)
```

```output
2
15
```

**Line by line:** `135 // 60` gives `2` (how many full hours), and `135 % 60` gives `15` (the remaining minutes). These two operators are incredibly useful for time, pagination, and checking whether a number is even or odd.

### Working with strings

A **string** (`str`) is a sequence of characters wrapped in quotes. You can use double quotes `"hello"` or single quotes `'hello'` — they behave the same way.

You can join two strings together using `+`. This is called **concatenation**.

```python run
greeting = "Hello"
name = "Aarav"
message = greeting + ", " + name + "!"
print(message)
```

```output
Hello, Aarav!
```

**Line by line:** Python glues the four string pieces together: `"Hello"` + `", "` + `"Aarav"` + `"!"` to produce `"Hello, Aarav!"`.

You can also multiply a string by an integer to repeat it, and use `len()` to count the characters.

```python run
line = "-" * 20
print(line)
print(len(line))
```

```output
--------------------
20
```

### Understanding booleans

A **boolean** (`bool`) can only be one of two values: `True` or `False`. Notice the capital first letter — `true` (lowercase) would cause an error.

Booleans come up everywhere in programming: "Is the user logged in?", "Is the temperature above freezing?", "Did the payment go through?" You will use them heavily when you learn about `if` statements.

```python run
is_raining = True
has_umbrella = False
print(is_raining)
print(has_umbrella)
```

```output
True
False
```

### Checking a value's type

If you are ever unsure what type a value is, use the built-in `type()` function.

```python run
print(type(42))
print(type(3.14))
print(type("hello"))
print(type(True))
```

```output
<class 'int'>
<class 'float'>
<class 'str'>
<class 'bool'>
```

The output `<class 'int'>` means the value is an integer. You will see this output format a lot when debugging.

### Converting between types

Sometimes you need to change a value from one type to another. Python provides three conversion functions: `int()`, `float()`, and `str()`.

```python run
text_number = "50"
real_number = int(text_number)
result = real_number + 10
print(result)
print(type(real_number))
```

```output
60
<class 'int'>
```

**Line by line:** `"50"` is a string, not a number. `int("50")` converts it to the integer `50`. Now you can do math with it. This is essential when you later read user input, because `input()` always returns a string.

Converting a float to an int drops the decimal part without rounding:

```python run
temperature = 36.7
rounded = int(temperature)
print(rounded)
```

```output
36
```

`int()` does not round — it chops off the decimal. `36.7` becomes `36`, not `37`. If you want proper rounding, use the built-in `round()` function instead.

### Naming rules and conventions

Python has strict rules for variable names:

- Names can contain letters, digits, and underscores.
- Names must start with a letter or underscore, never a digit.
- Names are **case-sensitive** — `Score`, `score`, and `SCORE` are three different variables.
- You cannot use Python's reserved keywords (`if`, `while`, `class`, `True`, etc.) as variable names.

The standard convention in Python is **snake_case**: lowercase words separated by underscores.

```python run
student_name = "Ravi"
studentAge = 17
MAX_SCORE = 100
print(student_name, studentAge, MAX_SCORE)
```

```output
Ravi 17 100
```

All three names are valid, but `student_name` follows the Python convention. `studentAge` is camelCase (common in other languages but not recommended in Python). `MAX_SCORE` in ALL_CAPS is the convention for constants — values you intend never to change.

## What Python is doing behind the scenes

When you write `score = 85`, Python does two things internally:

1. It creates the value `85` somewhere in memory.
2. It makes the name `score` point to that memory location.

When you later write `score = 92`, Python creates a new value `92` in memory and makes `score` point to the new location. The old `85` is no longer referenced and Python eventually cleans it up (this is called **garbage collection**).

Here is a trace of what happens in memory step by step:

| Line | Code | `score` | `bonus` | `total` |
|---|---|---|---|---|
| 1 | `score = 85` | 85 | — | — |
| 2 | `bonus = 10` | 85 | 10 | — |
| 3 | `total = score + bonus` | 85 | 10 | 95 |
| 4 | `score = 92` | 92 | 10 | 95 |

Notice that changing `score` on line 4 does **not** change `total`. The variable `total` already holds `95` — it does not remember the formula that produced it. This is a critical concept: `=` is an action that happens once, not an ongoing link.

## Common mistakes

### Mistake 1: Using a variable before assigning it

```python
print(total)
```

**Error:** `NameError: name 'total' is not defined`

Python reads top to bottom. If you try to use a name before any `=` assigns a value to it, you get a **NameError**. The fix is to assign first, then use:

```python
total = 0
print(total)
```

### Mistake 2: Trying to add a string and an integer

```python
age = 25
message = "I am " + age + " years old"
```

**Error:** `TypeError: can only concatenate str (not "int") to str`

The `+` operator can join strings or add numbers, but it cannot mix the two. The fix is to convert the integer to a string first:

```python
message = "I am " + str(age) + " years old"
```

Or, even better, use an f-string (you will learn about these in a later lesson):

```python
message = f"I am {age} years old"
```

### Mistake 3: Doing math on a string that looks like a number

```python
price = "10"
tax = price * 0.1
```

**Error:** `TypeError: can't multiply sequence by non-int of type 'float'`

The variable `price` holds the string `"10"`, not the number `10`. Python cannot multiply text by a float. The fix is to convert first: `price = int("10")` or `price = float("10")`.

### Mistake 4: Forgetting quotes around text

```python
name = hello
```

**Error:** `NameError: name 'hello' is not defined. Did you mean: 'help'?`

Without quotes, Python thinks `hello` is a variable name and tries to look it up. Since no variable called `hello` exists, you get a NameError. The fix is to add quotes: `name = "hello"`.

### Mistake 5: Using a Python keyword as a variable name

```python
class = "Biology"
```

**Error:** `SyntaxError: invalid syntax`

`class` is a reserved keyword in Python (it is used to define classes, which you will learn much later). You cannot use it as a variable name. Choose a different name: `subject = "Biology"`.

## Cheat sheet

| Concept | Syntax | Example | Result |
|---|---|---|---|
| Assign a variable | `name = value` | `x = 10` | `x` holds `10` |
| Reassign | `name = new_value` | `x = 20` | `x` now holds `20` |
| Integer | whole number | `42` | type `int` |
| Float | decimal number | `3.14` | type `float` |
| String | text in quotes | `"hello"` | type `str` |
| Boolean | `True` / `False` | `True` | type `bool` |
| Addition | `a + b` | `3 + 4` | `7` |
| Subtraction | `a - b` | `10 - 3` | `7` |
| Multiplication | `a * b` | `5 * 2` | `10` |
| Division | `a / b` | `7 / 2` | `3.5` |
| Floor division | `a // b` | `7 // 2` | `3` |
| Modulo | `a % b` | `7 % 2` | `1` |
| Exponent | `a ** b` | `2 ** 3` | `8` |
| Check type | `type(value)` | `type(42)` | `<class 'int'>` |
| Convert to int | `int(value)` | `int("5")` | `5` |
| Convert to float | `float(value)` | `float("2.5")` | `2.5` |
| Convert to string | `str(value)` | `str(100)` | `"100"` |
| String length | `len(text)` | `len("hi")` | `2` |
| Concatenation | `str + str` | `"a" + "b"` | `"ab"` |
| Repetition | `str * int` | `"-" * 3` | `"---"` |

## Try it yourself

### Exercise 1 (easy): Calculate a restaurant bill

You ordered 2 pizzas at 350 each and 3 drinks at 80 each. Store each in a variable, calculate the total, and print it.

```python run
pizza_price = 350
pizza_count = 2
drink_price = 80
drink_count = 3
total = (pizza_price * pizza_count) + (drink_price * drink_count)
print("Your bill:", total)
```


```output
Your bill: 940
```
:::solution Solution
The total is `(350 * 2) + (80 * 3)` = `700 + 240` = `940`.

```python run
pizza_price = 350
pizza_count = 2
drink_price = 80
drink_count = 3
total = (pizza_price * pizza_count) + (drink_price * drink_count)
print("Your bill:", total)
```

```output
Your bill: 940
```
:::

### Exercise 2 (medium): Convert seconds to minutes and seconds

Take the number `500` (seconds) and use `//` and `%` to print how many full minutes and how many remaining seconds that is.

```python run
total_seconds = 500
mins = total_seconds // 60
secs = total_seconds % 60
print(mins, "minutes and", secs, "seconds")
```


```output
8 minutes and 20 seconds
```
:::solution Solution
`500 // 60` = `8` (full minutes), `500 % 60` = `20` (leftover seconds).

```python run
total_seconds = 500
mins = total_seconds // 60
secs = total_seconds % 60
print(mins, "minutes and", secs, "seconds")
```

```output
8 minutes and 20 seconds
```
:::

### Exercise 3 (challenge): Type detective

For each value below, predict the type, then verify it with `type()`. Store `42`, `42.0`, `"42"`, and `True` in four different variables and print the type of each.

```python run
a = 42
b = 42.0
c = "42"
d = True
print(type(a))
print(type(b))
print(type(c))
print(type(d))
```


```output
<class 'int'>
<class 'float'>
<class 'str'>
<class 'bool'>
```
:::solution Solution
Even though `42`, `42.0`, and `"42"` look similar, they are three different types:

```python run
a = 42
b = 42.0
c = "42"
d = True
print(type(a))
print(type(b))
print(type(c))
print(type(d))
```

```output
<class 'int'>
<class 'float'>
<class 'str'>
<class 'bool'>
```

`42` is an `int` (no decimal point). `42.0` is a `float` (has a decimal point). `"42"` is a `str` (wrapped in quotes). `True` is a `bool`.
:::

## Recap

- A **variable** stores a value using `=` (the assignment operator). You can change it at any time.
- Python has four core types: **int** (whole numbers), **float** (decimal numbers), **str** (text in quotes), and **bool** (`True` or `False`).
- Use `type()` to check a value's type and `int()`, `float()`, `str()` to convert between types.
- Variable names must start with a letter or underscore, cannot use keywords, and follow the **snake_case** convention.
- Python does not keep a live link between variables and formulas — once a value is computed and stored, changing the inputs does not update the result.
