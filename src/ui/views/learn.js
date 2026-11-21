import { h } from '../dom.js';
import { courses, courseProgress, getCourse, flatExercises } from '../../content/index.js';
import { state } from '../../state.js';
import { progressBar } from '../components.js';
import { katoSays, pickLine } from '../mascot.js';
import { feel } from '../feedback.js';
import { go } from '../router.js';
import { metaOf } from '../course-meta.js';
import { getProfile } from '../../lib/profile.js';
import { lessonFinished } from '../../lib/journey.js';
import { packBanner } from '../offline-ui.js';
import { installCard, backupReminder } from '../offline-ui.js';
import { reviewList } from '../../lib/review.js';
import { getLast, getResume } from '../../lib/storage.js';
import { loadStats, setDailyGoal, todayProgress, DAILY_GOALS, getGame } from '../../lib/game.js';
import { nextUp } from '../../lib/journey.js';
import { courseOf } from '../rewards.js';

const LANGUAGE_LABEL = { c: 'C', cpp: 'C++', cppfull: 'C++ (full)', python: 'Python', java: 'Java', web: 'Web', sql: 'SQL', php: 'PHP', cx: 'C' };
export const emojiOf = (course) => metaOf(course).emoji;

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

function reviewCard(n) {
  return h('a', { class: 'card review-home', href: '#/review', onclick: () => feel('tap') }, h('span', { class: 'review-emoji', 'aria-hidden': 'true' }, '🔁'), h('div', { class: 'grow' }, h('strong', null, 'Practise your mistakes'), h('p', { class: 'muted small' }, `${n} exercise${n === 1 ? '' : 's'} to make stronger`)), h('span', { class: 'chevron', 'aria-hidden': 'true' }, '›'));
}

export async function learnView() {
  const [{ stats, game, attempts }, last, resume, profile] = await Promise.all([loadStats(courseOf), getLast(), getResume(), getProfile()]);
  const brandNew = stats.passed === 0 && stats.lessonsDone === 0 && !last;
  // A brand-new learner meets Kato first and picks what to build (see views/welcome.js).
  if (brandNew && !profile.welcomed) {
    go('/welcome');
    return { node: h('div', { class: 'view' }) };
  }
  const up = nextUp({ courses, progress: state.progress, game, last, resume, startCourse: profile.startCourse });
  const waiting = reviewList({ courses, progress: state.progress, game, attempts }).length;

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

  // The course the learner will open next may need a one-time download (Python, PHP, Java): say so before they hit a wall.
  const needBanner = h('div', { class: 'banner-slot' });
  const nextCourse = up.courseId ? getCourse(up.courseId) : null;
  if (nextCourse) packBanner(nextCourse.language).then((b) => b && needBanner.append(b));

  // Nothing done yet: keep the screen calm (the goal only). Streak, stars and XP appear once there is something to show.
  const started = stats.passed + stats.lessonsDone > 0;
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
    katoSays(started ? 'cheer' : 'happy', pickLine(started ? 'back' : 'ready', stats.xp + stats.streak), { size: 64 }),
    continueCard(up),
    needBanner,
    started ? [dayHolder, waiting ? reviewCard(waiting) : null, status] : dayHolder,
    brandNew || stats.passed + stats.lessonsDone < 1 || profile.installDismissed ? null : installCard(),
    backupReminder(profile, stats),
    h('h2', { class: 'section-title' }, 'Courses'),
    courses.map((course) => {
      const p = courseProgress(course, state.progress);
      return h(
        'a',
        { class: 'card course', href: `#/course/${course.id}`, style: `--course:${metaOf(course).color}` },
        h('div', { class: 'course-top' }, h('span', { class: 'chip chip-course' }, `${metaOf(course).emoji} ${LANGUAGE_LABEL[course.language]}`), h('span', { class: 'muted small' }, `${p.done} of ${p.total} done`)),
        h('h3', null, course.title),
        h('p', { class: 'muted course-sub' }, metaOf(course).tagline || course.subtitle),
        progressBar(p.fraction),
      );
    }),
  );
  return { node };
}

export async function courseView(courseId) {
  const course = getCourse(courseId);
  if (!course) return { node: h('div', { class: 'view' }, h('p', null, 'Course not found.')) };
  const meta = metaOf(course);
  const game = await getGame();
  const p = courseProgress(course, state.progress);
  const finished = course.lessons.map((l) => lessonFinished(game, state.progress, course.id, l));
  const currentIndex = finished.indexOf(false); // the first lesson not finished: "you are here" (nothing is ever locked)
  const up = currentIndex >= 0 ? course.lessons[currentIndex] : null;

  // group lessons by level, keeping the order of the course
  const groups = [];
  course.lessons.forEach((lesson, i) => {
    const name = lesson.level || 'Lessons';
    if (!groups.length || groups[groups.length - 1].name !== name) groups.push({ name, items: [] });
    groups[groups.length - 1].items.push({ lesson, i });
  });

  const node = h(
    'div',
    { class: 'view course-page', style: `--course:${meta.color}` },
    h('a', { class: 'back', href: '#/learn' }, '← All courses'),
    h(
      'div',
      { class: 'course-hero' },
      h('div', { class: 'course-hero-top' }, h('span', { class: 'course-hero-emoji', 'aria-hidden': 'true' }, meta.emoji), h('div', { class: 'grow' }, h('h1', null, course.title), meta.tagline ? h('p', { class: 'course-hero-tag' }, meta.tagline) : null)),
      h('div', { class: 'hero-bar' }, progressBar(p.fraction)),
      h('p', { class: 'course-hero-stat' }, `${p.done} of ${p.total} exercises · ${finished.filter(Boolean).length} of ${course.lessons.length} lessons`),
      up ? h('a', { class: 'btn btn-light btn-block', href: `#/lesson/${course.id}/${up.id}` }, finished.some(Boolean) || p.done ? 'Continue: ' + up.title : 'Start: ' + up.title) : h('p', { class: 'course-hero-tag' }, '🎉 You finished this course!'),
    ),
    course.subtitle ? h('details', { class: 'about-course' }, h('summary', null, 'About this course'), h('p', { class: 'muted' }, course.subtitle)) : null,
    groups.map((g) => {
      const done = g.items.filter(({ i }) => finished[i]).length;
      return h(
        'section',
        { class: 'path-level' },
        h('div', { class: 'path-flag' }, h('strong', null, g.name), h('span', { class: 'path-count' }, `${done}/${g.items.length}`)),
        h(
          'ol',
          { class: 'path' },
          g.items.map(({ lesson, i }) => {
            const state2 = finished[i] ? 'done' : i === currentIndex ? 'current' : 'open';
            const ex = lesson.exercises.filter((e) => state.progress[e.id]?.passed).length;
            return h(
              'li',
              { class: `path-node ${state2}` },
              h('a', { class: 'path-link', href: `#/lesson/${course.id}/${lesson.id}`, 'aria-label': `${lesson.title}${state2 === 'done' ? ', finished' : state2 === 'current' ? ', up next' : ''}` }, h('span', { class: 'path-dot', 'aria-hidden': 'true' }, state2 === 'done' ? '✓' : String(i + 1)), h('div', { class: 'path-card' }, state2 === 'current' ? h('span', { class: 'you-are-here' }, 'You are here') : null, h('h3', null, lesson.title), h('p', { class: 'muted small' }, lesson.summary), h('span', { class: `chip ${ex === lesson.exercises.length && lesson.exercises.length ? 'chip-ok' : ''}` }, `${ex}/${lesson.exercises.length} exercises`))),
            );
          }),
        ),
      );
    }),
  );
  void flatExercises;
  return { node };
}
