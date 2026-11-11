import { h } from '../dom.js';
import { getCourse, getLesson } from '../../content/index.js';
import { state } from '../../state.js';
import { warmUp } from '../../lib/runners.js';
import { renderBlock } from '../lesson-blocks.js';

export function lessonView(courseId, lessonId) {
  const course = getCourse(courseId);
  const lesson = getLesson(courseId, lessonId);
  if (!lesson) return { node: h('div', { class: 'view' }, h('p', null, 'Lesson not found.')) };

  // Start loading the language runtime while the student reads.
  warmUp(course.language);

  const ctx = { cleanups: [] };
  const position = course.lessons.findIndex((l) => l.id === lesson.id);
  const previous = course.lessons[position - 1];
  const next = course.lessons[position + 1];

  const node = h(
    'div',
    { class: 'view lesson' },
    h('a', { class: 'back', href: `#/course/${course.id}` }, `← ${course.title}`),
    lesson.level ? h('span', { class: 'chip chip-accent lesson-level' }, lesson.level) : null,
    h('h1', null, lesson.title),
    lesson.minutes ? h('p', { class: 'muted small' }, `About ${lesson.minutes} minutes`) : null,
    lesson.blocks.map((block, index) => renderBlock(block, { language: course.language, index, ctx })),
    h('h2', { class: 'section-title' }, 'Practice'),
    lesson.exercises.map((e) => {
      const p = state.progress[e.id];
      return h(
        'a',
        { class: 'card lesson-row', href: `#/exercise/${course.id}/${lesson.id}/${e.id}` },
        h('span', { class: `status-dot ${p?.passed ? 'done' : ''}`, 'aria-hidden': 'true' }, p?.passed ? '✓' : ''),
        h('div', { class: 'grow' }, h('h3', null, e.title), h('p', { class: 'muted small' }, p?.passed ? 'Completed' : p ? `Best: ${Math.round(p.best * 100)}%` : 'Not started')),
        h('span', { class: 'chevron', 'aria-hidden': 'true' }, '›'),
      );
    }),
    h(
      'div',
      { class: 'lesson-nav' },
      previous ? h('a', { class: 'btn', href: `#/lesson/${course.id}/${previous.id}` }, '← Previous') : h('span'),
      next ? h('a', { class: 'btn btn-primary', href: `#/lesson/${course.id}/${next.id}` }, 'Next lesson →') : h('a', { class: 'btn', href: `#/course/${course.id}` }, 'Back to course'),
    ),
  );
  return { node, cleanup: () => ctx.cleanups.forEach((fn) => fn()) };
}
