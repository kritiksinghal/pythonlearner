with open("content/lessons/true-false-and-comparisons/lesson.md") as f:
    text = f.read()

extra_why = """
Furthermore, in modern database-driven applications and web development, relational checks serve as the primary defensive shield guarding against corrupted records and unauthorized actions. When a customer submits an order on an e-commerce platform, the application executes a series of comparison checks: verifying that inventory quantity is strictly greater than zero, ensuring the customer's shipping postal code conforms to geographic length requirements, and confirming that the total payable amount matches the sum of individual basket items plus applicable municipal taxes. If any single comparison evaluates to `False`, the transaction is safely rejected before any bank card is charged or warehouse dispatch notice is generated.
"""

extra_big_idea = """
### Boolean algebra: the mathematical foundation of digital computers

To understand why boolean logic is so central to computer programming, it helps to appreciate its historical origins. In 1854, English mathematician and philosopher George Boole published *An Investigation of the Laws of Thought*, introducing an algebraic system in which variables take only two mathematical values: truth (`1`) and falsehood (`0`). Instead of ordinary numerical operations like addition and subtraction, boolean algebra operates using logical conjunction (`AND`), disjunction (`OR`), and negation (`NOT`). 

A century later, computer engineering pioneers realized that electrical switches—first vacuum tubes, and later microscopic silicon transistors on microchips—could physically embody Boole's algebra. A transistor either permits electrical current to flow (representing high voltage, or `1`, or `True`), or it blocks current (representing low voltage, or `0`, or `False`). Every central processing unit, graphics accelerator, and mobile phone processor in existence is an intricate network of billions of microscopic logic gates evaluating boolean expressions at the speed of light. When you write a comparison in Python like `score >= 50`, you are directly commanding this foundational architecture.
"""

mistake_4 = """
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
"""

text = text.replace("## Why this matters\n", "## Why this matters\n" + extra_why)
text = text.replace("## The big idea\n", "## The big idea\n" + extra_big_idea)
text = text.replace("## Cheat sheet\n", mistake_4 + "\n## Cheat sheet\n")

with open("content/lessons/true-false-and-comparisons/lesson.md", "w") as f:
    f.write(text)

import re
body_no_code = re.sub(r"```[\s\S]*?```", "", text)
cleaned = re.sub(r"<[^>]+>", " ", body_no_code)
cleaned = re.sub(r":::[a-zA-Z]+[^\n]*", " ", cleaned)
cleaned = re.sub(r":::", " ", cleaned)
words = [w for w in cleaned.split() if w and not w.startswith("#")]
print("Updated clean word count:", len(words))
