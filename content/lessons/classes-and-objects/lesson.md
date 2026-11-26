---
title: "Classes and objects"
curriculumTitle: "Classes and objects"
track: "Python from zero"
module: "M7 Objects"
order: 33
level: "Intermediate"
summary: "Learn how a class describes a kind of object and how instances hold separate data."
prerequisites:
  - "JSON and CSV"
learningGoals:
  - "Explain the relationship between a class and its objects"
  - "Create instances from a class"
  - "Store and read attributes on individual objects"
  - "Recognize that objects combine identity and data"
relatedProblems: []
---

## What you will learn

- What a **class** describes and what an **object** is
- How to create an **instance** from a class
- How attributes store data on an object
- Why two objects from the same class can hold different values
- How classes group related information into meaningful units

## Why this matters

A program that tracks a sports roster may need each player's name, number, and position. Separate variables work for one player, but become hard to manage for a whole team. A class gives those related values a shared shape, and each object holds the values for one player. The same idea is useful for books, songs, weather readings, and game characters.

## The big idea

Think of a class as a design for a set of similar objects, like a blank player card with spaces for a name and shirt number. Each completed card is one object with its own information. The class describes a kind of thing; each object is one specific example of that kind.

An **object** is a value that can have attributes and behavior. A **class** defines a new kind of object, and an **instance** is an object created from that class. In Python, nearly every value is an object: strings, lists, and dictionaries all have types and attributes. This lesson focuses on making a small class and storing data on its instances. Creating initial state with `__init__` and writing methods are covered in **__init__ and methods**.

## Step by step

### Define a simple class

Use the `class` keyword followed by a name. The class body must contain a statement; `pass` means there is nothing to do yet. Class names conventionally use capitalized words.

```python run
class PlayerCard:
    pass

print(PlayerCard.__name__)
```

```output
PlayerCard
```

Python creates a class object named `PlayerCard`. The printed representation includes the class name and module. You normally use this class to create instances rather than print the class itself.

### Create an instance

Call the class name with parentheses to create an instance. Since this class has no custom setup yet, each call produces a new, empty instance.

```python run
class PlayerCard:
    pass

first_card = PlayerCard()
second_card = PlayerCard()
print(type(first_card).__name__)
print(first_card is second_card)
```

```output
PlayerCard
False
```

Both values are instances of `PlayerCard`, but they are distinct objects. The `is` operator asks whether two names refer to the very same object. It is not the way to compare ordinary data values; use `==` for value equality.

### Add attributes to an instance

An **attribute** is a value associated with an object and accessed using a dot. You can assign attributes to an instance after creating it.

```python run
class PlayerCard:
    pass

card = PlayerCard()
card.name = "Tara"
card.number = 12
print(card.name)
print(card.number)
```

```output
Tara
12
```

The assignments create two attributes on `card`. The dot syntax means Python looks up or assigns a name associated with that object. In the next lesson, an initializer will create attributes consistently when each instance is made.

### Give two instances different values

Instances created from the same class can represent different real things. Each one stores its own attributes.

```python run
class PlayerCard:
    pass

keeper = PlayerCard()
keeper.name = "Zoya"
keeper.number = 1
striker = PlayerCard()
striker.name = "Kabir"
striker.number = 9
print(keeper.name, keeper.number)
print(striker.name, striker.number)
```

```output
Zoya 1
Kabir 9
```

The class is shared, but the two instances keep separate values. Changing an attribute on `keeper` does not change `striker.name`, because the names belong to different objects.

### Check an object's type

The built-in `isinstance()` function checks whether an object is an instance of a class. This is useful when the type of a value matters to a function or program branch.

```python run
class WeatherReading:
    pass

morning = WeatherReading()
print(isinstance(morning, WeatherReading))
print(isinstance(morning, str))
```

```output
True
False
```

The first question matches because `morning` was created from `WeatherReading`. The second does not: the instance is not a string. `isinstance()` can also check a parent class, which is relevant to inheritance later.

### Store a list as an attribute

An attribute can refer to a collection as well as a simple value. This lets one object hold several related pieces of information.

```python run
class Playlist:
    pass

mix = Playlist()
mix.title = "Evening Drive"
mix.songs = ["Paper Planes", "Slow Train", "Blue Hour"]
print(mix.title)
print(len(mix.songs))
```

```output
Evening Drive
3
```

The list is still an ordinary list; the object holds a reference to it through `songs`. You can use list operations through the attribute, such as `mix.songs.append("New Track")`. Managing mutable attributes safely is a design choice for the class author.

### Compare objects by their attributes

Two objects can contain the same data while still being distinct objects. Compare their values directly when that is the question you mean to ask.

```python run
class BookCard:
    pass

first = BookCard()
first.title = "The Last Orchard"
second = BookCard()
second.title = "The Last Orchard"
print(first.title == second.title)
print(first is second)
```

```output
True
False
```

Both title values compare equal, but `first` and `second` refer to different instances. Classes can later define custom equality behavior, but this lesson uses ordinary identity and attribute comparisons.

### Use a list of objects

Once you have several instances, place them in a list and loop through them. The loop variable refers to each object in turn, so its attributes can be read inside the loop.

```python run
class Album:
    pass

albums = []
for title, year in [("Sunroom", 2022), ("Night Ferry", 2024)]:
    album = Album()
    album.title = title
    album.year = year
    albums.append(album)

for album in albums:
    print(f"{album.title} ({album.year})")
```

```output
Sunroom (2022)
Night Ferry (2024)
```

The list contains two `Album` instances. Each iteration reads the current object's own attributes. In a later lesson, a method will provide class-defined behavior using this same kind of object.

### Understand that built-in values are objects

Python's built-in values are objects too. A string has methods, and a list has methods. A class lets you define a new kind of value that can also carry related data and behavior.

```python run
message = "  good morning  "
print(message.strip())
print(type(message).__name__)
```

```output
good morning
str
```

`strip()` is a method belonging to the string object. You already use object behavior with built-in types; classes let you create types that match your own program's domain.

### Keep class data distinct from instance data

A name written directly in the class body is a class attribute shared through the class. An attribute assigned to one instance belongs to that particular object. Class attributes are useful for shared constants, but mutable class attributes can surprise beginners; the next example uses a number.

```python run
class Match:
    sport = "cricket"

morning_match = Match()
evening_match = Match()
print(morning_match.sport)
print(evening_match.sport)
```

```output
cricket
cricket
```

Both instances can find the class attribute because it is defined on `Match`. If you assign `morning_match.sport = "tennis"`, that creates an instance attribute that takes precedence when reading from that instance. Keep shared settings at the class level and per-object information on instances.

## What Python is doing behind the scenes

The `class` statement creates a class object and binds its name. Calling the class creates an instance. Each instance has a place for attributes, and dot access looks up a requested name. Python first checks the instance and then can search its class and parent classes for an attribute.

The class and its instances are objects themselves. A variable does not contain a printed label or a permanent copy of all its fields; it refers to an object. This is why two variables can refer to one object or to distinct objects, and why `is` tests identity.

| Name | Refers to | Example attribute lookup |
|---|---|---|
| `PlayerCard` | The class object | `PlayerCard()` creates an instance |
| `keeper` | One instance | `keeper.name` reads that instance's name |
| `striker` | A different instance | `striker.number` reads its number |
| `keeper.name` | An attribute value | A string such as `"Zoya"` |

This lesson assigned attributes after creating each object to make the relationship visible. In normal code, an initializer often creates the expected attributes immediately, and methods group behavior with the data. Those topics are covered in **__init__ and methods**. Inheritance and automatic comparison behavior have their own later lessons too.

## Common mistakes

### Forgetting the parentheses when making an instance

`card = PlayerCard` stores a reference to the class itself. `card = PlayerCard()` creates an instance. Use the parentheses when you want one object from the class.

### Reading an attribute before assigning it

An empty class with `pass` does not create a `name` attribute automatically. Assign `card.name` before reading it, or use an initializer to set expected attributes when each instance is created.

### Assuming instances share all their values

Two instances share the class definition, not their per-instance attribute values. Assigning `keeper.name` does not assign `striker.name`.

### Confusing `is` with `==`

`is` asks if two references identify the same object. `==` asks whether values compare equal. Two distinct objects can hold equal strings while still failing an identity check.

### Placing per-object data on the class

A class attribute is shared when instances look it up. Put player-specific scores, names, or temperatures on each instance. A shared mutable list on the class can accidentally mix data across objects.

## Cheat sheet

| Term | Meaning | Example |
|---|---|---|
| Class | A definition for a kind of object | `class PlayerCard:` |
| Instance | One object created from a class | `keeper = PlayerCard()` |
| Attribute | Data or behavior reached through a dot | `keeper.name` |
| Identity | Whether two names refer to one object | `first is second` |
| Type check | Whether a value is an instance of a class | `isinstance(value, PlayerCard)` |

## Try it yourself

### Easy: create a book object

Create a `Book` instance, assign its title, and print it.

```python run
# Complete the create a book object task.
# Sample data: library_book = Book()
# Write your code below and print the result
```


:::solution
Define the class, create an instance with parentheses, then assign and read its `title` attribute.

```python
class Book:
    pass

library_book = Book()
library_book.title = "A Field of Stars"
print(library_book.title)
```
:::

### Medium: keep separate team values

Create two instances with different colors and print the colors separately.

```python run
# Complete the keep separate team values task.
# Sample data: home = Jersey(), away = Jersey()
# Write your code below and print the result
```


:::solution
Each instance receives its own `color` attribute. The two values remain separate even though the instances share one class.

```python
class Jersey:
    pass

home = Jersey()
home.color = "maroon"
away = Jersey()
away.color = "cream"
print(home.color)
print(away.color)
```
:::

### Challenge: collect objects in a list

Create two `Game` instances with names, store them in a list, and print each name.

```python run
# Complete the collect objects in a list task.
# Sample data: games = []
# Write your code below and print the result
```


:::solution
Each loop creates an instance and assigns a name, then appends it to the list. A second loop reads the attribute from each object.

```python
class Game:
    pass

games = []
for name in ["Cloud Hop", "Castle Rally"]:
    game = Game()
    game.name = name
    games.append(game)

for game in games:
    print(game.name)
```
:::

## Recap

- A class describes a kind of object, and an instance is one object created from it.
- Attributes store or expose values through dot notation.
- Instances from the same class can hold different data.
- Use `is` for identity and `==` for value comparison.
- Initializers and methods make class behavior more complete and are covered next.

Reference: Python documentation, Classes
