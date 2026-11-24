# Final Boss: Mixed Practice from All Lectures

<aside>
👑

**Welcome to the Final Boss!** These questions mix ideas from **all ten lectures (0–9)**. Try each one on your own first. The answers explain not only *what* to write but **why every line is there**, and which lecture it comes from.

</aside>

## 🎯 Part A: Mixed MCQs

- 🎯 Q1. What does `print(type(input()))` show when the user types `5`? (A) int (B) str (C) float (D) 5
    
    **Answer: (B) str.** `input` always returns text, even when the user types digits (Lecture 0). `type()` reports that type as `<class 'str'>`.
    
- 🎯 Q2. What does `print('ab' * 3)` show? (A) ab3 (B) ababab (C) Error (D) 3ab
    
    **Answer: (B).** Multiplying a string repeats it. This is why `'#' * i` can draw a triangle (Lecture 2).
    
- 🎯 Q3. How many times does `for i in range(2, 6):` run? (A) 3 (B) 4 (C) 5 (D) 6
    
    **Answer: (B).** It gives 2, 3, 4, 5. The end value 6 is **not** included, so there are 4 rounds.
    
- 🎯 Q4. Which error does `open('missing.txt')` raise when the file does not exist? (A) ValueError (B) NameError (C) KeyError (D) FileNotFoundError
    
    **Answer: (D).** Wrap the `open` in `try / except FileNotFoundError` (Lectures 3 and 6).
    
- 🎯 Q5. What does `re.fullmatch(r'\d{3}', '1234')` return? (A) a match (B) None (C) True (D) 123
    
    **Answer: (B) None.** `\d{3}` means exactly three digits and `fullmatch` needs the **whole** text to fit. `'1234'` has four digits (Lecture 7).
    
- 🎯 Q6. In a class, what does `self.x = x` do? (A) creates a global variable (B) stores `x` on the object (C) deletes `x` (D) calls the constructor
    
    **Answer: (B).** It saves the value inside this particular object so it can be used later (Lecture 8).
    
- 🎯 Q7. A pytest file must be named like: (A) check_[calc.py](http://calc.py) (B) calc_test (C) test_[calc.py](http://calc.py) (D) [pytest.py](http://pytest.py)
    
    **Answer: (C).** pytest looks for files and functions that start with `test_` (Lecture 5).
    
- 🎯 Q8. What is `sys.argv[0]` when you run `python hi.py Sam`? (A) Sam (B) python (C) [hi.py](http://hi.py) (D) 0
    
    **Answer: (C).** Index 0 is the file name. The first real argument is `sys.argv[1]` (Lecture 4).
    

## 🧑‍💻 Part B: Programs that mix everything

- 🧑‍💻 B1. **Number guessing game.** Ask for a level (a positive whole number). The computer picks a secret number from 1 to that level. Keep asking for guesses, saying `Too small!` or `Too large!`, until the user is right. Ignore bad input.
    
    💡 Hint: one helper function that asks until it gets a positive integer, then a loop for guessing.
    
    ```python
    import random
    
    def get_int(prompt):
        while True:
            try:
                n = int(input(prompt))
                if n > 0:
                    return n
            except ValueError:
                pass
    
    def main():
        top = get_int('Level: ')
        secret = random.randint(1, top)
        while True:
            guess = get_int('Guess: ')
            if guess < secret:
                print('Too small!')
            elif guess > secret:
                print('Too large!')
            else:
                print('Just right!')
                break
    
    if __name__ == '__main__':
        main()
    ```
    
    ### 🧠 Why is every part there?
    
    - **`def get_int(prompt)`**: we need a valid number twice (level and guesses). One function means we write the checking code once (Lecture 0).
    - **`while True` + `try / except ValueError`**: if the user types `cat`, `int()` raises `ValueError`. We catch it and `pass`, so the loop asks again instead of crashing (Lectures 2 and 3).
    - **`if n > 0: return n`**: `0` or `-5` are valid integers but not valid levels. If the check fails, nothing is returned, so the loop runs again (Lecture 1).
    - **`random.randint(1, top)`**: picks the secret number, and `randint` includes both ends (Lecture 4).
    - **`if / elif / else`**: exactly one of the three messages fires each round (Lecture 1).
    - **`break`**: leaves the infinite loop only when the guess is right (Lecture 2).
    - **`if __name__ == '__main__'`**: runs the game only when the file is run directly, so tests could import `get_int` safely (Lectures 4 and 5).
- 🧑‍💻 B2. **Grade book.** Keep asking for a student name until the user presses Enter on a blank name. For each name ask for marks (0 to 100). Save everything in `marks.csv` with the header `name,marks`, then print the topper.
    
    💡 Hint: a dictionary for storing, `csv.writer` for saving.
    
    ```python
    import csv
    
    def get_marks():
        while True:
            try:
                marks = int(input('Marks: '))
                if 0 <= marks <= 100:
                    return marks
            except ValueError:
                pass
            print('Enter a whole number from 0 to 100')
    
    def main():
        students = {}
        while True:
            name = input('Name (blank to stop): ').strip().title()
            if name == '':
                break
            students[name] = get_marks()
    
        with open('marks.csv', 'w', newline='') as file:
            writer = csv.writer(file)
            writer.writerow(['name', 'marks'])
            for name, marks in students.items():
                writer.writerow([name, marks])
    
        if students:
            topper = max(students, key=students.get)
            print(f'Topper: {topper} with {students[topper]}')
    
    if __name__ == '__main__':
        main()
    ```
    
    ### 🧠 Why is every part there?
    
    - **`.strip().title()`**: cleans stray spaces and fixes capital letters, so  `ria` becomes `Ria` (Lecture 0).
    - **`if name == '': break`**: a blank name is our “stop” signal, so we leave the loop (Lecture 2).
    - **`students = {}` and `students[name] = ...`**: a dictionary links each name to its marks (Lecture 2).
    - **`get_marks()` with `try / except`**: protects against text like `abc`, and the range check `0 <= marks <= 100` protects against impossible marks (Lectures 1 and 3).
    - **`open('marks.csv', 'w', newline='')`**: mode `'w'` is right here because we want a **fresh** file each run. `newline=''` stops blank lines appearing between rows on Windows (Lecture 6).
    - **`writer.writerow([...])`**: writes the header first, then one row per student (Lecture 6).
    - **`if students:`**: an empty dictionary counts as False. Without this guard, `max()` on nothing would crash.
    - **`max(students, key=students.get)`**: finds the name whose **marks** are the highest. `key=` tells `max` what to compare.
- 🧑‍💻 B3. **Email validator with tests.** Write `is_valid_email(email)` returning `True` or `False`. Accept `kritik@gmail.com` and `ada.l@mail.co.in`. Reject `kritik@gmail`, `@gmail.com` and an empty string. Then write pytest tests.
    
    💡 Hint: build the pattern in pieces: name, `@`, site, one or more `.something` endings.
    
    ```python
    # validator.py
    import re
    
    def is_valid_email(email):
        return bool(re.fullmatch(r'[\w.]+@\w+(\.\w+)+', email.strip()))
    ```
    
    ```python
    # test_validator.py
    from validator import is_valid_email
    
    def test_valid():
        assert is_valid_email('kritik@gmail.com')
        assert is_valid_email('ada.l@mail.co.in')
    
    def test_invalid():
        assert not is_valid_email('kritik@gmail')
        assert not is_valid_email('@gmail.com')
        assert not is_valid_email('')
    ```
    
    ### 🧠 Why is every part there?
    
    - **`[\w.]+`**: one or more letters, digits, underscores or dots, so names like `ada.l` work (Lecture 7).
    - **`@`**: a real at sign.
    - **`\w+`**: the site name, such as `gmail` or `mail`.
    - **`(\.\w+)+`**: a group meaning “a real dot plus letters”, repeated one or more times. That accepts `.com` and also `.co.in`. `kritik@gmail` fails because it has no dot part.
    - **`re.fullmatch`**: the whole string must fit, so extra junk at the end is rejected.
    - **`.strip()`**: removes accidental spaces from the ends.
    - **`bool(...)`**: `fullmatch` returns a match object or `None`. `bool` turns these into `True` and `False`, which is what a yes/no function should return, and it makes tests easy to read.
    - **Tests**: one test for good emails, one for bad emails, including the edge case of an empty string (Lecture 5).
- 🧑‍💻 B4. **Student class.** Make a `Student` with `name` and `marks`. Marks must be between 0 and 100 (raise `ValueError` otherwise). Add a `grade()` method (A for 90 or more, B for 75 or more, else C) and a nice `__str__`. Print a list of students sorted from highest to lowest marks.
    
    💡 Hint: `@property` for validation, `sorted(..., reverse=True)`.
    
    ```python
    class Student:
        def __init__(self, name, marks):
            self.name = name
            self.marks = marks
    
        @property
        def marks(self):
            return self._marks
    
        @marks.setter
        def marks(self, value):
            if not 0 <= value <= 100:
                raise ValueError('Marks must be 0 to 100')
            self._marks = value
    
        def grade(self):
            if self.marks >= 90:
                return 'A'
            elif self.marks >= 75:
                return 'B'
            return 'C'
    
        def __str__(self):
            return f'{self.name}: {self.marks} ({self.grade()})'
    
    students = [Student('Ria', 93), Student('Sam', 71), Student('Ana', 80)]
    for s in sorted(students, key=lambda s: s.marks, reverse=True):
        print(s)
    ```
    
    ### 🧠 Why is every part there?
    
    - **`__init__`**: sets up each new student, storing `name` and `marks` (Lecture 8).
    - **`self.marks = marks` inside `__init__`**: this line actually calls the **setter**, so even a brand-new student is validated.
    - **`@property` and `@marks.setter`**: the property lets code write `s.marks` like a normal attribute, while the setter checks the range first. The value is stored in `self._marks`; using `self.marks` there would call the setter forever.
    - **`raise ValueError(...)`**: stops bad data at the door (Lecture 3).
    - **`grade()`**: `if / elif` then a final `return 'C'`. After `return`, the function ends, so no `else` is needed (Lecture 1).
    - **`__str__`**: controls what `print(s)` shows. It must **return** a string.
    - **`sorted(..., key=lambda s: s.marks, reverse=True)`**: `key` says *what to sort by*. A `lambda` is a tiny nameless function, here meaning “give me `s.marks`”. `reverse=True` puts the highest first.
- 🧑‍💻 B5. **Debug the code.** This program should print the average of numbers typed like `4,8,6`. Find every bug and fix it.
    
    ```python
    def average(numbers)
        total = 0
        for n in numbers:
            total =+ n
        return total / len(numbers)
    
    nums = input('Numbers: ').split(',')
    print('Average is', average(nums))
    ```
    
    💡 Hint: there are at least four problems, from syntax to wrong types to crashes.
    
    ```python
    def average(numbers):
        total = 0
        for n in numbers:
            total += n
        return total / len(numbers)
    
    try:
        nums = [int(x) for x in input('Numbers: ').split(',')]
        print('Average is', average(nums))
    except ValueError:
        print('Please type whole numbers separated by commas')
    ```
    
    ### 🧠 The four bugs, explained
    
    1. **Missing colon after `def average(numbers)`.** Every `def` line must end with `:`. This is a `SyntaxError`, so the program would not even start (Lecture 0).
    2. **`total =+ n`.** This means `total = +n` (set total to positive n), so each round **overwrites** the total. The intended `total += n` **adds** to it.
    3. **`nums` are strings.** `split(',')` gives `['4', '8', '6']`. Adding text to the number `0` raises `TypeError`. Converting with `int(x)` fixes it (Lecture 0).
    4. **Bad input crashes the program.** Typing `a,b` makes `int()` raise `ValueError`, and an empty list would divide by zero. A `try / except ValueError` handles the first one (Lecture 3). A careful version would also check `len(numbers)` before dividing.
- 🧑‍💻 B6. **Top 3 words.** Run `python words.py story.txt`. Read the file, ignore capital letters and punctuation, and print the three most common words with their counts. Show helpful messages for a missing argument or a missing file.
    
    💡 Hint: `sys.argv`, `try / except`, `re.findall`, a dictionary, then `sorted`.
    
    ```python
    import re
    import sys
    
    def main():
        if len(sys.argv) != 2:
            sys.exit('Usage: python words.py file.txt')
    
        try:
            with open(sys.argv[1]) as file:
                text = file.read().lower()
        except FileNotFoundError:
            sys.exit('File not found')
    
        counts = {}
        for word in re.findall(r'[a-z]+', text):
            counts[word] = counts.get(word, 0) + 1
    
        top = sorted(counts.items(), key=lambda item: item[1], reverse=True)[:3]
        for word, count in top:
            print(word, count)
    
    if __name__ == '__main__':
        main()
    ```
    
    ### 🧠 Why is every part there?
    
    - **`len(sys.argv) != 2`**: we need exactly the file name plus one argument. If not, we stop with a usage message instead of crashing with `IndexError` (Lecture 4).
    - **`with open(...)`**: reads the file safely and closes it automatically. `file.read()` gives the whole text as one string (Lecture 6).
    - **`except FileNotFoundError`**: turns an ugly crash into a friendly message (Lecture 3).
    - **`.lower()`**: makes `The` and `the` count as the same word.
    - **`re.findall(r'[a-z]+', text)`**: pulls out only runs of letters, so punctuation like `hello,` or `end.` does not stick to words (Lecture 7).
    - **`counts.get(word, 0) + 1`**: `get` returns 0 for a word we have not seen yet, so we never get a `KeyError` (Lecture 2).
    - **`sorted(counts.items(), key=..., reverse=True)[:3]`**: `items()` gives `(word, count)` pairs, `key=lambda item: item[1]` sorts by the count, `reverse=True` puts the biggest first, and `[:3]` keeps the top three.

## 🧱 Part C: Et Cetera enters the boss fight

These questions add Lecture 9's tools to ideas from earlier lectures. They are designed to catch common “looks right at first glance” mistakes.

- 🎯 Q9. What is the value of `len({name.casefold() for name in ["Ada", "ada", "Grace"]})`? (A) 1 (B) 2 (C) 3 (D) Error
    
    **Answer: (B) 2.** `casefold()` makes both `"Ada"` and `"ada"` become `"ada"`. A set keeps one copy of that value, plus `"grace"`. This is a useful way to count names without counting capitalization as a difference.
    
- 🎯 Q10. What does `sum(n * n for n in range(4))` produce? (A) 9 (B) 14 (C) 16 (D) `[0, 1, 4, 9]`
    
    **Answer: (B) 14.** `range(4)` gives 0, 1, 2, 3. The generator expression squares each value, then `sum` adds 0 + 1 + 4 + 9. The expression produces numbers for `sum`; it does not make a list.
    
- 🎯 Q11. You want unique names printed alphabetically. Which is safest? (A) `for x in set(names)` (B) `for x in sorted(set(names))` (C) `for x in names.sort()` (D) `for x in enumerate(names)`
    
    **Answer: (B).** A set removes duplicates, but it is not a promise of alphabetical order. `sorted(...)` makes the order predictable. Also, `list.sort()` changes a list in place and returns `None`, so it is not a replacement for `sorted(...)` in a loop.
    
- 🎯 Q12. What does `list(enumerate(["Ada", "Grace"], start=1))` contain? (A) `[(0, "Ada"), (1, "Grace")]` (B) `[(1, "Ada"), (2, "Grace")]` (C) `["1 Ada", "2 Grace"]` (D) `[("Ada", 1), ("Grace", 2)]`
    
    **Answer: (B).** `enumerate` pairs each item with a counter. With `start=1`, the first pair is `(1, "Ada")`. The item comes second in each pair.
    

### 🧑‍💻 B7. Tough mixed challenge: the score auditor

Write a program that reads `scores.csv`, whose columns are `name,score`. Ignore rows with an invalid name, a non-whole-number score, a score outside 0–100, or a repeated name (treat `Ada` and `ada` as the same person). Print the average of the valid scores and the unique passing names (60 or more) in alphabetical order, numbered from 1. Handle a missing file without a traceback.

Use type hints, a docstring, a set, a list comprehension, a generator expression, `enumerate`, and a main guard. Try to plan the steps before opening the answer.

- 🧱 Complete answer
    
    ```python
    import csv
    import re
    
    PASS_MARK = 60
    
    def load_scores(path: str) -> list[tuple[str, int]]:
        """Return valid, non-duplicate name and score pairs from a CSV file."""
        scores = []
        seen: set[str] = set()
    
        try:
            with open(path, newline="") as file:
                for row in csv.DictReader(file):
                    raw_name = (row.get("name") or "").strip()
                    raw_score = (row.get("score") or "").strip()
    
                    if not re.fullmatch(r"[A-Za-z][A-Za-z '-]*", raw_name):
                        continue
    
                    key = raw_name.casefold()
                    if key in seen:
                        continue
    
                    try:
                        score = int(raw_score)
                    except ValueError:
                        continue
    
                    if not 0 <= score <= 100:
                        continue
    
                    seen.add(key)
                    scores.append((raw_name.title(), score))
    
        except FileNotFoundError:
            return []
    
        return scores
    
    def main() -> None:
        scores = load_scores("scores.csv")
    
        if not scores:
            print("No valid scores found.")
            return
    
        average = sum(score for _, score in scores) / len(scores)
        print(f"Average score: {average:.1f}")
    
        passing = sorted({name for name, score in scores if score >= PASS_MARK})
        if not passing:
            print("No one passed yet.")
            return
    
        print("Passing students:")
        for rank, name in enumerate(passing, start=1):
            print(f"{rank}. {name}")
    
    if __name__ == "__main__":
        main()
    ```
    
    ### Why each piece is here
    
    1. **`import csv` and `import re`:** the CSV library reads rows by their column names; regular expressions check that a name starts with a letter and then contains only letters, spaces, apostrophes, or hyphens.
    2. **`PASS_MARK = 60`:** this is a constant: a value we treat as fixed. Capital letters are a convention that tells readers not to change it casually.
    3. **`path: str` and `-> list[tuple[str, int]]`:** these type hints describe the input and output: a file path is text, and the result is a list of name-and-integer pairs. Python does not automatically enforce these hints.
    4. **The docstring:** the text inside the first triple-quoted string explains the function's job for a reader and for documentation tools.
    5. **`csv.DictReader(file)`:** each CSV row becomes a dictionary, so `row.get("name")` and `row.get("score")` are easier to understand than remembering column positions.
    6. **`(value or "").strip()`:** missing or blank cells safely become an empty string, and accidental spaces at the edges are removed.
    7. **`re.fullmatch(...)`:** the entire name must fit the pattern. If it does not, `continue` skips that row and moves to the next one.
    8. **`casefold()` and `seen`:** the set remembers names already accepted. Comparing normalized names makes `Ada`, `ADA`, and `ada` duplicates. A set is handy because checking membership is simple.
    9. **`int(raw_score)` inside `try`:** text like `"eighty"` cannot become an integer, so Python raises `ValueError`. We catch that one bad row and keep reading the file.
    10. **`0 <= score <= 100`:** being an integer is not enough; the score must also be in the allowed range. The chained comparison means both checks must be true.
    11. **`scores.append(...)`:** only a row that passed every check reaches this line. `title()` makes the displayed name look tidy.
    12. **`except FileNotFoundError`:** if the requested file is missing, the function returns an empty list. The caller can show a friendly message instead of a traceback.
    13. **`if not scores: return`:** prevents division by zero when there are no usable rows.
    14. **`sum(score for _, score in scores)`:** this generator expression gives scores to `sum` one at a time. The underscore means “this first value is not needed here.”
    15. **`{name for ... if ...}`:** this set comprehension selects passing names and removes duplicates. `sorted` then gives them a predictable alphabetical order.
    16. **`enumerate(passing, start=1)`:** produces each number-and-name pair, beginning at 1, so the output looks like a numbered list.
    17. **`if __name__ == "__main__"`:** starts the program when you run this file directly, while allowing another file to import `load_scores` without immediately running the report.
    
    <aside>
    🧪
    
    Try these edge cases: an empty file, `Ada,90` followed by `ada,80`, a score of `101`, a score of `not a number`, and a missing `scores.csv`. Predict the result before running the program.
    
    </aside>
    

## 🏆 Final checklist

- [ ]  I can explain what each line of B1 does without looking.
- [ ]  I solved at least four of the seven programs on my own.
- [ ]  I can say which lecture each idea came from.
- [ ]  I wrote one tiny program of my own that uses functions, a loop, an exception and a file.