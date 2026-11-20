// The game layer: stars, XP, levels, badges, streaks and the daily goal.
//
// Design rules (see docs/PRODUCT.md):
//   * Everything is DERIVED from data the app already keeps (`progress`, `days`, `attempts`) plus a small `game` record
//     (lessons finished, badges earned, solutions looked at, daily goal). Nothing needs migrating: a learner's past work
//     counts the moment this ships, and nothing can get out of step.
//   * The rules here are pure functions (no DOM, no storage) so they are easy to test and to tune.
//   * Rewards are about PROGRESS and effort, never about speed or comparing people.
import { kvGet, kvSet, dayKey } from './storage.js';

// ---- the rules ---------------------------------------------------------------------------------------------------
export const XP = { exercise: 10, extraStar: 5, lesson: 20 };
export const DAILY_GOALS = [1, 2, 3];
export const DEFAULT_DAILY_GOAL = 1;

/** 3 stars for no hints, 2 for one hint, 1 for two or more hints (or after looking at the solution). */
export function starsOf(hintsUsed = 0, usedSolution = false) {
  if (usedSolution) return 1;
  return Math.max(1, 3 - Math.min(2, Math.max(0, hintsUsed)));
}
/** XP for passing an exercise for the first time: 10, 15 or 20. */
export const exerciseXp = (stars) => XP.exercise + XP.extraStar * (Math.min(3, Math.max(1, stars)) - 1);

export const LEVEL_TITLES = ['Curious Beginner', 'Code Explorer', 'Bug Hunter', 'Builder', 'Problem Solver', 'Debugger', 'Architect', 'Engineer', 'Master Builder', 'Legend'];
/** XP needed to REACH a level: 0, 25, 100, 225, 400, 625 ... */
export const xpForLevel = (level) => 25 * (level - 1) * (level - 1);

export function levelInfo(xp) {
  const level = Math.floor(Math.sqrt(Math.max(0, xp) / 25)) + 1;
  const floor = xpForLevel(level);
  const next = xpForLevel(level + 1);
  return { level, title: LEVEL_TITLES[Math.min(level, LEVEL_TITLES.length) - 1], xp, into: xp - floor, span: next - floor, next, pct: Math.round(((xp - floor) / (next - floor)) * 100) };
}

/** Consecutive active days, ending today or yesterday (a streak survives until the end of tomorrow). */
export function streakOf(days = [], now = new Date()) {
  const set = new Set(days);
  const cursor = new Date(now);
  const activeToday = set.has(dayKey(cursor));
  if (!activeToday) cursor.setDate(cursor.getDate() - 1);
  let current = 0;
  while (set.has(dayKey(cursor))) {
    current += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return { current, activeToday, totalDays: set.size };
}

// ---- stats: everything the badges and the screens need, derived in one place ----------------------------------
export function computeStats({ progress = {}, game = {}, days = [], courseOf = () => null, now = new Date() } = {}) {
  const passedEntries = Object.entries(progress).filter(([, e]) => e && e.passed);
  let stars = 0;
  let perfect = 0;
  let xp = 0;
  const courses = new Set();
  for (const [id, e] of passedEntries) {
    const s = starsOf(e.hintsAtFirstPass ?? 0, Boolean(game.solutions && game.solutions[id]));
    stars += s;
    if (s === 3) perfect += 1;
    xp += exerciseXp(s);
    const course = courseOf(id);
    if (course) courses.add(course);
  }
  const lessonsDone = Object.keys(game.lessons || {}).length;
  xp += lessonsDone * XP.lesson;
  const streak = streakOf(days, now);
  return { passed: passedEntries.length, stars, perfect, lessonsDone, courses: courses.size, xp, level: levelInfo(xp), streak: streak.current, activeToday: streak.activeToday, totalDays: streak.totalDays };
}

// ---- badges ------------------------------------------------------------------------------------------------------
export const BADGES = [
  { id: 'first-run', icon: '🌱', title: 'First program', desc: 'Pass your first exercise.', test: (s) => s.passed >= 1 },
  { id: 'ten', icon: '🔟', title: 'Ten down', desc: 'Pass 10 exercises.', test: (s) => s.passed >= 10 },
  { id: 'fifty', icon: '🏅', title: 'Fifty strong', desc: 'Pass 50 exercises.', test: (s) => s.passed >= 50 },
  { id: 'hundred', icon: '🏆', title: 'The hundred', desc: 'Pass 100 exercises.', test: (s) => s.passed >= 100 },
  { id: 'first-lesson', icon: '📖', title: 'First lesson', desc: 'Finish your first lesson.', test: (s) => s.lessonsDone >= 1 },
  { id: 'ten-lessons', icon: '📚', title: 'Bookworm', desc: 'Finish 10 lessons.', test: (s) => s.lessonsDone >= 10 },
  { id: 'no-hints', icon: '⭐', title: 'On your own', desc: 'Pass 5 exercises with 3 stars (no hints).', test: (s) => s.perfect >= 5 },
  { id: 'streak-3', icon: '🔥', title: 'On fire', desc: 'Practise 3 days in a row.', test: (s) => s.streak >= 3 },
  { id: 'streak-7', icon: '🌟', title: 'A full week', desc: 'Practise 7 days in a row.', test: (s) => s.streak >= 7 },
  { id: 'streak-30', icon: '👑', title: 'Unstoppable', desc: 'Practise 30 days in a row.', test: (s) => s.streak >= 30 },
  { id: 'polyglot', icon: '🌍', title: 'Polyglot', desc: 'Pass exercises in 3 different languages.', test: (s) => s.courses >= 3 },
  { id: 'level-5', icon: '🚀', title: 'Level 5', desc: 'Reach level 5.', test: (s) => s.level.level >= 5 },
];
export const badgeById = (id) => BADGES.find((b) => b.id === id);

/** Badges whose test passes now but that were not earned before. */
export function newBadges(stats, game = {}) {
  return BADGES.filter((b) => b.test(stats) && !(game.badges && game.badges[b.id]));
}

// ---- the daily goal ----------------------------------------------------------------------------------------------
/** How many things were finished today: distinct exercises passed, plus lessons finished. */
export function todayProgress({ attempts = [], game = {}, now = new Date() } = {}) {
  const today = dayKey(now);
  const exercises = new Set(attempts.filter((a) => a.passed && dayKey(a.at) === today).map((a) => a.exerciseId));
  const lessons = Object.values(game.lessons || {}).filter((at) => dayKey(at) === today).length;
  const goal = DAILY_GOALS.includes(game.goal) ? game.goal : DEFAULT_DAILY_GOAL;
  const done = exercises.size + lessons;
  return { done, goal, reached: done >= goal, pct: Math.min(100, Math.round((done / goal) * 100)) };
}

// ---- persistence -------------------------------------------------------------------------------------------------
export const getGame = async () => ({ lessons: {}, badges: {}, solutions: {}, goal: DEFAULT_DAILY_GOAL, ...(await kvGet('game', {})) });
const saveGame = (game) => kvSet('game', game);

export async function setDailyGoal(goal) {
  const game = await getGame();
  game.goal = DAILY_GOALS.includes(goal) ? goal : DEFAULT_DAILY_GOAL;
  await saveGame(game);
  return game.goal;
}

export async function markSolutionUsed(exerciseId) {
  const game = await getGame();
  game.solutions[exerciseId] = true;
  await saveGame(game);
}

/** Load everything the rules need, from storage. `courseOf` maps an exercise id to its course id. */
export async function loadStats(courseOf, now = new Date()) {
  const [progress, game, days, attempts] = await Promise.all([kvGet('progress', {}), getGame(), kvGet('days', []), kvGet('attempts', [])]);
  return { stats: computeStats({ progress, game, days, courseOf, now }), game, progress, days, attempts };
}

/** Award any badges that are now earned, remember them, and return them. */
async function grantBadges(stats, game, now) {
  const fresh = newBadges(stats, game);
  if (fresh.length) {
    for (const b of fresh) game.badges[b.id] = now;
    await saveGame(game);
  }
  return fresh;
}

/**
 * Call right after a graded exercise was recorded (see recordAttempt). Returns what to celebrate:
 *   { firstPass, stars, xpGained, levelUp, badges, daily }
 * Only a FIRST pass earns XP, stars and badges; repeats are free practice.
 */
export async function rewardExercise({ exerciseId, firstPass, hintsUsed = 0, usedSolution = false, courseOf, now = new Date() }) {
  const { stats, game, attempts } = await loadStats(courseOf, now);
  const daily = todayProgress({ attempts, game, now });
  if (!firstPass) return { firstPass: false, stars: 0, xpGained: 0, levelUp: null, badges: [], daily, stats };
  const stars = starsOf(hintsUsed, usedSolution || Boolean(game.solutions[exerciseId]));
  const xpGained = exerciseXp(stars);
  const before = levelInfo(stats.xp - xpGained).level;
  const badges = await grantBadges(stats, game, +now);
  return { firstPass: true, stars, xpGained, levelUp: stats.level.level > before ? stats.level : null, badges, daily, stats };
}

/** Call when a learner reaches the end of a lesson. Only the first time earns XP. */
export async function rewardLesson({ courseId, lessonId, courseOf, now = new Date() }) {
  const game = await getGame();
  const key = `${courseId}/${lessonId}`;
  const first = !game.lessons[key];
  if (first) {
    game.lessons[key] = +now;
    await saveGame(game);
  }
  const { stats, attempts } = await loadStats(courseOf, now);
  const daily = todayProgress({ attempts, game: { ...game, lessons: { ...game.lessons } }, now });
  if (!first) return { first: false, xpGained: 0, levelUp: null, badges: [], daily, stats };
  const before = levelInfo(stats.xp - XP.lesson).level;
  const badges = await grantBadges(stats, await getGame(), +now);
  return { first: true, xpGained: XP.lesson, levelUp: stats.level.level > before ? stats.level : null, badges, daily, stats };
}

export const isLessonDone = (game, courseId, lessonId) => Boolean(game.lessons && game.lessons[`${courseId}/${lessonId}`]);
