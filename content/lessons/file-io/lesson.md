---
title: "File I/O"
curriculumTitle: "File I/O"
track: "CS50P"
module: "Week 6 File I/O"
order: 7
level: "Beginner"
runnableMin: 3
summary: "Preserve text with files and read or write CSV rows using Python's tools."
prerequisites:
  - "unit-tests"
learningGoals:
  - "Read and write text files with a with block"
  - "Choose read, write, and append modes deliberately"
  - "Process lines and remove their line endings"
  - "Use csv.DictReader and csv.DictWriter for table-shaped text"
  - "Handle a missing file with FileNotFoundError"
relatedProblems: []
---

## What you will learn

- Why files preserve information after a program ends
- How `open` and `with` are used to read and write text
- How the modes `r`, `w`, and `a` differ
- How to process lines and remove trailing line endings
- How CSV reader and writer tools handle rows and columns

## Why this matters

Values in variables belong to a running program. If that program ends, those values are gone. A file lets an application keep a guest list, a set of match results, or a small catalog for another run. Reading from and writing to files means choosing how the saved information should be accessed. A mistaken write mode can erase data, and a line ending left in a string can make output look unexpectedly spaced. CSV files add rows and columns to the same idea, so Python's CSV tools are safer than treating every row as plain comma-separated text.

## The big idea

`open` connects a program to a path and returns a file object. The mode tells Python what the program intends to do: `"r"` reads, `"w"` writes from the beginning and replaces old contents, and `"a"` appends at the end. A `with` block is the reliable way to use the connection because Python closes the file when the block ends.

Text read from a file is returned as strings. A line normally includes its newline character, so `rstrip()` is useful when you want the visible text without trailing whitespace. For a table saved in CSV form, `csv.DictReader` uses the header row as dictionary keys, while `csv.DictWriter` writes dictionaries as rows. If a requested path does not exist in read mode, Python raises `FileNotFoundError`, which can be handled explicitly.

Treat the file mode as part of the program's data policy. Replacing a draft is different from adding a new record, and reading should not change the saved text. Naming that choice directly in the `open` call makes its effect visible to a reviewer before the program runs.

## Step by step

### Write text and read it back

The first `with` block creates or replaces a small file. The next block opens it for reading. This example uses a lesson-specific filename and removes it in the terminal after verification.

```python run
with open("cs50p-io-rounds.txt", "w") as file:
    file.write("Lane 4 completed\n")
    file.write("Lane 6 completed\n")

with open("cs50p-io-rounds.txt", "r") as file:
    print(file.read(), end="")
```

```output
Lane 4 completed
Lane 6 completed
```

`write` stores exactly the strings supplied, including the newline characters. `read()` returns the file contents as one string, and `end=""` avoids adding one more newline after that text.

### Append without replacing the old information

Append mode places new text after existing content. It preserves the earlier lines.

```python run
with open("cs50p-io-append.txt", "w") as file:
    file.write("Warm-up logged\n")
with open("cs50p-io-append.txt", "a") as file:
    file.write("Final logged\n")
with open("cs50p-io-append.txt", "r") as file:
    print(file.read(), end="")
```

```output
Warm-up logged
Final logged
```

The first open creates known starting content. The append open adds another line instead of clearing the first. This is the mode for a running log or guest list that should keep earlier entries.

### See why write mode replaces content

Opening an existing file with `"w"` starts fresh. The previous contents are not kept.

```python run
with open("cs50p-io-replace.txt", "w") as file:
    file.write("Draft schedule\n")
with open("cs50p-io-replace.txt", "w") as file:
    file.write("Published schedule\n")
with open("cs50p-io-replace.txt", "r") as file:
    print(file.read(), end="")
```

```output
Published schedule
```

The second write replaces the draft. If the goal is to keep both entries, use append mode rather than write mode for the second operation.

### Read one line at a time

Looping over a file object returns one line per iteration. Calling `rstrip()` removes the newline at the end before the line is displayed.

```python run
with open("cs50p-io-lines.txt", "w") as file:
    file.write("Blue tent\n")
    file.write("Red lantern\n")

with open("cs50p-io-lines.txt", "r") as file:
    for line in file:
        print(line.rstrip())
```

```output
Blue tent
Red lantern
```

The loop handles each saved line separately. Without removing the newline, `print` would add its own line ending too, which can create blank-looking spacing.

### Read the whole file or a list of lines

`read()` returns the remaining text as one string. `readlines()` returns the remaining lines as a list, with their line endings still attached.

```python run
with open("cs50p-io-list.txt", "w") as file:
    file.write("South stand\nNorth stand\n")

with open("cs50p-io-list.txt", "r") as file:
    lines = file.readlines()
    print([line.rstrip() for line in lines])
```

```output
['South stand', 'North stand']
```

This example loads a small file into memory, then strips the line endings from each item for display. For larger files, iterating line by line avoids collecting every line in a list first.

### Sort saved names before displaying

Read the names into a list, remove their line endings, then iterate over `sorted(names)` to print them in order.

```python run
with open("cs50p-io-sort.txt", "w") as file:
    file.write("Nisha\nArun\nZoya\n")

with open("cs50p-io-sort.txt", "r") as file:
    names = [line.rstrip() for line in file]
for name in sorted(names):
    print(name)
```

```output
Arun
Nisha
Zoya
```

The list comprehension collects one cleaned string per line. `sorted` supplies names in alphabetical order without changing the file itself.

### Read a CSV table with DictReader

CSV is text arranged in rows and comma-separated columns. `DictReader` uses the header row to name each field, then makes each data row available as a dictionary.

```python run
import csv

with open("cs50p-io-results.csv", "w") as file:
    file.write("player,club\n")
    file.write("Ishan,Comets\n")
    file.write("Pia,Orbits\n")

with open("cs50p-io-results.csv", "r") as file:
    for row in csv.DictReader(file):
        print(row["player"], "plays for", row["club"])
```

```output
Ishan plays for Comets
Pia plays for Orbits
```

The first row provides keys such as `player` and `club`. Each later row supplies values that can be looked up by those keys.

### Write a CSV row with DictWriter

`DictWriter` uses a list of field names to determine the columns. The row is supplied as a dictionary with matching keys.

```python run
import csv

with open("cs50p-io-points.csv", "w") as file:
    writer = csv.DictWriter(file, fieldnames=["player", "points"])
    writer.writeheader()
    writer.writerow({"player": "Tara", "points": 18})

with open("cs50p-io-points.csv", "r") as file:
    print(file.read(), end="")
```

```output
player,points
Tara,18
```

The header names are written first, then one dictionary becomes a data row. For repeated records, call `writerow` for each row while the file remains open.

### Handle a file that is not present

Opening a nonexistent file in read mode raises `FileNotFoundError`. An `except` block can replace the raw traceback with a message that explains the situation.

```python run
try:
    with open("cs50p-io-absent.txt", "r") as file:
        print(file.read())
except FileNotFoundError:
    print("Saved report was not found")
```

```output
Saved report was not found
```

The context manager does not create a missing file in read mode. Python raises the exception, then the matching handler runs. Use this response when a missing file is an expected possibility.

### Run a small file task in the terminal

For a file that should live on disk after the command finishes, use a terminal. This command was run with Python 3.12 and its output shown below.

```bash
python3.12 -c 'open("practice-score.txt", "w").write("Set 1: 19\\n"); print(open("practice-score.txt").read(), end="")'
```

```output
Set 1: 19
```

The command creates the file in the current directory, reads it back, and displays its saved content. Be careful about the directory and mode when running a command that writes a file you intend to keep.

## What Python is doing behind the scenes

`open` returns a file object connected to the selected path. The mode determines what operations are expected and whether prior contents remain. In a `with` block, Python closes that object when control leaves the indented body, including when an exception interrupts the work. This reduces the chance of leaving a file open accidentally.

Text files store characters and line endings. Reading a line includes its ending, while `rstrip()` removes trailing whitespace such as the newline. CSV tools interpret a header and rows so the program can use named fields rather than manually dividing every string. `DictReader` maps fields from each row to the header names; `DictWriter` turns dictionaries into rows based on its field list.

## Common mistakes

### Opening with w when you meant to keep old content

Write mode replaces the existing contents. Choose append mode when new text belongs after existing data.

### Forgetting a newline while writing separate entries

`write()` stores only the characters you pass. Add `"\n"` when each value should occupy its own line.

### Printing lines with their newline still attached

A line read from a file normally includes its newline. `print` adds another newline by default, so use `rstrip()` or another deliberate display choice.

For example, if a loop prints three lines and each input string already ends with `\n`, ordinary `print(line)` adds another line break after each saved one. The result can look like an empty row between values even though the file contains only one line ending per item. Running `print(line.rstrip())` presents one printed line per saved entry. This is why it helps to know whether the string already includes a newline before choosing how to display it.

### Treating CSV as unstructured strings

Splitting every line manually can misread a table. Use `csv.DictReader` and `csv.DictWriter` to work with named columns and rows.

### Assuming the file exists

A path can be absent. If that is a normal possibility, catch `FileNotFoundError` and explain what happened.

Handle that case near the read operation rather than assuming that a previous run created the file. A message such as “Saved report was not found” makes the situation understandable and lets the rest of the program choose a next step. The handler should not suggest that the read succeeded when no data was available.

## Cheat sheet

| Need | Pattern |
|---|---|
| Read a file | `open(path, "r")` |
| Replace existing contents | `open(path, "w")` |
| Add to existing contents | `open(path, "a")` |
| Close after work automatically | `with open(...) as file:` |
| Read all text | `file.read()` |
| Read line by line | `for line in file:` |
| Remove line ending | `line.rstrip()` |
| Read table rows as dictionaries | `csv.DictReader(file)` |
| Write dictionary rows | `csv.DictWriter(file, fieldnames=...)` |

## Try it yourself

### Easy: save a rehearsal note

Write a short two-line note and read it back.

```python run
# Complete the save a rehearsal note task.
# Sample data: end=""
# Write your code below and print the result
```


:::solution
The program writes both strings with line endings, then reads and prints the resulting text.

```python
with open("cs50p-io-rehearsal.txt", "w") as file:
    file.write("Doors open at six\n")
    file.write("Soundcheck at five\n")
with open("cs50p-io-rehearsal.txt") as file:
    print(file.read(), end="")
```
:::

### Medium: append another result

Create a starting entry and append one more without replacing the first.

```python run
# Complete the append another result task.
# Sample data: end=""
# Write your code below and print the result
```


:::solution
The append mode preserves the first saved line and adds the second at the end.

```python
with open("cs50p-io-rounds2.txt", "w") as file:
    file.write("Round one\n")
with open("cs50p-io-rounds2.txt", "a") as file:
    file.write("Round two\n")
with open("cs50p-io-rounds2.txt") as file:
    print(file.read(), end="")
```
:::

### Challenge: read a CSV table

Create a tiny CSV roster, then read each row using its column names.

```python run
# Complete the read a CSV table task.
# Sample data: roster_csv = "name,score\nAsha,92\nBo,85"
# Write your code below and print the result
```


:::solution
The header row supplies the dictionary keys. The loop reads the data row and prints the requested fields.

```python
import csv

with open("cs50p-io-roster.csv", "w") as file:
    file.write("player,position\n")
    file.write("Noor,keeper\n")
with open("cs50p-io-roster.csv") as file:
    for row in csv.DictReader(file):
        print(row["player"], "-", row["position"])
```
:::

## Recap

- Files preserve data after a program ends; `with` closes them after use.
- Read mode reads, write mode replaces, and append mode adds to existing text.
- Lines include line endings, which can be removed with `rstrip()`.
- Use CSV dictionary tools for named table columns and handle a missing path with `FileNotFoundError`.

Based on Harvard's CS50P
Reference: Python documentation, Input and Output
