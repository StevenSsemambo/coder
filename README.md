# SayMaCoder

Learn to code on a phone, with no data and no subscription.

SayMaCoder is an offline-first Progressive Web App (PWA). After one download, students can read
lessons, write code, run it, get instant feedback and see their progress with **no internet**.

This is the **Phase 0 prototype** described in the project document.

## What works today

| Feature | Status |
|---|---|
| Touch-first code editor (CodeMirror 6) with a symbol bar | Working |
| Run **C** (built in, about 400 KB) and **Python** (separate 13 MB download) | Working |
| Programs run in Web Workers with a time limit (infinite loops are stopped) | Working |
| Auto-grader with visible and hidden test cases | Working |
| Hint ladder (nudge, bigger hint, worked example) | Working |
| Error translator: plain English and Kiswahili (Luganda needs a native speaker) | Working |
| Progress, streaks and saved drafts (IndexedDB) | Working |
| Installs to the home screen and works with the network off | Working (tested) |
| Courses: C (4 lessons, 12 exercises) and Python (2 lessons, 6 exercises) | Draft content |

Not built yet: C memory visualizer, lecturer mode, certificates, phone-to-phone sharing,
on-device AI tutor, Java and VB.NET. See the roadmap in the project document.

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
Open **Settings** in the app and press **Download** for Python while on Wi-Fi. After that, turn on
airplane mode and check that lessons, C and Python still run.

If the run fails at **Test**, a change broke an exercise; nothing is published until it is fixed.

## How it is built

```
src/lib/       grader, error translator, runners (Web Workers), storage, editor
src/content/   the courses (plain JavaScript data: lessons, exercises, tests, hints)
src/ui/        screens and components (no framework, to stay small on low-end phones)
public/workers py.worker.js (module worker) and c.worker.js (classic worker)
public/pack-sw.js   serves the downloaded Python files when offline
scripts/prepare-runtimes.mjs   copies Pyodide, bundles and patches the C interpreter
tests/         logic tests and reference solutions
```

### Runtimes

* **Python** is [Pyodide](https://pyodide.org) (Python compiled to WebAssembly). It needs a *module*
  worker, so it works on Chrome 80+, Safari 15+ and Firefox 114+.
* **C** is [JSCPP](https://github.com/felixhao28/JSCPP), a C/C++ teaching-subset interpreter written
  in JavaScript. It is **not a real compiler**: it covers what a first module needs (variables,
  `printf`/`scanf`, `if`, loops, functions, arrays, pointers) but not everything in the C standard.
  `scripts/prepare-runtimes.mjs` applies three small fixes so it behaves like real C; the build
  stops with an error if the library changes and a fix no longer applies:
  `puts()` adds its newline, `scanf("%c")` stores the character, and `scanf(" %c")` skips whitespace.
  `src/lib/csource.js` works around two more quirks (`main(void)`, and spaces after commas inside
  strings in function calls).

### Offline design

* The app shell, the C interpreter and the workers are precached on the first visit (about 1 MB).
* Python is downloaded on purpose from **Settings** into the browser's Cache Storage and served by
  `public/pack-sw.js`. The listener is registered synchronously inside the service worker, because
  the browser may restart an idle service worker to answer a single request.
* If a pack file is ever missing, the service worker reports it to the page
  (`window.__packLog` and the browser console).

## Content and licences

All lessons and exercises are original. Do not copy proprietary course material into the packs.
Third-party runtimes keep their own licences (Pyodide: MPL-2.0, JSCPP: MIT, CodeMirror: MIT).
The C course is a **draft**: map its topics to the official module outline before using it for
assessed work.

## Known limits

* Tested in desktop Chromium emulating a 390 px phone, including with the server stopped. **Not yet
  tested on real low-end Android phones.** That is the next priority.
* Luganda error explanations are empty on purpose and fall back to English.
* The C interpreter is slower than a real compiler and rejects some valid C.
* Safari on iOS may remove stored downloads after a period of non-use. Use "Protect my downloads"
  in Settings and install the app to the home screen.
