# Lecture 2: Loops

<aside>
🧠

**Big idea:** a loop repeats code so you do not have to copy and paste it. Use `for` when you know what to walk through, and `while` when you repeat until something changes.

</aside>

## 🧠 Understand it first

A loop repeats a block of code. A `for` loop visits items one by one—like each name in a list. A `while` loop repeats while a condition remains true, so something must eventually change that condition or the loop can run forever.

`range(start, stop)` includes `start` but excludes `stop`. That small rule explains many off-by-one mistakes. Use `break` to leave a loop early; use `continue` to skip the rest of the current round and move to the next one.

![A visual guide to Lecture 2: the setup, check, body, and repeat cycle.](Lecture%202%20Loops/cs50p-lecture-2-loops-visual.svg)

A visual guide to Lecture 2: the setup, check, body, and repeat cycle.

### 🔍 Count the loop rounds

```python
for step in range(1, 4):
    print(step)
```

1. `range(1, 4)` creates the sequence 1, 2, 3. The stop number 4 is left out.
2. The first round sets `step` to 1; the next rounds set it to 2 and 3.
3. After there are no more values, the loop ends. It prints three lines.

A `for` loop is handy when you have items to visit. A `while` loop is handy when you want to repeat until a condition changes. Check the condition before each `while` round, and make sure the body can eventually make it false.

<aside>
🛑

**Oops!** If the loop condition never changes, the loop never stops. In a counting `while` loop, update the counter inside the body. Use `break` for an intentional early exit; `continue` skips the rest of just the current round.

</aside>

## 📝 Notes

### 1. `while` loop

```python
i = 3
while i != 0:
    print('meow')
    i = i - 1      # same as i -= 1
```

This prints `meow` three times. Each round makes `i` smaller until it reaches 0.

### 2. `for` loop and `range`

```python
for i in range(3):
    print('meow')

for n in range(1, 6):
    print(n)        # 1 2 3 4 5
```

`range(3)` gives 0, 1, 2. `range(1, 6)` starts at 1 and stops **before** 6. When you do not need the counter, use `_` as the name.

### 3. Lists

A **list** keeps items in order. Counting starts at **0**.

```python
students = ['Hermione', 'Harry', 'Ron']
print(students[0])        # Hermione
print(len(students))      # 3
students.append('Draco')

for name in students:
    print(name)
```

### 4. Dictionaries

A **dictionary** stores **key: value** pairs, like a real dictionary stores word: meaning.

```python
house = {'Harry': 'Gryffindor', 'Draco': 'Slytherin'}
print(house['Harry'])             # Gryffindor

for name in house:
    print(name, 'is in', house[name])
```

### 5. `break` and `continue`

```python
while True:
    n = int(input('Number (0 to stop): '))
    if n == 0:
        break          # leave the loop completely
    if n < 0:
        continue       # skip to the next round
    print('You typed', n)
```

`while True:` loops forever on purpose, and `break` is the exit door.

## 🔬 Line by line: watching a loop run

### 🎞️ Example A: a `while` loop trace

```python
i = 3
while i != 0:
    print('meow')
    i = i - 1
```

| Round | `i` at start | `i != 0`? | Action | `i` after |
| --- | --- | --- | --- | --- |
| 1 | 3 | True | print meow | 2 |
| 2 | 2 | True | print meow | 1 |
| 3 | 1 | True | print meow | 0 |
| check | 0 | False | loop ends | 0 |

If you forget `i = i - 1`, `i` stays 3 forever. That is an infinite loop.

### 🎞️ Example B: `for` with `range`

```python
for i in range(1, 4):
    print(i * 10)
```

Python builds the numbers 1, 2, 3. For each one it sets `i` to that number and runs the body, so you see `10`, `20`, `30`. Four never appears because `range` stops **before** the end value.

### 🎞️ Example C: reading a dictionary loop

```python
house = {'Harry': 'Gryffindor', 'Draco': 'Slytherin'}
for name in house:
    print(name, house[name])
```

Looping over a dictionary gives you its **keys**: first `'Harry'`, then `'Draco'`. `house[name]` looks up the value for that key. So you get `Harry Gryffindor` and `Draco Slytherin`.

<aside>
🎭

**Real-life picture:** `for` is a teacher calling every name on the attendance list. `while` is a guard who keeps asking for the password until it is right.

</aside>

<aside>
🧪

**Try it yourself:** make a countdown from 10 to 1 and then print `Liftoff!`. Do it once with `while` and once with `for` and `range(10, 0, -1)`.

</aside>

## 📖 Key definitions

| Term | Simple meaning |
| --- | --- |
| Loop | Code that repeats |
| Iteration | One round of a loop |
| `while` | Repeat while a condition is True |
| `for` | Repeat for each item in a collection |
| `range(n)` | The numbers 0 up to n minus 1 |
| List | An ordered collection, like `[1, 2, 3]` |
| Index | An item’s position, starting at 0 |
| Dictionary | A collection of key: value pairs |
| `break` | Exit the loop now |
| `continue` | Skip to the next iteration |

## ⚠️ Common mistakes

- Forgetting to change the variable in a `while` loop, which causes an infinite loop.
- Expecting `range(5)` to include 5. It stops at 4.
- Counting list positions from 1. The first item is `[0]`.
- Asking for a dictionary key that does not exist, which raises `KeyError`.

## 🧑‍💻 Programming questions

- 🧑‍💻 P1. **Multiplication table.** Ask for `n` and print its table from 1 to 10 like `5 x 2 = 10`.
    
    💡 Hint: `range(1, 11)`.
    
    ```python
    n = int(input('n: '))
    for i in range(1, 11):
        print(f'{n} x {i} = {n * i}')
    ```
    
- 🧑‍💻 P2. **Running total.** Keep asking for numbers until the user types 0, then print the total.
    
    💡 Hint: `while True` with `break`.
    
    ```python
    total = 0
    while True:
        n = int(input('Number: '))
        if n == 0:
            break
        total += n
    print('Total:', total)
    ```
    
- 🧑‍💻 P3. **Word counter.** Count how many times each word appears in a sentence.
    
    💡 Hint: `split()` plus a dictionary and `get()`.
    
    ```python
    counts = {}
    for word in input('Text: ').lower().split():
        counts[word] = counts.get(word, 0) + 1
    print(counts)
    ```
    
- 🧑‍💻 P4. **Number pyramid.** Ask for `n` and print a left-aligned triangle: row 1 has one `#`, row 2 has two, and so on.
    
    💡 Hint: a loop for rows, and string multiplication `'#' * i`.
    
    ```python
    n = int(input('Height: '))
    for i in range(1, n + 1):
        print('#' * i)
    ```
    
- 🧑‍💻 P5. **Prime check.** Ask for a number and print whether it is prime.
    
    💡 Hint: try dividing by every number from 2 up to `n - 1`.
    
    ```python
    n = int(input('n: '))
    is_prime = n > 1
    for d in range(2, n):
        if n % d == 0:
            is_prime = False
            break
    print('Prime' if is_prime else 'Not prime')
    ```
    

## 🎯 MCQs

- 🎯 Q1. What does `range(3)` produce? (A) 1, 2, 3 (B) 0, 1, 2 (C) 0, 1, 2, 3 (D) 3
    
    **Answer: (B).** It starts at 0 and stops before 3.
    
- 🎯 Q2. Which keyword exits a loop completely? (A) continue (B) pass (C) break (D) stop
    
    **Answer: (C).** `continue` only skips one round.
    
- 🎯 Q3. For `names = ['a', 'b', 'c']`, what is `names[1]`? (A) a (B) b (C) c (D) Error
    
    **Answer: (B).** Indexing starts at 0.
    
- 🎯 Q4. What does a dictionary store? (A) only numbers (B) ordered items by position (C) key: value pairs (D) only text
    
    **Answer: (C).**
    
- 🎯 Q5. What happens if a `while` loop’s condition never becomes False? (A) It stops by itself (B) Error (C) It runs forever (D) It runs once
    
    **Answer: (C).** That is an infinite loop.
    

## ✅ Quick recap

- `for` walks through items, `while` repeats while a condition holds.
- `range(n)` gives 0 to n minus 1.
- Lists use positions (from 0), dictionaries use keys.
- `break` leaves the loop, `continue` skips to the next round.