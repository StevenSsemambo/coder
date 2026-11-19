import { cCourse } from './c-course.js';
import { javaCourse } from './java-course.js';
import { cxCourse } from './cx-course.js';
import { cppCourse } from './cpp-course.js';
import { cppProCourse } from './cpp-pro-course.js';
import { phpCourse } from './php-course.js';
import { pythonCourse } from './python-course.js';
import { sqlCourse } from './sql-course.js';
import { webCourse } from './web-course.js';

export const courses = [cCourse, cxCourse, cppCourse, pythonCourse, javaCourse, webCourse, sqlCourse, phpCourse];

// Courses that are written and fully tested but not offered in the app yet because their runtime is not wired in.
// The tests check them; the app does not list them. Move one into `courses` when its runtime ships.
export const pendingCourses = [cppProCourse];
export const allCourses = [...courses, ...pendingCourses];

export const getCourse = (id) => allCourses.find((c) => c.id === id); // a pending course can still be opened by its link
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
