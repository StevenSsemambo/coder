// "Show a solution": the reference solutions live in tests/ (each track keeps its own file). The app loads them
// only when a learner asks, as a separate chunk, so the first download stays small. The chunk is cached for offline use
// with the rest of the app.
//
// Nothing here changes any track's files: it only READS the merged `solutions` map from tests/solutions.mjs.
let loading = null;

async function loadMap() {
  loading = loading || import('../../tests/solutions.mjs').then((m) => m.solutions || {}).catch(() => ({}));
  return loading;
}

/** The reference solution for an exercise, or null when there is none to show. */
export async function getSolution(exercise) {
  if (typeof exercise.solution === 'string' && exercise.solution.trim()) return exercise.solution;
  const map = await loadMap();
  const code = map[exercise.id];
  return typeof code === 'string' && code.trim() ? code : null;
}
