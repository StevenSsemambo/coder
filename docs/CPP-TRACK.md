# The C++ track: C++ from Zero

Course id `cpp-start`, language id `cpp`. Files: `src/content/cpp/` (lessons), `src/content/cpp-course.js`
(the course list), `tests/solutions-cpp.mjs` (reference solutions). Owner: the C++ account.

Files by lesson: `level1.js` (1 to 3), `level2.js` (4), `switch.js` (5), `loops.js` (6 to 8), `till.js` (9), `functions.js` (10 to 12), `momo.js` (13), `arrays.js` (14 to 16), `text.js` (17).

Running project: **Mama Rose's Rolex Stand**, a rolex (chapati rolled round an omelette) stall beside the
campus gate. Learners meet it in lesson 1 (the chalkboard menu) and finish Part A by building its till.

The track has two parts because C++ has two very different halves:

* **Part A** (what C++ shares with C, plus streams): runs today on the built-in interpreter (JSCPP).
* **Part B** (strings, vectors, references, classes, templates, the standard library, memory, files):
  does **not** run on JSCPP at all. It needs a real compiler. See "Feasibility of a real C++ compiler".

## Roadmap

`[x]` written and tested, `[ ]` still to write. Lesson ids never change once published. Exercise ids
start with `cpp<lesson number>-`.

### Part A: runs today on the built-in interpreter

**Level 1: Getting started**
- [x] 1. `cpp-first` Your first C++ program (`cout`, `endl`, escapes, comments)
- [x] 2. `cpp-vars` Variables and input (`int`, `double`, `char`, `cin`, `setprecision`)
- [x] 3. `cpp-types` Numbers, characters and operators (integer division, `%`, casting, `const`, ASCII)

**Level 2: Decisions and loops**
- [x] 4. `cpp-decide` Making decisions (`if`, `else if`, `&&` `||` `!`, `? :`)
- [x] 5. `cpp-switch` `switch`, nested decisions, `bool`
- [x] 6. `cpp-loops` Repeating with `for`
- [x] 7. `cpp-while` `while`, `do while`, `break`, `continue`
- [x] 8. `cpp-nested` Loops inside loops: patterns and tables (with `setw`)
- [x] 9. `cpp-rolex` Project: Mama Rose's till (sentinel loop, `switch`, `bool`, receipt with `setw`)

**Level 3: Functions**
- [x] 10. `cpp-functions` Functions: define, call, return, prototypes, `bool` functions
- [x] 11. `cpp-scope` Parameters are copies, local and global variables, `static`, default arguments (written in the definition, see limits)
- [x] 12. `cpp-recursion` Recursion: base case, tracing, factorial, Fibonacci, GCD
- [x] 13. `cpp-momo` Project: a Mobile Money kiosk built from small functions (lesson id is `cpp-momo`)

**Level 4: Arrays and text**
- [x] 14. `cpp-arrays` Arrays: index from 0, loops, partial initialisation, boundaries
- [x] 15. `cpp-array-algos` Arrays in functions, maximum, linear search, reverse, bubble sort
- [x] 16. `cpp-2d` Two-dimensional arrays: row and column totals, tables in functions
- [x] 17. `cpp-cstrings` Text as `char` arrays, `cin`/`getline`, `<cstring>`, `<cctype>`

**Level 5: Pointers**
- [ ] 18. `cpp-pointers` Addresses and pointers, pointers and arrays

### Part B: blocked until a real compiler is in the app

`std::string` and `getline`, `std::vector`, references (`int &x`), function overloading, `struct`, `enum`,
classes (constructors, private/public, getters), inheritance, `virtual`, templates, `auto` and range-for,
`new`/`delete`, namespaces, the STL algorithms, file streams, exceptions, and the final project (a stock
system with classes and files). **None of these run today.** Lessons for them cannot be proved by the tests,
so they are not written.

## What the built-in interpreter can and cannot do for C++

JSCPP is a C and C++ **teaching subset** interpreter. Everything below was **run on the app's own bundle**
(the patched `public/vendor/jscpp.js` after `scripts/prepare-runtimes.mjs`), not assumed.

| Works | Does not work |
|---|---|
| `#include <iostream>`, `cout`, `cin`, `endl`, `\n`, chaining `<<` and `>>` | `<string>` (`std::string`, `getline`), `<vector>`, any other STL header |
| `<iomanip>`: `setw`, `setprecision`, `fixed`, `setfill` | `left`, `right`, `boolalpha`, `cerr` |
| `int`, `double`, `float`, `char`, `bool`, `long long`, `unsigned` | `auto`, range-for (`for (int x : a)`), `static_cast<>` (use `(double)x`) |
| `if`, `else if`, `switch`, `?:`, `for`, `while`, `do while`, `break`, `continue` | `struct`, `enum`, `class`, constructors, inheritance, `virtual` |
| Functions, recursion, globals, `static` locals, default arguments **written in the function definition** | Default arguments written in a prototype, function **overloading** (`ambiguous method invoking`) |
| 1D and 2D arrays, `char` arrays with `cin >> name` and `cin.getline(s, n)` | References (`int &x`), templates, namespaces (`std::cout` with no `using`), `new`/`delete` |
| Pointers to variables, pointer arithmetic, `sizeof`, casts `(double)x`, `const`, `#define` | `try`/`catch`, `nullptr`, lambdas |
| `<cmath>` (`sqrt pow abs`), `<cstring>` (`strlen strcpy strcat strcmp`), `<cctype>`, `<cstdlib>` | |

Behaviours that differ from real C++ (say so honestly in lessons where they matter):

- **A double prints with too many digits** by default (`10.0 / 3` prints `3.3333333333333335`, real C++ prints
  `3.33333`). Lessons always print decimals with `fixed << setprecision(2)` and use neat numbers.
- `cin >> n` with **empty input** does not stop with an error. It stores `NaN` and the program carries on.
  `cin >>` into a `bool` stops with "input format mismatch": read an `int` and compare it instead.
- An `int` that overflows (about 2 billion) **stops with an error**. Real C++ silently wraps.
- Dividing an integer by zero **stops with an error**. In real C++ it is undefined behaviour.
- Reading a variable that was never given a value prints `NaN`. Real C++ prints a random number.
- Two **identical `case` labels** in one `switch` are accepted here (a real compiler refuses). `continue` inside a
  `switch` that is not inside a loop misbehaves. Lessons never rely on either.
- A variable **declared after `main` closes** still counts as a global here, so a "put these lines in order"
  puzzle that has a declaration line can be solved in a wrong order. Keep declarations in the fixed first block.
- **Recursion depth is limited**: about 400 nested calls work and 500 stop with "Maximum call stack size exceeded"
  (real C++ allows tens of thousands). Lessons keep recursion small and say so.
- A **default argument written in a prototype** does not work here (`method ... does not seem to be implemented`).
  Lessons write the full function, with its defaults, above `main`. Function **overloading** is also not available.
- A call **before** a function's definition runs here without a prototype, but a real compiler refuses it. Lessons
  say so and always define the function above `main` or write a prototype.
- A non-`void` function that reaches its end without `return` stops with "you must return a value" (real C++ only warns).
- **Arrays:** reading or writing outside an array **stops the program** with "index out of bound" (real C++ does
  not stop; it corrupts memory). An array created with no values prints `NaN`. `sizeof(arr)/sizeof(arr[0])` inside a
  function that received the array gives the wrong answer, so lessons always pass the size as a parameter.
- **Array assignment** (`b = a`, or `s = "abc"` for a `char` array) is accepted here but is a compile error in real
  C++. `char s[3] = "Kampala"` is silently cut to `Kam` here (real C++ refuses). Variable-length arrays
  (`int a[n]`) work here but are not standard C++. Lessons use a `const` size or a fixed maximum.
- **A `char` array filled by `cin >>` or `cin.getline` cannot be changed letter by letter** ("is not a left value").
  Arrays created from quoted text can. So input text is only read, tested and printed. `cin.ignore()` crashes the
  interpreter, so lessons show the "name first, then number" order instead. An array of strings cannot be started
  from string literals (`char names[3][10] = {"Amina", ...}`).
- `isdigit`, `isalpha` and friends print `1` here, but real C++ may print another non-zero number. Lessons use them
  only inside an `if` and say so.
- A table parameter without its column size (`int t[][]`) stops with an error here, as in real C++.
- A `const` **can be changed** here (no error). A real compiler refuses. Lesson 3 says so out loud.
- Leaving out `using namespace std;` still works here when `<iostream>` is included. A real compiler refuses.
  Lessons always write it.
- Everything in the C track's behaviour list (`#define` replacing text inside strings, looser function
  scoping, `scanf`-style quirks) also applies, because the interpreter is the same one.

## Feasibility of a real C++ compiler in the app (Part B)

**Question:** can real C++ (`std::string`, `vector`, classes, templates) compile and run **offline** in a phone
browser? This was tested in Node 22 on the build server on 2026-11-15. It was **not** tested in a browser or on a
phone. Treat every number below as "best case, desktop-class CPU".

Candidate: **`@yowasp/clang`** on npm (LLVM/Clang/LLD built for WebAssembly, targets WebAssembly).

| Measured | Result |
|---|---|
| Package on disk | 101 MB (`llvm.core.wasm` 75.5 MB, `llvm-resources.tar` 29.7 MB) |
| **Download if gzipped** | about **27 MB** (22.7 MB + 4.2 MB). Brotli would be smaller; not measured. |
| Compile "Hello" (first run, includes loading the compiler) | 6.1 s |
| Compile a program with `std::string`, `std::vector`, a class, `auto` and range-for | 2.7 s, output `.wasm` about 0.6 MB |
| That program, run under WASI | printed `Sugar total 7500`, correct |
| Standard library | libc++ headers and libraries are bundled (1,911 files in the resource archive) |

**Problem found:** with default flags a program that uses `std::string` or `std::vector` **fails to link** with
`undefined symbol: __cxa_allocate_exception`. Adding **`-fno-exceptions`** fixes it. So `try`/`catch`/`throw`
are unavailable unless a way is found to link the exception runtime. Exceptions lessons are blocked until then.

**What it needs from the engine** (engine owner decides):

1. A new Web Worker that loads the compiler, compiles the learner's code, then runs the `.wasm` with a WASI
   shim (`@bjorn3/browser_wasi_shim`, 115 KB of plain JavaScript, is one option) wired to the **Input** box
   (stdin) and the output panel (stdout).
2. A **run time limit**: a WebAssembly infinite loop cannot be interrupted by a normal timeout. Terminating the
   worker is the only reliable stop, as the app already does for JSCPP.
3. An **optional download** like Python's 13 MB pack (Settings, on Wi-Fi), stored in Cache Storage and served
   by `public/pack-sw.js`. At about 27 MB it is double Python's size.
4. Compiler error messages are real Clang messages. `src/lib/errors.js` needs rules to translate the common
   ones into plain English and Kiswahili.

**Not yet known (must be tested before any Part B lesson is written):**

- Does it compile and run in a **browser worker** at all (the package README says WASI support is uneven)?
- **Time and memory on a real low-end Android phone.** A compile that takes 3 s here could take 30 s there, or
  run out of memory with a 75 MB module.
- Does it work with the service worker and Cache Storage fully **offline**?
- Licences (LLVM and the YoWASP package) must be read before shipping.

**Recommendation:** treat Part B as an optional "real C++" pack. First task for the engine owner: a small
proof page that compiles and runs three programs in a browser worker on a real phone and reports the times.
If the numbers are bad, the fallback is to extend JSCPP with `std::string`, `vector`, `struct` and `class`, which is
a big job and still not the real language.

## Engine files this track touched (all additive; C, Python and Web behave exactly as before)

| File | Change |
|---|---|
| `src/lib/runners.js` | `cpp` runner, using the same `c.worker.js` as C (its own worker instance) |
| `src/lib/csource.js` | `prepareSource('cpp', ...)` normalises like C |
| `src/lib/editor.js`, `src/lib/symbols.js` | C++ syntax colouring and a symbol bar with `<<` and `>>` |
| `src/lib/errors.js` | new rules `cpp-missing-iostream` and `cpp-stack` (C++ only); C++ also uses the C rules; `timeout` covers `cpp` |
| `src/ui/views/learn.js` | label `C++` |
| `src/content/index.js` | one import and one entry in the registry |
| `tests/run.mjs`, `tests/solutions.mjs` | C++ runs on the C runner; 6 new error-translator checks; `cppSolutions` merged |

## Lesson style for C++

Same rules as every track (`docs/TRACKS.md`), plus:

- Show whole programs. A learner must see `#include`, `using namespace std;`, `main` and `return 0;` until they
  are second nature. Use `prog()` in `src/content/cpp/shared.js`.
- Every example is a complete program that the tests run on the real interpreter.
- Always give `stdin` for programs that read, so the example runs with one tap.
- Use `int` for UGX. Print decimals only with `fixed << setprecision(2)` and neat numbers.
- Never rely on anything in the right-hand column above, or on any behaviour in the "differs from real C++" list.
- Teach C++ habits that stay true on a real compiler: `cout`/`cin` direction, `bool`, `const`, `// comments`.
