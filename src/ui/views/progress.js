import { h } from '../dom.js';
import { courses, courseProgress, flatExercises } from '../../content/index.js';
import { getRecentAttempts, getProgress } from '../../lib/storage.js';
import { state } from '../../state.js';
import { progressBar } from '../components.js';
import { loadStats, BADGES } from '../../lib/game.js';
import { courseOf } from '../rewards.js';
import { kato } from '../mascot.js';
import { emojiOf } from './learn.js';

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
  const [{ stats, game }, recent] = await Promise.all([loadStats(courseOf), getRecentAttempts(8)]);
  const totalAll = courses.reduce((n, c) => n + flatExercises(c).length, 0);
  const lv = stats.level;

  const stat = (value, label) => h('div', { class: 'stat' }, h('div', { class: 'stat-value' }, String(value)), h('div', { class: 'muted small' }, label));
  const earned = BADGES.filter((b) => game.badges && game.badges[b.id]);

  const node = h(
    'div',
    { class: 'view' },
    h('h1', null, 'Your progress'),
    h(
      'div',
      { class: 'card level-card' },
      h('div', { class: 'kato-wrap', 'aria-hidden': 'true' }, kato(stats.passed ? 'cheer' : 'happy', 64)),
      h('div', { class: 'grow' }, h('div', { class: 'label' }, 'Your level'), h('h2', null, `Level ${lv.level}: ${lv.title}`), progressBar(lv.pct / 100), h('p', { class: 'muted small' }, `${lv.xp} XP · ${lv.span - lv.into} XP to the next level`)),
    ),
    h('div', { class: 'stats stats-4' }, stat(stats.streak, 'day streak'), stat(stats.stars, 'stars'), stat(`${stats.passed}/${totalAll}`, 'exercises'), stat(stats.lessonsDone, 'lessons')),
    stats.streak > 0 && !stats.activeToday ? h('p', { class: 'tip' }, 'Do one exercise today to keep your streak going.') : null,
    h('h2', { class: 'section-title' }, `Badges · ${earned.length} of ${BADGES.length}`),
    h(
      'div',
      { class: 'badges' },
      BADGES.map((b) => {
        const has = Boolean(game.badges && game.badges[b.id]);
        return h('div', { class: `badge ${has ? 'earned' : ''}`, title: b.desc }, h('span', { class: 'badge-icon', 'aria-hidden': 'true' }, has ? b.icon : '🔒'), h('strong', null, b.title), h('span', { class: 'muted small' }, b.desc));
      }),
    ),
    h('h2', { class: 'section-title' }, 'Courses'),
    courses.map((c) => {
      const p = courseProgress(c, state.progress);
      return h('div', { class: 'card' }, h('div', { class: 'course-top' }, h('h3', null, `${emojiOf(c)} ${c.title}`), h('span', { class: 'muted small' }, `${p.done}/${p.total}`)), progressBar(p.fraction));
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
