---
title: "Repeating with loops"
curriculumTitle: "while loops"
track: "Python from zero"
module: "M3 Repeating"
order: 3
level: "Beginner"
summary: "Master while loops in depth to automate repetitive tasks, accumulate totals, avoid infinite loops, and steer control flow with break, continue, and loop else."
prerequisites:
  - "making-decisions-with-if"
learningGoals:
  - "Understand how while loops repeat code based on boolean conditions"
  - "Manage loop counters and avoid infinite loops"
  - "Use the accumulator pattern to compute running sums and factorials"
  - "Control execution flows using break, continue, and the while-else clause"
relatedProblems:
  - "count-vowels"
  - "greeting-card"
---

## What you will learn

- How the `while` loop checks a condition repeatedly before every cycle
- The three mandatory ingredients of every controlled loop
- How to manage a **loop counter** so your loop completes at the right moment
- What an **infinite loop** is, why it occurs, and how to stop one safely
- How to compute running totals using the **accumulator pattern**
- How to inspect text character by character using string indexing
- How to use the `break` statement to exit a loop early when a goal is reached
- How to use the `continue` statement to skip the remainder of an iteration
- How the optional `else` block on a while loop signals normal completion
- How to track state across cycles using a **flag variable**

## Why this matters

Computers possess one immense advantage over human beings: they can perform the exact same task millions of times at lightning speed without growing tired, bored, or careless. If you need to verify one password attempt, an `if` statement suffices. But if you need to keep asking for credentials until the user enters the correct passkey, or calculate interest month by month until a mortgage balance drops to zero, you need a mechanism that repeats instructions automatically. The `while` loop provides this foundational capability. Every game loop, server connection listener, and retry system in modern software relies on condition-driven repetition.

## The big idea

A **loop** is a programming structure that executes a block of statements repeatedly as long as a specified condition remains `True`.

Think of a while loop like a **washing machine cycle**. The machine checks a sensor: "Is the rinse timer still running?" If the answer is `True`, the machine agitates the water, spins the drum, and ticks down the clock. When the cycle ends, it asks the question again: "Is the rinse timer still running?" It repeats this cycle over and over until the timer expires and the answer becomes `False`. At that moment, the machine stops spinning and drains the water.

In Python, this is called a **while loop**. Each individual pass through the loop body is called an **iteration**. Before every single iteration, Python re-evaluates the **loop condition**. If the condition is `True`, the loop runs. As soon as the condition turns `False`, Python skips the loop body and proceeds with the rest of your program.

Every properly structured `while` loop requires three distinct parts:
1. **Initialization**: You must prepare variables before the loop begins (such as setting a starting count or balance).
2. **Condition evaluation**: The statement after `while` acts as a gatekeeper. If it evaluates to `True`, execution enters the loop; if `False`, the loop finishes.
3. **Progress update**: Inside the loop body, code must modify at least one variable involved in the condition, ensuring that the condition will eventually evaluate to `False`. Omitting this update causes an infinite loop.

## Step by step

### The basic while loop

A `while` loop starts with the keyword `while`, followed by a condition, and ends with a colon (`:`). The lines that repeat must be indented under the statement.

```python run
count = 5
while count > 0:
    print(count)
    count = count - 1
print("Blastoff!")
```

```output
5
4
3
2
1
Blastoff!
```

**Line by line:** Line 1 initializes `count` to `5`. Line 2 checks whether `count > 0` (`5 > 0` is `True`). Python enters the loop, printing `5` and decreasing `count` to `4`. It returns to line 2 to re-evaluate the condition. This sequence continues through `3`, `2`, and `1`. When `count` becomes `0`, the check `0 > 0` produces `False`. Python terminates the loop and jumps to line 5, printing `"Blastoff!"`.

### Counting upwards with augmented assignment

Often you want to count upwards from a starting point toward a ceiling. You can increment your counter using the shorthand `+=` operator, which adds a value directly to an existing variable.

```python run
current = 1
while current <= 5:
    print("Step", current)
    current += 1
```

```output
Step 1
Step 2
Step 3
Step 4
Step 5
```

**Line by line:** `current` starts at `1`. The loop tests `current <= 5`. On each iteration, Python displays the step number and executes `current += 1`, which is identical to writing `current = current + 1`. When `current` reaches `6`, the condition evaluates to `False`, and the loop finishes.

### The accumulator pattern

A common task in programming is calculating a running total from a sequence of values. You do this with an **accumulator**—a variable initialized before the loop starts (often at `0`) that collects values during each cycle.

```python run
total = 0
number = 1
while number <= 5:
    total += number
    number += 1
print("Sum of numbers 1 to 5:", total)
```

```output
Sum of numbers 1 to 5: 15
```

**Line by line:** Line 1 creates `total = 0`. Line 2 creates `number = 1`. During cycle one, `total` becomes `0 + 1 = 1`. In cycle two, `total` becomes `1 + 2 = 3`. In cycle three, `total` becomes `3 + 3 = 6`. In cycle four, `total` becomes `6 + 4 = 10`. In cycle five, `total` becomes `10 + 5 = 15`. After five iterations, line 6 prints the final accumulated sum: `15`.

### Real-world simulation: compound growth

Loops are ideal for real-world mathematical simulations where future states depend on previous results, such as calculating savings interest over time.

```python run
balance = 1000
interest_rate = 0.05
years = 0
while balance < 1200:
    interest = balance * interest_rate
    balance += interest
    years += 1
    print("Year", years, "balance:", round(balance, 2))
print("Target reached in", years, "years.")
```

```output
Year 1 balance: 1050.0
Year 2 balance: 1102.5
Year 3 balance: 1157.62
Year 4 balance: 1215.51
Target reached in 4 years.
```

**Line by line:** An initial deposit of 1000 grows at 5% annual interest. The while loop runs until `balance >= 1200`. In each year, interest is computed on the updated balance, added to the principal, and `years` is incremented. After 4 years, the balance reaches 1215.51, surpassing the 1200 threshold, and the loop stops.

### Traversing strings character by character

You can step through text strings using a position counter and string indexing. The first character sits at index `0`, and the last sits at index `len(text) - 1`.

```python run
text = "PyLearner"
pos = 0
vowels_found = 0
while pos < len(text):
    char = text[pos]
    if char in "aeiouAEIOU":
        vowels_found += 1
    pos += 1
print("Vowels in text:", vowels_found)
```

```output
Vowels in text: 3
```

**Line by line:** `pos` starts at `0`. In each iteration, `char = text[pos]` grabs the letter at index `pos`. If that letter is in the vowel collection, `vowels_found` increments. The step `pos += 1` advances to the next position. When `pos` reaches `9` (`len("PyLearner")`), `pos < len(text)` produces `False` and traversal concludes.

### Traversing collections with an index

You can combine a while loop with an index counter to inspect or tally items in a list one by one. The built-in `len()` function tells you how many items the collection contains.

```python run
prices = [120, 85, 200, 45]
index = 0
total = 0
while index < len(prices):
    total += prices[index]
    index += 1
print("Cart total:", total)
```

```output
Cart total: 450
```

**Line by line:** `len(prices)` returns `4`. `index` starts at `0`. In Python, list positions start at zero and end at `len - 1`. The loop condition `index < len(prices)` ensures that Python accesses positions `0`, `1`, `2`, and `3`. On each step, `total` adds the current item price, and `index` moves forward by one. When `index` reaches `4`, the condition turns `False`, preventing an out-of-bounds error.

### Exiting early with the break statement

Sometimes you do not know in advance how many cycles a loop should run because the stopping event depends on a calculation inside the body. The `break` statement instructs Python to abandon the loop immediately, skipping any remaining lines inside the loop and bypassing the loop condition.

```python run
number = 1
while number <= 10:
    if number * number > 40:
        print("First square above 40 is", number * number, "from", number)
        break
    number += 1
```

```output
First square above 40 is 49 from 7
```

**Line by line:** The loop tests numbers starting from `1`. For `1`, `2`, `3`, `4`, `5`, and `6`, the squared values (`1`, `4`, `9`, `16`, `25`, `36`) do not exceed `40`. On the seventh iteration, `7 * 7` equals `49`. The `if` condition succeeds, the message prints, and `break` triggers. Python stops the loop immediately, even though `number <= 10` is still `True`.

### Skipping iterations with the continue statement

While `break` exits the entire loop, the `continue` statement skips only the rest of the current iteration. It jumps straight back to the top of the loop to re-evaluate the condition for the next cycle.

```python run
count = 0
while count < 6:
    count += 1
    if count == 3:
        continue
    print(count)
```

```output
1
2
4
5
6
```

**Line by line:** When `count` reaches `3`, line 4 detects `count == 3` and executes `continue`. Line 6 (`print(count)`) is bypassed for that single pass. Python jumps back to line 2 with `count = 3`, evaluates `3 < 6`, increments `count` to `4`, and prints `4`. Notice that `3` never appears in the output. When using `continue`, make sure your counter variable increments *before* the continue statement, otherwise your loop may freeze.

### The while True pattern

A frequent pattern in software engineering is setting up an intentional loop using `while True:`, which runs indefinitely until an internal condition triggers a `break`. This pattern is called a **sentinel loop**.

```python run
attempts = 0
while True:
    attempts += 1
    if attempts == 3:
        print("Success on attempt", attempts)
        break
    print("Attempt", attempts, "failed, retrying...")
```

```output
Attempt 1 failed, retrying...
Attempt 2 failed, retrying...
Success on attempt 3
```

**Line by line:** The condition `True` never turns `False` on its own. The loop relies entirely on the `if attempts == 3:` check to execute `break`. On attempts 1 and 2, the retry notice prints. On attempt 3, the success message prints and `break` terminates the infinite loop.

### Tracking state with flag variables

A **flag variable** is a boolean variable that stores whether a specific event has occurred during loop execution. You initialize the flag to `False` before the loop and switch it to `True` when your condition is met.

```python run
scores = [72, 88, 95, 60]
index = 0
has_passed_with_distinction = False
while index < len(scores):
    if scores[index] >= 90:
        has_passed_with_distinction = True
        break
    index += 1
if has_passed_with_distinction:
    print("Distinction score detected!")
else:
    print("No distinction achieved.")
```

```output
Distinction score detected!
```

**Line by line:** `has_passed_with_distinction` starts as `False`. When `index` reaches `2`, `scores[2]` is `95`. The `if` statement sets the flag to `True` and breaks. After the loop concludes, lines 10 through 13 check the flag to display the appropriate summary.

### Calculating mathematical factorials

Loops are well suited for multiplicative accumulation. A mathematical factorial ($n!$) multiplies all positive integers from $n$ down to $1$. For example, $5! = 5 \times 4 \times 3 \times 2 \times 1 = 120$.

```python run
n = 5
factorial = 1
current = n
while current > 1:
    factorial *= current
    current -= 1
print(n, "factorial is", factorial)
```

```output
5 factorial is 120
```

**Line by line:** `factorial` starts at `1` (the neutral base for multiplication, just as `0` is for addition). On each iteration, `factorial` multiplies by `current`, and `current` decrements by `1`. The loop stops when `current` drops to `1`, because multiplying by `1` would not change the product.

### The loop else block

Python offers a unique feature: you can append an `else` block to a `while` loop. The `else` block runs **only** if the while loop completes normally by having its condition become `False`. If the loop exits early via a `break` statement, the `else` block is completely skipped.

```python run
search_items = [14, 27, 35, 42]
target = 99
idx = 0
while idx < len(search_items):
    if search_items[idx] == target:
        print("Found target at position", idx)
        break
    idx += 1
else:
    print("Target", target, "was not found in list.")
```

```output
Target 99 was not found in list.
```

**Line by line:** The loop inspects all 4 elements in `search_items`. None equals `99`, so the loop runs through the end without ever hitting `break`. When `idx` reaches `4`, the loop condition `4 < 4` turns `False`. Python executes the `else` block, cleanly announcing that the target was absent. If `target` had been present, `break` would have skipped the `else` message.

### Nested while loops

Just as you can nest `if` statements, you can nest one `while` loop inside another. The inner loop completes its full sequence of iterations for every single cycle of the outer loop.

```python run
row = 1
while row <= 3:
    col = 1
    line = ""
    while col <= row:
        line += "* "
        col += 1
    print(line)
    row += 1
```

```output
* 
* * 
* * *
```

**Line by line:** When `row` is `1`, the inner loop runs for `col = 1`, producing `"* "`. When `row` increments to `2`, the inner loop resets `col = 1` and runs twice, producing `"* * "`. When `row` increments to `3`, the inner loop runs three times, producing `"* * * "`.

## What Python is doing behind the scenes

To understand how Python evaluates while loops, trace how variable values transform cycle by cycle in memory. Consider this countdown accumulator:

```python
x = 3
sum_val = 0
while x > 0:
    sum_val += x
    x -= 1
```

| Iteration | Condition (`x > 0`) | Action Taken | Value of `sum_val` | Value of `x` |
|---|---|---|---|---|
| Before loop | Not checked yet | Variables initialized | 0 | 3 |
| Cycle 1 | `3 > 0` is `True` | `sum_val += 3`, `x -= 1` | 3 | 2 |
| Cycle 2 | `2 > 0` is `True` | `sum_val += 2`, `x -= 1` | 5 | 1 |
| Cycle 3 | `1 > 0` is `True` | `sum_val += 1`, `x -= 1` | 6 | 0 |
| Termination | `0 > 0` is `False` | Loop exits, jump past body | 6 | 0 |

Notice that the test `x > 0` occurs at the beginning of each cycle. When `x` drops to `0` at the end of cycle 3, the loop does not stop halfway through the line; it completes the block, returns to the top, discovers that `0 > 0` is `False`, and terminates.

During each iteration, Python maintains execution pointers and local frames:
1. It looks up the current memory location for `x`.
2. It evaluates the boolean test. If `True`, it runs the bytecode instructions inside the indented block.
3. Upon reaching the final indented statement, Python generates an implicit jump instruction pointing directly back to the loop header.
4. If a `break` instruction executes, Python cancels the jump and points execution directly to the statement immediately following the loop block.

## Common mistakes

### Mistake 1: Forgetting the colon after the condition

```python
count = 0
while count < 5
    count += 1
```

**Error:** `SyntaxError: expected ':'`

Like `if` statements, every `while` loop header must finish with a colon (`:`). The colon tells Python that an indented suite of code follows. The fix is to add the colon: `while count < 5:`.

### Mistake 2: Missing indentation in the loop body

```python
count = 0
while count < 5:
count += 1
```

**Error:** `IndentationError: expected an indented block after 'while' statement on line 2`

Python uses indentation to identify which lines repeat inside the loop. If the line following the colon is not indented, Python raises an IndentationError. The fix is to indent all statements inside the loop by four spaces:

```python
count = 0
while count < 5:
    count += 1
```

### Mistake 3: Typo in the loop counter variable

```python
count = 0
while cont < 5:
    count += 1
```

**Error:** `NameError: name 'cont' is not defined. Did you mean: 'count'?`

A small typo in your variable name means Python attempts to find a variable that does not exist. The fix is to ensure the variable in the condition matches the assigned variable name: `while count < 5:`.

### Mistake 4: Forgetting to update the loop counter (infinite loop)

```python
count = 1
while count <= 5:
    print(count)
    # forgot count += 1 !
```

If you forget to modify the loop counter inside the loop body, `count` remains `1` forever. Because `1 <= 5` is always `True`, the program never finishes. In web browsers or terminal environments, this triggers a timeout or causes the tab to become unresponsive. Always verify that your loop body contains code that moves your condition toward `False`.

### Mistake 5: Placing the counter update after a continue statement

```python
count = 0
while count < 5:
    if count == 2:
        continue  # SKIPS count += 1 below!
    count += 1
```

This subtle bug creates an infinite loop. When `count` reaches `2`, the `continue` statement executes, jumping straight back to the top of the loop *before* reaching `count += 1`. On the next pass, `count` is still `2`, so `continue` triggers again, repeating forever. The fix is to increment your counter *before* any branching with `continue`.

## Cheat sheet

| Pattern | Code Template | Purpose |
|---|---|---|
| Count up | `i = 0`<br>`while i < n:`<br>`    i += 1` | Runs a block `n` times from 0 to n-1 |
| Count down | `i = n`<br>`while i > 0:`<br>`    i -= 1` | Counts backwards to zero |
| Accumulator | `total = 0`<br>`while cond:`<br>`    total += val` | Calculates running totals or products |
| String index | `i = 0`<br>`while i < len(s):`<br>`    ch = s[i]; i += 1` | Inspects characters one by one |
| Early exit | `while cond:`<br>`    if target:`<br>`        break` | Stops the loop immediately on demand |
| Skip iteration | `while cond:`<br>`    i += 1`<br>`    if skip_test: continue` | Bypasses remaining code in current cycle |
| Sentinel loop | `while True:`<br>`    if finished:`<br>`        break` | Loops until internal exit condition triggers |
| Loop else | `while cond:`<br>`    ...`<br>`else: print("Finished cleanly")` | Runs only if no break statement executed |
| Flag check | `found = False`<br>`while cond:`<br>`    if match: found = True; break` | Tracks whether an item or state was observed |

## Try it yourself

### Exercise 1 (easy): Print multiples of 3

Write a while loop that starts at 3 and prints multiples of 3 up to and including 15.

```python run
n = 3
while n <= 15:
    print(n)
    n += 3
```

:::solution Solution
Initializing `n = 3` and incrementing by `3` on each pass prints `3`, `6`, `9`, `12`, and `15`.

```python run
n = 3
while n <= 15:
    print(n)
    n += 3
```

```output
3
6
9
12
15
```
:::

### Exercise 2 (medium): Halving numbers until below 1

Start with `value = 100`. Use a while loop to repeatedly divide `value` by `2` as long as `value >= 1`. Count how many division steps occur and print the result.

```python run
value = 100
steps = 0
while value >= 1:
    value /= 2
    steps += 1
print("Reached under 1 in", steps, "steps. Final value:", value)
```

:::solution Solution
The values progress: 50.0 (step 1), 25.0 (step 2), 12.5 (step 3), 6.25 (step 4), 3.125 (step 5), 1.5625 (step 6), and 0.78125 (step 7). The loop terminates after 7 steps.

```python run
value = 100
steps = 0
while value >= 1:
    value /= 2
    steps += 1
print("Reached under 1 in", steps, "steps. Final value:", value)
```

```output
Reached under 1 in 7 steps. Final value: 0.78125
```
:::

### Exercise 3 (challenge): Sum of even numbers up to 20

Compute the sum of all even numbers from 2 up to 20 ($2 + 4 + 6 + \dots + 20$) using a while loop and an accumulator variable.

```python run
num = 2
even_sum = 0
while num <= 20:
    even_sum += num
    num += 2
print("Sum of even numbers 2 to 20:", even_sum)
```

:::solution Solution
Adding $2 + 4 + 6 + 8 + 10 + 12 + 14 + 16 + 18 + 20$ yields 110.

```python run
num = 2
even_sum = 0
while num <= 20:
    even_sum += num
    num += 2
print("Sum of even numbers 2 to 20:", even_sum)
```

```output
Sum of even numbers 2 to 20: 110
```
:::

## Recap

- A **while loop** evaluates a condition before each cycle and executes its body as long as the condition remains `True`.
- The three essential parts of any while loop are initialization, condition testing, and progress updates.
- Always ensure your loop body modifies variables in a way that eventually turns the loop condition `False` to prevent an **infinite loop**.
- The **accumulator pattern** uses a running variable (like `total = 0`) to sum or collect values across multiple iterations.
- The `break` statement exits the entire loop immediately, ignoring any remaining lines or condition checks.
- The `continue` statement skips the rest of the current iteration and returns directly to the condition test at the top of the loop.
- The optional `else` block on a while loop runs only if the loop terminates normally without triggering a `break`.
