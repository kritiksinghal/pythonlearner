---
title: "To-do list with files"
curriculumTitle: "To-do list with files"
track: "Python from zero"
module: "M9 Projects"
order: 47
level: "Intermediate"
type: project
runnableMin: 3
summary: "Build a small task list that saves and reloads tasks from a text file."
prerequisites:
  - "Text adventure"
learningGoals:
  - "Represent tasks as data while the program runs"
  - "Read and write a text file using pathlib"
  - "Separate task operations into functions"
  - "Keep browser examples runnable with in-memory streams"
relatedProblems: []
---

## The goal

Build a command-line to-do list that can add tasks, show saved tasks, and mark a task complete. The program will store one task per line in a text file so the list survives after the program ends. This is a small practical project for combining lists, functions, and file operations.

Browser runnable examples use `StringIO` to simulate a file in memory. The complete terminal version uses a real file and `input()`, shown in a plain Python block with a sample session. In runnable project blocks, inputs are preset variables; no runnable block calls `input()`.

## What you will practice

- **Task state**: represent each task with its text and completion status.
- **Functions**: split loading, saving, displaying, and updating into named jobs.
- **Text files**: read and write the list between program runs.
- **Paths**: use `Path` for a readable file location.
- **Testing**: use preset actions to check that updates are saved consistently.

The task file will use simple markers: `[ ]` for incomplete and `[x]` for complete. Each line represents one task. This format is intentionally small; CSV and JSON formats are covered in **JSON and CSV**.

Choose a format that is easy to inspect while learning. A plain text editor can show each task and its marker, so you can tell whether the save function ran. A format with more fields may be useful later, but it also needs a more careful reader and writer. Keep the first data model small enough that you can explain how every value reaches the file and how it returns to memory.

## Plan

1. Represent each task as a dictionary with `text` and `done` fields.
2. Write a helper that formats one task as a line of text.
3. Use in-memory text to practice reading and writing in browser-safe examples.
4. Build functions that load, save, list, add, and complete tasks.
5. In the terminal version, store data in `todo.txt` using `Path` and `with`.
6. Run the program, add a task, restart it, and confirm the saved task remains.

Decide what happens if the task file does not exist yet. For this project, start with an empty list. Keep the first version simple: one line per task, no priorities, and no due dates. A reliable small list is more useful than many options that are not saved correctly.

The file path is interpreted from the program's current working directory. If you run `python3.12 todo.py` while standing in a different folder, `todo.txt` may be created there instead of beside the script. Run the command from the project folder or make the path relative to the script itself. This first version keeps the current-directory behavior visible so you can see how a relative path works.

## Build it step by step

### Make a task record

Use a dictionary to store the task description and whether it is complete. The Boolean field helps the program decide which marker to display.

```python run
task = {"text": "Send the rehearsal notes", "done": False}
print(task["text"])
print(task["done"])
```

```output
Send the rehearsal notes
False
```

The task is incomplete at first. Dictionaries let the code refer to values by descriptive keys rather than remembering which list position means “done.”

### Format a task line

Create one function that converts a task dictionary into the format saved in the file. Keep the marker consistent so the reader can parse it later.

```python run
def format_task(task):
    marker = "x" if task["done"] else " "
    return f"[{marker}] {task['text']}"

task = {"text": "Charge the recorder", "done": True}
print(format_task(task))
```

```output
[x] Charge the recorder
```

Completed tasks use a lowercase `x`; incomplete tasks leave a space between the brackets. The description follows the marker on the same line.

### Parse one saved line

The matching parser reads the marker and text back into a dictionary. This example assumes each line starts with the two-character marker and one space.

```python run
def parse_task(line):
    done = line[1].lower() == "x"
    text = line[4:].rstrip("\n")
    return {"text": text, "done": done}

print(parse_task("[ ] Buy fresh batteries\n"))
```

```output
{'text': 'Buy fresh batteries', 'done': False}
```

The parser checks the second character to determine completion and takes the task text after the marker. When reading a hand-edited file, a more defensive version can check that each line has the expected brackets.

### Save several tasks in memory

Join formatted task lines with newline characters and write them to a memory stream. This demonstrates the saved text format without creating a disk file in the browser.

```python run
from io import StringIO

def format_task(task):
    marker = "x" if task["done"] else " "
    return f"[{marker}] {task['text']}"

tasks = [
    {"text": "Book a practice court", "done": False},
    {"text": "Return the borrowed bat", "done": True},
]
saved_text = "".join(format_task(task) + "\n" for task in tasks)
file = StringIO(saved_text)
print(file.read(), end="")
```

```output
[ ] Book a practice court
[x] Return the borrowed bat
```

Each task becomes one line. The file can be read one line at a time when loading, which keeps the format simple and handles multiple tasks naturally.

### Load tasks from a text stream

Read each line, ignore blank lines, and parse the others. The same function can accept an open disk file in the terminal version.

```python run
from io import StringIO

def parse_task(line):
    done = line[1].lower() == "x"
    return {"text": line[4:].rstrip("\n"), "done": done}

def load_tasks(file):
    return [parse_task(line) for line in file if line.strip()]

sample = StringIO("[ ] Water balcony plants\n[x] Collect the parcel\n")
print(load_tasks(sample))
```

```output
[{'text': 'Water balcony plants', 'done': False}, {'text': 'Collect the parcel', 'done': True}]
```

The loader converts the saved representation back to task dictionaries. Passing a file-like object makes the logic usable with both StringIO and a disk file opened in a `with` block.

Because each line has a fixed layout, the formatter and parser must agree. The description begins at index four because the marker occupies positions zero through two and a space occupies position three. If the marker format changes, update both functions and test reading data written by the new formatter. For a project used by other people, it is also wise to handle malformed lines with a clear message rather than letting an indexing error appear without context.

### Add a task

An add function can append a new incomplete task. Return a new task list or update the existing list; this version changes the list it receives.

```python run
def add_task(tasks, description):
    tasks.append({"text": description, "done": False})

tasks = [{"text": "Label the storage boxes", "done": False}]
add_task(tasks, "Print the event schedule")
print([task["text"] for task in tasks])
```

```output
['Label the storage boxes', 'Print the event schedule']
```

The function changes the list by appending one dictionary. A real interface should reject an empty description before adding it.

### Mark a task complete

Use a zero-based list position to find the selected task and change its `done` field. The menu can show human-friendly task numbers starting at one, then convert them to an index.

```python run
def complete_task(tasks, number):
    index = number - 1
    if 0 <= index < len(tasks):
        tasks[index]["done"] = True
        return True
    return False

tasks = [{"text": "Upload the match photos", "done": False}]
print(complete_task(tasks, 1))
print(tasks[0]["done"])
```

```output
True
True
```

The function validates the requested number before changing the list. It returns whether an update happened so the caller can print an appropriate message.

The Boolean return value separates the update operation from the user interface. A caller can display one message when the number was valid and another when it was outside the list. Keeping those responsibilities apart also makes the helper easier to test with preset data.

### Display task numbers

Number each task for the user while keeping Python's list positions internal. `enumerate()` supplies positions starting at zero; use `start=1` for a numbered menu.

```python run
tasks = [
    {"text": "Reserve a keyboard", "done": False},
    {"text": "Confirm sound check", "done": True},
]
for number, task in enumerate(tasks, start=1):
    status = "done" if task["done"] else "open"
    print(f"{number}. {task['text']} ({status})")
```

```output
1. Reserve a keyboard (open)
2. Confirm sound check (done)
```

The visible numbers are one-based, which most people expect. `complete_task()` converts that number into a list index before using it.

Saving after each change means a crash or quit does not discard the most recent action. For a very large task file, rewriting the whole list after each change might be inefficient, but this project keeps a small personal list where the simpler approach is appropriate. The file is the durable source of truth; the list in memory is only the program's current working copy.

## The complete program

This browser-safe version simulates loading and saving by using `StringIO`. It runs a short preset sequence: load two tasks, mark one complete, add another, and display the updated saved text. The actual disk version follows the same function structure but uses `Path.open()`.

```python run
from io import StringIO

def parse_task(line):
    done = line[1].lower() == "x"
    return {"text": line[4:].rstrip("\n"), "done": done}

def format_task(task):
    marker = "x" if task["done"] else " "
    return f"[{marker}] {task['text']}"

def load_tasks(file):
    return [parse_task(line) for line in file if line.strip()]

def save_tasks(tasks, file):
    for task in tasks:
        file.write(format_task(task) + "\n")

saved = StringIO("[ ] Refill the water bottle\n[ ] Print the set list\n")
tasks = load_tasks(saved)
tasks[0]["done"] = True
tasks.append({"text": "Pack the rain cover", "done": False})

updated = StringIO()
save_tasks(tasks, updated)
print(updated.getvalue(), end="")
```

```output
[x] Refill the water bottle
[ ] Print the set list
[ ] Pack the rain cover
```

The two formatting functions are the bridge between task dictionaries and the text file. The loader and saver accept file-like objects, so their logic can be checked with memory streams. The terminal version below connects these helpers to disk.

For a real interactive command-line version, save this plain Python program as `todo.py`. It loads from `todo.txt`, asks for an action, and saves after changes. It uses `input()`, so it is shown as plain Python with a sample session, not as a runnable browser block.

```python
from pathlib import Path

TASK_FILE = Path("todo.txt")

def parse_task(line):
    done = line[1].lower() == "x"
    return {"text": line[4:].rstrip("\n"), "done": done}

def format_task(task):
    marker = "x" if task["done"] else " "
    return f"[{marker}] {task['text']}"

def add_task(tasks, description):
    tasks.append({"text": description, "done": False})

def complete_task(tasks, number):
    index = number - 1
    if 0 <= index < len(tasks):
        tasks[index]["done"] = True
        return True
    return False

def load_tasks():
    if not TASK_FILE.exists():
        return []
    with TASK_FILE.open(encoding="utf-8") as file:
        return [parse_task(line) for line in file if line.strip()]

def save_tasks(tasks):
    with TASK_FILE.open("w", encoding="utf-8") as file:
        for task in tasks:
            file.write(format_task(task) + "\n")

tasks = load_tasks()
action = input("Choose add, list, or done: ").strip().lower()

if action == "add":
    description = input("Task: ").strip()
    if description:
        add_task(tasks, description)
        save_tasks(tasks)
        print("Task saved")
elif action == "list":
    for number, task in enumerate(tasks, start=1):
        print(f"{number}. {format_task(task)}")
elif action == "done":
    number = int(input("Task number: "))
    if complete_task(tasks, number):
        save_tasks(tasks)
        print("Task completed")
    else:
        print("No task with that number")
else:
    print("Unknown action")
```

Terminal command:

```bash
python3.12 todo.py
```

Sample session after the program starts with an empty task file:

```text
Choose add, list, or done: add
Task: Email the music teacher
Task saved
```

The task is written to `todo.txt`. Run the program again and choose `list` to see it after restarting. For a production version, handle a nonnumeric task number; exceptions were covered in **try and except**. The file is created in the current working directory, so run the program from the project folder.

The interactive version asks for a task number and converts the response with `int()`. If someone types a word, that conversion raises `ValueError`; the current complete program reports the basic case but does not yet retry. A useful extension is to catch that specific exception, show a short prompt, and ask again. Similarly, the `list` action should tell the user when there are no tasks rather than showing an empty screen. These are product decisions, so implement them only after the save-and-load cycle works.

## Make it yourself

Add one improvement at a time and keep the existing save format valid.

1. Add a `remove` action that deletes a selected task.
2. Display a friendly message when there are no tasks.
3. Reject blank descriptions and task numbers outside the displayed range.
4. Add a second text file for archived completed tasks.
5. Store due dates or priorities only after the simple version works.

Test by adding a task, listing it, marking it complete, exiting, and listing it again. The status should remain complete after the restart. If a task disappears, check whether `save_tasks()` ran after the change and whether the program opened the same path on both runs.

The project currently stores one task per line, so task text containing a newline would break the format. A later JSON lesson can represent records more explicitly. Keep this first version focused on reliable file persistence and clear task operations.

Before adding more actions, verify the complete cycle: start with no file, add a task, start the program again, list it, mark it done, and start it once more. This catches problems that a single in-memory run cannot show. Look at the saved marker after the last run and confirm it is `[x]`. If you change the task text format, create a fresh test file or write a small migration rather than leaving old lines in a format the parser no longer understands.

Reference: Python documentation, Reading and Writing Files
