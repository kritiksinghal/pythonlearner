---
title: "Defining functions"
curriculumTitle: "Defining functions"
track: "Python from zero"
module: "M5 Functions"
order: 21
level: "Beginner"
summary: "Define and call your own Python functions to give repeated tasks clear names and reusable steps."
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
learningGoals:
  - "Define a function with def, a name, parentheses, and an indented body."
  - "Call a function by writing its name followed by parentheses."
  - "Recognize that defining a function stores its instructions but does not run them."
  - "Use functions to give repeated steps meaningful names and organize a program."
  - "Write a main() function to gather the starting steps of a program."
relatedProblems: []
---

## What you will learn

- A **function** is a named group of instructions that performs a task when called.
- How `def` begins a function definition and indentation marks the function body.
- How a **function call** runs the instructions stored under a function's name.
- Why definition and execution are separate events, and how the order of code matters.
- How functions make repeated steps easier to reuse, name, and update.
- How to put a program's starting steps inside a `main()` function and call it at the end.

## Why this matters

As a program grows, a long sequence of instructions becomes difficult to follow. If a cricket scoreboard formats the same kind of message for every player, copying the formatting code over and over makes later changes tedious. A function gives those instructions a name, such as `show_score`, so you can call the same task wherever you need it.

Functions also help you describe a program at a useful level. A line such as `print_receipt()` tells a reader what the next part of the program is doing without forcing them to inspect every detail immediately. You can focus on one small task at a time, reuse that task, and fix its behavior in one place.

## The big idea

Think of a function as a named recipe card. Writing the recipe card records the steps, but it does not cook the meal. Calling the function asks Python to follow those steps at that moment.

The basic structure is `def task_name():` followed by an indented body. `def` means you are defining a function. The name should describe the task, usually with lowercase words separated by underscores. The parentheses are part of the syntax even when the function takes no information from its caller. The colon starts the indented body.

After Python reads a function definition, it remembers the function under its name. The body runs only when the name is called with parentheses, for example `task_name()`. That distinction explains a common beginner mistake: writing `task_name` refers to the function, while `task_name()` calls it.

This lesson focuses on naming and calling functions. Information passed into a function is covered in “Parameters and return values.” A function can also send a value back with `return`; that topic is covered there too. Here, we will use functions that carry out visible steps such as printing.

## Step by step

### 1. Define and call a function

The definition records the instructions. The call runs them.

```python run
def greet_audience():
    print("Welcome to the school music night!")

greet_audience()
```

```output
Welcome to the school music night!
```

Line 1 starts a function definition named `greet_audience`. The indented line is the function body. The blank line does not change the program's meaning. The last line calls the function, so Python runs its body and prints the greeting.

If you remove the last line, the program defines the function but prints nothing. This is useful when you want a set of reusable tasks available for later use without running all of them immediately.

### 2. Use indentation to mark the body

Every statement belonging to a function must be indented consistently beneath its `def` line.

```python run
def show_match_header():
    print("Final over")
    print("Chasing 12 runs")

show_match_header()
```

```output
Final over
Chasing 12 runs
```

Both indented print statements are part of the function body. When called, they run in order. The unindented call is outside the function and is the instruction that starts those steps.

Indentation is part of Python syntax, not decoration. A line that is not indented is no longer inside the function. The next lesson, “Parameters and return values,” uses this same structure to work with values from the caller.

### 3. Call a function more than once

One definition can be called repeatedly. You do not have to copy its body each time.

```python run
def announce_round():
    print("New round begins")

announce_round()
announce_round()
announce_round()
```

```output
New round begins
New round begins
New round begins
```

Python reads the definition once. Each later call runs its body once, producing the same message. If the wording needs to change, update the body in one place and all three calls use the new wording.

### 4. Give a repeated task a useful name

Function names are for people reading the program. A descriptive name explains the task without requiring a comment beside every call.

```python run
def print_ticket_message():
    print("Keep your concert ticket until the final song.")

print_ticket_message()
```

```output
Keep your concert ticket until the final song.
```

The definition groups the print step under a clear name. The call reads like a short instruction. Python function names follow the same basic naming rules as variable names: use letters, digits, and underscores, and do not begin with a digit.

### 5. Put several related steps in one function

A function body may contain several statements that belong to the same task. Python runs them in their written order when the function is called.

```python run
def prepare_practice_session():
    print("Choose a batting partner")
    print("Set a target of 30 balls")
    print("Record each score")

prepare_practice_session()
```

```output
Choose a batting partner
Set a target of 30 balls
Record each score
```

All three lines share the goal of preparing a session, so grouping them under one name makes sense. If an unrelated task appears, such as printing a weather report, it probably deserves a separate function with its own name.

### 6. Definition order matters when a function is called

Python must know a function name before the program reaches a call to it. The usual pattern is to define functions first and call them afterward.

```python run
def play_intro():
    print("Intro music")

def start_show():
    print("Curtain opens")
    play_intro()

start_show()
```

```output
Curtain opens
Intro music
```

The first two definitions are read before the call to `start_show()`. When that call runs, Python prints the first line and then calls `play_intro()`. Since `play_intro` was already defined, its body can run.

You can define one function inside another, but that introduces a new topic. For beginner programs, keep related definitions at the top level and make their call order easy to scan.

### 7. Use `main()` to show where the program starts

Many programs put their starting sequence in a function named `main`. The name is a convention; Python does not automatically call it. You still need the call at the bottom.

```python run
def print_garden_plan():
    print("Morning: water the herbs")
    print("Evening: check the tomatoes")

def main():
    print("Today's garden plan")
    print_garden_plan()

main()
```

```output
Today's garden plan
Morning: water the herbs
Evening: check the tomatoes
```

The first function describes the garden tasks. `main()` describes the overall starting sequence: print a heading, then show the plan. The final call starts the program's sequence.

### 8. Keep one function focused on one task

Small functions are easier to name and reuse. This example keeps printing a score summary separate from printing a sportsmanship reminder.

```python run
def print_score_summary():
    print("Harriers: 3 goals")
    print("Wolves: 2 goals")

def print_fair_play_note():
    print("Thank both teams for a good match")

print_score_summary()
print_fair_play_note()
```

```output
Harriers: 3 goals
Wolves: 2 goals
Thank both teams for a good match
```

Each function has one clear responsibility. The program can call the score summary without also printing the reminder, or call both in sequence as shown. This separation gives you more control than one large function with unrelated steps.

## What Python is doing behind the scenes

When Python reads `def show_news():`, it creates a function object and associates it with the name `show_news`. It skips the indented body for now. Later, when Python reaches `show_news()`, it finds the function and starts executing its body. When that body finishes, execution continues at the next statement after the call.

| Program step | What Python does |
| --- | --- |
| `def announce():` | Creates and names the function. |
| Indented `print(...)` | Saves this instruction as part of the body. |
| `announce()` | Starts running the saved body. |
| Body finishes | Continues with the next statement after the call. |

Keeping definition separate from calling is what makes reuse possible. A definition by itself does not produce its printed messages. A call can run the same saved instructions each time it appears.

## Common mistakes

### 1. Mistyping a function name in a call

Broken code:

```python
def play_song_intro():
    print("The band takes the stage")

play_song_intor()
```

Python reports `NameError: name 'play_song_intor' is not defined` because the call's spelling does not match the defined name. Write `play_song_intro()` to call the function. Remember that the parentheses are required to run it.

### 2. Calling a function before Python has read its definition

Broken code:

```python
show_weather()

def show_weather():
    print("Clear skies")
```

Python reports `NameError: name 'show_weather' is not defined`. Move the call below the definition so Python has created the function before the call is reached.

### 3. Calling a no-input function with an extra value

Broken code:

```python
def show_menu():
    print("Rice bowl")

show_menu("lunch")
```

Python reports `TypeError: show_menu() takes 0 positional arguments but 1 was given`. This function has no parameter to receive `"lunch"`. Call it as `show_menu()`; adding parameters is covered in “Parameters and return values.”

### 4. Using a name that is not defined inside the body

Broken code:

```python
def print_notice():
    print(notice)

print_notice()
```

Python reports `NameError: name 'notice' is not defined`. The function tries to read a name that has not been created. Define the value first, or pass it into the function as a parameter.

## Cheat sheet

| Goal | Pattern | Meaning |
| --- | --- | --- |
| Define | `def task_name():` | Begins a function definition. |
| Function body | Indented statements | Instructions saved for a later call. |
| Call | `task_name()` | Runs the function body. |
| Reuse | Call the same name again | Runs the saved instructions again. |
| Program entry | Define `main()` then call `main()` | Groups the starting sequence. |
| Name style | `print_match_summary` | Lowercase words separated by underscores. |

## Try it yourself

### Easy: Create a greeting function

Define a function that prints a greeting for a school science fair, then call it once.

```python run
# Complete the Create a greeting function task.
# Sample data: event_name = "school science fair"
# Write your code below and print the result
```

:::solution
The solution completes “Create a greeting function” by using the provided sample values and producing the requested result.


```python
def greet_fair_visitors():
    print("Welcome to the science fair!")

greet_fair_visitors()
```

:::

### Medium: Announce three playlist sections

Define one function that prints a playlist section heading, then call it three times.

```python run
# Complete the Announce three playlist sections task.
# Sample data: sections = ["acoustic songs", "instrumentals", "final track"]
# Write your code below and print the result
```

:::solution
The solution completes “Announce three playlist sections” by using the provided sample values and producing the requested result.


```python
def announce_section():
    print("Next: acoustic songs")

announce_section()
announce_section()
announce_section()
```

:::

### Challenge: Organize a study session with `main()`

Define one function that prints a study checklist and a `main()` function that prints a title before calling the checklist. Call `main()`.

```python run
# Complete the Organize a study session with `main()` task.
# Sample data: checklist = ["Review notes", "Take a break", "Practice"]
# Write your code below and print the result
```

:::solution
The solution completes “Organize a study session with `main()`” by using the provided sample values and producing the requested result.


```python
def print_checklist():
    print("Review notes")
    print("Solve two problems")

def main():
    print("Saturday study session")
    print_checklist()

main()
```

:::

## Recap

- Define a function with `def`, a clear name, parentheses, a colon, and an indented body.
- Defining a function saves its instructions; calling it with parentheses runs them.
- One function definition can be called many times without copying its body.
- Keep related instructions together and give each function a name that tells readers its task.
- Python does not call `main()` automatically; include a call when you want the program to start there.

Reference: Python documentation, Defining Functions
