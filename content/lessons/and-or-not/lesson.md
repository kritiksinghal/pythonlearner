---
title: "and, or, not"
curriculumTitle: "and, or, not"
track: "Python from zero"
module: "M2 Making decisions"
order: 9
level: "Beginner"
summary: "Combine boolean conditions using logical operators: evaluate truth tables for and, or, not, master short-circuit evaluation, and apply De Morgan's laws."
prerequisites:
  - "what-is-programming-and-python"
  - "your-first-program-with-print"
  - "variables-and-types"
  - "numbers-and-math"
  - "text-strings"
  - "talking-to-the-user-with-input-and-f-strings"
  - "true-false-and-comparisons"
  - "making-decisions-with-if"
learningGoals:
  - "Combine multiple conditional checks using Python's plain-English logical operators: `and`, `or`, and `not`."
  - "Evaluate truth tables and predict boolean outcomes across compound expressions."
  - "Explain the performance and safety benefits of **short-circuit evaluation** in `and` and `or` expressions."
  - "Structure complex business rules using parentheses to override default operator precedence."
relatedProblems: []
---
## What you will learn

- How Python uses plain English keywords **`and`**, **`or`**, and **`not`** rather than cryptic symbols like `&&`, `||`, and `!`.
- The formal truth tables governing conjunction (`and`), disjunction (`or`), and logical inversion (`not`).
- The strict operator precedence hierarchy: how `not` binds first, followed by `and`, and finally `or`.
- How **short-circuit evaluation** optimizes execution and protects code from runtime exceptions like division by zero or index errors.
- How Python's logical operators return actual operand values rather than raw booleans, enabling elegant default fallbacks.
- Applying De Morgan's Laws to simplify and invert complex nested decision logic cleanly.
- Avoiding the classic beginner trap of writing `if x == 1 or 2:` and understanding why it always evaluates to truth.

## Why this matters

Real-world decisions rarely depend on a single, isolated question. In human life and commercial software, actions depend on a confluence of multiple interrelated conditions. A commercial airline flight reservation engine cannot confirm a booking simply because seats remain available; the passenger's payment must be approved **and** their passport must remain valid for at least six months **and** their name must not appear on an international travel restriction registry. A smart home security system triggers an audible alarm if motion sensors detect intrusion **or** window glass-break sensors trip, but only if the resident has **not** placed the system into maintenance mode.

Without logical operators, expressing compound rules would require deeply nested pyramids of repetitive `if` statements. Mastering `and`, `or`, and `not` allows you to express sophisticated multi-factor business rules, security permissions, and filtering criteria in clean, elegant, and readable sentences that mirror natural human speech.

## The big idea

Imagine an ancient stone fortress guarded by a secure drawbridge and an outer moat. The drawbridge gate is fitted with two independent iron locks operated by two different officers: the Fortress Commander and the Watch Captain. 

Consider how different defense protocols might control access:
1. **The Conjunction Protocol (`and`)**: Under strict wartime lockdown, the drawbridge lowers only if the Commander inserts their key **and** the Watch Captain inserts their key. If either officer is absent, or if both keys are missing, the drawbridge stays firmly raised. Both conditions must hold simultaneously for passage.
2. **The Disjunction Protocol (`or`)**: During daytime peacetime commerce, the fortress lowers the drawbridge if a recognized merchant presents a valid trade charter **or** if an arriving diplomat presents an official royal seal. If either credential is valid—or if an arriving party possesses both—the drawbridge lowers. Only if an arriving traveler lacks both credentials is entry denied.
3. **The Inversion Protocol (`not`)**: The watchtower guard sounds an emergency horn only if an approaching legion is **not** flying the national friendly banner. The `not` operator takes whatever status is observed and flips it: truth becomes falsehood, and falsehood becomes truth.

In Python, `and`, `or`, and `not` are the exact digital keys governing your program's flow. They connect individual comparison checks into compound logical expressions that evaluate the overall truth of complex situations.

## Step by step

### 1. Conjunction with `and`: both conditions must hold

The `and` operator combines two expressions and returns `True` only when both operands evaluate to `True`. If either operand is `False`, the entire expression evaluates to `False`.

```python run
has_ticket = True
has_id = True
can_board = has_ticket and has_id
print("Has ticket:", has_ticket)
print("Has government ID:", has_id)
print("Allowed to board flight:", can_board)
```

```output
Has ticket: True
Has government ID: True
Allowed to board flight: True
```

In line 3, Python inspects `has_ticket` (which is `True`) and `has_id` (which is `True`). Because both sub-conditions evaluate to truth, `can_board` receives `True`. If either variable had been set to `False`, the flight boarding permission would evaluate to `False`.

### 2. Disjunction with `or`: at least one condition must hold

The `or` operator combines two expressions and returns `True` if at least one operand evaluates to `True`. It returns `False` only when both operands are simultaneously `False`.

```python run
is_weekend = False
is_public_holiday = True
can_sleep_in = is_weekend or is_public_holiday
print("Is weekend:", is_weekend)
print("Is holiday:", is_public_holiday)
print("Can sleep in today:", can_sleep_in)
```

```output
Is weekend: False
Is holiday: True
Can sleep in today: True
```

In line 3, `is_weekend` is `False`, but `is_public_holiday` is `True`. Because at least one of the conditions is satisfied, the `or` expression evaluates to `True`, confirming that the sleeper can remain in bed.

### 3. Logical inversion with `not`

The unary operator `not` inverts any boolean expression. It flips `True` into `False`, and `False` into `True`.

```python run
is_raining = False
go_for_jog = not is_raining
print("Is it raining:", is_raining)
print("Go for morning jog:", go_for_jog)
```

```output
Is it raining: False
Go for morning jog: True
```

On line 2, `not is_raining` inverts the boolean value `False` into `True`. The runner determines that since precipitation is absent, morning exercise may proceed.

### 4. Combining multiple logical checks: vehicle rental rules

You can chain multiple operators together to enforce multifaceted domain policies. Python evaluates expressions following strict precedence rules.

```python run
age = 24
has_driving_license = True
has_speeding_ticket = False
can_rent_car = age >= 21 and has_driving_license and not has_speeding_ticket
print("Renter age:", age)
print("Eligible for premium car rental:", can_rent_car)
```

```output
Renter age: 24
Eligible for premium car rental: True
```

Line 4 combines three tests: `age >= 21` (which evaluates to `True`), `has_driving_license` (`True`), and `not has_speeding_ticket` (`not False` evaluates to `True`). Because all three components are `True`, the entire policy check succeeds.

### 5. Short-circuit evaluation and default values

Python's logical operators feature an optimization called **short-circuit evaluation**:
- In `A and B`, if `A` is `False`, Python immediately halts and returns `A` without ever evaluating `B`, because the outcome cannot possibly become `True`.
- In `A or B`, if `A` is `True`, Python immediately halts and returns `A` without evaluating `B`, because the outcome is already guaranteed to be `True`.

Furthermore, Python's `or` and `and` operators return the actual operand value, allowing developers to set elegant default fallback values.

```python run
user_nickname = ""
fallback_name = "PlayerOne"
active_name = user_nickname or fallback_name
print("Resolved display name:", active_name)
```

```output
Resolved display name: PlayerOne
```

Because an empty string `""` is falsy, the `or` operator moves to the second operand and evaluates `fallback_name`, returning `'PlayerOne'` directly. If `user_nickname` had contained `'Slayer'`, Python would have stopped at `user_nickname` and returned it immediately.

### 6. Overriding precedence with parentheses: academic honors

Operator precedence dictates that `not` evaluates first, followed by `and`, followed by `or`. Mixing `and` and `or` without parentheses can lead to severe logical discrepancies. Always use parentheses to make your intentions explicit.

```python run
score = 85
attendance = 92
has_warning = False
is_honors = (score >= 80 or attendance >= 95) and not has_warning
print("Honors candidate:", is_honors)
```

```output
Honors candidate: True
```

In line 4, the parenthesized expression `(score >= 80 or attendance >= 95)` evaluates first. Because `score >= 80` is `True`, the parenthesized group evaluates to `True`. Then `True and not False` evaluates to `True`. Without parentheses, `attendance >= 95 and not has_warning` would have bound together first due to operator precedence.

### 7. Commercial promotion rules: e-commerce shipping

Logical operators allow concise implementation of customer discount and shipping thresholds where multiple alternate pathways qualify a buyer for a benefit.

```python run
cart_total = 750
is_vip_member = True
free_shipping = cart_total >= 1000 or is_vip_member
print("Cart total: ₹", cart_total, sep="")
print("Qualifies for zero-cost delivery:", free_shipping)
```

```output
Cart total: ₹750
Qualifies for zero-cost delivery: True
```

Even though the cart subtotal of 750 rupees falls short of the general 1000 rupee threshold, the customer's VIP membership satisfies the secondary branch of the `or` statement, granting free delivery.

### 8. De Morgan's Laws: simplifying inverted logic

Named after British mathematician Augustus De Morgan, De Morgan's Laws describe the mathematical equivalence of negated compound expressions:
1. `not (A and B)` is mathematically identical to `not A or not B`
2. `not (A or B)` is mathematically identical to `not A and not B`

```python run
flag_a = True
flag_b = False
print("not (flag_a and flag_b):", not (flag_a and flag_b))
print("not flag_a or not flag_b:", not flag_a or not flag_b)
```

```output
not (flag_a and flag_b): True
not flag_a or not flag_b: True
```

Both forms produce identical boolean outcomes (`True`). Understanding this transformation allows developers to convert awkward double-negatives into clean, straightforward positive conditions.

## What Python is doing behind the scenes

When Python compiles `and` and `or` expressions into bytecode, it does not use a function call. Instead, it generates conditional jump instructions in the virtual machine that implement short-circuiting:

| Expression Structure | Bytecode Instruction Generated | Virtual Machine Short-Circuit Behavior |
| :--- | :--- | :--- |
| `A and B` | `JUMP_IF_FALSE_OR_POP` | If `A` is falsy, keeps `A` on stack and jumps over `B`. Otherwise pops `A` and evaluates `B`. |
| `A or B` | `JUMP_IF_TRUE_OR_POP` | If `A` is truthy, keeps `A` on stack and jumps over `B`. Otherwise pops `A` and evaluates `B`. |
| `not A` | `TO_BOOL`, `UNARY_NOT` | Converts `A` to boolean truth value, then inverts the bit. |

This architectural mechanism guarantees that if evaluating `B` would cause a fatal crash (such as division by zero or an uninitialized object lookup), placing a protective check in `A` completely prevents `B` from executing when `A` fails.

## Common mistakes

### 1. The classic `x == 1 or 2` syntax trap

A very common mistake among beginners is writing `if x == 1 or 2:`. The programmer intends to ask "is x equal to 1 or 2?", but Python parses this as `(x == 1) or (2)`. Because any non-zero number like `2` is always truthy, this condition evaluates to `True` every single time, regardless of what `x` is!

Broken code:
```python
x = 99
if x == 1 or 2:
    print("x is either 1 or 2!")
```

Actual output:
```output
x is either 1 or 2!
```

How to fix it: write out both full comparisons explicitly, or use the `in` operator (covered in collections):
```python run
x = 99
is_one_or_two = x == 1 or x == 2
print("Is x equal to 1 or 2:", is_one_or_two)
```

```output
Is x equal to 1 or 2: False
```

### 2. Forgetting precedence between `and` and `or`

Because `and` has higher precedence than `or`, writing `A or B and C` means `A or (B and C)`. If you intended `(A or B) and C`, omitting parentheses creates a subtle logic defect that produces incorrect calculations.

Broken code:
```python
has_coupon = True
cart_total = 50
has_member_card = False
valid_deal = has_coupon or cart_total >= 100 and has_member_card
print("Deal valid:", valid_deal)
```

Actual output:
```output
Deal valid: True
```

How to fix it: always use explicit parentheses to clarify intended evaluation order:
```python run
has_coupon = True
cart_total = 50
has_member_card = False
valid_deal = (has_coupon or cart_total >= 100) and has_member_card
print("Correctly scoped deal valid:", valid_deal)
```

```output
Correctly scoped deal valid: False
```

### 3. Redundant comparisons to boolean literals

Writing `if is_valid == True:` or `if is_valid == False:` is considered unpythonic. It adds clutter without improving readability.

Broken / Unpythonic code:
```python
is_logged_in = True
if is_logged_in == True:
    print("User is authenticated")
```

How to fix it: inspect the boolean variable directly, or use `not` for negative checks:
```python run
is_logged_in = True
if is_logged_in:
    print("User is authenticated cleanly")
if not is_logged_in:
    print("User must sign in")
```

```output
User is authenticated cleanly
```

## Cheat sheet

| Expression | Evaluates To True When | Truth Table Summary |
| :--- | :--- | :--- |
| `A and B` | Both `A` and `B` are truthy | `T and T -> T`, all other combinations `False` |
| `A or B` | At least one of `A` or `B` is truthy | `F or F -> F`, all other combinations `True` |
| `not A` | `A` is falsy | `not False -> True`, `not True -> False` |
| `A or default` | `A` if `A` is truthy, else `default` | Fallback pattern for empty strings or None |
| `not (A and B)` | Either `not A` or `not B` is true | De Morgan's 1st Law |
| `not (A or B)` | Both `not A` and `not B` are true | De Morgan's 2nd Law |

Precedence order from highest to lowest: `not` → `and` → `or`. Parentheses `()` override all.

## Try it yourself

### Exercise 1 (easy): Movie ticket concession discount

Use `patron_age` to check whether the patron is under 12 or at least 65. Store the result in `gets_discount`. Print the result exactly as shown in Expected output.


:::tip Hint
Use the lesson idea about and or not. Trace the sample values before printing so you can check each step.
:::

```sample input
patron_age = 68
```

```expected
Patron age 68 gets discount: True
```

```python run
# Complete the Exercise 1 (easy): Movie ticket concession discount task.
patron_age = 68
# Write your code below
```


:::solution Solution
Combine the two age boundary conditions using the `or` operator:

```python run
patron_age = 68
gets_discount = patron_age < 12 or patron_age >= 65
print(f"Patron age {patron_age} gets discount:", gets_discount)
```

```output
Patron age 68 gets discount: True
```
:::

### Exercise 2 (medium): Home mortgage loan approval

Use `annual_income`, `credit_score`, and `prior_default` to decide whether the loan is approved. Store the result in `loan_approved`. Print the result exactly as shown in Expected output.


:::tip Hint
Use the lesson idea about and or not. Trace the sample values before printing so you can check each step.
:::

```sample input
annual_income = 62000
credit_score = 740
prior_default = False
```

```expected
Mortgage loan approved: True
```

```python run
# Complete the Exercise 2 (medium): Home mortgage loan approval task.
annual_income = 62000
credit_score = 740
prior_default = False
# Write your code below
```


:::solution Solution
Join the two `>=` comparisons with `and` and invert the default flag using `not prior_default`:

```python run
annual_income = 62000
credit_score = 740
prior_default = False
loan_approved = annual_income >= 50000 and credit_score >= 700 and not prior_default
print("Mortgage loan approved:", loan_approved)
```

```output
Mortgage loan approved: True
```
:::

### Exercise 3 (challenge): Two-factor security authentication

Use `password_valid`, `biometric_ok`, `otp_ok`, and `account_locked` to decide access. Store the result in `access_granted`. Print the result exactly as shown in Expected output.


:::tip Hint
Use the lesson idea about and or not. Trace the sample values before printing so you can check each step.
:::

```sample input
password_valid = True
otp_ok = True
biometric_ok = False
account_locked = False
```

```expected
Portal access granted: True
```

```python run
# Complete the Exercise 3 (challenge): Two-factor security authentication task.
password_valid = True
otp_ok = True
biometric_ok = False
account_locked = False
# Write your code below
```


:::solution Solution
Wrap `(biometric_ok or otp_ok)` in parentheses and combine with `password_valid` and `not account_locked` using `and`:

```python run
password_valid = True
otp_ok = True
biometric_ok = False
account_locked = False
access_granted = password_valid and (biometric_ok or otp_ok) and not account_locked
print("Portal access granted:", access_granted)
```

```output
Portal access granted: True
```
:::

## Recap

- Python uses readable English words (`and`, `or`, `not`) for logical operations.
- `A and B` is `True` only when both operands evaluate to truth.
- `A or B` is `True` when at least one operand evaluates to truth.
- `not A` inverts the truth value of its operand.
- Operator precedence evaluates `not` first, then `and`, then `or`; use parentheses to make your grouping clear.
- **Short-circuit evaluation** stops evaluating compound expressions as soon as the definitive outcome is established.
- Avoid the `x == 1 or 2` trap by writing both comparison operands explicitly.

Reference: Python documentation, Boolean Operations — and, or, not
