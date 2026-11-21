import { h, replace, richText, debounce, revealResult, dismissKeyboard } from '../dom.js';
import { getExercise, nextExercise } from '../../content/index.js';
import { createEditor } from '../../lib/editor.js';
import { runCode, warmUp, onRunnerStatus } from '../../lib/runners.js';
import { gradeExercise } from '../../lib/grader.js';
import { getDraft, saveDraft, clearDraft, recordAttempt, getProgress, setLast } from '../../lib/storage.js';
import { getSolution } from '../../lib/solutions.js';
import { markSolutionUsed } from '../../lib/game.js';
import { katoSays, pickLine } from '../mascot.js';
import { nextInReview } from '../rewards.js';
import { allCourses } from '../../content/index.js';
import { feel } from '../feedback.js';
import { state } from '../../state.js';
import { symbolBar, stdinField, outputView, testResultsView, dock } from '../components.js';
import { webExerciseView } from './web-exercise.js';

const HINT_LABELS = ['Nudge', 'Bigger hint', 'Worked example'];
const LANGUAGE_NAME = { c: 'C', cx: 'C', cpp: 'C++', cppfull: 'C++', python: 'Python', java: 'Java', web: 'JavaScript', sql: 'SQLite', php: 'PHP' };
// After this many checks that did not pass, "Show a solution" appears even if the learner has not used every hint.
const SOLUTION_AFTER_FAILS = 3;

function promptBlocks(text) {
  return text.split('\n\n').map((para) => h('p', null, para.split('\n').map((line, i, all) => [richText(line), i < all.length - 1 ? h('br') : null])));
}

function exampleBlock(ex) {
  const t = ex.tests[0];
  return h(
    'div',
    { class: 'example' },
    t.input ? [h('div', { class: 'label' }, 'Example input'), h('pre', null, t.input)] : null,
    h('div', { class: 'label' }, 'Expected output'),
    h('pre', null, t.expected),
  );
}

export function exerciseView(courseId, lessonId, exerciseId) {
  const ex = getExercise(courseId, lessonId, exerciseId);
  if (!ex) return { node: h('div', { class: 'view' }, h('p', null, 'Exercise not found.')) };
  if (ex.language === 'web') return webExerciseView(ex);

  warmUp(ex.language);
  setLast(ex.courseId, ex.lessonId);

  let busy = false;
  let hintsShown = 0;
  let failedChecks = 0;

  const mount = h('div', { class: 'editor-mount' });
  const editor = createEditor(mount, {
    language: ex.language,
    doc: ex.starter,
    onChange: debounce((code) => saveDraft(ex.id, code), 400),
  });
  getDraft(ex.id).then((draft) => {
    if (draft != null && draft !== ex.starter) editor.setValue(draft);
  });

  const stdin = ex.usesInput ? stdinField(ex.sampleInput || '', ex.language) : null;
  const result = h('div', { class: 'result', 'aria-live': 'polite' });
  const hintsBox = h('div', { class: 'hints' });
  const nudge = h('div', { class: 'nudge' });
  const solutionBox = h('div', { class: 'solution-box' });
  const runtimeNote = h('p', { class: 'muted small runtime' });

  const runBtn = h('button', { class: 'btn', type: 'button', onclick: doRun }, 'Run');
  const checkBtn = h('button', { class: 'btn btn-primary', type: 'button', onclick: doCheck }, 'Check answer');
  const hintBtn = h('button', { class: 'btn', type: 'button', onclick: showHint }, `Hint (0/${ex.hints.length})`);
  const resetBtn = h('button', { class: 'btn btn-ghost', type: 'button', onclick: reset }, 'Reset');
  const solutionBtn = h('button', { class: 'btn btn-ghost hidden', type: 'button', onclick: askSolution }, 'Show a solution');

  const stop = onRunnerStatus(({ language, state: s, detail }) => {
    if (language !== ex.language) return;
    const name = LANGUAGE_NAME[language];
    const text = { loading: `Starting ${name}… the first time can take a few seconds.`, ready: `${name} is ready.`, running: detail === 'building' ? 'Building your program… the first run can take a few seconds.' : 'Running…', failed: `${name} could not start.`, idle: '' }[s];
    runtimeNote.textContent = text ?? '';
  });

  function setBusy(value) {
    busy = value;
    runBtn.disabled = value;
    checkBtn.disabled = value;
  }

  async function doRun() {
    if (busy) return;
    dismissKeyboard();
    setBusy(true);
    replace(result, h('p', { class: 'muted' }, 'Running…'));
    const res = await runCode(ex.language, editor.getValue(), stdin ? stdin.value : '');
    replace(result, outputView(res, ex.language));
    revealResult(result);
    setBusy(false);
  }

  async function doCheck() {
    if (busy) return;
    dismissKeyboard();
    setBusy(true);
    replace(result, h('p', { class: 'muted' }, 'Checking your program against the tests…'));
    const code = editor.getValue();
    const graded = await gradeExercise(ex, (input) => runCode(ex.language, code, input));
    replace(result, testResultsView(graded, ex.language));
    revealResult(result);
    if (!graded.initFailed) {
      const { firstPass } = await recordAttempt({ exerciseId: ex.id, courseId: ex.courseId, passedCount: graded.passedCount, total: graded.total, hintsUsed: hintsShown });
      state.progress = await getProgress();
      if (graded.passed) {
        result.append(successCard(firstPass));
        replace(nudge);
      } else {
        failedChecks += 1;
        feel('wrong');
        maybeOfferSolution();
        if (failedChecks >= 2 && hintsShown === 0) replace(nudge, katoSays('think', pickLine('stuck', failedChecks)));
      }
    }
    setBusy(false);
  }

  function successCard(firstPass) {
    // During a "practise your mistakes" session, Next follows the review list instead of the course order.
    const reviewNextId = nextInReview(ex.id);
    const inReview = Boolean(state.review?.ids?.includes(ex.id));
    let next = nextExercise(ex.courseId, ex.id);
    if (inReview) {
      next = null;
      if (reviewNextId) {
        for (const c of allCourses) for (const l of c.lessons) for (const e of l.exercises) if (e.id === reviewNextId) next = { ...e, courseId: c.id, lessonId: l.id };
      }
    }
    return h(
      'div',
      { class: 'card success' },
      h('strong', null, firstPass ? 'Well done! Exercise complete.' : 'Passed again.'),
      hintsShown ? h('p', { class: 'muted small' }, `You used ${hintsShown} hint${hintsShown > 1 ? 's' : ''}. Try the next one with fewer.`) : h('p', { class: 'muted small' }, 'No hints used. Great work.'),
      next
        ? h('a', { class: 'btn btn-primary', href: `#/exercise/${next.courseId}/${next.lessonId}/${next.id}` }, `Next: ${next.title}`)
        : inReview
          ? h('a', { class: 'btn btn-primary', href: '#/review' }, 'Back to review')
          : h('a', { class: 'btn btn-primary', href: `#/lesson/${ex.courseId}/${ex.lessonId}` }, 'Back to the lesson'),
    );
  }

  function showHint() {
    if (hintsShown >= ex.hints.length) return;
    hintsShown += 1;
    hintsBox.append(
      h(
        'div',
        { class: 'hint' },
        h('div', { class: 'label' }, `Hint ${hintsShown} of ${ex.hints.length}: ${HINT_LABELS[hintsShown - 1]}`),
        h('p', null, richText(ex.hints[hintsShown - 1])),
      ),
    );
    hintBtn.textContent = `Hint (${hintsShown}/${ex.hints.length})`;
    hintBtn.disabled = hintsShown >= ex.hints.length;
    feel('tap');
    maybeOfferSolution();
  }

  // ---- "Show a solution": never a dead end. It appears after every hint was used, or after a few tries that did not pass.
  function maybeOfferSolution() {
    if (hintsShown >= ex.hints.length || failedChecks >= SOLUTION_AFTER_FAILS) solutionBtn.classList.remove('hidden');
  }

  let confirming = false;
  function askSolution() {
    if (!confirming) {
      confirming = true;
      solutionBtn.textContent = 'Yes, show it (1 star)';
      solutionBtn.classList.add('btn-confirm');
      replace(solutionBox, h('p', { class: 'muted small' }, 'Looking at a solution is fine. This exercise will then give 1 star. Tap the button again to see it.'));
      return;
    }
    confirming = false;
    solutionBtn.classList.add('hidden');
    revealSolution();
  }

  async function revealSolution() {
    const code = await getSolution(ex);
    if (code) await markSolutionUsed(ex.id);
    const next = nextExercise(ex.courseId, ex.id);
    replace(
      solutionBox,
      h(
        'div',
        { class: 'card solution' },
        h('div', { class: 'label' }, code ? 'A solution' : 'No solution to show'),
        code
          ? [
              h('pre', { class: 'code' }, h('code', null, code)),
              h('p', { class: 'muted small' }, 'Read it slowly. Then put it in your editor, run it, and change one thing to see what happens.'),
              h('div', { class: 'actions' }, h('button', { class: 'btn btn-primary', type: 'button', onclick: () => { editor.setValue(code); revealResult(mount); } }, 'Put it in my editor'), h('button', { class: 'btn btn-ghost', type: 'button', onclick: () => replace(solutionBox) }, 'Hide')),
            ]
          : [
              h('p', null, 'There is no stored solution for this one. Use hint 3 (a worked example of a similar problem), or move on and come back later.'),
              next ? h('a', { class: 'btn', href: `#/exercise/${next.courseId}/${next.lessonId}/${next.id}` }, 'Skip for now') : h('a', { class: 'btn', href: `#/lesson/${ex.courseId}/${ex.lessonId}` }, 'Back to the lesson'),
            ],
      ),
    );
  }

  async function reset() {
    if (!confirm('Reset your code to the starting version?')) return;
    editor.setValue(ex.starter);
    await clearDraft(ex.id);
    replace(result);
  }

  const node = h(
    'div',
    { class: 'view exercise' },
    h('a', { class: 'back', href: `#/lesson/${ex.courseId}/${ex.lessonId}` }, '← Lesson'),
    h('h1', null, ex.title),
    h('div', { class: 'card prompt' }, promptBlocks(ex.prompt), exampleBlock(ex)),
    mount,
    stdin ? stdin.node : null,
    // The dock stays at the bottom of the screen: symbols and the main buttons are always reachable.
    dock(symbolBar(editor, ex.language), h('div', { class: 'actions' }, runBtn, checkBtn)),
    h('div', { class: 'actions actions-secondary' }, hintBtn, resetBtn),
    solutionBtn,
    runtimeNote,
    result,
    nudge,
    hintsBox,
    solutionBox,
  );

  return {
    node,
    cleanup() {
      stop();
      editor.destroy();
    },
  };
}
