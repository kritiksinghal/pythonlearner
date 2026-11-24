# Lecture 4: Libraries

<aside>
🧠

**Big idea:** do not reinvent the wheel. Python comes with ready-made code in **modules**, and the internet has thousands more **packages** you can install.

</aside>

## 🧠 Understand it first

A library is reusable code someone has already written. A module is one named collection of that code; `import` makes it available to your program. The dot in `random.choice(...)` means “look for `choice` inside the `random` module.”

Python's standard library comes with Python. A third-party package must be installed, usually with `pip`. You will also meet command-line arguments (text given when starting a program) and APIs (ways programs request information from other services). Importing code does not mean you must understand its internals before using its documented functions.

![A visual guide to Lecture 4: how a program imports and uses a library.](Lecture%204%20Libraries/cs50p-lecture-4-libraries-visual.svg)

A visual guide to Lecture 4: how a program imports and uses a library.

### 🔍 Follow an imported function

```python
import random

names = ["Ada", "Grace", "Katherine"]
winner = random.choice(names)
print(winner)
```

1. `import random` makes Python's standard-library module available. You do not install it with `pip`.
2. `random` is the module name; `choice` is a function inside that module. The dot means “look inside this module.”
3. `random.choice(names)` returns one item from the list. Storing the result lets the rest of your program use it.

A third-party package is code you add separately with `pip`. A command-line argument is information given when starting the script; an API is a way for programs to request information from another service.

<aside>
🛑

**Oops!** After `import random`, `choice(names)` is not automatically a name in your file. Write `random.choice(names)`, or deliberately import the function with `from random import choice`.

</aside>

## 📝 Notes

### 1. `random`

```python
import random

print(random.choice(['heads', 'tails']))   # picks one item
print(random.randint(1, 10))               # whole number 1 to 10

cards = ['jack', 'queen', 'king']
random.shuffle(cards)
print(cards)
```

### 2. `from ... import ...`

```python
from random import choice
print(choice(['heads', 'tails']))
```

This imports only `choice`, so you can write `choice` instead of `random.choice`.

### 3. `statistics`

```python
import statistics
print(statistics.mean([100, 90]))   # 95
```

### 4. Command-line arguments with `sys`

`sys.argv` is the list of words typed after the program name in the terminal.

```python
import sys

if len(sys.argv) < 2:
    sys.exit('Too few arguments')

print('hello,', sys.argv[1])
```

Running `python hi.py Kritik` gives `sys.argv[0]` as `'hi.py'` and `sys.argv[1]` as `'Kritik'`. `sys.exit('message')` stops the program with a message.

### 5. Installing packages with `pip`

```bash
pip install cowsay
```

```python
import cowsay
cowsay.cow('hello, class')
```

### 6. APIs and `requests`

An **API** is a service your program can talk to over the internet. The `requests` package fetches data and `json` reads it.

```python
import requests, sys

if len(sys.argv) != 2:
    sys.exit()

response = requests.get('https://itunes.apple.com/search?entity=song&limit=1&term=' + sys.argv[1])
print(response.json())
```

### 7. Making your own library

Put functions in a file, such as `sayings.py`, and import them elsewhere.

```python
# sayings.py
def main():
    hello('world')

def hello(name):
    print(f'hello, {name}')

if __name__ == '__main__':
    main()
```

```python
# another file
from sayings import hello
hello('Kritik')
```

The line `if __name__ == '__main__':` makes `main()` run only when you run the file directly, not when someone imports it.

## 🔬 Line by line: borrowing other people’s code

### 🎞️ Example A: `random.choice`

```python
import random

coin = random.choice(['heads', 'tails'])
print(coin)
```

1. `import random` loads Python’s random-number toolbox.
2. `random.choice` means *use the `choice` tool from the `random` toolbox*. The dot is how you reach inside a module.
3. It picks one item from the list at random and hands it back, so `coin` is either `'heads'` or `'tails'`.

### 🎞️ Example B: tracing `sys.argv`

```python
import sys

if len(sys.argv) < 2:
    sys.exit('Too few arguments')

print('hello,', sys.argv[1])
```

You run `python hi.py Kritik` in the terminal.

| Expression | Value |
| --- | --- |
| `sys.argv` | `['hi.py', 'Kritik']` |
| `len(sys.argv)` | `2` |
| `sys.argv[1]` | `'Kritik'` |

The check `len(sys.argv) < 2` protects you: if the user typed only `python hi.py`, the list has one item and `sys.argv[1]` would crash with `IndexError`. `sys.exit('...')` stops cleanly with a message.

### 🎞️ Example C: why the `__main__` line exists

When you **run** a file, Python sets its `__name__` to `'__main__'`. When another file **imports** it, `__name__` is the file’s name instead. So `if __name__ == '__main__': main()` means *“run main() only if I am the starting file”*.

<aside>
🎭

**Real-life picture:** a library is a toolbox in a shared garage. You do not forge your own hammer. You walk in, grab `random.choice`, and walk out.

</aside>

<aside>
🧪

**Try it yourself:** write a program that takes two numbers from the command line and prints their sum. What should it do if only one number is given?

</aside>

## 📖 Key definitions

| Term | Simple meaning |
| --- | --- |
| Module | A Python file with code you can import |
| Package / library | A bundle of modules |
| `import` | Bring a module into your program |
| `pip` | Python’s tool for installing packages |
| API | A service your code can ask for data |
| JSON | A text format for data that looks like a dictionary |
| `sys.argv` | The list of command-line words |

## ⚠️ Common mistakes

- Naming your own file `random.py`. Python then imports your file instead of the real module.
- Forgetting to `pip install` a package before importing it.
- Forgetting that `sys.argv[0]` is the file name, not the first argument.
- Not checking `len(sys.argv)` before using `sys.argv[1]`.

## 🧑‍💻 Programming questions

- 🧑‍💻 P1. **Dice roller.** Roll two dice and print each value and the total.
    
    💡 Hint: `random.randint(1, 6)`.
    
    ```python
    import random
    
    a = random.randint(1, 6)
    b = random.randint(1, 6)
    print(a, b, 'Total:', a + b)
    ```
    
- 🧑‍💻 P2. **Average marks.** Ask for marks separated by commas, such as `80,90,70`, and print the mean using the `statistics` module.
    
    💡 Hint: `split(',')` and convert each part to `int`.
    
    ```python
    import statistics
    
    marks = [int(x) for x in input('Marks: ').split(',')]
    print(statistics.mean(marks))
    ```
    
- 🧑‍💻 P3. **Command-line greeter.** Running `python hi.py Kritik` should print `hello, Kritik`. Exit with a message if no name is given.
    
    💡 Hint: check `len(sys.argv)`.
    
    ```python
    import sys
    
    if len(sys.argv) != 2:
        sys.exit('Usage: python hi.py name')
    print('hello,', sys.argv[1])
    ```
    
- 🧑‍💻 P4. **Random card.** Pick a random card from a deck list and print it. Run it five times in a loop.
    
    💡 Hint: `random.choice` inside a `for` loop.
    
    ```python
    import random
    
    deck = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
    for _ in range(5):
        print(random.choice(deck))
    ```
    
- 🧑‍💻 P5. **Your own module.** Create `mathtools.py` with `double(n)` and `triple(n)`, then import and use them in another file.
    
    💡 Hint: `from mathtools import double`.
    
    ```python
    # mathtools.py
    def double(n):
        return n * 2
    
    def triple(n):
        return n * 3
    ```
    
    ```python
    # main.py
    from mathtools import double, triple
    
    print(double(4), triple(4))   # 8 12
    ```
    

## 🎯 MCQs

- 🎯 Q1. Which line gives a random whole number from 1 to 10? (A) random.choice(10) (B) random.randint(1, 10) (C) [random.int](http://random.int)(10) (D) randomize(10)
    
    **Answer: (B).** `randint(a, b)` includes both ends.
    
- 🎯 Q2. Which command installs a package? (A) import x (B) get x (C) pip install x (D) python x
    
    **Answer: (C).**
    
- 🎯 Q3. In `python hi.py Sam`, what is `sys.argv[1]`? (A) [hi.py](http://hi.py) (B) Sam (C) python (D) Error
    
    **Answer: (B).** `sys.argv[0]` is `hi.py`.
    
- 🎯 Q4. What is an API? (A) a Python keyword (B) a text editor (C) a service you can ask for data (D) a type of loop
    
    **Answer: (C).**
    
- 🎯 Q5. What does `if __name__ == '__main__':` do? (A) runs code only when the file is run directly (B) imports the file (C) deletes the file (D) installs a package
    
    **Answer: (A).**
    

## ✅ Quick recap

- `import` brings in a module, `from x import y` brings in just one thing.
- `random`, `statistics` and `sys` are built in; install others with `pip`.
- `sys.argv` holds command-line words, and `argv[0]` is the file name.
- Guard your own module’s start with `if __name__ == '__main__':`.