---
title: "Bank account with classes"
curriculumTitle: "Bank account with classes"
track: "Python from zero"
module: "M9 Projects"
order: 49
level: "Intermediate"
type: project
summary: "Build a small bank account class with deposit, withdrawal, and balance behavior."
prerequisites:
  - "Quiz game"
learningGoals:
  - "Represent account state in an instance"
  - "Use methods to deposit and withdraw funds"
  - "Reject invalid amounts without changing the balance"
  - "Test account actions with preset values"
relatedProblems: []
---

## The goal

Create a `BankAccount` class that stores an owner's name and balance, accepts deposits, and processes withdrawals. The account should reject zero or negative transaction amounts and should not allow a withdrawal larger than the balance. The runnable version uses preset transactions and never calls `input()`; the terminal version with real input appears as plain Python with a sample session.

For this learning project, store money as an integer number of cents. This avoids introducing decimal rounding questions while you practice classes and methods. A production financial system requires stronger rules and reliable storage than this example provides.

## What you will practice

- **Class state**: keep one account's owner and balance on its instance.
- **Methods**: group deposit and withdrawal operations with the account.
- **Conditions**: check that an amount is valid and affordable.
- **Return values**: report whether an operation succeeded.
- **Testing**: use preset actions to verify both successful and rejected transactions.

The project covers only this small account model. User authentication and persistent transaction history are outside its scope. Lists, files, and other topics are introduced elsewhere in the curriculum.

## Plan

1. Define `BankAccount` and initialize owner and starting cents.
2. Add a method to deposit a positive amount.
3. Add a method to withdraw only when funds are sufficient.
4. Return a success result without hiding why an action was rejected.
5. Run a preset transaction sequence and inspect the final balance.
6. Try real prompts in a terminal after the class behavior is tested.

Keep the balance in cents internally, such as `8250` for 82 dollars and 50 cents. A display helper converts the integer into a readable dollar string. This avoids using binary floating-point values for the simple arithmetic in this lesson. The class starts with an explicit balance so each test can control its initial conditions.

## Build it step by step

### Store account data in an instance

The initializer sets up an owner and balance for each new account. Values are in cents, so the starting amount is an integer.

```python run
class BankAccount:
    def __init__(self, owner, balance_cents=0):
        self.owner = owner
        self.balance_cents = balance_cents

account = BankAccount("Lata", 8250)
print(account.owner, account.balance_cents)
```

```output
Lata 8250
```

Each instance owns its own balance. The default lets a new account start at zero, while tests can supply a known balance directly.

### Display the balance as currency

Use integer division and remainder to separate dollars and cents. The formatting keeps the cents two digits wide.

```python run
def display_cents(amount):
    dollars = amount // 100
    cents = amount % 100
    return f"${dollars}.{cents:02d}"

print(display_cents(8250))
```

```output
$82.50
```

The stored value stays an integer. The formatted string is for display only and should not be used for arithmetic.

### Deposit a positive amount

The deposit method checks that the amount is greater than zero before updating the balance. It returns `True` when the transaction is accepted.

```python run
class BankAccount:
    def __init__(self, owner, balance_cents=0):
        self.owner = owner
        self.balance_cents = balance_cents

    def deposit(self, amount_cents):
        if amount_cents <= 0:
            return False
        self.balance_cents += amount_cents
        return True

account = BankAccount("Nikhil", 2500)
print(account.deposit(1200), account.balance_cents)
```

```output
True 3700
```

The check happens before the update. A rejected amount leaves the balance unchanged, and the caller can use the returned Boolean to show a message.

### Reject a non-positive deposit

Test the boundary case directly. Zero cents is not a useful deposit in this project, and a negative deposit should not reduce the balance through the deposit operation.

```python run
class BankAccount:
    def __init__(self, owner, balance_cents=0):
        self.owner = owner
        self.balance_cents = balance_cents

    def deposit(self, amount_cents):
        if amount_cents <= 0:
            return False
        self.balance_cents += amount_cents
        return True

account = BankAccount("Mira", 900)
accepted = account.deposit(0)
print(accepted, account.balance_cents)
```

```output
False 900
```

The account balance remains 900 cents. This test checks both the return value and the state, because checking only the return could miss an accidental balance change.

### Withdraw only when funds are available

The withdrawal method rejects a non-positive amount and an amount larger than the balance. Otherwise, it subtracts cents and reports success.

```python run
class BankAccount:
    def __init__(self, owner, balance_cents=0):
        self.owner = owner
        self.balance_cents = balance_cents

    def withdraw(self, amount_cents):
        if amount_cents <= 0 or amount_cents > self.balance_cents:
            return False
        self.balance_cents -= amount_cents
        return True

account = BankAccount("Aarohi", 5000)
print(account.withdraw(1750), account.balance_cents)
```

```output
True 3250
```

The check prevents the balance from becoming negative. An actual banking product would need more rules, but this project keeps the account behavior small and visible.

### Check an insufficient-funds attempt

Try to withdraw more than the available cents. The method should return `False` and keep the original balance.

```python run
class BankAccount:
    def __init__(self, owner, balance_cents=0):
        self.owner = owner
        self.balance_cents = balance_cents

    def withdraw(self, amount_cents):
        if amount_cents <= 0 or amount_cents > self.balance_cents:
            return False
        self.balance_cents -= amount_cents
        return True

account = BankAccount("Javed", 1400)
accepted = account.withdraw(2000)
print(accepted, account.balance_cents)
```

```output
False 1400
```

The account has 1400 cents, so the 2000-cent withdrawal is rejected. No partial withdrawal occurs. The balance is unchanged, which makes the method's contract predictable.

### Add a method that returns a readable balance

Put the display behavior on the account so callers do not need to reach into the field and format it themselves.

```python run
class BankAccount:
    def __init__(self, owner, balance_cents=0):
        self.owner = owner
        self.balance_cents = balance_cents

    def formatted_balance(self):
        dollars = self.balance_cents // 100
        cents = self.balance_cents % 100
        return f"${dollars}.{cents:02d}"

account = BankAccount("Sana", 12345)
print(account.formatted_balance())
```

```output
$123.45
```

This method reads the current balance and returns a display string. It does not change the stored cents.

### Run a preset transaction sequence

The account methods can be tested without interactive input. This sequence deposits 12 dollars, withdraws 5 dollars, then tries an amount the account cannot cover.

```python run
class BankAccount:
    def __init__(self, owner, balance_cents=0):
        self.owner = owner
        self.balance_cents = balance_cents

    def deposit(self, amount_cents):
        if amount_cents <= 0:
            return False
        self.balance_cents += amount_cents
        return True

    def withdraw(self, amount_cents):
        if amount_cents <= 0 or amount_cents > self.balance_cents:
            return False
        self.balance_cents -= amount_cents
        return True

    def formatted_balance(self):
        dollars = self.balance_cents // 100
        cents = self.balance_cents % 100
        return f"${dollars}.{cents:02d}"

account = BankAccount("Devika", 4000)
results = [account.deposit(1200), account.withdraw(500), account.withdraw(9000)]
print(results)
print(account.formatted_balance())
```

```output
[True, True, False]
$47.00
```

The first two actions succeed, while the last is rejected. The remaining balance is 4700 cents, or 47 dollars. Preset transactions make the result repeatable for verification.

## The complete program

This browser-safe version simulates transactions with fixed values. It checks each method's result and prints the final balance. Change the transaction values to explore other cases; the runnable code does not use `input()`.

```python run
class BankAccount:
    def __init__(self, owner, balance_cents=0):
        self.owner = owner
        self.balance_cents = balance_cents

    def deposit(self, amount_cents):
        if amount_cents <= 0:
            return False
        self.balance_cents += amount_cents
        return True

    def withdraw(self, amount_cents):
        if amount_cents <= 0 or amount_cents > self.balance_cents:
            return False
        self.balance_cents -= amount_cents
        return True

    def formatted_balance(self):
        dollars = self.balance_cents // 100
        cents = self.balance_cents % 100
        return f"${dollars}.{cents:02d}"

account = BankAccount("Sanjana", 4000)
account.deposit(1200)
account.withdraw(500)
account.withdraw(9000)
print(f"{account.owner}: {account.formatted_balance()}")
```

```output
Sanjana: $47.00
```

The methods protect the account state by validating an amount before changing the balance. In an interactive terminal program, prompt for a transaction and call the same methods. Keep input handling outside the class so the class can be tested with preset values.

```python
account = BankAccount("Sanjana", 4000)
action = input("Choose deposit or withdraw: ").strip().lower()
amount_cents = int(input("Amount in cents: "))

if action == "deposit":
    accepted = account.deposit(amount_cents)
elif action == "withdraw":
    accepted = account.withdraw(amount_cents)
else:
    accepted = False

if accepted:
    print(account.formatted_balance())
else:
    print("Transaction was not accepted")
```

Sample session: at the action prompt enter `deposit`; at the amount prompt enter `250`; the program displays `$42.50` for the starting balance shown. In the saved terminal program, include the class definition above this interaction.

## Make it yourself

Test the two rejected cases separately: a non-positive amount and an amount larger than the balance. Also test a withdrawal exactly equal to the balance; it should leave the account at zero if that is your chosen rule.

```python run
# Try one improvement from the project list below.
# Sample data: amount_cents = 1250, balance_cents = 5000
# Write your code below and print the result
```

1. Add a method to transfer money between two accounts.
2. Add a transaction message for accepted and rejected actions.
3. Reject malformed amounts in the terminal interface with `try` and `except`.
4. Add a monthly fee as an explicit method.
5. Store an account activity list only after the balance rules are correct.

When adding a transfer, avoid subtracting from the first account until the second account can accept the deposit. This keeps the operation from losing money halfway through. The class should remain responsible for its own state, while the terminal code handles prompts and messages.

The integer-cents model keeps this example straightforward, but it is not a complete financial system. Real products need exact currency rules, durable records, security, and audit controls. This project is for practicing object state and methods only.

Reference: Python documentation, Classes
