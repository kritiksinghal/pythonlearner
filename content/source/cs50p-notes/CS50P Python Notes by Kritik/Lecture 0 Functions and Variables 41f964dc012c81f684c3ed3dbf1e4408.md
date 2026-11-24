# Lecture 0: Functions and Variables

<aside>
🧠

**Big idea:** a program is like a recipe. `input` brings the ingredients in, your code does the cooking, and `print` serves the result. A **variable** is a labelled box that remembers a value. A **function** is a named mini-recipe you can reuse.

</aside>

## 🧠 Understand it first

Python reads your instructions from top to bottom. A variable gives a value a name. For example, `age = 18` means the name `age` now refers to the number `18`.

A function is a reusable recipe. Writing `def greet(name):` defines the recipe; it does not run it yet. Calling `greet("Ada")` runs it. The name inside the parentheses in the definition is a parameter; the real value you pass in is an argument.

Two actions that look similar have different jobs: `print` shows something to a person, while `return` sends a value back to the rest of the program. And one beginner trap: `input()` always gives you text. Turn it into an integer with `int(...)` before doing number math.

![A visual guide to Lecture 0: how function inputs become returned values.](Lecture%200%20Functions%20and%20Variables/cs50p-lecture-0-functions-visual.svg)

A visual guide to Lecture 0: how function inputs become returned values.

### 🔍 One function call, from start to finish

```python
def double(number):
    answer = number * 2
    return answer

typed = input("Number: ")
number = int(typed)
print(double(number))
```

1. Python stores the recipe when it reads `def double...`; the body waits until the function is called.
2. If you type `6`, `input` gives the text `"6"`. It is not the number `6` yet.
3. `int(typed)` converts that text to the integer `6`.
4. `double(number)` calls the function and places `6` into its parameter named `number`.
5. The function calculates `12` and `return` hands `12` back to the caller. The outer `print` displays it.

<aside>
🛑

**Oops!** `print(value)` displays a value for a person; `return value` gives it back to code. If a function only prints, a caller usually receives `None`. Also, writing `double` names the function; `double(6)` runs it.

</aside>

## 📝 Notes

### 1. Your first function: `print`

```python
print('hello, world')
```

Text inside quotes is called a **string** (`str`). Without quotes, Python thinks you mean a variable name.

```python
print('a', 'b', 'c', sep='-')   # a-b-c
print('no new line', end='')     # stays on the same line
```

### 2. Variables and `input`

```python
name = input('What is your name? ')
print('hello,', name)
```

Variable naming rules: use letters, digits and underscores, never start with a digit, and remember that `Name` and `name` are different. Python style is `snake_case`, for example `total_marks`.

### 3. Strings and f-strings

```python
name = '  ada lovelace  '
name = name.strip().title()    # 'Ada Lovelace'
first, last = name.split(' ')
print(f'Hello, {first}!')       # f-string puts variables inside text
```

| Method | What it does | Example |
| --- | --- | --- |
| `strip()` | removes spaces at both ends | `' hi '.strip()` gives `'hi'` |
| `title()` | Capitalises Every Word | `'ada lovelace'.title()` |
| `upper()` / `lower()` | changes case | `'Hi'.upper()` gives `'HI'` |
| `split()` | cuts text into a list | `'a b'.split(' ')` |

### 4. Numbers

`input` **always returns a string**, even if the user types digits. Convert with `int()` (whole number) or `float()` (decimal).

```python
x = int(input('x: '))
y = int(input('y: '))
print(x + y)
```

| Operator | Meaning | Example |
| --- | --- | --- |
|   `• - *` | add, subtract, multiply | `3 * 4` is `12` |
| `/` | divide (always a float) | `7 / 2` is `3.5` |
| `//` | floor division | `7 // 2` is `3` |
| `%` | remainder | `7 % 2` is `1` |
| `**` | power | `2 ** 3` is `8` |

```python
z = round(10 / 3, 2)
print(z)                 # 3.33
print(f'{1234567:,}')    # 1,234,567
print(f'{10 / 3:.2f}')   # 3.33
```

### 5. Writing your own functions

```python
def hello(to='world'):
    print('hello,', to)

hello()          # hello, world
hello('Kritik')  # hello, Kritik
```

`def` starts a function. The indented lines are its body. `to='world'` is a **default value**. To send a value back, use `return`:

```python
def square(n):
    return n * n

def main():
    x = int(input('x: '))
    print('x squared is', square(x))

main()
```

Variables created inside a function are **local**: they exist only while that function runs.

## 🔬 Line by line: what is Python really doing?

<aside>
🎬

Let’s slow the film down and watch the code **frame by frame**, the way Python reads it.

</aside>

### 🎞️ Example A: the greeting program

```python
name = input('What is your name? ')
print('hello,', name)
```

1. `input('What is your name? ')` shows the question and **pauses** the program until the user presses Enter.
2. Whatever was typed (say `Kritik`) comes back as a string.
3. `name =` stores that string in the box called `name`.
4. `print('hello,', name)` prints `hello,` and then the **contents** of the box. `name` has no quotes, so Python looks *inside* the box instead of printing the word.
5. `print` puts a space between its pieces on its own, so the screen shows `hello, Kritik`.

### 🎞️ Example B: why `2 + 3` can become `23`

```python
x = input('x: ')     # user types 2
y = input('y: ')     # user types 3
print(x + y)         # 23
```

`x` holds the **text** `'2'` and `y` holds the **text** `'3'`. For text, `+` means *stick together*, so you get `'23'`. Convert first and the same `+` adds numbers:

```python
print(int(x) + int(y))   # 5
```

### 🎞️ Example C: following a function call

```python
def square(n):
    return n * n

y = square(4)
print(y)
```

| Step | What Python does |
| --- | --- |
| 1 | Reads `def square(n)` and **remembers** it. Nothing runs yet. |
| 2 | Reaches `square(4)` and jumps into the function with `n = 4`. |
| 3 | Calculates `4 * 4`, which is `16`. |
| 4 | `return` sends `16` back to where the function was called. |
| 5 | `y = 16`, and `print(y)` shows `16`. |

<aside>
🎭

**Real-life picture:** `def` is writing a recipe on a card and putting it in a drawer. Calling the function is taking the card out and cooking. `return` is handing the finished dish to whoever ordered it.

</aside>

<aside>
🧪

**Try it yourself:** change `square` so it returns `n ** 3`. Predict the result for `square(3)` before you run it.

</aside>

## 📖 Key definitions

| Term | Simple meaning |
| --- | --- |
| Variable | A named box that stores a value |
| String (`str`) | Text, written inside quotes |
| Integer (`int`) | A whole number like 5 |
| Float | A number with a decimal point like 3.5 |
| Function | A named, reusable block of code |
| Argument | The value you give to a function |
| Return value | The value a function gives back |
| f-string | A string starting with `f` that can hold `{variables}` |
| Local variable | A variable that exists only inside its function |

## ⚠️ Common mistakes

- Forgetting that `input` returns text: `'2' + '3'` is `'23'`, not `5`.
- Writing `print(Hello)` without quotes. Python looks for a variable named `Hello`.
- Mixing up `print` (shows a value) and `return` (hands a value back).
- Forgetting the colon `:` or the indentation after `def`.

## 🧑‍💻 Programming questions

- 🧑‍💻 P1. **Greeter.** Ask for the user’s name and print `Hello, <Name>!` in Title Case with extra spaces removed.
    
    💡 Hint: chain `strip()` and `title()`.
    
    ```python
    name = input('Name: ').strip().title()
    print(f'Hello, {name}!')
    ```
    
- 🧑‍💻 P2. **Mini calculator.** Ask for two numbers and print their sum, difference, product and the division rounded to 2 decimals.
    
    💡 Hint: use `float()`, then `round(x, 2)`.
    
    ```python
    a = float(input('a: '))
    b = float(input('b: '))
    print('sum:', a + b)
    print('difference:', a - b)
    print('product:', a * b)
    print('division:', round(a / b, 2))
    ```
    
- 🧑‍💻 P3. **Tip function.** Write `tip(bill, percent)` that returns the tip amount, then print the tip for a bill of 500 at 10 percent.
    
    💡 Hint: use `def` and `return`.
    
    ```python
    def tip(bill, percent):
        return bill * percent / 100
    
    print(tip(500, 10))   # 50.0
    ```
    
- 🧑‍💻 P4. **Camel to snake.** Ask for text such as `Hello World` and print it as `hello_world`.
    
    💡 Hint: `lower()` then `replace(' ', '_')`.
    
    ```python
    text = input('Text: ').strip()
    print(text.lower().replace(' ', '_'))
    ```
    
- 🧑‍💻 P5. **Seconds converter.** Ask for a number of seconds and print it as minutes and seconds, for example `135` gives `2 min 15 sec`.
    
    💡 Hint: `//` gives minutes and `%` gives what is left.
    
    ```python
    s = int(input('Seconds: '))
    print(f'{s // 60} min {s % 60} sec')
    ```
    

## 🎯 MCQs

- 🎯 Q1. What type does `input()` return? (A) int (B) str (C) float (D) bool
    
    **Answer: (B).** `input` always gives a string, even when the user types a number.
    
- 🎯 Q2. What is `7 // 2`? (A) 3.5 (B) 3 (C) 4 (D) 1
    
    **Answer: (B).** `//` drops the decimal part.
    
- 🎯 Q3. What does `print('2' + '3')` show? (A) 5 (B) 23 (C) Error (D) 2 3
    
    **Answer: (B).** `+` joins strings together.
    
- 🎯 Q4. Which keyword hands a value back from a function? (A) print (B) give (C) return (D) output
    
    **Answer: (C).** `return` sends the value back to the caller.
    
- 🎯 Q5. What is `7 % 2`? (A) 3 (B) 3.5 (C) 1 (D) 0
    
    **Answer: (C).** `%` gives the remainder.
    

## ✅ Quick recap

- `print` shows, `input` asks, and `input` always returns a `str`.
- Use `int()` or `float()` to turn text into numbers.
- f-strings make output tidy: `f'Hello, {name}'`.
- `def` makes a function and `return` hands back a value.