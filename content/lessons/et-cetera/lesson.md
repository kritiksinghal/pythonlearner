---
title: "Et cetera"
curriculumTitle: "Et cetera"
track: "CS50P"
module: "Week 9 Et Cetera"
order: 10
level: "Beginner"
runnableMin: 3
summary: "Use sets, hints, comprehensions, arguments, and generators to express common tasks."
prerequisites:
  - "object-oriented-programming"
learningGoals:
  - "Use sets for unique values and uppercase names for constants"
  - "Read type hints and docstrings as documentation"
  - "Use argparse, unpacking, comprehensions, and enumerate"
  - "Explain how generators and iterators supply values gradually"
relatedProblems: []
---

## What you will learn

- How sets remove duplicates and why sorted output is useful
- How constants, type hints, and docstrings communicate intent
- How `argparse` reads command-line options
- How `*args`, `**kwargs`, and unpacking pass flexible arguments
- How comprehensions, `enumerate`, and generators express common tasks

## Why this matters

Python has many small tools that can make familiar code shorter or clearer. A set can answer which unique values appeared, an uppercase constant can make a fixed setting easy to identify, and a type hint can tell a reader what a function expects. `enumerate` pairs an item with a counter, while a comprehension builds a collection from other values. A generator can supply one value at a time. These features are useful when they make the purpose easier to see. A plain loop or ordinary named parameters may be the better choice when the compact alternative is difficult to understand.

## The big idea

This lesson is a toolbox, not a requirement to use every feature everywhere. Sets keep unique values; they do not provide list-style ordering, so sort them when display order should be predictable. A constant is a name for a value intended to stay fixed, conventionally written in uppercase, though Python does not enforce that intention. Type hints and docstrings document expected use but do not validate or convert values automatically.

`argparse` gives a script named command-line options and a help message. Unpacking passes the values of a collection separately, while `*args` and `**kwargs` collect extra arguments in a function definition. Comprehensions construct collections; `enumerate` gives a count and item together. A generator uses `yield` to pause and provide its next value when requested.

## Step by step

### Keep unique values with a set

A set keeps one copy of each value. Sort it when the program should display the values in a predictable order.

```python run
stations = ["Elm", "Birch", "Elm", "Cypress"]
print(sorted(set(stations)))
```

```output
['Birch', 'Cypress', 'Elm']
```

Converting to a set removes the duplicate `Elm`. Sorting supplies a predictable order for display; the set itself is not a sorted list.

### Use a set for membership

The `in` check can ask whether a value is among the unique entries.

```python run
checked_in = {"Marta", "Yun", "Salim"}
print("Yun" in checked_in, "Tomas" in checked_in)
```

```output
True False
```

The first name is present and the second is not. This set is useful for membership checks because duplicate names would not change whether a name has appeared.

### Name a value intended to stay fixed

Use uppercase letters by convention for a value intended to be a constant. The naming style communicates intent to people reading the code.

```python run
MAX_REHEARSALS = 6
print(MAX_REHEARSALS)
```

```output
6
```

Python does not lock the value just because its name is uppercase. The convention signals that program logic is meant to read it rather than change it.

### Read a type hint and docstring

The annotation after a parameter documents its expected type, the arrow documents the return type, and the docstring describes the function's purpose.

```python run
def ticket_total(price: int, quantity: int) -> int:
    """Return the total cost for the requested tickets."""
    return price * quantity

print(ticket_total(12, 3))
```

```output
36
```

The hints describe integers in and an integer out. They do not automatically convert a different input or reject it while the function runs. The docstring is a note for callers, not a test of the calculation.

### Mark a function that returns no result

Use `-> None` when a function is intended to perform an action such as printing rather than return a useful value.

```python run
def announce_rounds(count: int) -> None:
    for _ in range(count):
        print("Ready")

announce_rounds(2)
```

```output
Ready
Ready
```

The type hint documents the function's intent. The function prints two messages and does not explicitly return a result.

### Use enumerate for a number and item

`enumerate` supplies a counter together with each item. Set `start=1` when the displayed numbering should begin at one.

```python run
for number, instrument in enumerate(["flute", "cello", "oboe"], start=1):
    print(f"{number}:{instrument}")
```

```output
1:flute
2:cello
3:oboe
```

The loop receives a pair on each iteration. The list positions still begin at zero; only the counter produced by `enumerate` starts at one here.

### Build and filter a list with a comprehension

A list comprehension can map each item to a new value. Add a condition at the end to keep only items that satisfy it.

```python run
temperatures = [14, 21, 27, 19, 31]
warm_days = [value for value in temperatures if value >= 25]
print(warm_days)
```

```output
[27, 31]
```

The condition is checked for every value, and only those at least 25 are included. A regular loop is still a clear option when the transformation has several steps.

### Build a dictionary with a comprehension

A dictionary comprehension creates key/value pairs from a sequence.

```python run
codes = {letter: ord(letter) for letter in ["A", "C", "F"]}
print(codes)
```

```output
{'A': 65, 'C': 67, 'F': 70}
```

Each letter becomes a key and its `ord` value becomes the corresponding value. The expression constructs the dictionary in one concise pass.

### Unpack values into names or a function call

Unpacking assigns items from a collection to separate names. In a call, one star passes list items as separate positional arguments.

```python run
def join_labels(first, second):
    return first + " / " + second

labels = ["north", "gallery"]
left, right = labels
print(join_labels(*labels), left, right)
```

```output
north / gallery north gallery
```

There are two values and two names, so each receives its matching item. The call with `*labels` is equivalent to passing those values separately.

### Collect extra positional arguments

In a function definition, `*args` collects extra positional values in a tuple.

```python run
def list_sections(title, *sections):
    print(title, sections)

list_sections("Exhibit", "textiles", "prints", "ceramics")
```

```output
Exhibit ('textiles', 'prints', 'ceramics')
```

The first value goes to `title`; the remaining positional arguments are grouped into `sections`. Use this when a flexible number of values is useful, but prefer ordinary named parameters when the inputs are already known.

### Collect extra named arguments

`**kwargs` collects extra named arguments in a dictionary.

```python run
def describe_event(name, **details):
    print(name, details)

describe_event("Lantern walk", route="Canal path", hour=19)
```

```output
Lantern walk {'route': 'Canal path', 'hour': 19}
```

The named details are collected by their names and values. This provides flexibility, but if the expected options are known, listing them directly is usually easier to read.

### Build values one at a time with a generator

A generator function uses `yield` to produce a value and pause. The next request continues from where it paused.

```python run
def countdown(start: int):
    while start > 0:
        yield start
        start -= 1

print(list(countdown(3)))
```

```output
[3, 2, 1]
```

Each `yield` supplies one value. The function pauses there and resumes when another value is requested. A generator can avoid building the whole sequence as a list.

### Describe command-line options with argparse

`argparse` reads command-line inputs and can define a required name, an optional count, and a help message.

```python
import argparse

parser = argparse.ArgumentParser(description="Announce a performer.")
parser.add_argument("name")
parser.add_argument("--times", type=int, default=1)
args = parser.parse_args()

for _ in range(args.times):
    print(f"Welcome, {args.name}!")
```

Run it from a terminal with a name and optional count:

```bash
python3.12 announce.py Nara --times 2
Welcome, Nara!
Welcome, Nara!
```

The name is a positional argument. `--times` is an optional named argument, and `type=int` converts its text to an integer. This terminal program cannot receive its arguments inside the browser runner; the sample invocation was run with Python 3.12.

### Compare a comprehension with a loop

Use the shorter comprehension when its transformation is easy to scan. The expanded loop performs the same work in a more explicit sequence.

```python run
colors = ["ochre", "silver", "teal"]
short = [color.upper() for color in colors if len(color) > 4]
expanded = []
for color in colors:
    if len(color) > 4:
        expanded.append(color.upper())
print(short == expanded, short)
```

```output
True ['OCHRE', 'SILVER']
```

Both forms select words longer than four characters and uppercase them. `ochre` has five letters and `silver` has six, so both meet the condition. Choose the form that makes the logic clearest, rather than compressing a complicated operation.

### Apply a function to each item with map

`map(function, items)` applies a function to each value. A list comprehension often expresses the same transformation in a form that is easy to read.

```python run
def to_title(word):
    return word.title()

names = ["sora", "imran"]
print(list(map(to_title, names)))
```

```output
['Sora', 'Imran']
```

The function is applied to both names. Here `list` collects the results for display; a comprehension such as `[to_title(name) for name in names]` is another readable form.

### Keep matching items with filter

`filter(function, items)` keeps the items for which the function returns true. A comprehension with a condition can make the same selection explicit.

```python run
def is_long(label):
    return len(label) > 5

labels = ["east", "meadow", "orchard"]
print(list(filter(is_long, labels)))
```

```output
['meadow', 'orchard']
```

The function returns true for the two longer labels, so those are kept. Use whichever form gives the clearest account of the selection rule.

## What Python is doing behind the scenes

A set stores distinct values, and a comprehension evaluates its expression for each source item, optionally keeping only items that pass a condition. `enumerate` pairs an increasing counter with each value. A generator function pauses when it yields and continues when another value is requested. These tools differ in whether they build and keep all results at once.

Type hints are metadata about expected input and output, not automatic runtime checks. An uppercase constant is also a convention rather than an enforced lock. A docstring describes a function's public purpose. `argparse` turns terminal text into named values and can present usage help. Unpacking and variadic parameters provide flexibility, but simpler explicit code is often easier to understand.

## Common mistakes

### Assuming a set preserves display order

A set is for uniqueness, not list-style ordering. Use `sorted(...)` when the output order should be predictable.

### Treating hints as conversions

An annotation such as `count: int` does not convert text or reject other values on its own. Convert input explicitly when needed; a separate checker such as mypy can inspect likely type mismatches.

### Hiding a long operation in a comprehension

A comprehension works well for one clear transformation and condition. When the body needs several steps, use a regular loop so readers can follow each action.

### Forgetting enumerate's default start

By default, its counter starts at zero. Pass `start=1` when people-facing numbering should begin at one.

### Confusing yield with return

`return` finishes a function. `yield` pauses a generator so it can continue when another value is requested.

### Using globals for changing shared values

Functions can read a global, but assigning to it requires the `global` keyword and can obscure which code changed the value. Passing a value in and returning an update makes the data flow easier to see.

## Cheat sheet

| Need | Pattern |
|---|---|
| Remove duplicates | `set(values)` |
| Predictable unique display | `sorted(set(values))` |
| Document a type | `def f(value: int) -> int:` |
| Number and item together | `enumerate(values, start=1)` |
| Build a filtered list | `[item for item in values if condition]` |
| Unpack list into a call | `function(*values)` |
| Collect extra positionals | `def f(*args):` |
| Collect extra named values | `def f(**kwargs):` |
| Produce incrementally | `yield value` |
| Read command options | `argparse.ArgumentParser()` |

## Try it yourself

### Easy: list unique instrument names

Remove repeated labels and print the remaining values in sorted order.

```python run
# Complete the list unique instrument names task.
# Sample data: instruments = ['lyre', 'frame drum', 'lyre', 'shawm']
# Write your code below and print the result
```


:::solution
The set removes the repeated lyre label, and sorted returns the unique names in predictable order.

```python
instruments = ["lyre", "frame drum", "lyre", "shawm"]
print(sorted(set(instruments)))
```
:::

### Medium: number each route stop

Use enumerate with a start value of one.

```python run
# Complete the number each route stop task.
# Sample data: start=1
# Write your code below and print the result
```


:::solution
Each iteration supplies both a counter and a stop name. The selected start value makes the display begin at one.

```python
for number, stop in enumerate(["Ferry", "Market", "Library"], start=1):
    print(f"{number}: {stop}")
```
:::

### Challenge: generate a countdown

Write a generator that yields three rehearsal cues one at a time.

```python run
# Complete the generate a countdown task.
# Sample data: cues = ["Ready", "Set", "Serve"]
# Write your code below and print the result
```


:::solution
Each yield provides the current number and pauses. Converting the generator to a list requests each remaining value until the generator finishes.

```python
def cues(start):
    while start > 0:
        yield start
        start -= 1

print(list(cues(3)))
```
:::

## Recap

- Sets keep unique values; sort them when predictable display order matters.
- Constants, hints, and docstrings communicate intent but are not all runtime enforcement.
- `argparse` reads command-line options; unpacking and variadic parameters pass flexible values.
- Comprehensions build collections, `enumerate` pairs indexes with items, and generators yield values gradually.
- Choose compact tools when they improve clarity; use ordinary loops and parameters when they read better.

Based on Harvard's CS50P
Reference: Python documentation, Functional Programming HOWTO
