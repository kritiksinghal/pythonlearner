---
title: "Lists"
curriculumTitle: "Lists"
track: "Python from zero"
module: "M4 Collections"
order: 14
level: "Beginner"
summary: "Store, access, and manipulate ordered sequences of mutable data using Python lists: append, insert, remove, copy, and analyze collections."
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
learningGoals:
  - "Construct ordered, mutable data collections using square bracket list syntax `[...]`."
  - "Differentiate between immutable sequence types like strings and fully mutable lists."
  - "Add, modify, and delete list items using `.append()`, `.insert()`, `.pop()`, and `.remove()`."
  - "Avoid unintended aliasing bugs by creating independent shallow copies with `.copy()`."
relatedProblems: []
---

## What you will learn

- How to declare and initialize Python **lists** using comma-separated elements inside square brackets `[...]`.
- The fundamental concept of **mutability**: why lists can be modified in-place whereas strings cannot.
- How to access and reassign list elements using zero-based index positions.
- Adding elements to collections using `.append()`, `.insert()`, and `.extend()`.
- Removing elements using `.pop()`, `.remove()`, `del`, and `.clear()`.
- Analyzing numeric lists using built-in statistical functions like `sum()`, `min()`, `max()`, and `len()`.
- Searching lists and testing membership with the `in` operator and `.count()`.
- The critical distinction between variable aliasing (referencing the same list) and shallow copying (creating an independent duplicate with `.copy()`).

## Why this matters

In beginner programming, storing every single value in its own named variable (like `score1`, `score2`, `score3`) quickly becomes impossible when managing large datasets. An online marketplace cannot declare thousands of separate variables for each customer shopping cart item; a weather station cannot create 365 distinct variables for daily temperature readings; and a multiplayer game cannot hardcode individual variables for dozens of active players.

A **list** is Python's most versatile built-in sequence data structure. It allows you to group hundreds or millions of related objects together under a single variable name, maintain their chronological order, dynamically add or remove items as events occur, and iterate across them in loops. Virtually every software application in existence relies on list-like collections to organize memory and process real-world information.

## The big idea

Imagine an expandable physical organizer tray with numbered sliding compartments, like an architect's blueprint drawer or an artist's palette box.

Consider how this organizer functions:
1. Each compartment has an engraved numerical index starting at slot `0`.
2. Unlike a sealed wooden plaque where text is permanently carved (like an immutable string), each compartment in the drawer is open. You can pull an item out of slot `2` and replace it with a brand-new item whenever you wish.
3. If you buy a new tool, you can slide an extra compartment onto the right-hand end of the tray (`.append()`).
4. If you no longer need an item, you can remove it from its slot (`.pop()`), causing the remaining compartments to slide neatly into place.
5. You can store anything inside the compartments: numbers, words, decimal measurements, or even other nested organizer trays.

In Python, a **list** is that exact expandable organizer tray. It preserves the exact order in which you inserted items, allows you to inspect or replace items at any slot, expands or contracts dynamically as your data changes, and accepts any mix of Python data types.

## Step by step

### 1. Creating lists and in-place item reassignment

Lists are created using square brackets `[...]` with elements separated by commas. Unlike strings, lists are **mutable**, meaning you can overwrite existing elements directly.

```python run
fruits = ["apple", "banana", "cherry"]
print("Initial list:", fruits)
fruits.append("mango")
print("After append:", fruits)
fruits[0] = "avocado"
print("After index replacement:", fruits)
```

```output
Initial list: ['apple', 'banana', 'cherry']
After append: ['apple', 'banana', 'cherry', 'mango']
After index replacement: ['avocado', 'banana', 'cherry', 'mango']
```

In line 1, a three-item list of strings is created. Line 3 uses `.append("mango")` to add an item to the end. Line 5 reassigns the element at index `0` from `'apple'` to `'avocado'`, modifying the list directly in memory.

### 2. Statistical analysis on numeric collections

When lists hold numbers, Python provides built-in aggregation functions: `sum()`, `min()`, `max()`, and `len()`.

```python run
scores = [88, 92, 79, 95, 84]
total = sum(scores)
average = total / len(scores)
print("Highest score:", max(scores))
print("Lowest score:", min(scores))
print(f"Class average: {average:.1f}")
```

```output
Highest score: 95
Lowest score: 79
Class average: 87.6
```

`max(scores)` extracts the highest value (`95`), while `min(scores)` finds the lowest (`79`). Dividing `sum(scores)` by `len(scores)` calculates the arithmetic mean (`87.6`).

### 3. Inserting and popping elements

While `.append()` adds items to the tail end, `.insert(index, item)` places an item at any specified zero-based index, shifting existing items to the right. The `.pop()` method removes and returns the last item (or an item at a specified index).

```python run
playlist = ["Song A", "Song B", "Song C"]
playlist.insert(1, "Bonus Track")
print("After insert at index 1:", playlist)
popped_song = playlist.pop()
print("Popped song from end:", popped_song)
print("Remaining playlist:", playlist)
```

```output
After insert at index 1: ['Song A', 'Bonus Track', 'Song B', 'Song C']
Popped song from end: Song C
Remaining playlist: ['Song A', 'Bonus Track', 'Song B']
```

In line 2, `'Bonus Track'` is inserted at index 1, shifting `'Song B'` to index 2. In line 4, `.pop()` removes and returns `'Song C'` from the tail.

### 4. Searching, counting, and removing by value

To remove an item by its value rather than its index position, use `.remove(value)`. To count how many times an element appears, call `.count(value)`. To check whether an item exists without raising an error, use the `in` membership operator.

```python run
cart = ["notebook", "pen", "eraser", "pen"]
print("Count of pen:", cart.count("pen"))
cart.remove("pen")
print("After removing first pen:", cart)
print("Is eraser in cart:", "eraser" in cart)
```

```output
Count of pen: 2
After removing first pen: ['notebook', 'eraser', 'pen']
Is eraser in cart: True
```

`cart.count("pen")` reports that `'pen'` appears twice. Calling `cart.remove("pen")` removes only the *first* occurrence of `'pen'`. Testing `"eraser" in cart` returns `True`.

### 5. List concatenation and repetition

Like strings, lists support the concatenation operator `+` (combining two lists into a new list) and the repetition operator `*` (repeating items multiple times).

```python run
list_a = [1, 2, 3]
list_b = [4, 5]
combined = list_a + list_b
repeated = list_b * 3
print("Concatenated list:", combined)
print("Repeated list:", repeated)
```

```output
Concatenated list: [1, 2, 3, 4, 5]
Repeated list: [4, 5, 4, 5, 4, 5]
```

`list_a + list_b` produces a new 5-element list without altering either original list. `list_b * 3` produces `[4, 5, 4, 5, 4, 5]`.

### 6. Aliasing versus shallow copying (`.copy()`)

In Python, assigning a list variable to another variable (`b = a`) does **not** copy the list. It creates an **alias**—two names pointing to the exact same list object in memory! To create an independent duplicate, you must call `.copy()`.

```python run
original = [10, 20, 30]
alias = original
clone = original.copy()
alias.append(40)
print("Original (modified via alias):", original)
print("Clone (independent copy):", clone)
```

```output
Original (modified via alias): [10, 20, 30, 40]
Clone (independent copy): [10, 20, 30]
```

Because `alias` points to `original`, modifying `alias` directly alters `original`. Meanwhile, `clone` was created with `.copy()`, remaining completely untouched at `[10, 20, 30]`.

### 7. Reversing list order in-place

The `.reverse()` method reverses the elements of a list in-place without returning a new list.

```python run
lineup = ["Rohit", "Virat", "Surya", "Hardik"]
lineup.reverse()
print("Reversed batting lineup:", lineup)
```

```output
Reversed batting lineup: ['Hardik', 'Surya', 'Virat', 'Rohit']
```

The list is reordered in-place so that the last element becomes the first element.

### 8. Extending lists with `.extend()`

When you want to append all elements of an iterable into an existing list in-place (without creating a new list with `+`), use `.extend()`.

```python run
numbers = [1, 2, 3]
numbers.extend([4, 5, 6])
print("After extend with list:", numbers)
```

```output
After extend with list: [1, 2, 3, 4, 5, 6]
```

Unlike `.append([4, 5, 6])` which would add the entire list as a single nested element (`[1, 2, 3, [4, 5, 6]]`), `.extend()` unpacks each item and appends them individually.

## What Python is doing behind the scenes

Under the hood, CPython implements lists as the **`PyListObject`** structure, which is a dynamic over-allocated array of pointers:

| Operation | CPython Implementation | Time Complexity | Notes |
| :--- | :--- | :--- | :--- |
| **Index lookup `items[i]`** | Direct pointer offset calculation | $O(1)$ constant time | Instantaneous access regardless of list size |
| **Append `.append(x)`** | Over-allocated array slot fill | $O(1)$ amortized | CPython resizes array by ~12.5% when full |
| **Pop from end `.pop()`** | Decrements length counter | $O(1)$ constant time | Extremely fast; no element shifting needed |
| **Insert `.insert(0, x)`** | Shifts all elements one slot right | $O(N)$ linear time | Slower for large lists (use `collections.deque`) |
| **Delete `.remove(x)`** | Linear search followed by shift | $O(N)$ linear time | Must find item, then shift trailing items left |

Because CPython over-allocates internal memory capacity (for instance, allocating space for 8 items when you create a list of 4), appending elements does not require reallocating memory on every single call.

## Common mistakes

### 1. `IndexError: list index out of range`

Attempting to access an index that does not exist in the list raises an immediate `IndexError`. Remember that for a list of length $N$, valid positive indices run from `0` to $N - 1$.

Broken code:
```python
colors = ["red", "green", "blue"]
print(colors[3])  # Length is 3, valid indices are 0, 1, 2!
```

Real error message:
```output
IndexError: list index out of range
```

How to fix it: ensure indices stay strictly within the bounds of `len(list)`:
```python run
colors = ["red", "green", "blue"]
last_color = colors[-1]  # Safely access the last element
print("Safely retrieved last color:", last_color)
```

```output
Safely retrieved last color: blue
```

### 2. Calling `.remove()` on a value that does not exist

Unlike `.pop()` which takes an index, `.remove(val)` searches for a matching value. If that value is absent from the list, Python raises a `ValueError`.

Broken code:
```python
fruits = ["apple", "banana"]
fruits.remove("orange")
```

Real error message:
```output
ValueError: list.remove(x): x not in list
```

How to fix it: verify membership with `in` before calling `.remove()`:
```python run
fruits = ["apple", "banana"]
target = "orange"
if target in fruits:
    fruits.remove(target)
else:
    print(f"'{target}' is not in the list, skipping removal.")
```

```output
'orange' is not in the list, skipping removal.
```

### 3. Modifying a list while iterating across it

Removing or inserting elements in a list while looping over that same list causes Python's internal index tracking to skip elements or repeat iterations.

How to fix it: iterate over a copy of the list (`for item in my_list.copy():`) or use a list comprehension (covered in the upcoming comprehensions lesson).

## Cheat sheet

| Operation / Method | Code Syntax | Effect on List |
| :--- | :--- | :--- |
| **Create empty** | `items = []` | Creates empty list |
| **Create populated** | `items = [1, 2, 3]` | Creates list with items |
| **Access index** | `first = items[0]` | Reads zero-based element |
| **Modify index** | `items[0] = 99` | Overwrites element in-place |
| **Append tail** | `items.append(4)` | Adds item to end |
| **Insert position** | `items.insert(1, 10)` | Inserts item at index 1 |
| **Remove by value** | `items.remove(2)` | Removes first matching value |
| **Pop by index** | `x = items.pop()` | Removes and returns item |
| **Extend multiple** | `items.extend([5, 6])` | Unpacks and appends iterable |
| **Count instances** | `k = items.count(1)` | Counts occurrences |
| **Test presence** | `3 in items` | Returns `True` if present |
| **Clone list** | `clone = items.copy()` | Creates independent duplicate |

## Try it yourself

### Exercise 1 (easy): Shopping inventory manager

Create a list named `cart = ["milk", "bread", "eggs"]`. Perform the following sequence of operations: append `"butter"` to the cart, remove `"bread"` using `.remove()`, insert `"apples"` at index `0`, and print the final contents of the cart.

```python run
cart = ["milk", "bread", "eggs"]
cart.append("butter")
cart.remove("bread")
cart.insert(0, "apples")
print("Updated shopping cart:", cart)
```

:::solution Solution
Execute the methods in sequence and print the modified list:

```python run
cart = ["milk", "bread", "eggs"]
cart.append("butter")
cart.remove("bread")
cart.insert(0, "apples")
print("Updated shopping cart:", cart)
```
:::

### Exercise 2 (medium): Examination score analyzer

Given a list of student exam marks `marks = [72, 85, 91, 64, 78, 88]`, calculate and print the highest score, the lowest score, the total sum of all marks, and the class average rounded to two decimal places.

```python run
marks = [72, 85, 91, 64, 78, 88]
highest = max(marks)
lowest = min(marks)
total_marks = sum(marks)
average = total_marks / len(marks)
print("Highest mark:", highest)
print("Lowest mark:", lowest)
print("Total marks:", total_marks)
print(f"Class average: {average:.2f}")
```

:::solution Solution
Use `max()`, `min()`, `sum()`, and `len()` to compute the metrics:

```python run
marks = [72, 85, 91, 64, 78, 88]
highest = max(marks)
lowest = min(marks)
total_marks = sum(marks)
average = total_marks / len(marks)
print("Highest mark:", highest)
print("Lowest mark:", lowest)
print("Total marks:", total_marks)
print(f"Class average: {average:.2f}")
```
:::

### Exercise 3 (challenge): Customer service queue simulator

Simulate an airport check-in desk service queue. Initialize `queue = ["Passenger 1", "Passenger 2", "Passenger 3"]`. Add two new arrivals (`"Passenger 4"` and `"Passenger 5"`) using `.append()`. Then, simulate serving the first two passengers in order by calling `.pop(0)` twice, printing each passenger as they are served. Finally, display the remaining queue.

```python run
queue = ["Passenger 1", "Passenger 2", "Passenger 3"]
queue.append("Passenger 4")
queue.append("Passenger 5")
served1 = queue.pop(0)
served2 = queue.pop(0)
print("Served:", served1)
print("Served:", served2)
print("Remaining in queue:", queue)
```

:::solution Solution
Append new passengers, call `queue.pop(0)` to process the front of the line, and print the remaining list:

```python run
queue = ["Passenger 1", "Passenger 2", "Passenger 3"]
queue.append("Passenger 4")
queue.append("Passenger 5")
served1 = queue.pop(0)
served2 = queue.pop(0)
print("Served:", served1)
print("Served:", served2)
print("Remaining in queue:", queue)
```
:::

## Recap

- Lists are ordered, **mutable** collections of items enclosed in square brackets `[...]`.
- List elements are accessed using zero-based indices and can be modified in-place.
- Use `.append()` to add items to the tail, and `.insert()` to place items at specific indices.
- Use `.pop()` to remove by index and `.remove()` to remove by value.
- Mathematical helpers `sum()`, `min()`, and `max()` operate directly on numeric lists.
- Avoid the aliasing trap by calling `.copy()` to create independent duplicates.

Reference: Python documentation, Lists
