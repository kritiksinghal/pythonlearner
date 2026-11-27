---
title: "Reading error messages"
curriculumTitle: "Reading error messages"
track: "Python from zero"
module: "M6 Errors, files, modules"
order: 27
level: "Beginner"
summary: "Learn to use Python's error type, message, and traceback to find a useful starting point for debugging."
prerequisites:
  - "Recursion"
learningGoals:
  - "Tell syntax errors apart from exceptions"
  - "Read the final line of an exception report"
  - "Use traceback file names and line numbers as clues"
  - "Make one focused correction and run the code again"
relatedProblems: []
---
## What you will learn

- How **syntax errors** differ from errors raised while code runs
- What the **traceback** at the end of a failed run is showing
- How to use an exception's name and message as clues
- Why the reported line may point near the cause rather than to the whole cause
- A repeatable process for testing one correction at a time

## Why this matters

Every programmer encounters errors, including people who write Python every day. An error message is Python's report about what it could not understand or complete. If you can read the report calmly, you can replace guessing with a sequence of small checks. This skill saves time in every later topic, from reading files to building games.

## The big idea

Imagine a delivery service that gives you a tracking history and a short reason the parcel stopped. The history shows the route; the final reason tells you the immediate problem. A Python traceback works similarly: its stack entries show the path through calls, while the final line names the exception and describes what went wrong.

A **syntax error** means Python could not parse the written structure as a valid program. An **exception** is an error Python raises while executing code that was syntactically acceptable. Both reports provide clues. A traceback is not a verdict on you or your program's entire design; it is a map to inspect one failure.

## Step by step

### Start with the last line

When a program fails, find its final line first. It usually gives an exception type followed by a short explanation. For example, adding a number to a word is valid syntax but an unsupported operation at runtime.

```python run
try:
    result = "points" + 4
except TypeError as problem:
    print(type(problem).__name__)
    print(problem)
```

```output
TypeError
can only concatenate str (not "int") to str
```

Python raises `TypeError` because the operation is not supported for those two values. The text after the type explains which values conflicted. We catch the exception here so the runnable example can display its details instead of stopping the verifier. Handling errors is the next lesson, **try and except**.

### Separate parsing from execution

Python must understand the code's structure before it can run it. A missing colon after `if` is a syntax error. The parser marks where it noticed a problem; that place is a useful clue, though the missing character may be immediately before it.

```python run
source = "if temperature > 30 print('hot')"
try:
    compile(source, "weather.py", "exec")
except SyntaxError as problem:
    print(type(problem).__name__)
    print(problem.msg)
```

```output
SyntaxError
invalid syntax
```

The `compile` call checks whether a string has valid Python structure without executing it. This lets us demonstrate a syntax problem inside a working example. In an ordinary `.py` file, Python reports the file and line near the invalid statement.

### Recognize a name problem

`NameError` often means a name is misspelled or has not been assigned before use. Compare the spelling and capitalization where it is created with the spelling where it is read.

```python run
try:
    print(team_score)
except NameError as problem:
    print(type(problem).__name__)
    print(problem)
```

```output
NameError
name 'team_score' is not defined
```

Python tells you the missing name exactly as it was used. Check whether you meant another variable such as `team_scores`, whether the assignment runs first, and whether capitalization matches. Do not create a new variable blindly; first identify the intended value.

### Read the traceback from bottom upward

A traceback can include several calls. Its entries show the path Python followed. The final exception line tells you the immediate failure; the nearest source line above it usually shows the operation that raised it. If a helper function is involved, inspect both that line and the call that supplied its data.

```python run
def average(total, count):
    return total / count

try:
    average(48, 0)
except ZeroDivisionError as problem:
    print(type(problem).__name__)
    print(problem)
```

```output
ZeroDivisionError
division by zero
```

The code is syntactically valid, and the function call succeeds far enough to begin division. The immediate operation is invalid because the denominator is zero. The traceback for an uncaught version would also include the line in `average` and the line that called `average`.

### Use the error type as a category

Exception types group related failures. `TypeError` points toward an operation or function receiving an unsuitable type. `ValueError` often means the type is acceptable but the particular value is not. `IndexError` means a sequence position is outside its available range. These names narrow your search, but you still need to inspect the exact code and data.

```python run
try:
    jersey_number = int("captain")
except ValueError as problem:
    print(type(problem).__name__)
    print(problem)
```

```output
ValueError
invalid literal for int() with base 10: 'captain'
```

The string is text, which `int()` can receive, but its contents do not describe an integer. The message identifies the rejected value. A different problem, such as passing a list to `int()`, would be a type mismatch and would use a different exception.

### Look at line numbers and filenames

When Python runs a saved file, a traceback includes its filename and line number. Open that file and inspect the indicated line plus a few lines around it. A line number is a starting point: values may have been created earlier, and a call may have passed the wrong argument.

```python run
def show_first(items):
    return items[0]

try:
    show_first([])
except IndexError as problem:
    print(type(problem).__name__)
    print(problem)
```

```output
IndexError
list index out of range
```

The function assumes the list has an item at position zero. The empty list has no valid positions. To fix the cause, decide what the program should do for an empty list and check that condition before indexing. The fix belongs in the program's logic, not in the wording of the error.

### Check values before changing code

Some bugs come from unexpected data. Print a small, relevant value or inspect its type before rewriting a function. This example shows what an input string contains after trimming spaces.

```python run
raw_temperature = "  28  "
clean_temperature = raw_temperature.strip()
print(repr(raw_temperature))
print(repr(clean_temperature))
print(type(clean_temperature).__name__)
```

```output
'  28  '
'28'
str
```

`repr()` makes spaces visible in the display, so you can distinguish a value with padding from one without it. The cleaned value remains a string. If your next operation expects a number, convert it deliberately; inspecting a value does not change its type.

### Fix one cause and run again

Make the smallest correction that addresses the evidence, then run the program again. A fix can reveal a second error that was hidden behind the first one. That does not mean the first change was wrong; execution simply reached a later line.

```python run
readings = [19, 22, 25]
position = 1
print(readings[position])
```

```output
22
```

Here the position is valid because list positions start at zero. If a traceback points to indexing, inspect both the list and the index. Do not change several unrelated lines at once, because then it becomes harder to tell which change solved the problem.

### Distinguish the report from the cause

An exception describes a failure at one point in execution, but the input that caused it may come from a different part of your program. Trace a value from where it is created to where it is used. Write down the expected type and a realistic example value for each step.

```python run
def format_price(cents):
    dollars = cents / 100
    return f"${dollars:.2f}"

print(format_price(725))
```

```output
$7.25
```

This function accepts integer cents and converts them to dollars. If some caller instead provides text, inspect that call before altering the formatting logic. Knowing what a function expects helps you locate the earliest point where actual data stopped matching that expectation.

### Make a tiny reproduction

When a larger program fails, reduce it to the smallest code and data that still show the problem. A short reproduction removes distractions and makes it easier to compare the expected and actual behavior.

```python run
scores = [72, 88, 91]
print(f"Highest score: {max(scores)}")
print(f"Number of scores: {len(scores)}")
```

```output
Highest score: 91
Number of scores: 3
```

This small example checks two assumptions: that the collection has values and that the built-ins receive a sequence. Keep a reproduction honest by preserving the conditions that caused the failure. If removing a line makes the problem disappear, add it back and narrow down the relevant interaction.

## What Python is doing behind the scenes

Python first parses statements into a structure it can execute. If the structure is invalid, it raises a `SyntaxError` before ordinary execution begins. If the structure is valid, Python evaluates operations in order. An operation can raise an exception when a value or situation prevents it from completing.

For an uncaught exception, Python prints a traceback. Each frame identifies a location in the call path. The final line names the exception and gives its message. In nested calls, the traceback lists the route from the program entry point toward the location that failed. A useful reading order is to inspect the final line for the category, then move upward to the closest relevant source line, and then follow any data it depends on.

| Traceback clue | What it can tell you | Next check |
|---|---|---|
| Exception type | Broad category of failure | Find operations that commonly raise it |
| Final message | Immediate detail such as a missing name | Compare the named value with your code |
| File and line | Location where the failure was detected | Inspect nearby statements and inputs |
| Earlier call frames | How execution reached that location | Follow arguments and return values |

Python does not know the behavior you intended. It reports a concrete condition, such as an unsupported operation, a missing key, or an invalid conversion. You decide whether the program should validate input, choose a different operation, or handle the situation. The following lesson explains how `try` and `except` can respond to selected exceptions.

## Common mistakes

### Treating every error as a syntax error

Broken code:

```python
score = 10
print(score / 0)
```

Python runs the valid statements until division raises `ZeroDivisionError: division by zero`. Check whether the message names an exception raised during execution or `SyntaxError` from parsing. Then inspect the operation and its input values.

### Editing the line above the marked line without checking

Broken code:

```python
temperature = "hot"
print(temperature + 3)
```

The error is `TypeError: can only concatenate str (not "int") to str`. The print line is where incompatible values are combined, while the earlier assignment explains how the text arrived. Compare the types and decide whether the input should be converted or the operation changed.

### Reading only the first traceback line

The first line often says `Traceback (most recent call last):`; it is a heading, not the diagnosis. Move to the final line to learn the exception type and message, then inspect the relevant source location immediately above it.

### Making several changes before rerunning

If you alter five lines and the program works, you have not learned which assumption was wrong. Change one likely cause, rerun the smallest reproduction, and observe whether the failure changes. This keeps debugging evidence clear.

## Cheat sheet

| If you see | First place to investigate |
|---|---|
| `SyntaxError` | Colons, brackets, quotes, indentation, and nearby syntax |
| `NameError` | Spelling, capitalization, and whether assignment ran first |
| `TypeError` | Whether the operation or function supports those types |
| `ValueError` | Whether the value's contents are acceptable |
| `IndexError` | Sequence length and requested position |
| Traceback frame | The file, line, and call that led to the failure |
| Unexpected output | Actual values, types, and the earliest wrong step |

## Try it yourself

### Easy: inspect the type

Use `left_value` and `right_value` as the sample data. The operation below raises an exception. Catch it and print its type name and message.


:::tip Hint
Use the lesson idea about reading error messages. Trace the sample values before printing so you can check each step.
:::

```sample input
left_value = 12
right_value = ' runs'
```

```expected
TypeError
unsupported operand type(s) for +: 'int' and 'str'
```

```python run
# Complete the Easy: inspect the type task.
left_value = 12
right_value = ' runs'
# Write your code below
```


:::solution
The runnable block already shows the solution: inspect the caught exception using `type(problem).__name__` and print `problem` for its message. A fix for the original operation could convert the integer with `str(12)` or format it in a string.

```python
left_value = 12
right_value = ' runs'
try:
    print(12 + " runs")
except TypeError as problem:
    print(type(problem).__name__)
    print(problem)
```
:::

### Medium: find a valid index

Use `players` as the sample data. Make the index safe for the two-item list and print the second item.


:::tip Hint
Use the lesson idea about reading error messages. Trace the sample values before printing so you can check each step.
:::

```sample input
players = ['Ravi', 'Noor']
```

```expected
Noor
```

```python run
# Complete the Medium: find a valid index task.
players = ['Ravi', 'Noor']
# Write your code below
```


:::solution
The list has positions zero and one, so `index = 1` selects its second value. If the index came from changing input, check that it remains below `len(players)` before indexing.

```python
players = ['Ravi', 'Noor']
players = ["Ravi", "Noor"]
index = 1
print(players[index])
```
:::

### Challenge: make the input visible

Use `label` as the sample data. Trim the whitespace from the text, then display both original and cleaned values with `repr()`.


:::tip Hint
Use the lesson idea about reading error messages. Trace the sample values before printing so you can check each step.
:::

```sample input
label = '  practice  '
```

```expected
'  practice  '
'practice'
```

```python run
# Complete the Challenge: make the input visible task.
label = '  practice  '
# Write your code below
```


:::solution
`strip()` creates a string without surrounding whitespace. `repr()` shows the spaces in the original value so the change is easy to inspect.

```python
label = '  practice  '
label = "  practice  "
clean_label = label.strip()
print(repr(label))
print(repr(clean_label))
```
:::

## Recap

- A syntax error prevents Python from parsing the program; an exception happens during execution.
- The final traceback line names the exception and describes the immediate problem.
- File names, line numbers, and earlier call frames help you trace the failure.
- Inspect actual values and types before choosing a fix.
- Correct one cause, rerun, and use the next result as new evidence.

Reference: Python documentation, Errors and Exceptions
