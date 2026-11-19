// Renders every lesson of every course in a fake browser (jsdom) and fails if any block throws.
// This catches "click the lesson and nothing happens" bugs that the content tests cannot see.
import { createServer } from 'vite';
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!doctype html><html><body><div id="app"></div></body></html>', { url: 'https://example.test/', pretendToBeVisual: true });
const w = dom.window;
for (const k of ['window', 'document', 'navigator', 'HTMLElement', 'Node', 'Element', 'MutationObserver', 'getComputedStyle', 'requestAnimationFrame', 'cancelAnimationFrame', 'DOMParser', 'Range', 'Selection', 'Event', 'KeyboardEvent', 'MouseEvent', 'CustomEvent', 'FocusEvent', 'InputEvent', 'DocumentFragment', 'Text', 'Window', 'HTMLInputElement', 'HTMLTextAreaElement', 'HTMLIFrameElement', 'HTMLButtonElement', 'NodeFilter', 'ResizeObserver', 'IntersectionObserver']) {
  if (w[k] !== undefined) Object.defineProperty(globalThis, k, { value: w[k], configurable: true, writable: true });
}
globalThis.window = w;
// Editors measure themselves on animation frames; there is no screen here, so skip that.
w.requestAnimationFrame = () => 0;
w.cancelAnimationFrame = () => {};
globalThis.requestAnimationFrame = w.requestAnimationFrame;
globalThis.cancelAnimationFrame = w.cancelAnimationFrame;
w.ResizeObserver = w.ResizeObserver || class { observe() {} disconnect() {} unobserve() {} };
globalThis.ResizeObserver = w.ResizeObserver;
globalThis.Worker = class { postMessage() {} terminate() {} addEventListener() {} };
globalThis.URL.createObjectURL = () => 'blob:test';
globalThis.URL.revokeObjectURL = () => {};
w.matchMedia = w.matchMedia || (() => ({ matches: false, addEventListener() {}, removeEventListener() {} }));
w.scrollTo = () => {};
if (!w.Range.prototype.getClientRects) { w.Range.prototype.getClientRects = () => []; w.Range.prototype.getBoundingClientRect = () => ({ top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0 }); }

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });
let ok = 0;
const failures = [];
let clickTested = 0; // choice blocks that were really clicked through (shown shuffled, must still check the right answer)
try {
  const { allCourses: courses } = await server.ssrLoadModule('/src/content/index.js');
  const { renderBlock } = await server.ssrLoadModule('/src/ui/lesson-blocks.js');
  const { lessonView } = await server.ssrLoadModule('/src/ui/views/lesson.js');
  const { outputView, testResultsView } = await server.ssrLoadModule('/src/ui/components.js');
  const sqlOut = outputView({ stdout: 'a | b\n--+--\n1 | 2\n', stderr: '', ms: 1 }, 'sql');
  const pyOut = outputView({ stdout: 'hi\n', stderr: '', ms: 1 }, 'python');
  if (!sqlOut.classList.contains('lang-sql')) failures.push('SQL run output is missing the lang-sql class');
  if (pyOut.classList.contains('lang-sql')) failures.push('lang-sql must be only for SQL (other languages keep wrapping)');
  const sqlTests = testResultsView({ passed: false, passedCount: 0, total: 1, cases: [{ name: 't', passed: false, expected: 'a', actual: 'b' }] }, 'sql');
  if (!sqlTests.classList.contains('lang-sql')) failures.push('SQL test results are missing the lang-sql class');
  for (const course of courses) {
    for (const lesson of course.lessons) {
      const where = `${course.id} / ${lesson.id}`;
      try {
        const view = lessonView(course.id, lesson.id);
        if (!view.node || view.node.textContent.length < 50) throw new Error('lesson view is empty');
        ok += 1;
      } catch (e) {
        failures.push(`${where}: ${e.stack?.split('\n').slice(0, 3).join(' | ') || e}`);
      }
      const ctx = { cleanups: [] };
      lesson.blocks.forEach((block, index) => {
        try {
          const node = renderBlock(block, { language: course.language, index, ctx });
          if (course.language === 'sql' && node && node.classList && !node.classList.contains('lang-sql')) failures.push(`${where} block ${index + 1} (${block.t}): SQL block is missing the lang-sql class (its result tables would wrap on a phone)`);
          const at = `${where} block ${index + 1} (${block.t})`;
          const sameSet = (a, b) => JSON.stringify([...a].sort()) === JSON.stringify([...b].sort());
          if (['quiz', 'predict', 'bug', 'see'].includes(block.t) && block.options && new Set(block.options).size === block.options.length) {
            // the options are shown shuffled: every option must still be there exactly once...
            const shown = [...node.querySelectorAll('button.choice')].map((b) => b.textContent);
            if (!sameSet(shown, block.options)) failures.push(`${at}: the options shown are not the options written`);
            // ...and the button showing the right answer must still be the right one, wherever it is shown
            if (block.t !== 'see') {
              const right = [...node.querySelectorAll('button.choice')].find((b) => b.textContent === block.options[block.answer]);
              right.click();
              if (!right.classList.contains('ok') || !node.querySelector('.feedback-ok')) failures.push(`${at}: the right answer was not accepted after shuffling`);
              const again = renderBlock(block, { language: course.language, index, ctx });
              const wrong = [...again.querySelectorAll('button.choice')].find((b) => b.textContent !== block.options[block.answer]);
              wrong.click();
              if (!wrong.classList.contains('wrong') || again.querySelector('.feedback-ok')) failures.push(`${at}: a wrong answer was accepted after shuffling`);
              clickTested += 1;
            }
          }
          if (block.t === 'fill') {
            const selects = [...node.querySelectorAll('select.gap')];
            block.blanks.forEach((bl, i) => { if (!selects[i] || !sameSet([...selects[i].options].map((o) => o.value).filter(Boolean), bl.options)) failures.push(`${at}: the gap ${i + 1} options shown are not the options written`); });
          }
        } catch (e) {
          failures.push(`${where} block ${index + 1} (${block.t}): ${e.message}`);
        }
      });
    }
  }
} finally {
  await server.close();
}
console.log(`\nLesson screens (every lesson view is rendered)\n  ${ok} lesson views rendered`);
console.log(`  ${clickTested} choice blocks clicked through (right answer accepted, wrong answer refused, in shuffled order)`);
if (clickTested < 300) failures.push(`only ${clickTested} choice blocks were clicked through: the click test did not run properly`);
process.removeAllListeners('uncaughtException');
if (failures.length) {
  console.log(`\nFAILURES:\n${failures.map((f) => `  - ${f}`).join('\n')}`);
  process.exit(1);
}
process.exit(0);
