---
title: "Special (dunder) methods"
curriculumTitle: "Special (dunder) methods"
track: "Python from zero"
module: "M7 Objects"
order: 36
level: "Intermediate"
summary: "Learn how selected special methods connect your classes to familiar Python operations."
prerequisites:
  - "Inheritance"
learningGoals:
  - "Recognize special method names with double underscores"
  - "Customize readable string output with __str__ and __repr__"
  - "Connect len(), equality, ordering, and addition to class methods"
  - "Implement only behaviors that have a clear meaning for the class"
relatedProblems: []
---
## What you will learn

- What **special methods** are and why they are often called dunder methods
- How `__str__` and `__repr__` affect an object's text representation
- How `__len__` connects your object to `len()`
- How `__eq__` and `__lt__` define value comparison
- How an operator such as `+` can use `__add__`

## Why this matters

Your own class can feel like a built-in Python type when familiar operations have a clear meaning for it. You may want `print()` to show a useful description, `len()` to report a collection's size, or `==` to compare two measurements by value. Special methods provide the connection between those operations and your class. You do not need to implement every special method; choose only the behavior that makes sense for the object.

## The big idea

Think of a special method as a small adapter between your class and a Python operation. The operation uses its familiar syntax, while Python calls the method behind that syntax. For example, `len(container)` asks Python to use the object's length behavior.

Special methods are names surrounded by double underscores, such as `__len__`. This is why they are often called **dunder methods** (“double underscore”). Python has defined when to call these names. Usually, you should use ordinary syntax like `len(value)` rather than call `value.__len__()` directly.

## Step by step

### Give an object a readable string with `__str__`

Define `__str__` to return text suitable for a person. The `print()` function uses this method when it needs to display an object as a string.

```python run
class Recipe:
    def __init__(self, title, minutes):
        self.title = title
        self.minutes = minutes

    def __str__(self):
        return f"{self.title} ({self.minutes} min)"

dinner = Recipe("Lemon rice", 25)
print(dinner)
```

```output
Lemon rice (25 min)
```

`print(dinner)` asks for a readable string representation. `__str__` must return a string; it should not print the description itself. The caller then decides where to display it.

### Provide a useful representation with `__repr__`

`__repr__` should return a representation useful for debugging. A precise design may aim for text that could help recreate the value, but a short informative label is already better than an opaque default address.

```python run
class ScoreEntry:
    def __init__(self, player, points):
        self.player = player
        self.points = points

    def __repr__(self):
        return f"ScoreEntry({self.player!r}, {self.points})"

entry = ScoreEntry("Rhea", 84)
print(repr(entry))
```

```output
ScoreEntry('Rhea', 84)
```

The `!r` inside the f-string uses the representation of the player name, which adds quotes around the string. `repr()` is useful in debugging because it makes data boundaries clearer than a display string might.

### Make the display and debug forms different

An object can define both text methods for different audiences. `str()` and `print()` use `__str__` when provided; `repr()` requests the debugging form.

```python run
class Meeting:
    def __init__(self, room, start):
        self.room = room
        self.start = start

    def __str__(self):
        return f"Meet in {self.room} at {self.start}"

    def __repr__(self):
        return f"Meeting({self.room!r}, {self.start!r})"

session = Meeting("Studio B", "16:30")
print(str(session))
print(repr(session))
```

```output
Meet in Studio B at 16:30
Meeting('Studio B', '16:30')
```

The display string is written for a person viewing a schedule. The representation makes the stored field values obvious. Pick formats that help the likely reader of each form.

### Connect an object to `len()`

If an object represents a collection with a meaningful size, implement `__len__`. The built-in `len()` function then calls it.

```python run
class BoxOfCards:
    def __init__(self, cards):
        self.cards = cards

    def __len__(self):
        return len(self.cards)

box = BoxOfCards(["ace", "queen", "seven"])
print(len(box))
```

```output
3
```

The method returns the length of the internal list. `__len__` should return a non-negative integer. If an object has no meaningful size, do not add this behavior only to make `len()` accept it.

### Define value equality with `__eq__`

By default, two instances of a custom class are generally compared by identity. Implement `__eq__` when equality should mean that selected data fields have equal values.

```python run
class Temperature:
    def __init__(self, celsius):
        self.celsius = celsius

    def __eq__(self, other):
        if not isinstance(other, Temperature):
            return NotImplemented
        return self.celsius == other.celsius

print(Temperature(21) == Temperature(21))
print(Temperature(21) == Temperature(19))
```

```output
True
False
```

The method compares the stored values. Returning `NotImplemented` for an unrelated type tells Python that this method does not define that comparison, giving Python a chance to try the other operand's behavior.

### Make instances sortable with `__lt__`

The less-than special method `__lt__` supports the `<` operator. It can define a natural ordering when comparing instances makes sense.

```python run
class RaceTime:
    def __init__(self, seconds):
        self.seconds = seconds

    def __lt__(self, other):
        return self.seconds < other.seconds

morning = RaceTime(74)
evening = RaceTime(68)
print(evening < morning)
```

```output
True
```

The comparison is true because 68 seconds is less than 74 seconds. This only defines `<`; other comparisons may require separate methods or a helper decorator from the standard library, which is outside this lesson's scope.

### Use `__add__` for a meaningful plus operation

The `+` operator can use `__add__`. Only define it when addition has a clear meaning for the class and its result.

```python run
class Duration:
    def __init__(self, minutes):
        self.minutes = minutes

    def __add__(self, other):
        return Duration(self.minutes + other.minutes)

    def __str__(self):
        return f"{self.minutes} minutes"

practice = Duration(35) + Duration(20)
print(practice)
```

```output
55 minutes
```

Python calls the left operand's `__add__` method for the addition. The method constructs a new duration instead of changing either starting object. A real design should also decide what happens when the other value is not a Duration.

### Keep the return type appropriate

Special methods have expected return conventions. `__str__` returns text, `__len__` returns an integer, and comparison methods normally return a Boolean or `NotImplemented`. A wrong return type can make the built-in operation fail.

```python run
class PlaylistCard:
    def __init__(self, tracks):
        self.tracks = tracks

    def __len__(self):
        return len(self.tracks)

card = PlaylistCard(["Blue Window", "Low Tide"])
print(len(card) == 2)
```

```output
True
```

The built-in `len()` expects an integer from `__len__`; the comparison then produces a Boolean. Matching the expected result shape is part of implementing the protocol correctly.

### Use ordinary operations in the caller

Once a special method exists, callers can keep using familiar operations. The method name remains an implementation detail most callers do not need to know.

```python run
class Package:
    def __init__(self, labels):
        self.labels = labels

    def __len__(self):
        return len(self.labels)

parcel = Package(["fragile", "keep dry", "north wing"])
if len(parcel) > 2:
    print("Add a larger label")
```

```output
Add a larger label
```

The caller uses `len(parcel)` rather than spelling `parcel.__len__()`. This matches how Python's data model is designed to be used and keeps call sites readable.

## What Python is doing behind the scenes

Python's data model defines how built-in syntax interacts with objects. When it evaluates `len(value)`, it looks for the length protocol. When it evaluates `left == right`, it tries the corresponding equality behavior. The special method is the hook a class author can implement.

The operation often has fallback rules. For example, Python may try the right operand's reflected operation if the left operand does not support a binary operation. Comparison methods can return `NotImplemented` to indicate that another implementation should be tried. These protocols let built-in syntax work across many different types.

Special methods have names and result rules because Python's syntax depends on them. Do not call them for ordinary work when the equivalent built-in syntax communicates your intent better. `len(box)` tells a reader that you are asking for a size; `box.__len__()` exposes a protocol detail. Likewise, `str(value)` is the normal way to request text, and `value + other` is the normal way to request the class's addition behavior.

An object may support an operation only with certain kinds of values. A duration can sensibly add another duration, but perhaps not a person's name. A comparison may be meaningful only between measurements in the same unit. Decide these boundaries as part of the class design. Returning `NotImplemented` from a binary method is often better than pretending an unrelated type can be interpreted correctly. Python may then try the other operand's reflected operation or raise an appropriate exception when neither side supports the operation.

Readable output also has design tradeoffs. `__str__` can omit technical details and show what a person needs, while `__repr__` can include field names or constructor-like data that helps a developer inspect a value. Avoid putting secrets or private details in a representation that logs may capture. The important point is to make each form useful to its expected audience and return a string from both methods.

| Expression | Special method commonly used |
|---|---|
| `str(value)` or `print(value)` | `__str__` |
| `repr(value)` | `__repr__` |
| `len(value)` | `__len__` |
| `left == right` | `__eq__` |
| `left < right` | `__lt__` |
| `left + right` | `__add__` |

Special method lookup is controlled by the type, not by ordinary attribute lookup on one instance in the same way as normal methods. Define these methods on the class. Iteration, context management, and other protocols use more special methods, covered in **Iterators and generators** and **Context managers**.

## Common mistakes

### Printing instead of returning from `__str__`

`__str__` must return a string. If it calls `print()` and returns nothing, `str(value)` will fail because Python receives `None` instead of text. Build and return the string.

### Returning the wrong type from `__len__`

`__len__` must return a non-negative integer. Returning a string such as `"three"` does not tell `len()` a numeric size. Convert or calculate a real integer.

### Defining a special method on only one instance

Python's protocol lookup uses the class. Add `__len__` or `__str__` to the class definition rather than assigning a similarly named attribute to one object.

### Overloading an operator without a clear meaning

Users expect familiar operators to behave consistently. If `+` has no reasonable interpretation for your class, do not implement `__add__` merely to make the syntax available.

### Assuming `__eq__` automatically defines ordering

Equality and ordering are separate behaviors. Defining `__eq__` does not explain which of two values should come first. Add only the comparisons your class can define reliably.

## Cheat sheet

| Method | Common syntax | Expected result |
|---|---|---|
| `__str__` | `str(value)`, `print(value)` | Readable `str` |
| `__repr__` | `repr(value)` | Debugging `str` |
| `__len__` | `len(value)` | Non-negative `int` |
| `__eq__` | `left == right` | Boolean or `NotImplemented` |
| `__lt__` | `left < right` | Boolean or `NotImplemented` |
| `__add__` | `left + right` | A meaningful result object |

## Try it yourself

### Easy: readable output

Define `__str__` for a `Badge` that returns its color. Print the result exactly as shown in Expected output.


:::tip Hint
Use the lesson idea about special dunder methods. Trace the sample values before printing so you can check each step.
:::

```sample input
badge_color = 'gold'
```

```expected
silver badge
```

```python run
# Complete the Easy: readable output task.
badge_color = 'gold'
# Write your code below
```


:::solution
`print()` uses the returned string from `__str__`. The method returns text instead of printing internally.

```python
badge_color = 'gold'
class Badge:
    def __init__(self, color):
        self.color = color

    def __str__(self):
        return f"{self.color} badge"

print(Badge("silver"))
```
:::

### Medium: support `len()`

Implement `__len__` for a shelf containing three records. Print the result exactly as shown in Expected output.


:::tip Hint
Use the lesson idea about special dunder methods. Trace the sample values before printing so you can check each step.
:::

```sample input
records = ['score', 'date', 'venue']
```

```expected
3
```

```python run
# Complete the Medium: support `len()` task.
records = ['score', 'date', 'venue']
# Write your code below
```


:::solution
The special method returns the internal list length as an integer, which lets the caller use `len()`.

```python
records = ['score', 'date', 'venue']
class Shelf:
    def __init__(self, records):
        self.records = records

    def __len__(self):
        return len(self.records)

print(len(Shelf(["A", "B", "C"])))
```
:::

### Challenge: compare two distances

Implement `__lt__` so two `TrackLength` objects compare by kilometers. Print the result exactly as shown in Expected output.


:::tip Hint
Use the lesson idea about special dunder methods. Trace the sample values before printing so you can check each step.
:::

```sample input
distances_km = [2.5, 10, 0.75]
```

```expected
True
```

```python run
# Complete the Challenge: compare two distances task.
distances_km = [2.5, 10, 0.75]
# Write your code below
```


:::solution
The method compares the stored numeric values and returns the resulting Boolean.

```python
distances_km = [2.5, 10, 0.75]
class TrackLength:
    def __init__(self, kilometers):
        self.kilometers = kilometers

    def __lt__(self, other):
        return self.kilometers < other.kilometers

print(TrackLength(3) < TrackLength(5))
```
:::

## Recap

- Special methods connect class behavior to Python operations such as `len()` and `+`.
- Double underscores surround the special names; use ordinary syntax in callers.
- `__str__` and `__repr__` serve different display and debugging needs.
- Return the type each protocol expects and define only meaningful operations.
- Iteration and context management are separate protocols taught later.

Reference: Python documentation, Special method names
