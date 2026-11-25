---
title: "Sets"
curriculumTitle: "Sets"
track: "Python from zero"
module: "M4 Collections"
order: 18
level: "Beginner"
summary: "Use sets to collect unique hashable values, test membership, and compare groups with mathematical set operations."
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
learningGoals:
  - "Create sets and recognize that repeated values collapse into one member."
  - "Use add(), discard(), and membership tests to work with set members."
  - "Use union, intersection, difference, and symmetric difference."
  - "Explain why sets do not provide indexes or a dependable display order."
  - "Choose sets for uniqueness and membership, and lists when order or duplicates matter."
relatedProblems: []
---

## What you will learn

- A **set** is a collection of unique values, useful when you care whether something is present rather than where it appears.
- How to create a set from braces or with `set()`, including the special spelling for an empty set.
- How to add and remove members and check whether a member is present.
- How set operations combine or compare groups: **union**, **intersection**, **difference**, and **symmetric difference**.
- Why sets cannot be indexed like lists and why you should sort a set before showing its contents in a predictable order.
- Which values may be set members and why mutable lists cannot be members.

## Why this matters

Imagine a music app has a list of every genre mentioned in a listener's playlist. The same genre may appear for many tracks, but a settings screen needs to show each genre once. A set can remove those repeats and let the app quickly check whether a genre appears. The same idea helps with student groups, sports teams, coupon codes, and any collection where duplicates do not add information.

Sets are also useful for comparing groups. A coach can ask which athletes attended both training sessions, which athletes attended only Monday, and who attended exactly one of the two. Those are natural set questions. A list is still the right choice when order or repeated entries matter; a set is the right choice when uniqueness and membership checks are the main concern.

## The big idea

Picture two guest lists written on transparent cards. If you stack the cards, names visible on both cards identify shared guests. Names on either card identify everyone invited. Names on only one card identify guests invited to one event but not both. A set gives Python a direct way to work with those group relationships.

Set members are unique. If you create a set from repeated values, Python keeps only one copy of each distinct value. A set does not record a numbered position for each member, so you cannot ask for “the first member” with index zero. The order you see when printing a set is not a promise about the order you inserted items. If you need a stable display, use `sorted(my_set)` to make a sorted list.

Sets are written with braces, such as `{ "rock", "jazz" }`, when they contain members. The empty braces `{}` create a dictionary, not an empty set. Write `set()` for an empty set. Set members must be **hashable**, which for beginner code means choose immutable values such as strings, integers, and suitable tuples. A list can change, so it cannot be stored inside a set.

## Step by step

### 1. Create a set and remove duplicate values

Braces with comma-separated values make a set. Passing a list to `set()` also builds a set from its values.

```python run
genres = {"jazz", "pop", "jazz", "folk", "pop"}
print(sorted(genres))
print("Unique genres:", len(genres))
```

```output
['folk', 'jazz', 'pop']
Unique genres: 3
```

The repeated `"jazz"` and `"pop"` values do not create extra members. `sorted()` returns a list in alphabetical order so the printed result is predictable. `len()` counts the three unique members.

Use `set()` to create an empty set. This matters because `{}` already has a meaning in Python: it creates an empty dictionary. A set's members are not stored as list positions, even though a printed example may look like a sequence of values.

### 2. Add members and check membership

The `.add(value)` method inserts a value. Adding a member that is already present leaves the set unchanged. The `in` operator checks whether a value is a member.

```python run
registered = {"Aditi", "Bilal"}
registered.add("Chinmay")
registered.add("Aditi")
print("Aditi registered:", "Aditi" in registered)
print("Names:", sorted(registered))
```

```output
Aditi registered: True
Names: ['Aditi', 'Bilal', 'Chinmay']
```

The first call adds Chinmay. The second tries to add Aditi again, but a set keeps only one Aditi. The membership test returns `True`, and sorting makes the display stable.

Membership checks are a central use of sets. For example, if a game needs to know whether a player has already collected a badge, a set of collected badge names is more direct than searching through a list manually.

### 3. Remove a member safely

`.remove(value)` deletes a member but raises `KeyError` if it is missing. `.discard(value)` also deletes a member, but does nothing when it is absent. Choose the method based on whether a missing value is an error for your program.

```python run
pantry = {"rice", "lentils", "salt"}
pantry.discard("pepper")
pantry.remove("salt")
print(sorted(pantry))
```

```output
['lentils', 'rice']
```

`discard` makes no change because pepper was not a member. `remove` deletes salt because it is present. The final call to `sorted` returns a predictable list for display.

There is also a `.pop()` method, but it removes and returns an arbitrary set member. Since sets have no positional order, it is not a tool for removing a particular “first” member. Use it only when any remaining member is acceptable.

### 4. Combine groups with union

The **union** of sets contains every member found in either set. Use the `|` operator or the `.union()` method.

```python run
monday = {"Asha", "Dev", "Mina"}
tuesday = {"Dev", "Irfan"}
both_days = monday | tuesday
print(sorted(both_days))
```

```output
['Asha', 'Dev', 'Irfan', 'Mina']
```

`monday | tuesday` combines the members from both groups, keeping Dev only once. The original sets are unchanged; the result is a new set. Sorting only affects how we display the result.

### 5. Find shared members with intersection

The **intersection** contains only the members present in both sets. The `&` operator reads as “and.”

```python run
morning_class = {"Ira", "Nikhil", "Tara"}
afternoon_class = {"Nikhil", "Tara", "Zoya"}
attended_both = morning_class & afternoon_class
print(sorted(attended_both))
```

```output
['Nikhil', 'Tara']
```

Nikhil and Tara are in both groups, so they appear in the result. Ira and Zoya appear in only one group and are left out. The intersection does not edit either original set.

### 6. Find members in one group but not another

The **difference** `a - b` contains members in `a` that are not in `b`. Direction matters: `a - b` and `b - a` can give different results.

```python run
subscribed = {"weekly", "alerts", "offers"}
free_plan = {"weekly", "alerts"}
paid_only = subscribed - free_plan
print(sorted(paid_only))
```

```output
['offers']
```

The left-hand set is the starting group. `offers` is in `subscribed` and absent from `free_plan`, so it remains. Weekly and alerts are removed from this result because they also occur on the right.

### 7. Find members in exactly one group

The **symmetric difference** contains members that are in either set but not both. Use `^` for this operation.

```python run
heard_friday = {"track A", "track B", "track C"}
heard_saturday = {"track B", "track C", "track D"}
heard_once = heard_friday ^ heard_saturday
print(sorted(heard_once))
```

```output
['track A', 'track D']
```

Track B and track C appeared on both days, so they are excluded. Track A is only in Friday's set, while track D is only in Saturday's set. Those two remain.

### 8. Convert a list to unique values

The `set()` constructor can remove duplicates from an existing collection. Converting back to a sorted list is useful when you need both unique values and a repeatable display order.

```python run
shirt_sizes = ["M", "S", "M", "L", "S", "M"]
unique_sizes = sorted(set(shirt_sizes))
print(unique_sizes)
```

```output
['L', 'M', 'S']
```

`set(shirt_sizes)` keeps one of each size. `sorted(...)` turns those members into an alphabetized list. The original list still has its order and duplicates because the conversion makes a new set rather than changing `shirt_sizes`.

This conversion is useful only if duplicate counts and original order do not matter. If you need to know how many times each item appears, a dictionary is a better fit; see the previous lesson, “Dictionaries.”

## What Python is doing behind the scenes

When you add a member, Python determines whether an equal member is already present. When you ask whether an item is in a set, Python uses its hash-based membership mechanism. The useful idea is that membership is direct; do not think of a set as a numbered row of values.

| Step | Operation | Members in `clubs` |
| --- | --- | --- |
| 1 | `clubs = {"chess", "music"}` | `chess`, `music` |
| 2 | `clubs.add("robotics")` | `chess`, `music`, `robotics` |
| 3 | `clubs.add("music")` | unchanged; music is already present |
| 4 | `clubs.discard("chess")` | `music`, `robotics` |

The order in the right column is only for explanation, not a promise about print order. Use `sorted(clubs)` when the order matters to a person reading the output.

## Common mistakes

### 1. Using `{}` when you mean an empty set

Broken code:

```python
visited = {}
visited.add("museum")
```

Python reports `AttributeError: 'dict' object has no attribute 'add'`. `{}` made a dictionary. Use `visited = set()` to create an empty set before calling `.add()`.

### 2. Trying to get a set member by index

Broken code:

```python
stations = {"Central", "Harbor"}
print(stations[0])
```

Python reports `TypeError: 'set' object is not subscriptable`. Sets do not have positions. Check membership with `"Central" in stations`, or convert to a sorted list if you need a predictable display.

### 3. Trying to add a list as a member

Broken code:

```python
teams = set()
teams.add(["red", "gold"])
```

Python reports `TypeError: unhashable type: 'list'`. Lists are mutable, so they cannot be set members. A tuple such as `("red", "gold")` can be used if its contents are also hashable.

### 4. Removing a member that is not present

Broken code:

```python
pantry = {"rice", "lentils"}
pantry.remove("pepper")
```

Python reports `KeyError: 'pepper'` because `.remove()` expects the member to exist. Use `.discard("pepper")` when absence is normal, or check membership first. Also remember that set display order is not guaranteed; use `sorted(pantry)` for a predictable display.

## Cheat sheet

| Goal | Example | Result |
| --- | --- | --- |
| Create a set | `colors = {"red", "gold"}` | A set of unique values. |
| Create an empty set | `colors = set()` | An empty set; `{}` is a dictionary. |
| Remove duplicates | `set(["A", "A", "B"])` | A set containing A and B. |
| Add a value | `colors.add("green")` | Adds it if not already present. |
| Remove if present | `colors.discard("blue")` | No error if it is missing. |
| Check membership | `"red" in colors` | `True` or `False`. |
| Union | `a | b` | Members in either set. |
| Intersection | `a & b` | Members in both sets. |
| Difference | `a - b` | Members in `a`, not in `b`. |
| Symmetric difference | `a ^ b` | Members in exactly one set. |
| Predictable display | `sorted(colors)` | A sorted list of members. |

## Try it yourself

### Easy: Remove repeated song genres

Create a set from a list with repeated genres. Print its members in alphabetical order.

```python run
# Try the exercise above using this sample data.
# Sample data: genres = ["soul", "pop", "soul", "indie"]
# Write your code below and print the result
```

:::solution

```python
genres = ["soul", "pop", "soul", "indie"]
print(sorted(set(genres)))
```

:::

### Medium: Compare two practice groups

Make two sets of athletes. Print the athletes who attended both sessions.

```python run
# Try the exercise above using this sample data.
# Sample data: session_one = {"Meera", "Arjun", "Pia"}
# Write your code below and print the result
```

:::solution

```python
session_one = {"Meera", "Arjun", "Pia"}
session_two = {"Pia", "Arjun", "Kabir"}
print(sorted(session_one & session_two))
```

:::

### Challenge: Find a one-day visitor

Given sets of people who visited a museum on Saturday and Sunday, print those who visited exactly one day.

```python run
# Try the exercise above using this sample data.
# Sample data: saturday = {"Aarav", "Nina", "Om"}
# Write your code below and print the result
```

:::solution

```python
saturday = {"Aarav", "Nina", "Om"}
sunday = {"Nina", "Ravi", "Om"}
print(sorted(saturday ^ sunday))
```

:::

## Recap

- Sets keep unique hashable values and work well for membership checks.
- Use `set()` for an empty set; `{}` creates a dictionary.
- Add members with `.add()` and choose `.remove()` or `.discard()` based on missing-key behavior.
- Use `|`, `&`, `-`, and `^` to combine or compare groups.
- Sets do not have indexes or guaranteed display order; use `sorted()` when you need consistent output.

Reference: Python documentation, Sets
