/* SayMaCoder Python worker (Pyodide = Python compiled to WebAssembly).
 * This Pyodide version only runs inside a MODULE worker (new Worker(url, { type: 'module' })).
 * The runtime is loaded with a dynamic import so that a failure is reported to the app with a
 * readable message instead of a silent worker crash. */
const MAX_OUTPUT = 20000; // characters; stops runaway print loops from eating memory
const indexURL = new URL('../pyodide/', self.location.href).href;

// Deletes everything a program left in its working folder.
const CLEANUP = [
  'import os, shutil',
  'for _n in os.listdir("."):',
  '    try:',
  '        if os.path.isdir(_n) and not os.path.islink(_n):',
  '            shutil.rmtree(_n)',
  '        else:',
  '            os.remove(_n)',
  '    except Exception:',
  '        pass',
].join('\n');

let pyodide = null;
let initPromise = null;

function init() {
  if (!initPromise) {
    initPromise = (async () => {
      const { loadPyodide } = await import(indexURL + 'pyodide.mjs');
      pyodide = await loadPyodide({ indexURL });
      return pyodide;
    })();
  }
  return initPromise;
}

init().then(
  () => self.postMessage({ type: 'ready' }),
  (e) => self.postMessage({ type: 'init-error', message: String((e && e.message) || e) }),
);

self.onmessage = async (ev) => {
  const { type, id, code, stdin } = ev.data;
  if (type !== 'run') return;

  let py;
  try {
    py = await init();
  } catch (e) {
    self.postMessage({ type: 'result', id, error: String((e && e.message) || e) });
    return;
  }

  let total = 0;
  let truncated = false;
  const emit = (text, stream) => {
    if (truncated) return;
    if (total + text.length > MAX_OUTPUT) {
      text = text.slice(0, MAX_OUTPUT - total);
      truncated = true;
      self.postMessage({ type: 'truncated', id });
    }
    total += text.length;
    if (text) self.postMessage({ type: 'chunk', id, stream, text });
  };

  py.setStdout({ batched: (line) => emit(line + '\n', 'out') });
  py.setStderr({ batched: (line) => emit(line + '\n', 'err') });

  const lines = stdin ? stdin.replace(/\r\n/g, '\n').replace(/\n$/, '').split('\n') : [];
  py.setStdin({ stdin: () => (lines.length ? lines.shift() : undefined) });

  // Fresh globals for every run so one program can never affect the next one.
  const globals = py.globals.get('dict')();
  let error = null;
  try {
    await py.runPythonAsync(code, { globals });
  } catch (e) {
    error = String((e && e.message) || e);
  } finally {
    try {
      py.runPython('import sys\nsys.stdout.flush()\nsys.stderr.flush()');
    } catch (_) {
      /* ignore */
    }
    globals.destroy();
    // Files a program created must not leak into the next program (or the next Run of the same one).
    try {
      py.runPython(CLEANUP);
    } catch (_) {
      /* ignore */
    }
  }
  self.postMessage({ type: 'result', id, error });
};
