---
title: "Reading and writing files"
curriculumTitle: "Reading and writing files"
track: "Python from zero"
module: "M6 Errors, files, modules"
order: 29
level: "Intermediate"
summary: "Learn how Python opens, reads, writes, and closes text files safely."
runnableMin: 3
prerequisites:
  - "try-and-except"
learningGoals:
  - "Open a file in a deliberate mode"
  - "Read text as a whole or one line at a time"
  - "Write and append text without confusing their effects"
  - "Use with so Python closes a file after its work"
relatedProblems: []
---
## What you will learn

- What a **file object** represents after you open a path
- How read mode, write mode, and append mode differ
- Why a **context manager** introduced by `with` closes a file reliably
- How text encoding and newline choices affect files
- How to inspect a small file operation from a terminal

## Why this matters

Variables disappear when a program ends, but files let a program keep notes between runs. A music player can save a queue, a game can store a score, and a club can keep a list of members. Reading and writing files is the first step toward persistent data. File operations also involve paths and permissions, so it is useful to make the program's intent explicit and close resources reliably.

## The big idea

Opening a file is like checking out a notebook from a shelf. You choose whether you plan to read, replace, or add pages. Python gives you a **file object**, which is the program's connection to that file. When you finish, close the connection so the operating system can release it and make buffered output available.

The `with` statement is the usual way to manage a file. It ensures that the file is closed after the indented block finishes, including when an exception interrupts the work. This lesson demonstrates small in-memory examples that run in the browser and terminal examples for actual files on disk. Paths, files, and the `open()` behavior are described in the Python 3.12 documentation.

## Step by step

### Read text from an in-memory file

An in-memory text stream behaves like a tiny file without creating a file on disk. It lets us safely practice the reading methods in the browser.

```python run
from io import StringIO

notebook = StringIO("practice at 5\nbring a ball\n")
contents = notebook.read()
print(contents, end="")
```

```output
practice at 5
bring a ball
```

`StringIO` stores text in memory and provides methods similar to a text file. The `read()` method returns the remaining text. The `end=""` argument prevents `print()` from adding an extra newline after text that already ends in one.

### Read one line at a time

For a long file, you can loop over the file object so each line can be processed in sequence. The example uses in-memory text but the loop pattern is the same for a file opened from disk.

```python run
from io import StringIO

schedule = StringIO("Warm-up\nBatting drills\nCool-down\n")
for line in schedule:
    print(line.strip())
```

```output
Warm-up
Batting drills
Cool-down
```

The loop gets one line at a time. `strip()` removes the line-ending newline and any surrounding whitespace. If spaces are meaningful in your data, use a narrower operation such as `rstrip("\n")` instead.

### Read all lines into a list

The `readlines()` method returns the remaining lines as a list of strings. Each string normally keeps its line ending, so inspect or remove it before displaying or comparing the text.

```python run
from io import StringIO

menu = StringIO("Tea\nLime soda\nMango juice\n")
items = menu.readlines()
print([item.strip() for item in items])
```

```output
['Tea', 'Lime soda', 'Mango juice']
```

This is convenient for small files when you need all lines together. A very large file can use a lot of memory if you load every line at once, so looping over the file object is often a better choice.

### Write text into an in-memory file

Writing replaces the current contents when a real file is opened in mode `"w"`. The memory example shows that `write()` adds exactly the string you provide; it does not insert a newline automatically.

```python run
from io import StringIO

report = StringIO()
report.write("Team: Comets\n")
report.write("Wins: 6\n")
print(report.getvalue(), end="")
```

```output
Team: Comets
Wins: 6
```

Each call writes characters at the stream's current position. The `\n` characters create line breaks. `getvalue()` is a StringIO helper for retrieving the stored text; an ordinary file object does not use this method.

### Append text rather than replacing it

When working with an in-memory stream, seek to the end before writing more text. For real files, mode `"a"` opens the file for appending, preserving existing contents.

```python run
from io import StringIO

log = StringIO("Warm-up completed\n")
log.seek(0, 2)
log.write("Match begins\n")
print(log.getvalue(), end="")
```

```output
Warm-up completed
Match begins
```

`seek(0, 2)` moves the stream position to the end. A real file opened in append mode starts writes at the end without this extra positioning. Do not use write mode when you mean to preserve an existing file: opening with `"w"` clears its previous contents.

### Use a context manager for disk files

Use `with open(...)` for a real file. The context manager closes it automatically when the indented block ends. Specify `encoding="utf-8"` for ordinary Unicode text files so the intended text encoding is clear.

```bash
python3.12 -c 'from pathlib import Path; p = Path("practice-note.txt"); p.write_text("Rain stopped at 4\n", encoding="utf-8"); print(p.read_text(encoding="utf-8"), end="")'
```

```output
Rain stopped at 4
```

This terminal command creates a small file, writes text, reads it back, and prints the result. It runs Python 3.12 in the current directory. Be deliberate about where you run commands that create or replace files.

```python
from pathlib import Path

path = Path("practice-note.txt")
with path.open("w", encoding="utf-8") as file:
    file.write("Rain stopped at 4\n")

with path.open("r", encoding="utf-8") as file:
    print(file.read(), end="")
```

Sample session:

```output
Rain stopped at 4
```

The first `with` block writes to disk and then closes the file. The second opens it for reading and closes it after displaying the text. The sample uses `pathlib.Path` to represent the path; it is part of Python's standard library.

### Choose a mode that matches the task

The most common text modes are `"r"` to read, `"w"` to write from the beginning (replacing old contents), and `"a"` to append. The `"x"` mode requests a new file and fails if that path already exists. Make the mode visible in code instead of depending on the default.

```python
from pathlib import Path

path = Path("club-log.txt")
with path.open("a", encoding="utf-8") as file:
    file.write("New member: Isha\n")
```

If the file already exists, append mode preserves its previous text and adds the new line. If the file does not exist, append mode creates it. In contrast, `"w"` would discard the previous text. The destination in this example is relative to the current working directory.

### Understand the current working directory

A relative path is interpreted from the program's current working directory, which is where the process was started. It is not necessarily the folder containing the Python file. If a file appears in a surprising place, inspect the working directory or use a deliberate absolute path.

```bash
python3.12 -c 'from pathlib import Path; print(Path.cwd())'
```

Sample output:

```output
/Users/learner/python-practice
```

The path printed depends on where the command runs. The shown path is an illustrative sample, not a claim about every computer. Use your own terminal output to confirm the actual location.

### Detect a missing file deliberately

Opening a missing path in read mode raises `FileNotFoundError`. If the file is optional, catch that specific exception and respond. If it is required, a clear error may be the right behavior; avoid silently treating missing data as an empty file unless that is intended.

```python
from pathlib import Path

path = Path("scores.txt")
try:
    with path.open(encoding="utf-8") as file:
        scores = file.read()
except FileNotFoundError:
    scores = ""
    print("No saved scores yet")
```

The handler assigns `scores` on the missing-file path so later code can use it. Exception handling was covered in **try and except**. Permission failures and other operating-system problems have different exception types, so do not assume every file error means that a file is absent.

### See how writing replaces existing text

The following command writes a known file and then reads it. Running the command again with a different message replaces the previous content because the mode is `"w"`.

```bash
python3.12 -c 'from pathlib import Path; p = Path("daily-score.txt"); p.write_text("Points: 31\n", encoding="utf-8"); print(p.read_text(encoding="utf-8"), end="")'
```

```output
Points: 31
```

The `write_text()` helper opens, writes, and closes the path for you. It is convenient for small files. For controlled streaming or multiple operations, use `open()` with `with` so the chosen mode and encoding are visible.

## What Python is doing behind the scenes

When `open()` succeeds, Python returns a file object connected to the requested path. The mode controls the allowed operation and whether existing content is preserved. Text mode decodes bytes into strings when reading and encodes strings when writing. The `encoding` argument makes the decoding and encoding choice explicit.

Reading advances the file position. A call to `read()` returns the remaining text from that position; a loop over the file object advances line by line. Writing places characters at the current position, except append mode directs writes to the end. When the `with` block exits, Python asks the file object to close. Closing flushes buffered output and releases the resource.

| Mode | Main purpose | Existing file contents |
|---|---|---|
| `"r"` | Read | Preserved; file must exist |
| `"w"` | Write from the start | Replaced |
| `"a"` | Add new text | Preserved; new writes go to end |
| `"x"` | Create a new file | Existing path causes an error |

Paths may be absolute or relative. A relative path starts from the process's current working directory. The `pathlib` module offers a `Path` object with methods such as `open()`, `read_text()`, and `write_text()`. Directory creation, file format parsing, and CSV or JSON are separate topics; JSON and CSV are covered in the lesson with that title.

## Common mistakes

### Using write mode when you meant to add

Opening a file in `"w"` truncates existing text. If you want to preserve earlier entries, use append mode `"a"`. For an important file, consider making a backup before replacing its contents.

### Forgetting to close a file

An open file holds an operating-system resource. A `with` statement closes the file when its block ends, including when code inside the block raises an exception. Prefer it over manually calling `close()` in several possible paths.

### Assuming a relative path is next to your script

Relative paths use the current working directory, which depends on how you started the program. Print `Path.cwd()` or provide a deliberate path if the file is not found.

### Treating every file failure as missing data

`FileNotFoundError` means the requested path could not be found. Other `OSError` subclasses can describe permission or device problems. Catch the specific condition you can handle, and allow unexpected file failures to remain visible.

### Reading an entire large file at once

`read()` and `readlines()` load the remaining contents into memory. For a large text file, loop over the file object and process one line at a time.

## Cheat sheet

| Need | Pattern |
|---|---|
| Read all text | `with open(path, encoding="utf-8") as file: text = file.read()` |
| Read line by line | `for line in file:` |
| Replace file contents | `open(path, "w", encoding="utf-8")` |
| Append new text | `open(path, "a", encoding="utf-8")` |
| Keep the file open safely | `with open(...) as file:` |
| Check a relative path base | `Path.cwd()` |
| Handle an optional missing file | `except FileNotFoundError:` |

## Try it yourself

### Easy: read a line from memory

Use `StringIO` to practice reading a line and removing its newline.


:::tip Hint
Use the lesson idea about reading and writing files. Trace the sample values before printing so you can check each step.
:::

```sample input
sample_text = "serve\nreturn\n"
```

```expected
serve
```

```python run
# Complete the Easy: read a line from memory task.
sample_text = "serve\nreturn\n"
# Write your code below
```


:::solution
`next(practice)` reads the next line from the stream. Calling `strip()` removes its line ending for display.

```python
sample_text = "serve\nreturn\n"
from io import StringIO

practice = StringIO("serve\nreturn\n")
print(next(practice).strip())
```
:::

### Medium: write multiple lines

Use `starting_text` as the sample data. Write two lines to a memory stream and show the resulting text.


:::tip Hint
Use the lesson idea about reading and writing files. Trace the sample values before printing so you can check each step.
:::

```sample input
starting_text = ""
```

```expected
North 2
South 1
```

```python run
# Complete the Medium: write multiple lines task.
starting_text = ""
# Write your code below
```


:::solution
Each `write()` adds the provided characters. The newline characters split the entries onto separate lines.

```python
starting_text = ""
from io import StringIO

board = StringIO()
board.write("North 2\n")
board.write("South 1\n")
print(board.getvalue(), end="")
```
:::

### Challenge: choose append behavior

Use `first_entry` and `next_entry` as the sample data. Move to the end of an in-memory log, add a new line, then show both entries.


:::tip Hint
Use the lesson idea about reading and writing files. Trace the sample values before printing so you can check each step.
:::

```sample input
first_entry = "Song: Dawn Chorus\n"
next_entry = "Song: Long Way Home\n"
```

```expected
Song: Dawn Chorus
Song: Long Way Home
```

```python run
# Complete the Challenge: choose append behavior task.
first_entry = "Song: Dawn Chorus\n"
next_entry = "Song: Long Way Home\n"
# Write your code below
```


:::solution
Seeking to the end positions the stream for another write. For a disk file, append mode `"a"` provides this behavior.

```python
first_entry = "Song: Dawn Chorus\n"
next_entry = "Song: Long Way Home\n"
from io import StringIO

log = StringIO("Song: Dawn Chorus\n")
log.seek(0, 2)
log.write("Song: Long Way Home\n")
print(log.getvalue(), end="")
```
:::

## Recap

- Opening a path creates a file object with a mode that controls reading and writing.
- `"w"` replaces existing content, while `"a"` preserves it and adds at the end.
- Use `with` to ensure that Python closes a file after the block.
- Relative paths start from the process's current working directory.
- Process large files a line at a time and catch only file errors you can handle.

Reference: Python documentation, Reading and Writing Files
