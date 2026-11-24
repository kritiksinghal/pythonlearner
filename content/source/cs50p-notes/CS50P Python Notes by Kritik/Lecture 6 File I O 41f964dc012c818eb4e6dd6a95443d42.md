# Lecture 6: File I/O

<aside>
🧠

**Big idea:** variables vanish when your program ends, but files stay. Reading and writing files lets your program remember things.

</aside>

## 🧠 Understand it first

A file lets your program keep information after it stops running. Opening a file connects your program to it; reading gets saved text back, and writing changes what is saved. Use `with open(...)` so Python closes the file automatically after the indented work finishes.

The mode matters: `"r"` reads, `"w"` writes from scratch and erases the old contents, and `"a"` adds to the end. A CSV is a table stored as text, so use Python's `csv` tools to keep rows and columns straight. Remember that values read from a file often start as strings and may need conversion.

![A visual guide to Lecture 6: how a file is opened, used, and safely closed.](Lecture%206%20File%20I%20O/cs50p-lecture-6-files-visual.svg)

A visual guide to Lecture 6: how a file is opened, used, and safely closed.

### 🔍 See the file modes in action

```python
with open("notes.txt", "w", encoding="utf-8") as file:
    file.write("First line\n")

with open("notes.txt", "r", encoding="utf-8") as file:
    print(file.read())
```

1. `open` connects your program to the file. The mode `"w"` creates it or replaces its old contents.
2. `write` stores text. The two-character escape `\n` represents one newline in the saved file.
3. The `with` block closes the file automatically when its indented body ends.
4. The second `with` opens the file in read mode, and `read()` returns its contents as a string.

CSV files use rows and columns, so `csv.reader` or `csv.DictReader` is safer than splitting each line by commas yourself.

<aside>
🛑

**Oops!** `"w"` means “write from the beginning,” so it erases the previous contents. Use `"a"` to append. Use `"r"` to read. If the file is user-provided, prepare for it to be missing.

</aside>

## 📝 Notes

### 1. Writing

```python
name = input('Name: ')

with open('names.txt', 'a') as file:
    file.write(name + '\n')
```

`'\n'` is a new line. Without it, all names would be glued together on one line.

### 2. Reading

```python
with open('names.txt') as file:
    for line in file:
        print(line.rstrip())
```

Each line ends with a hidden `'\n'`. `rstrip()` removes it. Other ways to read:

```python
with open('names.txt') as file:
    text = file.read()        # whole file as one string

with open('names.txt') as file:
    lines = file.readlines()  # list of lines
```

### 3. Sorting what you read

```python
with open('names.txt') as file:
    names = [line.rstrip() for line in file]

for name in sorted(names):
    print(name)
```

### 4. File modes

| Mode | Meaning | Careful! |
| --- | --- | --- |
| `'r'` | read (default) | file must exist |
| `'w'` | write | **erases** old content |
| `'a'` | append | adds to the end |

### 5. CSV files

A **CSV** file is a simple table with values separated by commas.

```python
import csv

with open('students.csv') as file:
    reader = csv.DictReader(file)
    for row in reader:
        print(row['name'], 'lives in', row['house'])
```

`DictReader` turns each row into a dictionary, using the header row for keys. To write:

```python
import csv

with open('students.csv', 'a') as file:
    writer = csv.DictWriter(file, fieldnames=['name', 'house'])
    writer.writerow({'name': 'Hermione', 'house': 'Gryffindor'})
```

### 6. Handling a missing file

```python
try:
    with open('data.txt') as file:
        print(file.read())
except FileNotFoundError:
    print('File not found')
```

## 📖 Key definitions

| Term | Simple meaning |
| --- | --- |
| File I/O | Reading from and writing to files |
| `open()` | Gets a file ready to use |
| `with` | Closes the file automatically |
| Mode | Says how to open: read, write or append |
| CSV | Comma-separated values, a simple table format |
| `DictReader` | Reads each CSV row as a dictionary |
| `rstrip()` | Removes trailing whitespace such as `\n` |

## ⚠️ Common mistakes

- Opening a file with `'w'` and wiping out data you wanted to keep.
- Forgetting `'\n'` when writing, so everything lands on one line.
- Forgetting `rstrip()`, so output has blank lines between names.
- Reading a file that does not exist, which raises `FileNotFoundError`.

## 🧑‍💻 Programming questions

- 🧑‍💻 P1. **Guest book.** Ask for a name and add it to `names.txt` without erasing earlier names.
    
    💡 Hint: mode `'a'` and `'\n'`.
    
    ```python
    name = input('Name: ')
    with open('names.txt', 'a') as f:
        f.write(name + '\n')
    ```
    
- 🧑‍💻 P2. **Sorted names.** Read `names.txt` and print the names in alphabetical order.
    
    💡 Hint: build a list with `rstrip()`, then `sorted()`.
    
    ```python
    with open('names.txt') as f:
        names = [line.rstrip() for line in f]
    
    for n in sorted(names):
        print(n)
    ```
    
- 🧑‍💻 P3. **Line and word counter.** Count the lines and words in a text file given on the command line, and show a clear message if the file is missing.
    
    💡 Hint: `sys.argv[1]`, `split()` on each line, `FileNotFoundError`.
    
    ```python
    import sys
    
    lines = words = 0
    try:
        with open(sys.argv[1]) as f:
            for line in f:
                lines += 1
                words += len(line.split())
        print(lines, 'lines,', words, 'words')
    except FileNotFoundError:
        sys.exit('File not found')
    except IndexError:
        sys.exit('Usage: python count.py file')
    ```
    
- 🧑‍💻 P4. **CSV reader.** Given `students.csv` with columns `name,house`, print each student as `Harry is in Gryffindor`.
    
    💡 Hint: `csv.DictReader`.
    
    ```python
    import csv
    
    with open('students.csv') as f:
        for row in csv.DictReader(f):
            print(f"{row['name']} is in {row['house']}")
    ```
    
- 🧑‍💻 P5. **Copy a file.** Copy the contents of `a.txt` into `b.txt`, converted to upper case.
    
    💡 Hint: read from one file, write to another, using two `with` lines.
    
    ```python
    with open('a.txt') as src, open('b.txt', 'w') as dst:
        for line in src:
            dst.write(line.upper())
    ```
    

## 🎯 MCQs

- 🎯 Q1. Which mode adds text to the end of a file? (A) r (B) w (C) a (D) x
    
    **Answer: (C).**
    
- 🎯 Q2. What happens if you open an existing file with `'w'`? (A) text is added to the end (B) its old content is erased (C) it is read only (D) nothing
    
    **Answer: (B).**
    
- 🎯 Q3. Why use `with open(...)`? (A) it is faster (B) it closes the file automatically (C) it opens Excel (D) it encrypts the file
    
    **Answer: (B).**
    
- 🎯 Q4. What does `rstrip()` remove from a line read from a file? (A) the first letter (B) all spaces inside (C) trailing whitespace such as the newline (D) the file
    
    **Answer: (C).**
    
- 🎯 Q5. Which error appears when a file does not exist? (A) ValueError (B) KeyError (C) NameError (D) FileNotFoundError
    
    **Answer: (D).**
    

## ✅ Quick recap

- `open()` with modes `'r'`, `'w'`, `'a'`, always inside `with`.
- Lines end with `'\n'`; use `rstrip()` when reading, add `'\n'` when writing.
- `csv.DictReader` gives each row as a dictionary.
- Catch `FileNotFoundError` for missing files.