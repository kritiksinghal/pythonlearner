# Lecture 8: Object-Oriented Programming

<aside>
🧠

**Big idea:** a **class** is a blueprint (like a cookie cutter) and an **object** is something built from it (a cookie). Classes let you bundle data and the actions on that data together.

</aside>

## 🧠 Understand it first

A class is a blueprint for a kind of thing; an object is one thing made from that blueprint. A `Student` object might store a name and marks as attributes, then provide methods such as `grade()` that use that data.

When you create an object, `__init__` sets it up. In an instance method, `self` means “this particular object.” So `self.name = name` saves a name on that object, where another method can use it later. Properties can validate values, class methods can offer another way to create objects, and inheritance lets one class reuse or extend another.

![A visual guide to Lecture 8: how a class blueprint creates objects.](Lecture%208%20Object-Oriented%20Programming/cs50p-lecture-8-classes-visual.svg)

A visual guide to Lecture 8: how a class blueprint creates objects.

### 🔍 Make an object and call a method

```python
class Student:
    def __init__(self, name):
        self.name = name

    def greet(self):
        return f"Hi, I'm {self.name}"

ada = Student("Ada")
print(ada.greet())
```

1. The class is the blueprint. Calling `Student("Ada")` creates one object.
2. Python automatically passes that new object into `__init__` as `self`. The other argument, `"Ada"`, is placed in `name`.
3. `self.name = name` saves the value on this object. Another student object can have a different `self.name`.
4. Calling `ada.greet()` runs the method for Ada's object. The method can read the saved attribute and return a message.

<aside>
🛑

**Oops!** `self` is the current object, not a magic global variable. If you write only `name = name`, you create or update a local name; you have not saved it as `self.name` for later.

</aside>

## 📝 Notes

### 1. A first class

```python
class Student:
    def __init__(self, name, house):
        self.name = name
        self.house = house

    def __str__(self):
        return f'{self.name} from {self.house}'

student = Student('Harry', 'Gryffindor')
print(student.name)   # Harry
print(student)        # Harry from Gryffindor
```

| Part | Role |
| --- | --- |
| `class Student:` | creates the blueprint |
| `__init__` | the **constructor**, runs when an object is created |
| `self.name = name` | stores data on the object (an attribute) |
| `__str__` | decides what `print(student)` shows |

### 2. Methods

```python
class Dog:
    def __init__(self, name):
        self.name = name

    def bark(self):
        print(f'{self.name} says woof')

Dog('Bruno').bark()
```

### 3. Protecting data with `@property`

A **property** lets you check values when they are set.

```python
class Student:
    def __init__(self, name, house):
        self.name = name
        self.house = house

    @property
    def house(self):
        return self._house

    @house.setter
    def house(self, house):
        if house not in ['Gryffindor', 'Slytherin']:
            raise ValueError('Invalid house')
        self._house = house
```

The underscore in `_house` is a hint that this is the internal storage and should be changed through the property.

### 4. Class methods

`@classmethod` belongs to the class, not one object. It is often used to create objects in another way.

```python
class Student:
    def __init__(self, name, house):
        self.name = name
        self.house = house

    @classmethod
    def get(cls):
        name = input('Name: ')
        house = input('House: ')
        return cls(name, house)

student = Student.get()
```

### 5. Inheritance

A new class can **inherit** everything from another class and then add or change things.

```python
class Person:
    def __init__(self, name):
        self.name = name

class Wizard(Person):
    def __init__(self, name, house):
        super().__init__(name)
        self.house = house
```

`Wizard` is a `Person` with extra data. `super()` calls the parent’s code.

### 6. Operator overloading (bonus)

```python
class Vault:
    def __init__(self, gold=0):
        self.gold = gold

    def __add__(self, other):
        return Vault(self.gold + other.gold)
```

Now `Vault(10) + Vault(5)` works because you defined `__add__`.

## 📖 Key definitions

| Term | Simple meaning |
| --- | --- |
| Class | A blueprint for making objects |
| Object (instance) | One thing created from a class |
| Attribute | A variable stored on an object, like `self.name` |
| Method | A function that belongs to a class |
| `self` | The object a method is working on |
| Constructor (`__init__`) | The method that sets up a new object |
| Property | A method used like an attribute, often with validation |
| Inheritance | A class reusing and extending another class |

## ⚠️ Common mistakes

- Forgetting `self` as the first parameter of a method.
- Forgetting `self.` before attribute names, so values are lost.
- Mixing up the class (`Student`) with an object (`Student('Harry', 'Gryffindor')`).
- Having a property and an attribute with the same stored name, which causes endless recursion. Store in `_house`.

## 🧑‍💻 Programming questions

- 🧑‍💻 P1. **Student grade.** Create a `Student` class with `name` and `marks`, and a method `grade()` that returns `'A'` for 90 or more, otherwise `'B'`.
    
    💡 Hint: define `__init__` first.
    
    ```python
    class Student:
        def __init__(self, name, marks):
            self.name = name
            self.marks = marks
    
        def grade(self):
            return 'A' if self.marks >= 90 else 'B'
    
    print(Student('Ria', 93).grade())   # A
    ```
    
- 🧑‍💻 P2. **Bank account.** Make a `BankAccount` with `deposit()` and `withdraw()`. Block withdrawing more than the balance by raising `ValueError`.
    
    💡 Hint: keep the balance in `self.balance`.
    
    ```python
    class BankAccount:
        def __init__(self):
            self.balance = 0
    
        def deposit(self, amount):
            self.balance += amount
    
        def withdraw(self, amount):
            if amount > self.balance:
                raise ValueError('Insufficient funds')
            self.balance -= amount
    ```
    
- 🧑‍💻 P3. **Inheritance.** Make an `Animal` class with `speak()` that returns `'...'`, and a `Dog` subclass that overrides it to return `'Woof'`.
    
    💡 Hint: `class Dog(Animal)`.
    
    ```python
    class Animal:
        def speak(self):
            return '...'
    
    class Dog(Animal):
        def speak(self):
            return 'Woof'
    
    print(Dog().speak())   # Woof
    ```
    
- 🧑‍💻 P4. **Rectangle.** Make a `Rectangle` with `width` and `height`, a method `area()`, and a `__str__` that prints like `Rectangle 3 x 4`.
    
    💡 Hint: `__str__` must return a string.
    
    ```python
    class Rectangle:
        def __init__(self, width, height):
            self.width = width
            self.height = height
    
        def area(self):
            return self.width * self.height
    
        def __str__(self):
            return f'Rectangle {self.width} x {self.height}'
    
    r = Rectangle(3, 4)
    print(r, r.area())   # Rectangle 3 x 4 12
    ```
    
- 🧑‍💻 P5. **Valid age property.** Make a `Person` whose `age` must be between 0 and 120, otherwise raise `ValueError`.
    
    💡 Hint: `@property` and `@age.setter`.
    
    ```python
    class Person:
        def __init__(self, age):
            self.age = age
    
        @property
        def age(self):
            return self._age
    
        @age.setter
        def age(self, value):
            if not 0 <= value <= 120:
                raise ValueError('Invalid age')
            self._age = value
    ```
    

## 🎯 MCQs

- 🎯 Q1. Which method runs when you create an object? (A) **str** (B) **init** (C) **call** (D) **del**
    
    **Answer: (B).**
    
- 🎯 Q2. What is the difference between a class and an object? (A) none (B) a class is the blueprint, an object is one thing built from it (C) an object is the blueprint (D) a class is a variable
    
    **Answer: (B).**
    
- 🎯 Q3. What does `self` refer to? (A) the class (B) the object the method is working on (C) the module (D) the parent class
    
    **Answer: (B).**
    
- 🎯 Q4. Which method controls what `print(obj)` shows? (A) **init** (B) **repr** only (C) **str** (D) **show**
    
    **Answer: (C).**
    
- 🎯 Q5. In `class Dog(Animal):`, what is `Animal`? (A) an attribute (B) the parent class (C) a method (D) a module
    
    **Answer: (B).** `Dog` inherits from `Animal`.
    

## ✅ Quick recap

- A class is a blueprint, an object is an instance of it.
- `__init__` sets up the object, `self` means “this object”.
- `@property` validates values, `@classmethod` belongs to the class.
- Inheritance lets one class reuse and extend another.