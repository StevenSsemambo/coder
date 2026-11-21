// Career paths: a few courses taken in order, with one finish line. Pure rules (no DOM, no storage) so they are easy to test.
// A path only lists courses the app really offers (a hidden course is skipped, so a path never points at nothing).
import { lessonFinished } from './journey.js';

export const PATHS = [
  { id: 'web-builder', title: 'Web builder', emoji: '🌐', blurb: 'Make websites that look good and remember things.', courseIds: ['web-start', 'php-start', 'sql-start'] },
  { id: 'software-engineer', title: 'Software engineer', emoji: '🧑‍💻', blurb: 'Python first, then databases, then solid object-oriented apps.', courseIds: ['py-start', 'sql-start', 'java-start'] },
  { id: 'systems-programmer', title: 'Systems programmer', emoji: '⚙️', blurb: 'See how computers really work: C, memory, then C++.', courseIds: ['c-structured', 'c-advanced', 'cpp-start'] },
];

export const courseFinished = (course, game, progress) => course.lessons.length > 0 && course.lessons.every((l) => lessonFinished(game, progress, course.id, l));

/** { path, steps: [{course, done, total, finished}], finished, fraction, next } for one path. */
export function pathStatus(path, courses, progress = {}, game = {}) {
  const byId = new Map(courses.map((c) => [c.id, c]));
  const steps = path.courseIds
    .map((id) => byId.get(id))
    .filter(Boolean)
    .map((course) => {
      const total = course.lessons.reduce((n, l) => n + l.exercises.length, 0);
      const done = course.lessons.reduce((n, l) => n + l.exercises.filter((e) => progress[e.id]?.passed).length, 0);
      return { course, done, total, finished: courseFinished(course, game, progress) };
    });
  const total = steps.reduce((n, s) => n + s.total, 0);
  const done = steps.reduce((n, s) => n + s.done, 0);
  return { path, steps, finished: steps.length > 0 && steps.every((s) => s.finished), fraction: total ? done / total : 0, next: steps.find((s) => !s.finished)?.course || null };
}

export const allPathStatus = (courses, progress, game) => PATHS.map((p) => pathStatus(p, courses, progress, game)).filter((s) => s.steps.length);

/** What a certificate is for: a course or a path. null when the id is unknown. */
export function certificateTarget(kind, id, courses, progress, game) {
  if (kind === 'course') {
    const course = courses.find((c) => c.id === id);
    return course ? { kind, id, title: course.title, finished: courseFinished(course, game, progress), parts: [course.title] } : null;
  }
  if (kind === 'path') {
    const path = PATHS.find((p) => p.id === id);
    if (!path) return null;
    const s = pathStatus(path, courses, progress, game);
    return s.steps.length ? { kind, id, title: path.title, finished: s.finished, parts: s.steps.map((x) => x.course.title), status: s } : null;
  }
  return null;
}
