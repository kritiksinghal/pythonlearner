---
title: "Scope"
curriculumTitle: "Scope"
track: "Python from zero"
module: "M5 Functions"
order: 23
level: "Beginner"
summary: "Understand where Python looks for variable names and how local and global scope affect functions."
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
learningGoals:
  - "Define scope as the part of a program where a name can be used."
  - "Distinguish local variables and parameters from global variables."
  - "Explain how Python searches enclosing scopes and built-in names."
  - "Recognize why assigning inside a function creates a local name by default."
  - "Use function parameters and return values to share changing data clearly."
relatedProblems: []
---

## What you will learn

- **Scope** is the part of a program where a particular name can be used.
- A **local variable** is created inside a function and belongs to that function call.
- A **global variable** is created at the top level of a module and can be read from functions.
- How Python searches for a name in local, enclosing, global, and built-in places.
- Why assigning to a name inside a function makes it local by default.
- How parameters and return values often make data flow clearer than changing global state.

## Why this matters

As your program grows, you may use the same short variable names in different places. A name such as `score` could be a temporary value inside one function and a separate value in another. Scope determines which value Python means when it sees that name. Without a clear understanding of scope, a function may read a different value than you intended or fail because a name is unavailable.

Scope also helps prevent accidental changes. A function that updates a global variable can affect every part of a program that reads it. Passing a value into a function and returning a changed value makes the change visible at the call site. You can then understand how information moves through your program.

## The big idea

Imagine each function as a desk with its own labeled drawers. A local variable is a note kept in that function's drawer; another function may have a separate note with the same label. A global variable is a shared notice on the wall that functions can read. The same name can refer to different values depending on which desk is active.

When Python sees a name inside a function, it first checks the function's local scope. If it does not find the name there, it checks any enclosing function scopes, then the module's global scope, and finally Python's built-in names. This search is often called **LEGB**: Local, Enclosing, Global, Built-in. You do not need to memorize the acronym to write clear code, but the search order explains many results.

Reading a global name is allowed. Assigning to a name inside a function is different: Python treats that name as local unless you explicitly declare it global. This rule prevents a function from changing shared state by accident. The `global` keyword exists, but for ordinary learning code, prefer parameters and return values when you need to send data in and out.

## Step by step

### 1. A variable created inside a function is local

A name assigned inside a function belongs to that function. It can be read while the function runs.

```python run
def print_practice_plan():
    session = "batting drills"
    print("Today's session:", session)

print_practice_plan()
```

```output
Today's session: batting drills
```

`session` is assigned inside `print_practice_plan`, so it is local to that function. The print statement can use it because both statements run in the same function scope. The name does not automatically become available everywhere else in the program.

### 2. Different functions can use the same local name

Local names in separate functions are independent. Here each function has its own `message` variable.

```python run
def announce_score():
    message = "Home team leads"
    print(message)

def announce_weather():
    message = "Light clouds"
    print(message)

announce_score()
announce_weather()
```

```output
Home team leads
Light clouds
```

The two `message` names do not conflict. Each belongs to a different function, so the first function's value does not overwrite the second function's value.

### 3. Parameters are local names too

A parameter receives a value for one function call. It is available inside the function body and does not become a top-level variable.

```python run
def print_welcome(visitor):
    print(f"Welcome to the gallery, {visitor}!")

print_welcome("Nina")
print_welcome("Omar")
```

```output
Welcome to the gallery, Nina!
Welcome to the gallery, Omar!
```

Each call gives `visitor` a different local value. When a call finishes, that call's local parameter is no longer available to later top-level statements.

### 4. A function can read a global name

A name assigned at the top level is global to that module. A function can read it when no local name with the same spelling takes priority.

```python run
festival = "Lantern Night"

def print_festival_name():
    print("Tonight:", festival)

print_festival_name()
```

```output
Tonight: Lantern Night
```

The function does not assign to `festival`, so Python looks outside the function and finds the top-level value. The function can read that global value without a special declaration.

Global values can be convenient for settings that rarely change, but many changing values make a program harder to reason about. Function parameters make dependencies explicit: you can see what information a function receives by looking at its definition and call.

### 5. A local name takes priority over a global name

If the function assigns its own local value with the same name, code inside the function uses the local one.

```python run
venue = "Riverside Hall"

def announce_venue():
    venue = "School Auditorium"
    print("Function venue:", venue)

announce_venue()
print("Global venue:", venue)
```

```output
Function venue: School Auditorium
Global venue: Riverside Hall
```

The assignment inside the function creates a local `venue`. It does not replace the global value. The final print runs outside the function and reads the global `venue`.

This is useful when two tasks need a local value with the same common name. If you intend to change the shared value, use a clear design for that update rather than assuming the local assignment reaches outside the function.

### 6. Read an enclosing function's name

When functions are nested, the inner function can read a name from its enclosing function if it does not define a local name with the same spelling.

```python run
def make_chant():
    team = "Comets"

    def print_chant():
        print(team, "keep moving!")

    print_chant()

make_chant()
```

```output
Comets keep moving!
```

`team` belongs to `make_chant`, the enclosing function. `print_chant` can read it because it is nested inside that function and has no local `team`. Nested functions and closures are useful later, but for now focus on the search order.

### 7. Assigning inside a function creates a local name

Python decides that a name is local to a function when the function assigns to it anywhere in the body. This can be surprising if you first try to read a global value with that same name.

```python run
points = 10

def show_new_points():
    points = 15
    print("Function points:", points)

show_new_points()
print("Original points:", points)
```

```output
Function points: 15
Original points: 10
```

The assignment in the function creates a local `points`. It does not change the global `points`, so the top-level value remains 10. If you want a function to calculate an updated value, return it and assign the result outside, as in the next example.

### 8. Pass a value in and return an updated value

Parameters and return values make a change explicit. The function uses a local parameter, calculates a new value, and returns it to the caller.

```python run
def add_bonus(points, bonus):
    return points + bonus

team_points = 10
team_points = add_bonus(team_points, 5)
print(team_points)
```

```output
15
```

The original `team_points` value is passed as an argument. Inside the function, `points` and `bonus` are local parameter names. The returned total is assigned back to `team_points` at the call site, making the update visible.

## What Python is doing behind the scenes

When Python evaluates a name, it searches scopes in a defined order. If a local name exists, it wins over an enclosing or global name with the same spelling. If no matching name exists in any visible scope, Python raises `NameError`.

| Search position | Example source | Looked up when |
| --- | --- | --- |
| Local | A name assigned inside the current function | First inside a function. |
| Enclosing | A name in a surrounding function | After the current local scope. |
| Global | A name assigned at module level | After enclosing function scopes. |
| Built-in | Names such as `len` and `print` | If no earlier scope has the name. |

The key distinction is between reading and assigning. A function can read a global name when it is not shadowed by a local one. An assignment in the function normally creates or updates a local name. This predictable rule helps Python avoid hidden changes to shared values.

## Common mistakes

### 1. Using a local name outside its function

Broken code:

```python
def print_album_title():
    album = "Quiet Roads"
    print(album)

print_album_title()
print(album)
```

Python reports `NameError: name 'album' is not defined` on the last line. `album` is local to the function. Return the value if the caller needs it, or define a separate top-level value when that is the intended design.

### 2. Misspelling a name inside the function

Broken code:

```python
def print_destination():
    destination = "Kochi"
    print(destinaton)

print_destination()
```

Python reports `NameError: name 'destinaton' is not defined`. The name in the print statement is missing an `i`. Use the same spelling, `destination`, throughout the function.

### 3. Expecting a local assignment to update a global variable

Broken code:

```python
def save_location():
    location = "Lake House"

def print_location():
    print(location)

print_location()
```

Python reports `NameError: name 'location' is not defined`. The local name from `save_location` is not visible inside the separate `print_location` function. Give `print_location` a parameter and pass it the location, or define a shared top-level value if that is truly appropriate.

### 4. Using the wrong global name

Broken code:

```python
city = "Jaipur"

def print_city():
    print(citty)

print_city()
```

Python reports `NameError: name 'citty' is not defined`. Python does not guess that `citty` was meant to be `city`; correct the spelling in the function.

## Cheat sheet

| Scope idea | Example | Effect |
| --- | --- | --- |
| Local variable | `def task(): value = 3` | Name belongs to the function. |
| Parameter | `def greet(name):` | Local input name for a call. |
| Global variable | `venue = "Hall"` at top level | Module-level name readable in functions. |
| Enclosing name | Inner function reads outer function's variable | Python searches enclosing function scopes. |
| Built-in name | `print`, `len` | Available when no nearer name shadows it. |
| Clear update | `total = add_bonus(total, 5)` | Sends data in and receives a result back. |

## Try it yourself

### Easy: Keep a value local

Create a function that defines a local variable for a song title and prints it. Call the function.

```python run
# Complete the Keep a value local task.
# Sample data: title = "Paper Lanterns"
# Write your code below and print the result
```

:::solution
The solution completes “Keep a value local” by using the provided sample values and producing the requested result.


```python
def play_title():
    title = "Paper Lanterns"
    print(title)

play_title()
```

:::

### Medium: Pass a global value into a function

Create a top-level variable with a team name, then pass it to a function that prints a cheer using a parameter.

```python run
# Complete the Pass a global value into a function task.
# Sample data: team = "Fireflies"
# Write your code below and print the result
```

:::solution
The solution completes “Pass a global value into a function” by using the provided sample values and producing the requested result.


```python
team = "Fireflies"

def cheer(team_name):
    print(team_name, "onward!")

cheer(team)
```

:::

### Challenge: Return a changed value

Write a function that accepts a starting number of library books and a number borrowed, then returns how many remain. Store and print the returned value.

```python run
# Complete the Return a changed value task.
# Sample data: starting_books = 28, borrowed_books = 6
# Write your code below and print the result
```

:::solution
The solution completes “Return a changed value” by using the provided sample values and producing the requested result.


```python
def books_remaining(total, borrowed):
    return total - borrowed

available = books_remaining(42, 9)
print(available)
```

:::

## Recap

- Scope controls where a name can be read and which value it refers to.
- Parameters and variables assigned in a function are local to that function call.
- Functions can read global names, but a local name with the same spelling takes priority.
- Python searches local, enclosing, global, then built-in scopes for a name.
- Passing values in and returning results makes data changes visible and easier to follow.

Reference: Python documentation, Resolution of names
