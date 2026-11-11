// Renders lesson blocks (see src/content/blocks.js for the format).
import { h, replace, richText } from './dom.js';
import { createEditor } from '../lib/editor.js';
import { runCode } from '../lib/runners.js';
import { stdinField, outputView, symbolBar } from './components.js';
import { shuffleOrder } from '../content/blocks.js';

const CHOICE_LABEL = { predict: 'Predict the output', bug: 'Find the bug', quiz: 'Quick check' };

/** Lines of text (with `code` spans) as paragraphs. */
const paragraphs = (text) => String(text).split('\n\n').map((para) => h('p', null, richText(para)));

// ---- editable, runnable example ----------------------------------------------
function tryBlock(block, language, ctx, label = 'Try it yourself') {
  const mount = h('div', { class: 'try-mount' });
  const editor = createEditor(mount, { language, doc: block.code });
  ctx.cleanups.push(() => editor.destroy());

  const stdin = block.stdin !== undefined ? stdinField(block.stdin) : null;
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
function choiceBlock(block) {
  const feedback = h('div', { class: 'feedback', 'aria-live': 'polite' });
  const buttons = [];
  const finish = () => buttons.forEach((b) => { b.disabled = true; });

  block.options.forEach((option, index) => {
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
          } else {
            btn.classList.add('wrong');
            btn.disabled = true;
            replace(feedback, h('div', { class: 'feedback-bad' }, 'Not quite. Read the code once more and try another answer.'));
          }
        },
      },
      h('span', { class: 'choice-text' }, option),
    );
    buttons.push(btn);
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
function fillBlock(block) {
  const feedback = h('div', { class: 'feedback', 'aria-live': 'polite' });
  const selects = block.blanks.map((blank) =>
    h('select', { class: 'gap', 'aria-label': 'Choose the missing part' }, h('option', { value: '' }, '…'), blank.options.map((o) => h('option', { value: o }, o))),
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
    } else {
      replace(feedback, h('div', { class: 'feedback-bad' }, 'Some gaps are not right yet. The red ones need another look.'));
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
function reorderBlock(block, seed) {
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
    } else {
      replace(feedback, h('div', { class: 'feedback-bad' }, 'Not the right order yet. Think about what must happen first. Tap a placed line to remove it.'));
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

// ---- the block switch ----------------------------------------------------------------------
export function renderBlock(block, { language, index = 0, ctx }) {
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
      return tryBlock(block, language, ctx);
    case 'project':
      return h(
        'div',
        { class: 'project' },
        h('div', { class: 'project-head' }, h('span', { class: 'chip chip-accent' }, 'Project step'), h('strong', null, block.title)),
        block.text ? paragraphs(block.text) : null,
        tryBlock(block, language, ctx, 'Your project so far'),
      );
    case 'predict':
    case 'bug':
    case 'quiz':
      return choiceBlock(block);
    case 'fill':
      return fillBlock(block);
    case 'reorder':
      return reorderBlock(block, index + 1);
    default:
      return null;
  }
}

