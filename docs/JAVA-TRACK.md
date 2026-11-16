# The Java track

Course id `java-start` (proposed), language `java`. The Java account owns the lessons (`src/content/java/`,
`src/content/java-course.js`, `tests/solutions-java.mjs`) **and the Java engine and app code** (see the Java row in
`docs/TRACKS.md`, decision of the project owner on 2026-11-15).

Last updated: 2026-11-15. Status: **the runtime is built into the app and verified in a real browser. Level 1 (lessons 1 to 6) and Level 2
lessons 7 to 10 are written and tested. Lessons 11 to 15 are next.**

## 1. Verdict

**Yes, real Java can run offline inside the app.** Nothing has to be simulated or rewritten as a
"Java-like" subset. The engine is `@live-codes/java-wasm` 0.1.0: the real OpenJDK `javac` (Java 25 source
level) plus the TeaVM compiler, both compiled to WebAssembly. It compiles the student's source in the
browser, turns the class files into a WebAssembly program, and runs that program in a Web Worker.
No server, no internet after the one-time download.

It is **not** the full JDK. The class library is TeaVM's subset, and a few behaviours differ from real
Java in ways that matter for teaching. Section 4 lists every one I found; section 5 says how lessons
work around each. Do not write a lesson that contradicts section 5.

Everything in this note was **run**, not assumed. Two scripts repeat it:
- `node tests/java-probe.mjs` tests the **raw engine** (22 working behaviours, 13 gaps, 0 unexpected on 2026-11-15).
- `npm test` tests the **app's Java layer** (source preparation, the shipped worker, error explanations).

Section 4 describes the raw engine. Where the app now hides or fixes a gap, the table says so.

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
| G5 | A literal `10 / 0` crashes the compiler | **Fixed in the app.** The raw engine's build fails with `divide by zero`. `src/lib/javasource.js` hides a literal zero divisor from the compiler, so `10 / 0` builds and throws `ArithmeticException: / by zero` at run time, as in real Java (and `5.0 / 0` is `Infinity`) |
| G6 | `%n` in the middle of a format string eats an argument | **Fixed in the app.** The raw engine prints wrong values or crashes. `javasource.js` rewrites `%n` to `\n` inside string literals (`%%n` is left alone). Side effect: a non-format string that contains the two characters `%n` also gets a newline; no lesson needs that |
| G7 | No `System.exit` | Compile error `cannot find symbol` |
| G8 | **No GUI**: `javax.swing`, `java.awt`, JavaFX | Compile error `package javax.swing does not exist` |
| G9 | No `ExecutorService`, `Executors`, `CompletableFuture` | Compile error. Plain `Thread` works |
| G10 | `assert` is ON | Real Java ignores `assert` unless run with `-ea`. Here a failing `assert` stops the program |
| G11 | The class must be called `Main` | **Fixed in the app.** The raw engine hardcodes `Main.java`. The app finds the class that holds `main`, compiles under the public class's name and runs that class. `public class Shop`, a non-public class with `main`, helper classes first, records and enums all work |
| G12 | Uncaught exceptions print only the message | **Improved in the app.** The worker now writes `Exception in thread "main" java.lang.IllegalStateException: boom` followed by `\tat Main.main(Main.java)` lines for the user's own methods (no line numbers: the engine does not provide them). Traps are named after the Java exception they stand for (`NullPointerException`, `ArrayIndexOutOfBoundsException`, `StackOverflowError`), but they still **cannot be caught** (G1, G2, G4). `e.printStackTrace()` inside a `catch` still prints TeaVM-style lines |
| G13 | Library exception messages differ | `Integer.parseInt("x1")` says `String contains digits out of radix 10: x1`, real Java says `For input string: "x1"`. `ArrayList.get(3)`, `charAt(9)`, `Optional.get()` and others give `null` as the message, where real Java gives text such as `Index 3 out of bounds for length 0` |
| G14 | `Math.round` of a negative half rounds the wrong way | `Math.round(-2.5)` gives `-3` here; real Java gives `-2` (it rounds halves up). Positive values (`2.5` gives `3`) match. Lessons never round negative halves |

Also seen, smaller:
- `"abc".substring(5)` throws `IndexOutOfBoundsException` (real Java: its subclass `StringIndexOutOfBoundsException`), so `catch (StringIndexOutOfBoundsException e)` misses it. `charAt(9)` does throw `StringIndexOutOfBoundsException`.
- `new int[-1]` does not throw `NegativeArraySizeException`.
- In my test a file with a syntax error showed only that one error. A missing-symbol error was printed twice.
- After a worker crash (G5) the next run in the same worker failed until the worker was started again.
- Not probed at all (do not teach until probed): `java.net`, JDBC, `ProcessBuilder`, reflection, `Serializable` to files, `String.format` with `Locale`, `System.getProperty`, `Runtime` memory methods, `Scanner` with delimiters, `java.util.logging`, `Timer`.

## 5. Rules for Java lessons on this runtime

1. **Any class name works.** The app finds the class that holds `main`. Lessons still use `Main` for the first
   programs (it is the convention), then show `public class Shop` in lesson 2 or 16.
2. **`%n` and `\n` both work** in `printf` and `String.format` (G6 is fixed in the app). Prefer `%n`: it is what real
   Java programmers write.
3. **`10 / 0` with literals is fine to teach** (G5 is fixed in the app): it throws `ArithmeticException`.
4. **Teach array and null errors as crashes the learner reads, not exceptions they catch** (G1, G2).
   The lesson shows the program stopping at the bad line and teaches the cure: check `i < a.length`, check
   `s != null`. Teach `try/catch` with exceptions that really do work: `NumberFormatException`, `ArithmeticException`,
   `IndexOutOfBoundsException` from `ArrayList.get`, `StringIndexOutOfBoundsException` from `charAt`,
   `NoSuchElementException`, `InputMismatchException`, and **custom exceptions that the program throws itself**
   (the best teaching case anyway: `InsufficientFundsException`). Do not write
   `try { a[5] = 1; } catch (ArrayIndexOutOfBoundsException e)` in a runnable block: it would crash.
5. **Never print `e.getMessage()` of a library exception** (G13), and never round a negative half with `Math.round` (G14). Print `e.getClass().getSimpleName()` or your own
   message. Your own exceptions' messages are always fine.
6. **Recursion:** show a base case and a missing base case as a crash, never as a `catch` (G4).
7. **No `System.exit`, no GUI, no `ExecutorService`** (G7, G8, G9). Exit by returning from `main`. Concurrency
   lessons use `Thread`, `join` and `synchronized` only.
8. **No `assert`** (G10). The course writes its own tiny `check(...)` helper for self-testing (lesson 40).
9. **File lessons say plainly that files live in memory for one run.** A lesson that "saves" a file must also read
   it back in the same program.
10. Outputs shown in lessons must be what the runtime prints, and the test suite checks that. Use seeded `Random`
    when you need random numbers (compare with a real JDK before a lesson claims specific numbers are "what Java prints").
11. Lessons that explain an error use real `javac` wording (`cannot find symbol`, `incompatible types`,
    `';' expected`): the app prints it the way a laptop does (`Main.java:3: error: ';' expected`).
12. All `code` blocks that are only **read** (Maven, Spring Boot, Android, Swing, JDBC) have no `output`, so the
    tests do not run them. Say "read only, this does not run in the app" in the lesson.
13. The first run of a program takes seconds (the build); later runs of the same program are instant. Lessons that
    ask for several test inputs cost one build. Do not write exercises that need dozens of different programs per page.

## 6. What was built into the app (engine work, done by the Java account)

| Piece | Where | What it does |
|---|---|---|
| Runtime package | `package.json` (pinned `@live-codes/java-wasm` 0.1.0) | The real `javac` + TeaVM, as WebAssembly |
| Runtime preparation | `scripts/prepare-runtimes.mjs` (Java section) | Copies 6 runtime files into `public/java/`, writes the patched engine as `public/java/engine.js` with **three build-stopping patches**: (1) compile under the public class's name; (2) keep the last 8 built programs so another input reuses the build; (3) a `phase: run` message when the build is over, and a hook for the exception report. Records the pack in `pack-info.json` |
| Worker | `public/workers/java.worker.js` | Translates between the engine and the app's `ready` / `chunk` / `result` messages; writes real-Java-style exception reports; tidies `javac` messages (adds `error:`, short type names, removes repeats); restarts the engine after a crash; friendly message when the pack is not downloaded |
| Source preparation | `src/lib/javasource.js` | `%n` fix, literal-zero-divisor fix, main class and file name detection. Shared by the app and the tests |
| Runner | `src/lib/runners.js` | `java` runner; 90 s allowance for the build, then the normal 8 s for the running program; stops and restarts on a runaway loop |
| Download | `src/lib/packs.js`, `public/pack-sw.js`, `vite.config.js`, Settings screen | A second pack next to Python (7.8 MB raw). Not precached, so the app stays small. Settings has a Java card |
| Editor | `src/lib/editor.js`, `src/lib/symbols.js`, playground | `@codemirror/lang-java`, a Java symbol bar, a Java tab with a starter program, a "Building your program..." note |
| Errors | `src/lib/errors.js` | 21 `java-*` rules, English and Kiswahili, for `javac` messages and exceptions (Luganda falls back to English as for the other languages) |
| Tests | `tests/java-node.mjs`, `tests/java-node-worker.mjs`, `tests/run.mjs` (Java sections), `tests/solutions-java.mjs` | The tests run the **shipped worker** in a Node thread that is killed on a runaway loop, and cache results on disk (keyed by the engine files) so an unchanged program is not rebuilt. `tests/run.mjs` now runs any Java course's examples and exercises exactly like C and Python |

### Verified in a real browser

Headless Chromium 153, driving the **built** app (`vite build` then `vite preview`), on 2026-11-15:
- the worker starts in 0.8 s; the first program runs in about 5 s including the build; the same program with another input in 37 ms
- Java tab in the playground: starter program runs
- Settings: **Download 7.8 MB** stores the 7 files, and the card shows "Installed"
- with the network switched off and the service worker in control, a Java program still builds and runs (2.3 s)
- a missing `;` shows the translated card with `Line 3`; an index error shows the translated card; a runaway loop is stopped after about 9 s (build plus the 8 s limit) and Java works again straight after
- the service worker precaches only the 6 KB worker wrapper, not the Java runtime

### Still not verified (be honest in any report)

- **A real phone.** All timings are from a cloud machine. A low-end phone may need 10 to 30 s for the first build.
  Test on the lowest phone you want to support before launch.
- **Firefox and Safari.** Only Chromium was run. The engine needs WebAssembly GC.
- **Memory on small phones.** The compiler is 5.5 MB of WebAssembly plus a 2.4 MB class library, held in memory
  while Java is open. Not measured.
- **GitHub Pages serving the `.wasm` file with the right type.** `vite preview` does; Pages normally does too.
- The CI build is cold (no result cache), so the Java tests will add a few minutes to each deploy once there are lessons.

### Open work (all Java account)

- Level 1 lessons (see the roadmap), then each level in order, a group at a time.
- A parallel pool of engines for the test run, if the course tests become slow in CI.
- Optional: remove `assert` statements before building so `assert` is off as in real Java (G10).

## 7. Roadmap

`[x]` written and tested, `[ ]` still to write. Lesson ids never change once published. Exercise ids start with
`j<lesson number>-`. This order is a proposal for the owner to approve, not a promise. **Lessons 1 to 10 are written and tested; the rest is still to write.**

**Running project: the Village SACCO.** A savings and credit group (members, savings accounts, loans,
interest, a monthly report). It is the most Ugandan example I can think of that also needs everything
Java is good at: objects, collections, exceptions, money. Learners meet it in Level 1 (a deposit slip) and
finish with a full system. (The C track uses the Campus Duuka and Python uses the Duuka, so SACCO keeps the
Java course distinct.)

> **Mapping to an official outline.** If this course must match a syllabus (for example a diploma module),
> send the outline text and the roadmap can be mapped line by line. None is in the repository today.

### Level 1: Getting started
- [x] 1. `j-what` What Java is: source, `javac`, the JVM, where Java is used
- [x] 2. `j-first` Your first program: `class`, `main`, `println`, comments, reading a `javac` error
- [x] 3. `j-variables` Variables and types: `int`, `double`, `boolean`, `char`, `long`, `String`, `final`
- [x] 4. `j-operators` Operators and expressions: integer division, `%`, casting, overflow
- [x] 5. `j-input` Reading input with `Scanner`, and the `nextInt` then `nextLine` trap
- [x] 6. `j-decisions` Decisions: `if`, `else if`, comparisons, `&&` `||` `!`, `switch`, `?:`

### Level 2: Loops, methods and arrays
- [x] 7. `j-loops` Repeating: `for`, `while`, `do while`, `break`, `continue`
- [x] 8. `j-nested` Loops inside loops: patterns and tables
- [x] 9. `j-methods` Methods: parameters, return values, scope, overloading, varargs
- [x] 10. `j-recursion` Recursion (and what a missing base case looks like)
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
- [ ] 37. `j-exceptions` Exceptions: `try`, `catch`, `finally`, checked or unchecked, `throw`, custom exceptions (see rule 4)
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

### Read-only lessons (code shown, not run, see rule 12)
- [ ] 51. `j-beyond-1` Beyond the app, part 1: Maven or Gradle, JUnit, packages and projects on a laptop
- [ ] 52. `j-beyond-2` Beyond the app, part 2: Swing and JavaFX (G8), JDBC and SQL, Spring Boot, Android

## 8. Reproduce this note

```bash
npm install                      # the engine is now a normal dependency
node tests/java-probe.mjs        # the raw engine, about 3 to 4 minutes
npm test                         # the app's Java layer (results are cached after the first run)
```

If the engine is upgraded, run the probe again. A "gap" that now passes means the engine got better:
update section 4 and the rules in section 5.
