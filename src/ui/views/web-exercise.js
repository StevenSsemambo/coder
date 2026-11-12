// A web exercise: edit HTML / CSS / JavaScript, watch the page update, then let the checker grade it.
import { h, replace, richText, revealResult, dismissKeyboard } from '../dom.js';
import { nextExercise } from '../../content/index.js';
import { gradeWeb } from '../../lib/webrun.js';
import { filesFrom } from '../../lib/webgrade.js';
import { getDraft, saveDraft, clearDraft, recordAttempt, getProgress } from '../../lib/storage.js';
import { state } from '../../state.js';
import { webResultsView, dock } from '../components.js';
import { createWorkspace } from '../web-workspace.js';
import { debounce } from '../dom.js';

const HINT_LABELS = ['Nudge', 'Bigger hint', 'Worked example'];

/** Hint text with ```fenced``` code blocks turned into real code boxes. */
const hintNodes = (text) =>
  text.split(/```\n?/).map((part, i) => (i % 2 ? h('pre', { class: 'code' }, h('code', null, part.replace(/\n$/, ''))) : part.trim() ? h('p', null, richText(part.trim())) : null));

const promptBlocks = (text) => text.split('\n\n').map((para) => h('p', null, para.split('\n').map((line, i, all) => [richText(line), i < all.length - 1 ? h('br') : null])));

export async function webExerciseView(ex) {
  let busy = false;
  let hintsShown = 0;

  const saved = await getDraft(ex.id);
  const startFiles = saved && typeof saved === 'object' ? filesFrom({ ...ex.starter, ...saved }) : filesFrom(ex.starter);

  const workspace = createWorkspace({
    files: ex.files,
    starter: startFiles,
    goal: ex.solution,
    assets: ex.assets,
    api: ex.api,
    strict: ex.strict,
    onChange: debounce((files) => saveDraft(ex.id, files), 500),
  });

  const result = h('div', { class: 'result', 'aria-live': 'polite' });
  const hintsBox = h('div', { class: 'hints' });
  const checkBtn = h('button', { class: 'btn btn-primary', type: 'button', onclick: doCheck }, 'Check my page');
  const hintBtn = h('button', { class: 'btn', type: 'button', onclick: showHint }, `Hint (0/${ex.hints.length})`);
  const resetBtn = h('button', { class: 'btn btn-ghost', type: 'button', onclick: reset }, 'Reset');

  async function doCheck() {
    if (busy) return;
    dismissKeyboard();
    busy = true;
    checkBtn.disabled = true;
    replace(result, h('p', { class: 'muted' }, 'Checking your page…'));
    const files = workspace.getFiles();
    const graded = await gradeWeb(ex, files);
    replace(result, webResultsView(graded));
    revealResult(result);
    const { firstPass } = await recordAttempt({ exerciseId: ex.id, courseId: ex.courseId, passedCount: graded.passedCount, total: graded.total, hintsUsed: hintsShown });
    state.progress = await getProgress();
    if (graded.passed) result.append(successCard(firstPass));
    busy = false;
    checkBtn.disabled = false;
  }

  function successCard(firstPass) {
    const next = nextExercise(ex.courseId, ex.id);
    return h(
      'div',
      { class: 'card success' },
      h('strong', null, firstPass ? 'Well done! Exercise complete.' : 'Passed again.'),
      hintsShown ? h('p', { class: 'muted small' }, `You used ${hintsShown} hint${hintsShown > 1 ? 's' : ''}. Try the next one with fewer.`) : h('p', { class: 'muted small' }, 'No hints used. Great work.'),
      h('p', { class: 'muted small' }, 'Tip: tap "Save page" under the preview to download your page as a real file.'),
      next
        ? h('a', { class: 'btn btn-primary', href: `#/exercise/${next.courseId}/${next.lessonId}/${next.id}` }, `Next: ${next.title}`)
        : h('a', { class: 'btn btn-primary', href: `#/lesson/${ex.courseId}/${ex.lessonId}` }, 'Back to the lesson'),
    );
  }

  function showHint() {
    if (hintsShown >= ex.hints.length) return;
    hintsShown += 1;
    hintsBox.append(h('div', { class: 'hint' }, h('div', { class: 'label' }, `Hint ${hintsShown} of ${ex.hints.length}: ${HINT_LABELS[hintsShown - 1]}`), hintNodes(ex.hints[hintsShown - 1])));
    hintBtn.textContent = `Hint (${hintsShown}/${ex.hints.length})`;
    hintBtn.disabled = hintsShown >= ex.hints.length;
  }

  async function reset() {
    if (!confirm('Reset your code to the starting version?')) return;
    workspace.setFiles(ex.starter);
    await clearDraft(ex.id);
    replace(result);
  }

  const node = h(
    'div',
    { class: 'view exercise web-exercise' },
    h('a', { class: 'back', href: `#/lesson/${ex.courseId}/${ex.lessonId}` }, '← Lesson'),
    h('h1', null, ex.title),
    h('div', { class: 'card prompt' }, promptBlocks(ex.prompt)),
    workspace.node,
    dock(workspace.symbols, h('div', { class: 'actions' }, checkBtn)),
    h('div', { class: 'actions actions-secondary' }, hintBtn, resetBtn),
    result,
    hintsBox,
  );

  return { node, cleanup: () => workspace.destroy() };
}
