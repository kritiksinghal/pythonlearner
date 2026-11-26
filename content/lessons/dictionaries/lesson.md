---
title: "Dictionaries"
curriculumTitle: "Dictionaries"
track: "Python from zero"
module: "M4 Collections"
order: 17
level: "Beginner"
summary: "Use dictionaries to connect meaningful keys with values, update records, look up information, and handle missing keys safely."
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
learningGoals:
  - "Create dictionaries whose keys label related values."
  - "Read, add, and update entries using square brackets."
  - "Choose between direct lookup and the safer get() method."
  - "Check keys and remove entries with clear, predictable behavior."
  - "Loop through dictionary keys, values, and key/value pairs."
relatedProblems: []
---

## What you will learn

- What a **dictionary** is and when named keys are more useful than numbered positions.
- How a **key-value pair** connects a label, such as a player's name, with its information.
- How to create a dictionary, read a value, add a new pair, or update an existing value.
- How `.get()` handles a key that may not exist, and how `in` checks keys.
- How to delete entries with `del` or `.pop()` and inspect a dictionary with `.keys()`, `.values()`, and `.items()`.
- Why dictionary keys must be **hashable**, and why common immutable values work as keys.

## Why this matters

Many useful pieces of information have labels. A cricket scorecard links each batter's name with runs; a music playlist might link a track title with its duration; a weather report links a city with a temperature. A list can store these values, but you would have to remember which position means what and search through the list to find a particular record. A dictionary gives each value a meaningful key, so your code can ask for the information by its label.

Dictionaries also help keep related facts together. Instead of creating separate variables for every player's score, you can keep all scores in one structure and reuse the same code for each player. You can add new records as a match progresses, correct a value, check whether a player has scored, and display the data in a loop. This pattern appears throughout Python programs, including settings, inventories, counters, and data read from JSON. JSON is covered in “JSON and CSV.”

## The big idea

Think of a dictionary as a labeled filing cabinet. Each drawer label is a **key**, and the folder stored under that label is its **value**. If a drawer is labeled `"Mira"`, your program can use that key to find Mira's score without counting positions from the start of a list.

A dictionary is written with braces and key-value pairs: `{"Mira": 42, "Dev": 35}`. The colon separates a key from its value, and commas separate pairs. Keys are unique within one dictionary. If you assign a value to a key that already exists, Python replaces the old value for that key; it does not create a second copy of that key. Values may repeat, and they can be different types.

Dictionaries preserve the order in which keys are first inserted. This can make a displayed dictionary easier to follow, but the most important way to select an entry is still its key, not a numeric position. `scores["Mira"]` means “look up the value for Mira.” `scores[0]` means “look for a key whose value is the number zero,” and it will fail if there is no such key.

## Step by step

### 1. Create a dictionary with useful labels

Use braces around comma-separated pairs. A string key needs quotes, just like any other string. Here a small match scorecard maps each batter's name to their runs.

```python run
batting = {"Asha": 48, "Rohan": 31, "Leela": 56}
print(batting)
print("Batters:", len(batting))
```

```output
{'Asha': 48, 'Rohan': 31, 'Leela': 56}
Batters: 3
```

The first line creates three pairs. The names are keys and the numbers are values. The next line prints the dictionary, and `len(batting)` counts its pairs, not the number of characters in its keys.

You can start with an empty dictionary using `{}` and fill it later. `dict()` also creates an empty dictionary, but `{}` is the shorter form you will see most often. The braces in `{}` are different from an empty set; sets are covered in “Sets.”

### 2. Read a value by its key

Square brackets perform a lookup. The key must match the type and value of a key already stored in the dictionary.

```python run
medals = {"Anaya": 2, "Kabir": 4, "Noor": 1}
winner = "Kabir"
print(winner, "earned", medals[winner], "medals")
```

```output
Kabir earned 4 medals
```

Line 1 stores three competitors and their medal counts. Line 2 puts one key into a variable. On line 3, Python uses the variable's value, `"Kabir"`, as the key and retrieves `4`.

The key can be any hashable object. A **hashable** value has a stable identity Python can use to find it in a dictionary. Strings, integers, and tuples made only from hashable values are common examples. Lists and dictionaries are mutable, so they cannot be keys. The details of how Python hashes an object are beyond this lesson; the practical rule is to choose immutable labels such as strings or numbers.

### 3. Add an entry or update an existing entry

An assignment to a dictionary key has two possible effects: it adds a pair if the key is new, or replaces that key's value if the key is already present.

```python run
temperatures = {"Pune": 29, "Kochi": 31}
temperatures["Jaipur"] = 34
temperatures["Kochi"] = 30
print(temperatures)
```

```output
{'Pune': 29, 'Kochi': 30, 'Jaipur': 34}
```

Line 1 starts with two cities. Line 2 adds Jaipur because that key is new. Line 3 changes Kochi's value from 31 to 30. Line 4 prints the result; Kochi remains in its original position because updating a key does not add a new key.

This makes dictionary assignment useful for changing a running total or the latest reading. It is also easy to accidentally overwrite data if you reuse a key, so choose keys that identify the record you mean to update.

### 4. Handle a key that might be missing

Direct lookup is appropriate when a missing key indicates a mistake. It raises a `KeyError` if the dictionary has no such key. When absence is expected, `.get(key)` returns `None` by default; `.get(key, fallback)` returns the fallback you supply.

```python run
prices = {"tea": 18, "coffee": 25}
print("Tea:", prices.get("tea"))
print("Juice:", prices.get("juice", 0))
print("Juice exists:", "juice" in prices)
```

```output
Tea: 18
Juice: 0
Juice exists: False
```

The first lookup finds `18`. The second key is missing, so the fallback `0` is returned. The final expression checks whether `"juice"` is a key. For a dictionary, `in` checks keys, not values.

Use a fallback that makes sense for the situation. A count might sensibly start at zero; a missing person's name might need a message instead. Avoid using a real value as a fallback if that would make “missing” indistinguishable from a genuine stored value.

### 5. Remove an entry when it is no longer needed

The `del` statement removes a key and its value. `.pop(key)` removes the pair and also gives you the removed value. Both raise `KeyError` when the key is absent, unless you give `.pop()` a default.

```python run
snacks = {"samosa": 12, "mango": 8, "lassi": 20}
sold = snacks.pop("mango")
del snacks["samosa"]
print("Mango sold for:", sold)
print("Still available:", snacks)
```

```output
Mango sold for: 8
Still available: {'lassi': 20}
```

Line 1 creates a stall's menu prices. Line 2 removes the mango pair and saves its value as `sold`. Line 3 removes the samosa pair without saving its value. The last two lines show the removed price and the remaining dictionary.

If a key might not exist, `.pop("item", None)` avoids an exception and gives `None` when no pair was removed. If you need to distinguish a missing key from a stored value of `None`, check membership with `in` first.

### 6. Loop through keys and values

When you loop directly over a dictionary, Python gives you its keys. `.values()` gives you values, and `.items()` gives you each key and value together. `.items()` is useful when your output needs both pieces of information.

```python run
practice_minutes = {"Ira": 25, "Zoya": 40, "Neil": 15}
for name, minutes in practice_minutes.items():
    print(f"{name}: {minutes} minutes")
```

```output
Ira: 25 minutes
Zoya: 40 minutes
Neil: 15 minutes
```

The loop visits one pair at a time. On each turn, `name` receives the key and `minutes` receives its matching value. The indented print statement formats that pair. Looping over `.keys()` is available too, but writing `for name in practice_minutes:` already loops over the keys.

### 7. Count repeated words with a dictionary

A common pattern is to use each distinct item as a key and keep a running count as its value. When a word appears again, update the existing count.

```python run
chants = ["six", "four", "six", "single", "four", "six"]
counts = {}
for chant in chants:
    if chant in counts:
        counts[chant] = counts[chant] + 1
    else:
        counts[chant] = 1
print(counts)
```

```output
{'six': 3, 'four': 2, 'single': 1}
```

The list contains six calls from the stands. `counts` begins empty. For every call, the `if` checks whether that word already has a key. If it does, its count increases by one; otherwise, the program creates the key with a starting count of one. The final dictionary records how often each word appeared.

The longer expression on the update line is intentional for now: it makes the read, add, and write steps visible. The `.get()` method can also help with counters, but this pattern is easier to trace when you are learning how dictionaries change.

### 8. Build a dictionary from pairs

The `dict()` constructor can turn a sequence of two-item pairs into a dictionary. This is useful when your data already comes as pairs, though ordinary braces are clearer for small dictionaries you write by hand.

```python run
departures = dict([("Platform 1", "08:10"), ("Platform 3", "08:45")])
print(departures["Platform 3"])
print("Platforms:", list(departures))
```

```output
08:45
Platforms: ['Platform 1', 'Platform 3']
```

The list contains two tuples, each with a key followed by its value. `dict(...)` turns them into pairs in a dictionary. The next line looks up a departure time, and `list(departures)` makes a list of the keys in insertion order.

When input pairs contain the same key more than once, the later value replaces the earlier one. Do not rely on repeated keys to preserve multiple records; give distinct records distinct keys or choose a collection designed for multiple values.

## What Python is doing behind the scenes

When Python evaluates `prices["tea"]`, it uses the key to locate its value. This is different from a list, where an integer index identifies a position. A dictionary's key-value relationship is the main model to keep in mind; you do not need to know the low-level implementation to use it correctly.

| Step | Operation | Dictionary afterward |
| --- | --- | --- |
| 1 | `runs = {"Asha": 48}` | `{"Asha": 48}` |
| 2 | `runs["Rohan"] = 31` | `{"Asha": 48, "Rohan": 31}` |
| 3 | `runs["Asha"] = 52` | `{"Asha": 52, "Rohan": 31}` |
| 4 | `del runs["Rohan"]` | `{"Asha": 52}` |

Each key can appear once. Updating an existing key changes the value linked to it. Adding a different key creates another pair. Deleting a key removes its pair. As you read code, track the keys and values separately; a common error is to think that assigning a new value creates another entry under the same key.

## Common mistakes

### 1. Looking up a key that does not exist

Broken code:

```python
scores = {"Mira": 91}
print(scores["Dev"])
```

Running this prints the real error: `KeyError: 'Dev'`. Use `scores.get("Dev", 0)` when a missing score should mean zero, or check `"Dev" in scores` before direct lookup.

### 2. Using a list as a key

Broken code:

```python
inventory = {}
inventory[["tea", "coffee"]] = 2
```

Python reports `TypeError: cannot use 'list' as a dict key (unhashable type: 'list')`. Lists can change, so Python does not allow them as keys. If the key represents a fixed pair of values, a tuple may work: `("tea", "coffee")`.

### 3. Treating a dictionary like a list

Broken code:

```python
stock = {"tea": 4}
print(stock[0])
```

Python reports `KeyError: 0`, because there is no key with the integer value `0`. Ask for `stock["tea"]` to use the label, or loop through `.items()` to visit pairs.

### 4. Calling a list method on a dictionary

Broken code:

```python
scores = {"Mira": 91}
scores.append(("Dev", 84))
```

Python reports `AttributeError: 'dict' object has no attribute 'append'`. Add or update a dictionary pair with assignment: `scores["Dev"] = 84`.

## Cheat sheet

| Goal | Example | What it does |
| --- | --- | --- |
| Create | `prices = {"tea": 18}` | Makes a key-value pair. |
| Empty dictionary | `prices = {}` | Starts with no pairs. |
| Read | `prices["tea"]` | Gets the value; missing key raises `KeyError`. |
| Add or update | `prices["coffee"] = 25` | Adds a key or replaces its value. |
| Safe lookup | `prices.get("juice", 0)` | Gets a value or the fallback. |
| Check key | `"tea" in prices` | Tests whether the key exists. |
| Remove | `del prices["tea"]` | Removes the pair; missing key raises `KeyError`. |
| Remove and receive value | `price = prices.pop("tea", None)` | Removes a pair, or returns the fallback. |
| Visit keys | `for name in prices:` | Loops through keys. |
| Visit values | `for price in prices.values():` | Loops through values. |
| Visit pairs | `for name, price in prices.items():` | Loops through keys and values. |

## Try it yourself

### Easy: Show a player's score

Create a dictionary of two players' cricket runs. Print one player's name and score in a sentence.

```python run
# Complete the Show a player's score task.
# Sample data: runs = {"Tara": 27, "Ishan": 41}
# Write your code below and print the result
```

:::solution
The solution completes “Show a player's score” by using the provided sample values and producing the requested result.


```python
runs = {"Tara": 27, "Ishan": 41}
print(f"Ishan scored {runs['Ishan']} runs.")
```

:::

### Medium: Update a weather reading

Start with temperatures for two cities. Add a third city, update one reading, and print the final dictionary.

```python run
# Complete the Update a weather reading task.
# Sample data: temperatures = {"Delhi": 33, "Shimla": 19}
# Write your code below and print the result
```

:::solution
The solution completes “Update a weather reading” by using the provided sample values and producing the requested result.


```python
temperatures = {"Delhi": 33, "Shimla": 19}
temperatures["Chennai"] = 35
temperatures["Shimla"] = 20
print(temperatures)
```

:::

### Challenge: Count music genres

Given a list of genres, build a dictionary that records how many times each genre appears. Print the count for each genre.

```python run
# Complete the Count music genres task.
# Sample data: genres = ["jazz", "pop", "jazz", "rock", "pop"]
# Write your code below and print the result
```

:::solution
The solution completes “Count music genres” by using the provided sample values and producing the requested result.


```python
genres = ["jazz", "pop", "jazz", "rock", "pop", "jazz"]
counts = {}
for genre in genres:
    if genre not in counts:
        counts[genre] = 0
    counts[genre] += 1
for genre, count in counts.items():
    print(f"{genre}: {count}")
```

:::

## Recap

- A dictionary stores key-value pairs, letting you find a value by a meaningful label.
- Use `data[key]` when you expect the key; use `.get()` when absence is normal.
- Assignment adds a new key or updates the value for an existing key.
- Keys must be hashable; strings and numbers are common choices.
- Loop over a dictionary's keys directly, or use `.values()` and `.items()` for values and pairs.

Reference: Python documentation, Dictionaries
