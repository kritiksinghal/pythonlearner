---
title: "Exceptions"
curriculumTitle: "Exceptions"
track: "CS50P"
module: "Week 3 Exceptions"
order: 4
level: "Beginner"
summary: "Handle expected runtime problems with try, except, else, and raise."
prerequisites:
  - "loops"
learningGoals:
  - "Distinguish common Python error types"
  - "Handle expected exceptions with specific except clauses"
  - "Use else for the success path and pass when no action is needed"
  - "Raise ValueError when a value violates a rule"
relatedProblems: []
---
## What you will learn

- What an exception is and when Python raises one
- How to place risky operations inside `try`
- How specific `except` blocks handle known failures
- When `else` and `pass` are useful
- How a function can raise an exception for invalid data

## Why this matters

People enter unexpected values, and programs also encounter mistakes while processing their own data. A number conversion can fail when the text contains letters, a division can fail when its denominator is zero, and a dictionary lookup can fail when the requested key is absent. An exception gives the program a defined way to respond to a runtime problem. Handling an expected failure can guide a person toward a valid value or report why an operation cannot proceed. Thoughtful exception handling keeps the response specific, while broad handling can hide a separate programming bug.

## The big idea

An exception is raised when Python detects a problem during execution. If no matching handler exists, the program stops and displays an error. Put the risky operation in a `try` block and use an `except` block to handle the kind of exception you expect. Python skips the rest of the `try` suite after an exception, then looks for a matching handler.

If the `try` suite completes without raising an exception, an optional `else` block runs. This creates a clear success path separate from recovery. When validating your own values, `raise` lets a function signal that an argument violates its rule. Catch only errors you can meaningfully handle; otherwise a bug can disappear behind an overly broad handler.

## Step by step

### Observe a conversion exception safely

`int()` can convert digit text, but it cannot interpret an arbitrary word as an integer. The conversion is placed inside `try`, and the `except` branch supplies a useful response for this particular problem.

```python run
raw_amount = "many"
try:
    amount = int(raw_amount)
except ValueError:
    print("Enter a whole-number amount")
```

```output
Enter a whole-number amount
```

The value is a string, which is a valid input type for `int`, but its content is not a valid integer spelling. That mismatch in value raises `ValueError`, so the handler runs instead of the remaining `try` statements.

### Run the success path with else

The `else` block belongs to a `try`/`except` structure. It runs only if the `try` suite completes without an exception.

```python run
raw_count = "14"
try:
    count = int(raw_count)
except ValueError:
    print("Count was not a whole number")
else:
    print("Next count:", count + 1)
```

```output
Next count: 15
```

Since the conversion succeeds, Python skips the `except` branch and executes `else`. This arrangement makes the successful result handling distinct from the recovery message.

### Handle more than one known failure

Separate `except` branches let a program respond differently to different failures. The first conversion can fail with `ValueError`; division can fail with `ZeroDivisionError`.

```python run
numerator_text = "28"
denominator_text = "0"
try:
    numerator = int(numerator_text)
    denominator = int(denominator_text)
    print(numerator / denominator)
except ValueError:
    print("Use whole numbers")
except ZeroDivisionError:
    print("A denominator must not be zero")
```

```output
A denominator must not be zero
```

Both conversions work, so Python reaches division. The zero denominator raises `ZeroDivisionError`, which selects its matching handler. The `ValueError` handler is not used.

### Handle two errors with the same response

An `except` clause can name a tuple of exception types when the same recovery makes sense for either one. This keeps identical responses in one place.

```python run
items = ["map", "compass", "water"]
requested_index = "9"
try:
    print(items[int(requested_index)])
except (ValueError, IndexError):
    print("That item position is unavailable")
```

```output
That item position is unavailable
```

The text converts to an integer successfully, but index 9 is beyond the list's available positions. If the text had not represented an integer, `ValueError` would use the same message. Keep the group limited to errors the response actually explains.

### Keep the try block narrow

Put the operation that may fail in `try`, then place unrelated work outside or in the success path. This makes it clear which failure the handler is meant to address.

```python run
raw_temperature = "31"
try:
    temperature = int(raw_temperature)
except ValueError:
    print("Temperature must be a whole number")
else:
    label = "hot" if temperature >= 30 else "mild"
    print(label)
print("Reading complete")
```

```output
hot
Reading complete
```

The conversion is the risky step. When it succeeds, `else` classifies the value and the final statement runs afterward. If conversion fails, Python skips `else` but continues after the exception structure.

### Retry until a conversion works

A loop can ask again after a bad value. In a browser example, a list represents successive entries from a user; it lets us demonstrate the recovery path without needing live input.

```python run
entries = ["six", "6"]
for raw in entries:
    try:
        result = int(raw)
    except ValueError:
        print("Try another entry")
    else:
        print("Accepted:", result)
        break
```

```output
Try another entry
Accepted: 6
```

The first conversion raises `ValueError`, so the loop proceeds to its next entry. The second conversion succeeds, and `break` leaves the loop after the accepted result. This is the same recovery shape used by a repeated prompt.

### Write a reusable integer reader

The notes' `get_int` pattern keeps asking until conversion succeeds, then returns the integer. Here a list stands in for a user's successive answers so the block can run in the lesson reader.

```python run
def get_int(responses):
    for raw in responses:
        try:
            return int(raw)
        except ValueError:
            pass
    return None

print(get_int(["later", "23"]))
```

```output
23
```

The first item cannot be converted, so `pass` does nothing and iteration continues. The next conversion succeeds. `return` leaves the function immediately with the converted value, so no extra success branch is required. The `None` fallback handles the special case where the supplied sequence has no usable item.

### Use pass when recovery should simply retry

`pass` is a statement that performs no action. It can make an exception handler syntactically complete when the loop itself is the recovery action.

```python run
responses = ["eleven-ish", "11"]
for response in responses:
    try:
        seats = int(response)
    except ValueError:
        pass
    else:
        print("Seats reserved:", seats)
        break
```

```output
Seats reserved: 11
```

The first invalid response is ignored and the next loop round begins. The second response converts, so `else` reports it and `break` stops asking. If a failed response should be explained to the user, print a message instead of silently passing.

### Raise an exception when your own rule fails

Use `raise` when a function receives a value that violates a condition the function promises to enforce. A negative age is an example of a value that the function can reject.

```python run
def set_age(age):
    if age < 0:
        raise ValueError("Age must not be negative")
    return age

try:
    print(set_age(24))
    print(set_age(-2))
except ValueError as error:
    print(error)
```

```output
24
Age must not be negative
```

The first call returns normally. The second call raises `ValueError`; execution jumps to the matching handler, so no later statement in the `try` suite would run. The message describes the invalid condition without exposing unrelated implementation details.

### Distinguish several common exception names

Different exception types point to different problems. Knowing a few names helps choose the handler that matches the operation.

```python run
try:
    int("cloud")
except ValueError:
    print("ValueError")
try:
    "score" + 3
except TypeError:
    print("TypeError")
try:
    9 / 0
except ZeroDivisionError:
    print("ZeroDivisionError")
```

```output
ValueError
TypeError
ZeroDivisionError
```

The examples demonstrate a bad value for conversion, an incompatible pair of operand types, and division by zero. `SyntaxError` instead refers to invalid Python grammar; `NameError` means a name cannot be found. `KeyError` and `IndexError` relate to unavailable dictionary keys and list positions.

## What Python is doing behind the scenes

Python executes a `try` suite in order until it finishes or an exception is raised. If an exception occurs, Python abandons the remaining statements in that suite and checks the `except` clauses for a matching type. It runs the first matching handler. A handler that names `ValueError` does not handle `ZeroDivisionError`, which is why distinct errors can receive distinct messages.

If no exception occurs, Python skips all `except` suites. If an `else` suite is present, Python runs it after the successful `try`. A `finally` suite is outside this lesson's scope; it is covered in **Context managers**. A `raise` statement reverses the direction: the program deliberately signals an exception so a caller can decide how to handle it.

## Common mistakes

### Catching everything

A bare `except:` can catch failures unrelated to the input being validated. If a misspelled variable raises `NameError`, a broad handler may incorrectly describe that as a bad number. Catch the specific exception you expect and can recover from.

An exception handler is not a substitute for checking every possible program defect. Its job is to turn a known failure into a useful next step. If the code itself has an unrelated mistake, allowing that mistake to remain visible is often safer than reporting a misleading message. Keep the user's recovery message brief and explain what value or action would help.

### Putting too much code inside try

When an entire function body is protected, it can be hard to tell which operation caused a matching exception. Keep the risky conversion or calculation in the `try` suite; put success work in `else` or after the structure.

### Forgetting the retry step

An empty `except` with `pass` only makes sense when another loop round will retry or when ignoring the error is intentional. If the program continues using a value that was never assigned, it may fail later in a less clear way.

### Using the wrong error category

Bad text for integer conversion raises `ValueError`, while an incompatible type operation raises `TypeError`. Match the handler to the operation and the expected failure so the response is meaningful.

## Cheat sheet

| Need | Pattern |
|---|---|
| Protect a risky operation | `try: ...` |
| Handle a known failure | `except ValueError:` |
| Continue only after success | `else:` |
| Do nothing in a handler | `pass` |
| Signal an invalid argument | `raise ValueError("message")` |
| Give same recovery for types | `except (ValueError, IndexError):` |

## Try it yourself

### Easy: convert a delivery count

Use `raw` as the sample data. Handle a non-integer value with a specific exception type. Print the result exactly as shown in Expected output.


:::tip Hint
Use the lesson idea about exceptions. Trace the sample values before printing so you can check each step.
:::

```sample input
raw = 'twelve'
```

```expected
Enter a whole number of packages
```

```python run
# Complete the Easy: convert a delivery count task.
raw = 'twelve'
# Write your code below
```


:::solution
`int` cannot convert the word to an integer, so it raises `ValueError` and the handler prints the requested guidance.

```python
raw = 'twelve'
raw = "twelve"
try:
    packages = int(raw)
except ValueError:
    print("Enter a whole number of packages")
```
:::

### Medium: process a valid mark

Use an `else` suite for work that should happen only after conversion succeeds. Print the result exactly as shown in Expected output.


:::tip Hint
Use the lesson idea about exceptions. Trace the sample values before printing so you can check each step.
:::

```sample input
raw_mark = '88'
```

```expected
Recorded mark: 88
```

```python run
# Complete the Medium: process a valid mark task.
raw_mark = '88'
# Write your code below
```


:::solution
The text converts successfully. Python skips `except` and runs `else` with the integer value.

```python
raw_mark = '88'
raw_mark = "88"
try:
    mark = int(raw_mark)
except ValueError:
    print("Enter a whole-number mark")
else:
    print("Recorded mark:", mark)
```
:::

### Challenge: validate an age range

Raise a `ValueError` for an age outside the stated range and catch it at the call site. Print the result exactly as shown in Expected output.


:::tip Hint
Use the lesson idea about exceptions. Trace the sample values before printing so you can check each step.
:::

```sample input
age = 15
invalid_age = 130
```

```expected
Age is outside the allowed range
```

```python run
# Complete the Challenge: validate an age range task.
age = 15
invalid_age = 130
# Write your code below
```


:::solution
The condition is true for 135, so the function raises rather than returning an invalid value. The caller catches that particular exception and prints its message.

```python
age = 15
invalid_age = 130
def checked_age(age):
    if age < 0 or age > 120:
        raise ValueError("Age is outside the allowed range")
    return age

try:
    print(checked_age(135))
except ValueError as error:
    print(error)
```
:::

## Recap

- An exception reports a problem that occurs while Python runs code.
- Put risky operations in `try` and handle expected exception types specifically.
- `else` runs only when the `try` suite succeeds; `pass` intentionally does nothing.
- Use `raise` to signal that a value violates a rule your function enforces.

Based on Harvard's CS50P
Reference: Python documentation, Errors and Exceptions
