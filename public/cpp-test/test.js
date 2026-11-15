// C++ phone test page. See docs/CPP-TRACK.md ("Phone test") for what it measures and what the numbers mean.

const VERSION = '22.0.0-git20542-10';
const SOURCES = {
  unpkg: `https://unpkg.com/@yowasp/clang@${VERSION}/gen/`,
  jsdelivr: `https://cdn.jsdelivr.net/npm/@yowasp/clang@${VERSION}/gen/`,
};
const EXPECTED_TOTAL_BYTES = 105.3e6;
const COMPILE_SLOW_MS = 20000; // a compile slower than this is "too slow for a lesson"
const INIT_TIMEOUT_MS = 8 * 60 * 1000;
const COMPILE_TIMEOUT_MS = 3 * 60 * 1000;
const FLAGS = ['-std=c++17', '-O0', '-fno-exceptions'];

const PROGRAMS = [
  {
    id: 'hello',
    title: 'Hello, world (iostream)',
    source: '#include <iostream>\nint main() {\n    std::cout << "Hello from real C++!" << std::endl;\n}\n',
    expect: 'Hello from real C++!\n',
  },
  {
    id: 'rich1',
    title: 'string, vector, class, auto',
    source: `#include <iostream>
#include <string>
#include <vector>
using namespace std;

class Item {
    string name;
    int price;
public:
    Item(string n, int p) : name(n), price(p) {}
    int cost() const { return price; }
    string label() const { return name; }
};

int main() {
    vector<Item> items;
    items.push_back(Item("Rolex", 3000));
    items.push_back(Item("Chapati", 1000));
    items.push_back(Item("Soda", 1500));
    int total = 0;
    for (auto &it : items) {
        total += it.cost();
        cout << it.label() << ": " << it.cost() << endl;
    }
    cout << "Total: " << total << endl;
}
`,
    expect: 'Rolex: 3000\nChapati: 1000\nSoda: 1500\nTotal: 5500\n',
  },
  {
    id: 'rich2',
    title: 'inheritance, virtual, template, lambda, map, cin',
    stdin: '7 35\n',
    source: `#include <iostream>
#include <algorithm>
#include <map>
#include <string>
#include <vector>
using namespace std;

struct Shape {
    virtual ~Shape() {}
    virtual double area() const = 0;
    virtual string name() const = 0;
};
struct Rect : Shape {
    double w, h;
    Rect(double w, double h) : w(w), h(h) {}
    double area() const override { return w * h; }
    string name() const override { return "Rectangle"; }
};
struct Circle : Shape {
    double r;
    Circle(double r) : r(r) {}
    double area() const override { return 3.14159 * r * r; }
    string name() const override { return "Circle"; }
};
template <typename T>
T biggest(const vector<T>& v) {
    T b = v[0];
    for (const T& x : v) if (x > b) b = x;
    return b;
}

int main() {
    int a, b;
    cin >> a >> b;
    cout << "Sum: " << a + b << endl;
    vector<Shape*> shapes;
    shapes.push_back(new Rect(3, 4));
    shapes.push_back(new Circle(2));
    for (Shape* s : shapes) cout << s->name() << " " << s->area() << endl;
    vector<int> v = {5, 3, 9, 1};
    sort(v.begin(), v.end(), [](int x, int y) { return x > y; });
    for (int x : v) cout << x << " ";
    cout << endl;
    cout << "Biggest: " << biggest(v) << endl;
    map<string, int> stock;
    stock["rolex"] = 12;
    stock["tea"] = 7;
    for (auto &kv : stock) cout << kv.first << "=" << kv.second << endl;
    for (Shape* s : shapes) delete s;
}
`,
    expect: 'Sum: 42\nRectangle 12\nCircle 12.5664\n9 5 3 1 \nBiggest: 9\nrolex=12\ntea=7\n',
  },
  {
    id: 'error',
    title: 'A mistake in the code (missing semicolon)',
    source: '#include <iostream>\nint main() {\n    int x = 5\n    std::cout << x;\n}\n',
    mustFail: true,
    expectInError: 'expected',
  },
  {
    id: 'runaway',
    title: 'A program that never ends (must be stopped)',
    source: 'int main() {\n    volatile int n = 0;\n    while (true) { n = n + 1; }\n}\n',
    timeoutMs: 3000,
    mustBeStopped: true,
  },
];

// ---------------------------------------------------------------------------------------------------------------

const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search);
const state = { results: [], steps: {}, running: false, compiler: null, started: '', online: true };
// The two worker scripts are read once and kept in memory, so that "Run again" still works when the network is off.
const workerSource = {};
async function loadWorkerSources() {
  for (const name of ['compiler-worker.js', 'runner-worker.js']) {
    if (workerSource[name]) continue;
    const res = await fetch(name);
    if (!res.ok) throw new Error('Could not load ' + name + ' (HTTP ' + res.status + ')');
    workerSource[name] = await res.text();
  }
}
function workerUrl(name) {
  return workerSource[name] ? URL.createObjectURL(new Blob([workerSource[name]], { type: 'text/javascript' })) : name;
}
const STATE_KEY = 'cppPhoneTestState';

function mb(bytes) { return (bytes / 1e6).toFixed(1) + ' MB'; }
function secs(ms) { return (ms / 1000).toFixed(1) + ' s'; }

function deviceInfo() {
  const nav = navigator;
  const c = nav.connection || {};
  return {
    userAgent: nav.userAgent,
    memoryGB: nav.deviceMemory || 'unknown',
    cores: nav.hardwareConcurrency || 'unknown',
    screen: `${screen.width}x${screen.height} @${window.devicePixelRatio}x`,
    network: c.effectiveType ? `${c.effectiveType}${c.saveData ? ' (data saver)' : ''}` : 'unknown',
    moduleWorkers: (() => { try { return typeof Worker !== 'undefined'; } catch { return false; } })(),
    wasm: typeof WebAssembly === 'object',
    secureContext: window.isSecureContext,
    cacheStorage: 'caches' in window,
  };
}

async function storageInfo() {
  try {
    const e = await navigator.storage.estimate();
    return { usage: e.usage || 0, quota: e.quota || 0 };
  } catch { return { usage: 0, quota: 0 }; }
}

function renderDevice() {
  const d = deviceInfo();
  $('device').textContent = [
    `Browser: ${d.userAgent}`,
    `Memory: ${d.memoryGB} GB (the browser may round this), CPU cores: ${d.cores}`,
    `Screen: ${d.screen}, network: ${d.network}`,
    `Secure page: ${d.secureContext ? 'yes' : 'NO (storage will not work)'}, Cache Storage: ${d.cacheStorage ? 'yes' : 'NO'}, WebAssembly: ${d.wasm ? 'yes' : 'NO'}`,
  ].join('\n');
}

// ---- steps ----------------------------------------------------------------------------------------------------

const STEP_LIST = [
  { id: 'init', title: 'Download and start the compiler' },
  ...PROGRAMS.map((p) => ({ id: p.id, title: p.title })),
];

function buildSteps() {
  const ol = $('steps');
  ol.innerHTML = '';
  for (const s of STEP_LIST) {
    const li = document.createElement('li');
    li.className = 'step';
    li.innerHTML = `<div><span class="st" id="st-${s.id}">&#9675;</span><strong>${s.title}</strong> <span class="muted" id="tm-${s.id}"></span></div><div class="detail" id="dt-${s.id}"></div><div class="bar" id="bar-${s.id}" hidden><div></div></div>`;
    ol.appendChild(li);
  }
}

function setStep(id, status, detail, ms) {
  const icon = { wait: '\u25CB', run: '\u23F3', ok: '\u2705', fail: '\u274C', warn: '\u26A0\uFE0F' }[status];
  $('st-' + id).textContent = icon;
  if (detail !== undefined) $('dt-' + id).textContent = detail;
  if (ms !== undefined) $('tm-' + id).textContent = secs(ms);
}

function setBar(id, fraction) {
  const bar = $('bar-' + id);
  bar.hidden = fraction === null;
  if (fraction !== null) bar.firstElementChild.style.width = Math.min(100, Math.round(fraction * 100)) + '%';
}

// ---- workers --------------------------------------------------------------------------------------------------

function startCompiler() {
  if (state.compiler) { state.compiler.worker.terminate(); state.compiler = null; }
  const worker = new Worker(workerUrl('compiler-worker.js'), { type: 'module' });
  const c = { worker, pending: new Map(), nextId: 1, downloaded: {}, onProgress: null };
  worker.addEventListener('message', (e) => {
    const m = e.data;
    if (m.type === 'progress') {
      c.downloaded[m.name] = m.loaded;
      if (c.onProgress) c.onProgress(Object.values(c.downloaded).reduce((a, b) => a + b, 0), m.name);
      return;
    }
    const key = m.type === 'init-done' ? 'init' : m.id;
    const p = c.pending.get(key);
    if (!p) return;
    c.pending.delete(key);
    if (m.type === 'error') p.reject(new Error(m.message)); else p.resolve(m);
  });
  worker.addEventListener('error', (e) => {
    const err = new Error('The compiler worker stopped: ' + (e.message || 'unknown error (the browser may have run out of memory)'));
    for (const p of c.pending.values()) p.reject(err);
    c.pending.clear();
  });
  state.compiler = c;
  return c;
}

function callCompiler(msg, timeoutMs) {
  const c = state.compiler;
  return new Promise((resolve, reject) => {
    const key = msg.cmd === 'init' ? 'init' : c.nextId++;
    const timer = setTimeout(() => {
      if (c.pending.delete(key)) reject(new Error('Timed out after ' + secs(timeoutMs) + ' with no answer from the compiler'));
    }, timeoutMs);
    const done = (fn) => (v) => { clearTimeout(timer); fn(v); };
    c.pending.set(key, { resolve: done(resolve), reject: done(reject) });
    c.worker.postMessage({ ...msg, id: key });
  });
}

function runProgram(wasm, stdin, timeoutMs) {
  return new Promise((resolve) => {
    const worker = new Worker(workerUrl('runner-worker.js'));
    let finished = false;
    // While the program runs, check that this page stays responsive (a stuck program must not freeze the app).
    let maxGap = 0;
    let last = performance.now();
    const probe = setInterval(() => { const now = performance.now(); maxGap = Math.max(maxGap, now - last - 100); last = now; }, 100);
    const finish = (r) => { if (finished) return; finished = true; clearInterval(probe); clearTimeout(timer); worker.terminate(); resolve({ ...r, maxGap: Math.round(maxGap) }); };
    const timer = setTimeout(() => finish({ timedOut: true, ms: timeoutMs }), timeoutMs);
    worker.onmessage = (e) => finish(e.data);
    worker.onerror = (e) => finish({ ok: false, message: e.message || 'runner error', ms: 0 });
    worker.postMessage({ wasm, stdin }, [wasm]);
  });
}

// ---- the test -------------------------------------------------------------------------------------------------

function baseUrl() {
  const choice = $('source').value;
  let base = choice === 'custom' ? $('custom').value.trim() : SOURCES[choice];
  if (base && !base.endsWith('/')) base += '/';
  return base;
}

async function runAll() {
  if (state.running) return;
  state.running = true;
  state.results = [];
  state.online = navigator.onLine;
  state.started = new Date().toISOString();
  ['run', 'again', 'clear', 'copy'].forEach((id) => { $(id).disabled = true; });
  $('verdict').textContent = 'Running...';
  $('verdict').className = 'verdict muted';
  $('verdictWhy').textContent = '';
  $('report').value = '';
  buildSteps();
  for (const s of STEP_LIST) setStep(s.id, 'wait', '');
  await loadWorkerSources();
  const storageBefore = await storageInfo();
  const base = baseUrl();
  const out = { base, online: state.online, startedAt: state.started, steps: {} };

  const mark = (step) => localStorage.setItem(STATE_KEY, JSON.stringify({ running: true, step, at: Date.now(), base }));
  try {
    // 1. download and start
    mark('init');
    setStep('init', 'run', state.online ? 'Downloading...' : 'You are offline, using the saved compiler...');
    setBar('init', 0);
    let compiler;
    try {
      compiler = startCompiler();
    } catch (e) {
      throw new Error('This browser cannot run module workers: ' + e.message);
    }
    compiler.onProgress = (total, name) => {
      setBar('init', total / EXPECTED_TOTAL_BYTES);
      $('dt-init').textContent = `Downloading ${name}... ${mb(total)} of about ${mb(EXPECTED_TOTAL_BYTES)}`;
    };
    const init = await callCompiler({ cmd: 'init', base }, INIT_TIMEOUT_MS);
    setBar('init', null);
    const fileLines = Object.entries(init.files).map(([n, f]) => `${n}: ${mb(f.bytes)} from ${f.from}${f.from === 'network' ? ` in ${secs(f.ms)}${f.stored ? ', saved' : ', NOT saved (' + (f.error || 'cache unavailable') + ')'}` : ''}`);
    const storageAfter = await storageInfo();
    const fromNetwork = Object.values(init.files).some((f) => f.from === 'network');
    const allSaved = Object.values(init.files).every((f) => f.from === 'cache' || f.stored);
    out.steps.init = { ms: init.ms, importMs: init.importMs, version: init.version, files: init.files, savedForOffline: allSaved, storageUsedMB: Math.round(((storageAfter.usage - storageBefore.usage) / 1e6) * 10) / 10, storageQuotaMB: Math.round(storageAfter.quota / 1e6) };
    setStep('init', 'ok', `${init.version}\n${fileLines.join('\n')}\n${fromNetwork ? 'First start (downloaded)' : 'Started from the saved copy, no download'}. Saved for offline use: ${allSaved ? 'yes' : 'NO'}. Phone storage quota: about ${out.steps.init.storageQuotaMB} MB.`, init.ms);

    // 2. the programs
    for (const p of PROGRAMS) {
      mark(p.id);
      setStep(p.id, 'run', 'Compiling...');
      const r = { id: p.id, title: p.title };
      out.steps[p.id] = r;
      const t = await callCompiler({ cmd: 'compile', source: p.source, args: FLAGS }, COMPILE_TIMEOUT_MS);
      r.compileMs = t.ms;
      if (!t.ok) {
        r.compileFailed = true;
        r.compilerMessage = t.stderr.split('\n').slice(0, 4).join('\n');
        if (p.mustFail) {
          const good = !p.expectInError || t.stderr.includes(p.expectInError);
          r.pass = good;
          setStep(p.id, good ? 'ok' : 'fail', `The compiler found the mistake, as it should (${secs(t.ms)}).\n${r.compilerMessage}`, t.ms);
        } else {
          r.pass = false;
          setStep(p.id, 'fail', 'Compile failed:\n' + t.stderr.slice(0, 600), t.ms);
        }
        continue;
      }
      if (p.mustFail) { r.pass = false; setStep(p.id, 'fail', 'It should have been rejected, but it compiled.', t.ms); continue; }
      r.wasmKB = Math.round(t.size / 1024);
      setStep(p.id, 'run', `Compiled in ${secs(t.ms)} (${r.wasmKB} KB). Running...`);
      const run = await runProgram(t.wasm, p.stdin || '', p.timeoutMs || 20000);
      r.runMs = run.ms;
      r.pageGapMs = run.maxGap;
      if (p.mustBeStopped) {
        r.stopped = !!run.timedOut;
        r.pass = r.stopped && run.maxGap < 1500;
        setStep(p.id, r.pass ? 'ok' : 'fail', r.stopped ? `Stopped after ${secs(p.timeoutMs)} as planned. The page stayed responsive (longest freeze ${run.maxGap} ms). Compile ${secs(t.ms)}.` : 'The program ended by itself, which it should not.', t.ms);
        continue;
      }
      if (run.timedOut) { r.pass = false; setStep(p.id, 'fail', 'The program ran for more than 20 s.', t.ms); continue; }
      if (!run.ok) { r.pass = false; setStep(p.id, 'fail', 'Run failed: ' + run.message, t.ms); continue; }
      r.pass = run.stdout === p.expect;
      r.stubbed = run.stubbed;
      setStep(p.id, r.pass ? 'ok' : 'fail', `${r.pass ? 'Output correct' : 'WRONG OUTPUT'}. Compile ${secs(t.ms)}, run ${run.ms} ms.${run.stubbed.length ? ' Unsupported system calls used: ' + run.stubbed.join(', ') : ''}${r.pass ? '' : '\nGot: ' + JSON.stringify(run.stdout) + '\nWanted: ' + JSON.stringify(p.expect)}`, t.ms);
    }
  } catch (e) {
    out.fatal = String(e.message || e);
    const failing = STEP_LIST.find((s) => $('st-' + s.id).textContent === '\u23F3');
    if (failing) setStep(failing.id, 'fail', out.fatal);
  }

  localStorage.setItem(STATE_KEY, JSON.stringify({ running: false }));
  finish(out);
}

function finish(out) {
  const compileTimes = PROGRAMS.map((p) => out.steps[p.id] && out.steps[p.id].compileMs).filter((n) => typeof n === 'number');
  const slowest = compileTimes.length ? Math.max(...compileTimes) : 0;
  const allPass = !out.fatal && PROGRAMS.every((p) => out.steps[p.id] && out.steps[p.id].pass);
  let verdict, why;
  if (!allPass) {
    verdict = 'FAILED'; why = out.fatal ? out.fatal : 'At least one step did not pass. See the steps above.';
  } else if (slowest > COMPILE_SLOW_MS) {
    verdict = 'WORKS BUT SLOW'; why = `Everything passed, but the slowest compile took ${secs(slowest)} (a lesson needs under ${secs(COMPILE_SLOW_MS)}).`;
  } else {
    verdict = 'GOOD'; why = `Everything passed. Slowest compile ${secs(slowest)}. Start-up ${out.steps.init ? secs(out.steps.init.ms) : '?'}.`;
  }
  out.verdict = verdict;
  $('verdict').textContent = verdict;
  $('verdict').className = 'verdict ' + (verdict === 'GOOD' ? 'ok' : verdict === 'FAILED' ? 'fail' : 'warn');
  $('verdictWhy').textContent = why;
  const lines = [
    'C++ PHONE TEST RESULT',
    `Verdict: ${verdict}`,
    `When: ${out.startedAt}   Online during test: ${out.online}`,
    `Compiler source: ${out.base}`,
    `Device: ${deviceInfo().userAgent}`,
    `Memory: ${deviceInfo().memoryGB} GB, cores: ${deviceInfo().cores}, screen ${deviceInfo().screen}, network ${deviceInfo().network}`,
  ];
  if (out.steps.init) {
    const i = out.steps.init;
    lines.push(`Start-up: ${secs(i.ms)} (import ${secs(i.importMs)}), saved for offline: ${i.savedForOffline}, storage used ${i.storageUsedMB} MB of quota ${i.storageQuotaMB} MB`);
    for (const [n, f] of Object.entries(i.files)) lines.push(`  file ${n}: ${mb(f.bytes)} ${f.from}${f.ms ? ' ' + secs(f.ms) : ''}${f.error ? ' CACHE ERROR ' + f.error : ''}`);
  }
  for (const p of PROGRAMS) {
    const r = out.steps[p.id];
    if (!r) { lines.push(`${p.id}: not reached`); continue; }
    lines.push(`${p.id}: ${r.pass ? 'PASS' : 'FAIL'}, compile ${r.compileMs !== undefined ? secs(r.compileMs) : '-'}, run ${r.runMs !== undefined ? r.runMs + ' ms' : '-'}${r.wasmKB ? ', ' + r.wasmKB + ' KB' : ''}${r.pageGapMs !== undefined ? ', longest page freeze ' + r.pageGapMs + ' ms' : ''}${r.compilerMessage ? '\n  message: ' + r.compilerMessage.replace(/\n/g, ' | ') : ''}`);
  }
  if (out.fatal) lines.push('Stopped with: ' + out.fatal);
  $('report').value = lines.join('\n');
  window.__result = { out, report: lines.join('\n') };
  state.running = false;
  ['run', 'again', 'clear', 'copy'].forEach((id) => { $(id).disabled = false; });
  $('run').textContent = 'Run the test again';
}

// ---- wiring ---------------------------------------------------------------------------------------------------

async function clearSaved() {
  try {
    const removed = await caches.delete('cpp-compiler-test-v1');
    alert(removed ? 'The saved compiler was deleted. The next run downloads it again.' : 'Nothing was saved.');
  } catch (e) { alert('Could not delete: ' + e.message); }
}

async function copyReport() {
  const el = $('report');
  el.select();
  try { await navigator.clipboard.writeText(el.value); $('copy').textContent = 'Copied'; }
  catch { document.execCommand('copy'); $('copy').textContent = 'Copied (or select and copy by hand)'; }
  setTimeout(() => { $('copy').textContent = 'Copy results'; }, 2500);
}

function init() {
  renderDevice();
  buildSteps();
  $('source').addEventListener('change', () => { $('custom').hidden = $('source').value !== 'custom'; });
  if (params.get('base')) { $('source').value = 'custom'; $('custom').hidden = false; $('custom').value = params.get('base'); }
  $('run').addEventListener('click', runAll);
  $('again').addEventListener('click', runAll);
  $('clear').addEventListener('click', clearSaved);
  $('copy').addEventListener('click', copyReport);
  $('again').disabled = true;
  try {
    const last = JSON.parse(localStorage.getItem(STATE_KEY) || '{}');
    if (last.running) {
      const b = $('crashBanner');
      b.hidden = false;
      b.textContent = `The last test did not finish. It stopped at the step "${last.step}", which usually means the browser ran out of memory or was closed. Please tell Claude exactly that, and which phone you used.`;
      localStorage.setItem(STATE_KEY, JSON.stringify({ running: false }));
    }
  } catch { /* ignore */ }
  window.addEventListener('online', () => { state.online = true; });
  window.addEventListener('offline', () => { state.online = false; });
  if (params.get('auto')) runAll();
}

init();
