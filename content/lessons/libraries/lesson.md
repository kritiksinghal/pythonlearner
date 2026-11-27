---
title: "Libraries"
curriculumTitle: "Libraries"
track: "CS50P"
module: "Week 4 Libraries"
order: 5
level: "Beginner"
runnableMin: 3
summary: "Reuse modules, install packages, read command-line arguments, and understand APIs."
prerequisites:
  - "exceptions"
learningGoals:
  - "Import standard-library modules and use their functions"
  - "Distinguish Python modules from third-party packages"
  - "Read command-line arguments through sys.argv"
  - "Describe packages, APIs, and a reusable local module"
relatedProblems: []
---
## What you will learn

- How an imported module makes reusable functions available
- How to use `random` and `statistics`
- How third-party packages are installed with `pip`
- How a script receives words through `sys.argv`
- How an API and a small module fit into a program

## Why this matters

Many useful operations have already been written and tested in reusable code. Python includes modules for common tasks, while packages from other authors can add capabilities beyond that built-in collection. Reusing a documented function lets you focus on your program's purpose rather than rebuilding every tool. Modules also help organize code you write yourself. A command-line script can receive information when it starts, and an API can let it request information from a service. Understanding where code comes from and how it is imported makes these pieces easier to combine.

## The big idea

A **module** is a named collection of Python code that can be imported. The `import` statement makes its names available, and a dot accesses a name inside that module, as in `statistics.mean(...)`. Python's standard library is included with Python. A third-party package must be installed in the environment where the program runs, commonly with `pip`.

The same separation applies to your own code: put reusable functions in one file and import them from another. The special `__name__` check can keep a file's demonstration or startup code from running just because another file imported it. Separately, `sys.argv` carries command-line words, while an API is a way one program can request information from another service.

## Step by step

### Import an entire module

After `import random`, use the module name before its function. The dot means the function belongs to that module.

```python
import random

teams = ["Comets", "Lanterns", "Riverhawks"]
print(random.choice(teams))
```

Each run can display any one of the three team names. The selected value is returned by `choice` and stored nowhere here, so the print call displays that value directly.

### Request a random integer

`randint` chooses a whole number between its two endpoints, including both ends.

```python
import random

shirt_number = random.randint(1, 11)
print(shirt_number)
```

The result is an integer from 1 through 11. This is different from choosing a list item: the function receives numeric boundaries instead of a collection.

### Shuffle a list in place

`shuffle` rearranges a list. Because the list itself changes, print the list after calling the function.

```python
import random

tracks = ["Blue Signal", "Paper Planets", "Last Chord"]
random.shuffle(tracks)
print(tracks)
```

The order varies because the list is shuffled. The original list variable now refers to the rearranged order.

### Import one function directly

Use `from module import name` when you want to use a function without writing the module prefix.

```python
from random import choice

colors = ["indigo", "coral", "mint"]
print(choice(colors))
```

Here `choice` is available directly. The function is still from `random`; the import statement only changes how its name is written in this file. Each run displays one of the three listed colors.

### Calculate a mean with statistics

The `statistics` module includes a `mean` function for calculating the arithmetic average of numeric values.

```python run
import statistics

rainfall = [12, 18, 15, 25]
print(statistics.mean(rainfall))
```

```output
17.5
```

The function uses the values in the list. Importing `statistics` provides the function; it does not require a separate installation because it belongs to Python's standard library.

### Work with command-line arguments

`sys.argv` is a list of command-line words. Its first item is the script name; the next item is the first argument provided after the script name.

```bash
python3 greeting.py Mira
hello, Mira
```

```python
import sys

if len(sys.argv) < 2:
    sys.exit("Too few arguments")
print("hello,", sys.argv[1])
```

In the terminal example, the list is like `["greeting.py", "Mira"]`. The length check ensures the first requested argument exists before indexing it. This is a terminal example and cannot be run as-is inside the browser lesson runner, where the reader does not supply the script's process arguments.

### Check the number of arguments

If a script expects exactly one name, test for both missing and extra arguments before using the value.

```bash
python3 greeting.py Mira
hello, Mira
python3 greeting.py
Usage: python3 greeting.py name
```

```python
import sys

if len(sys.argv) != 2:
    sys.exit("Usage: python3 greeting.py name")
print("hello,", sys.argv[1])
```

This script expects the script name plus one argument, making the list length two. `sys.exit` stops execution and displays the supplied message when the count is wrong. The shell command and sample output illustrate the terminal behavior; the Python block is shown as a complete script rather than a browser runnable example.

### Install a third-party package

Python packages outside the standard library need to be installed before an import can use them. `pip` is the package installer described in this course.

```bash
python3.12 -m ensurepip --version
pip 25.0.1
```

This command and output were checked with the course's Python 3.12 interpreter. It reports the bundled pip version; it does not install a package. To add a third-party package in an environment where pip is available, run `python3.12 -m pip install cowsay`. Installing a package and importing it are separate steps.

```python
import cowsay

cowsay.cow("Welcome to the club")
```

This code depends on the package being installed in the active Python environment. It is shown as an example from the notes and is not part of the browser runnable blocks. I installed cowsay 6.1 in a temporary Python 3.12.11 environment and ran it; its sample output was:

```output
  ___________________
| Welcome to the club |
  ===================
                   \
                    \
                      ^__^
                      (oo)\_______
                      (__)\       )\/\
                          ||----w |
                          ||     ||
```

### Recognize an API request

An API is a service that a program can ask for information. The notes use `requests` to make a web request and read a JSON response. Since the response depends on an external service and connection, the following is a terminal-oriented illustration rather than a deterministic runnable lesson block.

```python
import requests

response = requests.get("https://example.invalid/search")
print(response.json())
```

The example highlights the roles: `requests` sends a request, and `json`-style response data can be read from the returned object. A real request needs a valid service address and may require query details. The exact response depends on that service; no fixed output is promised here. **Sample only:** no request was sent because `example.invalid` is a reserved address and the lesson supplies neither a real API endpoint nor credentials.

### Make a small reusable module

Place a function in a file such as `sayings.py`, then import the function from another file. Keep the definition separate from the code that calls it.

```python
# sayings.py
def greeting(name):
    print(f"Good evening, {name}")

if __name__ == "__main__":
    greeting("everyone")
```

```python
# concert.py
from sayings import greeting

greeting("orchestra")
```

When `sayings.py` is run directly, its `__name__` is `"__main__"`, so the demonstration runs. When another file imports it, that condition is false; the imported definition is available without automatically running the demonstration. This supports reuse without an unwanted startup action.

### Understand the module-name trap

Avoid giving your own file the name of a module you plan to import. A file named `random.py`, for example, can be found where Python expects the standard module, causing an import to load the wrong code. Choose a specific name for your own file and keep it distinct from standard-library module names.

```python run
from statistics import mean

marks = [72, 84, 91]
print(mean(marks))
```

```output
82.33333333333333
```

The import names the function directly, so the call is `mean(marks)`. A local file named `statistics.py` could interfere with finding the standard-library module, so the file name should remain distinct.

### Keep module use readable

Using a module prefix makes a function's origin visible. For example, `statistics.mean` says which collection supplies the operation. A direct import can be concise when the function is used often, but readers then need to look at the import line to see where it came from. Pick one form and use it consistently in the file.

```python run
import statistics

practice_minutes = [25, 40, 35]
average = statistics.mean(practice_minutes)
print(f"Average practice: {average} minutes")
```

```output
Average practice: 33.333333333333336 minutes
```

The name `statistics.mean` makes the module relationship explicit. The function computes a value the rest of the program can store and display.

## What Python is doing behind the scenes

An import makes a module's names available in the current program. With `import random`, the name `random` refers to the module and a function is accessed through that name. With `from random import choice`, the imported function name is placed directly in the current namespace. The module's implementation does not need to be copied into your file for you to call its documented interface.

Command-line arguments are supplied when the program starts and appear as strings in `sys.argv`. The program name occupies position zero, which is why an argument after the script is at index one. Check the list length before indexing a value that might not be present. A package installed by `pip` becomes importable in the Python environment where it was installed. APIs are a different connection: the program asks a service for data, and the service's response depends on that service.

## Common mistakes

### Calling a function without its module name

After `import random`, write `random.choice(values)`. `choice(values)` is available only if you imported that function directly with `from random import choice`.

### Forgetting to install a package

An import cannot use a third-party package until it is installed in the environment running the program. Standard-library modules such as `random`, `statistics`, and `sys` come with Python.

### Using the wrong argument index

`sys.argv[0]` is the script name, not the first user-supplied argument. Check the argument count before reading `sys.argv[1]`.

### Naming a file after a module

A local file named `random.py` can interfere with importing the intended module. Give your own files names that describe your code and do not shadow a module you need.

## Cheat sheet

| Need | Pattern |
|---|---|
| Import a module | `import statistics` |
| Call through a module | `statistics.mean(values)` |
| Import one function | `from random import choice` |
| Pick a list item | `random.choice(items)` |
| Install a package | `python3 -m pip install package_name` |
| Read first argument | `sys.argv[1]` after checking length |
| Guard direct startup code | `if __name__ == "__main__":` |

## Try it yourself

### Easy: choose a warm-up activity

Use `Counter` to find the most common activity in `activities`. Print that activity.


:::tip Hint
Use the lesson idea about libraries. Trace the sample values before printing so you can check each step.
:::

```sample input
activities = ["stretch", "skip", "stretch"]
```

```expected
stretch
```

```python run
# Complete the Easy: choose a warm-up activity task.
activities = ["stretch", "skip", "stretch"]
# Write your code below
```



:::solution
The function returns one item from the supplied list. The lesson runner fixes the random result for verification; an ordinary run may choose another activity.

```python
activities = ["stretch", "skip", "stretch"]
from collections import Counter

most_common = Counter(activities).most_common(1)[0][0]
print(most_common)
```
:::

### Medium: calculate an average

Use `temperatures` as the sample data. Use the standard library to compute the average of a set of temperatures. Print the result exactly as shown in Expected output.


:::tip Hint
Use the lesson idea about libraries. Trace the sample values before printing so you can check each step.
:::

```sample input
temperatures = [22, 26, 24]
```

```expected
24
```

```python run
# Complete the Medium: calculate an average task.
temperatures = [22, 26, 24]
# Write your code below
```


:::solution
`statistics.mean` calculates the arithmetic mean from the list and returns 24.

```python
temperatures = [22, 26, 24]
import statistics

temperatures = [22, 26, 24]
print(statistics.mean(temperatures))
```
:::

### Challenge: plan a command-line greeting

Use `name` as the sample data. Write a terminal script that expects exactly one name. Check the argument count before reading its first argument, then print a greeting.


:::tip Hint
Use the lesson idea about libraries. Trace the sample values before printing so you can check each step.
:::

```sample input
name = 'Nila'
```

```expected
hello, Nila
```

```python run
# Complete the Challenge: plan a command-line greeting task.
name = 'Nila'
# Write your code below
```

```bash
python3 greeting.py Nila
hello, Nila
```

:::solution
Import `sys`, check that `len(sys.argv)` is 2, and then print `sys.argv[1]`. If the count differs, call `sys.exit` with a short usage message.

```python
name = 'Nila'
import sys

sys.argv = ["greeting.py", "Nila"]
if len(sys.argv) != 2:
    raise SystemExit("Usage: python greeting.py NAME")
print(f"hello, {sys.argv[1]}")
```
:::

## Recap

- Modules provide reusable code; use the module prefix or import a function directly.
- The standard library comes with Python; third-party packages are installed with `pip`.
- `sys.argv` contains the script name followed by command-line arguments.
- APIs let a program request information from a service, and local modules let you reuse your own functions.

Based on Harvard's CS50P
Reference: Python documentation, Modules
