# SayMaCoder: how several Claude accounts build it together

Read this file first, every session. It exists because the project is built by more than one Claude
account, and **accounts share no memory**. Whatever is not written in this repository is forgotten.
Already once, one account wrote lessons that another account had finished the day before.

Last updated: 2026-11-15.

## The five rules

1. **Start by reading.** Read this file, your track's roadmap, and `git log --oneline -20`. If the
   roadmap says a lesson is done, it is done. Do not rewrite it.
2. **Stay in your lane.** Edit only the files that belong to your track (table below). The one
   exception is the single registry line described under "Shared files".
3. **Green or it does not ship.** `npm test` must pass with 0 failures before you hand anything over.
   The tests run every example and check every exercise against a reference solution, so a lesson
   cannot teach something that does not work.
4. **Small and often.** Hand over (commit, or a zip) after every group of lessons, not at the end.
   Usage limits can stop a session at any moment; finished groups survive, half a group does not.
5. **Leave a trail.** Before you finish (or when you feel your limit approaching), add a row to the
   handoff log at the bottom of this file and tick the roadmap of your track.

**Decision of the project owner (Steven, 2026-11-15):** the Java account owns **everything that is about Java**, including
the engine and app code that runs, edits, downloads, tests and explains Java (the Java row below lists the files). Rule 2
stays as it is for every other language: the Java account does not edit the C, Python or web parts of those shared files,
and `npm test` must stay green for all languages.

## The tracks

| Track | Course id | Language id | Files you own | Status | Owner |
|---|---|---|---|---|---|
| Web (HTML, CSS, JavaScript) | `web-start` | `web` | `src/content/web/`, `src/content/web-course.js`, `docs/WEB-TRACK.md` | Written: 36 lessons, 105 exercises. Later ideas in its roadmap. | (unassigned) |
| Python | `py-start` | `python` | `src/content/py/`, `src/content/python-course.js`, `tests/solutions-py.mjs`, `docs/PY-TRACK.md` | In progress, see `docs/PY-TRACK.md`. Levels 1 to 8 written (52 lessons, 107 exercises). Next: Level 9 (lessons 53 to 57). Roadmap runs to lesson 57. | Python account |
| C (module TTSD113) | `c-structured` | `c` | `src/content/c/`, `src/content/c-course.js`, `tests/solutions-c.mjs`, `docs/C-TRACK.md` | In progress, see `docs/C-TRACK.md` | C account |
| C++ (Part A basics; Part B needs a real compiler) | `cpp-start` | `cpp` | `src/content/cpp/`, `src/content/cpp-course.js`, `tests/solutions-cpp.mjs`, `docs/CPP-TRACK.md` | Part A written (18 lessons, 54 exercises); Part B blocked on a real compiler, see `docs/CPP-TRACK.md` | C++ account |
| SQL (SQLite) | `sql-start` | `sql` | `src/content/sql/`, `src/content/sql-course.js`, `tests/solutions-sql.mjs`, `docs/SQL-TRACK.md` | Complete: 33 lessons, 99 exercises | SQL account |
| PHP | `php-start` | `php` | `src/content/php/`, `src/content/php-course.js`, `tests/solutions-php.mjs`, `docs/PHP-TRACK.md` | Runner built. **Level 1 done: 7 lessons, 20 exercises.** Roadmap of 33 lessons in `docs/PHP-TRACK.md`; next is Level 2 (lessons 8 to 13). | PHP account |
| Java | `java-start` (proposed) | `java` | `src/content/java/`, `src/content/java-course.js`, `tests/solutions-java.mjs`, `docs/JAVA-TRACK.md`, **and the Java engine/app code**: `src/lib/javasource.js`, `public/workers/java.worker.js`, `tests/java-node.mjs`, `tests/java-node-worker.mjs`, `tests/java-probe.mjs`, plus the Java parts of `src/lib/runners.js`, `src/lib/packs.js`, `src/lib/errors.js`, `src/lib/symbols.js`, `src/lib/editor.js`, `scripts/prepare-runtimes.mjs`, `tests/run.mjs` (sections marked Java), the Settings and playground screens | **Runtime built and verified in a real browser. Levels 1 and 2 (lessons 1 to 15, 62 exercises) written, tested and live in the Learn screen.** Level 3 (objects) is next. See `docs/JAVA-TRACK.md`. | Java account |
| VB.NET | not created | not created | would be `src/content/vb/` | **Not started.** Needs a runtime first (see below). | (unassigned) |
| Engine and app | | | everything under `src/lib/`, `src/ui/`, `public/`, `scripts/`, `tests/run.mjs`, `tests/render.mjs`, `README.md`, `.github/` | Working. Open items below. | **one account only** |

**One owner per track.** Two accounts on the same track will collide. The engine and app track has
exactly one owner because everything else depends on it: a change there can break every course.

### Java and VB.NET need a runtime before any lesson

C runs on JSCPP and Python on Pyodide, both inside the browser with no internet. There is no Java or
VB.NET runtime in the app yet, and nobody has checked what can run **offline in a phone browser**.
The first job on these tracks is a feasibility note (`docs/JAVA-TRACK.md`, `docs/VB-TRACK.md`):
which interpreter or compiler, how big the download is, what subset of the language it supports,
and whether it runs in a Web Worker. Do not write lessons until that note says the runtime works.
Runtime work touches the engine files, so coordinate it with the engine owner.

## Shared files (be careful)

These are used by every track. Do not reformat or reorganise them.

| File | Rule |
|---|---|
| `src/content/index.js` | The course registry. A new track adds **one** import and **one** entry. Nothing else. |
| `src/content/blocks.js` | The lesson block format. Changing it affects every course. Engine owner only. |
| `tests/run.mjs`, `tests/render.mjs` | The test suite. Engine owner only. |
| `tests/solutions.mjs` | Merges the per-track solution files. Do not add solutions here; add them to your track's file (`tests/solutions-c.mjs`, and so on). |
| `README.md` | Engine owner updates it. Tracks report their status in this file instead. |
| `src/lib/errors.js` | Plain-language error messages. Add rules for your language, never edit another language's. |
| `scripts/prepare-runtimes.mjs` | Each runtime has a list of small patches. The account that owns a language may add a patch for **its own** runtime when a lesson is blocked by a bug, if the patch has a clear `why` and a lesson exercises it (the build stops loudly if a patch stops applying). Never edit another language's patches or the build logic. |

## Before you start a session

```bash
git pull                      # or re-download the repo. Never start from an old copy.
git log --oneline -20         # what changed since you last looked?
npm install
npm test                      # must be green BEFORE you touch anything
```

If `npm test` is red before you start, tell the owner. Do not "fix" another track's lessons.

## What a finished lesson looks like

The authoritative description is the comment at the top of `src/content/blocks.js`, and the tests
enforce it. In short:

- A lesson has an `id`, `level`, `title`, `summary`, `minutes`, `blocks` and `exercises`.
- It **opens with a story** from real life (a boda rider, a duuka, Mama Rose's rolex stand) and
  **ends with a recap**. It has at least two interactive blocks (`try`, `predict`, `fill`, `reorder`,
  `bug`, `quiz`, `project`).
- It includes a **mistake museum** (`mistakes`): the errors beginners really make, with why and the fix.
- Every exercise has a prompt, a starter, **exactly 3 hints** (nudge, bigger hint, worked example of
  a *similar* problem), at least one test, and at least one **hidden** test.
- Every exercise has a reference solution in the track's solutions file. The starter must **fail**
  the tests, the solution must pass them.
- A course keeps one running project so learners build something they can show people.

### Style

- Plain English. Short sentences. Assume the reader is a diploma student on a phone, possibly in
  their second language, but treat them as an adult. Children and older learners must also be able
  to follow the early lessons.
- Ugandan, relatable examples: Mobile Money, boda boda, duuka, matooke, school marks out of 100,
  UGX prices. Amounts should look real.
- Teach one idea per lesson, show it running, then make the learner do it.
- All lessons and exercises are **original**. Never copy proprietary course material, textbook text
  or exam papers.
- Do not claim the runtime supports something you have not run. The test suite is the proof.

## Handing work over

The owner (Steven) uploads your work to GitHub by drag-and-drop. That makes one mistake very
easy: **a zip of the whole project silently overwrites newer work from another account.**

- Give back **only the files you changed**, as a zip that keeps the folder paths
  (for example `src/content/c/...`, `tests/solutions-c.mjs`).
- Never include `node_modules`, `dist`, `package-lock.json` or files from another track.
- Say in your final message: the list of files in the zip, the lesson count, and the test result
  (for example "3,941 checks, 0 failed").
- If your work needs a change in a shared file, say exactly which line and why, instead of shipping
  a modified copy of the whole file.

If your session can push to GitHub directly, use a branch named after your track
(`track/c`, `track/java`) and let the owner merge, rather than pushing to `main`.

## Open items (engine and app owner)

- Real-phone testing on low-end Android (so far only emulated in desktop Chromium). Cannot be done by Claude.
- Luganda error messages need a native speaker (they fall back to English today).
- `README.md` is out of date (still says "Python Level 1 written" and "C draft").
- Build warning: one JavaScript chunk is over 900 kB; split with dynamic `import()`.
- Not built yet: C memory visualizer, lecturer mode, certificates, phone-to-phone sharing,
  on-device AI tutor.
- A `hello.md` leftover in the repository root can be deleted.

## Starter prompts

Copy the block for the track into a fresh Claude account. Add the repository link and, if the
account has no GitHub access, upload the latest zip of the repository.

**Any track (put this first):**

> You are one of several Claude accounts building SayMaCoder, an offline-first coding course app for
> students in Uganda. Read `docs/TRACKS.md` completely before you do anything, then your track's
> roadmap. You own only the files listed for your track. Do not rewrite lessons that the roadmap
> marks as done. Run `npm test` before and after your work; hand over only when it is green. Deliver
> a zip with only the files you changed, keep their folder paths, and list them in your reply. Before
> your usage limit runs out, update the roadmap and the handoff log in `docs/TRACKS.md`.

**C:**

> Track: C (course id `c-structured`). Roadmap: `docs/C-TRACK.md`. Build the lessons in the order
> the roadmap gives, one group at a time. Every program is run by the JSCPP interpreter, which is a
> teaching subset of C, so check that each example really runs before you teach it.

**C++:**

> Track: C++ (course id `cpp-start`). Roadmap: `docs/CPP-TRACK.md`. Part A (basics) runs on the JSCPP
> interpreter: build the lessons in the order the roadmap gives and check that each example really runs.
> Part B (strings, vectors, classes, templates) needs a real compiler: do not write those lessons until
> `docs/CPP-TRACK.md` says a browser test on a real phone passed.

**SQL:**

> Track: SQL (course id `sql-start`). Roadmap: `docs/SQL-TRACK.md`. Build the lessons in the order the roadmap gives, one group at a time. SQL runs on SQLite (sql.js) and its "input" is the practice database; read the "How SQL runs" section first. Build expected outputs from JavaScript data with `tbl()`, never from the SQL itself.

**Java:**

> Track: Java. Nothing exists yet. Your first deliverable is `docs/JAVA-TRACK.md`: can Java run
> offline in a phone browser, with what runtime, what download size, what subset? Test it, do not
> guess. Do not write lessons until that note says the runtime works. Report the engine changes you
> need instead of making them.

**VB.NET:**

> Track: VB.NET. Same as Java: your first deliverable is `docs/VB-TRACK.md`, a tested feasibility
> note for running VB.NET offline in a browser. No lessons until the runtime is proven.

**Python depth:**

> Track: Python (`py-start`). Levels 1 to 5 are written. Propose Level 6 and later in
> `docs/PY-TRACK.md` (for example classes in depth, working with data, small games, a final
> capstone), get it agreed, then build. Keep the Duuka running project style.

**Engine and app (only one account):**

> Track: engine and app. You own `src/lib`, `src/ui`, `public`, `scripts`, the test runner, the
> README and the deploy workflow. Other accounts write lessons and rely on your block types and
> tests not changing. Never change the lesson format without updating `docs/TRACKS.md`.

## Handoff log

Add a row at the **bottom** each session. Newest last.

| Date | Account / track | Done | Next |
|---|---|---|---|
| 2026-11-12 | Claude, web | Web track written, 36 lessons, 105 exercises, tests green | Later ideas in `docs/WEB-TRACK.md` |
| 2026-11-14 | Claude, coordination | Wrote this file; split tracks by language; C account starts `docs/C-TRACK.md` | C lessons |
| 2026-11-14 | Claude, C | `docs/C-TRACK.md` (roadmap, tested interpreter limits); `scanf` array-input patch; C Level 1 rewritten in the rich format (lessons 1 to 4, 13 exercises; `c-think` and `c0-*`, `c2t-*` are new); C solutions moved to `tests/solutions-c.mjs`. Tests green: 4,145 checks, 0 failed | C Level 2: rewrite `c-decisions` and `c-loops` (still old draft format in `src/content/c/legacy.js`), then lessons 6, 8, 9, 10 |
| 2026-11-14 | Claude, C | C Level 2 part 1: `c-decisions` rewritten in the rich format, new `c-logic` (`&&`, `||`, `!`, `switch`, `?:`); 4 new exercises (`c3-sign`, `c6-leap`, `c6-day`, `c6-bigger`); lessons in `src/content/c/level2.js`. Tests green: 4,255 checks, 0 failed. `track/c` pushed to GitHub | `c-loops` rewrite, then `c-while`, `c-nested`, Duuka till project (lessons 7 to 10) |
| 2026-11-14 | Claude, C | C Level 2 finished: `c-loops` rewritten, new `c-while`, `c-nested` and `c-till` (lessons 7 to 10) in `src/content/c/loops.js`; 10 new exercises; old `legacy.js` deleted. Tests green: 4,983 checks, 0 failed. Pushed to `main` | C Level 3: functions (lessons 11 to 15) |
| 2026-11-14 | Claude, C | C Level 3 written: `c-functions`, `c-params`, `c-recursion`, `c-momo` (project), `c-debug` (lessons 11 to 15, in `src/content/c/functions.js`); 13 new exercises. **Engine files touched (C runtime bugs that blocked lessons):** `scripts/prepare-runtimes.mjs` (new patch: `static` locals keep their value), `src/lib/csource.js` (spaces next to brackets in strings), `tests/run.mjs` (3 new checks). Tests green: 5,262 checks, 0 failed | C Level 4: arrays and strings (lessons 16 to 22) |
| 2026-11-15 | Claude, C | C Level 4, part 1: `c-arrays`, `c-array-algos`, `c-array-fn`, `c-2d` (lessons 16 to 19, in `src/content/c/arrays.js`); 12 new exercises. **Engine files touched:** `scripts/prepare-runtimes.mjs` (3 new patches: short array lists padded with zeros, `strcmp`, `strncmp`), `tests/run.mjs` (7 new checks). Tests green: 5,508 checks, 0 failed | Strings: lessons 20 to 22 (strings, `string.h` and `ctype.h`, marks processor project) |
| 2026-11-15 | Claude, C | C Level 4 finished: `c-strings`, `c-stringlib`, `c-marks` (project) (lessons 20 to 22, in `src/content/c/strings.js`); 8 new exercises. **Engine files touched:** `scripts/prepare-runtimes.mjs` (5 more patches: characters from `scanf %s`, `gets` and `strcpy` stay assignable), `tests/run.mjs` (4 checks). Tests green: 5,667 checks, 0 failed | C Level 5: pointers (lessons 23 to 25) |
| 2026-11-15 | Claude, C++ | New track `cpp-start`: `docs/CPP-TRACK.md` (roadmap, tested interpreter limits, feasibility of a real compiler: `@yowasp/clang` compiles and runs `std::string`, `vector` and classes in Node, about 27 MB gzipped, needs `-fno-exceptions`, **not yet tested in a browser or on a phone**). C++ Level 1 and lesson 4 written: `cpp-first`, `cpp-vars`, `cpp-types`, `cpp-decide` (lessons 1 to 4, 12 exercises). **Engine files touched (additive):** `src/lib/runners.js`, `csource.js`, `editor.js`, `symbols.js`, `errors.js`, `src/ui/views/learn.js`, `tests/run.mjs` (5 checks), `tests/solutions.mjs` (one merge line), `src/content/index.js` (registry line). Tests green: 5,966 checks, 0 failed | Lessons 5 to 9 (switch, loops, till project). Engine owner: browser proof of the C++ compiler on a real phone |
| 2026-11-15 | Claude, SQL | New track `sql-start`: `docs/SQL-TRACK.md` (33-lesson roadmap, tested SQLite feature list). SQL runtime proven offline: sql.js (SQLite 3.54.1, about 700 KB) in a worker, precached; the practice database travels in the "input" and every run starts fresh. Level 1 lessons 1 to 3 written: `sql-tables`, `sql-columns`, `sql-where` (9 exercises, each with a hidden test on a different shop). **Engine files touched (additive):** `public/workers/sqlcore.js`, `sql.worker.js` (new), `scripts/prepare-runtimes.mjs`, `vite.config.js` (wasm precache), `package.json` + `package-lock.json`, `src/lib/runners.js`, `editor.js`, `symbols.js`, `errors.js` (11 SQL rules, English and Kiswahili), `src/ui/components.js`, `lesson-blocks.js`, `views/exercise.js`, `views/learn.js`, `tests/run.mjs` (SQL runner, error cases, engine checks), `tests/solutions.mjs` (one merge line), `src/content/index.js` (registry line). Tests green: 6,207 checks, 0 failed. Pushed to branch `track/sql` | Level 1 lessons 4 to 7 (text and NULL, sorting, calculations, price-list project). Engine owner: review the branch, real-phone test, `exercise.js` `LANGUAGE_NAME` still lacks `cpp` |
| 2026-11-15 | Claude, C | C Level 5 finished, so **all of Part A (lessons 1 to 25) is written**: `c-pointers`, `c-ptr-fn`, `c-ptr-arrays` (in `src/content/c/pointers.js`); 10 new exercises. **Engine files touched:** `scripts/prepare-runtimes.mjs` (7 more JSCPP patches: pointer `!=`, `<`, `>`, `<=`, `>=`, `-`, `+=`, `-=`, and `++`/`--` no longer moving the array), `tests/run.mjs` (5 checks). Tests green: 5,861 checks, 0 failed | Part B (structs, enum, malloc, files) is blocked until the engine owner decides on a C runtime; see "Engine requests" in `docs/C-TRACK.md`. Meanwhile: lecturer review against the real TTSD113 outline, README refresh |
| 2026-11-15 | Claude, SQL | Level 1 finished: `sql-text-null`, `sql-sort`, `sql-calc`, `sql-pricelist` (project) (lessons 4 to 7, in `src/content/sql/level1b.js`); 12 new exercises, each with a hidden test on a different shop. Found and fixed a wrong claim during testing: this SQLite DOES have `CONCAT()` (lessons teach `||`, the portable way). **Engine files touched:** none. Tests green: 6,443 checks, 0 failed. Pushed to `main` | Level 2 (lessons 8 to 12: aggregates, `GROUP BY`, `HAVING`, dates, daily report). It needs a `sales` table added to `src/content/sql/shared.js` as new exports |
| 2026-11-15 | Claude, SQL | Level 2 finished: `sql-aggregates`, `sql-group`, `sql-having`, `sql-dates`, `sql-daily-report` (project) (lessons 8 to 12, in `src/content/sql/level2.js`); 15 new exercises, each with a hidden test on a different shop. New `sales` table in `src/content/sql/shared.js` (new exports only, existing rows unchanged). **Engine files touched:** none. Tests green: 6,908 checks, 0 failed | Level 3 (lessons 13 to 18: `CREATE TABLE`, `INSERT`, `UPDATE`/`DELETE`, constraints, `ALTER`, build-the-duuka project). Lessons that change data print `(N rows changed)`; every run starts from a fresh database |
| 2026-11-15 | Claude, SQL | Level 3 finished: `sql-create`, `sql-insert`, `sql-update-delete`, `sql-constraints`, `sql-alter`, `sql-build-duuka` (project) (lessons 13 to 18, in `src/content/sql/level3.js`); 18 new exercises, each with a hidden test (a different shop, or a database that already has other tables). `suppliers` table added to `shared.js` (new exports only). **Engine files touched (additive):** `src/lib/errors.js` (3 new SQL rules: `CHECK` failed, INSERT names a missing column, new `NOT NULL` column without a default; English and Kiswahili) and `tests/run.mjs` (3 matching error cases). Tests green: 7,260 checks, 0 failed | Level 4 (lessons 19 to 25: relations and foreign keys, `INNER JOIN`, `LEFT JOIN`, joins with `GROUP BY`, subqueries, many-to-many, customer statement). Decide whether the practice database turns `PRAGMA foreign_keys` on (it is OFF by default in SQLite) |
| 2026-11-15 | Claude, C++ | C++ Level 2 complete: `cpp-switch`, `cpp-loops`, `cpp-while`, `cpp-nested`, `cpp-rolex` (lessons 5 to 9, 14 more exercises, 26 in total). Tests green: 6,261 checks, 0 failed, 111 lesson screens render. No new engine changes in this group | Lessons 10 to 13 (functions, scope and default arguments, recursion, Mobile Money menu project). Engine owner: still needs the browser and phone proof of the real C++ compiler before any Part B lesson |
| 2026-11-15 | Claude, C++ | C++ Level 3 complete: `cpp-functions`, `cpp-scope`, `cpp-recursion`, `cpp-momo` (lessons 10 to 13, 11 more exercises, 37 in total, 13 lessons). **Engine file touched (additive):** `src/lib/errors.js` (new C++-only rule `cpp-stack`) and `tests/run.mjs` (1 check). Tests green: 7,804 checks, 0 failed | Lessons 14 to 17 (arrays, array algorithms, 2D arrays, `char` arrays) then 18 (pointers). Engine owner: browser and phone proof of the real C++ compiler is still needed before any Part B lesson |
| 2026-11-15 | Claude, SQL | Level 4 finished: `sql-relations`, `sql-inner-join`, `sql-left-join`, `sql-join-agg`, `sql-subqueries`, `sql-many-to-many`, `sql-statement` (project) (lessons 19 to 25, in `src/content/sql/level4a.js` and `level4b.js`); 21 new exercises, each with a hidden test on a different shop. New practice tables `orders` and `order_items` in `shared.js` (new exports only) and expected-answer helpers in `src/content/sql/world.js`. Decision taken: the practice database does NOT enforce foreign keys; lesson 19 teaches `PRAGMA foreign_keys = ON;` as a habit. **Engine files touched (additive):** `src/lib/errors.js` (2 new SQL rules: `FOREIGN KEY constraint failed`, sub-select returns more than one column; English and Kiswahili) and `tests/run.mjs` (2 matching error cases). Tests green: 7,658 checks, 0 failed | Level 5 (lessons 26 to 33: schema design, indexes and `EXPLAIN QUERY PLAN`, views, transactions, CTEs and window functions, triggers and upsert, using SQL from apps, capstone) |
| 2026-11-15 | Claude, C (README) | README refreshed on request: current lesson counts for all five courses, runtimes (JSCPP patches, sql.js), pointer to docs/TRACKS.md. Counts: C 25/75, C++ 13/37, Python 35/68, Web 45/136, SQL 25/75. |
| 2026-11-15 | Claude, C | Level 6 finished: `c-bits`, `c-macros`, `c-number-algos`, `c-sorting` (lessons 26 to 29, in `src/content/c/pro.js`); 13 new exercises (88 in total). **Engine file touched (additive):** `src/lib/csource.js` wraps decimal `#define` values in brackets (a bare `#define PI 3.14159` crashed the interpreter); test added in `tests/run.mjs`. The C course is now described as beginner-to-pro, not tied to TTSD113. Tests green: 8,462 checks, 0 fail. |
| 2026-11-15 | Claude, C++ | C++ Level 4 complete: `cpp-arrays`, `cpp-array-algos`, `cpp-2d`, `cpp-cstrings` (lessons 14 to 17, 13 more exercises, 50 in total, 17 lessons). No engine changes in this group (new helper `IO_STR` and `progFn` only in `src/content/cpp/shared.js`). Tests green: 8,077 checks, 0 failed. New interpreter limits documented in `docs/CPP-TRACK.md` (cin-filled `char` arrays cannot be modified, `cin.ignore()` crashes, out-of-range stops the program) | Lesson 18 (pointers) finishes Part A. Engine owner: browser and phone proof of the real C++ compiler is still needed before any Part B lesson |
| 2026-11-15 | Claude, C++ | **C++ Part A complete:** `cpp-pointers` (lesson 18, 4 exercises). The course has 18 lessons and 54 exercises. **Engine file touched (additive):** `src/lib/errors.js` (C++-only rules `cpp-index`, `cpp-pointer-uninit`, `cpp-pointer-type`) and `tests/run.mjs` (4 checks). README row for C++ updated. Tests green: 8,840 checks, 0 failed | Part B (strings, vectors, references, classes, templates, STL, files, exceptions) is **blocked**: the engine owner must first prove the real C++ compiler (`@yowasp/clang`, about 27 MB gzipped, needs `-fno-exceptions`) in a browser worker on a real phone. See "Feasibility" in `docs/CPP-TRACK.md` |
| 2026-11-15 | Claude, PHP | New track `php-start` (not yet in the registry): `docs/PHP-TRACK.md` with a 33-lesson roadmap and a tested feasibility note. PHP 8.3 runs as WebAssembly in Node (`@php-wasm/node`): about 8.7 MB gzipped, `mbstring`, `json`, `pdo_sqlite` present, errors and `STDIN` need the workarounds listed in the note. **Not yet proven in a browser or on a phone.** No engine files touched, no lessons yet | Engine owner: browser and phone proof of `@php-wasm/web` in a Web Worker, and a size decision. Then the PHP runner, then Level 1 (lessons 1 to 7) |
| 2026-11-15 | Claude, PHP | **PHP runner built** on branch `track/php`: real PHP 8.3 on WebAssembly, an optional 17.5 MB download in Settings (about 7 MB gzipped, like Python), worker 0.5 MB precached. Proven in Node, in a Chromium Web Worker, and in the built app with the network off. 13 PHP error rules (English and Kiswahili). **Engine files touched (additive):** `scripts/prepare-runtimes.mjs`, `scripts/php-worker-entry.mjs` (new), `src/lib/phpcore.mjs` (new), `src/lib/runners.js`, `editor.js`, `symbols.js`, `errors.js`, `packs.js`, `src/ui/views/settings.js` (one download row per pack; Python's row unchanged in behaviour), `learn.js`, `exercise.js`, `public/pack-sw.js` (serves `/php/` as well as `/pyodide/`), `vite.config.js` (php/ not precached), `.gitignore`, `package.json` + `package-lock.json` (`@php-wasm/*`, `@codemirror/lang-php`), `tests/run.mjs` (PHP runner, 13 error cases, 25 engine checks, explicit exit). Tests green: 8,280 checks, 0 failed | Level 1 lessons 1 to 7 (needs `src/content/index.js` registry line and `tests/solutions.mjs` merge line). Engine owner: real low-end Android test of the PHP pack |
| 2026-11-16 | Claude, PHP | **PHP Level 1 written and registered**: lessons 1 to 7 (first script, variables and types, strings, numbers, decisions, logic and match, the receipt project), 20 exercises with reference solutions in `tests/solutions-php.mjs`. Files: `src/content/php/{shared,level1,level1b}.js`, `src/content/php-course.js`, one import and one entry in `src/content/index.js`, one import and one spread in `tests/solutions.mjs`. `npm test`: 8,741 checks, 0 failed; 150 lesson screens rendered; `npm run build` passes. **Engine note (one line, `vite.config.js`):** all courses are bundled in one JavaScript file that grew to 2.15 MB with the PHP lessons, past the 2 MiB workbox precache limit, which made the build fail (a file over the limit is not precached, which would break offline use). I raised `maximumFileSizeToCacheInBytes` to 4 MiB. Every track adds to that file: the real fix is to load each course on demand (dynamic import) | Level 2 (lessons 8 to 13). Engine owner: load courses lazily before the bundle reaches 4 MiB; low-end Android test of the PHP pack |
| 2026-11-16 | Claude, C | Level 7 finished: `c-text-algos`, `c-recursion-deep`, `c-stock-system` (lessons 30 to 32, in `src/content/c/level7.js`); 13 more exercises (C total: 32 lessons, 98 exercises). No engine files touched. Tests green: 9,027 checks, 0 fail. |
| 2026-11-15 | Claude, C++ | **C++ phone test page** added at `public/cpp-test/` (not linked from the app). It compiles and runs real C++ (`@yowasp/clang`, pinned 22.0.0-git20542-10) in a Web Worker and reports timings. Driven in headless Chromium 153: all 5 programs pass (string/vector/class, virtual, templates, lambda, `map`, `cin`, a compile error with the real Clang message, a runaway program stopped without freezing the page), also with the network off. **Not yet run on a real phone.** **Shared file touched:** `vite.config.js` (`navigateFallbackDenylist` for `/cpp-test/`, so the service worker never answers that page with the app shell). Docs: "Phone test" in `docs/CPP-TRACK.md` | Kyobe opens `/cpp-test/index.html` on a real phone (private tab, Wi-Fi), taps Run the test, and pastes the report. The verdict decides whether the compiler becomes an optional pack and Part B gets written. Engine owner: integrate only after a GOOD or WORKS BUT SLOW verdict |
| 2026-11-15 | Claude, SQL | Level 5 started: `sql-design`, `sql-indexes`, `sql-views`, `sql-transactions` (lessons 26 to 29, in `src/content/sql/level5a.js`); 12 new exercises, each with a hidden test. **Engine files touched (additive):** `public/workers/sqlcore.js` (`EXPLAIN QUERY PLAN` now prints only a `plan` column; documented in the file and `docs/SQL-TRACK.md`), `src/lib/errors.js` (3 new SQL rules: change rows of a view, commit/rollback/BEGIN with no or nested transaction, window function in WHERE; and the "already exists" rule now also covers index, view and trigger) and `tests/run.mjs` (matching cases and 2 plan checks). Tests green: 8,462 checks, 0 failed | Level 5 lessons 30 to 33 (CTEs and window functions, triggers and upsert, SQL from apps / injection, Mobile Money capstone) |
| 2026-11-16 | Claude, Python | Roadmap for Levels 6 to 9 agreed and written in `docs/PY-TRACK.md` (57 lessons in total). **Level 6 part A written:** `py-decorators`, `py-context`, `py-special` (lessons 36 to 38, in `src/content/py/level6a.js`); 8 new exercises (`py35-` to `py37-`), reference solutions in the new `tests/solutions-py.mjs` (one import and one spread added to `tests/solutions.mjs`). Registry unchanged (same course id `py-start`). No engine files touched. Tests green: 10,037 checks, 0 failed; 169 lesson screens rendered | Level 6 part B: `py-typing`, `py-regex`, `py-project-ledger` (lessons 39 to 41). Engine owner: README still lists Python as 35 lessons and 68 exercises |
| 2026-11-16 | Claude, Python | **Level 6 finished:** `py-typing`, `py-regex`, `py-project-ledger` (lessons 39 to 41, in `src/content/py/level6b.js`); 7 new exercises (`py38-` to `py40-`), solutions in `tests/solutions-py.mjs`. Python is now 41 lessons and 78 exercises. No engine files touched. Tests green: 10,192 checks, 0 failed; 172 lesson screens rendered; `npm run build` passes (main JS bundle 2.39 MB of the 4 MiB precache limit) | Level 7 (lessons 42 to 46: Big-O, searching/hashing/recursion, stacks and queues, CSV and data cleaning, sales analyzer project). Engine owner: README still lists Python as 35 lessons and 68 exercises; lazy-load courses before the bundle nears 4 MiB |
| 2026-11-16 | Claude, Python | **Level 7 part A written:** `py-bigo`, `py-search-hash`, `py-structures` (lessons 42 to 44, in `src/content/py/level7a.js`); 9 new exercises (`py41-` to `py43-`), solutions in `tests/solutions-py.mjs`. Python is now 44 lessons and 87 exercises. Big-O lessons count steps instead of timing, so outputs are identical on every phone. No engine files touched. Tests green: 10,390 checks, 0 failed; 175 lesson screens rendered | Lessons 45 and 46 (CSV and data cleaning, sales analyzer project) to finish Level 7 |
| 2026-11-15 | Claude, SQL | **SQL course complete.** Level 5 finished: `sql-cte-window`, `sql-triggers-upsert`, `sql-from-apps`, `sql-capstone` (lessons 30 to 33, in `src/content/sql/level5b.js`); 12 new exercises, each with a hidden test. All 33 lessons and 99 exercises are written; every exercise has a reference solution that passes and a starter that fails. **Engine files touched:** none in this step. Tests green: 10,062 checks, 0 failed (before merging with other tracks) | Review only: real-phone test of the SQLite worker, and the engine requests at the end of `docs/SQL-TRACK.md` (a Tables panel for the practice database, scrollable result tables) |
| 2026-11-15 | Claude, C++ | **First real-phone run of the C++ test: inconclusive.** Android 10 / Chrome 156 / 2 GB / 3g failed to download from unpkg ("Failed to fetch" on the first request), so the compiler never started. Fix: `scripts/fetch-cpp-compiler.mjs` (npm `postbuild`) now puts the compiler, **gzipped (27.1 MB)**, on the same website at `/cpp-test/compiler/`; the page prefers it, unpacks it in the browser, saves the 27 MB for offline, and has a connection check. **Shared files touched:** `package.json` (one `postbuild` script). Browser-tested in Chromium: site path GOOD on 3 runs incl. offline, failure path gives a clear diagnosis | Kyobe re-runs the test on the phone after the deploy is green (same address, private tab). Engine owner: the final app should serve the compiler from its own origin, gzipped, exactly like this |
| 2026-11-16 | Claude, Python | **Level 7 finished:** `py-csv`, `py-project-analyzer` (lessons 45 and 46, in `src/content/py/level7b.js`); 4 new exercises (`py44-`, `py45-`), solutions in `tests/solutions-py.mjs`. Python is now 46 lessons and 91 exercises. CSV is read from strings and line lists (no files needed). No engine files touched. Tests green: 10,487 checks, 0 failed; 177 lesson screens rendered | Level 8 (lessons 47 to 52: project structure, command-line apps, SQLite from Python, simulated APIs, logging, Duuka Manager project). Engine owner: README still lists Python as 35 lessons and 68 exercises |
| 2026-11-15 | Claude, Java | Feasibility note `docs/JAVA-TRACK.md` (runtime `@live-codes/java-wasm` 0.1.0: real `javac` + TeaVM in WebAssembly, about 4.4 MB gzipped; 22 behaviours proven, 13 gaps documented, 12 engine requests E1 to E12) and `tests/java-probe.mjs` (repeatable proof, not part of `npm test`). No engine files touched. `npm test` still green: 5,667 checks, 0 failed. Pushed to `track/java` | Engine owner: E1 to E10 (runtime, pack, main-class detection, build-once-run-many, `%n` fix, tests). Java account after that: Level 1 lessons (1 to 6) |
| 2026-11-15 | Claude, Java | **Java engine built, on branch `track/java`.** Real Java (OpenJDK `javac` + TeaVM in WebAssembly, `@live-codes/java-wasm` 0.1.0, pinned) runs in the app: Java tab in the playground, a Java download card in Settings (7.8 MB, cached for offline use like Python), editor mode, symbol bar, Java-aware errors in English and Kiswahili (`java-*` rules), a build cache so one program runs against many inputs in milliseconds, a 90 s build allowance then the normal 8 s run limit, runaway loops stopped and the engine restarted. Source preparation fixes `%n`, `10 / 0` and the main class name (`src/lib/javasource.js`). Exceptions are reported like real Java. Verified in headless Chromium 153: online, download from Settings, then **offline**. `npm test` green: 5,791 checks, 0 failed (+124 Java checks). Not verified: a real phone, Firefox, Safari | Java account: Level 1 lessons (1 to 6). Engine owner: review the shared-file changes listed in the Java row |
| 2026-11-15 | Claude, Java | **Java Level 1 done: lessons 1 to 6** (`j-what`, `j-first`, `j-variables`, `j-operators`, `j-input`, `j-decisions`; 19 exercises, 117 code runs on the real engine), registered as course `java-start` ("Java from Zero to Market-Ready"), running project the Village SACCO (deposit slip is step 1). Also: new `java-*` error rules (unclosed quotes, package does not exist), gap G14 recorded (`Math.round(-2.5)` is -3 here, -2 in real Java), and `ONLY_COURSE=<course id> node tests/run.mjs` runs one course's lessons and exercises quickly (works for every course). `npm test` green: 6,290 checks, 0 failed; 108 lesson screens render. Verified in headless Chromium: the course lists, a lesson example runs with its input, an exercise is graded against 3 tests and a wrong answer shows expected vs your output | Java account: Level 2 (lessons 7 to 15: loops, methods, recursion, arrays, strings, SACCO ledger project) |
| 2026-11-16 | Claude, Python | **Level 8 part A written:** `py-packages`, `py-cli`, `py-sqlite` (lessons 47 to 49, in `src/content/py/level8a.js`); 9 new exercises (`py46-` to `py48-`), solutions in `tests/solutions-py.mjs`. Python is now 49 lessons and 100 exercises. Findings recorded in `docs/PY-TRACK.md`: an uncaught `SystemExit` ends the Node test process (argparse exits that way), `sys.modules` keeps modules between runs, the editor program has no `__main__` of its own. No engine files touched. Tests green: 10,920 checks, 0 failed; 184 lesson screens rendered | Lessons 50 to 52 (simulated APIs and JSON, logging and debugging, Duuka Manager project) |
| 2026-11-16 | Claude, Python | **Level 8 finished:** `py-api`, `py-logging`, `py-project-duuka` (lessons 50 to 52, in `src/content/py/level8b.js`); 7 new exercises (`py49-` to `py51-`), solutions in `tests/solutions-py.mjs`. Python is now 52 lessons and 107 exercises. APIs are taught with a pretend server (no network in the browser) and say so plainly. Logging state leaks between runs, so examples reset it. No engine files touched. Tests green: 11,702 checks, 0 failed; 193 lesson screens rendered | Level 9 (lessons 53 to 57: concurrency basics, how a web backend thinks, packaging and shipping, where to go next, final capstone) |
| 2026-11-16 | Claude, Java | **Java lessons 7 to 10 written** (Level 2 part A): `j-loops`, `j-nested`, `j-methods`, `j-recursion`; 19 more exercises (38 in total), 190 code runs on the real engine. Running project: step 2 (totals per member) and step 3 (the receipt and the loan rule as methods). **Fixed in lessons 2 to 8:** the reorder prompts claimed some lines were already in place, but the app shuffles every line, so the wording now says to tap them in order. New helper `progM` (a program with extra static methods) in `src/content/java/shared.js`. Checked that every deliberate compile or runtime error in the lessons (25 of them) gets a specific plain-language card. **Pushed straight to `main`** (Steven's instruction): merged main three times, resolved conflicts in the shared files by keeping every language; `docs/TRACKS.md` log rows collide on every merge because everyone appends at the end | Java account: lessons 11 to 15 (arrays, array algorithms, 2D arrays, strings, SACCO ledger project) |
| 2026-11-16 | Claude, Java | **Java Level 2 finished: lessons 11 to 15** (`j-arrays`, `j-array-algos`, `j-2d`, `j-strings`, `j-ledger`); 24 more exercises (62 in total), 279 code runs on the real engine, 44 deliberate errors in the lessons each get a specific plain-language card. Lesson 15 is the Level 2 project: the Village SACCO ledger, a command-driven console program (JOIN, DEPOSIT, WITHDRAW, BALANCE, REPORT, QUIT) built from arrays, methods, strings and decisions; its four exercises each add a command to the same base program, which lives in `src/content/java/ledger-program.js` so the lesson, the starters and the reference solutions share it. Checked String and StringBuilder behaviour against known real-Java results first. Lesson 8 on, the lessons teach `Arrays` with an import | Java account: Level 3, lessons 16 to 27 (classes and objects, constructors, encapsulation, static, `toString`/`equals`/`hashCode`, inheritance, polymorphism, abstract classes, interfaces, nested classes, enums and records, then the SACCO rewritten with objects) |
