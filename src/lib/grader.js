// On-device auto-grader. Pure logic: the caller supplies a `run(input)` function,
// so the same grader works in the browser (Web Workers) and in Node tests.

/** Compare outputs ignoring trailing spaces on each line and trailing blank lines. */
export function normalizeOutput(text) {
  return String(text ?? '')
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.replace(/\s+$/, ''))
    .join('\n')
    .replace(/\n+$/, '');
}

/**
 * Run every test of an exercise.
 * @param exercise  { tests: [{ name?, input?, expected, hidden? }] }
 * @param run       (input: string) => Promise<{ stdout, error, timedOut, initFailed }>
 */
export async function gradeExercise(exercise, run) {
  const cases = [];
  let firstError = null;
  let stopped = false;

  for (const [index, test] of exercise.tests.entries()) {
    const name = test.name ?? `Test ${index + 1}`;
    const base = { name, hidden: !!test.hidden, input: test.input ?? '', expected: normalizeOutput(test.expected) };

    if (stopped) {
      cases.push({ ...base, passed: false, skipped: true, actual: '', error: null, timedOut: false });
      continue;
    }

    const res = await run(test.input ?? '');
    if (res.initFailed) return { initFailed: true, message: res.error, cases: [], passedCount: 0, total: exercise.tests.length, passed: false };

    const actual = normalizeOutput(res.stdout);
    const passed = !res.error && !res.timedOut && actual === base.expected;
    if (res.error && !firstError) firstError = res.error;
    cases.push({ ...base, passed, actual, error: res.error || null, timedOut: !!res.timedOut });

    // A timeout restarts the runtime (slow), so do not repeat it for every remaining test.
    if (res.timedOut) stopped = true;
  }

  const passedCount = cases.filter((c) => c.passed).length;
  return {
    initFailed: false,
    cases,
    passedCount,
    total: cases.length,
    passed: cases.length > 0 && passedCount === cases.length,
    firstError,
  };
}
