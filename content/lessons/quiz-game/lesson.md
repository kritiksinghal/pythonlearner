---
title: "Quiz game"
curriculumTitle: "Quiz game"
track: "Python from zero"
module: "M9 Projects"
order: 48
level: "Beginner"
type: project
summary: "Build a multiple-choice game that checks answers and reports a final score."
prerequisites:
  - "To-do list with files"
learningGoals:
  - "Represent questions and choices with dictionaries and lists"
  - "Compare a response with the expected answer"
  - "Track points and give clear feedback"
  - "Test a round with preset responses"
relatedProblems: []
---

## The goal

Build a small multiple-choice quiz game about music. The game displays a prompt and choices, checks the player's letter, adds a point for a correct response, and prints a final score. Browser runnable examples use preset answers so the verifier can run them without waiting for interactive input. A plain Python block later shows how to collect a real answer with `input()` and includes a sample session.

The first version has two questions and a score from zero to two. It focuses on getting the question, comparison, and scoring flow right. Add categories or a saved leaderboard only after the core loop works.

## What you will practice

- **Structured data**: keep each prompt, its options, and its answer together.
- **Iteration**: visit questions one after another.
- **Conditions**: compare a response with the answer key.
- **Functions**: separate display and answer-checking behavior.
- **Testing**: use preset answers to check perfect and partial scores.

The quiz stores answers as lowercase letters `a`, `b`, `c`, and `d`. It normalizes a response with `.strip().lower()` before comparing, so extra spaces and uppercase letters do not create accidental wrong answers. Account systems and random question selection are outside this project.

The game uses one point per question so the score is easy to explain. The answer key is kept in the question data rather than inside the scoring loop. That way, changing the wording or order does not require editing a separate list of correct letters. The design also makes it easy to add another question without changing the scoring rule.

## Plan

1. Create a list of question dictionaries with consistent keys.
2. Display each prompt and show its choices with letter labels.
3. Normalize the player's answer before checking it.
4. Add one point when the response matches the answer key.
5. Print the score after the last question.
6. Test a perfect run, a mixed run, and a run with no correct answers.

Use descriptive keys such as `prompt`, `choices`, and `answer`. A consistent data shape means the same functions can process every question. If a question has four choices, its answer should be one of the four letters. You can validate question data before starting the round.

## Build it step by step

### Create one question record

Keep the question and its answer in one dictionary so they stay together if you reorder the quiz.

```python run
question = {"prompt": "Which instrument commonly has six strings?", "choices": ["violin", "guitar", "flute", "trumpet"], "answer": "b"}
print(question["answer"])
```

```output
b
```

The correct answer is the label for the second choice. The choices remain a list, and the dictionary keys explain each part.

### Put questions in a list

Use the same keys for every question. One loop can then display and score the whole collection.

```python run
questions = [
    {"prompt": "Which instrument has six strings?", "choices": ["violin", "guitar", "flute", "trumpet"], "answer": "b"},
    {"prompt": "Which symbol marks a pause?", "choices": ["rest", "scale", "chord", "key"], "answer": "a"},
]
print(len(questions))
```

```output
2
```

The list length is also the maximum possible score when each question is worth one point.

### Label choices with letters

Use an index to pair each choice with a letter. This example displays the second option.

```python run
choices = ["violin", "guitar", "flute", "trumpet"]
labels = "abcd"
print(f"{labels[1]}) {choices[1]}")
```

```output
b) guitar
```

The second choice has index one, and index one in the label string is `b`. In the complete display function, a loop prints every pair.

### Normalize and check a response

Return `True` when the normalized response matches the answer key and `False` otherwise.

```python run
def is_correct(question, response):
    return response.strip().lower() == question["answer"]

item = {"answer": "b"}
print(is_correct(item, " B "))
```

```output
True
```

The function accepts uppercase input with surrounding spaces. It does not display feedback or change the score, so those jobs stay separate.

### Add points from preset answers

Use a list of responses to simulate a player. This round has one right response and one wrong response.

```python run
answer_key = ["b", "a"]
responses = ["b", "d"]
score = 0
for response, answer in zip(responses, answer_key):
    if response.strip().lower() == answer:
        score += 1
print(score)
```

```output
1
```

Each match adds one point. The complete program compares each response with the corresponding question dictionary.

### Display a question with a function

Put the prompt and choice display in one function. This compact display line keeps the example output easy to inspect.

```python run
def show_question(question):
    print(question["prompt"])
    print(" | ".join(question["choices"]))

sample = {"prompt": "Which symbol marks silence?", "choices": ["rest", "scale", "chord", "key"], "answer": "a"}
show_question(sample)
```

```output
Which symbol marks silence?
rest | scale | chord | key
```

The choices appear in one line here. A full console game can put each option on a separate line and show its letter, as the complete terminal version may do.

### Give feedback for each answer

The scoring function returns one point for a correct response and zero otherwise. The main loop can add that value to its running total.

```python run
def is_correct(question, response):
    return response.strip().lower() == question["answer"]

def points_for(question, response):
    if is_correct(question, response):
        print("Correct")
        return 1
    print(f"Answer: {question['answer']}")
    return 0

print(points_for({"answer": "c"}, "c"))
```

```output
Correct
1
```

Keeping answer checking separate makes it easier to test without reading printed text. Another design could return a Boolean and add one in the loop; either is fine if the meaning stays clear.

### Test a mixed round

Preset responses let you verify scoring without interactive input. Uppercase `B` still matches after normalization.

```python run
def is_correct(question, response):
    return response.strip().lower() == question["answer"]

questions = [{"answer": "b"}, {"answer": "a"}, {"answer": "b"}]
responses = ["b", "d", "B"]
score = sum(is_correct(question, response) for question, response in zip(questions, responses))
print(f"Final score: {score}/{len(questions)}")
```

```output
Final score: 2/3
```

This checks a correct response, an incorrect response, and capitalization handling. Change every response to a wrong letter to confirm that zero is possible.

## The complete program

This complete browser-safe program shows two questions, checks preset answers, and reports the result. Change `responses` to test a perfect round or a zero-score round. No runnable block calls `input()`.

```python run
questions = [
    {"prompt": "Which instrument has six strings?", "choices": ["violin", "guitar", "flute", "trumpet"], "answer": "b"},
    {"prompt": "Which symbol marks a pause?", "choices": ["rest", "scale", "chord", "key"], "answer": "a"},
]
responses = ["b", "d"]

def show_question(question):
    print(question["prompt"])
    print(" | ".join(question["choices"]))

def check_answer(question, response):
    return response.strip().lower() == question["answer"]

score = 0
for question, response in zip(questions, responses):
    show_question(question)
    if check_answer(question, response):
        score += 1
print(f"Final score: {score}/{len(questions)}")
```

```output
Which instrument has six strings?
violin | guitar | flute | trumpet
Which symbol marks a pause?
rest | scale | chord | key
Final score: 1/2
```

For a terminal game, collect each response during the loop instead of reading from a preset list. Keep the question definitions and helper functions above this interactive section.

```python
score = 0
for question in questions:
    show_question(question)
    response = input("Choose a, b, c, or d: ").strip().lower()
    if check_answer(question, response):
        print("Correct")
        score += 1
    else:
        print(f"Answer: {question['answer']}")
print(f"Final score: {score}/{len(questions)}")
```

Sample session for a one-question quiz: `Which instrument has six strings?` then `violin | guitar | flute | trumpet`; the player enters `b`, receives `Correct`, and sees `Final score: 1/1`.

Save the game in a `.py` file and run it from a terminal. If you use both sample questions, the denominator is two. The one-question session keeps the displayed score denominator at one.

## Make it yourself

Change the questions while keeping every dictionary's keys consistent. Test a perfect run, a zero-score run, and a mixed run by changing the preset responses.

```python run
# Add questions and check a perfect, zero-score, and mixed round.
# Sample data: responses = ["b", "a", "c"]
# Write your code below and print the result
```

1. Add questions about weather, sports, art, or geography.
2. Print a short explanation after each response.
3. Reject answers outside the available letter choices.
4. Add a category label and choose questions from one category.
5. Show a percentage as well as the fraction score.

Start with a short quiz and manually check the answer keys. If a question has four options, its answer should be one of `a`, `b`, `c`, or `d`. If a question has a different number of choices, update the labels or validate the data before showing it. A malformed question can create misleading output even when the scoring loop is correct.

Think about what should happen after a wrong answer. This version displays the correct letter so the player can learn from the response. A study quiz might also show an explanation; a competitive quiz may keep the key hidden until the end. The data can add an `explanation` field later, and the display code can choose when to show it. The score and feedback should still be based on the same normalized comparison.

A future version could shuffle questions or save high scores, but those additions introduce new concerns: random output is harder to verify, and saving requires a file format. Keep this first version focused on asking, checking, and scoring correctly. Preset tests make each expected outcome repeatable while you debug.

Reference: Python documentation, Data Structures

:::solution
Keep each question's keys consistent, pair each question with one preset response, and compare normalized letters. The loop accumulates the points and prints a repeatable score.

```python
questions = [
    {"prompt": "Which instrument marks silence?", "choices": ["rest", "scale", "chord", "key"], "answer": "a"},
    {"prompt": "Which instrument has six strings?", "choices": ["violin", "guitar", "flute", "trumpet"], "answer": "b"},
]
responses = ["a", "d"]
score = 0
for question, response in zip(questions, responses):
    print(question["prompt"])
    print(" | ".join(question["choices"]))
    if response.strip().lower() == question["answer"]:
        score += 1
print(f"Final score: {score}/{len(questions)}")
```
:::
