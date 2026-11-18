# The PHP track: PHP from Zero to Market-Ready

Planned course id `php-start`, language id `php`. Files (when created): `src/content/php/` (lessons),
`src/content/php-course.js` (course list), `tests/solutions-php.mjs` (reference solutions).
Owner: the PHP account. Status: **runner built; Levels 1 to 4 written (24 lessons, 92 exercises). Next: Level 5, market-ready PHP (lessons 25 to 33).**

Running project: **Nambi's Mobile Money Booth**, a small agent booth in a trading centre. Learners start
by printing a receipt in lesson 1 and finish with a tested payment-and-wallet application (deposits,
withdrawals, fees, a ledger stored in SQLite, a JSON API and safe handling of user input).

## How PHP runs in the app (built and tested)

Real **PHP 8.3** (8.3.36 today) compiled to WebAssembly: WordPress Playground's `@php-wasm` packages.

| Piece | Where | Notes |
|---|---|---|
| Shared core | `src/lib/phpcore.mjs` | Creates the PHP instance, writes `php.ini`, runs a program, splits fatal errors from output. **The Node tests and the browser worker use this same file.** |
| Worker | `public/workers/php.worker.js` (generated, git-ignored) | About 500 KB, bundled by `scripts/prepare-runtimes.mjs` from `scripts/php-worker-entry.mjs`. A module worker. Precached with the app. |
| Runtime | `public/php/php_8_3.wasm` (generated, git-ignored) | **17.5 MB raw, about 7 MB gzipped.** An optional download in Settings (like Python), kept in the `saymacoder-packs` cache and served offline by `public/pack-sw.js`. NOT precached. |
| Runner | `src/lib/runners.js` | `php` is one more `LanguageRunner` with a module worker. |

Only PHP's **asyncify** build is shipped (works in every browser). PHP's faster `jspi` build needs a recent Chrome and
would double the download, so the build answers "no JSPI" to the loader on purpose. Only PHP 8.3 is bundled.

### Proven

- **Node:** the full test suite runs every lesson example on the same core and WebAssembly family.
- **Chromium (desktop), in a real Web Worker:** boots in about 330 ms; echo, input, a fatal error and SQLite all work.
- **The built app, offline:** Settings shows "PHP runtime, 17.5 MB", Download fills the pack cache, and with the network
  switched off a PHP program runs from the cache (`Offline PHP 8.3.36 1,234,567`).
- **NOT yet proven: a real low-end Android phone.** Memory use and speed there are unknown. Engine owner: test it.

### Rules for lessons (what the runner does)

- **Input:** `fgets(STDIN)` and `fscanf(STDIN, ...)` read the Input box. (STDIN is not defined by this PHP build; the core defines it.)
  `readline()` is not tested: do not teach it.
- **Output:** everything `echo`/`print`/`printf` prints. `var_dump`, `print_r` and `json_encode` all work.
- **Warnings and notices stay in the output**, exactly as in real PHP (`\nWarning: Undefined variable $x in main.php on line 3\n`).
  A beginner SHOULD see them, and an expected output may contain one. They are not errors.
- **A fatal or parse error** ends the script. Output printed before it is kept in stdout; the error text
  (`Fatal error: Uncaught ...` or `Parse error: ...`) is reported separately and explained by the `php-*` rules in `src/lib/errors.js`
  (English and Kiswahili, 13 rules). Messages say `main.php`, never an internal file name.
- **Files:** the program runs in an empty folder that is wiped before every run. A program can write and read files during one
  run; nothing survives to the next run.
- **Time zone** is `Africa/Kampala` (`date()` is predictable). `precision`/`serialize_precision` are PHP 8 defaults, so `0.1 + 0.2` prints `0.3`
  and `var_dump(0.1 + 0.2)` prints `float(0.30000000000000004)`.
- **Extensions present:** `mbstring`, `json`, `pdo_sqlite` (SQLite works in memory and as a file), `ctype` and the usual standard library.
  Not available: a web server, `$_SERVER` request data (lesson 25 simulates requests with arrays), network access, `intl`.
- **Output is cut at 20,000 characters.** An endless loop is stopped by the 8 second backstop in `src/lib/runners.js` (not covered by an
  automated test, because a synchronous endless loop would hang the test run itself).
- Expected outputs for exercises must be built from data, never by running the solution.

### Tested behaviours worth knowing (each seen on the shipped core)

1. A fatal error makes `php.run()` throw; the core catches it and returns the text.
2. Errors are HTML unless `html_errors=0`; the core writes `php.ini` before the first run.
3. The learner's file is `include`d by a wrapper, so line numbers in messages are the learner's own. The wrapper's stack frame is removed
   and the rest renumbered.
4. The module needs an explicit `processId`; a string request body is deprecated; Node must exit explicitly after the last test.

### Engine files touched (all additive; logged in `docs/TRACKS.md`)

`scripts/prepare-runtimes.mjs`, `scripts/php-worker-entry.mjs` (new), `src/lib/phpcore.mjs` (new), `src/lib/runners.js`, `src/lib/editor.js`,
`src/lib/symbols.js`, `src/lib/errors.js`, `src/lib/packs.js`, `src/ui/views/settings.js` (a download row per pack), `src/ui/views/learn.js`,
`src/ui/views/exercise.js`, `public/pack-sw.js`, `vite.config.js`, `.gitignore`, `package.json` + `package-lock.json`, `tests/run.mjs`.
**Still to do when the first lessons land:** `src/content/index.js` (one registry line), `tests/solutions.mjs` (one merge line).

Rule from `docs/TRACKS.md` still applies: lessons are written in the normal block format (`src/content/blocks.js`); no new block types are needed.

## Roadmap

`[ ]` still to write. Lesson ids never change once published. Exercise ids start with `php<lesson number>-`.
Every lesson: opens with a real story, has at least two interactive blocks, a mistake museum, a recap, and
exercises with exactly 3 hints and at least one hidden test (an exercise that takes no input, like the first lesson's, has one fixed test only).

**Level 1: First scripts**
- [x] 1. `php-first` Your first script (`<?php`, `echo`, `;`, comments, running a file)
- [x] 2. `php-vars` Variables and types (`$name`, `int`, `float`, `string`, `bool`, `var_dump`)
- [x] 3. `php-strings` Strings (quotes, interpolation, `.`, `strlen`, `strtoupper`, `str_replace`, `mb_` for Luganda text)
- [x] 4. `php-numbers` Numbers and operators (`+ - * / % **`, `intdiv`, `round`, `number_format` for UGX)
- [x] 5. `php-decide` Decisions (`if`, `elseif`, `else`, comparison, `==` vs `===`)
- [x] 6. `php-logic` Logic and `match` (`&&`, `||`, `!`, `switch`, `match`, `??` null coalescing)
- [x] 7. `php-receipt` Project: Nambi's booth receipt

**Level 2: Loops and arrays**
- [x] 8. `php-loops` `for`, `while`, `break`, `continue`
- [x] 9. `php-arrays` Indexed arrays, adding, counting, `foreach`
- [x] 10. `php-assoc` Associative arrays (keys and values), nested arrays
- [x] 11. `php-array-fn` `count`, `in_array`, `array_search`, `array_sum`, `max`/`min`, `sort` family, `array_slice` (usort moved to 12, after arrow functions)
- [x] 12. `php-map-filter` `array_map`, `array_filter`, `array_reduce`, arrow functions
- [x] 13. `php-daily-summary` Project: the booth's daily summary

**Level 3: Functions**
- [x] 14. `php-functions` Defining and calling functions, return values
- [x] 15. `php-types` Type declarations, default and named arguments, `declare(strict_types=1)`
- [x] 16. `php-scope` Scope, `static`, pass by reference
- [x] 17. `php-strings-pro` `sprintf`/`printf` widths, `str_pad`, `str_contains` family, `preg_match`/`preg_replace` basics (explode/implode/trim were taught earlier)
- [x] 18. `php-fees` Project: Mobile Money fee calculator

**Level 4: Objects**
- [x] 19. `php-classes` Classes, objects, properties, methods, constructor promotion
- [x] 20. `php-encapsulation` `public`, `private`, `readonly`, getters
- [x] 21. `php-inherit` Inheritance, `abstract`, `parent::`
- [x] 22. `php-interfaces` Interfaces, traits, `enum`
- [x] 23. `php-exceptions` `try`, `catch`, `finally`, custom exceptions
- [x] 24. `php-wallet` Project: the `Wallet` class (deposit, withdraw, insufficient funds)

**Level 5: Market-ready PHP** (web requests are simulated with plain arrays, because there is no web server in the app)
- [ ] 25. `php-requests` How the web works for PHP (`$_GET`, `$_POST`, `$_SERVER`, simulated requests)
- [ ] 26. `php-forms` Forms and validation (`filter_var`, trimming, error lists)
- [ ] 27. `php-security` XSS (`htmlspecialchars`), SQL injection, `password_hash`, `password_verify`
- [ ] 28. `php-files-json` Files and JSON (`file_put_contents`, `json_encode`, `json_decode`)
- [ ] 29. `php-pdo` PDO with SQLite (prepared statements, transactions)
- [ ] 30. `php-api` Building a JSON API (routes, status codes, error responses)
- [ ] 31. `php-structure` Namespaces, autoloading, Composer in plain words, project layout, tests
- [ ] 32. `php-momo-api` Integrating a payment API (simulated Mobile Money collection, webhooks, idempotency)
- [ ] 33. `php-capstone` Capstone: the booth ledger application

## Level 1 as written (files: `src/content/php/level1.js` lessons 1 to 3, `level1b.js` lessons 4 to 7, helpers in `shared.js`)

Lessons 1 to 7 are done and tested: 20 exercises (`php1-` to `php7-`, solutions in `tests/solutions-php.mjs`). Do not rewrite them.
Facts later lessons can rely on, and conventions to keep:

- **The project is Nambi's Money Booth, Mukono.** The receipt (lesson 7) is built independently in JavaScript by `receipt()` in `shared.js`;
  use that helper for any later exercise that prints a receipt. The fee table is made up for teaching and is labelled as such in the text:
  deposits free; withdrawals up to 50,000 cost 1,000, up to 200,000 cost 2,000, above that 3,500 (`boothFee()`).
- Level 1 has taught: `echo` (with commas), `$variables`, string/int/float/bool/null, `var_dump`, `trim(fgets(STDIN))` and `(int)`, quotes and
  interpolation, `.`, the string toolbox (`strlen`, `strtoupper`, `strtolower`, `ucfirst`, `ucwords`, `trim`, `str_replace`, `str_repeat`, `substr`,
  `strpos`, `mb_strlen`), arithmetic, `intdiv`, `%`, `**`, `round`, `floor`, `ceil`, `abs`, `max`, `min`, `number_format`, `if/elseif/else`, `=== ==`,
  `&& || !`, `match`, `switch` (only in a mistake), `?:` and `??`. Arrays appear once, in lesson 6, as a "price list"; they are taught properly in lesson 9.
- The lesson 7 receipt program repeats the fee chain; lesson 14 (functions) must come back to it and show it written once.
- Code in these files uses `php` = `String.raw` (see `shared.js`): write PHP with its backslashes as they are, never use backticks or `${` inside PHP code.
- A "mistake" that only gives a warning or a wrong answer (not a fatal error) must have `logic: true`, or the test says "the mistake really fails".
  A `bug` block must be a real fatal or parse error.
- Warnings are part of the output. Lesson 2 shows one on purpose (`Warning: Undefined variable $nmae in main.php on line 3`).

## Level 2 as written (files: `src/content/php/level2.js` lessons 8 to 10, `level2b.js` lessons 11 to 13)

Lessons 8 to 13 are done and tested: 26 exercises (`php8-` to `php13-`). Do not rewrite them. Facts later lessons can rely on:

- Taught: `for`, `while`, `break`, `continue`, reading input with `while (($line = fgets(STDIN)) !== false)` and with a count-first `for`; indexed and
  associative arrays, `[]`, `count`, `foreach` (with `$k => $v`), `isset`, `??`, the tally pattern, lists of records; `explode`/`implode`, `print_r`;
  `array_sum`, `max`/`min` on arrays, `in_array` (strict), `array_search` (`!== false`), `sort`/`rsort`/`asort`/`arsort`/`ksort`, `array_slice`, `array_merge`,
  `array_reverse`, `array_unique`, `range`, `array_keys`/`array_values`; arrow functions `fn`, `array_map`, `array_filter` (keeps keys), `array_reduce`,
  `usort` with `<=>` and `?:` tie-breaks, `array_column`; destructuring `[$a, $b] = explode(...)` (first used in lesson 13).
- NOT yet taught (Level 3): `function`, `return`, type declarations, `sprintf`, `str_pad`, classes. Lesson 13 says the fee rule "will get a function in Level 3".
- The project report is built independently in JavaScript by `summaryLines()`, `ranking()`, `txInput()` in `shared.js`; reuse them.
- Arrow functions copy outside variables (they cannot change them): taught as a mistake in lesson 12. Pass by reference comes in lesson 16.

## Level 3 as written (files: `src/content/php/level3.js` lessons 14 to 16, `level3b.js` lessons 17 and 18)

Lessons 14 to 18 are done and tested: 23 exercises (`php14-` to `php18-`). Do not rewrite them. Facts later lessons can rely on:

- Taught: `function`, parameters, `return` (early return, arrays, no return = null), types (`int float string bool array`, `?T`, `void`), defaults, named arguments,
  `declare(strict_types=1)` (first statement; input from `fgets` needs `(int)`), scope (private variables, `static`, `&` references, `function () use (&$x)`),
  `sprintf`/`printf` (`%s %d %f %05d %.2f %-12s %10s`), `str_pad`, `str_starts_with/ends_with/contains`, `preg_match`, `preg_replace`, `ctype_digit`.
- NOT yet taught: classes, objects, exceptions, `readonly`, enums, namespaces. Lesson 18 ends by saying Level 4 gives the functions and their data a home: a class.
- Project 18 is "Mobile Money fee calculator" with MADE-UP fee tables (send, withdraw, 0.5% levy on withdrawals); the PHP library is `MOMO_LIB` in `shared.js`
  (used by the lesson and by the exercise starters and solutions); expected outputs come from `momoStatement()`, `momoFee()`, `levy()` in `shared.js`.
- `reorder` blocks: PHP hoists top-level functions, so a reorder block whose only order rule is "function before call" has several correct orders
  and fails the "only one order is correct" test. Use 7 or more lines (the permutation check only runs for 6 or fewer).
- A `predict` answer must be exactly the text the code prints (the test compares).

## Level 4 as written (files: `src/content/php/level4.js` lessons 19 to 21, `level4b.js` lessons 22 to 24)

Lessons 19 to 24 are done and tested: 23 exercises (`php19-` to `php24-`). Do not rewrite them. Facts later lessons can rely on:

- Taught: classes, objects, `new`, `$this`, constructor promotion, `return $this` chaining, handles vs `clone`, class constants and static methods (mentioned),
  `public`/`private`/`protected`, getters, `readonly`, `final`, `__toString`, static factories (`fromLine`), `extends`, `parent::`, `abstract`, polymorphism,
  `instanceof`, interfaces, traits, backed enums (`from`, `tryFrom`, `cases`, methods, `match ($this)`), `throw`, `try`/`catch`/`finally`, custom exceptions with
  readonly data, catching several kinds, `Throwable`, the null-safe `?->` (mentioned in a mistake).
- NOT yet taught: namespaces, autoloading, `use` imports, static properties, `__get`/magic methods, generators, `DateTime`, PDO, JSON, sessions.
- The Wallet project: PHP in `WALLET_LIB` and `walletMain()` in `shared.js` (the lesson, the exercise starters and the solutions all use them);
  the expected outputs come from `walletSession()`. Commands: `deposit N`, `withdraw N` (booth fee on top), `balance`, `statement`. Messages are
  `Deposited UGX x. Balance: UGX y`, `Withdrew UGX x (fee UGX f). Balance: UGX y`, `Declined: <message>`, `Unknown command: c`.
- Lesson 25 onwards can build on the wallet and on `Kind`, `Transaction`, `InvalidAmountException`, `InsufficientFundsException`.
- PHP trap seen in a test: `echo "UGX ", f()` prints `UGX ` BEFORE `f()` throws. Exercise php23-parse-throw warns about it in a hint.
- Enum and `fill` blocks: every wrong option of a `fill` must really fail (the test checks), so "private vs public" cannot be a fill.

## Style notes specific to PHP

- Teach modern PHP 8 only (`match`, `readonly`, enums, constructor promotion, `??`, strict types). Say once that old
  tutorials show PHP 5 style; do not teach `mysql_*` functions.
- PHP is usually run on a web server. The app has none, so every lesson prints to the output panel. Be honest about this
  in lesson 1 and again in lesson 25.
- Do not claim a feature works until the test runner has run it on the shipped runtime.
