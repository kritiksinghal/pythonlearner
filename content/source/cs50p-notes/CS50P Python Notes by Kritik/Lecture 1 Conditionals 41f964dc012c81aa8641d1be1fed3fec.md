# Lecture 1: Conditionals

<aside>
🧠

**Big idea:** conditionals let your program choose. Like a traffic light, it checks a condition and picks a path: go, slow down, or stop.

</aside>

## 🧠 Understand it first

A condition is a question Python can answer with `True` or `False`: for example, `temperature < 0`. An `if / elif / else` chain checks from top to bottom and runs only the first branch whose condition is true.

Put the most specific rules first and the catch-all rule last. `and` means both checks must be true; `or` means at least one is true; `not` flips a true/false result. Also keep the symbols straight: `=` stores a value, while `==` asks whether two values are equal.

![A visual guide to Lecture 1: how Python selects a conditional branch.](Lecture%201%20Conditionals/cs50p-lecture-1-conditionals-visual.svg)

A visual guide to Lecture 1: how Python selects a conditional branch.

### 🔍 One decision, traced slowly

```python
score = 85

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
else:
    grade = "C"

print(grade)
```

1. Python checks `score >= 90`. For 85, that is `False`, so it skips the A block.
2. It checks the next condition, `score >= 80`. That is `True`, so it stores `"B"`.
3. The whole chain is finished. Python does not also run `else`; `print` shows `B`.

<aside>
🛑

**Oops!** Put the narrowest rule first. If you check `score >= 70` before `score >= 90`, a score of 95 matches the first rule and never reaches the A rule. Use `==` to compare; a single `=` assigns a value.

</aside>

## 📝 Notes

### 1. Comparison operators

| Operator | Meaning |
| --- | --- |
| `==` | equal to |
| `!=` | not equal to |
| `>` and `<` | greater than, less than |
| `>=` and `<=` | greater or equal, less or equal |

<aside>
⚠️

`=` **stores** a value (`x = 5`). `==` **compares** two values (`x == 5`). Mixing them up is the most common beginner error.

</aside>

### 2. `if`, `elif`, `else`

```python
score = int(input('Score: '))

if score >= 90:
    print('Grade A')
elif score >= 80:
    print('Grade B')
elif score >= 70:
    print('Grade C')
else:
    print('Keep practising!')
```

If you tested `score >= 70` first, a score of 95 would get a C, because 95 is also at least 70. Always put the **strictest** condition first.

### 3. `and`, `or`, `not`

```python
age = int(input('Age: '))

if age >= 13 and age <= 19:
    print('Teenager')

answer = input('Continue? ').lower()
if answer == 'y' or answer == 'yes':
    print('Great')

if not age >= 18:
    print('Minor')
```

| Word | True when |
| --- | --- |
| `and` | both sides are True |
| `or` | at least one side is True |
| `not` | flips True to False and False to True |

Python also lets you write a range check neatly: `if 13 <= age <= 19:`.

### 4. Even or odd with `%`

```python
n = int(input('n: '))
if n % 2 == 0:
    print('Even')
else:
    print('Odd')
```

### 5. Boolean functions

A function can return `True` or `False`. Name it like a question.

```python
def is_even(n):
    return n % 2 == 0
```

Notice that `return n % 2 == 0` already is a boolean, so you do not need `if ...: return True`.

### 6. `match`

```python
house = input('House: ')

match house:
    case 'Harry' | 'Ron':
        print('Gryffindor')
    case 'Draco':
        print('Slytherin')
    case _:
        print('Unknown')
```

`|` means “or”, and `_` is the catch-all, like `else`.

## 🔬 Line by line: how Python decides

### 🎞️ Example A: tracing a grade

```python
score = 85
if score >= 90:
    print('A')
elif score >= 80:
    print('B')
else:
    print('C')
```

| Check | Result | What happens |
| --- | --- | --- |
| `85 >= 90` | False | skip the `A` block |
| `85 >= 80` | True | run `print('B')` |
| `else` | not reached | Python already found a match, so it stops checking |

Output: `B`. The `else` is only a fallback.

### 🎞️ Example B: why order matters

```python
score = 95
if score >= 80:
    print('B')
elif score >= 90:
    print('A')
```

`95 >= 80` is True, so Python prints `B` and **never looks** at the `A` check. A 95 is stuck with a B. Fix: put the strictest check (`>= 90`) first.

### 🎞️ Example C: `and` versus `or`

```python
age = 15
print(age >= 13 and age <= 19)   # True and True  -> True
print(age < 10 or age > 60)      # False or False -> False
print(not age >= 18)             # not False      -> True
```

<aside>
🎭

**Real-life picture:** `and` is a club that needs *both* an ID and a ticket. `or` is a club that lets you in with *either*. `not` is the bouncer who says the opposite of whatever the guard said.

</aside>

<aside>
🧪

**Try it yourself:** trace FizzBuzz for `n = 15` on paper. Which `if` fires first, and why would checking `n % 3` first give the wrong answer?

</aside>

## 📖 Key definitions

| Term | Simple meaning |
| --- | --- |
| Boolean (`bool`) | A value that is only `True` or `False` |
| Condition | An expression Python can answer with True or False |
| `if` | Run this block only when the condition is True |
| `elif` | “Else if”: another check when earlier ones failed |
| `else` | Runs when none of the checks were True |
| Modulus `%` | The remainder after division |
| `match` | A neat way to compare one value with many options |

## ⚠️ Common mistakes

- Using `=` instead of `==` inside an `if`.
- Forgetting the colon `:` at the end of `if`, `elif` and `else` lines.
- Writing `if x == 1 or 2:`. That does not mean what you think. Write `if x == 1 or x == 2:`.
- Putting a loose check before a strict one, so the strict one is never reached.

## 🧑‍💻 Programming questions

- 🧑‍💻 P1. **Grade checker.** Ask for marks and print A (90 or more), B (80 or more), C (70 or more), otherwise Fail.
    
    💡 Hint: check the highest mark first.
    
    ```python
    m = int(input('Marks: '))
    if m >= 90:
        print('A')
    elif m >= 80:
        print('B')
    elif m >= 70:
        print('C')
    else:
        print('Fail')
    ```
    
- 🧑‍💻 P2. **Leap year.** A year is a leap year if divisible by 4, except century years, which must be divisible by 400.
    
    💡 Hint: combine conditions with `and` and `or`.
    
    ```python
    y = int(input('Year: '))
    if (y % 4 == 0 and y % 100 != 0) or y % 400 == 0:
        print('Leap year')
    else:
        print('Not a leap year')
    ```
    
- 🧑‍💻 P3. **FizzBuzz for one number.** Print `Fizz` if divisible by 3, `Buzz` if by 5, `FizzBuzz` if by both, otherwise the number.
    
    💡 Hint: test the “both” case first.
    
    ```python
    n = int(input('n: '))
    if n % 15 == 0:
        print('FizzBuzz')
    elif n % 3 == 0:
        print('Fizz')
    elif n % 5 == 0:
        print('Buzz')
    else:
        print(n)
    ```
    
- 🧑‍💻 P4. **Largest of three.** Ask for three numbers and print the largest without using `max()`.
    
    💡 Hint: compare `a` with `b` and `c`.
    
    ```python
    a = int(input('a: '))
    b = int(input('b: '))
    c = int(input('c: '))
    
    if a >= b and a >= c:
        print(a)
    elif b >= c:
        print(b)
    else:
        print(c)
    ```
    
- 🧑‍💻 P5. **Ticket price.** Age under 5 is free, 5 to 17 pays 100, 18 to 59 pays 200, 60 or more pays 150.
    
    💡 Hint: use `elif` with ranges.
    
    ```python
    age = int(input('Age: '))
    if age < 5:
        price = 0
    elif age < 18:
        price = 100
    elif age < 60:
        price = 200
    else:
        price = 150
    print(f'Price: {price}')
    ```
    

## 🎯 MCQs

- 🎯 Q1. Which operator checks equality? (A) = (B) == (C) != (D) =>
    
    **Answer: (B).** `==` compares, `=` assigns.
    
- 🎯 Q2. What is `True and False`? (A) True (B) False (C) Error (D) None
    
    **Answer: (B).** `and` needs both sides to be True.
    
- 🎯 Q3. How many blocks of an `if / elif / else` chain run? (A) all (B) at most one (C) exactly two (D) none
    
    **Answer: (B).** Only the first matching block runs.
    
- 🎯 Q4. What is `10 % 3`? (A) 3 (B) 1 (C) 0 (D) 3.33
    
    **Answer: (B).** 10 divided by 3 leaves remainder 1.
    
- 🎯 Q5. In `match`, which case catches everything else? (A) `case else` (B) `case *` (C) `case _` (D) `case default`
    
    **Answer: (C).** The underscore is the catch-all.
    

## ✅ Quick recap

- Conditions are True or False; `==` compares and `=` stores.
- Only the first matching branch runs, so order matters.
- `and`, `or`, `not` combine conditions.
- `match` is a tidy alternative to many `elif` lines.