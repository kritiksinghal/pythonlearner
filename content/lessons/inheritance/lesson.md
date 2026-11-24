---
title: "Inheritance"
curriculumTitle: "Inheritance"
track: "Python from zero"
module: "M7 Objects"
order: 35
level: "Intermediate"
summary: "Learn how a child class can reuse and specialize behavior from a parent class."
prerequisites:
  - "__init__ and methods"
learningGoals:
  - "Recognize a parent and child class relationship"
  - "Reuse inherited methods and attributes"
  - "Override a method to specialize behavior"
  - "Use super() to extend parent initialization"
relatedProblems: []
---

## What you will learn

- What **inheritance** means for Python classes
- How a child class receives attributes and methods from a parent class
- How **overriding** replaces a parent's behavior for a child
- How `super()` lets child code use a parent's implementation
- When inheritance helps express a real “is a kind of” relationship

## Why this matters

Imagine a school program that tracks both students and teachers. They may share a name and contact information, while each role has different details. Inheritance can place shared behavior in one parent class and keep specialized behavior in child classes. Used well, it reduces duplication and makes relationships between types clear. Used without a real relationship, it can make code harder to follow than separate classes.

## The big idea

Think of a parent class as a base recipe and a child class as a variation that keeps some steps while adding or changing others. A child object is also an instance of its parent class. It can use inherited names unless the child defines a name of its own.

The original class is the **parent class** (also called a base class); the new class is the **child class** (also called a derived class). A child class can reuse attributes and methods, add its own methods, or override a method with a more specific implementation. Inheritance is best used when the child truly is a more specific kind of the parent, such as a savings account being an account.

## Step by step

### Define a parent class

Write the parent class first. It holds behavior that makes sense for every item in the family.

```python run
class Instrument:
    def describe(self):
        return "An instrument makes music."

guitar = Instrument()
print(guitar.describe())
```

```output
An instrument makes music.
```

The class `Instrument` defines one method. This ordinary class can be used by itself. A child class can later inherit that method and make a more specific kind of instrument.

### Create a child class

Place the parent class name in parentheses after the child class name. This declares the inheritance relationship.

```python run
class Instrument:
    def describe(self):
        return "An instrument makes music."

class Drum(Instrument):
    pass

kit = Drum()
print(kit.describe())
```

```output
An instrument makes music.
```

`Drum` does not define `describe()`, so Python finds the method on `Instrument`. The child can use inherited behavior without copying the method body.

### Add child-specific behavior

A child class can define methods the parent does not have. The new method belongs to the child and is available on its instances.

```python run
class Instrument:
    def family(self):
        return "music"

class Drum(Instrument):
    def beat(self):
        return "Boom, tap"

kit = Drum()
print(kit.family())
print(kit.beat())
```

```output
music
Boom, tap
```

The `Drum` instance can use `family()` from the parent and `beat()` from the child. A plain `Instrument` does not gain `beat()`, because that behavior is specific to drums.

### Override a parent's method

If the child defines a method with the same name as a parent method, the child's implementation is used for that child.

```python run
class Notification:
    def channel(self):
        return "General message"

class TextAlert(Notification):
    def channel(self):
        return "Text message"

alert = TextAlert()
print(alert.channel())
```

```output
Text message
```

This is called **overriding**. The child method replaces the inherited method when looking up `channel` on a `TextAlert` object. The parent implementation still exists for parent instances and can also be called from a child with `super()`.

### Check the relationship with `isinstance`

An instance of a child class also counts as an instance of its parent class. This makes it possible for code that accepts a parent type to work with child instances.

```python run
class Vehicle:
    pass

class Bicycle(Vehicle):
    pass

ride = Bicycle()
print(isinstance(ride, Bicycle))
print(isinstance(ride, Vehicle))
```

```output
True
True
```

`ride` is a `Bicycle` and also a `Vehicle` because `Bicycle` inherits from `Vehicle`. The reverse is not true: a regular `Vehicle` is not automatically a `Bicycle`.

### Extend a parent's initializer with `super()`

When a child has extra starting information, it can call the parent initializer through `super()`, then store the child-specific value.

```python run
class Account:
    def __init__(self, owner):
        self.owner = owner

class SavingsAccount(Account):
    def __init__(self, owner, interest_rate):
        super().__init__(owner)
        self.interest_rate = interest_rate

account = SavingsAccount("Naveen", 0.04)
print(account.owner)
print(account.interest_rate)
```

```output
Naveen
0.04
```

`super().__init__(owner)` calls the next implementation in the method resolution order, which here is `Account.__init__`. The child then stores its own interest rate. This avoids duplicating the parent's setup logic.

### Extend behavior instead of replacing it

Sometimes a child wants the parent's result plus extra information. It can call the parent method with `super()` and use the returned value.

```python run
class Message:
    def label(self):
        return "Message"

class UrgentMessage(Message):
    def label(self):
        return super().label() + " - urgent"

notice = UrgentMessage()
print(notice.label())
```

```output
Message - urgent
```

The child calls the inherited implementation, then adds its own detail. This pattern is useful when the parent behavior still applies and you only need to extend it.

### Use parent behavior on different child objects

Code can call the same method name on different child types and receive specialized behavior. This is one form of polymorphism, a broader topic than this lesson.

```python run
class Shape:
    def sides(self):
        return "A shape has a boundary"

class Triangle(Shape):
    def sides(self):
        return "3 sides"

class Hexagon(Shape):
    def sides(self):
        return "6 sides"

for shape in [Triangle(), Hexagon()]:
    print(shape.sides())
```

```output
3 sides
6 sides
```

The loop does not need a separate branch for each child. It calls `sides()` on each object, and Python chooses the matching implementation based on that object's class.

### Keep inheritance shallow and meaningful

An inheritance tree can have several levels, but deep chains make behavior harder to trace. Prefer a small relationship that readers can explain. If two classes merely happen to share one utility, a function or a separate helper may be simpler.

```python run
class StaffMember:
    def role(self):
        return "Staff"

class Coach(StaffMember):
    def team(self):
        return "U18"

coach = Coach()
print(coach.role())
print(coach.team())
```

```output
Staff
U18
```

The relationship reads naturally: a coach is a kind of staff member. The child inherits the shared role and adds team-specific information. If the relationship does not make sense in plain language, reconsider inheritance.

### Read inherited attributes

A child can use attributes established by the parent's initializer. The parent owns the common setup, and the child can add more state when needed.

```python run
class Event:
    def __init__(self, title):
        self.title = title

class Concert(Event):
    def __init__(self, title, venue):
        super().__init__(title)
        self.venue = venue

show = Concert("Soft Echoes", "Riverside Hall")
print(show.title)
print(show.venue)
```

```output
Soft Echoes
Riverside Hall
```

The child initializer reuses the parent's `title` setup and stores `venue` itself. If you forget the `super()` call, the parent's initializer does not run automatically when the child defines its own initializer.

## What Python is doing behind the scenes

When Python looks up an attribute on an instance, it first checks the instance, then its class, then parent classes according to the method resolution order. This is why an instance can use an inherited method without that method being copied into the child class's body.

When a child overrides a name, lookup finds the child definition before the parent's. `super()` provides a way to continue lookup from the current class in the method resolution order. In simple single inheritance, this usually means the parent implementation. More advanced multiple inheritance uses the same lookup order and has rules beyond this lesson.

| Lookup on `SavingsAccount` instance | Where Python finds it |
|---|---|
| `interest_rate` | Instance attribute set by child initializer |
| `owner` | Instance attribute set by parent initializer |
| `balance` method if inherited | Parent class |
| `special_rate` if child-defined | Child class |

Inheritance shares behavior; it does not mean a child and parent are the same class. An object has one concrete class, and it may also satisfy checks for its parent types. A child should remain usable anywhere the parent type is expected, which is a useful design test for the relationship.

Python's lookup order is called the **method resolution order**. With one parent, the search is straightforward: the instance, its child class, then its parent class. When there are multiple parents, Python follows a consistent order that avoids repeatedly searching the same class, but the resulting relationships can be difficult to explain. Beginners should favor one clear parent and add another only when the model requires it. The key idea is that `super()` follows this order; it does not mean “jump to one hard-coded parent” in every possible class design.

The `isinstance()` relationship is useful for checks, but do not build a program that branches on every concrete subclass if each type already knows how to perform its action. Calling a shared method and allowing the object's implementation to respond often keeps the caller simpler. This lesson only introduces that pattern; special method names and other forms of class behavior are covered in their own curriculum lessons.

## Common mistakes

### Forgetting the parent name

`class SavingsAccount:` defines an independent class. To inherit, write `class SavingsAccount(Account):`. The parentheses in a class definition specify its base classes.

### Forgetting to call the parent initializer

If a child defines `__init__`, Python uses that initializer. It does not also run the parent's initializer automatically. Call `super().__init__(...)` when the parent needs to establish its attributes.

### Repeating the parent's setup

Copying parent assignments into every child duplicates logic. If the parent initializer is correct, call it with `super()` and add only the child's extra state.

### Overriding a method by accident

Reusing a parent's method name replaces it for the child. Choose a distinct name if you mean to add another action instead of specializing the inherited one.

### Inheriting without an “is a” relationship

Inheritance suggests that a child is a specialized parent. If two objects only share one operation, a helper function or composition may express the design more clearly.

## Cheat sheet

| Pattern | Purpose |
|---|---|
| `class Child(Parent):` | Declare inheritance |
| Child uses parent method | Reuse behavior |
| Same method name in child | Override behavior |
| `super().method()` | Call next implementation |
| `isinstance(child, Parent)` | Check parent relationship |
| `super().__init__(...)` | Reuse parent setup |

## Try it yourself

### Easy: inherit a greeting

Create a child class `MorningNote` that inherits a greeting method and call it.

```python run
class Note:
    def greeting(self):
        return "Hello"

class MorningNote(Note):
    pass

print(MorningNote().greeting())
```

```output
Hello
```

:::solution

The child class names `Note` as its parent. It inherits the `greeting()` method without defining a replacement.

:::

### Medium: override a method

Create a child `Piano` that overrides the parent's sound description.

```python run
class Instrument:
    def sound(self):
        return "Music"

class Piano(Instrument):
    def sound(self):
        return "Soft chords"

print(Piano().sound())
```

```output
Soft chords
```

:::solution

The method with the same name in `Piano` overrides the parent version for Piano instances.

:::

### Challenge: extend initialization

Create a child class for a `FestivalPass` that reuses the parent's name setup and adds an access zone.

```python run
class Pass:
    def __init__(self, holder):
        self.holder = holder

class FestivalPass(Pass):
    def __init__(self, holder, zone):
        super().__init__(holder)
        self.zone = zone

entry = FestivalPass("Meera", "stage")
print(entry.holder, entry.zone)
```

```output
Meera stage
```

:::solution

The child's initializer calls the parent's initializer for the shared holder data, then stores its own zone attribute.

:::

## Recap

- Inheritance lets a child class reuse behavior from a parent class.
- A child can add methods or override inherited method names.
- `super()` lets child code use the next implementation in the method resolution order.
- A child instance also satisfies an `isinstance` check for its parent.
- Use inheritance for a clear “is a kind of” relationship and keep class trees understandable.

Reference: Python documentation, Inheritance
