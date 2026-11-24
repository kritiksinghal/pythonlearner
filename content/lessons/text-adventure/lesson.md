---
title: "Text adventure"
curriculumTitle: "Text adventure"
track: "Python from zero"
module: "M9 Projects"
order: 46
level: "Intermediate"
type: project
summary: "Build a short branching adventure using variables, decisions, and reusable functions."
prerequisites:
  - "async and await basics"
learningGoals:
  - "Represent a scene and player state with variables"
  - "Use conditions to create meaningful story branches"
  - "Organize repeated story actions into functions"
  - "Test a complete play path with simulated choices"
relatedProblems: []
---

## The goal

Build a small text adventure in which a traveler explores an old observatory during a storm. The player starts at the entrance, chooses one route, finds or misses a brass key, and then decides whether to open the rooftop door. The program should show a different ending depending on the route and whether the key was found.

This is a focused first version of an adventure game. It uses variables to remember the player's location and inventory, conditions to choose what happens, and functions to keep story actions organized. The runnable examples use preset choices so they work in the browser without calling `input()`.

## What you will practice

- **State**: information the program remembers while the story runs
- **Branching**: choosing one path based on a condition
- **Functions**: named actions that keep repeated story code together
- **Lists**: a simple inventory that can hold discovered items
- **Testing**: changing preset choices to confirm more than one ending works

The project stays within these topics. Loops are used only if you choose to extend the game; loop behavior was covered in **while loops** and **for loops and range()**. Classes and file saving are separate topics and are not needed for this version.

## Plan

1. Choose a scene description and store the player's current location.
2. Create an empty inventory list.
3. Store a route choice in a variable and branch on it.
4. Update the location and add an item when the story says the player found it.
5. Use a function to describe the final door interaction.
6. Run the program with a few preset choices and check each ending.

Before you write code, decide what the player can do and what each result means. A small adventure with two clear choices is easier to debug than a large map with many unfinished branches. A good first game has a complete beginning, a meaningful choice, and an ending that reflects the player's actions.

## Build it step by step

### Store the starting state

The player begins at the observatory entrance with no items. Store the location and inventory separately so later story choices can update them.

```python run
location = "observatory entrance"
inventory = []
print(f"You arrive at the {location}.")
print(f"Inventory: {inventory}")
```

```output
You arrive at the observatory entrance.
Inventory: []
```

The string records where the player is, while the list can hold found objects. Starting with an empty list is useful because the player has not picked anything up yet.

### Branch on a route choice

The route choice is preset as `"gallery"` for this runnable example. In a real interactive game, the player would choose a route. The if/else block updates the location and tells the story for that route.

```python run
route = "gallery"
if route == "gallery":
    location = "star gallery"
    print("You enter the star gallery.")
else:
    location = "weather stairs"
    print("You climb the weather stairs.")
print(f"Location: {location}")
```

```output
You enter the star gallery.
Location: star gallery
```

The condition selects exactly one branch. Changing `route` to another expected value changes the story output, which is a quick way to test both paths.

### Add a found item to the inventory

When the player finds the brass key, append it to the inventory. Use `in` later to check whether it was collected.

```python run
inventory = []
found_key = True
if found_key:
    inventory.append("brass key")
    print("A brass key glints beneath the telescope.")
print(inventory)
```

```output
A brass key glints beneath the telescope.
['brass key']
```

The Boolean `found_key` stands in for the result of a story choice. The condition adds the key only when that value is true. Later, a full game could derive this state from more choices.

### Put a story action in a function

A function keeps the door logic in one place. It accepts the inventory and returns the result text so the caller can decide how to display it.

```python run
def rooftop_ending(items):
    if "brass key" in items:
        return "The door opens, revealing a clear patch of stars."
    return "The locked door rattles in the wind."

bag = ["brass key"]
print(rooftop_ending(bag))
```

```output
The door opens, revealing a clear patch of stars.
```

The function checks whether the needed item is present. Returning a string keeps story logic separate from printing and makes the result easy to test.

### Combine state and choices

This complete first version uses preset variables to simulate player input. Run it as written, then change `route` or `found_key` to test other paths.

```python run
def rooftop_ending(items):
    if "brass key" in items:
        return "The roof opens to a clear sky. You win."
    return "The door stays locked. The storm sends you back inside."

route = "gallery"
found_key = route == "gallery"
inventory = []

print("Observatory at midnight")
if route == "gallery":
    print("You cross the star gallery.")
else:
    print("You climb the weather stairs.")

if found_key:
    inventory.append("brass key")
    print("You pick up a brass key.")

print(rooftop_ending(inventory))
```

```output
Observatory at midnight
You cross the star gallery.
You pick up a brass key.
The roof opens to a clear sky. You win.
```

The preset route controls whether the key is found, and the ending checks the inventory. Change `route` to `"stairs"` and run again to see the locked-door ending. The branching is simple, but it gives the state a visible effect.

### Try real input in a terminal

The following version uses `input()` so a person can choose a route. Keep it in a plain Python block because the browser runnable blocks do not accept interactive input. Save the code in a file and run it from a terminal.

```python
route = input("Choose gallery or stairs: ").strip().lower()
inventory = []

if route == "gallery":
    inventory.append("brass key")
    print("You find the brass key.")
else:
    print("You reach the roof without a key.")

if "brass key" in inventory:
    print("The roof opens. You win.")
else:
    print("The door stays locked.")
```

Sample session:

```text
Choose gallery or stairs: gallery
You find the brass key.
The roof opens. You win.
```

The `.strip().lower()` calls let entries such as ` Gallery ` and `GALLERY` use the same branch. The sample session shows one route; type `stairs` to try the other. The saved terminal version can be run with `python3.12 adventure.py`.

### Test the alternate route

Before you add extra scenes, run each expected route. In a preset example, test by assigning a different value to `route` and checking the printed ending. If you add a third route, add a matching condition and a test case for it.

```python run
route = "stairs"
inventory = []
if route == "gallery":
    inventory.append("brass key")
if "brass key" in inventory:
    print("Door opens")
else:
    print("Door remains locked")
```

```output
Door remains locked
```

The empty inventory leads to the locked ending. This catches a common bug where a program always gives the player the key, no matter which path they chose.

### Add another meaningful state change

You can track whether the player turned on a telescope. This adds a distinct outcome without introducing a new structure.

```python run
route = "gallery"
looked_through_telescope = True
if route == "gallery" and looked_through_telescope:
    print("You notice a map etched around the lens.")
else:
    print("The map remains hidden in the dark.")
```

```output
You notice a map etched around the lens.
```

The condition combines two facts about the story. Keep state variables named for what they mean, such as `looked_through_telescope`, rather than using unclear names like `x`.

## The complete program

This version gives the player a simulated route choice, remembers an item, and ends with a result based on the inventory. Change the preset `route` value to test an alternative. The program is deliberately small enough to understand from top to bottom.

```python run
def ending(items):
    if "brass key" in items:
        return "The rooftop opens. You map the stars and escape the storm."
    return "The rooftop stays locked. You wait safely until morning."

route = "gallery"  # Change to "stairs" to test the other route.
inventory = []

print("THE MIDNIGHT OBSERVATORY")
print("Rain drums against the entrance.")

if route == "gallery":
    print("You cross the star gallery.")
    inventory.append("brass key")
    print("A brass key rests beside the telescope.")
elif route == "stairs":
    print("You climb the weather stairs.")
    print("A gust pushes the rooftop door shut.")
else:
    print("That route is not available.")

print(ending(inventory))
```

```output
THE MIDNIGHT OBSERVATORY
Rain drums against the entrance.
You cross the star gallery.
A brass key rests beside the telescope.
The rooftop opens. You map the stars and escape the storm.
```

The function `ending()` uses the inventory to choose a conclusion. The route branch controls whether the key is added. In a longer version, each scene can be a function that returns the next location or a message, but avoid adding structure until the small game works.

## Make it yourself

Start by changing the story setting and items while keeping the same program shape. Then add one new state variable and make it affect an ending. Try these extensions in order:

1. Replace the observatory with a lighthouse, train station, or mountain cabin.
2. Add a second item and require both items for a special ending.
3. Add a third route with a distinct location and message.
4. Add a health or clue variable and use it in a decision.
5. Turn the preset route into `input()` only in a plain Python terminal version.

As you extend the story, keep a small table of possible state values and outcomes. Test each branch with preset variables first, then use real input for play. If the program behaves unexpectedly, print the state immediately before the final condition and compare it with the route you chose.

Do not add random events until you can test the fixed routes. Randomness makes the output change between runs and can hide a bug. The `random` module was introduced in **A tour of the standard library**; one sentence about it is enough for this project.

Reference: Python documentation, More Control Flow Tools
