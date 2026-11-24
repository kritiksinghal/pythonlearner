---
title: "Type hints"
curriculumTitle: "Type hints"
track: "Python from zero"
module: "M8 Advanced"
order: 41
level: "Intermediate"
summary: "Describe the kinds of values functions and variables are expected to use with Python annotations."
prerequisites:
  - "Context managers"
learningGoals:
  - "Read annotations on variables, parameters, and return values"
  - "Use built-in generic types such as list[str] and dict[str, int]"
  - "Describe a value that may be None"
  - "Explain that annotations do not automatically validate runtime values"
relatedProblems: []
---

## What you will learn

- What a **type hint** communicates in Python code
- How to annotate variables, function parameters, and return values
- How to describe lists and dictionaries with their item types
- How to use `| None` for a value that may be missing
- Why type hints need a separate checker to report many type mistakes

## Why this matters

When a function accepts several values and returns another one, readers may need to inspect every line to learn what kinds of values are expected. Type hints put that information near the definition. They help editors and type-checking tools find mismatches before a program runs. They also act as useful documentation, especially when a project contains many functions.

## The big idea

Think of a type hint as a label on a storage box that says what kind of item belongs inside. The label helps people and tools understand your intent, but it does not physically stop a person from putting something else in the box.

A **type hint** is an annotation describing an expected type. Python stores annotations as metadata, but normally does not enforce them when a function is called or a variable is assigned. A static type checker can inspect source code and report likely mismatches without running the program. Type hints are most useful when they describe real contracts clearly rather than decorating every expression.

They are especially valuable at boundaries between parts of a program: a function that receives data from another module, a public helper used by several callers, or a result that has more than one possible form. Clear annotations help a teammate understand how to call the code without reading every implementation detail.

## Step by step

### Annotate a function parameter and return value

Write a parameter annotation after a colon and a return annotation after `->`. These labels show what the function is intended to receive and produce.

```python run
def greet(name: str) -> str:
    return f"Hello, {name}"

print(greet("Sonal"))
```

```output
Hello, Sonal
```

The annotation says `name` should be a string and the function should return a string. Python runs the function normally; it does not insert a check just because those annotations are present.

### Annotate a function that returns a number

The return annotation follows `->` before the function's colon. It describes the expected result after the function body executes.

```python run
def total_minutes(sessions: int, minutes_each: int) -> int:
    return sessions * minutes_each

print(total_minutes(4, 35))
```

```output
140
```

The two parameters and the return value are annotated as integers. A type checker can use these labels to flag a call that passes an incompatible value or a return statement that produces a different kind of value.

### Describe a list's item type

Built-in collection types can include a type for their contents. For example, `list[str]` describes a list whose items are intended to be strings.

```python run
def first_chant(words: list[str]) -> str:
    return words[0]

print(first_chant(["defend", "attack", "reset"]))
```

```output
defend
```

The annotation describes the list and its expected element type. It does not guarantee that the list is non-empty; the function still needs a design for an empty input if that is possible.

### Describe a dictionary's key and value types

For dictionaries, provide two types: one for keys and one for values. This makes the expected shape more specific.

```python run
def points_for_player(scores: dict[str, int], player: str) -> int:
    return scores[player]

scoreboard = {"Anya": 18, "Ritvik": 24}
print(points_for_player(scoreboard, "Ritvik"))
```

```output
24
```

This hint says that the mapping uses string keys and integer values. It does not guarantee that the requested key exists; dictionary lookup can still fail at runtime.

### Mark a value as possibly missing

Use a union such as `str | None` when a value can be a string or the special value `None`. This spelling is available in Python 3.10 and newer.

```python run
def nickname(member_id: int) -> str | None:
    known_names = {8: "Pia", 12: "Arjun"}
    return known_names.get(member_id)

print(nickname(8))
print(nickname(99))
```

```output
Pia
None
```

The return annotation lists both possible outcomes. A caller should check for `None` before using the result as a string. Type hints can describe that check to tools and readers.

### Use a type hint on a variable

You can annotate a variable where it is assigned or declared. The annotation communicates intent, while the assignment still determines the actual runtime value.

```python run
temperature: float = 26.5
city: str = "Kochi"
print(f"{city}: {temperature} C")
```

```output
Kochi: 26.5 C
```

The annotations are useful to readers and tools. Python does not prevent assigning a different type later, although a type checker may report that assignment as inconsistent with the stated intent.

### Annotate a function that returns nothing useful

Use `None` as the return annotation for a function whose purpose is an action and whose callers should not expect a useful result.

```python run
def print_notice(message: str) -> None:
    print(f"Notice: {message}")

result = print_notice("Court is ready")
print(result)
```

```output
Notice: Court is ready
None
```

The function prints a message and falls off the end, so its actual return value is `None`. The annotation documents that callers should not expect a returned notice string.

### Use a tuple type for a fixed pair

Type hints can describe a tuple with a fixed number of positions and a type for each position.

```python run
def split_score(score: int) -> tuple[int, int]:
    hundreds = score // 100
    remainder = score % 100
    return hundreds, remainder

print(split_score(247))
```

```output
(2, 47)
```

The return annotation says the function produces a two-item tuple of integers. A tuple annotation with an ellipsis can describe a variable-length tuple whose items all share a type, but use that form only when it helps the reader.

### Check annotations at runtime without mistaking them for enforcement

Functions store annotations, which you can inspect through the `__annotations__` attribute. That metadata is available at runtime, but it does not itself reject an incompatible call.

```python run
def jersey_label(number: int) -> str:
    return f"Number {number}"

print(jersey_label.__annotations__["number"])
print(jersey_label("captain"))
```

```output
<class 'int'>
Number captain
```

The second call still runs even though it passes a string. That demonstrates the distinction between an annotation and runtime validation. If your program must reject invalid data, write an explicit check; do not rely on a type hint alone.

### Use aliases for a complicated repeated type

If a type expression is long and used many times, an alias can make function signatures more readable. Keep the alias name descriptive.

```python run
type LapTimes = list[float]

def fastest_time(times: LapTimes) -> float:
    return min(times)

print(fastest_time([63.4, 61.8, 64.1]))
```

```output
61.8
```

The `type` statement is available in Python 3.12 and creates a type alias. It documents a repeated concept; it does not create a new runtime class or validate the values in the list.

## What Python is doing behind the scenes

Annotations are stored as metadata attached to functions, classes, and sometimes module variables. Python does not normally compare each value with an annotation during assignment or function calls. This keeps annotations flexible for documentation and external tools.

A static type checker reads the source and reasons about how annotated values flow through the program. It can report likely mismatches without executing the program, but it is separate software and may not prove that a program is correct. Runtime validation requires explicit checks or a library designed for that purpose.

| Annotation | Intended meaning |
|---|---|
| `name: str` | A text value |
| `-> int` | Function returns an integer |
| `list[str]` | A list intended to contain strings |
| `dict[str, int]` | String keys and integer values |
| `str \| None` | A string or the absence value `None` |
| `tuple[int, int]` | A two-position tuple of integers |

Use annotations consistently in public functions, especially when the expected data is not obvious. For tiny local calculations, adding a hint to every variable may create more visual noise than clarity. The `typing` module includes richer tools for advanced cases; this lesson introduces only common built-in forms.

## Common mistakes

### Assuming a hint checks a value

`count: int = "many"` can still execute in ordinary Python. An annotation communicates intent but does not automatically reject the assignment. Validate input explicitly when runtime safety requires it.

### Annotating a function's return value in the wrong place

The return type goes after `->` and before the colon, as in `def size() -> int:`. Putting it after the function name without the arrow is invalid syntax.

### Forgetting that a list can be empty

`list[str]` says what its elements are intended to be, not how many elements it contains. A function that indexes its first element still needs a strategy for an empty list.

### Forgetting the `None` path

If a function can return `None`, annotate that possibility and make callers check it before using the value as the other type.

### Using a vague alias

An alias like `Data` may hide what values it describes. Choose a name such as `LapTimes` that tells the reader what the type means.

## Cheat sheet

| Place | Example |
|---|---|
| Parameter | `def title(name: str):` |
| Return value | `def count() -> int:` |
| Local variable | `length: float = 4.5` |
| List items | `list[str]` |
| Dictionary keys and values | `dict[str, int]` |
| Optional value | `str | None` |
| No useful return | `-> None` |
| Alias in Python 3.12 | `type LapTimes = list[float]` |

## Try it yourself

### Easy: annotate a greeting

Add a string parameter and return annotation to a greeting function.

```python run
def greet(name: str) -> str:
    return f"Good luck, {name}!"

print(greet("Ira"))
```

```output
Good luck, Ira!
```

:::solution

Annotate the parameter with `str` and the result with `-> str`. The function still returns ordinary text.

:::

### Medium: annotate a score mapping

Write a function that returns the score for a named team.

```python run
def team_score(scores: dict[str, int], team: str) -> int:
    return scores[team]

print(team_score({"Comets": 5, "Waves": 3}, "Comets"))
```

```output
5
```

:::solution

The dictionary hint describes string keys and integer values. The return annotation says the lookup produces an integer.

:::

### Challenge: express a missing result

Annotate a function that returns an item label when it exists and `None` otherwise.

```python run
def find_badge(code: int) -> str | None:
    badges = {4: "bronze", 7: "gold"}
    return badges.get(code)

print(find_badge(7))
print(find_badge(10))
```

```output
gold
None
```

:::solution

The union `str | None` communicates both possible results. Callers should check for `None` before using the value as a string.

:::

## Recap

- Type hints describe expected values for readers and static analysis tools.
- Python does not automatically enforce annotations at runtime.
- Built-in collection types can describe their element, key, and value types.
- Use a union such as `str | None` when a result may be absent.
- Add explicit validation when the running program must reject incorrect values.

Reference: Python documentation, typing — Support for type hints
