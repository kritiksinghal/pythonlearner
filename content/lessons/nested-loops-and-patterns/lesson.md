---
title: "Nested loops and patterns"
curriculumTitle: "Nested loops and patterns"
track: "Python from zero"
module: "M3 Repeating"
order: 13
level: "Beginner"
summary: "Structure multi-dimensional iteration using nested loops: navigate two-dimensional grids, generate visual geometric patterns, and understand quadratic computational complexity."
prerequisites:
  - "what-is-programming-and-python"
  - "your-first-program-with-print"
  - "variables-and-types"
  - "numbers-and-math"
  - "text-strings"
  - "talking-to-the-user-with-input-and-f-strings"
  - "true-false-and-comparisons"
  - "making-decisions-with-if"
  - "and-or-not"
  - "repeating-with-loops"
  - "for-loops-and-range"
  - "break-continue-and-loop-else"
learningGoals:
  - "Construct multi-level iteration by placing inner loops inside outer loop bodies."
  - "Traverse two-dimensional coordinate matrices representing rows and columns."
  - "Generate geometric visual patterns including right triangles, pyramids, and checkerboards."
  - "Calculate total iteration counts and evaluate the quadratic performance impact of nested loops."
relatedProblems: []
---

## What you will learn

- The core concept of **nested iteration**: how an inner loop runs to full completion for every single cycle of an outer loop.
- The multiplicative mathematical relationship governing total iterations ($M \times N$).
- How to model two-dimensional grids, tables, and game boards using row and column loop variables.
- Using the `end=" "` parameter in `print()` to assemble horizontal rows, followed by parameterless `print()` calls to drop to the next line.
- Generating iconic visual patterns: escalating staircases, descending wedges, number pyramids, and alternating checkerboards.
- Avoiding variable name collisions between parent and child loop identifiers.
- Recognizing the computational scalability implications of quadratic time complexity ($O(N^2)$).

## Why this matters

The physical world and digital user interfaces are inherently multi-dimensional. A spreadsheet is not a flat list of numbers; it is a two-dimensional grid of rows and columns. A high-definition digital photograph is not a simple string of bytes; it is a matrix of pixels arranged along width and height axes. A chess game or tic-tac-toe match plays out on a coordinate board with ranks and files. A theater ticketing system maps seats by combining row letters with seat numbers.

Whenever you need to process multi-dimensional data—whether scanning pixels in an image, generating a multiplication table, calculating distances between pairs of cities, or formatting tabular reports—a single loop is insufficient. A single loop traverses a line; nested loops traverse a surface. Mastering nested loops equips you to model and manipulate complex spatial and grid-based structures effortlessly.

## The big idea

Imagine an analog mechanical clock hanging on a classroom wall, featuring a red hour hand and a blue minute hand.

Watch how the hands interact throughout the day:
1. When the hour hand points to `1`, the minute hand must tick through all sixty individual minute marks (`1, 2, 3, ... 59, 60`).
2. Only after the minute hand completes its entire sixty-tick revolution does the hour hand finally advance by a single step to point at `2`.
3. Now, pointing at `2`, the hour hand pauses while the minute hand embarks on another full sixty-tick revolution.
4. Over the course of twelve hours, the minute hand completes $12 \times 60 = 720$ individual movements.

In Python, **nested loops** operate on this exact mechanical clock principle. The outer loop is the slow-moving hour hand. The inner loop is the fast-spinning minute hand. For every single step the outer loop takes, the inner loop must run completely from its starting point to its finishing point before the outer loop is permitted to advance to its next step.

## Step by step

### 1. The coordinate matrix: rows and columns

To understand the rhythm of nested iteration, print coordinate pairs `(row, col)`. The outer loop controls the vertical row, while the inner loop controls the horizontal column.

```python run
for row in range(1, 4):
    for col in range(1, 4):
        print(f"({row},{col})", end=" ")
    print()
```

```output
(1,1) (1,2) (1,3) 
(2,1) (2,2) (2,3) 
(3,1) (3,2) (3,3)
```

In line 1, `row` begins at `1`. The inner loop in line 2 runs three times (`col` values `1, 2, 3`), printing each coordinate on the same line using `end=" "`. When the inner loop finishes, line 4 calls `print()` to output a newline. The outer loop then advances `row` to `2`, repeating the entire inner column cycle.

### 2. The escalating star triangle

By making the inner loop's boundary depend directly on the outer loop's current iteration count, you can generate expanding geometric shapes. Here we use string multiplication to draw an escalating right triangle.

```python run
for row in range(1, 6):
    print("*" * row)
```

```output
*
**
***
****
*****
```

On row 1, `'*'` is multiplied by 1. On row 2, it is multiplied by 2, continuing up to row 5. Each iteration produces a progressively wider row of stars.

### 3. The inverted descending wedge

To invert a pattern, step the outer loop downward using a negative step in `range()`.

```python run
for row in range(5, 0, -1):
    print("*" * row)
```

```output
*****
****
***
**
*
```

The outer loop begins at `5` and counts down to `1`. On each line, Python prints the corresponding number of asterisk characters, creating a clean descending wedge.

### 4. Number pyramids using nested loops

Instead of repeating a single character, you can use the inner loop variable itself to construct structured number sequences on each line.

```python run
for row in range(1, 6):
    for col in range(1, row + 1):
        print(col, end=" ")
    print()
```

```output
1 
1 2 
1 2 3 
1 2 3 4 
1 2 3 4 5
```

When `row` is `1`, `range(1, 2)` prints `1`. When `row` is `3`, `range(1, 4)` prints `1 2 3`. The inner loop boundary expands dynamically with each step of the outer loop.

### 5. Two-dimensional multiplication grid

Nested loops allow you to construct clean mathematical lookup tables by multiplying row and column identifiers at each intersection.

```python run
for row in range(1, 6):
    for col in range(1, 6):
        print(f"{row * col:>3}", end=" ")
    print()
```

```output
  1   2   3   4   5 
  2   4   6   8  10 
  3   6   9  12  15 
  4   8  12  16  20 
  5  10  15  20  25
```

At each coordinate intersection, `row * col` calculates the product. Format specifier `:>3` right-aligns each number within a three-character column, aligning the grid neatly.

### 6. Alternating checkerboard patterns

By combining the sum of row and column coordinates `(r + c)` with the modulo operator `% 2`, you can generate alternating patterns resembling a chess or checkers board.

```python run
for r in range(4):
    for c in range(4):
        symbol = "#" if (r + c) % 2 == 0 else "."
        print(symbol, end=" ")
    print()
```

```output
# . # . 
. # . # 
# . # . 
. # . #
```

When `r + c` is an even number, Python prints `'#'`. When odd, it prints `'.'`. This mathematical parity trick creates perfect alternating checkerboards across any arbitrary grid dimension.

### 7. Real-world theater seating layout

Real-world reservation systems pair alphabetic row identifiers with numerical seat positions to label venue capacities.

```python run
cinema_rows = ["A", "B", "C"]
seat_count = 4
for r in cinema_rows:
    for s in range(1, seat_count + 1):
        print(f"{r}{s}", end=" ")
    print()
```

```output
A1 A2 A3 A4 
B1 B2 B3 B4 
C1 C2 C3 C4
```

The outer loop iterates over the row letters (`A, B, C`). For each letter, the inner loop counts seats 1 through 4, generating an exact auditorium seating map.

### 8. Operation counting and multiplicative complexity

Every additional nesting level multiplies the total operations executed by the computer. Measuring total step counts illustrates this growth clearly.

```python run
step_count = 0
for outer in range(3):
    for inner in range(4):
        step_count += 1
print(f"Outer loops: 3, Inner loops: 4 -> Total operations: {step_count}")
```

```output
Outer loops: 3, Inner loops: 4 -> Total operations: 12
```

With 3 outer iterations and 4 inner iterations, the accumulator increments $3 \times 4 = 12$ times. If both loops ran 1,000 times, the inner body would execute $1,000 \times 1,000 = 1,000,000$ (one million) times.

## What Python is doing behind the scenes

Inside the CPython interpreter, nested loops operate by maintaining independent iterator instances on the virtual machine stack:

| VM Execution Stage | Action Performed by CPython |
| :--- | :--- |
| **Outer Loop Setup** | Creates an iterator for the outer range (e.g. `range(3)`). Binds outer variable. |
| **Inner Loop Entry** | Creates a **brand-new** iterator for the inner sequence on every single outer pass. |
| **Inner Loop Cycling** | Executes inner bytecode instructions repeatedly until inner `StopIteration` is raised. |
| **Inner Cleanup** | Discards the exhausted inner iterator object from the stack. |
| **Outer Advancement** | Fetches the next outer element and jumps back to re-create the inner loop anew. |

Because the inner iterator is constructed and destroyed on every single outer cycle, deeply nested loops (three or four levels deep) incur significant runtime overhead, underscoring why software engineers monitor algorithmic complexity closely.

## Common mistakes

### 1. Variable name collisions between outer and inner loops

Reusing the same variable name (like `for i in ...`) for both the outer and inner loop causes the inner loop to overwrite the outer loop's counter, corrupting the outer loop's state.

Broken code:
```python
for i in range(3):
    for i in range(3):  # Overwrites outer i!
        print("i:", i)
```

How to fix it: assign distinct, descriptive identifiers to each nesting level (e.g. `row` and `col`, or `r` and `c`, or `i` and `j`):
```python run
for row in range(2):
    for col in range(2):
        print(f"row={row}, col={col}")
```

```output
row=0, col=0
row=0, col=1
row=1, col=0
row=1, col=1
```

### 2. Forgetting the row-terminating `print()` call

When assembling rows with `end=" "`, omitting the parameterless `print()` at the end of the outer loop causes all rows to concatenate into one single giant horizontal line.

Broken code:
```python
for r in range(2):
    for c in range(2):
        print("*", end=" ")
    # Missing print() here!
```

Actual output:
```output
* * * * 
```

How to fix it: insert an empty `print()` call aligned with the outer loop to emit a newline after each row completes:
```python run
for r in range(2):
    for c in range(2):
        print("*", end=" ")
    print()
```

```output
* * 
* * 
```

### 3. Accidental quadratic slowdowns with massive ranges

Writing nested loops with ranges that are too large (e.g. `range(100000)` inside `range(100000)`) results in $10^{10}$ operations, freezing the computer for minutes.

How to fix it: always calculate the total operation count ($M \times N$) before running nested loops, keeping large data traversals optimized.

## Cheat sheet

| Pattern Goal | Code Structure | Output Shape |
| :--- | :--- | :--- |
| **Grid / Matrix** | `for r in range(M): for c in range(N):` | $M$ rows of $N$ columns |
| **Right Triangle** | `for r in range(1, N+1): print("*" * r)` | Expanding staircase |
| **Inverted Triangle** | `for r in range(N, 0, -1): print("*" * r)` | Descending wedge |
| **Coordinate pairs** | `print(f"({r},{c})", end=" ")` | Space-delimited items |
| **Row termination** | `print()` (aligned with outer loop) | Advances to next row |
| **Complexity check** | `Total = OuterCount * InnerCount` | Multiply loop bounds |

## Try it yourself

### Exercise 1 (easy): Star staircase pattern

Write a nested loop (or outer loop with string multiplication) that prints a 5-step staircase of hashes `#`, starting with 1 hash on the first line and finishing with 5 hashes on the fifth line.

```python run
steps = 5
for step in range(1, steps + 1):
    print("#" * step)
```


```output
#
##
###
####
#####
```
:::solution Solution
Iterate `step` from 1 through 5 and multiply `'#'` by `step`:

```python run
steps = 5
for step in range(1, steps + 1):
    print("#" * step)
```

```output
#
##
###
####
#####
```
:::

### Exercise 2 (medium): 4x4 Addition lookup grid

Using nested `for` loops, construct a 4x4 addition grid where each coordinate displays the sum of its row and column numbers (`row + col`), with `row` running 1 to 4 and `col` running 1 to 4. Align each number within a 3-character space (`:>3`).

```python run
for row in range(1, 5):
    for col in range(1, 5):
        addition_sum = row + col
        print(f"{addition_sum:>3}", end=" ")
    print()
```


```output
  2   3   4   5 
  3   4   5   6 
  4   5   6   7 
  5   6   7   8
```
:::solution Solution
Loop over rows 1 to 4 and columns 1 to 4, printing `f"{row + col:>3}"` with `end=" "`, and call `print()` after each row:

```python run
for row in range(1, 5):
    for col in range(1, 5):
        addition_sum = row + col
        print(f"{addition_sum:>3}", end=" ")
    print()
```

```output
  2   3   4   5 
  3   4   5   6 
  4   5   6   7 
  5   6   7   8
```
:::

### Exercise 3 (challenge): Hollow square border pattern

Write a program that prints a 5x5 hollow square border of asterisks. The first row and last row must be completely filled with asterisks (`* * * * *`), while the middle rows must have an asterisk at the first and last column with spaces in between (`*       *`).

```python run
size = 5
for row in range(size):
    for col in range(size):
        if row == 0 or row == size - 1 or col == 0 or col == size - 1:
            print("*", end=" ")
        else:
            print(" ", end=" ")
    print()
```


```output
* * * * * 
*       * 
*       * 
*       * 
* * * * *
```
:::solution Solution
Check if the current coordinate sits on the boundary (`row == 0 or row == size - 1 or col == 0 or col == size - 1`):

```python run
size = 5
for row in range(size):
    for col in range(size):
        if row == 0 or row == size - 1 or col == 0 or col == size - 1:
            print("*", end=" ")
        else:
            print(" ", end=" ")
    print()
```

```output
* * * * * 
*       * 
*       * 
*       * 
* * * * *
```
:::

## Recap

- A **nested loop** places one loop inside the body of another.
- The inner loop executes all of its iterations from start to finish on every single turn of the outer loop.
- The total operations executed equals the outer loop count multiplied by the inner loop count ($M \times N$).
- Outer loops typically model vertical rows, while inner loops model horizontal columns.
- Use `end=" "` to assemble items horizontally, followed by `print()` to conclude each row.
- Always use distinct variable names (e.g. `row` and `col`) to prevent identifier collisions.

Reference: Python documentation, The for statement
