// Runs student code in Web Workers so a bad program can never freeze the interface.
// One worker per language. A program that runs past its time limit is stopped.
import { prepareSource } from './csource.js';
import { javaRunInfo } from './javasource.js';
import { runConsoleJs } from './webrun.js';

const WORKER_FILES = { python: 'py.worker.js', c: 'c.worker.js', cpp: 'c.worker.js', sql: 'sql.worker.js', php: 'php.worker.js', java: 'java.worker.js' };
export const DEFAULT_TIMEOUT_MS = 8000;
// Java builds the program (javac, then TeaVM) before it runs it. That takes seconds on a phone, so the build gets its
// own, long allowance; the program itself then gets the usual short one (the worker says when the build is over).
const JAVA_BUILD_LIMIT_MS = 90000;

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
    // Python (Pyodide) and PHP (bundled as an ES module) need a module worker; the C interpreter is a classic script worker.
    const options = this.language === 'python' || this.language === 'php' ? { type: 'module' } : undefined;
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

  run(code, stdin, timeoutMs, extra) {
    const job = () => this.#run(code, stdin, timeoutMs, extra);
    const result = this.queue.then(job, job);
    this.queue = result.catch(() => {});
    return result;
  }

  async #run(code, stdin, timeoutMs, extra) {
    const init = await this.start();
    if (!init.ok) {
      return { stdout: '', stderr: '', error: init.message || 'The runtime could not start.', timedOut: false, initFailed: true, truncated: false, ms: 0 };
    }
    const id = this.nextId++;
    emit(this.language, 'running', this.language === 'java' ? 'building' : undefined);
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
      let timer;
      const arm = (ms) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          this.kill();
          finish({ error: 'Time limit exceeded.', timedOut: true });
        }, ms);
      };
      arm(this.language === 'java' ? JAVA_BUILD_LIMIT_MS : timeoutMs + (this.language === 'c' || this.language === 'cpp' ? 1500 : 0));
      this.pending = {
        id,
        handle: (m) => {
          if (m.type === 'chunk') {
            if (m.stream === 'err') stderr += m.text;
            else stdout += m.text;
          } else if (m.type === 'truncated') {
            truncated = true;
          } else if (m.type === 'phase') {
            // Java: the build is over and the program is running now, so the short limit starts here.
            emit(this.language, 'running', 'run');
            arm(timeoutMs);
          } else if (m.type === 'result') {
            finish({ error: m.error || null, timedOut: /Time limit exceeded/i.test(m.error || '') });
          }
        },
      };
      this.worker.postMessage({ type: 'run', id, code, stdin, timeoutMs, ...extra });
    });
  }
}

const runners = { python: new LanguageRunner('python'), c: new LanguageRunner('c'), cpp: new LanguageRunner('cpp'), sql: new LanguageRunner('sql'), php: new LanguageRunner('php'), java: new LanguageRunner('java') };

/** Start loading a runtime early (for example while the student reads the lesson). */
export function warmUp(language) {
  runners[language]?.start();
}

/** Run code. Resolves { stdout, stderr, error, timedOut, initFailed, truncated, ms }. */
export function runCode(language, code, stdin = '', { timeoutMs = DEFAULT_TIMEOUT_MS } = {}) {
  // JavaScript with no page: runs in a throw-away worker (console.log becomes the output).
  if (language === 'web') return runConsoleJs(typeof code === 'string' ? code : code.js || '', stdin, Math.min(timeoutMs, 5000));
  const prepared = prepareSource(language, code);
  return runners[language].run(prepared, stdin, timeoutMs, language === 'java' ? javaRunInfo(prepared) : undefined);
}
