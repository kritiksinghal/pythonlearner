---
title: "Sorting, zip and enumerate"
curriculumTitle: "Sorting, zip and enumerate"
track: "Python from zero"
module: "M4 Collections"
order: 20
level: "Beginner"
summary: "Sort values for a useful order, pair related sequences with zip(), and count items with enumerate()."
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
learningGoals:
  - "Sort a list with sorted() or its in-place sort() method."
  - "Control sorting with reverse and key arguments."
  - "Pair related items with zip() and understand how it handles unequal lengths."
  - "Use enumerate() to loop over an item and its counter together."
  - "Choose a start value for a human-friendly counter without changing list indexes."
relatedProblems: []
---

## What you will learn

- How `sorted()` returns a new sorted list and `.sort()` rearranges a list in place.
- How the `reverse` option and a **key function** change the order Python uses.
- How `zip()` pairs values from two or more iterables and stops at the shortest one.
- How `enumerate()` pairs each item with a counter while a loop runs.
- How to choose between a numbered loop with `range()` and the clearer `enumerate()` pattern.

## Why this matters

Data is often easier to use after arranging it. A music app may list songs by title, a cricket scoreboard may rank players by runs, and a store may sort products from cheapest to most expensive. Python's sorting tools let you describe the order you want instead of manually moving values.

Other times, data arrives in parallel collections. A class may have a list of student names and another list of marks. `zip()` can bring matching positions together, and `enumerate()` can attach a counter to each item. These tools make many loops shorter and reduce bookkeeping mistakes.

## The big idea

Imagine you have cards with names and separate cards with scores. Sorting puts cards into an order; pairing joins corresponding name and score cards; enumeration writes a running number next to each card. In Python, `sorted()`, `zip()`, and `enumerate()` describe those jobs directly.

`sorted(values)` produces a new list in ascending order and leaves the original collection alone. A list's `.sort()` method changes that list itself and returns `None`. Both accept options such as `reverse=True` and `key=...`. The key function tells Python what part of each item to compare, such as a song's duration or a student's mark.

`zip(left, right)` produces pairs: first item with first item, second with second, and so on. It stops when the shortest input runs out. `enumerate(items)` produces a counter and item pair for each item. By default the counter starts at zero; `start=1` changes the displayed counter without changing the indexes used by lists.

## Step by step

### 1. Create a sorted copy with `sorted()`

Use `sorted()` when you want an ordered result but need the original sequence to remain as it was.

```python run
race_times = [74, 68, 81, 70]
fastest_first_values = sorted(race_times)
print("Original:", race_times)
print("Sorted:", fastest_first_values)
```

```output
Original: [74, 68, 81, 70]
Sorted: [68, 70, 74, 81]
```

The function reads the values and returns a new list in ascending numeric order. The original remains unchanged, which is why both print statements show different orders.

### 2. Sort a list in place

If changing the original list is what you want, call `.sort()`. It rearranges the list and returns `None`, so do not assign its return value to the list variable.

```python run
weekly_sales = [320, 180, 450, 275]
weekly_sales.sort()
print(weekly_sales)
```

```output
[180, 275, 320, 450]
```

The method sorts the existing list from low to high. There is no second sorted list created for the result variable; the `weekly_sales` list itself now has a new order.

### 3. Sort in descending order

Pass `reverse=True` to either `sorted()` or `.sort()` when you want the reverse of the normal ascending order.

```python run
scores = [42, 88, 71, 95]
leaderboard = sorted(scores, reverse=True)
print(leaderboard)
```

```output
[95, 88, 71, 42]
```

The `reverse` option changes the order of the sorted result. It does not mean “reverse the original list without sorting”; the values are first ordered and then presented in descending order.

### 4. Sort text alphabetically

Strings can be sorted too. Python compares strings using their character order. For ordinary lowercase names, this gives an alphabetical-looking order.

```python run
artists = ["Ritviz", "Asha Bhosle", "Prateek Kuhad"]
print(sorted(artists))
```

```output
['Asha Bhosle', 'Prateek Kuhad', 'Ritviz']
```

`sorted()` returns a new list of strings in their natural comparison order. If you need custom rules for capitalization, choose a key such as `str.lower`; do not assume every language's alphabetic rules are identical.

Sorting strings is useful for a directory of people, songs, or places, but you should decide whether capitalization should affect the result. In ordinary string comparison, uppercase and lowercase letters are not treated as identical. A case-insensitive key gives Python a normalized comparison value while leaving each original string unchanged in the returned list. That can make a mixed-case list feel more natural to a reader. The same idea applies to other comparisons: the key can be a simple function that extracts or transforms the field you want to use for ordering. The key decides the position; it does not rewrite the item.

```python run
artists = ["ritviz", "Asha Bhosle", "prateek kuhad"]
print(sorted(artists, key=str.lower))
```

```output
['Asha Bhosle', 'prateek kuhad', 'ritviz']
```

`str.lower` produces lowercase text for comparisons. The result still shows the original capitalization stored in each artist name.

### 5. Sort records by a key

The `key` argument accepts a function that computes a comparison value for each item. This example sorts music tracks by their duration, not by their full tuple contents.

```python run
tracks = [("Monsoon", 214), ("Paper Boat", 186), ("Night Bus", 241)]
by_duration = sorted(tracks, key=lambda track: track[1])
print(by_duration)
```

```output
[('Paper Boat', 186), ('Monsoon', 214), ('Night Bus', 241)]
```

Each `track` is a pair. The key expression selects element 1, the duration in seconds. Python compares those numbers to decide the order, while the output still contains each complete track pair.

The `lambda` expression here is a short function. Functions are covered in “Defining functions”; this use is only to explain what `key` receives. You can also pass a named function as the key when the sorting rule needs more explanation.

### 6. Pair parallel lists with `zip()`

Give `zip()` two iterables to get pairs from corresponding positions. A `for` loop can unpack each pair into separate names.

```python run
players = ["Mina", "Arif", "Tanu"]
runs = [38, 52, 27]
for player, score in zip(players, runs):
    print(f"{player}: {score} runs")
```

```output
Mina: 38 runs
Arif: 52 runs
Tanu: 27 runs
```

The first name pairs with the first score, the second with the second, and the third with the third. `zip()` is useful when the same position in each sequence describes one record.

If the iterables have different lengths, ordinary `zip()` stops at the shortest. It does not invent a value for missing entries. Keep related lists aligned, or handle missing values deliberately before pairing them.

### 7. Use `enumerate()` for a counter and item

`enumerate()` adds a counter to each item as a loop visits it. Its default starting number is zero.

```python run
setlist = ["Opening Light", "Silver Rain", "Home Again"]
for position, song in enumerate(setlist):
    print(position, song)
```

```output
0 Opening Light
1 Silver Rain
2 Home Again
```

The first name in the loop receives the counter and the second receives the current item. This avoids creating a separate number variable and manually increasing it each time.

### 8. Start the display counter at one

Pass `start=1` when a person-facing list should be numbered from one. This changes the counter produced by `enumerate`, not the underlying positions in the list.

```python run
tasks = ["water plants", "charge speaker", "pack lunch"]
for number, task in enumerate(tasks, start=1):
    print(f"{number}. {task}")
```

```output
1. water plants
2. charge speaker
3. pack lunch
```

The displayed numbers are one, two, and three, while the list's valid indexes remain zero, one, and two. `enumerate` is for iterating with a count; use an index only when you specifically need to access or modify a position.

## What Python is doing behind the scenes

For `zip()`, think of the inputs as rows that move together. Each turn takes one item from each input and makes a tuple. Once any input ends, there is no complete pair left, so iteration stops. For `enumerate()`, each turn combines the current count with the next item, then advances the count.

| Turn | `enumerate(["Mina", "Arif"], start=1)` | Pair from `zip(["Mina", "Arif"], [38, 52])` |
| --- | --- | --- |
| 1 | `(1, "Mina")` | `("Mina", 38)` |
| 2 | `(2, "Arif")` | `("Arif", 52)` |
| Next | no item remains | no item remains |

Sorted order is decided using values or keys. With a key function, Python calculates a comparison key for each item and arranges the original items according to those keys. The key value is not substituted into the final list.

## Common mistakes

### 1. Assigning the return value of `.sort()`

Broken code:

```python
durations = [210, 185, 240]
ordered = sorted(durations, key=len)
```

Python reports `TypeError: object of type 'int' has no len()`. The key function `len` works for values with a length, such as strings, but these durations are integers. Use `sorted(durations)` to sort them numerically.

### 2. Expecting `zip()` to keep extra items from the longer list

Broken code:

```python
pairs = list(zip(["Asha", "Mina"], [40]))
print(pairs[1])
```

Python reports `IndexError: list index out of range`. `zip()` stops when the scores list ends, so the result has one pair. Check the input lengths or process only the pairs that exist.

### 3. Unpacking too many items from a zipped pair

Broken code:

```python
for name, score, grade in zip(["Ira"], [92]):
    print(name, score, grade)
```

Python reports `ValueError: not enough values to unpack (expected 3, got 2)`. There are two iterables, so each pair has two values. Match the loop names to the values zipped together.

### 4. Assuming an `enumerate()` counter is a list index

Broken code:

```python
names = ["Ira", "Maya"]
for number, name in enumerate(names, start=1):
    print(names[number])
```

Python reports `IndexError: list index out of range` on the second pass, because the display counter reaches 2 while the last valid index is 1. Print `name` directly, or use the default zero-based counter when an index is truly needed.

## Cheat sheet

| Goal | Example | Effect |
| --- | --- | --- |
| Get a sorted copy | `sorted(values)` | Returns a new ascending list. |
| Sort a list itself | `values.sort()` | Changes the list and returns `None`. |
| Descending order | `sorted(values, reverse=True)` | Returns a reverse-sorted list. |
| Sort by a field | `sorted(rows, key=pick_field)` | Compares each row by the key result. |
| Pair collections | `zip(names, scores)` | Pairs same-position values; stops at shortest. |
| Count items | `enumerate(names)` | Produces `(0, item)`, `(1, item)`, ... |
| Start from one | `enumerate(names, start=1)` | Produces person-friendly numbering. |

## Try it yourself

### Easy: Sort temperatures

Use `sorted()` to make a new list of temperatures from lowest to highest.

```python run
# Try the exercise above using this sample data.
# Sample data: temperatures = [31, 24, 29, 27]
# Write your code below and print the result
```

:::solution

```python
temperatures = [31, 24, 29, 27]
print(sorted(temperatures))
```

:::

### Medium: Pair teams and scores

Use `zip()` to print each team's name next to its score.

```python run
# Try the exercise above using this sample data.
# Sample data: teams = ["Falcons", "Tigers", "Comets"]
# Write your code below and print the result
```

:::solution

```python
teams = ["Falcons", "Tigers", "Comets"]
scores = [82, 76, 91]
for team, score in zip(teams, scores):
    print(f"{team}: {score}")
```

:::

### Challenge: Number a playlist

Use `enumerate()` to print each track with a number starting at one.

```python run
# Try the exercise above using this sample data.
# Sample data: playlist = ["Dawn Drive", "Blue Kite", "Last Train"]
# Write your code below and print the result
```

:::solution

```python
playlist = ["Dawn Drive", "Blue Kite", "Last Train"]
for number, track in enumerate(playlist, start=1):
    print(f"{number}. {track}")
```

:::

## Recap

- `sorted()` creates a sorted list; `.sort()` changes a list in place and returns `None`.
- Use `reverse=True` for descending order and `key` to sort by a chosen property.
- `zip()` combines matching positions and stops when the shortest iterable ends.
- `enumerate()` provides a counter and item; its counter starts at zero unless you change it.
- Choose `enumerate` for a loop counter and use sorted output when you need a particular order.

Reference: Python documentation, Sorting Techniques
