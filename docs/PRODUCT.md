# SayMaCoder product guide (owner: UI/UX and product)

**Read this before you write or change a lesson.** `docs/TRACKS.md` says who builds what. This file says what we are
building it FOR, how a lesson becomes a screen on a phone, and how to write lessons that fit. The UI/UX and product owner
(a Claude account, "the product owner" below) decides what the app looks like and how it behaves. Track accounts decide what
it teaches.

## 1. The promise

> The best offline app for learning to program: so easy and so much fun that a person who was afraid of code
> keeps coming back, and in the end becomes a complete software developer.

Everything we build must serve one of these three things: **easy** (a frightened beginner can do the next step),
**fun** (it feels like a game, not an exam) and **offline** (it works with no internet, on a cheap phone).

Who we serve: a 16 to 30 year old in Uganda or East Africa, on a low-end Android phone, with little or no data, who thinks
programming is "for clever people", and who reads English, often as a second language, so the app uses short, simple English. Often alone, with no teacher.

## 2. Design principles (the product owner decides disputes with these)

1. **Do something in the first minute.** The first screen after opening is the next thing to do, never a menu.
2. **Small steps.** One idea per screen. A learner should never face a wall of text.
3. **No dead ends.** Every exercise has a way forward: hints, then a solution. Nobody is stuck with no teacher.
4. **Celebrate effort, never shame mistakes.** Wrong answers are normal and are explained kindly.
5. **Errors are friends.** Every error message is explained in plain words (the Kiswahili explanations that already exist stay as they are).
6. **Offline always.** Nothing may need the internet after the first visit. No spinners that wait for a server.
7. **Cheap phones first.** Small downloads, quick screens, 48px tap targets, works in sunlight and in the dark.
8. **Honest rewards.** Rewards are for learning and effort, never for speed or for beating other people.
9. **African first.** Our examples, our names, our money, our languages.
10. **Reach the goal.** Courses connect into a path to "complete software developer", not a pile of languages.

## 3. The game layer (built in `src/lib/game.js`, all rules in one place)

| Thing | Rule |
|---|---|
| Stars | Per exercise, on the FIRST pass: no hints 3 stars, one hint 2 stars, two or more hints (or after looking at the solution) 1 star. |
| XP | First pass of an exercise: 10 XP, 15 with 2 stars, 20 with 3 stars. First time a lesson is finished: 20 XP. Repeats earn nothing (free practice). |
| Levels | Level n needs 25 x (n-1)^2 XP: 25, 100, 225, 400, 625... Titles: Curious Beginner, Code Explorer, Bug Hunter, Builder, Problem Solver, Debugger, Architect, Engineer, Master Builder, Legend. |
| Badges | 12 today (first program, ten, fifty, hundred, first lesson, ten lessons, on your own, streaks of 3, 7 and 30 days, polyglot, level 5). Earned once. |
| Streak | Consecutive days with at least one graded attempt. It survives until the end of tomorrow. |
| Daily goal | Finish 1, 2 or 3 things a day (an exercise passed or a lesson finished). The learner chooses. |

Everything is **derived from data the app already keeps**, so a learner's past work counts at once and no course needs any
change. Lesson authors do not award anything by hand. New rewards are proposed to the product owner, who adds them in
`game.js` (with tests).

## 4. How a lesson becomes screens (so you can write for it)

The app shows a lesson in **step mode** (the default) or as one **full page**. In step mode `src/ui/steps.js` groups your
blocks automatically, with no change to your files:

- Every interactive block (`try`, `predict`, `fill`, `reorder`, `bug`, `quiz`, `project`, `web`, `see`) is **its own step**.
- Consecutive reading blocks (`story`, `p`, `h`, `analogy`, `tip`, `list`, `code`) are packed into **one screen of at most about
  700 characters**. A heading always starts a new screen. `mistakes` and `recap` are their own screens.
- A question step unlocks "Continue" when answered correctly, or after two wrong tries (so nobody is stuck).
- Finishing the last step completes the lesson (20 XP, once) and shows a celebration.

So: **short blocks make good screens.** A 300-word `p` becomes a wall of text; three 60-word blocks become three easy screens.

## 5. How to write lessons that fit the app (the checklist)

Run `npm run ux-audit -- --course=<your-course-id>` before you push. It never fails your build; it tells you which lessons
are too long or too heavy. `--ideal` shows the stricter targets. **New lessons should have no flags under `--ideal`.**

1. **Open with a story** (one short paragraph, at most 90 words) from real Ugandan life. **End with a recap** and a one-line `memory`.
2. **At most 24 blocks and 30 minutes per lesson.** More to teach? Make two lessons ("Part 1", "Part 2").
3. **Never more than about 900 characters (4 blocks) of reading in a row.** Put something to DO (`try`, `predict`, `fill`, `quiz`) between.
   Static `code` examples count as reading: make the next block a `try` that runs a variation.
4. **Short sentences.** Average under 20 words. Second person ("you"). No jargon before a one-line analogy.
5. **One idea per block.** If a block needs "also" or "another thing", split it.
6. **Exercises:** the prompt in at most 3 sentences (about 450 characters) and it names every output heading; exactly 3 hints, each short;
   at least one hidden test; the starter must fail. (The tests already enforce most of this.)
7. **Write the right answer FIRST** in every options list (`answer: 0`). The app shuffles the options when it shows them.
8. **Never** write options that refer to each other ("all of the above", "the first option").
9. **Summary** (the line under the lesson title) at most 120 characters: it is the lesson's subtitle on the path.

### Optional metadata the app will use (all optional; the app has defaults)

Add these to your course and lesson objects when you like. Nothing breaks if they are missing.

| Field | Where | Meaning |
|---|---|---|
| `emoji` | course, lesson | One emoji. Shown on the course card and the lesson path. Default: derived from the language. |
| `color` | course | A hex colour such as `'#0b6b4f'`, used for the course's identity. Default: chosen by language. |
| `tagline` | course | At most 60 characters: what you can DO after this course ("Build your own websites"). |
| `level` | course | `'beginner'`, `'intermediate'` or `'advanced'`. Decides where the course is recommended. |
| `needs` | course | Array of course ids worth finishing first (for example SQL after Python). |
| `next` | course | The course id to recommend after this one. |
| `goal` | lesson | "After this lesson you can ..." at most 80 characters. Shown at the top of the lesson. |

## 6. Who owns what

**The product owner owns the app shell:** `src/ui/**` (screens, components, steps, celebration), `src/styles.css`, `src/main.js`,
`src/state.js`, `src/lib/storage.js`, `src/lib/game.js`, `index.html`, `public/` icons, the PWA settings in `vite.config.js`,
`README.md`, this file and `tools/ux-audit.mjs`.

**Track accounts own** their content (`src/content/<track>/`), their reference solutions (`tests/solutions-<track>.mjs`), their
language runner and workers (`src/lib/runners.js` entry, `public/workers/<lang>.worker.js`), their error rules in
`src/lib/errors.js`, and any UI file named for ONE language (for example the web workspace files). **The product owner does not
edit those.** Track accounts do not edit the app shell.

**Compatibility promise.** Every UI change must work with every lesson exactly as written today. No account is ever asked to
change a lesson because the UI changed. New content fields are optional. If a block type must change, the product owner adds
the new behaviour next to the old one and announces it in the handoff log.

**Asking for a UI change.** Add a row to "UI requests" in `docs/TRACKS.md` (what you need, which lesson shows it, a
screenshot description). The product owner answers in the same row. Do not edit the UI yourself, even for a one-line fix.

## 7. Roadmap

| Phase | What | Status |
|---|---|---|
| 1. Feel like a game (**Release 1, built 2026-11-21**) | Step-by-step lessons with a Continue button (the long page is still at `#/page/...`), a home screen that starts with "Continue", Kato the guide, stars, XP, levels, 12 badges, the daily goal, a celebration with sound and vibration (both can be switched off in Settings), "Show a solution", and lesson-finished tracking | **Done**. Needs real-phone testing |
| 2. Feel easy (**Release 2, built 2026-11-21**) | First-run welcome ("What do you want to build?" then a first lesson), a visual path per course ("you are here", nothing locked), a face for every course (emoji, colour, tagline), an "offline check" in Settings, a one-tap download banner when a lesson needs Python, PHP or Java, an install card, progress backup and restore (a file that merges, never overwrites) | **Done**. Needs real-phone testing |
| 3. Trust and reach | Practise-your-mistakes review, more badges, polish for small phones and screen readers | Planned |
| 4. The long game | Career path across courses, certificates, lecturer mode, memory visualizer, on-device tutor | Planned |

## 8. What we cannot measure, and what we do instead

The app is offline and private: there is no analytics. We cannot see where learners quit. So: real-phone testing by people
(see "Open items" in `docs/TRACKS.md`), conservative changes, and tests that protect behaviour (`tests/render.mjs` clicks through every
choice block of every course). When in doubt, choose the simpler, calmer, faster option.

## 9. Decisions of the project owner

* **The app interface is English only** (2026-11-21). No Kiswahili or Luganda interface is planned. The Kiswahili *error explanations* that already exist in `src/lib/errors.js` stay as they are.
* **The guide is Kato**, a small friendly robot drawn in code (`src/ui/mascot.js`): no image files, follows light and dark mode. Kato appears on the home screen, in lessons (a greeting, a cheer for right answers, a gentle word for wrong ones), in celebrations and on the progress screen.
* The name stays **SayMaCoder**.

## 10. What Release 1 added (for track accounts)

* A lesson now opens in **step mode**. `src/ui/steps.js` splits your blocks automatically; nothing in your lesson files changed. Question blocks (`predict`, `fill`, `reorder`, `bug`, `quiz`, `see`) unlock "Continue" when answered, or after **two wrong tries**, when the right answer is shown. Short blocks make good screens (see section 4).
* **Show a solution** appears on an exercise after all the hints, or after three checks that did not pass. It reads the reference solution from `tests/solutions.mjs` (export `solutions`), loaded only when asked. **Keep that export in place.** An exercise with no stored solution shows a kind "no solution" card with a Skip button. (Web exercises have their own screen and show the goal page instead.)
* Rewards are worked out by `src/lib/game.js` and shown by `src/ui/rewards.js` whenever `recordAttempt` (in `storage.js`) records a graded attempt, so every language, including Web, gets them with no extra code.

## 11. What Release 2 added (for track accounts)

* **Every course now has a face**, kept in the app shell (`src/ui/course-meta.js`): emoji, colour and a tagline of at most 60 characters. **Set `emoji`, `color` or `tagline` on your course object and yours wins.** New courses get a language default until then. The tests check that every course has a tagline of 1 to 60 characters.
* **The course page is a path.** Lessons are grouped by their `level` text (so keep writing `level: 'Level 3: Functions'`). The first lesson that is not finished shows "You are here". Nothing is locked.
* **A lesson that needs Python, PHP or Java** shows a download banner on its first screen if that runtime is not on the phone yet. This reads `PACKS` in `src/lib/packs.js` (the Java account owns that file: please keep the export).
* **Backup and restore** (`src/lib/backup.js`) saves progress, attempts, days, game, last lesson, drafts and the learner profile as one JSON file. Restoring **merges** and never removes work already on the phone. If you add a new key to storage that must survive a phone change, add it to `KEYS` in that file.
* **Welcome**: a brand-new learner is sent to `#/welcome` once. Settings has "Choose my starting course again".
