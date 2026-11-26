---
title: "JSON and CSV"
curriculumTitle: "JSON and CSV"
track: "Python from zero"
module: "M6 Errors, files, modules"
order: 32
level: "Intermediate"
summary: "Read and create two common text data formats with Python's json and csv modules."
prerequisites:
  - "A tour of the standard library"
learningGoals:
  - "Convert between JSON text and Python values"
  - "Recognize the JSON values Python can represent directly"
  - "Read and write comma-separated rows with csv.reader and csv.writer"
  - "Use DictReader and DictWriter when column names help"
relatedProblems: []
---

## What you will learn

- How **JSON** stores nested structured data as text
- How `json.loads()` and `json.dumps()` convert between JSON and Python values
- How **CSV** stores rows and columns of tabular data
- How the `csv` module reads and writes rows safely
- How to choose a format based on the structure of your information

## Why this matters

Programs often exchange information with websites, spreadsheets, and other programs. JSON is common when data has nested objects and lists, while CSV is convenient for rows and columns that fit a table. Python includes modules for both formats, so you can work with them without splitting text manually. Understanding the difference helps you preserve values correctly instead of treating every file as an arbitrary string.

## The big idea

JSON is like a labeled form that can contain smaller forms and lists. It describes strings, numbers, booleans, null values, arrays, and objects. Python's `json` module converts between those text structures and familiar Python dictionaries, lists, strings, numbers, booleans, and `None`.

CSV is like a grid written one row per line, with fields separated by a delimiter such as a comma. A CSV parser knows that quotes can surround a field containing a comma. The **CSV format** is often less rigid than people expect, so use Python's `csv` module instead of splitting each line on commas yourself.

## Step by step

### Parse JSON text into Python values

`json.loads()` takes a JSON string and returns a corresponding Python value. The final `s` in `loads` means the input is a string.

```python run
import json

text = '{"artist": "Nila", "plays": 14, "favorite": true}'
track = json.loads(text)
print(track["artist"])
print(track["plays"])
print(track["favorite"])
```

```output
Nila
14
True
```

The JSON object becomes a Python dictionary. JSON `true` becomes Python `True`; JSON uses lowercase spellings for its booleans. Once parsed, normal dictionary indexing retrieves the values.

### Convert a Python value into JSON text

`json.dumps()` takes a Python value and returns JSON text. The final `s` again means the function works with a string rather than directly reading or writing a file.

```python run
import json

scorecard = {"team": "Comets", "runs": 142, "won": False}
encoded = json.dumps(scorecard)
print(encoded)
```

```output
{"team": "Comets", "runs": 142, "won": false}
```

The output is a string that follows JSON syntax. Python's `False` becomes JSON `false`. Dictionaries preserve insertion order, and the encoder uses that order in the resulting text.

By default, non-ASCII characters may be written using escape sequences so the JSON text stays within ASCII characters. The data still represents the same character when parsed. If people will read the file directly, `ensure_ascii=False` keeps those characters visible in the text. The file's eventual encoding is a separate concern; JSON is text, and reading or writing it on disk is covered in **Reading and writing files**.

```python run
import json

message = {"greeting": "नमस्ते"}
print(json.dumps(message, ensure_ascii=False))
```

```output
{"greeting": "नमस्ते"}
```

Choose readable output when humans inspect the data. If a system expects a particular JSON representation, follow that system's requirements and test by parsing the result back into Python.

### Make JSON easier to read

Use the `indent` argument to add whitespace and line breaks. This is helpful when a person will inspect the file; compact text may be better when storage size matters.

```python run
import json

details = {"game": "Final", "overs": 20}
print(json.dumps(details, indent=2))
```

```output
{
  "game": "Final",
  "overs": 20
}
```

Indentation changes formatting, not the represented data. A program can parse either compact or indented JSON with `loads()`.

### Work with nested objects and lists

JSON values can contain lists and nested objects. After parsing, these become lists and dictionaries that you can access using their normal operations.

```python run
import json

text = '{"city": "Pune", "forecast": [29, 31, 28]}'
weather = json.loads(text)
print(weather["city"])
print(weather["forecast"][1])
```

```output
Pune
31
```

The `forecast` field is a list. Its second value has index one. You can iterate through the list or use its values in calculations after parsing.

### Notice what JSON can represent

JSON has no date, set, or tuple type. Python's default JSON encoder handles dictionaries, lists, strings, numbers, booleans, and `None` (with limitations on dictionary keys). Convert specialized values to a supported representation before encoding them.

```python run
import json

reminder = {"title": "Practice", "minutes": 30, "done": None}
print(json.dumps(reminder, sort_keys=True))
```

```output
{"done": null, "minutes": 30, "title": "Practice"}
```

Python `None` becomes JSON `null`. The `sort_keys=True` option orders object keys in the output, which can make comparisons and reviews easier. It does not change dictionary meaning.

### Parse a CSV table into rows

The `csv.reader` function parses rows from a text stream. Use `StringIO` here to simulate file content in the browser; on disk, pass the text file opened with `newline=""` to the reader.

```python run
import csv
from io import StringIO

text = "song,plays\nBlue Kite,12\nSmall River,7\n"
for row in csv.reader(StringIO(text)):
    print(row)
```

```output
['song', 'plays']
['Blue Kite', '12']
['Small River', '7']
```

CSV fields are read as strings, including values that look like numbers. The first row often contains column names, but the `reader` treats it as an ordinary row until you decide to use it as a header.

### Handle a field that contains a comma

CSV quoting allows a field to contain the delimiter. A parser understands the quotes and keeps the phrase together as one value.

```python run
import csv
from io import StringIO

text = 'artist,album\n"Mira, N",Night Train\n'
rows = list(csv.reader(StringIO(text)))
print(rows[1])
```

```output
['Mira, N', 'Night Train']
```

Splitting the line at each comma would incorrectly break the artist's name into two fields. `csv.reader` handles quoting, delimiters, and escaped quotes according to CSV rules.

### Use headers with `DictReader`

`csv.DictReader` uses the first row as field names and returns each later row as a dictionary. Named fields can make code easier to read than numeric column positions.

```python run
import csv
from io import StringIO

text = "player,runs\nDev,44\nSana,63\n"
for player in csv.DictReader(StringIO(text)):
    print(f"{player['player']}: {player['runs']}")
```

```output
Dev: 44
Sana: 63
```

The row values remain strings, so convert `runs` with `int()` before doing arithmetic. Header spelling must match the key you use, including capitalization and spaces.

### Write a CSV row

`csv.writer` turns a sequence of values into a CSV row. It handles quoting when a value contains a comma.

```python run
import csv
from io import StringIO

output = StringIO(newline="")
writer = csv.writer(output)
writer.writerow(["Station", "Visitors"])
writer.writerow(["Lake, East", 208])
print("\n".join(output.getvalue().splitlines()), end="\n")
```

```output
Station,Visitors
"Lake, East",208
```

The writer inserts delimiters and quotes the first station value because it contains a comma. `StringIO` captures the output in memory; `splitlines()` makes its line endings display consistently in this browser example. When writing a disk CSV file, open it with `newline=""` and pass the file object to `csv.writer`.

The `newline=""` argument matters because CSV readers and writers manage line endings themselves. Without it, some platforms can introduce extra blank lines when writing. The comma is the default delimiter, but the module can use another one through its `delimiter` argument when the file follows a tab-separated or otherwise defined format. Never assume that every file with `.csv` in its name uses exactly the same dialect; inspect its documented structure.

### Write rows with named columns

`DictWriter` maps dictionary values to the field names you provide. Supplying `fieldnames` makes the expected column order explicit.

```python run
import csv
from io import StringIO

output = StringIO(newline="")
writer = csv.DictWriter(output, fieldnames=["title", "rating"])
writer.writeheader()
writer.writerow({"title": "Cloud Atlas", "rating": 5})
print("\n".join(output.getvalue().splitlines()), end="\n")
```

```output
title,rating
Cloud Atlas,5
```

`writeheader()` writes the column names first. Then `writerow()` takes a dictionary keyed by those names. `splitlines()` removes the CSV writer's line-ending characters before printing the captured text. Use a consistent schema so rows have the values your reader expects.

## What Python is doing behind the scenes

JSON and CSV are text formats, but their structures differ. JSON parsers recognize object braces, arrays, strings, numbers, booleans, and null. The decoder creates Python dictionaries, lists, and scalar values. The encoder performs the reverse conversion for supported values.

CSV parsers walk through rows and fields while respecting quoting rules. They return strings because CSV itself does not reliably define whether a field is a number, date, or identifier. Your program decides how to interpret each field. The `csv` module is designed to work with text streams; using `newline=""` with disk files lets the module manage newline handling consistently.

| Text representation | Python value after parsing |
|---|---|
| JSON object `{...}` | `dict` |
| JSON array `[...]` | `list` |
| JSON `true` or `false` | `True` or `False` |
| JSON `null` | `None` |
| CSV field `"37"` | string `"37"` |
| CSV quoted field with comma | one string containing the comma |

JSON is useful for nested data and API responses. CSV is useful for rectangular tables that people may open in spreadsheet software. Neither format automatically validates your application's rules; after parsing, check that required keys exist, types are sensible, and values are allowed. Files from disk are covered in **Reading and writing files**.

## Common mistakes

### Confusing `loads()` and `dumps()`

`loads()` parses a JSON string into Python data. `dumps()` turns a Python value into JSON text. The “s” names work with strings; the related `load()` and `dump()` functions work with file-like objects.

### Using Python syntax as JSON

JSON booleans are lowercase `true` and `false`, and the empty value is `null`. Python uses `True`, `False`, and `None`. Use the JSON parser and encoder instead of trying to make one syntax serve both formats.

### Splitting CSV lines on commas

A quoted field may contain a comma, so `line.split(",")` can produce the wrong columns. Use `csv.reader` or `csv.DictReader` to interpret the format.

### Expecting CSV numbers to arrive as integers

CSV readers return text fields as strings. Convert values such as a score with `int()` after checking that the contents are numeric.

### Forgetting that JSON cannot encode every Python object by default

Values such as sets and custom objects need a deliberate conversion. Convert them to a supported representation or provide a documented custom encoder; do not assume every Python value has a JSON equivalent.

## Cheat sheet

| Task | Tool | Result |
|---|---|---|
| Parse JSON string | `json.loads(text)` | Python values |
| Create JSON string | `json.dumps(value, indent=2)` | JSON text |
| Read CSV rows | `csv.reader(stream)` | Lists of strings |
| Read rows by name | `csv.DictReader(stream)` | Dictionaries |
| Write a CSV row | `csv.writer(stream).writerow(values)` | CSV text |
| Write named columns | `csv.DictWriter(stream, fieldnames=...)` | Header and rows |
| Parse in memory | `StringIO(text)` | Text stream |

## Try it yourself

### Easy: read a JSON value

Parse a JSON string containing a game name and print the value.

```python run
# Complete the read a JSON value task.
# Sample data: game = json.loads('{"name": "Sky Sprint", "levels": 4}')
# Write your code below and print the result
```


:::solution
`loads()` converts the JSON object into a dictionary, and the `name` key retrieves the game title.

```python
import json

game = json.loads('{"name": "Sky Sprint", "levels": 4}')
print(game["name"])
```
:::

### Medium: read CSV with headers

Use `DictReader` to print each player's name and convert their score to an integer.

```python run
# Complete the read CSV with headers task.
# Sample data: text = 'name,score\nAsha,81\nImran,92\n'
# Write your code below and print the result
```


:::solution
DictReader maps each row to column names. The `score` value is a string, so call `int()` before using it as a number.

```python
import csv
from io import StringIO

text = "name,score\nAsha,81\nImran,92\n"
for row in csv.DictReader(StringIO(text)):
    print(row["name"], int(row["score"]))
```
:::

### Challenge: encode a Python dictionary

Turn a small event dictionary into readable JSON.

```python run
# Complete the encode a Python dictionary task.
# Sample data: event = {'name': 'Night Run', 'distance_km': 5}
# Write your code below and print the result
```


:::solution
`dumps()` serializes the dictionary to JSON text. `indent=2` adds whitespace so the structure is easy to inspect.

```python
import json

event = {"name": "Night Run", "distance_km": 5}
print(json.dumps(event, indent=2))
```
:::

## Recap

- JSON represents nested objects and lists; use `loads()` and `dumps()` with strings.
- Python booleans and `None` are written as lowercase JSON booleans and `null`.
- CSV is tabular text; parse it with `csv` rather than splitting on commas.
- CSV readers return strings, so convert numeric fields deliberately.
- `DictReader` and `DictWriter` make header-based tables easier to understand.

Reference: Python documentation, json — JSON encoder and decoder
