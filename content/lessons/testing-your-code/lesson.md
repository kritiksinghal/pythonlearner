---
title: "Testing your code (assert and unittest)"
curriculumTitle: "Testing your code (assert and unittest)"
track: "Python from zero"
module: "M8 Advanced"
order: 42
level: "Intermediate"
summary: "Check program behavior with assert statements and organize repeatable checks with unittest."
prerequisites:
  - "Type hints"
learningGoals:
  - "Write an assertion that compares actual and expected behavior"
  - "Create unittest cases using TestCase methods"
  - "Check normal, boundary, and exceptional behavior"
  - "Run a test suite and interpret its result"
relatedProblems: []
---

## What you will learn

- How an **assertion** checks whether an assumption about a value is true
- How to write small tests that compare actual results with expected results
- How `unittest.TestCase` groups reusable checks into test methods
- How to test exceptions with `assertRaises`
- Why several focused tests provide better evidence than one large example

## Why this matters

When you change a program, it is easy to fix one case and accidentally break another. Tests let you record important expected behavior so you can check it again later. Even a few small tests can catch a wrong formula, a missed boundary, or a function that handles only one kind of input. Testing also makes a function's purpose more concrete by showing examples of how callers expect it to behave.

## The big idea

Think of a test as a checklist item for a machine: give it a known situation and compare its result with what you expect. If they match, that one check passes. If they differ, the test tells you which expectation needs investigation.

An **assertion** is a statement that checks a condition and raises `AssertionError` if the condition is false. The standard library's `unittest` framework organizes tests into classes and provides named assertion methods. Tests should be small, repeatable, and focused on behavior a caller can observe.

## Step by step

### Use `assert` for a direct check

Write `assert condition` when you want Python to confirm a condition during development or in a compact check.

```python run
def midpoint(first, second):
    return (first + second) / 2

assert midpoint(8, 14) == 11
print("Midpoint check passed")
```

```output
Midpoint check passed
```

The expression compares the actual return value with the expected value. Because the condition is true, execution continues to the print statement. If the condition were false, Python would raise `AssertionError`.

### Add a message to an assertion

An assertion message can explain what expectation failed. This can be useful in a small script or a quick development check.

```python run
points = 19
assert points >= 0, "A score cannot be negative"
print("Score is in range")
```

```output
Score is in range
```

The message appears when the assertion condition is false. Keep it short and helpful. For user input validation, use an `if` statement and a user-facing response; assertions are mainly for checking programmer assumptions.

### Put behavior in a function before testing it

Testing a small function is easier than testing a program that mixes input, calculations, and printed output. Separate the logic from its interface when possible.

```python run
def discounted_price(price, percent_off):
    return price * (1 - percent_off / 100)

assert discounted_price(800, 25) == 600
print("Discount calculation passed")
```

```output
Discount calculation passed
```

The test calls the function with known data and compares the result. It does not depend on interactive input or a file. This makes it fast and repeatable.

### Create a `unittest.TestCase`

For a set of related tests, subclass `unittest.TestCase` and define methods whose names start with `test`. Use the framework's assertion methods to report failures clearly.

```python run
import unittest

def initials(first, last):
    return f"{first[0]}.{last[0]}."

class InitialsTests(unittest.TestCase):
    def test_two_names(self):
        self.assertEqual(initials("Mira", "Sen"), "M.S.")

suite = unittest.defaultTestLoader.loadTestsFromTestCase(InitialsTests)
result = unittest.TestResult()
suite.run(result)
print(result.testsRun)
print(result.wasSuccessful())
```

```output
1
True
```

The test method calls `assertEqual()` with an actual and expected value. The suite runs that method and stores its outcome in a `TestResult`. This keeps the output stable for the runnable example.

### Test more than one behavior

Add a separate test method for each distinct behavior. Focused names make a failure easier to understand.

```python run
import unittest

def is_weekend(day):
    return day in {"Saturday", "Sunday"}

class WeekendTests(unittest.TestCase):
    def test_saturday(self):
        self.assertTrue(is_weekend("Saturday"))

    def test_monday(self):
        self.assertFalse(is_weekend("Monday"))

suite = unittest.defaultTestLoader.loadTestsFromTestCase(WeekendTests)
result = unittest.TestResult()
suite.run(result)
print(result.testsRun, result.wasSuccessful())
```

```output
2 True
```

There are two checks, one for a weekend day and one for a weekday. If one fails, its test method name helps identify which behavior changed.

### Check that a function raises an exception

Use `assertRaises()` when an error is the expected behavior for invalid data. This tests the exception type without allowing it to stop the rest of the test method.

```python run
import unittest

def positive_ratio(top, bottom):
    if bottom == 0:
        raise ValueError("bottom cannot be zero")
    return top / bottom

class RatioTests(unittest.TestCase):
    def test_zero_bottom_is_rejected(self):
        with self.assertRaises(ValueError):
            positive_ratio(5, 0)

suite = unittest.defaultTestLoader.loadTestsFromTestCase(RatioTests)
result = unittest.TestResult()
suite.run(result)
print(result.wasSuccessful())
```

```output
True
```

The context manager inside the test expects a `ValueError`. If the function does not raise that type, the test fails. If it raises the expected type, the assertion passes.

### Test boundary values

Boundary tests check the edges of a function's expected range. A grading function may behave differently exactly at a threshold, so include values just below, at, and above the boundary.

```python run
def passed(mark):
    return mark >= 40

assert passed(39) is False
assert passed(40) is True
assert passed(41) is True
print("Pass threshold checks passed")
```

```output
Pass threshold checks passed
```

The middle check is especially useful because a comparison accidentally written as `>` instead of `>=` would fail exactly at 40. Choose test cases that distinguish likely mistakes.

### Use a subtest for related values

`subTest()` checks several related cases while identifying which input failed. It is useful when one rule should work for a group of values.

```python run
import unittest

def triple(value):
    return value * 3

class TripleTests(unittest.TestCase):
    def test_samples(self):
        for number, expected in [(2, 6), (5, 15), (-1, -3)]:
            with self.subTest(number=number):
                self.assertEqual(triple(number), expected)

suite = unittest.defaultTestLoader.loadTestsFromTestCase(TripleTests)
result = unittest.TestResult()
suite.run(result)
print(result.testsRun, result.wasSuccessful())
```

```output
1 True
```

The framework counts this as one test method containing three subtests. If one case fails, its `number` value is included in the failure detail.

### Run a test suite from a terminal

For a saved test file, the unittest module can discover and run tests from the command line. The exact file layout depends on your project; tests are often placed in a file or folder whose name begins with `test`.

```bash
python3.12 -m unittest test_prices.py
```

Sample output for a passing file with two tests:

```output
..
----------------------------------------------------------------------
Ran 2 tests in 0.000s

OK
```

The dots represent passing tests. A failure report identifies the test and shows the assertion that did not match. The displayed output was captured from Python 3.12.11; elapsed time can vary on another run.

### Keep tests independent

Each test should arrange its own input and should not depend on another test having run first. Independent tests can be run in a different order and fail for a specific behavior instead of a hidden setup assumption.

```python run
def normalize_tag(tag):
    return tag.strip().lower()

assert normalize_tag("  Python ") == "python"
assert normalize_tag(" MUSIC") == "music"
print("Normalization checks passed")
```

```output
Normalization checks passed
```

Both calls provide their own input. The first test does not need to set a global variable that the second test reads. This makes the checks easy to repeat and move into a test class later.

### Test a returned collection

An assertion can check the complete result of a function, including its order and number of values.

```python run
def top_three(values):
    return sorted(values, reverse=True)[:3]

assert top_three([11, 28, 16, 34]) == [34, 28, 16]
print("Ranking check passed")
```

```output
Ranking check passed
```

The test would catch a function that sorts in ascending order or forgets to limit the result to three items. Choose an expected value precise enough to reveal the behavior you care about.

## What Python is doing behind the scenes

An `assert` statement evaluates its condition. If it is true, execution continues; if it is false, Python raises `AssertionError`, optionally with the supplied message. Assertions can be disabled when Python is run with optimization, so they should not be used for essential input validation or security checks.

`unittest` discovers methods whose names begin with `test` when it builds a test suite from a `TestCase` class. Its assertion methods record a failed test with useful context rather than stopping the whole suite at the first mismatch. A test runner presents the result after the cases have run.

| Tool | Best fit |
|---|---|
| `assert condition` | A quick development check or invariant |
| `TestCase.assertEqual(a, b)` | Compare expected and actual values |
| `TestCase.assertTrue(value)` | Require a true result |
| `TestCase.assertRaises(Type)` | Require a specific exception |
| `subTest(...)` | Identify a failing case in a related group |
| `python -m unittest` | Run tests from a terminal |

Tests prove only the cases they check. A passing test suite does not prove that a program has no defects, but thoughtful test cases make important behavior less likely to regress. File-based test discovery is one way to organize checks; details about files are covered in **Reading and writing files**.

## Common mistakes

### Testing the implementation instead of its behavior

Prefer checks on what a function returns or changes, not the exact temporary variable names used inside it. A good test survives a harmless rewrite that preserves the same behavior.

### Checking only one ordinary input

Include likely boundaries, empty inputs when permitted, and invalid cases. A single typical example may miss an off-by-one error or an unhandled special value.

### Using assert for user input validation

Assertions may be disabled with optimization and are intended to catch programmer assumptions. Validate user-provided data with normal conditions and a deliberate response.

### Writing tests that depend on each other

One test should not require another test to create its data first. Arrange needed values inside each test so tests can run independently.

### Confusing a passing sample with full correctness

A test covers only its chosen input and assertion. Add cases that distinguish plausible bugs and review whether the test actually checks the behavior you intended.

## Cheat sheet

| Goal | Example |
|---|---|
| Quick condition | `assert total == 50` |
| Add a failure note | `assert ready, "setup incomplete"` |
| Define a test group | `class PriceTests(unittest.TestCase):` |
| Compare values | `self.assertEqual(actual, expected)` |
| Check truth | `self.assertTrue(condition)` |
| Expect an error | `with self.assertRaises(ValueError):` |
| Run a module's tests | `python3.12 -m unittest` |

## Try it yourself

### Easy: check a conversion

Use an assertion to check that minutes convert to two hours and five remaining minutes.

```python run
def split_minutes(total):
    return total // 60, total % 60

assert split_minutes(125) == (2, 5)
print("Time conversion passed")
```

```output
Time conversion passed
```

:::solution

The tuple compares both returned values in one assertion. The example passes because 125 minutes contains two full hours and five minutes.

:::

### Medium: test a boundary

Check that a temperature warning begins at 30 degrees, not below.

```python run
def warning(temp):
    return temp >= 30

assert warning(29) is False
assert warning(30) is True
print("Boundary checks passed")
```

```output
Boundary checks passed
```

:::solution

The two assertions distinguish `>=` from `>`. Testing the threshold itself catches a common comparison error.

:::

### Challenge: test an exception

Write a unittest case that verifies a function rejects an empty username with `ValueError`.

```python run
import unittest

def validate_username(name):
    if name == "":
        raise ValueError("username is empty")
    return name

class UsernameTests(unittest.TestCase):
    def test_empty_name(self):
        with self.assertRaises(ValueError):
            validate_username("")

suite = unittest.defaultTestLoader.loadTestsFromTestCase(UsernameTests)
result = unittest.TestResult()
suite.run(result)
print(result.wasSuccessful())
```

```output
True
```

:::solution

`assertRaises(ValueError)` passes when the call raises that exception type. If it returns normally, the test fails.

:::

## Recap

- Assertions compare actual behavior with an expected condition.
- `unittest.TestCase` organizes named, repeatable tests.
- Test normal cases, boundaries, and expected errors.
- Keep tests independent and focused on observable behavior.
- A passing suite is evidence for tested cases, not proof that all cases are correct.

Reference: Python documentation, unittest — Unit testing framework
