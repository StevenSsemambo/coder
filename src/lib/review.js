// "Practise your mistakes": which exercises deserve a second go? Pure rules, no DOM and no storage, so they are easy to test.
//
// An exercise is worth another go when it was:
//   * started but not solved yet (tried twice or more)            -> kind 'unfinished'
//   * solved only after looking at the solution                   -> kind 'solution'
//   * solved only with two or three hints                          -> kind 'hints'
//   * solved only after several failed checks                      -> kind 'tries'
// It leaves the list when the learner solves it again with NO hints (a clean pass), and that is rewarded once (see game.js).
// Nothing here is a punishment: the list is a friendly "let us make this one stronger".

export const KIND_TEXT = {
  unfinished: 'Not solved yet. Let us finish it',
  solution: 'You looked at the solution. Try it on your own',
  hints: 'You needed hints. Try it with fewer',
  tries: 'It took several tries. Try it again',
};
const WEIGHT = { unfinished: 3, solution: 2, hints: 2, tries: 1 };
export const SESSION_SIZE = 5;

/** null when the exercise needs no review, else { kind, reason, weight, at }. */
export function troubleOf({ exerciseId, progress = {}, game = {}, attempts = [] }) {
  const entry = progress[exerciseId];
  const mine = attempts.filter((a) => a && a.exerciseId === exerciseId);
  if (game.fixed && game.fixed[exerciseId]) return null;

  if (!entry || !entry.passed) {
    if (mine.length < 2) return null; // one try is just a start, not a mistake
    const at = Math.max(...mine.map((a) => a.at || 0), entry?.lastAt || 0);
    return { kind: 'unfinished', reason: KIND_TEXT.unfinished, weight: WEIGHT.unfinished, at };
  }

  const first = entry.firstPassedAt || 0;
  // a clean pass after the first one fixes it (also true for older data that has no "fixed" record)
  if (first && mine.some((a) => a.passed && !a.hintsUsed && (a.at || 0) > first)) return null;

  const failedBefore = mine.filter((a) => !a.passed && (!first || (a.at || 0) < first)).length;
  const at = first || entry.lastAt || 0;
  if (game.solutions && game.solutions[exerciseId]) return { kind: 'solution', reason: KIND_TEXT.solution, weight: WEIGHT.solution, at };
  if ((entry.hintsAtFirstPass || 0) >= 2) return { kind: 'hints', reason: KIND_TEXT.hints, weight: WEIGHT.hints, at };
  if (failedBefore >= 3) return { kind: 'tries', reason: KIND_TEXT.tries, weight: WEIGHT.tries, at };
  return null;
}

/** Every exercise worth another go, most useful first. `courses` is the list the app offers. */
export function reviewList({ courses, progress = {}, game = {}, attempts = [] }) {
  const out = [];
  for (const course of courses) {
    for (const lesson of course.lessons) {
      for (const ex of lesson.exercises) {
        const t = troubleOf({ exerciseId: ex.id, progress, game, attempts });
        if (t) out.push({ exerciseId: ex.id, courseId: course.id, lessonId: lesson.id, title: ex.title, courseTitle: course.title, ...t });
      }
    }
  }
  return out.sort((a, b) => b.weight - a.weight || b.at - a.at);
}

/** A short session: a few exercises, from different courses when possible, so it feels light. */
export function reviewSession(list, size = SESSION_SIZE) {
  const picked = [];
  const perCourse = {};
  for (const item of list) {
    if (picked.length >= size) break;
    if ((perCourse[item.courseId] || 0) >= 2) continue;
    perCourse[item.courseId] = (perCourse[item.courseId] || 0) + 1;
    picked.push(item);
  }
  for (const item of list) {
    if (picked.length >= size) break;
    if (!picked.includes(item)) picked.push(item);
  }
  return picked;
}
