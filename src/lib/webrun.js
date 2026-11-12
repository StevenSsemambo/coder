// Browser side of the web track: sandboxed live preview, grading, and console-only JavaScript.
import engineSource from './webengine.cjs?raw';
import { checkList, shapeResults } from './webgrade.js';

// The same engine file that goes into the preview page is evaluated here for building and linting.
export const Engine = new Function(`${engineSource}\nreturn SMEngine;`)();

export const buildPreview = (files, opts = {}) => Engine.buildDocument(files, { ...opts, engineSource });

let frameCounter = 0;

/**
 * A sandboxed preview page.
 * The iframe has no allow-same-origin, so the student's code cannot reach the app, its storage or the network.
 * The page talks back by postMessage only.
 */
export class Preview {
  constructor({ onLog, onError, offscreen = false } = {}) {
    this.id = ++frameCounter * 1000;
    this.onLog = onLog;
    this.onError = onError;
    this.frame = document.createElement('iframe');
    this.frame.setAttribute('sandbox', 'allow-scripts');
    this.frame.setAttribute('title', 'Page preview');
    this.frame.className = offscreen ? 'preview-offscreen' : 'preview-frame';
    this.store = {};
    this.token = 0;
    this.waiting = new Map();
    this.errors = [];
    this.logs = [];
    this.readyResolve = null;
    this.listener = (e) => this.#onMessage(e);
    window.addEventListener('message', this.listener);
  }

  #onMessage(e) {
    if (e.source !== this.frame.contentWindow) return;
    const m = e.data;
    if (!m || !m.__sm || m.id !== this.id) return;
    if (m.type === 'ready') this.readyResolve?.(true);
    else if (m.type === 'log') {
      this.logs.push({ level: m.level, text: m.text });
      this.onLog?.({ level: m.level, text: m.text });
    } else if (m.type === 'error') {
      this.errors.push(m.raw);
      this.onError?.(m.raw);
    } else if (m.type === 'storage') this.store[m.name] = m.data;
    else if (m.type === 'checks') this.waiting.get(m.token)?.(m.results);
  }

  /** Show the page. Resolves when it has loaded (or after a short wait). */
  render(files, opts = {}) {
    this.id += 1;
    this.errors = [];
    this.logs = [];
    const { html } = buildPreview(files, { ...opts, post: true, id: this.id, store: this.store });
    const ready = new Promise((resolve) => {
      this.readyResolve = resolve;
      setTimeout(() => resolve(false), 5000);
    });
    this.frame.srcdoc = html;
    return ready;
  }

  /** Run checks inside the page. Resolves the results, or null if the page stopped answering. */
  runChecks(checks, files, timeoutMs = 6000) {
    const token = ++this.token;
    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        this.waiting.delete(token);
        resolve(null);
      }, timeoutMs);
      this.waiting.set(token, (results) => {
        clearTimeout(timer);
        this.waiting.delete(token);
        resolve(results);
      });
      this.frame.contentWindow?.postMessage({ __sm_cmd: 'checks', checks, files, token }, '*');
    });
  }

  destroy() {
    window.removeEventListener('message', this.listener);
    this.frame.remove();
  }
}

/** Grade a web exercise in a fresh, phone-sized page that nobody sees. */
export async function gradeWeb(ex, files) {
  const preview = new Preview({ offscreen: true });
  document.body.append(preview.frame);
  try {
    await preview.render(files, { assets: ex.assets, api: ex.api, strict: ex.strict });
    const results = await preview.runChecks(checkList(ex), files);
    if (!results) {
      return shapeResults([{ label: 'The page responds', passed: false, detail: 'Your page stopped answering. It may have an infinite loop.' }], { runtimeError: 'Time limit exceeded.', timedOut: true });
    }
    return shapeResults(results, { runtimeError: preview.errors[0] || null });
  } finally {
    preview.destroy();
  }
}

// ---- JavaScript programs with no page (console.log output), in a Web Worker --------------------
const workerSource = `${engineSource}
self.onmessage = function (e) {
  var d = e.data;
  var r = SMEngine.consoleRun(d.code, self, function (c) {
    importScripts(URL.createObjectURL(new Blob([c + '\\n//# sourceURL=student.js'], { type: 'text/javascript' })));
  }, d.stdin);
  self.postMessage(r);
};`;

const MAX_OUTPUT = 20000;

/** Same result shape as runCode for C and Python, so lesson blocks work unchanged. */
export function runConsoleJs(code, stdin = '', timeoutMs = 4000) {
  return new Promise((resolve) => {
    const started = performance.now();
    const url = URL.createObjectURL(new Blob([workerSource], { type: 'text/javascript' }));
    const worker = new Worker(url);
    const done = (extra) => {
      clearTimeout(timer);
      worker.terminate();
      URL.revokeObjectURL(url);
      resolve({ stdout: '', stderr: '', error: null, timedOut: false, initFailed: false, truncated: false, ms: Math.round(performance.now() - started), ...extra });
    };
    const timer = setTimeout(() => done({ error: 'Time limit exceeded.', timedOut: true }), timeoutMs);
    worker.onmessage = (e) => {
      const r = e.data;
      const truncated = r.stdout.length > MAX_OUTPUT;
      done({ stdout: truncated ? r.stdout.slice(0, MAX_OUTPUT) : r.stdout, error: r.error, truncated });
    };
    worker.onerror = (e) => done({ error: e.message || 'The program could not start.', initFailed: false });
    worker.postMessage({ code, stdin });
  });
}
