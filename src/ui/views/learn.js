import { h } from '../dom.js';
import { courses, courseProgress, getCourse, flatExercises } from '../../content/index.js';
import { state } from '../../state.js';
import { progressBar } from '../components.js';
import { katoSays, pickLine } from '../mascot.js';
import { feel } from '../feedback.js';
import { getLast, getResume } from '../../lib/storage.js';
import { loadStats, setDailyGoal, todayProgress, DAILY_GOALS } from '../../lib/game.js';
import { nextUp } from '../../lib/journey.js';
import { courseOf } from '../rewards.js';

const LANGUAGE_LABEL = { c: 'C', cpp: 'C++', cppfull: 'C++ (full)', python: 'Python', java: 'Java', web: 'Web', sql: 'SQL', php: 'PHP', cx: 'C' };
// A friendly picture for each language. A course can set its own `emoji` later; this is only the default.
const LANGUAGE_EMOJI = { c: '⚙️', cx: '🧩', cpp: '🚀', cppfull: '🚀', python: '🐍', java: '☕', web: '🌐', sql: '🗄️', php: '🐘' };
export const emojiOf = (course) => course.emoji || LANGUAGE_EMOJI[course.language] || '💻';

/** The big "what should I do next?" card. */
function continueCard(up) {
  if (up.type === 'done') {
    return h('div', { class: 'card continue done' }, h('h2', null, 'You finished everything!'), h('p', { class: 'muted' }, 'Every lesson and exercise is done. Pick any course to practise again.'));
  }
  const course = getCourse(up.courseId);
  const lesson = course.lessons.find((l) => l.id === up.lessonId);
  let href = `#/lesson/${course.id}/${lesson.id}`;
  let label = 'Continue';
  let line = lesson.title;
  let small = `${course.title}`;
  if (up.type === 'start') {
    label = 'Start here';
    small = `${course.title}`;
  } else if (up.type === 'resume') {
    small = up.step > 0 ? `${course.title} · step ${up.step + 1}` : course.title;
  } else if (up.type === 'exercise') {
    const ex = lesson.exercises.find((e) => e.id === up.exerciseId);
    href = `#/exercise/${course.id}/${lesson.id}/${ex.id}`;
    label = 'Next exercise';
    line = ex.title;
    small = `${course.title} · ${lesson.title}`;
  } else if (up.type === 'lesson') {
    label = 'Next lesson';
  }
  return h(
    'a',
    { class: 'card continue', href, onclick: () => feel('tap') },
    h('span', { class: 'continue-emoji', 'aria-hidden': 'true' }, emojiOf(course)),
    h('div', { class: 'grow' }, h('div', { class: 'label' }, label), h('h2', null, line), h('p', { class: 'muted small' }, small)),
    h('span', { class: 'continue-go', 'aria-hidden': 'true' }, '▶'),
  );
}

function dailyCard(day, goalControl) {
  return h(
    'div',
    { class: 'card daily' },
    h('div', { class: 'course-top' }, h('strong', null, day.reached ? '🎯 Daily goal reached!' : 'Today'), goalControl),
    progressBar(day.pct / 100),
    h('p', { class: 'muted small' }, day.reached ? 'Well done. Anything more today is a bonus.' : `${Math.min(day.done, day.goal)} of ${day.goal} done. Finish an exercise or a lesson.`),
  );
}

export async function learnView() {
  const [{ stats, game, attempts }, last, resume] = await Promise.all([loadStats(courseOf), getLast(), getResume()]);
  const up = nextUp({ courses, progress: state.progress, game, last, resume });
  const brandNew = stats.passed === 0 && stats.lessonsDone === 0 && !last;

  let day = todayProgress({ attempts, game });
  const dayHolder = h('div', null);
  const goalBtn = h('button', { class: 'chip goal-chip', type: 'button', 'aria-label': 'Change your daily goal' }, `Goal: ${day.goal} a day`);
  const drawDay = () => {
    goalBtn.textContent = `Goal: ${day.goal} a day`;
    dayHolder.replaceChildren(dailyCard(day, goalBtn));
  };
  goalBtn.addEventListener('click', async () => {
    const nextGoal = DAILY_GOALS[(DAILY_GOALS.indexOf(day.goal) + 1) % DAILY_GOALS.length];
    await setDailyGoal(nextGoal);
    day = todayProgress({ attempts, game: { ...game, goal: nextGoal } });
    feel('tap');
    drawDay();
  });
  drawDay();

  const lv = stats.level;
  const status = h(
    'div',
    { class: 'card status' },
    h('div', { class: 'status-row' }, h('div', { class: 'stat-pill' }, h('span', { 'aria-hidden': 'true' }, '🔥'), h('strong', null, String(stats.streak)), h('span', { class: 'muted small' }, stats.streak === 1 ? 'day streak' : 'day streak')), h('div', { class: 'stat-pill' }, h('span', { 'aria-hidden': 'true' }, '⭐'), h('strong', null, String(stats.stars)), h('span', { class: 'muted small' }, 'stars')), h('div', { class: 'stat-pill' }, h('span', { 'aria-hidden': 'true' }, '⚡'), h('strong', null, String(stats.xp)), h('span', { class: 'muted small' }, 'XP'))),
    h('div', { class: 'levelbar-top' }, h('strong', null, `Level ${lv.level}`), h('span', { class: 'muted small' }, lv.title)),
    progressBar(lv.pct / 100),
  );

  const node = h(
    'div',
    { class: 'view home' },
    katoSays(brandNew ? 'happy' : 'cheer', pickLine(brandNew ? 'welcome' : 'back', stats.xp + stats.streak), { size: 64 }),
    continueCard(up),
    brandNew ? null : [dayHolder, status],
    h('h2', { class: 'section-title' }, 'Courses'),
    courses.map((course) => {
      const p = courseProgress(course, state.progress);
      return h(
        'a',
        { class: 'card course', href: `#/course/${course.id}` },
        h('div', { class: 'course-top' }, h('span', { class: 'chip chip-accent' }, `${emojiOf(course)} ${LANGUAGE_LABEL[course.language]}`), h('span', { class: 'muted small' }, `${p.done} of ${p.total} done`)),
        h('h3', null, course.title),
        course.tagline ? h('p', { class: 'muted' }, course.tagline) : h('p', { class: 'muted course-sub' }, course.subtitle),
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
    h('h1', null, `${emojiOf(course)} ${course.title}`),
    h('p', { class: 'muted' }, course.subtitle),
    course.lessons.map((lesson, i) => {
      const done = lesson.exercises.filter((e) => state.progress[e.id]?.passed).length;
      const startsLevel = lesson.level && lesson.level !== course.lessons[i - 1]?.level;
      const row = h(
        'a',
        { class: 'card lesson-row', href: `#/lesson/${course.id}/${lesson.id}` },
        h('span', { class: 'lesson-num' }, String(i + 1)),
        h('div', { class: 'grow' }, h('h3', null, lesson.title), h('p', { class: 'muted small' }, lesson.summary)),
        h('span', { class: `chip ${done === lesson.exercises.length ? 'chip-ok' : ''}` }, `${done}/${lesson.exercises.length}`),
      );
      return startsLevel ? [h('h2', { class: 'section-title' }, lesson.level), row] : row;
    }),
  );
  // referenced so bundlers keep the helper import used for future logic
  void flatExercises;
  return { node };
}
