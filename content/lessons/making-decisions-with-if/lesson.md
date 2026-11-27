---
title: "Making decisions with if"
curriculumTitle: "if, elif, else"
track: "Python from zero"
module: "M2 Making decisions"
order: 2
level: "Beginner"
summary: "Learn how to use if, elif, and else statements to make your Python programs choose different paths based on conditions."
prerequisites:
  - "variables-and-types"
learningGoals:
  - "Understand conditional statements and boolean expressions"
  - "Use comparison operators ==, !=, <, >, <=, >="
  - "Combine conditions with logical operators and, or, not"
  - "Branch code paths using if, elif, and else"
relatedProblems:
  - "find-maximum"
---
## What you will learn

- How to use the `if` statement to run code only when a condition is met
- How to handle alternatives using `else` and `elif`
- How to compare values using the six **comparison operators**
- How to combine multiple conditions using `and`, `or`, and `not`
- How Python uses **indentation** to group statements together
- How nested conditions allow you to model multi-stage rules

## Why this matters

Up to this point, your programs ran in a straight line from top to bottom. Every line ran once, in order, regardless of the situation. Real programs cannot work this way. An authentication system must check whether a password matches before granting access. A shopping website must check whether an item is in stock before charging a credit card. A thermostat must read the room temperature before turning on the heating unit. Making decisions based on changing conditions is what turns a static calculation into an active, intelligent program.

## The big idea

A **conditional statement** allows your program to choose which path of instructions to follow based on whether an answer is `True` or `False`. 

Think of this like **approaching an automatic traffic signal**. When the signal light is green, your car proceeds through the intersection. When the signal light is red, your car stops and waits behind the line. The action you take depends entirely on the state of the traffic light. In programming, the question "Is the light green?" is called a **boolean expression**, and the decision to either proceed or stop is called **branching**.

In Python, the fundamental keyword for making decisions is `if`. When the condition following `if` evaluates to `True`, Python executes the indented block of code underneath it. When the condition evaluates to `False`, Python skips that entire block as if it were not there.

## Step by step

### The basic if statement

The most direct decision in Python uses the keyword `if`, followed by a condition, and ends with a colon (`:`). The lines that belong inside the decision must be indented by four spaces.

```python run
temperature = 38
if temperature > 37:
    print("You have a fever.")
    print("Please drink water and rest.")
```

```output
You have a fever.
Please drink water and rest.
```

**Line by line:** Line 1 stores `38` in the variable `temperature`. Line 2 evaluates `temperature > 37`. Because `38` is greater than `37`, this condition produces `True`. Python enters the indented block and executes lines 3 and 4, printing both messages. If `temperature` had been `36`, the condition would produce `False`, and Python would skip lines 3 and 4 entirely.

### Providing an alternative with else

Often you want to do one thing when a condition is true, and a different thing when it is false. You express this using the `else` keyword. The `else` block has no condition of its own; it acts as a safety net that catches everything not covered by the `if`.

```python run
balance = 450
item_price = 600
if balance >= item_price:
    balance = balance - item_price
    print("Payment successful.")
    print("Remaining balance:", balance)
else:
    print("Payment declined: insufficient funds.")
    print("Amount needed:", item_price - balance)
```

```output
Payment declined: insufficient funds.
Amount needed: 150
```

**Line by line:** Line 3 tests whether `balance` is greater than or equal to `item_price`. Because `450 >= 600` is `False`, Python bypasses lines 4 through 6. It jumps directly to the `else` block on line 7, running lines 8 and 9 to notify you of the shortfall. Exactly one of the two blocks will execute—never both, and never neither.

### Checking multiple choices with elif

When you have more than two possible outcomes, chain additional conditions using `elif`, which is short for "else if". Python examines each condition from top to bottom. As soon as it finds one that evaluates to `True`, it runs that block and skips the rest of the chain.

```python run
score = 78
if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
elif score >= 60:
    grade = "D"
else:
    grade = "F"
print("Your grade:", grade)
```

```output
Your grade: C
```

**Line by line:** Line 2 checks `78 >= 90` (`False`). Line 4 checks `78 >= 80` (`False`). Line 6 checks `78 >= 70` (`True`). Python sets `grade = "C"`, immediately exits the entire `if`-`elif`-`else` structure, and resumes at line 12 to print the final grade. The order of conditions in an `elif` chain matters: put more specific conditions before general ones.

### The six comparison operators

To construct conditions, you compare values using Python's six **comparison operators**. Each comparison always produces a boolean value: either `True` or `False`.

- `==` checks whether two values are equal
- `!=` checks whether two values are different
- `>` checks whether the left value is strictly greater than the right value
- `<` checks whether the left value is strictly less than the right value
- `>=` checks whether the left value is greater than or equal to the right value
- `<=` checks whether the left value is less than or equal to the right value

```python run
speed = 65
speed_limit = 55
print("Equal to limit:", speed == speed_limit)
print("Different from limit:", speed != speed_limit)
print("Strictly over limit:", speed > speed_limit)
print("At or below limit:", speed <= speed_limit)
```

```output
Equal to limit: False
Different from limit: True
Strictly over limit: True
At or below limit: False
```

Remember that checking for equality requires two equals signs (`==`). A single equals sign (`=`) is the assignment operator used to store values into variables. Mixing these up is one of the most frequent syntax mistakes made by learners.

### Combining conditions with and

Sometimes an action requires two conditions to be satisfied at the same time. The **logical operator** `and` returns `True` only when both sides of the expression evaluate to `True`. If either side is `False`, the whole expression evaluates to `False`.

```python run
age = 22
has_license = True
if age >= 18 and has_license:
    print("You can rent a car.")
else:
    print("Car rental requirements not met.")
```

```output
You can rent a car.
```

**Line by line:** `age >= 18` is `True` because `22 >= 18`. `has_license` is also `True`. Because both conditions are `True`, the `and` expression produces `True`, and the rental confirmation message prints.

### Broadening choices with or

The `or` operator allows you to check whether at least one condition is satisfied. It returns `True` if the left side is `True`, the right side is `True`, or both sides are `True`. It only returns `False` when both sides are `False`.

```python run
day = "Saturday"
if day == "Saturday" or day == "Sunday":
    print("The clinic is closed today.")
else:
    print("The clinic is open from 9 AM to 5 PM.")
```

```output
The clinic is closed today.
```

**Line by line:** Line 2 evaluates `day == "Saturday"`. Because `day` is `"Saturday"`, the first condition is `True`. Python does not even need to evaluate the second condition—it already knows the entire `or` expression is `True`. This behavior is known as **short-circuit evaluation**.

### Reversing truth with not

The `not` operator inverts the truth value of any boolean expression. It turns `True` into `False`, and `False` into `True`. It helps write clean, readable checks for negative conditions.

```python run
is_subscribed = False
if not is_subscribed:
    print("Unlock unlimited access by subscribing today!")
```

```output
Unlock unlimited access by subscribing today!
```

**Line by line:** `is_subscribed` is `False`. Applying `not False` produces `True`. The condition passes, displaying the subscription callout.

### Nesting conditions inside conditions

You can place an `if` statement inside the body of another `if` statement. This technique is known as **nesting**. It is useful when a second decision only makes sense after a first decision has already passed.

```python run
cart_total = 120
is_member = True
if cart_total >= 100:
    if is_member:
        discount = 20
    else:
        discount = 10
else:
    discount = 0
final_price = cart_total - discount
print("Discount applied:", discount)
print("Final amount to pay:", final_price)
```

```output
Discount applied: 20
Final amount to pay: 100
```

**Line by line:** Line 3 tests whether `cart_total >= 100` (`120 >= 100` is `True`). Python steps inside the outer block and reaches line 4. Line 4 checks whether `is_member` is `True`. It is, so `discount = 20`. Lines 6 through 9 are skipped. The final price calculation deducts `20` from `120`, arriving at `100`.

### Comparing text strings

Comparison operators also work on strings. Two strings are considered equal (`==`) when they contain the exact same characters in the exact same order, including casing and spacing.

```python run
entered_code = "SAVE20"
valid_code = "SAVE20"
if entered_code == valid_code:
    print("Promo code applied: 20% off!")
else:
    print("Invalid promo code.")
```

```output
Promo code applied: 20% off!
```

String comparison is case-sensitive: `"Save20"` is not equal to `"SAVE20"`. When comparing text, always verify casing or convert strings to a common case using string methods.

### Truthy and falsy values

In Python, you do not always need to write a comparison operator like `== True`. Any value can be evaluated directly in an `if` statement. Python considers most values **truthy**, meaning they count as `True`. A small set of empty values are considered **falsy**, meaning they count as `False`.

Common falsy values in Python include:
- The boolean `False`
- The number zero: `0`, `0.0`
- Empty text strings: `""`
- The special value `None`

```python run
username = ""
if username:
    print("Welcome back,", username)
else:
    print("Guest user: please enter your name.")
```

```output
Guest user: please enter your name.
```

**Line by line:** `username` holds an empty string `""`. When Python evaluates `if username:`, it treats the empty string as falsy (`False`). It skips to the `else` block and prompts the guest user.

## What Python is doing behind the scenes

When Python encounters an `if`-`elif`-`else` ladder, it reads the conditions sequentially. It stops at the very first branch that produces `True`. The following trace shows how Python tracks variables and branches for a shipping calculator:

```python
weight = 8
distance = 150
if weight > 10:
    rate = 25
elif distance > 100:
    rate = 15
else:
    rate = 10
```

| Step | Expression Evaluated | Evaluates To | Action Taken |
|---|---|---|---|
| 1 | `weight > 10` (8 > 10) | `False` | Skip `rate = 25`, proceed to next `elif` |
| 2 | `distance > 100` (150 > 100) | `True` | Execute `rate = 15`, set `rate` variable |
| 3 | `else` branch | Not evaluated | Whole remaining structure bypassed |
| 4 | Post-condition state | Finished | `rate` is `15`, execution continues below |

Notice step 3: because step 2 succeeded, Python never checks the `else` block. Even if later conditions might also have been true, only the first matching branch runs.

## Common mistakes

### Mistake 1: Using single equals instead of double equals

```python
score = 90
if score = 90:
    print("Perfect")
```

**Error:** `SyntaxError: invalid syntax. Maybe you meant '==' or ':=' instead of '='?`

A single equals sign (`=`) assigns a value to a variable; it cannot evaluate whether two values are equal. When Python sees `=` where it expects a test expression, it raises a SyntaxError. The fix is to use double equals (`==`):

```python
score = 90
if score == 90:
    print("Perfect")
```

### Mistake 2: Forgetting the trailing colon

```python
x = 5
if x > 3
    print("big")
```

**Error:** `SyntaxError: expected ':'`

Every `if`, `elif`, and `else` header line must terminate with a colon (`:`). The colon signals to Python that an indented block of code follows immediately on the next line. The fix is to add the colon: `if x > 3:`.

### Mistake 3: Inconsistent or missing indentation

```python
x = 5
if x > 3:
print("big")
```

**Error:** `IndentationError: expected an indented block after 'if' statement on line 2`

Unlike languages that use curly braces `{}` to define code blocks, Python relies strictly on indentation. The code that runs under an `if` statement must be indented (standard practice is four spaces). The fix is to indent the body:

```python
x = 5
if x > 3:
    print("big")
```

### Mistake 4: Comparing incompatible data types

```python
age = "18"
if age >= 18:
    print("adult")
```

**Error:** `TypeError: '>=' not supported between instances of 'str' and 'int'`

Python refuses to order a string against a number because their formats are incompatible. The variable `age` stores the string `"18"` rather than the number `18`. The fix is to convert the string to an integer before comparing: `if int(age) >= 18:`.

## Cheat sheet

| Construct | Syntax | When It Runs | Example |
|---|---|---|---|
| If statement | `if condition:` | When condition is `True` | `if x > 0: print("positive")` |
| Else branch | `else:` | When preceding `if`/`elif` are `False` | `else: print("non-positive")` |
| Elif branch | `elif condition:` | When previous checks failed and this is `True` | `elif x == 0: print("zero")` |
| Equal to | `a == b` | When values match | `score == 100` |
| Not equal to | `a != b` | When values differ | `status != "complete"` |
| Greater than | `a > b` | When `a` strictly exceeds `b` | `temp > 37.5` |
| Less than | `a < b` | When `a` is strictly under `b` | `price < 50` |
| Greater or equal | `a >= b` | When `a` is at least `b` | `age >= 18` |
| Less or equal | `a <= b` | When `a` is at most `b` | `count <= 10` |
| Logical AND | `cond1 and cond2` | When both conditions are `True` | `age >= 18 and has_id` |
| Logical OR | `cond1 or cond2` | When at least one condition is `True` | `is_weekend or is_holiday` |
| Logical NOT | `not cond` | Inverts boolean truth value | `not is_active` |

## Try it yourself

### Exercise 1 (easy): Movie theater ticket pricing

Use `age` to set a ticket price: 150 under 12, 250 for ages 12–17, and 350 otherwise. Print the price for age 15.


:::tip Hint
Use the lesson idea about making decisions with if. Trace the sample values before printing so you can check each step.
:::

```sample input
age = 15
```

```expected
Ticket price: 250
```

```python run
# Complete the Exercise 1 (easy): Movie theater ticket pricing task.
age = 15
# Write your code below
```


:::solution Solution
Because 15 is not under 12, the first check fails. The second check `age <= 17` succeeds, setting `price = 250`.

```python run
age = 15
if age < 12:
    price = 150
elif age <= 17:
    price = 250
else:
    price = 350
print("Ticket price:", price)
```

```output
Ticket price: 250
```
:::

### Exercise 2 (medium): Free delivery calculation

Use `order_total` and `is_vip` to set the delivery fee. Print the fee and total payable for the supplied order.


:::tip Hint
Use the lesson idea about making decisions with if. Trace the sample values before printing so you can check each step.
:::

```sample input
order_total = 650
is_vip = False
```

```expected
Delivery fee: 0
Total payable: 650
```

```python run
# Complete the Exercise 2 (medium): Free delivery calculation task.
order_total = 650
is_vip = False
# Write your code below
```


:::solution Solution
Using the `or` operator, `order_total >= 500` is `True`, so free delivery applies regardless of `is_vip`.

```python run
order_total = 650
is_vip = False
if order_total >= 500 or is_vip:
    delivery_fee = 0
else:
    delivery_fee = 50
print("Delivery fee:", delivery_fee)
print("Total payable:", order_total + delivery_fee)
```

```output
Delivery fee: 0
Total payable: 650
```
:::

### Exercise 3 (challenge): Leap year checker

Check whether `year` is a leap year using the century rule. Print the result for 2024.


:::tip Hint
Use the lesson idea about making decisions with if. Trace the sample values before printing so you can check each step.
:::

```sample input
year = 2024
```

```expected
2024 is a leap year.
```

```python run
# Complete the Exercise 3 (challenge): Leap year checker task.
year = 2024
# Write your code below
```


:::solution Solution
2024 is divisible by 4 (`2024 % 4 == 0`) and not divisible by 100 (`2024 % 100 != 0`), so the left expression produces `True`.

```python run
year = 2024
if (year % 4 == 0 and year % 100 != 0) or (year % 400 == 0):
    print(year, "is a leap year.")
else:
    print(year, "is not a leap year.")
```

```output
2024 is a leap year.
```
:::

## Recap

- An **if statement** tests a boolean condition and executes its indented block only when the condition is `True`.
- Use **else** to provide a fallback block when all preceding checks evaluate to `False`.
- Use **elif** to test a series of alternative conditions sequentially from top to bottom.
- Python uses six **comparison operators**: `==`, `!=`, `>`, `<`, `>=`, and `<=`.
- Combine expressions using **logical operators**: `and` requires all conditions to pass, `or` requires at least one condition to pass, and `not` inverts truth.
