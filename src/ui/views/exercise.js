import { h, replace, richText, debounce, revealResult, dismissKeyboard } from '../dom.js';
import { getExercise, nextExercise } from '../../content/index.js';
import { createEditor } from '../../lib/editor.js';
import { runCode, warmUp, onRunnerStatus } from '../../lib/runners.js';
import { gradeExercise } from '../../lib/grader.js';
import { getDraft, saveDraft, clearDraft, recordAttempt, getProgress } from '../../lib/storage.js';
import { state } from '../../state.js';
import { symbolBar, stdinField, outputView, testResultsView, dock } from '../components.js';
import { webExerciseView } from './web-exercise.js';

const HINT_LABELS = ['Nudge', 'Bigger hint', 'Worked example'];
const LANGUAGE_NAME = { c: 'C', python: 'Python', web: 'JavaScript' };

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

  let busy = false;
  let hintsShown = 0;

  const mount = h('div', { class: 'editor-mount' });
  const editor = createEditor(mount, {
    language: ex.language,
    doc: ex.starter,
    onChange: debounce((code) => saveDraft(ex.id, code), 400),
  });
  getDraft(ex.id).then((draft) => {
    if (draft != null && draft !== ex.starter) editor.setValue(draft);
  });

  const stdin = ex.usesInput ? stdinField(ex.sampleInput || '') : null;
  const result = h('div', { class: 'result', 'aria-live': 'polite' });
  const hintsBox = h('div', { class: 'hints' });
  const runtimeNote = h('p', { class: 'muted small runtime' });

  const runBtn = h('button', { class: 'btn', type: 'button', onclick: doRun }, 'Run');
  const checkBtn = h('button', { class: 'btn btn-primary', type: 'button', onclick: doCheck }, 'Check answer');
  const hintBtn = h('button', { class: 'btn', type: 'button', onclick: showHint }, `Hint (0/${ex.hints.length})`);
  const resetBtn = h('button', { class: 'btn btn-ghost', type: 'button', onclick: reset }, 'Reset');

  const stop = onRunnerStatus(({ language, state: s }) => {
    if (language !== ex.language) return;
    const name = LANGUAGE_NAME[language];
    const text = { loading: `Starting ${name}… the first time can take a few seconds.`, ready: `${name} is ready.`, running: 'Running…', failed: `${name} could not start.`, idle: '' }[s];
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
      if (graded.passed) result.append(successCard(firstPass));
    }
    setBusy(false);
  }

  function successCard(firstPass) {
    const next = nextExercise(ex.courseId, ex.id);
    return h(
      'div',
      { class: 'card success' },
      h('strong', null, firstPass ? 'Well done! Exercise complete.' : 'Passed again.'),
      hintsShown ? h('p', { class: 'muted small' }, `You used ${hintsShown} hint${hintsShown > 1 ? 's' : ''}. Try the next one with fewer.`) : h('p', { class: 'muted small' }, 'No hints used. Great work.'),
      next
        ? h('a', { class: 'btn btn-primary', href: `#/exercise/${next.courseId}/${next.lessonId}/${next.id}` }, `Next: ${next.title}`)
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
    runtimeNote,
    result,
    hintsBox,
  );

  return {
    node,
    cleanup() {
      stop();
      editor.destroy();
    },
  };
}
