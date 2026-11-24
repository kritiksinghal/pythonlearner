---
title: "Dataclasses"
curriculumTitle: "Dataclasses"
track: "Python from zero"
module: "M7 Objects"
order: 37
level: "Intermediate"
summary: "Use dataclasses to write concise classes that mainly store related data."
prerequisites:
  - "Special (dunder) methods"
learningGoals:
  - "Use the dataclass decorator for data-focused classes"
  - "Declare fields with type annotations"
  - "Choose defaults and default_factory safely"
  - "Recognize generated initialization, representation, and equality behavior"
relatedProblems: []
---

## What you will learn

- What a **dataclass** is and when it can reduce repetitive class code
- How to apply `@dataclass` above a class definition
- How field annotations describe the data each instance stores
- How to choose a default value or create a fresh mutable value per instance
- How frozen and ordered dataclasses change the object's behavior

## Why this matters

Many classes mainly hold related data, such as a weather observation or a library checkout. A regular class may need a constructor and a readable representation even when its main purpose is storing fields. Python's `dataclasses` module can generate common methods from a short field declaration. This leaves more room for the behavior that makes your class unique.

## The big idea

Think of a dataclass as a labeled form whose field names describe what information each completed form contains. You declare those fields, and Python creates common setup and comparison behavior for you. You can still add methods when the data needs related operations.

A **dataclass** is a class decorated with `@dataclass` from the standard library module `dataclasses`. The decorator examines annotated fields and can generate methods such as `__init__`, `__repr__`, and `__eq__`. It does not validate that runtime values have the annotated types; type annotations primarily describe intended use and can support external tools.

## Step by step

### Create a basic dataclass

Put `@dataclass` directly above a class definition and annotate the fields. The generated initializer accepts those fields in declaration order.

```python run
from dataclasses import dataclass

@dataclass
class Observation:
    station: str
    degrees_c: float

reading = Observation("Hilltop", 23.5)
print(reading)
```

```output
Observation(station='Hilltop', degrees_c=23.5)
```

The decorator adds an initializer and a useful representation. The annotation `str` indicates that `station` is intended to contain text, and `float` indicates a decimal value. Python does not automatically reject an integer or other value passed in those positions.

### Read and update fields

Dataclass fields are ordinary attributes on the instance by default. You can read or reassign them using dot notation.

```python run
from dataclasses import dataclass

@dataclass
class PracticeSession:
    activity: str
    minutes: int

session = PracticeSession("piano scales", 18)
session.minutes += 7
print(session.activity)
print(session.minutes)
```

```output
piano scales
25
```

The generated initializer stores both values. The increment changes the instance's `minutes` field, just as it would for an attribute on a regular class.

### Use a default for an optional field

Assign a default value in the class definition when it makes sense for every instance that omits that argument.

```python run
from dataclasses import dataclass

@dataclass
class GameSettings:
    difficulty: str
    sound_on: bool = True

settings = GameSettings("normal")
print(settings.difficulty, settings.sound_on)
```

```output
normal True
```

The required field comes first, followed by a field with a default. Callers can provide a different sound setting, but they do not have to. Required fields should not follow fields with defaults in the generated initializer order.

### Give each instance its own list

Mutable defaults such as lists should be created separately for each instance. Use `field(default_factory=list)` so each new object receives a new empty list.

```python run
from dataclasses import dataclass, field

@dataclass
class PackingList:
    trip: str
    items: list[str] = field(default_factory=list)

weekend = PackingList("coast")
camping = PackingList("forest")
weekend.items.append("sunscreen")
print(weekend.items)
print(camping.items)
```

```output
['sunscreen']
[]
```

The factory is called separately for each instance. Without it, sharing one mutable list could make changes for one trip appear in another trip's packing list.

### Add a method to a dataclass

A dataclass can contain methods alongside its fields. Use a method when behavior depends on the stored data.

```python run
from dataclasses import dataclass

@dataclass
class GardenPlot:
    rows: int
    plants_per_row: int

    def plant_count(self):
        return self.rows * self.plants_per_row

plot = GardenPlot(6, 8)
print(plot.plant_count())
```

```output
48
```

The decorator generates data methods, while `plant_count()` is written by the class author. A dataclass remains a regular class, so it can define the behavior that its data needs.

### Compare instances by their fields

By default, dataclasses generate equality based on the declared fields. Two instances of the same dataclass with equal field values compare equal.

```python run
from dataclasses import dataclass

@dataclass
class Coordinates:
    north: int
    east: int

first = Coordinates(4, 9)
second = Coordinates(4, 9)
print(first == second)
```

```output
True
```

The instances are distinct objects, but their class and field values match, so generated equality returns `True`. Use identity comparison with `is` only when you specifically care whether two names refer to the same object.

### Make an immutable-style dataclass

Use `frozen=True` when fields should not be reassigned after construction. A frozen dataclass blocks ordinary attribute assignment, which helps communicate that the value should stay stable.

```python run
from dataclasses import dataclass

@dataclass(frozen=True)
class RoutePoint:
    latitude: float
    longitude: float

start = RoutePoint(18.52, 73.86)
print(start.latitude)
```

```output
18.52
```

This example only reads the frozen field. Attempting to assign a different latitude raises an exception. “Frozen” does not recursively freeze mutable objects stored in a field, so prefer immutable field values for a truly stable record.

### Control field order and representation

The field declaration order controls the generated initializer's positional argument order and the default representation. Keyword arguments can make construction clearer when a record has several fields.

```python run
from dataclasses import dataclass

@dataclass
class LibraryLoan:
    title: str
    borrower: str
    days_left: int

loan = LibraryLoan(title="A Map of Stars", borrower="Aditi", days_left=12)
print(loan.borrower)
```

```output
Aditi
```

Keyword arguments connect each value to a field by name and are less likely to be confused when several fields have similar types. Defaults and keyword-only configuration can be customized, but this lesson focuses on the basic generated initializer.

### Turn off generated equality when needed

If the default field-by-field equality is not the meaning you want, set `eq=False` and define a custom comparison or leave instances with their default identity behavior.

```python run
from dataclasses import dataclass

@dataclass(eq=False)
class PassportStamp:
    country: str
    year: int

left = PassportStamp("Nepal", 2025)
right = PassportStamp("Nepal", 2025)
print(left == right)
```

```output
False
```

Without generated equality, these separate instances use normal object identity equality. Set options deliberately; generated behavior is helpful only when it matches the meaning of the class.

### Add ordering when it has a clear meaning

Setting `order=True` generates ordering comparisons using the fields in declaration order. Use it only when that ordering is meaningful for the data.

```python run
from dataclasses import dataclass

@dataclass(order=True)
class QueueTicket:
    priority: int
    issued_number: int

earlier = QueueTicket(2, 11)
later = QueueTicket(3, 4)
print(earlier < later)
```

```output
True
```

The comparison considers `priority` first and then `issued_number` if priorities match. This tuple-like ordering may or may not match a real queue's policy, so use it only when the field order expresses the intended comparison.

## What Python is doing behind the scenes

The decorator receives the class after Python creates it and adds generated methods based on the annotations and options. The generated initializer assigns arguments to instance attributes. The generated representation lists fields, and generated equality compares field values for instances of the same class.

Annotations are stored as metadata. Python does not enforce them on assignments or constructor calls by default. A type checker can inspect those annotations before a program runs, but that is a separate tool. The `field()` helper provides extra field configuration, including `default_factory` for fresh mutable values.

Each option changes a generated method, not the meaning of the data itself. For example, `repr=False` can omit a field from the generated representation, while `compare=False` can keep a field out of generated equality and ordering. Use these settings only when they express the model accurately. A hidden representation field may still be accessible as an attribute, so do not treat it as secret storage or an access-control feature.

```python run
from dataclasses import dataclass, field

@dataclass
class AccessCard:
    holder: str
    internal_code: str = field(repr=False)

card = AccessCard("Dev", "Q7K2")
print(card)
print(card.internal_code)
```

```output
AccessCard(holder='Dev')
Q7K2
```

The representation omits the internal code, but the field still exists and can be read. In real systems, avoid printing credentials or secrets at all; representation options are for controlling generated display, not securing sensitive data.

| Declaration | Typical generated effect |
|---|---|
| `@dataclass` | Initializer, representation, equality |
| `field(default_factory=list)` | A fresh list for each instance |
| `@dataclass(frozen=True)` | Blocks regular field reassignment |
| `@dataclass(eq=False)` | Skips generated field equality |
| `@dataclass(order=True)` | Adds ordering comparisons from fields |

Dataclasses are designed for classes that primarily store data. If a class has complex invariants, many side effects, or unusual construction rules, a regular class may communicate the design better. Use the feature because it removes repetitive code, not because every class should use it.

For example, a record representing a measurement may be a good fit because its fields are the main thing callers need. A class coordinating a payment process may need careful validation and multiple state transitions, so explicitly written methods may make those rules easier to see. Choose the class style that makes the important behavior obvious to the next reader.

## Common mistakes

### Forgetting the decorator

Field annotations alone do not add the generated initializer and comparison behavior. Import `dataclass` and place `@dataclass` directly above the class.

### Treating annotations as runtime validation

Declaring `minutes: int` does not force every caller to pass an integer. Validate values explicitly when the program must reject an invalid type or range.

### Using a shared mutable default

Use `field(default_factory=list)` for a list that should be new for each instance. A single shared list can cause unrelated records to affect each other.

### Putting a required field after a default field

The generated initializer follows field order, and required parameters cannot follow default parameters. Declare required fields first, then optional fields.

### Asking for an ordering that is not meaningful

`order=True` compares fields in declaration order. Check whether that sequence matches the real rule before enabling the generated ordering methods.

## Cheat sheet

| Need | Pattern |
|---|---|
| Declare data fields | `@dataclass` with annotated fields |
| Create a default list per object | `field(default_factory=list)` |
| Block normal reassignment | `@dataclass(frozen=True)` |
| Disable generated equality | `@dataclass(eq=False)` |
| Generate field ordering | `@dataclass(order=True)` |
| Add custom behavior | Define methods inside the class |

## Try it yourself

### Easy: define a data record

Create a dataclass for a film with a title and year.

```python run
from dataclasses import dataclass

@dataclass
class Film:
    title: str
    year: int

print(Film("Soft Thunder", 2021))
```

```output
Film(title='Soft Thunder', year=2021)
```

:::solution

Annotate the fields and decorate the class. The generated representation shows their names and values.

:::

### Medium: use a fresh collection

Create two dataclass instances with separate lists of ingredients.

```python run
from dataclasses import dataclass, field

@dataclass
class Smoothie:
    flavor: str
    ingredients: list[str] = field(default_factory=list)

berry = Smoothie("berry")
citrus = Smoothie("citrus")
berry.ingredients.append("oats")
print(berry.ingredients)
print(citrus.ingredients)
```

```output
['oats']
[]
```

:::solution

The factory creates a new list for each smoothie, so appending to one does not affect the other.

:::

### Challenge: freeze a record

Define a frozen dataclass for a game coordinate and read its row.

```python run
from dataclasses import dataclass

@dataclass(frozen=True)
class GridSpot:
    row: int
    column: int

spot = GridSpot(5, 2)
print(spot.row)
```

```output
5
```

:::solution

The frozen option prevents ordinary reassignment, while reading the fields remains allowed.

:::

## Recap

- `@dataclass` can generate common methods for a data-focused class.
- Field annotations describe intended values but do not validate them at runtime.
- Use `default_factory` to give each instance a fresh mutable default.
- Frozen, equality, and ordering options change generated behavior.
- Choose dataclasses when their generated behavior fits the meaning of the data.

Reference: Python documentation, dataclasses — Data Classes
