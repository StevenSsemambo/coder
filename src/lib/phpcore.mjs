// SayMaCoder PHP core: shared by the browser worker (public/workers/php.worker.js, bundled by
// scripts/prepare-runtimes.mjs) and by the Node tests, so what the tests prove is what ships.
//
// The PHP runtime is real PHP 8.3 compiled to WebAssembly (WordPress Playground's @php-wasm).
// Facts this file works around (each was seen in a test, see docs/PHP-TRACK.md):
//   - a fatal or parse error makes php.run() throw; the text printed so far is in error.response.text
//   - errors are HTML unless html_errors=0 is set in /internal/shared/php.ini
//   - STDIN is not defined and php://stdin is empty, so input is written to a file and STDIN is defined by a wrapper
//   - the learner's file is included (not eval'd), so line numbers in messages are the learner's own

export const MAX_OUTPUT = 20000; // characters; stops runaway echo loops from eating memory
export const PHP_INI_PATH = '/internal/shared/php.ini';
const WORK_DIR = '/tmp/work';
// The learner's file and input live outside WORK_DIR, so `scandir('.')` shows only what the learner made.
const MAIN_FILE = '/tmp/sm/main.php';
const INPUT_FILE = '/tmp/sm/stdin.txt';

// What a learner's program sees. Notes: no display of HTML in errors, every notice and warning is shown
// (a beginner should see them), no error log copy on stderr, and a fixed time zone so date() is predictable.
export const PHP_INI = [
  'html_errors=0',
  'display_errors=1',
  'display_startup_errors=1',
  'error_reporting=E_ALL',
  'log_errors=0',
  'date.timezone=Africa/Kampala',
  'memory_limit=128M',
  'precision=14',
  'serialize_precision=-1',
].join('\n');

// Runs first, defines STDIN, then includes the learner's file.
const WRAPPER = `<?php
define('STDIN', fopen('${INPUT_FILE}', 'r'));
define('STDOUT', fopen('php://output', 'w'));
define('STDERR', fopen('php://output', 'w'));
include '${MAIN_FILE}';
`;

/** Create a PHP instance. `loadRuntime` returns the runtime id (node: loadNodeRuntime, browser: loadWebRuntime). */
export async function createPhp({ PHP, loadRuntime }) {
  const php = new PHP(await loadRuntime());
  php.writeFile(PHP_INI_PATH, PHP_INI);
  return php;
}

function cleanWorkDir(php) {
  try {
    if (php.fileExists(WORK_DIR)) php.rmdir(WORK_DIR, { recursive: true });
  } catch {
    /* a stale folder is not worth failing a run */
  }
  php.mkdir(WORK_DIR);
  if (!php.fileExists('/tmp/sm')) php.mkdir('/tmp/sm');
}

// PHP prints "\nWarning: message in /tmp/work/main.php on line 3\n". Learners should see their own file name.
// The wrapper's own stack frame ("#0 /internal/eval.php(4): include('/tmp/sm/main.php')") is removed and the rest renumbered.
function tidy(text) {
  let out = text.replace(/^#\d+ \/internal\/eval\.php\(\d+\): include\(.*\)\n/gm, '');
  out = out.replaceAll(MAIN_FILE, 'main.php').replaceAll('/internal/eval.php', 'main.php');
  // renumber each "Stack trace:" block from #0
  return out.replace(/Stack trace:\n((?:#\d+ .*\n?)+)/g, (_, block) => {
    let n = 0;
    return 'Stack trace:\n' + block.replace(/^#\d+ /gm, () => `#${n++} `);
  });
}

// A fatal error ends the script. Everything before it is normal output; the error itself is reported separately.
const FATAL = /\n?(?:PHP )?(Fatal error|Parse error): /;

/**
 * Run a learner's program. Resolves { stdout, error } and never rejects.
 * `error` is the fatal or parse error text (what PHP printed from "Fatal error:" or "Parse error:" on), or null.
 * Warnings and notices are not errors: PHP prints them inline, so they stay in stdout, as in real PHP.
 */
export async function runPhp(php, code, stdin = '') {
  cleanWorkDir(php);
  php.writeFile(MAIN_FILE, code);
  php.writeFile(INPUT_FILE, stdin || '');
  php.chdir(WORK_DIR);
  let text = '';
  let thrown = false;
  try {
    const res = await php.run({ code: WRAPPER });
    text = res.text || '';
  } catch (e) {
    thrown = true;
    text = e && e.response && typeof e.response.text === 'string' ? e.response.text : String((e && e.message) || e);
  }
  text = tidy(text);
  let stdout = text;
  let error = null;
  const m = FATAL.exec(text);
  if (m) {
    stdout = text.slice(0, m.index);
    error = text.slice(m.index).trim();
  } else if (thrown) {
    error = text.trim() || 'PHP stopped unexpectedly.';
  }
  if (stdout.length > MAX_OUTPUT) stdout = stdout.slice(0, MAX_OUTPUT);
  return { stdout, error };
}
