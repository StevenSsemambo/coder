import { h, richText } from '../dom.js';
import { getCourse, getLesson } from '../../content/index.js';
import { state } from '../../state.js';
import { warmUp } from '../../lib/runners.js';

function renderBlock(block) {
  switch (block.t) {
    case 'p':
      return h('p', null, richText(block.text));
    case 'code':
      return h('pre', { class: 'code' }, h('code', null, block.text));
    case 'list':
      return h('ul', { class: 'bullets' }, block.items.map((item) => h('li', null, richText(item))));
    case 'tip':
      return h('div', { class: 'tip' }, h('strong', null, 'Tip'), h('p', null, richText(block.text)));
    default:
      return null;
  }
}

export function lessonView(courseId, lessonId) {
  const course = getCourse(courseId);
  const lesson = getLesson(courseId, lessonId);
  if (!lesson) return { node: h('div', { class: 'view' }, h('p', null, 'Lesson not found.')) };

  // Start loading the language runtime while the student reads.
  warmUp(course.language);

  const node = h(
    'div',
    { class: 'view lesson' },
    h('a', { class: 'back', href: `#/course/${course.id}` }, `← ${course.title}`),
    h('h1', null, lesson.title),
    lesson.blocks.map(renderBlock),
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
  );
  return { node };
}
