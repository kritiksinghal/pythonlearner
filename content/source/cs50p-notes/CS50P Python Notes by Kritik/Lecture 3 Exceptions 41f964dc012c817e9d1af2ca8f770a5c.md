# Lecture 3: Exceptions

<aside>
🧠

**Big idea:** users will type unexpected things. Exceptions are errors, and `try / except` is a safety net that stops your program from crashing.

</aside>

## 🧠 Understand it first

An exception is a problem Python discovers while a program is running, such as trying to turn `"cat"` into a number. Python raises an exception so the program has a chance to respond instead of stopping unexpectedly.

Put only the risky operation inside `try`. Use `except` for the kind of error you know how to handle. The optional `else` block runs when the risky step worked, and `raise` lets your own code report invalid data deliberately. Catching a specific error makes the program's response easier to trust.

![A visual guide to Lecture 3: the success and recovery paths around risky code.](Lecture%203%20Exceptions/cs50p-lecture-3-exceptions-visual.svg)

A visual guide to Lecture 3: the success and recovery paths around risky code.

### 🔍 A safe conversion, traced

```python
raw = "7"

try:
    age = int(raw)
except ValueError:
    print("Please type digits")
else:
    print(f"Next year: {age + 1}")
```

1. The risky operation is `int(raw)`: it works for text like `"7"`, but not for `"cat"`.
2. If conversion works, Python skips `except` and runs `else`, printing `Next year: 8`.
3. If conversion raises `ValueError`, Python jumps to the matching `except` block. The program can respond instead of crashing.
4. `raise ValueError(...)` is the opposite direction: your own function can raise an error when its input breaks a rule.

<aside>
🛑

**Oops!** Catch the error you expect, such as `ValueError` for a bad number. A giant `except:` can hide unrelated bugs, making a program look successful while it silently does the wrong thing.

</aside>

## 📝 Notes

### 1. Kinds of errors

| Error | When it happens | Example |
| --- | --- | --- |
| `SyntaxError` | Broken Python grammar | missing a colon |
| `ValueError` | Right type, wrong value | `int('cat')` |
| `TypeError` | Wrong type | `'a' + 1` |
| `NameError` | Name does not exist | using a variable before creating it |
| `ZeroDivisionError` | Dividing by zero | `5 / 0` |
| `KeyError` | Missing dictionary key | `d['missing']` |
| `IndexError` | List position too big | `[1, 2][5]` |

### 2. `try` and `except`

```python
try:
    x = int(input('Number: '))
except ValueError:
    print('That is not a number')
```

Catch **specific** errors. A bare `except:` hides real bugs and is considered bad style.

### 3. `else`

`else` runs only if **no error** happened.

```python
while True:
    try:
        x = int(input('Number: '))
    except ValueError:
        print('Try again')
    else:
        break
print(f'You typed {x}')
```

### 4. A reusable `get_int`

```python
def get_int(prompt):
    while True:
        try:
            return int(input(prompt))
        except ValueError:
            pass          # do nothing, ask again

age = get_int('Age: ')
```

`pass` means “do nothing”. Because `return` leaves the function, no `else` is needed here.

### 5. Catching several errors

```python
try:
    a = int(input('a: '))
    b = int(input('b: '))
    print(a / b)
except ValueError:
    print('Numbers only')
except ZeroDivisionError:
    print('Cannot divide by zero')
```

### 6. `raise`

You can create an error on purpose when something is wrong.

```python
def set_age(age):
    if age < 0:
        raise ValueError('Age cannot be negative')
    return age
```

## 🔬 Line by line: how Python survives an error

### 🎞️ Example A: following `get_int`

```python
def get_int(prompt):
    while True:
        try:
            return int(input(prompt))
        except ValueError:
            pass
```

Suppose the user types `cat` first and then `7`.

| Step | What happens |
| --- | --- |
| 1 | `while True` starts a loop that only ends by `return`. |
| 2 | `input(prompt)` gets `'cat'`. |
| 3 | `int('cat')` fails and raises `ValueError`. |
| 4 | Python **jumps** to `except ValueError`, skipping the rest of `try`. |
| 5 | `pass` does nothing, so the loop goes round again. |
| 6 | `input` gets `'7'`, `int('7')` works, and `return 7` leaves the function. |

### 🎞️ Example B: which `except` catches what

```python
try:
    a = int(input('a: '))
    b = int(input('b: '))
    print(a / b)
except ValueError:
    print('Numbers only')
except ZeroDivisionError:
    print('Cannot divide by zero')
```

- Typing `x` for `a` fails inside `int(...)`, so `ValueError` fires.
- Typing `5` and `0` makes `a / b` fail, so `ZeroDivisionError` fires.
- Python checks the `except` blocks from top to bottom and runs only the first one that matches.

<aside>
🎭

**Real-life picture:** `try` is walking a tightrope with a safety net. `except` is the net, and each error type is a different kind of fall. A specific net catches the right fall; a bare `except:` is a net so big it also hides holes in the rope.

</aside>

<aside>
🧪

**Try it yourself:** in Example B, what happens if the user types `5` and then `abc`? Predict first, then run it.

</aside>

## 📖 Key definitions

| Term | Simple meaning |
| --- | --- |
| Exception | An error that happens while the program runs |
| Syntax error | Broken grammar, found before running |
| `try` | The block that holds the risky code |
| `except` | The block that handles a specific error |
| `else` | Runs if the `try` block had no error |
| `raise` | Create an exception yourself |
| `pass` | A statement that does nothing |

## ⚠️ Common mistakes

- Putting too much code inside `try`. Keep only the risky line there.
- Using a bare `except:` that swallows every error, even typos.
- Forgetting that `except` must name the error type, such as `ValueError`.
- Using `pass` and then not asking again, so the program carries on with bad data.

## 🧑‍💻 Programming questions

- 🧑‍💻 P1. **Safe division.** Ask for two numbers and print `a / b`, handling a zero divisor and non-number input separately.
    
    💡 Hint: two `except` blocks.
    
    ```python
    try:
        a = float(input('a: '))
        b = float(input('b: '))
        print(a / b)
    except ZeroDivisionError:
        print('Cannot divide by zero')
    except ValueError:
        print('Enter numbers only')
    ```
    
- 🧑‍💻 P2. **get_int.** Write `get_int(prompt)` that keeps asking until the user enters a whole number, then returns it.
    
    💡 Hint: `while True`, `try`, `return`.
    
    ```python
    def get_int(prompt):
        while True:
            try:
                return int(input(prompt))
            except ValueError:
                pass
    
    print(get_int('Age: '))
    ```
    
- 🧑‍💻 P3. **Safe list access.** Given `items = ['a', 'b', 'c']`, ask for an index and print the item, or `Out of range` if it fails.
    
    💡 Hint: the errors are `IndexError` and `ValueError`.
    
    ```python
    items = ['a', 'b', 'c']
    try:
        print(items[int(input('Index: '))])
    except (IndexError, ValueError):
        print('Out of range')
    ```
    
- 🧑‍💻 P4. **Fraction percent.** Ask for `x/y` such as `1/4` and print it as a percentage. Handle bad input and `y = 0`.
    
    💡 Hint: `split('/')`, then `int()` both parts.
    
    ```python
    while True:
        try:
            x, y = input('Fraction: ').split('/')
            x, y = int(x), int(y)
            print(f'{x / y * 100:.0f}%')
            break
        except (ValueError, ZeroDivisionError):
            pass
    ```
    
- 🧑‍💻 P5. **Validated age.** Write `set_age(age)` that raises `ValueError` if the age is below 0 or above 120, and otherwise returns the age.
    
    💡 Hint: use `raise ValueError('message')`.
    
    ```python
    def set_age(age):
        if age < 0 or age > 120:
            raise ValueError('Invalid age')
        return age
    ```
    

## 🎯 MCQs

- 🎯 Q1. Which block runs only when no error occurred? (A) except (B) else (C) raise (D) pass
    
    **Answer: (B).**
    
- 🎯 Q2. What does `int('cat')` raise? (A) TypeError (B) NameError (C) ValueError (D) KeyError
    
    **Answer: (C).** The type is fine (a string) but the value is not a number.
    
- 🎯 Q3. What does `pass` do? (A) exits the program (B) skips the loop (C) does nothing (D) raises an error
    
    **Answer: (C).**
    
- 🎯 Q4. Why is a bare `except:` a bad idea? (A) It is slower (B) It hides real bugs (C) It is not allowed (D) It prints errors twice
    
    **Answer: (B).**
    
- 🎯 Q5. Which keyword creates an error on purpose? (A) throw (B) error (C) raise (D) fail
    
    **Answer: (C).**
    

## ✅ Quick recap

- Exceptions stop the program unless you catch them.
- Put only risky code in `try` and catch specific errors.
- `else` runs when nothing went wrong.
- `raise` creates your own errors.