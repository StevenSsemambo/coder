# SayMaCoder

Learn to code on a phone, with no data and no subscription.

SayMaCoder is an offline-first Progressive Web App (PWA). After one download, students can read
lessons, write code, run it, get instant feedback and see their progress with **no internet**.

It is built by several Claude accounts, one track each. **Contributors: read `docs/TRACKS.md` first.**

## What works today

| Feature | Status |
|---|---|
| Touch-first code editor (CodeMirror 6) with a symbol bar | Working |
| Run **C** and **C++** (built in, about 400 KB, one interpreter), **SQL** (SQLite, built in), **Python** (separate 13 MB download) and **Java** (separate 7.8 MB download, real `javac`) | Working |
| Programs run in Web Workers with a time limit (infinite loops are stopped) | Working |
| Auto-grader with visible and hidden test cases | Working |
| Hint ladder (nudge, bigger hint, worked example) | Working |
| Error translator: plain English and Kiswahili (Luganda needs a native speaker) | Working |
| Progress, streaks and saved drafts (IndexedDB) | Working |
| Installs to the home screen and works with the network off | Working (tested) |
| **Web track** (HTML, CSS, JavaScript with a sandboxed live preview and auto-checker): 60 lessons, 201 exercises. Roadmap in `docs/WEB-TRACK.md` | Complete |
| **Python**: 57 lessons in 9 levels, 125 exercises. Roadmap in `docs/PY-TRACK.md` | Complete |
| **C**: 32 lessons, 98 exercises, from `printf` to pointers, bits, macros, algorithms, sorting and a stock-system capstone. Roadmap in `docs/C-TRACK.md` | Written |
| **C Part 2** (`c-advanced`, a full C engine): 14 lessons, 42 exercises: structs, `enum`, `union`, `malloc`/`free`/`realloc`, linked lists, text and binary files, and a stock-system capstone. Roadmap and limits in `docs/CX-TRACK.md` | Written |
| **C++**: 18 lessons, 54 exercises, from `cout` to pointers (Part A, what C++ shares with C plus streams). Strings, vectors, references, classes and templates (Part B) wait for a real C++ compiler. Roadmap in `docs/CPP-TRACK.md` | Part A written |
| **SQL** (SQLite): 33 lessons, 99 exercises, one shop database throughout. Roadmap in `docs/SQL-TRACK.md` | Complete |
| **Java** (real `javac`): 23 lessons, 94 exercises so far. Roadmap in `docs/JAVA-TRACK.md` | In progress |
| **PHP** (PHP 8.3 on WebAssembly): 33 lessons, 107 exercises. Roadmap in `docs/PHP-TRACK.md` | Complete |
| **Step-by-step lessons**: one idea per screen, a big Continue button, your place saved (the long page is one tap away) | Working |
| **Home screen** that starts with "Continue" (resume the lesson, the next exercise or the next lesson), your daily goal, streak and level | Working |
| **Kato**, the friendly guide robot, and a **game layer**: stars, XP, levels, 12 badges, a daily goal, a celebration with sound and vibration (switchable in Settings) | Working |
| **Show a solution** after the hints, so nobody is ever stuck | Working |
| **First-run welcome and a visual path per course**: "What do you want to build?", a recommended first lesson, a path with "you are here", a colour, emoji and tagline for every course | Working |
| **Offline check, download banner and install card**: Settings shows what is ready for offline use; a lesson that needs Python, PHP or Java offers the download on its first screen | Working |
| **Backup and restore** of progress as a file (it merges, so restoring never erases work already on the phone) | Working |
| Rich lessons: real-life stories, analogies, runnable examples, predict-the-output, fill-the-gaps, put-in-order, find-the-bug, mistake museum, recap cards | Working |

Not built yet: practise-your-mistakes review, the C memory visualizer, lecturer mode, certificates and a career path, phone-to-phone sharing, on-device AI tutor, and VB.NET (it needs a runtime first, see `docs/TRACKS.md`). The roadmap is in `docs/PRODUCT.md`.

## Run it

```bash
npm install
npm run build      # prepares the runtimes, then builds into dist/
npm run preview    # serves dist/ (use this, not `npm run dev`, to test offline behaviour)
npm test           # logic tests: every exercise is checked against a reference solution
```

Requires Node 18 or newer. The app uses a relative base path, so the contents of `dist/` can be
hosted anywhere: GitHub Pages, a school server, or copied to a phone.

## Publish it (GitHub Pages)

The workflow in `.github/workflows/deploy.yml` tests, builds and publishes the app on every push to `main`.

One-time setup, in the repository on github.com:

1. **Settings > Pages > Build and deployment > Source: GitHub Actions.**
2. Open the **Actions** tab, choose **Deploy to GitHub Pages**, press **Run workflow**.
3. When the run is green, open `https://<your-username>.github.io/<repository-name>/` on a phone.
   For this repository that is `https://stevenssemambo.github.io/coder/`.

On the phone: open the link in Chrome, then menu > **Install app** (or **Add to Home screen**).
Open **Settings** in the app and press **Download** for Python and for Java while on Wi-Fi. After that, turn on
airplane mode and check that lessons, C, Python and Java still run.

If the run fails at **Test**, a change broke an exercise; nothing is published until it is fixed.

## How it is built

```
src/lib/       grader, error translator, runners (Web Workers), storage, editor
src/content/   the courses (plain JavaScript data: lessons, exercises, tests, hints)
src/ui/        screens and components (no framework, to stay small on low-end phones)
public/workers py, C/C++ and SQL workers (Python is a module worker, the others classic)
public/pack-sw.js   serves the downloaded Python and Java files when offline
scripts/prepare-runtimes.mjs   copies Pyodide and the Java runtime, bundles and patches the C interpreter
tests/         logic tests, render tests and reference solutions (one file per course)
docs/          TRACKS.md (how the accounts work together) and one roadmap per track
```

### Writing lessons

Lessons are plain JavaScript data. The block types (story, analogy, try, predict, fill, reorder, bug,
quiz, recap, mistakes, project) are documented at the top of `src/content/blocks.js`. `npm test` runs
**every** example, answer, fix and project step on the real runtime, so a lesson cannot teach
something that does not work. It also checks that puzzles have exactly one right answer and that a
lesson opens with a story and ends with a recap.

### Runtimes

* **Python** is [Pyodide](https://pyodide.org) (Python compiled to WebAssembly). It needs a *module*
  worker, so it works on Chrome 80+, Safari 15+ and Firefox 114+.
* **Java** is the real OpenJDK `javac` plus [TeaVM](https://teavm.org), both compiled to WebAssembly (package
  `@live-codes/java-wasm`). It builds the program in the browser, then runs it in a Web Worker. Details, limits and
  the lesson rules are in `docs/JAVA-TRACK.md`.
* **C and C++** run on [JSCPP](https://github.com/felixhao28/JSCPP), a C/C++ teaching-subset
  interpreter written in JavaScript. It is **not a real compiler**: it covers what a first module
  needs (variables, `printf`/`scanf`, `if`, loops, functions, arrays, strings, basic pointers) but not
  everything in the standard. Structs, `malloc` and files do not run there (they run in the C Part 2 course, below); neither does most of C++ beyond the basics.
  `scripts/prepare-runtimes.mjs` applies a set of exact-match patches so it behaves like real C
  (static locals, partial array initialisers, `strcmp`, assignable `scanf`/`gets`/`strcpy` targets,
  pointer comparison and arithmetic, and more); each patch must match exactly once, so the build stops
  with an error if the library changes. `src/lib/csource.js` preprocesses source for the quirks
  that are easier to fix there (`main(void)`, spaces inside string literals). Known gaps are listed
  in `docs/C-TRACK.md`; `tests/run.mjs` has an engine check for every patch.
* **C Part 2** (`c-advanced`) runs on [picoc](https://github.com/jpoirier/picoc) compiled to WebAssembly (about 560 KB, offline): structs, `enum`, `union`, `malloc`/`free`, `FILE` input and output. Source, patches and build script are in `tools/picoc-wasm/`; the tiny WASI layer (an in-memory file system, so a file lives for one run) is `public/workers/cxcore.js`, shared by the worker and the tests.
* **SQL** is [sql.js](https://github.com/sql-js/sql.js) (SQLite compiled to WebAssembly), vendored in
  `public/vendor/sqljs`, so it works offline from the first visit.

### Offline design

* The app shell, the C interpreter and the workers are precached on the first visit (about 1 MB).
* Python and Java are downloaded on purpose from **Settings** into the browser's Cache Storage and served by
  `public/pack-sw.js`. The listener is registered synchronously inside the service worker, because
  the browser may restart an idle service worker to answer a single request.
* If a pack file is ever missing, the service worker reports it to the page
  (`window.__packLog` and the browser console).

## Content and licences

All lessons and exercises are original. Do not copy proprietary course material into the packs.
Third-party runtimes keep their own licences (Pyodide: MPL-2.0, JSCPP: MIT, CodeMirror: MIT, Java runtime: Apache-2.0 with OpenJDK `javac` under GPLv2 with the Classpath Exception, notices in `public/java/THIRD-PARTY-NOTICES.md`).
The C course is a general beginner-to-advanced course, not written from any one syllabus. Compare it
with your module outline before using it for assessed work.

## Known limits

* Tested in desktop Chromium emulating a 390 px phone, including with the server stopped. **Not yet
  tested on real low-end Android phones.** That is the next priority.
* Luganda error explanations are empty on purpose and fall back to English.
* The C interpreter is slower than a real compiler, rejects some valid C and accepts some invalid C
  (for example, functions can see their caller's variables). The differences are listed in `docs/C-TRACK.md`.
* Safari on iOS may remove stored downloads after a period of non-use. Use "Protect my downloads"
  in Settings and install the app to the home screen.
