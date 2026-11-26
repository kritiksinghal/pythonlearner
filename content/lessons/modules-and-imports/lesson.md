---
title: "Modules and imports"
curriculumTitle: "Modules and imports"
track: "Python from zero"
module: "M6 Errors, files, modules"
order: 30
level: "Beginner"
summary: "Learn how imports let your program use names defined in modules and packages."
prerequisites:
  - "Reading and writing files"
learningGoals:
  - "Explain what a module provides"
  - "Import a module, selected names, or an alias"
  - "Recognize the difference between a module and a package"
  - "Diagnose common import-name mistakes"
relatedProblems: []
---

## What you will learn

- What a **module** is and why Python code is organized into modules
- How `import` makes names from another module available
- When to import a whole module, a selected name, or an alias
- What a **package** is at a beginner level
- How import paths and naming conflicts can affect a program

## Why this matters

As programs grow, placing every function in one file makes it harder to find and reuse code. Modules group related tools so you can import them where needed. Python's standard library contains modules for mathematics, dates, random choices, file paths, and many other common tasks. Organizing your own code into modules also gives different files clear responsibilities.

## The big idea

Think of a module as a labeled drawer in a shared workshop. The label tells you which tools are inside, and importing it gives your program a way to reach those tools. You can keep the drawer name and ask for a tool through it, or bring one selected name into the current room.

A Python **module** is commonly a `.py` file whose definitions can be imported. A **package** groups related modules under a package name. Imports are names in your program, so clear names matter: an import makes a value available but does not rename the concept itself.

## Step by step

### Import a complete module

Import a module when you want several related tools or want the source of each name to remain obvious. In this example, `math` supplies the constant `pi` and the `sqrt()` function.

```python run
import math

radius = 3
area = math.pi * radius ** 2
print(round(area, 2))
print(math.sqrt(81))
```

```output
28.27
9.0
```

The name `math` refers to the imported module. The dot operator looks up an attribute inside it, so `math.pi` and `math.sqrt` show where those names come from. `round()` is a built-in function and needs no import.

### Import one selected name

Use `from module import name` when one particular tool is central and the shorter spelling stays clear. The imported name can then be used directly.

```python run
from statistics import median

lap_times = [61, 58, 65, 59, 63]
print(median(lap_times))
```

```output
61
```

This statement binds the name `median` in the current module. The module prefix no longer appears at the call site, so use this style when the name is clear and unlikely to collide with another name.

### Give a module a readable alias

An alias provides another local name for a module. Use an alias when it makes a long or frequently used module name easier to read. The conventional `as` syntax is part of the import statement.

```python run
import datetime as dt

release_day = dt.date(2026, 12, 5)
print(release_day.year)
print(release_day.month)
```

```output
2026
12
```

The module can now be accessed through `dt`. This does not change the module itself; it only gives your program a local reference. Avoid cryptic aliases that make code harder to understand.

### Alias one selected name

You can alias an imported function or class too. This is useful when a local name would otherwise be confusing or conflict with another definition.

```python run
from math import ceil as round_up

print(round_up(8.1))
```

```output
9
```

The imported function now has the local name `round_up`. An alias is helpful when it clarifies use or avoids a name collision. The alias is only a local reference; the original function remains in the `math` module.

```python run
import random

music = random.Random(17)
tracks = ["Drum solo", "Quiet piano", "Bass break"]
print(music.choice(tracks))
```

```output
Bass break
```

`Random(17)` creates a predictable generator for this example, making the displayed result reproducible. When you need variable choices in a real program, use a random generator; for a lesson's expected output, a fixed seed keeps the example repeatable.

### Import multiple names from one module

You can import a short list of selected names from one module. Keep the list manageable so readers can see where each tool came from.

```python run
from math import ceil, floor

print(ceil(6.2))
print(floor(6.8))
```

```output
7
6
```

Both names come from `math`. `ceil()` returns the smallest integer greater than or equal to a number, while `floor()` returns the greatest integer less than or equal to it. Here both results display as whole numbers.

### Inspect what a module exposes

The built-in `dir()` function can list names attached to a module. It is useful for exploration, although official documentation is a better reference for what a name does.

```python run
import calendar

print("month_name" in dir(calendar))
print(calendar.month_name[4])
```

```output
True
April
```

The first result confirms that `month_name` is an available name in `calendar`. The second reads April's name by its month number. `dir()` helps you inspect names, but it does not explain each one or replace the module's documentation.

### Use a module from your own project

If two `.py` files are in the same folder, one can import definitions from the other by its filename without the `.py` suffix. This example shows the two files as a layout rather than importing a temporary file in the browser.

```python
# greetings.py
def welcome(member):
    return f"Welcome, {member}!"
```

```python
# main.py in the same folder
import greetings

print(greetings.welcome("Mina"))
```

Terminal session from that folder:

```bash
python3.12 main.py
```

```output
Welcome, Mina!
```

When Python processes `import greetings`, it locates `greetings.py`, executes its top-level statements, and makes its names available through the module object. Keep reusable definitions in the module and put the code that uses them in the caller file.

### Import from a package

A package is a way to group related modules using a directory structure. If a project has a `games` package and a `scores.py` module inside it, an import can name both parts.

```python
from games import scores

print(scores.best_of([12, 18, 14]))
```

The exact package files depend on the project layout. Python's import system searches locations on its module search path, so the current working directory, installed packages, and package structure affect whether an import succeeds. Package creation and installation details are beyond this lesson's scope.

### Avoid naming your file after a standard module

If your project file is named `random.py`, then `import random` may load that local file instead of the standard library module. Choose descriptive names that do not shadow modules you plan to use, such as `match_draw.py` rather than `random.py`.

```python run
import statistics

scores = [67, 74, 82, 91]
print(statistics.mean(scores))
```

```output
78.5
```

This imports the standard library's `statistics` module. If importing a familiar name fails or exposes unexpected attributes, inspect your project for a same-named file and rename it when appropriate.

### Keep imports near the top of a module

Imports are commonly placed near the beginning of a file after its module description. This makes dependencies easy to discover. A function can still import locally in special cases, but a beginner program is usually clearer when its imports are grouped at the top.

```python run
import math
import statistics

angles = [0, 30, 60]
average_angle = statistics.mean(angles)
print(math.isclose(average_angle, 30))
```

```output
True
```

Both imports are visible before the calculation. Import ordering conventions for larger projects are more detailed; the important beginner habit is to make dependencies obvious and avoid hiding an import deep inside unrelated code.

## What Python is doing behind the scenes

When an import statement runs, Python searches for a module with the requested name using its import system. If it finds one, it creates or retrieves a module object and binds a name in the current scope. With `import math`, the local name is `math`; with `from math import sqrt`, the local name is `sqrt`.

The dot in `math.sqrt` is attribute access: Python looks up `sqrt` on the module object named `math`. An alias changes only the local name bound by the import statement. A module is generally executed when it is first imported in a process and then cached, so later imports can reuse the loaded module.

| Statement | Local name created | How you use a function |
|---|---|---|
| `import math` | `math` | `math.sqrt(25)` |
| `import datetime as dt` | `dt` | `dt.date(2026, 1, 1)` |
| `from statistics import median` | `median` | `median(values)` |
| `from random import choice as choose` | `choose` | `choose(options)` |

An import error usually points to a name or location mismatch. Python may not find the requested module, or a local file may shadow a standard-library name. Check the spelling, file layout, and current working directory before changing unrelated code. Installing packages with `pip` is covered in **Virtual environments and pip**.

## Common mistakes

### Importing a function and then using its module prefix

If you wrote `from math import sqrt`, the local name is `sqrt`, so calling `math.sqrt(25)` fails unless `math` was imported separately. Either use the selected name directly or import the whole module.

### Importing a module and forgetting its prefix

After `import statistics`, the function is `statistics.mean(values)`. The bare name `mean` has not been imported. Use the module prefix or explicitly import `mean`.

### Misspelling a module name

If Python reports that it cannot find a module, check capitalization and spelling, then check that the module is installed or available in the project. A local file with the same name can also change what gets imported.

### Using a vague alias

An alias like `x` may shorten a line but makes the source of a name difficult to remember. Prefer clear module aliases such as `dt` for `datetime`, or keep the full module name.

### Assuming every import is built into Python

Python includes a standard library, but packages from third parties require separate installation. Check whether a name belongs to the standard library before assuming that `import` will find it in a fresh environment.

## Cheat sheet

| Need | Syntax | Example use |
|---|---|---|
| Import module | `import module` | `math.sqrt(16)` |
| Alias module | `import module as short` | `dt.date(...)` |
| Import selected name | `from module import name` | `median(values)` |
| Alias selected name | `from module import name as alias` | `choose(items)` |
| Inspect module names | `dir(module)` | `'pi' in dir(math)` |
| Use own sibling module | `import filename` | `helpers.format_score(8)` |

## Try it yourself

### Easy: import a complete module

Use `math` to find the square root of 144.

```python run
# Complete the import a complete module task.
# Sample data: number = 144
# Write your code below and print the result
```


:::solution
Import `math`, then access `sqrt` through the module name. This keeps the origin of the function clear.

```python
import math

print(math.sqrt(144))
```
:::

### Medium: import one selected function

Use `statistics.median` by importing just `median`, then find the middle score.

```python run
# Complete the import one selected function task.
# Sample data: marks = [71, 94, 83, 86, 78]
# Write your code below and print the result
```


:::solution
The statement binds `median` in the current module, so call `median(marks)` directly.

```python
from statistics import median

marks = [71, 94, 83, 86, 78]
print(median(marks))
```
:::

### Challenge: give the module a clear alias

Alias `datetime` as `dt`, create a date, and print its weekday number.

```python run
# Complete the give the module a clear alias task.
# Sample data: concert = dt.date(2026, 6, 20)
# Write your code below and print the result
```


:::solution
The alias `dt` refers to the imported module. A date's `weekday()` method returns a number from zero for Monday through six for Sunday.

```python
import datetime as dt

concert = dt.date(2026, 6, 20)
print(concert.weekday())
```
:::

## Recap

- A module groups Python definitions that another part of a program can import.
- Import a whole module when its prefix improves clarity; import selected names when that stays clear.
- Aliases change the local imported name, not the module itself.
- Packages group related modules, and Python searches its import path to locate them.
- Avoid naming local files after modules you need to import.

Reference: Python documentation, The import system
