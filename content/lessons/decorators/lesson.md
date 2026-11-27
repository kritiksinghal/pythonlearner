---
title: "Decorators"
curriculumTitle: "Decorators"
track: "Python from zero"
module: "M8 Advanced"
order: 39
level: "Advanced"
summary: "Learn how decorators wrap a function to add behavior while keeping its call style."
prerequisites:
  - "Iterators and generators"
learningGoals:
  - "Explain how a decorator receives and returns a function"
  - "Use the @ syntax to apply a decorator"
  - "Write a wrapper that forwards arguments and returns a result"
  - "Preserve a wrapped function's metadata with functools.wraps"
relatedProblems: []
---
## What you will learn

- What a **decorator** is and what it receives
- How a wrapper function adds behavior before or after another function
- How `@decorator` is shorthand for assigning a decorated function
- How to forward arguments and return values from a wrapper
- Why `functools.wraps` preserves useful information about the original function

## Why this matters

Several functions may need the same extra behavior, such as logging that a task started or measuring how many times it ran. Copying those steps into every function creates repetition. A decorator lets you attach that behavior around a function while leaving its main job focused. Decorators are used throughout Python libraries, so understanding their shape helps you read real code.

## The big idea

Imagine placing a protective sleeve around a card. The card remains the same card, but the sleeve adds a useful feature around it. A decorator takes a function and returns another function that usually calls the original and adds behavior before or after it.

A **wrapper** is the function that surrounds another function's call. A **decorator** is a callable that accepts a function and returns a replacement or enhanced callable. Python's `@` syntax applies a decorator when the function is defined; it is a convenient spelling for reassignment.

## Step by step

### Treat a function as a value

Functions can be assigned to variables and passed to other functions. This makes it possible for a decorator to receive a function and return another one.

```python run
def welcome_guest(name):
    return f"Welcome, {name}"

announcement = welcome_guest
print(announcement("Farah"))
```

```output
Welcome, Farah
```

The variable `announcement` refers to the same function as `welcome_guest`. Calling either name runs that function. Decorators use this ability to build a new callable from an existing one.

### Write a decorator that adds a message

The decorator receives a function, defines a wrapper, and returns that wrapper. The wrapper can add an action before it calls the original function.

```python run
def announce_call(function):
    def wrapper():
        print("Starting the task")
        return function()
    return wrapper

def pack_bag():
    return "Bag packed"

pack_bag = announce_call(pack_bag)
print(pack_bag())
```

```output
Starting the task
Bag packed
```

`announce_call()` creates and returns `wrapper`. Reassigning `pack_bag` means the name now refers to the wrapper. When called, the wrapper prints first, then runs the original function and returns its result.

### Apply the same decorator with `@`

Place `@announce_call` directly above a function definition to decorate it. This syntax performs the same reassignment automatically.

```python run
def announce_call(function):
    def wrapper():
        print("Preparing the studio")
        return function()
    return wrapper

@announce_call
def tune_instrument():
    return "Piano ready"

print(tune_instrument())
```

```output
Preparing the studio
Piano ready
```

Python first creates `tune_instrument`, then passes it to `announce_call`, and binds the returned wrapper to the name. The decorated function is still called using the same name.

### Add behavior after the original call

A wrapper can run the original function first, store its result, then add a step. Return the original result so the caller can still use it.

```python run
def report_result(function):
    def wrapper():
        result = function()
        print("Result recorded")
        return result
    return wrapper

@report_result
def get_station():
    return "River Gate"

print(get_station())
```

```output
Result recorded
River Gate
```

The wrapper stores the returned station name, prints the report, and passes the same value back to the caller. If it forgot `return result`, the decorated function would return `None` instead.

### Forward arguments to the wrapped function

Most useful wrappers need to pass along the original function's arguments. `*args` and `**kwargs` allow a wrapper to accept positional and keyword arguments; those parameter forms were covered in **Default, keyword, *args and **kwargs**.

```python run
def trace_call(function):
    def wrapper(*args, **kwargs):
        print(f"Calling {function.__name__}")
        return function(*args, **kwargs)
    return wrapper

@trace_call
def add_runs(first, second):
    return first + second

print(add_runs(36, 19))
```

```output
Calling add_runs
55
```

The wrapper forwards both kinds of arguments and returns the original result. Without argument forwarding, the decorated function would only work for the exact call pattern the wrapper supports.

### Count how many times a function is called

A wrapper can keep its own state, such as a call count. The `nonlocal` statement lets the nested wrapper update the variable from the enclosing decorator call.

```python run
def count_calls(function):
    calls = 0

    def wrapper(*args, **kwargs):
        nonlocal calls
        calls += 1
        print(f"Call {calls}")
        return function(*args, **kwargs)

    return wrapper

@count_calls
def play_round(round_number):
    return f"Round {round_number} played"

print(play_round(1))
print(play_round(2))
```

```output
Call 1
Round 1 played
Call 2
Round 2 played
```

Each call increments the `calls` value held by the decorator invocation. The wrapper then calls the original function with the provided round number and returns its result.

### Preserve the original function's metadata

Without help, a wrapper can hide the original function's name and documentation. `functools.wraps` copies useful metadata from the wrapped function to the wrapper.

```python run
from functools import wraps

def quiet_wrapper(function):
    @wraps(function)
    def wrapper(*args, **kwargs):
        return function(*args, **kwargs)
    return wrapper

@quiet_wrapper
def describe_cloud():
    """Return a short cloud description."""
    return "High cirrus"

print(describe_cloud.__name__)
print(describe_cloud.__doc__)
```

```output
describe_cloud
Return a short cloud description.
```

`@wraps(function)` is applied to the wrapper, preserving identifying details from `describe_cloud`. This is useful for debugging, documentation tools, and other code that inspects functions.

### Return a transformed result

A decorator may intentionally transform a result, as long as the change is clear to callers. Here the wrapper converts the returned text to uppercase.

```python run
def uppercase_result(function):
    def wrapper(*args, **kwargs):
        result = function(*args, **kwargs)
        return result.upper()
    return wrapper

@uppercase_result
def team_name():
    return "silver falcons"

print(team_name())
```

```output
SILVER FALCONS
```

The wrapped function still runs normally, but the value returned by the decorated name is transformed. This decorator assumes the result is a string, so it would not suit functions returning other types.

### Decorate a function with a chosen message

A decorator can be configured by writing a function that returns a decorator. This adds another layer: the outer function stores the option, and the inner decorator receives the function.

```python run
def tag_with(label):
    def decorate(function):
        def wrapper(*args, **kwargs):
            return f"[{label}] {function(*args, **kwargs)}"
        return wrapper
    return decorate

@tag_with("LIVE")
def match_update():
    return "Second innings begins"

print(match_update())
```

```output
[LIVE] Second innings begins
```

`tag_with("LIVE")` first creates a configured decorator. That decorator then receives `match_update`. The wrapper remembers the label from the enclosing call and adds it around the result.

## What Python is doing behind the scenes

When Python sees `@decorate` above a function, it creates the function object and then evaluates `function_name = decorate(function_name)`. The name is rebound to whatever the decorator returns. In common cases, that value is a wrapper function.

The wrapper closes over the original function, so it can call it later. It can also hold state from the decorator's enclosing scope. When a caller invokes the decorated name, Python runs the wrapper first; whether and how the original function runs is defined by the wrapper.

| Stage | Name refers to | What happens |
|---|---|---|
| Function definition | Original function | Python creates the callable |
| Decorator application | Decorator result | `decorate(original)` is evaluated |
| Later call | Wrapper | Caller uses the same function name |
| Inside wrapper | Original callable | Wrapper chooses when to call it |

Decorators can be stacked, in which case they are applied from the closest decorator outward. Wrappers that need to handle arbitrary functions should forward `*args` and `**kwargs`, return results, and use `functools.wraps` to preserve metadata. A decorator that changes expected return types or suppresses exceptions should document that change clearly.

For example, with `@first` above `@second`, Python applies `second` to the original function first, then applies `first` to that result. When called, the outer wrapper runs before the inner wrapper. Reading a stack from the definition toward the function helps you understand which behavior surrounds which other behavior. Keep a stack short; a chain of several wrappers can make it hard to see what a call actually does.

Decorators are also useful for cross-cutting behavior: behavior that appears around several otherwise different functions. Logging, access checks, caching, and timing are common examples. Each use should have a clear contract: explain what additional work occurs, whether arguments or return values change, and whether exceptions still pass through. This lesson's wrappers are small demonstrations; production libraries may include extra safeguards and configuration.

The configured decorator example adds an outer function because `@tag_with("LIVE")` must first produce a decorator. That outer call remembers the label in a closure. The returned decorator receives the function, and the wrapper later uses both remembered values. These nested functions are ordinary functions; the special part is the convention that the outer callable returns another callable for Python to bind.

## Common mistakes

### Forgetting to return the wrapper

The decorator must return the wrapper function. If it only defines the nested function, the decorator itself returns `None` and the original function name is replaced with that value.

### Forgetting to call the original function

A wrapper that never calls the wrapped function replaces its behavior entirely. That may be intentional, but most decorators add behavior around the original call.

### Forgetting to return the original result

If a wrapper calls the original function but drops its return value, the decorated function returns `None`. Save and return the result when callers should receive it.

### Restricting the wrapper's arguments by accident

A wrapper defined with no parameters cannot decorate functions that take arguments. Use `*args` and `**kwargs` when the wrapper should transparently forward different call patterns.

### Losing the wrapped function's name

Without `functools.wraps`, tools may see the wrapper's name and documentation instead of the original function's. Apply `@wraps(function)` to the wrapper when preserving metadata matters.

## Cheat sheet

| Purpose | Pattern |
|---|---|
| Decorator function | `def decorate(function): ... return wrapper` |
| Apply decorator | `@decorate` above a function |
| Forward calls | `wrapper(*args, **kwargs)` |
| Preserve result | `return function(*args, **kwargs)` |
| Preserve metadata | `@wraps(function)` above wrapper |
| Configure decorator | Outer function returns a decorator |

## Try it yourself

### Easy: announce a call

Use `forecast_message` as the sample data. Write a decorator that prints `Loading forecast` before calling the wrapped function. Print the result exactly as shown in Expected output.


:::tip Hint
Use the lesson idea about decorators. Trace the sample values before printing so you can check each step.
:::

```sample input
forecast_message = 'Forecast ready'
```

```expected
Loading forecast
Cloudy
```

```python run
# Complete the Easy: announce a call task.
forecast_message = 'Forecast ready'
# Write your code below
```


:::solution
The decorator returns a wrapper that prints first, calls the original function, and returns its result.

```python
forecast_message = 'Forecast ready'
def announce(function):
    def wrapper():
        print("Loading forecast")
        return function()
    return wrapper

@announce
def forecast():
    return "Cloudy"

print(forecast())
```
:::

### Medium: forward an argument

Make a wrapper that prints `Saving` and still returns the wrapped function's value. Print the result exactly as shown in Expected output.


:::tip Hint
Use the lesson idea about decorators. Trace the sample values before printing so you can check each step.
:::

```sample input
value = 42
```

```expected
Saving
Saved 8 tracks
```

```python run
# Complete the Medium: forward an argument task.
value = 42
# Write your code below
```


:::solution
The wrapper forwards the count through `*args`, then returns the original function's string.

```python
value = 42
def saving(function):
    def wrapper(*args, **kwargs):
        print("Saving")
        return function(*args, **kwargs)
    return wrapper

@saving
def save_playlist(count):
    return f"Saved {count} tracks"

print(save_playlist(8))
```
:::

### Challenge: preserve the function name

Use `wraps` in a decorator and check the decorated function's name. Print the result exactly as shown in Expected output.


:::tip Hint
Use the lesson idea about decorators. Trace the sample values before printing so you can check each step.
:::

```sample input
function_name = 'greet'
```

```expected
river_level
```

```python run
# Complete the Challenge: preserve the function name task.
function_name = 'greet'
# Write your code below
```


:::solution
`@wraps(function)` copies the original function's identifying metadata to the wrapper, so its public name remains `river_level`.

```python
function_name = 'greet'
from functools import wraps

def preserve(function):
    @wraps(function)
    def wrapper(*args, **kwargs):
        return function(*args, **kwargs)
    return wrapper

@preserve
def river_level():
    return 2

print(river_level.__name__)
```
:::

## Recap

- A decorator receives a function and returns a callable that replaces or enhances it.
- A wrapper can run extra steps before or after the original call.
- `@decorator` is shorthand for reassigning the decorated function name.
- Forward arguments and return values to keep a wrapper useful for callers.
- Use `functools.wraps` to preserve the original function's metadata.

Reference: Python documentation, Function definitions
