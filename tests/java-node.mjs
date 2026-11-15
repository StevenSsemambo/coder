// Java in Node for the test suite (Java track). Same preparation, same worker and same engine as the app.
//  - the program runs in a worker thread that is killed when it runs past its time limit (like the browser does)
//  - results are cached on disk, keyed by the source and by a hash of the engine files, so a program that did not
//    change is not built again (a build takes 1 to 8 seconds). Set JAVA_NO_CACHE=1 to ignore the cache.
import { Worker } from 'node:worker_threads';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { normalizeJava, javaRunInfo } from '../src/lib/javasource.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..').replace(/\\/g, '/');
const CACHE_FILE = join(root, 'node_modules/.cache/saymacoder-java-results.json');
const RUN_LIMIT_MS = 8000; // same as the app's default for a running program
const BUILD_LIMIT_MS = 90000; // same allowance the app gives the build

const engineHash = createHash('sha256')
  .update(['public/java/engine.js', 'public/workers/java.worker.js', 'src/lib/javasource.js'].map((f) => readFileSync(join(root, f))).join('\u0000'))
  .digest('hex')
  .slice(0, 16);

let cache = {};
const useCache = !process.env.JAVA_NO_CACHE;
if (useCache && existsSync(CACHE_FILE)) {
  try {
    const saved = JSON.parse(readFileSync(CACHE_FILE, 'utf8'));
    if (saved.engine === engineHash) cache = saved.results;
  } catch { /* a bad cache is just ignored */ }
}
let dirty = 0;
export function saveJavaCache() {
  if (!useCache || !dirty) return;
  mkdirSync(dirname(CACHE_FILE), { recursive: true });
  writeFileSync(CACHE_FILE, JSON.stringify({ engine: engineHash, results: cache }));
  dirty = 0;
}

let worker = null;
let ready = null;
let nextId = 1;
export const javaStats = { built: 0, cached: 0, restarts: 0 };

function start() {
  if (worker) return ready;
  worker = new Worker(join(root, 'tests/java-node-worker.mjs'), { workerData: { root } });
  ready = new Promise((resolve) => {
    const onMessage = (m) => {
      if (m.type === 'ready') { worker.off('message', onMessage); resolve({ ok: true }); }
      else if (m.type === 'init-error') { worker.off('message', onMessage); resolve({ ok: false, message: m.message }); }
    };
    worker.on('message', onMessage);
    worker.on('error', (e) => resolve({ ok: false, message: String(e.message || e) }));
  });
  return ready;
}
function kill() {
  if (worker) worker.terminate();
  worker = null;
  ready = null;
  javaStats.restarts += 1;
}

/** Same result shape as the app's runCode: { stdout, stderr, error, timedOut }. */
export async function runJava(source, stdin = '') {
  const code = normalizeJava(source);
  const info = javaRunInfo(code);
  const key = createHash('sha256').update(JSON.stringify([info, code, stdin])).digest('hex');
  if (useCache && cache[key]) { javaStats.cached += 1; return cache[key]; }

  const init = await start();
  if (!init.ok) return { stdout: '', stderr: '', error: init.message, timedOut: false, initFailed: true };

  const id = nextId++;
  const result = await new Promise((resolve) => {
    let stdout = '';
    let stderr = '';
    let timer;
    const done = (extra) => { clearTimeout(timer); worker?.off('message', onMessage); resolve({ stdout, stderr, error: null, timedOut: false, ...extra }); };
    const arm = (ms) => { clearTimeout(timer); timer = setTimeout(() => { kill(); done({ error: 'Time limit exceeded.', timedOut: true }); }, ms); };
    const onMessage = (m) => {
      if (m.id !== id) return;
      if (m.type === 'phase') arm(RUN_LIMIT_MS);
      else if (m.type === 'chunk') { if (m.stream === 'err') stderr += m.text; else stdout += m.text; }
      else if (m.type === 'result') done({ error: m.error || null });
    };
    worker.on('message', onMessage);
    arm(BUILD_LIMIT_MS);
    worker.postMessage({ type: 'run', id, code, stdin, mainClass: info.mainClass, fileName: info.fileName });
  });
  javaStats.built += 1;
  if (!result.timedOut && !result.initFailed) { cache[key] = result; dirty += 1; if (dirty >= 25) saveJavaCache(); }
  return result;
}

export function closeJava() {
  saveJavaCache();
  if (worker) worker.terminate();
  worker = null;
}
