---
title: "Conditionals"
curriculumTitle: "Conditionals"
track: "CS50P"
module: "Week 1 Conditionals"
order: 2
level: "Beginner"
summary: "Use comparisons and conditional branches to choose what a Python program does."
prerequisites:
  - "functions-and-variables"
learningGoals:
  - "Compare values with Python's comparison operators"
  - "Choose between branches with if, elif, and else"
  - "Combine conditions using and, or, and not"
  - "Recognize when match is a clear alternative for fixed values"
relatedProblems: []
---

## What you will learn

- How a **condition** evaluates to `True` or `False`
- How comparisons such as `==`, `!=`, `<`, and `>=` express a decision
- How `if`, `elif`, and `else` choose one branch
- How `and`, `or`, and `not` combine conditions
- How `%` can support a remainder-based decision and how `match` handles fixed cases

## Why this matters

A program often needs to react differently to different values. A weather display may show a rain warning, a game may allow a move only when a piece is available, and a ticket system may choose a price band. Conditionals let your code express those choices clearly. When branch order and comparison symbols are correct, the program's behavior is easier to predict and test.

## The big idea

Think of a traffic signal that checks one situation and selects an action. Python evaluates a condition, then runs a block when the result is true. In an `if`/`elif`/`else` chain, Python checks conditions from top to bottom and takes the first matching branch; it skips the later alternatives.

A **Boolean** is either `True` or `False`. A comparison such as `temperature < 10` produces a Boolean. Keep assignment and comparison distinct: `=` stores a value in a variable, while `==` asks whether two values are equal. This lesson focuses on decisions; function definitions were covered in **Functions and variables**.

## Step by step

### Compare two values

Python provides operators to ask whether values are equal, different, greater, or smaller. The result can be used directly in a conditional.

```python run
temperature = 7
print(temperature < 10)
print(temperature == 7)
print(temperature != 0)
```

```output
True
True
True
```

The first expression asks whether 7 is below 10. The second asks whether the value equals 7, and the third asks whether it differs from zero. Each answer is a Boolean.

### Run a block only when a condition is true

An `if` statement runs its indented body when its condition is true. If the condition is false, Python skips that body and continues after it.

```python run
has_coat = True
if has_coat:
    print("Ready for the windy walk")
print("Check the forecast before leaving")
```

```output
Ready for the windy walk
Check the forecast before leaving
```

The `if` line checks `has_coat`; because it is true, Python prints the first message. The final print is outside the indented block, so it runs either way.

### Choose between two paths with else

Use `else` for the alternative when the `if` condition is false. The two branches describe a choice between a condition and its fallback.

```python run
platform = "outdoor"
if platform == "indoor":
    print("Practice in the hall")
else:
    print("Practice in the courtyard")
```

```output
Practice in the courtyard
```

The comparison is false because the value is `"outdoor"`, so Python runs the `else` block. Exactly one of these two paths runs.

### Choose among several ranges

Add `elif` when there are more conditions to check. Python evaluates each condition in order and stops once one is true.

```python run
air_quality = 38
if air_quality < 25:
    label = "clear"
elif air_quality < 50:
    label = "acceptable"
else:
    label = "check local guidance"
print(label)
```

```output
acceptable
```

The first check is false, and the second is true, so Python stores `"acceptable"`. It does not test the final `else` after finding a matching branch.

### Put the most specific range first

Order matters when conditions overlap. A broad rule can match a value that should have received a more specific result, so arrange the chain from the narrowest or strictest condition to the fallback.

```python run
signal_strength = 92
if signal_strength >= 85:
    status = "excellent"
elif signal_strength >= 60:
    status = "steady"
else:
    status = "weak"
print(status)
```

```output
excellent
```

The first condition handles values at least 85. If the `>= 60` test came first, 92 would match it and never reach `excellent`. Check how the conditions overlap when planning their order.

### Combine checks with and

`and` is true only when both sides are true. It is useful when a decision requires two facts at once.

```python run
age = 16
has_consent = True
if age >= 13 and age < 18 and has_consent:
    print("Youth workshop registration is ready")
```

```output
Youth workshop registration is ready
```

The participant is at least 13, below 18, and has consent, so all three checks succeed. If any one were false, the entire `and` expression would be false.

### Combine alternatives with or

`or` is true when at least one side is true. Repeat the comparison on each side so the condition asks exactly what you intend.

```python run
response = "y"
if response == "y" or response == "yes":
    print("The reservation is confirmed")
```

```output
The reservation is confirmed
```

The response matches the first allowed spelling, so Python runs the body. The word `or` joins two complete comparisons.

### Reverse a condition with not

`not` flips a Boolean result. It can make an absence condition easier to express, though a positive condition may sometimes read more clearly.

```python run
is_locked = False
if not is_locked:
    print("You may enter the studio")
```

```output
You may enter the studio
```

`is_locked` is false, so `not is_locked` is true. The body runs. Use names that make the meaning of the Boolean clear when reading `not` expressions.

### Write a chained range comparison

Python allows a value to be checked against both ends of a range in one expression. The chained comparison has the same meaning as joining both comparisons with `and`.

```python run
wind_speed = 18
print(10 <= wind_speed <= 25)
```

```output
True
```

The expression checks that the wind speed is at least 10 and at most 25. Both ends are included because the operators are `<=`.

### Use the remainder to classify a number

The `%` operator gives the remainder after division. A remainder of zero after division by two identifies an even integer.

```python run
seat_number = 27
if seat_number % 2 == 0:
    print("Window side")
else:
    print("Aisle side")
```

```output
Aisle side
```

27 divided by 2 leaves a remainder of 1, so the `else` path runs. The same pattern works for checking divisibility by other whole numbers.

### Check a combined case before simpler cases

When one value satisfies multiple rules, check the combined outcome first. For the single-number FizzBuzz decision, multiples of 15 are also multiples of 3 and 5.

```python run
number = 45
if number % 15 == 0:
    label = "FizzBuzz"
elif number % 3 == 0:
    label = "Fizz"
elif number % 5 == 0:
    label = "Buzz"
else:
    label = str(number)
print(label)
```

```output
FizzBuzz
```

45 is divisible by 15, so the first branch wins. If the program checked divisibility by 3 first, it would stop at `Fizz` and never display the combined label.

### Match a fixed set of values

The `match` statement is a clear choice when one value should be compared with several known cases. Each `case` describes a value or pattern to handle.

```python run
station = "Harbor"
match station:
    case "Harbor":
        print("Take the coastal line")
    case "Museum":
        print("Take the garden line")
    case _:
        print("Check the route map")
```

```output
Take the coastal line
```

The first matching case runs. `case _` is the catch-all for values not handled above, like an `else` fallback. `match` was added before Python 3.12 and is available in this browser version.

### Match more than one spelling

Use the `|` pattern inside a case when several fixed values should lead to the same branch.

```python run
command = "start"
match command:
    case "start" | "go":
        message = "The journey begins"
    case "stop":
        message = "The journey pauses"
    case _:
        message = "Command not recognized"
print(message)
```

```output
The journey begins
```

Both `"start"` and `"go"` match the first case. This is useful for a small set of explicit options; use `if` and `elif` when conditions involve ranges or comparisons.

## What Python is doing behind the scenes

Python evaluates comparison expressions to Boolean values. In an `if` chain, it checks the first condition and runs its body if true. Otherwise, it moves to the next `elif`; after all conditions are false, it can run the `else` body. Once a branch has been selected, the remaining branches in that chain are skipped.

`and`, `or`, and `not` combine Boolean conditions. Parentheses can make a longer expression easier to read. Use explicit comparisons on both sides of `or`; for example, write `mode == "quiet" or mode == "normal"`, rather than leaving the second value without a comparison.

### Read a decision from left to right

When debugging a branch, write down the value first, then evaluate one comparison at a time. For a marks band, a result of 76 makes `marks >= 90` false, then `marks >= 75` true. Python enters that branch and ignores every later alternative. This trace is often quicker than guessing from the final printed label. It also helps spot boundary mistakes: test a value just below a threshold, the exact threshold, and just above it.

### Make range boundaries deliberate

Ranges often share an endpoint by accident. Suppose a cricket club labels scores below 40 as developing, 40 through 69 as steady, and 70 or higher as strong. Writing the chain in ascending threshold order with `elif score < 70` and a fallback avoids testing the same boundary in two places. With inclusive operators, explicitly decide which band owns the exact value at the boundary. A chained comparison such as `40 <= score < 70` states both limits in one expression. That clarity matters when the value can land exactly on 40 or 70.

### Keep multi-part conditions readable

A condition can combine several checks, but a long line is harder to review. Name a condition when that name describes a useful decision. For example, `is_valid_score = 0 <= score <= 100` gives the range a purpose before it is used in a branch. A name does not change the result; it makes the code easier to discuss and test. When an expression mixes `and` and `or`, use parentheses to show which checks belong together. Do not rely on a reader remembering operator precedence when a pair of parentheses can make the intended grouping visible.

```python run
score = 84
is_valid_score = 0 <= score <= 100
earns_badge = is_valid_score and score >= 80
print(is_valid_score)
print(earns_badge)
```

```output
True
True
```

The first name captures the allowed score range. The second decision requires both a valid score and a high enough result. If the score were outside the range, a high numeric value alone would not qualify.

### Return a Boolean from a question-shaped function

The notes use a Boolean function to answer a question directly. This pattern keeps a decision reusable: call the function where the result is needed, then let an `if` choose the action. The function's name should read naturally as a yes-or-no question. A comparison already produces a Boolean, so returning the comparison is enough; wrapping it in another `if` that returns `True` or `False` adds steps without changing the answer.

```python run
def is_multiple_of_seven(value):
    return value % 7 == 0

print(is_multiple_of_seven(56))
print(is_multiple_of_seven(58))
```

```output
True
False
```

The first call has a zero remainder when divided by seven; the second does not. Returning a Boolean lets another part of a program use the answer without repeating the arithmetic.

### Compare `if` chains with `match`

Choose `match` when one value is being compared against a small, fixed set of exact choices. A `case` can group alternatives with `|`, while `case _` handles all remaining values. Choose an `if` chain when the decision depends on ranges, inequalities, or a formula. For example, a set of named delivery zones can be exact cases, while a delivery fee based on distance bands is more naturally expressed by ordered comparisons. Using the construct that mirrors the question makes later edits safer.

Neither form removes the need to check the logic. In either a `match` statement or an `if` chain, verify what happens for an expected value and for an unrecognized value. The fallback branch is part of the decision: it prevents a program from silently leaving a result unset when the input is outside the listed cases.

### Test decisions at their edges

A few carefully selected values reveal more than testing only a typical case. For a threshold of 70, test 69, 70, and 71. For a closed range from 12 through 18, test 11, 12, 18, and 19. For an `or` choice, test each allowed alternative and one disallowed value. For `and`, test the case where both requirements hold and cases where each requirement fails separately. This method checks the decision's shape and commonly catches a reversed comparison or a missing second comparison.

When several conditions are true at once, test that overlap too. A specific rule should appear before a broader one if both could match. This is why the combined FizzBuzz condition is checked first. If no overlap is possible, the order may be less important, but keeping the intended categories clear still helps a reader verify the chain.

### Decide how to handle unexpected values

The `else` branch is a design choice, not decoration. It can describe a normal remaining category, such as the lowest price band, or it can signal that a value was not recognized. Pick wording that matches the purpose. If a user chooses from a short menu, a fallback such as “Choose one of the listed options” helps them recover. If a numeric score has a valid range, a catch-all should not accidentally treat an invalid negative value as an ordinary low score. Check whether a range-validity condition belongs before the category checks.

```python run
score = 108
if not 0 <= score <= 100:
    result = "Score is outside the allowed range"
elif score >= 85:
    result = "Award distinction"
else:
    result = "Record the result"
print(result)
```

```output
Score is outside the allowed range
```

Here the validity test comes first. That prevents an out-of-range value from being classified as a valid high result. Whether a program should reject, explain, or otherwise handle a surprising value depends on the task, but the branch should make that decision explicit.

### Trace conjunctions and alternatives carefully

For `and`, think of every condition as a requirement that must be satisfied. If a music rehearsal is open only when the room is booked and the equipment is ready, test each part independently: a booking without working equipment should not open the room, and working equipment without a booking should not open it either. The complete expression is true only when both checks succeed. This way of reasoning is useful when a branch represents permission or eligibility.

For `or`, think of each condition as a valid route to the same action. A command may accept either a short label or a full word. Test both accepted values separately, then test something unrelated. A common mistake is to reason from the word “or” in ordinary speech but omit part of the comparison in code. `response == "yes" or "y"` is not a comparison against either spelling: the second side is just a non-empty string, which Python treats as true. The line runs for every response. Repeating the variable and comparison on both sides prevents this logic error.

`not` reverses one Boolean expression. Read it with the expression it modifies: `not is_locked` means the result of `is_locked` is false. When the expression after `not` is a comparison, parentheses may help a beginner reader see the grouping, as in `not (temperature < 0)`. A positive alternative, such as `temperature >= 0`, may be simpler if it states the goal directly. The useful choice is the one that makes the intended decision easiest to verify.

### Plan branches before typing them

Before writing a multi-branch decision, describe the cases in ordinary language and decide whether they overlap. Then translate those cases into comparisons, keeping the most specific condition first. For three score bands, state the boundary ownership explicitly: “below 50”, “from 50 up to but not including 80”, and “80 or higher”. This phrasing suggests `< 50`, `50 <= score < 80`, and `score >= 80`. Each score belongs in exactly one band. If a value can fall through without a result, decide whether a final `else` is appropriate.

It helps to distinguish a chain from several independent `if` statements. An `if`/`elif` chain picks at most one path. Separate `if` statements can each run when their condition is true. Use separate statements when multiple actions may all be needed. For example, a display might show both a low-battery notice and an offline notice if both conditions are true; that is different from choosing a single status label. When the intent is a single category, a chain communicates that intent directly.

```python run
battery_percent = 9
is_offline = True
if battery_percent < 15:
    print("Show low battery notice")
if is_offline:
    print("Show offline notice")
```

```output
Show low battery notice
Show offline notice
```

Both independent conditions are true, so both messages appear. Replacing the second `if` with `elif` would make the second check an alternative to the first, and only the first message would be shown. That difference is about the shape of the decision, not style.

### Use small checks to find a branch bug

When a result surprises you, temporarily print each Boolean expression instead of changing the whole chain at once. A check such as `print(score >= 85)` reveals whether the condition itself is true for the value in question. Then follow the chain in order and note the first true result. This isolates three common sources of trouble: a comparison symbol points the wrong way, a boundary is off by one, or an earlier branch captures a value intended for a later branch.

Try representative values that cover every path. Include a normal case, the smallest valid value, the largest valid value, and one outside the allowed range where relevant. For a fixed-value `match`, include at least one listed option and the fallback. The goal is not to enumerate every possible number; it is to check that each distinct branch can be reached and that nearby values do not accidentally cross a boundary.

Readable names also help these checks. A variable named `is_eligible` communicates a Boolean result more clearly than a vague name like `flag`. A decision can then read as `if is_eligible:` without repeating a long expression. Keep the name accurate if the conditions change; a stale Boolean name can mislead someone reviewing the branch later.

| Construct | When its body runs |
|---|---|
| `if condition:` | The condition is true |
| `elif condition:` | Earlier tests were false and this test is true |
| `else:` | Every preceding condition was false |
| `a and b` | Both conditions are true |
| `a or b` | At least one condition is true |
| `not a` | The truth value of `a` is reversed |
| `match value` | The first matching case is selected |

Branch ordering is part of the behavior. Consider which conditions overlap, then test values at boundaries such as exactly 25 or 85. A Boolean expression can be checked by printing it or by writing a small test with expected true and false results.

## Common mistakes

### Use `=` where a comparison is needed

Broken code:

```python
temperature = 12
if temperature = 12:
    print("Twelve degrees")
```

```output
  File "<string>", line 2
    if temperature = 12:
       ^^^^^^^^^^^
SyntaxError: invalid syntax. Maybe you meant '==' or ':=' instead of '='?
```

Python 3.12 reports `SyntaxError: invalid syntax. Maybe you meant '==' or ':=' instead of '='?` A single `=` is for assignment; use `==` to ask whether the values are equal.

### Forget the colon after a branch header

Broken code:

```python
if temperature < 10
    print("Bring a scarf")
```

```output
  File "<string>", line 1
    if temperature < 10
                       ^
SyntaxError: expected ':'
```

Python 3.12 reports `SyntaxError: expected ':'`. Add the colon at the end of the `if` line before the indented body.

### Put a broad condition before a narrow one

Broken code:

```python
strength = 92
if strength >= 60:
    print("steady")
elif strength >= 85:
    print("excellent")
```

This code runs but prints `steady`, because 92 already satisfies the first condition. Check `strength >= 85` first, then use the 60 threshold as the next case.

### Leave a comparison out of an or expression

Broken code:

```python
response = "no"
if response == "yes" or "y":
    print("Confirmed")
```

This code prints `Confirmed` because the non-empty string `"y"` is treated as true. Write `response == "yes" or response == "y"` so each allowed value is compared with the response.

### Check a simple divisibility rule before the combined rule

If a value matches both a specific case and a broad case, the first true branch wins. Put a special combined case such as divisibility by 15 before divisibility by 3 or 5.

## Cheat sheet

| Need | Example |
|---|---|
| Equal / different | `left == right`, `left != right` |
| Greater / smaller | `value > limit`, `value <= limit` |
| One choice | `if condition:` |
| Several conditions | `if`, `elif`, `else` |
| Require both | `first and second` |
| Accept either | `first or second` |
| Reverse a Boolean | `not condition` |
| Check remainder | `value % divisor == 0` |
| Choose among fixed values | `match value: case ...` |

## Try it yourself

### Easy: compare the rainfall

Print a warning when rainfall is at least 20 millimeters.

```python run
# Complete the compare the rainfall task.
# Sample data: rainfall = 24
# Write your code below and print the result
```


:::solution
The stored value is greater than or equal to 20, so the first branch runs. A smaller value would use the else branch.

```python
rainfall = 24
if rainfall >= 20:
    print("Heavy rain alert")
else:
    print("No heavy rain alert")
```
:::

### Medium: check a range

Print a message when the practice room temperature is between 19 and 24 degrees, inclusive.

```python run
# Complete the check a range task.
# Sample data: room_temperature = 21
# Write your code below and print the result
```


:::solution
The chained comparison includes both boundaries, and 21 is inside that range.

```python
room_temperature = 21
if 19 <= room_temperature <= 24:
    print("Comfortable for practice")
else:
    print("Adjust the room")
```
:::

### Challenge: match a fixed command

Use `match` to respond to a short control-room command and include a catch-all.

```python run
# Complete the match a fixed command task.
# Sample data: command = 'pause'
# Write your code below and print the result
```


:::solution
The `pause` value matches the second case, which groups two accepted spellings. Other values reach the catch-all case.

```python
command = "pause"
match command:
    case "play":
        result = "Music begins"
    case "pause" | "hold":
        result = "Music pauses"
    case _:
        result = "Unknown command"
print(result)
```
:::

## Recap

- Comparisons produce Boolean values that can control branches.
- An `if`/`elif`/`else` chain runs only its first matching branch.
- Put specific or combined conditions before broad overlapping conditions.
- Use `and`, `or`, and `not` to build clear Boolean expressions.
- Use `match` for a small set of fixed cases and `case _` as its fallback.

Based on Harvard's CS50P
Reference: Python documentation, Compound statements
