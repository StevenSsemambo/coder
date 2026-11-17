# C Part 2 (`c-advanced`, language `cx`): structures, memory and files

The second C course. It continues `c-structured` (lessons 1 to 32, JSCPP) and runs on **picoc compiled to
WebAssembly** (`tools/picoc-wasm/`, 560 KB, offline). Source in `src/content/cx/`, reference solutions in
`tests/solutions-cx.mjs`. Same lesson format and test rules as every track (`docs/TRACKS.md`).

## Lessons (14 written, 42 exercises)

| # | id | Topic |
|---|----|-------|
| 1-5 | `cx-struct`, `cx-struct-array`, `cx-struct-fn`, `cx-enum`, `cx-union` | structs, `typedef`, arrays of structs, passing and returning structs, `->`, enum, union (`src/content/cx/structs.js`) |
| 6-10 | `cx-malloc`, `cx-resize`, `cx-linked`, `cx-list-ops`, `cx-text-memory` | malloc/free, calloc/realloc and the growing array, linked lists (build, walk, append, delete, reverse), dynamic strings and tables (`memory.js`) |
| 11-13 | `cx-files`, `cx-file-records`, `cx-binary` | `fopen`/`fprintf`/`fgets`/`fscanf`, saving and loading records, `fwrite`/`fread`/`fseek`/`r+b` (`files.js`) |
| 14 | `cx-capstone` | the stock system: command loop, return codes, save and load |

## Ideas for more lessons

Doubly linked lists, stacks and queues from structs, binary search trees (recursion on `struct Node *`), bit fields,
a student-records project with sorting and file persistence, a simple hash table, command-line style parsing with
`sscanf`, `qsort` is **not** possible (no function pointers in picoc).

## What the runtime does differently from a real C compiler

Verified by hand while building the course. Lessons teach real C, so only list a limit here when a lesson would trip on it.

* **Not supported:** function pointers; struct, union and enum **definitions inside a function** (declare them globally);
  `long long`, `size_t`; `goto` into blocks; anything that needs a real operating system.
* **Quirks to avoid in lessons:** `(a + 1)->x` crashes (write `p = a + 1; p->x`); `sizeof(arr) / sizeof(arr[0])` gives 1
  for an array of structs (use a `#define COUNT` or a variable); `long` is 32 bits.
* **Silent where real C is also undefined:** double `free`, use after free, writing past a block, `NULL->x`.
  Only `*p` through an uninitialised pointer is reported ("NULL pointer dereference"). Lessons describe those as
  dangerous in real C and do not rely on a message.
* **Not enforced:** `const`, assigning a string literal to an array name is accepted silently.
* **Files** live in memory for one run (`cxcore.js`): lessons say so honestly in lesson 11. Every run is a fresh instance.
* **Infinite loops:** the worker's time limit stops them; the test harness cannot test an infinite loop.

## Engine notes

* `public/workers/cxcore.js` is shared by the worker and `tests/run.mjs` (the tests run the identical code).
* The `cx` language has its own editor mode (`src/lib/editor.js`), symbol bar (`symbols.js`) and 12 error rules
  (`src/lib/errors.js`, English and Kiswahili).
* **Not yet proven on a phone.** Open the course once on a real Android phone, online then offline, and run lesson 6.
