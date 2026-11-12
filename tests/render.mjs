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
try {
  const { courses } = await server.ssrLoadModule('/src/content/index.js');
  const { renderBlock } = await server.ssrLoadModule('/src/ui/lesson-blocks.js');
  const { lessonView } = await server.ssrLoadModule('/src/ui/views/lesson.js');
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
          renderBlock(block, { language: course.language, index, ctx });
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
process.removeAllListeners('uncaughtException');
if (failures.length) {
  console.log(`\nFAILURES:\n${failures.map((f) => `  - ${f}`).join('\n')}`);
  process.exit(1);
}
process.exit(0);
