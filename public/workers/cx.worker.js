/* SayMaCoder "full C" worker: picoc compiled to WebAssembly (see tools/picoc-wasm/README.md and cxcore.js).
 * Handles structs, unions, enums, typedef, malloc/free and file I/O on an in-memory file system. */
importScripts('cxcore.js');

const MAX_OUTPUT = 20000; // characters
let moduleReady = null;

function load() {
  if (!moduleReady) {
    moduleReady = fetch(new URL('../vendor/picoc.wasm', self.location.href))
      .then((r) => {
        if (!r.ok) throw new Error('picoc.wasm: HTTP ' + r.status);
        return r.arrayBuffer();
      })
      .then((bytes) => WebAssembly.compile(bytes));
  }
  return moduleReady;
}

load().then(
  () => self.postMessage({ type: 'ready' }),
  (e) => self.postMessage({ type: 'init-error', message: String((e && e.message) || e) }),
);

/** picoc reports its own failures as "<source line>\n<caret>\n/main.c:LINE:COL message". */
const PICOC_ERROR = /\/main\.c:\d+:\d+ /;

self.onmessage = async (ev) => {
  const { type, id, code, stdin } = ev.data;
  if (type !== 'run') return;
  let module;
  try {
    module = await load();
  } catch (e) {
    self.postMessage({ type: 'result', id, error: 'The C runtime could not load.' });
    return;
  }
  let total = 0;
  let truncated = false;
  const send = (stream) => (text) => {
    if (truncated) return;
    if (total + text.length > MAX_OUTPUT) {
      text = text.slice(0, MAX_OUTPUT - total);
      truncated = true;
      self.postMessage({ type: 'truncated', id });
    }
    total += text.length;
    if (text) self.postMessage({ type: 'chunk', id, stream, text });
  };
  const r = self.CX.run(module, { source: code, stdin: stdin || '', onStdout: send('out'), onStderr: send('err') });
  let error = null;
  if (r.trap) error = r.trap;
  else if (r.exitCode !== 0 && PICOC_ERROR.test(r.stderr)) error = r.stderr.trim();
  self.postMessage({ type: 'result', id, error });
};
