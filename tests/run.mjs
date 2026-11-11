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
  return { stdout: out.join(''), error, timedOut: false };
}
const runLang = (language, code, stdin) => (language === 'c' ? runC(code, stdin) : runPython(code, stdin));

// ---- 1. every exercise: solution passes, starter fails ----------------------------
section('Exercises (reference solution must pass, untouched starter must fail)');
const all = courses.flatMap((c) => flatExercises(c));
const ids = new Set();
for (const ex of all) {
  check(`${ex.id}: unique id`, !ids.has(ex.id));
  ids.add(ex.id);
  check(`${ex.id}: has 3 hints`, ex.hints?.length === 3, `hints: ${ex.hints?.length}`);
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
        const interactive = kinds.filter((k) => ['try', 'predict', 'fill', 'reorder', 'bug', 'quiz', 'project'].includes(k)).length;
        check(`lesson ${lesson.id}: has at least 2 interactive blocks`, interactive >= 2, `found ${interactive}`);
      }

      for (const [i, block] of lesson.blocks.entries()) {
        const id = `${lesson.id} block ${i + 1} (${block.t})`;
        const problems = validateBlock(block);
        check(`${id}: well formed`, problems.length === 0, problems.join('; '));
        if (problems.length) continue;
        const language = course.language;
        const stdin = block.stdin ?? '';

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
