---
title: "Context managers"
curriculumTitle: "Context managers"
track: "Python from zero"
module: "M8 Advanced"
order: 40
level: "Advanced"
summary: "Use with statements and context managers to manage setup and cleanup around a block."
prerequisites:
  - "Decorators"
learningGoals:
  - "Explain the purpose of a context manager"
  - "Use with to run a block inside a managed context"
  - "Create a context manager with __enter__ and __exit__"
  - "Build a generator-based context manager with contextlib.contextmanager"
relatedProblems: []
---

## What you will learn

- What a **context manager** does before and after a block of code
- How the `with` statement calls `__enter__` and `__exit__`
- How cleanup can run even when the block raises an exception
- How `contextlib.contextmanager` turns a generator into a manager
- How to use multiple contexts and keep managed blocks focused

## Why this matters

Programs open files, acquire locks, connect to services, and temporarily change settings. Each action may require cleanup when the work finishes. If cleanup is scattered across several paths, one forgotten branch can leave resources open. A context manager pairs setup with cleanup around a block, making the lifetime of that resource visible.

## The big idea

Think of entering a context as borrowing a room key and leaving as returning it. The work belongs between those two steps. The `with` statement makes Python call the setup operation before the block and the cleanup operation after it.

A **context manager** is an object or helper that defines what should happen when a `with` block starts and ends. A class-based manager provides `__enter__` and `__exit__`; the `contextlib` module also provides a decorator for creating managers from generator functions. Files opened with `with` use this same pattern; file details were covered in **Reading and writing files**.

## Step by step

### Use a built-in context manager

`with` is commonly used with files, but the pattern applies to other supported managers. Here a `StringIO` text stream is opened in memory so the example runs in the browser.

```python run
from io import StringIO

with StringIO("first line\nsecond line\n") as notes:
    print(notes.readline().strip())
print(notes.closed)
```

```output
first line
True
```

The stream is available inside the indented block. When the block finishes, its manager closes the stream. The final print confirms that it has been closed.

### Create a class-based manager

Define `__enter__` for setup and `__exit__` for cleanup. The value returned by `__enter__` is assigned to the name after `as`.

```python run
class PracticeRoom:
    def __enter__(self):
        print("Room unlocked")
        return "Studio 2"

    def __exit__(self, exc_type, exc_value, traceback):
        print("Room locked")

with PracticeRoom() as room:
    print(f"Using {room}")
```

```output
Room unlocked
Using Studio 2
Room locked
```

Python calls `__enter__`, binds its result to `room`, runs the block, then calls `__exit__`. Its three parameters describe an exception if one occurred; they are `None` when the block completes normally.

### Observe cleanup after an exception

The cleanup method still runs when the block raises an exception. Returning a false value from `__exit__` tells Python not to suppress the exception.

```python run
class RehearsalSpace:
    def __enter__(self):
        print("Lights on")
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        print("Lights off")
        return False

try:
    with RehearsalSpace():
        print("Sound check")
        raise ValueError("bad booking")
except ValueError as problem:
    print(type(problem).__name__)
```

```output
Lights on
Sound check
Lights off
ValueError
```

The manager runs cleanup, then the exception continues and is caught by the surrounding try. Suppress an exception only when the manager can safely handle that condition.

### Use `contextmanager` for a simple resource

The `contextlib.contextmanager` decorator lets a generator describe setup before `yield` and cleanup after it. The yielded value is assigned to the `as` target.

```python run
from contextlib import contextmanager

@contextmanager
def open_gate(label):
    print(f"Open {label}")
    yield label.upper()
    print(f"Close {label}")

with open_gate("garden") as sign:
    print(sign)
```

```output
Open garden
GARDEN
Close garden
```

The code before `yield` is setup, the yielded value is available in the block, and code after it is cleanup. This manager is designed for one yield that divides setup from the managed work.

### Put essential generator cleanup in `finally`

If an exception occurs inside the with block, execution resumes after the generator's yield while the exception is active. Put cleanup in `finally` so it runs on normal and exceptional paths.

```python run
from contextlib import contextmanager

@contextmanager
def ticket_window():
    print("Window opens")
    try:
        yield "ticket 14"
    finally:
        print("Window closes")

with ticket_window() as ticket:
    print(ticket)
```

```output
Window opens
ticket 14
Window closes
```

The try/finally structure makes cleanup reliable if the block exits early or raises. Exception handling around the block is outside this manager unless the generator deliberately handles the exception.

### Return a useful value from `__enter__`

The object returned by `__enter__` does not have to be the manager itself. It can be a value that is useful inside the block.

```python run
class GradeReview:
    def __init__(self, score):
        self.score = score

    def __enter__(self):
        print("Review started")
        return self.score

    def __exit__(self, exc_type, exc_value, traceback):
        print("Review finished")

with GradeReview(88) as score:
    print(f"Score: {score}")
```

```output
Review started
Score: 88
Review finished
```

The `as score` variable receives the number returned from `__enter__`. If the method returned `self`, the block could instead access methods or attributes on the manager instance.

### Combine two contexts

You can manage multiple resources in one with statement. Python enters them from left to right and exits them in reverse order.

```python run
from contextlib import contextmanager

@contextmanager
def marker(name):
    print(f"Enter {name}")
    yield name
    print(f"Exit {name}")

with marker("outer") as first, marker("inner") as second:
    print(first, second)
```

```output
Enter outer
Enter inner
outer inner
Exit inner
Exit outer
```

The reverse exit order matters when an inner resource depends on the outer one. If several contexts make a line hard to read, split the statements across lines or use a helper designed for dynamic groups of resources.

### Restore temporary state

A context manager can temporarily change a value and restore it after the block. Cleanup should restore the previous state rather than assume a fixed value.

```python run
from contextlib import contextmanager

display_mode = "quiet"

@contextmanager
def temporary_mode(new_mode):
    global display_mode
    old_mode = display_mode
    display_mode = new_mode
    try:
        yield
    finally:
        display_mode = old_mode

with temporary_mode("concert"):
    print(display_mode)
print(display_mode)
```

```output
concert
quiet
```

The example saves the old setting, temporarily changes it, then restores the saved value in `finally`. Global state can make programs hard to reason about; a real design may pass a setting explicitly instead.

### Separate managed work from later work

The code inside a context should be the work that needs that resource or temporary state. After the block ends, assume its managed resource may be closed or its temporary state has been restored.

```python run
from contextlib import contextmanager

@contextmanager
def rehearsal():
    print("Set chairs")
    try:
        yield
    finally:
        print("Put chairs away")

with rehearsal():
    print("Practice the chorus")
print("Head home")
```

```output
Set chairs
Practice the chorus
Put chairs away
Head home
```

The context's responsibility is setup and cleanup. `Head home` happens afterward. Clear boundaries help you understand the lifetime of a resource.

## What Python is doing behind the scenes

When Python enters `with manager as value`, it obtains the manager's `__enter__` method and calls it. The returned value is assigned to `value`. After the block ends, Python calls `__exit__` with information about an active exception or with three `None` values for normal completion.

For a generator-based manager, `contextmanager` adapts a generator function to the same protocol. Code before the single `yield` runs on entry, and code after it runs when the block exits. A try/finally around the yield guarantees cleanup. A manager can signal that it handled an exception by returning true from `__exit__`; otherwise the exception continues.

The exception information passed to `__exit__` consists of its type, value, and traceback. On an ordinary exit these are all `None`. A class-based manager can inspect them to make a cleanup decision, but it should avoid replacing the original exception with a confusing failure of its own. The cleanup step should usually be small and dependable: release the resource, restore the previous setting, or record that the managed operation ended.

A context manager controls a boundary, not the meaning of the work inside it. It cannot decide that a database update is correct merely because the block completed. It only defines entry and exit behavior. Keep business rules in normal functions or methods, and use a manager for a resource lifetime or temporary environment that surrounds those rules.

The value after `as` is optional. A `with manager:` statement can still use a manager that has no useful value to provide. Likewise, a manager may perform cleanup without any setup beyond recording state. The shape should follow the resource: open something on entry, close it on exit; save a setting, then restore it; acquire a lock, then release it. This pairing makes the intent easy to review.

| Stage | Class manager | Generator manager |
|---|---|---|
| Enter | `__enter__()` | Run generator to `yield` |
| Value after `as` | Return from `__enter__` | Value supplied by `yield` |
| Exit | `__exit__(...)` | Resume generator after `yield` |
| Cleanup | Code in `__exit__` | Usually code in `finally` |

Context managers are especially useful when cleanup must occur on more than one exit path. They make the resource lifetime visible in indentation and reduce repeated cleanup code. Async context managers use related but distinct syntax and are covered in **async and await basics**.

## Common mistakes

### Forgetting to return from `__enter__`

If the block uses `as resource`, remember that it receives the return value of `__enter__`. Without an explicit return, the value is `None`. Return the manager itself or the resource the block needs.

### Suppressing an exception unintentionally

Returning true from `__exit__` tells Python the exception was handled. Return false or `None` when you want the error to keep propagating. Suppress only an exception the manager can safely resolve.

### Yielding more than once in a contextmanager generator

The generator-based context manager protocol expects one yield that marks the block's boundary. Use setup before it and cleanup after it; do not yield once per item like an ordinary generator.

### Leaving cleanup outside `finally`

Code after a yield may not run if the block raises unless the generator handles that exception. Put essential cleanup in a `finally` clause.

### Keeping a resource after the block ends

Treat the managed value as valid only during the with block unless its documentation says otherwise. A closed file or released connection may not work after exit.

## Cheat sheet

| Form | Purpose |
|---|---|
| `with manager as value:` | Enter, bind, run block, exit |
| `__enter__()` | Setup and return block value |
| `__exit__(type, value, traceback)` | Cleanup and optionally handle exception |
| `@contextmanager` | Adapt a generator function into a manager |
| `yield resource` | Provide the block's managed value |
| `try: yield ... finally:` | Ensure cleanup after the block |

## Try it yourself

### Easy: mark the start and end

Create a manager that prints a start message before the block and a finish message afterward.

```python run
# Complete the mark the start and end task.
# Sample data: opening_message = "Warm-up begins", closing_message = "Warm-up ends"
# Write your code below and print the result
```


:::solution
The code before yield runs on entry, the block runs next, and the finally suite runs during cleanup.

```python
from contextlib import contextmanager

@contextmanager
def warmup():
    print("Warm-up begins")
    try:
        yield
    finally:
        print("Warm-up ends")

with warmup():
    print("Stretch")
```
:::

### Medium: provide a value

Use `__enter__` to provide a practice room name to the block.

```python run
# Complete the provide a value task.
# Sample data: room_name = "Room C"
# Write your code below and print the result
```


:::solution
The block variable receives the return value from `__enter__`. The exit method runs after the block.

```python
class ChangingRoom:
    def __enter__(self):
        return "Room C"

    def __exit__(self, exc_type, exc_value, traceback):
        print("Room released")

with ChangingRoom() as room:
    print(room)
```
:::

### Challenge: restore a setting

Use a context manager to temporarily change a display label and restore the previous label.

```python run
# Complete the restore a setting task.
# Sample data: display_label = 'standard'
# Write your code below and print the result
```


:::solution
Save the previous value, change it before yield, then restore it in finally so both normal and exceptional exits clean up.

```python
from contextlib import contextmanager

display_label = "standard"

@contextmanager
def show_as(value):
    global display_label
    previous = display_label
    display_label = value
    try:
        yield
    finally:
        display_label = previous

with show_as("festival"):
    print(display_label)
print(display_label)
```
:::

## Recap

- A context manager pairs setup and cleanup around a `with` block.
- `__enter__` provides the value for `as`, and `__exit__` handles leaving.
- `contextmanager` adapts a generator whose single `yield` marks the block.
- Put required cleanup in `finally` so it runs when an exception occurs.
- Treat a managed resource as scoped to the with block unless documented otherwise.

Reference: Python documentation, The with statement
