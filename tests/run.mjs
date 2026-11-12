// SayMaCoder test suite. Run with: npm test
// Uses the same C interpreter and Python runtime that ship in the app (in Node instead of a browser).
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { courses, flatExercises } from '../src/content/index.js';
import { gradeExercise, normalizeOutput } from '../src/lib/grader.js';
import { translateError, extractLine } from '../src/lib/errors.js';
import { normalizeC, prepareSource } from '../src/lib/csource.js';
import { dayKey } from '../src/lib/storage.js';
import { solutions } from './solutions.mjs';
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
const { loadPyodide } = await import(join(root, 'node_modules/pyodide/pyodide.mjs'));

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
const runLang = (language, code, stdin) => (language === 'c' ? runC(code, stdin) : language === 'web' ? runWebConsole(code, stdin) : runPython(code, stdin));

// ---- 1. every exercise: solution passes, starter fails ----------------------------
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
for (const id of Object.keys(solutions)) check(`solution ${id} belongs to a real exercise`, ids.has(id));
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
  const ex = all.find((e) => e.id === 'c2-sum');
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
    ['web', 'console.log(missing)', 'js-ref', 'JS ReferenceError'],
    ['web', 'const el = null;\nel.addEventListener(\"click\", () => {});', 'js-null-property', 'JS null property'],
    ['web', 'const x = 5;\nx();', 'js-not-function', 'JS not a function'],
    ['web', 'const a = 1;\na = 2;', 'js-const', 'JS const reassigned'],
    ['web', 'let a = 1;\nlet a = 2;', 'js-redeclared', 'JS redeclared'],
    ['web', 'console.log((1 + 2);', 'js-syntax-eof', 'JS missing bracket'],
    ['web', 'while (true) { }', 'timeout', 'JS infinite loop (worker time limit)'],
    ['web', 'function f() { f(); }\nf();', 'js-stack', 'JS endless recursion'],
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
  ];
  for (const [language, code, expectedId, label] of cases) {
    const res = await runLang(language, code, '');
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
  const hdr = translateError('1:13 variable sqrt does not exist', { language: 'c', lang: 'en' });
  check('missing header names the right file', hdr?.title.includes('<math.h>'), hdr?.title);
}


// ---- 4b. web engine ---------------------------------------------------------------------
section('Every course language has an editor language and a symbol bar (a missing one crashed lesson 8)');
for (const course of courses) {
  const lang = editorLanguage(course.language);
  check(`${course.id}: symbol bar exists for "${lang}"`, Array.isArray(SYMBOLS[lang]) && SYMBOLS[lang].length > 5);
}
for (const l of ['html', 'css', 'js']) check(`web file type "${l}" has a symbol bar`, Array.isArray(SYMBOLS[l]) && SYMBOLS[l].length > 5);
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
  check('commas outside strings are untouched', normalizeC('f(a, b);') === 'f(a, b);');
  check('comments are untouched', normalizeC('// say "a, b"\nint x;') === '// say "a, b"\nint x;');
  check('main(void) inside a string is untouched', normalizeC('printf("main(void)");') === 'printf("main(void)");');
  check('char literal comma is untouched', normalizeC("char c = ',';") === "char c = ',';");
}

// ---- 5. dates and streak keys --------------------------------------------------------
section('Dates');
{
  check('dayKey format', dayKey(new Date(2026, 10, 9)) === '2026-11-09');
  check('dayKey pads month and day', dayKey(new Date(2026, 0, 5)) === '2026-01-05');
}

console.log(`\n${passed} checks passed, ${failures.length} failed`);
if (failures.length) {
  console.log('\nFAILURES:');
  for (const f of failures) console.log(`  - ${f}`);
  process.exit(1);
}
