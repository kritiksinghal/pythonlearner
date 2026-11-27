---
title: "Loops"
curriculumTitle: "Loops"
track: "CS50P"
module: "Week 2 Loops"
order: 3
level: "Beginner"
summary: "Repeat work with while and for loops, range, lists, dictionaries, break, and continue."
prerequisites:
  - "conditionals"
learningGoals:
  - "Choose between a while loop and a for loop"
  - "Use range while accounting for its excluded stop value"
  - "Visit list items and dictionary keys"
  - "Use break and continue to control a loop"
relatedProblems: []
---
## What you will learn

- What an iteration is and how a loop repeats a block
- How `while` checks a condition before each round
- How `for` visits values from `range` or a collection
- How lists use numeric positions and dictionaries use keys
- How `break` exits a loop and `continue` skips to its next round

## Why this matters

Programs often repeat a small operation for many values: recording each delivery, reviewing every player in a squad, or checking a sequence of measurements. Writing a separate statement for each item is slow to change and easy to make inconsistent. A loop lets one block handle a series of values. A `for` loop is useful when the values to visit are already described, while a `while` loop is useful when repetition depends on a condition that can change. Knowing when each round begins and ends helps prevent missing work, extra work, and loops that never finish.

## The big idea

A loop has a body, the indented statements that run repeatedly. Each pass through that body is an **iteration**. A `for` loop obtains one next value and runs the body with it. A `while` loop tests its condition; if the result is true, it runs the body and then checks again. In either case, the loop ends when there are no more values or its condition becomes false, unless `break` ends it sooner.

For a `while` loop, identify what can change the condition and confirm it changes on every needed path. For a `for` loop using `range`, remember that its stop value is excluded. These two checks explain many beginner loop bugs. Lists and dictionaries can also be visited one item at a time, so the loop can work with stored data rather than a manually written series of statements.

## Step by step

### Repeat while a counter remains above zero

The `while` condition is tested before the body each time. Here a counter decreases on every round, so the loop eventually reaches zero and ends.

```python run
remaining = 4
while remaining > 0:
    print("Over left: " + str(remaining))
    remaining -= 1
```

```output
Over left: 4
Over left: 3
Over left: 2
Over left: 1
```

Once `remaining` becomes zero, `remaining > 0` is false, so no fifth round begins. The update belongs inside the body because it is the step that moves the condition toward false.

### Use a for loop when you know the rounds

When the number of repetitions is known, `range` supplies a series of integers to a `for` loop. `range(4)` supplies zero through three, which means four rounds.

```python run
for round_number in range(4):
    print("Warm-up round", round_number + 1)
```

```output
Warm-up round 1
Warm-up round 2
Warm-up round 3
Warm-up round 4
```

The variable receives one value on each iteration. Adding one changes the displayed numbering; the values supplied by the range still begin at zero.

### Start range at a chosen value

Give `range` a start and stop when zero is not the first desired value. The stop remains excluded, so stop at one number past the final value you want.

```python run
for over in range(1, 5):
    print("Over", over)
```

```output
Over 1
Over 2
Over 3
Over 4
```

`range(1, 5)` contains 1, 2, 3, and 4. It does not contain 5. If a loop prints one fewer item than expected, inspect the stop value first.

### Visit a list directly

A list keeps several values in order. A `for` loop can name each value as it visits it, without using a numeric index.

```python run
playlist = ["Raag Yaman", "Monsoon Beat", "Final Encore"]
for track in playlist:
    print("Queue:", track)
```

```output
Queue: Raag Yaman
Queue: Monsoon Beat
Queue: Final Encore
```

The loop body runs once for each list item. The loop variable `track` refers to the current item for that round, then takes the next item on the following round.

### Use a list index when position matters

List positions start at zero. A position is useful when the program needs a particular item or needs to display a position alongside each item.

```python run
venues = ["East Ground", "Riverside Park", "School Oval"]
print(venues[0])
print(len(venues))
```

```output
East Ground
3
```

Index zero is the first entry, and `len` reports the number of entries. Do not confuse the first position with the count of items: three items have indexes 0, 1, and 2.

### Add an item before looping

The list method `append` adds a value to the end. A later loop sees that item as part of the list.

```python run
captains = ["Asha", "Dev"]
captains.append("Ira")
for captain in captains:
    print(captain)
```

```output
Asha
Dev
Ira
```

The list is updated before iteration begins, so the loop visits all three values in order.

### Visit dictionary keys

A dictionary connects keys to values. Iterating directly over a dictionary visits its keys; use the current key to look up the corresponding value.

```python run
medals = {"Mira": "gold", "Kabir": "silver", "Tenzin": "bronze"}
for athlete in medals:
    print(athlete, "earned", medals[athlete])
```

```output
Mira earned gold
Kabir earned silver
Tenzin earned bronze
```

The variable `athlete` takes each key in turn. `medals[athlete]` finds the value associated with that key. A key that is not in the dictionary cannot be looked up this way; check that the key is present before relying on it.

### Leave early with break

Use `break` when a loop has found what it needs or a stop condition has occurred. It exits the innermost loop immediately.

```python run
for ticket in ["silver", "gold", "gold", "bronze"]:
    if ticket == "gold":
        print("Found a gold ticket")
        break
    print("Checking", ticket)
```

```output
Checking silver
Found a gold ticket
```

After the `break`, the remaining list values are not visited. The print after the condition only runs for a ticket that was not gold.

### Skip one round with continue

`continue` skips the remaining statements in the current iteration, then proceeds to the next value or condition check.

```python run
for delivery in ["ready", "delayed", "ready"]:
    if delivery == "delayed":
        continue
    print("Send:", delivery)
```

```output
Send: ready
Send: ready
```

Only the delayed round is skipped. The loop still processes the later value. Use `continue` when the loop should go on but one item should not use the rest of the body.

### Combine a while loop and break

An intentional open-ended loop can use `break` as its exit door. This pattern is appropriate when the loop should continue until a condition is detected inside the body.

```python run
signals = ["wait", "wait", "go", "wait"]
position = 0
while True:
    signal = signals[position]
    if signal == "go":
        print("Cross now")
        break
    print("Keep waiting")
    position += 1
```

```output
Keep waiting
Keep waiting
Cross now
```

The loop checks each signal. When it reaches `go`, it prints the action and exits before incrementing the position. This example has a finite list; a real loop should also account for reaching the end if the exit signal may never appear.

### Skip unsuitable values in a while loop

Update the state before continuing, so the next iteration makes progress. Otherwise a skipped round could repeat the same value forever.

```python run
attempts = [0, -3, 6, 8]
index = 0
while index < len(attempts):
    value = attempts[index]
    index += 1
    if value < 0:
        continue
    print("Recorded", value)
```

```output
Recorded 0
Recorded 6
Recorded 8
```

The index increases before a negative value triggers `continue`. Thus the next condition checks a new list position rather than repeating the same negative entry.

### Use an underscore for an unused range value

Sometimes the loop only needs to repeat a known number of times and does not need the current number. The conventional `_` name shows that the value is intentionally unused.

```python run
for _ in range(3):
    print("Mix the paint")
```

```output
Mix the paint
Mix the paint
Mix the paint
```

The loop still receives values from `range`; the body simply has no use for them. This is clearer than inventing a counter that never appears in the body.

## What Python is doing behind the scenes

At the start of a `while` iteration, Python evaluates its condition. If it is true, Python executes the indented statements from top to bottom. Then it returns to the condition. When the condition is false, it moves to the first statement after the loop. Any variable that controls the condition needs a planned update along every path that should continue.

A `for` loop requests values from its iterable one at a time. A `range` describes a sequence of integers without requiring the body to manually calculate each next value. A list provides its stored items in order. A dictionary loop supplies its keys, which can then be used to retrieve each associated value. When there are no values left, the loop finishes.

`break` changes the normal exit path by ending the loop immediately. `continue` ends only the current iteration, so control returns to the next loop value or, for `while`, the next condition check. These statements do not mean the same thing: one stops the repetition, and the other keeps the repetition going while skipping some work.

## Common mistakes

### Forgetting the while update

If the condition variable stays unchanged, a true condition stays true and the loop may never stop. Trace the variable through one full iteration and check that it moves toward the stopping condition.

### Expecting range to include its stop

The stop value is not generated. For four values beginning with one, use `range(1, 5)`, not `range(1, 4)`. Count the values rather than assuming the endpoints are both included.

### Treating list positions as one-based

The first list position is zero. If a list has three entries, valid positions are 0, 1, and 2. A request for the position equal to the list length is past the end.

### Assuming a dictionary loop gives values

Direct iteration produces keys. Use the key to retrieve its value, and make sure the key exists. Asking for a missing key raises `KeyError` instead of silently supplying a value.

### Confusing break and continue

Use `break` when the repetition should finish. Use `continue` when only the current round should be skipped and later rounds still matter. Put the statement after any update that must happen before the next check.

## Cheat sheet

| Need | Example |
|---|---|
| Repeat while a condition is true | `while ready:` |
| Visit each known integer | `for n in range(4):` |
| Start at a value and stop before another | `range(2, 7)` |
| Visit every list item | `for item in items:` |
| Read an item by position | `items[0]` |
| Visit dictionary keys | `for key in mapping:` |
| Exit now | `break` |
| Skip this round | `continue` |

## Try it yourself

### Easy: print a practice rotation

Use a `for` loop to visit each drill in order. Print the result exactly as shown in Expected output.


:::tip Hint
Use the lesson idea about loops. Trace the sample values before printing so you can check each step.
:::

```sample input
drills = ['serve', 'footwork', 'return']
```

```expected
Next drill: serve
Next drill: footwork
Next drill: return
```

```python run
# Complete the Easy: print a practice rotation task.
drills = ['serve', 'footwork', 'return']
# Write your code below
```


:::solution
The loop receives each list item as `drill`. The body prints once for each item, in list order.

```python
drills = ['serve', 'footwork', 'return']
drills = ["serve", "footwork", "return"]
for drill in drills:
    print("Next drill:", drill)
```
:::

### Medium: count down to a song cue

Use a `while` loop that updates its counter each round. Print the result exactly as shown in Expected output.


:::tip Hint
Use the lesson idea about loops. Trace the sample values before printing so you can check each step.
:::

```sample input
seconds = 3
```

```expected
3
2
1
Play
```

```python run
# Complete the Medium: count down to a song cue task.
seconds = 3
# Write your code below
```


:::solution
Each pass subtracts one until the condition becomes false. The final message sits after the loop, so it appears once the countdown ends.

```python
seconds = 3
while seconds > 0:
    print(seconds)
    seconds -= 1
print("Play")
```
:::

### Challenge: find a player's team

Use `teams` and `search_name` as the sample data. Loop through a dictionary's keys and stop after the requested player is found. Print the result exactly as shown in Expected output.


:::tip Hint
Use the lesson idea about loops. Trace the sample values before printing so you can check each step.
:::

```sample input
teams = {'Sana': 'Falcons', 'Rohan': 'Tigers', 'Leela': 'Owls'}
search_name = 'Rohan'
```

```expected
Tigers
```

```python run
# Complete the Challenge: find a player's team task.
teams = {'Sana': 'Falcons', 'Rohan': 'Tigers', 'Leela': 'Owls'}
search_name = 'Rohan'
# Write your code below
```


:::solution
The loop visits each dictionary key. When it matches `search_name`, the program prints that key's value and exits the loop.

```python
teams = {'Sana': 'Falcons', 'Rohan': 'Tigers', 'Leela': 'Owls'}
search_name = 'Rohan'
teams = {"Sana": "Falcons", "Rohan": "Tigers", "Leela": "Owls"}
search_name = "Rohan"
for player in teams:
    if player == search_name:
        print(teams[player])
        break
```
:::

## Recap

- Use `while` when a changing condition controls repetition and `for` to visit known values.
- `range` includes its start and excludes its stop.
- Lists are visited item by item; their numeric positions start at zero.
- A dictionary loop visits keys, which can retrieve their values.
- `break` exits the loop, while `continue` skips only the current iteration.

Based on Harvard's CS50P
Reference: Python documentation, Compound statements
