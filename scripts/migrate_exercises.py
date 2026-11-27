#!/usr/bin/env python3
"""One-time exercise starter/expected/hint migration for lesson Markdown."""
import ast
import glob
import os
import re
import subprocess
import sys

from verify_lessons import parse_exercises

REPORT = []
FALLBACK_DATA = {
    ("a-tour-of-the-standard-library", "Challenge: inspect a date"): ["match_year = 2026", "match_month = 4", "match_day = 11"],
    ("async-and-await-basics", "Medium: inspect a coroutine object"): ['message = "Finished"'],
    ("classes-and-objects", "Easy: create a book object"): ['book_title = "A Field of Stars"'],
    ("classes-and-objects", "Medium: keep separate team values"): ['home_color = "maroon"', 'away_color = "cream"'],
    ("cs50p-regular-expressions", "Challenge: change a roster name order"): ['roster_name = "Das, Kabir"'],
    ("dataclasses", "Medium: use a fresh collection"): ['berry_name = "berry"', 'citrus_name = "citrus"'],
    ("dataclasses", "Challenge: freeze a record"): ["row = 5", "column = 2"],
    ("functions-and-variables", "Exercise 1 (easy): Badge generator function"): ['full_name = "  albert einstein  "', 'title = "physicist"'],
    ("functions-and-variables", "Exercise 2 (medium): Tip calculation function"): ["bill_amount = 500", "percent = 10", "second_bill_amount = 120", "second_percent = 18"],
    ("inheritance", "Challenge: extend initialization"): ['holder = "Meera"', 'access_zone = "stage"'],
    ("init-and-methods", "Easy: initialize a song"): ['song_title = "Silver Kite"'],
    ("init-and-methods", "Medium: calculate a score bonus"): ["starting_score = 76", "bonus_points = 12"],
    ("init-and-methods", "Challenge: update a reading streak"): ["starting_days = 6"],
    ("json-and-csv", "Easy: read a JSON value"): ['game_json = \'{"name": "Sky Sprint", "levels": 4}\''],
    ("modules-and-imports", "Challenge: give the module a clear alias"): ["concert_year = 2026", "concert_month = 6", "concert_day = 20"],
    ("object-oriented-programming", "Challenge: extend a base class"): ['mineral_name = "Quartz"', 'mineral_color = "smoky"'],
    ("reading-and-writing-files", "Easy: read a line from memory"): ['sample_text = "serve\\nreturn\\n"'],
    ("reading-and-writing-files", "Medium: write multiple lines"): ['starting_text = ""'],
    ("reading-and-writing-files", "Challenge: choose append behavior"): ['first_entry = "Song: Dawn Chorus\\n"', 'next_entry = "Song: Long Way Home\\n"'],
    ("regular-expressions", "Challenge: capture a time"): ['time_text = "07:35"'],
}

TASK_REWRITES = {
    ("bank-account-with-classes", "Make it yourself"): "Test a non-positive amount and an amount above `balance_cents` separately. Also test a withdrawal equal to the balance; decide whether zero is allowed.",
    ("break-continue-and-loop-else", "Exercise 2 (medium): Ignoring negative numbers with `continue`"): "Use `balances` to add only positive amounts. Print each accepted balance, then print the final total.",
    ("lists", "Exercise 3 (challenge): Customer service queue simulator"): "Use `queue` to add two passengers. Serve the first two in order, print each name, then print the remaining queue.",
    ("numbers-and-math", "Exercise 3 (challenge): Compound investment growth"): "Use `principal`, `annual_rate`, and `years` to calculate compound interest. Print the maturity balance and profit to two decimals.",
    ("scope", "Medium: Pass a global value into a function"): "Pass `team` to a function. Print the cheer created from its parameter.",
    ("text-strings", "Exercise 3 (challenge): Word frequency and selective replacement"): "Count `target_word` in `paragraph`. Replace its first two occurrences with `Snake`, then print the count and new text.",
    ("true-false-and-comparisons", "Exercise 1 (easy): Exam passing threshold"): "Compare `score` with `pass_mark`. Store the result in `passed` and print it.",
    ("variables-and-types", "Exercise 2 (medium): Convert seconds to minutes and seconds"): "Use `total_seconds` with `//` and `%`. Print full minutes and leftover seconds.",
    ("and-or-not", "Exercise 1 (easy): Movie ticket concession discount"): "Use `patron_age` to check whether the patron is under 12 or at least 65. Store the result in `gets_discount`.",
    ("and-or-not", "Exercise 2 (medium): Home mortgage loan approval"): "Use `annual_income`, `credit_score`, and `prior_default` to decide whether the loan is approved. Store the result in `loan_approved`.",
    ("and-or-not", "Exercise 3 (challenge): Two-factor security authentication"): "Use `password_valid`, `biometric_ok`, `otp_ok`, and `account_locked` to decide access. Store the result in `access_granted`.",
    ("async-and-await-basics", "Challenge: run a coroutine in a terminal"): "Define `finish_practice()` as an async function that returns `message`. Create its coroutine, print whether it is awaitable, then close it.",
    ("for-loops-and-range", "Exercise 1 (easy): Multiplication table generator"): "Use `multiplier` and `range(1, 11)` to print its multiplication table, one product per line.",
    ("for-loops-and-range", "Exercise 2 (medium): Vowel counter in a sentence"): "Count the vowels in `sentence` with a `for` loop. Store the count in `vowel_count` and print it.",
    ("for-loops-and-range", "Exercise 3 (challenge): Sum of odd squares"): "Use `range()` to square each odd number from 1 through 15. Print each square, then print their sum.",
    ("functions-and-variables", "Exercise 1 (easy): Badge generator function"): "Define `create_badge(full_name, title)` to clean both values. Return a string in the form `Name - TITLE` and print two test results.",
    ("functions-and-variables", "Exercise 2 (medium): Tip calculation function"): "Define `calculate_tip(bill_amount, percent)` to return the tip amount. Print the results for both supplied bills.",
    ("functions-and-variables", "Exercise 3 (challenge): Seconds to minutes converter function"): "Define `convert_seconds(total_seconds)` using `//` and `%`. Return `minutes min seconds sec` and print both test results.",
    ("indexing-and-slicing", "Exercise 1 (easy): Phone number area code extraction"): "Slice `phone` into its country code, area code, and local number. Print each part with a label.",
    ("indexing-and-slicing", "Exercise 2 (medium): Search result pagination"): "Use `laptops` and a page size of 4. Print pages 1, 2, and 3 using slices `0:4`, `4:8`, and `8:12`.",
    ("indexing-and-slicing", "Exercise 3 (challenge): Middle trimming and sub-list replacement"): "Replace `readings[1:4]` with `[200, 350]` in one slice assignment. Print the updated `readings` list.",
    ("lists", "Exercise 1 (easy): Shopping inventory manager"): "Update `cart`: append `butter`, remove `bread`, then insert `apples` at index 0. Print the final list.",
    ("lists", "Exercise 2 (medium): Examination score analyzer"): "Use `marks` to find the highest score, lowest score, total, and average. Round the average to two decimals and print all four values.",
    ("making-decisions-with-if", "Exercise 1 (easy): Movie theater ticket pricing"): "Use `age` to set a ticket price: 150 under 12, 250 for ages 12–17, and 350 otherwise. Print the price for age 15.",
    ("making-decisions-with-if", "Exercise 2 (medium): Free delivery calculation"): "Use `order_total` and `is_vip` to set the delivery fee. Print the fee and total payable for the supplied order.",
    ("making-decisions-with-if", "Exercise 3 (challenge): Leap year checker"): "Check whether `year` is a leap year using the century rule. Print the result for 2024.",
    ("nested-loops-and-patterns", "Exercise 1 (easy): Star staircase pattern"): "Use `steps` to print a hash staircase. The rows contain 1 through 5 hashes, one row per line.",
    ("nested-loops-and-patterns", "Exercise 2 (medium): 4x4 Addition lookup grid"): "Use nested loops for `row` and `col` from 1 through 4. Print each sum right-aligned in a 3-character field.",
    ("nested-loops-and-patterns", "Exercise 3 (challenge): Hollow square border pattern"): "Use `side_length` to print a 5 by 5 hollow star square. Print full top and bottom rows with hollow middle rows.",
    ("numbers-and-math", "Exercise 2 (medium): ATM currency note breakdown"): "Break `amount_rupees` into 500, 100, and 10 rupee notes using `//` and `%`. Print each note count.",
    ("repeating-with-loops", "Exercise 3 (challenge): Sum of even numbers up to 20"): "Use a `while` loop and an accumulator to sum the even numbers from 2 through 20. Print the total.",
    ("talking-to-the-user-with-input-and-f-strings", "Exercise 1 (easy): Temperature conversion display"): "Convert `raw_temp` to Celsius, then calculate Fahrenheit. Print one line with one decimal place: `28°C is equivalent to 82.4°F`.",
    ("talking-to-the-user-with-input-and-f-strings", "Exercise 3 (challenge): Academic report card generator"): "Use `student_name` and the three marks to print a report card. Align names to 12 spaces, marks to 3 spaces, and show the total and percentage to two decimals.",
    ("text-strings", "Exercise 1 (easy): Clean and standardize author name"): "Use `raw_author` to remove surrounding spaces and apply title case. Print the cleaned name.",
    ("text-strings", "Exercise 2 (medium): Masking payment card digits"): "Use `raw_card` to remove hyphens and mask all but its final four digits. Print 12 asterisks followed by `9876`.",
    ("true-false-and-comparisons", "Exercise 2 (medium): Liquid water temperature range"): "Check whether `water_temp` is between 0 and 100 inclusive. Store the boolean in `is_liquid` and print it.",
    ("true-false-and-comparisons", "Exercise 3 (challenge): Username policy validation"): "Use `len(username)` to check whether `username` has 5–15 characters. Print the boolean result.",
    ("tuples", "Exercise 1 (easy): Coordinate extraction and axis swap"): "Unpack `location` into `latitude` and `longitude`, then swap them. Print both values after the swap.",
    ("tuples", "Exercise 2 (medium): Race podium split with star unpacking"): "Unpack `leaderboard` into `gold`, `silver`, `bronze`, and `others`. Print the podium and remaining names.",
    ("tuples", "Exercise 3 (challenge): Perceived RGB color luminance"): "Unpack `forest_green` into red, green, and blue channels. Calculate luminance, round to one decimal place, and print it.",
    ("what-is-programming-and-python", "Exercise 1 (easy): Grocery invoice subtotal"): "Use `item_price`, `quantity`, and `tax_rate` to calculate the taxed total. Print the subtotal, tax, and final total.",
    ("what-is-programming-and-python", "Exercise 2 (medium): Marathon distance converter"): "Convert `distance_km` to miles using `0.621371`. Round the result to two decimal places and print it.",
    ("what-is-programming-and-python", "Exercise 3 (challenge): Simple interest financial maturity"): "Use `principal`, `rate`, and `time` to calculate interest and maturity balance. Print both values to two decimals.",
    ("your-first-program-with-print", "Exercise 1 (easy): Formatted product pricing label"): "Use `item`, `price`, and `discount` to print the item, original price, discount, and final price. Separate them with ` | `.",
    ("your-first-program-with-print", "Exercise 2 (medium): Single-line breadcrumb navigation"): "Print `Step 1`, `Step 2`, and `Complete!` on one line. Separate the steps with ` -> ` and end with a newline.",
    ("your-first-program-with-print", "Exercise 3 (challenge): Formatted commercial receipt"): "Print receipt `#4092` with a 350 stationery charge, 17.5 tax, and 367.5 total. Use the shown banners and currency format.",
    ("libraries", "Easy: choose a warm-up activity"): "Use `Counter` to find the most common activity in `activities`. Print that activity.",
}


def split_top_level_commas(value):
    parts, start, depth, quote, escaped = [], 0, 0, None, False
    for index, char in enumerate(value):
        if quote:
            if escaped:
                escaped = False
            elif char == "\\":
                escaped = True
            elif char == quote:
                quote = None
        elif char in "\"'":
            quote = char
        elif char in "([{":
            depth += 1
        elif char in ")]}":
            depth -= 1
        elif char == "," and depth == 0:
            parts.append(value[start:index].strip())
            start = index + 1
    parts.append(value[start:].strip())
    return [part for part in parts if part]


def assignment_from_text(text):
    assignments = []
    for part in split_top_level_commas(text):
        try:
            statement = ast.parse(part).body[0]
            if not isinstance(statement, ast.Assign) or len(statement.targets) != 1 or not isinstance(statement.targets[0], ast.Name):
                continue
            value = ast.literal_eval(statement.value)
            assignments.append(f"{statement.targets[0].id} = {value!r}")
        except (SyntaxError, ValueError, TypeError, IndexError):
            continue
    return assignments


def get_data_lines(exercise, slug):
    sample = "\n".join(re.findall(r"^# Sample data:\s*(.*)$", exercise["starters"][0]["body"], re.M))
    lines = assignment_from_text(sample)
    # Values stated in the task count as given data too.
    task = exercise.get("task", "")
    for match in re.finditer(r"`([A-Za-z_]\w*)\s*=\s*([^`]+)`", task):
        lines.extend(assignment_from_text(f"{match.group(1)} = {match.group(2).strip()}"))
    if not lines:
        lines = FALLBACK_DATA.get((slug, exercise["heading"]), [])
    deduped = []
    seen = set()
    for line in lines:
        if line.split("=", 1)[0].strip() not in seen:
            deduped.append(line)
            seen.add(line.split("=", 1)[0].strip())
    return deduped


def simplify_task(task, slug, heading, data_lines):
    updated = TASK_REWRITES.get((slug, heading), task.strip())
    if slug in {"bank-account-with-classes", "expense-tracker-with-json", "quiz-game", "text-adventure", "to-do-list-with-files"}:
        return updated
    names = [line.split("=", 1)[0].strip() for line in data_lines]
    if names and not re.search(r"`[A-Za-z_]\w*`", updated):
        if len(names) == 1:
            reference = f"Use `{names[0]}` as the sample data. "
        else:
            rendered = ", ".join(f"`{name}`" for name in names[:-1]) + f" and `{names[-1]}`"
            reference = f"Use {rendered} as the sample data. "
        updated = reference + updated
    says_what_to_print = re.search(r"\b(print|output|display|show|return|list|line|format)\b", updated, re.I)
    if not says_what_to_print:
        updated = updated.rstrip(" .") + ". Print the result exactly as shown in Expected output."
    updated = re.sub(r"\s+", " ", updated).strip()
    return updated


def hint_text(slug, heading):
    words = slug.replace("-", " ")
    return f"Use the lesson idea about {words}. Trace the sample values before printing so you can check each step."


def code_block_range(lines, start, stop):
    for index in range(start, stop):
        if lines[index].strip().startswith("```python"):
            end = index + 1
            while end < stop and lines[end].strip() != "```":
                end += 1
            if end < stop:
                return index, end
    return None


def special_code(slug, heading, original, data_lines):
    if slug == "file-io" and heading == "Easy: save a rehearsal note":
        data_lines[:] = ['note_lines = ["Doors open at six", "Soundcheck at five"]']
        return 'import io\n\nnote = io.StringIO()\nfor line in note_lines:\n    note.write(line + "\\n")\nnote.seek(0)\nprint(note.read(), end="")'
    if slug == "file-io" and heading == "Medium: append another result":
        data_lines[:] = ['first_entry = "Round one"', 'next_entry = "Round two"']
        return 'import io\n\nrounds = io.StringIO(first_entry + "\\n")\nrounds.write(next_entry + "\\n")\nrounds.seek(0)\nprint(rounds.read(), end="")'
    if slug == "file-io" and heading == "Challenge: read a CSV table":
        data_lines[:] = ['roster_csv = "player,position\\nNoor,keeper\\nIshan,forward\\n"']
        return 'import csv\nimport io\n\nfor row in csv.DictReader(io.StringIO(roster_csv)):\n    print(row["player"], row["position"])'
    if slug == "async-and-await-basics" and heading == "Challenge: run a coroutine in a terminal":
        data_lines[:] = ['message = "Practice complete"']
        return 'import inspect\n\nasync def finish_practice():\n    return message\n\npending = finish_practice()\nprint(inspect.isawaitable(pending))\npending.close()'
    if slug == "testing-your-code" and heading == "Challenge: test an exception":
        data_lines[:] = ['username = ""']
        return 'def validate_username(name):\n    if name == "":\n        raise ValueError("username is empty")\n    return name\n\ntry:\n    validate_username(username)\nexcept ValueError:\n    print("ValueError caught")'
    if slug == "libraries" and heading == "Easy: choose a warm-up activity":
        data_lines[:] = ['activities = ["stretch", "skip", "stretch"]']
        return 'from collections import Counter\n\nmost_common = Counter(activities).most_common(1)[0][0]\nprint(most_common)'
    return original


def run_solution(code):
    result = subprocess.run([sys.executable, "-c", code], capture_output=True, text=True, timeout=8)
    if result.returncode:
        raise RuntimeError(result.stderr.strip() or "solution exited with a non-zero status")
    return result.stdout.rstrip("\r\n")


def migrate_file(path):
    slug = os.path.basename(os.path.dirname(path))
    raw = open(path, encoding="utf-8").read()
    exercises = parse_exercises(raw)
    if not exercises:
        return 0, 0
    lines = raw.splitlines()
    prepared = []
    # Capture line positions and per-exercise task text against the original file.
    for exercise in exercises:
        if not exercise["starters"] or not exercise["solutions"]:
            raise RuntimeError(f"{slug}: '{exercise['heading']}' needs one starter and one solution before migration")
        # parse_exercises records the opening fence's 1-based line number.
        starter_open = exercise["starters"][0]["line"] - 1
        starter_close = starter_open + 1
        while starter_close < len(lines) and lines[starter_close].strip() != "```":
            starter_close += 1
        if starter_close >= len(lines):
            raise RuntimeError(f"{slug}: unclosed starter for {exercise['heading']}")
        solution_start = exercise["solutions"][0]["line"]
        solution_close = solution_start
        while solution_close < len(lines) and lines[solution_close].strip() != ":::":
            solution_close += 1
        code_range = code_block_range(lines, solution_start, solution_close)
        if not code_range:
            raise RuntimeError(f"{slug}: no code block in solution for {exercise['heading']}")
        code_open, code_close = code_range
        old_code = "\n".join(lines[code_open + 1:code_close])

        heading_index = None
        search_start = 0
        if exercise["section"] == "make it yourself":
            for index, line in enumerate(lines[:starter_open]):
                if line.strip().lower() == "## make it yourself":
                    heading_index = index
            if heading_index is None:
                heading_index = starter_open
        else:
            for index, line in enumerate(lines[:starter_open]):
                if line.startswith("### ") and line[4:].strip() == exercise["heading"]:
                    heading_index = index
            if heading_index is None:
                heading_index = starter_open
        task_lines = []
        for line in lines[heading_index + 1:starter_open]:
            if line.strip().startswith((":::tip", "```expected")):
                break
            if line.strip() and not line.strip().startswith(":::"):
                task_lines.append(line.strip())
        task = " ".join(task_lines)
        exercise["task"] = task
        data_lines = get_data_lines(exercise, slug)
        if not data_lines:
            raise RuntimeError(f"{slug}: no literal starter data for {exercise['heading']}")
        # Prefix the exact data assignments shown in the starter to the solution source.
        old_code = special_code(slug, exercise["heading"], old_code, data_lines)
        updated_task = simplify_task(task, slug, exercise["heading"], data_lines)
        solution_lines = old_code.lstrip("\n").splitlines()
        # Keep each starter assignment once, at the very start of the solution.
        while solution_lines and solution_lines[0].strip() in data_lines:
            solution_lines.pop(0)
        solution_code = "\n".join(data_lines + solution_lines)
        output = run_solution(solution_code)
        starter_instruction = f"# Complete the {exercise['heading']} task."
        starter_body = [starter_instruction, *data_lines, "# Write your code below"]
        expected_block = ["```expected", output, "```"]
        hint_block = [":::tip Hint", hint_text(slug, exercise["heading"]), ":::"]

        prepared.append({
            "exercise": exercise,
            "task": task,
            "updated_task": updated_task,
            "starter_open": starter_open,
            "starter_close": starter_close,
            "starter_body": starter_body,
            "solution_open": code_open,
            "solution_close": code_close,
            "solution_code": solution_code.splitlines(),
            "expected": expected_block,
            "hint": hint_block,
            "output": output,
        })

    for item in sorted(prepared, key=lambda entry: entry["starter_open"], reverse=True):
        start = item["starter_open"]
        close = item["starter_close"]
        lines[start + 1:close] = item["starter_body"]
        # Update line indexes after replacing starter lines, then add hint and expected blocks.
        delta = len(item["starter_body"]) - (close - start - 1)
        solution_open = item["solution_open"] + (delta if item["solution_open"] > start else 0)
        solution_close = item["solution_close"] + (delta if item["solution_close"] > start else 0)
        lines[solution_open + 1:solution_close] = item["solution_code"]
        if item["task"] != item["updated_task"]:
            # Rebuild just the task paragraph, preserving the exercise heading and starter order.
            before = start
            heading_index = None
            for index in range(before - 1, -1, -1):
                if lines[index].startswith("### ") or lines[index].strip().lower() == "## make it yourself":
                    heading_index = index
                    break
            if heading_index is not None:
                end = heading_index + 1
                while end < len(lines) and not lines[end].strip().startswith((":::tip", "```expected", "```python run")):
                    end += 1
                lines[heading_index + 1:end] = ["", item["updated_task"], ""]
                shift = 3 - (end - heading_index - 1)
                start += shift
                item["starter_open"] += shift
        # Add the hint and expected block immediately before the starter.
        insert_at = item["starter_open"]
        lines[insert_at:insert_at] = ["", *item["hint"], "", *item["expected"], ""]
        REPORT.append((slug, item["exercise"]["heading"], item["task"], item["updated_task"]))

    return "\n".join(lines) + "\n", len(prepared), sum(
        1 for item in prepared if item["task"] != item["updated_task"]
    )


def main():
    lesson_files = sorted(glob.glob("content/lessons/*/lesson.md"))
    total = 0
    changed_tasks = 0
    migrated_files = []
    for path in lesson_files:
        updated_content, exercises, changed = migrate_file(path)
        migrated_files.append((path, updated_content))
        total += exercises
        changed_tasks += changed
        if exercises:
            print(f"{os.path.basename(os.path.dirname(path))}: {exercises} exercises, {changed} task rewrites")
    for path, updated_content in migrated_files:
        with open(path, "w", encoding="utf-8") as target:
            target.write(updated_content)
    kept = total - changed_tasks
    lines = [
        "# Exercise task changes",
        "",
        f"Kept as is: {kept}. Rewritten: {changed_tasks}.",
        "",
        "Each entry shows the task text before and after the clarity edit. Mechanical starter, expected-output, hint, and solution changes are verified separately.",
        "",
    ]
    for slug, title, before, after in REPORT:
        if before != after:
            clean_before = re.sub(r"\s+", " ", before).strip()
            clean_after = re.sub(r"\s+", " ", after).strip()
            lines.append(f"- **{slug} — {title}:** {clean_before} → {clean_after}")
    with open("scripts/lesson_exercise_report.md", "w", encoding="utf-8") as report:
        report.write("\n".join(lines) + "\n")
    print(f"\nExercises found: {total}; kept as is: {kept}; task rewrites: {changed_tasks}.")


if __name__ == "__main__":
    main()
