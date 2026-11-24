---
title: "Comprehensions"
curriculumTitle: "Comprehensions"
track: "Python from zero"
module: "M4 Collections"
order: 19
level: "Beginner"
summary: "Build new lists, sets, and dictionaries from existing data with readable comprehensions and conditions."
prerequisites:
  - "what-is-programming-and-python"
  - "your-first-program-with-print"
  - "variables-and-types"
  - "numbers-and-math"
  - "text-strings"
  - "talking-to-the-user-with-input-and-f-strings"
  - "true-false-and-comparisons"
  - "making-decisions-with-if"
  - "and-or-not"
  - "repeating-with-loops"
  - "for-loops-and-range"
  - "break-continue-and-loop-else"
  - "nested-loops-and-patterns"
  - "lists"
  - "indexing-and-slicing"
  - "tuples"
  - "dictionaries"
  - "sets"
learningGoals:
  - "Read and write a list comprehension that transforms each item in an iterable."
  - "Add a condition to keep only items that meet a test."
  - "Use conditional expressions to choose an output value for each item."
  - "Create set and dictionary comprehensions."
  - "Choose a normal loop whenever a comprehension would be hard to read."
relatedProblems: []
---

## What you will learn

- A **comprehension** is a compact expression that builds a collection by working through an iterable.
- How to use a **list comprehension** to transform every item, keep selected items, or do both.
- How a conditional expression can select one output value or another for each item.
- How **set comprehensions** keep unique results and **dictionary comprehensions** build key-value pairs.
- How to translate between a comprehension and a regular loop so you can decide which form is easier to read.

## Why this matters

Programs often receive a collection and need a new collection derived from it. A school dashboard might convert raw marks into percentages, a cricket scorecard might select batters above a threshold, or a playlist tool might normalize track names. A loop can build these results, and it remains an important tool. A comprehension gives you a compact way to describe common transformations and filters when the steps fit clearly into one expression.

Comprehensions are useful because the result is visible in one place: what collection you are building, what to do with each item, and which items to keep. They can also become hard to understand when packed with several conditions or nested loops. Learning the readable form includes learning when to stop and use a normal loop.

## The big idea

Think of a comprehension as a small assembly line. Each item from an existing collection arrives at the line. The expression decides what new item to make, and an optional condition decides whether that item should go into the finished collection.

The basic list form is `[expression for item in collection]`. Read it from the middle: for each item in the collection, calculate the expression, then put that result into a new list. You can add a filter after the collection: `[expression for item in collection if condition]`. The `if` here keeps items that pass; it does not create an `else` branch. A conditional expression such as `"pass" if mark >= 50 else "retry"` chooses between two output values.

Comprehensions do not modify the source collection. They create a new collection. List comprehensions preserve the source order and can preserve repeated results. Set comprehensions remove duplicate results. Dictionary comprehensions create key-value pairs. The curly-brace forms look different because they build different collection types, but the “for each item, make a result” idea is the same.

## Step by step

### 1. Transform every item into a new list

Start with a list of prices in rupees and create a new list with a service fee added to each amount.

```python run
ticket_prices = [180, 250, 320]
prices_with_fee = [price + 20 for price in ticket_prices]
print(prices_with_fee)
```

```output
[200, 270, 340]
```

The expression before `for` is `price + 20`. The loop part assigns each source value to `price` in turn. Each calculated value is appended to the new list. The original list remains `[180, 250, 320]`.

The equivalent loop makes each step explicit:

```python
prices_with_fee = []
for price in ticket_prices:
    prices_with_fee.append(price + 20)
```

Both forms make the same values. The comprehension is concise because the loop has one simple action and one clear result.

### 2. Keep only items that pass a condition

Place a filtering `if` after the collection. This version keeps only marks of 80 or higher.

```python run
marks = [72, 88, 65, 94, 81]
high_marks = [mark for mark in marks if mark >= 80]
print(high_marks)
```

```output
[88, 94, 81]
```

Python visits each mark in order. If the condition is true, that same mark is included in the result. If it is false, Python skips it. The result keeps the original order of the selected marks.

The filter appears after `for` because it decides whether the current item should enter the result. Do not read it as “if true, otherwise”; there is no alternate output in this form.

### 3. Transform and filter at the same time

You can make the result expression different from the value being tested. Here the comprehension converts Celsius readings to whole-number Fahrenheit readings, but only for readings at least 20 degrees.

```python run
celsius = [16, 21, 24, 18, 29]
warm_fahrenheit = [round(value * 9 / 5 + 32) for value in celsius if value >= 20]
print(warm_fahrenheit)
```

```output
[70, 75, 84]
```

The `if value >= 20` part decides which Celsius readings are kept. For each kept reading, the expression `round(value * 9 / 5 + 32)` calculates the new number. Values below 20 never reach that calculation for the result.

Although this line is longer, it expresses one task: choose the warm readings and convert each. If you had several conversions, multiple conditions, or extra print statements, a regular loop might communicate the steps better.

### 4. Choose an output with a conditional expression

A conditional expression includes both an `if` and an `else`: `result_a if condition else result_b`. It creates one result for every source item, with one of two possible values.

```python run
marks = [42, 67, 51, 38]
results = ["pass" if mark >= 50 else "retry" for mark in marks]
print(results)
```

```output
['retry', 'pass', 'pass', 'retry']
```

The condition checks each mark. If it reaches 50, the expression contributes `"pass"`; otherwise, it contributes `"retry"`. Unlike the previous filter, this comprehension returns one result for every mark.

The placement is different from a filter: the conditional expression comes before `for`, and it contains both outcomes. The optional filter comes after the `for` and has no `else`.

### 5. Make a set of unique results

Set comprehensions use braces and an expression followed by `for`. They keep one copy of each result, even if different source items produce the same result.

```python run
departments = ["sales", "design", "sales", "support", "design"]
initials = {name[0].upper() for name in departments}
print(sorted(initials))
```

```output
['D', 'S']
```

The expression takes the first letter and makes it uppercase. Sales appears twice and design appears twice, but the set stores each resulting initial once. `sorted()` gives the printed list a predictable order.

Use a set comprehension when uniqueness is part of the goal. If every result needs to stay in source order or repeats matter, use a list comprehension instead.

### 6. Build a dictionary from each item

Dictionary comprehensions place a key expression, a colon, and a value expression before the `for`.

```python run
players = ["Maya", "Samar", "Ovi"]
name_lengths = {name: len(name) for name in players}
print(name_lengths)
```

```output
{'Maya': 4, 'Samar': 5, 'Ovi': 3}
```

For each name, the expression before the colon becomes the key, and `len(name)` becomes its value. The result is a dictionary that maps every name to its character count.

Dictionary keys must be unique. If two source items create the same key, the later value replaces the earlier value for that key. Choose an expression that identifies the records you want to keep.

### 7. Filter a dictionary comprehension

Dictionary comprehensions can filter items too. This example keeps only the menu items costing less than 100 rupees.

```python run
menu = {"idli": 45, "thali": 140, "chai": 20, "dosa": 95}
budget_menu = {item: price for item, price in menu.items() if price < 100}
print(budget_menu)
```

```output
{'idli': 45, 'chai': 20, 'dosa': 95}
```

`.items()` supplies each key and value pair to the loop. The condition keeps affordable entries, and the expression before `for` recreates the key-value pair in the result. Thali is skipped because its price is not below 100.

### 8. Use a normal loop when the work has several steps

A comprehension is not automatically better because it is shorter. A normal loop gives you room for extra actions and names for intermediate results.

```python run
lap_times = [72, 68, 75, 66]
fast_laps = []
for seconds in lap_times:
    minutes = seconds // 60
    remainder = seconds % 60
    fast_laps.append(f"{minutes}:{remainder:02d}")
print(fast_laps)
```

```output
['1:12', '1:08', '1:15', '1:06']
```

Each iteration calculates minutes and leftover seconds before formatting a string. A comprehension could place all those calculations into one expression, but that would be less clear. The loop's extra lines make the intermediate values easy to understand.

Use a comprehension when the transformation and optional filter are clear at a glance. Use a regular loop when you need several statements, meaningful intermediate names, or side effects such as printing or changing another object.

## What Python is doing behind the scenes

Python visits each value from left to right, checks a filter if one exists, evaluates the result expression for accepted items, and stores the result in a new collection. You can trace that sequence just as you would a loop.

| Source `mark` | Check `mark >= 80` | Result added |
| --- | --- | --- |
| `72` | False | nothing |
| `88` | True | `88` |
| `65` | False | nothing |
| `94` | True | `94` |
| `81` | True | `81` |

The final list is `[88, 94, 81]`. This table is a useful way to debug a comprehension: choose one source value, check the condition, then calculate the output only if that value passes.

## Common mistakes

### 1. Using a different variable name in the expression

Broken code:

```python
marks = [72, 88]
high_marks = [score for mark in marks if mark >= 80]
```

Python reports `NameError: name 'score' is not defined`. The loop variable is named `mark`, so use `[mark for mark in marks if mark >= 80]`.

### 2. Combining a number with text without converting it

Broken code:

```python
scores = [12, 18]
labels = [score + " points" for score in scores]
```

Python reports `TypeError: unsupported operand type(s) for +: 'int' and 'str'`. The expression tries to add an integer and text. Use an f-string such as `f"{score} points"` to format each number as text.

### 3. Comparing values that have different types

Broken code:

```python
marks = [72, 88]
high_marks = [mark for mark in marks if mark > "50"]
```

Python reports `TypeError: '>' not supported between instances of 'int' and 'str'`. The marks are integers, but `"50"` is text. Compare like types by writing `mark > 50`.

### 4. Converting an invalid value inside a comprehension

Broken code:

```python
scores = ["90", "x"]
numbers = [int(score) for score in scores]
```

Python reports `ValueError: invalid literal for int() with base 10: 'x'`. The conversion works for `"90"` but not for `"x"`. Validate or clean the source values before converting them. For multi-step validation, use a regular loop so each decision is visible.

## Cheat sheet

| Goal | Pattern | Collection |
| --- | --- | --- |
| Transform each item | `[expression for item in items]` | List |
| Keep selected items | `[item for item in items if condition]` | List |
| Transform selected items | `[expression for item in items if condition]` | List |
| Choose one of two results | `[a if condition else b for item in items]` | List |
| Keep unique results | `{expression for item in items}` | Set |
| Create key-value pairs | `{key: value for item in items}` | Dictionary |
| Read a complex task clearly | `for item in items:` | Use a regular loop |

## Try it yourself

### Easy: Convert distances

Given a list of distances in kilometers, create a list with each value converted to meters by multiplying by 1000.

```python run
```

:::solution

```python
kilometers = [1, 3, 5]
meters = [distance * 1000 for distance in kilometers]
print(meters)
```

:::

### Medium: Keep passing marks

Use a list comprehension to make a list containing only marks of 50 or more.

```python run
```

:::solution

```python
marks = [48, 73, 50, 91]
passing = [mark for mark in marks if mark >= 50]
print(passing)
```

:::

### Challenge: Map books to page counts

Given a list of book titles, create a dictionary that maps each title to the number of characters in it.

```python run
```

:::solution

```python
titles = ["River Road", "Night Train", "Red Kite"]
page_labels = {title: len(title) for title in titles}
print(page_labels)
```

:::

## Recap

- A comprehension creates a new collection by transforming items from an iterable.
- Add a filter after `for` to skip items that do not meet a condition.
- Use a conditional expression when every source item should produce one of two possible results.
- List, set, and dictionary comprehensions make different collection types.
- Prefer a regular loop when several steps would make a comprehension hard to read.

Reference: Python documentation, List Comprehensions
