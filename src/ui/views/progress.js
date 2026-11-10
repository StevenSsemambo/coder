import { h } from '../dom.js';
import { courses, courseProgress, flatExercises } from '../../content/index.js';
import { getStreak, getRecentAttempts, getProgress } from '../../lib/storage.js';
import { state } from '../../state.js';
import { progressBar } from '../components.js';

const titleOf = new Map(courses.flatMap((c) => flatExercises(c)).map((e) => [e.id, e.title]));

function timeAgo(ms) {
  const mins = Math.round((Date.now() - ms) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} h ago`;
  return `${Math.round(hours / 24)} d ago`;
}

export async function progressView() {
  state.progress = await getProgress();
  const [streak, recent] = await Promise.all([getStreak(), getRecentAttempts(8)]);
  const totalDone = Object.values(state.progress).filter((p) => p.passed).length;
  const totalAll = courses.reduce((n, c) => n + flatExercises(c).length, 0);

  const stat = (value, label) => h('div', { class: 'stat' }, h('div', { class: 'stat-value' }, String(value)), h('div', { class: 'muted small' }, label));

  const node = h(
    'div',
    { class: 'view' },
    h('h1', null, 'Your progress'),
    h('div', { class: 'stats' }, stat(streak.current, streak.current === 1 ? 'day streak' : 'day streak'), stat(`${totalDone}/${totalAll}`, 'exercises done'), stat(streak.totalDays, 'days practised')),
    streak.current > 0 && !streak.activeToday ? h('p', { class: 'tip' }, 'Do one exercise today to keep your streak going.') : null,
    h('h2', { class: 'section-title' }, 'Courses'),
    courses.map((c) => {
      const p = courseProgress(c, state.progress);
      return h('div', { class: 'card' }, h('div', { class: 'course-top' }, h('h3', null, c.title), h('span', { class: 'muted small' }, `${p.done}/${p.total}`)), progressBar(p.fraction));
    }),
    h('h2', { class: 'section-title' }, 'Recent attempts'),
    recent.length
      ? h(
          'ul',
          { class: 'attempts' },
          recent.map((a) =>
            h(
              'li',
              { class: 'card attempt' },
              h('span', { class: `status-dot ${a.passed ? 'done' : ''}`, 'aria-hidden': 'true' }, a.passed ? '✓' : ''),
              h('div', { class: 'grow' }, h('strong', null, titleOf.get(a.exerciseId) || a.exerciseId), h('p', { class: 'muted small' }, `${a.passedCount}/${a.total} tests, ${timeAgo(a.at)}`)),
            ),
          ),
        )
      : h('p', { class: 'muted' }, 'No attempts yet. Open a lesson and try an exercise.'),
    h('p', { class: 'muted small' }, 'Your progress is saved on this phone only.'),
  );
  return { node };
}
