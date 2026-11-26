---
title: "Virtual environments and pip"
curriculumTitle: "Virtual environments and pip"
track: "Python from zero"
module: "M8 Advanced"
order: 44
level: "Intermediate"
summary: "Create an isolated Python environment and use pip to manage project packages."
runnableMin: 3
prerequisites:
  - "Regular expressions"
learningGoals:
  - "Explain why a project uses a virtual environment"
  - "Create and activate a venv with terminal commands"
  - "Install and inspect packages with python -m pip"
  - "Keep project dependencies separate and reproducible"
relatedProblems: []
---

## What you will learn

- What a **virtual environment** is and why projects use one
- How to create and activate an environment with `venv`
- How to install a package with **pip** using the selected Python interpreter
- How to list or record a project's installed packages
- How to avoid installing packages into the wrong Python environment

## Why this matters

One project may need a library version that another project does not use. Installing every package into one shared Python can cause dependencies to conflict and make it hard to reproduce a working setup. A virtual environment gives a project its own package location while still using the Python installation that created it. `pip` then installs packages into that environment when it is active.

## The big idea

Think of a virtual environment as a separate toolbox shelf for one project. The Python executable and installed packages in that shelf are isolated from other project shelves. The tool `venv` creates the environment, and `pip` places packages into it.

A **virtual environment** is a directory containing an isolated Python environment. It usually uses the standard library modules from the base installation but has its own site-packages area for third-party packages. **pip** is a package installer. The safest command pattern is `python -m pip`, because it runs pip through the specific Python interpreter named by `python`.

## Step by step

### Check the Python version first

Use the interpreter you intend to use for the project. A project environment inherits its Python version from the executable that creates it.

```bash
python3.12 --version
```

Sample output from the lesson interpreter:

```output
Python 3.12.11
```

The printed patch version can differ across installations, but the major and minor version here are 3.12. If a project requires a specific Python version, check it before creating the environment.

```python run
import sys

print(sys.version_info.major)
print(sys.version_info.minor)
print(sys.version_info >= (3, 12))
```

```output
3
12
True
```

This small check can verify a version requirement inside a Python program. It does not create or activate an environment. Use terminal commands for those tasks.

### Create a project environment

From the project folder, run `python3.12 -m venv .venv`. The final argument is the directory where the environment will be created. `.venv` is a common name, and the leading dot makes it hidden in many file browsers.

```bash
python3.12 -m venv .venv
```

Successful creation is quiet: the command normally returns to the shell prompt without printing a message. The folder contains a Python executable and supporting environment files. Do not create `.venv` inside a directory that should be shared or committed; add it to your ignore rules if your project uses version control.

To inspect the available options without creating an environment, Python's `venv` module accepts `--help`:

```bash
python3.12 -m venv --help
```

Sample output from Python 3.12.11:

```output
usage: venv [-h] [--system-site-packages] [--symlinks | --copies] [--clear]
            [--upgrade] [--without-pip] [--prompt PROMPT] [--upgrade-deps]
```

The options control how the environment is created. For a first project, the basic command is sufficient; use special flags only when you understand the effect you need.

### Activate the environment in a macOS or Linux shell

Activation adjusts the current shell so commands such as `python` and `pip` resolve to the environment. In bash or zsh, use:

```bash
source .venv/bin/activate
```

The prompt commonly gains a `(.venv)` prefix. The exact prompt is controlled by the shell and environment name, so it may look different. To stop using the environment in that shell, run `deactivate`.

```bash
deactivate
```

Activation changes the shell session only. It does not permanently change system Python. You can also call the environment's Python by its path without activating it, which is useful in scripts and automation.

### Activate in Windows shells

The activation command depends on the shell. In Command Prompt, use `.venv\Scripts\activate.bat`; in PowerShell, use `.venv\Scripts\Activate.ps1`. The directory name differs from the macOS and Linux `bin` folder.

```bash
.venv\Scripts\activate.bat
```

These commands affect only the terminal where they run. If PowerShell blocks a script, follow your organization's policy instead of changing security settings without understanding them. You can avoid activation by invoking `.venv\Scripts\python.exe` directly.

### Use pip through the active interpreter

Once the environment is active, install a package by running pip as a module. This example shows the command form; package names and versions should be chosen for the project.

```bash
python -m pip install rich
```

pip downloads and installs the package and its required dependencies into the active environment. The output lists the packages installed and their versions. Network access and package availability affect the exact installation output, so check your own terminal after running the command.

Prefer `python -m pip` over bare `pip`. If several Python versions are installed, a bare `pip` command may point to a different interpreter than the one running your program. The module form keeps the installer tied to `python`.

### Confirm which Python is active

The `which` command on macOS and Linux shows the executable found first on the shell path. In Windows Command Prompt, use `where python`.

```bash
which python
```

While the environment is active, the result should end in `.venv/bin/python`. The full path depends on where the project folder is stored. If it points somewhere else, activate the environment again or call its Python by the full path.

### Check that pip is available

Run `python -m pip --version` while the environment is active. It prints the pip version and the Python location associated with that pip installation. The base Spyder runtime used to verify this lesson does not have the `pip` module installed directly, so I checked its bundled bootstrap version with `ensurepip` instead.

```bash
python3.12 -m ensurepip --version
```

```output
pip 25.0.1
```

This output came from the lesson interpreter. It reports the pip version bundled for bootstrapping; it does not mean that the base interpreter already has pip installed as a module. New virtual environments normally bootstrap pip unless created with the `--without-pip` option. Your environment may use a different version.

If pip is unavailable, the `ensurepip` module can bootstrap pip when included by that Python distribution. Check `python -m ensurepip --version` first. Some redistributors omit it; in that case, follow the installation guidance for the Python distribution you installed rather than copying files between environments.

### List installed packages

Use `python -m pip list` to inspect packages available in the active environment. This is useful for checking that a dependency is installed where your project runs.

```bash
python -m pip list
```

The output is a table with package names and versions. A newly created environment starts with only the tools it bootstraps, so its list is usually shorter than the base Python's packages. Run the command from the same environment that runs the project.

### Record dependencies for a small project

`python -m pip freeze` prints installed distributions and their pinned versions. Save that output in a requirements file when you need to reproduce an environment. A requirements file belongs to the project and should list only dependencies the project needs.

```bash
python -m pip freeze
```

To install the packages listed in a requirements file later, use `python -m pip install -r requirements.txt`. The file's entries are package requirements, not Python source code. For larger projects, use a dependency-management workflow suited to the project rather than treating a full environment dump as a carefully curated dependency list.

### Run a script with the environment's Python

With the environment active, `python app.py` uses the environment interpreter. Without activation, call its Python executable directly: `.venv/bin/python app.py` on macOS and Linux, or `.venv\Scripts\python.exe app.py` on Windows.

```python run
commands = [
    "python -m pip install rich",
    "python app.py",
    "python -m pip freeze",
]
for command in commands:
    print(command)
```

```output
python -m pip install rich
python app.py
python -m pip freeze
```

These are strings displayed by the program, not commands executed by Python. The actual commands belong in the terminal. Keeping this distinction clear prevents a code example from looking as if it installed a package when it did not.

## What Python is doing behind the scenes

Creating a virtual environment writes an isolated directory structure and records where its base Python lives. Activation changes the shell's search path so the environment's executable and scripts are found first. The environment's `sys.prefix` identifies its root, while `sys.base_prefix` identifies the base Python installation; they differ when a virtual environment is active.

When you run `python -m pip`, Python imports the `pip` module associated with that interpreter and executes it. This avoids ambiguity when multiple interpreters or environments are installed. Packages installed into the environment appear in its site-packages directory and can be imported by programs run with that environment's Python.

| Command | What it does |
|---|---|
| `python3.12 -m venv .venv` | Creates an isolated environment directory |
| `source .venv/bin/activate` | Adjusts a Unix-like shell to use it |
| `python -m pip install package` | Installs a package for the active interpreter |
| `python -m pip list` | Shows installed distributions |
| `python -m pip freeze` | Prints pinned package requirements |
| `deactivate` | Restores the shell's prior command lookup |

An environment isolates third-party packages; it does not copy your project source or protect against unsafe code. Keep the environment folder out of source control and recreate it from documented dependencies when needed. Choose a supported Python version and package versions that work together.

## Common mistakes

### Installing into the wrong Python

If `pip` is not tied to the Python that runs your program, the import may still fail. Run `python -m pip install ...` with the same `python` command used to run the program, and inspect `which python` or `where python`.

### Forgetting to activate the environment

Opening a new terminal starts a new shell session. Activate the environment again in that terminal or call its Python executable by full path.

### Treating `.venv` as project source

The environment contains generated executables and installed packages. Do not commit it or copy it between operating systems. Store dependency instructions and recreate the environment instead.

### Installing everything globally

Global installation can affect unrelated projects. Create one environment per project or per compatible group of projects and install dependencies there.

### Confusing an import name with a package name

The name used by `pip install` can differ from the name used by `import`. Read the package documentation for the correct pair rather than guessing based on punctuation.

## Cheat sheet

| Task | macOS/Linux command |
|---|---|
| Create | `python3.12 -m venv .venv` |
| Activate | `source .venv/bin/activate` |
| Deactivate | `deactivate` |
| Install | `python -m pip install package_name` |
| Inspect | `python -m pip list` |
| Record | `python -m pip freeze` |
| Reinstall list | `python -m pip install -r requirements.txt` |

## Try it yourself

### Easy: identify the requested Python version

Read the version tuple in a Python 3.12 interpreter and print its major and minor components.

```python run
# Complete the identify the requested Python version task.
# Sample data: version_info = (3, 12, 0)
# Write your code below and print the result
```


:::solution
`sys.version_info` stores the running interpreter version. The major and minor fields produce the stable `3.12` form.

```python
import sys

print(f"{sys.version_info.major}.{sys.version_info.minor}")
```
:::

### Medium: write down a project command sequence

Print the commands you would run to create and populate an environment. Run each command in a terminal when setting up a real project.

```python run
# Complete the write down a project command sequence task.
# Sample data: steps = ['python3.12 -m venv .venv', 'source .venv/bin/activate', 'python -m pip install rich']
# Write your code below and print the result
```


:::solution
The list represents a setup plan. Python prints the command strings; it does not execute them. Run them in the appropriate terminal to create and use an environment.

```python
steps = [
    "python3.12 -m venv .venv",
    "source .venv/bin/activate",
    "python -m pip install rich",
]
for step in steps:
    print(step)
```
:::

### Challenge: explain why module-form pip is safer

Build a command string using the same interpreter name for running a script and pip.

```python run
# Complete the explain why module-form pip is safer task.
# Sample data: python_name = 'python'
# Write your code below and print the result
```


:::solution
Both commands begin with the same `python` executable. That keeps pip associated with the interpreter that will run the project.

```python
python_name = "python"
print(f"{python_name} -m pip install package_name")
print(f"{python_name} app.py")
```
:::

## Recap

- A virtual environment isolates a project's installed packages from other environments.
- Create one with `python3.12 -m venv .venv` and activate it in the current shell.
- Use `python -m pip` to ensure pip belongs to the intended interpreter.
- Inspect and record dependencies with `pip list` and `pip freeze`.
- Recreate environments from dependency instructions instead of sharing the `.venv` directory.

Reference: Python documentation, Installing Python Modules
