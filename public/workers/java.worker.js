/* SayMaCoder Java worker.
 * Real Java: OpenJDK javac and the TeaVM compiler, both compiled to WebAssembly, run inside this worker.
 * ../java/engine.js is the engine's own worker file (patched by scripts/prepare-runtimes.mjs). It speaks its own
 * small protocol, so this file translates between that and the one the app uses (ready / chunk / result).
 *
 * The source arrives already prepared on the main thread (src/lib/javasource.js): the %n and "divide by a literal
 * zero" fixes are applied, and the name of the file and of the class that holds main are worked out.
 */
const BASE = self.__JAVA_BASE__ || new URL('../java/', self.location.href).href;
const MAX_OUTPUT = 20000; // characters; stops runaway print loops from eating memory

const realPost = self.postMessage.bind(self);
let waiter = null; // resolves with the engine's next reply
let current = null; // id of the job that is running

// The engine talks to us by calling self.postMessage; intercept those calls.
self.postMessage = (m) => {
  if (m && m.type === 'phase') {
    if (current !== null) realPost({ type: 'phase', id: current, phase: m.phase });
    return;
  }
  if (m && (m.type === 'initialized' || m.type === 'init-error' || m.type === 'result') && waiter) {
    const resolve = waiter;
    waiter = null;
    resolve(m);
    return;
  }
  realPost(m);
};

// ---- Reports -----------------------------------------------------------------------------------------------
// The engine reports an exception that ends the program as a JavaScript error: the Java message plus a stack in which
// the exception's own constructors show its class. Write it the way real Java does:
//   Exception in thread "main" java.lang.IllegalStateException: boom
//       at Main.main(Main.java)
// A few failures are "traps" in WebAssembly (they cannot be caught by Java code here); they are named after the Java
// exception they stand for.
const TRAPS = [
  [/dereferencing a null pointer/, 'java.lang.NullPointerException'],
  [/array element access out of bounds/, 'java.lang.ArrayIndexOutOfBoundsException'],
  [/Maximum call stack size exceeded/, 'java.lang.StackOverflowError'],
  [/^divide by zero$/, 'java.lang.ArithmeticException: / by zero'],
];
globalThis.__javaFormatError = (b) => {
  const message = String((b && b.message) || b);
  const stack = String((b && b.stack) || '');
  const frames = [...stack.matchAll(/^\s+at ([^\s(]+)/gm)].map((m) => m[1]);
  let head = null;
  let skip = 0;
  if (frames.some((f) => /Throwable::fillInStackTrace$/.test(f))) {
    let cls = null;
    for (const f of frames) {
      skip += 1;
      if (f === 'decorateException' || /::fillInStackTrace/.test(f)) continue;
      if (/::<init>/.test(f)) cls = f.split('::')[0];
      else { skip -= 1; break; }
    }
    if (cls) head = message && message !== cls ? `${cls}: ${message}` : cls;
  } else {
    const trap = TRAPS.find(([re]) => re.test(message));
    if (trap) head = trap[1];
  }
  if (!head) return message;
  const file = globalThis.__javaFile || 'Main.java';
  const where = [];
  for (const f of frames.slice(skip)) {
    if (/@|^teavm/.test(f)) continue;
    if (/^(org\.teavm|java\.|jdk\.|javax\.)/.test(f)) { if (/^org\.teavm/.test(f)) break; continue; }
    const line = `\tat ${f.replace('::', '.')}(${file})`;
    if (where[where.length - 1] !== line) where.push(line);
  }
  return `Exception in thread "main" ${head}${where.length ? `\n${where.join('\n')}` : ''}`;
};

// javac messages as a student would see them on a laptop: "Main.java:3: error: ...", simple type names, each error once.
function tidyDiagnostics(text) {
  if (!/^[\w$]+\.java:\d+: /m.test(text)) return text;
  const blocks = text.split(/\n(?=[\w$]+\.java:\d+: )/);
  const seen = new Set();
  return blocks
    .map((block) => block.replace(/^([\w$]+\.java:\d+): /, '$1: error: ').replace(/\bjava\.(?:lang|util|io)\.([A-Z]\w*)/g, '$1'))
    .filter((block) => (seen.has(block) ? false : seen.add(block)))
    .join('\n');
}

importScripts(BASE + 'engine.js');
const engine = self.onmessage; // the engine registered its handler during importScripts
const ask = (data) => new Promise((resolve) => { waiter = resolve; engine({ data }); });

const friendly = (e) => {
  const text = String((e && e.message) || e);
  return /fetch|network|load failed|failed to/i.test(text)
    ? 'The Java runtime is not on this phone yet. Open Settings and download it while you have internet.'
    : text;
};

let initPromise = null;
function init() {
  if (!initPromise) {
    initPromise = ask({ cmd: 'init', baseUrl: BASE }).then((reply) => {
      if (reply.type !== 'initialized') throw new Error(reply.error || 'The Java runtime could not start.');
    });
    initPromise.catch(() => { initPromise = null; });
  }
  return initPromise;
}

init().then(
  () => realPost({ type: 'ready' }),
  (e) => realPost({ type: 'init-error', message: friendly(e) }),
);

self.onmessage = async (ev) => {
  const { type, id, code, stdin, mainClass, fileName } = ev.data;
  if (type !== 'run') return;

  try {
    await init();
  } catch (e) {
    realPost({ type: 'result', id, error: friendly(e) });
    return;
  }

  current = id;
  globalThis.__javaFile = fileName || 'Main.java';
  const reply = await ask({ cmd: 'run', source: code, input: stdin || '', mainClass: mainClass || 'Main' });
  current = null;

  // An engine-level failure (reply.error) can leave the compiler in a bad state: start it again before the next run.
  if (reply.error) initPromise = null;

  let out = reply.stdout || '';
  if (out.length > MAX_OUTPUT) {
    out = out.slice(0, MAX_OUTPUT);
    realPost({ type: 'truncated', id });
  }
  if (out) realPost({ type: 'chunk', id, stream: 'out', text: out });

  if (reply.ok) {
    if (reply.stderr) realPost({ type: 'chunk', id, stream: 'err', text: reply.stderr });
    realPost({ type: 'result', id, error: null });
  } else {
    const message = tidyDiagnostics(String(reply.stderr || reply.error || 'The program stopped.').trim());
    realPost({ type: 'result', id, error: message });
  }
};
