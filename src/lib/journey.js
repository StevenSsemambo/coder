// "What should I do next?" Pure rules, no DOM and no storage, so they are easy to test.
//
// The answer is one of:
//   { type: 'start',    courseId, lessonId }                  nothing done yet: begin the recommended course
//   { type: 'resume',   courseId, lessonId, step }            a lesson was left half way
//   { type: 'exercise', courseId, lessonId, exerciseId }      the lesson is read, an exercise is waiting
//   { type: 'lesson',   courseId, lessonId }                  the next lesson in the course
//   { type: 'done' }                                          everything on offer is finished

/** The course recommended to someone who has not started: friendly, popular, and it works on any phone. */
export const START_HERE = 'py-start';

export const lessonKey = (courseId, lessonId) => `${courseId}/${lessonId}`;

/** A lesson counts as done if its steps were finished, or if all its exercises were passed (older progress). */
export function lessonRead(game, progress, courseId, lesson) {
  if (game?.lessons?.[lessonKey(courseId, lesson.id)]) return true;
  return lesson.exercises.length > 0 && lesson.exercises.every((e) => progress?.[e.id]?.passed);
}

export const lessonFinished = (game, progress, courseId, lesson) =>
  lessonRead(game, progress, courseId, lesson) && lesson.exercises.every((e) => progress?.[e.id]?.passed);

/** The lesson the learner touched most recently, found from saved progress when no "last" record exists. */
export function lastFromProgress(courses, progress) {
  let best = null;
  for (const course of courses) {
    for (const lesson of course.lessons) {
      for (const e of lesson.exercises) {
        const at = progress?.[e.id]?.lastAt || 0;
        if (at && (!best || at > best.at)) best = { courseId: course.id, lessonId: lesson.id, at };
      }
    }
  }
  return best;
}

function firstOpenLesson(course, game, progress, afterIndex = -1) {
  for (let i = afterIndex + 1; i < course.lessons.length; i += 1) {
    if (!lessonFinished(game, progress, course.id, course.lessons[i])) return course.lessons[i];
  }
  return null;
}

export function nextUp({ courses, progress = {}, game = {}, last = null, resume = {} }) {
  const byId = new Map(courses.map((c) => [c.id, c]));
  let cursor = last && byId.get(last.courseId)?.lessons.some((l) => l.id === last.lessonId) ? last : null;
  if (!cursor) cursor = lastFromProgress(courses, progress);

  if (!cursor) {
    const start = byId.get(START_HERE) || courses[0];
    if (!start || !start.lessons.length) return { type: 'done' };
    return { type: 'start', courseId: start.id, lessonId: start.lessons[0].id };
  }

  const course = byId.get(cursor.courseId);
  const index = course.lessons.findIndex((l) => l.id === cursor.lessonId);
  const lesson = course.lessons[index];

  if (!lessonRead(game, progress, course.id, lesson)) {
    return { type: 'resume', courseId: course.id, lessonId: lesson.id, step: resume[lessonKey(course.id, lesson.id)] || 0 };
  }
  const open = lesson.exercises.find((e) => !progress?.[e.id]?.passed);
  if (open) return { type: 'exercise', courseId: course.id, lessonId: lesson.id, exerciseId: open.id };

  const nextLesson = firstOpenLesson(course, game, progress, index) || firstOpenLesson(course, game, progress, -1);
  if (nextLesson) return nextLesson === lesson ? { type: 'lesson', courseId: course.id, lessonId: lesson.id } : { type: 'lesson', courseId: course.id, lessonId: nextLesson.id };

  // This course is finished: move on to the first course that still has something to do.
  for (const other of courses) {
    if (other.id === course.id) continue;
    const l = firstOpenLesson(other, game, progress, -1);
    if (l) return { type: 'lesson', courseId: other.id, lessonId: l.id };
  }
  return { type: 'done' };
}
