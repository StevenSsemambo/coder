// UX audit: does a course suit the step-by-step lesson mode and the "easy and fun" goals?
//
//   npm run ux-audit                 every course
//   npm run ux-audit -- --course=sql-start
//   npm run ux-audit -- --ideal      the stricter targets that NEW lessons should aim for
//   npm run ux-audit -- --strict     exit with an error when anything is flagged (the UI owner uses this in reviews)
//
// It is ADVISORY: by default it never fails a build. The rules and the reasons are in docs/PRODUCT.md, section
// "How to write lessons that fit the app". Thresholds live in RULES below, so they are changed in one place.
import { courses } from '../src/content/index.js';

// Two sets of thresholds. The DEFAULT is pragmatic: it only flags lessons that really need attention, so the report is
// short enough to act on. IDEAL is what new lessons should aim for (docs/PRODUCT.md); use `--ideal` to see it.
const PRAGMATIC = { maxBlocks: 28, maxMinutes: 32, maxReadingChars: 1400, maxReadingBlocks: 6, maxStoryWords: 120, maxSummaryChars: 140, maxPromptChars: 520, maxHintChars: 500 };
const IDEAL = { maxBlocks: 24, maxMinutes: 30, maxReadingChars: 900, maxReadingBlocks: 4, maxStoryWords: 90, maxSummaryChars: 120, maxPromptChars: 450, maxHintChars: 400 };
export const RULES = { ...PRAGMATIC };
export const useIdeal = (on) => Object.assign(RULES, on ? IDEAL : PRAGMATIC);
const INTERACTIVE = new Set(['try', 'predict', 'fill', 'reorder', 'bug', 'quiz', 'project', 'web', 'see']);
const textOf = (b) => [b.title, b.text, b.code, b.question, ...(Array.isArray(b.items) ? b.items.filter((x) => typeof x === 'string') : [])].filter(Boolean).join(' ');
const words = (s) => String(s || '').trim().split(/\s+/).filter(Boolean).length;

export function auditLesson(lesson) {
  const flags = [];
  const blocks = lesson.blocks || [];
  if (blocks.length > RULES.maxBlocks) flags.push(['long', `${blocks.length} blocks (more than ${RULES.maxBlocks}): split into Part 1 and Part 2`]);
  if ((lesson.minutes || 0) > RULES.maxMinutes) flags.push(['minutes', `${lesson.minutes} minutes (more than ${RULES.maxMinutes})`]);
  if (!blocks.length || blocks[0].t !== 'story') flags.push(['story', 'does not open with a story block']);
  if (blocks.length && blocks[blocks.length - 1].t !== 'recap') flags.push(['recap', 'does not end with a recap block']);
  const story = blocks.find((b) => b.t === 'story');
  if (story && words(story.text) > RULES.maxStoryWords) flags.push(['story-long', `the story is ${words(story.text)} words (more than ${RULES.maxStoryWords})`]);
  if ((lesson.summary || '').length > RULES.maxSummaryChars) flags.push(['summary', `the summary is ${lesson.summary.length} characters (more than ${RULES.maxSummaryChars})`]);
  // reading in a row
  let run = [];
  const closeRun = (endAt) => {
    const chars = run.reduce((n, b) => n + textOf(b).length, 0);
    if (run.length > RULES.maxReadingBlocks || chars > RULES.maxReadingChars) flags.push(['wall-of-text', `${run.length} reading blocks (${chars} characters) in a row before block ${endAt + 1}: put something to DO in between`]);
    run = [];
  };
  blocks.forEach((b, i) => {
    if (b.t === 'recap') return;
    if (INTERACTIVE.has(b.t)) closeRun(i);
    else run.push(b);
  });
  closeRun(blocks.length);
  for (const e of lesson.exercises || []) {
    if ((e.prompt || '').length > RULES.maxPromptChars) flags.push(['prompt', `exercise ${e.id}: the prompt is ${e.prompt.length} characters (more than ${RULES.maxPromptChars})`]);
    (e.hints || []).forEach((h, i) => { if (String(h).length > RULES.maxHintChars) flags.push(['hint', `exercise ${e.id}: hint ${i + 1} is ${String(h).length} characters (more than ${RULES.maxHintChars})`]); });
  }
  return flags;
}

export function auditCourse(course) {
  const rows = course.lessons.map((l) => ({ id: l.id, blocks: l.blocks.length, flags: auditLesson(l) }));
  const flagged = rows.filter((r) => r.flags.length);
  const blockCounts = rows.map((r) => r.blocks);
  return {
    id: course.id,
    lessons: rows.length,
    avgBlocks: blockCounts.reduce((a, b) => a + b, 0) / Math.max(1, rows.length),
    maxBlocks: Math.max(0, ...blockCounts),
    flagged,
    clean: rows.length - flagged.length,
  };
}

// ---- command line ----------------------------------------------------------------------------------------------------
const args = process.argv.slice(2);
if (process.argv[1] && process.argv[1].endsWith('ux-audit.mjs')) {
  const only = (args.find((a) => a.startsWith('--course=')) || '').slice(9);
  const strict = args.includes('--strict');
  useIdeal(args.includes('--ideal'));
  const list = courses.filter((c) => !only || c.id === only);
  if (!list.length) { console.log(`No course called "${only}". Courses: ${courses.map((c) => c.id).join(', ')}`); process.exit(1); }
  let total = 0;
  console.log('\nUX audit: does the course suit the step-by-step lesson mode?  (advisory, see docs/PRODUCT.md)\n');
  console.log('course'.padEnd(16), 'lessons', 'clean', 'flagged', 'avg blocks', 'longest');
  for (const c of list) {
    const r = auditCourse(c);
    total += r.flagged.length;
    console.log(r.id.padEnd(16), String(r.lessons).padStart(7), String(r.clean).padStart(5), String(r.flagged.length).padStart(7), r.avgBlocks.toFixed(1).padStart(10), String(r.maxBlocks).padStart(7));
  }
  for (const c of list) {
    const r = auditCourse(c);
    if (!r.flagged.length) continue;
    console.log(`\n${c.id}: lessons to improve`);
    for (const f of r.flagged.slice(0, only ? 999 : 6)) console.log(`  ${f.id}\n${f.flags.map(([, msg]) => `      - ${msg}`).join('\n')}`);
    if (!only && r.flagged.length > 6) console.log(`  ... and ${r.flagged.length - 6} more (run with --course=${c.id} to see all)`);
  }
  console.log(total ? `\n${total} lesson(s) flagged. These are suggestions, not errors.\n` : '\nAll lessons suit the step-by-step mode.\n');
  if (strict && total) process.exit(1);
}
