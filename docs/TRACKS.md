# SayMaCoder: how several Claude accounts build it together

Read this file first, every session. It exists because the project is built by more than one Claude
account, and **accounts share no memory**. Whatever is not written in this repository is forgotten.
Already once, one account wrote lessons that another account had finished the day before.

Last updated: 2026-11-14.

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

## The tracks

| Track | Course id | Language id | Files you own | Status | Owner |
|---|---|---|---|---|---|
| Web (HTML, CSS, JavaScript) | `web-start` | `web` | `src/content/web/`, `src/content/web-course.js`, `docs/WEB-TRACK.md` | Written: 36 lessons, 105 exercises. Later ideas in its roadmap. | (unassigned) |
| Python | `py-start` | `python` | `src/content/py/`, `src/content/python-course.js` | Written: 35 lessons (5 levels), 68 exercises. Depth beyond Level 5 not planned yet. | (unassigned) |
| C (module TTSD113) | `c-structured` | `c` | `src/content/c/`, `src/content/c-course.js`, `tests/solutions-c.mjs`, `docs/C-TRACK.md` | In progress, see `docs/C-TRACK.md` | C account |
| Java | not created | not created | would be `src/content/java/` | **Not started.** Needs a runtime first (see below). | (unassigned) |
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
