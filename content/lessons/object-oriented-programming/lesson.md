---
title: "Object-oriented programming"
curriculumTitle: "Object-oriented programming"
track: "CS50P"
module: "Week 8 Object-oriented programming"
order: 9
level: "Beginner"
summary: "Create objects that keep related data and behavior together."
prerequisites:
  - "cs50p-regular-expressions"
learningGoals:
  - "Distinguish a class from an object created from it"
  - "Use __init__ and self to store per-object attributes"
  - "Write methods, properties, class methods, and __str__"
  - "Extend a class through inheritance and super()"
relatedProblems: []
---

## What you will learn

- How classes describe a kind of object and objects hold individual data
- How `__init__`, `self`, attributes, and methods work together
- How `__str__` controls a readable printed form
- How properties validate values and class methods provide another constructor
- How inheritance and operator overloading reuse or extend behavior

## Why this matters

When a program tracks many related things, keeping each value and operation together can make the code easier to follow. A class describes what data an item has and which actions make sense for it. Each object created from that class can hold its own values. One `Workshop` object might have its own room and capacity, while another workshop stores a different room and capacity. Methods use the object's data, and validation can protect it from values the program should not accept. This way of organizing a program is called object-oriented programming.

## The big idea

A **class** is a blueprint, and an **object** (or instance) is one particular thing created from that blueprint. The `__init__` method sets up a new object. Its first parameter is conventionally named `self`, referring to the particular object being initialized. Assignments such as `self.name = name` save attributes on that object, where its other methods can use them.

A method is a function defined inside a class. `__str__` returns the text that `print(object)` should display. A property can validate a value when it is assigned; a class method can offer another way to construct an object. Inheritance lets a new class reuse or extend a parent class, and a special method such as `__add__` can define what an operator means for objects of that class.

## Step by step

### Define a class and create an object

The class describes a kind of thing. Calling its name creates an object, and `__init__` assigns values to that object's attributes.

```python run
class Greenhouse:
    def __init__(self, gardener, plant_count):
        self.gardener = gardener
        self.plant_count = plant_count

house = Greenhouse("Amina", 18)
print(house.gardener)
print(house.plant_count)
```

```output
Amina
18
```

`house` is one object made from the `Greenhouse` class. The values passed at construction time are saved as attributes on that instance.

### Create two objects with separate data

Each instance has its own attributes. Changing the values passed to one constructor call does not change the other object's data.

```python run
class Greenhouse:
    def __init__(self, gardener, plant_count):
        self.gardener = gardener
        self.plant_count = plant_count

north = Greenhouse("Amina", 18)
west = Greenhouse("Ivo", 11)
print(north.gardener, north.plant_count)
print(west.gardener, west.plant_count)
```

```output
Amina 18
Ivo 11
```

Both objects share the same class structure, but each keeps its own gardener and plant count.

### Add a method that uses self

A method can use the current object's attributes. The `self` parameter receives the instance when the method is called.

```python run
class Greenhouse:
    def __init__(self, gardener, plant_count):
        self.gardener = gardener
        self.plant_count = plant_count

    def summary(self):
        return f"{self.gardener} tends {self.plant_count} plants"

print(Greenhouse("Amina", 18).summary())
```

```output
Amina tends 18 plants
```

The call supplies the object as `self` automatically. The method reads the attributes saved when the object was created and returns a result.

### Use a method to update an object's data

An instance method can change the attributes on its own object. This method adds newly planted seedlings to the current count.

```python run
class Greenhouse:
    def __init__(self, plant_count):
        self.plant_count = plant_count

    def add_seedlings(self, amount):
        self.plant_count += amount

house = Greenhouse(12)
house.add_seedlings(5)
print(house.plant_count)
```

```output
17
```

The method updates `self.plant_count`, so the changed value remains on that object after the call.

### Define a readable string form

`__str__` decides what `print` displays for an object. It must return a string describing the instance.

```python run
class CeramicPiece:
    def __init__(self, shape, glaze):
        self.shape = shape
        self.glaze = glaze

    def __str__(self):
        return f"{self.glaze} {self.shape}"

print(CeramicPiece("bowl", "cobalt"))
```

```output
cobalt bowl
```

Printing the object calls `__str__` and displays the returned description. Without this method, the default display would not provide the same human-readable summary.

### Validate values with a property

A property lets an attribute-like assignment pass through a check. Use a separate internal attribute such as `_room` to store the accepted value.

```python run
class Studio:
    def __init__(self, room):
        self.room = room

    @property
    def room(self):
        return self._room

    @room.setter
    def room(self, room):
        if room not in ["Cedar", "Maple"]:
            raise ValueError("Unknown studio room")
        self._room = room

studio = Studio("Cedar")
studio.room = "Maple"
print(studio.room)
```

```output
Maple
```

Both construction and later assignment use the setter because they assign to `self.room`. The setter validates before saving the accepted value as `_room`.

### See validation reject an unsupported value

The property raises `ValueError` when a value is not one of the allowed choices. A caller can handle that expected failure.

```python run
class Studio:
    def __init__(self, room):
        self.room = room

    @property
    def room(self):
        return self._room

    @room.setter
    def room(self, room):
        if room not in ["Cedar", "Maple"]:
            raise ValueError("Unknown studio room")
        self._room = room

try:
    Studio("Granite")
except ValueError as error:
    print(error)
```

```output
Unknown studio room
```

Validation prevents an unsupported room name from being stored. The property makes the check apply consistently when an object is first created and when the attribute changes later.

### Offer a class method as an alternate constructor

A class method receives the class as `cls`. It can create an instance through another named route while still returning the class's normal object.

```python run
class Shuttle:
    def __init__(self, route, seats):
        self.route = route
        self.seats = seats

    @classmethod
    def short_route(cls, route):
        return cls(route, 12)

bus = Shuttle.short_route("Hill Loop")
print(bus.route, bus.seats)
```

```output
Hill Loop 12
```

The class method uses `cls(...)` to create an instance and supplies a standard capacity. It belongs to the class rather than to an already-created shuttle object.

### Inherit attributes and behavior

A child class can reuse a parent class and add another attribute. `super().__init__` calls the parent's initializer for the shared setup.

```python run
class Performer:
    def __init__(self, name):
        self.name = name

class Drummer(Performer):
    def __init__(self, name, kit):
        super().__init__(name)
        self.kit = kit

player = Drummer("Leena", "jazz kit")
print(player.name, player.kit)
```

```output
Leena jazz kit
```

`Drummer` inherits from `Performer`. The parent initializer stores the name, and the child initializer adds the kit.

### Override a method in a child class

A child can define a method with the same name as a parent method to provide specialized behavior.

```python run
class Instrument:
    def sound(self):
        return "A note"

class Tabla(Instrument):
    def sound(self):
        return "Dha"

print(Instrument().sound())
print(Tabla().sound())
```

```output
A note
Dha
```

Calling `sound` on a `Tabla` object uses the child implementation. The parent implementation remains available to ordinary `Instrument` instances.

### Define addition for your own class

The special method `__add__` can describe what the `+` operator does for two objects of your class.

```python run
class InkBottle:
    def __init__(self, milliliters=0):
        self.milliliters = milliliters

    def __add__(self, other):
        return InkBottle(self.milliliters + other.milliliters)

combined = InkBottle(20) + InkBottle(35)
print(combined.milliliters)
```

```output
55
```

Python calls `__add__` for the addition expression. This implementation creates a new bottle object whose amount is the sum of the two stored amounts.

### Keep an object's stored value distinct from its property

The property name and the backing attribute should differ. If the setter assigns to `self.room` again, it calls itself again instead of saving a value.

```python run
class Reading:
    def __init__(self, label):
        self.label = label

    @property
    def label(self):
        return self._label

    @label.setter
    def label(self, value):
        if not value:
            raise ValueError("Label cannot be empty")
        self._label = value

reading = Reading("Morning")
print(reading.label)
```

```output
Morning
```

The public property is `label`, and `_label` is the internal storage. That distinction prevents the setter from recursively calling itself.

## What Python is doing behind the scenes

Calling a class creates an object and invokes its `__init__` method to set up attributes. For an instance method call such as `house.summary()`, Python supplies the instance as the first argument, conventionally named `self`. A method can then use or update that instance's attributes.

Properties route attribute reads and writes through methods while keeping attribute-like syntax. A class method receives the class in `cls`, so it can construct an instance with an alternate set of defaults. For inheritance, a child object can use methods defined on its parent, while a same-named child method overrides the inherited behavior. `super()` accesses the parent implementation, commonly to reuse initialization. Special methods let a class define behavior for operations such as `print(object)` and `left + right`.

It is useful to decide which information belongs to every instance and which behavior should be shared. The class provides the same method definitions to each object, while attributes like `name`, `room`, and `plant_count` can differ from one object to another. When a method runs, `self` gives it access to the appropriate instance's data. This is why a single method definition can produce different summaries for different objects.

Validation belongs near the assignment it protects. A property setter can reject an unsupported value before it becomes internal state, and all later reads go through the property getter. Keep the internal attribute name different from the public property name. For a child class, use inheritance when the new kind of object really is a more specific form of the parent; `super()` reuses parent setup while the child adds its own details.

## Common mistakes

### Forgetting self in an instance method

An instance method needs the object as its first parameter. Name it `self` and use it when reading or storing that object's attributes.

### Assigning a local name instead of an attribute

Writing `name = name` does not save a value on the object. Use `self.name = name` so later method calls can access it.

### Confusing the class with one instance

`Studio` is the class; `Studio("Cedar")` creates an instance. The class describes the shared structure, while each instance stores its own data.

### Making a property call itself forever

Inside a setter for `room`, assigning to `self.room` calls the setter again. Store the checked value in a different backing attribute such as `self._room`.

### Returning a non-string from __str__

`__str__` should return a string. Build the intended description and return it rather than printing from the method.

## Cheat sheet

| Need | Pattern |
|---|---|
| Define a blueprint | `class Thing:` |
| Store per-object values | `self.value = value` |
| Initialize an object | `def __init__(self, ...):` |
| Add instance behavior | `def method(self):` |
| Control printed form | `def __str__(self): return "..."` |
| Validate an attribute | `@property` and `@name.setter` |
| Add alternate construction | `@classmethod` and `cls(...)` |
| Reuse parent setup | `super().__init__(...)` |
| Define object addition | `def __add__(self, other):` |

## Try it yourself

### Easy: create a reading object

Store a title and return it from a method.

```python run
class FieldNote:
    def __init__(self, title):
        self.title = title

    def heading(self):
        return "Note: " + self.title

print(FieldNote("Tidal pools").heading())
```

```output
Note: Tidal pools
```

:::solution

The constructor saves the title on the instance. The method reads that attribute and returns a heading.

:::

### Medium: validate a shelf label

Use a property setter to reject an empty label.

```python run
class Shelf:
    def __init__(self, label):
        self.label = label

    @property
    def label(self):
        return self._label

    @label.setter
    def label(self, value):
        if not value:
            raise ValueError("Label required")
        self._label = value

print(Shelf("Fiction").label)
```

```output
Fiction
```

:::solution

The setter checks the value before storing it in a separate internal attribute.

:::

### Challenge: extend a base class

Create a `Mineral` class and a child that adds its color while reusing the parent's name setup.

```python run
class Mineral:
    def __init__(self, name):
        self.name = name

class Quartz(Mineral):
    def __init__(self, name, color):
        super().__init__(name)
        self.color = color

sample = Quartz("Quartz", "smoky")
print(sample.name, sample.color)
```

```output
Quartz smoky
```

:::solution

The child initializer delegates the shared name setup to the parent, then stores its additional color attribute.

:::

## Recap

- A class defines a kind of object; each instance stores its own attributes.
- `__init__` initializes data, `self` refers to the instance, and methods use that data.
- Properties validate attribute assignment, and class methods can provide another constructor.
- Inheritance reuses or extends a parent, while special methods customize operations.

Based on Harvard's CS50P
Reference: Python documentation, Classes
