// Renders lesson blocks (see src/content/blocks.js for the format).
import { h, replace, richText } from './dom.js';
import { createEditor } from '../lib/editor.js';
import { runCode } from '../lib/runners.js';
import { stdinField, outputView, symbolBar } from './components.js';
import { choiceOrder, shuffleOrder } from '../content/blocks.js';
import { editorLanguage } from '../lib/symbols.js';
import { createWorkspace, renderOnce } from './web-workspace.js';
import { filesFrom, FILE_NAMES } from '../lib/webgrade.js';

const CHOICE_LABEL = { predict: 'Predict the output', bug: 'Find the bug', quiz: 'Quick check' };

/** Lines of text (with `code` spans) as paragraphs. */
const paragraphs = (text) => String(text).split('\n\n').map((para) => h('p', null, richText(para)));

// ---- editable, runnable example ----------------------------------------------
function tryBlock(block, language, ctx, label = 'Try it yourself', hooks = {}) {
  const mount = h('div', { class: 'try-mount' });
  const editor = createEditor(mount, { language: editorLanguage(language), doc: block.code });
  ctx.cleanups.push(() => editor.destroy());

  const stdin = block.stdin !== undefined ? stdinField(block.stdin, language) : null;
  const result = h('div', { class: 'result', 'aria-live': 'polite' });
  let busy = false;

  const runBtn = h('button', { class: 'btn btn-primary btn-small', type: 'button', onclick: doRun }, 'Run');
  const resetBtn = h(
    'button',
    {
      class: 'btn btn-ghost btn-small',
      type: 'button',
      onclick: () => {
        editor.setValue(block.code);
        replace(result);
      },
    },
    'Reset',
  );

  async function doRun() {
    if (busy) return;
    busy = true;
    runBtn.disabled = true;
    replace(result, h('p', { class: 'muted small' }, 'Running…'));
    const res = await runCode(language, editor.getValue(), stdin ? stdin.value : '');
    replace(result, outputView(res, language));
    runBtn.disabled = false;
    busy = false;
    hooks.onRun?.();
  }

  return h(
    'div',
    { class: 'card try' },
    h('div', { class: 'label' }, label),
    mount,
    symbolBar(editor, language),
    stdin ? stdin.node : null,
    h('div', { class: 'try-actions' }, runBtn, resetBtn),
    result,
  );
}

// ---- multiple choice (predict / bug / quiz) -----------------------------------
// `hooks` is used by step mode (all optional; the full-page lesson passes none):
//   onResult({ correct, revealed, tries })  an answer was found, or given after `giveUpAfter` wrong tries
//   onWrong(tries)                          a wrong answer
function choiceBlock(block, blockIndex = 0, hooks = {}) {
  const feedback = h('div', { class: 'feedback', 'aria-live': 'polite' });
  const buttons = [];
  const byIndex = new Map();
  let wrongs = 0;
  const finish = () => buttons.forEach((b) => { b.disabled = true; });

  // shown shuffled, but `index` stays the option's ORIGINAL position, which is what block.answer refers to
  choiceOrder(block.options, block.question, blockIndex).forEach((index) => {
    const option = block.options[index];
    const btn = h(
      'button',
      {
        class: 'choice',
        type: 'button',
        onclick: () => {
          if (index === block.answer) {
            btn.classList.add('ok');
            finish();
            replace(feedback, h('div', { class: 'feedback-ok' }, h('strong', null, 'Correct! '), richText(block.explain)));
            hooks.onResult?.({ correct: true, tries: wrongs + 1 });
          } else {
            btn.classList.add('wrong');
            btn.disabled = true;
            wrongs += 1;
            if (hooks.giveUpAfter && wrongs >= hooks.giveUpAfter) {
              byIndex.get(block.answer)?.classList.add('ok');
              finish();
              replace(feedback, h('div', { class: 'feedback-ok' }, h('strong', null, 'The right answer is in green. '), richText(block.explain)));
              hooks.onResult?.({ correct: false, revealed: true, tries: wrongs });
            } else {
              replace(feedback, h('div', { class: 'feedback-bad' }, 'Not quite. Read the code once more and try another answer.'));
              hooks.onWrong?.(wrongs);
            }
          }
        },
      },
      h('span', { class: 'choice-text' }, option),
    );
    buttons.push(btn);
    byIndex.set(index, btn);
  });

  return h(
    'div',
    { class: 'card choice-card' },
    h('div', { class: 'label' }, CHOICE_LABEL[block.t]),
    block.code ? h('pre', { class: 'code' }, h('code', null, block.code)) : null,
    h('p', { class: 'question' }, richText(block.question)),
    h('div', { class: 'choices' }, buttons),
    feedback,
  );
}

// ---- fill the gaps ---------------------------------------------------------------
function fillBlock(block, hooks = {}) {
  let wrongs = 0;
  const feedback = h('div', { class: 'feedback', 'aria-live': 'polite' });
  const selects = block.blanks.map((blank, gap) =>
    h('select', { class: 'gap', 'aria-label': 'Choose the missing part' }, h('option', { value: '' }, '…'), choiceOrder(blank.options, `${block.template}|${blank.answer}`, gap).map((i) => h('option', { value: blank.options[i] }, blank.options[i]))),
  );
  const parts = block.template.split('___');
  const line = [];
  parts.forEach((text, i) => {
    line.push(text);
    if (i < selects.length) line.push(selects[i]);
  });

  const check = () => {
    const chosen = selects.map((s) => s.value);
    if (chosen.some((v) => v === '')) {
      replace(feedback, h('div', { class: 'feedback-bad' }, 'Fill every gap first.'));
      return;
    }
    const ok = chosen.every((v, i) => v === block.blanks[i].answer);
    selects.forEach((s, i) => {
      s.classList.toggle('ok', s.value === block.blanks[i].answer);
      s.classList.toggle('wrong', s.value !== block.blanks[i].answer);
    });
    if (ok) {
      replace(feedback, h('div', { class: 'feedback-ok' }, h('strong', null, 'Correct! '), 'The program prints:', h('pre', { class: 'out' }, block.output || '(nothing)')));
      hooks.onResult?.({ correct: true, tries: wrongs + 1 });
    } else {
      wrongs += 1;
      if (hooks.giveUpAfter && wrongs >= hooks.giveUpAfter) {
        selects.forEach((s, i) => {
          s.value = block.blanks[i].answer;
          s.classList.add('ok');
          s.classList.remove('wrong');
        });
        replace(feedback, h('div', { class: 'feedback-ok' }, h('strong', null, 'The right answers are filled in. '), 'The program prints:', h('pre', { class: 'out' }, block.output || '(nothing)')));
        hooks.onResult?.({ correct: false, revealed: true, tries: wrongs });
      } else {
        replace(feedback, h('div', { class: 'feedback-bad' }, 'Some gaps are not right yet. The red ones need another look.'));
        hooks.onWrong?.(wrongs);
      }
    }
  };

  return h(
    'div',
    { class: 'card fill-card' },
    h('div', { class: 'label' }, 'Fill the gaps'),
    h('p', { class: 'question' }, richText(block.prompt)),
    h('pre', { class: 'code fill-code' }, h('code', null, line)),
    h('button', { class: 'btn btn-small', type: 'button', onclick: check }, 'Check'),
    feedback,
  );
}

// ---- put the lines in order ----------------------------------------------------------
function reorderBlock(block, seed, hooks = {}) {
  let wrongs = 0;
  const feedback = h('div', { class: 'feedback', 'aria-live': 'polite' });
  const answerBox = h('div', { class: 'order-answer', 'aria-label': 'Your order' });
  const poolBox = h('div', { class: 'order-pool', 'aria-label': 'Lines to place' });
  let chosen = [];

  const lineButton = (index, onclick) =>
    h('button', { class: 'order-line', type: 'button', onclick }, h('code', null, block.lines[index] || ' '));

  const draw = () => {
    const free = shuffleOrder(block.lines.length, seed).filter((i) => !chosen.includes(i));
    replace(poolBox, free.map((i) => lineButton(i, () => { chosen.push(i); draw(); })));
    replace(
      answerBox,
      chosen.length ? chosen.map((i, pos) => lineButton(i, () => { chosen.splice(pos, 1); draw(); })) : h('p', { class: 'muted small' }, 'Tap the lines below, in the right order.'),
    );
  };

  const check = () => {
    const attempt = chosen.map((i) => block.lines[i]);
    if (attempt.length < block.lines.length) {
      replace(feedback, h('div', { class: 'feedback-bad' }, 'Place all the lines first.'));
    } else if (attempt.join('\n') === block.lines.join('\n')) {
      replace(feedback, h('div', { class: 'feedback-ok' }, h('strong', null, 'Correct! '), 'The program prints:', h('pre', { class: 'out' }, block.output || '(nothing)')));
      hooks.onResult?.({ correct: true, tries: wrongs + 1 });
    } else {
      wrongs += 1;
      if (hooks.giveUpAfter && wrongs >= hooks.giveUpAfter) {
        chosen = block.lines.map((_, i) => i);
        draw();
        replace(feedback, h('div', { class: 'feedback-ok' }, h('strong', null, 'The right order is shown above. '), 'The program prints:', h('pre', { class: 'out' }, block.output || '(nothing)')));
        hooks.onResult?.({ correct: false, revealed: true, tries: wrongs });
      } else {
        replace(feedback, h('div', { class: 'feedback-bad' }, 'Not the right order yet. Think about what must happen first. Tap a placed line to remove it.'));
        hooks.onWrong?.(wrongs);
      }
    }
  };

  draw();
  return h(
    'div',
    { class: 'card order-card' },
    h('div', { class: 'label' }, 'Put it in order'),
    h('p', { class: 'question' }, richText(block.prompt)),
    answerBox,
    poolBox,
    h('div', { class: 'try-actions' }, h('button', { class: 'btn btn-small', type: 'button', onclick: check }, 'Check'), h('button', { class: 'btn btn-ghost btn-small', type: 'button', onclick: () => { chosen = []; replace(feedback); draw(); } }, 'Start again')),
    feedback,
  );
}

// ---- live page example (web track) ------------------------------------------------------------
function webBlock(block, ctx) {
  const workspace = createWorkspace({ files: block.files, starter: block.starter, assets: block.assets, api: block.api, symbolsInside: true });
  ctx.cleanups.push(() => workspace.destroy());
  const reset = h('button', { class: 'btn btn-ghost btn-small', type: 'button', onclick: () => workspace.setFiles(block.starter) }, 'Reset');
  return h(
    'div',
    { class: block.project ? 'project' : 'card try web-try' },
    block.project ? h('div', { class: 'project-head' }, h('span', { class: 'chip chip-accent' }, 'Project step'), h('strong', null, block.title)) : h('div', { class: 'label' }, block.title || 'Try it yourself: change the code and watch the page'),
    block.text ? paragraphs(block.text) : null,
    workspace.node,
    h('div', { class: 'try-actions' }, reset),
  );
}

// ---- "what will the browser show?" (web track) ----------------------------------------------------
function seeBlock(block, ctx, blockIndex = 0, hooks = {}) {
  let wrongs = 0;
  const byIndex = new Map();
  const feedback = h('div', { class: 'feedback', 'aria-live': 'polite' });
  const reveal = h('div', { class: 'see-reveal' });
  const buttons = [];
  const files = filesFrom(block.files);
  choiceOrder(block.options, block.question, blockIndex).forEach((index) => {
    const option = block.options[index];
    const btn = h(
      'button',
      {
        class: 'choice',
        type: 'button',
        onclick: () => {
          const showPreview = () => {
            const preview = renderOnce(files, { assets: block.assets, api: block.api });
            ctx.cleanups.push(() => preview.destroy());
            replace(reveal, h('div', { class: 'label' }, 'Here is what the browser really shows'), preview.frame);
          };
          if (index === block.answer) {
            btn.classList.add('ok');
            buttons.forEach((b) => { b.disabled = true; });
            replace(feedback, h('div', { class: 'feedback-ok' }, h('strong', null, 'Correct! '), richText(block.explain)));
            showPreview();
            hooks.onResult?.({ correct: true, tries: wrongs + 1 });
          } else {
            btn.classList.add('wrong');
            btn.disabled = true;
            wrongs += 1;
            if (hooks.giveUpAfter && wrongs >= hooks.giveUpAfter) {
              byIndex.get(block.answer)?.classList.add('ok');
              buttons.forEach((b) => { b.disabled = true; });
              replace(feedback, h('div', { class: 'feedback-ok' }, h('strong', null, 'The right answer is in green. '), richText(block.explain)));
              showPreview();
              hooks.onResult?.({ correct: false, revealed: true, tries: wrongs });
            } else {
              replace(feedback, h('div', { class: 'feedback-bad' }, 'Not quite. Read the code again, tag by tag, and try another answer.'));
              hooks.onWrong?.(wrongs);
            }
          }
        },
      },
      h('span', { class: 'choice-text' }, option),
    );
    buttons.push(btn);
    byIndex.set(index, btn);
  });
  return h(
    'div',
    { class: 'card choice-card' },
    h('div', { class: 'label' }, 'What will the browser show?'),
    ['html', 'css', 'js'].filter((f) => files[f].trim()).map((f) => [h('div', { class: 'file-name' }, FILE_NAMES[f]), h('pre', { class: 'code' }, h('code', null, files[f]))]),
    h('p', { class: 'question' }, richText(block.question)),
    h('div', { class: 'choices' }, buttons),
    feedback,
    reveal,
  );
}

// ---- the block switch ----------------------------------------------------------------------
export function renderBlock(block, opts) {
  const node = renderBlockInner(block, opts);
  // SQL results are tables aligned with spaces: the `lang-sql` class lets the CSS scroll them sideways on a phone.
  if (opts.language === 'sql' && node && node.classList) node.classList.add('lang-sql');
  return node;
}

function renderBlockInner(block, { language, index = 0, ctx, hooks = {} }) {
  switch (block.t) {
    case 'p':
      return h('p', null, richText(block.text));
    case 'h':
      return h('h2', { class: 'lesson-h' }, block.text);
    case 'list':
      return h('ul', { class: 'bullets' }, block.items.map((item) => h('li', null, richText(item))));
    case 'tip':
      return h('div', { class: 'tip' }, h('strong', null, 'Tip'), h('p', null, richText(block.text)));
    case 'code':
      return h(
        'div',
        { class: 'code-block' },
        h('pre', { class: 'code' }, h('code', null, block.text)),
        block.output !== undefined ? [h('div', { class: 'label' }, 'Output'), h('pre', { class: 'out' }, block.output || '(nothing)')] : null,
      );
    case 'story':
      return h('div', { class: 'story' }, block.title ? h('strong', { class: 'story-title' }, block.title) : null, paragraphs(block.text));
    case 'analogy':
      return h('div', { class: 'analogy' }, h('strong', null, 'Think of it like this'), paragraphs(block.text));
    case 'recap':
      return h(
        'div',
        { class: 'card recap' },
        h('strong', null, 'Remember this'),
        h('ul', { class: 'bullets' }, block.items.map((item) => h('li', null, richText(item)))),
        block.memory ? h('p', { class: 'memory' }, richText(block.memory)) : null,
      );
    case 'mistakes':
      return h(
        'div',
        { class: 'card mistakes' },
        h('strong', null, 'Mistake museum'),
        block.items.map((m) =>
          h(
            'div',
            { class: 'mistake' },
            h('pre', { class: 'code wrong-code' }, h('code', null, m.wrong)),
            h('p', null, richText(m.why)),
            h('pre', { class: 'code right-code' }, h('code', null, m.right)),
          ),
        ),
      );
    case 'try':
      return tryBlock(block, language, ctx, 'Try it yourself', hooks);
    case 'project':
      return h(
        'div',
        { class: 'project' },
        h('div', { class: 'project-head' }, h('span', { class: 'chip chip-accent' }, 'Project step'), h('strong', null, block.title)),
        block.text ? paragraphs(block.text) : null,
        tryBlock(block, language, ctx, 'Your project so far', hooks),
      );
    case 'predict':
    case 'bug':
    case 'quiz':
      return choiceBlock(block, index, hooks);
    case 'fill':
      return fillBlock(block, hooks);
    case 'reorder':
      return reorderBlock(block, index + 1, hooks);
    case 'web':
      return webBlock(block, ctx);
    case 'see':
      return seeBlock(block, ctx, index, hooks);
    default:
      return null;
  }
}

