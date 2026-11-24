---
title: "Lambda, map and filter"
curriculumTitle: "Lambda, map and filter"
track: "Python from zero"
module: "M5 Functions"
order: 25
level: "Beginner"
summary: "Use small lambda functions with map() and filter() to transform values or keep those that pass a test."
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
  - "default-keyword-args-and-kwargs"
learningGoals:
  - "Write a lambda expression for a short function containing one expression."
  - "Use map() to apply a function to each item in an iterable."
  - "Use filter() to keep items for which a function returns a true value."
  - "Convert map and filter results to a list when you need to display or reuse them."
  - "Choose a named function or comprehension when it is clearer than lambda, map, or filter."
relatedProblems: []
---

## What you will learn

- A **lambda expression** creates a small function with the `lambda` keyword and one expression.
- How to pass a function to `map()` to transform each item in an iterable.
- How to pass a function to `filter()` to keep items whose test is true.
- Why `map()` and `filter()` return iterators, and how `list()` can collect their results.
- When a named function or comprehension communicates the same work more clearly.

## Why this matters

Functions are values in Python, so you can give one function to another tool. For example, a set of temperatures might need the same conversion applied to each number, or a list of prices might need to keep only values below a budget. `map()` and `filter()` express those operations by receiving a function and applying it across a collection.

Sometimes the function is so short that writing a separate `def` block feels larger than the task. A lambda can provide a compact function for that moment. These tools appear in existing Python code, so understanding them helps you read other programs. They are not automatically clearer than a loop or comprehension; pick the form that makes the transformation easiest to follow.

## The big idea

Think of a conveyor belt carrying items past a worker. `map()` applies the same change to every item: each temperature is converted, or each name is capitalized. `filter()` asks a yes-or-no question about each item and lets only the items that pass continue. Both tools receive a function that describes the work.

A lambda expression looks like `lambda value: expression`. The parameter name is on the left of the colon, and the expression to evaluate is on the right. The expression's value becomes the function's return value. A lambda is limited to one expression; use `def` when the function needs statements, a useful name, or several steps.

`map(function, items)` produces a map iterator that calculates one transformed result for each input as you request it. `filter(function, items)` produces a filter iterator that yields only the inputs for which the function result is true. Convert the result with `list(...)` when you want to print the full collection or use it more than once. For many beginner transformations, a list comprehension says the same thing in a familiar way; see “Comprehensions.”

## Step by step

### 1. Write a short function with `lambda`

The lambda form puts the parameter and one expression together. It creates a function value that you can call like another function.

```python run
double = lambda number: number * 2
print(double(14))
```

```output
28
```

The expression `number * 2` is evaluated using the argument `14`, so the call returns 28. The name `double` now refers to that small function. A normal `def` function is often easier to read when the task needs a descriptive docstring or multiple statements.

### 2. Use a lambda where a function is needed

A lambda is often used directly as an argument. Here it gives `sorted()` the rule for comparing each pair of shoes by price.

```python run
shoes = [("Trail", 4200), ("Court", 3600), ("Daily", 2800)]
by_price = sorted(shoes, key=lambda shoe: shoe[1])
print(by_price)
```

```output
[('Daily', 2800), ('Court', 3600), ('Trail', 4200)]
```

The lambda receives each shoe pair and returns its second item, the price. `sorted()` compares those price values but keeps the full pairs in the result. The lambda is appropriate because the rule is one short expression used at this call.

### 3. Transform every item with `map()`

Pass a function and an iterable to `map()`. It applies that function to each item and produces the transformed values when you iterate over the result.

```python run
kilometers = [1, 3, 7]
meters = list(map(lambda distance: distance * 1000, kilometers))
print(meters)
```

```output
[1000, 3000, 7000]
```

The lambda converts one distance from kilometers to meters. `map()` applies it to each number, and `list()` collects the produced values into a list that can be printed.

The equivalent comprehension is `[distance * 1000 for distance in kilometers]`. For a simple transformation, that form may be easier for a beginner to read. You will see both in Python code.

### 4. Use a named function with `map()`

The function given to `map()` does not have to be a lambda. Use a named function when the transformation deserves a name or contains a more meaningful operation.

```python run
def add_service_fee(amount):
    return amount + 15

drink_prices = [35, 50, 65]
with_fee = list(map(add_service_fee, drink_prices))
print(with_fee)
```

```output
[50, 65, 80]
```

`map()` calls `add_service_fee` once for each price. The resulting list has the same number of items as the input because the function transforms every item rather than skipping any.

### 5. Keep values with `filter()`

Give `filter()` a function that returns a truthy or false value. The items for which the function result is true are kept.

```python run
ages = [14, 18, 21, 16, 25]
adult_ages = list(filter(lambda age: age >= 18, ages))
print(adult_ages)
```

```output
[18, 21, 25]
```

For each age, the lambda checks whether it is at least 18. `filter()` yields the original age when the test is true and skips it otherwise. `list()` gathers the kept values.

The equivalent list comprehension is `[age for age in ages if age >= 18]`. This often reads naturally as “keep each age if it is at least 18.”

### 6. Use a named test with `filter()`

If the test has a useful name, write a regular function and pass that function to `filter()`.

```python run
def is_available(quantity):
    return quantity > 0

stock_counts = [0, 8, 3, 0, 12]
available = list(filter(is_available, stock_counts))
print(available)
```

```output
[8, 3, 12]
```

`is_available` returns `True` for positive quantities and `False` for zero. `filter()` keeps the values with a true result. The name explains the test without requiring a reader to parse an expression embedded in the call.

### 7. Combine mapping and filtering

You can feed the result of one operation into another, but use an intermediate name when it makes the steps easier to understand.

```python run
temperatures = [16, 22, 19, 28]
warm_celsius = filter(lambda temp: temp >= 20, temperatures)
warm_fahrenheit = list(map(lambda temp: round(temp * 9 / 5 + 32), warm_celsius))
print(warm_fahrenheit)
```

```output
[72, 82]
```

The filter first keeps 22 and 28. The map converts those values to rounded Fahrenheit readings. The final `list()` collects the results. If a pipeline like this grows, a regular loop or separate named functions may be clearer.

### 8. Notice that iterators are consumed

`map()` and `filter()` return iterators. An iterator provides its results as you go, so after one complete pass it has no items left to provide.

```python run
scores = [12, 18, 9]
score_results = map(lambda score: score + 1, scores)
print(list(score_results))
print(list(score_results))
```

```output
[13, 19, 10]
[]
```

The first conversion to a list consumes all transformed values. The second conversion receives the same iterator after it has been exhausted, so it produces an empty list. Make a new `map()` call or save the results as a list if you need to use them more than once.

## What Python is doing behind the scenes

When `map()` or `filter()` is created, Python returns an iterator rather than immediately building a list. Each time the program asks for the next item, the iterator processes source values until it has a result to provide or reaches the end.

| Tool | For each source item | What it yields |
| --- | --- | --- |
| `map(function, items)` | Calls the function | The function's returned value. |
| `filter(function, items)` | Calls the test function | The original item if the result is true. |
| `list(iterator)` | Requests items until the iterator ends | A new list containing those items. |

A lambda follows the same call-and-return idea as a named function. Its short spelling does not make it a different kind of result: when called, it returns the value of its expression. The iterator behavior is the part that can surprise you, especially if you try to inspect the same map or filter result twice.

## Common mistakes

### 1. Referencing a name the lambda does not receive

Broken code:

```python
increase = lambda number: number + bonus
print(increase(3))
```

Python reports `NameError: name 'bonus' is not defined`. The lambda has a parameter named `number`, but no visible value named `bonus`. Use a fixed number in the expression or make both values parameters, such as `lambda number, bonus: number + bonus`.

### 2. Calling a function that needs more arguments than `map()` supplies

Broken code:

```python
def add_tax(price, rate):
    return price * (1 + rate)

prices = [100, 200]
print(list(map(add_tax, prices)))
```

Python reports `TypeError: add_tax() missing 1 required positional argument: 'rate'`. `map()` supplies one item from `prices` per call, but `add_tax` needs two arguments. Use a one-parameter helper or write a loop that supplies both values.

### 3. Passing a non-function as the filter test

Broken code:

```python
prices = [20, 40, 60]
print(list(filter(10, prices)))
```

Python reports `TypeError: 'int' object is not callable`. The first argument to `filter()` must be a function that can test each item. Replace `10` with a function, such as `lambda price: price < 50`.

### 4. Using a string method on numeric values

Broken code:

```python
numbers = [3, 7]
print(list(map(lambda number: number.upper(), numbers)))
```

Python reports `AttributeError: 'int' object has no attribute 'upper'`. The items are integers, and integers do not have an `.upper()` method. Convert the numbers to text first if uppercase text is actually the goal, or choose a function that accepts numbers.

## Cheat sheet

| Goal | Example | Effect |
| --- | --- | --- |
| Small function | `lambda n: n * 2` | Returns one expression's value. |
| Transform items | `map(function, items)` | Produces mapped results as an iterator. |
| Keep selected items | `filter(test, items)` | Yields original items whose test is true. |
| Collect results | `list(map(...))` | Creates a reusable list. |
| Named transformation | `map(add_fee, prices)` | Uses a defined function for each item. |
| Named test | `filter(is_ready, tasks)` | Keeps items passing a named condition. |
| Readable alternative | `[n * 2 for n in numbers]` | Comprehension for simple transformations. |

## Try it yourself

### Easy: Convert minutes to seconds

Use `map()` and a lambda to multiply every number of minutes by 60. Print the resulting list.

```python run
```

:::solution

```python
minutes = [2, 5, 8]
seconds = list(map(lambda value: value * 60, minutes))
print(seconds)
```

:::

### Medium: Keep short songs

Use `filter()` to keep song lengths under 200 seconds.

```python run
```

:::solution

```python
durations = [185, 214, 172, 206]
short_songs = list(filter(lambda duration: duration < 200, durations))
print(short_songs)
```

:::

### Challenge: Apply a named function with `map()`

Write a function that adds 5 points to a mark, then use `map()` to apply it to three marks.

```python run
```

:::solution

```python
def add_bonus(mark):
    return mark + 5

marks = [66, 74, 89]
print(list(map(add_bonus, marks)))
```

:::

## Recap

- A lambda creates a small one-expression function.
- `map()` calls a function for each input and yields transformed values.
- `filter()` keeps original items whose test function returns a true value.
- Map and filter results are iterators; convert them to lists when you need to reuse or display them.
- Prefer a named function or comprehension when it makes the operation easier to understand.

Reference: Python documentation, Lambda Expressions and Built-in Functions
