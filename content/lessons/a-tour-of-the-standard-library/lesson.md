---
title: "A tour of the standard library"
curriculumTitle: "A tour of the standard library"
track: "Python from zero"
module: "M6 Errors, files, modules"
order: 31
level: "Beginner"
summary: "Explore a few built-in Python modules that solve common tasks without third-party packages."
prerequisites:
  - "Modules and imports"
learningGoals:
  - "Explain what the standard library contains"
  - "Use selected modules for dates, statistics, and counting"
  - "Look up a library module before writing a replacement"
  - "Recognize that third-party packages are separate from the standard library"
relatedProblems: []
---
## What you will learn

- What the Python **standard library** is
- How to choose a module for a common task
- How `datetime`, `statistics`, `collections`, and `calendar` help with everyday work
- Why randomness and time need deliberate handling in examples
- How to distinguish standard-library modules from third-party packages

## Why this matters

Many programs need dates, averages, counters, and file paths. Writing each tool from scratch takes time and can introduce bugs. Python includes a broad standard library so common operations have documented, reusable implementations. Knowing where to look helps you solve more problems with less code while keeping external dependencies small.

## The big idea

The standard library is like a public tool cabinet supplied with Python. The tools are grouped into modules, and you import the module whose job matches your task. You do not need to memorize every drawer; you need to recognize a likely name and know how to consult its documentation.

The **standard library** is the collection of modules distributed with Python. It is different from third-party packages that someone installs separately. This tour samples a few modules. Each one has more details in the Python 3.12 library reference, and this lesson does not attempt to teach every feature they contain.

## Step by step

### Use `math` for mathematical operations

The `math` module provides constants and functions for common mathematical operations. It is a good fit for square roots, trigonometry, and functions such as ceiling and floor.

```python run
import math

diagonal = math.hypot(5, 12)
print(diagonal)
print(math.ceil(8.01))
```

```output
13.0
9
```

`hypot()` computes the length of a right triangle's hypotenuse from its two sides. `ceil()` returns the smallest integer at least as large as its input. The module prefix makes each function's source clear.

### Summarize data with `statistics`

The `statistics` module includes functions for common summaries. Here, the mean and median describe a small set of cricket scores in different ways.

```python run
import statistics

innings = [22, 47, 51, 63, 117]
print(statistics.mean(innings))
print(statistics.median(innings))
```

```output
60
51
```

The mean adds values and divides by their count. The median is the middle value after ordering the data. A single unusually large innings can pull the mean upward, while the median is less affected by that one value.

### Work with dates using `datetime`

The `datetime` module provides date and time types. Use a date object when you want calendar operations rather than comparing strings that happen to contain date-like text.

```python run
import datetime

festival = datetime.date(2026, 10, 20)
print(festival.isoformat())
print(festival.weekday())
```

```output
2026-10-20
1
```

The date is constructed from year, month, and day. `isoformat()` returns a standard year-month-day string. `weekday()` returns a number where Monday is zero; Tuesday therefore has value one.

### Count items with `collections.Counter`

`collections` provides specialized container types. `Counter` counts how often each value appears, which is useful for votes, repeated words, or inventory.

```python run
from collections import Counter

votes = ["Mira", "Ayan", "Mira", "Leah", "Mira", "Ayan"]
tally = Counter(votes)
print(tally["Mira"])
print(tally.most_common(2))
```

```output
3
[('Mira', 3), ('Ayan', 2)]
```

The counter maps each item to its frequency. `most_common(2)` returns the two most frequent entries as pairs. When counts tie, do not make a program rely on an order unless its behavior is documented for the exact operation you use.

### Inspect calendar information

The `calendar` module can display month layouts and provide month names. This is useful for date-oriented reports and small planning tools.

```python run
import calendar

print(calendar.month_name[8])
print(calendar.isleap(2024))
```

```output
August
True
```

The month name sequence uses its month number as an index, with an empty name at position zero. `isleap()` reports whether a year is a leap year according to the Gregorian calendar rules used by the module.

### Make repeatable random choices

The `random` module supports pseudo-random choices for simulations and games. A fixed seed makes a demonstration reproducible. Do not use this module for passwords or security tokens; security-sensitive randomness has its own module, `secrets`.

```python run
import random

generator = random.Random(23)
spinner = generator.randint(1, 6)
print(spinner)
```

```output
3
```

The generator uses a fixed seed so this example repeats the same result. In a game, you may use a generator without setting a seed so later runs vary. A pseudo-random sequence is generated by an algorithm and is not a source of cryptographic security.

### Find the largest values with `heapq`

`heapq` contains operations for working with a heap, a structure that keeps a smallest item easy to access. Its `nlargest()` helper can return a few high values without sorting a whole collection yourself.

```python run
import heapq

temperatures = [18, 27, 21, 31, 24]
print(heapq.nlargest(2, temperatures))
```

```output
[31, 27]
```

This asks for the two largest measurements. If you need every value sorted, the built-in `sorted()` may be clearer. Choosing a module depends on the task and collection size; this short example is only an introduction to a library tool.

### Format dates for display

Date values can be formatted with `strftime()`. A format string describes the pieces to display. Directives can vary by platform for some details, so use common directives and check the result in your target environment.

```python run
import datetime

concert = datetime.date(2026, 6, 20)
print(concert.strftime("%B %d, %Y"))
```

```output
June 20, 2026
```

`%B` stands for the full month name, `%d` for the day of the month, and `%Y` for the four-digit year. The date stays a date object until you ask to turn it into display text.

### Explore a module with documentation

The standard library is too large to memorize. Use the Python 3.12 library reference or `help()` in an interactive interpreter to check a module's purpose and function signatures.

```python run
import pydoc

print("Counter" in pydoc.locate("collections.Counter").__name__)
```

```output
True
```

`pydoc.locate()` is used here to demonstrate that documentation tooling can locate an object by a dotted name. In day-to-day work, the official docs are usually easier to scan and include examples and version details. Do not assume that a module you saw in a different Python version behaves exactly the same in Python 3.12.

### Recognize tools that require installation

A package can be useful without being part of the standard library. Such packages are usually installed into a project environment with a package installer. Installation and virtual environments are covered in **Virtual environments and pip**.

```python run
import math
import statistics

prices = [145, 160, 155]
average_price = statistics.mean(prices)
rounded_price = math.ceil(average_price)
print(rounded_price)
```

```output
154
```

Both imported modules are available with a normal Python installation. When a tutorial asks you to install a library before importing it, that is a separate dependency. Check the module's official installation guidance and use a project environment rather than assuming it ships with Python.

## What Python is doing behind the scenes

The standard library is made of importable modules. When you write `import statistics`, Python's import system loads or retrieves that module, then binds its name in your current module. Calling `statistics.mean(data)` accesses a function on that module and passes it the list.

Some modules are implemented partly in Python and partly in lower-level code. You do not need to know that implementation detail to use the documented interface. A module's public documentation describes the names and behavior intended for programs. Use those documented names rather than relying on private names that begin with an underscore.

| Task | Example module | Example tool |
|---|---|---|
| Geometry and rounding | `math` | `hypot`, `ceil` |
| Data summaries | `statistics` | `mean`, `median` |
| Calendar dates | `datetime` | `date`, `weekday` |
| Frequency counts | `collections` | `Counter` |
| Month layouts | `calendar` | `month_name`, `isleap` |
| Simulation choices | `random` | `Random`, `randint` |
| Largest or smallest items | `heapq` | `nlargest` |

The standard library avoids extra installation for these common tools, but third-party packages can still be the right choice for specialized needs. Check compatibility with Python 3.12, read the package documentation, and consider whether its value justifies a project dependency. This lesson is a tour: later lessons treat file formats, testing, and regular expressions individually.

## Common mistakes

### Assuming every useful module is included

The standard library is broad but not unlimited. A module used in a tutorial may come from a separately installed package. Check the source and installation instructions rather than repeatedly changing your import spelling.

### Using randomness where a stable result is required

An unseeded pseudo-random generator can return a different choice between runs. Tests and lesson outputs should use controlled data or a fixed seed. For secrets, use `secrets`, not `random`.

### Treating a date as ordinary text

Strings can be sorted lexically, which is not always chronological for arbitrary formats. Use date objects for calendar operations and format them as strings only for display.

### Assuming mean and median tell the same story

The mean responds strongly to extreme values. The median describes the middle value. Choose a measure based on the question you want to answer.

### Relying on undocumented module details

Names with a leading underscore are usually implementation details. Prefer public documented functions and check the Python 3.12 docs when version behavior matters.

## Cheat sheet

| Need | Module | Example |
|---|---|---|
| Square root or geometry | `math` | `math.sqrt(49)` |
| Average or middle value | `statistics` | `statistics.median(scores)` |
| Calendar date | `datetime` | `datetime.date(2026, 1, 1)` |
| Count repeated values | `collections` | `Counter(names)` |
| Month name or leap year | `calendar` | `calendar.isleap(2028)` |
| Simulation randomness | `random` | `random.Random(seed)` |
| A few largest values | `heapq` | `heapq.nlargest(3, values)` |

## Try it yourself

### Easy: calculate a median

Use `ratings` as the sample data. Use `statistics.median()` to find the middle of three music ratings. Print the result exactly as shown in Expected output.


:::tip Hint
Use the lesson idea about a tour of the standard library. Trace the sample values before printing so you can check each step.
:::

```sample input
ratings = [4, 5, 2]
```

```expected
4
```

```python run
# Complete the Easy: calculate a median task.
ratings = [4, 5, 2]
# Write your code below
```


:::solution

Import `statistics` and call `median()` with the ratings. The middle of the ordered values 2, 4, and 5 is 4.


```python
ratings = [4, 5, 2]
import statistics

ratings = [4, 5, 2]
print(statistics.median(ratings))
```
:::

### Medium: count repeated colors

Use `Counter` to print how often `green` occurs in a list.


:::tip Hint
Use the lesson idea about a tour of the standard library. Trace the sample values before printing so you can check each step.
:::

```sample input
colors = ['green', 'gold', 'green', 'red']
```

```expected
2
```

```python run
# Complete the Medium: count repeated colors task.
colors = ['green', 'gold', 'green', 'red']
# Write your code below
```


:::solution

`Counter(colors)` creates a mapping of each color to its frequency. Looking up `green` returns two.


```python
colors = ['green', 'gold', 'green', 'red']
from collections import Counter

colors = ["green", "gold", "green", "red"]
print(Counter(colors)["green"])
```
:::

### Challenge: inspect a date

Use `match_year`, `match_month` and `match_day` as the sample data. Create a date for a match and print its ISO representation.


:::tip Hint
Use the lesson idea about a tour of the standard library. Trace the sample values before printing so you can check each step.
:::

```sample input
match_year = 2026
match_month = 4
match_day = 11
```

```expected
2026-04-11
```

```python run
# Complete the Challenge: inspect a date task.
match_year = 2026
match_month = 4
match_day = 11
# Write your code below
```


:::solution

Construct a `date` with year, month, and day, then call `isoformat()` for a standard date string.


```python
match_year = 2026
match_month = 4
match_day = 11
import datetime

match_day = datetime.date(2026, 4, 11)
print(match_day.isoformat())
```
:::

## Recap

- The standard library provides modules distributed with Python.
- Choose a module whose documented purpose matches the task.
- `datetime`, `statistics`, `collections`, and `math` cover common needs.
- A fixed random seed makes simulations and examples repeatable; `random` is not for secrets.
- Check Python 3.12 documentation and distinguish standard modules from installed packages.

Reference: Python documentation, The Python Standard Library
