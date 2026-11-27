---
title: "Indexing and slicing"
curriculumTitle: "Indexing and slicing"
track: "Python from zero"
module: "M4 Collections"
order: 15
level: "Beginner"
summary: "Extract individual items and contiguous sub-sequences using Python indexing and slice notation [start:stop:step], with positive, negative, and inverted strides."
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
learningGoals:
  - "Retrieve single items using positive zero-based indices and negative tail-relative indices."
  - "Extract sub-sequences using Python's three-part slice notation `[start:stop:step]`."
  - "Invert sequence order concisely using negative stride slicing `[::-1]`."
  - "Perform slice assignment to insert, replace, and delete multi-element sub-ranges in mutable lists."
relatedProblems: []
---
## What you will learn

- How Python uses zero-based numbering for positive indices starting at the front of a sequence.
- How **negative indexing** provides intuitive, instant access to items relative to the tail end (`-1` for the last item).
- The syntax and semantics of the slicing operator: `sequence[start:stop:step]`.
- Why the `stop` boundary is strictly exclusive (up to, but not including, `stop`).
- Omitting default slice boundaries (`[:stop]`, `[start:]`, and `[:]` for full shallow cloning).
- Reversing strings and lists in a single, idiomatic expression using `[::-1]`.
- Modifying, inserting, and deleting sub-ranges of mutable lists using **slice assignment**.
- Why indexing out-of-bounds raises an `IndexError`, whereas slicing out-of-bounds clamps gracefully without errors.

## Why this matters

Data in real-world software rarely arrives in bite-sized, ready-to-use fragments. Instead, data arrives in structured blocks that must be dissected. A web application receives an ISO-8601 timestamp like `"2026-11-24T15:30:00Z"` and must extract the four-digit year, two-digit month, and two-digit day. A pagination system displays items ten through twenty from a search query of five hundred results. A video editing tool extracts a sub-clip between two second markers. A text processing system reads file extensions, validates credit card suffixes, or reverses string characters to verify palindromes.

Without slicing, extracting a portion of a sequence would require writing manual `for` loops, creating temporary storage variables, and managing index counters. Python's slicing notation is one of the most expressive, elegant, and powerful syntax features in modern programming, allowing you to manipulate and reconfigure complex sequential data in a single readable line.

## The big idea

Imagine a long wooden carpenter's measuring tape placed across a shelf of five books. 

Notice how you can locate items on this shelf:
1. **The Book Slots (Indices)**: If you point directly at compartment number `0`, you select Book #1. If you stand at the right-hand wall and reach backward by one book, you are at position `-1` (Book #5). If you reach backward by two books, you are at `-2` (Book #4).
2. **The Cutting Marks (Slices)**: Imagine holding a pair of shears to slice out a section of the shelf. You do not cut directly through the middle of books; you cut along the vertical boundary lines between compartments. If you cut from boundary line `1` to boundary line `3`, you extract the two books sitting between those marks (Book #2 and Book #3).
3. **The Stride (Step)**: If an instructor asks you to inspect every second book starting from the left wall, you step forward by two compartments at a time (`step = 2`), inspecting Book #1, Book #3, and Book #5 while skipping the others.

In Python, **indexing** picks a single item out of a slot, while **slicing** cuts out an entire continuous sub-range of items between two boundary marks.

## Step by step

### 1. Zero-based and negative indexing

Every ordered sequence in Python (strings, lists, tuples) supports both positive indices (counting forward from `0`) and negative indices (counting backward from `-1`).

```python run
runners = ["Alice", "Bob", "Charlie", "David", "Emma"]
print("Gold medal (index 0):", runners[0])
print("Bronze medal (index 2):", runners[2])
print("Last finisher (index -1):", runners[-1])
print("Second to last (index -2):", runners[-2])
```

```output
Gold medal (index 0): Alice
Bronze medal (index 2): Charlie
Last finisher (index -1): Emma
Second to last (index -2): David
```

Index `0` retrieves the first element (`'Alice'`). Index `2` retrieves the third element (`'Charlie'`). Negative index `-1` retrieves the final element (`'Emma'`) without requiring you to calculate `len(runners) - 1`.

### 2. Basic slicing: `[start:stop]`

The slice syntax `sequence[start:stop]` extracts items beginning at index `start` up to, but not including, index `stop`. The number of items extracted is always equal to `stop - start`.

```python run
digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
print("First three (digits[:3]):", digits[:3])
print("Middle slice (digits[3:7]):", digits[3:7])
print("From index 7 to end (digits[7:]):", digits[7:])
```

```output
First three (digits[:3]): [0, 1, 2]
Middle slice (digits[3:7]): [3, 4, 5, 6]
From index 7 to end (digits[7:]): [7, 8, 9]
```

`digits[:3]` omits `start`, defaulting to `0` (yielding indices 0, 1, 2). `digits[3:7]` extracts indices 3, 4, 5, 6 ($7 - 3 = 4$ items). `digits[7:]` omits `stop`, extracting all items from index 7 to the end.

### 3. Strides and steps: `[start:stop:step]`

The optional third parameter `step` dictates how many positions Python advances between selected items.

```python run
numbers = [10, 20, 30, 40, 50, 60, 70, 80]
print("Every second item (::2):", numbers[::2])
print("Every third item starting at 1 (1::3):", numbers[1::3])
```

```output
Every second item (::2): [10, 30, 50, 70]
Every third item starting at 1 (1::3): [20, 50, 80]
```

`numbers[::2]` starts at index 0 and selects every second element (`10, 30, 50, 70`). `numbers[1::3]` starts at index 1 (`20`), advances by 3 to index 4 (`50`), and advances by 3 to index 7 (`80`).

### 4. Reversing sequences with `[::-1]`

Supplying a negative step of `-1` instructs Python to traverse the sequence backward from the end to the beginning.

```python run
word = "RACECAR"
reversed_word = word[::-1]
print("Original:", word)
print("Reversed:", reversed_word)
print("Is palindrome:", word == reversed_word)
```

```output
Original: RACECAR
Reversed: RACECAR
Is palindrome: True
```

`word[::-1]` reverses the string. Because `'RACECAR'` reads identically in reverse, comparing `word == reversed_word` confirms that it is a palindrome (`True`).

### 5. String slicing: extracting date components

Slicing works identically on strings, producing fresh substring copies.

```python run
date_stamp = "2026-11-24"
year = date_stamp[:4]
month = date_stamp[5:7]
day = date_stamp[8:]
print(f"Year: {year}, Month: {month}, Day: {day}")
```

```output
Year: 2026, Month: 11, Day: 24
```

`date_stamp[:4]` extracts characters 0 through 3 (`'2026'`). `date_stamp[5:7]` extracts characters 5 and 6 (`'11'`). `date_stamp[8:]` extracts characters 8 through the end (`'24'`).

### 6. Slice assignment: replacing sub-lists in-place

Because lists are mutable, you can assign an iterable to a slice range, replacing multiple elements in a single operation. The replacement sequence does not even need to be the same length as the slice being replaced!

```python run
colors = ["red", "green", "blue", "yellow", "purple"]
colors[1:3] = ["emerald", "sapphire"]
print("After slice replacement:", colors)
```

```output
After slice replacement: ['red', 'emerald', 'sapphire', 'yellow', 'purple']
```

The slice `colors[1:3]` (which held `['green', 'blue']`) is replaced in-place by `['emerald', 'sapphire']`.

### 7. Deleting slices with empty list assignment

Assigning an empty list `[]` to a slice removes those elements and shrinks the list accordingly.

```python run
items = [1, 2, 3, 4, 5]
items[1:4] = []
print("After slice deletion via empty list:", items)
```

```output
After slice deletion via empty list: [1, 5]
```

The slice `items[1:4]` (holding `2, 3, 4`) is deleted, leaving only `[1, 5]`. (You can also achieve this with `del items[1:4]`).

### 8. Boundary safety: indexing versus slicing

A crucial behavioral difference in Python is that accessing an individual out-of-bounds index raises an `IndexError`, whereas slicing out-of-bounds clamps gracefully to valid boundaries without error.

```python run
short_list = [10, 20, 30]
print("Safe slice far beyond bounds:", short_list[1:100])
print("Reverse slice far before start:", short_list[-100:2])
```

```output
Safe slice far beyond bounds: [20, 30]
Reverse slice far before start: [10, 20]
```

Even though index `100` does not exist, `short_list[1:100]` simply extracts all available elements from index 1 to the end (`[20, 30]`). This boundary safety makes slicing exceptionally robust for string parsing.

## What Python is doing behind the scenes

When you write slice syntax like `data[1:5:2]`, Python translates the bracket contents into a built-in **`slice`** object:

```python
# What you write:
data[1:5:2]

# What Python executes:
s = slice(1, 5, 2)
data.__getitem__(s)
```

| Component in Slicing Pipeline | Internal Runtime Behavior |
| :--- | :--- |
| **`slice(start, stop, step)`** | Creates a first-class slice object holding attributes `.start`, `.stop`, and `.step`. |
| **Boundary Clamping** | The C function `PySlice_GetIndicesEx` clamps start and stop indices against the sequence's actual length. |
| **Memory Allocation** | Slicing a list or string creates a **shallow copy** containing the extracted slice; it does not reference the original memory buffer. |
| **Slice Assignment** | Re-allocates the internal pointer array of `PyListObject`, moving trailing pointers left or right to accommodate size changes. |

## Common mistakes

### 1. Off-by-one errors with exclusive stop boundaries

Beginners often forget that `stop` is non-inclusive. To extract elements at indices 0, 1, 2, and 3, you must write `[:4]`, not `[:3]`.

Broken code:
```python
letters = ["a", "b", "c", "d", "e"]
# Intended to extract first 4 letters:
first_four = letters[:3]  # Only gets 3 items!
print("First four:", first_four)
```

Actual output:
```output
First four: ['a', 'b', 'c']
```

How to fix it: remember the length formula: `len(slice) = stop - start`. If you want 4 items starting from 0, stop must be 4:
```python run
letters = ["a", "b", "c", "d", "e"]
first_four = letters[:4]
print("Correctly extracted four items:", first_four)
```

```output
Correctly extracted four items: ['a', 'b', 'c', 'd']
```

### 2. Attempting slice assignment on immutable strings

Because strings are immutable, attempting to overwrite a slice on a string raises a `TypeError`.

Broken code:
```python
greeting = "Hello"
greeting[0:2] = "He"
```

Real error message:
```output
TypeError: 'str' object does not support item assignment
```

How to fix it: construct a brand-new string by concatenating the desired parts:
```python run
greeting = "Hello"
new_greeting = "Yo" + greeting[2:]
print("Reconstructed string:", new_greeting)
```

```output
Reconstructed string: Yollo
```

### 3. Confusing single indexing with 1-element slicing

Accessing an element by single index returns the element itself (e.g. An integer or string). Slicing a single element returns a 1-element sub-list!

```python run
my_list = [10, 20, 30]
single_item = my_list[0]    # Returns int: 10
single_slice = my_list[0:1] # Returns list: [10]
print("Type of single_item:", type(single_item))
print("Type of single_slice:", type(single_slice))
```

```output
Type of single_item: <class 'int'>
Type of single_slice: <class 'list'>
```

## Cheat sheet

| Slice Syntax | What It Extracts | Example with `[0,1,2,3,4,5]` |
| :--- | :--- | :--- |
| `seq[i]` | Single element at index `i` | `seq[2] -> 2` |
| `seq[-1]` | Last element | `seq[-1] -> 5` |
| `seq[a:b]` | From index `a` up to `b-1` | `seq[1:4] -> [1, 2, 3]` |
| `seq[:b]` | From start up to `b-1` | `seq[:3] -> [0, 1, 2]` |
| `seq[a:]` | From index `a` to the end | `seq[3:] -> [3, 4, 5]` |
| `seq[:]` | Full shallow clone | `seq[:] -> [0, 1, 2, 3, 4, 5]` |
| `seq[::2]` | Every second element | `seq[::2] -> [0, 2, 4]` |
| `seq[::-1]` | Complete reverse | `seq[::-1] -> [5, 4, 3, 2, 1, 0]` |
| `seq[1:3] = [9, 8]`| Replace sub-slice in mutable list | `[0, 9, 8, 3, 4, 5]` |

## Try it yourself

### Exercise 1 (easy): Phone number area code extraction

Slice `phone` into its country code, area code, and local number. Print each part with a label.


:::tip Hint
Use the lesson idea about indexing and slicing. Trace the sample values before printing so you can check each step.
:::

```sample input
phone = '+91-022-26543210'
```

```expected
Country: +91, Area: 022, Line: 26543210
```

```python run
# Complete the Exercise 1 (easy): Phone number area code extraction task.
phone = '+91-022-26543210'
# Write your code below
```


:::solution Solution
Use `phone[:3]` for country code, `phone[4:7]` for area code, and `phone[8:]` for local number:

```python run
phone = '+91-022-26543210'
phone = "+91-022-26543210"
country_code = phone[:3]
area_code = phone[4:7]
local_number = phone[8:]
print(f"Country: {country_code}, Area: {area_code}, Line: {local_number}")
```

```output
Country: +91, Area: 022, Line: 26543210
```
:::

### Exercise 2 (medium): Search result pagination

Use `laptops` and a page size of 4. Print pages 1, 2, and 3 using slices `0:4`, `4:8`, and `8:12`.


:::tip Hint
Use the lesson idea about indexing and slicing. Trace the sample values before printing so you can check each step.
:::

```sample input
laptops = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8', 'L9', 'L10', 'L11', 'L12']
page_size = 4
```

```expected
Page 1: ['L1', 'L2', 'L3', 'L4']
Page 2: ['L5', 'L6', 'L7', 'L8']
Page 3: ['L9', 'L10', 'L11', 'L12']
```

```python run
# Complete the Exercise 2 (medium): Search result pagination task.
laptops = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8', 'L9', 'L10', 'L11', 'L12']
page_size = 4
# Write your code below
```


:::solution Solution
Slice by increments of `page_size`: `[0:4]`, `[4:8]`, and `[8:12]`:

```python run
laptops = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8', 'L9', 'L10', 'L11', 'L12']
page_size = 4
laptops = ["L1", "L2", "L3", "L4", "L5", "L6", "L7", "L8", "L9", "L10", "L11", "L12"]
page_size = 4
page1 = laptops[0:4]
page2 = laptops[4:8]
page3 = laptops[8:12]
print("Page 1:", page1)
print("Page 2:", page2)
print("Page 3:", page3)
```

```output
Page 1: ['L1', 'L2', 'L3', 'L4']
Page 2: ['L5', 'L6', 'L7', 'L8']
Page 3: ['L9', 'L10', 'L11', 'L12']
```
:::

### Exercise 3 (challenge): Middle trimming and sub-list replacement

Replace `readings[1:4]` with `[200, 350]` in one slice assignment. Print the updated `readings` list.


:::tip Hint
Use the lesson idea about indexing and slicing. Trace the sample values before printing so you can check each step.
:::

```sample input
readings = [100, 999, 999, 999, 500]
```

```expected
Healed sensor telemetry: [100, 200, 350, 500]
```

```python run
# Complete the Exercise 3 (challenge): Middle trimming and sub-list replacement task.
readings = [100, 999, 999, 999, 500]
# Write your code below
```


:::solution Solution
Assign `[200, 350]` directly to slice `readings[1:4]`:

```python run
readings = [100, 999, 999, 999, 500]
readings[1:4] = [200, 350]
print("Healed sensor telemetry:", readings)
```

```output
Healed sensor telemetry: [100, 200, 350, 500]
```
:::

## Recap

- Indexing accesses single elements; slicing extracts continuous sub-sequences.
- Negative indices count backward from the tail (`-1` is the last item).
- The slice format `[start:stop:step]` has a strictly exclusive `stop` boundary.
- `seq[::-1]` reverses any string, list, or tuple.
- In mutable lists, slice assignment replaces or deletes sub-ranges in-place.
- Accessing an out-of-bounds index raises `IndexError`, but slicing out-of-bounds clamps safely.

Reference: Python documentation, Sequence Types — list, tuple, range
