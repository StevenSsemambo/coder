// Runs student code in Web Workers so a bad program can never freeze the interface.
// One worker per language. A program that runs past its time limit is stopped.
import { prepareSource } from './csource.js';
import { runConsoleJs } from './webrun.js';

const WORKER_FILES = { python: 'py.worker.js', c: 'c.worker.js' };
export const DEFAULT_TIMEOUT_MS = 8000;

const listeners = new Set();
/** Subscribe to runtime status: { language, state: 'idle'|'loading'|'ready'|'running'|'failed', detail } */
export function onRunnerStatus(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
const emit = (language, state, detail) => listeners.forEach((fn) => fn({ language, state, detail }));

const workerURL = (file) => new URL(`${import.meta.env.BASE_URL}workers/${file}`, document.baseURI).href;

class LanguageRunner {
  constructor(language) {
    this.language = language;
    this.worker = null;
    this.ready = null;
    this.pending = null;
    this.nextId = 1;
    this.queue = Promise.resolve();
  }

  /** Start the worker (and load the runtime). Resolves { ok } and never rejects. */
  start() {
    if (this.worker) return this.ready;
    emit(this.language, 'loading');
    // Python (Pyodide) needs a module worker; the C interpreter is a classic script worker.
    const options = this.language === 'python' ? { type: 'module' } : undefined;
    const worker = new Worker(workerURL(WORKER_FILES[this.language]), options);
    this.worker = worker;
    this.ready = new Promise((resolve) => {
      worker.addEventListener('message', (ev) => {
        const m = ev.data;
        if (m.type === 'ready') {
          emit(this.language, 'ready');
          resolve({ ok: true });
        } else if (m.type === 'init-error') {
          emit(this.language, 'failed', m.message);
          resolve({ ok: false, message: m.message });
          this.kill(false);
        } else if (this.pending && m.id === this.pending.id) {
          this.pending.handle(m);
        }
      });
      worker.addEventListener('error', (e) => {
        emit(this.language, 'failed', e.message);
        resolve({ ok: false, message: e.message || 'The runtime could not start.' });
        this.kill(false);
      });
    });
    return this.ready;
  }

  kill(announce = true) {
    if (this.worker) this.worker.terminate();
    this.worker = null;
    this.ready = null;
    if (announce) emit(this.language, 'idle');
  }

  run(code, stdin, timeoutMs) {
    const job = () => this.#run(code, stdin, timeoutMs);
    const result = this.queue.then(job, job);
    this.queue = result.catch(() => {});
    return result;
  }

  async #run(code, stdin, timeoutMs) {
    const init = await this.start();
    if (!init.ok) {
      return { stdout: '', stderr: '', error: init.message || 'The runtime could not start.', timedOut: false, initFailed: true, truncated: false, ms: 0 };
    }
    const id = this.nextId++;
    emit(this.language, 'running');
    return new Promise((resolve) => {
      let stdout = '';
      let stderr = '';
      let truncated = false;
      const started = performance.now();
      const finish = (extra) => {
        clearTimeout(timer);
        this.pending = null;
        if (this.worker) emit(this.language, 'ready');
        resolve({ stdout, stderr, truncated, error: null, timedOut: false, initFailed: false, ms: Math.round(performance.now() - started), ...extra });
      };
      // The C interpreter enforces its own limit; this timer is the backstop for everything else.
      const backstop = timeoutMs + (this.language === 'c' ? 1500 : 0);
      const timer = setTimeout(() => {
        this.kill();
        finish({ error: 'Time limit exceeded.', timedOut: true });
      }, backstop);
      this.pending = {
        id,
        handle: (m) => {
          if (m.type === 'chunk') {
            if (m.stream === 'err') stderr += m.text;
            else stdout += m.text;
          } else if (m.type === 'truncated') {
            truncated = true;
          } else if (m.type === 'result') {
            finish({ error: m.error || null, timedOut: /Time limit exceeded/i.test(m.error || '') });
          }
        },
      };
      this.worker.postMessage({ type: 'run', id, code, stdin, timeoutMs });
    });
  }
}

const runners = { python: new LanguageRunner('python'), c: new LanguageRunner('c') };

/** Start loading a runtime early (for example while the student reads the lesson). */
export function warmUp(language) {
  runners[language]?.start();
}

/** Run code. Resolves { stdout, stderr, error, timedOut, initFailed, truncated, ms }. */
export function runCode(language, code, stdin = '', { timeoutMs = DEFAULT_TIMEOUT_MS } = {}) {
  // JavaScript with no page: runs in a throw-away worker (console.log becomes the output).
  if (language === 'web') return runConsoleJs(typeof code === 'string' ? code : code.js || '', stdin, Math.min(timeoutMs, 5000));
  return runners[language].run(prepareSource(language, code), stdin, timeoutMs);
}
