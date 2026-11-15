# Python track (course id `py-start`)

Owner: Python account. Files: `src/content/py/`, `src/content/python-course.js`, `tests/solutions-py.mjs`
(Python solutions from Level 6 on), this file.

Levels 1 to 5 (35 lessons, 68 exercises) were written first. This file plans the rest, agreed with the
project owner on 2026-11-16. The goal of Levels 6 to 9: take a learner from "I can write programs"
to "I can build and ship a small, real product".

Exercise ids: lesson number minus one, so lesson 36 uses `py35-...`, lesson 37 uses `py36-...`.
Running project style: Mama Rose's Duuka, Mobile Money, boda boda, UGX amounts.

## How Python runs

Python is Pyodide (CPython on WebAssembly) in a Web Worker, offline after the Settings download.
Real network calls, threads, a Flask server and installing packages do **not** work in the browser.
Lessons on those topics teach the idea with a simulated or mock version that does run (a fake API
function that returns JSON text, a pretend request handler). Say so plainly in the lesson. Every example
is run by `npm test`, so nothing is taught that does not work.

## Roadmap

### Level 6: Writing Python like a professional (lessons 36 to 41) - DONE
- [x] 36 `py-decorators`: functions as values, closures, decorators
- [x] 37 `py-context`: `with`, `@contextmanager`, `raise`, custom exceptions
- [x] 38 `py-special`: `__str__`, `__eq__`, `__len__`, `@property`, dataclasses
- [x] 39 `py-typing`: type hints, docstrings and clean-code habits
- [x] 40 `py-regex`: regular expressions
- [x] 41 `py-project-ledger`: Project: customer ledger with proper error handling

### Level 7: Data and algorithms (lessons 42 to 46)
- [ ] 42 Big-O in plain words
- [ ] 43 Searching, hashing and recursion in depth
- [ ] 44 Stacks, queues and linked structures
- [ ] 45 CSV and data cleaning
- [ ] 46 Project: sales analyzer with a reusable data pipeline

### Level 8: Building real products (lessons 47 to 52)
- [ ] 47 Project structure, modules and packages
- [ ] 48 Command-line apps (arguments, menus, config)
- [ ] 49 SQLite from Python (links to the SQL track)
- [ ] 50 APIs and JSON responses (simulated)
- [ ] 51 Logging, debugging and profiling
- [ ] 52 Project: Duuka Manager (SQLite + command line + tests)

### Level 9: Capstones and the path forward (lessons 53 to 57)
- [ ] 53 Concurrency basics (threads vs async, explained simply)
- [ ] 54 How a web backend thinks (Flask ideas, simulated)
- [ ] 55 Packaging and shipping a Python app
- [ ] 56 Where to go next: web, data, AI, automation
- [ ] 57 Final capstone: a small business system

Lesson 38 carries special methods and dataclasses together; if the exercises show it is too much, it is
split and later lessons are renumbered here.

## Checklist for every lesson
Story first, recap last, at least 2 interactive blocks, a mistake museum, every exercise with exactly 3
hints and a hidden test, a reference solution in `tests/solutions-py.mjs`, starter must fail.
