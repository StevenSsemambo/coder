// Connects the game rules (src/lib/game.js) to the screen: when something is won, work out the reward and celebrate it.
import { allCourses } from '../content/index.js';
import { rewardExercise, rewardLesson, rewardFix, loadStats } from '../lib/game.js';
import { troubleOf, reviewList, reviewSession } from '../lib/review.js';
import { state } from '../state.js';
import { showCelebration } from './celebrate.js';
import { feel } from './feedback.js';

let owner = null;
/** Which course an exercise belongs to (built once). */
export function courseOf(exerciseId) {
  if (!owner) owner = new Map(allCourses.flatMap((c) => c.lessons.flatMap((l) => l.exercises.map((e) => [e.id, c.id]))));
  return owner.get(exerciseId) || null;
}

const nextAfter = (courseId, exerciseId) => {
  const course = allCourses.find((c) => c.id === courseId);
  if (!course) return null;
  const list = course.lessons.flatMap((l) => l.exercises.map((e) => ({ ...e, lessonId: l.id })));
  const i = list.findIndex((e) => e.id === exerciseId);
  return i >= 0 && i < list.length - 1 ? list[i + 1] : null;
};

const HEADLINE = { 1: 'You solved it!', 2: 'Nice work!', 3: 'Perfect!' };
const KIND = { 1: 'Every solved exercise makes you stronger.', 2: 'Just one hint. Very good.', 3: 'No hints at all. Brilliant.' };

/** Called for every graded attempt (see the `saymacoder:attempt` event in storage.js). */
export async function onAttempt(detail) {
  if (!detail.passed) return;
  try {
    // Was this exercise on the "practise your mistakes" list BEFORE this attempt? A clean pass now fixes it.
    let wasHard = null;
    if (!detail.firstPass && !detail.hintsUsed) {
      const { progress, game, attempts } = await loadStats(courseOf);
      wasHard = troubleOf({ exerciseId: detail.exerciseId, progress, game, attempts: attempts.filter((a) => a.at !== detail.at) });
    }
    const r = await rewardExercise({ exerciseId: detail.exerciseId, firstPass: detail.firstPass, hintsUsed: detail.hintsUsed, courseOf });
    if (!r.firstPass) {
      if (wasHard) return celebrateFix(detail);
      feel('ok');
      return;
    }
    const next = nextAfter(detail.courseId, detail.exerciseId);
    const course = allCourses.find((c) => c.id === detail.courseId);
    const lessonId = course?.lessons.find((l) => l.exercises.some((e) => e.id === detail.exerciseId))?.id;
    showCelebration({
      title: HEADLINE[r.stars] || 'You solved it!',
      sub: KIND[r.stars],
      stars: r.stars,
      xpGained: r.xpGained,
      levelUp: r.levelUp,
      badges: r.badges,
      daily: r.daily,
      stats: r.stats,
      primary: next ? { label: `Next: ${next.title}`, href: `#/exercise/${detail.courseId}/${next.lessonId}/${next.id}` } : { label: 'Back to the lesson', href: `#/lesson/${detail.courseId}/${lessonId}` },
    });
  } catch (e) {
    console.warn('[SayMaCoder] reward failed', e); // rewards are extras: never break learning
  }
}

/** Called when a learner reaches the end of a lesson's steps. Returns the reward (or null if it was not the first time). */
export async function onLessonReached(courseId, lessonId, { firstExercise } = {}) {
  try {
    const r = await rewardLesson({ courseId, lessonId, courseOf });
    if (!r.first) return null;
    showCelebration({
      title: 'Lesson complete!',
      sub: 'You read every step. Now practise what you learned.',
      xpGained: r.xpGained,
      levelUp: r.levelUp,
      badges: r.badges,
      daily: r.daily,
      stats: r.stats,
      primary: firstExercise ? { label: 'Start practising', href: `#/exercise/${courseId}/${lessonId}/${firstExercise.id}` } : { label: 'Continue', run: () => {} },
    });
    return r;
  } catch (e) {
    console.warn('[SayMaCoder] lesson reward failed', e);
    return null;
  }
}

/** The next exercise in the current review session, or null when there is none (then Kato sends the learner to the review screen). */
export function nextInReview(exerciseId) {
  const ids = state.review?.ids;
  if (!ids) return null;
  const i = ids.indexOf(exerciseId);
  return i >= 0 && i < ids.length - 1 ? ids[i + 1] : null;
}

async function celebrateFix(detail) {
  const r = await rewardFix({ exerciseId: detail.exerciseId, courseOf });
  if (!r.fixed) {
    feel('ok');
    return;
  }
  const nextId = nextInReview(detail.exerciseId);
  const nextEx = nextId ? findExercise(nextId) : null;
  showCelebration({
    title: 'Mistake fixed!',
    sub: 'You solved it on your own this time. That is how coders get strong.',
    xpGained: r.xpGained,
    levelUp: r.levelUp,
    badges: r.badges,
    stats: r.stats,
    primary: nextEx ? { label: `Next: ${nextEx.title}`, href: `#/exercise/${nextEx.courseId}/${nextEx.lessonId}/${nextEx.id}` } : { label: 'Back to review', href: '#/review' },
  });
}

function findExercise(id) {
  for (const c of allCourses) for (const l of c.lessons) for (const e of l.exercises) if (e.id === id) return { ...e, courseId: c.id, lessonId: l.id };
  return null;
}

export { reviewList, reviewSession };
