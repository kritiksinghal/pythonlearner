---
title: "Iterators and generators"
curriculumTitle: "Iterators and generators"
track: "Python from zero"
module: "M8 Advanced"
order: 38
level: "Intermediate"
summary: "Learn how iterators produce values one at a time and how generators make them easy to write."
prerequisites:
  - "Dataclasses"
learningGoals:
  - "Explain the iterator protocol using iter() and next()"
  - "Recognize that iterators are consumed as values are requested"
  - "Write a generator function with yield"
  - "Choose a generator when producing a sequence lazily is useful"
relatedProblems: []
---

## What you will learn

- What an **iterable** is and how it differs from an **iterator**
- How `iter()` and `next()` request values one by one
- What happens when an iterator is exhausted
- How a **generator** function pauses at `yield` and resumes later
- Why lazy production can save memory and clarify sequential processing

## Why this matters

Programs often process a stream of data: lines from a log, turns in a game, or measurements arriving over time. Loading every value into a list can use extra memory when you only need one value at a time. Iterators provide a common way for Python to request the next item, and generators make it straightforward to create those items as needed.

## The big idea

Imagine a ticket dispenser that gives out one ticket each time you pull the lever. The dispenser can provide the next value without handing you every future ticket in advance. An iterator is like that dispenser: it remembers its current position and produces one value when asked.

An **iterable** is an object you can loop over, such as a list or string. An **iterator** is the object that supplies values one at a time. A **generator** is a convenient kind of iterator, usually created by a function that uses `yield`. It pauses between values instead of building the whole result list first.

## Step by step

### Get an iterator from a list

Call `iter()` on an iterable to get an iterator. A list can be iterated over, and each iterator remembers where its next value is.

```python run
colors = ["coral", "teal", "plum"]
color_iterator = iter(colors)
print(next(color_iterator))
print(next(color_iterator))
```

```output
coral
teal
```

The first `next()` returns the first list item and advances the iterator. The second call continues from the new position. The list itself can be iterated again, but this iterator has already advanced.

### Exhaust an iterator

An iterator signals that it has no more values by raising `StopIteration`. A `for` loop handles this signal for you, so normal loops do not show the exception.

```python run
values = iter([6, 9])
print(next(values))
print(next(values))
try:
    next(values)
except StopIteration:
    print("No more values")
```

```output
6
9
No more values
```

The third request occurs after both values were produced. We catch `StopIteration` here to demonstrate exhaustion. Usually, write `for value in values:` instead of manually calling `next()`.

### See that an iterator is consumed

An iterator is one-pass: each requested item is used up. If you need to traverse the values again, create a new iterator from the original iterable.

```python run
letters = iter("Mia")
print(list(letters))
print(list(letters))
```

```output
['M', 'i', 'a']
[]
```

The first `list()` asks for every remaining item. The iterator is then exhausted, so the second list is empty. The original string is an iterable and can create a fresh iterator when needed.

### Write a generator function

A function containing `yield` produces a generator. Each time a caller requests the next value, Python runs until the next `yield`, returns that value, and pauses the function.

```python run
def practice_rounds(count):
    for round_number in range(1, count + 1):
        yield f"Round {round_number}"

for round_name in practice_rounds(3):
    print(round_name)
```

```output
Round 1
Round 2
Round 3
```

Calling `practice_rounds(3)` does not immediately build a list of three strings. The `for` loop requests one value at a time, and the generator resumes after each `yield`.

### Compare `yield` and `return`

`return` ends a function call and gives back one result. `yield` provides a value but pauses the generator so it can continue later.

```python run
def countdown_words():
    yield "three"
    yield "two"
    yield "one"

print(list(countdown_words()))
```

```output
['three', 'two', 'one']
```

The generator pauses at each yield and resumes from the next statement. After its final yield, it finishes. Collecting it into a list is useful for a small demonstration, but you can also process each value directly.

### Generate values from a calculation

Generators can calculate a new value each time the next one is requested. This example creates a series of squared numbers without saving them in a separate list first.

```python run
def square_steps(limit):
    for number in range(1, limit + 1):
        yield number ** 2

for square in square_steps(4):
    print(square)
```

```output
1
4
9
16
```

The loop asks for each square in order. The generator only needs to remember its current number rather than store all results at once.

### Use a generator expression

A generator expression resembles a list comprehension but uses parentheses. It produces values lazily as the caller requests them.

```python run
prices = [12, 18, 25]
with_tax = (price * 1.05 for price in prices)
print(round(next(with_tax), 2))
print(round(next(with_tax), 2))
```

```output
12.6
18.9
```

The expression calculates the next price only when `next()` asks for it. A list comprehension would calculate and store every result immediately. Choose the form that matches whether you need all results at once or a stream of results.

### Process a large-looking sequence one item at a time

A generator can describe a long sequence without constructing a huge list. This example only asks for the first three values from a much larger range.

```python run
def even_numbers():
    number = 0
    while True:
        yield number
        number += 2

stream = even_numbers()
for _ in range(3):
    print(next(stream))
```

```output
0
2
4
```

The generator could continue producing values, but the loop requests only three. Infinite generators must be consumed with a stopping condition; converting one directly to a list would never finish.

### Pass generator values into a function

Many built-ins accept any iterable, including a generator. This can avoid making a temporary list when you only need a final summary.

```python run
def points_by_round():
    for round_number in range(1, 5):
        yield round_number * 3

print(sum(points_by_round()))
```

```output
30
```

`sum()` requests each generated number, adds it, and continues until the generator is exhausted. The function does not need to return a complete list.

### Use `yield from` to delegate values

`yield from` lets one generator produce values from another iterable. It can make a generator that combines several sequences concise.

```python run
def warmup_and_main():
    yield from ["stretch", "jog"]
    yield from ["sprint", "cool down"]

print(list(warmup_and_main()))
```

```output
['stretch', 'jog', 'sprint', 'cool down']
```

The generator delegates iteration to each list in order. It produces each item before moving to the next iterable. For simple cases, a loop can be equally clear; use `yield from` when delegation makes the structure easier to read.

### Return early from a generator

Use `return` to stop a generator when there are no more values. Previously yielded values remain available, and a later request signals that the generator has finished.

```python run
def prices_until_limit(prices, limit):
    for price in prices:
        if price > limit:
            return
        yield price

print(list(prices_until_limit([4, 7, 13, 8], 10)))
```

```output
[4, 7]
```

As soon as the price exceeds ten, the generator returns and produces no further values. This example assumes the values are ordered so that stopping at the first high price is appropriate.

## What Python is doing behind the scenes

An iterator implements the protocol used by `iter()` and `next()`. It returns itself from `iter(iterator)` and produces one value for each call to `next()`. When it has no more values, it raises `StopIteration`. A `for` loop repeatedly calls for the next item and stops cleanly when it receives that signal.

A generator function returns a generator object instead of running its full body immediately. Each time the generator yields, Python remembers its local variables and the point where execution paused. The next request resumes there. Once the function returns or reaches its end, the generator is exhausted.

| Request | Generator action |
|---|---|
| `iter(items)` | Gets an iterator from an iterable |
| `next(iterator)` | Requests the next value |
| `yield value` | Sends a value and pauses execution |
| next request after `yield` | Resumes after that yield |
| end of generator | Signals exhaustion with `StopIteration` |

Lazy generation can reduce memory when values are large or numerous and can make pipelines easier to compose. It does not guarantee a program is faster. If you need repeated access or indexing, a list may be a better choice. Async iteration is a separate topic and is covered in **async and await basics**.

## Common mistakes

### Reusing an exhausted iterator

After an iterator has produced all its values, it stays exhausted. Create a fresh iterator from the original iterable when you need another pass.

### Calling `next()` without handling the end

An extra `next()` on an exhausted iterator raises `StopIteration`. Use a `for` loop for ordinary iteration, or catch the signal when demonstrating manual iteration.

### Forgetting that a generator has not run yet

Calling a generator function creates a generator object but does not execute its body to completion. The body runs as values are requested. If nothing consumes the generator, its yielded values are never produced.

### Converting an infinite generator to a list

A generator that can produce values forever has no natural exhaustion point. Request a limited number of values or include a stopping rule before collecting its output.

### Choosing a generator when you need random access

Generators do not support list-style indexing or repeated traversal. Use a list when you need to revisit, sort, or access values by position.

## Cheat sheet

| Need | Pattern |
|---|---|
| Get an iterator | `iterator = iter(iterable)` |
| Request one value | `next(iterator)` |
| Define a generator | `yield value` inside a function |
| Produce values lazily | `(expression for item in items)` |
| Loop until exhausted | `for item in iterator:` |
| Delegate a sequence | `yield from iterable` |
| Repeat traversal | Create a new iterator from the original iterable |

## Try it yourself

### Easy: yield three team names

Write a generator that yields three strings and print them in a loop.

```python run
# Complete the yield three team names task.
# Sample data: team_names = ["Falcons", "Tigers", "Owls"]
# Write your code below and print the result
```


:::solution
Each `yield` makes one name available. The for loop requests each name until the generator ends.

```python
def teams():
    yield "Falcons"
    yield "Tigers"
    yield "Owls"

for team in teams():
    print(team)
```
:::

### Medium: generate doubled values

Use a generator expression to double each value and print the values as a list.

```python run
# Complete the generate doubled values task.
# Sample data: numbers = [3, 5, 8]
# Write your code below and print the result
```


:::solution
The generator expression calculates each doubled number when `list()` requests the next value.

```python
numbers = [3, 5, 8]
doubled = (number * 2 for number in numbers)
print(list(doubled))
```
:::

### Challenge: make a running sequence

Create a generator that yields the first four multiples of seven.

```python run
# Complete the make a running sequence task.
# Sample data: first_multiple = 7, count = 4
# Write your code below and print the result
```


:::solution
The loop computes one multiple per iteration and yields it. `list()` collects the four generated values for this small example.

```python
def multiples_of_seven():
    for multiplier in range(1, 5):
        yield multiplier * 7

print(list(multiples_of_seven()))
```
:::

## Recap

- An iterable can provide an iterator, and an iterator yields one value per request.
- Iterators are consumed; a fresh iterator is needed for another pass.
- Generator functions use `yield` to pause and resume while producing values.
- Generators can save memory when data is processed one item at a time.
- Use a list when you need indexing or repeated access to the complete collection.

Reference: Python documentation, Iterators
