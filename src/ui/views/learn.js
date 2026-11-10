import { h } from '../dom.js';
import { courses, courseProgress, getCourse, flatExercises } from '../../content/index.js';
import { state } from '../../state.js';
import { progressBar } from '../components.js';

const LANGUAGE_LABEL = { c: 'C', python: 'Python' };

export function learnView() {
  const node = h(
    'div',
    { class: 'view' },
    h('section', { class: 'hero' }, h('h1', null, 'Learn to code. No data needed.'), h('p', { class: 'muted' }, 'Lessons, practice and instant feedback that work offline, right on your phone.')),
    h('h2', { class: 'section-title' }, 'Courses'),
    courses.map((course) => {
      const p = courseProgress(course, state.progress);
      return h(
        'a',
        { class: 'card course', href: `#/course/${course.id}` },
        h('div', { class: 'course-top' }, h('span', { class: 'chip chip-accent' }, LANGUAGE_LABEL[course.language]), h('span', { class: 'muted small' }, `${p.done} of ${p.total} done`)),
        h('h3', null, course.title),
        h('p', { class: 'muted' }, course.subtitle),
        progressBar(p.fraction),
      );
    }),
  );
  return { node };
}

export function courseView(courseId) {
  const course = getCourse(courseId);
  if (!course) return { node: h('div', { class: 'view' }, h('p', null, 'Course not found.')) };
  const node = h(
    'div',
    { class: 'view' },
    h('a', { class: 'back', href: '#/learn' }, '← All courses'),
    h('h1', null, course.title),
    h('p', { class: 'muted' }, course.subtitle),
    course.lessons.map((lesson, i) => {
      const done = lesson.exercises.filter((e) => state.progress[e.id]?.passed).length;
      return h(
        'a',
        { class: 'card lesson-row', href: `#/lesson/${course.id}/${lesson.id}` },
        h('span', { class: 'lesson-num' }, String(i + 1)),
        h('div', { class: 'grow' }, h('h3', null, lesson.title), h('p', { class: 'muted small' }, lesson.summary)),
        h('span', { class: `chip ${done === lesson.exercises.length ? 'chip-ok' : ''}` }, `${done}/${lesson.exercises.length}`),
      );
    }),
  );
  // referenced so bundlers keep the helper import used for future "continue" logic
  void flatExercises;
  return { node };
}
