# C++ Pro: real C++ (Part B of the C++ track)

Course id `cpp-pro`, language id `cppfull`. Files: `src/content/cpp-pro/` (lessons), `src/content/cpp-pro-course.js`,
`tests/solutions-cpp-pro.mjs`, `tests/realcpp.mjs` (the test back end). Owner: the C++ account.

"C++ from Zero" (`docs/CPP-TRACK.md`, language `cpp`) is Part A: the basics, on the small built-in interpreter. **C++ Pro is
Part B**: everything that makes C++ different from C (strings, vectors, references, classes, templates, the standard
library, smart pointers). None of it runs on the built-in interpreter, so this course needs a **real compiler**:
LLVM/Clang built for WebAssembly (`@yowasp/clang`, pinned 22.0.0-git20542-10), about **27 MB gzipped**, as an optional
download like the Python and PHP packs.

**Decision (Kyobe, 2026-11-16): go with the optional pack.** The gate is the real-phone result of the compiler test page
(`docs/CPP-TRACK.md`, "Phone test"). **The course is written and tested but is NOT offered in the app yet**: it sits in
`pendingCourses` in `src/content/index.js`, which the tests check and the app does not list. Move it into `courses` when the
runtime is wired in (see "Wiring the pack into the app").

## How it is compiled and run (the rules every lesson must respect)

* Flags: `-std=c++17 -O0 -fno-exceptions`. **No exceptions**: the compiler's C++ library is built without them, so
  `try`, `catch` and `throw` do not link. A call that would throw (`string::substr` past the end, `vector::at` out of range,
  `stoi` on text that is not a number) **stops the program** instead. Lessons never use exceptions; where it matters they say
  "a larger C++ program would throw an exception here; in this app the program stops". Error handling is taught with return
  values, `bool`, and `std::optional` (C++17).
* **No files and no threads.** The program runs under WASI with stdin, stdout and stderr only. `<fstream>` needs a virtual file
  system in the engine (a later task); until it exists, teach streams with `<sstream>` (`stringstream`). No `<thread>`.
* stdin is handed over as text, output is captured, and a program that never ends is stopped by terminating its worker.
* Every `cin >> number` / `getline` interplay works exactly as in real C++ (`cin.ignore()` works here, unlike Part A).
* Lessons use plain standard C++17 and `using namespace std;` (as Part A). Use explicit `#include`s for what the code uses
  (`<cctype>` for `toupper`, `<algorithm>` for `sort`, and so on), never `<bits/stdc++.h>`.

## How it is tested

Same rule as every track: every example runs, every `bug` and non-`logic` mistake really fails, every starter fails and every
reference solution passes (`npm test`). The runner for language `cppfull` is `tests/realcpp.mjs`:

* **Default (and in CI): the machine's `g++`**, with every program of the course compiled in **parallel** first
  (`collectPrograms`/`prefetchRealCpp`), so a lesson adds seconds, not minutes.
* **Parity: the real WebAssembly Clang.** `CPP_REAL=wasm ONLY_COURSE=cpp-pro node tests/run.mjs` (or `npm run test:cpp-wasm`)
  compiles with the very compiler learners will use. It needs `npm install --no-save @yowasp/clang@22.0.0-git20542-10`
  and takes about 3 s per program. **Run it before pushing a batch of lessons.** Lesson 1 passes identically on both
  (32 programs, 93 s).
* **What the parity run has already taught us (rules for every lesson):**
  * **Never teach "missing `#include`" as a compile error.** g++ (libstdc++) refuses `vector` or `sort` without their header,
    but the WebAssembly Clang (libc++) lets them through because other headers pull them in. Two such mistakes passed on
    g++ and failed the parity run. Teach "include what you use" in a tip instead.
  * **Never depend on the order of equal items:** plain `sort` may order ties differently on different compilers. Use
    `stable_sort`, or make every key different.
  * Do not print an uninitialised variable, read `v[i]` out of range, or rely on any other undefined behaviour: the answer
    differs per compiler. Use `at()` (which stops the program here) when a lesson needs to show an out-of-range stop.
* **Run parity in the foreground, two lessons at a time** (`CPP_REAL=wasm ONLY_COURSE=cpp-pro ONLY_LESSON=a,b node tests/run.mjs`,
  about 2.5 minutes each). Long detached runs were sometimes killed by the sandbox without a trace. `ONLY_LESSON` is a comma list of lesson ids.
* Lessons that define a class **inside `main`** cannot use `static` members (a C++ rule): put such classes above `main`.
* Avoid `reorder` blocks with more than 4 lines in this course: the test tries every other order, and each try is a compile.

## Roadmap

`[x]` written and tested on both compilers, `[ ]` still to write. Lesson ids start with `cppp-`, exercise ids with `cppp<n>-`.

**Level 1: Real strings and vectors** (complete: 6 lessons, 22 exercises)
- [x] 1. `cppp-strings` `std::string`: joining, `getline`, characters, `find`/`substr`, comparing, `to_string`
- [x] 2. `cppp-vectors` `std::vector`: `push_back`, size, range-for, `auto`, 2D vectors
- [x] 3. `cppp-algorithms` `<algorithm>`: `sort`, `find`, `count`, `reverse`, `min_element`/`max_element`, lambdas as sort rules
- [x] 4. `cppp-references` references (`int &`), const references, passing big things cheaply
- [x] 5. `cppp-structs` `struct`, `enum class`, a `vector` of structs
- [x] 6. `cppp-ledger` project: Mama Rose's ledger (strings, vectors, structs, sorting, a text menu)

**Level 2: Classes and objects** (complete: 8 lessons, 30 exercises)
- [x] 7. `cppp-classes` classes, `private`/`public`, member functions, `this`
- [x] 8. `cppp-constructors` constructors, destructors, initializer lists, `const` members, `static`
- [x] 9. `cppp-encapsulation` encapsulation and invariants (a bank account that cannot go negative)
- [x] 10. `cppp-operators` operator overloading (`+`, `==`, `<<`)
- [x] 11. `cppp-inheritance` inheritance
- [x] 12. `cppp-polymorphism` `virtual`, abstract classes, polymorphism
- [x] 13. `cppp-design` composition or inheritance? designing with objects
- [x] 14. `cppp-shop` project: an object-oriented shop (items, orders, discounts)

**Level 3: Generic and modern C++**
- [x] 15. `cppp-templates` function and class templates
- [x] 16. `cppp-containers` `map`, `unordered_map`, `set`, `pair`, `stack`, `queue`
- [x] 17. `cppp-iterators` iterators and more `<algorithm>`, lambdas in depth
- [x] 18. `cppp-memory` `new`/`delete`, ownership, RAII, `unique_ptr`, `shared_ptr`
- [ ] 19. `cppp-optional` handling failure without exceptions: `std::optional`, `std::variant`, return codes
- [ ] 20. `cppp-streams` `stringstream`, formatting, parsing (and `fstream` once the engine has a virtual file system)
- [ ] 21. `cppp-capstone` capstone: a market-ready inventory manager (classes, STL, smart pointers, a text menu)

## Wiring the pack into the app (engine work, follows the Java/PHP pattern)

Already done: language id wiring (`editorLanguage`, `editor.js`, label), the `pendingCourses` list, the test back end.
Still to do once the phone test says the compiler is usable:

1. `scripts/prepare-runtimes.mjs`: stage the gzipped compiler into `public/cppfull/` and record it in the pack info (the
   `scripts/fetch-cpp-compiler.mjs` used by the test page shows how: `npm pack`, gzip level 9, 27.1 MB).
2. `public/pack-sw.js`: add `cppfull` to the `pyodide|php|java` pattern. Settings, Download: a "C++ Pro" entry with its size.
3. `public/workers/cppfull.worker.js`: the compile worker and a runner worker per run, as in `public/cpp-test/`
   (`compiler-worker.js`, `runner-worker.js`): cached download, unpack with `DecompressionStream`, `runClang`, WASI layer,
   terminate the runner after the time limit.
4. `src/lib/runners.js`: a `cppfull` runner (compile step like Java's "building", then run), with a longer first-run limit.
5. `src/lib/errors.js`: rules for the common Clang messages (missing `;`, undeclared name, no matching function, a missing
   `#include`, an uninitialized read is not an error, etc.), in English and Kiswahili.
6. Move `cppProCourse` from `pendingCourses` to `courses`, and add the progress and "offline pack not downloaded yet" states.

## Lesson style

Same rules as every track (`docs/TRACKS.md`) and the Part A style: a story first (Mama Rose's rolex stand and the Mobile Money
kiosk continue), whole programs shown, plain-English explanations, three hints per exercise, hidden tests, a mistake museum
that mixes compile errors, runtime stops and silent logic mistakes, and a recap. Always say honestly what this app's compiler
cannot do (no exceptions, no files yet).
