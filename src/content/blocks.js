// Lesson block format: shared by the app (to render) and the tests (to verify every example).
//
// Plain blocks
//   { t: 'p', text }                     paragraph (use `code` spans)
//   { t: 'h', text }                     sub-heading
//   { t: 'list', items: [] }             bullet list
//   { t: 'tip', text }                   tip box
//   { t: 'code', text, output? }         code example; if `output` is given the tests run it and check it
//   { t: 'story', title?, text }         the real-life hook that opens a lesson
//   { t: 'analogy', text }               "think of it like..." picture
//   { t: 'recap', items: [], memory? }   "remember this" card, `memory` is a one-line memory hook
//   { t: 'mistakes', items: [{ wrong, why, right }] }   the mistake museum
//
// Interactive blocks (the tests run all of these against the real runtimes)
//   { t: 'try', code, stdin?, output? }              editable example with a Run button
//   { t: 'project', title, text?, code, stdin?, output }   one step of the course project
//   { t: 'predict', code, question, options: [], answer, explain }   choose what the program prints
//   { t: 'bug', code, question, options: [], answer, explain, fixed }   find what is wrong; `fixed` must run
//   { t: 'quiz', question, options: [], answer, explain }
//   { t: 'fill', prompt, template, blanks: [{ options: [], answer }], output, stdin? }   fill the ___ gaps
//   { t: 'reorder', prompt, lines: [], output, stdin? }   put the lines in the right order

export const BLOCK_TYPES = ['p', 'h', 'list', 'tip', 'code', 'story', 'analogy', 'recap', 'mistakes', 'try', 'project', 'predict', 'bug', 'quiz', 'fill', 'reorder'];

/** The program text a `fill` block makes when the blanks hold `answers` (default: the correct ones). */
export function fillTemplate(block, answers = block.blanks.map((b) => b.answer)) {
  let i = 0;
  return block.template.replace(/___/g, () => answers[i++] ?? '');
}

/** The correct program of a `reorder` block. */
export const reorderProgram = (block) => block.lines.join('\n') + '\n';

/** Small deterministic shuffle so a lesson always shows the same order (and never the solved order). */
export function shuffleOrder(count, seed = 1) {
  const order = Array.from({ length: count }, (_, i) => i);
  let s = (seed * 9301 + 49297) % 233280 || 1;
  const next = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  for (let i = count - 1; i > 0; i -= 1) {
    const j = Math.floor(next() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  if (count > 1 && order.every((v, i) => v === i)) order.push(order.shift());
  return order;
}

const isText = (v) => typeof v === 'string' && v.trim().length > 0;

function checkChoice(block, problems) {
  if (!isText(block.question)) problems.push('missing question');
  if (!Array.isArray(block.options) || block.options.length < 2) problems.push('needs at least 2 options');
  else {
    if (new Set(block.options).size !== block.options.length) problems.push('options must be different from each other');
    if (!Number.isInteger(block.answer) || block.answer < 0 || block.answer >= block.options.length) problems.push('answer must be the index of an option');
  }
  if (!isText(block.explain)) problems.push('missing explain (say WHY, not just what)');
}

/** Returns a list of problems with a block (empty list = fine). */
export function validateBlock(block) {
  const problems = [];
  if (!block || !BLOCK_TYPES.includes(block.t)) return [`unknown block type "${block?.t}"`];
  switch (block.t) {
    case 'p':
    case 'h':
    case 'tip':
    case 'analogy':
    case 'story':
      if (!isText(block.text)) problems.push('missing text');
      break;
    case 'list':
      if (!Array.isArray(block.items) || !block.items.length || !block.items.every(isText)) problems.push('items must be a non-empty list of text');
      break;
    case 'code':
      if (!isText(block.text)) problems.push('missing text');
      break;
    case 'recap':
      if (!Array.isArray(block.items) || !block.items.length || !block.items.every(isText)) problems.push('items must be a non-empty list of text');
      break;
    case 'mistakes':
      if (!Array.isArray(block.items) || !block.items.length) problems.push('needs items');
      else if (!block.items.every((m) => isText(m.wrong) && isText(m.why) && isText(m.right))) problems.push('every mistake needs wrong, why and right');
      break;
    case 'try':
      if (!isText(block.code)) problems.push('missing code');
      break;
    case 'project':
      if (!isText(block.title)) problems.push('missing title');
      if (!isText(block.code)) problems.push('missing code');
      if (typeof block.output !== 'string') problems.push('missing output (the tests check it)');
      break;
    case 'predict':
      if (!isText(block.code)) problems.push('missing code');
      checkChoice(block, problems);
      break;
    case 'bug':
      if (!isText(block.code)) problems.push('missing code');
      if (!isText(block.fixed)) problems.push('missing fixed (the corrected program)');
      checkChoice(block, problems);
      break;
    case 'quiz':
      checkChoice(block, problems);
      break;
    case 'fill': {
      if (!isText(block.prompt)) problems.push('missing prompt');
      if (!isText(block.template)) problems.push('missing template');
      const gaps = (block.template?.match(/___/g) || []).length;
      if (!Array.isArray(block.blanks) || block.blanks.length !== gaps || gaps === 0) problems.push(`template has ${gaps} gap(s) but blanks has ${block.blanks?.length ?? 0}`);
      else if (!block.blanks.every((b) => Array.isArray(b.options) && b.options.includes(b.answer))) problems.push('every blank needs options that include its answer');
      if (typeof block.output !== 'string') problems.push('missing output (the tests check it)');
      break;
    }
    case 'reorder':
      if (!isText(block.prompt)) problems.push('missing prompt');
      if (!Array.isArray(block.lines) || block.lines.length < 3) problems.push('needs at least 3 lines');
      if (typeof block.output !== 'string') problems.push('missing output (the tests check it)');
      break;
    default:
      break;
  }
  return problems;
}
