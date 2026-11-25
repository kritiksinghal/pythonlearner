---
title: "Functions and variables"
curriculumTitle: "Functions and variables"
track: "CS50P"
module: "Week 0 Functions, Variables"
order: 1
level: "Beginner"
summary: "Learn how to define custom functions, manage parameters and return values, store data in variables, and format text strings."
prerequisites: []
learningGoals:
  - "Store and manipulate data using variables"
  - "Display output with print() using sep and end arguments"
  - "Clean and format text using string methods and f-strings"
  - "Define custom functions using def with parameters, default values, and return values"
  - "Understand local variable scope inside functions"
relatedProblems:
  - "format-phone-number"
  - "censor-words"
---

## What you will learn

- How to store information in memory using a **variable**
- How to display text and configure separators using the `print()` function
- How to transform text with built-in string methods like `strip()`, `title()`, and `lower()`
- How to format output cleanly using modern **f-strings**
- How to define your own reusable actions using the `def` keyword
- The vital difference between parameters, arguments, and **return values**
- How **local scope** protects variables inside functions from interfering with outer code

## Why this matters

When you start programming, writing code line by line feels direct. But as soon as your project expands beyond a few instructions, repeating identical blocks of logic becomes exhausting to write and risky to maintain. If a formula appears in ten places and needs an update, you must track down and edit all ten locations. Functions eliminate this repetition by bundling a set of actions into a single named tool that you can invoke whenever needed. Variables give meaningful names to raw data so that your code reads like structured thought rather than anonymous numbers. Together, functions and variables form the twin pillars of structured programming.

## The big idea

Think of a computer program like a **professional kitchen preparation workflow**.

Incoming data is like raw produce arriving at the delivery bay. A **variable** is a labelled container in the pantry where you store an ingredient until the cook needs it. A **function** is a written recipe card pinned above the preparation table. Defining a function with `def` does not cook the meal; it simply files the recipe card in the drawer.

When a chef needs pancakes, they **call** the recipe by name, hand it the necessary ingredients (called **arguments**), and wait for the kitchen to work. Inside the function, the recipe assigns those ingredients to labelled bowls (called **parameters**), executes the steps, and hands the finished plate back to the dining room using `return`. Displaying text on screen with `print()` is like showing the dish to a guest at the counter, whereas using `return` hands the finished food back to another chef to use in a larger banquet.

## Step by step

### Displaying output with print

The most direct built-in function in Python is `print()`. It accepts one or more arguments, converts them to text on screen, and ends with an automatic newline character.

```python run
print("hello, world")
```

```output
hello, world
```

**Line by line:** Python identifies the built-in function named `print`. The parentheses instruct Python to execute the function immediately. Inside the parentheses, `"hello, world"` is a string literal passed as an argument. Python displays the text on the terminal screen and advances the cursor to the next line.

You can pass multiple arguments separated by commas. By default, `print()` places a single space between each item. You can customize this behavior using the optional `sep` parameter, or change the trailing newline using the `end` parameter.

```python run
print("apple", "banana", "cherry", sep=" - ")
print("loading", end="...")
print("done!")
```

```output
apple - banana - cherry
loading...done!
```

**Line by line:** In line 1, `sep=" - "` tells `print()` to place a space, a hyphen, and a space between the three words instead of a simple space. In line 2, `end="..."` overrides the default newline character, keeping the cursor on the same line so line 3 appends `"done!"` right after the dots.

### Storing data in variables

A **variable** is a named reference pointing to a value stored in your computer's memory. You create or update a variable using the single equals sign (`=`), known as the **assignment operator**.

```python run
player_name = "Kritik"
player_score = 95
print(player_name, "scored", player_score, "points")
```

```output
Kritik scored 95 points
```

**Line by line:** Line 1 allocates the string `"Kritik"` in memory and binds the name `player_name` to it. Line 2 creates an integer `95` and assigns it to `player_score`. Line 3 calls `print()` with four arguments: two variables and two string literals. Python retrieves the values bound to the variable names and prints them in sequence.

In Python, variable names follow the **snake_case** convention: all lowercase letters with words separated by underscores (such as `student_grade` or `total_amount`). Variable names cannot begin with a number and cannot use reserved keywords like `def` or `class`.

### Reading user input

In interactive terminal programs, you capture text entered by a person using the `input()` function. The function takes a prompt message, pauses execution until the person presses Enter, and returns the response.

```python
# Sample terminal session using input()
user_response = input("What is your name? ")
print("Welcome,", user_response)
```

A crucial rule to remember: `input()` **always returns a string**, even if the user types digits like `42`. If you need to perform numerical calculations, you must convert the string using `int()` for whole numbers or `float()` for decimal numbers. Handling non-numeric entries safely using try-except blocks is covered in Exceptions.

### Transforming strings with methods

In Python, strings are objects equipped with built-in functions called **methods**. A method is a function that belongs to a specific piece of data, called using a dot (`.`) directly on the variable.

- `.strip()` removes leading and trailing whitespace characters (spaces, tabs, newlines).
- `.title()` capitalizes the first letter of each word.
- `.lower()` converts all characters to lowercase.
- `.upper()` converts all characters to uppercase.

```python run
raw_name = "  ada lovelace  "
clean_name = raw_name.strip().title()
print("Cleaned name:", clean_name)
print("Upper:", clean_name.upper())
print("Lower:", clean_name.lower())
```

```output
Cleaned name: Ada Lovelace
Upper: ADA LOVELACE
Lower: ada lovelace
```

**Line by line:** Line 1 stores `"  ada lovelace  "` with extra spaces. Line 2 chains two methods together: `.strip()` first removes the outer spaces, producing `"ada lovelace"`, and `.title()` immediately capitalizes the words to produce `"Ada Lovelace"`. Line 4 and 5 produce uppercase and lowercase versions without modifying the original variable.

### Formatting output with f-strings

A **formatted string literal**, or **f-string**, lets you embed Python expressions and variables directly inside string text. You create an f-string by placing the letter `f` immediately before the opening quotation mark and placing variable names inside curly braces `{}`.

```python run
first_name = "Ada"
role = "programmer"
score = 98.7654
print(f"Name: {first_name}, Role: {role}")
print(f"Rounded score: {score:.2f}")
print(f"Large number: {1000000:,}")
```

```output
Name: Ada, Role: programmer
Rounded score: 98.77
Large number: 1,000,000
```

**Line by line:** Line 4 injects `first_name` and `role` into the message. Line 5 formats a floating-point number using the specifier `:.2f`, which rounds the display to two decimal places. Line 6 uses `:,` to insert thousands-separator commas into a large integer.

### Defining custom functions with def

To create your own function, begin with the keyword `def`, followed by your chosen function name, a set of parentheses containing any parameters, and a colon (`:`). All lines belonging to the function must be indented by four spaces.

```python run
def greet(name):
    print(f"Hello, {name}!")

greet("Ada")
greet("Alan")
```

```output
Hello, Ada!
Hello, Alan!
```

**Line by line:** Lines 1 and 2 define the function `greet`. The variable `name` inside parentheses is a **parameter**—a placeholder waiting for input. Defining the function does not run the code inside. On line 4, `greet("Ada")` calls the function. Python sets `name = "Ada"` and executes line 2, displaying `"Hello, Ada!"`. When that finish, line 5 calls `greet("Alan")`, setting `name = "Alan"` and running the recipe a second time.

### Default parameter values

You can make parameters optional by assigning them a **default value** inside the function header. If the caller provides an argument, Python uses the caller's value; if the caller omits the argument, Python falls back to the default.

```python run
def welcome(recipient="world"):
    print(f"Welcome, {recipient}!")

welcome()
welcome("Kritik")
```

```output
Welcome, world!
Welcome, Kritik!
```

**Line by line:** In line 1, `recipient="world"` assigns `"world"` as the fallback value. In line 4, `welcome()` is called with empty parentheses, so Python uses `"world"`. In line 5, the argument `"Kritik"` overrides the default, printing `"Welcome, Kritik!"`.

### Returning values with return

Functions become vastly more powerful when they calculate a result and send it back to the caller using the `return` statement.

```python run
def square(number):
    return number * number

result = square(4)
print("4 squared is", result)
print("3 squared plus 4 squared is", square(3) + square(4))
```

```output
4 squared is 16
3 squared plus 4 squared is 25
```

**Line by line:** Line 1 defines `square` with parameter `number`. Line 2 evaluates `number * number` and uses `return` to send that numerical value back out. Line 4 calls `square(4)`. The function computes `16`, hands `16` back to the assignment statement, and `result` stores `16`. Line 6 demonstrates that returned values can participate directly in math expressions: `square(3)` produces `9` and `square(4)` produces `16`, which add together to make `25`.

### Multi-parameter functions and calculations

Functions can accept multiple parameters separated by commas. Python matches arguments to parameters in the order they are passed.

```python run
def calculate_split(total_bill, tip_percentage):
    tip_amount = total_bill * (tip_percentage / 100)
    final_total = total_bill + tip_amount
    return round(final_total, 2)

print("Total to pay:", calculate_split(500, 10))
print("Total to pay:", calculate_split(85.50, 15))
```

```output
Total to pay: 550.0
Total to pay: 98.33
```

**Line by line:** The function `calculate_split` accepts two inputs: the bill and the tip percentage. On line 6, `calculate_split(500, 10)` passes `500` into `total_bill` and `10` into `tip_percentage`. The function calculates a 50 tip, adds it to 500, rounds the result, and returns `550.0`.

### Understanding local scope

Any variable created inside a function exists in that function's **local scope**. It is created when the function starts executing and destroyed the moment the function finishes. Outer code cannot see or modify variables that live inside a function.

```python run
def compute_discount(price):
    discount_rate = 0.15
    savings = price * discount_rate
    return savings

item_price = 200
saved = compute_discount(item_price)
print("Saved amount:", saved)
```

```output
Saved amount: 30.0
```

**Line by line:** `discount_rate` and `savings` are local variables created inside `compute_discount`. Once line 4 executes and returns `30.0`, `discount_rate` and `savings` cease to exist. If you tried to write `print(savings)` outside the function, Python would raise a `NameError`. This isolation ensures that different functions can use common variable names without conflicting with one another.

### Structuring programs with main

As programs grow, good practice dictates organizing code into distinct helper functions and a coordinating function named `main()`.

```python
def square(n):
    return n * n

def main():
    val = 5
    print("Squared value:", square(val))

main()
```

Organizing your code with `main()` ensures that function definitions are loaded into memory first before the top-level coordinating logic begins execution. Controlling conditional program execution across branches is covered in Conditionals.

## What Python is doing behind the scenes

When Python executes a script containing function definitions and calls, it manages an internal call stack and distinct namespaces. Consider this calculation:

```python
def square(n):
    return n * n

y = square(4)
print(y)
```

| Step | Scope Active | Action Taken by Python | Variable State |
|---|---|---|---|
| 1 | Global Scope | Reads `def square(n):`. Stores the bytecode recipe in memory. Does not run the body. | `square` points to function object |
| 2 | Global Scope | Evaluates right side of `y = square(4)`. Prepares function call. | Global namespace waiting for return |
| 3 | Local Scope (`square`) | Creates new local frame. Binds parameter `n = 4`. | `n = 4` in local memory |
| 4 | Local Scope (`square`) | Evaluates `n * n` ($4 \times 4 = 16$). Executes `return 16`. | Local frame returns 16 and is destroyed |
| 5 | Global Scope | Receives returned value `16`. Assigns `y = 16`. | `y = 16` in global memory |
| 6 | Global Scope | Executes `print(y)`. Looks up `y` and displays `16`. | Program finishes cleanly |

Notice step 4: the moment the function encounters `return`, its local environment collapses. The temporary parameter `n` is discarded, freeing system memory.

## Common mistakes

### Mistake 1: Writing variable names without quotes when text is intended

```python
print(Hello)
```

**Error:** `NameError: name 'Hello' is not defined`

Without quotation marks, Python assumes `Hello` is a variable name and checks the namespace. Because no variable named `Hello` was assigned, Python raises a NameError. The fix is to surround string text with quotes: `print("Hello")`.

### Mistake 2: Confusing print with return and using a NoneType result

```python
def add(a, b):
    print(a + b)

result = add(2, 3)
print(result + 10)
```

**Error:** `TypeError: unsupported operand type(s) for +: 'NoneType' and 'int'`

A function that only uses `print()` displays a message to the user, but returns nothing to the program. In Python, an omitted return value defaults to `None`. When line 5 tries to evaluate `result + 10`, it attempts to add `None + 10`, causing a TypeError. The fix is to return the value:

```python
def add(a, b):
    return a + b
```

### Mistake 3: Accessing a local variable from outside its function

```python
def calc():
    total = 100

calc()
print(total)
```

**Error:** `NameError: name 'total' is not defined`

The variable `total` was defined inside the local scope of `calc()`. When `calc()` finishes, `total` is deleted. The global scope has no access to it. The fix is to return the value from the function and capture it in a variable outside:

```python
def calc():
    total = 100
    return total

amount = calc()
print(amount)
```

### Mistake 4: Forgetting the colon in the function definition header

```python
def square(n)
    return n * n
```

**Error:** `SyntaxError: expected ':'`

Every function definition line must end with a colon (`:`). The colon tells Python that an indented suite of instructions follows. The fix is to append the colon: `def square(n):`.

### Mistake 5: Calling a function without required arguments

```python
def greet(name):
    print(name)

greet()
```

**Error:** `TypeError: greet() missing 1 required positional argument: 'name'`

The parameter `name` has no default value, so Python demands an argument. Calling `greet()` with empty parentheses violates the contract. The fix is to pass an argument like `greet("Ada")` or provide a default value in the definition header like `def greet(name="friend"):`.

## Cheat sheet

| Feature | Syntax Example | Purpose |
|---|---|---|
| Print message | `print("text")` | Displays text on standard output |
| Separator argument | `print("a", "b", sep="-")` | Controls characters placed between arguments |
| Ending argument | `print("a", end="")` | Controls character placed at end of line |
| Variable assignment | `count = 10` | Stores value under an identifier |
| Strip whitespace | `text.strip()` | Removes leading and trailing spaces |
| Title casing | `text.title()` | Capitalizes first letter of every word |
| Case conversion | `text.lower()` / `text.upper()` | Converts string to lower or upper case |
| f-string embedding | `f"Value: {x}"` | Injects variables directly into string text |
| Number formatting | `f"{price:.2f}"` / `f"{n:,}"` | Formats decimal precision or comma separators |
| Function definition | `def name(param):` | Declares a named, reusable function |
| Return value | `return value` | Sends a computed result back to caller |
| Default parameter | `def func(to="world"):` | Sets fallback value when argument omitted |

## Try it yourself

### Exercise 1 (easy): Badge generator function

Write a function called `create_badge(full_name, title)` that cleans `full_name` using `.strip().title()`, converts `title` to uppercase with `.strip().upper()`, and returns a single formatted string in the pattern `"Name - TITLE"`. Test it with `"  albert einstein  "` and `"physicist"`.

```python run
def create_badge(full_name, title):
    cleaned_name = full_name.strip().title()
    cleaned_title = title.strip().upper()
    return f"{cleaned_name} - {cleaned_title}"

badge = create_badge("  albert einstein  ", "physicist")
print(badge)
```


```output
Albert Einstein - PHYSICIST
```
:::solution Solution
Chaining `.strip()` and `.title()` standardizes user names regardless of extra whitespace, and an f-string joins the badge elements together cleanly.

```python run
def create_badge(full_name, title):
    cleaned_name = full_name.strip().title()
    cleaned_title = title.strip().upper()
    return f"{cleaned_name} - {cleaned_title}"

badge = create_badge("  albert einstein  ", "physicist")
print(badge)
```

```output
Albert Einstein - PHYSICIST
```
:::

### Exercise 2 (medium): Tip calculation function

Write a function named `calculate_tip(bill_amount, percent)` that accepts the bill subtotal and a tip percentage, calculates the tip amount, and returns it. Test it with a 500 bill at 10% and a 120 bill at 18%.

```python run
def calculate_tip(bill_amount, percent):
    return bill_amount * (percent / 100)

tip_10 = calculate_tip(500, 10)
tip_18 = calculate_tip(120, 18)
print("Tip for 500 at 10%:", tip_10)
print("Tip for 120 at 18%:", round(tip_18, 2))
```


```output
Tip for 500 at 10%: 50.0
Tip for 120 at 18%: 21.6
```
:::solution Solution
Multiplying the subtotal by `percent / 100` computes the exact tip amount, which `return` hands back to the caller for printing or total computation.

```python run
def calculate_tip(bill_amount, percent):
    return bill_amount * (percent / 100)

tip_10 = calculate_tip(500, 10)
tip_18 = calculate_tip(120, 18)
print("Tip for 500 at 10%:", tip_10)
print("Tip for 120 at 18%:", round(tip_18, 2))
```

```output
Tip for 500 at 10%: 50.0
Tip for 120 at 18%: 21.6
```
:::

### Exercise 3 (challenge): Seconds to minutes converter function

Write a function `convert_seconds(total_seconds)` that converts a total count of seconds into minutes and leftover seconds using `//` and `%`, returning a formatted string like `"2 min 15 sec"`. Test it with `135` and `3665` seconds.

```python run
def convert_seconds(total_seconds):
    minutes = total_seconds // 60
    seconds = total_seconds % 60
    return f"{minutes} min {seconds} sec"

print(convert_seconds(135))
print(convert_seconds(3665))
```


```output
2 min 15 sec
61 min 5 sec
```
:::solution Solution
Floor division `//` extracts the full minutes, while modulo `%` determines the remaining seconds.

```python run
def convert_seconds(total_seconds):
    minutes = total_seconds // 60
    seconds = total_seconds % 60
    return f"{minutes} min {seconds} sec"

print(convert_seconds(135))
print(convert_seconds(3665))
```

```output
2 min 15 sec
61 min 5 sec
```
:::

## Recap

- A **variable** stores data under a descriptive name using the assignment operator `=`.
- The `print()` function displays values on screen; customize formatting with `sep` and `end`.
- String methods like `.strip()`, `.title()`, and `.lower()` clean and standardize textual data.
- Modern **f-strings** format variables inside text cleanly using `{}` placeholders and format specifiers like `:.2f`.
- The `def` statement defines a custom function with parameters that act as local variables.
- Use `return` to pass computed results back to the calling code; a function without `return` yields `None`.
- Variables declared inside functions remain isolated in **local scope** and disappear when execution finishes.

Based on Harvard's CS50P.
