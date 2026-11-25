---
title: "async and await basics"
curriculumTitle: "async and await basics"
track: "Python from zero"
module: "M8 Advanced"
order: 45
level: "Advanced"
summary: "Learn how async functions and await let an event loop coordinate waiting tasks."
runnableMin: 3
prerequisites:
  - "Virtual environments and pip"
learningGoals:
  - "Recognize a coroutine function and coroutine object"
  - "Use await inside an async function"
  - "Run a simple async program with asyncio.run()"
  - "Explain how awaiting lets other tasks make progress"
relatedProblems: []
---

## What you will learn

- What **asynchronous programming** is useful for
- How `async def` defines a coroutine function
- How `await` pauses a coroutine while an awaitable operation completes
- How `asyncio.run()` starts and finishes a simple async program
- Why asynchronous code helps with waiting tasks but does not make every calculation faster

## Why this matters

A program that waits for a response from a web service or a timer can spend much of its time doing nothing. If it has several waiting tasks, asynchronous code can let one task make progress while another is waiting. This is useful for coordinating input and output without blocking the whole program. It adds structure and rules, so use it only when the program has work that can benefit from cooperative waiting.

## The big idea

Imagine several cooks sharing one kitchen. While one pot takes time to simmer, a cook can prepare another dish, then return when the pot is ready. An **event loop** coordinates tasks, and `await` marks a place where a coroutine can pause and let other work proceed.

An **asynchronous function** is written with `async def`. Calling it creates a **coroutine object**, which represents work that can be awaited or scheduled. The call does not run the whole function immediately. `await` is used inside an async function to wait for an awaitable result. Python's standard `asyncio` module provides an event loop and tools for running such code.

## Step by step

### Define an asynchronous function

Use `async def` to define a coroutine function. You can inspect the function without running an event loop to understand that it is asynchronous.

```python run
import inspect

async def fetch_score():
    return 42

print(inspect.iscoroutinefunction(fetch_score))
```

```output
True
```

The function is marked as a coroutine function. Calling `fetch_score()` would create a coroutine object rather than immediately returning the integer 42. The function's body runs when that coroutine is awaited or scheduled.

### Notice the coroutine object

Calling an async function creates a coroutine object. In this browser-safe example, check its type and close it without executing the body, so it does not create an unawaited-coroutine warning.

```python run
import inspect

async def read_notice():
    return "Practice starts at noon"

pending = read_notice()
print(inspect.iscoroutine(pending))
pending.close()
```

```output
True
```

The object represents a computation that is not yet complete. We close it here because the example is only inspecting its type; a real program would await it or schedule it instead.

### Await a coroutine inside another coroutine

An async function can await another coroutine. This example shows the syntax and structure; the terminal section below demonstrates running it with Python 3.12.

```python run
import inspect

async def read_temperature():
    return 24

async def weather_message():
    temperature = await read_temperature()
    return f"Temperature: {temperature} C"

print(inspect.iscoroutinefunction(weather_message))
```

```output
True
```

`await` appears inside the async function body and waits for the result of `read_temperature()`. The code block checks the outer function's coroutine status so it can run safely in the browser without starting an event loop.

### Run an async operation in a terminal

For a standalone Python script, `asyncio.run()` creates an event loop, runs the top-level coroutine, then closes the loop when it finishes. Use it once at the program's entry point.

```bash
python3.12 -c 'import asyncio; print(asyncio.run(asyncio.sleep(0, result="ready")))'
```

```output
ready
```

This command was run with Python 3.12.11. `asyncio.sleep()` is an awaitable operation. A zero delay completes immediately, and `asyncio.run()` returns its result to the print call.

### Write and run your own coroutine

When code spans multiple lines, put the async function in a `.py` file and run it with the selected interpreter. The code below is plain Python, not a browser runnable block, because `asyncio.run()` may conflict with a browser's already-running event loop.

```python
import asyncio

async def team_update():
    await asyncio.sleep(0)
    return "Falcons are ready"

print(asyncio.run(team_update()))
```

Run it in a terminal with:

```bash
python3.12 async_demo.py
```

Sample output, captured by running the code with Python 3.12.11:

```output
Falcons are ready
```

The coroutine waits at `asyncio.sleep(0)`, then returns its message. Even with no real delay, the example shows where an async operation can yield control.

### Let another task run during a wait

The event loop can coordinate multiple coroutines. In a standalone terminal script, `asyncio.gather()` waits for multiple awaitables and collects their results.

```python
import asyncio

async def station(name):
    await asyncio.sleep(0)
    return f"{name} checked"

async def main():
    results = await asyncio.gather(station("North"), station("South"))
    print(results)

asyncio.run(main())
```

Terminal command:

```bash
python3.12 gather_demo.py
```

Sample output from Python 3.12.11:

```output
['North checked', 'South checked']
```

Both coroutines are scheduled by `gather`. While one is waiting at `sleep`, the event loop can advance another ready coroutine. The final list follows the order in which the awaitables were supplied, not necessarily the order in which they finish.

### Use a delay without blocking the loop

`asyncio.sleep()` pauses the current coroutine without blocking the event loop. By contrast, a regular blocking sleep would stop the thread from advancing other async tasks.

```python
import asyncio

async def pause_then_print():
    print("Start")
    await asyncio.sleep(0.01)
    print("Continue")

asyncio.run(pause_then_print())
```

Run this script from a terminal:

```bash
python3.12 pause_demo.py
```

Sample output:

```output
Start
Continue
```

The sleep duration is short to keep the demonstration quick. The key point is that `await` allows the event loop to schedule other ready tasks during the wait. The program does not need another task for this output, but larger programs often do.

### Keep CPU-heavy work in perspective

Async code is most helpful when tasks frequently wait for asynchronous operations. A long calculation that uses the CPU continuously does not automatically give other coroutines a chance to run. Such work may need a different strategy, outside the scope of this lesson.

```python run
work_items = ["download", "wait", "parse"]
print(" -> ".join(work_items))
print(len(work_items))
```

```output
download -> wait -> parse
3
```

This normal Python example displays a sequence of work stages. Async syntax is not required to join strings or count items; use it for coordination where an operation can yield while waiting.

### Recognize where await is allowed

`await` belongs inside an async function. At the top level of a standard `.py` script, place the await in a coroutine and start it with `asyncio.run()`.

```python run
import inspect

async def calculate_later():
    return 16 * 4

print(inspect.iscoroutinefunction(calculate_later))
```

```output
True
```

This browser-safe runnable code confirms the function is async. A standalone command-line script would call `asyncio.run(calculate_later())` at its entry point to obtain the result.

### Keep error handling around awaited work

An exception raised by an awaited coroutine can propagate to its caller like an exception from ordinary code. Catch only expected errors and give the task a useful response; exception handling was covered in **try and except**.

```python run
async def message_for(result):
    return f"Done: {result}"

print(message_for.__name__)
```

```output
message_for
```

The runnable block checks metadata only. In a terminal script, the coroutine would be awaited by another coroutine or run through `asyncio.run()`. That distinction lets you inspect the syntax in a browser while keeping actual loop execution in the documented terminal workflow.

## What Python is doing behind the scenes

Calling an async function creates a coroutine object. The event loop schedules that coroutine and advances it until it returns or reaches an `await` that is not ready. At that point, the coroutine pauses, allowing another ready task to run. When the awaited operation completes, the loop resumes the paused coroutine with its result.

`asyncio.run()` is a convenient top-level entry point for a normal command-line program. It manages an event loop for the coroutine it receives. Do not call it inside a context where an event loop is already running; notebook and browser environments often provide their own loop.

| Code | Meaning |
|---|---|
| `async def task():` | Defines a coroutine function |
| `task()` | Creates a coroutine object |
| `await task()` | Waits for that coroutine inside async code |
| `asyncio.gather(a(), b())` | Schedules and collects several awaitables |
| `asyncio.run(main())` | Starts a top-level async program in a script |

Concurrency means multiple tasks can make progress during overlapping waits; it does not mean that Python executes all CPU instructions simultaneously. Async programming is cooperative: tasks yield at await points. Choose it when the program has many waits that can be coordinated, not as a decorative replacement for every function.

## Common mistakes

### Calling an async function but never awaiting it

`result = task()` stores a coroutine object, not the function's final result. Await it inside async code or pass it to an event-loop tool such as `asyncio.run()` at the script entry point.

### Writing await outside an async function

In a normal `.py` file, `await` must appear inside an async function. Put the operation in `async def main()` and start it with `asyncio.run(main())`.

### Calling asyncio.run() in an already-running loop

Interactive notebooks and browser runtimes can already have an event loop. In such environments, use the environment's async support rather than starting a second loop with `asyncio.run()`.

### Expecting async to make a calculation faster

Async tasks yield at await points. A long CPU calculation with no awaits can hold up other tasks. Use async for suitable waiting work and choose another approach for CPU-heavy tasks.

### Using blocking work inside an async task

A blocking operation can stop the event loop from running other tasks. Prefer an async-compatible operation when one exists, or use a separate strategy for blocking work.

## Cheat sheet

| Goal | Pattern |
|---|---|
| Define coroutine function | `async def task():` |
| Wait for an awaitable | `result = await operation()` |
| Run top-level coroutine | `asyncio.run(main())` |
| Coordinate several tasks | `await asyncio.gather(task_a(), task_b())` |
| Pause without blocking loop | `await asyncio.sleep(seconds)` |
| Inspect function | `inspect.iscoroutinefunction(task)` |

## Try it yourself

### Easy: identify a coroutine function

Define an async function and use `inspect` to check its kind.

```python run
import inspect

async def start_match():
    return "First serve"

print(inspect.iscoroutinefunction(start_match))
```

```output
True
```

:::solution

An async def statement creates a coroutine function. `inspect.iscoroutinefunction()` reports that status without running it.

:::

### Medium: inspect a coroutine object

Call an async function, check the returned object, then close it because this example does not await it.

```python run
import inspect

async def read_result():
    return "Finished"

pending = read_result()
print(inspect.iscoroutine(pending))
pending.close()
```

```output
True
```

:::solution

Calling the async function creates a coroutine object. Close it in this inspection-only example; real work should be awaited or scheduled.

:::

### Challenge: run a coroutine in a terminal

Write an async function that returns a message after an async sleep, then execute it from a normal Python script with `asyncio.run()`.

```python run
# Try the exercise above using this sample data.
# Sample data: delay_seconds = 0
# Write your code below and print the result
```

```python
import asyncio

async def finish_practice():
    await asyncio.sleep(0)
    return "Practice complete"

print(asyncio.run(finish_practice()))
```

Run in a terminal:

```bash
python3.12 async_practice.py
```

```output
Practice complete
```

:::solution

The top-level `asyncio.run()` starts the loop and runs the coroutine to completion. Inside the coroutine, await pauses at the async sleep before returning the message.

:::

## Recap

- `async def` defines a coroutine function, and calling it creates a coroutine object.
- Use `await` inside async code to wait for an awaitable and yield control.
- `asyncio.run()` is a top-level entry point for standalone scripts.
- Async helps coordinate waiting tasks; it does not automatically speed up CPU-heavy work.
- Avoid starting a new event loop inside an environment that already runs one.

Reference: Python documentation, asyncio — Asynchronous I/O
