# The C track: Structured Programming in C (module TTSD113)

Course id `c-structured`, language `c`. Files: `src/content/c/` (lessons), `src/content/c-course.js`
(the course list), `tests/solutions-c.mjs` (reference solutions). Owner: the C account.

Running project: **the Campus Duuka**, a small shop beside a Ugandan campus. Learners meet it in the
first lessons (a price tag, a till) and finish by building a stock and marks system for it.

> **Mapping to the official outline.** TTSD113 is 50 notional hours, 5 credit units, assessed through
> UVTAB. The official outline text is **not in this repository**, so the order below follows a standard
> Structured Programming syllabus (problem solving, constructs, functions, arrays and strings,
> pointers, structures, files). Before the course is used for assessed work, the lecturer must compare
> this roadmap with the real outline and adjust. Send the outline text and the roadmap can be mapped
> line by line.

## Roadmap

`[x]` written and tested, `[ ]` still to write. Lesson ids never change once published (students'
progress is saved under them). Exercise ids start with `c<lesson number>-`.

### Part A: runs today on the built-in interpreter

**Level 1: Getting started**
- [x] 1. `c-think` From problem to program: algorithms, sequence, selection, repetition, top-down design
- [x] 2. `c-first` Your first C program (main, printf, escapes, comments)
- [x] 3. `c-variables` Variables and input (types, printf codes, scanf)
- [x] 4. `c-types` Numbers, characters and operators (integer division, `%`, casting, ASCII, constants)

**Level 2: Decisions and loops**
- [x] 5. `c-decisions` Making decisions (`if`, `else`, `else if`, comparisons, `%`)
- [x] 6. `c-logic` Combining conditions, `switch` and `?:`
- [x] 7. `c-loops` Repeating with `for`
- [x] 8. `c-while` `while`, `do while`, `break`, `continue`, sentinel loops
- [x] 9. `c-nested` Loops inside loops: patterns and tables
- [x] 10. `c-till` Project: the Campus Duuka till

**Level 3: Functions**
- [ ] 11. Functions: define, call, return, prototypes
- [ ] 12. Parameters, scope, global and `static` variables
- [ ] 13. Recursion
- [ ] 14. Project: a Mobile Money menu
- [ ] 15. Finding bugs: error types, dry runs and trace tables, testing

**Level 4: Arrays and strings**
- [ ] 16. Arrays
- [ ] 17. Array algorithms: search, minimum, maximum, bubble sort
- [ ] 18. Arrays and functions
- [ ] 19. Two-dimensional arrays
- [ ] 20. Strings as character arrays
- [ ] 21. `string.h` and `ctype.h`
- [ ] 22. Project: class marks processor

**Level 5: Pointers**
- [ ] 23. Addresses and pointers
- [ ] 24. Pointers and functions (swap, several results)
- [ ] 25. Pointers, arrays and strings

### Part B: blocked until the interpreter can run it

Structures (`struct`), `typedef`, `enum`, `union`, dynamic memory (`malloc`, `free`), file handling
(`FILE`, `fopen`, `fprintf`, `fscanf`), and a final project that stores records in a file. These are
almost certainly in the module. **None of them run today** (see the table). Lessons written for
them could not be proved by the tests, so they are not written yet. The engine owner needs to decide
how to get a C runtime that supports them (see "Engine requests").

## What the built-in interpreter can and cannot do

The C runtime is JSCPP, a teaching-subset interpreter written in JavaScript (not a real compiler).
Everything below was **run on the app's own bundle**, not assumed.

| Works | Does not work |
|---|---|
| `printf` with `%d %i %u %f %c %s %x %o %e %g %%`, widths and precision (`%5d`, `%-8s`, `%05d`, `%.2f`) | `%ld`, `%lu`, `%lf` in `scanf` (read `double` is not possible; use `float` and `%f`) |
| `scanf` for `%d %f %c %s`, reading into variables **and into array elements** (patched, see below) | `scanf` until end of input (`while (scanf(...) == 1)`); `EOF` |
| `if`, `else if`, `switch`, `?:`, `for`, `while`, `do while`, `break`, `continue` | `goto` |
| Functions, prototypes, recursion, `void`, array parameters, pointer parameters, globals, `static` locals | Function pointers |
| 1D and 2D arrays, strings as `char` arrays, `strlen strcpy strcat strcmp strncmp`, `ctype.h`, `math.h` (`sqrt pow fabs floor ceil`), `abs`, `atoi`, `rand`/`srand` | `struct`, `union`, `enum`, `typedef struct` |
| Pointers to variables, pointer arithmetic on arrays, `&` and `*`, `sizeof`, casts, bitwise operators, `#define`, `const` | `malloc`, `calloc`, `free` |
| `getchar`, `putchar`, `puts`, `gets` | `fgets`, `sprintf`, `FILE`/`fopen` and all file functions |
| `int main()` and `int main(void)` | `main` with `argc`/`argv`, `stdbool.h`, `M_PI`, `exit()`, `memset`, `NULL` comparisons, `char *names[]` (array of string pointers) |

Behaviours that differ from real C (say so honestly in lessons where they matter):
- An `int` that goes over about 2 billion **stops with an error**. Real C silently wraps to a wrong number.
- Dividing an integer by zero **stops with an error**. In real C it is undefined behaviour.
- Reading a variable that was never given a value **stops with an error**. Real C prints a random number.
- `scanf` when the input box is empty stops with "Memory overflow", which the error translator turns into a friendly card.
- `#define` replaces the name **everywhere, even inside quoted text**: with `#define VAT 18`, `printf("With VAT: %d")` prints `With 18: ...`. Real C leaves quoted text alone. Never give a macro a name that appears in a string.
- `scanf("%d", ...)` reads text such as `007` as octal (7) and accepts letters. Avoid leading zeros in tests.

### The `scanf` patch

`scanf("%d", &a[i])` failed with "Memory overflow" in the stock library, which would have blocked every
arrays lesson. `scripts/prepare-runtimes.mjs` now patches three places in JSCPP's `cstdio.js` so that
`&a[i]` stores into that one element (numbers, floats and single characters, 1D and 2D). The build stops
loudly if the library changes and a patch no longer applies. The lessons from Level 4 exercise it,
so `npm test` proves it still works.

## Engine requests (for the engine owner)

1. **A C runtime that supports structures, `enum`, `malloc`/`free` and file I/O**, running offline in a
   Web Worker. Unblocks Part B. A quick npm search found no ready-made package; options to investigate
   are a small C interpreter or compiler built to WebAssembly (the build then needs a toolchain) or
   extending JSCPP. Whatever is chosen must keep the download small (the app today ships C in about 400 KB).
2. `scanf` that returns the number of items read and works at end of input, so the `while (scanf(...) == 1)`
   idiom runs. Today the empty-input error is a deliberate teaching aid, so decide which behaviour to keep.
3. `%ld`, `%lu` and `%lf` in `printf` and `scanf`.

## Lesson style for C

Same rules as every track (`docs/TRACKS.md`), plus:

- Show whole programs. A learner must see `#include`, `main` and `return 0` until they are second nature.
  Use the `prog()` helper in `src/content/c/shared.js` so lessons stay readable.
- Every example is a complete program that the tests run on the real interpreter.
- Always give inputs for programs that read (`stdin`) so the example is runnable with one tap.
- Use `int` for money in UGX. Use `float` only where decimals are the point, with neat numbers so
  `%.2f` output is exact on every device.
- Never rely on uninitialised variables, integer overflow or any behaviour in the right-hand column above.
