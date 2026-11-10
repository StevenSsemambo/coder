import { cCourse } from './c-course.js';
import { pythonCourse } from './python-course.js';

export const courses = [cCourse, pythonCourse];

export const getCourse = (id) => courses.find((c) => c.id === id);
export const getLesson = (courseId, lessonId) => getCourse(courseId)?.lessons.find((l) => l.id === lessonId);

/** Exercise with its course context attached. */
export function getExercise(courseId, lessonId, exerciseId) {
  const course = getCourse(courseId);
  const lesson = getLesson(courseId, lessonId);
  const exercise = lesson?.exercises.find((e) => e.id === exerciseId);
  return exercise ? { ...exercise, language: course.language, courseId, lessonId } : null;
}

export const flatExercises = (course) =>
  course.lessons.flatMap((lesson) => lesson.exercises.map((e) => ({ ...e, language: course.language, courseId: course.id, lessonId: lesson.id })));

export function nextExercise(courseId, exerciseId) {
  const list = flatExercises(getCourse(courseId));
  const i = list.findIndex((e) => e.id === exerciseId);
  return i >= 0 && i < list.length - 1 ? list[i + 1] : null;
}

export function courseProgress(course, progress) {
  const list = flatExercises(course);
  const done = list.filter((e) => progress[e.id]?.passed).length;
  return { done, total: list.length, fraction: list.length ? done / list.length : 0 };
}
