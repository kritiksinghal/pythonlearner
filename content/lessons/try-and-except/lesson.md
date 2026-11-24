---
title: "try and except"
curriculumTitle: "try and except"
track: "Python from zero"
module: "M6 Errors, files, modules"
order: 28
level: "Beginner"
summary: "Handle selected runtime problems with try and except while keeping normal program flow clear."
prerequisites:
  - "Reading error messages"
learningGoals:
  - "Place risky operations in a try block"
  - "Catch a specific exception type with except"
  - "Use else and finally when they clarify the flow"
  - "Avoid hiding unrelated programming errors"
relatedProblems: []
---

## What you will learn

- How a **try block** marks code where a known problem may happen
- How an **except clause** responds to a particular exception
- How to catch different exceptions with separate clauses
- When `else` and `finally` clarify what happens after an attempt
- Why broad or empty handlers can make a program harder to debug

## Why this matters

Programs often receive values that are outside their control: a person may type a word where a number is expected, or a data record may be incomplete. Stopping with a traceback is sometimes right, but a user-facing program may instead offer another chance or choose a safe fallback. `try` and `except` let you describe that response directly. Used carefully, they make expected failures manageable while keeping unexpected bugs visible.

## The big idea

Think of a try block as a short work area where a particular task might fail, and an except clause as the response plan for a known failure. If the task succeeds, Python continues normally. If it raises a matching exception, Python skips the rest of that try block and runs the matching handler.

The important word is **matching**. A handler for `ValueError` does not catch every possible problem. This selectivity lets the program respond to a user entering an invalid number without hiding an unrelated `NameError` caused by a misspelled variable. Handle the problems you expect, and allow other problems to remain visible while you are developing.

## Step by step

### Catch a failed number conversion

Converting text to an integer can raise `ValueError` when the characters do not represent an integer. Put only that conversion in the try block, and provide a clear message in the matching handler.

```python run
text = "many"
try:
    amount = int(text)
except ValueError:
    print("Enter a whole number")
```

```output
Enter a whole number
```

Python attempts `int(text)`. Because `text` contains a word, it raises `ValueError`; execution jumps to the handler and displays guidance. The variable `amount` is not assigned in this path, so code after the handler must not assume conversion succeeded.

### Keep the try block focused

If the try block contains many unrelated lines, an exception can come from a place you did not intend to handle. Keep it focused on the risky operation, then use the result afterward.

```python run
text = "34"
try:
    ticket_count = int(text)
except ValueError:
    print("Ticket count must be a whole number")
else:
    print(f"Tickets reserved: {ticket_count}")
```

```output
Tickets reserved: 34
```

The conversion succeeds, so the `else` suite runs. The `else` clause belongs to the try statement and runs only when no exception was raised in its try suite. If conversion fails, the except suite runs instead.

### Catch the specific exception you expect

A list lookup may raise `IndexError` if a requested position is invalid. The handler should explain that situation, not silently pretend that all possible errors are the same.

```python run
stations = ["Central", "Museum", "Harbor"]
position = 5
try:
    print(stations[position])
except IndexError:
    print("That station number is not on the route")
```

```output
That station number is not on the route
```

The list has positions zero through two, so position five raises `IndexError`. The except clause catches that type. If `stations` itself were misspelled, Python would raise `NameError`, which this handler would not hide.

### Handle two expected input problems separately

An operation can raise more than one relevant exception type. Separate handlers let you give different responses when the difference matters.

```python run
values = [12, 18, 24]
try:
    position = int("3")
    print(values[position])
except ValueError:
    print("Use a whole-number position")
except IndexError:
    print("Choose a position from 0 to 2")
```

```output
Choose a position from 0 to 2
```

The text converts successfully to the integer `3`, then the list lookup fails because position three is outside the list. Python checks the handlers from top to bottom and runs the first one whose exception type matches.

### Capture the exception object

Use `as` when the exception's message is useful for diagnosis or a carefully designed response. The name after `as` refers to the exception object inside the handler.

```python run
try:
    price = float("free")
except ValueError as problem:
    print(type(problem).__name__)
    print("Price could not be read")
```

```output
ValueError
Price could not be read
```

The handler uses the exception type for a diagnostic, then provides a stable message for a user. Avoid displaying raw error details in a polished interface unless they are appropriate for that audience; they can be helpful during development.

### Use `else` for the success path

The `else` suite runs only when the try suite finishes without raising an exception. Put work that depends on a successful attempt there. This keeps operations that might raise a different error outside the protected conversion.

```python run
raw = "7"
try:
    seat_count = int(raw)
except ValueError:
    print("Seat count must be numeric")
else:
    print(f"You selected {seat_count} seats")
```

```output
You selected 7 seats
```

When conversion succeeds, Python enters `else`. If it does not, the except handler runs and the else suite is skipped. A focused try block makes it clear exactly which failure the handler is intended to cover.

### Use `finally` for cleanup that must happen

The `finally` suite runs whether the try suite succeeds or raises an exception. It is often used for cleanup. The example uses a simple status message so you can see the order without opening a file.

```python run
try:
    print("Checking a score")
finally:
    print("Check finished")
```

```output
Checking a score
Check finished
```

`finally` is separate from choosing an exception response. It runs after the try or handler path. For file cleanup, a `with` statement is usually clearer; file behavior is covered in **Reading and writing files**.

### Observe the order when an exception is caught

When an exception is matched, Python skips remaining statements in that try suite, runs the handler, then runs `finally` if present.

```python run
try:
    print("Before")
    int("snow")
    print("After conversion")
except ValueError:
    print("Bad number")
finally:
    print("Finished")
```

```output
Before
Bad number
Finished
```

The conversion raises before the second print. Python transfers control to `except`, so `After conversion` is skipped. Once the handler completes, it executes `finally`. This predictable order is useful when you need to clean up a resource or record that an attempt has ended.

### Catch a shared parent type only when appropriate

Several built-in exceptions belong to a family. Catching a shared parent type can be useful when the same response makes sense for all those cases. A broad `Exception` handler can also hide programming mistakes, so choose the narrowest type that matches the behavior you intend to handle.

```python run
try:
    seats_left = [4, 6][int("four")]
except (ValueError, IndexError):
    print("Could not choose a seat")
```

```output
Could not choose a seat
```

The except clause accepts a tuple of exception types. The conversion raises `ValueError`, so Python runs the shared response. This is appropriate only because the same message works for either conversion failure or invalid position.

### Validate a condition without using exceptions

Not every unusual value needs a try statement. If a condition is easy to check before performing an operation, a normal `if` can be clearer.

```python run
playlist = ["Intro", "Rain Song"]
requested_track = 2
if 0 <= requested_track < len(playlist):
    print(playlist[requested_track])
else:
    print("Track number is outside the playlist")
```

```output
Track number is outside the playlist
```

The program checks the index range before looking up the item. This is a normal decision, not a failed operation. Use exception handling when an operation may fail in a way you intend to respond to, not as a replacement for every condition.

### Give a safe fallback when it makes sense

Sometimes a program can continue with a sensible default. Make the fallback explicit so the reader knows it is intentional.

```python run
raw_limit = "unset"
try:
    limit = int(raw_limit)
except ValueError:
    limit = 5
    print("Using the default limit")
print(f"Limit: {limit}")
```

```output
Using the default limit
Limit: 5
```

The handler assigns `limit` on the failure path, and the final print works on either path. A fallback is safe only when the default is meaningful. For a financial amount or security setting, silently substituting a value could be harmful; a clear retry or stop may be better.

## What Python is doing behind the scenes

Python executes the try suite in order. If no exception escapes it, Python skips the except suites and may run `else`. If an exception occurs, Python searches the except clauses from top to bottom for a compatible type. It runs one matching handler and then proceeds after the whole try statement. If no handler matches, the exception continues outward as if the try statement were not there.

The optional `else` belongs to the success path. The optional `finally` suite runs during normal completion and while an exception is propagating. Keeping the try suite short is a useful design practice because it limits which operations can trigger the handler.

| Path | Try suite | Except | Else | Finally |
|---|---|---|---|---|
| No exception | Completes | Skipped | Runs if present | Runs if present |
| Matching exception | Stops at failure | Runs | Skipped | Runs if present |
| Unmatched exception | Stops at failure | No clause handles it | Skipped | Runs if present, then error continues |

Exception handling changes the program's control flow. It does not repair the failed operation automatically. Your handler must choose a real response: ask for another value, display a useful message, select a justified fallback, or re-raise the error. Avoid pretending success when an important operation did not complete.

## Common mistakes

### Catching every exception with a broad handler

Broken pattern:

```python
try:
    print(user_score)
except Exception:
    print("Something went wrong")
```

This hides `NameError: name 'user_score' is not defined`, which likely signals a bug in the program rather than invalid user data. Catch the specific expected exception around the risky operation so unexpected mistakes stay visible.

### Leaving the handler empty

Broken pattern:

```python
try:
    int("unknown")
except ValueError:
    pass
```

The program silently ignores `ValueError: invalid literal for int() with base 10: 'unknown'`. Silence leaves the user and developer without a clue. Print guidance, retry, assign an intentional fallback, or let the exception continue.

### Putting unrelated code in the try suite

If conversion and a long calculation share one try suite, an exception from the calculation may be mistaken for invalid input. Keep the protected section as small as possible, then put the success work in `else` or after the statement.

### Expecting `else` to run after a handled failure

The try statement's else suite is for success only. When a matching exception is caught, Python skips else and runs the matching except suite. Place shared follow-up work after the whole try statement if it should happen on both paths.

### Returning a fallback that changes meaning

A default can keep a program usable, but it can also disguise missing or corrupted data. Choose a fallback only when it is safe and understandable. Otherwise, show the problem and ask for corrected input.

## Cheat sheet

| Clause | When it runs | Good use |
|---|---|---|
| `try` | First, until an exception or end | A small operation that can fail |
| `except Type` | A compatible exception occurs | Handle a known case |
| `except (A, B)` | Either listed type occurs | One response truly fits both |
| `else` | Try completes without exception | Success-only work |
| `finally` | After success or failure | Cleanup or end-of-attempt action |
| `raise` | When you want an exception to continue or be created | Signal a condition to a caller |

## Try it yourself

### Easy: catch a conversion problem

Try converting a short phrase to an integer. Catch `ValueError` and show a friendly prompt.

```python run
try:
    laps = int("several")
except ValueError:
    print("Please enter the lap count as digits")
```

```output
Please enter the lap count as digits
```

:::solution

The `int()` operation raises `ValueError`, so the handler displays the prompt. If the text were a valid integer string, execution would continue without entering the except suite.

:::

### Medium: report success separately

Use `else` to print a message only when converting the score succeeds.

```python run
try:
    score = int("96")
except ValueError:
    print("Score is not a whole number")
else:
    print(f"Saved score: {score}")
```

```output
Saved score: 96
```

:::solution

The try suite completes, so the except suite is skipped and the else suite prints the saved score.

:::

### Challenge: handle invalid positions

Use `try` and `except` to print either the selected song or a clear message for an invalid position.

```python run
songs = ["Orbit", "Paper Moon"]
try:
    print(songs[3])
except IndexError:
    print("No song at that position")
```

```output
No song at that position
```

:::solution

The index three is outside the two-item list. The `IndexError` handler catches that expected condition and prints a message that describes the choice problem.

:::

## Recap

- Put an expected risky operation in a short `try` suite.
- Use `except` for a specific exception type and choose a useful response.
- Use `else` for work that should happen only after success.
- Use `finally` for a step that needs to run after success or failure.
- Avoid broad handlers and silent fallbacks that hide programming mistakes.

Reference: Python documentation, Errors and Exceptions
