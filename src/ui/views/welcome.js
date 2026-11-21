// First run: three small screens. Hello from Kato, "What do you want to build?", then a first step to start right away.
// It also reopens from Settings so a learner can choose a different starting course.
import { h, replace } from '../dom.js';
import { getCourse } from '../../content/index.js';
import { kato } from '../mascot.js';
import { metaOf, INTERESTS } from '../course-meta.js';
import { updateProfile } from '../../lib/profile.js';
import { setLast } from '../../lib/storage.js';
import { go } from '../router.js';
import { feel } from '../feedback.js';

export function welcomeView() {
  document.body.classList.add('in-welcome');
  const stage = h('div', { class: 'welcome-stage' });
  let picked = null;

  const finish = async (courseId) => {
    const course = getCourse(courseId);
    await updateProfile({ welcomed: true, startCourse: courseId, interest: picked?.id || null });
    if (course?.lessons.length) await setLast(courseId, course.lessons[0].id);
    return course;
  };

  function hello() {
    replace(
      stage,
      h('div', { class: 'welcome-kato' }, kato('cheer', 132)),
      h('h1', { class: 'welcome-title' }, 'Hi, I am Kato!'),
      h('p', { class: 'welcome-text' }, 'I will help you learn to code, one small step at a time. No experience needed. It all works with no internet.'),
      h('button', { class: 'btn btn-primary btn-block', type: 'button', onclick: () => { feel('tap'); ask(); } }, "Let's go"),
      h('button', { class: 'btn btn-ghost btn-block', type: 'button', onclick: async () => { await updateProfile({ welcomed: true }); go('/learn'); } }, 'Skip. Show me the courses'),
    );
  }

  function ask() {
    replace(
      stage,
      h('div', { class: 'welcome-kato small' }, kato('think', 84)),
      h('h1', { class: 'welcome-title' }, 'What do you want to build?'),
      h('p', { class: 'welcome-text muted' }, 'Pick one. You can change your mind any time.'),
      h(
        'div',
        { class: 'interest-list' },
        INTERESTS.map((it) =>
          h('button', { class: 'interest', type: 'button', onclick: () => { picked = it; feel('tap'); recommend(it); } }, h('span', { class: 'interest-emoji', 'aria-hidden': 'true' }, it.emoji), h('span', { class: 'grow' }, h('strong', null, it.label), h('span', { class: 'muted small block' }, it.help))),
        ),
      ),
    );
  }

  function recommend(it) {
    const course = getCourse(it.course);
    if (!course) { go('/learn'); return; }
    const meta = metaOf(course);
    const first = course.lessons[0];
    replace(
      stage,
      h('div', { class: 'welcome-kato small' }, kato('happy', 84)),
      h('h1', { class: 'welcome-title' }, 'Great choice!'),
      h('p', { class: 'welcome-text muted' }, 'Here is a good place to begin:'),
      h('div', { class: 'card pick', style: `--course:${meta.color}` }, h('span', { class: 'pick-emoji', 'aria-hidden': 'true' }, meta.emoji), h('div', { class: 'grow' }, h('h2', null, course.title), meta.tagline ? h('p', { class: 'muted' }, meta.tagline) : null, h('p', { class: 'muted small' }, `${course.lessons.length} lessons. First: ${first.title}`))),
      h('button', { class: 'btn btn-primary btn-block', type: 'button', onclick: async () => { feel('ok'); await finish(course.id); go(`/lesson/${course.id}/${first.id}`); } }, 'Start my first lesson'),
      h('button', { class: 'btn btn-ghost btn-block', type: 'button', onclick: ask }, '← Choose something else'),
    );
  }

  hello();
  return { node: h('div', { class: 'view welcome' }, stage), cleanup: () => document.body.classList.remove('in-welcome') };
}
