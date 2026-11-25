---
title: "Recursion"
curriculumTitle: "Recursion"
track: "Python from zero"
module: "M5 Functions"
order: 26
level: "Intermediate"
summary: "Learn how a function can solve a problem by calling itself on a smaller version of that problem."
prerequisites:
  - "lambda-map-and-filter"
learningGoals:
  - "Recognize the base case and recursive case"
  - "Trace recursive calls and returned values"
  - "Use recursion for problems with naturally smaller subproblems"
  - "Avoid missing stopping conditions and excessive call depth"
relatedProblems: []
---

## What you will learn

- What **recursion** means when a function calls itself
- How to design a **base case** that stops the calls
- How a **recursive case** turns a large task into a smaller one
- How Python waits for calls to return and combines their results
- How to decide when a loop is a clearer choice

## Why this matters

Some tasks have a shape that repeats inside itself: a folder can contain folders, a family tree branches into smaller branches, and a game can offer choices that lead to more choices. Recursion gives you a way to describe such tasks using one rule for the current part and the same rule for a smaller part. It is also a useful way to understand algorithms that visit nested structures. You will learn to control it carefully so a program always knows when to stop.

## The big idea

Think of opening a set of nested gift boxes. At each box you either find the gift and stop, or find a smaller box and repeat the same action. A recursive function works in that pattern: it checks whether the current problem is small enough to answer directly; otherwise, it calls itself with a simpler input.

The direct stopping situation is the **base case**. The call on a smaller input is the **recursive case**. Both parts matter. Without a base case, calls continue until Python raises `RecursionError`. Without progress toward the base case, the function never gets closer to stopping.

Recursion is not a special Python command. It is a function calling a function with the same name. Python keeps track of each unfinished call, including its local values and the place to continue after the smaller call returns. That stack of waiting calls is called the **call stack**. Once the deepest call reaches its base case, results return outward one call at a time.

## Step by step

### Count down to a stopping point

Start with a function that prints a number, then works on the number just below it. The base case handles zero without making another call.

```python run
def count_down(number):
    if number == 0:
        print("Lift off!")
        return
    print(number)
    count_down(number - 1)

count_down(3)
```

```output
3
2
1
Lift off!
```

The first call receives `3`; since it is not zero, it prints and calls `count_down(2)`. That call repeats with `1`, then `0`. At zero the base case prints the final line and returns. Each earlier call then has nothing else to do, so it finishes too.

### Make sure each call moves toward the base case

The argument must become simpler each time. Here, subtracting one makes the value approach zero. The same idea works when reducing a list, a string, or a number by a factor.

```python run
def print_steps(step):
    if step < 1:
        return
    print(f"Step {step}")
    print_steps(step - 1)

print_steps(4)
```

```output
Step 4
Step 3
Step 2
Step 1
```

This example uses a condition that covers values below one. Its recursive call changes `step` by exactly one, so every positive whole number eventually reaches the stopping condition. Test the smallest expected inputs as well as ordinary inputs when designing a recursive function.

### Return a value from each call

Printing is not the only use. A function can return a result from its smaller call and combine it with the current value. The factorial of a positive whole number multiplies that number by all smaller positive whole numbers. We define `0!` as `1`, which supplies a convenient base case.

```python run
def factorial(number):
    if number == 0:
        return 1
    return number * factorial(number - 1)

print(factorial(4))
```

```output
24
```

The call for `4` waits for `factorial(3)`, which waits for `factorial(2)`, then `factorial(1)`, then `factorial(0)`. The base call returns `1`. The waiting calls multiply on the way back: `1 * 1`, then `2 * 1`, then `3 * 2`, then `4 * 6`.

### Trace the return path

Write down each argument and returned result when a recursive answer feels mysterious. This trace shows the multiplication that happens after the smaller calls finish.

```python run
def double_sum(number):
    if number == 0:
        return 0
    return number * 2 + double_sum(number - 1)

print(double_sum(3))
```

```output
12
```

The deepest call returns zero. Then the calls return `2 + 0`, `4 + 2`, and `6 + 6`. The function therefore totals twice each integer from one through three. A recursive call can return a value that is used in a larger expression.

### Use a recursive definition for a sequence

Some number sequences are described by earlier entries. In the Fibonacci sequence, each term after the first two is the sum of the previous two. Passing both previous values avoids recalculating the entire history.

```python run
def fibonacci_pair(count, first=0, second=1):
    if count == 0:
        return first
    return fibonacci_pair(count - 1, second, first + second)

print(fibonacci_pair(7))
```

```output
13
```

The pair moves forward once per call. When `count` reaches zero, `first` is the requested term. This is an example of using default parameters as initial state; the topic of function parameters was covered in **Parameters and return values**.

### Reduce a string to a smaller string

You can define a problem by removing one character on each call. This version counts the lowercase letter `a` in a string. The empty string is the base case because it contains no characters.

```python run
def count_a(text):
    if text == "":
        return 0
    current = 1 if text[0] == "a" else 0
    return current + count_a(text[1:])

print(count_a("canada"))
```

```output
3
```

Each call inspects the first character and passes the rest of the string onward. A slice creates the smaller string. For very long strings, repeated slicing has extra cost; this is a teaching example of the pattern, not the most efficient way to count characters.

### Find the smallest value in a list

Another way to shrink a task is to compare the first item with the answer for the rest. A one-item list is the base case because its only item is automatically its smallest.

```python run
def smallest(values):
    if len(values) == 1:
        return values[0]
    rest_smallest = smallest(values[1:])
    return values[0] if values[0] < rest_smallest else rest_smallest

print(smallest([18, 7, 24, 11]))
```

```output
7
```

For this lesson, assume the list contains at least one item. The function answers the smaller-list question first, then compares that answer with the first item. Slicing copies each remaining portion, so a loop is usually preferable for a long list; the recursive form makes the repeated structure visible.

### Walk through nested choices

Recursive functions can explore choices. This small example prints every binary string of a chosen length. At each position it branches into two smaller tasks, one adding `0` and the other adding `1`.

```python run
def bit_patterns(length, prefix=""):
    if length == 0:
        print(prefix)
        return
    bit_patterns(length - 1, prefix + "0")
    bit_patterns(length - 1, prefix + "1")

bit_patterns(2)
```

```output
00
01
10
11
```

The base case prints a complete pattern. Each non-base call creates two paths, and each path reduces the remaining length. With every extra position, the number of results doubles, so branching recursion can become expensive quickly.

### Compare recursion with a loop

A simple counting total is often clearer with a loop. Use recursion when the problem naturally splits into smaller versions or nested branches; use a loop when repeated steps are linear and state changes predictably.

```python run
def sum_with_loop(limit):
    total = 0
    for value in range(1, limit + 1):
        total += value
    return total

print(sum_with_loop(5))
```

```output
15
```

The loop carries one running total and does not create a function call for every number. Both approaches can solve the same task, but readability and resource use matter. This comparison is a brief connection to loops; loops were covered in **while loops** and **for loops and range()**.

### Notice the missing stopping condition

Every recursive path must eventually hit a base case. If a function calls itself with an unchanged argument, it cannot make progress. Running this example reaches Python's recursion limit, whose precise traceback varies by environment, so do not rely on a particular number of calls.

```python
def never_stops(value):
    return never_stops(value)

never_stops(5)
```

Python raises `RecursionError: maximum recursion depth exceeded` because the same call keeps waiting for another call. Fix the design by making the argument smaller and providing a base case that handles the smallest valid input.

### Respect Python's call-depth limit

Python limits the depth of nested calls to protect the running program. A recursive design that is elegant for a small input can fail when given thousands of steps. Do not increase the limit as a first fix; choose an iterative approach for large linear workloads or redesign the algorithm.

```python run
def product_to(number):
    if number <= 1:
        return 1
    return number * product_to(number - 1)

print(product_to(6))
```

```output
720
```

The function is appropriate for this small positive value. Each call has its own local `number`, even though all calls use the same function name. Later lessons will cover exceptions; for now, recognize that very deep recursion can raise an error instead of producing a result.

### Use a base case for empty input

An empty sequence is often a useful stopping point. Here a recursive function builds a reversed string by taking the last character first, then handling what remains.

```python run
def reverse_text(text):
    if text == "":
        return ""
    return text[-1] + reverse_text(text[:-1])

print(reverse_text("monsoon"))
```

```output
noosnom
```

Each call removes one final character. The empty string returns immediately, and the waiting calls prepend their characters in reverse order. Python strings are immutable, so this creates new strings; for large text, other approaches use less repeated work.

## What Python is doing behind the scenes

When a function calls itself, Python does not replace the current call. It records a new frame containing that call's local variables and its return location. The current frame pauses until the nested call produces a value. After the base case returns, Python removes frames in last-in, first-out order, like a stack of trays.

For `factorial(3)`, the important states are:

| Call | What it waits for | Result after waiting |
|---|---|---:|
| `factorial(3)` | `factorial(2)` | `3 * 2 = 6` |
| `factorial(2)` | `factorial(1)` | `2 * 1 = 2` |
| `factorial(1)` | `factorial(0)` | `1 * 1 = 1` |
| `factorial(0)` | Nothing; base case | `1` |

The calls are entered from top to bottom and return from bottom to top. This explains why code after a recursive call runs while results move back outward. A function that prints before its call displays values in descending order; a function that prints after its call can display them in ascending order.

The call stack uses memory. Each additional nested call needs a frame, so recursion has a practical depth limit. The number of calls also affects speed. A branching algorithm may repeat the same subproblem many times; later study of algorithms can introduce caching, but the lesson here is to recognize when recursion duplicates work.

## Common mistakes

### Forgetting the base case

Broken code:

```python
def walk_down(number):
    print(number)
    walk_down(number - 1)

walk_down(2)
```

Running it ends with `RecursionError: maximum recursion depth exceeded`. The function never checks for a stopping value. Add a condition before the recursive call and return when it is met.

### Calling with an unchanged value

Broken code:

```python
def count_to_zero(number):
    if number == 0:
        return
    count_to_zero(number)

count_to_zero(3)
```

The error is `RecursionError: maximum recursion depth exceeded`. A base case exists, but the argument remains `3`, so it can never reach zero. Pass a smaller value, such as `number - 1`.

### Moving away from the base case

Broken code:

```python
def shrink(number):
    if number == 0:
        return 0
    return shrink(number + 1)

shrink(2)
```

Python reports `RecursionError: maximum recursion depth exceeded`. Adding one moves farther from zero. Choose a recursive step that reduces the distance to the base case for every allowed input.

### Returning nothing from one branch

Broken code:

```python
def count_items(number):
    if number == 0:
        return
    return 1 + count_items(number - 1)

print(count_items(1))
```

Python raises `TypeError: unsupported operand type(s) for +: 'int' and 'NoneType'`. A bare `return` produces `None`, and the waiting call tries to add one to it. Return the identity value `0` from this counting base case.

### Using a recursive solution for too much data

A recursion depth error on large input does not always mean the base case is wrong. The design may be valid but too deep for Python's call stack. For a simple repeated count or total, use a loop. Recursion is most useful when it makes a nested or branching structure easier to express.

## Cheat sheet

| Part | Question to ask | Example |
|---|---|---|
| Base case | What smallest input can I answer directly? | `if number == 0: return 1` |
| Recursive case | How do I express the rest as a smaller task? | `return number * factorial(number - 1)` |
| Progress | Does each call move toward the base case? | `number - 1` |
| Return path | What should each waiting call do with the smaller answer? | Add, compare, or combine it |
| Depth | Could the input require too many nested calls? | Prefer a loop for a long linear count |

## Try it yourself

### Easy: count down by twos

Write a recursive function that prints `8`, `6`, `4`, and `2`, then prints `Done`. The base case should stop before the next value becomes zero.

```python run
def even_countdown(number):
    if number <= 0:
        print("Done")
        return
    print(number)
    even_countdown(number - 2)

even_countdown(8)
```

```output
8
6
4
2
Done
```

:::solution

```python run
def even_countdown(number):
    if number <= 0:
        print("Done")
        return
    print(number)
    even_countdown(number - 2)

even_countdown(8)
```


```output
8
6
4
2
Done
```
:::

### Medium: add the numbers down to one

Create a function that returns the sum from the given positive integer down to one. Use `0` as the base result for an input of zero.

```python run
def sum_down(number):
    if number == 0:
        return 0
    return number + sum_down(number - 1)

print(sum_down(5))
```

```output
15
```

:::solution

```python run
def sum_down(number):
    if number == 0:
        return 0
    return number + sum_down(number - 1)

print(sum_down(5))
```


```output
15
```
:::

### Challenge: count a chosen character

Write a recursive function that counts how many times `e` appears in a word. It should return zero when the text is empty.

```python run
def count_e(text):
    if text == "":
        return 0
    first_match = 1 if text[0] == "e" else 0
    return first_match + count_e(text[1:])

print(count_e("cheese"))
```

```output
3
```

:::solution

```python run
def count_e(text):
    if text == "":
        return 0
    first_match = 1 if text[0] == "e" else 0
    return first_match + count_e(text[1:])

print(count_e("cheese"))
```


```output
3
```
:::

## Recap

- Recursion is a function solving a smaller version of its own problem.
- A base case answers directly and prevents endless calls.
- Every recursive step must make progress toward a base case.
- Python keeps unfinished calls on a stack and returns through them in reverse order.
- Use loops for simple long repetitions and recursion for naturally nested or branching tasks.

Reference: Python documentation, The Python Tutorial — Defining Functions
