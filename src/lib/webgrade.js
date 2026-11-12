// Turns a web exercise into a list of checks, and raw check results into the shape the app already uses.
// Pure functions: the same code runs in the browser and in the test-suite.

/** All checks for an exercise. A JavaScript exercise always starts with "runs without errors". */
export function checkList(ex) {
  const list = [...ex.checks];
  if (ex.files.includes('js')) list.unshift({ noErrors: true });
  return list;
}

/** Same fields the grader returns for C and Python, plus `detail` for each case. */
export function shapeResults(results, { runtimeError = null, timedOut = false } = {}) {
  const cases = results.map((r) => ({ name: r.label, passed: r.passed, hidden: r.hidden, detail: r.detail }));
  const passedCount = cases.filter((c) => c.passed).length;
  return {
    passed: cases.length > 0 && passedCount === cases.length,
    passedCount,
    total: cases.length,
    cases,
    timedOut,
    initFailed: false,
    firstError: runtimeError,
  };
}

export const emptyFiles = () => ({ html: '', css: '', js: '' });

/** Files object for an exercise or block: every file the starter names, and nothing else. */
export function filesFrom(source = {}) {
  return { ...emptyFiles(), ...source };
}

export const FILE_NAMES = { html: 'index.html', css: 'style.css', js: 'script.js' };
