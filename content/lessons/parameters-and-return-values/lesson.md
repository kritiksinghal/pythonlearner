---
title: "Parameters and return values"
curriculumTitle: "Parameters and return values"
track: "Python from zero"
module: "M5 Functions"
order: 22
level: "Beginner"
summary: "Pass information into functions through parameters and send calculated results back with return."
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
learningGoals:
  - "Define parameters that let a function receive values from its caller."
  - "Distinguish a parameter in a definition from an argument in a call."
  - "Use return to send a result back to the caller."
  - "Store, print, or combine a returned value after a function call."
  - "Recognize that print displays a value while return provides a value to code."
relatedProblems: []
---

## What you will learn

- A **parameter** is a name in a function definition that receives a value when the function is called.
- An **argument** is the value supplied in a function call for a parameter.
- How to define a function with one or more parameters and pass values into it.
- How `return` sends a value from the function to the place that called it.
- Why `print()` and `return` have different jobs, even though both can appear in a function.
- How returned values can be stored in variables, printed, or used in another calculation.

## Why this matters

A reusable function becomes much more useful when it can work with different information. A function that prints “Good morning, Asha” only works for Asha. If it accepts a name as a parameter, the same instructions can greet Asha, Dev, or a whole class. A calculation function can accept a price and tax rate, then return a total for the rest of the program to use.

Returning a result also keeps a function useful in more than one place. A function can calculate a value without deciding whether to print it, save it, or combine it with another value. The caller can decide what happens next. This separation makes programs easier to reuse and easier to understand.

## The big idea

Imagine a smoothie counter. The recipe card names what it needs: fruit and a size. A customer gives those values, the worker follows the steps, and the finished smoothie is handed back. In a function, parameters are the named places for incoming information, arguments are the actual values given by the caller, and `return` hands the result back.

For example:

```python
def greet(name):
    return f"Hello, {name}!"

message = greet("Nila")
```

Here, `name` is a parameter. `"Nila"` is an argument. The function calculates a string and returns it. The assignment stores that returned string in `message`.

`print()` has a different purpose: it displays information to a person. Calling `print()` does not send the displayed text back as the function's result. If a function reaches its end without a `return` statement, its result is `None`. Use `return` when other code needs a result; use `print` when you want visible output.

Parameters give a function a clear agreement with its caller: these are the pieces of information the function expects to receive. The caller must provide the required arguments in the right positions, and the values should make sense for the calculation. Python does not automatically know that a variable called `price` should contain a positive number or that a `city` should be text. If the caller supplies an unsuitable value, the function may calculate an unexpected result or produce an error. Clear parameter names and small functions help people follow this agreement. Later lessons add other ways to customize the inputs, but the basic relationship remains the same: a call supplies values, the function works with them, and a return value makes a result available again.

## Step by step

### 1. Receive one value with a parameter

Write a parameter name inside the function's parentheses. The caller provides the corresponding argument in the call.

```python run
def greet_runner(name):
    print(f"Good luck, {name}!")

greet_runner("Tara")
greet_runner("Imran")
```

```output
Good luck, Tara!
Good luck, Imran!
```

`name` is the parameter in the definition. The calls provide two different arguments, so the same body produces a different greeting each time. The parameter exists while its function call runs.

### 2. Accept more than one parameter

Separate parameters with commas. When you call the function with positional arguments, Python assigns them from left to right.

```python run
def print_train_ticket(passenger, destination):
    print(f"{passenger} is travelling to {destination}.")

print_train_ticket("Aarav", "Mysuru")
```

```output
Aarav is travelling to Mysuru.
```

The first argument, `"Aarav"`, is assigned to `passenger`; the second, `"Mysuru"`, is assigned to `destination`. Then the function body uses both names to format the message.

The names in the definition describe what the values mean. Use names that help a reader understand what information a function expects.

### 3. Return a calculated number

Use `return` followed by an expression when you want to send a result back to the caller.

```python run
def total_with_delivery(price, delivery_fee):
    return price + delivery_fee

checkout_total = total_with_delivery(240, 35)
print(checkout_total)
```

```output
275
```

The function receives `240` and `35`, calculates their sum, and returns `275`. The caller stores the result in `checkout_total`, then prints it. The function itself does not have to print the result.

### 4. Return text for the caller to use

Functions can return strings, lists, numbers, or other values. Here the function returns a label, and the caller decides to print it.

```python run
def describe_weather(city, condition):
    return f"{city}: {condition}"

forecast_line = describe_weather("Pune", "light rain")
print(forecast_line)
```

```output
Pune: light rain
```

The return expression creates the string. That string becomes the value of the call, so it can be assigned to `forecast_line`. Printing happens after the function has finished.

### 5. Use a returned value in another calculation

You do not have to store a returned value first. You can pass it directly into another expression or function call.

```python run
def double_runs(runs):
    return runs * 2

innings = double_runs(37) + 12
print("Combined total:", innings)
```

```output
Combined total: 86
```

`double_runs(37)` returns `74`. Python then adds `12`, and the assignment stores `86` in `innings`. A function call that returns a value can be used wherever a value of that type is accepted.

### 6. Return a boolean answer

A function can return the result of a comparison. The caller can then use that answer in a condition.

```python run
def is_oversized(parcel_grams):
    return parcel_grams > 5000

weight = 6200
if is_oversized(weight):
    print("Use the large parcel label")
else:
    print("Use the regular parcel label")
```

```output
Use the large parcel label
```

The function returns `True` because 6200 is greater than 5000. The `if` statement uses that boolean result to choose which message to print. There is no need to store `True` as text; it is already a boolean value.

### 7. Return a value early when a condition is met

When Python executes `return`, the function ends immediately and sends its result back. This lets a function handle a special case before reaching its later calculation.

```python run
def ticket_price(age):
    if age < 5:
        return 0
    return 120

print(ticket_price(3))
print(ticket_price(12))
```

```output
0
120
```

For age 3, the first return runs and ends that call. For age 12, the condition is false, so Python continues to the next return. Each call follows its own path through the function.

### 8. Return multiple related values

When you write comma-separated values after `return`, Python packages them into a tuple. The caller can unpack that tuple into matching names.

```python run
def split_score(total_runs, wickets):
    return total_runs, wickets

score, lost_wickets = split_score(168, 6)
print(f"{score} runs for {lost_wickets} wickets")
```

```output
168 runs for 6 wickets
```

The function returns two related values together as a tuple. The assignment on the next line unpacks them into `score` and `lost_wickets`. Tuple syntax and unpacking are covered in “Tuples.”

### 9. Separate calculation from display

Let the function calculate and return the result, then let the caller decide how to display it. This makes the result easier to reuse.

```python run
def percentage(mark, maximum):
    return mark / maximum * 100

math_result = percentage(84, 100)
science_result = percentage(63, 75)
print(f"Math: {math_result:.0f}%")
print(f"Science: {science_result:.0f}%")
```

```output
Math: 84%
Science: 84%
```

The function performs the same calculation for two different pairs of values. Because it returns a number instead of printing a fixed sentence, the caller can format each result differently or use it in a later calculation.

## What Python is doing behind the scenes

At a function call, Python evaluates the arguments, then associates them with the parameters in the definition. It runs the body using those local parameter names. When `return` runs, Python stops the function and replaces the call expression with the returned value.

| Moment | Values |
| --- | --- |
| Call: `total_with_delivery(240, 35)` | Arguments are `240` and `35`. |
| Function begins | `price` is `240`; `delivery_fee` is `35`. |
| Return expression | `price + delivery_fee` evaluates to `275`. |
| Call completes | The expression `total_with_delivery(240, 35)` now has value `275`. |
| Assignment | `checkout_total` refers to `275`. |

Each call has its own parameter values. A later call can use different arguments without changing the earlier result you already stored.

## Common mistakes

### 1. Calling without a required argument

Broken code:

```python
def label_box(color):
    return f"{color} box"

print(label_box())
```

Python reports `TypeError: label_box() missing 1 required positional argument: 'color'`. Supply an argument, such as `label_box("green")`.

### 2. Printing instead of returning a value

Broken code:

```python
def add_shipping(price, fee):
    print(price + fee)

total = add_shipping(200, 30)
print(total + 10)
```

The function first displays `230`, then Python reports `TypeError: unsupported operand type(s) for +: 'NoneType' and 'int'`. `total` is `None` because the function only printed. Use `return price + fee` if the caller needs to use the result in another calculation.

### 3. Forgetting to return from one branch

Broken code:

```python
def classify_score(score):
    if score >= 50:
        return "pass"
    print("retry")

result = classify_score(42)
print(result + "!")
```

The function prints `retry`, then Python reports `TypeError: unsupported operand type(s) for +: 'NoneType' and 'str'`. That call returned `None` because it reached the end without returning. Add `return "retry"` in the second branch so every path returns the intended value.

### 4. Passing text to a numeric calculation

Broken code:

```python
def add_fee(price, fee):
    return price + fee

print(add_fee("200", 30))
```

Python reports `TypeError: can only concatenate str (not "int") to str`. The first argument is text, so `+` cannot add it to an integer. Pass a number such as `200`, or convert the text before calling.

## Cheat sheet

| Term or goal | Example | Meaning |
| --- | --- | --- |
| Parameter | `def greet(name):` | Named input in the definition. |
| Argument | `greet("Nila")` | Value supplied by the caller. |
| Return a result | `return price + fee` | Sends a value back and ends the call. |
| Store result | `total = add(2, 3)` | Keeps the returned value. |
| Display result | `print(add(2, 3))` | Shows a returned value to a person. |
| No explicit return | Function reaches its end | The call's result is `None`. |
| Multiple values | `return name, score` | Returns a tuple of values. |

## Try it yourself

### Easy: Return a greeting

Write a function that accepts a name and returns a greeting string. Print the result of calling it.

```python run
# Complete the Return a greeting task.
# Sample data: name = "Pia"
# Write your code below and print the result
```

:::solution
The solution completes “Return a greeting” by using the provided sample values and producing the requested result.


```python
def greeting(name):
    return f"Hello, {name}!"

print(greeting("Pia"))
```

:::

### Medium: Calculate a cricket total

Write a function that accepts runs from two batters and returns their combined score.

```python run
# Complete the Calculate a cricket total task.
# Sample data: first_batter = 36, second_batter = 49
# Write your code below and print the result
```

:::solution
The solution completes “Calculate a cricket total” by using the provided sample values and producing the requested result.


```python
def partnership(first_batter, second_batter):
    return first_batter + second_batter

print(partnership(36, 49))
```

:::

### Challenge: Return a ticket label

Write a function that accepts a city and a departure time and returns one formatted ticket line. Call it twice and print both results.

```python run
# Complete the Return a ticket label task.
# Sample data: city = "Udaipur", departure_time = "08:20"
# Write your code below and print the result
```

:::solution
The solution completes “Return a ticket label” by using the provided sample values and producing the requested result.


```python
def ticket_line(city, time):
    return f"Train to {city} leaves at {time}."

print(ticket_line("Udaipur", "08:20"))
print(ticket_line("Indore", "11:45"))
```

:::

## Recap

- A parameter names an input in the definition; an argument is the value given in a call.
- Arguments let the same function work with different data.
- `return` sends a value back to the caller and ends that function call.
- `print` displays a value, while `return` makes a value available to other code.
- A function with no explicit return produces `None` when it finishes.

Reference: Python documentation, Defining Functions
