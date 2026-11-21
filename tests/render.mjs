// Renders every lesson of every course in a fake browser (jsdom) and fails if any block throws.
// This catches "click the lesson and nothing happens" bugs that the content tests cannot see.
import { createServer } from 'vite';
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!doctype html><html><body><div id="app"></div></body></html>', { url: 'https://example.test/', pretendToBeVisual: true });
const w = dom.window;
for (const k of ['window', 'document', 'navigator', 'HTMLElement', 'Node', 'Element', 'MutationObserver', 'getComputedStyle', 'requestAnimationFrame', 'cancelAnimationFrame', 'DOMParser', 'Range', 'Selection', 'Event', 'KeyboardEvent', 'MouseEvent', 'CustomEvent', 'FocusEvent', 'InputEvent', 'DocumentFragment', 'Text', 'Window', 'HTMLInputElement', 'HTMLTextAreaElement', 'HTMLIFrameElement', 'HTMLButtonElement', 'NodeFilter', 'ResizeObserver', 'IntersectionObserver', 'location', 'localStorage', 'File', 'Blob']) {
  if (w[k] !== undefined) Object.defineProperty(globalThis, k, { value: w[k], configurable: true, writable: true });
}
globalThis.window = w;
// Editors measure themselves on animation frames; there is no screen here, so skip that.
w.requestAnimationFrame = () => 0;
w.cancelAnimationFrame = () => {};
globalThis.requestAnimationFrame = w.requestAnimationFrame;
globalThis.cancelAnimationFrame = w.cancelAnimationFrame;
w.ResizeObserver = w.ResizeObserver || class { observe() {} disconnect() {} unobserve() {} };
globalThis.ResizeObserver = w.ResizeObserver;
globalThis.Worker = class { postMessage() {} terminate() {} addEventListener() {} };
globalThis.URL.createObjectURL = () => 'blob:test';
globalThis.URL.revokeObjectURL = () => {};
w.matchMedia = w.matchMedia || (() => ({ matches: false, addEventListener() {}, removeEventListener() {} }));
w.scrollTo = () => {};
if (!w.Range.prototype.getClientRects) { w.Range.prototype.getClientRects = () => []; w.Range.prototype.getBoundingClientRect = () => ({ top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0 }); }

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });
let ok = 0;
const failures = [];
let clickTested = 0; // choice blocks that were really clicked through (shown shuffled, must still check the right answer)
try {
  const { allCourses: courses } = await server.ssrLoadModule('/src/content/index.js');
  const { renderBlock } = await server.ssrLoadModule('/src/ui/lesson-blocks.js');
  const { lessonView } = await server.ssrLoadModule('/src/ui/views/lesson.js');
  const { outputView, testResultsView } = await server.ssrLoadModule('/src/ui/components.js');
  const sqlOut = outputView({ stdout: 'a | b\n--+--\n1 | 2\n', stderr: '', ms: 1 }, 'sql');
  const pyOut = outputView({ stdout: 'hi\n', stderr: '', ms: 1 }, 'python');
  if (!sqlOut.classList.contains('lang-sql')) failures.push('SQL run output is missing the lang-sql class');
  if (pyOut.classList.contains('lang-sql')) failures.push('lang-sql must be only for SQL (other languages keep wrapping)');
  const sqlTests = testResultsView({ passed: false, passedCount: 0, total: 1, cases: [{ name: 't', passed: false, expected: 'a', actual: 'b' }] }, 'sql');
  if (!sqlTests.classList.contains('lang-sql')) failures.push('SQL test results are missing the lang-sql class');
  for (const course of courses) {
    for (const lesson of course.lessons) {
      const where = `${course.id} / ${lesson.id}`;
      try {
        const view = lessonView(course.id, lesson.id);
        if (!view.node || view.node.textContent.length < 50) throw new Error('lesson view is empty');
        ok += 1;
      } catch (e) {
        failures.push(`${where}: ${e.stack?.split('\n').slice(0, 3).join(' | ') || e}`);
      }
      const ctx = { cleanups: [] };
      lesson.blocks.forEach((block, index) => {
        try {
          const node = renderBlock(block, { language: course.language, index, ctx });
          if (course.language === 'sql' && node && node.classList && !node.classList.contains('lang-sql')) failures.push(`${where} block ${index + 1} (${block.t}): SQL block is missing the lang-sql class (its result tables would wrap on a phone)`);
          const at = `${where} block ${index + 1} (${block.t})`;
          const sameSet = (a, b) => JSON.stringify([...a].sort()) === JSON.stringify([...b].sort());
          if (['quiz', 'predict', 'bug', 'see'].includes(block.t) && block.options && new Set(block.options).size === block.options.length) {
            // the options are shown shuffled: every option must still be there exactly once...
            const shown = [...node.querySelectorAll('button.choice')].map((b) => b.textContent);
            if (!sameSet(shown, block.options)) failures.push(`${at}: the options shown are not the options written`);
            // ...and the button showing the right answer must still be the right one, wherever it is shown
            if (block.t !== 'see') {
              const right = [...node.querySelectorAll('button.choice')].find((b) => b.textContent === block.options[block.answer]);
              right.click();
              if (!right.classList.contains('ok') || !node.querySelector('.feedback-ok')) failures.push(`${at}: the right answer was not accepted after shuffling`);
              const again = renderBlock(block, { language: course.language, index, ctx });
              const wrong = [...again.querySelectorAll('button.choice')].find((b) => b.textContent !== block.options[block.answer]);
              wrong.click();
              if (!wrong.classList.contains('wrong') || again.querySelector('.feedback-ok')) failures.push(`${at}: a wrong answer was accepted after shuffling`);
              clickTested += 1;
            }
          }
          if (block.t === 'fill') {
            const selects = [...node.querySelectorAll('select.gap')];
            block.blanks.forEach((bl, i) => { if (!selects[i] || !sameSet([...selects[i].options].map((o) => o.value).filter(Boolean), bl.options)) failures.push(`${at}: the gap ${i + 1} options shown are not the options written`); });
          }
        } catch (e) {
          failures.push(`${where} block ${index + 1} (${block.t}): ${e.message}`);
        }
      });
    }
  }

  // ---- Release 1: step-by-step lessons, the journey rules, solutions, and the home, progress and settings screens
  const { buildSteps, MAX_READING_CHARS, readingSize } = await server.ssrLoadModule('/src/ui/steps.js');
  const { stepLessonView } = await server.ssrLoadModule('/src/ui/views/steps-lesson.js');
  const journey = await server.ssrLoadModule('/src/lib/journey.js');
  const { getSolution } = await server.ssrLoadModule('/src/lib/solutions.js');
  const { learnView, courseView } = await server.ssrLoadModule('/src/ui/views/learn.js');
  const { progressView } = await server.ssrLoadModule('/src/ui/views/progress.js');
  const { settingsView } = await server.ssrLoadModule('/src/ui/views/settings.js');
  const { kato, MOODS } = await server.ssrLoadModule('/src/ui/mascot.js');
  const { showCelebration, closeCelebration } = await server.ssrLoadModule('/src/ui/celebrate.js');
  const { getGame } = await server.ssrLoadModule('/src/lib/game.js');
  const { state } = await server.ssrLoadModule('/src/state.js');

  // 1) The steps cover every block exactly once, in order, and every step is a sensible size.
  let stepsChecked = 0;
  let stepsTotal = 0;
  for (const course of courses) {
    for (const lesson of course.lessons) {
      const where = `${course.id} / ${lesson.id}`;
      const steps = buildSteps(lesson);
      const order = steps.flatMap((s) => s.blocks.map((b) => b.index));
      if (JSON.stringify(order) !== JSON.stringify(lesson.blocks.map((_, i) => i))) failures.push(`${where}: the steps do not hold every block exactly once, in order`);
      if (steps.at(-1).kind !== 'practice') failures.push(`${where}: the last step must be the practice step`);
      for (const st of steps) {
        if (st.kind === 'read' && st.blocks.length > 1 && st.blocks.reduce((n, b) => n + readingSize(b.block), 0) > MAX_READING_CHARS) failures.push(`${where}: a reading step holds more than ${MAX_READING_CHARS} characters`);
        if (st.kind === 'do' && st.blocks.length !== 1) failures.push(`${where}: an interactive step must hold exactly one block`);
      }
      stepsChecked += 1;
      stepsTotal += steps.length;
    }
  }

  // 2) Walk a lesson the way a learner does: answer or give up on every question, press Continue to the end.
  const solveStep = (body, block) => {
    if (['predict', 'bug', 'quiz', 'see'].includes(block.t)) {
      const wrong = [...body.querySelectorAll('button.choice')].filter((b) => b.textContent !== block.options[block.answer]);
      wrong[0].click();
      wrong[1] ? wrong[1].click() : [...body.querySelectorAll('button.choice')].find((b) => b.textContent === block.options[block.answer]).click();
    } else if (block.t === 'fill') {
      const check = [...body.querySelectorAll('button')].find((b) => b.textContent === 'Check');
      body.querySelectorAll('select.gap').forEach((sel, i) => {
        const bad = [...sel.options].find((o) => o.value && o.value !== block.blanks[i].answer);
        sel.value = (bad || sel.options[1]).value;
      });
      check.click();
      check.click();
    } else if (block.t === 'reorder') {
      const lines = block.lines;
      const place = () => { for (let i = lines.length - 1; i >= 0; i -= 1) { const btn = [...body.querySelectorAll('.order-pool .order-line')].find((b) => b.textContent === (lines[i] || ' ')); btn?.click(); } };
      const check = [...body.querySelectorAll('button')].find((b) => b.textContent === 'Check');
      place();
      check.click();
      [...body.querySelectorAll('button')].find((b) => b.textContent === 'Start again').click();
      place();
      check.click();
    }
  };
  let walked = 0;
  const walkSample = courses.flatMap((c) => c.lessons.filter((_, i) => i % 3 === 0).map((l) => [c, l]));
  for (const [course, lesson] of walkSample) {
    const where = `${course.id} / ${lesson.id}`;
    try {
      document.body.className = '';
      const view = await stepLessonView(course.id, lesson.id);
      const steps = buildSteps(lesson);
      const body = view.node.querySelector('.step-body');
      for (let i = 0; i < steps.length - 1; i += 1) {
        const st = steps[i];
        let next = view.node.querySelector('.step-next button');
        if (!next) throw new Error(`step ${i + 1} has no Continue button`);
        if (st.kind === 'do' && next.disabled) {
          solveStep(body, st.blocks[0].block);
          next = view.node.querySelector('.step-next button');
          if (next.disabled) throw new Error(`step ${i + 1} (${st.blocks[0].block.t}) stayed locked after two wrong tries: the learner would be stuck`);
        }
        next.click();
      }
      if (!view.node.querySelector('.practice-step')) throw new Error('did not reach the practice step');
      if (!view.node.querySelector('.step-next a')) throw new Error('the practice step has no way forward');
      view.cleanup();
      walked += 1;
    } catch (e) {
      failures.push(`${where}: step walk failed: ${e.message}`);
    }
  }
  await new Promise((r) => setTimeout(r, 50));
  const gameAfter = await getGame();
  if (Object.keys(gameAfter.lessons).length < walked * 0.9) failures.push(`finishing a lesson's steps was not recorded (${Object.keys(gameAfter.lessons).length} of ${walked})`);
  if (!document.querySelector('.celebrate')) failures.push('no celebration appeared when a lesson was finished');
  closeCelebration();
  if (document.querySelector('.celebrate')) failures.push('the celebration did not close');

  // 3) "What next?" rules
  const J = (name, got, want) => { if (JSON.stringify(got) !== JSON.stringify(want)) failures.push(`journey: ${name}: got ${JSON.stringify(got)}, wanted ${JSON.stringify(want)}`); };
  const fake = [
    { id: 'py-start', lessons: [{ id: 'a', exercises: [{ id: 'a1' }, { id: 'a2' }] }, { id: 'b', exercises: [{ id: 'b1' }] }] },
    { id: 'c-structured', lessons: [{ id: 'x', exercises: [{ id: 'x1' }] }] },
  ];
  J('a new learner starts with the recommended course', journey.nextUp({ courses: fake }), { type: 'start', courseId: 'py-start', lessonId: 'a' });
  J('a half-read lesson is resumed at its step', journey.nextUp({ courses: fake, last: { courseId: 'py-start', lessonId: 'a' }, resume: { 'py-start/a': 4 } }), { type: 'resume', courseId: 'py-start', lessonId: 'a', step: 4 });
  J('a read lesson with exercises left points at the exercise', journey.nextUp({ courses: fake, last: { courseId: 'py-start', lessonId: 'a' }, game: { lessons: { 'py-start/a': 1 } }, progress: { a1: { passed: true } } }), { type: 'exercise', courseId: 'py-start', lessonId: 'a', exerciseId: 'a2' });
  J('a finished lesson points at the next lesson', journey.nextUp({ courses: fake, last: { courseId: 'py-start', lessonId: 'a' }, game: { lessons: { 'py-start/a': 1 } }, progress: { a1: { passed: true }, a2: { passed: true } } }), { type: 'lesson', courseId: 'py-start', lessonId: 'b' });
  J('older progress with no "last" record still finds the place', journey.nextUp({ courses: fake, progress: { a1: { passed: true, lastAt: 5 }, a2: { passed: true, lastAt: 9 } } }), { type: 'lesson', courseId: 'py-start', lessonId: 'b' });
  J('a finished course moves on to the next course', journey.nextUp({ courses: fake, last: { courseId: 'py-start', lessonId: 'b' }, progress: { a1: { passed: true }, a2: { passed: true }, b1: { passed: true } }, game: { lessons: { 'py-start/a': 1, 'py-start/b': 1 } } }), { type: 'lesson', courseId: 'c-structured', lessonId: 'x' });
  J('everything finished says done', journey.nextUp({ courses: fake, last: { courseId: 'c-structured', lessonId: 'x' }, progress: { a1: { passed: true }, a2: { passed: true }, b1: { passed: true }, x1: { passed: true } }, game: { lessons: { 'py-start/a': 1, 'py-start/b': 1, 'c-structured/x': 1 } } }), { type: 'done' });
  if (!courses.some((c) => c.id === journey.START_HERE)) failures.push(`START_HERE (${journey.START_HERE}) is not a course in the app`);

  // 4) Show a solution: every exercise that has a stored solution gets it back
  let withSolution = 0;
  let without = [];
  for (const course of courses) for (const lesson of course.lessons) for (const e of lesson.exercises) {
    const sol = await getSolution({ ...e, language: course.language });
    if (sol) withSolution += 1; else without.push(`${course.id}/${e.id}`);
  }
  const allExercises = withSolution + without.length;
  console.log(`  ${withSolution} of ${allExercises} exercises can show a solution (${without.length} cannot: they get a kind "no solution" card)`);
  if (withSolution < allExercises * 0.7) failures.push(`only ${withSolution} of ${allExercises} exercises can show a solution: the solution chunk did not load`);

  // 5) Screens that every learner sees
  state.progress = {};
  for (const [name, make] of [['home', () => learnView()], ['progress', () => progressView()], ['settings', () => settingsView()], ['course', () => courseView(courses[0].id)]]) {
    try {
      const v = await make();
      if (!v.node || v.node.textContent.length < 40) failures.push(`${name} screen is empty`);
      if (name === 'home' && !v.node.querySelector('.continue')) failures.push('the home screen has no Continue card');
      if (name === 'home' && !v.node.querySelector('.kato')) failures.push('the home screen has no Kato');
    } catch (e) {
      failures.push(`${name} screen failed: ${e.message}`);
    }
  }
  for (const mood of MOODS) { const k = kato(mood, 40); if (!k.querySelector('circle, path')) failures.push(`Kato (${mood}) did not draw`); }
  showCelebration({ title: 'Test', stars: 3, xpGained: 20, levelUp: { level: 2, title: 'Code Explorer' }, badges: [{ icon: '🌱', title: 'First program', desc: 'x' }], daily: { done: 1, goal: 1, reached: true }, primary: { label: 'Next', href: '#/learn' } });
  if (!document.querySelector('.celebrate .star.on') || !document.querySelector('.celebrate .badge-new') || !document.querySelector('.celebrate .levelup')) failures.push('the celebration is missing its stars, level-up or badge');
  closeCelebration();

  // ---- Release 2: course identity, welcome, path, backup, offline, install
  const meta = await server.ssrLoadModule('/src/ui/course-meta.js');
  const { welcomeView } = await server.ssrLoadModule('/src/ui/views/welcome.js');
  const backup = await server.ssrLoadModule('/src/lib/backup.js');
  const offline = await server.ssrLoadModule('/src/lib/offline.js');
  const install = await server.ssrLoadModule('/src/lib/install.js');
  const profileLib = await server.ssrLoadModule('/src/lib/profile.js');
  const storage = await server.ssrLoadModule('/src/lib/storage.js');
  const offlineUi = await server.ssrLoadModule('/src/ui/offline-ui.js');
  const { allCourses, courses: offered, getCourse } = await server.ssrLoadModule('/src/content/index.js');

  // 1) every course has a face, and every "what do you want to build?" answer leads to a course the app really offers
  for (const c of allCourses) {
    const m = meta.metaOf(c);
    if (!m.emoji) failures.push(`${c.id}: no emoji`);
    if (!/^#[0-9a-f]{6}$/i.test(m.color)) failures.push(`${c.id}: colour ${m.color} is not a hex colour`);
    if (m.tagline.length === 0 || m.tagline.length > 60) failures.push(`${c.id}: the tagline must be 1 to 60 characters (it is ${m.tagline.length})`);
  }
  for (const it of meta.INTERESTS) if (!offered.some((c) => c.id === it.course)) failures.push(`welcome answer "${it.label}" points at ${it.course}, which the app does not offer`);
  if (meta.metaOf({ id: 'x', language: 'c', emoji: '🔥', tagline: 'mine' }).emoji !== '🔥') failures.push("a course's own emoji must win over the default");

  // 2) welcome: hello -> ask -> recommendation -> start. It must save the choice and the first lesson.
  document.body.className = '';
  const wv = welcomeView();
  const press = (root, text) => { const b = [...root.querySelectorAll('button')].find((x) => x.textContent.includes(text)); if (!b) throw new Error(`welcome: no button "${text}"`); b.click(); };
  try {
    press(wv.node, "Let's go");
    if (wv.node.querySelectorAll('.interest').length !== meta.INTERESTS.length) failures.push('welcome: the interest buttons are missing');
    wv.node.querySelectorAll('.interest')[2].click(); // data -> sql-start
    if (!wv.node.querySelector('.pick')) failures.push('welcome: no recommended course was shown');
    press(wv.node, 'Start my first lesson');
    await new Promise((r) => setTimeout(r, 60));
    const prof = await profileLib.getProfile();
    if (!prof.welcomed || prof.startCourse !== 'sql-start') failures.push(`welcome: the choice was not saved (${JSON.stringify(prof)})`);
    const last = await storage.getLast();
    if (!last || last.courseId !== 'sql-start') failures.push('welcome: the first lesson of the chosen course was not remembered');
  } catch (e) { failures.push(`welcome flow failed: ${e.message}`); }
  wv.cleanup();
  if (document.body.classList.contains('in-welcome')) failures.push('welcome: the tab bar stayed hidden after leaving');

  // 3) a brand-new learner is sent to the welcome; a learner who has seen it is not
  await storage.kvSet('last', null); await storage.kvSet('game', {}); await storage.kvSet('progress', {}); await storage.kvSet('profile', {});
  state.progress = {};
  location.hash = '#/learn';
  await learnView();
  if (location.hash !== '#/welcome') failures.push(`home: a brand-new learner was not sent to the welcome (hash is ${location.hash})`);
  await profileLib.updateProfile({ welcomed: true, startCourse: 'web-start' });
  const homeAfter = await learnView();
  const target = homeAfter.node.querySelector('.continue');
  if (!target || !target.getAttribute('href').includes('web-start')) failures.push('home: the Continue card must point at the course the learner chose');

  // 4) the course path: one node per lesson, exactly one "you are here", nothing locked
  let pathChecked = 0;
  for (const c of offered) {
    const v = await server.ssrLoadModule('/src/ui/views/learn.js').then((m) => m.courseView(c.id));
    const nodes = v.node.querySelectorAll('.path-node');
    if (nodes.length !== c.lessons.length) failures.push(`${c.id}: the path shows ${nodes.length} of ${c.lessons.length} lessons`);
    if (v.node.querySelectorAll('.path-node.current').length !== 1) failures.push(`${c.id}: the path must have exactly one "you are here" lesson`);
    if (![...nodes].every((n) => n.querySelector('a[href^="#/lesson/"]'))) failures.push(`${c.id}: a path lesson cannot be opened (nothing may be locked)`);
    pathChecked += 1;
  }

  // 5) backup: merging never loses work, damaged files are refused kindly
  const now = 1_800_000_000_000;
  const phoneA = { progress: { a1: { passed: true, best: 1, attempts: 2, firstPassedAt: now, hintsAtFirstPass: 2, lastAt: now } }, days: ['2026-11-20'], game: { lessons: { 'c/x': now }, badges: { 'first-run': now }, solutions: { a1: true }, goal: 2 }, last: { courseId: 'c', lessonId: 'x', at: now }, drafts: { a1: 'mine' }, profile: { welcomed: true, startCourse: 'py-start' } };
  const file = { progress: { a1: { passed: false, best: 0.5, attempts: 5, lastAt: now + 9 }, b1: { passed: true, best: 1, attempts: 1, firstPassedAt: now - 5, hintsAtFirstPass: 0, lastAt: now - 5 } }, days: ['2026-11-19', '2026-11-20'], game: { lessons: { 'c/y': now - 9 }, badges: { ten: now }, solutions: {} }, last: { courseId: 'c', lessonId: 'y', at: now + 50 }, drafts: { a1: 'theirs', b1: 'old' }, profile: { welcomed: false, startCourse: 'web-start', backupAt: 77 } };
  const m1 = backup.mergeData(phoneA, file);
  const B = (name, ok) => { if (!ok) failures.push(`backup: ${name}`); };
  B('a passed exercise stays passed even if the file says it was not', m1.progress.a1.passed === true && m1.progress.a1.best === 1);
  B('exercises only in the file are added, with their stars data', m1.progress.b1.passed && m1.progress.b1.hintsAtFirstPass === 0);
  B('days are joined without repeats', JSON.stringify(m1.days) === JSON.stringify(['2026-11-19', '2026-11-20']));
  B('lessons and badges from both are kept', m1.game.lessons['c/x'] && m1.game.lessons['c/y'] && m1.game.badges['first-run'] && m1.game.badges.ten && m1.game.solutions.a1);
  B('the most recent "last lesson" wins', m1.last.lessonId === 'y');
  B('a draft already on the phone is never replaced', m1.drafts.a1 === 'mine' && m1.drafts.b1 === 'old');
  B('the profile on the phone wins, the file fills gaps', m1.profile.welcomed === true && m1.profile.startCourse === 'py-start' && m1.profile.backupAt === 77);
  B('merging twice changes nothing (safe to restore again)', JSON.stringify(backup.mergeData(m1, file)) === JSON.stringify(m1));
  B('merging into an empty phone gives the whole file', backup.mergeData({}, file).progress.b1.passed === true);
  B('not a backup is refused kindly', !backup.checkBackup('hello').ok && !backup.checkBackup('{"a":1}').ok && backup.checkBackup('hello').why.length > 10);
  B('a newer backup version is refused', !backup.checkBackup({ app: 'saymacoder', version: 99, data: {} }).ok);
  B('a damaged backup is refused', !backup.checkBackup({ app: 'saymacoder', version: 1, data: { progress: [1] } }).ok);
  B('a good backup is accepted', backup.checkBackup(JSON.stringify(backup.makeBackup({ progress: {} }))).ok);
  // round trip through real storage
  await storage.kvSet('progress', { z1: { passed: true, best: 1, attempts: 1 } }); await storage.kvSet('draft:z1', 'my code'); await storage.kvSet('draft:z2', null);
  const collected = await backup.collectData();
  B('collectData gathers progress and non-empty drafts only', collected.progress.z1.passed && collected.drafts.z1 === 'my code' && !('z2' in (collected.drafts || {})));
  await storage.kvSet('progress', {});
  const summary = await backup.restoreData(JSON.parse(JSON.stringify(collected)));
  B('restoring puts the progress back', (await storage.getProgress()).z1?.passed === true && summary.passed >= 1);
  B('the file name has the date', /^saymacoder-backup-\d{4}-\d{2}-\d{2}\.json$/.test(backup.backupFileName(new Date(2026, 10, 21))));

  // 6) offline and install rules
  B('python, php and java need a download; the rest need none', offline.packIdFor('python') === 'python' && offline.packIdFor('php') === 'php' && offline.packIdFor('java') === 'java' && !offline.packIdFor('c') && !offline.packIdFor('sql') && !offline.packIdFor('web'));
  const rep = await offline.offlineReport({ shellReady: true });
  B('the offline report lists every pack and never throws', rep.packs.length === 3 && typeof rep.allReady === 'boolean');
  B('nothing missing for a built-in language', (await offline.missingPack('sql')) === null);
  B('with nothing to install, no install card is shown', install.installState() === 'none' && offlineUi.installCard() === null);
  const card = await offlineUi.offlineCheckCard();
  B('the offline check card draws', card.querySelectorAll('.check-row').length >= 7);
  const prof2 = { backupAt: 0, backupSnoozed: 0 };
  B('no backup reminder before real progress', offlineUi.backupReminder(prof2, { passed: 3 }, now) === null);
  B('a backup reminder after 10 exercises and no backup', offlineUi.backupReminder(prof2, { passed: 10 }, now) !== null);
  B('no reminder right after a backup or a snooze', offlineUi.backupReminder({ backupAt: now - 86400000 }, { passed: 50 }, now) === null && offlineUi.backupReminder({ backupSnoozed: now - 86400000 }, { passed: 50 }, now) === null);
  B('backup controls draw on the settings screen', (await settingsView()).node.querySelector('.backup') && (await settingsView()).node.querySelector('.offline-check'));
  console.log(`  Release 2: ${pathChecked} course paths, welcome flow, ${meta.INTERESTS.length} interests, backup merge rules, offline and install rules checked`);
  console.log(`  ${stepsChecked} lessons split into ${stepsTotal} steps (every block once, in order); ${walked} lessons walked through step by step`);
} finally {
  await server.close();
}
console.log(`\nLesson screens (every lesson view is rendered)\n  ${ok} lesson views rendered`);
console.log(`  ${clickTested} choice blocks clicked through (right answer accepted, wrong answer refused, in shuffled order)`);
if (clickTested < 300) failures.push(`only ${clickTested} choice blocks were clicked through: the click test did not run properly`);
process.removeAllListeners('uncaughtException');
if (failures.length) {
  console.log(`\nFAILURES:\n${failures.map((f) => `  - ${f}`).join('\n')}`);
  process.exit(1);
}
process.exit(0);
