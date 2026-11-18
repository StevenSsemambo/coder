// Real C++ for the test suite: the "C++ Pro" course (language id "cppfull").
//
// A program is compiled the way the app compiles it: -std=c++17 -O0 -fno-exceptions, stdin handed over as text,
// output captured, and a run limit that kills a program that never ends.
//
// Two back ends:
//  * native (default): the machine's g++ (CI's Ubuntu has it). About 0.5 s per program, compiled in parallel.
//  * wasm: CPP_REAL=wasm uses @yowasp/clang, the same WebAssembly Clang that the app ships. Slow (about 3 s per
//    program, one at a time), so it is for parity checks: `node tests/cpp-parity.mjs`. It needs
//    `npm install --no-save @yowasp/clang@22.0.0-git20542-10`.
// Results of compiling are cached in memory by a hash of the source, so a program that appears twice is built once.
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { cpus, tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { fillTemplate } from '../src/content/blocks.js';

export const FLAGS = ['-std=c++17', '-O0', '-fno-exceptions'];
const RUN_LIMIT_MS = 5000;
const COMPILE_LIMIT_MS = 120000;
const MAX_OUTPUT = 1 << 20;
const here = dirname(fileURLToPath(import.meta.url));

function createBackend(kind) {
  const work = mkdtempSync(join(tmpdir(), 'saymacoder-cpp-'));
  const slots = kind === 'wasm' ? 1 : Math.max(1, Number(process.env.CPP_REAL_JOBS) || cpus().length);
  let busy = 0;
  const waiting = [];
  const acquire = () => new Promise((resolve) => { if (busy < slots) { busy += 1; resolve(); } else waiting.push(resolve); });
  const release = () => { const next = waiting.shift(); if (next) next(); else busy -= 1; };
  const builds = new Map(); // hash -> Promise<{ ok, file, error }>
  let counter = 0;
  let wasmApi = null;

  const sh = (cmd, args, { input, limit }) => new Promise((resolve) => {
    const child = spawn(cmd, args, { stdio: ['pipe', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    let timedOut = false;
    const timer = setTimeout(() => { timedOut = true; child.kill('SIGKILL'); }, limit);
    child.stdout.on('data', (d) => { if (stdout.length < MAX_OUTPUT) stdout += d; else child.kill('SIGKILL'); });
    child.stderr.on('data', (d) => { if (stderr.length < MAX_OUTPUT) stderr += d; });
    child.on('error', (e) => { clearTimeout(timer); resolve({ stdout, stderr: String(e.message), code: -1, timedOut }); });
    child.on('close', (code, signal) => { clearTimeout(timer); resolve({ stdout, stderr, code, signal, timedOut }); });
    child.stdin.on('error', () => { /* the program may exit before reading its input */ });
    child.stdin.end(input ?? '');
  });

  async function build(code) {
    const id = counter++;
    if (kind === 'native') {
      const src = join(work, `p${id}.cc`);
      const exe = join(work, `p${id}.out`);
      writeFileSync(src, code);
      const r = await sh('g++', [...FLAGS, '-o', exe, src], { limit: COMPILE_LIMIT_MS });
      return r.code === 0 && !r.timedOut ? { ok: true, file: exe } : { ok: false, error: r.stderr || 'the compiler did not finish' };
    }
    if (!wasmApi) {
      try { wasmApi = await import('@yowasp/clang'); } catch { throw new Error('CPP_REAL=wasm needs: npm install --no-save @yowasp/clang@22.0.0-git20542-10'); }
    }
    let err = '';
    const dec = new TextDecoder();
    try {
      const out = await wasmApi.runClang(['clang++', ...FLAGS, 'main.cc', '-o', 'main.wasm'], { 'main.cc': code }, { stderr: (b) => { if (b) err += dec.decode(b, { stream: true }); }, stdout: () => {} });
      const file = join(work, `p${id}.wasm`);
      writeFileSync(file, out['main.wasm']);
      return { ok: true, file };
    } catch (e) {
      return { ok: false, error: err || String(e && e.message || e) };
    }
  }

  function compile(code) {
    const key = createHash('sha1').update(code).digest('hex');
    if (!builds.has(key)) {
      builds.set(key, (async () => {
        await acquire();
        try { return await build(code); } finally { release(); }
      })());
    }
    return builds.get(key);
  }

  return {
    kind,
    prefetch: (codes) => Promise.all([...new Set(codes)].map(compile)),
    async run(code, stdin = '') {
      const built = await compile(code);
      if (!built.ok) return { stdout: '', error: 'compile error: ' + built.error.split('\n').slice(0, 6).join('\n'), timedOut: false };
      const r = kind === 'native'
        ? await sh(built.file, [], { input: stdin, limit: RUN_LIMIT_MS })
        : await sh(process.execPath, [join(here, 'realcpp-wasm-run.mjs'), built.file], { input: stdin, limit: RUN_LIMIT_MS });
      if (r.timedOut) return { stdout: r.stdout, error: 'Time limit exceeded.', timedOut: true };
      if (r.code !== 0) return { stdout: r.stdout, error: `the program stopped (${r.signal || 'exit code ' + r.code})${r.stderr ? ': ' + r.stderr.split('\n')[0] : ''}`, timedOut: false };
      return { stdout: r.stdout, error: null, timedOut: false };
    },
    close() { rmSync(work, { recursive: true, force: true }); },
  };
}

let backend = null;
const get = () => backend || (backend = createBackend(process.env.CPP_REAL === 'wasm' ? 'wasm' : 'native'));

export const runRealCpp = (code, stdin) => get().run(code, stdin);
export const prefetchRealCpp = (codes) => get().prefetch(codes);
export const realCppBackend = () => get().kind;
export function closeRealCpp() { if (backend) { backend.close(); backend = null; } }
export { createBackend };

/** Every program a "cppfull" course will run, so they can all be compiled in parallel before the checks start. */
export function collectPrograms(courses, solutions = {}) {
  const codes = [];
  for (const course of courses) {
    if (course.language !== 'cppfull') continue;
    for (const lesson of course.lessons) {
      for (const b of lesson.blocks) {
        if (b.code) codes.push(b.code);
        if (b.fixed) codes.push(b.fixed);
        if (b.t === 'fill') {
          codes.push(fillTemplate(b));
          for (const [i, blank] of b.blanks.entries()) {
            for (const option of blank.options.filter((o) => o !== blank.answer)) {
              const answers = b.blanks.map((x) => x.answer);
              answers[i] = option;
              codes.push(fillTemplate(b, answers));
            }
          }
        }
        if (b.t === 'mistakes') for (const m of b.items) { codes.push(m.right); if (!m.logic) codes.push(m.wrong); }
      }
      for (const ex of lesson.exercises || []) {
        if (ex.starter) codes.push(ex.starter);
        if (solutions[ex.id]) codes.push(solutions[ex.id]);
      }
    }
  }
  return codes;
}
