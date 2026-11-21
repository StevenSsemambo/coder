// Practise your mistakes: a short, friendly session built from exercises that were hard (see src/lib/review.js).
import { h } from '../dom.js';
import { courses } from '../../content/index.js';
import { state } from '../../state.js';
import { katoSays } from '../mascot.js';
import { loadStats } from '../../lib/game.js';
import { reviewList, reviewSession, SESSION_SIZE } from '../../lib/review.js';
import { metaOf } from '../course-meta.js';
import { courseOf } from '../rewards.js';
import { feel } from '../feedback.js';

const KIND_EMOJI = { unfinished: '🧩', solution: '👀', hints: '💡', tries: '🔁' };

export async function reviewView() {
  const { progress, game, attempts } = await loadStats(courseOf);
  const all = reviewList({ courses, progress, game, attempts });
  const session = reviewSession(all, SESSION_SIZE);
  const rest = all.length - session.length;
  const href = (x) => `#/exercise/${x.courseId}/${x.lessonId}/${x.exerciseId}`;

  const start = (e) => {
    state.review = { ids: session.map((x) => x.exerciseId) };
    feel('tap');
    // the link itself opens the first exercise; the session is remembered so "Next" follows the review list
    void e;
  };

  const node = h(
    'div',
    { class: 'view review' },
    h('a', { class: 'back', href: '#/learn' }, '← Home'),
    h('h1', null, 'Practise your mistakes'),
    all.length
      ? [
          katoSays('happy', 'These ones were tricky before. Try each one again. Fewer hints is a win!', { size: 60 }),
          h('a', { class: 'btn btn-primary btn-block', href: href(session[0]), onclick: start }, `Start: ${session.length} exercise${session.length === 1 ? '' : 's'}`),
          h('h2', { class: 'section-title' }, 'Today\'s practice'),
          session.map((x) => reviewCard(x, href(x), () => { state.review = { ids: session.map((s) => s.exerciseId) }; })),
          rest > 0 ? h('p', { class: 'muted' }, `${rest} more ${rest === 1 ? 'is' : 'are'} waiting. They will come up next.`) : null,
        ]
      : [
          katoSays('cheer', 'Nothing to practise right now. You are doing great. Keep learning!', { size: 60 }),
          h('p', { class: 'muted' }, 'When an exercise is hard (you use hints, look at a solution, or need many tries), it appears here so you can make it stronger later.'),
          h('a', { class: 'btn btn-primary btn-block', href: '#/learn' }, 'Back to learning'),
        ],
    Object.keys(game.fixed || {}).length ? h('p', { class: 'muted small' }, `Mistakes fixed so far: ${Object.keys(game.fixed).length}.`) : null,
  );
  return { node };
}

function reviewCard(x, link, onOpen) {
  const course = courses.find((c) => c.id === x.courseId);
  return h(
    'a',
    { class: 'card lesson-row review-card', href: link, style: `--course:${course ? metaOf(course).color : 'var(--accent)'}`, onclick: onOpen },
    h('span', { class: 'review-emoji', 'aria-hidden': 'true' }, KIND_EMOJI[x.kind] || '🔁'),
    h('div', { class: 'grow' }, h('h3', null, x.title), h('p', { class: 'muted small' }, x.reason), h('p', { class: 'muted small' }, x.courseTitle)),
    h('span', { class: 'chevron', 'aria-hidden': 'true' }, '›'),
  );
}

/** For the home screen: how many exercises are waiting. */
export async function reviewCount() {
  const { progress, game, attempts } = await loadStats(courseOf);
  return reviewList({ courses, progress, game, attempts }).length;
}
