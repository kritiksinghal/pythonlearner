---
title: "__init__ and methods"
curriculumTitle: "__init__ and methods"
track: "Python from zero"
module: "M7 Objects"
order: 34
level: "Intermediate"
summary: "Initialize object attributes consistently and define methods that use an instance's data."
prerequisites:
  - "Classes and objects"
learningGoals:
  - "Use __init__ to set up each new instance"
  - "Explain the role of self in an instance method"
  - "Call methods using dot notation"
  - "Return values from methods and keep instance state consistent"
relatedProblems: []
---

## What you will learn

- How the special method **`__init__`** prepares an instance after it is created
- What **`self`** refers to inside an instance method
- How to define and call methods using dot notation
- How methods can read or update an object's attributes
- How constructor parameters help make valid objects from the start

## Why this matters

In the previous lesson, you created objects and assigned attributes afterward. That leaves room to forget a value or create an object in an incomplete state. An initializer gathers setup in one place, so each object begins with the expected information. Methods then give the object behavior related to that information, such as describing a song or adding a lap to a runner's total.

## The big idea

Think of `__init__` as filling in a new card when it is issued. The class describes what the card represents, and the initializer writes the starting data onto each new card. A method is an action the card's object can perform using its own stored values.

An **initializer** is a method Python calls after creating a new instance. In Python, its conventional name is `__init__`. An **instance method** is a function defined in a class that works with a particular instance. Its first parameter is conventionally named `self`; Python supplies the instance when you call the method through that object.

## Step by step

### Set up attributes with `__init__`

Define `__init__` with `self` and any values needed for setup. Assign those values to attributes so the new object is ready immediately.

```python run
class Runner:
    def __init__(self, name):
        self.name = name

runner = Runner("Ishan")
print(runner.name)
```

```output
Ishan
```

Calling `Runner("Ishan")` creates an instance and then calls its initializer. Python supplies the new object for `self` and passes the text as `name`. The assignment saves that value on the instance.

### Add more starting information

The initializer can accept several pieces of information and store each one. Keep parameters descriptive so a caller can tell what values are expected.

```python run
class WeatherReport:
    def __init__(self, city, temperature):
        self.city = city
        self.temperature = temperature

report = WeatherReport("Jaipur", 32)
print(report.city)
print(report.temperature)
```

```output
Jaipur
32
```

Each assignment stores a constructor argument as an attribute. The object now carries the data needed for later operations. Type hints can describe expected types but are introduced separately in **Type hints**.

### Understand the role of `self`

`self` is the current instance. When you call a method through an object, Python passes that object as the first argument automatically. Include `self` in the method definition; do not pass it yourself in the normal call.

```python run
class Song:
    def __init__(self, title):
        self.title = title

    def show_title(self):
        print(self.title)

favorite = Song("Amber Lights")
favorite.show_title()
```

```output
Amber Lights
```

The call `favorite.show_title()` is roughly equivalent to calling `Song.show_title(favorite)`. Python supplies `favorite` as `self`, so the method reads the title belonging to that particular song.

Method names are chosen by the class author, so prefer a verb or a short phrase that describes the action. `show_title`, `area`, and `add_points` each communicate a different job. A method can use additional parameters after `self`, but its first parameter remains the instance reference. Do not add `self` to the caller's argument list when using normal dot-call syntax.

### Return a result from a method

Methods can return values just like ordinary functions. Returning a value lets other code decide how to display or use the result.

```python run
class Rectangle:
    def __init__(self, width, height):
        self.width = width
        self.height = height

    def area(self):
        return self.width * self.height

sign = Rectangle(8, 3)
print(sign.area())
```

```output
24
```

The method reads both attributes from `self`, multiplies them, and returns the result. The caller then prints it. A method call uses parentheses even when it takes no additional arguments.

### Update state through a method

A method can change an object's attributes. Grouping an update with the object makes the operation easier to find and reuse.

```python run
class ScoreBoard:
    def __init__(self, points):
        self.points = points

    def add_points(self, earned):
        self.points += earned

board = ScoreBoard(12)
board.add_points(5)
print(board.points)
```

```output
17
```

`add_points()` updates the `points` attribute on the instance that called it. Because this method does not return a value explicitly, its result is `None`; its main purpose is the state change.

### Keep two objects independent

Each initializer call creates and sets up a separate instance. A method called on one object works with that object's state.

```python run
class Wallet:
    def __init__(self, owner, dollars):
        self.owner = owner
        self.dollars = dollars

    def add_cash(self, amount):
        self.dollars += amount

morning_wallet = Wallet("Leena", 20)
evening_wallet = Wallet("Omar", 35)
morning_wallet.add_cash(10)
print(morning_wallet.dollars)
print(evening_wallet.dollars)
```

```output
30
35
```

The method updates only the instance used for the call. `self` is the link between a method's code and the current object's attributes.

### Use a method parameter without storing it

Not every method argument needs to become an attribute. A parameter can supply a temporary value used to calculate a result.

```python run
class Distance:
    def __init__(self, kilometers):
        self.kilometers = kilometers

    def in_miles(self, conversion):
        return self.kilometers * conversion

route = Distance(10)
print(round(route.in_miles(0.621371), 2))
```

```output
6.21
```

The conversion factor is only needed for this calculation, so it is passed to the method instead of stored. The distance itself remains part of the object.

### Use a method to create a description

Methods can combine attributes into a display string. This keeps the formatting rule near the data it describes.

```python run
class Album:
    def __init__(self, title, artist, year):
        self.title = title
        self.artist = artist
        self.year = year

    def describe(self):
        return f"{self.title} — {self.artist} ({self.year})"

record = Album("Green Signals", "Maya Sen", 2023)
print(record.describe())
```

```output
Green Signals — Maya Sen (2023)
```

`describe()` uses the current object's three attributes and returns one string. It does not print by itself, so callers can also save or format that string elsewhere.

### Give a parameter a default

The initializer can include default values for optional setup. Default arguments were covered in an earlier lesson; here they make an object usable when the caller does not need to choose every setting.

```python run
class Light:
    def __init__(self, color, brightness=50):
        self.color = color
        self.brightness = brightness

lamp = Light("amber")
print(lamp.color, lamp.brightness)
```

```output
amber 50
```

The caller provides the color and accepts the default brightness. A different caller can provide both values. The initializer stores a concrete brightness on each instance either way.

### Use a method to check an object's data

A method can return a Boolean that describes whether a condition is true for the current object.

```python run
class Battery:
    def __init__(self, percent):
        self.percent = percent

    def needs_charge(self):
        return self.percent < 20

tablet = Battery(14)
print(tablet.needs_charge())
```

```output
True
```

The method compares the instance's percentage with the threshold and returns a Boolean. It reads the current value each time it is called, so an update to the attribute changes the next result.

## What Python is doing behind the scenes

When Python evaluates `Runner("Ishan")`, it creates a new instance and then invokes `Runner.__init__` with the instance and the supplied argument. The parameter `self` receives that instance. Assigning `self.name` stores a reference in the instance's attribute namespace.

For a call such as `favorite.show_title()`, Python looks up `show_title` on the class and binds the method to `favorite`. The instance is supplied as the first parameter automatically. This binding is why a method definition includes `self` even though the caller does not write it.

| Code | What Python supplies or changes |
|---|---|
| `Runner("Ishan")` | Creates an instance and calls its initializer |
| `self.name = name` | Stores the passed value on that instance |
| `favorite.show_title()` | Binds `self` to `favorite` |
| `self.points += earned` | Reads, adds, and stores the updated attribute |

The name `self` is a convention, not a reserved keyword, but using another name makes code surprising. The special method name `__init__` must be spelled with two underscores on both sides. It initializes an already-created object; it is not the method that allocates the instance itself.

An initializer should establish the attributes that the rest of the class expects to find. If a method reads `self.points`, every normal construction path should assign `points` first. This avoids objects that sometimes work and sometimes fail depending on the order in which outside code assigns attributes. When a value is optional, give it an intentional default or represent its absence clearly. Keep setup in the initializer and operations in methods so each part has one understandable responsibility.

The initializer normally has no explicit return statement. Its purpose is to configure the instance, not to replace it with another value. A method that computes a total, label, or Boolean should return that result; a method that intentionally changes state can return nothing. Keeping those two intentions clear helps callers know whether to save a result or inspect the object afterward.

## Common mistakes

### Forgetting `self` in a method definition

An instance method needs a first parameter to receive the current object. If you omit it, a normal call through an instance supplies an argument that the function was not written to accept. Add `self` first, then list the method's own parameters.

### Writing an attribute without `self`

Inside `__init__`, `name = name` only assigns a local variable to itself. To save the value on the object, write `self.name = name`.

### Calling a method without parentheses

`album.describe` refers to the method object; `album.describe()` calls it and gives you its returned value. Add parentheses when you want the method to run.

### Expecting a method to return its printed text

`print()` displays text and returns `None`. If another part of the program needs the text, return a string from the method and let the caller decide when to print.

### Misspelling `__init__`

Python recognizes the exact special name `__init__`. A spelling such as `_init_` is an ordinary method and will not initialize new instances automatically. Check the two underscores at each end.

## Cheat sheet

| Pattern | Purpose |
|---|---|
| `def __init__(self, value):` | Define instance setup |
| `self.value = value` | Save constructor data on the object |
| `def method(self):` | Define an instance method |
| `object.method()` | Call the method with object bound as `self` |
| `return result` | Give a value back to the caller |
| `self.total += amount` | Update the current object's state |

## Try it yourself

### Easy: initialize a song

Create a `Song` with a title and print the title.

```python run
# Complete the initialize a song task.
# Sample data: track = Song('Silver Kite')
# Write your code below and print the result
```


:::solution
The initializer receives the title and stores it on the instance as `self.title`.

```python
class Song:
    def __init__(self, title):
        self.title = title

track = Song("Silver Kite")
print(track.title)
```
:::

### Medium: calculate a score bonus

Create a player with a score and a method that returns the score plus a bonus.

```python run
# Complete the calculate a score bonus task.
# Sample data: player = Player(76)
# Write your code below and print the result
```


:::solution
The method uses the object's stored score and the temporary bonus argument, then returns their sum.

```python
class Player:
    def __init__(self, score):
        self.score = score

    def with_bonus(self, bonus):
        return self.score + bonus

player = Player(76)
print(player.with_bonus(8))
```
:::

### Challenge: update a reading streak

Create a counter with a starting streak and a method that adds one day.

```python run
# Complete the update a reading streak task.
# Sample data: streak = ReadingStreak(6)
# Write your code below and print the result
```


:::solution
The method increments `self.days` on the calling instance. The print reads the updated attribute.

```python
class ReadingStreak:
    def __init__(self, days):
        self.days = days

    def add_day(self):
        self.days += 1

streak = ReadingStreak(6)
streak.add_day()
print(streak.days)
```
:::

## Recap

- `__init__` stores the starting data for each new instance.
- `self` refers to the current instance and is supplied by a method call.
- Methods can return information or update the instance's attributes.
- Each instance keeps its own state when values are stored through `self`.
- Use parentheses to call methods and return values when callers need results.

Reference: Python documentation, Classes
