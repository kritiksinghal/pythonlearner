---
title: "True, False and comparisons"
curriculumTitle: "True, False and comparisons"
track: "Python from zero"
module: "M2 Making decisions"
order: 7
level: "Beginner"
summary: "Understand Boolean truth values, evaluate relationships using comparison operators, chain range checks, and inspect truthiness across Python data types."
prerequisites:
  - "what-is-programming-and-python"
  - "your-first-program-with-print"
  - "variables-and-types"
  - "numbers-and-math"
  - "text-strings"
  - "talking-to-the-user-with-input-and-f-strings"
learningGoals:
  - "Represent binary logical truth using Python's built-in `bool` type keywords `True` and `False`."
  - "Compare numerical and textual data using the six relational operators: `==`, `!=`, `<`, `<=`, `>`, and `>=`."
  - "Employ Python's expressive chained comparison syntax to validate bounded intervals like `0 <= score <= 100`."
  - "Evaluate the truthiness of non-boolean objects using `bool()` and distinguish between equality `==` and identity `is`."
relatedProblems: []
---

## What you will learn

- How Python models absolute logic using the two canonical boolean states: **`True`** and **`False`**.
- How nineteenth-century mathematician George Boole formalized binary propositional logic that underpins modern CPU computing.
- The six fundamental relational operators that compare quantities and produce boolean results.
- The critical syntactical distinction between the single equals assignment operator `=` and the double equals comparison operator `==`.
- How Python performs lexicographical ordering when comparing textual strings based on international Unicode code points.
- Writing elegant, readable interval checks using Python's native **chained comparisons** syntax without duplicate variables.
- The universal concept of **truthiness**: discovering which Python objects act as naturally true or false in conditional environments.
- How the boolean type is architecturally implemented inside the CPython virtual machine as a specialized subclass of integers.

## Why this matters

Furthermore, in modern database-driven applications and web development, relational checks serve as the primary defensive shield guarding against corrupted records and unauthorized actions. When a customer submits an order on an e-commerce platform, the application executes a series of comparison checks: verifying that inventory quantity is strictly greater than zero, ensuring the customer's shipping postal code conforms to geographic length requirements, and confirming that the total payable amount matches the sum of individual basket items plus applicable municipal taxes. If any single comparison evaluates to `False`, the transaction is safely rejected before any bank card is charged or warehouse dispatch notice is generated.

Computers do not possess human intuition, emotional empathy, or philosophical wisdom, yet they execute millions of high-stakes automated decisions every fraction of a second. An aircraft's fly-by-wire flight control computer must verify whether current airspeed exceeds safe structural flutter limits before adjusting wing flaps. A hospital cardiac monitoring station continuously measures sensor telemetry to alert medical staff if a patient's resting pulse drops below forty beats per minute. An international payment gateway analyzes incoming credit card transactions to verify whether an account balance exceeds the purchase total and whether the customer's fraud risk score sits within acceptable boundaries.

Every single one of these complex software decisions originates from simple questions that resolve to an absolute binary answer: yes or no, true or false. In software development, you cannot write branch logic, loops, access controls, or search filters without first constructing valid relational expressions. Mastering Python's relational operators gives you the precise intellectual vocabulary needed to command how your software interrogates data and navigates changing real-world conditions.

## The big idea

### Boolean algebra: the mathematical foundation of digital computers

To understand why boolean logic is so central to computer programming, it helps to appreciate its historical origins. In 1854, English mathematician and philosopher George Boole published *An Investigation of the Laws of Thought*, introducing an algebraic system in which variables take only two mathematical values: truth (`1`) and falsehood (`0`). Instead of ordinary numerical operations like addition and subtraction, boolean algebra operates using logical conjunction (`AND`), disjunction (`OR`), and negation (`NOT`). 

A century later, computer engineering pioneers realized that electrical switches—first vacuum tubes, and later microscopic silicon transistors on microchips—could physically embody Boole's algebra. A transistor either permits electrical current to flow (representing high voltage, or `1`, or `True`), or it blocks current (representing low voltage, or `0`, or `False`). Every central processing unit, graphics accelerator, and mobile phone processor in existence is an intricate network of billions of microscopic logic gates evaluating boolean expressions at the speed of light. When you write a comparison in Python like `score >= 50`, you are directly commanding this foundational architecture.

Imagine an automated security gatekeeper standing before the boarding bridge of an international passenger flight. The gatekeeper is equipped with an optical boarding pass scanner, a digital scale for carry-on luggage, and an electronic facial recognition camera. When a passenger approaches the checkpoint, the gatekeeper does not engage in polite conversation or estimate readiness based on appearance. Instead, the gatekeeper evaluates three strict, formal criteria:

1. Does the flight number printed on the boarding pass exactly equal today's scheduled departure?
2. Is the measured baggage weight less than or equal to the maximum cabin allowance of ten kilograms?
3. Has the security screening status flag been marked as verified?

Notice the fundamental nature of these questions: none of them admit shades of grey. A boarding pass cannot be "partially valid" or "mostly correct." The baggage either weighs ten kilograms or less, or it exceeds the limit. Each check evaluates to an unambiguous binary state: **`True`** or **`False`**. If every check evaluates to `True`, the electronic gate opens; if any test evaluates to `False`, the gate remains firmly locked.

In Python, this exact gatekeeping mechanism is powered by **boolean expressions**. A boolean expression is any valid syntactic instruction that the Python interpreter evaluates down to one of exactly two canonical objects: `True` or `False`. Relational comparison operators—such as `==` (equal to), `!=` (not equal to), `<` (strictly less than), and `>=` (greater than or equal to)—are the digital measuring instruments that test your data against domain boundaries and report the outcome.

## Step by step

### 1. The boolean type: `True` and `False`

Python provides a dedicated built-in primitive type called **`bool`**. Unlike integers which encompass infinitely many whole numbers, or strings which can represent billions of textual permutations, the `bool` type contains exactly two unique singleton values in the entire language: `True` and `False`. Both must be written with an initial capital letter; typing lowercase `true` or `false` causes a `NameError` because Python assumes you are referencing an undeclared variable.

```python run
passing_score = 50
student_score = 74
has_passed = student_score >= passing_score
print("Student score:", student_score)
print("Has passed exam:", has_passed)
print("Type of boolean flag:", type(has_passed))
```

```output
Student score: 74
Has passed exam: True
Type of boolean flag: <class 'bool'>
```

In line 1 and line 2, we define integer variables holding the minimum threshold and the student's actual test result. On line 3, Python evaluates the relational expression `student_score >= passing_score`. Because seventy-four is mathematically greater than or equal to fifty, Python reduces the expression to the boolean literal `True` and binds the identifier `has_passed` to that object. On line 6, calling `type(has_passed)` confirms that Python categorizes the variable under `<class 'bool'>`.

### 2. Testing equality and superiority: cricket match scores

The double equals operator `==` inspects two operands and returns `True` if their evaluated values are identical. The strictly greater than operator `>` returns `True` only if the left-hand quantity exceeds the right-hand quantity without being equal.

```python run
team_a_runs = 210
team_b_runs = 210
is_tie = team_a_runs == team_b_runs
is_winner = team_a_runs > team_b_runs
print("Scores match (tie):", is_tie)
print("Team A won directly:", is_winner)
```

```output
Scores match (tie): True
Team A won directly: False
```

On line 3, Python evaluates `team_a_runs == team_b_runs`. Since both integer variables hold the value `210`, the equality comparison evaluates to `True`. On line 4, Python evaluates `team_a_runs > team_b_runs`. Because `210` is not strictly larger than `210`, the operator yields `False`. This demonstrates why selecting the exact relational operator is essential when modeling athletic outcomes or commercial thresholds.

### 3. Inequality and boundary comparisons in finance

The inequality operator `!=` returns `True` whenever two values differ in content, and `False` when they are identical. When dealing with purchasing rules, consumers must often possess an account balance that meets or exceeds the required transaction fee, which is modeled using the greater-than-or-equal operator `>=`.

```python run
balance = 1500
item_cost = 1500
print("Balance exactly matches cost:", balance == item_cost)
print("Balance differs from cost:", balance != item_cost)
print("Can afford purchase (balance >= cost):", balance >= item_cost)
```

```output
Balance exactly matches cost: True
Balance differs from cost: False
Can afford purchase (balance >= cost): True
```

In line 3, `balance == item_cost` confirms that the account contains the exact price needed. In line 4, `balance != item_cost` evaluates to `False` because the numbers do not differ. In line 5, `balance >= item_cost` is `True` because the account balance satisfies the minimum financial requirement. If the customer had possessed `1501`, the `>=` check would still evaluate to `True`, whereas `==` would evaluate to `False`.

### 4. Comparing text strings lexicographically

When you apply comparison operators like `<`, `<=`, `>`, or `==` to text strings, Python does not count the total number of characters in each word. Instead, Python performs a **lexicographical comparison**, analyzing the strings character by character based on their numerical Unicode code point assignments.

```python run
word1 = "apple"
word2 = "banana"
word3 = "Apple"
print("apple < banana:", word1 < word2)
print("Apple < apple (uppercase ASCII precedes lowercase):", word3 < word1)
```

```output
apple < banana: True
Apple < apple (uppercase ASCII precedes lowercase): True
```

In line 4, Python compares the initial characters `'a'` and `'b'`. Because the letter `'a'` has an ordinal code point value of `97` and `'b'` has a value of `98`, `'apple' < 'banana'` evaluates to `True`. In line 5, Python compares uppercase `'A'` (Unicode value `65`) with lowercase `'a'` (Unicode value `97`). Because uppercase letters precede lowercase letters in the ASCII and Unicode charts, `'Apple'` is considered strictly less than `'apple'`. Understanding this principle prevents sorting bugs when organizing customer directories or product catalogs.

### 5. Chained comparisons: clean interval checks

In many traditional programming languages such as C, Java, or JavaScript, testing whether a numerical variable sits between two numerical bounds requires joining two separate comparison statements with a logical `and` operator, such as `age >= 18 && age <= 35`. Python provides a much more readable feature known as **chained comparisons**, allowing you to express mathematical range intervals in a single continuous statement.

```python run
player_age = 22
is_eligible = 18 <= player_age <= 35
print("Player age:", player_age)
print("Eligible for division (18 to 35):", is_eligible)
```

```output
Player age: 22
Eligible for division (18 to 35): True
```

Line 2 checks whether `18` is less than or equal to `player_age`, and simultaneously verifies that `player_age` is less than or equal to `35`. Python evaluates this expression cleanly and efficiently without requiring you to write the identifier `player_age` twice. Because `22` falls neatly within that numerical window, the expression evaluates to `True`.

### 6. Bounded grade ranges with multi-point validation

Chained comparisons are especially valuable when validating incoming sensor telemetry, percentage metrics, or academic scores where values outside a physical or institutional boundary represent corrupted data.

```python run
score = 85
is_valid_grade = 0 <= score <= 100
print("Score:", score)
print("Valid grade range (0-100):", is_valid_grade)
```

```output
Score: 85
Valid grade range (0-100): True
```

Line 2 validates that `score` is neither negative nor greater than one hundred percent. If an erroneous user input or malfunctioning telemetry transmission were to supply `-15` or `125`, Python would immediately evaluate `is_valid_grade` to `False`, allowing your program to reject the anomalous reading before continuing calculations.

### 7. Truthiness: evaluating non-boolean values

In Python, every object in the language has an inherent truth value, a concept commonly referred to in the developer community as **truthiness**. Even if a variable does not hold an explicit boolean `True` or `False`, Python can evaluate its logical state when passed to the built-in `bool()` function or placed in a conditional check. Python's rules for truthiness are consistent and logical:
- **Falsy values**: The numeric zero (`0`, `0.0`), the empty string (`""`), the special absence literal `None`, the boolean `False`, and empty collections (such as empty lists `[]` or empty dictionaries `{}`).
- **Truthy values**: Any non-zero numeric value (such as `1`, `-42`, or `0.001`), any string containing at least one character (even a single space character `" "`), and any populated collection holding elements.

```python run
print("bool(0):", bool(0))
print("bool(42):", bool(42))
print("bool(''):", bool(''))
print("bool('Python'):", bool('Python'))
print("bool(None):", bool(None))
```

```output
bool(0): False
bool(42): True
bool(''): False
bool('Python'): True
bool(None): False
```

Lines 1 through 5 demonstrate how Python categorizes raw data. The number `0`, the empty string `''`, and `None` evaluate to `False`. Meanwhile, `42` and `'Python'` evaluate to `True`. This convention allows Python programmers to write concise checks such as verifying whether a user has entered text before proceeding.

### 8. Under the hood: booleans as integer subclasses

In Python's object model architecture, the `bool` class is not an isolated primitive disconnected from numbers; it is an explicit subclass of the built-in `int` class. In computer memory, `True` represents the integer `1`, and `False` represents the integer `0`.

```python run
flag = True
print("int(True):", int(True))
print("int(False):", int(False))
print("True + True + False:", True + True + False)
print("isinstance(True, int):", isinstance(True, int))
```

```output
int(True): 1
int(False): 0
True + True + False: 2
isinstance(True, int): True
```

Lines 2 and 3 show that passing `True` and `False` to `int()` returns `1` and `0` respectively. Line 4 illustrates that performing arithmetic addition on boolean values treats them as numerical ones and zeroes, producing `1 + 1 + 0 = 2`. Finally, line 5 uses the built-in `isinstance()` function to prove that `True` is recognized by the runtime as an instance of `int`.

## What Python is doing behind the scenes

When Python compiles comparison operations into executable virtual machine instructions, the CPython compiler generates specialized opcodes that interact directly with the C runtime evaluation stack:

| Comparison Operator | Python Internal Dunder Method | CPython Bytecode Instruction | Evaluation Behavior |
| :--- | :--- | :--- | :--- |
| `==` | `__eq__(self, other)` | `COMPARE_OP (==)` | Evaluates object value equivalence |
| `!=` | `__ne__(self, other)` | `COMPARE_OP (!=)` | Evaluates object value divergence |
| `<` | `__lt__(self, other)` | `COMPARE_OP (<)` | Evaluates strictly less-than ordering |
| `<=` | `__le__(self, other)` | `COMPARE_OP (<=)` | Evaluates less-than-or-equal ordering |
| `>` | `__gt__(self, other)` | `COMPARE_OP (>)` | Evaluates strictly greater-than ordering |
| `>=` | `__ge__(self, other)` | `COMPARE_OP (>=)` | Evaluates greater-than-or-equal ordering |

When evaluating chained comparisons like `0 <= score <= 100`, Python applies an optimization known as **short-circuit evaluation**:

| Step | Expression Evaluated | Condition Result | Runtime Action |
| :--- | :--- | :--- | :--- |
| **Step 1** | Evaluate middle operand `score` | Binds value `85` in register | Evaluated exactly once to prevent side effects |
| **Step 2** | Evaluate left comparison `0 <= 85` | Yields `True` | Continues to the right-hand comparison |
| **Step 3** | Evaluate right comparison `85 <= 100` | Yields `True` | Both sub-conditions hold; returns `True` |
| **Alternate** | If left comparison had yielded `False` | Halts immediately | Does not evaluate right operand; returns `False` |

## Common mistakes

### 1. Confusing assignment (`=`) with equality testing (`==`)

One of the most frequent hurdles for novice programmers is mixing up the single equals sign `=` with the double equals sign `==`. A single equals sign assigns a value to a variable identifier, whereas a double equals sign compares two existing expressions. In Python, placing an assignment statement inside a comparison condition triggers an immediate syntax error.

Broken code:
```python
score = 80
if score = 100:
    print("Perfect!")
```

Real error message:
```output
SyntaxError: invalid syntax. Maybe you meant '==' or ':=' instead of '='?
```

How to fix it: replace the single assignment symbol `=` with the relational comparison operator `==`:
```python run
score = 80
is_perfect = score == 100
print("Is perfect score:", is_perfect)
```

```output
Is perfect score: False
```

### 2. Case-sensitivity traps in string comparisons

Because string comparison in Python checks exact Unicode code point values, differences in letter casing cause equality tests to fail even when the alphabetical words appear identical to a human reader.

Broken code:
```python
role = "Admin"
is_admin = role == "admin"
print("Is administrator:", is_admin)
```

Actual output:
```output
Is administrator: False
```

How to fix it: normalize both strings using `.lower()` before performing the comparison test:
```python run
role = "Admin"
is_admin = role.lower() == "admin"
print("Is administrator normalized:", is_admin)
```

```output
Is administrator normalized: True
```

### 3. Comparing floating-point numbers for exact equality

Due to the fundamental physical constraints of the IEEE 754 binary floating-point standard implemented across modern computer microprocessors, fractional numbers cannot always be represented with infinite decimal precision. Performing arithmetic on decimal numbers often produces microscopic trailing artifacts in the seventeenth decimal place.

Broken code:
```python
val = 0.1 + 0.2
is_three = val == 0.3
print("0.1 + 0.2 == 0.3:", is_three)
```

Actual output:
```output
0.1 + 0.2 == 0.3: False
```

How to fix it: round the numbers to a standardized number of decimal places before comparing, or check whether the absolute difference between the numbers falls below a microscopic tolerance:
```python run
val = 0.1 + 0.2
is_close = round(val, 2) == 0.30
print("Rounded comparison:", is_close)
```

```output
Rounded comparison: True
```


### 4. Confusing value equality (`==`) with object identity (`is`)

Another subtle trap that catches intermediate programmers is using the identity operator `is` when they actually intended to compare value equality `==`. The equality operator `==` checks whether two distinct objects hold the same data or content. The identity operator `is` checks whether two variables point to the exact same physical memory address in computer RAM.

Broken code:
```python
a = 1000
b = 1000
print(a is b)
```

Actual output:
```output
False
```

How to fix it: use `==` when comparing whether numbers, strings, or data structures hold equal values. Reserve the identity operator `is` strictly for checking singleton objects like `None`:
```python run
a = 1000
b = 1000
print("Values are equal (==):", a == b)
result = None
print("Result is None (is):", result is None)
```

```output
Values are equal (==): True
Result is None (is): True
```

## Cheat sheet

| Operator / Function | Mathematical Meaning | Example Returning True | Example Returning False |
| :--- | :--- | :--- | :--- |
| `==` | Exact equality | `10 == 10` | `10 == 20` |
| `!=` | Value divergence | `10 != 20` | `10 != 10` |
| `>` | Strictly greater than | `15 > 10` | `10 > 15` |
| `<` | Strictly less than | `5 < 10` | `10 < 5` |
| `>=` | Greater than or equal to | `10 >= 10` | `9 >= 10` |
| `<=` | Less than or equal to | `10 <= 10` | `11 <= 10` |
| `a < b < c` | Chained interval range | `10 < 15 < 20` | `10 < 25 < 20` |
| `bool(x)` | Object truthiness test | `bool("Text")` | `bool("")` |

## Try it yourself

### Exercise 1 (easy): Exam passing threshold

Given a student score `score = 68` and a passing mark `pass_mark = 50`, write a comparison statement that evaluates whether the student passed. Store the result in a boolean variable `passed` and print the outcome.

```python run
# Complete the Exam passing threshold task.
# Sample data: pass_mark = 50
# Write your code below and print the result
```


:::solution Solution
Use the greater-than-or-equal-to operator `>=`:

```python run
score = 68
pass_mark = 50
passed = score >= pass_mark
print("Exam result passed:", passed)
```

```output
Exam result passed: True
```
:::

### Exercise 2 (medium): Liquid water temperature range

Water remains in liquid state at standard pressure between 0 degrees Celsius and 100 degrees Celsius inclusive. Given `water_temp = 45`, write a chained comparison that checks if `water_temp` is in the liquid range (`0 <= water_temp <= 100`), storing the result in `is_liquid` and printing it.

```python run
# Complete the Liquid water temperature range task.
# Sample data: water_temp = 45
# Write your code below and print the result
```


:::solution Solution
Use chained comparison syntax `0 <= water_temp <= 100`:

```python run
water_temp = 45
is_liquid = 0 <= water_temp <= 100
print("Is liquid state:", is_liquid)
```

```output
Is liquid state: True
```
:::

### Exercise 3 (challenge): Username policy validation

A web application requires usernames to be between 5 and 15 characters long inclusive. Given `username = "coder_pro"`, use `len()` inside a chained comparison to verify whether the username length satisfies the policy (`5 <= len(username) <= 15`), and print a clear boolean report.

```python run
# Complete the Username policy validation task.
# Sample data: username = 'coder_pro'
# Write your code below and print the result
```


:::solution Solution
Call `len(username)` and test with the chained comparison `5 <= char_count <= 15`:

```python run
username = "coder_pro"
char_count = len(username)
is_valid_len = 5 <= char_count <= 15
print(f"Username '{username}' length ({char_count}) is valid:", is_valid_len)
```

```output
Username 'coder_pro' length (9) is valid: True
```
:::

## Recap

- The boolean type (`bool`) has exactly two unique singleton literals in Python: `True` and `False`.
- Comparison operators (`==`, `!=`, `<`, `<=`, `>`, `>=`) evaluate relationships between values and return boolean outcomes.
- Always use `==` for comparisons; the single equals symbol `=` is reserved strictly for variable assignment.
- Strings are evaluated lexicographically according to their underlying Unicode code point numbers.
- Python supports **chained comparisons** like `0 <= x <= 100`, eliminating repetitive variable references.
- Non-boolean objects possess inherent truthiness: the number zero, empty containers, and `None` are falsy; all other values are truthy.
- Value equality (`==`) checks whether two items hold identical data, whereas identity (`is`) checks whether they occupy the exact same memory address.

Reference: Python documentation, Comparisons
