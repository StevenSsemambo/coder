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

### Level 7: Data and algorithms (lessons 42 to 46) - DONE
- [x] 42 `py-bigo`: Big-O in plain words (steps are counted, never timed)
- [x] 43 `py-search-hash`: binary search, hashing (a toy hash table), recursion and memoization
- [x] 44 `py-structures`: stacks, queues (`deque`) and linked lists
- [x] 45 `py-csv`: CSV and data cleaning
- [x] 46 `py-project-analyzer`: Project: sales analyzer with a reusable data pipeline

### Level 8: Building real products (lessons 47 to 52) - DONE
- [x] 47 `py-packages`: project structure, modules and packages (files are written with Python, then imported)
- [x] 48 `py-cli`: command-line apps with argparse (word lists passed in; SystemExit always caught), config, menus
- [x] 49 `py-sqlite`: SQLite from Python (links to the SQL track)
- [x] 50 `py-api`: APIs and JSON responses (a pretend server, `fake_api`, stands in for the network)
- [x] 51 `py-logging`: logging, debugging, counting calls and timing
- [x] 52 `py-project-duuka`: Project: Duuka Manager (SQLite + command line + logging + tests)

### Level 9: Capstones and the path forward (lessons 53 to 57)
- [x] 53 `py-async`: concurrency with real asyncio (top-level `await`; threads are explained, not run)
- [x] 54 `py-backend`: how a web backend thinks (a 25-line MiniApp stands in for Flask)
- [x] 55 `py-shipping`: packaging and shipping (tomllib, versions, entry points, zipfile, checksums)
- [ ] 56 Where to go next: web, data, AI, automation
- [ ] 57 Final capstone: a small business system

Lesson 38 carries special methods and dataclasses together; if the exercises show it is too much, it is
split and later lessons are renumbered here.

## Runtime notes (found while testing)
- Pyodide here runs Python 3.14. `urllib` network calls and `threading.Thread` raise `RuntimeError` in the browser.
- An uncaught `SystemExit` (what `argparse` does on bad input) ends the whole test process. Always catch it.
- `sys.modules` keeps imported modules between runs, so lessons write modules with a helper that forgets the old copy first.
- The editor program has no `__name__ == "__main__"` of its own, so the main guard is taught inside module files (run with `runpy`).
- The editor runs code with `runPythonAsync`: top-level `await` works, `asyncio.run()` does not. A coroutine that is created and never awaited prints a `RuntimeWarning` later, in whichever run happens to trigger garbage collection, so never leave one behind in a runnable example.
- `logging.disable(...)` and `basicConfig` state leak between runs, so examples start with `logging.disable(logging.NOTSET)` and `force=True`.
- Print `Row` or `with con:` results only after `commit()`: a rollback also undoes uncommitted setup.

## Checklist for every lesson
Story first, recap last, at least 2 interactive blocks, a mistake museum, every exercise with exactly 3
hints and a hidden test, a reference solution in `tests/solutions-py.mjs`, starter must fail.
