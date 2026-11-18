// SayMaCoder test suite. Run with: npm test
// Uses the same C interpreter and Python runtime that ship in the app (in Node instead of a browser).
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { allCourses, flatExercises } from '../src/content/index.js';
// While writing lessons, ONLY_COURSE=java-start node tests/run.mjs runs just that course's lessons and exercises.
const courses = process.env.ONLY_COURSE ? allCourses.filter((c) => c.id === process.env.ONLY_COURSE) : allCourses;
import { gradeExercise, normalizeOutput } from '../src/lib/grader.js';
import { translateError, extractLine } from '../src/lib/errors.js';
import { normalizeC, prepareSource } from '../src/lib/csource.js';
import { dayKey } from '../src/lib/storage.js';
import { solutions } from './solutions.mjs';
import { runJava, closeJava, javaStats } from './java-node.mjs';
import { runRealCpp, prefetchRealCpp, closeRealCpp, collectPrograms, realCppBackend } from './realcpp.mjs';
import { normalizeJava, javaRunInfo } from '../src/lib/javasource.js';
import { validateBlock, fillTemplate, reorderProgram, shuffleOrder } from '../src/content/blocks.js';
import { JSDOM, VirtualConsole } from 'jsdom';
import { SYMBOLS, editorLanguage } from '../src/lib/symbols.js';
import { checkList, shapeResults, filesFrom } from '../src/lib/webgrade.js';

const require = createRequire(import.meta.url);
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
// Test the exact C interpreter bundle that ships in the app (including our small fixes to it).
const sandbox = vm.createContext({ self: {}, console });
vm.runInContext(readFileSync(join(root, 'public/vendor/jscpp.js'), 'utf8') + ';this.__JSCPP = JSCPP;', sandbox);
const JSCPP = sandbox.__JSCPP;
// SQL: the exact core file the worker uses, running on sql.js (the same SQLite that ships in the app).
const initSqlJs = require('sql.js');
const SQLITE = await initSqlJs();
const sqlSandbox = vm.createContext({ self: {} });
vm.runInContext(readFileSync(join(root, 'public/workers/sqlcore.js'), 'utf8'), sqlSandbox);
const SQLCore = sqlSandbox.self.SQLCore;
const { loadPyodide } = await import(join(root, 'node_modules/pyodide/pyodide.mjs'));
// PHP: the shared core (src/lib/phpcore.mjs) that the browser worker also uses, on PHP 8.3 compiled to WebAssembly (@php-wasm).
const { PHP } = await import('@php-wasm/universal');
const { loadNodeRuntime } = await import('@php-wasm/node');
const { createPhp, runPhp: runPhpCore } = await import(join(root, 'src/lib/phpcore.mjs'));
const phpInstance = await createPhp({ PHP, loadRuntime: () => loadNodeRuntime('8.3', { emscriptenOptions: { processId: 1 } }) });

let passed = 0;
const failures = [];
function check(name, ok, detail = '') {
  if (ok) passed += 1;
  else failures.push(`${name}${detail ? `\n      ${detail}` : ''}`);
}
const section = (title) => console.log(`\n${title}`);

// ---- runners (Node versions of the browser workers) ----------------------------
function runC(code, stdin = '') {
  let stdout = '';
  try {
    JSCPP.run(prepareSource('c', code), stdin, { stdio: { write: (s) => { stdout += s; } }, maxTimeout: 3000 });
    return { stdout, error: null, timedOut: false };
  } catch (e) {
    const msg = String((e && e.message) || e);
    return { stdout, error: msg, timedOut: /Time limit exceeded/i.test(msg) };
  }
}

// "Full C" (picoc on WebAssembly): the same cxcore.js and picoc.wasm the app ships.
const cxSandbox = vm.createContext({ TextEncoder, TextDecoder, WebAssembly, performance, console });
vm.runInContext(readFileSync(join(root, 'public/workers/cxcore.js'), 'utf8'), cxSandbox);
const cxModule = new WebAssembly.Module(readFileSync(join(root, 'public/vendor/picoc.wasm')));
// Same rule as public/workers/cx.worker.js: a picoc failure is "/main.c:LINE:COL message" on stderr.
function runCx(code, stdin = '', files = {}) {
  const r = cxSandbox.CX.run(cxModule, { source: code, stdin, files });
  let error = null;
  if (r.trap) error = r.trap;
  else if (r.exitCode !== 0 && /\/main\.c:\d+:\d+ /.test(r.stderr)) error = r.stderr.trim();
  return { stdout: r.stdout, error, timedOut: false, files: r.files, exitCode: r.exitCode, stderr: r.stderr };
}

// For SQL the "stdin" is the practice database (see public/workers/sqlcore.js).
function runSql(code, setup = '') {
  const r = SQLCore.runSql(SQLITE, setup, code);
  return { stdout: r.stdout, error: r.error, timedOut: false };
}

const py = await loadPyodide();
async function runPython(code, stdin = '') {
  const out = [];
  py.setStdout({ batched: (s) => out.push(s + '\n') });
  py.setStderr({ batched: (s) => out.push(s + '\n') });
  const lines = stdin ? stdin.replace(/\n$/, '').split('\n') : [];
  py.setStdin({ stdin: () => (lines.length ? lines.shift() : undefined) });
  const globals = py.globals.get('dict')();
  let error = null;
  try {
    await py.runPythonAsync(code, { globals });
  } catch (e) {
    error = String(e.message || e);
  }
  globals.destroy();
  py.runPython('import os, shutil\nfor _n in os.listdir("."):\n    try:\n        shutil.rmtree(_n) if os.path.isdir(_n) else os.remove(_n)\n    except Exception:\n        pass');
  return { stdout: out.join(''), error, timedOut: false };
}
// ---- web track: the same engine file the app ships, run in Node ------------------------------------
const SMEngine = require('../src/lib/webengine.cjs');
const engineSource = readFileSync(join(root, 'src/lib/webengine.cjs'), 'utf8');

function runWebConsole(code, stdin = '') {
  const ctx = vm.createContext({});
  const r = SMEngine.consoleRun(code, ctx, (c) => vm.runInContext(c, ctx, { filename: 'student.js', timeout: 3000 }), stdin);
  const timedOut = /Script execution timed out/.test(r.error || '');
  return { stdout: r.stdout, error: timedOut ? 'Time limit exceeded.' : r.error, timedOut };
}

/** Load a page in jsdom exactly the way the app's preview does, run checks, return the shaped result. */
async function loadPage(files, { assets, api, strict } = {}) {
  const built = SMEngine.buildDocument(filesFrom(files), { engineSource, assets, api, strict });
  const virtualConsole = new VirtualConsole();
  const dom = new JSDOM(built.html, { runScripts: 'dangerously', pretendToBeVisual: true, url: 'https://example.test/', virtualConsole });
  await new Promise((resolve) => (dom.window.document.readyState === 'complete' ? resolve() : dom.window.addEventListener('load', resolve)));
  await new Promise((r) => setTimeout(r, 25));
  return { dom, built };
}
async function gradeWebNode(ex, files) {
  const { dom } = await loadPage(files, ex);
  const results = await SMEngine.runChecks(dom.window, checkList(ex), { files: filesFrom(files) });
  const shaped = shapeResults(results, { runtimeError: dom.window.__sm.errors[0] || null });
  dom.window.close();
  return shaped;
}
// PHP warnings and notices stay inside stdout (as in real PHP); only a fatal or parse error is reported as `error`.
async function runPhpTest(code, stdin = '') {
  const r = await runPhpCore(phpInstance, code, stdin);
  return { stdout: r.stdout, error: r.error, timedOut: false };
}
const runLang = (language, code, stdin) => (language === 'cppfull' ? runRealCpp(code, stdin) : language === 'cx' ? runCx(code, stdin) : language === 'c' || language === 'cpp' ? runC(code, stdin) : language === 'java' ? runJava(code, stdin) : language === 'sql' ? runSql(code, stdin) : language === 'web' ? runWebConsole(code, stdin) : language === 'php' ? runPhpTest(code, stdin) : runPython(code, stdin));

// ---- 1. every exercise: solution passes, starter fails ----------------------------
{
  // Real C++ ("C++ Pro"): compile every program of those courses in parallel first, so the checks below only run them.
  const programs = collectPrograms(courses, solutions);
  if (programs.length) {
    console.log(`  (real C++: compiling ${new Set(programs).size} programs with the ${realCppBackend()} compiler)`);
    await prefetchRealCpp(programs);
  }
}
section('Exercises (reference solution must pass, untouched starter must fail)');
const all = courses.flatMap((c) => flatExercises(c));
const ids = new Set();
for (const ex of all) {
  check(`${ex.id}: unique id`, !ids.has(ex.id));
  ids.add(ex.id);
  check(`${ex.id}: has 3 hints`, ex.hints?.length === 3, `hints: ${ex.hints?.length}`);
  if (ex.language === 'web') {
    check(`${ex.id}: has checks`, ex.checks?.length >= 3, `checks: ${ex.checks?.length}`);
    check(`${ex.id}: has a starter, a solution and the files it edits`, !!ex.starter && !!ex.solution && Array.isArray(ex.files) && ex.files.length >= 1);
    check(`${ex.id}: prompt and title are written`, !!ex.prompt && !!ex.title);
    const good = await gradeWebNode(ex, ex.solution);
    check(`${ex.id}: solution passes all checks`, good.passed, good.cases.filter((c) => !c.passed).map((c) => `${c.name} -> ${c.detail}`).join(' | '));
    const bad = await gradeWebNode(ex, ex.starter);
    check(`${ex.id}: untouched starter does not pass`, !bad.passed);
    const names = ex.checks.filter((c) => !c.do && !c.hidden).map((c) => c.label || JSON.stringify(c));
    check(`${ex.id}: at least one check is hidden or every check explains itself`, names.length > 0);
    continue;
  }
  check(`${ex.id}: has tests`, ex.tests?.length >= 1);
  const sol = solutions[ex.id];
  check(`${ex.id}: has reference solution`, !!sol);
  if (!sol) continue;

  const good = await gradeExercise(ex, (input) => runLang(ex.language, sol, input));
  check(`${ex.id}: solution passes all tests`, good.passed, good.cases.filter((c) => !c.passed).map((c) => `${c.name}: expected ${JSON.stringify(c.expected)} got ${JSON.stringify(c.actual)} ${c.error || ''}`).join(' | '));

  const bad = await gradeExercise(ex, (input) => runLang(ex.language, ex.starter, input));
  check(`${ex.id}: untouched starter does not pass`, !bad.passed);
}
const everyExerciseId = new Set(allCourses.flatMap((c) => flatExercises(c)).map((e) => e.id));
for (const id of Object.keys(solutions)) check(`solution ${id} belongs to a real exercise`, everyExerciseId.has(id));
console.log(`  ${all.length} exercises checked`);

// ---- 1b. lessons: every example must run and show what the lesson says -------------------
section('Lessons (every interactive block is run on the real runtime)');
{
  const m_isMarkup = (block) => block.items.every((m) => ['html', 'css', 'dom'].includes(m.lang));
  const permutations = (items) => (items.length <= 1 ? [items] : items.flatMap((x, i) => permutations([...items.slice(0, i), ...items.slice(i + 1)]).map((rest) => [x, ...rest])));
  const same = (a, b) => normalizeOutput(a) === normalizeOutput(b);
  const lessonIds = new Set();
  let blocksRun = 0;

  for (const course of courses) {
    for (const lesson of course.lessons) {
      check(`lesson ${lesson.id}: unique id`, !lessonIds.has(lesson.id));
      lessonIds.add(lesson.id);
      check(`lesson ${lesson.id}: has at least one exercise`, lesson.exercises?.length >= 1);

      // Lessons written in the rich format (they have a level) must follow the teaching pattern.
      if (lesson.level) {
        const kinds = lesson.blocks.map((b) => b.t);
        check(`lesson ${lesson.id}: opens with a real-life story`, kinds[0] === 'story');
        check(`lesson ${lesson.id}: ends with a recap`, kinds.at(-1) === 'recap' || kinds.slice(-2).includes('recap'));
        const interactive = kinds.filter((k) => ['try', 'predict', 'fill', 'reorder', 'bug', 'quiz', 'project', 'web', 'see'].includes(k)).length;
        check(`lesson ${lesson.id}: has at least 2 interactive blocks`, interactive >= 2, `found ${interactive}`);
      }

      for (const [i, block] of lesson.blocks.entries()) {
        const id = `${lesson.id} block ${i + 1} (${block.t})`;
        const problems = validateBlock(block);
        check(`${id}: well formed`, problems.length === 0, problems.join('; '));
        if (problems.length) continue;
        const language = course.language;
        const stdin = block.stdin ?? '';

        if (block.t === 'web' || block.t === 'see') {
          const files = block.t === 'web' ? block.starter : block.files;
          const { dom } = await loadPage(files, block);
          blocksRun += 1;
          const errors = dom.window.__sm.errors;
          check(`${id}: page runs without errors`, errors.length === 0, errors[0] || '');
          const proof = block.t === 'web' ? block.checks : block.proof;
          if (proof?.length) {
            const results = await SMEngine.runChecks(dom.window, proof, { files: filesFrom(files) });
            check(`${id}: every check passes on the shown code`, results.every((r) => r.passed), results.filter((r) => !r.passed).map((r) => `${r.label} -> ${r.detail}`).join(' | '));
          }
          if (block.t === 'see') {
            const wrong = block.options.filter((_, k) => k !== block.answer);
            check(`${id}: options are not copies of each other`, new Set(block.options.map((o) => o.toLowerCase())).size === block.options.length && wrong.length >= 1);
          }
          dom.window.close();
          continue;
        }
        if (block.t === 'code' && block.output !== undefined) {
          const r = await runLang(language, block.text, '');
          blocksRun += 1;
          check(`${id}: shown output is what the code prints`, !r.error && same(r.stdout, block.output), `expected ${JSON.stringify(block.output)} got ${JSON.stringify(r.stdout)} ${r.error || ''}`);
        }
        if (block.t === 'try' || block.t === 'project') {
          const r = await runLang(language, block.code, stdin);
          blocksRun += 1;
          const ok = !r.error && (block.output === undefined || same(r.stdout, block.output));
          check(`${id}: runs and matches`, ok, `expected ${JSON.stringify(block.output)} got ${JSON.stringify(r.stdout)} ${r.error || ''}`);
        }
        if (block.t === 'predict') {
          const r = await runLang(language, block.code, stdin);
          blocksRun += 1;
          check(`${id}: marked answer is what the code prints`, !r.error && same(r.stdout, block.options[block.answer]), `answer ${JSON.stringify(block.options[block.answer])} got ${JSON.stringify(r.stdout)} ${r.error || ''}`);
          const wrong = block.options.filter((_, k) => k !== block.answer).filter((o) => same(r.stdout, o));
          check(`${id}: no wrong option equals the real output`, wrong.length === 0);
        }
        if (block.t === 'bug') {
          const broken = await runLang(language, block.code, stdin);
          const fixed = await runLang(language, block.fixed, stdin);
          blocksRun += 2;
          check(`${id}: buggy code really fails`, !!broken.error);
          check(`${id}: fixed code runs`, !fixed.error, fixed.error || '');
        }
        if (block.t === 'fill') {
          const good = await runLang(language, fillTemplate(block), stdin);
          blocksRun += 1;
          check(`${id}: correct answers give the shown output`, !good.error && same(good.stdout, block.output), `got ${JSON.stringify(good.stdout)} ${good.error || ''}`);
          for (const [b, blank] of block.blanks.entries()) {
            for (const option of blank.options.filter((o) => o !== blank.answer)) {
              const answers = block.blanks.map((x) => x.answer);
              answers[b] = option;
              const r = await runLang(language, fillTemplate(block, answers), stdin);
              blocksRun += 1;
              check(`${id}: wrong option "${option}" does not also work`, !!r.error || !same(r.stdout, block.output));
            }
          }
        }
        if (block.t === 'reorder') {
          const solved = await runLang(language, reorderProgram(block), stdin);
          blocksRun += 1;
          check(`${id}: right order gives the shown output`, !solved.error && same(solved.stdout, block.output), `got ${JSON.stringify(solved.stdout)} ${solved.error || ''}`);
          const order = shuffleOrder(block.lines.length, i + 1);
          check(`${id}: starts shuffled`, !order.every((v, k) => v === k));
          if (block.lines.length <= 6) {
            const target = block.lines.join('\n');
            const alt = permutations(block.lines).filter((p) => p.join('\n') !== target);
            let works = null;
            for (const p of alt) {
              const r = await runLang(language, p.join('\n') + '\n', stdin);
              blocksRun += 1;
              if (!r.error && same(r.stdout, block.output)) { works = p; break; }
            }
            check(`${id}: only one order is correct`, works === null, works ? `this order also works: ${JSON.stringify(works)}` : '');
          }
        }
        if (block.t === 'mistakes' && language === 'web' && m_isMarkup(block)) {
          for (const [k, m] of block.items.entries()) {
            if (m.lang === 'dom') continue; // needs a real page: shown to the student, not run
            const lint = m.lang === 'css' ? SMEngine.lintCss : SMEngine.lintHtml;
            const errs = (code) => lint(code).filter((p) => p.kind !== 'tip');
            check(`${id} item ${k + 1}: the fix has no mistakes`, errs(m.right).length === 0, errs(m.right).map((p) => p.message).join('; '));
            if (!m.logic) check(`${id} item ${k + 1}: the checker really spots the mistake`, errs(m.wrong).length >= 1);
          }
          continue;
        }
        if (block.t === 'mistakes') {
          for (const [k, m] of block.items.entries()) {
            const s = m.stdin ?? '';
            const right = await runLang(language, m.right, s);
            blocksRun += 1;
            check(`${id} item ${k + 1}: the fix runs`, !right.error, right.error || '');
            if (!m.logic) {
              const wrong = await runLang(language, m.wrong, s);
              blocksRun += 1;
              check(`${id} item ${k + 1}: the mistake really fails`, !!wrong.error);
            }
          }
        }
      }
    }
  }
  console.log(`  ${lessonIds.size} lessons checked, ${blocksRun} code runs`);
}

// ---- 2. wrong answers are rejected -------------------------------------------------
section('Grader behaviour');
const C_WRONG_PRODUCT = '#include <stdio.h>\nint main() { int a, b; scanf("%d %d", &a, &b); printf("Sum: %d\\n", a * b); return 0; }';
{
  const ex = allCourses.flatMap((c) => flatExercises(c)).find((e) => e.id === 'c2-sum');
  const wrong = await gradeExercise(ex, (input) => runC(C_WRONG_PRODUCT, input));
  check('wrong program fails', !wrong.passed && wrong.passedCount < wrong.total);
  const errored = await gradeExercise(ex, (input) => runC('int main() { int x = ; }', input));
  check('syntax error fails and reports the error', !errored.passed && !!errored.firstError);
  const looping = await gradeExercise({ tests: [{ expected: 'x' }, { expected: 'x' }, { expected: 'x' }] }, async () => ({ stdout: '', error: 'Time limit exceeded.', timedOut: true }));
  check('after a timeout the remaining tests are skipped', looping.cases.filter((c) => c.skipped).length === 2);
  const init = await gradeExercise({ tests: [{ expected: 'x' }] }, async () => ({ stdout: '', error: 'boom', initFailed: true }));
  check('runtime start failure is reported as initFailed', init.initFailed === true);
  check('trailing spaces and blank lines are ignored', normalizeOutput('a  \nb\n\n') === 'a\nb');
  check('windows line endings are ignored', normalizeOutput('a\r\nb\r\n') === 'a\nb');
  check('leading spaces still matter', normalizeOutput(' a') !== normalizeOutput('a'));
}

// ---- 3. error translator against REAL error messages -----------------------------
section('Error translator (real messages from the runtimes)');
{
  const cases = [
    ['c', '#include <stdio.h>\nint main(){ int x = 5 printf("%d", x); return 0; }', 'c-parse', 'missing semicolon'],
    ['c', '#include <stdio.h>\nint main(){ printf("%d\\n", y); return 0; }', 'c-undeclared', 'undeclared variable'],
    ['c', 'int main(){ printf("hi"); return 0; }', 'c-missing-include', 'missing stdio.h'],
    ['c', '#include <stdio.h>\nint main(){ int a; scanf("%d", &a); return 0; }', 'c-memory', 'scanf without input'],
    ['c', '#include <stdio.h>\nint main(){ int a=5, b=0; printf("%d", a/b); return 0; }', 'c-zero-division', 'divide by zero'],
    ['c', '#include <stdio.h>\nint main(){ int a = "hello"; return 0; }', 'c-cast', 'wrong type'],
    ['c', '#include <stdio.h>\nint main(){ while(1){} return 0; }', 'timeout', 'infinite loop'],
    ['cx', 'int main() { printf("hi\\n"); return 0; }', 'cx-missing-include', 'cx: missing stdio.h'],
    ['cx', '#include <stdio.h>\nint main() { printf("%d", total); return 0; }', 'cx-undefined', 'cx: undeclared variable'],
    ['cx', '#include <stdio.h>\nstruct P { int x; };\nint main() { struct P p; p.z = 1; return 0; }', 'cx-member', 'cx: no such struct member'],
    ['cx', '#include <stdio.h>\nstruct P { int x; };\nint main() { struct P p; struct P *q = &p; q.x = 1; return 0; }', 'cx-arrow-dot', 'cx: dot used on a pointer'],
    ['cx', '#include <stdio.h>\nint main() { int *p; *p = 5; return 0; }', 'cx-null-pointer', 'cx: NULL pointer'],
    ['cx', '#include <stdio.h>\nint main() { int a = 5, b = 0; printf("%d", a / b); return 0; }', 'cx-div-zero', 'cx: divide by zero'],
    ['web', 'console.log(missing)', 'js-ref', 'JS ReferenceError'],
    ['web', 'const el = null;\nel.addEventListener(\"click\", () => {});', 'js-null-property', 'JS null property'],
    ['web', 'const x = 5;\nx();', 'js-not-function', 'JS not a function'],
    ['web', 'const a = 1;\na = 2;', 'js-const', 'JS const reassigned'],
    ['web', 'let a = 1;\nlet a = 2;', 'js-redeclared', 'JS redeclared'],
    ['web', 'console.log((1 + 2);', 'js-syntax-eof', 'JS missing bracket'],
    ['web', 'while (true) { }', 'timeout', 'JS infinite loop (worker time limit)'],
    ['web', 'function f() { f(); }\nf();', 'js-stack', 'JS endless recursion'],
    ['cpp', 'using namespace std;\nint main(){ cout << "hi"; return 0; }', 'cpp-missing-iostream', 'C++ missing iostream'],
    ['cpp', '#include <iostream>\nusing namespace std;\nint main(){ cout << "hi" << endl return 0; }', 'c-parse', 'C++ missing semicolon'],
    ['cpp', '#include <iostream>\nusing namespace std;\nint main(){ cout << total; return 0; }', 'c-undeclared', 'C++ undeclared variable'],
    ['cpp', '#include <iostream>\nusing namespace std;\nint main(){ int a = 5, b = 0; cout << a / b; return 0; }', 'c-zero-division', 'C++ divide by zero'],
    ['cpp', '#include <iostream>\nusing namespace std;\nint main(){ while (true) { } return 0; }', 'timeout', 'C++ infinite loop'],
    ['cpp', '#include <iostream>\nusing namespace std;\nint f(int n){ return n + f(n - 1); }\nint main(){ cout << f(3); return 0; }', 'cpp-stack', 'C++ recursion without a base case'],
    ['cpp', '#include <iostream>\nusing namespace std;\nint main(){ int a[3] = {1, 2, 3}; cout << a[5]; return 0; }', 'cpp-index', 'C++ index past the end'],
    ['cpp', '#include <iostream>\nusing namespace std;\nint main(){ int a[3] = {1, 2, 3}; cout << a[-1]; return 0; }', 'cpp-index', 'C++ negative index'],
    ['cpp', '#include <iostream>\nusing namespace std;\nint main(){ int *p; *p = 5; return 0; }', 'cpp-pointer-uninit', 'C++ pointer with no address'],
    ['cpp', '#include <iostream>\nusing namespace std;\nint main(){ int x = 5; int *p = x; return 0; }', 'cpp-pointer-type', 'C++ number where an address belongs'],
    ['sql', 'SELECT * FROM pupils;', 'sql-no-table', 'SQL missing table'],
    ['sql', 'SELECT colour FROM t;', 'sql-no-column', 'SQL missing column'],
    ['sql', 'SELECT name FORM t;', 'sql-syntax', 'SQL misspelled keyword'],
    ['sql', "SELECT name FROM t WHERE name = 'Amina;", 'sql-incomplete', 'SQL unclosed quote'],
    ['sql', 'SELECT name FROM t, u;', 'sql-ambiguous', 'SQL ambiguous column'],
    ['sql', "INSERT INTO t VALUES (1, 'Amina');", 'sql-unique', 'SQL duplicate key'],
    ['sql', "INSERT INTO t (id) VALUES (9);", 'sql-not-null', 'SQL missing required value'],
    ['sql', "INSERT INTO t VALUES (7, 'Sam', 3);", 'sql-column-count', 'SQL wrong number of values'],
    ['sql', 'SELECT name FROM t WHERE COUNT(*) > 1;', 'sql-aggregate-where', 'SQL aggregate in WHERE'],
    ['sql', 'SELECT NOW();', 'sql-no-function', 'SQL unknown function'],
    ['sql', 'CREATE TABLE t (a INT);', 'sql-table-exists', 'SQL table already exists'],
    ['sql', 'CREATE TABLE k (n INT CHECK (n > 0)); INSERT INTO k VALUES (-1);', 'sql-check', 'SQL CHECK rule broken'],
    ['sql', "INSERT INTO t (colour) VALUES ('x');", 'sql-no-column-named', 'SQL INSERT names a missing column'],
    ['sql', 'ALTER TABLE t ADD COLUMN level INTEGER NOT NULL;', 'sql-add-notnull', 'SQL new NOT NULL column without default'],
    ['sql', 'PRAGMA foreign_keys = ON; CREATE TABLE ch (p INTEGER REFERENCES t(id)); INSERT INTO ch VALUES (99);', 'sql-foreign-key', 'SQL foreign key broken'],
    ['sql', 'SELECT * FROM t WHERE id IN (SELECT id, name FROM t);', 'sql-subquery-columns', 'SQL inner query returns two columns'],
    ['sql', 'CREATE VIEW vv AS SELECT id FROM t; INSERT INTO vv VALUES (5);', 'sql-view-modify', 'SQL change rows of a view'],
    ['sql', 'COMMIT;', 'sql-transaction', 'SQL commit without BEGIN'],
    ['sql', 'BEGIN; BEGIN;', 'sql-transaction', 'SQL BEGIN inside a transaction'],
    ['sql', 'SELECT id FROM t WHERE ROW_NUMBER() OVER (ORDER BY id) = 1;', 'sql-window-misuse', 'SQL window function in WHERE'],
    ['sql', 'CREATE INDEX ix ON t(id); CREATE INDEX ix ON t(name);', 'sql-table-exists', 'SQL index already exists'],
    ['python', 'print(undefined_name)', 'py-name-error', 'NameError'],
    ['python', 'x = (1 +', 'py-never-closed', 'unclosed bracket'],
    ['python', 'if True\n    print(1)', 'py-missing-colon', 'missing colon'],
    ['python', 'if True:\nprint(1)', 'py-indentation', 'indentation'],
    ['python', 'print("hi)', 'py-unterminated-string', 'unterminated string'],
    ['python', 'print(1/0)', 'py-zero-division', 'ZeroDivisionError'],
    ['python', 'int("abc")', 'py-value-int', 'ValueError int'],
    ['python', 'print("a" + 5)', 'py-type-concat', 'str + int'],
    ['python', 'print(5 + "a")', 'py-type-operand', 'int + str'],
    ['python', 'x = [1,2]\nprint(x[5])', 'py-index', 'IndexError'],
    ['python', 'd = {}\nprint(d["k"])', 'py-key', 'KeyError'],
    ['python', 'input()', 'py-eof', 'EOFError (no input)'],
    ['python', 'x = 5\nx.append(1)', 'py-attribute', 'AttributeError'],
    ['python', 'x = = 3', 'py-syntax', 'generic SyntaxError'],
    // ---- Java: real javac messages and real exception reports from the shipped engine
    ['java', 'public class Main { public static void main(String[] a) { int x = 5\n System.out.println(x); } }', 'java-expected', 'Java missing semicolon'],
    ['java', 'public class Main { public static void main(String[] a) {\n System.out.println("Karibu);\n } }', 'java-quote', 'Java missing closing quote'],
    ['java', 'public class Main { public static void main(String[] a) {\n System.out.println(\'Karibu\');\n } }', 'java-quote', 'Java single quotes for text'],
    ['java', 'public class Main { public static void main(String[] a) { System.out.println(total); } }', 'java-symbol', 'Java unknown variable'],
    ['java', 'public class Main { public static void main(String[] a) { system.out.println("hi"); } }', 'java-package', 'Java lowercase system'],
    ['java', 'class M { M(String n) { } }\npublic class Main { public static void main(String[] a) { new M(); } }', 'java-args', 'Java constructor needs an argument'],
    ['java', 'public class Main { static int f(int a, int b) { return a; } public static void main(String[] a) { f(1); } }', 'java-args', 'Java method needs two arguments'],
    ['java', 'class M { private int v = 1; }\npublic class Main { public static void main(String[] a) { System.out.println(new M().v); } }', 'java-private', 'Java private field'],
    ['java', 'public class Main { public static void main(String[] a) { int x = "hello"; } }', 'java-types', 'Java wrong type'],
    ['java', 'public class Main { public static void main(String[] a) { int x = 3.5; } }', 'java-lossy', 'Java double into int'],
    ['java', 'public class Main { static int f(int a) { if (a > 0) { return 1; } } public static void main(String[] a) { f(1); } }', 'java-return', 'Java missing return'],
    ['java', 'public class Main { public static void main(String[] a) { int x; System.out.println(x); } }', 'java-uninit', 'Java uninitialised variable'],
    ['java', 'public class Main { public static void main(String[] a) { int x = 1; int x = 2; } }', 'java-duplicate', 'Java variable declared twice'],
    ['java', 'public class Main { public static void main(String[] a) { Thread.sleep(10); } }', 'java-checked', 'Java unhandled checked exception'],
    ['java', 'public class Main { void hi() { } public static void main(String[] a) { hi(); } }', 'java-static', 'Java non-static from main'],
    ['java', 'public class Main { public static void main(String[] a) { final int x = 1; x = 2; } }', 'java-final', 'Java assigning a final'],
    ['java', 'class S { static final int P = 1; }\npublic class Main { public static void main(String[] a) { S.P = 2; } }', 'java-final', 'Java assigning a static final constant'],
    ['java', 'abstract class Shape { } public class Main { public static void main(String[] a) { Shape s = new Shape(); } }', 'java-abstract', 'Java new on abstract class'],
    ['java', 'public class Main { public static void main(String[] a) { System.out.println("hi"); }', 'java-syntax', 'Java missing closing brace'],
    ['java', 'public class Main { public static void main(String[] a) { int[] x = new int[2]; x[5] = 1; } }', 'java-array-index', 'Java index out of bounds'],
    ['java', 'public class Main { public static void main(String[] a) { java.util.List<Integer> l = new java.util.ArrayList<>(); l.get(3); } }', 'java-array-index', 'Java list index out of bounds'],
    ['java', 'public class Main { public static void main(String[] a) { String s = null; s.length(); } }', 'java-null', 'Java null pointer'],
    ['java', 'public class Main { static int r(int n) { return r(n + 1) + 1; } public static void main(String[] a) { r(1); } }', 'java-stack', 'Java endless recursion'],
    ['java', 'public class Main { public static void main(String[] a) { int z = Integer.parseInt("0"); System.out.println(5 / z); } }', 'java-arith', 'Java divide by zero'],
    ['java', 'public class Main { public static void main(String[] a) { Integer.parseInt("abc"); } }', 'java-number-format', 'Java NumberFormatException'],
    ['java', 'public class Main { public static void main(String[] a) { new java.util.Scanner(System.in).nextInt(); } }', 'java-input', 'Java wrong kind of input', 'abc\n'],
    ['java', 'public class Main { public static void main(String[] a) { new java.util.Scanner(System.in).nextInt(); } }', 'java-input', 'Java no input left', ''],
    ['java', 'public class Main { public static void main(String[] a) { throw new IllegalStateException("boom"); } }', 'java-uncaught', 'Java uncaught exception'],
    ['java', 'public class Main { public static void main(String[] a) { while (true) { } } }', 'timeout', 'Java infinite loop'],
    ['php', '<?php\necho "a"\necho "b";', 'php-missing-semicolon', 'PHP missing semicolon'],
    ['php', '<?php\nif (true {\n}', 'php-parse', 'PHP generic parse error'],
    ['php', '<?php\ntotl(1);', 'php-undefined-function', 'PHP undefined function'],
    ['php', '<?php\nclass A {}\n(new A)->go();', 'php-undefined-method', 'PHP undefined method'],
    ['php', '<?php\n$x = null;\n$x->go();', 'php-null-member', 'PHP method call on null'],
    ['php', '<?php\nfunction f(int $x) { return $x; }\nf("abc");', 'php-type-error', 'PHP argument of the wrong type'],
    ['php', '<?php\nfunction f($a, $b) { return $a; }\nf(1);', 'php-arg-count', 'PHP too few arguments'],
    ['php', '<?php\necho 1 / 0;', 'php-division-zero', 'PHP division by zero'],
    ['php', '<?php\necho ugx;', 'php-undefined-constant', 'PHP undefined constant'],
    ['php', '<?php\n$w = new Wallet();', 'php-class-not-found', 'PHP class not found'],
    ['php', '<?php\necho [1] + 1;', 'php-unsupported-operand', 'PHP unsupported operand'],
    ['php', '<?php\nfunction a() {}\nfunction a() {}', 'php-redeclare', 'PHP function defined twice'],
    ['php', '<?php\nthrow new Exception("boom");', 'php-uncaught', 'PHP uncaught exception'],
  ];
  for (const [language, code, expectedId, label, caseInput = ''] of cases) {
    const res = await runLang(language, code, language === 'sql' ? 'CREATE TABLE t (id INTEGER PRIMARY KEY, name TEXT NOT NULL); CREATE TABLE u (id INTEGER, name TEXT); INSERT INTO t VALUES (1, \'Amina\');' : caseInput);
    const raw = res.error || '';
    const en = translateError(raw, { language, lang: 'en' });
    check(`${label}: rule ${expectedId}`, en?.id === expectedId, `got ${en?.id ?? 'no match'} for: ${raw.split('\n').slice(-2).join(' | ').slice(0, 140)}`);
    check(`${label}: has title, cause and fix`, !!(en?.title && en?.why && en?.fix));
    const sw = translateError(raw, { language, lang: 'sw' });
    check(`${label}: Kiswahili available`, sw && sw.lang === 'sw' && sw.title !== en?.title);
    const lg = translateError(raw, { language, lang: 'lg' });
    check(`${label}: Luganda falls back to English`, lg && lg.lang === 'en' && lg.fellBack === true);
  }
  check('unknown error returns null', translateError('some brand new error', { language: 'c', lang: 'en' }) === null);
  check('empty error returns null', translateError('', { language: 'c', lang: 'en' }) === null);
  check('python rules do not fire for C', translateError("NameError: name 'x' is not defined", { language: 'c', lang: 'en' }) === null);

  const pyErr = (await runPython('x = 1\nprint(undefined_name)')).error;
  check('python error line number is found', extractLine(pyErr, 'python') === 2, `got ${extractLine(pyErr, 'python')}`);
  const cErr = runC('#include <stdio.h>\nint main(){ printf("%d", y); return 0; }').error;
  check('C error line number is found', extractLine(cErr, 'c') === 2, `got ${extractLine(cErr, 'c')}`);
  const phpErr = (await runPhpTest('<?php\n\necho 1 / 0;')).error;
  check('PHP error line number is found', extractLine(phpErr, 'php') === 3, `got ${extractLine(phpErr, 'php')} for ${phpErr}`);
  check('python rules do not fire for PHP', translateError('ZeroDivisionError: division by zero', { language: 'php', lang: 'en' }) === null);
  const hdr = translateError('1:13 variable sqrt does not exist', { language: 'c', lang: 'en' });
  check('missing header names the right file', hdr?.title.includes('<math.h>'), hdr?.title);
}


// ---- 4b. web engine ---------------------------------------------------------------------
section('Every course language has an editor language and a symbol bar (a missing one crashed lesson 8)');
for (const course of courses) {
  const lang = editorLanguage(course.language);
  check(`${course.id}: symbol bar exists for "${lang}"`, Array.isArray(SYMBOLS[lang]) && SYMBOLS[lang].length > 5);
}
for (const l of ['html', 'css', 'js', 'java']) check(`file type "${l}" has a symbol bar`, Array.isArray(SYMBOLS[l]) && SYMBOLS[l].length > 5);
section('Web engine (loop guard, linters, line numbers, pretend server, checker)');
{
  const G = SMEngine.guardLoops;
  check('guard: while loop gets a guard', G('while (true) { x++; }').includes('{__sm_guard();'));
  check('guard: for loop with ; inside the header is handled', G('for (let i = 0; i < 3; i++) { go(); }').includes('{__sm_guard();'));
  check('guard: do-while gets a guard', G('do { x++; } while (x < 5);').startsWith('do {__sm_guard();'));
  check('guard: the word "for" inside a string is untouched', G('const s = "for (;;) {";') === 'const s = "for (;;) {";');
  check('guard: comments are untouched', G('// while (true) {\nx = 1;') === '// while (true) {\nx = 1;');
  check('guard: user line count is unchanged', G('while (a) {\n  b();\n}\n').split('\n').length === 4);

  // a runaway loop is stopped, not frozen
  {
    const started = Date.now();
    const { dom } = await loadPage({ html: '<p id="a">hi</p>', js: 'let n = 0;\nwhile (true) {\n  n++;\n}' });
    check('infinite loop in the page is stopped by the guard', dom.window.__sm.errors.some((e) => /Time limit exceeded/.test(e)), JSON.stringify(dom.window.__sm.errors));
    check('infinite loop is stopped quickly', Date.now() - started < 6000, `${Date.now() - started} ms`);
    check('the error points at the right line of script.js', /script\.js:(2|3):/.test(dom.window.__sm.errors[0] || ''), dom.window.__sm.errors[0]);
    dom.window.close();
  }
  {
    const { dom, built } = await loadPage({ html: '<h1>x</h1>', js: 'const a = 1;\nconst b = 2;\nundefinedThing();' });
    const err = dom.window.__sm.errors[0] || '';
    check('runtime error is reported with the student\'s own line number', /script\.js:3:/.test(err), err);
    check('runtime error is translated', translateError(err, { language: 'web', lang: 'en' })?.id === 'js-ref');
    check('line number is extracted for web errors', extractLine(err, 'web') === 3, String(extractLine(err, 'web')));
    check('jsOffset is positive when a harness is present', built.jsOffset > 0);
    dom.window.close();
  }

  // linters
  const html = (s) => SMEngine.lintHtml(s).filter((p) => p.kind !== 'tip');
  check('lint html: a clean page has no problems', html('<h1>Hi</h1>\n<p>text <b>bold</b></p>\n<img src="a.png" alt="a">').length === 0);
  check('lint html: unclosed <p> is found with its line', html('<div>\n<p>hello\n</div>').some((p) => p.line === 2));
  check('lint html: stray closing tag is found', html('<p>hi</p></div>').length === 1);
  check('lint html: void tags like <br> and <img> need no closing', html('<p>a<br>b</p><img src="x" alt="">').length === 0);
  check('lint html: comments and script bodies are ignored', html('<!-- <div> --><script>if (a < b && c > d) {}</script>').length === 0);
  check('lint html: missing alt is a tip, not an error', SMEngine.lintHtml('<img src="a.png">').some((p) => p.kind === 'tip') && html('<img src="a.png">').length === 0);
  const css = (s) => SMEngine.lintCss(s);
  check('lint css: a clean sheet has no problems', css('h1 { color: red; padding: 4px; }\n@media (min-width: 600px) { p { margin: 0; } }').length === 0);
  check('lint css: missing semicolon is found', css('h1 {\n  color: red\n  padding: 4px;\n}').some((p) => /add a ;/.test(p.message)));
  check('lint css: misspelled property gets a suggestion', css('h1 { colour: red; }').some((p) => /Did you mean "color"/.test(p.message)));
  check('lint css: unclosed brace is found', css('h1 { color: red;').some((p) => /never closed/.test(p.message)));
  check('lint css: custom properties are allowed', css(':root { --main: #0b6b4f; } p { color: var(--main); }').length === 0);

  // colours
  check('colour: names, hex and rgb() are the same colour', SMEngine.normValue('red') === SMEngine.normValue('#f00') && SMEngine.normValue('#ff0000') === SMEngine.normValue('rgb(255,0,0)'));
  check('colour: different colours differ', SMEngine.normValue('red') !== SMEngine.normValue('tomato'));

  // the checker, on a small interactive page
  const files = {
    html: '<!DOCTYPE html><html lang="en"><head><title>T</title><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="style.css"></head><body><header><h1>Shop</h1></header><main><ul id="list"></ul><button id="add">Add</button><input id="qty" aria-label="Quantity"><p id="out">0</p></main><footer>end</footer><script src="script.js"></script></body></html>',
    css: 'h1 { color: tomato; padding: 12px; } #out { font-weight: bold; }',
    js: 'let n = 0;\ndocument.getElementById("add").addEventListener("click", () => { n += 1000; document.getElementById("out").textContent = n.toLocaleString("en-US"); console.log("total", n); });\ndocument.getElementById("qty").addEventListener("input", (e) => { document.getElementById("out").textContent = e.target.value * 2; });\nfetch("/api/items").then((r) => r.json()).then((items) => { items.forEach((i) => { const li = document.createElement("li"); li.textContent = i.name; document.getElementById("list").append(li); }); });\nlocalStorage.setItem("seen", "yes");\nfunction double(x) { return x * 2; }',
  };
  const { dom } = await loadPage(files, { api: { '/api/items': [{ name: 'Rolex' }, { name: 'Chapati' }] } });
  const run = (checks) => SMEngine.runChecks(dom.window, checks, { files });
  const ok = async (checks) => (await run(checks)).every((r) => r.passed);
  check('checker: exists / text / count', await ok([{ exists: 'h1' }, { text: 'h1', equals: 'Shop' }, { count: 'li', equals: 2 }, { text: 'li', contains: 'chap' }]));
  check('checker: computed style with any colour spelling', await ok([{ style: 'h1', prop: 'color', is: '#ff6347' }, { style: 'h1', prop: 'padding-left', is: '12px' }]));
  check('checker: a wrong style value is reported', !(await ok([{ style: 'h1', prop: 'color', is: 'blue' }])));
  check('checker: order of elements', await ok([{ order: ['header', 'main', 'footer'] }]) && !(await ok([{ order: ['footer', 'header'] }])));
  check('checker: click then read the page', await ok([{ do: 'click', target: '#add' }, { do: 'click', target: '#add' }, { text: '#out', equals: '2,000' }, { log: 'total 2000' }]));
  check('checker: type into a field fires the input event', await ok([{ do: 'type', target: '#qty', value: '21' }, { text: '#out', equals: '42' }]));
  check('checker: js expression on page functions', await ok([{ js: 'double(4)', equals: 8 }]) && !(await ok([{ js: 'double(4)', equals: 9 }])));
  check('checker: pretend fetch served the list', await ok([{ js: 'document.querySelectorAll("#list li").length', equals: 2 }]));
  check('checker: pretend localStorage works', await ok([{ js: 'localStorage.getItem("seen")', equals: 'yes' }]));
  check('checker: accessibility rules', await ok([{ rule: 'html-lang' }, { rule: 'viewport' }, { rule: 'title' }, { rule: 'one-h1' }, { rule: 'form-labels' }]));
  check('checker: source checks', await ok([{ uses: 'js', pattern: 'addEventListener' }, { uses: 'css', pattern: 'tomato' }]));
  check('checker: lint checks', await ok([{ lint: 'html' }, { lint: 'css' }]));
  check('checker: missing element fails with a helpful message', (await run([{ exists: 'nav' }]))[0].detail.includes('No <nav>'));
  check('checker: no runtime errors', await ok([{ noErrors: true }]));
  check('checker: clicking something missing fails', !(await ok([{ do: 'click', target: '#nope' }])));
  const e = await run([{ text: 'h1', equals: 'Other' }]);
  check('checker: wrong text shows what the page says', e[0].detail.includes('Shop'));
  dom.window.close();

  // assets: images from the lesson library become real offline images
  {
    const { dom: d2 } = await loadPage({ html: '<img id="i" src="img/logo.svg" alt="logo">' }, { assets: { 'img/logo.svg': '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"/>' } });
    check('assets: lesson images are inlined as data URIs', d2.window.document.getElementById('i').getAttribute('src').startsWith('data:image/svg+xml'));
    d2.window.close();
  }
  // a fragment is wrapped into a full page; scripts inside the HTML are guarded and run
  {
    const { dom: d3 } = await loadPage({ html: '<p id="p">x</p><script>document.getElementById("p").textContent = "ok"; for (let i = 0; i < 2; i++) { console.log(i); }</script>' });
    check('fragment: HTML without <html> is wrapped and inline scripts run', d3.window.document.getElementById('p').textContent === 'ok' && d3.window.__sm.logs.length === 2);
    d3.window.close();
  }
  // a page can be saved as a standalone file with no harness inside
  {
    const out = SMEngine.buildDocument({ html: '<h1>x</h1>', js: 'console.log(1)' }, { harness: false, guard: false });
    check('export: saved page has no preview harness', !out.html.includes('__sm') && out.html.includes('console.log(1)'));
  }
  // console JavaScript
  {
    const r = runWebConsole('const a = 2;\nconsole.log("a is", a, [1, 2], { x: 1 }, true, null);');
    check('console js: log formatting', r.stdout === 'a is 2 [1,2] {"x":1} true null\n', JSON.stringify(r.stdout));
    check('console js: input() reads stdin', runWebConsole('console.log(input() + "!")', 'hey').stdout === 'hey!\n');
    check('console js: an error keeps the output printed before it', (() => { const x = runWebConsole('console.log(1); nope();'); return x.stdout === '1\n' && /ReferenceError/.test(x.error); })());
  }
}

// ---- 4. C source preparation -------------------------------------------------------
section('C source preparation');
{
  check('main(void) becomes main()', normalizeC('int main(void) { return 0; }') === 'int main() { return 0; }');
  check('return (void) style code is untouched', normalizeC('return (void)x;') === 'return (void)x;');
  check('python source is untouched', prepareSource('python', 'f(void)') === 'f(void)');
  const r = runC('#include <stdio.h>\nint main(void) { printf("ok\\n"); return 0; }');
  check('main(void) programs now run', r.stdout === 'ok\n' && !r.error, r.error || '');

  const pi = runC('#include <stdio.h>\n#define PI 3.14159\n#define K 2\nint main() {\n    printf("%.2f %d\\n", PI * 2, K);\n    return 0;\n}\n');
  check('decimal #define values work', pi.stdout === '6.28 2\n' && !pi.error, pi.error || '');
  check('integer #define is untouched', normalizeC('#define N 5\n') === '#define N 5\n');

  // The interpreter drops whitespace after a comma inside strings in function calls. We work around it.
  const H = '#include <stdio.h>\n';
  const out = (body, stdin = '') => runC(`${H}int main() { ${body} return 0; }`, stdin);
  check('string with comma and space is printed exactly', out('printf("Hello, world\\n");').stdout === 'Hello, world\n');
  check('comma + several spaces are kept', out('printf("a,   b\\n");').stdout === 'a,   b\n');
  check('comma + tab is kept', out('printf("a,\\tb\\n");').stdout === 'a,\tb\n');
  check('commas in format strings with arguments', out('printf("x, %d, y\\n", 5);').stdout === 'x, 5, y\n');
  check('puts keeps comma spacing', out('puts("a, b");').stdout === 'a, b\n');
  check('puts adds a newline each call', out('puts("one"); puts("two");').stdout === 'one\ntwo\n');
  check('scanf reads a char', out('char c; scanf("%c", &c); printf("[%c]\\n", c);', 'Q').stdout === '[Q]\n');
  check('scanf with leading space reads a char', out('char c; scanf(" %c", &c); printf("[%c]\\n", c);', 'Q').stdout === '[Q]\n');
  check('scanf reads an int then a char', out('int n; char c; scanf("%d", &n); scanf(" %c", &c); printf("%d%c\\n", n, c);', '5\nZ').stdout === '5Z\n');
  check('scanf %s and %f still work', out('char s[20]; float f; scanf("%s %f", s, &f); printf("%s %.1f\\n", s, f * 2);', 'Amina 2.5').stdout === 'Amina 5.0\n');
  check('user function call keeps comma spacing', runC(`${H}void f(char *s) { printf("%s\\n", s); }\nint main() { f("x, y"); return 0; }`).stdout === 'x, y\n');
  check('hex digit after the comma space is not swallowed', out('printf("a, 1 and a, ab\\n");').stdout === 'a, 1 and a, ab\n');
  check('scanf format with comma and space', out('int a, b; scanf("%d, %d", &a, &b); printf("%d-%d\\n", a, b);', '3, 4').stdout === '3-4\n');
  check('escaped quote inside a string is handled', out('printf("say \\"hi, there\\"\\n");').stdout === 'say "hi, there"\n');
  check('space before a bracket in a string is kept', out('printf("Withdrew %d (fee %d)\\n", 3000, 100);').stdout === 'Withdrew 3000 (fee 100)\n');
  check('spaces around brackets in a string are kept', out('printf("a (b) c ( d ) e\\n");').stdout === 'a (b) c ( d ) e\n');
  check('brackets at the start and end of a string', out('printf("(a) b (c)\\n");').stdout === '(a) b (c)\n');
  const S = '#include <stdio.h>\n#include <string.h>\n';
  const outS = (body, stdin = '') => runC(`${S}int main() { ${body} return 0; }`, stdin);
  check('strcmp of equal strings is 0', outS('char a[30] = "Hi"; char b[30] = "Hi"; printf("%d\\n", strcmp(a, b));').stdout === '0\n');
  check('strcmp orders words', outS('char a[30] = "apple"; char b[30] = "banana"; printf("%d %d\\n", strcmp(a, b) < 0, strcmp(b, a) > 0);').stdout === '1 1\n');
  check('strncmp compares only n characters', outS('char a[30] = "abcd"; char b[30] = "abxx"; printf("%d %d\\n", strncmp(a, b, 2), strncmp(a, b, 3) != 0);').stdout === '0 1\n');
  check('short array list is padded with zeros', out('int a[5] = {10, 20}; printf("%d %d %d\\n", a[1], a[2], a[4]);').stdout === '20 0 0\n');
  check('single array value is not turned into -1', out('int a[3] = {5}; printf("%d %d\\n", a[0], a[1]);').stdout === '5 0\n');
  check('2D table with a short list is padded', out('int a[2][3] = {{1, 2}, {3}}; printf("%d%d%d%d%d%d\\n", a[0][0], a[0][1], a[0][2], a[1][0], a[1][1], a[1][2]);').stdout === '120300\n');
  check('2D table of zeros', out('int a[2][2] = {0}; printf("%d\\n", a[1][1]);').stdout === '0\n');
  check('a word read with scanf can be changed afterwards', outS('char s[20]; scanf("%s", s); s[0] = s[0] - 32; printf("%s\\n", s);', 'amina').stdout === 'Amina\n');
  check('a line read with gets can be changed afterwards', outS('char s[20]; gets(s); s[0] = s[0] - 32; printf("%s\\n", s);', 'mama rose').stdout === 'Mama rose\n');
  check('text copied with strcpy can be changed afterwards', outS('char a[10] = "abc"; char b[10]; strcpy(b, a); b[0] = 88; printf("%s %s\\n", a, b);').stdout === 'abc Xbc\n');
  check('strcat after strcpy builds the text', outS('char b[20]; strcpy(b, "Mama"); strcat(b, " Rose"); printf("%s %d\\n", b, (int)strlen(b));').stdout === 'Mama Rose 9\n');
  check('p++ does not move the array it was copied from', out('int a[3] = {1, 2, 3}; int *p = a; p++; printf("%d %d\\n", a[0], *p);').stdout === '1 2\n');
  check('two pointers to one array move independently', out('int a[3] = {1, 2, 3}; int *p = a; int *q = a; p++; printf("%d %d\\n", *p, *q);').stdout === '2 1\n');
  check('a function can walk its pointer without moving the caller array', out('int a[3] = {1, 2, 3}; int *p = a; int *e = a + 3; int t = 0; while (p != e) { t += *p; p++; } printf("%d %d\\n", t, a[0]);').stdout === '6 1\n');
  check('pointer != and < and += work', out('int a[4] = {1, 2, 3, 4}; int *p = a; int *q = a + 2; p += 2; printf("%d %d %d\\n", p != a, a < q, *p);').stdout === '1 1 3\n');
  check('pointer difference gives a number', out('int a[5] = {1, 2, 3, 4, 5}; int *p = &a[1]; int *q = &a[4]; printf("%d\\n", (int)(q - p));').stdout === '3\n');
  check('commas outside strings are untouched', normalizeC('f(a, b);') === 'f(a, b);');
  check('comments are untouched', normalizeC('// say "a, b"\nint x;') === '// say "a, b"\nint x;');
  check('main(void) inside a string is untouched', normalizeC('printf("main(void)");') === 'printf("main(void)");');
  check('char literal comma is untouched', normalizeC("char c = ',';") === "char c = ',';");
}

// ---- 6. Java (source preparation, then the real engine run through the shipped worker) -----------------
section('Java source preparation');
{
  const TB = '"'.repeat(3);
  check('%n in a format string becomes \\n', normalizeJava('System.out.printf("A=%d%nB=%d%n", 1, 2);') === 'System.out.printf("A=%d\\nB=%d\\n", 1, 2);');
  check('%%n (a real percent sign and an n) is untouched', normalizeJava('printf("100%%n")') === 'printf("100%%n")');
  check('%n inside a text block is fixed too', normalizeJava(`String t = ${TB}\n a %n b${TB};`).includes('a \\n b'));
  check('%n in a comment is untouched', normalizeJava('// use %n here\nint x;') === '// use %n here\nint x;');
  check('a literal zero divisor is hidden from the compiler', normalizeJava('int a = 10 / 0;') === 'int a = 10 / Integer.parseInt("0");');
  check('a literal zero modulus is hidden too', normalizeJava('int a = 10 % 0;') === 'int a = 10 % Integer.parseInt("0");');
  check('other divisors are untouched', normalizeJava('a / 10; b /100; c / 0.5; d / 0x10; e / 05; f / x;') === 'a / 10; b /100; c / 0.5; d / 0x10; e / 05; f / x;');
  check('a divide in a comment or string is untouched', normalizeJava('// 5/0\nString s = "5/0";') === '// 5/0\nString s = "5/0";');
  const info = (src) => javaRunInfo(src);
  check('main class: public class Main', info('public class Main { public static void main(String[] a) {} }').mainClass === 'Main');
  check('main class: public class with another name', JSON.stringify(info('public class Shop { public static void main(String[] a) {} }')) === '{"mainClass":"Shop","fileName":"Shop.java"}');
  check('main class: not public', JSON.stringify(info('class Shop { public static void main(String[] a) {} }')) === '{"mainClass":"Shop","fileName":"Main.java"}');
  check('main class: helper classes first', info('class Helper {}\npublic class Main { public static void main(String[] a) {} }').mainClass === 'Main');
  check('main class: a nested class with main is not chosen', info('public class Main { static class A { static void main(String[] a) {} } public static void main(String[] a) {} }').mainClass === 'Main');
  check('main class: public class without main, another class has it', JSON.stringify(info('public class Lib {}\nclass App { public static void main(String[] a) {} }')) === '{"mainClass":"App","fileName":"Lib.java"}');
  check('main class: class names in comments and strings are ignored', info('// public class Fake { static void main(\nclass Real { String s = "class Q {"; public static void main(String... a) {} }').mainClass === 'Real');
  check('main class: records and enums before it', info('record P(int x) {}\nenum E { A }\npublic class Run { public static void main(String[] a) {} }').mainClass === 'Run');
}

section('Java engine (real javac and TeaVM through the shipped worker)');
{
  const J = (body, pre = '') => `${pre}\npublic class Main { public static void main(String[] args) throws Exception { ${body} } }`;
  const same = (r, out) => !r.error && r.stdout === out;

  let r = await runJava(J('java.util.Scanner s = new java.util.Scanner(System.in); System.out.println("Sum = " + (s.nextInt() + s.nextInt()));'), '12 30\n');
  check('hello with Scanner input', same(r, 'Sum = 42\n'), JSON.stringify(r));
  r = await runJava(J('java.util.Scanner s = new java.util.Scanner(System.in); System.out.println("Sum = " + (s.nextInt() + s.nextInt()));'), '1 2\n');
  check('same program, other input (build reused)', same(r, 'Sum = 3\n'), JSON.stringify(r));
  r = await runJava('public class Shop { public static void main(String[] a) { System.out.println("shop"); } }');
  check('a public class that is not called Main runs', same(r, 'shop\n'), JSON.stringify(r));
  r = await runJava('class Shop { public static void main(String[] a) { System.out.println("shop2"); } }');
  check('a class with main that is not public runs', same(r, 'shop2\n'), JSON.stringify(r));
  r = await runJava(J('System.out.printf("A=%d%nB=%d%nC=%d%n", 1, 2, 3);'));
  check('%n in the middle of a format string keeps every argument', same(r, 'A=1\nB=2\nC=3\n'), JSON.stringify(r));
  r = await runJava(J('try { System.out.println(10 / 0); } catch (ArithmeticException e) { System.out.println("AE " + e.getMessage()); } System.out.println(5.0 / 0);'));
  check('10 / 0 with literals is caught as ArithmeticException (and 5.0 / 0 is Infinity)', same(r, 'AE / by zero\nInfinity\n'), JSON.stringify(r));
  r = await runJava(J('System.err.println("to stderr"); System.out.println("ok");'));
  check('System.err output is kept apart from the answer', !r.error && r.stdout === 'ok\n' && r.stderr === 'to stderr\n', JSON.stringify(r));
  r = await runJava(J('System.out.println("UGX 5,000 \u2014 M\u00fcller \u2713");'));
  check('unicode output', same(r, 'UGX 5,000 \u2014 M\u00fcller \u2713\n'), JSON.stringify(r));

  r = await runJava(J('int x = "hello";\nString s = 5;\nundefinedVar++;\nSystem.out.println(x)'));
  check('a compile error is reported like javac (file, line, "error:")', /^Main\.java:5: error: ';' expected$/.test(r.error || ''), JSON.stringify(r.error));
  r = await runJava(J('Foo f = new Foo();'));
  check('the same compile error is not repeated', ((r.error || '').match(/cannot find symbol/g) || []).length === 1, JSON.stringify(r.error));
  check('simple type names in messages (String, not java.lang.String)', /String cannot be converted to int/.test((await runJava(J('int x = "a";'))).error || ''));

  r = await runJava(J('System.out.println("before"); throw new IllegalStateException("boom");'));
  check('an uncaught exception is reported like Java', r.error === 'Exception in thread "main" java.lang.IllegalStateException: boom\n\tat Main.main(Main.java)' && r.stdout === 'before\n', JSON.stringify(r));
  r = await runJava(J('new Bank().draw(5);', 'class LowFunds extends RuntimeException { LowFunds(String m) { super(m); } } class Bank { void draw(int n) { throw new LowFunds("Need " + n); } }'));
  check('the report names our own exception class and the calls that led to it', r.error === 'Exception in thread "main" LowFunds: Need 5\n\tat Bank.draw(Main.java)\n\tat Main.main(Main.java)', JSON.stringify(r.error));
  r = await runJava(J('throw new RuntimeException();'));
  check('an exception without a message shows only its class', (r.error || '').startsWith('Exception in thread "main" java.lang.RuntimeException\n'), JSON.stringify(r.error));
  r = await runJava(J('int[] x = new int[2]; x[5] = 1;'));
  check('array index out of bounds is named like Java names it', /^Exception in thread "main" java\.lang\.ArrayIndexOutOfBoundsException/.test(r.error || ''), JSON.stringify(r.error));
  r = await runJava(J('String s = null; s.length();'));
  check('a null pointer is named like Java names it', /^Exception in thread "main" java\.lang\.NullPointerException/.test(r.error || ''), JSON.stringify(r.error));

  const before = javaStats.restarts;
  r = await runJava('public class Main { public static void main(String[] a) { while (true) { } } }');
  check('a runaway loop is stopped by the time limit', r.timedOut === true && r.error === 'Time limit exceeded.', JSON.stringify(r));
  check('the engine was restarted after the stop', javaStats.restarts === before + 1);
  r = await runJava(J('System.out.println("alive");'));
  check('Java runs again after a runaway loop was stopped', same(r, 'alive\n'), JSON.stringify(r));
}

// ---- 5. dates and streak keys --------------------------------------------------------
section('SQL engine (SQLite via sql.js: the same core file the worker uses)');
{
  const { tbl } = await import('../src/content/sql/shared.js');
  const T = (cols, rows) => SQLCore.formatTable(cols, rows);
  const samples = [
    [['name', 'price'], [['Soap', 1500], ['Matooke bunch', 15000]]],
    [['a'], []],
    [['id', 'supplier'], [[1, null], [22, 'Kampala Grains']]],
    [['Price (UGX)'], [[4500]]],
  ];
  for (const [cols, rows] of samples) check(`lesson table helper matches the app's table format for ${JSON.stringify(cols)}`, tbl(cols, rows) === T(cols, rows), `${JSON.stringify(tbl(cols, rows))} vs ${JSON.stringify(T(cols, rows))}`);

  const db = 'CREATE TABLE t (id INTEGER PRIMARY KEY, name TEXT); INSERT INTO t VALUES (1, \'Amina\'), (2, \'Brian\');';
  check('SELECT prints a text table', runSql('SELECT * FROM t;', db).stdout === 'id | name\n---+------\n1  | Amina\n2  | Brian\n', JSON.stringify(runSql('SELECT * FROM t;', db).stdout));
  check('no rows prints (0 rows) under the header', runSql("SELECT * FROM t WHERE id = 99;", db).stdout.includes('(0 rows)'));
  check('NULL shows as NULL', runSql('SELECT NULL AS x;', '').stdout === 'x\n----\nNULL\n', JSON.stringify(runSql('SELECT NULL AS x;', '').stdout));
  check('INSERT reports the rows changed', runSql("INSERT INTO t VALUES (3, 'Grace');", db).stdout === '(1 row changed)\n');
  check('UPDATE and DELETE report the rows changed', runSql("UPDATE t SET name = 'X'; DELETE FROM t WHERE id = 1;", db).stdout === '(2 rows changed)\n\n(1 row changed)\n');
  check('CREATE TABLE is silent', runSql('CREATE TABLE z (a INT);', '').stdout === '');
  check('two queries print two tables with a blank line between', runSql('SELECT 1 AS a; SELECT 2 AS b;', '').stdout === 'a\n-\n1\n\nb\n-\n2\n');
  check('every run starts with a fresh database', runSql('CREATE TABLE once (a INT);', '').error === null && runSql('CREATE TABLE once (a INT);', '').error === null);
  check('earlier changes never leak into the next run', runSql("DELETE FROM t;", db).error === null && runSql('SELECT COUNT(*) AS n FROM t;', db).stdout === 'n\n-\n2\n');
  const bad = runSql('SELECT 1;', 'CREATE TABLE oops (');
  check('a broken practice database is reported as such', /practice database could not be built/.test(bad.error || ''), bad.error);
  check('an error keeps the output that came before it', runSql('SELECT 1 AS a; SELECT * FROM nope;', '').stdout === 'a\n-\n1\n' && /no such table/.test(runSql('SELECT 1 AS a; SELECT * FROM nope;', '').error));
  const many = runSql('WITH RECURSIVE c(x) AS (SELECT 1 UNION ALL SELECT x + 1 FROM c WHERE x < 500) SELECT x FROM c;', '');
  const plan = runSql("CREATE INDEX ix ON t(name); EXPLAIN QUERY PLAN SELECT * FROM t WHERE name = 'x';", db).stdout;
  check('EXPLAIN QUERY PLAN prints only a plan column of readable text', plan.startsWith('plan\n') && plan.includes('SEARCH t USING') && !/notused|parent/.test(plan), JSON.stringify(plan));
  check('a plan of a full scan says SCAN', runSql('EXPLAIN QUERY PLAN SELECT * FROM t WHERE name = \'x\';', db).stdout.includes('SCAN t'));
  check('very long results are cut and say so', many.stdout.includes('... 300 more rows not shown') && many.stdout.split('\n').length < 210, many.stdout.split('\n').slice(-3).join(' | '));
}

section('Full C engine (picoc on WebAssembly: structs, enums, malloc, files)');
{
  const H = '#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n';
  const X = (body, stdin = '') => runCx(H + body, stdin);
  let r = X('struct Item { int id; char name[20]; int price; };\nint main(void) { struct Item it; it.id = 1; strcpy(it.name, "Rolex"); it.price = 3000; printf("%d %s %d\\n", it.id, it.name, it.price); return 0; }');
  check('cx: struct members, strcpy into a member, main(void)', r.stdout === '1 Rolex 3000\n' && !r.error, r.error || r.stdout);
  r = X('typedef struct { int x; int y; } Point;\nint main() { Point p = {3, 4}; Point q = {7}; printf("%d %d %d %d\\n", p.x, p.y, q.x, q.y); return 0; }');
  check('cx: struct initialiser, short list leaves zeros', r.stdout === '3 4 7 0\n', r.error || r.stdout);
  r = X('struct Item { int id; char name[10]; };\nstruct Shop { char name[10]; struct Item first; int count; };\nint main() { struct Item list[2] = {{2, "Tea"}, {3, "Soda"}}; struct Shop s = {"Duuka", {9, "Bread"}, 2}; printf("%s %s %s %d\\n", list[1].name, s.first.name, s.name, s.count); return 0; }');
  check('cx: nested and array-of-struct initialisers', r.stdout === 'Soda Bread Duuka 2\n', r.error || r.stdout);
  r = X('struct P { int x, y; char c; };\nint main() { struct P p = {1, 2, 65}; printf("%d %d %c\\n", p.x, p.y, p.c); return 0; }');
  check('cx: several struct members on one line', r.stdout === '1 2 A\n', r.error || r.stdout);
  r = X('enum Day { MON, TUE = 5, WED };\nint main() { enum Day d = WED; printf("%d %d\\n", d, TUE); return 0; }');
  check('cx: enum values count on from the last one', r.stdout === '6 5\n', r.error || r.stdout);
  r = X('union U { int i; char c; };\nint main() { union U u; u.i = 65; printf("%c %d\\n", u.c, (int)sizeof(union U)); return 0; }');
  check('cx: union shares its memory', r.stdout === 'A 4\n', r.error || r.stdout);
  r = X('struct Node { int value; struct Node *next; };\ntypedef struct Node Node;\nint main() { Node *head = NULL; for (int i = 1; i <= 3; i++) { Node *n = (Node *)malloc(sizeof(Node)); n->value = i * 10; n->next = head; head = n; } for (Node *p = head; p != NULL; p = p->next) printf("%d ", p->value); printf("\\n"); return 0; }');
  check('cx: linked list with malloc, typedef type in a for loop', r.stdout === '30 20 10 \n' && !r.error, r.error || r.stdout);
  r = X('int main() { int *a = calloc(3, sizeof(int)); a = realloc(a, 6 * sizeof(int)); a[5] = 9; printf("%d %d\\n", a[0], a[5]); free(a); return 0; }');
  check('cx: calloc, realloc and free', r.stdout === '0 9\n', r.error || r.stdout);
  r = X('int main() { FILE *f = fopen("a.txt", "w"); fprintf(f, "12 apple\\n%d %s\\n", 7, "pear"); fclose(f); f = fopen("a.txt", "r"); int n; char w[20]; while (fscanf(f, "%d %s", &n, w) == 2) printf("[%d,%s]", n, w); fclose(f); f = fopen("a.txt", "a"); fputs("more\\n", f); fclose(f); f = fopen("a.txt", "r"); char line[40]; int c = 0; while (fgets(line, 40, f) != NULL) c++; fclose(f); printf(" %d lines\\n", c); return 0; }');
  check('cx: write, read, append and fgets on a file', r.stdout === '[12,apple][7,pear] 3 lines\n' && r.files['a.txt'] === '12 apple\n7 pear\nmore\n', r.error || r.stdout);
  r = X('int main() { FILE *f = fopen("b.bin", "wb"); int arr[3] = {1, 2, 3}; fwrite(arr, sizeof(int), 3, f); fclose(f); f = fopen("b.bin", "rb"); int back[3]; int got = fread(back, sizeof(int), 3, f); printf("%d %d\\n", got, back[2]); fclose(f); f = fopen("nothing.txt", "r"); printf("%d\\n", f == NULL); return 0; }');
  check('cx: binary fwrite/fread and fopen of a missing file gives NULL', r.stdout === '3 3\n1\n', r.error || r.stdout);
  r = X('int main() { int n; char w[20]; scanf("%d %s", &n, w); printf("%d-%s\\n", n * 2, w); return 0; }', '21 abc\n');
  check('cx: scanf from the input box', r.stdout === '42-abc\n', r.error || r.stdout);
  r = X('int main() { return 3; }');
  check('cx: a non-zero return from main is not an error', !r.error && r.exitCode === 3);
  r = X('int main() { int a = 5; printf("%d", total); return 0; }');
  check('cx: error line numbers count from line 1 of the student program', /\/main\.c:4:/.test(r.error || '') && translateError(r.error, { language: 'cx' })?.line === 4, r.error || '');
  r = X('int main() { int a = 5, b = 0; printf("%d", a / b); return 0; }');
  check('cx: integer division by zero is reported', /divide by zero/i.test(r.error || ''), r.error || r.stdout);
  r = X('int f(int n) { return f(n + 1); }\nint main() { f(1); return 0; }');
  check('cx: endless recursion is caught, not a frozen page', !!r.error && /too much memory/.test(r.error), r.error || r.stdout);
}

section('PHP engine (the shared core, on real PHP 8.3 WebAssembly)');
{
  const r = (code, stdin = '') => runPhpCore(phpInstance, code, stdin);
  check('PHP runs a script', (await r('<?php echo "Hello, Kampala!\\n";')).stdout === 'Hello, Kampala!\n');
  check('PHP is version 8.3', (await r('<?php echo PHP_MAJOR_VERSION, ".", PHP_MINOR_VERSION;')).stdout === '8.3');
  check('PHP reads input with fgets(STDIN)', (await r('<?php $n = trim(fgets(STDIN)); $m = (int) fgets(STDIN); echo "$n $m";', 'Mary\n50\n')).stdout === 'Mary 50');
  check('PHP with no input: fgets(STDIN) gives false', (await r('<?php var_dump(fgets(STDIN));')).stdout === 'bool(false)\n');
  const warn = await r('<?php echo "a\\n"; echo $nope; echo "b\\n";');
  check('a warning stays inline in the output and is not an error', warn.error === null && warn.stdout === 'a\n\nWarning: Undefined variable $nope in main.php on line 1\nb\n', JSON.stringify(warn));
  const fatal = await r('<?php echo "before\\n";\necho 1 / 0;');
  check('a fatal error keeps the output before it and is reported separately', fatal.stdout === 'before\n' && /^Fatal error: Uncaught DivisionByZeroError: Division by zero in main\.php:2/.test(fatal.error), JSON.stringify(fatal));
  check('error messages show main.php, never the runner file', !/internal|eval\.php|\/tmp\/sm/.test(fatal.error));
  const trace = await r('<?php\nfunction f(int $x) { return $x; }\nf("abc");');
  check('stack traces start at the learner code and are numbered from #0', /#0 main\.php\(3\): f\('abc'\)\n#1 \{main\}/.test(trace.error), trace.error);
  const parse = await r('<?php echo "a" ');
  check('a parse error has no output and says Parse error', parse.stdout === '' && /^Parse error: /.test(parse.error), JSON.stringify(parse));
  check('the learner\'s own line numbers are used', /on line 4/.test((await r('<?php\n\n\necho $x[1];\n')).stdout));
  check('HTML is not used in messages', !/<b>|<br/.test(warn.stdout));
  await r('<?php file_put_contents("keep.txt", "1"); mkdir("sub"); file_put_contents("sub/x.txt", "2");');
  check('files a program makes are gone on the next run', (await r('<?php echo count(scandir(".")) - 2;')).stdout === '0');
  check('a program can read back a file it wrote in the same run', (await r('<?php file_put_contents("a.txt", "hi"); echo file_get_contents("a.txt");')).stdout === 'hi');
  check('mbstring works (Luganda and Kiswahili text)', (await r('<?php echo mb_strlen("Nnyabo"), mb_strtoupper("ŋ"), mb_substr("Kampala", 0, 3);')).stdout === '6ŊKam');
  check('json works', (await r('<?php echo json_encode(["ugx" => 12500, "ok" => true]);')).stdout === '{"ugx":12500,"ok":true}');
  check('SQLite through PDO works', (await r('<?php $d = new PDO("sqlite::memory:"); $d->exec("create table t(a)"); $d->exec("insert into t values (5)"); echo $d->query("select a from t")->fetchColumn();')).stdout === '5');
  check('time zone is Africa/Kampala', (await r('<?php echo date_default_timezone_get(), " ", date("H:i", 0);')).stdout === 'Africa/Kampala 03:00');
  check('number_format and str_pad behave', (await r('<?php echo number_format(1500000), "|", str_pad("5", 3, "0", STR_PAD_LEFT);')).stdout === '1,500,000|005');
  check('floats print like PHP 8 (0.1 + 0.2)', (await r('<?php echo 0.1 + 0.2, "|"; var_dump(0.1 + 0.2);')).stdout === '0.3|float(0.30000000000000004)\n');
  check('classes, constructor promotion and readonly work', (await r('<?php final class W { public function __construct(public readonly int $b = 0) {} } $w = new W(5000); echo $w->b;')).stdout === '5000');
  check('enums and match work (PHP 8.1+)', (await r('<?php enum Net: string { case MTN = "mtn"; case AIRTEL = "airtel"; } echo match (Net::from("mtn")) { Net::MTN => "yellow", Net::AIRTEL => "red" };')).stdout === 'yellow');
  check('very long output is cut', (await r('<?php for ($i = 0; $i < 30000; $i++) { echo "x"; }')).stdout.length === 20000);
  const again = await r('<?php echo isset($leak) ? "leak" : "clean";');
  check('variables never leak between runs', (await r('<?php $leak = 1;')).error === null && again.stdout === 'clean');
  check('a fatal error does not break the next run', (await r('<?php echo 1 / 0;')).error !== null && (await r('<?php echo "ok";')).stdout === 'ok');
}

section('Choices are shown shuffled (the right answer is written first, but must not be shown first every time)');
{
  const { choiceOrder } = await import('../src/content/blocks.js');
  let allOk = true;
  const overall = {};
  for (const course of allCourses) {
    const spots = {};
    let n = 0;
    for (const lesson of course.lessons) {
      lesson.blocks.forEach((b, index) => {
        const sets = [];
        if (['quiz', 'predict', 'bug', 'see'].includes(b.t) && b.options) sets.push([b.options, b.question, index, b.answer]);
        if (b.t === 'fill') b.blanks.forEach((bl, gap) => sets.push([bl.options, `${b.template}|${bl.answer}`, gap, bl.options.indexOf(bl.answer)]));
        for (const [options, key, at, right] of sets) {
          const order = choiceOrder(options, key, at);
          const isPermutation = order.length === options.length && [...order].sort((x, y) => x - y).every((v, i) => v === i);
          const same = JSON.stringify(order) === JSON.stringify(choiceOrder(options, key, at));
          if (!isPermutation || !same) allOk = false;
          if (options.length === 4 && right >= 0) {
            const shown = order.indexOf(right);
            spots[shown] = (spots[shown] || 0) + 1;
            overall[shown] = (overall[shown] || 0) + 1;
            n += 1;
          }
        }
      });
    }
    if (n >= 20) check(`${course.id}: the right answer is shown first in at most 40 percent of its 4-option questions`, (spots[0] || 0) / n <= 0.4, `${JSON.stringify(spots)} of ${n}`);
  }
  check('every shuffled choice order is a permutation and is the same every time', allOk);
  const total = Object.values(overall).reduce((a, b) => a + b, 0);
  check('across all courses each of the 4 positions holds 18 to 32 percent of the right answers', [0, 1, 2, 3].every((k) => (overall[k] || 0) / total >= 0.18 && (overall[k] || 0) / total <= 0.32), JSON.stringify(overall));
  check('options that refer to each other keep their written order', JSON.stringify(choiceOrder(['It is red', 'It is blue', 'All of the above'], 'q', 1)) === '[0,1,2]');
  check('a different question gives a different order', new Set(Array.from({ length: 12 }, (_, i) => JSON.stringify(choiceOrder(['a', 'b', 'c', 'd'], `question ${i}`, i)))).size > 4);
}

section('Dates');
{
  check('dayKey format', dayKey(new Date(2026, 10, 9)) === '2026-11-09');
  check('dayKey pads month and day', dayKey(new Date(2026, 0, 5)) === '2026-01-05');
}

closeJava();
closeRealCpp();
console.log(`\n${passed} checks passed, ${failures.length} failed`);
// the PHP runtime keeps Node alive after the last check, so end the process explicitly
if (!failures.length) process.exit(0);
if (failures.length) {
  console.log('\nFAILURES:');
  for (const f of failures) console.log(`  - ${f}`);
  process.exit(1);
}
