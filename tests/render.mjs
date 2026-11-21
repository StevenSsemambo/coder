// Renders every lesson of every course in a fake browser (jsdom) and fails if any block throws.
// This catches "click the lesson and nothing happens" bugs that the content tests cannot see.
import { createServer } from 'vite';
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!doctype html><html><body><div id="app"></div></body></html>', { url: 'https://example.test/', pretendToBeVisual: true });
const w = dom.window;
for (const k of ['window', 'document', 'navigator', 'HTMLElement', 'Node', 'Element', 'MutationObserver', 'getComputedStyle', 'requestAnimationFrame', 'cancelAnimationFrame', 'DOMParser', 'Range', 'Selection', 'Event', 'KeyboardEvent', 'MouseEvent', 'CustomEvent', 'FocusEvent', 'InputEvent', 'DocumentFragment', 'Text', 'Window', 'HTMLInputElement', 'HTMLTextAreaElement', 'HTMLIFrameElement', 'HTMLButtonElement', 'NodeFilter', 'ResizeObserver', 'IntersectionObserver']) {
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
