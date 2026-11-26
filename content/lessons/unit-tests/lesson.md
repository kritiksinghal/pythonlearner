---
title: "Unit tests"
curriculumTitle: "Unit tests"
track: "CS50P"
module: "Week 5 Unit Tests"
order: 6
level: "Beginner"
runnableMin: 3
summary: "Check small functions with assert and organize repeatable checks with pytest."
prerequisites:
  - "libraries"
learningGoals:
  - "Write assertions about expected function results"
  - "Separate testable logic from input and output"
  - "Test ordinary, edge, and invalid cases"
  - "Recognize pytest discovery naming and raises checks"
relatedProblems: []
---

## What you will learn

- What a unit test checks and how `assert` reports a failed expectation
- Why small functions that return values are easier to test
- How to cover normal values, boundaries, and invalid inputs
- How pytest finds test files and functions
- How a docstring records a function's purpose

## Why this matters

Changing a function can fix one example while breaking another. A repeatable test lets you check an expected result again after a change. Instead of manually running the program and deciding whether a printed line looks right, you can state a condition that must hold. Tests are especially useful for a small reusable function because the same function can be tried with many values. A test does not prove that every possible input works, but it supplies concrete evidence about the cases you chose to check.

## The big idea

A unit test asks a focused question about one unit of code, often a function. An `assert` statement says that an expression should be true. If it is false, Python raises `AssertionError`; if it is true, execution continues without displaying a success message. You can test returned results directly, which is why separating a calculation from prompts and printed output makes a program easier to test.

pytest is a tool that discovers and runs tests. The notes describe test files and functions whose names begin with `test_`. A good set of checks includes an ordinary case, edge cases such as zero or a negative number, and an invalid input when the function promises to handle it. A test makes a failure visible; the programmer still has to understand and fix the cause.

## Step by step

### Write a function that returns a result

The function under test should perform its calculation and return an answer. Keeping a prompt outside it lets a test call the function directly.

```python run
def cube(number):
    return number * number * number

print(cube(3))
```

```output
27
```

The function accepts a value and gives a result back. A test can compare that returned value to an expected answer without waiting for someone to type.

### Use assert for a passing check

An assertion is an executable expectation. If the expression is true, the program continues; it does not print a line just to announce success.

```python run
def cube(number):
    return number * number * number

assert cube(2) == 8
print("check completed")
```

```output
check completed
```

The expected answer matches the function result, so the assertion passes and the next line runs. If the expression were false, Python would raise `AssertionError` and stop before that print.

### Check several ordinary values

One test function can contain several assertions about one behavior. Each line adds another example that should remain correct.

```python run
def double(value):
    return value * 2

assert double(6) == 12
assert double(15) == 30
print("two ordinary cases checked")
```

```output
two ordinary cases checked
```

Both results match their expectations. Multiple cases reduce the chance that a function only happens to work for one chosen input.

### Include a boundary value

An edge case is a value that deserves special attention, such as zero or a negative number. Check it explicitly rather than assuming the ordinary examples cover it.

```python run
def square(value):
    return value * value

assert square(0) == 0
assert square(-5) == 25
print("edge cases checked")
```

```output
edge cases checked
```

The function behaves consistently for zero and a negative input. The test states both expectations, so a later change that mishandles either value will be visible.

### Keep input and output in a separate main function

The notes separate the reusable calculation from a `main` function that handles interaction. A caller can test `square` without starting the interactive part.

```python run
def square(value):
    return value * value

def main():
    value = 7
    print("Squared:", square(value))

assert square(7) == 49
main()
```

```output
Squared: 49
```

The assertion calls the calculation directly. `main` demonstrates how user-facing code can call that same function and print its result. In a script, an `if __name__ == "__main__":` guard can keep `main()` from starting when the file is imported for testing.

### Give test functions discoverable names

pytest looks for function names that begin with `test_`. A clear name helps describe the case being checked.

```python run
def format_score(score):
    return f"Score: {score}"

def test_format_score():
    assert format_score(88) == "Score: 88"

test_format_score()
print("format test completed")
```

```output
format test completed
```

The function name starts with the prefix used by pytest discovery. In this browser example, it is called directly so the code can run without the pytest package installed.

### Test that an invalid value raises an error

The notes use pytest's `raises` helper to state that a particular exception is expected. Here is a plain Python demonstration of the behavior that such a test would check.

```python run
def square(value):
    return value * value

try:
    square("rain")
except TypeError:
    print("invalid type was rejected")
```

```output
invalid type was rejected
```

The function raises `TypeError` for text, and the demonstration catches it. In a pytest test, `with pytest.raises(TypeError):` checks that the call raises that expected type. This plain example verifies the function behavior without requiring the pytest package.

### Understand test discovery

pytest runs test files and test functions according to their names. The notes use files such as `test_calculator.py` and functions such as `test_positive`. A function with a different name may not be discovered automatically. Keep the test file beside the module it imports or place tests in the course's described test folder, with an empty `__init__.py` file inside that folder.

```bash
python3.12 -m pytest test_calculator.py
No module named pytest
```

The command asks pytest to run one named test file. The output above is a sample of what Python reports before pytest is installed; it was reproduced by the base Python 3.12 interpreter used for this lesson. Install pytest into the same environment before expecting the test command to succeed.

### Install pytest before using it

pytest is a package rather than one of the standard modules listed in the earlier lessons. The notes show installing it with `pip`, then running the test command.

```bash
python3.12 -m pip install pytest
```

The installation command depends on network access and the active Python environment. I installed pytest 9.2.0 in a temporary Python 3.12.11 environment and ran the four tests in `test_calculator.py` there. A successful run produced:

```bash
python3.12 -m pytest -q test_calculator.py
```

Sample output from that temporary environment (the duration varies):

```output
....                                                                     [100%]
4 passed in 0.00s
```

### Add a docstring to explain the function

A docstring is a short description placed immediately beneath the function header. It records what the function is intended to do.

```python run
def half_total(total):
    """Return half of the supplied total."""
    return total / 2

assert half_total(90) == 45
print("documented function checked")
```

```output
documented function checked
```

The docstring belongs to the definition and explains its behavior. The assertion independently checks one expected result; a description and a test serve related but different purposes.

### Check that a bad integer conversion raises ValueError

Tests can focus on an error that should happen for a particular input. This example handles the exception so the surrounding lesson block can show that it occurred.

```python run
try:
    int("eleven-ish")
except ValueError:
    print("conversion rejected the text")
```

```output
conversion rejected the text
```

The value is not an integer spelling, so the conversion raises `ValueError`. pytest can make this expectation concise with `pytest.raises(ValueError)`.

## What Python is doing behind the scenes

An `assert expression` evaluates the expression. When it is true, execution moves to the next statement. When it is false, Python raises `AssertionError`. This makes a failed expectation visible rather than requiring a person to inspect a result manually.

pytest discovers matching test files and functions, then runs their statements and summarizes the outcome. Tests that assert returned values can call a function repeatedly with different inputs. When a program combines input, calculation, and printing in one function, tests must also deal with interaction. Splitting those responsibilities leaves a calculation that can be called with a chosen value and an outer function that handles the prompt and display.

## Common mistakes

### Testing only one ordinary case

A single successful result says little about boundaries or invalid values. Include cases such as zero, negative values, or text if those values are relevant to the function's promise.

### Putting input inside the tested calculation

A test should supply a known argument and inspect a return value. Keep prompting in `main()` so test code can call the calculation directly.

### Naming tests so discovery misses them

pytest relies on names beginning with `test_` in the notes' examples. Use that prefix for both test files and functions intended for discovery.

### Forgetting that a test reports rather than repairs

An assertion tells you that the observed behavior differs from an expectation. Read the case, determine whether the function or the expectation is wrong, then make the correction and run the checks again.

## Cheat sheet

| Need | Pattern |
|---|---|
| State an expected result | `assert function(value) == expected` |
| Check an edge case | Add a separate assertion for that value |
| Test a function that returns | Call it directly from the test |
| Make a discoverable test | Name it `test_...` |
| Expect a particular error in pytest | `with pytest.raises(ValueError):` |
| Document a function | Put a docstring under `def` |
| Run a test file | `python3.12 -m pytest test_file.py` |

## Try it yourself

### Easy: test a distance conversion

Write and check a function that doubles a distance reading.

```python run
# Complete the test a distance conversion task.
# Sample data: distance = 8
# Write your code below and print the result
```


:::solution
The function returns twice the supplied number, and the assertion checks the expected result for 8.

```python
def double_distance(distance):
    return distance * 2

assert double_distance(8) == 16
print("distance check passed")
```
:::

### Medium: include zero and a negative value

Check a function on two values that are not both typical positive inputs.

```python run
# Complete the include zero and a negative value task.
# Sample data: distances = [0, -3]
# Write your code below and print the result
```


:::solution
The tests explicitly cover zero and a negative number, so both cases are checked rather than inferred from a positive input.

```python
def absolute_square(value):
    return value * value

assert absolute_square(0) == 0
assert absolute_square(-4) == 16
print("boundary checks passed")
```
:::

### Challenge: separate calculation and display

Write a function that returns a total, then test the function without prompting.

```python run
# Complete the separate calculation and display task.
# Sample data: prices = [12, 8, 5]
# Write your code below and print the result
```


:::solution
The calculation accepts values as arguments and returns a result. A separate main function could prompt and print, while this assertion checks the logic directly.

```python
def total_with_fee(price, fee):
    return price + fee

assert total_with_fee(240, 18) == 258
print("fee calculation checked")
```
:::

## Recap

- `assert` states an expectation and raises `AssertionError` when it is false.
- Functions that return results are easier to test than functions tied to prompts.
- Test ordinary values, edges, and invalid cases the function promises to handle.
- pytest discovers names beginning with `test_`; its successful execution needs the package installed.
- Docstrings explain a function, while assertions check its behavior.

Based on Harvard's CS50P
Reference: Python documentation, The assert statement
