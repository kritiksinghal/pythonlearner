---
title: "Expense tracker with JSON"
curriculumTitle: "Expense tracker with JSON"
track: "Python from zero"
module: "M9 Projects"
order: 50
level: "Intermediate"
type: project
summary: "Build a small expense tracker that stores entries as JSON data."
prerequisites:
  - "Bank account with classes"
learningGoals:
  - "Represent expense records with dictionaries and lists"
  - "Serialize Python data to JSON and parse it again"
  - "Calculate a total from saved expenses"
  - "Use preset values in browser examples and input() in a terminal version"
relatedProblems: []
---

## The goal

Build a small expense tracker that records a description, category, and amount for each purchase. The program should calculate the total and save the entries as JSON text so they can be loaded on another run. Runnable examples use preset expense values and an in-memory text string; the terminal version with `input()` and a file is shown separately in a plain Python block.

For this project, amounts are stored as integer cents. That keeps the arithmetic predictable for a beginner example. This tool is a practice project, not personal financial software; real products need validation, privacy protections, and careful handling of money.

## What you will practice

- **Records**: use dictionaries to represent expenses.
- **Collections**: keep multiple expenses in a list.
- **JSON**: convert Python data to text and parse it back.
- **Calculations**: add amounts and compare category totals.
- **Testing**: run fixed examples that can be checked automatically.

The format uses a top-level list of expense dictionaries. Each record has `description`, `category`, and `cents`. JSON is used because these records have named fields. The examples stay within this expense-and-JSON topic; reading and writing file behavior was introduced in **Reading and writing files**.

## Plan

1. Create a dictionary for one expense.
2. Add several expense dictionaries to a list.
3. Write a function that totals the `cents` values.
4. Serialize the list with `json.dumps()` and parse it with `json.loads()`.
5. Display each expense and the final total.
6. In a terminal version, save and load the JSON text using a project file.

Use one clear data shape for every record. If an entry lacks a `cents` key, the total function cannot calculate it; consistency is important. Store the smallest amount unit as an integer, then format it for display. Do not save a formatted currency string and expect to add those strings later.

## Build it step by step

### Make one expense record

An expense dictionary keeps its description, category, and amount together. The amount uses cents, so 475 represents 4 dollars and 75 cents.

```python run
expense = {"description": "bus fare", "category": "travel", "cents": 475}
print(expense["description"], expense["cents"])
```

```output
bus fare 475
```

The category provides a way to group similar expenses later. A consistent dictionary shape makes it possible to process records in one loop.

### Store several expenses in a list

Use a list to represent the complete set of records for the current run.

```python run
def money_text(cents):
    dollars = cents // 100
    remainder = cents % 100
    return f"${dollars}.{remainder:02d}"

expenses = [
    {"description": "bus fare", "category": "travel", "cents": 475},
    {"description": "notebook", "category": "supplies", "cents": 1299},
]
print(len(expenses))
```

```output
2
```

Each element has the same keys. The list can grow as the user adds expenses.

### Calculate the total

Sum the integer amount field for each record. A function makes the calculation reusable and easy to check.

```python run
def total_cents(expenses):
    return sum(expense["cents"] for expense in expenses)

items = [{"cents": 475}, {"cents": 1299}]
print(total_cents(items))
```

```output
1774
```

The function returns 1774 cents, which is 17 dollars and 74 cents. It does not change any record.

### Format cents for display

Separate whole dollars from remaining cents. Keep this conversion for display; calculations should continue to use the integer.

```python run
def money_text(cents):
    dollars = cents // 100
    remainder = cents % 100
    return f"${dollars}.{remainder:02d}"

print(money_text(1774))
```

```output
$17.74
```

The format specifier `:02d` pads a one-digit cent value with a leading zero. This helps display amounts such as 5 cents as `$0.05`.

### Serialize the records to JSON

`json.dumps()` converts Python values into JSON text. The `indent` option makes the output easier for a person to inspect.

```python run
import json

expenses = [{"description": "tea", "category": "food", "cents": 220}]
text = json.dumps(expenses, indent=2)
print(text.splitlines()[0])
print(text.splitlines()[1])
```

```output
[
  {
```

The result is a string. This example prints only the first two lines so the code block remains compact; the complete JSON string includes all fields and closing brackets.

### Parse the JSON text back

`json.loads()` parses a JSON string into Python lists and dictionaries. Use it to restore the record structure after saving.

```python run
import json

saved_text = '[{"description": "tea", "category": "food", "cents": 220}]'
loaded_expenses = json.loads(saved_text)
print(loaded_expenses[0]["description"])
```

```output
tea
```

The parsed list has the same general shape as the original Python data. The name `loads` means that this function reads from a string; the file-based version uses `json.load()` and `json.dump()`.

### Add an expense with a function

Create an expense through one helper that appends a record. This keeps the key names consistent.

```python run
def add_expense(expenses, description, category, cents):
    expenses.append({"description": description, "category": category, "cents": cents})

expenses = []
add_expense(expenses, "tram ticket", "travel", 310)
print(expenses[0]["category"])
```

```output
travel
```

The function changes the list by appending one dictionary. A terminal interface should check that the description is not blank and the amount is positive before calling it.

### Show expenses by category

Loop through the records and display those that match the chosen category. The category comparison is exact in this first version.

```python run
def money_text(cents):
    dollars = cents // 100
    remainder = cents % 100
    return f"${dollars}.{remainder:02d}"

expenses = [
    {"description": "tram ticket", "category": "travel", "cents": 310},
    {"description": "pear", "category": "food", "cents": 140},
    {"description": "museum pass", "category": "travel", "cents": 900},
]
travel_total = sum(item["cents"] for item in expenses if item["category"] == "travel")
print(money_text(travel_total))
```

```output
$12.10
```

The generator expression includes only records whose category is `travel`. The result is 1210 cents, formatted as 12 dollars and 10 cents.

### Check that JSON preserves the total

Round-trip the records through JSON, then calculate the total from the parsed list. This checks that the saved representation preserves the integer values.

```python run
def total_cents(expenses):
    return sum(expense["cents"] for expense in expenses)

import json

original = [{"description": "map", "category": "supplies", "cents": 650}]
restored = json.loads(json.dumps(original))
print(total_cents(restored))
```

```output
650
```

JSON supports the simple lists, dictionaries, strings, and integers used here. The JSON encoder does not handle every Python type automatically; custom objects should be converted into supported values first.

## The complete program

This browser-safe version creates two preset expenses, converts them to JSON text, parses the text back, and prints a record count and total. It simulates file content in a variable and does not call `input()`.

```python run
import json

def add_expense(expenses, description, category, cents):
    expenses.append({"description": description, "category": category, "cents": cents})

def total_cents(expenses):
    return sum(item["cents"] for item in expenses)

def money_text(cents):
    dollars = cents // 100
    remainder = cents % 100
    return f"${dollars}.{remainder:02d}"

expenses = []
add_expense(expenses, "tram ticket", "travel", 310)
add_expense(expenses, "pear", "food", 140)
saved_text = json.dumps(expenses)
loaded_expenses = json.loads(saved_text)
print(f"Entries: {len(loaded_expenses)}")
print(f"Total: {money_text(total_cents(loaded_expenses))}")
```

```output
Entries: 2
Total: $4.50
```

The JSON round-trip demonstrates the same data conversion the file version uses. To persist it, save the encoded string to a `.json` file and load it at the start of the next run. The full terminal version below adds that file connection and reads user input.

```python
import json
from pathlib import Path

DATA_FILE = Path("expenses.json")

def add_expense(expenses, description, category, cents):
    expenses.append({"description": description, "category": category, "cents": cents})

def load_expenses():
    if not DATA_FILE.exists():
        return []
    with DATA_FILE.open(encoding="utf-8") as file:
        return json.load(file)

def save_expenses(expenses):
    with DATA_FILE.open("w", encoding="utf-8") as file:
        json.dump(expenses, file, indent=2)

expenses = load_expenses()
description = input("Description: ").strip()
category = input("Category: ").strip().lower()
cents = int(input("Amount in cents: "))
if description and category and cents > 0:
    add_expense(expenses, description, category, cents)
    save_expenses(expenses)
    print("Expense saved")
else:
    print("Enter a description, category, and positive amount")
```

Sample session: enter `train pass`, `travel`, and `2750` at the three prompts; the program prints `Expense saved` and writes the record to `expenses.json`.

In the saved program, include the `add_expense()` helper before the interactive code. Run the program from its project folder so `expenses.json` is created in a predictable place. On the next run, the JSON loader returns the stored records.

## Make it yourself

Try each improvement only after you can add an entry, save it, restart, and load it again.

1. Reject zero or negative amounts before saving.
2. Print every saved description and its formatted amount.
3. Calculate a separate total for each category.
4. Add an action to display the total without adding a new expense.
5. Catch malformed JSON and tell the user that the saved file needs attention.

Test the amount formatter with 0, a value below 100, and a value above 10000 cents. Test the JSON round-trip with more than one record and check that every description, category, and amount returns unchanged. A total alone is not enough to prove the details were saved correctly.

JSON is text, so you can inspect `expenses.json` in a text editor. Do not hand-edit a value without keeping valid JSON syntax: strings need quotes, commas separate fields, and braces and brackets must be balanced. The `json` module should create the file content in normal use.

Reference: Python documentation, json — JSON encoder and decoder
