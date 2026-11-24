# Lecture 5: Unit Tests

<aside>
🧠

**Big idea:** testing is checking your homework before you hand it in. Write small tests once, and `pytest` re-checks your code in a second, every time you change it.

</aside>

## 🧠 Understand it first

A test is a small, repeatable question about your code: “When I give this function this input, does it return the expected answer?” An `assert` states what should be true. If it is false, the test fails and points you toward a problem.

Functions that return results are easier to test than code that immediately asks for input and prints everything. Test ordinary cases, boundaries, and invalid inputs. pytest finds tests by their names, runs them, and summarizes which checks passed or failed. A test does not magically fix a bug; it gives you evidence while you fix it.

![A visual guide to Lecture 5: how tests compare expected and actual results.](Lecture%205%20Unit%20Tests/cs50p-lecture-5-tests-visual.svg)

A visual guide to Lecture 5: how tests compare expected and actual results.

### 🔍 What a tiny test actually checks

```python
def square(number):
    return number * number

def test_square():
    assert square(3) == 9
```

1. The test calls the real function with a known input, `3`.
2. The function returns `9`.
3. `assert actual == expected` passes because both sides are equal. If they differ, the test fails and points you to the broken expectation.

Then add edge cases: `square(0)`, a negative number, and any input your program promises to support. Tests are small repeatable experiments, not proof that every possible input is correct.

<aside>
🛑

**Oops!** A test that only checks what a function prints is harder to reuse. Put the calculation in a function that returns a result, then let `main()` handle prompts and display. pytest discovers test files and functions whose names begin with `test_`.

</aside>

## 📝 Notes

### 1. `assert`

`assert` says “this must be True”. If it is False, Python raises an `AssertionError`.

```python
assert square(2) == 4
```

### 2. Code you can test

```python
# calculator.py
def main():
    x = int(input('x: '))
    print('x squared is', square(x))

def square(n):
    return n * n

if __name__ == '__main__':
    main()
```

### 3. Tests with `pytest`

```bash
pip install pytest
```

```python
# test_calculator.py
import pytest
from calculator import square

def test_positive():
    assert square(2) == 4
    assert square(3) == 9

def test_negative():
    assert square(-2) == 4

def test_zero():
    assert square(0) == 0

def test_str():
    with pytest.raises(TypeError):
        square('cat')
```

Run them with `pytest test_calculator.py`. Test names must start with `test_`. Passing tests show green dots, failing tests show what went wrong.

### 4. What to test

| Kind of case | Example for `square` |
| --- | --- |
| Normal | `2`, `3` |
| Edge | `0`, negative numbers, very large numbers |
| Bad input | a string like `'cat'` should raise `TypeError` |

### 5. Test a whole folder

Put tests in a `test` folder with an empty `__init__.py` file inside, then run `pytest test`.

### 6. Docstrings

```python
def square(n):
    """Return n multiplied by itself."""
    return n * n
```

A **docstring** explains what a function does. It sits right under the `def` line.

## 📖 Key definitions

| Term | Simple meaning |
| --- | --- |
| Unit test | A small test of one function |
| `assert` | Raises an error if its condition is False |
| `pytest` | A tool that finds and runs your tests |
| Edge case | An unusual input such as 0, empty text or a negative |
| `pytest.raises` | Checks that a specific error is raised |
| Docstring | A description written inside a function |

## ⚠️ Common mistakes

- Mixing `input()` and `print()` into the function you want to test.
- Naming test files or functions without the `test_` prefix, so pytest ignores them.
- Testing only the happy path and skipping edge cases.
- Forgetting `if __name__ == '__main__':`, so importing the file starts the program.

## 🧑‍💻 Programming questions

- 🧑‍💻 P1. **is_even.** Write `is_even(n)` and three pytest tests for it: even, odd and zero.
    
    💡 Hint: the function goes in `even.py`, the tests in `test_even.py`.
    
    ```python
    # even.py
    def is_even(n):
        return n % 2 == 0
    ```
    
    ```python
    # test_even.py
    from even import is_even
    
    def test_even():
        assert is_even(4)
    
    def test_odd():
        assert not is_even(7)
    
    def test_zero():
        assert is_even(0)
    ```
    
- 🧑‍💻 P2. **Shorten.** Write `shorten(word)` that removes all vowels, keeping other letters as they are. Test lower case and upper case.
    
    💡 Hint: loop through the letters and skip vowels.
    
    ```python
    def shorten(word):
        return ''.join(c for c in word if c.lower() not in 'aeiou')
    
    def test_shorten():
        assert shorten('Twitter') == 'Twttr'
        assert shorten('HELLO') == 'HLL'
        assert shorten('') == ''
    ```
    
- 🧑‍💻 P3. **Error test.** Write a test proving that `int('cat')` raises `ValueError`.
    
    💡 Hint: `with pytest.raises(...)`.
    
    ```python
    import pytest
    
    def test_bad_int():
        with pytest.raises(ValueError):
            int('cat')
    ```
    
- 🧑‍💻 P4. **Percentage function.** Write `convert(fraction)` that turns `'1/4'` into `25`. Raise `ValueError` for bad text and `ZeroDivisionError` if the denominator is 0. Add tests.
    
    💡 Hint: `split('/')` and let `int()` raise the errors.
    
    ```python
    # fuel.py
    def convert(fraction):
        x, y = fraction.split('/')
        return round(int(x) / int(y) * 100)
    ```
    
    ```python
    # test_fuel.py
    import pytest
    from fuel import convert
    
    def test_normal():
        assert convert('1/4') == 25
    
    def test_zero_denominator():
        with pytest.raises(ZeroDivisionError):
            convert('1/0')
    
    def test_bad_text():
        with pytest.raises(ValueError):
            convert('cat/dog')
    ```
    
- 🧑‍💻 P5. **Refactor for testing.** This code is hard to test: `def add(): print(int(input('a: ')) + int(input('b: ')))`. Rewrite it so it can be tested.
    
    💡 Hint: separate the calculation from the input and output.
    
    ```python
    def add(a, b):
        return a + b
    
    def main():
        print(add(int(input('a: ')), int(input('b: '))))
    
    if __name__ == '__main__':
        main()
    
    def test_add():
        assert add(2, 3) == 5
    ```
    

## 🎯 MCQs

- 🎯 Q1. What happens when an `assert` condition is False? (A) nothing (B) AssertionError is raised (C) it prints False (D) the file is deleted
    
    **Answer: (B).**
    
- 🎯 Q2. Which tool does CS50P use to run tests? (A) pytest (B) pip (C) sys (D) random
    
    **Answer: (A).**
    
- 🎯 Q3. A test function name must start with: (A) check_ (B) run_ (C) test_ (D) assert_
    
    **Answer: (C).**
    
- 🎯 Q4. Why keep `input()` out of the function you test? (A) it is illegal (B) tests can call the function directly without waiting for typing (C) it is slower (D) pytest cannot read input
    
    **Answer: (B).**
    
- 🎯 Q5. Which is an edge case for `square(n)`? (A) 2 (B) 3 (C) 0 (D) 5
    
    **Answer: (C).** Zero and negatives are unusual values worth testing.
    

## ✅ Quick recap

- Tests check your functions automatically with `assert`.
- Keep logic in functions that return values, and I/O in `main()`.
- Test normal cases, edge cases and bad input.
- Run `pytest` and make sure all tests pass before you move on.