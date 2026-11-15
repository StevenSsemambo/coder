# The Java track

Course id `java-start` (proposed), language `java`. Files this track owns: `src/content/java/` (lessons),
`src/content/java-course.js` (course list), `tests/solutions-java.mjs` (reference solutions),
`tests/java-probe.mjs` (the runtime probe, see below) and this file. Owner: the Java account.

Last updated: 2026-11-15. Status: **feasibility done, no lessons yet, waiting for the engine owner** (see
"Engine requests").

## 1. Verdict

**Yes, real Java can run offline inside the app.** Nothing has to be simulated or rewritten as a
"Java-like" subset. The engine is `@live-codes/java-wasm` 0.1.0: the real OpenJDK `javac` (Java 25 source
level) plus the TeaVM compiler, both compiled to WebAssembly. It compiles the student's source in the
browser, turns the class files into a WebAssembly program, and runs that program in a Web Worker.
No server, no internet after the one-time download.

It is **not** the full JDK. The class library is TeaVM's subset, and a few behaviours differ from real
Java in ways that matter for teaching. Section 4 lists every one I found; section 5 says how lessons
work around each. Do not write a lesson that contradicts section 5.

Everything in this note was **run**, not assumed: `node tests/java-probe.mjs` repeats it
(22 working behaviours, 13 documented gaps, 0 unexpected on 2026-11-15).

## 2. The runtime

| | |
|---|---|
| Package | `@live-codes/java-wasm` 0.1.0 (pin this exact version; the engine is young) |
| How it works | `javac` (in WebAssembly) compiles `Main.java`; TeaVM turns the bytecode into WasmGC; the program runs in the same worker |
| Language level | Java 25 source level (per the package's README); `var`, records, enums, sealed types, text blocks, switch expressions, pattern matching all compile and run (probed) |
| Class library | TeaVM's subset (reports itself as API level 21), not the JDK. See section 4 |
| Download | 7.7 MB raw, about **4.4 MB gzipped** (`compiler.wasm` 5.5 MB, `runtime-classlib-teavm.bin` 2.4 MB, `compile-classlib-teavm.bin` 0.2 MB, three small files). Fits the existing "pack" mechanism used for Python (13 MB) |
| Licence | Package and TeaVM: Apache-2.0. The bundled `javac` is OpenJDK: GPLv2 with the Classpath Exception. The `THIRD-PARTY-NOTICES.md` that ships in the package must ship with the app |
| Needs | WebAssembly GC. Per the package's README it needs no `SharedArrayBuffer`, so **no special server headers** (I could not test headers here). Stdin is handed over as a string before the run |
| Offline | All files are plain static files, so they can live in the same Cache Storage pack as Python |

### Measured (Node 22 in a cloud sandbox, not a phone)

| Step | Time |
|---|---|
| Engine start (load the 7.7 MB toolchain) | about 0.6 s |
| `javac` compile | 20 to 300 ms |
| TeaVM build to WebAssembly (the slow part) | **1 to 8 s** per program. Small programs 1 to 2.5 s; the first program and programs that use `Scanner`, `regex` or `java.time` 3 to 8 s |
| Running the program | usually under 30 ms. A 200-million-step loop took 0.5 s, so Java is fast once built |
| **Same program, new input** | 10 to 25 ms when the built program is reused (tested, see E4). Without reuse, every test case pays the full build |

**Not measured:** any real phone. A low-end Android phone may be several times slower than this sandbox, so
a first run could take 10 to 30 s. The lesson UI must say "Building your program..." and not look frozen.

## 3. What works (all probed)

Variables and all primitive types, `String` and its methods, `StringBuilder`, `printf` and `String.format`
(widths, precision, `%,d`, `%+d`, `%08.3f`), operators and casting, integer overflow, `if`, `switch`
(classic, arrow, string, pattern), loops with labels, methods, varargs, recursion, 1D and 2D arrays,
`Arrays` (`sort`, `fill`, `toString`, `deepToString`, `equals`, `stream`), classes, constructors, `static`
(including static blocks), inheritance, `abstract`, interfaces with `default` and `static` methods, inner,
nested and anonymous classes, enums, records, sealed interfaces, generics, `equals`/`hashCode`/`toString`,
`Comparable`/`Comparator`, `ArrayList`, `LinkedList`, `HashMap`, `LinkedHashMap`, `TreeMap`, `HashSet`,
`ArrayDeque`, iterators, lambdas, method references, `java.util.function.*`, streams (`filter`, `map`,
`sorted`, `collect`, `groupingBy`, `joining`, `IntStream`), `Optional`, checked and custom exceptions,
`finally`, try-with-resources, `Scanner` and `BufferedReader` on stdin (including `hasNextInt` and
`hasNextLine` loops), `Math`, seeded `Random` (repeatable: `new Random(42).nextInt(100)` is 53 here; I did not compare it with a real JDK),
`BigDecimal`, `BigInteger`, wrapper types (`Integer` cache behaves like real Java), `String` pool, regex
(`matches`, `Pattern`, `Matcher`, `replaceAll`), `LocalDate`, `LocalDateTime`, `DateTimeFormatter`,
`ChronoUnit`, `Thread` with `start`, `join`, `sleep` and `synchronized`, text file reading and writing, and
Unicode output (accents, em dash, check mark, flag emoji).

Files are written to an **in-memory file system**: a program can create and read `notes.txt` within one run,
but nothing survives to the next run (the engine has an optional IndexedDB mode, not probed).

## 4. What does not work, or behaves differently (all probed)

| # | Gap | What happens |
|---|---|---|
| G1 | **Array index out of bounds cannot be caught** | `a[5] = 1` on a 2-element array kills the program with `array element access out of bounds`. `catch (Exception e)` and `catch (Throwable e)` never run |
| G2 | **Null pointer cannot be caught** | `s.length()` on `null` kills the program with `dereferencing a null pointer`. No catch runs |
| G3 | Bad cast is not detected | `(Integer) someString` does not throw `ClassCastException`; the program carries on |
| G4 | Stack overflow cannot be caught | Infinite recursion dies with `Maximum call stack size exceeded`; `catch (StackOverflowError e)` never runs |
| G5 | **A literal `10 / 0` crashes the compiler** | `System.out.println(10 / 0);` makes the build itself fail with `divide by zero`, and the worker needs restarting. `5 / z` with a variable `z` works and throws `ArithmeticException: / by zero` as in real Java |
| G6 | **`%n` in the middle of a format string eats an argument** | `printf("A=%d%nB=%d%n", 1, 2)` prints `A=1`, then `B=` with the wrong value or a crash. `%n` at the very end of the string is fine, and `\n` always works |
| G7 | No `System.exit` | Compile error `cannot find symbol` |
| G8 | **No GUI**: `javax.swing`, `java.awt`, JavaFX | Compile error `package javax.swing does not exist` |
| G9 | No `ExecutorService`, `Executors`, `CompletableFuture` | Compile error. Plain `Thread` works |
| G10 | `assert` is ON | Real Java ignores `assert` unless run with `-ea`. Here a failing `assert` stops the program |
| G11 | The class must be called `Main` | `public class Shop { ... main ... }` fails: `class Shop is public, should be declared in a file named Shop.java`. A non-public class with `main` also fails (the engine looks for `Main`) |
| G12 | Uncaught exceptions print only the message | Real Java prints `Exception in thread "main" java.lang.IllegalArgumentException: bad input` and a stack trace. Here stderr is just `bad input`. `e.printStackTrace()` inside a `catch` does print a trace, with extra TeaVM lines at the bottom |
| G13 | Library exception messages differ | `Integer.parseInt("x1")` says `String contains digits out of radix 10: x1`, real Java says `For input string: "x1"`. `ArrayList.get(3)`, `charAt(9)`, `Optional.get()` and others give `null` as the message, where real Java gives text such as `Index 3 out of bounds for length 0` |

Also seen, smaller:
- `"abc".substring(5)` throws `IndexOutOfBoundsException` (real Java: its subclass `StringIndexOutOfBoundsException`), so `catch (StringIndexOutOfBoundsException e)` misses it. `charAt(9)` does throw `StringIndexOutOfBoundsException`.
- `new int[-1]` does not throw `NegativeArraySizeException`.
- In my test a file with a syntax error showed only that one error. A missing-symbol error was printed twice.
- After a worker crash (G5) the next run in the same worker failed until the worker was started again.
- Not probed at all (do not teach until probed): `java.net`, JDBC, `ProcessBuilder`, reflection, `Serializable` to files, `String.format` with `Locale`, `System.getProperty`, `Runtime` memory methods, `Scanner` with delimiters, `java.util.logging`, `Timer`.

## 5. Rules for Java lessons on this runtime

1. **Name the main class `Main`**, always, until E3 is done. Say why in lesson 2 in one honest line.
2. **Never write `printf` or `String.format` with `%n` in the middle.** Use `\n`, or a single `%n` as the very last thing. Do not mention `%n` as "the right way" in the course until E7 is done.
3. **Teach array and null errors as crashes the learner reads, not exceptions they catch.** The lesson shows
   the program stopping at the bad line and teaches the cure: check `i < a.length`, check `s != null`.
   Teach `try/catch` with exceptions that really do work: `NumberFormatException`, `ArithmeticException`
   (divisor in a variable), `IndexOutOfBoundsException` from `ArrayList.get`, `StringIndexOutOfBoundsException`
   from `charAt`, `NoSuchElementException`, `InputMismatchException`, and **custom exceptions that the program
   throws itself** (the best teaching case anyway: `InsufficientFundsException`). Never write `10 / 0`.
4. **Never print `e.getMessage()` of a library exception.** Print the exception's class (`e.getClass().getSimpleName()`)
   or your own message. Your own exceptions' messages are always fine.
5. **Recursion:** show a base case and a missing base case as a crash, never as a `catch`.
6. **No `System.exit`, no GUI, no `ExecutorService`.** Exit by returning from `main`. Concurrency lessons use
   `Thread`, `join` and `synchronized` only.
7. **No `assert`.** The course writes its own tiny `check(...)` helper for self-testing (lesson 40).
8. **File lessons say plainly that files live in memory for one run.** A lesson that "saves" a file must also
   read it back in the same program.
9. Outputs shown in lessons must be what the runtime prints, and the test suite checks that. Use seeded
   `Random` when you need random numbers, so outputs are repeatable (compare with a real JDK before a lesson claims specific numbers are "what Java prints").
10. Lessons that explain an error use real `javac` wording (`cannot find symbol`, `incompatible types`,
    `';' expected`), because that is what the learner will see here and on a laptop.
11. All `code` blocks that are only **read** (Maven, Spring Boot, Android, Swing, JDBC) have no `output`, so
    the tests do not run them. Say "read only, this does not run in the app" in the lesson.

## 6. Engine requests (for the engine and app owner)

This track does not edit engine files. Everything below is needed before Java lessons can be shown in the
app or tested by `npm test`. Each item says what I proved and what I did not.

- **E1. Add the runtime.** Pin `@live-codes/java-wasm@0.1.0`. Its `worker-java.js` is written for both
  browser and Node (my probe loads that exact file). It speaks `{cmd:'init', baseUrl}` and
  `{cmd:'run', source, input, mainClass}` and answers with one `{type:'result', ok, stdout, stderr, exitCode, generateMs, compileMs, runMs}`,
  not the `ready`/`chunk`/`result` messages in `runners.js`, so `runners.js` needs a small adapter.
  Output arrives all at once at the end. Not tested: running it as a worker inside the app's Vite build.
- **E2. Ship it as a pack** (like Python): `compiler.wasm`, `runtime-classlib-teavm.bin`, `compile-classlib-teavm.bin`,
  `compiler.wasm-deobfuscator.wasm`, `compiler.wasm-runtime.js`, plus the licence notices. About 4.4 MB over the wire.
  Add a Download button in Settings.
- **E3. Find the class that has `main`** instead of assuming `Main`. The worker hardcodes `Main.java`; it
  must add the source as `<PublicClass>.java` and pass that as `mainClass`. This removes G11.
- **E4. Build once, run many.** The grader runs an exercise against several inputs, and the build is
  1 to 8 s. Keep the built `.wasm` bytes for a given source and run them again for each test input. **Tested** with
  a 30-line program: first run 7.6 s, the next four runs 14, 10, 10 and 16 ms. (The worker builds the
  WebAssembly bytes and then starts them once per run; the change is to keep those bytes between calls. I
  proved it on a patched copy of the worker in Node, not in the app.)
- **E5. Restart the Java worker after any result with `error`** (a compiler crash such as G5, or a trap),
  because the next run in the same worker failed after one (observed).
- **E6. Separate build and run time limits.** `DEFAULT_TIMEOUT_MS` is 8 s; the *build* alone can exceed that
  on a slow phone. Give Java a long build allowance (suggest 60 s) and the usual short limit for the run.
  The worker's own 30 s check cannot interrupt a tight loop such as `while (true) {}`, so the `runners.js`
  backstop that kills the worker must stay. Not tested in a browser; `Worker.terminate()` is how the app
  already stops Python and C.
- **E7. A `jsource.js`**, like `csource.js`, that rewrites `%n` inside string literals to `\n` (G6). Without it, any
  student who writes `printf("...%n...%n")` (very common in Java) gets wrong output or a crash.
- **E8. `errors.js` rules for Java.** `javac` messages have a fixed, well-known form, so they can be
  translated the same way as the C ones. Also drop repeated identical diagnostics, and teach the runtime
  to show `array element access out of bounds` and `dereferencing a null pointer` as friendly messages
  ("index too big for this array", "this variable is null").
- **E9. Editor.** `@codemirror/lang-java` 6.0.2 (MIT) exists. Add a symbol bar entry for `java`
  (`{ } ( ) [ ] ; " < > = ! & |`). Not installed or tried here.
- **E10. Tests.** `tests/run.mjs` needs a Java section that runs every `code` block, `try`, `predict`, `fill`,
  `reorder`, `bug` fix and exercise solution through the same Node loader as `tests/java-probe.mjs`.
  Cost: about 1 to 6 s per *distinct* program on this sandbox. A 50-lesson course has roughly 600 programs,
  so a full run could take 15 to 60 minutes. Suggest a cache keyed by a hash of the source and the engine
  version, so an unchanged program is not rebuilt. Until E1 to E10 exist, the Java account can verify its
  lessons with its own script (`tests/java-verify.mjs`, to be written with the first lesson group) and will
  **not** register the course in `src/content/index.js`.
- **E11. No change to `blocks.js` is needed.** The existing block types are enough.
- **E12. Browser support must be checked on real phones before committing the course.** The engine needs WebAssembly GC.
  As far as I know current Chrome, Edge, Firefox and Safari have it, but I tested no browser, and an old Android WebView may
  not. Test on the lowest phone you want to support. If it fails there, there is no fallback today.

## 7. Roadmap

`[x]` written and tested, `[ ]` still to write. Lesson ids never change once published. Exercise ids start with
`j<lesson number>-`. This order is a proposal for the owner to approve, not a promise. **Nothing is written yet.**

**Running project: the Village SACCO.** A savings and credit group (members, savings accounts, loans,
interest, a monthly report). It is the most Ugandan example I can think of that also needs everything
Java is good at: objects, collections, exceptions, money. Learners meet it in Level 1 (a deposit slip) and
finish with a full system. (The C track uses the Campus Duuka and Python uses the Duuka, so SACCO keeps the
Java course distinct.)

> **Mapping to an official outline.** If this course must match a syllabus (for example a diploma module),
> send the outline text and the roadmap can be mapped line by line. None is in the repository today.

### Level 1: Getting started
- [ ] 1. `j-what` What Java is: source, `javac`, the JVM, where Java is used
- [ ] 2. `j-first` Your first program: `class`, `main`, `println`, comments, reading a `javac` error
- [ ] 3. `j-variables` Variables and types: `int`, `double`, `boolean`, `char`, `long`, `String`, `final`
- [ ] 4. `j-operators` Operators and expressions: integer division, `%`, casting, overflow
- [ ] 5. `j-input` Reading input with `Scanner`, and the `nextInt` then `nextLine` trap
- [ ] 6. `j-decisions` Decisions: `if`, `else if`, comparisons, `&&` `||` `!`, `switch`, `?:`

### Level 2: Loops, methods and arrays
- [ ] 7. `j-loops` Repeating: `for`, `while`, `do while`, `break`, `continue`
- [ ] 8. `j-nested` Loops inside loops: patterns and tables
- [ ] 9. `j-methods` Methods: parameters, return values, scope, overloading, varargs
- [ ] 10. `j-recursion` Recursion (and what a missing base case looks like)
- [ ] 11. `j-arrays` Arrays and the enhanced `for`
- [ ] 12. `j-array-algos` Array algorithms: search, minimum, maximum, sorting
- [ ] 13. `j-2d` Two-dimensional arrays
- [ ] 14. `j-strings` Strings in depth, `StringBuilder`, `printf` and `String.format`
- [ ] 15. `j-ledger` Project: a SACCO ledger on the console (no classes yet)

### Level 3: Object-oriented Java
- [ ] 16. `j-classes` Classes and objects
- [ ] 17. `j-constructors` Constructors and `this`
- [ ] 18. `j-encapsulation` Private fields, getters and setters, validation
- [ ] 19. `j-static` `static` members and constants
- [ ] 20. `j-object` `toString`, `equals`, `hashCode`
- [ ] 21. `j-inherit` Inheritance, `super`, overriding
- [ ] 22. `j-poly` Polymorphism and `instanceof`
- [ ] 23. `j-abstract` Abstract classes
- [ ] 24. `j-interfaces` Interfaces: `default` and `static` methods, interface or abstract class
- [ ] 25. `j-nested` Nested, inner and anonymous classes
- [ ] 26. `j-enums-records` Enums and records
- [ ] 27. `j-sacco-oop` Project: SACCO members, accounts and loans as objects

### Level 4: Collections, generics and functional style
- [ ] 28. `j-arraylist` `ArrayList`, autoboxing, wrapper types
- [ ] 29. `j-maps` `HashMap`, `LinkedHashMap`, `TreeMap`
- [ ] 30. `j-sets-queues` Sets, queues and deques
- [ ] 31. `j-iterators` Iterators and the "changed while looping" trap
- [ ] 32. `j-sorting` `Comparable`, `Comparator`, sorting objects
- [ ] 33. `j-generics` Generics
- [ ] 34. `j-lambdas` Lambdas, functional interfaces, method references
- [ ] 35. `j-streams` Streams and `Optional`
- [ ] 36. `j-sacco-reports` Project: SACCO reports with collections and streams

### Level 5: Robust code
- [ ] 37. `j-exceptions` Exceptions: `try`, `catch`, `finally`, checked or unchecked, `throw`, custom exceptions (see rule 3)
- [ ] 38. `j-resources` try-with-resources and `AutoCloseable`
- [ ] 39. `j-debug` Finding bugs: reading `javac` errors, trace tables, defensive checks
- [ ] 40. `j-testing` Testing without a framework: a tiny `check()` helper and test cases
- [ ] 41. `j-files` Text files (in-memory in the app; real files on a laptop)
- [ ] 42. `j-money` Money and time: `BigDecimal`, `LocalDate`, formatting UGX
- [ ] 43. `j-text` Text processing: regex, parsing and validating input (phone numbers)
- [ ] 44. `j-clean` Clean code: naming, small methods, immutability
- [ ] 45. `j-patterns` Design patterns that earn their place: Strategy, Factory, Observer
- [ ] 46. `j-threads` Concurrency basics: `Thread`, `join`, `synchronized`, race conditions

### Level 6: Market-ready
- [ ] 47. `j-layers` Structuring a real program: model, service, repository, interfaces and dependency injection by hand
- [ ] 48. `j-persist` Saving and loading data (text or CSV format you design)
- [ ] 49. `j-api` Designing a clean API for your classes
- [ ] 50. `j-capstone` Capstone: the full Village SACCO system

### Read-only lessons (code shown, not run, see rule 11)
- [ ] 51. `j-beyond-1` Beyond the app, part 1: Maven or Gradle, JUnit, packages and projects on a laptop
- [ ] 52. `j-beyond-2` Beyond the app, part 2: Swing and JavaFX (G8), JDBC and SQL, Spring Boot, Android

## 8. Reproduce this note

```bash
npm install --no-save @live-codes/java-wasm@0.1.0
node tests/java-probe.mjs        # about 3 to 4 minutes
```

If the engine is upgraded, run the probe again. A "gap" that now passes means the engine got better:
update section 4 and the rules in section 5.
