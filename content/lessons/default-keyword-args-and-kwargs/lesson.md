---
title: "Default, keyword, *args and **kwargs"
curriculumTitle: "Default, keyword, *args and **kwargs"
track: "Python from zero"
module: "M5 Functions"
order: 24
level: "Beginner"
summary: "Call functions with clear keyword arguments and use defaults, *args, and **kwargs for flexible inputs."
prerequisites:
  - "what-is-programming-and-python"
  - "your-first-program-with-print"
  - "variables-and-types"
  - "numbers-and-math"
  - "text-strings"
  - "talking-to-the-user-with-input-and-f-strings"
  - "true-false-and-comparisons"
  - "making-decisions-with-if"
  - "and-or-not"
  - "repeating-with-loops"
  - "for-loops-and-range"
  - "break-continue-and-loop-else"
  - "nested-loops-and-patterns"
  - "lists"
  - "indexing-and-slicing"
  - "tuples"
  - "dictionaries"
  - "sets"
  - "comprehensions"
  - "sorting-zip-and-enumerate"
  - "defining-functions"
  - "parameters-and-return-values"
  - "scope"
learningGoals:
  - "Set default values for optional parameters."
  - "Call functions with keyword arguments to make values explicit."
  - "Use *args to collect extra positional arguments into a tuple."
  - "Use **kwargs to collect extra keyword arguments into a dictionary."
  - "Distinguish collecting arguments in a definition from unpacking values in a call."
relatedProblems: []
---

## What you will learn

- A **default parameter value** supplies an input when a caller leaves that parameter out.
- **Keyword arguments** connect values to parameter names in a call, making the meaning clear.
- `*args` collects extra positional arguments into a tuple.
- `**kwargs` collects extra keyword arguments into a dictionary.
- How `*` and `**` can also unpack a sequence or dictionary during a call.
- Why ordinary named parameters are clearer when a function's inputs are already known.

## Why this matters

Functions often have a common setting with occasional variations. A delivery estimate might usually use a standard fee, but a caller may sometimes supply a different fee. A function can set a default for the common case while still allowing that value to change when needed. Keyword arguments help when several values have similar types, such as a width and height, because the call shows which number means what.

Some helper functions need to accept a varying number of values. A score calculator might receive any number of round scores; a report function might accept optional details. `*args` and `**kwargs` give you those flexible inputs. They are powerful tools, but they can hide what a function expects, so use them when flexibility is genuinely part of the task.

## The big idea

Imagine ordering a meal with a standard side included. The standard side is like a default value: unless you ask for a change, the usual option applies. You can also say “large size” and “no onions” by name. Those labels resemble keyword arguments because they connect each choice to its meaning.

In a function definition, a default follows a parameter name, such as `size="regular"`. A caller can leave that argument out or provide a different value. A keyword call uses `size="large"` to identify the parameter directly. Positional arguments are matched from left to right; keyword arguments are matched by name.

In a definition, `*args` gathers any extra positional values into a tuple, and `**kwargs` gathers extra named values into a dictionary. The words `args` and `kwargs` are conventional names; the stars create the behavior. In a function call, the same stars can unpack a tuple/list or dictionary into separate arguments. That direction is reversed: the definition collects, while the call expands.

## Step by step

### 1. Give a parameter a default value

A default lets a caller omit an input when a common value is suitable.

```python run
def delivery_total(subtotal, fee=40):
    return subtotal + fee

print(delivery_total(260))
print(delivery_total(260, 65))
```

```output
300
325
```

The first call supplies only `subtotal`, so `fee` uses its default of 40. The second call supplies a second positional argument, replacing the default with 65. Required parameters come before parameters with defaults in a function definition.

Defaults are evaluated when Python defines the function, not freshly recreated on every call. Numbers, strings, and booleans are common safe defaults. Mutable defaults such as lists can be shared between calls; use `None` and create a new list inside the function when each call needs its own list. Mutable objects were covered in “Lists.”

### 2. Use a keyword argument to show what a value means

Keyword arguments use the parameter name followed by `=` in the call. They can make a call easier to read, especially when values have the same type.

```python run
def print_room_label(building, room, floor):
    print(f"{building}, floor {floor}, room {room}")

print_room_label(building="West Wing", room="204", floor=2)
```

```output
West Wing, floor 2, room 204
```

Each argument is matched by its name, so the caller can place them in a different order than the definition. The values appear beside meaningful labels, which is clearer than trying to remember whether `2` means floor or room.

### 3. Combine positional and keyword arguments

Positional arguments must come before keyword arguments in a call. This lets the call start with the most common values and label later choices.

```python run
def book_seat(event, section, aisle=False):
    seat_type = "aisle" if aisle else "standard"
    print(f"{event}: {section}, {seat_type} seat")

book_seat("Dance recital", "Balcony", aisle=True)
```

```output
Dance recital: Balcony, aisle seat
```

The first two arguments are positional: event and section. `aisle=True` is a keyword argument that clearly labels the optional choice. The parameter's default is used when the caller leaves that keyword out.

### 4. Collect extra positional values with `*args`

Put `*args` in a definition when the function should accept any number of extra positional arguments. Inside the function, `args` is a tuple containing those values.

```python run
def average_lap_time(*seconds):
    return sum(seconds) / len(seconds)

print(average_lap_time(73, 70, 76))
```

```output
73.0
```

The three values are gathered into the tuple `seconds`. `sum` adds them and `len` counts them, so the function returns their average. The name `seconds` is legal; many examples use `args`, but the asterisk is what tells Python to gather extras.

### 5. Collect extra named values with `**kwargs`

Put `**kwargs` in a definition when the function should accept extra keyword arguments. Inside, `kwargs` is a dictionary mapping each keyword name to its value.

```python run
def print_cafe_order(drink, **choices):
    print("Drink:", drink)
    for choice, value in choices.items():
        print(f"{choice}: {value}")

print_cafe_order("filter coffee", size="small", sugar="less")
```

```output
Drink: filter coffee
size: small
sugar: less
```

The named parameter `drink` receives the first argument. The remaining keyword arguments are collected in `choices`, a dictionary. The loop prints each extra setting and its value.

Use `**kwargs` when you truly do not know all the optional names ahead of time. If the function always needs `size` and `sugar`, listing them as normal named parameters makes its expectations easier to see.

### 6. Use positional and named collections together

A flexible function can accept a required first value, extra positional values, and extra keyword values. `*args` appears before `**kwargs` in the definition.

```python run
def print_trip_plan(destination, *stops, **details):
    print("Destination:", destination)
    print("Stops:", stops)
    print("Details:", details)

print_trip_plan("Munnar", "Thrissur", "Kochi", nights=3, travelers=2)
```

```output
Destination: Munnar
Stops: ('Thrissur', 'Kochi')
Details: {'nights': 3, 'travelers': 2}
```

The first positional value fills `destination`. Remaining positional values become the `stops` tuple. Named values that do not match a named parameter become entries in the `details` dictionary.

This flexibility can be harder to understand than a function with a fixed set of named parameters. Add these features when they serve the caller, not just to make a function accept anything.

### 7. Unpack a sequence when calling a function

In a call, a single `*` expands a sequence so each item becomes a separate positional argument.

```python run
dimensions = (8, 5)

def rectangle_area(width, height):
    return width * height

print(rectangle_area(*dimensions))
```

```output
40
```

The tuple contains two values. `*dimensions` passes them as if you had written `rectangle_area(8, 5)`. The function receives width 8 and height 5.

The number of values must fit the required parameters. Use unpacking when values are already stored as a tuple or list and their order matches the function definition.

### 8. Unpack a dictionary into keyword arguments

In a call, `**` expands a dictionary into named arguments. Its keys must match the function's parameter names.

```python run
settings = {"brightness": 70, "contrast": 12}

def print_screen_settings(brightness, contrast):
    print(f"Brightness {brightness}; contrast {contrast}")

print_screen_settings(**settings)
```

```output
Brightness 70; contrast 12
```

The keys `brightness` and `contrast` become keyword names, and their dictionary values are passed to the matching parameters. This can be useful when settings already live in a dictionary.

## What Python is doing behind the scenes

Python matches values in a predictable sequence. Positional arguments fill parameters from left to right. Keyword arguments fill the parameter with the matching name. A parameter not supplied by the caller uses its default, while extra positional and keyword values can be collected by `*args` and `**kwargs`.

| Definition | Call | Values received |
| --- | --- | --- |
| `def plan(city, days=1):` | `plan("Jodhpur")` | `city="Jodhpur"`, `days=1` |
| `def plan(city, days=1):` | `plan("Jodhpur", days=3)` | `city="Jodhpur"`, `days=3` |
| `def show(first, *rest):` | `show("A", "B", "C")` | `first="A"`, `rest=("B", "C")` |
| `def show(**details):` | `show(color="gold")` | `details={"color": "gold"}` |

For mutable defaults, remember that a default object is created once when the function definition runs. If a function changes that object, later calls may see the earlier change. A `None` default followed by creating a fresh list inside the body avoids sharing one list across calls.

## Common mistakes

### 1. Supplying the same argument twice

Broken code:

```python
def print_trip(city, days):
    print(city, days)

print_trip("Puri", city="Konark", days=2)
```

Python reports `TypeError: print_trip() got multiple values for argument 'city'`. The positional value already filled `city`; do not provide it again by name. Use one form for each parameter.

### 2. Using a keyword that the function does not accept

Broken code:

```python
def print_theme(theme):
    print(theme)

print_theme(color="amber")
```

Python reports `TypeError: print_theme() got an unexpected keyword argument 'color'`. The definition expects `theme`, not `color`. Use `print_theme(theme="amber")` or rename the parameter to match the intended meaning.

### 3. Using the wrong name when reading `*args`

Broken code:

```python
def print_ratings(*ratings):
    print(scores)

print_ratings(4, 5)
```

Python reports `NameError: name 'scores' is not defined`. The collected tuple is named `ratings`, so refer to that name in the body.

### 4. Passing a dictionary key that does not match a parameter

Broken code:

```python
def print_reservation(name):
    print(name)

details = {"guest": "Mira"}
print_reservation(**details)
```

Python reports `TypeError: print_reservation() got an unexpected keyword argument 'guest'`. When unpacking with `**`, keys become keyword names and must match parameters. Rename the key to `name` or change the function parameter to `guest`.

## Cheat sheet

| Feature | Definition or call | Effect |
| --- | --- | --- |
| Default | `def visit(city, days=1):` | Uses one day when omitted. |
| Keyword call | `visit(city="Leh", days=4)` | Matches values by parameter name. |
| Extra positional values | `def total(*values):` | Collects extras into a tuple. |
| Extra named values | `def show(**details):` | Collects extras into a dictionary. |
| Unpack sequence | `area(*dimensions)` | Expands items into positional arguments. |
| Unpack mapping | `show(**settings)` | Expands keys and values into keyword arguments. |
| Safe mutable default | `items=None` then create `[]` | Gives each call a fresh list. |

## Try it yourself

### Easy: Add a default tip

Write a function that accepts a bill and a tip amount defaulting to 10. Print the result with both the default and a custom tip.

```python run
# Try the exercise above using this sample data.
# Sample data: bill = 80
# Write your code below and print the result
```

:::solution

```python
def bill_total(bill, tip=10):
    return bill + tip

print(bill_total(180))
print(bill_total(180, tip=25))
```

:::

### Medium: Label keyword settings

Write a function with `city` and `transport` parameters. Call it using keyword arguments in reverse order.

```python run
# Try the exercise above using this sample data.
# Sample data: city = "Jaipur", transport = "train"
# Write your code below and print the result
```

:::solution

```python
def travel_note(city, transport):
    print(f"Visit {city} by {transport}.")

travel_note(transport="train", city="Bhopal")
```

:::

### Challenge: Accept any number of scores

Write a function that accepts extra positional scores and returns their total. Call it with four values.

```python run
# Try the exercise above using this sample data.
# Sample data: scores = (72, 88, 91, 65)
# Write your code below and print the result
```

:::solution

```python
def total_scores(*scores):
    return sum(scores)

print(total_scores(12, 18, 9, 21))
```

:::

## Recap

- A default value supplies an optional parameter when a caller omits it.
- Keyword arguments connect a value to a parameter by name.
- `*args` collects extra positional arguments into a tuple; `**kwargs` collects extra named arguments into a dictionary.
- In a call, `*` and `**` unpack a sequence or dictionary into arguments.
- Prefer ordinary named parameters when the function's inputs are already known.

Reference: Python documentation, More on Defining Functions
