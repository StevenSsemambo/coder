// Turns a lesson's blocks into small screens ("steps") for step mode. Nothing in the lesson files has to change.
//
// Rules (see docs/PRODUCT.md, section 4):
//   * Every interactive block is its own step.
//   * Reading blocks (story, p, h, analogy, tip, list, code) are packed into one screen of at most about 700 characters.
//   * A heading always starts a new screen.
//   * `mistakes` and `recap` are their own screens.
//   * The last step is always "practice": the exercises of the lesson.

export const INTERACTIVE = ['try', 'predict', 'fill', 'reorder', 'bug', 'quiz', 'project', 'web', 'see'];
/** Blocks that have a right answer. A step with one of these unlocks "Continue" when answered, or after two wrong tries. */
export const QUESTIONS = ['predict', 'fill', 'reorder', 'bug', 'quiz', 'see'];
export const MAX_READING_CHARS = 700;

const SOLO = ['mistakes', 'recap'];

/** How much a block adds to the reading load of a screen. */
export function readingSize(block) {
  switch (block.t) {
    case 'list':
    case 'recap':
      return (block.items || []).join(' ').length;
    case 'code':
      return String(block.text || '').length;
    default:
      return String(block.text || '').length;
  }
}

/**
 * @returns {Array<{kind: 'read'|'do'|'solo'|'practice', blocks: Array<{block: object, index: number}>, title: string}>}
 * Every block of the lesson appears exactly once, in order (the tests check this).
 */
export function buildSteps(lesson) {
  const steps = [];
  let group = null;
  let size = 0;
  const flush = () => {
    if (group) steps.push(group);
    group = null;
    size = 0;
  };

  lesson.blocks.forEach((block, index) => {
    const item = { block, index };
    if (INTERACTIVE.includes(block.t)) {
      flush();
      steps.push({ kind: 'do', blocks: [item], title: titleFor(block) });
    } else if (SOLO.includes(block.t)) {
      flush();
      steps.push({ kind: 'solo', blocks: [item], title: titleFor(block) });
    } else {
      const add = readingSize(block);
      if (group && (block.t === 'h' || size + add > MAX_READING_CHARS)) flush();
      if (!group) group = { kind: 'read', blocks: [], title: titleFor(block) };
      group.blocks.push(item);
      size += add;
    }
  });
  flush();
  steps.push({ kind: 'practice', blocks: [], title: 'Practice' });
  return steps;
}

export function titleFor(block) {
  switch (block.t) {
    case 'story': return 'A story';
    case 'analogy': return 'Think of it like this';
    case 'try': return 'Try it';
    case 'predict': return 'Predict';
    case 'fill': return 'Fill the gaps';
    case 'reorder': return 'Put it in order';
    case 'bug': return 'Find the bug';
    case 'quiz': return 'Quick check';
    case 'project': return 'Project step';
    case 'web': return 'Try it';
    case 'see': return 'What will the browser show?';
    case 'mistakes': return 'Mistake museum';
    case 'recap': return 'Remember this';
    case 'h': return String(block.text || 'Learn');
    default: return 'Read';
  }
}

export const isQuestion = (block) => QUESTIONS.includes(block.t);
